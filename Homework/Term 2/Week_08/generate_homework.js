const fs = require('fs');
const path = require('path');
const { 
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, TabStopType, 
  PageNumber, Header, Footer
} = require('docx');

// Page Sizing Constants
// A4 dimensions: 11906 x 16838 DXA.
const PRINT_PAGE_WIDTH = 11906;
const PRINT_PAGE_HEIGHT = 16838;

// Standard margins for standard documents (1 inch / 1440 DXA)
const STANDARD_MARGINS = { top: 1440, right: 1440, bottom: 1440, left: 1440 };
const STANDARD_MARGIN_PROPS = {
  margin: STANDARD_MARGINS,
  size: { width: 11906, height: 16838 } // Explicitly A4
};

// Styling configurations
const STYLES = {
  default: {
    document: {
      run: {
        font: "Arial",
        size: 24 // 12pt default
      }
    }
  }
};

// Reading texts
const TEXT_RED = {
  title: "The Scales of Justice: Understanding Australia's Legal System",
  paragraphs: [
    "In Australia, our society is governed by rules called laws. Parliament has the job of making these laws. In this role, it is also known as the Legislature. A proposed new law is called a 'Bill'. Members of Parliament debate the Bill, suggest edits, and vote on it. If both houses of Parliament pass the Bill and it gets royal assent, it becomes an official Act of Parliament. This process ensures that our laws reflect the needs of the community.",
    "Once laws are made, they must be followed. The police force has the job of enforcing these laws. This keeps our communities safe. Police officers patrol neighbourhoods, look into crimes, and gather facts. If they think someone broke a law, they can issue a fine or arrest the suspect. However, the police do not decide if a person is guilty. Their main job is to protect citizens and present evidence to the courts.",
    "In Australia, laws are divided into two main types: criminal law and civil law. Criminal law deals with behaviour that is seen as an offence against the whole public, such as theft. In these cases, the police arrest the suspect and prosecute them in court. On the other side, civil law deals with disputes between individuals or organisations. For example, if two neighbours argue over a fence, they might go to court to solve their dispute. In civil cases, the police are not involved, and the dispute is settled by lawyers and a judge.",
    "When a legal dispute arises, the matter goes to court. In court, lawyers represent the people involved. The prosecution lawyer represents the police or government. They argue that the accused person, called the defendant, is guilty. On the other side, the defence lawyer represents the defendant. They ensure that their client's rights are protected. Defence lawyers present evidence to explain their client's innocence. Both lawyers help people navigate the legal system.",
    "At the head of the courtroom is a judge or a magistrate. Their role is to make sure the trial is fair. In serious cases, a jury of twelve citizens decides if the defendant is guilty. The judge then decides the penalty. In smaller cases, a magistrate decides the outcome alone. The judiciary remains separate from the government and the police. This keeps decisions impartial and just."
  ]
};

const TEXT_BLUE = {
  title: "How the Justice System Works",
  paragraphs: [
    "In Australia, laws are rules that keep everyone safe and happy. The process of making laws happens in Parliament. A new idea for a law is called a Bill. Members of Parliament talk about the Bill, suggest changes, and vote on it. If the majority votes in favour, it becomes a new law. This lawmaking system makes sure our rules are fair for everyone in the community.",
    "After a law is made, the police are responsible for making sure people follow it. Police officers work to protect our communities and prevent crimes. They patrol streets, look into accidents, and catch people who break the rules. When someone breaks a law, the police can arrest them or give them a fine. However, the police do not decide the punishment; they only gather the facts.",
    "When someone is accused of breaking a law, they must go to court. Courtrooms can be very confusing, so people use lawyers to help them. One lawyer, called the prosecutor, presents evidence to show that the person did something wrong. Another lawyer, the defence lawyer, helps the accused person by telling their side of the story. Both lawyers work hard to explain the facts to the court.",
    "The judge is the leader of the courtroom. The judge makes sure everyone follows the rules of the court. In serious cases, a group of everyday citizens called a jury helps decide if the person is guilty. If the person is found guilty, the judge decides what the punishment will be. This system helps make sure that every trial is fair and that the truth is found."
  ]
};

