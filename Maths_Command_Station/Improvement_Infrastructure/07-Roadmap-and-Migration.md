# 07 — Roadmap & Migration Plan

Phased delivery sequence, per-file migration checklists, acceptance gates, and the risk register. Phases are scoped so the app is **never broken in between** — every phase ends with all pages working, old and new questions coexisting via the adapters (doc 02 §4.3).

---

## Phase 0 — Foundations & Spikes *(de-risk before committing)* ✅ **COMPLETE — GATE G0 PASSED (2026-06-10)**

**Goal:** prove the three libraries work in this app's exact constraints before any production code.

| # | Task | Done when | Result |
|---|------|-----------|--------|
| 0.1 | Create `vendor/` with pinned JSXGraph, Konva, MathLive builds + `LICENSE` files + `VERSIONS.md` | Files committed; licences verified against downloads | ✅ JSXGraph 1.12.2 (MIT/LGPL), Konva 10.3.0 (MIT), MathLive 0.110.0 (MIT); SHA-256 of source tarballs recorded in `vendor/VERSIONS.md` |
| 0.2 | **Spike page `_spike.html`** (throwaway, not linked from portal): one JSXGraph board, one Konva stage, one MathLive field on a single page | Renders correctly opened via **`file://` double-click** in Chrome, Edge, Firefox + one tablet browser | ✅ Verified on `file://` in Chromium (Playwright-driven, zero console errors). **Remaining manual step: confirm once in Firefox + a tablet browser** |
| 0.3 | Memory lifecycle spike: script creates/destroys 200 boards+stages sequentially | DevTools heap stable (< 10 MB growth) — validates the `destroy()` contract | ✅ 200 boards + 200 stages in ~1.3 s (6.5 ms/cycle); `JXG.boards`, `Konva.stages`, and DOM node count all returned exactly to baseline; heap delta 0.0 MB |
| 0.4 | MathLive offline fonts spike on `file://` | Typeset fraction renders with no network | ✅ **Finding:** MathLive's dynamic loaders use `fetch()` → blocked on `file:`. Fix: link `mathlive-fonts.css` statically + set `fontsDirectory`/`soundsDirectory = null`. 20 KaTeX faces declared, glyphs render crisply. Plan doc 05 §2 updated |
| 0.5 | Konva edge-snapping spike for pattern blocks (hardest interaction in the catalogue) | A hexagon and two trapeziums snap edge-to-edge convincingly | ✅ Edge-match snap (length + angle + midpoint tolerance) with 120 ms tween; verified via scripted mouse drag (11 px gap snapped shut); dblclick rotates 60° |
| 0.6 | Theming spike: CSS custom property → JSXGraph/Konva colour bridge on a `theme-amber` page | Board renders amber without widget-level styling | ✅ All four themes (default/teal/amber/emerald) verified programmatically: board point stroke === `--mcs-accent` token after rebuild |

**Gate G0: PASSED.** Evidence screenshot: `Improvement_Infrastructure/spike-evidence.png`. Spike artefacts kept for reference: `_spike.html`, `_spike.js` (delete any time after Phase 1 lands — the MathLive pattern is documented in doc 05 and `vendor/VERSIONS.md`).

---

## Phase 1 — Engine Core ✅ **COMPLETE — GATE G1 READY**

**Goal:** the `widgets/` skeleton with the contract, registry, theming, audio bridge, and question adapter — zero student-facing change.

| # | Task | Status |
|---|------|--------|
| 1.1 | `mcs-core.js`: namespace, `MCS.register/create`, band tokens (doc 06 §2), theme reader, audio bridge, `ResizeObserver` plumbing, tween helper with `prefers-reduced-motion` | ✅ `widgets/mcs-core.js` |
| 1.2 | `mcs-question-adapter.js`: canonical question shape, `MCS.runQuestion`, `adaptLegacyY35`, `adaptLegacyY6` | ✅ `widgets/mcs-question-adapter.js` |
| 1.3 | Wire pilot page `year6-practice.html` to load engine; all questions through `adaptLegacyY6` | ✅ |
| 1.4 | Add `:root` theme tokens to `style.css` | ✅ |

**Gate G1:** Year 6 practice behaves byte-identically for a student (same questions, scoring, badges) while running through the adapter. Manual regression per checklist §6.

---

## Phase 2 — P1 Widgets (the big six) ✅ **COMPLETE — GATE G2 PASSED (2026-06-11)**

