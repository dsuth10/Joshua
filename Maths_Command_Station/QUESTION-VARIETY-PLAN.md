# Maths Command Station - Question Variety Implementation Plan

## Goal Description
The objective is to eliminate repetitive question generation within practice sessions across Maths Command Station (Prep through Year 6). We will achieve this by introducing session-level deduplication (fingerprinting) via a new `mcs-question-picker.js` module. Additionally, we will broaden the parameter space of small finite gap generators and implement a deck-based shuffle for purely static MCQs.

## Technical Stack
* **Language**: Vanilla JavaScript / Node.js (for audit scripts).
* **Environment**: Browser (`localStorage`, DOM, global state) and Node (CLI audit script).
* **Architecture**: Slice-by-slice implementation. Code must adhere to the `legacy-keep` tag rules, Canonical Question Package schema (`descriptor`, `context`, `evaluate`), and avoid inline SVGs.

## Proposed Changes (Files/Components)

### Slice 0: Audit Gate
* **`scripts/g-question-variety-audit.mjs` [NEW]**
  - A Node.js static analysis script.
  - Scans `*-practice.js` and `year*.js` files.
  - Fails if a `generate*` function lacks `Math.random` / `randomInt` and doesn't use a shuffled deck, or if fixed pools (arrays) are too small (<5).
  - Provides a measurable baseline before starting widget updates.

### Slice 1: Session Deduplication Infrastructure
* **`mcs-question-picker.js` [NEW]**
  - A shared browser utility that maintains `sessionSeenQuestions` (a `Set` of fingerprints like `context::prompt`).
  - Exposes `MCS.questionPicker.pick(generateFn, maxAttempts)` and `.pickFromPool(pool)`.
* **`*-practice.html` files [MODIFY]**
  - Add `<script src="mcs-question-picker.js"></script>` to Prep-Y6 practice HTML files.
* **`year3-practice.js` & `year4-practice.js` [MODIFY]**
  - Update `loadQuestion` and `pickCategoryQuestion` to delegate random generation and deduplication to `MCS.questionPicker`.
* **`prep-practice.js`, `year1-practice.js`, `year2-practice.js`, `year5-practice.js`, `year6-practice.js` [MODIFY]**
  - Integrate `MCS.questionPicker.pick()` into their generator loops to avoid consecutive and session repeats.

### Slice 2: Parametric Expansion (P1 & P2 Gap Generators)
* **`year4-practice.js` [MODIFY]**
  - Refactor `grid-multiplication`, `multiply-by-10`, `divide-by-10` from fixed arrays to random ranges.
* **`year3-practice.js` [MODIFY]**
  - Refactor `mental-recall-grid`, `quantity-estimation`, `reasonableness-check`, `grid-array-multiplication` using appropriate `randomInt` boundaries.
* **`year6-practice.js` [MODIFY]**
  - Refactor `factor-tree-check` and `decimal-shift-multiply/divide` to use parametric bounds instead of 3-variant arrays.

### Slice 3: Deck-Based Selection for Static MCQs
* **`mcs-question-picker.js` [MODIFY]**
  - Introduce `MCS.questionPicker.shuffleDeck(context, variantsArray)` to track deck states per context.
* **`year6-practice.js` & `year3-practice.js` [MODIFY]**
  - Apply deck-based drawing for inherently conceptual MCQs (e.g., `equivalence-fraction-check`, `number-line-position`, unit selections).

## Socratic Review & Open Questions
1. **Module Inclusion**: Should `mcs-question-picker.js` be included in a shared HTML layout (if one exists), or should I manually append `<script src="mcs-question-picker.js"></script>` to every individual `*-practice.html` file?
2. **Audit Threshold**: What is an acceptable threshold for the Slice 0 audit? Is a pool length of 5 acceptable, or should we demand 10+ variations?
3. **Deck State**: For Slice 3, should the deck state be reset upon a hard page refresh, or should it be persisted in `localStorage` alongside `solvedContexts`?



## Verification Plan
1. **Slice 0**: Run `node scripts/g-question-variety-audit.mjs`. Verify that it accurately identifies known static/finite generators and fails the build.
2. **Slice 1**: Open `year4-practice.html`. Run a 20-question session in the Number strand. Ensure the UI/Console shows no duplicate fingerprints.
3. **Slice 2/3**: Run the audit script again and see the failing number of contexts drop as pools are expanded and deck-shuffling is applied.
