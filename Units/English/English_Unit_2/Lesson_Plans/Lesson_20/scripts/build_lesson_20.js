const { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType, LevelFormat, PageBreak } = require('docx');
const fs = require('fs');
const path = require('path');

const THEME = {
  navy: '112D4E',
  orange: 'F96D00',
  white: 'F9F7F7',
  blue: '3F72AF',
  darkGrey: '333333',
  lightGrey: 'E0E0E0',
  pureWhite: 'FFFFFF'
};

const tableBorder = { style: BorderStyle.SINGLE, size: 4, color: THEME.lightGrey };
const cellBorders = { top: tableBorder, bottom: tableBorder, left: tableBorder, right: tableBorder };

// Helper function to create standard sequencing challenges
function createSequencingChallenge(title, clauses) {
  const tableRows = clauses.map(c => new TableRow({
    children: [
      new TableCell({
        width: { size: 9000, type: WidthType.DXA },
        borders: cellBorders,
        children: [new Paragraph({ children: [new TextRun({ text: c, size: 20 })], spacing: { after: 60 } })]
      })
    ]
  }));

  return [
    new Paragraph({
      children: [new TextRun({ text: title, bold: true, size: 22, color: THEME.navy })],
      spacing: { before: 180, after: 100 }
    }),
    new Table({
      columnWidths: [9000],
      margins: { top: 120, bottom: 120, left: 180, right: 180 },
      rows: tableRows
    }),
    new Paragraph({
      children: [new TextRun({ text: "Correct Paragraph Sequence Order: [ ____ ]  →  [ ____ ]  →  [ ____ ]  →  [ ____ ]", bold: true, size: 20, color: THEME.orange })],
      spacing: { before: 120, after: 120 }
    }),
    new Paragraph({
      children: [new TextRun({ text: "Assembled Cohesive Paragraph:", size: 18, color: THEME.navy, bold: true })],
      spacing: { after: 60 }
    }),
    new Paragraph({
      children: [new TextRun({ text: "________________________________________________________________________________________\n________________________________________________________________________________________", size: 18 })],
      spacing: { after: 150 }
    })
  ];
}

