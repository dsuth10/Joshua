# Implementation Plan: Content-Aware Reading Layouts

**Application:** Literacy Comprehension Web App  
**Location:** `literacy/comprehension-web/`  
**Status:** Recommended implementation plan  
**Prepared:** 19 July 2026  
**Primary implementation files:** `build_all.py`, `build_eval_l2.py`, the handout template, shared handout CSS, and shared handout JavaScript

---

## 1. Executive decision

Replace the current binary `quick-section` versus non-quick layout with four explicit, content-aware presentation modes:

1. `sentence-task-list` — one short sentence paired with one inferencing question.
2. `paired-passage-list` — one short paragraph paired with one reorganisation question.
3. `focus-passage-list` — one substantial mini-passage followed by one evaluation or reaction question, presented one task at a time.
4. `shared-passage` — one short or extended passage shared by multiple questions.

The application must choose layouts from explicit section metadata. Skill-specific defaults may populate that metadata, but CSS and JavaScript must not infer layout from an ID beginning with `quick-`, a word-count threshold, or the strategy name at runtime.

The recommended default mapping is:

| Strategy and section | Default layout | Reading scope | Default response size |
|---|---|---|---|
| Inferencing quick items | `sentence-task-list` | One sentence per question | `short` |
| Reorganisation quick items | `paired-passage-list` | One paragraph per question | `standard` |
| Evaluation quick items | `focus-passage-list` | One mini-passage per question | `evidence` |
| Any short passage with several questions | `shared-passage` | One passage shared by its questions | `standard` |
| Any extended text with several questions | `shared-passage` | One passage shared by its questions | `evidence` |

This creates one consistent application shell while matching the reading experience to the relationship between text and question.

---

## 2. Why this change is required

### 2.1 Confirmed current behaviour

`compile_handout()` currently treats all section IDs beginning with `quick-` identically:

- It creates an instructional `story-card` instead of a genuine reading pane.
- CSS hides that `story-card` whenever the active section is quick.
- It forces the questions drawer open.
- It injects every quick stimulus into its question card as `.sentence-stem`.
- It surrounds the stimulus with quotation marks and renders all of it in italics.
- It displays “Read each sentence and answer the question” for every quick strategy.

This behaviour is implemented in `build_all.py` in the `TAB PANELS` rendering block and in the handout template rules for `body.quick-section`.

### 2.2 The content does not justify one quick layout

An audit of current marking-guide data found these approximate quick-item lengths:

| Strategy | Typical average by level | Observed range |
|---|---:|---:|
| Inferencing | 11–22 words | 6–32 words |
| Reorganisation | 33–55 words | 21–102 words, excluding malformed empty data |
| Evaluation | 71–77 words | 43–131 words |

The current design works reasonably for a one-sentence inference because the text and question benefit from immediate proximity. It is unsuitable for longer reorganisation and evaluation passages because:

- paragraph and dialogue structure is visually flattened;
- a passage is incorrectly presented as though it were part of the prompt;
- long italic text is harder to read;
- reorganisation students cannot scan a clearly separated text region;
- evaluation students do not receive an uninterrupted reading surface;
- all answer boxes remain the same size despite different response demands;
- the instruction calls paragraphs “sentences”; and
- print behaviour depends on whichever section left the global `quick-section` body class active.

### 2.3 Relevant repository constraints

The implementation must account for these existing conditions:

1. `build_all.py` uses `inferencing/level-1/handout-01.html`, a generated activity, as its template. This is fragile and must be replaced by a dedicated template before layout work is rolled out.
2. `build_all.py` reads several extracted inputs from an absolute scratch-directory path outside the application. Do not assume a clean machine can regenerate every activity.
3. `build_eval_l2.py` imports `compile_handout()` and builds Evaluation Level 2 from Markdown. It must use the same normalized section model and renderer.
4. Full builds write HTML, Markdown, and marking-guide JSON. Existing question-specific marking guidance can be overwritten by generic text.
5. Generated HTML files are already modified in the current worktree. They belong to existing work and must not be overwritten or discarded without a baseline comparison and explicit approval.
6. Student response files are consumed by `grade_results.py`. Activity IDs and question IDs are the critical grading keys.
7. The app currently contains approximately 60 standard handout HTML files plus bridge/special variants. All variants must be inventoried before declaring migration complete.

---

## 3. Goals, non-goals, and success measures

### 3.1 Goals

- Give each reading unit an appropriate and recognisable reading surface.
- Preserve the useful sentence/question proximity in quick inferencing.
- Preserve paragraphing, dialogue, and scanability in reorganisation.
- Give evaluation mini-passages enough width and uninterrupted reading space.
- Retain the existing shared-passage experience for passages with multiple questions, while improving its defaults and responsive behaviour.
- Preserve activity identity, question identity, saved drafts, response imports and exports, print output, and grading compatibility.
- Make the builder data model explicit enough that future authors can select or override presentation without editing CSS or JavaScript.
- Centralise the handout template and runtime so fixes do not require editing 60 generated pages by hand.
- Add automated validation that prevents an inappropriate quick layout from being generated silently.

### 3.2 Non-goals

- Do not rewrite passages or questions as part of this UI migration.
- Do not change scores, maximum marks, or marking criteria.
- Do not change the overall skill/level/handout navigation hierarchy.
- Do not replace free-text answers with multiple-choice controls.
- Do not add automatic reading-level classification.
- Do not infer a layout solely from word count.
- Do not alter the teacher grading algorithm.
- Do not migrate response files to a new schema unless an unavoidable incompatibility is discovered during testing.

### 3.3 Success measures

The migration is successful when:

- every section declares one valid layout mode;
- inferencing quick items display as distinct sentence tasks;
- reorganisation quick items display as paired mini-passages;
- evaluation quick items display as focused mini-passage tasks;
- shared passages remain visible while their questions are answered;
- instructions correctly describe sentences, paragraphs, or shared passages;
- answer-box sizes match the expected response demand;
- all existing activity and question IDs remain unchanged;
- old response files import successfully;
- newly exported response files are accepted by `grade_results.py`;
- print output contains every text, question, and answer area regardless of the active section;
- keyboard and screen-reader reading order is text, prompt, response;
- desktop, tablet, and phone layouts pass the viewport test matrix; and
- the build/audit scripts report PASS with no unintended content or marking-guide changes.

