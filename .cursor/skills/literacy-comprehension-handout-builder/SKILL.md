---
name: literacy-comprehension-handout-builder
description: >-
  Converts Literacy Rotations markdown handouts into interactive HTML pages in
  the literacy/comprehension-web application, matching the Evaluation Level 2
  Handout 1 shell (JSON save/open, local draft, focus view, print, school user
  name, themed accents by skill and level). Use when building comprehension
  handouts, converting .md from literacy/Literacy rotations, adding Inferencing /
  Evaluation / Reorganisation pages, or when the user asks to generate or batch
  handout pages for the comprehension-web app.
---

# Literacy Comprehension Handout Builder

Builds **one interactive handout page** (or a batch) for the local app at
`literacy/comprehension-web/`, from markdown in `literacy/Literacy rotations/`.

## Canonical template

Clone structure and behaviour from:

`literacy/Literacy rotations/Evaluation/Evaluation lvl 2 handout 1.html`

(also mirrored at `literacy/comprehension-web/evaluation/level-2/handout-01.html`)

**Keep these features on every page:**

- Breadcrumb: Home → Skill → Level → Handout N (no separate title header — breadcrumb is enough)
- School User Name + Date (date defaults to today; name persists in local draft)
- Save / Open response JSON, Print, Reset, theme toggle (Save also at bottom save-note)
- `downloadResponse()` must refuse to save when School User Name is blank/whitespace: toast `"Enter your school username before saving."`, focus `#student-name`, return (both top and bottom Save buttons)
- Local draft autosave (`localStorage`)
- Sidebar tabs (one per passage/section) + Previous/Next
- Adjustable reader scale, Focus view, confetti at 100%
- Collapsible right questions drawer (closed by default = full-width reading; open = two-column; persist `literacy-comprehension-questions-open`); print and narrow screens always show questions. **Quick sections** (`sectionIds` starting with `quick-`: Quick Evaluation / Quick Inference / Quick Reorganisation) auto-open the questions drawer and hide the instructional story card (reading lives in each question stem); leaving a quick tab restores the saved drawer preference without overwriting it during auto-open.
- Teacher JSON export with stable IDs, passages, prompts, answers, word counts, timestamps, completion

Do **not** reintroduce Reading Group or the worksheet progress bar.

## Paths and naming

| Role | Path pattern |
|---|---|
| Source markdown | `literacy/Literacy rotations/<SkillFolder>/.../*.md` |
| Staged content asset | `literacy/comprehension-web/content/<skill>/level-<n>/handout-<nn>.md` |
| Live worksheet | `literacy/comprehension-web/<skill>/level-<n>/handout-<nn>.html` |
| Level index | `literacy/comprehension-web/<skill>/level-<n>/index.html` |
| Skill index | `literacy/comprehension-web/<skill>/index.html` |
| Hub | `literacy/comprehension-web/index.html` |

**Slugs**

| UI label | Folder / skill slug |
|---|---|
| Inferencing | `inferencing` |
| Evaluation | `evaluation` |
| Reorganisation | `reorganization` |

Handout numbers are zero-padded: `handout-01`, `handout-02`, …

**IDs (must be unique per page)**

- `ACTIVITY_ID`: `<skill>-level-<n>-handout-<n>` e.g. `inferencing-level-1-handout-1`
- Draft key: `<skill>-l<n>-h<n>-state` e.g. `inferencing-l1-h1-state`
- Theme key (shared): `literacy-comprehension-theme`
- Reader scale key: `literacy-comprehension-reader-scale`
- Tab key: `<skill>-l<n>-h<n>-tab`

**JSON**

- `exportType`: `literacy_comprehension_student_response`
- Reject import unless `activity.activityId === ACTIVITY_ID`
- Include `activity.skill`, `activity.level`, `activity.handout`, title, skill label

## Colour system (skill × level)

Set CSS variables on `:root` (and tuned dark-theme accents). Accents deepen with level; keep soft classroom tones — not neon or rainbow.

| Skill | Level 1 (pale) | Level 2 | Level 3 (deep) |
|---|---|---|---|
| **Inferencing** (blue) | `#6BA3C9` / light `#EAF4FA` / hover `#4F8FB8` | `#2F6F95` / `#E3F0F7` / `#245A7A` | `#1A3F5C` / `#DCE8F0` / `#142F45` |
| **Evaluation** (teal→deep teal) | `#4AA8B5` / `#E8F6F8` / `#3A8F9A` | `#0E7490` / `#ECFEFF` / `#0891B2` | `#0F4C5C` / `#E0F2F5` / `#0A3A46` |
| **Reorganisation** (violet) | `#9B8EC4` / `#F3F0FA` / `#8474B3` | `#6D5A9C` / `#EDE9F6` / `#5A4985` | `#3F2F66` / `#E8E4F2` / `#322553` |

