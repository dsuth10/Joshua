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
          children: [new TextRun({ text: "Lesson 25.2: Causes of Earthquakes Practice Assessment", bold: true, size: 30, color: THEME.navy })],
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
                      children: [new TextRun({ text: "The Shaking Earth: Causes of Earthquakes", bold: true, size: 20, color: THEME.navy })],
                      spacing: { before: 80, after: 80 }
                    }),
                    new Paragraph({
                      children: [new TextRun({ text: "Earth feels solid under our feet. However, our planet's crust (the hard, rocky outer layer of Earth) is actually broken into huge pieces. These pieces are called tectonic plates (giant puzzle pieces that make up Earth's outer shell). Tectonic plates float very slowly on a softer layer of hot, melted rock deep inside the Earth. They move only a few centimetres each year.\n\nAs these plates float, they interact in three main ways. First, some plates pull apart from each other. Second, other plates bump into each other. This bumping can push the land up to form giant mountains. Third, some plates slide sideways past one another. The areas where these plates meet are called boundary zones.\n\nThe edges of tectonic plates are rough and jagged. As the plates try to move, their rough edges can get stuck together. They stick because of friction, which is a force that resists movement. Even though the edges are stuck, the rest of the plates do not stop moving. They continue to push and pull. This build-up of force creates tension (growing pressure that is stored in the rocks along the boundary).\n\nOver time, this pressure becomes too great. The rocks suddenly break or slip. This sudden movement usually happens along a fault (a crack in the Earth's crust where rocks can move). When the rocks suddenly slip, they release a massive amount of stored energy.\n\nThis energy travels outward from the break in all directions. It moves as seismic waves (powerful ripples of energy that travel through the ground). These waves make the ground shake. This shaking is what we feel as an earthquake. The point deep underground where the rocks first broke is called the focus. Directly above this point, on the surface of the Earth, is the epicentre (the point on the surface directly above where the earthquake started). The shaking is always strongest near the epicentre. Smaller shakes called aftershocks (smaller earthquakes that happen after the main shaking) can occur for days or weeks.\n\nScientists measure earthquakes using a seismograph (a special machine that measures the strength of ground movements). By studying earthquakes, we learn how tectonic plates move and how to build safer buildings to protect people.", size: 18 })],
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
          children: [new TextRun({ text: "Plate Boundary Types (Field Comparison Table)", bold: true, size: 24, color: THEME.navy })],
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
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Boundary Type", bold: true, color: THEME.pureWhite, size: 18 })] })]
                }),
                new TableCell({
                  width: { size: 3000, type: WidthType.DXA },
                  shading: { fill: THEME.navy },
                  borders: cellBorders,
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Direction of Movement", bold: true, color: THEME.pureWhite, size: 18 })] })]
                }),
                new TableCell({
                  width: { size: 3000, type: WidthType.DXA },
                  shading: { fill: THEME.navy },
                  borders: cellBorders,
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Geological Features Produced", bold: true, color: THEME.pureWhite, size: 18 })] })]
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ width: { size: 3000, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Convergent Boundary", bold: true, size: 18 })] })] }),
                new TableCell({ width: { size: 3000, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Plates push into each other", size: 18 })] })] }),
                new TableCell({ width: { size: 3000, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Fold mountains, deep ocean trenches, and strong earthquakes", size: 18 })] })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ width: { size: 3000, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Divergent Boundary", bold: true, size: 18 })] })] }),
                new TableCell({ width: { size: 3000, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Plates pull apart from each other", size: 18 })] })] }),
                new TableCell({ width: { size: 3000, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Rift valleys, volcanic activity, and mild earthquakes", size: 18 })] })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ width: { size: 3000, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Transform Boundary", bold: true, size: 18 })] })] }),
                new TableCell({ width: { size: 3000, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Plates slide sideways past each other", size: 18 })] })] }),
                new TableCell({ width: { size: 3000, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Active fault lines and shallow, destructive earthquakes", size: 18 })] })] })
              ]
            })
          ]
        }),

        // Diagram Box (Visual Feature 2)
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun({ text: "Figure 1: Labeled Cross-Section of an Earthquake", bold: true, size: 24, color: THEME.navy })],
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
                        new TextRun({ text: "- Epicentre: ", bold: true, color: THEME.orange, size: 18 }),
                        new TextRun({ text: "The point on the surface directly above the underground start.\n", size: 18 }),
                        new TextRun({ text: "- Focus: ", bold: true, color: THEME.orange, size: 18 }),
                        new TextRun({ text: "The deep underground point where rocks first fracture and slip.\n", size: 18 }),
                        new TextRun({ text: "- Fault Line: ", bold: true, color: THEME.orange, size: 18 }),
                        new TextRun({ text: "The crack along which rock plates slide.\n", size: 18 }),
                        new TextRun({ text: "- Seismic Waves: ", bold: true, color: THEME.orange, size: 18 }),
                        new TextRun({ text: "Circular energy ripples spreading through the ground.", size: 18 })
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
          children: [new TextRun({ text: "Part A: Reading and Viewing Questions", bold: true, color: THEME.navy })],
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
          children: [new TextRun({ text: "8. How has the author used interesting words and language to make the ideas clear and easy to understand? Give examples from the text in your answer.", bold: true, size: 20 })],
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
          children: [new TextRun({ text: "Lesson 25.2: Lucas Pathway — Earthquakes Structure Patrol", bold: true, size: 30, color: THEME.navy })],
          spacing: { after: 150 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Name: ______________________   Date: _____________", size: 20 })],
          spacing: { after: 200 }
        }),

        // Reading Card
        new Paragraph({
          children: [new TextRun({ text: "Earthquake Survival Reading Card", bold: true, size: 24, color: THEME.orange })],
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
                      children: [new TextRun({ text: "The ground under our feet seems very solid. But it is actually broken into huge pieces called tectonic plates. They are like giant puzzle pieces! These plates float and move very slowly. Sometimes, the plates get stuck together. When they finally slip, they release a lot of energy. This energy makes the ground shake. This shaking is what we call an earthquake.", size: 20, italics: true })]
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
                new TableCell({ width: { size: 3000, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Earthquake Diagram", bold: true, size: 18 })] })] }),
                new TableCell({ width: { size: 4500, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "The drawing showing the Epicentre and Focus.", size: 18 })] })] }),
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
          children: [new TextRun({ text: "With your teacher or helper, look at the website mock-up on Slide 7. Draw circles around the title, headings, and diagram, then complete the sentences below using the word bank.", size: 20 })],
          spacing: { after: 150 }
        }),

        new Paragraph({
          children: [new TextRun({ text: "1. Complete this sentence about earthquakes:", size: 20, bold: true })],
          spacing: { before: 100, after: 50 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Earthquakes make the ground ______________ (shake / hot).", size: 20 })],
          spacing: { after: 120 }
        }),

        new Paragraph({
          children: [new TextRun({ text: "2. Complete this sentence about measuring ground movements:", size: 20, bold: true })],
          spacing: { before: 100, after: 50 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "A machine that measures shaking is a ______________ (seismograph / camera).", size: 20 })],
          spacing: { after: 150 }
        }),

        // Visual drawing and labeling box
        new Paragraph({
          children: [new TextRun({ text: "My Earthquake Sketch", bold: true, size: 24, color: THEME.orange })],
          spacing: { before: 150, after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Draw a house shaking during an earthquake! Draw wavy line ripples for the seismic waves shaking the house and soil.", size: 20 })],
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
