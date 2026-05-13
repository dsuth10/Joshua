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
          children: [new TextRun({ text: "Lesson 14: Visual Features & Effect", bold: true, size: 36, color: THEME.navy })],
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Name: ______________________   Date: _____________", size: 24 })],
          spacing: { after: 400 }
        }),
        
        // Overview Section
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun({ text: "Core Concepts Mastery", bold: true, size: 28, color: THEME.orange })],
          spacing: { before: 200, after: 200 }
        }),
        new Table({
          columnWidths: [3000, 6000],
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 3000, type: WidthType.DXA },
                  shading: { fill: THEME.navy },
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Visual Feature", bold: true, color: THEME.white })] })],
                  margins: { top: 150, bottom: 150, left: 150, right: 150 }
                }),
                new TableCell({
                  width: { size: 6000, type: WidthType.DXA },
                  shading: { fill: THEME.navy },
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Effect in Informative Texts", bold: true, color: THEME.white })] })],
                  margins: { top: 150, bottom: 150, left: 150, right: 150 }
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 3000, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun({ text: "Framing\n(Close-up vs. Wide shot)", bold: true })] })],
                  margins: { top: 150, bottom: 150, left: 150, right: 150 }
                }),
                new TableCell({
                  width: { size: 6000, type: WidthType.DXA },
                  children: [new Paragraph({ text: "Close-ups build immediate personal connection. Wide shots establish broad context and show immense geographic scale." })],
                  margins: { top: 150, bottom: 150, left: 150, right: 150 }
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 3000, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun({ text: "Salience\n(Focal Priority)", bold: true })] })],
                  margins: { top: 150, bottom: 150, left: 150, right: 150 }
                }),
                new TableCell({
                  width: { size: 6000, type: WidthType.DXA },
                  children: [new Paragraph({ text: "Draws the reader's eye first due to sharp contrast, foregrounding, or vivid colour. Highlights central themes immediately." })],
                  margins: { top: 150, bottom: 150, left: 150, right: 150 }
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 3000, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun({ text: "Placement\n(Page Position)", bold: true })] })],
                  margins: { top: 150, bottom: 150, left: 150, right: 150 }
                }),
                new TableCell({
                  width: { size: 6000, type: WidthType.DXA },
                  children: [new Paragraph({ text: "Guides the visual reading path. Anchors visual evidence directly adjacent to relevant data panels or expert pull quotes." })],
                  margins: { top: 150, bottom: 150, left: 150, right: 150 }
                })
              ]
            })
          ]
        }),

        // Visual Analysis Task
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun({ text: "Independent Visual Analysis", bold: true, size: 28, color: THEME.blue })],
          spacing: { before: 400, after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Instructions: Select a secondary image from the Floods Archive (e.g., the Riverine flooding infographic or the Moreton Bay sediment plume). Complete the graphic organiser below before writing your final analytical response.", size: 22 })],
          spacing: { after: 300 }
        }),
        new Table({
          columnWidths: [4500, 4500],
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 4500, type: WidthType.DXA },
                  shading: { fill: THEME.lightGrey },
                  children: [new Paragraph({ children: [new TextRun({ text: "1. What is shown in the image?", bold: true })] }), new Paragraph({ text: "\n\n\n" })],
                  margins: { top: 150, bottom: 150, left: 150, right: 150 }
                }),
                new TableCell({
                  width: { size: 4500, type: WidthType.DXA },
                  shading: { fill: THEME.lightGrey },
                  children: [new Paragraph({ children: [new TextRun({ text: "2. What draws your eye first (Salience)?", bold: true })] }), new Paragraph({ text: "\n\n\n" })],
                  margins: { top: 150, bottom: 150, left: 150, right: 150 }
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 4500, type: WidthType.DXA },
                  shading: { fill: THEME.lightGrey },
                  children: [new Paragraph({ children: [new TextRun({ text: "3. How is the image framed?", bold: true })] }), new Paragraph({ text: "\n\n\n" })],
                  margins: { top: 150, bottom: 150, left: 150, right: 150 }
                }),
                new TableCell({
                  width: { size: 4500, type: WidthType.DXA },
                  shading: { fill: THEME.lightGrey },
                  children: [new Paragraph({ children: [new TextRun({ text: "4. How does it connect to the written text?", bold: true })] }), new Paragraph({ text: "\n\n\n" })],
                  margins: { top: 150, bottom: 150, left: 150, right: 150 }
                })
              ]
            })
          ]
        }),

        // Written Response
        new Paragraph({
          children: [new TextRun({ text: "\nFinal Analytical Paragraph:", bold: true, size: 24 })],
          spacing: { before: 400, after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Use your scaffold notes to write a cohesive paragraph explaining how the author's visual choices create an effect on meaning.", size: 22, italics: true })],
          spacing: { after: 200 }
        }),
        new Paragraph({ text: "____________________________________________________________________________________________________" }),
        new Paragraph({ text: "____________________________________________________________________________________________________" }),
        new Paragraph({ text: "____________________________________________________________________________________________________" }),
        new Paragraph({ text: "____________________________________________________________________________________________________" }),
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
          children: [new TextRun({ text: "Lesson 14: Pictures Multiplication", bold: true, size: 36, color: THEME.navy })],
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Name: ______________________   Date: _____________", size: 24 })],
          spacing: { after: 400 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Trace the key feature labels below. Then, look at the Mud Army picture with your teacher and draw a line connecting the label to the correct part.", size: 24, italics: true })],
          spacing: { after: 400 }
        }),
        new Table({
          columnWidths: [4500, 4500],
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 4500, type: WidthType.DXA },
                  shading: { fill: THEME.lightGrey },
                  children: [new Paragraph({ text: "LABEL TO TRACE", bold: true, alignment: AlignmentType.CENTER })],
                  margins: { top: 150, bottom: 150, left: 150, right: 150 }
                }),
                new TableCell({
                  width: { size: 4500, type: WidthType.DXA },
                  shading: { fill: THEME.lightGrey },
                  children: [new Paragraph({ text: "WHAT IT SHOWS", bold: true, alignment: AlignmentType.CENTER })],
                  margins: { top: 150, bottom: 150, left: 150, right: 150 }
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 4500, type: WidthType.DXA },
                  children: [new Paragraph({ text: "FOREGROUND", size: 28, bold: true, color: THEME.blue, alignment: AlignmentType.CENTER })],
                  margins: { top: 200, bottom: 200, left: 200, right: 200 }
                }),
                new TableCell({
                  width: { size: 4500, type: WidthType.DXA },
                  children: [new Paragraph({ text: "The person placed closest to the front.", size: 22 })],
                  margins: { top: 200, bottom: 200, left: 200, right: 200 }
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 4500, type: WidthType.DXA },
                  children: [new Paragraph({ text: "MID-SHOT", size: 28, bold: true, color: THEME.orange, alignment: AlignmentType.CENTER })],
                  margins: { top: 200, bottom: 200, left: 200, right: 200 }
                }),
                new TableCell({
                  width: { size: 4500, type: WidthType.DXA },
                  children: [new Paragraph({ text: "Shows the volunteer working hard.", size: 22 })],
                  margins: { top: 200, bottom: 200, left: 200, right: 200 }
                })
              ]
            })
          ]
        }),
        new Paragraph({
          children: [new TextRun({ text: "\nComplete the sentence:", bold: true, size: 24 })],
          spacing: { before: 400, after: 200 }
        }),
        new Paragraph({ text: "This image shows __________________________________________________", spacing: { after: 200 } }),
        new Paragraph({ text: "I think this image was chosen because _________________________________", spacing: { after: 400 } }),
        
        // Drawing Box
        new Table({
          columnWidths: [9000],
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 9000, type: WidthType.DXA },
                  children: [
                    new Paragraph({ text: "Draw a picture showing community members working together after a flood:", italics: true, color: THEME.darkGrey }),
                    new Paragraph({ text: "\n\n\n\n\n\n\n\n" })
                  ],
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
      q: "1. Which visual feature refers to the distance and angle of the camera shot (e.g., close-up vs. wide shot)?",
      a: "A. Placement",
      b: "B. Framing",
      c: "C. Salience",
      d: "D. Font size",
      ans: "B"
    },
    {
      q: "2. What does 'salience' mean when analyzing an image in an informative text?",
      a: "A. The element that draws the reader's eye first due to size, colour, or contrast.",
      b: "B. The page number where the image is found.",
      c: "C. The number of words in the caption.",
      d: "D. The total cost of taking the photograph.",
      ans: "A"
    },
    {
      q: "3. Why might an author choose a wide-shot photograph of floodwaters covering an entire town?",
      a: "A. To show the fine details of a single leaf.",
      b: "B. To make the reader laugh.",
      c: "C. To establish the immense geographic scale and widespread destruction.",
      d: "D. To hide the flood from the audience.",
      ans: "C"
    },
    {
      q: "4. Where an image sits on a page relative to subheadings and sidebars is known as:",
      a: "A. Framing",
      b: "B. Placement",
      c: "C. Shading",
      d: "D. Spelling",
      ans: "B"
    },
    {
      q: "5. How does a photograph of community volunteers working together support an informative text about recovery?",
      a: "A. It proves that no one helped.",
      b: "B. It provides visual evidence of shared human effort and resilience.",
      c: "C. It shows that floods only happen in winter.",
      d: "D. It replaces the need for any headings.",
      ans: "B"
    },
    {
      q: "6. What is the effect of placing an image directly below an expert quote or important statistic?",
      a: "A. It anchors the abstract data in immediate physical reality.",
      b: "B. It makes the text harder to read.",
      c: "C. It deletes the quote.",
      d: "D. It changes the font colour automatically.",
      ans: "A"
    },
    {
      q: "7. Which feature describes the structural arrangement of text blocks, images, borders, and captions across the document?",
      a: "A. Foregrounding",
      b: "B. Layout",
      c: "C. Dialogue",
      d: "D. Syllables",
      ans: "B"
    },
    {
      q: "8. If an author places a key figure closest to the front of an image, this technique is called:",
      a: "A. Backgrounding",
      b: "B. Foregrounding",
      c: "C. Reversing",
      d: "D. Scanning",
      ans: "B"
    },
    {
      q: "9. Why do informative texts include informative diagrams and scientific infographics alongside photographs?",
      a: "A. Because photographs cannot be printed.",
      b: "B. To present complex scientific mechanisms clearly without causing cognitive overload.",
      c: "C. To make the document weigh more.",
      d: "D. To avoid using full sentences.",
      ans: "B"
    },
    {
      q: "10. Which statement best explains the connection between visual features and written text?",
      a: "A. Visual features act independently and have no connection to the words.",
      b: "B. Images are chosen purely to make the page look colourful.",
      c: "C. Visual features multiply and reinforce the text's meaning to create a specific effect on the reader.",
      d: "D. Readers should always skip looking at images.",
      ans: "C"
    }
  ];

  const children = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "Lesson 14: Visual Features Assessment", bold: true, size: 36, color: THEME.navy })],
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
  console.log("Starting resource generation for Lesson 14...");
  
  const slidesDir = "c:\\Users\\dsuth\\Documents\\Joshua\\Units\\English\\English_Unit_2\\Lesson_Plans\\Presentations\\Lesson_14_Slides";
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
  
  const pptxPath = path.join(slidesDir, "..", "Lesson_14_Presentation.pptx");
  if (fs.existsSync(path.join(slidesDir, "slide_1.html"))) {
    await generatePresentation(pptxPath, slidePaths);
  } else {
    console.log("⚠️ Slides not found. Skipping PPT generation.");
  }
  
  const handoutsDir = "c:\\Users\\dsuth\\Documents\\Joshua\\Units\\English\\English_Unit_2\\Lesson_Plans\\Handouts";
  if (!fs.existsSync(handoutsDir)) fs.mkdirSync(handoutsDir, { recursive: true });

  const worksheetPath = path.join(handoutsDir, "Lesson_14_Worksheet.docx");
  await generateWorksheet(worksheetPath);
  
  const lucasHandoutPath = path.join(handoutsDir, "Lesson_14_Lucas_Handout.docx");
  await generateLucasHandout(lucasHandoutPath);

  const assessmentPath = path.join("c:\\Users\\dsuth\\Documents\\Joshua\\Units\\English\\English_Unit_2\\Lesson_Plans", "Lesson_14_Assessment.docx");
  await generateAssessment(assessmentPath);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
