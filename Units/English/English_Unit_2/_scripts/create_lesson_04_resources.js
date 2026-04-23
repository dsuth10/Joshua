const fs = require('fs');
const path = require('path');
const pptxgen = require('pptxgenjs');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType, HeadingLevel, WidthType, ShadingType, LevelFormat, BorderStyle } = require('docx');
const html2pptx = require('c:\\Users\\dsuth\\Documents\\Joshua\\.agent\\skills\\pptx\\scripts\\html2pptx');

const OUTPUT_DIR_PLAN = path.join(__dirname, '..', 'Lesson_Plans');
const OUTPUT_DIR_STUDENT = path.join(__dirname, '..', 'Student_Documents');
const TEMP_DIR = path.join(__dirname, 'temp_slides_04');

if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR);

// --- PPTX DATA ---
const slidesData = [
    {
        title: "Lesson 04: Time and Place",
        content: `
            <div class="box" style="margin-top: 30pt;">
                <p style="text-align: center; font-size: 32pt;">Year 5 English — Unit 2</p>
                <p style="text-align: center; font-size: 20pt; color: #f9f7f7;">Examining Informative Texts</p>
            </div>
            <p style="text-align: center; margin-top: 20pt; font-size: 24pt; color: #112d4e; font-weight: bold;">Tarampa State School</p>
        `
    },
    {
        title: "Learning Intentions",
        content: `
            <div class="box">
                <p style="font-size: 18pt;"><span class="highlight">I can</span> explain how a text reflects the time and place in which it was created.</p>
            </div>
            <div class="grid" style="margin-top: 10pt;">
                <div class="box" style="background: #112d4e;">
                    <p style="font-size: 16pt; color: #f96d00; font-weight: bold;">Success Criteria:</p>
                    <ul style="font-size: 14pt; color: white; margin-top: 5pt;">
                        <li>Define <b>Context</b> as Time + Place.</li>
                        <li>Identify historical clues in the text.</li>
                        <li>Explain how location influences information.</li>
                    </ul>
                </div>
            </div>
        `
    },
    {
        title: "Geography Challenge",
        content: `
            <div class="box" style="background: #f96d00;">
                <p style="color: white; text-align: center; font-size: 20pt; font-weight: bold;">Why Queensland?</p>
            </div>
            <p style="text-align: center; font-size: 18pt; margin-top: 15pt;">Why do cyclones happen in QLD more than in Victoria?</p>
            <div class="box" style="margin-top: 10pt; background: #112d4e;">
                <p style="text-align: center; font-size: 16pt; color: white;">How does our <span class="highlight">Location</span> change what we write about?</p>
            </div>
        `
    },
    {
        title: "What is 'Context'?",
        content: `
            <div class="grid">
                <div class="box">
                    <p style="font-size: 18pt; font-weight: bold; color: #112d4e;">TIME</p>
                    <p style="font-size: 14pt;">When was it written? (e.g., 1899 vs 1974 vs 2024)</p>
                </div>
                <div class="box">
                    <p style="font-size: 18pt; font-weight: bold; color: #f96d00;">PLACE</p>
                    <p style="font-size: 14pt;">Where was it written? (e.g., Northern QLD vs Tasmania)</p>
                </div>
            </div>
            <p style="text-align: center; margin-top: 15pt; font-size: 16pt;"><b>Context</b> is the 'Where' and 'When' of a text.</p>
        `
    },
    {
        title: "Comparing Eras",
        content: `
            <div class="grid">
                <div class="box" style="background: #3f72af;">
                    <p style="font-size: 16pt; color: white;"><b>Cyclone Mahina (1899)</b></p>
                    <p style="font-size: 12pt; color: white;">Drawings, old-fashioned language, pearl luggers.</p>
                </div>
                <div class="box" style="background: #112d4e;">
                    <p style="font-size: 16pt; color: #f96d00;"><b>Cyclone Tracy (1974)</b></p>
                    <p style="font-size: 12pt; color: white;">Grainy photos, radio warnings, landline phones.</p>
                </div>
            </div>
        `
    },
    {
        title: "Teacher Modelling",
        content: `
            <div class="box">
                <p style="font-size: 18pt;">How to write about context:</p>
            </div>
            <p style="margin-top: 10pt; font-size: 14pt; font-style: italic; color: #112d4e;">"This text reflects the historical context of the 1970s because it mentions radio as the primary warning system..."</p>
            <div class="box" style="background: #f96d00; margin-top: 10pt;">
                <p style="color: white; font-size: 14pt;">Look for: <b>Technology, Language, Clothing, Transport.</b></p>
            </div>
        `
    },
    {
        title: "Your Task",
        content: `
            <div class="box">
                <p style="font-size: 16pt;">1. Choose one Cyclone sub-page.</p>
                <p style="font-size: 16pt;">2. Find <span class="highlight">2 clues</span> about the time or place.</p>
                <p style="font-size: 16pt;">3. Write how they reflect the context.</p>
            </div>
            <div class="box" style="background: #112d4e; margin-top: 10pt;">
                <p style="color: #f96d00; font-size: 14pt;">Lucas: Look at the Tracy image. What is different about the cars and buildings?</p>
            </div>
        `
    }
];

