const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType, HeadingLevel, WidthType, ShadingType } = require('docx');
const fs = require('fs');
const path = require('path');

// Ensure parent directories exist
const outputDir = "c:\\Users\\dsuth\\Documents\\Joshua\\Units\\Maths\\Maths_Unit_2\\Lesson_14";
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const doc = new Document({
    styles: {
        default: { 
            document: { 
                run: { 
                    font: "Arial", 
                    size: 24 // 12pt size (docx size is half-points, so 24 = 12pt)
                } 
            } 
        },
        paragraphStyles: [
            {
                id: "QuizTitle",
                name: "Quiz Title",
                basedOn: "Normal",
                run: { size: 36, bold: true, color: "112D4E", font: "Arial" }, // Deep Navy
                paragraph: { spacing: { before: 240, after: 120 }, alignment: AlignmentType.CENTER }
            },
            {
                id: "QuizSubtitle",
                name: "Quiz Subtitle",
                basedOn: "Normal",
                run: { size: 24, italic: true, color: "F96D00", font: "Arial" }, // Vibrant Orange
                paragraph: { spacing: { after: 300 }, alignment: AlignmentType.CENTER }
            },
            {
                id: "Question",
                name: "Question Text",
                basedOn: "Normal",
                run: { size: 24, bold: true, color: "112D4E", font: "Arial" },
                paragraph: { spacing: { before: 240, after: 120 } }
            },
            {
                id: "Option",
                name: "Option Text",
                basedOn: "Normal",
                run: { size: 24, font: "Arial" },
                paragraph: { spacing: { left: 360, before: 60, after: 60 } }
            },
            {
                id: "AnswerLine",
                name: "Answer Line",
                basedOn: "Normal",
                run: { size: 20, bold: true, color: "2E7D32", font: "Arial" }, // Green Success color
                paragraph: { spacing: { left: 360, before: 60, after: 60 } }
            },
            {
                id: "PointLine",
                name: "Point Line",
                basedOn: "Normal",
                run: { size: 20, bold: true, color: "3F72AF", font: "Arial" }, // Soft Blue
                paragraph: { spacing: { left: 360, before: 60, after: 240 } }
            }
        ]
    },
    sections: [{
        properties: { 
            page: { 
                size: { 
                    width: 12240, // US Letter width in DXA
                    height: 15840 // US Letter height in DXA
                }, 
                margin: { 
                    top: 1440, // 1 inch margins
                    right: 1440, 
                    bottom: 1440, 
                    left: 1440 
                } 
            } 
        },
        children: [
            new Paragraph({ style: "QuizTitle", children: [new TextRun("Lesson 14: Time Calculations Quiz")] }),
            new Paragraph({ style: "QuizSubtitle", children: [new TextRun("Year 5 Mathematics — Australian Curriculum v9 [AC9M5T03]")] }),
            
            new Paragraph({ spacing: { before: 200 } }),
            
            // Student Metadata Table (compatible with Word/Google Docs, dual-width)
            new Table({
                columnWidths: [1800, 7560],
                rows: [
                    new TableRow({ children: [
                        new TableCell({ width: { size: 1800, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: "Student Name:", bold: true })] })] }),
                        new TableCell({ width: { size: 7560, type: WidthType.DXA }, shading: { fill: "F9F7F7", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [] })] })
                    ]}),
                    new TableRow({ children: [
                        new TableCell({ width: { size: 1800, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: "Date:", bold: true })] })] }),
                        new TableCell({ width: { size: 7560, type: WidthType.DXA }, shading: { fill: "F9F7F7", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [] })] })
                    ]})
                ]
            }),

            new Paragraph({ spacing: { before: 300 } }),

            // Assessment Questions
            ...createQuestionBlock("1", "Convert 7:15 a.m. to 24-hour time.", [
                "A. 1915",
                "B. 0715",
                "C. 1715",
                "D. 0700"
            ], "B"),

            ...createQuestionBlock("2", "Convert 4:30 p.m. to 24-hour time.", [
                "A. 0430",
                "B. 1430",
                "C. 1630",
                "D. 1830"
            ], "C"),

            ...createQuestionBlock("3", "Convert 12:10 a.m. (10 minutes past midnight) to 24-hour time.", [
                "A. 1210",
                "B. 0010",
                "C. 2410",
                "D. 0110"
            ], "B"),

            ...createQuestionBlock("4", "Convert 1545 to 12-hour time.", [
                "A. 3:45 a.m.",
                "B. 3:45 p.m.",
                "C. 5:45 p.m.",
                "D. 15:45 p.m."
            ], "B"),

            ...createQuestionBlock("5", "Convert 0920 to 12-hour time.", [
                "A. 9:20 a.m.",
                "B. 9:20 p.m.",
                "C. 7:20 a.m.",
                "D. 9:00 a.m."
            ], "A"),

            ...createQuestionBlock("6", "Find the difference in time between 8:30 a.m. and 2:15 p.m. (Hint: Use the timeline jump strategy!)", [
                "A. 5 hours 15 minutes",
                "B. 5 hours 45 minutes",
                "C. 6 hours 15 minutes",
                "D. 6 hours 45 minutes"
            ], "B"),

            ...createQuestionBlock("7", "Find the difference in time between 10:45 a.m. and 4:30 p.m.", [
                "A. 5 hours 15 minutes",
                "B. 5 hours 45 minutes",
                "C. 6 hours 15 minutes",
                "D. 6 hours 30 minutes"
            ], "B"),

            ...createQuestionBlock("8", "Find the difference in time between 0940 and 1510 in 24-hour time.", [
                "A. 5 hours 10 minutes",
                "B. 5 hours 30 minutes",
                "C. 6 hours 10 minutes",
                "D. 5 hours 50 minutes"
            ], "B"),

            ...createQuestionBlock("9", "Find the difference in time between 0715 and 1350 in 24-hour time.", [
                "A. 6 hours 15 minutes",
                "B. 6 hours 35 minutes",
                "C. 5 hours 35 minutes",
                "D. 7 hours 35 minutes"
            ], "B"),

            ...createQuestionBlock("10", "What is the correct 24-hour time representation for Noon (12:00 p.m.)?", [
                "A. 0000",
                "B. 1200",
                "C. 2400",
                "D. 1200 p.m."
            ], "B")
        ]
    }]
});

function createQuestionBlock(num, questionText, options, correctAns) {
    return [
        new Paragraph({ style: "Question", children: [new TextRun(`${num}. ${questionText}`)] }),
        new Paragraph({ style: "Option", children: [new TextRun(options[0])] }),
        new Paragraph({ style: "Option", children: [new TextRun(options[1])] }),
        new Paragraph({ style: "Option", children: [new TextRun(options[2])] }),
        new Paragraph({ style: "Option", children: [new TextRun(options[3])] }),
        new Paragraph({ style: "AnswerLine", children: [new TextRun(`ANSWER: ${correctAns}`)] }),
        new Paragraph({ style: "PointLine", children: [new TextRun("POINT: 1")] })
    ];
}

const outputPath = path.join(outputDir, "Lesson_14_Assessment.docx");
Packer.toBuffer(doc).then(buffer => {
    fs.writeFileSync(outputPath, buffer);
    console.log(`Assessment created successfully at ${outputPath}`);
}).catch(err => {
    console.error("Error creating assessment docx:", err);
    process.exit(1);
});
