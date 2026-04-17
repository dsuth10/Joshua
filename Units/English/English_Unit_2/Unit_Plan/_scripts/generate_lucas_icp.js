const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, LevelFormat, BorderStyle, WidthType, ShadingType,
  VerticalAlign, HeadingLevel, PageOrientation, Header, Footer, PageNumber
} = require('docx');
const fs = require('fs');
const path = require('path');

const ACCENT   = '1F5C8B'; // deep Queensland blue
const ACCENT2  = 'E8521A'; // warm highlight orange
const LTBLUE   = 'D6E8F5';
const LTORANGE = 'FDEBD6';
const LTGREY   = 'F2F2F2';
const WHITE    = 'FFFFFF';
const DARK     = '1A1A2E';
const MID      = '4A4A6A';

const border = { style: BorderStyle.SINGLE, size: 4, color: ACCENT };
const thinBorder = { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' };
const cellB = { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder };
const noBorder = { style: BorderStyle.NONE, size: 0, color: WHITE };
const noCell = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

const cell = (children, opts = {}) => new TableCell({
  borders: opts.borders || cellB,
  width: opts.width || { size: opts.w || 4680, type: WidthType.DXA },
  shading: opts.shade ? { fill: opts.shade, type: ShadingType.CLEAR } : undefined,
  verticalAlign: opts.va || VerticalAlign.TOP,
  columnSpan: opts.span,
  children,
});

const para = (text, opts = {}) => new Paragraph({
  alignment: opts.align || AlignmentType.LEFT,
  spacing: { before: opts.before || 60, after: opts.after || 60 },
  numbering: opts.num,
  children: Array.isArray(text)
    ? text
    : [new TextRun({ text, bold: opts.bold, italics: opts.italic, color: opts.color || '000000',
        size: opts.size || 22, font: 'Arial' })],
});

const hdr = (text, size, color = DARK, after = 80, before = 120) => new Paragraph({
  spacing: { before, after },
  children: [new TextRun({ text, bold: true, size, color, font: 'Arial' })]
});

const label = (t) => new TextRun({ text: t, bold: true, size: 22, font: 'Arial', color: MID });
const plain = (t, opts = {}) => new TextRun({ text: t, size: 22, font: 'Arial', bold: opts.bold,
  italics: opts.italic, color: opts.color || '000000' });

// ─── NUMBERING CONFIG ─────────────────────────────────────────────────────────
const numbering = {
  config: [
    { reference: 'bullets', levels: [{ level: 0, format: LevelFormat.BULLET, text: '\u2022',
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 540, hanging: 360 },
          spacing: { before: 40, after: 40 } } } }] },
    { reference: 'numbered', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.',
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 540, hanging: 360 },
          spacing: { before: 40, after: 40 } } } }] },
    { reference: 'numbered2', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.',
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 540, hanging: 360 },
          spacing: { before: 40, after: 40 } } } }] },
    { reference: 'numbered3', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.',
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 540, hanging: 360 },
          spacing: { before: 40, after: 40 } } } }] },
  ]
};

const bp = (text) => new Paragraph({
  numbering: { reference: 'bullets', level: 0 },
  children: [new TextRun({ text, size: 22, font: 'Arial' })]
});

const np = (text, ref = 'numbered') => new Paragraph({
  numbering: { reference: ref, level: 0 },
  children: [new TextRun({ text, size: 22, font: 'Arial' })]
});

// ─── COLOUR BAND ROW ─────────────────────────────────────────────────────────
const bannerRow = (label1, col = ACCENT) => new TableRow({ children: [
  cell([para([new TextRun({ text: label1, bold: true, size: 24, color: WHITE, font: 'Arial' })])],
    { shade: col, w: 9360, span: 3, borders: noCell }),
]});

// ─── MARKING GUIDE TABLE ─────────────────────────────────────────────────────
const mkRow = (level, reading, writing, speaking, shade = WHITE) => new TableRow({ children: [
  cell([para([new TextRun({ text: level, bold: true, size: 22, font: 'Arial', color: ACCENT })])],
    { w: 900, shade, borders: cellB }),
  cell([para(reading)], { w: 2820, shade, borders: cellB }),
  cell([para(writing)], { w: 2820, shade, borders: cellB }),
  cell([para(speaking)], { w: 2820, shade, borders: cellB }),
]});

