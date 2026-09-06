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
    HeadingLevel,
    Header,
    Footer,
    PageNumber,
    NumberFormat
} = require('docx');

// Dimensions & Constants (A4: 11906 x 16838 dxa, Margins: 1440 dxa / 1 inch, Printable Width: 9026 dxa)
const PAGE_WIDTH = 11906;
const PAGE_HEIGHT = 16838;
const MARGIN = 1440;
const CONTENT_WIDTH = 9026;

// Color Palette
const PRIMARY_COLOR = '1B365D'; // Deep Navy
const SECONDARY_COLOR = '2B6CB0'; // Science Blue
const ACCENT_BG = 'F0F4F8'; // Light slate/blue background
const BORDER_COLOR = 'CBD5E0'; // Crisp border grey
const DARK_TEXT = '2D3748';
const LIGHT_BG = 'FAFAFA';

const thinBorder = {
    top: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
    bottom: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
    left: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
    right: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
};

const boxBorder = {
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
                                        size: 24, // 12pt
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
                                        size: 18, // 9pt
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

function createSectionHeading(title, subtitle = '') {
    const children = [
        new Paragraph({
            children: [
                new TextRun({
                    text: title,
                    bold: true,
                    size: 22, // 11pt
                    color: 'FFFFFF',
                    font: 'Arial'
                })
            ]
        })
    ];
    if (subtitle) {
        children.push(new Paragraph({
            spacing: { before: 40 },
            children: [
                new TextRun({
                    text: subtitle,
                    size: 16,
                    color: 'E2E8F0',
                    italics: true,
                    font: 'Arial'
                })
            ]
        }));
    }
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
                        children: children
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

function createResponseBox(heightLines, placeholderText = '') {
    const children = [];
    if (placeholderText) {
        children.push(new Paragraph({
            children: [
                new TextRun({
                    text: placeholderText,
                    italics: true,
                    size: 18,
                    color: 'A0AEC0',
                    font: 'Arial'
                })
            ]
        }));
    }
    for (let i = 0; i < heightLines; i++) {
        children.push(new Paragraph({
            spacing: { before: 80, after: 80 },
            children: [new TextRun({ text: ' ', size: 20 })]
        }));
    }
    return new Table({
        width: { size: CONTENT_WIDTH, type: WidthType.DXA },
        columnWidths: [CONTENT_WIDTH],
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        width: { size: CONTENT_WIDTH, type: WidthType.DXA },
                        borders: boxBorder,
                        shading: { fill: LIGHT_BG },
                        margins: { top: 160, bottom: 160, left: 220, right: 220 },
                        children: children
                    })
                ]
            })
        ]
    });
}

