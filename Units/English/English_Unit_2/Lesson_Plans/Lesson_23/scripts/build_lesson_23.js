const { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType, PageBreak } = require('docx');
const fs = require('fs');
const path = require('path');

const THEME = {
  navy: '001833',
  orange: 'FE7107',
  white: 'FBF9F9',
  blue: '476083',
  darkGrey: '1B1C1C',
  lightGrey: 'EFEDED',
  pureWhite: 'FFFFFF',
  green: '2E7D32',
  red: 'C62828'
};

const tableBorder = { style: BorderStyle.SINGLE, size: 4, color: THEME.lightGrey };
const cellBorders = { top: tableBorder, bottom: tableBorder, left: tableBorder, right: tableBorder };

// Helper to create visual analysis lines
function createVisualAnalysisRow(feature, description) {
  return new TableRow({
    children: [
      new TableCell({
        width: { size: 3000, type: WidthType.DXA },
        borders: cellBorders,
        shading: { fill: THEME.lightGrey },
        children: [
          new Paragraph({
            children: [new TextRun({ text: feature, bold: true, size: 20, color: THEME.navy })],
            spacing: { before: 120, after: 120 }
          })
        ]
      }),
      new TableCell({
        width: { size: 6000, type: WidthType.DXA },
        borders: cellBorders,
        children: [
          new Paragraph({
            children: [new TextRun({ text: description, size: 18, italics: true })],
            spacing: { before: 120, after: 120 }
          }),
          new Paragraph({
            children: [new TextRun({ text: "Write the caption purpose below (Ethos, Pathos, or Logos):", size: 16, color: THEME.blue, bold: true })],
            spacing: { before: 60, after: 60 }
          }),
          new Paragraph({
            children: [new TextRun({ text: "________________________________________________________________________________", size: 16 })],
            spacing: { after: 120 }
          })
        ]
      })
    ]
  });
}

