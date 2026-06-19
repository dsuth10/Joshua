# Maths Command Station - Question Variety Tasks

> **Note**: Slice 0 (Audit Gate) is complete.

## Slice 1: Session Deduplication Infrastructure

### 1. Create Question Picker Module
- [x] Create `mcs-question-picker.js` in the `Maths_Command_Station` root directory.
- [x] Define the `MCS.questionPicker` namespace.
- [x] Implement `fingerprint(question)` to generate a stable string key (e.g., `context::prompt`).
- [x] Implement `pick(generateFn, sessionSeen, maxAttempts = 24)` to return a guaranteed unique question for the session.
- [x] Implement `pickFromPool(poolArray, sessionSeen, maxAttempts)` for array-based selections.

### 2. Inject Module into HTML
- [x] Update `prep-practice.html` to include `<script src="mcs-question-picker.js"></script>`.
- [x] Update `year1-practice.html` and `year2-practice.html`.
- [x] Update `year3-practice.html` and `year4-practice.html`.
- [x] Update `year5-practice.html` and `year6-practice.html`.

### 3. Refactor Year 3 & Year 4 Generators
- [x] In `year3-practice.js`: Define `sessionSeenQuestions: new Set()` in `state`. Update `pickCategoryQuestion` and/or `loadQuestion` to use `MCS.questionPicker`.
- [x] In `year4-practice.js`: Replace the custom `lastContext` retry loop with `MCS.questionPicker` across `pickCategoryQuestion` and `initSandboxQuestion`.

### 4. Refactor Remaining Generators
- [x] In `year5-practice.js`: Wrap the mega-generator selection inside `loadNextPracticeQuestion` with `MCS.questionPicker`.
- [x] In `year6-practice.js`: Replace the custom `lastPrompt` retry loop in `loadNextQuestion`.
- [x] In `prep-practice.js`, `year1-practice.js`, `year2-practice.js`: Apply `MCS.questionPicker.pickFromPool` in `loadQuestion`.

## Slice 2: Parametric Expansion

### 1. Year 4 Gap Generators
- [x] `year4-practice.js`: Rewrite `grid-multiplication` array to generate randomly using `randomInt` (e.g., 2-digit by 1-digit).
- [x] `year4-practice.js`: Rewrite `multiply-by-10` and `divide-by-10` to generate a random starting number and a random factor (10 or 100).

### 2. Year 3 Gap Generators
- [x] `year3-practice.js`: Rewrite `quantity-estimation` and `reasonableness-check` to use parameterized generation instead of 2-3 fixed variants.
- [x] `year3-practice.js`: Rewrite `mental-recall-grid` and `grid-array-multiplication` to expand parameter bounds (e.g., using `randomInt` up to 10×10 ranges where appropriate).

### 3. Year 6 Gap Generators
- [x] `year6-practice.js`: Rewrite `factor-tree-check` from 3 variants to random composite values.
- [x] `year6-practice.js`: Rewrite `decimal-shift-multiply/divide` from 3 variants to dynamically select base decimals and shift factors.

## Slice 3: Deck-Based Selection for Static MCQs

### 1. Implement Deck Manager
- [x] In `mcs-question-picker.js`: Implement `MCS.questionPicker.shuffleDeck(context, deckArray)`.
- [x] Introduce persistent storage: save and load the state of drawn cards for each context in `localStorage` (e.g., `joshua_math_deck_state`) to match `solvedContexts`.

### 2. Apply Deck Logic
- [x] `year6-practice.js`: Update static MCQs (`equivalence-fraction-check`, `number-line-position`, etc.) to use the deck drawer.
- [x] `year3-practice.js`: Update conceptual MCQs (e.g., unit selection, angle comparisons) to use the deck drawer.