function createDualDiagramBoxes(label1, sub1, label2, sub2) {
    const colWidth = Math.floor(CONTENT_WIDTH / 2) - 60;
    const spacerWidth = 120;
    return new Table({
        width: { size: CONTENT_WIDTH, type: WidthType.DXA },
        columnWidths: [colWidth, spacerWidth, colWidth],
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        width: { size: colWidth, type: WidthType.DXA },
                        shading: { fill: ACCENT_BG },
                        borders: thinBorder,
                        margins: { top: 100, bottom: 100, left: 140, right: 140 },
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({ text: label1, bold: true, size: 19, font: 'Arial', color: PRIMARY_COLOR }),
                                ]
                            }),
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({ text: sub1, size: 16, italics: true, font: 'Arial', color: '718096' })
                                ]
                            })
                        ]
                    }),
                    new TableCell({
                        width: { size: spacerWidth, type: WidthType.DXA },
                        children: [new Paragraph({})]
                    }),
                    new TableCell({
                        width: { size: colWidth, type: WidthType.DXA },
                        shading: { fill: ACCENT_BG },
                        borders: thinBorder,
                        margins: { top: 100, bottom: 100, left: 140, right: 140 },
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({ text: label2, bold: true, size: 19, font: 'Arial', color: PRIMARY_COLOR })
                                ]
                            }),
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({ text: sub2, size: 16, italics: true, font: 'Arial', color: '718096' })
                                ]
                            })
                        ]
                    })
                ]
            }),
            new TableRow({
                children: [
                    new TableCell({
                        width: { size: colWidth, type: WidthType.DXA },
                        borders: boxBorder,
                        shading: { fill: LIGHT_BG },
                        margins: { top: 160, bottom: 160, left: 160, right: 160 },
                        children: [
                            new Paragraph({ spacing: { before: 140, after: 140 }, children: [new TextRun({ text: ' ', size: 20 })] }),
                            new Paragraph({ spacing: { before: 140, after: 140 }, children: [new TextRun({ text: ' ', size: 20 })] }),
                            new Paragraph({ spacing: { before: 140, after: 140 }, children: [new TextRun({ text: ' ', size: 20 })] }),
                            new Paragraph({ spacing: { before: 140, after: 140 }, children: [new TextRun({ text: ' ', size: 20 })] }),
                            new Paragraph({ spacing: { before: 140, after: 140 }, children: [new TextRun({ text: ' ', size: 20 })] })
                        ]
                    }),
                    new TableCell({
                        width: { size: spacerWidth, type: WidthType.DXA },
                        children: [new Paragraph({})]
                    }),
                    new TableCell({
                        width: { size: colWidth, type: WidthType.DXA },
                        borders: boxBorder,
                        shading: { fill: LIGHT_BG },
                        margins: { top: 160, bottom: 160, left: 160, right: 160 },
                        children: [
                            new Paragraph({ spacing: { before: 140, after: 140 }, children: [new TextRun({ text: ' ', size: 20 })] }),
                            new Paragraph({ spacing: { before: 140, after: 140 }, children: [new TextRun({ text: ' ', size: 20 })] }),
                            new Paragraph({ spacing: { before: 140, after: 140 }, children: [new TextRun({ text: ' ', size: 20 })] }),
                            new Paragraph({ spacing: { before: 140, after: 140 }, children: [new TextRun({ text: ' ', size: 20 })] }),
                            new Paragraph({ spacing: { before: 140, after: 140 }, children: [new TextRun({ text: ' ', size: 20 })] })
                        ]
                    })
                ]
            })
        ]
    });
}

function createSingleDiagramBox(headerLabel, subLabel, heightLines = 6) {
    const children = [];
    for (let i = 0; i < heightLines; i++) {
        children.push(new Paragraph({
            spacing: { before: 140, after: 140 },
            children: [new TextRun({ text: ' ', size: 20 })]
        }));
    }
    return new Table({
        width: { size: CONTENT_WIDTH, type: WidthType.DXA },
        columnWidths: [CONTENT_WIDTH],
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        width: { size: CONTENT_WIDTH, type: WidthType.DXA },
                        shading: { fill: ACCENT_BG },
                        borders: thinBorder,
                        margins: { top: 100, bottom: 100, left: 160, right: 160 },
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({ text: headerLabel, bold: true, size: 19, font: 'Arial', color: PRIMARY_COLOR })
                                ]
                            }),
                            subLabel ? new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({ text: subLabel, size: 16, italics: true, font: 'Arial', color: '718096' })
                                ]
                            }) : new Paragraph({})
                        ]
                    })
                ]
            }),
            new TableRow({
                children: [
                    new TableCell({
                        width: { size: CONTENT_WIDTH, type: WidthType.DXA },
                        borders: boxBorder,
                        shading: { fill: LIGHT_BG },
                        margins: { top: 160, bottom: 160, left: 180, right: 180 },
                        children: children
                    })
                ]
            })
        ]
    });
}

