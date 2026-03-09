# Structure of the Australian Curriculum v9 (AC v9)

The Australian Curriculum v9 is organised into a hierarchical structure designed to provide a comprehensive and consistent education across all states and territories. This structure facilitates clear mapping from high-level learning goals down to specific classroom instructions.

## 1. Top-Level: Learning Areas
The curriculum is divided into **8 primary Learning Areas**, each representing a major field of study. 

> [!NOTE]
> The local dataset (`ac_v9_complete.json`) includes 7 of these areas, excluding *Languages* as per the mapping specification.

| Learning Area | Key Focus / Subjects |
| :--- | :--- |
| **English** | Language, Literature, and Literacy. |
| **Mathematics** | Number, Algebra, Measurement, Space, Statistics, and Probability. |
| **Science** | Science Understanding, Inquiry Skills, and Science as a Human Endeavour. |
| **HASS** | Humanities and Social Sciences (History, Geography, Civics, Economics). |
| **Technologies** | Digital Technologies and Design & Technologies. |
| **Health & PE** | Personal/Social Health and Movement/Physical Activity. |
| **The Arts** | Dance, Drama, Media Arts, Music, and Visual Arts. |
| **Languages** | Learning of various world languages (e.g., Chinese, French, Japanese). |

---

## 2. Mid-Level: Strands and Sub-strands
Each Learning Area is structured into **Strands**, which are further refined into **Sub-strands**.

### English Example:
- **Strand:** Language
  - **Sub-strand:** Language variation and change
  - **Sub-strand:** Expressing and developing ideas

### HASS Example:
For Foundation to Year 6, HASS is treated as a single subject, but for Years 7–10, it branches into specific subjects:
- **Subjects:** History, Geography, Civics and Citizenship, Economics and Business.
- **Strands:** Knowledge and Understanding, Inquiry and Skills.

---

## 3. Ground-Level: Content Descriptors
These are the specific teaching requirements that teachers must address. Each content descriptor includes:
- **AC Code:** A unique identifier (e.g., `AC9M1N01`).
- **Year Level:** The targeted grade (e.g., `Year 1`).
- **Text:** The full instructional requirement.

---

## 4. Year Level and Banding System
The curriculum covers **Foundation to Year 10 (F–10)**. 

### Annual vs. Banded
- **Foundation Level**: Always treated as a **single year level** across all Learning Areas.
- **Annual Learning Areas**: English, Mathematics, and Science have specific content descriptions for every single year level (1, 2, 3, etc.).
- **Banded Learning Areas**: The Arts, Technologies, Health & PE, and Languages are organised into **two-year bands** from Year 1 onwards (e.g., Years 1–2, 3–4, 5–6, 7–8, 9–10). This acknowledges that student development in these fields often occurs across longer cycles.

---

## 5. Cross-Curriculum Priorities & General Capabilities
Beyond the Learning Areas, the curriculum integrates:
- **General Capabilities:** Critical thinking, Digital literacy, Ethical understanding, etc.
- **Cross-Curriculum Priorities:** Aboriginal and Torres Strait Islander Histories and Cultures, Asia and Australia’s Engagement with Asia, and Sustainability.

---

## 6. Technical Data Structure (`ac_v9_complete.json`)

For developers or AI agents interacting with the curriculum programmatically, the data is stored in a structured JSON format. 

### JSON Hierarchy
The actual curriculum payload is located under the `example.curriculum` path:

```text
root
└── example
    └── curriculum
        ├── version ("9.0")
        ├── last_updated (e.g., "2026-02-11")
        └── learning_areas [Array]
            └── learning_area
                ├── id (e.g., "english")
                ├── name ("English")
                └── strands [Array]
                    └── strand
                        ├── id (e.g., "language")
                        ├── name ("Language")
                        ├── has_sub_strands (boolean)
                        ├── sub_strands [Array, optional]
                        └── content_descriptors [Array]
                            └── descriptor
                                ├── code ("AC9E1LA01")
                                ├── year_level ("1")
                                └── text ("full description...")
```

### Key Retrieval Fields
- **`learning_areas[].id`**: Use these lowercase IDs (e.g., `mathematics`, `science`) to filter the primary dataset.
- **`strands[].id`**: Secondary filter for specific subjects or domains.
- **`content_descriptors[].code`**: The unique primary key for every teaching requirement.
- **`content_descriptors[].year_level`**: Note that this can be a single year (`"6"`) or a band (`"5-6"`).

### Recommended Retrieval Tool
To avoid manual parsing of the 10,000+ line JSON file, use the built-in query utility:
```powershell
python .agent/skills/curriculum-master/scripts/query_curriculum.py --learning_area english --year_level 3 --format text
```

> [!TIP]
> When searching for a specific Year level, always account for banded descriptors. For example, a search for **Year 5** should include both `"year_level": "5"` and `"year_level": "5-6"`.