// Generate Standard Year 5 Worksheet
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
          children: [new TextRun({ text: "Lesson 23: Multimodal Meaning and Fire Science", bold: true, size: 36, color: THEME.navy })],
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Name: ______________________   Date: _____________", size: 22 })],
          spacing: { after: 400 }
        }),

        // PART 1
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun({ text: "Part 1: Multimodal Visual Analysis & Argumentation", bold: true, size: 28, color: THEME.orange })],
          spacing: { before: 100, after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Multimodal information reports use captions to frame how readers interpret visual features. Ethos establishes credibility, Pathos appeals to emotion, and Logos appeals to logic and reason.", size: 22 })],
          spacing: { after: 200 }
        }),

        new Table({
          columnWidths: [3000, 6000],
          margins: { top: 120, bottom: 120, left: 150, right: 150 },
          rows: [
            new TableRow({
              tableHeader: true,
              children: [
                new TableCell({
                  width: { size: 3000, type: WidthType.DXA },
                  shading: { fill: THEME.navy },
                  borders: cellBorders,
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Visual Feature / Image", bold: true, color: THEME.pureWhite })] })]
                }),
                new TableCell({
                  width: { size: 6000, type: WidthType.DXA },
                  shading: { fill: THEME.navy },
                  borders: cellBorders,
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Caption and Rhetorical Framing", bold: true, color: THEME.pureWhite })] })]
                })
              ]
            }),
            createVisualAnalysisRow("PPE Breakdown Graphic", "\"According to the Queensland Fire Department, fire-retardant proban jackets can withstand temperatures over 800 degrees Celsius, providing essential safety for frontline personnel.\""),
            createVisualAnalysisRow("Black Summer Koala Rescue", "\"A volunteer offers a water bottle to a severely burned and dehydrated koala, highlighting the ecological devastation of the eastern coast bushfires.\""),
            createVisualAnalysisRow("Black Saturday Aerial view", "\"Aerial mapping of Kinglake township demonstrates that over 90% of structural damage occurred along the direct pathway of the south-westerly wind change.\"")
          ]
        }),

        new Paragraph({
          children: [new TextRun({ text: "Caption Practice: Choose one image from the Bushfires website and write a caption that utilizes Logos (a logical, fact-based claim supported by a source).", size: 22, bold: true })],
          spacing: { before: 200, after: 120 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Caption: ________________________________________________________________________________________\n________________________________________________________________________________________", size: 20 })],
          spacing: { after: 200 }
        }),

        new Paragraph({ children: [new PageBreak()] }),

        // PART 2
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun({ text: "Part 2: Core Fire Science (Literal Retrieval)", bold: true, size: 28, color: THEME.blue })],
          spacing: { before: 200, after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Answer the following fire science questions based on the details in the Bushfires Archive. Be precise with scientific terms.", size: 22 })],
          spacing: { after: 150 }
        }),

        new Paragraph({
          children: [new TextRun({ text: "1. What are the three components of the Fire Triangle, and how does breaking it extinguish a fire?", bold: true })],
          spacing: { before: 100, after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "________________________________________________________________________________________\n________________________________________________________________________________________", size: 20 })],
          spacing: { after: 200 }
        }),

        new Paragraph({
          children: [new TextRun({ text: "2. Describe the physical role of moisture content in forest fuel load flammability.", bold: true })],
          spacing: { before: 150, after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "________________________________________________________________________________________\n________________________________________________________________________________________", size: 20 })],
          spacing: { after: 200 }
        }),

        new Paragraph({
          children: [new TextRun({ text: "3. Identify the combination of fire weather metrics (wind speed, temperature, relative humidity) that represents a Catastrophic risk level in Australian savannas.", bold: true })],
          spacing: { before: 150, after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "________________________________________________________________________________________\n________________________________________________________________________________________", size: 20 })],
          spacing: { after: 250 }
        }),

        new Paragraph({ children: [new PageBreak()] }),

        // PART 3
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun({ text: "Part 3: Northern Firehawks (Deep Inferential Thinking)", bold: true, size: 28, color: THEME.navy })],
          spacing: { before: 100, after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Inferential comprehension requires reading between the lines to understand the ecological adaptations and Land Management implications of firehawk raptors.", size: 22 })],
          spacing: { after: 150 }
        }),

        new Paragraph({
          children: [new TextRun({ text: "1. Avian Vectors: How do Whistling Kites and Brown Falcons use smoke columns to coordinate their hunting, and how does this show spatial planning?", bold: true })],
          spacing: { before: 100, after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "________________________________________________________________________________________\n________________________________________________________________________________________\n________________________________________________________________________________________", size: 20 })],
          spacing: { after: 200 }
        }),

        new Paragraph({
          children: [new TextRun({ text: "2. Intentional Tool Use: Detail the 5-step process. Why do scientists argue this behaviour is goal-directed and intentional rather than purely accidental?", bold: true })],
          spacing: { before: 150, after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "________________________________________________________________________________________\n________________________________________________________________________________________\n________________________________________________________________________________________", size: 20 })],
          spacing: { after: 200 }
        }),

        new Paragraph({
          children: [new TextRun({ text: "3. The Controversy: Explain why Western researchers are skeptical about firehawk behaviour compared to Rangers and centuries of Indigenous ecological knowledge.", bold: true })],
          spacing: { before: 150, after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "________________________________________________________________________________________\n________________________________________________________________________________________\n________________________________________________________________________________________", size: 20 })],
          spacing: { after: 200 }
        }),

        new Paragraph({
          children: [new TextRun({ text: "4. Land Management: How does the presence of Firehawks complicate controlled burns for rangers? What adjustments must be made to firebreaks?", bold: true })],
          spacing: { before: 150, after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "________________________________________________________________________________________\n________________________________________________________________________________________\n________________________________________________________________________________________", size: 20 })],
          spacing: { after: 200 }
        })
      ]
    }]
  });
  
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(filename, buffer);
  console.log("✅ Year 5 Standard Worksheet created.");
}

