# 2.1 — `number-line` Implementation Plan

**Widget ID:** `number-line`  
**Module:** `widgets/mcs-widgets-number.js`  
**Library:** JSXGraph via `widgets/mcs-board.js`  
**Catalogue:** [03 §N1](../03-Widget-Catalogue.md#-n1-number-line)  
**Pilot:** Year 6 practice — `AC9M6N01` / `negative-number-line` — **upgrade** from static read-only SVG to **drag-pin** (`place-point`)  
**Phase 2 status:** ✅ **G2 pilot shipped (2026-06-11)** · **Phase 3 extensions shipped:** `read-point`, `order-points`, `jump`; Y3 fraction line; Y4 mixed numerals; Y5 decimal/fraction ordering (2026-06-13)

---

## 1. Goal & success criteria

Replace the inline SVG in `year6-practice.js` `generateN01()` (~678–722) with a draggable pin on a themed JSXGraph number line. The student **places** the pin at the prompted integer instead of reading a fixed marker and typing into `<input type="number">`.

**Done when:**

- [x] `MCS.create('number-line', …)` works on `year6-practice.html` via `file://`
- [x] One Y6 generator returns canonical shape with `widgets: [{ id: 'line', type: 'number-line', … }]`
- [x] Context string remains exactly `negative-number-line` (badge pipeline frozen)
- [x] Per-widget QA checklist (07 §6) passed on desktop + `file://`

**Phase 3 extensions (2026-06-13):** `read-point`, `order-points`, `jump` modes; consumers on Y3–Y5 practice pages. Resize uses `board.updateContainerDims()` in `mcs-board.js`.

---

## 2. Pilot question design

### Current behaviour (legacy)

- Static SVG −10…+10 with a **fixed** red pin at `val`
- Prompt: "What integer is marked by the red pin?"
- Answer: number input

### Target behaviour (canonical)

Flip to constructive placement — stronger pedagogy and exercises the widget:

| Field | Value |
|-------|-------|
| `descriptor` | `AC9M6N01` |
| `context` | `negative-number-line` |
| `category` | `number` |
| `title` | `INTEGERS ON NUMBER LINE` |
| `prompt` | `Drag the pin to **{target}** on the number line.` |
| `band` | `C` |

**Generator logic:**

```javascript
const target = Math.floor(Math.random() * 21) - 10; // −10…10, exclude nothing
// Pin starts at 0 or a random offset ≠ target
```

**Widget config (pilot):**

```javascript
{
  id: 'line',
  type: 'number-line',
  config: {
    mode: 'place-point',
    band: 'C',
    min: -10,
    max: 10,
    snapStep: 1,
    ticks: { major: 5, minor: 1, labels: 'major' },
    initialValue: 0,           // or random wrong start
    token: 'pin',              // Band C: no rocket/frog
    showFractionLabels: false
  }
}
```

**Evaluation:**

```javascript
evaluate(values) {
  return values.line === target;
}
```

**Solution object:**

```javascript
solution: {
  text: `The pin belongs at ${target}.`,
  show: { line: target }
}
```

---

## 3. Prerequisites — `mcs-board.js`

Create `widgets/mcs-board.js` before the widget. Minimum surface for Phase 2.1:

| Factory | Responsibility |
|---------|----------------|
| `MCS.board.make(container, opts)` | `JXG.JSXGraph.initBoard` with locked pan/zoom, `keepAspectRatio`, theme colours, `ResizeObserver` → `board.updateContainerDims()` |
| `MCS.board.point(board, opts)` | Draggable point with `snapToGrid`, band-scaled `size`, accent stroke/fill |
| `MCS.board.label(board, opts)` | JetBrains Mono tick labels |
| `MCS.board.destroy(board)` | `JXG.JSXGraph.freeBoard(board)` — mandatory |

**1-D number line bbox:** `[-1, 2, max+1, -2]` — y-axis locked; only x matters.

**Theme bridge:** replicate spike pattern (`_spike.js` `buildJxg`) — read `MCS.theme().accent` for point stroke.

---

## 4. Widget API (Phase 2 scope)

### Config

| Key | Type | Pilot default | Notes |
|-----|------|---------------|-------|
| `mode` | `'place-point'` | required | Only mode implemented in 2.1 |
| `band` | `'A'\|'B'\|'C'` | `'C'` | Drives snap radius, pin size, label density |
| `min`, `max` | number | −10, 10 | Mathematical domain |
| `snapStep` | number | 1 | 1 = integers; 0.25 = quarters (Phase 3) |
| `ticks.major` | number | 5 | Label every n units |
| `ticks.minor` | number | 1 | Tick every n units |
| `ticks.labels` | `'all'\|'major'\|'none'` | `'major'` | Band A → `'all'` |
| `initialValue` | number | 0 | Pin start position |
| `markers` | `{value, style}[]` | `[]` | Fixed markers (Phase 3 read-point) |
| `token` | `'pin'\|'rocket'\|'frog'` | `'pin'` | Sprite at Band A/B |
| `showFractionLabels` | boolean | false | 0–1 fraction labels (Phase 3) |

### `getValue()` → `number`

Mathematical x-coordinate of the pin (never pixels). For `place-point`: current snapped position.

### `setValue(n)` / `showSolution(n)`

Tween pin to `n` over ~800 ms (`MCS.tween`); call `onChange` subscribers at end.

### Interaction

1. **Pointer:** drag pin; release snaps to nearest `snapStep` lattice point within band snap radius (06 §3)
2. **Keyboard:** Tab focuses pin → ←/→ move one snap step → Enter commits (fires `onChange`)
3. **Touch:** `preventDefault` on `touchmove` inside board; 1.1× scale on pickup
4. **Audio:** emit `'snap'` via `MCS.audio` on successful snap

### Accessibility

- Container: `role="application"`, `aria-label="Number line. Drag the pin to the target integer."`
- Hidden `aria-live="polite"` region: `"Pin at negative three"` / `"Pin at five"`
- Focus ring on pin (3 px accent outline)

### Feedback verbs

| Verb | Behaviour |
|------|-----------|
| `flagCorrect()` | Green pulse on pin + particle burst at pin coords |
| `flagIncorrect()` | Horizontal shake of pin only |
| `showSolution(v)` | Pin glides to `v`; optional brief glow at destination |

### `destroy()`

`freeBoard`, disconnect `ResizeObserver`, remove keyboard listeners, `MCS._releaseContainer`.

### Debug hook

`MCS.debug` build flag: `_debugSet(n)` jumps pin without animation.

---

## 5. Implementation tasks

### Step 1 — Board substrate (`mcs-board.js`)

- [ ] IIFE scaffold with `typeof JXG === 'undefined'` guard
- [ ] `make()` with pan/zoom disabled, copyright hidden
- [ ] ResizeObserver wiring (pattern from `mcs-core.js`)
- [ ] Theme colour injection on create + `MCS.invalidateTheme` listener
- [ ] Unit smoke: empty board in a div on `_spike.html` still passes

### Step 2 — Number line renderer

- [ ] Draw horizontal axis line + major/minor ticks from config
- [ ] Render tick labels per `ticks.labels` and band font size
- [ ] Create draggable pin point with snap
- [ ] Map mathematical x ↔ board coordinates (linear scale, responsive width)

### Step 3 — Widget contract

- [ ] `MCS.register('number-line', factory)` in `mcs-widgets-number.js`
- [ ] Implement full contract (§4)
- [ ] `setEnabled(false)` fixes pin after submit
- [ ] Idempotent `setValue(getValue())` for second-attempt flow

### Step 4 — Pilot migration (`year6-practice.js`)

- [ ] Add engine script block to `year6-practice.html` (JSXGraph + mcs-board + mcs-widgets-number)
- [ ] Replace `generateN01()` with canonical question object
- [ ] Wire `MCS.runQuestion` if not already handling widget manifest for Y6 strand generators
- [ ] Delete inline SVG template from N01 only (other generators untouched)
- [ ] Verify `gainPoints(…, 'AC9M6N01', 'negative-number-line')` unchanged

### Step 5 — QA & evidence

- [ ] Desktop Chrome/Edge `file://` — zero console errors
- [ ] Tablet touch drag — no page scroll
- [ ] Keyboard path completes same answer as drag
- [ ] `showSolution` lands pin exactly on target tick
- [ ] 20-question session — no heap growth (pin board destroyed each question)
- [ ] Theme emerald renders accent-coloured pin

---

## 6. Band variants (verify on pilot page)

| Token | Band C (pilot) | Band B (spot-check) | Band A (spot-check) |
|-------|----------------|---------------------|---------------------|
| Pin size | 28 px equiv | 40 px | 56 px |
| Snap radius | 0.25 × step | 0.35 × step | 0.5 × step |
| Labels | major only | major + some minor | every integer |
| Token | pin | pin | frog or rocket optional |

Spot-check Band B/A by temporarily setting `band: 'B'` in a dev question — full Band A questions ship Phase 5.

---

## 7. Risks & mitigations

| Risk | Mitigation |
|------|------------|
| JSXGraph point drag feels sluggish on tablet | Increase hit halo; use `needsFullUpdate` sparingly |
| Negative label overlap at small widths | Rotate nothing; thin labels at C; ResizeObserver rescales |
| Pilot flip changes question difficulty | Placement is comparable to reading; same descriptor/context |

---

## 8. Files touched (expected)

| File | Action |
|------|--------|
| `widgets/mcs-board.js` | **Create** |
| `widgets/mcs-widgets-number.js` | **Create** |
| `year6-practice.html` | Add script tags |
| `year6-practice.js` | Migrate `generateN01` |
| `style.css` | Optional `.mcs-number-line` container min-height |

---

## 9. Relative effort

**M** (medium) — ~2–3 sessions including `mcs-board.js` substrate shared with 2.2 and 2.5.
