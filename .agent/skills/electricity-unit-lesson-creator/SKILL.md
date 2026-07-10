---
name: electricity-unit-lesson-creator
description: Build, update, audit and verify lesson materials for the approved Year 6 Energy and Electricity integrated unit. Use when creating any of its 20 lessons or its TP, WS, VC, VA, JN, TC, SG, TA or AS resources; producing interactive HTML teacher presentations; creating OneNote-ready journal pages; building Tinkercad and physical-circuit task materials; extending Open Power Quest; or checking unit resource completeness, accessibility, scientific accuracy, safety and assessment alignment. Preserve the integrated unit plan, lesson sequence, resource IDs, practical progression and assessment intent unless the user explicitly approves a plan change.
---

# Electricity Unit Lesson Creator

This skill orchestrates the creation of resources for the **Year 6 Energy and Electricity Integrated Unit**. It follows a strict 8-role orchestration workflow to ensure all instruction, journal, and practical task materials are aligned and consistent.

## Progressive Disclosure Rules
Before building, load ONLY the required references from the `references/` directory depending on the user's request:
- **Any lesson request**: Load `lesson-contracts.yaml`, `resource-output-contracts.md`, and the canonical unit plan.
- **Teacher presentation**: Load `presentation-and-interactions.md`.
- **Journal or print resource**: Load `journal-and-accessibility.md`.
- **Tinkercad/physical task**: Load `tinkercad-and-practical-progression.md` and `safety-and-risk-controls.md`.
- **Coal/solar/hydro/nuclear content**: Load `science-content-and-misconceptions.md`.
- **Website work**: Load `website-module-contracts.md`.
- **Monitoring or supervised assessment**: Load `assessment-and-security.md`.

## 8-Role Orchestration Workflow
When triggered, act as the orchestrator to resolve scope, then pass through the following logical roles:

1. **Scope Resolver**: Interpret the requested week/lesson/resource ID. Load the integrated plan and manifest (`references/lesson-contracts.yaml`). Identify dependencies. State any missing source/media dependencies before proceeding.
2. **Curriculum and Pedagogy Architect**: Produce the machine and human-readable lesson contract (including Pedagogical Contemplation and Interaction Matrix). Ensure alignment across instruction, journal, and practical work.
3. **Science and Evidence Reviewer**: Verify circuit explanations, energy transformations, source comparisons, safety bounds, and misconceptions.
4. **Presentation and Interaction Builder**: Compile the interactive HTML teacher deck using the standard wrapper.
5. **Website Module Builder**: Create/update interactive content in Circuit Lab, Open Power Quest, etc., without duplicating teacher presentation work.
6. **Journal and Print Builder**: Produce OneNote-ready and printable journal pages (DOCX and Markdown) with accessible evidence fields.
7. **Practical Resource Builder**: Produce Tinkercad/physical task cards, guides, and troubleshooting media support.
8. **Verifier**: Run deterministic completeness, interaction, safety, access, and QA checks before marking the lesson pack complete.

## Strict Rules
- **OUTPUT DIRECTORY**: All lesson output files and resources must be generated strictly inside the `Units/Science/Unit 3 Electricity` folder (e.g., `Units/Science/Unit 3 Electricity/Lesson_Plans` and `Units/Science/Unit 3 Electricity/Unit_Resources`). Do not generate them in the workspace root.
- **DO NOT** create a PowerPoint (`.pptx`) or Microsoft Forms quiz unless explicitly requested.
- **DO NOT** change the 20-lesson sequence, learning intentions, success criteria, or assessment bounds without explicit user approval (Variation Record).
- **DO** use Australian English.
- **DO** include a dedicated Check for Understanding (CFU) at each major transition.
- **DO** enforce two-tier feedback for all interactive components.

Refer to the scripts in the `scripts/` folder for executing builds and generating output files.
