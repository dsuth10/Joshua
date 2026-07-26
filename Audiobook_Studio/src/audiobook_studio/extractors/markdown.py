"""Deterministic Markdown inspection and generalized selection."""

import re
from pathlib import Path

from audiobook_studio.contracts import (
    DocumentIndex,
    DocumentParagraph,
    ExtractedSelection,
    Heading,
    HeadingRangeSelector,
    HeadingSelector,
    LineRangeSelector,
    LiteralStartEndSelector,
    PageRangeSelector,
    ParagraphRangeSelector,
    Selector,
    WholeDocumentSelector,
)
from audiobook_studio.errors import SourceSelectionError
from audiobook_studio.selectors import normalise_heading

ATX_HEADING_RE = re.compile(r"^(#{1,6})[ \t]+(.+?)[ \t]*#*[ \t]*$")
SETEXT_RE = re.compile(r"^[ \t]*(=+|-+)[ \t]*$")
FENCE_RE = re.compile(r"^[ \t]*(```|~~~)")
THEMATIC_RE = re.compile(r"^[ \t]*(?:\*{3,}|-{3,}|_{3,})[ \t]*$")
EMPHASIS_RE = re.compile(r"(?<!\\)[*_]")
IMAGE_RE = re.compile(r"!\[([^\]]*)\]\([^)]+\)")
LINK_RE = re.compile(r"\[([^\]]+)\]\([^)]+\)")
FOOTNOTE_DEF_RE = re.compile(r"^[ \t]*\[\^[^\]]+\]:.*$", re.MULTILINE)
FOOTNOTE_REF_RE = re.compile(r"\[\^[^\]]+\]")
WORD_RE = re.compile(r"[^\W_]+(?:[’'-][^\W_]+)*", re.UNICODE)


def count_words(value: str) -> int:
    return len(WORD_RE.findall(value))


def split_prose_paragraphs(value: str) -> list[str]:
    return [
        paragraph.strip()
        for paragraph in re.split(r"(?:\r?\n){2,}", value)
        if paragraph.strip() and not THEMATIC_RE.fullmatch(paragraph.strip())
    ]


def strip_markdown_for_narration(value: str) -> str:
    lines = value.splitlines()
    while lines and not lines[-1].strip():
        lines.pop()
    while lines and THEMATIC_RE.fullmatch(lines[-1].strip()):
        lines.pop()
        while lines and not lines[-1].strip():
            lines.pop()
    cleaned = "\n".join(lines)
    cleaned = FOOTNOTE_DEF_RE.sub("", cleaned)
    cleaned = IMAGE_RE.sub("", cleaned)
    cleaned = LINK_RE.sub(r"\1", cleaned)
    cleaned = FOOTNOTE_REF_RE.sub("", cleaned)
    cleaned = re.sub(r"^[ \t]*>[ \t]?", "", cleaned, flags=re.MULTILINE)
    cleaned = re.sub(r"^#{1,6}[ \t]+.*$", "", cleaned, flags=re.MULTILINE)
    cleaned = re.sub(r"^.*\n[=-]+[ \t]*$", "", cleaned, flags=re.MULTILINE)
    cleaned = EMPHASIS_RE.sub("", cleaned)
    cleaned = re.sub(r"\n{3,}", "\n\n", cleaned)
    return cleaned.strip() + "\n"


