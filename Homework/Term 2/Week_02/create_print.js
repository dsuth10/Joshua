const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, BorderStyle, WidthType, TabStopType
} = require('docx');
const fs = require('fs');
const path = require('path');

const OUT = __dirname;

// ── Texts ─────────────────────────────────────────────────────────────────────

const texts = {
  L1: `Cyclones are among the most powerful storms on Earth. They produce winds of over 200 kilometres per hour and can push walls of seawater far inland. To understand how they form, we need to look at the conditions that make them possible.

Cyclone formation begins over warm tropical ocean water. The sea surface must be at least 26.5 degrees Celsius. This heat causes water to evaporate and rise as warm, moist air. As the air rises, it cools and forms thick clouds and heavy rain. This process also releases extra heat, which causes even more air to rise. The cycle keeps repeating, and the storm grows stronger.

As the warm air rises, it leaves a zone of low pressure near the ocean's surface. Surrounding air rushes in to replace it. The Earth's rotation causes this air to curve as it moves, a process called the Coriolis effect. In the Southern Hemisphere, cyclones spiral clockwise. In the Northern Hemisphere, they spiral anticlockwise.

Over time, this rotating air organises into the shape of a mature cyclone. At the centre is the eye — a calm, clear area with little wind or rain. Surrounding the eye is the eyewall, which contains the storm's strongest winds and heaviest rainfall.

For a cyclone to keep growing, it needs continued access to warm water and steady winds at all heights in the atmosphere. When these conditions are in place, a storm can intensify rapidly. Category 5 cyclones, the most severe, produce winds above 280 km/h.

Australia's cyclone season runs from November to April. This is when ocean temperatures in the north are at their warmest. Queensland, the Northern Territory and Western Australia are the regions most at risk.`,

  L2: `Cyclones are powerful storms that form over warm tropical oceans, and they can cause serious damage to coastal communities with strong winds and heavy rain.

A cyclone begins when the Sun heats the surface of the ocean. The warm water heats the air above it, and this warm air begins to rise. As it rises, the air carries water vapour with it. Higher in the atmosphere, the air cools and the water vapour turns into clouds and rain. As this happens, heat is released, which warms more air and causes it to rise again. This cycle repeats over and over, making the storm grow stronger.

As the warm air rises, it leaves an area of lower pressure near the ocean's surface. Cooler air rushes in from the surrounding area to fill this gap. Because the Earth is constantly spinning, this incoming air does not move in a straight line — it begins to curve and spiral. In Australia and the Southern Hemisphere, cyclones spin in a clockwise direction.

Over time, this spinning air organises into the circular shape of a mature cyclone. In the very centre of the cyclone is a calm, quiet region called the eye, where winds are light and the sky may even be clear. Surrounding the eye is the most dangerous part of the storm, where the strongest winds and heaviest rainfall occur.

A cyclone grows stronger when it stays over warm ocean water, and it begins to weaken when it moves over land or cooler water. In Australia, cyclone season runs from November to April. The northern coastal areas of Queensland, the Northern Territory and Western Australia are most at risk.`,

  L3: `A cyclone is a big, spinning storm. It forms over warm ocean water. The warm water heats the air above it. The warm air rises up into the sky.

When the warm air rises, it leaves a gap. Cooler air rushes in to fill that gap. Because the Earth spins, the air starts to spin too. In Australia, cyclones spin in a clockwise direction.

The spinning air forms into a big circle. This is how a cyclone takes shape. In the middle of a cyclone is a calm area called the eye. The eye is quiet and still. Around the eye is the most dangerous part of the storm. This is where the strongest winds blow and the heaviest rain falls.

Cyclones need warm water to keep growing. The warmer the water, the stronger the storm can get. In Australia, cyclones happen between November and April. This is when the ocean in the north is warmest.

Parts of Queensland and the Northern Territory can be hit by cyclones. People in these areas need to be ready before the storm arrives. They make plans to keep their families safe during cyclone season.`
};

// ── Questions (no ans field — print only) ─────────────────────────────────────

