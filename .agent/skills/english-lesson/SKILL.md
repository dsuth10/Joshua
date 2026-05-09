---
name: english-lesson
description: Manages the creation of high-quality, high-engagement English lesson materials including lesson plans, handout (DOCX), presentations (PPTX), and Microsoft Forms assessments. Use this skill when a user wants to build a new instructional unit or individual lesson for English, especially those requiring a consistent visual and structural format.
---

# English Lesson Skill

This skill provides a structured workflow for generating a comprehensive set of instructional materials for English lessons.

## Core Materials

A complete "English Lesson Pack" consists of four primary components:

1.  **Lesson Plan (Markdown)**: The pedagogical foundation.
2.  **Student Handout (DOCX)**: Reusable worksheet for students.
3.  **Lesson Presentation (PPTX)**: Engaging visual aid for direct instruction.
4.  **Microsoft Forms Assessment (DOCX)**: Import-ready quiz for data collection.

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
  - Create **ONE separate HTML file per slide** based on the [slide_template.html](assets/slide_template.html) asset.
  - **CRITICAL**: Do NOT generate multiple slides in a single HTML file. The converter strictly requires a 1-to-1 mapping (one HTML file = one PPTX slide).
  - Use `html2pptx` to convert the HTML files to PPTX.
  - **Crucial**: Keep content 0.5" from edges to prevent import errors.
- **Assessment**: Follow the strict `ANS: [X]` format for Microsoft Forms import.

### 4. Verification

Execute the scripts and verify the output files exist and match the high-engagement standards.

## Reference Materials

- **[lesson_patterns.md](references/lesson_patterns.md)**: Visual identity and formatting rules.
- **[UNIT_STRUCTURE.md](references/UNIT_STRUCTURE.md)**: Standard unit architecture and file organization.
- **[create_lesson_resources.js](scripts/create_lesson_resources.js)**: Reusable Node.js boilerplate.
- **[slide_template.html](assets/slide_template.html)**: Interactive HTML slide boilerplate.

## Example Triggers

- "Create a lesson about metaphors for Year 8 students."
- "Build a lesson pack for Week 3 Lesson 2 of our English unit."
- "I need a handout and a PowerPoint for a lesson on character development."
