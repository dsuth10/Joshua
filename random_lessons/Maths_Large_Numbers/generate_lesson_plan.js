const { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, LevelFormat } = require('docx');
const fs = require('fs');
const path = require('path');

const outputDir = "c:\\Users\\dsuth\\Documents\\Joshua\\Maths_Large_Numbers";
const fileName = "Lesson_Plan_Large_Numbers.docx";

const THEME = {
    ochre: "B12E21",
    charcoal: "2B2B2B",
    font: "Arial"
};

const doc = new Document({
    styles: {
        default: { document: { run: { font: THEME.font, size: 24, color: THEME.charcoal } } },
        paragraphStyles: [
            {
                id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal",
                run: { size: 32, bold: true, color: THEME.charcoal, font: THEME.font },
                paragraph: { spacing: { before: 400, after: 200 } }
            }
        ]
    },
    numbering: {
        config: [
            {
                reference: "bullet-list",
                levels: [{
                    level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
                    style: { paragraph: { indent: { left: 720, hanging: 360 } } }
                }]
            }
        ]
    },
    sections: [{
        children: [
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 200 },
                children: [new TextRun({ text: "LESSON PLAN: USING LARGE NUMBERS", bold: true, size: 40, color: THEME.ochre })]
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 400 },
                children: [new TextRun({ text: "Signpost Maths 5 - Number & Algebra", size: 28, italics: true })]
            }),

            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Learning Intention")] }),
            new Paragraph({
                children: [new TextRun("Students will develop proficiency in rounding numbers to the nearest million, using expanded notation for numbers up to eight digits, and applying partitioning strategies for mental computation.")]
            }),

            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Key Discussion Points")] }),

            new Paragraph({ text: "1. Place Value Review", bold: true }),
            new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Discuss the structure of numbers up to the millions.")] }),
            new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Identify that 'Three million' has 6 zeros.")] }),
            new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Review place value names: Millions, Hundred Thousands, Ten Thousands, Thousands.")] }),

            new Paragraph({ text: "2. Rounding to the Nearest Million", bold: true, spacing: { before: 200 } }),
            new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("The 'Rule of 5': Look at the figure to the right (hundred thousands).")] }),
            new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("If it's 5 or more, round up; otherwise, stay down.")] }),
            new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Example: 71,542,800 rounds to 72,000,000.")] }),

            new Paragraph({ text: "3. Expanded Notation", bold: true, spacing: { before: 200 } }),
            new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Expressing a number as the sum of its place values.")] }),
            new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Example: 3,475,040 = 3,000,000 + 400,000 + 70,000 + 5,000 + 40.")] }),

            new Paragraph({ text: "4. Partitioning & Computation", bold: true, spacing: { before: 200 } }),
            new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Partitioning involves breaking numbers into smaller parts to make subtraction/addition easier.")] }),
            new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Example: 157,350 - 150,000 = 7,350.")] }),

            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Lesson Sequence")] }),
            new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Explicit Instruction: Model rounding and expanded notation on the whiteboard using worksheet examples.")] }),
            new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Guided Practice: Solve a few problems from Section 1 and 2 together.")] }),
            new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Independent Practice: Students complete the 'Using Large Numbers' worksheet.")] }),
            new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Extension: Investigate large numbers in real-world contexts (e.g., city populations).")] })
        ]
    }]
});

Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync(path.join(outputDir, fileName), buffer);
    console.log(`Success: Lesson plan created at ${path.join(outputDir, fileName)}`);
}).catch(err => {
    console.error("Error creating lesson plan:", err);
    process.exit(1);
});
