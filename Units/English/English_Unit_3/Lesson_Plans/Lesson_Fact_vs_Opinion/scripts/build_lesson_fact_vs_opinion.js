const fs = require('fs');
const path = require('path');
const { Document, Packer, Paragraph, TextRun, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType } = require('docx');

const THEME = { navy: '112d4e', orange: 'f96d00', white: 'f9f7f7', blue: '3f72af', textDark: '333333', grey: '7f8c8d', border: 'cccccc' };
const TEMPLATE_PATH = 'c:\\Users\\dsuth\\Documents\\Joshua\\.agent\\skills\\lesson-creator\\assets\\presentation_template.html';

// Target directory paths
const lessonDir = path.join(__dirname, '..');
const planPath = path.join(lessonDir, 'Lesson_Fact_vs_Opinion_Plan.md');
const handoutPath = path.join(lessonDir, 'Lesson_Fact_vs_Opinion_Handout.docx');
const lucasWorksheetPath = path.join(lessonDir, 'Lesson_Fact_vs_Opinion_Worksheet_Lucas.docx');
const slidesPath = path.join(lessonDir, 'Lesson_Fact_vs_Opinion_Presentation.html');
const assessmentPath = path.join(lessonDir, 'Lesson_Fact_vs_Opinion_Assessment.docx');

// Create directories if they don't exist
fs.mkdirSync(path.join(lessonDir, 'scripts'), { recursive: true });

// Helper to define table borders for DOCX
const tableBorder = { style: BorderStyle.SINGLE, size: 1, color: THEME.border };
const cellBorders = { top: tableBorder, bottom: tableBorder, left: tableBorder, right: tableBorder };

// Robust save helper to handle EBUSY locks gracefully
function saveDocx(filename, buffer, label) {
  try {
    fs.writeFileSync(filename, buffer);
    console.log(`✅ ${label} generated: ${path.basename(filename)}`);
  } catch (err) {
    if (err.code === 'EBUSY') {
      console.warn(`⚠️ WARNING: Could not write ${path.basename(filename)} because it is locked (likely open in Word). Close the file and re-run the build script to update it.`);
    } else {
      throw err;
    }
  }
}

// --- 1. GENERATE LESSON PLAN (MARKDOWN) ---
function buildLessonPlan() {
  const planContent = `---
title: "Fact versus Opinion in Berani"
yearLevel: "Year 5 & 6"
learningArea: "English"
duration: "60 Minutes"
curriculumLinks:
  - Year 5 (AC9E5LA02): "Understand how to move beyond making bare assertions by taking account of differing ideas or opinions and authoritative sources."
  - Year 6 (AC9E6LA02): "Understand the uses of objective and subjective language, and identify bias."
---

### Pedagogical Contemplation

1. **Cognitive Goal**: Students are practicing the cognitive skill of distinguishing between objective, verifiable facts and subjective, personal opinions. They must then apply this understanding to analyze how persuasive writers blend both to build convincing arguments without making bare assertions.
2. **Interactive Alignment**: A digital **Two-Column Sort** slide is the optimal interactive mode because it forces students to actively categorize quotes from the novel, committing to a structural division (Fact vs. Opinion) and immediate visual verification.
3. **Surfacing Student Thinking**: Before cards are placed digitally, the teacher implements the physical whiteboard protocol (students write 'F' or 'O' on mini-whiteboards). This ensures 100% participation and instant visual feedback for the teacher on student accuracy.
4. **Pedagogical vs. Engagement Goal**: The pedagogical goal is to develop critical evaluation of text claims (distinguishing proof from preference). The engagement goal is the interactive sorting game and the collaborative group review of character bias.

---

### Interactive Design Thinking Matrix

| Core Concept / Learning Moment | Cognitive Demand | Best Interactive Mode | Pedagogical Rationale (Why & How it surfaces thinking) | Scaffolding Hint (Tier 2) | Placement in Lesson |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Distinguishing Fact vs. Opinion** | Analytical sorting & classification | Two-Column Sort | Evaluates whether students can classify quotes from Chapters 1-3 of *Berani*, forcing distinction between provable events and subjective feelings. | *“Hint: Ask yourself, can this statement be proven true with evidence or data, or does it express a feeling?”* | Guided Practice (Pre-CFU) |
| **Persuasive Balance** | Critical evaluation & reasoning | Rank Order / Scale | Groups rank the persuasiveness of arguments from the text based on their balance of factual evidence and emotional appeal. | *“Hint: Look at Malia's arguments. How does she use the 97% DNA fact to support her emotional appeal?”* | Independent Practice (Writing) |

---

### Learning Intentions

* **We are learning to**: Distinguish between objective facts and subjective opinions within persuasive and narrative texts.
* **So that we can**: Combine verifiable facts and compelling opinions to build strong, structured persuasive arguments that avoid bare assertions.
* **Success Criteria (Year 5)**:
  * [ ] I can identify facts and opinions in *Berani* Chapters 1–3.
  * [ ] I can classify quotes from a text and justify my choices.
  * [ ] I can write a short persuasive paragraph that includes both facts (from research/sources) and opinions.
* **Success Criteria (Year 6)**:
  * [ ] I can identify facts, opinions, and trace potential bias in character statements.
  * [ ] I can explain the difference between objective and subjective language choices.
  * [ ] I can write a cohesive argument that handles counterarguments by disproving opposing opinions with facts.

---

### Sequential Lesson Flow (60 Minutes)

#### 1. Warm-Up: Fact or Opinion Quickfire (10 Minutes)
* **Intro:** Display Slide 2. Give definitions:
  * **Fact**: A statement that can be proven true or false with evidence, measurements, or observation (e.g. "Orangutans share nearly 97% of our DNA").
  * **Opinion**: A personal feeling, belief, value, or moral judgment that cannot be proven (e.g. "Stegodons would make the best family pets").
* **Practice:** Read general statements. Students write 'F' (Fact) or 'O' (Opinion) on their mini-whiteboards and hold them up on the count of three.
* **CFU:** Clarify common errors (e.g. if a fact is false, it is still a factual claim, whereas an opinion is an interpretation).

#### 2. Explicit Instruction: Persistent Persuasion in *Berani* (15 Minutes)
* **Explain:** Show Slide 3. Good persuasive writers do not rely on "bare assertions" (statements with no backing). They start with a strong opinion (their thesis) but support it with objective facts from authoritative sources.
* **Examine Chapter 1 (Malia):**
  * *Fact:* "Prehistoric dwarf elephants, called stegodons, lived at the same time as early humans." (Verifiable science).
  * *Opinion/Subjective:* "I take a deep breath... The girl in the mirror stares back... but the girl inside quivers." (Emotional state/Narrator's feelings).
* **Examine Chapter 2 (Ari):**
  * *Fact:* "Warung Malang is my uncle's restaurant. He started it selling sop buntut." (Provable details).
  * *Opinion/Bias:* "Uncle says she (Ginger Juice) is lucky he got her... she is safe... but she is also in a cage." (Uncle Kus's opinion represents economic bias; Ari's perspective holds the opinion that it is a betrayal of a friend).
* **Examine Chapter 3 (Ginger Juice):**
  * *Fact:* "Fat raindrops tap, tap, tap on fingers." (Sensory fact).
  * *Opinion/Subjective:* "Small human is skinny like mongoose. I smell his fear." (Ginger Juice's subjective observation and interpretation).

#### 3. Guided Practice: Interactive Quote Sort (15 Minutes)
* **Activity:** Show Slide 4. Use the Two-Column Sort slide containing 8 quotes from Chapters 1–3 of *Berani*.
* **Protocol:**
  1. Present the first card: *"Fossil remains of stegodons have been found on islands in Indonesia."*
  2. Students write 'F' or 'O' on their physical whiteboards and hold them up.
  3. The teacher taps the card to select, then taps the correct zone (**Facts**) to place it.
  4. Repeat for all 8 cards. Review incorrect placements with the Tier 2 Scaffolding Hint.

#### 4. Independent Practice & Handout Work (15 Minutes)
* **Task:** Distribute **Lesson_Fact_vs_Opinion_Handout.docx** (or the separate **Lesson_Fact_vs_Opinion_Worksheet_Lucas.docx** for the Lucas ICP pathway).
* **Activity 1 (Standard):** Students independently classify 6 new quotes from *Berani* and write a brief justification.
* **Activity 2 (Standard):** Students write a persuasive paragraph (4–6 sentences) arguing why wild animals should not be kept in cages for restaurant entertainment:
  * Must include 2 facts from the text (e.g. orangutans live in treetops, share 97% DNA, or Ginger Juice has outgrown the cage door).
  * Must include 2 opinions expressing moral judgment.
  * Highlight facts in green and opinions in yellow.
* **Lucas ICP Pathway adjustments:** Completes the separate worksheet focusing on an 8-item checkbox quote classification table, a 4-question fill-in-the-blanks with a word bank, and 3 structured sentence finishers.

#### 5. Review & Exit Ticket (5 Minutes)
* **Activity:** Show Slide 6. Review the CFU multiple-choice questions. Students write their answers (A, B, C, or D) on mini-whiteboards to check for understanding.

---

### Differentiation Strategies

| Pathway | Accommodations & Tasks | Focus Descriptors |
| :--- | :--- | :--- |
| **Support** | • Provided with structural paragraph frame (PEEL) with sentence starters.<br>• Fact/opinion sorting includes fewer items with clear clue words (e.g. *believe, feel, should*). | AC9E5LA02 |
| **Lucas (ICP)** | • Completes the separate **Lesson_Fact_vs_Opinion_Worksheet_Lucas.docx** containing 8 targeted checkbox sorting items, 4 cloze blanks with word bank, and 3 sentence finishers.<br>• Aligned to Year 2 standards for simple sentences. | Year 2 Standard alignment |
| **Extend** | • Analyze how characters' cultural or financial motivations introduce **bias** (e.g. Uncle Kus's business vs. Ginger Juice's freedom).<br>• Write a rebuttal disproving an opposing opinion with a verifiable fact. | AC9E6LA02 |
| **Reluctant Readers** | • Text extracts are printed in larger, double-spaced font on the handout.<br>• Key vocabulary terms are pre-defined in a word bank. | AC9E5LY04 |
`;
  fs.writeFileSync(planPath, planContent, 'utf8');
  console.log(`✅ Lesson Plan generated: ${path.basename(planPath)}`);
}

