const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, LevelFormat, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign
} = require('docx');

// Dimensions for A4 with 1 inch (1440 dxa) margins: Total width 11906, printable width 9026 dxa
const PAGE_WIDTH = 11906;
const PAGE_HEIGHT = 16838;
const MARGIN = 1440;
const PRINTABLE_WIDTH = 9026;

// Color Palette
const COLOR_PRIMARY = "1B4D3E";    // Deep Rainforest Green
const COLOR_SECONDARY = "2E6F40";  // Medium Leaf Green
const COLOR_ACCENT = "C88A2B";     // Warm Gold / Amber
const COLOR_TEXT = "222222";       // Charcoal Dark Slate
const COLOR_LIGHT_BG = "F0F7F4";   // Soft Sage Tint
const COLOR_ALT_ROW = "F7FAF8";    // Very Soft Mint Tint
const COLOR_BORDER = "CCCCCC";     // Muted Gray Border
const COLOR_WHITE = "FFFFFF";

// Helper for standard cell borders
const borderThin = { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER };
const cellBordersStandard = { top: borderThin, bottom: borderThin, left: borderThin, right: borderThin };
const cellBordersNone = { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } };

// Helper to create heading paragraphs
function createHeading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 180 },
    children: [
      new TextRun({
        text: text,
        bold: true,
        size: 32, // 16pt
        color: COLOR_PRIMARY,
        font: "Arial"
      })
    ]
  });
}

function createHeading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 140 },
    children: [
      new TextRun({
        text: text,
        bold: true,
        size: 26, // 13pt
        color: COLOR_SECONDARY,
        font: "Arial"
      })
    ]
  });
}

function createBodyParagraph(text, options = {}) {
  return new Paragraph({
    spacing: { before: 60, after: 120, line: 276 }, // 1.15 line spacing
    alignment: options.alignment || AlignmentType.LEFT,
    children: [
      new TextRun({
        text: text,
        size: 22, // 11pt
        color: options.color || COLOR_TEXT,
        bold: options.bold || false,
        italics: options.italics || false,
        font: "Arial"
      })
    ]
  });
}

// Create callout box (single cell table)
function createCalloutBox(title, bodyParagraphs, bgColor = COLOR_LIGHT_BG, borderColor = COLOR_PRIMARY) {
  const customBorder = { style: BorderStyle.SINGLE, size: 12, color: borderColor };
  const boxBorders = { top: customBorder, bottom: customBorder, left: customBorder, right: customBorder };

  const children = [];
  if (title) {
    children.push(new Paragraph({
      spacing: { before: 60, after: 120 },
      children: [
        new TextRun({
          text: title,
          bold: true,
          size: 24, // 12pt
          color: borderColor,
          font: "Arial"
        })
      ]
    }));
  }

  bodyParagraphs.forEach(p => {
    children.push(p);
  });

  return new Table({
    columnWidths: [PRINTABLE_WIDTH],
    margins: { top: 180, bottom: 180, left: 240, right: 240 },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: PRINTABLE_WIDTH, type: WidthType.DXA },
            shading: { fill: bgColor, type: ShadingType.CLEAR },
            borders: boxBorders,
            children: children
          })
        ]
      })
    ]
  });
}

