---
name: electrical-diagram
description: Create clean, validated symbolic electrical circuit diagrams from plain-language descriptions for primary-school lessons, worksheets and presentations. Use for simple circuits, circuit symbols, series or parallel arrangements, open or closed switches, missing-component examples and circuit fault-finding. Do not use for wiring plans, mains installations, PCB design or safety-critical engineering schematics.
metadata:
  version: "1.0.0"
---

# Electrical Diagram

Create a small circuit specification, validate its electrical teaching intent, render it deterministically with the bundled SchemDraw SVG engine, and inspect the final image before delivery.

## Workflow

1. Translate the request into the JSON format in [references/input-schema.md](references/input-schema.md). Start from the closest checked example in `examples/`.
2. Preserve deliberate faults. A request such as “without a battery” must use `expected_state: "intentionally-incomplete"`, list the missing component in `intentional_omissions`, and name its two `open_terminals`. Never silently repair a teaching example.
3. Use only the classroom components and conventions in [references/classroom-style.md](references/classroom-style.md). Ask only when ambiguity would materially change the topology; otherwise choose the simplest conventional circuit.
4. Render and validate:

   ```powershell
   python scripts/render_circuit.py examples/cell-and-lamp.json output/cell-and-lamp.html
   ```

   The command writes both HTML and SVG. It fails on invalid topology, unrequested components, accidental closed/open paths, diagonal wires, unexplained loose ends, crossings, malformed SVG or non-finite coordinates.
5. Open the HTML or SVG, inspect it at normal size, and correct any crowded labels, unclear symbols or visually ambiguous connections before delivery. Semantic validation does not replace visual review.

## Delivery

Return the rendered HTML and SVG, state whether the diagram represents a complete, open or intentionally incomplete circuit, and mention any deliberate omission. Prefer the white classroom presentation; use colour only when the user asks for emphasis.

For a package check, run:

```powershell
python scripts/validate_examples.py
```

The renderer is self-contained under `vendor/`; do not install or import a machine-global SchemDraw copy.
