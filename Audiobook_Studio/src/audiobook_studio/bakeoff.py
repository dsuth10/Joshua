"""Voice bake-off planning, generation, and approval."""

import json
import shutil
from datetime import UTC, datetime
from pathlib import Path
from typing import Literal

import yaml
from pydantic import Field

from audiobook_studio.backends import BackendRequest, BackendResponse, WorkerRunner, get_backend
from audiobook_studio.backends.protocol import SettingValue
from audiobook_studio.backends.subprocess_backend import BackendExecutionError, unique_request_id
from audiobook_studio.contracts import (
    LoadedProject,
    Manifest,
    ManualApproval,
    StageRecord,
    StrictModel,
)
from audiobook_studio.errors import ConfigurationError
from audiobook_studio.hashing import sha256_file, sha256_text
from audiobook_studio.project_store import atomic_write_bytes


class BakeoffPassage(StrictModel):
    passage_id: str = Field(pattern=r"^[a-z0-9][a-z0-9-]*$")
    style: Literal["reflective", "tender", "danger"]
    text: str = Field(min_length=1)


class PronunciationTrial(StrictModel):
    trial_id: str = Field(pattern=r"^[a-z0-9][a-z0-9-]*$")
    terms: list[str]
    baseline_text: str = Field(min_length=1)
    override_text: str = Field(min_length=1)


class BakeoffPlan(StrictModel):
    schema_version: Literal[1]
    passages: list[BakeoffPassage] = Field(min_length=3, max_length=3)
    pronunciation_trials: list[PronunciationTrial]


class Candidate(StrictModel):
    candidate_id: str = Field(pattern=r"^[a-z0-9][a-z0-9-]*$")
    backend: Literal["kokoro", "qwen", "chatterbox"]
    model_id: str
    mode: Literal["stock", "designed_clone"]
    design_model_id: str | None = None
    reference_text: str | None = None
    settings: dict[str, SettingValue] = Field(default_factory=dict)


class ConsentRecord(StrictModel):
    human_voice_cloning_allowed: bool
    notes: str


class CandidatePlan(StrictModel):
    schema_version: Literal[1]
    voice_direction: str
    candidates: list[Candidate]
    consent: ConsentRecord


class VoiceApprovalRecord(StrictModel):
    schema_version: Literal[1] = 1
    gate: Literal["G1"] = "G1"
    decision: Literal["approved"] = "approved"
    approved_by: str
    approved_at: datetime
    selected_candidate: str
    scorecard_waived: bool
    waiver_rationale: str
    pronunciation_policy: Literal["baseline_source_spelling"]
    reference_audio: str
    reference_audio_sha256: str
    regression_audio: str
    regression_audio_sha256: str
    consent_basis: str


def load_bakeoff(project_dir: Path) -> tuple[BakeoffPlan, CandidatePlan]:
    bakeoff_dir = project_dir / "voice-bakeoff"
    passage_data = json.loads((bakeoff_dir / "passages.json").read_text(encoding="utf-8"))
    candidate_data = yaml.safe_load((bakeoff_dir / "candidates.yaml").read_text(encoding="utf-8"))
    return BakeoffPlan.model_validate(passage_data), CandidatePlan.model_validate(candidate_data)


def validate_source_fidelity(project: LoadedProject, plan: BakeoffPlan) -> None:
    narration_path = project.project_dir / "source" / "narration-text.txt"
    narration = narration_path.read_text(encoding="utf-8")
    for passage in plan.passages:
        if narration.count(passage.text) != 1:
            raise ConfigurationError(
                f"Bake-off passage {passage.passage_id!r} is not a unique exact selection "
                "from narration-text.txt"
            )
    for trial in plan.pronunciation_trials:
        if narration.count(trial.baseline_text) != 1:
            raise ConfigurationError(
                f"Pronunciation baseline {trial.trial_id!r} is not a unique exact selection "
                "from narration-text.txt"
            )
        missing = [term for term in trial.terms if term not in trial.baseline_text]
        if missing:
            raise ConfigurationError(
                f"Pronunciation trial {trial.trial_id!r} omits terms: {', '.join(missing)}"
            )


def _request(
    *,
    candidate: Candidate,
    text: str,
    output: Path,
    model_id: str | None = None,
    settings: dict[str, SettingValue] | None = None,
    voice_reference: Path | None = None,
    action: Literal["prepare_voice", "synthesize"] = "synthesize",
) -> BackendRequest:
    return BackendRequest(
        request_id=unique_request_id(candidate.candidate_id),
        action=action,
        model_id=model_id or candidate.model_id,
        text=text,
        language="English",
        voice_reference=str(voice_reference) if voice_reference else None,
        settings=settings or candidate.settings,
        output_path=str(output),
    )


