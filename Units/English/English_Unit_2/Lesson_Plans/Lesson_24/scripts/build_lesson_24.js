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

// Helper to create a checklist row
function createChecklistRow(pillar, goal, selfPeer, example) {
  return new TableRow({
    children: [
      new TableCell({
        width: { size: 2000, type: WidthType.DXA },
        borders: cellBorders,
        shading: { fill: THEME.lightGrey },
        children: [
          new Paragraph({
            children: [new TextRun({ text: pillar, bold: true, size: 18, color: THEME.navy })],
            spacing: { before: 80, after: 80 }
          })
        ]
      }),
      new TableCell({
        width: { size: 3000, type: WidthType.DXA },
        borders: cellBorders,
        children: [
          new Paragraph({
            children: [new TextRun({ text: goal, size: 18, color: THEME.darkGrey })],
            spacing: { before: 80, after: 80 }
          })
        ]
      }),
      new TableCell({
        width: { size: 1500, type: WidthType.DXA },
        borders: cellBorders,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: selfPeer, size: 18, italics: true })],
            spacing: { before: 80, after: 80 }
          })
        ]
      }),
      new TableCell({
        width: { size: 2500, type: WidthType.DXA },
        borders: cellBorders,
        children: [
          new Paragraph({
            children: [new TextRun({ text: example, size: 16, color: THEME.blue })],
            spacing: { before: 80, after: 80 }
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
          children: [new TextRun({ text: "Lesson 24: Reviewing and Editing Information Reports", bold: true, size: 36, color: THEME.navy })],
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Name: ______________________   Date: _____________", size: 22 })],
          spacing: { after: 300 }
        }),

        // PART 1
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun({ text: "Part 1: Modelled Draft Study — “Before and After”", bold: true, size: 26, color: THEME.orange })],
          spacing: { before: 100, after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Compare the two drafts about Arsonist Birds. Identify how Draft B has been revised to incorporate complex sentence structures, precise vocabulary, varied sentence starting points (themes), and clear cohesion.", size: 20 })],
          spacing: { after: 200 }
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
                  shading: { fill: THEME.navy },
                  borders: cellBorders,
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Draft A: Basic & Repetitive", bold: true, color: THEME.pureWhite, size: 20 })] })]
                }),
                new TableCell({
                  width: { size: 4500, type: WidthType.DXA },
                  shading: { fill: THEME.blue },
                  borders: cellBorders,
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Draft B: Cohesive & Precise (Edited)", bold: true, color: THEME.pureWhite, size: 20 })] })]
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 4500, type: WidthType.DXA },
                  borders: cellBorders,
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: "Some brown falcons fly near fires. The birds carry burning sticks. The birds fly across roads and rivers. The birds drop the sticks in dry grass to start new fires. The birds do this to hunt lizards running from the fire. This bird is very smart. But the fire causes a lot of damage.", size: 18 })],
                      spacing: { before: 100, after: 100 }
                    })
                  ]
                }),
                new TableCell({
                  width: { size: 4500, type: WidthType.DXA },
                  borders: cellBorders,
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({ text: "Flying high above active conflagrations, ", bold: true, color: THEME.orange, size: 18 }),
                        new TextRun({ text: "these highly intelligent raptors search for smouldering twigs. ", size: 18 }),
                        new TextRun({ text: "Specifically, ", bold: true, color: THEME.green, size: 18 }),
                        new TextRun({ text: "they transport burning embers across containment boundaries, such as roads and wide rivers. ", size: 18 }),
                        new TextRun({ text: "Consequently, ", bold: true, color: THEME.green, size: 18 }),
                        new TextRun({ text: "by dropping these embers into unburnt fuel loads, they flush out lizards and insects fleeing the smoke. ", size: 18 }),
                        new TextRun({ text: "Although ", bold: true, color: THEME.navy, size: 18 }),
                        new TextRun({ text: "this behaviour coordinates efficient foraging, it complicates human fire containment efforts.", size: 18 })
                      ],
                      spacing: { before: 100, after: 100 }
                    })
                  ]
                })
              ]
            })
          ]
        }),

        new Paragraph({
          children: [new TextRun({ text: "Analysis: Describe the specific effect of starting sentences with dependent clauses (e.g., “Flying high above active conflagrations...”) compared to starting every sentence with “The birds...”:", size: 20, bold: true })],
          spacing: { before: 200, after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "________________________________________________________________________________________\n________________________________________________________________________________________", size: 18 })],
          spacing: { after: 200 }
        }),

        new Paragraph({ children: [new PageBreak()] }),

        // PART 2
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun({ text: "Part 2: Year 5 Standard Editing Checklist", bold: true, size: 26, color: THEME.navy })],
          spacing: { before: 100, after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Use this checklist systematically to audit and edit your draft. Check off each box once you have completed the audit for your own draft and your peer's draft.", size: 20 })],
          spacing: { after: 150 }
        }),

        new Table({
          columnWidths: [2000, 3000, 1500, 2500],
          margins: { top: 80, bottom: 80, left: 100, right: 100 },
          rows: [
            new TableRow({
              tableHeader: true,
              children: [
                new TableCell({
                  width: { size: 2000, type: WidthType.DXA },
                  shading: { fill: THEME.navy },
                  borders: cellBorders,
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Core Pillar", bold: true, color: THEME.pureWhite, size: 18 })] })]
                }),
                new TableCell({
                  width: { size: 3000, type: WidthType.DXA },
                  shading: { fill: THEME.navy },
                  borders: cellBorders,
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Editing Goal / Criteria", bold: true, color: THEME.pureWhite, size: 18 })] })]
                }),
                new TableCell({
                  width: { size: 1500, type: WidthType.DXA },
                  shading: { fill: THEME.navy },
                  borders: cellBorders,
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Audited?", bold: true, color: THEME.pureWhite, size: 18 })] })]
                }),
                new TableCell({
                  width: { size: 2500, type: WidthType.DXA },
                  shading: { fill: THEME.navy },
                  borders: cellBorders,
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Revision Example", bold: true, color: THEME.pureWhite, size: 18 })] })]
                })
              ]
            }),
            createChecklistRow("Sentence Variety", "Mix of simple, compound, and complex sentences. At least 1 complex sentence per paragraph.", "Self [  ] Peer [  ]", "“Although containment efforts were active, the fire jumped...”"),
            createChecklistRow("Vocabulary Precision", "Replace general words (bird, fire, stick, run) with topic-specific specialist terms.", "Self [  ] Peer [  ]", "bird -> raptor / avian predator\nfire -> conflagration / blaze"),
            createChecklistRow("Theme & Cohesion", "Vary sentence starting points. Use circumstantial starters (time/place) instead of repetitive subjects.", "Self [  ] Peer [  ]", "“Driven by high winds, the embers...” instead of “The embers...”"),
            createChecklistRow("Paragraph Transitions", "Use logical text connectives (Consequently, In contrast, Specifically) to link ideas between paragraphs.", "Self [  ] Peer [  ]", "“In contrast to typical avian behaviours, these falcons...”")
          ]
        }),

        new Paragraph({
          children: [new TextRun({ text: "Editing Exercise: Revise the following repetitive draft paragraph using the goals above.", size: 20, bold: true })],
          spacing: { before: 200, after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Draft: “Echidnas have spikes. They hide in logs. They go into a deep sleep when a fire comes. The sleep is called torpor. This lowers their energy. They survive because they stay cool under the ground.”", size: 18, italics: true })],
          spacing: { after: 150 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Revised Paragraph (Use expanded noun groups, complex sentences, and specialist vocabulary):", size: 18, bold: true })],
          spacing: { after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "________________________________________________________________________________________\n________________________________________________________________________________________\n________________________________________________________________________________________\n________________________________________________________________________________________", size: 18 })],
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
          children: [new TextRun({ text: "Lesson 24: Lucas Pathway — Capital & Full Stop Patrol", bold: true, size: 32, color: THEME.navy })],
          spacing: { after: 150 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Name: ______________________   Date: _____________", size: 20 })],
          spacing: { after: 200 }
        }),

        // Reading Card
        new Paragraph({
          children: [new TextRun({ text: "Firehawk Reading Card (Information Report Excerpt)", bold: true, size: 24, color: THEME.orange })],
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
                      children: [new TextRun({ text: "Firehawks are smart brown birds. They fly very high in the smoky air. They look for hot twigs near bushfires. These birds carry the twigs in their claws. They drop the twigs into dry grass to start new fires. This helps them hunt little lizards running from the sparks.", size: 20, italics: true })]
                    })
                  ]
                })
              ]
            })
          ]
        }),

        // Simplified Checklist
        new Paragraph({
          children: [new TextRun({ text: "My Year 2 Editing Checklist", bold: true, size: 24, color: THEME.blue })],
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
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Rule / Check", bold: true, color: THEME.pureWhite, size: 18 })] })]
                }),
                new TableCell({
                  width: { size: 4500, type: WidthType.DXA },
                  shading: { fill: THEME.navy },
                  borders: cellBorders,
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "What do I look for?", bold: true, color: THEME.pureWhite, size: 18 })] })]
                }),
                new TableCell({
                  width: { size: 1500, type: WidthType.DXA },
                  shading: { fill: THEME.navy },
                  borders: cellBorders,
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Done?", bold: true, color: THEME.pureWhite, size: 18 })] })]
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ width: { size: 3000, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Capital Letters", bold: true, size: 18 })] })] }),
                new TableCell({ width: { size: 4500, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Does every sentence start with a capital letter?", size: 18 })] })] }),
                new TableCell({ width: { size: 1500, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "[   ]", size: 18 })] })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ width: { size: 3000, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Full Stops", bold: true, size: 18 })] })] }),
                new TableCell({ width: { size: 4500, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Does every sentence end with a full stop?", size: 18 })] })] }),
                new TableCell({ width: { size: 1500, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "[   ]", size: 18 })] })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ width: { size: 3000, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Topic Words", bold: true, size: 18 })] })] }),
                new TableCell({ width: { size: 4500, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Did I use my spelling topic words correctly?", size: 18 })] })] }),
                new TableCell({ width: { size: 1500, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "[   ]", size: 18 })] })] })
              ]
            })
          ]
        }),

        new Paragraph({ children: [new PageBreak()] }),

        // Practice section
        new Paragraph({
          children: [new TextRun({ text: "Punctuation Patrol Practice", bold: true, size: 24, color: THEME.navy })],
          spacing: { before: 100, after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Find the mistakes (capital letters and full stops) in the sentences below. Rewrite them correctly on the lines.", size: 20 })],
          spacing: { after: 150 }
        }),

        new Paragraph({
          children: [new TextRun({ text: "1. firehawks are very clever birds", size: 20, italics: true })],
          spacing: { before: 100, after: 50 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Rewrite: _______________________________________________________________________________", size: 20 })],
          spacing: { after: 150 }
        }),

        new Paragraph({
          children: [new TextRun({ text: "2. they carry hot twigs in their sharp claws", size: 20, italics: true })],
          spacing: { before: 100, after: 50 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Rewrite: _______________________________________________________________________________", size: 20 })],
          spacing: { after: 150 }
        }),

        new Paragraph({
          children: [new TextRun({ text: "3. dry grass burns quickly near the forest", size: 20, italics: true })],
          spacing: { before: 100, after: 50 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Rewrite: _______________________________________________________________________________", size: 20 })],
          spacing: { after: 200 }
        }),

        // Visual drawing and labeling box
        new Paragraph({
          children: [new TextRun({ text: "My Firehawk Punctuation Poster", bold: true, size: 24, color: THEME.orange })],
          spacing: { before: 150, after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Draw a picture of a firehawk flying high. Circle the capital letter at the start of your caption and the full stop at the end!", size: 20 })],
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

// Generate MS Forms Assessment
async function generateAssessment(filename) {
  const questions = [
    {
      q: "1. Which of the following is a complex sentence that starts with a dependent clause to vary the sentence starting point (theme)?",
      a: "A. Firehawks carry burning twigs across rivers, and they start fires.",
      b: "B. Because they want to capture fleeing prey, brown falcons carry smouldering twigs.",
      c: "C. The conflagration spread very fast due to heavy winds.",
      d: "D. Brown falcons search for prey while hovering above active blazes.",
      ans: "B"
    },
    {
      q: "2. In an informative report, which editing revision correctly swaps general vocabulary for precise specialist vocabulary?",
      a: "A. Swapping “eat” for “chew”",
      b: "B. Swapping “small twigs” for “woody fuel loads”",
      c: "C. Swapping “hot stick” for “smouldering twig”",
      d: "D. Swapping “dry brush” for “dead grass”",
      ans: "C"
    },
    {
      q: "3. What is the main purpose of an editing checklist during the revision phase of an information report?",
      a: "A. To write a completely new story about bushfires.",
      b: "B. To systematically check spelling, punctuation, sentence variety, and precise vocabulary.",
      c: "C. To add decorative drawings and colorful borders to the pages.",
      d: "D. To copy and paste facts directly from a website.",
      ans: "B"
    },
    {
      q: "4. Identify the run-on sentence that requires split punctuation or a coordinating conjunction to be grammatically correct:",
      a: "A. High winds pushed embers ahead of the front, which ignited multiple secondary blazes.",
      b: "B. Firefighters established containment lines, however they were breached by spot fires.",
      c: "C. Raptors forage near conflagrations they transport twigs to flush out lizards.",
      d: "D. Although fuel loads were wet, the extreme heat dried them out instantly.",
      ans: "C"
    },
    {
      q: "5. Select the sentence that is written in a formal, objective register appropriate for an information report:",
      a: "A. I think it is amazing that falcons can carry burning twigs across wide rivers.",
      b: "B. The terrifying conflagration destroyed the forest, which was really sad to see.",
      c: "C. Research demonstrates that certain raptors intentionally transport smouldering twigs.",
      d: "D. We must work hard to stop these horrible blazes from burning down homes.",
      ans: "C"
    },
    {
      q: "6. Which of the following displays the correct Australian spelling convention for an editing action?",
      a: "A. The teacher modeled the correct sentence structure on the board.",
      b: "B. Students must practise their spelling words before drafting.",
      c: "C. The council decided to organize a hazard reduction burn.",
      d: "D. The bird's behavior was closely studied by rangers.",
      ans: "B"
    },
    {
      q: "7. Which precise text connective is most appropriate to show a cause-and-effect relationship between high winds and spot fires?",
      a: "A. In contrast",
      b: "B. Consequently",
      c: "C. Alternatively",
      d: "D. Furthermore",
      ans: "B"
    },
    {
      q: "8. Select the correctly constructed expanded noun group that provides a full description of a firefighter's protective gear:",
      a: "A. The yellow jacket which was hot and thick.",
      b: "B. The fire-retardant, high-visibility proban jacket worn by frontline crews.",
      c: "C. A jacket that protects them from extreme temperatures.",
      d: "D. The firefighter's yellow cotton coat with reflective safety stripes.",
      ans: "B"
    },
    {
      q: "9. Identify the sentence that contains a spelling error in a common natural disaster or editing term:",
      a: "A. High fuel flammability accelerates conflagration spreading.",
      b: "B. Firefighters prepare extensive containment boundaries.",
      c: "C. The raptors maneuvered quickly through the smoke columns.",
      d: "D. The study focuses on paragraph transitions and coheasion.",
      ans: "D"
    },
    {
      q: "10. In the sentence: “Although containment lines were active, the conflagration breached the river.” What is the grammatical function of the underlined word conflagration?",
      a: "A. An informal, subjective adjective describing the river.",
      b: "B. A precise, topic-specific specialist noun replacing the general word fire.",
      c: "C. A coordinating conjunction linking two independent clauses.",
      d: "D. A circumstantial starter indicating the place where the fire started.",
      ans: "B"
    }
  ];

  const children = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "Lesson 24 Assessment: Editing and Revision Diagnostics", bold: true, size: 36, color: THEME.navy })],
      spacing: { after: 400 }
    }),
    new Paragraph({
      children: [new TextRun({ text: "This assessment contains 10 multiple-choice questions focusing on identifying run-on vs. complex sentences, selecting cohesive connectives, upgrading vocabulary, and maintaining formal register. Suitable for import into Microsoft Forms.", size: 22 })],
      spacing: { after: 300 }
    })
  ];

  questions.forEach(item => {
    children.push(new Paragraph({ children: [new TextRun({ text: item.q, bold: true, size: 24 })], spacing: { before: 200 } }));
    children.push(new Paragraph({ children: [new TextRun({ text: item.a, size: 24 })] }));
    children.push(new Paragraph({ children: [new TextRun({ text: item.b, size: 24 })] }));
    children.push(new Paragraph({ children: [new TextRun({ text: item.c, size: 24 })] }));
    children.push(new Paragraph({ children: [new TextRun({ text: item.d, size: 24 })] }));
    children.push(new Paragraph({ children: [new TextRun({ text: `ANS: ${item.ans}`, bold: true, size: 24, color: THEME.green })], spacing: { after: 200 } }));
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
    await generateWorksheet(path.join(outputDir, 'Lesson_24_Worksheet.docx'));
    await generateLucasHandout(path.join(outputDir, 'Lesson_24_Lucas_Handout.docx'));
    await generateAssessment(path.join(outputDir, 'Lesson_24_Assessment.docx'));
    console.log("🎉 All three Word documents generated successfully!");
  } catch (error) {
    console.error("❌ Error generating documents:", error);
    process.exit(1);
  }
}

run();
