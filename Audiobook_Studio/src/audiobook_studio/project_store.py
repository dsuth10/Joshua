"""Project loading and deterministic Slice 0 artifact persistence."""

import json
import os
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

import yaml
from pydantic import ValidationError

from audiobook_studio.contracts import (
    LoadedProject,
    Manifest,
    ProjectConfig,
    SourceMetadata,
    StageRecord,
)
from audiobook_studio.errors import ConfigurationError, ManifestValidationError
from audiobook_studio.hashing import sha256_file, sha256_text
from audiobook_studio.settings import discover_workspace_root


def load_project(config_path: Path) -> LoadedProject:
    resolved_config = config_path.expanduser().resolve()
    if not resolved_config.is_file():
        raise ConfigurationError(f"Project configuration does not exist: {resolved_config}")
    try:
        raw = yaml.safe_load(resolved_config.read_text(encoding="utf-8"))
        config = ProjectConfig.model_validate(raw)
    except (OSError, yaml.YAMLError, ValidationError) as exc:
        raise ConfigurationError(
            f"Invalid project configuration: {resolved_config}: {exc}"
        ) from exc

    workspace_root = discover_workspace_root(resolved_config)
    project_dir = resolved_config.parent
    source_base = workspace_root if config.source.path_base == "workspace_root" else project_dir
    source_path = (source_base / config.source.path).resolve()
    if not source_path.is_file():
        raise ConfigurationError(f"Configured source does not exist: {source_path}")

    lexicon_path: Path | None = None
    if config.pronunciation_lexicon:
        lexicon_path = (workspace_root / config.pronunciation_lexicon).resolve()
        if not lexicon_path.is_file():
            raise ConfigurationError(f"Pronunciation lexicon does not exist: {lexicon_path}")

    return LoadedProject(
        config_path=resolved_config,
        project_dir=project_dir,
        workspace_root=workspace_root,
        source_path=source_path,
        lexicon_path=lexicon_path,
        config=config,
    )


def _json_bytes(data: Any) -> bytes:
    return (json.dumps(data, indent=2, ensure_ascii=False, sort_keys=True) + "\n").encode("utf-8")


def atomic_write_bytes(path: Path, value: bytes) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(path.name + ".tmp")
    with temporary.open("wb") as handle:
        handle.write(value)
        handle.flush()
        os.fsync(handle.fileno())
    os.replace(temporary, path)


def write_if_changed(path: Path, value: bytes) -> bool:
    if path.is_file() and path.read_bytes() == value:
        return False
    atomic_write_bytes(path, value)
    return True


def load_existing_source_metadata(path: Path) -> SourceMetadata | None:
    if not path.is_file():
        return None
    try:
        return SourceMetadata.model_validate_json(path.read_text(encoding="utf-8"))
    except ValidationError:
        return None


def build_source_metadata(
    project: LoadedProject,
    *,
    heading: str,
    start_line: int,
    end_line: int,
    original_selection: str,
    narration_text: str,
    word_count: int,
    paragraph_count: int,
) -> SourceMetadata:
    metadata_path = project.project_dir / "source" / "source-metadata.json"
    existing = load_existing_source_metadata(metadata_path)
    lexicon_hash = sha256_file(project.lexicon_path) if project.lexicon_path else None
    values = {
        "source_path": str(project.source_path.relative_to(project.workspace_root)).replace(
            "\\", "/"
        ),
        "selector": project.config.source.selector,
        "heading": heading,
        "start_line": start_line,
        "end_line": end_line,
        "source_file_sha256": sha256_file(project.source_path),
        "original_selection_sha256": sha256_text(original_selection),
        "narration_text_sha256": sha256_text(narration_text),
        "project_config_sha256": sha256_file(project.config_path),
        "pronunciation_lexicon_sha256": lexicon_hash,
        "character_count": len(narration_text),
        "word_count": word_count,
        "paragraph_count": paragraph_count,
    }
    comparable_existing = (
        existing.model_dump(exclude={"extracted_at"}) if existing is not None else None
    )
    candidate_without_time = SourceMetadata.model_validate(
        {
            **values,
            "extracted_at": existing.extracted_at if existing else datetime.now(UTC),
        }
    )
    if comparable_existing == candidate_without_time.model_dump(exclude={"extracted_at"}):
        return candidate_without_time
    return SourceMetadata.model_validate({**values, "extracted_at": datetime.now(UTC)})


