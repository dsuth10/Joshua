# Year 6 Science Unit 3: Electricity — Tinkercad assessment

## Status and use

This is a locally redesigned assessment, not an official replacement C2C instrument. Original assessment files are preserved in the parent folder. Open `Student_Assessment.html` in a browser and print at A4, 100%, with browser headers/footers off. The booklet has 11 planned pages; responses may instead be recorded in an accompanying digital document. Keep this guide and the diagram JSON files teacher-only: they contain answers.

The local original is named Year 6 Unit 2 and uses Australian Curriculum v8 criteria, although filed under Unit 3. This redesign preserves those assessed purposes; it does not claim a v9 remapping. Moderate the adapted standards through the school's usual process before use.

The supplied Arduino sketches have not been run in a signed-in Tinkercad session. Complete the preflight below before administering. No online circuits or student accounts have been created.

## What changes, and what stays

| Original evidence | Replacement evidence | Coverage / limitation |
|---|---|---|
| Steady Hand Game test-circuit drawing | Six symbolic circuit sketches plus labelled Arduino circuit | Complete paths, switches, missing components, series/parallel reasoning |
| Plan, test four physical components and locate a fault | Predict and simulate LED/button builds; investigate one concealed wiring fault | Systematic testing and evidence-based repair, but not physical handling or real material conductivity testing |
| Explain a repair allowing electricity transfer | Before/after evidence and explanation of restored path or correct pin connection | Preserves core Science reasoning |
| Generation and source choices for three locations | Island, desert and mining-town explanations plus comparative recommendation | Preserves generation, energy transformations and informed decisions |
| Multimodal scientific communication | Sketches, screenshots, observations, flow diagrams and explanations | Judge clarity/accuracy rather than visual polish |

Local anchors: `Sci_Y06_U2_AT_EnergElectricity.md`, `Sci_Y06_U2_AT_MR_EnergElectricity.md` and `Sci_Y06_U2_AT_TN_EnergElectricity.md` in the parent folder; `Lesson_Plans/Lesson_2.1/TC03_Task_Card.md` (fault-finding); `Lesson_Plans/Lesson_2.2/TC04_Task_Card.md` (switches); and the unit-root `year6_electricity_student_engineering_journal_and_tinkercad_challenges.md` (Challenges 6–9: blink, traffic lights, button alarm, sensor night light).

These are documented builds, not confirmation that every class has completed them. Use the core tasks only after equivalent practice. A sensor is not required. If a class has used a piezo alarm rather than an LED button output, teach the short LED transfer activity first, or moderate an equivalent familiar alarm version with matched evidence requirements.

## Administration

Suggested four supervised sessions: (1) diagrams and practical predictions, 40 minutes; (2) known-good output and input builds, 50 minutes; (3) concealed fault investigation, 40 minutes; (4) generation/source decisions, 60 minutes, using a supplied balanced source pack. Adjust time for access needs; do not assess speed. Allow additional scheduled response time if required by school arrangements.

Students work individually. Supply code, terminal-identification cards and help with Tinkercad navigation. Do not supply fault answers or scientific explanations during assessed work. Record substantive prompts. Allow oral explanations, scribing or enlarged diagrams with equivalent reasoning demands. For students unable to access visual diagrams, provide a neutral connection-by-connection description without naming the circuit's state. A technical outage warrants rescheduling or a teacher-operated simulation directed by the student, not a lower grade. Pre-recorded observations alone cannot demonstrate independent practical testing.

Use a teacher-approved classroom account workflow. Collect circuit links only through the school's normal system, or use screenshots with the student's identifier. Public sharing is unnecessary.

## Teacher preflight — required before use

