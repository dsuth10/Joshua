# Build Plan: The Trembling Earth
## Australian Severe Weather — Volume IV
**Location:** `c:\Users\dsuth\Documents\Joshua\Units\English\English_Unit_2\Earthquakes\`
**Copy source:** `copy_the_trembling_earth.md` (in this folder)
**Design reference:** `../Floods/` (CSS architecture, component patterns, tooltip system)

---

## 1. PROJECT OVERVIEW

| Attribute | Detail |
|---|---|
| Site name | The Trembling Earth |
| Series | Australian Severe Weather — Volume IV |
| Reading level | Upper secondary / first-year undergraduate |
| Pages | 6 (1 hub + 5 sub-pages) |
| Design parent | Floods Archive (adapted, not identical) |
| Primary colour | Earthy amber-rust — distinct from Floods teal |
| Special components | Seismic wave diagram, magnitude comparison chart, fault-type diagram, sidebar pop-outs (Newcastle, Christchurch) |

---

## 2. FILE STRUCTURE

```
Earthquakes/
├── index.html                      ← Hub page
├── index.css                       ← Global stylesheet (adapted from Floods)
├── copy_the_trembling_earth.md     ← Content reference (this folder)
├── build_plan.md                   ← This document
│
├── Assets/
│   ├── tooltip.js                  ← Copied & adapted from Floods (new glossary)
│   ├── glossary.js                 ← Earthquake-specific term definitions
│   ├── lightbox.js                 ← Copied directly from Floods
│   ├── earthquakes_hero.png        ← (to be generated) Hub hero image
│   ├── seismic_waves_diagram.png   ← (to be generated) P/S/surface wave explainer
│   ├── fault_types_diagram.png     ← (to be generated) Normal/reverse/strike-slip
│   ├── plate_boundaries_diagram.png← (to be generated) Convergent/divergent/transform
│   ├── magnitude_chart.png         ← (to be generated) Logarithmic scale comparison
│   └── liquefaction_diagram.png    ← (to be generated) Liquefaction mechanism
│
├── Mechanics_of_Earthquakes/
│   └── index.html
│
├── Plate_Tectonics/
│   └── index.html
│
├── Fault_Types/
│   └── index.html
│
├── Australian_Seismicity/
│   └── index.html
│
└── Secondary_Hazards/
    └── index.html
```

---

## 3. DESIGN SYSTEM

### 3.1 Colour Palette

The Floods Archive uses **deep teal** (`#1e7a74`). The Earthquakes site needs a distinct geological identity. The choice is **warm amber-rust**, referencing cracked earth, geological strata, and the warm tones of Australian rock.

```css
:root {
  /* Primary — warm amber-rust (geological, earthy) */
  --primary: #c2692a;
  --primary-rgb: 194, 105, 42;
  --primary-dark: #8a3f0f;
  --primary-dark-rgb: 138, 63, 15;
  --primary-light: #fde8d8;
  --primary-light-rgb: 253, 232, 216;

  /* Surfaces — deep charcoal with warm undertone (vs Floods cold blue-black) */
  --surface-dim: #0f0b08;
  --surface-dim-rgb: 15, 11, 8;
  --surface: #1a1209;
  --surface-rgb: 26, 18, 9;
  --surface-container-low: #221810;
  --surface-container-low-rgb: 34, 24, 16;
  --surface-container: #2c2016;
  --surface-container-rgb: 44, 32, 22;
  --surface-container-high: #382a1e;
  --surface-container-high-rgb: 56, 42, 30;

  /* Text */
  --on-surface: #ede0d4;
  --on-surface-rgb: 237, 224, 212;
  --on-surface-variant: #a88c78;
  --on-surface-variant-rgb: 168, 140, 120;
  --outline-variant: #3d2d1e;
  --outline-variant-rgb: 61, 45, 30;

  /* Accent — a cool slate-blue to contrast the warm earth tones */
  --accent-amber: #e8a44a;
  --accent-amber-rgb: 232, 164, 74;
  --accent-light: #fdf4ec;
  --accent-light-rgb: 253, 244, 236;

  /* Typography — same as Floods for consistency */
  --font-display: 'Syne', sans-serif;
  --font-body: 'Lora', serif;
  --font-meta: 'Outfit', sans-serif;
}
```

### 3.2 Typography

Identical to Floods Archive — Syne (display), Lora (body), Outfit (meta/labels).

```html
<link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,600&family=Outfit:wght@200;300;400;500&family=Syne:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
```

