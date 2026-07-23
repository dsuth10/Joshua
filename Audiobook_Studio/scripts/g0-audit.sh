#!/usr/bin/env bash

set -euo pipefail

studio_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
workspace_root="$(cd "${studio_root}/.." && pwd)"

export JOSHUA_ROOT="${workspace_root}"
export UV_CACHE_DIR="${studio_root}/.uv-cache-wsl"
export UV_PYTHON_INSTALL_DIR="${studio_root}/.uv-python-wsl"
export UV_PROJECT_ENVIRONMENT="${studio_root}/.venv-wsl"

if ! command -v uv >/dev/null 2>&1; then
    echo "Gate G0 cannot start because uv is not installed."
    echo "Install it with: curl -LsSf https://astral.sh/uv/install.sh | sh"
    echo "Then close and reopen Ubuntu before running this audit again."
    exit 2
fi

cd "${studio_root}"

echo "==> Synchronizing the locked Python 3.12 environment"
uv sync --frozen --extra dev --python 3.12

echo "==> Ruff lint"
uv run --frozen ruff check .

echo "==> Ruff formatting"
uv run --frozen ruff format --check .

echo "==> mypy"
uv run --frozen mypy src

echo "==> Tests"
uv run --frozen pytest -m "not gpu" \
    --basetemp=.pytest-tmp-wsl \
    -o cache_dir=.pytest-cache-wsl

echo "==> Deterministic pilot extraction"
uv run --frozen audiobook extract \
    --project projects/berani-ginger-juice/project.yaml

echo "==> Manifest validation"
uv run --frozen audiobook manifest validate \
    --project projects/berani-ginger-juice

echo "==> Workstation diagnostics"
uv run --frozen audiobook doctor --json \
    --output projects/berani-ginger-juice/qa/doctor.json

echo "Gate G0 PASS"
