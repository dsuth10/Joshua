---
name: classroom-presentation
description: Compile full-viewport interactive HTML classroom presentations with presenter toolbar, hidden teacher notes drawer, dual-level reading toggle, drawing tools, whiteboard, and image lightbox. Use when building or auditing Lesson_X.Y_Presentation.html or TP##_Presentation.html decks for any subject. Never hand-author a presentation shell from scratch.
---

# Classroom Presentation Skill

This skill owns the **canonical presentation shell** for classroom slide decks. Subject skills (e.g. `lesson-creator`, `electricity-unit-lesson-creator`) inject slide content into this wrapper — they do not rebuild navigation, toolbars, or notes panels.

## P0 Mandate (Non-Negotiable)

1. **Never** construct a replacement presentation shell from scratch.
2. **Always** load [`assets/presentation_template.html`](assets/presentation_template.html) and replace `<!-- SLIDES GO HERE DURING DYNAMIC COMPILATION -->` with validated slide markup.
3. **Always** embed teacher notes in `<div class="teacher-notes" style="display: none;">` inside each slide — never in a permanent side column visible to the class.
4. **Always** use full-viewport slides (`100vw × 100vh`, scroll-snap) with body text ≥ **26px** and slide titles ≥ **46px**.
5. **Never** label the reading-pathway toggle with year levels, difficulty, pathway names, or student-facing text. The toggle is a **blank switch only** — no "Y6", "Y2", "Standard", "Support", "Lucas", or similar on the control, its `title`, or its `aria-label` beyond a neutral phrase like "Toggle reading pathway".

## Required Wrapper IDs

The compiled file **must** contain these unaltered elements:

| ID | Purpose |
| --- | --- |
| `presentationContainer` | Scroll-snap slide container |
| `masterToolbar` | Presenter toolbar (nav, pen, highlighter, whiteboard, notes) |
| `teacherNotesPanel` | Off-canvas notes drawer |
| `whiteboardOverlay` | Full-screen virtual whiteboard |
| `imageLightbox` | Zoomable image overlay with annotation canvas |
| `pathwayToggle` | Dual-level reading toggle (shown when `.lucas-only` content exists) |
| `teacherShowAnswerBtn` | Teacher override for interactive slides |

Run the compiler integrity check in [`scripts/build_presentation.mjs`](scripts/build_presentation.mjs) before marking any deck complete.

## Progressive Disclosure

| Task | Load |
| --- | --- |
| Any presentation build | This SKILL.md + [`references/layout-and-typography.md`](references/layout-and-typography.md) |
| Dual-level decks | [`references/dual-level-authoring.md`](references/dual-level-authoring.md) + `leveled-text-creator` skill |
| Science / curriculum alignment | `curriculum-master` skill |
| Diagram slides | `excalidraw-diagram` skill |

## Slide HTML Contract

Each slide is a `<section>` (not `<div>`) inside `#presentationContainer`:

```html
<section class="slide theme-light active" id="slide-1">
  <h2 class="slide-title fade-in-up">Shared Title</h2>
  <div class="content fade-in-up delay-1">
    <div class="standard-only"><!-- Standard pathway content --></div>
    <div class="lucas-only"><!-- Support pathway content --></div>
  </div>
  <div class="teacher-notes" style="display: none;">
    <h3>Slide Notes</h3>
    <p>Presenter-only guidance.</p>
  </div>
</section>
```

- **Title / exit slides** may omit dual-level blocks when content is fully shared.
- **Instructional slides** must include both `.standard-only` and `.lucas-only` blocks.
- **Images** use `<img src="relative/path.png" alt="...">` inside `.content` — the shell enables lightbox zoom on click.
- **Interactive slides** register a `'show-answer'` listener and use two-tier feedback (see `lesson-creator` patterns).

## Compilation Workflow

```bash
node .agent/skills/classroom-presentation/scripts/build_presentation.mjs \
  --template assets/presentation_template.html \
  --slides path/to/slides.html \
  --output path/to/Lesson_X.Y_Presentation.html \
  --title "Lesson title"
```

Or import `compilePresentation()` from the build script in a subject-specific builder.

## Quality Gate Checklist

Before completing any presentation task, verify:

- [ ] Wrapper IDs present and unaltered
- [ ] Slides use `<section class="slide">` with `theme-light` or `theme-dark`
- [ ] No `.teacher-notes-panel` permanent side column
- [ ] No card-in-viewport layout (`max-width` centred card replacing full slide)
- [ ] Body text uses `.content` at 26px (no inline `font-size` below 22px on primary text)
- [ ] Dual-level instructional slides have `.standard-only` + `.lucas-only`
- [ ] `#pathwayToggle` is a blank switch — no year level, difficulty, or pathway name labels on UI chrome
- [ ] Interactive slides dispatch/listen for `'show-answer'`
- [ ] Excalidraw PNGs have co-located `.excalidraw` source in the lesson folder

## References

- [`references/layout-and-typography.md`](references/layout-and-typography.md) — viewport, fonts, spacing, layout helpers
- [`references/dual-level-authoring.md`](references/dual-level-authoring.md) — Standard vs Support pathway markup and leveled-text workflow
- [`assets/presentation_template.html`](assets/presentation_template.html) — canonical shell (~2045 lines)

## Relationship to Other Skills

- **`lesson-creator`**: Uses the same shell pattern; this skill is the extracted single source of truth. Future `lesson-creator` builds should reference this template.
- **`electricity-unit-lesson-creator`**: Adds science-specific CSS/JS extensions and slide patterns on top of this shell.
- **`leveled-text-creator`**: Calibrates Support pathway (`.lucas-only`) reading complexity while retaining domain terminology.
