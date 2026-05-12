const { Document, Packer, Paragraph, TextRun, AlignmentType } = require('docx');
const fs = require('fs');

const doc = new Document({
    styles: {
        default: { document: { run: { font: "Arial", size: 24 } } }
    },
    sections: [{
        children: [
            new Paragraph({ children: [new TextRun({ text: "Lesson 7 Assessment: Cyclone Structure & Convection", bold: true, size: 32 })] }),
            new Paragraph({ spacing: { before: 200 }, children: [new TextRun("1. Which part of the cyclone contains the most destructive winds?")] }),
            new Paragraph({ children: [new TextRun("A. The Eye")] }),
            new Paragraph({ children: [new TextRun("B. The Eye Wall")] }),
            new Paragraph({ children: [new TextRun("C. The Rain Bands")] }),
            new Paragraph({ children: [new TextRun("D. The Spiral Arms")] }),
            new Paragraph({ children: [new TextRun("ANSWER: B")] }),
            new Paragraph({ children: [new TextRun("POINT: 1")] }),

            new Paragraph({ spacing: { before: 200 }, children: [new TextRun("2. What is the main difference between a labelled diagram and an annotated diagram?")] }),
            new Paragraph({ children: [new TextRun("A. A labelled diagram has no arrows.")] }),
            new Paragraph({ children: [new TextRun("B. An annotated diagram includes explanations of each feature.")] }),
            new Paragraph({ children: [new TextRun("C. A labelled diagram is in colour.")] }),
            new Paragraph({ children: [new TextRun("D. There is no difference.")] }),
            new Paragraph({ children: [new TextRun("ANSWER: B")] }),
            new Paragraph({ children: [new TextRun("POINT: 1")] }),

            new Paragraph({ spacing: { before: 200 }, children: [new TextRun("3. In a convection current, what happens to warm air?")] }),
            new Paragraph({ children: [new TextRun("A. It stays still.")] }),
            new Paragraph({ children: [new TextRun("B. It sinks because it is dense.")] }),
            new Paragraph({ children: [new TextRun("C. It rises because it is less dense.")] }),
            new Paragraph({ children: [new TextRun("D. It turns into rain.")] }),
            new Paragraph({ children: [new TextRun("ANSWER: C")] }),
            new Paragraph({ children: [new TextRun("POINT: 1")] }),

            new Paragraph({ spacing: { before: 200 }, children: [new TextRun("4. What process drives the formation of a tropical cyclone?")] }),
            new Paragraph({ children: [new TextRun("A. Convection currents")] }),
            new Paragraph({ children: [new TextRun("B. Earthquakes")] }),
            new Paragraph({ children: [new TextRun("C. Lunar cycles")] }),
            new Paragraph({ children: [new TextRun("D. Tides")] }),
            new Paragraph({ children: [new TextRun("ANSWER: A")] }),
            new Paragraph({ children: [new TextRun("POINT: 1")] }),

            new Paragraph({ spacing: { before: 200 }, children: [new TextRun("5. Why was the Cyclone Testing Station established in Townsville in 1972?")] }),
            new Paragraph({ children: [new TextRun("A. To study fish.")] }),
            new Paragraph({ children: [new TextRun("B. Because of the building failures during Cyclone Althea.")] }),
            new Paragraph({ children: [new TextRun("C. To predict the weather.")] }),
            new Paragraph({ children: [new TextRun("D. It was a gift from the Navy.")] }),
            new Paragraph({ children: [new TextRun("ANSWER: B")] }),
            new Paragraph({ children: [new TextRun("POINT: 1")] }),

            new Paragraph({ spacing: { before: 200 }, children: [new TextRun("6. What was 'Operation Navy Help'?")] }),
            new Paragraph({ children: [new TextRun("A. A mission to find lost ships.")] }),
            new Paragraph({ children: [new TextRun("B. The emergency response to Cyclone Tracy in Darwin.")] }),
            new Paragraph({ children: [new TextRun("C. A type of cyclone warning.")] }),
            new Paragraph({ children: [new TextRun("D. A research project on ocean temperatures.")] }),
            new Paragraph({ children: [new TextRun("ANSWER: B")] }),
            new Paragraph({ children: [new TextRun("POINT: 1")] }),

            new Paragraph({ spacing: { before: 200 }, children: [new TextRun("7. Which of these is a feature of an annotated diagram?")] }),
            new Paragraph({ children: [new TextRun("A. It has a title.")] }),
            new Paragraph({ children: [new TextRun("B. It has detailed notes explaining features.")] }),
            new Paragraph({ children: [new TextRun("C. It is always drawn by hand.")] }),
            new Paragraph({ children: [new TextRun("D. It only uses numbers.")] }),
            new Paragraph({ children: [new TextRun("ANSWER: B")] }),
            new Paragraph({ children: [new TextRun("POINT: 1")] }),

            new Paragraph({ spacing: { before: 200 }, children: [new TextRun("8. What happens to cool air in a convection current?")] }),
            new Paragraph({ children: [new TextRun("A. It rises.")] }),
            new Paragraph({ children: [new TextRun("B. It sinks.")] }),
            new Paragraph({ children: [new TextRun("C. It disappears.")] }),
            new Paragraph({ children: [new TextRun("D. It turns into the eye wall.")] }),
            new Paragraph({ children: [new TextRun("ANSWER: B")] }),
            new Paragraph({ children: [new TextRun("POINT: 1")] }),

            new Paragraph({ spacing: { before: 200 }, children: [new TextRun("9. Where is the air pressure lowest in a cyclone?")] }),
            new Paragraph({ children: [new TextRun("A. The Rain Bands")] }),
            new Paragraph({ children: [new TextRun("B. The Eye")] }),
            new Paragraph({ children: [new TextRun("C. The Spiral Arms")] }),
            new Paragraph({ children: [new TextRun("D. The Ground")] }),
            new Paragraph({ children: [new TextRun("ANSWER: B")] }),
            new Paragraph({ children: [new TextRun("POINT: 1")] }),

            new Paragraph({ spacing: { before: 200 }, children: [new TextRun("10. How did Cyclone Tracy change Australian communities?")] }),
            new Paragraph({ children: [new TextRun("A. It led to much stricter building codes.")] }),
            new Paragraph({ children: [new TextRun("B. It made everyone move to Sydney.")] }),
            new Paragraph({ children: [new TextRun("C. It changed the name of the storm.")] }),
            new Paragraph({ children: [new TextRun("D. It had no long-term effect.")] }),
            new Paragraph({ children: [new TextRun("ANSWER: A")] }),
            new Paragraph({ children: [new TextRun("POINT: 1")] })
        ]
    }]
});

Packer.toBuffer(doc).then(buffer => fs.writeFileSync("Lessons_06_08/Lesson_07/Lesson_07_Assessment.docx", buffer));
