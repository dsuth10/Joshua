import math
import shutil
import struct
import wave
from pathlib import Path

import pytest

from audiobook_studio.audio_validation import inspect_wav
from audiobook_studio.mastering import standardise_chunk


@pytest.mark.integration
def test_standardise_chunk_applies_pitch_preserving_tempo(tmp_path: Path) -> None:
    if shutil.which("ffmpeg") is None:
        pytest.skip("FFmpeg is required")
    source = tmp_path / "source.wav"
    with wave.open(str(source), "wb") as output:
        output.setnchannels(1)
        output.setsampwidth(2)
        output.setframerate(16_000)
        output.writeframes(
            b"".join(
                struct.pack("<h", round(10_000 * math.sin(2 * math.pi * 440 * index / 16_000)))
                for index in range(16_000)
            )
        )
    destination = tmp_path / "paced.wav"
    standardise_chunk(source, destination, 16_000, playback_tempo=0.8)
    assert inspect_wav(destination).duration_seconds == pytest.approx(1.25, abs=0.02)
