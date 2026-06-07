# Plan - Natural Disaster Revision Lessons

## Overview
We are creating a three-part revision lesson series for Year 6 Science (Unit 2: Natural Disasters) using an interactive, scenario-based "Disaster Response Academy" theme. The lessons prepare students for their final assessment through parallel case studies.

## Project Type
WEB (Interactive HTML Slide presentations and document generators)

## Success Criteria
- Three complete lesson packs generated, each containing:
  - Detailed Markdown lesson plan with Socratic questioning and pedagogical contemplation.
  - Print-ready Student Handout (DOCX) featuring local styling, tables, and spacing.
  - Microsoft Forms import-ready quick quiz (DOCX) following the strict `ANS:` format.
  - Premium Interactive HTML presentation (HTML) containing responsive drawing tools, whiteboard, lightbox, and interactive widgets.
- Content aligns with Year 6 Australian Curriculum Science (v9) standards.
- Spelling is consistently Australian (e.g., *colour*, *organise*, *modelling*).
- Measurements use the metric system exclusively.

## Tech Stack
- HTML5, Vanilla CSS, and Vanilla JavaScript (for presentation slide deck widgets).
- Node.js (for automation scripts compiling templates and generating DOCX documents using `docx-js`).
- Python (for UX/UI, accessibility, and security validation audits).

## File Structure
```text
Units/Science/Unit 2 Natural disasters/Revision_Lessons/
├── Lesson_R1/
│   ├── scripts/
│   │   └── build_lesson_r1.js
│   ├── Lesson_R1_Plan.md
│   ├── Lesson_R1_Handout.docx
│   ├── Lesson_R1_Presentation.html
│   └── Lesson_R1_Assessment.docx
├── Lesson_R2/
│   ├── scripts/
│   │   └── build_lesson_r2.js
│   ├── Lesson_R2_Plan.md
│   ├── Lesson_R2_Handout.docx
│   ├── Lesson_R2_Presentation.html
│   └── Lesson_R2_Assessment.docx
└── Lesson_R3/
    ├── scripts/
    │   └── build_lesson_r3.js
    ├── Lesson_R3_Plan.md
    ├── Lesson_R3_Handout.docx
    ├── Lesson_R3_Presentation.html
    └── Lesson_R3_Assessment.docx
```

## Task Breakdown
- [x] **Task 1: Detailed Research & Case Study Selection**
  - Select mock names, wind speed data, maps, and structures for the parallel case studies.
  - *Verify*: Case study details listed and approved.
- [x] **Task 2: Build Lesson 1 (Cyclone Trackers)**
  - Implement R1 Plan, R1 Handout, R1 Quiz, and compiled Interactive presentation.
  - *Verify*: Files exist and `Lesson_R1_Presentation.html` runs in browser.
- [x] **Task 3: Build Lesson 2 (Seismic Engineers)**
  - Implement R2 Plan, R2 Handout, R2 Quiz, and compiled Interactive presentation.
  - *Verify*: Files exist and `Lesson_R2_Presentation.html` runs in browser.
- [x] **Task 4: Build Lesson 3 (Geologists)**
  - Implement R3 Plan, R3 Handout, R3 Quiz, and compiled Interactive presentation.
  - *Verify*: Files exist and `Lesson_R3_Presentation.html` runs in browser.
- [x] **Task 5: Automated Verification and Checklist Audit**
  - Run validation scripts for security, linting, and UX/UI accessibility audits.
  - *Verify*: All checklist scripts return success.

## Phase X: Final Verification
- [x] Run security scan: `python .agent/skills/vulnerability-scanner/scripts/security_scan.py .`
- [x] Run UX/accessibility audit: `python .agent/skills/frontend-design/scripts/ux_audit.py .`
- [x] Check no purple/violet hex codes are used in assets.
- [x] Verify Australian spelling and metric system compliance.

## ✅ PHASE X COMPLETE
- Lint: ✅ Pass
- Security: ✅ No critical issues
- Build: ✅ Success
- Date: 2026-06-07
