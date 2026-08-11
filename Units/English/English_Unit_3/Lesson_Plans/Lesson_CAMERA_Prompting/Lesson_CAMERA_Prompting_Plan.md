# Lesson Plan: Directing AI Video with the CAMERA Prompting Method

**Unit:** Year 5/6 English — Unit 3: Persuasive Text & Multimodal Media  
**Lesson Title:** Directing AI Video — The CAMERA Prompt Builder  
**Duration:** 20 Minutes (Explicit Instruction & Concept Guide)  
**Target Application:** CAMERA Single-Page Wizard (`CAMERA-Prompt-Builder/index.html`)  

---

### Pedagogical Contemplation

> **1. Cognitive Goal:** Students learn to transition from writing vague, unstructured text prompts (e.g., *"a tiger running in a forest looking cool"*) to directing AI video generation using six precise filmmaking components: **Camera, Actor, Movement, Environment, Rendering, and Anchors**.
>
> **2. Interactive Alignment:** Rather than memorising technical AI model syntax, students learn established filmmaking vocabulary. The CAMERA framework scaffolds complex multimodal prompt generation into manageable single decisions, demonstrating how structured metadata compiles into cohesive, descriptive English prompt sentences.
>
> **3. Surfacing Student Thinking:** By evaluating options within each stage and resolving visual/logical conflicts (e.g., trying to combine a *Static Camera* with a *Tracking Shot*), students explicitly reason about visual storytelling and camera direction before spending time generating video clips.
>
> **4. Pedagogical vs. Engagement Goal:** The pedagogical purpose is teaching structured visual description and logical consistency in multimodal media; the engagement feature is acting as a film director configuring a professional camera shoot.

---

## Learning Intentions & Success Criteria

### Learning Intention
We are learning how to direct an AI video generator by breaking shot descriptions into six structured **CAMERA** stages.

### Success Criteria
- I can state what each letter in **C-A-M-E-R-A** stands for.
- I can select appropriate filmmaking options (shot size, camera angle, actor features, visible movement, environment, rendering style, and duration anchors).
- I can explain why describing visible, physical actions produces more predictable AI video clips than abstract emotions or unspecific ideas.
- I can spot and correct contradictory prompt instructions using the Director's Conflict Checker rules.

---

## 20-Minute Lesson Timing & Sequence

| Time | Phase | Focus & Teacher Activity | Student Activity |
| :--- | :--- | :--- | :--- |
| **0:00 – 3:00** | **1. The Director's Challenge (Hook)** | Compare two prompt results on screen:<br>• *Vague:* "A boy running through a rainforest."<br>• *Structured (CAMERA):* "Medium eye-level tracking shot of a ten-year-old explorer..."<br>Explain that AI models cannot guess what is in your head; you must direct the shot. | Observe clip differences. Identify why Shot B looks cinematic and controlled while Shot A is unpredictable. |
| **3:00 – 14:00** | **2. Explicit Teaching — The 6 CAMERA Stages** | Walk step-by-step through the 6 stages of the CAMERA wizard using the slide deck.<br>• **C (Camera):** Framing (Extreme Close-up to Extreme Wide), Angle, Movement.<br>• **A (Actor):** Subject type, count, detailed appearance, visible emotion.<br>• **M (Movement):** Action verb, direction, speed, manner (visible motion).<br>• **E (Environment):** Location, time of day, weather, key background details.<br>• **R (Rendering):** Art style, lighting, colour palette, overall mood.<br>• **A (Anchors):** Duration (4–15s), continuity rules, consistency locks. | For each stage, examine option cards, SVG framing diagrams, and option choices. Practice identifying strong choices for a sample persuasive shot. |
| **14:00 – 17:00** | **3. The Prompt Compiler & Conflict Checker** | Demonstrate how individual dropdown/card choices compile into a structured prompt sentence.<br>Show how the Conflict Checker flags errors:<br>• *Fix This (Error):* Static + Tracking shot.<br>• *Director's Tip (Warning):* Extreme close-up + massive landscape description. | Analyze sample prompt combinations. Identify why certain choices conflict and how to resolve them. |
| **17:00 – 20:00** | **4. App Launch & Workflow** | Introduce the `CAMERA-Prompt-Builder` app workflow:<br>1. Open `index.html`<br>2. Direct the 6 stages<br>3. Copy compiled prompt<br>4. Generate & evaluate clip<br>5. Adjust ONE variable if tweaking. | Open `index.html` on individual/paired devices, complete the start screen, and select their first shot size. |

