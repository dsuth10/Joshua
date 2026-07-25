"""Narration-plan contracts and source-faithful plan construction."""

from __future__ import annotations

import re
from datetime import UTC, datetime
from pathlib import Path
from typing import Literal

import yaml
from pydantic import Field, model_validator

from audiobook_studio.chunking import ChunkDraft, ParsedParagraph, build_chunks, parse_paragraphs
from audiobook_studio.contracts import LoadedProject, StrictModel
from audiobook_studio.errors import ConfigurationError, SourceSelectionError
from audiobook_studio.hashing import sha256_text
from audiobook_studio.project_store import atomic_write_bytes


class PronunciationReplacement(StrictModel):
    key: str
    source: str
    replacement: str
    start: int = Field(ge=0)
    end: int = Field(ge=0)


class NarrationChunk(StrictModel):
    chunk_id: str
    source_paragraph_ids: list[str] = Field(min_length=1)
    source_text: str
    spoken_text: str
    style: Literal["reflective", "remembered_speech", "tense", "neutral"]
    emotion_strength: float = Field(ge=0, le=1)
    pause_before_ms: int = Field(ge=0, le=2000)
    pause_after_ms: int = Field(ge=0, le=2000)
    emphasis_spans: list[str] = Field(default_factory=list)
    pronunciation_keys: list[str] = Field(default_factory=list)
    replacements: list[PronunciationReplacement] = Field(default_factory=list)
    source_text_sha256: str
    spoken_text_sha256: str

    @model_validator(mode="after")
    def verify_hashes_and_spans(self) -> NarrationChunk:
        if sha256_text(self.source_text) != self.source_text_sha256:
            raise ValueError("source_text_sha256 does not match source_text")
        if sha256_text(self.spoken_text) != self.spoken_text_sha256:
            raise ValueError("spoken_text_sha256 does not match spoken_text")
        if any(span not in self.source_text for span in self.emphasis_spans):
            raise ValueError("emphasis spans must be exact source substrings")
        return self


class NarrationPlan(StrictModel):
    schema_version: Literal[1] = 1
    project_id: str
    source_text_sha256: str
    voice_profile_sha256: str
    lexicon_sha256: str | None
    planner: Literal["ollama", "deterministic_fallback"]
    planner_model: str
    warnings: list[str] = Field(default_factory=list)
    created_at: datetime
    chunks: list[NarrationChunk] = Field(min_length=1)

    @model_validator(mode="after")
    def unique_chunks(self) -> NarrationPlan:
        ids = [chunk.chunk_id for chunk in self.chunks]
        if len(ids) != len(set(ids)):
            raise ValueError("chunk IDs must be unique")
        return self


class LexiconEntry(StrictModel):
    say_as: str
    enabled: bool = False
    source: str
    notes: str = ""


class PronunciationLexicon(StrictModel):
    schema_version: Literal[1] = 1
    language: str
    application_policy: str
    entries: dict[str, LexiconEntry]


def load_lexicon(path: Path | None) -> PronunciationLexicon | None:
    if path is None:
        return None
    try:
        return PronunciationLexicon.model_validate(yaml.safe_load(path.read_text(encoding="utf-8")))
    except Exception as exc:
        raise ConfigurationError(f"Invalid pronunciation lexicon {path}: {exc}") from exc


def apply_lexicon(
    text: str, lexicon: PronunciationLexicon | None
) -> tuple[str, list[PronunciationReplacement]]:
    if lexicon is None:
        return text, []
    replacements: list[PronunciationReplacement] = []
    spoken = text
    offset = 0
    for key, entry in lexicon.entries.items():
        if not entry.enabled or entry.source != "human_approved":
            continue
        pattern = re.compile(rf"(?<!\w){re.escape(key)}(?!\w)", re.IGNORECASE)
        while match := pattern.search(spoken, offset):
            replacement = entry.say_as
            replacements.append(
                PronunciationReplacement(
                    key=key,
                    source=match.group(0),
                    replacement=replacement,
                    start=match.start(),
                    end=match.start() + len(replacement),
                )
            )
            spoken = spoken[: match.start()] + replacement + spoken[match.end() :]
            offset = match.start() + len(replacement)
    return spoken, replacements


def _defaults(
    chunk: ChunkDraft, paragraph: ParsedParagraph
) -> tuple[
    Literal["reflective", "remembered_speech", "tense", "neutral"],
    float,
    int,
    int,
    list[str],
]:
    lower = chunk.source_text.lower()
    dangerous = any(term in lower for term in ("dangerous place", "fire", "human", "hurt you"))
    remembered = chunk.paragraph_kind == "remembered_speech" or bool(paragraph.spans)
    style: Literal["reflective", "remembered_speech", "tense", "neutral"] = (
        "tense" if dangerous else ("remembered_speech" if remembered else "reflective")
    )
    return (
        style,
        0.55 if dangerous else (0.3 if remembered else 0.25),
        250 if chunk.ordinal == 1 else 150,
        550 if chunk.ordinal == 1 else 225,
        [span.text for span in paragraph.spans if span.text and span.text in chunk.source_text],
    )


