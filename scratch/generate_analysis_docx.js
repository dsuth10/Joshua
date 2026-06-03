const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, 
        AlignmentType, ShadingType, BorderStyle, WidthType } = require('docx');
const fs = require('fs');
const path = require('path');

// Target paths
const outputDir = path.resolve(__dirname, "../Units/English/English_Unit_2/Lesson_Plans/Lesson_25.2");
const outputPath = path.join(outputDir, "Lesson_25.2_Reading_Analysis.docx");

// Common styles & colors (Magma/Earth theme - Tone Ban Verified ✅)
const terracotta = "C2410C";
const charcoal = "1E242B";
const muted = "57606A";
const bgCream = "FAF9F5";
const bgWhite = "FFFFFF";
const greenPass = "15803D";

// Border styling helper
const thinBorder = { style: BorderStyle.SINGLE, size: 1, color: "DCDBD7" };
const terracottaLeftBorder = { style: BorderStyle.SINGLE, size: 24, color: terracotta }; // 3pt left border

// Document generation
const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: "Arial", size: 23, color: charcoal } // 11.5pt default font size
      }
    }
  },
  sections: [{
    properties: {
      page: {
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }, // 1 inch margins (1440 DXA)
        size: { width: 11906, height: 16838 } // A4 standard (11906 x 16838 DXA)
      }
    },
    children: [
      // HEADER SECTION
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { after: 60 },
        children: [
          new TextRun({
            text: "LITERACY & READABILITY AUDIT",
            bold: true,
            size: 16,
            color: terracotta,
            letterSpacing: 100
          })
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: "Text Analysis Report: Causes of Earthquakes",
            bold: true,
            size: 40,
            color: charcoal
          })
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { after: 360 },
        children: [
          new TextRun({
            text: "Lesson 25.2 Reading Stimulus  ■  Target Level: Year 5 (L2)  ■  Australian Curriculum AC v9",
            size: 18,
            color: muted
          })
        ]
      }),
      
      // Divider line
      new Table({
        columnWidths: [9026],
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 9026, type: WidthType.DXA },
                borders: {
                  top: { style: BorderStyle.NONE },
                  left: { style: BorderStyle.NONE },
                  right: { style: BorderStyle.NONE },
                  bottom: { style: BorderStyle.DOUBLE, size: 8, color: "DCDBD7" }
                },
                children: []
              })
            ]
          })
        ]
      }),
      
      new Paragraph({ spacing: { before: 240 } }),

      // EXECUTIVE SUMMARY SECTION
      new Paragraph({
        children: [
          new TextRun({ text: "1. Executive Summary", bold: true, size: 22, color: charcoal })
        ]
      }),
      new Paragraph({ spacing: { before: 120 } }),
      
      // Callout box for summary
      new Table({
        columnWidths: [9026],
        margins: { top: 180, bottom: 180, left: 180, right: 180 },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 9026, type: WidthType.DXA },
                shading: { fill: bgCream, type: ShadingType.CLEAR },
                borders: {
                  left: terracottaLeftBorder,
                  top: thinBorder,
                  right: thinBorder,
                  bottom: thinBorder
                },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({ text: "Overall Alignment: ", bold: true }),
                      new TextRun({ text: "PASS", bold: true, color: greenPass }),
                      new TextRun(" — The reading text is exceptionally well-calibrated for Year 5 students (L2, ages 10-11). The Flesch-Kincaid Grade Level of "),
                      new TextRun({ text: "6.0", bold: true }),
                      new TextRun(" and Flesch Reading Ease of "),
                      new TextRun({ text: "73.6", bold: true }),
                      new TextRun(" sit precisely within the target ranges. Sentence structure is varied and accessible, keeping cognitive load low while supporting academic language growth.")
                    ]
                  })
                ]
              })
            ]
          })
        ]
      }),

      new Paragraph({ spacing: { before: 240 } }),

      // READABILITY METRICS TABLE
      new Paragraph({
        children: [
          new TextRun({ text: "2. Readability Metrics & Scores", bold: true, size: 22, color: charcoal })
        ]
      }),
      new Paragraph({ spacing: { before: 120 } }),

      new Table({
        columnWidths: [3000, 2000, 2500, 1526],
        margins: { top: 120, bottom: 120, left: 120, right: 120 },
        rows: [
          // Header
          new TableRow({
            tableHeader: true,
            children: [
              new TableCell({
                width: { size: 3000, type: WidthType.DXA },
                shading: { fill: charcoal, type: ShadingType.CLEAR },
                borders: { top: thinBorder, bottom: { style: BorderStyle.SINGLE, size: 12, color: terracotta }, left: thinBorder, right: thinBorder },
                children: [new Paragraph({ children: [new TextRun({ text: "Readability Metric", bold: true, color: bgWhite })] })]
              }),
              new TableCell({
                width: { size: 2000, type: WidthType.DXA },
                shading: { fill: charcoal, type: ShadingType.CLEAR },
                borders: { top: thinBorder, bottom: { style: BorderStyle.SINGLE, size: 12, color: terracotta }, left: thinBorder, right: thinBorder },
                children: [new Paragraph({ children: [new TextRun({ text: "Score", bold: true, color: bgWhite })] })]
              }),
              new TableCell({
                width: { size: 2500, type: WidthType.DXA },
                shading: { fill: charcoal, type: ShadingType.CLEAR },
                borders: { top: thinBorder, bottom: { style: BorderStyle.SINGLE, size: 12, color: terracotta }, left: thinBorder, right: thinBorder },
                children: [new Paragraph({ children: [new TextRun({ text: "L2 Target Range", bold: true, color: bgWhite })] })]
              }),
              new TableCell({
                width: { size: 1526, type: WidthType.DXA },
                shading: { fill: charcoal, type: ShadingType.CLEAR },
                borders: { top: thinBorder, bottom: { style: BorderStyle.SINGLE, size: 12, color: terracotta }, left: thinBorder, right: thinBorder },
                children: [new Paragraph({ children: [new TextRun({ text: "Status", bold: true, color: bgWhite })] })]
              })
            ]
          }),
          // Flesch Reading Ease
          new TableRow({
            children: [
              new TableCell({
                width: { size: 3000, type: WidthType.DXA },
                borders: { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder },
                children: [new Paragraph({ children: [new TextRun("Flesch Reading Ease")] })]
              }),
              new TableCell({
                width: { size: 2000, type: WidthType.DXA },
                borders: { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder },
                children: [new Paragraph({ children: [new TextRun({ text: "73.6", bold: true })] })]
              }),
              new TableCell({
                width: { size: 2500, type: WidthType.DXA },
                borders: { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder },
                children: [new Paragraph({ children: [new TextRun("68 – 82 (Optimal)")] })]
              }),
              new TableCell({
                width: { size: 1526, type: WidthType.DXA },
                borders: { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder },
                children: [new Paragraph({ children: [new TextRun({ text: "PASS", bold: true, color: greenPass })] })]
              })
            ]
          }),
          // Flesch-Kincaid Grade
          new TableRow({
            children: [
              new TableCell({
                width: { size: 3000, type: WidthType.DXA },
                shading: { fill: bgCream, type: ShadingType.CLEAR },
                borders: { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder },
                children: [new Paragraph({ children: [new TextRun("Flesch-Kincaid Grade")] })]
              }),
              new TableCell({
                width: { size: 2000, type: WidthType.DXA },
                shading: { fill: bgCream, type: ShadingType.CLEAR },
                borders: { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder },
                children: [new Paragraph({ children: [new TextRun({ text: "6.0", bold: true })] })]
              }),
              new TableCell({
                width: { size: 2500, type: WidthType.DXA },
                shading: { fill: bgCream, type: ShadingType.CLEAR },
                borders: { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder },
                children: [new Paragraph({ children: [new TextRun("4.5 – 6.5")] })]
              }),
              new TableCell({
                width: { size: 1526, type: WidthType.DXA },
                shading: { fill: bgCream, type: ShadingType.CLEAR },
                borders: { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder },
                children: [new Paragraph({ children: [new TextRun({ text: "PASS", bold: true, color: greenPass })] })]
              })
            ]
          }),
          // Gunning Fog
          new TableRow({
            children: [
              new TableCell({
                width: { size: 3000, type: WidthType.DXA },
                borders: { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder },
                children: [new Paragraph({ children: [new TextRun("Gunning Fog Score")] })]
              }),
              new TableCell({
                width: { size: 2000, type: WidthType.DXA },
                borders: { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder },
                children: [new Paragraph({ children: [new TextRun("7.7")] })]
              }),
              new TableCell({
                width: { size: 2500, type: WidthType.DXA },
                borders: { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder },
                children: [new Paragraph({ children: [new TextRun("—")] })]
              }),
              new TableCell({
                width: { size: 1526, type: WidthType.DXA },
                borders: { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder },
                children: [new Paragraph({ children: [new TextRun("Info")] })]
              })
            ]
          }),
          // ARI
          new TableRow({
            children: [
              new TableCell({
                width: { size: 3000, type: WidthType.DXA },
                shading: { fill: bgCream, type: ShadingType.CLEAR },
                borders: { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder },
                children: [new Paragraph({ children: [new TextRun("Automated Readability (ARI)")] })]
              }),
              new TableCell({
                width: { size: 2000, type: WidthType.DXA },
                shading: { fill: bgCream, type: ShadingType.CLEAR },
                borders: { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder },
                children: [new Paragraph({ children: [new TextRun("8.2")] })]
              }),
              new TableCell({
                width: { size: 2500, type: WidthType.DXA },
                shading: { fill: bgCream, type: ShadingType.CLEAR },
                borders: { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder },
                children: [new Paragraph({ children: [new TextRun("—")] })]
              }),
              new TableCell({
                width: { size: 1526, type: WidthType.DXA },
                shading: { fill: bgCream, type: ShadingType.CLEAR },
                borders: { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder },
                children: [new Paragraph({ children: [new TextRun("Info")] })]
              })
            ]
          }),
          // SMOG Index
          new TableRow({
            children: [
              new TableCell({
                width: { size: 3000, type: WidthType.DXA },
                borders: { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder },
                children: [new Paragraph({ children: [new TextRun("SMOG Index")] })]
              }),
              new TableCell({
                width: { size: 2000, type: WidthType.DXA },
                borders: { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder },
                children: [new Paragraph({ children: [new TextRun("8.8")] })]
              }),
              new TableCell({
                width: { size: 2500, type: WidthType.DXA },
                borders: { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder },
                children: [new Paragraph({ children: [new TextRun("—")] })]
              }),
              new TableCell({
                width: { size: 1526, type: WidthType.DXA },
                borders: { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder },
                children: [new Paragraph({ children: [new TextRun("Info")] })]
              })
            ]
          }),
          // Coleman-Liau
          new TableRow({
            children: [
              new TableCell({
                width: { size: 3000, type: WidthType.DXA },
                shading: { fill: bgCream, type: ShadingType.CLEAR },
                borders: { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder },
                children: [new Paragraph({ children: [new TextRun("Coleman-Liau Index")] })]
              }),
              new TableCell({
                width: { size: 2000, type: WidthType.DXA },
                shading: { fill: bgCream, type: ShadingType.CLEAR },
                borders: { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder },
                children: [new Paragraph({ children: [new TextRun("9.8")] })]
              }),
              new TableCell({
                width: { size: 2500, type: WidthType.DXA },
                shading: { fill: bgCream, type: ShadingType.CLEAR },
                borders: { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder },
                children: [new Paragraph({ children: [new TextRun("—")] })]
              }),
              new TableCell({
                width: { size: 1526, type: WidthType.DXA },
                shading: { fill: bgCream, type: ShadingType.CLEAR },
                borders: { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder },
                children: [new Paragraph({ children: [new TextRun("Info")] })]
              })
            ]
          })
        ]
      }),

      new Paragraph({ spacing: { before: 240 } }),

      // TEXT STATISTICS SECTION
      new Paragraph({
        children: [
          new TextRun({ text: "3. Text Statistics", bold: true, size: 22, color: charcoal })
        ]
      }),
      new Paragraph({ spacing: { before: 120 } }),
      
      new Paragraph({
        bullet: { level: 0 },
        children: [
          new TextRun({ text: "Word Count: ", bold: true }),
          new TextRun("375 words. This is the optimal length for an assessment reading text in Year 5, ensuring students have enough text to find facts without inducing fatigue.")
        ]
      }),
      new Paragraph({
        bullet: { level: 0 },
        children: [
          new TextRun({ text: "Sentence Count: ", bold: true }),
          new TextRun("31 sentences.")
        ]
      }),
      new Paragraph({
        bullet: { level: 0 },
        children: [
          new TextRun({ text: "Average Sentence Length: ", bold: true }),
          new TextRun("12.1 words. This falls comfortably below the maximum recommendation of 15 words per sentence for primary-aged students, ensuring clarity and minimizing cognitive load.")
        ]
      }),

      new Paragraph({ spacing: { before: 240 } }),

      // ALIGNMENT ANALYSIS
      new Paragraph({
        children: [
          new TextRun({ text: "4. Target Level Alignment & Pedagogy", bold: true, size: 22, color: charcoal })
        ]
      }),
      new Paragraph({ spacing: { before: 120 } }),
      
      new Paragraph({
        alignment: AlignmentType.BOTH,
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: "L2 Reading Standards: ",
            bold: true,
            color: terracotta
          }),
          new TextRun("The reading passage is designed for Level 2 (10-11 years, equivalent to Year 5/6). The Gunning Fog (7.7) and SMOG (8.8) scores show that the text introduces specialized vocabulary but remains syntactically simple. This structure allows students to focus their cognitive effort on comprehending scientific concepts rather than decoding convoluted sentences.")
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.BOTH,
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: "Linguistic Scaffolding: ",
            bold: true,
            color: terracotta
          }),
          new TextRun("Technical terminology (e.g., tectonic plates, fault, epicentre, focus, seismograph, seismic waves) is systematically scaffolded. Every scientific term is followed immediately by an inline parenthetical definition (e.g., 'crust (the hard, rocky outer layer of Earth)'). This scaffolding supports the Australian Curriculum v9 English guidelines for information reports and builds scientific literacy.")
        ]
      }),

      // FOOTER
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 480 },
        children: [
          new TextRun({
            text: "Science Focus Editorial • Readability Audit Registry",
            size: 14,
            color: muted
          })
        ]
      })
    ]
  }]
});

// Save to disk
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outputPath, buffer);
  console.log(`Successfully generated DOCX analysis: ${outputPath}`);
}).catch(err => {
  console.error("Error saving document:", err);
  process.exit(1);
});
