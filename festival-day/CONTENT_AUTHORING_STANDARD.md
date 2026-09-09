# Festival Day — richer case-file authoring standard

This revision is for Year 5 students who can read at approximately Year 4 level. The language stays direct; the thinking comes from the relationships between sources.

## Required story shape

Each mission is one compact case, not a short fact sheet.

1. **Opening incident** — a person needs to decide, investigate or respond under a practical constraint.
2. **Evidence file** — 350–500 words across a short opening and two to four labelled sources. Maths cases may use tables, diagrams described in words, messages and lists in place of some prose.
3. **First decision** — students select, calculate, diagnose or recommend using evidence.
4. **New evidence** — a later message, test result, delivery note, weather update or stakeholder response changes what is known.
5. **Revision** — students explain whether they keep or change their decision and why.

The supported reading is a simpler version of the same case. It retains every clue required by the core questions and update; it may simplify syntax, define words and use chunks.

## Data contract

Each mission object supplies:

```js
{
  id, title, film, type, extension, brief, sourceNote,
  caseOpening: { title, text },
  evidence: [{ id, label, kind, text }],
  support: { title, text },
  questions: [{ id, phase, kind, prompt, options?, answer?, feedback?, evidenceIds? }],
  firstDecision: { prompt, stems, criteria },
  update: { title, text, prompt, stems, criteria },
  finalCriteria: [ ... ]
}
```

Question phases are `notice`, `connect`, `decide` or `update`. Only choice and number questions can receive automatic answer checks. Open responses receive useful review prompts, not automated marks.

## Question standard

At least one question in every mission must require students to combine two sources. At least one must ask for an inference, diagnosis, comparison or constrained judgement. The final decision must permit more than one answer when evidence can support different positions.

Before adding a question, write: “The student must **[operation]** using **[clue A]** and **[clue B]** to conclude **[answer or range]**.” Reject questions whose answer is copied from one sentence unless they establish essential context.

Avoid a narrator stating the final conclusion. Evidence should make a defensible answer possible without declaring it. All invented people, organisations, figures and documents must remain clearly fictional.