const compL1 = [
  { q: "What is the minimum ocean surface temperature needed for a cyclone to form?", a: "20 degrees Celsius", b: "26.5 degrees Celsius", c: "30 degrees Celsius", d: "15 degrees Celsius" },
  { q: "What process releases extra heat as warm air rises and forms clouds?", a: "Evaporation", b: "Radiation", c: "Condensation", d: "Absorption" },
  { q: "What is the Coriolis effect?", a: "The way warm water heats the atmosphere", b: "The curving of moving air caused by the Earth's rotation", c: "The speed at which a cyclone forms", d: "The link between rainfall and low pressure" },
  { q: "In which direction do cyclones spiral in the Southern Hemisphere?", a: "Anticlockwise", b: "From east to west", c: "Clockwise", d: "From north to south" },
  { q: "What is the eyewall of a cyclone?", a: "The calm centre of the storm", b: "The outer bands of cloud", c: "A dense ring with the storm's strongest winds", d: "The zone of low pressure at the ocean surface" },
  { q: "What happens when a zone of low pressure forms near the ocean surface?", a: "Rain falls directly into the ocean", b: "Surrounding air rushes in to replace the rising warm air", c: "The eye of the cyclone forms immediately", d: "Wind shear increases dramatically" },
  { q: "What two conditions does a cyclone need to keep intensifying?", a: "Cold water and high winds", b: "Low pressure and anticlockwise rotation", c: "Warm water and steady winds at all heights", d: "Heavy rain and the Coriolis effect" },
  { q: "What wind speed do Category 5 cyclones produce?", a: "Above 180 km/h", b: "Above 200 km/h", c: "Above 240 km/h", d: "Above 280 km/h" },
  { q: "Why is the rising warm air cycle described as self-reinforcing?", a: "The Coriolis effect keeps the air spinning", b: "Condensation releases heat causing more air to rise", c: "Low pressure pulls clouds inward", d: "The eye stays calm while the storm grows" },
  { q: "What happens to a cyclone when it moves over land?", a: "It becomes a thunderstorm", b: "Its eye disappears", c: "It begins to weaken", d: "Its direction reverses" },
  { q: "Which regions does the text identify as most at risk in Australia?", a: "New South Wales, Victoria and Tasmania", b: "Queensland, the Northern Territory and Western Australia", c: "South Australia, Victoria and Western Australia", d: "Queensland, New South Wales and the Northern Territory" },
  { q: "What is the eye of a cyclone described as in the text?", a: "The most violent part of the storm", b: "A calm, clear area with little wind or rain", c: "A zone of extremely low temperature", d: "The source of the cyclone's energy" },
  { q: "Which factor most directly determines how powerful a cyclone becomes?", a: "The direction of the Coriolis effect", b: "The amount of rainfall produced", c: "The temperature and availability of warm ocean water", d: "The height of storm surges" },
  { q: "Why do cyclone rotation directions differ between hemispheres?", a: "Northern cyclones are faster", b: "Southern cyclones do not have an eye", c: "The Coriolis effect causes opposite spiral directions", d: "Northern cyclones form over cooler water" },
  { q: "Why does Australia's cyclone season run from November to April?", a: "Wind shear is lowest during this period", b: "The Coriolis effect is strongest in summer", c: "Ocean temperatures in the north are at their warmest", d: "Rainfall is highest during this period" },
];