// Helper function to create Lucas scenario plan pages
function createLucasScenarioPage(title, steps, wordBank, frames) {
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: title, bold: true, size: 32, color: THEME.navy })],
      spacing: { after: 150 }
    }),
    new Paragraph({
      children: [new TextRun({ text: "Name: ______________________   Date: _____________", size: 20 })],
      spacing: { after: 200 }
    }),

    // Word Bank
    new Paragraph({
      children: [new TextRun({ text: "Word Bank", bold: true, size: 24, color: THEME.orange })],
      spacing: { before: 100, after: 80 }
    }),
    new Paragraph({
      children: [new TextRun({ text: "Use these words to complete your safety plan blanks below:", size: 20 })],
      spacing: { after: 120 }
    }),
    new Table({
      columnWidths: [3000, 3000, 3000],
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      rows: [
        new TableRow({
          tableHeader: true,
          children: [
            new TableCell({
              width: { size: 3000, type: WidthType.DXA },
              shading: { fill: THEME.navy, type: ShadingType.CLEAR },
              borders: cellBorders,
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Nature Words", bold: true, color: THEME.white, size: 18 })] })]
            }),
            new TableCell({
              width: { size: 3000, type: WidthType.DXA },
              shading: { fill: THEME.orange, type: ShadingType.CLEAR },
              borders: cellBorders,
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Describing Words", bold: true, color: THEME.white, size: 18 })] })]
            }),
            new TableCell({
              width: { size: 3000, type: WidthType.DXA },
              shading: { fill: THEME.blue, type: ShadingType.CLEAR },
              borders: cellBorders,
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Safety Words", bold: true, color: THEME.white, size: 18 })] })]
            })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              width: { size: 3000, type: WidthType.DXA },
              borders: cellBorders,
              children: [new Paragraph({ children: [new TextRun({ text: wordBank.nature, size: 18 })] })]
            }),
            new TableCell({
              width: { size: 3000, type: WidthType.DXA },
              borders: cellBorders,
              children: [new Paragraph({ children: [new TextRun({ text: wordBank.describing, size: 18 })] })]
            }),
            new TableCell({
              width: { size: 3000, type: WidthType.DXA },
              borders: cellBorders,
              children: [new Paragraph({ children: [new TextRun({ text: wordBank.safety, size: 18 })] })]
            })
          ]
        })
      ]
    }),

    // Drawing Boxes
    new Paragraph({
      children: [new TextRun({ text: "My Plan Drawings", bold: true, size: 24, color: THEME.blue })],
      spacing: { before: 200, after: 100 }
    }),
    new Paragraph({
      children: [new TextRun({ text: "Draw a picture in the boxes for each step of your safety plan:", size: 20 })],
      spacing: { after: 120 }
    }),
    new Table({
      columnWidths: [3000, 3000, 3000],
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 3000, type: WidthType.DXA },
              borders: cellBorders,
              children: [
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Step 1: " + steps.label1, bold: true, size: 16, color: THEME.navy })], spacing: { after: 80 } }),
                new Paragraph({ text: "\n\n\n\n\n\n" })
              ]
            }),
            new TableCell({
              width: { size: 3000, type: WidthType.DXA },
              borders: cellBorders,
              children: [
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Step 2: " + steps.label2, bold: true, size: 16, color: THEME.orange })], spacing: { after: 80 } }),
                new Paragraph({ text: "\n\n\n\n\n\n" })
              ]
            }),
            new TableCell({
              width: { size: 3000, type: WidthType.DXA },
              borders: cellBorders,
              children: [
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Step 3: " + steps.label3, bold: true, size: 16, color: THEME.blue })], spacing: { after: 80 } }),
                new Paragraph({ text: "\n\n\n\n\n\n" })
              ]
            })
          ]
        })
      ]
    }),

    // Sentences
    new Paragraph({
      children: [new TextRun({ text: "My Safety Plan Sentences", bold: true, size: 22, color: THEME.navy })],
      spacing: { before: 200, after: 120 }
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "First", bold: true, size: 20, color: THEME.orange }),
        new TextRun({ text: frames.first, size: 20 })
      ],
      spacing: { after: 150 }
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Then", bold: true, size: 20, color: THEME.orange }),
        new TextRun({ text: frames.then, size: 20 })
      ],
      spacing: { after: 150 }
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Finally", bold: true, size: 20, color: THEME.orange }),
        new TextRun({ text: frames.finally, size: 20 })
      ],
      spacing: { after: 150 }
    })
  ];
}

