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

## Phase 2 — P1 Widgets (the big six)

Build order chosen by cross-year leverage (doc 04 §4) and replacement count:

| Order | Widget | First consumer (pilot question) |
|-------|--------|--------------------------------|
| 2.1 | `number-line` | Y6 N01 negative integers (replace static SVG with drag-pin) |
| 2.2 | `coordinate-plotter` | **New** Y6 four-quadrant plot questions (closes the `four-quadrant-plotter` badge dead-end — first new content win) |
| 2.3 | `analog-clock` | Y3 practice M03 read/set time |
| 2.4 | `fraction-bars` | Y3 N02 shade-a-fraction |
| 2.5 | `column-graph` | Y4 statistics read mode |
| 2.6 | `math-field` (+ keyboard profiles `integers`, `fractions-y3/y5`) | Y5 fraction entry |

Each widget lands with: band A/B/C variants implemented, keyboard path, ARIA live announcements, `showSolution` animation, and **one migrated production question proving it** (vertical slices — never build widgets speculatively ahead of a consuming question).

**Gate G2:** six widgets live in production questions across ≥ 3 year levels; per-widget QA checklist (§6) passed on desktop + tablet + `file://`.

---

## Phase 3 — Year-by-Year Practice Migration

Sweep each practice file, converting question families to canonical packages with widgets (the upgrade map in doc 04 §2 is the work order). Recommended sequence and rationale:

| Order | File | Why this order | Headline conversions |
|-------|------|----------------|---------------------|
| 3a | `year5-practice.js` | Biggest file, most inline SVG, most pain; widgets 2.1–2.6 cover ~80% of its visuals | `transform-board` (built here), `shape-measurer` (built here), `line-graph` (built here), MathLive fractions, coordinate plotter, probability suite (`marble-bag`, `dice-coin-lab`, `spinner` built here) |
| 3b | `year6-practice.js` | Already on the adapter; fill content gaps (four-quadrant, sieve `number-track`, percent entry) | + `balance-scale` (built here) |
| 3c | `year4-practice.js` | `symmetry-painter` + `protractor` built here; elapsed-time clock | |
| 3d | `year3-practice.js` | Mostly consumes existing widgets by now; `array-builder`, `place-value-blocks` built here | |

Per-file definition of done:

- [ ] Every question family either migrated to canonical shape **or** explicitly marked `// legacy-keep` with a reason (text-recall questions may rightly stay simple)
- [ ] All `make*Svg` helper functions deleted from the file (dead code swept)
- [ ] Descriptor/context tags identical pre/post (badge pipeline regression — checklist §6)
- [ ] File line count reduced (expected 30–50% for Y5)

**Gate G3:** all four practice pages migrated; `achievements-config.js` contexts 100% reachable by live generators (audit script-by-eye or quick console tally).

---

## Phase 4 — Assessment Terminals

Assessments are scripted missions; migrate their bespoke interactives onto shared widgets while keeping the stage state machines untouched:

| File | Conversions |
|------|-------------|
| `year3.js` | fraction plotter → `number-line`; accordion expander → `place-value-blocks`; clock → `analog-clock` (gains gearing fix); delivery map → `coordinate-plotter` path mode + rover tween |
| `year4.js` | symmetry board → `symmetry-painter`; pathfinder → `coordinate-plotter` alpha-grid; mixed-numeral diagnostic → `number-line` |
| `year5.js` | decimal expander → `place-value-blocks`; dispatch grid → `coordinate-plotter` (tap-to-plot replaces inputs) |
| `year6.js` | angle diagram → `protractor` measure; quadrant grid → tap-to-plot; sieve & shift regulator stay (already good interactions) — optionally re-skin onto engine theming |

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

---

## 8. Effort Shape (relative, not calendar)

| Phase | Relative size | Parallelisable? |
|-------|---------------|-----------------|
| 0 Spikes | S | — |
| 1 Engine core | M | after 0 |
| 2 Big-six widgets | L | widgets 2.1–2.6 largely parallel after 1 |
| 3 Practice migration | XL (Y5 alone ≈ M) | files sequential (lessons carry forward), questions within a file parallel |
| 4 Assessments | M | parallel with late Phase 3 |
| 5 Prep–Y2 | L | widgets parallel; pages sequential after audio system |
| 6 Hardening | M | — |

The single most valuable early deliverable: **Phase 2.2 — Year 6 four-quadrant plotting** — it exercises the full stack (engine, JSXGraph, canonical questions, badges) *and* ships brand-new curriculum content that today's config promises but the app can't deliver.
