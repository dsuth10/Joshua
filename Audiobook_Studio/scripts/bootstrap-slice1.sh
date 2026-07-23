#!/usr/bin/env bash

set -euo pipefail

studio_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
export UV_CACHE_DIR="${HOME}/.cache/uv-joshua-audiobook"
export HF_HOME="${HOME}/.cache/huggingface-joshua-audiobook"

if ! command -v uv >/dev/null 2>&1; then
    echo "uv is required. Install it with:"
    echo "curl -LsSf https://astral.sh/uv/install.sh | sh"
    exit 2
fi

echo "==> Installing Linux audio runtime packages"
sudo apt-get update
sudo apt-get install -y espeak-ng libsndfile1

for backend in kokoro qwen chatterbox; do
    worker_dir="${studio_root}/workers/${backend}"
    python_version="3.12"
    if [[ "${backend}" == "chatterbox" ]]; then
        python_version="3.11"
    fi
    echo "==> Locking ${backend}"
    (
        cd "${worker_dir}"
        uv lock --python "${python_version}"
        uv sync --frozen
    )
done

echo "Slice 1 worker environments are ready."
