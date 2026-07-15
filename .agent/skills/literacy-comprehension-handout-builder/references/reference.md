# Literacy Comprehension Handout Builder — Reference

## Colour tokens

Use these exact pairs on `:root` / `[data-theme="dark"]`.

### Inferencing (blue ramp)

| Level | `--accent` | `--accent-light` | `--accent-hover` | Dark `--accent` | Dark `--accent-light` | Dark `--accent-hover` |
|---|---|---|---|---|---|---|
| 1 | `#6BA3C9` | `#EAF4FA` | `#4F8FB8` | `#7EB8D9` | `#0F2433` | `#9CC9E3` |
| 2 | `#2F6F95` | `#E3F0F7` | `#245A7A` | `#4A9BC4` | `#0C2230` | `#6BB0D1` |
| 3 | `#1A3F5C` | `#DCE8F0` | `#142F45` | `#5A9BC4` | `#0A1C28` | `#7AAFCF` |

### Evaluation (teal ramp)

| Level | `--accent` | `--accent-light` | `--accent-hover` | Dark `--accent` | Dark `--accent-light` | Dark `--accent-hover` |
|---|---|---|---|---|---|---|
| 1 | `#4AA8B5` | `#E8F6F8` | `#3A8F9A` | `#5EC4D1` | `#0C2A30` | `#7AD0DB` |
| 2 | `#0E7490` | `#ECFEFF` | `#0891B2` | `#06B6D4` | `#083344` | `#22D3EE` |
| 3 | `#0F4C5C` | `#E0F2F5` | `#0A3A46` | `#2BB3C9` | `#082830` | `#4DC4D6` |

### Reorganisation (violet ramp)

| Level | `--accent` | `--accent-light` | `--accent-hover` | Dark `--accent` | Dark `--accent-light` | Dark `--accent-hover` |
|---|---|---|---|---|---|---|
| 1 | `#9B8EC4` | `#F3F0FA` | `#8474B3` | `#B3A5DB` | `#1E1830` | `#C4B8E6` |
| 2 | `#6D5A9C` | `#EDE9F6` | `#5A4985` | `#9B87C9` | `#1A1430` | `#B09AD6` |
| 3 | `#3F2F66` | `#E8E4F2` | `#322553` | `#A78BDA` | `#161028` | `#BBA3E3` |

Hub skill card top borders (`shared/site.css`):

- Inferencing → Evaluation L2 blue family: `#2F6F95`
- Evaluation → `#0E7490`
- Reorganisation → `#6D5A9C`

## Source folder map (current)

```
literacy/Literacy rotations/
  Evaluation/                 ← preferred Evaluation sources (L2 + L3 md/html)
  Evaluation Level 2/         ← legacy / duplicate; prefer Evaluation/ when both exist
  Inferencing/
    Level 1/                  ← Inferencing L1 handouts 1–8
  (Reorganisation/)           ← not yet present
```

## Markdown shapes

### A. Evaluation-style

```markdown
# Evaluation Level 2 - Handout 1

## UMBRELLA
<passage paragraphs>

### Questions
* What had happened? Why do you say that?

---

## UPSET
...

### Questions
a. Why do you think Haley was upset at lunch time?
b. Do you think Haley's mother had seen the movie? Why do you say that?
```

**Mapping**

- Each `## TITLE` → one tab; `sectionId` = kebab-case of title (`umbrella`)
- Single `*` question → `qN`
- Letter items `a.` `b.` → `qNa` `qNb`
- Tab label: short title (truncate long titles)

### B. Inferencing-style

```markdown
## Part 1: Quick Inferences (Sentences)
### Question 1
> sentence
* **Question:** ...
* **Answer:**

## Part 2: Short Passage Inferences
### Question 4: THE NOISE
> passage
* **Questions:**
  * **a.** ...
```

**Mapping**

- Prefer grouping by `## Part …` as tabs when a part has multiple short items **or**
- Group each titled passage (`### Question N: TITLE`) as its own tab when it has a multi-paragraph story
- Practical rule for Level 1 Handout 1:
  - Tab 0: Part 1 (q1, q2, q3) — short sentence prompts; show each sentence above its question
  - Tab 1: THE NOISE (q4a, q4b)
  - Tab 2: WAITING (q5a, q5b)
  - Tab 3: ON THE BUS (q6a–q6e)
