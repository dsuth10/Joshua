---
name: augmented-assessments
description: Use this skill to expand a single Australian Curriculum mathematics content descriptor into a robust family of student demonstration assessments (Symbolic, Visual/spatial, Diagnostic, Applied/contextual) within Maths Command Station. Trigger this when a user asks to implement a descriptor slice, expand a descriptor, or implement augmented assessments for a descriptor (e.g., AC9M5A02).
---

# Augmented Assessments Workflow

This skill describes a reusable agentic workflow for taking a single mathematics content descriptor and fully expanding it inside the Maths Command Station application as a family of student demonstration assessments.

## Required Repository Context

Before planning or coding, you must inspect the repository. Key files include:

- `Maths_Command_Station/year*-practice.js` (e.g., year5-practice.js)
- `Maths_Command_Station/achievements-config.js`
- `Maths_Command_Station/widgets/`
- `Maths_Command_Station/widgets/mcs-question-adapter.js`
- `Maths_Command_Station/Improvement_Infrastructure/03-Widget-Catalogue.md`
- `Maths_Command_Station/Improvement_Infrastructure/04-Year-Level-Matrix.md`
- `Maths_Command_Station/Improvement_Infrastructure/07-Roadmap-and-Migration.md`
- `Maths_Command_Station/Improvement_Infrastructure/year*-descriptor-variety-matrix.md`
- `Maths_Command_Station/scripts/g3-y*-context-audit.mjs`
- `Maths_Command_Station/scripts/g5-widget-inventory-audit.mjs`
- `Maths_Command_Station/scripts/g5-all-practice-widget-smoke.mjs`

Substitute `*` with the relevant year level.

## Non-Negotiable Project Rules

1. **Reuse-first widget policy:** Prefer extending existing widgets (adding a mode/config) over creating new widgets. Do not fork duplicate UI logic.
2. **Keep existing contexts stable:** Existing symbolic context strings are frozen. Do not rename them. They preserve localStorage progress and badge tracking.
3. **Do not add badge contexts before generator paths exist:** Add a new context to `achievements-config.js` *only* after it is actually emitted by a generator path, otherwise static audits will fail.
4. **Plan before implementation:** Produce a descriptor implementation plan (slice plan) for user review before writing code. See [references/descriptor_expansion_template.md](references/descriptor_expansion_template.md).
5. **Implement in slices:** Treat each descriptor expansion as an isolated slice so it is small enough to understand, review, test, and revert if needed.

## The 20-Phase Agentic Workflow

Follow these phases sequentially:

### Discovery & Planning
- **Phase 0 (Orient to the Task):** Identify the descriptor code, year level, and strand. Locate relevant practice generators and configs.
- **Phase 1 (Identify Content Descriptor):** Understand the curriculum meaning. Search the repo for curriculum references and the matching badge in `achievements-config.js`.
- **Phase 2 (Inspect Current Representation):** Document how it currently appears in the app, its weaknesses, and current contexts.
- **Phase 3 (Decompose Conceptually):** Identify the mathematical objects, student actions, misconceptions, and difference between procedural vs. conceptual success.
- **Phase 4 (Map to Demonstration Forms):** Design Symbolic, Visual/spatial, Diagnostic, and Applied/contextual variations.
- **Phase 5 (Inspect Widget Catalogue):** Find reusable widgets. Classify your needs as Reuse, Extend, or New (avoid New).
- **Phase 6 (Check Current Widget Implementation):** Review existing widget code before modifying. Fix any infrastructure bugs (e.g., class-token handling) first.
- **Phase 7 (Design Context Strings):** Create lowercase, hyphenated, mathematical context names. Ensure they match exactly everywhere.
- **Phase 8 (Produce Implementation Plan):** Write the slice plan and get user approval. Use [references/descriptor_expansion_template.md](references/descriptor_expansion_template.md).

### Implementation
- **Phase 9 (Implement Infrastructure Fixes):** Fix structural issues (e.g., `classList.add` bugs) before extending.
- **Phase 10 (Extend Required Widget):** Add the new mode. Ensure it returns the standard MCS widget API (`getValue`, `setValue`, `destroy`, `showSolution`, `flagCorrect`, `flagIncorrect`). See [references/example_ac9m5a02.md](references/example_ac9m5a02.md) for a complete example.
- **Phase 11 (Extend Supporting Widgets):** Add narrowly useful modes to support diagnostic or contextual tasks if needed.
- **Phase 12 (Refactor Practice Generator):** Update the generator branch to dispatch to sub-generators. **Preserve existing symbolic paths.**
- **Phase 13 (Design Sub-Generators):** Implement the Symbolic, Visual, Diagnostic, and Applied paths in the generator.
- **Phase 14 (Update Achievement Configuration):** Update `achievements-config.js` requirements to include the new context array.

### Validation & Documentation
- **Phase 15 (Update Audit Scripts):** Check if the static audit detects the contexts via regex. Only hardcode in the audit if generated dynamically.
- **Phase 16 (Update Planning Documentation):** Keep matrices aligned with implemented context names.
- **Phase 17 (Run Automated Validation):** Run context audit, widget inventory, and practice smoke tests.
- **Phase 18 (Manual QA):** Complete the checklist. See [references/validation_and_qa.md](references/validation_and_qa.md).
- **Phase 19 (Produce Check Report):** Write a final check report summarizing changes. See [references/validation_and_qa.md](references/validation_and_qa.md).
- **Phase 20 (Commit and Review):** Ensure commit message is descriptive (e.g., `feat(mcs): add AC9M5A02 balance-scale`).

## Agent Decision Tree

When given a descriptor code:

1. **Is the descriptor already in `achievements-config.js`?**
   - Yes: expand existing badge family.
   - No: add new badge only after confirming curriculum and generator plan.
2. **Is there an existing generator?**
   - Yes: preserve existing contexts and add branches.
   - No: create generator branch with at least one symbolic path first.
3. **Does an existing widget serve the concept?**
   - Yes: reuse.
   - Almost: extend with mode/config.
   - No: propose new widget, but justify strongly.
4. **Are new contexts planned?**
   - Keep in matrix until implementation. Add to `achievements-config.js` only after generator emits them.
5. **Are audits passing?**
   - Yes: proceed to manual QA.
   - No: fix before commit.
6. **Did the work change badge difficulty?**
   - Yes: explain in the final check report.
