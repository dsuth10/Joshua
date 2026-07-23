"""Workspace and path discovery."""

import os
from pathlib import Path

from audiobook_studio.errors import WorkspaceNotFoundError


def is_workspace_root(path: Path) -> bool:
    return (path / ".git").exists() and (path / "Units").is_dir()


def discover_workspace_root(start: Path | None = None) -> Path:
    explicit = os.environ.get("JOSHUA_ROOT")
    if explicit:
        candidate = Path(explicit).expanduser().resolve()
        if not is_workspace_root(candidate):
            raise WorkspaceNotFoundError(
                f"JOSHUA_ROOT does not identify the Joshua workspace: {candidate}"
            )
        return candidate

    candidates: list[Path] = []
    if start is not None:
        candidates.append(start.resolve())
    candidates.extend([Path.cwd().resolve(), Path(__file__).resolve()])

    visited: set[Path] = set()
    for candidate in candidates:
        base = candidate if candidate.is_dir() else candidate.parent
        for path in (base, *base.parents):
            if path in visited:
                continue
            visited.add(path)
            if is_workspace_root(path):
                return path

    raise WorkspaceNotFoundError(
        "Could not locate the Joshua workspace root. Set JOSHUA_ROOT explicitly."
    )
