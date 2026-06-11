# 3a — `year5-practice.js` Migration Plan

**File:** `year5-practice.js` (~4,143 lines, was ~4,657) · `year5-practice.html`  
**Theme:** Band C · blue  
**Upgrade map:** [04 §Year 5](../04-Year-Level-Matrix.md#year-5-band-c--blue-theme--largest-file-biggest-payoff)  
**Gate slice:** G3a — Y5 contexts 100% reachable; file ≤ ~3,260 lines

---

## 1. Goal & success criteria

Convert the largest legacy practice file from `renderFunc` + inline SVG to canonical question packages. Build the **Phase 3 widget suite** here first so Y4/Y6/Y3 can reuse them.

**Done when:**

- [x] Every generator in `generators` returns canonical shape **or** `// legacy-keep: <reason>` (11 legacy families tagged; `angle-estimator` deferred to 3c `protractor`)
- [x] `loadNextPracticeQuestion` always uses `MCS.runQuestion` (no `renderFunc` branch)
- [x] `assignDescriptorAndContext` deleted — contexts assigned in generators
- [x] All seven `make*Svg` helpers deleted (zero references)
- [x] `year5-practice.html` script block loads JSXGraph + Konva + MathLive + all widget modules used
- [ ] Line count reduced **≥ 30%** (~≤ 3,260 lines) — **~11% removed**; largest remaining bulk is legacy-keep DOM (`net-matcher`, `investigation-planner`, `angle-estimator`)
- [x] All Y5 badge contexts in `achievements-config.js` reachable — `scripts/g3-y5-context-audit.mjs` static PASS
- [ ] Per-page QA checklist (07 §6) passed — automated 20-question smoke pending manual badge spot-check

**Already canonical (Phase 2.6 pilot — do not regress):**

- `fraction-addition` → `math-field` + `legacy-passthrough` display

---

## 2. Current state inventory

### SVG / DOM helpers — eliminated ✅

All `make*Svg` file-level helpers removed. Remaining inline SVG: `angleSvg` inside `measurement` (legacy-keep `angle-estimator`), net wireframes in `net-matcher`.

### Question families by strand (shipped status)

| Strand | `type` / subType | Context(s) | Status |
|--------|-------------------|------------|--------|
| **Number** | `decimal-ordering` | `decimal-sorting`, `number-line-plots` | ✅ `number-line` `order-points` |
| | `factor-multiple` | `factor-checking`, `factor-listing` | legacy-keep |
| | `percentage-converter` | `fraction-to-percent`, etc. | ✅ `math-field` |
| | `multiplication`, `division-remainder` | various | legacy-keep |
| | `fraction-ordering` | `mixed-numeral-lines`, `common-denominators` | ✅ `number-line` `order-points` |
| | `fraction-addition` | `fractional-sums`, `fraction-bar-addition` | ✅ canonical |
| | `estimation-check`, `word-problem`, `divisibility-patterns` | various | legacy-keep |
| **Algebra** | `find-unknown` | unknown contexts | ✅ `math-field` |
| | `fact-families` | fact contexts | legacy-keep |
| **Measurement** | `perimeter-area` | `irregular-perimeter`, `irregular-area` | ✅ `shape-measurer` |
| | `time-conversion`, `unit-selector` | various | legacy-keep |
| | `angle-estimator` | `angle-estimation`, `angle-protractor-reads` | legacy-keep (→ `protractor` in 3c) |
| **Space** | `read-coordinate`, `movement`, `distance` | various | ✅ `coordinate-plotter` |
| | `reflection` | `vector-reflection` | ✅ `transform-board` |
| | `net-matcher` | `net-folding`, `3d-structure-maps` | legacy-keep |
| **Statistics** | `read-value`, `max-min`, `biggest-increase` | various | ✅ `line-graph` |
| | `data-display` | mode / difference / fraction variants | ✅ `column-graph` + inputs |
| | `investigation-planner` | `investigation-planner` | legacy-keep |
| **Probability** | `die-outcomes`, `marble-likelihood`, `chance-experiment`, `chance-fraction` | various | ✅ `dice-coin-lab`, `marble-bag`, `math-field` |

---

## 3. New widgets — build specs (Phase 3a)

All Phase 3a widgets shipped. See [`big-six-implementation/`](../big-six-implementation/README.md) for base widget specs; Y5-specific widgets live in `mcs-widgets-data.js`, `mcs-widgets-space.js`, `mcs-widgets-measure.js`.

---

## 4. Implementation tasks (vertical slices)

### Slice 1 — Infrastructure & line-graph (statistics)

- [x] Extend `year5-practice.html`: JSXGraph, `mcs-board.js`, `mcs-widgets-data.js`, `mcs-widgets-space.js`
- [x] Implement `line-graph` widget (`read-crosshair`, `segment-rise`, dual crosshair)
- [x] Migrate `read-value`, `max-min`, `biggest-increase`
- [x] Delete `makeLineGraphSvg`
- [ ] QA: tap crosshair, resize, 20-question heap (manual)

### Slice 2 — Coordinate grid (space)

- [x] Extend `coordinate-plotter`: Q1 10×10, `read-point`, `path`, `manhattan`
- [x] Migrate `read-coordinate`, `movement`, `distance`
- [x] Delete `makeGridSvg`
- [x] Contexts frozen: `read-coordinate`, `vector-transformations`, `distance-manhattan`

### Slice 3 — Transform board (space)

- [x] Implement `transform-board` `reflect` mode
- [x] Migrate `reflection` generator
- [x] Delete `makeReflectionGridSvg` + cell click handlers
- [ ] QA: drag vertex → live ghost in hint; `showSolution` lands exact image (manual)

### Slice 4 — Shape measurer (measurement)

- [x] Implement `shape-measurer` `missing-sides`
- [x] Migrate `perimeter-area`
- [x] Delete L-shape inline SVG in generator

### Slice 5 — Probability suite

- [x] Konva on `year5-practice.html`; `mcs-stage.js`
- [x] Implement `dice-coin-lab`, `marble-bag` (minimal modes)
- [x] Migrate `die-outcomes`, `marble-likelihood`, `chance-experiment`, `chance-fraction`
- [x] Delete simulation DOM builder

### Slice 6 — Number / algebra MathLive sweep

- [x] Migrate `fraction-ordering` → `number-line` `order-points`
- [x] Migrate `decimal-ordering` → `number-line` `order-points`
- [x] Migrate `percentage-converter` variants → `math-field`
- [x] Migrate `find-unknown` → `math-field`
- [x] Tag **legacy-keep**: `multiplication`, `division-remainder`, `word-problem`, `estimation-check`, `divisibility-patterns`, `fact-families`, `time-conversion`, `unit-selector`, `data-display`, `investigation-planner`, `net-matcher`, `factor-multiple`, `angle-estimator`

### Slice 7 — Runner unification & dead code

- [x] Remove `isCanonical` branch — all questions through `MCS.runQuestion`
- [x] Add `MCS.adaptLegacyY5` shim in adapter for legacy families; remove when empty
- [x] Delete `assignDescriptorAndContext` and `parseFraction` (zero references)
- [x] Delete remaining `make*Svg` helpers
- [x] Run G3 context audit — `scripts/g3-y5-context-audit.mjs` (static + browser smoke PASS 2026-06-11)

---

## 5. Page script wiring (target)

```html
<!-- year5-practice.html — Phase 3 complete -->
<script defer src="vendor/jsxgraph/jsxgraphcore.js"></script>
<script defer src="vendor/konva/konva.min.js"></script>
<script defer src="vendor/mathlive/mathlive.min.js"></script>
<link rel="stylesheet" href="vendor/mathlive/mathlive-fonts.css">
<script defer src="widgets/mcs-core.js"></script>
<script defer src="widgets/mcs-board.js"></script>
<script defer src="widgets/mcs-stage.js"></script>
<script defer src="widgets/mcs-input.js"></script>
<script defer src="widgets/mcs-widgets-number.js"></script>
<script defer src="widgets/mcs-widgets-measure.js"></script>
<script defer src="widgets/mcs-widgets-space.js"></script>
<script defer src="widgets/mcs-widgets-data.js"></script>
<script defer src="widgets/mcs-question-adapter.js"></script>
<script defer src="year5-practice.js"></script>
```

---

## 6. legacy-keep rationale (expected)

| Family | Reason |
|--------|--------|
| `multiplication`, `division-remainder` | Written algorithm practice — text input is the skill |
| `word-problem`, `estimation-check` | Reading comprehension + reasonableness — no manipulative gain |
| `fact-families`, `factor-multiple` | Recall speed; optional visual hint only |
| `time-conversion` | Symbolic 12h↔24h conversion — clock widget is stretch |
| `unit-selector`, `investigation-planner` | MCQ / planning — no spatial widget |
| `net-matcher` | Already interactive; `net-folder` is Phase 3 stretch / Phase 4 |
| `angle-estimator` | Inline SVG + MCQ; shared `protractor` widget lands in Phase 3c |

Mark each with:

```javascript
// legacy-keep: written algorithm — no widget benefit (Phase 3 policy)
```

---

## 7. Risks & mitigations

| Risk | Mitigation |
|------|------------|
| Y5 file size makes merge conflicts | Vertical slices; one strand per PR/commit |
| `transform-board` JSXGraph learning curve | Spike one static reflect in `_spike.html` before migration |
| Probability sim behaviour regression | Capture expected frequencies in generator; compare pre/post on 100 rolls |
| `parseFraction` removal breaks edge cases | Route through `MCS.input.check` with `form: 'any'` |
| Page weight (3 libraries) | Per-page inclusion only; defer Konva until Slice 5 |
| `number-line` order-points NaN SVG on cold layout | Fixed bounding box uses `min`; ancestor width walk; audit wait 2.5 s |

---

## 8. Files touched (expected)

| File | Action |
|------|--------|
| `widgets/mcs-widgets-data.js` | Add `line-graph`, `marble-bag`, `dice-coin-lab`, `spinner` |
| `widgets/mcs-widgets-space.js` | Add `transform-board`; extend `coordinate-plotter` |
| `widgets/mcs-widgets-measure.js` | Add `shape-measurer` |
| `widgets/mcs-widgets-number.js` | Extend `number-line` `order-points` (decimal range fix) |
| `widgets/mcs-question-adapter.js` | `adaptLegacyY5`; remove when legacy empty |
| `year5-practice.js` | Migrate ~25 families; delete helpers |
| `year5-practice.html` | Full script block |
| `style.css` | Widget container min-heights as needed |

---

## 9. Relative effort

**XL** — 6–10 focused sessions. Slice 1–3 deliver the largest line-count wins; Slice 5 deletes the probability DOM monster. **Remaining:** line-count target (~900 lines), manual QA (07 §6), optional `protractor` migration in 3c.
