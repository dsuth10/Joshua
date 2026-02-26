# English Lesson Design Patterns

This document defines the visual and structural standards for English lesson materials.

## 1. Visual Identity (Brand Guidelines)

To maintain consistency and high engagement, all materials use a "Deep Navy and Vibrant Orange" theme.

| Element            | Hex Code  | Purpose                                    |
| :----------------- | :-------- | :----------------------------------------- |
| **Deep Navy**      | `#112d4e` | Backgrounds, heavy text, primary branding  |
| **Vibrant Orange** | `#f96d00` | Headings, highlights, interactive elements |
| **Off-White**      | `#f9f7f7` | Body backgrounds, secondary text           |
| **Soft Blue**      | `#3f72af` | Accents, boxes, emphasis                   |

## 2. Material Specifications

### A. Lesson Plan (Markdown)

- **File naming**: `Week_X_Lesson_Y_Plan.md`
- **Structure**:
  1. Learning Intention
  2. Success Criteria
  3. Introduction (Warm-up)
  4. Core Activities (3+ parts)
  5. Conclusion (Consolidation)
  6. Differentiation (Support/Extension)

### B. Student Handout (DOCX)

- **Library**: `docx-js`
- **Typography**: Arial or Inter (11pt/12pt body, 16pt+ headings)
- **Layout**:
  - Header with student name and date placeholders.
  - Clear sections (Part 1, Part 2, etc.) using shaded table headers.
  - Clean margins (2.54cm).

### C. Lesson Presentation (PPTX via HTML)

- **Workflow**: `html2pptx`
- **Slide Dimensions**: 720pt x 405pt (16:9)
- **Safety Margins**: Keep content 0.5" away from edges (especially bottom) to avoid import errors.
- **Micro-animations**: Use subtle transitions if possible (embedded in HTML/JS).

### D. Microsoft Forms Assessment (DOCX)

- **Formatting**:
  - `1. Question text`
  - `A. Option 1`
  - `B. Option 2`
  - `C. Option 3`
  - `D. Option 4`
  - `ANS: [Letter]` (Space and colon are critical).

## 3. High-Engagement Strategies

- **Aussie Context**: Incorporate Australian cultural references (slang, locations) when relevant to the curriculum.
- **Australian Standards (P0 Mandatory)**:
  - **Spelling**: Always use Australian spelling (e.g., 'colour', 'organise', 'centre').
  - **Measurements**: Always use the metric system (e.g., kilograms, Celsius, meters).
- **Graphic Organisers**: Prefer tables and boxes over long lists of text.
- **Socratic Questioning**: Include "Think about..." or "What if..." prompts in slides.