async function generateWorksheet(filename) {
  // Scenario Standard Data
  const clausesA = [
    "[ A ] \"According to meteorological reports, strong winds will push this front rapidly towards the ridge.\"",
    "[ B ] \"Driven by soaring temperatures, dry bark and grass accumulate thermal energy.\"",
    "[ C ] \"Despite these hazardous conditions, emergency containment crews immediately begin cutting a wide firebreak.\"",
    "[ D ] \"Consequently, even a minor ember can trigger instant combustion in these volatile fields.\""
  ];

  const clausesB = [
    "[ A ] \"Saturated by days of torrential downpours, the upper river catchment exceeded its maximum capacity.\"",
    "[ B ] \"According to hydrologists at the Bureau of Meteorology, peak inundation is expected to occur before dawn.\"",
    "[ C ] \"Consequently, a massive volume of runoff surged downstream, quickly breaching local levees.\"",
    "[ D ] \"Despite the rapid rise in water levels, emergency evacuation routes remain open for rural residents.\""
  ];

  const clausesC = [
    "[ A ] \"To minimise potential damage from late-summer blazes, land management authorities conduct controlled hazard reduction burns.\"",
    "[ B ] \"As a result, accumulated undergrowth and dry forest litter are safely cleared under controlled conditions.\"",
    "[ C ] \"Although these burns generate temporary smoke haze, they significantly reduce the intensity of future bushfires.\"",
    "[ D ] \"According to Queensland Fire Department guidelines, these burns must only proceed when wind speeds are low.\""
  ];

  const clausesD = [
    "[ A ] \"According to seismologists monitoring global plate movement, this rapid release sends powerful shockwaves through the crust.\"",
    "[ B ] \"Locked along tectonic plate boundaries, rock layers absorb immense mechanical stress over centuries.\"",
    "[ C ] \"Consequently, a sudden structural rupture occurs when the accumulated friction is violently released.\"",
    "[ D ] \"Although the primary tremor lasts only seconds, secondary aftershocks continue to threaten structural integrity.\""
  ];

  const clausesE = [
    "[ A ] \"Consequently, massive convective cloud bands develop, generating destructive wind gusts and torrential rain.\"",
    "[ B ] \"According to coastal meteorological stations, the core pressure is dropping sharply as the storm approaches.\"",
    "[ C ] \"Fuelled by warm ocean currents, unstable tropical air columns rise rapidly in low-pressure zones.\"",
    "[ D ] \"Despite the intense structural battering, modern cyclone-rated houses provide highly effective safety shelters.\""
  ];

  const doc = new Document({
    styles: {
      default: { document: { run: { font: "Arial", size: 24 } } },
      paragraphStyles: [
        {
          id: "Heading1",
          name: "Heading 1",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: { size: 32, bold: true, color: THEME.navy, font: "Arial" },
          paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 }
        },
        {
          id: "Heading2",
          name: "Heading 2",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: { size: 28, bold: true, color: THEME.orange, font: "Arial" },
          paragraph: { spacing: { before: 180, after: 120 }, outlineLevel: 1 }
        }
      ]
    },
    sections: [{
      properties: {
        page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
      },
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "Lesson 20: Paragraph Cohesion and Text Connectives", bold: true, size: 36, color: THEME.navy })],
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Name: ______________________   Date: _____________", size: 22 })],
          spacing: { after: 400 }
        }),

        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun({ text: "Part 1: Varied Sentence Starters and Cohesion", bold: true, size: 28, color: THEME.orange })],
          spacing: { before: 100, after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Beginning every sentence in a paragraph with the same starting point makes text monotonous. Circumstantial sentence starters and text connectives help vary emphasis and show clear, logical relationships.", size: 22 })],
          spacing: { after: 200 }
        }),

        new Table({
          columnWidths: [4500, 4500],
          margins: { top: 100, bottom: 100, left: 150, right: 150 },
          rows: [
            new TableRow({
              tableHeader: true,
              children: [
                new TableCell({
                  width: { size: 4500, type: WidthType.DXA },
                  shading: { fill: THEME.navy, type: ShadingType.CLEAR },
                  borders: cellBorders,
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Monotonous Starters", bold: true, color: THEME.white })] })]
                }),
                new TableCell({
                  width: { size: 4500, type: WidthType.DXA },
                  shading: { fill: THEME.navy, type: ShadingType.CLEAR },
                  borders: cellBorders,
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Cohesive Sentence Structures", bold: true, color: THEME.white })] })]
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 4500, type: WidthType.DXA },
                  borders: cellBorders,
                  children: [new Paragraph({ children: [new TextRun({ text: "\"The bushfire spread quickly. The bushfire was pushed by strong winds.\"", size: 20, italics: true })] })]
                }),
                new TableCell({
                  width: { size: 4500, type: WidthType.DXA },
                  borders: cellBorders,
                  children: [new Paragraph({ children: [new TextRun({ text: "\"Driven by strong winds, the bushfire spread with incredible speed.\"", size: 20, italics: true })] })]
                })
              ]
            })
          ]
        }),

        new Paragraph({
          children: [new TextRun({ text: "Activity: Rewrite the following sentences to vary the starting point and add text connectives:", size: 22, bold: true })],
          spacing: { before: 200, after: 150 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "1. Repetitive: ", bold: true }),
            new TextRun({ text: "\"The wind speed increased. The flames leaped higher. The fire breached the firebreak.\"\n" }),
            new TextRun({ text: "   Cohesive Rewrite (Start with a circumstance, e.g. \"As a result of increasing wind...\"): ", bold: true }),
            new TextRun({ text: "\n________________________________________________________________________________________\n________________________________________________________________________________________" })
          ],
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "2. Repetitive: ", bold: true }),
            new TextRun({ text: "\"Fuel was dry on the forest floor. The fire ignited instantly. The heat made suppression impossible.\"\n" }),
            new TextRun({ text: "   Cohesive Rewrite (Vary starting points and use a concession, e.g. \"Although suppression was...\"): ", bold: true }),
            new TextRun({ text: "\n________________________________________________________________________________________\n________________________________________________________________________________________" })
          ],
          spacing: { after: 250 }
        }),

        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun({ text: "Part 2: Analysing Mentor Text Cohesion", bold: true, size: 28, color: THEME.blue })],
          spacing: { before: 200, after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Read the excerpt below from the Bushfires Archive (Elemental Magic) and answer the questions:", size: 22 })],
          spacing: { after: 150 }
        }),

        new Table({
          columnWidths: [9000],
          margins: { top: 150, bottom: 150, left: 200, right: 200 },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 9000, type: WidthType.DXA },
                  borders: cellBorders,
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: "\"Driven by extreme solar radiation, dry fuels accumulate vast thermal energy during peak summer months. Consequently, even a single lightning strike in these highly volatile grasslands can trigger instant combustion. Although firefighting crews respond immediately to these outbreaks, the intense heat makes suppression extremely difficult.\"", size: 20, italics: true })]
                    })
                  ]
                })
              ]
            })
          ]
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "1. Identify the circumstantial starting point in the first sentence. What information is given prominence? ", bold: true }),
            new TextRun({ text: "\n________________________________________________________________________________________" })
          ],
          spacing: { before: 150, after: 120 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "2. What type of logical relationship does the text connective \"Consequently\" show between the first and second sentences? ", bold: true }),
            new TextRun({ text: "\n________________________________________________________________________________________" })
          ],
          spacing: { after: 120 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "3. Locate the concession connective in the final sentence. How does this word connect the final sentence to the rest of the text? ", bold: true }),
            new TextRun({ text: "\n________________________________________________________________________________________" })
          ],
          spacing: { after: 200 }
        }),

        new Paragraph({ children: [new PageBreak()] }),

        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun({ text: "Part 3: Written Clause Sequencing and Paragraph Drafting", bold: true, size: 28, color: THEME.navy })],
          spacing: { before: 100, after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Arrange the scrambled clauses below into perfectly cohesive paragraphs. Write the correct order sequence index and draft the assembled paragraph in the spaces provided, paying attention to the logical flow created by sentence starting points and text connectives.", size: 22 })],
          spacing: { after: 200 }
        }),

        // 1. Bushfire Challenge
        ...createSequencingChallenge("Challenge A: Bushfire Containment", clausesA),
        
        // 2. Flood Challenge
        ...createSequencingChallenge("Challenge B: Flood Catchment Inundation", clausesB),

        new Paragraph({ children: [new PageBreak()] }),

        // 3. Campfire Safety Challenge
        ...createSequencingChallenge("Challenge C: Controlled Hazard Reduction", clausesC),

        // 4. Earthquake Challenge
        ...createSequencingChallenge("Challenge D: Seismological Tectonic Stress", clausesD),

        new Paragraph({ children: [new PageBreak()] }),

        // 5. Storm Challenge
        ...createSequencingChallenge("Challenge E: Tropical Cyclone Formations", clausesE),

        new Paragraph({ children: [new PageBreak()] }),

        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun({ text: "Part 4: Cohesive Paragraph Revision (Homework / Extension)", bold: true, size: 28, color: THEME.orange })],
          spacing: { before: 200, after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Review the PEEL paragraph you drafted in Lesson 19. Revise it below by ensuring you vary at least two sentence starting points, add at least one precise text connective, and create a smooth transition sentence that links to your next paragraph.", size: 22 })],
          spacing: { after: 150 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "________________________________________________________________________________________\n________________________________________________________________________________________\n________________________________________________________________________________________\n________________________________________________________________________________________\n________________________________________________________________________________________", size: 20 })],
          spacing: { after: 200 }
        })
      ]
    }]
  });
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(filename, buffer);
  console.log("✅ Main Worksheet generated.");
}

