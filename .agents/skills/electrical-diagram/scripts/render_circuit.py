#!/usr/bin/env python3
"""Validate a classroom circuit JSON file and render deterministic SVG + HTML."""

from __future__ import annotations

import argparse
import html
import json
import math
import re
import sys
import xml.etree.ElementTree as ET
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any

SKILL_DIR = Path(__file__).resolve().parents[1]
VENDOR_DIR = SKILL_DIR / "vendor"
sys.path.insert(0, str(VENDOR_DIR))

try:
    import schemdraw
    import schemdraw.elements as elm
except ImportError as exc:  # pragma: no cover - installation fault
    raise SystemExit(
        "Bundled SchemDraw is missing. Restore vendor/ from requirements.txt before rendering."
    ) from exc


ALLOWED_TYPES = {
    "cell",
    "battery",
    "lamp",
    "motor",
    "resistor",
    "led",
    "ammeter",
    "voltmeter",
    "switch-open",
    "switch-closed",
}
EXPECTED_STATES = {"complete", "open", "intentionally-incomplete"}
SOURCE_TYPES = {"cell", "battery"}
LOAD_TYPES = {"lamp", "motor", "resistor", "led"}


class CircuitValidationError(ValueError):
    pass


def fail(message: str) -> None:
    raise CircuitValidationError(message)


def _point(value: Any, subject: str) -> tuple[float, float]:
    if not isinstance(value, list) or len(value) != 2:
        fail(f"{subject} must be a two-number [x, y] coordinate")
    if any(isinstance(n, bool) or not isinstance(n, (int, float)) for n in value):
        fail(f"{subject} must contain numbers")
    x, y = float(value[0]), float(value[1])
    if not math.isfinite(x) or not math.isfinite(y):
        fail(f"{subject} contains a non-finite coordinate")
    if any(abs(n * 2 - round(n * 2)) > 1e-9 for n in (x, y)):
        fail(f"{subject} must sit on the 0.5-unit grid")
    return x, y


def _edge_cycle(nodes: set[str], edges: list[tuple[str, str]]) -> bool:
    graph: dict[str, list[str]] = defaultdict(list)
    for start, end in edges:
        graph[start].append(end)
        graph[end].append(start)
    visited: set[str] = set()

    def visit(node: str, parent: str | None) -> bool:
        visited.add(node)
        for neighbour in graph[node]:
            if neighbour not in visited:
                if visit(neighbour, node):
                    return True
            elif neighbour != parent:
                return True
        return False

    return any(node not in visited and visit(node, None) for node in nodes if graph[node])


def _segments(spec: dict[str, Any]) -> list[tuple[tuple[float, float], tuple[float, float], str]]:
    nodes = {name: tuple(pos) for name, pos in spec["nodes"].items()}
    segments: list[tuple[tuple[float, float], tuple[float, float], str]] = []
    for index, wire in enumerate(spec["wires"]):
        points = [nodes[wire["from"]]] + [tuple(p) for p in wire.get("via", [])] + [nodes[wire["to"]]]
        for part, (start, end) in enumerate(zip(points, points[1:])):
            if start == end:
                fail(f"wires[{index}] segment {part} has zero length")
            if start[0] != end[0] and start[1] != end[1]:
                fail(f"wires[{index}] segment {part} is diagonal; use an orthogonal bend")
            segments.append((start, end, f"wires[{index}] segment {part}"))
    return segments


def _between(value: float, a: float, b: float) -> bool:
    return min(a, b) <= value <= max(a, b)


def _segment_intersection(
    first: tuple[tuple[float, float], tuple[float, float], str],
    second: tuple[tuple[float, float], tuple[float, float], str],
) -> tuple[float, float] | str | None:
    a, b, _ = first
    c, d, _ = second
    first_vertical = a[0] == b[0]
    second_vertical = c[0] == d[0]
    if first_vertical != second_vertical:
        vertical = first if first_vertical else second
        horizontal = second if first_vertical else first
        x = vertical[0][0]
        y = horizontal[0][1]
        if _between(y, vertical[0][1], vertical[1][1]) and _between(x, horizontal[0][0], horizontal[1][0]):
            return x, y
        return None
    if first_vertical:
        if a[0] != c[0]:
            return None
        overlap_start = max(min(a[1], b[1]), min(c[1], d[1]))
        overlap_end = min(max(a[1], b[1]), max(c[1], d[1]))
        if overlap_start > overlap_end:
            return None
        return (a[0], overlap_start) if overlap_start == overlap_end else "overlap"
    if a[1] != c[1]:
        return None
    overlap_start = max(min(a[0], b[0]), min(c[0], d[0]))
    overlap_end = min(max(a[0], b[0]), max(c[0], d[0]))
    if overlap_start > overlap_end:
        return None
    return (overlap_start, a[1]) if overlap_start == overlap_end else "overlap"


