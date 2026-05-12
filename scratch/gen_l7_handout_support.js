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
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Lesson 7 Handout (Support): Cyclone Structure")] }),
            
            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Section A: Diagram Labels")] }),
            new Paragraph({ children: [new TextRun("Use these words to label your diagram:")] }),
            new Paragraph({ children: [new TextRun({ text: "Eye | Eye Wall | Rain Bands | Warm Air Rising", bold: true })] }),
            
            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Section B: Reading Help")] }),
            new Paragraph({ children: [new TextRun("1. Why did homes break in Cyclone Althea?")] }),
            new Paragraph({ children: [new TextRun("   a) Strong wind pushed the roofs off   b) They were too old")] }),
            new Paragraph({ children: [new TextRun("2. What does the Cyclone Testing Station do?")] }),
            new Paragraph({ children: [new TextRun("   a) Makes toys   b) Tests how houses stand up to wind")] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Section C: Investigation")] }),
            new Paragraph({ children: [new TextRun("Prediction: I think the warm red water will (circle one):")] }),
            new Paragraph({ children: [new TextRun("      RISE UP      |      SINK DOWN")] }),
            new Paragraph({ children: [new TextRun("Draw arrows to show how the water moved:") ] }),
            new Paragraph({ children: [new TextRun("[SPACE FOR DIAGRAM]")] })
        ]
    }]
});

Packer.toBuffer(doc).then(buffer => fs.writeFileSync("Lessons_06_08/Lesson_07/Lesson_07_Handout_Support.docx", buffer));
