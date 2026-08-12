# Presentation contract

Use this reference whenever building or changing the standalone classroom HTML presentation.

## Compiler contract

1. Prefer `../scripts/compile_presentation.py`, or import its `compile_presentation` function from the lesson generator.
2. Read `../assets/presentation_template.html` as text.
3. Replace `<!-- SLIDES GO HERE DURING DYNAMIC COMPILATION -->` with the lesson's `<section class="slide">` blocks.
4. Inject lesson-owned CSS before `</head>` and lesson-owned JavaScript before `</body>`.
5. Write one standalone compiled HTML file into the lesson folder.
6. Keep the lesson generator authoritative; rebuild after every source change.

Do not copy the wrapper into a lesson and edit navigation or drawing systems there. Keep lesson-specific slide HTML, CSS and JavaScript in the lesson folder and compile them through the wrapper.

## Required wrapper elements

The compiled file must retain these IDs:

- `presentationContainer`
- `masterToolbar`
- `prevSlideBtn`
- `nextSlideBtn`
- `cursorModeBtn`
- `penModeBtn`
- `highlighterModeBtn`
- `clearCanvasBtn`
- `whiteboardToggleBtn`
- `fullscreenBtn`
- `pathwayToggle`
- `pathwayToggleBtn`
- `imageLightbox`
- `lightboxCanvas`
- `teacherNotesPanel`
- `teacherShowAnswerBtn`
- `whiteboardOverlay`
- `whiteboardCanvas`

Treat a missing required element as compiler corruption, not a cosmetic defect.

## Slide structure

Use:

```html
<section class="slide theme-light">
  <h2 class="slide-title">Student-facing title</h2>
  <div class="content">...</div>
  <div class="teacher-notes">
    <p><b>DO</b> ...</p>
    <p><b>WORK</b> ...</p>
    <p><b>RECORD</b> ...</p>
    <p><b>FINISH</b> ...</p>
    <p><b>CHECK</b> ...</p>
  </div>
</section>
```

Do not project teacher logistics as a persistent strip. Put them in the notes drawer unless the user explicitly requests otherwise.

## Interaction contract

Use an interaction only when it exposes a meaningful decision or misconception.

For a scored or classifiable interaction:

1. accept a deliberate student selection;
2. on the first error, show a brief retry signal and retain agency;
3. on the second error, reveal a specific hint;
4. provide a reset path when the activity may be reused;
5. register a `show-answer` listener on the slide;
6. make the final correct state visible and stable;
7. preserve state when the language view changes.

Example listener:

```js
slide.addEventListener('show-answer', () => {
  revealCorrectState();
  lockOrExplainAnswer();
});
```

Use `.cfu-badge` when the teacher should collect an all-student response before clicking.

## Projection and accessibility

- Target 1280 x 720 first; also inspect a larger classroom display.
- Keep slide titles near 46 px and body copy near 26 px unless a tested layout requires adjustment.
- Keep important content clear of the bottom toolbar and right-side slide dots.
- Prevent horizontal overflow. Hide presentation-container scrollbars without disabling navigation.
- Use visible focus states and touch targets of approximately 44 px or larger.
- Give icon-only controls accessible names.
- Do not communicate correctness only through colour.
- Use Australian spelling.

## QA sequence

1. Run `scripts/validate_presentation.py`.
2. Open the compiled deck in a browser.
3. Inspect every slide at 1280 x 720.
4. Exercise all controls and interaction states.
5. Test both language views when present.
6. Check console errors and missing local assets.
7. Confirm fullscreen, notes, drawing and whiteboard behaviour.
