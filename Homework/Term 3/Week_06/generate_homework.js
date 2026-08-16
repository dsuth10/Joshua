const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, Header, Footer,
  AlignmentType, PageNumber
} = require("docx");
const { texts, comp, mathY5, mathY34 } = require("./homework_content");

const OUT = __dirname;
const PAGE = {
  size: { width: 11906, height: 16838 },
  margin: { top: 1134, right: 1276, bottom: 1134, left: 1276 },
  pageNumbers: { start: 1 }
};
const styles = {
  default: { document: { run: { font: "Arial", size: 24, color: "1F2937" }, paragraph: { spacing: { after: 120, line: 276 } } } },
  paragraphStyles: [
    { id: "Title", name: "Title", basedOn: "Normal", run: { font: "Arial", size: 32, bold: true, color: "173F5F" }, paragraph: { spacing: { before: 0, after: 100 }, alignment: AlignmentType.CENTER } },
    { id: "Subtitle", name: "Subtitle", basedOn: "Normal", run: { font: "Arial", size: 22, color: "4B5563" }, paragraph: { spacing: { after: 240 }, alignment: AlignmentType.CENTER } },
    { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: "Arial", size: 26, bold: true, color: "173F5F" }, paragraph: { spacing: { before: 180, after: 100 }, outlineLevel: 0 } }
  ]
};

function header(kind) {
  return new Header({ children: [new Paragraph({
    alignment: AlignmentType.RIGHT,
    spacing: { after: 0 },
    children: [new TextRun({ text: `Term 3 | Week 6 | ${kind}`, size: 17, color: "6B7280", font: "Arial" })]
  })] });
}
function footer() {
  return new Footer({ children: [new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 0 },
    children: [
      new TextRun({ text: "Page ", size: 17, color: "6B7280" }),
      new TextRun({ children: [PageNumber.CURRENT], size: 17, color: "6B7280" })
    ]
  })] });
}
function titleBlock(title, subtitle) {
  return [
    new Paragraph({ style: "Title", children: [new TextRun({ text: title, bold: true })] }),
    new Paragraph({ style: "Subtitle", children: [new TextRun(subtitle)] })
  ];
}
function baseDoc(children, kind) {
  return new Document({
    styles,
    sections: [{
      properties: { page: PAGE },
      headers: { default: header(kind) },
      footers: { default: footer() },
      children
    }]
  });
}
function readingDoc(group) {
  const t = texts[group];
  return baseDoc([
    ...titleBlock("Week 6 Homework - Information Text", t.title),
    ...t.paragraphs.map(text => new Paragraph({
      spacing: { after: 150, line: 312 },
      children: [new TextRun({ text, font: "Arial", size: 24 })]
    }))
  ], "Reading");
}
function qParas(q, number) {
  return [
    new Paragraph({ keepNext: true, spacing: { before: 140, after: 60 }, children: [new TextRun({ text: `${number}. ${q.q}`, bold: true, size: 22 })] }),
    ...["a", "b", "c", "d"].map((key, i) => new Paragraph({ keepNext: true, spacing: { after: 30 }, indent: { left: 360 }, children: [new TextRun({ text: `${"ABCD"[i]}. ${q[key]}`, size: 21 })] })),
    new Paragraph({ keepNext: true, spacing: { after: 20 }, children: [new TextRun({ text: `ANSWER: ${q.ans}`, bold: true, size: 20, color: "173F5F" })] }),
    new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "POINT: 1", size: 20, color: "4B5563" })] })
  ];
}
function questionsDoc(group) {
  const maths = group === "Green" ? mathY34 : mathY5;
  const mathHeading = group === "Green"
    ? "Mathematics — Multi-Step Word Problems (Foundational)"
    : "Mathematics — Multi-Step Word Problems (Four Operations)";
  return baseDoc([
    ...titleBlock(`Week 6 Questions - ${group}`, "Microsoft Forms import document"),
    new Paragraph({ style: "Heading1", children: [new TextRun("Reading comprehension")] }),
    ...comp[group].flatMap((q, i) => qParas(q, i + 1)),
    new Paragraph({ style: "Heading1", pageBreakBefore: true, children: [new TextRun(mathHeading)] }),
    ...maths.flatMap((q, i) => qParas(q, i + 16))
  ], "Questions");
}
async function write(name, doc) {
  fs.writeFileSync(path.join(OUT, name), await Packer.toBuffer(doc));
}
(async () => {
  for (const group of ["Red", "Blue", "Green"]) {
    await write(`Week_6_Reading_${group}.docx`, readingDoc(group));
    await write(`Week_6_Questions_${group}.docx`, questionsDoc(group));
  }
  console.log("Created 6 reading and Forms-ready question documents for Week 6.");
})().catch(error => { console.error(error); process.exit(1); });