const TEXT_GREEN = {
  title: "Our Laws and Courts",
  paragraphs: [
    "Laws are rules that keep us safe. In Australia, we make our laws in Parliament. People in Parliament talk about new ideas. They vote on these rules. If most people say yes, the idea becomes a new law.",
    "The police have a very important job. They make sure people follow the laws. They protect us and keep our towns safe. Police officers can arrest people who break the rules. They do not decide if a person is guilty. They just gather the facts.",
    "When a person is accused of breaking a rule, they go to court. The court can be a scary place. Lawyers help people in court. One lawyer tells the court what the person did wrong. Another lawyer helps the accused person tell their story.",
    "The judge is the boss of the courtroom. The judge makes sure the trial is fair. The judge listens to both sides. Then, they decide if the person is guilty or innocent. If the person is guilty, the judge decides the punishment. This keeps our country fair and safe."
  ]
};

// Comprehension Questions
const QUESTIONS_RED_COMP = [
  { q: "According to the text, what is another name for Parliament when it is making laws?", a: "The Legislature", b: "The Judiciary", c: "The Executive", d: "The Courtroom", ans: "A" },
  { q: "What is the initial name of a proposed new law when it is introduced in Parliament?", a: "An Act", b: "A Bill", c: "A Rule", d: "A Code", ans: "B" },
  { q: "What final step is required for a Bill to officially become an Act of Parliament?", a: "A majority public vote", b: "Receiving royal assent", c: "Police approval", d: "A High Court ruling", ans: "B" },
  { q: "Based on the passage, what is the role of the police regarding the determination of guilt?", a: "They decide who is guilty of crimes", b: "They do not decide guilt; they gather facts and protect citizens", c: "They set the fines and penalties in court", d: "They assist the defence lawyer", ans: "B" },
  { q: "Which of the following is NOT a duty of the police force mentioned in the text?", a: "Patrolling neighbourhoods", b: "Investigating crimes", c: "Deciding courtroom verdicts", d: "Issuing fines", ans: "C" },
  { q: "What is the main distinction between criminal law and civil law?", a: "Criminal law only applies in Canberra", b: "Criminal law deals with public offences; civil law deals with private disputes", c: "Civil law is handled entirely by the police force", d: "Criminal law does not involve courtroom lawyers", ans: "B" },
  { q: "If two neighbours argue over a fence, which type of law would settle their dispute?", a: "Criminal law", b: "Civil law", c: "Legislative law", d: "Parliamentary law", ans: "B" },
  { q: "Who does the prosecution lawyer represent in a courtroom trial?", a: "The defendant", b: "The police or government", c: "The judge", d: "The jury", ans: "B" },
  { q: "What is the primary responsibility of the defence lawyer?", a: "To prove the prosecution is guilty", b: "To protect the defendant's rights and present their case", c: "To decide the final sentence of the trial", d: "To write new parliamentary Bills", ans: "B" },
  { q: "What does the term 'defendant' refer to in the text?", a: "The lawyer representing the government", b: "The accused person on trial", c: "The leader of the courtroom", d: "A member of the jury", ans: "B" },
  { q: "In serious courtroom cases, who has the job of deciding whether the defendant is guilty?", a: "The magistrate", b: "A jury of twelve citizens", c: "The police officers", d: "The defence lawyer", ans: "B" },
  { q: "Who decides the penalty for a guilty defendant in a serious court case?", a: "The jury", b: "The judge", c: "The police force", d: "The Premier", ans: "B" },
  { q: "What is the role of a magistrate in smaller cases?", a: "They write new laws", b: "They decide both the verdict and penalty alone", c: "They represent the police in court", d: "They lead the jury", ans: "B" },
  { q: "Why is the judiciary kept separate from the government and the police?", a: "To ensure that decisions are impartial and just", b: "To speed up the lawmaking process", c: "To allow the police to make their own rules", d: "To reduce courtroom costs", ans: "A" },
  { q: "Which branch of power is responsible for making sure a trial runs fairly?", a: "The Legislature", b: "The Judiciary", c: "The Executive", d: "The Police", ans: "B" }
];