async function generateLucasHandout(filename) {
  // Scenario Differentiated Data
  const page1 = createLucasScenarioPage(
    "Lesson 20: My Bushfire Safety Plan",
    { label1: "Check Plan (📋)", label2: "Pack Bags (🎒)", label3: "Safe Shelter (🏡)" },
    {
      nature: "fire, storm, wind, plan, tree, leaves, rain, ash, dust",
      describing: "hot, dry, strong, big, scary, heavy, loud, safe",
      safety: "safe, shelter, bag, pack, run, stay, firefighters, home"
    },
    {
      first: ", we check our family bushfire plan to stay ____________________.",
      then: ", we pack our emergency ____________________ in the strong ____________________.",
      finally: ", we go to a safe ____________________ with the firefighters."
    }
  );

  const page2 = createLucasScenarioPage(
    "Lesson 20: My Flood Safety Plan",
    { label1: "Check Alerts (📻)", label2: "High Ground (⛰️)", label3: "Stay Away (🚫)" },
    {
      nature: "rain, storm, water, river, mud, wind, leaves, tree",
      describing: "wet, heavy, deep, high, safe, strong, loud, scary",
      safety: "alerts, radio, pets, ground, floodwaters, safe, stay"
    },
    {
      first: ", we check the flood ____________________ on the ____________________.",
      then: ", we move our ____________________ and bags to high ____________________.",
      finally: ", we stay away from dangerous ____________________."
    }
  );

  const page3 = createLucasScenarioPage(
    "Lesson 20: My Campfire Safety Plan",
    { label1: "Clear Circle (🧹)", label2: "Enjoy Safely (🔥)", label3: "Drown Coals (🪣)" },
    {
      nature: "leaves, wood, coals, dirt, smoke, fire, wind, rain",
      describing: "dry, hot, safe, cold, clear, active, clean, strong",
      safety: "circle, campfire, safely, water, coals, stay, shelter"
    },
    {
      first: ", we clear dry ____________________ away from the fire ____________________.",
      then: ", we sit back and enjoy our ____________________ ____________________.",
      finally: ", we drown the hot ____________________ with cold ____________________."
    }
  );

  const page4 = createLucasScenarioPage(
    "Lesson 20: My Earthquake Preparation Plan",
    { label1: "Bring Toys In (🧸)", label2: "Bring Pets In (🐕)", label3: "Shelter Away (🛡️)" },
    {
      nature: "toys, ground, glass, wall, house, pets, room, windows",
      describing: "loose, safe, shaking, warm, inside, heavy, strong",
      safety: "inside, pets, shelter, windows, warm, stay, bags"
    },
    {
      first: ", we bring loose outdoor ____________________ ____________________.",
      then: ", we bring our ____________________ inside to keep them ____________________.",
      finally: ", we shelter in a room away from glass ____________________."
    }
  );

  const page5 = createLucasScenarioPage(
    "Lesson 20: My Severe Storm Safety Plan",
    { label1: "Water Bottles (💧)", label2: "Torch & Radio (🔦)", label3: "Charge Phones (⚡)" },
    {
      nature: "water, storm, wind, rain, cloud, torch, radio, phones",
      describing: "clean, dark, heavy, loud, full, safe, emergency",
      safety: "torch, radio, charge, phones, safe, pack, bags"
    },
    {
      first: ", we fill bottles with clean drinking ____________________.",
      then: ", we pack a working ____________________ and emergency ____________________.",
      finally: ", we plug in and charge our mobile ____________________."
    }
  );

  const children = [
    ...page1,
    new Paragraph({ children: [new PageBreak()] }),
    ...page2,
    new Paragraph({ children: [new PageBreak()] }),
    ...page3,
    new Paragraph({ children: [new PageBreak()] }),
    ...page4,
    new Paragraph({ children: [new PageBreak()] }),
    ...page5
  ];

  const doc = new Document({
    styles: {
      default: { document: { run: { font: "Arial", size: 24 } } }
    },
    sections: [{
      properties: {
        page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
      },
      children: children
    }]
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(filename, buffer);
  console.log("✅ Lucas Handout generated.");
}

async function generateAssessment(filename) {
  const questions = [
    {
      q: "1. What is the main structural benefit of using varied sentence starting points (themes) in an information report?",
      a: "A. It makes the text much longer and detailed.",
      b: "B. It controls what information is given prominence and enhances flow.",
      c: "C. It allows the writer to express their personal opinions.",
      d: "D. It bypasses the need for subheadings and tables.",
      ans: "B"
    },
    {
      q: "2. Which of the following sentences represents a 'circumstantial starter' that highlights weather conditions first?",
      a: "A. The bushfire spread with incredible speed because of strong winds.",
      b: "B. Strong winds pushed the bushfire with incredible speed.",
      c: "C. Driven by strong north-westerly winds, the bushfire spread with incredible speed.",
      d: "D. The meteorological records showed that winds pushed the bushfire.",
      ans: "C"
    },
    {
      q: "3. What logical relationship is demonstrated by the text connective \"Consequently\" in a paragraph?",
      a: "A. Contrast and comparison",
      b: "B. Cause and effect",
      c: "C. Chronological sequence",
      d: "D. Concession and obstacles",
      ans: "B"
    },
    {
      q: "4. Which of the following is a concession connective used to introduce a contrasting limitation or obstacle?",
      a: "A. Consequently",
      b: "B. In contrast",
      c: "C. Despite these conditions",
      d: "D. According to emergency records",
      ans: "C"
    },
    {
      q: "5. When writing about containment tactics, which text connective best shows a comparison between two methods?",
      a: "A. As a result",
      b: "B. In contrast to",
      c: "C. Evidence demonstrates",
      d: "D. Therefore",
      ans: "B"
    },
    {
      q: "6. Read this paragraph: \"The bushfire spread quickly. The bushfire leaped higher. The bushfire jumped the creek.\" What is the primary issue with this paragraph?",
      a: "A. It contains spelling errors.",
      b: "B. It uses too much scientific terminology.",
      c: "C. It has monotonous sentence starting points.",
      d: "D. It has no topic sentence.",
      ans: "C"
    },
    {
      q: "7. Which connective is the most suitable for referencing professional evidence or a scientific record?",
      a: "A. Although",
      b: "B. According to emergency services data",
      c: "C. On the other hand",
      d: "D. For this reason",
      ans: "B"
    },
    {
      q: "8. In the sentence: \"Although firefighting crews respond immediately to these outbreaks, the intense heat makes suppression extremely difficult.\" Which word functions as a concession connective?",
      a: "A. immediately",
      b: "B. extremely",
      c: "C. Although",
      d: "D. outbreaks",
      ans: "C"
    },
    {
      q: "9. How do paragraph transitions enhance the overall cohesion of a multi-paragraph information report?",
      a: "A. By repeating the exact same topic sentence at the start of every paragraph.",
      b: "B. By linking the closing ideas of one paragraph to the opening focus of the next.",
      c: "C. By removing the need for text connectives.",
      d: "D. By adding subjective thoughts to the conclusion.",
      ans: "B"
    },
    {
      q: "10. In our Slide 6 model: \"Driven by soaring temperatures, dry bark and grass accumulate thermal energy.\" What information is given prominence by the theme of this sentence?",
      a: "A. The dry bark and grass",
      b: "B. The atmospheric temperature conditions",
      c: "C. The accumulation process",
      d: "D. The scientific definition of combustion",
      ans: "B"
    }
  ];

  const children = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "Lesson 20: Paragraph Cohesion and Text Connectives Assessment", bold: true, size: 36, color: THEME.navy })],
      spacing: { after: 400 }
    })
  ];

  questions.forEach(item => {
    children.push(new Paragraph({ children: [new TextRun({ text: item.q, bold: true, size: 24 })], spacing: { before: 200 } }));
    children.push(new Paragraph({ children: [new TextRun({ text: item.a, size: 24 })] }));
    children.push(new Paragraph({ children: [new TextRun({ text: item.b, size: 24 })] }));
    children.push(new Paragraph({ children: [new TextRun({ text: item.c, size: 24 })] }));
    children.push(new Paragraph({ children: [new TextRun({ text: item.d, size: 24 })] }));
    children.push(new Paragraph({ children: [new TextRun({ text: `ANS: ${item.ans}`, bold: true, size: 24 })], spacing: { after: 200 } }));
  });

  const doc = new Document({
    sections: [{ children }]
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(filename, buffer);
  console.log("✅ Assessment generated.");
}

async function run() {
  console.log("Starting resource generation for Lesson 20...");
  
  const baseDir = path.join(__dirname, "..");
  
  const worksheetPath = path.join(baseDir, "Lesson_20_Worksheet.docx");
  await generateWorksheet(worksheetPath);
  
  const lucasHandoutPath = path.join(baseDir, "Lesson_20_Lucas_Handout.docx");
  await generateLucasHandout(lucasHandoutPath);

  const assessmentPath = path.join(baseDir, "Lesson_20_Assessment.docx");
  await generateAssessment(assessmentPath);
  
  console.log("🎉 Resource generation complete!");
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