// Generate Differentiated Year 2 Handout
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
          children: [new TextRun({ text: "Lesson 23: Differentiated Activity - Firehawks & Firefighters", bold: true, size: 32, color: THEME.navy })],
          spacing: { after: 150 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Name: ______________________   Date: _____________", size: 20 })],
          spacing: { after: 200 }
        }),

        // Reading Card
        new Paragraph({
          children: [new TextRun({ text: "Firehawk and Firefighter Reading Card", bold: true, size: 24, color: THEME.orange })],
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
                      children: [new TextRun({ text: "In Northern Australia, clever birds called Firehawks hunt near bushfires. These birds fly into smoky areas to grab smouldering twigs. They fly across wide rivers and roads, dropping the burning sticks into dry grass to start small fires. When insects and little lizards run away from the sparks, the bird swoops down for a fast meal! Firefighters have to work hard, using yellow safety jackets and water hoses to keep communities safe.", size: 20, italics: true })]
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
                  shading: { fill: THEME.navy },
                  borders: cellBorders,
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Action Words", bold: true, color: THEME.pureWhite, size: 18 })] })]
                }),
                new TableCell({
                  width: { size: 3000, type: WidthType.DXA },
                  shading: { fill: THEME.orange },
                  borders: cellBorders,
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Object Words", bold: true, color: THEME.pureWhite, size: 18 })] })]
                }),
                new TableCell({
                  width: { size: 3000, type: WidthType.DXA },
                  shading: { fill: THEME.blue },
                  borders: cellBorders,
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Describing Words", bold: true, color: THEME.pureWhite, size: 18 })] })]
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 3000, type: WidthType.DXA },
                  borders: cellBorders,
                  children: [new Paragraph({ children: [new TextRun({ text: "flying, carrying, spraying, dropping, helping", size: 18 })] })]
                }),
                new TableCell({
                  width: { size: 3000, type: WidthType.DXA },
                  borders: cellBorders,
                  children: [new Paragraph({ children: [new TextRun({ text: "twig, fire, water, bird, tree, truck, river", size: 18 })] })]
                }),
                new TableCell({
                  width: { size: 3000, type: WidthType.DXA },
                  borders: cellBorders,
                  children: [new Paragraph({ children: [new TextRun({ text: "brave, hot, dry, smoky, yellow, fast, clever", size: 18 })] })]
                })
              ]
            })
          ]
        }),

        new Paragraph({ children: [new PageBreak()] }),

        // Drawing Box
        new Paragraph({
          children: [new TextRun({ text: "My Firehawk Drawing", bold: true, size: 24, color: THEME.navy })],
          spacing: { before: 100, after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Draw a picture of a clever bird carrying a burning stick in its claws. Add labels from the word bank.", size: 20 })],
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
          children: [new TextRun({ text: "My Firehawk Sentences", bold: true, size: 22, color: THEME.orange })],
          spacing: { before: 200, after: 120 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "1. First, ", bold: true, size: 20, color: THEME.navy }),
            new TextRun({ text: "the bird sees rising ____________________ and flies to the fire.", size: 20 })
          ],
          spacing: { after: 150 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "2. Next, ", bold: true, size: 20, color: THEME.navy }),
            new TextRun({ text: "the bird grabs a warm ____________________ stick in its claws.", size: 20 })
          ],
          spacing: { after: 150 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "3. Then, ", bold: true, size: 20, color: THEME.navy }),
            new TextRun({ text: "it drops the stick in dry ____________________ to find food.", size: 20 })
          ],
          spacing: { after: 150 }
        })
      ]
    }]
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(filename, buffer);
  console.log("✅ Lucas Handout created.");
}

