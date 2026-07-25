#!/usr/bin/env bash
set -u

studio_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
project="projects/berani-ginger-juice/project.yaml"
python="$studio_root/.venv-wsl/bin/python"
exit_code=0

cd "$studio_root"

run_stage() {
  local label="$1"
  shift
  echo "==> $label"
  if ! "$python" -m audiobook_studio.cli "$@"; then
    exit_code=1
    echo "FAILED: $label"
  fi
}

run_stage "Creating the narration plan" plan --project "$project"
if [[ $exit_code -eq 0 ]]; then
  run_stage "Rendering all narration chunks" render --project "$project"
fi
if [[ $exit_code -eq 0 ]]; then
  run_stage "Verifying a complete cache-only rerun" render --project "$project" --require-full-cache
fi
if [[ $exit_code -eq 0 ]]; then
  run_stage "Assembling and mastering the chapter" assemble --project "$project"
fi
if [[ $exit_code -eq 0 ]]; then
  run_stage "Running transcription and technical QA" qa --project "$project"
fi

echo
echo "Slice 2 production attempt is complete."
echo "Review projects/berani-ginger-juice/qa/report.md"
exit "$exit_code"
