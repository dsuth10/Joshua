/**
 * Generates all Lesson 2 .docx materials for Unit 2.
 * Run: node generate_lesson_02.js
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

function headerRow4(labels) {
  return new TableRow({
    children: labels.map(
      (h) =>
        new TableCell({
          shading: { fill: "E8E8E8" },
          width: { size: 2500, type: WidthType.DXA },
          children: [new Paragraph({ children: [new TextRun({ text: h, bold: true })] })],
        })
    ),
  });
}

function blankCellLines(n) {
  const lines = [];
  for (let i = 0; i < n; i++) lines.push(new Paragraph({ text: "" }));
  return lines;
}

/** Four-stage mini-glossary: last column left blank for student examples. */
function stagesMiniGlossaryTable() {
  const stages = [
    ["Classification / general statement", "Names the topic and scope; tells what kind of text this is.", "Topic title, scope, time span, neutral tone"],
    ["Description", "Sets the scene; introduces key parts or categories.", "Headings, previews, scene-setting paragraphs"],
    ["Factual elaboration", "Gives measurable detail, evidence, and explanation.", "Numbers, dates, quotes, technical detail"],
    ["Summary", "Pulls findings together or points to wider significance.", "Key takeaways, synthesis, fast facts"],
  ];
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
      headerRow4(["Stage", "What it does", "Typical features", "Example from the Cyclone Archive (my note)"]),
      ...stages.map(
        (row) =>
          new TableRow({
            children: [
              new TableCell({
                verticalAlign: VerticalAlign.TOP,
                children: [new Paragraph({ children: [new TextRun({ text: row[0], bold: true })] })],
              }),
              new TableCell({
                verticalAlign: VerticalAlign.TOP,
                children: [p(row[1])],
              }),
              new TableCell({
                verticalAlign: VerticalAlign.TOP,
                children: [p(row[2])],
              }),
              new TableCell({
                verticalAlign: VerticalAlign.TOP,
                children: blankCellLines(3),
              }),
            ],
          })
      ),
    ],
  });
}

function stageEvidenceRow(label) {
  return new TableRow({
    children: [
      new TableCell({
        width: { size: 2400, type: WidthType.DXA },
        verticalAlign: VerticalAlign.TOP,
        children: [new Paragraph({ children: [new TextRun({ text: label, bold: true })] })],
      }),
      new TableCell({
        width: { size: 7200, type: WidthType.DXA },
        children: [
          p("Stage I think this matches (circle one): Classification / Description / Factual elaboration / Summary"),
          new Paragraph({ text: "" }),
          p("Evidence clue (words or numbers from the screenshot):"),
          new Paragraph({ text: "" }),
        ],
      }),
    ],
  });
}

function tracySectionRow(sectionTitle) {
  return new TableRow({
    children: [
      new TableCell({
        verticalAlign: VerticalAlign.TOP,
        children: [new Paragraph({ children: [new TextRun({ text: sectionTitle, bold: true })] })],
      }),
      new TableCell({
        children: [
          p("Stage:"),
          new Paragraph({ text: "" }),
          p("Evidence clue:"),
          new Paragraph({ text: "" }),
        ],
      }),
    ],
  });
}

