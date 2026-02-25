const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, ImageRun, AlignmentType, HeadingLevel, LevelFormat, BorderStyle, WidthType, ShadingType, VerticalAlign, PageNumber, Header, Footer, PageBreak } = require('docx');
const fs = require('fs');
const path = require('path');

const sourceDir = "c:\\Users\\dsuth\\Documents\\Joshua\\Units\\English\\Unit_1_Natural_Disasters_Information\\Arsonist_Birds";
const outputDir = "c:\\Users\\dsuth\\Documents\\Joshua\\Arsonist_Birds_Doc";

const THEME = {
    ochre: "B12E21",
    charcoal: "2B2B2B",
    silver: "A6B0A3",
    font: "Arial"
};

const loadImage = (filename) => {
    try {
        const filePath = path.join(sourceDir, filename);
        if (fs.existsSync(filePath)) {
            return fs.readFileSync(filePath);
        }
        console.warn(`File not found: ${filePath}`);
        return null;
    } catch (e) {
        console.error(`Error loading ${filename}: ${e.message}`);
        return null;
    }
};

const createImagePara = (filename, width, height, title) => {
    const data = loadImage(filename);
    if (!data) return new Paragraph({ children: [] });
    return new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 200 },
        children: [new ImageRun({
            type: "png",
            data: data,
            transformation: { width: width, height: height, rotation: 0 },
            altText: { title: title, description: title, name: filename }
        })]
    });
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

