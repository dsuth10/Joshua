/**
 * Generates all Lesson 1 .docx materials for Unit 2.
 * Run: npm run docs
 */
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
  VerticalAlign,
} = require("docx");
const fs = require("fs");
const path = require("path");

const OCHRE = "B12E21";
const CHARCOAL = "2B2B2B";

const ROOT = path.resolve(__dirname, "../..");
const LESSON_PLANS = path.join(ROOT, "Lesson_Plans");

const styles = {
  default: {
    document: { run: { font: "Arial", size: 22, color: "000000" } },
  },
  paragraphStyles: [
    {
      id: "Title",
      name: "Title",
      basedOn: "Normal",
      run: { size: 56, bold: true, color: OCHRE, font: "Arial" },
      paragraph: { alignment: AlignmentType.CENTER, spacing: { before: 200, after: 200 } },
    },
    {
      id: "Heading1",
      name: "Heading 1",
      basedOn: "Normal",
      run: { size: 36, bold: true, color: OCHRE, font: "Arial" },
      paragraph: {
        spacing: { before: 280, after: 160 },
        outlineLevel: 0,
        border: { bottom: { color: OCHRE, space: 1, style: BorderStyle.SINGLE, size: 6 } },
      },
    },
    {
      id: "Heading2",
      name: "Heading 2",
      basedOn: "Normal",
      run: { size: 26, bold: true, color: CHARCOAL, font: "Arial" },
      paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 1 },
    },
  ],
};

function p(text, opts = {}) {
  return new Paragraph({ text, ...opts });
}

function pb(text, opts = {}) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true })],
    ...opts,
  });
}

function bullet(text) {
  return new Paragraph({ text, bullet: { level: 0 } });
}

function h1(text) {
  return new Paragraph({ text, heading: HeadingLevel.HEADING_1 });
}

function h2(text) {
  return new Paragraph({ text, heading: HeadingLevel.HEADING_2 });
}

function writeDoc(relPath, children) {
  const doc = new Document({
    styles,
    sections: [{ properties: {}, children }],
  });
  const out = path.join(ROOT, relPath);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  return Packer.toBuffer(doc).then((buf) => {
    fs.writeFileSync(out, buf);
    console.log("Wrote", out);
  });
}

