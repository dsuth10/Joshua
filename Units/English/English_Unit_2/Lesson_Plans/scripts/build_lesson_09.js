const { Document, Packer, Paragraph, TextRun, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType } = require('docx');
const pptxgen = require('pptxgenjs');
const fs = require('fs');
const path = require('path');
const html2pptx = require('c:\\Users\\dsuth\\Documents\\Joshua\\.agent\\skills\\pptx\\scripts\\html2pptx');

const THEME = { navy: '112d4e', orange: 'f96d00', white: 'f9f7f7', blue: '3f72af' };
const outDir = path.resolve(__dirname, '..');

// --- HANDOUT GENERATION ---
async function generateStudentWorksheet() {
  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "Lesson 9: Complex Sentences", bold: true, size: 32, color: THEME.navy })],
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Name: ______________________   Date: __________", size: 24 })],
          spacing: { after: 400 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Part A: Identify the Sentence", bold: true, size: 28, color: THEME.orange })],
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Read the sentences from the Floods archive below. Are they Simple, Compound, or Complex? Write your answer on the line.", size: 24 })],
          spacing: { after: 200 }
        }),
        new Paragraph({ text: "1. The Brisbane River is a tidal estuary. _______________", spacing: { after: 200 }, size: 24 }),
        new Paragraph({ text: "2. The water rose quickly, and the streets flooded. _______________", spacing: { after: 200 }, size: 24 }),
        new Paragraph({ text: "3. When extreme rainfall causes water to rise rapidly, flash floods occur. _______________", spacing: { after: 200 }, size: 24 }),
        new Paragraph({ text: "4. No two floods are identical. _______________", spacing: { after: 200 }, size: 24 }),
        new Paragraph({ text: "5. The weather bureau issued a severe storm warning. _______________", spacing: { after: 200 }, size: 24 }),
        new Paragraph({ text: "6. Although the rain had stopped, the river continued to rise for days. _______________", spacing: { after: 200 }, size: 24 }),
        new Paragraph({ text: "7. Residents evacuated to higher ground, so they remained safe. _______________", spacing: { after: 200 }, size: 24 }),
        new Paragraph({ text: "8. Because concrete surfaces stop water from soaking in, cities flood easily. _______________", spacing: { after: 200 }, size: 24 }),
        new Paragraph({ text: "9. Emergency workers rescued the stranded family. _______________", spacing: { after: 200 }, size: 24 }),
        new Paragraph({ text: "10. The dam reached full capacity, but engineers managed the overflow safely. _______________", spacing: { after: 400 }, size: 24 }),
        
        new Paragraph({
          children: [new TextRun({ text: "Part B: Breaking Down Complex Sentences", bold: true, size: 28, color: THEME.orange })],
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "For each complex sentence below:", size: 24 })],
          spacing: { after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "• Underline the Main Clause in BLUE.", size: 24 })],
          spacing: { after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "• Underline the Dependent Clause in RED.", size: 24 })],
          spacing: { after: 300 }
        }),
        new Paragraph({ text: "1. Because large river systems collect water from immense areas, riverine floods can take days to peak.", spacing: { after: 300 }, size: 24 }),
        new Paragraph({ text: "2. A flood occurs when water covers land that is normally dry.", spacing: { after: 300 }, size: 24 }),
        new Paragraph({ text: "3. If a two-metre storm surge arrives at low tide, the impact might be minimal.", spacing: { after: 400 }, size: 24 }),
        
        new Paragraph({
          children: [new TextRun({ text: "Part C: Create Your Own", bold: true, size: 28, color: THEME.orange })],
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Expand the simple sentence below into a complex sentence by adding a dependent clause using 'because' or 'when'.", size: 24 })],
          spacing: { after: 200 }
        }),
        new Paragraph({ text: "Simple Sentence: The city was prepared.", spacing: { after: 200 }, size: 24 }),
        new Paragraph({ text: "Complex Sentence: ________________________________________________________________________", spacing: { after: 200 }, size: 24 }),
        new Paragraph({ text: "__________________________________________________________________________________________", spacing: { after: 200 }, size: 24 }),
      ]
    }]
  });
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(path.join(outDir, 'Lesson_09_Student_Worksheet_v2.docx'), buffer);
}

