# Reference — Archive aspects, selectors, style constants

Everything the skill needs that doesn't belong in the top-level instructions. Keep this file open while building new lessons.

## Style constants (shared by all generated outputs)

```js
const OCHRE    = "B12E21"; // Heading red / slide title bar
const CHARCOAL = "2B2B2B"; // Body text
const AMBER    = "FFBF00"; // Secondary accent (sparingly)
const MUTED    = "555555"; // Muted metadata
// docx sizes in half-points: body 22 (=11pt), H2 26, H1 36, Title 56
// Arial throughout.
```

## Paragraph styles (docx)

The Lesson 1 generator defines three named styles — reuse verbatim:

| Style id | Purpose | Run | Paragraph |
|---|---|---|---|
| `Title` | Document title | size 56, bold, OCHRE, Arial | centred, spacing before 200 / after 200 |
| `Heading1` | Section heading | size 36, bold, OCHRE, Arial | bottom-border OCHRE single 6, spacing before 280 / after 160 |
| `Heading2` | Sub-heading | size 26, bold, CHARCOAL, Arial | spacing before 200 / after 120 |

See [Units/English/English_Unit_2/Unit_Plan/_scripts/generate_lesson_01.js](../../../Units/English/English_Unit_2/Unit_Plan/_scripts/generate_lesson_01.js) for the exact `docx` object literal.

## Slide style (pptxgenjs)

- Layout: `LAYOUT_WIDE` (13.33 x 7.5 in).
- Title bar: full-width OCHRE rectangle, 0.85 in tall, white Arial 22pt bold label.
- Aspect slide grid: screenshot `{x:0.35, y:0.95, w:5.6, h:3.85, sizing:{type:"contain"}}`; questions `{x:6.1, y:0.95, w:3.55, h:4.2, fontSize:14, lineSpacingMultiple:1.15}`.
- Text slide: body `{x:0.45, y:1.05, w:9.1, h:4.5, fontSize:16, lineSpacingMultiple:1.2}`.

## Archive aspect catalog

Each archive's hub page uses the same design grammar: Hero → Stats → Section intro → Grid of cards → "About" evidence panel → Footer. Sub-pages follow: Hero → Intro → Sections with figures and pull-quotes → Sidebars → References → About.

### Cyclones — [Cyclones/index.html](../../../Units/English/English_Unit_2/Cyclones/index.html)

| Aspect | Playwright selector | Notes |
|---|---|---|
| Hero | `header#main-nav + section` | Full-height landing banner |
| Stats strip | `section.stats-strip` | 4 KPI tiles |
| Editorial intro | `#cyclones .max-w-7xl > .mb-16.max-w-xl` | "Australian Cyclone Events" block |
| Card grid | `#cyclones .grid.grid-cols-1.lg\\:grid-cols-2` | 6 cyclones |
| Single card (Tracy) | `a[href="Cyclone_Tracy/index.html"]` | Swap href for other cyclones |
| Evidence section | `section#about` | Primary sources / Meteorological data / Human impact |
| Top nav | `header#main-nav` | Brand + anchor links |
| Footer | `footer.site-footer` | Quick links = index-equivalent |

Sub-pages have these anchorable regions (class names match across archives): `[HERO]`, `[INTRO]`, numbered `[SECTION N]`, `[PULL]` blockquote, `[FIGURE]` image+caption, `[SIDEBAR-FACT]`, `[SIDEBAR-DATA]`, `[SIDEBAR-QUOTE]`, `[SIDEBAR-POP]`, `[REF]` list. Use the copy file in the archive folder to confirm which are present on a given sub-page before writing selectors.

### Floods — [Floods/index.html](../../../Units/English/English_Unit_2/Floods/index.html)

Same hub grammar. Canonical sub-pages (from [copy_when_the_river_rises.md](../../../Units/English/English_Unit_2/Floods/copy_when_the_river_rises.md)): How Floods Work, Brisbane River System, Brisbane Flood History, Human Cost.

