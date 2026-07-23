$ErrorActionPreference = "Stop"

$studioRoot = Split-Path -Parent $PSScriptRoot
$workspaceRoot = Split-Path -Parent $studioRoot
$env:UV_CACHE_DIR = Join-Path $studioRoot ".uv-cache"
$env:UV_PYTHON_INSTALL_DIR = Join-Path $studioRoot ".uv-python"
$env:JOSHUA_ROOT = $workspaceRoot

Push-Location $studioRoot
try {
    $projectPython = Join-Path $studioRoot ".venv\Scripts\python.exe"
    uv run --python $projectPython ruff check .
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
    uv run --python $projectPython ruff format --check .
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
    uv run --python $projectPython mypy src
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
    uv run --python $projectPython pytest -m "not gpu"
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
    uv run --python $projectPython audiobook extract --project projects/berani-ginger-juice/project.yaml
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
    uv run --python $projectPython audiobook manifest validate --project projects/berani-ginger-juice
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
    uv run --python $projectPython audiobook doctor --json --output projects/berani-ginger-juice/qa/doctor.json
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}
finally {
    Pop-Location
}