// ─── MONITORING TABLE ROW ────────────────────────────────────────────────────
const monRow = (descriptor, code) => new TableRow({ children: [
  cell([para(descriptor)], { w: 7200, borders: cellB }),
  cell([para('')], { w: 1080, borders: cellB }),
  cell([para('')], { w: 1080, borders: cellB }),
]});

// ─── SECTION DIVIDER ─────────────────────────────────────────────────────────
const divider = () => new Paragraph({
  spacing: { before: 160, after: 160 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 3, color: ACCENT } },
  children: [new TextRun({ text: '' })]
});

// ─── MAIN DOCUMENT ───────────────────────────────────────────────────────────
const doc = new Document({
  numbering,
  styles: {
    default: { document: { run: { font: 'Arial', size: 22, color: '000000' } } },
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: 1000, right: 1000, bottom: 1000, left: 1000 },
      }
    },
    headers: {
      default: new Header({ children: [
        new Table({
          columnWidths: [6960, 2400],
          margins: { top: 0, bottom: 0, left: 0, right: 0 },
          rows: [new TableRow({ children: [
            cell([para([
              new TextRun({ text: 'ICP 5\u20132  \u2022  Unit 2 English', bold: true, size: 20, font: 'Arial', color: WHITE })
            ])], { shade: ACCENT, w: 6960, borders: noCell }),
            cell([para([
              new TextRun({ text: 'Information Report', bold: false, size: 18, font: 'Arial', color: LTBLUE })
            ], { align: AlignmentType.RIGHT })], { shade: ACCENT, w: 2400, borders: noCell }),
          ]})]
        })
      ]})
    },
    footers: {
      default: new Footer({ children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: 'Year 5 English \u2014 Unit 2  |  Tarampa State School  |  Term 2, 2026  |  Page ', size: 18, font: 'Arial', color: MID }),
            new TextRun({ children: [PageNumber.CURRENT], size: 18, font: 'Arial', color: MID }),
          ]
        })
      ]})
    },
    children: [

      // ══════════════════════════════════════════════════════════════════════
      // TITLE BLOCK
      // ══════════════════════════════════════════════════════════════════════
      new Table({
        columnWidths: [9360],
        rows: [
          new TableRow({ children: [cell([
            new Paragraph({ spacing: { before: 100, after: 60 }, children: [
              new TextRun({ text: 'INDIVIDUAL CURRICULUM PLAN', bold: true, size: 20, font: 'Arial', color: LTBLUE })
            ]}),
            new Paragraph({ spacing: { before: 0, after: 80 }, children: [
              new TextRun({ text: 'Unit 2 \u2014 Information Report', bold: true, size: 36, font: 'Arial', color: WHITE })
            ]}),
            new Paragraph({ spacing: { before: 0, after: 100 }, children: [
              new TextRun({ text: 'Year 5 English  \u00b7  Australian Curriculum Version 9  \u00b7  Year 2 Achievement Level', size: 22, font: 'Arial', color: LTBLUE })
            ]}),
          ], { shade: ACCENT, w: 9360, borders: noCell })]})
        ]
      }),

      // Name / Class / Teacher / Date block
      new Paragraph({ spacing: { before: 160, after: 60 }, children: [new TextRun('')] }),
      new Table({
        columnWidths: [4320, 1080, 3240, 720],
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        rows: [new TableRow({ children: [
          cell([para([label('Name: '), plain('_______________________________')])], { w: 4320, borders: cellB }),
          cell([para([label('Class: ')])], { w: 1080, shade: LTBLUE, borders: cellB }),
          cell([para([plain('_______________')])], { w: 3240, borders: cellB }),
          cell([para('')], { w: 720, shade: LTBLUE, borders: cellB }),
        ]}),
        new TableRow({ children: [
          cell([para([label('Teacher: '), plain('_______________________________')])], { w: 4320, borders: cellB }),
          cell([para([label('Date: ')])], { w: 1080, shade: LTBLUE, borders: cellB }),
          cell([para([plain('_______________')])], { w: 3240, borders: cellB }),
          cell([para('')], { w: 720, shade: LTBLUE, borders: cellB }),
        ]})]
      }),

      divider(),

      // ══════════════════════════════════════════════════════════════════════
      // ABOUT THIS ASSESSMENT
      // ══════════════════════════════════════════════════════════════════════
      hdr('About This Assessment', 28, ACCENT),
      para([
        plain('This assessment task has been adjusted for '),
        plain('Lucas', { bold: true }),
        plain(', a Year 5 student working at approximately Year 2 level, as part of his Individual Curriculum Plan (ICP). '),
        plain('All three components of the Year 5 Unit 2 assessment are completed at the Year 2 achievement standard. '),
        plain('Lucas participates in the same learning sequence as his peers, using the same mentor texts ('),
        plain('Cyclone, Floods, Bushfires', { italic: true }),
        plain(' and '),
        plain('Earthquakes', { italic: true }),
        plain(' archives), but produces responses adjusted to his working level.'),
      ]),

      new Paragraph({ spacing: { before: 80, after: 80 }, children: [
        new TextRun({ text: 'Purpose: ', bold: true, size: 22, font: 'Arial', color: ACCENT }),
        new TextRun({ text: 'To identify the purpose and audience of an informative text and describe some of its features. To create a short written multimodal information report. To present a short information report to a familiar audience.',
          size: 22, font: 'Arial' })
      ]}),

      new Paragraph({ spacing: { before: 40, after: 80 }, children: [
        new TextRun({ text: 'Assessed against: ', bold: true, size: 22, font: 'Arial', color: ACCENT }),
        new TextRun({ text: 'Year 2 English Achievement Standard (Australian Curriculum V9)', size: 22, font: 'Arial' })
      ]}),

      divider(),

      // ══════════════════════════════════════════════════════════════════════
      // PART A — READING AND VIEWING
      // ══════════════════════════════════════════════════════════════════════
      new Table({ columnWidths: [9360], rows: [new TableRow({ children: [cell([
        new Paragraph({ spacing: { before: 80, after: 80 }, children: [
          new TextRun({ text: 'Part A: Reading and Viewing', bold: true, size: 28, font: 'Arial', color: WHITE })
        ]})
      ], { shade: ACCENT, w: 9360, borders: noCell })]})] }),

      para([plain('Read the informative text your teacher shows you (the '),
        plain('Earthquakes Archive', { bold: true }),
        plain(' hub page) and answer the questions below. Your teacher will help you read any tricky parts.')],
        { before: 120, after: 100 }),

      hdr('Main Ideas, Purpose and Audience', 24, ACCENT, 60, 120),

      np('What is this text about?', 'numbered'),
      para('Write or tell your teacher the topic of the text.', { color: MID, italic: true }),
      para('___________________________________________________________________________'),
      para('___________________________________________________________________________'),

      np('Who do you think would read this text? Circle your answer:', 'numbered'),
      para([plain('\u25a1  A young child learning to read     \u25a1  Students and people who want to learn about earthquakes     \u25a1  A sports coach')], { before: 60, after: 60 }),

      np('What is one fact you learned from the text?', 'numbered'),
      para('___________________________________________________________________________'),
      para('___________________________________________________________________________'),

      hdr('Text Structure and Features', 24, ACCENT, 60, 120),

      np('Find a heading in the text. Write it here:', 'numbered2'),
      para('___________________________________________________________________________'),

      np('What is this section about?', 'numbered2'),
      para('___________________________________________________________________________'),
      para('___________________________________________________________________________'),

      np('Find an image in the text. Draw or describe what you see.', 'numbered2'),
      new Paragraph({ spacing: { before: 40, after: 40 }, children: [
        new TextRun({ text: 'I can see: _____________________________________________________________________', size: 22, font: 'Arial' })
      ]}),
      new Paragraph({
        spacing: { before: 20, after: 100 },
        border: { bottom: { style: BorderStyle.DOTTED, size: 2, color: 'AAAAAA' } },
        children: [new TextRun({ text: '(Draw the image in the box below)', size: 20, font: 'Arial', color: MID, italics: true })]
      }),
      // Drawing box
      new Table({ columnWidths: [9360], rows: [new TableRow({ children: [
        cell([
          para('', { before: 1200, after: 1200 })
        ], { borders: { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder }, w: 9360 })
      ]})] }),

      np('Why did the author include this image? Circle your answer:', 'numbered2'),
      para([plain('\u25a1  To make the page look colourful     \u25a1  To show the reader extra information     \u25a1  Because it is a pretty picture')], { before: 60, after: 80 }),

      divider(),

      // ══════════════════════════════════════════════════════════════════════
      // PART B — WRITING AND CREATING
      // ══════════════════════════════════════════════════════════════════════
      new Paragraph({ children: [new TextRun('')], pageBreakBefore: true }),

      new Table({ columnWidths: [9360], rows: [new TableRow({ children: [cell([
        new Paragraph({ spacing: { before: 80, after: 80 }, children: [
          new TextRun({ text: 'Part B: Writing and Creating', bold: true, size: 28, font: 'Arial', color: WHITE })
        ]})
      ], { shade: ACCENT2, w: 9360, borders: noCell })]})] }),

      para([plain('You are going to write a short information report. You may choose '),
        plain('one', { bold: true }),
        plain(' of the natural disaster topics we have studied in class (Cyclones, Floods, Bushfires or Earthquakes).')],
        { before: 120, after: 100 }),

      hdr('Plan Your Text', 24, ACCENT2, 60, 100),

      np('My topic is:', 'numbered3'),
      para('___________________________________________________________________________', { after: 80 }),

      np('I am writing this for: (circle one)', 'numbered3'),
      para('\u25a1  My class     \u25a1  My family     \u25a1  Students at another school', { before: 60, after: 80 }),

      np('I will write about these three things:', 'numbered3'),
      new Paragraph({ spacing: { before: 40, after: 40 }, children: [new TextRun({
        text: '1. ___________________________________________________________________________', size: 22, font: 'Arial' })] }),
      new Paragraph({ spacing: { before: 40, after: 40 }, children: [new TextRun({
        text: '2. ___________________________________________________________________________', size: 22, font: 'Arial' })] }),
      new Paragraph({ spacing: { before: 40, after: 80 }, children: [new TextRun({
        text: '3. ___________________________________________________________________________', size: 22, font: 'Arial' })] }),

      np('I will include a picture of:', 'numbered3'),
      para('___________________________________________________________________________', { after: 60 }),

      hdr('Create Your Text', 24, ACCENT2, 60, 100),

      para([plain('Write your information report below. Use sentences. Try to include:')], { after: 40 }),
      bp('a title'),
      bp('a heading or subheading'),
      bp('three or more facts about your topic'),
      bp('topic words (words that belong to your topic)'),
      bp('simple and compound sentences'),
      bp('at least one image with a caption'),
      new Paragraph({ spacing: { before: 120, after: 40 }, children: [
        new TextRun({ text: 'Title: ', bold: true, size: 22, font: 'Arial' }),
        new TextRun({ text: '_____________________________________________________________________', size: 22, font: 'Arial' })
      ]}),

      // Writing lines
      ...Array.from({ length: 16 }, () => new Paragraph({
        spacing: { before: 20, after: 20 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' } },
        children: [new TextRun({ text: '', size: 28, font: 'Arial' })]
      })),

      hdr('Add a Picture', 24, ACCENT2, 60, 120),
      para('Draw or attach an image below. Write a caption (one sentence) to explain what the image shows.'),
      new Table({ columnWidths: [9360], rows: [new TableRow({ children: [
        cell([para('', { before: 1800, after: 1800 })],
          { borders: { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder }, w: 9360 })
      ]})] }),
      new Paragraph({ spacing: { before: 60, after: 80 }, children: [
        new TextRun({ text: 'Caption: ', bold: true, size: 22, font: 'Arial' }),
        new TextRun({ text: '_________________________________________________________________', size: 22, font: 'Arial' })
      ]}),

      para([plain('Review and edit your text. Check:')], { before: 80, after: 40 }),
      new Table({
        columnWidths: [720, 8640],
        margins: { top: 60, bottom: 60, left: 120, right: 120 },
        rows: [
          ...['Does every sentence start with a capital letter?',
              'Does every sentence end with a full stop?',
              'Did I use topic words?',
              'Did I use simple and compound sentences?',
              'Does my picture have a caption?'].map(t => new TableRow({ children: [
            cell([para('\u25a1')], { w: 720, borders: cellB }),
            cell([para(t)], { w: 8640, borders: cellB }),
          ]}))
        ]
      }),

      divider(),

      // ══════════════════════════════════════════════════════════════════════
      // PART C — SPEAKING AND LISTENING
      // ══════════════════════════════════════════════════════════════════════
      new Paragraph({ children: [new TextRun('')], pageBreakBefore: true }),

      new Table({ columnWidths: [9360], rows: [new TableRow({ children: [cell([
        new Paragraph({ spacing: { before: 80, after: 80 }, children: [
          new TextRun({ text: 'Part C: Speaking and Listening', bold: true, size: 28, font: 'Arial', color: WHITE })
        ]})
      ], { shade: DARK, w: 9360, borders: noCell })]})] }),

      para([plain('You are going to give a '),
        plain('short spoken presentation', { bold: true }),
        plain(' about your information report topic to a small, familiar audience (your teacher and 1\u20132 classmates).')],
        { before: 120, after: 100 }),

      hdr('Plan Your Presentation', 24, DARK, 60, 100),

      para('Use this frame to plan what you will say:'),
      new Paragraph({ spacing: { before: 40, after: 40 }, border: { bottom: thinBorder }, children: [
        new TextRun({ text: 'First I will say: _______________________________________________________________', size: 22, font: 'Arial' })
      ]}),
      new Paragraph({ spacing: { before: 40, after: 40 }, border: { bottom: thinBorder }, children: [
        new TextRun({ text: '________________________________________________________________________________', size: 22, font: 'Arial' })
      ]}),
      new Paragraph({ spacing: { before: 40, after: 40 }, border: { bottom: thinBorder }, children: [
        new TextRun({ text: 'Then I will say: _______________________________________________________________', size: 22, font: 'Arial' })
      ]}),
      new Paragraph({ spacing: { before: 40, after: 40 }, border: { bottom: thinBorder }, children: [
        new TextRun({ text: '________________________________________________________________________________', size: 22, font: 'Arial' })
      ]}),
      new Paragraph({ spacing: { before: 40, after: 40 }, border: { bottom: thinBorder }, children: [
        new TextRun({ text: 'At the end I will say: _________________________________________________________', size: 22, font: 'Arial' })
      ]}),
      new Paragraph({ spacing: { before: 40, after: 80 }, border: { bottom: thinBorder }, children: [
        new TextRun({ text: '________________________________________________________________________________', size: 22, font: 'Arial' })
      ]}),

      para('I will show these images or items to my audience:'),
      new Paragraph({ spacing: { before: 40, after: 40 }, border: { bottom: thinBorder }, children: [
        new TextRun({ text: '1. _____________________________________________________________________________', size: 22, font: 'Arial' })
      ]}),
      new Paragraph({ spacing: { before: 40, after: 80 }, border: { bottom: thinBorder }, children: [
        new TextRun({ text: '2. _____________________________________________________________________________', size: 22, font: 'Arial' })
      ]}),

      hdr('Rehearse', 24, DARK, 60, 100),
      para([plain('Practise your presentation with a partner. Your partner can help you check:')], { after: 40 }),
      bp('Can they hear and understand you?'),
      bp('Are you speaking at a good pace \u2014 not too fast or too slow?'),
      bp('Are you using a strong, clear voice?'),
      bp('Are you showing your image or prop at the right time?'),
      new Paragraph({ spacing: { before: 80, after: 40 }, children: [
        new TextRun({ text: 'My partner\u2019s name is: ', bold: true, size: 22, font: 'Arial' }),
        new TextRun({ text: '_______________________________________________', size: 22, font: 'Arial' })
      ]}),
      new Paragraph({ spacing: { before: 40, after: 80 }, children: [
        new TextRun({ text: 'One thing my partner told me to improve: ', bold: true, size: 22, font: 'Arial' }),
        new TextRun({ text: '________________________________', size: 22, font: 'Arial' })
      ]}),

      divider(),

      // ══════════════════════════════════════════════════════════════════════
      // MARKING GUIDE — Y2 ACHIEVEMENT STANDARD
      // ══════════════════════════════════════════════════════════════════════
      new Paragraph({ children: [new TextRun('')], pageBreakBefore: true }),

      hdr('Marking Guide \u2014 Year 2 Achievement Standard', 28, ACCENT, 80, 60),
      para([plain('All judgements are made against the '), plain('Year 2 English achievement standard', { bold: true }),
        plain(' (Australian Curriculum V9). Special provisions apply as per Lucas\u2019s ICP.')]),

      new Table({
        columnWidths: [900, 2820, 2820, 2820],
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        rows: [
          new TableRow({ tableHeader: true, children: [
            cell([para([new TextRun({ text: 'Level', bold: true, size: 20, font: 'Arial', color: WHITE })])],
              { shade: ACCENT, w: 900, borders: cellB, va: VerticalAlign.CENTER }),
            cell([para([new TextRun({ text: 'Reading and Viewing', bold: true, size: 20, font: 'Arial', color: WHITE })])],
              { shade: ACCENT, w: 2820, borders: cellB }),
            cell([para([new TextRun({ text: 'Writing and Creating', bold: true, size: 20, font: 'Arial', color: WHITE })])],
              { shade: ACCENT, w: 2820, borders: cellB }),
            cell([para([new TextRun({ text: 'Speaking and Listening', bold: true, size: 20, font: 'Arial', color: WHITE })])],
              { shade: ACCENT, w: 2820, borders: cellB }),
          ]}),
          mkRow('Applying',
            'Identifies the purpose and audience of the informative text. Identifies the main ideas and supporting details. Explains how a heading and an image contribute to meaning.',
            'Creates a short informative text with a title, heading, 3 or more facts and a labelled image. Uses simple and compound sentences and topic-specific vocabulary. Edits for capital letters and full stops.',
            'Shares ideas and topic knowledge about the chosen natural disaster. Organises and links ideas in a logical sequence (opening, middle, closing). Varies tone and volume. Uses topic-specific vocabulary.',
            LTBLUE),
          mkRow('Connecting',
            'Identifies the purpose and audience of the informative text. Locates the main idea and 1\u20132 facts. Describes how a heading or image helps the reader.',
            'Creates a short informative text with a title, a heading, 2 or more facts and an image. Uses simple and compound sentences and topic words. Attempts editing for capital letters and full stops.',
            'Shares ideas and topic knowledge about the chosen natural disaster. Organises ideas with an opening and middle. Uses topic-specific vocabulary and varies voice features.',
            WHITE),
          mkRow('Working with',
            'Identifies the topic and purpose of the informative text with support. Locates one fact. Names a structural feature (heading or image).',
            'Creates a short informative text with a title and 1\u20132 facts. Uses simple sentences and some topic words. Attempts to include an image.',
            'Shares ideas and topic knowledge about the chosen natural disaster, with prompting. Uses topic-specific vocabulary. Speaks in simple sentences.',
            LTBLUE),
          mkRow('Exploring',
            'Identifies the topic of the informative text. Locates one feature (heading or image) with teacher support.',
            'Creates a text with a title and a statement about the topic. May include an image. Uses words and simple sentences.',
            'Shares a preference or a fact about the chosen natural disaster. Uses simple words and phrases.',
            WHITE),
          mkRow('Beginning',
            'Views the informative text and makes a statement about the topic.',
            'Creates a label or simple sentence about the topic.',
            'Shares an idea about the natural disaster topic using simple words.',
            LTBLUE),
        ]
      }),

      new Paragraph({ spacing: { before: 160, after: 60 }, children: [
        new TextRun({ text: 'Teacher Judgement: ', bold: true, size: 22, font: 'Arial', color: ACCENT }),
        new TextRun({ text: '___________________________', size: 22, font: 'Arial' }),
        new TextRun({ text: '       Date: ', bold: true, size: 22, font: 'Arial', color: ACCENT }),
        new TextRun({ text: '___________________________', size: 22, font: 'Arial' })
      ]}),

      new Paragraph({ spacing: { before: 60, after: 60 }, children: [
        new TextRun({ text: 'Feedback: ', bold: true, size: 22, font: 'Arial', color: ACCENT }),
      ]}),

      ...Array.from({ length: 5 }, () => new Paragraph({
        spacing: { before: 20, after: 20 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' } },
        children: [new TextRun({ text: '', size: 28, font: 'Arial' })]
      })),

      divider(),

      // ══════════════════════════════════════════════════════════════════════
      // MONITORING STRATEGIES
      // ══════════════════════════════════════════════════════════════════════
      hdr('Monitoring Strategies', 26, ACCENT, 80, 120),

      new Table({
        columnWidths: [7200, 1080, 1080],
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        rows: [
          new TableRow({ tableHeader: true, children: [
            cell([para([new TextRun({ text: 'Year 2 Content Descriptor', bold: true, size: 20, font: 'Arial', color: WHITE })])],
              { shade: ACCENT, w: 7200, borders: cellB }),
            cell([para([new TextRun({ text: 'Demonstrating', bold: true, size: 20, font: 'Arial', color: WHITE })])],
              { shade: ACCENT, w: 1080, borders: cellB }),
            cell([para([new TextRun({ text: 'Not Yet', bold: true, size: 20, font: 'Arial', color: WHITE })])],
              { shade: ACCENT, w: 1080, borders: cellB }),
          ]}),
          ...([
            ['AC9E2LA03 \u2014 Identify how texts are organised differently depending on purposes', ''],
            ['AC9E2LA07 \u2014 Understand that nouns may be extended into noun groups using articles and adjectives', ''],
            ['AC9E2LA08 \u2014 Understand that images add to or multiply the meanings of a text', ''],
            ['AC9E2LA09 \u2014 Experiment with and begin to make conscious choices of vocabulary to suit the topic', ''],
            ['AC9E2LA06 \u2014 Understand that connections can be made between ideas using a compound sentence', ''],
            ['AC9E2LY01 \u2014 Identify how similar topics and information are presented in different types of texts', ''],
            ['AC9E2LY03 \u2014 Identify the purpose and audience of informative texts', ''],
            ['AC9E2LY05 \u2014 Use comprehension strategies to build literal and inferred meaning', ''],
            ['AC9E2LY06 \u2014 Create and edit short informative written/multimodal texts for familiar audiences', ''],
            ['AC9E2LY07 \u2014 Create, rehearse and deliver short oral/multimodal presentations for familiar audiences', ''],
          ].map(([descriptor]) => new TableRow({ children: [
            cell([para(descriptor)], { w: 7200, borders: cellB }),
            cell([para('')], { w: 1080, borders: cellB }),
            cell([para('')], { w: 1080, borders: cellB }),
          ]})))
        ]
      }),

      new Paragraph({ spacing: { before: 120, after: 40 }, children: [
        new TextRun({ text: 'Special Provisions Applied: ', bold: true, size: 22, font: 'Arial', color: ACCENT }),
      ]}),
      bp('Teacher reads Part A text aloud; student may respond orally'),
      bp('Sentence starters and writing scaffolds provided for Part B'),
      bp('Part C delivered to a small, familiar audience (teacher + 1\u20132 peers)'),
      bp('SSO support available throughout'),
      bp('Extended time may be provided where required'),
      new Paragraph({ spacing: { before: 80, after: 40 }, children: [
        new TextRun({ text: '\u2605  ', size: 22, font: 'Arial', color: ACCENT2 }),
        new TextRun({ text: 'Special provisions reflect differentiation or adjustments made to curriculum delivery. They are not adjustments to the relevant achievement standard on which student work is judged (DoE 2018, p. 3).',
          size: 20, font: 'Arial', italics: true, color: MID })
      ]}),
    ]
  }]
});

const outPath = path.join(__dirname, '..', 'Lucas_Unit2_Information_Text_ICP.docx');
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(outPath, buf);
  console.log('Created:', outPath);
});
