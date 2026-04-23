const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType, LevelFormat, VerticalAlign } = require('docx');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '..', 'Lesson_Plans');

// Theme Colors
const NAVY = "112D4E";
const ORANGE = "F96D00";
const OFF_WHITE = "F9F7F7";
const SOFT_BLUE = "3F72AF";

const createDocument = (title, subtitle, sections) => {
    return new Document({
        styles: {
            default: { document: { run: { font: "Inter", size: 22 } } },
            paragraphStyles: [
                {
                    id: "Title",
                    name: "Title",
                    run: { size: 48, bold: true, color: NAVY, font: "Outfit" },
                    paragraph: { spacing: { after: 300 }, alignment: AlignmentType.CENTER }
                },
                {
                    id: "Heading1",
                    name: "Heading 1",
                    run: { size: 32, bold: true, color: ORANGE, font: "Outfit" },
                    paragraph: { spacing: { before: 400, after: 200 }, border: { bottom: { color: ORANGE, space: 1, style: BorderStyle.SINGLE, size: 6 } } }
                },
                {
                    id: "Heading2",
                    name: "Heading 2",
                    run: { size: 28, bold: true, color: SOFT_BLUE, font: "Outfit" },
                    paragraph: { spacing: { before: 300, after: 150 } }
                }
            ]
        },
        sections: [{
            properties: { 
                page: { 
                    size: { width: 11906, height: 16838 }, // A4
                    margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } 
                } 
            },
            children: [
                new Paragraph({ style: "Title", children: [new TextRun(title)] }),
                new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 400 }, children: [new TextRun({ text: subtitle, bold: true, color: SOFT_BLUE })] }),
                ...sections
            ]
        }]
    });
};

// --- 1. Navigation Feature Recording Sheet ---
const worksheetSections = [
    new Table({
        columnWidths: [2000, 7026],
        rows: [
            new TableRow({ children: [
                new TableCell({ width: { size: 2000, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: "Name:", bold: true, color: NAVY })] })] }),
                new TableCell({ width: { size: 7026, type: WidthType.DXA }, shading: { fill: OFF_WHITE }, children: [new Paragraph("")] })
            ]}),
            new TableRow({ children: [
                new TableCell({ width: { size: 2000, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: "Date:", bold: true, color: NAVY })] })] }),
                new TableCell({ width: { size: 7026, type: WidthType.DXA }, shading: { fill: OFF_WHITE }, children: [new Paragraph("")] })
            ]})
        ]
    }),
    new Paragraph({ style: "Heading1", children: [new TextRun("Structural Navigation Features")] }),
    new Paragraph({ spacing: { after: 200 }, children: [new TextRun("Explore the Cyclone Archive and find 5 different navigation features. Explain how each feature helps you as a reader.")] }),
    new Table({
        width: { size: 9026, type: WidthType.DXA },
        rows: [
            new TableRow({
                children: [
                    new TableCell({ width: { size: 3000, type: WidthType.DXA }, shading: { fill: NAVY }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Navigation Feature", color: "FFFFFF", bold: true })] })] }),
                    new TableCell({ width: { size: 6026, type: WidthType.DXA }, shading: { fill: NAVY }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "How it helps the reader", color: "FFFFFF", bold: true })] })] })
                ]
            }),
            ...Array(5).fill(0).map(() => new TableRow({
                children: [
                    new TableCell({ height: { value: 1200, rule: "atLeast" }, children: [new Paragraph("")] }),
                    new TableCell({ height: { value: 1200, rule: "atLeast" }, children: [new Paragraph("")] })
                ]
            }))
        ]
    }),
    new Paragraph({ style: "Heading2", children: [new TextRun("Reflection Question")] }),
    new Paragraph({ children: [new TextRun("Which feature was the MOST helpful for finding information quickly? Why?")] }),
    new Paragraph({ shading: { fill: OFF_WHITE }, spacing: { before: 200 }, children: [new TextRun({ text: "\n\n\n", size: 22 })] })
];

const worksheetDoc = createDocument("Navigation Feature Recording Sheet", "Year 5 English - Unit 2 | Lesson 03", worksheetSections);

