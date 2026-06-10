# 02 — Technical Architecture

How the interactive engine is structured, loaded, and wired into the existing app without breaking its no-build, open-the-HTML-file model.

---

## 1. Target Directory Layout

```
Maths_Command_Station/
├── vendor/                          ← NEW: vendored third-party libraries (committed)
│   ├── VERSIONS.md                  ← exact version + download URL + date for each lib
│   ├── jsxgraph/
│   │   ├── jsxgraphcore.js
│   │   ├── jsxgraph.css
│   │   └── LICENSE
│   ├── konva/
│   │   ├── konva.min.js
│   │   └── LICENSE
│   └── mathlive/
│       ├── mathlive.min.js          ← UMD/global build
│       ├── fonts/                   ← KaTeX-style maths fonts shipped with MathLive
│       ├── sounds/                  ← keyboard feedback sounds (optional)
│       └── LICENSE
│
├── widgets/                         ← NEW: the shared mcs-widgets engine (first-party)
│   ├── mcs-core.js                  ← namespace, theming bridge, widget registry, lifecycle
│   ├── mcs-board.js                 ← JSXGraph wrappers: coordinate planes, number lines, graphs, geometry
│   ├── mcs-stage.js                 ← Konva wrappers: manipulative stage, drag/snap/zone framework
│   ├── mcs-input.js                 ← MathLive wrappers: answer fields, keyboard profiles, equivalence checking
│   ├── mcs-widgets-number.js        ← composed widgets: counters, ten-frame, place-value blocks, fraction tiles…
│   ├── mcs-widgets-measure.js       ← clock, ruler, protractor, balance scale, capacity jug…
│   ├── mcs-widgets-space.js         ← coordinate plotter, transformation board, shape builder, symmetry board…
│   ├── mcs-widgets-data.js          ← bar/column/line/picture graphs, spinner, marble bag, tally…
│   └── mcs-question-adapter.js      ← unified Question Package API + adapters for legacy formats
│
├── Improvement_Infrastructure/      ← this plan
└── (existing files unchanged)
```

**Why `vendor/` + `widgets/` are separate:** vendored code is never edited (upgrades are file swaps verified against `VERSIONS.md`); first-party widget code evolves freely.

---

## 2. Loading Model

### Options considered

| Option | Pros | Cons |
|--------|------|------|
| **A. Classic `<script>` tags + global namespace (IIFE modules)** | Works on `file://`, zero tooling, matches every existing page, trivially debuggable | Manual ordering of script tags; one global (`MCS`) |
| B. Native ES modules (`<script type="module">`) | Real imports, scoping | **Blocked on `file://` in Chromium** (CORS) → breaks the double-click guarantee; requires a local server |
| C. Introduce a bundler (Vite/esbuild) | Modern DX, tree-shaking | Violates the no-build constraint; raises the bar for future maintenance |

### ✅ Recommendation: **Option A** — classic scripts attaching to a single `window.MCS` namespace.

It is the only option that preserves constraint C3 (double-click the HTML and it runs) with robust behaviour on every machine. The cost (script ordering) is managed with a documented, copy-paste header block:

```html
<!-- Maths Command Station: interactive engine (order matters) -->
<link rel="stylesheet" href="vendor/jsxgraph/jsxgraph.css">
<script defer src="vendor/jsxgraph/jsxgraphcore.js"></script>
<script defer src="vendor/konva/konva.min.js"></script>
<script defer src="vendor/mathlive/mathlive.min.js"></script>
<script defer src="widgets/mcs-core.js"></script>
<script defer src="widgets/mcs-board.js"></script>
<script defer src="widgets/mcs-stage.js"></script>
<script defer src="widgets/mcs-input.js"></script>
<script defer src="widgets/mcs-widgets-number.js"></script>
<script defer src="widgets/mcs-widgets-measure.js"></script>
<script defer src="widgets/mcs-widgets-space.js"></script>
<script defer src="widgets/mcs-widgets-data.js"></script>
<script defer src="widgets/mcs-question-adapter.js"></script>
<!-- then the page's own yearN-practice.js -->
```

Pages that use no manipulatives may omit `konva.min.js`; pages without maths input may omit `mathlive.min.js` — each `mcs-*.js` file degrades gracefully (feature-detects its library and registers nothing if absent).

Each first-party file is an IIFE:

```javascript
// widgets/mcs-board.js
(function (MCS) {
  'use strict';
  if (typeof JXG === 'undefined') return;   // library not loaded on this page

  MCS.board = { /* factories */ };
})(window.MCS = window.MCS || {});
```

---

## 3. The Widget Contract

Every widget — whether JSXGraph-backed, Konva-backed, MathLive-backed, or plain DOM — implements one interface. This is the keystone of the whole plan: **validators stop scraping the DOM and start asking widgets for their value.**

