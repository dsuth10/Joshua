/**
 * TEMPLATE — Lesson NN .docx generator.
 *
 * Copy to Units/English/English_Unit_2/Unit_Plan/_scripts/generate_lesson_NN.js
 * then edit:
 *   - LESSON_NUM, LESSON_SLUG, LESSON_TITLE
 *   - AC9 codes, learning intention, success criteria
 *   - minute-by-minute sequence body
 *   - worksheet aspect rows
 *   - Lucas Y2 scaffolds
 *   - answer key model answers
 *
 * Inherits style constants and helper functions from Lesson 1. Consult
 * Units/English/English_Unit_2/Unit_Plan/_scripts/generate_lesson_01.js for
 * the full working example.
 */
const {
  Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel,
  BorderStyle, Table, TableRow, TableCell, WidthType, VerticalAlign,
} = require("docx");
const fs = require("fs");
const path = require("path");

// ==== EDIT PER LESSON =====================================================
const LESSON_NUM   = "NN";
const LESSON_SLUG  = "Replace_With_Slug";           // e.g. "Characteristic_Stages"
const LESSON_TITLE = "Replace with lesson title";   // e.g. "Characteristic stages of information reports"
// ==========================================================================

const OCHRE = "B12E21";
const CHARCOAL = "2B2B2B";

const ROOT = path.resolve(__dirname, "../..");
const LESSON_PLANS = path.join(ROOT, "Lesson_Plans");
const STUDENT_DOCS = path.join(ROOT, "Student_Documents");

const styles = {
  default: { document: { run: { font: "Arial", size: 22, color: "000000" } } },
  paragraphStyles: [
    { id: "Title", name: "Title", basedOn: "Normal",
      run: { size: 56, bold: true, color: OCHRE, font: "Arial" },
      paragraph: { alignment: AlignmentType.CENTER, spacing: { before: 200, after: 200 } } },
    { id: "Heading1", name: "Heading 1", basedOn: "Normal",
      run: { size: 36, bold: true, color: OCHRE, font: "Arial" },
      paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 0,
        border: { bottom: { color: OCHRE, space: 1, style: BorderStyle.SINGLE, size: 6 } } } },
    { id: "Heading2", name: "Heading 2", basedOn: "Normal",
      run: { size: 26, bold: true, color: CHARCOAL, font: "Arial" },
      paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 1 } },
  ],
};

const p  = (t, o = {}) => new Paragraph({ text: t, ...o });
const pb = (t) => new Paragraph({ children: [new TextRun({ text: t, bold: true })] });
const bullet = (t) => new Paragraph({ text: t, bullet: { level: 0 } });
const h1 = (t) => new Paragraph({ text: t, heading: HeadingLevel.HEADING_1 });
const h2 = (t) => new Paragraph({ text: t, heading: HeadingLevel.HEADING_2 });

function writeDoc(relPath, children) {
  const doc = new Document({ styles, sections: [{ properties: {}, children }] });
  const out = path.join(ROOT, relPath);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  return Packer.toBuffer(doc).then((buf) => { fs.writeFileSync(out, buf); console.log("Wrote", out); });
}

// ---------- CONTENT (edit everything below) ------------------------------

function buildLessonPlan() {
  return writeDoc(`Lesson_Plans/Lesson_${LESSON_NUM}_${LESSON_SLUG}.docx`, [
    new Paragraph({ text: `LESSON PLAN — LESSON ${LESSON_NUM}: ${LESSON_TITLE.toUpperCase()}`, heading: HeadingLevel.TITLE }),
    p("Year 5 English — Unit 2 — Tarampa State School · Term 2, 2026 · 60 minutes"),
    h1("Curriculum alignment"),
    bullet("AC9E5__ — <descriptor>"),
    h1("Learning intention"),
    p("I can ..."),
    h1("Success criteria"),
    bullet("..."),
    h1("Differentiation"),
    pb("Core (Year 5):"), p("..."),
    pb("Lucas (Year 2 pathway):"), p("... (AC9E2__)"),
    h1("Minute-by-minute sequence"),
    h2("0–5 min — Settle, learning intention"),
    p("..."),
    h2("5–20 min — Activate"),
    p("..."),
    h2("20–45 min — Explore / Model"),
    p("..."),
    h2("45–58 min — Connect"),
    p("..."),
    h2("58–60 min — Closure / preview next lesson"),
    p("..."),
    h1("Formative assessment / monitoring"),
    bullet("..."),
    h1("Extension"),
    p("..."),
  ]);
}

function buildAnswerKey() {
  return writeDoc(`Lesson_Plans/Lesson_${LESSON_NUM}_Teacher_Answer_Key.docx`, [
    new Paragraph({ text: `LESSON ${LESSON_NUM} — TEACHER ANSWER KEY`, heading: HeadingLevel.TITLE }),
    p("Model answers for slide discussion questions."),
    h1("Slide X — <title>"), bullet("..."),
  ]);
}

function buildWorksheetY5() {
  return writeDoc(`Student_Documents/Lesson_${LESSON_NUM}_Worksheet_Y5.docx`, [
    new Paragraph({ text: `Lesson ${LESSON_NUM} — ${LESSON_TITLE}`, heading: HeadingLevel.TITLE }),
    p("Name: _________________________  Date: __________"),
    h1("Learning intention"),
    p("I can ..."),
    h1("My notes"),
    p("..."),
    h1("Exit ticket"),
    p("..."),
  ]);
}

function buildWorksheetLucas() {
  return writeDoc(`Student_Documents/Lesson_${LESSON_NUM}_Worksheet_Lucas_Y2.docx`, [
    new Paragraph({ text: `Lesson ${LESSON_NUM} — My worksheet (Year 2 pathway)`, heading: HeadingLevel.TITLE }),
    p("Name: _________________________"),
    h1("Learning focus"),
    p("AC9E2__ — <descriptor>"),
    h1("My task (with sentence starters)"),
    bullet("This text is about _________________________."),
    bullet("I can see _________________________."),
  ]);
}

async function main() {
  fs.mkdirSync(LESSON_PLANS, { recursive: true });
  fs.mkdirSync(STUDENT_DOCS, { recursive: true });
  await buildLessonPlan();
  await buildAnswerKey();
  await buildWorksheetY5();
  await buildWorksheetLucas();
}

main().catch((e) => { console.error(e); process.exit(1); });
