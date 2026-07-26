import json
from pathlib import Path

from audiobook_studio.migrations import migrate_manifest


def test_manifest_v0_migration_is_backed_up(tmp_path: Path) -> None:
    source = (
        Path(__file__).resolve().parents[2] / "projects" / "berani-ginger-juice" / "manifest.json"
    )
    raw = json.loads(source.read_text(encoding="utf-8"))
    raw["schema_version"] = 0
    for key in ("approvals", "chunks", "resolved_configuration", "chapters", "migration_history"):
        raw.pop(key, None)
    path = tmp_path / "manifest.json"
    path.write_text(json.dumps(raw), encoding="utf-8")
    migrated = migrate_manifest(path)
    assert migrated.schema_version == 1
    assert migrated.migration_history[0]["from_version"] == 0
    assert (tmp_path / "manifest.v0.backup.json").is_file()
