# 2.2 — `coordinate-plotter` Implementation Plan

**Widget ID:** `coordinate-plotter`  
**Module:** `widgets/mcs-widgets-space.js`  
**Library:** JSXGraph via `widgets/mcs-board.js`  
**Catalogue:** [03 §S1](../03-Widget-Catalogue.md#-s1-coordinate-plotter)  
**Pilot:** **Net-new** Year 6 four-quadrant plot — closes `four-quadrant-plotter` badge dead-end ([achievements-config.js](../../achievements-config.js) `AC9M6SP02`)

> **Highest-value early deliverable** (07 §8): exercises engine + JSXGraph + canonical questions + badges, and ships curriculum content the config promises but practice cannot deliver today.

---

## 1. Goal & success criteria

Add a real interactive four-quadrant grid to Year 6 practice. The existing `generateSP02()` (~906–937) uses context `four-quadrant-plotter` but is **translation arithmetic with text inputs only** — no grid. Badge `AC9M6SP02` also lists `four-quadrant-reads` as a required context.

**Done when:**

- [ ] New generator(s) produce `four-quadrant-plotter` **and** `four-quadrant-reads` contexts with live grid
- [ ] `MCS.create('coordinate-plotter', …)` supports `plot-point` in four-quadrant mode
- [ ] Descriptor `AC9M6SP02`, contexts **frozen** — no renames
- [ ] Per-widget QA checklist passed

**Deferred to Phase 3:** `plot-points`, `read-point`, `path`, `alpha-grid`, `manhattan`; Y3 landmark grid; Y5 10×10 first quadrant.

---

## 2. Pilot questions (two generators, one widget)

Ship **two** canonical questions in the same vertical slice — both needed for badge completion.

### 2A — Plot a point (`four-quadrant-plotter`)

| Field | Value |
|-------|-------|
| `descriptor` | `AC9M6SP02` |
| `context` | `four-quadrant-plotter` |
| `category` | `space` |
| `title` | `PLOT THE WAYPOINT` |
| `prompt` | `Tap or drag the pin to plot the point **({x}, {y})**.` |
| `band` | `C` |

**Generator:**

```javascript
const x = Math.floor(Math.random() * 9) - 4;  // −4…4
const y = Math.floor(Math.random() * 9) - 4;
```

**Widget config:**

```javascript
{
  id: 'grid',
  type: 'coordinate-plotter',
  config: {
    mode: 'plot-point',
    band: 'C',
    quadrants: 4,
    xMin: -5, xMax: 5,
    yMin: -5, yMax: 5,
    snap: 1,
    showAxes: true,
    showGrid: true,
    pinCount: 1,
    labels: 'axis'   // −4, −2, 0, 2, 4 style
  }
}
```

**Evaluate:** `values.grid.x === x && values.grid.y === y`

**Solution:** `show: { grid: { x, y } }` — pin animates to coordinate.

---

### 2B — Read a fixed point (`four-quadrant-reads`)

Keep translation question OR add read-coordinates variant. **Recommended for pilot:** read fixed marker, answer via paired inputs (MathLive optional later; plain integers OK for 2.2).

| Field | Value |
|-------|-------|
| `descriptor` | `AC9M6SP02` |
| `context` | `four-quadrant-reads` |
| `prompt` | `What are the coordinates of point **P**?` |

**Widget config:**

```javascript
{
  mode: 'read-point',
  quadrants: 4,
  markers: [{ x, y, label: 'P', fixed: true }],
  draggable: false
}
```

**Inputs:** two `type: 'number'` or stub `math-field` with `keyboard: 'integers'` if 2.6 landed first.

**Evaluate:** `values.ansX === x && values.ansY === y`

> **Option (recommended):** Implement `read-point` as **display-only grid** in 2.2 (marker fixed, no drag) — minimal extra code if marker rendering shares `plot-point` board setup.

---

### 2C — Retain translation question (optional same PR)

Existing `generateSP02()` translation arithmetic can stay as legacy-passthrough **or** gain a grid showing P and vector — defer visual upgrade to Phase 3; **badge only needs contexts emitted by live generators**.

---

## 3. Widget API (Phase 2 scope)

### Modes implemented

| Mode | Phase 2 | `getValue()` |
|------|---------|--------------|
| `plot-point` | ✅ | `{ x, y }` |
| `read-point` | ✅ (pilot 2B) | `{ x, y }` of student-placed read aid OR empty; paired inputs hold answer |
| `plot-points` | ❌ | — |
| `path` | ❌ | — |
| `alpha-grid` | ❌ | — |
| `manhattan` | ❌ | — |

### Config

| Key | Type | Notes |
|-----|------|-------|
| `quadrants` | `1 \| 4` | Pilot: `4` |
| `xMin`, `xMax`, `yMin`, `yMax` | number | Default ±5 for pilot |
| `snap` | `1 \| 0.5` | Integer snap for pilot |
| `markers` | array | Fixed points for read mode |
| `landmarks` | array | Phase 3 Y3 maps |
| `pinCount` | number | 1 for pilot |
| `showAxes`, `showGrid` | boolean | Both true |
| `band` | `'A'\|'B'\|'C'` | C for Y6 |

### Board setup

- `boundingbox: [xMin-1, yMax+1, xMax+1, yMin-1]`
- Axes cross at origin; quadrant labels optional at Band C (subtle I–IV in mono font)
- **No pan/zoom** — children cannot scroll the plane away (03 cross-cutting rule 3)
- Origin marker: small accent dot

### Interaction (`plot-point`)

1. **Tap empty grid cell** → pin moves to nearest snap lattice (tap-to-plot for tablet efficiency)
2. **Drag pin** → same snap on release
3. **Keyboard:** Tab to pin; arrows move one snap step; Enter confirms
4. Second pin not created in pilot (`pinCount: 1`)

### `showSolution({x, y})`

Pin glides from current position to target; crosshair lines flash at destination (accent, 300 ms fade).

### Accessibility

- `aria-label`: "Four-quadrant coordinate plane. Plot the point at …"
- Live region: `"Point at negative three, four"` on snap
- Colour-independent: pin shape + label "P" not colour alone

---

## 4. Implementation tasks

### Step 1 — Extend `mcs-board.js`

- [ ] `MCS.board.grid(board, opts)` — optional grid lines at unit intervals
- [ ] `MCS.board.axes(board, opts)` — themed axis strokes
- [ ] Ensure `keepAspectRatio: true` so squares look square on resize

### Step 2 — Coordinate plotter factory

- [ ] Register in `mcs-widgets-space.js`
- [ ] `plot-point` mode: single draggable `MCS.board.point` with `snapToGrid`
- [ ] Tap-on-board handler: `board.on('down', …)` convert screen → math coords → snap → move pin
- [ ] `read-point` mode: render fixed `markers`, disable drag
- [ ] Full widget contract + `destroy`

### Step 3 — New Y6 generators

- [ ] Add `generateSP02plot()` → `four-quadrant-plotter` canonical question
- [ ] Add `generateSP02read()` → `four-quadrant-reads` canonical question
- [ ] Register in `generators.space` array (replace or supplement existing SP02)
- [ ] Console tally: both contexts appear in `solvedContexts` after correct answers

### Step 4 — Page wiring

- [ ] `year6-practice.html`: ensure `mcs-widgets-space.js` in script block
- [ ] `MCS.runQuestion` mounts widget in `prac-interactive-panel`
- [ ] `session.collect()` merges `values.grid` + input ids for evaluate

### Step 5 — QA

- [ ] Plot (3, −2) by tap and by drag — same `getValue()`
- [ ] Origin and negative axes labelled correctly
- [ ] Resize window mid-question — pin stays at same mathematical coords
- [ ] `showSolution` exact on half-unit boundary (if snap 1, land on integer)
- [ ] Badge `AC9M6SP02` achievable in a practice session

---

## 5. Band variants

| Band | Quadrant range | Grid size | Pin | Labels |
|------|----------------|-----------|-----|--------|
| B | 1 | 0–5 × 0–5 | Large labelled | Every unit |
| C | 4 | ±5 (pilot) | Mono pin | Every 2 units + origin |
| A | 1 | 0–5 | Sprite pin | Pictorial |

Pilot uses Band C only; spot-check B by config swap.

---

## 6. Legacy code replaced (eventually)

| Location | Current | Phase 2 action |
|----------|---------|----------------|
| `year6-practice.js` SP02 | Text-only translation | Keep or parallel new generators |
| `year6.js` assessment | Input-only quadrant grid | Phase 4 |
| `year5-practice.js` `makeGridSvg` | Static SVG | Phase 3a |
| `year3-practice.js` landmark grid | Static | Phase 3d |

---

## 7. Risks

| Risk | Mitigation |
|------|------------|
| Tap vs drag ambiguity on dense C grid | Generous snap; nearest-lattice wins (06 §3) |
| JSXGraph board weight | One board per question; destroy on dispose |
| Two contexts in one badge confuses QA | Document both generators in commit notes |

---

## 8. Files touched

| File | Action |
|------|--------|
| `widgets/mcs-board.js` | Extend (grid, axes) |
| `widgets/mcs-widgets-space.js` | **Create** |
| `year6-practice.js` | Add SP02 plot + read generators |
| `year6-practice.html` | Script tags |

---

## 9. Relative effort

**L** (large) — most complex P1 widget in Phase 2; net-new content + four-quadrant interaction.
