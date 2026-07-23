"""Small, dependency-free WAV integrity checks."""

import wave
from dataclasses import dataclass
from pathlib import Path

from audiobook_studio.errors import AudiobookError
from audiobook_studio.hashing import sha256_file


@dataclass(frozen=True)
class WavMetadata:
    sample_rate: int
    channels: int
    frame_count: int
    duration_seconds: float
    sha256: str


def inspect_wav(path: Path) -> WavMetadata:
    if not path.is_file() or path.stat().st_size <= 44:
        raise AudiobookError(f"WAV output is missing or empty: {path}")
    try:
        with wave.open(str(path), "rb") as wav:
            sample_rate = wav.getframerate()
            channels = wav.getnchannels()
            frame_count = wav.getnframes()
    except (OSError, EOFError, wave.Error) as exc:
        raise AudiobookError(f"WAV output is not decodable: {path}: {exc}") from exc
    if sample_rate <= 0 or channels <= 0 or frame_count <= 0:
        raise AudiobookError(f"WAV output has invalid metadata: {path}")
    return WavMetadata(
        sample_rate=sample_rate,
        channels=channels,
        frame_count=frame_count,
        duration_seconds=frame_count / sample_rate,
        sha256=sha256_file(path),
    )