const createNumberPara = (boldText, normalText) => {
    return new Paragraph({
        numbering: { reference: "numbered-list", level: 0 },
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
                id: "Title", name: "Title", basedOn: "Normal",
                run: { size: 56, bold: true, color: THEME.ochre, font: THEME.font },
                paragraph: { spacing: { before: 240, after: 120 }, alignment: AlignmentType.CENTER }
            },
            {
                id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal",
                run: { size: 32, bold: true, color: THEME.charcoal, font: THEME.font },
                paragraph: { spacing: { before: 400, after: 200 }, outlineLevel: 0 }
            },
            {
                id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal",
                run: { size: 28, bold: true, color: THEME.ochre, font: THEME.font },
                paragraph: { spacing: { before: 300, after: 150 }, outlineLevel: 1 }
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
            },
            {
                reference: "numbered-list",
                levels: [{
                    level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
                    style: { paragraph: { indent: { left: 720, hanging: 360 } } }
                }]
            },
            {
                reference: "comprehension-list",
                levels: [{
                    level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
                    style: { paragraph: { indent: { left: 720, hanging: 360 } } }
                }]
            }
        ]
    },
    sections: [{
        headers: {
            default: new Header({
                children: [
                    new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [new TextRun({ text: "Reading Comprehension: Arsonist Birds", color: THEME.silver, size: 20 })]
                    })
                ]
            })
        },
        footers: {
            default: new Footer({
                children: [
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({ text: "Page ", color: THEME.silver, size: 20 }),
                            new TextRun({ children: [PageNumber.CURRENT], color: THEME.silver, size: 20 }),
                            new TextRun({ text: " of ", color: THEME.silver, size: 20 }),
                            new TextRun({ children: [PageNumber.TOTAL_PAGES], color: THEME.silver, size: 20 })
                        ]
                    })
                ]
            })
        },
        children: [
            new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun("NATURE'S ARSONISTS")] }),
            new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 300 }, children: [new TextRun({ text: "Fire-Hunting Raptors of Northern Australia", italics: true, color: THEME.charcoal, size: 28 })] }),
            createImagePara("hero.png", 500, 280, "Nature's Arsonists"),

            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("01. EXECUTIVE SUMMARY")] }),
            new Paragraph({ children: [new TextRun("For decades, people in Northern Australia have told stories about 'Firehawks'—birds that intentionally spread fire. Scientists are now combining Indigenous knowledge with eyewitness accounts to study this amazing behaviour. While some experts are still looking for video proof, local rangers and firefighters have seen these avian arsonists in action many times.")] }),
            createImagePara("summary.png", 400, 200, "Executive Summary"),

            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("02. THE THREE SPECIES")] }),
            new Paragraph({ spacing: { after: 200 }, children: [new TextRun("There are three main species of raptors (birds of prey) that have been seen spreading flames in Australia's northern savannas.")] }),
            createImagePara("species_hero.png", 500, 250, "The Three Species"),
            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("BLACK KITE (Milvus migrans)")] }),
            new Paragraph({ children: [new TextRun("The most abundant and social of the three. They often gather in hundreds around major fires, waiting for prey to emerge from the grass.")] }),
            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("WHISTLING KITE (Haliastur sphenurus)")] }),
            new Paragraph({ children: [new TextRun("Named for its loud whistle. These birds have been seen flying ahead of fire fronts with smoking sticks in their talons to start new fires in unburnt areas.")] }),
            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("BROWN FALCON (Falco berigora)")] }),
            new Paragraph({ children: [new TextRun("Highly active and focused. Multiple reports describe these falcons specifically moving fire to flush out hidden prey like lizards and insects.")] }),

            new Paragraph({ children: [new PageBreak()] }),

            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("03. HOW THEY DO IT")] }),
            new Paragraph({ children: [new TextRun("Spreading fire is a deliberate five-step process for a Firehawk. This behaviour allows them to expand the hunting zone by bringing fire to areas where prey might still be hiding.")] }),
            createNumberPara("1. Ignition Gathering: ", "Birds fly directly into active fires, signalled by the rising smoke."),
            createNumberPara("2. Stick Acquisition: ", "They find a smouldering stick and grab it with their beak or talons."),
            createNumberPara("3. Transport: ", "They fly up to 1 kilometre away, often crossing roads or rivers."),
            createNumberPara("4. Deposition: ", "The burning stick is dropped into dry, unburnt grass."),
            createNumberPara("5. Feeding: ", "As the new fire flushes out insects and lizards, the bird swoops in for an easy meal!"),
            createImagePara("mechanism.png", 500, 250, "Step-by-Step Mechanism"),

            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("04. DO WE HAVE PROOF?")] }),
            new Paragraph({ children: [new TextRun("Evidence for this behaviour comes from three main sources: Indigenous knowledge, expert observers, and the boots-on-the-ground experience of firefighters.")] }),
            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Indigenous Knowledge")] }),
            new Paragraph({ children: [new TextRun("Aboriginal groups across Northern Australia have documented these birds for centuries. Over 20 records exist from 12 different groups, some recorded as far back as 1963.")] }),
            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Expert Observers")] }),
            new Paragraph({ children: [new TextRun("Scientists and linguists like Kim Akerman and Denise Angelo have witnessed single birds spreading fire on several occasions during field work in remote areas.")] }),
            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Firefighters & Rangers")] }),
            new Paragraph({ children: [new TextRun("Detailed accounts from practitioners confirm these sightings:")] }),
            createBulletPara("Nathan Ferguson (Barkly Tablelands): ", "Witnessed kites carrying sticks over 50 metres."),
            createBulletPara("Dick Eussen (Northern Territory): ", "Observed new fires ignite across firebreaks in the 1980s."),
            createBulletPara("Bob White (Roper River): ", "Watched raptors move fire fronts up a valley."),
            createBulletPara("'MJ' (Western Australia): ", "Saw birds work together to move fire across a river."),
            createImagePara("evidence.png", 500, 250, "Evidence of Behaviour"),

            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("05. THE BIG QUESTION")] }),
            new Paragraph({ children: [new TextRun("Is it Intentional or Accidental? This is the heart of the scientific debate.")] }),
            new Table({
                columnWidths: [4680, 4680],
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({ shading: { fill: "F0F0F0", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "WHY IT'S REAL (Intentional):", bold: true })] })] }),
                            new TableCell({ shading: { fill: "F0F0F0", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "THE SKEPTICS SAY (Accidental):", bold: true })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({
                                children: [
                                    new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Reports are consistent and describe 'goal-directed' actions.")] }),
                                    new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Only a small percentage of birds do it, suggesting learning.")] }),
                                    new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Birds sometimes work together to move fire across barriers.")] })
                                ]
                            }),
                            new TableCell({
                                children: [
                                    new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("We still don't have clear video of a bird starting a fire on purpose.")] }),
                                    new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("It's hard to tell if they grabbed a stick by accident while hunting.")] }),
                                    new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("We don't see this happening in other countries.")] })
                                ]
                            })
                        ]
                    })
                ]
            }),

            new Paragraph({ children: [new PageBreak()] }),

            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("06. LIVING WITH FIREHAWKS")] }),
            new Paragraph({ children: [new TextRun("In the Northern Territory, fire managers already plan for these birds when conducting controlled burns. A Firehawk can easily carry a blaze across a firebreak, making their job much more difficult.")] }),
            createImagePara("management.png", 500, 250, "Land Management Challenges"),

            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("07. THE SEARCH CONTINUES")] }),
            new Paragraph({ children: [new TextRun("As of 2026, the case remains 'well-supported but not conclusively proven' by Western science. The connection between ancient Indigenous stories and modern observations has changed how we think about animal intelligence.")] }),
            createImagePara("status.png", 500, 250, "Ongoing Research"),

            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("08. CONCLUSION")] }),
            new Paragraph({ children: [new TextRun("The Firehawk teaches us that nature is full of surprises. It is a reminder to look closely at the bush—there might be a master hunter at work in the smoke!")] }),
            createImagePara("conclusion.png", 500, 250, "Conclusion"),

            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("COMPREHENSION CHECK")] }),
            new Paragraph({ numbering: { reference: "comprehension-list", level: 0 }, children: [new TextRun("Identify the three species of birds described as 'Firehawks' and one characteristic of each.")] }),
            new Paragraph({ numbering: { reference: "comprehension-list", level: 0 }, children: [new TextRun("Describe the five steps of the 'Behavioural Mechanism' used by these birds to spread fire.")] }),
            new Paragraph({ numbering: { reference: "comprehension-list", level: 0 }, children: [new TextRun("Why is the behaviour of the Firehawks still considered a controversy in Western science?")] }),
            new Paragraph({ numbering: { reference: "comprehension-list", level: 0 }, children: [new TextRun("How do fire managers in the Northern Territory adapt their strategies to account for Firehawks?")] }),
            new Paragraph({ numbering: { reference: "comprehension-list", level: 0 }, children: [new TextRun("What does the author mean by saying the Firehawk is a 'bridge between two worlds of knowledge'?")] })
        ]
    }]
});

Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync(path.join(outputDir, "Arsonist_Birds_Information.docx"), buffer);
    console.log("Success: Document created.");
}).catch(err => {
    console.error("Error:", err);
    process.exit(1);
});
