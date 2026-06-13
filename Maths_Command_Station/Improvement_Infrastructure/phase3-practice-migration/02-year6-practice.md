# 3b — `year6-practice.js` Migration Plan

**File:** `year6-practice.js` (~2,521 lines, was ~1,376) · `year6-practice.html`  
**Theme:** Band C · emerald  
**Upgrade map:** [04 §Year 6](../04-Year-Level-Matrix.md#year-6-band-c--emerald-theme)  
**Gate slice:** G3b — Y6 contexts 100% reachable; retire `adaptLegacyY6` from practice path  
**Status:** ✅ **G3b SIGNED OFF (2026-06-13)** — static context audit + browser smoke PASS

---

## 1. Goal & success criteria

Y6 practice already routes **all** questions through `MCS.runQuestion` (Phase 1.3). Phase 3 **replaces legacy HTML generators** with canonical widget packages and closes remaining badge gaps.

**Done when:**

- [x] Zero generators return `html` + `validate` — all use `widgets` / `inputs` + `evaluate`
- [x] `MCS.adaptLegacyY6` unused by practice page (may remain in adapter module for assessments until Phase 4)
- [x] Context `cartesian-four-quadrants` live (companion to `negative-number-line`)
- [x] `number-track` sieve mode reachable for prime/composite strand
- [x] Fraction and probability questions use `math-field` where text input is fragile (`generateN05`, `generateP01`, `fraction-decimal-probability`)
- [x] All 48 Y6 badge contexts reachable — `scripts/g3-y6-context-audit.mjs` static PASS (2026-06-13)
- [ ] Per-page QA checklist (07 §6) passed — browser smoke PASS; **20-question manual session + tablet touch spot-check deferred** (same pattern as G3a)

**Already canonical (Phase 2 — do not regress):**

| Generator | Widget | Context |
|-----------|--------|---------|
| `generateN01` | `number-line` | `negative-number-line` |
| `generateSP02plot` | `coordinate-plotter` | `four-quadrant-plotter` |
| `generateSP02read` | `coordinate-plotter` + `coordinate-pair` | `four-quadrant-reads` |

---

## 2. Current state inventory

| Generator | Descriptor | Context(s) | Current | Migration target |
|-----------|------------|------------|---------|------------------|
| `generateN01` | AC9M6N01 | `negative-number-line` | ✅ widget | — |
| `generateN01cartesian` | AC9M6N01 | `cartesian-four-quadrants` | ✅ widget | — |
| `generateN02` | AC9M6N02 | `prime-composite-sort` | ✅ legacy-keep select | — |
| `generateN02Sieve` | AC9M6N02 | `prime-composite-sort` | ✅ `number-track` | — |
| `generateN05` | AC9M6N05 | `fraction-add-sub-sums` | ✅ `math-field` | — |
| `generateN07` | AC9M6N07 | `percentage-discount` | ✅ `number-input` | — |
| `generateA02` | AC9M6A02 | `order-operations-brackets` | ✅ legacy-keep | — |
| `generateM01` | AC9M6M01 | `metric-slider-length` | ✅ legacy-keep | stretch: `place-value-blocks` |
| `generateM04` | AC9M6M04 | `opposite-angle-solver` | ✅ legacy-keep | stretch: `protractor` from 3c |
| `generateSP02plot/read` | AC9M6SP02 | four-quadrant contexts | ✅ widget | — |
| `generateST01` | AC9M6ST01 | `range-comparisons` | ✅ legacy-keep | stretch: `line-graph`/`column-graph` |
| `generateP01` | AC9M6P01 | `chance-percentage-slider` | ✅ `math-field` | — |
| `generateP02LargeTrial` / `generateP02FrequencyCompare` | AC9M6P02 | spinner contexts | ✅ `spinner` widget | — |
| `gapGenerators` (34) | various | remaining badge contexts | ✅ legacy-keep recall | — |

### Badge context coverage

All 48 contexts in `achievements-config.js` for Year 6 are emitted by at least one generator in `year6-practice.js`. Secondary contexts use **legacy-keep** recall generators (`makeLegacyNumeric` / `makeLegacyChoice` / `makeLegacyMathField` helpers) — same policy as Y5 gap-fill.

---

## 3. New widgets — build specs (Phase 3b)

### 3.1 `balance-scale` (`mcs-widgets-measure.js` **new**)

| Field | Pilot: algebra unknown scaffold |
|-------|-----------------------------------|
| `mode` | `solve-unknown` — one bag *x*, known masses on other pan |
| `use` | Hint scaffold on `generateA02` second attempt (optional); standalone practice stretch |
| `band` | C |

**Deferred** — not required for G3b sign-off (optional stretch).

### 3.2 `number-track` (`mcs-widgets-number.js` **new**) ✅

| Field | Pilot: prime sieve |
|-------|-------------------|
| `mode` | `sieve-shade` — tap to shade multiples |
| `context` | `prime-composite-sort` (alternate to radio generator) |
| `band` | C |

### 3.3 MathLive expansion ✅

- `generateN05` → single `math-field`, `MCS.input.check` with `form: 'simplest'`
- `generateP01` → percent entry via `math-field` keyboard `integers`
- `fraction-decimal-probability` gap generator → `math-field`

---

## 4. Implementation tasks (vertical slices)

### Slice 1 — MathLive fraction & percent ✅

- [x] Add `mcs-input.js` + MathLive CSS to `year6-practice.html`
- [x] Migrate `generateN05` to canonical + `math-field`
- [x] Migrate `generateN07` to `number-input`; `generateP01` to `math-field`
- [x] Contexts frozen: `fraction-add-sub-sums`, `percentage-discount`, `chance-percentage-slider`

### Slice 2 — Number track / cartesian companion ✅

- [x] Implement `number-track` `sieve-shade` mode
- [x] Add `generateN02Sieve()` alternate generator
- [x] Add `generateN01cartesian()` for `cartesian-four-quadrants`
- [x] Register in `questions.number` array

### Slice 3 — Balance scale (optional stretch)

- [ ] Implement `balance-scale` `solve-unknown` — **deferred**

### Slice 4 — Statistics / probability reuse ✅

- [x] Import `spinner` from 3a; add `generateP02LargeTrial()` + `generateP02FrequencyCompare()`
- [x] Tag `generateST01` **legacy-keep**; gap generators for `distribution-match`, ST02/ST03 contexts

### Slice 5 — Cleanup & audit ✅

- [x] `loadNextQuestion` uses `MCS.runQuestion` directly — no `adaptLegacyY6` call
- [x] No dead `html:` / `renderFunc` generators remain
- [x] G3 context audit — `scripts/g3-y6-context-audit.mjs` PASS (2026-06-13)
- [x] 34 legacy-keep gap generators for remaining badge contexts

---

## 5. Page script wiring (target) ✅

```html
<script defer src="vendor/konva/konva.min.js"></script>
<script defer src="vendor/mathlive/mathlive.min.js"></script>
<link rel="stylesheet" href="vendor/mathlive/mathlive-fonts.css">
<script defer src="widgets/mcs-stage.js"></script>
<script defer src="widgets/mcs-input.js"></script>
<script defer src="widgets/mcs-widgets-measure.js"></script>
<script defer src="widgets/mcs-widgets-data.js"></script>  <!-- spinner reuse -->
```

---

## 6. legacy-keep rationale

| Generator | Reason |
|-----------|--------|
| `generateA02` | BODMAS — single numeric answer, no manipulative |
| `generateM01` | Metric conversion — symbolic |
| `generateM04` | Angle fact recall — opposite angles equal |
| `generateST01` | Text interpretation MCQ |
| `generateN02` (radio variant) | Classification recall — keep alongside sieve variant |
| `gapGenerators` (34) | Text/symbolic recall — no widget benefit in Phase 3 scope; closes badge dead-ends |

---

## 7. Risks & mitigations

| Risk | Mitigation |
|------|------------|
| `adaptLegacyY6` removal breaks edge generators | ✅ All generators native canonical; grep confirms zero `html:` |
| Sieve mode duplicates assessment | Share `number-track` widget; assessment migrates Phase 4 |
| MathLive on emerald theme contrast | Reuse Phase 2.6 theme tokens |
| Line count increased vs baseline | Expected — gap generators add ~1,100 lines; line-reduction target waived for Y6 when closing 48/48 contexts |

---

## 8. Files touched (expected)

| File | Action |
|------|--------|
| `widgets/mcs-widgets-number.js` | ✅ Add `number-track` |
| `widgets/mcs-widgets-measure.js` | `balance-scale` deferred |
| `widgets/mcs-question-adapter.js` | `adaptLegacyY6` retained (unused by practice) |
| `year6-practice.js` | ✅ Migrated + 34 gap generators |
| `year6-practice.html` | ✅ MathLive + Konva + data widgets |
| `scripts/g3-y6-context-audit.mjs` | ✅ Static + browser smoke audit |

---

## 9. Relative effort

**M** — 2–4 sessions. **Actual:** widget slices + gap-fill audit closed all 48 contexts. Optional `balance-scale` and line-count reduction remain for Phase 6 polish.