const QUESTIONS_BLUE_COMP = [
  { q: "Where does the process of making laws take place in Australia?", a: "In courtrooms", b: "In Parliament", c: "In police stations", d: "In council chambers", ans: "B" },
  { q: "What is a new idea for a law called before it is voted on?", a: "An Act", b: "A Bill", c: "A Rule", d: "A Code", ans: "B" },
  { q: "What must happen for a Bill to become a new law?", a: "The police must approve it", b: "The majority of Parliament members must vote in favour", c: "A judge must test it in court", d: "A jury must write it down", ans: "B" },
  { q: "Who is responsible for making sure people follow the laws?", a: "Lawyers", b: "The police", c: "The jury", d: "The Prime Minister", ans: "B" },
  { q: "Which of the following is a job of police officers?", a: "Deciding if someone is guilty", b: "Patrolling streets and protecting communities", c: "Setting punishments in court", d: "Writing Bills for Parliament", ans: "B" },
  { q: "Based on the text, do the police decide the punishment for breaking a law?", a: "Yes, they decide the fine or jail time", b: "No, they only gather the facts", c: "Only in serious cases", d: "Only when there is no judge", ans: "B" },
  { q: "Why do people accused of breaking the law use lawyers in court?", a: "To help them change the laws", b: "To help them tell their side and navigate court", c: "To decide if they are guilty", d: "To collect their fines", ans: "B" },
  { q: "What is the role of the prosecutor in a trial?", a: "To help the defendant", b: "To show that the accused person did something wrong", c: "To decide the punishment", d: "To lead the jury", ans: "B" },
  { q: "Who does the defence lawyer help in court?", a: "The prosecutor", b: "The accused person", c: "The police", d: "The judge", ans: "B" },
  { q: "Who is the leader of the courtroom?", a: "The police officer", b: "The judge", c: "The lawyer", d: "The mayor", ans: "B" },
  { q: "What is a jury?", a: "A group of lawyers", b: "A group of everyday citizens who help decide guilt", c: "A team of police officers", d: "The leaders of Parliament", ans: "B" },
  { q: "Who decides the punishment if a person is found guilty?", a: "The jury", b: "The judge", c: "The prosecutor", d: "The police", ans: "B" },
  { q: "What is a Bill?", a: "A completed law", b: "A new idea for a law", c: "A fine from the police", d: "A courtroom report", ans: "B" },
  { q: "Which of these is NOT a responsibility of a courtroom judge?", a: "Making sure everyone follows court rules", b: "Arresting people who break rules outside", c: "Deciding punishments for guilty people", d: "Leading the courtroom trial", ans: "B" },
  { q: "What is the main goal of the courtroom system?", a: "To make laws quickly", b: "To ensure trials are fair and the truth is found", c: "To help the police catch more people", d: "To replace the Parliament", ans: "B" }
];

const QUESTIONS_GREEN_COMP = [
  { q: "Where are laws made in Australia?", a: "In police stations", b: "In Parliament", c: "In courtrooms", d: "In schools", ans: "B" },
  { q: "What do people in Parliament do before an idea becomes a law?", a: "They write a story", b: "They talk about it and vote on it", c: "They ask the police", d: "They go to court", ans: "B" },
  { q: "What happens if most people in Parliament say yes to a new rule?", a: "It is thrown away", b: "It becomes a new law", c: "The police write it down", d: "It is sent to a judge", ans: "B" },
  { q: "Who makes sure people follow the laws?", a: "Teachers", b: "The police", c: "Lawyers", d: "Judges", ans: "B" },
  { q: "What is one job of police officers?", a: "Making the laws", b: "Protecting us and keeping towns safe", c: "Deciding if someone is guilty", d: "Running the court", ans: "B" },
  { q: "Do police officers decide if a person is guilty?", a: "Yes, always", b: "No, they just gather the facts", c: "Only when there is no trial", d: "Yes, if they arrest them", ans: "B" },
  { q: "Where does a person go if they are accused of breaking a rule?", a: "To Parliament", b: "To court", c: "To the police station only", d: "To a council office", ans: "B" },
  { q: "Who helps people when they are in court?", a: "The police", b: "Lawyers", c: "Members of Parliament", d: "Mayors", ans: "B" },
  { q: "What does the first lawyer tell the court?", a: "How to make a law", b: "What the person did wrong", c: "How to stay safe", d: "A story about Canberra", ans: "B" },
  { q: "Who does the second lawyer help?", a: "The judge", b: "The accused person", c: "The police", d: "The first lawyer", ans: "B" },
  { q: "Who is the boss of the courtroom?", a: "The police officer", b: "The judge", c: "The lawyer", d: "The Prime Minister", ans: "B" },
  { q: "What is the main role of the judge?", a: "To catch criminals", b: "To make sure the trial is fair", c: "To vote on new rules", d: "To represent the government", ans: "B" },
  { q: "Who decides the punishment if a person is guilty?", a: "The lawyers", b: "The judge", c: "The police", d: "The Parliament", ans: "B" },
  { q: "What are laws?", a: "Rules that keep us safe", b: "Court stories", c: "Police reports", d: "Parliament offices", ans: "A" },
  { q: "Why do police, lawyers, and judges work together?", a: "To make laws harder to follow", b: "To keep our country fair and safe", c: "To help the Prime Minister", d: "To run the Parliament", ans: "B" }
];

