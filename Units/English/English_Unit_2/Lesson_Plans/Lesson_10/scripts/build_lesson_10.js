const { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle } = require('docx');
const pptxgen = require('pptxgenjs');
const fs = require('fs');
const path = require('path');
const html2pptx = require('c:\\Users\\dsuth\\Documents\\Joshua\\.agent\\skills\\pptx\\scripts\\html2pptx');

const THEME = { navy: '112d4e', orange: 'f96d00', white: 'f9f7f7', blue: '3f72af', darkGrey: '333333' };

// Helpers for Word Docs
function createHeader(title) {
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: title, bold: true, size: 36, color: THEME.navy })],
      spacing: { after: 200 }
    }),
    new Paragraph({
      children: [new TextRun({ text: "Name: ______________________   Date: _____________", size: 24 })],
      spacing: { after: 400 }
    })
  ];
}

async function generateExtremeWorksheet(filename) {
  const doc = new Document({
    sections: [{
      children: [
        ...createHeader("Lesson 10: Expanded Noun Groups (Extreme Worksheet)"),
        new Paragraph({
          children: [new TextRun({ text: "Part 1: Deconstructing Noun Groups", bold: true, size: 28 })],
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "An expanded noun group consists of: Article + Pre-modifier (Adjectives) + Noun + Post-modifier (Prepositional Phrase / Embedded Clause).", size: 24, italics: true })],
          spacing: { after: 400 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Read the following expanded noun groups from the Floods Archive. Break them down into their four parts.", size: 24 })],
          spacing: { after: 200 }
        }),
        createNounGroupTable("the devastating 1974 flood event that reshaped Brisbane"),
        new Paragraph({ text: "", spacing: { after: 200 } }),
        createNounGroupTable("a rapidly rising, sediment-laden floodwater from the Bremer River"),
        new Paragraph({ text: "", spacing: { after: 400 } }),
        
        new Paragraph({
          children: [new TextRun({ text: "Part 2: Constructing Noun Groups", bold: true, size: 28 })],
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Take the simple noun provided and build your own extreme expanded noun group. Make sure to include an embedded clause or prepositional phrase!", size: 24 })],
          spacing: { after: 400 }
        }),
        new Paragraph({ children: [new TextRun({ text: "1. Simple Noun: damage", bold: true, size: 24 })], spacing: { after: 100 } }),
        new Paragraph({ children: [new TextRun({ text: "Expanded:", size: 24 })] }),
        new Paragraph({ text: "___________________________________________________________________________________", spacing: { after: 400 } }),
        new Paragraph({ children: [new TextRun({ text: "2. Simple Noun: clouds", bold: true, size: 24 })], spacing: { after: 100 } }),
        new Paragraph({ children: [new TextRun({ text: "Expanded:", size: 24 })] }),
        new Paragraph({ text: "___________________________________________________________________________________", spacing: { after: 400 } })
      ]
    }]
  });
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(filename, buffer);
  console.log("✅ Extreme Worksheet generated.");
}

function createNounGroupTable(phrase) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ text: "Phrase:", bold: true })], margins: { top: 100, bottom: 100, left: 100 } }),
          new TableCell({ columnSpan: 4, children: [new Paragraph({ text: phrase, italics: true })], margins: { top: 100, bottom: 100, left: 100 } })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({ shading: { fill: THEME.blue }, children: [new Paragraph({ text: "Article", color: THEME.white, bold: true, alignment: AlignmentType.CENTER })] }),
          new TableCell({ shading: { fill: THEME.blue }, children: [new Paragraph({ text: "Pre-modifier", color: THEME.white, bold: true, alignment: AlignmentType.CENTER })] }),
          new TableCell({ shading: { fill: THEME.orange }, children: [new Paragraph({ text: "Noun", color: THEME.white, bold: true, alignment: AlignmentType.CENTER })] }),
          new TableCell({ shading: { fill: THEME.blue }, children: [new Paragraph({ text: "Post-modifier", color: THEME.white, bold: true, alignment: AlignmentType.CENTER })] })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ text: "\n\n" })] }),
          new TableCell({ children: [new Paragraph({ text: "\n\n" })] }),
          new TableCell({ children: [new Paragraph({ text: "\n\n" })] }),
          new TableCell({ children: [new Paragraph({ text: "\n\n" })] })
        ]
      })
    ]
  });
}