def _response_record(
    label: str,
    text: str,
    output: Path,
    response: BackendResponse,
) -> dict[str, object]:
    values = response.model_dump(mode="json")
    return {
        "label": label,
        "text_sha256": sha256_text(text),
        "path": str(output),
        **values,
    }


def _generate_candidate(
    studio_root: Path,
    candidate: Candidate,
    plan: BakeoffPlan,
    output_root: Path,
    log_root: Path,
) -> dict[str, object]:
    backend = get_backend(studio_root, candidate.backend)
    runner = WorkerRunner(backend, timeout_seconds=1_800)
    candidate_dir = output_root / candidate.candidate_id
    candidate_dir.mkdir(parents=True, exist_ok=True)
    records: list[dict[str, object]] = []
    reference: Path | None = None

    if candidate.mode == "designed_clone":
        if not candidate.design_model_id or not candidate.reference_text:
            raise ConfigurationError(
                f"Designed candidate {candidate.candidate_id} lacks design model/reference text"
            )
        reference = candidate_dir / "synthetic-reference.wav"
        design_settings = dict(candidate.settings)
        design_request = _request(
            candidate=candidate,
            text=candidate.reference_text,
            output=reference,
            model_id=candidate.design_model_id,
            settings=design_settings,
            action="prepare_voice",
        )
        design_response = runner.run(design_request, log_root)
        records.append(
            _response_record(
                "synthetic-reference",
                candidate.reference_text,
                reference,
                design_response,
            )
        )

    for passage in plan.passages:
        output = candidate_dir / f"{passage.passage_id}.wav"
        settings = dict(candidate.settings)
        if candidate.mode == "designed_clone":
            assert candidate.reference_text is not None
            settings["reference_text"] = candidate.reference_text
            settings.pop("instruction", None)
        response = runner.run(
            _request(
                candidate=candidate,
                text=passage.text,
                output=output,
                settings=settings,
                voice_reference=reference,
            ),
            log_root,
        )
        records.append(_response_record(passage.passage_id, passage.text, output, response))

    baseline_text = "\n\n".join(trial.baseline_text for trial in plan.pronunciation_trials)
    override_text = "\n\n".join(trial.override_text for trial in plan.pronunciation_trials)
    for label, text in [
        ("pronunciation-baseline", baseline_text),
        ("pronunciation-override", override_text),
    ]:
        output = candidate_dir / f"{label}.wav"
        settings = dict(candidate.settings)
        if candidate.mode == "designed_clone":
            assert candidate.reference_text is not None
            settings["reference_text"] = candidate.reference_text
            settings.pop("instruction", None)
        response = runner.run(
            _request(
                candidate=candidate,
                text=text,
                output=output,
                settings=settings,
                voice_reference=reference,
            ),
            log_root,
        )
        records.append(_response_record(label, text, output, response))
    return {
        "candidate_id": candidate.candidate_id,
        "backend": candidate.backend,
        "model_id": candidate.model_id,
        "status": "generated",
        "samples": records,
    }


def generate_bakeoff(
    project: LoadedProject,
    selected_backend: str = "all",
) -> dict[str, object]:
    studio_root = project.workspace_root / "Audiobook_Studio"
    plan, candidates = load_bakeoff(project.project_dir)
    validate_source_fidelity(project, plan)
    output_root = project.project_dir / "qa" / "audio" / "voice-bakeoff"
    log_root = project.project_dir / "qa" / "worker-logs"
    output_root.mkdir(parents=True, exist_ok=True)
    log_root.mkdir(parents=True, exist_ok=True)
    new_results: list[dict[str, object]] = []
    for candidate in candidates.candidates:
        if selected_backend != "all" and candidate.backend != selected_backend:
            continue
        try:
            result = _generate_candidate(studio_root, candidate, plan, output_root, log_root)
        except (BackendExecutionError, ConfigurationError) as exc:
            result = {
                "candidate_id": candidate.candidate_id,
                "backend": candidate.backend,
                "model_id": candidate.model_id,
                "status": "failed",
                "error": str(exc),
            }
        new_results.append(result)
    report_path = project.project_dir / "voice-bakeoff" / "results.json"
    results = new_results
    if selected_backend != "all" and report_path.is_file():
        try:
            existing_report = json.loads(report_path.read_text(encoding="utf-8"))
            existing_results = existing_report.get("candidates", [])
            retained = [
                item for item in existing_results if item.get("backend") != selected_backend
            ]
            results = [*retained, *new_results]
        except (json.JSONDecodeError, OSError, AttributeError):
            results = new_results
    report = {
        "schema_version": 1,
        "generated_at": datetime.now(UTC).isoformat(),
        "source_text_sha256": sha256_file(project.project_dir / "source" / "narration-text.txt"),
        "passage_plan_sha256": sha256_file(project.project_dir / "voice-bakeoff" / "passages.json"),
        "candidates": results,
    }
    report_path.write_text(
        json.dumps(report, indent=2, ensure_ascii=False, sort_keys=True) + "\n",
        encoding="utf-8",
    )
    return report


