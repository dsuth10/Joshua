from audiobook_studio.cache import render_key, seed_for_attempt
from audiobook_studio.hashing import sha256_text
from audiobook_studio.narration_plan import NarrationChunk


def _chunk(text: str = "Exact source.") -> NarrationChunk:
    return NarrationChunk(
        chunk_id="p001-c01",
        source_paragraph_ids=["p001"],
        source_text=text,
        spoken_text=text,
        style="neutral",
        emotion_strength=0.2,
        pause_before_ms=200,
        pause_after_ms=400,
        source_text_sha256=sha256_text(text),
        spoken_text_sha256=sha256_text(text),
    )


def test_render_key_changes_only_when_a_declared_input_changes() -> None:
    values = {
        "backend": "qwen",
        "model_id": "model",
        "model_revision": "rev",
        "voice_profile_hash": "voice",
        "lexicon_hash": "lexicon",
        "settings": {"attention": "sdpa"},
    }
    key = render_key(_chunk(), **values)
    assert key == render_key(_chunk(), **values)
    assert key != render_key(_chunk("Changed."), **values)


def test_retry_seeds_are_stable_and_distinct() -> None:
    assert seed_for_attempt("abc", 1) == seed_for_attempt("abc", 1)
    assert seed_for_attempt("abc", 1) != seed_for_attempt("abc", 2)