---

## 4. Target student experience

### 4.1 Common application shell

Retain these existing elements across all modes:

- breadcrumb navigation;
- skill, level, and handout identity;
- student username and date;
- section navigation with answered/total badges;
- text-size controls;
- focus control;
- automatic draft saving;
- import, export, reset, and print behaviour;
- light and dark themes; and
- completion tracking.

Only the active section’s reading/question composition changes.

### 4.2 Layout A: sentence task list

**Use:** Quick inferencing items in which every sentence belongs to exactly one question.

Desktop and mobile use the same vertical reading order:

```text
┌─────────────────────────────────────────────────────────┐
│ SENTENCE 1                                              │
│ The children like to play indoors during winter.       │
├─────────────────────────────────────────────────────────┤
│ When would they most likely play outdoors?             │
│ [ Answer                                               ]│
└─────────────────────────────────────────────────────────┘
```

Requirements:

- Present two or three sentence tasks in one vertical list.
- Give each sentence a visible label such as `Sentence 1`.
- Render the sentence in normal reading type, not long italics.
- Do not add decorative quotation marks around the entire stimulus.
- Separate the reading block from the prompt with background, border, spacing, and semantic markup.
- Use a two-line `short` response box by default.
- Keep the sentence visible while the student enters the answer.
- Do not render a questions drawer or a hidden story card for this mode.
- Keep the app-level section badge, for example `2/3`, updated as it is now.

### 4.3 Layout B: paired passage list

**Use:** Quick reorganisation items in which every paragraph belongs to exactly one question.

Desktop:

```text
┌──────────────────────────────┬───────────────────────────┐
│ TEXT 1                       │ QUESTION 1                │
│ Todd thanked his            │ What gift did Todd get    │
│ grandparents ...            │ from his grandparents?    │
│ The gift was ...            │ [ Answer                 ]│
└──────────────────────────────┴───────────────────────────┘
```

Phone and narrow tablet:

```text
┌─────────────────────────────────────────────────────────┐
│ TEXT 1                                                  │
│ Passage content                                         │
├─────────────────────────────────────────────────────────┤
│ QUESTION 1                                              │
│ Prompt                                                  │
│ [ Answer                                               ]│
└─────────────────────────────────────────────────────────┘
```

Requirements:

- Use a two-column grid above the desktop breakpoint.
- Allocate approximately 55–60% width to reading and 40–45% to response.
- Stack reading above response below the breakpoint.
- Preserve all passage paragraph breaks and dialogue turns.
- Keep each task as one visual unit, but give reading and response distinct subregions.
- Use a three- or four-line `standard` response box by default.
- Never collapse or hide the reading while the answer is being written.
- Do not use independent scrollbars inside these short task rows.

### 4.4 Layout C: focus passage list

**Use:** Quick evaluation and reaction items in which a substantial mini-passage belongs to one question.

```text
┌─────────────────────────────────────────────────────────┐
│ TEXT 1                                                  │
│ Full-width mini-passage with preserved paragraphs.     │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ THINK ABOUT THE TEXT                                    │
│ Why does the writer describe the result as surprising? │
│ [ Answer with evidence                                 ]│
└─────────────────────────────────────────────────────────┘
│ Previous task        Task 1 of 2          Next task     │
```

Requirements:

- Present one evaluation task at a time within the section.
- Use explicit `Previous task` and `Next task` controls.
- Display `Task N of M` and answered state.
- Preserve entered answers when moving between tasks.
- Place passage and question in the same DOM task container.
- Keep the passage visible above the prompt; do not create a separate page that hides it.
- Constrain text width to approximately 65–75 characters per line.
- Use normal body type and preserve paragraphing.
- Use a five- or six-line `evidence` response box by default.
- A reaction prompt may receive a small `Your judgement` eyebrow, but it remains part of evaluation and must not use a different application shell.
- Print all tasks, not only the currently active focus task.

### 4.5 Layout D: shared passage

**Use:** Any short or extended passage shared by multiple questions.

Desktop:

```text
┌────────────────────────────────┬────────────────────────┐
│ READING                        │ QUESTIONS              │
│                                │                        │
│ Shared passage remains         │ Question 1             │
│ available for reference.       │ [ Answer              ]│
│                                │                        │
│                                │ Question 2             │
│                                │ [ Answer              ]│
└────────────────────────────────┴────────────────────────┘
```

Requirements:

- Open reading and questions together by default on desktop.
- Remove the vertical `Questions` rail as the primary way to begin answering.
- Provide an optional `Reading focus` toggle that temporarily expands the reading region.
- Label the return action `Reading + questions`, not `Show questions`.
- Keep the reading region sticky on desktop when helpful.
- Allow internal reading scroll only when the text exceeds the available viewport; questions should use normal page flow.
- At widths below the shared-passage breakpoint, stack reading above questions.
- On a stacked long passage, provide a clearly labelled `Return to text` link/button near the question group.
- Preserve the student’s section and answer state when toggling focus.
- Use `standard` or `evidence` response sizing based on section metadata.

---

## 5. Canonical data model

### 5.1 Do not render directly from the two legacy section shapes

Current builders supply either:

- `passages: [...]` plus `questions: [...]` for quick items; or
- `passage: "..."` plus `questions: [...]` for a shared passage.

Keep these inputs temporarily for migration, but normalize them before generating IDs, HTML, marking guides, Markdown, or client configuration.

### 5.2 Required enums

Define constants near the top of `build_all.py`:

