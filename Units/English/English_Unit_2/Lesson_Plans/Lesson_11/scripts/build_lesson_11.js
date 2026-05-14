const { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType, LevelFormat } = require('docx');
const pptxgen = require('pptxgenjs');
const fs = require('fs');
const path = require('path');
const html2pptx = require('c:\\Users\\dsuth\\Documents\\Joshua\\.agent\\skills\\pptx\\scripts\\html2pptx');

// WET BLUE THEME
const THEME = {
    navy: '#003366',    // Deep water
    ocean: '#0066cc',   // Mid-tone blue
    pool: '#d9e6f2',    // Light water tint
    accent: '#00ccff',  // Bright splash
    white: '#ffffff',
    text: '#1a1a1a'
};

// HELPERS
function createHeader(title) {
    return [
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: title, bold: true, size: 36, color: THEME.navy, font: "Arial" })],
            spacing: { after: 200 }
        }),
        new Paragraph({
            children: [new TextRun({ text: "Name: ______________________   Date: _____________", size: 24, font: "Arial" })],
            spacing: { after: 400 }
        })
    ];
}

async function generateHandout(filename) {
    const doc = new Document({
        styles: {
            default: { document: { run: { font: "Arial", size: 24 } } }
        },
        sections: [{
            properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
            children: [
                ...createHeader("Lesson 11: The Power of Precise Vocabulary"),
                new Paragraph({
                    children: [new TextRun({ text: "Part 1: The Precision Challenge", bold: true, size: 28, color: THEME.ocean })],
                    spacing: { after: 200 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: "Informative texts use technical vocabulary to be exact. Sort the following words into 'Everyday' vs 'Specialist'.", size: 24, italics: true })],
                    spacing: { after: 300 }
                }),
                
                new Table({
                    columnWidths: [4680, 4680],
                    rows: [
                        new TableRow({
                            tableHeader: true,
                            children: [
                                new TableCell({ shading: { fill: THEME.pool, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Everyday Words", bold: true })] })] }),
                                new TableCell({ shading: { fill: THEME.pool, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Specialist Terms", bold: true })] })] })
                            ]
                        }),
                        new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph({ text: "Water moving over land" })] }),
                                new TableCell({ children: [new Paragraph({ text: "" })] })
                            ]
                        }),
                        new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph({ text: "The area that drains into a river" })] }),
                                new TableCell({ children: [new Paragraph({ text: "" })] })
                            ]
                        }),
                        new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph({ text: "Being covered by a flood" })] }),
                                new TableCell({ children: [new Paragraph({ text: "" })] })
                            ]
                        }),
                        new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph({ text: "Relating to a river" })] }),
                                new TableCell({ children: [new Paragraph({ text: "" })] })
                            ]
                        })
                    ]
                }),
                
                new Paragraph({ text: "", spacing: { after: 400 } }),
                new Paragraph({
                    children: [new TextRun({ text: "Part 2: Floods Archive Vocabulary Hunt", bold: true, size: 28, color: THEME.ocean })],
                    spacing: { after: 200 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: "Search the Floods Archive website for these precise terms. Write the definition (using the tooltips) and identify where you found it.", size: 24 })],
                    spacing: { after: 300 }
                }),

                new Table({
                    columnWidths: [2000, 5360, 2000],
                    rows: [
                        new TableRow({
                            tableHeader: true,
                            children: [
                                new TableCell({ shading: { fill: THEME.navy, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Specialist Term", color: "ffffff", bold: true })] })] }),
                                new TableCell({ shading: { fill: THEME.navy, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Definition", color: "ffffff", bold: true })] })] }),
                                new TableCell({ shading: { fill: THEME.navy, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Location Found", color: "ffffff", bold: true })] })] })
                            ]
                        }),
                        ...["Inundation", "Catchment", "Runoff", "Riverine", "Overland Flow"].map(term => new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph({ text: term, bold: true })] }),
                                new TableCell({ children: [new Paragraph({ text: "" })] }),
                                new TableCell({ children: [new Paragraph({ text: "" })] })
                            ]
                        }))
                    ]
                }),

                new Paragraph({ text: "", spacing: { after: 400 } }),
                new Paragraph({
                    children: [new TextRun({ text: "Part 3: Precision Upgrade", bold: true, size: 28, color: THEME.ocean })],
                    spacing: { after: 200 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: "Rewrite these simple sentences using at least one specialist term from the archive to make them more precise.", size: 24 })],
                    spacing: { after: 300 }
                }),
                new Paragraph({ children: [new TextRun({ text: "1. The rain water moved across the streets.", italics: true })] }),
                new Paragraph({ text: "Upgrade: _________________________________________________________________________", spacing: { after: 300 } }),
                new Paragraph({ children: [new TextRun({ text: "2. The whole river area was wet from the rain.", italics: true })] }),
                new Paragraph({ text: "Upgrade: _________________________________________________________________________", spacing: { after: 300 } }),
                new Paragraph({ children: [new TextRun({ text: "3. The flood covered the low houses.", italics: true })] }),
                new Paragraph({ text: "Upgrade: _________________________________________________________________________", spacing: { after: 400 } }),

                new Paragraph({
                    children: [new TextRun({ text: "Part 4: The Human Cost — PEEL Paragraph", bold: true, size: 28, color: THEME.ocean })],
                    spacing: { after: 200 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: "Using the 'Human Cost' sub-page (mrsutherland.net/archives/Floods/Human_Cost/index.html), construct a PEEL paragraph about one social or mental health impact of flooding.", size: 24 })],
                    spacing: { after: 300 }
                }),
                
                new Table({
                    columnWidths: [1500, 7860],
                    rows: [
                        new TableRow({ children: [new TableCell({ shading: { fill: THEME.pool, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "P", bold: true, size: 28 })] })] }), new TableCell({ children: [new Paragraph({ text: "Point: What is your main idea about the human cost?" })] })] }),
                        new TableRow({ children: [new TableCell({ shading: { fill: THEME.pool, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "E", bold: true, size: 28 })] })] }), new TableCell({ children: [new Paragraph({ text: "Evidence: Find a specific stat or quote from the archive." })] })] }),
                        new TableRow({ children: [new TableCell({ shading: { fill: THEME.pool, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "E", bold: true, size: 28 })] })] }), new TableCell({ children: [new Paragraph({ text: "Explanation: How does this evidence support your point?" })] })] }),
                        new TableRow({ children: [new TableCell({ shading: { fill: THEME.pool, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "L", bold: true, size: 28 })] })] }), new TableCell({ children: [new Paragraph({ text: "Link: How does this relate back to the overall cost?" })] })] })
                    ]
                }),
                new Paragraph({ text: "Draft your paragraph here:", bold: true, spacing: { before: 200, after: 100 } }),
                new Paragraph({ text: "___________________________________________________________________________________" }),
                new Paragraph({ text: "___________________________________________________________________________________" }),
                new Paragraph({ text: "___________________________________________________________________________________", spacing: { after: 400 } })
            ]
        }]
    });
    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(filename, buffer);
}

