# Agentic Skill Specification  
# Curriculum Descriptor → Augmented Student Demonstration Assessments

## Purpose

This document describes a reusable agentic workflow for taking a single Australian Curriculum mathematics content descriptor and fully expanding it inside the Maths Command Station application as a family of student demonstration assessments.

The workflow is based on the process used for the Year 5 descriptor **AC9M5A02 — Equation Architect** and the surrounding Descriptor Variety Matrix work.

The goal is that a user can provide a content descriptor code, such as `AC9M5A02`, and the agent can:

1. Identify the curriculum meaning of the descriptor.
2. Inspect how the descriptor is currently represented in Joshua / Maths Command Station.
3. Analyse whether the current implementation gives enough variety in how students demonstrate understanding.
4. Design a family of augmented assessment interactions.
5. Reuse or extend existing widgets rather than creating unnecessary new ones.
6. Implement the generator, widget, achievement, and audit changes.
7. Validate the work through static audits, smoke tests, and manual QA.
8. Produce a clean summary/check report for the user.

This is both a **planning skill** and a **coding implementation skill**.

---

## Core Design Philosophy

A content descriptor should not equal one question type.

A descriptor should become a small family of different demonstrations, such as:

- build it
- locate it
- sort it
- test it
- debug it
- explain it
- apply it

The target pattern is the **Descriptor Variety Matrix**:

| Demonstration Form | Purpose |
|---|---|
| Symbolic | Can the student solve or represent the concept with numbers, equations, notation, or typed input? |
| Visual/spatial | Can the student show the concept using a manipulable visual model? |
| Diagnostic | Can the student identify errors, sort correct/incorrect examples, or debug faulty reasoning? |
| Applied/contextual | Can the student apply the concept in a realistic or game-world scenario? |

The agent must avoid merely adding more of the same question. The agent should broaden the evidence of understanding.

---

## Required User Input

The minimum user input is:

```text
Implement augmented student demonstration assessments for AC9M5A02.
```

Useful optional inputs include:

```text
Focus on Year 5.
Use existing widgets only unless extension is necessary.
Make this Slice 2.
Do not create new widgets.
Prioritise visual and diagnostic representations.
```

The agent should infer the rest from the repository.

---

## Required Repository Context

The agent must inspect the repository before planning or coding.

For the Joshua / Maths Command Station project, the key areas are:

```text
Maths_Command_Station/
Maths_Command_Station/year5-practice.js
Maths_Command_Station/achievements-config.js
Maths_Command_Station/widgets/
Maths_Command_Station/widgets/mcs-question-adapter.js
Maths_Command_Station/Improvement_Infrastructure/
Maths_Command_Station/Improvement_Infrastructure/03-Widget-Catalogue.md
Maths_Command_Station/Improvement_Infrastructure/04-Year-Level-Matrix.md
Maths_Command_Station/Improvement_Infrastructure/07-Roadmap-and-Migration.md
Maths_Command_Station/Improvement_Infrastructure/year5-descriptor-variety-matrix.md
Maths_Command_Station/scripts/g3-y5-context-audit.mjs
Maths_Command_Station/scripts/g5-widget-inventory-audit.mjs
Maths_Command_Station/scripts/g5-all-practice-widget-smoke.mjs
```

If the descriptor is not Year 5, substitute the relevant year-level practice file and audit scripts.

---

## Non-Negotiable Project Rules

### 1. Reuse-first widget policy

The agent must prefer extending existing widgets with a new mode/configuration over creating new widgets.

Examples:

```text
Good:
Extend balance-scale with mode: 'solve-unknown'

Bad:
Create a second balance-scale-algebra.js widget
```

### 2. Keep existing contexts stable

Existing context strings should be treated as frozen unless there is a compelling reason to change them.

This protects:

- localStorage progress
- badge tracking
- audit expectations
- historical compatibility

Existing symbolic contexts usually become the Symbolic branch of the descriptor family.

### 3. Do not add badge contexts before generator paths exist

A context should only be added to `achievements-config.js` after it is actually emitted by a generator path.

Otherwise, static reachability audits should fail.