def validate_spec(spec: Any) -> dict[str, Any]:
    if not isinstance(spec, dict):
        fail("input must be a JSON object")
    required = {
        "schema_version",
        "title",
        "description",
        "expected_state",
        "intentional_omissions",
        "open_terminals",
        "nodes",
        "components",
        "wires",
    }
    missing = sorted(required - set(spec))
    unknown = sorted(set(spec) - required)
    if missing:
        fail(f"missing required fields: {', '.join(missing)}")
    if unknown:
        fail(f"unknown top-level fields: {', '.join(unknown)}")
    if spec["schema_version"] != 1:
        fail("schema_version must be 1")
    if not isinstance(spec["title"], str) or not spec["title"].strip():
        fail("title must be a non-empty string")
    if not isinstance(spec["description"], str) or not spec["description"].strip():
        fail("description must be a non-empty string")
    state = spec["expected_state"]
    if state not in EXPECTED_STATES:
        fail(f"expected_state must be one of {sorted(EXPECTED_STATES)}")
    if not isinstance(spec["nodes"], dict) or len(spec["nodes"]) < 2:
        fail("nodes must contain at least two named coordinates")

    positions: dict[str, tuple[float, float]] = {}
    seen_positions: dict[tuple[float, float], str] = {}
    for name, raw in spec["nodes"].items():
        if not isinstance(name, str) or not re.fullmatch(r"[A-Za-z][A-Za-z0-9_-]*", name):
            fail(f"invalid node id: {name!r}")
        point = _point(raw, f"nodes.{name}")
        if point in seen_positions:
            fail(f"nodes {seen_positions[point]} and {name} share coordinate {point}")
        positions[name] = point
        seen_positions[point] = name

    if not isinstance(spec["components"], list) or not spec["components"]:
        fail("components must be a non-empty array")
    component_ids: set[str] = set()
    component_types: list[str] = []
    physical_edges: list[tuple[str, str]] = []
    conductive_edges: list[tuple[str, str]] = []
    for index, component in enumerate(spec["components"]):
        if not isinstance(component, dict):
            fail(f"components[{index}] must be an object")
        unknown_component_fields = set(component) - {"id", "type", "from", "to", "label"}
        if unknown_component_fields:
            fail(f"components[{index}] has unknown fields: {sorted(unknown_component_fields)}")
        for field in ("id", "type", "from", "to"):
            if not isinstance(component.get(field), str) or not component[field]:
                fail(f"components[{index}].{field} must be a non-empty string")
        if component["id"] in component_ids:
            fail(f"duplicate component id: {component['id']}")
        component_ids.add(component["id"])
        kind = component["type"]
        if kind not in ALLOWED_TYPES:
            fail(f"components[{index}] has unsupported type {kind!r}")
        component_types.append(kind)
        start, end = component["from"], component["to"]
        if start not in positions or end not in positions:
            fail(f"components[{index}] references an unknown node")
        if start == end:
            fail(f"components[{index}] must connect two different nodes")
        a, b = positions[start], positions[end]
        if a[0] != b[0] and a[1] != b[1]:
            fail(f"components[{index}] is diagonal; components must be horizontal or vertical")
        if math.dist(a, b) < 2:
            fail(f"components[{index}] needs at least 2 units between terminals")
        label = component.get("label")
        if label is not None and (not isinstance(label, str) or len(label) > 40):
            fail(f"components[{index}].label must be a string of at most 40 characters")
        physical_edges.append((start, end))
        if kind != "switch-open":
            conductive_edges.append((start, end))

    if not isinstance(spec["wires"], list):
        fail("wires must be an array")
    for index, wire in enumerate(spec["wires"]):
        if not isinstance(wire, dict) or set(wire) - {"from", "to", "via"}:
            fail(f"wires[{index}] must contain only from, to and optional via")
        start, end = wire.get("from"), wire.get("to")
        if start not in positions or end not in positions or start == end:
            fail(f"wires[{index}] must connect two different known nodes")
        via = wire.get("via", [])
        if not isinstance(via, list):
            fail(f"wires[{index}].via must be an array")
        for part, point in enumerate(via):
            wire["via"][part] = list(_point(point, f"wires[{index}].via[{part}]"))
        physical_edges.append((start, end))
        conductive_edges.append((start, end))

    segments = _segments(spec)
    for i, first in enumerate(segments):
        for second in segments[i + 1 :]:
            intersection = _segment_intersection(first, second)
            if intersection is None:
                continue
            if intersection == "overlap":
                fail(f"wire segments overlap: {first[2]} and {second[2]}")
            first_endpoints = {first[0], first[1]}
            second_endpoints = {second[0], second[1]}
            if intersection not in first_endpoints.intersection(second_endpoints):
                fail(f"wire crossing without a shared endpoint at {intersection}: {first[2]} and {second[2]}")

    omissions = spec["intentional_omissions"]
    if not isinstance(omissions, list) or any(item not in ALLOWED_TYPES for item in omissions):
        fail("intentional_omissions must contain supported component types")
    if len(omissions) != len(set(omissions)):
        fail("intentional_omissions contains duplicates")
    present = set(component_types)
    for omission in omissions:
        conflict = SOURCE_TYPES if omission in SOURCE_TYPES else {omission}
        if present & conflict:
            fail(f"intentional omission {omission!r} conflicts with included component type(s) {sorted(present & conflict)}")

    open_terminals = spec["open_terminals"]
    if not isinstance(open_terminals, list) or any(item not in positions for item in open_terminals):
        fail("open_terminals must contain known node IDs")
    if len(open_terminals) != len(set(open_terminals)):
        fail("open_terminals contains duplicates")
    degrees = Counter(node for edge in physical_edges for node in edge)
    unused = sorted(set(positions) - set(degrees))
    if unused:
        fail(f"unused nodes: {', '.join(unused)}")
    actual_loose = {node for node, degree in degrees.items() if degree == 1}
    declared_loose = set(open_terminals)
    if actual_loose != declared_loose:
        fail(f"open_terminals mismatch: declared {sorted(declared_loose)}, actual {sorted(actual_loose)}")

    has_cycle = _edge_cycle(set(positions), conductive_edges)
    if state == "complete":
        if omissions or open_terminals:
            fail("a complete circuit cannot declare omissions or open terminals")
        if not (present & SOURCE_TYPES):
            fail("a complete circuit requires a cell or battery")
        if not (present & LOAD_TYPES):
            fail("a complete circuit requires a load")
        if "switch-open" in present:
            fail("a complete circuit cannot contain an open switch")
        if not has_cycle:
            fail("expected a complete conducting path, but no closed loop was found")
    elif state == "open":
        if has_cycle:
            fail("expected an open circuit, but a closed conducting path was found")
        if "switch-open" not in present and not open_terminals:
            fail("an open circuit needs an open switch or declared open terminals")
    else:
        if not omissions:
            fail("an intentionally incomplete circuit must name at least one intentional omission")
        if not open_terminals:
            fail("an intentionally incomplete circuit must declare its open terminals")
        if has_cycle:
            fail("an intentionally incomplete circuit must not contain a closed conducting path")

    return spec


