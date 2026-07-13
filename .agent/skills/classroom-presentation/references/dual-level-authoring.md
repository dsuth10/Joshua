# Dual-Level Authoring Contract

Every instructional slide in electricity (and other differentiated) decks presents **two reading pathways** toggled by `#pathwayToggle` at the top-right of the viewport.

## Pathway Naming

| CSS class | Audience | Reading level |
| --- | --- | --- |
| `.standard-only` | Whole class (Year 6 science intent) | Year 6 — F-K ~5.8–6.8, 15–18 words/sentence |
| `.lucas-only` | Support / differentiated (Lucas ICP) | Year 2 — F-K ~1.8–2.8, 8–10 words/sentence |

Toggle mechanism: checkbox `#pathwayToggleBtn` adds `body.lucas-active`, which swaps visibility via CSS:

```css
.lucas-only { display: none; }
body.lucas-active .lucas-only { display: block !important; }
body.lucas-active .standard-only { display: none !important; }
```

The shell auto-shows `#pathwayToggle` when any `.lucas-only` element exists in the deck.

## P0 Rule: Blank Pathway Toggle (Non-Negotiable)

The reading-pathway toggle must **never** identify one pathway as harder, easier, or tied to a year level. Students infer nothing from the control itself — only from the language on screen after the presenter switches.

**Forbidden on `#pathwayToggle` and its children:**

- Text labels: "Y6", "Y2", "Year 6", "Year 2", "Standard", "Support", "Lucas", "Easy", "Hard"
- `title` or `aria-label` attributes that mention year levels or difficulty
- `.pathway-labels` or any visible caption beside the switch

**Required:**

- A blank switch only (`<label class="switch"><input …><span class="slider round"></span></label>`)
- Neutral accessibility text: `aria-label="Toggle reading pathway"` (no level names)

Year-level calibration happens in **authoring docs and teacher notes only**, never on projected UI chrome.

## Markup Pattern

```html
<section class="slide theme-light" id="slide-3">
  <h2 class="slide-title fade-in-up">Source vs Form</h2>
  <div class="content fade-in-up delay-1">
    <div class="standard-only">
      <p>An <strong>energy source</strong> is where energy is stored or originates.</p>
      <p>An <strong>energy form</strong> is how we observe energy doing work.</p>
    </div>
    <div class="lucas-only">
      <p>An <strong>energy source</strong> (where energy comes from) stores energy.</p>
      <p>An <strong>energy form</strong> (how energy looks or feels) is what we see or feel.</p>
    </div>
  </div>
  <div class="teacher-notes" style="display: none;">...</div>
</section>
```

### Rules

1. **Shared slide titles** — `h2.slide-title` stays the same for both pathways.
2. **Sibling blocks** — `.standard-only` and `.lucas-only` are direct children of `.content`.
3. **Parallel activities** — when Standard uses drag-and-drop, Support may use tap-to-sequence or simplified card sort with the same learning goal.
4. **Title and exit slides** — may omit dual blocks when fully shared.

## Leveled Text Workflow

For each instructional slide, draft Standard text first (Year 6 science intent aligned via `curriculum-master`). Then produce Support text:

1. Run `leveled-text-creator` analysis on Support draft:
   ```bash
   python .agent/skills/leveled-text-creator/scripts/create_leveled_text.py \
     --file tmp_support.txt --year_level 2 --analyse_only
   ```
2. Revise until F-K grade and sentence length fall in Year 2 range.
3. **Retain science terminology** with inline glosses: *"chemical energy (energy stored in chemicals)"*.
4. Place final Support text in `.lucas-only`.

## Science-Specific Simplification

- Keep terms: *energy source*, *energy form*, *transformation*, *circuit*, *conductor*.
- Replace abstract phrasing with concrete observables: "the bulb glows" not "light energy is emitted".
- Shorten instructions: "Tap a card. Tap the correct group." not "Select a card and categorise it into the appropriate zone."

## Interactive Dual-Level

Interactive slides must provide both pathways:

| Standard | Support |
| --- | --- |
| Full sort deck (6+ cards) | Reduced deck (4 cards) with picture cues |
| Open-ended CFU prompt | Binary choice or picture prompt |
| Multi-step chain builder | First-Then-Finally sequence |

Both pathways on an interactive slide must register `'show-answer'` listeners (or share one listener that handles both DOM branches).

## Toggle UX Notes

- Unchecked = default pathway (red slider track); checked = alternate pathway (green slider track)
- **No text labels** on the toggle — presenter-only control
- On toggle, the shell calls `scrollToSlide(activeIndex)` to reflow the current slide
- No `localStorage` persistence by default — presenter chooses pathway at lesson start
