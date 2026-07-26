"""UTF-8 plain-text extraction with stable paragraph ranges."""

import re
from pathlib import Path

from audiobook_studio.contracts import (
    DocumentIndex,
    DocumentParagraph,
    ExtractedSelection,
    LineRangeSelector,
    Selector,
)
from audiobook_studio.errors import SourceSelectionError
from audiobook_studio.extractors.markdown import count_words
from audiobook_studio.extractors.structured import select_paragraphs


class PlainTextExtractor:
    def _read(self, source: Path) -> str:
        try:
            return source.read_text(encoding="utf-8-sig")
        except UnicodeDecodeError as exc:
            raise SourceSelectionError(f"Text source is not valid UTF-8: {source}") from exc

    def _paragraphs(self, source: Path) -> list[str]:
        return [
            paragraph.strip()
            for paragraph in re.split(r"(?:\r?\n){2,}", self._read(source))
            if paragraph.strip()
        ]

    def inspect(self, source: Path) -> DocumentIndex:
        paragraphs = self._paragraphs(source)
        return DocumentIndex(
            source_path=str(source),
            source_format="text",
            headings=[],
            paragraphs=[
                DocumentParagraph(
                    paragraph_id=f"p{index:04d}",
                    text=paragraph,
                    location=f"paragraph:{index}",
                )
                for index, paragraph in enumerate(paragraphs, start=1)
            ],
        )

    def extract(self, source: Path, selector: Selector) -> ExtractedSelection:
        if isinstance(selector, LineRangeSelector):
            lines = self._read(source).splitlines()
            if selector.end_line > len(lines):
                raise SourceSelectionError(
                    f"line range ends at {selector.end_line}; document has {len(lines)} lines"
                )
            chosen_lines = lines[selector.start_line - 1 : selector.end_line]
            narration = "\n".join(chosen_lines).strip() + "\n"
            paragraphs = [
                item.strip() for item in re.split(r"(?:\r?\n){2,}", narration) if item.strip()
            ]
            return ExtractedSelection(
                source_path=str(source),
                selector=selector,
                heading=source.stem,
                start_line=selector.start_line,
                end_line=selector.end_line,
                original_selection=narration,
                narration_text=narration,
                word_count=count_words(narration),
                paragraph_count=len(paragraphs),
            )
        selected, heading, start, end = select_paragraphs(self._paragraphs(source), selector)
        narration = "\n\n".join(selected).strip() + "\n"
        return ExtractedSelection(
            source_path=str(source),
            selector=selector,
            heading=heading,
            start_line=start,
            end_line=end,
            original_selection=narration,
            narration_text=narration,
            word_count=count_words(narration),
            paragraph_count=len(selected),
        )
