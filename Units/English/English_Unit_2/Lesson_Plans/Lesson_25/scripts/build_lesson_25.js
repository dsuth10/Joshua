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
          run: { size: 32, bold: true, color: THEME.navy, font: "Arial" },
          paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 }
        },
        {
          id: "Heading2",
          name: "Heading 2",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: { size: 26, bold: true, color: THEME.orange, font: "Arial" },
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
          children: [new TextRun({ text: "Lesson 25: Earthquakes & Part A Practice Worksheet", bold: true, size: 34, color: THEME.navy })],
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Name: ______________________   Date: _____________", size: 22 })],
          spacing: { after: 250 }
        }),

        // SECTION 1
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun({ text: "Section 1: Skimming and Scanning Challenge", bold: true, size: 26, color: THEME.orange })],
          spacing: { before: 100, after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Read the scientific report excerpt below about tectonic processes. Use your scanning strategies to locate and record literal facts quickly.", size: 20 })],
          spacing: { after: 150 }
        }),

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
                      children: [new TextRun({ text: "Tectonic plates move continuously across the Earth's surface at a rate of 2 to 10 centimetres per year, floating atop the partially molten rock of the asthenosphere. The lithosphere, which incorporates the rigid crust and the uppermost solid mantle, fractures along giant borders called fault lines. When two continental plates collide at convergent boundaries, massive compression forces crumple rock strata upward to form mountain ranges. Alternatively, at transform faults, such as the San Andreas Fault in California, plates slide past one another. The rough rock surfaces lock together, storing enormous shear stress. When the rock's frictional limit is breached, the plates slip violently, instantly releasing stored mechanical energy as seismic waves.", size: 18, italics: true })],
                      spacing: { before: 80, after: 80 }
                    })
                  ]
                })
              ]
            })
          ]
        }),

        new Paragraph({
          children: [new TextRun({ text: "Comprehension Questions (Scan the text to answer):", size: 20, bold: true })],
          spacing: { before: 150, after: 80 }
        }),
        
        new Paragraph({
          children: [new TextRun({ text: "1. At what average speed do tectonic plates drift across the Earth's surface annually?", size: 18, bold: true })],
          spacing: { before: 80, after: 50 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Answer: ________________________________________________________________________________", size: 18 })],
          spacing: { after: 120 }
        }),

        new Paragraph({
          children: [new TextRun({ text: "2. Underneath the solid lithosphere, which specific ductile layer allows the plates to float and slide?", size: 18, bold: true })],
          spacing: { before: 80, after: 50 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Answer: ________________________________________________________________________________", size: 18 })],
          spacing: { after: 120 }
        }),

        new Paragraph({
          children: [new TextRun({ text: "3. Name the famous transform fault system in California that slides past each other:", size: 18, bold: true })],
          spacing: { before: 80, after: 50 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Answer: ________________________________________________________________________________", size: 18 })],
          spacing: { after: 150 }
        }),

        new Paragraph({ children: [new PageBreak()] }),

        // SECTION 2
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun({ text: "Section 2: Purpose and Audience Analysis", bold: true, size: 26, color: THEME.navy })],
          spacing: { before: 100, after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Explain the general purpose and target audience of the Earthquakes Archive website. Use specific text evidence to back up your claim.", size: 20 })],
          spacing: { after: 150 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Identify Purpose (Why was this text created? Is it objective or subjective?):", size: 18, bold: true })],
          spacing: { before: 80, after: 50 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "________________________________________________________________________________________\n________________________________________________________________________________________", size: 18 })],
          spacing: { after: 150 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Identify Target Audience (Who would read this? How does the language show this relationship?):", size: 18, bold: true })],
          spacing: { before: 80, after: 50 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "________________________________________________________________________________________\n________________________________________________________________________________________", size: 18 })],
          spacing: { after: 200 }
        }),

        // SECTION 3
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun({ text: "Section 3: Text Structure and Language Features", bold: true, size: 26, color: THEME.orange })],
          spacing: { before: 100, after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "For the Part A Assessment, you must write a two-step response for language features. First, identify the exact evidence. Second, explain its technical effect on precision.", size: 20 })],
          spacing: { after: 150 }
        }),

        new Table({
          columnWidths: [4000, 5000],
          margins: { top: 120, bottom: 120, left: 150, right: 150 },
          rows: [
            new TableRow({
              tableHeader: true,
              children: [
                new TableCell({
                  width: { size: 4000, type: WidthType.DXA },
                  shading: { fill: THEME.navy },
                  borders: cellBorders,
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Text Excerpt", bold: true, color: THEME.pureWhite, size: 18 })] })]
                }),
                new TableCell({
                  width: { size: 5000, type: WidthType.DXA },
                  shading: { fill: THEME.navy },
                  borders: cellBorders,
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Two-Step Analysis (Identify & Explain Effect)", bold: true, color: THEME.pureWhite, size: 18 })] })]
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 4000, type: WidthType.DXA },
                  borders: cellBorders,
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({ text: "“Although geological pressure builds incrementally along active faults over centuries, the actual rupture occurs in a matter of seconds.”", size: 16, italics: true })
                      ],
                      spacing: { before: 80, after: 80 }
                    })
                  ]
                }),
                new TableCell({
                  width: { size: 5000, type: WidthType.DXA },
                  borders: cellBorders,
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: "Identify the clause type used at the start:", bold: true, size: 16, color: THEME.blue })]
                    }),
                    new Paragraph({
                      children: [new TextRun({ text: "________________________________________________________", size: 16 })],
                      spacing: { after: 60 }
                    }),
                    new Paragraph({
                      children: [new TextRun({ text: "Explain how this contrast builds scientific precision for the reader:", bold: true, size: 16, color: THEME.blue })]
                    }),
                    new Paragraph({
                      children: [new TextRun({ text: "________________________________________________________\n________________________________________________________", size: 16 })]
                    })
                  ]
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 4000, type: WidthType.DXA },
                  borders: cellBorders,
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({ text: "“Consequently, this catastrophic failure of shear strength along rock surfaces generates intense subterranean shaking...”", size: 16, italics: true })
                      ],
                      spacing: { before: 80, after: 80 }
                    })
                  ]
                }),
                new TableCell({
                  width: { size: 5000, type: WidthType.DXA },
                  borders: cellBorders,
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: "Identify the expanded noun group in the subject:", bold: true, size: 16, color: THEME.blue })]
                    }),
                    new Paragraph({
                      children: [new TextRun({ text: "________________________________________________________", size: 16 })],
                      spacing: { after: 60 }
                    }),
                    new Paragraph({
                      children: [new TextRun({ text: "Explain the precision effect of this expanded description:", bold: true, size: 16, color: THEME.blue })]
                    }),
                    new Paragraph({
                      children: [new TextRun({ text: "________________________________________________________\n________________________________________________________", size: 16 })]
                    })
                  ]
                })
              ]
            })
          ]
        }),

        new Paragraph({ children: [new PageBreak()] }),

        // SECTION 4
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun({ text: "Section 4: Visual Feature Analysis", bold: true, size: 26, color: THEME.navy })],
          spacing: { before: 100, after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Examine the Plate Tectonics cross-section diagram from our slide deck. Answer the following questions about how visual features multiply textual meaning.", size: 20 })],
          spacing: { after: 150 }
        }),
        
        new Paragraph({
          children: [new TextRun({ text: "1. The diagram uses horizontal and vertical arrows (vector indicators) along the boundary lines. Explain how these arrows help a reader understand physical tension and movement directions:", size: 18, bold: true })],
          spacing: { before: 80, after: 50 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "________________________________________________________________________________________\n________________________________________________________________________________________\n________________________________________________________________________________________", size: 18 })],
          spacing: { after: 150 }
        }),

        new Paragraph({
          children: [new TextRun({ text: "2. Why does the author include distinct coloring and textures for the Lithosphere (solid crust/mantle) and the Asthenosphere (flowing mantle magma) layers?", size: 18, bold: true })],
          spacing: { before: 80, after: 50 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "________________________________________________________________________________________\n________________________________________________________________________________________", size: 18 })],
          spacing: { after: 200 }
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
          children: [new TextRun({ text: "Lesson 25: Lucas Pathway — Earthquakes Website Patrol", bold: true, size: 30, color: THEME.navy })],
          spacing: { after: 150 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Name: ______________________   Date: _____________", size: 20 })],
          spacing: { after: 200 }
        }),

        // Reading Card
        new Paragraph({
          children: [new TextRun({ text: "Earthquakes Reading Excerpt", bold: true, size: 24, color: THEME.orange })],
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
                      children: [new TextRun({ text: "Earthquakes make the ground shake. Deep underground, giant puzzle pieces of rock called tectonic plates grind together. Sometimes, the rocky plates get locked. Suddenly, the rock cracks, the plates slip, and the ground shakes. We call this shaking an earthquake. It is a powerful natural event.", size: 20, italics: true })]
                    })
                  ]
                })
              ]
            })
          ]
        }),

        // Simplified Checklist
        new Paragraph({
          children: [new TextRun({ text: "My Website Patrol Checklist", bold: true, size: 24, color: THEME.blue })],
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
                new TableCell({ width: { size: 4500, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "At the start of a chapter, printed in colored text.", size: 18 })] })] }),
                new TableCell({ width: { size: 1500, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "[   ]", size: 18 })] })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ width: { size: 3000, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Tectonic Diagram", bold: true, size: 18 })] })] }),
                new TableCell({ width: { size: 4500, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "The picture showing the two plates colliding.", size: 18 })] })] }),
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
          children: [new TextRun({ text: "With your teacher or helper, look at the Earthquakes mock-up on Slide 7. Draw circles around the title, heading, and image, then complete the sentences below using your spelling word bank.", size: 20 })],
          spacing: { after: 150 }
        }),

        new Paragraph({
          children: [new TextRun({ text: "1. Complete this sentence about what the website is about:", size: 20, bold: true })],
          spacing: { before: 100, after: 50 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "This website is about __________________________________________________________________.", size: 20 })],
          spacing: { after: 120 }
        }),

        new Paragraph({
          children: [new TextRun({ text: "2. Complete this sentence about what you see under the section heading:", size: 20, bold: true })],
          spacing: { before: 100, after: 50 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Under the heading, I see ________________________________________________________________.", size: 20 })],
          spacing: { after: 150 }
        }),

        // Visual drawing and labeling box
        new Paragraph({
          children: [new TextRun({ text: "My Plate Tectonics Drawing", bold: true, size: 24, color: THEME.orange })],
          spacing: { before: 150, after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Draw two giant tectonic plates colliding below. Draw arrow markers showing the plate movements and label Plate A and Plate B!", size: 20 })],
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

// Main execution function
async function run() {
  const outputDir = path.join(__dirname, '..');
  
  try {
    await generateWorksheet(path.join(outputDir, 'Lesson_25_Worksheet.docx'));
    await generateLucasHandout(path.join(outputDir, 'Lesson_25_Lucas_Handout.docx'));
    console.log("🎉 All Lesson 25 Word documents generated successfully!");
  } catch (error) {
    console.error("❌ Error generating documents:", error);
    process.exit(1);
  }
}

run();
