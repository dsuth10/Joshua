const { 
    Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, 
    AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType, 
    VerticalAlign, LevelFormat 
} = require('docx');
const fs = require('fs');
const path = require('path');

// Ensure output directories exist
const outputDir = "c:\\Users\\dsuth\\Documents\\Joshua\\Units\\Health\\Who influences me Part B";
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// ----------------------------------------------------
// SHARED STYLES & CONSTRAINTS
// ----------------------------------------------------
const tableBorder = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const cellBorders = { top: tableBorder, bottom: tableBorder, left: tableBorder, right: tableBorder };

const styleConfig = {
    default: { document: { run: { font: "Arial", size: 22 } } }, // 11pt
    paragraphStyles: [
        {
            id: "Title",
            name: "Title",
            basedOn: "Normal",
            run: { size: 36, bold: true, color: "2E5984", font: "Arial" },
            paragraph: { spacing: { before: 240, after: 120 }, alignment: AlignmentType.CENTER }
        },
        {
            id: "Heading1",
            name: "Heading 1",
            basedOn: "Normal",
            run: { size: 26, bold: true, color: "118EC4", font: "Arial" },
            paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 }
        },
        {
            id: "Heading2",
            name: "Heading 2",
            basedOn: "Normal",
            run: { size: 22, bold: true, color: "2E5984", font: "Arial" },
            paragraph: { spacing: { before: 180, after: 120 }, outlineLevel: 1 }
        }
    ]
};

const numberingConfig = {
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
};

