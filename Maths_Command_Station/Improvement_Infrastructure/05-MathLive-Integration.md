# 05 — MathLive Integration Plan

How MathLive replaces plain text/number inputs for mathematical answer entry, tuned per age band, with robust offline self-hosting and mathematically-sound answer checking.

---

## 1. What MathLive Solves Here

Current answer entry pain points (observed in the live code):

| Problem | Where it bites today |
|---------|---------------------|
| Fractions typed as `3/4` into a text box, parsed by a hand-rolled `parseFraction()` | Y5 fraction questions (~`year5-practice.js` `parseFraction`); silently rejects `0.75`, ` 3 / 4 `, `6/8` |
| Two separate boxes for numerator/denominator (and three for mixed numerals) | Y3 N02, Y4 N04 — clunky, teaches nothing about notation |
| Negative numbers typed into `number` inputs with inconsistent `-` handling | Y6 integers |
| No way to ever ask for `x = 7`, `3² `, `√16`, or a ratio | Blocks future Y6+ content |
| Validation by string equality | Marks `0.50` wrong when `0.5` expected, etc. |

MathLive provides a `<math-field>` web component: real typeset maths as the student types, an on-screen virtual keyboard, and structured output (LaTeX / MathJSON) we can evaluate properly.

---

## 2. Vendoring & Loading

- Vendor the **UMD/global build** to `vendor/mathlive/mathlive.min.js` (classic script — works on `file://`; the ESM build would not, per doc 02 §2).
- **Phase 0 spike finding (verified 2026-06-10):** MathLive's *dynamic* font/sound loaders use `fetch()`, which Chromium blocks entirely on the `file:` protocol — no path configuration can fix that. The working offline pattern is **static CSS font loading**:

```html
<!-- in the page <head>: CSS @font-face loading works on file:// where fetch() does not -->
<link rel="stylesheet" href="vendor/mathlive/mathlive-fonts.css">
```

```javascript
// in mcs-input.js init — disable the fetch()-based loaders
MathLive.MathfieldElement.fontsDirectory  = null;
MathLive.MathfieldElement.soundsDirectory = null;
```

