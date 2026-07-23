from pathlib import Path

import pytest

from audiobook_studio.contracts import HeadingRangeSelector
from audiobook_studio.errors import SourceSelectionError
from audiobook_studio.extractors.markdown import MarkdownExtractor, count_words


@pytest.fixture
def fixture_path() -> Path:
    return Path(__file__).parents[1] / "fixtures" / "sample.md"


@pytest.fixture
def selector() -> HeadingRangeSelector:
    return HeadingRangeSelector(
        type="heading_range",
        start_heading="Target Chapter (Pages 1-2)",
        end_before_heading="Next Chapter (Pages 3-4)",
    )


def test_exact_heading_selection_and_exclusive_end(
    fixture_path: Path, selector: HeadingRangeSelector
) -> None:
    result = MarkdownExtractor().extract(fixture_path, selector)
    assert result.heading == "Target Chapter (Pages 1–2)"
    assert result.original_selection.startswith("# Target Chapter")
    assert "Next Chapter" not in result.original_selection
    assert "outside the selection too" not in result.narration_text


def test_narration_removes_emphasis_and_thematic_separator(
    fixture_path: Path, selector: HeadingRangeSelector
) -> None:
    result = MarkdownExtractor().extract(fixture_path, selector)
    assert "**" not in result.narration_text
    assert "*inside*" not in result.narration_text
    assert "***" not in result.narration_text
    assert "Hello from inside" in result.narration_text
    assert result.paragraph_count == 2


def test_original_selection_preserves_emphasis(
    fixture_path: Path, selector: HeadingRangeSelector
) -> None:
    result = MarkdownExtractor().extract(fixture_path, selector)
    assert "**Hello**" in result.original_selection
    assert "*inside*" in result.original_selection


def test_missing_heading_fails(fixture_path: Path) -> None:
    selector = HeadingRangeSelector(
        type="heading_range",
        start_heading="Missing",
        end_before_heading="Next Chapter (Pages 3-4)",
    )
    with pytest.raises(SourceSelectionError, match="found 0"):
        MarkdownExtractor().extract(fixture_path, selector)


def test_duplicate_heading_fails(tmp_path: Path, selector: HeadingRangeSelector) -> None:
    source = tmp_path / "duplicate.md"
    source.write_text(
        "# Target Chapter (Pages 1–2)\n\nOne.\n\n"
        "# Target Chapter (Pages 1–2)\n\nTwo.\n\n"
        "# Next Chapter (Pages 3–4)\n",
        encoding="utf-8",
    )
    with pytest.raises(SourceSelectionError, match="found 2"):
        MarkdownExtractor().extract(source, selector)


def test_word_counter_keeps_apostrophes_and_hyphens() -> None:
    assert count_words("Don't split a well-known word.") == 5
