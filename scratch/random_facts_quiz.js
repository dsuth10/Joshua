const { Document, Packer, Paragraph, TextRun, AlignmentType } = require('docx');
const fs = require('fs');
const path = require('path');

const questions = [
  {
    q: "1. What is the only continent on Earth that has no active volcanoes?",
    a: "A. Antarctica",
    b: "B. Australia",
    c: "C. Europe",
    d: "D. South America",
    correct: "B"
  },
  {
    q: "2. Which of these animals is known to have the strongest bite force in the world?",
    a: "A. Grizzly Bear",
    b: "B. Hippopotamus",
    c: "C. Nile Crocodile",
    d: "D. Great White Shark",
    correct: "C"
  },
  {
    q: "3. What is the rarest blood type in humans?",
    a: "A. O Negative",
    b: "B. B Positive",
    c: "C. AB Negative",
    d: "D. A Positive",
    correct: "C"
  },
  {
    q: "4. Which planet in our solar system rotates clockwise (retrograde)?",
    a: "A. Mars",
    b: "B. Venus",
    c: "C. Jupiter",
    d: "D. Neptune",
    correct: "B"
  },
  {
    q: "5. What was the first food ever grown in space?",
    a: "A. Lettuce",
    b: "B. Potatoes",
    c: "C. Radishes",
    d: "D. Tomatoes",
    correct: "A"
  }
];

const children = [
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({
        text: "Random Facts Test Assessment",
        bold: true,
        size: 32,
        font: "Arial"
      })
    ],
    spacing: { after: 400 }
  })
];

questions.forEach((item) => {
  // Question
  children.push(new Paragraph({
    children: [new TextRun({ text: item.q, font: "Arial", size: 24 })],
    spacing: { before: 200 }
  }));
  // Options
  children.push(new Paragraph({ children: [new TextRun({ text: item.a, font: "Arial", size: 24 })] }));
  children.push(new Paragraph({ children: [new TextRun({ text: item.b, font: "Arial", size: 24 })] }));
  children.push(new Paragraph({ children: [new TextRun({ text: item.c, font: "Arial", size: 24 })] }));
  children.push(new Paragraph({ children: [new TextRun({ text: item.d, font: "Arial", size: 24 })] }));
  // Answer and Point (Standardized format)
  children.push(new Paragraph({
    children: [new TextRun({ text: `ANSWER: ${item.correct}`, font: "Arial", size: 24, bold: true })],
    spacing: { after: 100 }
  }));
  children.push(new Paragraph({
    children: [new TextRun({ text: `POINT: 1`, font: "Arial", size: 24, bold: true })],
    spacing: { after: 200 }
  }));
});

const doc = new Document({
  sections: [{
    children: children
  }]
});

const outputPath = path.join(__dirname, 'Random_Facts_Assessment.docx');

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outputPath, buffer);
  console.log(`Successfully created: ${outputPath}`);
});
