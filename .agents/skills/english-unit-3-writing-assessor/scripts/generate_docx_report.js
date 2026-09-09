#!/usr/bin/env node
/**
 * Professional DOCX Report Generator for Year 5 English Unit 3 Persuasive Writing Assessment
 * 
 * Complies with workspace standards:
 * - A4 Portrait (11906 x 16838 DXA), 15 mm margins (850 DXA), 10206 DXA usable width
 * - Professional typography (Arial)
 * - Dual-width tables (columnWidths + cell widths)
 * - Native Word lists and page numbering
 * - Premium executive styling (Dark navy header banner, colored status badges, callout cards)
 * - Australian English spelling
 */

const fs = require("fs");
const path = require("path");
const {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  Header,
  HeightRule,
  PageNumber,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
} = require("docx");

// --- Visual Tokens & Color Palette ---
const C = {
  navy: "1B365D",        // Primary brand / header banner
  navyDark: "10223B",    // Deep navy
  slate: "4A5568",       // Secondary text
  ink: "2D3748",         // Primary body text
  line: "CBD5E0",        // Light border
  lineDark: "718096",    // Medium border
  paper: "F7FAFC",       // Card background
  white: "FFFFFF",       // Clean white
  
  // Standard Badge Colors
  stdA_bg: "E8F8F5", stdA_fg: "0E6251", stdA_border: "A3E4D7", // Emerald
  stdB_bg: "EBF5FB", stdB_fg: "1B4F72", stdB_border: "AED6F1", // Marine
  stdC_bg: "FEF9E7", stdC_fg: "7D6608", stdC_border: "F9E79F", // Amber
  stdD_bg: "FBEEE6", stdD_fg: "873600", stdD_border: "F5CBA7", // Rust
  stdE_bg: "FDEDEC", stdE_fg: "78281F", stdE_border: "F5B7B1", // Crimson
  
  // Section Callout Accents
  star_bg: "E8F8F5", star_fg: "0E6251", star_border: "48C9B0",
  wish_bg: "EBF5FB", wish_fg: "1B4F72", wish_border: "5DADE2",
  challenge_bg: "FEF9E7", challenge_fg: "7D6608", challenge_border: "F4D03F",
  grid_header_bg: "2C3E50"
};

const FONT_FAMILY = "Arial";
const PAGE_WIDTH = 11906;
const PAGE_HEIGHT = 16838;
const MARGIN = 850; // 15mm
const USABLE_WIDTH = PAGE_WIDTH - (MARGIN * 2); // 10206 DXA

// Standard color resolver
function getStandardColors(std) {
  const s = String(std || "").toUpperCase().trim();
  if (s.startsWith("A")) return { bg: C.stdA_bg, fg: C.stdA_fg, border: C.stdA_border };
  if (s.startsWith("B")) return { bg: C.stdB_bg, fg: C.stdB_fg, border: C.stdB_border };
  if (s.startsWith("C")) return { bg: C.stdC_bg, fg: C.stdC_fg, border: C.stdC_border };
  if (s.startsWith("D")) return { bg: C.stdD_bg, fg: C.stdD_fg, border: C.stdD_border };
  return { bg: C.stdE_bg, fg: C.stdE_fg, border: C.stdE_border };
}

// Border helpers
const noBorder = { style: BorderStyle.NONE, size: 0, color: "auto" };
const thinBorder = (color = C.line) => ({ style: BorderStyle.SINGLE, size: 4, color });
const thickBorder = (color = C.navy) => ({ style: BorderStyle.SINGLE, size: 12, color });

/**
 * Creates an executive header banner
 */
