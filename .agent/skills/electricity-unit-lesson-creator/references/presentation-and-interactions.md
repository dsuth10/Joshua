# Interactive HTML Presentation Standard (Electricity Unit)

The HTML deck is the teacher's live control surface. It **must** be compiled via the [`classroom-presentation`](../../classroom-presentation/SKILL.md) shell — never as a bespoke card layout.

## P0 Anti-Patterns (Automatic FAIL)

These patterns from legacy decks (e.g. Lesson 1.1 TP01 prototype) are **forbidden**:

| Anti-pattern | Why it fails |
| --- | --- |
| Always-visible `.teacher-notes-panel` (320px side column) | Students see presenter notes on the projector |
| Card-in-viewport (`max-width: 1200px` centred card) | Wastes smartboard space; text too small |
| Body text ~20px (`1.25rem`) | Not readable from back of classroom |
| `<div class="slide">` with JS show/hide | Breaks scroll-snap, toolbar, and lightbox |
| Hand-built shell without `#masterToolbar` | No pen, whiteboard, or hidden notes drawer |
| Instructional slides without `.standard-only` / `.lucas-only` | Missing dual-level differentiation |

Run `node scripts/validate_presentation.mjs --path <deck.html>` before marking any TP complete.

## 1. Expected Slide Pattern

| Slide function | Typical content | Dual-level |
| --- | --- | --- |
| **Launch** | Lesson question, striking phenomenon | Shared (title slide) |
| **Learning intention** | LI + success criteria | Required |
| **Connect** | Prior-learning retrieval | Required |
| **Teach chunk 1** | Concise explanation, visual model, vocabulary | Required |
| **CFU 1** | All-student mini-whiteboard response | Required |
| **Interactive reasoning** | Sort, sequence, trace, diagnose, compare | Required (parallel activities) |
| **Teach chunk 2** | Worked example, transformation chain | Required |
| **Website/video bridge** | VC/WS purpose, focus question, launch | Required |
| **Practical briefing** | Purpose, safety, constraints | Required |
| **Journal evidence** | What to capture in JN | Required |
| **Exit** | Independent response aligned with SC | Shared or dual-level |

Target **10–12 slides** per lesson; minimum 8.

## 2. Required Wrapper (Inherited from classroom-presentation)

Do not modify these components. Subject extensions go in `assets/shared-presentation.css` and `assets/shared-interactions.js` only.

- `#masterToolbar` — nav, pen, highlighter, clear, whiteboard, notes
- `#teacherNotesPanel` — off-canvas drawer (`right: -380px` until toggled)
- `#pathwayToggle` — blank dual-level switch (no year or difficulty labels on UI)
- `#whiteboardOverlay`, `#imageLightbox` — presenter tools
- Hidden per-slide `<div class="teacher-notes" style="display: none;">`

### Science toolbar extensions (slide-level, not shell fork)

When a lesson requires WS/JN modules, add **inside slide content** (not replacing the shell):

- `.cfu-badge` — visible mini-whiteboard cue
- `.science-launch-btn` — link to WS01 module
- Reset button inside interactive slide calling interaction reset function
- Journal prompt with QR or link text on journal evidence slide

## 3. Dual-Level Reading Pathways

Every instructional slide uses sibling blocks inside `.content`:

```html
<div class="standard-only"><!-- Standard pathway reading --></div>
<div class="lucas-only"><!-- Support pathway reading --></div>
```

**P0:** Never add year-level or difficulty labels to `#pathwayToggle`. The switch is blank; only the presenter knows which position maps to which pathway.

**Authoring workflow:**

1. Draft Standard text aligned to Y6 science intent (`curriculum-master`).
2. Produce Support text via `leveled-text-creator` (Year 2 thresholds).
3. Retain domain terms with inline glosses on Support pathway.
4. Provide simplified parallel activities where Standard uses complex interactions.

See [`classroom-presentation/references/dual-level-authoring.md`](../../classroom-presentation/references/dual-level-authoring.md).

## 4. Layout and Typography

Follow [`classroom-presentation/references/layout-and-typography.md`](../../classroom-presentation/references/layout-and-typography.md):

- Full viewport slides (`100vw × 100vh`)
- Body ≥ **26px** via `.content`
- Titles ≥ **46px** via `.slide-title`
- Padding `40px 70px 80px`
- Diagrams: `.slide-image-wrap img` at `max-height: 55vh`, lightbox on click

## 5. Two-Tier Feedback

- **Tier 1**: Shake / outline — no answer revealed
- **Tier 2**: Targeted scientific hint in `.hint-box`
- **Teacher override**: `'show-answer'` CustomEvent → `#teacherShowAnswerBtn` in notes footer

## 6. Excalidraw Diagram Contract

1. Create/edit `[name].excalidraw` in the lesson folder (`excalidraw-diagram` skill).
2. Export PNG to the same folder: `node .agent/skills/excalidraw-diagram/scripts/render_excalidraw.py [file].excalidraw`
3. Embed: `<img src="[name].png" alt="Descriptive alt text">` inside `.slide-image-wrap`
4. Validator checks PNG exists and `.excalidraw` co-located for diagram assets.

## 7. Science Interaction Library

| Mode | Cognitive purpose | Validation |
| --- | --- | --- |
| **Source-Form Sorter** | Distinguish source from form | Category check + distractor hints |
| **Circuit Path Tracer** | Analyse closed path | Continuous valid route |
| **Circuit State Toggle** | Predict switch effects | State logic + keyboard |
| **Component-Symbol Matcher** | Physical ↔ symbol | Mapping validation |
| **Energy Chain Builder** | Sequence source → forms → device | Order + label check |
| **Fault Finder** | Evidence-led diagnosis | Rejects random guesses |
| **Fair-Test Planner** | Investigation variables | Variable match |
| **Diagram Translator** | Layout ↔ conventional diagram | Connection validation |
| **Evidence Comparator** | Source comparison table | Consistent criteria |
| **Scenario Decision Board** | Energy mix trade-offs | Constraint check |
| **Input-Control-Output Mapper** | Sensor/switch logic | Relationship check |
| **Risk-Control Matcher** | Hazard → control | Rejects unsafe mains investigation |

Use `data-interaction="source-form-sorter"` on interactive slide sections; logic in `shared-interactions.js`.

## 8. Build Command

```bash
node .agent/skills/electricity-unit-lesson-creator/scripts/build_presentation.mjs \
  --slides "Units/Science/Unit 3 Electricity/Lesson_Plans/Lesson_1.1/tp01_slides.html" \
  --output "Units/Science/Unit 3 Electricity/Lesson_Plans/Lesson_1.1/TP01_Presentation.html" \
  --title "Lesson 1.1: Energy All Around Us" \
  --resource-id TP01
```

Then validate:

```bash
node .agent/skills/electricity-unit-lesson-creator/scripts/validate_presentation.mjs \
  --path "Units/Science/Unit 3 Electricity/Lesson_Plans/Lesson_1.1/TP01_Presentation.html"
```
