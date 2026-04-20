---
name: english-unit-2-lesson-builder
description: Produce a full classroom-ready lesson package (teacher lesson plan .docx, PowerPoint slides with live archive screenshots, Year 5 student worksheet, Year 2 differentiated worksheet for Lucas, plus answer key / anchor chart / sort cards) for any lesson in Year 5 English Unit 2 — Informative Texts. Use when the user asks for lesson materials, slides, worksheets, or a lesson plan for Unit 2, a numbered lesson (e.g. "Lesson 3", "Lesson 12"), or a week in the Cyclones / Floods / Bushfires / Earthquakes archives. Also applicable to future units that follow the same archive-based teaching sequence pattern.
---

# English Unit 2 — Lesson Builder

Generates the full lesson package for Year 5 English Unit 2 (Tarampa State School, Term 2). Outputs mirror Lesson 1's deliverables and reuse Lesson 1's Node scripts as canonical templates.

## Inputs the agent needs before building

1. **Lesson number(s)** — e.g. Lesson 3.
2. **Source of truth** — [Units/English/English_Unit_2/Unit_Plan/Teaching_and_Learning_Sequence.md](../../../Units/English/English_Unit_2/Unit_Plan/Teaching_and_Learning_Sequence.md). Read the specific lesson cell (Learning Intention, Teaching & Learning, Reading, Differentiation, Resources).
3. **Archive being used** — Cyclones, Floods, Bushfires, or Earthquakes. See [reference.md](reference.md) for each archive's hub aspects and screenshot selectors.
4. **Block length** — confirm with user if not 60 min.

If any of the four is unclear, ask the user before building.

## Deliverables (per lesson)

Mirror Lesson 1. File names use zero-padded lesson number (`01`, `02`, … `32`).

| Output | Path |
|---|---|
| Lesson plan | `Units/English/English_Unit_2/Lesson_Plans/Lesson_NN_<Slug>.docx` |
| Slides | `Units/English/English_Unit_2/Lesson_Plans/Lesson_NN_Slides.pptx` |
| Teacher answer key | `Units/English/English_Unit_2/Lesson_Plans/Lesson_NN_Teacher_Answer_Key.docx` |
| Y5 worksheet | `Units/English/English_Unit_2/Student_Documents/Lesson_NN_Worksheet_Y5.docx` |
| Lucas Y2 worksheet | `Units/English/English_Unit_2/Student_Documents/Lesson_NN_Worksheet_Lucas_Y2.docx` |
| Optional extras | Anchor chart, sort cards, exit ticket templates, scaffold handouts — include only when they add pedagogical value |
| Screenshots | `Units/English/English_Unit_2/Unit_Plan/Lesson_NN_Screenshots/*.png` |
| Scripts | `Units/English/English_Unit_2/Unit_Plan/_scripts/capture_lesson_NN_screenshots.js`, `generate_lesson_NN.js`, `generate_lesson_NN_slides.js` |

## Workflow

```
- [ ] 1. Read the lesson row in Teaching_and_Learning_Sequence.md
- [ ] 2. Read the matching archive copy in <archive>/copy_*.md
- [ ] 3. Draft slide map (user confirmation if slide count > 20 or content is contested)
- [ ] 4. Copy Lesson 1 scripts as templates and adapt
- [ ] 5. Capture screenshots from the archive hub or sub-page
- [ ] 6. Generate docs + slides
- [ ] 7. Verify: file sizes >0, slide count, embedded PNGs present
```

### Step 1 — Read the lesson row

Parse the row from [Teaching_and_Learning_Sequence.md](../../../Units/English/English_Unit_2/Unit_Plan/Teaching_and_Learning_Sequence.md). Extract:
- Learning Intention + AC9 codes
- Teaching & Learning phases (Activate / Explore / Model / Connect)
- Reading (which archive pages)
- Differentiation (always include Lucas Year 2 pathway)
- Resources list

### Step 2 — Read the archive copy

Every archive has a canonical copy file that lists every page/section in plain-markdown form:

| Archive | Copy file |
|---|---|
| Cyclones | [Units/English/English_Unit_2/Cyclones/copy_the_cyclone_archive.md](../../../Units/English/English_Unit_2/Cyclones/copy_the_cyclone_archive.md) |
| Floods | [Units/English/English_Unit_2/Floods/copy_when_the_river_rises.md](../../../Units/English/English_Unit_2/Floods/copy_when_the_river_rises.md) |
| Bushfires | [Units/English/English_Unit_2/Bushfires/copy_the_bushfire_archive.md](../../../Units/English/English_Unit_2/Bushfires/copy_the_bushfire_archive.md) |
| Earthquakes | [Units/English/English_Unit_2/Earthquakes/copy_the_trembling_earth.md](../../../Units/English/English_Unit_2/Earthquakes/copy_the_trembling_earth.md) |

