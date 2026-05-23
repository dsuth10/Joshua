---
name: english-lesson
description: Manages the creation of high-quality, high-engagement English lesson materials including lesson plans, handout (DOCX), interactive presentation (HTML), optional PowerPoint presentation (PPTX), and Microsoft Forms assessments. Use this skill when a user wants to build a new instructional unit or individual lesson for English, especially those requiring a consistent visual and structural format.
---

# English Lesson Skill

This skill provides a structured workflow for generating a comprehensive set of instructional materials for English lessons.

## Core Materials

A complete "English Lesson Pack" consists of four primary components:

1.  **Lesson Plan (Markdown)**: The pedagogical foundation.
2.  **Student Handout (DOCX)**: Reusable worksheet for students.
3.  **Lesson Presentation (HTML)**: A standalone, standardised interactive presentation (`Lesson_X.Y_Presentation.html`) featuring an embedded classroom whiteboard, drawing pen, highlighter, dynamic teacher notes panel, and image lightbox.
4.  **Lesson Presentation (PPTX - Optional)**: A static PowerPoint presentation (`Lesson_X.Y_Presentation.pptx`) created ONLY if explicitly requested, containing the same content layers without interactive tools.
5.  **Microsoft Forms Assessment (DOCX)**: Import-ready quiz for data collection.

## Workflow

Follow these steps to generate a lesson:

### 1. Planning & Analysis

Identify the learning intention and core activities. 

- **Resource Discovery (MANDATORY)**: Check the `Resources/` folder for a `Manifest.md` or `Inventory.md`.
    - If no manifest exists, run `ls -R Resources/` to see available files.
    - If the `Resources/` folder or manifest is missing, suggest their creation following the [UNIT_STRUCTURE.md](references/UNIT_STRUCTURE.md) standard.
    - Summarize available assets for the user (e.g., "Found 5 PDFs, 2 Websites").
    - Attempt to match discovered resources to the specific lesson activities.
- **Reference Check**: Consult the [lesson_patterns.md](references/lesson_patterns.md) reference for visual and structural standards.

### 2. Lesson Plan Generation

Draft the lesson plan in Markdown following the structure in the patterns guide. Ensure it includes differentiation for support and extension.

### 3. Resource Generation (Scripts)

Use the [create_lesson_resources.js](scripts/create_lesson_resources.js) template as a foundation for your Node.js scripts.

- **Handout**: Use the `docx-js` library logic to build tables and sections.
- **Presentation**:
  - **Interactive HTML Slide Deck (Default)**: Generate a single unified `Lesson_X.Y_Presentation.html` file by injecting slide content arrays into the [presentation_template.html](assets/presentation_template.html) wrapper. Ensure teacher notes are embedded in `<div class="teacher-notes">` inside each slide, and all images are styled to support the lightbox.
  - **Static PowerPoint Fallback (Optional)**: If the user explicitly requests a PowerPoint, ALSO generate individual static HTML slides under a `Lesson_X.Y_Slides/` folder based on the [slide_template.html](assets/slide_template.html) asset (one file = one slide), and convert them to a static `.pptx` file using `html2pptx`. Do not attempt to add interactive tools (whiteboard, pens, sidebar) to the static PowerPoint.
  - **Crucial**: Keep content 0.5" from edges to prevent import errors.
- **Assessment**: Follow the strict `ANS: X` format for Microsoft Forms import.

### 4. Verification

Execute the scripts and verify the output files exist and match the high-engagement standards.

## Reference Materials

- **[lesson_patterns.md](references/lesson_patterns.md)**: Visual identity and formatting rules.
- **[UNIT_STRUCTURE.md](references/UNIT_STRUCTURE.md)**: Standard unit architecture and file organization.
- **[create_lesson_resources.js](scripts/create_lesson_resources.js)**: Reusable Node.js boilerplate supporting both HTML slides compile and optional PPTX output.
- **[presentation_template.html](assets/presentation_template.html)**: Interactive standardised HTML presentation wrapper template (contains whiteboard, drawing overlay, notes sidebar, and lightbox).
- **[slide_template.html](assets/slide_template.html)**: Legacy/Static single HTML slide boilerplate for optional PPTX conversion.

## Mandatory File Structure (Per Lesson)

To maintain organization, every lesson MUST have its own dedicated folder within `Lesson_Plans/`. 

Example for **Week 3, Lesson 2**:
```text
Lesson_Plans/
└── Lesson_3.2/
    ├── scripts/
    │   └── build_lesson_3.2.js    # Node.js script to generate docs
    ├── Lesson_3.2_Plan.md         # The lesson plan
    ├── Lesson_3.2_Handout.docx    # The student handout
    ├── Lesson_3.2_Presentation.html # Standalone interactive classroom slides (Default)
    ├── Lesson_3.2_Presentation.pptx # PowerPoint presentation (Only if explicitly asked)
    └── Lesson_3.2_Slides/          # Individual slide HTML files for PPTX (Only if explicitly asked)
```

## Example Triggers

- "Create a lesson about metaphors for Year 8 students."
- "Build a lesson pack for Week 3 Lesson 2 of our English unit."
- "I need a handout and a PowerPoint for a lesson on character development."