// Maths Questions
const MATHS_Y5 = [
  { q: "A rectangular park is 12 metres long and 8 metres wide. What is the perimeter of the park?", a: "96 metres", b: "40 metres", c: "20 metres", d: "80 metres", ans: "B" },
  { q: "A courtroom floor is 15 metres long and 9 metres wide. What is the area of the courtroom floor?", a: "48 square metres", b: "135 square metres", c: "270 square metres", d: "120 square metres", ans: "B" },
  { q: "A police station yard is 25 metres long and 18 metres wide. Fencing the yard costs $12 per metre. What is the total cost to fence the yard?", a: "$516", b: "$1032", c: "$450", d: "$5400", ans: "B" },
  { q: "A lawyer wants to carpet an office that is 8 metres long and 6 metres wide. The carpet costs $25 per square metre. What is the total cost to carpet the office?", a: "$700", b: "$1200", c: "$600", d: "$1400", ans: "B" },
  { q: "A rectangular courtroom lobby has an area of 96 square metres. If its length is 12 metres, what is its width?", a: "84 metres", b: "8 metres", c: "16 metres", d: "12 metres", ans: "B" },
  { q: "A square training field for police officers has a perimeter of 120 metres. What is the length of one side of the field?", a: "60 metres", b: "30 metres", c: "15 metres", d: "40 metres", ans: "B" },
  { q: "Office A is a rectangle measuring 9 metres by 7 metres. Office B is a square with side lengths of 8 metres. Which statement is correct?", a: "Office A has a larger perimeter", b: "Both offices have the same perimeter", c: "Office B has a larger perimeter", d: "Office A has a larger area", ans: "B" },
  { q: "Courtroom X is 10 metres long and 8 metres wide. Courtroom Y is a square with side lengths of 9 metres. Which courtroom has the larger area, and by how much?", a: "Courtroom X is larger by 1 square metre", b: "Courtroom Y is larger by 1 square metre", c: "Both have the same area", d: "Courtroom Y is larger by 9 square metres", ans: "B" },
  { q: "A rectangular garden outside the court is 14 metres long and 10 metres wide. A fence is built around it, but a 2-metre gap is left for a gate. What is the length of the fence?", a: "48 metres", b: "46 metres", c: "24 metres", d: "44 metres", ans: "B" },
  { q: "A rectangular prison cell is 4 metres long and 3 metres wide. If both dimensions are doubled, what happens to the area of the cell?", a: "The area doubles", b: "The area becomes 4 times larger", c: "The area increases by 12 square metres", d: "The area becomes 8 times larger", ans: "B" },
  { q: "A wall in a judge's chamber is 6 metres long and 3 metres high. A tin of paint covers 9 square metres. How many tins of paint are needed to paint the wall?", a: "3 tins", b: "2 tins", c: "4 tins", d: "18 tins", ans: "B" },
  { q: "A police officer patrols the perimeter of a rectangular building that is 50 metres long and 30 metres wide. If the officer walks around the building 3 times, how far do they walk in total?", a: "150 metres", b: "480 metres", c: "160 metres", d: "240 metres", ans: "B" },
  { q: "A square witness room has side lengths of 5 metres. Tiling costs $40 per square metre. How much will it cost to tile the room?", a: "$200", b: "$1000", c: "$800", d: "$400", ans: "B" },
  { q: "A rectangular police parking lot is 30 metres long and has a perimeter of 100 metres. What is the width of the parking lot?", a: "40 metres", b: "20 metres", c: "35 metres", d: "70 metres", ans: "B" },
  { q: "A rectangular courtroom lobby is 12 metres long and 3 metres wide. Which statement is correct?", a: "The perimeter is 36m and the area is 30 sq m", b: "The perimeter is 30m and the area is 36 sq m", c: "Both the perimeter and area are 30", d: "The perimeter is 15m and the area is 36 sq m", ans: "B" }
];

