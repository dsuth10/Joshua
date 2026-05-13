const { Document, Packer, Paragraph, TextRun, AlignmentType } = require('docx');
const fs = require('fs');

const doc = new Document({
    styles: {
        default: {
            document: {
                run: { font: "Arial", size: 24 }
            }
        }
    },
    sections: [{
        children: [
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                    new TextRun({ text: "Lesson 12 Assessment: Sentence Starting Points", bold: true, size: 32 }),
                ]
            }),
            new Paragraph({
                spacing: { before: 400 },
                children: [
                    new TextRun("Instructions: Choose the best answer for each question. Focus on how the starting point of the sentence changes what is emphasised."),
                ]
            }),

            new Paragraph({ spacing: { before: 400 }, children: [new TextRun("1. Which sentence starting point emphasises the TIME an event occurred?")] }),
            new Paragraph({ children: [new TextRun("a) The flood arrived on Saturday morning.")] }),
            new Paragraph({ children: [new TextRun("b) On Saturday morning, the flood arrived.")] }),
            new Paragraph({ children: [new TextRun("c) A flood hit the town on Saturday morning.")] }),
            new Paragraph({ children: [new TextRun("d) Saturday was the day the flood arrived.")] }),
            new Paragraph({ children: [new TextRun("Correct Answer: b")] }),

            new Paragraph({ spacing: { before: 400 }, children: [new TextRun("2. Which sentence starting point emphasises the REASON for the flooding?")] }),
            new Paragraph({ children: [new TextRun("a) Because of the heavy rainfall, the streets were inundated.")] }),
            new Paragraph({ children: [new TextRun("b) The streets were inundated because of the heavy rainfall.")] }),
            new Paragraph({ children: [new TextRun("c) Heavy rainfall caused the streets to be inundated.")] }),
            new Paragraph({ children: [new TextRun("d) Inundation occurred due to the heavy rainfall.")] }),
            new Paragraph({ children: [new TextRun("Correct Answer: a")] }),

            new Paragraph({ spacing: { before: 400 }, children: [new TextRun("3. In the sentence 'Across the 2011 event, 12,500 homes were flooded', what is the Theme (starting point)?")] }),
            new Paragraph({ children: [new TextRun("a) 12,500 homes")] }),
            new Paragraph({ children: [new TextRun("b) were flooded")] }),
            new Paragraph({ children: [new TextRun("c) Across the 2011 event")] }),
            new Paragraph({ children: [new TextRun("d) the 2011 event")] }),
            new Paragraph({ children: [new TextRun("Correct Answer: c")] }),

            new Paragraph({ spacing: { before: 400 }, children: [new TextRun("4. Which starter gives prominence to the LOCATION of the disaster?")] }),
            new Paragraph({ children: [new TextRun("a) Brisbane experienced its second-highest flood in 1893.")] }),
            new Paragraph({ children: [new TextRun("b) In 1893, Brisbane experienced a major flood.")] }),
            new Paragraph({ children: [new TextRun("c) The 1893 flood hit Brisbane very hard.")] }),
            new Paragraph({ children: [new TextRun("d) In the city of Brisbane, a major flood occurred in 1893.")] }),
            new Paragraph({ children: [new TextRun("Correct Answer: d")] }),

            new Paragraph({ spacing: { before: 400 }, children: [new TextRun("5. Why do authors change the starting point of their sentences?")] }),
            new Paragraph({ children: [new TextRun("a) To make the sentences longer.")] }),
            new Paragraph({ children: [new TextRun("b) To give prominence to different information.")] }),
            new Paragraph({ children: [new TextRun("c) To make the text harder to read.")] }),
            new Paragraph({ children: [new TextRun("d) To use more adjectives.")] }),
            new Paragraph({ children: [new TextRun("Correct Answer: b")] }),

            new Paragraph({ spacing: { before: 400 }, children: [new TextRun("6. Which sentence emphasises the SUBJECT of the action?")] }),
            new Paragraph({ children: [new TextRun("a) Following the rain, the river rose.")] }),
            new Paragraph({ children: [new TextRun("b) The river rose following the rain.")] }),
            new Paragraph({ children: [new TextRun("c) When it rained, the river rose.")] }),
            new Paragraph({ children: [new TextRun("d) Rapidly, the river rose.")] }),
            new Paragraph({ children: [new TextRun("Correct Answer: b")] }),

            new Paragraph({ spacing: { before: 400 }, children: [new TextRun("7. Which is an effective way to link two paragraphs about time?")] }),
            new Paragraph({ children: [new TextRun("a) Start the new paragraph with 'Additionally...'")] }),
            new Paragraph({ children: [new TextRun("b) Start the new paragraph with 'In contrast...'")] }),
            new Paragraph({ children: [new TextRun("c) Start the new paragraph with 'After this event...'")] }),
            new Paragraph({ children: [new TextRun("d) Start the new paragraph with 'Because...'")] }),
            new Paragraph({ children: [new TextRun("Correct Answer: c")] }),

            new Paragraph({ spacing: { before: 400 }, children: [new TextRun("8. Identify the Theme in: 'Driven by a strong La Niña, the catchments were saturated.'")] }),
            new Paragraph({ children: [new TextRun("a) the catchments")] }),
            new Paragraph({ children: [new TextRun("b) were saturated")] }),
            new Paragraph({ children: [new TextRun("c) Driven by a strong La Niña")] }),
            new Paragraph({ children: [new TextRun("d) La Niña")] }),
            new Paragraph({ children: [new TextRun("Correct Answer: c")] }),

            new Paragraph({ spacing: { before: 400 }, children: [new TextRun("9. Which sentence starting point creates a sense of 'Condition' (if something happens)?")] }),
            new Paragraph({ children: [new TextRun("a) If the levee breaks, the town will flood.")] }),
            new Paragraph({ children: [new TextRun("b) The town will flood if the levee breaks.")] }),
            new Paragraph({ children: [new TextRun("c) Breaking levees cause town flooding.")] }),
            new Paragraph({ children: [new TextRun("d) Towns flood when levees break.")] }),
            new Paragraph({ children: [new TextRun("Correct Answer: a")] }),

            new Paragraph({ spacing: { before: 400 }, children: [new TextRun("10. In an information report, starting with 'According to the Bureau of Meteorology...' emphasises:")] }),
            new Paragraph({ children: [new TextRun("a) The weather")] }),
            new Paragraph({ children: [new TextRun("b) The time")] }),
            new Paragraph({ children: [new TextRun("c) The authoritative source")] }),
            new Paragraph({ children: [new TextRun("d) The location")] }),
            new Paragraph({ children: [new TextRun("Correct Answer: c")] }),
        ]
    }]
});

Packer.toBuffer(doc).then(buffer => {
    fs.writeFileSync("c:/Users/dsuth/Documents/Joshua/Units/English/English_Unit_2/Lesson_Plans/Lesson_12_Assessment.docx", buffer);
    console.log("Assessment created successfully.");
});
