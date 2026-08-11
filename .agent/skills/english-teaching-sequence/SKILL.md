---
name: english-teaching-sequence
description: Generate a 10-week, 40-lesson English teaching sequence with a core text, assessment pathway, Australian Curriculum v9 content-descriptor evidence, and differentiation. Use after Unit Wayfinder has approved an English Unit_Brief, or when the user explicitly requests this exact sequence shape.
---

# English Teaching Sequence Generator

This skill is an English-specific adapter. It turns an approved Unit Wayfinder brief into a 10-week English sequence; it does not decide the broader unit destination, assessment purpose, or curriculum scope again.

## 📋 The Workflow

Follow these steps faithfully to ensure the sequence meets the project's premium and holistic education standards.

### Step 1: Load the Approved Unit Context
When `Unit_Plan/Unit_Brief.md` exists, load it first. Treat its destination, learner context, curriculum alignment, assessment map, differentiation decisions, resource constraints, and routing record as authoritative. Ask only for information the brief leaves unresolved:

1. **Core text**: What is the primary novel or text being studied?
2. **Reading allocation**: Which chapters, pages, or extracts are available for the sequence?
3. **Lesson-level constraints**: What changes the approved sequence in practice?
4. **Resource integrity**: Check the `Resources/` folder for a `Manifest.md` or `Inventory.md`.
    - Verify that all resources mentioned in the unit plan or sequence exist in the folder.
    - If no `Resources/` folder or manifest exists, suggest creating them according to the [Standard Unit Architecture](../lesson-creator/references/UNIT_STRUCTURE.md).

If no approved brief exists, use this skill only for an explicitly requested 10-week, 40-lesson English sequence. Gather the missing destination, learner, curriculum, assessment, and differentiation decisions before drafting; use Unit Wayfinder when the unit is broader or those decisions remain unclear.

### Step 2: Resolve Only Open Sequence Choices
Before writing the sequence, resolve only the choices not already decided in the Unit Brief:
- **Focus Balance**: Should the sequence be **Assessment-Led**, **Novel-Led**, or **Balanced**?
- **Differentiation Method**: Standard (Support/Core/Extend) or Targeted (e.g., Reluctant Readers + Specific ICP)?
- **Output Format**: Single Markdown file, Multi-file Markdown, or exported to Word (`.docx`)?

Do not reopen a settled decision merely because this skill would normally ask it.

### Step 3: Curriculum Mapping
Use the `curriculum-master` skill to verify only the content descriptors relevant to the approved outcomes.
- Run `python .agent/skills/curriculum-master/scripts/query_curriculum.py --learning_area english --year_level <YEAR> --format text`
- Preserve the Unit Brief's curriculum-alignment record and add the sequence-level evidence for each relevant descriptor. Do not claim achievement-standard coverage from the descriptor dataset.

### Step 4: Sequence Structure Design
Divide the 10 weeks (40 lessons) into 5 distinct two-week blocks (Sequences 1 through 5).
- **Sequences 1-3 (Weeks 1-6)**: Usually deeply focused on reading, exploring narrative themes, character arcs, settings, and language features.
- **Sequence 4 (Weeks 7-8)**: Climax of reading, transition to drafting the assessment task (e.g., narrative adaptation, exposition).
- **Sequence 5 (Weeks 9-10)**: Editing, publishing, presenting, and final assessment marking.

### Step 5: Content Generation (Markdown Table)
Draft the 40 lessons into a Markdown table. The table MUST include these exact columns:
| Week | Sequence | Lesson | Learning Intention | Teaching and Learning Sequence | Reading | Differentiation | Resources |

**Content Guidelines:**
- **Differentiation**: Be highly targeted. For instance, if 'Lucas' is an ICP student, detail exactly what he does (e.g., "Write 1 simple sentence", "Label a picture"). For 'Reluctant Readers', give strategies (e.g., "Audiobook Chapter 3", "Verbal check-in").
- **Reading**: Explicitly map which chapters or pages are read in which lesson.
- **Pacing**: Make sure to balance explicit teaching (grammar/sentence structure) with engagement activities.

### Step 6: Review and Formatting
1.  Ensure all 40 rows are complete.
2.  Ensure Australian spelling is used throughout (e.g., *colour*, *organisation*).
3.  Ensure metric measurements are used if numbers appear.
4.  If the user requested a Word document, use Pandoc to convert the generated `.md` file to `.docx` (e.g., `pandoc input.md -o output.docx`). Check `docx` skill for pandoc usage if needed.
5.  Keep the Unit Brief and decision trace authoritative; link the completed sequence from them rather than replacing them.

## 📝 Example Output Pattern
```markdown
| Week | Sequence | Lesson | Learning Intention | Teaching and Learning Sequence | Reading | Differentiation | Resources |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | **1** | **1** | [Specific ACv9 informed target] | **Introduction:** ... <br>**Explore:** ... <br>**Connect:** ... | Chapter 1 | **Reluctant Readers:** ... <br>**Lucas:** ... | Novel, Notebook |
```