// --- DOCX GENERATION ---
async function createWorksheets() {
    // Year 5 Worksheet
    const docY5 = new Document({
        sections: [{
            properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
            children: [
                new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun({ text: "Lesson 04: Context — Time and Place", bold: true, color: "112d4e" })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun("Year 5 English — Unit 2")] }),
                
                new Paragraph({ spacing: { before: 400 } }),
                new Table({
                    columnWidths: [1500, 7520],
                    rows: [
                        new TableRow({ children: [
                            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Name:", bold: true })] })] }),
                            new TableCell({ shading: { fill: "F2F2F2" }, children: [new Paragraph("")] })
                        ]})
                    ]
                }),

                new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Understanding Context")] }),
                new Paragraph({ children: [new TextRun("Context is the time and place in which a text was created. It influences the information, language, and technology mentioned in the text.")] }),

                new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Case Study Analysis")] }),
                new Table({
                    columnWidths: [3000, 6020],
                    rows: [
                        new TableRow({ children: [
                            new TableCell({ shading: { fill: "112d4e" }, children: [new Paragraph({ children: [new TextRun({ text: "Chosen Cyclone:", bold: true, color: "FFFFFF" })] })] }),
                            new TableCell({ children: [new Paragraph("")] })
                        ]}),
                        new TableRow({ children: [
                            new TableCell({ shading: { fill: "F96D00" }, children: [new Paragraph({ children: [new TextRun({ text: "Historical Clue 1:", bold: true, color: "FFFFFF" })] })] }),
                            new TableCell({ children: [new Paragraph("Evidence (e.g., date, technology, photo detail):"), new Paragraph({ spacing: { before: 200 } })] })
                        ]}),
                        new TableRow({ children: [
                            new TableCell({ shading: { fill: "F96D00" }, children: [new Paragraph({ children: [new TextRun({ text: "Historical Clue 2:", bold: true, color: "FFFFFF" })] })] }),
                            new TableCell({ children: [new Paragraph("Evidence:"), new Paragraph({ spacing: { before: 200 } })] })
                        ]})
                    ]
                }),

                new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Reflecting Context")] }),
                new Paragraph({ children: [new TextRun("Explain how your chosen text reflects its time or place. Use the sentence starter below:")] }),
                new Paragraph({ shading: { fill: "E6F3F7" }, children: [new TextRun({ text: "This text reflects the context of [Time/Place] because...", italic: true })] }),
                new Paragraph({ spacing: { before: 400 }, border: { bottom: { color: "000000", space: 1, style: BorderStyle.SINGLE, size: 6 } }, children: [new TextRun("")] }),
                new Paragraph({ spacing: { before: 400 }, border: { bottom: { color: "000000", space: 1, style: BorderStyle.SINGLE, size: 6 } }, children: [new TextRun("")] })
            ]
        }]
    });

    // Lucas Worksheet
    const docLucas = new Document({
        sections: [{
            properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
            children: [
                new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun({ text: "Lesson 04: Looking at the Past", bold: true, color: "f96d00" })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun("Lucas (Year 2) — English")] }),

                new Paragraph({ spacing: { before: 400 } }),
                new Paragraph({ children: [new TextRun({ text: "Look at the big picture of Cyclone Tracy.", bold: true })] }),
                
                new Table({
                    columnWidths: [4500, 4520],
                    rows: [
                        new TableRow({ children: [
                            new TableCell({ shading: { fill: "E6F3F7" }, children: [new Paragraph({ children: [new TextRun("What do the cars look like?")] })] }),
                            new TableCell({ children: [new Paragraph({ spacing: { before: 400 } })] })
                        ]}),
                        new TableRow({ children: [
                            new TableCell({ shading: { fill: "E6F3F7" }, children: [new Paragraph({ children: [new TextRun("What are the buildings like?")] })] }),
                            new TableCell({ children: [new Paragraph({ spacing: { before: 400 } })] })
                        ]})
                    ]
                }),

                new Paragraph({ spacing: { before: 400 } }),
                new Paragraph({ children: [new TextRun("Does this look like it happened long ago or today? Why?")] }),
                new Paragraph({ shading: { fill: "F2F2F2" }, children: [new TextRun({ text: "I think it happened long ago because...", italic: true })] }),
                new Paragraph({ spacing: { before: 600 } })
            ]
        }]
    });

    const bufferY5 = await Packer.toBuffer(docY5);
    fs.writeFileSync(path.join(OUTPUT_DIR_STUDENT, 'Lesson_04_Worksheet_Y5.docx'), bufferY5);
    
    const bufferLucas = await Packer.toBuffer(docLucas);
    fs.writeFileSync(path.join(OUTPUT_DIR_STUDENT, 'Lesson_04_Worksheet_Lucas_Y2.docx'), bufferLucas);
    
    console.log("✅ Worksheets created.");
}

