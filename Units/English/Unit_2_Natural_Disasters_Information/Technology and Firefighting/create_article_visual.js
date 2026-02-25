const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType,
    BorderStyle, WidthType, ShadingType, VerticalAlign, HeadingLevel, LevelFormat, ImageRun } = require('docx');
const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'assets');

// Helper to get image data safely
function getImage(filename) {
    const filePath = path.join(assetsDir, filename);
    if (!fs.existsSync(filePath)) {
        console.warn(`Warning: ${filename} not found at ${filePath}`);
        return null;
    }
    return fs.readFileSync(filePath);
}

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

            // Hero Image
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new ImageRun({
                    type: "png",
                    data: getImage('intro_hero.png'),
                    transformation: { width: 450, height: 450 },
                    altText: { title: "Command Center", description: "High-tech command center", name: "intro_hero" }
                })]
            }),

            new Paragraph({ children: [new TextRun("")] }),

            // Introduction
            new Paragraph({
                heading: HeadingLevel.HEADING_1,
                children: [new TextRun("The Future of Firefighting is Here")]
            }),

            new Paragraph({
                children: [new TextRun("We are currently witnessing a 'technological arms race' in fire services across the globe. As climate change increases the frequency and intensity of wildfires, traditional methods are being supplemented with cutting-edge innovations that were once the domain of science fiction. Imagine a drone soaring through thick black smoke, its thermal camera piercing through the darkness to locate trapped people while human firefighters wait for a safe entry window. Picture a robot rolling into a blazing chemical factory where the heat would melt standard protective gear, or satellites orbiting high above Earth, detecting wildfires when they're barely the size of a classroom. In 2024 and 2025, these systems are fundamentally changing the defensive landscape, making firefighters safer and response times faster than ever documented in history.")]
            }),

            new Paragraph({ children: [new TextRun("")] }),

            // Drones
            new Paragraph({
                heading: HeadingLevel.HEADING_1,
                children: [new TextRun("Eyes in the Sky: Firefighting Drones")]
            }),

            // Drone Image
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new ImageRun({
                    type: "png",
                    data: getImage('drone_action.png'),
                    transformation: { width: 450, height: 450 },
                    altText: { title: "Dragon Drone", description: "Dragon drone in action", name: "drone_action" }
                })]
            }),

            new Paragraph({
                children: [new TextRun("Modern drones are no longer just cameras; they are advanced sensor platforms capable of surviving extreme conditions. The Empa 'FireDrone,' for instance, is built with heat-resistant materials that allow it to operate in close proximity to active flames. These aircraft use a systematic four-step process: they launch into hazardous zones, identify hotspots through multi-spectral thermal imaging, locate victims via high-definition sensors, and transmit live data to incident commanders. Beyond surveillance, 'Prop-Wash' drones are now being used to create survivable air pockets for trapped victims by using their rotors to manually disperse toxic fumes. Tethered variants are even appearing that can carry 100-kilogram payloads to the top of high-rise buildings, providing a continuous line of equipment or water that isn't limited by battery life.")]
            }),

            new Paragraph({ children: [new TextRun("")] }),

            new Paragraph({
                heading: HeadingLevel.HEADING_2,
                children: [new TextRun("Types of Firefighting Drones")]
            }),

            new Paragraph({
                numbering: { reference: "drone-types", level: 0 },
                children: [new TextRun({ text: "Tethered Firefighting Drones", bold: true }), new TextRun(" - Ideal for high-rise buildings, they have a constant power source and can stay airborne for days.")]
            }),
            new Paragraph({
                numbering: { reference: "drone-types", level: 0 },
                children: [new TextRun({ text: "Search and Rescue Drones", bold: true }), new TextRun(" - Equipped with AI to detect human heat signatures even through thick concrete or timber debris.")]
            }),
            new Paragraph({
                numbering: { reference: "drone-types", level: 0 },
                children: [new TextRun({ text: "Prop-Wash Drones", bold: true }), new TextRun(" - Specialized rotors used to 'blow away' smoke and toxic gases from room exits.")]
            }),

            new Paragraph({ children: [new TextRun("")] }),

            // AI
            new Paragraph({
                heading: HeadingLevel.HEADING_1,
                children: [new TextRun("Artificial Intelligence: The Predictive Edge")]
            }),

            // AI Image
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new ImageRun({
                    type: "png",
                    data: getImage('ai_grid.png'),
                    transformation: { width: 450, height: 450 },
                    altText: { title: "AI Grid", description: "AI predictive modeling", name: "ai_grid" }
                })]
            }),

            new Paragraph({
                children: [new TextRun("Artificial Intelligence (AI) has emerged as a cornerstone of modern firefighting, acting as an 'algorithmic early warning system.' By processing vast amounts of environmental data in real-time—including temperature fluctuations, humidity levels, wind speed, and fuel moisture—AI models like Louisiana State University's DeepFire can predict fire behaviour with staggering 90% accuracy. These systems don't just wait for smoke to appear; they analyze historical fire patterns and current vegetation states to identify high-risk zones before a single spark is ignited. This allows fire services to take 'proactive response' measures, such as pre-positioning water tankers and alert crews in areas identified as 'high potential' for outbreaks, which fundamentally shifts firefighting from a reactive service to a predictive one.")]
            }),

            new Paragraph({ children: [new TextRun("")] }),

            // Satellites
            new Paragraph({
                heading: HeadingLevel.HEADING_1,
                children: [new TextRun("Space-Based Surveillance: The Global Eye")]
            }),

            // Satellite Image
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new ImageRun({
                    type: "png",
                    data: getImage('satellite_orbit.png'),
                    transformation: { width: 450, height: 450 },
                    altText: { title: "Satellite", description: "Satellite monitoring fires", name: "satellite_orbit" }
                })]
            }),

            new Paragraph({
                children: [new TextRun("High above the atmosphere, constellations of small satellites are providing a 'macro' view of our planet's fire activity. Google's FireSat project and the FireSat Constellation utilize multispectral thermal infrared imaging to detect fires from space that are as small as 5x5 metres. This high resolution represents a significant upgrade over older weather satellites that could only spot massive blazes. These new constellations aim for a 'refresh rate' of as little as 9 minutes in high-risk regions like California, meaning fire services are alerted to new ignitions in remote wilderness areas almost instantly, long before they can grow into uncontrollable mega-fires.")]
            }),

            new Paragraph({ children: [new TextRun("")] }),

            // Robots
            new Paragraph({
                heading: HeadingLevel.HEADING_1,
                children: [new TextRun("Robots in the Red Zone")]
            }),

            // Robot Image
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new ImageRun({
                    type: "png",
                    data: getImage('robot_industrial.png'),
                    transformation: { width: 450, height: 450 },
                    altText: { title: "Robot", description: "Firefighting robot", name: "robot_industrial" }
                })]
            }),

            new Paragraph({
                children: [new TextRun("In the most hazardous environments, such as chemical plant explosions or collapsing industrial warehouses, ground-based robots are the new front line. The Wolf R1 is a rugged, tracked vehicle capable of pulling heavy water hoses and traversing debris that would be impossible for wheeled vehicles or humans. Meanwhile, humanoid robots like Virginia Tech's THOR are being developed to navigate human architecture—climbing stairs, opening doors, and turning valves in environments filled with toxic gases. These robots use LIDAR (Laser Imaging, Detection, and Ranging) to create 3D maps of their surroundings, allowing them to operate even when thick smoke makes traditional cameras useless.")]
            }),

            new Paragraph({ children: [new TextRun("")] }),

            // IoT
            new Paragraph({
                heading: HeadingLevel.HEADING_1,
                children: [new TextRun("Connected Safety: The Internet of Things")]
            }),

            // IoT Image
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new ImageRun({
                    type: "png",
                    data: getImage('iot_hud.png'),
                    transformation: { width: 450, height: 450 },
                    altText: { title: "IoT HUD", description: "Firefighter AR interface", name: "iot_hud" }
                })]
            }),

            new Paragraph({
                children: [new TextRun("The 'Internet of Things' (IoT) has turned the firefighter's gear into a smart, connected ecosystem. Wearable sensors inside turnout gear now monitor everything from heart rate and body temperature to the presence of lethal gases like carbon monoxide. Using LoRaWAN (Long Range Wide Area Network) and RFID tracking, an incident commander can see the exact location and physical status of every firefighter in a burning building on a tactical dashboard. If a sensor detects a sudden heat spike or a lack of movement, it can automatically trigger a distress signal, ensuring that rescue teams are dispatched the second a human teammate is in trouble.")]
            }),

            new Paragraph({ children: [new TextRun("")] }),

            // Conclusion
            new Paragraph({
                heading: HeadingLevel.HEADING_1,
                children: [new TextRun("Human-Tech Collaboration")]
            }),

            // Conclusion Image
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new ImageRun({
                    type: "png",
                    data: getImage('conclusion_collab.png'),
                    transformation: { width: 450, height: 450 },
                    altText: { title: "Collaboration", description: "Humans and tech working together", name: "conclusion_collab" }
                })]
            }),

            new Paragraph({
                children: [new TextRun("Ultimately, these innovations don't replace the firefighter; they redefine the role. The modern firefighter is evolving from a manual laborer into a tactical technology specialist who coordinates fleets of drones and robots. This partnership allows technology to handle the '3 Ds'—tasks that are too Dull, Dirty, or Dangerous—permitting the human element to focus on leadership, complex decision-making, and compassion. As AI, space-based surveillance, and robotics continue to mature, we are moving toward a future where every blaze is detected instantly, every firefighter is tracked safely, and the devastating impact of fire on our communities is drastically reduced.")]
            }),

            new Paragraph({ children: [new TextRun("")] }),

            new Paragraph({
                children: [new TextRun("The future of firefighting isn't human "), new TextRun({ text: "or", italics: true }), new TextRun(" technology—it's human "), new TextRun({ text: "and", italics: true, bold: true }), new TextRun(" technology working together. And that future is already here.")]
            })
        ]
    }]
});

Packer.toBuffer(doc).then(buffer => {
    const outputPath = path.join(__dirname, 'Fighting_Fires_with_Technology_Visual.docx');
    fs.writeFileSync(outputPath, buffer);
    console.log(`Document created successfully at: ${outputPath}`);
});
