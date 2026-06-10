# 01 — Library Selection & Licensing

This document records the evaluation of candidate libraries, the constraints that drove the decision, and the final selection. The decision is already reflected throughout the rest of the plan; this is the rationale of record.

---

## 1. Hard Constraints

| # | Constraint | Source |
|---|-----------|--------|
| C1 | **No paid or licensed (proprietary) resources.** No subscriptions, API keys, usage caps, or commercial embedding terms. | Project owner directive |
| C2 | **GeoGebra and Polypad are excluded.** GeoGebra's apps are GPL + a non-commercial licence for the apps themselves; Polypad embedding now sits inside the Amplify/Desmos commercial ecosystem. Both fail C1's spirit and both feel like "someone else's app in an iframe." | Project owner directive |
| C3 | **Must run with no build step** — pages opened directly in a browser (including `file://`), consistent with the existing app. | Existing architecture (`README.md`) |
| C4 | **Must serve ages 5–12** — from pre-readers needing chunky drag-and-drop manipulatives, to Year 6 students plotting in four quadrants and entering fractional/negative answers. | Project owner directive |
| C5 | **Must integrate with vanilla JS.** No React/Vue; the app is plain scripts per page. | Existing architecture |
| C6 | **Touch and mouse parity.** The app is used on desktop today but manipulatives for five-year-olds realistically demand touch support. | Design requirement |

---

## 2. Candidates Evaluated

### 2.1 Mathematical canvas (axes, coordinates, geometry)

| Option | Licence | Verdict |
|--------|---------|---------|
| **JSXGraph** | **MIT / LGPL dual-licensed**, single ~1 MB self-contained `jsxgraphcore.js` + one CSS file, zero dependencies | ✅ **Selected** |
| Desmos API | Free tier requires an API key, commercial terms apply, online-only | ❌ Fails C1/C3 |
| GeoGebra Apps Embedding | GPL/non-commercial split licence, heavyweight (~20 MB+), iframe-feel | ❌ Excluded (C2) |
| D3.js | BSD-3, excellent for charts but no geometry model (points/lines/angles/constraints must be hand-built) | ❌ Wrong abstraction level — we'd be rebuilding JSXGraph |
| Plain SVG (status quo) | n/a | ❌ This is what we're upgrading away from |

**Why JSXGraph wins:**

- It is *maths-native*: boards have real mathematical coordinate systems, so a point at `(3, -2)` is declared as `(3, -2)` — no pixel math, which is the single largest source of bugs and rigidity in the current hand-rolled grids (`makeGridSvg`, `makeReflectionGridSvg`, `makeAssessmentGridSvg` are three separate pixel-math implementations of the same idea).
- **Draggable points with snapping** (`snapToGrid`, `snapSizeX/Y`) are one attribute, not 130 lines of pointer-event code (compare `initFractionPlotter` in `year3.js`, ~453–585).
- Built-in elements cover nearly the whole Space/Statistics widget list: `point`, `segment`, `line`, `polygon`, `angle` (with live degree labels), `slider`, `functiongraph`, `chart`, `reflection`, `mirrorelement`, `transform` (rotation/translation), `grid`, `axis`, `text` (LaTeX-capable).
- Renders to SVG, styles via attributes — themable to the Command Station palette.
- Active academic project (Uni Bayreuth), 20+ years old, used by WeBWorK/Moodle/STACK — proven in education specifically.

### 2.2 Manipulatives canvas (free-form drag-and-drop objects)

| Option | Licence | Verdict |
|--------|---------|---------|
| **Konva** | **MIT**, single UMD file (`konva.min.js`, ~150 KB gz), zero dependencies | ✅ **Selected** |
| Fabric.js | MIT, similar capability | ⚠️ Viable runner-up — see below |
| Pixi.js | MIT, WebGL-first game engine | ❌ Overkill; WebGL adds GPU/driver variance for no benefit at this object count |
| Interact.js + DOM/SVG | MIT, drag/resize on DOM nodes | ⚠️ Fine for simple drags but no scene graph, layering, hit-testing on irregular shapes, or canvas perf for many objects |
| HTML5 Drag & Drop API | n/a | ❌ Notoriously poor touch support; wrong tool for continuous dragging |

**Konva vs Fabric.js (the real contest):** Both are mature MIT canvas object models. Konva is selected because:

1. **First-class mobile/touch events** (`touchstart`, `tap`, `dragmove` unified with mouse) — critical for C6.
2. **Layer system** with separate canvases per layer → cheap redraws when dragging one counter over a static ten-frame background.
3. **Built-in hit graph** (colour-keyed hit canvas) gives pixel-accurate hit detection on irregular shapes (pattern blocks, fraction sectors) for free.
4. Simpler, more modern API surface for our use (we don't need Fabric's rich-text/SVG-parsing/free-drawing strengths).
5. Tweening built in (`Konva.Tween`) — enough for snap-back animations and the existing "van along a route" style animations without another dependency.