async function generateLucasHandout(filename) {
    const doc = new Document({
        styles: {
            default: { document: { run: { font: "Arial", size: 24 } } }
        },
        sections: [{
            properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
            children: [
                ...createHeader("Lesson 11: Learning New Flood Words"),
                new Paragraph({
                    children: [new TextRun({ text: "Topic Word Match", bold: true, size: 28, color: THEME.ocean })],
                    spacing: { after: 200 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: "Find these words in the Floods website. Draw a line to the word that means the same thing.", size: 24 })],
                    spacing: { after: 300 }
                }),
                
                new Table({
                    columnWidths: [4680, 4680],
                    rows: [
                        ["Rain water", "Flood"],
                        ["River banks", "Flow"],
                        ["Big flood", "River"],
                        ["Water moving", "Rain"]
                    ].map(row => new TableRow({
                        children: [
                            new TableCell({ children: [new Paragraph({ text: row[0] })] }),
                            new TableCell({ children: [new Paragraph({ text: row[1], alignment: AlignmentType.RIGHT })] })
                        ]
                    }))
                }),

                new Paragraph({ text: "", spacing: { after: 400 } }),
                new Paragraph({
                    children: [new TextRun({ text: "Writing My Sentences", bold: true, size: 28, color: THEME.ocean })],
                    spacing: { after: 200 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: "Use these topic words to finish the sentences.", size: 24 })],
                    spacing: { after: 300 }
                }),
                new Paragraph({ children: [new TextRun({ text: "1. The big ____________ covered the land.", bold: true })] }),
                new Paragraph({ text: "(Word: Flood)", italics: true, spacing: { after: 200 } }),
                
                new Paragraph({ children: [new TextRun({ text: "2. The water is in the ____________.", bold: true })] }),
                new Paragraph({ text: "(Word: River)", italics: true, spacing: { after: 200 } }),
                
                new Paragraph({ children: [new TextRun({ text: "3. The ____________ is falling from the sky.", bold: true })] }),
                new Paragraph({ text: "(Word: Rain)", italics: true, spacing: { after: 400 } }),

                new Paragraph({
                    children: [new TextRun({ text: "Sharing a Feeling", bold: true, size: 28, color: THEME.ocean })],
                    spacing: { after: 200 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: "Look at the 'Human Cost' page. How do people feel after a flood?", size: 24 })],
                    spacing: { after: 300 }
                }),
                new Paragraph({ children: [new TextRun({ text: "People might feel ____________ after a flood.", bold: true })] }),
                new Paragraph({ text: "I know this because the website says ____________.", italics: true, spacing: { after: 300 } }),
                new Paragraph({ text: "This is important because ____________.", italics: true, spacing: { after: 400 } })
            ]
        }]
    });
    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(filename, buffer);
}