### 3.3 Icon (Material Symbols)

Hub nav icon: `earthquake` or `landslide` (both available in Material Symbols Outlined).
Preferred: `earthquake`

---

## 4. CSS ARCHITECTURE

`index.css` is adapted from `../Floods/index.css` with these changes:

| Section | Change |
|---|---|
| `:root` colour tokens | Full palette swap — warm amber-rust (see §3.1) |
| `.hub-hero` | Same structure; hero image opacity `0.45` (slightly higher — earthquake imagery is darker) |
| `.pull-quote` | Same structure; border-left uses `--primary` not `--accent-amber` |
| `.fact-box` | Same structure |
| `.chapter-card` | Same structure |
| **NEW: `.sidebar-pop`** | Historical pop-out card style (see §5 below) |
| **NEW: `.seismic-diagram`** | Full-width image breakout with labelled caption |
| **NEW: `.magnitude-scale`** | Visual comparison bar for magnitude scale on sub-page 2 |
| **NEW: `.fault-diagram`** | Diagram wrapper for fault-type explainer on sub-page 4 |
| Responsive breakpoints | Same as Floods (768px, 992px) |

### 3.4 New CSS Component: `.sidebar-pop` (Historical Pop-out)

The historical callout box (Newcastle, Christchurch) needs its own distinctive style — different from a standard `fact-box`. It should read as a "chapter aside" with a coloured left accent and slightly elevated background.

```css
.sidebar-pop {
  background: var(--surface-container);
  border: 1px solid var(--outline-variant);
  border-left: 4px solid var(--accent-amber);
  border-radius: 4px;
  padding: 2rem;
  margin: 3rem 0;
}

.sidebar-pop .pop-eyebrow {
  font-family: var(--font-meta);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  font-size: 0.75rem;
  color: var(--accent-amber);
  margin-bottom: 0.75rem;
  font-weight: 600;
}

.sidebar-pop h4 {
  font-family: var(--font-display);
  font-size: 1.1rem;
  color: var(--accent-light);
  margin-bottom: 1rem;
}

.sidebar-pop p {
  font-size: 0.95rem;
  color: var(--on-surface-variant);
  line-height: 1.65;
}

.sidebar-pop .pop-data {
  font-family: var(--font-meta);
  font-size: 0.8rem;
  letter-spacing: 0.05em;
  color: var(--accent-amber);
  margin-top: 1.25rem;
  padding-top: 1rem;
  border-top: 1px solid var(--outline-variant);
}
```

---

## 5. JAVASCRIPT COMPONENTS

### 5.1 tooltip.js + glossary.js

Copy `../Floods/Assets/tooltip.js` directly into `Assets/tooltip.js` — the tooltip engine is content-agnostic. Then create `Assets/glossary.js` with the 20 earthquake-specific definitions from the copy document.

Structure matches the Floods `floods-glossary.js` exactly:

```javascript
const earthquakeGlossary = {
  "hypocenter": "The actual point underground where an earthquake rupture begins...",
  "epicenter": "The point on the Earth's surface directly above the hypocenter...",
  // ... all 20 terms from the copy document glossary section
};
```

Each sub-page `<script>` block at bottom:
```html
<script src="../Assets/tooltip.js"></script>
<script src="../Assets/glossary.js"></script>
```

Hub page:
```html
<script src="Assets/tooltip.js"></script>
<script src="Assets/glossary.js"></script>
```

### 5.2 lightbox.js

Copy directly from `../Floods/Assets/lightbox.js`. No modifications required — it operates on `class="lightbox-trigger"` which we will apply to all diagrams and infographic images.

### 5.3 Scroll Reveal

Each sub-page uses the same IntersectionObserver pattern as Floods sub-pages — inline `<script>` at the bottom of each file, observing `.reveal` class elements.

---

## 6. ASSETS TO GENERATE

All images are AI-generated using the `generate_image` tool. Style target: **scientific editorial illustration**, dark background, geological colour palette (warm ochre, slate, charcoal), clean and informative — not photographic.