Keyboard feedback sounds are therefore unavailable on `file://` (acceptable: widget/audio feedback comes from the page's own Web Audio helper, not MathLive). The working reference implementation is `_spike.html` + `_spike.js`.

- **Optional companion:** `@cortexjs/compute-engine` (MIT) vendored the same way, used only for equivalence checking (§5). Decision point at Phase 3: if its global build proves awkward offline, the fallback evaluator in §5.3 ships instead and the dependency is dropped.

---

## 3. The `math-field` Widget (engine wrapper `I1`)

MathLive is wrapped in the standard widget contract (doc 02 §3) so question code never touches the raw component:

```javascript
const ans = MCS.create('math-field', el, {
  keyboard: 'fractions-y5',     // named keyboard profile (§4)
  placeholder: '\\frac{?}{?}',  // ghost prompt inside the field
  band: 'C',
  expect: 'number'              // 'number' | 'fraction' | 'expression' — drives parsing & validation UX
});
ans.getValue();  // -> { latex: '\\frac{3}{4}', value: 0.75, mathjson: [...] }
```

Wrapper responsibilities:

1. Create `<math-field>` with locked options: no inline shortcuts that confuse children (`smartFence` on, `smartSuperscript` on, text mode **off**, no keyboard toggle into LaTeX source).
2. Force the **virtual keyboard policy** by band: Band B/C `virtualKeyboardPolicy: 'onfocus'` on touch, `'manual'` toggle button on desktop; the field is the only focus target inside the answer card.
3. Map theme tokens onto MathLive CSS variables (caret, selection, placeholder colours → Command Station palette).
4. Normalise `getValue()` to `{latex, value, mathjson}` so `evaluate()` functions stay one-liners.
5. Disable paste of arbitrary text (children pasting full questions in produces garbage states).

---

## 4. Virtual Keyboard Profiles (the age-tuning core)

MathLive supports fully custom virtual keyboard layouts. Define one **named profile** per need, registered centrally in `mcs-input.js`:

| Profile | Keys | Used by |
|---------|------|---------|
| `integers` | 0–9, ⌫, − (minus), ✓ submit | Y3–Y6 whole/negative number answers |
| `decimals` | `integers` + `.` | Y4–Y6 decimals, money |
| `fractions-y3` | 0–9, ⌫, **big a/b fraction key**, ✓ | Y3 unit fractions (two-box inputs retired) |
| `fractions-y5` | `fractions-y3` + mixed-number key (n a/b), `.`, − | Y5/Y6 fraction & mixed-numeral work |
| `percent` | `decimals` + `%`, fraction key | Y5/Y6 percentage conversion |
| `algebra-y6` | `fractions-y5` + `x`, `=`, `(`, `)`, `x²`, `√` | Y6 algebra, future Y7 prep |
| `time-24h` | 0–9, `:`, ⌫ | 24-hour time answers |

Design rules for all profiles:

- **No QWERTY anywhere.** Children never see an alphabetic layer; profiles contain exactly the keys the answer space needs (this is also anti-frustration: wrong-symbol answers become impossible).
- Key caps rendered at ≥ 48 px (Band C) / 64 px (Band B); JetBrains Mono digits to match the terminal aesthetic.
- The fraction key inserts `\frac{#?}{#?}` with the caret in the numerator and **Tab/→ hops to the denominator** — one keystroke replaces today's two-input plumbing.
- Hardware keyboard remains fully functional in parallel for desktop users (typing `3/4` auto-converts to a typeset fraction via MathLive's inline shortcut — keep just this one shortcut on).

Band A note: Prep/Year 1 do **not** get MathLive. Their numeric answers use the simpler `number-pad` widget (doc 03 I2) — a full maths keyboard is cognitive overload at five. MathLive enters at Band B (Year 3) with `fractions-y3`.

---

## 5. Answer Checking Strategy

### 5.1 Principle

Check **mathematical equivalence within the expected answer type**, not string equality — but never *more* lenient than the pedagogy wants (if the question demands simplest form, equivalence alone isn't enough).

### 5.2 Three-level evaluation, declared per question

```javascript
inputs: [{ id: 'ans', type: 'math-field', config: { keyboard: 'fractions-y5', expect: 'fraction' } }],
evaluate(v) {
  return MCS.input.check(v.ans, { equals: {num: 3, den: 4}, form: 'any' });
  //                                              form: 'any' | 'simplest' | 'exact-latex'
}
```

| `form` | Accepts for target ¾ | Implementation |
|--------|---------------------|----------------|
| `'any'` | `3/4`, `6/8`, `0.75` | numeric evaluation within epsilon (1e-9) |
| `'simplest'` | `3/4` only (not `6/8`, but `0.75` configurable) | numeric match **and** gcd(num,den)=1 check on the parsed fraction structure |
| `'exact-latex'` | exactly the target structure | normalised LaTeX compare (rare; e.g. "write this as a mixed numeral") |

### 5.3 Engine choice inside `MCS.input.check`

- **Preferred:** Compute Engine (`parse(latex).N()` for numeric value; expression structure inspection for form checks). Handles `x`-expressions for Y6 algebra (`isSame` / simplification comparison).
- **Fallback (if Compute Engine is dropped):** a small first-party evaluator covering the actual answer space of a primary app — numbers, fractions `\frac{a}{b}`, mixed numerals, percentages, and `a op b` arithmetic. This is deliberately *not* a general CAS; scope is fenced to what Prep–Y6 questions emit. Decision recorded at Phase 3 gate (doc 07).

### 5.4 Feedback niceties

- On `flagIncorrect()`, if the value was *equivalent but wrong form* (e.g. `6/8` under `form:'simplest'`), show the targeted hint "Can you simplify your fraction?" — a feedback class impossible with string matching.
- Empty/unparseable input never consumes an attempt; the field shakes and shows "Finish your answer" (children submit half-typed fractions constantly).

---

## 6. Migration Order for Inputs (ties into doc 07 phases)

1. **Phase 3a — Y5 fractions** (worst `parseFraction` pain): N04 fraction add/sub, equivalent fractions, probability chance-fractions → `fractions-y5` profile.
2. **Phase 3b — Y6**: integers (`integers` profile with minus), percentages (`percent`), algebra unknowns (`algebra-y6`).
3. **Phase 3c — Y4**: mixed numerals (`fractions-y5`), decimals (`decimals`).
4. **Phase 3d — Y3**: unit fractions (`fractions-y3`) — retire the num/den double inputs.
5. Plain `<input type="number">` remains acceptable for incidental single-integer answers where a full math field adds nothing (judgement call per question; default to MathLive when fractions/negatives/decimals are possible).

---

## 7. Risks & Mitigations (MathLive-specific)

| Risk | Mitigation |
|------|------------|
| Font loading fails on `file://` → blank glyphs | **Resolved in Phase 0:** static `mathlive-fonts.css` + `fontsDirectory = null` (§2); verified offline with zero console errors |
| Virtual keyboard overlaps the question on small screens | Use MathLive's container-attached keyboard (`virtualKeyboardContainer`) docked inside the answer card region, not the viewport bottom |
| Bundle weight on pages that don't need it | Script included only on pages with math-field questions; `mcs-input.js` no-ops when MathLive absent |
| Accessibility of typeset maths | MathLive emits MathML + ARIA natively — better than today's bare inputs; verify with NVDA in Phase 6 QA |
| Version drift / breaking API changes | Pin exact version in `vendor/VERSIONS.md`; upgrades are deliberate, tested events |
