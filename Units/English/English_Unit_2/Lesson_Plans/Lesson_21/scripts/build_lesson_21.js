const { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType, PageBreak } = require('docx');
const fs = require('fs');
const path = require('path');

const THEME = {
  navy: '112D4E',
  orange: 'F96D00',
  white: 'F9F7F7',
  blue: '3F72AF',
  darkGrey: '333333',
  lightGrey: 'E0E0E0',
  pureWhite: 'FFFFFF',
  green: '2E7D32',
  red: 'C62828'
};

const tableBorder = { style: BorderStyle.SINGLE, size: 4, color: THEME.lightGrey };
const cellBorders = { top: tableBorder, bottom: tableBorder, left: tableBorder, right: tableBorder };

const TEMPLATE_PATH = 'c:\\Users\\dsuth\\Documents\\Joshua\\.agent\\skills\\english-lesson\\assets\\presentation_template.html';

// Helper function to create source evaluation notes
function createSourceEvaluationRow(stat, defaultSource) {
  return new TableRow({
    children: [
      new TableCell({
        width: { size: 4500, type: WidthType.DXA },
        borders: cellBorders,
        children: [
          new Paragraph({
            children: [new TextRun({ text: stat, size: 20 })],
            spacing: { after: 120 }
          }),
          new Paragraph({
            children: [new TextRun({ text: "Notes / Details found in text:", size: 16, color: THEME.navy, italics: true })],
            spacing: { after: 60 }
          }),
          new Paragraph({
            children: [new TextRun({ text: "____________________________________________________________________\n____________________________________________________________________", size: 16 })],
            spacing: { after: 120 }
          })
        ]
      }),
      new TableCell({
        width: { size: 4500, type: WidthType.DXA },
        borders: cellBorders,
        children: [
          new Paragraph({
            children: [new TextRun({ text: `Source: ${defaultSource}`, bold: true, size: 18, color: THEME.navy })],
            spacing: { after: 120 }
          }),
          new Paragraph({
            children: [new TextRun({ text: "Is this source credible? Why?", size: 16, color: THEME.navy, italics: true })],
            spacing: { after: 60 }
          }),
          new Paragraph({
            children: [new TextRun({ text: "____________________________________________________________________\n____________________________________________________________________", size: 16 })],
            spacing: { after: 120 }
          })
        ]
      })
    ]
  });
}

// Generate standard Year 5 Worksheet
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
          children: [new TextRun({ text: "Lesson 21: Digital Research and Sourced Evidence", bold: true, size: 36, color: THEME.navy })],
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Name: ______________________   Date: _____________", size: 22 })],
          spacing: { after: 400 }
        }),

        // PART 1
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun({ text: "Part 1: Authoritative Sources vs. Unverified Assertions", bold: true, size: 28, color: THEME.orange })],
          spacing: { before: 100, after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Informative reports must rely on credible, authoritative sources. A bare assertion is a claim made without proof. An authoritative claim is backed by scientific data or an official agency.", size: 22 })],
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
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Bare Assertion / Opinion", bold: true, color: THEME.white })] })]
                }),
                new TableCell({
                  width: { size: 4500, type: WidthType.DXA },
                  shading: { fill: THEME.navy, type: ShadingType.CLEAR },
                  borders: cellBorders,
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Authoritative / Sourced Fact", bold: true, color: THEME.white })] })]
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 4500, type: WidthType.DXA },
                  borders: cellBorders,
                  children: [new Paragraph({ children: [new TextRun({ text: "\"The bushfire was huge and really hot, spreading super fast through the dry bush.\"", size: 20, italics: true })] })]
                }),
                new TableCell({
                  width: { size: 4500, type: WidthType.DXA },
                  borders: cellBorders,
                  children: [new Paragraph({ children: [new TextRun({ text: "\"According to Rural Fire Service records, the fire burned through 25,000 hectares of dry forest with crown temperatures exceeding 800 degrees Celsius.\"", size: 20, italics: true })] })]
                })
              ]
            })
          ]
        }),

        new Paragraph({
          children: [new TextRun({ text: "Activity: For each source below, write 'Credible' or 'Unreliable' and briefly explain why.", size: 22, bold: true })],
          spacing: { before: 200, after: 150 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "1. A personal blog post titled: ", bold: true }),
            new TextRun({ text: "\"My Wild Adventure Surviving the Firefront\"\n" }),
            new TextRun({ text: "   Evaluation: ", bold: true }),
            new TextRun({ text: "________________________________________________________________________________________" })
          ],
          spacing: { after: 150 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "2. An official bulletin published by: ", bold: true }),
            new TextRun({ text: "\"The Commonwealth Scientific and Industrial Research Organisation (CSIRO)\"\n" }),
            new TextRun({ text: "   Evaluation: ", bold: true }),
            new TextRun({ text: "________________________________________________________________________________________" })
          ],
          spacing: { after: 250 }
        }),

        // PART 2
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun({ text: "Part 2: Note-Taking from the Bushfires Archive", bold: true, size: 28, color: THEME.blue })],
          spacing: { before: 200, after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Scan the Bushfires Archive (specifically the Ash Wednesday and Black Saturday sub-pages) to locate details related to the following facts, and identify their official authoritative sources.", size: 22 })],
          spacing: { after: 150 }
        }),

        new Table({
          columnWidths: [4500, 4500],
          margins: { top: 120, bottom: 120, left: 180, right: 180 },
          rows: [
            new TableRow({
              tableHeader: true,
              children: [
                new TableCell({
                  width: { size: 4500, type: WidthType.DXA },
                  shading: { fill: THEME.navy, type: ShadingType.CLEAR },
                  borders: cellBorders,
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Fact / Statistics Hunt", bold: true, color: THEME.white })] })]
                }),
                new TableCell({
                  width: { size: 4500, type: WidthType.DXA },
                  shading: { fill: THEME.navy, type: ShadingType.CLEAR },
                  borders: cellBorders,
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Authoritative Source", bold: true, color: THEME.white })] })]
                })
              ]
            }),
            createSourceEvaluationRow("Meteorological reports state that wind speeds reached up to 110 kilometres per hour, causing fire fronts to jump roads instantly.", "Bureau of Meteorology (BoM)"),
            createSourceEvaluationRow("Post-disaster records indicate that over 150,000 hectares of land were destroyed in a single afternoon.", "Black Saturday Royal Commission Report")
          ]
        }),

        new Paragraph({ children: [new PageBreak()] }),

        // PART 3
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun({ text: "Part 3: Sourced Evidence Integration & Attribution", bold: true, size: 28, color: THEME.navy })],
          spacing: { before: 100, after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Practice integrating researched evidence into your writing. Use precise attribution verbs (e.g., states, demonstrates, indicates, reports) and introductory phrases to connect the claim to its source smoothly.", size: 22 })],
          spacing: { after: 150 }
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "1. Integrate this fact: ", bold: true }),
            new TextRun({ text: "\"Over 80% of forest areas recovered naturally within ten years.\"\n" }),
            new TextRun({ text: "   Source: ", bold: true }),
            new TextRun({ text: "CSIRO Forestry Division study\n" }),
            new TextRun({ text: "   Write as a cohesive sentence with attribution: ", bold: true }),
            new TextRun({ text: "\n________________________________________________________________________________________\n________________________________________________________________________________________" })
          ],
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "2. Integrate this fact: ", bold: true }),
            new TextRun({ text: "\"Extreme heat causes dry forest leaves to release flammable eucalyptus gas.\"\n" }),
            new TextRun({ text: "   Source: ", bold: true }),
            new TextRun({ text: "Queensland Fire Department Fire Science bulletin\n" }),
            new TextRun({ text: "   Write as a cohesive sentence with attribution: ", bold: true }),
            new TextRun({ text: "\n________________________________________________________________________________________\n________________________________________________________________________________________" })
          ],
          spacing: { after: 250 }
        }),

        // PART 4
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun({ text: "Part 4: Acknowledging Differing Perspectives", bold: true, size: 28, color: THEME.orange })],
          spacing: { before: 200, after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "High-quality reports present balanced viewpoints on complex topics. Read the two authoritative viewpoints regarding Prescribed Hazard Burns below, and write a cohesive, balanced paragraph integrating both sides.", size: 22 })],
          spacing: { after: 150 }
        }),

        new Table({
          columnWidths: [4500, 4500],
          margins: { top: 120, bottom: 120, left: 150, right: 150 },
          rows: [
            new TableRow({
              tableHeader: true,
              children: [
                new TableCell({
                  width: { size: 4500, type: WidthType.DXA },
                  shading: { fill: THEME.navy, type: ShadingType.CLEAR },
                  borders: cellBorders,
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Viewpoint A: Rural Fire Service", bold: true, color: THEME.white })] })]
                }),
                new TableCell({
                  width: { size: 4500, type: WidthType.DXA },
                  shading: { fill: THEME.navy, type: ShadingType.CLEAR },
                  borders: cellBorders,
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Viewpoint B: Health & Environment Advocates", bold: true, color: THEME.white })] })]
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 4500, type: WidthType.DXA },
                  borders: cellBorders,
                  children: [new Paragraph({ children: [new TextRun({ text: "Hazard reduction burns are crucial to clear dry fuels (leaves, bark) during winter. This directly protects residential areas from high-intensity crown fires in summer.", size: 18 })] })]
                }),
                new TableCell({
                  width: { size: 4500, type: WidthType.DXA },
                  borders: cellBorders,
                  children: [new Paragraph({ children: [new TextRun({ text: "Controlled burns produce thick smoke columns that lower local air quality, triggering severe asthma and respiratory issues, while also disrupting winter ecosystems.", size: 18 })] })]
                })
              ]
            })
          ]
        }),

        new Paragraph({
          children: [new TextRun({ text: "Write your balanced paragraph below (Remember to use a concession connective like 'Although', 'On the other hand', or 'Despite'):", size: 22, bold: true })],
          spacing: { before: 200, after: 120 }
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

// Generate Lucas Differentiated Handout (Year 2 ICP)
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
          children: [new TextRun({ text: "Lesson 21: Differentiated Safety Plan - Firefighter Roles", bold: true, size: 32, color: THEME.navy })],
          spacing: { after: 150 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Name: ______________________   Date: _____________", size: 20 })],
          spacing: { after: 200 }
        }),

        // Info Card
        new Paragraph({
          children: [new TextRun({ text: "Firefighter Reading Card", bold: true, size: 24, color: THEME.orange })],
          spacing: { before: 100, after: 80 }
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
                      children: [new TextRun({ text: "Firefighters do many brave jobs to protect our homes and forests in a bushfire emergency. First, they drive their big red trucks and use strong water hoses to put out the hot flames. Next, they rescue wild animals like koalas and kangaroos, moving them to safe places. Finally, they clear fallen trees and ash to make the roads safe for everyone.", size: 20, italics: true })]
                    })
                  ]
                })
              ]
            })
          ]
        }),

        // Word Bank
        new Paragraph({
          children: [new TextRun({ text: "Word Bank", bold: true, size: 24, color: THEME.blue })],
          spacing: { before: 200, after: 80 }
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
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Action Words", bold: true, color: THEME.white, size: 18 })] })]
                }),
                new TableCell({
                  width: { size: 3000, type: WidthType.DXA },
                  shading: { fill: THEME.orange, type: ShadingType.CLEAR },
                  borders: cellBorders,
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Object Words", bold: true, color: THEME.white, size: 18 })] })]
                }),
                new TableCell({
                  width: { size: 3000, type: WidthType.DXA },
                  shading: { fill: THEME.blue, type: ShadingType.CLEAR },
                  borders: cellBorders,
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Describing Words", bold: true, color: THEME.white, size: 18 })] })]
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 3000, type: WidthType.DXA },
                  borders: cellBorders,
                  children: [new Paragraph({ children: [new TextRun({ text: "put out, rescue, help, clear, drive, spray", size: 18 })] })]
                }),
                new TableCell({
                  width: { size: 3000, type: WidthType.DXA },
                  borders: cellBorders,
                  children: [new Paragraph({ children: [new TextRun({ text: "hose, flames, truck, animals, trees, road", size: 18 })] })]
                }),
                new TableCell({
                  width: { size: 3000, type: WidthType.DXA },
                  borders: cellBorders,
                  children: [new Paragraph({ children: [new TextRun({ text: "brave, red, big, hot, safe, clear, fast", size: 18 })] })]
                })
              ]
            })
          ]
        }),

        new Paragraph({ children: [new PageBreak()] }),

        // Drawing Box
        new Paragraph({
          children: [new TextRun({ text: "My Firefighter Drawing", bold: true, size: 24, color: THEME.navy })],
          spacing: { before: 100, after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Draw a picture of a brave firefighter helping in a bushfire emergency. Add labels to your drawing using words from the word bank.", size: 20 })],
          spacing: { after: 120 }
        }),

        new Table({
          columnWidths: [9000],
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 9000, type: WidthType.DXA },
                  borders: cellBorders,
                  children: [
                    new Paragraph({ text: "\n\n\n\n\n\n\n\n\n\n\n\n\n\n" })
                  ]
                })
              ]
            })
          ]
        }),

        // Sentences
        new Paragraph({
          children: [new TextRun({ text: "My Firefighter Sentences", bold: true, size: 22, color: THEME.orange })],
          spacing: { before: 200, after: 120 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "First, ", bold: true, size: 20, color: THEME.navy }),
            new TextRun({ text: "firefighters use a strong ____________________ to put out the hot ____________________.", size: 20 })
          ],
          spacing: { after: 150 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Then, ", bold: true, size: 20, color: THEME.navy }),
            new TextRun({ text: "they rescue wild ____________________ and keep them ____________________.", size: 20 })
          ],
          spacing: { after: 150 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Finally, ", bold: true, size: 20, color: THEME.navy }),
            new TextRun({ text: "they clear fallen ____________________ to make the road ____________________.", size: 20 })
          ],
          spacing: { after: 150 }
        })
      ]
    }]
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(filename, buffer);
  console.log("✅ Lucas Handout generated.");
}