// --- 2. GENERATE STUDENT HANDOUT (DOCX) ---
async function buildHandout() {
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: "Arial", size: 22, color: THEME.textDark }
        }
      }
    },
    sections: [{
      properties: {
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } // 1 inch margins
      },
      children: [
        // Title Block
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [
            new TextRun({ text: "ENGLISH UNIT 3 | LESSON HANDOUT", bold: true, size: 24, color: THEME.navy }),
            new TextRun({ text: "\nFact versus Opinion in Berani (Chapters 1–3)", bold: true, size: 28, color: THEME.orange })
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { after: 240 },
          children: [
            new TextRun({ text: "Name: ________________________   Class: _________   Date: _________", italic: true, size: 20 })
          ]
        }),
        
        // Section 1: Definitions
        new Paragraph({
          spacing: { before: 200, after: 120 },
          children: [new TextRun({ text: "1. Core Concepts", bold: true, size: 22, color: THEME.navy })]
        }),
        new Paragraph({
          spacing: { after: 120 },
          children: [
            new TextRun({ text: "• Fact: ", bold: true }),
            new TextRun({ text: "A statement that can be proven true or false with objective evidence, measurement, or research. Facts do not change based on who says them." })
          ]
        }),
        new Paragraph({
          spacing: { after: 240 },
          children: [
            new TextRun({ text: "• Opinion: ", bold: true }),
            new TextRun({ text: "A statement of personal belief, feeling, value judgment, or moral stance. Opinions can be argued, but they cannot be proven scientifically." })
          ]
        }),

        // Section 2: Quote Classification Table
        new Paragraph({
          spacing: { before: 200, after: 120 },
          children: [new TextRun({ text: "2. Quote Classification: Fact or Opinion?", bold: true, size: 22, color: THEME.navy })]
        }),
        new Paragraph({
          spacing: { after: 180 },
          children: [new TextRun({ text: "Read the following quotes from the first three chapters of Berani. Classify each as a Fact (F) or Opinion (O) and write a brief explanation justifying your choice.", italic: true })]
        }),

        // Table
        new Table({
          columnWidths: [4500, 1500, 3500],
          rows: [
            // Header Row
            new TableRow({
              tableHeader: true,
              children: [
                new TableCell({ borders: cellBorders, shading: { fill: "D5E8F0" }, children: [new Paragraph({ children: [new TextRun({ text: "Quote from Berani", bold: true, size: 18 })] })] }),
                new TableCell({ borders: cellBorders, shading: { fill: "D5E8F0" }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "F / O", bold: true, size: 18 })] })] }),
                new TableCell({ borders: cellBorders, shading: { fill: "D5E8F0" }, children: [new Paragraph({ children: [new TextRun({ text: "Justification (Explain why)", bold: true, size: 18 })] })] })
              ]
            }),
            // Row 1
            new TableRow({
              children: [
                new TableCell({ borders: cellBorders, children: [new Paragraph({ spacing: { before: 80, after: 80 }, children: [new TextRun({ text: "\"Prehistoric dwarf elephants, called stegodons, have been found on many islands here in Indonesia.\"", italic: true, size: 18 })] })] }),
                new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [] })] }),
                new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [] })] })
              ]
            }),
            // Row 2
            new TableRow({
              children: [
                new TableCell({ borders: cellBorders, children: [new Paragraph({ spacing: { before: 80, after: 80 }, children: [new TextRun({ text: "\"Imagine having a mini-elephant as your family pet? It only seems impossible because you never saw them.\"", italic: true, size: 18 })] })] }),
                new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [] })] }),
                new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [] })] })
              ]
            }),
            // Row 3
            new TableRow({
              children: [
                new TableCell({ borders: cellBorders, children: [new Paragraph({ spacing: { before: 80, after: 80 }, children: [new TextRun({ text: "\"Warung Malang is my uncle's restaurant. He started it when he was a skinny young man with a full head of hair.\"", italic: true, size: 18 })] })] }),
                new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [] })] }),
                new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [] })] })
              ]
            }),
            // Row 4
            new TableRow({
              children: [
                new TableCell({ borders: cellBorders, children: [new Paragraph({ spacing: { before: 80, after: 80 }, children: [new TextRun({ text: "\"Uncle says that she is lucky he got her when she was a baby, after her mother was killed.\"", italic: true, size: 18 })] })] }),
                new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [] })] }),
                new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [] })] })
              ]
            }),
            // Row 5
            new TableRow({
              children: [
                new TableCell({ borders: cellBorders, children: [new Paragraph({ spacing: { before: 80, after: 80 }, children: [new TextRun({ text: "\"Ginger Juice is an orangutan... she lives in the cage... she can no longer fit through the door.\"", italic: true, size: 18 })] })] }),
                new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [] })] }),
                new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [] })] })
              ]
            }),
            // Row 6
            new TableRow({
              children: [
                new TableCell({ borders: cellBorders, children: [new Paragraph({ spacing: { before: 80, after: 80 }, children: [new TextRun({ text: "\"The small human cleans cage now. I smell his fear. He has rings over eyes like a slow loris.\"", italic: true, size: 18 })] })] }),
                new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [] })] }),
                new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [] })] })
              ]
            })
          ]
        }),

        // Section 3: Writing Application
        new Paragraph({
          spacing: { before: 300, after: 120 },
          children: [new TextRun({ text: "3. Writing Application: Balanced Persuasion", bold: true, size: 22, color: THEME.navy })]
        }),
        new Paragraph({
          spacing: { after: 120 },
          children: [new TextRun({ text: "Task: Write a short paragraph (4–6 sentences) persuading readers that wild animals (like Ginger Juice) should not be kept in cages for restaurant entertainment. You must include at least two facts (e.g. facts about orangutan strength, habitats, or cage details) and two opinions expressing your moral perspective. Do not make bare assertions.", size: 20 })]
        }),
        new Paragraph({
          spacing: { after: 360 },
          children: [
            new TextRun({ text: "Highlight Challenge: Underline your facts with a green pen, and highlight your opinions in yellow.", italic: true, size: 18, color: THEME.grey })
          ]
        }),
        // Blank writing lines
        new Paragraph({ spacing: { before: 180, after: 180 }, children: [new TextRun({ text: "__________________________________________________________________________________________" })] }),
        new Paragraph({ spacing: { before: 180, after: 180 }, children: [new TextRun({ text: "__________________________________________________________________________________________" })] }),
        new Paragraph({ spacing: { before: 180, after: 180 }, children: [new TextRun({ text: "__________________________________________________________________________________________" })] }),
        new Paragraph({ spacing: { before: 180, after: 180 }, children: [new TextRun({ text: "__________________________________________________________________________________________" })] }),
        new Paragraph({ spacing: { before: 180, after: 180 }, children: [new TextRun({ text: "__________________________________________________________________________________________" })] })
      ]
    }]
  });

  const buffer = await Packer.toBuffer(doc);
  saveDocx(handoutPath, buffer, "Handout");
}

