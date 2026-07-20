---
name: build-engaging-lessons
description: Audit, redesign, build, and quality-check engaging classroom lessons and their presentations, plans, handouts, and interactives. Use when Codex needs to improve a weak or plain lesson; create a lesson from unit materials; rebuild an HTML, PowerPoint, Word, or mixed lesson package; strengthen pedagogy, narrative flow, student participation, differentiation, visual quality, formative assessment, or teacher usability; or align generated lesson artifacts with their sources.
---

# Build Engaging Lessons

Create lessons that produce visible student thinking and a coherent learning experience. Treat engagement as a consequence of meaningful choices, relevance, rehearsal, feedback, and success—not decoration or clicking.

## Route the task

1. Identify the authoritative unit context, lesson folder, source text, curriculum codes, generator, and deliverable formats.
2. Preserve the current format unless the user requests a change.
3. Use the applicable artifact skill: browser control for HTML QA, presentations for `.pptx`, documents for `.docx`, PDF for `.pdf`, and imagegen for custom raster visuals.
4. When a generator creates the presentation, edit it first and regenerate. Never leave the compiled artifact ahead of its source.

## Inspect before designing

Read the complete lesson and enough surrounding context to understand its role:

- unit overview or sequence;
- named source text or extracts;
- presentation and generator;
- plan, handout, assessment, and differentiation notes;
- one or two strong neighbouring lessons when they establish local conventions.

Do not invent curriculum codes, page references, quotations, statistics, source authority, or novel details. Preserve verified content and flag unavailable sources.

## Diagnose

Read [references/design-standards.md](references/design-standards.md). Assess:

1. **Learning:** Is the cognitive goal precise and assessable?
2. **Arc:** Does each phase create a reason for the next?
3. **Thinking:** Must students decide, explain, transfer, or revise?
4. **Modelling:** Can students see and hear what quality looks like?
5. **Inclusion:** Do support, ICP, and extension preserve the core learning?
6. **Presentation:** Is it legible, purposeful, reliable, and teacher-friendly?

State the central diagnosis plainly. For a change request, continue into the rebuild unless a missing choice would materially alter the result.

## Design the lesson spine

Adapt this sequence rather than copying it mechanically:

1. **Compelling entry:** curiosity, tension, surprise, or a meaningful choice.
2. **Student-facing purpose:** what students will do and why it matters.
3. **Concrete encounter:** text, phenomenon, image, demonstration, problem, or context.
4. **Guided noticing:** retrieve, classify, compare, predict, or justify.
5. **Explicit model:** expose expert decisions and misconceptions.
6. **Independent construction:** create a product that uses the learning.
7. **Rehearsal and feedback:** test, revise, or improve the product.
8. **Exit evidence:** collect a small artifact that diagnoses readiness.

Every major activity must supply content, criteria, modelling, practice, or feedback for a later decision or product.

## Choose interactions by cognitive action

Read [references/interaction-patterns.md](references/interaction-patterns.md) before selecting activities. For each interaction, define:

- the decision students make;
- the evidence or rule they use;
- the misconception it can reveal;
- what the teacher observes;
- how feedback supports another attempt or revision.

Avoid guess-until-green interactions and obvious label matching. Do not force one correct answer when judgement is contextual; publish criteria and require justification.

## Build the presentation

Use a visual concept connected to the lesson content.

- Open with a memorable student experience, not administration.
- Write visible copy for students; put teacher directions in notes or the plan.
- Use projected-size text, strong contrast, generous spacing, and short instructions.
- Prefer one visual idea per screen.
- Use reveal or motion only to control attention or sequence thinking.
- For standalone HTML, provide keyboard navigation, fullscreen, progress, hidden teacher notes, resets, feedback, and network-media fallbacks.
- Avoid generic dashboards, excessive badges, clip art, decorative emojis, and projected worksheet pages.

Read [references/html-presentations.md](references/html-presentations.md) for HTML implementation and QA.

## Align the lesson package

Reconcile the plan, presentation, handout, assessment, exit ticket, differentiation, ICP pathway, and generator after changing the learning sequence. Do not silently leave a related artifact that contradicts the rebuilt lesson. If it is out of scope, report the mismatch.

## Differentiate without changing the destination

- **Support:** chunk, reduce language load, add examples, stems, visuals, oral rehearsal, or fewer initial options.
- **ICP:** preserve dignity, agency, and the core concept; use accessible response modes and follow authoritative student adjustments.
- **Extend:** increase audience complexity, source evaluation, transfer, counterargument, precision, or revision—not volume alone.

## Verify

1. Regenerate from the authoritative source.
2. For HTML, run `node scripts/audit_lesson_html.js <presentation.html>`.
3. Inspect every screen at classroom projection size.
4. Exercise correct, incorrect, retry, reset, reveal, navigation, fullscreen, notes, timer, and saved-draft paths where present.
5. Check overflow, contrast, text size, media, local assets, IDs, encoding, console errors, and controls.
6. Confirm the exit evidence matches the success criteria and informs the next lesson.

Do not claim visual QA when rendering or browser access was unavailable. Report completed checks and the remaining manual check.

## Deliver

Lead with the improved outcome. Link the rebuilt lesson and aligned resources. Summarise the central pedagogical changes, checks completed, external sources or generated assets used, and any remaining teacher choice.