### 4. Plan before implementation

Before coding, the agent should produce or update a descriptor plan:

```text
Descriptor code
Descriptor wording
Current Joshua contexts
Current interaction type
Missing demonstrations
Candidate widgets
Proposed new contexts
Implementation priority
Verification plan
```

### 5. Implement in slices

Each descriptor expansion should be treated as a slice.

A slice should be small enough to:

- understand
- review
- test
- revert if needed

---

# Full Agentic Workflow

---

## Phase 0 — Orient to the Task

### Goal

Understand exactly what descriptor the user wants implemented and what “done” means.

### Agent actions

1. Extract the content descriptor code from the user request.
2. Identify year level and strand from the code.
3. Determine whether the descriptor is already in the app.
4. Locate the relevant practice generator file.
5. Locate the relevant achievement badge config.
6. Locate the relevant widget catalogue and migration documents.
7. Decide whether this is:
   - a new descriptor implementation,
   - a descriptor expansion,
   - a bugfix,
   - or a planning-only task.

### Example

User request:

```text
Implement Slice 2 for AC9M5A02.
```

Agent inference:

```text
Year: 5
Strand: Algebra
Descriptor: AC9M5A02
Current badge family: Equation Architect
Relevant file: Maths_Command_Station/year5-practice.js
Relevant widget opportunity: balance-scale
Likely work type: descriptor expansion
```

---

## Phase 1 — Identify the Content Descriptor

### Goal

Understand what mathematical concept the descriptor actually requires.

### Agent actions

1. Search repository curriculum references for the descriptor code.
2. Search `achievements-config.js` for the matching badge.
3. Search existing planning docs for descriptor notes.
4. Use authoritative curriculum wording if available in the repo.
5. If the descriptor wording is missing or ambiguous, verify from a trusted source.

### Output

The agent should produce a concise descriptor interpretation:

```text
AC9M5A02 involves using mathematical modelling and inverse operations to solve equations where a number is unknown. The core mathematical ideas are equality, inverse relationships, multiplication/division relationships, and reasoning about an unknown value.
```

For AC9M5A02 in our work, the existing implementation was symbolic: students solved unknown multiplication and division equations using a math-field input.

---

## Phase 2 — Inspect Current Joshua Representation

### Goal

Find how the descriptor currently appears in the app.

### Files to inspect

```text
Maths_Command_Station/achievements-config.js
Maths_Command_Station/year5-practice.js
Maths_Command_Station/widgets/mcs-question-adapter.js
Maths_Command_Station/Improvement_Infrastructure/04-Year-Level-Matrix.md
Maths_Command_Station/Improvement_Infrastructure/phase3-practice-migration/
Maths_Command_Station/Improvement_Infrastructure/year5-descriptor-variety-matrix.md
```

### Questions to answer

1. What badge represents this descriptor?
2. What contexts are currently required for badge progress?
3. What generator emits those contexts?
4. What interaction type is currently used?
5. Is the current implementation legacy, canonical, or widget-based?
6. Is the descriptor already covered by multiple representations?
7. What does the migration plan say about future upgrades?

### Example: AC9M5A02

The agent identified:

```text
Badge: Equation Architect
Current contexts:
- unknown-multiplication
- unknown-division

Current interaction:
- math-field symbolic input
- student solves missing number in multiplication/division equation

Current weakness:
- no visual equality model
- no diagnostic sorting/debug task
- no physical applied context
```

---

## Phase 3 — Decompose the Descriptor Conceptually

### Goal

Break the descriptor into mathematical components before choosing widgets.

### Agent actions

For each descriptor, identify:

1. The mathematical objects involved.
2. The student actions required.
3. The likely misconceptions.
4. The representational forms that would reveal understanding.
5. The difference between procedural success and conceptual understanding.

### Example: AC9M5A02

Concept components:

```text
- Equality means both sides have the same value.
- An unknown can be found by reasoning from known quantities.
- Multiplication and division are inverse operations.
- A balanced equation can be checked by substitution.
- A physical balance can model algebraic equality.
```

Common misconceptions:

