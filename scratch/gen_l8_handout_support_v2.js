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
            
            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Section A: Fill in the Blanks")] }),
            new Paragraph({ children: [new TextRun("Use the words in the box to complete the sentences below:")] }),
            new Table({
                rows: [
                    new TableRow({ children: [
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "vortex | rotation | clockwise | southern | model | George | Mahina | bottle | Coriolis | tracking", bold: true })] })] })
                    ] })
                ]
            }),
            new Paragraph({ spacing: { before: 120 }, children: [new TextRun("1. Cyclones in the ________ hemisphere spin clockwise.")] }),
            new Paragraph({ children: [new TextRun("2. The ________ effect is caused by the Earth's rotation.")] }),
            new Paragraph({ children: [new TextRun("3. A ________ is a spinning mass of water or air.")] }),
            new Paragraph({ children: [new TextRun("4. We can make a cyclone in a ________ to study it.")] }),
            new Paragraph({ children: [new TextRun("5. Scientists use a ________ to represent complex systems.")] }),
            new Paragraph({ children: [new TextRun("6. Cyclone ________ was the deadliest in Australia.")] }),
            new Paragraph({ children: [new TextRun("7. Cyclone ________ hit mining camps in 2007.")] }),
            new Paragraph({ children: [new TextRun("8. Cyclone ________ means mapping where the storm goes.")] }),
            new Paragraph({ children: [new TextRun("9. The Earth's ________ causes the spinning movement.")] }),
            new Paragraph({ children: [new TextRun("10. In Australia, cyclones always spin in a ________ direction.")] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Section B: Multiple Choice")] }),
            new Paragraph({ children: [new TextRun("Circle the correct answer:")] }),
            
            new Paragraph({ children: [new TextRun("1. Why do cyclones spin?")] }),
            new Paragraph({ children: [new TextRun("   a) Earth's rotation         b) Strong winds              c) Ocean waves")] }),
            
            new Paragraph({ spacing: { before: 120 }, children: [new TextRun("2. Which way do cyclones spin in Australia?")] }),
            new Paragraph({ children: [new TextRun("   a) Clockwise                b) Anti-clockwise            c) Up and down")] }),
            
            new Paragraph({ spacing: { before: 120 }, children: [new TextRun("3. What is a vortex?")] }),
            new Paragraph({ children: [new TextRun("   a) A spinning mass of air   b) A flat cloud              c) A type of boat")] }),
            
            new Paragraph({ spacing: { before: 120 }, children: [new TextRun("4. Which cyclone hit the pearling fleet in 1899?")] }),
            new Paragraph({ children: [new TextRun("   a) Cyclone Mahina           b) Cyclone George            c) Cyclone Larry")] }),
            
            new Paragraph({ spacing: { before: 120 }, children: [new TextRun("5. What was the height of the storm surge from Cyclone Mahina?")] }),
            new Paragraph({ children: [new TextRun("   a) 2 metres                 b) 13 metres                 c) 50 metres")] }),
            
            new Paragraph({ spacing: { before: 120 }, children: [new TextRun("6. Why do we use a 'Cyclone in a Bottle' model?")] }),
            new Paragraph({ children: [new TextRun("   a) It's fun and safe        b) It's exactly the same     c) To save water")] }),
            
            new Paragraph({ spacing: { before: 120 }, children: [new TextRun("7. What is a limitation of the bottle model?")] }),
            new Paragraph({ children: [new TextRun("   a) No heat source           b) It's too small            c) Both a and b")] }),
            
            new Paragraph({ spacing: { before: 120 }, children: [new TextRun("8. What is 'cyclone tracking'?")] }),
            new Paragraph({ children: [new TextRun("   a) Predicting the path      b) Counting trees            c) Chasing storms")] }),
            
            new Paragraph({ spacing: { before: 120 }, children: [new TextRun("9. Which region did Cyclone George hit in 2007?")] }),
            new Paragraph({ children: [new TextRun("   a) The Pilbara              b) Brisbane                  c) Sydney")] }),
            
            new Paragraph({ spacing: { before: 120 }, children: [new TextRun("10. What does the Coriolis Effect do to cyclones?")] }),
            new Paragraph({ children: [new TextRun("   a) Makes them spin          b) Makes them stop           c) Makes it rain")] })
        ]
    }]
});

Packer.toBuffer(doc).then(buffer => fs.writeFileSync("Lessons_06_08/Lesson_08/Lesson_08_Handout_Support.docx", buffer));
