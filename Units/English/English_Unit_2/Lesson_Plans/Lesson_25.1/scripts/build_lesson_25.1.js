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
          children: [new TextRun({ text: "Lesson 25.1: Elemental Magic & Part A Practice Worksheet", bold: true, size: 34, color: THEME.navy })],
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
          children: [new TextRun({ text: "Read the scientific report excerpt below from the Science of Survival page. Use your scanning strategies to locate and record literal facts quickly.", size: 20 })],
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
                      children: [new TextRun({ text: "Bushfires are a fundamental, albeit terrifying, part of the Australian landscape. They move with incredible speed, reaching temperatures that can melt steel and filling the atmosphere with suffocating smoke. Yet, for the animals that call the bush home, fire is not a new enemy. Over millions of years, creatures from kangaroos to tiny echidnas have developed a sophisticated toolkit of 'survival magic'—behaviours and biological features that allow them to endure where others cannot. Success in a fire zone isn't about one single trick; it's a dynamic calculation of timing and location. Animals must decide in a split second whether to flee the approaching front, seek shelter in the deep earth, or wait for the precise moment when the heat passes.", size: 18, italics: true })],
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
          children: [new TextRun({ text: "1. What extreme temperature effect is mentioned in the text that highlights the intensity of bushfires?", size: 18, bold: true })],
          spacing: { before: 80, after: 50 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Answer: ________________________________________________________________________________", size: 18 })],
          spacing: { after: 120 }
        }),

        new Paragraph({
          children: [new TextRun({ text: "2. Over what time span have Australian creatures developed their survival mechanisms?", size: 18, bold: true })],
          spacing: { before: 80, after: 50 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Answer: ________________________________________________________________________________", size: 18 })],
          spacing: { after: 120 }
        }),

        new Paragraph({
          children: [new TextRun({ text: "3. Success in a fire zone is a dynamic calculation of which two factors?", size: 18, bold: true })],
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
          children: [new TextRun({ text: "Explain the general purpose and target audience of the Elemental Magic website. Use specific text evidence to back up your claim.", size: 20 })],
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
                        new TextRun({ text: "“Over millions of years, creatures from kangaroos to tiny echidnas have developed a sophisticated toolkit of 'survival magic'...”", size: 16, italics: true })
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
                      children: [new TextRun({ text: "Identify the expanded noun group in this sentence:", bold: true, size: 16, color: THEME.blue })]
                    }),
                    new Paragraph({
                      children: [new TextRun({ text: "________________________________________________________", size: 16 })],
                      spacing: { after: 60 }
                    }),
                    new Paragraph({
                      children: [new TextRun({ text: "Explain the precision effect of this metaphor on the reader:", bold: true, size: 16, color: THEME.blue })]
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
                        new TextRun({ text: "“When they sense an approaching fire, they use their powerful, shovel-like claws to burrow deep into the soil or leaf litter.”", size: 16, italics: true })
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
                      children: [new TextRun({ text: "Identify the dependent clause structure starting the sentence:", bold: true, size: 16, color: THEME.blue })]
                    }),
                    new Paragraph({
                      children: [new TextRun({ text: "________________________________________________________", size: 16 })],
                      spacing: { after: 60 }
                    }),
                    new Paragraph({
                      children: [new TextRun({ text: "Explain the cohesive cause-and-effect built by this starting point:", bold: true, size: 16, color: THEME.blue })]
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
          children: [new TextRun({ text: "Examine the Field Comparison Table and module layout of the website. Answer the following questions about how visual features multiply textual meaning.", size: 20 })],
          spacing: { after: 150 }
        }),
        
        new Paragraph({
          children: [new TextRun({ text: "1. The Field Comparison Table at the end summarizes each animal, strategy, and shelter type. Explain how this structured layout enhances navigation and helps a reader compare different mechanisms:", size: 18, bold: true })],
          spacing: { before: 80, after: 50 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "________________________________________________________________________________________\n________________________________________________________________________________________\n________________________________________________________________________________________", size: 18 })],
          spacing: { after: 150 }
        }),

        new Paragraph({
          children: [new TextRun({ text: "2. The author uses bold section headings for each animal (e.g., '04. ECHIDNAS: EARTH SHIELDS') along with captioned images of them. Why does the author use these specific visual structures?", size: 18, bold: true })],
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
          children: [new TextRun({ text: "Lesson 25.1: Lucas Pathway — Animal Fire Patrol", bold: true, size: 30, color: THEME.navy })],
          spacing: { after: 150 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Name: ______________________   Date: _____________", size: 20 })],
          spacing: { after: 200 }
        }),

        // Reading Card
        new Paragraph({
          children: [new TextRun({ text: "Echidna Survival Reading Card", bold: true, size: 24, color: THEME.orange })],
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
                      children: [new TextRun({ text: "Echidnas are amazing diggers. When a bushfire comes, they use their strong claws to dig deep into the soft soil. The cool earth protects them from the hot fire. They curl into a tight ball. Only their sharp spines stick out. They stay cool and safe deep underground until the fire has passed over their heads.", size: 20, italics: true })]
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
                new TableCell({ width: { size: 3000, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Animal Heading", bold: true, size: 18 })] })] }),
                new TableCell({ width: { size: 4500, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "At the start of each animal section, in colored text.", size: 18 })] })] }),
                new TableCell({ width: { size: 1500, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "[   ]", size: 18 })] })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ width: { size: 3000, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Animal Image", bold: true, size: 18 })] })] }),
                new TableCell({ width: { size: 4500, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "The pictures showing each animal in the bush.", size: 18 })] })] }),
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
          children: [new TextRun({ text: "With your teacher or helper, look at the website mock-up on Slide 7. Draw circles around the title, headings, and images, then complete the sentences below using your spelling word bank.", size: 20 })],
          spacing: { after: 150 }
        }),

        new Paragraph({
          children: [new TextRun({ text: "1. Complete this sentence about echidna digging:", size: 20, bold: true })],
          spacing: { before: 100, after: 50 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Echidnas use their strong claws to dig deep into the soft ______________.", size: 20 })],
          spacing: { after: 120 }
        }),

        new Paragraph({
          children: [new TextRun({ text: "2. Complete this sentence about the insulation protection:", size: 20, bold: true })],
          spacing: { before: 100, after: 50 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "The cool earth protects echidnas from the hot ______________.", size: 20 })],
          spacing: { after: 150 }
        }),

        // Visual drawing and labeling box
        new Paragraph({
          children: [new TextRun({ text: "My Echidna Insulation Sketch", bold: true, size: 24, color: THEME.orange })],
          spacing: { before: 150, after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Draw an echidna curled into a tight ball underground! Label the sharp spines and the cool, protective soil layer below.", size: 20 })],
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
    await generateWorksheet(path.join(outputDir, 'Lesson_25.1_Worksheet.docx'));
    await generateLucasHandout(path.join(outputDir, 'Lesson_25.1_Lucas_Handout.docx'));
    console.log("🎉 All Lesson 25.1 Word documents generated successfully!");
  } catch (error) {
    console.error("❌ Error generating documents:", error);
    process.exit(1);
  }
}

run();
