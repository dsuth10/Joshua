const { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, PageBreak } = require('docx');
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

// Generate Standard Year 5 Worksheet (Part A Assessment Practice Sheet)
async function generateWorksheet(filename) {
  const doc = new Document({
    styles: {
      default: { document: { run: { font: "Arial", size: 22 } } },
      paragraphStyles: [
        {
          id: "Heading1",
          name: "Heading 1",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: { size: 30, bold: true, color: THEME.navy, font: "Arial" },
          paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 }
        },
        {
          id: "Heading2",
          name: "Heading 2",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: { size: 24, bold: true, color: THEME.orange, font: "Arial" },
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
          children: [new TextRun({ text: "Lesson 25.2: Causes and Effects of Tsunamis Practice Assessment", bold: true, size: 30, color: THEME.navy })],
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Name: ______________________   Date: _____________", size: 22 })],
          spacing: { after: 250 }
        }),

        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun({ text: "Read the informative text and answer the questions.", bold: true, size: 24, color: THEME.orange })],
          spacing: { before: 100, after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "You may need to re-read or scan parts of the text to respond to the questions.", size: 20 })],
          spacing: { after: 150 }
        }),

        // Text display in a shaded box
        new Table({
          columnWidths: [9000],
          margins: { top: 150, bottom: 150, left: 180, right: 180 },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 9000, type: WidthType.DXA },
                  borders: cellBorders,
                  shading: { fill: THEME.white },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [new TextRun({ text: "The Rising Tide: Causes and Effects of Tsunamis", bold: true, size: 20, color: THEME.navy })],
                      spacing: { before: 80, after: 80 }
                    }),
                    new Paragraph({
                      children: [new TextRun({ text: "A tsunami is a series of giant, fast-moving ocean waves. Tsunami is a Japanese word. It means 'harbour wave'. These waves are caused by a sudden displacement (movement out of place) of water. Normal waves are made by wind, but tsunamis are different. They are triggered by underwater events. These include volcanic eruptions, landslides, or submarine earthquakes.\n\nMost tsunamis start with undersea earthquakes. These happen along tectonic plate boundaries. The plates suddenly break or slip, which releases seismic (earth-shaking) energy. The sea floor pushes up or down, lifting the water column above it. The water shifts and makes powerful waves. The waves spread out in all directions.\n\nIn the deep ocean, tsunamis travel very fast. They can go over 800 kilometres per hour. However, the deep waves are not very high. They are often less than one metre tall. Ships at sea might not notice them. This travel is called wave propagation (how waves move in deep water).\n\nThe waves slow down as they reach shallow water. They drop to about 50 kilometres per hour. But the water piles up, causing the waves to grow very tall. This growth is called wave shoaling (compressing and rising near land). The water might suddenly pull back from the beach. Then, a massive wall of water hits the shore.\n\nTsunamis cause severe inundation (extreme flooding) on land. They wash away cars and destroy buildings. They also strip away sand. To protect people, scientists use deep-ocean sensors. These sensors detect tsunami waves early, allowing authorities to order evacuations.", size: 18 })],
                      spacing: { after: 120 }
                    })
                  ]
                })
              ]
            })
          ]
        }),

        new Paragraph({ children: [new PageBreak()] }),

        // Comparison Table (Visual Feature 1)
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun({ text: "Tsunami Wave Characteristics (Field Comparison Table)", bold: true, size: 24, color: THEME.navy })],
          spacing: { before: 150, after: 100 }
        }),
        new Table({
          columnWidths: [3000, 3000, 3000],
          margins: { top: 100, bottom: 100, left: 120, right: 120 },
          rows: [
            new TableRow({
              tableHeader: true,
              children: [
                new TableCell({
                  width: { size: 3000, type: WidthType.DXA },
                  shading: { fill: THEME.navy },
                  borders: cellBorders,
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Feature", bold: true, color: THEME.pureWhite, size: 18 })] })]
                }),
                new TableCell({
                  width: { size: 3000, type: WidthType.DXA },
                  shading: { fill: THEME.navy },
                  borders: cellBorders,
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Deep Ocean", bold: true, color: THEME.pureWhite, size: 18 })] })]
                }),
                new TableCell({
                  width: { size: 3000, type: WidthType.DXA },
                  shading: { fill: THEME.navy },
                  borders: cellBorders,
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Shallow Shore", bold: true, color: THEME.pureWhite, size: 18 })] })]
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ width: { size: 3000, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Wave Speed", bold: true, size: 18 })] })] }),
                new TableCell({ width: { size: 3000, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Exceeds 800 km/h (Jet speed)", size: 18 })] })] }),
                new TableCell({ width: { size: 3000, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Drops to 50 km/h (Car speed)", size: 18 })] })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ width: { size: 3000, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Wave Height", bold: true, size: 18 })] })] }),
                new TableCell({ width: { size: 3000, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Very low (Less than 1 metre)", size: 18 })] })] }),
                new TableCell({ width: { size: 3000, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Grows very tall (Up to 30 metres)", size: 18 })] })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ width: { size: 3000, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Wavelength", bold: true, size: 18 })] })] }),
                new TableCell({ width: { size: 3000, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Extremely long (Up to 200 km)", size: 18 })] })] }),
                new TableCell({ width: { size: 3000, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Shortens (A few kilometres)", size: 18 })] })] })
              ]
            })
          ]
        }),

        // Diagram Box (Visual Feature 2)
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun({ text: "Figure 1: Key Wave Dynamics Terminology", bold: true, size: 24, color: THEME.navy })],
          spacing: { before: 150, after: 100 }
        }),
        new Table({
          columnWidths: [9000],
          margins: { top: 120, bottom: 120, left: 150, right: 150 },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 9000, type: WidthType.DXA },
                  borders: cellBorders,
                  shading: { fill: THEME.white },
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({ text: "- Tsunami: ", bold: true, color: THEME.orange, size: 18 }),
                        new TextRun({ text: "A Japanese word meaning 'harbour wave'; a series of massive, fast-moving waves.\n", size: 18 }),
                        new TextRun({ text: "- Displacement: ", bold: true, color: THEME.orange, size: 18 }),
                        new TextRun({ text: "A sudden movement of water out of its original position.\n", size: 18 }),
                        new TextRun({ text: "- Wave Propagation: ", bold: true, color: THEME.orange, size: 18 }),
                        new TextRun({ text: "The travel or movement of waves through the deep ocean.\n", size: 18 }),
                        new TextRun({ text: "- Wave Shoaling: ", bold: true, color: THEME.orange, size: 18 }),
                        new TextRun({ text: "The compression and rapid rising of waves as they enter shallow coastal water.", size: 18 })
                      ],
                      spacing: { before: 80, after: 80 }
                    })
                  ]
                })
              ]
            })
          ]
        }),

        new Paragraph({ children: [new PageBreak()] }),

        // Questions Section
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun({ text: "Part A: Reading and Viewing Questions (Tsunamis)", bold: true, color: THEME.navy })],
          spacing: { before: 100, after: 150 }
        }),

        // Q1
        new Paragraph({
          children: [new TextRun({ text: "1. What is the topic of the text?", bold: true, size: 20 })],
          spacing: { before: 100, after: 50 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Answer: ________________________________________________________________________________\n________________________________________________________________________________", size: 18 })],
          spacing: { after: 180 }
        }),

        // Q2
        new Paragraph({
          children: [new TextRun({ text: "2. What are some facts from the text?", bold: true, size: 20 })],
          spacing: { before: 100, after: 50 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Answer: ________________________________________________________________________________\n________________________________________________________________________________", size: 18 })],
          spacing: { after: 180 }
        }),

        // Q3
        new Paragraph({
          children: [new TextRun({ text: "3. Identify the main idea/s and include supporting ideas and information from the text.", bold: true, size: 20 })],
          spacing: { before: 100, after: 50 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Answer: ________________________________________________________________________________\n________________________________________________________________________________\n________________________________________________________________________________", size: 18 })],
          spacing: { after: 180 }
        }),

        // Q4
        new Paragraph({
          children: [new TextRun({ text: "4. Who is the audience for this text?", bold: true, size: 20 })],
          spacing: { before: 100, after: 50 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Answer: ________________________________________________________________________________\n________________________________________________________________________________", size: 18 })],
          spacing: { after: 180 }
        }),

        // Q5
        new Paragraph({
          children: [new TextRun({ text: "5. What is the author's purpose in writing the text? Use examples from the text in your answer.", bold: true, size: 20 })],
          spacing: { before: 100, after: 50 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Answer: ________________________________________________________________________________\n________________________________________________________________________________\n________________________________________________________________________________", size: 18 })],
          spacing: { after: 180 }
        }),

        new Paragraph({ children: [new PageBreak()] }),

        // Q6
        new Paragraph({
          children: [new TextRun({ text: "6. What is this text type? What are the features/structure of this text type?", bold: true, size: 20 })],
          spacing: { before: 100, after: 50 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Answer: ________________________________________________________________________________\n________________________________________________________________________________", size: 18 })],
          spacing: { after: 180 }
        }),

        // Q7
        new Paragraph({
          children: [new TextRun({ text: "7. Explain how the text structures of the text:", bold: true, size: 20 })],
          spacing: { before: 100, after: 50 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "a. support the purpose and help the reader locate information", bold: true, size: 18, color: THEME.blue })],
          spacing: { before: 50, after: 50 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Answer: ________________________________________________________________________________\n________________________________________________________________________________", size: 18 })],
          spacing: { after: 120 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "b. cohesion and build meaning.", bold: true, size: 18, color: THEME.blue })],
          spacing: { before: 50, after: 50 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Answer: ________________________________________________________________________________\n________________________________________________________________________________", size: 18 })],
          spacing: { after: 180 }
        }),

        // Q8
        new Paragraph({
          children: [new TextRun({ text: "8. How has the author used interesting words and language to make the ideas clear and easy to understand? Give examples from the text in your answer.", bold: bold = true, size: 20 })],
          spacing: { before: 100, after: 50 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Answer: ________________________________________________________________________________\n________________________________________________________________________________\n________________________________________________________________________________", size: 18 })],
          spacing: { after: 180 }
        }),

        // Q9
        new Paragraph({
          children: [new TextRun({ text: "9. How has the author used pictures or other visual features (like diagrams or layout) to help you understand the text better? Give examples from the text.", bold: true, size: 20 })],
          spacing: { before: 100, after: 50 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Answer: ________________________________________________________________________________\n________________________________________________________________________________\n________________________________________________________________________________", size: 18 })],
          spacing: { after: 150 }
        })
      ]
    }]
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(filename, buffer);
  console.log("✅ Year 5 Standard Worksheet created.");
}

// Generate Differentiated Year 2 Handout for Lucas
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
          children: [new TextRun({ text: "Lesson 25.2: Lucas Pathway — Tsunamis Structure Patrol", bold: true, size: 30, color: THEME.navy })],
          spacing: { after: 150 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Name: ______________________   Date: _____________", size: 20 })],
          spacing: { after: 200 }
        }),

        // Reading Card
        new Paragraph({
          children: [new TextRun({ text: "Tsunami Survival Reading Card (Basic Ocean Waves)", bold: true, size: 24, color: THEME.orange })],
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
                      children: [new TextRun({ text: "A tsunami is a giant ocean wave. Tsunamis are not normal waves. Normal waves are made by wind, but tsunamis start under the sea.\n\nOften, shaking ground (earthquake) under the water starts the wave. The sea floor moves up and shifts the deep ocean water. This movement makes fast waves. At first, the waves are very low, so ships at sea cannot see them.\n\nBut the waves move fast to the land. As they reach the beach, the waves grow very tall and become a huge wall of water. The giant waves hit the shore. They cause big floods on land, washing away cars and ruining houses. People must leave the beach to stay safe.", size: 20, italics: true })]
                    })
                  ]
                })
              ]
            })
          ]
        }),

        // Simplified Checklist
        new Paragraph({
          children: [new TextRun({ text: "My Website Structure Checklist", bold: true, size: 24, color: THEME.blue })],
          spacing: { before: 200, after: 80 }
        }),
        
        new Table({
          columnWidths: [3000, 4500, 1500],
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          rows: [
            new TableRow({
              tableHeader: true,
              children: [
                new TableCell({
                  width: { size: 3000, type: WidthType.DXA },
                  shading: { fill: THEME.navy },
                  borders: cellBorders,
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Website Feature", bold: true, color: THEME.pureWhite, size: 18 })] })]
                }),
                new TableCell({
                  width: { size: 4500, type: WidthType.DXA },
                  shading: { fill: THEME.navy },
                  borders: cellBorders,
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Where do I look?", bold: true, color: THEME.pureWhite, size: 18 })] })]
                }),
                new TableCell({
                  width: { size: 1500, type: WidthType.DXA },
                  shading: { fill: THEME.navy },
                  borders: cellBorders,
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Found?", bold: true, color: THEME.pureWhite, size: 18 })] })]
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ width: { size: 3000, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Website Title", bold: true, size: 18 })] })] }),
                new TableCell({ width: { size: 4500, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "At the very top of the page in the largest text.", size: 18 })] })] }),
                new TableCell({ width: { size: 1500, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "[   ]", size: 18 })] })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ width: { size: 3000, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Section Heading", bold: true, size: 18 })] })] }),
                new TableCell({ width: { size: 4500, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "At the start of each section, in colored text.", size: 18 })] })] }),
                new TableCell({ width: { size: 1500, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "[   ]", size: 18 })] })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ width: { size: 3000, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Tsunami Diagram", bold: true, size: 18 })] })] }),
                new TableCell({ width: { size: 4500, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "The drawing showing deep ocean and shore waves.", size: 18 })] })] }),
                new TableCell({ width: { size: 1500, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "[   ]", size: 18 })] })] })
              ]
            })
          ]
        }),

        new Paragraph({ children: [new PageBreak()] }),

        // Practice section
        new Paragraph({
          children: [new TextRun({ text: "Web Page Structure Patrol Practice", bold: true, size: 24, color: THEME.navy })],
          spacing: { before: 100, after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "With your teacher or helper, look at the website mock-up on Slide 9. Draw circles around the title, headings, and diagram, then complete the sentences below using the word bank.", size: 20 })],
          spacing: { after: 150 }
        }),

        new Paragraph({
          children: [new TextRun({ text: "1. Complete this sentence about tsunamis:", size: 20, bold: true })],
          spacing: { before: 100, after: 50 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Tsunamis make giant ocean ______________ (waves / winds).", size: 20 })],
          spacing: { after: 120 }
        }),

        new Paragraph({
          children: [new TextRun({ text: "2. Complete this sentence about water movement:", size: 20, bold: true })],
          spacing: { before: 100, after: 50 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Undersea earthquakes shift the ocean ______________ (water / fish).", size: 20 })],
          spacing: { after: 150 }
        }),

        // Visual drawing and labeling box
        new Paragraph({
          children: [new TextRun({ text: "My Tsunami Sketch", bold: true, size: 24, color: THEME.orange })],
          spacing: { before: 150, after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Draw a giant tsunami wave approaching the beach! Draw a small ship far away in the deep ocean, and draw tall waves hitting the shore.", size: 20 })],
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
                    new Paragraph({ text: "\n\n\n\n\n\n\n\n\n\n\n\n\n" })
                  ]
                })
              ]
            })
          ]
        })
      ]
    }]
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(filename, buffer);
  console.log("✅ Lucas Handout created.");
}

async function run() {
  const outputDir = path.join(__dirname, '..');
  
  try {
    await generateWorksheet(path.join(outputDir, 'Lesson_25.2_Worksheet.docx'));
    await generateLucasHandout(path.join(outputDir, 'Lesson_25.2_Lucas_Handout.docx'));
    console.log("🎉 All Lesson 25.2 Word documents generated successfully!");
  } catch (error) {
    console.error("❌ Error generating documents:", error);
    process.exit(1);
  }
}

run();
