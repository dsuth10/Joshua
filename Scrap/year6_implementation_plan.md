# Year 6 Maths Command Station - Comprehensive Implementation Plan

This document provides a detailed plan to build and integrate the Year 6 Mathematics sector into the Maths Command Station application. It aligns with the Australian Curriculum v9 (AC v9) standards, integrates with the persistent student profile, and adheres to the established corporate-minimalist design language.

---

## 1. Curriculum Mapping & Content Descriptors

The Year 6 expansion covers the following key mathematical areas in accordance with the AC v9 curriculum:

| Strand | Official Code | Curriculum Descriptor | Widget/Interactive Target |
|---|---|---|---|
| **Number** | `AC9M6N01` | Recognise situations, including financial contexts, that use integers; locate and represent integers on a number line and as coordinates on the Cartesian plane. | Interactive Integer Number Line (spanning -10 to +10) showing negative/positive balances and temperature shifts. |
| **Number** | `AC9M6N02` | Identify and describe the properties of prime, composite and square numbers and use these properties to solve problems. | Factor Sieve Grid where students select prime, composite, or square numbers from generated ranges. |
| **Number** | `AC9M6N03` | Compare, order and represent common fractions including halves, thirds and quarters on the same number line and justify their order. | Multi-Fraction Number Line requiring students to position halves, thirds, and quarters onto a single axis. |
| **Number** | `AC9M6N05` | Solve problems involving addition and subtraction of fractions using knowledge of equivalent fractions. | Fraction Sum/Difference Builder displaying equivalent fraction models (e.g., visual pies or fraction walls) to assist calculations. |
| **Number** | `AC9M6N07` | Solve problems that require finding a familiar fraction, decimal or percentage of a quantity, including percentage discounts. | Percentage Discount Visualiser (interactive shopping cart applying discounts like 15%, 25%, or 50% to item prices). |
| **Algebra** | `AC9M6A02` | Find unknown values in numerical equations involving brackets and combinations of arithmetic operations (BODMAS/order of operations). | Order of Operations Evaluator displaying bracketed equations with draggable operation order tokens. |
| **Algebra** | `AC9M6A03` | Create and use algorithms involving a sequence of steps and decisions that use rules to generate sets of numbers; identify and explain patterns. | Number Pattern Algorithm Engine showing input/output flowchart blocks (e.g., "Multiply by 2, then subtract 3"). |
| **Measurement** | `AC9M6M01` | Convert between common metric units of length, mass and capacity; choose and use decimal representations. | Metric Shift Regulator (sliding decimal conversion dial for converting mm ↔ cm ↔ m ↔ km, g ↔ kg, or mL ↔ L). |
| **Measurement** | `AC9M6M02` | Establish the formula for the area of a rectangle and use it to solve practical problems. | Dynamic Grid Area Solver letting students resize rectangular regions to establish and solve the $Area = Length \times Width$ formula. |
| **Measurement** | `AC9M6M03` | Interpret and use timetables and itineraries to plan activities and determine the duration of events. | Flight Itinerary Planner featuring interactive scheduling blocks and time-zone calculations. |
| **Measurement** | `AC9M6M04` | Identify the relationships between angles on a straight line, angles at a point and vertically opposite angles; determine unknown angles. | Angle Relations Solver presenting intersecting line diagrams where students determine vertically opposite or supplementary angles. |
| **Space** | `AC9M6SP02` | Locate points in the 4 quadrants of a Cartesian plane; describe changes to the coordinates when a point is moved. | 4-Quadrant Cartesian Plane Widget (ranging -5 to +5 on both axes) with interactive translations and coordinates display. |
| **Space** | `AC9M6SP03` | Recognise and use combinations of transformations to create tessellations and other geometric patterns. | Interactive Tessellation Grid where students translate, rotate, or reflect a primary tile to fill a repeating pattern. |
| **Statistics** | `AC9M6ST01` | Interpret and compare data sets using comparative displays; compare distributions in terms of mode, range and shape. | Distribution Matcher featuring comparative column/line displays with range and mode calculator overlays. |
| **Probability** | `AC9M6P01` | Recognise that probabilities lie on numerical scales of 0 to 1 or 0% to 100% and assign probabilities using fractions, decimals and percentages. | Probability 0-1 Dial Scale where students drag event cards along a scale of likelihood labelled with decimals, percentages, and fractions. |

---

## 2. Interactive Widget Specifications (Option A - Interactive SVG)

To deliver an engaging and visually premium experience, the Year 6 practice and assessment system will utilise the following custom SVG-based interactive components:

### A. 4-Quadrant Cartesian Grid Widget (`AC9M6SP02`)
* **Description**: Renders a standard Cartesian grid with four quadrants (axes running from -5 to +5). The origin (0,0) is highlighted at the centre.
* **Interaction**:
  - Students click grid intersections to plot coordinate pairs $(x, y)$ corresponding to questions.
  - Features translation vectors: Students are given an initial point and must drag an arrow to shift it (e.g., "Translate $P(2, -1)$ by vector $[-3, 4]$ to its new position $P'$").