def persist_extraction(
    project: LoadedProject,
    *,
    original_selection: str,
    narration_text: str,
    metadata: SourceMetadata,
) -> Manifest:
    source_dir = project.project_dir / "source"
    write_if_changed(source_dir / "original-selection.md", original_selection.encode("utf-8"))
    write_if_changed(source_dir / "narration-text.txt", narration_text.encode("utf-8"))
    write_if_changed(
        source_dir / "source-metadata.json",
        _json_bytes(metadata.model_dump(mode="json")),
    )

    manifest_path = project.project_dir / "manifest.json"
    existing_manifest: Manifest | None = None
    if manifest_path.is_file():
        try:
            existing_manifest = Manifest.model_validate_json(
                manifest_path.read_text(encoding="utf-8")
            )
        except ValidationError:
            existing_manifest = None

    created_at = existing_manifest.created_at if existing_manifest else datetime.now(UTC)
    completed_at = (
        existing_manifest.stages["extract"].completed_at
        if existing_manifest and "extract" in existing_manifest.stages
        else datetime.now(UTC)
    )
    manifest = Manifest(
        project_id=project.config.project_id,
        created_at=created_at,
        source=metadata,
        stages={
            "inspect": StageRecord(status="qa_pass", completed_at=completed_at),
            "extract": StageRecord(status="qa_pass", completed_at=completed_at),
            "plan": StageRecord(status="pending"),
            "render": StageRecord(status="pending"),
            "qa": StageRecord(status="pending"),
            "package": StageRecord(status="pending"),
        },
        outputs={
            "original_selection": "source/original-selection.md",
            "narration_text": "source/narration-text.txt",
            "source_metadata": "source/source-metadata.json",
        },
        approvals=existing_manifest.approvals if existing_manifest else [],
    )
    write_if_changed(manifest_path, _json_bytes(manifest.model_dump(mode="json")))
    return manifest


def validate_manifest(project_dir: Path) -> Manifest:
    path = project_dir.resolve() / "manifest.json"
    if not path.is_file():
        raise ManifestValidationError(f"Manifest does not exist: {path}")
    try:
        return Manifest.model_validate_json(path.read_text(encoding="utf-8"))
    except (OSError, ValidationError) as exc:
        raise ManifestValidationError(f"Manifest validation failed: {path}: {exc}") from exc


def export_schemas(output_dir: Path) -> None:
    from audiobook_studio.backends.protocol import BackendRequest, BackendResponse
    from audiobook_studio.bakeoff import BakeoffPlan, CandidatePlan, VoiceApprovalRecord

    output_dir.mkdir(parents=True, exist_ok=True)
    schemas = {
        "project.schema.json": ProjectConfig.model_json_schema(),
        "manifest.schema.json": Manifest.model_json_schema(),
        "source-metadata.schema.json": SourceMetadata.model_json_schema(),
        "backend-request.schema.json": BackendRequest.model_json_schema(),
        "backend-response.schema.json": BackendResponse.model_json_schema(),
        "bakeoff-plan.schema.json": BakeoffPlan.model_json_schema(),
        "candidate-plan.schema.json": CandidatePlan.model_json_schema(),
        "voice-approval.schema.json": VoiceApprovalRecord.model_json_schema(),
    }
    for filename, schema in schemas.items():
        write_if_changed(output_dir / filename, _json_bytes(schema))
