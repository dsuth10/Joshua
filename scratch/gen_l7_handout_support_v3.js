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
            
            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Section A: Fill in the Blanks")] }),
            new Paragraph({ children: [new TextRun("Use the words in the box to complete the sentences below:")] }),
            new Table({
                rows: [
                    new TableRow({ children: [
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "convection | eye | rising | sinking | labeled | annotated | bands | Tracy | building | ocean", bold: true })] })] })
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
            new Paragraph({ children: [new TextRun("9. Cyclones get their energy from the warm ________.")] }),
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
            
            new Paragraph({ spacing: { before: 120 }, children: [new TextRun("7. What drives the formation of a cyclone?")] }),
            new Paragraph({ children: [new TextRun("   a) Convection                 b) Earthquakes                c) Moonlight")] }),
            
            new Paragraph({ spacing: { before: 120 }, children: [new TextRun("8. Why are modern houses safer?")] }),
            new Paragraph({ children: [new TextRun("   a) Better building codes      b) They are newer             c) They have more windows")] }),
            
            new Paragraph({ spacing: { before: 120 }, children: [new TextRun("9. Where is the air pressure lowest?")] }),
            new Paragraph({ children: [new TextRun("   a) The eye                    b) The rain bands             c) On the ground")] }),
            
            new Paragraph({ spacing: { before: 120 }, children: [new TextRun("10. What is the calm part of the cyclone called?")] }),
            new Paragraph({ children: [new TextRun("   a) The eye                    b) The eye wall               c) The storm surge")] })
        ]
    }]
});

Packer.toBuffer(doc).then(buffer => fs.writeFileSync("Lessons_06_08/Lesson_07/Lesson_07_Handout_Support.docx", buffer));