async function generateLucasHandout(filename) {
  const doc = new Document({
    sections: [{
      children: [
        ...createHeader("Lesson 10: Describing Words and Phrases"),
        new Paragraph({
          children: [new TextRun({ text: "Let's build bigger and better words!", bold: true, size: 28, color: THEME.navy })],
          spacing: { after: 400 }
        }),
        new Paragraph({ children: [new TextRun({ text: "Part 1: Adding one describing word (Adjective)", bold: true, size: 24 })], spacing: { after: 200 } }),
        new Paragraph({ children: [new TextRun({ text: "Add a describing word to the simple word to give it more detail.", size: 24 })], spacing: { after: 200 } }),
        new Paragraph({ text: "1. Simple word: water", size: 24, bold: true, spacing: { after: 100 } }),
        new Paragraph({ text: "Expanded: the _________________ water", size: 24, spacing: { after: 300 } }),
        new Paragraph({ text: "2. Simple word: wind", size: 24, bold: true, spacing: { after: 100 } }),
        new Paragraph({ text: "Expanded: the _________________ wind", size: 24, spacing: { after: 400 } }),

        new Paragraph({ children: [new TextRun({ text: "Part 2: Adding a describing phrase (Post-modifier)", bold: true, size: 24 })], spacing: { after: 200 } }),
        new Paragraph({ children: [new TextRun({ text: "Now add a short phrase to tell us where or when.", size: 24 })], spacing: { after: 200 } }),
        new Paragraph({ text: "3. Simple word: clouds", size: 24, bold: true, spacing: { after: 100 } }),
        new Paragraph({ text: "Expanded: the dark clouds from the _________________", size: 24, spacing: { after: 300 } }),
        new Paragraph({ text: "4. Simple word: rain", size: 24, bold: true, spacing: { after: 100 } }),
        new Paragraph({ text: "Expanded: the heavy rain over the _________________", size: 24, spacing: { after: 400 } }),

        new Paragraph({ children: [new TextRun({ text: "Part 3: Building a full Expanded Noun Group", bold: true, size: 24 })], spacing: { after: 200 } }),
        new Paragraph({ children: [new TextRun({ text: "Combine describing words before the noun and a phrase after the noun!", size: 24 })], spacing: { after: 200 } }),
        new Paragraph({ text: "5. Simple word: flood", size: 24, bold: true, spacing: { after: 100 } }),
        new Paragraph({ text: "Expanded: the _________________ flood that ruined the _________________", size: 24, spacing: { after: 300 } }),
        new Paragraph({ text: "6. Simple word: river", size: 24, bold: true, spacing: { after: 100 } }),
        new Paragraph({ text: "Expanded: the _________________ river flowing through the _________________", size: 24, spacing: { after: 400 } })
      ]
    }]
  });
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(filename, buffer);
  console.log("✅ Lucas Handout generated.");
}

async function generateAssessment(filename) {
  const questions = [
    {
      q: "1. Which of the following is the 'core noun' in the phrase 'the devastating 1974 flood event'?",
      a: "A. the",
      b: "B. devastating",
      c: "C. 1974",
      d: "D. event",
      ans: "D"
    },
    {
      q: "2. In the noun group 'the murky floodwater', what role does the word 'murky' play?",
      a: "A. Article",
      b: "B. Pre-modifier (Adjective)",
      c: "C. Noun",
      d: "D. Post-modifier",
      ans: "B"
    },
    {
      q: "3. What is an embedded clause or prepositional phrase often used as in an expanded noun group?",
      a: "A. Article",
      b: "B. Verb",
      c: "C. Pre-modifier",
      d: "D. Post-modifier",
      ans: "D"
    },
    {
      q: "4. Which of these is the most expanded noun group?",
      a: "A. Water",
      b: "B. The floodwater",
      c: "C. The murky floodwater",
      d: "D. The rapidly rising, sediment-laden floodwaters of the Bremer River.",
      ans: "D"
    },
    {
      q: "5. Why do authors use expanded noun groups in informative texts?",
      a: "A. To make the text shorter.",
      b: "B. To confuse the reader.",
      c: "C. To provide a fuller, more precise description of a thing.",
      d: "D. To show feelings and emotions.",
      ans: "C"
    }
  ];

  const children = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "Lesson 10: Expanded Noun Groups Assessment", bold: true, size: 36 })],
      spacing: { after: 400 }
    })
  ];

  questions.forEach(item => {
    children.push(new Paragraph({ children: [new TextRun({ text: item.q, bold: true, size: 24 })], spacing: { before: 200 } }));
    children.push(new Paragraph({ children: [new TextRun({ text: item.a, size: 24 })] }));
    children.push(new Paragraph({ children: [new TextRun({ text: item.b, size: 24 })] }));
    children.push(new Paragraph({ children: [new TextRun({ text: item.c, size: 24 })] }));
    children.push(new Paragraph({ children: [new TextRun({ text: item.d, size: 24 })] }));
    children.push(new Paragraph({ children: [new TextRun({ text: `ANS: [${item.ans}]`, bold: true, size: 24 })], spacing: { after: 200 } }));
  });

  const doc = new Document({ sections: [{ children }] });
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(filename, buffer);
  console.log("✅ Assessment generated.");
}

