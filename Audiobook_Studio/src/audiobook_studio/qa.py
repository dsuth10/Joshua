"""ASR fidelity and technical audio quality reporting."""

from __future__ import annotations

import json
import math
import os
import re
import shutil
import struct
import subprocess
import wave
from datetime import UTC, datetime
from pathlib import Path
from typing import Literal

from pydantic import Field

from audiobook_studio.audio_validation import inspect_wav
from audiobook_studio.contracts import LoadedProject, ManualApproval, StrictModel
from audiobook_studio.errors import AudiobookError, ExitCode
from audiobook_studio.hashing import sha256_file
from audiobook_studio.mastering import loudness_stats
from audiobook_studio.narration_plan import NarrationPlan
from audiobook_studio.orchestration import RenderState
from audiobook_studio.project_store import atomic_write_bytes, validate_manifest, write_if_changed


class QaError(AudiobookError):
    exit_code = ExitCode.QA_FAILURE


class ChunkQa(StrictModel):
    chunk_id: str
    expected: str
    transcript: str
    wer: float = Field(ge=0)
    passed: bool
    differences: list[str]
    asr_model: str


class QaReport(StrictModel):
    schema_version: Literal[1] = 1
    project_id: str
    created_at: datetime
    status: Literal["qa_pass", "qa_fail", "manual_review"]
    overall_wer: float = Field(ge=0)
    overall_wer_max: float
    chunk_wer_max: float
    chunks: list[ChunkQa]
    technical: dict[str, float | int | bool | str]
    high_risk_differences: list[str]
    manual_approval_required: bool = True


def normalize_asr(text: str) -> list[str]:
    return re.findall(r"[a-z0-9]+(?:'[a-z0-9]+)?", text.lower().replace("’", "'"))


def word_error_rate(expected: str, actual: str) -> tuple[float, list[str]]:
    reference = normalize_asr(expected)
    hypothesis = normalize_asr(actual)
    previous = list(range(len(hypothesis) + 1))
    for index, ref_word in enumerate(reference, start=1):
        current = [index]
        for offset, hyp_word in enumerate(hypothesis, start=1):
            current.append(
                min(
                    current[-1] + 1,
                    previous[offset] + 1,
                    previous[offset - 1] + (ref_word != hyp_word),
                )
            )
        previous = current
    errors = previous[-1]
    differences = (
        []
        if reference == hypothesis
        else [
            f"expected: {' '.join(reference)}",
            f"heard: {' '.join(hypothesis)}",
        ]
    )
    return errors / max(1, len(reference)), differences


def _pcm_peak(path: Path) -> tuple[float, bool]:
    with wave.open(str(path), "rb") as wav:
        width = wav.getsampwidth()
        frames = wav.readframes(wav.getnframes())
    if width != 2:
        raise QaError(f"technical QA currently requires PCM-16 WAV: {path}")
    samples = struct.iter_unpack("<h", frames)
    peak = max((abs(sample[0]) for sample in samples), default=0)
    normalized = peak / 32768
    return normalized, peak >= 32767


def _transcribe(
    project: LoadedProject,
    audio_items: list[tuple[str, Path]],
    *,
    model_id: str | None = None,
) -> dict[str, str]:
    worker_dir = project.workspace_root / "Audiobook_Studio" / "workers" / "whisper"
    executable = worker_dir / ".venv" / "bin" / "python"
    if not executable.is_file():
        raise QaError(f"Whisper worker is not bootstrapped: {executable}")
    request_path = project.project_dir / "qa" / "asr-request.json"
    response_path = project.project_dir / "qa" / "asr-response.json"
    atomic_write_bytes(
        request_path,
        (
            json.dumps(
                {
                    "schema_version": 1,
                    "model_id": model_id or project.config.qa.asr_model,
                    "items": [
                        {"chunk_id": chunk_id, "audio_path": str(path)}
                        for chunk_id, path in audio_items
                    ],
                },
                indent=2,
            )
            + "\n"
        ).encode(),
    )
    result = subprocess.run(
        [
            str(executable),
            str(worker_dir / "worker.py"),
            "--request",
            str(request_path),
            "--response",
            str(response_path),
        ],
        cwd=worker_dir,
        env={
            **os.environ,
            "LD_LIBRARY_PATH": ":".join(
                [
                    str(
                        worker_dir
                        / ".venv"
                        / "lib"
                        / "python3.12"
                        / "site-packages"
                        / "nvidia"
                        / "cublas"
                        / "lib"
                    ),
                    str(
                        worker_dir
                        / ".venv"
                        / "lib"
                        / "python3.12"
                        / "site-packages"
                        / "nvidia"
                        / "cudnn"
                        / "lib"
                    ),
                    os.environ.get("LD_LIBRARY_PATH", ""),
                ]
            ),
        },
        text=True,
        capture_output=True,
    )
    if result.returncode or not response_path.is_file():
        raise QaError(f"Whisper QA failed: {result.stderr[-2000:]}")
    response = json.loads(response_path.read_text(encoding="utf-8"))
    if response.get("status") != "success":
        raise QaError(f"Whisper QA failed: {response.get('error')}")
    return {item["chunk_id"]: item["transcript"] for item in response["items"]}


