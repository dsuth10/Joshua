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
from audiobook_studio.contracts import LoadedProject, StrictModel
from audiobook_studio.errors import ConfigurationError
from audiobook_studio.hashing import sha256_file, sha256_text


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
    results: list[dict[str, object]] = []
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
        results.append(result)
    report = {
        "schema_version": 1,
        "generated_at": datetime.now(UTC).isoformat(),
        "source_text_sha256": sha256_file(project.project_dir / "source" / "narration-text.txt"),
        "passage_plan_sha256": sha256_file(project.project_dir / "voice-bakeoff" / "passages.json"),
        "candidates": results,
    }
    report_path = project.project_dir / "voice-bakeoff" / "results.json"
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
) -> Path:
    if not approver.strip():
        raise ConfigurationError("Approver name must not be empty")
    plan, candidates = load_bakeoff(project.project_dir)
    del plan
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

    sample = next(item for item in result["samples"] if item["label"] == "reflective-opening")
    sample_path = Path(sample["path"])
    assets = project.workspace_root / "Audiobook_Studio" / "configurations" / "voices" / "assets"
    assets.mkdir(parents=True, exist_ok=True)
    reference_path = assets / "ginger-juice-reference.wav"
    shutil.copyfile(sample_path, reference_path)
    profile = {
        "schema_version": 1,
        "profile_name": "ginger-juice",
        "revision": 1,
        "backend": candidate.backend,
        "model_id": candidate.model_id,
        "candidate_id": candidate.candidate_id,
        "voice_direction": candidates.voice_direction,
        "reference_audio": str(reference_path.relative_to(project.workspace_root)).replace(
            "\\", "/"
        ),
        "reference_transcript": next(
            passage.text
            for passage in load_bakeoff(project.project_dir)[0].passages
            if passage.passage_id == "reflective-opening"
        ),
        "reference_audio_sha256": sha256_file(reference_path),
        "consent": {
            "required": False,
            "basis": "model stock voice or synthetic model-designed voice",
        },
        "defaults": {"pace": 1.0, "emotion": 0.25},
        "recommended_chunk_words": 75,
        "known_pronunciation_limitations": [],
        "approved_by": approver.strip(),
        "approved_at": datetime.now(UTC).isoformat(),
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
    return profile_path
