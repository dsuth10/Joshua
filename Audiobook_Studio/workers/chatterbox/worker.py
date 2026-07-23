"""Chatterbox Multilingual V3 worker using its model-provided default voice."""

import gc
import sys
from pathlib import Path
from typing import Any

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from common import require_text_and_output, run_worker, sha256_file


def _release_cuda() -> None:
    gc.collect()
    try:
        import torch

        if torch.cuda.is_available():
            torch.cuda.empty_cache()
            torch.cuda.ipc_collect()
    except ImportError:
        pass


def handle(request: dict[str, Any]) -> dict[str, Any]:
    action = request["action"]
    if action == "doctor":
        import torch
        from chatterbox.mtl_tts import ChatterboxMultilingualTTS

        return {
            "data": {
                "backend": "chatterbox",
                "api": ChatterboxMultilingualTTS.__name__,
                "cuda": torch.cuda.is_available(),
                "cuda_device": torch.cuda.get_device_name(0) if torch.cuda.is_available() else "",
            }
        }
    if action == "list_voices":
        return {"data": {"voices": ["model_default", "consented_reference"]}}
    if action == "release":
        _release_cuda()
        return {"data": {"released": True}}
    if action != "synthesize":
        raise ValueError(f"Unsupported Chatterbox action: {action}")

    import torch
    import torchaudio as ta
    from chatterbox.mtl_tts import ChatterboxMultilingualTTS

    text, output = require_text_and_output(request)
    model = None
    try:
        model = ChatterboxMultilingualTTS.from_pretrained(device="cuda", t3_model="v3")
        reference = request.get("voice_reference")
        arguments: dict[str, Any] = {"language_id": "en"}
        if reference:
            arguments["audio_prompt_path"] = str(reference)
        wav = model.generate(text, **arguments)
        ta.save(str(output), wav.cpu(), model.sr, encoding="PCM_S", bits_per_sample=16)
        return {
            "sample_rate": model.sr,
            "channels": 1,
            "duration_seconds": wav.shape[-1] / model.sr,
            "audio_sha256": sha256_file(output),
            "data": {
                "model": request["model_id"],
                "voice": "consented_reference" if reference else "model_default",
            },
        }
    finally:
        del model
        _release_cuda()


if __name__ == "__main__":
    run_worker(handle)