async function generateAssessment(filename) {
    const questions = [
        { q: "1. Which word is more precise than 'flooding' when describing water covering dry land?", a: "A. Wetting", b: "B. Inundation", c: "C. Splashing", d: "D. Washing", ans: "B" },
        { q: "2. What do we call the entire area of land from which rainfall drains into a single river system?", a: "B. Field", b: "B. Puddle", c: "C. Catchment", d: "D. Stream", ans: "C" },
        { q: "3. What is the specialist term for water that flows across the ground because it cannot soak in?", a: "A. Runoff", b: "B. Puddle", c: "C. Sea", d: "D. Rain", ans: "A" },
        { q: "4. Which term describes a flood specifically caused by a river overflowing its banks?", a: "A. Sea flood", b: "B. Riverine flood", c: "C. Flash flood", d: "D. Rain flood", ans: "B" },
        { q: "5. What is the precise term for water moving across urban streets when drains are full?", a: "A. River flow", b: "B. Sea flow", c: "C. Overland flow", d: "D. Pipe flow", ans: "C" },
        { q: "6. Which specialist word refers to the 'shape of the land'?", a: "A. Topography", b: "B. Geometry", c: "C. History", d: "D. Geography", ans: "A" },
        { q: "7. What word is used to describe the science of 'weather patterns'?", a: "A. Biology", b: "B. Meteorological", c: "C. Geological", d: "D. Historical", ans: "B" },
        { q: "8. What does 'hydrological' relate to?", a: "A. Fire", b: "B. Wind", c: "C. Water", d: "D. Earth", ans: "C" },
        { q: "9. Surfaces like concrete that water cannot soak into are called:", a: "A. Soft", b: "B. Spongy", c: "C. Impervious", d: "D. Natural", ans: "C" },
        { q: "10. Why do authors of informative texts use specialist vocabulary?", a: "A. To make it harder to read", b: "B. To be more precise and exact", c: "C. To sound like a poet", d: "D. To use fewer words", ans: "B" }
    ];

    const children = [
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "Lesson 11: Precision of Vocabulary Assessment", bold: true, size: 36, font: "Arial" })],
            spacing: { after: 400 }
        })
    ];

    questions.forEach(item => {
        children.push(new Paragraph({ children: [new TextRun({ text: item.q, bold: true, size: 24, font: "Arial" })], spacing: { before: 200 } }));
        ["a", "b", "c", "d"].forEach(key => {
            children.push(new Paragraph({ children: [new TextRun({ text: item[key], size: 24, font: "Arial" })] }));
        });
        children.push(new Paragraph({ children: [new TextRun({ text: `ANSWER: [${item.ans}]`, bold: true, size: 24, font: "Arial" })] }));
        children.push(new Paragraph({ children: [new TextRun({ text: `POINT: 1`, bold: true, size: 24, font: "Arial" })], spacing: { after: 200 } }));
    });

    const doc = new Document({ 
        styles: { default: { document: { run: { font: "Arial" } } } },
        sections: [{ children }] 
    });
    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(filename, buffer);
}

