# Electrical circuit diagram skill: engine research

Date: 6 September 2026  
Scope: clean, accurate, small circuit diagrams for primary-school teaching, generated from plain English. This is research and a recommendation only; no skill or dependency has been installed.

## Recommendation

Build a separate `electrical-diagram` skill using **SchemDraw as the symbol renderer**, while borrowing Archify's strongest ideas: a small typed intermediate representation (IR), deterministic rendering, machine-readable validation, golden examples and visual review before delivery.

Do **not** extend Archify's existing `architecture` mode or hand-draw circuit SVG. The installed Archify package is explicitly organised around five non-electrical diagram types and validates boxes, labels and routes rather than electrical components or nets ([local skill contract](../../../.agents/skills/archify/SKILL.md), [local package metadata](../../../.agents/skills/archify/package.json)). Its presentation shell and delivery discipline are reusable under MIT, but the electrical schema, symbols, topology checks and renderer should be a sibling skill so Archify can continue updating cleanly.

SchemDraw is the best fit because it is MIT-licensed, requires Python 3.9+, has a direct SVG backend, and treats Matplotlib and mathematical SVG text as optional extras. It already supplies the small symbol set this use case needs, including cells, batteries, lamps, switches, motors and meters, and can select IEC/European rather than IEEE/US resistor styling ([project and licence](https://github.com/cdelker/schemdraw), [installation and SVG output](https://schemdraw.readthedocs.io/en/stable/usage/start.html), [IEC/IEEE styles](https://schemdraw.readthedocs.io/en/stable/elements/electrical.html), [element API](https://schemdraw.readthedocs.io/en/latest/classes/electrical.html)).

## Options compared

| Option | Licence and dependencies | Output and standards | Validation potential | Fit |
|---|---|---|---|---|
| **SchemDraw** | MIT; Python 3.9+; core SVG backend, with Matplotlib and `ziamath` optional | Direct SVG; broad electrical symbol catalogue; selectable IEC/European and IEEE/US styles | Excellent basis for our own typed-IR and graph checks, but it does not advertise electrical-rules checking | **Best renderer for a small dedicated skill** |
| **Adapt Archify** | MIT; installed package uses Node 18+ and bundled validators, with Ajv used to build them | Excellent self-contained HTML and in-viewer PNG/JPEG/WebP/SVG export; current schemas cover architecture, workflow, sequence, data-flow and lifecycle diagrams ([upstream](https://github.com/tt-a1i/archify)) | Excellent geometry, route and label validation; no component-port, net or circuit-state model | Reuse its process and optionally its viewer shell, not its architecture renderer |
| **SchemaTex** | AGPL-3.0 for open-source use; commercial licence required for closed-source embedding; TypeScript with zero runtime dependencies ([official repository](https://github.com/SchemaTex/SchemaTex)) | Pure semantic SVG; a circuit DSL with positional and netlist modes; built-in battery, lamp, motor, buzzer and switch symbols | Promising parser diagnostics, circuit linting and auto-layout, designed for language-model generation | Closest ready-made “Archify for circuits” concept, but young and licence-sensitive; evaluate as a prototype, not the default foundation |
| **CircuiTikZ** | Dual LPPL/GPL; requires a LaTeX distribution plus TikZ/PGF and related packages | Very high-quality circuit typesetting with European/American variants and direct PDF; SVG normally adds a TeX-to-SVG conversion step ([official repository](https://github.com/circuitikz/circuitikz), [manual](https://circuitikz.github.io/circuitikz/circuitikzmanualgit.pdf)) | LaTeX compilation catches syntax faults, not whether the described topology is pedagogically or electrically what was requested | Strong publication option, but too much installation and authoring burden for this simple workflow |
| **KiCad** | Most program code GPLv3+; official symbol libraries CC BY-SA 4.0; full EDA installation ([licences](https://www.kicad.org/about/licenses/)) | Professional schematic capture; CLI SVG export | Strongest electrical validation: CLI ERC reports and can return a violation exit code. KiCad itself warns ERC is imperfect and depends on correct pin properties ([Schematic Editor](https://docs.kicad.org/9.0/en/eeschema/eeschema.html), [CLI](https://docs.kicad.org/master/en/cli/cli.html)) | Technically rigorous but disproportionate for a lamp-cell-switch worksheet and awkward for deliberately incomplete circuits |
| **diagrams.net / draw.io** | Core editor and official MCP are Apache 2.0; stencil libraries carry additional terms that do not restrict ordinary exported end-user diagrams ([editor licence](https://github.com/jgraph/drawio/blob/dev/README.md), [official MCP](https://github.com/jgraph/drawio-mcp)) | Editable `.drawio`; SVG/PNG/PDF export; official MCP shape search includes electrical shapes | XML and layout can be checked, but generic shapes/connectors do not establish circuit semantics or electrical correctness | Best fallback when teacher editability matters more than deterministic circuit validation |

## Existing agent skills and services found

- An existing MIT-licensed [Circuit Diagram Generator skill](https://github.com/yangwinnietang/Agent-Skill-Automated-circuit-diagram-synthesis) already turns text or images into CircuiTikZ and claims PDF/SVG output. It is a useful reference or quick experiment, but its published workflow requires LaTeX, CircuiTikZ and Python and does not document typed input, topology validation, golden tests or visual QA. I would not adopt it unchanged.
- [SchemaTex](https://github.com/SchemaTex/SchemaTex) is not a Codex skill, but it is explicitly built for language-model-authored diagrams and includes a circuit-specific parser, symbol library, netlist mode, auto-layout, linting and pure-SVG renderer. It deserves a controlled quality trial; the AGPL/commercial dual-licensing decision would need to be settled before embedding or adapting it.
- The [official draw.io MCP repository](https://github.com/jgraph/drawio-mcp) includes an MCP server plus a Claude Code skill/CLI. It can search more than 10,000 shapes, including electrical shapes, and produce editable draw.io files with PNG/SVG/PDF exports. It is the most mature ready-made general drawing route, but not a purpose-built elementary-circuit verifier.
- A small third-party [SchemDraw MCP server](https://github.com/fukayatti/schemdraw-mcp-server) exists and defaults to SVG, but wrapping the small Python library directly keeps the proposed skill simpler and makes the validation contract ours.

This was a bounded search of current public project repositories and documentation, not proof that no other private or unpublished skill exists. I did not find a mature, Codex-specific primary-school circuit skill that combines constrained plain-language input, deterministic vector output, topology checks and visual QA.

## Proposed skill contract

The crucial design choice is to validate **the requested teaching diagram**, not silently "repair" it. For example, “make a circuit without a battery” should record `intentional_omissions: [battery]`; a missing-battery check should then pass, while an accidentally added battery must fail.

1. Convert the prompt to a constrained JSON IR: diagram purpose, IEC symbolic style, component IDs and types, labelled ports, nets, switch state, expected circuit state (`complete`, `open` or `intentionally_incomplete`), and intentional omissions.
2. Validate the IR before drawing: allowed primary-school components only; unique IDs; valid ports and net endpoints; exact requested component counts; explicit omissions honoured; switch state honoured; and graph connectivity/closed-loop rules applied only when the prompt requires a working closed circuit.
3. Render with SchemDraw's SVG backend using a fixed classroom style: black on white, thick consistent strokes, generous spacing, large plain labels, orthogonal wires, no decorative technical detail and no unexplained crossings.
4. Validate the artifact: well-formed SVG; finite coordinates; non-empty `viewBox`; no orphan wire ends unless intentional; no component/label overlaps; no wire through text; and every IR component represented exactly once.
5. Render a PNG preview and visually inspect it. Keep golden fixtures for prompts such as one cell + one lamp, open/closed switch, two lamps in series/parallel, motor circuit, “without a battery”, and “find the missing component”.

## Sensible first slice

Prototype the sibling skill with SchemDraw and six golden prompts before copying any Archify viewer code. The gate should require: all semantic checks pass, SVGs are deterministic, every omission is honoured, and all six previews are visually clean. If the pure-SVG outputs already meet worksheet and presentation needs, keep the dependency and surface small; add an Archify-like HTML viewer/export shell only if it solves a demonstrated delivery problem.
