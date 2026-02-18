const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType, VerticalAlign, LevelFormat } = require('docx');
const fs = require('fs');

// Common styling
const tableBorder = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const cellBorders = { top: tableBorder, bottom: tableBorder, left: tableBorder, right: tableBorder };

// Document 1: What Causes Floods & Types of Floods
const doc1 = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 24 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, color: "000000", font: "Arial" },
        paragraph: { spacing: { before: 240, after: 240 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, color: "000000", font: "Arial" },
        paragraph: { spacing: { before: 180, after: 180 }, outlineLevel: 1 } }
    ]
  },
  numbering: {
    config: [
      { reference: "bullet-list",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbered-list-1",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }
    ]
  },
  sections: [{
    properties: {
      page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
    },
    children: [
      new Paragraph({
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        spacing: { after: 240 },
        children: [new TextRun({ text: "UNDERSTANDING FLOODS", bold: true, size: 48 })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        children: [new TextRun({ text: "When Water Takes Over", italics: true, size: 28 })]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("What is a Flood?")]
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun("A flood happens when water overflows onto land that is normally dry. Floods are one of the most common natural disasters in Australia and around the world. They can happen quickly or build up slowly over days or weeks.")]
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun("When heavy rain falls, rivers and creeks can fill up faster than the water can flow away. The extra water spills over the banks and spreads across the surrounding land. In cities, drains and stormwater systems can become overwhelmed, causing water to pool in streets and low-lying areas.")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("What Causes Floods?")]
      }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun("Floods can be caused by several different factors, often working together:")]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "Heavy Rainfall", bold: true }), new TextRun(" - When it rains heavily for a long time, the ground becomes saturated and can't absorb any more water. The excess water runs into rivers and creeks.")]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "Rapid Snowmelt", bold: true }), new TextRun(" - In mountainous areas, when snow melts quickly in spring, large amounts of water flow into rivers all at once.")]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "Storm Surges", bold: true }), new TextRun(" - During severe storms or cyclones, strong winds can push ocean water onto the coast, flooding coastal areas.")]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "Dam or Levee Failure", bold: true }), new TextRun(" - When structures built to hold back water break or overflow, massive amounts of water are suddenly released.")]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        spacing: { after: 200 },
        children: [new TextRun({ text: "Human Activities", bold: true }), new TextRun(" - Building on floodplains, removing vegetation, and creating hard surfaces like roads and car parks can make flooding worse by preventing water from soaking into the ground.")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Types of Floods")]
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun("Different types of floods have different causes and characteristics. Understanding these differences helps communities prepare and respond effectively.")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Flash Floods")]
      }),
      new Table({
        columnWidths: [4680, 4680],
        margins: { top: 100, bottom: 100, left: 180, right: 180 },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 4680, type: WidthType.DXA },
                children: [
                  new Paragraph({
                    children: [new TextRun({ text: "What They Are", bold: true, size: 24 })]
                  }),
                  new Paragraph({
                    spacing: { before: 120 },
                    children: [new TextRun("Flash floods are the most dangerous type of flood. They happen very quickly—usually within minutes or a few hours of heavy rainfall. The water rises rapidly and flows with tremendous force.")]
                  }),
                  new Paragraph({
                    spacing: { before: 120 },
                    children: [new TextRun({ text: "Speed:", bold: true }), new TextRun(" Develop in less than 6 hours")]
                  }),
                  new Paragraph({
                    children: [new TextRun({ text: "Warning time:", bold: true }), new TextRun(" Very little or none")]
                  })
                ]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 4680, type: WidthType.DXA },
                children: [
                  new Paragraph({
                    children: [new TextRun({ text: "Common Causes", bold: true, size: 24 })]
                  }),
                  new Paragraph({
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Intense thunderstorms dumping large amounts of rain quickly")]
                  }),
                  new Paragraph({
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Tropical cyclones bringing extreme rainfall")]
                  }),
                  new Paragraph({
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Dam or levee failure")]
                  }),
                  new Paragraph({
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Urban areas where concrete prevents water absorption")]
                  })
                ]
              })
            ]
          })
        ]
      }),
      new Paragraph({ spacing: { after: 200 }, children: [new TextRun("")] }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("River Floods (Riverine Flooding)")]
      }),
      new Table({
        columnWidths: [4680, 4680],
        margins: { top: 100, bottom: 100, left: 180, right: 180 },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 4680, type: WidthType.DXA },
                children: [
                  new Paragraph({
                    children: [new TextRun({ text: "What They Are", bold: true, size: 24 })]
                  }),
                  new Paragraph({
                    spacing: { before: 120 },
                    children: [new TextRun("River floods occur when rivers overflow their banks. These floods usually develop more slowly than flash floods, giving people more time to prepare and evacuate.")]
                  }),
                  new Paragraph({
                    spacing: { before: 120 },
                    children: [new TextRun({ text: "Speed:", bold: true }), new TextRun(" Develop over hours or days")]
                  }),
                  new Paragraph({
                    children: [new TextRun({ text: "Warning time:", bold: true }), new TextRun(" Usually several hours to days")]
                  })
                ]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 4680, type: WidthType.DXA },
                children: [
                  new Paragraph({
                    children: [new TextRun({ text: "Common Causes", bold: true, size: 24 })]
                  }),
                  new Paragraph({
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Prolonged heavy rainfall over a river catchment")]
                  }),
                  new Paragraph({
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Rapid snowmelt in mountain regions")]
                  }),
                  new Paragraph({
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Saturated soil that can't absorb more water")]
                  }),
                  new Paragraph({
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Debris or ice blocking river flow")]
                  })
                ]
              })
            ]
          })
        ]
      }),
      new Paragraph({ spacing: { after: 200 }, children: [new TextRun("")] }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Coastal Floods")]
      }),
      new Table({
        columnWidths: [4680, 4680],
        margins: { top: 100, bottom: 100, left: 180, right: 180 },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 4680, type: WidthType.DXA },
                children: [
                  new Paragraph({
                    children: [new TextRun({ text: "What They Are", bold: true, size: 24 })]
                  }),
                  new Paragraph({
                    spacing: { before: 120 },
                    children: [new TextRun("Coastal floods happen when seawater floods normally dry coastal land. Rising sea levels due to climate change are making coastal flooding more common, even on calm, sunny days.")]
                  }),
                  new Paragraph({
                    spacing: { before: 120 },
                    children: [new TextRun({ text: "Speed:", bold: true }), new TextRun(" Varies—can be sudden or gradual")]
                  }),
                  new Paragraph({
                    children: [new TextRun({ text: "Warning time:", bold: true }), new TextRun(" Depends on the cause")]
                  })
                ]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 4680, type: WidthType.DXA },
                children: [
                  new Paragraph({
                    children: [new TextRun({ text: "Common Causes", bold: true, size: 24 })]
                  }),
                  new Paragraph({
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Storm surges from tropical cyclones or severe storms")]
                  }),
                  new Paragraph({
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Unusually high tides (king tides)")]
                  }),
                  new Paragraph({
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Tsunamis from underwater earthquakes")]
                  }),
                  new Paragraph({
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Rising sea levels from climate change")]
                  })
                ]
              })
            ]
          })
        ]
      }),
      new Paragraph({ spacing: { after: 200 }, children: [new TextRun("")] }),

      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Comparing the Three Types")]
      }),
      new Table({
        columnWidths: [2340, 2340, 2340, 2340],
        margins: { top: 100, bottom: 100, left: 180, right: 180 },
        rows: [
          new TableRow({
            tableHeader: true,
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 2340, type: WidthType.DXA },
                shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Type", bold: true })] })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 2340, type: WidthType.DXA },
                shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Speed", bold: true })] })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 2340, type: WidthType.DXA },
                shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Warning Time", bold: true })] })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 2340, type: WidthType.DXA },
                shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Danger Level", bold: true })] })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 2340, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun({ text: "Flash Flood", bold: true })] })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 2340, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun("Very fast (minutes to hours)")] })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 2340, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun("Little to none")] })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 2340, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun("Extremely high")] })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 2340, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun({ text: "River Flood", bold: true })] })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 2340, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun("Slower (hours to days)")] })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 2340, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun("Several hours to days")] })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 2340, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun("Moderate to high")] })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 2340, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun({ text: "Coastal Flood", bold: true })] })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 2340, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun("Varies")] })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 2340, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun("Varies")] })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 2340, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun("Moderate to very high")] })]
              })
            ]
          })
        ]
      }),
      new Paragraph({ spacing: { after: 200 }, children: [new TextRun("")] }),

      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Staying Safe")]
      }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun("No matter what type of flood threatens your area, remember these important safety rules:")]
      }),
      new Paragraph({
        numbering: { reference: "numbered-list-1", level: 0 },
        children: [new TextRun({ text: "Never walk, swim, or drive through floodwater.", bold: true }), new TextRun(" It only takes 15 centimetres of fast-flowing water to knock you off your feet, and 60 centimetres to sweep away a car.")]
      }),
      new Paragraph({
        numbering: { reference: "numbered-list-1", level: 0 },
        children: [new TextRun({ text: "Listen to emergency warnings", bold: true }), new TextRun(" on the radio, TV, or your phone.")]
      }),
      new Paragraph({
        numbering: { reference: "numbered-list-1", level: 0 },
        children: [new TextRun({ text: "If told to evacuate, leave immediately.", bold: true }), new TextRun(" Don't wait until it's too late.")]
      }),
      new Paragraph({
        numbering: { reference: "numbered-list-1", level: 0 },
        spacing: { after: 200 },
        children: [new TextRun({ text: "Move to higher ground", bold: true }), new TextRun(" if you're in a flood-prone area and water is rising.")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Comprehension Check")]
      }),
      new Paragraph({
        numbering: { reference: "numbered-list-1", level: 0 },
        children: [new TextRun("What is a flood? Explain in your own words.")]
      }),
      new Paragraph({
        numbering: { reference: "numbered-list-1", level: 0 },
        children: [new TextRun("List three different causes of floods.")]
      }),
      new Paragraph({
        numbering: { reference: "numbered-list-1", level: 0 },
        children: [new TextRun("Which type of flood is the most dangerous and why?")]
      }),
      new Paragraph({
        numbering: { reference: "numbered-list-1", level: 0 },
        children: [new TextRun("Compare flash floods and river floods. How are they different in terms of speed and warning time?")]
      }),
      new Paragraph({
        numbering: { reference: "numbered-list-1", level: 0 },
        children: [new TextRun("Why are coastal floods becoming more common? Mention at least two reasons.")]
      }),
      new Paragraph({
        numbering: { reference: "numbered-list-1", level: 0 },
        children: [new TextRun("Explain why you should never drive through floodwater. Use information from the text.")]
      })
    ]
  }]
});

