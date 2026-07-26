"""Shared deterministic selection for paragraph-oriented formats."""

from dataclasses import dataclass

from audiobook_studio.contracts import (
    HeadingRangeSelector,
    HeadingSelector,
    LiteralStartEndSelector,
    ParagraphRangeSelector,
    Selector,
    WholeDocumentSelector,
)
from audiobook_studio.errors import SourceSelectionError
from audiobook_studio.selectors import normalise_heading


@dataclass(frozen=True)
class StructuralHeading:
    text: str
    level: int
    paragraph_index: int


def select_paragraphs(
    paragraphs: list[str],
    selector: Selector,
    *,
    headings: list[StructuralHeading] | None = None,
) -> tuple[list[str], str, int, int]:
    headings = headings or []
    if isinstance(selector, WholeDocumentSelector):
        return paragraphs, "Whole document", 1, len(paragraphs)
    if isinstance(selector, ParagraphRangeSelector):
        if selector.end_paragraph > len(paragraphs):
            raise SourceSelectionError(
                f"paragraph range ends at {selector.end_paragraph}; document has "
                f"{len(paragraphs)} paragraphs"
            )
        return (
            paragraphs[selector.start_paragraph - 1 : selector.end_paragraph],
            f"Paragraphs {selector.start_paragraph}-{selector.end_paragraph}",
            selector.start_paragraph,
            selector.end_paragraph,
        )
    if isinstance(selector, HeadingSelector):
        start_heading = _unique(headings, selector.heading, "Heading")
        following = [
            item
            for item in headings
            if item.paragraph_index > start_heading.paragraph_index
            and item.level <= start_heading.level
        ]
        end_index = following[0].paragraph_index if following else len(paragraphs)
        return (
            paragraphs[start_heading.paragraph_index + 1 : end_index],
            start_heading.text,
            start_heading.paragraph_index + 2,
            end_index,
        )
    if isinstance(selector, HeadingRangeSelector):
        range_start = _unique(headings, selector.start_heading, "Start heading")
        range_end = _unique(headings, selector.end_before_heading, "End heading")
        if range_end.paragraph_index <= range_start.paragraph_index:
            raise SourceSelectionError("End heading must occur after the start heading")
        return (
            paragraphs[range_start.paragraph_index + 1 : range_end.paragraph_index],
            range_start.text,
            range_start.paragraph_index + 2,
            range_end.paragraph_index,
        )
    if isinstance(selector, LiteralStartEndSelector):
        full_text = "\n\n".join(paragraphs)
        if full_text.count(selector.start_anchor) != 1 or full_text.count(selector.end_anchor) != 1:
            raise SourceSelectionError("literal anchors must each occur exactly once")
        literal_start = full_text.index(selector.start_anchor)
        literal_end = full_text.index(selector.end_anchor, literal_start)
        if literal_end <= literal_start:
            raise SourceSelectionError("literal end anchor must follow the start anchor")
        literal_end += len(selector.end_anchor) if selector.include_end else 0
        chosen = full_text[literal_start:literal_end].split("\n\n")
        return chosen, "Literal selection", 1, len(chosen)
    raise SourceSelectionError(f"selector {selector.type!r} is not supported by this format")


def _unique(headings: list[StructuralHeading], wanted: str, label: str) -> StructuralHeading:
    matches = [
        heading
        for heading in headings
        if normalise_heading(heading.text) == normalise_heading(wanted)
    ]
    if len(matches) != 1:
        raise SourceSelectionError(
            f"{label} must match exactly once; found {len(matches)}: {wanted!r}"
        )
    return matches[0]