// ----------------------------------------------------
// BUILD STUDENT WORKSHEET
// ----------------------------------------------------
function createStudentWorksheet() {
    const doc = new Document({
        styles: styleConfig,
        numbering: numberingConfig,
        sections: [{
            properties: { 
                page: { 
                    size: { width: 11906, height: 16838 }, // A4 Portrait
                    margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 } // 0.75 in margins
                } 
            },
            children: [
                new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun("STUDENT WORKSHEET: HEALTH MESSAGES")] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Who Influences Me? (Part B) \u2014 Lesson 2", italics: true })] }),
                new Paragraph({ spacing: { before: 200 } }),

                // Student Metadata Table (Dual-width table with DXA dimensions)
                new Table({
                    columnWidths: [1500, 8246], // Total 9746 DXA
                    rows: [
                        new TableRow({ children: [
                            new TableCell({ 
                                width: { size: 1500, type: WidthType.DXA }, 
                                borders: cellBorders,
                                children: [new Paragraph({ children: [new TextRun({ text: "Student Name:", bold: true })] })] 
                            }),
                            new TableCell({ 
                                width: { size: 8246, type: WidthType.DXA }, 
                                borders: cellBorders,
                                shading: { fill: "F9F9F9", type: ShadingType.CLEAR }, 
                                children: [new Paragraph({ children: [] })] 
                            })
                        ]}),
                        new TableRow({ children: [
                            new TableCell({ 
                                width: { size: 1500, type: WidthType.DXA }, 
                                borders: cellBorders,
                                children: [new Paragraph({ children: [new TextRun({ text: "Date:", bold: true })] })] 
                            }),
                            new TableCell({ 
                                width: { size: 8246, type: WidthType.DXA }, 
                                borders: cellBorders,
                                shading: { fill: "F9F9F9", type: ShadingType.CLEAR }, 
                                children: [new Paragraph({ children: [] })] 
                            })
                        ]})
                    ]
                }),
                new Paragraph({ spacing: { before: 300 } }),

                // Core Framework
                new Table({
                    columnWidths: [9746],
                    rows: [
                        new TableRow({ children: [
                            new TableCell({
                                width: { size: 9746, type: WidthType.DXA },
                                borders: cellBorders,
                                shading: { fill: "E6F3F7", type: ShadingType.CLEAR },
                                children: [
                                    new Paragraph({ children: [new TextRun({ text: "Learning Goal: ", bold: true, color: "2E5984" }), new TextRun("To select a healthier living guideline, gather credible research, and apply the six-step problem-solving model to formulate, design, and evaluate a targeted health message for peers.")] })
                                ]
                            })
                        ]})
                    ]
                }),
                new Paragraph({ spacing: { before: 300 } }),

                new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Guidelines on achieving healthier and safer living for young people in Australia")] }),
                new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Eat at least two serves of fruit and three serves of vegetables each day.")] }),
                new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Participate in at least 60 minutes of moderate to vigorous activity every day.")] }),
                new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Have no more than two hours of screen time per day.")] }),
                new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Get adequate sleep.")] }),
                new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Be sun safe.")] }),
                new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Follow road safety rules.")] }),
                new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Make safe choices around water environments.")] }),
                new Paragraph({ spacing: { before: 300 } }),

                // Step 1
                new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Step 1: Identify the problem")] }),
                new Paragraph({ children: [new TextRun("Select one of the guidelines above. How can you promote this guideline in a health message to Year 5 or 6 students? Write the selected guideline and your promoting question below:")] }),
                new Paragraph({ spacing: { before: 100 } }),
                new Table({
                    columnWidths: [3000, 6746],
                    rows: [
                        new TableRow({ children: [
                            new TableCell({ width: { size: 3000, type: WidthType.DXA }, borders: cellBorders, shading: { fill: "F2F2F2", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Selected Guideline:", bold: true })] })] }),
                            new TableCell({ width: { size: 6746, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [] }), new Paragraph({ children: [] })] })
                        ]}),
                        new TableRow({ children: [
                            new TableCell({ width: { size: 3000, type: WidthType.DXA }, borders: cellBorders, shading: { fill: "F2F2F2", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Promoting Question:", bold: true })] })] }),
                            new TableCell({ width: { size: 6746, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "How can we promote the guideline \u201C", color: "888888" }), new TextRun({ text: "____________________________________", color: "888888" }), new TextRun({ text: "\u201D in a health message to Year 5/6 students?", color: "888888" })] }), new Paragraph({ children: [] })] })
                        ]})
                    ]
                }),
                new Paragraph({ spacing: { before: 300 } }),

                // Step 2
                new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Step 2: Explore the problem through gathering information")] }),
                new Paragraph({ children: [new TextRun("Research information about your selected guideline. Find three credible and trustworthy websites where teachers, students, or families can find reliable information.")] }),
                new Paragraph({ spacing: { before: 100 } }),
                new Table({
                    columnWidths: [1500, 8246],
                    rows: [1, 2, 3].map(num => new TableRow({
                        children: [
                            new TableCell({ width: { size: 1500, type: WidthType.DXA }, borders: cellBorders, shading: { fill: "F2F2F2", type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `Source ${num}`, bold: true })] })] }),
                            new TableCell({ width: { size: 8246, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "URL: ", bold: true, color: "888888" }), new TextRun("http://")] }), new Paragraph({ children: [] })] })
                        ]
                    }))
                }),
                new Paragraph({ spacing: { before: 200 } }),
                new Paragraph({ children: [new TextRun("Gather and evaluate information on your guideline. Write six verified facts below that support the importance of this healthy living guideline:")] }),
                new Paragraph({ spacing: { before: 100 } }),
                new Table({
                    columnWidths: [1000, 8746],
                    rows: [1, 2, 3, 4, 5, 6].map(num => new TableRow({
                        children: [
                            new TableCell({ width: { size: 1000, type: WidthType.DXA }, borders: cellBorders, shading: { fill: "F2F2F2", type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `Fact ${num}`, bold: true })] })] }),
                            new TableCell({ width: { size: 8746, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [] }), new Paragraph({ children: [] })] })
                        ]
                    }))
                }),
                new Paragraph({ spacing: { before: 400 } }),

                // Step 3
                new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Step 3: Create ideas about what you want to say")] }),
                new Paragraph({ children: [new TextRun("a) Select two key facts from Step 2 that you think are most important for your peer group (Year 5 or 6):")] }),
                new Paragraph({ spacing: { before: 100 } }),
                new Table({
                    columnWidths: [1500, 8246],
                    rows: [
                        new TableRow({ children: [
                            new TableCell({ width: { size: 1500, type: WidthType.DXA }, borders: cellBorders, shading: { fill: "F2F2F2", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Key Fact A:", bold: true })] })] }),
                            new TableCell({ width: { size: 8246, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [] }), new Paragraph({ children: [] })] })
                        ]}),
                        new TableRow({ children: [
                            new TableCell({ width: { size: 1500, type: WidthType.DXA }, borders: cellBorders, shading: { fill: "F2F2F2", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Key Fact B:", bold: true })] })] }),
                            new TableCell({ width: { size: 8246, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [] }), new Paragraph({ children: [] })] })
                        ]})
                    ]
                }),
                new Paragraph({ spacing: { before: 200 } }),
                new Paragraph({ children: [new TextRun("b) For each fact, write down specific ideas about what your age group needs to know, and suggest how you would get the message across to them:")] }),
                new Paragraph({ spacing: { before: 100 } }),
                new Table({
                    columnWidths: [4873, 4873],
                    rows: [
                        new TableRow({ children: [
                            new TableCell({ width: { size: 4873, type: WidthType.DXA }, borders: cellBorders, shading: { fill: "E6F3F7", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Fact A: What they need to know", bold: true })] })] }),
                            new TableCell({ width: { size: 4873, type: WidthType.DXA }, borders: cellBorders, shading: { fill: "E6F3F7", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Fact B: What they need to know", bold: true })] })] })
                        ]}),
                        new TableRow({ children: [
                            new TableCell({ width: { size: 4873, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [] }), new Paragraph({ children: [] }), new Paragraph({ children: [] })] }),
                            new TableCell({ width: { size: 4873, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [] }), new Paragraph({ children: [] }), new Paragraph({ children: [] })] })
                        ]}),
                        new TableRow({ children: [
                            new TableCell({ width: { size: 9746, type: WidthType.DXA }, columnSpan: 2, borders: cellBorders, shading: { fill: "F2F2F2", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Suggestions on how to get the message across (e.g., humour, visual appeal, catchy slogans):", bold: true })] })] })
                        ]}),
                        new TableRow({ children: [
                            new TableCell({ width: { size: 9746, type: WidthType.DXA }, columnSpan: 2, borders: cellBorders, children: [new Paragraph({ children: [] }), new Paragraph({ children: [] }), new Paragraph({ children: [] })] })
                        ]})
                    ]
                }),
                new Paragraph({ spacing: { before: 400 } }),

                // Step 4
                new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Step 4: Your Health Message Sentence")] }),
                new Paragraph({ children: [new TextRun("A strong health message must be clear, active, and direct. Create a single, powerful sentence that addresses the guideline and motivates your peers:")] }),
                new Paragraph({ spacing: { before: 100 } }),
                new Table({
                    columnWidths: [9746],
                    rows: [
                        new TableRow({ children: [
                            new TableCell({ 
                                width: { size: 9746, type: WidthType.DXA }, 
                                borders: cellBorders, 
                                shading: { fill: "F9F9F9", type: ShadingType.CLEAR },
                                children: [
                                    new Paragraph({ spacing: { before: 180 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: "MY HEALTH MESSAGE SENTENCE", bold: true, color: "118EC4" })] }),
                                    new Paragraph({ spacing: { before: 180, after: 180 }, children: [new TextRun({ text: "\u201C ", bold: true, size: 28 }), new TextRun("__________________________________________________________________________________"), new TextRun({ text: " \u201D", bold: true, size: 28 })] })
                                ] 
                            })
                        ]}),
                    ]
                }),
                new Paragraph({ spacing: { before: 400 } }),

                // Step 5
                new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Step 5: Act \u2014 Design your promotional medium")] }),
                new Paragraph({ children: [new TextRun("Select how you will communicate your health message (e.g., a poster, a script for a podcast, a badge, a website banner, or a brochure). Outline your plan and sketch or write a draft layout below:")] }),
                new Paragraph({ spacing: { before: 100 } }),
                new Table({
                    columnWidths: [3000, 6746],
                    rows: [
                        new TableRow({ children: [
                            new TableCell({ width: { size: 3000, type: WidthType.DXA }, borders: cellBorders, shading: { fill: "F2F2F2", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Selected Medium:", bold: true })] })] }),
                            new TableCell({ width: { size: 6746, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "e.g., Poster / Script / Comic / Badge", color: "888888", italics: true })] })] })
                        ]}),
                        new TableRow({ children: [
                            new TableCell({ width: { size: 9746, type: WidthType.DXA }, columnSpan: 2, borders: cellBorders, shading: { fill: "E6F3F7", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Draft Design Layout / Script Outline / Description of Visual Elements:", bold: true })] })] })
                        ]}),
                        new TableRow({ children: [
                            new TableCell({ 
                                width: { size: 9746, type: WidthType.DXA }, 
                                columnSpan: 2, 
                                borders: cellBorders, 
                                children: [
                                    new Paragraph({ children: [] }), 
                                    new Paragraph({ children: [] }), 
                                    new Paragraph({ children: [] }), 
                                    new Paragraph({ children: [] }), 
                                    new Paragraph({ children: [] }), 
                                    new Paragraph({ children: [] }), 
                                    new Paragraph({ children: [] }), 
                                    new Paragraph({ children: [] })
                                ] 
                            })
                        ]})
                    ]
                }),
                new Paragraph({ spacing: { before: 400 } }),

                // Step 6
                new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Step 6: Review the idea to check whether it will be effective")] }),
                new Paragraph({ children: [new TextRun("Reflect on your designed message to ensure it is impactful, accurate, and valuable for young people. Answer the three evaluation questions below:")] }),
                new Paragraph({ spacing: { before: 100 } }),
                new Table({
                    columnWidths: [9746],
                    rows: [
                        new TableRow({ children: [
                            new TableCell({ 
                                width: { size: 9746, type: WidthType.DXA }, 
                                borders: cellBorders, 
                                shading: { fill: "F2F2F2", type: ShadingType.CLEAR }, 
                                children: [new Paragraph({ children: [new TextRun({ text: "1. How do I know if the information in this message is true? (Credibility check)", bold: true })] })] 
                            })
                        ]}),
                        new TableRow({ children: [
                            new TableCell({ 
                                width: { size: 9746, type: WidthType.DXA }, 
                                borders: cellBorders, 
                                children: [new Paragraph({ children: [] }), new Paragraph({ children: [] }), new Paragraph({ children: [] })] 
                            })
                        ]}),
                        new TableRow({ children: [
                            new TableCell({ 
                                width: { size: 9746, type: WidthType.DXA }, 
                                borders: cellBorders, 
                                shading: { fill: "F2F2F2", type: ShadingType.CLEAR }, 
                                children: [new Paragraph({ children: [new TextRun({ text: "2. How are you going to promote your health message? How will the message be communicated? (Delivery check)", bold: true })] })] 
                            })
                        ]}),
                        new TableRow({ children: [
                            new TableCell({ 
                                width: { size: 9746, type: WidthType.DXA }, 
                                borders: cellBorders, 
                                children: [new Paragraph({ children: [] }), new Paragraph({ children: [] }), new Paragraph({ children: [] })] 
                            })
                        ]}),
                        new TableRow({ children: [
                            new TableCell({ 
                                width: { size: 9746, type: WidthType.DXA }, 
                                borders: cellBorders, 
                                shading: { fill: "F2F2F2", type: ShadingType.CLEAR }, 
                                children: [new Paragraph({ children: [new TextRun({ text: "3. Explain why this health message is most important to your and your friends' health, safety, and wellbeing.", bold: true })] })] 
                            })
                        ]}),
                        new TableRow({ children: [
                            new TableCell({ 
                                width: { size: 9746, type: WidthType.DXA }, 
                                borders: cellBorders, 
                                children: [new Paragraph({ children: [] }), new Paragraph({ children: [] }), new Paragraph({ children: [] })] 
                            })
                        ]})
                    ]
                })
            ]
        }]
    });

    Packer.toBuffer(doc).then(buffer => {
        fs.writeFileSync(path.join(outputDir, "Lesson 2 - Student Worksheet.docx"), buffer);
        console.log("SUCCESS: Lesson 2 - Student Worksheet.docx built.");
    }).catch(err => {
        console.error("ERROR building Student Worksheet:", err);
    });
}

