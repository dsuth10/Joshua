const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber } = require('docx');

const OUT = 'c:\\Users\\dsuth\\Documents\\Joshua\\Units\\Health\\Who influences me Part B\\Lesson 1 - Lesson Plan.docx';
const DB = "1A3A6B", MB = "2E6BC6", LB = "D6E4F7";
const bdr = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const bds = { top: bdr, bottom: bdr, left: bdr, right: bdr };
const nobdr = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const nobds = { top: nobdr, bottom: nobdr, left: nobdr, right: nobdr };

function cell(content, width, opts = {}) {
  const paras = Array.isArray(content) ? content : [
    new Paragraph({ spacing: { before: 40, after: 40 }, children: [
      new TextRun({ text: content, font: "Arial", size: 20, bold: opts.bold, color: opts.fontColor || "2C2C2C" })
    ], alignment: opts.align })
  ];
  return new TableCell({
    borders: opts.noBorder ? nobds : bds,
    width: { size: width, type: WidthType.DXA },
    shading: opts.fill ? { fill: opts.fill, type: ShadingType.CLEAR } : undefined,
    verticalAlign: opts.valign || VerticalAlign.TOP,
    children: paras
  });
}

function heading(text, size, color) {
  return new Paragraph({ spacing: { before: 240, after: 120 }, children: [
    new TextRun({ text, font: "Arial", size, bold: true, color: color || DB })
  ]});
}

function bullet(text, ref) {
  return new Paragraph({ numbering: { reference: ref, level: 0 }, spacing: { before: 40, after: 40 },
    children: [new TextRun({ text, font: "Arial", size: 20 })]
  });
}

function phaseRow(time, phase, teacher, student) {
  const teacherParas = teacher.map(t => new Paragraph({ spacing: { before: 30, after: 30 },
    numbering: { reference: "bullet-list", level: 0 },
    children: [new TextRun({ text: t, font: "Arial", size: 18 })]
  }));
  const studentParas = student.map(s => new Paragraph({ spacing: { before: 30, after: 30 },
    numbering: { reference: "bullet-list", level: 0 },
    children: [new TextRun({ text: s, font: "Arial", size: 18 })]
  }));
  return new TableRow({ children: [
    cell(time, 900, { valign: VerticalAlign.CENTER, align: AlignmentType.CENTER }),
    cell(phase, 1400, { bold: true, fill: LB, valign: VerticalAlign.CENTER }),
    cell(teacherParas, 3363),
    cell(studentParas, 3363)
  ]});
}

