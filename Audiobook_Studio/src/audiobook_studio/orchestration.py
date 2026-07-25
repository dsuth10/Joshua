"""Resumable, content-addressed chapter rendering."""

from __future__ import annotations

import shutil
from datetime import UTC, datetime
from pathlib import Path
from typing import Literal

import yaml
from pydantic import Field

from audiobook_studio.audio_validation import inspect_wav
from audiobook_studio.backends.protocol import BackendRequest, BackendSynthesisItem
from audiobook_studio.backends.registry import get_backend
from audiobook_studio.backends.subprocess_backend import WorkerRunner, unique_request_id
from audiobook_studio.cache import render_key, seed_for_attempt
from audiobook_studio.contracts import LoadedProject, StrictModel
from audiobook_studio.errors import AudiobookError, ExitCode
from audiobook_studio.hashing import sha256_file
from audiobook_studio.mastering import CHUNK_MASTERING_REVISION, standardise_chunk
from audiobook_studio.narration_plan import NarrationChunk, NarrationPlan
from audiobook_studio.project_store import atomic_write_bytes


class RenderError(AudiobookError):
    exit_code = ExitCode.GENERATION_FAILURE


class ChunkRenderRecord(StrictModel):
    chunk_id: str
    render_key: str
    status: Literal["generated", "qa_pass", "qa_fail", "manual_review"]
    attempts: int = Field(ge=0)
    seeds: list[int]
    raw_audio: str | None = None
    mastered_audio: str | None = None
    duration_seconds: float | None = None
    audio_sha256: str | None = None
    worker_lock_sha256: str | None = None
    mastering_revision: int = Field(default=1, ge=1)
    error: str | None = None


class RenderState(StrictModel):
    schema_version: Literal[1] = 1
    project_id: str
    updated_at: datetime
    cache_hits: int = 0
    generated: int = 0
    failed: int = 0
    chunks: dict[str, ChunkRenderRecord]


def _relative(project: LoadedProject, path: Path) -> str:
    return str(path.relative_to(project.project_dir)).replace("\\", "/")


def _load_profile(project: LoadedProject) -> tuple[dict[str, object], Path]:
    profile_path = (
        project.workspace_root
        / "Audiobook_Studio"
        / "configurations"
        / "voices"
        / f"{project.config.voice.profile}.yaml"
    )
    profile = yaml.safe_load(profile_path.read_text(encoding="utf-8"))
    if not isinstance(profile, dict):
        raise RenderError(f"Invalid voice profile: {profile_path}")
    return profile, profile_path


def _load_state(path: Path, project_id: str) -> RenderState:
    if path.is_file():
        return RenderState.model_validate_json(path.read_text(encoding="utf-8"))
    return RenderState(project_id=project_id, updated_at=datetime.now(UTC), chunks={})


def _save_state(path: Path, state: RenderState) -> None:
    atomic_write_bytes(path, (state.model_dump_json(indent=2) + "\n").encode("utf-8"))


