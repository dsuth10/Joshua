# 4d — `year3.js` Assessment Migration Plan

**File:** `year3.js` (~1,441 lines) · `year3.html`  
**Theme:** Band B · teal  
**Gate slice:** G4d — final assessment file on engine; largest bespoke-SVG deletion  
**Status:** 🔄 **In progress** — Slices 2–3 complete; Slices 1, 4–5 pending

---

## 0. Pre-migration audit — bespoke SVG footprint

| Helper | Lines (approx) | AC descriptor | Widget target |
|--------|----------------|---------------|---------------|
| `initFractionPlotter()` | ~453–585 | AC9M3N02 | `number-line` `place-point` |
| `initAccordionExpander()` | ~590–729 | AC9M3N01 | `place-value-blocks` `accordion-integer` |
| `initAnalogClock()` | ~836–1006 | AC9M3M04 | `analog-clock` `set-time` |
| `initDeliveryGridMap()` | ~1011–1171 | AC9M3SP02 | `coordinate-plotter` `path` + rover tween |

**Total removable:** ~600 lines of inline SVG + drag handlers.

**Depends on:** 4b `accordion-decimal` pattern (reuse joint-collapse logic for integer 952); practice widgets from Phase 2/3d already ship `number-line`, `place-value-blocks`, `analog-clock`, `coordinate-plotter` `path`.

---

## 1. Goal & success criteria

Complete the assessment migration sweep. Year 3 has the **most bespoke SVG** of the four terminals; all four interactives have direct widget equivalents in the catalogue ([03 §N1, N5, M1, S1](../03-Widget-Catalogue.md)).

**Done when:**

- [ ] Substation 2 fraction plotter → `number-line` `{ mode: 'place-point', min: 0, max: 1, step: 0.25 }`
- [ ] `state.fractionPlotterVal` synced from `getValue().position` — `compileReport` still awards mark when `=== 0.75`
- [x] Substation 3 accordion 952 → `place-value-blocks` `{ mode: 'accordion-integer' }`
- [x] Student still enters tens/ones in `#exp-952-tens` / `#exp-952-ones`; widget visual only
- [x] Stage 3 sub-stage 2 clock → `analog-clock` `{ mode: 'set-time', gear: true, snapMinutes: 5 }`
- [x] **Geared hands** replace independent hour/minute drag (pedagogical fix per R-09, 03 §M1)
- [x] `state.clockHour` / `state.clockMinute` synced; target remains **3:45 PM**
- [ ] Stage 3 sub-stage 2 delivery map → `coordinate-plotter` `{ mode: 'path-rover', … }`
- [ ] 5×5 grid, shops A(1,3) C(3,4) B(4,2), van route animation via widget rover tween
- [ ] `btnRunDelivery` triggers widget `playRoute()` — cargo counts still update in `state`
- [ ] `initFractionPlotter`, `initAccordionExpander`, `initAnalogClock`, `initDeliveryGridMap` deleted
- [ ] `compileReport()` unchanged: max **30 marks**
- [ ] Profile bonus: `scoresByCatY3.algebra/number/space/measurement` formulas unchanged
- [ ] `year3.html` script block complete
- [ ] `scripts/g4-y3-assessment-audit.mjs` PASS
- [ ] Line count reduced **≥ 25%** (~≤ 1,080 lines)

**Keep unchanged:**

- Stage 1 recall engine
- Substation 1 calibrator (796 → 806) + explanation
- Substation 4 final calibration numeric inputs
- Stage 3 sub-stage 1 egg packer canvas (Konva stretch — optional Phase 6)

---

## 2. Current state inventory

### Scoring rubric (frozen)

| Test ID | Max | Threshold |
|---------|-----|-----------|
| `PART_A: FACT_RECALL` | 20 | recall |
| `PART_B: CALIBRATOR_HACK` | 1 | `calcChoice === 'add-10'` |
| `PART_B: FRACTION_PLOTTER` | 1 | `fractionPlotterVal === 0.75` |
| `PART_B: ACCORDION_EXPANDER` | 2 | tens=95, ones=2 |
| `PART_B: FINAL_CALIBRATION` | 3 | hundreds/ten-less/tens counts |
| `PART_C: EGG_PACKER` | 1 | carton capacity |
| `PART_C: DELIVERY_DISPATCH` | 1 | van cargo remaining |
| `PART_C: DEPARTURE_CLOCK` | 1 | 3:45 |
| (see `compileReport` for full table) | | |

### Delivery route (frozen)

```javascript
const path = [
  { x: 0, y: 0 },   // Warehouse
  { x: 1, y: 3 },   // Shop A — cargo 213 → 203
  { x: 3, y: 4 },   // Shop C — 203 → 193
  { x: 4, y: 2 },   // Shop B — 193 → 183
];
// btnRunDelivery animates van; van-left input expects 183
```

---

## 3. Widget build specs (Phase 4d)

### 3.1 `number-line` — fraction plotter parity

| Field | Value |
|-------|-------|
| `mode` | `place-point` |
| `min` / `max` | `0` / `1` |
| `step` | `0.25` |
| `tickLabels` | `0, 1/4, 2/4, 3/4, 1` |
| `band` | `B` |
| Mount | `#fraction-plotter-svg-host` → replace with `#fraction-plotter-mount` |

**Practice reference:** `year3-practice.js` `unit-fraction-lines` generator.

### 3.2 `place-value-blocks` `accordion-integer`

| Field | Value |
|-------|-------|
| `number` | `952` |
| `joints` | `['hundreds','tens']` |
| Collapse behaviour | Port from `initAccordionExpander` `drawExpander` state machine |
| `band` | `B` |

**Reuse:** joint-collapse logic from 4b `accordion-decimal` — parameterise integer vs decimal plates.