function buildLessonPlan() {
  return writeDoc("Lesson_Plans/Lesson_02/Lesson_02_Stages_of_Informative_Texts.docx", [
    new Paragraph({
      text: "LESSON PLAN — LESSON 2: STAGES OF INFORMATIVE TEXTS",
      heading: HeadingLevel.TITLE,
    }),
    p("Year 5 English — Unit 2 — Sequence 1 (Cyclone Archive)"),
    p("Tarampa State School · Term 2, 2026 · Duration: 60 minutes"),
    p(
      "Resources: Lesson_02_Slides.pptx; Cyclone Archive hub (local: Cyclones/index.html); Cyclone Tracy sub-page (Cyclones/Cyclone_Tracy/index.html); Lesson_02_Worksheet_Y5.docx; Lesson_02_Worksheet_Lucas_Y2.docx; Lesson_02_Stage_Label_Cards.docx; Lesson_02_Anchor_Chart_Stages_of_Informative_Texts.docx (optional display)."
    ),

    h1("Curriculum alignment"),
    bullet(
      "AC9E5LA03 — Describe how texts across the curriculum use language features and structural features appropriate to different purposes and audiences."
    ),
    bullet(
      "AC9E5LY03 — Identify and describe the purposes and audiences of texts, including the ways authors attempt to position readers."
    ),

    h1("Learning intention"),
    p("I can describe the characteristic stages and phases of an informative text."),

    h1("Success criteria"),
    bullet("I can name the four characteristic stages used in this lesson (classification, description, factual elaboration, summary)."),
    bullet("I can match parts of the Cyclone Archive hub page to a stage and justify with evidence from the text."),
    bullet("I can annotate the Cyclone Tracy sub-page in pairs, labelling sections with stages."),

    h1("Differentiation"),
    pb("Core (Year 5):"),
    p("Partner annotation of the Tracy sub-page; worksheet scaffolds; whole-class modelling on the hub."),
    pb("Lucas (Year 2 pathway):"),
    p(
      "Pre-annotated printed Tracy scaffold: identify the page heading and one section heading; sentence starters; draw-and-label; oral option with teacher scribing (AC9E2LY01, AC9E2LA03). Use Lesson_02_Worksheet_Lucas_Y2.docx."
    ),

    h1("Minute-by-minute sequence"),
    h2("0–5 min — Settle, learning intention, success criteria"),
    p("Display Slide 2. Students copy or highlight the learning intention on their worksheet. Briefly review Lesson 1: purpose and audience of the Cyclone Archive."),

    h2("5–12 min — Activate: purpose and audience review"),
    p("Slide 3. Quick pair share using exit-ticket ideas from Lesson 1. Teacher records one purpose statement and one audience clue on the board."),

    h2("12–22 min — Explore: introduce the four stages"),
    p("Slides 4–5. Teach the stages in plain English. Students read the mini-glossary table on their worksheet (first three columns); they will fill the fourth column during hub viewing."),

    h2("22–38 min — Model: hub page mapped to stages"),
    p("Slides 6–9. For each hub screenshot, ask: Which stage is this mainly doing? What words or layout prove it? Co-construct brief labels on Slide 10 (think-aloud)."),
    p("Anticipated mapping: editorial intro — classification; card grid — description; statistics strip — factual elaboration; evidence/about panel — summary-style synthesis."),

    h2("38–48 min — Connect: Cyclone Tracy pairs task"),
    p("Slide 11 introduces the Tracy sub-page. Slides 12–16 preview each Tracy screenshot. Students open the Tracy sub-page (digital or printed). In pairs, complete the Tracy grid on the worksheet: hero, intro, The Sound of Destruction, Operation Navy Help, Fast Facts — stage + evidence clue."),
    p("Slide 17: share two pairs with the class; discuss respectful disagreement where stages blur."),

    h2("48–56 min — Exit ticket"),
    p("Slide 18 (student-facing section). Students complete the exit ticket on the worksheet. Collect formative samples."),

    h2("56–60 min — Closure"),
    p("Preview Lesson 3: navigation features. Pack up."),

    h1("Formative assessment / monitoring"),
    bullet("Listen for precise vocabulary when students justify stage choices."),
    bullet("Scan worksheets for evidence quotes tied to stages, not vague labels."),
    bullet("Exit ticket: four-stage sequence + one confidence reflection."),

    h1("Extension (early finishers)"),
    p("Find one extra example of factual elaboration elsewhere on the Tracy page (e.g. pull quote or figure caption) and label it."),

    h1("Reflection prompts for teacher"),
    p("Did students confuse description with factual elaboration? If so, rehearse with one contrasting pair of sentences next lesson."),
  ]);
}