// --- 2b. GENERATE DEDICATED LUCAS WORKSHEET ---
async function buildLucasWorksheet() {
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: "Arial", size: 22, color: THEME.textDark }
        }
      }
    },
    sections: [{
      properties: {
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      },
      children: [
        // Title Block
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [
            new TextRun({ text: "ENGLISH UNIT 3 | SPECIAL WORKSHEET (LUCAS PATHWAY)", bold: true, size: 22, color: THEME.navy }),
            new TextRun({ text: "\nFact versus Opinion in Berani (Chapters 1–3)", bold: true, size: 26, color: THEME.orange })
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { after: 240 },
          children: [
            new TextRun({ text: "Name: ________________________   Class: Year 5 (ICP)   Date: _________", italic: true, size: 20 })
          ]
        }),

        // Activity 1: Fact vs Opinion sort boxes
        new Paragraph({
          spacing: { before: 150, after: 120 },
          children: [
            new TextRun({ text: "Activity 1: Fact or Opinion Sort", bold: true, size: 22, color: THEME.navy }),
            new TextRun({ text: "\nRead each statement below. Put a tick (✔) in the correct column.", italic: true, size: 18, color: THEME.grey })
          ]
        }),

        // 8-item Table
        new Table({
          columnWidths: [5500, 1200, 1300],
          rows: [
            // Header Row
            new TableRow({
              tableHeader: true,
              children: [
                new TableCell({ borders: cellBorders, shading: { fill: "D5E8F0" }, children: [new Paragraph({ children: [new TextRun({ text: "Statement from Berani", bold: true, size: 18 })] })] }),
                new TableCell({ borders: cellBorders, shading: { fill: "D5E8F0" }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Fact", bold: true, size: 18 })] })] }),
                new TableCell({ borders: cellBorders, shading: { fill: "D5E8F0" }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Opinion", bold: true, size: 18 })] })] })
              ]
            }),
            // 1
            new TableRow({
              children: [
                new TableCell({ borders: cellBorders, children: [new Paragraph({ spacing: { before: 60, after: 60 }, children: [new TextRun({ text: "Ginger Juice is an orangutan.", size: 18 })] })] }),
                new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "[   ]" })] })] }),
                new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "[   ]" })] })] })
              ]
            }),
            // 2
            new TableRow({
              children: [
                new TableCell({ borders: cellBorders, children: [new Paragraph({ spacing: { before: 60, after: 60 }, children: [new TextRun({ text: "The cage is very sad and small.", size: 18 })] })] }),
                new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "[   ]" })] })] }),
                new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "[   ]" })] })] })
              ]
            }),
            // 3
            new TableRow({
              children: [
                new TableCell({ borders: cellBorders, children: [new Paragraph({ spacing: { before: 60, after: 60 }, children: [new TextRun({ text: "Ari works at Warung Malang restaurant.", size: 18 })] })] }),
                new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "[   ]" })] })] }),
                new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "[   ]" })] })] })
              ]
            }),
            // 4
            new TableRow({
              children: [
                new TableCell({ borders: cellBorders, children: [new Paragraph({ spacing: { before: 60, after: 60 }, children: [new TextRun({ text: "Uncle Kus makes the best soup in Indonesia.", size: 18 })] })] }),
                new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "[   ]" })] })] }),
                new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "[   ]" })] })] })
              ]
            }),
            // 5
            new TableRow({
              children: [
                new TableCell({ borders: cellBorders, children: [new Paragraph({ spacing: { before: 60, after: 60 }, children: [new TextRun({ text: "Stegodons were prehistoric dwarf elephants.", size: 18 })] })] }),
                new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "[   ]" })] })] }),
                new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "[   ]" })] })] })
              ]
            }),
            // 6
            new TableRow({
              children: [
                new TableCell({ borders: cellBorders, children: [new Paragraph({ spacing: { before: 60, after: 60 }, children: [new TextRun({ text: "Mini-elephants would make the best pets.", size: 18 })] })] }),
                new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "[   ]" })] })] }),
                new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "[   ]" })] })] })
              ]
            }),
            // 7
            new TableRow({
              children: [
                new TableCell({ borders: cellBorders, children: [new Paragraph({ spacing: { before: 60, after: 60 }, children: [new TextRun({ text: "Malia is a Year 5 student.", size: 18 })] })] }),
                new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "[   ]" })] })] }),
                new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "[   ]" })] })] })
              ]
            }),
            // 8
            new TableRow({
              children: [
                new TableCell({ borders: cellBorders, children: [new Paragraph({ spacing: { before: 60, after: 60 }, children: [new TextRun({ text: "Classmates should always listen to Malia.", size: 18 })] })] }),
                new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "[   ]" })] })] }),
                new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "[   ]" })] })] })
              ]
            })
          ]
        }),

        // Activity 2: Fill in the Blanks
        new Paragraph({
          spacing: { before: 250, after: 120 },
          children: [new TextRun({ text: "Activity 2: Fill in the Blanks", bold: true, size: 22, color: THEME.navy })]
        }),
        new Paragraph({
          spacing: { after: 120 },
          children: [
            new TextRun({ text: "Word Bank:  ", bold: true }),
            new TextRun({ text: "cage   /   sad   /   forest   /   elephants", italic: true })
          ]
        }),
        new Paragraph({
          spacing: { before: 80, after: 80 },
          children: [new TextRun({ text: "1. Ginger Juice is an orangutan kept in a ___________________ (Fact)." })]
        }),
        new Paragraph({
          spacing: { before: 80, after: 80 },
          children: [new TextRun({ text: "2. Living in a cage makes the orangutan feel ___________________ (Opinion)." })]
        }),
        new Paragraph({
          spacing: { before: 80, after: 80 },
          children: [new TextRun({ text: "3. Fossil remains of stegodons show they were dwarf ___________________ (Fact)." })]
        }),
        new Paragraph({
          spacing: { before: 80, after: 80 },
          children: [new TextRun({ text: "4. In my opinion, orangutans should live free in the ___________________ (Opinion)." })]
        }),

        // Activity 3: Sentence Finishers
        new Paragraph({
          spacing: { before: 250, after: 120 },
          children: [new TextRun({ text: "Activity 3: Complete the Sentences", bold: true, size: 22, color: THEME.navy })]
        }),
        new Paragraph({
          spacing: { after: 120 },
          children: [new TextRun({ text: "Use your own words to finish these sentences:", italic: true })]
        }),
        new Paragraph({
          spacing: { before: 100, after: 100 },
          children: [new TextRun({ text: "1. A fact about Ginger Juice is that she lives ____________________________________________." })]
        }),
        new Paragraph({
          spacing: { before: 100, after: 100 },
          children: [new TextRun({ text: "2. I think cages are bad because they are ______________________________________________." })]
        }),
        new Paragraph({
          spacing: { before: 100, after: 100 },
          children: [new TextRun({ text: "3. In my opinion, wild animals should _________________________________________________." })]
        })
      ]
    }]
  });

  const buffer = await Packer.toBuffer(doc);
  saveDocx(lucasWorksheetPath, buffer, "Lucas Worksheet");
}

