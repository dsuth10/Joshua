# Digital Homework Pilot — Term 3 Week 6

An interactive, responsive single-page web application exploring a modern digital homework paradigm for upper primary students, built directly around the revised Term 3 Week 6 homework package.

---

## 🌟 Key Features

### 1. Differentiated Reading Portal (*The Dayak Peoples of Borneo*)
- **3 Differentiated Reading Levels:**
  - 🔴 **Red Group (Level 1):** Advanced / Year 5+ (F-K Grade 6.6, 339 words).
  - 🔵 **Blue Group (Level 2):** Standard / Year 5 (F-K Grade 4.6, 301 words).
  - 🟢 **Green Group (Level 3):** Foundational / Year 3–4 (F-K Grade 3.5, 176 words).
- **Interactive Cultural Glossary:** Clickable dotted keywords (e.g. *rumah betang*, *ladang*, *sape*, *ironwood*, *rattan*, *Gawai Dayak*) opening phonetic pronunciation, category badges, audio speak, and cultural definitions.
- **Audio Read-Aloud (Text-to-Speech):** Integrated Australian English voice narration.

### 2. Differentiated Reading Comprehension Check (Questions 1–15)
- **15 Questions per level** testing text-based retrieval, inference, vocabulary in context, and central theme.
- **Instant Pedagogical Feedback:** Immediate correct/incorrect status with paragraph citations and explanations matching the official Teacher Answer Key.

### 3. Multi-Step Mathematics Challenge (Questions 16–30)
- **15 Multi-Step Mathematics Word Problems per level:**
  - 🔴 **Red & 🔵 Blue:** Year 5 Multi-Step Problems (AC9M5N04 — Excursion costs, muffin packing, sustainability seedlings profit, library books inventory, sports uniform budgets, orchard crate masses, fun run distances, canteen rates, bus hire division, garden soil mixes, craft stall budgets, print time rates, raffle ticket returns, rainwater tank daily allowances, hall seating).
  - 🟢 **Green:** Year 3/4 Multi-Step Problems (AC9M3N04 / AC9M4N03 — Sticker sharing, cookie trays, toy car storage, board game savings, apple packing, classroom pencils, reading goals, egg cartons, soccer goals, sandwich platters, sunflower pots, bus seating, marble bags, cupcake sharing, pool laps).
- **Step-by-Step Problem Clues:** "💡 Show Steps Clue" accordion breaking down each sub-calculation.
- **Interactive Maths Scratchpad & Calculator:** Built-in floating working drawer with mini arithmetic evaluator and working notes canvas.
- **Worked Explanations:** Complete mathematical operations shown upon submission.

### 4. Interactive Thematic GIS Map of Borneo
- **Leaflet Cartographic Engine** with genuine administrative GeoJSON boundaries for all Borneo provinces and states.
- **3 Dynamic Thematic Layers:**
  1. *Population Density (people/km²)*
  2. *Dayak Population Share (%)*
  3. *Rainforest Canopy Cover (%)*
- **Live Region Inspector:** Click any province to inspect capital, nation, population, density, forest cover, and cultural heritage notes.

### 5. Comparative Data Lab
- **Indonesian Islands Demographic Chart** (Java 156M, Sumatra 60M, Kalimantan 17M, etc.).
- **Australian States & Territories Demographic Comparison** (NSW 8.4M, VIC 6.8M, QLD 5.5M, etc.).
- **Borneo Rainforest 50-Year Timeline (1970–2025)**: Stacked bar chart tracing forest canopy vs cleared land.
- **Population Density Benchmarking**: Comparative bars on a logarithmic scale.

### 6. Student Progress Record & Certificate
- **Complete 30-Question Tracking:** 15 Reading + 15 Maths = 30 total questions (up to 300 pts).
- **Persistent LocalStorage State:** Keeps student name, level, answers, and points across sessions.
- **Print / Save Certificate:** Styled print view for physical homework submission or PDF export.
- **Dark / Light Theme Engine:** Seamless theme switching with tailored glassmorphic styling.

---

## 🚀 Running the Pilot Locally

To run locally in a web browser:
```bash
python -m http.server 8086 --directory Homework_Interactive_Pilot_Week06
```
Then navigate to `http://localhost:8086` in any modern web browser.
