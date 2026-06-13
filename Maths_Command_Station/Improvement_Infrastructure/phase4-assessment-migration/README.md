# Phase 4 — Assessment Terminal Migration: Implementation Plans

Detailed build plans for the four assessment-file sweeps in [07-Roadmap-and-Migration.md](../07-Roadmap-and-Migration.md) §Phase 4. Each document is a **file-level migration spec**: replace bespoke inline-SVG / DOM interactives with shared widgets via `MCS.create()` — while **keeping stage state machines, scoring rubrics, and profile bonus formulas frozen**.

**Prerequisites (complete):** Phase 0 spikes ✅ · Phase 1 engine core ✅ · Phase 2 big six ✅ · Phase 3 practice migration ✅ (Gate G3 passed 2026-06-13)

**Gate G4:** all four assessments completable start-to-finish with **identical scoring**; bonus points still write to `joshua_math_profile` with the same keys and scaling as pre-migration.

---

## How assessments differ from practice (Phase 3)

| Aspect | Practice (Phase 3) | Assessment (Phase 4) |
|--------|-------------------|----------------------|
| Question shape | Canonical package → `MCS.runQuestion` | **No adapter** — widgets mounted directly in stage JS |
| Progression | Random question generator | Fixed **4-stage mission** (`intro` → `1` → `2` → `3` → `4`) |
| Validation | `evaluate(values)` per question | `validateSubstation(n)` + inline submit handlers |
| Scoring | Per-question points + badges | `compileReport()` rubric table (frozen mark allocations) |
| Profile | `solvedContexts` + descriptor points | **Bonus** `scoresByCatY*` + scaled `score` on report |
| Migration unit | Generator family | **Interactive substation** (SVG/DOM blob) |

**Non-negotiable:** do not refactor `transitionToStage`, recall engines, calculator substations, or `compileReport()` thresholds unless a scoring bug is proven — widget swaps only change **how state is captured** (`widget.getValue()` → same `state.*` fields).

---

## Build order & dependencies

| Order | File | Plan doc | Lines (current) | Bespoke interactives | Status |
|-------|------|----------|-----------------|----------------------|--------|
| 4a | `year6.js` | [01-year6-assessment.md](01-year6-assessment.md) | ~964 | 2 widgets migrated; sieve + metric stay | ✅ **G4a reference (2026-06-13)** |
| 4b | `year5.js` | [02-year5-assessment.md](02-year5-assessment.md) | ~1,051 | decimal expander, dispatch grid | ✅ widgets on engine; G4 static PASS |
| 4c | `year4.js` | [03-year4-assessment.md](03-year4-assessment.md) | ~976 | pathfinder, symmetry board, static number line | — |
| 4d | `year3.js` | [04-year3-assessment.md](04-year3-assessment.md) | ~1,441 | fraction plotter, accordion, clock, delivery map | 🔄 accordion + clock done |

**Parallelisation:** **4a (Y6) is the reference implementation** — copy its `mount*/destroy*` lifecycle. **4b must land before 4d** if `plot-waypoints` and `accordion-decimal` modes are built on the Y5 dispatch grid first. **4c** can overlap late 4b (symmetry-painter and alpha-grid already exist from Phase 3c). **4d** is the largest SVG deletion and should be last.

---

## New widget modes created in Phase 4 (not Phase 2/3)

Extend existing widgets per policy R-03 — no second implementations.

| Mode | Widget | Module | Built in | First consumer |
|------|--------|--------|----------|----------------|
| `intersecting-lines` | `protractor` | `mcs-widgets-measure.js` | 4a ✅ | Y6 substation 4 angle diagram |
| `plot-duo` | `coordinate-plotter` | `mcs-widgets-space.js` | 4a ✅ | Y6 stage 3 quadrant dispatch |
| `plot-waypoints` | `coordinate-plotter` | `mcs-widgets-space.js` | 4b | Y5 cargo dispatch (A/B/C pins) |
| `accordion-decimal` | `place-value-blocks` | `mcs-widgets-number.js` | 4b | Y5 substation 2 expander 9.524 |
| `accordion-integer` | `place-value-blocks` | `mcs-widgets-number.js` | 4d | Y3 substation 3 expander 952 |
| `path-rover` | `coordinate-plotter` | `mcs-widgets-space.js` | 4d | Y3 Eggerling delivery map |
| `reference-line` | `number-line` | `mcs-widgets-number.js` | 4c (stretch) | Y4 mixed-numeral display (replaces static SVG) |

**Reuse rule:** Y3/Y4/Y5 consume modes built in 4a/4b; extend config only.

---

## Per-file definition of done (Phase 4 scope)

Every assessment file migration ends with:

