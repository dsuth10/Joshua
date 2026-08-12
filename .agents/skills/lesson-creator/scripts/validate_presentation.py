#!/usr/bin/env python3
"""Validate a compiled lesson presentation against the classroom wrapper contract."""

from __future__ import annotations

import argparse
import re
import sys
from collections import Counter
from pathlib import Path


CORE_IDS = {
    "presentationContainer",
    "masterToolbar",
    "prevSlideBtn",
    "nextSlideBtn",
    "cursorModeBtn",
    "penModeBtn",
    "highlighterModeBtn",
    "clearCanvasBtn",
    "whiteboardToggleBtn",
    "fullscreenBtn",
    "pathwayToggle",
    "pathwayToggleBtn",
    "imageLightbox",
    "lightboxCanvas",
    "teacherNotesPanel",
    "teacherShowAnswerBtn",
    "whiteboardOverlay",
    "whiteboardCanvas",
}


def validate(path: Path, require_pathways: bool = False) -> list[str]:
    errors: list[str] = []
    try:
        text = path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        return ["File is not valid UTF-8."]

    if "<!-- SLIDES GO HERE DURING DYNAMIC COMPILATION -->" in text:
        errors.append("Slide placeholder remains; the presentation was not compiled.")

    ids = re.findall(r'\bid=["\']([^"\']+)["\']', text)
    id_counts = Counter(ids)
    for core_id in sorted(CORE_IDS):
        if id_counts[core_id] != 1:
            errors.append(f"Required id {core_id!r} occurs {id_counts[core_id]} times; expected 1.")

    duplicates = sorted(name for name, count in id_counts.items() if count > 1)
    if duplicates:
        errors.append("Duplicate HTML ids: " + ", ".join(duplicates))

    slides = len(re.findall(r'<section\b[^>]*class=["\'][^"\']*\bslide\b', text, flags=re.I))
    notes = len(re.findall(r'<div\b[^>]*class=["\'][^"\']*\bteacher-notes\b', text, flags=re.I))
    if slides == 0:
        errors.append("No slide sections found.")
    elif notes != slides:
        errors.append(f"Found {slides} slides but {notes} teacher-notes blocks.")

    has_standard = "standard-only" in text
    has_concise = "concise-only" in text
    if has_standard != has_concise:
        errors.append("Language pathway markup is incomplete; standard-only and concise-only must both be present.")
    if require_pathways and not (has_standard and has_concise):
        errors.append("Red-green pathways were required but paired pathway markup was not found.")
    if has_concise:
        for token in ("concise-active", "pathwayToggleBtn", "Change language view"):
            if token not in text:
                errors.append(f"Language pathway support is missing {token!r}.")

    interactive = any(token in text for token in (
        "quiz-container",
        "sort-container",
        "seq-container",
        "match-container",
        "cloze-container",
        "highlight-container",
        "rank-container",
        "map-container",
    ))
    if interactive and "show-answer" not in text:
        errors.append("Interactive markup exists but no show-answer listener was found.")

    for marker in ("\ufffd", "â€", "ðŸ"):
        if marker in text:
            errors.append(f"Possible encoding corruption contains {marker!r}.")

    if not re.search(r'<html\b[^>]*lang=["\']en-AU["\']', text, flags=re.I):
        errors.append("Root html element should use lang=\"en-AU\".")

    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("presentation", type=Path, help="Compiled lesson presentation HTML")
    parser.add_argument("--require-pathways", action="store_true", help="Require red-green language pairs")
    args = parser.parse_args()

    if not args.presentation.is_file():
        print(f"FAIL: file not found: {args.presentation}")
        return 2

    errors = validate(args.presentation, args.require_pathways)
    if errors:
        print(f"FAIL: {args.presentation}")
        for error in errors:
            print(f" - {error}")
        return 1

    print(f"PASS: {args.presentation}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
