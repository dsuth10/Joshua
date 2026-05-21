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
          children: [new TextRun({ text: "Lesson 19: Writing Body Paragraphs using PEEL", bold: true, size: 36, color: THEME.navy })],
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Name: ______________________   Date: _____________", size: 22 })],
          spacing: { after: 400 }
        }),

        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun({ text: "Part 1: Specialist vs. Everyday Vocabulary", bold: true, size: 28, color: THEME.orange })],
          spacing: { before: 100, after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Information reports require precise, specialist vocabulary to maintain an authoritative register.", size: 22 })],
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
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Everyday Vocabulary", bold: true, color: THEME.white })] })]
                }),
                new TableCell({
                  width: { size: 4500, type: WidthType.DXA },
                  shading: { fill: THEME.navy, type: ShadingType.CLEAR },
                  borders: cellBorders,
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Specialist Vocabulary", bold: true, color: THEME.white })] })]
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 4500, type: WidthType.DXA },
                  borders: cellBorders,
                  children: [new Paragraph({ children: [new TextRun({ text: "\"The dry leaves and trees gets very hot in summer.\"", size: 20, italics: true })] })]
                }),
                new TableCell({
                  width: { size: 4500, type: WidthType.DXA },
                  borders: cellBorders,
                  children: [new Paragraph({ children: [new TextRun({ text: "\"Dry vegetation accumulates thermal energy during warm seasons.\"", size: 20, italics: true })] })]
                })
              ]
            })
          ]
        }),

        new Paragraph({
          children: [new TextRun({ text: "Activity: Complete the following sentences by replacing everyday words with precise, specialist terms:", size: 22, bold: true })],
          spacing: { before: 200, after: 150 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "1. Everyday: ", bold: true }),
            new TextRun({ text: "\"The storm caused a lot of muddy water to cover the riverbanks.\"\n" }),
            new TextRun({ text: "   Specialist: ", bold: true }),
            new TextRun({ text: "\"Extreme precipitation resulted in the ____________________ of the riparian zone.\"" })
          ],
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "2. Everyday: ", bold: true }),
            new TextRun({ text: "\"The fire started catching and burning very quickly because of the oxygen.\"\n" }),
            new TextRun({ text: "   Specialist: ", bold: true }),
            new TextRun({ text: "\"The fuel source began to ____________________ and sustain ____________________ in oxygen-rich air.\"" })
          ],
          spacing: { after: 250 }
        }),

        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun({ text: "Part 2: Deconstructing the PEEL Structure", bold: true, size: 28, color: THEME.blue })],
          spacing: { before: 200, after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Match the following sentences from the Tornado model to their correct PEEL component (Point, Evidence, Explanation, Link):", size: 22 })],
          spacing: { after: 150 }
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "1. [      ] ", bold: true }),
            new TextRun({ text: "\"As the warm air rapidly rises, it creates strong convective updrafts that begin to rotate.\"" })
          ],
          spacing: { after: 120 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "2. [      ] ", bold: true }),
            new TextRun({ text: "\"Consequently, this fast-spinning vortex descends to the earth, creating a highly destructive windstorm.\"" })
          ],
          spacing: { after: 120 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "3. [      ] ", bold: true }),
            new TextRun({ text: "\"Tornadoes develop when warm, humid air collides with cold, dry air in a highly unstable atmosphere.\"" })
          ],
          spacing: { after: 120 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "4. [      ] ", bold: true }),
            new TextRun({ text: "\"This rotation is further accelerated by wind shear, which turns the rising air into a violent spinning funnel.\"" })
          ],
          spacing: { after: 200 }
        }),

        new Paragraph({ children: [new PageBreak()] }),

        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun({ text: "Part 3: Drafting Your PEEL Body Paragraph", bold: true, size: 28, color: THEME.navy })],
          spacing: { before: 100, after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Using your research notes and Lesson 17 planning, draft your first cohesive body paragraph. Make sure to follow the PEEL structure, write at least one complex sentence, and incorporate at least two specialist terms.", size: 22 })],
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
                      children: [new TextRun({ text: "Disaster Topic: ___________________________________________", bold: true, size: 22 })],
                      spacing: { after: 200 }
                    }),
                    new Paragraph({
                      children: [new TextRun({ text: "P - Point (Write your topic sentence stating the main idea):", size: 20, color: THEME.navy, bold: true })],
                      spacing: { after: 100 }
                    }),
                    new Paragraph({
                      children: [new TextRun({ text: "________________________________________________________________________________________\n________________________________________________________________________________________", size: 20 })],
                      spacing: { after: 200 }
                    }),
                    new Paragraph({
                      children: [new TextRun({ text: "E - Evidence (Add factual details, measurements, or statistics):", size: 20, color: THEME.navy, bold: true })],
                      spacing: { after: 100 }
                    }),
                    new Paragraph({
                      children: [new TextRun({ text: "________________________________________________________________________________________\n________________________________________________________________________________________", size: 20 })],
                      spacing: { after: 200 }
                    }),
                    new Paragraph({
                      children: [new TextRun({ text: "E - Explanation (Explain how or why this factual detail matters):", size: 20, color: THEME.navy, bold: true })],
                      spacing: { after: 100 }
                    }),
                    new Paragraph({
                      children: [new TextRun({ text: "________________________________________________________________________________________\n________________________________________________________________________________________", size: 20 })],
                      spacing: { after: 200 }
                    }),
                    new Paragraph({
                      children: [new TextRun({ text: "L - Link (Summarise and link back to your overall report topic):", size: 20, color: THEME.navy, bold: true })],
                      spacing: { after: 100 }
                    }),
                    new Paragraph({
                      children: [new TextRun({ text: "________________________________________________________________________________________", size: 20 })],
                      spacing: { after: 200 }
                    }),
                    new Paragraph({
                      children: [new TextRun({ text: "Step 4: Combine these parts into a single, flowing paragraph. Underline your specialist words and put brackets around your complex sentence [like this]:", size: 20, color: THEME.orange, bold: true })],
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
          children: [new TextRun({ text: "Swap worksheets with a partner. Read their PEEL body paragraph and check off the criteria:", size: 22 })],
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
                new TableCell({ width: { size: 7500, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Paragraph starts with a clear topic sentence (Point) introducing the main idea.", size: 20 })] })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ width: { size: 1500, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "[   ]", size: 22 })] })] }),
                new TableCell({ width: { size: 7500, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Contains factual details, measurements, or research statistics (Evidence).", size: 20 })] })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ width: { size: 1500, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "[   ]", size: 22 })] })] }),
                new TableCell({ width: { size: 7500, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Explains how the factual detail supports the paragraph's main point (Explanation).", size: 20 })] })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ width: { size: 1500, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "[   ]", size: 22 })] })] }),
                new TableCell({ width: { size: 7500, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Concludes with a sentence linking back to the overall report topic (Link).", size: 20 })] })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ width: { size: 1500, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "[   ]", size: 22 })] })] }),
                new TableCell({ width: { size: 7500, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "At least two precise, topic-specific vocabulary words are used correctly (underlined).", size: 20 })] })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ width: { size: 1500, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "[   ]", size: 22 })] })] }),
                new TableCell({ width: { size: 7500, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "At least one complex sentence is constructed correctly (bracketed).", size: 20 })] })] })
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
          children: [new TextRun({ text: "Lesson 19: Writing My Natural Disaster Paragraph", bold: true, size: 36, color: THEME.navy })],
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
          children: [new TextRun({ text: "Use these helpful words to write a short paragraph about one part of your natural disaster:", size: 22 })],
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
                  children: [new Paragraph({ children: [new TextRun({ text: "fire, water, wind,\nearth, storm, rain,\nfloods, ash, dust,\nlightning, clouds", size: 20 })] })]
                }),
                new TableCell({
                  width: { size: 3000, type: WidthType.DXA },
                  borders: cellBorders,
                  children: [new Paragraph({ children: [new TextRun({ text: "hot, dry, wet,\nstrong, big, fast,\nscary, heavy, loud,\nwarm, dark", size: 20 })] })]
                }),
                new TableCell({
                  width: { size: 3000, type: WidthType.DXA },
                  borders: cellBorders,
                  children: [new Paragraph({ children: [new TextRun({ text: "safe, help, stay,\nrun, home, firefighters,\nshelter, plan,\nprotect", size: 20 })] })]
                })
              ]
            })
          ]
        }),

        new Paragraph({
          children: [new TextRun({ text: "Draw this part of your natural disaster here:", bold: true, size: 28, color: THEME.blue })],
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
          children: [new TextRun({ text: "Write your short factual paragraph. Use the words from the Word Bank above to fill in the sentence frames:", bold: true, size: 24, color: THEME.navy })],
          spacing: { before: 200, after: 150 }
        }),

        new Paragraph({
          children: [new TextRun({ text: "My natural disaster topic is: __________________________________________________", size: 22 })],
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "One factual detail is: _________________________________________________________", size: 22 })],
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "This shows that it can be: ______________________________________________________", size: 22 })],
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
      q: "1. What does the acronym PEEL stand for in paragraph writing?",
      a: "A. Purpose, Essay, Excerpt, Layout",
      b: "B. Point, Evidence, Explanation, Link",
      c: "C. Paragraph, Editorial, Expository, Line",
      d: "D. Presentation, Examination, Evaluation, Lecture",
      ans: "B"
    },
    {
      q: "2. What is the primary role of the topic sentence (Point) at the beginning of a body paragraph?",
      a: "A. To state the sources used in the report.",
      b: "B. To hook the reader with a dramatic story.",
      c: "C. To state the paragraph's main idea clearly.",
      d: "D. To draw a conclusion for the whole report.",
      ans: "C"
    },
    {
      q: "3. In a PEEL body paragraph, which part provides factual details, measurements, or statistics from research?",
      a: "A. Point",
      b: "B. Evidence",
      c: "C. Explanation",
      d: "D. Link",
      ans: "B"
    },
    {
      q: "4. What is the purpose of the 'Explanation' sentence in a PEEL paragraph?",
      a: "A. To introduce a brand new topic.",
      b: "B. To list a set of search keywords.",
      c: "C. To explain how or why the evidence supports the main point.",
      d: "D. To argue with a differing author's opinion.",
      ans: "C"
    },
    {
      q: "5. What does the 'Link' sentence in a PEEL paragraph do?",
      a: "A. It connects to a website URL link.",
      b: "B. It introduces a subjective feeling.",
      c: "C. It wraps up the paragraph and links back to the main topic or thesis.",
      d: "D. It defines the vocabulary glossary.",
      ans: "C"
    },
    {
      q: "6. Which precise, specialist vocabulary word is the best replacement for the everyday word \"burning\" in a scientific report?",
      a: "A. catching",
      b: "B. hotness",
      c: "C. combustion",
      d: "D. flaming",
      ans: "C"
    },
    {
      q: "7. Which precise, specialist vocabulary word is the best replacement for the everyday word \"plants/leaves/bark\" in an environment report?",
      a: "A. greenery",
      b: "B. vegetation",
      c: "C. bushes",
      d: "D. garden",
      ans: "B"
    },
    {
      q: "8. In the sentence: \"Consequently, this rapid chemical reaction begins.\" What is the role of the word \"Consequently\"?",
      a: "A. It is an expanded noun group.",
      b: "B. It is a text connective that creates logical cohesion.",
      c: "C. It is a specialist science noun.",
      d: "D. It is a subjective, emotional word.",
      ans: "B"
    },
    {
      q: "9. Which of the following body paragraph sentences is an example of 'Evidence'?",
      a: "A. \"I think wind shear is really cool to watch in storms.\"",
      b: "B. \"Tornadoes are extremely scary and fast spinning winds.\"",
      c: "C. \"According to meteorology records, tornadoes can reach wind speeds exceeding 300 kilometres per hour.\"",
      d: "D. \"This shows that tornadoes are highly dangerous events.\"",
      ans: "C"
    },
    {
      q: "10. In our joint construction model: \"Consequently, this fast-spinning vortex descends to the earth, creating a highly destructive windstorm.\" Which part of the PEEL structure is this sentence?",
      a: "A. Point",
      b: "B. Evidence",
      c: "C. Explanation",
      d: "D. Link",
      ans: "D"
    }
  ];

  const children = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "Lesson 19: Writing Body Paragraphs using PEEL Assessment", bold: true, size: 36, color: THEME.navy })],
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
  console.log("Starting resource generation for Lesson 19...");
  
  const baseDir = path.join(__dirname, "..");
  
  const worksheetPath = path.join(baseDir, "Lesson_19_Worksheet.docx");
  await generateWorksheet(worksheetPath);
  
  const lucasHandoutPath = path.join(baseDir, "Lesson_19_Lucas_Handout.docx");
  await generateLucasHandout(lucasHandoutPath);

  const assessmentPath = path.join(baseDir, "Lesson_19_Assessment.docx");
  await generateAssessment(assessmentPath);
  
  console.log("🎉 Resource generation complete!");
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