function buildLessonPlan() {
  return writeDoc("Lesson_Plans/Lesson_01/Lesson_01_Purpose_and_Audience.docx", [
    new Paragraph({
      text: "LESSON PLAN — LESSON 1: PURPOSE AND AUDIENCE",
      heading: HeadingLevel.TITLE,
    }),
    p("Year 5 English — Unit 2 — Sequence 1 (Cyclone Archive)"),
    p("Tarampa State School · Term 2, 2026 · Duration: 60 minutes"),
    p("Resources: Lesson_01_Slides.pptx; Cyclone Archive hub (local: Cyclones/index.html); Lesson_01_Worksheet_Y5.docx; KWL on worksheet."),

    h1("Curriculum alignment"),
    bullet("AC9E5LY03 — Identify and describe the purposes and audiences of texts, including the ways authors attempt to position readers."),
    bullet("AC9E5LA03 — Describe how texts across the curriculum use language features and structural features appropriate to different purposes and audiences."),

    h1("Learning intention"),
    p("I can identify the purpose and audience of an informative text."),

    h1("Success criteria"),
    bullet("I can state a clear purpose for the Cyclone Archive hub page."),
    bullet("I can describe a likely audience and point to textual or design evidence."),
    bullet("I can tell how an informative text differs from an imaginative or persuasive text in simple terms."),

    h1("Differentiation"),
    pb("Core (Year 5):"),
    p("Partner talk, worksheet scaffolds, whole-class annotation of slides."),
    pb("Lucas (Year 2 pathway):"),
    p("Reduced written load; focus on one image on the hub page; draw and label; oral response with sentence starters (AC9E2LY03, AC9E2LA08). Use Lesson_01_Worksheet_Lucas_Y2.docx."),

    h1("Minute-by-minute sequence"),
    h2("0–5 min — Settle, learning intention, success criteria"),
    p("Display Slide 2. Read the learning intention aloud. Students copy or highlight it on their worksheet. Briefly define purpose (what the text is trying to do) and audience (who it is for)."),

    h2("5–15 min — Activate: prior knowledge and assessment context"),
    p("Slides 3–4. Brainstorm cyclone knowledge. Students complete K and W on their worksheet. Introduce Parts A, B, C at a high level so students see the end goal. Anticipated responses: cyclones are storms, wind, Queensland/north Australia; informative texts include websites, news explainers, textbooks."),

    h2("15–28 min — Explore: hub page tour (Slides 5–9)"),
    p("Open the live hub page alongside the slides. Teacher reads the deck and statistics aloud with expression, then thinks aloud about purpose and audience."),
    p("Focus questions: Why statistics first? Who benefits from six cards? How does language signal information rather than persuasion?"),
    p("Anticipated answers: numbers establish scale and seriousness; cards chunk content for secondary or general readers; neutral, factual tone."),

    h2("28–40 min — Explore: evidence section and navigation (Slides 10–12)"),
    p("Slide 10 (Tracy card): identify repeated pattern — category, year, place, teaser, data strip, link."),
    p("Slide 11: discuss why primary sources, meteorological data, and human impact are grouped — credibility and multiple lenses."),
    p("Slide 12: compare website navigation to book table of contents/index."),

    h2("40–50 min — Think-aloud, text-type sort (Slides 13–15)"),
    p("Model completing the sentence stem on Slide 13. Slide 14: class sort — justify with one clue per snippet. Slide 15: co-construct informative text checklist on board; students record two features on worksheet."),

    h2("50–58 min — Connect: KWL and exit ticket (Slides 16–17)"),
    p("Students complete L column and exit ticket. Collect or scan a sample of exit tickets for formative assessment."),

    h2("58–60 min — Closure"),
    p("Preview Lesson 2: characteristic stages of information reports using the same archive. Pack up."),

    h1("Formative assessment / monitoring"),
    bullet("Observe partner discussions during Activate."),
    bullet("Check K/W/L for misconceptions (e.g., confusing wind speed with temperature)."),
    bullet("Exit ticket: purpose + audience + one supporting clue."),

    h1("Extension (early finishers)"),
    p("Write one question they would ask the author about how they chose the six events. OR: skim one cyclone sub-page title only and predict what section will come first."),

    h1("Reflection prompts for teacher"),
    p("Which aspect (hero, stats, cards, evidence panel) best shifted students toward audience awareness? Adjust pacing for Lesson 2 accordingly."),
  ]);
}

