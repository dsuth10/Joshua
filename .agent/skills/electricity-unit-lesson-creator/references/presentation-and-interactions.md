# Interactive HTML Presentation Standard

The HTML deck is the teacher's live control surface, designed for explanation, class discussion, mini-whiteboard responses, and whole-class feedback. It is **not** a student web worksheet.

## 1. Expected Slide Pattern

| Slide function | Typical content |
| --- | --- |
| **Launch** | Lesson question, striking phenomenon or retrieval prompt. |
| **Connect** | Prior-learning diagram or three-question retrieval. |
| **Teach chunk 1** | Concise explanation, visual model and vocabulary. |
| **CFU 1** | All-student response before answer reveal (mini-whiteboards). |
| **Teach chunk 2** | Worked example, non-example or demonstration. |
| **Interactive reasoning** | Sort, sequence, trace, diagnose, compare or predict. |
| **CFU 2** | Hinge question determining readiness for independent/practical work. |
| **Website/video bridge** | Exact purpose, focus question, link/launch and follow-up response. |
| **Practical briefing** | Purpose, components, constraints, safety and success tests. |
| **Journal evidence** | What must be captured and explained. |
| **Exit** | Independent response aligned with the success criteria. |

## 2. Required Wrapper Capabilities
The unit-specific wrapper should inherit the generic wrapper (drawing tools, teacher notes, whiteboard overlay, image lightbox) and add:
- Persistent lesson/resource identifier metadata.
- Visible CFU badge and mini-whiteboard cue.
- **Reset interaction** control.
- **Student website** launch control (when a WS module is required).
- Optional **Open journal prompt** link/QR.
- Touch-friendly sizing and reduced-motion support.
- Print-to-PDF emergency mode.

## 3. Two-Tier Feedback
- **First incorrect attempt**: Local visual response (e.g. shake, outline) without giving the answer.
- **Second incorrect attempt**: Reveal a targeted scientific hint (Tier 2).
- **Teacher override**: The `show-answer` action locks the correct state and exposes the explanation in the notes drawer.

## 4. Science-Specific Interaction Library

| Mode | Cognitive purpose | Validation behaviour |
| --- | --- | --- |
| **Source-Form Sorter** | Distinguish energy source from form. | Checks category and explains distractors. |
| **Circuit Path Tracer** | Analyse continuous closed path. | Requires a continuous valid route through correct terminals. |
| **Circuit State Toggle** | Predict effect of opening/closing switches. | State logic, reset, and keyboard operation tested. |
| **Component-Symbol Matcher** | Connect physical components to symbols. | Accepts correct mappings, exposes misconceptions. |
| **Energy Chain Builder** | Sequence source, forms, grid, device. | Tests both stage order and energy-form labels. |
| **Fault Finder** | Diagnose rather than randomly rebuild. | Rewards evidence-led tests; rejects unsupported guesses. |
| **Fair-Test Planner** | Identify variables for conductivity test. | Ensures variables match the investigation. |
| **Diagram Translator** | Connect layout to conventional diagram. | Validates connections rather than physical scale. |
| **Evidence Comparator** | Compare coal, solar, hydro, nuclear. | Filterable data table ensuring consistent criteria. |
| **Scenario Decision Board** | Design town energy mix. | Tests constraints and trade-offs (no single fixed answer). |
| **Input-Control-Output Mapper** | Represent switch/sensor, control, response. | Checks relationship logic. |
| **Risk-Control Matcher** | Link hazard to harm and control. | Rejects responses encouraging students to investigate mains. |

An interaction must be selected for its **cognitive action**, not just for engagement. Ensure each interaction has a documented reason in the lesson plan.
