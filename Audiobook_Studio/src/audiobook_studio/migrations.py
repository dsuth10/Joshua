"""Explicit deterministic manifest migrations with backups."""

import json
from datetime import UTC, datetime
from pathlib import Path

from audiobook_studio.contracts import Manifest
from audiobook_studio.errors import ManifestValidationError
from audiobook_studio.project_store import atomic_write_bytes

CURRENT_MANIFEST_VERSION = 1


def migrate_manifest(path: Path) -> Manifest:
    raw = json.loads(path.read_text(encoding="utf-8"))
    version = int(raw.get("schema_version", 0))
    if version > CURRENT_MANIFEST_VERSION:
        raise ManifestValidationError(
            f"manifest schema {version} is newer than supported {CURRENT_MANIFEST_VERSION}"
        )
    if version == CURRENT_MANIFEST_VERSION:
        return Manifest.model_validate(raw)
    backup = path.with_name(f"{path.stem}.v{version}.backup{path.suffix}")
    if not backup.exists():
        atomic_write_bytes(backup, path.read_bytes())
    history = list(raw.get("migration_history", []))
    if version == 0:
        raw["schema_version"] = 1
        raw.setdefault("approvals", [])
        raw.setdefault("chunks", {})
        raw.setdefault("resolved_configuration", {})
        raw.setdefault("chapters", {})
        history.append(
            {
                "from_version": 0,
                "to_version": 1,
                "migrated_at": datetime.now(UTC).isoformat(),
            }
        )
        version = 1
    raw["migration_history"] = history
    if version != CURRENT_MANIFEST_VERSION:
        raise ManifestValidationError(f"no migration path from manifest schema {version}")
    manifest = Manifest.model_validate(raw)
    atomic_write_bytes(path, (manifest.model_dump_json(indent=2) + "\n").encode())
    return manifest
