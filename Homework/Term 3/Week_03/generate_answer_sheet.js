const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, BorderStyle, WidthType, ShadingType,
  VerticalAlign, PageNumber
} = require("docx");
const { comp, mathY5, mathY34 } = require("./homework_content");

const OUT = __dirname;
const PAGE_W = 11906, PAGE_H = 16838; // A4
const M = { top: 510, right: 510, bottom: 510, left: 510 };
const PRINTABLE_W = PAGE_W - M.left - M.right; // 10886

const COL_W1 = 3628;
const COL_W2 = 3630;
const COL_W3 = 3628;
const COL_WIDTHS = [COL_W1, COL_W2, COL_W3];

const BORDER_NONE = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const BORDER_THIN = { style: BorderStyle.SINGLE, size: 4, color: "D1D5DB" };
const BORDER_HEADER = { style: BorderStyle.SINGLE, size: 8, color: "9CA3AF" };

function p(text, opts = {}) {
  return new Paragraph({
    alignment: opts.align || AlignmentType.LEFT,
    spacing: opts.spacing || { before: 0, after: 0, line: 200 },
    children: opts.runs || [
      new TextRun({
        text,
        font: "Arial",
        size: opts.size || 18,
        bold: opts.bold || false,
        color: opts.color || "1F2937"
      })
    ]
  });
}

function qCell(qNum, ans, colWidth, bg, color) {
  return new TableCell({
    width: { size: colWidth, type: WidthType.DXA },
    shading: { fill: bg, type: ShadingType.CLEAR },
    borders: {
      top: BORDER_THIN,
      bottom: BORDER_THIN,
      left: BORDER_THIN,
      right: BORDER_THIN
    },
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 40, bottom: 40, left: 100, right: 100 },
    children: [
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { before: 0, after: 0, line: 200 },
        children: [
          new TextRun({ text: `Q${qNum.toString().padStart(2, '0')}: `, font: "Arial", size: 18, color: "4B5563" }),
          new TextRun({ text: ans, font: "Arial", size: 20, bold: true, color: color || "111827" })
        ]
      })
    ]
  });
}

function headerCell(title, subtitle, colWidth, bg, textColor, borderColor) {
  return new TableCell({
    width: { size: colWidth, type: WidthType.DXA },
    shading: { fill: bg, type: ShadingType.CLEAR },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 12, color: borderColor },
      bottom: { style: BorderStyle.SINGLE, size: 12, color: borderColor },
      left: { style: BorderStyle.SINGLE, size: 12, color: borderColor },
      right: { style: BorderStyle.SINGLE, size: 12, color: borderColor }
    },
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 100, bottom: 100, left: 100, right: 100 },
    children: [
      p(title, { align: AlignmentType.CENTER, bold: true, size: 22, color: textColor, spacing: { before: 0, after: 20, line: 240 } }),
      p(subtitle, { align: AlignmentType.CENTER, bold: false, size: 16, color: textColor, spacing: { before: 0, after: 0, line: 180 } })
    ]
  });
}

function sectionCell(title, colWidth, bg, textColor) {
  return new TableCell({
    width: { size: colWidth, type: WidthType.DXA },
    shading: { fill: bg, type: ShadingType.CLEAR },
    borders: {
      top: BORDER_HEADER,
      bottom: BORDER_HEADER,
      left: BORDER_THIN,
      right: BORDER_THIN
    },
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    children: [
      p(title, { align: AlignmentType.CENTER, bold: true, size: 18, color: textColor, spacing: { before: 0, after: 0, line: 200 } })
    ]
  });
}

