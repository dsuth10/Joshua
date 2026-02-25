const { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, ImageRun, Table, TableRow, TableCell, BorderStyle, WidthType, ShadingType, UnderlineType } = require('docx');
const fs = require('fs');
const path = require('path');

const imgDir = 'c:/Users/dsuth/Documents/Joshua/Units/English/Unit_1_Natural_Disasters_Information/img';

// Shared styles and colors
const OCHRE = "B12E21";
const AMBER = "FFBF00";
const CHARCOAL = "2B2B2B";
const GREY = "A6B0A3";

const doc = new Document({
    styles: {
        default: {
            document: {
                run: { font: "Arial", size: 24, color: "000000" }
            }
        },
        paragraphStyles: [
            {
                id: "Title",
                name: "Title",
                basedOn: "Normal",
                run: { size: 72, bold: true, color: OCHRE, font: "Arial" },
                paragraph: { alignment: AlignmentType.CENTER, spacing: { before: 400, after: 200 } }
            },
            {
                id: "Heading1",
                name: "Heading 1",
                basedOn: "Normal",
                run: { size: 40, bold: true, color: OCHRE, font: "Arial" },
                paragraph: { spacing: { before: 400, after: 200 }, outlineLevel: 0, border: { bottom: { color: OCHRE, space: 1, style: BorderStyle.SINGLE, size: 12 } } }
            },
            {
                id: "Heading2",
                name: "Heading 2",
                basedOn: "Normal",
                run: { size: 32, bold: true, color: AMBER, font: "Arial" },
                paragraph: { spacing: { before: 300, after: 150 }, outlineLevel: 1 }
            }
        ]
    },
    sections: [{
        children: [
            // Title Page Hero
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                    new ImageRun({
                        type: "png",
                        data: fs.readFileSync(path.join(imgDir, 'hero.png')),
                        transformation: { width: 600, height: 337 },
                        altText: { title: "Hero", description: "Elemental Resilience", name: "Hero" }
                    })
                ]
            }),
            new Paragraph({
                text: "The Survivors of the Scorched Earth",
                alignment: AlignmentType.CENTER,
                spacing: { before: 200 }
            }),
            new Paragraph({
                text: "ELEMENTAL MAGIC",
                heading: HeadingLevel.TITLE
            }),
            new Paragraph({
                text: "How Australia’s unique wildlife uses instinct and adaptation to outsmart the most powerful force of nature: The Bushfire.",
                alignment: AlignmentType.CENTER,
                spacing: { after: 400 }
            }),

            // Section 1
            new Paragraph({ text: "1) The Science of Survival", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({
                children: [
                    new TextRun("Bushfires are a fundamental, albeit terrifying, part of the Australian landscape. They move with incredible speed, reaching temperatures that can melt steel and filling the atmosphere with suffocating smoke. Yet, for the animals that call the bush home, fire is not a new enemy. Over millions of years, creatures from kangaroos to tiny echidnas have developed a sophisticated toolkit of \"survival magic\"—behaviours and biological features that allow them to endure where others cannot.")
                ]
            }),
            new Paragraph({
                children: [
                    new TextRun("Success in a fire zone isn't about one single trick; it's a dynamic calculation of timing and location. Animals must decide in a split second whether to flee the approaching front, seek shelter in the deep earth, or wait for the precise moment when the heat passes. This \"Elemental Magic\" is what keeps the Australian outback breathing, even when the world seems to be turning to ash.")
                ]
            }),

            // Kangaroo
            new Paragraph({ text: "Kangaroos: The Tactical Runners", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                    new ImageRun({
                        type: "png",
                        data: fs.readFileSync(path.join(imgDir, 'kangaroo.png')),
                        transformation: { width: 500, height: 281 },
                        altText: { title: "Kangaroo", description: "Tactical Runners", name: "Kangaroo" }
                    })
                ]
            }),
            new Paragraph({
                children: [
                    new TextRun("Kangaroos are the masters of the \"Early Exit.\" Using their powerful hind legs and incredible endurance, they can sense the subtle chemical shifts in the air—the scent of distant smoke or the unnatural warmth of a northerly wind—and begin their evacuation long before the first flame is visible. Their survival strategy is built on kinetic energy; they move fast and they move early.")
                ]
            }),

            // Echidna
            new Paragraph({ text: "Echidnas: The Earth Shields", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                    new ImageRun({
                        type: "png",
                        data: fs.readFileSync(path.join(imgDir, 'echidna.png')),
                        transformation: { width: 500, height: 281 },
                        altText: { title: "Echidna", description: "Earth Shields", name: "Echidna" }
                    })
                ]
            }),
            new Paragraph({
                children: [
                    new TextRun("Where the kangaroo runs, the echidna digs. These short-beaked monotremes are not built for speed, but they possess a remarkable \"Thermal Shield.\" When they sense an approaching fire, they use their powerful, shovel-like claws to burrow deep into the soil or leaf litter. They don't just hide; they effectively disappear into the cooling embrace of the earth.")
                ]
            }),

            // Goanna
            new Paragraph({ text: "Goannas: Master Squatters", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                    new ImageRun({
                        type: "png",
                        data: fs.readFileSync(path.join(imgDir, 'goanna.png')),
                        transformation: { width: 500, height: 281 },
                        altText: { title: "Goanna", description: "Master Squatters", name: "Goanna" }
                    })
                ]
            }),
            new Paragraph({
                children: [
                    new TextRun("Goannas are the ultimate survivors of the canopy and the crevice. As cold-blooded reptiles, they are acutely sensitive to temperature changes, which gives them a head start in detecting an approaching fire. Their strategy is one of \"Shelter Real Estate.\" They possess an intimate knowledge of their territory, knowing exactly where the deepest tree hollows and the thickest rock crevices are located.")
                ]
            }),

            // Birds
            new Paragraph({ text: "Birds: The Sky Guardians", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                    new ImageRun({
                        type: "png",
                        data: fs.readFileSync(path.join(imgDir, 'birds.png')),
                        transformation: { width: 500, height: 281 },
                        altText: { title: "Birds", description: "Sky Guardians", name: "Birds" }
                    })
                ]
            }),
            new Paragraph({
                children: [
                    new TextRun("Birds possess the most obvious advantage—flight—but fire presents unique challenges in the air. Strong convection currents and thick smoke make flying dangerous for many small species. Larger birds, such as Whistling Kites and Hawks, often use the fire to their advantage. They are known as \"Smoke Hunters,\" circling the edges of the fire to catch fleeing insects and small mammals exposed by the disappearing ground cover.")
                ]
            }),

            // Aftermath Table
            new Paragraph({ text: "Comparison Summary", heading: HeadingLevel.HEADING_2 }),
            new Table({
                columnWidths: [4680, 4680],
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({
                                shading: { fill: OCHRE, type: ShadingType.CLEAR },
                                children: [new Paragraph({ children: [new TextRun({ text: "Animal", bold: true, color: "FFFFFF" })] })]
                            }),
                            new TableCell({
                                shading: { fill: OCHRE, type: ShadingType.CLEAR },
                                children: [new Paragraph({ children: [new TextRun({ text: "Survival Strategy", bold: true, color: "FFFFFF" })] })]
                            })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ children: [new Paragraph({ children: [new TextRun("Kangaroo")] })] }),
                            new TableCell({ children: [new Paragraph({ children: [new TextRun("Tactical Retreat & Early Sensing")] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ children: [new Paragraph({ children: [new TextRun("Echidna")] })] }),
                            new TableCell({ children: [new Paragraph({ children: [new TextRun("Thermal Earth Shielding (Burrowing)")] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ children: [new Paragraph({ children: [new TextRun("Goanna")] })] }),
                            new TableCell({ children: [new Paragraph({ children: [new TextRun("Shelter Real Estate (Crevices)")] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ children: [new Paragraph({ children: [new TextRun("Birds")] })] }),
                            new TableCell({ children: [new Paragraph({ children: [new TextRun("Elemental Sanctuaries (Wetlands)")] })] })
                        ]
                    })
                ]
            })
        ]
    }]
});

Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync('c:/Users/dsuth/Documents/Joshua/Units/English/Unit_1_Natural_Disasters_Information/SharePoint_Publish/Elemental_Magic_Fire_and_Life.docx', buffer);
    console.log('Document created successfully');
});