```python
LAYOUT_SENTENCE_TASK_LIST = "sentence-task-list"
LAYOUT_PAIRED_PASSAGE_LIST = "paired-passage-list"
LAYOUT_FOCUS_PASSAGE_LIST = "focus-passage-list"
LAYOUT_SHARED_PASSAGE = "shared-passage"

READING_SCOPE_ITEM = "item"
READING_SCOPE_SECTION = "section"

RESPONSE_SHORT = "short"
RESPONSE_STANDARD = "standard"
RESPONSE_EVIDENCE = "evidence"
```

Use constants in Python. Write the string values to generated HTML and JSON configuration.

### 5.3 Normalized section structure

`normalize_section(skill, section, section_index)` must return this structure:

```python
{
    "id": "quick-inferences",
    "title": "Part 1: Quick Inferences",
    "short_title": "Quick Inferences",
    "layout": "sentence-task-list",
    "reading_scope": "item",
    "instruction": "Read each sentence, then answer its question.",
    "default_response_size": "short",
    "items": [
        {
            "item_id": "item-1",
            "label": "Sentence 1",
            "passage": "The children like to play indoors ...",
            "questions": [
                {
                    "question_id": None,
                    "prompt": "When would the children most likely play outdoors?",
                    "response_size": "short",
                    "kind": "standard"
                }
            ]
        }
    ]
}
```

For `shared-passage`, return one item whose `questions` array contains all section questions.

### 5.4 Layout defaults

Implement one pure function:

```python
def default_layout_for(skill, reading_scope):
    if reading_scope == READING_SCOPE_SECTION:
        return LAYOUT_SHARED_PASSAGE
    if skill == "inferencing":
        return LAYOUT_SENTENCE_TASK_LIST
    if skill == "reorganization":
        return LAYOUT_PAIRED_PASSAGE_LIST
    if skill == "evaluation":
        return LAYOUT_FOCUS_PASSAGE_LIST
    raise ValueError(...)
```

This function populates missing author metadata. Rendering must use `section["layout"]`, not call this function again.

An explicit `layout` field in raw section data overrides the default after validation. This supports future exceptions without new CSS branches.

### 5.5 Response-size defaults

Use this exact default mapping:

```python
DEFAULT_RESPONSE_SIZE_BY_LAYOUT = {
    LAYOUT_SENTENCE_TASK_LIST: RESPONSE_SHORT,
    LAYOUT_PAIRED_PASSAGE_LIST: RESPONSE_STANDARD,
    LAYOUT_FOCUS_PASSAGE_LIST: RESPONSE_EVIDENCE,
    LAYOUT_SHARED_PASSAGE: RESPONSE_STANDARD,
}
```

Allow raw sections to specify:

```python
"response_size": "evidence"
```

Allow an optional per-question override only after normalization:

```python
"response_sizes": ["short", "evidence"]
```

If provided, `response_sizes` must have the same length as the raw `questions` array.

### 5.6 Question-ID compatibility

Preserve the current algorithm exactly:

- Item-scoped sections assign one sequential numeric ID per item: `q1`, `q2`, `q3`.
- Shared-passage sections assign one numeric group with letter suffixes: `q4a`, `q4b`, and so on.
- Increment the numeric group once after each shared section.

Run ID assignment on normalized sections. Before writing output, compare generated IDs against an ID manifest captured from current marking guides.

Do not use DOM position to create IDs.

### 5.7 Required validation

Add `validate_normalized_handout(skill, level, handout_num, sections)`. It must raise `ValueError` with the activity and section ID in every message.

Validate:

- section IDs are unique and non-empty;
- every section has a supported layout;
- every item has non-empty passage text;
- every question has a non-empty prompt;
- question IDs are unique across the activity;
- item-scoped layouts contain exactly one question per item in this migration;
- `sentence-task-list` uses item scope;
- `paired-passage-list` uses item scope;
- `focus-passage-list` uses item scope;
- `shared-passage` uses section scope;
- item-scoped legacy inputs have equal `passages` and `questions` lengths;
- response sizes are one of the three supported values;
- `focus-passage-list` has at least two items if focus navigation is rendered; for one item, render without disabled task navigation;
- no passage is empty after trimming;
- no question ID exceeds the supported `qN[a-z]` pattern; and
- layout instructions are non-empty.

Add non-fatal audit warnings for suspicious content:

- sentence layout passage over 45 words;
- paired passage over 140 words;
- focus passage under 30 words;
- more than 26 questions in one shared section;
- malformed encoding sequences; and
- an item whose passage and prompt are identical.

Warnings do not automatically change the layout. Authors must choose the override.

---

## 6. File-level implementation

### 6.1 Create `templates/handout-template.html`

Create:

```text
literacy/comprehension-web/templates/handout-template.html
```

Requirements:

- Copy the structural shell from the current handout only as a starting point.
- Remove all activity-specific passages, questions, titles, IDs, and state data.
- Replace regex-sensitive sample content with explicit insertion markers:

```html
<!-- BUILD:BREADCRUMB -->
<!-- BUILD:SIDEBAR -->
<!-- BUILD:PANELS -->
<script id="activity-config" type="application/json"><!-- BUILD:CONFIG --></script>
```

- Link the new shared handout stylesheet and runtime using paths valid from every `skill/level-N/handout-NN.html` page:

```html
<link rel="stylesheet" href="../../shared/handout.css">
<script src="../../shared/handout.js" defer></script>
```

- Keep page-specific accent tokens as CSS custom properties on `<html>` or a short generated `<style>` block.
- Do not use a generated handout as the template after this slice.

Change `template_path` to derive from `__file__`, never an absolute user path:

```python
base_dir = os.path.dirname(os.path.abspath(__file__))
template_path = os.path.join(base_dir, "templates", "handout-template.html")
```

### 6.2 Create `shared/handout.css`

Move reusable interactive-handout styles into:

```text
literacy/comprehension-web/shared/handout.css
```

Keep `shared/site.css` for indexes and navigation pages. Do not merge the two files in this migration.

The new stylesheet owns:

- handout shell and toolbar;
- sidebar and badges;
- all four layout modes;
- reading blocks;
- question cards and response sizes;
- focus-task controls;
- reading-focus mode;
- responsive rules;
- dark theme;
- focus-visible states; and
- print rules.