// --- 3. GENERATE INTERACTIVE PRESENTATION (HTML) ---
function buildSlides() {
  if (!fs.existsSync(TEMPLATE_PATH)) {
    throw new Error(`Presentation template wrapper not found at: ${TEMPLATE_PATH}`);
  }
  
  const templateContent = fs.readFileSync(TEMPLATE_PATH, 'utf8');

  // Slides data structure
  const slidesData = [
    {
      title: "Fact versus Opinion",
      subtitle: "Persuasion and Truth in *Berani* (Chapters 1–3)",
      theme: "dark",
      standardHtml: `
        <div style="margin-top: 40px; color: var(--text-light); text-align: center;">
          <p style="font-size: 24px; margin-bottom: 30px;">Learning Intention: Distinguish between objective facts and subjective opinions within persuasive texts.</p>
          <div style="display: flex; gap: 40px; justify-content: center; margin-top: 40px;">
            <div style="background: rgba(255,255,255,0.05); padding: 25px; border-radius: 8px; border: 1px dashed var(--blue); width: 280px;">
              <h3 style="color: var(--orange); font-size: 24px; margin-bottom: 10px;">Year 5</h3>
              <p style="font-size: 16px;">Move beyond bare assertions by using authoritative evidence.</p>
            </div>
            <div style="background: rgba(255,255,255,0.05); padding: 25px; border-radius: 8px; border: 1px dashed var(--blue); width: 280px;">
              <h3 style="color: var(--orange); font-size: 24px; margin-bottom: 10px;">Year 6</h3>
              <p style="font-size: 16px;">Identify objective/subjective language and locate bias.</p>
            </div>
          </div>
        </div>
      `,
      teacherNotes: `
        <p><strong>Goal:</strong> Set the context of the lesson.</p>
        <p>Explain that today we are separating what can be proven from what is felt, and learning how combining both makes writing persuasive without making bare assertions.</p>
      `
    },
    {
      title: "Facts vs. Opinions: The Rules",
      theme: "light",
      standardHtml: `
        <div class="grid-2" style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 30px;">
          <div style="background: #eef2f7; padding: 30px; border-left: 6px solid var(--blue); border-radius: 4px; box-shadow: var(--shadow-sm);">
            <h3 style="color: var(--navy); font-size: 28px; margin-bottom: 15px; font-family:'Outfit';">What is a Fact?</h3>
            <p style="font-size: 20px; line-height: 1.6; margin-bottom: 15px;">A statement that can be <strong>proven true or false</strong> using evidence, measurement, scientific research, or observation.</p>
            <ul style="font-size: 18px; margin-left: 25px; line-height: 1.8;">
              <li>Does not change based on who says it.</li>
              <li>"Fossil remains of stegodons have been found on islands here in Indonesia."</li>
            </ul>
          </div>
          <div style="background: #fdf5ef; padding: 30px; border-left: 6px solid var(--orange); border-radius: 4px; box-shadow: var(--shadow-sm);">
            <h3 style="color: var(--navy); font-size: 28px; margin-bottom: 15px; font-family:'Outfit';">What is an Opinion?</h3>
            <p style="font-size: 20px; line-height: 1.6; margin-bottom: 15px;">A statement of <strong>personal belief, feeling, value, or moral judgment</strong> that cannot be proven scientifically.</p>
            <ul style="font-size: 18px; margin-left: 25px; line-height: 1.8;">
              <li>Can change from person to person.</li>
              <li>"A mini-elephant would make the best family pet."</li>
            </ul>
          </div>
        </div>
        <div style="margin-top: 35px; background: #fff5e6; border: 1px solid var(--orange); padding: 15px 25px; border-radius: 6px; text-align: center; font-size: 18px;">
          <strong>Critical Rule:</strong> Opinions explain <i>why we care</i>, but facts provide the <i>proof</i>. Without facts, your argument is just a <strong>bare assertion</strong>.
        </div>
      `,
      teacherNotes: `
        <p>Have students brainstorm a quick general fact and opinion. Write them on the whiteboard to demonstrate.</p>
        <p>Emphasise: "The sky is blue" is a fact. "Blue is the prettiest colour" is an opinion.</p>
      `
    },
    {
      title: "Guided Practice: Exploring *Berani*",
      theme: "light",
      standardHtml: `
        <p style="font-size: 20px; margin-bottom: 20px;">Let's examine how the characters in the first three chapters use both facts and opinions:</p>
        <div style="display: flex; flex-direction: column; gap: 20px; margin-top: 10px;">
          <div style="background: white; border: 1px solid #e2e8f0; padding: 15px 20px; border-radius: 6px; box-shadow: var(--shadow-sm);">
            <strong style="color: var(--orange); font-size: 18px;">Malia's Chapter (Persuasive Activism)</strong>
            <p style="font-size: 18px; margin-top: 8px; font-style: italic;">"A creature that shares nearly 97 per cent of our human DNA... is living in the treetops."</p>
            <p style="font-size: 16px; margin-top: 6px; color: #555;">👉 <strong>Fact:</strong> DNA percentage is scientifically verifiable. Malia uses this fact to build authority before presenting her opinion that saving them is a duty.</p>
          </div>
          <div style="background: white; border: 1px solid #e2e8f0; padding: 15px 20px; border-radius: 6px; box-shadow: var(--shadow-sm);">
            <strong style="color: var(--blue); font-size: 18px;">Ari's Chapter (Understanding Bias)</strong>
            <p style="font-size: 18px; margin-top: 8px; font-style: italic;">"Uncle says that she is lucky he got her when she was a baby... safe from poachers."</p>
            <p style="font-size: 16px; margin-top: 6px; color: #555;">👉 <strong>Opinion:</strong> Uncle Kus believes the cage is good and she is "lucky" (reflects his financial bias as restaurant owner). Ari sees the cage and holds the opinion that she is trapped.</p>
          </div>
          <div style="background: white; border: 1px solid #e2e8f0; padding: 15px 20px; border-radius: 6px; box-shadow: var(--shadow-sm);">
            <strong style="color: #2e7d32; font-size: 18px;">Ginger Juice's Chapter (Sensory Voice)</strong>
            <p style="font-size: 18px; margin-top: 8px; font-style: italic;">"Fat raindrops tap, tap, tap on fingers. The small male human comes to sweep cage."</p>
            <p style="font-size: 16px; margin-top: 6px; color: #555;">👉 <strong>Subjective Observation:</strong> Ginger Juice describes Ari as "mongoose" or "slow loris". This is her subjective perspective, mapping animal imagery to human features.</p>
          </div>
        </div>
      `,
      teacherNotes: `
        <p>Point out to students that Ari's uncle's opinion "she is lucky" is a way of hiding the fact that she is in a small cage.</p>
        <p>Ask: "How does this create bias?" (The uncle uses his opinion to justify a business interest).</p>
      `
    },
    {
      title: "Interactive: Two-Column Quote Sort",
      theme: "light",
      standardHtml: `
        <div class="cfu-badge" style="position: absolute; top: 15px; right: 75px; background: var(--orange); color: white; padding: 5px 12px; border-radius: 12px; font-size: 14px; font-weight: bold; font-family:'Outfit';">CFU: Whiteboard Protocol</div>
        <p style="font-size: 18px; margin-bottom: 20px; text-align: center;">Write <strong>'Fact'</strong> or <strong>'Opinion'</strong> on your whiteboard, then hold it up! Tap the quote, then tap the correct zone.</p>
        
        <div style="display: flex; gap: 30px; height: 380px; margin-top: 10px;">
          <!-- Left Zone: Facts -->
          <div class="sort-zone" id="zone-facts" data-cat="facts" style="flex: 1; background: #eef2f7; border: 2px dashed var(--blue); border-radius: 8px; padding: 15px; display: flex; flex-direction: column; gap: 10px; overflow-y: auto;">
            <h3 style="text-align: center; color: var(--blue); font-family:'Outfit'; border-bottom: 2px solid var(--blue); padding-bottom: 8px; margin-bottom: 5px;">FACTS (Objective)</h3>
          </div>
          
          <!-- Middle Deck: Quotes -->
          <div style="width: 320px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #fdfdfd; border: 1px solid #ddd; border-radius: 8px; padding: 15px; box-shadow: var(--shadow-sm);">
            <h4 style="margin-bottom: 15px; color: var(--navy); font-family:'Outfit'; font-size: 16px;">Active Quote Deck</h4>
            <div class="sort-deck" id="quoteDeck" style="position: relative; width: 100%; height: 180px; display: flex; align-items: center; justify-content: center;">
              
              <div class="sort-card" data-correct="facts" style="position: absolute; padding: 15px; background: white; border: 2px solid #ddd; border-radius: 6px; box-shadow: var(--shadow-md); font-size: 14px; font-style: italic; cursor: pointer; text-align: center; width: 90%; transition: all 0.3s ease; color: var(--navy);">
                "Fossil remains of stegodons have been found on many Indonesian islands."
              </div>
              <div class="sort-card" data-correct="opinions" style="position: absolute; padding: 15px; background: white; border: 2px solid #ddd; border-radius: 6px; box-shadow: var(--shadow-md); font-size: 14px; font-style: italic; cursor: pointer; text-align: center; width: 90%; transition: all 0.3s ease; color: var(--navy); display: none;">
                "Imagine having a mini-elephant as your family pet? It would be wonderful."
              </div>
              <div class="sort-card" data-correct="facts" style="position: absolute; padding: 15px; background: white; border: 2px solid #ddd; border-radius: 6px; box-shadow: var(--shadow-md); font-size: 14px; font-style: italic; cursor: pointer; text-align: center; width: 90%; transition: all 0.3s ease; color: var(--navy); display: none;">
                "Warung Malang is my uncle's restaurant. He started it selling soup."
              </div>
              <div class="sort-card" data-correct="opinions" style="position: absolute; padding: 15px; background: white; border: 2px solid #ddd; border-radius: 6px; box-shadow: var(--shadow-md); font-size: 14px; font-style: italic; cursor: pointer; text-align: center; width: 90%; transition: all 0.3s ease; color: var(--navy); display: none;">
                "Uncle says she is lucky he got her, safe from poachers."
              </div>
              <div class="sort-card" data-correct="facts" style="position: absolute; padding: 15px; background: white; border: 2px solid #ddd; border-radius: 6px; box-shadow: var(--shadow-md); font-size: 14px; font-style: italic; cursor: pointer; text-align: center; width: 90%; transition: all 0.3s ease; color: var(--navy); display: none;">
                "Ginger juice lives in a cage... she can no longer fit through the door."
              </div>
              <div class="sort-card" data-correct="opinions" style="position: absolute; padding: 15px; background: white; border: 2px solid #ddd; border-radius: 6px; box-shadow: var(--shadow-md); font-size: 14px; font-style: italic; cursor: pointer; text-align: center; width: 90%; transition: all 0.3s ease; color: var(--navy); display: none;">
                "Small human is skinny like mongoose. I smell his fear."
              </div>
              <div class="sort-card" data-correct="opinions" style="position: absolute; padding: 15px; background: white; border: 2px solid #ddd; border-radius: 6px; box-shadow: var(--shadow-md); font-size: 14px; font-style: italic; cursor: pointer; text-align: center; width: 90%; transition: all 0.3s ease; color: var(--navy); display: none;">
                "Keeping orangutans as restaurant attractions is cruel and selfish."
              </div>
              <div class="sort-card" data-correct="facts" style="position: absolute; padding: 15px; background: white; border: 2px solid #ddd; border-radius: 6px; box-shadow: var(--shadow-md); font-size: 14px; font-style: italic; cursor: pointer; text-align: center; width: 90%; transition: all 0.3s ease; color: var(--navy); display: none;">
                "Orangutans share nearly 97 per cent of our human DNA."
              </div>
              
            </div>
            <div class="hint-box" style="margin-top: 15px; font-size: 13px; color: var(--red-error); font-style: italic; min-height: 20px; text-align: center;"></div>
            <button class="whiteboard-btn" id="checkAnswerBtn" style="margin-top: 10px; background: var(--navy); color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: bold;">Submit Placement</button>
          </div>
          
          <!-- Right Zone: Opinions -->
          <div class="sort-zone" id="zone-opinions" data-cat="opinions" style="flex: 1; background: #fdf5ef; border: 2px dashed var(--orange); border-radius: 8px; padding: 15px; display: flex; flex-direction: column; gap: 10px; overflow-y: auto;">
            <h3 style="text-align: center; color: var(--orange); font-family:'Outfit'; border-bottom: 2px solid var(--orange); padding-bottom: 8px; margin-bottom: 5px;">OPINIONS (Subjective)</h3>
          </div>
        </div>
        
        <script>
          document.addEventListener('DOMContentLoaded', () => {
            const cards = Array.from(document.querySelectorAll('.sort-card'));
            const zones = document.querySelectorAll('.sort-zone');
            const hintBox = document.querySelector('.hint-box');
            const submitBtn = document.getElementById('checkAnswerBtn');
            let activeCard = cards[0];
            let activeCardIndex = 0;
            let attempts = 0;
            
            // Mark initial active card
            activeCard.classList.add('selected');
            
            zones.forEach(zone => {
              zone.addEventListener('click', () => {
                if (!activeCard) return;
                
                // Clear active card from other zones
                if (activeCard.parentNode !== document.getElementById('quoteDeck')) {
                  activeCard.parentNode.removeChild(activeCard);
                }
                
                // Append card to clicked zone
                const cleanCard = activeCard.cloneNode(true);
                cleanCard.classList.remove('selected');
                cleanCard.style.position = 'static';
                cleanCard.style.width = '100%';
                cleanCard.style.margin = '5px 0';
                cleanCard.style.boxShadow = 'var(--shadow-sm)';
                zone.appendChild(cleanCard);
                
                // Hide current deck card representation
                activeCard.style.display = 'none';
                activeCard.dataset.placedIn = zone.dataset.cat;
                
                attempts = 0;
                hintBox.textContent = "";
                
                // Show next deck card
                activeCardIndex++;
                if (activeCardIndex < cards.length) {
                  activeCard = cards[activeCardIndex];
                  activeCard.style.display = 'block';
                  activeCard.classList.add('selected');
                } else {
                  activeCard = null;
                  submitBtn.textContent = "Check All Placements";
                }
              });
            });
            
            submitBtn.addEventListener('click', () => {
              let correctCount = 0;
              let totalPlaced = 0;
              
              // Validate all placements
              cards.forEach(card => {
                const correctCat = card.dataset.correct;
                const placedCat = card.dataset.placedIn;
                
                if (placedCat) {
                  totalPlaced++;
                  if (placedCat === correctCat) {
                    correctCount++;
                  }
                }
              });
              
              if (totalPlaced < cards.length) {
                hintBox.textContent = "Please place all " + cards.length + " cards first!";
                return;
              }
              
              if (correctCount === cards.length) {
                hintBox.style.color = "var(--green-success)";
                hintBox.textContent = "🎉 Excellent! All placements are correct.";
              } else {
                hintBox.style.color = "var(--red-error)";
                hintBox.textContent = "Keep trying! You got " + correctCount + " of " + cards.length + " correct.";
                attempts++;
                if (attempts >= 2) {
                  hintBox.textContent += " Hint: Provable facts have numbers/science; opinions have personal perspectives.";
                }
              }
            });
            
            // Standard show-answer override
            document.getElementById('slide-4').addEventListener('show-answer', () => {
              // Move all cards to correct zones
              cards.forEach(card => {
                const correctCat = card.dataset.correct;
                const targetZone = document.getElementById("zone-" + correctCat);
                
                // Check if card is already placed correctly
                if (card.parentNode === targetZone) return;
                
                // Remove from deck or other zone
                if (card.parentNode.classList.contains('sort-zone')) {
                  card.parentNode.removeChild(card);
                } else {
                  card.style.display = 'none';
                }
                
                const cleanCard = card.cloneNode(true);
                cleanCard.classList.remove('selected');
                cleanCard.style.position = 'static';
                cleanCard.style.width = '100%';
                cleanCard.style.margin = '5px 0';
                cleanCard.style.backgroundColor = '#e2f0d9';
                cleanCard.style.border = '2px solid var(--green-success)';
                targetZone.appendChild(cleanCard);
                card.dataset.placedIn = correctCat;
              });
              
              activeCard = null;
              hintBox.style.color = "var(--green-success)";
              hintBox.textContent = "Show Answer triggered: All cards correctly placed!";
            });
          });
        </script>
      `,
      teacherNotes: `
        <p><strong>Physical Whiteboard Protocol:</strong> Show slide. Do NOT let students click/tap immediately.</p>
        <p>For each quote, ask the class to write 'F' or 'O' and hold up their whiteboard. Check accuracy before calling a student to tap and place it on the screen.</p>
      `
    },
    {
      title: "Writing Task: Balanced Persuasion",
      theme: "light",
      standardHtml: `
        <div style="display: flex; gap: 30px; margin-top: 20px;">
          <div style="flex: 1.2;">
            <p style="font-size: 18px; margin-bottom: 15px; line-height:1.6;">Your written persuasive text needs to balance <strong>facts</strong> and <strong>opinions</strong>. Writing without facts creates <i>bare assertions</i>; writing without opinions has no passion.</p>
            <div style="background: white; border: 1px solid #cbd5e1; padding: 20px; border-radius: 6px;">
              <h4 style="color: var(--navy); font-family:'Outfit'; margin-bottom: 10px;">Writing Challenge:</h4>
              <p style="font-size: 16px; margin-bottom: 10px;">Write a short paragraph persuading readers that wild animals should not be kept in cages at restaurants.</p>
              <ul style="font-size: 15px; margin-left: 20px; line-height: 1.8;">
                <li>Include at least <strong>2 facts</strong> from Ginger Juice's chapters (strength, treetop nests, cage size).</li>
                <li>Include at least <strong>2 opinions</strong> expressing moral judgements.</li>
                <li>Underline your facts with a green pen, and highlight opinions in yellow.</li>
              </ul>
            </div>
          </div>
          <div style="flex: 0.8; background: #eef2f7; padding: 20px; border-radius: 6px; box-shadow: var(--shadow-sm);">
            <h4 style="color: var(--navy); font-family:'Outfit'; margin-bottom: 10px;">Writing Checklist:</h4>
            <div style="display: flex; flex-direction: column; gap: 10px; font-size: 15px;">
              <label><input type="checkbox" checked disabled> Hook/Opinion (Thesis)</label>
              <label><input type="checkbox" checked disabled> Fact 1 (Authoritative proof)</label>
              <label><input type="checkbox" checked disabled> Fact 2 (Detailed source)</label>
              <label><input type="checkbox" checked disabled> Moral opinion (Explanation)</label>
              <label><input type="checkbox" checked disabled> Linked conclusion</label>
            </div>
            <div style="margin-top: 20px; font-size: 13px; color: var(--navy); font-style: italic;">
              "Like a bridge connecting students to learning, the dog help remove emotional barriers..." - See Model Responses for styles.
            </div>
          </div>
        </div>
      `,
      teacherNotes: `
        <p>Walk around the room during the writing task. Check that students are not making bare assertions (e.g. "keeping animals is bad" without giving facts about orangutan needs).</p>
      `
    },
    {
      title: "Exit Ticket: Quick CFU",
      theme: "dark",
      standardHtml: `
        <div class="cfu-badge" style="position: absolute; top: 15px; right: 75px; background: var(--orange); color: white; padding: 5px 12px; border-radius: 12px; font-size: 14px; font-weight: bold; font-family:'Outfit';">Exit Ticket</div>
        <p style="font-size: 22px; margin-top: 30px; color: var(--text-light);">Write the correct letter (A, B, C, or D) on your whiteboard!</p>
        
        <div style="margin-top: 40px; text-align: left; max-width: 800px; margin-left: auto; margin-right: auto; background: rgba(255,255,255,0.05); padding: 30px; border-radius: 8px; border: 1px solid var(--blue);">
          <h3 style="color: var(--orange); font-size: 24px; margin-bottom: 20px;">Which of the following is a subjective OPINION?</h3>
          <div style="font-size: 20px; display: flex; flex-direction: column; gap: 15px;">
            <div><strong>A.</strong> Stegodons are fossil dwarf elephants found in Indonesia.</div>
            <div><strong>B.</strong> Orangutans share 97 per cent of our DNA.</div>
            <div><strong>C.</strong> Keeping Ginger Juice in a cage is a betrayal of a friend.</div>
            <div><strong>D.</strong> Warung Malang restaurant is owned by Ari's uncle.</div>
          </div>
          <button class="whiteboard-btn" id="revealExitTicketBtn" style="margin-top: 30px; background: var(--orange); color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 16px;">Reveal Correct Answer</button>
          <p id="exitTicketAnswer" style="margin-top: 20px; font-size: 20px; color: var(--white); font-weight: bold; display: none;">Correct Answer: C. This is Ari's subjective moral judgement. A, B, and D are verifiable facts.</p>
        </div>
        
        <script>
          document.addEventListener('DOMContentLoaded', () => {
            const btn = document.getElementById('revealExitTicketBtn');
            const ans = document.getElementById('exitTicketAnswer');
            btn.addEventListener('click', () => {
              ans.style.display = 'block';
            });
            
            document.getElementById('slide-6').addEventListener('show-answer', () => {
              ans.style.display = 'block';
            });
          });
        </script>
      `,
      teacherNotes: `
        <p>Formative check of the entire classroom. Check how many students held up 'C'.</p>
      `
    }
  ];

  let slidesHtml = '';
  
  slidesData.forEach((slide, idx) => {
    let slideClass = `slide theme-${slide.theme || 'light'}`;
    if (idx === 0) slideClass += ' active';
    
    let slideMarkup = `    <!-- SLIDE ${idx + 1}: ${slide.title} -->\n`;
    slideMarkup += `    <section class="${slideClass}" id="slide-${idx + 1}">\n`;
    
    if (slide.theme === 'dark') {
      slideMarkup += `      <div class="fade-in-up">\n        <h1>${slide.title}</h1>\n      </div>\n`;
      if (slide.subtitle) {
        slideMarkup += `      <div class="fade-in-up delay-1">\n        <p class="subtitle" style="font-size:26px; color:var(--text-light); margin-top:20px;">${slide.subtitle}</p>\n      </div>\n`;
      }
    } else {
      slideMarkup += `      <h2 class="slide-title fade-in-up">${slide.title}</h2>\n`;
    }
    
    slideMarkup += `      <div class="content fade-in-up delay-1">\n`;
    slideMarkup += `        <div>\n          ${slide.standardHtml}\n        </div>\n`;
    slideMarkup += `      </div>\n`;
    
    if (slide.teacherNotes) {
      slideMarkup += `      <div class="teacher-notes" style="display: none;">\n        ${slide.teacherNotes}\n      </div>\n`;
    }
    
    slideMarkup += `    </section>\n\n`;
    slidesHtml += slideMarkup;
  });
  
  const placeholder = '<!-- SLIDES GO HERE DURING DYNAMIC COMPILATION -->';
  let compiledContent = templateContent.replace(placeholder, slidesHtml);
  
  // Customise presentation title
  compiledContent = compiledContent.replace(/<title>.*<\/title>/, '<title>Lesson: Fact vs Opinion - Berani</title>');
  
  fs.writeFileSync(slidesPath, compiledContent, 'utf8');
  console.log(`✅ Interactive HTML Presentation generated: ${path.basename(slidesPath)}`);
}

