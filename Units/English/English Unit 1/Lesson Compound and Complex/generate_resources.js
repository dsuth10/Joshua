const { Document, Packer, Paragraph, TextRun, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType } = require('docx');
const pptxgen = require('pptxgenjs');
const fs = require('fs');
const path = require('path');
const html2pptx = require('c:\\Users\\dsuth\\Documents\\Joshua\\.agent\\skills\\pptx\\scripts\\html2pptx');

const THEME = { navy: '112d4e', orange: 'f96d00', white: 'f9f7f7', blue: '3f72af' };
const LESSON_DIR = 'c:\\Users\\dsuth\\Documents\\Joshua\\Units\\English\\English Unit 1\\Lesson Compound and Complex';

// --- HANDOUT GENERATION ---
async function generateHandout() {
  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "Sentence Flight Manual", bold: true, size: 36, color: THEME.navy })],
          spacing: { after: 200 }
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "Name: ____________________   Date: ________", size: 24 })],
          spacing: { after: 400 }
        }),
        
        // --- SECTION 1: THE RULES ---
        new Paragraph({
          children: [new TextRun({ text: "1. The Grammar Flight Rules", bold: true, size: 28, color: THEME.orange })],
          spacing: { after: 200 }
        }),
        new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph({ children: [new TextRun({ text: "Structure", bold: true }), new TextRun({ text: "\nSimple Sentence", italics: true })] })],
                            shading: { fill: THEME.blue, color: 'auto' }
                        }),
                        new TableCell({
                            children: [new Paragraph({ children: [new TextRun({ text: "Explanation", bold: true }), new TextRun({ text: "\nOne independent clause (complete thought)." })] })],
                        })
                    ]
                }),
                new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph({ children: [new TextRun({ text: "Compound Sentence", bold: true })] })],
                            shading: { fill: THEME.blue, color: 'auto' }
                        }),
                        new TableCell({
                            children: [new Paragraph({ children: [new TextRun({ text: "Two independent clauses joined by FANBOYS (For, and, nor, but, or, yet, so)." })] })],
                        })
                    ]
                }),
                new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph({ children: [new TextRun({ text: "Complex Sentence", bold: true })] })],
                            shading: { fill: THEME.blue, color: 'auto' }
                        }),
                        new TableCell({
                            children: [new Paragraph({ children: [new TextRun({ text: "An independent clause + a dependent clause (using because, although, since, when, etc.)." })] })],
                        })
                    ]
                })
            ]
        }),

        // --- SECTION 2: SORTING ---
        new Paragraph({
          children: [new TextRun({ text: "\n2. Sentence Sorting", bold: true, size: 28, color: THEME.orange })],
          spacing: { before: 400, after: 200 }
        }),
        new Paragraph({ children: [new TextRun({ text: "Identify if the following sentences are Compound (CP) or Complex (CX):" })] }),
        new Paragraph({ children: [new TextRun({ text: "a) Dylan practiced his throws, and his plane flew further. [____]" })] }),
        new Paragraph({ children: [new TextRun({ text: "b) Because the paper was thin, it was easy to fold. [____]" })] }),
        new Paragraph({ children: [new TextRun({ text: "c) Dad stayed in bed although Dylan needed his help. [____]" })] }),
        new Paragraph({ children: [new TextRun({ text: "d) Grandpa gave him a coin, so he could buy a ticket. [____]" })] }),
        new Paragraph({ children: [new TextRun({ text: "e) Grandpa laughed while Dylan showed him the plane. [____]" })] }),
        new Paragraph({ children: [new TextRun({ text: "f) The room was quiet, yet Dylan could hear his heart beating. [____]" })] }),
        new Paragraph({ children: [new TextRun({ text: "g) If it rains, the paper will get soggy. [____]" })] }),
        new Paragraph({ children: [new TextRun({ text: "h) Dylan was determined, for he had a dream to fly. [____]" })] }),

        // --- SECTION 3: COMBINING ---
        new Paragraph({
          children: [new TextRun({ text: "\n3. Combining for Flight", bold: true, size: 28, color: THEME.orange })],
          spacing: { before: 400, after: 200 }
        }),
        new Paragraph({ children: [new TextRun({ text: "Combine these simple sentences into one strong sentence (Compound or Complex):" })] }),
        new Paragraph({ children: [new TextRun({ text: "1. Dylan was nervous. He stepped onto the stage. (Use WHEN)" })] }),
        new Paragraph({ children: [new TextRun({ text: "__________________________________________________________________" })] }),
        new Paragraph({ children: [new TextRun({ text: "2. The plane was white. It had a sharp nose. (Use AND)" })] }),
        new Paragraph({ children: [new TextRun({ text: "__________________________________________________________________" })] }),
        new Paragraph({ children: [new TextRun({ text: "3. Jason smirked. He knew he was the best. (Use BECAUSE)" })] }),
        new Paragraph({ children: [new TextRun({ text: "__________________________________________________________________" })] }),
        new Paragraph({ children: [new TextRun({ text: "4. The wind was gusty. The plane stayed in the air. (Use BUT)" })] }),
        new Paragraph({ children: [new TextRun({ text: "__________________________________________________________________" })] }),
        new Paragraph({ children: [new TextRun({ text: "5. Dylan closed his eyes. He released the paper plane. (Use AS)" })] }),
        new Paragraph({ children: [new TextRun({ text: "__________________________________________________________________" })] }),

        // --- SECTION 4: WRITING ---
        new Paragraph({
          children: [new TextRun({ text: "\n4. Independent Flight", bold: true, size: 28, color: THEME.orange })],
          spacing: { before: 400, after: 200 }
        }),
        new Paragraph({ children: [new TextRun({ text: "Write two complex sentences about Waleup using 'because' and 'while':" })] }),
        new Paragraph({ children: [new TextRun({ text: "__________________________________________________________________" })] }),
        new Paragraph({ children: [new TextRun({ text: "__________________________________________________________________" })] }),
      ]
    }]
  });
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(path.join(LESSON_DIR, 'Student_Worksheet.docx'), buffer);
}

