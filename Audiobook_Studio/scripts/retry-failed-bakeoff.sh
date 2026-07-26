#!/usr/bin/env bash

set -euo pipefail

studio_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
workspace_root="$(cd "${studio_root}/.." && pwd)"
project="${studio_root}/projects/berani-ginger-juice/project.yaml"

export JOSHUA_ROOT="${workspace_root}"
export UV_CACHE_DIR="${studio_root}/.uv-cache-wsl"
export HF_HOME="${HOME}/.cache/huggingface-joshua-audiobook"

echo "==> Repairing the Kokoro environment"
(
    unset UV_PROJECT_ENVIRONMENT
    cd "${studio_root}/workers/kokoro"
    uv lock --python 3.12
    uv sync --frozen
)

export UV_PROJECT_ENVIRONMENT="${studio_root}/.venv-wsl"
cd "${studio_root}"

echo "==> Retrying Kokoro only"
if ! uv run --frozen audiobook voice sample \
    --project "${project}" \
    --backend kokoro; then
    echo "Kokoro still failed; its new evidence was retained."
fi

echo "==> Retrying Chatterbox only"
if ! uv run --frozen audiobook voice sample \
    --project "${project}" \
    --backend chatterbox; then
    echo "Chatterbox still failed; its new evidence was retained."
fi

echo
echo "Targeted retries are complete. Existing Qwen samples were preserved."
echo "Review: ${studio_root}/projects/berani-ginger-juice/voice-bakeoff/results.json"
