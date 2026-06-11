# 2.5 — `column-graph` Implementation Plan

**Widget ID:** `column-graph`  
**Module:** `widgets/mcs-widgets-data.js`  
**Library:** JSXGraph via `widgets/mcs-board.js`  
**Catalogue:** [03 §D1](../03-Widget-Catalogue.md#-d1-column-graph)  
**Pilot:** Year 4 practice — scaled column graph **read** mode (`scaled-column-graph` generator, ~1445–1520)

---

## 1. Goal & success criteria

Replace `makeScaledBarChartSvg` + hover-guide JavaScript + number input with a JSXGraph column graph where:

- Columns are **tappable** (tablet-first)
- Tapping projects a **guide line** to the y-axis and shows the scaled value (preserves Y4 hover pedagogy without mouse-only)
- Answer still entered in a separate input (widget supplies exploration, not the final answer text)

**Done when:**

- [ ] `mode: 'read'` interactive columns on Y4 statistics generator
- [ ] Descriptor `AC9M4ST01`, context unchanged
- [ ] Scales with interval 2 or 5 (existing generator logic)
- [ ] Per-widget QA checklist passed

**Deferred:** `build` mode (student drags column tops), `picture-graph` (Band A), Y3/Y5 bar chart migrations.

---

## 2. Pilot question design

### Legacy reference

`year4-practice.js` statistics generator:

- Categories: `['Dogs', 'Cats', 'Fish', 'Birds']`
- `scaleInterval`: 2 or 5
- Variants: single column read **or** difference between two columns
- Static SVG + `#hover-guide-line` mouse handlers

### Canonical migration

| Field | Value |
|-------|-------|
| `descriptor` | `AC9M4ST01` |
| `context` | *(preserve existing context mapping from `scaled-column-graph` type — verify in `mapDescriptor` block ~1649)* |
| `category` | `statistics` |
| `band` | `C` (Y4 is Band C-entry per 04 §1) |

**Widget config:**

```javascript
{
  id: 'chart',
  type: 'column-graph',
  config: {
    mode: 'read',
    band: 'C',
    categories: ['Dogs', 'Cats', 'Fish', 'Birds'],
    values: [10, 15, 5, 20],      // from generator
    scaleInterval: 5,
    maxY: null,                   // auto: ceil(max(values)/interval)*interval
    buildMode: false,
    selectedCategory: null        // student tap sets this for exploration
  }
}
```

**Inputs:** retain `input type="number"` with `id: 'ans'` in `inputs` array (MathLive not required).

**Evaluate:** unchanged numeric answer (`values.ans === target`).

**Widget `getValue()` for read mode:**

```javascript
{ selectedCategory: 'Cats' | null, selectedValue: 15 | null }
```

Evaluation still uses the **input** — widget value is for hints/exploration only. Optional: `evaluate` accepts either input OR tap-revealed value matching (stricter rigour: input only — **recommended**).

---

## 3. Widget API (Phase 2 scope)

### `mode: 'read'`

| Feature | Behaviour |
|---------|-----------|
| Column rendering | Filled rectangles per category, themed accent |
| Y-axis | Scaled ticks every `scaleInterval`; dashed horizontal grid |
| X-axis | Category labels below columns |
| Tap column | Horizontal guide line at column top; label at axis showing **value** |
| Second tap | Moves guide to new column |
| `getValue()` | `{ selectedCategory, selectedValue }` |

### Config

| Key | Type | Notes |
|-----|------|-------|
| `categories` | `string[]` | X labels |
| `values` | `number[]` | Column heights |
| `scaleInterval` | number | 2 or 5 for pilot |
| `maxY` | number | Auto-computed if omitted |
| `buildMode` | boolean | false for read pilot |

### JSXGraph implementation notes

- Use **bar chart as filled polygons** or JSXGraph `chart` element if theming allows; otherwise manual `polygon` per column for full colour control
- Columns are **not draggable** in read mode
- Hit area: full column width + 8 px horizontal padding
- Guide line: accent-coloured segment from column top to y-axis; mono font value label

### Keyboard

- Tab focuses each column in order
- Enter on focused column → same as tap (show guide + announce value)
- Arrow keys move focus between columns

### Accessibility

- `aria-label`: "Column graph showing favourite pets. Tap a column to read its value."
- Live: `"Cats column shows fifteen"`

### Feedback

| Verb | Behaviour |
|------|-----------|
| `flagCorrect()` | Pulse on column matching correct answer (if known via hint) or global chart frame |
| `flagIncorrect()` | Gentle shake of answer input area (widget border pulse) |
| `showSolution(v)` | Guide line animates to correct column; value label appears |

For difference questions: solution can highlight **two** columns sequentially (hint config lists both categories).

---

## 4. Implementation tasks

### Step 1 — Chart geometry in `mcs-board.js` or widget-local

- [ ] `computeYScale(maxY, interval)` → tick positions
- [ ] `columnRect(categoryIndex, value)` → polygon coords in math space
- [ ] Responsive: x positions scale with container width

### Step 2 — Interaction layer

- [ ] Tap handler on each column shape
- [ ] Guide line + axis label elements (update on tap)
- [ ] Do **not** reveal answer automatically on tap before submit (preserves rigour per 03 §D1) — show scaled value for exploration only

### Step 3 — Register widget

- [ ] `mcs-widgets-data.js` → `MCS.register('column-graph', …)`
- [ ] Full contract; `showSolution` accepts `{ category }` or `{ categories: [a,b] }` for difference type

### Step 4 — Y4 migration

- [ ] Add JSXGraph + `mcs-widgets-data.js` to `year4-practice.html`
- [ ] Wire `MCS.runQuestion` in `year4-practice.js`
- [ ] Convert `statistics` generator `renderFunc` to canonical `widgets` manifest
- [ ] Remove `makeScaledBarChartSvg` and hover listener block when unreferenced
- [ ] Verify `mapDescriptor` still assigns `AC9M4ST01`

### Step 5 — QA

- [ ] `scaleInterval: 5` — Cats column at 15 aligns with axis tick 15
- [ ] Tap works on tablet (no hover dependency)
- [ ] Difference question hint references two columns
- [ ] Resize — columns and labels rescale
- [ ] 20 questions — no SVG/DOM listener leak

---

## 5. Band variants

| Band | Max categories | Scale | Interaction |
|------|----------------|-------|-------------|
| A | 3 | 1 (picture-graph later) | sprite stacks |
| B | 4 | 1 or 2 | tap + big labels |
| C | 6+ | 2, 5, 10 (pilot) | tap guide line |

---

## 6. Phase 3 preview — `build` mode

Not in Phase 2, but architect now:

- Draggable handles at column tops
- `getValue()` → `{ values: { Dogs: n, Cats: m, … } }`
- Snap to `scaleInterval`
- Shares same axis renderer as read mode

---

## 7. Risks

| Risk | Mitigation |
|------|------------|
| JSXGraph chart theming limited | Manual polygons — more code, full control |
| Tap reveals answer → students skip reading axis | Show value only after tap (exploration), still require input entry |
| Y4 page not yet on `MCS.runQuestion` | Mirror year6 integration pattern in same PR |

---

## 8. Files touched

| File | Action |
|------|--------|
| `widgets/mcs-widgets-data.js` | **Create** |
| `year4-practice.html` | Script block |
| `year4-practice.js` | Migrate statistics generator |

---

## 9. Relative effort

**M** (medium) — read-only mode; no drag handles. Reuses `mcs-board.js` from 2.1.