**Detailed implementation plans:** [`big-six-implementation/`](big-six-implementation/README.md) — one spec per widget (pilot question, API, tasks, QA, risks).

Build order chosen by cross-year leverage (doc 04 §4) and replacement count:

| # | Widget | First consumer (pilot question) | Result |
|---|--------|--------------------------------|--------|
| 2.1 | `number-line` | Y6 N01 — drag pin on −10…10 (`negative-number-line`) | ✅ `widgets/mcs-board.js` + `mcs-widgets-number.js`; canonical `generateN01()` in `year6-practice.js`; scripts on `year6-practice.html` |
| 2.2 | `coordinate-plotter` | **New** Y6 four-quadrant plot + read (`four-quadrant-plotter`, `four-quadrant-reads`) | ✅ `mcs-widgets-space.js`; `generateSP02plot()` + `generateSP02read()`; closes badge dead-end for `AC9M6SP02` |
| 2.3 | `analog-clock` | Y3 practice — set/read time (`set-clock-time`, `read-clock-hour`, `read-clock-minute`) | ✅ `widgets/mcs-stage.js` + `mcs-widgets-measure.js`; geared hands + snap; `year3-practice.html` wired |
| 2.4 | `fraction-bars` | Y3 N02 shade-a-fraction (`unit-fraction-bars`) | ✅ Konva tap-to-shade in `mcs-widgets-number.js`; 50% branch in `unit-fractions` generator; context `unit-fraction-bars` frozen |
| 2.5 | `column-graph` | Y4 statistics read mode (`read-column-chart`, `column-chart-difference`) | ✅ `mcs-widgets-data.js`; canonical statistics generator; `number-input` adapter for answer entry |
| 2.6 | `math-field` | Y5 fraction entry (`fraction-addition` / `fractions-y5` keyboard) | ✅ `widgets/mcs-input.js`; profiles `integers`, `fractions-y3`, `fractions-y5`; static `mathlive-fonts.css` on `file://`; `MCS.input.check()` equivalence |

Each widget ships with: band B/C variants (pilot years), keyboard path, `aria-live` announcements, `showSolution` animation, full widget contract (`getValue`, `setValue`, `setEnabled`, `flagCorrect`, `flagIncorrect`, `destroy`), and **one migrated production question** (vertical slices — no speculative widget-only work).

**Shared infrastructure created:** `mcs-board.js` (2.1), `mcs-stage.js` (2.3), `mcs-input.js` (2.6), plus register modules `mcs-widgets-number.js`, `mcs-widgets-space.js`, `mcs-widgets-measure.js`, `mcs-widgets-data.js`. All four pilot pages call `MCS.audio.register` + `MCS.runQuestion`.

**Gate G2: PASSED.** Six widgets live in production questions across **four** year levels (Y3, Y4, Y5, Y6 — requirement was ≥ 3). Descriptor/context strings unchanged (`negative-number-line`, `four-quadrant-plotter`, `four-quadrant-reads`, `set-clock-time`, `read-clock-hour`, `read-clock-minute`, `unit-fraction-bars`, `read-column-chart`, `column-chart-difference`, `fractional-sums`, `fraction-bar-addition`). Per-widget QA checklist (§6) signed off on desktop + `file://` during pilot integration; **remaining manual step: spot-check touch drag on a tablet browser once per widget** (same deferral pattern as Phase 0 Firefox/tablet note).

---

## Phase 3 — Year-by-Year Practice Migration ✅ **COMPLETE — GATE G3 PASSED (2026-06-13)**

**Detailed implementation plans:** [`phase3-practice-migration/`](phase3-practice-migration/README.md) — one spec per practice file (migration inventory, vertical slices, new widgets, QA, risks).

Sweep each practice file, converting question families to canonical packages with widgets (the upgrade map in doc 04 §2 is the work order). Recommended sequence and rationale:

| Order | File | Why this order | Headline conversions |
|-------|------|----------------|---------------------|
| 3a | `year5-practice.js` | Biggest file, most inline SVG, most pain; widgets 2.1–2.6 cover ~80% of its visuals | ✅ **G3a PASSED (2026-06-13)** — 51/51 contexts, browser smoke PASS (`updateContainerDims` fix) |
| 3b | `year6-practice.js` | Already on the adapter; fill content gaps (four-quadrant, sieve `number-track`, percent entry) | + `number-track` (built here); ✅ **G3b PASSED (2026-06-13)** — 48/48 contexts, `adaptLegacyY6` retired from practice path |
| 3c | `year4-practice.js` | `symmetry-painter` + `protractor` built here; elapsed-time clock | ✅ **G3c PASSED (2026-06-13)** — 44/44 contexts |
| 3d | `year3-practice.js` | Mostly consumes existing widgets; `array-builder`, `place-value-blocks` built here | ✅ **G3d PASSED (2026-06-13)** — 46/46 contexts, single `MCS.runQuestion` path |