### Bushfires — [Bushfires/index.html](../../../Units/English/English_Unit_2/Bushfires/index.html)

Canonical sub-pages (from [copy_the_bushfire_archive.md](../../../Units/English/English_Unit_2/Bushfires/copy_the_bushfire_archive.md)): Fire Science, Elemental Magic, Ash Wednesday, Black Saturday, Black Summer, The Frontline, Prevention & Preparedness.

### Earthquakes — [Earthquakes/index.html](../../../Units/English/English_Unit_2/Earthquakes/index.html)

Canonical sub-pages (from [copy_the_trembling_earth.md](../../../Units/English/English_Unit_2/Earthquakes/copy_the_trembling_earth.md)): The Mechanics of Earthquakes, Plate Tectonics, Fault Types, Secondary Hazards, Australian Seismicity.

### Cyclones (Easy Read) — [Cyclones_Easy_Read/](../../../Units/English/English_Unit_2/Cyclones_Easy_Read/)

Parallel easy-read version for Lucas or other scaffolding. Same structural skeleton, simpler language. Prefer for Year 2 pathway content when the full archive page is too dense.

## Screenshot capture pattern

All archives use scroll-triggered reveals (`.reveal` → add `.visible`). Re-apply before any below-the-fold screenshot:

```js
async function revealAll(page) {
  await page.evaluate(() => {
    document.querySelectorAll(".reveal").forEach(el => el.classList.add("visible"));
  });
  await page.waitForTimeout(800);
}

// For late-page elements:
await page.locator("footer.site-footer").scrollIntoViewIfNeeded();
await revealAll(page);
```

Viewport: `{ width: 1440, height: 900 }`, `deviceScaleFactor: 2` for retina-clean slides.

## Worksheet helper patterns (docx)

### KWL table (3 equal columns, one empty row with 4 blank paragraphs for writing space)

```js
new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  rows: [
    headerRow(["K — Know", "W — Want to know", "L — Learned"]),
    blankRow(3, 4) // 3 cells, 4 blank paragraphs each
  ]
})
```

See the full implementation in [generate_lesson_01.js — kwlTable()](../../../Units/English/English_Unit_2/Unit_Plan/_scripts/generate_lesson_01.js).

### Aspect note row (2 columns: aspect label + notes prompts)

Shaded header, bold left cell, right cell contains two prompts each followed by a blank paragraph for handwritten notes. See `aspectNoteRow()`.

### Draw-and-label box (Year 2 pathway)

Single-cell 100%-width table with heavy 6pt borders and `height: { value: 3200, rule: "atLeast" }` — gives enough drawing room at A4 portrait.

## Curriculum code conventions

- Always cite Australian Curriculum v9 codes immediately after the learning intention, in brackets.
- Year 5 codes use the prefix `AC9E5` (e.g. `AC9E5LY03`).
- Year 2 pathway (Lucas) codes use `AC9E2`. Descriptor table is at the top of [Teaching_and_Learning_Sequence.md](../../../Units/English/English_Unit_2/Unit_Plan/Teaching_and_Learning_Sequence.md#year-2-content-descriptors-underpinning-lucass-pathway).
- Do not invent or abbreviate codes. Copy verbatim from the sequence.

## Formative-only rule for slides

Decks **must not** contain model answers for discussion questions, classification sorts, or exit tickets. All model answers live in `Lesson_NN_Teacher_Answer_Key.docx`. If a sort or comparison includes the answer on-slide, move it.

## Verification commands

```bash
# from workspace root
file "Units/English/English_Unit_2/Lesson_Plans/Lesson_NN_Purpose_and_Audience.docx"
unzip -l "Units/English/English_Unit_2/Lesson_Plans/Lesson_NN_Slides.pptx" | grep "ppt/slides/slide" | wc -l
unzip -l "Units/English/English_Unit_2/Lesson_Plans/Lesson_NN_Slides.pptx" | grep "ppt/media"
```

Expect: "Microsoft Word 2007+", slide count matches map, one PNG per aspect slide.