Delete these concepts from the new template CSS:

- `body.quick-section`;
- `.sentence-stem`;
- layout selection based on `.questions-open` for item-scoped sections; and
- the vertical questions rail for default interaction.

### 6.3 Create `shared/handout.js`

Move reusable handout behaviour into:

```text
literacy/comprehension-web/shared/handout.js
```

The generated page should contain only activity configuration, not a full duplicated runtime.

The runtime must:

- parse and validate `#activity-config`;
- initialize state and local-storage keys;
- attach event listeners using `data-*` attributes rather than inline `onclick` and `oninput` handlers;
- switch handout sections;
- navigate evaluation focus tasks;
- toggle reading focus for shared passages;
- manage text scaling and theme;
- save and restore responses;
- update word counts and badges;
- import and export response files;
- print all sections and focus tasks;
- reset with confirmation; and
- preserve current completion behaviour.

Do not create global body classes that alter inactive sections. Apply layout state to the active `.section-panel` or use `data-layout` on each section.

### 6.4 Modify `build_all.py`

Refactor `compile_handout()` into small functions with single responsibilities:

```python
normalize_handout(...)
assign_question_ids(...)
validate_normalized_handout(...)
render_sidebar(...)
render_section_panel(...)
render_sentence_task_list(...)
render_paired_passage_list(...)
render_focus_passage_list(...)
render_shared_passage(...)
render_question(...)
build_activity_config(...)
write_handout_html(...)
write_marking_guide(...)
write_markdown_copy(...)
```

`compile_handout()` should orchestrate those functions and should no longer:

- mutate raw section dictionaries passed by the caller;
- choose layout using `id.startswith("quick-")` during rendering;
- copy a generated handout as a template;
- scrape or regex-replace large activity-specific blocks; or
- assume every quick passage is a sentence.

Use `html.escape(..., quote=True)` instead of the custom replacement function where possible. Preserve paragraph boundaries by rendering each `\n\n`-separated paragraph as its own `<p>`.

### 6.5 Modify `build_eval_l2.py`

`build_eval_l2.py` must continue to parse its current Markdown inputs, but every raw section passed to `compile_handout()` must receive explicit layout metadata:

- quick evaluation: `focus-passage-list`;
- non-quick passages with several questions: `shared-passage`.

Import constructors from `build_all.py` rather than duplicating raw dictionaries:

```python
make_item_section(...)
make_shared_section(...)
```

Add a `main()` function and `if __name__ == "__main__": main()` guard. Importing the module in a test must not regenerate activities.

Document the bridge-handout filename and activity-ID behaviour. Do not overwrite `handout-06-bridge.*` or `handout-07-bridge.*` while generating standard `handout-06.*` and `handout-07.*`.

### 6.6 Add `scripts/layout_inventory.py`

Create a read-only inventory/audit script:

```text
literacy/comprehension-web/scripts/layout_inventory.py
```

It must read current marking guides and HTML without modifying them and report:

- activity ID;
- skill and level;
- section ID;
- question IDs;
- current passage word counts;
- inferred legacy scope (`item` or `section`);
- intended new layout;
- suspicious empty or unusually long passages;
- missing standard/bridge counterparts; and
- duplicate activity IDs or question IDs.

Support:

```powershell
python scripts/layout_inventory.py
python scripts/layout_inventory.py --json docs/layout-inventory.json
```

Exit `0` on a clean audit, `1` on validation failures. Warnings alone may exit `0` but must be summarised separately.

### 6.7 Add tests

Create:

```text
literacy/comprehension-web/tests/test_layout_builder.py
literacy/comprehension-web/tests/fixtures/layout-handout.json
literacy/comprehension-web/tests/fixtures/legacy-response.json
```

Use Python’s standard `unittest` unless the app deliberately adds a test dependency. Tests must write to a temporary directory, never to live handout or marking-guide paths.

`compile_handout()` therefore needs an optional `output_root` or separate pure `render_handout()` function that returns HTML without writing.

---

## 7. Generated DOM contracts

The CSS, JavaScript, export builder, tests, and print rules depend on these stable contracts. Do not change class names casually during implementation.

### 7.1 Section panel

```html
<section
  class="section-panel"
  id="panel-0"
  data-section-index="0"
  data-section-id="quick-inferences"
  data-layout="sentence-task-list"
  aria-labelledby="section-title-0"
>
  <header class="section-heading">
    <p class="section-eyebrow">Sentence clues</p>
    <h2 id="section-title-0">1. Quick Inferences</h2>
    <p class="section-instruction">Read each sentence, then answer its question.</p>
  </header>
  <!-- layout renderer output -->
</section>
```

Inactive panels use the HTML `hidden` attribute. JavaScript removes `hidden` only from the active section. Print CSS overrides `[hidden]` within `.section-panel` so every section prints.

### 7.2 Reading region

```html
<article class="reading-block" aria-labelledby="reading-label-q1">
  <h3 class="reading-label" id="reading-label-q1">Sentence 1</h3>
  <div class="reading-text">
    <p>The children like to play indoors during the cold winter months.</p>
  </div>
</article>
```

Use `Text N` for reorganisation/evaluation passages and `Reading` for shared passages.

### 7.3 Question region

```html
<section class="response-block" aria-labelledby="prompt-q1">
  <div class="question-heading-row">
    <h3 class="question-prompt" id="prompt-q1">When would the children most likely play outdoors?</h3>
    <span class="save-indicator" id="save-q1" aria-live="polite">Saved</span>
  </div>
  <label class="visually-hidden" for="q1">Answer to question 1</label>
  <textarea
    id="q1"
    class="answer-textarea response-short"
    data-question-id="q1"
    data-section-index="0"
    rows="2"
    placeholder="Type your answer here..."
  ></textarea>
  <div class="response-footer">
    <span class="word-counter" id="words-q1">0 words</span>
  </div>
  <div class="print-answer-box" id="print-q1"></div>
</section>
```

