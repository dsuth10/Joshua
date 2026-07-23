"""Static registry of isolated local speech workers."""

from dataclasses import dataclass
from pathlib import Path

from audiobook_studio.errors import ConfigurationError


@dataclass(frozen=True)
class BackendDefinition:
    name: str
    python_version: str
    default_model_id: str
    worker_dir: Path
    executable: Path
    worker_script: Path
    lockfile: Path


def get_backend(studio_root: Path, name: str) -> BackendDefinition:
    worker_dir = studio_root / "workers" / name
    models = {
        "kokoro": ("3.12", "hexgrad/Kokoro-82M"),
        "qwen": ("3.12", "Qwen/Qwen3-TTS-12Hz-0.6B-CustomVoice"),
        "chatterbox": ("3.11", "ResembleAI/chatterbox-multilingual-v3"),
    }
    if name not in models:
        raise ConfigurationError(f"Unknown speech backend: {name}")
    python_version, model_id = models[name]
    return BackendDefinition(
        name=name,
        python_version=python_version,
        default_model_id=model_id,
        worker_dir=worker_dir,
        executable=worker_dir / ".venv" / "bin" / "python",
        worker_script=worker_dir / "worker.py",
        lockfile=worker_dir / "uv.lock",
    )
