# 3b — `year6-practice.js` Migration Plan

**File:** `year6-practice.js` (~1,376 lines) · `year6-practice.html`  
**Theme:** Band C · emerald  
**Upgrade map:** [04 §Year 6](../04-Year-Level-Matrix.md#year-6-band-c--emerald-theme)  
**Gate slice:** G3b — Y6 contexts 100% reachable; retire `adaptLegacyY6` from practice path

---

## 1. Goal & success criteria

Y6 practice already routes **all** questions through `MCS.runQuestion` (Phase 1.3). Phase 3 **replaces legacy HTML generators** with canonical widget packages and closes remaining badge gaps.

**Done when:**

- [ ] Zero generators return `html` + `validate` — all use `widgets` / `inputs` + `evaluate`
- [ ] `MCS.adaptLegacyY6` unused by practice page (may remain for assessments until Phase 4)
- [ ] Context `cartesian-four-quadrants` live (companion to `negative-number-line`)
- [ ] `number-track` sieve mode reachable for prime/composite strand
- [ ] Fraction, percent, and algebra questions use `math-field` where text input is fragile
- [ ] Per-page QA checklist (07 §6) passed

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
| `generateN01` | AC9M6N01 | `negative-number-line` | ✅ widget | Extend: add `cartesian-four-quadrants` variant on same line (read two points?) |
| `generateN02` | AC9M6N02 | `prime-composite-sort` | Radio MCQ | **legacy-keep** radios + **`number-track`** sieve shading mode for alternate generator |
| `generateN05` | AC9M6N05 | `fraction-add-sub-sums` | num/den inputs | `math-field` (`fractions-y5`) |
| `generateN07` | AC9M6N07 | `percentage-discount` | number input | `math-field` (percent profile) or `number-input` |
| `generateA02` | AC9M6A02 | `order-operations-brackets` | number input | **legacy-keep** (BODMAS recall) |
| `generateM01` | AC9M6M01 | `metric-slider-length` | number input | **legacy-keep**; stretch: `place-value-blocks` decimal-shift |
| `generateM04` | AC9M6M04 | `opposite-angle-solver` | number input | **legacy-keep**; stretch: `protractor` from 3c |
| `generateSP02plot/read` | AC9M6SP02 | four-quadrant contexts | ✅ widget | — |
| `generateST01` | AC9M6ST01 | `range-comparisons`, etc. | MCQ text | **legacy-keep** or `line-graph`/`column-graph` if data provided |
| `generateP01` | AC9M6P01 | `chance-percentage-slider` | number input | `math-field` + optional `spinner` from 3a |

### Missing badge contexts to close

| Context | Config reference | Action |
|---------|------------------|--------|
| `cartesian-four-quadrants` | AC9M6N01 badge pair | New generator: plot **two** points or read distance on four-quadrant plane |
| `equivalence-fraction-check`, `number-line-position` | AC9M6N04 | `number-line` fraction mode + `math-field` |
| `factor-tree-check` | AC9M6N02 | **legacy-keep** or net-new factor tree UI (low priority) |
| `large-trial-spinner`, `frequency-comparison` | AC9M6P02 | Reuse `spinner` from 3a |

---

## 3. New widgets — build specs (Phase 3b)

### 3.1 `balance-scale` (`mcs-widgets-measure.js` **new**)

| Field | Pilot: algebra unknown scaffold |
|-------|-----------------------------------|
| `mode` | `solve-unknown` — one bag *x*, known masses on other pan |
| `use` | Hint scaffold on `generateA02` second attempt (optional); standalone practice stretch |
| `band` | C |

Not required for **legacy-keep** BODMAS — ship widget for future algebra descriptors.

### 3.2 `number-track` (`mcs-widgets-number.js` **new**)

| Field | Pilot: prime sieve |
|-------|-------------------|
| `mode` | `sieve-shade` — tap to shade multiples; answer which numbers remain prime |
| `context` | `prime-composite-sort` (alternate to radio generator) |
| `band` | C |

Mirrors assessment sieve interaction (`year6.js`) — re-platform on engine.

### 3.3 MathLive expansion

- `generateN05` → single `math-field`, `MCS.input.check` with `form: 'simplest'`
- `generateP01` → percent entry via `math-field` keyboard `integers`

---

## 4. Implementation tasks (vertical slices)

### Slice 1 — MathLive fraction & percent

- [ ] Add `mcs-input.js` + MathLive CSS to `year6-practice.html` (if not present)
- [ ] Migrate `generateN05` to canonical + `math-field`
- [ ] Migrate `generateN07`, `generateP01` to `math-field` or `number-input`
- [ ] Contexts frozen: `fraction-add-sub-sums`, `percentage-discount`, `chance-percentage-slider`

### Slice 2 — Number track / cartesian companion

- [ ] Implement `number-track` `sieve-shade` mode
- [ ] Add alternate `generateN02sieve()` or extend N02 with 50% branch
- [ ] Add `generateN01cartesian()` for `cartesian-four-quadrants` — two-point read or plot on existing `coordinate-plotter`
- [ ] Register in `questions.number` array

### Slice 3 — Balance scale (optional stretch)

- [ ] Implement `balance-scale` `solve-unknown`
- [ ] Wire as hint highlight on hardest algebra questions

### Slice 4 — Statistics / probability reuse

- [ ] Import `spinner` from 3a; add `generateP02()` for `large-trial-spinner`
- [ ] Tag `generateST01` **legacy-keep** if MCQ-only

### Slice 5 — Cleanup

- [ ] Remove `adaptLegacyY6` call from `loadNextQuestion` — generators are native canonical
- [ ] Delete dead HTML template strings
- [ ] Run G3 context audit for Y6

---

## 5. Page script wiring (target)

Current block has JSXGraph + number + space. Add for Phase 3b complete:

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

---

## 7. Risks & mitigations

| Risk | Mitigation |
|------|------------|
| `adaptLegacyY6` removal breaks edge generators | Migrate one generator at a time; grep for `html:` after each slice |
| Sieve mode duplicates assessment | Share `number-track` widget; assessment migrates Phase 4 |
| MathLive on emerald theme contrast | Reuse Phase 2.6 theme tokens |

---

## 8. Files touched (expected)

| File | Action |
|------|--------|
| `widgets/mcs-widgets-number.js` | Add `number-track` |
| `widgets/mcs-widgets-measure.js` | Add `balance-scale` |
| `widgets/mcs-question-adapter.js` | Trim `adaptLegacyY6` when unused |
| `year6-practice.js` | Migrate ~6 generators |
| `year6-practice.html` | Add MathLive + Konva scripts |

---

## 9. Relative effort

**M** — 2–4 sessions. Lowest line-count file; highest value is closing dead badge contexts.
