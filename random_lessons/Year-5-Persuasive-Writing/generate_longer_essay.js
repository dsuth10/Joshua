const { Document, Packer, Paragraph, TextRun, AlignmentType } = require('docx');
const fs = require('fs');

const THEME = {
    navy: '112D4E'
};

async function generateLongerEssay() {
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
                new Paragraph({ text: "The Benefits of an Extended School Day", style: "Heading1" }),

                // Intro
                new Paragraph({
                    children: [
                        new TextRun({ text: "How can we ensure that every student has the time they need to truly succeed? ", italics: true }),
                        new TextRun("While some might argue for shorter days, the evidence suggests that adding one hour to our current school schedule would be a transformative change. By extending the school day to seven hours, we can provide better academic support, significantly reduce the burden of homework, and better prepare students for the demands of high school and beyond.")
                    ],
                    spacing: { before: 200, after: 200 }
                }),

                // Paragraph 1: Academic Support (PEEL - No Color)
                new Paragraph({
                    children: [
                        new TextRun({ text: "An extended school day would provide vital extra time for academic support and mastery. ", bold: true }),
                        new TextRun("In a standard six-hour day, teachers are often forced to rush through complex topics like mathematics and science to keep up with the curriculum. "),
                        new TextRun("By adding an extra hour, teachers could facilitate more hands-on experiments and small-group rotations, which are proven to help students understand difficult concepts more deeply. "),
                        new TextRun("Therefore, a longer day ensures that no student is left behind because of a crowded timetable.")
                    ],
                    spacing: { before: 200, after: 200 }
                }),

                // Paragraph 2: Homework Reduction (PEEL - No Color)
                new Paragraph({
                    children: [
                        new TextRun({ text: "Furthermore, a seven-hour day would lead to a significant reduction in the amount of homework students need to take home. ", bold: true }),
                        new TextRun("Currently, many students spend their evenings struggling with assignments without a teacher nearby to answer their questions. "),
                        new TextRun("The final hour of an extended day could be dedicated to supervised study, allowing students to complete their work in a quiet environment with immediate access to help. "),
                        new TextRun("As a result, students would return home with their evenings free to rest and connect with their families, leading to a much better work-life balance for young people.")
                    ],
                    spacing: { before: 200, after: 200 }
                }),

                // Paragraph 3: Preparation (PEEL - No Color)
                new Paragraph({
                    children: [
                        new TextRun({ text: "Finally, a longer school day better prepares students for the realities of future study and life. ", bold: true }),
                        new TextRun("High school and university involve significantly longer hours of commitment, and transitioning from a short primary school day can be a major shock to the system. "),
                        new TextRun("Gradually increasing the length of the school day in Year 5 helps build the stamina and time-management skills that are essential for long-term success. "),
                        new TextRun("By embracing a seven-hour day, we are teaching our students the value of persistence and preparing them for a bright and productive future.")
                    ],
                    spacing: { before: 200, after: 200 }
                }),

                // Conclusion
                new Paragraph({
                    children: [
                        new TextRun("In conclusion, extending the school day is not about making school harder, but about making it better. It provides the space for deeper learning, removes the stress of evening homework, and builds the skills needed for future life. We must invest this extra hour into our children's education to ensure they have every opportunity to shine. Let's extend the day and expand their potential!")
                    ],
                    spacing: { before: 300, after: 200 }
                })
            ]
        }]
    });

    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync("c:/Users/dsuth/Documents/Joshua/random_lessons/Year-5-Persuasive-Writing/Persuasive_Essay_Longer_Day.docx", buffer);
    console.log("Longer essay document generated successfully.");
}

generateLongerEssay().catch(console.error);