const compL2 = [
  { q: "What type of water does a cyclone form over?", a: "Cold, deep ocean water", b: "Warm tropical ocean water", c: "Still freshwater lakes", d: "Cool coastal water" },
  { q: "What happens to warm air above the ocean?", a: "It sinks and cools the water", b: "It moves sideways across the ocean", c: "It rises and carries water vapour with it", d: "It stays near the surface" },
  { q: "What forms when the warm air rises and cools higher in the atmosphere?", a: "Ice and snow", b: "Clear sky", c: "Clouds and rain", d: "Strong sunshine" },
  { q: "Why does the air curve and spiral instead of moving in a straight line?", a: "Because of the heat released by clouds", b: "Because the ocean pushes it sideways", c: "Because the Earth is constantly spinning", d: "Because the eye of the cyclone pulls it inward" },
  { q: "In which direction do cyclones spin in Australia?", a: "Anticlockwise", b: "Clockwise", c: "From east to west", d: "From north to south" },
  { q: "What is the eye of a cyclone?", a: "The most dangerous part of the storm", b: "A calm, quiet region in the very centre", c: "The band of rain around the outside", d: "The zone where clouds first form" },
  { q: "Where is the most dangerous part of a cyclone found?", a: "In the eye", b: "On the outer edge of the storm", c: "Surrounding the eye", d: "At the ocean surface" },
  { q: "What happens to a cyclone when it moves over land or cooler water?", a: "It speeds up", b: "It grows larger", c: "It begins to weaken", d: "It changes direction" },
  { q: "When does cyclone season occur in Australia?", a: "March to September", b: "November to April", c: "June to October", d: "January to July" },
  { q: "Which coastal areas of Australia are most at risk from cyclones?", a: "Southern New South Wales and Victoria", b: "Tasmania and South Australia", c: "Northern Queensland, the NT and Western Australia", d: "The ACT and New South Wales" },
  { q: "What is released as water vapour turns into clouds and rain?", a: "Cold air", b: "Heat", c: "Pressure", d: "Wind" },
  { q: "What does the cycle of rising warm air do to the storm?", a: "It weakens the storm", b: "It causes the storm to grow stronger", c: "It pushes the storm toward land", d: "It creates the eye of the cyclone" },
  { q: "What gap is created as warm air rises from near the ocean's surface?", a: "An area of high pressure", b: "An area of lower pressure", c: "A region of calm air", d: "A break in the cloud cover" },
  { q: "Why does Australia experience most cyclones between November and April?", a: "Wind speeds are lower in summer", b: "The ocean in the north is at its warmest", c: "Rainfall is lower during this period", d: "The Earth spins faster in summer" },
  { q: "What is the main idea of this text?", a: "How to stay safe during a cyclone", b: "The damage cyclones cause to Australian towns", c: "How cyclones form and what conditions they need", d: "The history of cyclones in Queensland" },
];

const compL3 = [
  { q: "What is a cyclone?", a: "A big wave", b: "A big, spinning storm", c: "A type of rain cloud", d: "A strong river current" },
  { q: "What does a cyclone form over?", a: "Cold mountain air", b: "Dry desert land", c: "Warm ocean water", d: "Cool river water" },
  { q: "What happens to the warm air near the ocean?", a: "It sinks to the bottom", b: "It blows sideways", c: "It rises up into the sky", d: "It stays still" },
  { q: "What happens when the warm air rises and leaves a gap?", a: "The ocean gets colder", b: "Cooler air rushes in to fill it", c: "Clouds disappear", d: "Rain stops falling" },
  { q: "Why does the air start to spin?", a: "Because the water pushes it", b: "Because of lightning", c: "Because the Earth is always spinning", d: "Because the sun heats it" },
  { q: "In which direction do cyclones spin in Australia?", a: "Anticlockwise", b: "Up and down", c: "Clockwise", d: "Side to side" },
  { q: "What is the calm area in the middle of a cyclone called?", a: "The gap", b: "The cloud", c: "The centre hole", d: "The eye" },
  { q: "Where is the most dangerous part of a cyclone?", a: "In the eye", b: "At the ocean surface", c: "Around the eye", d: "At the top of the storm" },
  { q: "What do cyclones need to keep growing stronger?", a: "Cold water", b: "Dry land", c: "Warm water", d: "Sandy beaches" },
  { q: "What happens when a cyclone moves over land?", a: "It grows bigger", b: "It starts to weaken", c: "It spins faster", d: "It becomes a wave" },
  { q: "When do cyclones happen most often in Australia?", a: "March to September", b: "June to October", c: "November to April", d: "January to June" },
  { q: "Which parts of Australia can be hit by cyclones?", a: "Victoria and Tasmania", b: "Queensland and the Northern Territory", c: "Canberra and Sydney", d: "South Australia and Victoria" },
  { q: "What do people do to get ready before a cyclone arrives?", a: "They move to the beach", b: "They make plans to keep their families safe", c: "They plant more trees", d: "They go to school" },
  { q: "What does the warm water do to the air above it?", a: "It cools the air down", b: "It pushes the air sideways", c: "It heats the air up", d: "It makes the air still" },
  { q: "What is the main topic of this text?", a: "How to stay safe in storms", b: "The history of cyclones", c: "How cyclones form", d: "Why Australia has beaches" },
];