Use an actual heading or labelled paragraph for the prompt, not an unlabelled `<span>`.

### 7.4 Sentence task list

```html
<div class="task-list sentence-task-list">
  <article class="task-card" data-task-index="0">
    <!-- reading region -->
    <!-- question region -->
  </article>
</div>
```

### 7.5 Paired passage list

```html
<div class="task-list paired-passage-list">
  <article class="task-card paired-task" data-task-index="0">
    <!-- reading region -->
    <!-- question region -->
  </article>
</div>
```

CSS, not DOM order, creates columns.

### 7.6 Focus passage list

```html
<div class="focus-task-list" data-active-task="0">
  <article class="task-card focus-task" data-task-index="0">
    <!-- reading region -->
    <!-- question region -->
  </article>
  <nav class="focus-task-nav" aria-label="Evaluation tasks">
    <button type="button" data-action="previous-task">Previous task</button>
    <span class="focus-task-position" aria-live="polite">Task 1 of 2</span>
    <button type="button" data-action="next-task">Next task</button>
  </nav>
</div>
```

Hide inactive `.focus-task` elements with `hidden`; print CSS displays all of them and hides `.focus-task-nav`.

### 7.7 Shared passage

```html
<div class="shared-passage-workspace">
  <article class="shared-reading" aria-labelledby="reading-label-section-2">
    <!-- reading -->
  </article>
  <aside class="shared-questions" aria-label="Questions about this reading">
    <!-- question regions -->
  </aside>
</div>
```

The reading-focus button belongs in the section heading and sets `data-reading-mode="focus"` on the section panel.

---

## 8. CSS specification

### 8.1 Shared tokens

Add or retain these variables:

```css
--reader-scale: 1;
--reading-measure: 70ch;
--content-gap: 1.5rem;
--task-radius: 12px;
--response-short-height: 4.75rem;
--response-standard-height: 7.5rem;
--response-evidence-height: 10rem;
```

Continue to use existing theme variables for colour, border, shadow, and accent.

### 8.2 Typography

- Reading text: `calc(1.15rem * var(--reader-scale))` on desktop, minimum readable equivalent on mobile.
- Reading line height: `1.75` for paragraphs and `1.65` for single sentences.
- Prompt text: `calc(1.08rem * var(--reader-scale))`, semibold.
- Maximum reading measure: `70ch`.
- Do not italicise entire passages.
- Italics remain available for words genuinely italicised in the source.

### 8.3 Breakpoints

Use no more than these three layout ranges:

- Wide desktop: greater than `1050px`.
- Tablet/small desktop: `721px` through `1050px`.
- Phone: `720px` and below.

Behaviour:

| Layout | Wide desktop | Tablet | Phone |
|---|---|---|---|
| Sentence task | Centred vertical list, max width about 900px | Same | Same with reduced padding |
| Paired passage | Two columns | Stack if either column would be under 320px | Stack |
| Focus passage | Full-width task, max reading measure | Same | Same with reduced padding |
| Shared passage | Two columns | Stack | Stack with `Return to text` control |

Do not make `900px` and `1050px` produce contradictory workspace and panel layouts. Consolidate current overlapping media queries.

### 8.4 Response sizes

```css
.response-short { min-height: var(--response-short-height); }
.response-standard { min-height: var(--response-standard-height); }
.response-evidence { min-height: var(--response-evidence-height); }
```

Keep vertical resize enabled. Use `min-height`, not fixed `height`.

### 8.5 Focus and accessibility styles

- Every interactive element needs a visible `:focus-visible` outline with at least 3:1 contrast.
- Do not communicate answered state by colour alone; retain badge text and/or a check icon with accessible text.
- Reading regions must retain sufficient contrast in light and dark themes.
- Motion for task changes and completion effects must respect `prefers-reduced-motion: reduce`.

### 8.6 Print

Print CSS must:

- show every `.section-panel`, including those with `hidden` in screen mode;
- show every `.focus-task`;
- hide navigation, toolbars, import/export controls, textareas, save indicators, focus controls, and completion effects;
- show `.print-answer-box` for every question;
- place each reading before its matching question;
- preserve shared passages once, followed by all their questions;
- prevent a short reading from being orphaned at the bottom of a page;
- avoid applying the screen’s active layout class globally; and
- produce the same complete worksheet regardless of which section was active before printing.

---

## 9. JavaScript specification

### 9.1 Activity configuration

Generate this configuration into `#activity-config`:

```json
{
  "appVersion": "2.1.0",
  "schemaVersion": "1.0",
  "activityId": "inferencing-level-1-handout-1",
  "skill": "inferencing",
  "skillLabel": "Inferencing",
  "level": 1,
  "handout": 1,
  "storage": {
    "draftKey": "inferencing-l1-h1-state",
    "tabKey": "inferencing-l1-h1-tab"
  },
  "sections": [
    {
      "sectionId": "quick-inferences",
      "title": "Part 1: Quick Inferences",
      "layout": "sentence-task-list",
      "passages": ["...", "...", "..."],
      "questions": [
        {"questionId": "q1", "prompt": "...", "responseSize": "short"}
      ]
    }
  ]
}
```

Escape JSON safely for an HTML script-data element, including replacing `<` with `\u003c` to prevent accidental closing-tag injection.

### 9.2 Initialization

On `DOMContentLoaded`:

1. Parse configuration.
2. Validate required keys.
3. Create the state answer map from configuration question IDs.
4. Restore saved state.
5. Restore the last handout section.
6. Restore each focus section’s last task if stored; if not stored, use task zero.
7. Restore theme and text scale.
8. Attach delegated event handlers.
9. Populate username/date fields and print labels.
10. Update badges, word counts, task positions, and control disabled states.

### 9.3 Section navigation

`switchSection(index)` must:

- clamp the index;
- hide all panels and reveal exactly one;
- update active sidebar state and `aria-current`;
- update previous/next section controls;
- persist the section index;
- update the section-position label;
- leave layout selection to the panel’s `data-layout`; and
- scroll to the active section heading using instant scrolling when reduced motion is preferred.

