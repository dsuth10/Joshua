const { Document, Packer, Paragraph, TextRun, AlignmentType } = require('docx');
const fs = require('fs');

// Microsoft Forms import format: Question, A/B/C/D options, ANS: [X]
function question(num, questionText, options, answerLetter) {
    return [
        new Paragraph({
            spacing: { before: 400 },
            children: [new TextRun({ text: `${num}. ${questionText}`, bold: false, size: 24 })]
        }),
        ...options.map((opt, i) => new Paragraph({
            children: [new TextRun({ text: `${String.fromCharCode(65 + i)}. ${opt}`, size: 24 })],
            spacing: { before: 80 }
        })),
        new Paragraph({
            children: [new TextRun({ text: `ANS: ${answerLetter}`, size: 24 })],
            spacing: { before: 80 }
        })
    ];
}

const doc = new Document({
    styles: {
        default: {
            document: { run: { font: "Arial", size: 24 } }
        }
    },
    sections: [{
        children: [
            // Title
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 200 },
                children: [new TextRun({ text: "Lesson 13 Assessment: Image Sequencing & Meaning", bold: true, size: 32 })]
            }),
            new Paragraph({
                spacing: { after: 200 },
                children: [new TextRun({ text: "Instructions: Choose the best answer for each question. Think carefully about how image sequences build meaning in informative texts.", size: 24 })]
            }),

            // Q1
            ...question(
                1,
                "What does the term 'chronological' mean when describing an image sequence?",
                [
                    "Images are arranged by size, from smallest to largest.",
                    "Images are arranged in the order events happened over time.",
                    "Images are chosen because they are the most colourful.",
                    "Images are placed randomly throughout the text."
                ],
                "B"
            ),

            // Q2
            ...question(
                2,
                "Which type of image sequence would best show how a flood develops from heavy rain to street flooding?",
                [
                    "Before and after",
                    "Life cycle",
                    "Cause and effect",
                    "Chronological"
                ],
                "C"
            ),

            // Q3
            ...question(
                3,
                "A Floods Archive page shows images from 1893, 1974 and 2011. What type of image sequence is this?",
                [
                    "Before and after",
                    "Cause and effect",
                    "Procedure",
                    "Chronological"
                ],
                "D"
            ),

            // Q4
            ...question(
                4,
                "Why do authors use image sequences in informative texts?",
                [
                    "To make the page look more colourful.",
                    "To replace the need for written text.",
                    "To build the reader's understanding by showing how something changes or develops.",
                    "To confuse the reader with too much information."
                ],
                "C"
            ),

            // Q5
            ...question(
                5,
                "What is the 'salient' element of an image?",
                [
                    "The caption written below the image.",
                    "The most eye-catching or prominent element that draws the viewer's attention first.",
                    "The background of the image.",
                    "The date the image was taken."
                ],
                "B"
            ),

            // Q6
            ...question(
                6,
                "A student looks at three flood images: (1) a street with no water, (2) the same street with 30 cm of water, (3) the same street completely underwater. What does this sequence show?",
                [
                    "The flood happened at different times of day.",
                    "The flood only affected one street.",
                    "The flood escalated from minor inundation to severe flooding.",
                    "The images are in the wrong order."
                ],
                "C"
            ),

            // Q7
            ...question(
                7,
                "What is the purpose of a caption in an image sequence?",
                [
                    "To make the image appear larger on the page.",
                    "To explain or describe what the image shows, adding meaning the image alone cannot convey.",
                    "To replace the image if it is missing.",
                    "To give the name of the photographer."
                ],
                "B"
            ),

            // Q8
            ...question(
                8,
                "Which image would most effectively be placed FIRST in a 'before and after' sequence about a flood?",
                [
                    "An image of rescuers in a boat on a flooded street.",
                    "An image of the same street in normal, dry conditions.",
                    "An image of the clean-up after the flood.",
                    "An image of storm clouds gathering."
                ],
                "B"
            ),

            // Q9
            ...question(
                9,
                "An author arranges flood images in this order: 1893 → 1974 → 2011 → 2022. What effect does this have on the reader?",
                [
                    "The reader is confused about when the floods happened.",
                    "The reader sees how Brisbane has repeatedly experienced major floods over more than 100 years.",
                    "The reader thinks floods only happen in Brisbane.",
                    "The reader believes the 2022 flood was the least serious."
                ],
                "B"
            ),

            // Q10
            ...question(
                10,
                "Which statement best explains why image sequencing is considered an important language feature in informative texts?",
                [
                    "Images are always more important than written words in any text.",
                    "Image sequences distract the reader from the main ideas.",
                    "The order and selection of images is a deliberate authorial choice that shapes what readers understand and how they respond.",
                    "Image sequences are only used in news articles, not information reports."
                ],
                "C"
            ),
        ]
    }]
});

Packer.toBuffer(doc).then(buffer => {
    fs.writeFileSync(
        "c:/Users/dsuth/Documents/Joshua/Units/English/English_Unit_2/Lesson_Plans/Lesson_13_Assessment.docx",
        buffer
    );
    console.log("✅ Lesson 13 Assessment created successfully.");
});