Use these to identify the exact aspects (hero, stats, cards, pull quotes, figures, sidebars, sections, references) that the lesson will analyse.

### Step 3 — Draft the slide map

Default slide structure (18 slides, adapt up/down):

1. Title
2. Learning intention + success criteria
3. Activate (connector to prior lesson or KWL)
4. Assessment context (only when relevant)
5. Aspect 1 screenshot + 2–3 discussion questions
6. Aspect 2 — as above
... repeat for each aspect taught ...
14. Modelled think-aloud / jointly constructed response
15. Student independent task prompt
16. Connect / consolidation (e.g. KWL L column)
17. Exit ticket
18. Differentiation / teacher-only notes (Lucas + extension)

Each aspect slide: screenshot (contain-fit) on the left, numbered questions on the right. No spoilers on slides — model answers live in the Teacher Answer Key.

### Step 4 — Copy Lesson 1 scripts as templates

From [Units/English/English_Unit_2/Unit_Plan/_scripts/](../../../Units/English/English_Unit_2/Unit_Plan/_scripts/):

```bash
cd Units/English/English_Unit_2/Unit_Plan/_scripts
cp capture_cyclone_hub_screenshots.js capture_lesson_NN_screenshots.js
cp generate_lesson_01.js              generate_lesson_NN.js
cp generate_lesson_01_slides.js       generate_lesson_NN_slides.js
```

Edit the copies — keep the helper functions (`textSlide`, `aspectSlide`, `addTitleBar`, `kwlTable`, `aspectNoteRow`, `writeDoc`, style constants). Replace content arrays, output paths, and capture selectors only.

Template starters are also available in [templates/](templates/):
- [templates/generate_lesson.template.js](templates/generate_lesson.template.js)
- [templates/generate_lesson_slides.template.js](templates/generate_lesson_slides.template.js)
- [templates/capture_screenshots.template.js](templates/capture_screenshots.template.js)

These are thinner (no lesson content) — useful when branching into a different archive or unit.

### Step 5 — Capture screenshots

The capture script serves the archive folder at 127.0.0.1:9876 and uses Playwright to clip sections. Add CSS `.reveal` → `.visible` (all archives use scroll-triggered reveals). Selector recipes per archive are in [reference.md](reference.md).

Always scroll target into view and re-call reveal before screenshotting the footer or late-page elements.

### Step 6 — Generate

```bash
cd Units/English/English_Unit_2/Unit_Plan/_scripts
node capture_lesson_NN_screenshots.js
node generate_lesson_NN.js
node generate_lesson_NN_slides.js
```

If dependencies are missing, run `npm install` (adds `docx`, `pptxgenjs`, `playwright`) and `npx playwright install chromium`.

### Step 7 — Verify

- Every `Lesson_NN_*.docx` is detected as `Microsoft Word 2007+` (`file <path>`).
- `.pptx` unzips successfully; count of `ppt/slides/slide*.xml` matches slide map.
- `ppt/media/` contains PNGs for every aspect slide that uses a screenshot.
- Open the `.docx` teacher plan in Word/LibreOffice to confirm table and heading rendering (one-off per build session is sufficient).

## Non-negotiable conventions

- **Australian spelling** throughout. Metric units.
- **Arial** body (11pt / size 22 in docx half-points); OCHRE `#B12E21` for headings and slide title bars; CHARCOAL `#2B2B2B` for body.
- **No emojis** in any generated output.
- **Curriculum codes** cited verbatim next to each learning intention (Y5: AC9E5__; Y2: AC9E2__).
- **Lucas (Y2) worksheet always included** with sentence starters, draw-and-label blocks, and oral-response option. Pull codes from the Year 2 descriptor table at the top of the teaching sequence.
- **Answer key is separate** from the slide deck so the deck stays formative.
- **One image per aspect slide** sized to fit the left half; questions on the right, numbered 1/2/3.
- **File naming** uses zero-padded lesson numbers (`01`, …, `32`) and snake_case slugs.

## Additional resources

- [reference.md](reference.md) — per-archive aspect catalog, screenshot selectors, style constants, and the `docx` / `pptxgenjs` helper snippets used by Lesson 1.
- Canonical working example: everything in [Units/English/English_Unit_2/Lesson_Plans/Lesson_01_*](../../../Units/English/English_Unit_2/Lesson_Plans/) and its scripts.
