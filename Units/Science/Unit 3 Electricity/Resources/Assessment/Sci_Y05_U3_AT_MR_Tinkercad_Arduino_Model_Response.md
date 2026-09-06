---
title: "Year 5/6 Science Unit 3 Assessment Task — Model Response & Marking Guide"
unit: "Energy and Electricity (Unit 3)"
year_level: "Year 5/6"
curriculum_code: "AC9S6U03 / ACSSU097"
task_type: "Teacher Marking Guide & Model Response"
environment: "Tinkercad Circuits & Arduino Uno Simulation"
---

# P–6 Curriculum Planning Model — Assessment Model Response
### Adjusted for Year 5 (A CYCLE – Unit 3)
**Based on Year 6 Science: Unit 2 — Energy and Electricity**

---

## Part A: Practical Circuit Construction & Analysis (Model Response)

### Circuit 1: The Simple LED Light Circuit

#### 1. Circuit Representations
- **Breadboard Layout:** Shows Arduino Uno 5V connected to positive rail ($+$), GND connected to negative rail ($-$). A jumper wire runs from $+$ rail to a $220\,\Omega$ resistor, which connects to the long positive anode leg of the LED. The short negative cathode leg connects back to the GND rail.
- **Circuit Schematic:** Uses standard symbols: DC Power Supply ($5\,\text{V}$), Resistor ($220\,\Omega$), and LED (diode symbol with outwards light arrows) in a continuous closed loop.

#### 2. Scientific Analysis (Circuit 1)
- **a. Path Requirements:** "Electricity requires an unbroken, continuous loop of conducting materials to flow. Connecting both the 5V positive terminal and the GND negative terminal creates a potential difference that allows electrons to travel through the resistor and LED and return to the source. If either connection is broken, it becomes an open circuit and no current can flow."
- **b. Energy Transformation:**
  $$\text{Electrical Energy} \longrightarrow \text{Light Energy (+ minor Thermal/Heat Energy)}$$

---

### Circuit 2: The Controlled / Switched Circuit

#### 1. Circuit Schematic (Circuit 2)
- **Schematic:** Standard symbols showing DC Power Supply ($5\,\text{V}$), an **Open Switch** symbol (a line tilted away from the contact terminal), $220\,\Omega$ Resistor, and LED in series.

#### 2. Scientific Analysis (Circuit 2)
- **a. Open vs. Closed Circuits:** "When the switch is in the **open position**, there is a physical air gap in the circuit. Air is an insulator, so the electrical pathway is broken (an open circuit), meaning zero electrical current flows and the LED remains off. When the switch is pressed or closed, the internal metal contacts touch, completing the conductive pathway (a closed circuit), which allows electrical current to flow and illuminates the LED."
- **b. Role of the Switch:** "The switch acts as a mechanical control device that opens or closes the conductive pathway on demand. It allows the user to safely start, stop, or control the transfer of electrical energy without having to physically disconnect the power wires."

---

### Circuit 3: The Dual-Output Alarm Circuit (Light & Sound)

#### 1. Circuit Schematic (Circuit 3)
- **Schematic:** Standard symbols showing DC Power Supply ($5\,\text{V}$), Switch, and two output branches connected in parallel after the switch:
  - Branch 1: $220\,\Omega$ Resistor + LED
  - Branch 2: Piezo Buzzer (with $+$ and $-$ polarity indicated)
  - Both branches return to the common GND rail.

#### 2. Scientific Analysis (Circuit 3)
- **a. Multiple Energy Transformations:**
  - *Transformation 1 (LED):* $\text{Electrical Energy} \longrightarrow \text{Light Energy}$
  - *Transformation 2 (Buzzer):* $\text{Electrical Energy} \longrightarrow \text{Sound Energy (Kinetic/Acoustic Vibrations)}$
- **b. Circuit Design Explanation:** "The circuit is designed with both the LED branch and the buzzer branch connected to the switched power rail and returning to GND. When the switch closes, electrical energy is transferred simultaneously through both pathways. In the LED, electrical energy is transformed into radiant light energy, while in the piezo buzzer, electrical oscillations rapidly vibrate a ceramic element, transforming electrical energy into sound waves. This provides both visual and audible alert signals at the same time."

---

## Part B: Energy Sources & Electricity Generation (Model Response)

### Location 1: Tropical Island (Exemplar: Wind Energy or Solar PV)

- **Chosen Energy Source:** **Wind Energy** (or **Solar Photovoltaic**)
- **Justification:** Tropical islands experience consistent, strong coastal sea breezes and trade winds. Wind energy is renewable, produces zero greenhouse gas emissions during operation, and eliminates the need to transport expensive diesel fuel by barge over the ocean.
- **Transformation Flow Diagram:**
  $$\text{Kinetic Energy (Moving Air)} \longrightarrow \text{Mechanical Kinetic Energy (Rotating Turbine Blades)} \longrightarrow \text{Electrical Energy (Generator)}$$
- **Sequence Explanation:** Uneven solar heating of the Earth creates moving air (wind). The kinetic energy of the wind pushes aerodynamic turbine blades, causing the rotor shaft to spin. Inside the nacelle, a gearbox and generator use spinning magnets around copper coils (electromagnetic induction) to transform the mechanical kinetic energy into electrical energy that powers the show attractions.
- **Advantages & Disadvantages:**
  - *Advantages:* 
    1. Fuel is completely free and inexhaustible (renewable).
    2. Zero operational greenhouse gas emissions, protecting sensitive coral reef marine ecosystems.
  - *Disadvantages:*
    1. Wind speed varies; requires battery storage or backup systems during calm weather.
    2. High initial installation costs and vulnerability to severe tropical cyclone winds.

---

### Location 2: Remote Desert Community (Exemplar: Solar Photovoltaic)

- **Chosen Energy Source:** **Solar Photovoltaic (PV) Energy**
- **Justification:** Remote Australian desert regions receive some of the highest solar irradiance levels in the world, with cloudless skies and long sunshine hours. Solar PV systems are modular, transportable, and generate power directly on-site without water requirements.
- **Transformation Flow Diagram:**
  $$\text{Radiant/Light Energy (Solar Radiation)} \longrightarrow \text{Electrical Energy (Semiconductor Solar Cells)}$$
- **Sequence Explanation:** Photons of light energy from the sun strike the silicon semiconductor wafers inside the photovoltaic solar panels. This light energy excites electrons within the silicon atoms, causing them to break free and flow along conductive metal contacts. This direct movement of charge generates direct current (DC) electrical energy, which can be stored in batteries or converted to AC to power the show.
- **Advantages & Disadvantages:**
  - *Advantages:*
    1. High energy yield due to intense, consistent sunlight in arid zones.
    2. Solid-state technology with no moving parts, resulting in low maintenance and quiet operation.
  - *Disadvantages:*
    1. Only generates electricity during daylight hours; requires battery energy storage systems (BESS) for evening show attractions.
    2. High desert ambient temperatures can slightly reduce photovoltaic cell efficiency, and dust/sand accumulation requires periodic cleaning.

---

### Application of Scientific Knowledge
**Exemplar Response:**
> "Understanding electrical energy generation, transfer, and transformation enables the show organisers to evaluate environmental conditions (sunlight levels, wind patterns, local resources) and select energy systems that provide reliable, uninterrupted power while minimising fuel transport costs and pollution. It ensures they size battery storage correctly, design safe distribution circuits, and protect local ecosystems from environmental harm."
