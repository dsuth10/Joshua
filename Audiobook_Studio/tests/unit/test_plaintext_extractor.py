from pathlib import Path

import pytest

from audiobook_studio.contracts import (
    LineRangeSelector,
    LiteralStartEndSelector,
    ParagraphRangeSelector,
    WholeDocumentSelector,
)
from audiobook_studio.errors import SourceSelectionError
from audiobook_studio.extractors.plaintext import PlainTextExtractor


def test_utf8_bom_and_paragraph_range(tmp_path: Path) -> None:
    source = tmp_path / "sample.txt"
    source.write_text("First paragraph.\n\nSecond paragraph.\n\nThird.", encoding="utf-8-sig")
    extractor = PlainTextExtractor()
    index = extractor.inspect(source)
    assert len(index.paragraphs) == 3
    result = extractor.extract(
        source,
        ParagraphRangeSelector(type="paragraph_range", start_paragraph=2, end_paragraph=3),
    )
    assert result.narration_text == "Second paragraph.\n\nThird.\n"


def test_literal_anchors_must_be_unique_and_long(tmp_path: Path) -> None:
    source = tmp_path / "sample.txt"
    anchor = "This anchor is deliberately unique."
    source.write_text(f"{anchor}\n\nMiddle.\n\n{anchor}", encoding="utf-8")
    selector = LiteralStartEndSelector(
        type="literal_start_end",
        start_anchor=anchor,
        end_anchor="Middle paragraph ending anchor.",
    )
    with pytest.raises(SourceSelectionError, match="exactly once"):
        PlainTextExtractor().extract(source, selector)


def test_whole_document_preserves_paragraphs(tmp_path: Path) -> None:
    source = tmp_path / "sample.txt"
    source.write_text("One.\n\nTwo.", encoding="utf-8")
    result = PlainTextExtractor().extract(source, WholeDocumentSelector(type="whole_document"))
    assert result.paragraph_count == 2


def test_inclusive_line_range(tmp_path: Path) -> None:
    source = tmp_path / "sample.txt"
    source.write_text("one\ntwo\nthree\nfour\n", encoding="utf-8")
    result = PlainTextExtractor().extract(
        source,
        LineRangeSelector(type="line_range", start_line=2, end_line=3),
    )
    assert result.narration_text == "two\nthree\n"
    assert (result.start_line, result.end_line) == (2, 3)