- Confirm that external LED, resistor, GND, digital output and push-button input have been practised. Explain INPUT_PULLUP during teaching, not as a new concept in the assessment.
- In Tinkercad Circuits, create an Arduino Uno R3, LED and 330 Ω resistor. Use direct connections initially; a breadboard adds avoidable row/contact ambiguity. Use the component's terminal labels to identify anode and cathode, not screen orientation alone.
- Connect D8 → resistor → LED anode; cathode → GND. Load `01_blink.ino` in the text-code editor, accepting conversion only in a new assessment copy. Start simulation. Verify one second on / one second off for at least two cycles and no simulation warnings. The simulated USB supply powers the Uno; no separate battery is needed.
- Add a push-button between D2 and GND using a pair of contacts that is disconnected when released and connected when pressed. A four-leg button has internally connected pairs: confirm its terminal grouping in the simulator rather than assuming adjacent legs are the switched pair.
- Load `02_button_led.ino`. Verify released → LED off; held pressed → LED on; released again → LED off. No external pull-down resistor is used: the code enables the internal pull-up. This is a simple held-state task; switch debouncing is not assessed.
- Save a known-good master and make individual copies. Never introduce faults into the sole master. Test each faulty copy and its proposed repair before allocation.
- Trial printing the booklet. Provide a separate balanced information pack for Part B or allow supervised research. Supply sources covering the chosen options and both benefits and limitations.
- Record preflight date, tested build links and result in the class assessment record. Until this is done, treat the package as a review-ready draft.

## Concealed fault cards — teacher only

Assign **one** fault per student; retain the unchanged known-good code. Keep fault labels off student circuit titles. Give only intended behaviour, not the cause. Ensure students record a hypothesis/test before editing. Equivalent variants need local moderation; the disconnected-return variant is the simplest common task.

| Variant | Teacher preparation | Symptom | Evidence expected |
|---|---|---|---|
| A — default | In the blink circuit remove the LED cathode-to-GND wire | External LED remains off | Student identifies an open return path, reconnects cathode to GND and observes repeated blinking |
| B — output pin | Move the resistor's D8 connection to D7, leaving code on D8 | External LED does not follow intended blink | Student compares physical pin to code, predicts and tests moving back to D8; explains the pin mismatch rather than calling the LED broken |
| C — input path | In the button build remove the button-to-GND wire | LED stays off when button pressed | Student tests the missing input connection; internal pull-up holds input HIGH until the button can connect D2 to GND; repaired button restores LOW/on and HIGH/off states |

Do not introduce an omitted resistor or a power-to-ground short as the fault. Do not describe virtual components as physically broken without evidence. A clip-on-insulation fault from the physical assessment is represented here by a missing connection; Tinkercad is not testing actual insulation contact. Do not disconnect the Uno supply for an intended one-wire return fault.

Observation record: student ___; variant ___; initial prediction ___; proposed discriminating test ___; changed one variable ___; actual evidence ___; before/after state verified ___; explanation ___; assistance supplied ___. A successful repair by random rewiring is weaker evidence than a justified controlled test.

## Answer guide

### Circuit sketches (assume working components and suitable cell/lamp ratings)

- **A:** Lamp lights. Cell, wires, closed switch and lamp form a continuous conducting path between cell terminals. A circuit need not look like a circle: connectivity, not outline shape, matters.
- **B:** Lamp off: the switch contacts are separated. Closing the switch completes the path.
- **C:** Lamp off: visible gap in the bottom return wire. Join the two loose ends with a wire; do not bypass the lamp.
- **D:** Lamp off: no cell/energy source, with a gap on the left. Add a cell between the left endpoints. A wire alone would close the outline but would not provide a source of electrical energy.
- **E:** Both lamps off because the one series path contains an open switch. Closing it allows both to light. Do not require a brightness comparison: that needs additional assumptions.
- **F:** All three lamps initially light. Opening only S2 turns off only L2. L1 and L3 still have their own complete source-to-lamp-to-source paths through S1 and S3. Junction dots denote connected branches. There is no wire-only path bypassing the lamps.

### Arduino reasoning

Blink: repeated approximately one-second on and one-second off. D8 HIGH provides a potential difference across the resistor/LED path to GND. The resistor limits current; the LED transforms electrical energy into light and thermal energy. The USB-powered board supplies energy; code controls outputs, it does not generate energy. During the programmed LOW interval the wires remain connected, but the output is near GND potential, so the LED is not driven on. This is different from a physical break in the wire. Accept age-appropriate descriptions such as 'the program changes the output so it no longer drives the LED', without requiring voltage terminology.

