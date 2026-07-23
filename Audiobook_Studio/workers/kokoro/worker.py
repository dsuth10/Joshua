"""Kokoro-82M worker."""

import sys
from pathlib import Path
from typing import Any

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from common import require_text_and_output, run_worker, sha256_file

VOICES = ["af_heart", "af_bella", "af_nicole", "bf_emma", "bf_isabella"]


def handle(request: dict[str, Any]) -> dict[str, Any]:
    action = request["action"]
    if action == "doctor":
        import kokoro
        import soundfile

        return {
            "data": {
                "backend": "kokoro",
                "kokoro": kokoro.__version__,
                "soundfile": soundfile.__version__,
                "ready": True,
            }
        }
    if action == "list_voices":
        return {"data": {"voices": VOICES}}
    if action == "release":
        return {"data": {"released": True}}
    if action != "synthesize":
        raise ValueError(f"Unsupported Kokoro action: {action}")

    import numpy as np
    import soundfile as sf
    from kokoro import KPipeline

    text, output = require_text_and_output(request)
    settings = request.get("settings", {})
    voice = str(settings.get("speaker", "bf_emma"))
    if voice not in VOICES:
        raise ValueError(f"Unsupported Kokoro voice: {voice}")
    pace = float(settings.get("pace", 1.0))
    pipeline = KPipeline(lang_code=voice[0])
    pieces = [audio for _, _, audio in pipeline(text, voice=voice, speed=pace)]
    if not pieces:
        raise RuntimeError("Kokoro returned no audio")
    audio = np.concatenate(pieces)
    sf.write(output, audio, 24_000, subtype="PCM_16")
    return {
        "sample_rate": 24_000,
        "channels": 1,
        "duration_seconds": len(audio) / 24_000,
        "audio_sha256": sha256_file(output),
        "data": {"voice": voice, "model": request["model_id"]},
    }


if __name__ == "__main__":
    run_worker(handle)
