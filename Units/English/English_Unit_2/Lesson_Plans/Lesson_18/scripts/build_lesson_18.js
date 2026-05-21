const { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType, LevelFormat, PageBreak } = require('docx');
const pptxgen = require('pptxgenjs');
const fs = require('fs');
const path = require('path');
const html2pptx = require('c:\\Users\\dsuth\\Documents\\Joshua\\.agent\\skills\\pptx\\scripts\\html2pptx');

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

async function generateWorksheet(filename) {
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
          children: [new TextRun({ text: "Lesson 18: Drafting the Opening Paragraph", bold: true, size: 36, color: THEME.navy })],
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Name: ______________________   Date: _____________", size: 22 })],
          spacing: { after: 400 }
        }),

        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun({ text: "Part 1: Subjective vs. Objective Language", bold: true, size: 28, color: THEME.orange })],
          spacing: { before: 100, after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "In an information report, we must write in an objective (factual, neutral) tone, rather than a subjective (emotional, opinion-based) tone.", size: 22 })],
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
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Subjective (Emotional / Opinion)", bold: true, color: THEME.white })] })]
                }),
                new TableCell({
                  width: { size: 4500, type: WidthType.DXA },
                  shading: { fill: THEME.navy, type: ShadingType.CLEAR },
                  borders: cellBorders,
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Objective (Factual / Factual)", bold: true, color: THEME.white })] })]
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 4500, type: WidthType.DXA },
                  borders: cellBorders,
                  children: [new Paragraph({ children: [new TextRun({ text: "\"The terrible and scary bushfires destroyed everything because people were very frightened.\"", size: 20, italics: true })] })]
                }),
                new TableCell({
                  width: { size: 4500, type: WidthType.DXA },
                  borders: cellBorders,
                  children: [new Paragraph({ children: [new TextRun({ text: "\"Severe and uncontrolled bushfires burnt through forest land, prompting emergency evacuations.\"", size: 20, italics: true })] })]
                })
              ]
            })
          ]
        }),

        new Paragraph({
          children: [new TextRun({ text: "Activity: Underline the objective version of these disaster descriptions:", size: 22, bold: true })],
          spacing: { before: 200, after: 150 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "1. A. ", bold: true }),
            new TextRun({ text: "\"The super loud earthquake shook houses like toys, which was extremely scary.\"" }),
            new TextRun({ text: "\n   B. ", bold: true }),
            new TextRun({ text: "\"An earthquake is a sudden shaking of the ground, which is caused by movements in the Earth's crust.\"" })
          ],
          spacing: { after: 150 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "2. A. ", bold: true }),
            new TextRun({ text: "\"Floods are natural disasters characterized by the inundation of dry land with water, which typically occur due to extreme precipitation.\"" }),
            new TextRun({ text: "\n   B. ", bold: true }),
            new TextRun({ text: "\"Horrible muddy water rushed into houses because there was too much annoying rain.\"" })
          ],
          spacing: { after: 200 }
        }),

        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun({ text: "Part 2: Deconstructing Expanded Noun Groups", bold: true, size: 28, color: THEME.blue })],
          spacing: { before: 200, after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Expanded noun groups add adjectives and descriptive phrases to a noun to make it precise. (e.g., \"the dry Australian landscape\")", size: 22 })],
          spacing: { after: 150 }
        }),

        new Paragraph({
          children: [new TextRun({ text: "Try expanding the simple nouns below by adding adjectives and describing phrases:", size: 22, bold: true })],
          spacing: { after: 150 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "1. water  ->  the __________________________________________________________________", size: 22 })],
          spacing: { after: 150 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "2. cyclone ->  a __________________________________________________________________", size: 22 })],
          spacing: { after: 150 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "3. smoke   ->  thick, ______________________________________________________________", size: 22 })],
          spacing: { after: 250 }
        }),

        new Paragraph({ children: [new PageBreak()] }), // Safe page break inside paragraph

        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun({ text: "Part 3: Drafting Your Opening Classification Paragraph", bold: true, size: 28, color: THEME.navy })],
          spacing: { before: 100, after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Using your Lesson 17 planning, draft your opening paragraph below. Ensure you include a classification definition, an expanded noun group, and a complex sentence.", size: 22 })],
          spacing: { after: 200 }
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
                      children: [new TextRun({ text: "My Chosen Natural Disaster Topic: ___________________________________________", bold: true, size: 22 })],
                      spacing: { after: 200 }
                    }),
                    new Paragraph({
                      children: [new TextRun({ text: "Step 1: Write a factual classification definition for your topic (What is it?):", size: 20, color: THEME.navy, bold: true })],
                      spacing: { after: 100 }
                    }),
                    new Paragraph({
                      children: [new TextRun({ text: "________________________________________________________________________________________\n________________________________________________________________________________________", size: 20 })],
                      spacing: { after: 200 }
                    }),
                    new Paragraph({
                      children: [new TextRun({ text: "Step 2: Write an expanded noun group to describe the disaster's environment:", size: 20, color: THEME.navy, bold: true })],
                      spacing: { after: 100 }
                    }),
                    new Paragraph({
                      children: [new TextRun({ text: "________________________________________________________________________________________", size: 20 })],
                      spacing: { after: 200 }
                    }),
                    new Paragraph({
                      children: [new TextRun({ text: "Step 3: Combine these into a full Opening Paragraph using a complex sentence structure. Bracket the dependent clause (e.g. [which usually occurs...]) and underline your expanded noun group:", size: 20, color: THEME.navy, bold: true })],
                      spacing: { after: 100 }
                    }),
                    new Paragraph({
                      children: [new TextRun({ text: "\n\n\n\n\n\n\n", size: 20 })]
                    })
                  ]
                })
              ]
            })
          ]
        }),

        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun({ text: "Part 4: Peer Review Checklist", bold: true, size: 28, color: THEME.orange })],
          spacing: { before: 200, after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Swap worksheets with a partner. Read their opening paragraph and check off the following:", size: 22 })],
          spacing: { after: 150 }
        }),

        new Table({
          columnWidths: [1500, 7500],
          margins: { top: 100, bottom: 100, left: 150, right: 150 },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 1500, type: WidthType.DXA },
                  borders: cellBorders,
                  shading: { fill: THEME.navy, type: ShadingType.CLEAR },
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Check", bold: true, color: THEME.white })] })]
                }),
                new TableCell({
                  width: { size: 7500, type: WidthType.DXA },
                  borders: cellBorders,
                  shading: { fill: THEME.navy, type: ShadingType.CLEAR },
                  children: [new Paragraph({ children: [new TextRun({ text: "Criteria", bold: true, color: THEME.white })] })]
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ width: { size: 1500, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "[   ]", size: 22 })] })] }),
                new TableCell({ width: { size: 7500, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Clearly defines and classifies the natural disaster objectively (no emotional words).", size: 20 })] })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ width: { size: 1500, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "[   ]", size: 22 })] })] }),
                new TableCell({ width: { size: 7500, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Includes at least one descriptive expanded noun group (underlined).", size: 20 })] })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ width: { size: 1500, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "[   ]", size: 22 })] })] }),
                new TableCell({ width: { size: 7500, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Written in a complex sentence structure containing a dependent clause (bracketed).", size: 20 })] })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ width: { size: 1500, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "[   ]", size: 22 })] })] }),
                new TableCell({ width: { size: 7500, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Uses professional, precise, and topic-specific vocabulary.", size: 20 })] })] })
              ]
            })
          ]
        })
      ]
    }]
  });
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(filename, buffer);
  console.log("✅ Main Worksheet generated.");
}