def _make_element(kind: str) -> Any:
    constructors = {
        "cell": elm.BatteryCell,
        "battery": elm.Battery,
        "lamp": elm.Lamp2,
        "motor": elm.Motor,
        "resistor": elm.Resistor,
        "led": elm.LED,
        "ammeter": elm.MeterA,
        "voltmeter": elm.MeterV,
        "switch-open": elm.Switch,
        "switch-closed": lambda: elm.Switch(nc=True),
    }
    return constructors[kind]()


def _add_with_endpoint_check(drawing: Any, element: Any, start: tuple[float, float], end: tuple[float, float], subject: str) -> None:
    placed = drawing.add(element.endpoints(start, end))
    for anchor_name, expected in (("start", start), ("end", end)):
        anchor = placed.absanchors.get(anchor_name)
        if anchor is None:
            fail(f"{subject} rendered without a {anchor_name} anchor")
        actual = (float(anchor.x), float(anchor.y))
        if math.dist(actual, expected) > 1e-6:
            fail(f"{subject} endpoint mismatch: requested {anchor_name}={expected}, rendered {actual}")


def render_svg(spec: dict[str, Any]) -> str:
    schemdraw.use("svg")
    elm.style(elm.STYLE_IEC)
    drawing = schemdraw.Drawing(show=False)
    drawing.config(unit=3.0, inches_per_unit=0.55, fontsize=14, font="Arial", color="#172033", lw=2.4)
    nodes = {name: tuple(value) for name, value in spec["nodes"].items()}
    labels: list[tuple[str, tuple[float, float], str]] = []

    for wire in spec["wires"]:
        points = [nodes[wire["from"]]] + [tuple(p) for p in wire.get("via", [])] + [nodes[wire["to"]]]
        for index, (start, end) in enumerate(zip(points, points[1:])):
            _add_with_endpoint_check(drawing, elm.Line(), start, end, f"wire {wire['from']}->{wire['to']} segment {index}")

    for component in spec["components"]:
        start, end = nodes[component["from"]], nodes[component["to"]]
        element = _make_element(component["type"])
        if component.get("label"):
            midpoint = ((start[0] + end[0]) / 2, (start[1] + end[1]) / 2)
            if start[1] == end[1]:
                label_at = (midpoint[0], midpoint[1] + 0.8)
                alignment = "center"
            else:
                label_at = (midpoint[0] + 1.0, midpoint[1])
                alignment = "left"
            labels.append((component["label"], label_at, alignment))
        _add_with_endpoint_check(drawing, element, start, end, f"component {component['id']}")

    for text, position, alignment in labels:
        drawing.add(
            elm.Label()
            .at(position)
            .theta(0)
            .label(text, loc="center", halign=alignment, valign="center")
        )

    svg = drawing.get_imagedata("svg").decode("utf-8")
    svg = re.sub(r"^<\?xml[^>]+>\s*", "", svg)
    svg = re.sub(r"<!DOCTYPE[^>]+>\s*", "", svg)
    svg = svg.replace(
        "<svg ",
        f'<svg role="img" aria-label="{html.escape(spec["description"], quote=True)}" ',
        1,
    )
    svg = svg.replace(
        ">",
        f"><title>{html.escape(spec['title'])}</title><desc>{html.escape(spec['description'])}</desc>",
        1,
    )
    validate_svg(svg)
    return svg