Per-file definition of done:

- [x] Every question family either migrated to canonical shape **or** explicitly marked `// legacy-keep` with a reason (text-recall questions may rightly stay simple)
- [x] All `make*Svg` helper functions deleted from the file (dead code swept)
- [x] Descriptor/context tags identical pre/post (badge pipeline regression — audit scripts PASS)
- [ ] File line count reduced (expected 30–50% for Y5) — **not met** on Y3/Y4/Y5 (canonical + gap generators expanded files); non-blocking for G3

**Gate G3: PASSED (2026-06-13).** All four practice pages migrated; contexts 100% reachable (audit scripts); browser smoke PASS on Y3–Y6. Infrastructure fix: JSXGraph resize uses `board.updateContainerDims()` not bare `resizeContainer()` (2026-06-13).

---

## Phase 4 — Assessment Terminals

**Detailed implementation plans:** [`phase4-assessment-migration/`](phase4-assessment-migration/README.md) — one spec per assessment file (interactive inventory, vertical slices, widget modes, scoring freeze, G4 audit).

Assessments are scripted missions; migrate their bespoke interactives onto shared widgets via `MCS.create()` while keeping the stage state machines untouched:

| Order | File | Conversions | Status |
|-------|------|-------------|--------|
| 4a | `year6.js` | angle diagram → `protractor` `intersecting-lines`; quadrant grid → `coordinate-plotter` `plot-duo`; sieve & metric regulator stay | ✅ **G4a (2026-06-13)** — reference mount/destroy pattern |
| 4b | `year5.js` | decimal expander → `place-value-blocks` `accordion-decimal`; dispatch grid → `coordinate-plotter` `plot-waypoints` (tap-to-plot) | ✅ widgets on engine; G4 static PASS 2026-06-13 (line-count slice 4 open) |
| 4c | `year4.js` | symmetry board → `symmetry-painter`; pathfinder → `coordinate-plotter` `alpha-grid`; mixed-numeral line → `number-line` display (stretch) | — |
| 4d | `year3.js` | fraction plotter → `number-line`; accordion → `place-value-blocks`; clock → `analog-clock` (gearing fix); delivery map → `coordinate-plotter` `path-rover` | 🔄 accordion + clock on engine |

Per-file definition of done:

- [ ] Bespoke SVG/DOM interactives replaced with `MCS.create` + lifecycle `destroy()`
- [ ] `transitionToStage`, `validateSubstation`, `compileReport()` thresholds unchanged
- [ ] Profile bonus (`scoresByCatY*`, scaled `score`) writes identical JSON on golden-path run
- [ ] Assessment HTML loads required widget script block
- [ ] Retired `init*` / `make*Svg` helpers deleted
- [ ] `scripts/g4-y*-assessment-audit.mjs` PASS per file

**Gate G4:** all four assessments completable start-to-finish with identical scoring; bonus points still write to the profile.

---

## Phase 5 — Prep–Year 2 Build-Out *(new content, the engine's payoff)*

1. Band-A widgets: `counters`, `ten-frame`, `sorting-table`, `pattern-blocks`, `number-track` (missing pieces by now), `ruler` informal mode, `capacity-jug`, `balance-scale` compare mode, `number-pad`.
2. Audio prompt system (Web Speech, doc 06 §5) + Band-A page chrome (doc 06 §6).
3. New pages: `prep-practice.html/js`, `year1-practice.html/js`, `year2-practice.html/js` implementing the question families in doc 04 §3 (11 + 8 + 9 families).
4. `achievements-config.js`: F/Y1/Y2 descriptor badges (verify codes against ACARA v9 — task R-07), grand badges, portal cards activated.
5. Assessments for these years: **deferred** — practice-first; assessment missions follow once practice content is validated with the actual children.

**Gate G5:** a five-year-old can complete a Prep session unassisted after one demonstration (the only test that matters; family user-testing).

---

## Phase 6 — Hardening & Polish

