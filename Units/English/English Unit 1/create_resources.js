const { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, LevelFormat, Table, TableRow, TableCell, BorderStyle, WidthType, ShadingType } = require('docx');
const fs = require('fs');
const path = require('path');

async function createWorksheet() {
    const doc = new Document({
        styles: {
            default: { document: { run: { font: "Arial", size: 24 } } },
            paragraphStyles: [
                {
                    id: "Heading1",
                    name: "Heading 1",
                    basedOn: "Normal",
                    next: "Normal",
                    quickFormat: true,
                    run: { size: 36, bold: true, color: "000000", font: "Arial" },
                    paragraph: { spacing: { before: 240, after: 240 }, outlineLevel: 0 }
                },
                {
                    id: "Heading2",
                    name: "Heading 2",
                    basedOn: "Normal",
                    next: "Normal",
                    quickFormat: true,
                    run: { size: 28, bold: true, color: "000000", font: "Arial" },
                    paragraph: { spacing: { before: 180, after: 180 }, outlineLevel: 1 }
                }
            ]
        },
        numbering: {
            config: [
                {
                    reference: "numbered-list",
                    levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }]
                }
            ]
        },
        sections: [{
            properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
            children: [
                new Paragraph({ heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER, children: [new TextRun("Year 5 English: Figurative Language Worksheet")] }),
                new Paragraph({ children: [new TextRun({ text: "Name: __________________________", bold: true }), new TextRun("\t\t"), new TextRun({ text: "Date: ________________", bold: true })] }),
                new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "Similes, Metaphors, and Personification", bold: true, size: 28 })] }),

                new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Section 1: Identification")] }),
                new Paragraph({ children: [new TextRun("Read each sentence below and identify if it uses a Simile (S), Metaphor (M), or Personification (P).")] }),

                new Paragraph({ numbering: { reference: "numbered-list", level: 0 }, children: [new TextRun("The library was as quiet as a tomb. (____)")] }),
                new Paragraph({ numbering: { reference: "numbered-list", level: 0 }, children: [new TextRun("The stars danced playfully in the moonlit sky. (____)")] }),
                new Paragraph({ numbering: { reference: "numbered-list", level: 0 }, children: [new TextRun("Life is a roller coaster. (____)")] }),
                new Paragraph({ numbering: { reference: "numbered-list", level: 0 }, children: [new TextRun("The ancient car groaned as it climbed the steep hill. (____)")] }),
                new Paragraph({ numbering: { reference: "numbered-list", level: 0 }, children: [new TextRun("His eyes were like sparkling emeralds. (____)")] }),
                new Paragraph({ numbering: { reference: "numbered-list", level: 0 }, children: [new TextRun("The ocean's waves reached out and grabbed the sand. (____)")] }),
                new Paragraph({ numbering: { reference: "numbered-list", level: 0 }, children: [new TextRun("He has a heart of stone. (____)")] }),
                new Paragraph({ numbering: { reference: "numbered-list", level: 0 }, children: [new TextRun("The clouds were like giant marshmallows. (____)")] }),
                new Paragraph({ numbering: { reference: "numbered-list", level: 0 }, children: [new TextRun("The moon was a glowing lantern in the midnight sky. (____)")] }),
                new Paragraph({ numbering: { reference: "numbered-list", level: 0 }, children: [new TextRun("The skyscrapers poked their heads into the clouds. (____)")] }),

                new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Section 2: Sentence Transformation")] }),
                new Paragraph({ children: [new TextRun("Rewrite these 'boring' sentences into interesting figurative ones.")] }),

                new Paragraph({ numbering: { reference: "numbered-list", level: 0 }, children: [new TextRun("Boring: The rain fell on the roof.")] }),
                new Paragraph({ children: [new TextRun("Figurative: ________________________________________________________________")] }),

                new Paragraph({ numbering: { reference: "numbered-list", level: 0 }, children: [new TextRun("Boring: The ice cream was cold.")] }),
                new Paragraph({ children: [new TextRun("Figurative: ________________________________________________________________")] }),

                new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Section 3: Creative Writing")] }),
                new Paragraph({ children: [new TextRun("Write a short paragraph (3-4 sentences) about a storm. You must include at least one simile, one metaphor, and one example of personification.")] }),
                new Paragraph({ spacing: { before: 100 }, children: [new TextRun("___________________________________________________________________________")] }),
                new Paragraph({ children: [new TextRun("___________________________________________________________________________")] }),
                new Paragraph({ children: [new TextRun("___________________________________________________________________________")] }),
                new Paragraph({ children: [new TextRun("___________________________________________________________________________")] })
            ]
        }]
    });

    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(path.join(__dirname, "Resources", "figurative_language_worksheet.docx"), buffer);
}