function buildAnswerKey() {
  return writeDoc("Lesson_Plans/Lesson_01/Lesson_01_Teacher_Answer_Key.docx", [
    new Paragraph({ text: "LESSON 1 — TEACHER ANSWER KEY", heading: HeadingLevel.TITLE }),
    p("Model answers for slide discussion questions. Accept reasonable alternatives supported by evidence."),

    h1("Slide 6 — Hero banner"),
    bullet("Immersive language sets a serious, documentary tone and signals depth of content; it aims to engage curious readers while staying factual."),
    bullet("Likely audience: senior students and general public interested in Australian history and science — vocabulary and design are sophisticated; not a simple early-primary site."),
    bullet("Closer to an information source than a storybook; not selling a product."),

    h1("Slide 7 — Statistics strip"),
    bullet("Numbers quickly communicate scale, severity, and time span — efficient for informed readers."),
    bullet("They suggest the archive deals with real, measured events (credibility)."),
    bullet("Factual framing supports informative purpose."),

    h1("Slide 8 — Section introduction"),
    bullet("Primarily inform — defines scope (six defining moments) with neutral tone."),
    bullet("Factual phrases: e.g. references to meteorological history / reshaped understanding (documentable)."),
    bullet("Readers new to the topic need orientation before choosing a cyclone."),

    h1("Slide 9 — Six cards"),
    bullet("Chunking helps readability and comparison; each event has its own narrative and data."),
    bullet("Cards preview content and support user choice."),
    bullet("Repeated pattern teaches the navigation grammar of the site."),

    h1("Slide 10 — Tracy card"),
    bullet("Common elements: category tag, year, location, title, teaser paragraph, wind/fatalities/damage strip, read-more cue."),
    bullet("Teaser motivates click-through while keeping the hub scannable."),
    bullet("Background image hints at destruction even at low opacity — multimodal meaning."),

    h1("Slide 11 — Evidence section"),
    bullet("Primary sources; meteorological data; human impact."),
    bullet("Combines documentary evidence, scientific measurement, and social consequence — fuller picture."),
    bullet("Scientists may prioritise meteorological data; historians may prioritise primary sources and human impact."),

    h1("Slide 12 — Navigation"),
    bullet("Header: brand + anchor links to cyclones list and about section."),
    bullet("Footer links act like a quick index to each sub-page."),
    bullet("Unlike a book, hyperlinks allow non-linear reading; unlike print, same page combines multimedia (future sub-pages)."),

    h1("Slide 14 — Text-type sort"),
    bullet("A — Informative."),
    bullet("B — Imaginative (figurative language, narrative voice)."),
    bullet("C — Persuasive (call to action, donation)."),

    h1("Exit ticket — exemplar"),
    p('The purpose of the Cyclone Archive is to inform readers about six major Australian cyclones using evidence and data. The audience is likely older students and adults interested in history and science, because the language is formal and the layout uses detailed statistics and deep-dive links.'),
  ]);
}

function kwlTable() {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: "999999" },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: "999999" },
      left: { style: BorderStyle.SINGLE, size: 1, color: "999999" },
      right: { style: BorderStyle.SINGLE, size: 1, color: "999999" },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
    },
    rows: [
      new TableRow({
        children: ["K — Know", "W — Want to know", "L — Learned"].map(
          (h) =>
            new TableCell({
              shading: { fill: "E8E8E8" },
              width: { size: 3200, type: WidthType.DXA },
              children: [new Paragraph({ children: [new TextRun({ text: h, bold: true })] })],
            })
        ),
      }),
      new TableRow({
        children: [1, 2, 3].map(
          () =>
            new TableCell({
              width: { size: 3200, type: WidthType.DXA },
              children: [
                new Paragraph({ text: "" }),
                new Paragraph({ text: "" }),
                new Paragraph({ text: "" }),
                new Paragraph({ text: "" }),
              ],
            })
        ),
      }),
    ],
  });
}

function aspectNoteRow(aspectName) {
  return new TableRow({
    children: [
      new TableCell({
        width: { size: 2200, type: WidthType.DXA },
        verticalAlign: VerticalAlign.TOP,
        children: [new Paragraph({ children: [new TextRun({ text: aspectName, bold: true })] })],
      }),
      new TableCell({
        width: { size: 7400, type: WidthType.DXA },
        children: [
          new Paragraph({ text: "What I notice (words, numbers, layout):" }),
          new Paragraph({ text: "" }),
          new Paragraph({ text: "How this helps the reader:" }),
          new Paragraph({ text: "" }),
        ],
      }),
    ],
  });
}