Delete `syncLayoutForTab()` and all logic based on `sectionId.startsWith("quick-")`.

### 9.4 Focus-task navigation

Store active focus-task indexes in state:

```javascript
state.focusTasks = {
  "quick-evaluation": 0
};
```

`showFocusTask(sectionId, taskIndex)` must:

- reveal exactly one task in screen mode;
- update `Task N of M`;
- disable previous/next controls at boundaries;
- persist the index with the existing draft; and
- never clear or move answer values.

When a student answers the active task and chooses `Next task`, move to the next task. Do not auto-advance while typing.

### 9.5 Reading focus

Only `shared-passage` sections show the reading-focus control.

The control toggles:

```html
data-reading-mode="split"
data-reading-mode="focus"
```

In focus mode:

- expand reading to the full section width;
- visually hide questions but keep their values in the DOM/state;
- change button text to `Reading + questions`;
- restore split mode when the student switches sections unless a future requirement explicitly persists it.

This is distinct from the current app-wide `Focus view`, which hides navigation chrome. Retain app-wide focus view and rename it only if user testing shows confusion.

### 9.6 State compatibility

Keep these state keys and meanings:

- `studentName`;
- `studentDate`;
- `submissionId`;
- `startedAt`;
- `lastSavedAt`;
- `answers` keyed by existing question ID; and
- `currentTab` or migrate it internally to `currentSection` while accepting the old saved field.

For backward compatibility:

```javascript
state.currentSection = parsed.currentSection ?? parsed.currentTab ?? 0;
```

Do not change `DRAFT_KEY` or `TAB_KEY` values.

### 9.7 Import/export compatibility

Keep:

- `schemaVersion: "1.0"`;
- `exportType: "literacy_comprehension_student_response"`;
- activity ID;
- skill, level, and handout fields;
- section ID;
- question ID;
- response;
- word count; and
- completion structure.

Set `submission.appVersion` to `2.1.0`.

Build response data from `activity-config`, not by scraping headings, `.story-card`, `.sentence-stem`, or prompt text from the DOM.

For an item-scoped section, export the section passage as the original item passages joined with two newline characters, in item order. Do not include the instructional sentence or decorative quotation marks.

For a shared section, export the one original passage unchanged except for normalized line endings.

Continue to import files created by app version `2.0.0`. The import path already keys answers by question ID; preserve this behaviour.

### 9.8 Event handling

Use delegated handlers and data attributes:

- `[data-action="switch-section"]`;
- `[data-action="previous-section"]`;
- `[data-action="next-section"]`;
- `[data-action="previous-task"]`;
- `[data-action="next-task"]`;
- `[data-action="toggle-reading-focus"]`;
- `[data-question-id]` input events; and
- existing import, export, print, reset, theme, and scale actions.

Do not emit inline JavaScript attributes in generated HTML.

---

## 10. Instructions and labels

Use these exact defaults unless content authors provide an override:

| Layout | Section instruction | Reading label |
|---|---|---|
| `sentence-task-list` | “Read each sentence, then answer its question. Use the clues in the sentence.” | `Sentence N` |
| `paired-passage-list` | “Read each short text, then combine the relevant details to answer its question.” | `Text N` |
| `focus-passage-list` | “Read each text carefully. Explain your judgement using evidence from that text.” | `Text N` |
| `shared-passage` | “Read the passage, then answer all questions using evidence from the text.” | `Reading` |

Use these strategy-level blurbs:

- Inferencing: “Use clues in the text to work out what is not stated directly.”
- Reorganisation: “Find and combine information from different parts of the text.”
- Evaluation: “Consider the whole text and explain your judgement with evidence.”

Verify the generated handout uses the correct blurb. Existing generated reorganisation and evaluation samples may still contain the inferencing blurb even though `build_all.py` now declares strategy-specific text.

---

## 11. Build safety and output control

### 11.1 Add explicit build modes

The layout migration primarily needs to regenerate HTML. Add command-line flags so a layout build cannot silently replace content or marking guidance:

```powershell
python build_all.py --html-only
python build_all.py --html-and-markdown
python build_all.py --all --force-marking-guides
```

Recommended meanings:

- `--html-only`: write handout HTML and indexes only.
- `--html-and-markdown`: write HTML, indexes, and Markdown copies.
- `--all`: write all supported outputs, but preserve existing marking guides unless `--force-marking-guides` is also present.
- `--force-marking-guides`: explicitly allow replacement of existing marking-guide JSON.
- `--output-root PATH`: write generated output to a staging directory for comparison.

Default to a safe staged or HTML-only mode. Never overwrite customised marking guides merely because a developer is testing CSS.

### 11.2 Remove absolute workspace paths

Replace absolute `base_dir`, `content_dir`, and template paths with paths derived from `__file__`.

Treat the external scratch-data dependency separately:

- allow `--source-root PATH` or `COMPREHENSION_SOURCE_ROOT`;
- validate all required input files before writing any output;
- fail before the first write if inputs are missing; and
- print the resolved source and output roots at build start.

Do not use the external source refactor as a reason to change passage content in the layout migration.

### 11.3 Staged generation

Every migration slice must generate into a temporary/staging root first:

```text
literacy/comprehension-web/.build-preview/
```

Do not commit this directory. Add it to the relevant ignore file only after confirming no existing policy conflicts.

Compare staged files against live files before copying any output. The comparison must distinguish:

- expected layout/template/runtime changes;
- unexpected passage or prompt changes;
- question-ID changes;
- activity-ID changes;
- marking-guide changes; and
- missing handouts.

### 11.4 Preserve current dirty files

Before implementation begins:

1. Record `git status --short literacy/comprehension-web`.
2. Do not reset, revert, or replace modified generated handouts.
3. Produce staged output only.
4. Compare representative output to the current working copies, not only to `HEAD`.
5. Obtain explicit approval before replacing all generated pages.

---

