const { Document, Packer, Paragraph, TextRun, AlignmentType, ShadingType, HeadingLevel } = require('docx');
const fs = require('fs');

const THEME = {
    navy: '112D4E',
    orange: 'F96D00', // Evidence
    blue: '3F72AF',   // Point
    green: '4E9F3D',  // Elaboration
    red: 'C0392B'     // Link
};

async function generateEssay() {
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
                    run: { size: 36, bold: true, color: THEME.navy, font: "Arial" },
                    paragraph: { spacing: { before: 400, after: 200 }, alignment: AlignmentType.CENTER, outlineLevel: 0 }
                }
            ]
        },
        sections: [{
            properties: { 
                page: { 
                    margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
                    size: { width: 11906, height: 16838 } // A4
                } 
            },
            children: [
                // Title
                new Paragraph({ text: "The Case for a Five-Hour School Day", style: "Heading1" }),

                // Intro
                new Paragraph({
                    children: [
                        new TextRun({ text: "Imagine a school where every student is energised, focused, and excited to learn. ", italics: true }),
                        new TextRun("While Australian schools currently operate for six hours a day, it is time to consider the overwhelming benefits of reducing this to five. By shortening the school day, we can dramatically improve student productivity, enhance mental well-being, and provide more time for vital extracurricular activities.")
                    ],
                    spacing: { before: 200, after: 200 }
                }),

                // Paragraph 1: Productivity
                new Paragraph({
                    children: [
                        new TextRun({ text: "A shorter school day would significantly boost student focus and productivity. ", color: THEME.blue, bold: true }),
                        new TextRun({ text: "Research shows that the human brain can only maintain peak concentration for limited periods before fatigue sets in, leading to \"diminishing returns\" in the final hour of the day. ", color: THEME.green }),
                        new TextRun({ text: "In countries with shorter school days, such as Finland, students consistently rank higher in international assessments despite spending less time in the classroom. ", color: THEME.orange }),
                        new TextRun({ text: "Therefore, cutting just one hour would ensure that every minute spent in school is used effectively for learning.", color: THEME.red })
                    ],
                    spacing: { before: 200, after: 200 }
                }),

                // Paragraph 2: Well-being
                new Paragraph({
                    children: [
                        new TextRun({ text: "Furthermore, reducing school hours would greatly improve the mental and physical well-being of young people. ", color: THEME.blue, bold: true }),
                        new TextRun({ text: "Six hours of intense study, often followed by evening homework, leaves many Year 5 students exhausted and prone to burnout. ", color: THEME.green }),
                        new TextRun({ text: "A five-hour day allows for more rest and \"down time,\" which scientists agree is essential for healthy brain development and emotional regulation. ", color: THEME.orange }),
                        new TextRun({ text: "As a result, a shorter day would create happier, more energetic students who are actually eager to attend school each morning.", color: THEME.red })
                    ],
                    spacing: { before: 200, after: 200 }
                }),

                // Paragraph 3: Extracurricular
                new Paragraph({
                    children: [
                        new TextRun({ text: "Finally, a five-hour day provides more time for vital extracurricular activities and play. ", color: THEME.blue, bold: true }),
                        new TextRun({ text: "Sports, music lessons, and creative hobbies are just as important for a child's growth as academic subjects, but they are often rushed due to the length of the standard school day. ", color: THEME.green }),
                        new TextRun({ text: "When children have more time to explore their own interests, they develop essential \"soft skills\" like teamwork, leadership, and creativity. ", color: THEME.orange }),
                        new TextRun({ text: "By shortening the day, we give students the chance to become well-rounded individuals who succeed both inside and outside the classroom.", color: THEME.red })
                    ],
                    spacing: { before: 200, after: 200 }
                }),

                // Conclusion
                new Paragraph({
                    children: [
                        new TextRun("In conclusion, the current six-hour school day is an outdated model that causes unnecessary fatigue. By switching to a five-hour day, we prioritise quality of learning over quantity of time. It is time to make this change for the sake of our students' education and health. Let's make school days shorter and learning stronger!")
                    ],
                    spacing: { before: 300, after: 200 }
                }),

                // PEEL Legend
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({ text: "PEEL Key: ", bold: true }),
                        new TextRun({ text: "Point ", color: THEME.blue, bold: true }),
                        new TextRun("| "),
                        new TextRun({ text: "Elaboration ", color: THEME.green, bold: true }),
                        new TextRun("| "),
                        new TextRun({ text: "Evidence ", color: THEME.orange, bold: true }),
                        new TextRun("| "),
                        new TextRun({ text: "Link", color: THEME.red, bold: true })
                    ],
                    spacing: { before: 400 }
                })
            ]
        }]
    });

    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync("c:/Users/dsuth/Documents/Joshua/random_lessons/Year-5-Persuasive-Writing/Persuasive_Essay_School_Hours.docx", buffer);
    console.log("Essay document generated successfully.");
}

generateEssay().catch(console.error);