// --- MAIN GENERATION ---
const templatePath = 'c:\\Users\\dsuth\\Documents\\Joshua\\.agent\\skills\\english-lesson\\assets\\slide_template.html';
const template = fs.readFileSync(templatePath, 'utf8');

async function generate() {
    // 1. PPTX Slides
    const slidePaths = [];
    slidesData.forEach((data, index) => {
        let html = template
            .replace('<h1>Slide Title</h1>', `<h1>${data.title}</h1>`)
            .replace('<div class="content">', `<div class="content">${data.content}</div>`);
        
        // Remove default boilerplate
        html = html.replace(/<div class="box">\s*<p>This is a <span class="highlight">Vibrant Orange<\/span> highlight inside a Soft Blue box.<\/p>\s*<\/div>/, '');
        html = html.replace(/<div class="grid">\s*<div>\s*<p>Column 1 content goes here. Use short, punchy sentences.<\/p>\s*<\/div>\s*<div>\s*<p>Column 2 content. Perfect for comparisons or images.<\/p>\s*<\/div>\s*<\/div>/, '');

        const fileName = `slide_${(index + 1).toString().padStart(2, '0')}.html`;
        const filePath = path.join(TEMP_DIR, fileName);
        fs.writeFileSync(filePath, html);
        slidePaths.push(filePath);
    });

    const pptx = new pptxgen();
    pptx.layout = 'LAYOUT_16x9';

    console.log("Starting PPTX conversion...");
    for (const s of slidePaths) {
        await html2pptx(s, pptx);
    }

    const pptxPath = path.join(OUTPUT_DIR_PLAN, 'Lesson_04_Slides.pptx');
    await pptx.writeFile({ fileName: pptxPath });
    console.log(`✅ PPTX created: ${pptxPath}`);

    // 2. DOCX Worksheets
    await createWorksheets();

    // Cleanup
    slidePaths.forEach(p => fs.unlinkSync(p));
    fs.rmdirSync(TEMP_DIR);
}

generate().catch(err => {
    console.error(err);
    process.exit(1);
});