```text
- Treating the equals sign as “the answer comes next”.
- Guessing the missing number without inverse reasoning.
- Solving only from left to right.
- Not checking whether both sides of the equation are equal.
- Confusing division forms such as □ ÷ 5 = 8 and 40 ÷ □ = 5.
```

This analysis guides the question family.

---

## Phase 4 — Map to Demonstration Forms

### Goal

Design at least four different ways for students to demonstrate the descriptor.

### Required demonstration forms

```text
Symbolic
Visual/spatial
Diagnostic
Applied/contextual
```

### Example: AC9M5A02

| Demonstration Form | Student Action | Context |
|---|---|---|
| Symbolic | Solve `5 × □ = 45` using math-field input | `unknown-multiplication` |
| Symbolic | Solve `□ ÷ 4 = 8` or `40 ÷ □ = 5` | `unknown-division` |
| Visual/spatial | Use a balance scale model to infer the mystery mass | `balance-scale-unknowns` |
| Diagnostic | Sort equation cards into balanced/unbalanced or correct/incorrect | `balanced-equation-sort` |
| Applied/contextual | Solve a mystery cargo/mass scenario with scale support | `applied-unknown-mass` |

The agent should explicitly explain how each form gives different evidence of understanding.

---

## Phase 5 — Inspect the Existing Widget Catalogue

### Goal

Find reusable widgets before designing new UI.

### Files to inspect

```text
Maths_Command_Station/Improvement_Infrastructure/03-Widget-Catalogue.md
Maths_Command_Station/widgets/
```

### Widget decision labels

For every candidate widget, classify it as:

| Status | Meaning |
|---|---|
| Reuse | Existing widget/mode already supports the interaction |
| Extend | Existing widget can support it with a new mode/config |
| New | A genuinely new widget is required |

The agent should avoid “New” unless there is no practical alternative.

### Example: AC9M5A02

| Need | Widget | Decision |
|---|---|---|
| Symbolic unknown answer | `math-field` | Reuse |
| Visual equality model | `balance-scale` | Extend |
| Diagnostic card sort | `sorting-table` | Reuse/extend |
| Applied physical mass problem | `balance-scale` + `math-field` | Reuse/extend |

The important insight was that `balance-scale` already existed for lower-year comparison work, and the catalogue already imagined future algebra modes. Therefore, the correct move was to extend it with `solve-unknown`.

---

## Phase 6 — Check Current Widget Implementation

### Goal

Understand the existing widget code before modifying it.

### Example checks for `balance-scale`

Inspect:

```text
Maths_Command_Station/widgets/mcs-widgets-measure.js
```

Find:

```text
MCS.register('balance-scale', function balanceScaleFactory(container, config) {
  const mode = config.mode || 'compare';
  if (mode === 'compare') return balanceScaleCompare(container, config);
  throw new Error('balance-scale: unknown mode "' + mode + '"');
});
```

Interpretation:

```text
The widget currently supports only compare mode.
Adding solve-unknown is an extension, not a new widget.
```

Also inspect helper patterns and existing bugs.

In our work, this revealed a class-token issue:

```text
container.classList.add(opts.rootClass)
```

This is unsafe if `opts.rootClass` contains spaces, such as:

```text
"mcs-balance-scale mcs-balance-scale-compare"
```

The agent should fix these infrastructure issues before building on top of the affected code.

---

## Phase 7 — Design Context Strings

### Goal

Name the new generator contexts clearly and consistently.

### Context naming rules

Good context names should be:

- lowercase
- hyphenated
- stable
- descriptive
- mathematical rather than implementation-specific
- aligned with existing context naming patterns

### Example AC9M5A02 contexts

```text
unknown-multiplication
unknown-division
balance-scale-unknowns
applied-unknown-mass
balanced-equation-sort
```

### Avoid context drift

The agent must check for mismatches between:

```text
year5-practice.js
achievements-config.js
year5-descriptor-variety-matrix.md
audit scripts
check reports
```

In our process, one risk was the diagnostic task being called both:

```text
equation-balance-debug
balanced-equation-sort
```

The agent should choose one and standardise it everywhere.

