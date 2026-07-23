const fs = require('fs');
const path = require('path');
const {
  AlignmentType, BorderStyle, Document, Footer, Header, LevelFormat,
  PageBreak, PageNumber, Packer, Paragraph, ShadingType, Table,
  TableCell, TableLayoutType, TableRow, TextRun, VerticalAlign, WidthType,
} = require('docx');

const lessonDir = path.resolve(__dirname, '..');
const planPath = path.join(lessonDir, 'Lesson_7_Plan.md');
const htmlPath = path.join(lessonDir, 'Lesson_7_Presentation.html');
const handoutPath = path.join(lessonDir, 'Lesson_7_Handout.docx');
const supportPath = path.join(lessonDir, 'Lesson_7_Support_Handout.docx');

const C = {
  ink: '102A45',      // Deep navy ink
  navy: '0D223A',     // Dominant primary header navy
  slate: '2B4C6F',    // Slate blue secondary
  gold: 'D99B26',     // Warm accent gold
  cream: 'FFFBF2',    // Cream background highlight
  pale: 'F0F4F8',     // Light slate wash
  white: 'FFFFFF',    // White
  smoke: '506275',    // Muted text
  line: 'B8C7D6',     // Border line
  good: '1B7A4B',     // Success green
  amber: 'C86D24',    // Warn amber
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
    style: level === 1 ? 'Lesson7Heading1' : 'Lesson7Heading2',
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
        id: 'Lesson7Heading1', name: 'Lesson 7 Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { font: 'Arial', bold: true, size: 30, color: C.navy },
        paragraph: { spacing: { before: 240, after: 100 }, keepNext: true },
      },
      {
        id: 'Lesson7Heading2', name: 'Lesson 7 Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { font: 'Arial', bold: true, size: 24, color: C.slate },
        paragraph: { spacing: { before: 200, after: 80 }, keepNext: true },
      },
    ],
  };
}

function makeHeaderFooter(title) {
  return {
    headers: {
      default: new Header({
        children: [
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({ text: `English Unit 3 | ${title}`, font: 'Arial', size: 18, color: C.smoke, bold: true }),
            ],
          }),
        ],
      }),
    },
    footers: {
      default: new Footer({
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: 'Page ', font: 'Arial', size: 18, color: C.smoke }),
              new TextRun({ children: [PageNumber.CURRENT], font: 'Arial', size: 18, color: C.smoke }),
              new TextRun({ text: ' of ', font: 'Arial', size: 18, color: C.smoke }),
              new TextRun({ children: [PageNumber.TOTAL_PAGES], font: 'Arial', size: 18, color: C.smoke }),
            ],
          }),
        ],
      }),
    },
  };
}