// --- PRESENTATION GENERATION ---
async function generatePresentation() {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';

  const slideDir = path.join(LESSON_DIR, 'slides');
  const slides = fs.readdirSync(slideDir).filter(f => f.endsWith('.html')).sort((a, b) => {
    const na = parseInt(a.replace('slide', '').replace('.html', ''));
    const nb = parseInt(b.replace('slide', '').replace('.html', ''));
    return na - nb;
  });

  for (const s of slides) {
    const slidePath = path.join(slideDir, s);
    console.log(`Processing PPTX Slide: ${s}`);
    await html2pptx(slidePath, pptx);
  }
  await pptx.writeFile({ fileName: path.join(LESSON_DIR, 'Presentation.pptx') });
}

// --- ASSESSMENT GENERATION ---
async function generateAssessment() {
  const questions = [
    { q: "1. Which type of sentence has TWO independent clauses joined by a FANBOYS conjunction?", options: ["A. Simple", "B. Compound", "C. Complex", "D. Fragment"], ans: "B" },
    { q: "2. What does the 'B' in FANBOYS stand for?", options: ["A. Because", "B. But", "C. Briefly", "D. Before"], ans: "B" },
    { q: "3. 'Because the wind was strong, the plane crashed.' This is a...", options: ["A. Simple Sentence", "B. Compound Sentence", "C. Complex Sentence", "D. Run-on Sentence"], ans: "C" },
    { q: "4. Choose the correct FANBOYS: Dylan wanted to fly ___ he didn't have any paper.", options: ["A. so", "B. or", "C. but", "D. for"], ans: "C" },
    { q: "5. Which word is a subordinating conjunction?", options: ["A. And", "B. Although", "C. Yet", "D. So"], ans: "B" },
    { q: "6. A dependent clause...", options: ["A. Can stand alone", "B. Cannot stand alone", "C. Has no verb", "D. Is always at the end"], ans: "B" },
    { q: "7. Identify the complex sentence:", options: ["A. Dylan lives in Waleup.", "B. Dylan lives in Waleup and he likes planes.", "C. Since he lives in Waleup, it is very dusty.", "D. Waleup is dusty."], ans: "C" },
    { q: "8. Combine: 'He was tired. He kept practicing.'", options: ["A. He was tired and he kept practicing.", "B. Although he was tired, he kept practicing.", "C. He was tired so he kept practicing.", "D. He was tired."], ans: "B" },
    { q: "9. What is a 'clause'?", options: ["A. A group of words with a subject and verb", "B. A typo of Claus", "C. A punctuation mark", "D. A type of plane"], ans: "A" },
    { q: "10. In FANBOYS, 'Y' stands for:", options: ["A. Yes", "B. Yelling", "C. Yet", "D. Yesterday"], ans: "C" },
    { q: "11. SHORT ANSWER: Combine these using a compound structure: 'The sun was hot. The ground was dry.'", options: ["Type your answer here"], ans: "The sun was hot, and the ground was dry. (or similar)" },
    { q: "12. SHORT ANSWER: Combine these using 'because': 'Dylan won. He practiced hard.'", options: ["Type your answer here"], ans: "Dylan won because he practiced hard." },
    { q: "13. SHORT ANSWER: Identify the independent clause: 'When Dylan throws, the plane glides.'", options: ["Type your answer here"], ans: "the plane glides" },
    { q: "14. SHORT ANSWER: Write a complex sentence about Grandpa.", options: ["Type your answer here"], ans: "Varies" },
    { q: "15. SHORT ANSWER: Turn this simple sentence into a compound one: 'Jason laughed.'", options: ["Type your answer here"], ans: "Varies" },
  ];

  const docChildren = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "Sentence Flight Check (Compound & Complex)", bold: true, size: 32 })],
      spacing: { after: 400 }
    })
  ];

  questions.forEach(item => {
    docChildren.push(new Paragraph({
      children: [new TextRun({ text: item.q, bold: true })],
      spacing: { before: 200 }
    }));
    item.options.forEach(opt => {
      docChildren.push(new Paragraph({ children: [new TextRun({ text: opt })] }));
    });
    docChildren.push(new Paragraph({
      children: [new TextRun({ text: `ANS: ${item.ans}`, color: '999999' })],
      spacing: { after: 200 }
    }));
  });

  const doc = new Document({ sections: [{ children: docChildren }] });
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(path.join(LESSON_DIR, 'Assessment_Forms.docx'), buffer);
}

async function run() {
  console.log("Generating Handout...");
  await generateHandout();
  console.log("Generating PPTX...");
  await generatePresentation();
  console.log("Generating Assessment...");
  await generateAssessment();
  console.log("Done!");
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
