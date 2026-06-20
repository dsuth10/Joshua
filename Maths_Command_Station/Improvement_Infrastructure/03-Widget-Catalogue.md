# 03 — Widget Catalogue

The complete specification of the shared widget library. Each entry defines: purpose, backing library, configuration surface, the `getValue()` answer contract, interaction modes, age-band adaptations (A = Prep–Y1, B = Y2–3, C = Y4–6; see doc 06), and the existing hand-rolled code it replaces.

Widget IDs are the strings passed to `MCS.create(id, container, config)`.

**Priority key:** 🔴 P1 (unblocks the most question sets) · 🟠 P2 · 🟢 P3 (new capability, mostly lower grades)

---

## Module: `mcs-board.js` — JSXGraph primitives (internal)

Not student-facing widgets; the shared substrate the Space/Data/Number-line widgets are built on.

| Factory | Provides |
|---------|----------|
| `MCS.board.make(container, {bbox, axes, grid, snap})` | Themed JSXGraph board: Command Station colours, locked zoom/pan (children must never scroll the plane away), `keepAspectRatio`, ResizeObserver wiring |
| `MCS.board.point(board, opts)` | Draggable/fixed point with band-scaled size, snap-to-grid, halo on touch |
| `MCS.board.label(board, opts)` | Mono-font label helper |

---

## Module: `mcs-widgets-number.js`

### 🔴 N1. `number-line`

The single most reused widget in the app (currently five separate inline-SVG implementations across Y3–Y6).

- **Library:** JSXGraph (1-D board, y locked).
- **Modes:**
  - `mode: 'place-point'` — student drags a pin onto the line (snap step configurable: integers, halves, quarters, tenths…). *Replaces and upgrades:* Y3 assessment `initFractionPlotter` (`year3.js` ~453–585), Y6 static negative line (`year6-practice.js` ~678–709).
  - `mode: 'read-point'` — fixed marked point; answer given elsewhere. *Replaces:* `makeFractionLineSvg` (Y3), `makeMixedNumberLineSvg` (Y4), `makeNumberLineSvg` (Y5).
  - `mode: 'order-points'` — several labelled pins; student drags them into position; widget reports the full arrangement.
  - `mode: 'jump'` (Band A/B) — frog/rocket token hops along the line in unit jumps as the student taps; teaches counting-on and addition as movement.
- **Config:** `{ min, max, snapStep, ticks: {major, minor, labels}, markers: [...], token: 'pin'|'rocket'|'frog', showFractionLabels }`
- **getValue():** `number` | `number[]` (positions in mathematical coordinates, never pixels).
- **Band notes:** A → range ≤ 0–20, jump tokens, every integer labelled, snap radius huge; C → negatives, decimals, unlabelled minor ticks.

### 🔴 N2. `fraction-bars`

- **Library:** Konva.
- **Modes:**
  - `mode: 'display'` — partitioned bars (replaces `makeFractionBarSvg`, Y5 ~918–940).
  - `mode: 'shade'` — student taps segments to shade; answer = fraction shaded. *Upgrades* Y3 unit-fraction questions from "look + type" to "build".
  - `mode: 'partition'` — student taps a slicer button to cut a whole into n parts, then shades — builds the unit-fraction concept itself.
  - `mode: 'compare'` — two stacked bars with draggable shading; widget reports both fractions for equivalence questions (Y4 `AC9M4N03`-style, Y5 equivalent fractions).
- **getValue():** `{num, den}` or `[{num, den}, {num, den}]`.
- **Band notes:** A → halves/quarters only, snap whole segments; B → eighths; C → arbitrary denominators, mixed numerals via a whole-bars row.

### 🟢 N3. `counters` (Band A/B core manipulative)

