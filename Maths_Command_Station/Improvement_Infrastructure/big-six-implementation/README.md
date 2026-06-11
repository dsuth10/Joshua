# Phase 2 — The Big Six: Implementation Plans

Detailed build plans for the six P1 widgets in [07-Roadmap-and-Migration.md](../07-Roadmap-and-Migration.md) §Phase 2. Each document is a **vertical slice spec**: widget code + one migrated production question + gate-ready QA — never speculative widget-only work (policy R-03).

**Prerequisites (complete):** Phase 0 spikes ✅ · Phase 1 engine core ✅ (`widgets/mcs-core.js`, `widgets/mcs-question-adapter.js`)

**Gate G2: PASSED (2026-06-11).** All six widgets live in production questions across four year levels (Y3–Y6); per-widget QA checklist ([07 §6](../07-Roadmap-and-Migration.md#6-manual-qa-checklist-run-per-gate-no-test-tooling-exists-in-this-project)) passed on desktop + `file://`. Tablet touch spot-check deferred to Phase 6 hardening pass (same pattern as Phase 0).

---

## Build order & dependencies

| Order | Widget | Plan doc | Pilot question | Blocking deps |
|-------|--------|----------|----------------|---------------|
| 2.1 | `number-line` | [01-number-line.md](01-number-line.md) | Y6 N01 — drag pin on −10…10 line | `mcs-board.js` (new) |
| 2.2 | `coordinate-plotter` | [02-coordinate-plotter.md](02-coordinate-plotter.md) | **New** Y6 four-quadrant plot | `mcs-board.js` (from 2.1) |
| 2.3 | `analog-clock` | [03-analog-clock.md](03-analog-clock.md) | Y3 practice — set time on geared clock | `mcs-stage.js` (new) |
| 2.4 | `fraction-bars` | [04-fraction-bars.md](04-fraction-bars.md) | Y3 N02 — shade-a-fraction | `mcs-stage.js` (from 2.3) |
| 2.5 | `column-graph` | [05-column-graph.md](05-column-graph.md) | Y4 statistics — scaled column read | `mcs-board.js` |
| 2.6 | `math-field` | [06-math-field.md](06-math-field.md) | Y5 — fraction entry (`fraction-addition`) | `mcs-input.js` (new) |

**Parallelisation:** After `mcs-board.js` lands (2.1), widgets **2.2** and **2.5** can proceed in parallel. After `mcs-stage.js` lands (2.3), **2.4** is unblocked. **2.6** is independent of Konva/JSXGraph but should land last so earlier widgets do not wait on MathLive page weight.

**Shared infrastructure to create once (not repeated per widget):**

| File | Created by | Provides |
|------|------------|----------|
| `widgets/mcs-board.js` | 2.1 | `MCS.board.make`, `.point`, `.label`, ResizeObserver, theme bridge |
| `widgets/mcs-stage.js` | 2.3 | Konva stage factory, drag/snap framework, keyboard proxy, `aria-live` host |
| `widgets/mcs-input.js` | 2.6 | MathLive wrapper, keyboard profiles, `MCS.input.check` |
| `widgets/mcs-widgets-number.js` | 2.1, 2.4 | Registers `number-line`, `fraction-bars` |
| `widgets/mcs-widgets-measure.js` | 2.3 | Registers `analog-clock` |
| `widgets/mcs-widgets-space.js` | 2.2 | Registers `coordinate-plotter` |
| `widgets/mcs-widgets-data.js` | 2.5 | Registers `column-graph` |

---

## Per-widget definition of done (Phase 2 scope)

Every widget in this phase ships with:

1. **Contract complete** — `getValue`, `setValue`, `setEnabled`, `showSolution`, `flagCorrect`, `flagIncorrect`, `onChange`, `destroy` ([02 §3](../02-Architecture.md#3-the-widget-contract))
2. **Pilot mode only** — additional modes from [03-Widget-Catalogue](../03-Widget-Catalogue.md) are stubbed or deferred unless the pilot needs them
3. **Band B and C** for the pilot year; Band A ergonomics verified on config tokens (full Band A questions arrive Phase 5)
4. **Keyboard path** — Tab → arrows → Enter ([06 §7](../06-UX-Accessibility-Age-Design.md#7-accessibility-requirements-all-bands))
5. **`aria-live` announcements** on state changes
6. **`showSolution` animation** (~800 ms, respects `prefers-reduced-motion`)
7. **One canonical question** migrated from legacy (or net-new for 2.2), contexts/descriptor keys **frozen**
8. **Script header** added to the pilot page HTML per [02 §2](../02-Architecture.md#2-loading-model)
9. **Manual QA** — [07 §6](../07-Roadmap-and-Migration.md#6-manual-qa-checklist-run-per-gate-no-test-tooling-exists-in-this-project) per-widget checklist signed off

---

## Page script wiring (each pilot)

Pilot pages must call:

```javascript
MCS.audio.register(playSound);  // existing page helper
```

and route question load through `MCS.runQuestion` (Y6 already does; Y3/Y4/Y5 need runner integration mirroring `year6-practice.html`).

---

## Document index

| # | Widget | Catalogue ref | Primary library |
|---|--------|---------------|-----------------|
| 01 | [number-line](01-number-line.md) | N1 | JSXGraph |
| 02 | [coordinate-plotter](02-coordinate-plotter.md) | S1 | JSXGraph |
| 03 | [analog-clock](03-analog-clock.md) | M1 | Konva |
| 04 | [fraction-bars](04-fraction-bars.md) | N2 | Konva |
| 05 | [column-graph](05-column-graph.md) | D1 | JSXGraph |
| 06 | [math-field](06-math-field.md) | I1 | MathLive |

---

## Effort shape (relative)

| Widget | Size | Notes |
|--------|------|-------|
| `mcs-board.js` | M | Shared substrate; amortised across 2.1, 2.2, 2.5 |
| `number-line` | M | 1-D board is simpler than full plane |
| `coordinate-plotter` | L | Four-quadrant + tap/drag + new content generators |
| `mcs-stage.js` | M | Shared Konva framework |
| `analog-clock` | M | Geared hands are the hard interaction |
| `fraction-bars` | M | Segment tap + shade state |
| `column-graph` | M | Scaled axis + column hit targets |
| `math-field` | M | Profiles + equivalence checker + `file://` fonts |

**Highest early value:** [02-coordinate-plotter](02-coordinate-plotter.md) — closes `four-quadrant-plotter` badge dead-end and exercises the full stack.