### 3.3 `analog-clock` — departure clock

| Field | Value |
|-------|-------|
| `mode` | `set-time` |
| `gear` | `true` (**required** — fixes independent-hand bug) |
| `snapMinutes` | `5` (preserve ±5 nudge buttons in HTML) |
| `initial` | `{ hours: 12, minutes: 0 }` |
| `showDigital` | `'12h'` with PM label in adjacent readout |
| `band` | `B` |

**Practice reference:** Phase 2.3 `analog-clock` on `year3-practice.html`.

### 3.4 `coordinate-plotter` `path-rover`

| Field | Value |
|-------|-------|
| `quadrants` | `1` |
| `xMax` / `yMax` | `4` |
| `landmarks` | WH(0,0), A(1,3), C(3,4), B(4,2) with labels |
| `routePath` | Fixed delivery polyline (dashed preview) |
| `rover` | Van icon tweens along path on `playRoute()` |
| `cargoSchedule` | `[213,203,193,183]` at segment ends |
| `onSegmentComplete` | Callback → `addLog` + sound (wire to `state.shop*Status`) |
| `getValue()` | `{ vanCargo, vanPosition }` |

**Practice reference:** `year3-practice.js` `landmark-navigate-coords` `path` mode — extend with rover animation hook.

---

## 4. Implementation tasks (vertical slices)

### Slice 0 — G4 baseline audit

- [ ] Perfect-run score capture (30 marks)
- [ ] Profile bonus JSON baseline
- [ ] Stub `scripts/g4-y3-assessment-audit.mjs` — grep for four `init*` function names

### Slice 1 — Infrastructure + fraction plotter

- [ ] `year3.html` script block (JSXGraph, Konva, core, board, stage, number, measure, space)
- [ ] `MCS.audio.register(playSound)`
- [ ] Mount/destroy helpers file section (copy Y6 pattern)
- [ ] Replace fraction SVG host with `mountFractionWidget()` on SS2
- [ ] Delete `initFractionPlotter`
- [ ] QA: drag pin to 3/4 → success log + `state.fractionPlotterVal === 0.75`

### Slice 2 — Accordion expander

- [x] Implement `accordion-integer` (extends 4b accordion pattern)
- [x] `mountAccordionWidget()` on SS3
- [x] Delete `initAccordionExpander`
- [x] QA: joint folds match legacy log strings

### Slice 3 — Analog clock (gearing fix)

- [x] `mountClockWidget()` when entering Eggerling sub-stage 2
- [x] Wire ±5 buttons to `clockWidget.nudgeMinutes(±5)` / `nudgeHours(±1)` API
- [x] Delete `initAnalogClock` (~170 lines)
- [x] QA: geared minute drag moves hour proportionally; 3:45 still passes

### Slice 4 — Delivery map + rover

- [ ] Implement `path-rover` mode (or `path` + `animateRover: true` config flag)
- [ ] `mountDeliveryWidget()` alongside clock in sub-stage 2
- [ ] `btnRunDelivery` → `deliveryWidget.playRoute()`
- [ ] Auto-fill `#van-left-input` with 183 on complete (preserve behaviour)
- [ ] Delete `initDeliveryGridMap` (~160 lines)
- [ ] QA: animation segments, cargo counts, final input

### Slice 5 — Lifecycle, dead code, G4 gate

- [ ] Destroy all widgets on `transitionToStage` / substation changes
- [ ] Grep — zero `fraction-plotter-svg-host` innerHTML assignments
- [ ] G4 audit PASS
- [ ] Manual profile diff on golden path

---

## 5. Page script wiring (target)

```html
<!-- year3.html — Phase 4 -->
<script defer src="vendor/jsxgraph/jsxgraphcore.js"></script>
<script defer src="vendor/konva/konva.min.js"></script>
<script defer src="widgets/mcs-core.js"></script>
<script defer src="widgets/mcs-board.js"></script>
<script defer src="widgets/mcs-stage.js"></script>
<script defer src="widgets/mcs-widgets-number.js"></script>
<script defer src="widgets/mcs-widgets-measure.js"></script>
<script defer src="widgets/mcs-widgets-space.js"></script>
<script defer src="year3.js"></script>
```

---

## 6. Risks & mitigations

| Risk | Mitigation |
|------|------------|
| Geared clock changes difficulty | Target unchanged (3:45); only pedagogy improves (R-09) |
| Rover animation timing differs | Match ~35% segment increment from legacy `requestAnimationFrame` |
| Four widgets in one sub-stage memory | Mount clock + delivery only when sub-stage 2 visible; destroy on leave |
| Egg packer canvas still bespoke | Out of scope — no SVG helper deletion target |

---

## 7. Files touched (expected)

| File | Action |
|------|--------|
| `widgets/mcs-widgets-number.js` | `accordion-integer` mode |
| `widgets/mcs-widgets-measure.js` | Assessment clock config tweaks if needed |
| `widgets/mcs-widgets-space.js` | `path-rover` mode |
| `year3.js` | Mount helpers; delete four `init*` blocks |
| `year3.html` | Scripts + mount div IDs |
| `style.css` | Assessment widget min-heights |
| `scripts/g4-y3-assessment-audit.mjs` | New |

---

## 8. Relative effort

**L** — 3–5 sessions. Largest Phase 4 slice; completes Gate G4 when all four audits PASS.

---

## 9. Gate G4 sign-off checklist (all years)

- [ ] Y6 G4a audit PASS
- [ ] Y5 G4b audit PASS
- [ ] Y4 G4c audit PASS
- [ ] Y3 G4d audit PASS
- [ ] Update [07-Roadmap-and-Migration.md](../07-Roadmap-and-Migration.md) §Phase 4 checkboxes
- [ ] Manual: four full missions, profile bonus verified
