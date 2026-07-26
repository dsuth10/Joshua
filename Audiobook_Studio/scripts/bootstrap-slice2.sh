#!/usr/bin/env bash
set -euo pipefail

studio_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

command -v uv >/dev/null
command -v ffmpeg >/dev/null
command -v ffprobe >/dev/null
nvidia-smi >/dev/null

echo "==> Creating the isolated Whisper environment"
cd "$studio_root/workers/whisper"
uv sync --python 3.12

echo "==> Verifying Slice 2 coordinator and audio tools"
cd "$studio_root"
"$studio_root/.venv-wsl/bin/python" -m audiobook_studio.cli schema export --output schemas
ffmpeg -version | head -n 1
nvidia-smi --query-gpu=name,memory.total --format=csv,noheader

echo
echo "Slice 2 worker environment is ready."