function buildAnswerKey() {
  return writeDoc("Lesson_Plans/Lesson_02/Lesson_02_Teacher_Answer_Key.docx", [
    new Paragraph({ text: "LESSON 2 — TEACHER ANSWER KEY", heading: HeadingLevel.TITLE }),
    p("Model answers for slide discussion questions. Accept reasonable alternatives supported by evidence."),

    h1("Slide 6 — Hub: Classification (editorial intro)"),
    bullet("This block names the topic (Australian cyclone events) and frames scope (defining moments, meteorological history)."),
    bullet("Neutral, informative tone; overview before detail — typical of a classification / general statement."),
    bullet("It orients the reader before they choose a cyclone card."),

    h1("Slide 7 — Hub: Description (chapter cards)"),
    bullet("Each card introduces a named event with place, year, and a short teaser — scene-setting and categorisation of subtopics."),
    bullet("The grid lets readers see the parts of the archive at a glance."),
    bullet("Repeated card pattern teaches how each chapter is organised."),

    h1("Slide 8 — Hub: Factual elaboration (statistics strip)"),
    bullet("Quantified claims (counts, wind speed, years, category) provide checkable detail."),
    bullet("Numbers communicate scale quickly — efficient for informed readers."),
    bullet("Connects to informative purpose: evidence before narrative deep-dives."),

    h1("Slide 9 — Hub: Summary (evidence / about panel)"),
    bullet("Synthesises what the archive offers across lenses (sources, data, human impact) — pulls the design together."),
    bullet("Acts like a concluding orientation to what readers will find inside chapters."),
    bullet("Accept 'summary' or 'synthesis'; discuss how websites sometimes spread summary elements across bands."),

    h1("Slide 12 — Tracy: Hero / classification"),
    bullet("Large title 'Cyclone Tracy', eyebrow 'Catastrophe • 1974', deck line — clearly classifies the topic and time."),
    bullet("Sets scope: a historical case study of one storm."),
    bullet("Audience knows immediately what the page is about."),

    h1("Slide 13 — Tracy: Intro / description"),
    bullet("Christmas Eve scene-setting; builds context before detailed impacts."),
    bullet("Narrates conditions leading to landfall — descriptive stage before dense statistics in body sections."),
    bullet("Pull quote adds human voice but still supports factual account — discuss placement."),

    h1("Slide 14 — Tracy: The Sound of Destruction (factual elaboration)"),
    bullet("Sensory detail tied to documented outcomes (damage, fatalities) — elaborates with specifics."),
    bullet("Figure caption adds verifiable impact detail (e.g. proportion of homes destroyed)."),
    bullet("This is core factual elaboration: measurable harm and evidence."),

    h1("Slide 15 — Tracy: Operation Navy Help (factual elaboration)"),
    bullet("Evacuation numbers, time span, consequences — factual elaboration of response."),
    bullet("Explains what happened after the storm — extends elaboration across time."),
    bullet("Could discuss as continuation of elaboration rather than a new stage."),

    h1("Slide 16 — Tracy: Fast Facts (summary-style)"),
    bullet("Condenses headline metrics (fatalities, homeless, damage cost, category) — snapshot takeaway."),
    bullet("Parallel to abstract or concluding key figures in reports."),
    bullet("Useful for revision and comparison across cyclone events."),

    h1("Pair task — exemplar annotations (Tracy)"),
    bullet("Hero — Classification / general statement."),
    bullet("Intro paragraphs — Description (scene-setting)."),
    bullet("The Sound of Destruction — Factual elaboration."),
    bullet("Operation Navy Help — Factual elaboration."),
    bullet("Fast Facts — Summary (condensed key figures)."),

    h1("Exit ticket — exemplar"),
    p(
      "An information report usually moves from classification to description to factual elaboration to summary. On the Cyclone Tracy page, I was most confident labelling the Fast Facts box as summary because it lists headline numbers in one place."
    ),
  ]);
}

function buildWorksheetY5() {
  return writeDoc("Lesson_Plans/Lesson_02/Lesson_02_Worksheet_Y5.docx", [
    new Paragraph({ text: "Lesson 2 — Stages of informative texts", heading: HeadingLevel.TITLE }),
    p("Name: _________________________  Date: __________"),
    h1("Learning intention"),
    p("I can describe the characteristic stages and phases of an informative text."),
    p("(AC9E5LA03, AC9E5LY03)"),

    h1("Four stages — mini glossary"),
    p("Complete the last column as your teacher shows each part of the Cyclone Archive hub."),
    stagesMiniGlossaryTable(),

    h1("Hub page — stage evidence"),
    p("For each hub screenshot, note which stage fits best and one evidence clue."),
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
            new TableCell({ shading: { fill: "E8E8E8" }, children: [pb("Hub screenshot")] }),
            new TableCell({ shading: { fill: "E8E8E8" }, children: [pb("My notes")] }),
          ],
        }),
        stageEvidenceRow("1. Editorial intro (Australian Cyclone Events)"),
        stageEvidenceRow("2. Statistics strip"),
        stageEvidenceRow("3. Chapter cards grid"),
        stageEvidenceRow("4. Understanding cyclones through evidence"),
      ],
    }),

    h1("Cyclone Tracy sub-page — pair annotation"),
    p("With your partner, label each section with a stage. Add one evidence clue (words or numbers) from the page."),
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
            new TableCell({ shading: { fill: "E8E8E8" }, children: [pb("Section")] }),
            new TableCell({ shading: { fill: "E8E8E8" }, children: [pb("Stage + evidence")] }),
          ],
        }),
        tracySectionRow("Hero (title, year, deck)"),
        tracySectionRow("Intro paragraphs (before the first section heading)"),
        tracySectionRow('Section: "The Sound of Destruction"'),
        tracySectionRow('Section: "Operation Navy Help"'),
        tracySectionRow("Fast Facts (sidebar)"),
      ],
    }),

    h1("Exit ticket"),
    p("An information report usually moves from _______________ to _______________ to _______________ to _______________."),
    p("On the Cyclone Tracy page, the stage I was most confident labelling was _______________ because _______________."),
  ]);
}

