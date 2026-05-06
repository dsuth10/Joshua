const { Document, Packer, Paragraph, TextRun, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType } = require('docx');
const fs = require('fs');
const path = require('path');

const THEME = { 
    navy: '112D4E', 
    orange: 'F96D00', 
    white: 'F9F7F7', 
    blue: '3F72AF',
    black: '000000'
};

// Helper for shaded table headers
function createShadedHeader(text) {
    return new TableCell({
        children: [new Paragraph({
            children: [new TextRun({ text, bold: true, color: 'FFFFFF' })],
            alignment: AlignmentType.CENTER
        })],
        shading: {
            fill: THEME.navy,
            type: ShadingType.CLEAR,
            color: 'auto',
        },
    });
}

// --- HANDOUT GENERATION ---
async function generateHandout(filename) {
    const doc = new Document({
        sections: [{
            children: [
                // Header
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: "Lesson 1: Social and Cultural Context", bold: true, size: 32, color: THEME.navy })],
                    spacing: { after: 200 }
                }),
                new Paragraph({
                    children: [
                        new TextRun({ text: "Name: ________________________", size: 24 }),
                        new TextRun({ text: "\t\tDate: ________________", size: 24 })
                    ],
                    spacing: { after: 400 }
                }),

                // Part 1
                new Paragraph({
                    children: [new TextRun({ text: "Part 1: The Two Worlds of Paper Planes", bold: true, size: 28, color: THEME.orange })],
                    spacing: { before: 200, after: 100 }
                }),
                new Paragraph({
                    text: "Steve Worland uses contrasting locations to show Dylan's journey. Fill in the T-Chart below with sensory details (sight, sound, feel) for both locations.",
                    spacing: { after: 200 }
                }),
                new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    rows: [
                        new TableRow({
                            children: [createShadedHeader("Waleup (Regional Australia)"), createShadedHeader("Tokyo (Global Stage)")]
                        }),
                        new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph({ text: "\n\n\n\n\n" })] }),
                                new TableCell({ children: [new Paragraph({ text: "\n\n\n\n\n" })] })
                            ]
                        })
                    ]
                }),

                // Part 2
                new Paragraph({
                    children: [new TextRun({ text: "Part 2: Economic vs. Cultural Capital", bold: true, size: 28, color: THEME.orange })],
                    spacing: { before: 400, after: 100 }
                }),
                new Paragraph({
                    text: "Economic Capital refers to money and resources. Cultural/Social Capital refers to knowledge, wisdom, and connections.",
                    spacing: { after: 200 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: "1. What is Jason's main 'capital'? How does it help him?", bold: true })],
                    spacing: { before: 100, after: 400 }
                }),
                new Paragraph({ text: "____________________________________________________________________________________" }),
                new Paragraph({
                    children: [new TextRun({ text: "2. What 'capital' does Dylan have that money can't buy?", bold: true })],
                    spacing: { before: 200, after: 400 }
                }),
                new Paragraph({ text: "____________________________________________________________________________________" }),

                // Reflection
                new Paragraph({
                    children: [new TextRun({ text: "Reflection:", bold: true, size: 24, color: THEME.blue })],
                    spacing: { before: 400, after: 100 }
                }),
                new Paragraph({
                    text: "Does the person with the most money always make the best plane? Why or why not?",
                    spacing: { after: 400 }
                }),
                new Paragraph({ text: "____________________________________________________________________________________" }),
            ]
        }]
    });

    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(filename, buffer);
}