function p(text, options = {}) {
    return new Paragraph({
        spacing: { before: options.before || 70, after: options.after || 70 },
        alignment: options.align || AlignmentType.LEFT,
        children: [
            new TextRun({
                text: text,
                bold: options.bold || false,
                italics: options.italics || false,
                size: options.size || 20, // 10pt default
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

async function buildDocx() {
    const doc = new Document({
        styles: {
            default: {
                document: {
                    run: { font: 'Arial', size: 20, color: DARK_TEXT },
                    paragraph: { spacing: { before: 70, after: 70 } }
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
                                        text: 'P–6 Curriculum Planning Model | Year 5/6 Science — Energy & Electricity Assessment',
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
                    // Header Banner
                    createHeaderBanner('P–6 Curriculum Planning Model — Science Assessment', 'Adjusted for Year 5 (A CYCLE – Unit 3) | Based on Year 6 Science: Energy & Electricity (AC9S6U03)'),
                    p('', { after: 100 }),

                    // Student Details Table
                    new Table({
                        width: { size: CONTENT_WIDTH, type: WidthType.DXA },
                        columnWidths: [1400, 3113, 1400, 3113],
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell({ width: { size: 1400, type: WidthType.DXA }, shading: { fill: ACCENT_BG }, borders: thinBorder, children: [p('Student Name:', { bold: true })] }),
                                    new TableCell({ width: { size: 3113, type: WidthType.DXA }, borders: thinBorder, children: [p(' ')] }),
                                    new TableCell({ width: { size: 1400, type: WidthType.DXA }, shading: { fill: ACCENT_BG }, borders: thinBorder, children: [p('Class / Cohort:', { bold: true })] }),
                                    new TableCell({ width: { size: 3113, type: WidthType.DXA }, borders: thinBorder, children: [p(' ')] })
                                ]
                            }),
                            new TableRow({
                                children: [
                                    new TableCell({ width: { size: 1400, type: WidthType.DXA }, shading: { fill: ACCENT_BG }, borders: thinBorder, children: [p('Teacher:', { bold: true })] }),
                                    new TableCell({ width: { size: 3113, type: WidthType.DXA }, borders: thinBorder, children: [p(' ')] }),
                                    new TableCell({ width: { size: 1400, type: WidthType.DXA }, shading: { fill: ACCENT_BG }, borders: thinBorder, children: [p('Date:', { bold: true })] }),
                                    new TableCell({ width: { size: 3113, type: WidthType.DXA }, borders: thinBorder, children: [p(' ')] })
                                ]
                            })
                        ]
                    }),

                    p('', { after: 120 }),
                    createSectionHeading('Task Purpose & Curriculum Overview'),
                    p('You will construct and analyse a series of electrical circuits using Tinkercad Circuits and an Arduino Uno power setup, demonstrating your understanding of complete circuits, switches, and energy transformations. You will also use scientific knowledge to evaluate energy sources and map the transformations required to generate electricity for specific communities.', { before: 80, after: 80 }),

                    p('', { after: 60 }),
                    createSectionHeading('Assessment Structure'),
                    bullet('Part A: Practical Circuit Construction & Analysis (Tinkercad Circuits) — Build, simulate, diagram, and analyse a progressive series of three simple circuits (Simple Light, Switched Control, and Dual-Output Alarm).'),
                    bullet('Part B: Energy Sources & Electricity Generation — Select, diagram energy transformations for, and evaluate suitable energy sources to supply electricity to two remote Queensland locations (an Island and a Desert community).'),

                    p('', { after: 160 }),
                    createHeaderBanner('Part A: Practical Circuit Construction & Analysis', 'Tinkercad Circuits & Arduino Uno Setup'),
                    p('In your Tinkercad Circuits workspace, use your Arduino Uno (5V and GND power rails), breadboard, resistors, LED, switch, and buzzer to construct, simulate, and analyse the following three circuits that you investigated in class.', { before: 100, after: 100 }),

                    // Circuit 1
                    createCircuitSubHeader('Circuit 1', 'The Simple LED Light Circuit', 'Complete electrical pathway & single light output'),
                    p('Task Brief: Construct a basic working circuit in Tinkercad Circuits that transfers electrical energy from the Arduino 5V power supply to illuminate a single Warning LED, using a 220 Ω current-limiting resistor to protect the component.', { before: 80, after: 80 }),
                    p('1. Record your circuit using both a labelled layout diagram and a formal circuit schematic diagram:', { bold: true }),
                    p('', { after: 40 }),
                    createDualDiagramBoxes('Labelled Tinkercad Layout Diagram', '(Arduino 5V/GND, breadboard, 220Ω resistor & LED)', 'Formal Circuit Schematic Diagram', '(Standard symbols: DC Source, Resistor, LED +/-)'),

                    p('', { after: 120 }),
                    p('2. Scientific Analysis (Circuit 1):', { bold: true }),
                    p('a. Path Requirements: Explain why both the 5V positive rail and the GND negative rail must be connected for the LED to illuminate:'),
                    createResponseBox(2),
                    p('', { after: 40 }),
                    p('b. Energy Transformation: Identify the primary energy transformation occurring in this circuit:'),
                    createResponseBox(1, 'Energy Transformation: [ Primary Energy Form ]  ----->  [ Transformed Output Form ]'),

                    p('', { after: 180 }),
                    // Circuit 2
                    createCircuitSubHeader('Circuit 2', 'The Controlled / Switched Circuit', 'Controlling current flow with a switch'),
                    p('Task Brief: Modify your circuit in Tinkercad Circuits by adding a switch (push button or slide switch) in series between the power source and the resistor/LED, allowing you to control the transfer of electrical energy.', { before: 80, after: 80 }),
                    p('1. Draw the formal circuit schematic for your switched circuit, showing the switch in the OPEN position:', { bold: true }),
                    p('', { after: 40 }),
                    createSingleDiagramBox('Formal Circuit Schematic: Switched Circuit', '(Show DC Source, Open Switch Symbol, 220Ω Resistor, and LED in series)', 4),

                    p('', { after: 120 }),
                    p('2. Scientific Analysis (Circuit 2):', { bold: true }),
                    p('a. Open vs. Closed Circuits: Explain what happens to the flow of electrical current when the switch is open compared to when the switch is closed:'),
                    createResponseBox(3),
                    p('', { after: 40 }),
                    p('b. Role of the Switch: How does the mechanical action of the switch control the transfer of energy in the circuit?'),
                    createResponseBox(2),

                    p('', { after: 180 }),
                    // Circuit 3
                    createCircuitSubHeader('Circuit 3', 'The Dual-Output Alarm Circuit', 'Simultaneous light and sound outputs'),
                    p('Task Brief: Extend your circuit in Tinkercad Circuits to create a carnival warning alarm. Add a Piezo Buzzer so that closing the switch activates both the warning LED and the buzzer simultaneously.', { before: 80, after: 80 }),
                    p('1. Draw the formal circuit schematic for your dual-output alarm circuit:', { bold: true }),
                    p('', { after: 40 }),
                    createSingleDiagramBox('Formal Circuit Schematic: Dual-Output Alarm Circuit', '(Show DC Source, Switch, 220Ω Resistor + LED, and Piezo Buzzer in parallel)', 4),

                    p('', { after: 120 }),
                    p('2. Scientific Analysis (Circuit 3):', { bold: true }),
                    p('a. Multiple Energy Transformations: Identify the multiple energy transformations occurring simultaneously when the switch is closed:'),
                    bullet('Transformation 1 (LED): Electrical Energy -----> ____________________________________________________'),
                    bullet('Transformation 2 (Buzzer): Electrical Energy -----> _________________________________________________'),
                    p('', { after: 40 }),
                    p('b. Circuit Design Explanation: Explain how your circuit transfers electrical energy to both components so that a user who triggers the switch receives both visual and audible feedback:'),
                    createResponseBox(3),

                    p('', { after: 140 }),
                    // Teacher Practical Checkpoint
                    new Table({
                        width: { size: CONTENT_WIDTH, type: WidthType.DXA },
                        columnWidths: [CONTENT_WIDTH],
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell({
                                        width: { size: CONTENT_WIDTH, type: WidthType.DXA },
                                        borders: boxBorder,
                                        shading: { fill: ACCENT_BG },
                                        margins: { top: 120, bottom: 120, left: 180, right: 180 },
                                        children: [
                                            p('🛑 Teacher Practical Verification Checkpoint', { bold: true, color: PRIMARY_COLOR }),
                                            p('Demonstrate your working Tinkercad Circuits simulation (Circuits 1, 2, and 3) to your teacher for verification:'),
                                            bullet('[  ] Circuit 1 simulated successfully (LED illuminates continuously).'),
                                            bullet('[  ] Circuit 2 simulated successfully (Switch turns LED ON and OFF).'),
                                            bullet('[  ] Circuit 3 simulated successfully (Switch triggers LED + Piezo Buzzer together).'),
                                            p('', { after: 40 }),
                                            new Table({
                                                width: { size: CONTENT_WIDTH - 360, type: WidthType.DXA },
                                                columnWidths: [Math.floor((CONTENT_WIDTH - 360) / 2), Math.floor((CONTENT_WIDTH - 360) / 2)],
                                                rows: [
                                                    new TableRow({
                                                        children: [
                                                            new TableCell({ width: { size: Math.floor((CONTENT_WIDTH - 360) / 2), type: WidthType.DXA }, children: [p('Teacher Signature: ________________________')] }),
                                                            new TableCell({ width: { size: Math.floor((CONTENT_WIDTH - 360) / 2), type: WidthType.DXA }, children: [p('Date: ________________________')] })
                                                        ]
                                                    })
                                                ]
                                            })
                                        ]
                                    })
                                ]
                            })
                        ]
                    }),

                    p('', { after: 200 }),
                    createHeaderBanner('Part B: Energy Sources & Electricity Generation', 'Powering Attractions in Remote Queensland'),
                    p('A travelling show requires an independent and reliable electricity supply to operate carnival rides and attractions at two remote Queensland destinations that are not connected to the main electricity grid:', { before: 100 }),
                    bullet('Location 1: A Tropical Island (e.g. Great Barrier Reef island resort community)'),
                    bullet('Location 2: A Remote Desert Area (e.g. Outbreak Western Queensland arid region)'),
                    p('Choose a DIFFERENT energy source for each location and evaluate its suitability using your science knowledge.', { before: 60, after: 120 }),

                    createSectionHeading('Location 1: A Tropical Island Community'),
                    p('Chosen Energy Source: ____________________________________________________________________', { bold: true }),
                    p('1. Justification: Why is this energy source a good choice for a tropical island community?', { bold: true }),
                    createResponseBox(2),
                    p('', { after: 40 }),
                    p('2. Energy Transformation Flow Diagram: Draw a flow diagram showing the sequential energy transformations from the energy source to electricity generation:', { bold: true }),
                    createResponseBox(2, 'Flow Diagram: [ Primary Energy Form ]  --->  [ Intermediate Form(s) ]  --->  [ Electrical Energy ]'),
                    p('', { after: 40 }),
                    p('3. Scientific Explanation: Explain the energy transformations in your sequence above:', { bold: true }),
                    createResponseBox(3),
                    p('', { after: 40 }),
                    p('4. Advantages and Disadvantages Evaluation: Identify at least two advantages and two disadvantages of using this source for the island:', { bold: true }),
                    new Table({
                        width: { size: CONTENT_WIDTH, type: WidthType.DXA },
                        columnWidths: [Math.floor(CONTENT_WIDTH / 2), Math.floor(CONTENT_WIDTH / 2)],
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell({ width: { size: Math.floor(CONTENT_WIDTH / 2), type: WidthType.DXA }, shading: { fill: SECONDARY_COLOR }, borders: thinBorder, children: [p('Advantages', { bold: true, color: 'FFFFFF' })] }),
                                    new TableCell({ width: { size: Math.floor(CONTENT_WIDTH / 2), type: WidthType.DXA }, shading: { fill: SECONDARY_COLOR }, borders: thinBorder, children: [p('Disadvantages', { bold: true, color: 'FFFFFF' })] })
                                ]
                            }),
                            new TableRow({
                                children: [
                                    new TableCell({ width: { size: Math.floor(CONTENT_WIDTH / 2), type: WidthType.DXA }, borders: thinBorder, children: [p('1. \n\n2. ')] }),
                                    new TableCell({ width: { size: Math.floor(CONTENT_WIDTH / 2), type: WidthType.DXA }, borders: thinBorder, children: [p('1. \n\n2. ')] })
                                ]
                            })
                        ]
                    }),

                    p('', { after: 180 }),
                    createSectionHeading('Location 2: A Remote Desert Community'),
                    p('Chosen Energy Source: ____________________________________________________________________', { bold: true }),
                    p('1. Justification: Why is this energy source a good choice for an arid desert community?', { bold: true }),
                    createResponseBox(2),
                    p('', { after: 40 }),
                    p('2. Energy Transformation Flow Diagram: Draw a flow diagram showing the sequential energy transformations from the energy source to electricity generation:', { bold: true }),
                    createResponseBox(2, 'Flow Diagram: [ Primary Energy Form ]  --->  [ Intermediate Form(s) ]  --->  [ Electrical Energy ]'),
                    p('', { after: 40 }),
                    p('3. Scientific Explanation: Explain the energy transformations in your sequence above:', { bold: true }),
                    createResponseBox(3),
                    p('', { after: 40 }),
                    p('4. Advantages and Disadvantages Evaluation: Identify at least two advantages and two disadvantages of using this source for the desert:', { bold: true }),
                    new Table({
                        width: { size: CONTENT_WIDTH, type: WidthType.DXA },
                        columnWidths: [Math.floor(CONTENT_WIDTH / 2), Math.floor(CONTENT_WIDTH / 2)],
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell({ width: { size: Math.floor(CONTENT_WIDTH / 2), type: WidthType.DXA }, shading: { fill: SECONDARY_COLOR }, borders: thinBorder, children: [p('Advantages', { bold: true, color: 'FFFFFF' })] }),
                                    new TableCell({ width: { size: Math.floor(CONTENT_WIDTH / 2), type: WidthType.DXA }, shading: { fill: SECONDARY_COLOR }, borders: thinBorder, children: [p('Disadvantages', { bold: true, color: 'FFFFFF' })] })
                                ]
                            }),
                            new TableRow({
                                children: [
                                    new TableCell({ width: { size: Math.floor(CONTENT_WIDTH / 2), type: WidthType.DXA }, borders: thinBorder, children: [p('1. \n\n2. ')] }),
                                    new TableCell({ width: { size: Math.floor(CONTENT_WIDTH / 2), type: WidthType.DXA }, borders: thinBorder, children: [p('1. \n\n2. ')] })
                                ]
                            })
                        ]
                    }),

                    p('', { after: 140 }),
                    p('Application of Scientific Knowledge:', { bold: true, color: PRIMARY_COLOR }),
                    p('Explain how an understanding of energy transfers, transformations, and environmental impacts helps show organisers make informed, responsible decisions when choosing power systems:', { bold: true }),
                    createResponseBox(3),

                    p('', { after: 200 }),
                    // Assessment Rubric
                    createHeaderBanner('Assessment Rubric & Achievement Standards Guide', 'P–6 Curriculum Planning Model — Year 5/6 Science (AC9S6U03 / ACSSU097)'),
                    p('Purpose of assessment: To analyse requirements for the transfer of electrical energy in circuits and systems; describe how energy transforms from one form to another to generate electricity; and explain how scientific knowledge is used to evaluate energy sources for specific purposes.', { before: 80, after: 80 }),

                    new Table({
                        width: { size: CONTENT_WIDTH, type: WidthType.DXA },
                        columnWidths: [700, 3100, 2626, 2600],
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell({ width: { size: 700, type: WidthType.DXA }, shading: { fill: PRIMARY_COLOR }, borders: thinBorder, children: [p('Grade', { bold: true, color: 'FFFFFF', align: AlignmentType.CENTER })] }),
                                    new TableCell({ width: { size: 3100, type: WidthType.DXA }, shading: { fill: PRIMARY_COLOR }, borders: thinBorder, children: [p('Physical Sciences (Science Understanding)', { bold: true, color: 'FFFFFF' })] }),
                                    new TableCell({ width: { size: 2626, type: WidthType.DXA }, shading: { fill: PRIMARY_COLOR }, borders: thinBorder, children: [p('Science as a Human Endeavour', { bold: true, color: 'FFFFFF' })] }),
                                    new TableCell({ width: { size: 2600, type: WidthType.DXA }, shading: { fill: PRIMARY_COLOR }, borders: thinBorder, children: [p('Science Inquiry & Communicating', { bold: true, color: 'FFFFFF' })] })
                                ]
                            }),
                            new TableRow({
                                children: [
                                    new TableCell({ width: { size: 700, type: WidthType.DXA }, shading: { fill: ACCENT_BG }, borders: thinBorder, children: [p('A', { bold: true, align: AlignmentType.CENTER, size: 24, color: PRIMARY_COLOR })] }),
                                    new TableCell({ width: { size: 3100, type: WidthType.DXA }, borders: thinBorder, children: [p('• Comprehensively constructs and explains the 3-circuit sequence in Tinkercad (simple, switched, dual-output).\n• Thoroughly explains complete vs open circuits, switch mechanisms, and multiple simultaneous energy transformations with accurate scientific terminology.\n• Accurately maps and explains multi-step energy transformation chains for electricity generation.')] }),
                                    new TableCell({ width: { size: 2626, type: WidthType.DXA }, borders: thinBorder, children: [p('• In-depth, insightful explanation of how scientific and technological knowledge of energy generation informs community and operational decisions.')] }),
                                    new TableCell({ width: { size: 2600, type: WidthType.DXA }, borders: thinBorder, children: [p('• Constructs sophisticated, accurate schematic and breadboard layout representations using standard symbols.\n• Communicates findings using precise scientific vocabulary and multi-modal diagrams.')] })
                                ]
                            }),
                            new TableRow({
                                children: [
                                    new TableCell({ width: { size: 700, type: WidthType.DXA }, shading: { fill: ACCENT_BG }, borders: thinBorder, children: [p('B', { bold: true, align: AlignmentType.CENTER, size: 24, color: PRIMARY_COLOR })] }),
                                    new TableCell({ width: { size: 3100, type: WidthType.DXA }, borders: thinBorder, children: [p('• Clearly constructs the 3-circuit sequence in Tinkercad.\n• Accurately explains requirements for complete circuits, switch functions, and energy transformations (electrical to light and sound).\n• Accurately describes energy transformations from source to electricity generation.')] }),
                                    new TableCell({ width: { size: 2626, type: WidthType.DXA }, borders: thinBorder, children: [p('• Explains how knowledge of electricity generation helps solve practical problems and evaluates advantages and disadvantages of energy sources effectively.')] }),
                                    new TableCell({ width: { size: 2600, type: WidthType.DXA }, borders: thinBorder, children: [p('• Constructs clear, correctly labelled circuit diagrams and Tinkercad layouts.\n• Communicates ideas clearly using appropriate scientific language.')] })
                                ]
                            }),
                            new TableRow({
                                children: [
                                    new TableCell({ width: { size: 700, type: WidthType.DXA }, shading: { fill: ACCENT_BG }, borders: thinBorder, children: [p('C', { bold: true, align: AlignmentType.CENTER, size: 24, color: PRIMARY_COLOR })] }),
                                    new TableCell({ width: { size: 3100, type: WidthType.DXA }, borders: thinBorder, children: [p('• Builds basic working circuits in Tinkercad with teacher guidance.\n• Identifies simple circuit requirements (closed path) and describes basic energy transformations (electrical to light/sound).\n• Identifies basic advantages and disadvantages of selected energy sources.')] }),
                                    new TableCell({ width: { size: 2626, type: WidthType.DXA }, borders: thinBorder, children: [p('• Describes how scientific knowledge helps solve practical problems.')] }),
                                    new TableCell({ width: { size: 2600, type: WidthType.DXA }, borders: thinBorder, children: [p('• Constructs basic circuit representations and records observations in provided tables.\n• Communicates ideas using everyday and basic scientific language.')] })
                                ]
                            }),
                            new TableRow({
                                children: [
                                    new TableCell({ width: { size: 700, type: WidthType.DXA }, shading: { fill: ACCENT_BG }, borders: thinBorder, children: [p('D', { bold: true, align: AlignmentType.CENTER, size: 24, color: PRIMARY_COLOR })] }),
                                    new TableCell({ width: { size: 3100, type: WidthType.DXA }, borders: thinBorder, children: [p('• Constructs a simple circuit with assistance.\n• Identifies a single component or form of energy.\n• Lists a simple advantage or disadvantage.')] }),
                                    new TableCell({ width: { size: 2626, type: WidthType.DXA }, borders: thinBorder, children: [p('• Mentions a practical use of electricity in daily life.')] }),
                                    new TableCell({ width: { size: 2600, type: WidthType.DXA }, borders: thinBorder, children: [p('• Incomplete circuit representations or tables.\n• Uses fragmented, everyday language.')] })
                                ]
                            }),
                            new TableRow({
                                children: [
                                    new TableCell({ width: { size: 700, type: WidthType.DXA }, shading: { fill: ACCENT_BG }, borders: thinBorder, children: [p('E', { bold: true, align: AlignmentType.CENTER, size: 24, color: PRIMARY_COLOR })] }),
                                    new TableCell({ width: { size: 3100, type: WidthType.DXA }, borders: thinBorder, children: [p('• Partial recognition of electrical components or energy forms.\n• Incomplete responses with significant misconceptions.')] }),
                                    new TableCell({ width: { size: 2626, type: WidthType.DXA }, borders: thinBorder, children: [p('• Minimal or unattempted response regarding science influence.')] }),
                                    new TableCell({ width: { size: 2600, type: WidthType.DXA }, borders: thinBorder, children: [p('• Fragmented communication without scientific representation.')] })
                                ]
                            })
                        ]
                    }),

                    p('', { after: 120 }),
                    p('Teacher Feedback & Comments:', { bold: true, color: PRIMARY_COLOR }),
                    createResponseBox(2),
                    p('', { after: 60 }),
                    p('Overall Grade Judgement: [ A  /  B  /  C  /  D  /  E ]                 Teacher Signature: ___________________________    Date: ______________', { bold: true })
                ]
            }
        ]
    });

    const buffer = await Packer.toBuffer(doc);
    const mainPath = path.resolve(__dirname, 'Resources/Assessment/Sci_Y05_U3_AT_Tinkercad_Arduino_Assessment.docx');
    fs.writeFileSync(mainPath, buffer);
    console.log('Successfully generated:', mainPath);

    const legacyPath = path.resolve(__dirname, 'P-6CPM_Sci_ACycle_Y05_U3_AT (2).docx');
    try {
        fs.writeFileSync(legacyPath, buffer);
        console.log('Successfully generated:', legacyPath);
    } catch (e) {
        console.log('Note: Legacy file is currently open in Word/another app; saved to alternative name as well.');
        const altPath = path.resolve(__dirname, 'P-6CPM_Sci_ACycle_Y05_U3_AT_Tinkercad_Circuits.docx');
        fs.writeFileSync(altPath, buffer);
        console.log('Successfully generated alternative:', altPath);
    }
}

buildDocx().catch(err => {
    console.error('Error generating docx:', err);
    process.exit(1);
});
