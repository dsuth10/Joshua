# 04 — Year-Level Matrix (Prep → Year 6)

How the widget library maps onto each year level and Australian Curriculum v9 strand: what gets *upgraded* (Years 3–6, live today) and what gets *built new* (Prep–Year 2, currently "Coming Soon").

> **Curriculum-code caveat:** Year 3–6 descriptor codes below are taken from the live app's `achievements-config.js` and are authoritative. Foundation–Year 2 codes are indicative of AC v9 and **must be verified against the published ACARA v9 curriculum** when those year levels' `DESCRIPTOR_BADGES` entries are authored (tracked as task R-07 in doc 07).

---

## 1. Age Bands (drives every widget's ergonomics — full rules in doc 06)

| Band | Years | Ages | Interaction ceiling |
|------|-------|------|---------------------|
| **A** | Prep–Year 1 | 5–6 | Drag, tap, big targets, no required reading, audio prompts, no typing beyond a 0–10 pad |
| **B** | Years 2–3 | 7–8 | Drag + tap + short typed numbers, simple fraction entry, light text prompts |
| **C** | Years 4–6 | 9–12 | Full widget feature set, MathLive entry, multi-step tasks, precision snapping |

---

## 2. Years 3–6 — Upgrade Map (existing question sets)

Each row is an existing question family; "Upgrade" states the concrete interactivity gained. Widget IDs reference doc 03.

### Year 3 (Band B) — teal theme

| Strand | Descriptor | Current implementation | Upgrade | Widget(s) |
|--------|-----------|------------------------|---------|-----------|
| Number | AC9M3N01 | Numeral ordering via 4 dropdowns | Drag numeral cards into order on a track | `number-line` (order-points) |
| Number | AC9M3N02 | Static fraction line/bar SVG + num/den inputs | Shade fraction bars; drag pin onto line | `fraction-bars` (shade), `number-line` (place-point) |
| Number | AC9M3N03 | Add/sub regroup text inputs | Optional `place-value-blocks` *trade* mode as visual scaffold on second attempt | `place-value-blocks` |
| Algebra | AC9M3A02/A03 | Fact family / recall text inputs | Keep text-first (recall is the point); add `array-builder` hint visual | `array-builder` |
| Measurement | AC9M3M03 | Static clock SVG + hour/min inputs | Drag geared clock hands to set the time | `analog-clock` (set-time) |
| Space | AC9M3SP02 | Static landmark grid + coord inputs/select | Tap the map to locate; drag pin to navigate | `coordinate-plotter` (alpha-grid / plot-point) |
| Statistics | AC9M3ST0x | Static column chart + input | Tap-to-inspect columns; *build* mode for collected data | `column-graph` (read/build) |
| Probability | AC9M3P01 | Static marble jar + likelihood buttons | Drag marbles to *make* a bag matching a likelihood word | `marble-bag` (read/make) |
| **Assessment** | — | Draggable fraction plotter, accordion expander, draggable clock, delivery map (all bespoke) | Re-platform on `number-line`, `place-value-blocks`, `analog-clock`, `coordinate-plotter` (path + rover animation) | — |

### Year 4 (Band C-entry) — amber theme

| Strand | Descriptor | Current | Upgrade | Widget(s) |
|--------|-----------|---------|---------|-----------|
| Number | AC9M4N01 (decimals) | Button calculator device | Keep (it works well); re-skin onto engine theming only | existing + `place-value-blocks` (decimal mode) |
| Number | AC9M4N04 | Static mixed-numeral line | Drag pin to mixed numerals; quarters snapping | `number-line` |
| Algebra | AC9M4A0x | Multi-input inverse equations | MathLive fields; `balance-scale` visual for unknowns | `math-field`, `balance-scale` |
| Measurement | AC9M4M0x (time) | Dual static clocks + duration inputs | `analog-clock` *elapsed* mode with shaded duration arc | `analog-clock` |
| Space | AC9M4SP0x (angles) | Static angle SVG + MCQ buttons | Classify stays MCQ; add estimate-by-rotating-ray mode | `protractor` (classify/construct) |
| Space | AC9M4SP03 (symmetry) | Click-cell symmetry board (already interactive) | Port to `symmetry-painter` (gains mirror-line dragging + rotational mode for the `symmetry-rotational` context) | `symmetry-painter` |
| Statistics | AC9M4ST0x | Scaled column chart w/ hover line | `column-graph` read + build modes | `column-graph` |
| Probability | AC9M4P0x | Likelihood `<select>` per event | Drag event cards onto an impossible→certain spectrum line | `number-line` (order-points, labelled spectrum) + `sorting-table` |