function buildWorksheetY5() {
  return writeDoc("Lesson_Plans/Lesson_01/Lesson_01_Worksheet_Y5.docx", [
    new Paragraph({ text: "Lesson 1 — Purpose and audience", heading: HeadingLevel.TITLE }),
    p("Name: _________________________  Date: __________"),
    h1("Learning intention"),
    p("I can identify the purpose and audience of an informative text."),
    h1("KWL — Cyclones and informative texts"),
    kwlTable(),
    h1("Aspect notes — Cyclone Archive hub page"),
    p("Record ideas as your teacher shows each part of the website."),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1, color: "999999" },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: "999999" },
        left: { style: BorderStyle.SINGLE, size: 1, color: "999999" },
        right: { style: BorderStyle.SINGLE, size: 1, color: "999999" },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
        insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              shading: { fill: "E8E8E8" },
              children: [pb("Aspect")],
            }),
            new TableCell({
              shading: { fill: "E8E8E8" },
              children: [pb("My notes")],
            }),
          ],
        }),
        aspectNoteRow("1. Hero (title + deck)"),
        aspectNoteRow("2. Statistics strip"),
        aspectNoteRow("3. Introduction (Australian Cyclone Events)"),
        aspectNoteRow("4. Six chapter cards"),
        aspectNoteRow("5. One card (Tracy)"),
        aspectNoteRow("6. Understanding through evidence"),
        aspectNoteRow("7. Navigation (header + footer)"),
      ],
    }),
    h1("Purpose and audience — my draft ideas"),
    p("Purpose (what is this text trying to do?):"),
    new Paragraph({ text: "" }),
    new Paragraph({ text: "" }),
    p("Audience (who is it for?). Give two clues from the page:"),
    bullet("Clue 1: _________________________________________________"),
    bullet("Clue 2: _________________________________________________"),
    h1("Text-type sort — class activity"),
    p("Was each snippet informative, imaginative, or persuasive?"),
    bullet("A) Six historical storms, data, timelines, documented impacts — _________________"),
    bullet("B) The wind screamed like a wild animal — _________________"),
    bullet("C) Donate now — _________________"),
    h1("Exit ticket"),
    p("Finish this sentence:"),
    p("The purpose of the Cyclone Archive is _________________________________"),
    p("and its audience is ________________________________________________."),
  ]);
}

function buildWorksheetLucas() {
  return writeDoc("Lesson_Plans/Lesson_01/Lesson_01_Worksheet_Lucas_Y2.docx", [
    new Paragraph({ text: "Lesson 1 — My worksheet (Year 2 pathway)", heading: HeadingLevel.TITLE }),
    p("Name: _________________________"),
    h1("Learning focus"),
    p("AC9E2LY03 — purpose and audience (with help)."),
    p("AC9E2LA08 — how images add meaning."),
    h1("Look at one picture on the Cyclone Archive hub page"),
    p("Draw the picture you chose in the box. Your teacher can help you find one."),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              borders: {
                top: { style: BorderStyle.SINGLE, size: 6, color: "999999" },
                bottom: { style: BorderStyle.SINGLE, size: 6, color: "999999" },
                left: { style: BorderStyle.SINGLE, size: 6, color: "999999" },
                right: { style: BorderStyle.SINGLE, size: 6, color: "999999" },
              },
              height: { value: 3200, rule: "atLeast" },
              children: [
                new Paragraph({ text: "" }),
                new Paragraph({ text: "" }),
                new Paragraph({ text: "" }),
              ],
            }),
          ],
        }),
      ],
    }),
    h1("Label your picture"),
    p("Write or trace these labels with help:"),
    bullet("This picture shows: _________________________________"),
    h1("Who might read this?"),
    p('Sentence starter: "A _________ might read this."'),
    new Paragraph({ text: "" }),
    p("Oral option: tell your teacher and they can write your words."),
  ]);
}

function buildAssessmentHandout() {
  return writeDoc("Lesson_Plans/Lesson_01/Lesson_01_Assessment_Overview_Handout.docx", [
    new Paragraph({ text: "Unit 2 — Assessment overview (student-friendly)", heading: HeadingLevel.TITLE }),
    p("Year 5 English — Informative texts"),
    h1("Part A — Reading and viewing"),
    p("Later in the term you will read an informative archive and answer short questions about purpose, audience, structure, and language."),
    h1("Part B — Writing and creating"),
    p("You will write your own multimodal information report on a natural disaster topic you choose."),
    h1("Part C — Speaking and listening"),
    p("You will plan and deliver a short presentation using your report and visuals."),
    h1("Why we study the Cyclone Archive first"),
    p("It is a strong example of how informative texts are organised for real readers. We read it closely so we can use it as a model for our own writing."),
  ]);
}