async function generateLucasHandout() {
  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "Floods: Joining Sentences", bold: true, size: 36, color: THEME.navy })],
          spacing: { after: 400 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Name: ______________________", size: 28 })],
          spacing: { after: 400 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "1. Circle the joining word (and, but, so).", bold: true, size: 28, color: THEME.orange })],
          spacing: { after: 200 }
        }),
        new Paragraph({ text: "The rain fell heavily, and the river rose.", spacing: { after: 300 }, size: 28 }),
        new Paragraph({ text: "The warning was sent out, but it was too late.", spacing: { after: 400 }, size: 28 }),
        
        new Paragraph({
          children: [new TextRun({ text: "2. Join the two short sentences using 'and'.", bold: true, size: 28, color: THEME.orange })],
          spacing: { after: 200 }
        }),
        new Paragraph({ text: "The wind blew. The water splashed.", spacing: { after: 200 }, size: 28 }),
        new Paragraph({ text: "_________________________________________________", spacing: { after: 400 }, size: 28 }),
        
        new Paragraph({
          children: [new TextRun({ text: "3. Draw a picture of a flood.", bold: true, size: 28, color: THEME.orange })],
          spacing: { after: 200 }
        }),
        new Paragraph({ text: "[Draw your picture here]", alignment: AlignmentType.CENTER, spacing: { before: 1000 }, size: 28 }),
      ]
    }]
  });
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(path.join(outDir, 'Lesson_09_Handout_Lucas_v2.docx'), buffer);
}

// --- PRESENTATION GENERATION ---
async function generatePresentation() {
  const slidePaths = [
    path.join(outDir, 'Presentations', 'Lesson_09_Slides', 'slide_1.html'),
    path.join(outDir, 'Presentations', 'Lesson_09_Slides', 'slide_2.html'),
    path.join(outDir, 'Presentations', 'Lesson_09_Slides', 'slide_3.html'),
    path.join(outDir, 'Presentations', 'Lesson_09_Slides', 'slide_4.html'),
    path.join(outDir, 'Presentations', 'Lesson_09_Slides', 'slide_5.html'),
    path.join(outDir, 'Presentations', 'Lesson_09_Slides', 'slide_6.html')
  ];

  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';

  for (const s of slidePaths) {
    try {
      console.log(`Processing: ${path.basename(s)}`);
      await html2pptx(s, pptx);
      console.log(`✅ Processed: ${path.basename(s)}`);
    } catch (err) {
      console.error(`❌ Error on ${s}: ${err.message}`);
      let failSlide = pptx.addSlide();
      failSlide.addText(`Slide generation failed.`, { x: 1, y: 1, color: 'FF0000' });
    }
  }
  const outPath = path.join(outDir, 'Presentations', 'Lesson_09_Presentation.pptx');
  await pptx.writeFile({ fileName: outPath });
}