### Year 5 (Band C) — blue theme — *largest file, biggest payoff*

| Strand | Descriptor | Current | Upgrade | Widget(s) |
|--------|-----------|---------|---------|-----------|
| Number | AC9M5N01/N02 | Ordering selects; factor YES/NO + list input | Factor questions gain `array-builder` visual proof mode | `array-builder`, `math-field` |
| Number | AC9M5N04 (fractions) | Static bars + parseFraction text inputs | `fraction-bars` compare mode + MathLive fraction entry (kills `parseFraction` fragility) | `fraction-bars`, `math-field` |
| Algebra | AC9M5A01/A02 | Grid of text inputs | MathLive fields; `balance-scale` solve-unknown | `math-field`, `balance-scale` |
| Measurement | AC9M5M02 | Static L-shape SVG + perimeter/area inputs | Interactive `shape-measurer`: tap edges, count unit squares, missing-side mode | `shape-measurer` |
| Measurement | AC9M5M03 | 12h↔24h text conversion | Add `analog-clock` with 24h digital twin display | `analog-clock` |
| Space | AC9M5SP02 | 10×10 grid: inputs move marker; click cells (reflection only) | Full tap/drag plotting; manhattan path tracing | `coordinate-plotter` |
| Space | AC9M5SP03 | Reflection grid w/ click-cells + coord inputs | Drag-vertex `transform-board` (reflect/translate/rotate + drag-mirror-line) | `transform-board` |
| Statistics | AC9M5ST02 | Static line graph + inputs | Tap-to-read crosshairs; plot mode; biggest-rise segment tap | `line-graph` |
| Probability | AC9M5P01 | Chips, marble radios, coin/die interval sim | `marble-bag` + `dice-coin-lab` + `spinner` suite | `marble-bag`, `dice-coin-lab`, `spinner` |
| **Assessment** | — | Decimal expander, dispatch grid (inputs only) | `place-value-blocks` (decimal), `coordinate-plotter` (path mode) | — |

### Year 6 (Band C) — emerald theme

| Strand | Descriptor | Current | Upgrade | Widget(s) |
|--------|-----------|---------|---------|-----------|
| Number | AC9M6N01 | Static −10…10 line + number input | Drag pin on negative `number-line`; four-quadrant plot for the `cartesian-four-quadrants` context | `number-line`, `coordinate-plotter` |
| Number | AC9M6N0x (primes) | Radio classification | Keep radios; add `number-track` sieve-shading mode (mirrors the assessment sieve) | `number-track` |
| Number | AC9M6N07/N08 (fractions/percentages) | Text inputs | MathLive fraction/percent entry; `fraction-bars` ↔ percentage dual display | `math-field`, `fraction-bars` |
| Algebra | AC9M6A0x | Text inputs | MathLive; `balance-scale` solve-unknown as hint scaffold | `math-field`, `balance-scale` |
| Measurement | AC9M6M0x | Text inputs (metric conversion) | Keep the assessment's decimal-shift regulator idea as a practice widget (port to engine) | `place-value-blocks` decimal-shift mode |
| Space | AC9M6SP02 | **Config promises `four-quadrant-plotter` but no grid exists in practice** | New four-quadrant `coordinate-plotter` questions — closes a badge dead-end | `coordinate-plotter` |
| Statistics | AC9M6ST0x | Text/MCQ | `line-graph` + `column-graph` interpretation suite | `line-graph`, `column-graph` |
| Probability | AC9M6P02 | Text fractions | `spinner` design + experiment modes (expected vs observed) | `spinner`, `dice-coin-lab` |
| **Assessment** | — | Sieve cards (good), shift regulator (good), static angle SVG, input-only quadrant grid | Angle diagram → `protractor` measure mode; quadrant grid → tap-to-plot | — |

