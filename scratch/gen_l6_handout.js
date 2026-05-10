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
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Lesson 6 Handout: Introducing Tropical Cyclones")] }),
            
            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Section A: Watch & Record")] }),
            new Paragraph({ children: [new TextRun("As you watch the 'Tropical Cyclones' video, record the following information:")] }),
            new Table({
                columnWidths: [4680, 4680],
                rows: [
                    new TableRow({ children: [
                        new TableCell({ borders: cellBorders, width: { size: 4680, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: "Question", bold: true })] })] }),
                        new TableCell({ borders: cellBorders, width: { size: 4680, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: "Your Answer", bold: true })] })] })
                    ] }),
                    new TableRow({ children: [
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("Minimum sea surface temperature needed:")] })] }),
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("")] })] })
                    ] }),
                    new TableRow({ children: [
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("What happens to warm, moist air as it rises?")] })] }),
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("")] })] })
                    ] }),
                    new TableRow({ children: [
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("Direction of rotation in the Southern Hemisphere:")] })] }),
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("")] })] })
                    ] }),
                    new TableRow({ children: [
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("The name of the calm centre of the storm:")] })] }),
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("")] })] })
                    ] }),
                    new TableRow({ children: [
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("Wind speed to be classified as a cyclone (km/h):")] })] }),
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("")] })] })
                    ] }),
                    new TableRow({ children: [
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("What happens when a cyclone moves over land?")] })] }),
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("")] })] })
                    ] })
                ]
            }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Section B: Terminology Comparison")] }),
            new Paragraph({ children: [new TextRun("Complete the table to distinguish between different types of spinning storms:")] }),
            new Table({
                columnWidths: [2340, 3510, 3510],
                rows: [
                    new TableRow({ children: [
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Term", bold: true })] })] }),
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Where Used / Formed", bold: true })] })] }),
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Key Characteristic", bold: true })] })] })
                    ] }),
                    new TableRow({ children: [
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("Cyclone")] })] }),
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("")] })] }),
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("")] })] })
                    ] }),
                    new TableRow({ children: [
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("Hurricane")] })] }),
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("")] })] }),
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("")] })] })
                    ] }),
                    new TableRow({ children: [
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("Typhoon")] })] }),
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("")] })] }),
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("")] })] })
                    ] }),
                    new TableRow({ children: [
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("Tornado")] })] }),
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("")] })] }),
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("")] })] })
                    ] })
                ]
            }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Section C: Cyclone Categories")] }),
            new Paragraph({ children: [new TextRun("As discussed in class, complete the table relating cyclone categories to wind speeds:")] }),
            new Table({
                columnWidths: [1872, 3744, 3744],
                rows: [
                    new TableRow({ children: [
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Category", bold: true })] })] }),
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Strongest Gusts (km/h)", bold: true })] })] }),
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Potential Impact", bold: true })] })] })
                    ] }),
                    ...[1, 2, 3, 4, 5].map(cat => new TableRow({ children: [
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun(cat.toString())] })] }),
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("")] })] }),
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("")] })] })
                    ] }))
                ]
            }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Section D: Case Study Comprehension")] }),
            new Paragraph({ children: [new TextRun("After reading your assigned case study (Yasi or Larry), answer the following:")] }),
            new Paragraph({ children: [new TextRun("1. What was the maximum wind speed recorded for this cyclone? What category was it?")] }),
            new Paragraph({ children: [new TextRun("____________________________________________________________")] }),
            new Paragraph({ children: [new TextRun("2. Identify one major effect this cyclone had on the Earth's surface (environment).")] }),
            new Paragraph({ children: [new TextRun("____________________________________________________________")] }),
            new Paragraph({ children: [new TextRun("3. Describe the effects of this cyclone on the local community (buildings, people).")] }),
            new Paragraph({ children: [new TextRun("____________________________________________________________")] }),
            new Paragraph({ children: [new TextRun("4. How did the community prepare for this event?")] }),
            new Paragraph({ children: [new TextRun("____________________________________________________________")] }),
            new Paragraph({ children: [new TextRun("5. Why was the number of fatalities so low?")] }),
            new Paragraph({ children: [new TextRun("____________________________________________________________")] })
        ]
    }]
});

Packer.toBuffer(doc).then(buffer => fs.writeFileSync("Units/Science/Unit 2 Natural disasters/Lessons_06_08/Lesson_06/Lesson_06_Handout.docx", buffer));
