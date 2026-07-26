#!/usr/bin/env bash
set -euo pipefail

studio_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
python="$studio_root/.venv-wsl/bin/python"
ruff="$studio_root/.venv-wsl/bin/ruff"
mypy="$studio_root/.venv-wsl/bin/mypy"
pytest="$studio_root/.venv-wsl/bin/pytest"
expected_master_sha="612d2dad7ba841b2666ab3e08c3085e43bec0c18869dcd8888289d1dc0c83f4c"

cd "$studio_root"

echo "==> Static checks"
"$ruff" check src tests
"$ruff" format --check src tests
"$mypy" src

echo "==> Non-GPU test suite"
"$pytest" -m "not gpu" -q --basetemp=.pytest-tmp-g3

echo "==> Exporting and validating schemas"
"$python" -m audiobook_studio.cli schema export --output schemas
for project in \
  projects/berani-ginger-juice \
  projects/berani-ari-dialogue \
  projects/berani-ginger-juice-later
do
  "$python" -m audiobook_studio.cli manifest validate --project "$project"
done

echo "==> Proving all completed renders are content-addressed cache hits"
for project in \
  projects/berani-ginger-juice/project.yaml \
  projects/berani-ari-dialogue/project.yaml \
  projects/berani-ginger-juice-later/project.yaml
do
  "$python" -m audiobook_studio.cli render --project "$project" --require-full-cache
done

echo "==> Checking real-run QA reports"
"$python" -c 'import json, pathlib; paths=[pathlib.Path("projects/berani-ari-dialogue/qa/report.json"), pathlib.Path("projects/berani-ginger-juice-later/qa/report.json")]; reports=[json.loads(path.read_text()) for path in paths]; assert all(report["overall_wer"] <= report["overall_wer_max"] for report in reports); print("PASS: both generalisation WER results are within configured limits")'

echo "==> Protecting the approved Gate G2 master"
actual_master_sha="$(sha256sum 'projects/berani-ginger-juice/output/master/Berani - Ginger Juice - Master.wav' | cut -d' ' -f1)"
if [[ "$actual_master_sha" != "$expected_master_sha" ]]; then
  echo "FAIL: approved master hash changed: $actual_master_sha"
  exit 1
fi
echo "PASS: approved master hash remains $actual_master_sha"

echo "Gate G3 automated audit PASS"