Recommended name:

```text
balanced-equation-sort
```

because it describes the student action clearly.

---

## Phase 8 — Produce the Implementation Plan

### Goal

Before coding, write a slice plan that can be reviewed.

### Plan structure

```text
# Slice N Implementation Plan: <Descriptor Code> (<Badge Name>)

## Goal
Explain the conceptual upgrade.

## Current State
Describe existing contexts and interactions.

## Proposed Demonstration Family
List symbolic, visual, diagnostic, applied/contextual branches.

## Widget Changes
Explain which widgets will be reused or extended.

## Generator Changes
Explain how the relevant practice file will emit the new contexts.

## Achievement Changes
Explain when and how badge requirements will be updated.

## Audit/Validation Plan
List required automated and manual checks.

## Open Questions
Surface any decisions the user should approve.
```

### Example open question from AC9M5A02

```text
Should applied-unknown-mass be purely a word problem, or should it also render the balance-scale?
```

The preferred answer was:

```text
Render the balance-scale as a visual anchor alongside the word problem.
```

This preserves the purpose of the visual/spatial model and supports conceptual transfer.

---

## Phase 9 — Implement Infrastructure Fixes First

### Goal

Fix known structural issues before adding new features.

### Example: class token helper

In `mcs-widgets-measure.js`, add:

```js
function addClassTokens(el, classNames) {
  String(classNames || '')
    .split(/\s+/)
    .filter(Boolean)
    .forEach(function (name) {
      el.classList.add(name);
    });
}
```

Then replace:

```js
container.classList.add(opts.rootClass);
```

with:

```js
addClassTokens(container, opts.rootClass);
```

### Why this comes first

If the existing widget helper crashes on space-separated class names, then adding new modes to the same file may hide or worsen an existing runtime bug.

The agent should stabilise the platform before extending it.

---

## Phase 10 — Extend the Required Widget

### Goal

Add a new mode to an existing widget without breaking existing modes.

### Example: `balance-scale` solve-unknown mode

Add a new function:

```js
function balanceScaleSolveUnknown(container, config) {
  // Render balanced beam
  // Render mystery object labelled x or ?
  // Render unit masses
  // Announce state for accessibility
  // Return standard widget API
}
```

Then extend the factory:

```js
MCS.register('balance-scale', function balanceScaleFactory(container, config) {
  config = config || {};
  var mode = config.mode || 'compare';
  if (mode === 'compare') return balanceScaleCompare(container, config);
  if (mode === 'solve-unknown') return balanceScaleSolveUnknown(container, config);
  throw new Error('balance-scale: unknown mode "' + mode + '"');
});
```

### Widget API requirements

The widget should provide the same basic API pattern as other widgets:

```js
getValue()
setValue(v)
setEnabled(on)
showSolution(v)
flagCorrect()
flagIncorrect()
onChange(cb)
destroy()
```

### For a visual-first slice

The widget does not need to become a full algebra solver immediately.

Acceptable first implementation:

```text
balance-scale renders the equality model.
math-field captures the answer.
evaluate() checks the math-field answer.
showSolution() reveals or highlights the unknown mass.
```

This keeps the slice manageable.

---

## Phase 11 — Extend Supporting Widgets If Needed

### Goal

Add narrowly useful modes to existing widgets where they serve multiple future descriptors.

### Example: `sorting-table` text-cards mode

The diagnostic AC9M5A02 task required full equation strings on cards, not only shapes/emojis.

So the agent extended the existing sorting-table support with a text-card display mode.

This is a good extension because it can also serve:

```text
correct/incorrect fraction statements
balanced/unbalanced equations
reasonable/unreasonable estimates
equivalent/non-equivalent percentage statements
valid/invalid graph interpretations
```

### Agent rule

A supporting widget extension is acceptable when:

1. It is small.
2. It keeps the existing widget contract.
3. It improves reuse across future descriptor slices.
4. It does not fork duplicate UI logic.

---

## Phase 12 — Refactor the Practice Generator

### Goal

Make the descriptor generator dispatch across a family of sub-generators.

### File

For Year 5:

```text
Maths_Command_Station/year5-practice.js
```

### Pattern

Before:

```text
AC9M5A02 has one generator branch:
- find-unknown
```

After:

```text
AC9M5A02 dispatches across:
- unknown-multiplication
- unknown-division
- balance-scale-unknowns
- applied-unknown-mass
- balanced-equation-sort
```

### Required generator outputs

Each generated question should include:

```js
{
  descriptor: 'AC9M5A02',
  context: '<context-string>',
  category: 'algebra',
  title: '...',
  prompt: '...',
  widgets: [...],
  inputs: [...],
  evaluate(values) { ... },
  hint: { text: '...', highlight: [...] },
  solution: { text: '...', show: {...} },
  points: 10
}
```

If the app still supports legacy question objects, the agent must preserve compatibility or route through the adapter.

### Design rule

Do not destroy working symbolic paths.

Preserve:

```text
unknown-multiplication
unknown-division
```

Then add new branches.

---

## Phase 13 — Design Each Sub-Generator

### Symbolic branch

Purpose:

```text
Maintain existing direct equation solving.
```

Example:

```text
5 × □ = 45
□ ÷ 4 = 8
40 ÷ □ = 5
```

Widget/input:

```text
math-field
```

Evaluation:

```text
Check integer answer.
```

---

### Visual/spatial branch

Purpose:

```text
Represent equality as a balanced system.
```

Example:

```text
Left pan: mystery box + 3 kg
Right pan: 15 kg
Find the mystery mass.
```

Widgets:

```text
balance-scale mode: solve-unknown
math-field
```

Evaluation:

```text
Student answer equals right mass minus known left units.
```

Hint:

```text
Both sides are balanced, so they have the same total mass.
Remove the known 3 kg from both sides.
15 - 3 = 12.
```

Solution:

```text
The mystery box is 12 kg because 12 + 3 = 15.
```

---

### Applied/contextual branch

Purpose:

```text
Transfer the equation model into a real or game-world scenario.
```

Example:

```text
A cargo pod and 4 kg are balanced with 20 kg on the other side.
What is the mass of the cargo pod?
```

Widgets:

```text
balance-scale mode: solve-unknown
math-field
```

Design rule:

```text
Use the visual model as an anchor, not just text.
```

---

### Diagnostic branch

Purpose:

```text
Test whether the student can verify equality or identify faulty reasoning.
```

Preferred version:

```text
Sort each equation into Balanced or Unbalanced.
```

Use fully evaluable equations:

```text
3 × 4 = 12
10 + 2 = 5 × 3
36 ÷ 6 = 5
7 × 3 = 21
```

Alternative version:

```text
Sort proposed solutions into Correct or Incorrect.
```

Example:

```text
x = 4 makes 5 × x = 20
x = 6 makes x ÷ 3 = 3
x = 8 makes 40 ÷ x = 5
```

Widget:

```text
sorting-table mode: category-columns / text-cards
```

Avoid ambiguous cards such as:

```text
5 × ? = 20
```

That is not balanced or unbalanced until the unknown value is assigned.

---

## Phase 14 — Update Achievement Configuration

### Goal

Make the descriptor badge require the broader demonstration family.

### File

```text
Maths_Command_Station/achievements-config.js
```

### Before

```js
requirements: {
  points: 50,
  contexts: ['unknown-multiplication', 'unknown-division']
}
```

### After

```js
requirements: {
  points: 50,
  contexts: [
    'unknown-multiplication',
    'unknown-division',
    'balance-scale-unknowns',
    'applied-unknown-mass',
    'balanced-equation-sort'
  ]
}
```

### Warning

Only update the badge config after the generator emits the new contexts.

If badge contexts are added before generator contexts exist, the static audit should fail.

---

## Phase 15 — Update or Check Audit Scripts

### Goal

Ensure the static audit can detect the new contexts.

### File

```text
Maths_Command_Station/scripts/g3-y5-context-audit.mjs
```

### How the audit works

The audit:

