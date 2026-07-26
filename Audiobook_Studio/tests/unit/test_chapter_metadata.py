import pytest

from audiobook_studio.chapter_metadata import ChapterTiming, build_ffmetadata


def test_ffmetadata_contains_ordered_chapter_markers() -> None:
    metadata = build_ffmetadata(
        [
            ChapterTiming("one", "Chapter One", 0, 10_000),
            ChapterTiming("two", "Chapter Two", 10_000, 22_000),
        ]
    )
    assert metadata.count("[CHAPTER]") == 2
    assert "START=10000" in metadata
    assert "title=Chapter Two" in metadata


def test_overlapping_chapters_fail() -> None:
    with pytest.raises(ValueError, match="ordered"):
        build_ffmetadata(
            [
                ChapterTiming("one", "One", 0, 10_000),
                ChapterTiming("two", "Two", 9_000, 12_000),
            ]
        )