1. **Widget substitution** — each bespoke interactive in the roadmap table uses `MCS.create` + `getValue`/`onChange`; zero inline SVG draw loops for that interactive
2. **State machine frozen** — `transitionToStage`, substation indices, `validateSubstation`, submit-gate logic unchanged in behaviour
3. **Scoring frozen** — `compileReport()` produces identical `test` IDs, mark caps, and threshold checks; capture a **golden-path score JSON** in the G4 audit script
4. **Profile bonus frozen** — `localStorage` write uses same `scoresByCatY*` keys and multipliers as pre-migration (diff profile JSON in QA)
5. **Widget lifecycle** — `destroy()` on stage exit / substation leave; no listener pile-up across reset
6. **Script header** — HTML loads vendor + widget modules the file uses (mirror `year6.html` pattern)
7. **Dead code sweep** — delete replaced `init*`, `render*`, `make*Svg` helpers when zero references remain
8. **Line reduction** — target **20–35%** on Y3 (largest win); Y4/Y5 **15–25%**; Y6 already lean

---

## Assessment widget mount pattern (from Y6 — copy this)

```javascript
let fractionWidget = null;

function destroyFractionWidget() {
  if (fractionWidget) { fractionWidget.destroy(); fractionWidget = null; }
  const mount = document.getElementById('fraction-plotter-mount');
  if (mount) mount.innerHTML = '';
}

function mountFractionWidget() {
  if (typeof MCS === 'undefined') return;
  destroyFractionWidget();
  const mount = document.getElementById('fraction-plotter-mount');
  if (!mount) return;
  const inner = document.createElement('div');
  inner.style.width = '100%';
  mount.appendChild(inner);
  fractionWidget = MCS.create('number-line', inner, { mode: 'place-point', min: 0, max: 1, step: 0.25, band: 'B' });
  fractionWidget.onChange(() => {
    const v = fractionWidget.getValue();
    state.fractionPlotterVal = v.position; // same field compileReport reads
  });
}

// Call mountFractionWidget() inside updateSubstationView when substation === 2
// Call destroyFractionWidget() in transitionToStage when leaving stage 2
```

Register audio once: `MCS.audio.register(playSound)` (Y6 pattern §3b).

---

## Gate G4 — assessment regression audit

**Unlike G3**, assessments have no `achievements-config` context strings. G4 audits **scoring fidelity** and **page health**.

**Automated (create in `Maths_Command_Station/scripts/`):**

```bash
node scripts/g4-y3-assessment-audit.mjs
node scripts/g4-y4-assessment-audit.mjs
node scripts/g4-y5-assessment-audit.mjs
node scripts/g4-y6-assessment-audit.mjs
```

Each script should:

| Check | PASS when |
|-------|-----------|
| Static dead-code | Zero matches for retired helper names (per-file list in plan docs §2) |
| Script wiring | HTML includes required `vendor/` + `widgets/` modules |
| Browser smoke | Page loads via `file://`; zero `console.error` |
| Golden-path scoring (stretch) | Programmatic `state` fixture → `compileReport()` totals match documented max marks |

**Manual (07 §6 adapted for assessments):**

- [ ] Complete one full mission per year; export `joshua_math_profile` before and after on the same deliberate answers — bonus fields identical
- [ ] Reset (`btn-reset-app`) → replay stage 2 substations — no duplicate widgets, heap stable
- [ ] Theme accent renders on widget chrome
- [ ] Resize mid-substation — widget rescales (`board.updateContainerDims()`)

---

## Document index

| # | File | Primary widget work | Catalogue refs |
|---|------|---------------------|----------------|
| 01 | [year6-assessment](01-year6-assessment.md) | `protractor` `intersecting-lines`, `coordinate-plotter` `plot-duo` | M2, S1 |
| 02 | [year5-assessment](02-year5-assessment.md) | `place-value-blocks` `accordion-decimal`, `coordinate-plotter` `plot-waypoints` | N5, S1 |
| 03 | [year4-assessment](03-year4-assessment.md) | `symmetry-painter`, `coordinate-plotter` `alpha-grid`, `number-line` display | S3, S1, N1 |
| 04 | [year3-assessment](04-year3-assessment.md) | `number-line`, `place-value-blocks`, `analog-clock`, `coordinate-plotter` `path-rover` | N1, N5, M1, S1 |

---

## Effort shape (relative)

| Slice | Size | Notes |
|-------|------|-------|
| 4a Y6 reference | **M** | ✅ Done — establishes patterns |
| 4b Y5 dispatch + decimal | **M** | `plot-waypoints` is the riskiest new mode |
| 4c Y4 wiring | **S–M** | Mostly consumes Phase 3c widgets |
| 4d Y3 full sweep | **L** | ~600 lines SVG across 4 interactives |
| G4 audit scripts + QA | **S** per file | Golden-path scoring optional stretch |

**Highest leverage slice:** Y3 `initDeliveryGridMap` + Y5 `makeAssessmentGridSvg` → single `coordinate-plotter` family; deletes the last duplicate grid implementations.

**Recommended vertical-slice order within 4d:** (1) fraction plotter → `number-line`, (2) accordion → `place-value-blocks`, (3) clock → `analog-clock` (gearing fix), (4) delivery map → `path-rover`, (5) dead code + G4 audit.