async function createQuiz() {
    const doc = new Document({
        styles: {
            default: { document: { run: { font: "Arial", size: 24 } } }
        },
        sections: [{
            children: [
                new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Figurative Language Quiz")] }),
                new Paragraph({ children: [new TextRun("This quiz is designed for Year 5 students to test their understanding of similes, metaphors, and personification.")] }),
                new Paragraph({ spacing: { before: 240 } }),

                // Question 1
                new Paragraph({ children: [new TextRun("1. Which of the following is a simile?")] }),
                new Paragraph({ children: [new TextRun("A. The moon is a white plate in the sky.")] }),
                new Paragraph({ children: [new TextRun("B. The moon was like a glowing lantern.")] }),
                new Paragraph({ children: [new TextRun("C. The moon smiled down at us.")] }),
                new Paragraph({ children: [new TextRun("D. The moon was very bright tonight.")] }),
                new Paragraph({ children: [new TextRun("ANS: B")] }),
                new Paragraph({ spacing: { before: 240 } }),

                // Question 2
                new Paragraph({ children: [new TextRun("2. 'The fire ate the entire forest' is an example of:")] }),
                new Paragraph({ children: [new TextRun("A. Simile")] }),
                new Paragraph({ children: [new TextRun("B. Metaphor")] }),
                new Paragraph({ children: [new TextRun("C. Personification")] }),
                new Paragraph({ children: [new TextRun("D. Alliteration")] }),
                new Paragraph({ children: [new TextRun("ANS: C")] }),
                new Paragraph({ spacing: { before: 240 } }),

                // Question 3
                new Paragraph({ children: [new TextRun("3. What does the metaphor 'You are my sunshine' mean?")] }),
                new Paragraph({ children: [new TextRun("A. You are literally a star in space.")] }),
                new Paragraph({ children: [new TextRun("B. You provide me with light and heat.")] }),
                new Paragraph({ children: [new TextRun("C. You make me feel happy and bright.")] }),
                new Paragraph({ children: [new TextRun("D. You have a yellow face.")] }),
                new Paragraph({ children: [new TextRun("ANS: C")] }),
                new Paragraph({ spacing: { before: 240 } }),

                // Question 4
                new Paragraph({ children: [new TextRun("4. Choose the best personification for a tree in a storm.")] }),
                new Paragraph({ children: [new TextRun("A. The tree was as tall as a building.")] }),
                new Paragraph({ children: [new TextRun("B. The tree fought against the howling wind with its wooden arms.")] }),
                new Paragraph({ children: [new TextRun("C. The tree is a giant green umbrella.")] }),
                new Paragraph({ children: [new TextRun("D. The tree lost many of its leaves.")] }),
                new Paragraph({ children: [new TextRun("ANS: B")] }),
                new Paragraph({ spacing: { before: 240 } }),

                // Question 5
                new Paragraph({ children: [new TextRun("5. Which of these is a metaphor?")] }),
                new Paragraph({ children: [new TextRun("A. He swam like a fish.")] }),
                new Paragraph({ children: [new TextRun("B. The skyscraper was as tall as a mountain.")] }),
                new Paragraph({ children: [new TextRun("C. Time is a thief.")] }),
                new Paragraph({ children: [new TextRun("D. The teapot whistled a happy tune.")] }),
                new Paragraph({ children: [new TextRun("ANS: C")] }),
                new Paragraph({ spacing: { before: 240 } }),

                // Question 6
                new Paragraph({ children: [new TextRun("6. 'The snow was as white as a ghost' uses:")] }),
                new Paragraph({ children: [new TextRun("A. Simile")] }),
                new Paragraph({ children: [new TextRun("B. Metaphor")] }),
                new Paragraph({ children: [new TextRun("C. Personification")] }),
                new Paragraph({ children: [new TextRun("D. Onomatopoeia")] }),
                new Paragraph({ children: [new TextRun("ANS: A")] }),
                new Paragraph({ spacing: { before: 240 } }),

                // Question 7
                new Paragraph({ children: [new TextRun("7. Identify the personification in the sentence: 'The greedy keys hid from me while I was in a rush.'")] }),
                new Paragraph({ children: [new TextRun("A. I was in a rush")] }),
                new Paragraph({ children: [new TextRun("B. while I was")] }),
                new Paragraph({ children: [new TextRun("C. hidden keys")] }),
                new Paragraph({ children: [new TextRun("D. greedy keys hid")] }),
                new Paragraph({ children: [new TextRun("ANS: D")] }),
                new Paragraph({ spacing: { before: 240 } }),

                // Question 8
                new Paragraph({ children: [new TextRun("8. 'The ocean's waves reached out and grabbed the sand.' This is:")] }),
                new Paragraph({ children: [new TextRun("A. Simile")] }),
                new Paragraph({ children: [new TextRun("B. Metaphor")] }),
                new Paragraph({ children: [new TextRun("C. Personification")] }),
                new Paragraph({ children: [new TextRun("D. Hyperbole")] }),
                new Paragraph({ children: [new TextRun("ANS: C")] }),
                new Paragraph({ spacing: { before: 240 } }),

                // Question 9
                new Paragraph({ children: [new TextRun("9. 'He has a heart of stone' means:")] }),
                new Paragraph({ children: [new TextRun("A. His heart is literally made of rock.")] }),
                new Paragraph({ children: [new TextRun("B. He is very strong.")] }),
                new Paragraph({ children: [new TextRun("C. He is cold and lacks feelings.")] }),
                new Paragraph({ children: [new TextRun("D. He has a medical condition.")] }),
                new Paragraph({ children: [new TextRun("ANS: C")] }),
                new Paragraph({ spacing: { before: 240 } }),

                // Question 10
                new Paragraph({ children: [new TextRun("10. Which is a simile for being very busy?")] }),
                new Paragraph({ children: [new TextRun("A. Busy as a bee.")] }),
                new Paragraph({ children: [new TextRun("B. Busy is my middle name.")] }),
                new Paragraph({ children: [new TextRun("C. The calendar screamed with appointments.")] }),
                new Paragraph({ children: [new TextRun("D. I am a machine.")] }),
                new Paragraph({ children: [new TextRun("ANS: A")] })
            ]
        }]
    });

    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(path.join(__dirname, "Resources", "figurative_language_quiz.docx"), buffer);
}

const resourcesDir = path.join(__dirname, "Resources");
if (!fs.existsSync(resourcesDir)) {
    fs.mkdirSync(resourcesDir);
}

Promise.all([createWorksheet(), createQuiz()]).then(() => {
    console.log("Documents updated successfully with 10 questions and ANS format.");
}).catch(err => {
    console.error(err);
});
