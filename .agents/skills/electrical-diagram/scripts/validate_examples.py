#!/usr/bin/env python3
"""Render every checked example twice and verify deterministic output."""

from __future__ import annotations

import hashlib
import copy
import json
import shutil
import sys
import tempfile
from pathlib import Path

from render_circuit import CircuitValidationError, load_spec, render_html, render_svg, validate_spec

SKILL_DIR = Path(__file__).resolve().parents[1]


def digest(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def main() -> int:
    examples = sorted((SKILL_DIR / "examples").glob("*.json"))
    if not examples:
        print("FAIL no example JSON files found", file=sys.stderr)
        return 1
    temp_dir = Path(tempfile.mkdtemp(prefix="electrical-diagram-"))
    try:
        for path in examples:
            spec = load_spec(path)
            first_svg = render_svg(spec)
            second_svg = render_svg(spec)
            if digest(first_svg) != digest(second_svg):
                print(f"FAIL {path.name}: SVG output is not deterministic", file=sys.stderr)
                return 1
            output = temp_dir / f"{path.stem}.html"
            output.write_text(render_html(spec, first_svg), encoding="utf-8", newline="\n")
            (temp_dir / f"{path.stem}.svg").write_text(first_svg, encoding="utf-8", newline="\n")
            print(f"PASS {path.name}: {spec['expected_state']}")
        cell_lamp = json.loads((SKILL_DIR / "examples" / "cell-and-lamp.json").read_text(encoding="utf-8"))
        open_switch = json.loads((SKILL_DIR / "examples" / "open-switch.json").read_text(encoding="utf-8"))
        missing_battery = json.loads((SKILL_DIR / "examples" / "missing-battery.json").read_text(encoding="utf-8"))

        negative_controls: list[tuple[str, dict, str]] = []
        diagonal = copy.deepcopy(cell_lamp)
        diagonal["wires"][0]["via"] = [[3, 3]]
        negative_controls.append(("diagonal wire", diagonal, "diagonal"))

        false_complete = copy.deepcopy(open_switch)
        false_complete["expected_state"] = "complete"
        negative_controls.append(("open switch labelled complete", false_complete, "open switch"))

        repaired_omission = copy.deepcopy(missing_battery)
        repaired_omission["components"].append({
            "id": "cell1", "type": "cell", "from": "source_gap_bottom", "to": "source_gap_top", "label": "Cell"
        })
        negative_controls.append(("silently repaired missing battery", repaired_omission, "conflicts"))

        undeclared_gap = copy.deepcopy(missing_battery)
        undeclared_gap["open_terminals"] = []
        negative_controls.append(("undeclared loose terminals", undeclared_gap, "mismatch"))

        for name, invalid_spec, expected_text in negative_controls:
            try:
                validate_spec(invalid_spec)
            except CircuitValidationError as exc:
                if expected_text not in str(exc):
                    print(f"FAIL negative control {name}: unexpected error: {exc}", file=sys.stderr)
                    return 1
                print(f"PASS negative control: {name}")
            else:
                print(f"FAIL negative control accepted: {name}", file=sys.stderr)
                return 1

        print(f"PASS {len(examples)} examples and {len(negative_controls)} negative controls")
        return 0
    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)


if __name__ == "__main__":
    raise SystemExit(main())
