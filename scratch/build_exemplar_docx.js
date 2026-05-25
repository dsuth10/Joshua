const { 
    Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, 
    AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType, 
    VerticalAlign, LevelFormat, PageNumber, Header, Footer 
} = require('docx');
const fs = require('fs');

// 1. Text Parsing Helper for Markdown (supports **bold** and *italics*)
function parseText(text, boldAll = false) {
    const parts = text.split(/\*\*/);
    const runs = [];
    parts.forEach((part, index) => {
        const isBold = index % 2 === 1 || boldAll;
        const subparts = part.split(/\*/);
        subparts.forEach((subpart, subindex) => {
            const isItalic = subindex % 2 === 1;
            runs.push(new TextRun({
                text: subpart,
                bold: isBold,
                italics: isItalic,
                font: "Arial"
            }));
        });
    });
    return runs;
}

// Usable page width for A4 (11906 DXA) with 1-inch margins (1440 DXA * 2 = 2880 DXA margins)
// Usable width = 11906 - 2880 = 9026 DXA
const USABLE_WIDTH = 9026;

// Border Styles
const borderThinGray = { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC" };
const borderBlue = { style: BorderStyle.SINGLE, size: 12, color: "118EC4" };
const borderRed = { style: BorderStyle.SINGLE, size: 12, color: "E05C5C" };
const cellPadding = { top: 160, bottom: 160, left: 240, right: 240 };

// 2. Callout Box Builder
function createCallout(title, paragraphsText, isWarning) {
    const borderColor = isWarning ? borderRed : borderBlue;
    const bgColor = isWarning ? "FFF5F5" : "F2F9FC";
    const titleColor = isWarning ? "A82020" : "118EC4";
    
    const children = [
        new Paragraph({
            spacing: { after: 120 },
            children: [
                new TextRun({ text: title, bold: true, color: titleColor, size: 24, font: "Arial" })
            ]
        })
    ];
    
    paragraphsText.forEach(text => {
        children.push(new Paragraph({
            spacing: { after: 100 },
            children: parseText(text)
        }));
    });
    
    // Remove final spacing to prevent trailing white space
    if (children.length > 0) {
        children[children.length - 1].spacing = { after: 0 };
    }

    return new Table({
        columnWidths: [USABLE_WIDTH],
        margins: cellPadding,
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        width: { size: USABLE_WIDTH, type: WidthType.DXA },
                        shading: { fill: bgColor, type: ShadingType.CLEAR },
                        borders: {
                            left: borderColor,
                            top: borderThinGray,
                            bottom: borderThinGray,
                            right: borderThinGray
                        },
                        children: children
                    })
                ]
            })
        ]
    });
}

// 3. Visual Concept Box Builder
function createVisualBox(title, caption) {
    return new Table({
        columnWidths: [USABLE_WIDTH],
        margins: cellPadding,
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        width: { size: USABLE_WIDTH, type: WidthType.DXA },
                        shading: { fill: "F9F9F9", type: ShadingType.CLEAR },
                        borders: {
                            left: borderThinGray,
                            top: borderThinGray,
                            bottom: borderThinGray,
                            right: borderThinGray
                        },
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                spacing: { after: 120 },
                                children: [
                                    new TextRun({ text: title, bold: true, color: "555555", size: 22, font: "Arial" })
                                ]
                            }),
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({ text: caption, italics: true, color: "777777", size: 20, font: "Arial" })
                                ]
                            })
                        ]
                    })
                ]
            })
        ]
    });
}

// 4. Diagram Box Builder (Centered ASCII art representation)
function createDiagramBox(title, lines) {
    const children = [
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 160 },
            children: [
                new TextRun({ text: title, bold: true, color: "555555", size: 22, font: "Arial" })
            ]
        })
    ];
    
    lines.forEach(line => {
        children.push(new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 20 },
            children: [
                new TextRun({ text: line, font: "Consolas", size: 18, color: "333333" })
            ]
        }));
    });
    
    return new Table({
        columnWidths: [USABLE_WIDTH],
        margins: cellPadding,
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        width: { size: USABLE_WIDTH, type: WidthType.DXA },
                        shading: { fill: "F9F9F9", type: ShadingType.CLEAR },
                        borders: {
                            left: borderThinGray,
                            top: borderThinGray,
                            bottom: borderThinGray,
                            right: borderThinGray
                        },
                        children: children
                    })
                ]
            })
        ]
    });
}

