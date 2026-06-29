# 4c — `year4.js` Assessment Migration Plan

**File:** `year4.js` (~999 lines, was ~976) · `year4.html`  
**Theme:** Band B · amber  
**Gate slice:** G4c — Y4 assessment widgets on engine  
**Status:** ✅ **G4c static PASS (2026-06-13)** — Slices 2–4 complete

---

## 1. Goal & success criteria

Wire Y4 assessment stage 3 interactives to **existing Phase 3c widgets**. This is primarily integration work — `symmetry-painter` and `coordinate-plotter` `alpha-grid` already ship in practice.

**Done when:**

- [x] Stage 3 sub-stage 1 pathfinder uses `MCS.create('coordinate-plotter', …, { mode: 'alpha-grid', selectionMode: 'dual' })` — tap school then path (replaces dropdowns + `renderPathfinderGrid`)
- [x] `state.schCol` / `state.schRow` / `state.pathCol` / `state.pathRow` synced from widget `getValue()`
- [x] Stage 3 sub-stage 2 symmetry uses `MCS.create('symmetry-painter', …, { mode: 'complete-mirror' })`
- [x] `state.studentCells` populated from widget `getValue().cells`
- [x] Substation 3 mixed-numeral line: `number-line` `read-point` mount (Slice 4)
- [x] `compileReport()` unchanged: max **32 marks**; pathfinder 2 + symmetry 2 in Part C
- [x] Profile bonus: `scoresByCatY4` multipliers unchanged (audit check)
- [x] `year4.html` script block loads engine modules
- [x] `renderPathfinderGrid`, `renderSymmetryBoard`, highlight helpers deleted
- [x] `scripts/g4-y4-assessment-audit.mjs` static PASS + browser smoke (2026-06-13)
- [ ] Line count reduced **≥ 15%** (~≤ 830 lines) — net +23 lines (mount helpers); stretch cleanup optional

**Keep unchanged:**

- Stage 1 recall engine
- Substation 1 decimal calibrator (3.45 → 3.85)
- Substation 2 equivalent fraction inputs
- Substation 4 inverse equation inputs

---

## 2. Current state inventory

### Bespoke interactives to replace

| Location | Legacy | Lines (approx) | Replacement |
|----------|--------|----------------|-------------|
| Stage 2 SS3 | `renderAssessmentNumberLine()` static SVG | ~481–524 | `number-line` `reference-line` (stretch) or keep SVG |
| Stage 3 SS1 | `renderPathfinderGrid()` + 4 `<select>` dropdowns | ~556–648 | `coordinate-plotter` `alpha-grid` |
| Stage 3 SS2 | `renderSymmetryBoard()` DOM grid | ~651–741 | `symmetry-painter` `complete-mirror` |

### Fixed mission data (frozen)

**Pathfinder landmarks** (from `renderPathfinderGrid`):

| Cell | Sprite | Role |
|------|--------|------|
| C3 | 🏫 | School (student identifies) |
| E2 | 🌳 | Park |
| B4 | 📚 | Library |
| A1 | 🚩 | Start |

**Correct answers:** school `C3`, path waypoint `C4`.

**Symmetry board:** 6×6 grid, vertical axis, prefilled left cells `(1,1), (3,2), (5,3)` → student paints right `(1,6), (3,5), (5,4)`.

### Scoring rubric (frozen)

| Test ID | Max | Threshold |
|---------|-----|-----------|
| `PART_A: FACT_FLUENCY` | 20 | recall |
| `PART_B: DECIMAL_SHIFTER` | 1 | `calcChoice` for 3.45→3.85 |
| `PART_B: EQUIVALENT_FRACTIONS` | 2 | equiv triple |
| `PART_B: MIXED_NUMERAL_LINE` | 2 | whole=1, num=3, den=4 |
| `PART_B: INVERSE_EQUATION` | 2 | val2 + ans |
| `PART_C: GRID_PATHFINDER` | 2 | C3 + C4 |
| `PART_C: SYMMETRY_PAINT` | 2 | mirror cells |

---

## 3. Widget integration specs (reuse Phase 3c)

### 3.1 `coordinate-plotter` `alpha-grid` (assessment config)

