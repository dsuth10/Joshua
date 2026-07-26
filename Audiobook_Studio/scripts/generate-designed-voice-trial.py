"""Generate an isolated synthetic VoiceDesign reference and cloned audition sample."""

from __future__ import annotations

import argparse
import json
import subprocess
from datetime import UTC, datetime
from pathlib import Path

import yaml

from audiobook_studio.audio_validation import inspect_wav
from audiobook_studio.backends.protocol import BackendRequest
from audiobook_studio.backends.registry import get_backend
from audiobook_studio.backends.subprocess_backend import WorkerRunner, unique_request_id
from audiobook_studio.hashing import sha256_file

DESIGN_MODEL = "Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign"
BASE_MODEL = "Qwen/Qwen3-TTS-12Hz-0.6B-Base"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", type=Path, required=True)
    arguments = parser.parse_args()

    studio_root = Path(__file__).resolve().parents[1]
    config_path = arguments.config.resolve()
    config = yaml.safe_load(config_path.read_text(encoding="utf-8"))
    trial_id = str(config["trial_id"])
    project_dir = studio_root / str(config["project_dir"])
    output_dir = project_dir / "qa" / "audio" / "voice-trials" / trial_id
    log_dir = project_dir / "qa" / "logs" / "voice-trials"
    output_dir.mkdir(parents=True, exist_ok=True)
    runner = WorkerRunner(get_backend(studio_root, "qwen"), timeout_seconds=1_800)

    reference = output_dir / "synthetic-reference.wav"
    design = runner.run(
        BackendRequest(
            request_id=unique_request_id(f"{trial_id}-design"),
            action="prepare_voice",
            model_id=DESIGN_MODEL,
            text=str(config["reference_text"]),
            language=str(config.get("language", "English")),
            settings={
                "attention": "sdpa",
                "instruction": str(config["voice_direction"]),
                "seed": int(config.get("seed", 0)),
            },
            output_path=str(reference),
        ),
        log_dir,
    )

    audition = output_dir / "audition.wav"
    clone = runner.run(
        BackendRequest(
            request_id=unique_request_id(f"{trial_id}-clone"),
            action="synthesize",
            model_id=BASE_MODEL,
            text=str(config["audition_text"]),
            language=str(config.get("language", "English")),
            voice_reference=str(reference),
            settings={
                "attention": "sdpa",
                "reference_text": str(config["reference_text"]),
                "seed": int(config.get("seed", 0)),
            },
            output_path=str(audition),
        ),
        log_dir,
    )
    paced_audition: dict[str, object] | None = None
    tempo = float(config.get("audition_tempo", 1.0))
    if tempo != 1.0:
        paced = output_dir / "audition-paced.wav"
        subprocess.run(
            [
                "ffmpeg",
                "-hide_banner",
                "-loglevel",
                "error",
                "-y",
                "-i",
                str(audition),
                "-af",
                f"atempo={tempo}",
                "-c:a",
                "pcm_s16le",
                str(paced),
            ],
            check=True,
        )
        paced_audition = {
            "path": str(paced.relative_to(studio_root)).replace("\\", "/"),
            "sha256": sha256_file(paced),
            "duration_seconds": inspect_wav(paced).duration_seconds,
            "tempo": tempo,
            "pitch_preserved": True,
        }
    result = {
        "schema_version": 1,
        "trial_id": trial_id,
        "created_at": datetime.now(UTC).isoformat(),
        "config": str(config_path.relative_to(studio_root)).replace("\\", "/"),
        "config_sha256": sha256_file(config_path),
        "models": {"design": DESIGN_MODEL, "clone": BASE_MODEL},
        "reference": {
            "path": str(reference.relative_to(studio_root)).replace("\\", "/"),
            "sha256": sha256_file(reference),
            "duration_seconds": design.duration_seconds,
        },
        "audition": {
            "path": str(audition.relative_to(studio_root)).replace("\\", "/"),
            "sha256": sha256_file(audition),
            "duration_seconds": clone.duration_seconds,
        },
        "paced_audition": paced_audition,
        "consent_basis": "synthetic reference generated locally by Qwen VoiceDesign",
    }
    (output_dir / "result.json").write_text(
        json.dumps(result, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    print(json.dumps(result, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
