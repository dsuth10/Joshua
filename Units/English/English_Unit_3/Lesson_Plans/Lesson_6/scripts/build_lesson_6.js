const fs = require('fs');
const path = require('path');
const {
  AlignmentType, BorderStyle, Document, Footer, Header, LevelFormat,
  PageBreak, PageNumber, Packer, Paragraph, ShadingType, Table,
  TableCell, TableLayoutType, TableRow, TextRun, VerticalAlign, WidthType,
} = require('docx');

const lessonDir = path.resolve(__dirname, '..');
const planPath = path.join(lessonDir, 'Lesson_6_Plan.md');
const htmlPath = path.join(lessonDir, 'Lesson_6_Presentation.html');
const handoutPath = path.join(lessonDir, 'Lesson_6_Handout.docx');
const lucasPath = path.join(lessonDir, 'Lesson_6_Lucas_Handout.docx');

const C = {
  ink: '17332A', forest: '184C3B', leaf: '3E7A5B', moss: 'DDE8C8',
  cream: 'FFF9EA', ember: 'D9693B', gold: 'E2A83B', smoke: '58645F',
  pale: 'F3F5EF', white: 'FFFFFF', line: 'B9C9C0', red: 'A43E32',
};

const border = (color = C.line, size = 6) => ({ style: BorderStyle.SINGLE, color, size });
const borders = (color = C.line, size = 6) => ({
  top: border(color, size), bottom: border(color, size),
  left: border(color, size), right: border(color, size),
});

function run(text, options = {}) {
  return new TextRun({ text, font: 'Arial', color: C.ink, size: 22, ...options });
}

function para(text, options = {}) {
  const { bold, italic, color, size, children, ...paragraphOptions } = options;
  return new Paragraph({
    spacing: { after: 120, line: 300, lineRule: 'auto' },
    ...paragraphOptions,
    children: children || [run(text, { bold, italics: italic, color, size })],
  });
}

function heading(text, level = 1) {
  return new Paragraph({
    style: level === 1 ? 'Lesson6Heading1' : 'Lesson6Heading2',
    children: [new TextRun({ text, font: 'Arial' })],
  });
}

function documentStyles(baseSize = 22) {
  return {
    default: {
      document: {
        run: { font: 'Arial', size: baseSize, color: C.ink },
        paragraph: { spacing: { after: 120, line: 300, lineRule: 'auto' } },
      },
    },
    paragraphStyles: [
      {
        id: 'Lesson6Heading1', name: 'Lesson 6 Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { font: 'Arial', bold: true, size: 32, color: C.forest },
        paragraph: { spacing: { before: 280, after: 120 }, keepNext: true },
      },
      {
        id: 'Lesson6Heading2', name: 'Lesson 6 Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { font: 'Arial', bold: true, size: 26, color: C.leaf },
        paragraph: { spacing: { before: 220, after: 120 }, keepNext: true },
      },
    ],
  };
}

function writingLines(count = 4) {
  return Array.from({ length: count }, () => para('________________________________________________________________________________', {
    spacing: { before: 80, after: 90 }, color: C.smoke, size: 20,
  }));
}

function cell(children, width, options = {}) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    verticalAlign: options.verticalAlign || VerticalAlign.CENTER,
    margins: { top: 100, bottom: 100, left: 140, right: 140 },
    borders: borders(options.borderColor || C.line, options.borderSize || 6),
    shading: options.fill ? { fill: options.fill, type: ShadingType.CLEAR } : undefined,
    children,
  });
}

function fixedTable(rows, widths, options = {}) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    indent: { size: 120, type: WidthType.DXA },
    layout: TableLayoutType.FIXED,
    columnWidths: widths,
    rows,
    ...options,
  });
}

function headerFooter(label) {
  return {
    headers: {
      default: new Header({ children: [new Paragraph({
        alignment: AlignmentType.RIGHT,
        spacing: { after: 80 },
        children: [run(`ENGLISH UNIT 3  |  ${label}`, { bold: true, size: 16, color: C.smoke })],
      })] }),
    },
    footers: {
      default: new Footer({ children: [new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [run('Lesson 6  |  Page ', { size: 16, color: C.smoke }), new TextRun({ children: [PageNumber.CURRENT], font: 'Arial', size: 16, color: C.smoke })],
      })] }),
    },
  };
}

function titleBlock(subtitle) {
  return [
    para('BERANI  |  LESSON 6', { bold: true, size: 20, color: C.ember, spacing: { after: 40 } }),
    para('When the Forest Screams', { bold: true, size: 40, color: C.forest, spacing: { after: 80 } }),
    para(subtitle, { bold: true, size: 24, color: C.smoke, spacing: { after: 180 } }),
    fixedTable([
      new TableRow({ children: [
        cell([para('READ', { bold: true, color: C.forest, alignment: AlignmentType.CENTER, spacing: { after: 20 } }), para('pp. 25-27', { alignment: AlignmentType.CENTER, spacing: { after: 0 } })], 3120, { fill: C.moss }),
        cell([para('TRACE', { bold: true, color: C.forest, alignment: AlignmentType.CENTER, spacing: { after: 20 } }), para('cause -> effect', { alignment: AlignmentType.CENTER, spacing: { after: 0 } })], 3120, { fill: C.moss }),
        cell([para('EXPLAIN', { bold: true, color: C.forest, alignment: AlignmentType.CENTER, spacing: { after: 20 } }), para('evidence + reasoning', { alignment: AlignmentType.CENTER, spacing: { after: 0 } })], 3120, { fill: C.moss }),
      ] }),
    ], [3120, 3120, 3120]),
    para('Name: ____________________________________    Class: __________    Date: __________', { italic: true, size: 19, spacing: { before: 180, after: 120 } }),
  ];
}