async function generateLucasHandout(filename) {
  const doc = new Document({
    styles: {
      default: { document: { run: { font: "Arial", size: 24 } } }
    },
    sections: [{
      properties: {
        page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
      },
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "Lesson 18: Introducing My Natural Disaster", bold: true, size: 36, color: THEME.navy })],
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Name: ______________________   Date: _____________", size: 22 })],
          spacing: { after: 300 }
        }),

        new Paragraph({
          children: [new TextRun({ text: "Word Bank", bold: true, size: 28, color: THEME.orange })],
          spacing: { before: 100, after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Use these helpful words to write about your natural disaster:", size: 22 })],
          spacing: { after: 150 }
        }),

        new Table({
          columnWidths: [3000, 3000, 3000],
          margins: { top: 100, bottom: 100, left: 150, right: 150 },
          rows: [
            new TableRow({
              tableHeader: true,
              children: [
                new TableCell({
                  width: { size: 3000, type: WidthType.DXA },
                  shading: { fill: THEME.navy, type: ShadingType.CLEAR },
                  borders: cellBorders,
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Nature Words", bold: true, color: THEME.white })] })]
                }),
                new TableCell({
                  width: { size: 3000, type: WidthType.DXA },
                  shading: { fill: THEME.orange, type: ShadingType.CLEAR },
                  borders: cellBorders,
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Describing Words", bold: true, color: THEME.white })] })]
                }),
                new TableCell({
                  width: { size: 3000, type: WidthType.DXA },
                  shading: { fill: THEME.blue, type: ShadingType.CLEAR },
                  borders: cellBorders,
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Safety Words", bold: true, color: THEME.white })] })]
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 3000, type: WidthType.DXA },
                  borders: cellBorders,
                  children: [new Paragraph({ children: [new TextRun({ text: "fire, water, wind,\nearth, storm, rain,\nfloods, ash, dust", size: 20 })] })]
                }),
                new TableCell({
                  width: { size: 3000, type: WidthType.DXA },
                  borders: cellBorders,
                  children: [new Paragraph({ children: [new TextRun({ text: "hot, dry, wet,\nstrong, big, fast,\nscary, heavy, loud", size: 20 })] })]
                }),
                new TableCell({
                  width: { size: 3000, type: WidthType.DXA },
                  borders: cellBorders,
                  children: [new Paragraph({ children: [new TextRun({ text: "safe, help, stay,\nrun, home, firefighters,\nshelter, plan", size: 20 })] })]
                })
              ]
            })
          ]
        }),

        new Paragraph({
          children: [new TextRun({ text: "Draw your natural disaster here:", bold: true, size: 28, color: THEME.blue })],
          spacing: { before: 200, after: 150 }
        }),

        new Table({
          columnWidths: [9000],
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 9000, type: WidthType.DXA },
                  borders: cellBorders,
                  children: [new Paragraph({ text: "\n\n\n\n\n\n\n\n\n\n" })]
                })
              ]
            })
          ]
        }),

        new Paragraph({
          children: [new TextRun({ text: "Write 2 or 3 sentences about your natural disaster topic. Use the words from the Word Bank above to describe what it is like:", bold: true, size: 24, color: THEME.navy })],
          spacing: { before: 200, after: 150 }
        }),

        new Paragraph({
          children: [new TextRun({ text: "My natural disaster is: __________________________________________________", size: 22 })],
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "It is very: _____________________________________________________________", size: 22 })],
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "It can be: _____________________________________________________________", size: 22 })],
          spacing: { after: 200 }
        })
      ]
    }]
  });
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(filename, buffer);
  console.log("✅ Lucas Handout generated.");
}

