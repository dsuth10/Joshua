const { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType, LevelFormat } = require('docx');
const fs = require('fs');

const THEME = {
    navy: "003366",
    lightBlue: "D5E8F0",
    white: "FFFFFF",
    black: "000000"
};

const doc = new Document({
    styles: {
        default: {
            document: {
                run: { font: "Arial", size: 24 }
            }
        },
        paragraphStyles: [
            {
                id: "Heading1",
                name: "Heading 1",
                run: { size: 36, bold: true, color: THEME.navy, font: "Arial" },
                paragraph: { spacing: { before: 240, after: 120 } }
            },
            {
                id: "Heading2",
                name: "Heading 2",
                run: { size: 28, bold: true, color: THEME.navy, font: "Arial" },
                paragraph: { spacing: { before: 200, after: 100 } }
            }
        ]
    },
    numbering: {
        config: [
            {
                reference: "bullet-list",
                levels: [{
                    level: 0,
                    format: LevelFormat.BULLET,
                    text: "•",
                    alignment: AlignmentType.LEFT,
                    style: { paragraph: { indent: { left: 720, hanging: 360 } } }
                }]
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
                    new TextRun({ text: "LESSON PLAN", bold: true, size: 28, color: THEME.navy }),
                ]
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 400 },
                children: [
                    new TextRun({ text: "Lesson 12: Controlling the Message (Cohesion)", bold: true, size: 40, color: THEME.navy }),
                ]
            }),

            // Unit Info Table
            new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                columnWidths: [2000, 7360],
                rows: [
                    ["Unit", "Year 5 English — Unit 2: Examining, Creating and Sharing Informative Texts"],
                    ["Term", "2, 2026"],
                    ["Sequence", "2 — Language Features & Text Structure (Week 3)"],
                    ["Core Text", "Floods Archive — Brisbane History & Human Cost"]
                ].map(row => new TableRow({
                    children: [
                        new TableCell({ 
                            shading: { fill: THEME.navy, type: ShadingType.CLEAR },
                            children: [new Paragraph({ children: [new TextRun({ text: row[0], color: THEME.white, bold: true })] })] 
                        }),
                        new TableCell({ 
                            children: [new Paragraph({ children: [new TextRun(row[1])] })] 
                        })
                    ]
                }))
            }),

            new Paragraph({ spacing: { before: 400 } }),

            // LI/SC Box
            new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({
                                shading: { fill: THEME.lightBlue, type: ShadingType.CLEAR },
                                children: [
                                    new Paragraph({ children: [new TextRun({ text: "Learning Intention", bold: true, size: 28 })] }),
                                    new Paragraph({ children: [new TextRun("I can explain how texts are made cohesive by using the starting point of a sentence or paragraph to give prominence to the message. (AC9E5LA04)")] }),
                                    new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "Success Criteria", bold: true, size: 28 })] }),
                                    new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("I can identify the Theme (starting point) and Rheme (the rest) of a sentence.")] }),
                                    new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("I can explain how changing the Theme changes what information is emphasised.")] }),
                                    new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("I can rewrite sentences from the Floods Archive with different starting points.")] })
                                ]
                            })
                        ]
                    })
                ]
            }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Lesson Sequence")] }),

            // Lesson Sequence Table
            new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                columnWidths: [2500, 6860],
                rows: [
                    ["1. Activate (10 mins)", "Display: Compare two paragraphs on the class screen (from Slide 2). Discuss: Which paragraph feels more 'professional'? Concept: Introduce Theme as a 'signpost' for the reader."],
                    ["2. Explore (15 mins)", "Direct Instruction: Introduce Theme and Rheme. Examine: Use Slide 5 and 6 to show screenshots from the Brisbane History and Human Cost sub-pages. Point out how historical texts often start with Time or Place."],
                    ["3. Model (15 mins)", "Joint Construction: Select a 'bare assertion' sentence from the archive. Rewrite: 'Because it is so deceptive, fast-moving water can be lethal.' Discuss the change in focus."],
                    ["4. Connect (20 mins)", "Independent Task: Students complete the Lesson 12 Handout: Cohesion. Lucas (Y2) Task: Lucas compares simplified sentence pairs and discusses the 'start' with the teacher."]
                ].map(row => new TableRow({
                    children: [
                        new TableCell({ shading: { fill: THEME.lightBlue, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: row[0], bold: true })] })] }),
                        new TableCell({ children: [new Paragraph({ children: [new TextRun(row[1])] })] })
                    ]
                }))
            }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Resources & Assessment")] }),
            new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Floods Archive (Brisbane History & Human Cost)")] }),
            new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Lesson 12 Presentation & Handouts (Core and Lucas)")] }),
            new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Formative: Monitoring sentence rewriting tasks.")] }),
            new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Summative: Lesson 12 Assessment (MS Forms format).")] }),

            new Paragraph({ spacing: { before: 400 } }),
            new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({
                                shading: { fill: THEME.navy, type: ShadingType.CLEAR },
                                children: [new Paragraph({ children: [new TextRun({ text: "Australian Curriculum Mapping (v9)", color: THEME.white, bold: true })] })]
                            })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({
                                children: [
                                    new Paragraph({ children: [new TextRun({ text: "AC9E5LA04:", bold: true }), new TextRun(" Explain how texts are made cohesive by using the starting point of a sentence or paragraph to give prominence to the message.")] }),
                                    new Paragraph({ children: [new TextRun({ text: "AC9E2LY05:", bold: true }), new TextRun(" Use comprehension strategies to build literal and inferred meaning.")] })
                                ]
                            })
                        ]
                    })
                ]
            })
        ]
    }]
});

Packer.toBuffer(doc).then(buffer => {
    fs.writeFileSync("c:/Users/dsuth/Documents/Joshua/Units/English/English_Unit_2/Lesson_Plans/Lesson_12_Plan.docx", buffer);
    console.log("Lesson Plan DocX created successfully.");
});