| File | Description | Used on |
|---|---|---|
| `earthquakes_hero.png` | Aerial or abstract view of cracked earth / fault landscape at dusk; dramatic lighting; no text | Hub hero |
| `seismic_waves_diagram.png` | P-wave, S-wave, Love wave, Rayleigh wave propagation diagram; 4 panels; dark bg with amber/white labels | Mechanics sub-page |
| `magnitude_chart.png` | Logarithmic comparison: Mw5.6 Newcastle vs Mw9.1 Tohoku — visual bar/scale; conveys the ×63M difference | Mechanics sub-page |
| `fault_types_diagram.png` | Three-panel: Normal / Reverse / Strike-slip; 3D block diagrams; arrows showing stress direction and displacement | Fault Types sub-page |
| `plate_boundaries_diagram.png` | Three-panel: Convergent (subduction) / Divergent / Transform; cross-section style; global examples labelled | Plate Tectonics sub-page |
| `liquefaction_diagram.png` | Before/during/after sequence: solid sand → shaking → liquefied → sand boils + settled building | Secondary Hazards sub-page |

*Note: If the `generate_image` tool cannot produce accurate scientific diagrams, fallback plan is to use descriptive `<figure>` elements with placeholder styling and `aria-label` providing the full visual description, pending manual image creation.*

---

## 7. PAGE-BY-PAGE BUILD SPECIFICATION

### 7.1 HUB PAGE — `index.html`

**Layout:** Same structural pattern as Floods `index.html`

**Sections to build:**

| Section | HTML class/element | Notes |
|---|---|---|
| Nav | `<nav class="site-nav">` | Icon: `earthquake` (Material Symbol), brand text: "The Trembling Earth" |
| Hero | `<header class="hub-hero">` | Hero image container + overlay + content div. Eyebrow: "Australian Severe Weather — Volume IV" |
| Stats strip | `<section class="stats-strip">` | 5 stat items from copy doc. Stats 1, 3, 5 have `.accent` class |
| Intro | `<section class="article-container">` | H2 + 3 paragraphs from copy doc.`data-tooltip` spans on: *elastic rebound, hypocenter, intraplate earthquake, seismic hazard* |
| Rule divider | `<hr class="rule-divider">` | — |
| Chapter cards | `<section><div class="chapter-grid">` | 5 chapter cards. Each is `<a href="SubFolder/index.html" class="chapter-card">`. Card structure: eyebrow → h3 → p.card-teaser → div.card-footer |
| Rule divider | `<hr class="rule-divider">` | — |
| About | `<section class="article-container">` | 2-column grid: About text + Key Sources list |
| Footer | `<footer class="site-footer">` | Nav links to all 5 sub-pages |

**Tooltip terms on hub page:**
- `seismic hazard`
- `intraplate earthquake`
- `Indo-Australian Plate`
- `hypocenter`

---

### 7.2 SUB-PAGE 1 — `Mechanics_of_Earthquakes/index.html`

**Layout:** Article + sticky sidebar (2-column grid: `1fr 340px`)

**Section map:**

| # | H2 | Key tooltip terms | Sidebar element |
|---|---|---|---|
| 1 | The Elastic Earth | `elastic rebound` | — |
| 2 | Hypocenter and Epicenter | `hypocenter`, `epicenter` | SIDEBAR-DATA: 31.6× (below section 4) |
| 3 | Seismic Waves | `P-waves`, `S-waves`, `surface waves` | SIDEBAR-FACT: Wave Types at a Glance |
| 4 | Measuring Magnitude | `Moment Magnitude Scale`, `seismic moment` | — |
| — | — | — | SIDEBAR-POP: Newcastle 1989 |

**Full-width breakout image:** `seismic_waves_diagram.png` between sections 3 and 4.

**Pull-quote** (between sections 1 and 2):
> "The ground we stand on is, in this sense, a slow-motion spring — and earthquakes are what happens when it runs out of patience."

**References:** 5 items (see copy doc)

---

### 7.3 SUB-PAGE 2 — `Plate_Tectonics/index.html`

**Layout:** Same article + sidebar

**Section map:**

| # | H2 | Key tooltip terms | Sidebar element |
|---|---|---|---|
| 1 | The Engine Beneath | `subduction`, `Indo-Australian Plate` | SIDEBAR-QUOTE: Geoscience Australia |
| 2 | The Three Types of Plate Boundary | `megathrust` | SIDEBAR-FACT: Boundary Types at a Glance |
| 3 | Subduction Zones and the Origin of Megaquakes | `megathrust`, `tsunami` | SIDEBAR-DATA: 90% |
| 4 | The Ring of Fire and the World Beyond It | `seismic hazard`, `intraplate earthquake` | SIDEBAR-POP: Christchurch 2010–11 |

**Full-width breakout image:** `plate_boundaries_diagram.png` between sections 2 and 3.

