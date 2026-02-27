const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, Table, TableRow, TableCell, WidthType, ShadingType } = require('docx');
const fs = require('fs');

const THEME = {
  green: "3A6B35",
  lightGreen: "E8F5E9",
  white: "FFFFFF"
};

const doc = new Document({
  sections: [{
    properties: {},
    children: [
      // Title Section
      new Paragraph({
        text: "Science: Year 6 Biology",
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
      }),
      new Paragraph({
        text: "Investigation Planner: Seed Germination",
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      }),

      new Paragraph({
        children: [
          new TextRun({ text: "Name: __________________________", bold: true }),
          new TextRun({ text: "      Date: ____________", bold: true }),
        ],
        spacing: { after: 400 },
      }),

      // LG/SC
      createBox("Learning Intention", "To investigate how environmental factors (sunlight and water) affect the germination of seeds."),

      // Part 1: The Question
      createSectionHeading("1. Our Scientific Question"),
      new Paragraph({
        children: [new TextRun({ text: "How does the presence of sunlight and water affect how quickly a mung bean sprouts?", size: 24, italic: true })],
        spacing: { after: 200 }
      }),

      // Part 2: Hypothesis
      createSectionHeading("2. Hypothesis"),
      new Paragraph({
        text: "I predict that... ____________________________________________________________________",
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: "Because... _________________________________________________________________________",
        spacing: { after: 400 }
      }),

      // Part 3: Variables
      createSectionHeading("3. Controlling Variables (Fair Test)"),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ text: "Independent Variable", bold: true })], shading: { fill: THEME.lightGreen } }),
              new TableCell({ children: [new Paragraph({ text: "What we will CHANGE:" })] }),
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ text: "Dependent Variable", bold: true })], shading: { fill: THEME.lightGreen } }),
              new TableCell({ children: [new Paragraph({ text: "What we will MEASURE:" })] }),
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ text: "Controlled Variables", bold: true })], shading: { fill: THEME.lightGreen } }),
              new TableCell({ children: [new Paragraph({ text: "What we will keep the SAME:" })] }),
            ]
          })
        ]
      }),

      // Part 4: Materials & Method
      createSectionHeading("4. Materials & Method"),
      new Paragraph({ text: "Materials: _________________________________________________________________________", spacing: { after: 200 } }),
      new Paragraph({ text: "Method Steps:", bold: true, spacing: { after: 100 } }),
      new Paragraph({ text: "1. _______________________________________________________________________________", spacing: { after: 100 } }),
      new Paragraph({ text: "2. _______________________________________________________________________________", spacing: { after: 100 } }),
      new Paragraph({ text: "3. _______________________________________________________________________________", spacing: { after: 400 } }),

      // Part 5: Observations
      createSectionHeading("5. Results Table (First 7 Days)"),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ text: "Day", bold: true })], shading: { fill: THEME.green } }),
              new TableCell({ children: [new Paragraph({ text: "Observations (What do you see?)", bold: true })], shading: { fill: THEME.green } }),
              new TableCell({ children: [new Paragraph({ text: "Measurement (mm)", bold: true })], shading: { fill: THEME.green } }),
            ]
          }),
          ...[1, 2, 3, 4, 5, 6, 7].map(day => new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ text: day.toString() })] }),
              new TableCell({ children: [new Paragraph({ text: "" })] }),
              new TableCell({ children: [new Paragraph({ text: "" })] }),
            ]
          }))
        ]
      }),
    ],
  }],
});

function createSectionHeading(text) {
  return new Paragraph({
    children: [new TextRun({ text: text, bold: true, size: 28, color: THEME.green })],
    spacing: { before: 400, after: 200 },
  });
}

function createBox(title, content) {
  return new Paragraph({
    children: [
      new TextRun({ text: title + ": ", bold: true, color: THEME.green }),
      new TextRun({ text: content })
    ],
    border: {
      top: { color: THEME.green, size: 1, space: 10, style: BorderStyle.SINGLE },
      bottom: { color: THEME.green, size: 1, space: 10, style: BorderStyle.SINGLE },
      left: { color: THEME.green, size: 1, space: 10, style: BorderStyle.SINGLE },
      right: { color: THEME.green, size: 1, space: 10, style: BorderStyle.SINGLE },
    },
    spacing: { before: 200, after: 200 },
  });
}

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("Lesson_Germination_Planning_Worksheet.docx", buffer);
  console.log("✅ Worksheet created: Lesson_Germination_Planning_Worksheet.docx");
});