function createHeaderBanner(metadata) {
  const title = metadata.title || "Year 5 Persuasive Writing Assessment Report";
  const subtitle = metadata.subtitle || "Australian Curriculum v9 - Unit 3: Express an Opinion (Assessment Task 3)";

  return new Table({
    width: { size: USABLE_WIDTH, type: WidthType.DXA },
    columnWidths: [USABLE_WIDTH],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: USABLE_WIDTH, type: WidthType.DXA },
            shading: { fill: C.navy, type: ShadingType.CLEAR },
            margins: { top: 260, bottom: 260, left: 320, right: 320 },
            borders: {
              top: noBorder, bottom: thickBorder(C.gold || "C59B27"), left: noBorder, right: noBorder
            },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 80 },
                children: [
                  new TextRun({
                    text: title.toUpperCase(),
                    font: FONT_FAMILY,
                    bold: true,
                    size: 26, // 13pt
                    color: C.white,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 0 },
                children: [
                  new TextRun({
                    text: subtitle,
                    font: FONT_FAMILY,
                    size: 19, // 9.5pt
                    color: "D0DBE5",
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

/**
 * Creates a clean student metadata grid
 */
function createMetadataGrid(meta) {
  const col1 = 5103;
  const col2 = 5103;

  const makeRow = (label1, val1, label2, val2) => new TableRow({
    children: [
      new TableCell({
        width: { size: col1, type: WidthType.DXA },
        margins: { top: 100, bottom: 100, left: 160, right: 160 },
        shading: { fill: C.paper, type: ShadingType.CLEAR },
        borders: { top: thinBorder(C.line), bottom: thinBorder(C.line), left: thinBorder(C.line), right: thinBorder(C.line) },
        children: [
          new Paragraph({
            children: [
              new TextRun({ text: label1 + ": ", bold: true, size: 19, font: FONT_FAMILY, color: C.navy }),
              new TextRun({ text: val1 || "—", size: 19, font: FONT_FAMILY, color: C.ink }),
            ],
          }),
        ],
      }),
      new TableCell({
        width: { size: col2, type: WidthType.DXA },
        margins: { top: 100, bottom: 100, left: 160, right: 160 },
        shading: { fill: C.paper, type: ShadingType.CLEAR },
        borders: { top: thinBorder(C.line), bottom: thinBorder(C.line), left: thinBorder(C.line), right: thinBorder(C.line) },
        children: [
          new Paragraph({
            children: [
              new TextRun({ text: label2 + ": ", bold: true, size: 19, font: FONT_FAMILY, color: C.navy }),
              new TextRun({ text: val2 || "—", size: 19, font: FONT_FAMILY, color: C.ink }),
            ],
          }),
        ],
      }),
    ],
  });

  return new Table({
    width: { size: USABLE_WIDTH, type: WidthType.DXA },
    columnWidths: [col1, col2],
    rows: [
      makeRow("Student Name", meta.studentName, "Assessment Date", meta.date),
      makeRow("Topic / Proposal", meta.topic, "Audience", meta.audience || "School Community / Teacher"),
      makeRow("Word Count", meta.wordCount ? `${meta.wordCount} words (Suggested: 200–400)` : "200–400 words", "Assessor", meta.assessor || "Classroom Teacher"),
    ],
  });
}

/**
 * Creates an executive standards scorecard
 */
function createScorecard(grades) {
  const overallColors = getStandardColors(grades.overall);
  const w1Colors = getStandardColors(grades.w1);
  const w2Colors = getStandardColors(grades.w2);
  const w3Colors = getStandardColors(grades.w3);

  const colW = 2551; // 10206 / 4 = 2551.5

  const makeCard = (title, std, colors, desc) => new TableCell({
    width: { size: colW, type: WidthType.DXA },
    margins: { top: 140, bottom: 140, left: 140, right: 140 },
    shading: { fill: colors.bg, type: ShadingType.CLEAR },
    borders: {
      top: thickBorder(colors.border),
      bottom: thinBorder(colors.border),
      left: thinBorder(colors.border),
      right: thinBorder(colors.border),
    },
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
        children: [
          new TextRun({ text: title.toUpperCase(), font: FONT_FAMILY, bold: true, size: 16, color: C.slate }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
        children: [
          new TextRun({ text: `STANDARD ${std || "—"}`, font: FONT_FAMILY, bold: true, size: 26, color: colors.fg }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 0 },
        children: [
          new TextRun({ text: desc || "", font: FONT_FAMILY, italic: true, size: 16, color: colors.fg }),
        ],
      }),
    ],
  });

  return new Table({
    width: { size: USABLE_WIDTH, type: WidthType.DXA },
    columnWidths: [colW, colW, colW, colW],
    rows: [
      new TableRow({
        children: [
          makeCard("Overall Writing", grades.overall, overallColors, "Holistic Synthesis"),
          makeCard("W1: Text & Audience", grades.w1, w1Colors, "Purpose & Stance"),
          makeCard("W2: Paragraphs", grades.w2, w2Colors, "Organisation & Cohesion"),
          makeCard("W3: Language Features", grades.w3, w3Colors, "Sentences & Devices"),
        ],
      }),
    ],
  });
}

/**
 * Creates a section heading with stylish left accent bar
 */
function createSectionHeader(title, badgeText = null, badgeColors = null) {
  const runs = [
    new TextRun({
      text: title,
      font: FONT_FAMILY,
      bold: true,
      size: 22, // 11pt
      color: C.navy,
    }),
  ];

  if (badgeText && badgeColors) {
    runs.push(new TextRun({ text: "   " }));
    runs.push(
      new TextRun({
        text: ` [STANDARD ${badgeText}] `,
        font: FONT_FAMILY,
        bold: true,
        size: 19,
        color: badgeColors.fg,
      })
    );
  }

  return new Table({
    width: { size: USABLE_WIDTH, type: WidthType.DXA },
    columnWidths: [USABLE_WIDTH],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: USABLE_WIDTH, type: WidthType.DXA },
            margins: { top: 120, bottom: 120, left: 180, right: 180 },
            shading: { fill: C.paper, type: ShadingType.CLEAR },
            borders: {
              top: noBorder,
              bottom: thinBorder(C.line),
              left: { style: BorderStyle.SINGLE, size: 24, color: C.navy }, // 3pt left bar
              right: noBorder,
            },
            children: [
              new Paragraph({
                spacing: { after: 0 },
                children: runs,
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

/**
 * Creates an A-E component diagnostic table
 */
function createDiagnosticTable(components) {
  const colW1 = 2200; // Component name
  const colW2 = 1400; // Status
  const colW3 = 3600; // Evidence quote
  const colW4 = 3006; // Assessor commentary

  const headerRow = new TableRow({
    children: [
      { text: "Rubric Component", w: colW1 },
      { text: "Achievement Status", w: colW2 },
      { text: "Quoted Student Evidence", w: colW3 },
      { text: "Assessor Analysis & Commentary", w: colW4 },
    ].map(h => new TableCell({
      width: { size: h.w, type: WidthType.DXA },
      shading: { fill: C.grid_header_bg, type: ShadingType.CLEAR },
      margins: { top: 120, bottom: 120, left: 140, right: 140 },
      borders: { top: thinBorder(C.navyDark), bottom: thinBorder(C.navyDark), left: thinBorder(C.navyDark), right: thinBorder(C.navyDark) },
      children: [
        new Paragraph({
          children: [
            new TextRun({ text: h.text, bold: true, size: 17, font: FONT_FAMILY, color: C.white }),
          ],
        }),
      ],
    })),
  });

  const dataRows = (components || []).map((comp, idx) => {
    const isEven = idx % 2 === 0;
    const bg = isEven ? C.white : C.paper;
    const statusText = comp.status || "Demonstrated";
    let statusFg = C.ink;
    let statusBg = bg;
    
    if (statusText.toLowerCase().includes("demonstrated") && !statusText.toLowerCase().includes("partly") && !statusText.toLowerCase().includes("not")) {
      statusFg = C.stdA_fg; statusBg = C.stdA_bg;
    } else if (statusText.toLowerCase().includes("partly")) {
      statusFg = C.stdC_fg; statusBg = C.stdC_bg;
    } else if (statusText.toLowerCase().includes("not yet")) {
      statusFg = C.stdD_fg; statusBg = C.stdD_bg;
    }

    return new TableRow({
      children: [
        new TableCell({
          width: { size: colW1, type: WidthType.DXA },
          shading: { fill: bg, type: ShadingType.CLEAR },
          margins: { top: 100, bottom: 100, left: 120, right: 120 },
          borders: { top: thinBorder(C.line), bottom: thinBorder(C.line), left: thinBorder(C.line), right: thinBorder(C.line) },
          children: [new Paragraph({ children: [new TextRun({ text: comp.name || "", bold: true, size: 17, font: FONT_FAMILY, color: C.ink })] })],
        }),
        new TableCell({
          width: { size: colW2, type: WidthType.DXA },
          shading: { fill: statusBg, type: ShadingType.CLEAR },
          margins: { top: 100, bottom: 100, left: 120, right: 120 },
          borders: { top: thinBorder(C.line), bottom: thinBorder(C.line), left: thinBorder(C.line), right: thinBorder(C.line) },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: statusText, bold: true, size: 16, font: FONT_FAMILY, color: statusFg })] })],
        }),
        new TableCell({
          width: { size: colW3, type: WidthType.DXA },
          shading: { fill: bg, type: ShadingType.CLEAR },
          margins: { top: 100, bottom: 100, left: 120, right: 120 },
          borders: { top: thinBorder(C.line), bottom: thinBorder(C.line), left: thinBorder(C.line), right: thinBorder(C.line) },
          children: [new Paragraph({ children: [new TextRun({ text: comp.quote || "—", italic: true, size: 17, font: FONT_FAMILY, color: C.slate })] })],
        }),
        new TableCell({
          width: { size: colW4, type: WidthType.DXA },
          shading: { fill: bg, type: ShadingType.CLEAR },
          margins: { top: 100, bottom: 100, left: 120, right: 120 },
          borders: { top: thinBorder(C.line), bottom: thinBorder(C.line), left: thinBorder(C.line), right: thinBorder(C.line) },
          children: [new Paragraph({ children: [new TextRun({ text: comp.comment || "", size: 17, font: FONT_FAMILY, color: C.ink })] })],
        }),
      ],
    });
  });

  return new Table({
    width: { size: USABLE_WIDTH, type: WidthType.DXA },
    columnWidths: [colW1, colW2, colW3, colW4],
    rows: [headerRow, ...dataRows],
  });
}

/**
 * Creates an attractive Callout Card (for Stars, Wishes, or Coach's Challenge)
 */
function createCalloutCard(title, items, type = "star") {
  let colors = { bg: C.star_bg, fg: C.star_fg, border: C.star_border, icon: "⭐" };
  if (type === "wish") colors = { bg: C.wish_bg, fg: C.wish_fg, border: C.wish_border, icon: "💫" };
  if (type === "challenge") colors = { bg: C.challenge_bg, fg: C.challenge_fg, border: C.challenge_border, icon: "💡" };

  const children = [
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({ text: `${colors.icon} ${title.toUpperCase()}`, bold: true, size: 20, font: FONT_FAMILY, color: colors.fg }),
      ],
    }),
  ];

  (items || []).forEach(item => {
    if (typeof item === "string") {
      children.push(
        new Paragraph({
          spacing: { after: 60 },
          bullet: { level: 0 },
          children: [new TextRun({ text: item, size: 18, font: FONT_FAMILY, color: C.ink })],
        })
      );
    } else {
      // Structured item: title, quote, question, task
      if (item.heading) {
        children.push(
          new Paragraph({
            spacing: { before: 80, after: 40 },
            children: [new TextRun({ text: item.heading, bold: true, size: 18, font: FONT_FAMILY, color: colors.fg })],
          })
        );
      }
      if (item.quote) {
        children.push(
          new Paragraph({
            spacing: { after: 40 },
            children: [
              new TextRun({ text: "• Excerpt: ", bold: true, size: 17, font: FONT_FAMILY, color: C.slate }),
              new TextRun({ text: `"${item.quote}"`, italic: true, size: 17, font: FONT_FAMILY, color: C.ink }),
            ],
          })
        );
      }
      if (item.question) {
        children.push(
          new Paragraph({
            spacing: { after: 40 },
            children: [
              new TextRun({ text: "• Coaching Question: ", bold: true, size: 17, font: FONT_FAMILY, color: colors.fg }),
              new TextRun({ text: item.question, size: 17, font: FONT_FAMILY, color: C.ink }),
            ],
          })
        );
      }
      if (item.task) {
        children.push(
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({ text: "  [ ] ", bold: true, size: 17, font: FONT_FAMILY, color: colors.fg }),
              new TextRun({ text: item.task, size: 17, font: FONT_FAMILY, color: C.ink }),
            ],
          })
        );
      }
      if (item.text && !item.question) {
        children.push(
          new Paragraph({
            spacing: { after: 60 },
            children: [new TextRun({ text: item.text, size: 18, font: FONT_FAMILY, color: C.ink })],
          })
        );
      }
    }
  });

  return new Table({
    width: { size: USABLE_WIDTH, type: WidthType.DXA },
    columnWidths: [USABLE_WIDTH],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: USABLE_WIDTH, type: WidthType.DXA },
            margins: { top: 140, bottom: 140, left: 200, right: 200 },
            shading: { fill: colors.bg, type: ShadingType.CLEAR },
            borders: {
              top: thinBorder(colors.border),
              bottom: thinBorder(colors.border),
              left: { style: BorderStyle.SINGLE, size: 24, color: colors.border },
              right: thinBorder(colors.border),
            },
            children,
          }),
        ],
      }),
    ],
  });
}

