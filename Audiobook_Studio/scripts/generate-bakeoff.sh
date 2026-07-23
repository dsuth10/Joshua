#!/usr/bin/env bash

set -euo pipefail

studio_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
workspace_root="$(cd "${studio_root}/.." && pwd)"
project="${studio_root}/projects/berani-ginger-juice/project.yaml"

export JOSHUA_ROOT="${workspace_root}"
export UV_CACHE_DIR="${studio_root}/.uv-cache-wsl"
export UV_PROJECT_ENVIRONMENT="${studio_root}/.venv-wsl"
export HF_HOME="${HOME}/.cache/huggingface-joshua-audiobook"

cd "${studio_root}"

echo "==> Exporting Slice 1 schemas"
uv run --frozen audiobook schema export --output schemas

echo "==> Verifying isolated speech workers"
uv run --frozen audiobook voice doctor --project "${project}"

echo "==> Generating all candidate sets"
if ! uv run --frozen audiobook voice sample \
    --project "${project}" \
    --backend all; then
    echo "One or more candidates failed; successful samples and failure evidence were retained."
fi

echo
echo "Generation attempts are complete."
echo "Review: ${studio_root}/projects/berani-ginger-juice/voice-bakeoff/results.json"
