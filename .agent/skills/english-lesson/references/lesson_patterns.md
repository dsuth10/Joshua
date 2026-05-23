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

- **File naming**: `Lesson_X.Y_Plan.md` (stored within `Lesson_Plans/Lesson_X.Y/`)
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

### C. Interactive HTML Presentation (Default)

- **Layout**: Compiled as a single standalone HTML file (`Lesson_X.Y_Presentation.html`) containing the entire slide array injected into the `presentation_template.html` wrapper.
- **Interactive Control Overlay**: Features a sliding whiteboard canvas, drawing canvas overlays per slide, dynamic notes drawer, and responsive image lightboxes.
- **Strict Coding Isolation Standards (P0 Mandatory for Simulator/Interactives)**:
  - **IIFE Scope Encapsulation**: Any inline JavaScript on slides (e.g., custom animations, games, simulations) MUST be fully wrapped in an **Immediately Invoked Function Expression (IIFE)** to prevent global variable collision in the master presentation file:
    ```javascript
    (function() {
      // Localised variables go here
      const canvas = document.getElementById('slideXCanvas');
      ...
    })();
    ```
  - **Unique DOM IDs**: Ensure every interactive component uses distinct DOM element IDs. Do not reuse IDs like `canvas` or `btnSubmit` across different slides.
  - **Pointer-Event Layering**: Slides sit underneath a master annotation overlay canvas. By default, ensure drawing canvases have `pointer-events: none` in Cursor Mode, allowing seamless clicks on interactive buttons, input fields, and drop-down selects. Pen/Highlighter modes toggle `pointer-events: auto` to allow drawing annotation over interactive results.
  - **Dual-Pathway Scope Separation**: Standard (`.standard-only`) and Lucas support (`.lucas-only`) pathways should run completely distinct canvas selectors and isolated IIFE loops, letting CSS handle layout visibility toggles cleanly.
  - **Physics Engine Standards**: To maintain offline standalone performance, physics-based simulations should use direct Euler integration loops (forces $\rightarrow$ velocity $\rightarrow$ position delta-time slicing) rendered directly on HTML5 Canvas without loading heavy external libraries.

### D. Static PowerPoint Fallback (Optional)

- **Workflow**: `html2pptx`
- **Slide Dimensions**: 720pt x 405pt (16:9)
- **Safety Margins**: Keep content 0.5" away from edges (especially bottom) to prevent layout shifting.
- **Conversion Limits**: Interactive widgets, whiteboard, drawing tools, and animations DO NOT translate to PPTX. Slides must be simple, static layouts.

### E. Microsoft Forms Assessment (DOCX)

- **Formatting**:
  - `1. Question text`
  - `A. Option 1`
  - `B. Option 2`
  - `C. Option 3`
  - `D. Option 4`
  - `ANS: Letter` (Space and colon are critical).

## 3. High-Engagement Strategies

- **Aussie Context**: Incorporate Australian cultural references (slang, locations) when relevant to the curriculum.
- **Australian Standards (P0 Mandatory)**:
  - **Spelling**: Always use Australian spelling (e.g., 'colour', 'organise', 'centre').
  - **Measurements**: Always use the metric system (e.g., kilograms, Celsius, meters).
- **Graphic Organisers**: Prefer tables and boxes over long lists of text.
- **Socratic Questioning**: Include "Think about..." or "What if..." prompts in slides.
