# 4b — `year5.js` Assessment Migration Plan

**File:** `year5.js` (~1,018 lines, was ~1,051) · `year5.html`  
**Theme:** Band C · blue  
**Gate slice:** G4b — Y5 assessment widgets on engine; scoring + profile bonus frozen  
**Status:** ✅ **Widgets complete — G4b static PASS (2026-06-13)** · Slice 4 line-count target open (~≤ 890 lines)

---

## 1. Goal & success criteria

Replace Y5 assessment bespoke interactives: **decimal accordion expander** (substation 2) and **10×10 dispatch grid** (stage 3 sub-stage 2). Build `plot-waypoints` and `accordion-decimal` modes reused by Y3 in 4d.

**Done when:**

- [x] Substation 2 decimal expander 9.524 uses `MCS.create('place-value-blocks', …, { mode: 'accordion-decimal' })`
- [x] `state.expanderTenths` / `state.expanderHundredths` / `state.expanderThousandths` still populated from student numeric inputs (widget is visual; inputs stay in HTML)
- [x] Stage 3 dispatch grid uses `coordinate-plotter` `plot-waypoints` — **tap-to-plot** replaces `waypoint-*-x/y` text inputs
- [x] `makeAssessmentGridSvg` + `renderAssessmentGrid` + `attachGridListeners` deleted
- [x] `validateSubstation(2)` and `btnSubmitDelivery` read same `state.studentWps` / `state.routeDistance` fields
- [x] `compileReport()` rubric frozen: max **33 marks** (7 test IDs verified in audit)
- [x] Profile bonus: `parsed.score = (parsed.score || 0) + totalScore * 10` unchanged (audit check)
- [x] `year5.html` script block loads engine modules (see §5)
- [x] `scripts/g4-y5-assessment-audit.mjs` static PASS + browser smoke (2026-06-13)
- [ ] Line count reduced **≥ 15%** (~≤ 890 lines) — currently ~1,018 (−3%)

**Keep unchanged (not widget candidates):**

- Stage 1 fact recall keypad
- Substation 1 calibrator (`calcCurrentVal` 68.91 → 69.01)
- Substation 3 decimal↔fraction regulator (text inputs)
- Substation 4 divisibility pair inputs
- Stage 3 sub-stage 1 cargo partitioning (numeric + working text)

---

## 2. Current state inventory

### Bespoke interactives to replace

| Location | Legacy | Lines (approx) | Replacement | Status |
|----------|--------|----------------|-------------|--------|
| Stage 2 SS2 | DOM accordion `#expander-9524`, `updateExpanderVisuals()` | ~504–575 | `place-value-blocks` `accordion-decimal` | ✅ deleted |
| Stage 3 SS2 | `makeAssessmentGridSvg()`, text waypoint inputs | ~650–784 | `coordinate-plotter` `plot-waypoints` | ✅ deleted |

### Scoring rubric (frozen)

| Test ID | Max | Threshold (document for G4) |
|---------|-----|----------------------------|
| `PART_A: FACT_FLUENCY` | 20 | 20 generated recall items |
| `PART_B: DECIMAL_SHIFTER` | 1 | `calcChoice === '+0.1'` |
| `PART_B: DECIMAL_EXPANDER` | 3 | tenths=5, hundredths=2, thousandths=4 |
| `PART_B: FRACTION_REGULATOR` | 2 | decimal + fraction equivalence |
| `PART_B: DIVISIBILITY_PAIR` | 2 | factor pair + 48 divisible reasoning |
| `PART_C: CARGO_PARTITION` | 1 | `cargoWeight === 2.35` |
| `PART_C: COORDINATE_DISPATCH` | 4 | waypoints A(2,8) B(6,4) C(9,1) + `routeDistance === 18` |

Verify exact waypoint answers in `compileReport()` before migrating — **do not change thresholds**.

### Target waypoint values (from mission state)

```javascript
state.waypoints = { A: { x: 2, y: 8 }, B: { x: 6, y: 4 }, C: { x: 9, y: 1 } };
// Student plots via widget; route distance entered separately (Manhattan sum = 18)
```

---

## 3. New widget modes — build specs (Phase 4b)

### 3.1 `place-value-blocks` mode `accordion-decimal`

| Field | Value |
|-------|-------|
| `number` | `9.524` |
| `joints` | `['ones','tenths','hundredths']` — click to collapse place-value groupings |
| `collapsedDisplay` | Mirror `updateExpanderVisuals()` text merges (95 tenths, 952 hundredths, etc.) |
| `getValue()` | `{ collapsed: { ones, tenths, hundredths }, displayLabels }` for logging only |
| `band` | `C` |

**Assessment wiring:** widget is **visual manipulative**; existing `#exp-9524-tenths` etc. inputs remain for graded answers. `validateSubstation(2)` unchanged.

### 3.2 `coordinate-plotter` mode `plot-waypoints`

