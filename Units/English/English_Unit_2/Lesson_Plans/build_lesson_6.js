const { Document, Packer, Paragraph, TextRun, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType, ImageRun } = require('docx');
const pptxgen = require('pptxgenjs');
const fs = require('fs');
const path = require('path');
const html2pptx = require('c:\\Users\\dsuth\\Documents\\Joshua\\.agent\\skills\\pptx\\scripts\\html2pptx');

const THEME = { navy: '112d4e', orange: 'f96d00', white: 'f9f7f7', blue: '3f72af' };

async function generateHandout(filename) {
  const sizeOf = require('image-size');
  
  const tableRows = [
    new TableRow({
      children: [
        new TableCell({
          shading: { fill: THEME.blue },
          width: { size: 25, type: WidthType.PERCENTAGE },
          children: [new Paragraph({ children: [new TextRun({ text: "Heading (Cyclone George)", bold: true, color: THEME.white })] })],
        }),
        new TableCell({
          shading: { fill: THEME.blue },
          width: { size: 35, type: WidthType.PERCENTAGE },
          children: [new Paragraph({ children: [new TextRun({ text: "Estimation (What I think it is about)", bold: true, color: THEME.white })] })],
        }),
        new TableCell({
          shading: { fill: THEME.blue },
          width: { size: 40, type: WidthType.PERCENTAGE },
          children: [new Paragraph({ children: [new TextRun({ text: "Actual Content (What it is actually about)", bold: true, color: THEME.white })] })],
        }),
      ],
    })
  ];

  const headings = [
    "The Human Cost",
    "A Global Tremor",
    "From the Pilbara to the World: How One Cyclone Shook Global Markets",
    "The Pilbara After George",
    "Track of the Storm",
    "The Front Pages"
  ];

  for (const headingText of headings) {
    tableRows.push(
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: headingText, bold: true, size: 28, color: THEME.navy })
                ]
              })
            ]
          }),
          new TableCell({ children: [new Paragraph({ text: "\n\n\n\n\n\n" })] }),
          new TableCell({ children: [new Paragraph({ text: "\n\n\n\n\n\n" })] }),
        ],
      })
    );
  }

  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "Lesson 6: Scan and Predict", bold: true, size: 32, color: THEME.navy })],
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Name: ______________________   Date: _____________", size: 24 })],
          spacing: { after: 400 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Instructions: Look at each heading from the Cyclone George website below. First, write down an estimation of what you think the topic will be about just by reading the heading. Then, read that section of text on the website and write down what you found it was actually about.", size: 24, italics: true })],
          spacing: { after: 200 }
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
  console.log("✅ Handout generated.");
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
  
  const slidesDir = "c:\\Users\\dsuth\\Documents\\Joshua\\Units\\English\\English_Unit_2\\Lesson_Plans\\Presentations\\Lesson_06_Slides";
  const slidePaths = [
    path.join(slidesDir, "slide_1.html"),
    path.join(slidesDir, "slide_2.html"),
    path.join(slidesDir, "slide_3.html"),
    path.join(slidesDir, "slide_4.html"),
    path.join(slidesDir, "slide_5.html"),
    path.join(slidesDir, "slide_6.html")
  ];
  
  const pptxPath = path.join(slidesDir, "..", "Lesson_06_Presentation.pptx");
  // await generatePresentation(pptxPath, slidePaths);
  
  const handoutPath = "c:\\Users\\dsuth\\Documents\\Joshua\\Units\\English\\English_Unit_2\\Lesson_Plans\\Handouts\\Lesson_06_Handout_Predict.docx";
  await generateHandout(handoutPath);
}

run().catch(console.error);
