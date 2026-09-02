const fs = require('fs');
const path = require('path');
const {
    Document,
    Packer,
    Paragraph,
    TextRun,
    Table,
    TableRow,
    TableCell,
    WidthType,
    AlignmentType,
    BorderStyle,
    Header,
    Footer,
    PageNumber
} = require('docx');

const PAGE_WIDTH = 11906;
const PAGE_HEIGHT = 16838;
const MARGIN = 1440;
const CONTENT_WIDTH = 9026;

const PRIMARY_COLOR = '1B365D'; // Deep Navy
const SECONDARY_COLOR = '2B6CB0'; // Science Blue
const ACCENT_BG = 'F0F4F8'; // Light slate background
const BORDER_COLOR = 'CBD5E0';
const DARK_TEXT = '2D3748';
const MODEL_BG = 'F7FAFC';

const thinBorder = {
    top: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
    bottom: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
    left: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
    right: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
};

const modelBoxBorder = {
    top: { style: BorderStyle.SINGLE, size: 8, color: SECONDARY_COLOR },
    bottom: { style: BorderStyle.SINGLE, size: 8, color: SECONDARY_COLOR },
    left: { style: BorderStyle.SINGLE, size: 8, color: SECONDARY_COLOR },
    right: { style: BorderStyle.SINGLE, size: 8, color: SECONDARY_COLOR },
};

function createHeaderBanner(title, subtitle) {
    return new Table({
        width: { size: CONTENT_WIDTH, type: WidthType.DXA },
        columnWidths: [CONTENT_WIDTH],
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        width: { size: CONTENT_WIDTH, type: WidthType.DXA },
                        shading: { fill: PRIMARY_COLOR },
                        margins: { top: 220, bottom: 220, left: 240, right: 240 },
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({
                                        text: title.toUpperCase(),
                                        bold: true,
                                        size: 24,
                                        color: 'FFFFFF',
                                        font: 'Arial'
                                    })
                                ]
                            }),
                            subtitle ? new Paragraph({
                                alignment: AlignmentType.CENTER,
                                spacing: { before: 60 },
                                children: [
                                    new TextRun({
                                        text: subtitle,
                                        size: 18,
                                        color: 'E2E8F0',
                                        font: 'Arial'
                                    })
                                ]
                            }) : new Paragraph({})
                        ]
                    })
                ]
            })
        ]
    });
}

function createSectionHeading(title) {
    return new Table({
        width: { size: CONTENT_WIDTH, type: WidthType.DXA },
        columnWidths: [CONTENT_WIDTH],
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        width: { size: CONTENT_WIDTH, type: WidthType.DXA },
                        shading: { fill: SECONDARY_COLOR },
                        margins: { top: 120, bottom: 120, left: 180, right: 180 },
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: title,
                                        bold: true,
                                        size: 22,
                                        color: 'FFFFFF',
                                        font: 'Arial'
                                    })
                                ]
                            })
                        ]
                    })
                ]
            })
        ]
    });
}

function createCircuitSubHeader(circuitNumber, circuitName, focusDescription) {
    return new Table({
        width: { size: CONTENT_WIDTH, type: WidthType.DXA },
        columnWidths: [1800, CONTENT_WIDTH - 1800],
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        width: { size: 1800, type: WidthType.DXA },
                        shading: { fill: PRIMARY_COLOR },
                        margins: { top: 100, bottom: 100, left: 140, right: 140 },
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({
                                        text: circuitNumber.toUpperCase(),
                                        bold: true,
                                        size: 18,
                                        color: 'FFFFFF',
                                        font: 'Arial'
                                    })
                                ]
                            })
                        ]
                    }),
                    new TableCell({
                        width: { size: CONTENT_WIDTH - 1800, type: WidthType.DXA },
                        shading: { fill: ACCENT_BG },
                        borders: thinBorder,
                        margins: { top: 100, bottom: 100, left: 160, right: 160 },
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: circuitName,
                                        bold: true,
                                        size: 19,
                                        color: PRIMARY_COLOR,
                                        font: 'Arial'
                                    }),
                                    new TextRun({
                                        text: ` — ${focusDescription}`,
                                        size: 17,
                                        color: '4A5568',
                                        italics: true,
                                        font: 'Arial'
                                    })
                                ]
                            })
                        ]
                    })
                ]
            })
        ]
    });
}

function createModelResponseBox(contentParagraphs) {
    return new Table({
        width: { size: CONTENT_WIDTH, type: WidthType.DXA },
        columnWidths: [CONTENT_WIDTH],
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        width: { size: CONTENT_WIDTH, type: WidthType.DXA },
                        borders: modelBoxBorder,
                        shading: { fill: MODEL_BG },
                        margins: { top: 140, bottom: 140, left: 200, right: 200 },
                        children: contentParagraphs
                    })
                ]
            })
        ]
    });
}

