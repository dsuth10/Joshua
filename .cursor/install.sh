#!/usr/bin/env bash
# Idempotent Cloud Agent bootstrap for the Joshua teaching workspace.
# Primary development experience: the Maths Command Station static web app and
# its Playwright-based audit suite (Maths_Command_Station/scripts/*.mjs), plus
# the workspace-wide Node document tooling (docx / pptx / canvas / sharp).
set -euo pipefail

cd "$(dirname "$0")/.."

# Workspace Node dependencies: playwright, canvas, sharp, jsdom, docx, pptxgenjs, react.
npm install

# Chromium (+ OS libraries) for the Maths Command Station audit scripts, which
# launch playwright.chromium and load pages over file:// URLs. Both commands are
# idempotent: already-present browsers and system packages are skipped.
npx playwright install --with-deps chromium