async function generateLessonPlan(outputPath) {
    const doc = new Document({
        styles: {
            default: { document: { run: { font: "Arial", size: 24 } } }
        },
        sections: [{
            properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
            children: [
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: "Lesson Plan 11: Precision of Vocabulary", bold: true, size: 40, color: THEME.navy.replace('#', '') })],
                    spacing: { after: 400 }
                }),
                new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({ shading: { fill: THEME.navy.replace('#', '') }, children: [new Paragraph({ children: [new TextRun({ text: "Learning Intention", color: "ffffff", bold: true })] })] }),
                                new TableCell({ children: [new Paragraph("Understand how to use specialist and technical vocabulary to add precision and detail to texts.")] })
                            ]
                        }),
                        new TableRow({
                            children: [
                                new TableCell({ shading: { fill: THEME.navy.replace('#', '') }, children: [new Paragraph({ children: [new TextRun({ text: "Success Criteria", color: "ffffff", bold: true })] })] }),
                                new TableCell({ children: [new Paragraph("I can identify 5 core technical words. I can use the Floods Archive to find precise meanings. I can write a PEEL paragraph using evidence.")] })
                            ]
                        })
                    ]
                }),
                new Paragraph({ text: "", spacing: { after: 400 } }),
                new Paragraph({ children: [new TextRun({ text: "Lesson Phases", bold: true, size: 28, color: THEME.ocean.replace('#', '') })], spacing: { after: 200 } }),
                new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    rows: [
                        ["1. Activate (5m)", "Brainstorm everyday vs. technical words. T-Chart on board."],
                        ["2. Deep Read (10m)", "Teacher-led walkthrough of 'How Floods Work' using PPT slides 1-5."],
                        ["3. Explore (5m)", "Explore 'Precision of Meaning' using 'Catchment' as an example."],
                        ["4. Model (10m)", "Identify 5 core words: Inundation, Catchment, Runoff, Riverine, Overland Flow."],
                        ["5. Connect (20m)", "Students complete handout. Independent vocabulary hunt. PEEL paragraph on Human Costs."],
                        ["6. Check (10m)", "Formative assessment (10-question MC). Pair-share PEEL paragraphs."]
                    ].map(row => new TableRow({
                        children: [
                            new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, children: [new Paragraph({ text: row[0], bold: true })] }),
                            new TableCell({ width: { size: 75, type: WidthType.PERCENTAGE }, children: [new Paragraph(row[1])] })
                        ]
                    }))
                }),
                new Paragraph({ text: "", spacing: { after: 400 } }),
                new Paragraph({ children: [new TextRun({ text: "Differentiation (Lucas)", bold: true, size: 28, color: THEME.ocean.replace('#', '') })], spacing: { after: 200 } }),
                new Paragraph("Focus on identifying emotions/feelings. Vocabulary is simplified (e.g., 'wet' instead of 'inundated'). Scaffolded sentence starters for the final reflection.")
            ]
        }]
    });
    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(outputPath, buffer);
}