const MATHS_Y34 = [
  { q: "A small garden is 5 metres long and 3 metres wide. What is the perimeter of the garden?", a: "15 metres", b: "16 metres", c: "8 metres", d: "10 metres", ans: "B" },
  { q: "A desk is 2 metres long and 1 metre wide. What is the area of the desk?", a: "6 square metres", b: "2 square metres", c: "4 square metres", d: "3 square metres", ans: "B" },
  { q: "A square rug has sides that are 4 metres long. What is the perimeter of the rug?", a: "8 metres", b: "16 metres", c: "12 metres", d: "20 metres", ans: "B" },
  { q: "A square tile has sides that are 3 metres long. What is the area of the tile?", a: "12 square metres", b: "9 square metres", c: "6 square metres", d: "15 square metres", ans: "B" },
  { q: "A rectangular shape has sides of 2cm, 3cm, 2cm, and 3cm. What is the perimeter of the shape?", a: "6cm", b: "10cm", c: "12cm", d: "5cm", ans: "B" },
  { q: "A rectangular mat is made of square tiles. There are 3 rows of tiles, and each row has 4 tiles. What is the area of the mat?", a: "7 square units", b: "12 square units", c: "14 square units", d: "9 square units", ans: "B" },
  { q: "A dog yard is 6 metres long and 4 metres wide. How much fencing is needed to go all the way around it?", a: "10 metres", b: "20 metres", c: "24 metres", d: "12 metres", ans: "B" },
  { q: "A sandbox is 5 metres long and 4 metres wide. What is the area of the sandbox?", a: "18 square metres", b: "20 square metres", c: "9 square metres", d: "25 square metres", ans: "B" },
  { q: "A road sign is shaped like a triangle. Each of its 3 sides is 10cm long. What is the perimeter of the sign?", a: "20cm", b: "30cm", c: "40cm", d: "10cm", ans: "B" },
  { q: "Shape A has a perimeter of 12cm. Shape B has a perimeter of 15cm. Which shape has the smaller perimeter?", a: "Shape B", b: "Shape A", c: "They are the same", d: "Cannot tell", ans: "B" },
  { q: "A rectangular garden is divided into 1-metre squares. It has 2 rows of 5 squares. What is the area of the garden?", a: "7 square metres", b: "10 square metres", c: "14 square metres", d: "12 square metres", ans: "B" },
  { q: "What do we measure when we find the perimeter of a shape?", a: "The flat space inside the shape", b: "The distance all the way around the outside of the shape", c: "How heavy the shape is", d: "The height of the shape", ans: "B" },
  { q: "What do we measure when we find the area of a flat shape?", a: "The distance around the outside", b: "The amount of flat space inside the shape", c: "The weight of the shape", d: "The length of its longest side", ans: "B" },
  { q: "A square garden has a perimeter of 24 metres. What is the length of each side?", a: "12 metres", b: "6 metres", c: "8 metres", d: "4 metres", ans: "B" },
  { q: "A book is 20cm long and 15cm wide. What is the perimeter of the book?", a: "35cm", b: "70cm", c: "300cm", d: "50cm", ans: "B" }
];

// Generates the Reading DOCX file
function makeReadingDoc(title, textObj) {
  const children = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 240, after: 120 },
      children: [
        new TextRun({
          text: title,
          bold: true,
          size: 32 // 16pt
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 240 },
      children: [
        new TextRun({
          text: textObj.title,
          bold: true,
          italics: true,
          size: 26, // 13pt
          color: "444444"
        })
      ]
    })
  ];

  textObj.paragraphs.forEach(p => {
    children.push(
      new Paragraph({
        spacing: { before: 0, after: 140, line: 276, lineRule: 'auto' }, // 1.15 line spacing
        children: [
          new TextRun({
            text: p,
            size: 24 // 12pt
          })
        ]
      })
    );
  });

  return new Document({
    styles: STYLES,
    sections: [{
      properties: {
        page: STANDARD_MARGIN_PROPS
      },
      children: children
    }]
  });
}

