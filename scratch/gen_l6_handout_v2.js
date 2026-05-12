const { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle } = require('docx');
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
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("1. Minimum sea surface temperature needed:")] })] }),
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("")] })] })
                    ] }),
                    new TableRow({ children: [
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("2. What happens to warm, moist air?")] })] }),
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("")] })] })
                    ] }),
                    new TableRow({ children: [
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("3. Wind speed to be classified as a Category 1 cyclone:")] })] }),
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("")] })] })
                    ] }),
                    new TableRow({ children: [
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("4. Rotation direction in the Southern Hemisphere:")] })] }),
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("")] })] })
                    ] }),
                    new TableRow({ children: [
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("5. What is the calm centre of the storm called?")] })] }),
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("")] })] })
                    ] }),
                    new TableRow({ children: [
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("6. One major impact on Earth's surface mentioned:")] })] }),
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("")] })] })
                    ] })
                ]
            }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Section B: Terminology & Vocabulary")] }),
            new Table({
                columnWidths: [3120, 3120, 3120],
                rows: [
                    new TableRow({ children: [
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Term", bold: true })] })] }),
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Definition / Where Used", bold: true })] })] }),
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Hemisphere", bold: true })] })] })
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
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("N/A (Both)")] })] })
                    ] }),
                    new TableRow({ children: [
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("Storm Surge")] })] }),
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("")] })] }),
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("N/A")] })] })
                    ] }),
                    new TableRow({ children: [
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("Eye Wall")] })] }),
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("")] })] }),
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("N/A")] })] })
                    ] })
                ]
            }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Section C: Reading Comprehension")] }),
            new Paragraph({ children: [new TextRun("After reading your assigned case study (Yasi or Larry), answer the following:")] }),
            new Paragraph({ spacing: { before: 120 }, children: [new TextRun("1. What was the maximum wind speed recorded for this cyclone?")] }),
            new Paragraph({ children: [new TextRun("____________________________________________________________")] }),
            new Paragraph({ spacing: { before: 120 }, children: [new TextRun("2. Identify one major impact this cyclone had on the environment.")] }),
            new Paragraph({ children: [new TextRun("____________________________________________________________")] }),
            new Paragraph({ spacing: { before: 120 }, children: [new TextRun("3. How did the community prepare for this event?")] }),
            new Paragraph({ children: [new TextRun("____________________________________________________________")] }),
            new Paragraph({ spacing: { before: 120 }, children: [new TextRun("4. Why was the number of fatalities so low?")] }),
            new Paragraph({ children: [new TextRun("____________________________________________________________")] }),
            new Paragraph({ spacing: { before: 120 }, children: [new TextRun("5. Record one interesting statistic or fact from the text.")] }),
            new Paragraph({ children: [new TextRun("____________________________________________________________")] })
        ]
    }]
});

Packer.toBuffer(doc).then(buffer => fs.writeFileSync("Lessons_06_08/Lesson_06/Lesson_06_Handout.docx", buffer));
