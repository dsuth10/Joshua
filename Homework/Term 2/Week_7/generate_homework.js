const fs = require('fs');
const path = require('path');
const { 
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, ImageRun,
  AlignmentType, PageOrientation, LevelFormat, BorderStyle, WidthType, TabStopType, 
  ShadingType, VerticalAlign, PageNumber, Header, Footer
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

// Texts
const TEXT_RED = {
  title: "The Australian Federal System: A Division of Power",
  paragraphs: [
    "Australia became a single nation on 1 January 1901. Before this, the six British colonies acted like separate countries. They had their own border posts, railways, and stamps. On this historic day, they joined together. We call this big event Federation. It created the Commonwealth of Australia. To rule this huge continent, the founders chose a federal system of government. In this system, power is split. There is a central national government and regional state governments.",
    "Today, Australia is governed by three levels of government: federal, state, and local. Each level has its own unique jobs. This division ensures that no single level is overwhelmed by tasks, keeping our daily lives running smoothly and keeping Australia safe and happy.",
    "Our supreme law is the Australian Constitution. This important rulebook guides our system. It defines which level of government makes different laws. Under this rulebook, the Federal Parliament looks after the whole nation. These are called national powers. They include defence, trade, immigration, and currency. The Federal Parliament is made of two houses, the Senate and the House of Representatives. They represent voters from all over the country. The Federal Government meets at Parliament House in Canberra and is led by the Prime Minister.",
    "State and territory governments manage services inside their own borders. They do this using residual powers. These are the powers left over that are not listed in the Constitution as federal duties. Under these residual powers, state parliaments pass laws specifically for their state citizens, such as school rules and road speed limits. They manage crucial public services, which include school education and hospitals. They also run the police, fire services, and public train networks. Premiers lead these governments in capital cities.",
    "The third level is local government. Interestingly, local government is not mentioned anywhere in the Australian Constitution. Instead, local councils are made by state laws and get their power from state parliaments. They look after local community needs. Their tasks include local road repairs, weekly rubbish collections, local parks, and libraries. Councils also handle pet registrations for dogs and cats and plan community festivals. The head of a council is called the Mayor.",
    "Finally, we separate our powers. This keeps any single group from having too much control. First is the Legislature, which debates and makes laws. Second is the Executive, which carries out and administers the laws. Third is the Judiciary. The High Court rules on the Constitution and solves legal disputes. This keeps our nation safe."
  ]
};

const TEXT_BLUE = {
  title: "Three Levels of Government in Australia",
  paragraphs: [
    "Australia has a special division of government. This system started on 1 January 1901. In that year, six separate colonies joined together to form one country. We call this historic event Federation. Before this, the colonies had different borders, rail lines, and laws. To join them together, the leaders wrote a rulebook for our laws. We call this rulebook the Australian Constitution. Today, we have three levels of government: federal, state, and local. Each level has different leaders and duties to help our people.",
    "The first level is the Federal Government. It is based in Canberra, our capital city. The Prime Minister is the leader of this level. They meet with other representatives at Parliament House. This level looks after the whole country. They manage defence, borders, and immigration. They also handle ties with other countries. They run the post and our currency, like our coins and notes.",
    "The second level is State Government. Australia has six states and two territories. State leaders are based in capital cities like Sydney, Brisbane, and Melbourne. The leader of a state is called the Premier. This level runs public services inside state borders. They manage state schools and hospitals. They run the police, roads, and train systems. State laws control speed limits and school rules.",
    "The third level is Local Government. This is run by local councils to look after suburbs and towns. The leader is usually called the Mayor. Councils look after local community needs. They manage local roads, parks, and public libraries. They collect weekly waste and recycling bins. They also handle pet registrations for dogs and cats. They clean up streets and plan local festivals.",
    "These three levels of government work together as a big team. This division of work keeps Australia safe, organised, and happy."
  ]
};

const TEXT_GREEN = {
  title: "Who Looks After Our Country?",
  paragraphs: [
    "Australia is a big country. We have three levels of government. They help look after us. Each level has different bosses and jobs. They work as a team.",
    "The first level is the Federal Government. It is based in Canberra. Canberra is our main city. The boss is the Prime Minister. This level looks after the whole country. They take care of our army and mail. They also make the coins and notes we use.",
    "The second level is the State Government. Australia has six states. The boss of each state is the Premier. They look after things inside their state. Their jobs are running schools and health care. They also run the trains and police.",
    "The third level is the Local Council. The boss is usually the Mayor. Councils look after suburbs and towns. They have very easy duties. They keep our streets clean and safe. They collect weekly rubbish and recycling. They also look after parks and libraries.",
    "All three levels work together. This makes Australia a happy place to live."
  ]
};

// Comprehension Questions
const QUESTIONS_RED_COMP = [
  { q: "What was the historical event that united six colonies on 1 January 1901?", a: "Federation", b: "Constitution", c: "Separation of Powers", d: "The Commonwealth", ans: "A" },
  { q: "Which document acts as the supreme law of Australia?", a: "The Magna Carta", b: "The Australian Constitution", c: "The Separation of Powers", d: "The Canberra Rulebook", ans: "B" },
  { q: "Which of the following is a power reserved for the Federal Parliament under the Constitution?", a: "School education", b: "Local park upkeep", c: "National defence and currency", d: "Garbage collection", ans: "C" },
  { q: "Where is the Federal Government based?", a: "Sydney", b: "Melbourne", c: "Canberra", d: "Brisbane", ans: "C" },
  { q: "What kind of powers do state and territory governments hold?", a: "Exclusive powers", b: "Residual powers", c: "Delegated council powers", d: "Judicial powers", ans: "B" },
  { q: "Who establishes local governments in Australia?", a: "The Federal Parliament", b: "The Constitution", c: "State laws", d: "The High Court", ans: "C" },
  { q: "What are the three branches of the Separation of Powers doctrine?", a: "Federal, State, and Local", b: "Legislature, Executive, and Judiciary", c: "Prime Minister, Premier, and Mayor", d: "Parliament, Cabinet, and Council", ans: "B" },
  { q: "What is the primary role of the Legislature?", a: "To administer and carry out laws", b: "To debate and make laws", c: "To interpret the Constitution", d: "To resolve local council fights", ans: "B" },
  { q: "Which branch is responsible for carrying out and administering the laws?", a: "The Executive", b: "The Legislature", c: "The Judiciary", d: "The High Court", ans: "A" },
  { q: "Which body interprets the Constitution and resolves legal fights?", a: "The Legislature", b: "The Executive", c: "The High Court", d: "The Local Council", ans: "C" },
  { q: "Why did the founders create a federal system of government?", a: "To allow the colonies to remain fully independent", b: "To divide power between a central national government and regional state governments", c: "To eliminate the need for a national currency", d: "To give local councils absolute authority", ans: "B" },
  { q: "Which public service is specifically managed by state and territory governments?", a: "International trade and immigration", b: "Public libraries and town planning", c: "School education and hospitals", d: "National security and post", ans: "C" },
  { q: "What is the primary function of the Separation of Powers?", a: "To speed up the lawmaking process", b: "To keep any single group from having too much control", c: "To give the High Court legislative power", d: "To allow the Prime Minister to make all laws", ans: "B" },
  { q: "Which level of government is NOT mentioned in the Australian Constitution?", a: "Federal Government", b: "State Government", c: "Local Government", d: "None of the above", ans: "C" },
  { q: "Under what conditions do states manage schools and hospitals?", a: "As delegated tasks from local councils", b: "As exclusive national powers", c: "As residual powers within their borders", d: "As judicial mandates from the High Court", ans: "C" }
];

const QUESTIONS_BLUE_COMP = [
  { q: "What system of government did Australia set up in 1901?", a: "A single state system", b: "A federal system", c: "A local council system", d: "A royal system", ans: "B" },
  { q: "What is the rulebook for Australia's laws called?", a: "The Federation", b: "The Parliament", c: "The Constitution", d: "The Local council", ans: "C" },
  { q: "Who is the leader of the Federal Government?", a: "The Premier", b: "The Mayor", c: "The Prime Minister", d: "The Governor", ans: "C" },
  { q: "Where does the Federal Government meet?", a: "Brisbane", b: "Sydney", c: "Canberra", d: "Melbourne", ans: "C" },
  { q: "Which level of government is responsible for managing national defence and immigration?", a: "Federal Government", b: "State Government", c: "Local Government", d: "All of the above", ans: "A" },
  { q: "Who is the leader of a state government?", a: "The Prime Minister", b: "The Mayor", c: "The Premier", d: "The President", ans: "C" },
  { q: "Which public service is run by the state government?", a: "Mail delivery", b: "National defence", c: "State schools and hospitals", d: "Rubbish collection", ans: "C" },
  { q: "Who runs local governments?", a: "The Premier", b: "Local councils", c: "The Prime Minister", d: "The High Court", ans: "B" },
  { q: "What is the leader of a local council usually called?", a: "The Premier", b: "The Mayor", c: "The Prime Minister", d: "The Shire President", ans: "B" },
  { q: "Which task is a responsibility of local councils?", a: "Running public libraries and waste bins", b: "Controlling the national currency", c: "Managing public trains and major highways", d: "Handling international immigration", ans: "A" },
  { q: "How many states are in Australia?", a: "Three", b: "Six", c: "Eight", d: "Two", ans: "B" },
  { q: "What is the main purpose of the division of work among the three levels?", a: "To make laws harder to understand", b: "To keep Australia safe and happy by dividing duties", c: "To give the Prime Minister absolute control", d: "To reduce the number of suburbs", ans: "B" },
  { q: "Where is the Premier based?", a: "In the capital city of their state", b: "In Canberra", c: "In Parliament House", d: "In local suburbs", ans: "A" },
  { q: "Which of the following is a federal government duty?", a: "Local road repairs", b: "Rubbish collections", c: "Post and currency", d: "Running local schools", ans: "C" },
  { q: "What do local councils do for pet dogs and cats?", a: "They train them for public parks", b: "They handle pet registrations", c: "They buy their pet food", d: "They write laws about pet diets", ans: "B" }
];

const QUESTIONS_GREEN_COMP = [
  { q: "How many levels of government does Australia have?", a: "One", b: "Two", c: "Three", d: "Four", ans: "C" },
  { q: "Where is the Federal Government based?", a: "Sydney", b: "Canberra", c: "Melbourne", d: "Brisbane", ans: "B" },
  { q: "Who is the boss of the Federal Government?", a: "The Premier", b: "The Prime Minister", c: "The Mayor", d: "The President", ans: "B" },
  { q: "What does the Federal Government look after?", a: "Rubbish trucks", b: "National army and mail", c: "Local parks", d: "State hospitals", ans: "B" },
  { q: "How many states does Australia have?", a: "Four", b: "Five", c: "Six", d: "Seven", ans: "C" },
  { q: "Who is the boss of a state government?", a: "The Mayor", b: "The Premier", c: "The Prime Minister", d: "The Captain", ans: "B" },
  { q: "Which job belongs to state governments?", a: "Collecting weekly rubbish", b: "Running schools and hospitals", c: "Delivering national mail", d: "Making coins", ans: "B" },
  { q: "Who runs the local government?", a: "The Premier", b: "The Prime Minister", c: "The Local Council", d: "The Police Force", ans: "C" },
  { q: "Who is the boss of a local council?", a: "The Premier", b: "The Prime Minister", c: "The Mayor", d: "The Principal", ans: "C" },
  { q: "What is a main duty of local councils?", a: "Delivering mail to our houses", b: "Collecting weekly rubbish and recycling", c: "Managing national defence", d: "Running the trains", ans: "B" },
  { q: "What is Canberra in Australia?", a: "A state", b: "Our capital city", c: "A local council", d: "An army base", ans: "B" },
  { q: "Who looks after train and police systems?", a: "The Federal Government", b: "The State Government", c: "The Local Council", d: "The Mayor", ans: "B" },
  { q: "Which of these is looked after by local councils?", a: "National coins", b: "Post boxes", c: "Parks and libraries", d: "Hospitals", ans: "C" },
  { q: "How do the three levels of government work?", a: "They fight for control", b: "They work as a big team", c: "They have the same boss", d: "They do the same jobs", ans: "B" },
  { q: "What is one thing the Federal Government makes?", a: "Rubbish bins", b: "Coins and notes", c: "Local parks", d: "State trains", ans: "B" }
];

// Maths Questions
// Year 5 Maths (Red & Blue Questions 16-30) - Option B (Financial Multi-Step)
const MATHS_Y5 = [
  { 
    q: "A fruit stall seller buys 8 boxes of mangoes for $35 per box. Each box has 12 mangoes. If he sells all mangoes for $4 each, what is his total profit?", 
    a: "$104", b: "$280", c: "$100", d: "$204", ans: "A" 
  },
  { 
    q: "A school is given a sports gear budget of $1200. The budget is divided using a bar model. Footballs take 3 parts, Basketballs take 2 parts, and Netballs take 1 part. How much money is spent on Footballs?", 
    a: "$400", b: "$600", c: "$200", d: "$800", ans: "B",
    visual: true, img: "q17_visual_red.png"
  },
  { 
    q: "A company needs to transport 340 boxes of paper. Each delivery truck can hold exactly 15 boxes. If each truck trip costs $45, how much will it cost to transport all the boxes?", 
    a: "$1020", b: "$1035", c: "$990", d: "$1080", ans: "B" 
  },
  { 
    q: "Notebooks are sold for $4.50 each or in packs of 12 for $48. If a teacher needs 36 notebooks, how much money does she save by buying the packs of 12 instead of individual notebooks?", 
    a: "$18", b: "$162", c: "$144", d: "$24", ans: "A" 
  },
  { 
    q: "Five friends split a dinner bill. The total bill was $176. They want to leave a tip of $24. If they split the total cost evenly, how much does each person pay?", 
    a: "$35.20", b: "$40", c: "$38.40", d: "$44", ans: "B" 
  },
  { 
    q: "A farmer is planting potato crops. He has a field that is 45 metres long and 24 metres wide. What is the total area of the field?", 
    a: "1080 square metres", b: "900 square metres", c: "980 square metres", d: "1120 square metres", ans: "A",
    visual: true, img: "q21_visual_red.png"
  },
  { 
    q: "An office buys 25 office chairs for $85 each. They are given a bulk discount of $120 on the total bill. What is the final amount they need to pay?", 
    a: "$2125", b: "$2005", c: "$2245", d: "$1985", ans: "B" 
  },
  { 
    q: "A gym membership costs $15 per week. A member signs up for a year (52 weeks) and pays a sign-up fee of $50. If they decide to pay the total amount upfront, how much do they pay?", 
    a: "$780", b: "$830", c: "$730", d: "$850", ans: "B" 
  },
  { 
    q: "A factory makes 750 bars of soap daily. The soap is packed in boxes of 8. Any leftover soap is donated. How many full boxes of soap do they pack in a week of 5 working days?", 
    a: "468 boxes", b: "460 boxes", c: "465 boxes", d: "472 boxes", ans: "A" 
  },
  { 
    q: "A cinema ticket costs $18. On Tuesday, tickets are 20% off. A family of 2 adults and 3 children buys tickets on a Tuesday. How much do they save in total compared to a weekend?", 
    a: "$18", b: "$15", c: "$20", d: "$24", ans: "A" 
  },
  { 
    q: "A company's monthly budget is $8000. Rent is $3000, salaries is $4000, and the rest is for utilities. If the utility budget is split equally among 4 utility types, how much is spent on electricity?", 
    a: "$250", b: "$500", c: "$1000", d: "$750", ans: "A" 
  },
  { 
    q: "A student invests $200 in a small business. Over 6 months, their investment multiplies by 3. They then withdraw all the money and split it equally into 4 savings accounts. How much goes into each account?", 
    a: "$150", b: "$600", c: "$100", d: "$200", ans: "A" 
  },
  { 
    q: "Brand A sells a box of 18 pencils for $9. Brand B sells a box of 24 pencils for $10.80. Which brand is better value, and what is the difference in cost per pencil?", 
    a: "Brand A is better by 5 cents", b: "Brand B is better by 5 cents", c: "Brand A is better by 10 cents", d: "Brand B is better by 10 cents", ans: "B" 
  },
  { 
    q: "A community group wants to raise $5000. They sell 350 tickets at $12 each. If their expenses for the event were $750, how much more money do they need to raise to meet their target?", 
    a: "$1550", b: "$3450", c: "$800", d: "$1200", ans: "A" 
  },
  { 
    q: "An employee earns $24 per hour for standard hours (35 hours per week) and $36 per hour for overtime. If they work 42 hours in a week, what is their total wage?", 
    a: "$840", b: "$1092", c: "$1008", d: "$1152", ans: "C" 
  }
];

// Year 3/4 Maths (Green Questions 16-30) - Option B (Foundational Grouping/Sharing)
const MATHS_Y34 = [
  { 
    q: "A baker puts 6 cupcakes into each box. If he has 8 boxes, how many cupcakes does he have in total?", 
    a: "48", b: "42", c: "54", d: "36", ans: "A" 
  },
  { 
    q: "Share 28 strawberries equally among 4 children. How many strawberries does each child get?", 
    a: "6", b: "7", c: "8", d: "5", ans: "B" 
  },
  { 
    q: "A visual group of cookies. There are 4 plates, and each plate has 5 cookies. How many cookies are there in total?", 
    a: "15", b: "25", c: "20", d: "10", ans: "C",
    visual: true, img: "q18_visual_green.png"
  },
  { 
    q: "If 1 toy car costs $4, how much do 7 toy cars cost?", 
    a: "$28", b: "$24", c: "$32", d: "$20", ans: "A" 
  },
  { 
    q: "A gardener plants 5 rows of carrots. Each row has 9 carrots. How many carrots are planted in total?", 
    a: "40", b: "50", c: "45", d: "35", ans: "C" 
  },
  { 
    q: "A teacher has 30 pencils. She shares them equally among 4 table groups. How many pencils are left over?", 
    a: "2", b: "4", c: "1", d: "0", ans: "A" 
  },
  { 
    q: "Tom has a $20 note. He buys 3 books for $5 each. How much change does he get?", 
    a: "$5", b: "$15", c: "$10", d: "$8", ans: "A" 
  },
  { 
    q: "36 children are split into equal teams of 4 for a sports day. How many teams are there?", 
    a: "8", b: "9", c: "10", d: "7", ans: "B" 
  },
  { 
    q: "A box of chocolates has 4 rows of chocolates, with 8 chocolates in each row. How many chocolates are in the box?", 
    a: "24", b: "36", c: "32", d: "40", ans: "C" 
  },
  { 
    q: "3 children want to share a pile of coins. The diagram shows 15 coins of $2 value. How much money does each child get if they share the coins equally?", 
    a: "$5", b: "$10", c: "$6", d: "$8", ans: "B",
    visual: true, img: "q25_visual_green.png"
  },
  { 
    q: "A student buys a pack of 10 stickers for $2. She sells each sticker to her classmates for 50 cents. What is her profit if she sells all 10 stickers?", 
    a: "$3", b: "$5", c: "$2", d: "$4", ans: "A" 
  },
  { 
    q: "A farmer packs 48 eggs into cartons. Each carton holds 6 eggs. How many cartons does he need?", 
    a: "7", b: "8", c: "9", d: "6", ans: "B" 
  },
  { 
    q: "A family of 4 goes to the zoo. A child ticket costs $8. How much do they pay in total for the 4 children?", 
    a: "$28", b: "$36", c: "$32", d: "$24", ans: "C" 
  },
  { 
    q: "A pack of 45 sweets is shared equally among 9 party bags. How many sweets go into each bag?", 
    a: "5", b: "6", c: "4", d: "9", ans: "A" 
  },
  { 
    q: "A pencil case costs $6 and a ruler costs $2. If a parent buys 3 pencil cases and 3 rulers, how much do they pay in total?", 
    a: "$24", b: "$18", c: "$20", d: "$22", ans: "A" 
  }
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
function makeQuestionsDoc(title, compQs, mathsQs, useVisualPlaceholders) {
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
    
    // Insert diagram placeholder if visual and requested
    if (useVisualPlaceholders && q.visual && q.img) {
      children.push(new Paragraph({ spacing: { before: 0, after: 60 }, children: [new TextRun({ text: `[SEE IMAGE: ${q.img}]`, bold: true, color: "FF0000", size: 20 })] }));
    }

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
function makePrintDoc(title, textObj, compQs, mathsQs, embedVisuals) {
  // Determine tight margins & font sizes for visual printout to guarantee 2-page ceiling
  // 0.33 inch = 480 twips margins for visual printout. Extremely print-ready and roomy.
  const margins = embedVisuals 
    ? { top: 480, right: 540, bottom: 480, left: 540 } 
    : { top: 720, right: 720, bottom: 720, left: 720 };
  
  const usableWidth = PRINT_PAGE_WIDTH - (margins.left + margins.right);
  const colWidth = Math.floor(usableWidth / 2);
  const tabPosition = Math.floor(colWidth / 2);

  const qFontSize = embedVisuals ? 18 : 19; // 9pt for visual, 9.5pt for standard
  const readFontSize = embedVisuals ? 21 : 22; // 10.5pt for visual, 11pt for standard
  const readLineSpacing = embedVisuals ? 240 : 253; // tight 1.15 line spacing for visual

  const children = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 40, after: 20 },
      children: [
        new TextRun({
          text: title,
          bold: true,
          size: embedVisuals ? 24 : 26 // 12pt / 13pt
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
          size: embedVisuals ? 20 : 22,
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
          size: embedVisuals ? 19 : 20, // 9.5pt / 10pt
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
        size: embedVisuals ? 19 : 20,
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

    // Embed visual diagrams scaled down for visual printouts
    if (embedVisuals && q.visual && q.img) {
      const imgPath = path.join(__dirname, 'images', q.img);
      if (fs.existsSync(imgPath)) {
        // High density compact visual elements
        let imgWidth = 140;
        let imgHeight = 60;
        
        if (q.img.includes('q21')) {
          imgHeight = 75;
        } else if (q.img.includes('q18')) {
          imgHeight = 85;
        }

        cellItems.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 20, after: 20 },
            children: [
              new ImageRun({
                type: "png",
                data: fs.readFileSync(imgPath),
                transformation: { width: imgWidth, height: imgHeight },
                altText: { title: "Visual Model", description: "Visual aid for math question", name: q.img }
              })
            ]
          })
        );
      }
    }

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

// Generate all files
async function main() {
  console.log("Generating Week 7 Homework Pack (Optimized for exact 2-page print)...");

  const outDir = __dirname;

  // 1. Reading DOCX files
  const readRed = makeReadingDoc("Week 7 Homework — Informational Text", TEXT_RED);
  const readBlue = makeReadingDoc("Week 7 Homework — Informational Text", TEXT_BLUE);
  const readGreen = makeReadingDoc("Week 7 Homework — Informational Text", TEXT_GREEN);

  fs.writeFileSync(path.join(outDir, "Week_7_Reading_Red.docx"), await Packer.toBuffer(readRed));
  fs.writeFileSync(path.join(outDir, "Week_7_Reading_Blue.docx"), await Packer.toBuffer(readBlue));
  fs.writeFileSync(path.join(outDir, "Week_7_Reading_Green.docx"), await Packer.toBuffer(readGreen));
  console.log("✅ Reading DOCX files created.");

  // 2. Questions (Text-Only) DOCX files
  const qRed = makeQuestionsDoc("Week 7 Homework Assessment — Red Group", QUESTIONS_RED_COMP, MATHS_Y5, false);
  const qBlue = makeQuestionsDoc("Week 7 Homework Assessment — Blue Group", QUESTIONS_BLUE_COMP, MATHS_Y5, false);
  const qGreen = makeQuestionsDoc("Week 7 Homework Assessment — Green Group", QUESTIONS_GREEN_COMP, MATHS_Y34, false);

  fs.writeFileSync(path.join(outDir, "Week_7_Questions_Red.docx"), await Packer.toBuffer(qRed));
  fs.writeFileSync(path.join(outDir, "Week_7_Questions_Blue.docx"), await Packer.toBuffer(qBlue));
  fs.writeFileSync(path.join(outDir, "Week_7_Questions_Green.docx"), await Packer.toBuffer(qGreen));
  console.log("✅ Questions (Text-Only) DOCX files created.");

  // 3. Questions (Visual) DOCX files
  const qVisRed = makeQuestionsDoc("Week 7 Homework Assessment — Red Group (Visual)", QUESTIONS_RED_COMP, MATHS_Y5, true);
  const qVisBlue = makeQuestionsDoc("Week 7 Homework Assessment — Blue Group (Visual)", QUESTIONS_BLUE_COMP, MATHS_Y5, true);
  const qVisGreen = makeQuestionsDoc("Week 7 Homework Assessment — Green Group (Visual)", QUESTIONS_GREEN_COMP, MATHS_Y34, true);

  fs.writeFileSync(path.join(outDir, "Week_7_Questions_Visual_Red.docx"), await Packer.toBuffer(qVisRed));
  fs.writeFileSync(path.join(outDir, "Week_7_Questions_Visual_Blue.docx"), await Packer.toBuffer(qVisBlue));
  fs.writeFileSync(path.join(outDir, "Week_7_Questions_Visual_Green.docx"), await Packer.toBuffer(qVisGreen));
  console.log("✅ Questions (Visual) DOCX files created.");

  // 4. Print (Text-Only) DOCX files
  const printRed = makePrintDoc("Week 7 Homework — Red Group", TEXT_RED, QUESTIONS_RED_COMP, MATHS_Y5, false);
  const printBlue = makePrintDoc("Week 7 Homework — Blue Group", TEXT_BLUE, QUESTIONS_BLUE_COMP, MATHS_Y5, false);
  const printGreen = makePrintDoc("Week 7 Homework — Green Group", TEXT_GREEN, QUESTIONS_GREEN_COMP, MATHS_Y34, false);

  fs.writeFileSync(path.join(outDir, "Week_7_Print_Red.docx"), await Packer.toBuffer(printRed));
  fs.writeFileSync(path.join(outDir, "Week_7_Print_Blue.docx"), await Packer.toBuffer(printBlue));
  fs.writeFileSync(path.join(outDir, "Week_7_Print_Green.docx"), await Packer.toBuffer(printGreen));
  console.log("✅ Print (Text-Only) DOCX files created.");

  // 5. Print (Visual) DOCX files
  const printVisRed = makePrintDoc("Week 7 Homework — Red Group (Visual)", TEXT_RED, QUESTIONS_RED_COMP, MATHS_Y5, true);
  const printVisBlue = makePrintDoc("Week 7 Homework — Blue Group (Visual)", TEXT_BLUE, QUESTIONS_BLUE_COMP, MATHS_Y5, true);
  const printVisGreen = makePrintDoc("Week 7 Homework — Green Group (Visual)", TEXT_GREEN, QUESTIONS_GREEN_COMP, MATHS_Y34, true);

  fs.writeFileSync(path.join(outDir, "Week_7_Print_Visual_Red.docx"), await Packer.toBuffer(printVisRed));
  fs.writeFileSync(path.join(outDir, "Week_7_Print_Visual_Blue.docx"), await Packer.toBuffer(printVisBlue));
  fs.writeFileSync(path.join(outDir, "Week_7_Print_Visual_Green.docx"), await Packer.toBuffer(printVisGreen));
  console.log("✅ Print (Visual) DOCX files created.");

  console.log("🎉 All homework files successfully compiled.");
}

main().catch(err => {
  console.error("❌ Error compiling homework:", err);
});
