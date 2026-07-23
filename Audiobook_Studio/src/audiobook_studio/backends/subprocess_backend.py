"""Timeout-safe subprocess runner for isolated speech workers."""

import json
import os
import subprocess
import uuid
from pathlib import Path

from pydantic import ValidationError

from audiobook_studio.audio_validation import inspect_wav
from audiobook_studio.backends.protocol import BackendRequest, BackendResponse
from audiobook_studio.backends.registry import BackendDefinition
from audiobook_studio.errors import AudiobookError, ExitCode
from audiobook_studio.hashing import sha256_file


class BackendExecutionError(AudiobookError):
    exit_code = ExitCode.GENERATION_FAILURE


class WorkerRunner:
    def __init__(self, backend: BackendDefinition, timeout_seconds: int = 600) -> None:
        self.backend = backend
        self.timeout_seconds = timeout_seconds

    def run(self, request: BackendRequest, log_dir: Path) -> BackendResponse:
        if not self.backend.executable.is_file():
            raise BackendExecutionError(
                f"{self.backend.name} environment is not bootstrapped: {self.backend.executable}"
            )
        if not self.backend.worker_script.is_file():
            raise BackendExecutionError(f"Worker script is missing: {self.backend.worker_script}")

        request = BackendRequest.model_validate(request.model_dump())
        attempt_dir = log_dir / request.request_id
        attempt_dir.mkdir(parents=True, exist_ok=False)
        request_path = attempt_dir / "request.json"
        response_path = attempt_dir / "response.json"
        stdout_path = attempt_dir / "stdout.log"
        stderr_path = attempt_dir / "stderr.log"
        request_path.write_text(request.model_dump_json(indent=2) + "\n", encoding="utf-8")

        command = [
            str(self.backend.executable),
            str(self.backend.worker_script),
            "--request",
            str(request_path),
            "--response",
            str(response_path),
        ]
        process = subprocess.Popen(
            command,
            cwd=self.backend.worker_dir,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            start_new_session=os.name != "nt",
        )
        try:
            stdout, stderr = process.communicate(timeout=self.timeout_seconds)
        except subprocess.TimeoutExpired as exc:
            process.terminate()
            try:
                stdout, stderr = process.communicate(timeout=10)
            except subprocess.TimeoutExpired:
                process.kill()
                stdout, stderr = process.communicate()
            stdout_path.write_text(stdout, encoding="utf-8")
            stderr_path.write_text(stderr, encoding="utf-8")
            raise BackendExecutionError(
                f"{self.backend.name} worker timed out after {self.timeout_seconds} seconds"
            ) from exc

        stdout_path.write_text(stdout, encoding="utf-8")
        stderr_path.write_text(stderr, encoding="utf-8")
        if not response_path.is_file():
            raise BackendExecutionError(
                f"{self.backend.name} worker returned {process.returncode} without a response; "
                f"see {stderr_path}"
            )
        try:
            response = BackendResponse.model_validate_json(
                response_path.read_text(encoding="utf-8")
            )
        except (ValidationError, json.JSONDecodeError) as exc:
            raise BackendExecutionError(
                f"{self.backend.name} returned an invalid response: {exc}"
            ) from exc
        if response.request_id != request.request_id:
            raise BackendExecutionError(
                f"Worker response ID {response.request_id!r} does not match {request.request_id!r}"
            )
        if self.backend.lockfile.is_file():
            response = response.model_copy(
                update={"worker_lock_sha256": sha256_file(self.backend.lockfile)}
            )
        if response.status == "failure":
            raise BackendExecutionError(
                f"{self.backend.name} worker failed: {response.error}; see {stderr_path}"
            )
        if request.action == "synthesize":
            assert request.output_path is not None
            wav = inspect_wav(Path(request.output_path))
            response = response.model_copy(
                update={
                    "sample_rate": wav.sample_rate,
                    "channels": wav.channels,
                    "duration_seconds": wav.duration_seconds,
                    "audio_sha256": wav.sha256,
                }
            )
        response_path.write_text(response.model_dump_json(indent=2) + "\n", encoding="utf-8")
        return response


def unique_request_id(prefix: str) -> str:
    return f"{prefix}-{uuid.uuid4().hex[:12]}"