def run_qa(
    project: LoadedProject,
    *,
    transcripts: dict[str, str] | None = None,
    verification_model: str | None = None,
) -> QaReport:
    plan = NarrationPlan.model_validate_json(
        (project.project_dir / "planning" / "narration-plan.json").read_text(encoding="utf-8")
    )
    state = RenderState.model_validate_json(
        (project.project_dir / "chunks" / "render-state.json").read_text(encoding="utf-8")
    )
    audio_items = [
        (chunk.chunk_id, project.project_dir / str(state.chunks[chunk.chunk_id].mastered_audio))
        for chunk in plan.chunks
    ]
    transcripts = transcripts if transcripts is not None else _transcribe(project, audio_items)
    transcript_models = {chunk_id: project.config.qa.asr_model for chunk_id in transcripts}
    if verification_model:
        failing_items = [
            (chunk.chunk_id, path)
            for chunk, (_, path) in zip(plan.chunks, audio_items, strict=True)
            if word_error_rate(chunk.source_text, transcripts.get(chunk.chunk_id, ""))[0]
            > project.config.qa.chunk_wer_max
        ]
        if failing_items:
            verification = _transcribe(
                project,
                failing_items,
                model_id=verification_model,
            )
            expected_by_id = {chunk.chunk_id: chunk.source_text for chunk in plan.chunks}
            for chunk_id, candidate in verification.items():
                current_wer = word_error_rate(
                    expected_by_id[chunk_id], transcripts.get(chunk_id, "")
                )[0]
                candidate_wer = word_error_rate(expected_by_id[chunk_id], candidate)[0]
                if candidate_wer < current_wer:
                    transcripts[chunk_id] = candidate
                    transcript_models[chunk_id] = verification_model
    chunk_reports: list[ChunkQa] = []
    for chunk in plan.chunks:
        transcript = transcripts.get(chunk.chunk_id, "")
        wer, differences = word_error_rate(chunk.source_text, transcript)
        chunk_reports.append(
            ChunkQa(
                chunk_id=chunk.chunk_id,
                expected=chunk.source_text,
                transcript=transcript,
                wer=wer,
                passed=wer <= project.config.qa.chunk_wer_max,
                differences=differences,
                asr_model=transcript_models.get(chunk.chunk_id, project.config.qa.asr_model),
            )
        )
    expected_all = " ".join(chunk.source_text for chunk in plan.chunks)
    heard_all = " ".join(report.transcript for report in chunk_reports)
    overall_wer, _ = word_error_rate(expected_all, heard_all)
    master = project.project_dir / "output" / "Berani - Ginger Juice - Master.wav"
    metadata = inspect_wav(master)
    peak, clipping = _pcm_peak(master)
    loudness = loudness_stats(
        master, project.config.audio.target_lufs, project.config.audio.true_peak_db
    )
    duration_plausible = 300 <= metadata.duration_seconds <= 540
    expected_words = sum(len(normalize_asr(chunk.source_text)) for chunk in plan.chunks)
    words_per_minute = expected_words / metadata.duration_seconds * 60
    technical_pass = (
        metadata.channels == 1
        and metadata.sample_rate == project.config.audio.output_sample_rate
        and not clipping
        and abs(loudness["integrated_lufs"] - project.config.audio.target_lufs) <= 1
        and loudness["true_peak_dbtp"] <= project.config.audio.true_peak_db
        and duration_plausible
        and abs(words_per_minute - project.config.audio.target_words_per_minute) <= 5
        and math.isfinite(peak)
    )
    high_risk = [
        report.chunk_id for report in chunk_reports if not report.passed or bool(report.differences)
    ]
    automated_pass = (
        overall_wer <= project.config.qa.overall_wer_max
        and all(report.passed for report in chunk_reports)
        and technical_pass
    )
    report = QaReport(
        project_id=project.config.project_id,
        created_at=datetime.now(UTC),
        status="manual_review" if automated_pass else "qa_fail",
        overall_wer=overall_wer,
        overall_wer_max=project.config.qa.overall_wer_max,
        chunk_wer_max=project.config.qa.chunk_wer_max,
        chunks=chunk_reports,
        technical={
            "channels": metadata.channels,
            "sample_rate": metadata.sample_rate,
            "duration_seconds": metadata.duration_seconds,
            "pcm_peak": peak,
            "clipping": clipping,
            "integrated_lufs": loudness["integrated_lufs"],
            "true_peak_dbtp": loudness["true_peak_dbtp"],
            "duration_plausible": duration_plausible,
            "words_per_minute": words_per_minute,
            "passed": technical_pass,
        },
        high_risk_differences=high_risk,
    )
    report_path = project.project_dir / "qa" / "report.json"
    atomic_write_bytes(report_path, (report.model_dump_json(indent=2) + "\n").encode())
    markdown = (
        "# Slice 2 Automated QA\n\n"
        f"- Status: **{report.status}**\n"
        f"- Overall WER: **{report.overall_wer:.2%}** "
        f"(limit {report.overall_wer_max:.2%})\n"
        f"- Technical audio: **{'PASS' if technical_pass else 'FAIL'}**\n"
        f"- Duration: **{metadata.duration_seconds:.1f} seconds**\n"
        f"- Integrated loudness: **{loudness['integrated_lufs']:.1f} LUFS**\n"
        f"- True peak: **{loudness['true_peak_dbtp']:.1f} dBTP**\n"
        f"- Chunks requiring difference review: **{len(high_risk)}**\n\n"
        "Human listening approval remains required before Gate G2 can close.\n"
    )
    atomic_write_bytes(project.project_dir / "qa" / "report.md", markdown.encode())
    return report