**Pull-quote** (in section 1):
> "The plates move slowly — most travel between 2 and 15 centimetres per year, roughly the rate at which your fingernails grow."

---

### 7.4 SUB-PAGE 3 — `Fault_Types/index.html`

**Layout:** Same article + sidebar

**Section map:**

| # | H2 | Key tooltip terms | Sidebar element |
|---|---|---|---|
| 1 | What Is a Fault? | `neotectonic` | SIDEBAR-FACT: Fault Mechanisms at a Glance |
| 2 | The Three Fault Types | `intraplate earthquake` | SIDEBAR-DATA: 480 km |
| 3 | Intraplate vs. Interplate Earthquakes | `intraplate earthquake`, `neotectonic` | SIDEBAR-FACT-ALT: How Deep is your earthquake? |
| 4 | Focal Depth and Its Consequences | `hypocenter` | — |

**Full-width breakout image:** `fault_types_diagram.png` after section 2 heading, before body text.

**Pull-quote** (in section 2):
> "The hanging wall is pushed upward and over the foot wall... the compressive stress generated by the northern margin of the Indo-Australian Plate is transmitted southward into the continent's interior."

---

### 7.5 SUB-PAGE 4 — `Australian_Seismicity/index.html`

**Layout:** Same article + sidebar. This is the longest sub-page (5 sections).

**Section map:**

| # | H2 | Key tooltip terms | Sidebar element |
|---|---|---|---|
| 1 | The Myth of the Stable Continent | `seismic hazard` | — |
| 2 | The Indo-Australian Plate: A Continent Under Compression | `Indo-Australian Plate`, `intraplate earthquake` | SIDEBAR-QUOTE: Clark & Leonard |
| 3 | Where Australia Shakes | `neotectonic` | SIDEBAR-FACT: Australia's Major Earthquakes |
| 4 | The Hidden Hazard: Unmapped Faults | `seismic hazard`, `neotectonic` | SIDEBAR-DATA: ML 6.9 |
| 5 | December 1989 (Newcastle deep-dive) | `elastic rebound`, `hypocenter` | — |

**Pull-quote** (section 3):
> "The geological return period may be so long that no surface rupture has occurred in the Holocene — and without surface rupture, detection from above is largely impossible."

**Note on section 5:** This section is the most extended body of text on any sub-page. Consider splitting it visually with a `<hr class="rule-divider">` before the "December 1989" heading to give it the visual weight of a sub-chapter within the page.

---

### 7.6 SUB-PAGE 5 — `Secondary_Hazards/index.html`

**Layout:** Same article + sidebar

**Section map:**

| # | H2 | Key tooltip terms | Sidebar element |
|---|---|---|---|
| 1 | Liquefaction | `liquefaction`, `sand boils` | SIDEBAR-FACT: Secondary Hazard Chain |
| 2 | Tsunamis | `tsunami`, `wave shoaling`, `megathrust` | SIDEBAR-DATA: 230,000+ |
| 3 | Landslides, Rock Falls, and Slope Failure | — | — |
| 4 | Aftershocks | `aftershock`, `Omori's Law` | SIDEBAR-POP: Christchurch Liquefaction |
| 5 | Fire, Infrastructure Failure, and Cascade Effects | — | SIDEBAR-QUOTE: GNS Science |

**Full-width breakout image:** `liquefaction_diagram.png` within section 1 (after the mechanism explanation paragraph, before the Canterbury case).

**Pull-quote** (section 2):
> "The ocean receding dramatically from the shore is not a curiosity. It is the trough of an incoming wave train — and it is among the most reliable natural warning signs of an imminent tsunami."

---

## 8. SHARED SUB-PAGE TEMPLATE STRUCTURE

Every sub-page follows this HTML skeleton (identical to Floods sub-pages):

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[Page Title] | The Trembling Earth</title>
    <meta name="description" content="[150-char description]">

    <!-- Fonts -->
    [Google Fonts link block]
    [Material Symbols link]

    <!-- Global CSS -->
    <link rel="stylesheet" href="../index.css">

    <!-- Page-specific styles -->
    <style>
        /* article-hero, article-layout, sidebar, breadcrumb,
           cite-sup, references, img-caption, expert-quote,
           full-width-breakout — same patterns as Floods sub-pages */
    </style>
