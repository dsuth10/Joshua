const { Document, Packer, Paragraph, TextRun, AlignmentType } = require('docx');
const fs = require('fs');

const questions = [
  {
    q: "1. What is the capital city of Australia?",
    a: "A. Sydney",
    b: "B. Melbourne",
    c: "C. Canberra",
    d: "D. Brisbane",
    ans: "C"
  },
  {
    q: "2. Which planet is known as the Red Planet?",
    a: "A. Venus",
    b: "B. Mars",
    c: "C. Jupiter",
    d: "D. Saturn",
    ans: "B"
  },
  {
    q: "3. What is the largest ocean on Earth?",
    a: "A. Atlantic Ocean",
    b: "B. Indian Ocean",
    c: "C. Arctic Ocean",
    d: "D. Pacific Ocean",
    ans: "D"
  },
  {
    q: "4. Who painted the Mona Lisa?",
    a: "A. Vincent van Gogh",
    b: "B. Pablo Picasso",
    c: "C. Leonardo da Vinci",
    d: "D. Claude Monet",
    ans: "C"
  },
  {
    q: "5. What is the chemical symbol for gold?",
    a: "A. Au",
    b: "B. Ag",
    c: "C. Fe",
    d: "D. Cu",
    ans: "A"
  }
];

const children = [
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "General Knowledge Quiz", bold: true, size: 32 })],
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

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync('c:\\Users\\dsuth\\Documents\\Joshua\\scratch\\Test_General_Knowledge_Quiz.docx', buffer);
  console.log("Quiz created at c:\\Users\\dsuth\\Documents\\Joshua\\scratch\\Test_General_Knowledge_Quiz.docx");
});