/**
 * Assembles the full Word Document
 */
function buildReportDocument(data) {
  const content = [];

  // Spacing helper
  const addSpace = (size = 120) => {
    content.push(new Paragraph({ spacing: { after: size } }));
  };

  // 1. Header Banner
  content.push(createHeaderBanner(data.metadata || {}));
  addSpace(120);

  // 2. Metadata Grid
  content.push(createMetadataGrid(data.metadata || {}));
  addSpace(160);

  // 3. Standards Scorecard
  content.push(createScorecard(data.grades || {}));
  addSpace(200);

  // 4. Overall Holistic Assessment Summary
  if (data.overallSynthesis) {
    content.push(createSectionHeader("Assessor Synthesis & Marking Basis"));
    addSpace(80);
    content.push(
      new Paragraph({
        spacing: { after: 120 },
        children: [
          new TextRun({ text: data.overallSynthesis, size: 19, font: FONT_FAMILY, color: C.ink }),
        ],
      })
    );
    addSpace(120);
  }

  // 5. Element W1 Breakdown
  if (data.w1) {
    const stdColors = getStandardColors(data.grades?.w1);
    content.push(createSectionHeader("Element W1: Text, Audience and Development", data.grades?.w1, stdColors));
    addSpace(80);
    if (data.w1.descriptor) {
      content.push(
        new Paragraph({
          spacing: { after: 100 },
          children: [
            new TextRun({ text: "Awarded Descriptor: ", bold: true, size: 18, font: FONT_FAMILY, color: C.navy }),
            new TextRun({ text: `"${data.w1.descriptor}"`, italic: true, size: 18, font: FONT_FAMILY, color: C.slate }),
          ],
        })
      );
    }
    if (data.w1.components && data.w1.components.length > 0) {
      content.push(createDiagnosticTable(data.w1.components));
      addSpace(140);
    }
  }

  // 6. Element W2 Breakdown
  if (data.w2) {
    const stdColors = getStandardColors(data.grades?.w2);
    content.push(createSectionHeader("Element W2: Paragraphs and Cohesion", data.grades?.w2, stdColors));
    addSpace(80);
    if (data.w2.descriptor) {
      content.push(
        new Paragraph({
          spacing: { after: 100 },
          children: [
            new TextRun({ text: "Awarded Descriptor: ", bold: true, size: 18, font: FONT_FAMILY, color: C.navy }),
            new TextRun({ text: `"${data.w2.descriptor}"`, italic: true, size: 18, font: FONT_FAMILY, color: C.slate }),
          ],
        })
      );
    }
    if (data.w2.components && data.w2.components.length > 0) {
      content.push(createDiagnosticTable(data.w2.components));
      addSpace(140);
    }
  }

  // 7. Element W3 Breakdown
  if (data.w3) {
    const stdColors = getStandardColors(data.grades?.w3);
    content.push(createSectionHeader("Element W3: Language Features and Devices", data.grades?.w3, stdColors));
    addSpace(80);
    if (data.w3.descriptor) {
      content.push(
        new Paragraph({
          spacing: { after: 100 },
          children: [
            new TextRun({ text: "Awarded Descriptor: ", bold: true, size: 18, font: FONT_FAMILY, color: C.navy }),
            new TextRun({ text: `"${data.w3.descriptor}"`, italic: true, size: 18, font: FONT_FAMILY, color: C.slate }),
          ],
        })
      );
    }
    if (data.w3.components && data.w3.components.length > 0) {
      content.push(createDiagnosticTable(data.w3.components));
      addSpace(140);
    }
  }

  // 8. Student-Facing Socratic Coaching & Actionable Feedback Section
  if (data.stars || data.wishes || data.challenge) {
    content.push(new Paragraph({ pageBreakBefore: true })); // Clean page break for student conference slip
    content.push(createSectionHeader("Student Feedback & Socratic Coaching Slip"));
    addSpace(100);

    if (data.stars && data.stars.length > 0) {
      content.push(createCalloutCard("Stars! (What You Did Brilliantly)", data.stars, "star"));
      addSpace(140);
    }

    if (data.wishes && data.wishes.length > 0) {
      content.push(createCalloutCard("Wishes! (Inquiry-Based Goals for Revision)", data.wishes, "wish"));
      addSpace(140);
    }

    if (data.challenge) {
      content.push(
        createCalloutCard(
          "Coach's Challenge Question",
          [{ text: data.challenge }],
          "challenge"
        )
      );
      addSpace(140);
    }
  }

  // 9. Supplementary Diagnostic Observations (Spelling, Punctuation, Word Count)
  if (data.supplementary) {
    content.push(createSectionHeader("Supplementary Diagnostic Observations"));
    addSpace(80);
    (data.supplementary || []).forEach(item => {
      content.push(
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({ text: `• ${item.title}: `, bold: true, size: 18, font: FONT_FAMILY, color: C.navy }),
            new TextRun({ text: item.content || "", size: 18, font: FONT_FAMILY, color: C.ink }),
          ],
        })
      );
    });
  }

  // Construct Document with headers and footers
  return new Document({
    sections: [
      {
        properties: {
          page: {
            size: { width: PAGE_WIDTH, height: PAGE_HEIGHT },
            margin: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { after: 100 },
                children: [
                  new TextRun({
                    text: "Year 5 English Unit 3 — Persuasive Writing Assessment Report",
                    font: FONT_FAMILY,
                    size: 16,
                    color: C.slate,
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.SPACE_BETWEEN,
                children: [
                  new TextRun({
                    text: `Student: ${data.metadata?.studentName || "Student"} | Date: ${data.metadata?.date || "September 2026"}`,
                    font: FONT_FAMILY,
                    size: 16,
                    color: C.slate,
                  }),
                  new TextRun({
                    text: "\tPage ",
                    font: FONT_FAMILY,
                    size: 16,
                    color: C.slate,
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    font: FONT_FAMILY,
                    size: 16,
                    color: C.slate,
                  }),
                  new TextRun({
                    text: " of ",
                    font: FONT_FAMILY,
                    size: 16,
                    color: C.slate,
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    font: FONT_FAMILY,
                    size: 16,
                    color: C.slate,
                  }),
                ],
              }),
            ],
          }),
        },
        children: content,
      },
    ],
  });
}

