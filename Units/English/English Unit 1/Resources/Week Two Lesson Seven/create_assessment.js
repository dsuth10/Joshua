const { Document, Packer, Paragraph, TextRun, AlignmentType, ShadingType } = require("docx");
const fs = require("fs");

// Question Data
const quizData = [
  {
    q: "1. What does the Aussie slang term 'Mate' primarily represent in the novel Paper Planes?",
    a: "A. A sign of being bossy",
    b: "B. A sign of equality and friendship",
    c: "C. A way to call someone you don't like",
    d: "D. A formal title for a teacher",
    correct: "B"
  },
  {
    q: "2. If Dylan says something is 'Bonza', how does he feel about it?",
    a: "A. He thinks it is excellent or great",
    b: "B. He thinks it is boring",
    c: "C. He thinks it is too expensive",
    d: "D. He thinks it is broken",
    correct: "A"
  },
  {
    q: "3. Which of these is the most likely meaning of 'Fair dinkum'?",
    a: "A. It is unfair",
    b: "B. Something that is cheap",
    c: "C. It is honest or true",
    d: "D. A type of small bird",
    correct: "C"
  },
  {
    q: "4. What is an 'Esky' used for in Australia?",
    a: "A. A type of hat",
    b: "B. Keeping food and drinks cold",
    c: "C. A surfboard",
    d: "D. A fast car",
    correct: "B"
  },
  {
    q: "5. When Dylan is 'stoked' about his paper plane, it means he is:",
    a: "A. Very tired",
    b: "B. Very angry",
    c: "C. Very excited and happy",
    d: "D. Very confused",
    correct: "C"
  },
  {
    q: "6. What does 'Code-Switching' mean in the context of language?",
    a: "A. Changing batteries in a remote",
    b: "B. Learning a secret code",
    c: "C. Changing how you speak based on who you are talking to",
    d: "D. Speaking as fast as possible",
    correct: "C"
  },
  {
    q: "7. If Dylan is encouraged to 'Av-a-go', what are people asking him to do?",
    a: "A. To leave the room",
    b: "B. To try his best",
    c: "C. To stop playing",
    d: "D. To go to sleep",
    correct: "B"
  },
  {
    q: "8. Which term best describes the casual language Dylan uses with his dad?",
    a: "A. Formal language",
    b: "B. Professional language",
    c: "C. Informal language",
    d: "D. Scientific language",
    correct: "C"
  },
  {
    q: "9. Why does the author use slang words like 'no worries' or 'reckon' in Paper Planes?",
    a: "A. To make the story harder to read",
    b: "B. To make the characters and setting feel realistic",
    c: "C. To save space on the page",
    d: "D. Because they forgot the real words",
    correct: "B"
  },
  {
    q: "10. If Dylan says 'G'day', what is he doing?",
    a: "A. Wishing someone a happy birthday",
    b: "B. Asking for the time",
    c: "C. Greeting someone casually",
    d: "D. Complaining about the weather",
    correct: "C"
  }
];

const docChildren = [
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({
        text: "Slang and Idioms Assessment: Paper Planes",
        bold: true,
        size: 32, // 16pt
        font: "Arial"
      })
    ],
    spacing: { after: 400 }
  })
];

quizData.forEach((item) => {
  docChildren.push(new Paragraph({
    children: [new TextRun({ text: item.q, font: "Arial", size: 24 })],
    spacing: { before: 200 }
  }));
  docChildren.push(new Paragraph({
    children: [new TextRun({ text: item.a, font: "Arial", size: 24 })]
  }));
  docChildren.push(new Paragraph({
    children: [new TextRun({ text: item.b, font: "Arial", size: 24 })]
  }));
  docChildren.push(new Paragraph({
    children: [new TextRun({ text: item.c, font: "Arial", size: 24 })]
  }));
  docChildren.push(new Paragraph({
    children: [new TextRun({ text: item.d, font: "Arial", size: 24 })]
  }));
  docChildren.push(new Paragraph({
    children: [new TextRun({ text: `ANS: ${item.correct}`, font: "Arial", size: 24, bold: true })],
    spacing: { after: 200 }
  }));
});

const doc = new Document({
  sections: [{
    children: docChildren
  }]
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("Slang_Assessment_Forms.docx", buffer);
  console.log("Successfully created Slang_Assessment_Forms.docx");
});