const mathsY5 = [
  { q: "What is 256 \u00f7 8?", a: "28", b: "32", c: "36", d: "24" },
  { q: "What is 432 \u00f7 6?", a: "62", b: "68", c: "72", d: "78" },
  { q: "What is 945 \u00f7 5?", a: "179", b: "185", c: "189", d: "191" },
  { q: "What is 364 \u00f7 7?", a: "48", b: "52", c: "56", d: "44" },
  { q: "What is 648 \u00f7 9?", a: "64", b: "72", c: "78", d: "68" },
  { q: "What is 2,448 \u00f7 4?", a: "512", b: "562", c: "612", d: "622" },
  { q: "What is 1,260 \u00f7 7?", a: "170", b: "175", c: "180", d: "185" },
  { q: "What is 3,375 \u00f7 9?", a: "365", b: "370", c: "375", d: "380" },
  { q: "What is 5,832 \u00f7 6?", a: "952", b: "962", c: "972", d: "982" },
  { q: "If 7 \u00d7 48 = 336, what is 336 \u00f7 7?", a: "42", b: "46", c: "48", d: "52" },
  { q: "If 9 \u00d7 56 = 504, what is 504 \u00f7 9?", a: "54", b: "56", c: "58", d: "60" },
  { q: "Which number makes this true? \u25a1 \u00d7 8 = 168", a: "19", b: "20", c: "21", d: "22" },
  { q: "Which number makes this true? \u25a1 \u00d7 6 = 426", a: "69", b: "70", c: "71", d: "72" },
  { q: "315 books shared equally among 9 classrooms. How many per classroom?", a: "30", b: "35", c: "40", d: "45" },
  { q: "A factory makes 1,248 items in 8 equal hours. How many per hour?", a: "146", b: "152", c: "156", d: "162" },
];

const mathsY34 = [
  { q: "What is 20 \u00f7 4?", a: "4", b: "5", c: "6", d: "8" },
  { q: "What is 35 \u00f7 5?", a: "5", b: "6", c: "7", d: "8" },
  { q: "What is 30 \u00f7 3?", a: "8", b: "9", c: "10", d: "11" },
  { q: "What is 80 \u00f7 10?", a: "6", b: "7", c: "8", d: "9" },
  { q: "What is 24 \u00f7 4?", a: "4", b: "5", c: "6", d: "7" },
  { q: "What is 45 \u00f7 5?", a: "7", b: "8", c: "9", d: "10" },
  { q: "What is 12 \u00f7 4?", a: "2", b: "3", c: "4", d: "5" },
  { q: "What is 50 \u00f7 10?", a: "3", b: "4", c: "5", d: "6" },
  { q: "What is 27 \u00f7 3?", a: "7", b: "8", c: "9", d: "10" },
  { q: "If 5 \u00d7 7 = 35, what is 35 \u00f7 5?", a: "5", b: "6", c: "7", d: "8" },
  { q: "If 4 \u00d7 8 = 32, what is 32 \u00f7 4?", a: "6", b: "7", c: "8", d: "9" },
  { q: "Which number makes this true? \u25a1 \u00d7 3 = 18", a: "4", b: "5", c: "6", d: "7" },
  { q: "Which number makes this true? \u25a1 \u00d7 5 = 40", a: "6", b: "7", c: "8", d: "9" },
  { q: "24 books shared among 4 students. How many each?", a: "4", b: "5", c: "6", d: "7" },
  { q: "30 lollies shared among 5 children. How many each?", a: "4", b: "5", c: "6", d: "7" },
];

// ── Config ────────────────────────────────────────────────────────────────────

const PAGE_W = 11906, PAGE_H = 16838;
const MARGIN = 1080; // 0.75 inch
const USABLE_W = PAGE_W - 2 * MARGIN;
const COL_W = Math.floor(USABLE_W / 2) - 80;
const TAB = Math.floor(USABLE_W / 2); // tab for full-width A+B line
const COL_TAB = Math.floor(COL_W / 2); // tab for column-width A+B line

const baseStyles = (bodyPt) => ({
  default: { document: { run: { font: 'Arial', size: bodyPt * 2 } } },
  paragraphStyles: [
    { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal',
      run: { size: (bodyPt + 2) * 2, bold: true, font: 'Arial' },
      paragraph: { spacing: { before: 0, after: 200 }, outlineLevel: 0 } },
  ]
});

