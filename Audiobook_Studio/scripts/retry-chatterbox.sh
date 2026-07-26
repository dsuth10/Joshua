#!/usr/bin/env bash

set -euo pipefail

studio_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
workspace_root="$(cd "${studio_root}/.." && pwd)"
project="${studio_root}/projects/berani-ginger-juice/project.yaml"

export JOSHUA_ROOT="${workspace_root}"
export UV_CACHE_DIR="${studio_root}/.uv-cache-wsl"
export HF_HOME="${HOME}/.cache/huggingface-joshua-audiobook"

echo "==> Repairing the Chatterbox environment"
(
    unset UV_PROJECT_ENVIRONMENT
    cd "${studio_root}/workers/chatterbox"
    uv lock --python 3.11
    uv sync --frozen
)

export UV_PROJECT_ENVIRONMENT="${studio_root}/.venv-wsl"
cd "${studio_root}"

echo "==> Retrying Chatterbox only"
uv run --frozen audiobook voice sample \
    --project "${project}" \
    --backend chatterbox

echo
echo "Chatterbox retry is complete. Existing Qwen and Kokoro samples were preserved."
echo "Review: ${studio_root}/projects/berani-ginger-juice/voice-bakeoff/results.json"
