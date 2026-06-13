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
| 5.6 | `pattern-blocks` continue-pattern (F6) | Konva spike pattern | ✅ 2026-06-14 |
| 5.7 | Measurement trio: `ruler` informal, `balance-scale` compare, `capacity-jug` (F7) | 5.1 | — |
| 5.8 | `coordinate-plotter` 3×3 positional (F10) | `alpha-grid` extend | — |
| 5.9 | Band-A page chrome complete + `year1-practice` scaffold | 5.1–5.8 widgets | — |
| 5.10 | `number-track` missing-numbers / count-by (Y1-1, Y1-4) | 5.9 | — |
| 5.11 | `year2-practice` (9 families) | Y1 widgets + existing engine widgets | — |
| 5.12 | `achievements-config.js` F/Y1/Y2 descriptors (R-07 ACARA verify) + portal activation | content stable | — |

**Assessments for F/Y1/Y2:** deferred until practice validated with children (07-Roadmap §Phase 5.5).

---

## Band-A widgets (Phase 5.1 target list)

| Widget | Modes needed | First consumer |
|--------|--------------|----------------|
| `counters` | `free-count`, `compare-zones`, `make-equal-groups` | F1 ✅ · F3 ✅ · F5 ✅ |
| `ten-frame` | `show-me`, `fill-to`, `make-ten` | F2 ✅ · F4 ✅ (`fill-five`, `fill-ten`, `make-ten`) |
| `number-pad` | 0–10 tap entry | F2 ✅ (with ten-frame) |
| `sorting-table` | `sequence-lane`, shape hangars | F8 ✅ · F9 · F11 |
| `pattern-blocks` | `continue-pattern` | F6 ✅ |
| `number-track` | `missing-numbers`, `count-by` | Y1 (extend existing sieve mode) |
| `ruler` | `informal-units`, `informal-compare` | F7, Y1-5 |
| `capacity-jug` | `compare` | F7 |
| `balance-scale` | `compare` | F7 |
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

`prep-practice.html` / `prep-practice.js` — Band A chrome (`band-a-layout`, `theme-sunrise`). Open via `file://` or local server. Portal card stays offline until slice 5.12.

### Generators live (8 families — Numbers + Patterns tabs)

| Family | Context(s) | Mode / widgets |
|--------|------------|----------------|
| F1 | `free-count-docking` | `counters` `free-count` |
| F2 | `ten-frame-subitise` | `ten-frame` `show-me` + `number-pad` |
| F3 | `compare-zones-more-fewer` | `counters` `compare-zones` |
| F4 | `ten-frame-fill-five`, `ten-frame-fill-ten`, `ten-frame-make-ten` | `ten-frame` `fill-to` / `make-ten` |
| F5 | `make-equal-groups-share` | `counters` `make-equal-groups` |
| F6 | `continue-pattern-ab-blocks` | `pattern-blocks` `continue-pattern` |
| F8 | `sequence-lane-mission-day` | `sorting-table` `sequence-lane` |

**Profile:** `scoresByCatF` on correct answers · contexts frozen for future `achievements-config` (R-07).

### Audit

```bash
node scripts/g5-widget-inventory-audit.mjs   # slices 5.1–5.6 gates
```

**Session log:** [SESSION-LOG-2026-06-13.md](../SESSION-LOG-2026-06-13.md)

---

## Recommended next step

**Slice 5.7** — measurement trio (`ruler`, `balance-scale`, `capacity-jug`) for F7 and the Measuring tab.
