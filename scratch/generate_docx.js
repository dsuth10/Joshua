const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, ImageRun, 
        AlignmentType, PageOrientation, LevelFormat, ShadingType, VerticalAlign, BorderStyle, WidthType } = require('docx');
const fs = require('fs');
const path = require('path');

// Target paths
const outputDir = path.resolve(__dirname, "../Units/English/English_Unit_2/Lesson_Plans/Lesson_25.2/Lesson Plan 25.2 Magazine Reading");
const outputPath = path.join(outputDir, "Lesson_Plan_25.2_Magazine_Reading.docx");
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

// Common styles
const terracotta = "C2410C";
const charcoal = "1E242B";
const muted = "57606A";
const bgCream = "FAF9F5";
const bgWhite = "FFFFFF";

// Border styling helper
const thinBorder = { style: BorderStyle.SINGLE, size: 1, color: "DCDBD7" };
const terracottaLeftBorder = { style: BorderStyle.SINGLE, size: 24, color: terracotta }; // 3pt left border
const dashedTerracottaBorder = { style: BorderStyle.DASHED, size: 6, color: terracotta };

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
            text: "Unit 2 Reading Resource  ■  Lesson 25.2  ■  Australian Curriculum Aligned",
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
      
      // Paragraph 1 (with Drop Cap "E" styled manually)
      new Paragraph({
        alignment: AlignmentType.BOTH,
        spacing: { after: 180 },
        children: [
          new TextRun({ text: "E", bold: true, size: 36, color: terracotta }),
          new TextRun({
            text: "arth feels solid under our feet. However, our planet's crust (the hard, rocky outer layer of Earth) is actually broken into huge pieces. These pieces are called tectonic plates (giant puzzle pieces that make up Earth's outer shell). Tectonic plates float very slowly on a softer layer of hot, melted rock deep inside the Earth. They move only a few centimetres each year."
          })
        ]
      }),

      // Paragraph 2
      new Paragraph({
        alignment: AlignmentType.BOTH,
        spacing: { after: 240 },
        children: [
          new TextRun({
            text: "As these plates float, they interact in three main ways. First, some plates pull apart from each other. Second, other plates bump into each other. This bumping can push the land up to form giant mountains. Third, some plates slide sideways past one another. The areas where these plates meet are called boundary zones."
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
            text: "The edges of tectonic plates are rough and jagged. As the plates try to move, their rough edges can get stuck together. They stick because of friction, which is a force that resists movement. Even though the edges are stuck, the rest of the plates do not stop moving. They continue to push and pull. This build-up of force creates tension (growing pressure that is stored in the rocks along the boundary)."
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
                        text: "\"Even though the edges are stuck, the rest of the plates do not stop moving... This build-up of force creates tension.\"",
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
            text: "Over time, this pressure becomes too great. The rocks suddenly break or slip. This sudden movement usually happens along a fault (a crack in the Earth's crust where rocks can move). When the rocks suddenly slip, they release a massive amount of stored energy."
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
            text: "This energy travels outward from the break in all directions. It moves as seismic waves (powerful ripples of energy that travel through the ground). These waves make the ground shake. This shaking is what we feel as an earthquake. The point deep underground where the rocks first broke is called the focus. Directly above this point, on the surface of the Earth, is the epicentre (the point on the surface directly above where the earthquake started). The shaking is always strongest near the epicentre. Smaller shakes called aftershocks (smaller earthquakes that happen after the main shaking) can occur for days or weeks."
          })
        ]
      }),

      // Figure 1 Placeholder (Dashed 1x1 table)
      new Table({
        columnWidths: [9026],
        margins: { top: 240, bottom: 240, left: 240, right: 240 },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 9026, type: WidthType.DXA },
                shading: { fill: "F5F4EF", type: ShadingType.CLEAR },
                borders: {
                  top: dashedTerracottaBorder,
                  bottom: dashedTerracottaBorder,
                  left: dashedTerracottaBorder,
                  right: dashedTerracottaBorder
                },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({ text: "Figure 1: Labeled Cross-Section of an Earthquake", bold: true, size: 22, color: terracotta })
                    ]
                  }),
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 120 },
                    children: [
                      new TextRun({
                        text: "[ User Image Insertion Area: Labeled diagram showing focus, epicentre, fault line, and seismic waves ]",
                        size: 16,
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
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 60, after: 240 },
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
            text: "Scientists measure earthquakes using a seismograph (a special machine that measures the strength of ground movements). By studying earthquakes, we learn how tectonic plates move and how to build safer buildings to protect people."
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
                      new TextRun("The point on the surface directly above the underground start of the earthquake.")
                    ]
                  }),
                  new Paragraph({
                    spacing: { after: 120 },
                    children: [
                      new TextRun({ text: "Fault Line: ", bold: true, color: terracotta }),
                      new TextRun("The crack in the Earth's crust along which rocks can move.")
                    ]
                  }),
                  new Paragraph({
                    spacing: { after: 120 },
                    children: [
                      new TextRun({ text: "Focus: ", bold: true, color: terracotta }),
                      new TextRun("The deep underground point where rocks first fracture and slip.")
                    ]
                  }),
                  new Paragraph({
                    spacing: { after: 120 },
                    children: [
                      new TextRun({ text: "Seismic Waves: ", bold: true, color: terracotta }),
                      new TextRun("Circular energy ripples spreading through the ground.")
                    ]
                  }),
                  new Paragraph({
                    spacing: { after: 120 },
                    children: [
                      new TextRun({ text: "Seismograph: ", bold: true, color: terracotta }),
                      new TextRun("A special machine that measures the strength of ground movements.")
                    ]
                  }),
                  new Paragraph({
                    spacing: { after: 120 },
                    children: [
                      new TextRun({ text: "Tectonic: ", bold: true, color: terracotta }),
                      new TextRun("Relating to the structure of the Earth's crust and the large-scale movements of the plates that form it.")
                    ]
                  }),
                  new Paragraph({
                    spacing: { after: 120 },
                    children: [
                      new TextRun({ text: "Tectonic Plate: ", bold: true, color: terracotta }),
                      new TextRun("A giant puzzle piece of the Earth's hard, rocky outer crust.")
                    ]
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({ text: "Tension: ", bold: true, color: terracotta }),
                      new TextRun("Growing pressure that is stored in rocks when tectonic plates get stuck.")
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
                children: [new Paragraph({ children: [new TextRun("Plates push into each other")] })]
              }),
              new TableCell({
                width: { size: 3526, type: WidthType.DXA },
                borders: { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder },
                children: [new Paragraph({ children: [new TextRun("Fold mountains, deep ocean trenches, and strong earthquakes")] })]
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
                children: [new Paragraph({ children: [new TextRun("Plates pull apart from each other")] })]
              }),
              new TableCell({
                width: { size: 3526, type: WidthType.DXA },
                shading: { fill: bgCream, type: ShadingType.CLEAR },
                borders: { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder },
                children: [new Paragraph({ children: [new TextRun("Rift valleys, volcanic activity, and mild earthquakes")] })]
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
                children: [new Paragraph({ children: [new TextRun("Plates slide sideways past each other")] })]
              }),
              new TableCell({
                width: { size: 3526, type: WidthType.DXA },
                borders: { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder },
                children: [new Paragraph({ children: [new TextRun("Active fault lines and shallow, destructive earthquakes")] })]
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
            text: "© 2026 Science Focus Magazine • Year 5 Science Worksheet Reading • Natural Disasters Unit",
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