// Generate MS Forms Assessment
async function generateAssessment(filename) {
  const questions = [
    {
      q: "1. Which visual feature in the Ember Attack diagram is used to represent unseen cause-and-effect wind threats?",
      a: "A. The labels on the house roof.",
      b: "B. Solid red arrows pointing from the forest to the house gutters.",
      c: "C. Grains of black charcoal on the grass.",
      d: "D. A blue outline around the front yard deck.",
      ans: "B"
    },
    {
      q: "2. In an informative report about natural disasters, a caption designed to appeal to emotion (pathos) would most likely focus on:",
      a: "A. Explaining the wind speed metrics using CSIRO records.",
      b: "B. Outlining the cost of firefighter PPE equipment.",
      c: "C. Highlighting the immediate suffering and rescue of forest wildlife.",
      d: "D. Describing the chronological sequence of containment boundaries.",
      ans: "C"
    },
    {
      q: "3. According to fire science, which three components are absolutely required to sustain a bushfire?",
      a: "A. Carbon, Nitrogen, and Dry Timber.",
      b: "B. Oxygen, Fuel, and Heat.",
      c: "C. Relative Humidity, Atmospheric Pressure, and Wind.",
      d: "D. Sparks, Leaves, and Gas.",
      ans: "B"
    },
    {
      q: "4. How does moisture content in forest fuel loads directly affect forest flammability?",
      a: "A. Moisture increases oxygen content, causing trees to burn faster.",
      b: "B. Moisture content has no physical impact on ignition thresholds.",
      c: "C. High moisture acts as a natural heat sink, slowing or stopping ignition.",
      d: "D. Water conducts fire sparks faster through the canopy.",
      ans: "C"
    },
    {
      q: "5. Which combination of weather metrics represents a 'Catastrophic' fire weather danger zone in Australian savannas?",
      a: "A. Temperature 25°C, wind 10 km/h, relative humidity 60%.",
      b: "B. Temperature 42°C, wind 45 km/h, relative humidity 8%.",
      c: "C. Temperature 15°C, wind 5 km/h, relative humidity 90%.",
      d: "D. Temperature 30°C, wind 15 km/h, relative humidity 45%.",
      ans: "B"
    },
    {
      q: "6. Which of the following is NOT one of the three firehawk raptor species documented spreading fire in Northern Australia?",
      a: "A. Whistling Kite (Haliastur sphenurus)",
      b: "B. Brown Falcon (Falco berigora)",
      c: "C. Wedge-tailed Eagle (Aquila audax)",
      d: "D. Black Kite (Milvus migrans)",
      ans: "C"
    },
    {
      q: "7. Why do firehawk raptors transport smouldering twigs to unburnt dry grass?",
      a: "A. To cook their nests and warm up cold tree hollows.",
      b: "B. To flush out insects, lizards, and small mice fleeing the flames.",
      c: "C. To protect their chicks from the larger main fire front.",
      d: "D. To help rangers clear dry leaves and underbrush.",
      ans: "B"
    },
    {
      q: "8. Why is firehawk behaviour considered 'intentional goal-directed tool use' rather than accidental?",
      a: "A. It occurs systematically, repeats in steps, and involves transporting twigs across rivers to target specific grass patches.",
      b: "B. The birds have been trained by fire rangers to help containment.",
      c: "C. All raptor species globally carry burning embers.",
      d: "D. The birds feed directly on ash and charcoal particles.",
      ans: "A"
    },
    {
      q: "9. What is the core scientific debate regarding firehawk raptor behaviour?",
      a: "A. Researchers argue the birds are extinct, while rangers say they are common.",
      b: "B. Eyewitnesses believe the birds carry water, while rangers say they carry embers.",
      c: "C. Western science demands quantitative video proof, while Indigenous TEK relies on centuries of qualitative records.",
      d: "D. Rangers claim the birds copy human firefighters' gear.",
      ans: "C"
    },
    {
      q: "10. How does firehawk fire-spreading behaviour directly impact park rangers executing controlled hazard reduction burns?",
      a: "A. Raptors carry flames over containment firebreaks, starting secondary spot fires.",
      b: "B. The birds extinguish controlled fires with water droplets.",
      c: "C. Raptors steal firefighter helmets and protective equipment.",
      d: "D. Birds block roads, stopping fire trucks from driving.",
      ans: "A"
    }
  ];

  const children = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "Lesson 23 Assessment: Multimodal Meaning and Fire Science", bold: true, size: 36, color: THEME.navy })],
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
  console.log("✅ Assessment document created.");
}

// Main execution function
async function run() {
  const outputDir = path.join(__dirname, '..');
  
  try {
    await generateWorksheet(path.join(outputDir, 'Lesson_23_Worksheet.docx'));
    await generateLucasHandout(path.join(outputDir, 'Lesson_23_Lucas_Handout.docx'));
    await generateAssessment(path.join(outputDir, 'Lesson_23_Assessment.docx'));
    console.log("🎉 All three Word documents generated successfully!");
  } catch (error) {
    console.error("❌ Error generating documents:", error);
    process.exit(1);
  }
}

run();
