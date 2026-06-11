# 2.6 — `math-field` Implementation Plan

**Widget ID:** `math-field`  
**Module:** `widgets/mcs-input.js`  
**Library:** MathLive (vendored 0.110.0)  
**Spec:** [05-MathLive-Integration.md](../05-MathLive-Integration.md)  
**Pilot:** Year 5 practice — fraction entry on `fraction-addition` generator (~1545–1620)

---

## 1. Goal & success criteria

Replace the three-box mixed-numeral input (`frac-add-whole`, `frac-add-num`, `frac-add-den`) with a single MathLive field using the `fractions-y5` keyboard profile. Eliminate fragile manual parsing for the **answer** portion while keeping the question's visual fraction display.

**Done when:**

- [ ] `MCS.create('math-field', …)` returns `{ latex, value, mathjson }` via `getValue()`
- [ ] `MCS.input.check()` validates equivalence with `form: 'any'` (and `'simplest'` spot-check)
- [ ] `fraction-addition` generator uses canonical `inputs: [{ id: 'ans', type: 'math-field', … }]`
- [ ] Works on `file://` with static `mathlive-fonts.css` (Phase 0 pattern)
- [ ] Keyboard profiles `integers`, `fractions-y3`, `fractions-y5` registered (pilot uses `fractions-y5`; others stubbed for Phase 3)
- [ ] Per-widget QA checklist passed

**Deferred:** Full Y5 `parseFraction` sweep (Phase 3a); Compute Engine vendoring decision (Phase 3 gate); `percent`, `algebra-y6`, `decimals` profiles.

---

## 2. Pilot question design

### Legacy pain (`year5-practice.js`)

```javascript
// validateFunc parses three separate number inputs into one rational
const whole = …; const num = …; const den = …;
const userVal = whole + num / den;
return Math.abs(userVal - correctVal) < 0.001;
```

Problems: empty whole handling ambiguous; no simplest-form feedback; cannot accept `11/12` typed as single fraction.

### Canonical target

| Field | Value |
|-------|-------|
| `descriptor` | `AC9M5N05` |
| `context` | `fractional-sums` or `fraction-bar-addition` (preserve random mapping) |
| `category` | `number` |
| `band` | `C` |

**Presentation:** keep stacked fraction display for the two addends (DOM or static); only the **answer** becomes MathLive.

**Inputs:**

```javascript
inputs: [{
  id: 'ans',
  type: 'math-field',
  config: {
    band: 'C',
    keyboard: 'fractions-y5',
    expect: 'fraction',
    placeholder: '\\frac{?}{?}',  // or mixed numeral ghost
  }
}]
```

**Evaluate:**

```javascript
evaluate(v) {
  return MCS.input.check(v.ans, {
    equals: correctVal,          // numeric target
    form: 'any',
    tolerance: 1e-9
  });
}
```

Where `correctVal` is the existing `numA/denA ± numB/denB` numeric result.

**Solution text:** unchanged worked solution; `show` does not animate MathLive (optional: `setValue` with LaTeX of answer).

**Empty submit:** must **not** consume an attempt — shake field, "Finish your answer" (05 §5.4).

---

## 3. Prerequisites — `mcs-input.js`

### MathLive init (once per page)

```html
<link rel="stylesheet" href="vendor/mathlive/mathlive-fonts.css">
<script defer src="vendor/mathlive/mathlive.min.js"></script>
<script defer src="widgets/mcs-input.js"></script>
```

```javascript
MathLive.MathfieldElement.fontsDirectory = null;
MathLive.MathfieldElement.soundsDirectory = null;
```

### Widget wrapper responsibilities (05 §3)

1. Create `<math-field>` with child-safe options (`smartFence`, no LaTeX source mode)
2. `virtualKeyboardPolicy`: `'onfocus'` on touch; manual toggle on desktop
3. `virtualKeyboardContainer`: dock inside answer card (avoid viewport overlap)
4. Theme CSS variables from `MCS.theme()`
5. Disable paste
6. `getValue()` normalisation

### `MCS.input.check(value, spec)` (05 §5)

**Phase 2 minimum** — first-party fallback evaluator (no Compute Engine required yet):

| `form` | Logic |
|--------|-------|
| `'any'` | Compare `value.value` numeric to `spec.equals` within `tolerance` |
| `'simplest'` | Numeric match + `gcd(num,den)===1` from parsed MathJSON/LaTeX |
| `'exact-latex'` | Normalised LaTeX string compare |

Parse LaTeX fractions `\frac{a}{b}`, mixed numerals `a\frac{b}{c}`, integers, negatives.

**Wrong form feedback:** if numeric match but not simplest when `form:'simplest'`, targeted hint via adapter.

---

## 4. Keyboard profiles (Phase 2 deliverables)

Register in `mcs-input.js` per 05 §4:

| Profile | Keys | Phase 2 status |
|---------|------|----------------|
| `integers` | 0–9, ⌫, −, ✓ | ✅ Register (used in Y6 reads if 2.2 ships first) |
| `fractions-y3` | 0–9, ⌫, a/b, ✓ | ✅ Register (stub tests) |
| `fractions-y5` | y3 + mixed, ., − | ✅ **Pilot** |
| `decimals` | — | Stub |
| `percent` | — | Phase 3 |
| `algebra-y6` | — | Phase 3 |

**Layout rules:** no QWERTY; key caps ≥ 48 px Band C; JetBrains Mono digits.

---

## 5. Widget contract

### `getValue()` → `{ latex, value, mathjson }`

- `value`: primary numeric for `evaluate` shortcuts
- `mathjson`: optional for structure checks

### `setValue({ latex })` / `showSolution`

Insert LaTeX; typeset without focus steal.

### `setEnabled(bool)`

Sets `math-field.readOnly` + disables virtual keyboard.

### `onChange`

Subscribe to `input` event on math-field.

### `flagCorrect` / `flagIncorrect`

CSS class pulse on wrapper; incorrect + wrong-form class for hint routing.

### `destroy()`

Remove element; disconnect listeners; `MCS._releaseContainer`.

### Accessibility

- MathLive native MathML + ARIA
- Verify fraction speakable in NVDA spot-check (Phase 6 full pass)

---

## 6. Implementation tasks

### Step 1 — MathLive bootstrap

- [ ] `mcs-input.js` IIFE with `typeof MathLive === 'undefined'` guard
- [ ] One-time `MathfieldElement` defaults (fonts/sounds null)
- [ ] Theme variable mapping on create

### Step 2 — Profile registry

- [ ] `MCS.input.registerKeyboard('fractions-y5', layoutDef)`
- [ ] Apply profile via `mathVirtualKeyboardPolicy` / `customVirtualKeyboard` API per MathLive 0.110 docs
- [ ] Register `integers`, `fractions-y3` layouts (copy y5 structure, fewer keys)

### Step 3 — `math-field` widget

- [ ] `MCS.register('math-field', factory)`
- [ ] Full contract
- [ ] Paste blocked
- [ ] Empty guard integrated with question runner (don't call `evaluate` as failure)

### Step 4 — `MCS.input.check` fallback evaluator

- [ ] LaTeX → `{ num, den, value }` parser for fractions, mixed, integers
- [ ] `gcd` for simplest form
- [ ] Unit tests via manual `_debugSet` + console (no test framework in project)

### Step 5 — Y5 pilot migration

- [ ] `year5-practice.html` — MathLive CSS + scripts
- [ ] Wire `MCS.runQuestion`
- [ ] Migrate **one** `fraction-addition` generator to canonical shape
- [ ] Leave other `parseFraction` call sites untouched (Phase 3a)
- [ ] `MCS.audio.register` on page load

### Step 6 — QA

- [ ] Typeset `3/4` via keyboard — renders offline on `file://`
- [ ] Accept `6/8` when `form:'any'` and target 0.75
- [ ] Reject empty submit without burning attempt
- [ ] Virtual keyboard fits inside answer panel on tablet landscape
- [ ] Hardware typing `3/4` converts via inline shortcut
- [ ] 20 questions — math-field destroyed each time, no duplicate custom elements

---

## 7. Integration with question runner

Extend `mcs-question-adapter.js` if needed:

- [ ] `inputs` array creates widgets in answer mount region (below prompt, beside widgets)
- [ ] `session.collect()` returns `{ ans: mathField.getValue(), …widgets }`
- [ ] `setEnabled(false)` on all inputs + widgets after submit
- [ ] `solution.show.ans` → `mathField.setValue({ latex: '…' })`

---

## 8. Band variants

| Band | Keyboard | Notes |
|------|----------|-------|
| A | **none** — use `number-pad` widget | MathLive not for Prep (05 §4) |
| B | `fractions-y3` | Large keys, unit fractions |
| C | `fractions-y5` (pilot) | Mixed numerals + negatives |

---

## 9. Risks

| Risk | Mitigation |
|------|------------|
| Virtual keyboard covers widget on small screens | `virtualKeyboardContainer` in answer card |
| MathLive API drift | Pinned 0.110.0 in `vendor/VERSIONS.md` |
| Equivalence too lenient pedagogy | Per-question `form` spec; simplest form where needed |
| Page weight | Load MathLive only on `year5-practice.html` initially |

---

## 10. Files touched

| File | Action |
|------|--------|
| `widgets/mcs-input.js` | **Create** |
| `widgets/mcs-question-adapter.js` | Extend `inputs` mounting if missing |
| `year5-practice.html` | MathLive CSS + script block |
| `year5-practice.js` | Migrate `fraction-addition` |

---

## 11. Relative effort

**M** (medium) — wrapper is thin; profiles + `input.check` parser are the bulk. Independent of JSXGraph/Konva tracks — can run parallel to 2.4/2.5.
