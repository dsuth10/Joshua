"""Read-only environment diagnostics for Gate G0."""

import json
import platform
import shutil
import subprocess
import sys
from dataclasses import asdict, dataclass
from pathlib import Path

import httpx

from audiobook_studio.settings import discover_workspace_root


@dataclass(frozen=True)
class Check:
    name: str
    status: str
    detail: str
    required: bool


def _command_check(name: str, command: list[str], required: bool) -> Check:
    executable = shutil.which(command[0])
    if executable is None:
        return Check(name, "fail" if required else "warn", "not found on PATH", required)
    try:
        completed = subprocess.run(
            command,
            capture_output=True,
            text=True,
            timeout=10,
            check=False,
        )
    except (OSError, subprocess.TimeoutExpired) as exc:
        return Check(name, "fail" if required else "warn", str(exc), required)
    raw_output = (completed.stdout or completed.stderr).replace("\x00", "")
    output = raw_output.strip().splitlines()
    detail = output[0] if output else f"exit code {completed.returncode}"
    status = "pass" if completed.returncode == 0 else ("fail" if required else "warn")
    return Check(name, status, detail, required)


def _ollama_check(model: str) -> Check:
    try:
        response = httpx.get("http://127.0.0.1:11434/api/tags", timeout=3.0)
        response.raise_for_status()
        names = {item.get("name") for item in response.json().get("models", [])}
    except (httpx.HTTPError, ValueError) as exc:
        return Check("ollama", "warn", f"local API unavailable: {exc}", False)
    if model in names:
        return Check("ollama", "pass", f"local API available; model {model} installed", False)
    return Check("ollama", "warn", f"local API available; model {model} not installed", False)


def _wsl_check() -> Check:
    if platform.system() == "Linux":
        release = platform.release()
        distro = Path("/etc/os-release")
        if "microsoft" not in release.casefold():
            return Check("wsl", "warn", f"Linux kernel is not WSL: {release}", False)
        detail = f"WSL kernel {release}"
        if distro.is_file():
            for line in distro.read_text(encoding="utf-8").splitlines():
                if line.startswith("PRETTY_NAME="):
                    detail = f"{line.removeprefix('PRETTY_NAME=').strip(chr(34))}; {detail}"
                    break
        return Check("wsl", "pass", detail, False)
    return _command_check("wsl", ["wsl.exe", "--list", "--verbose"], False)


def run_doctor(
    source_path: Path | None = None,
    ollama_model: str = "qwen3.5:latest",
) -> dict[str, object]:
    workspace = discover_workspace_root()
    expected_source = source_path or (
        workspace / "Units" / "English" / "English_Unit_3" / "Berani.md"
    )
    checks = [
        Check("python", "pass", sys.version.split()[0], True),
        Check("platform", "pass", platform.platform(), True),
        _command_check(
            "nvidia",
            ["nvidia-smi", "--query-gpu=name,memory.total", "--format=csv,noheader"],
            True,
        ),
        _command_check("ffmpeg", ["ffmpeg", "-version"], True),
        _command_check("ffprobe", ["ffprobe", "-version"], True),
        _wsl_check(),
        _ollama_check(ollama_model),
        Check(
            "pilot_source",
            "pass" if expected_source.is_file() else "fail",
            str(expected_source),
            True,
        ),
    ]
    required_failures = [
        check.name for check in checks if check.required and check.status == "fail"
    ]
    return {
        "schema_version": 1,
        "overall_status": "pass" if not required_failures else "fail",
        "required_failures": required_failures,
        "workspace_root": str(workspace),
        "checks": [asdict(check) for check in checks],
    }


def doctor_json(report: dict[str, object]) -> str:
    return json.dumps(report, indent=2, ensure_ascii=False, sort_keys=True) + "\n"
