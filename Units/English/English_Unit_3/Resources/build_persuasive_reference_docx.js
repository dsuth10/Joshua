const fs = require('fs');
const path = require('path');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  Header,
  Footer,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
  WidthType,
  ShadingType,
  VerticalAlign,
  PageNumber,
  PageBreak,
  LevelFormat
} = require('docx');

// Usable width for A4 (11906 DXA) with 1440 DXA margins = 9026 DXA
const PAGE_WIDTH = 9026;
const PRIMARY_COLOR = '1B365D'; // Navy
const SECONDARY_COLOR = '007A78'; // Teal
const ACCENT_COLOR = 'C05621'; // Warm Amber/Rust
const TEXT_COLOR = '2D3748';
const LIGHT_BG = 'F0F7FA';
const ALT_ROW_BG = 'F8FAFC';
const HEADER_BG = '1B365D';
const BORDER_COLOR = 'CBD5E0';

const thinBorder = { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR };
const cellBorders = { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder };
const calloutBorder = {
  left: { style: BorderStyle.SINGLE, size: 24, color: SECONDARY_COLOR },
  top: { style: BorderStyle.NONE, size: 0, color: 'auto' },
  bottom: { style: BorderStyle.NONE, size: 0, color: 'auto' },
  right: { style: BorderStyle.NONE, size: 0, color: 'auto' }
};

function createHeaderCell(text, width) {
  return new TableCell({
    borders: cellBorders,
    width: { size: width, type: WidthType.DXA },
    shading: { fill: HEADER_BG, type: ShadingType.CLEAR },
    verticalAlign: VerticalAlign.CENTER,
    children: [
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { before: 80, after: 80 },
        children: [
          new TextRun({
            text,
            bold: true,
            size: 19,
            color: 'FFFFFF',
            font: 'Arial'
          })
        ]
      })
    ]
  });
}

function createDataCell(content, width, isAlt = false, isBold = false) {
  const paragraphs = Array.isArray(content) ? content : [content];
  return new TableCell({
    borders: cellBorders,
    width: { size: width, type: WidthType.DXA },
    shading: isAlt ? { fill: ALT_ROW_BG, type: ShadingType.CLEAR } : undefined,
    verticalAlign: VerticalAlign.TOP,
    children: paragraphs.map(p => {
      if (typeof p === 'string') {
        return new Paragraph({
          spacing: { before: 60, after: 60 },
          children: [
            new TextRun({
              text: p,
              size: 18,
              bold: isBold,
              color: TEXT_COLOR,
              font: 'Arial'
            })
          ]
        });
      }
      return p;
    })
  });
}

function createSectionHeading(title, subtitle) {
  const items = [
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 280, after: 80 },
      children: [
        new TextRun({
          text: title,
          bold: true,
          size: 28,
          color: PRIMARY_COLOR,
          font: 'Arial'
        })
      ]
    })
  ];
  if (subtitle) {
    items.push(
      new Paragraph({
        spacing: { before: 0, after: 140 },
        children: [
          new TextRun({
            text: subtitle,
            italics: true,
            size: 19,
            color: '5A6A80',
            font: 'Arial'
          })
        ]
      })
    );
  }
  return items;
}

function createCallout(title, bodyLines) {
  const children = [
    new Paragraph({
      spacing: { before: 40, after: 60 },
      children: [
        new TextRun({
          text: title,
          bold: true,
          size: 20,
          color: SECONDARY_COLOR,
          font: 'Arial'
        })
      ]
    })
  ];

  bodyLines.forEach(line => {
    children.push(
      new Paragraph({
        spacing: { before: 40, after: 40 },
        children: [
          new TextRun({
            text: line,
            size: 18,
            color: TEXT_COLOR,
            font: 'Arial'
          })
        ]
      })
    );
  });

  return new Table({
    columnWidths: [PAGE_WIDTH],
    margins: { top: 120, bottom: 120, left: 180, right: 180 },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: calloutBorder,
            width: { size: PAGE_WIDTH, type: WidthType.DXA },
            shading: { fill: LIGHT_BG, type: ShadingType.CLEAR },
            children
          })
        ]
      })
    ]
  });
}

