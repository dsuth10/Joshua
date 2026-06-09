# Year 4 Maths Command Station - Comprehensive Implementation Plan

This document provides a detailed plan to build and integrate the Year 4 Mathematics sector into the Maths Command Station application. It aligns with the Australian Curriculum v9 (AC v9) standards, integrates with the persistent student profile, and adheres to the established corporate-minimalist design language.

---

## 1. Curriculum Mapping & Content Descriptors

The Year 4 expansion covers the following key mathematical areas in accordance with the AC v9 curriculum:

| Strand | Official Code | Curriculum Descriptor | Widget/Interactive Target |
|---|---|---|---|
| **Number** | `AC9M4N01` | Recognise and extend the application of place value to tenths and hundredths and use the conventions of decimal notation to name and represent decimals. | Decimal Digit Shifter showing interactive columns for Tens, Ones, Tenths, and Hundredths. |
| **Number** | `AC9M4N03` | Find equivalent representations of fractions using related denominators and make connections between fractions and decimal notation. | Fraction-Decimal Equivalence Register (converting fractions to equivalent forms, decimals, and percentages). |
| **Number** | `AC9M4N04` | Count by fractions including mixed numerals; locate and represent these fractions as numbers on number lines. | Interactive Fraction Number Line featuring mixed numerals (e.g., $1 \frac{1}{4}$, $2 \frac{1}{2}$). |
| **Algebra** | `AC9M4A01` | Find unknown values in numerical equations involving addition and subtraction, using the properties of numbers and operations. | Inverse Fact Family Grid to find the unknown variable in equations like $? + 152 = 480$. |
| **Algebra** | `AC9M4A02` | Recall and demonstrate proficiency with multiplication facts up to 10 x 10 and related division facts. | Dynamic recall facts engine generating facts up to $10 \times 10$ with an animated countdown timer. |
| **Measurement** | `AC9M4M03` | Solve problems involving the duration of time including situations involving "am" and "pm" and conversions between units of time. | Interactive time duration solver displaying analog and digital clocks side by side. |
| **Measurement** | `AC9M4M04` | Estimate and compare angles using angle names including acute, obtuse, straight angle, reflex and revolution, and recognise their relationship to a right angle. | SVG Protractor Angle Evaluator letting students classify and measure angles relative to $90^\circ$. |
| **Space** | `AC9M4SP02` | Create and interpret grid reference systems using grid references and directions to locate and describe positions and pathways. | Alphanumeric Grid Map (A-E, 1-5 grid) with landmark coordinate selectors and pathway routers. |
| **Space** | `AC9M4SP03` | Recognise line and rotational symmetry of shapes and create symmetrical patterns and pictures. | Symmetry Painting Board where students mirror a pattern across a central horizontal or vertical axis. |
| **Statistics** | `AC9M4ST01` | Represent data using many-to-one pictographs, column graphs and other displays or visualisations; interpret and discuss information. | Scaled Column Graph display prompting students to read values where each interval scale represents 2 or 5 units. |
| **Probability** | `AC9M4P01` | Describe possible everyday events and outcomes of chance experiments and order outcomes or events based on their likelihood of occurring. | Likelihood ordering scale allowing students to drag and drop chance outcomes along a linear probability spectrum. |

---

## 2. Interactive Widget Specifications (Option A - Interactive SVG)

To deliver an engaging and visually premium classroom experience, the Year 4 practice and assessment modules will utilise the following custom SVG-based interactive components:

### A. Mixed Numeral Number Line (`AC9M4N04`)
* **Description**: Renders a horizontal number line spanning from 0 to 3, with major ticks for integers and smaller sub-ticks dividing the line into halves, quarters, or thirds.
* **Interaction**: A draggable indicator handle or clickable tick marks allow students to place mixed numerals (e.g., $1 \frac{3}{4}$ or $2 \frac{1}{2}$) onto their exact spatial positions.
* **Aesthetics**: Clean, high-contrast axis markers, highlighted tick marks, and an animated glow effect on the draggable handle using `var(--primary)`.

### B. Grid Reference Pathfinder (`AC9M4SP02`)
* **Description**: An alphanumeric grid (columns A-E, rows 1-5) representing a simplified map or layout instead of a fully numerical Cartesian plane.
* **Interaction**:
  - Landmarks (e.g., School, Park, Library) are rendered as SVG icons at grid intersections.
  - Students must locate coordinates (e.g., "Where is the School located? [C3]") or trace routes (e.g., "Start at A1, move 2 squares East, then 3 squares North. What is your final grid sector?").
* **Aesthetics**: Subtle border grids, monospaced coordinate labels in JetBrains Mono, and dynamic highlight effects on selected cells.

### C. Symmetry Painting Board (`AC9M4SP03`)
* **Description**: A grid (e.g., $6 \times 6$) divided down the centre by a bright red vertical or horizontal mirror axis line.
* **Interaction**:
  - The left/top side of the board is pre-populated with a pattern of coloured blocks.
  - Students click on blank cells on the opposite side to reflect the pattern symmetrically across the axis.
  - Features real-time checking of symmetrical matching.
