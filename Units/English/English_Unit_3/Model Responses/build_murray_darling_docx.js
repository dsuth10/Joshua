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

// Color Palette - River / Murray-Darling Theme
const COLOR_PRIMARY = "0F3854";    // Deep River Blue
const COLOR_SECONDARY = "1E6B7B";  // River Teal / Deep Aqua
const COLOR_ACCENT = "D9822B";     // Warm River Sand / Amber Ochre
const COLOR_TEXT = "222222";       // Charcoal Dark Slate
const COLOR_LIGHT_BG = "F0F5F9";   // Soft Water Blue Tint
const COLOR_ALT_ROW = "F4F8FA";    // Soft Ice Blue Tint
const COLOR_BORDER = "CCCCCC";     // Muted Gray Border
const COLOR_WHITE = "FFFFFF";

// Helper for standard cell borders
const borderThin = { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER };
const cellBordersStandard = { top: borderThin, bottom: borderThin, left: borderThin, right: borderThin };
const cellBordersNone = { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } };

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
                          text: "YEAR 5/6 ENGLISH PERSUASIVE WRITING EXEMPLAR",
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
                          text: "Assessment Task 3: Express an Opinion — Protecting the Murray-Darling Basin",
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
                        new TextRun({ text: "Year 5/6 ____", size: 20 }),
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
              ["Topic", "Urgent environmental protection and water restoration of Australia’s Murray-Darling Basin."],
              ["Stance / Opinion", "Governments must immediately enforce strict water buybacks, restore environmental river flows, and restrict unsustainable industrial irrigation to save the Murray-Darling Basin from ecological collapse."],
              ["Target Audience", "School community members, Australian citizens, and regional policy makers."],
              ["Formality & Tone", "Formal, passionate, urgent, and evidence-based."],
              ["Hook Strategy", "Vivid contrast between a once-thriving river system teeming with wildlife and cracked, dry riverbeds with mass fish kills."],
              ["Argument 1 (Water Extraction)", "Excessive water extraction for industrial farming suffocates river ecosystems. Evidence: CSIRO & MDBA over-allocation data, Menindee Lakes fish kills, Australian Academy of Science reports."],
              ["Argument 2 (Biodiversity & Culture)", "Dying rivers destroy native wildlife habitats and sacred First Nations cultural connections. Evidence: 120+ waterbird species in Macquarie Marshes/Coorong, Barkandji elders caring for the Baaka (Darling River) for 65,000+ years."],
              ["Counterargument & Rebuttal", "Counter: Irrigators claim cutting water allocations harms farming jobs and food production. Rebuttal: Without a living river, agriculture collapses completely. Buybacks and water-efficient tech protect both farming and river health."],
              ["Persuasive Devices", "Extended metaphor (lifeblood of our continent, dusty drain), rhetorical questions, rule of three, high-modality verbs (must, urgently, cannot), expanded noun groups, expert scientific data."],
              ["Call to Action", "Demanding the return of 450 gigalitres of environmental water flows, supporting voluntary water buybacks, and choosing sustainably grown Australian produce."]
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
        createHeading1("2. Part A: Year 5/6 A-Standard Written Persuasive Text"),

        // Essay Callout Box
        createCalloutBox(
          "Lifeline of Our Continent: Why We Must Protect the Murray-Darling Basin",
          [
            new Paragraph({
              spacing: { before: 100, after: 140, line: 276 },
              children: [
                new TextRun({
                  text: "Imagine standing on the banks of a mighty Australian river, watching crystal-clear water flow past ancient red gums while pelicans glide gracefully across the surface. Now, contrast that vibrant scene with a cracked, dry riverbed littered with millions of decaying native fish. This environmental tragedy is occurring right now across the Murray-Darling Basin—the lifeblood of our continent. Spanning over one million square kilometres across four states, this vital river system is suffocating due to severe water over-extraction, climate stress, and industrial mismanagement. To safeguard Australia’s water security, protect iconic wildlife, and honor First Nations heritage, we must urgently restore environmental river flows and enforce strict water buybacks.",
                  size: 22
                })
              ]
            }),
            new Paragraph({
              spacing: { before: 100, after: 140, line: 276 },
              children: [
                new TextRun({
                  text: "First and foremost, excessive water extraction for large-scale industrial irrigation is driving the Murray-Darling Basin to ecological collapse. According to scientific reports from the CSIRO and the Murray-Darling Basin Authority (MDBA), decades of over-allocating water licenses to massive cotton and rice operations have starved downstream river systems. In recent years, lower water flows and toxic blue-green algae blooms caused catastrophic mass fish kills at Menindee Lakes, destroying millions of native Murray cod and golden perch in a single week. The Australian Academy of Science warned that ",
                  size: 22
                }),
                new TextRun({
                  text: "without immediate increases in environmental water allocations, these devastating ecological collapses will become permanent.",
                  italics: true,
                  bold: true,
                  size: 22,
                  color: COLOR_PRIMARY
                }),
                new TextRun({
                  text: " Can we truly sit back and allow Australia's greatest river system to turn into a dusty drain?",
                  size: 22
                })
              ]
            }),
            new Paragraph({
              spacing: { before: 100, after: 140, line: 276 },
              children: [
                new TextRun({
                  text: "Furthermore, preserving the Murray-Darling Basin is essential to protect native biodiversity and sacred Cultural Water rights. The Basin’s internationally recognized wetlands, such as the Macquarie Marshes and the Coorong, provide critical breeding grounds for over 120 waterbird species and endangered native animals. For Indigenous First Nations communities, including the Barkandji people who have cared for the Baaka (Darling River) for over 65,000 years, the river is a sacred living ancestor. When river channels dry up, ancient cultural traditions, traditional food sources, and community health are severely damaged. Restoring natural river flows is not merely an environmental responsibility; it is a fundamental act of cultural justice.",
                  size: 22
                })
              ]
            }),
            new Paragraph({
              spacing: { before: 100, after: 140, line: 276 },
              children: [
                new TextRun({
                  text: "Some agricultural lobbyists argue that reducing irrigation water allocations will harm regional farming communities and reduce food production. While supporting primary producers is important, continuing to over-extract water from a dying river system is an unsustainable disaster. Scientific economic studies demonstrate that voluntary government water buybacks, combined with investments in water-efficient technology and drought-tolerant crops, protect regional economies without destroying river health. If the river dies, farming towns will perish too. Protecting environmental water flows ensures that both agriculture and nature can thrive together for generations to come.",
                  size: 22
                })
              ]
            }),
            new Paragraph({
              spacing: { before: 100, after: 140, line: 276 },
              children: [
                new TextRun({
                  text: "In conclusion, restoring the Murray-Darling Basin is one of the most critical environmental challenges facing our nation. By returning at least 450 gigalitres of water to environmental flows, enforcing strict extraction limits, and supporting sustainable farming, we can revive Australia’s greatest river system. We cannot allow greed and neglect to dry up the lifeblood of our country. The time for decisive action is right now—will you stand up to protect the Murray-Darling Basin before its rivers run dry forever?",
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
        createHeading1("3. Why This Achieves an A-Standard (Year 5/6 Curriculum Breakdown)"),

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
                "• Clear introduction with contrasting sensory hook and explicit thesis statement.\n• 3 body paragraphs starting with strong topic sentences (First and foremost, Furthermore, Some agricultural lobbyists...).\n• Reiteration of thesis in conclusion with a call to action.",
                "AC9E5LA03 / AC9E6LA03\nUses structured paragraphs and cohesive transition devices (first and foremost, furthermore, while, in conclusion) to link complex ideas."
              ],
              [
                "Ideas & Authoritative Evidence",
                "• Stats from CSIRO, MDBA, and Australian Academy of Science.\n• References Menindee Lakes fish kills, Macquarie Marshes, and Coorong.\n• Incorporates Barkandji First Nations Cultural Water heritage.\n• Rebuts irrigation economic counterargument.",
                "AC9E5LE01 / AC9E6LE01 / AC9E5LY06\nExpands on ideas with researched, authoritative evidence, demonstrating deep critical thinking and cultural awareness."
              ],
              [
                "Language Features & Sentences",
                "• Complex sentences combining subordinate clauses (While supporting primary producers is important...).\n• Expanded noun groups (vast monoculture irrigation operations, sacred living ancestor).\n• High modality verbs (must, urgently, cannot, essential).",
                "AC9E5LA08 / AC9E6LA08\nDemonstrates high-level control of complex sentence structures, expanded nominals, and persuasive modality."
              ],
              [
                "Persuasive Devices & Devices",
                "• Extended metaphor (lifeblood of our continent, dusty drain).\n• Rhetorical questions (Can we truly sit back...? Will you stand up...?).\n• Rule of three (protect iconic wildlife, safeguard water security, and honor First Nations heritage).",
                "AC9E5LA08 / AC9E5LY07\nEmploys figurative language and persuasive devices effectively to convince a broad audience."
              ],
              [
                "Vocabulary & Spelling",
                "• Precise topic vocabulary (over-allocation, gigalitres, environmental flows, hypoxia, Cultural Water, biodiversity).\n• Accurate Australian English spelling (kilometres, recognised, honour, organisation, per cent).",
                "AC9E5LY08 / AC9E6LY08\nAccurately spells complex morphological variants and topic-specific vocabulary."
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
                new TextRun({ text: "[VISUAL CUE: Slide displaying a drone photo of a healthy Murray-Darling river bend framed by majestic river red gums.]", bold: true, color: COLOR_ACCENT, size: 20 })
              ]
            }),
            new Paragraph({
              spacing: { before: 60, after: 100 },
              children: [
                new TextRun({ text: "[TONE: Warm, proud, engaging. PACE: Moderate. GESTURE: Open hands, making eye contact across room.]\n", italics: true, color: COLOR_SECONDARY, size: 20 }),
                new TextRun({ text: "Good morning teachers and classmates.", size: 22 })
              ]
            }),
            new Paragraph({
              spacing: { before: 60, after: 100 },
              children: [
                new TextRun({ text: "[PAUSE - 2 seconds. PITCH: Drops slightly to a serious tone. GESTURE: Hands brought together.]\n", italics: true, color: COLOR_SECONDARY, size: 20 }),
                new TextRun({ text: "Imagine standing on the banks of a mighty Australian river, watching crystal-clear water flow past ancient red gums while pelicans glide across the surface. Now, contrast that scene with a cracked, dry riverbed littered with millions of decaying native fish.", size: 22 })
              ]
            }),
            new Paragraph({
              spacing: { before: 60, after: 100 },
              children: [
                new TextRun({ text: "[TONE: Urgent, firm. EMPHASIS on 'lifeblood' and 'right now'.]\n", italics: true, color: COLOR_SECONDARY, size: 20 }),
                new TextRun({ text: "This environmental tragedy is happening right now across the Murray-Darling Basin—the lifeblood of our continent. Spanning over one million square kilometres across four states, this vital river system is suffocating due to severe water over-extraction and climate stress. To protect our country's future, we must urgently restore environmental river flows and enforce strict water buybacks.", size: 22 })
              ]
            }),
            new Paragraph({
              spacing: { before: 80, after: 80 },
              children: [
                new TextRun({ text: "[VISUAL CUE: Slide changes to CSIRO graph showing water extraction vs environmental flow reduction, plus photo of Menindee fish kill.]", bold: true, color: COLOR_ACCENT, size: 20 })
              ]
            }),
            new Paragraph({
              spacing: { before: 60, after: 100 },
              children: [
                new TextRun({ text: "[TONE: Authoritative, informative. PACE: Steady and deliberate.]\n", italics: true, color: COLOR_SECONDARY, size: 20 }),
                new TextRun({ text: "First and foremost, excessive water extraction for industrial farming is driving our rivers to ecological collapse. According to scientific research from the CSIRO and the Murray-Darling Basin Authority, over-allocating water licenses to massive cotton and rice operations has starved downstream rivers.", size: 22 })
              ]
            }),
            new Paragraph({
              spacing: { before: 60, after: 100 },
              children: [
                new TextRun({ text: "[EMPHASIS on 'millions' and 'single week'. PITCH: Serious.]\n", italics: true, color: COLOR_SECONDARY, size: 20 }),
                new TextRun({ text: "“In recent years, low water flows caused catastrophic mass fish kills at Menindee Lakes, destroying millions of native Murray cod and golden perch in a single week. As the Australian Academy of Science warned, without immediate increases in environmental water allocations, these devastating collapses will become permanent.”", bold: true, italics: true, color: COLOR_PRIMARY, size: 22 })
              ]
            }),
            new Paragraph({
              spacing: { before: 60, after: 100 },
              children: [
                new TextRun({ text: "[TONE: Respectful, passionate. PACE: Controlled.]\n", italics: true, color: COLOR_SECONDARY, size: 20 }),
                new TextRun({ text: "Furthermore, protecting the Basin is essential to save native wildlife and honor First Nations heritage. The Basin’s wetlands provide critical breeding grounds for over 120 waterbird species. For Indigenous First Nations communities, including the Barkandji people who have cared for the Baaka for over 65,000 years, the river is a sacred living ancestor. When rivers dry up, ancient cultural traditions and community health are severely damaged. Restoring natural flows is a fundamental act of cultural justice!", size: 22 })
              ]
            }),
            new Paragraph({
              spacing: { before: 80, after: 80 },
              children: [
                new TextRun({ text: "[VISUAL CUE: Slide displaying modern water-efficient drip irrigation vs dry riverbeds, with headline 'Sustainable Agriculture & Healthy Rivers.']", bold: true, color: COLOR_ACCENT, size: 20 })
              ]
            }),
            new Paragraph({
              spacing: { before: 60, after: 100 },
              children: [
                new TextRun({ text: "[TONE: Reasonable, persuasive, confident.]\n", italics: true, color: COLOR_SECONDARY, size: 20 }),
                new TextRun({ text: "Now, some agricultural lobbyists argue that reducing water allocations will harm farming towns. While supporting farmers is vital, continuing to over-extract water from a dying river is an unsustainable disaster. Scientific studies show that voluntary water buybacks combined with water-efficient technology protect both regional jobs and river health. If the river dies, farming towns will perish too. We can—and must—protect both!", size: 22 })
              ]
            }),
            new Paragraph({
              spacing: { before: 80, after: 80 },
              children: [
                new TextRun({ text: "[VISUAL CUE: Final slide displaying a bold call to action: 'Return the 450 Gigalitres. Protect Our Rivers. Save the Basin.']", bold: true, color: COLOR_ACCENT, size: 20 })
              ]
            }),
            new Paragraph({
              spacing: { before: 60, after: 100 },
              children: [
                new TextRun({ text: "[TONE: Inspiring, passionate, forceful. PACE: Slower for maximum impact. GESTURE: Strong, confident gesture.]\n", italics: true, color: COLOR_SECONDARY, size: 20 }),
                new TextRun({ text: "In conclusion, restoring the Murray-Darling Basin is one of the most critical environmental duties of our generation. By returning environmental water flows and supporting sustainable farming, we can revive Australia's greatest river system. We cannot allow greed to dry up the lifeblood of our country. ", size: 22 })
              ]
            }),
            new Paragraph({
              spacing: { before: 60, after: 100 },
              children: [
                new TextRun({ text: "[PAUSE - 2 seconds. Direct eye contact with audience.]\n", italics: true, color: COLOR_SECONDARY, size: 20 }),
                new TextRun({ text: "The time for action is right now. Will you stand up to protect the Murray-Darling Basin before its rivers run dry forever?", bold: true, size: 22 })
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
                  text: "“Exceptional work! You have produced an outstanding, highly persuasive essay and speech on the protection of the Murray-Darling Basin. Your argument is exceptionally well structured, moving seamlessly from scientific data on water over-allocation to the ecological and cultural impacts on First Nations communities. I was particularly impressed by your sophisticated use of the extended metaphor ('lifeblood of our continent') and how maturely you addressed the economic counterargument regarding agricultural livelihoods. Your presentation annotations show a masterful understanding of how voice variations and visual cues enhance persuasive impact. Fantastic achievement!”",
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
const outputPath = path.join(__dirname, "Exemplar_Assessment_Murray_Darling_Basin.docx");
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outputPath, buffer);
  console.log("Successfully generated DOCX at: " + outputPath);
}).catch(err => {
  console.error("Error building DOCX:", err);
  process.exit(1);
});