/**
 * Parses Markdown Assessment text into structured data object
 */
function parseMarkdownReport(mdText) {
  const data = {
    metadata: {
      title: "Year 5 Persuasive Writing Assessment Report",
      subtitle: "Australian Curriculum v9 — Unit 3: Express an Opinion (Assessment Task 3)",
      studentName: "Year 5 Student",
      topic: "Palm Oil & Rainforest Conservation",
      date: "September 2026",
      wordCount: "385",
      assessor: "Classroom Teacher",
      audience: "Identified Audience (School Community)",
    },
    grades: {
      overall: "B",
      w1: "B",
      w2: "B",
      w3: "B",
    },
    overallSynthesis: "",
    w1: { descriptor: "", components: [] },
    w2: { descriptor: "", components: [] },
    w3: { descriptor: "", components: [] },
    stars: [],
    wishes: [],
    challenge: "",
    supplementary: [],
  };

  const lines = mdText.split(/\r?\n/);
  let currentSection = "";
  let currentElement = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Extract metadata
    if (line.match(/\*\*Student Name:\*\*\s*(.+)/i)) {
      data.metadata.studentName = RegExp.$1.replace(/\[|\]/g, "").trim();
    } else if (line.match(/\*\*Topic.*:\*\*\s*(.+)/i)) {
      data.metadata.topic = RegExp.$1.replace(/\[|\]/g, "").trim();
    } else if (line.match(/\*\*Audience:\*\*\s*(.+)/i)) {
      data.metadata.audience = RegExp.$1.replace(/\[|\]/g, "").trim();
    } else if (line.match(/\*\*Word Count:\*\*\s*(.+)/i)) {
      data.metadata.wordCount = RegExp.$1.replace(/\[|\]/g, "").trim();
    } else if (line.match(/\*\*Overall provisional writing grade:\s*([A-E])/i)) {
      data.grades.overall = RegExp.$1.toUpperCase();
    } else if (line.match(/Overall Provisional Writing Standard.*\|\s*\*\*([A-E])/i)) {
      data.grades.overall = RegExp.$1.toUpperCase();
    } else if (line.match(/W1.*\|\s*\*\*([A-E])/i) || line.match(/W1 Text.*\|\s*([A-E])/i)) {
      data.grades.w1 = RegExp.$1.toUpperCase();
    } else if (line.match(/W2.*\|\s*\*\*([A-E])/i) || line.match(/W2 Paragraphs.*\|\s*([A-E])/i)) {
      data.grades.w2 = RegExp.$1.toUpperCase();
    } else if (line.match(/W3.*\|\s*\*\*([A-E])/i) || line.match(/W3 Language.*\|\s*([A-E])/i)) {
      data.grades.w3 = RegExp.$1.toUpperCase();
    }

    // Section triggers
    if (line.startsWith("## W1 ") || line.includes("Element W1")) {
      currentSection = "W1";
      currentElement = data.w1;
    } else if (line.startsWith("## W2 ") || line.includes("Element W2")) {
      currentSection = "W2";
      currentElement = data.w2;
    } else if (line.startsWith("## W3 ") || line.includes("Element W3")) {
      currentSection = "W3";
      currentElement = data.w3;
    } else if (line.includes("Stars!")) {
      currentSection = "STARS";
    } else if (line.includes("Wishes!")) {
      currentSection = "WISHES";
    } else if (line.includes("Coach's Challenge")) {
      currentSection = "CHALLENGE";
    }

    // Capture component headings (e.g. ### Persuasive purpose and position — Demonstrated)
    if (currentElement && line.startsWith("### ")) {
      const heading = line.replace(/^###\s*/, "");
      let name = heading;
      let status = "Demonstrated";
      if (heading.includes("—") || heading.includes("-")) {
        const parts = heading.split(/—|-/);
        name = parts[0].trim();
        status = parts.slice(1).join("-").trim();
      }
      
      // Look ahead for quote or comments
      let quote = "";
      let comment = "";
      for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
        const nextLine = lines[j].trim();
        if (nextLine.startsWith("### ") || nextLine.startsWith("## ")) break;
        if (nextLine.includes("“") || nextLine.includes('"')) {
          const match = nextLine.match(/“([^”]+)”|"([^"]+)"/);
          if (match && !quote) quote = match[1] || match[2];
        }
        if (nextLine.length > 20 && !comment && !nextLine.startsWith(">") && !nextLine.startsWith("**Next step")) {
          comment = nextLine;
        }
      }

      currentElement.components.push({
        name,
        status,
        quote: quote ? `“${quote}”` : "—",
        comment: comment.slice(0, 180) + (comment.length > 180 ? "..." : ""),
      });
    }

    // Extract Stars
    if (currentSection === "STARS" && line.startsWith("*") && line.length > 15) {
      data.stars.push(line.replace(/^\*+\s*/, "").replace(/\*\*/g, ""));
    }

    // Extract Wishes
    if (currentSection === "WISHES" && (line.startsWith("### Goal") || line.startsWith("### "))) {
      const heading = line.replace(/^###\s*/, "");
      let question = "";
      let quote = "";
      let task = "";

      for (let j = i + 1; j < Math.min(i + 8, lines.length); j++) {
        const nextLine = lines[j].trim();
        if (nextLine.startsWith("### ") || nextLine.startsWith("## ")) break;
        if (nextLine.toLowerCase().includes("coaching question:") || nextLine.includes("?")) {
          question = nextLine.replace(/.*Coaching Question:\*?\*?/i, "").trim();
        }
        if (nextLine.includes("“") || nextLine.includes('"')) {
          const m = nextLine.match(/“([^”]+)”|"([^"]+)"/);
          if (m && !quote) quote = m[1] || m[2];
        }
        if (nextLine.includes("[ ]") || nextLine.toLowerCase().includes("self-check")) {
          task = nextLine.replace(/.*\[\s*\]/i, "").trim();
        }
      }

      data.wishes.push({ heading, question, quote, task });
    }

    // Extract Challenge Question
    if (currentSection === "CHALLENGE" && line.includes("?") && !data.challenge) {
      data.challenge = line.replace(/^>+\s*/, "").replace(/\*+/g, "").trim();
    }
  }

  // Populate default descriptors based on grades
  const rubricDescriptors = {
    A: {
      w1: "Creates a detailed, sequenced and cohesive written persuasive text for an identified audience on a topic, developing and expanding on ideas, providing supporting details and drawing information from authoritative sources.",
      w2: "Uses a range of well-structured, sequenced paragraphs and cohesive devices to effectively organise, develop and link ideas.",
      w3: "Uses a wide range of language features creatively, including more complex sentences with expanded noun groups, relevant verb tense for effect, literary devices and topic-specific vocabulary, that engage and persuade."
    },
    B: {
      w1: "Creates a sequenced written persuasive text for an identified audience on a topic, developing and expanding on ideas and providing supporting details that draw information from sources.",
      w2: "Uses sequenced paragraphs and cohesive devices to organise ideas with topic sentences to guide the reader through the text.",
      w3: "Uses language features including complex sentences that have expanded noun groups, tenses, topic-specific vocabulary, and literary devices."
    },
    C: {
      w1: "Creates a written persuasive text for an identified audience, developing and expanding on ideas with supporting details on a topic.",
      w2: "Uses paragraphs to organise, develop and link ideas.",
      w3: "Uses language features including complex sentences, tenses, topic-specific vocabulary and literary devices."
    },
    D: {
      w1: "Creates a written persuasive text for an audience that develops ideas about a topic.",
      w2: "Uses paragraphs and language features such as simple and compound sentences and topic-specific vocabulary.",
      w3: "Uses paragraphs and language features such as simple and compound sentences and topic-specific vocabulary."
    },
    E: {
      w1: "Creates a written persuasive text that provides ideas about a topic.",
      w2: "Uses paragraphs, simple and compound sentences or language features such as topic-specific vocabulary.",
      w3: "Uses paragraphs, simple and compound sentences or language features such as topic-specific vocabulary."
    }
  };

  data.w1.descriptor = rubricDescriptors[data.grades.w1]?.w1 || rubricDescriptors.B.w1;
  data.w2.descriptor = rubricDescriptors[data.grades.w2]?.w2 || rubricDescriptors.B.w2;
  data.w3.descriptor = rubricDescriptors[data.grades.w3]?.w3 || rubricDescriptors.B.w3;

  if (!data.overallSynthesis) {
    data.overallSynthesis = `Awarded an overall provisional Standard ${data.grades.overall}. The student demonstrates consistent achievement across core criteria, developing a recognisable argument with evidence and cohesive paragraph structure. Holistic judgement synthesises performance across W1, W2, and W3; oral presentation (Part B) is evaluated independently.`;
  }

  // Ensure default stars/wishes if none parsed
  if (data.stars.length === 0) {
    data.stars = [
      "Persuasive Stance: Clear and sustained opinion maintained across the entire text from introduction to conclusion.",
      "Evidence Attribution: Purposeful inclusion of named organisations (WWF, Greenpeace) to add weight to environmental claims.",
      "Descriptive Vocabulary: Effective use of topic-specific vocabulary such as 'deforestation', 'topsoil', and 'biodiversity'."
    ];
  }

  if (data.wishes.length === 0) {
    data.wishes = [
      {
        heading: "Goal 1: Signpost Paragraphs with Clear Topic Sentences (W2)",
        quote: "Also, tractors pack down the earth...",
        question: "How could you open this paragraph with a clear topic sentence that states soil erosion is the main focus before explaining the tractors?",
        task: "I have written a clear topic sentence at the start of my third body paragraph."
      },
      {
        heading: "Goal 2: Combine Short Sentences into Complex Sentences (W3)",
        quote: "Palm oil is cheap. It ruins forests.",
        question: "How could you join these two simple sentences using a subordinating conjunction like 'Although' or 'Even though'?",
        task: "I have turned two short sentences into a complex sentence using a comma correctly."
      }
    ];
  }

  if (!data.challenge) {
    data.challenge = "Look at your strongest body paragraph. What is one high-modality word (such as 'must', 'essential', or 'undeniably') you could add right now to make your argument feel even more urgent to the reader?";
  }

  data.supplementary = [
    { title: "Spelling Monitoring Strategy", content: "Demonstrating solid phonological and morphemic spelling patterns on key curriculum vocabulary. Minor consolidation recommended on verb vs noun distinctions ('breathe' vs 'breath')." },
    { title: "Punctuation & Syntax Conventions", content: "Capital letters and full stops generally secure. Review comma placement following introductory dependent clauses." },
    { title: "Text Length & Focus", content: `Text measures approximately ${data.metadata.wordCount} words (within the suggested 200–400 word guideline). Focus is maintained without unnecessary repetition.` }
  ];

  return data;
}