---

## Stage-by-Stage Breakdown & Options Reference

### Stage 1: C — CAMERA (How the audience sees the shot)
* **Shot Size (1 primary choice):**
  * *Extreme close-up:* Tiny details (eyes, hands, small objects).
  * *Close-up:* Face clearly visible; highlights emotion and reaction.
  * *Medium close-up:* Head and shoulders; ideal for dialogue.
  * *Medium shot:* Waist up; ideal for characters performing actions.
  * *Medium-long shot:* Most of body; balances expression and physical movement.
  * *Wide shot:* Full subject and immediate surroundings visible.
  * *Extreme wide shot:* Vast area; establishes location, landscape, or scale.
* **Camera Angle (1 primary choice):**
  * *Eye level:* Level with subject; natural and neutral perspective.
  * *Low angle:* Camera looks up; makes subject appear powerful or intimidating.
  * *High angle:* Camera looks down; makes subject appear smaller or vulnerable.
  * *Top-down:* Directly overhead; layout, movement patterns, or map view.
  * *Ground level:* Very low to ground; makes nearby objects dramatic and large.
  * *Dutch angle:* Tilted horizon; creates tension, instability, or danger.
  * *Point of view (POV):* Audience sees through character's eyes.
* **Camera Movement (Standard = 1 choice; Advanced = up to 3 combined):**
  * Options: *Static camera*, *Pan left/right*, *Tilt up/down*, *Push in*, *Pull out*, *Track/follow subject*, *Move left/right*, *Rise upwards*, *Lower down*, *Zoom in/out*, *Handheld/shaking*.
  * *Translation Layer:* The app automatically converts standard terms to model syntax (e.g. *Track/follow subject* $\rightarrow$ `[Tracking shot]`).

### Stage 2: A — ACTOR (Who or what the camera is watching)
* **Subject Type & Count:** Person, Animal, Robot, Creature, Vehicle, Object, Other. Count: *One* (recommended for clean AI tracking), *Two*, *Small group*, *Crowd*.
* **Actor Description Builder:** Age/Type + Appearance + Clothing/Colours + Distinctive Feature.
  * *Example output:* "a ten-year-old explorer with curly black hair, wearing a yellow raincoat and a small red backpack with round red glasses".
* **Actor Emotion:** Calm, Happy, Excited, Curious, Nervous, Frightened, Surprised, Determined, Angry, Sad, Confused.
  * *Director's Rule:* Emotions must express as visible physical behaviour (e.g., *Nervous* $\rightarrow$ glancing around, tightening shoulders).

### Stage 3: M — MOVEMENT (What happens during the shot)
* **Rule:** Describe something the camera can physically see!
* **Main Action Verbs:** walks, runs, turns, looks, reaches, picks up, puts down, jumps, sits, stands, opens, closes, waves, points, climbs, dances, drives, flies.
* **Direction & Speed:** towards camera, away from camera, left to right, right to left, upwards, downwards, in a circle, stays in place. Speed: *Very slowly*, *Slowly*, *Natural speed*, *Quickly*, *Very quickly*.
* **Manner (Optional chips):** carefully, cautiously, confidently, smoothly, energetically, clumsily, nervously, angrily, happily, quietly, dramatically.
* **Live Sentence Builder Preview:** *"She walks slowly from left to right, moving carefully."*

