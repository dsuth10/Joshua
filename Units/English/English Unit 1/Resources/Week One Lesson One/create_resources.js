const { Document, Packer, Paragraph, TextRun, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType } = require('docx');
const pptxgen = require('pptxgenjs');
const fs = require('fs');
const path = require('path');
const html2pptx = require('c:\\Users\\dsuth\\Documents\\Joshua\\.agent\\skills\\pptx\\scripts\\html2pptx');

const THEME = {
  navy: '112d4e',
  orange: 'f96d00',
  white: 'f9f7f7',
  blue: '3f72af'
};

// --- HANDOUT GENERATION ---
async function generateHandout(filename) {
  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "Paper Planes: Unit 1, Lesson 1", bold: true, size: 32, color: THEME.navy }),
          ],
          spacing: { after: 200 }
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "Student Handout: Our Aussie World", bold: true, size: 24, color: THEME.orange }),
          ],
          spacing: { after: 400 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Name: ________________________", size: 24 }),
            new TextRun({ text: "   Date: ________________", size: 24 }),
          ],
          spacing: { after: 400 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Part 1: Predictions", bold: true, size: 28, color: THEME.navy })],
          spacing: { before: 200, after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Based on the book cover and the title 'Paper Planes', what do you think this story is about?", size: 22 })],
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "________________________________________________________________________________________________________________________________________________________________________________________________", size: 20 })],
          spacing: { after: 400 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Part 2: Map Quest", bold: true, size: 28, color: THEME.navy })],
          spacing: { before: 200, after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "1. Locate Western Australia on your map.", size: 22 })],
        }),
        new Paragraph({
          children: [new TextRun({ text: "2. Draw a star where you think Dylan's town of Waleup might be.", size: 22 })],
        }),
        new Paragraph({
          children: [new TextRun({ text: "3. Write down two words that describe the 'outback' setting.", size: 22 })],
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "a) ________________________   b) ________________________", size: 20 })],
          spacing: { after: 400 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Part 3: Aussie Voices", bold: true, size: 28, color: THEME.navy })],
          spacing: { before: 200, after: 200 }
        }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Slang Word", bold: true, color: "FFFFFF" })] })], shading: { fill: THEME.orange } }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "What do you think it means?", bold: true, color: "FFFFFF" })] })], shading: { fill: THEME.orange } }),
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ text: "Mate" })] }),
                new TableCell({ children: [new Paragraph({ text: "" })] }),
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ text: "Fair go" })] }),
                new TableCell({ children: [new Paragraph({ text: "" })] }),
              ]
            })
          ]
        })
      ]
    }]
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(filename, buffer);
  console.log(`✅ Handout created.`);
}

// --- PRESENTATION GENERATION ---
async function generatePresentation(filename) {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';

  const slides = [
    path.join(__dirname, 'slides', 'slide1.html'),
    path.join(__dirname, 'slides', 'slide2.html'),
    path.join(__dirname, 'slides', 'slide3.html'),
    path.join(__dirname, 'slides', 'slide4.html'),
    path.join(__dirname, 'slides', 'slide5.html'),
    path.join(__dirname, 'slides', 'slide6.html')
  ];

  for (const s of slides) {
    try {
      console.log(`Processing: ${path.basename(s)}`);
      await html2pptx(s, pptx);
      console.log(`✅ Processed: ${path.basename(s)}`);
    } catch (err) {
      console.error(`❌ Error on ${s}: ${err.message}`);
      let failSlide = pptx.addSlide();
      failSlide.addText(`Error uploading slide data.`, { x: 1, y: 1, color: 'FF0000' });
    }
  }

  await pptx.writeFile({ fileName: filename });
  console.log(`✅ Presentation created.`);
}

// --- ASSESSMENT GENERATION ---
async function generateAssessment(filename) {
  const questions = [
    {
      q: "1. Based on the outback setting, how would you describe the environment Dylan lives in?",
      a: "A. Tropical and rainy",
      b: "B. Dry, dusty, and remote",
      c: "C. Busy and crowded city",
      d: "D. Snowy and cold",
      correct: "B"
    },
    {
      q: "2. What does the title 'Paper Planes' predict about the story's main activity?",
      a: "A. Building real aircraft",
      b: "B. Learning to fly a helicopter",
      c: "C. Creating and flying paper gliders",
      d: "D. Working in a paper factory",
      correct: "C"
    },
    {
      q: "3. If Dylan lives in 'Waleup', where is this fictional town most likely located?",
      a: "A. In the middle of Perth",
      b: "B. In regional Western Australia",
      c: "C. On an island in the Pacific",
      d: "D. In the center of Sydney",
      correct: "B"
    },
    {
      q: "4. Which theme is predicted by the focus on Dylan and his father?",
      a: "A. Space exploration",
      b: "B. Family relationships",
      c: "C. Deep-sea diving",
      d: "D. Cooking competitions",
      correct: "B"
    },
    {
      q: "5. Why might the author use Australian slang like 'mate' early in the book?",
      a: "A. To make it harder for non-Australians to read",
      b: "B. To establish a realistic Australian cultural context",
      c: "C. Because they ran out of other words",
      d: "D. To teach students how to spell incorrectly",
      correct: "B"
    }
  ];

  const docChildren = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "Initial Predictions Assessment: Paper Planes", bold: true, size: 32, font: "Arial" })],
      spacing: { after: 400 }
    })
  ];

  questions.forEach(item => {
    docChildren.push(new Paragraph({ children: [new TextRun({ text: item.q, font: "Arial", size: 24 })], spacing: { before: 200 } }));
    docChildren.push(new Paragraph({ children: [new TextRun({ text: item.a, font: "Arial", size: 24 })] }));
    docChildren.push(new Paragraph({ children: [new TextRun({ text: item.b, font: "Arial", size: 24 })] }));
    docChildren.push(new Paragraph({ children: [new TextRun({ text: item.c, font: "Arial", size: 24 })] }));
    docChildren.push(new Paragraph({ children: [new TextRun({ text: item.d, font: "Arial", size: 24 })] }));
    docChildren.push(new Paragraph({ children: [new TextRun({ text: `ANS: ${item.correct}`, font: "Arial", size: 24, bold: true })], spacing: { after: 200 } }));
  });

  const doc = new Document({ sections: [{ children: docChildren }] });
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(filename, buffer);
  console.log(`✅ Assessment created.`);
}

// --- EXECUTION ---
async function run() {
  await generateHandout('Student_Handout.docx');
  console.log("Handout done.");
  await generatePresentation('Presentation.pptx');
  console.log("Presentation done.");
  await generateAssessment('Initial_Predictions_Assessment.docx');
  console.log("Assessment done.");
  console.log("\n🚀 All Week 1 Lesson 1 resources generated successfully!");
}

run().catch(err => {
  console.error("FATAL ERROR IN RUN:");
  console.error(err);
});
