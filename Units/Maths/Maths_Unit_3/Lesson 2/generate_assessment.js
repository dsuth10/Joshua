const fs = require('fs');
const path = require('path');
const { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } = require('docx');

const THEME = {
    navy: '1B4F72',
    teal: '17A589',
    grey: '7F8C8D'
};

const doc = new Document({
    styles: {
        default: {
            document: {
                run: {
                    font: "Arial",
                    size: 24, // 12pt
                    color: "2D3748" // Dark slate text
                }
            }
        },
        paragraphStyles: [
            {
                id: "Heading1",
                name: "Heading 1",
                basedOn: "Normal",
                next: "Normal",
                quickFormat: true,
                run: { size: 36, bold: true, color: THEME.navy, font: "Arial" }, // 18pt
                paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 }
            }
        ]
    },
    sections: [{
        properties: {
            page: {
                margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }, // 1 inch margins
                size: { width: 11906, height: 16838 } // A4 standard size
            }
        },
        children: [
            // Title & Metadata
            new Paragraph({
                heading: HeadingLevel.HEADING_1,
                alignment: AlignmentType.CENTER,
                children: [
                    new TextRun({ text: "Mathematics Unit 2 — Lesson 15 Assessment", bold: true })
                ]
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 240 },
                children: [
                    new TextRun({ text: "Converting Metric Units of Length (Australian Curriculum v9)", italics: true, color: "555555" })
                ]
            }),

            // Student Fields
            new Paragraph({
                spacing: { after: 120 },
                children: [
                    new TextRun({ text: "Student Name: ____________________   Date: ___________   Class: _________", bold: true, color: THEME.navy })
                ]
            }),
            new Paragraph({
                spacing: { after: 240 },
                children: [
                    new TextRun({ text: "Instructions: ", bold: true }),
                    new TextRun({ text: "Read each question carefully. Perform the length conversions using your place value rules (multiplying or dividing by 10, 100, or 1000). Choose the single correct option for each question and mark it clearly." })
                ]
            }),

            // --- SECTION 1: BASIC CONVERSIONS (WHOLE NUMBERS) ---
            new Paragraph({
                children: [new TextRun({ text: "Section 1: Basic Unit Conversions (Whole Numbers)", bold: true, color: THEME.navy, size: 28 })],
                spacing: { before: 200, after: 100 }
            }),

            // Question 1
            new Paragraph({ spacing: { before: 100, after: 60 } }),
            new Paragraph({
                children: [
                    new TextRun({ text: "1. Convert 8 centimetres (cm) into millimetres (mm).", bold: true })
                ]
            }),
            new Paragraph({ children: [new TextRun({ text: "A) 0.8 mm" })] }),
            new Paragraph({ children: [new TextRun({ text: "B) 80 mm" })] }),
            new Paragraph({ children: [new TextRun({ text: "C) 800 mm" })] }),
            new Paragraph({ children: [new TextRun({ text: "D) 8000 mm" })] }),
            new Paragraph({ children: [new TextRun({ text: "ANSWER: B", bold: true, color: THEME.teal })] }),
            new Paragraph({ children: [new TextRun({ text: "POINT: 1", bold: true, color: THEME.grey })] }),

            // Question 2
            new Paragraph({ spacing: { before: 200, after: 60 } }),
            new Paragraph({
                children: [
                    new TextRun({ text: "2. Convert 400 centimetres (cm) into metres (m).", bold: true })
                ]
            }),
            new Paragraph({ children: [new TextRun({ text: "A) 4 m" })] }),
            new Paragraph({ children: [new TextRun({ text: "B) 40 m" })] }),
            new Paragraph({ children: [new TextRun({ text: "C) 0.4 m" })] }),
            new Paragraph({ children: [new TextRun({ text: "D) 4000 m" })] }),
            new Paragraph({ children: [new TextRun({ text: "ANSWER: A", bold: true, color: THEME.teal })] }),
            new Paragraph({ children: [new TextRun({ text: "POINT: 1", bold: true, color: THEME.grey })] }),

            // Question 3
            new Paragraph({ spacing: { before: 200, after: 60 } }),
            new Paragraph({
                children: [
                    new TextRun({ text: "3. How many metres (m) are there in 6 kilometres (km)?", bold: true })
                ]
            }),
            new Paragraph({ children: [new TextRun({ text: "A) 60 m" })] }),
            new Paragraph({ children: [new TextRun({ text: "B) 600 m" })] }),
            new Paragraph({ children: [new TextRun({ text: "C) 6000 m" })] }),
            new Paragraph({ children: [new TextRun({ text: "D) 60000 m" })] }),
            new Paragraph({ children: [new TextRun({ text: "ANSWER: C", bold: true, color: THEME.teal })] }),
            new Paragraph({ children: [new TextRun({ text: "POINT: 1", bold: true, color: THEME.grey })] }),

            // Question 4
            new Paragraph({ spacing: { before: 200, after: 60 } }),
            new Paragraph({
                children: [
                    new TextRun({ text: "4. Convert 120 millimetres (mm) into centimetres (cm).", bold: true })
                ]
            }),
            new Paragraph({ children: [new TextRun({ text: "A) 1.2 cm" })] }),
            new Paragraph({ children: [new TextRun({ text: "B) 12 cm" })] }),
            new Paragraph({ children: [new TextRun({ text: "C) 120 cm" })] }),
            new Paragraph({ children: [new TextRun({ text: "D) 0.12 cm" })] }),
            new Paragraph({ children: [new TextRun({ text: "ANSWER: B", bold: true, color: THEME.teal })] }),
            new Paragraph({ children: [new TextRun({ text: "POINT: 1", bold: true, color: THEME.grey })] }),

            // --- SECTION 2: DECIMAL AND FRACTION CONVERSIONS ---
            new Paragraph({
                children: [new TextRun({ text: "Section 2: Conversions Involving Decimals and Fractions", bold: true, color: THEME.navy, size: 28 })],
                spacing: { before: 300, after: 100 }
            }),

            // Question 5
            new Paragraph({ spacing: { before: 100, after: 60 } }),
            new Paragraph({
                children: [
                    new TextRun({ text: "5. Convert 3.5 metres (m) into centimetres (cm).", bold: true })
                ]
            }),
            new Paragraph({ children: [new TextRun({ text: "A) 35 cm" })] }),
            new Paragraph({ children: [new TextRun({ text: "B) 350 cm" })] }),
            new Paragraph({ children: [new TextRun({ text: "C) 3500 cm" })] }),
            new Paragraph({ children: [new TextRun({ text: "D) 0.35 cm" })] }),
            new Paragraph({ children: [new TextRun({ text: "ANSWER: B", bold: true, color: THEME.teal })] }),
            new Paragraph({ children: [new TextRun({ text: "POINT: 1", bold: true, color: THEME.grey })] }),

            // Question 6
            new Paragraph({ spacing: { before: 200, after: 60 } }),
            new Paragraph({
                children: [
                    new TextRun({ text: "6. A piece of craft ribbon is 0.45 metres (m) long. What is this length in centimetres (cm)?", bold: true })
                ]
            }),
            new Paragraph({ children: [new TextRun({ text: "A) 4.5 cm" })] }),
            new Paragraph({ children: [new TextRun({ text: "B) 45 cm" })] }),
            new Paragraph({ children: [new TextRun({ text: "C) 450 cm" })] }),
            new Paragraph({ children: [new TextRun({ text: "D) 0.045 cm" })] }),
            new Paragraph({ children: [new TextRun({ text: "ANSWER: B", bold: true, color: THEME.teal })] }),
            new Paragraph({ children: [new TextRun({ text: "POINT: 1", bold: true, color: THEME.grey })] }),

            // Question 7
            new Paragraph({ spacing: { before: 200, after: 60 } }),
            new Paragraph({
                children: [
                    new TextRun({ text: "7. Convert 75 metres (m) into kilometres (km).", bold: true })
                ]
            }),
            new Paragraph({ children: [new TextRun({ text: "A) 0.075 km" })] }),
            new Paragraph({ children: [new TextRun({ text: "B) 0.75 km" })] }),
            new Paragraph({ children: [new TextRun({ text: "C) 7.5 km" })] }),
            new Paragraph({ children: [new TextRun({ text: "D) 75000 km" })] }),
            new Paragraph({ children: [new TextRun({ text: "ANSWER: A", bold: true, color: THEME.teal })] }),
            new Paragraph({ children: [new TextRun({ text: "POINT: 1", bold: true, color: THEME.grey })] }),

            // Question 8
            new Paragraph({ spacing: { before: 200, after: 60 } }),
            new Paragraph({
                children: [
                    new TextRun({ text: "8. Convert 9 1/2 centimetres (cm) into millimetres (mm).", bold: true })
                ]
            }),
            new Paragraph({ children: [new TextRun({ text: "A) 9.5 mm" })] }),
            new Paragraph({ children: [new TextRun({ text: "B) 95 mm" })] }),
            new Paragraph({ children: [new TextRun({ text: "C) 950 mm" })] }),
            new Paragraph({ children: [new TextRun({ text: "D) 9500 mm" })] }),
            new Paragraph({ children: [new TextRun({ text: "ANSWER: B", bold: true, color: THEME.teal })] }),
            new Paragraph({ children: [new TextRun({ text: "POINT: 1", bold: true, color: THEME.grey })] }),

            // --- SECTION 3: APPLIED WORD PROBLEMS ---
            new Paragraph({
                children: [new TextRun({ text: "Section 3: Applied Word Problems & Unit Comparisons", bold: true, color: THEME.navy, size: 28 })],
                spacing: { before: 300, after: 100 }
            }),

            // Question 9
            new Paragraph({ spacing: { before: 100, after: 60 } }),
            new Paragraph({
                children: [
                    new TextRun({ text: "9. Which of the following lengths is the longest?", bold: true })
                ]
            }),
            new Paragraph({ children: [new TextRun({ text: "A) 1.6 m" })] }),
            new Paragraph({ children: [new TextRun({ text: "B) 155 cm" })] }),
            new Paragraph({ children: [new TextRun({ text: "C) 1500 mm" })] }),
            new Paragraph({ children: [new TextRun({ text: "D) 0.001 km" })] }),
            new Paragraph({ children: [new TextRun({ text: "ANSWER: A", bold: true, color: THEME.teal })] }),
            new Paragraph({ children: [new TextRun({ text: "POINT: 1", bold: true, color: THEME.grey })] }),

            // Question 10
            new Paragraph({ spacing: { before: 200, after: 60 } }),
            new Paragraph({
                children: [
                    new TextRun({ text: "10. A standard classroom desk is 120 centimetres (cm) wide. How wide is the desk in metres (m)?", bold: true })
                ]
            }),
            new Paragraph({ children: [new TextRun({ text: "A) 0.12 m" })] }),
            new Paragraph({ children: [new TextRun({ text: "B) 1.2 m" })] }),
            new Paragraph({ children: [new TextRun({ text: "C) 12 m" })] }),
            new Paragraph({ children: [new TextRun({ text: "D) 1200 m" })] }),
            new Paragraph({ children: [new TextRun({ text: "ANSWER: B", bold: true, color: THEME.teal })] }),
            new Paragraph({ children: [new TextRun({ text: "POINT: 1", bold: true, color: THEME.grey })] }),

            // Question 11
            new Paragraph({ spacing: { before: 200, after: 60 } }),
            new Paragraph({
                children: [
                    new TextRun({ text: "11. A ladybug is 8 millimetres (mm) long. A caterpillar is 5.2 centimetres (cm) long. How much longer is the caterpillar than the ladybug, in millimetres (mm)?", bold: true })
                ]
            }),
            new Paragraph({ children: [new TextRun({ text: "A) 4.4 mm" })] }),
            new Paragraph({ children: [new TextRun({ text: "B) 44 mm" })] }),
            new Paragraph({ children: [new TextRun({ text: "C) 50 mm" })] }),
            new Paragraph({ children: [new TextRun({ text: "D) 60 mm" })] }),
            new Paragraph({ children: [new TextRun({ text: "ANSWER: B", bold: true, color: THEME.teal })] }),
            new Paragraph({ children: [new TextRun({ text: "POINT: 1", bold: true, color: THEME.grey })] }),

            // Question 12
            new Paragraph({ spacing: { before: 200, after: 60 } }),
            new Paragraph({
                children: [
                    new TextRun({ text: "12. Tom walked 1.4 kilometres (km) to the local park and then another 750 metres (m) to the shops. What is the total distance Tom walked, in metres (m)?", bold: true })
                ]
            }),
            new Paragraph({ children: [new TextRun({ text: "A) 890 m" })] }),
            new Paragraph({ children: [new TextRun({ text: "B) 2150 m" })] }),
            new Paragraph({ children: [new TextRun({ text: "C) 21500 m" })] }),
            new Paragraph({ children: [new TextRun({ text: "D) 14750 m" })] }),
            new Paragraph({ children: [new TextRun({ text: "ANSWER: B", bold: true, color: THEME.teal })] }),
            new Paragraph({ children: [new TextRun({ text: "POINT: 1", bold: true, color: THEME.grey })] }),

            // --- SECTION 4: MULTI-STEP CHALLENGES ---
            new Paragraph({
                children: [new TextRun({ text: "Section 4: Multi-Step & Complex Conversion Challenges", bold: true, color: THEME.navy, size: 28 })],
                spacing: { before: 300, after: 100 }
            }),

            // Question 13
            new Paragraph({ spacing: { before: 100, after: 60 } }),
            new Paragraph({
                children: [
                    new TextRun({ text: "13. A carpenter has a timber plank that is 2.8 metres (m) long. He cuts off a piece that is 95 centimetres (cm) long to make a shelf. How many centimetres (cm) of the timber plank are left over?", bold: true })
                ]
            }),
            new Paragraph({ children: [new TextRun({ text: "A) 185 cm" })] }),
            new Paragraph({ children: [new TextRun({ text: "B) 195 cm" })] }),
            new Paragraph({ children: [new TextRun({ text: "C) 2705 cm" })] }),
            new Paragraph({ children: [new TextRun({ text: "D) 2895 cm" })] }),
            new Paragraph({ children: [new TextRun({ text: "ANSWER: A", bold: true, color: THEME.teal })] }),
            new Paragraph({ children: [new TextRun({ text: "POINT: 1", bold: true, color: THEME.grey })] }),

            // Question 14
            new Paragraph({ spacing: { before: 200, after: 60 } }),
            new Paragraph({
                children: [
                    new TextRun({ text: "14. A rectangular playground has a length of 350 centimetres (cm) and a width of 2.4 metres (m). What is the total perimeter of the playground in metres (m)?", bold: true })
                ]
            }),
            new Paragraph({ children: [new TextRun({ text: "A) 5.9 m" })] }),
            new Paragraph({ children: [new TextRun({ text: "B) 11.8 m" })] }),
            new Paragraph({ children: [new TextRun({ text: "C) 1180 m" })] }),
            new Paragraph({ children: [new TextRun({ text: "D) 704.8 m" })] }),
            new Paragraph({ children: [new TextRun({ text: "ANSWER: B", bold: true, color: THEME.teal })] }),
            new Paragraph({ children: [new TextRun({ text: "POINT: 1", bold: true, color: THEME.grey })] }),

            // Question 15
            new Paragraph({ spacing: { before: 200, after: 60 } }),
            new Paragraph({
                children: [
                    new TextRun({ text: "15. A walking track around a school oval is exactly 400 metres (m) long. If Sarah runs around the oval 8 times during physical education, how many kilometres (km) has she run in total?", bold: true })
                ]
            }),
            new Paragraph({ children: [new TextRun({ text: "A) 3.2 km" })] }),
            new Paragraph({ children: [new TextRun({ text: "B) 32 km" })] }),
            new Paragraph({ children: [new TextRun({ text: "C) 0.32 km" })] }),
            new Paragraph({ children: [new TextRun({ text: "D) 3200 km" })] }),
            new Paragraph({ children: [new TextRun({ text: "ANSWER: A", bold: true, color: THEME.teal })] }),
            new Paragraph({ children: [new TextRun({ text: "POINT: 1", bold: true, color: THEME.grey })] })
        ]
    }]
});

const outputPath = path.join(__dirname, 'Assessment_Forms.docx');
Packer.toBuffer(doc).then(buffer => {
    fs.writeFileSync(outputPath, buffer);
    console.log(`Successfully generated ${outputPath}`);
}).catch(err => {
    console.error('Error generating document:', err);
    process.exit(1);
});
