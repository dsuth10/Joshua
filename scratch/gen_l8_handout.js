const { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, AlignmentType, BorderStyle } = require('docx');
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
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Lesson 8 Handout: Modelling Cyclone Formation")] }),
            
            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Section A: Cyclone Rotation")] }),
            new Paragraph({ children: [new TextRun("In the Southern Hemisphere, cyclones rotate in a _______________ direction.")] }),
            new Paragraph({ children: [new TextRun("This is caused by the _______________ Effect.")] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Section B: Reading Comprehension")] }),
            new Paragraph({ children: [new TextRun("1. What made Cyclone Mahina so deadly?")] }),
            new Paragraph({ children: [new TextRun("____________________________________________________________")] }),
            new Paragraph({ children: [new TextRun("2. How did Cyclone George affect the global economy?")] }),
            new Paragraph({ children: [new TextRun("____________________________________________________________")] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Section C: Cyclone in a Bottle Investigation")] }),
            new Paragraph({ children: [new TextRun("Prediction: What will happen when you swirl the water in the bottle?")] }),
            new Paragraph({ children: [new TextRun("____________________________________________________________")] }),
            new Paragraph({ children: [new TextRun("Observations: Describe the shape of the vortex you created.")] }),
            new Paragraph({ children: [new TextRun("____________________________________________________________")] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Section D: Model vs Reality")] }),
            new Table({
                columnWidths: [4680, 4680],
                rows: [
                    new TableRow({ children: [
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Feature", bold: true })] })] }),
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Comparison", bold: true })] })] })
                    ] }),
                    new TableRow({ children: [
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("How is it like a real cyclone?")] })] }),
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("")] })] })
                    ] }),
                    new TableRow({ children: [
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("How is it different?")] })] }),
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("")] })] })
                    ] })
                ]
            })
        ]
    }]
});

Packer.toBuffer(doc).then(buffer => fs.writeFileSync("Lessons_06_08/Lesson_08/Lesson_08_Handout.docx", buffer));
