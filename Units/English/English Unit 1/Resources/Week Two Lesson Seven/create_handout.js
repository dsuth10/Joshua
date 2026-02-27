const fs = require("fs");
const path = require("path");
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  AlignmentType,
  PageOrientation,
  LevelFormat,
  HeadingLevel,
  BorderStyle,
  WidthType,
  ShadingType,
  VerticalAlign,
  Header,
  Footer,
  PageNumber
} = require("docx");

const outDir = "c:\\Users\\dsuth\\Documents\\Joshua\\Units\\English\\English Unit 1\\Resources\\Week Two Lesson Seven";
const outPath = path.join(outDir, "Student_Handout.docx");

// Standard border style for tables
const tableBorder = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const cellBorders = { top: tableBorder, bottom: tableBorder, left: tableBorder, right: tableBorder };

const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: "Arial", size: 24 } // 12pt default
      }
    },
    paragraphStyles: [
      {
        id: "Title",
        name: "Title",
        basedOn: "Normal",
        run: { size: 48, bold: true, color: "2D3748", font: "Arial" }, // 24pt
        paragraph: { spacing: { before: 240, after: 120 }, alignment: AlignmentType.CENTER }
      },
      {
        id: "Heading1",
        name: "Heading 1",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 32, bold: true, color: "3182CE", font: "Arial" }, // 16pt, nice blue
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 }
      },
      {
        id: "Heading2",
        name: "Heading 2",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 28, bold: true, color: "2D3748", font: "Arial" }, // 14pt
        paragraph: { spacing: { before: 180, after: 120 }, outlineLevel: 1 }
      }
    ]
  },
  numbering: {
    config: [
      {
        reference: "activities-list",
        levels: [
          {
            level: 0,
            format: LevelFormat.DECIMAL,
            text: "%1.",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } }
          }
        ]
      },
      {
        reference: "slang-list",
        levels: [
          {
            level: 0,
            format: LevelFormat.DECIMAL,
            text: "%1.",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 }, spacing: { after: 240 } } }
          }
        ]
      }
    ]
  },
  sections: [
    {
      properties: {
        page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({ text: "Name: _______________________________   Date: _______________", size: 20 })
              ]
            })
          ]
        })
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun("Paper Planes - Year 5 English")]
            })
          ]
        })
      },
      children: [
        new Paragraph({
          heading: HeadingLevel.TITLE,
          children: [new TextRun("Weekly Challenge: Informal Language & Character")]
        }),
        
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("Part 1: The Aussie Slang Glossary")]
        }),
        new Paragraph({
          spacing: { after: 240 },
          children: [
            new TextRun("In Chapters 9 & 10 of "),
            new TextRun({ text: "Paper Planes", italics: true }),
            new TextRun(", Steve Worland uses lots of informal language. Match the slang word to its correct formal meaning by drawing a line, or writing the letter next to the number.")
          ]
        }),
        
        // Glossary Table 2 columns
        new Table({
          columnWidths: [4680, 4680],
          margins: { top: 100, bottom: 100, left: 180, right: 180 },
          rows: [
            new TableRow({
              tableHeader: true,
              children: [
                new TableCell({
                  borders: cellBorders,
                  width: { size: 4680, type: WidthType.DXA },
                  shading: { fill: "E2E8F0", type: ShadingType.CLEAR },
                  verticalAlign: VerticalAlign.CENTER,
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Slang / Idiom", bold: true })] })]
                }),
                new TableCell({
                  borders: cellBorders,
                  width: { size: 4680, type: WidthType.DXA },
                  shading: { fill: "E2E8F0", type: ShadingType.CLEAR },
                  verticalAlign: VerticalAlign.CENTER,
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Formal Meaning", bold: true })] })]
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  borders: cellBorders,
                  width: { size: 4680, type: WidthType.DXA },
                  children: [new Paragraph({ numbering: { reference: "slang-list", level: 0 }, children: [new TextRun({ text: "Mate", bold: true })] })]
                }),
                new TableCell({
                  borders: cellBorders,
                  width: { size: 4680, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun("A. Excellent or very good")] })]
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  borders: cellBorders,
                  width: { size: 4680, type: WidthType.DXA },
                  children: [new Paragraph({ numbering: { reference: "slang-list", level: 0 }, children: [new TextRun({ text: "Esky", bold: true })] })]
                }),
                new TableCell({
                  borders: cellBorders,
                  width: { size: 4680, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun("B. Friend or companion")] })]
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  borders: cellBorders,
                  width: { size: 4680, type: WidthType.DXA },
                  children: [new Paragraph({ numbering: { reference: "slang-list", level: 0 }, children: [new TextRun({ text: "Fair dinkum", bold: true })] })]
                }),
                new TableCell({
                  borders: cellBorders,
                  width: { size: 4680, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun("C. Honestly, or true")] })]
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  borders: cellBorders,
                  width: { size: 4680, type: WidthType.DXA },
                  children: [new Paragraph({ numbering: { reference: "slang-list", level: 0 }, children: [new TextRun({ text: "Bonza", bold: true })] })]
                }),
                new TableCell({
                  borders: cellBorders,
                  width: { size: 4680, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun("D. An insulated container to keep drinks cool")] })]
                })
              ]
            })
          ]
        }),

        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("Part 2: Character Voice")]
        }),
        new Paragraph({
          spacing: { after: 240 },
          children: [new TextRun("Answer the following questions in full sentences. Think about how language changes the way we see a character.")]
        }),
        
        new Paragraph({
          numbering: { reference: "activities-list", level: 0 },
          spacing: { after: 120 },
          children: [new TextRun("Why do you think the author has Dylan use words like 'mate' so frequently? What does it tell us about where he lives?")]
        }),
        new Paragraph({ spacing: { after: 600 }, children: [new TextRun("___________________________________________________________________________________")] }),
        new Paragraph({ spacing: { after: 600 }, children: [new TextRun("___________________________________________________________________________________")] }),
        new Paragraph({ spacing: { after: 600 }, children: [new TextRun("___________________________________________________________________________________")] }),

        new Paragraph({
          numbering: { reference: "activities-list", level: 0 },
          spacing: { after: 120 },
          children: [new TextRun("When Dylan talks to his Dad, he is very informal. Does this mean he is being disrespectful? Why or why not?")]
        }),
        new Paragraph({ spacing: { after: 600 }, children: [new TextRun("___________________________________________________________________________________")] }),
        new Paragraph({ spacing: { after: 600 }, children: [new TextRun("___________________________________________________________________________________")] }),
        new Paragraph({ spacing: { after: 600 }, children: [new TextRun("___________________________________________________________________________________")] }),

        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("Part 3: Code-Switching")]
        }),
        new Paragraph({
          spacing: { after: 240 },
          children: [
            new TextRun("Translate Dylan's informal language into extremely "),
            new TextRun({ text: "formal, precise, school-appropriate", bold: true }),
            new TextRun(" language.")
          ]
        }),

        new Table({
          columnWidths: [4680, 4680],
          margins: { top: 100, bottom: 100, left: 180, right: 180 },
          rows: [
            new TableRow({
              tableHeader: true,
              children: [
                new TableCell({
                  borders: cellBorders,
                  width: { size: 4680, type: WidthType.DXA },
                  shading: { fill: "E2E8F0", type: ShadingType.CLEAR },
                  verticalAlign: VerticalAlign.CENTER,
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Dylan's Informal Voice", bold: true })] })]
                }),
                new TableCell({
                  borders: cellBorders,
                  width: { size: 4680, type: WidthType.DXA },
                  shading: { fill: "E2E8F0", type: ShadingType.CLEAR },
                  verticalAlign: VerticalAlign.CENTER,
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Your Formal Translation", bold: true })] })]
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  borders: cellBorders,
                  width: { size: 4680, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun({ text: "\"G'day mate, how's it going?\"", italics: true })] })]
                }),
                new TableCell({
                  borders: cellBorders,
                  width: { size: 4680, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun("")] }), new Paragraph({ children: [new TextRun("")] }), new Paragraph({ children: [new TextRun("")] })] // Empty space for writing
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  borders: cellBorders,
                  width: { size: 4680, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun({ text: "\"Chuck it in the back of the ute, it'll be right.\"", italics: true })] })]
                }),
                new TableCell({
                  borders: cellBorders,
                  width: { size: 4680, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun("")] }), new Paragraph({ children: [new TextRun("")] }), new Paragraph({ children: [new TextRun("")] })]
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  borders: cellBorders,
                  width: { size: 4680, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun({ text: "\"He was totally stoked with the paper plane, fair dinkum.\"", italics: true })] })]
                }),
                new TableCell({
                  borders: cellBorders,
                  width: { size: 4680, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun("")] }), new Paragraph({ children: [new TextRun("")] }), new Paragraph({ children: [new TextRun("")] })]
                })
              ]
            })
          ]
        })
      ]
    }
  ]
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outPath, buffer);
  console.log("Successfully generated Student_Handout.docx");
});