function buildPlan() {
  const md = `# Lesson 6: When the Forest Screams

## Lesson purpose

Students reconstruct the cause-and-effect chain in Ginger Juice's memory on pages 25-27 of *Berani*. They use precise text evidence to explain how one event produces the next, then analyse how the author's sensory language, repetition and personification make the destruction feel immediate. The final response transfers the chain into a clear causal explanation rather than a plot retell.

## Curriculum focus

- **Year 5 - AC9E5LA02:** move beyond a bare assertion by supporting an explanation with relevant information from the text.
- **Year 6 - AC9E6LA02:** distinguish relatively objective event details from subjective, emotionally charged language and explain its effect.

## Learning intention

We are learning to trace and explain how destruction creates a chain of consequences in a narrative.

## Success criteria

- I can place key events from pages 25-27 in a defensible order.
- I can test each link using **because**, **therefore** or **which means**.
- I can support a causal explanation with a precise text detail.
- I can explain how one language choice shapes the reader's response.
- I can revise one weak or missing link after feedback.

## Preparation

- Open *Berani* to pages 25-27 (Ginger Juice).
- Open \`Lesson_6_Presentation.html\` in a modern browser and select fullscreen.
- Print \`Lesson_6_Handout.docx\`. Use \`Lesson_6_Lucas_Handout.docx\` for the visual-sequencing pathway when appropriate.
- Prepare mini-whiteboards or scrap paper for the first prediction.
- Content note: the extract depicts habitat destruction and threat. Give students a quiet opt-in for reading aloud and avoid requiring dramatic performance of distress.

## Sequence (approximately 60 minutes)

### 1. Cold open: When does a home stop feeling safe? - 5 minutes

Display the soundscape without explaining the context. Students choose the moment the scene changes from safe to threatened and justify the boundary with one sound or image. Accept different boundaries when the evidence is defensible.

### 2. Mission and success checks - 3 minutes

Introduce the chain test: every arrow must be readable as "because", "therefore" or "which means". Students restate the difference between **what happened** and **why the next event happened**.

### 3. Concrete encounter: read pages 25-27 - 9 minutes

Read the Ginger Juice chapter. Pause only at the three marked thresholds: safe canopy, unknown human noise, fire. Students capture one text detail at each threshold. Do not reveal the complete chain yet.

### 4. Guided noticing: world shift sort - 6 minutes

Students classify details as **safe world**, **warning**, or **destruction**. The difficult boundary is the rain: it is safe in the remembered forest but also triggers the memory in the present. Require a rule and permit "depends on the moment" when justified.

### 5. Explicit model: one strong causal link - 5 minutes

Model: **Trees begin crashing -> Ibu puts Ginger Juice on her back and flees.** Think aloud using: "Ibu flees **because** the trees are falling. The trees fall; **therefore** staying is unsafe." Contrast this with a weak link that merely uses "and then".

### 6. Sequence Lab - 7 minutes

In pairs, order six event cards. Before checking, partners read every arrow aloud using a causal connector. The interactive feedback identifies the first broken link rather than simply revealing the complete answer.

Expected sequence:

1. A machine-like rumble shakes the treetops.
2. Human scent and noise grow stronger.
3. Giant trees crash to the ground.
4. Ibu carries Ginger Juice through the canopy.
5. Falling trees make escape impossible.
6. The remaining forest becomes threatened by fire.

### 7. Cause Detective - 5 minutes

Students choose the strongest explanation for why Ibu moves quickly. They reject the plausible decoy "because it is raining" by checking relevance against the immediate evidence.

### 8. Language microscope - 6 minutes

Analyse four short choices: repeated sounds, repeated words, the personification "forest screaming", and the sudden one-word ending "fire". Students name the job of each before revealing the annotation. Connect each choice to urgency, scale or Ginger Juice's frightened perspective.

### 9. Independent construction: chain-to-explanation - 9 minutes

Students complete the handout flow chart, then write 5-7 sentences answering: **How does destruction change Ginger Juice's world?** Require at least three linked events, one precise text detail, two causal connectors and one language-effect explanation.

### 10. Chain audit and revision - 4 minutes

Partner A reads the response. Partner B checks:

- Can every arrow be read with because/therefore/which means?
- Is there evidence, not only retelling?
- Does one sentence explain an author choice?

The writer revises one link immediately.

### 11. Exit evidence - 3 minutes

Students submit: **cause -> immediate effect -> longer consequence**, plus the text detail that makes the chain convincing. Use responses to decide whether Lesson 7 needs a short reteach on sequence versus causality.

## Differentiation

### Support

- Begin with four event cards, then add the two middle steps.
- Provide connector stems: "Because ___, ___." "This causes ___." "Therefore, ___."
- Let students orally rehearse the chain while pointing before writing.
- Offer the evidence bank on the handout; students still choose which detail proves each link.

### Lucas (ICP)

- Use the separate large-print handout with three respectful visual-symbol stages: safe trees -> crashing trees -> fire/danger.
- Lucas orders the stages, selects a feeling word and completes: "The trees fall. Ginger Juice and Ibu ___."
- Accept pointing, placing, speaking or copying as response modes.
- Preserve the core concept: one event causes another.

### Extend

- Distinguish event, immediate effect and inferred longer-term consequence.
- Explain how Ginger Juice's fragmented grammar and personification position the reader inside memory rather than outside it.
- Add a caveat: pages 25-27 end at fire; capture is known from earlier/later text, not directly narrated in this extract.

## Formative assessment

- The cold-open boundary reveals whether students can justify a turning point.
- The world-shift sort exposes over-simple categories and attention to context.
- Sequence Lab distinguishes chronology from causality.
- Cause Detective exposes irrelevant evidence.
- The chain audit makes missing links visible and requires revision.
- The exit ticket diagnoses readiness to explain consequences in later settings work.

## Teacher answer guide

- Strongest change boundary: the "bad sound" or the first falling trees; rain alone is not destruction.
- Strong causal explanation for Ibu's escape: the crashing trees and growing danger make the canopy unsafe.
- Language effects: repetition accelerates pace; onomatopoeia makes sound immediate; "forest screaming" personifies the habitat as suffering; the final "fire" creates a cliffhanger and concentrates fear.
- Accuracy note: do not claim pages 25-27 show Ginger Juice's capture. They show the causal chain from disturbance to fire. Earlier narration reports her mother was killed and Ginger Juice later came to the restaurant; later chapters provide the fuller capture account.
`;
  fs.writeFileSync(planPath, md, 'utf8');
}

