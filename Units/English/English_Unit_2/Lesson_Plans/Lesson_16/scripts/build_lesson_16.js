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
          children: [new TextRun({ text: "Lesson 16: Differing Ideas & Authoritative Sources", bold: true, size: 36, color: THEME.navy })],
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Name: ______________________   Date: _____________", size: 24 })],
          spacing: { after: 400 }
        }),
        
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun({ text: "Part 1: Identifying Authoritative Sources", bold: true, size: 28, color: THEME.orange })],
          spacing: { before: 200, after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Read each source description. Would it be an authoritative source for a report on floods? Why or why not?", size: 22 })],
          spacing: { after: 200 }
        }),
        
        new Table({
          columnWidths: [4000, 5000],
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 4000, type: WidthType.DXA },
                  shading: { fill: THEME.navy },
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Source Description", bold: true, color: THEME.white })] })],
                  margins: { top: 150, bottom: 150, left: 150, right: 150 }
                }),
                new TableCell({
                  width: { size: 5000, type: WidthType.DXA },
                  shading: { fill: THEME.navy },
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Is it authoritative? Why?", bold: true, color: THEME.white })] })],
                  margins: { top: 150, bottom: 150, left: 150, right: 150 }
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 4000, type: WidthType.DXA },
                  children: [new Paragraph({ text: "A post on social media by someone who heard it rained a lot in Brisbane." })],
                  margins: { top: 150, bottom: 150, left: 150, right: 150 }
                }),
                new TableCell({
                  width: { size: 5000, type: WidthType.DXA },
                  children: [new Paragraph({ text: "\n\n" })],
                  margins: { top: 150, bottom: 150, left: 150, right: 150 }
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 4000, type: WidthType.DXA },
                  children: [new Paragraph({ text: "A report published by the Bureau of Meteorology (BOM)." })],
                  margins: { top: 150, bottom: 150, left: 150, right: 150 }
                }),
                new TableCell({
                  width: { size: 5000, type: WidthType.DXA },
                  children: [new Paragraph({ text: "\n\n" })],
                  margins: { top: 150, bottom: 150, left: 150, right: 150 }
                })
              ]
            })
          ]
        }),

        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun({ text: "Part 2: Moving Beyond Assertions", bold: true, size: 28, color: THEME.blue })],
          spacing: { before: 400, after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Choose a topic about floods (e.g., preparation, causes, or historical events).", size: 22 })],
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "1. Write a Bare Assertion about this topic:", bold: true, size: 24 })],
          spacing: { before: 200, after: 100 }
        }),
        new Paragraph({ text: "____________________________________________________________________________________________________" }),
        new Paragraph({ text: "____________________________________________________________________________________________________" }),
        
        new Paragraph({
          children: [new TextRun({ text: "2. Rewrite the idea as a Supported Claim using an authoritative source from the Floods Archive. Try to acknowledge a differing viewpoint (e.g., 'While some believe...'):", bold: true, size: 24 })],
          spacing: { before: 400, after: 100 }
        }),
        new Paragraph({ text: "____________________________________________________________________________________________________" }),
        new Paragraph({ text: "____________________________________________________________________________________________________" }),
        new Paragraph({ text: "____________________________________________________________________________________________________" }),
        new Paragraph({ text: "____________________________________________________________________________________________________" })
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
          children: [new TextRun({ text: "Lesson 16: Fact or Opinion?", bold: true, size: 36, color: THEME.navy })],
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Name: ______________________   Date: _____________", size: 24 })],
          spacing: { after: 400 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Read the sentences below. Is it a FACT (something we can prove) or an OPINION (what someone thinks)? Circle the correct answer.", size: 24, italics: true })],
          spacing: { after: 400 }
        }),
        
        new Table({
          columnWidths: [6000, 3000],
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 6000, type: WidthType.DXA },
                  shading: { fill: THEME.lightGrey },
                  children: [new Paragraph({ text: "Sentence", bold: true, alignment: AlignmentType.CENTER })],
                  margins: { top: 150, bottom: 150, left: 150, right: 150 }
                }),
                new TableCell({
                  width: { size: 3000, type: WidthType.DXA },
                  shading: { fill: THEME.lightGrey },
                  children: [new Paragraph({ text: "Fact or Opinion?", bold: true, alignment: AlignmentType.CENTER })],
                  margins: { top: 150, bottom: 150, left: 150, right: 150 }
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 6000, type: WidthType.DXA },
                  children: [new Paragraph({ text: "Floods caused damage to 100 homes.", size: 24 })],
                  margins: { top: 200, bottom: 200, left: 200, right: 200 }
                }),
                new TableCell({
                  width: { size: 3000, type: WidthType.DXA },
                  children: [new Paragraph({ text: "FACT   /   OPINION", size: 22, alignment: AlignmentType.CENTER, bold: true })],
                  margins: { top: 200, bottom: 200, left: 200, right: 200 }
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 6000, type: WidthType.DXA },
                  children: [new Paragraph({ text: "I think floods are very scary.", size: 24 })],
                  margins: { top: 200, bottom: 200, left: 200, right: 200 }
                }),
                new TableCell({
                  width: { size: 3000, type: WidthType.DXA },
                  children: [new Paragraph({ text: "FACT   /   OPINION", size: 22, alignment: AlignmentType.CENTER, bold: true })],
                  margins: { top: 200, bottom: 200, left: 200, right: 200 }
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 6000, type: WidthType.DXA },
                  children: [new Paragraph({ text: "The Brisbane River flooded in 2011 and 2022.", size: 24 })],
                  margins: { top: 200, bottom: 200, left: 200, right: 200 }
                }),
                new TableCell({
                  width: { size: 3000, type: WidthType.DXA },
                  children: [new Paragraph({ text: "FACT   /   OPINION", size: 22, alignment: AlignmentType.CENTER, bold: true })],
                  margins: { top: 200, bottom: 200, left: 200, right: 200 }
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 6000, type: WidthType.DXA },
                  children: [new Paragraph({ text: "Rain is the worst type of weather.", size: 24 })],
                  margins: { top: 200, bottom: 200, left: 200, right: 200 }
                }),
                new TableCell({
                  width: { size: 3000, type: WidthType.DXA },
                  children: [new Paragraph({ text: "FACT   /   OPINION", size: 22, alignment: AlignmentType.CENTER, bold: true })],
                  margins: { top: 200, bottom: 200, left: 200, right: 200 }
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 6000, type: WidthType.DXA },
                  children: [new Paragraph({ text: "Floods happen when there is too much water.", size: 24 })],
                  margins: { top: 200, bottom: 200, left: 200, right: 200 }
                }),
                new TableCell({
                  width: { size: 3000, type: WidthType.DXA },
                  children: [new Paragraph({ text: "FACT   /   OPINION", size: 22, alignment: AlignmentType.CENTER, bold: true })],
                  margins: { top: 200, bottom: 200, left: 200, right: 200 }
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 6000, type: WidthType.DXA },
                  children: [new Paragraph({ text: "Everyone hates having to clean up mud.", size: 24 })],
                  margins: { top: 200, bottom: 200, left: 200, right: 200 }
                }),
                new TableCell({
                  width: { size: 3000, type: WidthType.DXA },
                  children: [new Paragraph({ text: "FACT   /   OPINION", size: 22, alignment: AlignmentType.CENTER, bold: true })],
                  margins: { top: 200, bottom: 200, left: 200, right: 200 }
                })
              ]
            })
          ]
        }),
        
        new Paragraph({
          children: [new TextRun({ text: "\nNow it's your turn!", bold: true, size: 28 })],
          spacing: { before: 400, after: 200 }
        }),
        new Paragraph({ text: "Write one OPINION about floods:", bold: true, size: 24, spacing: { after: 100 } }),
        new Paragraph({ text: "I think ________________________________________________________________", spacing: { after: 300 } }),
        new Paragraph({ text: "Write one FACT about floods (Hint: Look at the Floods Archive!):", bold: true, size: 24, spacing: { after: 100 } }),
        new Paragraph({ text: "______________________________________________________________________", spacing: { after: 300 } })
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
      q: "1. What is a bare assertion?",
      a: "A. A statement of fact supported by evidence.",
      b: "B. A claim made without providing any evidence or source.",
      c: "C. A quote from an expert.",
      d: "D. A detailed report on a natural disaster.",
      ans: "B"
    },
    {
      q: "2. Which of the following is an example of a supported claim?",
      a: "A. Floods are dangerous.",
      b: "B. Earthquakes happen all the time.",
      c: "C. According to the Bureau of Meteorology, 500mm of rain fell in three days.",
      d: "D. Bushfires are very hot and scary.",
      ans: "C"
    },
    {
      q: "3. What makes a source 'authoritative'?",
      a: "A. It was written quickly.",
      b: "B. It has experience, qualifications, and comes from a reliable publisher.",
      c: "C. It has a lot of colorful pictures.",
      d: "D. It is found on social media.",
      ans: "B"
    },
    {
      q: "4. Which of these is the MOST authoritative source for information about flood damage?",
      a: "A. A post on an internet blog.",
      b: "B. An official report by the State Emergency Service (SES).",
      c: "C. A fictional story about a flood.",
      d: "D. A rumour heard on the playground.",
      ans: "B"
    },
    {
      q: "5. Why should an informative text include authoritative sources?",
      a: "A. To make the text longer.",
      b: "B. To make the reader laugh.",
      c: "C. To provide evidence that makes the claims credible and trustworthy.",
      d: "D. To hide the author's true opinion.",
      ans: "C"
    },
    {
      q: "6. When acknowledging a differing viewpoint, which phrase might an author use?",
      a: "A. 'While some believe...'",
      b: "B. 'This is the only truth...'",
      c: "C. 'There is no doubt that...'",
      d: "D. 'I think...'",
      ans: "A"
    },
    {
      q: "7. Is the following a fact or an opinion: 'I think floods are the worst type of disaster.'",
      a: "A. Fact",
      b: "B. Opinion",
      c: "C. Supported Claim",
      d: "D. Authoritative Source",
      ans: "B"
    },
    {
      q: "8. Is the following a fact or an opinion: 'The 2011 Brisbane floods affected over 70 towns.'",
      a: "A. Fact",
      b: "B. Opinion",
      c: "C. Bare Assertion",
      d: "D. Fiction",
      ans: "A"
    },
    {
      q: "9. If you want to find an authoritative source in the Floods Archive, what should you look for?",
      a: "A. Quotes from experts and references to official data.",
      b: "B. The longest sentence on the page.",
      c: "C. The biggest picture.",
      d: "D. A spelling mistake.",
      ans: "A"
    },
    {
      q: "10. How does moving from a bare assertion to a supported claim help the reader?",
      a: "A. It makes the reading more confusing.",
      b: "B. It gives the reader evidence to trust the information presented.",
      c: "C. It tells the reader exactly what to think.",
      d: "D. It replaces all the pictures.",
      ans: "B"
    }
  ];

  const children = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "Lesson 16: Authoritative Sources Assessment", bold: true, size: 36, color: THEME.navy })],
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

  try {
    for (const s of slidePaths) {
      console.log(`Processing: ${path.basename(s)}`);
      await html2pptx(s, pptx, { ignoreValidation: true });
      console.log(`✅ Processed: ${path.basename(s)}`);
    }
    await pptx.writeFile({ fileName: filename });
    console.log("✅ PPTX generated.");
  } catch (error) {
    console.error(`⚠️ Failed to generate PPTX (file might be open): ${error.message}`);
  }
}