// Build Document
const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: "Arial", size: 22, color: COLOR_TEXT }
      }
    },
    paragraphStyles: [
      {
        id: "Heading1",
        name: "Heading 1",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 32, bold: true, color: COLOR_PRIMARY, font: "Arial" },
        paragraph: { spacing: { before: 360, after: 180 }, outlineLevel: 0 }
      },
      {
        id: "Heading2",
        name: "Heading 2",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 26, bold: true, color: COLOR_SECONDARY, font: "Arial" },
        paragraph: { spacing: { before: 280, after: 140 }, outlineLevel: 1 }
      }
    ]
  },
  numbering: {
    config: [
      {
        reference: "bullet-list",
        levels: [
          {
            level: 0,
            format: LevelFormat.BULLET,
            text: "•",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } }
          }
        ]
      }
    ]
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: PAGE_WIDTH, height: PAGE_HEIGHT },
          margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN }
        }
      },
      children: [
        // Title Banner Table
        new Table({
          columnWidths: [PRINTABLE_WIDTH],
          margins: { top: 240, bottom: 240, left: 280, right: 280 },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: PRINTABLE_WIDTH, type: WidthType.DXA },
                  shading: { fill: COLOR_PRIMARY, type: ShadingType.CLEAR },
                  borders: cellBordersNone,
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      spacing: { before: 120, after: 60 },
                      children: [
                        new TextRun({
                          text: "YEAR 5 ENGLISH PERSUASIVE WRITING EXEMPLAR",
                          bold: true,
                          size: 32, // 16pt
                          color: COLOR_WHITE,
                          font: "Arial"
                        })
                      ]
                    }),
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      spacing: { before: 0, after: 120 },
                      children: [
                        new TextRun({
                          text: "Assessment Task 3: Express an Opinion — Protecting Indonesian Orangutans",
                          italics: true,
                          size: 24, // 12pt
                          color: COLOR_ACCENT,
                          font: "Arial"
                        })
                      ]
                    })
                  ]
                })
              ]
            })
          ]
        }),

        new Paragraph({ spacing: { before: 180, after: 180 } }),

        // Student & Teacher Info Table
        new Table({
          columnWidths: [4513, 4513],
          margins: { top: 100, bottom: 100, left: 180, right: 180 },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 4513, type: WidthType.DXA },
                  shading: { fill: COLOR_LIGHT_BG, type: ShadingType.CLEAR },
                  borders: cellBordersStandard,
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({ text: "Student Name: ", bold: true, size: 20 }),
                        new TextRun({ text: "_______________________", size: 20 })
                      ]
                    })
                  ]
                }),
                new TableCell({
                  width: { size: 4513, type: WidthType.DXA },
                  shading: { fill: COLOR_LIGHT_BG, type: ShadingType.CLEAR },
                  borders: cellBordersStandard,
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({ text: "Class: ", bold: true, size: 20 }),
                        new TextRun({ text: "Year 5 ____", size: 20 }),
                        new TextRun({ text: "   Date: ", bold: true, size: 20 }),
                        new TextRun({ text: "____________", size: 20 })
                      ]
                    })
                  ]
                })
              ]
            })
          ]
        }),

        new Paragraph({ spacing: { before: 180, after: 180 } }),

        // Student Guidance Callout
        createCalloutBox(
          "📌 How to Use This Student Assessment Exemplar",
          [
            new Paragraph({
              spacing: { before: 60, after: 60 },
              children: [
                new TextRun({
                  text: "This document is a high-level (A-Standard) exemplar designed to help you plan, write, and present your persuasive response for Assessment Task 3. Use this model to observe how to:",
                  size: 20
                })
              ]
            }),
            new Paragraph({
              numbering: { reference: "bullet-list", level: 0 },
              children: [new TextRun({ text: "Organise your research using a clear planning sheet (Part A Planning).", size: 20 })]
            }),
            new Paragraph({
              numbering: { reference: "bullet-list", level: 0 },
              children: [new TextRun({ text: "Structure a 5-paragraph persuasive essay with topic sentences and authoritative evidence.", size: 20 })]
            }),
            new Paragraph({
              numbering: { reference: "bullet-list", level: 0 },
              children: [new TextRun({ text: "Address and counter opposing viewpoints with mature rebuttals.", size: 20 })]
            }),
            new Paragraph({
              numbering: { reference: "bullet-list", level: 0 },
              children: [new TextRun({ text: "Annotate your speech transcript for voice delivery (pitch, tone, pace, gestures) for your presentation (Part B).", size: 20 })]
            })
          ]
        ),

        new Paragraph({ spacing: { before: 240, after: 120 } }),

        // Section 1 Header
        createHeading1("1. Part A: Completed Student Planning Sheet Exemplar"),

        // Planning Sheet Table
        new Table({
          columnWidths: [2700, 6326],
          margins: { top: 120, bottom: 120, left: 180, right: 180 },
          rows: [
            new TableRow({
              tableHeader: true,
              children: [
                new TableCell({
                  width: { size: 2700, type: WidthType.DXA },
                  shading: { fill: COLOR_PRIMARY, type: ShadingType.CLEAR },
                  borders: cellBordersStandard,
                  children: [new Paragraph({ children: [new TextRun({ text: "Planning Category", bold: true, color: COLOR_WHITE, size: 22 })] })]
                }),
                new TableCell({
                  width: { size: 6326, type: WidthType.DXA },
                  shading: { fill: COLOR_PRIMARY, type: ShadingType.CLEAR },
                  borders: cellBordersStandard,
                  children: [new Paragraph({ children: [new TextRun({ text: "Exemplar Student Details", bold: true, color: COLOR_WHITE, size: 22 })] })]
                })
              ]
            }),
            ...[
              ["Topic", "Eradicating destructive palm oil farms in Indonesia to save critically endangered orangutans."],
              ["Stance / Opinion", "Industrial, uncertified palm oil farming in Indonesia must be stopped immediately to protect orangutan habitats and prevent species extinction."],
              ["Target Audience", "School community members, young consumers, and local consumer action groups."],
              ["Formality & Tone", "Formal, passionate, urgent, and evidence-based."],
              ["Hook Strategy", "Vivid imagery of a peaceful rainforest canopy contrasted sharply with the destructive roar of heavy machinery."],
              ["Argument 1 (Habitat Loss)", "Palm oil deforestation destroys ancient rainforest homes. Evidence: World Wildlife Fund (WWF) notes over 80% of habitat cleared in 20 years. Direct quote from Dr Biruté Galdikas."],
              ["Argument 2 (Biodiversity)", "Loss of orangutans causes total ecosystem collapse. Evidence: IUCN reports orangutan populations plunged over 60%. Monocultures destroy biodiversity."],
              ["Counterargument & Rebuttal", "Counter: Palm oil provides jobs for local Indonesian workers. Rebuttal: Sustainable agroforestry, eco-tourism, and RSPO certification provide stable jobs without forest destruction."],
              ["Persuasive Devices", "Rhetorical questions, rule of three, modal verbs (must, urgently, cannot), expanded noun groups, high-impact emotive adjectives, expert quote."],
              ["Call to Action", "Demanding product label transparency, boycotting uncertified palm oil, and protecting rainforest canopies."]
            ].map(([cat, desc], idx) => new TableRow({
              children: [
                new TableCell({
                  width: { size: 2700, type: WidthType.DXA },
                  shading: { fill: idx % 2 === 0 ? COLOR_LIGHT_BG : COLOR_WHITE, type: ShadingType.CLEAR },
                  borders: cellBordersStandard,
                  children: [new Paragraph({ children: [new TextRun({ text: cat, bold: true, size: 20, color: COLOR_PRIMARY })] })]
                }),
                new TableCell({
                  width: { size: 6326, type: WidthType.DXA },
                  shading: { fill: idx % 2 === 0 ? COLOR_LIGHT_BG : COLOR_WHITE, type: ShadingType.CLEAR },
                  borders: cellBordersStandard,
                  children: [new Paragraph({ children: [new TextRun({ text: desc, size: 20 })] })]
                })
              ]
            }))
          ]
        }),

        new Paragraph({ spacing: { before: 280, after: 140 } }),

        // Section 2 Header
        createHeading1("2. Part A: Year 5 A-Standard Written Persuasive Text"),

        // Essay Callout Box
        createCalloutBox(
          "Silent Voices of the Rainforest: Why We Must Stop Palm Oil Destruction to Save Indonesia’s Orangutans",
          [
            new Paragraph({
              spacing: { before: 100, after: 140, line: 276 },
              children: [
                new TextRun({
                  text: "Imagine walking through a lush, ancient Indonesian rainforest, surrounded by towering emerald trees, only to hear the crushing roar of a bulldozer flattening everything in its path. This devastating reality is happening right now across Sumatra and Borneo. Industrial palm oil plantations are systematically destroying the sacred habitat of the critically endangered orangutan. To protect these magnificent creatures—our closest biological relatives sharing nearly 97 per cent of human DNA—we must urgently eradicate destructive, uncertified palm oil farming in Indonesia and demand sustainable alternatives.",
                  size: 22
                })
              ]
            }),
            new Paragraph({
              spacing: { before: 100, after: 140, line: 276 },
              children: [
                new TextRun({
                  text: "Firstly, the rapid expansion of industrial palm oil farms is driving unprecedented habitat destruction. According to research from the World Wildlife Fund (WWF), over 80 per cent of orangutan habitat has been cleared in the past twenty years to make way for vast monoculture palm plantations. When these ancient trees are cut down, orangutans lose their shelter, nesting sites, and essential food sources like wild figs and bark. Dr Biruté Galdikas, a world-renowned primatologist, warned, ",
                  size: 22
                }),
                new TextRun({
                  text: "“If we do not stop the clearing of Indonesia’s ancient canopies immediately, wild orangutans could become extinct within our lifetime.”",
                  italics: true,
                  bold: true,
                  size: 22,
                  color: COLOR_PRIMARY
                }),
                new TextRun({
                  text: " Without their forest homes, these gentle copper-haired primates are left displaced, vulnerable, and starving.",
                  size: 22
                })
              ]
            }),
            new Paragraph({
              spacing: { before: 100, after: 140, line: 276 },
              children: [
                new TextRun({
                  text: "Secondly, palm oil deforestation inflicts catastrophic damage on broader rainforest ecosystems. Tropical rainforests in Indonesia are global biodiversity hotspots, supporting thousands of unique plant and animal species. Destroying these forests for cheap palm oil does not merely displace orangutans; it causes total ecosystem collapse. International Union for Conservation of Nature (IUCN) data reveals that orangutan populations have plunged by over 60 per cent in recent decades, leaving them critically endangered. Every single hectare of burnt forest represents lost lives and destroyed ecosystems. Can we truly justify wiping out an entire species simply to produce cheap ingredients for chocolate bars, soaps, and cosmetics?",
                  size: 22
                })
              ]
            }),
            new Paragraph({
              spacing: { before: 100, after: 140, line: 276 },
              children: [
                new TextRun({
                  text: "Some people may argue that palm oil farming is necessary because it provides vital income for local Indonesian farmers and communities. While economic livelihood is important, continuing to destroy ancient ecosystems is an unsustainable disaster. According to economic research by the Rainforest Action Network, transitioning towards eco-tourism, sustainable agroforestry, and RSPO-certified farming creates long-term, stable jobs without devastating the environment. Furthermore, as responsible global consumers, we have the power to refuse products containing uncertified palm oil, forcing large corporations to adopt ethical practices. Protecting jobs and saving orangutans do not have to be mutually exclusive; we can achieve both through strict environmental regulation.",
                  size: 22
                })
              ]
            }),
            new Paragraph({
              spacing: { before: 100, after: 140, line: 276 },
              children: [
                new TextRun({
                  text: "In conclusion, eradicating destructive palm oil farming in Indonesia is an absolute necessity to prevent the extinction of orangutans. By preserving ancient forest canopies, supporting eco-certified agriculture, and speaking up for wildlife, we can ensure a safe future for these incredible animals. We cannot stand silently by while bulldozers tear down the lungs of our planet. The time for action is right now—will you choose to protect Indonesia’s ancient rainforests before the last orangutan disappears forever?",
                  bold: true,
                  size: 22
                })
              ]
            })
          ],
          COLOR_ALT_ROW,
          COLOR_PRIMARY
        ),

        new Paragraph({ spacing: { before: 280, after: 140 } }),

        // Section 3 Header
        createHeading1("3. Why This Achieves an A-Standard (Year 5 Curriculum Breakdown)"),

        // Breakdown Table
        new Table({
          columnWidths: [2600, 3600, 2826],
          margins: { top: 120, bottom: 120, left: 180, right: 180 },
          rows: [
            new TableRow({
              tableHeader: true,
              children: [
                new TableCell({
                  width: { size: 2600, type: WidthType.DXA },
                  shading: { fill: COLOR_PRIMARY, type: ShadingType.CLEAR },
                  borders: cellBordersStandard,
                  children: [new Paragraph({ children: [new TextRun({ text: "Criterion Area", bold: true, color: COLOR_WHITE, size: 22 })] })]
                }),
                new TableCell({
                  width: { size: 3600, type: WidthType.DXA },
                  shading: { fill: COLOR_PRIMARY, type: ShadingType.CLEAR },
                  borders: cellBordersStandard,
                  children: [new Paragraph({ children: [new TextRun({ text: "Evidence in Exemplar Text", bold: true, color: COLOR_WHITE, size: 22 })] })]
                }),
                new TableCell({
                  width: { size: 2826, type: WidthType.DXA },
                  shading: { fill: COLOR_PRIMARY, type: ShadingType.CLEAR },
                  borders: cellBordersStandard,
                  children: [new Paragraph({ children: [new TextRun({ text: "AC v9 Standard Alignment", bold: true, color: COLOR_WHITE, size: 22 })] })]
                })
              ]
            }),
            ...[
              [
                "Text Structure & Paragraphing",
                "• Clear introduction with sensory hook and explicit thesis statement.\n• 3 body paragraphs starting with strong topic sentences (Firstly, Secondly, Some people may argue...).\n• Reiteration of thesis in conclusion with a call to action.",
                "AC9E5LA03\nUses structured paragraphs and cohesive transition devices (firstly, while, furthermore, in conclusion) to link ideas."
              ],
              [
                "Ideas & Authoritative Evidence",
                "• Stats from WWF (>80% habitat loss) and IUCN (>60% population drop).\n• Direct expert quote (Dr Biruté Galdikas).\n• Directly refutes economic counterargument using Rainforest Action Network data.",
                "AC9E5LE01 / AC9E5LY06\nDevelops and expands on ideas with authoritative evidence, showing critical thinking."
              ],
              [
                "Language Features & Sentences",
                "• Complex sentences combining subordinate clauses (While economic livelihood is important...).\n• Expanded noun groups (vast monoculture palm plantations, gentle copper-haired primates).\n• High modality verbs (must, urgently, cannot).",
                "AC9E5LA08\nDemonstrates high-level control of complex sentence structures, expanded nominals, and persuasive modality."
              ],
              [
                "Persuasive Devices & Devices",
                "• Emotive imagery (lungs of our planet, crushing roar of a bulldozer).\n• Rhetorical questions (Can we truly justify...? Will you choose...?).\n• Rule of three (displaced, vulnerable, and starving).",
                "AC9E5LY07\nEmploys figurative language and persuasive devices effectively to persuade the target audience."
              ],
              [
                "Vocabulary & Spelling",
                "• Precise topic vocabulary (monoculture, biodiversity hotspots, agroforestry, RSPO-certified).\n• Accurate Australian English spelling (per cent, recognise, colour).",
                "AC9E5LY08\nDemonstrates accurate morphemic and topic-specific vocabulary spelling."
              ]
            ].map(([crit, ev, std], idx) => new TableRow({
              children: [
                new TableCell({
                  width: { size: 2600, type: WidthType.DXA },
                  shading: { fill: idx % 2 === 0 ? COLOR_LIGHT_BG : COLOR_WHITE, type: ShadingType.CLEAR },
                  borders: cellBordersStandard,
                  children: [new Paragraph({ children: [new TextRun({ text: crit, bold: true, size: 20, color: COLOR_PRIMARY })] })]
                }),
                new TableCell({
                  width: { size: 3600, type: WidthType.DXA },
                  shading: { fill: idx % 2 === 0 ? COLOR_LIGHT_BG : COLOR_WHITE, type: ShadingType.CLEAR },
                  borders: cellBordersStandard,
                  children: ev.split('\n').map(line => new Paragraph({ children: [new TextRun({ text: line, size: 20 })] }))
                }),
                new TableCell({
                  width: { size: 2826, type: WidthType.DXA },
                  shading: { fill: idx % 2 === 0 ? COLOR_LIGHT_BG : COLOR_WHITE, type: ShadingType.CLEAR },
                  borders: cellBordersStandard,
                  children: std.split('\n').map((line, lIdx) => new Paragraph({ children: [new TextRun({ text: line, bold: lIdx === 0, size: 20, color: lIdx === 0 ? COLOR_SECONDARY : COLOR_TEXT })] }))
                })
              ]
            }))
          ]
        }),

        new Paragraph({ spacing: { before: 280, after: 140 } }),

        // Section 4 Header
        createHeading1("4. Part B: Speaking & Listening Presentation Transcript"),

        createBodyParagraph("Use this annotated script to practise your oral presentation. Notice how voice features (pitch, tone, pace, volume) and visual slide cues are planned to maximize persuasive impact."),

        // Speech Annotations Callout Box
        createCalloutBox(
          "Annotated Speech Transcript (Suggested Time: 1:45 – 2:00 mins)",
          [
            new Paragraph({
              spacing: { before: 80, after: 80 },
              children: [
                new TextRun({ text: "[VISUAL CUE: Slide displaying a vivid photo of an orangutan mother and infant high in the rainforest canopy.]", bold: true, color: COLOR_ACCENT, size: 20 })
              ]
            }),
            new Paragraph({
              spacing: { before: 60, after: 100 },
              children: [
                new TextRun({ text: "[TONE: Warm, engaging, measured. PACE: Moderate. GESTURE: Direct eye contact, open hands.]\n", italics: true, color: COLOR_SECONDARY, size: 20 }),
                new TextRun({ text: "Good morning teachers and classmates.", size: 22 })
              ]
            }),
            new Paragraph({
              spacing: { before: 60, after: 100 },
              children: [
                new TextRun({ text: "[PAUSE - 2 seconds. PITCH: Drops slightly, earnest.]\n", italics: true, color: COLOR_SECONDARY, size: 20 }),
                new TextRun({ text: "Imagine walking through a lush, ancient Indonesian rainforest, surrounded by towering emerald trees, only to hear the crushing roar of a bulldozer flattening everything in its path.", size: 22 })
              ]
            }),
            new Paragraph({
              spacing: { before: 60, after: 100 },
              children: [
                new TextRun({ text: "[TONE: Urgent and serious. EMPHASIS on 'devastating' and 'right now'.]\n", italics: true, color: COLOR_SECONDARY, size: 20 }),
                new TextRun({ text: "This devastating reality is happening right now across Sumatra and Borneo. Industrial palm oil plantations are systematically destroying the home of the critically endangered orangutan. To protect these magnificent creatures—our closest animal relatives—we must urgently stop destructive palm oil farming in Indonesia and demand sustainable alternatives.", size: 22 })
              ]
            }),
            new Paragraph({
              spacing: { before: 80, after: 80 },
              children: [
                new TextRun({ text: "[VISUAL CUE: Slide changes to show WWF map highlighting 80% forest loss in Borneo and Sumatra.]", bold: true, color: COLOR_ACCENT, size: 20 })
              ]
            }),
            new Paragraph({
              spacing: { before: 60, after: 100 },
              children: [
                new TextRun({ text: "[TONE: Authoritative, informative. PACE: Steady and clear.]\n", italics: true, color: COLOR_SECONDARY, size: 20 }),
                new TextRun({ text: "Firstly, palm oil expansion is driving unprecedented habitat destruction. According to the World Wildlife Fund, over 80 per cent of orangutan habitat has been cleared in just twenty years. When these ancient trees are cut down, orangutans lose their shelter, nesting sites, and food. As world-renowned expert Dr Biruté Galdikas warned:", size: 22 })
              ]
            }),
            new Paragraph({
              spacing: { before: 60, after: 100 },
              children: [
                new TextRun({ text: "[PITCH: Lowered, deliberate emphasis. VOLUME: Increased slightly for quotation.]\n", italics: true, color: COLOR_SECONDARY, size: 20 }),
                new TextRun({ text: "“If we do not stop the clearing of Indonesia’s ancient canopies immediately, wild orangutans could become extinct within our lifetime.”", bold: true, italics: true, color: COLOR_PRIMARY, size: 22 })
              ]
            }),
            new Paragraph({
              spacing: { before: 60, after: 100 },
              children: [
                new TextRun({ text: "[TONE: Empathic, moving. GESTURE: Hand to heart or subtle lean forward.]\n", italics: true, color: COLOR_SECONDARY, size: 20 }),
                new TextRun({ text: "Without their forest homes, these gentle copper-haired primates are left displaced, vulnerable, and starving.", size: 22 })
              ]
            }),
            new Paragraph({
              spacing: { before: 80, after: 80 },
              children: [
                new TextRun({ text: "[VISUAL CUE: Slide showing product labels with hidden palm oil names vs RSPO-certified sustainable logo.]", bold: true, color: COLOR_ACCENT, size: 20 })
              ]
            }),
            new Paragraph({
              spacing: { before: 60, after: 100 },
              children: [
                new TextRun({ text: "[TONE: Challenging, persuasive. EMPHASIS on '60 per cent'.]\n", italics: true, color: COLOR_SECONDARY, size: 20 }),
                new TextRun({ text: "Secondly, International Union for Conservation of Nature data reveals that orangutan populations have plunged by over 60 per cent. Can we truly justify wiping out an entire species simply to produce cheap ingredients for chocolates, soaps, and cosmetics?", size: 22 })
              ]
            }),
            new Paragraph({
              spacing: { before: 60, after: 100 },
              children: [
                new TextRun({ text: "[TONE: Respectful, balanced, acknowledging complexity. PACE: Controlled.]\n", italics: true, color: COLOR_SECONDARY, size: 20 }),
                new TextRun({ text: "Now, some people argue that palm oil farming is necessary because it provides jobs for local Indonesian workers. While economic livelihoods are important, destroying ancient ecosystems is an unsustainable disaster. Research shows that transitioning to eco-tourism and RSPO-certified sustainable farming creates long-term jobs without devastating the environment. We can protect jobs and save orangutans at the same time!", size: 22 })
              ]
            }),
            new Paragraph({
              spacing: { before: 80, after: 80 },
              children: [
                new TextRun({ text: "[VISUAL CUE: Final slide showing call to action: 'Check the Label. Choose Sustainable. Save the Rainforest.']", bold: true, color: COLOR_ACCENT, size: 20 })
              ]
            }),
            new Paragraph({
              spacing: { before: 60, after: 100 },
              children: [
                new TextRun({ text: "[TONE: Inspiring, passionate, forceful. PACE: Slower for impact. GESTURE: Firm persuasive movement.]\n", italics: true, color: COLOR_SECONDARY, size: 20 }),
                new TextRun({ text: "In conclusion, eradicating destructive palm oil farming in Indonesia is essential to prevent extinction. We cannot stand silently by while bulldozers tear down the lungs of our planet. ", size: 22 })
              ]
            }),
            new Paragraph({
              spacing: { before: 60, after: 100 },
              children: [
                new TextRun({ text: "[PAUSE - 2 seconds. Look directly across audience.]\n", italics: true, color: COLOR_SECONDARY, size: 20 }),
                new TextRun({ text: "The time for action is right now. Will you choose to protect Indonesia’s ancient rainforests before the last orangutan disappears forever?", bold: true, size: 22 })
              ]
            }),
            new Paragraph({
              spacing: { before: 60, after: 60 },
              children: [
                new TextRun({ text: "Thank you.", size: 22 })
              ]
            })
          ],
          COLOR_LIGHT_BG,
          COLOR_SECONDARY
        ),

        new Paragraph({ spacing: { before: 280, after: 140 } }),

        // Section 5 Header
        createHeading1("5. Teacher Marking Guide & Formative Feedback Grid"),

        // Rubric Table
        new Table({
          columnWidths: [2200, 5026, 1800],
          margins: { top: 120, bottom: 120, left: 180, right: 180 },
          rows: [
            new TableRow({
              tableHeader: true,
              children: [
                new TableCell({
                  width: { size: 2200, type: WidthType.DXA },
                  shading: { fill: COLOR_PRIMARY, type: ShadingType.CLEAR },
                  borders: cellBordersStandard,
                  children: [new Paragraph({ children: [new TextRun({ text: "Assessment Aspect", bold: true, color: COLOR_WHITE, size: 22 })] })]
                }),
                new TableCell({
                  width: { size: 5026, type: WidthType.DXA },
                  shading: { fill: COLOR_PRIMARY, type: ShadingType.CLEAR },
                  borders: cellBordersStandard,
                  children: [new Paragraph({ children: [new TextRun({ text: "A-Grade Achievement Description", bold: true, color: COLOR_WHITE, size: 22 })] })]
                }),
                new TableCell({
                  width: { size: 1800, type: WidthType.DXA },
                  shading: { fill: COLOR_PRIMARY, type: ShadingType.CLEAR },
                  borders: cellBordersStandard,
                  children: [new Paragraph({ children: [new TextRun({ text: "Exemplar Result", bold: true, color: COLOR_WHITE, size: 22 })] })]
                })
              ]
            }),
            ...[
              [
                "Writing & Creating:\nText Structure",
                "Creates a detailed, sequenced and cohesive written persuasive text for an identified audience, using a range of well-structured paragraphs and cohesive devices.",
                "GRADE A\n(Exemplary)"
              ],
              [
                "Writing & Creating:\nIdeas & Evidence",
                "Develops and expands on ideas, providing supporting details and drawing information from authoritative sources. Rebuts counterarguments.",
                "GRADE A\n(Exemplary)"
              ],
              [
                "Writing & Creating:\nLanguage Features",
                "Uses a wide range of language features creatively, including complex sentences with expanded noun groups, modal verbs, literary devices, and topic vocabulary.",
                "GRADE A\n(Exemplary)"
              ],
              [
                "Speaking & Listening:\nOral Presentation",
                "Presents and justifies an opinion using researched details. Varies pitch, tone, pace, and volume to enhance audience engagement and persuasive force.",
                "GRADE A\n(Exemplary)"
              ],
              [
                "Spelling Strategy:\nMonitoring",
                "Spells complex topic-specific words and morphological variants accurately throughout.",
                "DEMONSTRATING\n(Pass)"
              ]
            ].map(([asp, desc, res], idx) => new TableRow({
              children: [
                new TableCell({
                  width: { size: 2200, type: WidthType.DXA },
                  shading: { fill: idx % 2 === 0 ? COLOR_LIGHT_BG : COLOR_WHITE, type: ShadingType.CLEAR },
                  borders: cellBordersStandard,
                  children: asp.split('\n').map((l, i) => new Paragraph({ children: [new TextRun({ text: l, bold: i === 0, size: 20, color: COLOR_PRIMARY })] }))
                }),
                new TableCell({
                  width: { size: 5026, type: WidthType.DXA },
                  shading: { fill: idx % 2 === 0 ? COLOR_LIGHT_BG : COLOR_WHITE, type: ShadingType.CLEAR },
                  borders: cellBordersStandard,
                  children: [new Paragraph({ children: [new TextRun({ text: desc, size: 20 })] })]
                }),
                new TableCell({
                  width: { size: 1800, type: WidthType.DXA },
                  shading: { fill: idx % 2 === 0 ? COLOR_LIGHT_BG : COLOR_WHITE, type: ShadingType.CLEAR },
                  borders: cellBordersStandard,
                  children: res.split('\n').map((l, i) => new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: l, bold: true, size: 20, color: i === 0 ? COLOR_PRIMARY : COLOR_SECONDARY })] }))
                })
              ]
            }))
          ]
        }),

        new Paragraph({ spacing: { before: 200, after: 100 } }),

        // Teacher Feedback Box
        createCalloutBox(
          "💬 Teacher Formative Feedback Comment Example",
          [
            new Paragraph({
              spacing: { before: 60, after: 60, line: 276 },
              children: [
                new TextRun({
                  text: "“Outstanding work! You have written an exceptionally powerful and well-researched persuasive text on the protection of Indonesian orangutans. Your paragraph structure is clear and cohesive, leading the reader logically from the environmental crisis to a convincing solution. I was particularly impressed by your integration of authoritative evidence from the WWF and Dr Biruté Galdikas, as well as your mature handling of the economic counterargument regarding local farming livelihoods. In your oral presentation, your annotations for tone, pitch, and strategic pauses showed a deep understanding of how to engage and persuade an audience. To stretch yourself even further, consider discussing how consumer boycotts might influence supermarket labeling laws in Australia.”",
                  italics: true,
                  size: 20
                })
              ]
            }),
            new Paragraph({
              spacing: { before: 60, after: 0 },
              children: [
                new TextRun({ text: "Overall Standard Assessed: ", bold: true, size: 20 }),
                new TextRun({ text: "Grade A (Exemplary)", bold: true, color: COLOR_PRIMARY, size: 22 })
              ]
            })
          ],
          COLOR_LIGHT_BG,
          COLOR_ACCENT
        )
      ]
    }
  ]
});

// Write file
const outputPath = path.join(__dirname, "Exemplar_Assessment_Orangutan_Palm_Oil.docx");
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outputPath, buffer);
  console.log("Successfully generated DOCX at: " + outputPath);
}).catch(err => {
  console.error("Error building DOCX:", err);
  process.exit(1);
});
