const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType, HeadingLevel, WidthType, BorderStyle, ShadingType, LevelFormat } = require('docx');

const NAVY = "112D4E";
const ORANGE = "F96D00";
const OFF_WHITE = "F9F7F7";

const tableBorder = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const cellBorders = { top: tableBorder, bottom: tableBorder, left: tableBorder, right: tableBorder };

const doc = new Document({
    styles: {
        default: { document: { run: { font: "Arial", size: 24 } } },
        paragraphStyles: [
            { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
              run: { size: 36, bold: true, color: ORANGE, font: "Arial" },
              paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 } },
            { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
              run: { size: 28, bold: true, color: NAVY, font: "Arial" },
              paragraph: { spacing: { before: 180, after: 120 }, outlineLevel: 1 } },
        ]
    },
    numbering: {
        config: [
            { reference: "task-list",
              levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
                style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }
        ]
    },
    sections: [{
        properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
        children: [
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Year 5 Maths: Finding Missing Numbers")] }),
            new Paragraph({ children: [new TextRun("Name: __________________________  Date: ______________")] }),
            new Paragraph({ spacing: { after: 240 } }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Part 1: Inverse Operations (Mechanical Skill)")] }),
            new Paragraph({ children: [new TextRun("Find the missing numbers by using the inverse operation. Show your working!")] }),
            new Paragraph({ spacing: { after: 120 } }),

            new Table({
                columnWidths: [4680, 4680],
                rows: [
                    new TableRow({ children: [
                        new TableCell({ borders: cellBorders, width: { size: 4680, type: WidthType.DXA }, shading: { fill: OFF_WHITE, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun("a) □ + 37 = 40")] }), new Paragraph({ children: [new TextRun("Working: 40 - 37 = ___")] })] }),
                        new TableCell({ borders: cellBorders, width: { size: 4680, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("b) □ × 8 = 24")] }), new Paragraph({ children: [new TextRun("Working: 24 ÷ 8 = ___")] })] })
                    ] }),
                    new TableRow({ children: [
                        new TableCell({ borders: cellBorders, width: { size: 4680, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("c) 12 ÷ □ = 3")] }), new Paragraph({ children: [new TextRun("Working: 12 ÷ 3 = ___")] })] }),
                        new TableCell({ borders: cellBorders, width: { size: 4680, type: WidthType.DXA }, shading: { fill: OFF_WHITE, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun("d) 56 = □ - 37")] }), new Paragraph({ children: [new TextRun("Working: 56 + 37 = ___")] })] })
                    ] }),
                ]
            }),

            new Paragraph({ spacing: { before: 240 } }),
            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Part 2: Core Practice")] }),
            new Paragraph({ children: [new TextRun("Calculate the missing value in each equation.")] }),
            new Paragraph({ numbering: { reference: "task-list", level: 0 }, children: [new TextRun("□ × 7 = 42")] }),
            new Paragraph({ numbering: { reference: "task-list", level: 0 }, children: [new TextRun("1000 ÷ □ = 125")] }),
            new Paragraph({ numbering: { reference: "task-list", level: 0 }, children: [new TextRun("9 × □ = 63")] }),
            new Paragraph({ numbering: { reference: "task-list", level: 0 }, children: [new TextRun("□ + 156 = 365")] }),
            new Paragraph({ numbering: { reference: "task-list", level: 0 }, children: [new TextRun("180 - □ = 60")] }),

            new Paragraph({ spacing: { before: 240 } }),
            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Part 3: Extension Challenge")] }),
            new Paragraph({ children: [new TextRun("Solve these multi-step missing number problems.")] }),
            new Paragraph({ children: [new TextRun("a) (□ × 4) + 10 = 50")] }),
            new Paragraph({ children: [new TextRun("b) I am thinking of a number. When I multiply it by 6 and add 12, the answer is 48. What is my number?")] }),
            new Paragraph({ children: [new TextRun("Working: __________________________________________________")] }),

            new Paragraph({ spacing: { before: 240 } }),
            new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Success Check: Did you check your answer with a calculator?", italics: true, color: NAVY })] }),
        ]
    }]
});

Packer.toBuffer(doc).then(buffer => {
    fs.writeFileSync("Finding_Missing_Numbers_Handout.docx", buffer);
    console.log("Handout generated successfully.");
});
