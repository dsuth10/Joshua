/**
 * Builds Lesson_02_Slides.pptx for Year 5 English Unit 2, Lesson 2.
 * Run after capture: node generate_lesson_02_slides.js
 */
const path = require("path");
const fs = require("fs");
const PptxGenJS = require("pptxgenjs");

const OUT = path.resolve(__dirname, "../../Lesson_Plans/Lesson_02_Slides.pptx");
const IMG_DIR = path.resolve(__dirname, "../Lesson_02_Screenshots");

function img(file) {
  const p = path.join(IMG_DIR, file);
  if (!fs.existsSync(p)) {
    console.warn("Missing image (run capture_lesson_02_screenshots.js):", p);
  }
  return p;
}

const OCHRE = "B12E21";
const CHARCOAL = "2B2B2B";
const MUTED = "555555";

function addTitleBar(pptx, slide, title) {
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: "100%",
    h: 0.85,
    fill: { color: OCHRE },
    line: { color: OCHRE, width: 0 },
  });
  slide.addText(title, {
    x: 0.35,
    y: 0.15,
    w: 9.3,
    h: 0.55,
    fontSize: 22,
    bold: true,
    color: "FFFFFF",
    fontFace: "Arial",
  });
}

function aspectSlide(pptx, title, imageFile, questions) {
  const slide = pptx.addSlide();
  addTitleBar(pptx, slide, title);
  const imagePath = img(imageFile);
  if (fs.existsSync(imagePath)) {
    slide.addImage({
      path: imagePath,
      x: 0.35,
      y: 0.95,
      w: 5.6,
      h: 3.85,
      sizing: { type: "contain", w: 5.6, h: 3.85 },
    });
  }
  const qText = questions.map((q, i) => `${i + 1}. ${q}`).join("\n");
  slide.addText(qText, {
    x: 6.1,
    y: 0.95,
    w: 3.55,
    h: 4.2,
    fontSize: 14,
    color: CHARCOAL,
    fontFace: "Arial",
    valign: "top",
    bullet: false,
    lineSpacingMultiple: 1.15,
  });
}

function textSlide(pptx, title, bodyLines) {
  const slide = pptx.addSlide();
  addTitleBar(pptx, slide, title);
  slide.addText(bodyLines.join("\n"), {
    x: 0.45,
    y: 1.05,
    w: 9.1,
    h: 4.5,
    fontSize: 16,
    color: CHARCOAL,
    fontFace: "Arial",
    valign: "top",
    lineSpacingMultiple: 1.2,
  });
}

