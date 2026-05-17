# Week 5 Homework Materials — Quality Audit Report

This report presents a comprehensive quality audit of the differentiated bushfire homework materials for **Week 5**, covering the **Red**, **Blue**, and **Green** level groups. The audit verifies that all reading comprehension and mathematics questions are logically sound, curriculum-compliant, textually supported, and mathematically accurate.

---

## 📋 Executive Summary

A full audit across all nine generated Word documents and their underlying Javascript generation scripts (`generate_reading.js`, `generate_questions.js`, and `create_print.js`) was performed. 

### Key Findings
* **Mathematics Accuracy (100% Correct)**: All 15 Year 5 maths questions (applied to Red/Blue) and 15 Year 3/4 maths questions (applied to Green) are mathematically correct. The marked answers in `generate_questions.js` match the exact mathematical solutions, and the printed options in `create_print.js` align perfectly.
* **Textual Support & Literature Questions (100% Aligned)**: Every comprehension question is fully answerable using *only* the provided reading passage for that specific level. 
* **Ordering and Structure (Perfect)**: Headings, question numbers, and multiple-choice options (A, B, C, D) are perfectly ordered and consistent across both the digital (Microsoft Forms-ready) and print-ready DOCX formats.

### Improvements Made
* **Red Group Q3 Alignment**: Option C in Red Group Comprehension Q3 was updated in both `generate_questions.js` and `create_print.js` to ensure the answer is directly supported by literal sentences in the Paragraph 2 reading text rather than referencing an external detail not mentioned in that paragraph.

---

## 📖 Literature & Comprehension Verification

Each group's 15 reading comprehension questions were audited word-for-word against their respective text passages.

### 🔴 Red Group (Year 5 Extension / Standard)
* **Q1 (Conditions for fire)**: Correct. Fully supported by Paragraph 2: *"When temperatures are high, humidity is low, and strong winds are blowing..."*
* **Q2 (Fuel load definition)**: Correct. Fully supported by Paragraph 3: *"The amount of fuel in an area is called fuel load. It refers to the dry plant material..."*
* **Q3 (Dangerous inland winds)**: **Optimised**. Previously, Option C mentioned *"southeastern states"*, which is not present in Paragraph 2. It has been updated to:
  * **Digital Questions**: *"C. They can cause a fire to spread very quickly"*
  * **Print-Ready Layout**: *"C. They can cause a fire to spread very quickly"*
  * *This directly aligns with the literal text: "When temperatures are high, humidity is low, and strong winds are blowing, a fire can spread very quickly."*
* **Q4 (Hazard reduction purpose)**: Correct. Fully supported by Paragraph 3: *"By removing dry material before the fire season, future fires are less likely to become extreme."*
* **Q5 (Black Summer area)**: Correct. Fully supported by Paragraph 4: *"Around 18.6 million hectares burned..."*
* **Q6 (Country comparison)**: Correct. Fully supported by Paragraph 4: *"This is an area larger than the country of Syria."*
* **Q7 (Air quality impact)**: Correct. Fully supported by Paragraph 4: *"Thick smoke covered major cities for weeks, making the air quality extremely poor..."*
* **Q8 (Direct human deaths)**: Correct. Fully supported by Paragraph 4: *"The fires caused 33 direct deaths..."*
* **Q9 (Banksia cones)**: Correct. Fully supported by Paragraph 5: *"The banksia has cones that stay tightly sealed until heat causes them to open."*
* **Q10 (Ash-rich soil)**: Correct. Fully supported by Paragraph 5: *"Seeds then fall onto nutrient-rich, ash-rich soil, where they can germinate and grow."*
* **Q11 (Grass tree survival)**: Correct. Fully supported by Paragraph 5: *"because its thick leaf base protects its growing point from heat."*
* **Q12 (Evolved adaptations)**: Correct. Fully supported by the botanical descriptions in Paragraph 5.
* **Q13 (Timing of hazard burns)**: Correct. Fully supported by Paragraph 3: *"These are planned, controlled fires lit carefully under safe conditions."*
* **Q14 (Complex recovery)**: Correct. Fully supported by Paragraph 6: *"Homes need to be rebuilt and wildlife populations need time to recover. The emotional impact... can also last a long time."*
* **Q15 (Main purpose)**: Correct. Fully supported by the objective informational nature of the passage.

### 🔵 Blue Group (Year 5 Standard / Core)
* **All 15 questions** are perfectly aligned. Q4 (*"Why are hot winds from Australia's dry inland particularly dangerous..."*) correctly uses *"C. They can cause a fire to spread very quickly"* as its answer key, which is beautifully supported by Paragraph 2.

### 🟢 Green Group (Year 5 Support / Core)
* **All 15 questions** use simpler syntax and literal look-ups, which map 1-to-1 with the Green reading passage. No external inferences or extra steps are required.

---

## 🧮 Mathematics Audit & Solutions

### 🔴/🔵 Red and Blue Groups: Year 5 Maths (AC9M5N09)
*These questions involve Year 5 multi-operation word problems (addition, subtraction, multiplication) in bushfire contexts.*

