"""Chapter assembly, delivery encoding, metadata, and rights gate."""

from __future__ import annotations

import shutil
import subprocess
from pathlib import Path

from audiobook_studio.chunking import word_count
from audiobook_studio.contracts import LoadedProject
from audiobook_studio.errors import AudiobookError, ExitCode
from audiobook_studio.hashing import sha256_file
from audiobook_studio.mastering import assemble
from audiobook_studio.narration_plan import NarrationPlan
from audiobook_studio.orchestration import RenderState
from audiobook_studio.project_store import atomic_write_bytes, validate_manifest


class PackagingError(AudiobookError):
    exit_code = ExitCode.APPROVAL_REQUIRED


MASTER_NAME = "Berani - Ginger Juice - Master.wav"
M4B_NAME = "Berani - Ginger Juice.m4b"
MP3_NAME = "Berani - Ginger Juice.mp3"
TRANSCRIPT_NAME = "Berani - Ginger Juice.transcript.txt"


def assemble_project(project: LoadedProject) -> Path:
    plan = NarrationPlan.model_validate_json(
        (project.project_dir / "planning" / "narration-plan.json").read_text(encoding="utf-8")
    )
    state = RenderState.model_validate_json(
        (project.project_dir / "chunks" / "render-state.json").read_text(encoding="utf-8")
    )
    chunk_paths: list[tuple[Path, int]] = []
    for chunk in plan.chunks:
        record = state.chunks.get(chunk.chunk_id)
        if not record or record.status != "qa_pass" or not record.mastered_audio:
            raise PackagingError(f"chunk is not accepted: {chunk.chunk_id}")
        chunk_paths.append((project.project_dir / record.mastered_audio, chunk.pause_after_ms))
    output = project.project_dir / "output"
    unmastered = output / "Berani - Ginger Juice - Unmastered.wav"
    master = output / MASTER_NAME
    assemble(
        chunk_paths,
        unmastered=unmastered,
        master=master,
        sample_rate=project.config.audio.output_sample_rate,
        target_lufs=project.config.audio.target_lufs,
        true_peak_db=project.config.audio.true_peak_db,
        target_duration_seconds=(
            sum(word_count(chunk.source_text) for chunk in plan.chunks)
            / project.config.audio.target_words_per_minute
            * 60
        ),
    )
    transcript = "\n\n".join(chunk.source_text for chunk in plan.chunks) + "\n"
    (output / TRANSCRIPT_NAME).write_text(transcript, encoding="utf-8")
    return master


def _ffmpeg_delivery(
    master: Path, output: Path, codec_args: list[str], metadata: list[str]
) -> None:
    command = [
        "ffmpeg",
        "-hide_banner",
        "-loglevel",
        "error",
        "-y",
        "-i",
        str(master),
        *codec_args,
    ]
    for value in metadata:
        command.extend(["-metadata", value])
    command.append(str(output))
    try:
        subprocess.run(command, check=True)
    except (OSError, subprocess.CalledProcessError) as exc:
        raise PackagingError(f"delivery encoding failed: {output.name}: {exc}") from exc


def package_project(project: LoadedProject, *, include_mp3: bool = True) -> list[Path]:
    if not project.config.rights.confirmed:
        raise PackagingError(
            "rights confirmation is required before packaging; update project.yaml with "
            "confirmed, confirmed_by, and confirmed_at"
        )
    manifest = validate_manifest(project.project_dir)
    source = manifest.source.model_copy(
        update={"project_config_sha256": sha256_file(project.config_path)}
    )
    refreshed = manifest.model_copy(update={"source": source})
    atomic_write_bytes(
        project.project_dir / "manifest.json",
        (refreshed.model_dump_json(indent=2) + "\n").encode(),
    )
    approved_master = project.project_dir / "output" / "master" / MASTER_NAME
    master = (
        approved_master
        if approved_master.is_file()
        else project.project_dir / "output" / MASTER_NAME
    )
    if not master.is_file():
        raise PackagingError("assemble the WAV master before packaging")
    metadata = [
        "title=Ginger Juice",
        "album=Berani",
        "track=Pages 65-69",
        "comment=Locally generated for authorised educational use",
    ]
    m4b = project.project_dir / "output" / M4B_NAME
    _ffmpeg_delivery(master, m4b, ["-c:a", "aac", "-b:a", "96k", "-ac", "1"], metadata)
    outputs = [master, m4b, project.project_dir / "output" / TRANSCRIPT_NAME]
    if include_mp3:
        mp3 = project.project_dir / "output" / MP3_NAME
        _ffmpeg_delivery(master, mp3, ["-c:a", "libmp3lame", "-b:a", "96k", "-ac", "1"], metadata)
        outputs.append(mp3)
    return outputs


def verify_delivery(outputs: list[Path]) -> None:
    if shutil.which("ffprobe") is None:
        raise PackagingError("ffprobe is required to verify delivery outputs")
    for output in outputs:
        if output.suffix.lower() == ".txt":
            if not output.is_file() or not output.read_text(encoding="utf-8").strip():
                raise PackagingError(f"transcript output did not verify: {output}")
            continue
        result = subprocess.run(
            [
                "ffprobe",
                "-v",
                "error",
                "-show_entries",
                "format=duration",
                "-of",
                "default=noprint_wrappers=1:nokey=1",
                str(output),
            ],
            text=True,
            capture_output=True,
        )
        if result.returncode or not result.stdout.strip():
            raise PackagingError(f"delivery output did not verify: {output}")
