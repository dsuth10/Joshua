const { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } = require('docx');
const fs = require('fs');

const doc = new Document({
    styles: {
        default: {
            document: {
                run: { font: "Arial", size: 32 } // Larger font for Lucas
            }
        },
        paragraphStyles: [
            {
                id: "Heading1",
                name: "Heading 1",
                run: { size: 48, bold: true, color: "000000", font: "Arial" },
                paragraph: { spacing: { before: 240, after: 240 }, alignment: AlignmentType.CENTER }
            }
        ]
    },
    sections: [{
        properties: {
            page: {
                margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
                size: { width: 11906, height: 16838 } // A4
            }
        },
        children: [
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                    new TextRun({ text: "Year 2 English: Unit 2 — Lesson 12", bold: true, size: 28 }),
                ]
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 400 },
                children: [
                    new TextRun({ text: "Lucas: Sentence Openings", bold: true, size: 40 }),
                ]
            }),
            new Paragraph({
                children: [
                    new TextRun({ text: "Learning Intention:", bold: true }),
                    new TextRun(" I can compare how sentences start."),
                ]
            }),

            new Paragraph({
                spacing: { before: 400 },
                children: [
                    new TextRun("Look at the two sentences. Circle the one that tells us "),
                    new TextRun({ text: "WHEN", bold: true }),
                    new TextRun(" it happened."),
                ]
            }),

            new Paragraph({ spacing: { before: 400 }, children: [new TextRun({ text: "Pair 1:", bold: true })] }),
            new Paragraph({ children: [new TextRun("A. The water rose.")], spacing: { before: 200 } }),
            new Paragraph({ children: [new TextRun("B. In 1893, the water rose.")], spacing: { before: 200 } }),

            new Paragraph({ spacing: { before: 600 }, children: [new TextRun({ text: "Pair 2:", bold: true })] }),
            new Paragraph({ children: [new TextRun("A. People helped clean up.")], spacing: { before: 200 } }),
            new Paragraph({ children: [new TextRun("B. After the flood, people helped clean up.")], spacing: { before: 200 } }),

            new Paragraph({
                spacing: { before: 800 },
                children: [
                    new TextRun("Which sentence part should be circled? Draw a circle around the start of the 'B' sentences."),
                ]
            }),

            new Paragraph({
                spacing: { before: 400 },
                children: [
                    new TextRun("In 1893..."),
                ]
            }),
            new Paragraph({
                children: [
                    new TextRun("After the flood..."),
                ]
            }),

            new Paragraph({
                spacing: { before: 800 },
                children: [
                    new TextRun("Draw a picture of a flood below and write a short sentence starting with 'The flood...'"),
                ]
            }),
            new Paragraph({
                spacing: { before: 400 },
                children: [
                    new TextRun("__________________________________________________________________________"),
                ]
            }),
        ]
    }]
});

Packer.toBuffer(doc).then(buffer => {
    fs.writeFileSync("c:/Users/dsuth/Documents/Joshua/Units/English/English_Unit_2/Lesson_Plans/Handouts/Lesson_12_Handout_Lucas.docx", buffer);
    console.log("Lucas Handout created successfully.");
});
