# Layout and Typography Contract

Full-viewport classroom presentations must maximise projector readability. Follow these rules when authoring slide content injected into `presentation_template.html`.

## Visual Theme — Coastal Science

| Token | Hex | Role |
| --- | --- | --- |
| `--navy` (deep teal) | `#0B4F6C` | Dark slides, primary text accents, chrome |
| `--blue` (seafoam) | `#1B9AAA` | Title underlines, callout borders |
| `--orange` (coral) | `#F07167` | CFU badges, interactive focus, safety accents |
| `--white` | `#F7F9FB` | Light slide background |
| `--text-dark` | `#1A2332` | Body text |
| Success | `#2A9D8F` | Correct placements |
| Error | `#C44536` | Incorrect / alerts |

**Fonts:** **Fraunces** (titles) · **Source Sans 3** (body)

**Accent style:** Soft seafoam left borders on callouts; coral reserved for CFU and interactive focus; 8px radii; avoid heavy offset shadows.

## Viewport Shell

| Rule | Value |
| --- | --- |
| Slide dimensions | `100vw × 100vh` per `<section class="slide">` |
| Container | `#presentationContainer` with `scroll-snap-type: y mandatory` |
| Slide padding | `40px 70px 80px` — bottom padding clears `#masterToolbar` |
| Page overflow | `html, body { overflow: hidden }` — only the container scrolls |

## Typography Scale

| Element | Size | Class / selector |
| --- | --- | --- |
| Dark title slide h1 | 72px | `.theme-dark h1` |
| Light slide title | 46px | `h2.slide-title` |
| Body / instructions | 26px | `.content` |
| Intro / emphasis line | 28–32px | `.intro-text`, inline on key prompts |
| Card / label text | 22–24px minimum | Never below 22px for class-visible text |
| Teacher notes (drawer) | 16–18px | Inside hidden `.teacher-notes` only |

## Layout Helpers (Prefer Over Inline Styles)

Use semantic classes from the template stylesheet:

- `.intro-text` — bold framing line for an activity
- `.remember-box` — rule highlight (seafoam left border)
- `.scenario-box` — word-problem or mission framing
- `.grid-container` — two-column comparison grids
- `.quiz-container` / `.sort-container` / `.seq-container` — interactive activities

For science decks, subject extensions may add `.compare-card`, `.safety-box`, `.cfu-badge` (see electricity `shared-presentation.css`).

## Content Density Rules

1. **One job per slide** — one headline, one activity or explanation block.
2. **Fill the slide** — use `flex: 1` on `.content`; set `style="height:100%"` on activity containers when the slide is interaction-heavy.
3. **Move verbosity to notes** — long pedagogical guidance belongs in hidden `.teacher-notes`, not on the projected slide.
4. **Images** — use `max-height: 55vh` for diagram slides so text + image fit one viewport; images are lightbox-capable.
5. **Split columns** — use CSS grid (`1fr 1fr`) inside `.content` for side-by-side comparisons; gap ≥ 32px.

## Anti-Patterns (P0 Failures)

These patterns from legacy decks are **forbidden**:

| Anti-pattern | Example | Fix |
| --- | --- | --- |
| Card-in-viewport | Centred `max-width: 1200px` card with border-radius | Full-viewport `<section class="slide">` |
| Always-visible notes | Fixed 320px `.teacher-notes-panel` beside slides | Hidden `.teacher-notes` + `#teacherNotesPanel` drawer |
| Labelled pathway toggle | "Y6", "Y2", "Standard", "Support" on `#pathwayToggle` | Blank switch only; neutral `aria-label="Toggle reading pathway"` |
| Small body text | `p { font-size: 1.25rem }` (~20px) | Use `.content` at 26px |
| `<div class="slide">` | Non-semantic slide wrapper | Use `<section class="slide">` |
| JS show/hide one slide | `display:none` toggle between slides | Scroll-snap navigation (shell handles this) |

## Theme Usage

- **`theme-dark`**: Launch and review/exit slides — centred hero layout
- **`theme-light`**: All instructional, CFU, interactive, and practical slides — top-aligned content

## Reduced Motion

The template includes `@media (prefers-reduced-motion: reduce)`. Do not add animations that bypass this guard.
