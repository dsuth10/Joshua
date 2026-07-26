"""FFmpeg-based chunk standardisation, assembly, and chapter mastering."""

from __future__ import annotations

import json
import subprocess
import tempfile
from pathlib import Path

from audiobook_studio.audio_validation import inspect_wav
from audiobook_studio.errors import AudiobookError, ExitCode

CHUNK_MASTERING_REVISION = 2


class MasteringError(AudiobookError):
    exit_code = ExitCode.GENERATION_FAILURE


def _run(command: list[str], *, capture: bool = False) -> subprocess.CompletedProcess[str]:
    try:
        return subprocess.run(
            command,
            check=True,
            text=True,
            capture_output=capture,
        )
    except (OSError, subprocess.CalledProcessError) as exc:
        detail = exc.stderr[-2000:] if isinstance(exc, subprocess.CalledProcessError) else str(exc)
        raise MasteringError(f"FFmpeg operation failed: {detail}") from exc


def standardise_chunk(
    source: Path,
    destination: Path,
    sample_rate: int,
    *,
    playback_tempo: float = 1.0,
) -> None:
    if not 0.5 <= playback_tempo <= 2.0:
        raise MasteringError("playback_tempo must be between 0.5 and 2.0")
    destination.parent.mkdir(parents=True, exist_ok=True)
    partial = destination.with_suffix(".partial.wav")
    filters = [
        *(["atempo=" + str(playback_tempo)] if playback_tempo != 1.0 else []),
        "afade=t=in:d=0.008",
        "areverse",
        "afade=t=in:d=0.008",
        "areverse",
    ]
    _run(
        [
            "ffmpeg",
            "-hide_banner",
            "-loglevel",
            "error",
            "-y",
            "-i",
            str(source),
            "-af",
            ",".join(filters),
            "-ac",
            "1",
            "-ar",
            str(sample_rate),
            "-c:a",
            "pcm_s16le",
            str(partial),
        ]
    )
    partial.replace(destination)


def create_silence(destination: Path, duration_ms: int, sample_rate: int) -> None:
    _run(
        [
            "ffmpeg",
            "-hide_banner",
            "-loglevel",
            "error",
            "-y",
            "-f",
            "lavfi",
            "-i",
            f"anullsrc=r={sample_rate}:cl=mono",
            "-t",
            f"{duration_ms / 1000:.3f}",
            "-c:a",
            "pcm_s16le",
            str(destination),
        ]
    )


def assemble(
    chunk_paths: list[tuple[Path, int]],
    *,
    unmastered: Path,
    master: Path,
    sample_rate: int,
    target_lufs: float,
    true_peak_db: float,
    target_duration_seconds: float,
) -> None:
    if not chunk_paths:
        raise MasteringError("no mastered chunks are available for assembly")
    unmastered.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="audiobook-assembly-") as temporary:
        temp = Path(temporary)
        concat_entries: list[str] = []
        for index, (chunk, pause_ms) in enumerate(chunk_paths):
            concat_entries.append(f"file '{chunk.as_posix()}'")
            if pause_ms:
                silence = temp / f"silence-{index:03d}.wav"
                create_silence(silence, pause_ms, sample_rate)
                concat_entries.append(f"file '{silence.as_posix()}'")
        concat_file = temp / "concat.txt"
        concat_file.write_text("\n".join(concat_entries) + "\n", encoding="utf-8")
        _run(
            [
                "ffmpeg",
                "-hide_banner",
                "-loglevel",
                "error",
                "-y",
                "-f",
                "concat",
                "-safe",
                "0",
                "-i",
                str(concat_file),
                "-c:a",
                "pcm_s16le",
                str(unmastered),
            ]
        )
    partial = master.with_suffix(".partial.wav")
    unmastered_duration = inspect_wav(unmastered).duration_seconds
    tempo = min(1.2, max(0.8, unmastered_duration / target_duration_seconds))
    _run(
        [
            "ffmpeg",
            "-hide_banner",
            "-loglevel",
            "error",
            "-y",
            "-i",
            str(unmastered),
            "-af",
            f"atempo={tempo:.6f},loudnorm=I={target_lufs}:TP={true_peak_db}:LRA=7",
            "-ar",
            str(sample_rate),
            "-ac",
            "1",
            "-c:a",
            "pcm_s16le",
            str(partial),
        ]
    )
    partial.replace(master)


def loudness_stats(path: Path, target_lufs: float, true_peak_db: float) -> dict[str, float]:
    result = _run(
        [
            "ffmpeg",
            "-hide_banner",
            "-nostats",
            "-i",
            str(path),
            "-af",
            f"loudnorm=I={target_lufs}:TP={true_peak_db}:LRA=7:print_format=json",
            "-f",
            "null",
            "-",
        ],
        capture=True,
    )
    start = result.stderr.rfind("{")
    end = result.stderr.rfind("}")
    if start < 0 or end < start:
        raise MasteringError("FFmpeg did not return loudness statistics")
    raw = json.loads(result.stderr[start : end + 1])
    return {
        "integrated_lufs": float(raw["input_i"]),
        "true_peak_dbtp": float(raw["input_tp"]),
        "loudness_range": float(raw["input_lra"]),
    }