- Omit blank `* **Answer:**` lines from the UI

If a handout is ambiguous, choose the grouping that keeps **≤ 6 tabs** and check with the user only when still unclear.

## Question card HTML pattern

```html
<div class="question-card">
  <div class="question-header">
    <span class="question-title">PROMPT TEXT</span>
    <div class="auto-save-indicator" id="save-qID"><span class="save-dot"></span> Saved</div>
  </div>
  <div class="textarea-container">
    <textarea id="qID" class="answer-textarea" placeholder="Type your answer here..." oninput="onAnswerInput('qID', TAB_INDEX)"></textarea>
  </div>
  <div class="card-footer">
    <span class="word-counter" id="words-qID">0 words</span>
  </div>
  <div class="print-answer-box" id="print-qID">....</div>
</div>
```

For short sentence stems, put the stem in `.story-text` (or a compact callout above the question) so students still see the clue text when answering.

## JS constants checklist

```javascript
const ACTIVITY_ID = 'inferencing-level-1-handout-1';
const sectionIds = ['quick-inferences', 'the-noise', 'waiting', 'on-the-bus'];
const tabQuestionKeys = [
  ['q1', 'q2', 'q3'],
  ['q4a', 'q4b'],
  ['q5a', 'q5b'],
  ['q6a', 'q6b', 'q6c', 'q6d', 'q6e']
];
const questionsPerTab = tabQuestionKeys.map(k => k.length);
// state.answers keys must match every id in tabQuestionKeys
// localStorage draft key: inferencing-l1-h1-state
// questions drawer open state (shared): literacy-comprehension-questions-open ("1"|"0", default closed)
```

## JSON response schema (v1)

```json
{
  "schemaVersion": "1.0",
  "exportType": "literacy_comprehension_student_response",
  "activity": {
    "activityId": "inferencing-level-1-handout-1",
    "title": "Inferencing",
    "skill": "inferencing",
    "level": 1,
    "handout": 1,
    "skillLabel": "Inferencing"
  },
  "student": {
    "name": "jsmith",
    "activityDate": "2026-07-15"
  },
  "submission": {
    "submissionId": "uuid",
    "startedAt": "ISO",
    "lastSavedAt": "ISO",
    "exportedAt": "ISO",
    "appVersion": "2.0.0",
    "completion": {
      "answeredQuestions": 0,
      "totalQuestions": 0,
      "percentage": 0,
      "isComplete": false
    }
  },
  "sections": [
    {
      "sectionId": "the-noise",
      "order": 2,
      "title": "The Noise",
      "passage": "...",
      "responses": [
        {
          "questionId": "q4a",
          "order": 1,
          "prompt": "What was the noise?",
          "response": "",
          "wordCount": 0,
          "answered": false
        }
      ]
    }
  ]
}
```

Legacy Evaluation L2 Handout 1 may still use `exportType: literacy_evaluation_student_response`. New pages should use `literacy_comprehension_student_response`. When opening old files, accept either type **only if** `activityId` matches.

## Breadcrumb snippet

```html
<nav class="breadcrumb" aria-label="Breadcrumb">
  <a href="../../index.html">Home</a>
  <span class="sep">/</span>
  <a href="../index.html">Inferencing</a>
  <span class="sep">/</span>
  <a href="index.html">Level 1</a>
  <span class="sep">/</span>
  <span>Handout 1</span>
</nav>
```

## Level index row (live)

```html
<div class="handout-row">
  <div class="meta">
    <h3>Handout 1</h3>
    <p>Short blurb from first passage titles</p>
  </div>
  <div class="actions">
    <span class="status ready">Live</span>
    <a class="btn btn-primary" href="handout-01.html">Open worksheet</a>
    <a class="btn" href="../../content/inferencing/level-1/handout-01.md">Source</a>
  </div>
</div>
```

## Smoke-check script (manual)

1. Open `handout-NN.html` in a browser.
2. Enter a school username; confirm date is today.
3. With name blank, click Save → toast blocks download and focuses the name field.
4. Type in one answer → reload → draft restored.
5. Save JSON → clear/reset → Open JSON → answers restored.
6. Toggle theme; enter Focus view; Escape exits.
7. Print preview shows title + school user name + date + passages/answers.