async function buildHandout() {
  const sequenceRows = [
    ['___', 'The bad sound grows louder and shakes the treetops.'],
    ['___', 'Ibu carries Ginger Juice quickly through the canopy.'],
    ['___', 'Trees crash to the ground.'],
    ['___', 'A bitter human smell enters the forest.'],
    ['___', 'Falling trees make escape impossible.'],
    ['___', 'The remaining forest is threatened by fire.'],
  ];

  const children = [
    ...titleBlock('Cause, effect and author craft in pages 25-27'),
    heading('1. Rebuild the chain', 1),
    para('Number the events 1-6. Then read each arrow aloud with because, therefore or which means. If the sentence does not make sense, the link needs repair.', { italic: true }),
    fixedTable([
      new TableRow({ tableHeader: true, children: [
        cell([para('Order', { bold: true, color: C.white, alignment: AlignmentType.CENTER, spacing: { after: 0 } })], 1050, { fill: C.forest, borderColor: C.forest }),
        cell([para('Event from the chapter', { bold: true, color: C.white, alignment: AlignmentType.CENTER, spacing: { after: 0 } })], 8310, { fill: C.forest, borderColor: C.forest }),
      ] }),
      ...sequenceRows.map(([n, text]) => new TableRow({ children: [
        cell([para(n, { bold: true, alignment: AlignmentType.CENTER, spacing: { after: 0 } })], 1050),
        cell([para(text, { spacing: { after: 0 } })], 8310),
      ] })),
    ], [1050, 8310]),
    heading('Turning point', 2),
    para('I think the safe world begins to change when ________________________________________________'),
    para('because __________________________________________________________________________________', { spacing: { after: 0 } }),
    new Paragraph({ children: [new PageBreak()] }),
    heading('2. Prove three links', 1),
    para('Choose three arrows from your sequence. Name the cause, the effect and the text clue that proves the connection.'),
    fixedTable([
      new TableRow({ tableHeader: true, children: [
        cell([para('Cause', { bold: true, color: C.white, alignment: AlignmentType.CENTER, spacing: { after: 0 } })], 2600, { fill: C.leaf, borderColor: C.leaf }),
        cell([para('Connector', { bold: true, color: C.white, alignment: AlignmentType.CENTER, spacing: { after: 0 } })], 1500, { fill: C.leaf, borderColor: C.leaf }),
        cell([para('Effect', { bold: true, color: C.white, alignment: AlignmentType.CENTER, spacing: { after: 0 } })], 2600, { fill: C.leaf, borderColor: C.leaf }),
        cell([para('Precise text clue', { bold: true, color: C.white, alignment: AlignmentType.CENTER, spacing: { after: 0 } })], 2660, { fill: C.leaf, borderColor: C.leaf }),
      ] }),
      ...Array.from({ length: 3 }, () => new TableRow({ children: [
        cell([para('\n', { spacing: { after: 0 } })], 2600),
        cell([para('because / therefore / which means', { size: 18, alignment: AlignmentType.CENTER, spacing: { after: 0 } })], 1500, { fill: C.cream }),
        cell([para('\n', { spacing: { after: 0 } })], 2600),
        cell([para('\n', { spacing: { after: 0 } })], 2660),
      ] })),
    ], [2600, 1500, 2600, 2660]),
    heading('3. Language microscope', 1),
    para('The author does more than list events. Explain how one language choice makes the chain feel urgent, frightening or enormous.'),
    fixedTable([
      new TableRow({ tableHeader: true, children: [
        cell([para('Short text detail', { bold: true, color: C.white, alignment: AlignmentType.CENTER, spacing: { after: 0 } })], 2700, { fill: C.ember, borderColor: C.ember }),
        cell([para('Author choice', { bold: true, color: C.white, alignment: AlignmentType.CENTER, spacing: { after: 0 } })], 2300, { fill: C.ember, borderColor: C.ember }),
        cell([para('Effect on the reader', { bold: true, color: C.white, alignment: AlignmentType.CENTER, spacing: { after: 0 } })], 4360, { fill: C.ember, borderColor: C.ember }),
      ] }),
      ...[
        ['"louder, louder"', 'repetition'],
        ['"crash, crash, crash"', 'sound + repetition'],
        ['"forest screaming"', 'personification'],
        ['"fire!"', 'sudden one-word ending'],
      ].map(([detail, choice]) => new TableRow({ children: [
        cell([para(detail, { bold: true, spacing: { after: 0 } })], 2700, { fill: C.cream }),
        cell([para(choice, { spacing: { after: 0 } })], 2300),
        cell([para('\n', { spacing: { after: 0 } })], 4360),
      ] })),
    ], [2700, 2300, 4360]),
    new Paragraph({ children: [new PageBreak()] }),
    heading('4. Chain-to-explanation', 1),
    para('How does destruction change Ginger Juice\'s world? Write 5-7 sentences. Include three linked events, one precise text detail, two causal connectors and one explanation of an author choice.'),
    fixedTable([new TableRow({ children: [
      cell([
        para('Optional launch stems', { bold: true, color: C.forest, spacing: { after: 60 } }),
        para('At first ...  When ...  Because ...  Therefore ...  The words "..." make the reader ...', { italic: true, size: 20, spacing: { after: 0 } }),
      ], 9360, { fill: C.moss, borderColor: C.leaf }),
    ] })], [9360]),
    ...writingLines(5),
    heading('5. Partner chain audit', 1),
    fixedTable([new TableRow({ children: [
      cell([para('CHECK 1', { bold: true, color: C.forest, alignment: AlignmentType.CENTER, spacing: { after: 40 } }), para('Every arrow can be read with because, therefore or which means.', { size: 19, alignment: AlignmentType.CENTER, spacing: { after: 0 } })], 3120, { fill: C.pale }),
      cell([para('CHECK 2', { bold: true, color: C.forest, alignment: AlignmentType.CENTER, spacing: { after: 40 } }), para('A precise text detail proves at least one link.', { size: 19, alignment: AlignmentType.CENTER, spacing: { after: 0 } })], 3120, { fill: C.pale }),
      cell([para('CHECK 3', { bold: true, color: C.forest, alignment: AlignmentType.CENTER, spacing: { after: 40 } }), para('One sentence explains how the author shapes the reader.', { size: 19, alignment: AlignmentType.CENTER, spacing: { after: 0 } })], 3120, { fill: C.pale }),
    ] })], [3120, 3120, 3120]),
    para('My revision: ___________________________________________________________________________', { spacing: { before: 180, after: 120 } }),
    heading('Exit evidence', 1),
    para('Cause -> immediate effect -> longer consequence:'),
    ...writingLines(2),
    para('The text detail that makes my chain convincing is: ____________________________________________', { spacing: { before: 80, after: 0 } }),
  ];

  const hf = headerFooter('STUDENT HANDOUT');
  const doc = new Document({
    creator: 'Joshua English Unit 3', title: 'Lesson 6 - When the Forest Screams',
    description: 'Student cause-and-effect handout for Berani pages 25-27.',
    numbering: { config: [{ reference: 'steps', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 270 }, spacing: { after: 80, line: 300, lineRule: 'auto' } } } }] }] },
    styles: documentStyles(22),
    sections: [{
      ...hf,
      properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440, header: 708, footer: 708 } } },
      children,
    }],
  });
  fs.writeFileSync(handoutPath, await Packer.toBuffer(doc));
}