1. Reads required Year 5 contexts from `achievements-config.js`.
2. Scans `year5-practice.js` and `mcs-question-adapter.js` for emitted context strings.
3. Reports missing contexts.
4. Runs a browser smoke check if Playwright is available.

### Agent rule

Do not blindly hardcode contexts into the audit.

First check whether the regex can detect them naturally.

Only add to the hardcoded emitted-context list if:

```text
The context is generated dynamically in a way the regex cannot detect.
```

### Risk

Hardcoding too aggressively can hide a real generator reachability issue.

---

## Phase 16 — Update Planning Documentation

### Goal

Keep planning docs aligned with implemented reality.

### Files

```text
Maths_Command_Station/Improvement_Infrastructure/year5-descriptor-variety-matrix.md
```

Possibly also:

```text
Maths_Command_Station/Improvement_Infrastructure/check-reports/
Maths_Command_Station/Improvement_Infrastructure/07-Roadmap-and-Migration.md
```

### Required update

For the implemented descriptor, change proposed contexts from planned to implemented if the document supports status notes.

For AC9M5A02, ensure the matrix uses the same diagnostic context name as the code:

```text
balanced-equation-sort
```

not a competing name such as:

```text
equation-balance-debug
```

### Agent rule

Context names must match across:

```text
year5-practice.js
achievements-config.js
year5-descriptor-variety-matrix.md
audit scripts
check reports
```

---

## Phase 17 — Run Automated Validation

### Required commands

From the repository root, run:

```bash
node Maths_Command_Station/scripts/g3-y5-context-audit.mjs
node Maths_Command_Station/scripts/g5-widget-inventory-audit.mjs
node Maths_Command_Station/scripts/g5-all-practice-widget-smoke.mjs
```

If the relevant year has a different audit script, use that instead.

### Expected pass conditions

```text
G3 context audit:
- all configured contexts have at least one emission path
- browser smoke has no console/page errors

G5 widget inventory:
- required widgets remain registered
- no widget registration regressions

G5 all-practice widget smoke:
- no page errors
- no console errors
- no widget mode errors
- no interaction smoke failures
```

### Common failures to watch for

```text
Unknown widget mode
Context configured but not emitted
Context emitted but not in badge config
classList.add token errors
Konva method errors
MathLive warnings/errors
showSolution missing for a widget
sorting-table card overflow
keyboard/touch interaction broken
```

---

## Phase 18 — Manual QA

### Goal

Automated checks are necessary but not sufficient.

The agent should either perform browser checks directly or give the user a targeted QA list.

### Manual QA checklist for a descriptor slice

```text
Open year5-practice.html.
Force or repeatedly generate the target descriptor.
Confirm all new contexts appear.
Answer each context correctly.
Answer each context incorrectly.
Trigger hint after a wrong attempt.
Trigger showSolution.
Confirm badge progress updates.
Confirm no console errors.
Confirm visual layout on small screen.
Confirm keyboard/touch basics.
Confirm previous contexts still work.
```

### Manual QA for AC9M5A02

```text
1. Generate unknown-multiplication.
2. Generate unknown-division.
3. Generate balance-scale-unknowns.
4. Generate applied-unknown-mass.
5. Generate balanced-equation-sort.
6. Confirm balance scale renders correctly.
7. Confirm the mystery mass is visually clear.
8. Confirm the known masses and equation match the answer.
9. Confirm sorting-table text cards fit.
10. Confirm hint and solution text match the generated numbers.
```

---

## Phase 19 — Produce a Slice Check Report

### Goal

Leave a durable record for future work.

### Suggested file location

```text
Maths_Command_Station/Improvement_Infrastructure/check-reports/
```

### Suggested file name

```text
slice-2-ac9m5a02-equation-architect.md
```

or timestamped:

```text
mcs-slice-2-ac9m5a02-YYYY-MM-DD-HHMM.md
```

### Report structure