Dark theme: keep the same hue family; brighten accent slightly for contrast (e.g. Evaluation L2 dark accent `#06B6D4`).

Also set `data-skill` and `data-level` on `<html>` or `<body>` for debugging.

Hub / index cards in `shared/site.css` should use the Level-2 accent of each skill as the default skill colour.

Full token table and dark variants: [reference.md](reference.md).

## Workflow (per handout)

Copy and track:

```
Handout build:
- [ ] 1. Identify skill, level, handout number + source .md
- [ ] 2. Stage/copy markdown into content/
- [ ] 3. Parse markdown → sections + questions
- [ ] 4. Clone template HTML → target handout-NN.html
- [ ] 5. Apply colour tokens for skill × level
- [ ] 6. Replace titles, breadcrumbs, instructions blurb, panels, IDs, storage keys
- [ ] 7. Wire state.answers, tabQuestionKeys, questionsPerTab, sectionIds
- [ ] 8. Update level index (+ skill/hub badges if first live page)
- [ ] 9. Smoke-check: draft save, tab nav, JSON download/import, print, theme
```

### 1 — Locate source

Prefer the organised folders:

- Evaluation: `literacy/Literacy rotations/Evaluation/`
- Inferencing: `literacy/Literacy rotations/Inferencing/Level N/`
- Reorganisation: add under `literacy/Literacy rotations/Reorganisation/` when content exists

If duplicates exist under older folders (e.g. `Evaluation Level 2/`), prefer `Evaluation/` / `Inferencing/` and note the choice.

### 2 — Stage content

Copy the source `.md` to  
`literacy/comprehension-web/content/<skill>/level-<n>/handout-<nn>.md`  
(overwrite only when intentionally refreshing the asset).

### 3 — Parse markdown

Two common shapes (see [reference.md](reference.md)):

1. **Evaluation-style** — `## TITLE` passage, then `### Questions` with `*` / `a.` items.
2. **Inferencing-style** — `## Part N`, `### Question N: TITLE`, blockquotes for short text, nested `* **a.**` questions.

Map each passage/part to **one sidebar tab**. Map each answerable prompt to one textarea id (`q1`, `q2`, `q3a`, …).

Skip empty `* **Answer:**` lines — they are blanks for students.

### 4–7 — Build the HTML page

1. Copy the canonical template to the target path.
2. Swap accent CSS variables for the skill × level row above.
3. Rewrite visible titles, meta description, breadcrumb links (`../../index.html`, etc.).
4. Write skill-appropriate **Instructions for Students** (one short paragraph).
5. Rebuild sidebar buttons, `.tab-panel` blocks, question cards.
6. Update JS: `ACTIVITY_ID`, `sectionIds`, `state.answers`, `tabQuestionKeys`, `questionsPerTab`, storage keys, JSON `activity` metadata, `exportType`.
7. Keep School User Name / Date toolbar and nav controls layout from the template.

### 8 — Update navigation indexes

On the level `index.html`:

- Mark the handout **Live** with `Open worksheet` → `handout-NN.html`
- Keep **View source** → staged `.md`

Update skill/hub status badges when a level gains its first live page.

### 9 — Smoke-check

Open the HTML locally and confirm: meta fields, draft persistence after reload, tab badges, JSON round-trip, print header shows School User Name + Date only.

## Batch builds

When the user asks for a whole level (e.g. “all Inferencing Level 1”):

1. List source `.md` files and sort by handout number.
2. Build sequentially; reuse the same colour tokens for that skill × level.
3. After the batch, refresh the level index once with all Live / Content ready rows.
4. Report: built paths, skipped files, any ambiguous markdown needing a decision.

## Instructions blurb (defaults)

| Skill | Default student instruction |
|---|---|
| Inferencing | Inferencing means using clues in the text to work out what is not said directly. Read each text, then answer. Explain **why** using evidence from the words. |
| Evaluation | Evaluation means judging what happened and why it matters. Read each story, then answer. Explain **why** using clues from the text. |
| Reorganisation | Reorganisation means sorting or reordering information from a text. Read carefully, then complete each task using details from the passage. |

Adapt slightly if the markdown has its own instruction line.

## Do / Don't

**Do**

- Match template UX and JSON shape for teacher collection
- Deepen colour by level within one skill family
- Preserve educational wording from the markdown
- Use relative links so the app works from the filesystem

**Don't**

- Invent passages or questions not in the source
- Fork a second unrelated UI shell
- Use gaudy/neon palettes or different fonts per page
- Commit unless the user asks

## Additional resources

- Colour tokens, markdown parse rules, JSON schema: [reference.md](reference.md)
