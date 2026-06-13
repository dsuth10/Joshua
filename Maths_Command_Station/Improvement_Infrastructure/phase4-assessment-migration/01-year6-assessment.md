# 4a — `year6.js` Assessment Migration Plan

**File:** `year6.js` (~964 lines) · `year6.html`  
**Theme:** Band C · emerald  
**Gate slice:** G4a — Y6 assessment reference implementation  
**Status:** ✅ **G4a SIGNED OFF (2026-06-13)** — protractor + quadrant grid on engine; sieve & metric regulator unchanged

---

## 1. Goal & success criteria

Pilot Phase 4 on Year 6: prove the **assessment widget mount pattern** (not `MCS.runQuestion`) while leaving the four-stage mission intact.

**Done when:**

- [x] Substation 4 angle diagram uses `MCS.create('protractor', …, { mode: 'intersecting-lines' })`
- [x] Stage 3 sub-stage 2 uses `MCS.create('coordinate-plotter', …, { mode: 'plot-duo' })` with tap-to-plot (replaces text coordinate inputs)
- [x] `mountAngleWidget` / `destroyAngleWidget` and `mountGridWidget` / `destroyGridWidget` lifecycle helpers present
- [x] `state.studentWpA` / `state.studentWpTrans` synced via `gridWidget.onChange` → `compileReport()` unchanged
- [x] Substation 1 sieve grid and substation 3 metric regulator **left as bespoke DOM** (interactions already sound)
- [x] `year6.html` loads JSXGraph + Konva + `mcs-core`, `mcs-board`, `mcs-stage`, `mcs-widgets-measure`, `mcs-widgets-space`
- [x] `MCS.audio.register(playSound)` bridges terminal sounds to widget events
- [ ] G4 audit script `scripts/g4-y6-assessment-audit.mjs` — ✅ static + browser smoke (2026-06-13)
- [ ] Manual full-mission QA + profile JSON diff — deferred to Phase 6

**Stretch (optional — not blocking G4):**

- [ ] Re-skin sieve onto `number-track` `shade-multiples` (share Y6 practice widget)
- [ ] Re-skin metric regulator onto `place-value-blocks` decimal shift mode
- [ ] Engine theming pass on remaining bespoke substations

---

## 2. Current state inventory

### Bespoke interactives — migration status

| Location | Legacy implementation | Widget | Status |
|----------|----------------------|--------|--------|
| Stage 2 SS1 | `renderSieveGrid()` DOM grid | — | **keep** (good interaction; optional re-skin) |
| Stage 2 SS2 | Equivalent fractions inputs | — | **keep** (text entry is the skill) |
| Stage 2 SS3 | Metric shift slider DOM | — | **keep** |
| Stage 2 SS4 | Angle diagram | `protractor` `intersecting-lines` | ✅ migrated |
| Stage 3 SS2 | Quadrant coordinate inputs | `coordinate-plotter` `plot-duo` | ✅ migrated |
| Stage 1 | Fact recall keypad | — | **keep** |
| Stage 3 SS1 | Flight itinerary inputs | — | **keep** |

### Helpers eliminated / to eliminate

| Helper | Status |
|--------|--------|
| Inline angle SVG in substation 4 | ✅ replaced by widget mount |
| Assessment quadrant grid SVG + input sync | ✅ replaced by `plot-duo` |

### Scoring rubric (frozen — do not edit)

| Test ID | Max marks | Key thresholds |
|---------|-----------|----------------|
| `PART_A: FACT_FLUENCY` | 20 | recall answer match |
| `PART_B: FACTOR_SIEVE` | varies | classification + sieve cells |
| `PART_B: EQUIVALENT_FRACTIONS` | varies | denominator + numerator pair |
| `PART_B: METRIC_SHIFT` | varies | `metricShiftValue === 4250` |
| `PART_B: ANGLE_SOLVER` | varies | intersecting angle entry |
| `PART_C: FLIGHT_ITINERARY` | 2 | 3h05 + 1h15 layover |
| `PART_C: FOUR_QUADRANT_DISPATCH` | 4 | A(2,-3), A'(-1,1) via widget coords |