def approve_g2_audio(project: LoadedProject, approver: str) -> Path:
    """Freeze the human-approved WAV and record the manual audio decision."""

    report_path = project.project_dir / "qa" / "report.json"
    report = QaReport.model_validate_json(report_path.read_text(encoding="utf-8"))
    if report.status not in {"manual_review", "qa_pass"}:
        raise QaError("automated QA must reach manual_review before audio approval")
    source = project.project_dir / "output" / "Berani - Ginger Juice - Master.wav"
    if not source.is_file():
        raise QaError("WAV master does not exist")
    destination = project.project_dir / "output" / "master" / "Berani - Ginger Juice - Master.wav"
    destination.parent.mkdir(parents=True, exist_ok=True)
    temporary = destination.with_suffix(".partial.wav")
    shutil.copy2(source, temporary)
    temporary.replace(destination)
    if sha256_file(destination) != sha256_file(source):
        raise QaError("approved master copy hash does not match the reviewed WAV")

    approved_report = report.model_copy(update={"status": "qa_pass"})
    atomic_write_bytes(
        report_path,
        (approved_report.model_dump_json(indent=2) + "\n").encode(),
    )
    manifest = validate_manifest(project.project_dir)
    approval = ManualApproval(
        gate="G2-audio",
        decision="approved",
        approved_by=approver,
        approved_at=datetime.now(UTC),
        selection="qwen-designed-clone / Berani - Ginger Juice - Master.wav",
        notes=f"Manual listening PASS; master SHA256 {sha256_file(destination)}",
    )
    approvals = [existing for existing in manifest.approvals if existing.gate != "G2-audio"]
    approvals.append(approval)
    stages = dict(manifest.stages)
    from audiobook_studio.contracts import StageRecord

    stages["qa"] = StageRecord(status="approved", completed_at=datetime.now(UTC))
    updated = manifest.model_copy(
        update={
            "approvals": approvals,
            "stages": stages,
            "outputs": {
                **manifest.outputs,
                "approved_wav_master": ("output/master/Berani - Ginger Juice - Master.wav"),
            },
        }
    )
    write_if_changed(
        project.project_dir / "manifest.json",
        (updated.model_dump_json(indent=2) + "\n").encode(),
    )
    return destination


def close_g2(project: LoadedProject, approver: str) -> None:
    """Close Gate G2 only after audio approval, rights, and delivery packaging."""

    if not project.config.rights.confirmed:
        raise QaError("rights confirmation is required to close Gate G2")
    report = QaReport.model_validate_json(
        (project.project_dir / "qa" / "report.json").read_text(encoding="utf-8")
    )
    if report.status != "qa_pass":
        raise QaError("manual audio approval is required to close Gate G2")
    required = [
        project.project_dir / "output" / "master" / "Berani - Ginger Juice - Master.wav",
        project.project_dir / "output" / "Berani - Ginger Juice.m4b",
        project.project_dir / "output" / "Berani - Ginger Juice.mp3",
        project.project_dir / "output" / "Berani - Ginger Juice.transcript.txt",
    ]
    missing = [str(path) for path in required if not path.is_file()]
    if missing:
        raise QaError(f"delivery outputs are missing: {', '.join(missing)}")
    manifest = validate_manifest(project.project_dir)
    if manifest.stages.get("package") is None or manifest.stages["package"].status != "packaged":
        raise QaError("verified delivery packaging is required to close Gate G2")
    approvals = [approval for approval in manifest.approvals if approval.gate != "G2"]
    approvals.append(
        ManualApproval(
            gate="G2",
            decision="approved",
            approved_by=approver,
            approved_at=datetime.now(UTC),
            selection="Approved Ginger Juice master and verified delivery package",
            notes=(
                "Automated QA PASS; manual listening PASS; rights confirmed; "
                "WAV, M4B, MP3, and transcript verified"
            ),
        )
    )
    updated = manifest.model_copy(update={"approvals": approvals})
    write_if_changed(
        project.project_dir / "manifest.json",
        (updated.model_dump_json(indent=2) + "\n").encode(),
    )