| Question | Mathematical Working | Correct Answer | Verified in Code | Status |
| :--- | :--- | :---: | :---: | :---: |
| **Q16 (Water remaining)** | $1240 - 480 - 315 = 760 - 315 = 445$ | **A** (445 L) | Option A | **Pass** |
| **Q17 (Tree survival)** | $(6 \times 48) - 85 = 288 - 85 = 203$ | **B** (203) | Option B | **Pass** |
| **Q18 (Shelter animals)** | $124 + 89 - 76 = 213 - 76 = 137$ | **B** (137) | Option B | **Pass** |
| **Q19 (Foam/Water left)** | $(9 \times 1800) - 4250 = 16200 - 4250 = 11950$ | **A** (11,950 L) | Option A | **Pass** |
| **Q20 (Sandbags in place)** | $(15 \times 8) - 47 = 120 - 47 = 73$ | **B** (73) | Option B | **Pass** |
| **Q21 (Food donations)** | $345 + 218 - 412 = 563 - 412 = 151$ | **B** (151 kg) | Option B | **Pass** |
| **Q22 (Hectares saved)** | $122 - (12 \times 7) = 122 - 84 = 38$ | **C** (38 ha) | Option C | **Pass** |
| **Q23 (Fundraiser money)** | $2450 - 875 - 640 = 1575 - 640 = 935$ | **B** (\$935) | Option B | **Pass** |
| **Q24 (Aerial plane drop)** | $(3000 \times 6) - 4200 = 18000 - 4200 = 13800$ | **C** (13,800 L) | Option C | **Pass** |
| **Q25 (Homes contacted)** | $265 - 143 - 78 = 122 - 78 = 44$ | **B** (44) | Option B | **Pass** |
| **Q26 (Firefighter hours)** | $8 \times 14 \times 3 = 112 \times 3 = 336$ | **C** (336 hrs) | Option C | **Pass** |
| **Q27 (Supply items kept)** | $(24 \times 16) - 57 = 384 - 57 = 327$ | **B** (327) | Option B | **Pass** |
| **Q28 (Day 6 temperature)** | $41 - 8 = 33$ *(Note: 187 is a distractor)* | **C** (33°C) | Option C | **Pass** |
| **Q29 (Budget remaining)** | $15000 - 4320 - 6450 = 10680 - 6450 = 4230$ | **B** (\$4,230) | Option B | **Pass** |
| **Q30 (Empty enclosures)** | $540 - (7 \times 12 + 1) = 540 - 85 = 455$ | **B** (455) | Option B | **Pass** |

---

### 🟢 Green Group: Year 3/4 Maths (AC9M3N06)
*These questions involve Year 3/4 multi-operation problems with smaller, more supportive numbers.*

| Question | Mathematical Working | Correct Answer | Verified in Code | Status |
| :--- | :--- | :---: | :---: | :---: |
| **Q16 (Water remaining)** | $240 - 85 - 60 = 155 - 60 = 95$ | **B** (95 L) | Option B | **Pass** |
| **Q17 (Tree survival)** | $(4 \times 12) - 18 = 48 - 18 = 30$ | **B** (30) | Option B | **Pass** |
| **Q18 (Shelter animals)** | $35 + 28 - 14 = 63 - 14 = 49$ | **C** (49) | Option C | **Pass** |
| **Q19 (Foam remaining)** | $(3 \times 90) - 145 = 270 - 145 = 125$ | **A** (125 L) | Option A | **Pass** |
| **Q20 (Food items left)** | $(5 \times 20) - 36 = 100 - 36 = 64$ | **B** (64) | Option B | **Pass** |
| **Q21 (Carer food left)** | $48 + 27 - 35 = 75 - 35 = 40$ | **B** (40 kg) | Option B | **Pass** |
| **Q22 (Sandbags left)** | $120 - 45 - 38 = 75 - 38 = 37$ | **B** (37) | Option B | **Pass** |
| **Q23 (Water used)** | $6 \times (15 - 4) = 6 \times 11 = 66$ | **D** (66 L) | Option D | **Pass** |
| **Q24 (Rescue centre now)** | $85 + 34 - 29 = 119 - 29 = 90$ | **B** (90) | Option B | **Pass** |
| **Q25 (Fundraiser money)** | $180 + 95 - 145 = 275 - 145 = 130$ | **B** (\$130) | Option B | **Pass** |
| **Q26 (Tubing roll length)** | $(3 \times 8) + 7 = 24 + 7 = 31$ | **C** (31 m) | Option C | **Pass** |
| **Q27 (Healthy farm animals)** | $(5 \times 9) - 12 = 45 - 12 = 33$ | **B** (33) | Option B | **Pass** |
| **Q28 (Distance to town)** | $(4 \times 7) + 6 = 28 + 6 = 34$ | **D** (34 km) | Option D | **Pass** |
| **Q29 (Water bottle bags)** | $(96 + 24) \div 6 = 120 \div 6 = 20$ | **B** (20) | Option B | **Pass** |
| **Q30 (Shrubs growing)** | $(8 \times 9) - 16 = 72 - 16 = 56$ | **B** (56) | Option B | **Pass** |

---

## 🛠️ Re-Compilation & Build Log

Following the corrections made to Red Q3, all nine Word documents were re-compiled sequentially:

```powershell
node generate_reading.js
node generate_questions.js
node create_print.js
```

### Generated Artifacts Validation
* **`Week_5_Reading_Red.docx`** | **`Week_5_Reading_Blue.docx`** | **`Week_5_Reading_Green.docx`**
  * *Validated*: Structure, font families (Arial), margins, and alignment are preserved.
* **`Week_5_Questions_Red.docx`** | **`Week_5_Questions_Blue.docx`** | **`Week_5_Questions_Green.docx`**
  * *Validated*: Microsoft Forms-ready import formats, with bold answers and 1-point allocations preserved.
* **`Week_5_Print_Red.docx`** | **`Week_5_Print_Blue.docx`** | **`Week_5_Print_Green.docx`**
  * *Validated*: Side-by-side dual-column layouts and custom borders rendered correctly.

All materials are now **100% correct, verified, and ready for classroom use!**
