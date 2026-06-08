const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType, VerticalAlign, LevelFormat } = require('docx');
const fs = require('fs');
const path = require('path');

const THEME = {
  navy: '001833',
  orange: 'FE7107',
  darkGrey: '333333',
  lightGrey: 'F5F5F5',
  borderGrey: 'CCCCCC',
  pureWhite: 'FFFFFF'
};

const tableBorder = { style: BorderStyle.SINGLE, size: 4, color: THEME.borderGrey };
const cellBorders = { top: tableBorder, bottom: tableBorder, left: tableBorder, right: tableBorder };

const responseBoxBorder = { style: BorderStyle.SINGLE, size: 6, color: THEME.borderGrey };
const responseBoxBorders = { top: responseBoxBorder, bottom: responseBoxBorder, left: responseBoxBorder, right: responseBoxBorder };

function createResponseBox(lineCount) {
  const children = [];
  for (let i = 0; i < lineCount; i++) {
    children.push(new Paragraph({ spacing: { before: 120, after: 120 }, children: [new TextRun({ text: "" })] }));
  }
  return new Table({
    columnWidths: [9026],
    margins: { top: 120, bottom: 120, left: 180, right: 180 },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: responseBoxBorders,
            width: { size: 9026, type: WidthType.DXA },
            children: children
          })
        ]
      })
    ]
  });
}

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      {
        id: "Title",
        name: "Title",
        basedOn: "Normal",
        run: { size: 30, bold: true, color: THEME.navy, font: "Arial" },
        paragraph: { spacing: { before: 240, after: 60 }, alignment: AlignmentType.CENTER }
      },
      {
        id: "Subtitle",
        name: "Subtitle",
        basedOn: "Normal",
        run: { size: 22, color: THEME.darkGrey, font: "Arial", italics: true },
        paragraph: { spacing: { before: 60, after: 240 }, alignment: AlignmentType.CENTER }
      },
      {
        id: "Heading1",
        name: "Heading 1",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 26, bold: true, color: THEME.navy, font: "Arial" },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 }
      },
      {
        id: "Heading2",
        name: "Heading 2",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 22, bold: true, color: THEME.navy, font: "Arial" },
        paragraph: { spacing: { before: 180, after: 120 }, outlineLevel: 1 }
      }
    ]
  },
  numbering: {
    config: [
      {
        reference: "bullet-list",
        levels: [{
          level: 0,
          format: LevelFormat.BULLET,
          text: "•",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      }
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 }, // A4 Size standard in Australia
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } // 1 inch margins
      }
    },
    children: [
      // Title Section
      new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun("Year 5 English — Unit 2: Examining, Creating and Sharing Informative Texts")] }),
      new Paragraph({ style: "Subtitle", children: [new TextRun("Practice Assessment Worksheet: Reading and Viewing")] }),

      // Student Info Box
      new Table({
        columnWidths: [1800, 7226],
        margins: { top: 120, bottom: 120, left: 150, right: 150 },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 1800, type: WidthType.DXA },
                shading: { fill: THEME.lightGrey, type: ShadingType.CLEAR },
                children: [new Paragraph({ children: [new TextRun({ text: "Student Name:", bold: true, size: 20 })] })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 7226, type: WidthType.DXA },
                children: [new Paragraph({ children: [] })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 1800, type: WidthType.DXA },
                shading: { fill: THEME.lightGrey, type: ShadingType.CLEAR },
                children: [new Paragraph({ children: [new TextRun({ text: "Date:", bold: true, size: 20 })] })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 7226, type: WidthType.DXA },
                children: [new Paragraph({ children: [] })]
              })
            ]
          })
        ]
      }),

      new Paragraph({ spacing: { before: 240 } }),

      // Instructions Box
      new Table({
        columnWidths: [9026],
        margins: { top: 150, bottom: 150, left: 180, right: 180 },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 9026, type: WidthType.DXA },
                shading: { fill: THEME.lightGrey, type: ShadingType.CLEAR },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({ text: "Instructions: ", bold: true, size: 20, color: THEME.orange }),
                      new TextRun({ text: "Independently read the informative article, ", size: 20 }),
                      new TextRun({ text: "“The Rising Tide: Causes and Effects of Tsunamis”", bold: true, size: 20 }),
                      new TextRun({ text: " (found in your reader or on the smartboard), paying close attention to its structure, language choices, and visual features. Then, answer the comprehension questions below. You may need to re-read or scan parts of the text to respond.", size: 20 })
                    ]
                  })
                ]
              })
            ]
          })
        ]
      }),

      new Paragraph({ spacing: { before: 240 } }),

      // SECTION 1: Main Ideas, Purpose and Audience
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Main ideas, purpose and audience")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("What is the topic of the text?")] }),
      createResponseBox(3),
      new Paragraph({ spacing: { before: 180 } }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("What are some facts from the text?")] }),
      createResponseBox(4),
      new Paragraph({ spacing: { before: 180 } }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Identify the main idea/s and include supporting ideas and information from the text.")] }),
      createResponseBox(6),
      new Paragraph({ spacing: { before: 180 } }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Who is the audience for this text?")] }),
      createResponseBox(3),
      new Paragraph({ spacing: { before: 180 } }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("What is the author’s purpose in writing the text? Use examples from the text in your answer.")] }),
      createResponseBox(6),

      // Page Break for Section 2 to keep document tidy
      new Paragraph({ pageBreakBefore: true, heading: HeadingLevel.HEADING_1, children: [new TextRun("Text Structures")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("What are the characteristic features of this text?")] }),
      createResponseBox(4),
      new Paragraph({ spacing: { before: 180 } }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Explain how the characteristic features of the text:")] }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "support the purpose", size: 20 })]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "enhance navigation", size: 20 })]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "cohesion and build meaning.", size: 20 })]
      }),
      new Paragraph({ spacing: { before: 60 } }),
      createResponseBox(8),

      // Page Break for Section 3
      new Paragraph({ pageBreakBefore: true, heading: HeadingLevel.HEADING_1, children: [new TextRun("Language and Visual Features")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("How has the author used language features including vocabulary to build ideas and make the meaning more precise? Provide examples from the text in your answer.")] }),
      createResponseBox(6),
      new Paragraph({ spacing: { before: 180 } }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("How has the author used visual features (for example: images, photographs, diagrams, graphics) and their sequencing, design, format and layout to create effect and make meaning more precise? Provide example/s from the text in your answer.")] }),
      createResponseBox(8)
    ]
  }]
});

const outputFilePath = path.join(__dirname, 'Tsunami_Comprehension_Worksheet.docx');
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outputFilePath, buffer);
  console.log(`✅ Tsunami Comprehension Worksheet generated successfully at: ${outputFilePath}`);
}).catch(err => {
  console.error("❌ Error generating worksheet:", err);
  process.exit(1);
});