---

## 3. Prep–Year 2 — New Build (currently "Coming Soon")

These pages don't exist yet. The widget engine is **the prerequisite** for building them well: at ages 5–7 almost every question *is* a manipulative. Question sets below are the inaugural target list per year; each line = one question family (generator) with its widget and indicative AC v9 descriptor.

### Prep / Foundation (Band A, age 5) — proposed theme: `theme-sunrise`

| # | Question family | Widget (mode) | Indicative descriptor |
|---|----------------|---------------|----------------------|
| F1 | Count out n satellites into the docking bay (1–20) | `counters` (free-count) | AC9MFN01 |
| F2 | Flash subitising: how many? (1–6, brief display) | `ten-frame` (show-me) + `number-pad` | AC9MFN02 |
| F3 | Which group has more/fewer? (tap the group) | `counters` (compare zones) | AC9MFN03 |
| F4 | Make 5 / make 10 on the ten-frame | `ten-frame` (fill-to / make-ten) | AC9MFN04 |
| F5 | Share 8 fuel cells between 2 rovers fairly | `counters` (make-equal-groups) | AC9MFN06 |
| F6 | Copy & continue the repeating pattern | `pattern-blocks` (continue-pattern) | AC9MFA01 |
| F7 | Which is longer/heavier/holds more? (direct compare) | `ruler` (informal), `balance-scale` (compare), `capacity-jug` (compare) | AC9MFM01 |
| F8 | Order the daily mission events (morning→night) | `sorting-table` (sequence lane) | AC9MFM02 |
| F9 | Sort the shapes into the right hangars | `sorting-table` + shape sprites | AC9MFSP01 |
| F10 | Move the rover: in front of / behind / next to | `coordinate-plotter` (alpha-grid, 3×3, positional language) | AC9MFSP02 |
| F11 | Yes/no question sort (Do you like…?) into columns | `sorting-table` → `column-graph` (picture-graph) | AC9MFST01 |

### Year 1 (Band A→B transition, ages 6–7)

| # | Question family | Widget (mode) | Indicative descriptor |
|---|----------------|---------------|----------------------|
| Y1-1 | Numbers to 120 on the number track; missing numbers | `number-track` (missing-numbers, find-number) | AC9M1N01 |
| Y1-2 | Partition teen numbers (1 ten + n ones) | `place-value-blocks` (build, tens+ones), `ten-frame` (double-frame) | AC9M1N02 |
| Y1-3 | Addition/subtraction within 20 as jumps | `number-line` (jump mode) | AC9M1N04 |
| Y1-4 | Skip count by 2s/5s/10s (animated trail) | `number-track` (count-by) | AC9M1A0x |
| Y1-5 | Measure with informal units (paperclips) | `ruler` (informal-units) | AC9M1M0x |
| Y1-6 | O'clock and half-past | `analog-clock` (set-time, hour snap) | AC9M1M03 |
| Y1-7 | Make/copy 2-D shapes on the pegboard | `shape-builder` (copy-shape) | AC9M1SP0x |
| Y1-8 | One-to-one picture graph from sorted data | `sorting-table` → `column-graph` (picture-graph) | AC9M1ST0x |

### Year 2 (Band B, ages 7–8)

