/**
 * Builds Lesson_01_Slides.pptx for Year 5 English Unit 2, Lesson 1.
 * Run after capture: npm run slides
 */
const path = require("path");
const fs = require("fs");
const PptxGenJS = require("pptxgenjs");

const OUT = path.resolve(__dirname, "../../Lesson_Plans/Lesson_01_Slides.pptx");
const IMG_DIR = path.resolve(__dirname, "../Lesson_01_Screenshots");

function img(file) {
  const p = path.join(IMG_DIR, file);
  if (!fs.existsSync(p)) {
    console.warn("Missing image (run npm run capture):", p);
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
  pres.title = "Lesson 1: Purpose and Audience — Cyclone Archive";
  pres.subject = "Year 5 English — Unit 2";

  // 1 Title
  let slide = pres.addSlide();
  slide.background = { color: "F5F5F5" };
  slide.addText("Lesson 1", {
    x: 0.5,
    y: 1.2,
    w: 9,
    h: 0.6,
    fontSize: 18,
    color: MUTED,
    fontFace: "Arial",
  });
  slide.addText("Why Do People Write?\nPurpose and Audience in the Cyclone Archive", {
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

  // 2 Welcome + LI + Success criteria
  textSlide(pres, "Welcome to Unit 2 — Learning intention", [
    "Unit focus: Examining, creating and sharing informative texts.",
    "",
    "Learning intention",
    "I can identify the purpose and audience of an informative text.",
    "(AC9E5LY03, AC9E5LA03)",
    "",
    "Success criteria — I am successful when I can:",
    "• Say what this text is trying to do (its purpose).",
    "• Say who the text is written for (its audience).",
    "• Give at least one clue from the Cyclone Archive hub page that supports my ideas.",
  ]);

  // 3 Activate — KWL
  textSlide(pres, "Activate — Prior knowledge", [
    "Think, pair, share:",
    "• What do you already know about cyclones?",
    "• What informative texts have you read before (websites, brochures, reports, news explainers)?",
    "",
    "You will use your worksheet: K (Know) and W (Want to know) columns.",
    "",
    "Teacher note: Record a few class ideas on the board to refer back to at the end (L column).",
  ]);

  // 4 Assessment snapshot
  textSlide(pres, "Our assessment — Parts A, B and C", [
    "Part A (Week 7): Short written responses about an informative archive text.",
    "Part B (Weeks 5–7): Written multimodal information report on a natural disaster topic.",
    "Part C (Week 8): Multimodal presentation to an audience.",
    "",
    "Today we begin with reading like writers: we study the Cyclone Archive so we can later create our own informative texts.",
  ]);

  // 5 Meet the archive — hero image
  {
    const s = pres.addSlide();
    addTitleBar(pres, s, "Meet the Cyclone Archive — hub page");
    const p = img("hero.png");
    if (fs.existsSync(p)) {
      s.addImage({
        path: p,
        x: 0.35,
        y: 0.95,
        w: 6.2,
        h: 4.1,
        sizing: { type: "contain", w: 6.2, h: 4.1 },
      });
    }
    s.addText(
      "We are viewing the home page (hub) of the archive.\n\n" +
        "As we explore, ask:\n• What is this site for?\n• Who is meant to read it?",
      { x: 6.65, y: 1.1, w: 3.05, h: 3.8, fontSize: 15, fontFace: "Arial", color: CHARCOAL, valign: "top" }
    );
  }

  // 6–12 Aspects
  aspectSlide(
    pres,
    "Aspect 1 — Hero banner (title and deck)",
    "hero.png",
    [
      'Why might the writer open with "An immersive study in atmospheric power"?',
      "Who do you think this website is for — primary students, secondary students, or the general public? What clues help you decide?",
      "Does the headline sound more like a storybook, an advertisement, or an information source?",
    ]
  );

  aspectSlide(
    pres,
    "Aspect 2 — Statistics strip",
    "stats.png",
    [
      "Why place big numbers (6 events, 295+ km/h, 112 years, Cat 5) near the top?",
      "What message do these statistics send about the topic before you read further?",
      "How does this connect to the purpose of an informative text?",
    ]
  );

  aspectSlide(
    pres,
    "Aspect 3 — Section introduction (Australian Cyclone Events)",
    "editorial_intro.png",
    [
      "Is this section mainly trying to entertain us, persuade us, or inform us? How can you tell?",
      "Pick one phrase that sounds factual rather than opinionated.",
      "Who would need this overview before reading the individual cyclone stories?",
    ]
  );

  aspectSlide(
    pres,
    "Aspect 4 — Chapter cards (six events)",
    "card_grid.png",
    [
      "Why split the archive into six separate events instead of one long page?",
      "How do the cards help a reader choose where to go next?",
      "What do the cards have in common (layout, data, link)? Why would the designer repeat that pattern?",
    ]
  );

  aspectSlide(
    pres,
    "Aspect 5 — One card in detail (Cyclone Tracy)",
    "card_tracy.png",
    [
      "What information is repeated on each card (winds, damage, links, teaser text)?",
      "Why give a short teaser before the reader clicks through to the full story?",
      "How does the image in the background support meaning, even when it is faint?",
    ]
  );

  aspectSlide(
    pres,
    "Aspect 6 — Understanding cyclones through evidence",
    "section_1.png",
    [
      "What three kinds of evidence does the archive promise (look at the three labelled blocks)?",
      "Why would an informative text bring together primary sources, meteorological data, and human impact?",
      "Which block would a scientist care about most? Which might a historian care about most?",
    ]
  );

  // Aspect 7 — Navigation (two images)
  {
    const s = pres.addSlide();
    addTitleBar(pres, s, "Aspect 7 — Navigation: header and footer links");
    const p1 = img("nav_header.png");
    const p2 = img("footer_links.png");
    if (fs.existsSync(p1)) {
      s.addImage({
        path: p1,
        x: 0.35,
        y: 0.95,
        w: 9.3,
        h: 0.95,
        sizing: { type: "contain", w: 9.3, h: 0.95 },
      });
    }
    if (fs.existsSync(p2)) {
      s.addImage({
        path: p2,
        x: 0.35,
        y: 2.05,
        w: 9.3,
        h: 1.15,
        sizing: { type: "contain", w: 9.3, h: 1.15 },
      });
    }
    s.addText(
      "1. How do you move around this website using the header?\n\n" +
        "2. How does the footer compare to an index in a book?\n\n" +
        "3. What is similar or different to navigating a printed information book?",
      {
        x: 0.45,
        y: 3.35,
        w: 9.1,
        h: 2.1,
        fontSize: 15,
        fontFace: "Arial",
        color: CHARCOAL,
        valign: "top",
      }
    );
  }

  // 13 Think-aloud checkpoint
  textSlide(pres, "Think-aloud checkpoint", [
    "Teacher models asking:",
    "• Who wrote this? (We may not know the exact person — what kind of creator is it?)",
    "• Who is it for?",
    "• What is its purpose?",
    "",
    "Sentence stem for students:",
    "The purpose of this hub page is to ___ and the audience is likely ___ because ___ .",
  ]);

  // 14 Text type sort
  textSlide(pres, "Informative, imaginative, or persuasive?", [
    "Read each snippet. Decide as a class: informative, imaginative, or persuasive — and why.",
    "",
    "A) The Cyclone Archive explains six historical storms using data, timelines, and documented impacts.",
    "",
    "B) The wind screamed through the broken window like a wild animal hunting in the dark.",
    "",
    "C) Donate now — every dollar helps families rebuild after the storm.",
    "",
    "(Teacher: see Lesson_01_Teacher_Answer_Key.docx for model classifications.)",
  ]);

  // 15 Checklist
  textSlide(pres, "What makes THIS text informative?", [
    "Co-construct a class checklist (add to your anchor chart):",
    "• Focuses on real events, people, places, or phenomena",
    "• Uses factual detail readers can check (numbers, dates, documented sources)",
    "• Organises information so readers can find and compare sections",
    "• Aims to explain and inform more than to sell or to invent a fictional plot",
    "",
    "Students: note two features you saw on the hub page that match this list.",
  ]);

  // 16 KWL — Learned
  textSlide(pres, "Connect — KWL: What did we learn?", [
    "Return to your worksheet. Complete the L column (Learned).",
    "",
    "Examples of learning you might record:",
    "• What a hub page does",
    "• How cards and statistics help readers",
    "• A first idea about purpose and audience",
    "",
    "Pair share: one thing you learned about informative texts today.",
  ]);

  // 17 Exit ticket
  textSlide(pres, "Exit ticket", [
    "On your worksheet, finish this sentence in your own words:",
    "",
    "The purpose of the Cyclone Archive is ___ and its audience is ___ .",
    "",
    "Teacher collects or spot-checks exit tickets as formative data for Lesson 2.",
  ]);

  // 18 Lucas / teacher support
  textSlide(pres, "(Teacher only) Differentiation — Lucas (Year 2 pathway)", [
    "• Sit with Lucas for the hero and one card. Point to one photograph or diagram.",
    "• Ask: What is this text about? Who might read it?",
    "• He draws and labels the image. Offer sentence starters:",
    '  – "This text is about ___."',
    '  – "A ___ might read this."',
    "",
    "AC9E2LY03, AC9E2LA08 — keep task oral/drawn if writing load is high.",
    "",
    "Hide or skip this slide in student-facing mode if you export PDFs.",
  ]);

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  pres.writeFile({ fileName: OUT }).then(() => {
    console.log("Wrote", OUT);
  });
}

main();