// Save Document 1
Packer.toBuffer(doc1).then(buffer => {
  fs.writeFileSync("Understanding_Floods_Causes_and_Types.docx", buffer);
  console.log("Document 1 created: Understanding_Floods_Causes_and_Types.docx");
});

// Document 2: 2011 Brisbane Floods
const doc2 = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 24 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, color: "000000", font: "Arial" },
        paragraph: { spacing: { before: 240, after: 240 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, color: "000000", font: "Arial" },
        paragraph: { spacing: { before: 180, after: 180 }, outlineLevel: 1 } }
    ]
  },
  numbering: {
    config: [
      { reference: "bullet-list",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbered-list-1",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }
    ]
  },
  sections: [{
    properties: {
      page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
    },
    children: [
      new Paragraph({
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        spacing: { after: 240 },
        children: [new TextRun({ text: "THE 2011 BRISBANE FLOODS", bold: true, size: 48 })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        children: [new TextRun({ text: "When Queensland's Capital Went Underwater", italics: true, size: 28 })]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("A Disaster Unfolds")]
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun("In January 2011, Brisbane experienced one of the worst natural disasters in Australia's history. The Brisbane River burst its banks, flooding thousands of homes and businesses across the city. It was a catastrophe that would change Brisbane forever.")]
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun("The 2011 floods were part of a much larger disaster that affected most of Queensland. By the time the waters receded, 33 people had lost their lives, over 20,000 homes were flooded, and the damage bill reached billions of dollars.")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("What Caused the Floods?")]
      }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun("The 2011 Brisbane floods weren't caused by a single event. Instead, several factors combined to create the perfect storm:")]
      }),
      new Paragraph({
        numbering: { reference: "numbered-list-1", level: 0 },
        children: [new TextRun({ text: "La Niña Weather Pattern", bold: true }), new TextRun(" - An exceptionally strong La Niña brought much wetter conditions than normal to eastern Australia.")]
      }),
      new Paragraph({
        numbering: { reference: "numbered-list-1", level: 0 },
        children: [new TextRun({ text: "Months of Heavy Rain", bold: true }), new TextRun(" - Rain began falling in late November 2010 and continued through December. Some areas received up to six times their normal monthly rainfall.")]
      }),
      new Paragraph({
        numbering: { reference: "numbered-list-1", level: 0 },
        children: [new TextRun({ text: "Tropical Cyclone Tasha", bold: true }), new TextRun(" - On Christmas Day 2010, Cyclone Tasha made landfall, bringing even more heavy rain to Queensland's east coast.")]
      }),
      new Paragraph({
        numbering: { reference: "numbered-list-1", level: 0 },
        spacing: { after: 200 },
        children: [new TextRun({ text: "Saturated Ground", bold: true }), new TextRun(" - After weeks of rain, the ground was completely saturated. It couldn't absorb any more water, so all the rain ran straight into rivers and creeks.")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Timeline of Disaster")]
      }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun("The floods developed over several weeks, affecting different parts of Queensland at different times:")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Late November - December 2010")]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("Heavy rain begins falling across Queensland")]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("Eastern Queensland receives up to six times normal December rainfall")]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        spacing: { after: 200 },
        children: [new TextRun("The Burnett River in Bundaberg reaches its highest level in decades")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("25 December 2010")]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        spacing: { after: 200 },
        children: [new TextRun("Tropical Cyclone Tasha makes landfall south of Cairns, bringing more torrential rain")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Early January 2011")]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        spacing: { after: 200 },
        children: [new TextRun("Rockhampton experiences major flooding, with many residents evacuated")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("10 January 2011 - The Toowoomba Flash Flood")]
      }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun("This was one of the most terrifying moments of the disaster. The city of Toowoomba, west of Brisbane, was hit by a devastating flash flood after more than 160 millimetres of rain fell in just 36 hours.")]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("A wall of water swept through the city centre")]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("Cars were tossed around like toys")]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("Multiple people lost their lives")]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        spacing: { after: 200 },
        children: [new TextRun("The same storm system devastated the Lockyer Valley, where entire towns were submerged")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("11-13 January 2011 - Brisbane Floods")]
      }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun({ text: "11 January (morning):", bold: true }), new TextRun(" Low-lying areas of Brisbane begin to flood as the Brisbane River rises.")]
      }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun({ text: "11 January (2:30 pm):", bold: true }), new TextRun(" The Brisbane River breaks its banks. Evacuations begin in the CBD, Fortitude Valley, West End, and many suburbs.")]
      }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun({ text: "12 January:", bold: true }), new TextRun(" Floods continue to engulf Brisbane. Residents of approximately 2,100 streets are told to evacuate immediately.")]
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun({ text: "13 January:", bold: true }), new TextRun(" The Brisbane River peaks at 4.46 metres. An estimated 20,000 houses are inundated with floodwater.")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("The Human Cost")]
      }),
      new Table({
        columnWidths: [3120, 3120, 3120],
        margins: { top: 100, bottom: 100, left: 180, right: 180 },
        rows: [
          new TableRow({
            tableHeader: true,
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 3120, type: WidthType.DXA },
                shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Lives Lost", bold: true })] })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 3120, type: WidthType.DXA },
                shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "People Affected", bold: true })] })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 3120, type: WidthType.DXA },
                shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Homes Damaged", bold: true })] })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 3120, type: WidthType.DXA },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun("33 people")] })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 3120, type: WidthType.DXA },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun("Over 200,000 people")] })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 3120, type: WidthType.DXA },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun("28,000 homes")] })]
              })
            ]
          })
        ]
      }),
      new Paragraph({ spacing: { after: 200 }, children: [new TextRun("")] }),

      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun("Beyond the statistics, the floods had devastating impacts on real people:")]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("Families lost everything they owned")]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("Children couldn't return to school for weeks")]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("Businesses were destroyed, and people lost their jobs")]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        spacing: { after: 200 },
        children: [new TextRun("Many people experienced mental health problems like post-traumatic stress disorder")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("The Economic Impact")]
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun("The 2011 floods were one of Australia's most expensive natural disasters:")]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "Insurance claims:", bold: true }), new TextRun(" $2.55 billion from 56,200 claims")]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "Economic losses:", bold: true }), new TextRun(" Estimated $4 billion across mining, agriculture, and tourism")]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "GDP impact:", bold: true }), new TextRun(" Australia's economy shrank by approximately $30 billion")]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "Infrastructure damage:", bold: true }), new TextRun(" 19,000 kilometres of roads damaged, three major ports affected, and over 28% of Queensland's rail network damaged")]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        spacing: { after: 200 },
        children: [new TextRun({ text: "Agriculture:", bold: true }), new TextRun(" Vast areas of crops were ruined, and livestock were lost")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("The Clean-Up and Recovery")]
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun("When the floodwaters finally receded, Brisbane faced an enormous clean-up task. But something remarkable happened—thousands of volunteers, who became known as the 'Mud Army,' came from all over Queensland to help.")]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("Over 55,000 volunteers registered to help in just three days")]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("People shovelled mud, salvaged belongings, and cleaned homes")]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("Communities came together to support those who had lost everything")]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        spacing: { after: 200 },
        children: [new TextRun("The spirit of mateship and resilience shone through the disaster")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Lessons Learned")]
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun("The 2011 floods taught Queensland important lessons about flood preparedness and response:")]
      }),
      new Paragraph({
        numbering: { reference: "numbered-list-1", level: 0 },
        children: [new TextRun({ text: "Better warning systems:", bold: true }), new TextRun(" Queensland improved its flood warning and monitoring systems.")]
      }),
      new Paragraph({
        numbering: { reference: "numbered-list-1", level: 0 },
        children: [new TextRun({ text: "Dam management:", bold: true }), new TextRun(" Questions were raised about how the Wivenhoe Dam was managed during the floods, leading to reviews and changes.")]
      }),
      new Paragraph({
        numbering: { reference: "numbered-list-1", level: 0 },
        children: [new TextRun({ text: "Building regulations:", bold: true }), new TextRun(" New rules were introduced about building in flood-prone areas.")]
      }),
      new Paragraph({
        numbering: { reference: "numbered-list-1", level: 0 },
        spacing: { after: 200 },
        children: [new TextRun({ text: "Community preparedness:", bold: true }), new TextRun(" More emphasis was placed on educating communities about flood risks and emergency plans.")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Remembering 2011")]
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun("Today, Brisbane has largely recovered from the 2011 floods. New buildings have been constructed, infrastructure has been rebuilt, and life has returned to normal. However, the floods remain a powerful reminder of nature's force and the importance of being prepared.")]
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun("The 2011 Brisbane floods showed both the worst and the best of humanity—the devastating power of nature and the incredible resilience and kindness of people coming together in times of crisis.")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Comprehension Check")]
      }),
      new Paragraph({
        numbering: { reference: "numbered-list-1", level: 0 },
        children: [new TextRun("List three factors that combined to cause the 2011 Queensland floods.")]
      }),
      new Paragraph({
        numbering: { reference: "numbered-list-1", level: 0 },
        children: [new TextRun("What happened in Toowoomba on 10 January 2011? Why was this event particularly terrifying?")]
      }),
      new Paragraph({
        numbering: { reference: "numbered-list-1", level: 0 },
        children: [new TextRun("When did the Brisbane River peak, and how high did it reach?")]
      }),
      new Paragraph({
        numbering: { reference: "numbered-list-1", level: 0 },
        children: [new TextRun("Describe the impact of the floods on Brisbane's economy. Mention at least two specific effects.")]
      }),
      new Paragraph({
        numbering: { reference: "numbered-list-1", level: 0 },
        children: [new TextRun("Who were the 'Mud Army' and what did they do?")]
      }),
      new Paragraph({
        numbering: { reference: "numbered-list-1", level: 0 },
        children: [new TextRun("What lessons did Queensland learn from the 2011 floods? Explain two improvements that were made.")]
      }),
      new Paragraph({
        numbering: { reference: "numbered-list-1", level: 0 },
        children: [new TextRun("In your own words, explain what the author means by saying the floods showed 'both the worst and the best of humanity.'")]
      })
    ]
  }]
});

// Save Document 2
Packer.toBuffer(doc2).then(buffer => {
  fs.writeFileSync("The_2011_Brisbane_Floods.docx", buffer);
  console.log("Document 2 created: The_2011_Brisbane_Floods.docx");
});

console.log("All flood information documents created successfully!");