Button: released input is HIGH through the internal pull-up; pressing makes the D2-to-GND input path and gives LOW. The code responds by making the separate D8 LED output HIGH. The button supplies neither energy nor the LED's main current path. Releasing returns the input/output to HIGH/LOW respectively. Distinguish input state from output state.

Fault investigation: accept an alternative justified test if it discriminates plausible causes, changes one thing at a time and records observations. Require the actual fault and evidence linking the repair to restored operation. Screenshots should show actual connections, not only a glowing LED.

### Generation and decisions

Accept any three distinct, plausible sources with accurate mechanisms and qualified reasoning. Examples: solar photovoltaic—radiant/light → electrical (no turbine); wind—moving air's kinetic → turbine mechanical → electrical; coal—chemical → thermal → moving steam/turbine mechanical → electrical. Hydroelectricity can describe gravitational potential → kinetic → turbine mechanical → electrical. A battery stores energy; it is not a primary generation source for this comparison, although it can support a generation system.

Possible justified choices: island wind with attention to site conditions, wildlife and backup/storage; desert solar with night-time supply, storage and maintenance; mining-town wind/solar or coal with a reasoned comparison of resources, infrastructure, health and emissions. Location alone does not prove suitability. Coal availability is not a reason to disregard greenhouse emissions or other impacts. Solar/wind have low operational emissions, not 'no environmental impact'; fuelled generation is not guaranteed uninterrupted. Accept a different conclusion supported by sound evidence. No single source is prescribed for a location.

## Adapted marking guide

Use an on-balance A–E judgement against the three original dimensions. The extra parallel/input questions broaden diagnostic evidence; do not make extension complexity, coding syntax or completing more devices a condition of an A. No numerical cut-offs are invented here.

| Dimension | C — expected | B — stronger | A — comprehensive |
|---|---|---|---|
| Science understanding | Analyses the need for a source and conducting path using diagrams/practical evidence; describes transformations during generation | Also explains how a planned circuit test identifies the fault, distinguishing cause from symptom | Also explains how the repair restores transfer, supported by before/after evidence, and gives accurate, connected explanations of energy transformations |
| Science as a human endeavour | Explains how science helps solve problems and inform energy-source decisions | Also explains relevant advantages and disadvantages | Justifies source choices for the locations with evidence and trade-offs, including a reasoned comparison |
| Communicating | Constructs multimodal texts communicating scientific ideas/findings | Uses relevant scientific vocabulary and representations effectively | Communicates comprehensively and accurately, connecting diagrams, observations and explanations |

For **D**, evidence is partial: identifies some components/changes or energy sources but gives incomplete causal explanations, limited connections between science and choices, and partially clear representations. For **E**, evidence is fragmentary: names isolated facts with little explanation and limited communication of findings. Judge each dimension independently; missing work is insufficient evidence, not automatically proof of an E. Apply school processes to obtain evidence. Compare these local descriptors with the original marking guide during moderation.

Evidence mapping: diagram questions and tasks 4–6 support circuit understanding; three task-7 pages support generation; task 7 and task 8 support decisions; all artefacts support communication. Record misconceptions for feedback separately (for example 'shape must be circular', 'code supplies energy', 'all parallel lamps share one switch').

## Technical references and rebuild

- Arduino's official [InputPullupSerial example](https://docs.arduino.cc/built-in-examples/digital/InputPullupSerial/) documents the internal pull-up convention used by the button starter.
- Autodesk's [Tinkercad Circuits guide](https://images.tinkercad.com/jl5ii4oqrdmc/4sMFqe3rDlbUymJt0I4yh/85a4487f7fe274e74c19870ae4679fc1/tinkercad-guides_circuits-Printable.pdf) provides simulator orientation.

Run `python build_assessment.py` from this folder to rebuild the self-contained HTML and six JSON/SVG pairs. It uses the workspace electrical-diagram skill, validates specifications and rendered endpoints, adds branch junction dots, and independently checks source/load paths and each of the three parallel switches. These graph checks are not an analogue circuit simulation or proof that the Arduino builds have passed Tinkercad preflight.