async function generateAssessment(filename) {
  const questions = [
    {
      q: "1. What is the primary purpose of the opening paragraph of an information report?",
      a: "A. To list references and sources.",
      b: "B. To define and classify the topic for the reader.",
      c: "C. To tell an interesting story.",
      d: "D. To share the author's opinion on the disaster.",
      ans: "B"
    },
    {
      q: "2. Which grammatical person is standard for an objective information report?",
      a: "A. First person (I, we)",
      b: "B. Second person (you)",
      c: "C. Third person (it, they, he, she)",
      d: "D. Mixed first and second person",
      ans: "C"
    },
    {
      q: "3. Which of the following sentences is written in an OBJECTIVE tone?",
      a: "A. \"The terrifying storm was super loud and made me feel very scared.\"",
      b: "B. \"Severe tropical cyclones are powerful weather systems characterized by destructive winds.\"",
      c: "C. \"Floods are incredibly annoying natural disasters that ruin houses.\"",
      d: "D. \"I think bushfires are the absolute worst disaster in Australia.\"",
      ans: "B"
    },
    {
      q: "4. Which of the following sentences is SUBJECTIVE?",
      a: "A. \"Earthquakes are vibrations caused by energy releases in the crust.\"",
      b: "B. \"The scary and awful bushfires burnt down trees which was extremely tragic.\"",
      c: "C. \"Tornadoes are violently rotating columns of air extending to the ground.\"",
      d: "D. \"Flooding occurs when water inundates land that is normally dry.\"",
      ans: "B"
    },
    {
      q: "5. What is the main noun in the expanded noun group \"the dry Australian landscape\"?",
      a: "A. dry",
      b: "B. Australian",
      c: "C. landscape",
      d: "D. the",
      ans: "C"
    },
    {
      q: "6. Which of the following is an expanded noun group?",
      a: "A. \"inundates rapidly\"",
      b: "B. \"the violently rotating columns of air\"",
      c: "C. \"which are severe\"",
      d: "D. \"extend to the ground\"",
      ans: "B"
    },
    {
      q: "7. A complex sentence must contain:",
      a: "A. Two independent clauses joined by 'and'.",
      b: "B. One independent main clause and at least one dependent clause.",
      c: "C. Only adjectives and nouns.",
      d: "D. An emotional exclamation.",
      ans: "B"
    },
    {
      q: "8. In the sentence: \"Bushfires are severe fires [which are common across the dry Australian landscape].\" The bracketed part is:",
      a: "A. A main clause",
      b: "B. A dependent relative clause",
      c: "C. An expanded noun group",
      d: "D. An adjective",
      ans: "B"
    },
    {
      q: "9. Why are words like \"inundation\", \"convective\", and \"precipitation\" used in information reports?",
      a: "A. To make the report harder to read.",
      b: "B. Because they are everyday words.",
      c: "C. To provide greater precision and topic-specific accuracy.",
      d: "D. To express the author's feelings.",
      ans: "C"
    },
    {
      q: "10. In an opening paragraph's classification statement, you should:",
      a: "A. Place the disaster into a broader category or group.",
      b: "B. Describe the first historical example.",
      c: "C. List how to prepare a survival kit.",
      d: "D. Exclusively use simple sentences.",
      ans: "A"
    }
  ];

  const children = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "Lesson 18: Opening Classification Paragraph Assessment", bold: true, size: 36, color: THEME.navy })],
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

