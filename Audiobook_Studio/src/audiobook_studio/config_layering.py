"""Deterministic configuration precedence and resolved-config recording."""

from __future__ import annotations

from collections.abc import Mapping
from copy import deepcopy
from pathlib import Path
from typing import Any

import yaml

from audiobook_studio.contracts import LoadedProject


def deep_merge_layers(*layers: Mapping[str, Any]) -> dict[str, Any]:
    result: dict[str, Any] = {}
    for layer in layers:
        _merge(result, layer)
    return result


def _merge(target: dict[str, Any], incoming: Mapping[str, Any]) -> None:
    for key, value in incoming.items():
        if isinstance(value, Mapping) and isinstance(target.get(key), dict):
            _merge(target[key], value)
        else:
            target[key] = deepcopy(value)


def _yaml_mapping(path: Path) -> dict[str, Any]:
    if not path.is_file():
        return {}
    raw = yaml.safe_load(path.read_text(encoding="utf-8"))
    return raw if isinstance(raw, dict) else {}


def resolve_configuration(
    project: LoadedProject,
    cli_overrides: Mapping[str, Any] | None = None,
) -> dict[str, Any]:
    studio = project.workspace_root / "Audiobook_Studio"
    defaults = _yaml_mapping(studio / "configurations" / "defaults.yaml")
    backend = _yaml_mapping(
        studio / "configurations" / "backends" / f"{project.config.voice.backend}.yaml"
    )
    voice = _yaml_mapping(
        studio / "configurations" / "voices" / f"{project.config.voice.profile}.yaml"
    )
    return deep_merge_layers(
        defaults,
        backend,
        {"voice_profile": voice} if voice else {},
        project.config.model_dump(mode="json"),
        cli_overrides or {},
    )
