const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType,
    BorderStyle, WidthType, ShadingType, VerticalAlign, HeadingLevel, LevelFormat } = require('docx');
const fs = require('fs');

const doc = new Document({
    styles: {
        default: { document: { run: { font: "Arial", size: 24 } } },
        paragraphStyles: [
            {
                id: "Title", name: "Title", basedOn: "Normal",
                run: { size: 56, bold: true, color: "0A84FF", font: "Arial" },
                paragraph: { spacing: { before: 240, after: 240 }, alignment: AlignmentType.CENTER }
            },
            {
                id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
                run: { size: 36, bold: true, color: "1C1C1E", font: "Arial" },
                paragraph: { spacing: { before: 300, after: 200 }, outlineLevel: 0 }
            },
            {
                id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
                run: { size: 28, bold: true, color: "0A84FF", font: "Arial" },
                paragraph: { spacing: { before: 240, after: 160 }, outlineLevel: 1 }
            },
            {
                id: "sectionIntro", name: "Section Intro", basedOn: "Normal",
                run: { size: 24, italics: true, color: "FF9500" },
                paragraph: { spacing: { after: 180 }, alignment: AlignmentType.LEFT }
            },
            {
                id: "highlight", name: "Highlight Box", basedOn: "Normal",
                run: { size: 24, bold: true, color: "30D158" },
                paragraph: { spacing: { before: 200, after: 200 }, alignment: AlignmentType.CENTER }
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
                reference: "drone-types",
                levels: [{
                    level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
                    style: { paragraph: { indent: { left: 720, hanging: 360 } } }
                }]
            }
        ]
    },
    sections: [{
        properties: {
            page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
        },
        children: [
            // Title
            new Paragraph({
                heading: HeadingLevel.TITLE,
                children: [new TextRun("Fighting Fires with Technology")]
            }),

            new Paragraph({
                style: "sectionIntro",
                children: [new TextRun("How artificial intelligence, drones, robots, and satellites are revolutionising firefighting")]
            }),

            new Paragraph({ children: [new TextRun("")] }),

            // Introduction - Descriptive Text Structure
            new Paragraph({
                heading: HeadingLevel.HEADING_1,
                children: [new TextRun("The Future of Firefighting is Here")]
            }),

            new Paragraph({
                children: [new TextRun("Imagine a drone soaring through thick black smoke, its thermal camera piercing through the darkness to locate trapped people. Picture a robot rolling into a blazing chemical factory where no human could safely enter. Envision satellites orbiting high above Earth, detecting wildfires when they're barely the size of a classroom.")]
            }),

            new Paragraph({
                children: [new TextRun("This isn't science fiction—it's the cutting-edge reality of modern firefighting. In 2024 and 2025, technology is transforming how fires are detected, monitored, and fought, making firefighters safer and response times faster than ever before.")]
            }),

            new Paragraph({ children: [new TextRun("")] }),

            // Section 1: Drones - Sequential/Process Text Structure
            new Paragraph({
                heading: HeadingLevel.HEADING_1,
                children: [new TextRun("Eyes in the Sky: Firefighting Drones")]
            }),

            new Paragraph({
                heading: HeadingLevel.HEADING_2,
                children: [new TextRun("The Dragon Drone")]
            }),

            new Paragraph({
                children: [new TextRun("One of the most remarkable innovations is the 'dragon drone,' already in use by the Tokyo Fire Department. This robotic flying system works through a systematic process:")]
            }),

            new Paragraph({
                numbering: { reference: "numbered-list", level: 0 },
                children: [new TextRun("First, the drone launches and flies into smoke-filled areas too dangerous for firefighters.")]
            }),

            new Paragraph({
                numbering: { reference: "numbered-list", level: 0 },
                children: [new TextRun("Next, its thermal imaging camera detects heat sources and identifies hotspots.")]
            }),

            new Paragraph({
                numbering: { reference: "numbered-list", level: 0 },
                children: [new TextRun("Then, advanced sensors scan the environment to locate trapped victims.")]
            }),

            new Paragraph({
                numbering: { reference: "numbered-list", level: 0 },
                children: [new TextRun("Finally, it transmits all this critical data in real-time to incident commanders outside.")]
            }),

            new Paragraph({
                children: [new TextRun("This systematic approach significantly reduces risk to human firefighters whilst improving response times.")]
            }),

            new Paragraph({ children: [new TextRun("")] }),

            new Paragraph({
                heading: HeadingLevel.HEADING_2,
                children: [new TextRun("Types of Firefighting Drones")]
            }),

            new Paragraph({
                children: [new TextRun("Different fire emergencies require different drone technologies:")]
            }),

            new Paragraph({
                numbering: { reference: "drone-types", level: 0 },
                children: [new TextRun({ text: "Tethered Firefighting Drones", bold: true }), new TextRun(" can carry 100 kilograms of water or equipment up to 100 metres high—perfect for high-rise building fires.")]
            }),

            new Paragraph({
                numbering: { reference: "drone-types", level: 0 },
                children: [new TextRun({ text: "Search and Rescue Drones", bold: true }), new TextRun(" use AI-powered cameras to detect humans through thick smoke and can even identify toxic chemicals.")]
            }),

            new Paragraph({
                numbering: { reference: "drone-types", level: 0 },
                children: [new TextRun({ text: "Prop-Wash Drones", bold: true }), new TextRun(" use their powerful rotors to blow away toxic fumes and create breathable air pockets for trapped victims.")]
            }),

            new Paragraph({
                numbering: { reference: "drone-types", level: 0 },
                children: [new TextRun({ text: "Drone Swarms", bold: true }), new TextRun(" work together like a team, coordinating search patterns and creating detailed 3D maps of fire zones.")]
            }),

            new Paragraph({ children: [new TextRun("")] }),

            // Section 2: AI - Cause and Effect Text Structure
            new Paragraph({
                heading: HeadingLevel.HEADING_1,
                children: [new TextRun("Artificial Intelligence: Predicting Fires Before They Spread")]
            }),

            new Paragraph({
                children: [new TextRun("Artificial intelligence is dramatically changing fire response through cause-and-effect relationships:")]
            }),

            new Paragraph({
                children: [new TextRun({ text: "Cause: ", bold: true }), new TextRun("AI systems analyse environmental data like temperature, humidity, and wind patterns.")]
            }),

            new Paragraph({
                children: [new TextRun({ text: "Effect: ", bold: true }), new TextRun("Fires can be detected much faster—sometimes even before smoke becomes visible.")]
            }),

            new Paragraph({ children: [new TextRun("")] }),

            new Paragraph({
                children: [new TextRun({ text: "Cause: ", bold: true }), new TextRun("LSU's DeepFire system studies historical fire data, weather conditions, and vegetation types.")]
            }),

            new Paragraph({
                children: [new TextRun({ text: "Effect: ", bold: true }), new TextRun("It can predict where wildfires will occur with 90% accuracy, allowing firefighters to position resources before fires even start.")]
            }),

            new Paragraph({ children: [new TextRun("")] }),

            new Paragraph({
                children: [new TextRun({ text: "Cause: ", bold: true }), new TextRun("The London Fire Brigade analyses years of incident data using AI.")]
            }),

            new Paragraph({
                children: [new TextRun({ text: "Effect: ", bold: true }), new TextRun("They can target fire prevention efforts to the highest-risk areas, saving both lives and resources.")]
            }),

            new Paragraph({ children: [new TextRun("")] }),

            new Paragraph({
                style: "highlight",
                children: [new TextRun("AI doesn't just react to fires—it predicts them!")]
            }),

            new Paragraph({ children: [new TextRun("")] }),

            // Section 3: Satellites - Comparison Text Structure with Table
            new Paragraph({
                heading: HeadingLevel.HEADING_1,
                children: [new TextRun("Space-Based Fire Watching: Satellite Technology")]
            }),

            new Paragraph({
                children: [new TextRun("Two major satellite systems are competing to provide the best wildfire detection from space:")]
            }),

            new Table({
                columnWidths: [4680, 4680],
                margins: { top: 100, bottom: 100, left: 180, right: 180 },
                rows: [
                    new TableRow({
                        tableHeader: true,
                        children: [
                            new TableCell({
                                borders: {
                                    top: { style: BorderStyle.SINGLE, size: 1, color: "0A84FF" },
                                    bottom: { style: BorderStyle.SINGLE, size: 1, color: "0A84FF" },
                                    left: { style: BorderStyle.SINGLE, size: 1, color: "0A84FF" },
                                    right: { style: BorderStyle.SINGLE, size: 1, color: "0A84FF" }
                                },
                                width: { size: 4680, type: WidthType.DXA },
                                shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                                verticalAlign: VerticalAlign.CENTER,
                                children: [new Paragraph({
                                    alignment: AlignmentType.CENTER,
                                    children: [new TextRun({ text: "FireSat Constellation", bold: true, size: 22 })]
                                })]
                            }),
                            new TableCell({
                                borders: {
                                    top: { style: BorderStyle.SINGLE, size: 1, color: "0A84FF" },
                                    bottom: { style: BorderStyle.SINGLE, size: 1, color: "0A84FF" },
                                    left: { style: BorderStyle.SINGLE, size: 1, color: "0A84FF" },
                                    right: { style: BorderStyle.SINGLE, size: 1, color: "0A84FF" }
                                },
                                width: { size: 4680, type: WidthType.DXA },
                                shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                                verticalAlign: VerticalAlign.CENTER,
                                children: [new Paragraph({
                                    alignment: AlignmentType.CENTER,
                                    children: [new TextRun({ text: "Google's FireSat Project", bold: true, size: 22 })]
                                })]
                            })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({
                                borders: {
                                    top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
                                    bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
                                    left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
                                    right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }
                                },
                                width: { size: 4680, type: WidthType.DXA },
                                children: [
                                    new Paragraph({
                                        numbering: { reference: "bullet-list", level: 0 },
                                        children: [new TextRun("52 satellites planned")]
                                    }),
                                    new Paragraph({
                                        numbering: { reference: "bullet-list", level: 0 },
                                        children: [new TextRun("Updates every 20 minutes globally")]
                                    }),
                                    new Paragraph({
                                        numbering: { reference: "bullet-list", level: 0 },
                                        children: [new TextRun("Every 9 minutes in high-risk areas")]
                                    }),
                                    new Paragraph({
                                        numbering: { reference: "bullet-list", level: 0 },
                                        children: [new TextRun("Uses thermal infrared imaging")]
                                    })
                                ]
                            }),
                            new TableCell({
                                borders: {
                                    top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
                                    bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
                                    left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
                                    right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }
                                },
                                width: { size: 4680, type: WidthType.DXA },
                                children: [
                                    new Paragraph({
                                        numbering: { reference: "bullet-list", level: 0 },
                                        children: [new TextRun("Constellation of satellites")]
                                    }),
                                    new Paragraph({
                                        numbering: { reference: "bullet-list", level: 0 },
                                        children: [new TextRun("Near real-time detection")]
                                    }),
                                    new Paragraph({
                                        numbering: { reference: "bullet-list", level: 0 },
                                        children: [new TextRun("Spots fires as small as 5×5 metres")]
                                    }),
                                    new Paragraph({
                                        numbering: { reference: "bullet-list", level: 0 },
                                        children: [new TextRun("Global coverage")]
                                    })
                                ]
                            })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({
                                borders: {
                                    top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
                                    bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
                                    left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
                                    right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }
                                },
                                width: { size: 4680, type: WidthType.DXA },
                                shading: { fill: "FFF4E6", type: ShadingType.CLEAR },
                                children: [new Paragraph({
                                    children: [new TextRun({ text: "Best for: ", bold: true }), new TextRun("Frequent monitoring of known high-risk regions")]
                                })]
                            }),
                            new TableCell({
                                borders: {
                                    top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
                                    bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
                                    left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
                                    right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }
                                },
                                width: { size: 4680, type: WidthType.DXA },
                                shading: { fill: "FFF4E6", type: ShadingType.CLEAR },
                                children: [new Paragraph({
                                    children: [new TextRun({ text: "Best for: ", bold: true }), new TextRun("Detecting very small fires anywhere on Earth")]
                                })]
                            })
                        ]
                    })
                ]
            }),

            new Paragraph({ children: [new TextRun("")] }),

            // Section 4: Robots - Problem and Solution Text Structure
            new Paragraph({
                heading: HeadingLevel.HEADING_1,
                children: [new TextRun("Robots: Tackling Fires Too Dangerous for Humans")]
            }),

            new Paragraph({
                children: [new TextRun({ text: "Problem:", bold: true, color: "FF9500" })]
            }),

            new Paragraph({
                children: [new TextRun("Some fires are simply too hazardous for human firefighters—chemical plant explosions, nuclear facility fires, collapsing buildings, and industrial blazes with toxic fumes.")]
            }),

            new Paragraph({ children: [new TextRun("")] }),

            new Paragraph({
                children: [new TextRun({ text: "Solution:", bold: true, color: "30D158" })]
            }),

            new Paragraph({
                children: [new TextRun("Robotic firefighters that can enter these deadly environments equipped with:")]
            }),

            new Paragraph({
                numbering: { reference: "bullet-list", level: 0 },
                children: [new TextRun("Infrared cameras and thermal imaging to see through smoke")]
            }),

            new Paragraph({
                numbering: { reference: "bullet-list", level: 0 },
                children: [new TextRun("Gas detectors to identify toxic chemicals")]
            }),

            new Paragraph({
                numbering: { reference: "bullet-list", level: 0 },
                children: [new TextRun("LIDAR systems for 3D mapping of their surroundings")]
            }),

            new Paragraph({
                numbering: { reference: "bullet-list", level: 0 },
                children: [new TextRun("Heavy-duty water hoses delivering thousands of litres per minute")]
            }),

            new Paragraph({ children: [new TextRun("")] }),

            new Paragraph({
                children: [new TextRun("The Wolf R1 robot can traverse rough terrain, pull massive water hoses, and operate in extreme heat. Unifire's FlameRanger system can detect, locate, and suppress a fire in under 15 seconds—completely autonomously!")]
            }),

            new Paragraph({ children: [new TextRun("")] }),

            new Paragraph({
                children: [new TextRun("Even humanoid robots like Virginia Tech's THOR are being developed to perform human-like tasks such as opening doors, operating valves, and wielding fire hoses in burning buildings.")]
            }),

            new Paragraph({ children: [new TextRun("")] }),

            // Section 5: IoT - Descriptive/Features Text Structure
            new Paragraph({
                heading: HeadingLevel.HEADING_1,
                children: [new TextRun("The Internet of Things: A Network of Watchful Sensors")]
            }),

            new Paragraph({
                children: [new TextRun("The Internet of Things (IoT) refers to everyday devices connected to the internet that can communicate with each other. In firefighting, IoT creates a protective web of intelligent sensors that constantly monitor for danger.")]
            }),

            new Paragraph({ children: [new TextRun("")] }),

            new Paragraph({
                heading: HeadingLevel.HEADING_2,
                children: [new TextRun("IoT Temperature Sensors")]
            }),

            new Paragraph({
                children: [new TextRun("These remarkable devices detect fires "), new TextRun({ text: "before smoke even appears", italics: true }), new TextRun("—much faster than traditional smoke alarms. When they sense dangerous temperatures, they can automatically shut off ignition sources like stoves or heaters.")]
            }),

            new Paragraph({ children: [new TextRun("")] }),

            new Paragraph({
                heading: HeadingLevel.HEADING_2,
                children: [new TextRun("Firefighter Wearables")]
            }),

            new Paragraph({
                children: [new TextRun("Modern firefighters wear IoT sensors that continuously monitor:")]
            }),

            new Paragraph({
                numbering: { reference: "bullet-list", level: 0 },
                children: [new TextRun("Heart rate and body temperature")]
            }),

            new Paragraph({
                numbering: { reference: "bullet-list", level: 0 },
                children: [new TextRun("Dangerous gas levels like carbon monoxide")]
            }),

            new Paragraph({
                numbering: { reference: "bullet-list", level: 0 },
                children: [new TextRun("Visual signs of fatigue or heat stress")]
            }),

            new Paragraph({
                numbering: { reference: "bullet-list", level: 0 },
                children: [new TextRun("Exact location inside buildings using RFID tracking")]
            }),

            new Paragraph({ children: [new TextRun("")] }),

            new Paragraph({
                children: [new TextRun("This means incident commanders outside can monitor every firefighter's safety in real-time, dispatching help the instant someone is in trouble.")]
            }),

            new Paragraph({ children: [new TextRun("")] }),

            // Conclusion - Persuasive Text Structure
            new Paragraph({
                heading: HeadingLevel.HEADING_1,
                children: [new TextRun("The Partnership Between Humans and Technology")]
            }),

            new Paragraph({
                children: [new TextRun("Whilst technology is transforming firefighting, it doesn't replace human firefighters—it enhances their capabilities. Drones provide the eyes to see through smoke. AI offers the intelligence to predict where fires will strike. Satellites deliver the bird's-eye view of massive wildfires. Robots handle the most dangerous tasks. IoT sensors create an early warning network.")]
            }),

            new Paragraph({ children: [new TextRun("")] }),

            new Paragraph({
                children: [new TextRun("But behind every technological system stands a human firefighter making critical decisions, showing courage, and demonstrating compassion. Technology handles the dangerous, repetitive, and data-intensive work, freeing firefighters to do what they do best—save lives.")]
            }),

            new Paragraph({ children: [new TextRun("")] }),

            new Paragraph({
                children: [new TextRun("The future of firefighting isn't human "), new TextRun({ text: "or", italics: true }), new TextRun(" technology—it's human "), new TextRun({ text: "and", italics: true, bold: true }), new TextRun(" technology working together. And that future is already here.")]
            })
        ]
    }]
});

Packer.toBuffer(doc).then(buffer => {
    fs.writeFileSync("c:\\Users\\dsuth\\Documents\\Joshua\\Units\\English\\Unit_1_Natural_Disasters_Information\\Technology and Firefighting\\Fighting_Fires_with_Technology.docx", buffer);
    console.log("Student article created successfully!");
});
