const { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } = require('docx');
const fs = require('fs');
const path = require('path');

async function generateAssessment(filename) {
  const questions = [
    {
      q: "1. Which sentence is an example of an OBJECTIVE (factual) point of view?",
      a: "A. The flood was a total nightmare for everyone involved.",
      b: "B. The river peaked at 4.46 metres, causing significant damage.",
      c: "C. I felt so scared when the water started rising.",
      d: "D. The sound of the wind was absolutely deafening.",
      ans: "B"
    },
    {
      q: "2. What is the primary focus of a SUBJECTIVE point of view?",
      a: "A. Statistics and technical data.",
      b: "B. Authoritative sources and reports.",
      c: "C. Personal experiences and feelings.",
      d: "D. Dates and historical timelines.",
      ans: "C"
    },
    {
      q: "3. Why might an author use 'specialist vocabulary' like 'socio-economic disruption'?",
      a: "A. To make the reader feel sad.",
      b: "B. To sound like a friend talking to you.",
      c: "C. To provide a precise, authoritative, and objective tone.",
      d: "D. To hide the facts from the reader.",
      ans: "C"
    },
    {
      q: "4. In the sentence 'I stood in the hallway, looking at twenty years of memories,' which word signals a subjective point of view?",
      a: "A. Hallway",
      b: "B. Stood",
      c: "C. Memories",
      d: "D. Looking",
      ans: "C"
    },
    {
      q: "5. A scientific report is most likely to use which point of view?",
      a: "A. First-person and emotional.",
      b: "B. Third-person and objective.",
      c: "C. Second-person and persuasive.",
      d: "D. First-person and subjective.",
      ans: "B"
    },
    {
      q: "6. What does 'Point of View' refer to in an informative text?",
      a: "A. The physical location where the author is standing.",
      b: "B. The font size used in the headings.",
      c: "C. The perspective and choices the author makes about information.",
      d: "D. The number of images included in the text.",
      ans: "C"
    },
    {
      q: "7. Which of the following is an AUTHORITATIVE source for flood information?",
      a: "A. A person's Facebook post about the rain.",
      b: "B. The World Bank Queensland Floods Assessment.",
      c: "C. A poem written about a river.",
      d: "D. A child's drawing of a flood.",
      ans: "B"
    },
    {
      q: "8. How does a survivor's account differ from a scientific archive?",
      a: "A. It uses more statistics.",
      b: "B. It focuses on personal impact and sensory details.",
      c: "C. It is always written in the third person.",
      d: "D. It never mentions the flood.",
      ans: "B"
    },
    {
      q: "9. If a text uses the word 'fatality' instead of 'death,' it is likely trying to be:",
      a: "A. Emotional",
      b: "B. Informal",
      c: "C. Objective and formal",
      d: "D. Funny",
      ans: "C"
    },
    {
      q: "10. Why is it important to recognise an author's point of view?",
      a: "A. So you know which font they like.",
      b: "B. To understand how their perspective influences the information given.",
      c: "C. Because all texts must have the same point of view.",
      d: "D. It is not important in informative texts.",
      ans: "B"
    }
  ];

  const children = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "Lesson 15: Point of View Assessment", bold: true, size: 36 })],
      spacing: { after: 400 }
    })
  ];

  questions.forEach(item => {
    children.push(new Paragraph({ children: [new TextRun({ text: item.q, bold: true, size: 24 })], spacing: { before: 200 } }));
    children.push(new Paragraph({ children: [new TextRun({ text: item.a, size: 24 })] }));
    children.push(new Paragraph({ children: [new TextRun({ text: item.b, size: 24 })] }));
    children.push(new Paragraph({ children: [new TextRun({ text: item.c, size: 24 })] }));
    children.push(new Paragraph({ children: [new TextRun({ text: item.d, size: 24 })] }));
    children.push(new Paragraph({ children: [new TextRun({ text: `ANS: [${item.ans}]`, bold: true, size: 24 })], spacing: { after: 200 } }));
  });

  const doc = new Document({
    sections: [{ children }]
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(filename, buffer);
  console.log("✅ Assessment generated.");
}

const assessmentPath = path.join("c:\\Users\\dsuth\\Documents\\Joshua\\Units\\English\\English_Unit_2\\Lesson_Plans", "Lesson_15_Assessment.docx");
generateAssessment(assessmentPath).catch(console.error);
