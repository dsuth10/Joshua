"""Content-addressed render keys and deterministic retry seeds."""

import json
from collections.abc import Mapping

from audiobook_studio.hashing import sha256_text
from audiobook_studio.narration_plan import NarrationChunk


def render_key(
    chunk: NarrationChunk,
    *,
    backend: str,
    model_id: str,
    model_revision: str,
    voice_profile_hash: str,
    lexicon_hash: str | None,
    settings: Mapping[str, object],
) -> str:
    values = {
        "spoken_text": chunk.spoken_text,
        "backend": backend,
        "model_id": model_id,
        "model_revision": model_revision,
        "voice_profile_hash": voice_profile_hash,
        "lexicon_hash": lexicon_hash,
        "settings": settings,
    }
    return sha256_text(json.dumps(values, sort_keys=True, separators=(",", ":")))


def seed_for_attempt(key: str, attempt: int) -> int:
    if attempt < 1:
        raise ValueError("attempt must be at least 1")
    return int(sha256_text(f"{key}:{attempt}")[:8], 16) & 0x7FFFFFFF
