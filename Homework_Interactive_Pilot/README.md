# Digital Homework Pilot — Term 3 Week 6

An interactive, responsive single-page web application exploring a new digital homework paradigm for upper primary students.

---

## 🌟 Key Features

### 1. Differentiated Reading Portal (*The Dayak Peoples of Borneo*)
- **3 Reading Levels:**
  - 🔴 **Red Group (Level 1):** Advanced / Year 5+ (F-K Grade 6.6, 339 words).
  - 🔵 **Blue Group (Level 2):** Standard / Year 5 (F-K Grade 4.6, 301 words).
  - 🟢 **Green Group (Level 3):** Foundational / Year 3–4 (F-K Grade 3.5, 176 words).
- **Interactive Glossary:** Clickable dotted keywords (e.g. *rumah betang*, *ladang*, *sape*, *ironwood*, *rattan*) opening phonetic pronunciation and cultural definition cards.
- **Audio Read-Aloud (Text-to-Speech):** Integrated Australian English voice reader.

### 2. Interactive Thematic Graph Maps
- **High-Fidelity SVG Map of Borneo** with interactive provinces and states.
- **3 Thematic Layers with Dynamic Legends:**
  1. *Population Density (people/km²)* — Choropleth scale.
  2. *Dayak Community Distribution (%)* — Regional Indigenous concentrations.
  3. *Rainforest Canopy Cover (%)* — Primary forest vs cultivated land.
- **Interactive Region Inspector:** Hovering or clicking any province reveals live demographic data (total population, land area, density, Dayak population count, cultural heritage notes).
- **Legend Filtering:** Clicking any legend swatch filters matching provinces.

### 3. Comparative Data Lab
- **Indonesian Islands Population Comparison:** Horizontal comparative bar charts (Java 156M, Sumatra 60M, Kalimantan 17M, etc.).
- **Australian States & Territories:** Comparative demographic bars (NSW 8.4M, VIC 6.8M, QLD 5.5M, etc.).
- **Borneo Rainforest Timeline (1970–2025):** 50-year stacked bar timeline showing forest canopy vs cleared land.
- **Density Benchmarking (Log Scale):** Visual comparisons of people per km² between Australian states and Indonesian islands.

### 4. Differentiated Map & Data Discernment Quizzes
- **10 Spatial Data & Map Questions per level:** Prompts students to read map keys, determine color zones, compare regional scales, and calculate population differences.
- **Instant Pedagogical Feedback:** Immediate correct/incorrect status with detailed worked explanations.
- **"Show Layer on Map" Integration:** Clicking a button on any question automatically switches the map layer and focuses on the target region.
- **15 Reading Comprehension Questions per level.**

### 5. Progress Dashboard & Gamification
- Live score and points counter.
- Persistent name and progress tracking in LocalStorage.
- Dark mode / Light mode toggle.
- Print / Export student completion summary.

---

## 🚀 Running the Pilot Locally

To run locally in a web browser:
```bash
python -m http.server 8085 --directory Homework_Interactive_Pilot
```
Then navigate to `http://localhost:8085` in any modern web browser.
