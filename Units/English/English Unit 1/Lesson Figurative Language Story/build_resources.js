const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  ShadingType,
} = require("docx");
const pptxgen = require("pptxgenjs");
const fs = require("fs");
const path = require("path");

// NOTE: It is important we use the absolute path to html2pptx
const html2pptx = require("c:\\Users\\dsuth\\Documents\\Joshua\\.agent\\skills\\pptx\\scripts\\html2pptx");

const THEME = {
  navy: "112d4e",
  orange: "f96d00",
  white: "f9f7f7",
  blue: "3f72af",
  lightGrey: "e8e8e8",
};

async function generateHandout(filename) {
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, right: 720, bottom: 720, left: 720 },
          },
        },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "Figurative Language in Paper Planes",
                bold: true,
                size: 36,
                color: THEME.navy,
              }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Name: ____________________________      Date: _____________",
                size: 24,
              }),
            ],
            spacing: { after: 400 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Part 1: The Narrative Arc",
                bold: true,
                size: 28,
                color: THEME.orange,
              }),
            ],
            spacing: { before: 200, after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Plan your story out using the structure below.",
                size: 24,
              }),
            ],
            spacing: { after: 200 },
          }),
          createStoryStructreTable(),
          new Paragraph({
            children: [
              new TextRun({
                text: "Part 2: Figurative Language Bank",
                bold: true,
                size: 28,
                color: THEME.orange,
              }),
            ],
            spacing: { before: 400, after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Draft one of each figurative language type to use in your story.",
                size: 24,
              }),
            ],
            spacing: { after: 200 },
          }),
          createFigurativeLanguageTable(),
          new Paragraph({
            children: [
              new TextRun({
                text: "Part 3: Drafting Dialogue",
                bold: true,
                size: 28,
                color: THEME.orange,
              }),
            ],
            spacing: { before: 400, after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Write a short conversation between two characters. Remember: New Speaker, New Line, and punctuation goes inside the speech marks!",
                size: 24,
              }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "1. ________________________________________________________________________",
              }),
            ],
            spacing: { after: 300 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "2. ________________________________________________________________________",
              }),
            ],
            spacing: { after: 300 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "3. ________________________________________________________________________",
              }),
            ],
            spacing: { after: 300 },
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(filename, buffer);
  console.log(`✅ Generated Handout: ${filename}`);
}

function createStoryStructreTable() {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      createHeaderRow(["Story Element", "My Ideas"], 24),
      createInputRow("Orientation (Who, Where, When)"),
      createInputRow("Complication (The Problem)"),
      createInputRow("Climax (Highest Tension)"),
      createInputRow("Resolution (How it ends)"),
    ],
  });
}

function createFigurativeLanguageTable() {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      createHeaderRow(["Technique", "Definition", "My Example"], 24),
      createInputRowWithDef("Simile", "Comparing using 'like' or 'as'"),
      createInputRowWithDef("Metaphor", "Saying one thing IS another"),
      createInputRowWithDef(
        "Personification",
        "Giving objects human qualities",
      ),
      createInputRowWithDef("Idiom", "A phrase with a hidden meaning"),
    ],
  });
}

function createHeaderRow(texts, size) {
  return new TableRow({
    children: texts.map(
      (t) =>
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: t,
                  bold: true,
                  size: size,
                  color: "FFFFFF",
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
          shading: { fill: THEME.navy, type: ShadingType.CLEAR },
          margins: { top: 100, bottom: 100, left: 100, right: 100 },
          verticalAlign: "center",
        }),
    ),
  });
}

function createInputRow(label) {
  return new TableRow({
    children: [
      new TableCell({
        children: [
          new Paragraph({
            children: [new TextRun({ text: label, bold: true, size: 24 })],
          }),
        ],
        width: { size: 30, type: WidthType.PERCENTAGE },
        margins: { top: 150, bottom: 150, left: 100, right: 100 },
        verticalAlign: "center",
      }),
      new TableCell({
        children: [new Paragraph({ text: "" })],
        width: { size: 70, type: WidthType.PERCENTAGE },
      }),
    ],
  });
}

function createInputRowWithDef(label, def) {
  return new TableRow({
    children: [
      new TableCell({
        children: [
          new Paragraph({
            children: [new TextRun({ text: label, bold: true, size: 24 })],
          }),
        ],
        width: { size: 20, type: WidthType.PERCENTAGE },
        margins: { top: 150, bottom: 150, left: 100, right: 100 },
        verticalAlign: "center",
      }),
      new TableCell({
        children: [
          new Paragraph({
            children: [new TextRun({ text: def, italics: true, size: 22 })],
          }),
        ],
        width: { size: 40, type: WidthType.PERCENTAGE },
        margins: { top: 150, bottom: 150, left: 100, right: 100 },
        verticalAlign: "center",
        shading: { fill: THEME.lightGrey, type: ShadingType.CLEAR },
      }),
      new TableCell({
        children: [new Paragraph({ text: "" })],
        width: { size: 40, type: WidthType.PERCENTAGE },
      }),
    ],
  });
}

async function generatePresentation(filename, slideHtmlPath) {
  const pptx = new pptxgen();
  pptx.layout = "LAYOUT_16x9";

  try {
    console.log(`Processing HTML to PPTX: ${path.basename(slideHtmlPath)}`);
    
    // Read the HTML content
    let htmlContent = fs.readFileSync(slideHtmlPath, 'utf8');
    
    // Split the content into individual slides using regex
    const slides = [];
    for (let i = 1; i <= 13; i++) {
        const regex = new RegExp('<div class="header" data-slide="' + i + '">[\\s\\S]*?<div class="content" data-slide="' + i + '">[\\s\\S]*?(?=<!-- Slide ' + (i+1) + ':|<div class="footer">)', 'g');
        const match = htmlContent.match(regex);
        
        if (match) {
            // Ensure each slide has the necessary HTML structure
            const slideHtml = `
            <html>
            <head>
                ${htmlContent.match(/<style>[\s\S]*?<\/style>/)[0]}
            </head>
            <body>
                <div class="slide">
                    ${match[0]}
                </div>
            </body>
            </html>
            `;
            
            // Save the slide to a temporary file
            const tmpFile = path.join(__dirname, `tmp_slide_${i}.html`);
            fs.writeFileSync(tmpFile, slideHtml);
            slides.push(tmpFile);
        }
    }

    // Process each slide
    for (const s of slides) {
        await html2pptx(s, pptx);
    }

    // Clean up temporary files
    for (const s of slides) {
        fs.unlinkSync(s);
    }
    
    console.log(`✅ Processed Slides.`);

    await pptx.writeFile({ fileName: filename });
    console.log(`✅ Presentation Saved: ${filename}`);
  } catch (err) {
    console.error(`❌ Error generating PPTX: ${err.message}`);
  }
}

async function run() {
  const outDir = __dirname;
  console.log("Starting resource generation...");

  // 1. Generate the Student Handout (DOCX)
  const handoutFile = path.join(outDir, "Student_Handout.docx");
  await generateHandout(handoutFile);

  // 2. Generate the Presentation (PPTX)
  const pptxFile = path.join(outDir, "Presentation.pptx");
  const htmlFile = path.join(outDir, "slide_content.html");
  await generatePresentation(pptxFile, htmlFile);
}

run().catch(console.error);