| Field | Value |
|-------|-------|
| `cols` | `['A','B','C','D','E']` |
| `rows` | `[5,4,3,2,1]` |
| `landmarks` | School, park, library, start — same sprites as legacy |
| `selectionMode` | `dual` — tap school cell, then path cell |
| `getValue()` | `{ selections: ['C3','C4'] }` or `{ school, path }` |
| `band` | `B` |

**Practice reference:** `year4-practice.js` `alphanumeric-routing` generator — copy landmark config shape.

### 3.2 `symmetry-painter` `complete-mirror`

| Field | Value |
|-------|-------|
| `gridSize` | `6` |
| `axis` | `vertical` |
| `prefilled` | `[{r:1,c:1},{r:3,c:2},{r:5,c:3}]` |
| `paintableSide` | `right` |
| `getValue()` | `{ cells: [{r,c}…] }` |

**Practice reference:** `year4-practice.js` `symmetry-paint-mirror` context.

### 3.3 `number-line` `read-point` (Slice 4)

| Field | Value |
|-------|-------|
| `mode` | `read-point` |
| `min` | `0` |
| `max` | `3` |
| `markedValue` | `1.75` (1¾) |
| `snapStep` / `fractionDenominator` | `0.25` / `4` |
| `interactive` | `false` (read-only pin + `?` label) |

Only replaces decorative SVG — **no scoring change**.

---

## 4. Implementation tasks (vertical slices)

### Slice 0 — G4 baseline

- [ ] Record perfect-run score + profile bonus JSON
- [ ] Stub `scripts/g4-y4-assessment-audit.mjs`

### Slice 1 — Infrastructure

- [ ] Script block on `year4.html` (JSXGraph, Konva, core, board, stage, number, space)
- [ ] Mount divs: `#alphanumeric-grid-host` → widget root, `#symmetry-board-grid` → widget root
- [ ] `MCS.audio.register(playSound)`

### Slice 2 — Pathfinder alpha-grid

- [ ] `mountPathfinderWidget()` on stage 3 SS1
- [ ] Remove four `<select>` elements from HTML **or** hide and sync from widget (prefer remove + readouts)
- [ ] `btnSubmitPathfinder` reads widget value — same pass/fail as `C3` + `C4`
- [ ] Delete `renderPathfinderGrid`, `clearGridHighlights`, `highlightSelectedCells`

### Slice 3 — Symmetry painter

- [ ] `mountSymmetryWidget()` on stage 3 SS2
- [ ] `btnSubmitSymmetry` compares widget cells to expected set
- [ ] Delete `renderSymmetryBoard` cell click factory

### Slice 4 — Number line display (stretch)

- [x] Replace `renderAssessmentNumberLine` with static `number-line` `read-point` mount on SS3 entry
- [x] `destroyNumberLineWidget()` on substation/stage exit

### Slice 5 — Dead code + G4

- [ ] Destroy widgets on stage exit
- [ ] G4 audit PASS

---

## 5. Page script wiring (target)

```html
<!-- year4.html — Phase 4 -->
<script defer src="vendor/jsxgraph/jsxgraphcore.js"></script>
<script defer src="vendor/konva/konva.min.js"></script>
<script defer src="widgets/mcs-core.js"></script>
<script defer src="widgets/mcs-board.js"></script>
<script defer src="widgets/mcs-stage.js"></script>
<script defer src="widgets/mcs-widgets-number.js"></script>
<script defer src="widgets/mcs-widgets-space.js"></script>
<script defer src="year4.js"></script>
```

---

## 6. Risks & mitigations

| Risk | Mitigation |
|------|------------|
| Practice `alpha-grid` expects canonical question wrapper | Assessment calls `MCS.create` directly — test mount without adapter |
| Symmetry axis CSS line removed | Widget draws axis in Konva |
| Dropdown removal breaks layout | Replace with live readout labels `School: C3` |

---

## 7. Files touched (expected)

| File | Action |
|------|--------|
| `widgets/mcs-widgets-space.js` | Extend `alpha-grid` dual-selection if needed |
| `widgets/mcs-widgets-number.js` | Optional `reference-line` mode |
| `year4.js` | Mount helpers; delete DOM renderers |
| `year4.html` | Scripts + simplified stage 3 markup |
| `scripts/g4-y4-assessment-audit.mjs` | New |

---

## 8. Relative effort

**S–M** — 1–3 sessions. Lowest risk Phase 4 file — widgets already proven in practice.