// --- 4. GENERATE ASSESSMENT (DOCX) ---
async function buildAssessment() {
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: "Arial", size: 22, color: THEME.textDark }
        }
      }
    },
    sections: [{
      properties: {
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      },
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 300 },
          children: [
            new TextRun({ text: "MICROSOFT FORMS ASSESSMENT IMPORT", bold: true, size: 24, color: THEME.navy }),
            new TextRun({ text: "\nFact versus Opinion Quiz - Berani Study (Chapters 1–3)", bold: true, size: 26, color: THEME.orange })
          ]
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "Copy and paste this document directly into Microsoft Forms using the Quick Import feature.", italic: true, color: THEME.grey })]
        }),

        // Q1
        new Paragraph({ spacing: { before: 180, after: 80 }, children: [new TextRun({ text: "1. Which of the following is a FACT from Malia's first chapter in Berani?", bold: true })] }),
        new Paragraph({ children: [new TextRun({ text: "A. Miniature elephants would make the best family pets." })] }),
        new Paragraph({ children: [new TextRun({ text: "B. Deforestation is the most terrible thing humans are doing in Indonesia." })] }),
        new Paragraph({ children: [new TextRun({ text: "C. Fossil stegodon remains have been found on many Indonesian islands." })] }),
        new Paragraph({ children: [new TextRun({ text: "D. Saving orangutans is a simple job." })] }),
        new Paragraph({ children: [new TextRun({ text: "ANS: C", bold: true })] }),

        // Q2
        new Paragraph({ spacing: { before: 180, after: 80 }, children: [new TextRun({ text: "2. Which of the following statements represents an OPINION in Ari's chapter?", bold: true })] }),
        new Paragraph({ children: [new TextRun({ text: "A. Warung Malang restaurant has rattan chairs and twelve tables." })] }),
        new Paragraph({ children: [new TextRun({ text: "B. Ginger Juice is lucky to live in the restaurant cage where she is safe." })] }),
        new Paragraph({ children: [new TextRun({ text: "C. Ari represents his school chess team in a tournament in Surabaya." })] }),
        new Paragraph({ children: [new TextRun({ text: "D. Elvis Presley sings You Ain't Nothin' But A Hound Dog." })] }),
        new Paragraph({ children: [new TextRun({ text: "ANS: B", bold: true })] }),

        // Q3
        new Paragraph({ spacing: { before: 180, after: 80 }, children: [new TextRun({ text: "3. What is the main difference between a fact and an opinion?", bold: true })] }),
        new Paragraph({ children: [new TextRun({ text: "A. Facts are always longer sentences than opinions." })] }),
        new Paragraph({ children: [new TextRun({ text: "B. Opinions are backed by research, while facts are backed by feelings." })] }),
        new Paragraph({ children: [new TextRun({ text: "C. Facts can be proven true or false with evidence, while opinions are personal beliefs." })] }),
        new Paragraph({ children: [new TextRun({ text: "D. Facts only happen in books, and opinions only happen in speeches." })] }),
        new Paragraph({ children: [new TextRun({ text: "ANS: C", bold: true })] }),

        // Q4
        new Paragraph({ spacing: { before: 180, after: 80 }, children: [new TextRun({ text: "4. Why is a statement like 'Captivity is bad' considered a 'bare assertion' in a persuasive text?", bold: true })] }),
        new Paragraph({ children: [new TextRun({ text: "A. Because it does not contain a capital letter." })] }),
        new Paragraph({ children: [new TextRun({ text: "B. Because it is an opinion that is not supported by facts or authoritative sources." })] }),
        new Paragraph({ children: [new TextRun({ text: "C. Because it is a fact that everyone already knows." })] }),
        new Paragraph({ children: [new TextRun({ text: "D. Because it contains spelling errors." })] }),
        new Paragraph({ children: [new TextRun({ text: "ANS: B", bold: true })] }),

        // Q5
        new Paragraph({ spacing: { before: 180, after: 80 }, children: [new TextRun({ text: "5. When Ginger Juice says Ari 'is skinny like mongoose' and 'I smell his fear', what are these descriptions?", bold: true })] }),
        new Paragraph({ children: [new TextRun({ text: "A. Verifiable facts about Ari's physical measurements." })] }),
        new Paragraph({ children: [new TextRun({ text: "B. Scientific descriptions of Ari's smell." })] }),
        new Paragraph({ children: [new TextRun({ text: "C. Subjective animal observations and impressions." })] }),
        new Paragraph({ children: [new TextRun({ text: "D. Factual records written by the restaurant helper." })] }),
        new Paragraph({ children: [new TextRun({ text: "ANS: C", bold: true })] })
      ]
    }]
  });

  const buffer = await Packer.toBuffer(doc);
  saveDocx(assessmentPath, buffer, "Assessment");
}

// Run compilation
async function run() {
  buildLessonPlan();
  await buildHandout();
  await buildLucasWorksheet();
  buildSlides();
  await buildAssessment();
  console.log("\n🎉 ALL LESSON RESOURCES GENERATED SUCCESSFULLY!");
}

run().catch(console.error);