function createHtmlSlide(title, content) {
  return `<!DOCTYPE html>
<html>
<head>
<style>
html { background: #ffffff; }
body { width: 720pt; height: 405pt; margin: 0; padding: 0; background: #112d4e; font-family: Arial, sans-serif; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; }
h1 { color: #f96d00; font-size: 48pt; margin: 0 0 20pt 0; font-weight: bold; }
p { color: #f9f7f7; font-size: 32pt; margin: 0; line-height: 1.4; }
.highlight { color: #f96d00; font-weight: bold; }
</style>
</head>
<body>
  <h1>${title}</h1>
  ${content}
</body>
</html>`;
}

async function generateSlides(slidesDir) {
  if (!fs.existsSync(slidesDir)) {
    fs.mkdirSync(slidesDir, { recursive: true });
  }

  const slidesData = [
    { title: "Expanded Noun Groups", content: "<p>Painting a precise picture.</p>" },
    { title: "Compare These:", content: "<p>water</p><p>the murky floodwater</p><p>the rapidly rising, sediment-laden floodwaters <br>of the Bremer River.</p>" },
    { title: "What changes?", content: "<p>What is the <span class='highlight'>core noun</span>?</p><p>What words are doing the describing?</p>" },
    { title: "The Formula", content: "<p><span class='highlight'>Article</span> + <span class='highlight'>Pre-modifier</span> (Adjectives)<br>+ <span class='highlight'>Noun</span><br>+ <span class='highlight'>Post-modifier</span> (Phrase or Clause)</p>" },
    { title: "Let's Break It Down", content: "<p>the devastating 1974 flood event that reshaped Brisbane</p><p style='font-size:24pt; margin-top:20pt;'>Article: the<br>Pre-modifier: devastating 1974<br>Noun: flood event<br>Post-modifier: that reshaped Brisbane</p>" },
    { title: "Let's Break It Down: Example 1", content: "<p>the sudden, terrifying roar of the wind that shattered the silence</p><p style='font-size:24pt; margin-top:20pt;'>Article: the<br>Pre-modifier: sudden, terrifying<br>Noun: roar<br>Post-modifier: of the wind that shattered the silence</p>" },
    { title: "Let's Break It Down: Example 2", content: "<p>a relentless, pouring rain lasting for three straight days</p><p style='font-size:24pt; margin-top:20pt;'>Article: a<br>Pre-modifier: relentless, pouring<br>Noun: rain<br>Post-modifier: lasting for three straight days</p>" },
    { title: "Let's Break It Down: Example 3", content: "<p>the overwhelming, brown floodwater from the bursting riverbanks</p><p style='font-size:24pt; margin-top:20pt;'>Article: the<br>Pre-modifier: overwhelming, brown<br>Noun: floodwater<br>Post-modifier: from the bursting riverbanks</p>" },
    { title: "Your Turn!", content: "<p>Let's build an expanded noun group for:</p><p class='highlight' style='font-size: 48pt;'>rain</p>" },
    { title: "Independent Work", content: "<p>Complete the Extreme Worksheet.</p><p>Hunt for noun groups in the Floods Archive!</p>" }
  ];

  const slidePaths = [];
  for (let i = 0; i < slidesData.length; i++) {
    const slidePath = path.join(slidesDir, `slide_${i + 1}.html`);
    fs.writeFileSync(slidePath, createHtmlSlide(slidesData[i].title, slidesData[i].content));
    slidePaths.push(slidePath);
  }
  
  return slidePaths;
}

async function generatePresentation(filename, slidePaths) {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';

  for (const s of slidePaths) {
    try {
      console.log(`Processing: ${path.basename(s)}`);
      await html2pptx(s, pptx);
    } catch (err) {
      console.error(`❌ Error on ${s}: ${err.message}`);
      let failSlide = pptx.addSlide();
      failSlide.addText(`Slide generation failed.`, { x: 1, y: 1, color: 'FF0000' });
    }
  }
  await pptx.writeFile({ fileName: filename });
  console.log("✅ PPTX generated.");
}

async function run() {
  console.log("Starting Lesson 10 resource generation...");
  const baseDir = "c:\\Users\\dsuth\\Documents\\Joshua\\Units\\English\\English_Unit_2\\Lesson_Plans";
  
  // Handouts
  const handoutsDir = path.join(baseDir, "Handouts");
  if (!fs.existsSync(handoutsDir)) fs.mkdirSync(handoutsDir, { recursive: true });
  await generateExtremeWorksheet(path.join(handoutsDir, "Lesson_10_Student_Worksheet.docx"));
  await generateLucasHandout(path.join(handoutsDir, "Lesson_10_Handout_Lucas.docx"));
  
  // Assessment
  await generateAssessment(path.join(baseDir, "Lesson_10_Assessment.docx"));
  
  // Slides & PPTX
  const slidesDir = path.join(baseDir, "Presentations", "Lesson_10_Slides");
  const slidePaths = await generateSlides(slidesDir);
  await generatePresentation(path.join(baseDir, "Presentations", "Lesson_10_Presentation_v2.pptx"), slidePaths);
  
  console.log("All generated successfully.");
}

run().catch(console.error);