- **Library:** Konva.
- **Description:** A tray of draggable counters (dots/stars/satellites to fit the space theme) plus optional **drop zones**. The foundational Prep widget.
- **Modes:** `free-count` (drag out n counters), `sort` (drag into labelled zones), `match` (one counter per picture), `make-equal-groups` (sharing/division precursor).
- **Config:** `{ count, zones: [{id, label, capacity}], sprite, maxSupply }`
- **getValue():** `{ zoneId: count, ... , unplaced: n }`
- **Feedback:** counters snap into neat grid slots inside zones (no overlapping mess); each drop emits a `'drop'` audio event; optional auto-count voice/numeral flash (06 §5).

### 🟢 N4. `ten-frame`

- **Library:** Konva (a `counters` specialisation with a fixed 2×5 frame background, or 2 frames for teens).
- **Modes:** `fill-to(n)`, `show-me(n)` (read the frame), `make-ten` (how many more?), `double-frame` for 11–20.
- **getValue():** `{ filled: n }` or per-frame counts.
- **Why it matters:** ten-frames + subitising are the heart of Foundation number sense (AC9MFN02/N04); nothing in the current app serves this.

### 🟠 N5. `place-value-blocks` (MAB / base-10 blocks)

- **Library:** Konva.
- **Modes:**
  - `build(n)` — student drags ones/tens/hundreds/thousands blocks onto a mat to construct a number; widget live-totals.
  - `read` — blocks shown, student answers elsewhere.
  - `trade` — drag 10 ones onto a tens plate and watch them fuse (regrouping animation) — directly supports Y3 add/sub with regrouping and *upgrades* the Y3 assessment `initAccordionExpander` (`year3.js` ~590–690) and Y4/Y5 decimal expanders (extend blocks to tenths/hundredths flats).
- **getValue():** `{ thousands, hundreds, tens, ones, tenths, hundredths, total }`
- **Band notes:** A → ones only (counting collections); B → to 1,000 with trading; C → decimals.

### 🟠 N6. `number-track` / hundred chart

- **Library:** Konva grid of tappable cells (the Y5 "divisibility 1–50 click grid" generalised).
- **Modes:** `shade-multiples`, `find-number`, `count-by` (animated skip-count trail), `missing-numbers` (Band A: tap the cell that comes next).
- **getValue():** `number[]` (selected cells).
- *Replaces:* Y5 divisibility grid (~1920–1970) and serves Prep–Y2 counting sequences.

### 🟠 N7. `array-builder`

- **Library:** Konva.
- **Description:** Drag to size an r×c array of dots/tiles; live count displayed. Multiplication as arrays (Y2–Y4), commutativity (rotate the array), area model intro.
- **getValue():** `{ rows, cols }`
- **Band notes:** B core; C uses it for factor pairs (Y5 `AC9M5N02` factor questions get a visual mode).

---

## Module: `mcs-widgets-measure.js`

### 🔴 M1. `analog-clock`