| # | Question family | Widget (mode) | Indicative descriptor |
|---|----------------|---------------|----------------------|
| Y2-1 | Numbers to 1,000 with blocks; trading tens/hundreds | `place-value-blocks` (build, trade) | AC9M2N01/N02 |
| Y2-2 | Halves, quarters, eighths of shapes & collections | `fraction-bars` (partition, shade), `counters` (equal groups) | AC9M2N03 |
| Y2-3 | Multiplication as arrays & equal groups | `array-builder` | AC9M2N05/A0x |
| Y2-4 | Money: make the amount with coins | `counters` (coin sprites, value-sum zones) | AC9M2N06 |
| Y2-5 | Quarter-past / quarter-to | `analog-clock` (set-time, quarter snap) | AC9M2M0x |
| Y2-6 | Measure in uniform cm | `ruler` (measure-object) | AC9M2M0x |
| Y2-7 | Flip/slide/turn a shape (informal transformations) | `transform-board` (single-step, big snaps) | AC9M2SP0x |
| Y2-8 | Likely/unlikely/impossible events | `spinner` (predict, chance words), `marble-bag` (read) | AC9M2P0x |
| Y2-9 | Collect & graph data, many-to-one intro | `column-graph` (build, picture-graph) | AC9M2ST0x |

### Infrastructure these pages also need (beyond widgets)

- `achievements-config.js`: new `DESCRIPTOR_BADGES` entries for F/1/2 descriptors with contexts matching the families above; new `GRAND_BADGES` per strand-year; portal cards switched from "Coming Soon".
- Profile: `scoresByCatF`, `scoresByCatY1`, `scoresByCatY2` roll-ups (same pattern as Y3–6 — additive, no migration needed).
- Band-A page chrome: bigger layout grid, audio prompt button on every question, reduced log panel (see doc 06 §6).

---

## 4. Coverage Cross-Check (widget → years it serves)

| Widget | F | 1 | 2 | 3 | 4 | 5 | 6 |
|--------|---|---|---|---|---|---|---|
| `counters` | ● | ● | ● | | | | |
| `ten-frame` | ● | ● | | | | | |
| `number-track` | | ● | ● | | | ●(div) | ●(sieve) |
| `number-line` | | ● | ● | ● | ● | ● | ● |
| `place-value-blocks` | | ● | ● | ● | ●(dec) | ●(dec) | ●(shift) |
| `fraction-bars` | | | ● | ● | ● | ● | ● |
| `array-builder` | | | ● | ● | ● | ●(factors) | |
| `analog-clock` | | ● | ● | ● | ● | ● | |
| `ruler` | ●(informal) | ● | ● | ● | ● | ● | |
| `protractor` | | | | | ● | ● | ● |
| `shape-measurer` | | | | ● | ● | ● | ● |
| `balance-scale` | ● | ● | | | ●(alg) | ●(alg) | ●(alg) |
| `capacity-jug` | ● | ● | ● | ● | ● | | |
| `coordinate-plotter` | ●(3×3 lang) | | | ● | ● | ● | ●(4-quad) |
| `transform-board` | | | ● | | ●(sym) | ● | ● |
| `symmetry-painter` | | | ● | ● | ● | | |
| `shape-builder` | | ● | ● | ● | ● | ● | ● |
| `pattern-blocks` | ● | ● | ● | ●(frac) | | | |
| `net-folder` | | | | | | ● | ● |
| `column-graph` | ●(pic) | ●(pic) | ● | ● | ● | ● | ● |
| `line-graph` | | | | | | ● | ● |
| `spinner` | | | ● | | ● | ● | ● |
| `marble-bag` | | | ● | ● | | ● | ● |
| `sorting-table` | ● | ● | ● | | ●(prob) | | |
| `dice-coin-lab` | | | | | | ● | ● |
| `math-field` (MathLive) | | | | ○(frac) | ● | ● | ● |
| `number-pad` | ● | ● | ● | ○ | | | |

● = primary use · ○ = optional/scaffold

**Read-down conclusion:** every widget earns its build cost across at least 3 year levels; `number-line`, `coordinate-plotter`, `column-graph`, `analog-clock`, and `fraction-bars` span 5+ — these five plus `math-field` are the P1 build order (doc 07, Phase 2).