function createHtmlSlide(title, content, isImageOnly = false) {
    if (isImageOnly) {
        return `<!DOCTYPE html>
<html>
<head>
<style>
* { box-sizing: border-box; }
html, body { width: 720pt; height: 405pt; margin: 0; padding: 0; overflow: hidden; background: #000000; display: flex; justify-content: center; align-items: center; }
img { max-width: 100%; max-height: 100%; object-fit: contain; display: block; }
</style>
</head>
<body>
  <img src="${content}">
</body>
</html>`;
    }
    return `<!DOCTYPE html>
<html>
<head>
<style>
* { box-sizing: border-box; }
html, body { width: 720pt; height: 405pt; margin: 0; padding: 0; overflow: hidden; background: #ffffff; }
body { 
    background-color: ${THEME.navy}; 
    font-family: Arial, sans-serif; color: white;
}
.slide-padding {
    padding: 55pt; /* ~0.76 inch padding for safety */
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
}
.header-bar { border-left: 8pt solid ${THEME.accent}; padding-left: 20pt; margin-bottom: 20pt; flex-shrink: 0; }
h1 { font-size: 34pt; margin: 0; font-weight: bold; text-transform: uppercase; letter-spacing: 2pt; line-height: 1.1; }
.content { font-size: 24pt; line-height: 1.3; width: 100%; flex-grow: 1; overflow: hidden; }
.vocabulary-box { background: rgba(255,255,255,0.1); border-radius: 12pt; padding: 15pt; margin-top: 10pt; border: 1pt solid rgba(255,255,255,0.2); }
.term { color: ${THEME.accent}; font-weight: bold; }
ul { list-style-type: none; padding: 0; margin: 0; }
li { margin-bottom: 6pt; display: flex; align-items: flex-start; }
li:before { content: "•"; color: ${THEME.accent}; font-size: 30pt; margin-right: 15pt; line-height: 0.8; }
</style>
</head>
<body>
  <div class="slide-padding">
    <div class="header-bar">
      <h1>${title}</h1>
    </div>
    <div class="content">
      ${content}
    </div>
  </div>
</body>
</html>`;
}

