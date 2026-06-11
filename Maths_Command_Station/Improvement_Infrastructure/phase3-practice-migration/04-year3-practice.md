# 3d — `year3-practice.js` Migration Plan

**File:** `year3-practice.js` (~1,924 lines) · `year3-practice.html`  
**Theme:** Band B · teal  
**Upgrade map:** [04 §Year 3](../04-Year-Level-Matrix.md#year-3-band-b--teal-theme)  
**Gate slice:** G3d — Y3 contexts 100% reachable; final practice file on engine

---

## 1. Goal & success criteria

Complete the practice migration sweep. Year 3 **consumes** most widgets from Phase 2 and 3a–3c; **builds** Band-B manipulatives `array-builder` and `place-value-blocks` that also unlock Prep–Y2 (Phase 5).

**Done when:**

- [ ] `loadQuestion` always uses `MCS.runQuestion`
- [ ] `assignDescriptorAndContext` deleted
- [ ] All three `make*Svg` helpers deleted
- [ ] Remaining legacy families migrated or **legacy-keep** tagged
- [ ] Line count reduced **≥ 15%** (~≤ 1,635 lines)
- [ ] All four practice pages pass Gate G3 audit
- [ ] Per-page QA checklist (07 §6) passed

**Already canonical (Phase 2 — do not regress):**

| Family | Widget | Context |
|--------|--------|---------|
| `analog-clock` | `analog-clock` | `set-clock-time`, `read-clock-hour`, `read-clock-minute` |
| `unit-fractions` (50%) | `fraction-bars` | `unit-fraction-bars` |

---

## 2. Current state inventory

### SVG helpers to eliminate

| Helper | Used by |
|--------|---------|
| `makeFractionLineSvg` | `unit-fractions` line variant |
| `makeLandmarkGridSvg` | `landmark-locate`, `landmark-navigate` |
| `makeBarChartSvg` | `read-column-chart` statistics |

### Question families by strand

| Strand | `type` | Context(s) | Current | Migration target |
|--------|--------|------------|---------|------------------|
| **Number** | `numeral-ordering` | `numeral-ordering-value`, `numeral-partitioning` | 4× dropdown ordering | **`number-line`** `order-points` or **legacy-keep** (dropdown is fast) |
| | `unit-fractions` line | `unit-fraction-lines` | SVG line + fraction inputs | **`number-line`** `place-point` (0–1, snap 1/den) |
| | `unit-fractions` bars | `unit-fraction-bars` | ✅ widget | — |
| | `addition-subtraction-regroup` | regroup contexts | Text input | **`place-value-blocks`** hint on 2nd attempt; **legacy-keep** primary |
| **Algebra** | `fact-families` | fact family contexts | Text inputs | **legacy-keep** + **`array-builder`** hint visual |
| | `multiplication-recall`, `division-facts` | recall contexts | Text input | **legacy-keep** |
| **Measurement** | `money-values` | money contexts | Static coin SVG + input | **legacy-keep** (sprite SVG is fine) |
| **Space** | `landmark-locate` | `landmark-locate-coords` | Grid SVG + coord input | **`coordinate-plotter`** `alpha-grid` / `plot-point` with landmarks |
| | `landmark-navigate` | `landmark-navigate-coords` | Grid + direction steps | **`coordinate-plotter`** `path` mode (short paths) |
| **Statistics** | `read-column-chart` | `read-column-chart-3`, `column-chart-difference-3` | Bar chart SVG + input | **`column-graph`** `read` (reuse Phase 2.5 widget) |
| **Probability** | `chance-likelihood` | `chance-likelihood-3` | Static jar + likelihood buttons | **`marble-bag`** `make` mode (from 3a) |

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

### Slice 1 — Fraction line + column graph (number / statistics)

- [ ] Add JSXGraph + `mcs-board.js` + `mcs-widgets-data.js` to `year3-practice.html` if not present
- [ ] Migrate `unit-fractions` line branch → `number-line`
- [ ] Migrate `read-column-chart` → `column-graph` (Band B config)
- [ ] Delete `makeFractionLineSvg`, `makeBarChartSvg`

### Slice 2 — Landmark grid (space)

- [ ] Migrate `landmark-locate` → `coordinate-plotter` with landmarks
- [ ] Migrate `landmark-navigate` → `path` mode
- [ ] Delete `makeLandmarkGridSvg`
- [ ] Contexts frozen: `landmark-locate-coords`, `landmark-navigate-coords`

### Slice 3 — Manipulative hints (number / algebra)

- [ ] Implement `place-value-blocks` `build` mode
- [ ] Implement `array-builder` `show-array` mode
- [ ] Wire hint highlights: `highlight: ['blocks']`, `highlight: ['array']`
- [ ] Keep primary answer path as text input (**legacy-keep**)

### Slice 4 — Probability + numeral ordering

- [ ] Migrate `chance-likelihood` → `marble-bag` (import from 3a)
- [ ] Evaluate `numeral-ordering`: migrate to `number-line` `order-points` **or** legacy-keep with comment
- [ ] Add Konva scripts for `marble-bag` if not loaded

### Slice 5 — Runner unification & G3 final audit

- [ ] Remove `renderFunc` branch from `loadQuestion`
- [ ] Delete `assignDescriptorAndContext`
- [ ] Tag all **legacy-keep** families with comments
- [ ] Run full G3 context audit across Y3–Y6
- [ ] Update [07-Roadmap](../07-Roadmap-and-Migration.md) Phase 3 checkbox when G3 passes

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

**M** — 3–5 sessions. Mostly wiring existing widgets; two new Band-B manipulatives are moderate Konva work.

---

## 10. Gate G3 completion checklist

When 3d lands, verify **all four files**:

- [ ] `year5-practice.js` — G3a done
- [ ] `year6-practice.js` — G3b done
- [ ] `year4-practice.js` — G3c done
- [ ] `year3-practice.js` — G3d done
- [ ] Console tally: zero unreachable contexts in `achievements-config.js` for years 3–6 practice
- [ ] Mark Phase 3 complete in [07-Roadmap-and-Migration.md](../07-Roadmap-and-Migration.md)