// Generate MS Forms Assessment
async function generateAssessment(filename) {
  const questions = [
    {
      q: "1. What is the primary difference between a 'bare assertion' and an 'authoritative sourced claim'?",
      a: "A. Sourced claims are much longer and more difficult to read.",
      b: "B. Sourced claims are backed by credible scientific organizations or official reports.",
      c: "C. Sourced claims contain the personal opinions of the author.",
      d: "D. Bare assertions are only found in books and never on websites.",
      ans: "B"
    },
    {
      q: "2. Which of the following is considered an authoritative source for weather and fire weather research?",
      a: "A. A personal travel blog about bushfires.",
      b: "B. A social media post from a local community page.",
      c: "C. The Bureau of Meteorology (BoM).",
      d: "D. A fictional story about a wildfire.",
      ans: "C"
    },
    {
      q: "3. In which of the following excerpts is a source attributed with the most precise academic terminology?",
      a: "A. People say that fires burn really fast in the bush.",
      b: "B. According to official reports from the Rural Fire Service, wind speeds reached 110 km/h.",
      c: "C. I read online that fires are extremely dangerous.",
      d: "D. Firefighters think that dry fuel is bad.",
      ans: "B"
    },
    {
      q: "4. What is the purpose of using attribution verbs like 'indicates', 'demonstrates', or 'proves' in a report?",
      a: "A. To make the sentences feel repetitive and standard.",
      b: "B. To signal the relationship between the facts and the authoritative research.",
      c: "C. To add emotional weight and personal feelings to the writing.",
      d: "D. To remove the need for technical vocabulary.",
      ans: "B"
    },
    {
      q: "5. When writing about natural disasters, why is it important to scan digital texts instead of reading every word?",
      a: "A. Scanning helps find specific facts and their sources quickly without wasting time.",
      b: "B. Scanning lets the writer copy entire paragraphs word-for-word.",
      c: "C. Scanning allows the writer to skip the editing process.",
      d: "D. Scanning makes the text more subjective and dramatic.",
      ans: "A"
    },
    {
      q: "6. Which of the following is a concession connective used to introduce a balanced or differing perspective?",
      a: "A. Consequently",
      b: "B. Therefore",
      c: "C. On the other hand",
      d: "D. For this reason",
      ans: "C"
    },
    {
      q: "7. Why do professional authors present differing perspectives on topics like controlled hazard burns?",
      a: "A. To make the report confusing for young readers.",
      b: "B. To provide a balanced, complete view of a complex issue using credible evidence.",
      c: "C. To show that no facts in the report can be trusted.",
      d: "D. To avoid choosing a specific natural disaster topic.",
      ans: "B"
    },
    {
      q: "8. Select the sentence that correctly integrates a sourced quote with precise academic attribution.",
      a: "A. Fire is hot which is what the CSIRO said.",
      b: "B. A CSIRO forestry study demonstrates that over 80% of forest areas recovered naturally within ten years.",
      c: "C. The CSIRO wrote a paper about forest areas that recovered.",
      d: "D. Natural recovery is easy according to some scientists I know.",
      ans: "B"
    },
    {
      q: "9. Which source would be the most credible for researching structural damages from historical bushfires?",
      a: "A. A community newsletter written by local volunteers.",
      b: "B. Official findings published in the Black Saturday Royal Commission Report.",
      c: "C. A forum post comparing bushfires to floods.",
      d: "D. A diary entry written by a student in Victoria.",
      ans: "B"
    },
    {
      q: "10. In the sentence: 'Although hazard burns are essential for clearing forest fuels, reports indicate they can create temporary health challenges.' Which word introduces the concession?",
      a: "A. reports",
      b: "B. temporary",
      c: "C. Although",
      d: "D. challenges",
      ans: "C"
    }
  ];

  const children = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "Lesson 21: Digital Research and Sourced Evidence Assessment", bold: true, size: 36, color: THEME.navy })],
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