function buildAnchorChart() {
  return writeDoc("Lesson_Plans/Lesson_01/Lesson_01_Anchor_Chart_Features_of_Informative_Texts.docx", [
    new Paragraph({ text: "Anchor chart — Features of informative texts", heading: HeadingLevel.TITLE }),
    p("Print on A3 if possible. Add to this chart during Lessons 1–8."),
    h1("Purpose"),
    new Paragraph({ text: "" }),
    new Paragraph({ text: "" }),
    h1("Audience"),
    new Paragraph({ text: "" }),
    new Paragraph({ text: "" }),
    h1("How we know (evidence from the text)"),
    new Paragraph({ text: "" }),
    new Paragraph({ text: "" }),
    new Paragraph({ text: "" }),
    h1("Language and layout features we noticed"),
    bullet("__________________________________________________________"),
    bullet("__________________________________________________________"),
    bullet("__________________________________________________________"),
    bullet("__________________________________________________________"),
  ]);
}

function buildSortCards() {
  return writeDoc("Lesson_Plans/Lesson_01/Lesson_01_Text_Type_Sort_Cards.docx", [
    new Paragraph({ text: "Text-type sort cards — Lesson 1", heading: HeadingLevel.TITLE }),
    p("Print, cut along dashed lines, and sort under Informative / Imaginative / Persuasive."),
    h1("Card A"),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              margins: { top: 200, bottom: 200, left: 200, right: 200 },
              borders: {
                top: { style: BorderStyle.DASHED, size: 6, color: OCHRE },
                bottom: { style: BorderStyle.DASHED, size: 6, color: OCHRE },
                left: { style: BorderStyle.DASHED, size: 6, color: OCHRE },
                right: { style: BorderStyle.DASHED, size: 6, color: OCHRE },
              },
              children: [
                p(
                  "The Cyclone Archive explains six historical storms using data, timelines, and documented impacts."
                ),
              ],
            }),
          ],
        }),
      ],
    }),
    h1("Card B"),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              margins: { top: 200, bottom: 200, left: 200, right: 200 },
              borders: {
                top: { style: BorderStyle.DASHED, size: 6, color: OCHRE },
                bottom: { style: BorderStyle.DASHED, size: 6, color: OCHRE },
                left: { style: BorderStyle.DASHED, size: 6, color: OCHRE },
                right: { style: BorderStyle.DASHED, size: 6, color: OCHRE },
              },
              children: [
                p(
                  "The wind screamed through the broken window like a wild animal hunting in the dark."
                ),
              ],
            }),
          ],
        }),
      ],
    }),
    h1("Card C"),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              margins: { top: 200, bottom: 200, left: 200, right: 200 },
              borders: {
                top: { style: BorderStyle.DASHED, size: 6, color: OCHRE },
                bottom: { style: BorderStyle.DASHED, size: 6, color: OCHRE },
                left: { style: BorderStyle.DASHED, size: 6, color: OCHRE },
                right: { style: BorderStyle.DASHED, size: 6, color: OCHRE },
              },
              children: [
                p("Donate now — every dollar helps families rebuild after the storm."),
              ],
            }),
          ],
        }),
      ],
    }),
    h1("Answer key (teacher)"),
    p("A — Informative · B — Imaginative · C — Persuasive"),
  ]);
}

async function main() {
  fs.mkdirSync(LESSON_PLANS, { recursive: true });
  await buildLessonPlan();
  await buildAnswerKey();
  await buildWorksheetY5();
  await buildWorksheetLucas();
  await buildAssessmentHandout();
  await buildAnchorChart();
  await buildSortCards();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
