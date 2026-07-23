"""Standard-library helpers shared by isolated worker processes."""

import argparse
import hashlib
import json
import traceback
from collections.abc import Callable
from pathlib import Path
from typing import Any


def parse_paths() -> tuple[Path, Path]:
    parser = argparse.ArgumentParser()
    parser.add_argument("--request", type=Path, required=True)
    parser.add_argument("--response", type=Path, required=True)
    arguments = parser.parse_args()
    return arguments.request.resolve(), arguments.response.resolve()


def read_request(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def write_response(path: Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(path.suffix + ".tmp")
    temporary.write_text(
        json.dumps(payload, indent=2, ensure_ascii=False, sort_keys=True) + "\n",
        encoding="utf-8",
    )
    temporary.replace(path)


def run_worker(handler: Callable[[dict[str, Any]], dict[str, Any]]) -> None:
    request_path, response_path = parse_paths()
    request: dict[str, Any] = {}
    try:
        request = read_request(request_path)
        result = handler(request)
        result.update(
            {
                "schema_version": 1,
                "request_id": request.get("request_id", "unknown"),
                "status": "success",
                "warnings": result.get("warnings", []),
            }
        )
        write_response(response_path, result)
    except Exception as exc:
        traceback.print_exc()
        write_response(
            response_path,
            {
                "schema_version": 1,
                "request_id": request.get("request_id", "unknown"),
                "status": "failure",
                "warnings": [],
                "error": f"{type(exc).__name__}: {exc}",
            },
        )
        raise SystemExit(1) from exc


def require_text_and_output(request: dict[str, Any]) -> tuple[str, Path]:
    text = str(request.get("text", "")).strip()
    output = request.get("output_path")
    if not text:
        raise ValueError("text must not be empty")
    if not output:
        raise ValueError("output_path is required")
    output_path = Path(str(output)).resolve()
    output_path.parent.mkdir(parents=True, exist_ok=True)
    return text, output_path
