# Phase 3 — Year-by-Year Practice Migration: Implementation Plans

Detailed build plans for the four practice-file sweeps in [07-Roadmap-and-Migration.md](../07-Roadmap-and-Migration.md) §Phase 3. Each document is a **file-level migration spec**: convert legacy `renderFunc` / inline-SVG question families to canonical packages with widgets — building new widgets only when a consuming question needs them in the same change (policy R-03).

**Prerequisites (complete):** Phase 0 spikes ✅ · Phase 1 engine core ✅ · Phase 2 big six ✅ (Gate G2 passed 2026-06-11)

**Gate G3: PASSED (2026-06-13).** All four practice pages migrated; every `achievements-config.js` context reachable by a live generator; per-file audit scripts PASS; browser smoke PASS on Y3–Y6. Manual QA checklist ([07 §6](../07-Roadmap-and-Migration.md#6-manual-qa-checklist-run-per-gate-no-test-tooling-exists-in-this-project)) — automated smoke only; 20-question manual session + tablet touch deferred to Phase 6.

---

## Build order & dependencies

| Order | File | Plan doc | Lines (current) | Contexts | Status |
|-------|------|----------|-----------------|----------|--------|
| 3a | `year5-practice.js` | [01-year5-practice.md](01-year5-practice.md) | ~4,143 | 51 / 51 | ✅ G3a 2026-06-13 |
| 3b | `year6-practice.js` | [02-year6-practice.md](02-year6-practice.md) | ~2,521 | 48 / 48 | ✅ G3b 2026-06-13 |
| 3c | `year4-practice.js` | [03-year4-practice.md](03-year4-practice.md) | ~2,542 | 44 / 44 | ✅ G3c 2026-06-13 |
| 3d | `year3-practice.js` | [04-year3-practice.md](04-year3-practice.md) | ~2,432 | 46 / 46 | ✅ G3d 2026-06-13 |

**Parallelisation:** **3a must land first** — it creates `transform-board`, `shape-measurer`, `line-graph`, and the probability suite reused elsewhere. **3b** can overlap late 3a once shared widgets exist. **3c** and **3d** are largely sequential after 3a (they import widgets rather than invent them).

---

## New widgets created in Phase 3 (not Phase 2)

Widgets are registered in existing module files unless noted. Full API specs: [03-Widget-Catalogue.md](../03-Widget-Catalogue.md).

| Widget | Built in | Module | First consumer |
|--------|----------|--------|----------------|
| `transform-board` | 3a | `mcs-widgets-space.js` | Y5 `reflection` / `vector-reflection` |
| `shape-measurer` | 3a | `mcs-widgets-measure.js` | Y5 `perimeter-area` |
| `line-graph` | 3a | `mcs-widgets-data.js` | Y5 statistics strand |
| `marble-bag` | 3a | `mcs-widgets-data.js` | Y5 `marble-likelihood` |
| `dice-coin-lab` | 3a | `mcs-widgets-data.js` | Y5 `die-outcomes`, `chance-experiment` |
| `spinner` | 3a | `mcs-widgets-data.js` | Y5 probability (stretch: Y6 `large-trial-spinner`) |
| `coordinate-plotter` modes | 3a, 3c, 3d | `mcs-widgets-space.js` | Y5 grid/reflection; Y4 alpha-grid; Y3 landmarks |
| `number-line` modes | 3a, 3c | `mcs-widgets-number.js` | Y5 fraction ordering; Y4 mixed numerals |
| `math-field` expansion | 3a, 3b | `mcs-input.js` | Y5 ordering/percent; Y6 fractions |
| `balance-scale` | 3b | `mcs-widgets-measure.js` | Y6 algebra unknowns |
| `number-track` | 3b | `mcs-widgets-number.js` | Y6 prime sieve / `cartesian-four-quadrants` companion |
| `protractor` | 3c | `mcs-widgets-measure.js` | Y4 `angle-evaluator` |
| `symmetry-painter` | 3c | `mcs-widgets-space.js` | Y4 `symmetry-paint` |
| `analog-clock` elapsed | 3c | `mcs-widgets-measure.js` | Y4 `time-duration` |
| `array-builder` | 3d | `mcs-widgets-number.js` | Y3 fact-family hint scaffold |
| `place-value-blocks` | 3d | `mcs-widgets-number.js` | Y3 regroup hint / assessment parity |
| `column-graph` build | 3d | `mcs-widgets-data.js` | Y3 statistics tally build |
| `marble-bag` | 3d | `mcs-widgets-data.js` | Y3 `chance-likelihood` |

**Reuse rule:** When 3c or 3d needs a widget 3a already built, **extend config/modes** — do not fork a second implementation.

---

## Per-file definition of done (Phase 3 scope)

Every practice file migration ends with:

1. **Canonical or explicit legacy** — every question family returns a canonical package **or** carries `// legacy-keep: <reason>` (text-recall, timed drills, word problems with no visual benefit)
2. **Single load path** — `loadNextQuestion` / `loadQuestion` always routes through `MCS.runQuestion` (legacy adapter only inside adapter module, not in page JS)
3. **Dead SVG sweep** — all `make*Svg` helpers deleted from the file when zero references remain
4. **Context freeze** — `descriptor` + `context` strings identical pre/post; run context audit (below)
5. **Script header complete** — HTML loads every widget module the file uses (per [02 §2](../02-Architecture.md#2-loading-model))
6. **Line count reduction** — Y5 target **30–50%** (~2,300–3,200 lines); Y3/Y4 **15–30%**; Y6 **10–20%** (already lean)
7. **Manual QA** — [07 §6](../07-Roadmap-and-Migration.md#6-manual-qa-checklist-run-per-gate-no-test-tooling-exists-in-this-project) per page, 20-question session

---

## Canonical question shape (reminder)

Legacy pattern to eliminate:

```javascript
{
  type: 'some-family',
  questionText: '...',
  renderFunc: (container) => { container.innerHTML = makeSomeSvg(...) + inputs; },
  validateFunc: () => { /* DOM scrape */ },
  hintText: '...',
  solutionText: '...'
}
```

Target pattern:

```javascript
{
  descriptor: 'AC9M…',
  context: 'frozen-context-key',
  category: 'number',
  title: 'PANEL TITLE',
  prompt: 'Markdown prompt with **emphasis**.',
  widgets: [{ id: '…', type: '…', config: { … } }],
  inputs: [{ id: '…', type: 'math-field' | 'number-input' | …, config: { … } }],
  evaluate(values) { return …; },
  hint: { text: '…', highlight: ['widgetId'] },
  solution: { text: '…', show: { widgetId: targetValue } },
  points: 10
}
```

Assign descriptor/context **in the generator**, not in a post-hoc `assignDescriptorAndContext` switch — delete the switch when the last legacy family is gone.

---

## Gate G3 — context reachability audit

**Automated (preferred):** run from `Maths_Command_Station/`:

```bash
node scripts/g3-y3-context-audit.mjs
node scripts/g3-y4-context-audit.mjs
node scripts/g3-y5-context-audit.mjs
node scripts/g3-y6-context-audit.mjs
```

Each script checks static context emission in code **and** Playwright browser smoke (zero `console.error` on page load). **All four PASS as of 2026-06-13.**

**Manual spot-check (optional):** paste in DevTools on a practice page after loading `achievements-config.js`:

```javascript
// Paste after loading achievements-config + practice page
const cfg = ACHIEVEMENTS.year5; // change per page
const allContexts = new Set(
  cfg.flatMap(b => b.requirements?.contexts || [])
);
// Play 50+ questions; then:
JSON.parse(localStorage.getItem('joshua-math-profile') || '{}')
  .solvedContexts?.filter(c => [...allContexts].some(ac => c.startsWith(ac)));
```

**Done when:** every context string in `achievements-config.js` for that year appears in `solvedContexts` after a mixed practice session (or is documented as assessment-only / Phase 4).

---

## Document index

| # | File | Primary new widgets | Catalogue refs |
|---|------|---------------------|----------------|
| 01 | [year5-practice](01-year5-practice.md) | `transform-board`, `shape-measurer`, `line-graph`, probability suite | S2, M4, D2–D4, D6 |
| 02 | [year6-practice](02-year6-practice.md) | `balance-scale`, `number-track`, MathLive expansion | M5, N6, I1 |
| 03 | [year4-practice](03-year4-practice.md) | `symmetry-painter`, `protractor`, clock elapsed | S3, M2, M1 |
| 04 | [year3-practice](04-year3-practice.md) | `array-builder`, `place-value-blocks`, landmark grid | N7, N5, S1, D1, D4 |

---

## Effort shape (relative)

| Slice | Size | Status |
|-------|------|--------|
| 3a Y5 full sweep | **XL** | ✅ G3a 2026-06-13 |
| 3b Y6 gap-fill | M | ✅ G3b 2026-06-13 |
| 3c Y4 sweep | L | ✅ G3c 2026-06-13 |
| 3d Y3 sweep | M | ✅ G3d 2026-06-13 |
| Context audit + QA | S per file | ✅ automated audit PASS; manual QA deferred to Phase 6 |

**Highest leverage slice:** Y5 `reflection` + `transform-board` — deletes `makeReflectionGridSvg` (~180 lines) and the largest click-cell state machine in the codebase.

**Recommended vertical-slice order within 3a:** (1) `line-graph` statistics, (2) `coordinate-plotter` Y5 grid, (3) `transform-board`, (4) probability suite, (5) `shape-measurer`, (6) MathLive sweep for remaining `parseFraction` call sites, (7) legacy-keep tagging + dead code sweep.
