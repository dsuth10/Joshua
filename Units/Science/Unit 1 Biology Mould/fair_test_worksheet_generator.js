const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } = require('docx');
const fs = require('fs');

const doc = new Document({
    sections: [{
        properties: {},
        children: [
            new Paragraph({
                text: "Science: Year 6 Biology",
                heading: HeadingLevel.HEADING_1,
                alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
                text: "Fair Test Challenge - Can You Fix the Experiment?",
                heading: HeadingLevel.TITLE,
                alignment: AlignmentType.CENTER,
                spacing: { after: 400 },
            }),
            new Paragraph({
                children: [
                    new TextRun({ text: "Name: __________________________", bold: true }),
                    new TextRun({ text: "      Date: ____________", bold: true }),
                ],
                spacing: { after: 400 },
            }),

            // Scenario 1
            createScenarioParagraph("Scenario 1: The Bread Experiment", "Sarah wants to see if light affects mould growth. She puts one piece of bread in a dark, cool cupboard and another piece on a sunny, warm windowsill."),
            createQuestionBox(),

            // Scenario 2
            createScenarioParagraph("Scenario 2: The Seed Soaker", "Jack wants to know if seeds grow better in water or vinegar. He puts 10 seeds in two identical pots. Both pots stay on the same table and get the same amount of liquid."),
            createQuestionBox(),

            // Scenario 3
            createScenarioParagraph("Scenario 3: Fertilizer Power", "Emily tests two different fertilizers. She gives Fertilizer A to a plant and waters it every day. She gives Fertilizer B to another plant but only waters it once a week."),
            createQuestionBox(),

            // Scenario 4
            createScenarioParagraph("Scenario 4: Salt vs Fresh", "Leo wants to see if salt water stops seeds from sprouting. He puts 10 seeds in a fresh water pot and only 5 seeds in a salt water pot."),
            createQuestionBox(),
        ],
    }],
});

function createScenarioParagraph(title, description) {
    return new Paragraph({
        children: [
            new TextRun({ text: title, bold: true, size: 28, underline: {} }),
            new TextRun({ text: "\n" + description, size: 24 }),
        ],
        spacing: { before: 400, after: 200 },
    });
}

function createQuestionBox() {
    return new Paragraph({
        children: [
            new TextRun({ text: "Is this a Fair Test? (Yes/No): _______________________", size: 24 }),
            new TextRun({ text: "\n\nWhy / Why not? ____________________________________________________________________", size: 24 }),
            new TextRun({ text: "\n____________________________________________________________________________________", size: 24 }),
            new TextRun({ text: "\n\nHow would you FIX this to make it a Fair Test? ___________________________________________", size: 24 }),
            new TextRun({ text: "\n____________________________________________________________________________________", size: 24 }),
        ],
        border: {
            top: { color: "3A6B35", size: 1, space: 10, style: BorderStyle.SINGLE },
            bottom: { color: "3A6B35", size: 1, space: 10, style: BorderStyle.SINGLE },
            left: { color: "3A6B35", size: 1, space: 10, style: BorderStyle.SINGLE },
            right: { color: "3A6B35", size: 1, space: 10, style: BorderStyle.SINGLE },
        },
        spacing: { before: 200, after: 400 },
    });
}

Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync("Lesson_3_4_Fair_Test_Worksheet.docx", buffer);
    console.log("Worksheet created successfully: Lesson_3_4_Fair_Test_Worksheet.docx");
});
