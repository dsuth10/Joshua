# Maths Command Station - Question Variety Specifications

## Executive Summary
The Maths Command Station practice modules (Prep through Year 6) currently suffer from a high rate of question repetition within individual practice sessions. This occurs because question generation lacks session-level memory and deduplication. Furthermore, many "legacy-keep" gap generators contain small, finite question pools (e.g., 2-4 variants) or are entirely static, meaning uniform random selection inevitably draws duplicate instances.

This project aims to implement a systematic "session fingerprinting" and question picking architecture (`mcs-question-picker.js`) that guarantees unique concrete questions during a session, expands the parametric space of critical gap generators, and ensures practice variety aligns with product expectations. Following the established slice-by-slice program, this begins with a measurable audit gate (Slice 0) before expanding generation pools and deduplication logic.

## User Stories
* **As a student**, I want to receive a variety of questions during a practice session so that I am actually practicing concepts rather than just memorizing answers to the exact same numbers.
* **As a student**, I want the system to avoid giving me the exact same problem twice in a single session, even if it tests the same underlying curriculum context.
* **As a teacher/admin**, I want assurance that the platform offers sufficient depth and variability to legitimately support continuous practice without "bottoming out" the content pool too quickly.
* **As a developer**, I need a central, reliable pattern for tracking which question variants have already been served in the current session so I don't have to write custom retry logic for every question generator.

## Functional Requirements
1. **Measurable Audit (Slice 0)**:
   - Provide an audit script (`scripts/g-question-variety-audit.mjs`) that fails if generators lack sufficient randomness or if finite pools are too small (e.g., length < 5).
2. **Session Deduplication (Slice 1)**:
   - Implement `mcs-question-picker.js` module.
   - Generate stable "fingerprints" for questions (e.g., `context::prompt` or `context::instanceKey`).
   - Track `sessionSeenQuestions` (Set of fingerprints) in the active session state.
   - Refactor generator load paths across practice files to use `MCS.questionPicker.pick()` or `.pickFromPool()` to avoid repeats, with a max-retry limit to prevent infinite loops.
3. **Parametric Expansion (Slice 2)**:
   - Expand P1 and P2 gap generators with tiny fixed pools into parametric ranges using curriculum-appropriate bounds (e.g., `grid-multiplication`, `multiply-by-10`, `quantity-estimation`).
4. **Deck-Based Selection for Static MCQs (Slice 3)**:
   - Implement a "shuffled deck" drawing system for legitimately fixed conceptual questions (e.g., unit selection) to ensure full cycles before any repetition.

## Technical Constraints (Aligned with the Constitution)
* **Slice-by-slice implementation**: Follow the standard slice-by-slice method. Check-ins are required after each slice (e.g., pass the audit gate first before doing widget updates).
* **Legacy-keep canonical package pattern**: Preserve the `legacy-keep` tag and `makeLegacyNumeric` / `makeLegacyChoice` structures, upgrading them parametrically without diverging from the canonical package schema (`descriptor`, `context`, `evaluate`).
* **Widget reuse rule (R-03)**: Do not fork implementations. Extend config/modes for parametric variations instead of duplicating.
* **Backward Compatibility**: The deduplication logic must not interfere with the existing `localStorage` badge tracking mechanism (`solvedContexts`). Tracking specific instances (`sessionSeenQuestions`) is strictly for the current UI session unless explicitly persisted as `profile.seenInstances` in later phases.
* **No Inline SVG helpers**: Adhere to the Phase 3 definition of done (no `make*Svg` sweep).
