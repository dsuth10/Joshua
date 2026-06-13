# 3c — `year4-practice.js` Migration Plan

**File:** `year4-practice.js` (~2,542 lines) · `year4-practice.html`  
**Theme:** Band C-entry · amber  
**Upgrade map:** [04 §Year 4](../04-Year-Level-Matrix.md#year-4-band-c-entry--amber-theme)  
**Gate slice:** G3c — Y4 contexts 100% reachable; symmetry + protractor on engine  
**Status:** ✅ **G3c SIGNED OFF (2026-06-13)** — 44/44 contexts, browser smoke PASS  
**Slice 5 complete (2026-06-13):** legacy-keep canonical packages, runner unified, `assignDescriptorAndContext` deleted

---

## 0. G3 context audit — post sign-off (2026-06-13)

Run: `node scripts/g3-y4-context-audit.mjs`

| Metric | Value |
|--------|-------|
| Required contexts | 44 |
| Covered | **44** (100%) |
| Missing | **0** |
| Browser smoke | PASS |
| Legacy `renderFunc` generators | 0 |
| Canonical widget generators | 13 |
| SVG helpers remaining | none |
| `assignDescriptorAndContext` | **absent** (deleted Slice 5) |
| File line count | ~2,542 (15% reduction target not met — gap generators + canonical packages) |

All 44 contexts closed via widget migrations (Slices 1–4) and **legacy-keep** gap generators (Slice 5), mirroring the Y6 G3b pattern.

---

## 1. Goal & success criteria

Migrate Year 4 practice from mixed legacy/`renderFunc` to full canonical packages. **Reuse** widgets built in 3a (line-graph not heavily used in Y4; column-graph already piloted). **Build** `symmetry-painter`, `protractor`, and `analog-clock` elapsed mode here.

**Done when:**

- [x] `loadQuestion` always uses `MCS.runQuestion` (no `renderFunc` branch)
- [x] `assignDescriptorAndContext` deleted
- [x] All four `make*Svg` helpers deleted
- [x] `symmetry-paint` uses `symmetry-painter` (mirror + rotational contexts)
- [x] `angle-evaluator` uses `protractor`
- [x] `time-duration` uses `analog-clock` elapsed mode
- [x] `mixed-numeral-line` uses `number-line`
- [x] All 44 Y4 badge contexts reachable — `scripts/g3-y4-context-audit.mjs` PASS (2026-06-13)
- [ ] Line count reduced **≥ 15%** (~≤ 1,640 lines) — **not met** (~2,542; gap generators expanded file)
- [ ] Per-page QA checklist (07 §6) passed — browser smoke PASS; manual 20-question session deferred

**Already canonical (Phase 2.5 — do not regress):**

- `statistics` generator → `column-graph` + `number-input` (`read-column-chart`, `column-chart-difference`)

---

## 2. Current state inventory

### SVG helpers — eliminated ✅

| Helper | Status |
|--------|--------|
| `makeMixedNumberLineSvg` | ✅ deleted (Slice 4) |
| `makePracticeClockSvg` | ✅ deleted (Slice 3) |
| `makeAngleSvg` | ✅ deleted (Slice 2) |

### Question families by strand

| Strand | `type` | Context(s) | Status |
|--------|--------|------------|--------|
| **Number** | `decimal-ordering` | `decimal-ordering` | ✅ legacy-keep |
| | `place-value-shifter` | `decimal-place-value` | ✅ legacy-keep |
| | `mixed-numeral-line` | `mixed-numeral-lines` | ✅ `number-line` |
| **Algebra** | `inverse-equations` | inverse equation contexts | ✅ legacy-keep |
| | `recall-facts-timed` | recall contexts | ✅ legacy-keep |
| **Measurement** | `time-duration` | `time-duration`, `schedule-planning` | ✅ `analog-clock` elapsed + legacy-keep schedule |
| | `angle-evaluator` | angle contexts | ✅ `protractor` |
| **Space** | `alphanumeric-routing` | routing contexts | ✅ `coordinate-plotter` `alpha-grid` |
| | `symmetry-paint` | symmetry contexts | ✅ `symmetry-painter` |
| **Statistics** | (statistics gen) | column contexts | ✅ `column-graph` |
| **Probability** | `likelihood-scale` | likelihood contexts | ✅ legacy-keep |

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

### Slice 1 — Symmetry painter (space) — ✅

- [x] Add Konva + `mcs-stage.js` + `mcs-widgets-space.js` to `year4-practice.html`
- [x] Implement `symmetry-painter` `complete-mirror` + rotational mode
- [x] Migrate `symmetry-paint` generator (canonical widget path)
- [x] QA: tap cells, undo (re-tap), `showSolution` staggered fill + keyboard arrows/Space

### Slice 2 — Protractor (measurement) — ✅

- [x] Implement `protractor` `classify` + `measure`
- [x] Migrate `angle-evaluator` (canonical widget path)
- [x] Delete `makeAngleSvg`
- [x] QA: classify MCQ keyboard; measure drag + rotate handle (5° snap) + arrow keys; `showSolution` animates alignment

### Slice 3 — Clock elapsed (measurement) — ✅

- [x] Extend `analog-clock` with `elapsed` mode
- [x] Migrate `time-duration`; tag `schedule-planning` **legacy-keep** (text timetable word problem + `time-pair`)
- [x] Delete `makePracticeClockSvg`

### Slice 4 — Number & space extensions — ✅

- [x] Migrate `mixed-numeral-line` → `number-line` `read-point`
- [x] Migrate `alphanumeric-routing` → `coordinate-plotter` `alpha-grid`
- [x] Delete `makeMixedNumberLineSvg`

### Slice 5 — MathLive + statistics + cleanup ✅

- [x] Migrate `inverse-equations` to **legacy-keep** (plain number inputs; MathLive deferred)
- [x] `survey-compiling` stays **legacy-keep** (`column-graph` build deferred to Phase 6)
- [x] Tag legacy-keep families; unify runner (`MCS.runQuestion` only)
- [x] Delete `assignDescriptorAndContext`
- [x] Run G3 context audit — **44/44 PASS** (2026-06-13)

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

**L** — 4–6 sessions. `symmetry-painter` + `protractor` are the heavy interactions; other slices reuse 3a/Phase 2 widgets. **G3c signed off 2026-06-13.**
