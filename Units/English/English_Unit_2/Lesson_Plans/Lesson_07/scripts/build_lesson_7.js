const { Document, Packer, Paragraph, TextRun, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType } = require('docx');
const pptxgen = require('pptxgenjs');
const fs = require('fs');
const path = require('path');
const html2pptx = require('c:\\Users\\dsuth\\Documents\\Joshua\\.agent\\skills\\pptx\\scripts\\html2pptx');

const THEME = { navy: '112d4e', orange: 'f96d00', white: 'f9f7f7', blue: '3f72af' };

async function generateHandout(filename) {
  const tableRows = [
    new TableRow({
      children: [
        new TableCell({
          shading: { fill: THEME.blue },
          width: { size: 10, type: WidthType.PERCENTAGE },
          children: [new Paragraph({ children: [new TextRun({ text: "Fact #", bold: true, color: THEME.white })] })],
        }),
        new TableCell({
          shading: { fill: THEME.blue },
          width: { size: 40, type: WidthType.PERCENTAGE },
          children: [new Paragraph({ children: [new TextRun({ text: "The Fact (Impact of Mahina)", bold: true, color: THEME.white })] })],
        }),
        new TableCell({
          shading: { fill: THEME.blue },
          width: { size: 25, type: WidthType.PERCENTAGE },
          children: [new Paragraph({ children: [new TextRun({ text: "Strategy Used", bold: true, color: THEME.white })] })],
        }),
        new TableCell({
          shading: { fill: THEME.blue },
          width: { size: 25, type: WidthType.PERCENTAGE },
          children: [new Paragraph({ children: [new TextRun({ text: "Location (Heading)", bold: true, color: THEME.white })] })],
        }),
      ],
    })
  ];

  for (let i = 1; i <= 3; i++) {
    tableRows.push(
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: `${i}`, bold: true, size: 28, color: THEME.navy })
                ],
                alignment: AlignmentType.CENTER
              })
            ]
          }),
          new TableCell({ children: [new Paragraph({ text: "\n\n\n\n\n\n\n\n" })] }),
          new TableCell({ children: [new Paragraph({ text: "\n\n\n\n\n\n\n\n" })] }),
          new TableCell({ children: [new Paragraph({ text: "\n\n\n\n\n\n\n\n" })] }),
        ],
      })
    );
  }

  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "Lesson 7: Fact Finding", bold: true, size: 32, color: THEME.navy })],
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Name: ______________________   Date: _____________", size: 24 })],
          spacing: { after: 400 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Instructions: Find three facts about the impacts of Cyclone Mahina. Record the fact, the strategy you used to find it (Skim, Scan, Confirm), and the heading where you found it.", size: 24, italics: true })],
          spacing: { after: 400 }
        }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: tableRows,
        }),
      ]
    }]
  });
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(filename, buffer);
  console.log("✅ Core Handout generated.");
}

async function generateLucasHandout(filename) {
  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "Lesson 7: Finding Facts", bold: true, size: 32, color: THEME.navy })],
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Name: ______________________   Date: _____________", size: 24 })],
          spacing: { after: 400 }
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "What is one impact of Cyclone Mahina?", bold: true, size: 28, color: THEME.orange })],
          spacing: { after: 400 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Draw a picture of the impact here:", size: 24, italics: true })],
          spacing: { after: 200 }
        }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ text: "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n" })],
                  borders: {
                    top: { style: BorderStyle.SINGLE, size: 3, color: THEME.blue },
                    bottom: { style: BorderStyle.SINGLE, size: 3, color: THEME.blue },
                    left: { style: BorderStyle.SINGLE, size: 3, color: THEME.blue },
                    right: { style: BorderStyle.SINGLE, size: 3, color: THEME.blue },
                  }
                })
              ]
            })
          ]
        }),
        new Paragraph({
          children: [new TextRun({ text: "Write about your picture:", size: 24, italics: true })],
          spacing: { before: 400, after: 200 }
        }),
        new Paragraph({ text: "____________________________________________________________________________________", spacing: { after: 400 } }),
        new Paragraph({ text: "____________________________________________________________________________________", spacing: { after: 400 } }),
        new Paragraph({ text: "____________________________________________________________________________________", spacing: { after: 400 } }),
      ]
    }]
  });
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(filename, buffer);
  console.log("✅ Lucas Handout generated.");
}

async function generatePresentation(filename, slidePaths) {
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
  await pptx.writeFile({ fileName: filename });
  console.log("✅ PPTX generated.");
}

async function run() {
  console.log("Starting resource generation...");
  
  const slidesDir = "c:\\Users\\dsuth\\Documents\\Joshua\\Units\\English\\English_Unit_2\\Lesson_Plans\\Presentations\\Lesson_07_Slides";
  const slidePaths = [
    path.join(slidesDir, "slide_1.html"),
    path.join(slidesDir, "slide_2.html"),
    path.join(slidesDir, "slide_3.html"),
    path.join(slidesDir, "slide_4.html"),
    path.join(slidesDir, "slide_5.html"),
    path.join(slidesDir, "slide_6.html"),
    path.join(slidesDir, "slide_7.html"),
    path.join(slidesDir, "slide_8.html")
  ];
  
  const pptxPath = path.join(slidesDir, "..", "Lesson_07_Presentation.pptx");
  await generatePresentation(pptxPath, slidePaths);
  
  const handoutPath = "c:\\Users\\dsuth\\Documents\\Joshua\\Units\\English\\English_Unit_2\\Lesson_Plans\\Handouts\\Lesson_07_Handout_Fact_Finding_Mahina.docx";
  await generateHandout(handoutPath);
  
  const lucasHandoutPath = "c:\\Users\\dsuth\\Documents\\Joshua\\Units\\English\\English_Unit_2\\Lesson_Plans\\Handouts\\Lesson_07_Handout_Lucas_Mahina.docx";
  await generateLucasHandout(lucasHandoutPath);
}

run().catch(console.error);