const phases = [
  { time: "5 min", phase: "Hook",
    teacher: [
      "Display well-known Australian health campaigns on slides (e.g., Slip Slop Slap, Swap It Don\u2019t Stop It, R U OK?)",
      "Ask: \u201CWhat message is being sent? Who do you think it\u2019s aimed at?\u201D",
      "Facilitate brief class discussion to activate prior knowledge"
    ],
    student: [
      "Observe health campaign examples on screen",
      "Think-pair-share: discuss with a partner what messages they notice",
      "Share ideas with the class"
    ]},
  { time: "10 min", phase: "Define & Explore",
    teacher: [
      "Guide discussion: \u201CWhat makes something a health message?\u201D",
      "Present formal definition using slides",
      "Show examples across different contexts (nutrition, exercise, mental health, sun safety)",
      "Record student ideas on the board"
    ],
    student: [
      "Contribute examples of health messages they\u2019ve encountered",
      "Record definition in worksheet or workbook",
      "Discuss where they\u2019ve seen health messages in their daily lives"
    ]},
  { time: "10 min", phase: "Identify & Match",
    teacher: [
      "Present different media types: TV, social media, billboards, websites, radio, print",
      "Show specific examples of health messages in each media type",
      "Guide matching activity: which audiences are targeted by which messages?"
    ],
    student: [
      "Identify health messages from the presented media examples",
      "Work in pairs to match health messages to their intended audience",
      "Begin Activity 1 on the worksheet: Health Message Hunt"
    ]},
  { time: "10 min", phase: "Evaluate Credibility",
    teacher: [
      "Introduce the credibility framework: Purpose, Information, Messenger",
      "Model evaluation of one health message using the framework",
      "Guide students through a second example as a class"
    ],
    student: [
      "Follow along with the modelled evaluation",
      "Contribute ideas during the guided practice",
      "Complete Activity 2 on the worksheet: Credibility Check"
    ]},
  { time: "10 min", phase: "High-Profile Messengers",
    teacher: [
      "Show examples of celebrities and athletes endorsing health-related products",
      "Discuss: \u201CWhy do companies use famous people to sell products?\u201D",
      "Facilitate discussion on the difference between a genuine health message and a paid endorsement"
    ],
    student: [
      "Match high-profile people to the products they endorse",
      "Suggest reasons why certain people are chosen for certain products",
      "Complete Activity 3 on the worksheet"
    ]},
  { time: "8 min", phase: "Celebrity, Hero, or Role Model?",
    teacher: [
      "Present definitions: Celebrity (famous for entertainment), Hero (brave/selfless actions), Role Model (someone whose behaviour you want to follow)",
      "Show examples and discuss: Can someone be more than one?",
      "Guide sorting activity with class input"
    ],
    student: [
      "Classify given people into categories with justification",
      "Discuss overlaps and differences between categories",
      "Complete Activity 4 on the worksheet"
    ]},
  { time: "7 min", phase: "Reflect & Wrap Up",
    teacher: [
      "Direct students to complete Activity 5: Personal Reflection",
      "Circulate and support students as needed",
      "Bring class together for brief sharing of reflections",
      "Summarise key takeaways using the conclusion slide"
    ],
    student: [
      "Complete the personal reflection on the worksheet",
      "Share reflections with a partner or the class",
      "Listen to key takeaways and note any new ideas"
    ]}
];

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 20 } } }
  },
  numbering: {
    config: [
      { reference: "bullet-list", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022",
        alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 450, hanging: 250 } } } }] },
      { reference: "li-list", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022",
        alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "sc-list", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022",
        alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "res-list", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022",
        alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "diff-list", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022",
        alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "assess-list", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022",
        alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 }
      }
    },
    headers: {
      default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [
        new TextRun({ text: "Year 6 HPE \u2014 Who Influences Me? \u2014 Lesson 1", font: "Arial", size: 16, color: "999999", italics: true })
      ]})] })
    },
    footers: {
      default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [
        new TextRun({ text: "Page ", font: "Arial", size: 16, color: "999999" }),
        new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 16, color: "999999" }),
        new TextRun({ text: " of ", font: "Arial", size: 16, color: "999999" }),
        new TextRun({ children: [PageNumber.TOTAL_PAGES], font: "Arial", size: 16, color: "999999" })
      ]})] })
    },
    children: [
      // Title banner table
      new Table({
        columnWidths: [9746],
        rows: [new TableRow({ children: [
          new TableCell({
            borders: nobds,
            width: { size: 9746, type: WidthType.DXA },
            shading: { fill: DB, type: ShadingType.CLEAR },
            children: [
              new Paragraph({ spacing: { before: 200, after: 60 }, alignment: AlignmentType.CENTER, children: [
                new TextRun({ text: "LESSON PLAN", font: "Arial", size: 36, bold: true, color: "FFFFFF" })
              ]}),
              new Paragraph({ spacing: { before: 0, after: 200 }, alignment: AlignmentType.CENTER, children: [
                new TextRun({ text: "Who Influences Me? \u2014 Lesson 1", font: "Arial", size: 28, color: "FFFFFF" })
              ]})
            ]
          })
        ]})]
      }),
      new Paragraph({ spacing: { before: 200, after: 0 }, children: [] }),

      // Info table
      new Table({
        columnWidths: [2400, 7346],
        rows: [
          new TableRow({ children: [
            cell("Unit", 2400, { bold: true, fill: LB }),
            cell("Who Influences Me? (Part B)", 7346)
          ]}),
          new TableRow({ children: [
            cell("Topic", 2400, { bold: true, fill: LB }),
            cell("Topic 3 \u2014 Influence of the Media on Health Decisions", 7346)
          ]}),
          new TableRow({ children: [
            cell("Year Level", 2400, { bold: true, fill: LB }),
            cell("Year 6", 7346)
          ]}),
          new TableRow({ children: [
            cell("Duration", 2400, { bold: true, fill: LB }),
            cell("60 minutes", 7346)
          ]}),
          new TableRow({ children: [
            cell("Curriculum", 2400, { bold: true, fill: LB }),
            cell("ACPPS057 \u2014 Recognise how media and important people in the community influence personal attitudes, beliefs, decisions and behaviours", 7346)
          ]}),
          new TableRow({ children: [
            cell("General Capabilities", 2400, { bold: true, fill: LB }),
            cell("Literacy (Comprehending texts, Composing texts, Text knowledge, Visual knowledge)", 7346)
          ]})
        ]
      }),

      // Learning Intentions
      heading("Learning Intentions", 26, DB),
      new Paragraph({ spacing: { before: 40, after: 40 }, children: [
        new TextRun({ text: "We are learning to:", font: "Arial", size: 20, italics: true })
      ]}),
      bullet("Identify and analyse health messages communicated through different types of media", "li-list"),
      bullet("Evaluate the credibility of health messages by examining their purpose, information, and messenger", "li-list"),
      bullet("Understand why high-profile people are used as media messengers and how they influence our health choices", "li-list"),

      // Success Criteria
      heading("Success Criteria", 26, DB),
      new Paragraph({ spacing: { before: 40, after: 40 }, children: [
        new TextRun({ text: "I can:", font: "Arial", size: 20, italics: true })
      ]}),
      bullet("Define what a health message is and provide examples", "sc-list"),
      bullet("Identify health messages across different media types (TV, social media, billboards, websites, radio, print)", "sc-list"),
      bullet("Match health messages to their intended audience", "sc-list"),
      bullet("Evaluate a health message\u2019s credibility using the Purpose, Information, Messenger framework", "sc-list"),
      bullet("Explain why high-profile people are used to endorse products and health messages", "sc-list"),
      bullet("Classify a high-profile person as a celebrity, hero, or role model (or a combination)", "sc-list"),

      // Resources
      heading("Resources Required", 26, DB),
      bullet("Lesson 1 \u2014 Presentation slides (PowerPoint)", "res-list"),
      bullet("Lesson 1 \u2014 Student Worksheet (one per student)", "res-list"),
      bullet("Whiteboard/interactive board for class discussions", "res-list"),
      bullet("Examples of health advertisements/campaigns (prepared in the presentation)", "res-list"),

      // Lesson Sequence heading
      heading("Lesson Sequence", 26, DB),
      new Paragraph({ spacing: { before: 0, after: 100 }, children: [] }),

      // Lesson sequence table
      new Table({
        columnWidths: [900, 1400, 3363, 3363],
        rows: [
          // Header row
          new TableRow({ tableHeader: true, children: [
            cell("Time", 900, { bold: true, fill: DB, fontColor: "FFFFFF", align: AlignmentType.CENTER, valign: VerticalAlign.CENTER }),
            cell("Phase", 1400, { bold: true, fill: DB, fontColor: "FFFFFF", align: AlignmentType.CENTER, valign: VerticalAlign.CENTER }),
            cell("Teacher Actions", 3363, { bold: true, fill: DB, fontColor: "FFFFFF", align: AlignmentType.CENTER, valign: VerticalAlign.CENTER }),
            cell("Student Actions", 3363, { bold: true, fill: DB, fontColor: "FFFFFF", align: AlignmentType.CENTER, valign: VerticalAlign.CENTER })
          ]}),
          ...phases.map(p => phaseRow(p.time, p.phase, p.teacher, p.student))
        ]
      }),

      // Assessment
      heading("Assessment Opportunities", 26, DB),
      bullet("Observe student participation during class discussions (formative)", "assess-list"),
      bullet("Review completed worksheets for understanding of key concepts", "assess-list"),
      bullet("Monitor pair work during the matching and sorting activities", "assess-list"),
      bullet("Use the personal reflection (Activity 5) to gauge depth of understanding about media influence", "assess-list"),
      new Paragraph({ spacing: { before: 80, after: 40 }, children: [
        new TextRun({ text: "Evidence of learning: ", font: "Arial", size: 20, bold: true }),
        new TextRun({ text: "Can the student propose reasons for the use of high-profile people to give health messages? Can the student determine the influence of health messages from high-profile people on their health choices and behaviour?", font: "Arial", size: 20 })
      ]}),

      // Differentiation
      heading("Differentiation Strategies", 26, DB),
      new Table({
        columnWidths: [4873, 4873],
        rows: [
          new TableRow({ children: [
            cell("Support", 4873, { bold: true, fill: LB, align: AlignmentType.CENTER, valign: VerticalAlign.CENTER }),
            cell("Extension", 4873, { bold: true, fill: LB, align: AlignmentType.CENTER, valign: VerticalAlign.CENTER })
          ]}),
          new TableRow({ children: [
            cell([
              bullet("Provide word banks and sentence starters for written responses", "diff-list"),
              bullet("Pre-select health message examples for students who need support", "diff-list"),
              bullet("Pair with a peer mentor during activities", "diff-list"),
              bullet("Use visual prompts and simplified definitions", "diff-list")
            ], 4873),
            cell([
              bullet("Analyse the ethical implications of celebrity endorsements", "diff-list"),
              bullet("Compare health messages across different countries or cultures", "diff-list"),
              bullet("Create their own health message for a specific audience", "diff-list"),
              bullet("Evaluate whether a specific campaign was effective and why", "diff-list")
            ], 4873)
          ]})
        ]
      }),

      // Teacher reflection
      heading("Teacher Reflection Notes", 26, DB),
      new Table({
        columnWidths: [9746],
        rows: [new TableRow({ children: [
          cell([
            new Paragraph({ spacing: { before: 40, after: 40 }, children: [
              new TextRun({ text: "What worked well?", font: "Arial", size: 20, italics: true, color: "999999" })
            ]}),
            new Paragraph({ spacing: { before: 200, after: 40 }, children: [] }),
            new Paragraph({ spacing: { before: 200, after: 40 }, children: [
              new TextRun({ text: "What would I change next time?", font: "Arial", size: 20, italics: true, color: "999999" })
            ]}),
            new Paragraph({ spacing: { before: 200, after: 200 }, children: [] })
          ], 9746)
        ]})]
      })
    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(OUT, buf);
  console.log('Lesson plan created:', OUT);
});