```javascript
/**
 * Created via: const w = MCS.create('coordinate-plotter', container, config);
 */
const WidgetInstance = {
  /** Current student answer/state, in mathematical terms (not pixels). */
  getValue() {},          // e.g. {x: 3, y: -2} | [{num:3, den:4}] | "14:35" | 7

  /** Programmatically set state (used by hints, solutions, replays). */
  setValue(value) {},

  /** Lock interaction after submit / during feedback. */
  setEnabled(bool) {},

  /** Animate/display the correct answer on the widget itself. */
  showSolution(solutionValue) {},

  /** Visual feedback pulses on the widget (green flash, red shake). */
  flagCorrect() {}, flagIncorrect() {},

  /** Subscribe to changes (enables live "submit" enablement, audio ticks). */
  onChange(callback) {},

  /** Tear down library objects, listeners, observers. MANDATORY before
   *  the container is reused for the next question (JSXGraph boards and
   *  Konva stages leak if not freed). */
  destroy() {},
};
```

### Registry

`mcs-core.js` holds a registry so question code never imports concrete classes:

```javascript
MCS.register('analog-clock', factoryFn);       // done inside mcs-widgets-measure.js
const clock = MCS.create('analog-clock', el, { hours: 3, minutes: 45, draggableHands: true, band: 'B' });
```

`config.band` (`'A' | 'B' | 'C'`, see `06-UX-Accessibility-Age-Design.md`) tunes sizes, snapping coarseness, labels, and audio for the age group — same widget, different ergonomics.

### Lifecycle rules

1. One widget container per question region; `MCS.create` throws if the container still owns a live widget (forces `destroy()` discipline).
2. Widgets are **responsive**: they observe their container with `ResizeObserver` and rescale (JSXGraph `board.resizeContainer`, Konva `stage.scale`) — fixes the current fixed-width SVG strings overflowing on small screens.
3. Widgets never write to `localStorage` or the profile; scoring stays in page code (`gainPoints`) to keep the curriculum pipeline untouched.

---

## 4. Unified Question Package API

Today there are **two incompatible question shapes** (Years 3–5 vs Year 6) and a third pattern in assessments. The adapter unifies them so new widget-based questions are written once, in one format, usable on any page.

### 4.1 The canonical shape (new questions)

```javascript
const question = {
  // — curriculum contract (unchanged semantics) —
  descriptor: 'AC9M5SP02',
  context: 'read-coordinate',
  category: 'space',                  // strand key from STRAND_THEMES

  // — presentation —
  title: 'PLOT THE WAYPOINT',         // terminal-style heading
  prompt: 'Tap the grid to plot the waypoint at (4, 7).',  // student-facing instruction
  promptAudio: null,                  // optional: id of a spoken prompt for Band A (see 06 §5)

  // — interactivity —
  widgets: [                          // declarative widget manifest
    { id: 'grid', type: 'coordinate-plotter', config: { xMax: 10, yMax: 10, mode: 'plot-point' } },
  ],
  inputs: [                           // optional MathLive / DOM inputs alongside widgets
    // { id: 'ans', type: 'math-field', config: { keyboard: 'integers' } }
  ],

  // — answer checking —
  evaluate(values) {                  // values = { grid: {x,y}, ans: MathJSON... } keyed by widget/input id
    return values.grid.x === 4 && values.grid.y === 7;
  },

  // — second-chance flow (existing UX preserved) —
  hint:   { text: 'The first number tells you how far ACROSS to go.', highlight: ['grid:x-axis'] },
  solution: { text: 'Across 4, up 7.', show: { grid: { x: 4, y: 7 } } },  // drives widget.showSolution()

  points: 10,
};
```

Key upgrades over the status quo:

- **`widgets` is declarative.** The runner creates/destroys instances; generators stop doing manual `container.innerHTML` + `addEventListener` plumbing.
- **`evaluate(values)`** receives every widget's `getValue()` result — no `document.querySelector` in validators.
- **`solution.show`** lets the existing "give up → see solution" flow *demonstrate the answer on the widget* (e.g. the clock hands animate to 3:45) instead of only printing text.
- **`hint.highlight`** lets hints visually point at widget parts (pulse the x-axis), a major pedagogical upgrade for younger students.

### 4.2 The runner

`mcs-question-adapter.js` provides one function each page calls from its existing load-question routine:

```javascript
const session = MCS.runQuestion(question, {
  widgetMount: pracInteractivePanel,   // where widgets render
  promptMount: pracTaskTitle,          // where prompt text goes
  band: 'C',
});
// session.collect()  -> values object for evaluate()
// session.dispose()  -> destroys all widgets (call before next question)
```