async function buildLucasHandout() {
  const stages = [
    ['1', 'SAFE TREES', 'Ginger Juice and Ibu live high in the green forest.'],
    ['2', 'TREES FALL', 'A loud machine sound grows. Trees crash down.'],
    ['3', 'DANGER', 'They move fast. Fire threatens the forest.'],
  ];
  const children = [
    para('BERANI  |  LESSON 6', { bold: true, size: 19, color: C.ember, spacing: { after: 25 } }),
    para('When the Forest Screams', { bold: true, size: 36, color: C.forest, spacing: { after: 45 } }),
    para('Visual pathway: one event causes another', { bold: true, size: 23, color: C.smoke, spacing: { after: 90 } }),
    para('Name: ____________________________________    Date: __________', { italic: true, size: 19, spacing: { after: 60 } }),
    heading('1. Put the story in order', 1),
    para('Point, say or write 1, 2 and 3. Then trace the arrows with your finger.'),
    fixedTable([new TableRow({ children: stages.map(([n, label, desc], i) => cell([
      para(n, { bold: true, size: 38, color: i === 2 ? C.ember : C.forest, alignment: AlignmentType.CENTER, spacing: { after: 50 } }),
      para(label, { bold: true, color: C.forest, alignment: AlignmentType.CENTER, spacing: { after: 50 } }),
      para(desc, { size: 20, alignment: AlignmentType.CENTER, spacing: { after: 0 } }),
    ], 3120, { fill: i === 2 ? 'F8E1D5' : C.moss, borderColor: i === 2 ? C.ember : C.leaf })) })], [3120, 3120, 3120]),
    heading('2. Show the cause', 1),
    para('The trees fall. What happens next? Tick one.'),
    fixedTable([
      new TableRow({ children: [
        cell([para('[  ] Ginger Juice and Ibu move fast.', { bold: true, size: 24, spacing: { after: 0 } })], 4680, { fill: C.cream, borderColor: C.gold }),
        cell([para('[  ] Ginger Juice goes to sleep.', { bold: true, size: 24, spacing: { after: 0 } })], 4680, { fill: C.pale }),
      ] }),
    ], [4680, 4680]),
    heading('3. Finish the sentence', 1),
    fixedTable([new TableRow({ children: [cell([
      para('Because the trees fall, Ginger Juice and Ibu _______________________________.', { bold: true, size: 25, spacing: { after: 160 } }),
      para('Word bank: move fast  |  hide  |  feel afraid', { size: 22, color: C.smoke, spacing: { after: 0 } }),
    ], 9360, { fill: C.moss, borderColor: C.leaf })] })], [9360]),
    heading('4. Pick a feeling', 1),
    para('Circle one. You can point or say your answer.'),
    fixedTable([new TableRow({ children: [
      cell([para('SAFE', { bold: true, size: 28, alignment: AlignmentType.CENTER, spacing: { after: 0 } })], 3120, { fill: C.moss }),
      cell([para('AFRAID', { bold: true, size: 28, alignment: AlignmentType.CENTER, spacing: { after: 0 } })], 3120, { fill: C.cream, borderColor: C.gold }),
      cell([para('HAPPY', { bold: true, size: 28, alignment: AlignmentType.CENTER, spacing: { after: 0 } })], 3120, { fill: C.pale }),
    ] })], [3120, 3120, 3120]),
    heading('5. Exit evidence', 1),
    para('Tell or show an adult: "The trees fall, so ____________________________________."', { bold: true, size: 24 }),
    ...writingLines(1),
  ];

  const hf = headerFooter('VISUAL PATHWAY');
  const doc = new Document({
    creator: 'Joshua English Unit 3', title: 'Lesson 6 - Lucas visual pathway',
    styles: documentStyles(24),
    sections: [{
      ...hf,
      properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440, header: 708, footer: 708 } } },
      children,
    }],
  });
  fs.writeFileSync(lucasPath, await Packer.toBuffer(doc));
}

