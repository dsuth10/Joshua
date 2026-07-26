"""Physical-page PDF extraction with scanned-page detection."""

import re
from pathlib import Path

from audiobook_studio.contracts import (
    DocumentIndex,
    DocumentParagraph,
    ExtractedSelection,
    PageLabel,
    PageRangeSelector,
    Selector,
    WholeDocumentSelector,
)
from audiobook_studio.errors import SourceSelectionError
from audiobook_studio.extractors.markdown import count_words


class PdfExtractor:
    def _pages(self, source: Path) -> list[str]:
        try:
            from pypdf import PdfReader
        except ImportError as exc:
            raise SourceSelectionError("PDF support requires pypdf") from exc
        pages = [(page.extract_text() or "").strip() for page in PdfReader(source).pages]
        scanned = [index for index, text in enumerate(pages, start=1) if len(text) < 20]
        if scanned:
            raise SourceSelectionError(
                "OCR required: likely scanned or text-empty PDF pages: "
                + ", ".join(map(str, scanned))
            )
        return pages

    def inspect(self, source: Path) -> DocumentIndex:
        pages = self._pages(source)
        paragraphs: list[DocumentParagraph] = []
        for page_number, text in enumerate(pages, start=1):
            for ordinal, paragraph in enumerate(re.split(r"\n\s*\n", text), start=1):
                if paragraph.strip():
                    paragraphs.append(
                        DocumentParagraph(
                            paragraph_id=f"page{page_number:04d}-p{ordinal:03d}",
                            text=paragraph.strip(),
                            location=f"page:{page_number}:paragraph:{ordinal}",
                        )
                    )
        return DocumentIndex(
            source_path=str(source),
            source_format="pdf",
            headings=[],
            paragraphs=paragraphs,
            page_labels=[
                PageLabel(
                    page_number=index,
                    label=str(index),
                    character_count=len(text),
                )
                for index, text in enumerate(pages, start=1)
            ],
        )

    def extract(self, source: Path, selector: Selector) -> ExtractedSelection:
        pages = self._pages(source)
        if isinstance(selector, PageRangeSelector):
            if selector.end_page > len(pages):
                raise SourceSelectionError(
                    f"page range ends at {selector.end_page}; PDF has {len(pages)} pages"
                )
            chosen = pages[selector.start_page - 1 : selector.end_page]
            start, end = selector.start_page, selector.end_page
        elif isinstance(selector, WholeDocumentSelector):
            chosen, start, end = pages, 1, len(pages)
        else:
            raise SourceSelectionError(
                "PDF extraction currently supports whole_document and page_range selectors"
            )
        narration = "\n\n".join(chosen).strip() + "\n"
        paragraphs = [item for item in re.split(r"\n\s*\n", narration) if item.strip()]
        return ExtractedSelection(
            source_path=str(source),
            selector=selector,
            heading=f"Pages {start}-{end}",
            start_line=start,
            end_line=end,
            original_selection=narration,
            narration_text=narration,
            word_count=count_words(narration),
            paragraph_count=len(paragraphs),
        )