def create_deterministic_plan(project: LoadedProject) -> NarrationPlan:
    original_path = project.project_dir / "source" / "original-selection.md"
    narration_path = project.project_dir / "source" / "narration-text.txt"
    if not original_path.is_file() or not narration_path.is_file():
        raise SourceSelectionError("run audiobook extract before audiobook plan")
    original = original_path.read_text(encoding="utf-8")
    narration = narration_path.read_text(encoding="utf-8")
    paragraphs = parse_paragraphs(original)
    plain = "\n\n".join(paragraph.source_text for paragraph in paragraphs) + "\n"
    if plain != narration:
        raise SourceSelectionError("parsed paragraph text does not reproduce narration-text.txt")
    lexicon = load_lexicon(project.lexicon_path)
    by_id = {paragraph.paragraph_id: paragraph for paragraph in paragraphs}
    chunks: list[NarrationChunk] = []
    for draft in build_chunks(paragraphs):
        paragraph = by_id[draft.paragraph_id]
        spoken, replacements = apply_lexicon(draft.source_text, lexicon)
        style, emotion, pause_before, pause_after, emphasis = _defaults(draft, paragraph)
        chunks.append(
            NarrationChunk(
                chunk_id=draft.chunk_id,
                source_paragraph_ids=[draft.paragraph_id],
                source_text=draft.source_text,
                spoken_text=spoken,
                pronunciation_keys=[replacement.key for replacement in replacements],
                replacements=replacements,
                source_text_sha256=sha256_text(draft.source_text),
                spoken_text_sha256=sha256_text(spoken),
                style=style,
                emotion_strength=emotion,
                pause_before_ms=pause_before,
                pause_after_ms=pause_after,
                emphasis_spans=emphasis,
            )
        )
    profile_path = (
        project.workspace_root
        / "Audiobook_Studio"
        / "configurations"
        / "voices"
        / f"{project.config.voice.profile}.yaml"
    )
    from audiobook_studio.hashing import sha256_file

    return NarrationPlan(
        project_id=project.config.project_id,
        source_text_sha256=sha256_text(narration),
        voice_profile_sha256=sha256_file(profile_path),
        lexicon_sha256=sha256_file(project.lexicon_path) if project.lexicon_path else None,
        planner="deterministic_fallback",
        planner_model=project.config.planning.ollama_model,
        warnings=[],
        created_at=datetime.now(UTC),
        chunks=chunks,
    )


def create_plan(project: LoadedProject) -> NarrationPlan:
    """Build the safe deterministic plan, then overlay validated local annotations."""

    plan = create_deterministic_plan(project)
    if not project.config.planning.use_llm_annotations:
        return plan
    try:
        from audiobook_studio.ollama_client import annotate_chunks, unload_model

        annotations = annotate_chunks(
            plan.chunks,
            model=project.config.planning.ollama_model,
            temperature=project.config.planning.temperature,
        )
        by_id = {annotation.chunk_id: annotation for annotation in annotations}
        chunks = [
            chunk.model_copy(
                update={
                    "style": by_id[chunk.chunk_id].style,
                    "emotion_strength": by_id[chunk.chunk_id].emotion_strength,
                    "pause_before_ms": by_id[chunk.chunk_id].pause_before_ms,
                    "pause_after_ms": by_id[chunk.chunk_id].pause_after_ms,
                    "emphasis_spans": by_id[chunk.chunk_id].emphasis_spans,
                }
            )
            for chunk in plan.chunks
        ]
        unload_model(project.config.planning.ollama_model)
        return plan.model_copy(update={"planner": "ollama", "chunks": chunks})
    except Exception as exc:
        try:
            from audiobook_studio.ollama_client import unload_model

            unload_model(project.config.planning.ollama_model)
        except Exception:
            pass
        return plan.model_copy(
            update={
                "warnings": [
                    "Ollama annotations unavailable or invalid; deterministic defaults used: "
                    f"{type(exc).__name__}: {exc}"
                ]
            }
        )


def persist_plan(project: LoadedProject, plan: NarrationPlan) -> Path:
    path = project.project_dir / "planning" / "narration-plan.json"
    atomic_write_bytes(path, (plan.model_dump_json(indent=2) + "\n").encode("utf-8"))
    return path