// Build Standard Handout
function buildStandardHandout() {
  const doc = new Document({
    styles: documentStyles(22),
    sections: [{
      properties: {
        page: {
          margin: { top: 1152, bottom: 1152, left: 1152, right: 1152 }, // 0.8 inch
        },
      },
      ...makeHeaderFooter('Lesson 7: Spaces and Displacement'),
      children: [
        // Title Header Table
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: borders(C.navy, 12),
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  shading: { fill: C.navy, type: ShadingType.CLEAR },
                  padding: { top: 160, bottom: 160, left: 200, right: 200 },
                  children: [
                    para('BERANI • LESSON 7 STUDENT HANDOUT', { bold: true, color: C.gold, size: 18 }),
                    para('Spaces and Displacement', { bold: true, color: C.white, size: 36 }),
                    para('Analyzing how setting reveals privilege, contrast, and character motivation in Ari\'s chapter (pp. 29–33)', { color: C.pale, size: 20 }),
                  ],
                }),
              ],
            }),
          ],
        }),

        para(' '), // spacing

        // Student Info Block
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: borders(C.line, 4),
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 50, type: WidthType.PERCENTAGE },
                  padding: { top: 80, bottom: 80, left: 120, right: 120 },
                  children: [para('Name: __________________________', { bold: true, size: 20 })],
                }),
                new TableCell({
                  width: { size: 50, type: WidthType.PERCENTAGE },
                  padding: { top: 80, bottom: 80, left: 120, right: 120 },
                  children: [para('Date: __________________________', { bold: true, size: 20 })],
                }),
              ],
            }),
          ],
        }),

        heading('Task 1: Setting & Environment Quote Collector (pp. 29–33)', 1),
        para('As you read pages 29–33 of Berani, record key text details that describe the contrast between Ari\'s public school and the private school SMP in Surabaya.', { italic: true, color: C.smoke }),

        // Quote Table
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: borders(C.line, 6),
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  shading: { fill: C.slate, type: ShadingType.CLEAR },
                  width: { size: 30, type: WidthType.PERCENTAGE },
                  padding: { top: 100, bottom: 100, left: 120, right: 120 },
                  children: [para('Setting / Threshold', { bold: true, color: C.white, size: 20 })],
                }),
                new TableCell({
                  shading: { fill: C.slate, type: ShadingType.CLEAR },
                  width: { size: 70, type: WidthType.PERCENTAGE },
                  padding: { top: 100, bottom: 100, left: 120, right: 120 },
                  children: [para('Direct Text Detail or Quote (with page no.)', { bold: true, color: C.white, size: 20 })],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  padding: { top: 120, bottom: 120, left: 120, right: 120 },
                  children: [para('1. Ari\'s Public School (Normal Reality)', { bold: true, size: 20 })],
                }),
                new TableCell({
                  padding: { top: 120, bottom: 120, left: 120, right: 120 },
                  children: [
                    para('"At our school you can\'t walk in the halls without bumping shoulders with other students." (p. 30)', { italic: true, size: 20 }),
                    para('Significance: Highlights density, lack of space, and lack of funding/resources.', { size: 18, color: C.smoke }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  padding: { top: 120, bottom: 120, left: 120, right: 120 },
                  children: [para('2. SMP Private School Arrival & Gardens', { bold: true, size: 20 })],
                }),
                new TableCell({
                  padding: { top: 120, bottom: 120, left: 120, right: 120 },
                  children: [
                    para('Quote detail:', { bold: true, size: 18, color: C.smoke }),
                    para('__________________________________________________________________________', { color: C.line }),
                    para('__________________________________________________________________________', { color: C.line }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  padding: { top: 120, bottom: 120, left: 120, right: 120 },
                  children: [para('3. Malia Encounter & Atmosphere', { bold: true, size: 20 })],
                }),
                new TableCell({
                  padding: { top: 120, bottom: 120, left: 120, right: 120 },
                  children: [
                    para('Quote detail:', { bold: true, size: 18, color: C.smoke }),
                    para('__________________________________________________________________________', { color: C.line }),
                    para('__________________________________________________________________________', { color: C.line }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  padding: { top: 120, bottom: 120, left: 120, right: 120 },
                  children: [para('4. Games Room & Opponents\' Attitude', { bold: true, size: 20 })],
                }),
                new TableCell({
                  padding: { top: 120, bottom: 120, left: 120, right: 120 },
                  children: [
                    para('Quote detail:', { bold: true, size: 18, color: C.smoke }),
                    para('__________________________________________________________________________', { color: C.line }),
                    para('__________________________________________________________________________', { color: C.line }),
                  ],
                }),
              ],
            }),
          ],
        }),

        heading('Task 2: Space-to-Mind Analytical Matrix', 1),
        para('Analyze how physical space creates a psychological effect on Ari and shapes his motivation.', { italic: true, color: C.smoke }),

        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: borders(C.line, 6),
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  shading: { fill: C.navy, type: ShadingType.CLEAR },
                  width: { size: 33, type: WidthType.PERCENTAGE },
                  padding: { top: 100, bottom: 100, left: 120, right: 120 },
                  children: [para('Physical Setting Detail', { bold: true, color: C.gold, size: 20 })],
                }),
                new TableCell({
                  shading: { fill: C.navy, type: ShadingType.CLEAR },
                  width: { size: 33, type: WidthType.PERCENTAGE },
                  padding: { top: 100, bottom: 100, left: 120, right: 120 },
                  children: [para('What Privilege It Reveals', { bold: true, color: C.gold, size: 20 })],
                }),
                new TableCell({
                  shading: { fill: C.navy, type: ShadingType.CLEAR },
                  width: { size: 34, type: WidthType.PERCENTAGE },
                  padding: { top: 100, bottom: 100, left: 120, right: 120 },
                  children: [para('Impact on Ari\'s Mindset', { bold: true, color: C.gold, size: 20 })],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  padding: { top: 100, bottom: 100, left: 100, right: 100 },
                  children: [para('"Wide walkways and gardens... luxury of space and beauty"', { italic: true, size: 19 })],
                }),
                new TableCell({
                  padding: { top: 100, bottom: 100, left: 100, right: 100 },
                  children: [para('Wealthy schools can afford land, landscaping, and calm environments.', { size: 19 })],
                }),
                new TableCell({
                  padding: { top: 100, bottom: 100, left: 100, right: 100 },
                  children: [para('Makes Ari feel initial awe and displacement, but slows his step to observe.', { size: 19 })],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  padding: { top: 100, bottom: 100, left: 100, right: 100 },
                  children: [para('"These affluent players do not care so much... not hungry for the win"', { italic: true, size: 19 })],
                }),
                new TableCell({
                  padding: { top: 100, bottom: 100, left: 100, right: 100 },
                  children: [para('Wealthy students don\'t need prize money to improve their lives.', { size: 19 })],
                }),
                new TableCell({
                  padding: { top: 100, bottom: 100, left: 100, right: 100 },
                  children: [para('Creates Ari\'s hidden advantage: his determination and hunger make him sharper.', { size: 19 })],
                }),
              ],
            }),
          ],
        }),

        new PageBreak(),

        heading('Task 3: Comparative Analysis Writing Studio', 1),
        para('Question: How does the setting of SMP Surabaya create a sense of displacement for Ari, and how does he transform that feeling into a personal advantage?', { bold: true, color: C.navy, size: 22 }),
        para('Writing Guidelines: Write a 5–7 sentence structured paragraph. Include at least 2 quotes, comparative connectors (in contrast, whereas, consequently), and explain one language choice.', { italic: true, color: C.smoke, size: 19 }),

        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: borders(C.line, 6),
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  shading: { fill: C.cream, type: ShadingType.CLEAR },
                  padding: { top: 140, bottom: 140, left: 160, right: 160 },
                  children: [
                    para('Useful Connector Bank:', { bold: true, color: C.navy, size: 18 }),
                    para('• Contrast: In contrast to ..., Whereas Ari\'s public school ..., Unlike the affluent SMP students ...', { size: 18, color: C.smoke }),
                    para('• Analysis & Effect: This physical difference reveals ..., The phrase "..." emphasizes ..., Consequently ...', { size: 18, color: C.smoke }),
                  ],
                }),
              ],
            }),
          ],
        }),

        para(' '),

        // Writing Lines Box
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: borders(C.slate, 8),
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  padding: { top: 160, bottom: 160, left: 160, right: 160 },
                  children: [
                    para('___________________________________________________________________________________', { color: C.line }),
                    para('___________________________________________________________________________________', { color: C.line }),
                    para('___________________________________________________________________________________', { color: C.line }),
                    para('___________________________________________________________________________________', { color: C.line }),
                    para('___________________________________________________________________________________', { color: C.line }),
                    para('___________________________________________________________________________________', { color: C.line }),
                    para('___________________________________________________________________________________', { color: C.line }),
                    para('___________________________________________________________________________________', { color: C.line }),
                    para('___________________________________________________________________________________', { color: C.line }),
                    para('___________________________________________________________________________________', { color: C.line }),
                  ],
                }),
              ],
            }),
          ],
        }),

        heading('Task 4: Peer Chain Audit & Exit Evidence', 1),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: borders(C.line, 6),
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  shading: { fill: C.pale, type: ShadingType.CLEAR },
                  width: { size: 50, type: WidthType.PERCENTAGE },
                  padding: { top: 120, bottom: 120, left: 120, right: 120 },
                  children: [
                    para('Peer Review Checklist (Partner Check):', { bold: true, color: C.navy, size: 20 }),
                    para('[  ] Contains 2 direct quotes from pp. 29–33', { size: 18 }),
                    para('[  ] Explains physical contrast (public vs private)', { size: 18 }),
                    para('[  ] Uses comparative connectors (in contrast, whereas)', { size: 18 }),
                    para('[  ] Explains Ari\'s change in mindset', { size: 18 }),
                  ],
                }),
                new TableCell({
                  shading: { fill: C.white, type: ShadingType.CLEAR },
                  width: { size: 50, type: WidthType.PERCENTAGE },
                  padding: { top: 120, bottom: 120, left: 120, right: 120 },
                  children: [
                    para('Exit Ticket Sentence Completion:', { bold: true, color: C.navy, size: 20 }),
                    para('The contrast in physical space between Ari\'s school and SMP reveals that privilege is _____________________, while Ari\'s response proves that _____________________.', { italic: true, size: 18 }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }],
  });
  return doc;
}