// Generates the Questions DOCX file (Microsoft Forms format)
function makeQuestionsDoc(title, compQs, mathsQs) {
  const children = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 240, after: 240 },
      children: [
        new TextRun({
          text: title,
          bold: true,
          size: 32 // 16pt
        })
      ]
    })
  ];

  let qNum = 1;

  // Add Reading Questions
  compQs.forEach(q => {
    children.push(new Paragraph({ spacing: { before: 180, after: 60 }, children: [new TextRun({ text: `${qNum}. ${q.q}`, bold: true, size: 22 })] }));
    children.push(new Paragraph({ spacing: { before: 0, after: 40 }, children: [new TextRun({ text: `A. ${q.a}`, size: 20 })] }));
    children.push(new Paragraph({ spacing: { before: 0, after: 40 }, children: [new TextRun({ text: `B. ${q.b}`, size: 20 })] }));
    children.push(new Paragraph({ spacing: { before: 0, after: 40 }, children: [new TextRun({ text: `C. ${q.c}`, size: 20 })] }));
    children.push(new Paragraph({ spacing: { before: 0, after: 40 }, children: [new TextRun({ text: `D. ${q.d}`, size: 20 })] }));
    children.push(new Paragraph({ spacing: { before: 0, after: 40 }, children: [new TextRun({ text: `ANSWER: ${q.ans}`, bold: true, size: 20 })] }));
    children.push(new Paragraph({ spacing: { before: 0, after: 120 }, children: [new TextRun({ text: `POINT: 1`, bold: true, size: 20 })] }));
    qNum++;
  });

  // Add Maths Questions
  mathsQs.forEach(q => {
    children.push(new Paragraph({ spacing: { before: 180, after: 60 }, children: [new TextRun({ text: `${qNum}. ${q.q}`, bold: true, size: 22 })] }));
    children.push(new Paragraph({ spacing: { before: 0, after: 40 }, children: [new TextRun({ text: `A. ${q.a}`, size: 20 })] }));
    children.push(new Paragraph({ spacing: { before: 0, after: 40 }, children: [new TextRun({ text: `B. ${q.b}`, size: 20 })] }));
    children.push(new Paragraph({ spacing: { before: 0, after: 40 }, children: [new TextRun({ text: `C. ${q.c}`, size: 20 })] }));
    children.push(new Paragraph({ spacing: { before: 0, after: 40 }, children: [new TextRun({ text: `D. ${q.d}`, size: 20 })] }));
    children.push(new Paragraph({ spacing: { before: 0, after: 40 }, children: [new TextRun({ text: `ANSWER: ${q.ans}`, bold: true, size: 20 })] }));
    children.push(new Paragraph({ spacing: { before: 0, after: 120 }, children: [new TextRun({ text: `POINT: 1`, bold: true, size: 20 })] }));
    qNum++;
  });

  return new Document({
    styles: STYLES,
    sections: [{
      properties: {
        page: STANDARD_MARGIN_PROPS
      },
      children: children
    }]
  });
}