// Generate the Standalone Interactive Presentation HTML using standard wrapper template
async function generateHTMLPresentation(outputFilename) {
  if (!fs.existsSync(TEMPLATE_PATH)) {
    throw new Error(`Presentation template wrapper not found at: ${TEMPLATE_PATH}`);
  }

  let templateContent = fs.readFileSync(TEMPLATE_PATH, 'utf8');

  // Verify core template IDs exist
  const requiredMarkers = [
    'id="presentationContainer"',
    'id="masterToolbar"',
    'id="teacherNotesPanel"',
    'id="whiteboardOverlay"',
    'id="imageLightbox"',
    'id="teacherShowAnswerBtn"'
  ];
  requiredMarkers.forEach(marker => {
    if (!templateContent.includes(marker)) {
      throw new Error(`Wrapper Integrity Error: Standard template is missing required visual component marker "${marker}".`);
    }
  });

  const slidesData = [
    {
      title: "Digital Research & Sourced Evidence",
      subtitle: "Lesson 21: Selecting Authoritative Sources and Integrating Researched Facts",
      theme: "dark",
      standardHtml: `
        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100%; min-height: 480px;">
          <div style="border: 4px solid var(--orange); padding: 40px; border-radius: var(--rounded-lg); background-color: rgba(0, 24, 51, 0.6); box-shadow: 10px 10px 0px rgba(0, 0, 0, 0.4); max-width: 1000px; text-align: left; width: 100%;">
            <div style="display: inline-block; background-color: var(--orange); color: var(--pure-white); font-family: 'Outfit', sans-serif; font-size: 20px; font-weight: bold; padding: 6px 16px; border-radius: var(--rounded-sm); margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1px;">Week 6 · Lesson 21</div>
            <h1 style="font-size: 64px; line-height: 1.1; margin-bottom: 20px; color: var(--pure-white); font-family: 'Outfit', sans-serif; text-transform: none; letter-spacing: 0;">Digital Research &<br><span style="color: var(--orange);">Sourced Evidence</span></h1>
            <p style="font-size: 28px; color: var(--text-light); font-family: 'Inter', sans-serif; line-height: 1.4;">Evaluating source credibility, digital note-taking, and integrating authoritative evidence into informative writing.</p>
          </div>
        </div>
      `,
      lucasHtml: "",
      teacherNotes: "Welcome back, Year 5! Today, we are bridging the gap between raw research and formal report writing. We'll explore how to verify sources, scan for facts, and integrate quotes with professional attribution. Make sure to draw their attention to how sources make arguments persuasive."
    },
    {
      title: "Learning Intention & Success Criteria",
      theme: "light",
      standardHtml: `
        <div class="grid-container" style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 30px; margin-top: 10px; height: 100%;">
          <!-- Left Column: LI -->
          <div class="card" style="border-left: 8px solid var(--orange); padding: 30px; height: 100%; display: flex; flex-direction: column; justify-content: center; box-shadow: 6px 6px 0px var(--navy);">
            <div style="display: inline-block; background-color: var(--navy); color: var(--pure-white); font-family: 'Outfit', sans-serif; font-weight: bold; font-size: 18px; padding: 4px 12px; border-radius: var(--rounded-sm); margin-bottom: 20px; text-transform: uppercase; text-align: center; max-width: 220px;">Learning Intention</div>
            <p style="font-size: 30px; line-height: 1.5; color: var(--navy); font-weight: 500; font-family: 'Inter', sans-serif;">I can <span class="highlight">research and select information</span> from authoritative sources to develop and expand ideas in my report.</p>
          </div>
          
          <!-- Right Column: SC -->
          <div style="display: flex; flex-direction: column; gap: 15px;">
            <div style="font-family: 'Outfit', sans-serif; font-size: 28px; font-weight: bold; color: var(--navy); margin-bottom: 5px;">Success Criteria:</div>
            <div class="card" style="border-left: 6px solid var(--blue); padding: 15px; display: flex; align-items: center; gap: 15px; box-shadow: 4px 4px 0px var(--navy);">
              <span style="font-size: 32px; color: var(--orange); flex-shrink: 0;">🔎</span>
              <span style="font-size: 22px; font-weight: 500; color: var(--navy);">Distinguish between authoritative, credible sources and personal opinions.</span>
            </div>
            <div class="card" style="border-left: 6px solid var(--blue); padding: 15px; display: flex; align-items: center; gap: 15px; box-shadow: 4px 4px 0px var(--navy);">
              <span style="font-size: 32px; color: var(--orange); flex-shrink: 0;">📊</span>
              <span style="font-size: 22px; font-weight: 500; color: var(--navy);">Scan the Bushfires Archive to select precise, factual disaster statistics.</span>
            </div>
            <div class="card" style="border-left: 6px solid var(--blue); padding: 15px; display: flex; align-items: center; gap: 15px; box-shadow: 4px 4px 0px var(--navy);">
              <span style="font-size: 32px; color: var(--orange); flex-shrink: 0;">✍️</span>
              <span style="font-size: 22px; font-weight: 500; color: var(--navy);">Write sentences that attribute researched quotes to their official sources.</span>
            </div>
            <div class="card" style="border-left: 6px solid var(--blue); padding: 15px; display: flex; align-items: center; gap: 15px; box-shadow: 4px 4px 0px var(--navy);">
              <span style="font-size: 32px; color: var(--orange); flex-shrink: 0;">⚖️</span>
              <span style="font-size: 22px; font-weight: 500; color: var(--navy);">Construct balanced paragraphs that acknowledge differing perspectives.</span>
            </div>
          </div>
        </div>
      `,
      lucasHtml: `
        <div class="grid-container" style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 30px; margin-top: 10px; height: 100%;">
          <!-- Left Column: LI -->
          <div class="card" style="border-left: 8px solid var(--navy); padding: 30px; height: 100%; display: flex; flex-direction: column; justify-content: center; box-shadow: 6px 6px 0px var(--orange);">
            <div style="display: inline-block; background-color: var(--orange); color: var(--pure-white); font-family: 'Outfit', sans-serif; font-weight: bold; font-size: 18px; padding: 4px 12px; border-radius: var(--rounded-sm); margin-bottom: 20px; text-transform: uppercase; text-align: center; max-width: 220px;">My Learning Goal</div>
            <p style="font-size: 30px; line-height: 1.5; color: var(--navy); font-weight: 500; font-family: 'Inter', sans-serif;">I can <span class="highlight">find a fact</span> in a text about firefighter roles and share its meaning.</p>
          </div>
          
          <!-- Right Column: SC -->
          <div style="display: flex; flex-direction: column; gap: 15px;">
            <div style="font-family: 'Outfit', sans-serif; font-size: 28px; font-weight: bold; color: var(--navy); margin-bottom: 5px;">My Checklist:</div>
            <div class="card" style="border-left: 6px solid var(--orange); padding: 18px; display: flex; align-items: center; gap: 15px; box-shadow: 4px 4px 0px var(--navy);">
              <span style="font-size: 32px; flex-shrink: 0;">🚒</span>
              <span style="font-size: 22px; font-weight: bold; color: var(--navy);">Find one important thing firefighters do in a bushfire.</span>
            </div>
            <div class="card" style="border-left: 6px solid var(--orange); padding: 18px; display: flex; align-items: center; gap: 15px; box-shadow: 4px 4px 0px var(--navy);">
              <span style="font-size: 32px; flex-shrink: 0;">🎨</span>
              <span style="font-size: 22px; font-weight: bold; color: var(--navy);">Draw a firefighter helping in an emergency.</span>
            </div>
            <div class="card" style="border-left: 6px solid var(--orange); padding: 18px; display: flex; align-items: center; gap: 15px; box-shadow: 4px 4px 0px var(--navy);">
              <span style="font-size: 32px; flex-shrink: 0;">✏️</span>
              <span style="font-size: 22px; font-weight: bold; color: var(--navy);">Complete safety sentences using my word bank.</span>
            </div>
          </div>
        </div>
      `,
      teacherNotes: "Introduce the Learning Intention. Toggle between the standard Year 5 pathway and Lucas's Year 2 pathway. Lucas's focus is on locating firefighter roles from the text."
    },
    {
      title: "Activate: Sourced Fact vs. Opinion",
      theme: "light",
      standardHtml: `
        <div style="border-left: 6px solid var(--navy); background-color: var(--pure-white); padding: 20px 24px; border-radius: var(--rounded-md); box-shadow: var(--shadow-sm); border-bottom: 3px solid var(--orange); margin-bottom: 25px;">
          <p style="font-size: 24px; line-height: 1.5; color: var(--text-dark);">Read these two statements. Which one is a stronger research statement? Why?</p>
        </div>
        <div class="grid-container" style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 25px;">
          <!-- Card A: Assertion -->
          <div class="card" style="border-left: 6px solid var(--red-error); border-top: 3px solid var(--navy) !important; padding: 25px; box-shadow: 6px 6px 0px var(--navy); background-color: var(--pure-white); display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <span style="background-color: var(--red-error); color: var(--pure-white); font-family: 'Outfit', sans-serif; font-weight: bold; font-size: 18px; padding: 4px 12px; border-radius: var(--rounded-sm); text-transform: uppercase;">Statement A (Bare Assertion)</span>
                <span style="font-size: 24px;">⚠️</span>
              </div>
              <p style="font-size: 22px; font-style: italic; color: var(--navy); line-height: 1.5; margin-bottom: 20px;">
                "Bushfires are getting worse and more dangerous every single year in Australia."
              </p>
            </div>
            <div style="border-top: 1px solid var(--soft-grey); padding-top: 12px; font-size: 18px; color: #555; font-weight: 500;">
              No evidence provided. Represents a general opinion.
            </div>
          </div>
          
          <!-- Card B: Sourced Fact -->
          <div class="card" style="border-left: 6px solid var(--green-success); border-top: 3px solid var(--navy) !important; padding: 25px; box-shadow: 6px 6px 0px var(--navy); background-color: var(--pure-white); display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <span style="background-color: var(--green-success); color: var(--pure-white); font-family: 'Outfit', sans-serif; font-weight: bold; font-size: 18px; padding: 4px 12px; border-radius: var(--rounded-sm); text-transform: uppercase;">Statement B (Sourced Fact)</span>
                <span style="font-size: 24px;">🛡️</span>
              </div>
              <p style="font-size: 22px; font-style: italic; color: var(--navy); line-height: 1.5; margin-bottom: 20px;">
                "<span style="color: var(--orange); font-weight: 600;">According to climate records</span> from the <span style="color: var(--orange); font-weight: 600;">Bureau of Meteorology</span>, the frequency of extreme fire weather days has <span style="color: var(--orange); font-weight: 600;">increased by over 40%</span> since 1950."
              </p>
            </div>
            <div style="border-top: 1px solid var(--soft-grey); padding-top: 12px; font-size: 18px; color: #555; font-weight: 500;">
              Backed by a credible scientific agency with precise data.
            </div>
          </div>
        </div>
        <div class="remember-box">
          <p><strong>Remember:</strong> Anyone can make a bare assertion. Researched, sourced facts build authority and make your information report professional!</p>
        </div>
      `,
      lucasHtml: `
        <p style="font-size: 24px; margin-bottom: 20px;">Look at these firefighter tools. Discuss what they help firefighters do:</p>
        <div class="lucas-match-container">
          <div class="lucas-cards-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;">
            <div class="lucas-card" style="border: 3px solid var(--navy); padding: 25px; border-radius: var(--rounded-lg); text-align: center; box-shadow: 6px 6px 0px var(--navy); background-color: var(--pure-white);">
              <span class="lucas-icon" style="font-size: 64px; display: block; margin-bottom: 15px;">🚒</span>
              <span class="lucas-card-text" style="font-size: 22px; font-weight: bold; color: var(--navy);">Red Fire Truck</span>
              <p style="font-size: 18px; color: #555; margin-top: 10px;">Drives firefighters fast to emergencies.</p>
            </div>
            <div class="lucas-card" style="border: 3px solid var(--navy); padding: 25px; border-radius: var(--rounded-lg); text-align: center; box-shadow: 6px 6px 0px var(--navy); background-color: var(--pure-white);">
              <span class="lucas-icon" style="font-size: 64px; display: block; margin-bottom: 15px;">💦</span>
              <span class="lucas-card-text" style="font-size: 22px; font-weight: bold; color: var(--navy);">Water Hose</span>
              <p style="font-size: 18px; color: #555; margin-top: 10px;">Sprays strong water to put out flames.</p>
            </div>
            <div class="lucas-card" style="border: 3px solid var(--navy); padding: 25px; border-radius: var(--rounded-lg); text-align: center; box-shadow: 6px 6px 0px var(--navy); background-color: var(--pure-white);">
              <span class="lucas-icon" style="font-size: 64px; display: block; margin-bottom: 15px;">🪓</span>
              <span class="lucas-card-text" style="font-size: 22px; font-weight: bold; color: var(--navy);">Rescue Tools</span>
              <p style="font-size: 18px; color: #555; margin-top: 10px;">Helps clear roads and save animals.</p>
            </div>
          </div>
          <p style="text-align:center; font-size:24px; color:var(--navy); font-weight:bold; margin-top:30px;">How do these tools help keep our local communities safe?</p>
        </div>
      `,
      teacherNotes: "Standard: Discuss the differences. Note that Statement B is backed by a credible agency (BoM) with statistics. Lucas: Match icons to firefighter tools and discuss their purpose."
    },
    {
      title: "Explore: Evaluating Sources",
      theme: "light",
      standardHtml: `
        <p style="font-size: 24px; margin-bottom: 20px;">Not all sources are equal. When conducting digital research, evaluate credibility:</p>
        <div class="grid-container" style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 25px;">
          <!-- Credible Matrix -->
          <div class="card" style="border-top: 6px solid #2E7D32 !important; border: 3px solid var(--navy); padding: 25px; box-shadow: 6px 6px 0px var(--navy); background-color: var(--pure-white);">
            <div class="card-title" style="color:#2E7D32; font-size:26px; font-weight:bold; margin-bottom: 15px; display:flex; align-items:center; gap:10px;">
              <span>✅</span> Authoritative (Credible)
            </div>
            <ul style="list-style-type: none; padding-left: 0;">
              <li style="font-size:20px; margin-bottom:12px; padding-left:25px; position:relative;"><span style="position:absolute; left:0; color:#2E7D32;">•</span><strong>Emergency Services:</strong> Rural Fire Services (RFS, QFD, CFA)</li>
              <li style="font-size:20px; margin-bottom:12px; padding-left:25px; position:relative;"><span style="position:absolute; left:0; color:#2E7D32;">•</span><strong>Science Organisations:</strong> CSIRO, University research divisions</li>
              <li style="font-size:20px; margin-bottom:12px; padding-left:25px; position:relative;"><span style="position:absolute; left:0; color:#2E7D32;">•</span><strong>Official Investigations:</strong> Royal Commission disaster inquiry records</li>
              <li style="font-size:20px; margin-bottom:12px; padding-left:25px; position:relative;"><span style="position:absolute; left:0; color:#2E7D32;">•</span><strong>Meteorology:</strong> Bureau of Meteorology official records</li>
            </ul>
          </div>
          
          <!-- Unverified Matrix -->
          <div class="card" style="border-top: 6px solid #C62828 !important; border: 3px solid var(--navy); padding: 25px; box-shadow: 6px 6px 0px var(--navy); background-color: var(--pure-white);">
            <div class="card-title" style="color:#C62828; font-size:26px; font-weight:bold; margin-bottom: 15px; display:flex; align-items:center; gap:10px;">
              <span>❌</span> Personal / Unverified
            </div>
            <ul style="list-style-type: none; padding-left: 0;">
              <li style="font-size:20px; margin-bottom:12px; padding-left:25px; position:relative;"><span style="position:absolute; left:0; color:#C62828;">•</span>Personal travel blogs or survival adventure entries</li>
              <li style="font-size:20px; margin-bottom:12px; padding-left:25px; position:relative;"><span style="position:absolute; left:0; color:#C62828;">•</span>Social media community threads or personal post entries</li>
              <li style="font-size:20px; margin-bottom:12px; padding-left:25px; position:relative;"><span style="position:absolute; left:0; color:#C62828;">•</span>Unreferenced internet forum boards or public discussions</li>
              <li style="font-size:20px; margin-bottom:12px; padding-left:25px; position:relative;"><span style="position:absolute; left:0; color:#C62828;">•</span>Subjective, highly emotional, opinion-heavy accounts</li>
            </ul>
          </div>
        </div>
        <div class="remember-box" style="border-left-color: var(--blue); background-color: var(--soft-grey);">
          <p><strong>Socratic Question:</strong> Why do official reports and science journals carry more weight than individual social media posts during disaster planning?</p>
        </div>
      `,
      lucasHtml: `
        <div class="grid-container" style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 30px; margin-top: 10px;">
          <!-- Left Column: Reading -->
          <div class="card" style="border-left: 8px solid var(--orange); border-top: 3px solid var(--navy) !important; padding: 25px; box-shadow: 6px 6px 0px var(--navy); background-color: var(--pure-white); display:flex; flex-direction:column; justify-content:center;">
            <div style="font-family: 'Outfit', sans-serif; font-size:26px; font-weight:bold; color:var(--navy); margin-bottom:15px; display:flex; align-items:center; gap:8px;">
              <span>🛡️</span> Firefighter Reading Card:
            </div>
            <p style="font-size: 22px; line-height: 1.6; font-style: italic; color: #43474e;">
              "Firefighters do many brave jobs in bushfires. <strong>First</strong>, they use water hoses to put out the hot flames. <strong>Then</strong>, they rescue wild animals and move them to safety. <strong>Finally</strong>, they clear roads from fallen trees."
            </p>
          </div>
          
          <!-- Right Column: Timeline -->
          <div style="display:flex; flex-direction:column; gap:12px;">
            <div style="font-family: 'Outfit', sans-serif; font-size: 26px; font-weight: bold; color: var(--navy); margin-bottom: 5px;">3 Brave Actions:</div>
            <div class="card" style="padding: 15px; border-left: 6px solid var(--navy); box-shadow: 4px 4px 0px var(--navy); display:flex; align-items:center; gap:12px;">
              <span style="background-color: var(--orange); color:var(--pure-white); font-weight:bold; font-size:16px; padding:4px 10px; border-radius:4px; text-transform:uppercase;">First</span>
              <span style="font-size: 20px; font-weight:bold; color:var(--navy);">Put out hot flames with hoses</span>
            </div>
            <div class="card" style="padding: 15px; border-left: 6px solid var(--navy); box-shadow: 4px 4px 0px var(--navy); display:flex; align-items:center; gap:12px;">
              <span style="background-color: var(--orange); color:var(--pure-white); font-weight:bold; font-size:16px; padding:4px 10px; border-radius:4px; text-transform:uppercase;">Then</span>
              <span style="font-size: 20px; font-weight:bold; color:var(--navy);">Rescue wild animals to safety</span>
            </div>
            <div class="card" style="padding: 15px; border-left: 6px solid var(--navy); box-shadow: 4px 4px 0px var(--navy); display:flex; align-items:center; gap:12px;">
              <span style="background-color: var(--orange); color:var(--pure-white); font-weight:bold; font-size:16px; padding:4px 10px; border-radius:4px; text-transform:uppercase;">Finally</span>
              <span style="font-size: 20px; font-weight:bold; color:var(--navy);">Clear roads from fallen trees</span>
            </div>
          </div>
        </div>
      `,
      teacherNotes: "Standard: Teach the criteria for authority. Point out that official agencies have rigorous scientific verification. Lucas: Guide through reading the mentor snippet, emphasizing the sequence connectives."
    },
    {
      title: "Model: Attributing Sourced Facts",
      theme: "light",
      standardHtml: `
        <!-- White Intro Box -->
        <div style="border-left: 6px solid var(--navy); background-color: var(--pure-white); padding: 20px 24px; border-radius: var(--rounded-md); box-shadow: 6px 6px 0px var(--navy); margin-bottom: 25px;">
          <p style="font-size: 24px; line-height: 1.5; color: var(--text-dark);">To strengthen academic writing, writers use specific <strong style="color: var(--navy); border-bottom: 3px solid var(--orange); padding-bottom: 2px;">attribution phrases</strong> and <strong style="color: var(--navy); border-bottom: 3px solid var(--orange); padding-bottom: 2px;">verbs</strong>. These signals tell the reader exactly where information originates, increasing the credibility of your arguments.</p>
        </div>
        
        <!-- Horizontal Spanned Cards -->
        <div class="grid-container" style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 25px;">
          <!-- Phrase Card -->
          <div class="card" style="border: 3px solid var(--navy); border-radius: var(--rounded-md); padding: 25px; box-shadow: 6px 6px 0px var(--navy); background-color: var(--pure-white); display: flex; flex-direction: column; justify-content: space-between; min-height: 200px;">
            <div>
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                <span style="background-color: var(--orange); color: var(--pure-white); font-family: 'Outfit', sans-serif; font-weight: bold; font-size: 18px; padding: 4px 14px; border-radius: var(--rounded-sm); text-transform: uppercase;">Phrase</span>
                <span style="font-size: 26px; color: var(--orange); font-family: 'Outfit', sans-serif; font-weight: bold; line-height: 1;">””</span>
              </div>
              <p style="font-size: 22px; font-style: italic; color: var(--navy); line-height: 1.5; margin-bottom: 20px;">
                "According to <span style="color: var(--orange); font-weight: bold; border-bottom: 2px solid var(--orange); padding-bottom: 1px;">meteorological records published by the BoM</span>, the frequency of extreme events is rising."
              </p>
            </div>
            <div style="border-top: 1px solid var(--soft-grey); padding-top: 12px; display: flex; align-items: center; gap: 10px;">
              <span style="display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; background-color: var(--navy); color: var(--pure-white); font-family: 'Inter', sans-serif; font-size: 13px; font-weight: bold; font-style: italic;">i</span>
              <span style="font-size: 18px; color: #43474e; font-weight: 500;">Focuses on the source location or identity.</span>
            </div>
          </div>
          
          <!-- Verb Card -->
          <div class="card" style="border: 3px solid var(--navy); border-radius: var(--rounded-md); padding: 25px; box-shadow: 6px 6px 0px var(--navy); background-color: var(--pure-white); display: flex; flex-direction: column; justify-content: space-between; min-height: 200px;">
            <div>
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                <span style="background-color: var(--navy); color: var(--pure-white); font-family: 'Outfit', sans-serif; font-weight: bold; font-size: 18px; padding: 4px 14px; border-radius: var(--rounded-sm); text-transform: uppercase;">Verb</span>
                <span style="font-size: 22px; color: var(--navy);">💡</span>
              </div>
              <p style="font-size: 22px; font-style: italic; color: var(--navy); line-height: 1.5; margin-bottom: 20px;">
                "...a <span style="color: var(--orange); font-weight: bold; border-bottom: 2px solid var(--orange); padding-bottom: 1px;">CSIRO forestry division study demonstrates that</span> controlled burns reduce long-term risk."
              </p>
            </div>
            <div style="border-top: 1px solid var(--soft-grey); padding-top: 12px; display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 22px; color: var(--orange);">⚡</span>
              <span style="font-size: 18px; color: #43474e; font-weight: 500;">Uses active language to show the source's action.</span>
            </div>
          </div>
        </div>
        
        <!-- Bottom Balanced Synthesis Section -->
        <div style="background-color: var(--navy); border-radius: var(--rounded-md); padding: 25px; position: relative; overflow: hidden; box-shadow: var(--shadow-md);">
          <!-- SVG Scale Watermark background on right -->
          <div style="position: absolute; right: 20px; top: 50%; transform: translateY(-50%); opacity: 0.08; pointer-events: none; color: white;">
            <svg width="150" height="150" fill="currentColor" viewBox="0 0 512 512">
              <path d="M448 384c-28.02 0-51.26-19.29-57.14-44.86L288 304v136h40c13.25 0 24 10.75 24 24s-10.75 24-24 24H184c-13.25 0-24-10.75-24-24s10.75-24 24-24h40V304L121.14 339.14C115.26 364.71 92.02 384 64 384c-35.3 0-64-28.7-64-64 0-14.88 5.12-28.53 13.6-39.38l64-80c10.48-13.1 30.32-13.1 40.8 0l64 80C182.88 291.47 188 305.12 188 320c0 10.02-2.3 19.51-6.4 28.02L256 320l74.4 28.02c-4.1-8.51-6.4-18-6.4-28.02 0-14.88 5.12-28.53 13.6-39.38l64-80c10.48-13.1 30.32-13.1 40.8 0l64 80C506.88 291.47 512 305.12 512 320c0 35.3-28.7 64-64 64zM64 336c8.84 0 16-7.16 16-16s-7.16-16-16-16-16 7.16-16 16 7.16 16 16 16zm384 0c8.84 0 16-7.16 16-16s-7.16-16-16-16-16 7.16-16 16 7.16 16 16 16zM320 80c0-13.25-10.75-24-24-24h-16V32c0-17.67-14.33-32-32-32s-32 14.33-32 32v24h-16c-13.25 0-24 10.75-24 24s10.75 24 24 24h112c13.25 0 24-10.75 24-24z"/>
            </svg>
          </div>
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 15px;">
            <span style="font-size: 24px; color: var(--orange); font-weight: bold; margin-right: 5px;">⤳</span>
            <h3 style="font-family: 'Outfit', sans-serif; font-size: 24px; font-weight: bold; color: var(--white); border: none; padding: 0; margin: 0;">Integrating Differing Perspectives (Balanced Paragraph)</h3>
          </div>
          <div style="background-color: rgba(255, 255, 255, 0.07); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: var(--rounded-md); padding: 20px 24px; margin-bottom: 15px;">
            <p style="font-size: 22px; line-height: 1.6; color: var(--white); font-weight: 400; font-family: 'Inter', sans-serif;">
              "Although winter controlled hazard reduction burns are essential for removing dry fuel loads <span style="color: var(--orange); font-weight: 600;">as recommended by the Rural Fire Service</span>, reports from <span style="color: var(--orange); font-weight: 600;">Queensland Health indicate</span> that these burns can trigger temporary respiratory challenges for local communities."
            </p>
          </div>
          <div style="display: flex; gap: 15px;">
            <span style="background-color: rgba(255, 255, 255, 0.08); color: var(--white); font-family: 'Outfit', sans-serif; font-size: 16px; font-weight: bold; padding: 6px 14px; border-radius: 4px; display: inline-flex; align-items: center; gap: 6px; border: 1.5px solid rgba(255, 255, 255, 0.15); box-shadow: 2px 2px 0px rgba(255, 255, 255, 0.15);">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style="margin-right: 4px;"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
              Credible Sourcing
            </span>
            <span style="background-color: rgba(255, 255, 255, 0.08); color: var(--white); font-family: 'Outfit', sans-serif; font-size: 16px; font-weight: bold; padding: 6px 14px; border-radius: 4px; display: inline-flex; align-items: center; gap: 6px; border: 1.5px solid rgba(255, 255, 255, 0.15); box-shadow: 2px 2px 0px rgba(255, 255, 255, 0.15);">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style="margin-right: 4px;"><path d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm0 2V20c4.42 0 8-3.58 8-8s-3.58-8-8-8z"/></svg>
              Balanced Synthesis
            </span>
          </div>
        </div>
      `,
      lucasHtml: `
        <p style="font-size: 24px; margin-bottom: 20px;">Let's plan our firefighter safety sentences together:</p>
        <div class="scenario-box" style="font-size: 24px; border-left-color: var(--orange); background-color: var(--soft-grey); padding: 20px; border-radius: var(--rounded-md);">
          <p style="font-weight: bold; color: var(--navy); margin-bottom: 15px;">Differentiated Sentence Frames:</p>
          <ul style="list-style-type:none; padding-left:0;">
            <li style="margin-bottom:15px; font-size:22px;"><strong style="color:var(--orange);">First,</strong> firefighters use a strong <span style="border-bottom: 3px dashed var(--navy); padding: 0 30px; font-weight:bold; color:var(--orange);">hose</span> to put out hot flames.</li>
            <li style="margin-bottom:15px; font-size:22px;"><strong style="color:var(--orange);">Then,</strong> they rescue wild <span style="border-bottom: 3px dashed var(--navy); padding: 0 30px; font-weight:bold; color:var(--orange);">animals</span> to keep them safe.</li>
            <li style="margin-bottom:15px; font-size:22px;"><strong style="color:var(--orange);">Finally,</strong> they clear fallen <span style="border-bottom: 3px dashed var(--navy); padding: 0 30px; font-weight:bold; color:var(--orange);">trees</span> to clear roads.</li>
          </ul>
        </div>
        <div style="margin-top:25px; padding:15px; background-color:#edf7ed; border-radius:8px; display:flex; justify-content:center; align-items:center; gap:10px;">
          <span style="font-size:24px;">🔑</span>
          <span style="font-size:20px; font-weight:bold; color:#1e4620;">Word Bank choices to place in blanks: hose, animals, trees.</span>
        </div>
      `,
      teacherNotes: "Standard: Guide through attribution structures. Unpack the balanced model, highlighting the concession 'Although' and attribution verb 'indicate'. Lucas: Model matching word bank words to plan sentences."
    },
    {
      title: "Connect: Match Sourced Claims",
      theme: "light",
      standardHtml: `
        <div style="border-left: 6px solid var(--navy); background-color: var(--pure-white); padding: 20px 24px; border-radius: var(--rounded-md); box-shadow: var(--shadow-sm); border-bottom: 3px solid var(--orange); margin-bottom: 25px;">
          <p style="font-size: 24px; line-height: 1.5; color: var(--text-dark);">Tap a <strong>Researched Fact</strong> on the left, then select its <strong>Authoritative Source</strong> on the right:</p>
        </div>
        
        <div class="match-container" id="matchSlideContainer" style="width:100%;">
          <div class="match-cols-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; width:100%;">
            <!-- Left Column: Facts -->
            <div class="match-col" style="display:flex; flex-direction:column; gap:16px;" id="factsColumn">
              <div class="match-card draggable-fact" data-match="1" style="min-height:90px; padding:15px; border-radius:var(--rounded-md); cursor:pointer; font-size:20px; line-height:1.4;">
                "The frequency of extreme fire weather days has increased by over 40% since 1950."
              </div>
              <div class="match-card draggable-fact" data-match="2" style="min-height:90px; padding:15px; border-radius:var(--rounded-md); cursor:pointer; font-size:20px; line-height:1.4;">
                "Over 80% of native forest recovery after intense blazes relies on seed banks in the soil."
              </div>
              <div class="match-card draggable-fact" data-match="3" style="min-height:90px; padding:15px; border-radius:var(--rounded-md); cursor:pointer; font-size:20px; line-height:1.4;">
                "Immediate air evacuations are triggered when fire fronts exceed 10 metres in height."
              </div>
              <div class="match-card draggable-fact" data-match="4" style="min-height:90px; padding:15px; border-radius:var(--rounded-md); cursor:pointer; font-size:20px; line-height:1.4;">
                "Accumulated forest fuels must be reduced to under 8 tonnes per hectare to prevent crown fires."
              </div>
            </div>
            
            <!-- Right Column: Sources -->
            <div class="match-col" style="display:flex; flex-direction:column; gap:16px;" id="sourcesColumn">
              <div class="match-card clickable-source" data-source="2" style="min-height:90px; padding:15px; border-radius:var(--rounded-md); cursor:pointer; font-size:22px; font-weight:bold; color:var(--navy); justify-content:center;">
                CSIRO Forestry Research
              </div>
              <div class="match-card clickable-source" data-source="1" style="min-height:90px; padding:15px; border-radius:var(--rounded-md); cursor:pointer; font-size:22px; font-weight:bold; color:var(--navy); justify-content:center;">
                Bureau of Meteorology (BoM)
              </div>
              <div class="match-card clickable-source" data-source="4" style="min-height:90px; padding:15px; border-radius:var(--rounded-md); cursor:pointer; font-size:22px; font-weight:bold; color:var(--navy); justify-content:center;">
                Rural Fire Service (RFS)
              </div>
              <div class="match-card clickable-source" data-source="3" style="min-height:90px; padding:15px; border-radius:var(--rounded-md); cursor:pointer; font-size:22px; font-weight:bold; color:var(--navy); justify-content:center;">
                Queensland Fire Department (QFD)
              </div>
            </div>
          </div>
          
          <!-- Feedback and Hint -->
          <div class="feedback-box" style="margin-top: 20px;">
            <div class="feedback-text success" id="standardFeedbackSuccess" style="color:var(--green-success); font-size:24px; font-weight:bold; display:none;">✨ Correct Match! Source verified.</div>
            <div class="feedback-text error" id="standardFeedbackError" style="color:var(--red-error); font-size:24px; font-weight:bold; display:none;">❌ Source mismatch. Try again!</div>
          </div>
          
          <div class="hint-box" id="standardHintBox" style="display:none; background:#fff3cd; border-left:6px solid var(--orange); padding:15px; font-size:20px; border-radius:4px; margin-top:10px; width:100%;">
            <strong>Hint:</strong> Look for keywords like 'fire weather' for BoM, 'forest recovery' for CSIRO, and 'crown fires' for Rural Fire Service guidelines!
          </div>
        </div>

        <script>
          (function() {
            const slide = document.getElementById('slide-6');
            const facts = slide.querySelectorAll('.draggable-fact');
            const sources = slide.querySelectorAll('.clickable-source');
            const feedbackSuccess = slide.querySelector('#standardFeedbackSuccess');
            const feedbackError = slide.querySelector('#standardFeedbackError');
            const hintBox = slide.querySelector('#standardHintBox');
            
            let selectedFact = null;
            let mistakeCount = 0;
            let matchedPairs = 0;

            facts.forEach(fact => {
              fact.addEventListener('click', () => {
                if (fact.classList.contains('matched')) return;
                facts.forEach(f => f.classList.remove('selected'));
                fact.classList.add('selected');
                selectedFact = fact;
              });
            });

            sources.forEach(source => {
              source.addEventListener('click', () => {
                if (source.classList.contains('matched') || !selectedFact) return;
                
                const matchId = selectedFact.getAttribute('data-match');
                const sourceId = source.getAttribute('data-source');
                
                feedbackSuccess.style.display = 'none';
                feedbackError.style.display = 'none';

                if (matchId === sourceId) {
                  // SUCCESS
                  selectedFact.classList.remove('selected');
                  selectedFact.classList.add('matched');
                  selectedFact.style.borderColor = '#2E7D32';
                  selectedFact.style.background = '#e8f5e9';
                  
                  source.classList.add('matched');
                  source.style.borderColor = '#2E7D32';
                  source.style.background = '#e8f5e9';
                  
                  feedbackSuccess.style.display = 'block';
                  selectedFact = null;
                  matchedPairs++;
                  
                  if (matchedPairs === 4) {
                    feedbackSuccess.innerHTML = "🎉 Excellent! All claims have been matched to their authoritative sources.";
                  }
                } else {
                  // MISTAKE
                  mistakeCount++;
                  selectedFact.classList.add('shake-error');
                  source.classList.add('shake-error');
                  feedbackError.style.display = 'block';
                  
                  setTimeout(() => {
                    selectedFact.classList.remove('shake-error');
                    source.classList.remove('shake-error');
                  }, 500);

                  if (mistakeCount >= 2) {
                    hintBox.style.display = 'block';
                  }
                }
              });
            });

            // Master Teacher Notes Show Answer override
            slide.addEventListener('show-answer', () => {
              facts.forEach(fact => {
                const matchId = fact.getAttribute('data-match');
                fact.classList.add('matched');
                fact.style.borderColor = '#2E7D32';
                fact.style.background = '#e8f5e9';
                
                sources.forEach(source => {
                  if (source.getAttribute('data-source') === matchId) {
                    source.classList.add('matched');
                    source.style.borderColor = '#2E7D32';
                    source.style.background = '#e8f5e9';
                  }
                });
              });
              feedbackSuccess.style.display = 'block';
              feedbackSuccess.innerHTML = "✨ Teacher Override: All sources paired successfully.";
              feedbackError.style.display = 'none';
              hintBox.style.display = 'none';
              matchedPairs = 4;
            });
          })();
        </script>
      `,
      lucasHtml: `
        <p style="font-size: 24px; margin-bottom: 20px;">Click on a <strong>Firefighter Action</strong> to plan our safety drawings:</p>
        <div class="lucas-match-container" id="lucasMatchSlideContainer" style="width:100%;">
          <div class="lucas-cards-grid" id="lucasCardsGrid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;">
            <div class="lucas-card lucas-interactive-card" data-action="1" style="min-height:160px; display:flex; flex-direction:column; justify-content:center; align-items:center;">
              <span class="lucas-icon" style="font-size: 48px;">🔥</span>
              <span class="lucas-card-text" style="font-size:20px; font-weight:bold; margin-top:8px;">Put out hot flames</span>
            </div>
            <div class="lucas-card lucas-interactive-card" data-action="2" style="min-height:160px; display:flex; flex-direction:column; justify-content:center; align-items:center;">
              <span class="lucas-icon" style="font-size: 48px;">🐨</span>
              <span class="lucas-card-text" style="font-size:20px; font-weight:bold; margin-top:8px;">Rescue wild animals</span>
            </div>
            <div class="lucas-card lucas-interactive-card" data-action="3" style="min-height:160px; display:flex; flex-direction:column; justify-content:center; align-items:center;">
              <span class="lucas-icon" style="font-size: 48px;">🌲</span>
              <span class="lucas-card-text" style="font-size:20px; font-weight:bold; margin-top:8px;">Clear fallen trees</span>
            </div>
          </div>
          
          <div class="lucas-sequence-panel" id="lucasSequenceLines" style="margin-top:30px; min-height:120px; display:flex; flex-direction:column; gap:12px; background-color:var(--soft-grey); padding:20px; border-radius:8px; border:2px solid rgba(0, 24, 51, 0.15);">
            <div class="lucas-sequence-line" id="l-line-1" style="font-size:22px; font-weight:bold; opacity:0.3; border-left:6px solid #cbd5e1; padding-left:15px; transition:all 0.3s ease;">"First, firefighters use water hoses to put out hot flames."</div>
            <div class="lucas-sequence-line" id="l-line-2" style="font-size:22px; font-weight:bold; opacity:0.3; border-left:6px solid #cbd5e1; padding-left:15px; transition:all 0.3s ease;">"Then, they rescue wild animals to keep them safe."</div>
            <div class="lucas-sequence-line" id="l-line-3" style="font-size:22px; font-weight:bold; opacity:0.3; border-left:6px solid #cbd5e1; padding-left:15px; transition:all 0.3s ease;">"Finally, they clear fallen trees to clear roads."</div>
          </div>
        </div>

        <script>
          (function() {
            const slide = document.getElementById('slide-6');
            const cards = slide.querySelectorAll('.lucas-interactive-card');
            const lines = {
              "1": slide.querySelector('#l-line-1'),
              "2": slide.querySelector('#l-line-2'),
              "3": slide.querySelector('#l-line-3')
            };

            cards.forEach(card => {
              card.addEventListener('click', () => {
                const actionId = card.getAttribute('data-action');
                
                // Toggle status
                card.classList.toggle('correct');
                if (card.classList.contains('correct')) {
                  card.style.borderColor = '#2e7d32';
                  card.style.background = 'rgba(46, 125, 50, 0.08)';
                  lines[actionId].classList.add('active');
                  lines[actionId].classList.add('done');
                  lines[actionId].style.borderLeftColor = '#2e7d32';
                  lines[actionId].style.opacity = '1';
                } else {
                  card.style.borderColor = '';
                  card.style.background = '';
                  lines[actionId].classList.remove('active');
                  lines[actionId].classList.remove('done');
                  lines[actionId].style.borderLeftColor = '';
                  lines[actionId].style.opacity = '0.3';
                }
              });
            });

            // Master Teacher Notes Show Answer override
            slide.addEventListener('show-answer', () => {
              cards.forEach(card => {
                card.classList.add('correct');
                card.style.borderColor = '#2e7d32';
                card.style.background = 'rgba(46, 125, 50, 0.08)';
              });
              Object.keys(lines).forEach(key => {
                lines[key].classList.add('active');
                lines[key].classList.add('done');
                lines[key].style.borderLeftColor = '#2e7d32';
                lines[key].style.opacity = '1';
              });
            });
          })();
        </script>
      `,
      teacherNotes: "Connect Phase. Standard: Students select a fact and match it. Wrong matches shake and trigger error. First mismatch: Tier 1 error. Second mismatch: Tier 2 hint. Lucas: Click cards to activate the planned safety sentences."
    },
    {
      title: "Consolidate & Review",
      theme: "light",
      standardHtml: `
        <div class="grid-container" style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 30px; margin-top: 10px;">
          <!-- Left Column: Checklist -->
          <div style="display:flex; flex-direction:column; gap:15px;">
            <div style="font-family: 'Outfit', sans-serif; font-size: 28px; font-weight: bold; color: var(--navy); margin-bottom: 5px;">Research Checklist:</div>
            <div class="card" style="padding: 15px; border-left: 6px solid var(--green-success); box-shadow: 4px 4px 0px var(--navy); display:flex; align-items:center; gap:15px;">
              <span style="font-size: 28px; color: var(--green-success);">✔️</span>
              <span style="font-size: 22px; font-weight: 500; color:var(--navy);">Have you added at least <strong>two authoritative sources</strong> to your planning scaffold?</span>
            </div>
            <div class="card" style="padding: 15px; border-left: 6px solid var(--green-success); box-shadow: 4px 4px 0px var(--navy); display:flex; align-items:center; gap:15px;">
              <span style="font-size: 28px; color: var(--green-success);">✔️</span>
              <span style="font-size: 22px; font-weight: 500; color:var(--navy);">Have you integrated a quote using an <strong>attribution verb</strong> in your writing book?</span>
            </div>
            <div class="card" style="padding: 15px; border-left: 6px solid var(--green-success); box-shadow: 4px 4px 0px var(--navy); display:flex; align-items:center; gap:15px;">
              <span style="font-size: 28px; color: var(--green-success);">✔️</span>
              <span style="font-size: 22px; font-weight: 500; color:var(--navy);">Does your paragraph balanced writing show <strong>both perspectives</strong> clearly?</span>
            </div>
          </div>
          
          <!-- Right Column: Reflection Box -->
          <div class="card" style="border-left: 8px solid var(--orange); border-top: 3px solid var(--navy) !important; padding: 30px; box-shadow: 6px 6px 0px var(--navy); background-color: var(--pure-white); display:flex; flex-direction:column; justify-content:center;">
            <div style="display: inline-block; background-color: var(--orange); color: var(--pure-white); font-family: 'Outfit', sans-serif; font-weight: bold; font-size: 18px; padding: 4px 12px; border-radius: var(--rounded-sm); margin-bottom: 20px; text-transform: uppercase;">Reflection Prompt</div>
            <p style="font-size: 24px; line-height: 1.6; color: var(--navy); font-weight: 500; font-family: 'Inter', sans-serif;">
              Write 1 sentence in your writing book:
              <br><br>
              <em style="font-size: 26px; color: var(--orange); font-weight: 600;">"Using authoritative sources makes my report credible because..."</em>
            </p>
          </div>
        </div>
      `,
      lucasHtml: `
        <div style="display:flex; flex-direction:column; justify-content:center; align-items:center; height:100%; min-height:450px;">
          <div class="card" style="border: 3px solid var(--navy); padding: 40px; border-radius: var(--rounded-xl); background: var(--pure-white); box-shadow: 8px 8px 0px var(--navy); max-width:800px; text-align:center;">
            <div style="font-size:72px; margin-bottom:20px; animation: bounceIn 0.8s ease-in-out;">🌟</div>
            <h3 style="font-family:'Outfit', sans-serif; font-size:36px; font-weight:bold; color:var(--navy); margin-bottom:15px;">Brave Firefighter Certified!</h3>
            <p style="font-size:24px; color:#555; line-height:1.5; margin-bottom:25px;">Excellent work, Lucas! You have planned your firefighter safety plan and matched your actions.</p>
            <div style="display:inline-block; background-color:var(--orange); color:var(--pure-white); font-family:'Outfit', sans-serif; font-weight:bold; font-size:20px; padding:10px 24px; border-radius:var(--rounded-full); text-transform:uppercase; box-shadow:4px 4px 0px var(--navy);">
              Share Your Plan With a Peer!
            </div>
          </div>
        </div>
      `,
      teacherNotes: "Consolidate. Standard: Wrap up and have them write the reflection sentence. Differentiated: Praise Lucas for his plan, have him share his drawing with a peer."
    }
  ];

  let slidesHtml = '';

  slidesData.forEach((slide, idx) => {
    let slideClass = `slide theme-${slide.theme || 'light'}`;
    if (idx === 0) slideClass += ' active';

    let slideMarkup = `    <!-- SLIDE ${idx + 1}: ${slide.title} -->\n`;
    slideMarkup += `    <section class="${slideClass}" id="slide-${idx + 1}">\n`;

    // Slide Header
    if (slide.theme === 'dark') {
      slideMarkup += `      <div class="fade-in-up">\n        <h1>${slide.title}</h1>\n      </div>\n`;
      if (slide.subtitle) {
        slideMarkup += `      <div class="fade-in-up delay-1">\n        <p class="subtitle" style="font-size:26px; color:var(--text-light); margin-top:20px;">${slide.subtitle}</p>\n      </div>\n`;
      }
    } else {
      slideMarkup += `      <h2 class="slide-title fade-in-up">${slide.title}</h2>\n`;
    }

    // Content body
    slideMarkup += `      <div class="content fade-in-up delay-1">\n`;

    if (slide.lucasHtml) {
      slideMarkup += `        <!-- Standard Pathway Content -->\n`;
      slideMarkup += `        <div class="standard-only">\n          ${slide.standardHtml}\n        </div>\n`;
      slideMarkup += `        <!-- Lucas Pathway Content (Australian Curriculum v9 ICP compliant) -->\n`;
      slideMarkup += `        <div class="lucas-only">\n          ${slide.lucasHtml}\n        </div>\n`;
    } else {
      slideMarkup += `        <div>\n          ${slide.standardHtml}\n        </div>\n`;
    }

    slideMarkup += `      </div>\n`;

    // Slide Teacher Notes
    if (slide.teacherNotes) {
      slideMarkup += `      <div class="teacher-notes" style="display: none;">\n        ${slide.teacherNotes}\n      </div>\n`;
    }

    slideMarkup += `    </section>\n\n`;
    slidesHtml += slideMarkup;
  });

  const placeholder = '<!-- SLIDES GO HERE DURING DYNAMIC COMPILATION -->';
  let compiledContent = templateContent.replace(placeholder, slidesHtml);

  // Update TITLE tag in head and inject DESIGN.md system overrides
  const customStyles = `
<title>Lesson 21: Digital Research and Sourced Evidence</title>
<style>
  /* Kinetic Academy - DESIGN.md system overrides */
  :root {
    --navy: #001833 !important;
    --primary-container: #112d4e !important;
    --orange: #fe7107 !important;
    --secondary-dark: #9e4300 !important;
    --white: #fbf9f9 !important;
    --blue: #476083 !important;
    --text-dark: #1b1c1c !important;
    --text-light: #43474e !important;
    --pure-white: #ffffff !important;
    --soft-grey: #efeded !important;
    --green-success: #2e7d32 !important;
    --red-error: #c62828 !important;
    
    /* Rounded corners */
    --rounded-sm: 0.125rem !important;
    --rounded-default: 0.25rem !important;
    --rounded-md: 0.375rem !important;
    --rounded-lg: 0.5rem !important;
    --rounded-xl: 0.75rem !important;
    --rounded-full: 9999px !important;
    
    /* Spacing */
    --slide-padding-top: 40px !important;
    --slide-padding-x: 70px !important;
    --slide-padding-bottom: 80px !important;
    --container-gap: 28px !important;
    --grid-gap: 24px !important;
    --vertical-flow: 20px !important;
    --component-padding: 28px !important;
  }

  /* Slide padding adjustments */
  .slide {
    padding: 110px 70px 110px !important; /* Prevent header and footer overlap */
    background-color: var(--white) !important;
    color: var(--text-dark) !important;
  }
  
  .slide.theme-dark {
    background-color: var(--navy) !important;
    color: var(--pure-white) !important;
    justify-content: center !important;
    align-items: center !important;
    display: flex !important;
  }

  /* Typography system */
  .theme-dark h1 {
    font-family: 'Outfit', sans-serif !important;
    font-size: 72px !important;
    font-weight: 700 !important;
    line-height: 1.1 !important;
  }
  
  .theme-light h2.slide-title {
    font-family: 'Outfit', sans-serif !important;
    font-size: 46px !important;
    font-weight: 700 !important;
    line-height: 1.2 !important;
    color: var(--navy) !important;
    border-bottom: none !important; /* Remove bottom line */
    border-left: 8px solid var(--orange) !important; /* Left thick accent block */
    padding-left: 15px !important;
    margin-bottom: 25px !important;
  }
  
  .content {
    font-family: 'Inter', sans-serif !important;
    font-size: 26px !important;
    font-weight: 400 !important;
    line-height: 1.5 !important;
    color: var(--text-dark) !important;
  }
  
  /* Desktop TopAppBar Styles */
  .top-app-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 70px;
    background-color: var(--pure-white);
    border-bottom: 2px solid rgba(0, 24, 51, 0.1);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 40px;
    z-index: 1000;
    font-family: 'Outfit', sans-serif;
  }

  .top-app-bar .logo {
    font-size: 32px;
    font-weight: 700;
    color: var(--navy);
  }

  .top-app-bar .nav-links {
    display: flex;
    gap: 30px;
  }

  .top-app-bar .nav-link {
    font-size: 18px;
    font-weight: 600;
    color: #555;
    text-decoration: none;
    position: relative;
    padding: 8px 0;
    transition: color 0.2s;
  }

  .top-app-bar .nav-link:hover {
    color: var(--navy);
  }

  .top-app-bar .nav-link.active {
    color: var(--navy);
  }

  .top-app-bar .nav-link.active::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    right: 0;
    height: 4px;
    background-color: var(--orange);
    border-radius: 2px;
  }

  .top-app-bar .actions {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .top-app-bar .diff-toggle-container {
    background-color: var(--navy);
    color: var(--pure-white);
    border: none;
    padding: 8px 20px;
    border-radius: 30px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: var(--shadow-sm);
    transition: all 0.2s;
  }

  .top-app-bar .diff-toggle-container:hover {
    background-color: var(--orange);
    transform: translateY(-1px);
  }

  .top-app-bar .action-btn {
    background-color: rgba(0, 24, 51, 0.05);
    color: var(--navy);
    border: none;
    padding: 8px 16px;
    border-radius: 30px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s;
  }

  .top-app-bar .action-btn:hover {
    background-color: var(--navy);
    color: var(--pure-white);
    transform: translateY(-1px);
  }

  .top-app-bar .play-btn {
    width: 40px;
    height: 40px;
    padding: 0;
    justify-content: center;
    border-radius: 50%;
  }
  
  /* Custom bottom nav bar styles matching the screenshot */
  .presentation-toolbar {
    position: fixed !important;
    bottom: 0px !important;
    left: 50% !important;
    transform: translateX(-50%) !important;
    background-color: #0b1d33 !important; /* Rich Dark Navy */
    border: none !important;
    border-radius: 12px 12px 0 0 !important; /* Docked capsule style */
    padding: 10px 30px 15px 30px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 30px !important;
    z-index: 1100 !important;
    box-shadow: 0 -5px 25px rgba(0, 0, 0, 0.4) !important;
    width: auto !important;
    min-width: 500px !important;
  }
  
  .toolbar-group {
    display: flex !important;
    border: none !important;
    padding: 0 !important;
    margin: 0 !important;
    gap: 30px !important;
  }

  .toolbar-nav-btn {
    background: transparent !important;
    border: none !important;
    color: #8b9bb4 !important; /* Muted gold-grey text */
    cursor: pointer !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    font-family: 'Outfit', sans-serif !important;
    font-size: 14px !important;
    font-weight: 700 !important;
    letter-spacing: 1px !important;
    gap: 6px !important;
    transition: all 0.2s ease !important;
    padding: 5px 15px !important;
    border-radius: 8px !important;
  }

  .toolbar-nav-btn:hover {
    color: var(--white) !important;
    transform: translateY(-2px) !important;
  }

  .toolbar-nav-btn.active {
    color: #fe7107 !important; /* Active gold-orange accent */
  }

  .toolbar-nav-btn svg {
    width: 24px !important;
    height: 24px !important;
    fill: currentColor !important;
  }

  /* Interactive Cards & Buttons - Neo-Brutalisim */
  .match-card, .sort-card, .quiz-option-btn, .draggable-item, .btn-action, .interactive-submit-btn, .lucas-card {
    font-family: 'Inter', sans-serif !important;
    font-size: 24px !important;
    font-weight: 500 !important;
    line-height: 1.4 !important;
    background-color: var(--pure-white) !important;
    border: 3px solid var(--navy) !important;
    border-radius: var(--rounded-md) !important;
    box-shadow: 6px 6px 0px var(--navy) !important;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
    color: var(--navy) !important;
  }
  
  .match-card:hover:not(.matched), .sort-card:hover:not(.locked), .quiz-option-btn:hover:not(.disabled), .interactive-submit-btn:hover:not(:disabled), .lucas-card:hover {
    background-color: var(--white) !important;
    box-shadow: 6px 6px 0px var(--orange) !important;
    transform: translate(-2px, -2px) !important;
  }
  
  .match-card.selected, .sort-card.selected, .lucas-card.selected {
    background-color: var(--orange) !important;
    color: var(--pure-white) !important;
    box-shadow: 4px 4px 0px var(--navy) !important;
  }
  
  /* Active press simulation */
  .match-card:active:not(.matched), .sort-card:active:not(.locked), .quiz-option-btn:active:not(.disabled), .interactive-submit-btn:active:not(:disabled) {
    transform: translate(2px, 2px) !important;
    box-shadow: 0px 0px 0px var(--navy) !important;
  }
  
  /* States */
  .matched, .correct, .correct-placed, .correct-seq {
    background-color: var(--green-success) !important;
    color: var(--pure-white) !important;
    border-color: var(--navy) !important;
    box-shadow: none !important;
    transform: none !important;
  }
  
  .incorrect, .incorrect-match, .incorrect-seq {
    background-color: var(--red-error) !important;
    color: var(--pure-white) !important;
    border-color: var(--navy) !important;
    box-shadow: none !important;
    transform: none !important;
  }

  /* Lucas Cards Grid */
  .lucas-card {
    border-radius: var(--rounded-lg) !important;
    border: 3px solid var(--navy) !important;
    box-shadow: 6px 6px 0px var(--navy) !important;
  }
  
  .lucas-card.correct {
    background-color: var(--green-success) !important;
    color: var(--pure-white) !important;
  }
  
  /* General boxes */
  .mentor-box, .scenario-box, .remember-box {
    border-radius: var(--rounded-md) !important;
    background-color: var(--soft-grey) !important;
    border: none !important;
    padding: 16px 20px !important;
    font-size: 24px !important;
    color: var(--text-dark) !important;
  }
  
  .mentor-box { border-left: 6px solid var(--blue) !important; }
  .remember-box { border-left: 6px solid var(--orange) !important; }
  .scenario-box { border-left: 6px solid var(--orange) !important; }
  
  /* Grids */
  .grid-container {
    gap: var(--grid-gap) !important;
  }
  
  .card {
    border-radius: var(--rounded-md) !important;
    border: 3px solid var(--navy) !important;
    box-shadow: 4px 4px 0px var(--navy) !important;
  }
</style>
`;
  compiledContent = compiledContent.replace(/<title>.*?<\/title>/i, customStyles);

  // Inject TopAppBar into Body
  const topAppBarHtml = `<body>
  <!-- Desktop-scale TopAppBar -->
  <header class="top-app-bar">
    <div class="logo">Kinetic Academy</div>
    <nav class="nav-links">
      <a href="#" class="nav-link active">Resources</a>
      <a href="#" class="nav-link">Curriculum</a>
      <a href="#" class="nav-link">Models</a>
    </nav>
    <div class="actions">
      <!-- Differentiation Switch Container -->
      <div class="diff-toggle-container" onclick="document.getElementById('pathwayToggleBtn').click()" title="Toggle learning pathway">
        <span class="icon">📊</span>
        <span>Differentiate</span>
        <label class="switch" style="margin-left: 10px; pointer-events: none;">
          <input type="checkbox" id="pathwayToggleBtnSync">
          <span class="slider"></span>
        </label>
      </div>
      <button class="action-btn play-btn" onclick="scrollToSlide(activeIndex + 1)" title="Play Presentation">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
      </button>
      <button class="action-btn export-btn" title="Export Presentation">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
        <span>Export</span>
      </button>
      <button class="action-btn share-btn" title="Share Presentation">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z"/></svg>
        <span>Share</span>
      </button>
    </div>
  </header>`;

  compiledContent = compiledContent.replace('<body>', topAppBarHtml);

  const customToolbarHtml = `
  <!-- Redesigned control toolbar matching the premium layout -->
  <nav class="presentation-toolbar" id="masterToolbar">
    <div style="display: none;">
      <!-- Hidden buttons so original JS listeners don't throw errors -->
      <button id="highlighterModeBtn"></button>
      <button id="clearCanvasBtn"></button>
      <button id="whiteboardToggleBtn"></button>
    </div>
    <div class="toolbar-group">
      <button class="toolbar-nav-btn" id="prevSlideBtn">
        <svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
        <span>PREVIOUS</span>
      </button>
      <button class="toolbar-nav-btn" id="penModeBtn">
        <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
        <span>DRAW</span>
      </button>
      <button class="toolbar-nav-btn active" id="cursorModeBtn">
        <svg viewBox="0 0 24 24"><path d="M22.7 19l-9.1-9.1c.9-2.1.4-4.7-1.5-6.6C10.1 1.3 7.2.7 4.9 1.5l5.4 5.4-3 3-5.4-5.4C1.1 6.8 1.7 9.7 3.7 11.7c1.9 1.9 4.5 2.4 6.6 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2-2c.3-.3.3-.9-.1-1.3z"/></svg>
        <span>TOOLS</span>
      </button>
      <button class="toolbar-nav-btn" id="notesToggleBtn">
        <svg viewBox="0 0 24 24"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>
        <span>RESOURCES</span>
      </button>
      <button class="toolbar-nav-btn" id="nextSlideBtn">
        <svg viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
        <span>NEXT</span>
      </button>
    </div>
  </nav>
  `;

  // We can locate and replace the entire original toolbar element
  const originalToolbarRegex = /<nav class="presentation-toolbar" id="masterToolbar">[\s\S]*?<\/nav>/i;
  compiledContent = compiledContent.replace(originalToolbarRegex, customToolbarHtml);

  // Sync header toggle and original checkbox
  const syncScript = `
    // Sync header toggle and original checkbox
    const syncBtn = document.getElementById('pathwayToggleBtnSync');
    const mainBtn = document.getElementById('pathwayToggleBtn');
    if (syncBtn && mainBtn) {
      syncBtn.addEventListener('change', (e) => {
        mainBtn.checked = e.target.checked;
        mainBtn.dispatchEvent(new Event('change'));
      });
      mainBtn.addEventListener('change', (e) => {
        syncBtn.checked = e.target.checked;
      });
      // Set initial sync state
      syncBtn.checked = mainBtn.checked;
    }

    window.addEventListener('DOMContentLoaded', () => {
  `;
  compiledContent = compiledContent.replace("window.addEventListener('DOMContentLoaded', () => {", syncScript);

  fs.writeFileSync(outputFilename, compiledContent, 'utf8');
  console.log("✅ Interactive HTML Presentation generated: " + path.basename(outputFilename));
}

async function run() {
  console.log("Starting resource generation for Lesson 21...");

  const baseDir = path.join(__dirname, "..");
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
  }

  const worksheetPath = path.join(baseDir, "Lesson_21_Worksheet.docx");
  await generateWorksheet(worksheetPath);

  const lucasHandoutPath = path.join(baseDir, "Lesson_21_Lucas_Handout.docx");
  await generateLucasHandout(lucasHandoutPath);

  const assessmentPath = path.join(baseDir, "Lesson_21_Assessment.docx");
  await generateAssessment(assessmentPath);

  const presentationPath = path.join(baseDir, "Lesson_21_Presentation.html");
  await generateHTMLPresentation(presentationPath);

  console.log("🎉 Resource generation complete!");
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