// Build Differentiated Support Handout
function buildSupportHandout() {
  const doc = new Document({
    styles: documentStyles(22),
    sections: [{
      properties: {
        page: {
          margin: { top: 1152, bottom: 1152, left: 1152, right: 1152 },
        },
      },
      ...makeHeaderFooter('Lesson 7: Spaces and Displacement (Support)'),
      children: [
        // Title Header Table
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: borders(C.slate, 12),
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  shading: { fill: C.slate, type: ShadingType.CLEAR },
                  padding: { top: 160, bottom: 160, left: 200, right: 200 },
                  children: [
                    para('BERANI • LESSON 7 SUPPORT HANDOUT', { bold: true, color: C.gold, size: 18 }),
                    para('Spaces and Displacement (Guided Path)', { bold: true, color: C.white, size: 34 }),
                    para('Guided quote analysis and paragraph frames for Ari\'s chapter (pp. 29–33)', { color: C.pale, size: 20 }),
                  ],
                }),
              ],
            }),
          ],
        }),

        para(' '),

        // Student Info Block
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: borders(C.line, 4),
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 50, type: WidthType.PERCENTAGE },
                  padding: { top: 80, bottom: 80, left: 120, right: 120 },
                  children: [para('Name: __________________________', { bold: true, size: 20 })],
                }),
                new TableCell({
                  width: { size: 50, type: WidthType.PERCENTAGE },
                  padding: { top: 80, bottom: 80, left: 120, right: 120 },
                  children: [para('Date: __________________________', { bold: true, size: 20 })],
                }),
              ],
            }),
          ],
        }),

        heading('Task 1: Guided Quote Match (pp. 29–33)', 1),
        para('Match each quote from the text with the setting feature it describes by drawing a line.', { italic: true, color: C.smoke }),

        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: borders(C.line, 6),
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  shading: { fill: C.navy, type: ShadingType.CLEAR },
                  width: { size: 50, type: WidthType.PERCENTAGE },
                  padding: { top: 100, bottom: 100, left: 120, right: 120 },
                  children: [para('Direct Text Quote', { bold: true, color: C.white, size: 20 })],
                }),
                new TableCell({
                  shading: { fill: C.navy, type: ShadingType.CLEAR },
                  width: { size: 50, type: WidthType.PERCENTAGE },
                  padding: { top: 100, bottom: 100, left: 120, right: 120 },
                  children: [para('Setting Meaning / Effect', { bold: true, color: C.white, size: 20 })],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  padding: { top: 100, bottom: 100, left: 100, right: 100 },
                  children: [para('1. "At our school you can\'t walk in the halls without bumping shoulders..."', { italic: true, size: 19 })],
                }),
                new TableCell({
                  padding: { top: 100, bottom: 100, left: 100, right: 100 },
                  children: [para('A. Reveals that the wealthy players do not urgently need the prize money.', { size: 19 })],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  padding: { top: 100, bottom: 100, left: 100, right: 100 },
                  children: [para('2. "Here the wide walkways and gardens give a glimpse of a much different experience..."', { italic: true, size: 19 })],
                }),
                new TableCell({
                  padding: { top: 100, bottom: 100, left: 100, right: 100 },
                  children: [para('B. Shows how crowded and noisy Ari\'s public school is every day.', { size: 19 })],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  padding: { top: 100, bottom: 100, left: 100, right: 100 },
                  children: [para('3. "These affluent players do not care so much about the tournament... not hungry for the win."', { italic: true, size: 19 })],
                }),
                new TableCell({
                  padding: { top: 100, bottom: 100, left: 100, right: 100 },
                  children: [para('C. Shows the luxury, beauty, and open space of the private school SMP.', { size: 19 })],
                }),
              ],
            }),
          ],
        }),

        heading('Task 2: Guided Sentence Frame Writing', 1),
        para('Complete the sentence frames to write your comparative paragraph.', { italic: true, color: C.smoke }),

        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: borders(C.slate, 8),
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  shading: { fill: C.cream, type: ShadingType.CLEAR },
                  padding: { top: 160, bottom: 160, left: 160, right: 160 },
                  children: [
                    para('1. At Ari\'s public school, the setting is described as __________________________________________________.', { size: 19 }),
                    para('2. In contrast, when Ari arrives at SMP Surabaya, he notices __________________________________________________.', { size: 19 }),
                    para('3. The author uses the words "luxury of space and beauty" to show that SMP is _____________________________________.', { size: 19 }),
                    para('4. Even though Ari feels displaced at first, he notices that the private school players are "not hungry for the win" because __________________________________________________.', { size: 19 }),
                    para('5. Therefore, Ari turns this setting difference into an advantage by __________________________________________________.', { size: 19 }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }],
  });
  return doc;
}

async function generate() {
  console.log('Generating Lesson 7 Handouts...');

  const standardDoc = buildStandardHandout();
  const standardBuffer = await Packer.toBuffer(standardDoc);
  fs.writeFileSync(handoutPath, standardBuffer);
  console.log(`Created: ${handoutPath}`);

  const supportDoc = buildSupportHandout();
  const supportBuffer = await Packer.toBuffer(supportDoc);
  fs.writeFileSync(supportPath, supportBuffer);
  console.log(`Created: ${supportPath}`);

  console.log('Done generating handouts.');
}

generate().catch(err => {
  console.error('Error generating handouts:', err);
  process.exit(1);
});
