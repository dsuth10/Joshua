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
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Lesson 7 Handout (Support): Structure & Convection")] }),
            
            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Section A: Fill in the Blanks")] }),
            new Paragraph({ children: [new TextRun("Use the words in the box to complete the sentences below:")] }),
            new Table({
                rows: [
                    new TableRow({ children: [
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "convection | eye | rising | sinking | labeled | annotated | bands | Tracy | building | water", bold: true })] })] })
                    ] })
                ]
            }),
            new Paragraph({ spacing: { before: 120 }, children: [new TextRun("1. Warm air is ________ because it is less dense.")] }),
            new Paragraph({ children: [new TextRun("2. Cool air is ________ because it is more dense.")] }),
            new Paragraph({ children: [new TextRun("3. This circular movement is called a ________ current.")] }),
            new Paragraph({ children: [new TextRun("4. An ________ diagram includes detailed explanations.")] }),
            new Paragraph({ children: [new TextRun("5. A ________ diagram only has names and arrows.")] }),
            new Paragraph({ children: [new TextRun("6. The rain ________ are the spiral arms of rain.")] }),
            new Paragraph({ children: [new TextRun("7. Cyclone ________ hit Darwin in 1974.")] }),
            new Paragraph({ children: [new TextRun("8. After the storms, Australia changed its ________ codes.")] }),
            new Paragraph({ children: [new TextRun("9. Convection currents can be modeled using warm ________.")] }),
            new Paragraph({ children: [new TextRun("10. The ________ is the calm centre of the storm.")] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Section B: Multiple Choice")] }),
            new Paragraph({ children: [new TextRun("Circle the correct answer:")] }),
            
            new Paragraph({ children: [new TextRun("1. What happens to warm air in a convection current?")] }),
            new Paragraph({ children: [new TextRun("   a) It rises                   b) It sinks                   c) It disappears")] }),
            
            new Paragraph({ spacing: { before: 120 }, children: [new TextRun("2. What happens to cool air in a convection current?")] }),
            new Paragraph({ children: [new TextRun("   a) It rises                   b) It sinks                   c) It turns red")] }),
            
            new Paragraph({ spacing: { before: 120 }, children: [new TextRun("3. What is an annotated diagram?")] }),
            new Paragraph({ children: [new TextRun("   a) A diagram with names only  b) A diagram with names and notes c) A photograph")] }),
            
            new Paragraph({ spacing: { before: 120 }, children: [new TextRun("4. Which part of a cyclone has the strongest winds?")] }),
            new Paragraph({ children: [new TextRun("   a) The eye                    b) The eye wall               c) The rain bands")] }),
            
            new Paragraph({ spacing: { before: 120 }, children: [new TextRun("5. What happened to the city of Darwin in 1974?")] }),
            new Paragraph({ children: [new TextRun("   a) It was flooded             b) It was hit by Cyclone Tracy c) A new bridge was built")] }),
            
            new Paragraph({ spacing: { before: 120 }, children: [new TextRun("6. What is the Cyclone Testing Station used for?")] }),
            new Paragraph({ children: [new TextRun("   a) Testing how houses stand up to wind  b) Making rain       c) Catching fish")] }),
            
            new Paragraph({ spacing: { before: 120 }, children: [new TextRun("7. What color did we use for hot water in our experiment?")] }),
            new Paragraph({ children: [new TextRun("   a) Red                        b) Blue                       c) Green")] }),
            
            new Paragraph({ spacing: { before: 120 }, children: [new TextRun("8. What color did we use for cold water?")] }),
            new Paragraph({ children: [new TextRun("   a) Red                        b) Blue                       c) Yellow")] }),
            
            new Paragraph({ spacing: { before: 120 }, children: [new TextRun("9. Why do we do a risk assessment before an experiment?")] }),
            new Paragraph({ children: [new TextRun("   a) To stay safe               b) To have fun                c) To finish early")] }),
            
            new Paragraph({ spacing: { before: 120 }, children: [new TextRun("10. What scientific process drives cyclone formation?")] }),
            new Paragraph({ children: [new TextRun("   a) Convection                 b) Earthquakes                c) Moonlight")] })
        ]
    }]
});

Packer.toBuffer(doc).then(buffer => fs.writeFileSync("Lessons_06_08/Lesson_07/Lesson_07_Handout_Support.docx", buffer));