// Generates the two-page Printable student document (Optimized for exact 2-page fit)
function makePrintDoc(title, textObj, compQs, mathsQs) {
  // 0.5 inch margins = 720 DXA
  const margins = { top: 720, right: 720, bottom: 720, left: 720 };
  
  const usableWidth = PRINT_PAGE_WIDTH - (margins.left + margins.right);
  const colWidth = Math.floor(usableWidth / 2);
  const tabPosition = Math.floor(colWidth / 2);

  const qFontSize = 19; // 9.5pt
  const readFontSize = 22; // 11pt
  const readLineSpacing = 253; // 1.15 line spacing

  const children = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 40, after: 20 },
      children: [
        new TextRun({
          text: title,
          bold: true,
          size: 26 // 13pt
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 80 },
      children: [
        new TextRun({
          text: textObj.title,
          bold: true,
          italics: true,
          size: 22,
          color: "444444"
        })
      ]
    })
  ];

  // 1. Reading Text (Tightened spacing and font size)
  textObj.paragraphs.forEach(p => {
    children.push(
      new Paragraph({
        spacing: { before: 0, after: 40, line: readLineSpacing, lineRule: 'auto' },
        children: [
          new TextRun({
            text: p,
            size: readFontSize
          })
        ]
      })
    );
  });

  // 2. Reading Questions header
  children.push(
    new Paragraph({
      spacing: { before: 100, after: 60 },
      children: [
        new TextRun({
          text: "Part A: Reading Comprehension",
          bold: true,
          size: 20, // 10pt
          underline: true
        })
      ]
    })
  );

  // 3. Reading Questions full-width
  let qNum = 1;
  compQs.forEach(q => {
    children.push(
      new Paragraph({
        spacing: { before: 30, after: 10 },
        children: [
          new TextRun({
            text: `${qNum}. ${q.q}`,
            bold: true,
            size: qFontSize
          })
        ]
      })
    );

    // Options line 1: A and B
    children.push(
      new Paragraph({
        tabStops: [{ type: TabStopType.LEFT, position: tabPosition }],
        spacing: { before: 0, after: 10, line: 180, lineRule: 'auto' },
        children: [
          new TextRun({ text: `A. ${q.a}`, size: qFontSize }),
          new TextRun({ text: `\tB. ${q.b}`, size: qFontSize })
        ]
      })
    );

    // Options line 2: C and D with thin grey border
    children.push(
      new Paragraph({
        tabStops: [{ type: TabStopType.LEFT, position: tabPosition }],
        spacing: { before: 0, after: 40, line: 180, lineRule: 'auto' },
        border: {
          bottom: { style: BorderStyle.SINGLE, size: 4, color: 'DCDCDC', space: 4 }
        },
        children: [
          new TextRun({ text: `C. ${q.c}`, size: qFontSize }),
          new TextRun({ text: `\tD. ${q.d}`, size: qFontSize })
        ]
      })
    );
    qNum++;
  });

  // 4. Maths Questions header
  const mathsHeaderPara = new Paragraph({
    spacing: { before: 100, after: 60 },
    children: [
      new TextRun({
        text: "Part B: Mathematics Word Problems",
        bold: true,
        size: 20,
        underline: true
      })
    ]
  });

  // Split Maths Questions: 8 on left, 7 on right
  const leftCells = [];
  const rightCells = [];

  for (let i = 0; i < mathsQs.length; i++) {
    const q = mathsQs[i];
    const cellItems = [];

    cellItems.push(
      new Paragraph({
        spacing: { before: 50, after: 10 },
        children: [
          new TextRun({
            text: `${qNum}. ${q.q}`,
            bold: true,
            size: qFontSize
          })
        ]
      })
    );

    cellItems.push(
      new Paragraph({
        tabStops: [{ type: TabStopType.LEFT, position: tabPosition }],
        spacing: { before: 0, after: 10, line: 180, lineRule: 'auto' },
        children: [
          new TextRun({ text: `A. ${q.a}`, size: qFontSize }),
          new TextRun({ text: `\tB. ${q.b}`, size: qFontSize })
        ]
      })
    );

    cellItems.push(
      new Paragraph({
        tabStops: [{ type: TabStopType.LEFT, position: tabPosition }],
        spacing: { before: 0, after: 40, line: 180, lineRule: 'auto' },
        border: {
          bottom: { style: BorderStyle.SINGLE, size: 4, color: 'DCDCDC', space: 4 }
        },
        children: [
          new TextRun({ text: `C. ${q.c}`, size: qFontSize }),
          new TextRun({ text: `\tD. ${q.d}`, size: qFontSize })
        ]
      })
    );

    if (i < 8) {
      leftCells.push(...cellItems);
    } else {
      rightCells.push(...cellItems);
    }
    qNum++;
  }

  // Create columns with borderless single-row table and minimal margins
  const colTable = new Table({
    columnWidths: [colWidth, colWidth],
    margins: { top: 10, bottom: 10, left: 40, right: 40 },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE }
            },
            width: { size: colWidth, type: WidthType.DXA },
            children: leftCells
          }),
          new TableCell({
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE }
            },
            width: { size: colWidth, type: WidthType.DXA },
            children: rightCells
          })
        ]
      })
    ]
  });

  return new Document({
    styles: STYLES,
    sections: [{
      properties: {
        page: {
          margin: margins,
          size: { width: PRINT_PAGE_WIDTH, height: PRINT_PAGE_HEIGHT } // Explicitly A4 size
        }
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              spacing: { before: 0, after: 40 },
              children: [
                new TextRun({
                  text: "Name: ______________________   Date: __________",
                  size: 16,
                  color: "666666"
                })
              ]
            })
          ]
        })
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 40, after: 0 },
              children: [
                new TextRun({ text: "Page ", size: 14, color: "777777" }),
                new TextRun({ children: [PageNumber.CURRENT], size: 14, color: "777777" }),
                new TextRun({ text: " of ", size: 14, color: "777777" }),
                new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 14, color: "777777" })
              ]
            })
          ]
        })
      },
      children: [
        ...children,
        mathsHeaderPara,
        colTable
      ]
    }]
  });
}