async function run() {
  console.log("Starting resource generation for Lesson 16...");
  
  const baseDir = path.join(__dirname, "..");
  const slidesDir = path.join(baseDir, "Lesson_16_Slides");
  
  const slidePaths = [
    path.join(slidesDir, "slide_1.html"),
    path.join(slidesDir, "slide_2.html"),
    path.join(slidesDir, "slide_3.html"),
    path.join(slidesDir, "slide_4.html"),
    path.join(slidesDir, "slide_5.html"),
    path.join(slidesDir, "slide_6.html"),
    path.join(slidesDir, "slide_7.html")
  ];
  
  const pptxPath = path.join(baseDir, "Lesson_16_Presentation.pptx");
  if (fs.existsSync(slidePaths[0])) {
    await generatePresentation(pptxPath, slidePaths);
  } else {
    console.log("⚠️ Slides not found. Skipping PPT generation.");
  }
  
  const worksheetPath = path.join(baseDir, "Lesson_16_Worksheet.docx");
  await generateWorksheet(worksheetPath);
  
  const lucasHandoutPath = path.join(baseDir, "Lesson_16_Lucas_Handout.docx");
  await generateLucasHandout(lucasHandoutPath);

  const assessmentPath = path.join(baseDir, "Lesson_16_Assessment.docx");
  await generateAssessment(assessmentPath);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