async function generatePresentation(filename, slidePaths) {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';

  for (const s of slidePaths) {
    console.log(`Processing: ${path.basename(s)}`);
    await html2pptx(s, pptx, { ignoreValidation: true });
    console.log(`✅ Processed: ${path.basename(s)}`);
  }
  await pptx.writeFile({ fileName: filename });
  console.log("✅ PPTX generated.");
}

async function run() {
  console.log("Starting resource generation for Lesson 18...");
  
  const baseDir = path.join(__dirname, "..");
  const slidesDir = path.join(baseDir, "Lesson_18_Slides");
  
  const slidePaths = [
    path.join(slidesDir, "slide_1.html"),
    path.join(slidesDir, "slide_2.html"),
    path.join(slidesDir, "slide_3.html"),
    path.join(slidesDir, "slide_4.html"),
    path.join(slidesDir, "slide_5.html"),
    path.join(slidesDir, "slide_6.html"),
    path.join(slidesDir, "slide_7.html")
  ];
  
  const pptxPath = path.join(baseDir, "Lesson_18_Presentation.pptx");
  if (fs.existsSync(slidePaths[0])) {
    await generatePresentation(pptxPath, slidePaths);
  } else {
    console.log("⚠️ Slides not found. Skipping PPT generation.");
  }
  
  const worksheetPath = path.join(baseDir, "Lesson_18_Worksheet.docx");
  await generateWorksheet(worksheetPath);
  
  const lucasHandoutPath = path.join(baseDir, "Lesson_18_Lucas_Handout.docx");
  await generateLucasHandout(lucasHandoutPath);

  const assessmentPath = path.join(baseDir, "Lesson_18_Assessment.docx");
  await generateAssessment(assessmentPath);
  
  console.log("🎉 Resource generation complete!");
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