// --- 2. Lucas Differentiated Worksheet ---
const lucasSections = [
    new Table({
        columnWidths: [1500, 7526],
        rows: [
            new TableRow({ children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Name:", bold: true })] })] }),
                new TableCell({ shading: { fill: OFF_WHITE }, children: [new Paragraph("")] })
            ]})
        ]
    }),
    new Paragraph({ style: "Heading1", children: [new TextRun("Finding Features with Lucas")] }),
    new Paragraph({ children: [new TextRun("Look at the Cyclone Tracy page. Can you find these 2 features? Draw them and finish the sentence.")] }),
    
    ...[
        { feature: "Heading (The Title)", prompt: "Draw the heading here:" },
        { feature: "Image (The Picture)", prompt: "Draw the picture here:" }
    ].map(item => [
        new Paragraph({ style: "Heading2", children: [new TextRun(item.feature)] }),
        new Table({
            columnWidths: [4513, 4513],
            rows: [
                new TableRow({
                    children: [
                        new TableCell({ width: { size: 4513, type: WidthType.DXA }, shading: { fill: OFF_WHITE }, children: [new Paragraph({ children: [new TextRun({ text: item.prompt, size: 18 })] }), new Paragraph({ children: [new TextRun("\n\n\n\n\n")] })] }),
                        new TableCell({ width: { size: 4513, type: WidthType.DXA }, verticalAlign: VerticalAlign.CENTER, children: [
                            new Paragraph({ children: [new TextRun({ text: "This helps the reader because...", italic: true })] }),
                            new Paragraph({ children: [new TextRun("___________________________")] })
                        ]})
                    ]
                })
            ]
        })
    ]).flat()
];

const lucasDoc = createDocument("Navigation Features", "Year 2 Pathway - Lucas | Lesson 03", lucasSections);

// --- 3. Lesson Plan (DOCX Version) ---
const planSections = [
    new Paragraph({ style: "Heading1", children: [new TextRun("Lesson Overview")] }),
    new Table({
        width: { size: 9026, type: WidthType.DXA },
        rows: [
            ["Learning Intention", "I can explain how structural navigation features help readers find and understand information."],
            ["Success Criteria", "• Identify navigation features\n• Explain their purpose\n• Compare to book features"],
            ["Resources", "• Cyclone Archive\n• Navigation Worksheet\n• Lucas Worksheet\n• Lesson Slides"]
        ].map(pair => new TableRow({
            children: [
                new TableCell({ width: { size: 2500, type: WidthType.DXA }, shading: { fill: SOFT_BLUE }, children: [new Paragraph({ children: [new TextRun({ text: pair[0], color: "FFFFFF", bold: true })] })] }),
                new TableCell({ width: { size: 6526, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun(pair[1])] })] })
            ]
        }))
    }),
    new Paragraph({ style: "Heading1", children: [new TextRun("Teaching Sequence")] }),
    ...[
        { time: "10m", title: "Activate", desc: "Class Navigation Challenge: Find Cyclone Tracy in < 30 seconds." },
        { time: "15m", title: "Explore", desc: "Discuss Hub page, sub-pages, headings, links. Compare to books." },
        { time: "15m", title: "Model", desc: "Model annotating Cyclone Tracy sub-page for navigation features." },
        { time: "15m", title: "Connect", desc: "Students complete Recording Sheet (Independent Practice)." },
        { time: "5m", title: "Reflect", desc: "Which feature is most helpful? Share findings." }
    ].map(step => new Paragraph({
        children: [
            new TextRun({ text: `[${step.time}] `, bold: true, color: ORANGE }),
            new TextRun({ text: `${step.title}: `, bold: true, color: NAVY }),
            new TextRun(step.desc)
        ],
        spacing: { after: 120 }
    }))
];

const planDoc = createDocument("Lesson Plan 03", "Structural Navigation Features", planSections);

// --- Save All ---
const saveDoc = (doc, filename) => {
    Packer.toBuffer(doc).then(buffer => {
        fs.writeFileSync(path.join(OUTPUT_DIR, filename), buffer);
        console.log(`Successfully created ${filename}`);
    });
};

saveDoc(worksheetDoc, "Lesson_03_Navigation_Worksheet.docx");
saveDoc(lucasDoc, "Lesson_03_Lucas_Worksheet.docx");
saveDoc(planDoc, "Lesson_03_Structural_Navigation_Features.docx");