/**
 * Main export and execution handler
 */
async function generateDocxReport(inputPath, outputPath, options = {}) {
  let reportData;

  if (options.demo || !inputPath) {
    // Demo mode: synthesize data based on the approved assessment
    reportData = parseMarkdownReport("");
    reportData.metadata.studentName = "Sample Year 5 Student";
    reportData.metadata.topic = "Palm Oil & Rainforest Protection";
  } else if (inputPath.endsWith(".json")) {
    const raw = fs.readFileSync(inputPath, "utf-8");
    reportData = JSON.parse(raw);
  } else {
    const raw = fs.readFileSync(inputPath, "utf-8");
    reportData = parseMarkdownReport(raw);
  }

  const doc = buildReportDocument(reportData);
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);
  console.log(`[OK] Beautiful Word report generated successfully at: ${outputPath}`);
  return outputPath;
}

// CLI Execution Support
if (require.main === module) {
  const args = process.argv.slice(2);
  let inputPath = null;
  let outputPath = "Persuasive_Writing_Assessment_Report.docx";
  let demo = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--input" || args[i] === "-i") {
      inputPath = args[++i];
    } else if (args[i] === "--output" || args[i] === "-o") {
      outputPath = args[++i];
    } else if (args[i] === "--demo") {
      demo = true;
    }
  }

  generateDocxReport(inputPath, outputPath, { demo })
    .then(() => process.exit(0))
    .catch(err => {
      console.error("[ERROR] Failed to generate DOCX report:", err);
      process.exit(1);
    });
}

module.exports = { generateDocxReport, buildReportDocument, parseMarkdownReport };