def validate_svg(svg: str) -> None:
    if re.search(r"(?i)(?:^|[^a-z])(nan|[-+]?inf(?:inity)?)(?:[^a-z]|$)", svg):
        fail("rendered SVG contains a non-finite value")
    try:
        root = ET.fromstring(svg)
    except ET.ParseError as exc:
        fail(f"rendered SVG is malformed: {exc}")
    if not root.tag.endswith("svg"):
        fail("rendered artifact root is not SVG")
    view_box = root.attrib.get("viewBox")
    if not view_box or len(view_box.split()) != 4:
        fail("rendered SVG has no valid viewBox")
    if not any(child.tag.endswith(("path", "line", "circle")) for child in root.iter()):
        fail("rendered SVG contains no circuit geometry")


def render_html(spec: dict[str, Any], svg: str) -> str:
    title = html.escape(spec["title"])
    description = html.escape(spec["description"])
    state = html.escape(spec["expected_state"].replace("-", " ").title())
    return f"""<!doctype html>
<html lang="en-AU">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="icon" href="data:,">
<title>{title} — Electrical Diagram</title>
<style>
  :root {{ color-scheme: light; font-family: Inter, Aptos, Arial, sans-serif; background:#eef3f8; color:#172033; }}
  * {{ box-sizing:border-box; }}
  body {{ margin:0; min-height:100vh; display:grid; place-items:center; padding:32px; }}
  main {{ width:min(980px, 100%); background:#fff; border:1px solid #d7e0ea; border-radius:20px; box-shadow:0 18px 55px rgba(30,55,80,.12); overflow:hidden; }}
  header {{ display:flex; align-items:flex-start; justify-content:space-between; gap:24px; padding:26px 30px 18px; border-bottom:1px solid #e5ebf1; }}
  h1 {{ margin:0 0 7px; font-size:clamp(24px,4vw,36px); letter-spacing:-.025em; }}
  p {{ margin:0; color:#536273; line-height:1.5; }}
  .badge {{ flex:none; padding:7px 11px; border-radius:999px; background:#e7f4ed; color:#17613a; font-size:12px; font-weight:750; letter-spacing:.04em; text-transform:uppercase; }}
  .diagram {{ padding:36px 40px 30px; display:grid; place-items:center; min-height:460px; }}
  .diagram svg {{ width:min(760px,100%); height:auto; max-height:520px; }}
  footer {{ display:flex; justify-content:space-between; align-items:center; gap:16px; padding:16px 24px; background:#f7f9fb; border-top:1px solid #e5ebf1; }}
  .actions {{ display:flex; gap:10px; }}
  button {{ appearance:none; border:1px solid #b8c5d2; background:#fff; color:#172033; border-radius:10px; padding:9px 13px; font:inherit; font-weight:650; cursor:pointer; }}
  button:hover {{ background:#edf3f8; }}
  .credit {{ font-size:12px; color:#718096; }}
  @media print {{ :root, body {{ background:#fff; }} body {{ padding:0; }} main {{ box-shadow:none; border:0; }} footer {{ display:none; }} }}
</style>
</head>
<body>
<main>
  <header><div><h1>{title}</h1><p>{description}</p></div><span class="badge">{state}</span></header>
  <section class="diagram" id="diagram">{svg}</section>
  <footer><span class="credit">Validated classroom circuit · IEC-style symbols</span><div class="actions"><button id="svg-download">Download SVG</button><button id="png-download">Download PNG</button></div></footer>
</main>
<script>
const diagram = document.querySelector('#diagram svg');
function svgText() {{ const copy=diagram.cloneNode(true); copy.setAttribute('xmlns','http://www.w3.org/2000/svg'); return new XMLSerializer().serializeToString(copy); }}
document.querySelector('#svg-download').addEventListener('click', () => {{ const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([svgText()],{{type:'image/svg+xml'}})); a.download='{Path(spec['title']).stem or 'circuit'}.svg'; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),1000); }});
document.querySelector('#png-download').addEventListener('click', () => {{ const image=new Image(); const blob=new Blob([svgText()],{{type:'image/svg+xml'}}); const url=URL.createObjectURL(blob); image.onload=()=>{{ const vb=diagram.viewBox.baseVal; const scale=3; const canvas=document.createElement('canvas'); canvas.width=Math.ceil(vb.width*scale); canvas.height=Math.ceil(vb.height*scale); const ctx=canvas.getContext('2d'); ctx.fillStyle='#fff'; ctx.fillRect(0,0,canvas.width,canvas.height); ctx.drawImage(image,0,0,canvas.width,canvas.height); URL.revokeObjectURL(url); canvas.toBlob(out=>{{ const a=document.createElement('a'); a.href=URL.createObjectURL(out); a.download='{Path(spec['title']).stem or 'circuit'}.png'; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),1000); }},'image/png'); }}; image.src=url; }});
</script>
</body>
</html>
"""


def load_spec(path: Path) -> dict[str, Any]:
    try:
        raw = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        fail(f"could not read {path}: {exc}")
    return validate_spec(raw)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", type=Path, help="Circuit JSON input")
    parser.add_argument("output", type=Path, nargs="?", help="HTML output path")
    parser.add_argument("--validate-only", action="store_true", help="Validate without rendering")
    args = parser.parse_args()
    try:
        spec = load_spec(args.input)
        if args.validate_only:
            print(f"PASS {args.input}: semantic validation")
            return 0
        if args.output is None:
            fail("output path is required unless --validate-only is used")
        svg = render_svg(spec)
        html_output = render_html(spec, svg)
        args.output.parent.mkdir(parents=True, exist_ok=True)
        svg_path = args.output.with_suffix(".svg")
        args.output.write_text(html_output, encoding="utf-8", newline="\n")
        svg_path.write_text(svg, encoding="utf-8", newline="\n")
        print(f"PASS {args.input}: semantic + SVG validation")
        print(f"HTML {args.output.resolve()}")
        print(f"SVG  {svg_path.resolve()}")
        return 0
    except CircuitValidationError as exc:
        print(f"FAIL {args.input}: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
