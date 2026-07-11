# Electricity Presentation Assets

The canonical presentation shell lives in [`classroom-presentation`](../../classroom-presentation/SKILL.md).

| File | Purpose |
| --- | --- |
| `presentation_template.html` | Copy of classroom-presentation shell (with Y6/Y2 toggle labels) |
| `shared-presentation.css` | Science layout extensions (CFU badge, compare cards, safety box) |
| `shared-interactions.js` | Science interaction helpers (Source-Form Sorter, etc.) |

Build with:

```bash
node ../scripts/build_presentation.mjs --slides <slides.html> --output <TP##_Presentation.html> --title "..." --resource-id TP##
```

Validate with:

```bash
node ../scripts/validate_presentation.mjs --path <TP##_Presentation.html>
```

Do not edit the shell IDs or rebuild toolbar/notes/whiteboard from scratch.
