from pathlib import Path

import pytest

from audiobook_studio.extractors import MarkdownExtractor
from audiobook_studio.project_store import (
    build_source_metadata,
    load_project,
    persist_extraction,
    validate_manifest,
)


@pytest.mark.integration
def test_real_berani_pilot_extraction_is_frozen() -> None:
    studio_root = Path(__file__).parents[2]
    project = load_project(studio_root / "projects" / "berani-ginger-juice" / "project.yaml")
    result = MarkdownExtractor().extract(project.source_path, project.config.source.selector)

    assert result.heading == "Ginger Juice (Pages 65–69)"
    assert result.word_count == 942
    assert result.paragraph_count == 31
    assert result.narration_text.startswith("Slow Loris Boy is talking")
    assert result.narration_text.rstrip().endswith("or will hurt you!")
    assert "# Ari (Pages 69–71)" not in result.original_selection


@pytest.mark.integration
def test_repeated_persistence_is_byte_for_byte_deterministic(tmp_path: Path) -> None:
    studio_root = Path(__file__).parents[2]
    original_project = load_project(
        studio_root / "projects" / "berani-ginger-juice" / "project.yaml"
    )
    result = MarkdownExtractor().extract(
        original_project.source_path, original_project.config.source.selector
    )

    config_copy = tmp_path / "project.yaml"
    config_copy.write_bytes(original_project.config_path.read_bytes())
    project = load_project(config_copy)
    metadata = build_source_metadata(
        project,
        heading=result.heading,
        start_line=result.start_line,
        end_line=result.end_line,
        original_selection=result.original_selection,
        narration_text=result.narration_text,
        word_count=result.word_count,
        paragraph_count=result.paragraph_count,
    )
    persist_extraction(
        project,
        original_selection=result.original_selection,
        narration_text=result.narration_text,
        metadata=metadata,
    )
    first = {
        path.name: path.read_bytes()
        for path in [tmp_path / "manifest.json", *(tmp_path / "source").iterdir()]
    }

    metadata_again = build_source_metadata(
        project,
        heading=result.heading,
        start_line=result.start_line,
        end_line=result.end_line,
        original_selection=result.original_selection,
        narration_text=result.narration_text,
        word_count=result.word_count,
        paragraph_count=result.paragraph_count,
    )
    persist_extraction(
        project,
        original_selection=result.original_selection,
        narration_text=result.narration_text,
        metadata=metadata_again,
    )
    second = {
        path.name: path.read_bytes()
        for path in [tmp_path / "manifest.json", *(tmp_path / "source").iterdir()]
    }
    assert first == second
    assert validate_manifest(tmp_path).source.word_count == 942
