const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = require('docx');
const fs = require('fs');

const doc = new Document({
    styles: {
        default: { document: { run: { font: "Arial", size: 24 } } }
    },
    sections: [{
        children: [
            new Paragraph({ children: [new TextRun({ text: "Lesson 8 Assessment: Modelling Cyclone Formation", bold: true, size: 32 })] }),
            new Paragraph({ spacing: { before: 200 }, children: [new TextRun("1. Why do cyclones rotate clockwise in the Southern Hemisphere?")] }),
            new Paragraph({ children: [new TextRun("A. Because of the wind.")] }),
            new Paragraph({ children: [new TextRun("B. Because of the Coriolis Effect caused by Earth's rotation.")] }),
            new Paragraph({ children: [new TextRun("C. Because of the moon's gravity.")] }),
            new Paragraph({ children: [new TextRun("D. They actually rotate anti-clockwise.")] }),
            new Paragraph({ children: [new TextRun("ANSWER: B")] }),
            new Paragraph({ children: [new TextRun("POINT: 1")] }),

            new Paragraph({ spacing: { before: 200 }, children: [new TextRun("2. What is a 'vortex' in a cyclone model?")] }),
            new Paragraph({ children: [new TextRun("A. A type of cloud.")] }),
            new Paragraph({ children: [new TextRun("B. The whirling mass of water or air that forms a spiral.")] }),
            new Paragraph({ children: [new TextRun("C. The ground underneath the storm.")] }),
            new Paragraph({ children: [new TextRun("D. A piece of equipment.")] }),
            new Paragraph({ children: [new TextRun("ANSWER: B")] }),
            new Paragraph({ children: [new TextRun("POINT: 1")] }),

            new Paragraph({ spacing: { before: 200 }, children: [new TextRun("3. Which cyclone is the deadliest in Australian history?")] }),
            new Paragraph({ children: [new TextRun("A. Cyclone Yasi")] }),
            new Paragraph({ children: [new TextRun("B. Cyclone Larry")] }),
            new Paragraph({ children: [new TextRun("C. Cyclone Mahina")] }),
            new Paragraph({ children: [new TextRun("D. Cyclone George")] }),
            new Paragraph({ children: [new TextRun("ANSWER: C")] }),
            new Paragraph({ children: [new TextRun("POINT: 1")] }),

            new Paragraph({ spacing: { before: 200 }, children: [new TextRun("4. What was significant about Cyclone George (2007)?")] }),
            new Paragraph({ children: [new TextRun("A. It hit a desert.")] }),
            new Paragraph({ children: [new TextRun("B. It disrupted global iron ore prices by hitting mining camps.")] }),
            new Paragraph({ children: [new TextRun("C. It was the smallest cyclone ever.")] }),
            new Paragraph({ children: [new TextRun("D. It lasted for a whole year.")] }),
            new Paragraph({ children: [new TextRun("ANSWER: B")] }),
            new Paragraph({ children: [new TextRun("POINT: 1")] }),

            new Paragraph({ spacing: { before: 200 }, children: [new TextRun("5. In our 'Cyclone in a Bottle' model, what provides the energy to move the water?")] }),
            new Paragraph({ children: [new TextRun("A. A battery")] }),
            new Paragraph({ children: [new TextRun("B. Gravity (as water falls from the top bottle to the bottom)")] }),
            new Paragraph({ children: [new TextRun("C. Solar power")] }),
            new Paragraph({ children: [new TextRun("D. Magnetic force")] }),
            new Paragraph({ children: [new TextRun("ANSWER: B")] }),
            new Paragraph({ children: [new TextRun("POINT: 1")] }),

            new Paragraph({ spacing: { before: 200 }, children: [new TextRun("6. What is a limitation of the bottle model?")] }),
            new Paragraph({ children: [new TextRun("A. It's too big.")] }),
            new Paragraph({ children: [new TextRun("B. It doesn't show the role of heat and ocean temperature.")] }),
            new Paragraph({ children: [new TextRun("C. It uses water instead of air.")] }),
            new Paragraph({ children: [new TextRun("D. Both B and C are limitations.")] }),
            new Paragraph({ children: [new TextRun("ANSWER: D")] }),
            new Paragraph({ children: [new TextRun("POINT: 1")] }),

            new Paragraph({ spacing: { before: 200 }, children: [new TextRun("7. What was the height of the storm surge from Cyclone Mahina?")] }),
            new Paragraph({ children: [new TextRun("A. 2 metres")] }),
            new Paragraph({ children: [new TextRun("B. 5 metres")] }),
            new Paragraph({ children: [new TextRun("C. Over 13 metres")] }),
            new Paragraph({ children: [new TextRun("D. 1 metre")] }),
            new Paragraph({ children: [new TextRun("ANSWER: C")] }),
            new Paragraph({ children: [new TextRun("POINT: 1")] }),

            new Paragraph({ spacing: { before: 200 }, children: [new TextRun("8. Why do scientists use models like the 'Cyclone in a Bottle'?")] }),
            new Paragraph({ children: [new TextRun("A. Because they don't like real cyclones.")] }),
            new Paragraph({ children: [new TextRun("B. To represent and understand complex systems in a safe, small way.")] }),
            new Paragraph({ children: [new TextRun("C. To make a mess.")] }),
            new Paragraph({ children: [new TextRun("D. To predict exactly where a real cyclone will go.")] }),
            new Paragraph({ children: [new TextRun("ANSWER: B")] }),
            new Paragraph({ children: [new TextRun("POINT: 1")] }),

            new Paragraph({ spacing: { before: 200 }, children: [new TextRun("9. What direction does a cyclone spin in the Northern Hemisphere?")] }),
            new Paragraph({ children: [new TextRun("A. Clockwise")] }),
            new Paragraph({ children: [new TextRun("B. Anti-clockwise")] }),
            new Paragraph({ children: [new TextRun("C. It doesn't spin.")] }),
            new Paragraph({ children: [new TextRun("D. It spins up and down.")] }),
            new Paragraph({ children: [new TextRun("ANSWER: B")] }),
            new Paragraph({ children: [new TextRun("POINT: 1")] }),

            new Paragraph({ spacing: { before: 200 }, children: [new TextRun("10. What is 'cyclone tracking'?")] }),
            new Paragraph({ children: [new TextRun("A. Following a cyclone on foot.")] }),
            new Paragraph({ children: [new TextRun("B. Mapping and predicting the movement and path of a cyclone.")] }),
            new Paragraph({ children: [new TextRun("C. Measuring how many cyclones happen in a year.")] }),
            new Paragraph({ children: [new TextRun("D. Counting the number of trees knocked down.")] }),
            new Paragraph({ children: [new TextRun("ANSWER: B")] }),
            new Paragraph({ children: [new TextRun("POINT: 1")] })
        ]
    }]
});

Packer.toBuffer(doc).then(buffer => fs.writeFileSync("Lessons_06_08/Lesson_08/Lesson_08_Assessment.docx", buffer));