async function run() {
    const baseDir = "c:\\Users\\dsuth\\Documents\\Joshua\\Units\\English\\English_Unit_2\\Lesson_Plans";
    const handoutsDir = path.join(baseDir, "Handouts");
    const presentationsDir = path.join(baseDir, "Presentations", "Lesson_11_Slides");
    
    if (!fs.existsSync(handoutsDir)) fs.mkdirSync(handoutsDir, { recursive: true });
    if (!fs.existsSync(presentationsDir)) fs.mkdirSync(presentationsDir, { recursive: true });

    console.log("Generating Handouts...");
    await generateHandout(path.join(handoutsDir, "Lesson_11_Handout.docx"));
    await generateLucasHandout(path.join(handoutsDir, "Lesson_11_Handout_Lucas.docx"));

    console.log("Generating Assessment...");
    await generateAssessment(path.join(baseDir, "Lesson_11_Assessment.docx"));

    console.log("Generating Lesson Plan Docx...");
    await generateLessonPlan(path.join(baseDir, "Lesson_11_Plan.docx"));

    console.log("Generating Slides...");
    const screenshots = [
        "C:\\Users\\dsuth\\.gemini\\antigravity\\brain\\9085a3a0-089a-4568-845b-6d597b7e669e\\how_floods_work_1_1778382610173.png",
        "C:\\Users\\dsuth\\.gemini\\antigravity\\brain\\9085a3a0-089a-4568-845b-6d597b7e669e\\how_floods_work_2_1778382626532.png",
        "C:\\Users\\dsuth\\.gemini\\antigravity\\brain\\9085a3a0-089a-4568-845b-6d597b7e669e\\how_floods_work_3_1778382642746.png",
        "C:\\Users\\dsuth\\.gemini\\antigravity\\brain\\9085a3a0-089a-4568-845b-6d597b7e669e\\how_floods_work_4_1778382678386.png",
        "C:\\Users\\dsuth\\.gemini\\antigravity\\brain\\9085a3a0-089a-4568-845b-6d597b7e669e\\how_floods_work_5_1778382693463.png"
    ];

    const slidesData = [
        ...screenshots.map(path => ({ isImage: true, content: path })),
        { title: "Precision of Vocabulary", content: "<p>Words carry power. Technical words carry <span class='term'>precision</span>.</p><p>Today we dive deep into the Floods Archive.</p>" },
        { title: "Why Precision Matters?", content: "<p>Instead of: 'The water was everywhere.'</p><p>We use: 'The <span class='term'>inundation</span> affected 75% of Queensland.'</p><p>One word tells us the <i>exact</i> nature of the event.</p>" },
        { title: "Core Term: Catchment", content: "<div class='vocabulary-box'><p><span class='term'>Catchment:</span> The entire area of land from which rainfall drains into a single river system.</p><p style='font-size:20pt;'>Found in: Hub Page (A City Built on a Floodplain)</p></div>" },
        { title: "Core Term: Runoff", content: "<div class='vocabulary-box'><p><span class='term'>Runoff:</span> Water from rain or snowmelt that flows across the surface of the land rather than soaking in.</p><p style='font-size:20pt;'>Found in: How Floods Work (What Is a Flood?)</p></div>" },
        { title: "Core Term: Inundation", content: "<div class='vocabulary-box'><p><span class='term'>Inundation:</span> The act of covering land with a large amount of water; flooding.</p><p style='font-size:20pt;'>Found in: Hub Page (About This Archive)</p></div>" },
        { title: "Core Term: Riverine", content: "<div class='vocabulary-box'><p><span class='term'>Riverine:</span> Relating to or situated on the banks of a river.</p><p style='font-size:20pt;'>Found in: How Floods Work (Riverine Flooding)</p></div>" },
        { title: "Core Term: Overland Flow", content: "<div class='vocabulary-box'><p><span class='term'>Overland Flow:</span> Water that flows across the surface of the land, often overwhelming stormwater drains.</p><p style='font-size:20pt;'>Found in: How Floods Work (Flash Flooding)</p></div>" },
        { title: "More Precise Terms", content: "<ul><li><span class='term'>Meteorological:</span> Related to weather conditions.</li><li><span class='term'>Hydrological:</span> Related to the properties of water and its movement.</li><li><span class='term'>Topography:</span> The shape and features of land surfaces.</li></ul>" },
        { title: "More Precise Terms", content: "<ul><li><span class='term'>Impervious:</span> Not allowing water to pass through (like concrete).</li><li><span class='term'>Morphology:</span> The study of the form and structure of landforms.</li><li><span class='term'>Barometric:</span> Related to atmospheric pressure.</li></ul>" },
        { title: "The Human Cost", content: "<div class='vocabulary-box'><p>Flooding is more than just property damage.</p><p><span class='term'>Mental Health:</span> The social cost of the 2022 floods was estimated at <span class='term'>$4.5 Billion</span>—double the cost of property damage.</p></div>" },
        { title: "Writing with PEEL", content: "<ul><li><span class='term'>Point:</span> Your main idea.</li><li><span class='term'>Evidence:</span> A fact or quote from the Archive.</li><li><span class='term'>Explanation:</span> Why the evidence matters.</li><li><span class='term'>Link:</span> Connect back to your point.</li></ul>" },
        { title: "Vocabulary Hunt", content: "<p>1. Open the Floods Archive.</p><p>2. Find the 5 Core Terms.</p><p>3. Complete the <span class='term'>PEEL Paragraph</span> on Human Costs.</p><p>4. Use the Tooltips for definitions!</p>" }
    ];

    const slidePaths = [];
    for (let i = 0; i < slidesData.length; i++) {
        const slidePath = path.join(presentationsDir, `slide_${i + 1}.html`);
        const slide = slidesData[i];
        fs.writeFileSync(slidePath, createHtmlSlide(slide.title, slide.content, slide.isImage));
        slidePaths.push(slidePath);
    }

    console.log("Converting to PPTX...");
    const pptx = new pptxgen();
    pptx.layout = 'LAYOUT_16x9';
    for (const s of slidePaths) {
        await html2pptx(s, pptx);
    }
    await pptx.writeFile({ fileName: path.join(baseDir, "Presentations", "Lesson_11_Presentation.pptx") });

    console.log("✅ All resources generated successfully.");
}

run().catch(console.error);