// --- ASSESSMENT GENERATION ---
async function generateAssessment(filename) {
    const questions = [
        {
            q: "1. Which word best describes the cultural context of Waleup?",
            a: "A. International",
            b: "B. Regional",
            c: "C. Urban",
            d: "D. Futuristic",
            ans: "B"
        },
        {
            q: "2. What is an example of 'Economic Capital' in the story?",
            a: "A. Grandpa's advice",
            b: "B. Dylan's determination",
            c: "C. Jason's wind tunnel",
            d: "D. The eagle's flight",
            ans: "C"
        },
        {
            q: "3. How does the setting of Tokyo contrast with Waleup?",
            a: "A. It is quieter and drier.",
            b: "B. It is more isolated and small.",
            c: "C. It is busy, bright, and international.",
            d: "D. It is exactly the same as Waleup.",
            ans: "C"
        },
        {
            q: "4. What type of capital does Dylan get from his Grandfather?",
            a: "A. Millions of dollars",
            b: "B. Cultural wisdom and support",
            c: "C. High-tech machinery",
            d: "D. A commercial flight",
            ans: "B"
        },
        {
            q: "5. Why does the author include these different contexts?",
            a: "A. To make the book longer.",
            b: "B. To show that money is the only way to win.",
            c: "C. To highlight that character and passion are important regardless of resources.",
            d: "D. Because he forgot where Dylan lived.",
            ans: "C"
        },
        {
            q: "6. What does Waleup represent for Dylan?",
            a: "A. A place of endless wealth.",
            b: "B. A quiet, regional starting point for his dreams.",
            c: "C. A high-tech international city.",
            d: "D. A place he never wants to return to.",
            ans: "B"
        },
        {
            q: "7. Why is Jason's access to a wind tunnel considered 'Economic Capital'?",
            a: "A. Because it is a form of scientific wisdom.",
            b: "B. Because it is an expensive resource bought with money.",
            c: "C. Because it is an Australian tradition.",
            d: "D. Because everyone has one in their backyard.",
            ans: "B"
        },
        {
            q: "8. Which character provides Dylan with the most 'Social Capital' (connections and support)?",
            a: "A. Jason",
            b: "B. His Grandfather",
            c: "C. The competition judges",
            d: "D. The pilot of the plane to Tokyo.",
            ans: "B"
        },
        {
            q: "9. How does the context of Tokyo challenge Dylan?",
            a: "A. It is too similar to Waleup.",
            b: "B. It makes him feel like a small 'regional' boy on a giant global stage.",
            c: "C. He doesn't like the food.",
            d: "D. He has too much money there.",
            ans: "B"
        },
        {
            q: "10. What is the main message about 'capital' in Paper Planes?",
            a: "A. You can only win if you are rich.",
            b: "B. Economic capital is more important than family.",
            c: "C. Cultural and social capital (heart and wisdom) can be more powerful than money.",
            d: "D. Paper planes are too expensive for most kids.",
            ans: "C"
        }
    ];

    const children = [
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "Lesson 1 Assessment: Context & Capital", bold: true, size: 32 })],
            spacing: { after: 400 }
        })
    ];

    questions.forEach(item => {
        children.push(new Paragraph({ text: item.q, bold: true, spacing: { before: 200 } }));
        children.push(new Paragraph({ text: item.a }));
        children.push(new Paragraph({ text: item.b }));
        children.push(new Paragraph({ text: item.c }));
        children.push(new Paragraph({ text: item.d }));
        children.push(new Paragraph({ text: `ANSWER: ${item.ans}`, spacing: { after: 100 } }));
        children.push(new Paragraph({ text: `POINT: 1`, spacing: { after: 200 } }));
    });

    const doc = new Document({ sections: [{ children }] });
    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(filename, buffer);
}

// --- MAIN ---
async function run() {
    console.log("Generating Handout...");
    try {
        await generateHandout(path.join(__dirname, 'Lesson_1_Handout.docx'));
        console.log("✅ Handout generated: Lesson_1_Handout.docx");
    } catch (e) {
        console.error("❌ Failed to save Handout (is it open?):", e.message);
    }

    console.log("Generating Assessment...");
    const quizPath = path.join(__dirname, 'Lesson_1_Forms_Quiz.docx');
    try {
        await generateAssessment(quizPath);
        console.log("✅ Assessment generated: Lesson_1_Forms_Quiz.docx");
    } catch (e) {
        console.error("❌ Failed to save Assessment (is it open?):", e.message);
        const fallbackPath = path.join(__dirname, 'Lesson_1_Forms_Quiz_Updated.docx');
        try {
            await generateAssessment(fallbackPath);
            console.log("✅ Saved updated quiz to fallback: Lesson_1_Forms_Quiz_Updated.docx");
        } catch (fError) {
            console.error("❌ Failed to save fallback assessment:", fError.message);
        }
    }
    console.log("Done!");
}

run().catch(console.error);
