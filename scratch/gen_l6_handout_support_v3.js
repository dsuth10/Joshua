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
                        new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "26.5°C | cyclone | hurricane | typhoon | clockwise | warm | ocean | eye | wind | categories", bold: true })] })] })
                    ] })
                ]
            }),
            new Paragraph({ spacing: { before: 120 }, children: [new TextRun("1. A ________ forms over warm ocean water.")] }),
            new Paragraph({ children: [new TextRun("2. The water temperature must be at least ________.")] }),
            new Paragraph({ children: [new TextRun("3. In Australia, we call these storms a ________.")] }),
            new Paragraph({ children: [new TextRun("4. In America, they call them a ________.")] }),
            new Paragraph({ children: [new TextRun("5. In Asia, they call them a ________.")] }),
            new Paragraph({ children: [new TextRun("6. Cyclones in Australia spin in a ________ direction.")] }),
            new Paragraph({ children: [new TextRun("7. The calm centre of the storm is called the ________.")] }),
            new Paragraph({ children: [new TextRun("8. Cyclones are measured in ________ from 1 to 5.")] }),
            new Paragraph({ children: [new TextRun("9. Cyclones get their energy from ________ water.")] }),
            new Paragraph({ children: [new TextRun("10. A Category 5 cyclone has the strongest ________.")] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Section B: Multiple Choice")] }),
            new Paragraph({ children: [new TextRun("Circle the correct answer:")] }),
            
            new Paragraph({ children: [new TextRun("1. What is a tropical cyclone?")] }),
            new Paragraph({ children: [new TextRun("   a) A giant spinning storm     b) A small rain cloud       c) A type of tree")] }),
            
            new Paragraph({ spacing: { before: 120 }, children: [new TextRun("2. Where do cyclones form?")] }),
            new Paragraph({ children: [new TextRun("   a) Over the land              b) Over the warm ocean      c) In the mountains")] }),
            
            new Paragraph({ spacing: { before: 120 }, children: [new TextRun("3. What is the 'eye' of the cyclone like?")] }),
            new Paragraph({ children: [new TextRun("   a) Very windy and rainy       b) Calm and clear           c) Filled with snow")] }),
            
            new Paragraph({ spacing: { before: 120 }, children: [new TextRun("4. Which is a name of a real Australian cyclone?")] }),
            new Paragraph({ children: [new TextRun("   a) Cyclone Yasi               b) Cyclone Thunder          c) Cyclone Snowball")] }),
            
            new Paragraph({ spacing: { before: 120 }, children: [new TextRun("5. How many categories of cyclones are there?")] }),
            new Paragraph({ children: [new TextRun("   a) 5                          b) 20                       c) 100")] }),
            
            new Paragraph({ spacing: { before: 120 }, children: [new TextRun("6. What do we use to see cyclones from high up in space?")] }),
            new Paragraph({ children: [new TextRun("   a) Satellites                 b) Binoculars               c) Telescopes")] }),
            
            new Paragraph({ spacing: { before: 120 }, children: [new TextRun("7. What is a 'storm surge'?")] }),
            new Paragraph({ children: [new TextRun("   a) When the sea level rises    b) When it stops raining    c) The sun comes out")] }),
            
            new Paragraph({ spacing: { before: 120 }, children: [new TextRun("8. Which town did Cyclone Larry hit in 2006?")] }),
            new Paragraph({ children: [new TextRun("   a) Innisfail                  b) Brisbane                 c) Sydney")] }),
            
            new Paragraph({ spacing: { before: 120 }, children: [new TextRun("9. Who gives the cyclone warnings in Australia?")] }),
            new Paragraph({ children: [new TextRun("   a) The Library                b) The BOM                  c) The Post Office")] }),
            
            new Paragraph({ spacing: { before: 120 }, children: [new TextRun("10. What should people do if a cyclone is coming?")] }),
            new Paragraph({ children: [new TextRun("   a) Go to a safe shelter       b) Go swimming in the ocean c) Go to the park")] })
        ]
    }]
});

Packer.toBuffer(doc).then(buffer => fs.writeFileSync("Lessons_06_08/Lesson_06/Lesson_06_Handout_Support.docx", buffer));