### 4.3 Legacy adapters (no big-bang rewrite)

Two thin shims let old and new questions coexist in the same generator arrays during migration:

```javascript
MCS.adaptLegacyY35(q)   // wraps {questionText, renderFunc, validateFunc, hintText, solutionText}
MCS.adaptLegacyY6(q)    // wraps {title, html, validate, hint, solution}
```

Both return the canonical shape (with a single passthrough pseudo-widget that runs the old `renderFunc`/`html`). Page runners are then updated **once** to consume only the canonical shape, after which individual questions migrate widget-by-widget at any pace. This is the linchpin of the low-risk migration strategy in `07-Roadmap-and-Migration.md`.

---

## 5. Theming Integration

The Command Station look must flow into library-rendered graphics.

1. **Single source of truth:** `mcs-core.js` reads the page's computed CSS custom properties at init (add them to `style.css` `:root` and theme classes if not present):

```css
:root {
  --mcs-accent: #0052ff;        /* Joshua Blue (default) */
  --mcs-accent-soft: #dfe3ff;
  --mcs-ink: #1a1c1e;
  --mcs-grid-line: #c3c5d9;
  --mcs-correct: #059669;
  --mcs-error: #ba1a1a;
}
body.theme-teal    { --mcs-accent: /* teal */; }
body.theme-amber   { --mcs-accent: /* amber */; }
body.theme-emerald { --mcs-accent: /* emerald */; }
```

2. `MCS.theme()` exposes these to widget factories, which translate them into JSXGraph attributes (`strokeColor`, `fillColor`) and Konva fills. **Result:** the Year 4 page automatically gets amber draggable points with zero per-widget styling code.
3. Typography: JSXGraph text elements and Konva labels use `JetBrains Mono` for data labels and `Work Sans` for instructions, matching `DESIGN.md`.
4. MathLive fields are styled via its CSS variables (`--caret-color`, `--selection-background-color`, etc.) mapped from the same tokens.

---

## 6. Audio & Feedback Integration

Each page already owns a small Web Audio `playSound()` helper. Rather than duplicate it again:

- `mcs-core.js` exposes `MCS.audio.register(playSoundFn)` — each page hands its existing helper to the engine at startup.
- Widgets emit semantic events (`'snap'`, `'pickup'`, `'drop'`, `'tick'`) which the engine maps to registered sounds. If no sound is registered, silence — widgets never assume audio exists.
- This adds the *feel* layer (a soft click when a clock hand snaps to a 5-minute mark) without touching the page-level success/error/badge sounds.

---

## 7. Persistence & Curriculum Pipeline (unchanged)

For absolute clarity — the following are **explicitly out of scope and untouched**:

- `joshua_math_profile` localStorage schema
- `gainPoints(...)`, `checkBadges(...)`, `solvedContexts`, `scoresByDescriptor`
- `achievements-config.js` structure (`DESCRIPTOR_BADGES.requirements.contexts` etc.)
- Assessment stage state machines (`transitionToStage`, stage containers)

New widget questions plug in *under* this pipeline: a correct `evaluate()` still results in the page calling `gainPoints(pts, true, category, descriptor, context)` exactly as today.

One config-hygiene task does ride along (tracked in `07-Roadmap`): contexts defined in `achievements-config.js` but not yet generated by any live question (e.g. `four-quadrant-plotter` for Year 6) get real widget-backed generators, closing badge dead-ends.

---

## 8. Performance & Footprint Budget

| Asset | Size (approx, minified) | Loaded on |
|-------|------------------------|-----------|
| jsxgraphcore.js | ~1.0 MB (≈300 KB gz) | Pages with boards/graphs |
| konva.min.js | ~500 KB (≈150 KB gz) | Pages with manipulatives |
| mathlive.min.js + fonts | ~700 KB + ~350 KB fonts | Pages with maths input |
| mcs-*.js (first-party) | target < 120 KB total, unminified | All upgraded pages |

Rules:

- All vendored scripts use `defer`; first paint of the page shell is never blocked.
- One JSXGraph board **or** one Konva stage per question, destroyed on question change. A Phase-1 spike test cycles 200 consecutive questions and asserts stable memory (DevTools heap snapshots) — this is the acceptance gate for the lifecycle design.
- Konva stages cap at 2 layers (static background / draggable objects) to keep redraw cost trivial.
- No widget runs a persistent rAF loop while idle; animations are tween-scoped.

---

## 9. Browser & Environment Support

- Evergreen Chrome/Edge/Firefox/Safari, desktop + tablet (iPad is the assumed Band A device).
- `file://` operation is a tested configuration for every page (automated check is impossible without tooling; the manual smoke checklist lives in `07-Roadmap` §6).
- No service workers, no network calls at runtime — fully offline once the folder is on disk.