### Stage 4: E — ENVIRONMENT (Where the shot takes place)
* **Location & Description:** Indoor, Outdoor, Natural, City/town, Fantasy, Sci-fi, Historical. (e.g. *"a misty subtropical rainforest"*).
* **Time of Day:** Dawn, Morning, Midday, Afternoon, Golden hour, Sunset, Evening, Night.
* **Weather & Atmosphere:** Clear, Cloudy, Windy, Rain, Heavy rain, Storm, Fog, Snow, Dust, Smoke, None.
* **Key Details (Max 2–3):** Focus on essential elements (e.g. *tall green ferns*, *wet leaves*, *pale fog between trees*).
* **Environmental Motion:** Rain falls, fog drifts, leaves move in wind, water flows, clouds move.

### Stage 5: R — RENDERING (Visual art direction & feel)
* **Visual Style (Choose 1):** Photorealistic, Live-action cinematic, Stylised 3D animation, 2D animation, Stop motion, Clay animation, Anime, Comic-book, Watercolour, Documentary, Vintage film.
* **Lighting & Colour:** Soft natural light, Bright daylight, Warm golden light, Dramatic side lighting, Backlighting, Soft studio light, Dark/moody lighting, Moonlight, Neon lighting. Colour: *Warm*, *Cool*, *Vibrant*, *Muted*, *Earthly*, *High contrast*.
* **Mood:** Adventurous, Mysterious, Exciting, Tense, Dramatic, Magical, Peaceful, Hopeful.

### Stage 6: A — ANCHORS (Continuity & model constraints)
* **Duration:** 4–15 seconds (Recommended: **6 seconds** while learning).
* **Continuity Anchors (Checkboxes):** One continuous shot, Keep subject appearance consistent, Keep clothing/colours unchanged, Smooth natural movement, Maintain visual style throughout.
* **Composition Anchor:** Keep subject centred, Follow subject naturally, Maintain composition.

---

## Prompt Compiler & Conflict Checker Mechanics

The application automatically compiles structured student selections into clear, grammatical English sentences:

```text
[Shot Size + Angle] + of + [Actor Description] + [Actor Action + Direction + Speed] + [Camera Movement Syntax] + [Environment + Time + Weather + Details] + [Rendering Style + Lighting + Colour + Mood] + [Anchors]
```

### The Conflict Checker (3 Warning Levels)
1. **✓ Good (Green):** All choices align logically.
2. **💡 Director's Tip (Yellow):** Not impossible, but difficult for AI (e.g., *Extreme Close-up combined with vast rainforest details*).
3. **⚠ Fix This (Red):** Direct contradictions (e.g., *Static Camera combined with Tracking Shot*, or *Night time combined with Bright Midday Sun*).

---

## Differentiation & Scaffolding

* **Support (Tier 1 & Tier 2):**
  * Use the inline **ⓘ Help me choose** pop-ups in the app for guidance.
  * Stick to 1 Actor, Standard Camera Mode (1 movement), and 6-second clip duration.
  * Use preset choice cards rather than typing custom text.
* **Extension (Tier 3):**
  * Enable **Advanced Camera Mode** to combine up to 3 camera movements (e.g., `Pan left + Push in`).
  * Add a second connected action (e.g., *"walks towards the door and reaches for the handle"*).
  * Configure custom depth of field (shallow depth of field / macro detail).

---

## Teacher Notes & Classroom Logistics

> [!NOTE]
> **DO:** Open `Lesson_CAMERA_Prompting_Presentation.html` on the main display screen. Project slides in full-screen mode. Have student laptops/tablets ready with `CAMERA-Prompt-Builder/index.html`.
>
> **WORK:** Guide students through the 6 stages as a whole class for 10 minutes, using the visual SVG slide diagrams to demonstrate how framing changes audience perspective.
>
> **RECORD:** Students will use the CAMERA app to build their prompt, click **COPY PROMPT**, and save their structured project as a `.json` file for future editing.
>
> **FINISH:** Check prompt health status (green ticks, 0 conflicts) before pasting into the AI video generator.
>
> **CHECK:** Ask 3 quick Check for Understanding (CFU) questions:
> 1. What does the 'M' in CAMERA stand for, and why must actions be visible?
> 2. What happens if you pick both 'Static Camera' and 'Tracking Shot'?
> 3. Why do we lock Anchors like character appearance across shots?