</head>
<body>
    <!-- Nav -->
    <nav class="site-nav"> ... </nav>

    <main class="container">
        <!-- Article header -->
        <header class="article-hero">
            <div class="breadcrumb"> ... </div>
            <h1> ... </h1>
            <p class="editorial-deck"> ... </p>
            <div class="eyebrow eyebrow-flex">
                <span class="material-symbols-outlined">schedule</span> N Min Read
            </div>
        </header>

        <!-- Article layout: 2 columns -->
        <div class="article-layout">
            <article class="article-body">
                <!-- Numbered H2 sections -->
                <!-- Pull-quotes -->
                <!-- Full-width breakout images -->
                <!-- References section -->
            </article>

            <aside class="sidebar">
                <!-- SIDEBAR-FACT boxes -->
                <!-- SIDEBAR-DATA callouts -->
                <!-- SIDEBAR-QUOTE -->
                <!-- SIDEBAR-POP (historical pop-out) -->
            </aside>
        </div>
    </main>

    <!-- Scripts -->
    <script src="../Assets/tooltip.js"></script>
    <script src="../Assets/glossary.js"></script>
    <script src="../Assets/lightbox.js"></script>
</body>
</html>
```

---

## 9. TOOLTIP TERM DEPLOYMENT

Terms from the glossary must be wrapped in `data-tooltip` spans where they appear in body text. **Each term: first occurrence per page only.**

Priority deployment targets per page:

| Page | Priority terms to wrap |
|---|---|
| Hub | `seismic hazard`, `intraplate earthquake`, `Indo-Australian Plate` |
| Mechanics | `elastic rebound`, `hypocenter`, `epicenter`, `P-waves`, `S-waves`, `surface waves`, `Moment Magnitude Scale`, `seismic moment` |
| Plate Tectonics | `subduction`, `megathrust`, `Indo-Australian Plate`, `tsunami`, `intraplate earthquake` |
| Fault Types | `intraplate earthquake`, `neotectonic`, `hypocenter` |
| Australian Seismicity | `seismic hazard`, `intraplate earthquake`, `neotectonic`, `Indo-Australian Plate` |
| Secondary Hazards | `liquefaction`, `sand boils`, `tsunami`, `wave shoaling`, `aftershock`, `Omori's Law` |

---

## 10. BUILD PHASES & CHECKLIST

### PHASE 1 — Setup & Design System
- [ ] Create `Earthquakes/index.css` (adapt Floods CSS — new colour tokens, same structure, add new components)
- [ ] Create `Earthquakes/Assets/` folder
- [ ] Copy `tooltip.js` from Floods Assets into `Earthquakes/Assets/`
- [ ] Copy `lightbox.js` from Floods Assets into `Earthquakes/Assets/`
- [ ] Create `Earthquakes/Assets/glossary.js` (20 earthquake terms from copy doc)
- [ ] Create all 5 sub-page folders (empty `index.html` placeholders)

### PHASE 2 — Asset Generation
- [ ] Generate `earthquakes_hero.png` (hub hero — cracked earth, dramatic)
- [ ] Generate `seismic_waves_diagram.png` (P/S/surface wave explainer)
- [ ] Generate `fault_types_diagram.png` (normal/reverse/strike-slip)
- [ ] Generate `plate_boundaries_diagram.png` (3 boundary types)
- [ ] Generate `liquefaction_diagram.png` (mechanism sequence)
- [ ] Generate `magnitude_chart.png` (logarithmic scale comparison)

### PHASE 3 — Hub Page
- [ ] Build `index.html` — nav, hero, stats strip, editorial intro, chapter cards, about, footer
- [ ] Apply `data-tooltip` spans to hub intro text
- [ ] Test all chapter card links (will 404 until sub-pages are built — acceptable)
- [ ] Confirm CSS renders correctly in browser

### PHASE 4 — Sub-pages (build in order)
- [ ] **Sub-page 1:** `Mechanics_of_Earthquakes/index.html`
  - [ ] Article header + deck
  - [ ] Sections 1–4 with body text from copy doc
  - [ ] Full-width breakout: seismic_waves_diagram.png
  - [ ] Pull-quote block
  - [ ] Sidebar: wave types fact-box + 31.6× data callout + Newcastle sidebar-pop
  - [ ] Tooltip spans applied
  - [ ] References section
- [ ] **Sub-page 2:** `Plate_Tectonics/index.html`
  - [ ] Sections 1–4
  - [ ] Full-width breakout: plate_boundaries_diagram.png
  - [ ] Pull-quote block
  - [ ] Sidebar: boundary fact-box + 90% data callout + Geoscience Australia quote + Christchurch sidebar-pop
  - [ ] Tooltips + references
