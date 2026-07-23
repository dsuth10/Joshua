"""Deterministic Markdown heading inspection and extraction."""

import re
from pathlib import Path

from audiobook_studio.contracts import (
    DocumentIndex,
    ExtractedSelection,
    Heading,
    HeadingRangeSelector,
)
from audiobook_studio.errors import SourceSelectionError
from audiobook_studio.selectors import normalise_heading

ATX_HEADING_RE = re.compile(r"^(#{1,6})[ \t]+(.+?)[ \t]*#*[ \t]*$")
FENCE_RE = re.compile(r"^[ \t]*(```|~~~)")
THEMATIC_RE = re.compile(r"^[ \t]*(?:\*{3,}|-{3,}|_{3,})[ \t]*$")
EMPHASIS_RE = re.compile(r"(?<!\\)[*_]")
WORD_RE = re.compile(r"[^\W_]+(?:[’'-][^\W_]+)*", re.UNICODE)


def count_words(value: str) -> int:
    """Count Unicode words while keeping apostrophes and hyphens inside tokens."""

    return len(WORD_RE.findall(value))


def split_prose_paragraphs(value: str) -> list[str]:
    return [
        paragraph.strip()
        for paragraph in re.split(r"(?:\r?\n){2,}", value)
        if paragraph.strip() and not THEMATIC_RE.fullmatch(paragraph.strip())
    ]


def strip_markdown_for_narration(value: str) -> str:
    """Remove only emphasis markup and terminal thematic separators."""

    lines = value.splitlines()
    while lines and not lines[-1].strip():
        lines.pop()
    while lines and THEMATIC_RE.fullmatch(lines[-1].strip()):
        lines.pop()
        while lines and not lines[-1].strip():
            lines.pop()

    cleaned = EMPHASIS_RE.sub("", "\n".join(lines))
    return cleaned.strip() + "\n"


class MarkdownExtractor:
    def _read(self, source: Path) -> tuple[str, list[str]]:
        try:
            text = source.read_text(encoding="utf-8")
        except UnicodeDecodeError as exc:
            raise SourceSelectionError(f"Markdown source is not valid UTF-8: {source}") from exc
        return text, text.splitlines(keepends=True)

    def _headings(self, lines: list[str]) -> list[Heading]:
        headings: list[Heading] = []
        fence_marker: str | None = None
        for index, raw_line in enumerate(lines, start=1):
            line = raw_line.rstrip("\r\n")
            fence = FENCE_RE.match(line)
            if fence:
                marker = fence.group(1)
                if fence_marker is None:
                    fence_marker = marker
                elif marker == fence_marker:
                    fence_marker = None
                continue
            if fence_marker is not None:
                continue
            match = ATX_HEADING_RE.match(line)
            if match:
                headings.append(
                    Heading(
                        level=len(match.group(1)),
                        text=match.group(2).strip(),
                        line_number=index,
                    )
                )
        return headings

    def inspect(self, source: Path) -> DocumentIndex:
        _, lines = self._read(source)
        return DocumentIndex(
            source_path=str(source),
            source_format="markdown",
            headings=self._headings(lines),
        )

    def extract(self, source: Path, selector: HeadingRangeSelector) -> ExtractedSelection:
        _, lines = self._read(source)
        headings = self._headings(lines)
        wanted_start = normalise_heading(selector.start_heading)
        wanted_end = normalise_heading(selector.end_before_heading)
        starts = [
            heading for heading in headings if normalise_heading(heading.text) == wanted_start
        ]
        ends = [heading for heading in headings if normalise_heading(heading.text) == wanted_end]

        if len(starts) != 1:
            raise SourceSelectionError(
                f"Start heading must match exactly once; found {len(starts)}: "
                f"{selector.start_heading!r}"
            )
        if len(ends) != 1:
            raise SourceSelectionError(
                f"End heading must match exactly once; found {len(ends)}: "
                f"{selector.end_before_heading!r}"
            )

        start = starts[0]
        end = ends[0]
        if end.line_number <= start.line_number:
            raise SourceSelectionError("End heading must occur after the start heading")

        start_index = start.line_number - 1
        end_index = end.line_number - 1
        original_selection = "".join(lines[start_index:end_index]).rstrip() + "\n"
        body = "".join(lines[start_index + 1 : end_index])
        narration_text = strip_markdown_for_narration(body)
        paragraphs = split_prose_paragraphs(narration_text)

        return ExtractedSelection(
            source_path=str(source),
            selector=selector,
            heading=start.text,
            start_line=start.line_number,
            end_line=end.line_number - 1,
            original_selection=original_selection,
            narration_text=narration_text,
            word_count=count_words(narration_text),
            paragraph_count=len(paragraphs),
        )