function buildHtml() {
  const html = String.raw`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Lesson 6 - When the Forest Screams</title>
<style>
:root{--ink:#142c25;--forest:#123f32;--deep:#071f1a;--leaf:#39785a;--moss:#dce8c5;--cream:#fff8e7;--paper:#fffdf7;--ember:#db6b3f;--gold:#e9ad3c;--smoke:#52645d;--good:#18764b;--bad:#aa3f34;--white:#fff;--shadow:0 18px 48px rgba(7,31,26,.18)}
*{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;overflow:hidden;background:var(--deep);font-family:Arial,sans-serif;color:var(--ink)}button,textarea{font:inherit}.deck{width:100%;height:100%;position:relative}.slide{display:none;position:absolute;inset:0;padding:clamp(28px,4vw,60px) clamp(34px,5.5vw,88px) 88px;background:var(--paper);overflow:hidden}.slide.active{display:flex;flex-direction:column;animation:enter .3s ease-out}@keyframes enter{from{opacity:.25;transform:translateY(8px)}to{opacity:1;transform:none}}h1,h2,h3,p{margin-top:0}.kicker{font-size:15px;font-weight:900;letter-spacing:.14em;text-transform:uppercase;color:var(--ember);margin-bottom:10px}.title,.slide-title{font-family:Georgia,serif;letter-spacing:-.03em;line-height:1.02}.title{font-size:clamp(52px,7vw,96px);max-width:820px;margin:0 0 18px}.slide-title{font-size:clamp(35px,4.2vw,58px);margin:0 0 13px}.lead{font-size:clamp(20px,2vw,29px);line-height:1.35;color:var(--smoke);max-width:1050px}.small{font-size:15px;color:var(--smoke)}
.hero{color:white;background:linear-gradient(120deg,#08251e 0%,#174936 48%,#8b4a31 100%);justify-content:center}.hero:before{content:"";position:absolute;inset:auto 0 0;height:46%;background:linear-gradient(165deg,transparent 0 19%,rgba(0,0,0,.33) 20% 23%,transparent 24%),linear-gradient(195deg,transparent 0 30%,rgba(0,0,0,.24) 31% 35%,transparent 36%)}.hero:after{content:"";position:absolute;inset:0;background:radial-gradient(circle at 76% 42%,rgba(255,157,70,.5),transparent 24%),repeating-linear-gradient(90deg,transparent 0 9%,rgba(0,0,0,.12) 9.2% 10%)}.hero>*{position:relative;z-index:2}.hero .sub{font-size:clamp(22px,2.2vw,32px);max-width:690px;line-height:1.35;color:#f6ecd4}.chain-pill{display:inline-flex;gap:12px;align-items:center;margin-top:22px;padding:11px 18px;border:1px solid rgba(255,255,255,.45);border-radius:99px;background:rgba(0,0,0,.22);font-weight:800}.chain-pill b{color:#ffd878}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:24px;flex:1;min-height:0;margin-top:18px}.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;flex:1;min-height:0;margin-top:18px}.card{background:white;border:2px solid #d4ded8;border-radius:20px;padding:clamp(18px,2vw,28px);box-shadow:0 8px 22px rgba(20,44,37,.07)}.card h3{font-size:clamp(21px,2vw,28px);margin-bottom:10px}.card p,.card li{font-size:clamp(17px,1.55vw,22px);line-height:1.38}.dark{background:var(--forest);color:white;border-color:var(--forest)}.tag{display:inline-block;padding:6px 11px;border-radius:99px;background:var(--moss);color:var(--forest);font-weight:900;font-size:13px;letter-spacing:.08em;text-transform:uppercase}.btn{border:0;border-radius:12px;padding:11px 17px;background:var(--forest);color:white;font-weight:900;cursor:pointer;box-shadow:0 5px 0 #061b16}.btn.secondary{background:var(--gold);color:var(--ink);box-shadow:0 5px 0 #b77920}.btn:focus-visible,.sound:focus-visible,.detail:focus-visible,.option:focus-visible,.move:focus-visible{outline:4px solid #ffd66f;outline-offset:3px}.controls{display:flex;align-items:center;gap:12px;margin-top:13px}.feedback{font-weight:800;color:var(--forest)}
.soundscape{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;flex:1;align-items:center}.sound{min-height:200px;border:0;border-radius:24px;padding:20px;background:white;box-shadow:var(--shadow);cursor:pointer;text-align:center;transition:.2s}.sound:hover,.sound.active{transform:translateY(-5px)}.sound.safe{border-top:9px solid var(--leaf)}.sound.warn{border-top:9px solid var(--gold)}.sound.danger{border-top:9px solid var(--ember)}.sound .word{font-family:Georgia,serif;font-size:clamp(28px,3vw,44px);font-weight:900}.sound .reveal{display:none;margin-top:16px;font-size:18px;line-height:1.35;color:var(--smoke)}.sound.active .reveal{display:block}
.steps{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;flex:1;align-items:center}.step{background:white;border-radius:20px;padding:26px;border-top:8px solid var(--leaf);box-shadow:var(--shadow)}.step:nth-child(2){border-color:var(--gold)}.step:nth-child(3){border-color:var(--ember)}.step .num{font-family:Georgia,serif;font-size:50px;color:var(--ember);font-weight:900}.success{display:grid;grid-template-columns:1fr 1fr;gap:10px 25px;font-size:18px;line-height:1.35;padding-left:22px}
.read-map{display:grid;grid-template-columns:.75fr 1.25fr;gap:25px;flex:1;min-height:0}.page-cue{background:var(--forest);color:white;border-radius:24px;padding:28px;display:flex;flex-direction:column;justify-content:center}.pages{font-family:Georgia,serif;font-size:60px;color:#d7ed91;font-weight:900}.thresholds{display:flex;flex-direction:column;gap:15px;justify-content:center}.threshold{padding:18px 20px;background:white;border-left:8px solid var(--leaf);border-radius:14px;font-size:21px;box-shadow:0 7px 18px rgba(20,44,37,.08)}.threshold:nth-child(2){border-color:var(--gold)}.threshold:nth-child(3){border-color:var(--ember)}
.sort-layout{display:grid;grid-template-columns:.9fr 1.25fr;gap:22px;flex:1;min-height:0}.bank{background:#e9efe7;border-radius:20px;padding:15px;overflow:auto}.detail{display:block;width:100%;text-align:left;border:2px solid #c7d5cd;background:white;border-radius:12px;padding:11px 13px;margin:8px 0;cursor:pointer;font-size:17px}.detail.selected{border-color:var(--gold);background:#fff1ca}.detail.correct{border-color:var(--good);background:#e7f5ec}.detail.wrong{border-color:var(--bad);animation:shake .3s}@keyframes shake{25%{transform:translateX(-7px)}75%{transform:translateX(7px)}}.zones{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.zone{border:3px dashed #9db0a5;background:rgba(255,255,255,.7);border-radius:17px;padding:13px;cursor:pointer;min-height:210px}.zone h3{font-size:21px;color:var(--forest)}.zone p{font-size:14px;color:var(--smoke)}
.model-chain{display:flex;align-items:stretch;gap:14px;margin-top:28px}.node{flex:1;background:white;border:2px solid #ccd9d1;border-radius:18px;padding:25px;font-size:22px;line-height:1.35}.arrow{align-self:center;font-size:42px;color:var(--ember);font-weight:900}.test-box{margin-top:24px;padding:20px 24px;background:var(--moss);border-left:8px solid var(--leaf);border-radius:14px;font-size:23px}.weak{margin-top:14px;color:var(--bad);font-size:19px;font-weight:800}
.sequence{display:grid;grid-template-columns:1fr .75fr;gap:22px;flex:1;min-height:0}.order-list{display:flex;flex-direction:column;gap:7px;overflow:auto}.order-card{display:grid;grid-template-columns:42px 1fr auto;align-items:center;gap:11px;background:white;border:2px solid #d2ddd6;border-radius:13px;padding:9px 12px;font-size:16px}.ord{width:32px;height:32px;border-radius:50%;display:grid;place-items:center;background:var(--forest);color:white;font-weight:900}.move{border:0;background:#e6eee9;color:var(--forest);border-radius:8px;padding:6px 9px;cursor:pointer;font-weight:900}.chain-test{background:var(--forest);color:white;padding:24px;border-radius:22px}.chain-test h3{font-family:Georgia,serif;font-size:30px}.chain-test p{font-size:18px;line-height:1.42}.chain-test b{color:#d8ed94}
.options{display:flex;flex-direction:column;gap:13px;flex:1;justify-content:center}.option{border:2px solid #d3ded7;background:white;border-radius:16px;padding:18px;text-align:left;cursor:pointer;font-size:20px}.option.selected{border-color:var(--gold);background:#fff1cc}.option.good{border-color:var(--good);background:#e4f4e9}.option.bad{border-color:var(--bad);background:#fff0ec}.option .why{display:none;margin-top:8px;font-size:16px;font-weight:700}.option.good .why,.option.bad .why{display:block}
.microscope{display:grid;grid-template-columns:.9fr 1.15fr;gap:24px;flex:1;min-height:0}.extract{background:var(--forest);color:white;border-radius:24px;padding:26px;display:flex;flex-direction:column;justify-content:center}.extract p{font-family:Georgia,serif;font-size:clamp(26px,3vw,42px);line-height:1.25}.choices{display:grid;grid-template-columns:1fr 1fr;gap:12px}.craft{border:2px solid #d5dfd8;background:white;border-radius:15px;padding:16px;cursor:pointer;font-size:18px}.craft b{display:block;color:var(--ember);margin-bottom:6px}.craft span{filter:blur(6px);transition:.2s}.craft.open span{filter:none}
.studio{display:grid;grid-template-columns:.72fr 1.28fr;gap:24px;flex:1;min-height:0}.toolbox{background:var(--forest);color:white;border-radius:22px;padding:22px}.toolbox h3{font-family:Georgia,serif;font-size:30px}.toolbox button{display:block;width:100%;border:1px solid rgba(255,255,255,.3);background:rgba(255,255,255,.08);color:white;border-radius:10px;padding:9px;text-align:left;margin:8px 0;cursor:pointer}.writing label{display:block;font-weight:900;color:var(--forest);margin:7px 0}.writing textarea{width:100%;resize:none;border:2px solid #b9c9c0;border-radius:13px;padding:12px;font-size:18px;line-height:1.35}.writing textarea:focus{outline:4px solid rgba(233,173,60,.28);border-color:var(--gold)}.wordcount{text-align:right;color:var(--smoke);font-size:14px}
.rehearse{display:grid;grid-template-columns:.8fr 1.2fr;gap:25px;flex:1;align-items:center}.timerbox{background:var(--forest);color:white;border-radius:26px;padding:28px}.timer{width:118px;height:118px;border-radius:50%;display:grid;place-items:center;background:#0b2d25;color:white;font-family:Georgia,serif;font-size:44px;box-shadow:inset 0 0 0 9px rgba(255,255,255,.13)}.audit{display:flex;flex-direction:column;gap:13px}.audit div{background:white;border-left:8px solid var(--gold);padding:18px;border-radius:13px;font-size:20px}.truth-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;flex:1;align-items:stretch}.truth{padding:22px;border-radius:20px;background:white;border-top:8px solid var(--leaf);box-shadow:var(--shadow)}.truth:nth-child(2){border-color:var(--gold)}.truth:nth-child(3){border-color:var(--ember)}.truth h3{font-size:24px}.truth p{font-size:18px;line-height:1.4}.exit{background:linear-gradient(130deg,#092b23,#5a392d);color:white}.ticket{background:var(--cream);color:var(--ink);border-radius:24px;padding:28px;max-width:980px;box-shadow:var(--shadow)}.ticket p{font-size:24px;line-height:1.4}
.nav{position:fixed;z-index:20;left:0;right:0;bottom:0;height:66px;background:rgba(6,28,23,.98);display:flex;align-items:center;padding:0 20px;color:white}.nav button{border:0;background:transparent;color:white;font-weight:900;padding:10px 12px;border-radius:8px;cursor:pointer}.nav button:hover{background:rgba(255,255,255,.12)}.progress{height:5px;flex:1;background:rgba(255,255,255,.17);border-radius:99px;margin:0 15px;overflow:hidden}.progress i{display:block;height:100%;background:var(--gold);transition:.2s}.slide-no{min-width:72px;text-align:center;font-weight:900}.notes{position:fixed;right:18px;bottom:77px;z-index:30;width:min(440px,90vw);max-height:55vh;overflow:auto;display:none;background:#fff8da;border:2px solid var(--gold);border-radius:14px;padding:17px;box-shadow:var(--shadow)}.notes.open{display:block}.notes h3{font-size:18px}.notes p{font-size:15px;line-height:1.35}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
@media(max-width:900px){.grid2,.grid3,.read-map,.sort-layout,.sequence,.microscope,.studio,.rehearse,.truth-grid{grid-template-columns:1fr}.slide{overflow:auto;padding-bottom:94px}.soundscape{grid-template-columns:1fr 1fr}.steps{grid-template-columns:1fr}.zones{grid-template-columns:1fr}.model-chain{flex-direction:column}.arrow{transform:rotate(90deg)}}@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
</style>
</head>
<body>
<main class="deck" id="deck">
  <section class="slide hero active" data-notes="Open with the title only. Ask: What could make a forest scream? Collect two predictions, but do not confirm them yet.">
    <div class="kicker" style="color:#f1c76f">BERANI &bull; LESSON 6</div><h1 class="title">When the Forest Screams</h1>
    <p class="sub">One sound changes a safe world. Can you rebuild the chain reaction?</p><div class="chain-pill">cause <b>&rarr;</b> effect <b>&rarr;</b> consequence</div>
  </section>
  <section class="slide" data-notes="Cold open. Students select the exact card where safety begins to break and justify the boundary. More than one boundary can be defended. Click cards only after students give evidence.">
    <div class="kicker">SOUNDSCAPE</div><h2 class="slide-title">When does the world stop feeling safe?</h2><p class="lead">Choose the turning point. Defend it with one sound or image.</p>
    <div class="soundscape">
      <button class="sound safe"><div class="word">wa-wa-wa</div><div class="reveal">Gibbons echo across the treetops. Familiar life.</div></button>
      <button class="sound safe"><div class="word">klong, klong</div><div class="reveal">Bamboo stalks nudge together. A calm forest rhythm.</div></button>
      <button class="sound warn"><div class="word">rumble</div><div class="reveal">An unknown sound shakes the treetops. A defensible turning point.</div></button>
      <button class="sound danger"><div class="word">crash, crash</div><div class="reveal">Giant trees fall. The threat is now visible and immediate.</div></button>
    </div>
  </section>
  <section class="slide" data-notes="Students restate the chain test in their own words. Emphasise that sequence answers what happened next; causality explains why it happened.">
    <div class="kicker">MISSION</div><h2 class="slide-title">Do not just retell. Explain the chain.</h2>
    <div class="steps"><article class="step"><div class="num">1</div><h3>Order</h3><p>Place the key events in a defensible sequence.</p></article><article class="step"><div class="num">2</div><h3>Connect</h3><p>Test each arrow with <b>because</b>, <b>therefore</b> or <b>which means</b>.</p></article><article class="step"><div class="num">3</div><h3>Prove</h3><p>Use a precise text detail and explain the author's craft.</p></article></div>
    <ul class="success"><li>I can order key events.</li><li>I can explain why one event produces the next.</li><li>I can use precise evidence.</li><li>I can revise a broken link.</li></ul>
  </section>
  <section class="slide" data-notes="Read pages 25-27. Pause at each threshold long enough for students to record one detail. Avoid over-questioning during the first encounter.">
    <div class="kicker">CONCRETE ENCOUNTER</div><h2 class="slide-title">Read the memory in three thresholds</h2>
    <div class="read-map"><aside class="page-cue"><span class="tag">BERANI</span><div class="pages">pp. 25-27</div><p style="font-size:22px;line-height:1.4">Capture one detail at each threshold. No complete chain yet.</p></aside><div class="thresholds"><div class="threshold"><b>1 &bull; Safe canopy</b><br>What makes this feel like home?</div><div class="threshold"><b>2 &bull; Unknown threat</b><br>What changes first: sound, smell or movement?</div><div class="threshold"><b>3 &bull; Fire</b><br>Which earlier events make this ending possible?</div></div></div>
  </section>
  <section class="slide" data-notes="Select a detail, then a zone. Ask students to state the category rule. Rain is deliberately ambiguous: accept a contextual justification. The reset returns all cards.">
    <div class="kicker">WORLD SHIFT</div><h2 class="slide-title">Safe world, warning or destruction?</h2>
    <div class="sort-layout"><div class="bank" id="sortBank">
      <button class="detail" data-target="safe">gibbons echo across the treetops</button><button class="detail" data-target="safe">warm rays move through the canopy</button><button class="detail" data-target="warn">a bitter human smell enters the air</button><button class="detail" data-target="warn">a rumble grows louder</button><button class="detail" data-target="destroy">giant treetops crash to the ground</button><button class="detail" data-target="destroy">quiet carries the fear of fire</button><button class="detail" data-target="context">rain-scent brings back the memory</button>
    </div><div class="zones"><div class="zone" data-zone="safe"><h3>Safe world</h3><p>Familiar life, care and shelter</p></div><div class="zone" data-zone="warn"><h3>Warning</h3><p>A change that signals danger</p></div><div class="zone" data-zone="destroy"><h3>Destruction</h3><p>Damage or immediate threat</p></div></div></div>
    <div class="controls"><button class="btn" id="checkSort">Check reasoning</button><button class="btn secondary" id="resetSort">Reset</button><span class="feedback" id="sortFeedback"></span></div>
  </section>
  <section class="slide" data-notes="Think aloud through the strong link. Then read the weak link. Students explain why 'and then' proves order but not cause.">
    <div class="kicker">EXPLICIT MODEL</div><h2 class="slide-title">A strong arrow explains why</h2>
    <div class="model-chain"><div class="node"><span class="tag">CAUSE</span><p><b>Trees begin crashing to the ground.</b></p></div><div class="arrow">&rarr;</div><div class="node"><span class="tag">EFFECT</span><p><b>Ibu puts Ginger Juice on her back and flees.</b></p></div></div>
    <div class="test-box"><b>Because test:</b> Ibu flees <b>because</b> the falling trees make the canopy unsafe.</div><div class="weak">Weak link: "Trees fall, and then Ibu moves." That gives order, not a reason.</div>
  </section>
  <section class="slide" data-notes="Pairs use arrows to reorder. Before checking, require them to read each adjacent pair with a causal connector. Feedback identifies whether the whole chain is ready.">
    <div class="kicker">SEQUENCE LAB</div><h2 class="slide-title">Rebuild the chain reaction</h2>
    <div class="sequence"><div class="order-list" id="orderList"></div><aside class="chain-test"><h3>The arrow test</h3><p>Read every link aloud:</p><p><b>Because</b> ___, ___.</p><p>___; <b>therefore</b>, ___.</p><p>___, <b>which means</b> ___.</p><button class="btn secondary" id="checkOrder">Check chain</button><button class="btn" id="resetOrder" style="margin-left:8px">Reset</button><p id="orderFeedback"></p></aside></div>
  </section>
  <section class="slide" data-notes="Students choose individually, then justify against immediate evidence. Rain is plausible but irrelevant to Ibu's decision at this moment.">
    <div class="kicker">CAUSE DETECTIVE</div><h2 class="slide-title">Why does Ibu move fast?</h2><p class="lead">Choose the strongest explanation - then name the evidence that makes it relevant.</p>
    <div class="options"><button class="option" data-good="false">Because rain is falling.<div class="why">Plausible detail, but it does not explain the urgent escape.</div></button><button class="option" data-good="true">Because trees are crashing and the canopy is becoming unsafe.<div class="why">Strong: it connects the immediate danger to Ibu's action.</div></button><button class="option" data-good="false">Because Ginger Juice wants more durian.<div class="why">Earlier detail, but irrelevant to the escape.</div></button></div>
    <div class="controls"><button class="btn" id="checkCause">Check evidence</button><button class="btn secondary" id="resetCause">Reset</button><span class="feedback" id="causeFeedback"></span></div>
  </section>
  <section class="slide" data-notes="Read the extract once. Click one craft card at a time only after students name its likely job. Connect every annotation to the independent response.">
    <div class="kicker">LANGUAGE MICROSCOPE</div><h2 class="slide-title">How does the author make the chain feel urgent?</h2>
    <div class="microscope"><div class="extract"><p>"louder, louder"</p><p>"forest screaming"</p><p>"crash, crash, crash"</p><p>"fire!"</p></div><div class="choices"><button class="craft"><b>Repetition</b><span>Builds pace and makes the danger feel relentless.</span></button><button class="craft"><b>Personification</b><span>Makes the whole forest seem alive and suffering.</span></button><button class="craft"><b>Sound words</b><span>Places the reader inside Ginger Juice's sensory memory.</span></button><button class="craft"><b>Sudden ending</b><span>Concentrates fear in one word and creates a cliffhanger.</span></button></div></div>
  </section>
  <section class="slide" data-notes="Students complete the printed flow chart first, then draft here or on paper. Optional stems insert at the cursor. Draft saves locally. Require evidence and one language-effect sentence.">
    <div class="kicker">BUILD STUDIO</div><h2 class="slide-title">Turn the chain into an explanation</h2>
    <div class="studio"><aside class="toolbox"><h3>Useful connectors</h3><button data-insert="Because ">Because ...</button><button data-insert="This causes ">This causes ...</button><button data-insert="Therefore, ">Therefore ...</button><button data-insert="This means ">This means ...</button><button data-insert="The words &quot;...&quot; make the reader ">Explain the craft ...</button><p>Question: <b>How does destruction change Ginger Juice's world?</b></p></aside><div class="writing"><label for="chainText">1. Explain at least three linked events</label><textarea id="chainText" rows="7" placeholder="At first ... When ... Because ... Therefore ..."></textarea><label for="craftText">2. Explain one author choice</label><textarea id="craftText" rows="3" placeholder="The author uses ... so the reader ..."></textarea><div class="wordcount"><span id="wordCount">0</span> words &bull; aim for 90-130</div></div></div>
  </section>
  <section class="slide" data-notes="Partner A reads. Partner B uses all three checks. Swap after 45 seconds. Each writer immediately revises one weak link.">
    <div class="kicker">CHAIN AUDIT</div><h2 class="slide-title">Test, feedback, revise</h2>
    <div class="rehearse"><div class="timerbox"><h3>Reader</h3><p>Read your explanation. Pause at every causal connector.</p><div class="timer" id="timer">45</div><button class="btn secondary" id="startTimer" style="margin-top:14px">Start 45 seconds</button></div><div class="audit"><div><b>Link:</b> I can read every arrow with because/therefore/which means.</div><div><b>Proof:</b> One precise detail supports the chain.</div><div><b>Craft:</b> One sentence explains how the author shapes the reader.</div><div><b>Revise now:</b> strengthen one missing or weak link.</div></div></div>
  </section>
  <section class="slide" data-notes="Accuracy bridge. This prevents students from claiming the current extract shows capture. Ask students to classify one statement into each column.">
    <div class="kicker">EVIDENCE BOUNDARY</div><h2 class="slide-title">What do we know - and from where?</h2>
    <div class="truth-grid"><article class="truth"><h3>This extract states</h3><p>Noise grows, trees fall, Ibu flees, escape fails and fire threatens the forest.</p></article><article class="truth"><h3>Earlier text reports</h3><p>Ginger Juice's mother was killed and the baby later came to the restaurant.</p></article><article class="truth"><h3>We may infer</h3><p>Habitat destruction makes Ginger Juice and Ibu more vulnerable - but pages 25-27 do not yet narrate the capture.</p></article></div>
  </section>
  <section class="slide exit" data-notes="Collect this on paper or mini-whiteboards. Use whether students confuse immediate and longer consequences to plan the next lesson's opening.">
    <div class="kicker" style="color:#f3cb75">EXIT EVIDENCE</div><h2 class="slide-title">Leave one unbroken chain</h2><div class="ticket"><p><b>Cause</b> &rarr; <b>immediate effect</b> &rarr; <b>longer consequence</b></p><p>Add the precise text detail that makes your chain convincing.</p><p class="small">Final check: Can each arrow be read with because, therefore or which means?</p></div>
  </section>
</main>
<aside class="notes" id="notes" aria-live="polite"><h3>Teacher notes</h3><p id="noteText"></p></aside>
<nav class="nav" aria-label="Presentation controls"><button id="prev" aria-label="Previous slide">&larr; Previous</button><button id="next" aria-label="Next slide">Next &rarr;</button><div class="progress" aria-hidden="true"><i id="bar"></i></div><span class="slide-no" id="slideNo"></span><button id="notesBtn" aria-label="Toggle teacher notes">Notes</button><button id="resetAll" aria-label="Reset all interactions">Reset</button><button id="full" aria-label="Toggle fullscreen">Fullscreen</button></nav>
<script>
const slides=[...document.querySelectorAll('.slide')];let current=0;const noteText=document.getElementById('noteText'),notes=document.getElementById('notes');
function show(n){current=Math.max(0,Math.min(slides.length-1,n));slides.forEach((s,i)=>s.classList.toggle('active',i===current));document.getElementById('slideNo').textContent=(current+1)+' / '+slides.length;document.getElementById('bar').style.width=((current+1)/slides.length*100)+'%';noteText.textContent=slides[current].dataset.notes||'No notes for this slide.'}
document.getElementById('prev').onclick=()=>show(current-1);document.getElementById('next').onclick=()=>show(current+1);document.getElementById('notesBtn').onclick=()=>notes.classList.toggle('open');document.getElementById('full').onclick=()=>document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();
document.addEventListener('keydown',e=>{if(['TEXTAREA','INPUT'].includes(document.activeElement.tagName))return;if(['ArrowRight','PageDown',' '].includes(e.key)){e.preventDefault();show(current+1)}if(['ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();show(current-1)}if(e.key.toLowerCase()==='n')notes.classList.toggle('open')});
document.querySelectorAll('.sound').forEach(x=>x.onclick=()=>x.classList.toggle('active'));
let selectedDetail=null;document.querySelectorAll('.detail').forEach(x=>x.onclick=()=>{selectedDetail=x;document.querySelectorAll('.detail').forEach(y=>y.classList.toggle('selected',y===x))});
document.querySelectorAll('.zone').forEach(z=>z.onclick=()=>{if(!selectedDetail)return;z.appendChild(selectedDetail);selectedDetail.classList.remove('selected');selectedDetail=null});
document.getElementById('checkSort').onclick=()=>{let right=0,total=0;document.querySelectorAll('.detail').forEach(x=>{total++;const zone=x.closest('.zone')?.dataset.zone;const ok=zone===x.dataset.target||(x.dataset.target==='context'&&zone);x.classList.toggle('correct',ok);x.classList.toggle('wrong',!ok);if(ok)right++});document.getElementById('sortFeedback').textContent=right===total?'Strong categories. Explain why rain depends on context.':right+' / '+total+' placed. Recheck the boundary and the immediate evidence.'};
function resetSort(){document.querySelectorAll('.detail').forEach(x=>{document.getElementById('sortBank').appendChild(x);x.classList.remove('correct','wrong','selected')});document.getElementById('sortFeedback').textContent='';selectedDetail=null}document.getElementById('resetSort').onclick=resetSort;
const orderData=[['rumble','A machine-like rumble shakes the treetops.'],['scent','Human scent and noise grow stronger.'],['trees','Giant trees crash to the ground.'],['move','Ibu carries Ginger Juice through the canopy.'],['blocked','Falling trees make escape impossible.'],['fire','The remaining forest is threatened by fire.']];
const startOrder=['move','rumble','fire','trees','scent','blocked'];function renderOrder(ids=startOrder){const list=document.getElementById('orderList');list.innerHTML='';ids.forEach((id,i)=>{const text=orderData.find(x=>x[0]===id)[1];const row=document.createElement('div');row.className='order-card';row.dataset.id=id;row.innerHTML='<span class="ord">'+(i+1)+'</span><span>'+text+'</span><span><button class="move up" aria-label="Move up">&uarr;</button> <button class="move down" aria-label="Move down">&darr;</button></span>';list.appendChild(row)});bindMoves()}
function bindMoves(){document.querySelectorAll('.up').forEach(b=>b.onclick=()=>{const r=b.closest('.order-card');if(r.previousElementSibling)r.parentNode.insertBefore(r,r.previousElementSibling);renumber()});document.querySelectorAll('.down').forEach(b=>b.onclick=()=>{const r=b.closest('.order-card');if(r.nextElementSibling)r.parentNode.insertBefore(r.nextElementSibling,r);renumber()})}function renumber(){document.querySelectorAll('.order-card .ord').forEach((x,i)=>x.textContent=i+1)}
document.getElementById('checkOrder').onclick=()=>{const ids=[...document.querySelectorAll('.order-card')].map(x=>x.dataset.id);const correct=orderData.map(x=>x[0]);const first=ids.findIndex((x,i)=>x!==correct[i]);document.getElementById('orderFeedback').innerHTML=first<0?'<b>Chain ready.</b> Now prove each arrow aloud.':'First broken link is near position <b>'+(first+1)+'</b>. Test that arrow with because.'};document.getElementById('resetOrder').onclick=()=>{renderOrder();document.getElementById('orderFeedback').textContent=''};renderOrder();
let causeChoice=null;document.querySelectorAll('.option').forEach(x=>x.onclick=()=>{causeChoice=x;document.querySelectorAll('.option').forEach(y=>y.classList.toggle('selected',y===x))});document.getElementById('checkCause').onclick=()=>{if(!causeChoice){document.getElementById('causeFeedback').textContent='Choose, then justify.';return}document.querySelectorAll('.option').forEach(x=>x.classList.add(x.dataset.good==='true'?'good':'bad'));document.getElementById('causeFeedback').textContent=causeChoice.dataset.good==='true'?'Relevant cause and immediate evidence.':'That detail is present, but it does not cause the escape.'};document.getElementById('resetCause').onclick=()=>{causeChoice=null;document.querySelectorAll('.option').forEach(x=>x.classList.remove('selected','good','bad'));document.getElementById('causeFeedback').textContent=''};
document.querySelectorAll('.craft').forEach(x=>x.onclick=()=>x.classList.toggle('open'));
const chainText=document.getElementById('chainText'),craftText=document.getElementById('craftText');function count(){const n=(chainText.value+' '+craftText.value).trim().split(/\s+/).filter(Boolean).length;document.getElementById('wordCount').textContent=n;localStorage.setItem('lesson6-chain',chainText.value);localStorage.setItem('lesson6-craft',craftText.value)}chainText.value=localStorage.getItem('lesson6-chain')||'';craftText.value=localStorage.getItem('lesson6-craft')||'';[chainText,craftText].forEach(x=>x.addEventListener('input',count));document.querySelectorAll('[data-insert]').forEach(b=>b.onclick=()=>{const t=document.activeElement.tagName==='TEXTAREA'?document.activeElement:chainText;t.setRangeText(b.dataset.insert,t.selectionStart,t.selectionEnd,'end');t.focus();count()});count();
let timerId=null;document.getElementById('startTimer').onclick=()=>{clearInterval(timerId);let t=45;document.getElementById('timer').textContent=t;timerId=setInterval(()=>{t--;document.getElementById('timer').textContent=t;if(t<=0)clearInterval(timerId)},1000)};
function resetAll(){resetSort();renderOrder();document.getElementById('orderFeedback').textContent='';document.getElementById('resetCause').click();document.querySelectorAll('.sound,.craft').forEach(x=>x.classList.remove('active','open'));chainText.value='';craftText.value='';localStorage.removeItem('lesson6-chain');localStorage.removeItem('lesson6-craft');count();clearInterval(timerId);document.getElementById('timer').textContent='45'}document.getElementById('resetAll').onclick=resetAll;show(0);
</script>
</body></html>`;
  fs.writeFileSync(htmlPath, html, 'utf8');
}

async function main() {
  buildPlan();
  buildHtml();
  await buildHandout();
  await buildLucasHandout();
  console.log('Built Lesson 6 plan, presentation and handouts.');
}

main().catch(err => { console.error(err); process.exitCode = 1; });