// Shuffles options and updates correct answer key
function shuffleQuestion(q) {
  const options = [
    { text: q.a, isCorrect: q.ans === 'A' },
    { text: q.b, isCorrect: q.ans === 'B' },
    { text: q.c, isCorrect: q.ans === 'C' },
    { text: q.d, isCorrect: q.ans === 'D' }
  ];
  
  // Fisher-Yates Shuffle
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = options[i];
    options[i] = options[j];
    options[j] = temp;
  }
  
  // Map back to a, b, c, d
  q.a = options[0].text;
  q.b = options[1].text;
  q.c = options[2].text;
  q.d = options[3].text;
  
  // Find correct answer letter
  const correctIdx = options.findIndex(opt => opt.isCorrect);
  q.ans = ['A', 'B', 'C', 'D'][correctIdx];
  
  return q;
}

// Generate all files
async function main() {
  console.log("Generating Week 8 Homework Pack...");

  const outDir = __dirname;

  // Shuffle all questions before generating to randomize correct answer keys
  const shuffledRedComp = QUESTIONS_RED_COMP.map(q => shuffleQuestion({ ...q }));
  const shuffledBlueComp = QUESTIONS_BLUE_COMP.map(q => shuffleQuestion({ ...q }));
  const shuffledGreenComp = QUESTIONS_GREEN_COMP.map(q => shuffleQuestion({ ...q }));
  const shuffledMathsY5 = MATHS_Y5.map(q => shuffleQuestion({ ...q }));
  const shuffledMathsY34 = MATHS_Y34.map(q => shuffleQuestion({ ...q }));

  // 1. Reading DOCX files
  const readRed = makeReadingDoc("Week 8 Homework — Informational Text", TEXT_RED);
  const readBlue = makeReadingDoc("Week 8 Homework — Informational Text", TEXT_BLUE);
  const readGreen = makeReadingDoc("Week 8 Homework — Informational Text", TEXT_GREEN);

  fs.writeFileSync(path.join(outDir, "Week_8_Reading_Red.docx"), await Packer.toBuffer(readRed));
  fs.writeFileSync(path.join(outDir, "Week_8_Reading_Blue.docx"), await Packer.toBuffer(readBlue));
  fs.writeFileSync(path.join(outDir, "Week_8_Reading_Green.docx"), await Packer.toBuffer(readGreen));
  console.log("✅ Reading DOCX files created.");

  // 2. Questions DOCX files (Microsoft Forms format)
  const qRed = makeQuestionsDoc("Week 8 Homework Assessment — Red Group", shuffledRedComp, shuffledMathsY5);
  const qBlue = makeQuestionsDoc("Week 8 Homework Assessment — Blue Group", shuffledBlueComp, shuffledMathsY5);
  const qGreen = makeQuestionsDoc("Week 8 Homework Assessment — Green Group", shuffledGreenComp, shuffledMathsY34);

  fs.writeFileSync(path.join(outDir, "Week_8_Questions_Red.docx"), await Packer.toBuffer(qRed));
  fs.writeFileSync(path.join(outDir, "Week_8_Questions_Blue.docx"), await Packer.toBuffer(qBlue));
  fs.writeFileSync(path.join(outDir, "Week_8_Questions_Green.docx"), await Packer.toBuffer(qGreen));
  console.log("✅ Questions DOCX files created.");

  // 3. Print DOCX files (2-page student handouts)
  const printRed = makePrintDoc("Week 8 Homework — Red Group", TEXT_RED, shuffledRedComp, shuffledMathsY5);
  const printBlue = makePrintDoc("Week 8 Homework — Blue Group", TEXT_BLUE, shuffledBlueComp, shuffledMathsY5);
  const printGreen = makePrintDoc("Week 8 Homework — Green Group", TEXT_GREEN, shuffledGreenComp, shuffledMathsY34);

  fs.writeFileSync(path.join(outDir, "Week_8_Print_Red.docx"), await Packer.toBuffer(printRed));
  fs.writeFileSync(path.join(outDir, "Week_8_Print_Blue.docx"), await Packer.toBuffer(printBlue));
  fs.writeFileSync(path.join(outDir, "Week_8_Print_Green.docx"), await Packer.toBuffer(printGreen));
  console.log("✅ Print DOCX files created.");

  console.log("🎉 All Week 8 homework files successfully compiled.");
}

main().catch(err => {
  console.error("❌ Error compiling homework:", err);
});
