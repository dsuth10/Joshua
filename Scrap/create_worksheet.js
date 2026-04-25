const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber } = require('docx');

const OUT = 'c:\\Users\\dsuth\\Documents\\Joshua\\Units\\Health\\Who influences me Part B\\Lesson 1 - Student Worksheet.docx';
const DB = "1A3A6B", MB = "2E6BC6", LB = "D6E4F7";
const bdr = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const bds = { top: bdr, bottom: bdr, left: bdr, right: bdr };
const nobdr = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const nobds = { top: nobdr, bottom: nobdr, left: nobdr, right: nobdr };

function cell(content, width, opts = {}) {
  const paras = Array.isArray(content) ? content : [
    new Paragraph({ spacing: { before: 80, after: 80 }, children: [
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

function activityHeader(num, title) {
  return new Table({
    columnWidths: [9746],
    rows: [new TableRow({ children: [
      new TableCell({
        borders: nobds,
        width: { size: 9746, type: WidthType.DXA },
        shading: { fill: LB, type: ShadingType.CLEAR },
        children: [
          new Paragraph({ spacing: { before: 120, after: 120 }, children: [
            new TextRun({ text: `Activity ${num}: ${title}`, font: "Arial", size: 24, bold: true, color: DB })
          ]})
        ]
      })
    ]})]
  });
}

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 20 } } }
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 }
      }
    },
    headers: {
      default: new Header({ children: [
        new Table({
          columnWidths: [4873, 4873],
          rows: [new TableRow({ children: [
            cell("Name: ________________________", 4873, { noBorder: true }),
            cell("Date: ________________________", 4873, { noBorder: true, align: AlignmentType.RIGHT })
          ]})]
        })
      ]})
    },
    footers: {
      default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [
        new TextRun({ text: "Who Influences Me? \u2014 Lesson 1 Worksheet", font: "Arial", size: 16, color: "999999", italics: true })
      ]})] })
    },
    children: [
      // Title
      new Table({
        columnWidths: [9746],
        rows: [new TableRow({ children: [
          new TableCell({
            borders: nobds,
            width: { size: 9746, type: WidthType.DXA },
            shading: { fill: DB, type: ShadingType.CLEAR },
            children: [
              new Paragraph({ spacing: { before: 200, after: 200 }, alignment: AlignmentType.CENTER, children: [
                new TextRun({ text: "STUDENT WORKSHEET: WHO INFLUENCES ME?", font: "Arial", size: 28, bold: true, color: "FFFFFF" })
              ]})
            ]
          })
        ]})]
      }),
      new Paragraph({ spacing: { before: 200, after: 100 }, children: [
        new TextRun({ text: "Learning Goal: ", font: "Arial", size: 20, bold: true }),
        new TextRun({ text: "To identify health messages in the media and evaluate the influence of high-profile messengers.", font: "Arial", size: 20 })
      ]}),

      // Activity 1: Health Message Hunt
      activityHeader(1, "Health Message Hunt"),
      new Paragraph({ spacing: { before: 100, after: 100 }, children: [
        new TextRun({ text: "Identify three different health messages you have seen in the media recently.", font: "Arial", size: 20 })
      ]}),
      new Table({
        columnWidths: [3248, 3248, 3250],
        rows: [
          new TableRow({ tableHeader: true, children: [
            cell("What is the Health Message?", 3248, { bold: true, fill: DB, fontColor: "FFFFFF" }),
            cell("Where did you see it? (Media Type)", 3248, { bold: true, fill: DB, fontColor: "FFFFFF" }),
            cell("Who is the intended audience?", 3250, { bold: true, fill: DB, fontColor: "FFFFFF" })
          ]}),
          new TableRow({ children: [cell("", 3248), cell("", 3248), cell("", 3250)] }),
          new TableRow({ children: [cell("", 3248), cell("", 3248), cell("", 3250)] }),
          new TableRow({ children: [cell("", 3248), cell("", 3248), cell("", 3250)] })
        ]
      }),
      new Paragraph({ spacing: { before: 200, after: 0 } }),

      // Activity 2: Credibility Check
      activityHeader(2, "Credibility Check"),
      new Paragraph({ spacing: { before: 100, after: 100 }, children: [
        new TextRun({ text: "Choose one health message from above and evaluate its credibility using the framework below.", font: "Arial", size: 20 })
      ]}),
      new Table({
        columnWidths: [2400, 7346],
        rows: [
          new TableRow({ children: [
            cell("PURPOSE\nWhy was this message created?", 2400, { bold: true, fill: LB }),
            cell("\n\n", 7346)
          ]}),
          new TableRow({ children: [
            cell("INFORMATION\nWhat facts are provided? Is it accurate?", 2400, { bold: true, fill: LB }),
            cell("\n\n", 7346)
          ]}),
          new TableRow({ children: [
            cell("MESSENGER\nWho is giving the message? Are they an expert?", 2400, { bold: true, fill: LB }),
            cell("\n\n", 7346)
          ]})
        ]
      }),
      new Paragraph({ spacing: { before: 200, after: 0 } }),

      // Activity 3: Celebrity Match
      activityHeader(3, "Celebrity Match"),
      new Paragraph({ spacing: { before: 100, after: 100 }, children: [
        new TextRun({ text: "Match the following high-profile people with the products or health behaviours they might endorse.", font: "Arial", size: 20 })
      ]}),
      new Table({
        columnWidths: [4873, 4873],
        rows: [
          new TableRow({ children: [
            cell("High-Profile Person", 4873, { bold: true, fill: DB, fontColor: "FFFFFF" }),
            cell("Likely Endorsement (Product/Health)", 4873, { bold: true, fill: DB, fontColor: "FFFFFF" })
          ]}),
          new TableRow({ children: [cell("A Professional Athlete", 4873), cell("________________________________", 4873)] }),
          new TableRow({ children: [cell("A Famous Pop Singer", 4873), cell("________________________________", 4873)] }),
          new TableRow({ children: [cell("A Popular YouTuber / Gamer", 4873), cell("________________________________", 4873)] }),
          new TableRow({ children: [cell("A Medical Doctor on TV", 4873), cell("________________________________", 4873)] })
        ]
      }),
      new Paragraph({ spacing: { before: 200, after: 0 } }),

      // Activity 4: Celebrity, Hero, or Role Model?
      activityHeader(4, "Celebrity, Hero, or Role Model?"),
      new Paragraph({ spacing: { before: 100, after: 100 }, children: [
        new TextRun({ text: "Classify each description as a Celebrity, Hero, or Role Model. You can use more than one!", font: "Arial", size: 20 })
      ]}),
      new Table({
        columnWidths: [6000, 3746],
        rows: [
          new TableRow({ children: [
            cell("Description", 6000, { bold: true, fill: DB, fontColor: "FFFFFF" }),
            cell("Classification", 3746, { bold: true, fill: DB, fontColor: "FFFFFF" })
          ]}),
          new TableRow({ children: [
            cell("Someone famous for their musical talent and movie roles.", 6000),
            cell("", 3746)
          ]}),
          new TableRow({ children: [
            cell("A person who risks their life to save others in an emergency.", 6000),
            cell("", 3746)
          ]}),
          new TableRow({ children: [
            cell("An older sibling who works hard and is kind to everyone.", 6000),
            cell("", 3746)
          ]}),
          new TableRow({ children: [
            cell("An athlete who wins gold and uses their fame to help charities.", 6000),
            cell("", 3746)
          ]})
        ]
      }),
      new Paragraph({ spacing: { before: 200, after: 0 } }),

      // Activity 5: Personal Reflection
      activityHeader(5, "Personal Reflection"),
      new Paragraph({ spacing: { before: 100, after: 100 }, children: [
        new TextRun({ text: "How do health messages from high-profile people influence your personal choices about products and health behaviour? Give an example.", font: "Arial", size: 20 })
      ]}),
      new Table({
        columnWidths: [9746],
        rows: [
          new TableRow({ children: [cell("\n\n\n\n\n", 9746)] })
        ]
      })
    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(OUT, buf);
  console.log('Student worksheet created:', OUT);
});
