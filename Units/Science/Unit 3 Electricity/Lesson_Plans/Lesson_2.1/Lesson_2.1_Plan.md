# Lesson 2.1 Plan: Complete and incomplete circuits

## Lesson Contract
```yaml
lesson_id: "2.1"
week: 2
lesson: 1
title: "Complete and incomplete circuits"
lesson_question: "How does electricity move in a loop, and how do we find and fix breaks?"
learning_intention: "Analyse circuit connections and explain why a component does or does not operate."
success_criteria:
  - "Trace a closed conducting path from a battery, through components, and back."
  - "Locate a break or faulty connection in a circuit."
  - "Justify and verify a circuit repair."
resource_ids: ["TP03", "WS03", "VC03", "JN03", "TC03", "SG03", "TA03"]
prior_knowledge:
  - "Common circuit components and their basic functions (cells, wires, outputs like lamps, buzzers, motors)."
  - "Safe low-voltage contact handling routine (inspect, plan, connect, check, power)."
misconceptions:
  - "Electricity is a substance that is 'consumed' or 'used up' by the output device (e.g. bulb)."
  - "A single connection to a battery terminal is enough to make a component work."
  - "The physical layout and distance between components must match a circuit diagram exactly."
practical_mode:
  - "Tinkercad Circuits simulation"
  - "Physical low-voltage component building"
assessment_role: "formative / monitoring"
locked: true
```

## Pedagogical Contemplation
1. **Cognitive goal:** Students transition from building simple assemblies to debugging circuits logically. They learn that electricity requires a continuous, closed loop (conducting path) of metallic connections to flow, and that a single break stops all current.
2. **Interactive alignment:** The *Will It Work?* (WS03) interactive simulator directly lets students predict if a circuit operates, trace its continuous path to identify breaks, and click to repair connections with explanatory feedback.
3. **Visible thinking:** In the teacher deck, students annotate the break points of faulty circuits on the smartboard or sketch paths on mini-whiteboards, making their path tracing thinking visible immediately.
4. **Pedagogical vs engagement purpose:** Identifying circuit faults systematically is an engineering process. It moves students away from guess-and-test approaches to structured path analysis.
5. **Simulation/physical relationship:** Students predict and repair virtual faults in Tinkercad first, then apply these troubleshooting methods to physical setups (poor battery contacts, loose bulb holder terminals).
6. **Retained evidence:** Students record predictions, annotate breaks in the journal (JN03), and write explanations using a claim-evidence-reasoning (CER) structure.

## Interaction Matrix
| Learning moment | Cognitive demand | Teacher-deck mode | Student website mode | Journal evidence | Practical evidence | Misconception / Tier 2 hint |
| --- | --- | --- | --- | --- | --- | --- |
| **Path Tracing** | Trace closed loop from positive to negative terminal | Interactive path tracer (slides) | Complete path tracer interactive (WS03) | Annotated path line showing loop | Tinkercad simulation screenshot | *Hint: Place your finger on the positive (+) battery terminal and trace the wire. Can you get all the way back to the negative (-) terminal without crossing a gap?* |
| **Fault Diagnosis** | Identify why a component is not working | Spot-the-Fault CFU (Identify bad connections, open switches, or short circuits) | Progressive circuit analyzer (WS03) | Before/after fault annotation | Troubleshooting logs in Tinkercad | *Hint: Check every joint. Is there insulation (plastic) trapped under a clip? Is the switch open?* |
| **Circuit Repair** | Suggest and justify a mechanical fix | Reveal fix scenarios on slide | Click-to-repair fault simulator (WS03) | "The circuit did not work because... I changed... The evidence is..." | Working physical and virtual circuits | *Hint: Fix the single point that breaks the path. Do not rewire the entire circuit.* |

## Lesson Sequence

### 1. Launch (10 mins)
- **Hook:** Display two slides showing two circuits that look almost identical, but one has a tiny wire gap. 
- **Question:** *What makes one lamp light up while the other remains dark? If electricity isn't 'used up' by the bulb, how does it get back to the battery?*
- Introduce the Learning Intention and Success Criteria (Standard and Support pathways).

### 2. Teach: The Closed Conducting Path (10 mins)
- Explain the concept of a **closed conducting path** (loop) from the positive (+) to the negative (-) terminal.
- Dispel the misconception that electricity is "consumed". It transfers energy as it flows, but it must return to the source to keep flowing.
- Show video clip **VC03** explaining the loop concept.

### 3. CFU 1: Will It Light? (5 mins)
- Quick whiteboard check: Display three different layouts (e.g. wire connected to only one terminal of a battery, wire touching bulb glass instead of metal contact, complete loop).
- *Ask: Which of these three will light up? Draw the closed loop on your board for the working one.*

### 4. Teach: Spotting and Repairing Faults (15 mins)
- Model a systematic troubleshooting check-list:
  1. Inspect battery direction (+ and - aligned).
  2. Trace wire connections (metal touching metal).
  3. Check output terminals (leads connected to metal contacts, not plastic sleeves).
  4. Ensure switches are closed.
- **Worked Example (Teacher Think-Aloud):** Model diagnosing a faulty circuit on a smartboard. Point out the trapped insulation under a clip and how removing it completes the loop.

### 5. CFU 2: Trace and Spot (5 mins)
- Display a diagram of a circuit with a hidden break. Students circle the break on their mini-whiteboards and write a one-sentence repair plan.
- Prompt: *Explain why that break stops the current from reaching the bulb.*

### 6. Practical & Journal: Challenge 2 - Complete the Path (15 mins)
- Students open **TC03** and **JN03**.
- **Tinkercad Phase:** Students load/recreate the four fault challenge cases in Tinkercad. Test, repair, and screenshot.
- **Physical Phase:** Construct one working circuit and introduce a deliberate fault (like using a piece of paper as a gap or leaving a clip loose). Challenge a partner to diagnose and repair it.
- **Journal Phase:** Students complete the path tracer annotations, paste screenshot evidence, and write their CER explanations.

### 7. Exit & Reflection (5 mins)
- Reflection prompt: *Why does a tiny break in a wire stop a bulb from lighting, even if the battery is fully charged and all other wires are connected correctly?*
- Collect exit responses.