function p(text, options = {}) {
    return new Paragraph({
        spacing: { before: options.before || 60, after: options.after || 60 },
        alignment: options.align || AlignmentType.LEFT,
        children: [
            new TextRun({
                text: text,
                bold: options.bold || false,
                italics: options.italics || false,
                size: options.size || 20,
                font: 'Arial',
                color: options.color || DARK_TEXT
            })
        ]
    });
}

function bullet(text, options = {}) {
    return new Paragraph({
        spacing: { before: 30, after: 30 },
        indent: { left: 360, hanging: 220 },
        children: [
            new TextRun({ text: '•  ', bold: true, size: 20, font: 'Arial', color: SECONDARY_COLOR }),
            new TextRun({
                text: text,
                bold: options.bold || false,
                size: options.size || 20,
                font: 'Arial',
                color: options.color || DARK_TEXT
            })
        ]
    });
}

async function buildModelDocx() {
    const doc = new Document({
        styles: {
            default: {
                document: {
                    run: { font: 'Arial', size: 20, color: DARK_TEXT },
                    paragraph: { spacing: { before: 60, after: 60 } }
                }
            }
        },
        sections: [
            {
                properties: {
                    page: {
                        size: { width: PAGE_WIDTH, height: PAGE_HEIGHT },
                        margin: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN }
                    }
                },
                headers: {
                    default: new Header({
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.RIGHT,
                                children: [
                                    new TextRun({
                                        text: 'TEACHER MARKING GUIDE & MODEL RESPONSE | Year 5/6 Science — Energy & Electricity',
                                        size: 16,
                                        font: 'Arial',
                                        color: '718096'
                                    })
                                ]
                            })
                        ]
                    })
                },
                footers: {
                    default: new Footer({
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.RIGHT,
                                children: [
                                    new TextRun({ text: 'Page ', size: 16, font: 'Arial', color: '718096' }),
                                    new TextRun({ children: [PageNumber.CURRENT], size: 16, font: 'Arial', color: '718096' }),
                                    new TextRun({ text: ' of ', size: 16, font: 'Arial', color: '718096' }),
                                    new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, font: 'Arial', color: '718096' })
                                ]
                            })
                        ]
                    })
                },
                children: [
                    createHeaderBanner('Teacher Marking Guide & Exemplar Model Response', 'P–6 Curriculum Planning Model — Year 5/6 Science: Energy & Electricity (AC9S6U03)'),
                    p('', { after: 100 }),

                    createSectionHeading('Part A: Practical Circuit Construction & Analysis (Model Answers)'),
                    p('', { after: 60 }),

                    createCircuitSubHeader('Circuit 1', 'The Simple LED Light Circuit', 'Exemplar Model Responses'),
                    p('1. Circuit Representations Criteria:', { bold: true }),
                    createModelResponseBox([
                        p('• Breadboard Layout: Arduino 5V connected to positive rail (+), GND connected to negative rail (-). 220 Ω resistor wired in series from + rail to LED long anode (+). LED cathode (-) wired to GND rail.'),
                        p('• Schematic Diagram: Accurate standard scientific symbols for 5V DC Source, Resistor (220 Ω), and LED in a single closed loop.')
                    ]),
                    p('', { after: 40 }),
                    p('2. Scientific Analysis (Circuit 1):', { bold: true }),
                    createModelResponseBox([
                        p('a. Path Requirements: Electricity requires an unbroken, continuous conductive pathway from the positive voltage source (5V) through the load components and returning to ground (GND). This potential difference allows electrons to transfer energy. If either rail is disconnected, it forms an open circuit with zero current flow.'),
                        p('b. Energy Transformation: Electrical Energy  ----->  Light Energy (+ minor Thermal/Heat Energy)')
                    ]),

                    p('', { after: 140 }),
                    createCircuitSubHeader('Circuit 2', 'The Controlled / Switched Circuit', 'Exemplar Model Responses'),
                    p('1. Circuit Schematic Criteria:', { bold: true }),
                    createModelResponseBox([
                        p('• Schematic: Standard symbols showing 5V DC Source, an Open Switch symbol (lever tilted up away from contact), 220 Ω Resistor, and LED in series.')
                    ]),
                    p('', { after: 40 }),
                    p('2. Scientific Analysis (Circuit 2):', { bold: true }),
                    createModelResponseBox([
                        p('a. Open vs. Closed Circuits: When the switch is OPEN, there is an air gap (an electrical insulator) breaking the conducting loop. Electrical current cannot cross the gap, so current is 0 A and the LED remains dark. When the switch is CLOSED, the internal metal contacts complete the circuit, allowing current to flow and light up the LED.'),
                        p('b. Role of the Switch: A switch is a mechanical control component that allows the operator to selectively open or close the conducting pathway, safely starting or stopping energy transfer without needing to unplug wires.')
                    ]),

                    p('', { after: 140 }),
                    createCircuitSubHeader('Circuit 3', 'The Dual-Output Alarm Circuit', 'Exemplar Model Responses'),
                    p('1. Circuit Schematic Criteria:', { bold: true }),
                    createModelResponseBox([
                        p('• Schematic: Standard symbols showing 5V DC Source, Switch, and two output branches in parallel after the switch: Branch 1 with 220 Ω Resistor + LED, Branch 2 with Piezo Buzzer (+/- polarity indicated). Both branches return to common GND.')
                    ]),
                    p('', { after: 40 }),
                    p('2. Scientific Analysis (Circuit 3):', { bold: true }),
                    createModelResponseBox([
                        p('a. Multiple Energy Transformations:'),
                        p('   • Transformation 1 (LED): Electrical Energy  ----->  Light Energy'),
                        p('   • Transformation 2 (Buzzer): Electrical Energy  ----->  Sound Energy (Acoustic Vibrations)'),
                        p('b. Circuit Design Explanation: The circuit splits the electrical path after the switch into two parallel branches. Closing the switch provides current simultaneously to both the LED branch and the buzzer branch. Inside the LED, electrical energy excites semiconductor material to produce light; inside the piezo buzzer, electrical signals cause a ceramic disc to vibrate rapidly, producing audible sound waves. This creates simultaneous visual and audible alert signals.')
                    ]),

                    p('', { after: 180 }),
                    createSectionHeading('Part B: Energy Sources & Electricity Generation (Exemplar Answers)'),
                    p('', { after: 60 }),

                    p('Location 1: Tropical Island (Exemplar: Wind Energy or Solar PV)', { bold: true, color: PRIMARY_COLOR }),
                    createModelResponseBox([
                        p('• Chosen Source: Wind Energy (or Solar PV)'),
                        p('• Justification: Tropical islands experience reliable, strong coastal winds and sea breezes. Wind is a renewable energy source with zero greenhouse gas emissions during operation, avoiding the high cost and environmental risk of barging fossil fuels over fragile reef waters.'),
                        p('• Transformation Flow Diagram: Kinetic Energy (Wind)  --->  Mechanical Kinetic Energy (Turbine Rotation)  --->  Electrical Energy (Generator)'),
                        p('• Sequence Explanation: Uneven solar heating of Earth creates wind. The kinetic energy of moving air forces large aerodynamic turbine blades to spin. A driveshaft turns an internal electromagnetic generator where rotating magnets generate electrical current in copper coils.'),
                        p('• Advantages: 1. Inexhaustible, clean fuel with zero emissions. 2. Free ongoing fuel source.'),
                        p('• Disadvantages: 1. Intermittent (requires battery backup on calm days). 2. High initial installation costs and risk of cyclone damage.')
                    ]),

                    p('', { after: 120 }),
                    p('Location 2: Remote Desert Community (Exemplar: Solar Photovoltaic)', { bold: true, color: PRIMARY_COLOR }),
                    createModelResponseBox([
                        p('• Chosen Source: Solar Photovoltaic (PV) Energy'),
                        p('• Justification: Arid desert regions receive extremely high solar irradiance with minimal cloud cover throughout the year. Solar panels are solid-state, quiet, modular, and require no cooling water.'),
                        p('• Transformation Flow Diagram: Radiant / Light Energy (Sunlight)  --->  Electrical Energy (Semiconductor Solar Cells)'),
                        p('• Sequence Explanation: Photons of sunlight strike silicon semiconductor wafers. Light energy energises electrons, dislodging them from silicon atoms and creating a direct current (DC) flow through metallic contacts.'),
                        p('• Advantages: 1. Abundant, consistent sunlight in desert climates. 2. Low maintenance with no moving parts.'),
                        p('• Disadvantages: 1. Generates electricity only during daylight hours (requires battery storage for night). 2. Dust accumulation requires periodic cleaning.')
                    ]),

                    p('', { after: 120 }),
                    p('Application of Scientific Knowledge:', { bold: true, color: PRIMARY_COLOR }),
                    createModelResponseBox([
                        p('• Exemplar Response: Understanding energy transformations, resource availability, and environmental impacts allows show organisers to choose the most sustainable and cost-effective power generation technology for each location. It prevents wasteful fuel transportation, sizes battery storage correctly, and prevents pollution in delicate natural environments.')
                    ])
                ]
            }
        ]
    });

    const buffer = await Packer.toBuffer(doc);
    const outputPath = path.resolve(__dirname, 'Resources/Assessment/Sci_Y05_U3_AT_MR_Tinkercad_Arduino_Model_Response.docx');
    fs.writeFileSync(outputPath, buffer);
    console.log('Successfully generated Model Response DOCX:', outputPath);
}

buildModelDocx().catch(err => {
    console.error('Error generating model response docx:', err);
    process.exit(1);
});
