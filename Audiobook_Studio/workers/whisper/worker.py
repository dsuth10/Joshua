"""Batch faster-whisper worker that loads the ASR model only once."""

from __future__ import annotations

import argparse
import json
import traceback
from pathlib import Path
from typing import Any


def _write(path: Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(".tmp")
    temporary.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    temporary.replace(path)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--request", type=Path, required=True)
    parser.add_argument("--response", type=Path, required=True)
    args = parser.parse_args()
    request: dict[str, Any] = {}
    try:
        request = json.loads(args.request.read_text(encoding="utf-8"))
        from faster_whisper import WhisperModel

        model = WhisperModel(
            str(request["model_id"]),
            device="cuda",
            compute_type="float16",
        )
        results = []
        for item in request["items"]:
            segments, _ = model.transcribe(
                str(item["audio_path"]),
                language="en",
                beam_size=5,
                vad_filter=False,
                condition_on_previous_text=False,
            )
            transcript = " ".join(segment.text.strip() for segment in segments).strip()
            results.append({"chunk_id": item["chunk_id"], "transcript": transcript})
        _write(
            args.response,
            {"schema_version": 1, "status": "success", "items": results},
        )
    except Exception as exc:
        traceback.print_exc()
        _write(
            args.response,
            {
                "schema_version": 1,
                "status": "failure",
                "error": f"{type(exc).__name__}: {exc}",
            },
        )
        raise SystemExit(1) from exc


if __name__ == "__main__":
    main()
