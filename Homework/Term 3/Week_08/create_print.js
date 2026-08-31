const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, BorderStyle, WidthType, TabStopType,
  PageNumber, VerticalAlign
} = require("docx");
const { texts, comp, mathY5, mathY34 } = require("./homework_content");

const OUT = __dirname;
const PAGE_W = 11906, PAGE_H = 16838;
const M = { top: 454, right: 510, bottom: 454, left: 510 };
const WIDTH = PAGE_W - M.left - M.right;
const COL = Math.floor(WIDTH / 2);
const NONE = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const HAIR = { style: BorderStyle.SINGLE, size: 3, color: "C8CDD3", space: 2 };

function p(text, opts = {}) {
  return new Paragraph({
    alignment: opts.align,
    keepNext: opts.keepNext,
    spacing: opts.spacing || { before: 0, after: 0, line: 190 },
    children: [new TextRun({ text, font: "Arial", size: opts.size || 18, bold: opts.bold, color: opts.color || "1F2937" })]
  });
}
function title(group, subtitle) {
  return [
    p("TERM 3 - WEEK 8 HOMEWORK", { align: AlignmentType.CENTER, bold: true, size: 25, color: "173F5F", spacing: { after: 20, line: 250 } }),
    p(subtitle, { align: AlignmentType.CENTER, bold: true, size: 21, spacing: { after: 45, line: 220 } }),
    new Paragraph({
      spacing: { after: 60, line: 190 },
      children: [
        new TextRun({ text: "Name: ", bold: true, size: 18, font: "Arial" }),
        new TextRun({ text: "________________________________        ", size: 18, font: "Arial" }),
        new TextRun({ text: "Group: ", bold: true, size: 18, font: "Arial" }),
        new TextRun({ text: group, size: 18, font: "Arial" })
      ]
    })
  ];
}
function compactQ(q, number, width, maths = false) {
  const tab = Math.floor(width / 2);
  return [
    new Paragraph({
      keepNext: true,
      spacing: { before: maths ? 20 : 30, after: 0, line: 210 },
      children: [new TextRun({ text: `${number}. ${q.q}`, bold: true, size: 20, font: "Arial" })]
    }),
    new Paragraph({
      keepNext: true,
      tabStops: [{ type: TabStopType.LEFT, position: tab }],
      spacing: { before: 0, after: 0, line: 200 },
      children: [
        new TextRun({ text: `A. ${q.a}`, size: 20, font: "Arial" }),
        new TextRun({ text: `\tB. ${q.b}`, size: 20, font: "Arial" })
      ]
    }),
    new Paragraph({
      tabStops: [{ type: TabStopType.LEFT, position: tab }],
      spacing: { before: 0, after: maths ? 25 : 35, line: 200 },
      border: { bottom: HAIR },
      children: [
        new TextRun({ text: `C. ${q.c}`, size: 20, font: "Arial" }),
        new TextRun({ text: `\tD. ${q.d}`, size: 20, font: "Arial" })
      ]
    })
  ];
}
function cell(questions, start) {
  return new TableCell({
    width: { size: COL, type: WidthType.DXA },
    borders: { top: NONE, bottom: NONE, left: NONE, right: NONE },
    verticalAlign: VerticalAlign.TOP,
    margins: { top: 0, bottom: 0, left: 70, right: 70 },
    children: questions.flatMap((q, i) => compactQ(q, start + i, COL - 140, true))
  });
}
function printDoc(group) {
  const t = texts[group];
  const maths = group === "Green" ? mathY34 : mathY5;
  const mathSectionHeading = group === "Green"
    ? "MATHEMATICS — DIVISION WORD PROBLEMS (FOUNDATIONAL)"
    : "MATHEMATICS — DIVISION WORD PROBLEMS (MULTI-STEP & REAL-WORLD)";
  return new Document({
    styles: { default: { document: { run: { font: "Arial", size: 18, color: "1F2937" } } } },
    sections: [{
      properties: { page: { size: { width: PAGE_W, height: PAGE_H }, margin: M, pageNumbers: { start: 1 } } },
      headers: { default: new Header({ children: [p("Homework | Term 3 | Week 8", { align: AlignmentType.RIGHT, size: 15, color: "6B7280" })] }) },
      footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Page ", size: 15 }), new TextRun({ children: [PageNumber.CURRENT], size: 15 })] })] }) },
      children: [
        ...title(group, t.title),
        p("READING", { bold: true, size: 20, color: "173F5F", spacing: { before: 20, after: 15, line: 210 } }),
        ...t.paragraphs.map(text => p(text, { size: 24, spacing: { after: 70, line: 312 } })),
        p("READING QUESTIONS", { bold: true, size: 20, color: "173F5F", spacing: { before: 30, after: 10, line: 210 } }),
        ...comp[group].flatMap((q, i) => compactQ(q, i + 1, WIDTH, false)),
        p(mathSectionHeading, { bold: true, size: 20, color: "173F5F", spacing: { before: 45, after: 10, line: 210 } }),
        new Table({
          width: { size: WIDTH, type: WidthType.DXA },
          columnWidths: [COL, WIDTH - COL],
          margins: { top: 0, bottom: 0, left: 0, right: 0 },
          rows: [new TableRow({ children: [cell(maths.slice(0, 8), 16), cell(maths.slice(8), 24)] })]
        })
      ]
    }]
  });
}
(async () => {
  for (const group of ["Red", "Blue", "Green"]) {
    fs.writeFileSync(path.join(OUT, `Week_8_Print_${group}.docx`), await Packer.toBuffer(printDoc(group)));
  }
  console.log("Created 3 student print documents for Week 8.");
})().catch(error => { console.error(error); process.exit(1); });