| Field | Value |
|-------|-------|
| `quadrants` | `1` |
| `xMax` / `yMax` | `10` |
| `snap` | `1` |
| `waypointCount` | `3` |
| `waypointLabels` | `['A','B','C']` |
| `waypointColors` | theme primary / secondary / tertiary |
| `activeWaypoint` | sync with `activeWpFocus` row highlight |
| `showRoute` | `false` until submit (prevent answer leak) |
| `getValue()` | `{ A: {x,y}, B: {x,y}, C: {x,y} }` |

**UX change (intentional):** tap grid cell to plot active waypoint — removes coordinate text fields. Keep `route-distance-input` as numeric entry (Manhattan distance is a separate skill).

---

## 4. Implementation tasks (vertical slices)

### Slice 0 — G4 baseline audit (before code changes)

- [ ] Run `year5.html` on `file://`; record max score on perfect run
- [ ] Export `joshua_math_profile` JSON snippet for bonus formula
- [x] Stub `scripts/g4-y5-assessment-audit.mjs` with static grep targets (2026-06-13)

### Slice 1 — Infrastructure

- [x] Add script block to `year5.html` (JSXGraph, Konva, core + board + stage + number + space + measure)
- [x] Add mount divs: `#decimal-expander-mount`, `#assessment-grid-host` (replace inner SVG host)
- [x] `MCS.audio.register(playSound)`
- [x] Copy Y6 `mount*/destroy*` pattern

### Slice 2 — Decimal accordion widget — ✅ 2026-06-13

- [x] Implement `accordion-decimal` on `place-value-blocks` in `mcs-widgets-number.js`
- [x] `mountExpanderWidget()` in substation 2 `updateSubstationView`
- [x] Port collapse rules from `updateExpanderVisuals()` — joint click logs via `addLog`
- [x] Delete DOM joint listeners on `#joint-o/t/h` and `updateExpanderVisuals`
- [x] QA: collapse all joints → student can still enter 5 / 2 / 4 in inputs

### Slice 3 — Dispatch grid widget — ✅ 2026-06-13

- [x] Implement `plot-waypoints` on `coordinate-plotter` in `mcs-widgets-space.js`
- [x] `mountDispatchWidget()` on stage 3 sub-stage 2
- [x] Sync `activeWpFocus` with widget `setActiveWaypoint(label)`
- [x] `onChange` → `state.studentWps` (same shape as today)
- [x] Delete `makeAssessmentGridSvg`, `renderAssessmentGrid`, `handleWaypointTextInp` listeners
- [x] Remove disabled `attachGridListeners` stub
- [x] QA: tap plots match prior text-input coordinates on grid

### Slice 4 — Lifecycle & dead code

- [x] `destroyExpanderWidget` / `destroyDispatchWidget` on stage transitions
- [x] Grep sweep — zero `makeAssessmentGridSvg` references
- [x] Run G4 audit static PASS
- [ ] Line count target (~≤ 890 lines) — optional cleanup pass

---

## 5. Page script wiring (target)

```html
<!-- year5.html — Phase 4 -->
<script defer src="vendor/jsxgraph/jsxgraphcore.js"></script>
<script defer src="vendor/konva/konva.min.js"></script>
<script defer src="widgets/mcs-core.js"></script>
<script defer src="widgets/mcs-board.js"></script>
<script defer src="widgets/mcs-stage.js"></script>
<script defer src="widgets/mcs-widgets-number.js"></script>
<script defer src="widgets/mcs-widgets-space.js"></script>
<script defer src="year5.js"></script>
```

---

## 6. Risks & mitigations

| Risk | Mitigation |
|------|------------|
| Tap-to-plot changes how students enter coords | Accept UX upgrade; scoring reads same `state` — verify G4 golden path |
| Decimal accordion Konva width on narrow panels | `max-width: 100%` on mount; test Band C layout |
| `plot-waypoints` reveals answer via hover | `showRoute: false`; no distance overlay until stage 4 |
| Waypoint focus row desync | Widget emits `activeLabel` both ways |

---

## 7. Files touched

| File | Action | Status |
|------|--------|--------|
| `widgets/mcs-widgets-number.js` | `accordion-decimal` mode | ✅ |
| `widgets/mcs-widgets-space.js` | `plot-waypoints` mode | ✅ |
| `year5.js` | Mount helpers; delete SVG grid + DOM expander | ✅ |
| `year5.html` | Script block + mount containers | ✅ |
| `style.css` | Min-heights for assessment mounts if needed | — (not required) |
| `scripts/g4-y5-assessment-audit.mjs` | Static + browser smoke checks | ✅ |

---

## 8. Relative effort

**M** — 2–4 sessions. ✅ **Complete (2026-06-13).** Built `plot-waypoints` + `accordion-decimal` modes reused by Y3 (`path-rover`, `accordion-integer`).
