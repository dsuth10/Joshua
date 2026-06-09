#!/usr/bin/env python3
"""Render the Year 3 assessment reading PDF from the HTML template."""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
HTML = ROOT / "assessment_reading_y3.html"
OUTPUT = ROOT / "Assessment reading Y3.pdf"


def main() -> int:
    if not HTML.exists():
        print(f"Missing template: {HTML}", file=sys.stderr)
        return 1

    script = f"""
const {{ chromium }} = require('playwright');
(async () => {{
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file:///{HTML.as_posix()}', {{ waitUntil: 'networkidle' }});
  await page.pdf({{
    path: '{OUTPUT.as_posix()}',
    format: 'A4',
    printBackground: true,
    margin: {{ top: '0', right: '0', bottom: '0', left: '0' }},
    preferCSSPageSize: true,
  }});
  await browser.close();
}})();
"""

    node_script = ROOT / "_render_pdf.mjs"
    node_script.write_text(
        f"""import {{ chromium }} from 'playwright';
import {{ fileURLToPath }} from 'url';
import path from 'path';

const root = '{ROOT.as_posix()}';
const html = path.join(root, 'assessment_reading_y3.html');
const output = path.join(root, 'Assessment reading Y3.pdf');

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('file:///' + html.replace(/\\\\/g, '/'), {{ waitUntil: 'networkidle' }});
await page.pdf({{
  path: output,
  format: 'A4',
  printBackground: true,
  margin: {{ top: '0', right: '0', bottom: '0', left: '0' }},
  preferCSSPageSize: true,
}});
await browser.close();
console.log('Wrote', output);
""",
        encoding="utf-8",
    )

    try:
        result = subprocess.run(
            ["node", str(node_script)],
            cwd=str(ROOT),
            capture_output=True,
            text=True,
            check=True,
        )
        print(result.stdout.strip())
    except subprocess.CalledProcessError as exc:
        print(exc.stderr or exc.stdout, file=sys.stderr)
        return 1
    finally:
        if node_script.exists():
            node_script.unlink()

    return 0


if __name__ == "__main__":
    sys.exit(main())
