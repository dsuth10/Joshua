"""Ordered source extraction for multi-chapter projects."""

from pathlib import Path

from audiobook_studio.contracts import ExtractedSelection, LoadedProject, Manifest
from audiobook_studio.extractors import get_extractor
from audiobook_studio.project_store import atomic_write_bytes


def extract_ordered_chapters(
    project: LoadedProject,
) -> list[tuple[str, str, ExtractedSelection]]:
    extractor = get_extractor(project.config.source)
    results: list[tuple[str, str, ExtractedSelection]] = []
    for chapter in project.config.source.selections:
        selection = extractor.extract(project.source_path, chapter.selector)
        chapter_dir = project.project_dir / "chapters" / chapter.chapter_id / "source"
        atomic_write_bytes(
            chapter_dir / "original-selection.md",
            selection.original_selection.encode("utf-8"),
        )
        atomic_write_bytes(
            chapter_dir / "narration-text.txt",
            selection.narration_text.encode("utf-8"),
        )
        results.append((chapter.chapter_id, chapter.title, selection))
    return results


def chapter_source_paths(project_dir: Path, chapter_id: str) -> tuple[Path, Path]:
    source = project_dir / "chapters" / chapter_id / "source"
    return source / "original-selection.md", source / "narration-text.txt"


def persist_chapter_index(
    project: LoadedProject,
    manifest: Manifest,
    results: list[tuple[str, str, ExtractedSelection]],
) -> Manifest:
    chapters = {
        chapter_id: {
            "title": title,
            "order": order,
            "selector": selection.selector.model_dump(mode="json"),
            "word_count": selection.word_count,
            "paragraph_count": selection.paragraph_count,
            "narration_text": f"chapters/{chapter_id}/source/narration-text.txt",
            "status": "extracted",
        }
        for order, (chapter_id, title, selection) in enumerate(results, start=1)
    }
    updated = manifest.model_copy(update={"chapters": chapters})
    atomic_write_bytes(
        project.project_dir / "manifest.json",
        (updated.model_dump_json(indent=2) + "\n").encode(),
    )
    return updated
