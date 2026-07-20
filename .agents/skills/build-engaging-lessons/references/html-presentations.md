# Standalone HTML presentations

## Source of truth

- Find and update the generator before compiled HTML.
- Rebuild the deliverable after every source change.
- Keep lesson assets local and use relative paths.
- Avoid a build server unless the repository already requires one.

## Classroom controls

Provide previous/next, Arrow/Page/Space navigation, slide count and progress, fullscreen, hidden teacher notes, reset, visible feedback, and touch-friendly targets. Do not intercept slide keys while a student is typing.

## Media and accessibility

- Give every iframe a descriptive `title` and do not autoplay.
- Prefer privacy-enhanced embeds and provide a no-network fallback.
- Verify copyright and attribution requirements.
- Use semantic headings/buttons, informative alt text, visible focus, and strong contrast.
- Do not encode category or correctness only by colour.
- Support reduced motion for non-essential animation.

## QA

Inspect every screen at 1280×720 and 1920×1080, plus a narrower laptop view when relevant. Test correct, incorrect, retry, reset, keyboard, fullscreen, notes, timers, media fallback, and local-saving fallback. A montage helps with flow but cannot verify overflow or wrapping.

Run `scripts/audit_lesson_html.js` before browser QA.
