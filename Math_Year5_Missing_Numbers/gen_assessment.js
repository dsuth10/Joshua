const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } = require('docx');

const NAVY = "112D4E";
const ORANGE = "F96D00";

const doc = new Document({
    styles: {
        default: { document: { run: { font: "Arial", size: 24 } } },
        paragraphStyles: [
            { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
              run: { size: 36, bold: true, color: ORANGE, font: "Arial" },
              paragraph: { spacing: { before: 240, after: 120 }, alignment: AlignmentType.CENTER } },
        ]
    },
    sections: [{
        properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
        children: [
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Assessment: Finding Missing Numbers")] }),
            new Paragraph({ children: [new TextRun("Answer the following questions to show your understanding of inverse operations.")] }),
            new Paragraph({ spacing: { after: 240 } }),

            // Question 1
            new Paragraph({ children: [new TextRun("1. What is the missing number in: □ + 37 = 40?")] }),
            new Paragraph({ children: [new TextRun("A. 77")] }),
            new Paragraph({ children: [new TextRun("B. 3")] }),
            new Paragraph({ children: [new TextRun("C. 13")] }),
            new Paragraph({ children: [new TextRun("D. 40")] }),
            new Paragraph({ children: [new TextRun("ANSWER: B")] }),
            new Paragraph({ children: [new TextRun("POINT: 1")] }),
            new Paragraph({ spacing: { after: 120 } }),

            // Question 2
            new Paragraph({ children: [new TextRun("2. Which operation is the inverse of multiplication?")] }),
            new Paragraph({ children: [new TextRun("A. Addition")] }),
            new Paragraph({ children: [new TextRun("B. Subtraction")] }),
            new Paragraph({ children: [new TextRun("C. Division")] }),
            new Paragraph({ children: [new TextRun("D. Square root")] }),
            new Paragraph({ children: [new TextRun("ANSWER: C")] }),
            new Paragraph({ children: [new TextRun("POINT: 1")] }),
            new Paragraph({ spacing: { after: 120 } }),

            // Question 3
            new Paragraph({ children: [new TextRun("3. Solve for □: □ × 8 = 24")] }),
            new Paragraph({ children: [new TextRun("A. 3")] }),
            new Paragraph({ children: [new TextRun("B. 16")] }),
            new Paragraph({ children: [new TextRun("C. 32")] }),
            new Paragraph({ children: [new TextRun("D. 4")] }),
            new Paragraph({ children: [new TextRun("ANSWER: A")] }),
            new Paragraph({ children: [new TextRun("POINT: 1")] }),
            new Paragraph({ spacing: { after: 120 } }),

            // Question 4
            new Paragraph({ children: [new TextRun("4. Find the unknown: 12 ÷ □ = 3")] }),
            new Paragraph({ children: [new TextRun("A. 36")] }),
            new Paragraph({ children: [new TextRun("B. 9")] }),
            new Paragraph({ children: [new TextRun("C. 4")] }),
            new Paragraph({ children: [new TextRun("D. 15")] }),
            new Paragraph({ children: [new TextRun("ANSWER: C")] }),
            new Paragraph({ children: [new TextRun("POINT: 1")] }),
            new Paragraph({ spacing: { after: 120 } }),

            // Question 5
            new Paragraph({ children: [new TextRun("5. Solve for □: 56 = □ - 37")] }),
            new Paragraph({ children: [new TextRun("A. 19")] }),
            new Paragraph({ children: [new TextRun("B. 93")] }),
            new Paragraph({ children: [new TextRun("C. 83")] }),
            new Paragraph({ children: [new TextRun("D. 21")] }),
            new Paragraph({ children: [new TextRun("ANSWER: B")] }),
            new Paragraph({ children: [new TextRun("POINT: 1")] }),
            new Paragraph({ spacing: { after: 120 } }),

            // Question 6
            new Paragraph({ children: [new TextRun("6. What is the missing number: 9 × □ = 63?")] }),
            new Paragraph({ children: [new TextRun("A. 7")] }),
            new Paragraph({ children: [new TextRun("B. 6")] }),
            new Paragraph({ children: [new TextRun("C. 8")] }),
            new Paragraph({ children: [new TextRun("D. 9")] }),
            new Paragraph({ children: [new TextRun("ANSWER: A")] }),
            new Paragraph({ children: [new TextRun("POINT: 1")] }),
            new Paragraph({ spacing: { after: 120 } }),

            // Question 7
            new Paragraph({ children: [new TextRun("7. Solve for □: 1000 ÷ □ = 8")] }),
            new Paragraph({ children: [new TextRun("A. 125")] }),
            new Paragraph({ children: [new TextRun("B. 8000")] }),
            new Paragraph({ children: [new TextRun("C. 100")] }),
            new Paragraph({ children: [new TextRun("D. 250")] }),
            new Paragraph({ children: [new TextRun("ANSWER: A")] }),
            new Paragraph({ children: [new TextRun("POINT: 1")] }),
            new Paragraph({ spacing: { after: 120 } }),

            // Question 8
            new Paragraph({ children: [new TextRun("8. Which operation would you use to solve: □ - 15 = 10?")] }),
            new Paragraph({ children: [new TextRun("A. 10 - 15")] }),
            new Paragraph({ children: [new TextRun("B. 10 ÷ 15")] }),
            new Paragraph({ children: [new TextRun("C. 10 + 15")] }),
            new Paragraph({ children: [new TextRun("D. 15 ÷ 10")] }),
            new Paragraph({ children: [new TextRun("ANSWER: C")] }),
            new Paragraph({ children: [new TextRun("POINT: 1")] }),
            new Paragraph({ spacing: { after: 120 } }),

            // Question 9
            new Paragraph({ children: [new TextRun("9. Solve for □: 180 - □ = 60")] }),
            new Paragraph({ children: [new TextRun("A. 240")] }),
            new Paragraph({ children: [new TextRun("B. 120")] }),
            new Paragraph({ children: [new TextRun("C. 100")] }),
            new Paragraph({ children: [new TextRun("D. 60")] }),
            new Paragraph({ children: [new TextRun("ANSWER: B")] }),
            new Paragraph({ children: [new TextRun("POINT: 1")] }),
            new Paragraph({ spacing: { after: 120 } }),

            // Question 10
            new Paragraph({ children: [new TextRun("10. Solve the challenge: (□ × 5) = 25")] }),
            new Paragraph({ children: [new TextRun("A. 125")] }),
            new Paragraph({ children: [new TextRun("B. 5")] }),
            new Paragraph({ children: [new TextRun("C. 20")] }),
            new Paragraph({ children: [new TextRun("D. 30")] }),
            new Paragraph({ children: [new TextRun("ANSWER: B")] }),
            new Paragraph({ children: [new TextRun("POINT: 1")] }),
        ]
    }]
});

Packer.toBuffer(doc).then(buffer => {
    fs.writeFileSync("Finding_Missing_Numbers_Assessment.docx", buffer);
    console.log("Assessment generated successfully.");
});
