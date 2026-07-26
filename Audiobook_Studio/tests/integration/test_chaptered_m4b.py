import json
import shutil
import subprocess
import wave
from pathlib import Path

import pytest

from audiobook_studio.chapter_metadata import assemble_chaptered_m4b


def _silence(path: Path, duration_ms: int, sample_rate: int = 16_000) -> None:
    frames = round(sample_rate * duration_ms / 1000)
    with wave.open(str(path), "wb") as output:
        output.setnchannels(1)
        output.setsampwidth(2)
        output.setframerate(sample_rate)
        output.writeframes(b"\0\0" * frames)


@pytest.mark.integration
def test_real_m4b_contains_ordered_chapter_markers(tmp_path: Path) -> None:
    if shutil.which("ffmpeg") is None or shutil.which("ffprobe") is None:
        pytest.skip("FFmpeg and ffprobe are required")
    first, second = tmp_path / "first.wav", tmp_path / "second.wav"
    _silence(first, 600)
    _silence(second, 900)
    output = tmp_path / "chapters.m4b"
    timings = assemble_chaptered_m4b(
        [
            ("first", "First chapter", first),
            ("second", "Second chapter", second),
        ],
        output,
    )
    assert [(item.start_ms, item.end_ms) for item in timings] == [(0, 600), (600, 1500)]
    probe = subprocess.run(
        [
            "ffprobe",
            "-v",
            "error",
            "-show_chapters",
            "-of",
            "json",
            str(output),
        ],
        check=True,
        capture_output=True,
        text=True,
    )
    chapters = json.loads(probe.stdout)["chapters"]
    assert [chapter["tags"]["title"] for chapter in chapters] == [
        "First chapter",
        "Second chapter",
    ]
    assert float(chapters[1]["start_time"]) == pytest.approx(0.6, abs=0.01)