```markdown
# Slice 2 — AC9M5A02 Equation Architect

## Goal
Broaden AC9M5A02 from symbolic unknown solving to a multi-representation demonstration family.

## Files changed
- Maths_Command_Station/year5-practice.js
- Maths_Command_Station/widgets/mcs-widgets-measure.js
- Maths_Command_Station/widgets/mcs-widgets-data.js
- Maths_Command_Station/achievements-config.js
- Maths_Command_Station/scripts/g3-y5-context-audit.mjs
- Maths_Command_Station/Improvement_Infrastructure/year5-descriptor-variety-matrix.md

## Contexts
Existing:
- unknown-multiplication
- unknown-division

New:
- balance-scale-unknowns
- applied-unknown-mass
- balanced-equation-sort

## Widget changes
- Extended balance-scale with solve-unknown mode.
- Extended sorting-table with text-cards support.
- Fixed safe class-token handling in mcs-widgets-measure.js.

## Validation
- g3-y5-context-audit: PASS/FAIL
- g5-widget-inventory-audit: PASS/FAIL
- g5-all-practice-widget-smoke: PASS/FAIL

## Manual QA
- Symbolic branch checked: yes/no
- Visual branch checked: yes/no
- Applied branch checked: yes/no
- Diagnostic branch checked: yes/no
- Badge progress checked: yes/no

## Known follow-ups
- Standardise any context naming mismatches.
- Consider future drag-to-balance interaction.
```

---

## Phase 20 — Commit and Review

### Commit message pattern

Use a descriptive commit message:

```text
feat: expand AC9M5A02 equation demonstrations
```

or:

```text
feat(mcs): add AC9M5A02 balance-scale and diagnostic contexts
```

### Before commit

Run:

```bash
git diff --stat
git diff
```

Check for:

```text
unrelated file changes
accidental generated files
debug console logs
old context names
dead branches
large binary files
```

### After commit

Push and verify that the repo reflects the expected files.

Expected file categories for a descriptor expansion:

```text
practice generator
achievement config
widget implementation
planning matrix
audit/check report
```

---

# Agent Decision Tree

## When given a descriptor code

```text
1. Is the descriptor already represented in achievements-config.js?
   - Yes: expand existing badge family.
   - No: add new badge only after confirming curriculum and generator plan.

2. Is there an existing generator?
   - Yes: preserve existing contexts and add branches.
   - No: create generator branch with at least one symbolic path first.

3. Does an existing widget serve the concept?
   - Yes: reuse.
   - Almost: extend with mode/config.
   - No: propose new widget, but justify strongly.

4. Are new contexts planned?
   - Keep in matrix until implementation.
   - Add to achievements-config.js only after generator emits them.

5. Are audits passing?
   - Yes: proceed to manual QA.
   - No: fix before commit.

6. Did the work change badge difficulty?
   - Yes: explain in report.
```

---

# Descriptor Expansion Template

The agent can use this template for any descriptor.

```markdown
# Slice N — <Descriptor Code> <Badge Name>

## Descriptor meaning
<Official or repo wording>

## Current Joshua representation
- Badge:
- Current contexts:
- Current interaction:
- Current widgets:
- Known limitations:

## Concept decomposition
- Key concept 1:
- Key concept 2:
- Key concept 3:
- Misconception 1:
- Misconception 2:

## Demonstration family

| Form | Student action | Widget | Context |
|---|---|---|---|
| Symbolic |  |  |  |
| Visual/spatial |  |  |  |
| Diagnostic |  |  |  |
| Applied/contextual |  |  |  |

## Widget plan
- Reuse:
- Extend:
- New:

## Implementation plan
1. 
2. 
3. 
4. 

## Files to modify
- 
- 
- 

## Validation
- Static audit:
- Widget smoke:
- Manual QA:

## Risks
- 
- 
```

---

# Example: Completed AC9M5A02 Pattern

## Descriptor

```text
AC9M5A02 — Equation Architect
```

## Existing contexts

```text
unknown-multiplication
unknown-division
```

## New contexts

```text
balance-scale-unknowns
applied-unknown-mass
balanced-equation-sort
```

## Widget changes

```text
balance-scale:
- existing compare mode preserved
- new solve-unknown mode added

sorting-table:
- existing category columns preserved
- text-cards mode added for equation cards
```

## Student demonstration family

