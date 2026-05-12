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
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Lesson 8 Handout (Support): Modelling Cyclones")] }),
            
            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Section A: Cyclone Rotation")] }),
            new Paragraph({ children: [new TextRun("Circle the correct answer:")] }),
            new Paragraph({ children: [new TextRun("In Australia, cyclones spin: ")] }),
            new Paragraph({ children: [new TextRun("   a) Clockwise   b) Anti-clockwise")] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Section B: Reading Help")] }),
            new Paragraph({ children: [new TextRun("1. Which storm was the deadliest in Australia? ")] }),
            new Paragraph({ children: [new TextRun("   a) Cyclone Mahina   b) Cyclone George")] }),
            new Paragraph({ children: [new TextRun("2. Cyclone George hit the mining camps in: ")] }),
            new Paragraph({ children: [new TextRun("   a) Queensland   b) Western Australia")] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Section C: Prediction")] }),
            new Paragraph({ children: [new TextRun("Prediction: I think the water will (circle one):")] }),
            new Paragraph({ children: [new TextRun("      SPIN FAST      |      NOT MOVE")] }),
            new Paragraph({ children: [new TextRun("Draw arrows to show how the water moved:") ] }),
            new Paragraph({ children: [new TextRun("[SPACE FOR DIAGRAM]")] })
        ]
    }]
});

Packer.toBuffer(doc).then(buffer => fs.writeFileSync("Lessons_06_08/Lesson_08/Lesson_08_Handout_Support.docx", buffer));