function buildWorksheetLucas() {
  return writeDoc("Lesson_Plans/Lesson_02/Lesson_02_Worksheet_Lucas_Y2.docx", [
    new Paragraph({ text: "Lesson 2 — My worksheet (Year 2 pathway)", heading: HeadingLevel.TITLE }),
    p("Name: _________________________"),
    h1("Learning focus"),
    p("AC9E2LY01 — how similar topics are presented in different types of texts."),
    p("AC9E2LA03 — how texts are organised."),
    h1("Cyclone Tracy — pre-annotated page"),
    p("Your teacher will show the Cyclone Tracy page. This sheet shows two labels to find."),
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
              shading: { fill: "F5F5F5" },
              children: [
                pb("PAGE HEADING (big title)"),
                p("Cyclone Tracy"),
                new Paragraph({ text: "" }),
                pb("SECTION HEADING (smaller title in the article)"),
                p('The Sound of Destruction'),
              ],
            }),
          ],
        }),
      ],
    }),
    h1("Sentence starters"),
    p('The heading of this page is _________________________________________________ .'),
    p('This section is about _________________________________________________ .'),
    h1("Draw and label one picture"),
    p("Choose one picture from the page. Draw it in the box. Your teacher can help."),
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
              children: [new Paragraph({ text: "" }), new Paragraph({ text: "" })],
            }),
          ],
        }),
      ],
    }),
    p("Label: This picture shows _________________________________________________ ."),
    p("Oral option: tell your teacher. They can write your words."),
  ]);
}

function buildAnchorChart() {
  return writeDoc("Lesson_Plans/Lesson_02/Lesson_02_Anchor_Chart_Stages_of_Informative_Texts.docx", [
    new Paragraph({ text: "Anchor chart — Stages of an informative text", heading: HeadingLevel.TITLE }),
    p("Print on A3 if possible. Add examples from the Cyclone Archive across Lessons 2–8."),
    h1("1. Classification / general statement"),
    new Paragraph({ text: "" }),
    new Paragraph({ text: "" }),
    h1("2. Description"),
    new Paragraph({ text: "" }),
    new Paragraph({ text: "" }),
    h1("3. Factual elaboration"),
    new Paragraph({ text: "" }),
    new Paragraph({ text: "" }),
    h1("4. Summary"),
    new Paragraph({ text: "" }),
    new Paragraph({ text: "" }),
    h1("Our class examples (Cyclone Archive)"),
    bullet("__________________________________________________________"),
    bullet("__________________________________________________________"),
    bullet("__________________________________________________________"),
  ]);
}

function dashedCard(title, body) {
  return new Table({
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
            children: [pb(title), p(body)],
          }),
        ],
      }),
    ],
  });
}

function buildStageLabelCards() {
  return writeDoc("Lesson_Plans/Lesson_02/Lesson_02_Stage_Label_Cards.docx", [
    new Paragraph({ text: "Stage label cards — Lesson 2", heading: HeadingLevel.TITLE }),
    p("Print on card stock if possible. Cut along dashed lines. Use for hub annotation or sorting."),
    h1("Card A — Classification / general statement"),
    dashedCard(
      "Classification / general statement",
      "Names the topic and scope. Tells the reader what kind of information will follow."
    ),
    h1("Card B — Description"),
    dashedCard("Description", "Sets the scene; introduces parts, places, or categories."),
    h1("Card C — Factual elaboration"),
    dashedCard(
      "Factual elaboration",
      "Adds precise detail: numbers, dates, evidence, explanation, technical language."
    ),
    h1("Card D — Summary"),
    dashedCard("Summary", "Pulls key ideas together; highlights main findings or takeaways."),
    h1("Teacher note"),
    p("Hold up or place cards as students justify where each hub screenshot fits. Model flexible thinking where two stages overlap."),
  ]);
}

async function main() {
  fs.mkdirSync(LESSON_PLANS, { recursive: true });
  await buildLessonPlan();
  await buildAnswerKey();
  await buildWorksheetY5();
  await buildWorksheetLucas();
  await buildAnchorChart();
  await buildStageLabelCards();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
