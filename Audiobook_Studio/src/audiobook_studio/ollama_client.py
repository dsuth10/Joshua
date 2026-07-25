"""Schema-constrained local Ollama annotation client."""

from __future__ import annotations

from typing import Literal

import httpx
from pydantic import Field, ValidationError

from audiobook_studio.contracts import StrictModel
from audiobook_studio.narration_plan import NarrationChunk


class ChunkAnnotation(StrictModel):
    chunk_id: str
    style: Literal["reflective", "remembered_speech", "tense", "neutral"]
    emotion_strength: float = Field(
        ge=0,
        le=1,
        description="Restrained emotion as a decimal from 0.0 through 1.0, never a percentage.",
    )
    pause_before_ms: int = Field(ge=0, le=2000)
    pause_after_ms: int = Field(ge=0, le=2000)
    emphasis_spans: list[str] = Field(default_factory=list)
    pronunciation_candidates: list[str] = Field(default_factory=list)


class AnnotationSet(StrictModel):
    annotations: list[ChunkAnnotation]


def annotate_chunks(
    chunks: list[NarrationChunk],
    *,
    model: str,
    temperature: float,
    endpoint: str = "http://127.0.0.1:11434",
    timeout_seconds: float = 180,
) -> list[ChunkAnnotation]:
    """Request annotations only and reject any structurally unsafe response."""

    payload_chunks = [
        {"chunk_id": chunk.chunk_id, "source_text": chunk.source_text} for chunk in chunks
    ]
    prompt = (
        "Annotate each immutable audiobook chunk. Return exactly one annotation for every "
        "chunk_id. Never rewrite or return narration text. Emphasis spans must be exact "
        "substrings of that chunk. Use restrained audiobook emotion. emotion_strength MUST "
        "be a decimal between 0.0 and 1.0 inclusive; never use a 1-10 scale or percentage.\n\n"
        f"Chunks: {payload_chunks}"
    )
    payload: dict[str, object] = {
        "model": model,
        "prompt": prompt,
        "stream": False,
        "format": AnnotationSet.model_json_schema(),
        "options": {"temperature": temperature},
        "keep_alive": 0,
        "think": False,
    }
    with httpx.Client(timeout=timeout_seconds) as client:
        validation_error: ValidationError | None = None
        result: AnnotationSet | None = None
        for _attempt in range(2):
            response = client.post(f"{endpoint.rstrip('/')}/api/generate", json=payload)
            response.raise_for_status()
            try:
                result = AnnotationSet.model_validate_json(response.json()["response"])
                break
            except ValidationError as exc:
                validation_error = exc
                payload["prompt"] = (
                    prompt
                    + "\n\nYour previous response violated the JSON Schema. Correct it. "
                    + str(exc)
                )
        if result is None:
            assert validation_error is not None
            raise validation_error
    expected = {chunk.chunk_id: chunk for chunk in chunks}
    actual_ids = [annotation.chunk_id for annotation in result.annotations]
    if len(actual_ids) != len(set(actual_ids)) or set(actual_ids) != set(expected):
        raise ValueError("Ollama annotations must contain each known chunk ID exactly once")
    for annotation in result.annotations:
        source = expected[annotation.chunk_id].source_text
        if any(span not in source for span in annotation.emphasis_spans):
            raise ValueError(
                f"Ollama returned a non-source emphasis span for {annotation.chunk_id}"
            )
    return result.annotations


def unload_model(
    model: str, endpoint: str = "http://127.0.0.1:11434", timeout_seconds: float = 30
) -> None:
    with httpx.Client(timeout=timeout_seconds) as client:
        response = client.post(
            f"{endpoint.rstrip('/')}/api/generate",
            json={"model": model, "prompt": "", "stream": False, "keep_alive": 0},
        )
        response.raise_for_status()
