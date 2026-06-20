# 3d — `year3-practice.js` Migration Plan

**File:** `year3-practice.js` (~2,432 lines) · `year3-practice.html`  
**Theme:** Band B · teal  
**Upgrade map:** [04 §Year 3](../04-Year-Level-Matrix.md#year-3-band-b--teal-theme)  
**Gate slice:** G3d — Y3 contexts 100% reachable; final practice file on engine  
**Status:** ✅ **G3d SIGNED OFF (2026-06-13)** — 46/46 contexts, browser smoke PASS

---

## 0. G3 context audit — sign-off summary (2026-06-13)

Run: `node scripts/g3-y3-context-audit.mjs`

**Purpose:** Measurable PASS/FAIL before any widget migration. Static analysis confirms every `achievements-config.js` Y3 context is emitted in code; browser smoke confirms the page loads without console errors.

| Metric | Value (post Slice 5 / G3d complete) |
|--------|-------------------------------------|
| Required contexts | 46 |
| Covered | **46** (100%) |
| Missing | **0** |
| Browser smoke | PASS |
| Gap generators block | present (legacy-keep) |
| Legacy `renderFunc` generators | **0** |
| Canonical widget generators | **14** (incl. gap pool) |
| SVG helpers remaining | none |
| `assignDescriptorAndContext` | **deleted** |
| File line count | ~2,432 (canonical expansion; 15% reduction target not met) |

### Missing contexts closed by Slice 0 gap generators (26)

| Priority | Context | Strand | Action |
|----------|---------|--------|--------|
| **P1** | `grid-array-multiplication` | Number | legacy-keep numeric |
| **P1** | `grid-array-division` | Number | legacy-keep numeric |
| **P1** | `quantity-estimation` | Number | legacy-keep MCQ |
| **P1** | `reasonableness-check` | Number | legacy-keep MCQ |
| **P1** | `financial-additive` | Number | legacy-keep word scenario |
| **P1** | `financial-multiplicative` | Number | legacy-keep word scenario |
| **P2** | `algorithm-flowchart` | Number | legacy-keep MCQ |
| **P2** | `sequence-pattern` | Number | legacy-keep MCQ |
| **P1** | `mental-recall-grid` | Algebra | legacy-keep MCQ |
| **P1** | `mental-partitioning` | Algebra | legacy-keep numeric |
| **P1** | `unit-selection-length` | Measurement | legacy-keep MCQ |
| **P1** | `unit-selection-capacity` | Measurement | legacy-keep MCQ |
| **P1** | `ruler-measurement` | Measurement | legacy-keep numeric |
| **P1** | `scale-cylinder-reading` | Measurement | legacy-keep MCQ |
| **P1** | `time-conversion-seconds` | Measurement | legacy-keep numeric |
| **P1** | `time-conversion-hours` | Measurement | legacy-keep numeric |
| **P2** | `angle-turn-direction` | Measurement | legacy-keep MCQ |
| **P2** | `angle-right-compare` | Measurement | legacy-keep MCQ |
| **P1** | `shape-classify-3d` | Space | legacy-keep MCQ |
| **P1** | `shape-properties-3d` | Space | legacy-keep MCQ |
| **P1** | `tally-marks-build` | Statistics | legacy-keep numeric |
| **P1** | `frequency-table-build` | Statistics | legacy-keep numeric |
| **P2** | `question-formulation` | Statistics | legacy-keep MCQ |
| **P2** | `data-organisation` | Statistics | legacy-keep MCQ |
| **P1** | `spinner-trial-record` | Probability | legacy-keep MCQ |
| **P1** | `spinner-trial-compare` | Probability | legacy-keep MCQ |

**Already covered before Slice 0 (20):** clock widgets, fraction bars/lines, regroup, fact families, recall, money, landmarks, column chart, chance-likelihood — via existing generators (contexts now assigned in generators post Slice 5).

---

## 1. Goal & success criteria

Complete the practice migration sweep. Year 3 **consumes** most widgets from Phase 2 and 3a–3c; **builds** Band-B manipulatives `array-builder` and `place-value-blocks` that also unlock Prep–Y2 (Phase 5).

**Done when:**

- [x] `loadQuestion` always uses `MCS.runQuestion`
- [x] `assignDescriptorAndContext` deleted
- [x] All three `make*Svg` helpers deleted
- [x] Remaining legacy families migrated or **legacy-keep** tagged
- [ ] Line count reduced **≥ 15%** (~≤ 1,635 lines) — **not met** (~2,432; gap generators + canonical packages)
- [x] All four practice pages pass Gate G3 audit (2026-06-13)
- [ ] Per-page QA checklist (07 §6) passed — browser smoke PASS; manual 20-question session deferred

**Already canonical (Phase 2 — do not regress):**

| Family | Widget | Context |
|--------|--------|---------|
| `analog-clock` | `analog-clock` | `set-clock-time`, `read-clock-hour`, `read-clock-minute` |
| `unit-fractions` (50%) | `fraction-bars` | `unit-fraction-bars` |

---

## 2. Current state inventory

### SVG helpers to eliminate

| Helper | Status |
|--------|--------|
| `makeFractionLineSvg` | ✅ deleted (Slice 1) |
| `makeLandmarkGridSvg` | ✅ deleted (Slice 2) |
| `makeBarChartSvg` | ✅ deleted (Slice 1) |

### Question families by strand

| Strand | `type` | Context(s) | Status |
|--------|--------|------------|--------|
| **Number** | `numeral-ordering` | `numeral-ordering-value`, `numeral-partitioning` | ✅ legacy-keep (dropdown canonical) |
| | `unit-fractions` line | `unit-fraction-lines` | ✅ `number-line` `read-point` |
| | `unit-fractions` bars | `unit-fraction-bars` | ✅ widget |
| | `addition-subtraction-regroup` | regroup contexts | ✅ legacy-keep + `place-value-blocks` hint |
| **Algebra** | `fact-families` | fact family contexts | ✅ legacy-keep + `array-builder` hint |
| | `multiplication-recall`, `division-facts` | recall contexts | ✅ legacy-keep |
| **Measurement** | `money-values` | money contexts | ✅ legacy-keep |
| **Space** | `landmark-locate` | `landmark-locate-coords` | ✅ `coordinate-plotter` |
| | `landmark-navigate` | `landmark-navigate-coords` | ✅ `coordinate-plotter` `path` |
| **Statistics** | `read-column-chart` | chart contexts | ✅ `column-graph` |
| **Probability** | `chance-likelihood` | `chance-likelihood-3` | ✅ `marble-bag` |

---

## 3. New widgets — build specs (Phase 3d)

### 3.1 `place-value-blocks` (`mcs-widgets-number.js` **new**)

| Field | Pilot: regroup hint |
|-------|---------------------|
| `mode` | `build` — drag MAB blocks to show decomposition |
| `use` | Hint scaffold on `addition-subtraction-regroup` when `attemptsLeft === 1` |
| `config` | `{ band: 'B', max: 999, showHundreds: true }` |
| `band` | B (Year 3 pilot) |

Full trade/regroup mode deferred to Phase 5 Band A.

### 3.2 `array-builder` (`mcs-widgets-number.js` **new**)

| Field | Pilot: fact-family hint |
|-------|-------------------------|
| `mode` | `show-array` — rows × columns grid of dots |
| `use` | Hint on `fact-families` — visualise 3×4=12 |
| `config` | `{ rows, cols, band: 'B' }` |

### 3.3 Extensions (reuse — no new modules)

| Widget | Family | Mode |
|--------|--------|------|
| `number-line` | `unit-fraction-lines` | `place-point`, domain [0,1], fraction ticks |
| `coordinate-plotter` | landmarks | `alpha-grid` with sprites (from 3c) |
| `column-graph` | statistics | `read` — same as Y4 pilot, Band B sizing |
| `marble-bag` | chance | `make` — build bag matching likelihood word |

---

## 4. Implementation tasks (vertical slices)

### Slice 0 — Context audit + gap generators (gate) — ✅

- [x] Add `scripts/g3-y3-context-audit.mjs` (static + browser smoke)
- [x] Add `makeLegacyChoice` / `makeLegacyNumeric` helpers
- [x] Add 26 gap generators for unreachable badge contexts
- [x] Wire `pickCategoryQuestion` into `loadQuestion`
- [x] Re-run audit → **46/46 PASS**

### Slice 1 — Fraction line + column graph (number / statistics) — ✅

- [x] Add JSXGraph + `mcs-board.js` + `mcs-widgets-data.js` to `year3-practice.html`
- [x] Migrate `unit-fractions` line branch → `number-line` `read-point`
- [x] Migrate `read-column-chart` → `column-graph` (Band B config)
- [x] Delete `makeFractionLineSvg`, `makeBarChartSvg`

### Slice 2 — Landmark grid (space) — ✅

- [x] Add `mcs-widgets-space.js` to `year3-practice.html`
- [x] Migrate `landmark-locate` → `coordinate-plotter` `read-point` + `coordinate-pair`
- [x] Migrate `landmark-navigate` → `coordinate-plotter` `path` mode
- [x] Delete `makeLandmarkGridSvg`
- [x] Contexts frozen: `landmark-locate-coords`, `landmark-navigate-coords`

### Slice 3 — Manipulative hints (number / algebra) — ✅

- [x] Implement `place-value-blocks` `build` mode
- [x] Implement `array-builder` `show-array` mode
- [x] Wire hint highlights: `highlight: ['blocks']`, `highlight: ['array']`
- [x] Keep primary answer path as text input (**legacy-keep**)

### Slice 4 — Probability + numeral ordering — ✅

- [x] Migrate `chance-likelihood` → `marble-bag` (`read` mode, Band B — reuses 3a widget)
- [x] `numeral-ordering`: **legacy-keep** with canonical dropdown package (number-line `order-points` not suited to 5-digit domain)
- [x] Konva + `mcs-widgets-data.js` already loaded on Y3 page (no script change needed)

### Slice 5 — Runner unification & G3 final audit — ✅

- [x] Remove `renderFunc` branch from `loadQuestion`
- [x] Delete `assignDescriptorAndContext`
- [x] Tag all **legacy-keep** families with comments
- [x] Run full G3 context audit across Y3–Y6 — all PASS (2026-06-13)
- [x] Update [07-Roadmap](../07-Roadmap-and-Migration.md) Phase 3 gate — G3 PASSED

---

## 5. Page script wiring (target)

```html
<!-- year3-practice.html — Phase 3 complete -->
<script defer src="vendor/jsxgraph/jsxgraphcore.js"></script>
<script defer src="vendor/konva/konva.min.js"></script>
<script defer src="widgets/mcs-core.js"></script>
<script defer src="widgets/mcs-board.js"></script>
<script defer src="widgets/mcs-stage.js"></script>
<script defer src="widgets/mcs-widgets-number.js"></script>
<script defer src="widgets/mcs-widgets-measure.js"></script>
<script defer src="widgets/mcs-widgets-space.js"></script>
<script defer src="widgets/mcs-widgets-data.js"></script>
<script defer src="widgets/mcs-question-adapter.js"></script>
<script defer src="year3-practice.js"></script>
```

Note: MathLive **not** required on Y3 unless a generator adds fraction entry inputs.

---

## 6. legacy-keep rationale

| Family | Reason |
|--------|--------|
| `addition-subtraction-regroup` | Written algorithm is the learning goal; blocks are hint-only |
| `fact-families`, `multiplication-recall`, `division-facts` | Recall speed |
| `money-values` | Static coin illustration + arithmetic |
| `numeral-ordering` (optional) | Dropdown ordering is age-appropriate and fast |

---

## 7. Risks & mitigations

| Risk | Mitigation |
|------|------------|
| Band B target sizes differ from Band C widgets | Pass `band: 'B'` in all Y3 configs; verify touch targets (06 §2) |
| Hint-only widgets confuse submit flow | Hint widgets not in `evaluate` — display only via `hint.highlight` |
| `marble-bag` weight on Y3 page | Share 3a implementation; lazy-init Konva stage |

---

## 8. Files touched (expected)

| File | Action |
|------|--------|
| `widgets/mcs-widgets-number.js` | Add `place-value-blocks`, `array-builder`; extend `number-line` |
| `widgets/mcs-widgets-space.js` | Reuse `coordinate-plotter` alpha-grid |
| `widgets/mcs-widgets-data.js` | Reuse `column-graph`, `marble-bag` |
| `year3-practice.js` | Migrate ~6 families; delete helpers |
| `year3-practice.html` | Extend script block |

---

## 9. Relative effort

**M** — 3–5 sessions. Mostly wiring existing widgets; two new Band-B manipulatives are moderate Konva work. **G3d signed off 2026-06-13.**

---

## 10. Gate G3 completion checklist

When 3d lands, verify **all four files**:

- [x] `year5-practice.js` — G3a done (2026-06-13)
- [x] `year6-practice.js` — G3b done (2026-06-13)
- [x] `year4-practice.js` — G3c done (2026-06-13)
- [x] `year3-practice.js` — G3d done (2026-06-13)
- [x] Console tally: zero unreachable contexts in `achievements-config.js` for years 3–6 practice
- [x] Mark Phase 3 complete in [07-Roadmap-and-Migration.md](../07-Roadmap-and-Migration.md) — G3 PASSED (2026-06-13)