def doctor_backends(project: LoadedProject) -> dict[str, object]:
    studio_root = project.workspace_root / "Audiobook_Studio"
    log_root = project.project_dir / "qa" / "worker-logs"
    checks: list[dict[str, object]] = []
    for name in ["kokoro", "qwen", "chatterbox"]:
        backend = get_backend(studio_root, name)
        request = BackendRequest(
            request_id=unique_request_id(f"{name}-doctor"),
            action="doctor",
        )
        try:
            response = WorkerRunner(backend, timeout_seconds=120).run(request, log_root)
            checks.append(
                {
                    "backend": name,
                    "status": "pass",
                    "worker_lock_sha256": response.worker_lock_sha256,
                    "data": response.data,
                }
            )
        except BackendExecutionError as exc:
            checks.append({"backend": name, "status": "fail", "error": str(exc)})
    report = {
        "schema_version": 1,
        "checked_at": datetime.now(UTC).isoformat(),
        "checks": checks,
    }
    destination = project.project_dir / "voice-bakeoff" / "worker-doctor.json"
    destination.write_text(
        json.dumps(report, indent=2, ensure_ascii=False, sort_keys=True) + "\n",
        encoding="utf-8",
    )
    return report


def approve_voice(
    project: LoadedProject,
    candidate_id: str,
    approver: str,
    *,
    scorecard_waived: bool = False,
    waiver_rationale: str = "",
) -> Path:
    if not approver.strip():
        raise ConfigurationError("Approver name must not be empty")
    plan, candidates = load_bakeoff(project.project_dir)
    candidate = next(
        (item for item in candidates.candidates if item.candidate_id == candidate_id),
        None,
    )
    if candidate is None:
        raise ConfigurationError(f"Unknown voice candidate: {candidate_id}")
    results_path = project.project_dir / "voice-bakeoff" / "results.json"
    if not results_path.is_file():
        raise ConfigurationError("Generate the voice bake-off before approving a candidate")
    results = json.loads(results_path.read_text(encoding="utf-8"))
    result = next(
        (item for item in results["candidates"] if item["candidate_id"] == candidate_id),
        None,
    )
    if not result or result["status"] != "generated":
        raise ConfigurationError(f"Candidate {candidate_id} has no complete generated sample set")

    def resolve_sample(label: str) -> Path:
        sample = next(item for item in result["samples"] if item["label"] == label)
        raw_path = str(sample["path"]).replace("\\", "/")
        path = Path(raw_path)
        if path.is_file():
            return path
        marker = "/Audiobook_Studio/"
        if marker in raw_path:
            relative = raw_path.split(marker, maxsplit=1)[1]
            path = project.workspace_root / "Audiobook_Studio" / relative
        if not path.is_file():
            raise ConfigurationError(f"Approved sample does not exist: {raw_path}")
        return path

    regression_source = resolve_sample("reflective-opening")
    reference_label = (
        "synthetic-reference" if candidate.mode == "designed_clone" else "reflective-opening"
    )
    reference_source = resolve_sample(reference_label)
    assets = project.workspace_root / "Audiobook_Studio" / "configurations" / "voices" / "assets"
    assets.mkdir(parents=True, exist_ok=True)
    reference_path = assets / "ginger-juice-reference.wav"
    regression_path = assets / "ginger-juice-regression.wav"
    shutil.copyfile(reference_source, reference_path)
    shutil.copyfile(regression_source, regression_path)
    approved_at = datetime.now(UTC)
    reference_transcript = (
        candidate.reference_text
        if candidate.mode == "designed_clone"
        else next(
            passage.text for passage in plan.passages if passage.passage_id == "reflective-opening"
        )
    )
    assert reference_transcript is not None
    reference_relative = str(reference_path.relative_to(project.workspace_root)).replace("\\", "/")
    regression_relative = str(regression_path.relative_to(project.workspace_root)).replace(
        "\\", "/"
    )
    profile = {
        "schema_version": 1,
        "profile_name": "ginger-juice",
        "revision": 1,
        "backend": candidate.backend,
        "model_id": candidate.model_id,
        "candidate_id": candidate.candidate_id,
        "design_model_id": candidate.design_model_id,
        "voice_direction": candidates.voice_direction,
        "reference_audio": reference_relative,
        "reference_transcript": reference_transcript,
        "reference_audio_sha256": sha256_file(reference_path),
        "regression_audio": regression_relative,
        "regression_transcript": next(
            passage.text for passage in plan.passages if passage.passage_id == "reflective-opening"
        ),
        "regression_audio_sha256": sha256_file(regression_path),
        "consent": {
            "required": False,
            "basis": "synthetic reference generated by Qwen VoiceDesign",
        },
        "worker_settings": {"attention": candidate.settings.get("attention", "sdpa")},
        "pronunciation_policy": "baseline_source_spelling",
        "recommended_chunk_words": 75,
        "known_pronunciation_limitations": [],
        "approved_by": approver.strip(),
        "approved_at": approved_at.isoformat(),
        "scorecard_waived": scorecard_waived,
        "waiver_rationale": waiver_rationale,
    }
    profile_path = (
        project.workspace_root
        / "Audiobook_Studio"
        / "configurations"
        / "voices"
        / "ginger-juice.yaml"
    )
    profile_path.write_text(
        yaml.safe_dump(profile, sort_keys=False, allow_unicode=True),
        encoding="utf-8",
    )

    project_data = yaml.safe_load(project.config_path.read_text(encoding="utf-8"))
    project_data["voice"] = {
        "backend": candidate.backend,
        "model_id": candidate.model_id,
        "profile": "ginger-juice",
        "language": "English",
    }
    project.config_path.write_text(
        yaml.safe_dump(project_data, sort_keys=False, allow_unicode=True),
        encoding="utf-8",
    )

    approval = VoiceApprovalRecord(
        approved_by=approver.strip(),
        approved_at=approved_at,
        selected_candidate=candidate.candidate_id,
        scorecard_waived=scorecard_waived,
        waiver_rationale=waiver_rationale,
        pronunciation_policy="baseline_source_spelling",
        reference_audio=reference_relative,
        reference_audio_sha256=sha256_file(reference_path),
        regression_audio=regression_relative,
        regression_audio_sha256=sha256_file(regression_path),
        consent_basis="synthetic reference generated by Qwen VoiceDesign",
    )
    approval_path = project.project_dir / "voice-bakeoff" / "approval.json"
    atomic_write_bytes(
        approval_path,
        (approval.model_dump_json(indent=2) + "\n").encode("utf-8"),
    )

    manifest_path = project.project_dir / "manifest.json"
    manifest = Manifest.model_validate_json(manifest_path.read_text(encoding="utf-8"))
    stages = dict(manifest.stages)
    stages["plan"] = StageRecord(status="qa_pass", completed_at=approved_at)
    approvals = [item for item in manifest.approvals if item.gate != "G1"]
    approvals.append(
        ManualApproval(
            gate="G1",
            decision="approved",
            approved_by=approver.strip(),
            approved_at=approved_at,
            selection=candidate.candidate_id,
            scorecard_waived=scorecard_waived,
            notes=waiver_rationale,
        )
    )
    source_updates: dict[str, str] = {"project_config_sha256": sha256_file(project.config_path)}
    if project.lexicon_path is not None:
        source_updates["pronunciation_lexicon_sha256"] = sha256_file(project.lexicon_path)
    source = manifest.source.model_copy(update=source_updates)
    outputs = {
        **manifest.outputs,
        "voice_profile": str(profile_path.relative_to(project.workspace_root)).replace("\\", "/"),
        "voice_reference": reference_relative,
        "voice_regression": regression_relative,
        "g1_approval": "voice-bakeoff/approval.json",
    }
    updated_manifest = manifest.model_copy(
        update={
            "source": source,
            "stages": stages,
            "outputs": outputs,
            "approvals": approvals,
        }
    )
    atomic_write_bytes(
        manifest_path,
        (updated_manifest.model_dump_json(indent=2) + "\n").encode("utf-8"),
    )

    scorecard_path = project.project_dir / "voice-bakeoff" / "scorecard.md"
    scorecard = scorecard_path.read_text(encoding="utf-8")
    scorecard = scorecard.replace("**Approver:**  ", f"**Approver:** {approver.strip()}  ")
    scorecard = scorecard.replace(
        "**Listening date:**  ", f"**Listening date:** {approved_at.date().isoformat()}  "
    )
    scorecard = scorecard.replace(
        "**Selected candidate:**  ",
        f"**Selected candidate:** {candidate.candidate_id}  ",
    )
    if "Numerical scorecard waived by the project owner." not in scorecard:
        scorecard = scorecard.replace(
            "**Approval notes:**",
            "**Approval notes:**\n\n"
            f"Numerical scorecard waived by the project owner. {waiver_rationale}\n"
            "Baseline/source-spelling pronunciation policy approved.",
        )
    scorecard_path.write_text(scorecard, encoding="utf-8")
    return profile_path
