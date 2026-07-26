from pathlib import Path

import pytest
from pypdf import PdfWriter

from audiobook_studio.contracts import PageRangeSelector
from audiobook_studio.errors import SourceSelectionError
from audiobook_studio.extractors.pdf import PdfExtractor


def test_pdf_page_range_is_inclusive(monkeypatch: pytest.MonkeyPatch, tmp_path: Path) -> None:
    source = tmp_path / "sample.pdf"
    source.write_bytes(b"fixture")
    extractor = PdfExtractor()
    monkeypatch.setattr(extractor, "_pages", lambda _: ["Page one.", "Page two.", "Page three."])
    result = extractor.extract(
        source, PageRangeSelector(type="page_range", start_page=2, end_page=3)
    )
    assert result.narration_text == "Page two.\n\nPage three.\n"
    assert result.heading == "Pages 2-3"


def test_scanned_or_empty_pdf_requires_ocr(tmp_path: Path) -> None:
    source = tmp_path / "blank.pdf"
    writer = PdfWriter()
    writer.add_blank_page(width=100, height=100)
    with source.open("wb") as stream:
        writer.write(stream)
    with pytest.raises(SourceSelectionError, match="OCR required"):
        PdfExtractor().inspect(source)
