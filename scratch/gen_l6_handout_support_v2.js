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
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Lesson 6 Handout (Support): Introducing Tropical Cyclones")] }),
            
            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Section A: Fill in the Blanks")] }),
            new Paragraph({ children: [new TextRun("Use the words in the box to complete the sentences below:")] }),
            new Table({
                rows: [
                    new TableRow({ children: [
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "26.5°C | cyclone | hurricane | typhoon | tornado | warm | ocean | eye | wind | categories", bold: true })] })] })
                    ] })
                ]
            }),
            new Paragraph({ spacing: { before: 120 }, children: [new TextRun("1. A ________ forms over warm ocean water.")] }),
            new Paragraph({ children: [new TextRun("2. The water temperature must be at least ________.")] }),
            new Paragraph({ children: [new TextRun("3. In Australia, we call these storms a ________.")] }),
            new Paragraph({ children: [new TextRun("4. In America, they call them a ________.")] }),
            new Paragraph({ children: [new TextRun("5. In Asia, they call them a ________.")] }),
            new Paragraph({ children: [new TextRun("6. A ________ is a violent spinning storm that forms over land.")] }),
            new Paragraph({ children: [new TextRun("7. The calm centre of a cyclone is called the ________.")] }),
            new Paragraph({ children: [new TextRun("8. Cyclones are measured in ________ from 1 to 5.")] }),
            new Paragraph({ children: [new TextRun("9. Cyclones get their energy from ________ water.")] }),
            new Paragraph({ children: [new TextRun("10. A Category 5 cyclone has the strongest ________.")] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Section B: Category Matching")] }),
            new Paragraph({ children: [new TextRun("Match the Cyclone Category to the description:")] }),
            new Table({
                columnWidths: [4680, 4680],
                rows: [
                    new TableRow({ children: [
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Category", bold: true })] })] }),
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Intensity", bold: true })] })] })
                    ] }),
                    new TableRow({ children: [
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("Category 1")] })] }),
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("Extremely Dangerous (Destruction)")] })] })
                    ] }),
                    new TableRow({ children: [
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("Category 3")] })] }),
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("Damaging (Minor damage)")] })] })
                    ] }),
                    new TableRow({ children: [
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("Category 5")] })] }),
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("Very Destructive (Structural damage)")] })] })
                    ] })
                ]
            }),
            new Paragraph({ children: [new TextRun("Draw lines to match them correctly based on class discussion.")] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Section C: Multiple Choice")] }),
            new Paragraph({ children: [new TextRun("Circle the correct answer:")] }),
            
            new Paragraph({ children: [new TextRun("1. Where do cyclones form?")] }),
            new Paragraph({ children: [new TextRun("   a) Over the land              b) Over the warm ocean")] }),
            
            new Paragraph({ spacing: { before: 120 }, children: [new TextRun("2. What is a 'storm surge'?")] }),
            new Paragraph({ children: [new TextRun("   a) When the sea level rises    b) When it stops raining")] }),
            
            new Paragraph({ spacing: { before: 120 }, children: [new TextRun("3. What happens to the Earth's surface in a cyclone?")] }),
            new Paragraph({ children: [new TextRun("   a) Trees and crops can be destroyed   b) Nothing happens")] }),
            
            new Paragraph({ spacing: { before: 120 }, children: [new TextRun("4. What effect can a cyclone have on a community?")] }),
            new Paragraph({ children: [new TextRun("   a) Houses can lose their roofs        b) Schools stay open as normal")] }),
            
            new Paragraph({ spacing: { before: 120 }, children: [new TextRun("5. Which is the safest thing to do in a cyclone?")] }),
            new Paragraph({ children: [new TextRun("   a) Go to a safe shelter               b) Play outside in the wind")] })
        ]
    }]
});

Packer.toBuffer(doc).then(buffer => fs.writeFileSync("Units/Science/Unit 2 Natural disasters/Lessons_06_08/Lesson_06/Lesson_06_Handout_Support.docx", buffer));
