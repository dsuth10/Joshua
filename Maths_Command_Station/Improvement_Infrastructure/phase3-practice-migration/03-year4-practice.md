# 3c — `year4-practice.js` Migration Plan

**File:** `year4-practice.js` (~1,950 lines) · `year4-practice.html`  
**Theme:** Band C-entry · amber  
**Upgrade map:** [04 §Year 4](../04-Year-Level-Matrix.md#year-4-band-c-entry--amber-theme)  
**Gate slice:** G3c — Y4 contexts 100% reachable; symmetry + protractor on engine  
**Audit baseline (2026-06-13):** `scripts/g3-y4-context-audit.mjs` — **19/44 contexts covered**, 25 gaps, browser smoke PASS

---

## 0. G3 context audit — gap analysis (2026-06-13)

Run: `node scripts/g3-y4-context-audit.mjs`

| Metric | Value |
|--------|-------|
| Required contexts | 44 |
| Covered today | **19** (43%) |
| Missing | **25** |
| Browser smoke | PASS |
| Legacy `renderFunc` generators | 8 |
| Canonical widget generators | 4 (`protractor` ×2, `symmetry-painter`, `column-graph`) |
| SVG helpers remaining | `makeMixedNumberLineSvg`, `makePracticeClockSvg` (`makeAngleSvg` eliminated — protractor widget) |
| `assignDescriptorAndContext` | Present — delete in Slice 5 |

### Covered contexts (19)

`decimal-ordering`, `decimal-place-value`, `mixed-numeral-lines`, `inverse-equations-addition`, `inverse-equations-subtraction`, `recall-facts-multiplication`, `recall-facts-division`, `time-duration`, `schedule-planning`, `angle-classification`, `protractor-reading`, `alphanumeric-routing`, `grid-reference`, `symmetry-paint-mirror`, `symmetry-rotational`, `read-column-chart`, `column-chart-difference`, `likelihood-scale-eval`, `likelihood-scale-order`

*(Note: assignDescriptor uses random 50% branches for several pairs — both sides of each pair are reachable in code.)*

### Missing contexts by strand (25) — recommended closure order

| Priority | Context | Strand | Recommended action |
|----------|---------|--------|-------------------|
| **P1** | `odd-even-classification` | Number | legacy-keep MCQ generator |
| **P1** | `divisibility-puzzle` | Number | legacy-keep generator |
| **P1** | `equivalent-fractions` | Number | legacy-keep MCQ or `math-field` |
| **P1** | `equivalent-decimals` | Number | legacy-keep MCQ or `math-field` |
| **P1** | `multiply-by-10` | Number | legacy-keep generator |
| **P1** | `divide-by-10` | Number | legacy-keep generator |
| **P1** | `grid-multiplication` | Number | legacy-keep generator |
| **P1** | `division-step-no-rem` | Number | legacy-keep generator |
| **P1** | `rounding-check` | Number | legacy-keep generator |
| **P1** | `financial-estimation` | Number | legacy-keep generator |
| **P1** | `gauge-reading` | Measurement | legacy-keep generator |
| **P1** | `distribution-shape` | Statistics | legacy-keep MCQ |
| **P1** | `chart-comparison` | Statistics | legacy-keep MCQ |
| **P1** | `coin-toss-record` | Probability | reuse Y5 `dice-coin-lab` or legacy-keep |
| **P1** | `coin-toss-variation` | Probability | reuse Y5 `dice-coin-lab` or legacy-keep |
| **P2** | `algebraic-sentence` | Number | legacy-keep generator |
| **P2** | `scenario-modelling` | Number | legacy-keep word scenario |
| **P2** | `pathway-algorithm` | Number | legacy-keep generator |
| **P2** | `sequencing-check` | Number | legacy-keep generator |
| **P2** | `perimeter-shapes` | Measurement | reuse Y5 `shape-measurer` or legacy-keep |
| **P2** | `area-grids` | Measurement | reuse Y5 `shape-measurer` or legacy-keep |
| **P2** | `shape-combination` | Space | legacy-keep MCQ |
| **P2** | `composite-structures` | Space | legacy-keep MCQ |
| **P2** | `survey-compiling` | Statistics | `column-graph` build stretch or legacy-keep |
| **P2** | `survey-reading` | Statistics | legacy-keep MCQ |

**Recommended vertical slice for sign-off:** (1) P1 gap generators via shared helpers (mirror Y6 G3b pattern), (2) finish widget migrations (Slices 1–4), (3) delete `assignDescriptorAndContext` + SVG helpers, (4) re-run audit → 44/44 PASS.

**Partial migration already landed:** `protractor` (classify + measure), `symmetry-painter` (mirror + rotational), `column-graph` read — Slice 1–2 partially complete; `alphanumeric-routing` and `mixed-numeral-line` still legacy.

---

## 1. Goal & success criteria

Migrate Year 4 practice from mixed legacy/`renderFunc` to full canonical packages. **Reuse** widgets built in 3a (line-graph not heavily used in Y4; column-graph already piloted). **Build** `symmetry-painter`, `protractor`, and `analog-clock` elapsed mode here.

**Done when:**

- [ ] `loadQuestion` always uses `MCS.runQuestion` (no `renderFunc` branch)
- [ ] `assignDescriptorAndContext` deleted
- [ ] All four `make*Svg` helpers deleted
- [ ] `symmetry-paint` uses `symmetry-painter` (mirror + rotational contexts)
- [ ] `angle-evaluator` uses `protractor`
- [ ] `time-duration` uses `analog-clock` elapsed mode
- [ ] `mixed-numeral-line` uses `number-line`
- [ ] Line count reduced **≥ 15%** (~≤ 1,640 lines)
- [ ] Per-page QA checklist (07 §6) passed

**Already canonical (Phase 2.5 — do not regress):**

- `statistics` generator → `column-graph` + `number-input` (`read-column-chart`, `column-chart-difference`)

---

## 2. Current state inventory

### SVG helpers to eliminate

| Helper | Used by |
|--------|---------|
| `makeMixedNumberLineSvg` | `mixed-numeral-line` |
| `makePracticeClockSvg` | `time-duration` |
| `makeAngleSvg` | `angle-evaluator` |

### Question families by strand

| Strand | `type` | Context(s) | Current | Migration target |
|--------|--------|------------|---------|------------------|
| **Number** | `decimal-ordering` | `decimal-ordering` | Dropdown sort | **legacy-keep** (ordering skill) |
| | `place-value-shifter` | `decimal-place-value` | Button shifter device | **legacy-keep** (works well — re-skin only) |
| | `mixed-numeral-line` | `mixed-numeral-lines` | SVG line + inputs | **`number-line`** (`place-point`, snap 0.25, mixed labels) |
| **Algebra** | `inverse-equations` | inverse equation contexts | Multi input | `math-field` × 3 or **legacy-keep** |
| | `recall-facts-timed` | recall contexts | Timed grid | **legacy-keep** (timed recall) |
| **Measurement** | `time-duration` | `time-duration`, `schedule-planning` | Dual static clocks + inputs | **`analog-clock`** `elapsed` mode + duration input |
| | `angle-evaluator` | `angle-classification`, `protractor-reading` | SVG + MCQ / input | **`protractor`** `classify` + `measure` |
| **Space** | `alphanumeric-routing` | `alphanumeric-routing`, `grid-reference` | Grid + select/input | **`coordinate-plotter`** `alpha-grid` |
| | `symmetry-paint` | `symmetry-paint-mirror`, `symmetry-rotational` | Click-cell board | **`symmetry-painter`** |
| **Statistics** | (statistics gen) | column contexts | ✅ widget | Optional: `column-graph` `build` mode for survey contexts |
| **Probability** | `likelihood-scale` | likelihood contexts | `<select>` per event | **`sorting-table`** spectrum or **legacy-keep** |

---

## 3. New widgets — build specs (Phase 3c)

### 3.1 `symmetry-painter` (`mcs-widgets-space.js` **new**)

| Field | Pilot: `symmetry-paint` |
|-------|-------------------------|
| `descriptor` | AC9M4SP03 |
| `context` | `symmetry-paint-mirror` (50%) / `symmetry-rotational` (50%) |
| `mode` | `complete-mirror` — paint missing half on tap grid |
| `config` | `{ band: 'C', gridSize: 8, mirrorAxis: 'vertical' \| 'horizontal', rotationalOrder: 4 }` |
| `evaluate` | `values.grid.cells` matches solution set |

Port click-cell logic from `year4-practice.js` ~1353–1430 and assessment `year4.js` — **one implementation**.

### 3.2 `protractor` (`mcs-widgets-measure.js` **new**)

| Field | Pilot: `angle-evaluator` |
|-------|--------------------------|
| `mode` | `classify` — fixed angle, MCQ acute/right/obtuse/reflex |
| `mode` | `measure` — student positions protractor, enters reading |
| `context` | `angle-classification` / `protractor-reading` (existing assignDescriptor split) |

Replaces `makeAngleSvg` (~819–860).

### 3.3 `analog-clock` elapsed (`mcs-widgets-measure.js` extend)

| Field | Pilot: `time-duration` |
|-------|------------------------|
| `mode` | `elapsed` — two clock faces; shaded arc between times |
| `config` | `{ start: {h,m}, end: {h,m}, showDigital: true }` |
| `inputs` | Duration in hours/minutes via `time-pair` or `number-input` |

Replaces `makePracticeClockSvg`.

### 3.4 `number-line` mixed numerals (`mcs-widgets-number.js` extend)

| Field | Pilot: `mixed-numeral-line` |
|-------|----------------------------|
| `mode` | `place-point` with `showFractionLabels: true`, snap 0.25 |
| `domain` | 0–5 wholes |

### 3.5 `coordinate-plotter` alpha-grid (`mcs-widgets-space.js` extend)

| Field | Pilot: `alphanumeric-routing` |
|-------|-------------------------------|
| `mode` | `alpha-grid` — A1–E5 cells, landmark sprites |
| `evaluate` | `values.grid.cell === 'C4'` |

---

## 4. Implementation tasks (vertical slices)

### Slice 1 — Symmetry painter (space) — partial ✅

- [x] Add Konva + `mcs-stage.js` + `mcs-widgets-space.js` to `year4-practice.html`
- [x] Implement `symmetry-painter` `complete-mirror` + rotational mode
- [x] Migrate `symmetry-paint` generator (canonical widget path)
- [ ] QA: tap cells, undo, `showSolution` fills correct half

### Slice 2 — Protractor (measurement) — partial ✅

- [x] Implement `protractor` `classify` + `measure`
- [x] Migrate `angle-evaluator` (canonical widget path)
- [x] Delete `makeAngleSvg`

### Slice 3 — Clock elapsed (measurement)

- [ ] Extend `analog-clock` with `elapsed` mode
- [ ] Migrate `time-duration`; tag `schedule-planning` **legacy-keep** if text-only planner

### Slice 4 — Number & space extensions

- [ ] Migrate `mixed-numeral-line` → `number-line`
- [ ] Migrate `alphanumeric-routing` → `coordinate-plotter` `alpha-grid`
- [ ] Delete `makeMixedNumberLineSvg`

### Slice 5 — MathLive + statistics + cleanup

- [ ] Migrate `inverse-equations` to `math-field` (or legacy-keep with comment)
- [ ] Optional: `column-graph` `build` for `survey-compiling` context
- [ ] Tag legacy-keep families; unify runner
- [ ] Delete `assignDescriptorAndContext`
- [ ] Run G3 context audit — `scripts/g3-y4-context-audit.mjs` (baseline 19/44, 2026-06-13)

---

## 5. Page script wiring (target)

```html
<!-- year4-practice.html — Phase 3 complete -->
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
<script defer src="year4-practice.js"></script>
```

---

## 6. legacy-keep rationale

| Family | Reason |
|--------|--------|
| `decimal-ordering` | Dropdown ordering — skill is comparison, not placement |
| `place-value-shifter` | Interactive device already works; re-skin only |
| `recall-facts-timed` | Timed recall — widget would slow flow |
| `likelihood-scale` | Select-per-event is acceptable Band C; upgrade optional |
| `inverse-equations` (optional) | Can stay text if MathLive slows timed flow |

---

## 7. Risks & mitigations

| Risk | Mitigation |
|------|------------|
| Symmetry board cell index drift vs assessment | Single `symmetry-painter` module; same coordinate system |
| Protractor placement UX on tablet | Large hit targets; snap angles to 5° in measure mode |
| Dual-clock elapsed layout on narrow screens | Stack vertically under 480px (CSS) |

---

## 8. Files touched (expected)

| File | Action |
|------|--------|
| `widgets/mcs-widgets-space.js` | Add `symmetry-painter`; extend `coordinate-plotter` |
| `widgets/mcs-widgets-measure.js` | Add `protractor`; extend `analog-clock` |
| `widgets/mcs-widgets-number.js` | Extend `number-line` |
| `year4-practice.js` | Migrate ~8 families |
| `year4-practice.html` | Full script block |

---

## 9. Relative effort

**L** — 4–6 sessions. `symmetry-painter` + `protractor` are the heavy interactions; other slices reuse 3a/Phase 2 widgets.
