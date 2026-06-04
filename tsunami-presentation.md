# Plan: Tsunami Reading & Presentation (Lesson 25.2)

## Overview
This plan details the implementation of a new natural disaster sub-topic (Tsunamis) for English Unit 2 Lesson 25.2. It replaces the earthquakes focus with a tsunami-focused lesson, including a calibrated reading text, updated standard and differentiated worksheets, and an interactive slide presentation.

## Project Type
**WEB** (Educational content generation and interactive HTML slides)

## Success Criteria
- [ ] Calibrated tsunami reading text with F-K Grade Level between 4.8 and 5.8, and word count between 250 and 350 words.
- [ ] `Lesson_25.2_Plan.md` completed with all tsunami-related sections (Pedagogical Contemplation, Intention, Success Criteria, Sequence, Matrix, Differentiation).
- [ ] `Lesson_25.2_Worksheet.docx` successfully generated containing the tsunami reading, a comparison table, and the 9 assessment questions updated for tsunamis.
- [ ] `Lesson_25.2_Lucas_Handout.docx` generated for the support pathway containing the simplified tsunami text and website checklist.
- [ ] `Lesson_25.2_Presentation.html` compiled with interactive slides presenting the text sections alongside the questions, plus the Skimming Timer, Quiz Show, and Lucas Game.
- [ ] Verification scripts run successfully with zero errors.

## Tech Stack
- **Node.js**: Script automation for generating documents and compiling presentation.
- **`docx` (npm library)**: Building professional Microsoft Word documents programmatically.
- **HTML5 / CSS3 / ES6**: Standalone interactive slides styled to match school standards.
- **Python / `textstat`**: Readability calibration.

## File Structure
```text
Units/English/English_Unit_2/Lesson_Plans/
└── Lesson_25.2/
    ├── scripts/
    │   ├── build_lesson_25.2.js       # Node script for DOCX worksheets
    │   └── compile_presentation.js     # Node script for HTML slide deck
    ├── Tsunami_Reading/
    │   ├── Tsunamis_Y5.md              # Calibrated reading in Markdown
    │   ├── Tsunamis_Y5.docx            # Calibrated reading in Word
    │   ├── index.html                  # Magazine layout HTML
    │   └── index.css                   # Magazine layout CSS
    ├── Lesson_25.2_Plan.md             # Lesson plan document
    ├── Lesson_25.2_Worksheet.docx      # Student practice worksheet
    ├── Lesson_25.2_Lucas_Handout.docx  # Differentiated handout for Lucas
    └── Lesson_25.2_Presentation.html   # Compiled interactive presentation
```

## Task Breakdown

### Phase 1: Reading Text Creation & Calibration
*   **Task 1 (Readability)**: Write a draft of "The Rising Tide: Causes and Effects of Tsunamis" and run it through `create_leveled_text.py` to check Year 5 readability metrics. Iterate until calibrated.
    *   *Input*: Draft tsunami text.
    *   *Output*: Final calibrated text files in `Tsunami_Reading/` folder.
    *   *Verify*: F-K Grade in [4.8, 5.8] range.

### Phase 2: Create Lesson Plan
*   **Task 2 (Lesson Plan)**: Draft `Lesson_25.2_Plan.md` containing tsunami intentions, AC v9 mapping, and sequence.
    *   *Input*: Calibrated text and interactive designs.
    *   *Output*: `Lesson_25.2_Plan.md` in folder.
    *   *Verify*: Review sections against pattern checklist.

### Phase 3: Implement Build Scripts
*   **Task 3 (DOCX Builder Script)**: Update `build_lesson_25.2.js` to programmatically build the tsunami standard worksheet and Lucas handout.
    *   *Input*: Calibrated text and tsunami questions data.
    *   *Output*: `scripts/build_lesson_25.2.js` file.
    *   *Verify*: Run `node build_lesson_25.2.js` to generate the `.docx` files.
*   **Task 4 (Slides Compiler Script)**: Update `compile_presentation.js` to inject tsunami slides into the presentation template.
    *   *Input*: Standard slide template, tsunami HTML slides.
    *   *Output*: `scripts/compile_presentation.js` file.
    *   *Verify*: Run `node compile_presentation.js` to generate `Lesson_25.2_Presentation.html`.

### Phase 4: Run & Verify
*   **Task 5 (Execution & Checks)**: Execute both generation scripts to build the final output files. Run all checklists.
    *   *Input*: Scripts.
    *   *Output*: 4 generated lesson pack files.
    *   *Verify*: Check if files exist and display correctly.

---

## Phase X: Final Verification
- [ ] No purple/violet hex codes in scripts or CSS files.
- [ ] Socratic Gate was respected.
- [ ] Standard template layouts used.
- [ ] Run verification scripts:
    *   `python .agent/scripts/checklist.py .`
- [ ] Verify HTML slides in the browser.
- [ ] Verify DOCX files in Word.
