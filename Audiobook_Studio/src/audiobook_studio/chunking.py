"""Deterministic paragraph parsing and stable narration chunk construction."""

from __future__ import annotations

import re
from dataclasses import dataclass
from itertools import pairwise
from typing import Literal

from audiobook_studio.errors import SourceSelectionError

SpanKind = Literal["bold", "italic"]
ParagraphKind = Literal[
    "bold_opening",
    "internal_thought",
    "remembered_speech",
    "normal",
]

_MARKUP_RE = re.compile(r"(\*\*\*|\*\*|\*)")
_WORD_RE = re.compile(r"\b[\w]+(?:[’'-][\w]+)*\b", re.UNICODE)
_SENTENCE_END_RE = re.compile(r"(?<=[.!?])(?:[”’\"']?)(?=\s+[A-Z*])")
_ABBREVIATIONS = ("Mr.", "Mrs.", "Ms.", "Dr.", "St.", "e.g.", "i.e.")


@dataclass(frozen=True)
class FormattingSpan:
    kind: SpanKind
    text: str


@dataclass(frozen=True)
class ParsedParagraph:
    paragraph_id: str
    source_text: str
    kind: ParagraphKind
    spans: tuple[FormattingSpan, ...]


@dataclass(frozen=True)
class ChunkDraft:
    chunk_id: str
    paragraph_id: str
    source_text: str
    paragraph_kind: ParagraphKind
    ordinal: int


def word_count(text: str) -> int:
    return len(_WORD_RE.findall(text))


def _plain_markdown(text: str) -> str:
    return _MARKUP_RE.sub("", text).strip()


def parse_paragraphs(original_selection: str) -> list[ParsedParagraph]:
    """Parse prose blocks while retaining performance-relevant Markdown spans."""

    blocks = [block.strip() for block in re.split(r"\n\s*\n", original_selection)]
    prose = [
        block
        for block in blocks
        if block and not block.startswith("#") and block not in {"***", "---", "___"}
    ]
    paragraphs: list[ParsedParagraph] = []
    for index, block in enumerate(prose, start=1):
        spans: list[FormattingSpan] = []
        for match in re.finditer(r"\*\*(.+?)\*\*", block, flags=re.DOTALL):
            spans.append(FormattingSpan(kind="bold", text=_plain_markdown(match.group(1))))
        for match in re.finditer(r"(?<!\*)\*([^*]+?)\*(?!\*)", block, flags=re.DOTALL):
            spans.append(FormattingSpan(kind="italic", text=_plain_markdown(match.group(1))))
        plain = _plain_markdown(block)
        if not plain:
            continue
        if block.startswith("**"):
            kind: ParagraphKind = "bold_opening"
        elif spans and plain.startswith(spans[0].text):
            kind = "remembered_speech"
        elif spans:
            kind = "internal_thought"
        else:
            kind = "normal"
        paragraphs.append(
            ParsedParagraph(
                paragraph_id=f"p{index:03d}",
                source_text=plain,
                kind=kind,
                spans=tuple(spans),
            )
        )
    return paragraphs


def split_sentences(text: str) -> list[str]:
    """Split conservatively at sentence punctuation with stable results."""

    protected = text
    sentinels: dict[str, str] = {}
    for index, abbreviation in enumerate(_ABBREVIATIONS):
        token = f"__ABBR_{index}__"
        sentinels[token] = abbreviation
        protected = protected.replace(abbreviation, abbreviation.replace(".", token))
    boundaries = [0]
    for match in _SENTENCE_END_RE.finditer(protected):
        boundaries.append(match.end())
    boundaries.append(len(protected))
    sentences: list[str] = []
    for start, end in pairwise(boundaries):
        sentence = protected[start:end].strip()
        for token, abbreviation in sentinels.items():
            sentence = sentence.replace(abbreviation.replace(".", token), abbreviation)
        if sentence:
            sentences.append(sentence)
    return sentences


def _split_hard(sentence: str, hard_max_words: int) -> list[str]:
    words = sentence.split()
    return [
        " ".join(words[index : index + hard_max_words])
        for index in range(0, len(words), hard_max_words)
    ]


def build_chunks(
    paragraphs: list[ParsedParagraph],
    *,
    preferred_min_words: int = 35,
    soft_max_words: int = 75,
    hard_max_words: int = 90,
) -> list[ChunkDraft]:
    """Build paragraph-local chunks with IDs stable under unrelated edits."""

    if not (0 < preferred_min_words <= soft_max_words <= hard_max_words):
        raise ValueError("invalid chunk word limits")
    chunks: list[ChunkDraft] = []
    for paragraph in paragraphs:
        units: list[str] = []
        for sentence in split_sentences(paragraph.source_text):
            if word_count(sentence) > hard_max_words:
                units.extend(_split_hard(sentence, hard_max_words))
            else:
                units.append(sentence)
        current: list[str] = []
        ordinal = 1
        for unit in units:
            candidate = " ".join([*current, unit])
            if current and word_count(candidate) > soft_max_words:
                chunks.append(
                    ChunkDraft(
                        chunk_id=f"{paragraph.paragraph_id}-c{ordinal:02d}",
                        paragraph_id=paragraph.paragraph_id,
                        source_text=" ".join(current),
                        paragraph_kind=paragraph.kind,
                        ordinal=ordinal,
                    )
                )
                ordinal += 1
                current = [unit]
            else:
                current.append(unit)
        if current:
            chunks.append(
                ChunkDraft(
                    chunk_id=f"{paragraph.paragraph_id}-c{ordinal:02d}",
                    paragraph_id=paragraph.paragraph_id,
                    source_text=" ".join(current),
                    paragraph_kind=paragraph.kind,
                    ordinal=ordinal,
                )
            )
    if any(word_count(chunk.source_text) > hard_max_words for chunk in chunks):
        raise SourceSelectionError("deterministic chunking exceeded the hard word limit")
    return chunks
