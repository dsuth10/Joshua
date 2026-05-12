const { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, AlignmentType, ShadingType, BorderStyle } = require('docx');
const fs = require('fs');

const tableBorder = { style: BorderStyle.SINGLE, size: 1, color: "000000" };
const cellBorders = { top: tableBorder, bottom: tableBorder, left: tableBorder, right: tableBorder };

const doc = new Document({
    styles: {
        default: { document: { run: { font: "Arial", size: 24 } } },
        paragraphStyles: [
            { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", run: { size: 36, bold: true }, paragraph: { spacing: { before: 240, after: 240 }, alignment: AlignmentType.CENTER } },
            { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", run: { size: 28, bold: true }, paragraph: { spacing: { before: 200, after: 120 } } }
        ]
    },
    sections: [{
        children: [
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Lesson 6 Handout (Support): Introducing Tropical Cyclones")] }),
            
            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Section A: Watch & Match")] }),
            new Paragraph({ children: [new TextRun("Use the words below to fill in the table:")] }),
            new Paragraph({ children: [new TextRun({ text: "Word Bank: 26.5°C | 62 km/h | Rises | Flooding", bold: true })] }),
            new Table({
                columnWidths: [4680, 4680],
                rows: [
                    new TableRow({ children: [
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("Minimum sea temp needed:")] })] }),
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("________________")] })] })
                    ] }),
                    new TableRow({ children: [
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("Warm, moist air:")] })] }),
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("________________")] })] })
                    ] }),
                    new TableRow({ children: [
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("Cyclone wind speed:")] })] }),
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("________________")] })] })
                    ] })
                ]
            }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Section B: Reading Help")] }),
            new Paragraph({ children: [new TextRun("Circle the correct answer:")] }),
            new Paragraph({ children: [new TextRun("1. Cyclone Yasi happened in: ")] }),
            new Paragraph({ children: [new TextRun("   a) 2011   b) 1990")] }),
            new Paragraph({ children: [new TextRun("2. Cyclone Larry hit the town of: ")] }),
            new Paragraph({ children: [new TextRun("   a) Darwin   b) Innisfail")] }),
            new Paragraph({ children: [new TextRun("3. Were there many people killed? ")] }),
            new Paragraph({ children: [new TextRun("   a) Yes   b) No (Zero fatalities)")] })
        ]
    }]
});

Packer.toBuffer(doc).then(buffer => fs.writeFileSync("Lessons_06_08/Lesson_06/Lesson_06_Handout_Support.docx", buffer));
