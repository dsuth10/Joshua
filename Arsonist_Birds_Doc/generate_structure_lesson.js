const { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, LevelFormat } = require('docx');
const fs = require('fs');
const path = require('path');

const outputDir = "c:\\Users\\dsuth\\Documents\\Joshua\\Arsonist_Birds_Doc";
const fileName = "Lesson_Plan_Text_Structures.docx";

const THEME = {
    ochre: "B12E21",
    charcoal: "2B2B2B",
    font: "Arial"
};

const createBulletPara = (boldText, normalText) => {
    return new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [
            new TextRun({ text: boldText, bold: true }),
            new TextRun({ text: normalText })
        ]
    });
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
                children: [new TextRun({ text: "LESSON PLAN: ANALYSING TEXT STRUCTURES", bold: true, size: 40, color: THEME.ochre })]
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 400 },
                children: [new TextRun({ text: "Source: Nature's Arsonists - Information Text", size: 28, italics: true })]
            }),

            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Learning Intention")] }),
            new Paragraph({
                children: [new TextRun("Students will identify and analyze the purpose of specific text structures, including hierarchical headings, numbered sequences, bullet points, and comparative tables, to understand how they support reading comprehension in informational texts.")]
            }),

            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Text Structure Analysis Points")] }),

            new Paragraph({ text: "1. Hierarchical Headings", bold: true }),
            new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Discuss the use of numbering (01, 02, etc.) in major headings to establish a clear structural sequence.")] }),
            new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Observe how Heading Level 1 (caps) and Heading Level 2 organize broad topics into specific sub-topics (e.g., 'Evidence Streams' vs. 'Indigenous Knowledge').")] }),

            new Paragraph({ text: "2. Numbered Sequences for Processes", bold: true, spacing: { before: 200 } }),
            new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Analyze Section 03 ('How They Do It'). Why is a numbered list used here instead of bullet points?")] }),
            new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Discuss how numbering implies a chronological or step-by-step mechanism.")] }),

            new Paragraph({ text: "3. Bullet Points for Evidence", bold: true, spacing: { before: 200 } }),
            new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Identify the use of bullet points in Section 04 and Section 05.")] }),
            new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Discuss how bullets allow for the quick scan of independent facts, sightings, or arguments that don't follow a strict order.")] }),

            new Paragraph({ text: "4. Information Tables for Comparison", bold: true, spacing: { before: 200 } }),
            new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Look at 'The Big Question' (Section 05). Discuss the two-column table structure.")] }),
            new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Analyze how the table visually separates the 'Intentional' vs. 'Accidental' debate to help the reader weigh evidence.")] }),

            new Paragraph({ text: "5. Visual Anchors & Captions", bold: true, spacing: { before: 200 } }),
            new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Notice how each section is anchored by a centered image and a relevant caption.")] }),
            new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Discuss how these visuals provide context and break up large blocks of text.")] }),

            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Class Activity Sequence")] }),
            new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Scan the first 7 sections of 'Nature's Arsonists'.")] }),
            new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Identify one example of each structure discussed (H1, H2, numbered list, bullet list, table).")] }),
            new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("In small groups, discuss which structure was most helpful for understanding the 'Behavioral Mechanism' vs 'Evidence Collections'.")] }),
            new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Summarize why Section 05 is easier to read in a table than in plain paragraphs.")] }),

            new Paragraph({
                spacing: { before: 400 },
                children: [new TextRun({ text: "Note: Analysis covers Sections 01 through 07 only.", italics: true, color: THEME.ochre })]
            })
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
