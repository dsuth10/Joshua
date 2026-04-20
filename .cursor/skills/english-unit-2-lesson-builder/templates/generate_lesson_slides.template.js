/**
 * TEMPLATE — Lesson NN .pptx generator.
 *
 * Copy to Units/English/English_Unit_2/Unit_Plan/_scripts/generate_lesson_NN_slides.js
 * then edit:
 *   - LESSON_NUM, LESSON_TITLE
 *   - IMG_DIR        (Lesson_NN_Screenshots/)
 *   - slide calls    (textSlide / aspectSlide)
 *
 * Inherits layout/style from the Lesson 1 slides generator. Do not place
 * model answers on slides — they belong in the teacher answer key.
 */
const path = require("path");
const fs = require("fs");
const PptxGenJS = require("pptxgenjs");

// ==== EDIT PER LESSON =====================================================
const LESSON_NUM   = "NN";
const LESSON_TITLE = "Replace with lesson title";
const IMG_DIR      = path.resolve(__dirname, `../Lesson_${"NN"}_Screenshots`);
// ==========================================================================

const OUT = path.resolve(__dirname, `../../Lesson_Plans/Lesson_${LESSON_NUM}_Slides.pptx`);

const OCHRE = "B12E21";
const CHARCOAL = "2B2B2B";
const MUTED = "555555";

function img(file) {
  const p = path.join(IMG_DIR, file);
  if (!fs.existsSync(p)) console.warn("Missing image:", p);
  return p;
}

function addTitleBar(pptx, slide, title) {
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: "100%", h: 0.85,
    fill: { color: OCHRE }, line: { color: OCHRE, width: 0 },
  });
  slide.addText(title, {
    x: 0.35, y: 0.15, w: 9.3, h: 0.55,
    fontSize: 22, bold: true, color: "FFFFFF", fontFace: "Arial",
  });
}

function aspectSlide(pptx, title, imageFile, questions) {
  const slide = pptx.addSlide();
  addTitleBar(pptx, slide, title);
  const p = img(imageFile);
  if (fs.existsSync(p)) {
    slide.addImage({ path: p, x: 0.35, y: 0.95, w: 5.6, h: 3.85, sizing: { type: "contain", w: 5.6, h: 3.85 } });
  }
  slide.addText(questions.map((q, i) => `${i + 1}. ${q}`).join("\n"), {
    x: 6.1, y: 0.95, w: 3.55, h: 4.2,
    fontSize: 14, color: CHARCOAL, fontFace: "Arial", valign: "top", lineSpacingMultiple: 1.15,
  });
}

function textSlide(pptx, title, bodyLines) {
  const slide = pptx.addSlide();
  addTitleBar(pptx, slide, title);
  slide.addText(bodyLines.join("\n"), {
    x: 0.45, y: 1.05, w: 9.1, h: 4.5,
    fontSize: 16, color: CHARCOAL, fontFace: "Arial", valign: "top", lineSpacingMultiple: 1.2,
  });
}

function main() {
  const pres = new PptxGenJS();
  pres.layout = "LAYOUT_WIDE";
  pres.author = "Tarampa State School";
  pres.title = `Lesson ${LESSON_NUM}: ${LESSON_TITLE}`;
  pres.subject = "Year 5 English — Unit 2";

  // 1 Title slide
  const s = pres.addSlide();
  s.background = { color: "F5F5F5" };
  s.addText(`Lesson ${LESSON_NUM}`, { x: 0.5, y: 1.2, w: 9, h: 0.6, fontSize: 18, color: MUTED, fontFace: "Arial" });
  s.addText(LESSON_TITLE, { x: 0.5, y: 1.75, w: 9, h: 1.8, fontSize: 32, bold: true, color: OCHRE, fontFace: "Arial" });
  s.addText("Year 5 English — Unit 2\nTarampa State School · Term 2, 2026",
    { x: 0.5, y: 4.2, w: 9, h: 1, fontSize: 14, color: MUTED, fontFace: "Arial" });

  // 2 Learning intention + success criteria
  textSlide(pres, "Learning intention", [
    "I can ...",
    "(AC9E5__)",
    "",
    "Success criteria — I am successful when I can:",
    "• ...",
    "• ...",
  ]);

  // 3 Activate
  textSlide(pres, "Activate — ...", [
    "...",
  ]);

  // Aspect slides (repeat per aspect from the lesson)
  // aspectSlide(pres, "Aspect 1 — ...", "aspect1.png", [
  //   "Question 1?",
  //   "Question 2?",
  //   "Question 3?",
  // ]);

  // Connect / exit ticket
  textSlide(pres, "Exit ticket", [
    "...",
  ]);

  // Differentiation (teacher-only)
  textSlide(pres, "(Teacher only) Differentiation — Lucas (Year 2 pathway)", [
    "AC9E2__",
    "...",
  ]);

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  pres.writeFile({ fileName: OUT }).then(() => console.log("Wrote", OUT));
}

main();