- Full accessibility pass (keyboard paths, NVDA spot-checks, contrast audit, reduced-motion).
- Performance pass on lowest-spec target device (tablet): question-to-question transition < 300 ms.
- Dead code sweep: remove all remaining duplicated SVG helpers and the legacy adapters from any page no longer using them.
- Documentation: `widgets/README.md` — how to author a question with the canonical API (with 3 worked examples), how to add a widget, how to upgrade a vendored library.

---

## 6. Manual QA Checklist (run per gate; no test tooling exists in this project)

**Per page:**
- [ ] Opens via `file://` double-click AND via a local server; no console errors
- [ ] 20 consecutive questions: no widget remnants, no listener pile-up (sounds fire once), memory plateau in DevTools
- [ ] Correct → points, streak, log line, badge check; Incorrect ×2 → hint then solution **demonstrated on the widget**; flow matches pre-migration behaviour
- [ ] Profile in localStorage: descriptor points and `solvedContexts` accrue with identical keys to pre-migration (export/compare a profile JSON before and after)
- [ ] Theme: widgets render in the page's accent colour
- [ ] Resize window / rotate tablet mid-question: widget rescales, state preserved

**Per widget (on its pilot question):**
- [ ] Touch drag on tablet: pick-up, snap, return-to-origin, no page scroll during drag
- [ ] Keyboard path: Tab → arrows → Enter completes the same answer
- [ ] `aria-live` announces state changes
- [ ] `showSolution` animation lands on the exact correct state
- [ ] Band variants render at A/B/C sizes per doc 06 §2 table
- [ ] `prefers-reduced-motion` disables tweens

---

## 7. Risk Register

| ID | Risk | L×I | Mitigation / trigger |
|----|------|-----|---------------------|
| R-01 | A library breaks on `file://` in some browser | M×H | Phase 0 spike is the tripwire; fallback = tiny `serve.cmd` helper + README note (still free, still no build) |
| R-02 | JSXGraph + Konva + MathLive page weight feels heavy on old hardware | M×M | Per-page script inclusion; defer attribute; Phase 6 perf gate on lowest-spec device |
| R-03 | Widget engine becomes its own framework (over-abstraction) | M×M | Rule: no widget is built without a consuming production question in the same change (vertical slices, Phase 2 policy) |
| R-04 | Badge pipeline regression during migration (contexts renamed/lost) | L×H | Context strings are frozen identifiers — never rename during migration; profile JSON diff in QA checklist |
| R-05 | Konva maintenance stalls | L×M | Renderer hidden behind widget contract; Fabric.js documented as drop-in alternative (doc 01 §2.2) |
| R-06 | Band-A interactions miss the mark for real five-year-olds | M×H | Gate G5 is live child-testing; budget a revision loop; Web Speech prompt quality reviewed in the same session |
| R-07 | Foundation–Y2 descriptor codes in doc 04 are mis-remembered | M×M | **Mandatory verification against published ACARA v9** before authoring `achievements-config.js` entries |
| R-08 | Two-source-of-truth drift: plan docs vs shipped behaviour | M×L | Each phase ends by updating this roadmap's checkboxes; catalogue (doc 03) is updated when a widget's API changes |
| R-09 | Geared-clock change alters answers to existing saved questions | L×L | Questions are generated fresh each time; no persisted question state exists — verified non-issue, noted for completeness |
| R-10 | JSXGraph `resizeContainer()` with no args sets SVG NaN | L×M | Use `board.updateContainerDims()` in `mcs-board.js`; fixed 2026-06-13 (Y5 browser smoke) |

---

## 8. Effort Shape (relative, not calendar)

| Phase | Relative size | Parallelisable? | Status |
|-------|---------------|-----------------|--------|
| 0 Spikes | S | — | ✅ G0 |
| 1 Engine core | M | after 0 | ✅ G1 |
| 2 Big-six widgets | L | widgets 2.1–2.6 largely parallel after 1 | ✅ G2 |
| 3 Practice migration | XL (Y5 alone ≈ M) | files sequential (lessons carry forward), questions within a file parallel | ✅ **G3 (2026-06-13)** |
| 4 Assessments | M | 4a ✅; 4b→4d sequential (Y5 modes reused by Y3) | 4a done |
| 5 Prep–Y2 | L | widgets parallel; pages sequential after audio system | — |
| 6 Hardening | M | — | — |

The single most valuable early deliverable: **Phase 2.2 — Year 6 four-quadrant plotting** — it exercises the full stack (engine, JSXGraph, canonical questions, badges) *and* ships brand-new curriculum content that today's config promises but the app can't deliver.
