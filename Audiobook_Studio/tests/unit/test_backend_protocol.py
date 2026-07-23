import json
import sys
import wave
from pathlib import Path

import pytest
from pydantic import ValidationError

from audiobook_studio.backends.protocol import BackendRequest
from audiobook_studio.backends.registry import BackendDefinition
from audiobook_studio.backends.subprocess_backend import WorkerRunner


def test_synthesis_request_requires_text_and_output() -> None:
    with pytest.raises(ValidationError):
        BackendRequest(
            request_id="bad",
            action="synthesize",
            model_id="model",
            text="",
        )


def test_worker_runner_validates_wav_and_records_lock_hash(tmp_path: Path) -> None:
    worker = tmp_path / "worker.py"
    worker.write_text(
        """
import argparse
import json
import wave
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument("--request", type=Path, required=True)
parser.add_argument("--response", type=Path, required=True)
args = parser.parse_args()
request = json.loads(args.request.read_text(encoding="utf-8"))
output = Path(request["output_path"])
output.parent.mkdir(parents=True, exist_ok=True)
with wave.open(str(output), "wb") as wav:
    wav.setnchannels(1)
    wav.setsampwidth(2)
    wav.setframerate(24000)
    wav.writeframes(b"\\x00\\x00" * 2400)
args.response.write_text(json.dumps({
    "schema_version": 1,
    "request_id": request["request_id"],
    "status": "success",
    "warnings": []
}), encoding="utf-8")
""".strip()
        + "\n",
        encoding="utf-8",
    )
    lockfile = tmp_path / "uv.lock"
    lockfile.write_text("locked\n", encoding="utf-8")
    backend = BackendDefinition(
        name="fake",
        python_version="test",
        default_model_id="fake/model",
        worker_dir=tmp_path,
        executable=Path(sys.executable),
        worker_script=worker,
        lockfile=lockfile,
    )
    output = tmp_path / "sample.wav"
    request = BackendRequest(
        request_id="fake-request",
        action="synthesize",
        model_id="fake/model",
        text="A valid test.",
        output_path=str(output),
    )

    response = WorkerRunner(backend, timeout_seconds=10).run(request, tmp_path / "logs")

    assert response.status == "success"
    assert response.sample_rate == 24_000
    assert response.channels == 1
    assert response.duration_seconds == pytest.approx(0.1)
    assert response.worker_lock_sha256 is not None
    with wave.open(str(output), "rb") as wav:
        assert wav.getnframes() == 2400
    persisted = json.loads(
        (tmp_path / "logs" / "fake-request" / "response.json").read_text(encoding="utf-8")
    )
    assert persisted["audio_sha256"] == response.audio_sha256
