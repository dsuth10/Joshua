"""Narrow recovery scan for interrupted atomic audio writes."""

from pathlib import Path

from audiobook_studio.contracts import LoadedProject


def clean_partial_files(project: LoadedProject) -> list[Path]:
    roots = [
        (project.project_dir / "chunks").resolve(),
        (project.project_dir / "output").resolve(),
    ]
    removed: list[Path] = []
    for root in roots:
        if not root.exists():
            continue
        if project.project_dir.resolve() not in root.parents:
            raise ValueError(f"recovery root escaped the project: {root}")
        for path in root.rglob("*.partial.wav"):
            resolved = path.resolve()
            if root not in resolved.parents:
                raise ValueError(f"partial file escaped recovery root: {resolved}")
            resolved.unlink()
            removed.append(resolved)
    return removed