// ── Reading paragraphs ────────────────────────────────────────────────────────

function readingParas(text, bodyPt) {
  const lineSpacing = Math.round(bodyPt * 20 * 1.3);
  return text.split('\n\n').map(para =>
    new Paragraph({
      spacing: { after: 140, line: lineSpacing, lineRule: 'auto' },
      children: [new TextRun({ text: para.replace(/\n/g, ' ').trim(), size: bodyPt * 2 })]
    })
  );
}

// ── Question paragraphs — full width (reading questions) ──────────────────────

function questionParas(questions, startNum, heading, tabStop) {
  const QS = 20; // 10pt
  const LINE = 200;
  const paras = [];

  if (heading) {
    paras.push(new Paragraph({
      spacing: { before: 200, after: 120 },
      children: [new TextRun({ text: heading, bold: true, size: 24, font: 'Arial' })]
    }));
  }

  questions.forEach((item, i) => {
    paras.push(new Paragraph({
      spacing: { before: 80, after: 20, line: LINE, lineRule: 'auto' },
      children: [new TextRun({ text: `${startNum + i}. ${item.q}`, bold: true, size: QS })]
    }));
    paras.push(new Paragraph({
      tabStops: [{ type: TabStopType.LEFT, position: tabStop }],
      spacing: { before: 0, after: 0, line: LINE, lineRule: 'auto' },
      children: [
        new TextRun({ text: `A. ${item.a}`, size: QS }),
        new TextRun({ text: `\tB. ${item.b}`, size: QS }),
      ]
    }));
    paras.push(new Paragraph({
      tabStops: [{ type: TabStopType.LEFT, position: tabStop }],
      spacing: { before: 0, after: 80, line: LINE, lineRule: 'auto' },
      border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'BBBBBB', space: 4 } },
      children: [
        new TextRun({ text: `C. ${item.c}`, size: QS }),
        new TextRun({ text: `\tD. ${item.d}`, size: QS }),
      ]
    }));
  });

  return paras;
}

// ── Build document ────────────────────────────────────────────────────────────

function buildPrint(text, compQ, mathQ, bodyPt) {
  const pageProps = { page: { size: { width: PAGE_W, height: PAGE_H }, margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN } } };

  const noBorder = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
  const makeCell = (paras) => new TableCell({
    width: { size: COL_W, type: WidthType.DXA },
    borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder },
    children: paras.length ? paras : [new Paragraph({ children: [] })]
  });

  // Maths: split 15 questions across two columns (8 left, 7 right)
  const mathsTable = new Table({
    columnWidths: [COL_W, COL_W],
    margins: { top: 0, bottom: 0, left: 0, right: 0 },
    rows: [new TableRow({ children: [
      makeCell(questionParas(mathQ.slice(0, 8), 1,  null, COL_TAB)),
      makeCell(questionParas(mathQ.slice(8),    9,  null, COL_TAB)),
    ]})]
  });

  return new Document({
    styles: baseStyles(bodyPt),
    sections: [{
      properties: pageProps,
      children: [
        // Reading text — full width
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(`Week 2 Homework \u2014 How Cyclones Form`)] }),
        ...readingParas(text, bodyPt),
        // Reading questions — full width, flow naturally across pages
        ...questionParas(compQ, 1, 'Reading Questions', TAB),
        // Maths heading — full width
        new Paragraph({
          spacing: { before: 260, after: 120 },
          children: [new TextRun({ text: 'Maths Questions', bold: true, size: 24, font: 'Arial' })]
        }),
        // Maths — two columns
        mathsTable,
      ]
    }]
  });
}

// ── Generate & save ───────────────────────────────────────────────────────────

function save(doc, filename) {
  Packer.toBuffer(doc).then(buf => {
    fs.writeFileSync(path.join(OUT, filename), buf);
    console.log(`Created: ${filename}`);
  });
}

save(buildPrint(texts.L1, compL1, mathsY5,  12), 'Week_02_Print_L1.docx');
save(buildPrint(texts.L2, compL2, mathsY5,  12), 'Week_02_Print_L2.docx');
save(buildPrint(texts.L3, compL3, mathsY34, 12), 'Week_02_Print_L3.docx');
