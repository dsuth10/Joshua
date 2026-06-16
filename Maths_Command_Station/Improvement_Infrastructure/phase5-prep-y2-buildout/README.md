# Phase 5 — Prep–Year 2 Build-Out: Implementation Plans

New practice content for Foundation–Year 2 on the widget engine. Prerequisites: Phases 0–4 complete (Gate G4 PASS 2026-06-13).

**Gate G5:** a five-year-old can complete a Prep session unassisted after one demonstration (family user-testing).

**Authoritative content list:** [04-Year-Level-Matrix.md](../04-Year-Level-Matrix.md) §3 (11 + 8 + 9 question families).

---

## Build order

| Order | Work unit | Depends on | Status |
|-------|-----------|------------|--------|
| 5.0 | Widget inventory audit — `node scripts/g5-widget-inventory-audit.mjs` | — | ✅ 2026-06-13 |
| 5.1 | `MCS.speech` + `counters` `free-count` + `prep-practice` pilot (F1) | 5.0 | ✅ 2026-06-13 |
| 5.2 | `ten-frame` `show-me` + `number-pad` (F2 subitise) | 5.1 | ✅ 2026-06-13 |
| 5.3 | `counters` compare + equal-groups (F3, F5) | 5.1 | ✅ 2026-06-13 |
| 5.4 | `ten-frame` fill-to + make-ten (F4) | 5.2 | ✅ 2026-06-13 |
| 5.5 | `sorting-table` sequence lane (F8, F9, F11) | 5.1 | ✅ 2026-06-14 |
| 5.5b | `sorting-table` shape-hangars (F9) + picture-graph (F11) | 5.5 | ✅ 2026-06-15 |
| 5.6 | `pattern-blocks` continue-pattern (F6) | Konva spike pattern | ✅ 2026-06-14 |
| 5.7 | Measurement trio: `ruler` informal, `balance-scale` compare, `capacity-jug` (F7) | 5.1 | ✅ 2026-06-14 |
| 5.8 | `coordinate-plotter` 3×3 positional (F10) | `alpha-grid` extend | ✅ 2026-06-14 |
| 5.9 | Band-A page chrome complete + `year1-practice` scaffold | 5.1–5.8 widgets | ✅ 2026-06-15 |
| 5.10 | `number-track` missing-numbers / count-by (Y1-1, Y1-4) | 5.9 | ✅ 2026-06-15 |
| 5.10b | `ten-frame` `double-frame` teen partition (Y1-2) | 5.10 | ✅ 2026-06-15 |
| 5.10c | `number-line` `jump` within 20 (Y1-3) | 5.10b | ✅ 2026-06-15 |
| 5.11 | `year2-practice` scaffold + `scoresByCatY2` | 5.10c | ✅ 2026-06-15 |
| 5.11b | Y2-5 quarter-past/to clock (`analog-clock`) | 5.11 | ✅ 2026-06-15 |
| 5.10d | Y1-5 informal-units ruler (`ruler`) | 5.7 | ✅ 2026-06-16 |
| 5.10e | Y1-6 o'clock/half-past clock (`analog-clock`) | 2.3 clock | ✅ 2026-06-16 |
| 5.10f | Y1-7 shape-builder copy-shape (`shape-builder`) | Konva pegboard | ✅ 2026-06-16 |
| 5.10g | Y1-8 picture graph favourites (`sorting-table` `picture-graph`) | F11 reuse | ✅ 2026-06-16 |
| 5.11c | Y2-1 place-value-blocks build + trade | 3d PVB | ✅ 2026-06-16 |
| 5.11d | Y2-2 fraction bars shade (halves/quarters/eighths) | 2.4 fraction-bars | ✅ 2026-06-16 |
| 5.11e | Y2-3 array-builder build-array | 3d array-builder extend | ✅ 2026-06-16 |
| 5.12 | `achievements-config.js` F/Y1/Y2 descriptors (R-07 ACARA verify) + portal activation | content stable | ✅ 2026-06-16 |

**Assessments for F/Y1/Y2:** deferred until practice validated with children (07-Roadmap §Phase 5.5).

---

## Gate G5 prep pack

Use [`06-g5-family-user-testing-prep.md`](./06-g5-family-user-testing-prep.md) for:

- facilitator script (one-demo rule),
- pass/fail gate rubric,
- 10-question evidence template,
- re-test loop after blockers.

---

## Band-A widgets (Phase 5.1 target list)

| Widget | Modes needed | First consumer |
|--------|--------------|----------------|
| `counters` | `free-count`, `compare-zones`, `make-equal-groups` | F1 ✅ · F3 ✅ · F5 ✅ |
| `ten-frame` | `show-me`, `fill-to`, `make-ten`, `double-frame` | F2 ✅ · F4 ✅ · Y1-2 ✅ |
| `number-pad` | 0–10 tap entry | F2 ✅ (with ten-frame) |
| `sorting-table` | `sequence-lane`, shape hangars, picture-graph | F8 ✅ · F9 ✅ · F11 ✅ |
| `pattern-blocks` | `continue-pattern` | F6 ✅ |
| `number-track` | `missing-numbers`, `count-by` | Y1 ✅ (Y1-1, Y1-4) |
| `ruler` | `informal-units`, `informal-compare` | F7 ✅ · Y1-5 |
| `capacity-jug` | `compare` | F7 ✅ |
| `balance-scale` | `compare` | F7 ✅ |
| `number-pad` | Band A entry | F2 |

**Reuse rule (R-03):** extend existing widgets — e.g. `balance-scale` compare mode on the Y6 algebra widget, `coordinate-plotter` alpha-grid for F10.

---

## Per-slice definition of done