// ----------------------------------------------------
// BUILD TEACHER LESSON PLAN
// ----------------------------------------------------
function createLessonPlan() {
    const doc = new Document({
        styles: styleConfig,
        numbering: numberingConfig,
        sections: [{
            properties: { 
                page: { 
                    size: { width: 11906, height: 16838 }, // A4 Portrait
                    margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 } // 0.75 in margins
                } 
            },
            children: [
                new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun("TEACHER LESSON PLAN")] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Who Influences Me? (Part B) \u2014 Lesson 2", italics: true })] }),
                new Paragraph({ spacing: { before: 200 } }),

                // Topic Table (Dual-width)
                new Table({
                    columnWidths: [2000, 7746],
                    rows: [
                        ["Unit", "Who Influences Me? (Part B: Health Messages)"],
                        ["Topic", "Topic 3 \u2014 Influence of the Media on Health Decisions"],
                        ["Year Level", "Year 6 (also suitable for Year 5)"],
                        ["Duration", "60 Minutes"],
                        ["Curriculum", "ACPPS057 / AC9HP6G01: Recognise how media and community messages influence health, safety, attitudes, and behaviours."],
                        ["Capabilities", "Literacy, Critical and Creative Thinking, ICT Capability"]
                    ].map(pair => new TableRow({
                        children: [
                            new TableCell({ width: { size: 2000, type: WidthType.DXA }, borders: cellBorders, shading: { fill: "E6F3F7", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: pair[0], bold: true })] })] }),
                            new TableCell({ width: { size: 7746, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun(pair[1])] })] })
                        ]
                    }))
                }),
                new Paragraph({ spacing: { before: 300 } }),

                new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Learning Intentions")] }),
                new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Identify and analyse the Australian guidelines for achieving healthier and safer living for young people.")] }),
                new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Apply a structured six-step problem-solving model to construct a personal, targeted health message.")] }),
                new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Evaluate the credibility, promotional delivery, and value of self-designed health messages on peer wellbeing.")] }),

                new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Success Criteria")] }),
                new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("I can explain at least two of the Australian healthy living guidelines.")] }),
                new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("I can find 3 credible online health sources and extract 6 verified facts supporting a guideline.")] }),
                new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("I can formulate a concise, active, one-sentence health message for Year 5/6 students.")] }),
                new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("I can design and review the effectiveness of my message in safeguarding youth wellbeing.")] }),

                new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Resources Required")] }),
                new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Lesson 2 \u2014 Presentation (Premium HTML Single Page Interface).")] }),
                new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Lesson 2 \u2014 Student Worksheet (one per student or digital access).")] }),
                new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Student laptops/tablets for credible research (Step 2) and digital worksheet interactive tasks.")] }),

                new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Lesson Sequence (60 Minutes Total)")] }),

                // Lesson Sequence Table (Dual-width)
                new Table({
                    columnWidths: [800, 1200, 4200, 3546], // Total 9746 DXA
                    rows: [
                        // Header
                        new TableRow({
                            tableHeader: true,
                            children: [
                                new TableCell({ width: { size: 800, type: WidthType.DXA }, borders: cellBorders, shading: { fill: "D5E8F0", type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Time", bold: true })] })] }),
                                new TableCell({ width: { size: 1200, type: WidthType.DXA }, borders: cellBorders, shading: { fill: "D5E8F0", type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Phase", bold: true })] })] }),
                                new TableCell({ width: { size: 4200, type: WidthType.DXA }, borders: cellBorders, shading: { fill: "D5E8F0", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Teacher Actions", bold: true })] })] }),
                                new TableCell({ width: { size: 3546, type: WidthType.DXA }, borders: cellBorders, shading: { fill: "D5E8F0", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Student Actions", bold: true })] })] })
                            ]
                        }),
                        // Hook
                        new TableRow({
                            children: [
                                new TableCell({ width: { size: 800, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun("10 min")] })] }),
                                new TableCell({ width: { size: 1200, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun("Hook & Intro")] })] }),
                                new TableCell({ width: { size: 4200, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun("Project the HTML Presentation onto the screen. Introduce the 7 Australian guidelines for healthy living. Explain that students are now the \u201Ccreative directors\u201D tasked with translating dry policies into engaging health campaigns using a six-step model.")] })] }),
                                new TableCell({ width: { size: 3546, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun("Observe guidelines. Discuss in pairs: \u201CWhich of these rules is the hardest for students our age to follow, and why?\u201D Share thoughts to activate prior knowledge.")] })] })
                            ]
                        }),
                        // Step 1 & 2
                        new TableRow({
                            children: [
                                new TableCell({ width: { size: 800, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun("15 min")] })] }),
                                new TableCell({ width: { size: 1200, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun("Research")] })] }),
                                new TableCell({ width: { size: 4200, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun("Guide students to complete Step 1 (Guideline selection) and Step 2 (Credible research) in their worksheets. Discuss what makes a source credible (government bodies, accredited health organisations). Support students using search engines.")] })] }),
                                new TableCell({ width: { size: 3546, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun("Select their guideline. Research online using laptops. Write down 3 trustworthy URLs (e.g., eatforhealth.gov.au, sunsmart.com.au) and 6 supporting facts on their worksheets.")] })] })
                            ]
                        }),
                        // Step 3 & 4
                        new TableRow({
                            children: [
                                new TableCell({ width: { size: 800, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun("15 min")] })] }),
                                new TableCell({ width: { size: 1200, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun("Create & Craft")] })] }),
                                new TableCell({ width: { size: 4200, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun("Model how to translate academic facts into snappy, educational copy. Encourage students to think about their audience. Circulate to check that Step 4 message sentences are direct, action-oriented, and memorable.")] })] }),
                                new TableCell({ width: { size: 3546, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun("Select their 2 top facts. Brainstorm what peers must know and how to present it (humour, urgency). Craft their single-sentence health message in Step 4.")] })] })
                            ]
                        }),
                        // Step 5
                        new TableRow({
                            children: [
                                new TableCell({ width: { size: 800, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun("10 min")] })] }),
                                new TableCell({ width: { size: 1200, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun("Action/Design")] })] }),
                                new TableCell({ width: { size: 4200, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun("Explain Step 5. Students must select a medium (poster, video script, podcast draft) and draw or outline their visual and narrative campaign elements. Support layout thinking.")] })] }),
                                new TableCell({ width: { size: 3546, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun("Select their promotional medium. Draw a draft design, design visual mockups, or write script outlines directly on their worksheet.")] })] })
                            ]
                        }),
                        // Step 6 & Reflection
                        new TableRow({
                            children: [
                                new TableCell({ width: { size: 800, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun("10 min")] })] }),
                                new TableCell({ width: { size: 1200, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun("Review & Wrap")] })] }),
                                new TableCell({ width: { size: 4200, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun("Ask students to complete the 3 evaluation questions. Bring the class together. Pre-select a few students to present their health message and draft campaigns. Summarise lessons and conclude.")] })] }),
                                new TableCell({ width: { size: 3546, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun("Conduct self-review (credibility, communication channel, personal/social value). Present ideas to peers. Note down classmates' feedback.")] })] })
                            ]
                        })
                    ]
                }),
                new Paragraph({ spacing: { before: 300 } }),

                new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Differentiation Strategies")] }),
                new Table({
                    columnWidths: [4873, 4873],
                    rows: [
                        new TableRow({ children: [
                            new TableCell({ width: { size: 4873, type: WidthType.DXA }, borders: cellBorders, shading: { fill: "F2F2F2", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Support Strategies", bold: true })] })] }),
                            new TableCell({ width: { size: 4873, type: WidthType.DXA }, borders: cellBorders, shading: { fill: "F2F2F2", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Extension Strategies", bold: true })] })] })
                        ]}),
                        new TableRow({ children: [
                            new TableCell({ width: { size: 4873, type: WidthType.DXA }, borders: cellBorders, children: [
                                new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Pre-select a set of 2 credible websites and key facts for specific guidelines to avoid research fatigue.")] }),
                                new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Provide sentence starters for the Step 4 health message and Step 6 reflections.")] }),
                                new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Pair students for research and brainstorming phases.")] })
                            ] }),
                            new TableCell({ width: { size: 4873, type: WidthType.DXA }, borders: cellBorders, children: [
                                new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Encourage students to design a multi-channel campaign (e.g., combining a physical poster with a podcast script).")] }),
                                new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Analyse the psychological triggers of popular media ads (e.g., how fear vs. humour shapes peer decisions).")] }),
                                new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Compare the effectiveness of digital vs. analogue distribution in their school context.")] })
                            ] })
                        ]})
                    ]
                }),
                new Paragraph({ spacing: { before: 300 } }),

                new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Teacher Reflection Notes")] }),
                new Paragraph({ children: [new TextRun("What worked well in translating guidelines to media messages? How did students handle evaluating digital source credibility? Were students able to link their campaign message to their personal wellbeing? What will I change in next lesson?") ] })
            ]
        }]
    });

    Packer.toBuffer(doc).then(buffer => {
        fs.writeFileSync(path.join(outputDir, "Lesson 2 - Lesson Plan.docx"), buffer);
        console.log("SUCCESS: Lesson 2 - Lesson Plan.docx built.");
    }).catch(err => {
        console.error("ERROR building Lesson Plan:", err);
    });
}

// Run compilation
createStudentWorksheet();
createLessonPlan();
