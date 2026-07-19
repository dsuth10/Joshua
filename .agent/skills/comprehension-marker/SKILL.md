---
name: comprehension-marker
description: >
  AI-powered grading workflow for the comprehension-web literacy application.
  Scans the Results/ folder for ungraded student JSON files, loads the matching
  marking guide, evaluates each open-text response, and writes scored output to
  scored-results/. Trigger this when the user asks to grade, mark, or score
  comprehension results, or to check for new ungraded assessments.
---

# comprehension-marker Skill

## Purpose

Grade student open-text responses from the `comprehension-web` application.
The system uses **pre-authored marking guides** (JSON files in `marking-guides/`)
and applies AI judgement to score each response and produce `scored-results/` files.
This is an **agent-executed workflow** — the teacher asks the AI to run it, not a live in-browser call.

---

## Directory Structure

```
literacy/comprehension-web/
├── Results/                       ← Raw student submissions (read-only input)
│   └── <Skill Level Name>/        ← e.g. "Inferencing level 1"
│       └── <activityId>_<student>_<date>.json
├── marking-guides/                ← One JSON file per activityId (see schema below)
│   └── inferencing-level-1-handout-1.json
└── scored-results/                ← Output: one .scored.json per student file
    └── <Skill Level Name>/
        └── <activityId>_<student>_<date>.scored.json
```

---

## Marking Guide Schema

Each file in `marking-guides/` follows this structure:

```json
{
  "activityId": "inferencing-level-1-handout-1",
  "title": "...",
  "skill": "inferencing",
  "level": 1,
  "handout": 1,
  "totalMarks": 12,
  "questions": [
    {
      "questionId": "q1",
      "sectionId": "quick-inferences",
      "order": 1,
      "prompt": "...",
      "passage": "...",
      "maxMarks": 1,
      "markingGuide": "Plain English description of what constitutes a correct answer, what to accept, what to reject, and how to handle partial or borderline responses."
    }
  ]
}
```

---

## Scored Result Schema

Each `scored-results/` file is the original student JSON with a `marking` block appended:

```json
{
  "...all original student JSON fields...",
  "marking": {
    "gradedAt": "ISO8601 timestamp",
    "gradedBy": "comprehension-marker-skill v1.0",
    "totalMarks": 12,
    "earnedMarks": 10,
    "percentage": 83,
    "questionScores": [
      {
        "questionId": "q1",
        "score": 1,
        "maxMarks": 1,
        "rationale": "One sentence explaining the award decision."
      }
    ]
  }
}
```

---

## Workflow — Step by Step

### Step 1 — Discover Ungraded Files

Scan `Results/**/*.json`. 
- Group the discovered files by `activityId` and `student` (student user name derived from the filename `<activityId>_<student>_<date>...json`).
- If there are multiple files for the same `activityId` and `student`, **only keep the most recent one** (determined by the date/time in the filename or duplicate suffix like `(1)`). Ignore the older duplicates.
- For each remaining most recent file:
  - Derive its output path: `scored-results/<same subfolder>/<same filename>.scored.json`
  - Note: the output uses `.scored.json` suffix, not replacing `.json`
  - If the `.scored.json` already exists in `scored-results/` for this exact file → **SKIP** (already graded)
  - Otherwise → add to the grading queue

Report: "Found X files to grade, Y already scored, Z duplicates skipped."

### Step 2 — Load Marking Guide

For each file in the queue:
1. Read the student JSON to get `activity.activityId`
2. Load `marking-guides/<activityId>.json`
3. If no marking guide exists for this `activityId` → log a warning, skip the file, continue

### Step 3 — Score Each Response

For every response in `sections[].responses[]`:
1. Find the matching question in the marking guide by `questionId`
2. Read `passage`, `prompt`, `markingGuide`, and `maxMarks`
3. Apply AI judgement:
   - Compare the student's `response` against the `markingGuide` criteria
   - Assign `score` (0 or `maxMarks`) — no partial marks unless the guide explicitly allows them
   - Write a one-sentence `rationale` explaining the decision
   - If a response has `answered: false` or is blank → score 0, rationale: "Not attempted."

### Step 4 — Calculate Totals

```
earnedMarks = sum of all questionScores[].score
totalMarks  = sum of all questionScores[].maxMarks (from marking guide)
percentage  = round(earnedMarks / totalMarks * 100)
```

### Step 5 — Write Scored JSON

Write the output file to `scored-results/<subfolder>/<original-filename>.scored.json`
using the Scored Result Schema above.

### Step 6 — Summary Report

After processing all files, print a summary table:

```
Grading complete.
─────────────────────────────────────────────
Files graded:   34
Files skipped:  0 (already scored)
Warnings:        0 (missing marking guides)
─────────────────────────────────────────────
Handout 1 — 15 students — avg 9.2/12 (77%)
Handout 2 — 12 students — avg 8.8/12 (73%)
Handout 3 —  5 students — avg 7.6/10 (76%)
Handout 4 —  2 students — avg 8.5/11 (77%)
─────────────────────────────────────────────
```

---

## Authoring a New Marking Guide

When a new handout is added to the system (via the `literacy-comprehension-handout-builder` skill),
**immediately author its marking guide** before any students complete it:

1. Read the handout HTML or its defining result JSON to extract all sections, passages, and question prompts
2. For each question, write a `markingGuide` entry that:
   - States what to **accept** (including synonyms and reasonable paraphrases)
   - States what to **reject** (common misconceptions or vague non-answers)
   - Notes if evidence/justification is required (e.g. "How do you know?" questions always need evidence)
   - Confirms `maxMarks` (usually 1 per question)
3. Save as `marking-guides/<activityId>.json`
4. Commit the file alongside the handout

---

## Trigger Phrases

Use this skill when the user says any of:
- "Grade the comprehension results"
- "Mark the assessments"
- "Score the new results"
- "Check for new results to grade"
- "Run the comprehension marker"
- "Grade [student name]'s results"

---

## Notes

- **All current marking guides** cover Inferencing Level 1, Handouts 1–4.
- As Evaluation and Reorganisation handouts are used, new marking guides must be authored and added to `marking-guides/`.
- The scored JSON files are the **source of truth** for the teacher dashboard — do not delete them.
- If a student response is ambiguous, award the benefit of the doubt if the core inference is correct.