1. **Vertical slice** — widget ships with a consuming canonical question on `prep-practice`, `year1-practice`, or `year2-practice`
2. **Band A ergonomics** — touch targets ≥ 64 px, reset button, `aria-live`, `prefers-reduced-motion`
3. **Audio** — `promptAudio` on every Band A question; speaker replay button
4. **Profile** — `scoresByCatF` / `scoresByCatY1` / `scoresByCatY2` accrue with same pattern as Y3–6
5. **Audit** — inventory script updated; browser smoke on new page(s)
6. **Context freeze** — descriptor + context strings set before `achievements-config` entries (R-07 verification gate)

---

## Pilot page

`prep-practice.html` / `prep-practice.js` — Band A chrome (`band-a-layout`, `theme-sunrise`). Shared chrome in `band-a-practice-common.js` (strand tab colours, last-3 badge shelf, adult console). Open via `file://` or local server. Portal card **online** (Slice 5.12 — practice-only).

`year1-practice.html` / `year1-practice.js` — Band A→B scaffold (`band-y1-layout`, `scoresByCatY1`). **Slice 5.10:** Y1-1/Y1-4 on Numbers tab · **5.10b:** Y1-2 teen partition · **5.10c:** Y1-3 jumps on Add & Take tab.

`year2-practice.html` / `year2-practice.js` — Band B scaffold (`band-y2-layout`, `scoresByCatY2`). **Slices 5.11–5.11j:** all nine Year 2 families live across Numbers/Arrays/Measuring/Shapes/Chance/Data.

### Generators live (11 families — five Prep tabs)

| Family | Context(s) | Mode / widgets |
|--------|------------|----------------|
| F1 | `free-count-docking` | `counters` `free-count` |
| F2 | `ten-frame-subitise` | `ten-frame` `show-me` + `number-pad` |
| F3 | `compare-zones-more-fewer` | `counters` `compare-zones` |
| F4 | `ten-frame-fill-five`, `ten-frame-fill-ten`, `ten-frame-make-ten` | `ten-frame` `fill-to` / `make-ten` |
| F5 | `make-equal-groups-share` | `counters` `make-equal-groups` |
| F6 | `continue-pattern-ab-blocks` | `pattern-blocks` `continue-pattern` |
| F7 | `ruler-informal-compare-longer`, `balance-scale-compare-heavier`, `capacity-jug-compare-more` | `ruler` / `balance-scale` / `capacity-jug` compare |
| F8 | `sequence-lane-mission-day` | `sorting-table` `sequence-lane` |
| F9 | `shape-hangars-sort-shapes` | `sorting-table` `shape-hangars` |
| F10 | `alpha-grid-positional-in-front`, `alpha-grid-positional-behind`, `alpha-grid-positional-next-to` | `coordinate-plotter` `alpha-grid` positional |
| F11 | `picture-graph-crew-yes-no` | `sorting-table` `picture-graph` |

**Profile:** `scoresByCatF` on correct answers · contexts frozen for future `achievements-config` (R-07).

### Year 1 generators live (4 families — Numbers + Add & Take tabs)

| Family | Context(s) | Mode / widgets |
|--------|------------|----------------|
| Y1-1 | `number-track-missing-next` | `number-track` `missing-numbers` |
| Y1-2 | `teen-partition-double-frame` | `ten-frame` `double-frame` + `number-pad` |
| Y1-3 | `number-line-jump-within-twenty` | `number-line` `jump` |
| Y1-4 | `number-track-count-by-steps` | `number-track` `count-by` |
| Y1-5 | `ruler-informal-units-paperclips` | `ruler` `informal-units` |
| Y1-6 | `clock-set-oclock-half-past` | `analog-clock` `set-time` (30 min snap) |
| Y1-7 | `shape-builder-copy-pegboard` | `shape-builder` `copy-shape` |
| Y1-8 | `picture-graph-favourites-one-to-one` | `sorting-table` `picture-graph` |

**Profile:** `scoresByCatY1` on correct answers · **Year 1 complete (8/8 families).**

### Year 2 generators live (9 families — full strand coverage)

| Family | Context(s) | Mode / widgets |
|--------|------------|----------------|
| Y2-1 | `place-value-blocks-build-three-digit`, `place-value-blocks-trade-regroup` | `place-value-blocks` `build` / `trade` |
| Y2-2 | `fraction-bars-shade-halves-quarters-eighths` | `fraction-bars` `shade` |
| Y2-3 | `array-builder-set-multiplication` | `array-builder` `build-array` |
| Y2-4 | `counters-money-make-amount` | `counters` `money-make` |
| Y2-5 | `clock-set-quarter-past-to` | `analog-clock` `set-time` (quarter snap) |
| Y2-6 | `ruler-measure-object-centimetres` | `ruler` `measure-object` |
| Y2-7 | `transform-board-single-step-flip-slide-turn` | `transform-board` `single-step` |
| Y2-8 | `marble-bag-chance-words-read`, `spinner-predict-chance-words` | `marble-bag` read + `spinner` predict |
| Y2-9 | `column-graph-picture-collect-one-to-one`, `column-graph-build-many-to-one` | `column-graph` picture/build |

**Profile:** `scoresByCatY2` on correct answers · **9 / 9** Y2 families live.

**Recommended next step:** Gate G5 family user-testing, then Phase 5.5 assessments when practice validated with children.

### Audit

```bash
node scripts/g5-widget-inventory-audit.mjs   # slices 5.1–5.12 gates
```

**Session logs:** [SESSION-LOG-2026-06-13.md](../SESSION-LOG-2026-06-13.md) · [SESSION-LOG-2026-06-15.md](../SESSION-LOG-2026-06-15.md) · [SESSION-LOG-2026-06-16.md](../SESSION-LOG-2026-06-16.md)