def render_project(project: LoadedProject, *, force_chunks: set[str] | None = None) -> RenderState:
    plan_path = project.project_dir / "planning" / "narration-plan.json"
    if not plan_path.is_file():
        raise RenderError("run audiobook plan before audiobook render")
    plan = NarrationPlan.model_validate_json(plan_path.read_text(encoding="utf-8"))
    profile, profile_path = _load_profile(project)
    studio_root = project.workspace_root / "Audiobook_Studio"
    backend = get_backend(studio_root, project.config.voice.backend)
    runner = WorkerRunner(backend, timeout_seconds=1200)
    reference = project.workspace_root / str(profile["reference_audio"])
    if sha256_file(reference) != str(profile["reference_audio_sha256"]):
        raise RenderError("frozen voice reference hash does not match the voice profile")
    raw_settings = profile.get("worker_settings", {})
    if not isinstance(raw_settings, dict):
        raise RenderError("voice profile worker_settings must be a mapping")
    settings: dict[str, str | int | float | bool] = {}
    for key, value in raw_settings.items():
        if not isinstance(key, str) or not isinstance(value, (str, int, float, bool)):
            raise RenderError("voice profile worker_settings values must be scalar")
        settings[key] = value
    settings["reference_text"] = str(profile["reference_transcript"])
    state_path = project.project_dir / "chunks" / "render-state.json"
    state = _load_state(state_path, project.config.project_id)
    state = state.model_copy(update={"cache_hits": 0, "generated": 0, "failed": 0})
    raw_dir = project.project_dir / "chunks" / "raw"
    mastered_dir = project.project_dir / "chunks" / "mastered"
    failure_dir = project.project_dir / "qa" / "audio" / "failed"
    log_dir = project.project_dir / "qa" / "logs" / "render"
    forced = force_chunks or set()
    known_ids = {chunk.chunk_id for chunk in plan.chunks}
    if unknown := forced - known_ids:
        raise RenderError(f"unknown forced chunk IDs: {', '.join(sorted(unknown))}")
    pending: list[tuple[NarrationChunk, str, Path, int, list[int]]] = []
    for chunk in plan.chunks:
        key = render_key(
            chunk,
            backend=backend.name,
            model_id=project.config.voice.model_id,
            model_revision="",
            voice_profile_hash=sha256_file(profile_path),
            lexicon_hash=plan.lexicon_sha256,
            settings=settings,
        )
        accepted = mastered_dir / f"{chunk.chunk_id}.{key[:12]}.wav"
        existing = state.chunks.get(chunk.chunk_id)
        if (
            chunk.chunk_id not in forced
            and existing
            and existing.render_key == key
            and existing.status == "qa_pass"
            and accepted.is_file()
        ):
            if (
                existing.mastering_revision < CHUNK_MASTERING_REVISION
                and existing.raw_audio
                and (project.project_dir / existing.raw_audio).is_file()
            ):
                standardise_chunk(
                    project.project_dir / existing.raw_audio,
                    accepted,
                    project.config.audio.output_sample_rate,
                )
                metadata = inspect_wav(accepted)
                state.chunks[chunk.chunk_id] = existing.model_copy(
                    update={
                        "mastering_revision": CHUNK_MASTERING_REVISION,
                        "duration_seconds": metadata.duration_seconds,
                        "audio_sha256": metadata.sha256,
                    }
                )
                state.generated += 1
                continue
            metadata = inspect_wav(accepted)
            if (
                metadata.sample_rate == project.config.audio.output_sample_rate
                and existing.mastering_revision == CHUNK_MASTERING_REVISION
            ):
                state.cache_hits += 1
                continue
        attempt = existing.attempts + 1 if existing and chunk.chunk_id in forced else 1
        if attempt > project.config.qa.max_generation_attempts:
            raise RenderError(f"{chunk.chunk_id} reached the maximum generation attempts")
        previous = list(existing.seeds) if existing and chunk.chunk_id in forced else []
        pending.append((chunk, key, accepted, attempt, previous))

    if backend.name == "qwen" and pending:
        items = [
            BackendSynthesisItem(
                item_id=chunk.chunk_id,
                text=chunk.spoken_text,
                output_path=str(raw_dir / f"{chunk.chunk_id}.{key[:12]}.attempt-{attempt}.raw.wav"),
                seed=seed_for_attempt(key, attempt),
            )
            for chunk, key, _, attempt, _ in pending
        ]
        batch_request = BackendRequest(
            request_id=unique_request_id("chapter-batch"),
            action="synthesize_batch",
            model_id=project.config.voice.model_id,
            language=project.config.voice.language,
            voice_reference=str(reference),
            settings=settings,
            items=items,
        )
        try:
            response = runner.run(batch_request, log_dir)
            for chunk, key, accepted, attempt, previous in pending:
                raw = raw_dir / f"{chunk.chunk_id}.{key[:12]}.attempt-{attempt}.raw.wav"
                standardise_chunk(raw, accepted, project.config.audio.output_sample_rate)
                metadata = inspect_wav(accepted)
                seed = seed_for_attempt(key, attempt)
                state.chunks[chunk.chunk_id] = ChunkRenderRecord(
                    chunk_id=chunk.chunk_id,
                    render_key=key,
                    status="qa_pass",
                    attempts=attempt,
                    seeds=[*previous, seed],
                    raw_audio=_relative(project, raw),
                    mastered_audio=_relative(project, accepted),
                    duration_seconds=metadata.duration_seconds,
                    audio_sha256=metadata.sha256,
                    worker_lock_sha256=response.worker_lock_sha256,
                    mastering_revision=CHUNK_MASTERING_REVISION,
                )
                state.generated += 1
            pending = []
            state.updated_at = datetime.now(UTC)
            _save_state(state_path, state)
        except (AudiobookError, OSError):
            # Fall through to isolated retries so one bad item cannot discard the chapter.
            pass

    for chunk, key, accepted, first_attempt, previous in pending:
        seeds: list[int] = list(previous)
        last_error = ""
        for attempt in range(first_attempt, project.config.qa.max_generation_attempts + 1):
            seed = seed_for_attempt(key, attempt)
            seeds.append(seed)
            raw = raw_dir / f"{chunk.chunk_id}.{key[:12]}.attempt-{attempt}.raw.wav"
            request = BackendRequest(
                request_id=unique_request_id(chunk.chunk_id),
                action="synthesize",
                model_id=project.config.voice.model_id,
                text=chunk.spoken_text,
                language=project.config.voice.language,
                voice_reference=str(reference),
                settings={**settings, "seed": seed},
                output_path=str(raw),
            )
            try:
                response = runner.run(request, log_dir)
                standardise_chunk(raw, accepted, project.config.audio.output_sample_rate)
                metadata = inspect_wav(accepted)
                if metadata.channels != 1:
                    raise RenderError(f"{chunk.chunk_id} mastered output is not mono")
                record = ChunkRenderRecord(
                    chunk_id=chunk.chunk_id,
                    render_key=key,
                    status="qa_pass",
                    attempts=attempt,
                    seeds=seeds,
                    raw_audio=_relative(project, raw),
                    mastered_audio=_relative(project, accepted),
                    duration_seconds=metadata.duration_seconds,
                    audio_sha256=metadata.sha256,
                    worker_lock_sha256=response.worker_lock_sha256,
                    mastering_revision=CHUNK_MASTERING_REVISION,
                )
                state.chunks[chunk.chunk_id] = record
                state.generated += 1
                last_error = ""
                break
            except (AudiobookError, OSError) as exc:
                last_error = str(exc)
                if raw.is_file():
                    failure_dir.mkdir(parents=True, exist_ok=True)
                    shutil.copy2(raw, failure_dir / raw.name)
        if last_error:
            state.failed += 1
            state.chunks[chunk.chunk_id] = ChunkRenderRecord(
                chunk_id=chunk.chunk_id,
                render_key=key,
                status="qa_fail",
                attempts=len(seeds),
                seeds=seeds,
                error=last_error,
            )
        state.updated_at = datetime.now(UTC)
        _save_state(state_path, state)
    state.updated_at = datetime.now(UTC)
    _save_state(state_path, state)
    if state.failed:
        raise RenderError(f"{state.failed} chunks failed; evidence was retained in qa/audio/failed")
    return state


def verify_full_cache(project: LoadedProject) -> RenderState:
    state = render_project(project)
    if state.cache_hits != len(state.chunks):
        raise RenderError(
            f"expected {len(state.chunks)} cache hits but observed {state.cache_hits}"
        )
    return state
