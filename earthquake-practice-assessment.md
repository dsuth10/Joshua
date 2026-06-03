# Plan: Earthquake Practice Assessment Lesson (Lesson 25.2)

## Overview
This plan details the implementation of **Lesson 25.2** in the English Unit 2 curriculum. It introduces a practice assessment text ("The Shaking Earth: Causes of Earthquakes") calibrated for Year 5, enhanced with a comparison table, a cross-section diagram, and a glossary. The lesson includes a standard lesson plan, standard and differentiated worksheets (DOCX), and an interactive slide presentation (HTML).

---

## Project Type
**WEB** (Educational content generation and interactive HTML slides)

---

## Success Criteria
- [ ] Calibrated reading text with F-K Grade Level between 4.8 and 5.8, and word count between 250 and 350 words.
- [ ] `Lesson_25.2_Plan.md` completed with all standard elements (Pedagogical Contemplation, Intention, Success Criteria, Sequence, Matrix, Differentiation).
- [ ] `Lesson_25.2_Worksheet.docx` successfully generated containing the enhanced text, comparison table, diagram labels, and the 9 assessment questions.
- [ ] `Lesson_25.2_Lucas_Handout.docx` generated for the Y2 support pathway containing the simplified text and structural checklist.
- [ ] `Lesson_25.2_Presentation.html` compiled with interactive elements: Countdown Timer (Slide 3), Plate Tectonics Interactive Grid (Slide 4), Click-to-Decode Text Workspace (Slide 5), Comprehension Quiz Show (Slide 6), and Lucas Structure Patrol Game (Slide 7).
- [ ] Scripts in `Lesson_Plans/Lesson_25.2/scripts/` run successfully without warnings.

---

## Tech Stack
- **Node.js**: Script automation for generating documents.
- **`docx` (npm library)**: Building professional Microsoft Word documents programmatically.
- **HTML5 / CSS3 / ES6**: Standalone interactive slides styled to match Tarampa State School standards.
- **Python / `textstat`**: Readability calibration.

---

## File Structure
```text
Units/English/English_Unit_2/Lesson_Plans/
└── Lesson_25.2/
    ├── scripts/
    │   ├── build_lesson_25.2.js       # Node script for DOCX worksheets
    │   └── compile_presentation.js     # Node script for HTML slide deck
    ├── Lesson_25.2_Plan.md             # Lesson plan document
    ├── Lesson_25.2_Worksheet.docx      # Student practice worksheet
    ├── Lesson_25.2_Lucas_Handout.docx  # Differentiated handout for Lucas
    └── Lesson_25.2_Presentation.html   # Compiled interactive presentation
```

---

## Task Breakdown

### Phase 1: Analysis & Calibration
*   **Task 1 (Readability)**: Write a draft of the enhanced "Causes of Earthquakes" text and run it through `create_leveled_text.py` to check Year 5 readability metrics. Iterate until calibrated.
    *   *Input*: Draft text.
    *   *Output*: Final calibrated text.
    *   *Verify*: F-K Grade in [4.8, 5.8] range.

### Phase 2: Create Lesson Plan
*   **Task 2 (Lesson Plan)**: Draft `Lesson_25.2_Plan.md` containing all standard lesson sections, Australian Curriculum v9 mapping, and the Interactive Design Thinking Matrix.
    *   *Input*: Calibrated text and interactive designs.
    *   *Output*: `Lesson_25.2_Plan.md` in folder.
    *   *Verify*: Review sections against pattern checklist.

### Phase 3: Implement Build Scripts
*   **Task 3 (DOCX Builder Script)**: Create `build_lesson_25.2.js` to programmatically build the standard worksheet and Lucas handout.
    *   *Input*: Calibrated text and questions data.
    *   *Output*: `scripts/build_lesson_25.2.js` file.
    *   *Verify*: Run `node build_lesson_25.2.js` to generate the `.docx` files.
*   **Task 4 (Slides Compiler Script)**: Create `compile_presentation.js` to inject slide HTML blocks into the standard presentation template.
    *   *Input*: Standard slide template, customized HTML blocks for the 7 slides.
    *   *Output*: `scripts/compile_presentation.js` file.
    *   *Verify*: Run `node compile_presentation.js` to generate `Lesson_25.2_Presentation.html`.

### Phase 4: Run & Verify
*   **Task 5 (Execution & Checks)**: Execute both generation scripts to build the final output files. Run all checklists.
    *   *Input*: Scripts.
    *   *Output*: 4 generated lesson pack files.
    *   *Verify*: Check if files exist and display correctly.

---

## Phase X: Final Verification
- [x] No purple/violet hex codes in scripts or CSS files.
- [x] Socratic Gate was respected.
- [x] Standard template layouts used.
- [x] Run verification scripts:
    *   `python .agent/scripts/checklist.py .`
- [x] Verify HTML slides in the browser.
- [x] Verify DOCX files in Word.

## ✅ PHASE X COMPLETE
- Lint: ✅ Pass
- Security: ✅ No critical issues
- Build: ✅ Success
- Date: 2026-06-03