- [ ] **Sub-page 3:** `Fault_Types/index.html`
  - [ ] Sections 1–4
  - [ ] Full-width breakout: fault_types_diagram.png
  - [ ] Pull-quote block
  - [ ] Sidebar: 2 fact-boxes + 480 km data callout
  - [ ] Tooltips + references
- [ ] **Sub-page 4:** `Australian_Seismicity/index.html`
  - [ ] Sections 1–5 (longest page; add visual divider before section 5)
  - [ ] Pull-quote block
  - [ ] Sidebar: ML 6.9 data callout + major earthquakes fact-box + Clark & Leonard quote
  - [ ] Tooltips + references
- [ ] **Sub-page 5:** `Secondary_Hazards/index.html`
  - [ ] Sections 1–5
  - [ ] Full-width breakout: liquefaction_diagram.png
  - [ ] Pull-quote block
  - [ ] Sidebar: hazard chain fact-box + 230,000+ data callout + Christchurch liquefaction sidebar-pop + GNS Science quote
  - [ ] Tooltips + references

### PHASE 5 — Cross-site Wiring
- [ ] Update footer on all pages to link to all other sub-pages
- [ ] Confirm all breadcrumb links return to `index.html`
- [ ] Confirm all chapter cards on hub link to correct sub-page folders
- [ ] Test tooltip system: hover each `data-tooltip` span, confirm glossary populates
- [ ] Test lightbox: click each diagram image, confirm overlay opens/closes
- [ ] Confirm `Material Symbols Outlined` icons render on nav, breadcrumbs, read-time indicator

### PHASE 6 — Polish & QA
- [ ] Confirm Australian English spelling throughout (colour, behaviour, artefact, recognise, analyse)
- [ ] Confirm metric units throughout
- [ ] Spell-check all proper nouns: Meckering, Yilgarn, Christchurch, Greendale, Kahramanmaras, Tohoku, Huascaran
- [ ] Confirm all `data-tooltip` spans have definitions in `glossary.js`
- [ ] Run through each page on a narrow viewport (768px) — confirm sidebar collapses gracefully
- [ ] Review all responsive breakpoints
- [ ] Add `<meta name="description">` to every page (descriptions from copy doc chapter card teasers)
- [ ] Final visual pass: palette consistency, pull-quote styling, fact-box borders

---

## 11. DESIGN DECISIONS & RATIONALE

### Why warm amber-rust and not another colour?

The Bushfires site is orange-amber (fire). The Cyclones site is blue. The Floods site is teal. The Earthquakes site needs to feel *geological* — earthy, ancient, warm. Amber-rust evokes cracked desert rock, ochre strata, and Australian sandstone. It is close enough to the Bushfires palette to feel part of the same series while remaining distinct.

### Why keep the same typography?

The series coherence is maintained through typography, editorial voice, and layout grid — not through colour. Changing the typeface would break the "family" feeling that signals to the reader this is Volume IV of the same archive.

### Why is `Australian_Seismicity` the longest page?

It is the pedagogical centrepiece — the page that delivers on the site's core promise ("Australia shakes too"). It earns its length by building the argument systematically: myth busting → mechanism → regional evidence → unknown hazard → direct case study. The Newcastle deep-dive in Section 5 functions as an emotional and factual anchor for the entire site.

### Why Christchurch on two separate pages?

Christchurch appears in Page 3 (Plate Tectonics) as a demonstration of aftershock hazard and unmapped faults, and in Page 6 (Secondary Hazards) as the definitive liquefaction case study. These are genuinely different lessons and do not repeat. The content in each pop-out is distinct.

---

## 12. CONTENT QUALITY STANDARDS

All body copy is written to these standards:
- **Sentence length:** Varied — long analytical sentences followed by short emphatic ones (flood-archive pattern)
- **Analogies before formalism:** Every physics concept introduced with a concrete physical analogy before the technical definition
- **Named real events:** Always specific (Newcastle 1989, Darfield 2010, Tohoku 2011) — never "a recent earthquake in Australia"
- **Numbers as meaning:** Statistics are always explained — not just presented. "31.6 times more energy — not 10 times as commonly believed" is the model
- **Australian grounding:** First mention of any concept includes its Australian relevance

---

*End of build plan — The Trembling Earth*
*Last updated: 2026-04-17*
