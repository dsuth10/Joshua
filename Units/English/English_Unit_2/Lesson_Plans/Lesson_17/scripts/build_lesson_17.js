const { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType } = require('docx');
const pptxgen = require('pptxgenjs');
const fs = require('fs');
const path = require('path');
const html2pptx = require('c:\\Users\\dsuth\\Documents\\Joshua\\.agent\\skills\\pptx\\scripts\\html2pptx');

const THEME = { navy: '112d4e', orange: 'f96d00', white: 'f9f7f7', blue: '3f72af', darkGrey: '333333', lightGrey: 'e0e0e0' };

async function generateWorksheet(filename) {
  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "Lesson 17: Information Report Planning Scaffold", bold: true, size: 36, color: THEME.navy })],
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Name: ______________________   Date: _____________", size: 24 })],
          spacing: { after: 400 }
        }),
        
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun({ text: "Part 1: Topic Selection", bold: true, size: 28, color: THEME.orange })],
          spacing: { before: 200, after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "My chosen natural disaster is: __________________________________________________", size: 24 })],
          spacing: { after: 200 }
        }),
        
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun({ text: "Part 2: Structural Planning", bold: true, size: 28, color: THEME.blue })],
          spacing: { before: 200, after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Use the sections below to plan the structure of your information report. Include at least 3 facts from your research.", size: 22 })],
          spacing: { after: 200 }
        }),
        
        new Table({
          columnWidths: [3000, 6000],
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 3000, type: WidthType.DXA },
                  shading: { fill: THEME.navy },
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Structural Stage", bold: true, color: THEME.white })] })],
                  margins: { top: 150, bottom: 150, left: 150, right: 150 }
                }),
                new TableCell({
                  width: { size: 6000, type: WidthType.DXA },
                  shading: { fill: THEME.navy },
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Notes and Facts", bold: true, color: THEME.white })] })],
                  margins: { top: 150, bottom: 150, left: 150, right: 150 }
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 3000, type: WidthType.DXA },
                  children: [new Paragraph({ text: "1. General Statement\n(Classification / Definition)" })],
                  margins: { top: 150, bottom: 150, left: 150, right: 150 }
                }),
                new TableCell({
                  width: { size: 6000, type: WidthType.DXA },
                  children: [new Paragraph({ text: "\n\n\n" })],
                  margins: { top: 150, bottom: 150, left: 150, right: 150 }
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 3000, type: WidthType.DXA },
                  children: [new Paragraph({ text: "2. Physical Description\n(What causes it? Science)" })],
                  margins: { top: 150, bottom: 150, left: 150, right: 150 }
                }),
                new TableCell({
                  width: { size: 6000, type: WidthType.DXA },
                  children: [new Paragraph({ text: "\n\n\n" })],
                  margins: { top: 150, bottom: 150, left: 150, right: 150 }
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 3000, type: WidthType.DXA },
                  children: [new Paragraph({ text: "3. Historical Events\n(Famous examples)" })],
                  margins: { top: 150, bottom: 150, left: 150, right: 150 }
                }),
                new TableCell({
                  width: { size: 6000, type: WidthType.DXA },
                  children: [new Paragraph({ text: "\n\n\n" })],
                  margins: { top: 150, bottom: 150, left: 150, right: 150 }
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 3000, type: WidthType.DXA },
                  children: [new Paragraph({ text: "4. Human Impact\n(How it affects people)" })],
                  margins: { top: 150, bottom: 150, left: 150, right: 150 }
                }),
                new TableCell({
                  width: { size: 6000, type: WidthType.DXA },
                  children: [new Paragraph({ text: "\n\n\n" })],
                  margins: { top: 150, bottom: 150, left: 150, right: 150 }
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 3000, type: WidthType.DXA },
                  children: [new Paragraph({ text: "5. Future / Response\n(Preparation and prevention)" })],
                  margins: { top: 150, bottom: 150, left: 150, right: 150 }
                }),
                new TableCell({
                  width: { size: 6000, type: WidthType.DXA },
                  children: [new Paragraph({ text: "\n\n\n" })],
                  margins: { top: 150, bottom: 150, left: 150, right: 150 }
                })
              ]
            })
          ]
        })
      ]
    }]
  });
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(filename, buffer);
  console.log("✅ Main Worksheet generated.");
}

