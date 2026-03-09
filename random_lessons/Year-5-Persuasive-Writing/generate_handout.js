const { Document, Packer, Paragraph, TextRun, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType, LevelFormat } = require('docx');
const fs = require('fs');

const THEME = {
    navy: '112D4E',
    orange: 'F96D00', // Evidence
    white: 'F9F7F7',
    blue: '3F72AF',   // Point
    green: '4E9F3D',  // Elaboration
    red: 'C0392B'     // Link
};

async function generateHandout() {
    const doc = new Document({
        styles: {
            default: { document: { run: { font: "Arial", size: 24 } } },
            paragraphStyles: [
                {
                    id: "Heading1",
                    name: "Heading 1",
                    basedOn: "Normal",
                    next: "Normal",
                    quickFormat: true,
                    run: { size: 32, bold: true, color: THEME.navy, font: "Arial" },
                    paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 }
                },
                {
                    id: "SectionHeader",
                    name: "Section Header",
                    basedOn: "Normal",
                    run: { size: 28, bold: true, color: "FFFFFF", font: "Arial" },
                    paragraph: { 
                        spacing: { before: 120, after: 120 },
                        shading: { fill: THEME.navy, type: ShadingType.CLEAR }
                    }
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
                    children: [
                        new TextRun({ text: "Year 5 Persuasive Writing: The PEEL Structure", bold: true, size: 36, color: THEME.navy })
                    ],
                    spacing: { after: 400 }
                }),
                new Paragraph({
                    children: [
                        new TextRun({ text: "Name: ______________________    Date: ________________", size: 24 })
                    ],
                    spacing: { after: 400 }
                }),

                // Part 1: Persuasive Toolkit
                new Paragraph({ text: "Part 1: Your Persuasive Toolkit", style: "Heading1" }),
                new Table({
                    columnWidths: [3120, 6240],
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Technique", bold: true })] })], shading: { fill: "D5E8F0", type: ShadingType.CLEAR } }),
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Example", bold: true })] })], shading: { fill: "D5E8F0", type: ShadingType.CLEAR } })
                            ]
                        }),
                        new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph({ text: "Alliteration" })] }),
                                new TableCell({ children: [new Paragraph({ text: "Powerful, persuasive paragraphs." })] })
                            ]
                        }),
                        new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph({ text: "Rhetorical Question" })] }),
                                new TableCell({ children: [new Paragraph({ text: "Don't you want to be heard?" })] })
                            ]
                        }),
                        new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph({ text: "Emotive Language" })] }),
                                new TableCell({ children: [new Paragraph({ text: "It is a terrible, heart-breaking shame." })] })
                            ]
                        }),
                        new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph({ text: "Rule of Three" })] }),
                                new TableCell({ children: [new Paragraph({ text: "Focus, fight, and finish." })] })
                            ]
                        })
                    ]
                }),

                // Part 2: What is PEEL?
                new Paragraph({ text: "Part 2: What is PEEL?", style: "Heading1", spacing: { before: 400 } }),
                new Paragraph({
                    children: [
                        new TextRun({ text: "P - Point (Blue): ", bold: true, color: THEME.blue }),
                        new TextRun({ text: "What is your main argument?" })
                    ]
                }),
                new Paragraph({
                    children: [
                        new TextRun({ text: "E - Elaboration (Green): ", bold: true, color: THEME.green }),
                        new TextRun({ text: "Explain your point in more detail." })
                    ]
                }),
                new Paragraph({
                    children: [
                        new TextRun({ text: "E - Evidence (Orange): ", bold: true, color: THEME.orange }),
                        new TextRun({ text: "Give a fact, statistic, or example." })
                    ]
                }),
                new Paragraph({
                    children: [
                        new TextRun({ text: "L - Link (Red): ", bold: true, color: THEME.red }),
                        new TextRun({ text: "Link back to your main topic." })
                    ]
                }),

                // Part 3: Example Paragraph
                new Paragraph({ text: "Part 3: PEEL in Action", style: "Heading1", spacing: { before: 400 } }),
                new Paragraph({
                    children: [
                        new TextRun({ text: "Firstly, mobile phones are powerful educational tools that can help students learn more effectively. ", color: THEME.blue }),
                        new TextRun({ text: "They allow us to access information instantly, use educational apps, and research topics we are curious about right in the middle of a lesson. ", color: THEME.green }),
                        new TextRun({ text: "In fact, a recent survey found that 75% of teachers believe technology helps students stay more engaged with their work. ", color: THEME.orange }),
                        new TextRun({ text: "Therefore, allowing phones would turn our classrooms into modern, high-tech learning environments.", color: THEME.red })
                    ],
                    spacing: { before: 200, after: 200 }
                }),

                // Part 4: Practice
                new Paragraph({ text: "Part 4: Your Turn!", style: "Heading1", spacing: { before: 400 } }),
                new Paragraph({ text: "Topic: Should schools have longer playtimes?" }),
                new Paragraph({ text: "Write your own PEEL paragraph below. Remember to use different colours (or labels) for each part!" }),
                new Table({
                    columnWidths: [9360],
                    rows: [
                        new TableRow({ height: { value: 3000, rule: "atLeast" }, children: [new TableCell({ children: [] })] })
                    ]
                })
            ]
        }]
    });

    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync("c:/Users/dsuth/Documents/Joshua/random_lessons/Year-5-Persuasive-Writing/Student_Handout.docx", buffer);
    console.log("Handout generated successfully.");
}

generateHandout().catch(console.error);