- **Library:** Konva (hands are rotated shapes with drag constraints — exactly Konva's sweet spot).
- **Modes:**
  - `set-time` — draggable hour & minute hands, **geared**: dragging the minute hand sweeps the hour hand proportionally (the current Y3 assessment clock moves them independently, which teaches a misconception — this is a correctness fix, not just polish). Snap: hour→hour positions (Band A), minutes→5 min (Band B), →1 min (Band C).
  - `read-time` — fixed hands. *Replaces:* `makeClockSvg` (Y3 ~760–801), `makePracticeClockSvg` dual clocks (Y4 ~768–810).
  - `elapsed` — two synced faces + a duration arc that shades as the student drags the second clock. *Upgrades* Y4 duration questions.
- **Config:** `{ hours, minutes, draggable: 'both'|'minute'|'none', snapMinutes, showDigital, gear: true }`
- **getValue():** `{ hours, minutes }` (24h normalised if `showDigital: '24h'`).
- *Replaces:* Y3 assessment `initAnalogClock` (`year3.js` ~836–1005) including its ±5 min buttons (kept as Band-A friendly nudge buttons).

### 🟠 M2. `protractor`

- **Library:** Konva.
- **Description:** A translucent, **draggable and rotatable protractor tool** the student positions over an angle to measure it — modelling the real classroom skill (lining up the baseline and origin), which no static SVG can teach.
- **Modes:**
  - `measure` — fixed angle drawn beneath; student places protractor, then enters the reading. Widget can verify placement quality (origin within tolerance of vertex) and hint accordingly.
  - `construct` — student drags a ray to build an angle of n°; live degree readout optional.
  - `classify` — no protractor; angle + MCQ buttons (acute/right/obtuse/straight/reflex). *Replaces:* Y4 `makeAngleSvg` (~814–859), Y5 `makeAngleSvg` + estimate radios (~944–982).
- **getValue():** `{ angle: n }` or `{ classification: 'obtuse' }` or placement quality object.
- **Band notes:** B → classify + estimate to nearest 10°; C → measure/construct to 1°, reflex angles (Y6 `AC9M6M04` ready).

### 🟠 M3. `ruler`

- **Library:** Konva.
- **Description:** Draggable cm/mm ruler over objects (pencils, cargo crates). Student aligns and reads length; or drags an object's edge to a target length.
- **Modes:** `measure-object`, `draw-length`, `informal-units` (Band A: lay paperclips end-to-end — tap to place, widget counts).
- **getValue():** `{ length, unit }` or `{ unitsUsed: n }`.
- **New capability:** serves Y1–Y2 informal/formal length descriptors and Y3–Y5 cm/mm/perimeter work.

### 🟠 M4. `shape-measurer` (perimeter & area board)

- **Library:** JSXGraph.
- **Description:** Rectilinear/compound shapes on a unit grid. Student can tap edges to highlight while summing perimeter, or tap unit squares to count area; missing-side questions reveal lengths as the student reasons.
- **Modes:** `perimeter`, `area-count`, `missing-sides` (the L-shape solver), `build-shape-with-area(n)` (drag vertices until area = n — rich Y4/Y5 task).
- **getValue():** `{ perimeter, area, highlightedEdges, vertices }`
- *Replaces:* Y5 compound L-shape inline SVG (~2171–2220) with full interactivity.

### 🟢 M5. `balance-scale`

- **Library:** Konva.
- **Description:** Two-pan balance that tilts under dragged masses. Foundation/Y1 "heavier/lighter" comparisons through to **Year 6 algebra**: bags labelled *x* on one side, units on the other — equality as balance, the canonical pre-algebra manipulative.
- **Modes:** `compare-masses` (A), `make-balance` (B: add units until level), `solve-unknown` (C: find x).
- **getValue():** `{ left: [...], right: [...], balanced: bool }`

### 🟢 M6. `capacity-jug`

- **Library:** Konva (clipped liquid rect + drag-to-pour).
- **Modes:** `read-scale` (mL/L graduations), `fill-to(n)`, `compare` (A: which holds more?).
- **getValue():** `{ volume, unit }`
- Serves Y1–Y5 capacity descriptors currently absent from the app.

---

## Module: `mcs-widgets-space.js`

### 🔴 S1. `coordinate-plotter`

The flagship migration target — consolidates **six** existing implementations (`makeGridSvg`, `makeReflectionGridSvg`, Y5 assessment grid, Y6 four-quadrant grid, Y3 landmark grid, Y4 alpha grid).

- **Library:** JSXGraph.
- **Modes:**
  - `plot-point` / `plot-points` — tap or drag pins to coordinates; first-quadrant (Y3–5) or four-quadrant (Y6). Closes the `four-quadrant-plotter` badge dead-end.
  - `read-point` — fixed markers, answer entered via paired MathLive/inputs.
  - `path` — student plots an ordered sequence of waypoints; widget draws the route live (dispatch missions). Optional animated rover follows the route on success — *upgrades* the Y3 delivery-van animation (`year3.js` ~1011–1170) into a reusable reward.
  - `alpha-grid` — A1–E5 lettered-cell mode with landmark sprites (Y3/Y4 map questions; Band B ergonomics).
  - `manhattan` — taps trace a grid path; widget counts units travelled (Y5 distance questions become kinesthetic).
- **Config:** `{ quadrants: 1|4, xMax, yMax, snap: 1|0.5, landmarks: [{x, y, sprite, label}], pinCount, labels }`
- **getValue():** `{x, y}` | ordered `[{x, y}…]` | `{cell: 'B3'}`
- **Band notes:** B → quadrant 1 ≤ 5×5, big labelled pins; C → 10×10 and four-quadrant, half-unit snap for Y6 scale work.

### 🔴 S2. `transform-board`

- **Library:** JSXGraph (its `reflection`/`rotate`/`translate` transforms do the maths natively).
- **Modes:**
  - `reflect` — pre-image polygon + mirror line; student drags image vertices; **live ghost preview** of the true reflection appears in hint mode. *Replaces:* `makeReflectionGridSvg` + click-cell plumbing (Y5 ~1016–1101, ~3054–3165).
  - `translate` — student drags the whole shape; widget reports the vector (Y5/Y6 "moved 3 right, 2 down" becomes a drag).
  - `rotate` — drag a handle to rotate about a marked centre in 90° snaps.
  - `drag-mirror-line` — invert the task: shape pair fixed, student positions the mirror line (deepens understanding; trivial with JSXGraph, near-impossible in the current code).
- **getValue():** `{ vertices: [...], vector: {dx, dy}, angle, mirrorLine: {...} }` per mode.

### 🟠 S3. `symmetry-painter`

- **Library:** Konva tap-grid.
- **Modes:** `complete-mirror` (paint the missing half — replaces Y4 symmetry board, practice ~1388–1430 and `year4.js` ~651–691), `find-lines` (drag mirror lines onto a finished pattern), `rotational` (Band C: complete a 4-fold pattern).
- **getValue():** `{ cells: [[r,c]…] }` or mirror-line definitions.
- **Band notes:** A → 4×4 grid, vertical line only, sprite stamps instead of colour fills.

### 🟠 S4. `shape-builder` / geoboard

- **Library:** JSXGraph (pegboard of fixed lattice points; student drags an elastic band polygon).
- **Modes:** `make-shape('rectangle')` (widget verifies properties — right angles, side equality — not a fixed answer key: any valid rectangle passes), `copy-shape`, `count-properties` (tap vertices/edges to count).
- **getValue():** `{ vertices, sides, angles, isValid<Property> }`
- Serves Y1 "recognise shapes" up to Y6 quadrilateral classification.

### 🟢 S5. `pattern-blocks`

- **Library:** Konva (rotation handles + edge-snapping).
- **Description:** Hexagons, trapeziums, rhombi, triangles, squares — the classic tray. Free-build mode plus structured tasks: `continue-pattern` (AC9MFA01 repeating patterns), `fill-outline` (composition/decomposition), `fraction-of-hex` (B/C: trapezium = ½ hexagon).
- **getValue():** placed pieces `[{shape, x, y, rotation}]` + per-task derived checks (pattern continuation correctness, outline coverage %).
- **Note:** edge-snap tolerance is the hard part; prototype early (Phase 1 spike list, doc 07).

### 🟢 S6. `net-folder`

- **Library:** Konva for the net + selection (keep Y5's working net-matcher pattern), with a stretch-goal CSS-3D fold animation on reveal.
- **Modes:** `match-net` (replaces Y5 ~2796–2927), `count-faces` (tap faces/edges/vertices on the wireframe).
- **getValue():** `{ selectedNet }` or counts.

---

## Module: `mcs-widgets-data.js`

### 🔴 D1. `column-graph`

- **Library:** JSXGraph.
- **Modes:**
  - `read` — interactive columns: tapping a column projects a guide line to the axis and shows its value *after* the student commits an answer (preserves rigour, adds exploration). *Replaces:* Y3 `makeBarChartSvg` (~840–874), Y4 `makeScaledBarChartSvg` hover-guide (~863–896), Y5 `makeBarChartSvg` (~986–1012).
  - `build` — **student drags column tops** to graph a small dataset (tally table provided) — the single biggest statistics upgrade; turns every "read the graph" descriptor into a "make the graph" capability (AC9M2ST02 → AC9M5ST02).
  - `picture-graph` (Band A/B) — drag one sprite per observation into columns; one-to-one then many-to-one scales.
- **Config:** `{ categories, values, scaleInterval, buildMode, maxY }`
- **getValue():** `{ values: {cat: n} }` (build) or selection state (read).

### 🟠 D2. `line-graph`

- **Library:** JSXGraph.
- **Modes:** `read` (tap a data point → crosshair guides), `plot` (drag points vertically per day; polyline follows), `trend` (tap the segment with the biggest rise — replaces Y5 `biggest-increase` context).
- **getValue():** `{ points: [...], selectedSegment }`
- *Replaces:* `makeLineGraphSvg` (Y5 ~845–891).

### 🟠 D3. `spinner`

- **Library:** Konva (sector geometry + spin tween with eased deceleration).
- **Modes:** `predict-and-spin` (chance language A/B; fraction probabilities C), `design` — drag sector boundaries to *make* a spinner where red is "likely" (probability as design, Y4–Y6), `experiment` — n auto-spins accumulate a live tally/column chart next to it (connects probability ↔ statistics, Y5/Y6 `AC9M6P02` simulations).
- **getValue():** `{ sectors: [{color, fraction}], results: {...} }`

### 🟠 D4. `marble-bag`

- **Library:** Konva (physics-lite: marbles settle with slight jitter; drag in/out of the bag).
- **Modes:** `read-likelihood` (replaces Y3 ~1407–1474 and Y5 ~3823–3900 marble visuals + button/radio flows), `make-likelihood` — *“drag marbles into the bag so blue is **certain**”* — constructive probability, far stronger pedagogy, `draw-experiment` — repeated draws with replacement, live tally.
- **getValue():** `{ counts: {color: n}, likelihoodChoice, results }`

### 🟢 D5. `sorting-table` (Band A/B data)

- **Library:** Konva drop-zones over a labelled table/Venn rings.
- **Description:** Drag picture cards into category columns or Venn regions; the precursor to all data work (AC9MFST01, Y1–Y2 data collection).
- **getValue():** `{ zoneId: [cardIds] }`

### 🟢 D6. `dice-coin-lab`

- **Library:** Konva (3D-feel roll/flip tweens) — upgrades Y5 `chance-experiment` (~3935–4050) into a shared widget with: pick apparatus, predict, run n trials, live tally bars, compare predicted vs observed fractions.
- **getValue():** `{ prediction, results: {...}, trials }`

---

## Module: `mcs-input.js`

### 🔴 I1. `math-field` — see doc `05-MathLive-Integration.md` for the full spec.

### 🟠 I2. `number-pad`

- **Library:** Plain DOM (existing keypad patterns formalised) — large-button 0–9/⌫ pad that fills a target display. Band A/B's alternative to MathLive when only whole numbers are needed (less visual machinery for five-year-olds than a full math keyboard).
- **getValue():** `number`.

---

## Cross-cutting Widget Behaviours (all entries above inherit these)

1. **Three feedback verbs** every widget implements visually: `flagCorrect()` (accent-green pulse + sparkle particle burst on the answer object), `flagIncorrect()` (soft shake, never harsh red-flood for Band A), `showSolution(v)` (animate to the correct state over ~800 ms — the solution is *demonstrated*, not just described).
2. **Snap-everything policy:** every draggable has a snap lattice; nothing can be left "almost right" and judged wrong by a pixel. Tolerances widen by band (06 §3).
3. **No interior scrolling, no zoom:** boards/stages are fixed-frame; gestures never pan the workspace (a major frustration source for children).
4. **Idempotent re-render:** `setValue(getValue())` must reproduce identical state — required for the second-attempt flow, which re-locks then re-enables widgets without regenerating the question.
5. **Deterministic test hook:** every widget exposes `_debugSet(value)` in a `MCS.debug` build flag so manual QA can drive states quickly (doc 07 §6).