// 4-column table generator
function createTechniqueTable(colWidths, headers, rowData) {
  const rows = [
    new TableRow({
      tableHeader: true,
      children: headers.map((h, i) => createHeaderCell(h, colWidths[i]))
    })
  ];

  rowData.forEach((row, rowIndex) => {
    const isAlt = rowIndex % 2 === 1;
    const cells = row.map((cellContent, colIndex) => {
      const isBold = colIndex === 0;
      return createDataCell(cellContent, colWidths[colIndex], isAlt, isBold);
    });
    rows.push(new TableRow({ children: cells }));
  });

  return new Table({
    columnWidths: colWidths,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    rows
  });
}

// Build Document
const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: 'Arial', size: 20, color: TEXT_COLOR }
      }
    },
    paragraphStyles: [
      {
        id: 'Heading1',
        name: 'Heading 1',
        basedOn: 'Normal',
        next: 'Normal',
        quickFormat: true,
        run: { size: 28, bold: true, color: PRIMARY_COLOR, font: 'Arial' },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 }
      },
      {
        id: 'Heading2',
        name: 'Heading 2',
        basedOn: 'Normal',
        next: 'Normal',
        quickFormat: true,
        run: { size: 24, bold: true, color: SECONDARY_COLOR, font: 'Arial' },
        paragraph: { spacing: { before: 180, after: 100 }, outlineLevel: 1 }
      }
    ]
  },
  numbering: {
    config: [
      {
        reference: 'bullet-list',
        levels: [
          {
            level: 0,
            format: LevelFormat.BULLET,
            text: '•',
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 540, hanging: 300 } } }
          }
        ]
      },
      {
        reference: 'checklist',
        levels: [
          {
            level: 0,
            format: LevelFormat.BULLET,
            text: '□',
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 540, hanging: 300 } } }
          }
        ]
      }
    ]
  },
  sections: [
    {
      properties: {
        page: {
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
        }
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({
                  text: 'English Unit 3 | Persuasive Writing & Speaking Reference Guide',
                  size: 16,
                  color: '718096',
                  font: 'Arial'
                })
              ]
            })
          ]
        })
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: 'Page ',
                  size: 16,
                  color: '718096',
                  font: 'Arial'
                }),
                new TextRun({
                  children: [PageNumber.CURRENT],
                  size: 16,
                  color: '718096',
                  font: 'Arial'
                }),
                new TextRun({
                  text: ' of ',
                  size: 16,
                  color: '718096',
                  font: 'Arial'
                }),
                new TextRun({
                  children: [PageNumber.TOTAL_PAGES],
                  size: 16,
                  color: '718096',
                  font: 'Arial'
                })
              ]
            })
          ]
        })
      },
      children: [
        // Title Block
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 120, after: 60 },
          children: [
            new TextRun({
              text: 'PERSUASIVE WRITING & SPEAKING',
              bold: true,
              size: 34,
              color: PRIMARY_COLOR,
              font: 'Arial'
            })
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 60 },
          children: [
            new TextRun({
              text: 'Master Reference Guide for Year 5 & Year 6',
              bold: true,
              size: 24,
              color: SECONDARY_COLOR,
              font: 'Arial'
            })
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 200 },
          children: [
            new TextRun({
              text: 'Australian Curriculum v9 English • Unit 3: Examining, Creating and Sharing Persuasive Texts',
              italics: true,
              size: 18,
              color: '5A6A80',
              font: 'Arial'
            })
          ]
        }),

        // Quick Overview Callout
        createCallout(
          'THE GOLDEN RULE OF PERSUASION: MOVE BEYOND BARE ASSERTIONS',
          [
            'A “bare assertion” is simply stating an opinion with no proof (e.g. “Captivity is bad” or “Dogs are great”). Strong writers combine passion with proof:',
            '1. Clear Contention: State your stand with confidence and purpose.',
            '2. Authoritative Evidence: Back your claims with research, statistics, and expert findings.',
            '3. Deliberate Craft: Use rhetorical devices and strong structure to engage the mind and heart.',
            '4. Audience Respect: Acknowledge opposing concerns fairly before explaining why your solution is better.'
          ]
        ),

        // Section 1: Rhetorical & Stylistic Devices
        ...createSectionHeading(
          '1. Rhetorical & Stylistic Devices (Language Choices)',
          'Deliberate language patterns that make your arguments memorable, rhythmic, and emotionally compelling.'
        ),

        createTechniqueTable(
          [1700, 2300, 2700, 2326],
          ['Technique', 'How It Works & Purpose', 'Model Example from Unit', 'Try It in Your Writing'],
          [
            [
              'Tricolon\n(Rule of Three)',
              'Groups three balanced words, verbs, or clauses to create rhythm, pattern, and memorable emphasis.',
              '“...plant, tend and taste.”\n“...no frown, no interruption, no judgement.”',
              '“Our proposal will protect [A], support [B] and inspire [C].”'
            ],
            [
              'Rhetorical Question',
              'A question asked to make the reader think and agree, rather than to receive a spoken answer.',
              '“Why miss the opportunity to create a school where every student feels supported to succeed?”',
              '“Can we really afford to ignore a solution that helps every child thrive?”'
            ],
            [
              'Deliberate Repetition (Anaphora)',
              'Repeating a key word or phrase at the start of sentences/clauses to hammer home a central theme.',
              '“...grow knowledge, grow confidence and grow a healthier community.”',
              '“We must act for our learners. We must act for our environment. We must act now.”'
            ],
            [
              'Metaphor & Simile',
              'Creates vivid imagery by comparing an idea directly or indirectly to something tangible.',
              '“Like a bridge connecting students to learning, the dog removes emotional barriers.”',
              '“[Program] is not just an activity; it is a springboard into lifelong confidence.”'
            ],
            [
              'Contrast & Juxtaposition',
              'Places two contrasting ideas side-by-side to highlight the superior value of your proposal.',
              '“A garden is not a decoration; it is an outdoor classroom with soil under its fingernails.”',
              '“This is not a temporary luxury; it is an essential investment in student wellbeing.”'
            ],
            [
              'Emotive & Evaluative Vocabulary',
              'Chooses powerful, nuanced adjectives and verbs to evoke empathy, urgency, or civic responsibility.',
              '“...intimidating barriers, vital support, sensible concerns, transformative outcomes.”',
              'Use precise words: instead of “good”, use “invaluable”, “essential”, or “compelling”.'
            ],
            [
              'Controlled Exaggeration (Hyperbole)',
              'Amplifies a consequence to stress importance, balanced carefully so it does not lose credibility.',
              '“...the greatest changes in school history often begin with one simple idea.”',
              '“Without immediate action, generations of students will miss this vital opportunity.”'
            ]
          ]
        ),

        new Paragraph({ children: [new PageBreak()] }),

        // Section 2: Structural & Organisational Moves
        ...createSectionHeading(
          '2. Structural & Organisational Moves',
          'The building blocks that guide your reader smoothly from your opening hook to your final call to action.'
        ),

        createTechniqueTable(
          [1700, 2300, 2700, 2326],
          ['Structural Move', 'Why It Matters', 'Model Example from Unit', 'Sentence Frame / Strategy'],
          [
            [
              'Imagined-Scene Hook',
              'Puts the reader directly into a vivid, sensory situation before presenting heavy arguments.',
              '“Imagine walking into the library and being greeted by a calm listener who never judges...”',
              '“Picture stepping onto our school grounds and seeing...” / “Imagine a classroom where...”'
            ],
            [
              'Core Principle Hook',
              'Opens with a universally accepted ethical truth that commands instant respect.',
              '“Every student deserves the opportunity to experience success, confidence and enjoyment...”',
              '“Every young person has the fundamental right to learn in a safe, inspiring environment.”'
            ],
            [
              'Thesis & Preview Statement',
              'Clearly states your contention and previews your three main supporting arguments in one sentence.',
              '“Introducing a Storytime Dog would improve reading confidence, support wellbeing and foster inclusion.”',
              '“[Audience] should [action] because it will [Reason 1], [Reason 2] and [Reason 3].”'
            ],
            [
              'PEEL Paragraph Architecture',
              'Ensures each paragraph is fully developed: Point, Evidence, Explanation, and Link.',
              'Point: First reason.\nEvidence: Research study.\nExplanation: How it works.\nLink: Re-tie to contention.',
              '• Point: “One compelling reason is...”\n• Evidence: “According to...”\n• Explain: “As a result...”\n• Link: “Consequently...”'
            ],
            [
              'Counterargument & Rebuttal',
              'Acknowledges opposing concerns respectfully, then proves why your solution overcomes them.',
              '“Critics may argue that dogs cause distractions. However, trained handlers follow strict protocols...”',
              '“While some may reasonably worry about [concern], proven safety measures ensure that...”'
            ],
            [
              'Call to Action (Imperative Ending)',
              'Concludes with an inspiring, direct appeal urging decision-makers to approve or take action now.',
              '“Give our students the chance to plant the first seed.” / “Let us give them a fair chance.”',
              '“Let us take this decisive step today and give our students the future they deserve.”'
            ]
          ]
        ),

        // Section 3: The Cohesion Bank (Connectives)
        ...createSectionHeading(
          '3. The Cohesion Bank: Transitional Connectives',
          'Use these cohesive signposts to steer your audience logically through every stage of your reasoning.'
        ),

        createTechniqueTable(
          [2200, 2200, 2326, 2300],
          ['Ordering & Sequencing', 'Adding Weight (Equal Value)', 'Cause & Consequence', 'Contrast & Concession'],
          [
            [
              '• In the first instance,\n• Firstly, / To begin with,\n• Secondly, / Next,\n• Finally, / In conclusion,',
              '• Furthermore,\n• In addition,\n• Moreover,\n• Just as importantly,\n• Equally significant,',
              '• Consequently,\n• Therefore,\n• As a direct result,\n• For this reason,\n• Ultimately,',
              '• However,\n• Although...\n• While it is true that...\n• On the other hand,\n• Of course,'
            ]
          ]
        ),

        new Paragraph({ children: [new PageBreak()] }),

        // Section 4: Evidence & Credibility
        ...createSectionHeading(
          '4. Evidence, Authority & Balanced Claims (Logos & Ethos)',
          'How to establish rock-solid credibility, sound fair-minded, and convince discerning decision-makers.'
        ),

        createTechniqueTable(
          [1800, 2300, 2600, 2326],
          ['Technique', 'How It Strengthens Writing', 'Model Example', 'Sentence Starter / Pattern'],
          [
            [
              'Authoritative Citations',
              'Quotes experts, research studies, and organisations so your points are verified facts, not guesswork.',
              '“According to reading support research synthesized across Australian schools...”',
              '“Research conducted by [Authority] demonstrates that...” / “Data from [Source] confirms...”'
            ],
            [
              'Cautious Modality (Hedging)',
              'Uses measured modal verbs (could, would, suggests) to avoid reckless over-promising and build trust.',
              '“Research suggests that regular contact could significantly enhance emotional regulation.”',
              '“The evidence indicates that this initiative could substantially reduce...”'
            ],
            [
              'Objective vs. Subjective Balance',
              'Combines verifiable data (objective) with moral/community values (subjective).',
              '“With 97% shared DNA (fact), keeping orangutans in cages is an ethical tragedy (judgement).”',
              'Lead with verifiable facts, then draw an ethical conclusion for the reader.'
            ],
            [
              'Specialist Vocabulary',
              'Uses precise domain terminology to demonstrate subject mastery and professional maturity.',
              '“...animal-assisted learning, emotional regulation, agroforestry, bioethics, social cohesion.”',
              'Replace vague words with precise terms (e.g. “wellbeing protocols” instead of “rules”).'
            ],
            [
              'Inclusive Language',
              'Uses first-person plural (we, our, together) to build shared ownership and unity with the audience.',
              '“Together, our school community can foster an environment of empathy and growth.”',
              '“We have a shared responsibility to ensure that our students...”'
            ]
          ]
        ),

        // Section 5: Spoken Presentation Techniques
        ...createSectionHeading(
          '5. Spoken Presentation Techniques (Part B Speeches)',
          'How to turn your written text into an engaging, convincing, and dynamic oral presentation.'
        ),

        createTechniqueTable(
          [2000, 2400, 2400, 2226],
          ['Vocal / Physical Skill', 'How to Use It for Effect', 'What to Avoid', 'Rehearsal Tip'],
          [
            [
              'Pitch & Inflection',
              'Raise pitch slightly to express enthusiasm or pose questions; lower pitch for serious, grounded claims.',
              'Avoid a flat, robot-like monotone pitch.',
              'Record 30 seconds on your device and listen for vocal variety.'
            ],
            [
              'Pace & Pausing',
              'Slow down on key points. Insert a 2-second silent pause after rhetorical questions or big claims.',
              'Avoid rushing or speaking too fast to “get it over with”.',
              'Mark your speech sheet with “//” where you must pause and breathe.'
            ],
            [
              'Volume & Emphasis',
              'Vary volume: speak with firm projection on core arguments; soften volume for intimate reflection.',
              'Avoid shouting or mumbling quietly into your chest.',
              'Underline or highlight the 2–3 powerhouse words in each sentence to punch.'
            ],
            [
              'Cue Cards & Eye Contact',
              'Use your written text as a guide, not a script. Hold cue cards with bullet points and scan all listeners.',
              'Never read every word with your head buried down in paper.',
              'Practise the “Look-Up Rule”: look at a partner for every full sentence you speak.'
            ]
          ]
        ),

        // Student Self-Check Audit Checklist
        ...createSectionHeading(
          '6. Student Writer & Speaker Audit Checklist',
          'Tick off each item before submitting your draft or stepping up to present.'
        ),

        new Paragraph({
          numbering: { reference: 'checklist', level: 0 },
          spacing: { before: 80, after: 60 },
          children: [
            new TextRun({
              text: 'Hook & Contention: ',
              bold: true,
              color: PRIMARY_COLOR
            }),
            new TextRun(
              'My opening grabs attention (imagined scene or strong truth) and clearly states my thesis with 3 previewed reasons.'
            )
          ]
        }),
        new Paragraph({
          numbering: { reference: 'checklist', level: 0 },
          spacing: { before: 60, after: 60 },
          children: [
            new TextRun({
              text: 'No Bare Assertions: ',
              bold: true,
              color: PRIMARY_COLOR
            }),
            new TextRun(
              'Every main argument is backed up by authoritative research, statistics, or expert evidence.'
            )
          ]
        }),
        new Paragraph({
          numbering: { reference: 'checklist', level: 0 },
          spacing: { before: 60, after: 60 },
          children: [
            new TextRun({
              text: 'Rhetorical Devices: ',
              bold: true,
              color: PRIMARY_COLOR
            }),
            new TextRun(
              'I have included at least three deliberate techniques (e.g. tricolon, metaphor, rhetorical question, anaphora).'
            )
          ]
        }),
        new Paragraph({
          numbering: { reference: 'checklist', level: 0 },
          spacing: { before: 60, after: 60 },
          children: [
            new TextRun({
              text: 'Counterargument & Rebuttal: ',
              bold: true,
              color: PRIMARY_COLOR
            }),
            new TextRun(
              'I fairly acknowledged an opposing concern and proved why my solution resolves or outweighs it.'
            )
          ]
        }),
        new Paragraph({
          numbering: { reference: 'checklist', level: 0 },
          spacing: { before: 60, after: 60 },
          children: [
            new TextRun({
              text: 'Cohesion & Connectives: ',
              bold: true,
              color: PRIMARY_COLOR
            }),
            new TextRun(
              'I used varied signpost words (Furthermore, Consequently, However, Therefore) to link my paragraphs and sentences.'
            )
          ]
        }),
        new Paragraph({
          numbering: { reference: 'checklist', level: 0 },
          spacing: { before: 60, after: 60 },
          children: [
            new TextRun({
              text: 'Call to Action: ',
              bold: true,
              color: PRIMARY_COLOR
            }),
            new TextRun(
              'My conclusion leaves a lasting impression and clearly tells the audience what action they must take now.'
            )
          ]
        }),
        new Paragraph({
          numbering: { reference: 'checklist', level: 0 },
          spacing: { before: 60, after: 60 },
          children: [
            new TextRun({
              text: 'Spoken Rehearsal: ',
              bold: true,
              color: PRIMARY_COLOR
            }),
            new TextRun(
              'I have annotated my draft for pauses, pitch, and emphasis, and can deliver it from cue cards while making eye contact.'
            )
          ]
        })
      ]
    }
  ]
});

const outputPath = path.join(
  __dirname,
  'Persuasive_Techniques_Student_Reference_Guide.docx'
);

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outputPath, buffer);
  console.log('Successfully created:', outputPath);
});
