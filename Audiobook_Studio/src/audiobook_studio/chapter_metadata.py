"""FFmpeg chapter metadata and M4B assembly for ordered multi-selection projects."""

import subprocess
import tempfile
from dataclasses import dataclass
from pathlib import Path

from audiobook_studio.audio_validation import inspect_wav
from audiobook_studio.errors import AudiobookError, ExitCode


@dataclass(frozen=True)
class ChapterTiming:
    chapter_id: str
    title: str
    start_ms: int
    end_ms: int


class ChapterAssemblyError(AudiobookError):
    exit_code = ExitCode.GENERATION_FAILURE


def _concat_path(path: Path) -> str:
    return path.resolve().as_posix().replace("'", "'\\''")


def build_ffmetadata(chapters: list[ChapterTiming]) -> str:
    if not chapters:
        raise ValueError("at least one chapter is required")
    previous_end = 0
    lines = [";FFMETADATA1"]
    for chapter in chapters:
        if chapter.start_ms < previous_end or chapter.end_ms <= chapter.start_ms:
            raise ValueError("chapter timings must be ordered, non-overlapping, and positive")
        title = chapter.title.replace("\\", "\\\\").replace("=", "\\=")
        lines.extend(
            [
                "[CHAPTER]",
                "TIMEBASE=1/1000",
                f"START={chapter.start_ms}",
                f"END={chapter.end_ms}",
                f"title={title}",
            ]
        )
        previous_end = chapter.end_ms
    return "\n".join(lines) + "\n"


def assemble_chaptered_m4b(
    chapters: list[tuple[str, str, Path]],
    output: Path,
    *,
    bitrate: str = "96k",
) -> list[ChapterTiming]:
    """Concatenate chapter WAVs and mux millisecond chapter markers into an M4B."""
    if not chapters:
        raise ChapterAssemblyError("at least one chapter WAV is required")
    timings: list[ChapterTiming] = []
    elapsed_ms = 0
    for chapter_id, title, audio in chapters:
        if not audio.is_file():
            raise ChapterAssemblyError(f"chapter audio does not exist: {audio}")
        duration_ms = round(inspect_wav(audio).duration_seconds * 1000)
        timings.append(
            ChapterTiming(
                chapter_id=chapter_id,
                title=title,
                start_ms=elapsed_ms,
                end_ms=elapsed_ms + duration_ms,
            )
        )
        elapsed_ms += duration_ms

    output.parent.mkdir(parents=True, exist_ok=True)
    partial = output.with_name(f"{output.stem}.partial{output.suffix}")
    with tempfile.TemporaryDirectory(prefix="audiobook-chapters-") as temporary:
        temp = Path(temporary)
        concat = temp / "concat.txt"
        concat.write_text(
            "".join(f"file '{_concat_path(audio)}'\n" for _, _, audio in chapters),
            encoding="utf-8",
        )
        metadata = temp / "chapters.ffmetadata"
        metadata.write_text(build_ffmetadata(timings), encoding="utf-8")
        command = [
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
            str(concat),
            "-f",
            "ffmetadata",
            "-i",
            str(metadata),
            "-map",
            "0:a",
            "-map_metadata",
            "1",
            "-c:a",
            "aac",
            "-b:a",
            bitrate,
            "-ac",
            "1",
            str(partial),
        ]
        try:
            subprocess.run(command, check=True, capture_output=True, text=True)
        except (OSError, subprocess.CalledProcessError) as exc:
            detail = exc.stderr if isinstance(exc, subprocess.CalledProcessError) else str(exc)
            raise ChapterAssemblyError(f"chaptered M4B assembly failed: {detail}") from exc
    partial.replace(output)
    return timings