function main() {
  const pres = new PptxGenJS();
  pres.layout = "LAYOUT_WIDE";
  pres.author = "Tarampa State School";
  pres.title = "Lesson 2: Stages of Informative Texts — Cyclone Archive";
  pres.subject = "Year 5 English — Unit 2";

  // 1 Title
  let slide = pres.addSlide();
  slide.background = { color: "F5F5F5" };
  slide.addText("Lesson 2", {
    x: 0.5,
    y: 1.2,
    w: 9,
    h: 0.6,
    fontSize: 18,
    color: MUTED,
    fontFace: "Arial",
  });
  slide.addText("Stages of an Informative Text\nCyclone Archive Hub and Cyclone Tracy", {
    x: 0.5,
    y: 1.75,
    w: 9,
    h: 1.8,
    fontSize: 32,
    bold: true,
    color: OCHRE,
    fontFace: "Arial",
  });
  slide.addText("Year 5 English — Unit 2 — Sequence 1, Week 1\nTarampa State School · Term 2, 2026", {
    x: 0.5,
    y: 4.2,
    w: 9,
    h: 1,
    fontSize: 14,
    color: MUTED,
    fontFace: "Arial",
  });

  // 2 Learning intention + success criteria
  textSlide(pres, "Learning intention", [
    "Learning intention",
    "I can describe the characteristic stages and phases of an informative text.",
    "(AC9E5LA03, AC9E5LY03)",
    "",
    "Success criteria — I am successful when I can:",
    "• Name the four characteristic stages we use in this lesson.",
    "• Match parts of the Cyclone Archive hub page to a stage and justify with evidence.",
    "• Annotate the Cyclone Tracy sub-page in pairs using stage labels.",
  ]);

  // 3 Activate
  textSlide(pres, "Activate — Purpose and audience (from Lesson 1)", [
    "Think, pair, share:",
    "• What is the purpose of the Cyclone Archive hub page?",
    "• Who is a likely audience? What clues did you use?",
    "",
    "We are building on Lesson 1. Today we ask: How is the information organised in stages?",
  ]);

  // 4 Explore — introduce stages
  textSlide(pres, "Explore — Characteristic stages", [
    "Informative texts often move through stages that help readers learn in a logical order.",
    "",
    "In this lesson we use four stages:",
    "1. Classification / general statement",
    "2. Description",
    "3. Factual elaboration",
    "4. Summary",
    "",
    "Next slide: plain-English glosses. Then we test these ideas on the hub page screenshots.",
  ]);

  // 5 Stage reference card
  textSlide(pres, "Stage reference — what each stage does", [
    "Classification / general statement — names the topic and scope; tells what kind of information to expect.",
    "",
    "Description — sets the scene; introduces key parts, places, or categories.",
    "",
    "Factual elaboration — adds precise detail: numbers, dates, evidence, explanation.",
    "",
    "Summary — pulls key ideas together; highlights main findings or takeaways.",
  ]);

  // 6–9 Hub aspects
  aspectSlide(
    pres,
    "Hub — Classification (editorial intro)",
    "hub_editorial_intro.png",
    [
      "Which stage fits this block best — mostly classification, or mostly factual elaboration? Why?",
      "What phrases show the topic and scope (what the archive is about)?",
      "Why might the writer place this overview before the cyclone cards?",
    ]
  );

  aspectSlide(
    pres,
    "Hub — Description (chapter cards)",
    "hub_card_grid.png",
    [
      "How do the cards help describe the archive in parts rather than one long chunk?",
      "What is repeated on each card (year, place, teaser, data) — and why repeat it?",
      "Which stage is this mainly doing — description or factual elaboration? Defend your choice with one clue.",
    ]
  );

  aspectSlide(
    pres,
    "Hub — Factual elaboration (statistics strip)",
    "hub_stats.png",
    [
      "What factual details can you read straight from the numbers?",
      "How do statistics support the informative purpose before you read full stories?",
      "Pick one number. What does it prove or illustrate?",
    ]
  );

  aspectSlide(
    pres,
    "Hub — Summary / synthesis (evidence section)",
    "hub_about_evidence.png",
    [
      "How does this section pull together what the archive offers readers?",
      "Where do you see synthesis (bringing lenses together) rather than a single new fact?",
      "Could this work like a conclusion on a webpage? Why or why not?",
    ]
  );

  // 10 Modelled annotation
  textSlide(pres, "Model — Annotating the hub page", [
    "Teacher think-aloud:",
    '• "This paragraph mainly classifies the topic because…"',
    '• "These cards mainly describe the parts because…"',
    "",
    "Sentence stems for students:",
    "• I think this screenshot is mainly _____________ because _____________.",
    "• My evidence from the text is: _____________.",
    "",
    "Co-construct labels on the board or digital hub. Students fill the hub table on their worksheet.",
  ]);

  // 11 Transition
  textSlide(pres, "Now — Cyclone Tracy sub-page", [
    "Open: Cyclone Archive → Cyclone Tracy (or your printed copy).",
    "",
    "We will use the same four stages on a chapter page.",
    "Look for: hero title, intro paragraphs, section headings, sidebar facts.",
    "",
    "Question to hold in mind: Does every section fit only one stage, or can stages overlap?",
  ]);

  // 12–16 Tracy aspects
  aspectSlide(
    pres,
    "Tracy — Classification (hero)",
    "tracy_hero.png",
    [
      "What tells you the topic and time period in one glance?",
      "How does the deck line under the title shape what kind of text this is?",
      "Who is this hero section for — quick scanners or deep readers? How do you know?",
    ]
  );

  aspectSlide(
    pres,
    "Tracy — Description (intro paragraphs)",
    "tracy_intro.png",
    [
      "What scene does the writer set before giving detailed impacts?",
      "Which details are observational (conditions) versus measured (e.g. wind speed)?",
      "Is this mainly description or already factual elaboration? Why might pairs disagree?",
    ]
  );

  aspectSlide(
    pres,
    "Tracy — Factual elaboration (The Sound of Destruction)",
    "tracy_section_sound.png",
    [
      "What factual claims can you find about damage and loss?",
      "How do image and caption add information the paragraphs do not?",
      "Which numbers or specifics would you underline as evidence?",
    ]
  );

  aspectSlide(
    pres,
    "Tracy — Factual elaboration (Operation Navy Help)",
    "tracy_section_navy.png",
    [
      "What response facts are given (evacuation, time span)?",
      "How does this section extend the timeline after landfall?",
      "Is this still elaboration, or does it begin to summarise the human response? Discuss.",
    ]
  );

  aspectSlide(
    pres,
    "Tracy — Summary-style takeaways (Fast Facts)",
    "tracy_sidebar_facts.png",
    [
      "How is information compressed compared with the long article?",
      "Which facts would a reader use to compare Tracy to another cyclone?",
      "Why place Fast Facts in the margin instead of only at the bottom?",
    ]
  );

  // 17 Pair task
  textSlide(pres, "Connect — Pair task", [
    "In pairs, complete the Cyclone Tracy grid on your worksheet.",
    "",
    "For each row (hero, intro, The Sound of Destruction, Operation Navy Help, Fast Facts):",
    "• Decide the best-fitting stage.",
    "• Write one evidence clue copied from the page.",
    "",
    "Share with another pair. If you disagree, compare your evidence clues.",
  ]);

  // 18 Exit ticket + (teacher-only) Lucas notes — single slide to keep deck at 18 slides
  textSlide(pres, "Exit ticket — (Teacher) Lucas differentiation", [
    "Students: On your worksheet, complete the exit ticket:",
    "• The four stages in order: ___, ___, ___, ___.",
    "• The stage I was most confident about was ___ because ___.",
    "",
    "--- Teacher only (Lucas, Year 2 pathway) ---",
    "• Pre-annotated worksheet: point to PAGE HEADING and SECTION HEADING.",
    "• Sentence starters: \"The heading of this page is…\" / \"This section is about…\"",
    "• Draw and label one image; oral option with teacher scribing. (AC9E2LY01, AC9E2LA03)",
    "",
    "Extension (core): find one extra sentence of factual elaboration on the Tracy page and read it aloud.",
    "Hide or mask the teacher block if you export a student PDF.",
  ]);

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  pres.writeFile({ fileName: OUT }).then(() => {
    console.log("Wrote", OUT);
  });
}

main();
