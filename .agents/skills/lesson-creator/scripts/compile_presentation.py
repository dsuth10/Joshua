#!/usr/bin/env python3
"""Compile lesson-owned slides, CSS and JavaScript through the classroom wrapper."""

from __future__ import annotations

import argparse
import html
from pathlib import Path


PLACEHOLDER = "<!-- SLIDES GO HERE DURING DYNAMIC COMPILATION -->"
DEFAULT_TITLE = "Classroom Presentation Template"


def compile_presentation(
    slides_path: Path,
    output_path: Path,
    *,
    css_path: Path | None = None,
    js_path: Path | None = None,
    title: str = "Classroom Lesson",
    language: str = "en-AU",
    template_path: Path | None = None,
) -> Path:
    skill_root = Path(__file__).resolve().parents[1]
    template_path = template_path or skill_root / "assets" / "presentation_template.html"

    template = Path(template_path).read_text(encoding="utf-8")
    slides = Path(slides_path).read_text(encoding="utf-8")
    css = Path(css_path).read_text(encoding="utf-8") if css_path else ""
    js = Path(js_path).read_text(encoding="utf-8") if js_path else ""

    if template.count(PLACEHOLDER) != 1:
        raise RuntimeError("The classroom wrapper must contain exactly one slide placeholder.")

    compiled = template.replace('<html lang="en">', f'<html lang="{html.escape(language, quote=True)}">', 1)
    compiled = compiled.replace(
        f"<title>{DEFAULT_TITLE}</title>",
        f"<title>{html.escape(title)}</title>",
        1,
    )
    compiled = compiled.replace(PLACEHOLDER, slides, 1)

    if css:
        compiled = compiled.replace("</head>", f"<style>\n{css}\n</style>\n</head>", 1)
    if js:
        compiled = compiled.replace("</body>", f"<script>\n{js}\n</script>\n</body>", 1)

    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(compiled, encoding="utf-8")
    return output_path


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--slides", required=True, type=Path, help="Lesson slide sections HTML")
    parser.add_argument("--output", required=True, type=Path, help="Compiled presentation HTML")
    parser.add_argument("--css", type=Path, help="Optional lesson CSS")
    parser.add_argument("--js", type=Path, help="Optional lesson JavaScript")
    parser.add_argument("--title", default="Classroom Lesson")
    parser.add_argument("--language", default="en-AU")
    parser.add_argument("--template", type=Path, help="Optional wrapper override")
    args = parser.parse_args()

    output = compile_presentation(
        args.slides,
        args.output,
        css_path=args.css,
        js_path=args.js,
        title=args.title,
        language=args.language,
        template_path=args.template,
    )
    print(output)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
