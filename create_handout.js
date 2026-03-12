const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType, VerticalAlign, LevelFormat } = require('docx');
const fs = require('fs');

const doc = new Document({
    styles: {
        default: { document: { run: { font: "Arial", size: 22 } } },
        paragraphStyles: [
            {
                id: "Title",
                name: "Title",
                basedOn: "Normal",
                run: { size: 36, bold: true, color: "118EC4", font: "Arial" },
                paragraph: { spacing: { before: 240, after: 120 }, alignment: AlignmentType.CENTER }
            },
            {
                id: "Heading1",
                name: "Heading 1",
                basedOn: "Normal",
                run: { size: 28, bold: true, color: "000000", font: "Arial" },
                paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 }
            },
            {
                id: "Heading2",
                name: "Heading 2",
                basedOn: "Normal",
                run: { size: 24, bold: true, color: "118EC4", font: "Arial" },
                paragraph: { spacing: { before: 180, after: 120 }, outlineLevel: 1 }
            }
        ]
    },
    numbering: {
        config: [
            {
                reference: "bullet-list",
                levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }]
            }
        ]
    },
    sections: [{
        properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
        children: [
            new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun("Assessment Task: Imaginative Narrative Adaptation")] }),
            new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun("Year 5 English - Unit 1")] }),
            
            new Paragraph({ spacing: { before: 400 } }),
            
            new Table({
                columnWidths: [1500, 7520],
                rows: [
                    new TableRow({ children: [
                        new TableCell({ width: { size: 1500, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: "Name:", bold: true })] })] }),
                        new TableCell({ width: { size: 7520, type: WidthType.DXA }, shading: { fill: "F2F2F2", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [] })] })
                    ]}),
                    new TableRow({ children: [
                        new TableCell({ width: { size: 1500, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: "Date:", bold: true })] })] }),
                        new TableCell({ width: { size: 7520, type: WidthType.DXA }, shading: { fill: "F2F2F2", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [] })] })
                    ]})
                ]
            }),

            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Your Task")] }),
            new Paragraph({ children: [new TextRun("You will plan, create, and edit an adaptation of a familiar imaginative story. This could be a prequel, a sequel, an alternative ending, or a brand-new adventure for the same characters.")] }),
            
            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Student Friendly Criteria: 'I Can...'")] }),
            new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("I can create a story that adapts a familiar narrative in a new and interesting way.")] }),
            new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("I can develop my ideas using specific details from the original story (characters, settings, context).")] }),
            new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("I can use paragraphs to organise my ideas so my story flows logically.")] }),
            new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("I can use complex sentences to add detail and variety to my writing.")] }),
            new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("I can use literary devices (like similes, metaphors, or personification) to make my story more engaging.")] }),
            new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("I can use topic-specific vocabulary and consistent tenses throughout my story.")] }),
            new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("I can edit my work for capital letters, full stops, and correct spelling.")] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("My Planning Guide")] }),
            new Table({
                columnWidths: [3000, 6020],
                rows: [
                    ["Who is my audience?", "Why am I writing this story? (Purpose)"],
                    ["Setting: Where and when does my story take place?", ""],
                    ["Characters: Who is in my story?", ""],
                    ["Plot Idea: What happens? (Beginning, Middle, End)", ""]
                ].map(pair => new TableRow({
                    children: [
                        new TableCell({ width: { size: 3000, type: WidthType.DXA }, shading: { fill: "E6F3F7", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: pair[0], bold: true })] })] }),
                        new TableCell({ width: { size: 6020, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun(pair[1])] })] })
                    ]
                }))
            }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Planning My Story Structure")] }),
            new Table({
                columnWidths: [2000, 7020],
                rows: [
                    ["Beginning", "How does my story start? Introduce the setting and characters."],
                    ["Middle", "What is the main event or problem? Use complex sentences and literary devices here!"],
                    ["End", "How is the problem solved? How does the story finish?"]
                ].map(row => new TableRow({
                    children: [
                        new TableCell({ width: { size: 2000, type: WidthType.DXA }, shading: { fill: "E6F3F7", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: row[0], bold: true })] })] }),
                        new TableCell({ width: { size: 7020, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun(row[1])] }), new Paragraph({ children: [] }), new Paragraph({ children: [] })] })
                    ]
                }))
            })
        ]
    }]
});

Packer.toBuffer(doc).then(buffer => {
    fs.writeFileSync("c:\\Users\\dsuth\\Documents\\Joshua\\Units\\English\\English Unit 1\\Handout_Assessment_AT1-1_PartC.docx", buffer);
    console.log("Handout created successfully.");
}).catch(err => {
    console.error("Error creating handout:", err);
    process.exit(1);
});