class MarkdownExtractor:
    def _read(self, source: Path) -> tuple[str, list[str]]:
        try:
            text = source.read_text(encoding="utf-8-sig")
        except UnicodeDecodeError as exc:
            raise SourceSelectionError(f"Markdown source is not valid UTF-8: {source}") from exc
        return text, text.splitlines(keepends=True)

    def _headings(self, lines: list[str]) -> list[Heading]:
        headings: list[Heading] = []
        fence_marker: str | None = None
        index = 0
        while index < len(lines):
            line = lines[index].rstrip("\r\n")
            fence = FENCE_RE.match(line)
            if fence:
                marker = fence.group(1)
                fence_marker = marker if fence_marker is None else None
                index += 1
                continue
            if fence_marker is not None:
                index += 1
                continue
            if match := ATX_HEADING_RE.match(line):
                headings.append(
                    Heading(
                        level=len(match.group(1)),
                        text=match.group(2).strip(),
                        line_number=index + 1,
                    )
                )
            elif (
                index + 1 < len(lines)
                and line.strip()
                and (setext := SETEXT_RE.match(lines[index + 1].rstrip("\r\n")))
            ):
                headings.append(
                    Heading(
                        level=1 if setext.group(1).startswith("=") else 2,
                        text=line.strip(),
                        line_number=index + 1,
                    )
                )
                index += 1
            index += 1
        return headings

    def inspect(self, source: Path) -> DocumentIndex:
        text, lines = self._read(source)
        raw_paragraphs = [
            paragraph.strip()
            for paragraph in re.split(r"(?:\r?\n){2,}", text)
            if paragraph.strip() and not THEMATIC_RE.fullmatch(paragraph.strip())
        ]
        paragraph_records: list[DocumentParagraph] = []
        for raw in raw_paragraphs:
            narration = strip_markdown_for_narration(raw).strip()
            if not narration:
                continue
            paragraph_records.append(
                DocumentParagraph(
                    paragraph_id=f"p{len(paragraph_records) + 1:04d}",
                    text=narration,
                    location=f"paragraph:{len(paragraph_records) + 1}",
                    block_quote=raw.lstrip().startswith(">"),
                )
            )
        return DocumentIndex(
            source_path=str(source),
            source_format="markdown",
            headings=self._headings(lines),
            paragraphs=paragraph_records,
        )

    def extract(self, source: Path, selector: Selector) -> ExtractedSelection:
        text, lines = self._read(source)
        headings = self._headings(lines)
        if isinstance(selector, WholeDocumentSelector):
            start_index, end_index, heading, skip_heading = 0, len(lines), source.stem, False
        elif isinstance(selector, HeadingSelector):
            start = self._unique_heading(headings, selector.heading, "Heading")
            following = [
                item
                for item in headings
                if item.line_number > start.line_number and item.level <= start.level
            ]
            start_index = start.line_number - 1
            end_index = following[0].line_number - 1 if following else len(lines)
            heading, skip_heading = start.text, True
        elif isinstance(selector, HeadingRangeSelector):
            start = self._unique_heading(headings, selector.start_heading, "Start heading")
            end = self._unique_heading(headings, selector.end_before_heading, "End heading")
            if end.line_number <= start.line_number:
                raise SourceSelectionError("End heading must occur after the start heading")
            start_index, end_index = start.line_number - 1, end.line_number - 1
            heading, skip_heading = start.text, True
        elif isinstance(selector, ParagraphRangeSelector):
            return self._paragraph_range(source, selector, text)
        elif isinstance(selector, LiteralStartEndSelector):
            return self._literal(source, selector, text)
        elif isinstance(selector, PageRangeSelector):
            raise SourceSelectionError("Markdown does not provide physical page ranges")
        elif isinstance(selector, LineRangeSelector):
            raise SourceSelectionError("line_range is supported only for plain-text sources")
        else:
            raise SourceSelectionError(f"unsupported Markdown selector: {selector.type}")
        original = "".join(lines[start_index:end_index]).rstrip() + "\n"
        body_start = start_index + 1 if skip_heading else start_index
        narration = strip_markdown_for_narration("".join(lines[body_start:end_index]))
        paragraphs = split_prose_paragraphs(narration)
        return ExtractedSelection(
            source_path=str(source),
            selector=selector,
            heading=heading,
            start_line=start_index + 1,
            end_line=end_index,
            original_selection=original,
            narration_text=narration,
            word_count=count_words(narration),
            paragraph_count=len(paragraphs),
        )

    def _unique_heading(self, headings: list[Heading], wanted: str, label: str) -> Heading:
        matches = [
            item for item in headings if normalise_heading(item.text) == normalise_heading(wanted)
        ]
        if len(matches) != 1:
            raise SourceSelectionError(
                f"{label} must match exactly once; found {len(matches)}: {wanted!r}"
            )
        return matches[0]

    def _paragraph_range(
        self, source: Path, selector: ParagraphRangeSelector, text: str
    ) -> ExtractedSelection:
        paragraphs = split_prose_paragraphs(strip_markdown_for_narration(text))
        if selector.end_paragraph > len(paragraphs):
            raise SourceSelectionError(
                f"paragraph range ends at {selector.end_paragraph}; document has "
                f"{len(paragraphs)} paragraphs"
            )
        chosen = paragraphs[selector.start_paragraph - 1 : selector.end_paragraph]
        narration = "\n\n".join(chosen) + "\n"
        return ExtractedSelection(
            source_path=str(source),
            selector=selector,
            heading=source.stem,
            start_line=selector.start_paragraph,
            end_line=selector.end_paragraph,
            original_selection=narration,
            narration_text=narration,
            word_count=count_words(narration),
            paragraph_count=len(chosen),
        )

    def _literal(
        self, source: Path, selector: LiteralStartEndSelector, text: str
    ) -> ExtractedSelection:
        if text.count(selector.start_anchor) != 1 or text.count(selector.end_anchor) != 1:
            raise SourceSelectionError("literal anchors must each occur exactly once")
        start = text.index(selector.start_anchor)
        end = text.index(selector.end_anchor, start)
        if end <= start:
            raise SourceSelectionError("literal end anchor must follow the start anchor")
        end += len(selector.end_anchor) if selector.include_end else 0
        original = text[start:end].strip() + "\n"
        narration = strip_markdown_for_narration(original)
        return ExtractedSelection(
            source_path=str(source),
            selector=selector,
            heading=source.stem,
            start_line=text[:start].count("\n") + 1,
            end_line=text[:end].count("\n") + 1,
            original_selection=original,
            narration_text=narration,
            word_count=count_words(narration),
            paragraph_count=len(split_prose_paragraphs(narration)),
        )
