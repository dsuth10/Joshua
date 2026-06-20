# 2.4 — `fraction-bars` Implementation Plan

**Widget ID:** `fraction-bars`  
**Module:** `widgets/mcs-widgets-number.js`  
**Library:** Konva via `widgets/mcs-stage.js`  
**Catalogue:** [03 §N2](../03-Widget-Catalogue.md#-n2-fraction-bars)  
**Pilot:** Year 3 N02 — shade-a-fraction (`unit-fraction-bars` context)

---

## 1. Goal & success criteria

Upgrade Y3 unit-fraction questions from "look at static picture + type num/den" to **tap-to-shade** fraction bars. Today `unit-fractions` generator (~947–981) always uses `makeFractionLineSvg` + twin number inputs; context randomly picks `unit-fraction-lines` **or** `unit-fraction-bars` but **no bar UI exists** — the bars context is a dead branch.

**Done when:**

- [ ] `mode: 'shade'` — student taps segments to fill; answer = shaded fraction
- [ ] Y3 generator when `context === 'unit-fraction-bars'` uses widget; line variant can stay legacy until Phase 3d
- [ ] Descriptor `AC9M3N02`, context `unit-fraction-bars` frozen
- [ ] Per-widget QA checklist passed

**Deferred:** `display`, `partition`, `compare` modes (Y4–Y5, Phase 3).

---

## 2. Pilot question design

### Target canonical question

| Field | Value |
|-------|-------|
| `descriptor` | `AC9M3N02` |
| `context` | `unit-fraction-bars` |
| `category` | `number` |
| `title` | `SHADE THE FRACTION` |
| `prompt` | `Tap parts of the bar to shade **{num}/{den}** of the whole.` |
| `band` | `B` |

**Generator** (reuse existing pools):

```javascript
const denominators = [2, 3, 4, 5, 10];
const den = denominators[Math.floor(Math.random() * denominators.length)];
const num = Math.floor(Math.random() * (den - 1)) + 1;
```

**Widget config:**

```javascript
{
  id: 'bar',
  type: 'fraction-bars',
  config: {
    mode: 'shade',
    band: 'B',
    denominator: den,
    bars: 1,              // single whole bar for pilot
    maxShaded: den,       // cannot over-shade
    initialShaded: 0,
    allowToggle: true     // tap again to unshade (exploration-friendly)
  }
}
```

**Evaluate:**

```javascript
evaluate(v) {
  return v.bar.num === num && v.bar.den === den;
}
```

**Hint:** `highlight: ['bar:segments']` — pulse empty segments.

**Solution:** `show: { bar: { num, den } }` — segments fill left-to-right in order over ~800 ms.

---

## 3. Widget API (Phase 2 scope)

### Modes

| Mode | Phase 2 | Description |
|------|---------|-------------|
| `shade` | ✅ | Tap segments on/off to build fraction |
| `display` | ❌ | Static shaded bars (Y5 hint visuals) |
| `partition` | ❌ | Cut whole into n parts first |
| `compare` | ❌ | Two bars, equivalence |

### `getValue()` → `{ num, den }`

- `den` = config `denominator` (fixed for pilot)
- `num` = count of shaded segments (0–den)

### Visual layout

```
┌──┬──┬──┬──┬──┐  ← one bar, den rectangular segments
│██│██│░░│░░│░░│     ██ = shaded (accent fill)
└──┴──┴──┴──┴──┘     ░░ = empty (accent-soft / transparent)
```

- Segment width = `stageWidth / den`
- Segment height = band-scaled (≥ 40 px Band B)
- Rounded outer corners on bar; 1 px gap between segments for visibility
- **Colour independence:** shaded segments show hatch + fill; empty segments outlined

### Interaction

1. **Tap segment** → toggle shaded (if `allowToggle`) or only add (if `allowToggle: false`)
2. **Cap:** cannot shade more than `den` segments; at cap, further taps unshade or no-op (config `overflow: 'unshade-last' | 'ignore'`)
3. **Snap:** whole segments only — no partial fills (Band B/C); Band A halves/quarters only per 03
4. **Audio:** `'tick'` on each shade toggle
5. **Reset button** (Band B): clears all segments

### Keyboard

- Tab cycles segments left-to-right
- Space/Enter toggles focused segment
- Arrow keys move focus between segments

### Accessibility

- `aria-label`: "Fraction bar with {den} equal parts. Shade {num} parts."
- Live: `"Three of five parts shaded"`

### Feedback

| Verb | Behaviour |
|------|-----------|
| `flagCorrect()` | Green pulse along bar; shaded segments bounce slightly |
| `flagIncorrect()` | Bar shakes horizontally |
| `showSolution({num, den})` | Segments fill sequentially left-to-right |

---

## 4. Implementation tasks

### Step 1 — Segment model

- [ ] `createBar(den, width, height)` → array of `Konva.Rect` in a `Group`
- [ ] `shadedSet` bitmask or boolean array; sync visuals
- [ ] `getValue()` counts shaded

### Step 2 — Tap handling

- [ ] `mousedown`/`touchstart` on each segment with band hit padding
- [ ] Prevent double-toggle on same gesture
- [ ] `onChange` after each toggle

### Step 3 — Register widget

- [ ] `MCS.register('fraction-bars', …)` in `mcs-widgets-number.js`
- [ ] Full contract + `setEnabled` locks segments
- [ ] `setValue({num, den})` for replay/idempotency

### Step 4 — Y3 migration

- [ ] `year3-practice.html` — Konva scripts (if not already from 2.3)
- [ ] Split `unit-fractions` generator:
  - `unit-fraction-bars` → canonical + widget
  - `unit-fraction-lines` → legacy passthrough until 2.1 number-line mode `read-point` ships
- [ ] Force or 50% random context to bars during QA week for coverage
- [ ] Remove dead `unit-fraction-bars` context that never rendered bars

### Step 5 — QA

- [ ] Shade 3/5 — `getValue()` exact
- [ ] Toggle off — count decreases
- [ ] `showSolution` for 2/4 fills first two segments only
- [ ] Tablet: no page scroll; segment targets ≥ 48 px
- [ ] Theme teal applies to shaded fill

---

## 5. Band variants

| Band | Denominators allowed | Bar height | Toggle | Labels |
|------|---------------------|------------|--------|--------|
| A | 2, 4 only | ≥ 56 px | tap only add | "half" icons |
| B | 2–10 (pilot) | ≥ 40 px | toggle | show num/den below bar |
| C | arbitrary | ≥ 28 px | toggle | optional mixed numeral row |

---

## 6. Future modes (sketch for Phase 3)

| Mode | Key work |
|------|----------|
| `display` | Read-only; used beside MathLive in Y5 |
| `compare` | Two stacked bars; `getValue()` → `[{num,den},{num,den}]` |
| `partition` | Slicer UI cuts unpartitioned whole into n parts |

---

## 7. Risks

| Risk | Mitigation |
|------|------------|
| Students shade wrong segments but correct count | Pedagogy accepts equivalent count; optional `order: 'left-to-right'` validation flag |
| Many segments on narrow phones | Min segment width 32 px; scroll forbidden — scale bar to container width |

---

## 8. Files touched

| File | Action |
|------|--------|
| `widgets/mcs-widgets-number.js` | Add `fraction-bars` registration |
| `year3-practice.js` | Migrate unit-fraction-bars branch |
| `year3-practice.html` | Ensure Konva script block |

---

## 9. Relative effort

**M** (medium) — straightforward Konva tap grid; reuses `mcs-stage.js` from 2.3.