| Form | Evidence of understanding |
|---|---|
| Symbolic | Student can solve an unknown in multiplication/division equations. |
| Visual/spatial | Student can interpret equality using a balance model. |
| Diagnostic | Student can recognise balanced and unbalanced equations. |
| Applied/contextual | Student can translate a physical mass situation into an unknown-value equation. |

## Key lesson

The descriptor is no longer assessed as a single missing-number task. It is assessed through multiple connected representations of equality and inverse reasoning.

---

# Future Improvement Ideas

For later slices, the agent may propose deeper interactivity, such as:

```text
balance-scale make-balance mode:
Student drags units onto the pan until both sides balance.

balance-scale inverse-step mode:
Student removes equal units from both sides before entering x.

sorting-table explanation mode:
Student sorts and then chooses the reason why an equation is unbalanced.

math-field worked-step mode:
Student enters the inverse operation before the final answer.
```

These should be separate slices, not bundled into the first implementation unless explicitly requested.

---

# Definition of Done

A descriptor expansion is done when:

```text
1. The descriptor has a clear conceptual decomposition.
2. The current app representation has been inspected and documented.
3. At least four demonstration forms have been planned.
4. Existing contexts are preserved.
5. New context strings are stable and consistent.
6. Existing widgets are reused or extended.
7. The relevant practice generator emits all contexts.
8. achievements-config.js requires the correct contexts.
9. Static context audit passes.
10. Widget smoke checks pass.
11. Manual QA confirms all branches render and assess correctly.
12. A check report or implementation note records the slice.
13. The work is committed with a clear message.
```

---

# Agent Prompt Version

The following can be used as a compact instruction prompt for an implementation agent.

```text
You are working in the Joshua repository, specifically Maths_Command_Station.

Your task is to implement augmented student demonstration assessments for the provided Australian Curriculum mathematics content descriptor.

Do not treat a descriptor as one question type. Expand it into a family of demonstrations:
1. Symbolic
2. Visual/spatial
3. Diagnostic
4. Applied/contextual

Workflow:
1. Identify the descriptor meaning from repo curriculum sources and achievements-config.js.
2. Inspect the current generator, contexts, widgets, migration docs, and audits.
3. Document the current shipped interaction and current badge contexts.
4. Decompose the descriptor into key concepts and likely misconceptions.
5. Design a demonstration family with context strings.
6. Reuse or extend existing widgets before creating anything new.
7. Preserve existing contexts; do not rename them.
8. Add new contexts to achievements-config.js only after generators emit them.
9. Implement the widget modes and generator branches.
10. Ensure all widgets return the standard MCS widget API.
11. Run the relevant context audit and widget smoke tests.
12. Manually verify all new branches, hints, solutions, and badge progress.
13. Produce a short slice check report listing files changed, contexts added, tests run, and follow-ups.

Rules:
- Follow the reuse-first widget policy.
- Avoid duplicate widget implementations.
- Keep context names consistent across code, achievements, audits, and docs.
- Do not hide unreachable contexts by hardcoding audit results unless the context is genuinely generated dynamically.
- Keep slices small and reviewable.
- Report honestly if any test was skipped or could not be run.
```

---

# Practical Agent Checklist

Use this checklist during execution.

```text
[ ] Descriptor code identified
[ ] Descriptor wording confirmed
[ ] Badge located in achievements-config.js
[ ] Existing contexts listed
[ ] Existing generator branch located
[ ] Existing interaction type described
[ ] Widget catalogue checked
[ ] Candidate widgets classified as Reuse / Extend / New
[ ] Four demonstration forms planned
[ ] Context names chosen
[ ] Context names checked for collisions
[ ] Slice plan written
[ ] Widget infrastructure issues checked
[ ] Required widget modes implemented
[ ] Practice generator refactored
[ ] Existing symbolic paths preserved
[ ] New contexts emitted literally or audit-detectably
[ ] achievements-config.js updated
[ ] Planning matrix updated
[ ] Audit scripts checked
[ ] Static audit run
[ ] Widget smoke run
[ ] Manual QA completed
[ ] Check report written
[ ] Commit created
[ ] Post-push verification completed
```
