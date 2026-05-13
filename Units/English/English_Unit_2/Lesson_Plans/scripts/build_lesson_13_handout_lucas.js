const { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } = require('docx');
const fs = require('fs');

// Helper for writing boxes
function drawBox(heightLines = 3) {
    return Array.from({ length: heightLines }, () =>
        new Paragraph({
            children: [new TextRun({ text: "_____________________________________________________________________________", color: "aaaaaa" })],
            spacing: { before: 60, after: 200 }
        })
    );
}

const doc = new Document({
    styles: {
        default: {
            document: { run: { font: "Arial", size: 32 } } // Larger for Lucas
        },
        paragraphStyles: [
            {
                id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
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
            // Header
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "Year 2 English: Unit 2 — Lesson 13", bold: true, size: 28 })]
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 300 },
                children: [new TextRun({ text: "Lucas: What's Happening in These Pictures?", bold: true, size: 40 })]
            }),
            new Paragraph({
                children: [
                    new TextRun({ text: "Learning Intention: ", bold: true }),
                    new TextRun("I can look at three flood pictures and explain what is happening. (AC9E2LA08, AC9E2LY05)")
                ]
            }),

            // Task 1 — Put in order
            new Paragraph({
                spacing: { before: 400 },
                children: [new TextRun({ text: "Task 1: Put These in Order", bold: true, size: 36 })]
            }),
            new Paragraph({
                spacing: { before: 120, after: 160 },
                children: [
                    new TextRun("These three descriptions tell us about Brisbane floods. Put them in order — write "),
                    new TextRun({ text: "1, 2, 3", bold: true }),
                    new TextRun(" in the boxes.")
                ]
            }),

            ...["□  In 2022, over 900 homes were flooded in 48 hours.",
               "□  In 1974, 6,700 homes were flooded in Brisbane.",
               "□  In 2011, 12,500 properties were flooded — the biggest since 1974."].map(text =>
                new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text, size: 32 })] })
            ),

            // Task 2 — Draw arrows
            new Paragraph({
                spacing: { before: 400 },
                children: [new TextRun({ text: "Task 2: Draw the Story", bold: true, size: 36 })]
            }),
            new Paragraph({
                spacing: { before: 120, after: 160 },
                children: [new TextRun("Draw three boxes below. In each box, draw a simple picture of what happened (1974, 2011, 2022). Draw an arrow between each box to show the order.")]
            }),
            new Paragraph({
                spacing: { before: 80, after: 80 },
                children: [new TextRun("[ Box 1: 1974 ]  →  [ Box 2: 2011 ]  →  [ Box 3: 2022 ]")]
            }),
            ...["_____________________________________________________________________________",
               "_____________________________________________________________________________",
               "_____________________________________________________________________________",
               "_____________________________________________________________________________",
               "_____________________________________________________________________________"].map(line =>
                new Paragraph({ spacing: { before: 0, after: 0 }, children: [new TextRun({ text: line, color: "aaaaaa" })] })
            ),

            // Task 3 — Sentence starters
            new Paragraph({
                spacing: { before: 400 },
                children: [new TextRun({ text: "Task 3: Answer These Questions", bold: true, size: 36 })]
            }),
            new Paragraph({
                spacing: { before: 120 },
                children: [new TextRun({ text: "What happened first?", bold: true })]
            }),
            new Paragraph({
                spacing: { before: 80 },
                children: [new TextRun({ text: "First, ________________________ happened in the year ______.", size: 32 })]
            }),
            ...drawBox(1),

            new Paragraph({
                spacing: { before: 200 },
                children: [new TextRun({ text: "What happened next?", bold: true })]
            }),
            new Paragraph({
                spacing: { before: 80 },
                children: [new TextRun({ text: "Next, ________________________ happened in the year ______.", size: 32 })]
            }),
            ...drawBox(1),

            new Paragraph({
                spacing: { before: 200 },
                children: [new TextRun({ text: "How did the floods change over time?", bold: true })]
            }),
            new Paragraph({
                spacing: { before: 80 },
                children: [new TextRun({ text: "Over time, the floods got __________________ because __________________________.", size: 32 })]
            }),
            ...drawBox(1),

            // Drawing box
            new Paragraph({
                spacing: { before: 400 },
                children: [new TextRun({ text: "Bonus: Draw a flood picture below and label what is happening:", bold: true })]
            }),
            ...[...Array(8)].map(() =>
                new Paragraph({ spacing: { before: 0, after: 0 }, children: [new TextRun({ text: "_____________________________________________________________________________", color: "aaaaaa" })] })
            )
        ]
    }]
});

Packer.toBuffer(doc).then(buffer => {
    fs.writeFileSync(
        "c:/Users/dsuth/Documents/Joshua/Units/English/English_Unit_2/Lesson_Plans/Handouts/Lesson_13_Handout_Lucas.docx",
        buffer
    );
    console.log("✅ Lesson 13 Lucas Handout created successfully.");
});
