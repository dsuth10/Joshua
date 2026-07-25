"""Qwen3-TTS worker with explicit single-model GPU cleanup."""

import gc
import sys
from pathlib import Path
from typing import Any

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from common import require_text_and_output, run_worker, sha256_file

CUSTOM_MODEL = "Qwen/Qwen3-TTS-12Hz-0.6B-CustomVoice"
DESIGN_MODEL = "Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign"
BASE_MODEL = "Qwen/Qwen3-TTS-12Hz-0.6B-Base"
SPEAKERS = ["Vivian", "Serena", "Uncle_Fu", "Dylan", "Eric", "Ryan", "Aiden", "Ono_Anna", "Sohee"]


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
        from qwen_tts import Qwen3TTSModel

        return {
            "data": {
                "backend": "qwen",
                "api": Qwen3TTSModel.__name__,
                "cuda": torch.cuda.is_available(),
                "cuda_device": torch.cuda.get_device_name(0) if torch.cuda.is_available() else "",
            }
        }
    if action == "list_voices":
        return {"data": {"voices": SPEAKERS}}
    if action == "release":
        _release_cuda()
        return {"data": {"released": True}}
    if action not in {"synthesize", "synthesize_batch", "prepare_voice"}:
        raise ValueError(f"Unsupported Qwen action: {action}")

    import soundfile as sf
    import torch
    from qwen_tts import Qwen3TTSModel

    model_id = str(request["model_id"])
    language = str(request.get("language", "English"))
    settings = request.get("settings", {})
    attention = str(settings.get("attention", "sdpa"))
    dtype = torch.bfloat16 if torch.cuda.is_bf16_supported() else torch.float16
    model = None
    try:
        model = Qwen3TTSModel.from_pretrained(
            model_id,
            device_map="cuda:0",
            dtype=dtype,
            attn_implementation=attention,
        )

        def generate(text: str) -> tuple[Any, int]:
            if "CustomVoice" in model_id:
                return model.generate_custom_voice(
                    text=text,
                    language=language,
                    speaker=str(settings.get("speaker", "Serena")),
                    instruct=str(settings.get("instruction", "")),
                )
            if "VoiceDesign" in model_id:
                return model.generate_voice_design(
                    text=text,
                    language=language,
                    instruct=str(settings["instruction"]),
                )
            if "Base" in model_id:
                reference = request.get("voice_reference")
                reference_text = str(settings.get("reference_text", ""))
                if not reference or not reference_text:
                    raise ValueError("Qwen Base requires voice_reference and reference_text")
                return model.generate_voice_clone(
                    text=text,
                    language=language,
                    ref_audio=str(reference),
                    ref_text=reference_text,
                )
            raise ValueError(f"Unsupported Qwen model: {model_id}")

        if action == "synthesize_batch":
            results = []
            for item in request["items"]:
                torch.manual_seed(int(item["seed"]))
                if torch.cuda.is_available():
                    torch.cuda.manual_seed_all(int(item["seed"]))
                output = Path(str(item["output_path"])).resolve()
                output.parent.mkdir(parents=True, exist_ok=True)
                wavs, sample_rate = generate(str(item["text"]))
                sf.write(output, wavs[0], sample_rate, subtype="PCM_16")
                results.append(
                    {
                        "item_id": item["item_id"],
                        "output_path": str(output),
                        "sample_rate": sample_rate,
                        "channels": 1,
                        "duration_seconds": len(wavs[0]) / sample_rate,
                        "audio_sha256": sha256_file(output),
                    }
                )
            return {
                "items": results,
                "data": {"model": model_id, "attention": attention, "count": len(results)},
            }
        text, output = require_text_and_output(request)
        seed = int(settings.get("seed", 0))
        torch.manual_seed(seed)
        if torch.cuda.is_available():
            torch.cuda.manual_seed_all(seed)
        wavs, sample_rate = generate(text)
        sf.write(output, wavs[0], sample_rate, subtype="PCM_16")
        return {
            "sample_rate": sample_rate,
            "channels": 1,
            "duration_seconds": len(wavs[0]) / sample_rate,
            "audio_sha256": sha256_file(output),
            "data": {"model": model_id, "attention": attention},
        }
    finally:
        model = None
        _release_cuda()


if __name__ == "__main__":
    run_worker(handle)