* **Aesthetics**: Micro-animations on cell selection, smooth hover transitions, and a pulsing indicator along the mirror axis line.

### D. Scaled Column Graphs (`AC9M4ST01`)
* **Description**: Displays a bar chart where the y-axis does not scale in ones, but in multiples (e.g., ticks at 0, 5, 10, 15, 20).
* **Interaction**:
  - Students interpret the height of columns to solve multi-step problems (e.g., "How many more points did Team A score than Team B?").
  - Hovering over individual bars draws a horizontal line to the y-axis to guide visual alignment.
* **Aesthetics**: Thin SVG gridlines styled with `#e2e8f0` and responsive bar hover animations.

---

## 3. Database & State Integration (Option A - Unified Profile)

The Year 4 practice console will connect to the central, unified student profile database stored under `joshua_math_profile` in `localStorage`:

1. **Category Key**: Performance scores and completed targets specific to Year 4 will accumulate under the `scoresByCatY4` property:
   ```javascript
   scoresByCatY4: {
       number: 0,
       algebra: 0,
       measurement: 0,
       space: 0,
       statistics: 0,
       probability: 0
   }
   ```
2. **Score Integration**: Successfully completed tasks award $+10$ points (first attempt) or $+5$ points (second attempt) directly to the global cumulative `profile.score` and the corresponding `scoresByCatY4` category.
3. **Badge Progression**: Points earned in Year 4 contribute directly to badge unlocks by summing corresponding categories across all grades (e.g., the 'Number Cruncher' badge is unlocked when `scoresByCatY3.number + scoresByCatY4.number + scoresByCatY5.number >= 100`).
4. **Rankings**: Lifetime scores from Year 4 boost the student's rank (e.g., unlocking 'Logic Architect' at $500$ PTS).

---

## 4. File Structure & Delivery Checklist

To execute this plan, the following files must be created or modified:

- [ ] **Create** `year4.html` (Assessment Terminal):
  - Model after [year5.html](file:///c:/Users/dsuth/Documents/Joshua/Maths_Command_Station/year5.html) to run a 4-phase assessment path (Initiation ➔ Fact Fluency ➔ Calibration ➔ Grid Pathfinder ➔ Diagnostics).
- [ ] **Create** `year4.js` (Assessment Logic):
  - Model after [year5.js](file:///c:/Users/dsuth/Documents/Joshua/Maths_Command_Station/year5.js), coding the assessment questions, automated validation, and final score calculations.
- [ ] **Create** `year4-practice.html` (Practice Bay):
  - Model after [year5-practice.html](file:///c:/Users/dsuth/Documents/Joshua/Maths_Command_Station/year5-practice.html) with a left profile sidebar column and active practice canvas on the right.
- [ ] **Create** `year4-practice.js` (Practice Logic):
  - Model after [year5-practice.js](file:///c:/Users/dsuth/Documents/Joshua/Maths_Command_Station/year5-practice.js). Code the infinite question generators, SVG render templates, and local storage bindings for the Year 4 curriculum.
- [ ] **Modify** `index.html` (Grade Selector Portal):
  - Locate the Year 4 sector card:
    - Change status indicator from `SYS_OFFLINE` to `SYS_ONLINE`.
    - Remove `disabled` classes from buttons and link them to `year4-practice.html` and `year4.html`.
- [ ] **Modify** `style.css`:
  - Append specific styling for Year 4 widgets (e.g., symmetry grids, alphanumeric reference layouts, scaled column charts, and line sliders).

---

## 5. Design & Aesthetic Guidelines

All new components must adhere strictly to the Maths Command Station brand identity outlined in [DESIGN.md](file:///c:/Users/dsuth/Documents/Joshua/Maths_Command_Station/DESIGN.md):

* **Typography**:
  - **Space Grotesk**: For all primary dashboard headers and section titles.
  - **Work Sans**: For body text, instructions, and informational paragraphs.
  - **JetBrains Mono**: For all coordinate pairs, equations, fractional symbols, and system metrics.
* **Palette Tokens**:
  - Primary (Joshua Blue): `#003ec7` (base), `#0052ff` (hover container).
  - Background Canvas: Base background `#f9f9fc` with card container fills `#ffffff`.
  - Borders: Low-contrast `#e2e8f0` with `1px solid` styles.
* **Corner Radius**:
  - Small elements (buttons, inputs) use `0.5rem` ($8\text{px}$).
  - Cards and large dashboard containers use `1rem` ($16\text{px}$).
  - Status badges and pill elements use `9999px` (fully rounded).
* **Vibe**: Maintain a high-performance, minimalist, scientific terminal environment. Avoid standard visual clichés or rounded illustrations. Keep interfaces clean, grid-aligned, and prioritising mathematical clarity.
