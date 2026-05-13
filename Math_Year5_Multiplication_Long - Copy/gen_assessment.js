const { Document, Packer, Paragraph, TextRun, AlignmentType } = require('docx');
const fs = require('fs');

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 24 } } }
  },
  sections: [{
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Quantum Quest: Long Multiplication Assessment", bold: true, size: 32 })]
      }),
      new Paragraph({ spacing: { before: 240 } }),

      // Question 1
      new Paragraph({ children: [new TextRun("1. Solve 12 x 24.")] }),
      new Paragraph({ children: [new TextRun("A. 288")] }),
      new Paragraph({ children: [new TextRun("B. 248")] }),
      new Paragraph({ children: [new TextRun("C. 264")] }),
      new Paragraph({ children: [new TextRun("D. 312")] }),
      new Paragraph({ children: [new TextRun("ANSWER: A")] }),
      new Paragraph({ children: [new TextRun("POINT: 1")] }),
      new Paragraph({ spacing: { before: 120 } }),

      // Question 2
      new Paragraph({ children: [new TextRun("2. In the equation 43 x 36, what is the first partial product (multiplying 43 by 6)?")] }),
      new Paragraph({ children: [new TextRun("A. 258")] }),
      new Paragraph({ children: [new TextRun("B. 240")] }),
      new Paragraph({ children: [new TextRun("C. 129")] }),
      new Paragraph({ children: [new TextRun("D. 285")] }),
      new Paragraph({ children: [new TextRun("ANSWER: A")] }),
      new Paragraph({ children: [new TextRun("POINT: 1")] }),
      new Paragraph({ spacing: { before: 120 } }),

      // Question 3
      new Paragraph({ children: [new TextRun("3. Why do we place a '0' in the second row of a long multiplication calculation?")] }),
      new Paragraph({ children: [new TextRun("A. Because the ones digit is always zero.")] }),
      new Paragraph({ children: [new TextRun("B. Because we are multiplying by a multiple of 10.")] }),
      new Paragraph({ children: [new TextRun("C. To make the sum look bigger.")] }),
      new Paragraph({ children: [new TextRun("D. Because we finished the calculation.")] }),
      new Paragraph({ children: [new TextRun("ANSWER: B")] }),
      new Paragraph({ children: [new TextRun("POINT: 1")] }),
      new Paragraph({ spacing: { before: 120 } }),

      // Question 4
      new Paragraph({ children: [new TextRun("4. Solve 35 x 14.")] }),
      new Paragraph({ children: [new TextRun("A. 490")] }),
      new Paragraph({ children: [new TextRun("B. 350")] }),
      new Paragraph({ children: [new TextRun("C. 440")] }),
      new Paragraph({ children: [new TextRun("D. 510")] }),
      new Paragraph({ children: [new TextRun("ANSWER: A")] }),
      new Paragraph({ children: [new TextRun("POINT: 1")] }),
      new Paragraph({ spacing: { before: 120 } }),

      // Question 5
      new Paragraph({ children: [new TextRun("5. The Cosmic Coaster has 15 carriages. Each carriage holds 12 people. How many people can ride in total?")] }),
      new Paragraph({ children: [new TextRun("A. 150")] }),
      new Paragraph({ children: [new TextRun("B. 165")] }),
      new Paragraph({ children: [new TextRun("C. 180")] }),
      new Paragraph({ children: [new TextRun("D. 192")] }),
      new Paragraph({ children: [new TextRun("ANSWER: C")] }),
      new Paragraph({ children: [new TextRun("POINT: 1")] })
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("Math_Year5_Multiplication_Long/assessment_forms.docx", buffer);
  console.log("Assessment generated successfully.");
});