async function generateLucasHandout(filename) {
  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "Lesson 17: My Information Report Plan", bold: true, size: 36, color: THEME.navy })],
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Name: ______________________   Date: _____________", size: 24 })],
          spacing: { after: 400 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "My topic is:", bold: true, size: 28 })],
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "______________________________________________________________________", size: 24 })],
          spacing: { after: 400 }
        }),
        
        new Paragraph({
          children: [new TextRun({ text: "I will write about three things:", bold: true, size: 28 })],
          spacing: { after: 200 }
        }),
        
        new Paragraph({ text: "1. ___________________________________________________________________", size: 24, spacing: { after: 300 } }),
        new Paragraph({ text: "2. ___________________________________________________________________", size: 24, spacing: { after: 300 } }),
        new Paragraph({ text: "3. ___________________________________________________________________", size: 24, spacing: { after: 400 } }),
        
        new Paragraph({
          children: [new TextRun({ text: "I will include a picture of:", bold: true, size: 28 })],
          spacing: { after: 200 }
        }),
        new Paragraph({ text: "______________________________________________________________________", size: 24, spacing: { after: 300 } }),
        
        new Paragraph({
          children: [new TextRun({ text: "Draw your picture here:", bold: true, size: 28 })],
          spacing: { before: 200, after: 200 }
        }),
        new Table({
          columnWidths: [9000],
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 9000, type: WidthType.DXA },
                  children: [new Paragraph({ text: "\n\n\n\n\n\n\n\n\n\n" })],
                  margins: { top: 200, bottom: 200, left: 200, right: 200 }
                })
              ]
            })
          ]
        })
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
      q: "1. Why is it important to plan an information report before writing?",
      a: "A. It wastes time.",
      b: "B. It helps organize ideas and structure the text.",
      c: "C. It is the only way to get a good grade.",
      d: "D. It lets you skip the research phase.",
      ans: "B"
    },
    {
      q: "2. What is the first structural stage of an information report?",
      a: "A. Historical Events",
      b: "B. Human Impact",
      c: "C. General Statement (Classification)",
      d: "D. Summary",
      ans: "C"
    },
    {
      q: "3. What type of information belongs in the 'Physical Description' or 'Science' section?",
      a: "A. The causes and scientific explanation of the disaster.",
      b: "B. A story about a family.",
      c: "C. The author's opinion on the event.",
      d: "D. A list of website links.",
      ans: "A"
    },
    {
      q: "4. If you are writing about the 2009 Black Saturday bushfires, which section does this belong in?",
      a: "A. General Statement",
      b: "B. Physical Description",
      c: "C. Historical Events",
      d: "D. Future Preparation",
      ans: "C"
    },
    {
      q: "5. What is the purpose of the 'Human Impact' section?",
      a: "A. To describe what animals eat.",
      b: "B. To explain how the disaster affects people and communities.",
      c: "C. To talk about the weather.",
      d: "D. To give advice on how to build a house.",
      ans: "B"
    },
    {
      q: "6. Which section would include information on 'building better flood defenses'?",
      a: "A. General Statement",
      b: "B. Future / Response (Preparation)",
      c: "C. Historical Events",
      d: "D. Human Impact",
      ans: "B"
    },
    {
      q: "7. How can the Bushfires Archive help you plan your own report?",
      a: "A. You can copy the text exactly.",
      b: "B. You can look at the pictures only.",
      c: "C. It serves as a structural model for how to organize your ideas.",
      d: "D. It is not helpful for planning.",
      ans: "C"
    },
    {
      q: "8. When researching facts for your plan, what kind of sources should you use?",
      a: "A. Only social media posts.",
      b: "B. Authoritative and credible sources.",
      c: "C. Any random website you find.",
      d: "D. Fiction books.",
      ans: "B"
    },
    {
      q: "9. True or False: An information report should have a clear structure so the reader can easily find and understand the information.",
      a: "A. True",
      b: "B. False",
      c: "C. Only for short reports",
      d: "D. Only for long reports",
      ans: "A"
    },
    {
      q: "10. In a plan, what does 'Classification' mean?",
      a: "A. Keeping the information secret.",
      b: "B. Identifying and defining the topic being written about.",
      c: "C. Sorting information alphabetically.",
      d: "D. Rating the disaster from 1 to 10.",
      ans: "B"
    }
  ];

  const children = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "Lesson 17: Information Report Structure Assessment", bold: true, size: 36, color: THEME.navy })],
      spacing: { after: 400 }
    })
  ];

  questions.forEach(item => {
    children.push(new Paragraph({ children: [new TextRun({ text: item.q, bold: true, size: 24 })], spacing: { before: 200 } }));
    children.push(new Paragraph({ children: [new TextRun({ text: item.a, size: 24 })] }));
    children.push(new Paragraph({ children: [new TextRun({ text: item.b, size: 24 })] }));
    children.push(new Paragraph({ children: [new TextRun({ text: item.c, size: 24 })] }));
    children.push(new Paragraph({ children: [new TextRun({ text: item.d, size: 24 })] }));
    children.push(new Paragraph({ children: [new TextRun({ text: `ANS: ${item.ans}`, bold: true, size: 24 })], spacing: { after: 200 } }));
  });

  const doc = new Document({
    sections: [{ children }]
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(filename, buffer);
  console.log("✅ Assessment generated.");
}

async function generatePresentation(filename, slidePaths) {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';

  for (const s of slidePaths) {
    console.log(`Processing: ${path.basename(s)}`);
    await html2pptx(s, pptx, { ignoreValidation: true });
    console.log(`✅ Processed: ${path.basename(s)}`);
  }
  await pptx.writeFile({ fileName: filename });
  console.log("✅ PPTX generated.");
}

async function run() {
  console.log("Starting resource generation for Lesson 17...");
  
  const baseDir = path.join(__dirname, "..");
  const slidesDir = path.join(baseDir, "Lesson_17_Slides");
  
  const slidePaths = [
    path.join(slidesDir, "slide_1.html"),
    path.join(slidesDir, "slide_2.html"),
    path.join(slidesDir, "slide_3.html"),
    path.join(slidesDir, "slide_4.html"),
    path.join(slidesDir, "slide_5.html"),
    path.join(slidesDir, "slide_6.html"),
    path.join(slidesDir, "slide_7.html")
  ];
  
  const pptxPath = path.join(baseDir, "Lesson_17_Presentation.pptx");
  if (fs.existsSync(slidePaths[0])) {
    await generatePresentation(pptxPath, slidePaths);
  } else {
    console.log("⚠️ Slides not found. Skipping PPT generation.");
  }
  
  const worksheetPath = path.join(baseDir, "Lesson_17_Worksheet.docx");
  await generateWorksheet(worksheetPath);
  
  const lucasHandoutPath = path.join(baseDir, "Lesson_17_Lucas_Handout.docx");
  await generateLucasHandout(lucasHandoutPath);

  const assessmentPath = path.join(baseDir, "Lesson_17_Assessment.docx");
  await generateAssessment(assessmentPath);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