async function buildDoc() {
  const greenData = { reading: comp.Green, math: mathY34 };
  const blueData = { reading: comp.Blue, math: mathY5 };
  const redData = { reading: comp.Red, math: mathY5 };

  const rows = [];

  // 1. Header Row
  rows.push(
    new TableRow({
      cantSplit: true,
      children: [
        headerCell("GREEN LEVEL", "Year 3/4 Standard", COL_W1, "D1E7DD", "0F5132", "A3CFBB"),
        headerCell("BLUE LEVEL", "Year 5 Standard", COL_W2, "CFE2FF", "084298", "9EC5FE"),
        headerCell("RED LEVEL", "Year 5 Extension", COL_W3, "F8D7DA", "842029", "F5C2C7")
      ]
    })
  );

  // 2. Reading Section Header Row
  rows.push(
    new TableRow({
      cantSplit: true,
      children: [
        sectionCell("READING COMPREHENSION (Q1–15)", COL_W1, "E9ECEF", "212529"),
        sectionCell("READING COMPREHENSION (Q1–15)", COL_W2, "E9ECEF", "212529"),
        sectionCell("READING COMPREHENSION (Q1–15)", COL_W3, "E9ECEF", "212529")
      ]
    })
  );

  // 3. Reading Questions (Q1 - Q15)
  for (let i = 0; i < 15; i++) {
    const qNum = i + 1;
    const bg = i % 2 === 0 ? "FFFFFF" : "F9FAFB";
    rows.push(
      new TableRow({
        cantSplit: true,
        children: [
          qCell(qNum, greenData.reading[i].ans, COL_W1, bg, "0F5132"),
          qCell(qNum, blueData.reading[i].ans, COL_W2, bg, "084298"),
          qCell(qNum, redData.reading[i].ans, COL_W3, bg, "842029")
        ]
      })
    );
  }

  // 4. Mathematics Section Header Row
  rows.push(
    new TableRow({
      cantSplit: true,
      children: [
        sectionCell("MATHEMATICS (Q16–30)", COL_W1, "E9ECEF", "212529"),
        sectionCell("MATHEMATICS (Q16–30)", COL_W2, "E9ECEF", "212529"),
        sectionCell("MATHEMATICS (Q16–30)", COL_W3, "E9ECEF", "212529")
      ]
    })
  );

  // 5. Mathematics Questions (Q16 - Q30)
  for (let i = 0; i < 15; i++) {
    const qNum = i + 16;
    const bg = i % 2 === 0 ? "FFFFFF" : "F9FAFB";
    rows.push(
      new TableRow({
        cantSplit: true,
        children: [
          qCell(qNum, greenData.math[i].ans, COL_W1, bg, "0F5132"),
          qCell(qNum, blueData.math[i].ans, COL_W2, bg, "084298"),
          qCell(qNum, redData.math[i].ans, COL_W3, bg, "842029")
        ]
      })
    );
  }

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: "Arial", size: 18, color: "1F2937" }
        }
      }
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: PAGE_W, height: PAGE_H },
            margin: M
          }
        },
        headers: {
          default: new Header({
            children: [
              p("Term 3 | Week 3 | Master Answer Key", {
                align: AlignmentType.RIGHT,
                size: 15,
                color: "6B7280"
              })
            ]
          })
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: "Week 3 Homework Master Answer Sheet  |  Page ", size: 15, color: "6B7280" }),
                  new TextRun({ children: [PageNumber.CURRENT], size: 15, color: "6B7280" })
                ]
              })
            ]
          })
        },
        children: [
          p("TERM 3 — WEEK 3 HOMEWORK ANSWER KEY", {
            align: AlignmentType.CENTER,
            bold: true,
            size: 26,
            color: "173F5F",
            spacing: { before: 0, after: 30, line: 260 }
          }),
          p("Teacher Quick Reference Guide • Green, Blue & Red Levels", {
            align: AlignmentType.CENTER,
            bold: false,
            size: 18,
            color: "4B5563",
            spacing: { before: 0, after: 120, line: 220 }
          }),
          new Table({
            width: { size: PRINTABLE_W, type: WidthType.DXA },
            columnWidths: COL_WIDTHS,
            rows
          })
        ]
      }
    ]
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(path.join(OUT, "Week_3_Answer_Sheet.docx"), buffer);
  console.log("Successfully generated Week_3_Answer_Sheet.docx!");
}

buildDoc().catch(err => {
  console.error("Error generating answer sheet:", err);
  process.exit(1);
});