// --- ASSESSMENT GENERATION ---
async function generateAssessment() {
  const questions = [
    {
      q: "1. What makes a sentence a 'simple sentence'?",
      opts: ["A. It has many joining words", "B. It has one main clause and makes sense on its own", "C. It has a dependent clause", "D. It is very short"],
      ans: "B"
    },
    {
      q: "2. Which conjunction is commonly used in a compound sentence?",
      opts: ["A. Although", "B. Because", "C. And", "D. Since"],
      ans: "C"
    },
    {
      q: "3. What is a complex sentence?",
      opts: ["A. A sentence with two main clauses", "B. A sentence with one main clause and one dependent clause", "C. A sentence that is hard to read", "D. A sentence with no verbs"],
      ans: "B"
    },
    {
      q: "4. Which of these is a dependent clause?",
      opts: ["A. The floodwaters rose quickly.", "B. Because the rain was heavy.", "C. The river overflowed.", "D. People evacuated."],
      ans: "B"
    },
    {
      q: "5. 'Floodwaters rose quickly.' This is an example of what kind of sentence?",
      opts: ["A. Simple", "B. Compound", "C. Complex", "D. Incomplete"],
      ans: "A"
    },
    {
      q: "6. 'The rain stopped, but the river kept rising.' What kind of sentence is this?",
      opts: ["A. Simple", "B. Compound", "C. Complex", "D. Incomplete"],
      ans: "B"
    },
    {
      q: "7. 'When the extreme rainfall causes water to rise rapidly, flash floods occur.' What kind of sentence is this?",
      opts: ["A. Simple", "B. Compound", "C. Complex", "D. Incomplete"],
      ans: "C"
    },
    {
      q: "8. What is the main clause in: 'A flood occurs when water covers land that is normally dry.'?",
      opts: ["A. water covers land", "B. A flood occurs", "C. when water covers", "D. that is normally dry"],
      ans: "B"
    },
    {
      q: "9. What is the dependent clause in: 'Because large river systems collect water, floods can take days to peak.'?",
      opts: ["A. floods can take days to peak", "B. river systems collect", "C. Because large river systems collect water", "D. take days to peak"],
      ans: "C"
    },
    {
      q: "10. What type of flooding is caused by a river overflowing its banks?",
      opts: ["A. Flash flooding", "B. Coastal flooding", "C. Riverine flooding", "D. Dam-related flooding"],
      ans: "C"
    },
    {
      q: "11. Why is flash flooding so dangerous?",
      opts: ["A. It lasts for weeks", "B. It occurs slowly", "C. It offers virtually no warning time", "D. It only happens at the beach"],
      ans: "C"
    },
    {
      q: "12. What do we call hard surfaces like concrete that water cannot soak into?",
      opts: ["A. Impervious surfaces", "B. Porous surfaces", "C. Catchment surfaces", "D. Riparian zones"],
      ans: "A"
    },
    {
      q: "13. A storm tide is a combination of a storm surge and what else?",
      opts: ["A. A tsunami", "B. The normal astronomical tide", "C. An earthquake", "D. River flooding"],
      ans: "B"
    },
    {
      q: "14. How large is the Brisbane River's catchment?",
      opts: ["A. 1,000 square kilometres", "B. 5,000 square kilometres", "C. 15,000 square kilometres", "D. 50,000 square kilometres"],
      ans: "C"
    },
    {
      q: "15. What is the phenomenon called when an incoming tide slows the downstream flow of a flooding river?",
      opts: ["A. Tidal pushing", "B. Tidal backing", "C. Tidal surge", "D. Tidal locking"],
      ans: "B"
    }
  ];

  const docChildren = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "Lesson 9 Assessment: Floods & Complex Sentences", bold: true, size: 28 })],
      spacing: { after: 400 }
    })
  ];

  for (const q of questions) {
    docChildren.push(new Paragraph({ text: q.q, size: 22 }));
    docChildren.push(new Paragraph({ text: q.opts[0], size: 22 }));
    docChildren.push(new Paragraph({ text: q.opts[1], size: 22 }));
    docChildren.push(new Paragraph({ text: q.opts[2], size: 22 }));
    docChildren.push(new Paragraph({ text: q.opts[3], size: 22 }));
    docChildren.push(new Paragraph({ text: `ans: ${q.ans}`, size: 22 }));
    docChildren.push(new Paragraph({ text: "point: 1", size: 22 }));
    docChildren.push(new Paragraph({ text: "", size: 22 })); // Empty paragraph between questions
  }

  const doc = new Document({ sections: [{ children: docChildren }] });
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(path.join(outDir, 'Lesson_09_Assessment_v2.docx'), buffer);
}

// --- MAIN RUN ---
async function run() {
  console.log("Starting Lesson 9 resource generation...");
  await generateStudentWorksheet();
  console.log("✅ Student Worksheet generated.");
  await generateLucasHandout();
  console.log("✅ Lucas Handout generated.");
  await generateAssessment();
  console.log("✅ Assessment generated.");
  await generatePresentation();
  console.log("✅ Presentation PPTX generated.");
}

run().catch(console.error);