* **Aesthetics**: High-contrast grid lines using `var(--outline-variant)`, axis labels in `var(--font-mono)` (JetBrains Mono), and animated, pulsing points when successfully positioned.

### B. Probability 0-1 Dial Scale (`AC9M6P01`)
* **Description**: A linear dial slider mapping the probability interval $[0, 1]$, featuring markings at $0$ (Impossible), $0.25$ ($1/4$, $25\%$), $0.5$ (Even Chance, $1/2$, $50\%$), $0.75$ ($3/4$, $75\%$), and $1$ (Certain).
* **Interaction**: Event description cards (e.g., "Rolling a sum of 13 using two standard six-sided dice" or "Flipping a coin and landing on heads") are presented. Students drag the card's needle indicator to its correct position on the scale.
* **Aesthetics**: Clean, linear layout with a gradient bar transitioning from deep neutral grey (Impossible) to bright Joshua Blue (Certain), with decimal/percentage overlays displayed in JetBrains Mono.

### C. Angle Relationship Modeller (`AC9M6M04`)
* **Description**: Displays geometric configurations of intersecting straight lines (vertically opposite angles) or adjacent angles meeting at a point or on a straight line.
* **Interaction**:
  - Displays numerical degrees on known sectors (e.g., $124^\circ$).
  - Students must determine the value of the adjacent or vertically opposite angle labelled $x$ and input their answer.
  - Hovering over a sector highlights the angle relationship path (e.g., colouring vertically opposite angles in matching pastel primary washes to visually demonstrate equivalence).
* **Aesthetics**: Sharp SVG stroke path rendering, styled with low-contrast borders and highlighted arc overlays using `var(--primary)` and `var(--tertiary)`.

### D. Metric Shift Regulator (`AC9M6M01`)
* **Description**: Displays a digit slider strip showing a numerical value (e.g., `4.25`) next to a metric unit selector (e.g., `km` to `m`, `kg` to `g`, or `L` to `mL`).
* **Interaction**: As students click buttons to convert units, an animation shows the decimal point shifting left or right, adding place-holding zeros as required, demonstrating the multiplication or division by powers of 10.
* **Aesthetics**: Large monospaced digit typography inside container chips, with a sliding red decimal dot indicator to anchor place value concepts.

---

## 3. Database & State Integration (Option A - Unified Profile)

The Year 6 practice console will connect to the central, unified student profile database stored under `joshua_math_profile` in `localStorage`:

1. **Category Key**: Performance scores and completed targets specific to Year 6 will accumulate under the `scoresByCatY6` property:
   ```javascript
   scoresByCatY6: {
       number: 0,
       algebra: 0,
       measurement: 0,
       space: 0,
       statistics: 0,
       probability: 0
   }
   ```
2. **Score Integration**: Solving practice questions awards $+10$ points for a correct response on the first attempt, and $+5$ points on the second attempt. This updates both the global cumulative `profile.score` and the corresponding `scoresByCatY6` strand category.
3. **Badge Unlocking Rules**: Points earned in Year 6 contribute to global badge milestones (e.g., the 'Precision Engineer' badge is unlocked when `scoresByCatY3.measurement + scoresByCatY4.measurement + scoresByCatY5.measurement + scoresByCatY6.measurement >= 100`).
4. **Rank Progression**: Ranks scale dynamically with total lifetime score, allowing students to transition from 'Novice Calibrator' up to the ultimate rank of 'Station Admiral' ($5000+$ PTS).

---

## 4. File Structure & Delivery Checklist

To execute this plan, the following files must be created or modified:

- [ ] **Create** `year6.html` (Assessment Terminal):
  - Model after [year5.html](file:///c:/Users/dsuth/Documents/Joshua/Maths_Command_Station/year5.html) to run a 4-phase assessment path (Initiation ➔ Fact Fluency ➔ Calibration ➔ 4-Quadrant Plotter ➔ Diagnostics).
- [ ] **Create** `year6.js` (Assessment Logic):
  - Model after [year5.js](file:///c:/Users/dsuth/Documents/Joshua/Maths_Command_Station/year5.js), coding the assessment questions, automated validation, and final score calculations.
- [ ] **Create** `year6-practice.html` (Practice Bay):
  - Model after [year5-practice.html](file:///c:/Users/dsuth/Documents/Joshua/Maths_Command_Station/year5-practice.html) with a left profile sidebar column and active practice canvas on the right.
- [ ] **Create** `year6-practice.js` (Practice Logic):
  - Model after [year5-practice.js](file:///c:/Users/dsuth/Documents/Joshua/Maths_Command_Station/year5-practice.js). Code the infinite question generators, SVG render templates, and local storage bindings for the Year 6 curriculum.
- [ ] **Modify** `index.html` (Grade Selector Portal):
  - Locate the Year 6 sector card:
    - Change status indicator from `SYS_OFFLINE` to `SYS_ONLINE`.
    - Remove `disabled` classes from buttons and link them to `year6-practice.html` and `year6.html`.
- [ ] **Modify** `style.css`:
  - Append specific styling for Year 6 widgets (e.g., Cartesian plane grid layout, 4-quadrant highlight areas, probability slider handles, and angle arcs).

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
