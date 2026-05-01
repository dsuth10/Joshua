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
          children: [new Paragraph({ children: [new TextRun({ text: "Heading (Cyclone Mahina)", bold: true, color: THEME.white })] })],
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
    "The Wave That Moved Dolphins Inland",
    "A Disaster Without Warning",
    "Fast Facts",
    "The Forgotten Voices of the Lugger Fleet",
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
          children: [new TextRun({ text: "Instructions: Look at each heading from the Cyclone Mahina website below. First, write down an estimation of what you think the topic will be about just by reading the heading. Then, read that section of text on the website and write down what you found it was actually about.", size: 24, italics: true })],
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

async function generateLucasHandout(filename) {
  const tableRows = [
    new TableRow({
      children: [
        new TableCell({
          shading: { fill: THEME.blue },
          width: { size: 50, type: WidthType.PERCENTAGE },
          children: [new Paragraph({ children: [new TextRun({ text: "1. What is the main heading?", bold: true, color: THEME.white, size: 28 })] })],
        }),
        new TableCell({
          width: { size: 50, type: WidthType.PERCENTAGE },
          children: [new Paragraph({ text: "\n\n\n\n\n" })]
        })
      ]
    }),
    new TableRow({
      children: [
        new TableCell({
          shading: { fill: THEME.blue },
          children: [new Paragraph({ children: [new TextRun({ text: "2. Draw a picture of the first image you see.", bold: true, color: THEME.white, size: 28 })] })],
        }),
        new TableCell({
          children: [new Paragraph({ text: "\n\n\n\n\n\n\n\n" })]
        })
      ]
    }),
    new TableRow({
      children: [
        new TableCell({
          shading: { fill: THEME.blue },
          children: [new Paragraph({ children: [new TextRun({ text: "3. What are the first two sentences about?", bold: true, color: THEME.white, size: 28 })] })],
        }),
        new TableCell({
          children: [new Paragraph({ text: "\n\n\n\n\n\n" })]
        })
      ]
    })
  ];

  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "Lesson 6: Cyclone Mahina Structures", bold: true, size: 32, color: THEME.navy })],
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Name: ______________________   Date: _____________", size: 24 })],
          spacing: { after: 400 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Instructions: Read the Cyclone Mahina page. Write or draw what you find in the boxes below.", size: 24, italics: true })],
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
  console.log("✅ Lucas Handout generated.");
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
  await generatePresentation(pptxPath, slidePaths);
  
  const handoutPath = "c:\\Users\\dsuth\\Documents\\Joshua\\Units\\English\\English_Unit_2\\Lesson_Plans\\Handouts\\Lesson_06_Handout_Predict_Mahina.docx";
  await generateHandout(handoutPath);
  
  const lucasHandoutPath = "c:\\Users\\dsuth\\Documents\\Joshua\\Units\\English\\English_Unit_2\\Lesson_Plans\\Handouts\\Lesson_06_Handout_Lucas_Mahina.docx";
  await generateLucasHandout(lucasHandoutPath);
}

run().catch(console.error);