## 12. Automated tests

### 12.1 Normalization tests

Test:

- inferencing `passages + questions` normalizes to `sentence-task-list`;
- reorganisation `passages + questions` normalizes to `paired-passage-list`;
- evaluation `passages + questions` normalizes to `focus-passage-list`;
- `passage + questions` normalizes to `shared-passage` for every skill;
- explicit layout override wins;
- invalid override fails;
- mismatched passage/question counts fail;
- empty passage fails;
- response-size count mismatch fails; and
- raw input is not mutated.

### 12.2 ID regression tests

Use a fixture with:

- three item-scoped questions;
- two shared questions;
- two shared questions; and
- five shared questions.

Assert IDs are:

```text
q1, q2, q3,
q4a, q4b,
q5a, q5b,
q6a, q6b, q6c, q6d, q6e
```

Generate an ID manifest from all current marking guides and compare migrated output against it.

### 12.3 Renderer tests

Assert:

- every panel has exactly one valid `data-layout`;
- no generated page contains `.sentence-stem`;
- sentence tasks contain one reading and one response region per item;
- paired tasks keep reading before response in DOM order;
- focus tasks include navigation only when more than one task exists;
- shared sections contain one shared reading and the expected question count;
- textareas have unique IDs and matching labels;
- response-size classes match metadata;
- paragraph breaks generate multiple `<p>` elements;
- prompts are escaped;
- configuration JSON can be parsed; and
- output contains no activity-specific template residue.

### 12.4 Export compatibility tests

Using `legacy-response.json`:

- import all old answers by question ID;
- verify every answer is restored;
- export again;
- compare activity ID, section IDs, question IDs, answers, and completion totals;
- allow only `appVersion` and corrected section passage formatting to differ;
- pass the new export through `grade_results.py` using a test-safe input/output location; and
- confirm question scoring lookup still resolves.

### 12.5 Static whole-app audit

After full staged generation, assert:

- expected handout count by skill and level;
- every index link has a target;
- no duplicate activity IDs;
- no duplicate question IDs inside an activity;
- marking guide total marks equal rendered response count;
- generated config total questions equal rendered textarea count;
- every quick inferencing section uses sentence layout;
- every quick reorganisation section uses paired layout unless explicitly documented;
- every quick evaluation section uses focus layout unless explicitly documented;
- every non-quick multi-question section uses shared layout;
- no reorganisation/evaluation instruction says “Read each sentence”; and
- no live response file or scored result is modified.

---

## 13. Manual usability and regression matrix

### 13.1 Pilot activities

At minimum, test:

1. Inferencing Level 1 Handout 1 — short sentence tasks.
2. Inferencing Level 3 Handout 6 — longer sentence inferences and extended text.
3. Reorganisation Level 1 Handout 1 — paired paragraphs and short dialogue.
4. Reorganisation Level 3 Handout 6 — longer quick paragraphs, referents, and calculations.
5. Evaluation Level 1 Handout 1 — two mini-passages and shared passages.
6. Evaluation Level 3 Handout 3 — higher-level evaluation and evidence responses.
7. Evaluation Level 2 standard and bridge variants — special build path and filename preservation.

### 13.2 Viewports

Test each pilot at:

- `1440 × 900` — wide desktop;
- `1024 × 768` — tablet/small desktop;
- `768 × 1024` — portrait tablet; and
- `390 × 844` — phone.

### 13.3 Interaction checklist

For each pilot:

- [ ] Correct strategy blurb appears.
- [ ] Correct section instruction appears.
- [ ] Reading is visually distinct from the prompt.
- [ ] Passage paragraphs and dialogue are preserved.
- [ ] Text scaling affects reading and prompt without clipping controls.
- [ ] Answer box size matches response type.
- [ ] Vertical resizing remains possible.
- [ ] Typing saves automatically.
- [ ] Word count updates.
- [ ] Section badge updates.
- [ ] Switching sections preserves answers.
- [ ] Focus-task navigation preserves answers.
- [ ] Reading focus preserves answers.
- [ ] Keyboard tab order follows reading-related controls, prompt, and response logically.
- [ ] Visible focus indicators appear.
- [ ] Previous/next controls disable correctly at boundaries.
- [ ] Light and dark themes remain readable.
- [ ] Reduced-motion preference suppresses smooth transitions/confetti where required.
- [ ] Reset clears only the current activity after confirmation.
- [ ] Existing response JSON imports.
- [ ] New response JSON exports with unchanged activity/question IDs.
- [ ] Print preview contains every section and task.
- [ ] Printing from a non-first active section gives the same complete worksheet.

### 13.4 Usability observation prompts

During a student/teacher trial, observe rather than leading the participant:

- Can the student immediately identify what must be read?
- Do they recognise which question belongs to which short text?
- Can they relocate evidence without unnecessary navigation?
- Do they understand expected answer length from the response area?
- Do evaluation students read the whole mini-passage before answering?
- Do students notice all tasks in a focus section?
- Does any student interpret the passage as part of the question wording?
- Does the shared-passage layout cause lost position or competing scroll areas?

Record observations by layout mode, not only by activity.

---

## 14. Phased implementation with gates

Do not combine all work into one regeneration. Complete and review each slice before continuing.

### Slice 0 — Baseline, inventory, and safety

Tasks:

1. Capture current worktree status.
2. Create `scripts/layout_inventory.py`.
3. Produce current activity/question ID manifest.
4. Produce current quick-passage length inventory.
5. Inventory standard and bridge variants.
6. Add temporary-output support to rendering/build functions.
7. Add tests for the current export identity contract.

Gate S0:

- Inventory runs without modifying the app.
- All current IDs are recorded.
- All existing modified files remain untouched.
- Test output is written outside live handout directories.
- Bridge/special activities have an explicit disposition.

### Slice 1 — Canonical template and normalized section model

Tasks:

1. Add `templates/handout-template.html`.
2. Add layout and response enums.
3. Add normalization, validation, and ID assignment.
4. Refactor `compile_handout()` to render from normalized data.
5. Add `main()` guard to `build_eval_l2.py`.
6. Render a fixture to a temporary directory.
7. Confirm IDs and configuration.

At this slice, styling may still imitate the current appearance. Do not migrate all handouts.

Gate S1:

- No generated activity is used as a template.
- Normalization and ID tests pass.
- Fixture export matches the legacy identity contract.
- Importing `build_eval_l2.py` has no write side effects.

### Slice 2 — Item-scoped layouts

Tasks:

1. Add `shared/handout.css` and `shared/handout.js`.
2. Implement sentence task list.
3. Implement paired passage list.
4. Implement focus passage list and task navigation.
5. Implement adaptive response sizes.
6. Implement screen and print behaviour for these layouts.
7. Generate only the three Level 1 pilot handouts into staging.

Gate S2:

- Three layout modes pass renderer tests.
- Pilot pages pass desktop, tablet, phone, keyboard, dark-theme, and print checks.
- Old responses import and new responses grade.
- No passage, prompt, ID, mark, or marking guide changes are present.

### Slice 3 — Shared-passage refinement

Tasks:

1. Implement shared passage workspace.
2. Default reading and questions open together.
3. Implement reading-focus mode.
4. Implement stacked tablet/phone layout and `Return to text`.
5. Remove the vertical questions rail from the new runtime.
6. Verify long-text scrolling and print behaviour.

Gate S3:

- Shared reading remains available while answering.
- No conflicting dual scroll on tablet/phone.
- Focus controls are keyboard accessible.
- App-wide focus view still works.
- Print is independent of current layout state.

### Slice 4 — Builder migration and whole-app staged generation

Tasks:

1. Update every `build_all.py` assembly path to use section constructors/metadata.
2. Update `build_eval_l2.py`.
3. Stage-generate all standard handouts.
4. Handle bridge and special handouts explicitly.
5. Run ID, content, link, response-count, and marking-guide comparisons.
6. Review every unexpected diff.

Gate S4:

- Whole-app audit passes.
- Every activity has the expected layout.
- All activity/question IDs match the baseline manifest.
- No results, scored results, or customised marking guides change.
- Expected handout count and index links match.
- Stakeholder approves staged visual samples before live output replacement.

### Slice 5 — Live rollout, documentation, and final QA

Tasks:

1. Replace approved generated HTML only.
2. Re-run static audit against live output.
3. Complete manual regression matrix.
4. Update `Questioning_Guide.md` app-format guidance with the four layout modes.
5. Document safe build commands and source-root requirements.
6. Record before/after usability findings.

Gate S5:

- All automated and manual checks pass on live output.
- No unapproved file is modified.
- Documentation matches actual build behaviour.
- Rollback snapshot/commit is identifiable.

---

## 15. Definition of done

Implementation is complete only when all of the following are true:

### Architecture

- [ ] A dedicated handout template exists.
- [ ] No generated handout is used as a template.
- [ ] Shared handout CSS and JavaScript are used by generated pages.
- [ ] Raw section data is normalized before rendering.
- [ ] Layout is explicit metadata.
- [ ] Rendering contains no `quick-` ID heuristic.

### User experience

- [ ] Inferencing quick items use sentence tasks.
- [ ] Reorganisation quick items use paired passages.
- [ ] Evaluation quick items use focus passages.
- [ ] Shared passages use the refined shared workspace.
- [ ] Reading and question regions are visibly and semantically distinct.
- [ ] Response areas communicate expected scope.
- [ ] Instructions are accurate for strategy and reading form.

### Compatibility

- [ ] Activity IDs are unchanged.
- [ ] Question IDs are unchanged.
- [ ] Local-storage keys are unchanged.
- [ ] Version 2.0.0 response files import.
- [ ] Version 2.1.0 response files grade successfully.
- [ ] Completion counts and section badges remain correct.
- [ ] Marking-guide mappings remain correct.

### Quality

- [ ] Automated unit and renderer tests pass.
- [ ] Whole-app static audit passes.
- [ ] Manual viewport matrix passes.
- [ ] Keyboard and focus checks pass.
- [ ] Dark theme passes.
- [ ] Print passes from every active-section state.
- [ ] No malformed encoding or template residue is introduced.
- [ ] No results or scored-results files are changed.

---

## 16. Rollback plan

Before replacing live generated pages:

1. Ensure the current working changes are safely identifiable in version control or an approved snapshot.
2. Keep staged output separate until approval.
3. Replace only the files listed in the approved staged diff.
4. If a release regression appears, restore the previous generated HTML and previous template/runtime together. Do not roll back only CSS or only JavaScript because their DOM contract versions must match.
5. Do not roll back response JSON, results, scored results, or marking guides; the layout migration should never modify them.
6. If response import/export fails, stop rollout immediately and restore the previous handout runtime while retaining the staged implementation for diagnosis.

The compatibility target is deliberately one-way safe: previous response files continue to work, and layout-only rollback does not invalidate answers saved under the unchanged draft and question IDs.

---

## 17. Junior-developer execution checklist

Use this as the short operational sequence after reading the full plan:

1. Do not run the full builder against live output.
2. Record the current worktree and ID manifest.
3. Implement the read-only layout inventory and tests first.
4. Create the canonical template.
5. Implement normalization and validation as pure functions.
6. Prove existing question IDs remain identical with fixtures.
7. Implement shared CSS and JavaScript against fixture output.
8. Implement the three item-scoped layouts.
9. Implement the shared-passage layout.
10. Test import, export, grading, print, and local persistence.
11. Update both builders to supply layout metadata.
12. Stage-generate all outputs outside the live directories.
13. Run the whole-app audit and investigate every unexpected diff.
14. Obtain visual approval for representative handouts.
15. Replace approved HTML only.
16. Re-run all tests against live output.
17. Update the authoring/build documentation.

If any step changes passage text, prompt text, activity IDs, question IDs, marks, marking guidance, results, or scored results, stop and treat it as an unintended migration change unless separately approved.