Fabric.js remains the documented fallback if Konva ever becomes unmaintained; the widget API in `02-Architecture.md` deliberately hides the renderer so a swap stays contained.

### 2.3 Maths input

| Option | Licence | Verdict |
|--------|---------|---------|
| **MathLive** (`mathlive` / cortex-js) | **MIT**, web component, self-hostable, includes on-screen maths keyboard | ✅ **Selected** (owner-endorsed) |
| MathQuill | MPL 2.0, jQuery dependency, dormant maintenance | ❌ Older, heavier integration |
| Plain `<input>` + parsing (status quo) | n/a | ❌ Already causing fragile `parseFraction`-style validation; cannot express ¾, x², −3.5 naturally |

**Why MathLive wins:**

- `<math-field>` is a **standard web component** — drop a tag in HTML, no framework needed (C5 ✅).
- Ships a **customisable on-screen virtual keyboard** — definable per age band (a Prep keyboard with only digits 0–10; a Year 6 keyboard with fractions, negatives, exponents). This is the killer feature for the 5–12 range (C4 ✅).
- Output as LaTeX, MathASCII, or MathJSON; paired with the optional MIT-licensed **Compute Engine** (`@cortexjs/compute-engine`) we can check `0.75`, `3/4` and `\frac{6}{8}` as *mathematically equivalent* instead of string-comparing.
- Self-hosted: vendored `mathlive.min.js` + its fonts/sounds directory works offline.

### 2.4 Optional fourth: charts

Year 3–5 bar/line charts could use Chart.js (MIT). **Decision: no.** JSXGraph's `chart` element plus our own bars-as-polygons cover the curriculum need (read a value, compare columns, find max/min) with full click-interactivity on data marks, and one less dependency. Revisit only if Year 6+ statistics ever needs rich tooltips/animation beyond JSXGraph's comfort.

---

## 3. Licence Verification Summary

| Library | Licence | Commercial use | Self-host offline | Attribution burden |
|---------|---------|----------------|-------------------|--------------------|
| JSXGraph ≥ 1.4 | MIT **or** LGPL-3.0 (dual, our choice → MIT) | ✅ | ✅ single JS+CSS | Keep licence header in vendored file |
| Konva | MIT | ✅ | ✅ single JS | Keep licence header |
| MathLive | MIT | ✅ | ✅ JS + fonts dir | Keep licence header |
| @cortexjs/compute-engine (optional) | MIT | ✅ | ✅ single JS | Keep licence header |

> **Action item:** when vendoring, copy each project's `LICENSE` file into `vendor/<lib>/LICENSE` and record the exact version in `vendor/VERSIONS.md`. Verify the licence text shipped with the downloaded release at vendoring time (licences are re-checked at the moment of adoption, not assumed from this document).

---

## 4. Division of Labour (Decision Matrix)

The rule of thumb that governs every widget spec in `03-Widget-Catalogue.md`:

| The question involves… | Use |
|------------------------|-----|
| Axes, coordinates, gradients, geometric constructions, transformations, mathematically-positioned points, graphs of data or functions | **JSXGraph** |
| Physical-object metaphors: counters, tiles, blocks, clock hands, ruler/protractor tools, sorting, stacking, free placement | **Konva** |
| The *answer* is a number, fraction, expression or equation typed by the student | **MathLive** |
| Simple selection (MCQ buttons, chips, dropdowns) | **Plain DOM** (existing patterns are fine — don't over-engineer) |

A single question may combine all four (e.g. Year 5 reflection: JSXGraph board for the grid + MathLive field for "how many units did it move?").

---

## 5. Risks Accepted with This Selection

| Risk | Mitigation |
|------|------------|
| JSXGraph's API has a learning curve (board/element attribute system) | Wrapped behind `mcs-widgets` factories; question authors never touch raw JSXGraph |
| Two rendering systems (SVG via JSXGraph, canvas via Konva) on one page | Acceptable: they never share a surface; both are encapsulated per-widget. Memory tested in Phase 1 spike |
| MathLive bundle (~700 KB + fonts) is the heaviest dependency | Loaded only on pages that use it (deferred `<script>`); fonts subset if needed |
| `file://` quirks (ES module imports blocked in Chrome) | Entire engine ships as classic scripts attaching to a global namespace — see `02-Architecture.md` §3 |
| Konva abandonment (single-maintainer ecosystems can stall) | Renderer-agnostic widget API; Fabric.js is a documented drop-in fallback path |