// Initialize Document with custom paragraph styles
const doc = new Document({
    styles: {
        default: { document: { run: { font: "Arial", size: 22 } } }, // 11pt default body font
        paragraphStyles: [
            {
                id: "Title",
                name: "Title",
                basedOn: "Normal",
                run: { size: 56, bold: true, color: "118EC4", font: "Arial" }, // High impact title
                paragraph: { spacing: { before: 240, after: 120 }, alignment: AlignmentType.CENTER }
            },
            {
                id: "Heading1",
                name: "Heading 1",
                basedOn: "Normal",
                run: { size: 32, bold: true, color: "000000", font: "Arial" }, // 16pt
                paragraph: { spacing: { before: 280, after: 140 }, outlineLevel: 0 }
            },
            {
                id: "Heading2",
                name: "Heading 2",
                basedOn: "Normal",
                run: { size: 26, bold: true, color: "118EC4", font: "Arial" }, // 13pt brand color H2
                paragraph: { spacing: { before: 220, after: 120 }, outlineLevel: 1 }
            },
            {
                id: "Heading3",
                name: "Heading 3",
                basedOn: "Normal",
                run: { size: 22, bold: true, color: "000000", font: "Arial" }, // 11pt bold H3
                paragraph: { spacing: { before: 180, after: 80 }, outlineLevel: 2 }
            }
        ]
    },
    numbering: {
        config: [
            {
                reference: "bullet-list",
                levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }]
            },
            {
                reference: "boundaries-list",
                levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }]
            },
            {
                reference: "bibliography-list",
                levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }]
            }
        ]
    },
    sections: [{
        properties: { 
            page: { 
                size: { width: 11906, height: 16838 }, // A4 Dimensions
                margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } // Standard 1-inch margins
            } 
        },
        headers: {
            default: new Header({
                children: [
                    new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        spacing: { after: 100 },
                        children: [
                            new TextRun({ text: "Leo Henderson · Year 5 Student Exemplar Information Report", color: "888888", size: 16, font: "Arial" })
                        ]
                    })
                ]
            })
        },
        footers: {
            default: new Footer({
                children: [
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 100 },
                        children: [
                            new TextRun({ text: "Page ", color: "888888", size: 16, font: "Arial" }),
                            new TextRun({ children: [PageNumber.CURRENT], color: "888888", size: 16, font: "Arial" }),
                            new TextRun({ text: " of ", color: "888888", size: 16, font: "Arial" }),
                            new TextRun({ children: [PageNumber.TOTAL_PAGES], color: "888888", size: 16, font: "Arial" })
                        ]
                    })
                ]
            })
        },
        children: [
            // Title & Subtitle
            new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun("The Trembling Earth: A Scientific Report on Earthquakes")] }),
            new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 400 }, children: [new TextRun({ text: "By Leo Henderson (Year 5, Room 12)", bold: true, color: "555555", size: 24 })] }),
            
            // Section 1: Introduction
            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Introduction: What is an Earthquake?")] }),
            new Paragraph({
                spacing: { after: 180 },
                children: parseText("Have you ever felt the ground shake beneath your feet? Even though the Earth feels completely solid, it is actually constantly shifting and changing. An **earthquake** is a sudden, violent shaking of the ground. It is a natural hazard that happens when energy that has been stored up inside the Earth's crust is suddenly released in a few dramatic seconds.")
            }),
            new Paragraph({
                spacing: { after: 240 },
                children: parseText("While sensitive scientific machines detect tiny tremors every day, major earthquakes can be catastrophic natural disasters. They can smash buildings, split roads in half, and trigger other dangerous hazards. Understanding how these powerful events work is essential for keeping communities safe, especially since Australia is moving faster than most people realise!")
            }),
            
            // Note Callout
            createCallout(
                "What is the Earth's Crust?", 
                ["The crust is the extremely thin, rocky outer layer of the Earth. It is only about 5 to 70 kilometres deep, which is like the thin skin on a giant apple!"],
                false
            ),
            new Paragraph({ spacing: { after: 280 } }),

            // Section 2: Plate Tectonics
            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Plate Tectonics: The Giant Jigsaw Puzzle")] }),
            new Paragraph({
                spacing: { after: 180 },
                children: parseText("To understand why the ground shakes, we have to look deep beneath our feet. The Earth’s crust is not one solid piece of rock. Instead, it is broken up into giant jigsaw puzzle pieces called **tectonic plates**. These massive slabs of rock float on a hot, semi-molten layer of rock called the mantle.")
            }),
            new Paragraph({
                spacing: { after: 180 },
                children: parseText("Driven by heat rising from deep inside the Earth (called mantle convection), these plates drift very slowly. Most plates move about 2 to 15 centimetres every year, which is about the same speed that our fingernails grow!")
            }),
            new Paragraph({
                spacing: { after: 240 },
                children: parseText("Amazingly, the **Indo-Australian Plate**—which carries the entire continent of Australia—is one of the speediest plates on Earth. It is drifting north-northeast towards Asia at a rapid **7 centimetres per year**. Over a human lifetime, this adds up to about 5 metres of movement!")
            }),

            // Visual Concept
            createVisualBox(
                "[Student Map Concept: The Indo-Australian Plate Moving Northward]",
                "Caption: My sketch of the Indo-Australian Plate drifting north-northeast at 7 cm per year, squeezing against the Eurasian and Pacific plates at the top."
            ),
            new Paragraph({ spacing: { after: 240 } }),

            new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("The Three Types of Plate Boundaries")] }),
            new Paragraph({
                spacing: { after: 180 },
                children: parseText("Most earthquakes occur along the edges where tectonic plates meet, which are called boundaries. There are three main ways these boundaries interact:")
            }),

            new Paragraph({
                numbering: { reference: "boundaries-list", level: 0 },
                spacing: { after: 120 },
                children: parseText("**Convergent Boundaries (Squeezing):** This is where plates collide. When a heavy ocean plate slides under a lighter land plate (a process called **subduction**), it locks up and builds massive pressure. When it slips, it causes the world's largest earthquakes, called megaquakes.")
            }),
            new Paragraph({
                numbering: { reference: "boundaries-list", level: 0 },
                spacing: { after: 120 },
                children: parseText("**Divergent Boundaries (Pulling Apart):** This is where plates pull away from each other. Hot magma rises up to fill the gap, creating new crust. Earthquakes here are usually smaller and shallower.")
            }),
            new Paragraph({
                numbering: { reference: "boundaries-list", level: 0 },
                spacing: { after: 240 },
                children: parseText("**Transform Boundaries (Sliding):** This is where plates grind sideways past each other. The Alpine Fault in New Zealand is a famous transform boundary where the Pacific Plate slides past the Australian Plate, having shuffled the ground by a massive 480 kilometres over millions of years!")
            }),

            // Section 3: Anatomy of a Quake
            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Anatomy of a Quake: Focus and Waves")] }),
            new Paragraph({
                spacing: { after: 180 },
                children: parseText("When a crack in the rock (called a **fault**) finally snaps under pressure, an earthquake is born. Seismologists (scientists who study earthquakes) use specific terms to describe where this happens:")
            }),

            new Paragraph({
                numbering: { reference: "bullet-list", level: 0 },
                spacing: { after: 100 },
                children: parseText("**Hypocentre (Focus):** This is the exact spot underground where the rock first breaks.")
            }),
            new Paragraph({
                numbering: { reference: "bullet-list", level: 0 },
                spacing: { after: 240 },
                children: parseText("**Epicentre:** This is the point on the Earth's surface directly above the hypocentre. This is usually where the shaking feels the strongest and the most damage occurs.")
            }),

            // Diagram
            createDiagramBox(
                "[Diagram 1: Cross-Section of an Earthquake Fault]",
                [
                    "         Epicentre (on the surface)             ",
                    "           │                                    ",
                    "  ─────────▼───────── (Ground Level)            ",
                    "         /                                      ",
                    "        /  ◄─── Fault Line (crack in the crust) ",
                    "       /                                        ",
                    "      ● ◄─── Hypocentre / Focus (rupture point underground)"
                ]
            ),
            new Paragraph({ spacing: { after: 240 } }),

            new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("The Message the Earth Sends: Seismic Waves")] }),
            new Paragraph({
                spacing: { after: 180 },
                children: parseText("When the fault snaps, the stored energy ripples outward in all directions as **seismic waves**. There are three main types of waves that reach the surface, and they behave very differently:")
            }),

            new Paragraph({
                numbering: { reference: "bullet-list", level: 0 },
                spacing: { after: 120 },
                children: parseText("**Primary Waves (P-waves):** These are the fastest waves, zooming through the rock at 5 to 8 kilometres per second! They push and pull the ground like a concertina bellows. P-waves are usually harmless and feel like a sudden vertical jolt or a loud rumbling boom.")
            }),
            new Paragraph({
                numbering: { reference: "bullet-list", level: 0 },
                spacing: { after: 120 },
                children: parseText("**Secondary Waves (S-waves):** Travelling at about half the speed of P-waves (3 to 5 kilometres per second), these waves shake the ground side-to-side like a wiggling snake. S-waves are much more dangerous to buildings and cannot travel through liquids.")
            }),
            new Paragraph({
                numbering: { reference: "bullet-list", level: 0 },
                spacing: { after: 240 },
                children: parseText("**Surface Waves (Rayleigh and Love waves):** These are the slowest waves, but they are the absolute champions of destruction! They roll along the surface like giant ocean waves, making the ground appear to breathe. They shake foundations sideways and cause the most structural damage.")
            }),

            new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("Measuring the Might: The Logarithmic Scale")] }),
            new Paragraph({
                spacing: { after: 180 },
                children: parseText("Many people have heard of the old Richter scale, but modern scientists use the **Moment Magnitude Scale (Mw)** to measure the actual physical energy released.")
            }),
            new Paragraph({
                spacing: { after: 180 },
                children: parseText("This scale is **logarithmic**, which means each whole number is not just a little bit bigger. Each step up represents **31.6 times more energy**!")
            }),

            new Paragraph({
                numbering: { reference: "bullet-list", level: 0 },
                spacing: { after: 120 },
                children: parseText("A magnitude 7 earthquake does not release two times more energy than a magnitude 5 quake—it actually releases **1,000 times more energy**!")
            }),
            new Paragraph({
                numbering: { reference: "bullet-list", level: 0 },
                spacing: { after: 240 },
                children: parseText("The devastating Newcastle earthquake in 1989 was a magnitude **Mw 5.6**, but the Tohoku megaquake in Japan in 2011 was a massive **Mw 9.1**. That means the Japanese quake released roughly **63 million times** more energy than Newcastle!")
            }),

            // Section 4: Shaking Australia
            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Earthquakes in Our Backyard: Shaking Australia")] }),
            new Paragraph({
                spacing: { after: 180 },
                children: parseText("Many Australians believe that earthquakes only happen in other countries, like Japan or New Zealand, which sit on the active \"Ring of Fire\". However, the science proves that Australia is not completely safe!")
            }),
            new Paragraph({
                spacing: { after: 240 },
                children: parseText("Because the Indo-Australian Plate is colliding with Asia at the top, the entire Australian continent is being squeezed under intense compression. This stress travels thousands of kilometres inland and reactivates ancient, deeply buried cracks. These are called **intraplate earthquakes** because they happen in the middle of a plate, rather than at the edge.")
            }),

            new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("Case Study: Newcastle 1989 (Australia's Deadliest Quake)")] }),
            new Paragraph({
                spacing: { after: 180 },
                children: parseText("On the morning of **28 December 1989**, a magnitude **Mw 5.6** earthquake struck the regional city of Newcastle in New South Wales. Even though it was a moderate quake by global standards, it caused absolute devastation because the hypocentre was incredibly shallow—only **11 kilometres** deep.")
            }),

            new Paragraph({
                numbering: { reference: "bullet-list", level: 0 },
                spacing: { after: 120 },
                children: parseText("**The Impact:** The shaking lasted for less than a minute, but it killed **13 people**, injured over 160, and caused **A$4 billion** in damage. Brick buildings collapsed, streets of historic terraces were ruined, and the Newcastle Workers Club completely pancaked.")
            }),
            new Paragraph({
                numbering: { reference: "bullet-list", level: 0 },
                spacing: { after: 240 },
                children: parseText("**The Lesson:** Seismologists discovered that the quake occurred on a previously unknown fault buried deep underground. This tragedy forced Australia to completely rewrite its building codes, making it mandatory for all new buildings to be engineered to survive seismic shaking.")
            }),

            // Visual Concept
            createVisualBox(
                "[Before/After Visual Concept: Newcastle Workers Club 1989]",
                "Left Box: My drawing of the workers club before the quake, showing a sturdy multi-storey brick building. | Right Box: The same building collapsed into a heap of rubble and concrete slabs after less than 60 seconds of shaking."
            ),
            new Paragraph({ spacing: { after: 240 } }),

            new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("Other Famous Australian Shakes")] }),
            new Paragraph({
                spacing: { after: 180 },
                children: parseText("Australia has experienced several other large earthquakes that prove our continent is active:")
            }),

            new Paragraph({
                numbering: { reference: "bullet-list", level: 0 },
                spacing: { after: 120 },
                children: parseText("**Meckering, WA (1968):** A massive **ML 6.9** earthquake tore a **37-kilometre-long scar** across the Western Australian outback. The ground was thrust upwards by up to 2.5 metres, completely destroying the small town.")
            }),
            new Paragraph({
                numbering: { reference: "bullet-list", level: 0 },
                spacing: { after: 120 },
                children: parseText("**Tennant Creek, NT (1988):** Three huge earthquakes (magnitudes **6.3, 6.5, and 6.7**) struck this remote area in just 12 hours! Because it was in the outback, no one was killed, but it ripped giant cracks in the desert floor.")
            }),
            new Paragraph({
                numbering: { reference: "bullet-list", level: 0 },
                spacing: { after: 240 },
                children: parseText("**Adelaide, SA (1954):** A **ML 5.4** quake shook the city, cracking chimneys and masonry across the suburbs because of stress in the Mt Lofty Ranges.")
            }),

            // Section 5: Secondary Hazards
            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Secondary Hazards: The Hidden Dangers")] }),
            new Paragraph({
                spacing: { after: 180 },
                children: parseText("Often, the initial shaking of an earthquake is only the beginning of the disaster. Secondary hazards can sometimes be far more dangerous than the earthquake itself:")
            }),

            new Paragraph({
                numbering: { reference: "bullet-list", level: 0 },
                spacing: { after: 120 },
                children: parseText("**Tsunamis:** If a large subduction zone earthquake occurs under the ocean, the sudden vertical movement of the seafloor pushes up a giant column of water. This creates rapid waves that can cross oceans and crash onto coastlines with devastating height.")
            }),
            new Paragraph({
                numbering: { reference: "bullet-list", level: 0 },
                spacing: { after: 120 },
                children: parseText("**Landslides:** Severe shaking can make steep, unstable hillsides collapse, burying entire towns under mud and rock.")
            }),
            new Paragraph({
                numbering: { reference: "bullet-list", level: 0 },
                spacing: { after: 240 },
                children: parseText("**Liquefaction:** This is a bizarre geological phenomenon where sandy, water-logged soil behaves like a liquid when shaken. Buildings can literally sink or tilt sideways into the soggy ground like toys in a bathtub!")
            }),

            // Warning Callout
            createCallout(
                "The Canterbury Tragedy (New Zealand 2010–2011)",
                [
                    "In September 2010, Christchurch was struck by a large magnitude Mw 7.1 rural earthquake. Miraculously, no one died. But in February 2011, a smaller Mw 6.3 aftershock struck incredibly close to the city centre at a shallow depth of 5 kilometres.",
                    "Because the ground was already weakened, the building damage was catastrophic. The CTV building collapsed, and severe liquefaction turned streets into rivers of grey silt. Sadly, 185 people lost their lives, proving that shallow aftershocks on unknown faults can be incredibly lethal."
                ],
                true
            ),
            new Paragraph({ spacing: { after: 280 } }),

            // Section 6: Conclusion
            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Conclusion: Engineering for Safety")] }),
            new Paragraph({
                spacing: { after: 180 },
                children: parseText("In conclusion, earthquakes are one of the most powerful and unpredictable forces on our planet. Driven by the slow conveyor belt of plate tectonics, stress builds up silently in the rocks beneath our feet until it snaps in a flash of kinetic energy.")
            }),
            new Paragraph({
                spacing: { after: 240 },
                children: parseText("Even though Australia sits safely in the middle of our plate, the massive compression of our tectonic journey means that intraplate earthquakes are a very real hazard. We cannot stop the Earth from moving, but through the brilliant work of seismologists and engineers, we can design stronger, flexible buildings that protect human lives. The trembling Earth will always keep shaking, but by learning the science, we can be ready!")
            }),

            // Glossary Section
            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Glossary of Key Terms")] }),
            
            new Paragraph({
                numbering: { reference: "bullet-list", level: 0 },
                spacing: { after: 100 },
                children: parseText("**Asthenosphere:** The upper layer of the Earth's mantle, below the lithosphere, where hot rock behaves like plastic plasticine.")
            }),
            new Paragraph({
                numbering: { reference: "bullet-list", level: 0 },
                spacing: { after: 100 },
                children: parseText("**Attenuation:** The way seismic waves lose energy and get weaker as they travel further away from the focus.")
            }),
            new Paragraph({
                numbering: { reference: "bullet-list", level: 0 },
                spacing: { after: 100 },
                children: parseText("**Epicentre:** The point on the Earth's surface directly above where an earthquake starts.")
            }),
            new Paragraph({
                numbering: { reference: "bullet-list", level: 0 },
                spacing: { after: 100 },
                children: parseText("**Fault:** A fracture or deep crack in the Earth's crust where blocks of rock slide past each other.")
            }),
            new Paragraph({
                numbering: { reference: "bullet-list", level: 0 },
                spacing: { after: 100 },
                children: parseText("**Hypocentre (Focus):** The starting point of an earthquake deep underground.")
            }),
            new Paragraph({
                numbering: { reference: "bullet-list", level: 0 },
                spacing: { after: 100 },
                children: parseText("**Intraplate Earthquake:** An earthquake that occurs inside a tectonic plate rather than along a boundary.")
            }),
            new Paragraph({
                numbering: { reference: "bullet-list", level: 0 },
                spacing: { after: 100 },
                children: parseText("**Liquefaction:** When shaking turns solid, wet soil into watery quicksand.")
            }),
            new Paragraph({
                numbering: { reference: "bullet-list", level: 0 },
                spacing: { after: 100 },
                children: parseText("**Seismologist:** A scientist who studies earthquakes and the internal structure of the Earth.")
            }),
            new Paragraph({
                numbering: { reference: "bullet-list", level: 0 },
                spacing: { after: 240 },
                children: parseText("**Subduction:** The process where a heavier tectonic plate is forced down under a lighter plate into the hot mantle.")
            }),

            // Bibliography Section
            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Author's Bibliography (My Sources)")] }),
            
            new Paragraph({
                numbering: { reference: "bibliography-list", level: 0 },
                spacing: { after: 120 },
                children: parseText("**Geoscience Australia Website** (Fact Sheets on the 1989 Newcastle Earthquake and Intraplate Seismicity).")
            }),
            new Paragraph({
                numbering: { reference: "bibliography-list", level: 0 },
                spacing: { after: 120 },
                children: parseText("**USGS (United States Geological Survey) Education Portal** (Seismic Wave Animations and Magnitude Explanations).")
            }),
            new Paragraph({
                numbering: { reference: "bibliography-list", level: 0 },
                spacing: { after: 120 },
                children: parseText("*\"The Trembling Earth: Volume IV\"* (Australian Severe Weather Archive Website - accessed May 2026).")
            }),
            new Paragraph({
                numbering: { reference: "bibliography-list", level: 0 },
                spacing: { after: 120 },
                children: parseText("**GNS Science New Zealand** (Reports on the Canterbury Earthquake Sequence and Liquefaction Hazards).")
            })
        ]
    }]
});

const outputPath = "c:\\Users\\dsuth\\Documents\\Joshua\\Units\\English\\English_Unit_2\\Student_Documents\\Earthquakes_Student_Exemplar.docx";

Packer.toBuffer(doc).then(buffer => {
    fs.writeFileSync(outputPath, buffer);
    console.log("Exemplar DOCX created successfully at: " + outputPath);
}).catch(err => {
    console.error("Error creating DOCX:", err);
    process.exit(1);
});