Profile write (frozen): `parsed.score = (parsed.score || 0) + totalScore * 10` on report compile.

---

## 3. Widget build specs (shipped in 4a)

### 3.1 `protractor` mode `intersecting-lines`

| Field | Assessment config |
|-------|-------------------|
| `givenAngleDeg` | `124` (fixed mission value) |
| `band` | `C` |
| Mount | `#angle-widget-mount` on substation 4 entry |
| `getValue()` | `{ angle }` → maps to existing `state.angleIntersectAnswer` (verify field name in `year6.js`) |

### 3.2 `coordinate-plotter` mode `plot-duo`

| Field | Assessment config |
|-------|-------------------|
| `quadrants` | `4` |
| `xMin` / `xMax` / `yMin` / `yMax` | `-5` … `5` |
| `markers` | Fixed A(2,-3) and ghost A'(-1,1) labels |
| `showTranslationVector` | `true` |
| `initialA` / `initialB` | Seed from `state.studentWpA` / `state.studentWpTrans` |
| Interaction | Tap-to-plot two student pins (replaces coordinate text fields) |

---

## 4. Implementation tasks (reference slices — complete)

### Slice 1 — Infrastructure & angle widget

- [x] Add widget script block to `year6.html`
- [x] Implement `mountAngleWidget` / `destroyAngleWidget`
- [x] Wire substation 4 `updateSubstationView` to mount on entry
- [x] Preserve `validateSubstation(4)` reading same state fields

### Slice 2 — Quadrant dispatch widget

- [x] Implement `plot-duo` mode in `mcs-widgets-space.js` (if not already present from practice)
- [x] `mountGridWidget` on stage 3 sub-stage 2
- [x] `updateCoordReadouts` syncs DOM labels from widget values
- [x] Remove legacy grid SVG / coordinate input-only path

### Slice 3 — Lifecycle & audio

- [x] `destroy*` on `transitionToStage` away from stages 2/3
- [x] `MCS.audio.register(playSound)`

### Slice 4 — G4 audit — ✅ 2026-06-13

- [x] Add `scripts/g4-y6-assessment-audit.mjs`
- [x] Golden-path max score = 36 (per `compileReport` header comment)

---

## 5. Page script wiring (shipped)

```html
<!-- year6.html — Phase 4 assessment -->
<script defer src="vendor/jsxgraph/jsxgraphcore.js"></script>
<script defer src="vendor/konva/konva.min.js"></script>
<script defer src="widgets/mcs-core.js"></script>
<script defer src="widgets/mcs-board.js"></script>
<script defer src="widgets/mcs-stage.js"></script>
<script defer src="widgets/mcs-widgets-measure.js"></script>
<script defer src="widgets/mcs-widgets-space.js"></script>
<script defer src="year6.js"></script>
```

---

## 6. Risks & mitigations

| Risk | Mitigation |
|------|------------|
| `plot-duo` tap targets too small on tablet | Band C pin radius ≥ 12px; test on touch |
| Widget mount before JSXGraph ready | Mount inside `updateSubstationView` after stage visible; defer 1 frame if needed |
| Angle widget state field rename breaks scoring | G4 golden-path fixture test |
| Destroy skipped on fast stage navigation | Destroy in `transitionToStage` unconditionally for stages 2–3 |

---

## 7. Files touched

| File | Action |
|------|--------|
| `widgets/mcs-widgets-measure.js` | ✅ `intersecting-lines` mode on `protractor` |
| `widgets/mcs-widgets-space.js` | ✅ `plot-duo` mode on `coordinate-plotter` |
| `year6.js` | ✅ Widget mount helpers; scoring untouched |
| `year6.html` | ✅ Script block + mount divs |
| `scripts/g4-y6-assessment-audit.mjs` | ✅ |

---

## 8. Relative effort

**M** — 2–3 sessions (complete). Serves as the **copy-paste template** for 4b–4d mount/destroy helpers.
