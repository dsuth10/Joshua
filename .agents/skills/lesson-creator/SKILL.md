---
name: lesson-creator
description: Build, recompile, align, and verify complete classroom lesson packages in the Joshua workspace, including Markdown plans, standalone interactive HTML presentations compiled through the bundled classroom wrapper, aligned DOCX handouts or organisers, optional PPTX or Microsoft Forms artifacts, and accessible red-green projected-language pathways. Use when Codex is asked to create an alternative lesson, produce or rebuild a lesson pack, compile project-standard lesson artifacts, add or repair the red-green language switch, or reconcile a lesson's plan, presentation, handouts, differentiation, and generator. Do not use for a pedagogical audit alone, a single file-format edit, or full-unit planning.
---

# Lesson Creator

Build a classroom-ready lesson package from an established unit destination or an already-designed lesson. Preserve the learning destination while making the plan, projected teaching, student resources and generators agree.

## Route the request

1. Use `build-engaging-lessons` for general diagnosis, lesson redesign and pedagogy.
2. Use this skill when the outcome includes a complete project lesson package, the standard HTML classroom wrapper or the red-green language pathway.
3. Use the relevant artifact skill for specialist `.docx`, `.pptx` or `.pdf` generation and visual QA.
4. Use Unit Wayfinder, when available, for full-unit design. Do not silently reopen settled unit decisions.

## Establish authority

Before editing:

1. Read `Unit_Plan/Unit_Brief.md` and the relevant sequence row when available; otherwise locate the strongest equivalent unit sequence or overview.
2. Read the target lesson completely, its generator and one or two strong neighbouring lessons that establish local conventions.
3. Inspect `Resources/Manifest.md` or `Resources/Inventory.md`; if neither exists, inspect the resource tree and report the gap.
4. Identify authoritative curriculum codes, source texts, assessment evidence, ICP adjustments and factual sources. Do not invent missing authority.
5. Edit generators before compiled artifacts. Never leave generated output ahead of its source.

If the unit brief is missing, use an equivalent authoritative sequence when one exists. Report sequence validation as unavailable only when no reliable unit-level sequence can be found.

## Define the package contract

Confirm which artifacts are in scope. A full package normally includes:

- lesson plan in Markdown;
- standalone interactive HTML presentation;
- student reading, handout or organiser in DOCX;
- teacher guide or answer guidance when needed;
- accessible or ICP pathway that preserves the core learning;
- optional PPTX only when requested;
- optional Microsoft Forms import document only when requested;
- generator source and locally owned assets.

Keep lesson-specific files inside the lesson folder. Record shared or referenced resources in the unit manifest.

## Build the lesson plan

Start with a concise `### Pedagogical Contemplation` covering:

1. cognitive goal;
2. why each interaction fits that cognitive action;
3. how student thinking becomes visible;
4. the pedagogical purpose versus the engagement treatment.

Include:

- learning intention and assessable success criteria;
- a coherent entry, encounter, guided noticing, explicit model, independent construction, feedback/revision and exit evidence;
- an interaction matrix with cognitive demand, mode, rationale, Tier 2 hint and placement;
- support, ICP and extension that preserve the same destination;
- timing, stopping point, answers, misconceptions and factual boundaries;
- a final student product whose evidence matches the success criteria.

## Compile the HTML presentation

Read [references/presentation-contract.md](references/presentation-contract.md) before changing or generating a presentation.

Mandatory rules:

1. Load [assets/presentation_template.html](assets/presentation_template.html).
2. Prefer [scripts/compile_presentation.py](scripts/compile_presentation.py), or perform its equivalent inside the lesson generator.
3. Replace only `<!-- SLIDES GO HERE DURING DYNAMIC COMPILATION -->` with lesson slides, then inject lesson-owned CSS and JavaScript.
4. Do not recreate navigation, drawing, highlighter, whiteboard, lightbox, slide dots or the teacher-notes drawer.
5. Put each slide's notes in `<div class="teacher-notes">`.
6. Keep projected copy student-facing. Put `DO`, `WORK`, `RECORD`, `FINISH` and `CHECK` logistics in notes.
7. Preserve keyboard navigation, fullscreen, progress, reset behaviour, media fallbacks and visible focus states.
8. Keep interactions touch-friendly and usable at classroom projection size.

## Add red-green language pathways

Read [references/red-green-pathways.md](references/red-green-pathways.md) whenever a lesson has two language or access routes.

Core contract:

- show only the unlabelled red-green switch supplied by the wrapper;
- red presents extended class language;
- green presents concise access language;
- never display `easy`, `hard`, `low`, `high`, year levels, diagnoses or student names;
- preserve the same concept, lesson sequence and dignity in both views;
- change visible language immediately on the active slide;
- preserve slide position, timer, reveals, answers, notes and drawing state;
- use an accessible non-visible label such as `Change language view`;
- treat the colour as a teacher-controlled language view, not an ability group.

Use paired `.standard-only` and `.concise-only` elements. Reduce language and output load in green; do not remove the reasoning destination.

## Design interactions

For each interaction, specify the decision, evidence or rule, misconception and observable teacher signal.

- Prefer mini-whiteboards before digital reveal when every student can answer briefly.
- Add a visible `.cfu-badge` at major concept transitions.
- First error: brief retry signal without giving the answer.
- Second error: reveal a specific `.hint-box`.
- Register a `show-answer` listener on every interactive slide so the Notes drawer can reveal the correct state.
- Preserve interaction state when changing language view.
- Avoid guess-until-green loops and decorative interactivity.

## Align student and teacher materials

Reconcile terminology, examples, evidence, timings and completion criteria across the plan, presentation, reading, handout, teacher guide, support route, assessment, exit ticket and generator.

Use Australian spelling and metric units. Keep fictional material and factual evidence boundaries explicit. Do not identify an individual student in projected materials or filenames unless the user explicitly requires an authoritative personalised adjustment.

## Verify before delivery

Run [scripts/validate_presentation.py](scripts/validate_presentation.py) against every compiled HTML presentation. When the workspace also provides `scripts/audit_lesson_html.js`, run both gates.

Then perform browser QA:

1. inspect every slide at 1280 x 720 in red and green;
2. check overflow, scrollbars, contrast, projected text size and focus visibility;
3. exercise navigation, notes, teacher answer, whiteboard, drawing, fullscreen, timer, reset, reveal and retry paths that exist;
4. confirm the active slide and live state survive a language switch;
5. inspect console errors and local asset failures;
6. render and visually inspect DOCX, PPTX and PDF artifacts through their relevant skills.

Do not claim visual QA if the artifact was not rendered or opened. Report remaining manual checks.

## Skill resources

- [assets/presentation_template.html](assets/presentation_template.html): required interactive classroom wrapper.
- [assets/slide_template.html](assets/slide_template.html): static slide base for an explicitly requested PPTX fallback.
- [references/presentation-contract.md](references/presentation-contract.md): wrapper, compiler and interaction requirements.
- [references/red-green-pathways.md](references/red-green-pathways.md): language-pair design and QA rules.
- [references/unit-structure.md](references/unit-structure.md): project lesson and resource placement.
- [scripts/compile_presentation.py](scripts/compile_presentation.py): deterministic wrapper compiler for lesson-owned slides, CSS and JavaScript.
- [scripts/validate_presentation.py](scripts/validate_presentation.py): deterministic compiled-deck quality gate.
