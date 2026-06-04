const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, ImageRun, 
        AlignmentType, ShadingType, BorderStyle, WidthType } = require('docx');
const fs = require('fs');
const path = require('path');

// Target paths
const outputDir = path.resolve(__dirname, "../Units/English/English_Unit_2/Lesson_Plans/Lesson_25.2/Lesson Plan 25.2 Magazine Reading Year 3");
const outputPath = path.join(outputDir, "Lesson_Plan_25.2_Magazine_Reading_Y3.docx");
const imagesDir = path.join(outputDir, "images");

// Read images safely
function getImageData(filename) {
  const filePath = path.join(imagesDir, filename);
  try {
    return fs.readFileSync(filePath);
  } catch (err) {
    console.error(`Error reading image ${filename}:`, err);
    return null;
  }
}

const plateImgData = getImageData("plate_boundaries.png");
const damageImgData = getImageData("earthquake_damage.png");
const seismographImgData = getImageData("seismograph_recording.png");
const crossSectionImgData = getImageData("earthquake_cross_section.jpeg");

// Common styles
const terracotta = "C2410C";
const charcoal = "1E242B";
const muted = "57606A";
const bgCream = "FAF9F5";
const bgWhite = "FFFFFF";

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
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: "EARTH SCIENCE SPECIAL FEATURE",
            bold: true,
            size: 18,
            color: terracotta,
            letterSpacing: 120
          })
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: "The Shaking Earth: Causes of Earthquakes",
            bold: true,
            size: 48,
            color: charcoal
          })
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 360 },
        children: [
          new TextRun({
            text: "Unit 2 Reading Resource  ■  Year 3 Simplified Edition  ■  Lesson 25.2",
            size: 18,
            color: muted
          })
        ]
      }),
      
      // Divider line (using a 1x1 table with only a bottom border)
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
      
      // Spacer paragraph
      new Paragraph({ spacing: { before: 240 } }),

      // ARTICLE BODY
      
      // Paragraph 1 (with Drop Cap "T" styled manually)
      new Paragraph({
        alignment: AlignmentType.BOTH,
        spacing: { after: 180 },
        children: [
          new TextRun({ text: "T", bold: true, size: 36, color: terracotta }),
          new TextRun({
            text: "he ground under our feet feels very solid. However, the outer layer of the Earth is actually broken into huge pieces. This outer layer is called the crust. The huge pieces are called tectonic plates. They are like giant puzzle pieces that make up the Earth's shell. Tectonic plates float very slowly on hot, melted rock deep inside the Earth. They move only a few centimetres every year."
          })
        ]
      }),

      // Paragraph 2
      new Paragraph({
        alignment: AlignmentType.BOTH,
        spacing: { after: 240 },
        children: [
          new TextRun({
            text: "As these plates float, they move in three main ways. First, some plates pull away from each other. Second, some plates bump into each other. This bumping can push the land up to make big mountains. Third, some plates slide sideways past each other. The places where the plates meet are called boundary zones."
          })
        ]
      }),

      // Image 1: Plate Boundaries
      plateImgData ? new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 120, after: 60 },
        children: [
          new ImageRun({
            type: "png",
            data: plateImgData,
            transformation: { width: 500, height: 280 },
            altText: { title: "Tectonic Plate Boundaries", description: "Diagram showing plate movements", name: "PlateBoundaries" }
          })
        ]
      }) : new Paragraph({}),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 240 },
        children: [
          new TextRun({ text: "Tectonic Dynamics: ", bold: true, size: 16, color: charcoal }),
          new TextRun({
            text: "Tectonic plates floating on a softer, molten rock layer beneath Earth's outer crust. Arrows indicate the different ways plates interact: pulling apart, pushing together, or sliding sideways.",
            size: 16,
            color: muted
          })
        ]
      }),

      // Paragraph 3
      new Paragraph({
        alignment: AlignmentType.BOTH,
        spacing: { after: 240 },
        children: [
          new TextRun({
            text: "Tectonic plates have rough and jagged edges. As the plates try to move, their rough edges can get stuck. They stick because of friction. Friction is a force that stops things from sliding easily. Even though the edges are stuck, the rest of the plates keep moving. This creates tension. Tension is growing pressure stored in the stuck rocks."
          })
        ]
      }),

      // Pull Quote (1x1 Table with top/bottom borders)
      new Table({
        columnWidths: [9026],
        margins: { top: 120, bottom: 120, left: 240, right: 240 },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 9026, type: WidthType.DXA },
                shading: { fill: bgCream, type: ShadingType.CLEAR },
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 12, color: terracotta },
                  bottom: { style: BorderStyle.SINGLE, size: 12, color: terracotta },
                  left: { style: BorderStyle.NONE },
                  right: { style: BorderStyle.NONE }
                },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: "\"Even though the edges are stuck, the rest of the plates keep moving... This creates tension.\"",
                        bold: true,
                        italics: true,
                        size: 24,
                        color: terracotta
                      })
                    ]
                  }),
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 60 },
                    children: [
                      new TextRun({
                        text: "— TECTONIC MECHANICS",
                        bold: true,
                        size: 14,
                        color: muted
                      })
                    ]
                  })
                ]
              })
            ]
          })
        ]
      }),
      new Paragraph({ spacing: { before: 240 } }),

      // Paragraph 4
      new Paragraph({
        alignment: AlignmentType.BOTH,
        spacing: { after: 240 },
        children: [
          new TextRun({
            text: "Over time, this pressure becomes too big. The rocks suddenly break or slip. This slip usually happens along a fault. A fault is a crack in the Earth's crust where rocks can move. When the rocks slip, they quickly release a lot of stored energy."
          })
        ]
      }),

      // Image 2: Earthquake Damage
      damageImgData ? new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 120, after: 60 },
        children: [
          new ImageRun({
            type: "png",
            data: damageImgData,
            transformation: { width: 500, height: 320 },
            altText: { title: "Earthquake Damage", description: "Photograph showing severe cracks in buildings and road", name: "EarthquakeDamage" }
          })
        ]
      }) : new Paragraph({}),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 240 },
        children: [
          new TextRun({ text: "Energy Released: ", bold: true, size: 16, color: charcoal }),
          new TextRun({
            text: "The aftermath of a historical earthquake, demonstrating how massive amounts of stored tension can fracture solid brickwork and split paved roads along active fault lines.",
            size: 16,
            color: muted
          })
        ]
      }),

      // Paragraph 5
      new Paragraph({
        alignment: AlignmentType.BOTH,
        spacing: { after: 240 },
        children: [
          new TextRun({
            text: "This energy travels out in all directions. It moves as seismic waves. Seismic waves are powerful ripples of energy that travel through the ground. These waves make the ground shake. We feel this shaking as an earthquake. The point deep underground where the rocks first broke is called the focus. The point on the surface directly above the focus is called the epicentre. The shaking is always strongest near the epicentre. Smaller shakes called aftershocks can happen for days or weeks after the main earthquake."
          })
        ]
      }),

      // Image 4: Earthquake Cross-Section (User Added)
      crossSectionImgData ? new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 120, after: 60 },
        children: [
          new ImageRun({
            type: "jpg",
            data: crossSectionImgData,
            transformation: { width: 500, height: 320 },
            altText: { title: "Earthquake Cross-Section", description: "Diagram showing focus, epicentre, fault, and seismic waves", name: "CrossSection" }
          })
        ]
      }) : new Paragraph({}),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 240 },
        children: [
          new TextRun({ text: "Figure 1 - Earthquake Cross-Section: ", bold: true, size: 16, color: charcoal }),
          new TextRun({
            text: "A cross-sectional view of an active earthquake zone, highlighting the focal point underground, the surface epicentre, and the propagating circular energy waves.",
            size: 16,
            color: muted
          })
        ]
      }),

      // Paragraph 6
      new Paragraph({
        alignment: AlignmentType.BOTH,
        spacing: { after: 240 },
        children: [
          new TextRun({
            text: "Scientists measure earthquakes with a seismograph. A seismograph is a special machine that measures ground movements. By studying earthquakes, scientists learn how to build safer houses to protect people."
          })
        ]
      }),

      // Image 3: Seismograph Recording
      seismographImgData ? new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 120, after: 60 },
        children: [
          new ImageRun({
            type: "png",
            data: seismographImgData,
            transformation: { width: 500, height: 280 },
            altText: { title: "Seismograph drum", description: "Pen drawing waves on recording paper", name: "Seismograph" }
          })
        ]
      }) : new Paragraph({}),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 360 },
        children: [
          new TextRun({ text: "Measuring Shaking: ", bold: true, size: 16, color: charcoal }),
          new TextRun({
            text: "A close-up of a seismograph machine translating raw seismic energy waves into measurable line ripples on paper.",
            size: 16,
            color: muted
          })
        ]
      }),

      // KEY TERMINOLOGY SECTION (Formatted as a 1x1 table callout sidebar)
      new Paragraph({
        spacing: { before: 120 },
        children: [
          new TextRun({ text: "KEY TERMINOLOGY", bold: true, size: 20, color: charcoal })
        ]
      }),
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
                    spacing: { after: 120 },
                    children: [
                      new TextRun({ text: "Epicentre: ", bold: true, color: terracotta }),
                      new TextRun("The spot on the ground directly above where the earthquake starts.")
                    ]
                  }),
                  new Paragraph({
                    spacing: { after: 120 },
                    children: [
                      new TextRun({ text: "Fault Line: ", bold: true, color: terracotta }),
                      new TextRun("A crack in the Earth's crust where rocks can slip and move.")
                    ]
                  }),
                  new Paragraph({
                    spacing: { after: 120 },
                    children: [
                      new TextRun({ text: "Focus: ", bold: true, color: terracotta }),
                      new TextRun("The deep spot underground where the rocks first break and move.")
                    ]
                  }),
                  new Paragraph({
                    spacing: { after: 120 },
                    children: [
                      new TextRun({ text: "Seismic Waves: ", bold: true, color: terracotta }),
                      new TextRun("Ripples of energy that travel through the ground and make it shake.")
                    ]
                  }),
                  new Paragraph({
                    spacing: { after: 120 },
                    children: [
                      new TextRun({ text: "Seismograph: ", bold: true, color: terracotta }),
                      new TextRun("A special machine that measures how much the ground shakes.")
                    ]
                  }),
                  new Paragraph({
                    spacing: { after: 120 },
                    children: [
                      new TextRun({ text: "Tectonic: ", bold: true, color: terracotta }),
                      new TextRun("Having to do with the Earth's crust and how its large pieces move.")
                    ]
                  }),
                  new Paragraph({
                    spacing: { after: 120 },
                    children: [
                      new TextRun({ text: "Tectonic Plate: ", bold: true, color: terracotta }),
                      new TextRun("A giant puzzle piece made of rock that forms the Earth's outer shell.")
                    ]
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({ text: "Tension: ", bold: true, color: terracotta }),
                      new TextRun("Pressure that builds up when rocks are stuck and trying to move.")
                    ]
                  })
                ]
              })
            ]
          })
        ]
      }),
      
      new Paragraph({ spacing: { before: 360 } }),

      // COMPARISON TABLE SECTION
      new Paragraph({
        children: [
          new TextRun({ text: "Plate Boundary Types (Field Comparison Table)", bold: true, size: 20, color: charcoal })
        ]
      }),
      new Paragraph({ spacing: { after: 120 } }),
      
      new Table({
        columnWidths: [2500, 3000, 3526],
        margins: { top: 120, bottom: 120, left: 120, right: 120 },
        rows: [
          // Table Header
          new TableRow({
            tableHeader: true,
            children: [
              new TableCell({
                width: { size: 2500, type: WidthType.DXA },
                shading: { fill: charcoal, type: ShadingType.CLEAR },
                borders: { top: thinBorder, bottom: { style: BorderStyle.SINGLE, size: 12, color: terracotta }, left: thinBorder, right: thinBorder },
                children: [new Paragraph({ children: [new TextRun({ text: "Boundary Type", bold: true, color: bgWhite })] })]
              }),
              new TableCell({
                width: { size: 3000, type: WidthType.DXA },
                shading: { fill: charcoal, type: ShadingType.CLEAR },
                borders: { top: thinBorder, bottom: { style: BorderStyle.SINGLE, size: 12, color: terracotta }, left: thinBorder, right: thinBorder },
                children: [new Paragraph({ children: [new TextRun({ text: "Direction of Movement", bold: true, color: bgWhite })] })]
              }),
              new TableCell({
                width: { size: 3526, type: WidthType.DXA },
                shading: { fill: charcoal, type: ShadingType.CLEAR },
                borders: { top: thinBorder, bottom: { style: BorderStyle.SINGLE, size: 12, color: terracotta }, left: thinBorder, right: thinBorder },
                children: [new Paragraph({ children: [new TextRun({ text: "Geological Features Produced", bold: true, color: bgWhite })] })]
              })
            ]
          }),
          // Row 1
          new TableRow({
            children: [
              new TableCell({
                width: { size: 2500, type: WidthType.DXA },
                borders: { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder },
                children: [new Paragraph({ children: [new TextRun({ text: "Convergent Boundary", bold: true, color: terracotta })] })]
              }),
              new TableCell({
                width: { size: 3000, type: WidthType.DXA },
                borders: { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder },
                children: [new Paragraph({ children: [new TextRun("Plates push together")] })]
              }),
              new TableCell({
                width: { size: 3526, type: WidthType.DXA },
                borders: { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder },
                children: [new Paragraph({ children: [new TextRun("Big mountains, deep ocean trenches, and strong earthquakes")] })]
              })
            ]
          }),
          // Row 2 (Alternating background)
          new TableRow({
            children: [
              new TableCell({
                width: { size: 2500, type: WidthType.DXA },
                shading: { fill: bgCream, type: ShadingType.CLEAR },
                borders: { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder },
                children: [new Paragraph({ children: [new TextRun({ text: "Divergent Boundary", bold: true, color: terracotta })] })]
              }),
              new TableCell({
                width: { size: 3000, type: WidthType.DXA },
                shading: { fill: bgCream, type: ShadingType.CLEAR },
                borders: { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder },
                children: [new Paragraph({ children: [new TextRun("Plates pull apart")] })]
              }),
              new TableCell({
                width: { size: 3526, type: WidthType.DXA },
                shading: { fill: bgCream, type: ShadingType.CLEAR },
                borders: { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder },
                children: [new Paragraph({ children: [new TextRun("Deep valleys, active volcanoes, and small earthquakes")] })]
              })
            ]
          }),
          // Row 3
          new TableRow({
            children: [
              new TableCell({
                width: { size: 2500, type: WidthType.DXA },
                borders: { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder },
                children: [new Paragraph({ children: [new TextRun({ text: "Transform Boundary", bold: true, color: terracotta })] })]
              }),
              new TableCell({
                width: { size: 3000, type: WidthType.DXA },
                borders: { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder },
                children: [new Paragraph({ children: [new TextRun("Plates slide past each other")] })]
              }),
              new TableCell({
                width: { size: 3526, type: WidthType.DXA },
                borders: { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder },
                children: [new Paragraph({ children: [new TextRun("Cracks in the ground (faults) and damaging earthquakes")] })]
              })
            ]
          })
        ]
      }),

      // FOOTER SECTION
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 720 },
        children: [
          new TextRun({
            text: "© 2026 Science Focus Magazine • Year 3 Science Worksheet Reading • Natural Disasters Unit",
            size: 14,
            color: muted
          })
        ]
      })
    ]
  }]
});

// Pack and write to file
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outputPath, buffer);
  console.log(`Successfully generated DOCX: ${outputPath}`);
}).catch(err => {
  console.error("Error generating DOCX:", err);
  process.exit(1);
});
