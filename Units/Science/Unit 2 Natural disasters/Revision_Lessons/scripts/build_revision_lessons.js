const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType, PageBreak } = require('docx');
const fs = require('fs');
const path = require('path');

const THEME = {
  navy: '112d4e',
  orange: 'f96d00',
  white: 'f9f7f7',
  blue: '3f72af',
  darkGrey: '333333',
  lightGrey: 'e2e8f0',
  pureWhite: 'ffffff',
  green: '2e7d32',
  red: 'c62828'
};

const tableBorder = { style: BorderStyle.SINGLE, size: 4, color: THEME.lightGrey };
const cellBorders = { top: tableBorder, bottom: tableBorder, left: tableBorder, right: tableBorder };
const TEMPLATE_PATH = 'c:\\Users\\dsuth\\Documents\\Joshua\\.agent\\skills\\lesson-creator\\assets\\presentation_template.html';

// Helpers for Word Docs
function createHeader(title, subject = "Science Unit 2: Natural Disasters - Revision") {
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: title, bold: true, size: 32, color: THEME.navy })],
      spacing: { after: 100 }
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: subject, size: 20, color: THEME.blue, italics: true })],
      spacing: { after: 200 }
    }),
    new Table({
      columnWidths: [4500, 4520],
      rows: [
        new TableRow({
          children: [
            new TableCell({ width: { size: 4500, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Name: ______________________", size: 20 })] })] }),
            new TableCell({ width: { size: 4520, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Date: _________________  Class: _______", size: 20 })] })] })
          ]
        })
      ]
    }),
    new Paragraph({ text: "", spacing: { after: 250 } })
  ];
}

// Write the compiled HTML slide deck
async function generateHTMLPresentation(outputFilename, slidesData) {
  if (!fs.existsSync(TEMPLATE_PATH)) {
    throw new Error(`Presentation template wrapper not found at: ${TEMPLATE_PATH}`);
  }
  
  let templateContent = fs.readFileSync(TEMPLATE_PATH, 'utf8');
  
  // Integrity check
  const requiredMarkers = [
    'id="presentationContainer"',
    'id="masterToolbar"',
    'id="teacherNotesPanel"',
    'id="whiteboardOverlay"',
    'id="imageLightbox"',
    'id="teacherShowAnswerBtn"'
  ];
  requiredMarkers.forEach(marker => {
    if (!templateContent.includes(marker)) {
      throw new Error(`Wrapper Integrity Error: Standard template is missing required visual component marker "${marker}".`);
    }
  });

  let slidesHtml = '';
  
  slidesData.forEach((slide, idx) => {
    let slideClass = `slide theme-${slide.theme || 'light'}`;
    if (idx === 0) slideClass += ' active';
    
    let slideMarkup = `    <!-- SLIDE ${idx + 1}: ${slide.title} -->\n`;
    slideMarkup += `    <section class="${slideClass}" id="slide-${idx + 1}">\n`;
    
    if (slide.theme === 'dark') {
      slideMarkup += `      <div class="fade-in-up" style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%;">\n        <h1>${slide.title}</h1>\n`;
      if (slide.subtitle) {
        slideMarkup += `        <p class="subtitle" style="font-size:26px; color:var(--text-light); margin-top:20px;">${slide.subtitle}</p>\n`;
      }
      slideMarkup += `      </div>\n`;
    } else {
      slideMarkup += `      <h2 class="slide-title fade-in-up">${slide.title}</h2>\n`;
    }
    
    slideMarkup += `      <div class="content fade-in-up delay-1">\n`;
    slideMarkup += `        <div>\n          ${slide.standardHtml}\n        </div>\n`;
    slideMarkup += `      </div>\n`;
    
    if (slide.teacherNotes) {
      slideMarkup += `      <div class="teacher-notes" style="display: none;">\n        ${slide.teacherNotes}\n      </div>\n`;
    }
    
    slideMarkup += `    </section>\n\n`;
    slidesHtml += slideMarkup;
  });
  
  const placeholder = '<!-- SLIDES GO HERE DURING DYNAMIC COMPILATION -->';
  let compiledContent = templateContent.replace(placeholder, slidesHtml);
  
  fs.writeFileSync(outputFilename, compiledContent, 'utf8');
  console.log(`✅ Interactive HTML Presentation generated: ${path.basename(outputFilename)}`);
}

// Generate Lesson 1 Handout (Cyclone Trackers)
async function buildLesson1Handout(filename) {
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
          run: { size: 26, bold: true, color: THEME.navy, font: "Arial" },
          paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 }
        }
      ]
    },
    sections: [{
      properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
      children: [
        ...createHeader("Lesson R1: Cyclone Trackers - Revision Handout"),
        
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun({ text: "Section A: Weather Instrument Match-Up", bold: true, size: 24, color: THEME.navy })],
          spacing: { before: 100, after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Write the correct weather instrument or scale that matches each description below:", size: 20 })],
          spacing: { after: 150 }
        }),
        new Table({
          columnWidths: [3000, 6020],
          rows: [
            new TableRow({
              children: [
                new TableCell({ shading: { fill: THEME.navy }, children: [new Paragraph({ children: [new TextRun({ text: "Instrument / Scale", color: THEME.pureWhite, bold: true })] })] }),
                new TableCell({ shading: { fill: THEME.navy }, children: [new Paragraph({ children: [new TextRun({ text: "Purpose / Description", color: THEME.pureWhite, bold: true })] })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ borders: cellBorders, children: [new Paragraph({ text: "\n_____________________" })] }),
                new TableCell({ borders: cellBorders, children: [new Paragraph({ text: "Measures atmospheric pressure to forecast weather changes." })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ borders: cellBorders, children: [new Paragraph({ text: "\n_____________________" })] }),
                new TableCell({ borders: cellBorders, children: [new Paragraph({ text: "Measures wind speed directly using cups that spin." })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ borders: cellBorders, children: [new Paragraph({ text: "\n_____________________" })] }),
                new TableCell({ borders: cellBorders, children: [new Paragraph({ text: "A visual scale from 0 to 12 used to estimate wind speed based on observations of land or sea." })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ borders: cellBorders, children: [new Paragraph({ text: "\n_____________________" })] }),
                new TableCell({ borders: cellBorders, children: [new Paragraph({ text: "Shows high and low pressure systems and wind direction using isobars." })] })
              ]
            })
          ]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: "Section B: Wind Graph Analysis (TC Neo)", bold: true, size: 24, color: THEME.navy })] }),
        new Paragraph({
          children: [new TextRun({ text: "Look at the wind speed data for Tropical Cyclone Neo over a 12-day period:", size: 20 })],
          spacing: { after: 120 }
        }),
        new Table({
          columnWidths: [1500, 1500, 1500, 1500, 1500, 1500],
          rows: [
            new TableRow({
              children: [
                new TableCell({ shading: { fill: THEME.blue }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Day", color: THEME.pureWhite, bold: true })] })] }),
                new TableCell({ shading: { fill: THEME.blue }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Day 1", color: THEME.pureWhite })] })] }),
                new TableCell({ shading: { fill: THEME.blue }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Day 3", color: THEME.pureWhite })] })] }),
                new TableCell({ shading: { fill: THEME.blue }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Day 5", color: THEME.pureWhite })] })] }),
                new TableCell({ shading: { fill: THEME.blue }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Day 8", color: THEME.pureWhite })] })] }),
                new TableCell({ shading: { fill: THEME.blue }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Day 12", color: THEME.pureWhite })] })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Wind Speed", bold: true })] })] }),
                new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "55 km/h" })] })] }),
                new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "75 km/h" })] })] }),
                new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "115 km/h" })] })] }),
                new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "175 km/h" })] })] }),
                new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "85 km/h" })] })] })
              ]
            })
          ]
        }),
        new Paragraph({ text: "", spacing: { after: 150 } }),
        new Paragraph({
          children: [new TextRun({ text: "1. TC Neo crossed the coast on Day 8. What category was it on landfall? (Use the Cyclone category table on the slide to identify it).", bold: true, size: 20 })],
          spacing: { after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Answer: ________________________________________________________________________________", size: 18 })],
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "2. Describe the level of damage a town would sustain when hit by TC Neo on Day 8. Explain your reasoning.", bold: true, size: 20 })],
          spacing: { after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Answer: ________________________________________________________________________________\n________________________________________________________________________________", size: 18 })],
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "3. What is a key limitation of using the Beaufort scale instead of modern instruments?", bold: true, size: 20 })],
          spacing: { after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Answer: ________________________________________________________________________________", size: 18 })],
          spacing: { after: 200 }
        }),

        new Paragraph({ children: [new PageBreak()] }),

        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun({ text: "Section C: Prediction Critique & Research Inquiry", bold: true, size: 24, color: THEME.navy })]
        }),
        new Paragraph({
          children: [new TextRun({ text: "A meteorologist predicted: 'TC Neo will cross the Queensland coast near Townsville at exactly 10:00 am on Wednesday.' Based on what you know about cyclone paths, evaluate this prediction.", size: 20 })],
          spacing: { after: 150 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "1. Is this prediction accurate? Why or why not? Explain the limits of forecast tracks.", bold: true, size: 20 })],
          spacing: { after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Answer: ________________________________________________________________________________\n________________________________________________________________________________", size: 18 })],
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "2. List three additional sources of meteorological research or data that could improve this prediction.", bold: true, size: 20 })],
          spacing: { after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Answer: \n• ________________________________________________________________________________\n• ________________________________________________________________________________\n• ________________________________________________________________________________", size: 18 })],
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "3. Justify how one of these research sources provides a more accurate forecast.", bold: true, size: 20 })],
          spacing: { after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Answer: ________________________________________________________________________________\n________________________________________________________________________________", size: 18 })],
          spacing: { after: 200 }
        })
      ]
    }]
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(filename, buffer);
  console.log(`✅ Handout 1 generated: ${path.basename(filename)}`);
}

// Generate Lesson 1 Assessment (Cyclone Trackers)
async function buildLesson1Assessment(filename) {
  const questions = [
    {
      q: "1. Which category does a tropical cyclone fall into if its average wind speed is 130 km/h?",
      a: "A. Category 1",
      b: "B. Category 2",
      c: "C. Category 3",
      d: "D. Category 4",
      ans: "C"
    },
    {
      q: "2. Why is the Beaufort wind scale considered limited compared to digital weather stations?",
      a: "A. It relies on subjective visual observations rather than direct instrument measurement.",
      b: "B. It was designed in another country and does not apply to Australia.",
      c: "C. It cannot measure winds stronger than a breeze.",
      d: "D. It is only usable on land, not at sea.",
      ans: "A"
    },
    {
      q: "3. Which temperature threshold of sea surface waters is required for a cyclone to form and sustain itself?",
      a: "A. Above 10°C",
      b: "B. Above 20°C",
      c: "C. Above 26.5°C",
      d: "D. Above 35°C",
      ans: "C"
    },
    {
      q: "4. If a tropical cyclone track prediction is shown as a cone of uncertainty, what does this indicate?",
      a: "A. The cyclone will grow larger in diameter.",
      b: "B. The forecasting models become less certain about the exact path over time.",
      c: "C. The winds will get weaker as it moves.",
      d: "D. Evacuation is only needed at the center of the cone.",
      ans: "B"
    },
    {
      q: "5. What additional data can meteorologists collect to improve prediction accuracy?",
      a: "A. Seismograph vibration readouts.",
      b: "B. Ocean temperature profiles, satellite radar sweeps, and barometric pressure trends.",
      c: "C. Visual cloud counts from land.",
      d: "D. Historical rain charts from the previous century.",
      ans: "B"
    }
  ];

  const children = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "Lesson R1: Cyclone Trackers - Revision Assessment", bold: true, size: 32 })],
      spacing: { after: 300 }
    })
  ];

  questions.forEach(item => {
    children.push(new Paragraph({ children: [new TextRun({ text: item.q, bold: true, size: 22 })], spacing: { before: 150 } }));
    children.push(new Paragraph({ children: [new TextRun({ text: item.a, size: 20 })] }));
    children.push(new Paragraph({ children: [new TextRun({ text: item.b, size: 20 })] }));
    children.push(new Paragraph({ children: [new TextRun({ text: item.c, size: 20 })] }));
    children.push(new Paragraph({ children: [new TextRun({ text: item.d, size: 20 })] }));
    children.push(new Paragraph({ children: [new TextRun({ text: `ANS: ${item.ans}`, bold: true, size: 22 })], spacing: { after: 150 } }));
  });

  const doc = new Document({ sections: [{ children }] });
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(filename, buffer);
  console.log(`✅ Assessment 1 generated: ${path.basename(filename)}`);
}

// Generate Lesson 2 Handout (Seismic Engineers)
async function buildLesson2Handout(filename) {
  const doc = new Document({
    styles: {
      default: { document: { run: { font: "Arial", size: 22 } } },
      paragraphStyles: [
        {
          id: "Heading1",
          name: "Heading 1",
          basedOn: "Normal",
          next: "Normal",
          run: { size: 26, bold: true, color: THEME.navy, font: "Arial" },
          paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 }
        }
      ]
    },
    sections: [{
      properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
      children: [
        ...createHeader("Lesson R2: Seismic Engineers - Revision Handout"),
        
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun({ text: "Section A: Kashmiri Architectural Damping Systems", bold: true, size: 24, color: THEME.navy })],
          spacing: { before: 100, after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Read the description of traditional Kashmiri construction techniques and answer the questions below.", size: 20 })],
          spacing: { after: 150 }
        }),
        
        new Table({
          columnWidths: [9020],
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  shading: { fill: THEME.white },
                  borders: cellBorders,
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: "The Taq and Dhajji-Dewari systems are traditional building practices in Kashmir, an earthquake-prone region. In the Taq system, large horizontal timber beams are embedded in brick walls at floor and window levels. This binds the building components together, allowing the structure to flex and move in unison during shaking, preventing masonry cracks. The Dhajji-Dewari system uses a timber cage frame filled with brick/mortar panels, held together by lean mud mortar. The timber frame features vertical, horizontal, and diagonal braces. Mud mortar is flexible and allows microscopic displacements of bricks without collapsing, absorbing shockwaves.", size: 18, italics: true })]
                    })
                  ]
                })
              ]
            })
          ]
        }),
        new Paragraph({ text: "", spacing: { after: 150 } }),
        new Paragraph({
          children: [new TextRun({ text: "1. Explain how the Taq system prevents brick walls from cracking during an earthquake.", bold: true, size: 20 })],
          spacing: { after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Answer: ________________________________________________________________________________\n________________________________________________________________________________", size: 18 })],
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "2. Why is the use of lean mud mortar in the Dhajji-Dewari system better than stiff modern concrete mortar during seismic events?", bold: true, size: 20 })],
          spacing: { after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Answer: ________________________________________________________________________________\n________________________________________________________________________________", size: 18 })],
          spacing: { after: 200 }
        }),

        new Paragraph({ children: [new PageBreak()] }),

        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun({ text: "Section B: Rebuilding Guidelines for Australian Homes", bold: true, size: 24, color: THEME.navy })]
        }),
        new Paragraph({
          children: [new TextRun({ text: "A town in New South Wales experienced severe damage to modern, rigid brick homes during a minor earthquake. As a Seismic Engineer, write two design guidelines based on traditional principles to help them rebuild.", size: 20 })],
          spacing: { after: 150 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Guideline 1 (Horizontal Support/Tying Elements):", bold: true, size: 20 })],
          spacing: { after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Description: ____________________________________________________________________________\n________________________________________________________________________________", size: 18 })],
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Guideline 2 (Wall Panels & Bracing):", bold: true, size: 20 })],
          spacing: { after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Description: ____________________________________________________________________________\n________________________________________________________________________________", size: 18 })],
          spacing: { after: 200 }
        }),

        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun({ text: "Section C: Indigenous Narrative Analysis", bold: true, size: 24, color: THEME.navy })]
        }),
        new Paragraph({
          children: [new TextRun({ text: "Indigenous cultural stories often contain observations of geological events. Read a story extract: 'The Earth began to grow hot and growled like a giant beast. The mountain spat fire and ash, blocking out the sun, and the ground rolled like waves on the sea.'", size: 20 })],
          spacing: { after: 150 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Explain how this Indigenous story contributes to scientific understanding of natural disasters.", bold: true, size: 20 })],
          spacing: { after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Answer: ________________________________________________________________________________\n________________________________________________________________________________", size: 18 })],
          spacing: { after: 200 }
        })
      ]
    }]
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(filename, buffer);
  console.log(`✅ Handout 2 generated: ${path.basename(filename)}`);
}

// Generate Lesson 2 Assessment (Seismic Engineers)
async function buildLesson2Assessment(filename) {
  const questions = [
    {
      q: "1. What is the main structural function of horizontal timber beams in the Kashmiri Taq system?",
      a: "A. To make the walls thicker and heavier.",
      b: "B. To bind all parts of the masonry wall together so the structure moves as a single unit.",
      c: "C. To prevent water from entering the building.",
      d: "D. To insulate the house from severe cold.",
      ans: "B"
    },
    {
      q: "2. Why do diagonal timber cross beams in the Dhajji-Dewari frame improve stability?",
      a: "A. They allow the roof to be pitched higher.",
      b: "B. They divide large walls into smaller panels and distribute seismic shear forces.",
      c: "C. They reduce the amount of timber needed.",
      d: "D. They act as vents for smoke.",
      ans: "B"
    },
    {
      q: "3. Why does lean mud mortar perform better than rigid cement mortar during earthquake tremors?",
      a: "A. Mud is heavier and pushes the building down.",
      b: "B. Mud contains fibers that absorb heat.",
      c: "C. Stiff cement cracks under stress, while mud allows micro-displacements and absorbs shock.",
      d: "D. Mud mortar is waterproof.",
      ans: "C"
    },
    {
      q: "4. In what way do Indigenous stories assist modern geologists and seismologists?",
      a: "A. They provide accurate mathematical formulas.",
      b: "B. They record precise coordinates of epicenters.",
      c: "C. They preserve empirical records of ancient geological events over thousands of years.",
      d: "D. They explain how to build modern steel towers.",
      ans: "C"
    },
    {
      q: "5. If rebuilding a brick house in an earthquake zone, what traditional lesson is most critical?",
      a: "A. Make the foundations completely rigid with solid steel.",
      b: "B. Build walls with separate columns and no connecting joints.",
      c: "C. Introduce flexible frames and joints that distribute stress and allow movement.",
      d: "D. Paint the brick walls with waterproof coatings.",
      ans: "C"
    }
  ];

  const children = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "Lesson R2: Seismic Engineers - Revision Assessment", bold: true, size: 32 })],
      spacing: { after: 300 }
    })
  ];

  questions.forEach(item => {
    children.push(new Paragraph({ children: [new TextRun({ text: item.q, bold: true, size: 22 })], spacing: { before: 150 } }));
    children.push(new Paragraph({ children: [new TextRun({ text: item.a, size: 20 })] }));
    children.push(new Paragraph({ children: [new TextRun({ text: item.b, size: 20 })] }));
    children.push(new Paragraph({ children: [new TextRun({ text: item.c, size: 20 })] }));
    children.push(new Paragraph({ children: [new TextRun({ text: item.d, size: 20 })] }));
    children.push(new Paragraph({ children: [new TextRun({ text: `ANS: ${item.ans}`, bold: true, size: 22 })], spacing: { after: 150 } }));
  });

  const doc = new Document({ sections: [{ children }] });
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(filename, buffer);
  console.log(`✅ Assessment 2 generated: ${path.basename(filename)}`);
}

// Generate Lesson 3 Handout (Geologists)
async function buildLesson3Handout(filename) {
  const doc = new Document({
    styles: {
      default: { document: { run: { font: "Arial", size: 22 } } },
      paragraphStyles: [
        {
          id: "Heading1",
          name: "Heading 1",
          basedOn: "Normal",
          next: "Normal",
          run: { size: 26, bold: true, color: THEME.navy, font: "Arial" },
          paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 }
        }
      ]
    },
    sections: [{
      properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
      children: [
        ...createHeader("Lesson R3: Geologists - Revision Handout"),
        
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun({ text: "Section A: Identifying Landform Changes", bold: true, size: 24, color: THEME.navy })],
          spacing: { before: 100, after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Describe the geological process and visual changes that occur during these three earthquake effects:", size: 20 })],
          spacing: { after: 150 }
        }),
        new Table({
          columnWidths: [3000, 6020],
          rows: [
            new TableRow({
              children: [
                new TableCell({ shading: { fill: THEME.navy }, children: [new Paragraph({ children: [new TextRun({ text: "Earthquake Effect", color: THEME.pureWhite, bold: true })] })] }),
                new TableCell({ shading: { fill: THEME.navy }, children: [new Paragraph({ children: [new TextRun({ text: "Visual Evidence on Earth's Surface", color: THEME.pureWhite, bold: true })] })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Horizontal Fault Slip (Strike-Slip)", bold: true })] })] }),
                new TableCell({ borders: cellBorders, children: [new Paragraph({ text: "Linear features (roads, fences, tracks) are cut and offset sideways. \n\nDescribe: _____________________________________________________" })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Landslide Dam", bold: true })] })] }),
                new TableCell({ borders: cellBorders, children: [new Paragraph({ text: "Shaking causes valley slopes to collapse, dumping debris into a river channel. \n\nDescribe: _____________________________________________________" })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Vertical Fault Scarp (Dip-Slip)", bold: true })] })] }),
                new TableCell({ borders: cellBorders, children: [new Paragraph({ text: "Land on one side of a fault shifts up or down, forming a step cliff.\n\nDescribe: _____________________________________________________" })] })
              ]
            })
          ]
        }),

        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun({ text: "Section B: Mechanics of Fault Line Movements", bold: true, size: 24, color: THEME.navy })],
          spacing: { before: 200, after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "1. Describe the difference in stress and movement between a Normal Fault and a Reverse Fault. Which block moves upward, and under what type of stress?", bold: true, size: 20 })],
          spacing: { after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Answer: ________________________________________________________________________________\n________________________________________________________________________________", size: 18 })],
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "2. What type of tectonic plate boundary and force (stress) is associated with Strike-Slip faults? Provide one famous real-world example of this fault type.", bold: true, size: 20 })],
          spacing: { after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Answer: ________________________________________________________________________________\n________________________________________________________________________________", size: 18 })],
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "3. Explain how horizontal tension forces affect Earth's crust at a divergent boundary, and what visual features result on the surface.", bold: true, size: 20 })],
          spacing: { after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Answer: ________________________________________________________________________________\n________________________________________________________________________________", size: 18 })],
          spacing: { after: 200 }
        }),

        new Paragraph({ children: [new PageBreak()] }),

        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: "Section C: Track & Fence Deformation Prediction", bold: true, size: 24, color: THEME.navy })] }),
        new Paragraph({
          children: [new TextRun({ text: "Below is a plan view of straight train tracks and a parallel fence running across a fault line. Sketch what they would look like after a lateral (horizontal) earthquake offset. Explain your sketch.", size: 20 })],
          spacing: { after: 150 }
        }),
        
        new Table({
          columnWidths: [9020],
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  borders: cellBorders,
                  children: [
                    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "[ SKETCH FAULT DISPLACEMENT HERE ]", color: "888888" })] }),
                    new Paragraph({ text: "\n\n\n\n\n\n\n\n\n\n" })
                  ]
                })
              ]
            })
          ]
        }),
        new Paragraph({ text: "", spacing: { after: 150 } }),
        new Paragraph({
          children: [new TextRun({ text: "Explain your prediction. Why do both the fence and track shift by the same amount?", bold: true, size: 20 })],
          spacing: { after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Answer: ________________________________________________________________________________\n________________________________________________________________________________", size: 18 })],
          spacing: { after: 200 }
        }),

        new Paragraph({ children: [new PageBreak()] }),

        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun({ text: "Section D: Scientific Justification of Seismic Evidence", bold: true, size: 24, color: THEME.navy })]
        }),
        new Paragraph({
          children: [new TextRun({ text: "In addition to visual changes on landforms, what other sources of scientific evidence confirm that an earthquake occurred? List three and write a formal scientific paragraph justifying them.", size: 20 })],
          spacing: { after: 150 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Scientific Explanation (Use: tectonic plates, fault line, shear stress, lateral displacement):", bold: true, size: 20 })],
          spacing: { after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Answer: ________________________________________________________________________________\n________________________________________________________________________________\n________________________________________________________________________________\n________________________________________________________________________________", size: 18 })],
          spacing: { after: 200 }
        })
      ]
    }]
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(filename, buffer);
  console.log(`✅ Handout 3 generated: ${path.basename(filename)}`);
}

// Generate Lesson 3 Assessment (Geologists)
async function buildLesson3Assessment(filename) {
  const questions = [
    {
      q: "1. Which geologic term describes a horizontal offset along a fault line where blocks of land slide past each other?",
      a: "A. Vertical dip-slip scarp",
      b: "B. Landslide dam",
      c: "C. Lateral strike-slip displacement",
      d: "D. Soil liquefaction",
      ans: "C"
    },
    {
      q: "2. How is a landslide dam formed during or after an earthquake?",
      a: "A. Tectonic plates pull apart and create a deep canyon.",
      b: "B. Ground shaking causes unstable slopes to slide, blocking a river channel and flooding the upstream valley.",
      c: "C. Lava flows block streams.",
      d: "D. Strong winds pile up sand dunes in rivers.",
      ans: "B"
    },
    {
      q: "3. If a lateral fault shifts horizontally, what happens to a fence running parallel to a railway track that crosses the fault?",
      a: "A. The fence remains straight while only the tracks bend.",
      b: "B. The fence shifts by the exact same distance and direction as the tracks.",
      c: "C. The fence sinks vertically into the ground.",
      d: "D. The fence is unaffected.",
      ans: "B"
    },
    {
      q: "4. Which of the following is considered non-visual, instrument-recorded evidence of an earthquake?",
      a: "A. Photos of tilted trees on hillsides.",
      b: "B. High-frequency seismic wave data recorded on seismographs.",
      c: "C. Reports of blocked highway roads.",
      d: "D. High temperatures on weather charts.",
      ans: "B"
    },
    {
      q: "5. What is the primary geological driver of fault ruptures and earthquakes?",
      a: "A. High atmospheric pressure systems.",
      b: "B. Convection currents moving tectonic plates, creating shear stress until rocks fracture.",
      c: "C. High ocean tides pulling coastal soil.",
      d: "D. Heavy rainfall eroding sandstone.",
      ans: "B"
    },
    {
      q: "6. Which type of fault is formed by compressional stress, causing the hanging wall to move upward and over the footwall?",
      a: "A. Normal Fault (where gravity pulls the hanging wall down)",
      b: "B. Strike-Slip Fault (where shear stress causes horizontal sliding)",
      c: "C. Reverse / Thrust Fault (where compression pushes the hanging wall upward)",
      d: "D. Normal Fault (where compression pushes the footwall upward)",
      ans: "C"
    },
    {
      q: "7. A divergent boundary where tectonic plates pull apart experiences tensional stress. What type of faulting is predominant here, and what is its movement?",
      a: "A. Normal faulting, where the hanging wall slips downward relative to the footwall",
      b: "B. Reverse faulting, where the hanging wall is pushed upward over the footwall",
      c: "C. Strike-slip faulting, where blocks slide horizontally past each other",
      d: "D. Normal faulting, where the footwall slips downward relative to the hanging wall",
      ans: "A"
    },
    {
      q: "8. Which fault type features horizontal sliding of blocks of crust past each other with minimal vertical movement, and what stress drives it?",
      a: "A. Reverse faulting driven by compression",
      b: "B. Normal faulting driven by tension",
      c: "C. Strike-slip faulting driven by shear stress",
      d: "D. Strike-slip faulting driven by compressional stress",
      ans: "C"
    }
  ];

  const children = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "Lesson R3: Geologists - Revision Assessment", bold: true, size: 32 })],
      spacing: { after: 300 }
    })
  ];

  questions.forEach(item => {
    children.push(new Paragraph({ children: [new TextRun({ text: item.q, bold: true, size: 22 })], spacing: { before: 150 } }));
    children.push(new Paragraph({ children: [new TextRun({ text: item.a, size: 20 })] }));
    children.push(new Paragraph({ children: [new TextRun({ text: item.b, size: 20 })] }));
    children.push(new Paragraph({ children: [new TextRun({ text: item.c, size: 20 })] }));
    children.push(new Paragraph({ children: [new TextRun({ text: item.d, size: 20 })] }));
    children.push(new Paragraph({ children: [new TextRun({ text: `ANS: ${item.ans}`, bold: true, size: 22 })], spacing: { after: 150 } }));
  });

  const doc = new Document({ sections: [{ children }] });
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(filename, buffer);
  console.log(`✅ Assessment 3 generated: ${path.basename(filename)}`);
}

// Generate the 3 Presentations
async function buildLesson1Presentation(filename) {
  const slides = [
    {
      title: "DISASTER RESPONSE ACADEMY: CYCLONE TRACKERS",
      subtitle: "REVISION LESSON 1: METEOROLOGY & GRAPH INTERPRETATION",
      theme: "dark",
      standardHtml: `<p>Welcome to the Academy, Trainee Trackers! Today we will practice reading winds, analyzing track maps, and preparing for the final cyclone assessment.</p>`,
      teacherNotes: `<p>Welcome the students. Set the roleplay context: they are emergency responders. Emphasize that reading scales and graphs is a core skill for saving lives.</p>`
    },
    {
      title: "Warm-Up: Weather Instruments Matching",
      theme: "light",
      standardHtml: `
        <p class="intro-text">Match the meteorological tools or wind scales to their correct scientific functions.</p>
        <div class="match-container" id="l1-match">
          <div class="match-cols-grid">
            <div class="match-col">
              <div class="match-card" data-match="1" id="m-card-1">Anemometer</div>
              <div class="match-card" data-match="2" id="m-card-2">Barometer</div>
              <div class="match-card" data-match="3" id="m-card-3">Beaufort Scale</div>
              <div class="match-card" data-match="4" id="m-card-4">Synoptic Chart</div>
            </div>
            <div class="match-col">
              <div class="match-card" data-match="2" id="m-target-2">Measures atmospheric pressure</div>
              <div class="match-card" data-match="1" id="m-target-1">Measures wind speed directly</div>
              <div class="match-card" data-match="4" id="m-target-4">Maps pressure systems using isobars</div>
              <div class="match-card" data-match="3" id="m-target-3">Estimates wind force visually on land/sea</div>
            </div>
          </div>
          <div class="interactive-feedback" id="l1-feedback" style="color: var(--navy);">Select a tool on the left, then select its match on the right.</div>
          <div class="hint-box" id="l1-hint">Hint: Remember that an anemometer uses spinning cups for wind speed, while a barometer tracks pressure cells.</div>
        </div>
        <script>
          (function() {
            const slide = document.getElementById('slide-2');
            const container = document.getElementById('l1-match');
            const cards = container.querySelectorAll('.match-card');
            const feedback = document.getElementById('l1-feedback');
            const hintBox = document.getElementById('l1-hint');
            let selected = null;
            let errorCount = 0;
            let matchesFound = 0;

            cards.forEach(card => {
              card.addEventListener('click', () => {
                if (card.classList.contains('matched')) return;
                
                // If it's in the left column (source)
                if (card.id.startsWith('m-card-')) {
                  container.querySelectorAll('.match-card[id^="m-card-"]').forEach(c => c.classList.remove('selected'));
                  card.classList.add('selected');
                  selected = card;
                  feedback.innerText = "Now select the matching description on the right.";
                } else if (selected) {
                  // It's a target card
                  const matchId = card.getAttribute('data-match');
                  const sourceId = selected.getAttribute('data-match');
                  
                  if (matchId === sourceId) {
                    selected.classList.add('matched');
                    card.classList.add('matched');
                    selected.classList.remove('selected');
                    selected = null;
                    matchesFound++;
                    feedback.innerText = "Match correct! 🎉";
                    feedback.style.color = "var(--green-success)";
                    
                    if (matchesFound === 4) {
                      feedback.innerText = "Excellent work! All instruments correctly matched. 🌟";
                    }
                  } else {
                    selected.classList.remove('selected');
                    selected = null;
                    errorCount++;
                    feedback.innerText = "Not a match. Try again! ❌";
                    feedback.style.color = "var(--red-error)";
                    card.classList.add('incorrect-match');
                    setTimeout(() => card.classList.remove('incorrect-match'), 400);
                    
                    if (errorCount >= 2) {
                      hintBox.style.display = 'block';
                    }
                  }
                }
              });
            });

            slide.addEventListener('show-answer', () => {
              cards.forEach(c => c.classList.add('matched'));
              feedback.innerText = "All answers revealed! ✅";
              feedback.style.color = "var(--green-success)";
            });
          })();
        </script>
      `,
      teacherNotes: `<p>Conduct a brief Socratic check: Why do we need BOTH a visual scale (Beaufort) and mechanical instruments (anemometers)? If an instrument fails, visual cues keep us safe.</p>`
    },
    {
      title: "Data Analysis: Wind Speed Graph (TC Neo)",
      theme: "light",
      standardHtml: `
        <div style="display:flex; gap:30px;">
          <div style="flex:1;">
            <div style="height:250px; background:#fff; border:2px solid var(--navy); display:flex; flex-direction:column; justify-content:flex-end; padding:20px; position:relative; box-shadow: var(--shadow-sm);">
              <div style="position:absolute; top:10px; left:10px; font-size:14px; font-weight:bold; color:var(--navy);">TC Neo Average Wind Speeds</div>
              <div style="display:flex; justify-content:space-around; align-items:flex-end; height:100%; border-left:3px solid var(--navy); border-bottom:3px solid var(--navy); padding-left:10px; padding-bottom:5px;">
                <div style="display:flex; flex-direction:column; align-items:center;">
                  <div style="background:var(--blue); width:40px; height:50px; border-radius:4px 4px 0 0; display:flex; align-items:center; justify-content:center; color:#fff; font-size:12px; font-weight:bold;">55</div>
                  <span style="font-size:14px; font-weight:bold; margin-top:5px;">Day 1</span>
                </div>
                <div style="display:flex; flex-direction:column; align-items:center;">
                  <div style="background:var(--blue); width:40px; height:80px; border-radius:4px 4px 0 0; display:flex; align-items:center; justify-content:center; color:#fff; font-size:12px; font-weight:bold;">75</div>
                  <span style="font-size:14px; font-weight:bold; margin-top:5px;">Day 3</span>
                </div>
                <div style="display:flex; flex-direction:column; align-items:center;">
                  <div style="background:var(--blue); width:40px; height:120px; border-radius:4px 4px 0 0; display:flex; align-items:center; justify-content:center; color:#fff; font-size:12px; font-weight:bold;">115</div>
                  <span style="font-size:14px; font-weight:bold; margin-top:5px;">Day 5</span>
                </div>
                <div style="display:flex; flex-direction:column; align-items:center; position:relative;">
                  <div style="background:var(--orange); width:40px; height:180px; border-radius:4px 4px 0 0; display:flex; align-items:center; justify-content:center; color:#fff; font-size:12px; font-weight:bold;">175</div>
                  <span style="font-size:14px; font-weight:bold; margin-top:5px;">Day 8</span>
                </div>
                <div style="display:flex; flex-direction:column; align-items:center;">
                  <div style="background:var(--blue); width:40px; height:90px; border-radius:4px 4px 0 0; display:flex; align-items:center; justify-content:center; color:#fff; font-size:12px; font-weight:bold;">85</div>
                  <span style="font-size:14px; font-weight:bold; margin-top:5px;">Day 12</span>
                </div>
              </div>
            </div>
            <div class="remember-box" style="margin-top:15px; font-size:20px; padding:12px 20px;">
              <strong>Category Wind Speeds (km/h):</strong><br>
              Cat 1: 63–88 | Cat 2: 89–117 | Cat 3: 118–159 | Cat 4: 160–199 | Cat 5: >200
            </div>
          </div>
          <div style="flex:1.2; display:flex; flex-direction:column;">
            <div class="cloze-container" id="l1-cloze" style="margin-top:0; padding:20px; border-width:2px;">
              <div class="cloze-text" style="font-size:22px; line-height:1.6;">
                On Day 8, TC Neo crossed the coast with wind speeds of 175 km/h. At this time, it was classified as a 
                <span class="cloze-blank" data-answer="Category 4" id="blank-1">Select Category</span> cyclone. 
                According to the safety records, this wind speed will cause 
                <span class="cloze-blank" data-answer="structural damage" id="blank-2">Select Damage</span> to houses, including roof failures.
              </div>
              <div class="cloze-options-pool" id="l1-options-pool" style="margin-top:10px; padding-top:10px;">
                <div class="cloze-option" data-val="Category 2">Category 2</div>
                <div class="cloze-option" data-val="Category 4">Category 4</div>
                <div class="cloze-option" data-val="structural damage">structural damage</div>
                <div class="cloze-option" data-val="minor twigs broken">minor twigs broken</div>
              </div>
              <div class="interactive-feedback" id="l1-cloze-feedback" style="font-size:20px; min-height:28px;">Click a blank above, then select its term from the pool.</div>
              <div class="hint-box" id="l1-cloze-hint" style="font-size:18px; padding:10px 15px;">Hint: Compare 175 km/h with the category thresholds below the graph.</div>
            </div>
          </div>
        </div>
        <script>
          (function() {
            const slide = document.getElementById('slide-3');
            const container = document.getElementById('l1-cloze');
            const blanks = container.querySelectorAll('.cloze-blank');
            const options = container.querySelectorAll('.cloze-option');
            const feedback = document.getElementById('l1-cloze-feedback');
            const hintBox = document.getElementById('l1-cloze-hint');
            let activeBlank = null;
            let errorCount = 0;

            blanks.forEach(blank => {
              blank.addEventListener('click', () => {
                if (blank.classList.contains('correct-blank')) return;
                blanks.forEach(b => b.classList.remove('active-blank'));
                blank.classList.add('active-blank');
                activeBlank = blank;
                feedback.innerText = "Select the correct term below.";
              });
            });

            options.forEach(opt => {
              opt.addEventListener('click', () => {
                if (!activeBlank) {
                  feedback.innerText = "Please click on a blank first!";
                  return;
                }
                const correctVal = activeBlank.getAttribute('data-answer');
                const selectedVal = opt.getAttribute('data-val');
                
                if (correctVal === selectedVal) {
                  activeBlank.innerText = selectedVal;
                  activeBlank.classList.add('correct-blank');
                  activeBlank.classList.remove('active-blank');
                  activeBlank = null;
                  opt.classList.add('used');
                  feedback.innerText = "Correct blank placement! 🎉";
                  feedback.style.color = "var(--green-success)";
                } else {
                  errorCount++;
                  feedback.style.color = "var(--red-error)";
                  feedback.innerText = "Incorrect blank placement. Try again! ❌";
                  activeBlank.classList.add('incorrect-blank');
                  setTimeout(() => activeBlank.classList.remove('incorrect-blank'), 400);
                  
                  if (errorCount >= 2) {
                    hintBox.style.display = 'block';
                  }
                }
              });
            });

            slide.addEventListener('show-answer', () => {
              blanks.forEach(b => {
                b.innerText = b.getAttribute('data-answer');
                b.classList.add('correct-blank');
              });
              feedback.innerText = "Blanks resolved! ✅";
              feedback.style.color = "var(--green-success)";
            });
          })();
        </script>
      `,
      teacherNotes: `<p>Ensure students understand landfall: when a cyclone moves over land. Why does it weaken immediately after landfall? (Loses its heat source/warm ocean waters and encounters land friction).</p>`
    },
    {
      title: "Prediction Critique: TC Neo Pathing",
      theme: "light",
      standardHtml: `
        <div style="display:flex; gap:30px;">
          <div style="flex:1;">
            <svg viewBox="0 0 400 300" style="background:#edf2f7; border:2px solid var(--navy); border-radius:6px; box-shadow:var(--shadow-sm); width:100%; height:250px;">
              <!-- QLD Coast outline simplified -->
              <path d="M 50,50 L 80,100 L 100,160 L 140,220 L 180,260" stroke="#333" stroke-width="4" fill="none" />
              <text x="30" y="80" font-size="12" font-weight="bold" fill="#333">Cairns</text>
              <circle cx="80" cy="100" r="4" fill="red" />
              <text x="50" y="150" font-size="12" font-weight="bold" fill="#333">Townsville</text>
              <circle cx="100" cy="160" r="4" fill="red" />
              <text x="90" y="210" font-size="12" font-weight="bold" fill="#333">Bowen</text>
              <circle cx="120" cy="190" r="4" fill="red" />
              
              <!-- Cyclone path -->
              <path d="M 320,60 Q 240,110 120,190" stroke="var(--orange)" stroke-width="3" stroke-dasharray="6,4" fill="none" />
              <circle cx="120" cy="190" r="10" fill="rgba(249, 109, 0, 0.3)" />
              <circle cx="120" cy="190" r="4" fill="var(--orange)" />
              <text x="260" y="80" font-size="12" fill="var(--navy)">Cyclone path</text>
            </svg>
            <div class="scenario-box" style="margin-top:10px; font-size:18px; padding:8px 12px;">
              <strong>Prediction:</strong> "TC Neo will cross the coast near Bowen at exactly 11:00 am on Tuesday."
            </div>
          </div>
          <div style="flex:1.2;">
            <div class="quiz-container" style="margin-top:0; justify-content:flex-start; gap:15px;">
              <div class="quiz-question-box" style="font-size:24px; padding:15px; border-width:2px; box-shadow:3px 3px 0 var(--orange);">
                Why is this precise coordinate prediction unreliable?
              </div>
              <div class="quiz-grid" style="gap:15px; grid-template-columns:1fr;">
                <button class="quiz-option-btn" style="font-size:18px; padding:12px;" data-correct="false">A. The cyclone spins in the wrong direction for Bowen.</button>
                <button class="quiz-option-btn" style="font-size:18px; padding:12px;" data-correct="true">B. Cyclone paths are steered by fluctuating environmental winds and pressure systems, making a single coordinate/time target highly uncertain.</button>
                <button class="quiz-option-btn" style="font-size:18px; padding:12px;" data-correct="false">C. Townsville has mountain boundaries that push cyclones away.</button>
              </div>
              <div class="quiz-explanation-box" style="font-size:18px; padding:12px; margin-top:5px;">
                <div class="quiz-explanation-title"></div>
                Forecasters use a 'cone of uncertainty' because shifting steering winds, ocean temperatures, and atmospheric pressures introduce track variability.
              </div>
            </div>
          </div>
        </div>
      `,
      teacherNotes: `<p>Explain the Cone of Uncertainty. Why is it wider at the end of the forecast? (Errors compound over time, making future coordinates less predictable).</p>`
    },
    {
      title: "Exit Quiz: Cyclone Trackers",
      theme: "light",
      standardHtml: `
        <div class="quiz-container" style="gap:20px;">
          <div class="quiz-question-box" style="font-size:26px; padding:20px;">
            Which of the following describes a key limitation of the Beaufort Scale?
          </div>
          <div class="quiz-grid" style="gap:15px;">
            <button class="quiz-option-btn" style="font-size:20px; padding:15px;" data-correct="false">A. It can only be used at night.</button>
            <button class="quiz-option-btn" style="font-size:20px; padding:15px;" data-correct="true">B. It relies on subjective observations instead of instrument measurements.</button>
            <button class="quiz-option-btn" style="font-size:20px; padding:15px;" data-correct="false">C. It doesn't work in ocean environments.</button>
            <button class="quiz-option-btn" style="font-size:20px; padding:15px;" data-correct="false">D. It requires batteries to run.</button>
          </div>
          <div class="quiz-explanation-box" style="font-size:20px; padding:15px;">
            <div class="quiz-explanation-title"></div>
            Because the Beaufort Scale is based on visual observations (e.g. smoke rising, leaves moving), two observers might assign different values, unlike a calibrated anemometer.
          </div>
        </div>
      `,
      teacherNotes: `<p>Wrap up the lesson. Emphasize that in the exam, students will need to justify why instruments improve data accuracy.</p>`
    }
  ];
  
  await generateHTMLPresentation(filename, slides);
}

// Generate the 2nd Presentation (Seismic Engineers)
async function buildLesson2Presentation(filename) {
  const slides = [
    {
      title: "DISASTER RESPONSE ACADEMY: SEISMIC ENGINEERS",
      subtitle: "REVISION LESSON 2: EARTHQUAKE-RESISTANT DESIGN & INDIGENOUS STORIES",
      theme: "dark",
      standardHtml: `<p>Welcome, Seismic Engineers! Today we will analyze traditional structural systems that survive ground shaking, and examine how Indigenous stories carry historical geological records.</p>`,
      teacherNotes: `<p>Introduce the lesson. Outline the roles: structural engineers evaluating designs. Review the difference between rigid concrete and flexible wood.</p>`
    },
    {
      title: "Warm-Up: Building Components Sort",
      theme: "light",
      standardHtml: `
        <p class="intro-text">Sort the construction items into their reaction to earthquake shaking.</p>
        <div class="sort-container" id="l2-sort">
          <div class="sort-deck" id="l2-deck">
            <div class="sort-card" data-zone="resistant" id="s1">Diagonal timber braces</div>
            <div class="sort-card" data-zone="vulnerable" id="s2">Rigid brick & mortar walls</div>
            <div class="sort-card" data-zone="resistant" id="s3">Lean mud mortar joints</div>
            <div class="sort-card" data-zone="vulnerable" id="s4">Unreinforced chimneys</div>
            <div class="sort-card" data-zone="resistant" id="s5">Horizontal wood supports</div>
            <div class="sort-card" data-zone="vulnerable" id="s6">Stiff cement mortar</div>
          </div>
          <div class="sort-zones-grid">
            <div class="sort-zone" id="zone-vulnerable" data-zone-id="vulnerable">
              <div class="sort-zone-header">Vulnerable & Rigid</div>
            </div>
            <div class="sort-zone" id="zone-resistant" data-zone-id="resistant">
              <div class="sort-zone-header">Flexible & Resistant</div>
            </div>
          </div>
          <div class="interactive-feedback" id="l2-feedback" style="color: var(--navy);">Click an item, then click its category zone.</div>
          <div class="hint-box" id="l2-hint">Hint: Flexible elements (wood/mud) absorb shaking, while rigid elements (stiff brick/mortar) crack and break.</div>
        </div>
        <script>
          (function() {
            const slide = document.getElementById('slide-2');
            const deck = document.getElementById('l2-deck');
            const zones = document.querySelectorAll('.sort-zone');
            const cards = document.querySelectorAll('.sort-card');
            const feedback = document.getElementById('l2-feedback');
            const hintBox = document.getElementById('l2-hint');
            let selected = null;
            let errorCount = 0;
            let sortedCount = 0;

            cards.forEach(card => {
              card.addEventListener('click', () => {
                if (card.classList.contains('correct-placed')) return;
                cards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                selected = card;
                feedback.innerText = "Select a target category zone below.";
              });
            });

            zones.forEach(zone => {
              zone.addEventListener('click', () => {
                if (!selected) {
                  feedback.innerText = "Please select a card first.";
                  return;
                }
                const correctZone = selected.getAttribute('data-zone');
                const targetZoneId = zone.getAttribute('data-zone-id');
                
                if (correctZone === targetZoneId) {
                  selected.classList.remove('selected');
                  selected.classList.add('correct-placed');
                  zone.appendChild(selected);
                  selected = null;
                  sortedCount++;
                  feedback.innerText = "Placed correctly! 🎉";
                  feedback.style.color = "var(--green-success)";
                  
                  if (sortedCount === 6) {
                    feedback.innerText = "All items correctly sorted! 🌟";
                  }
                } else {
                  errorCount++;
                  feedback.style.color = "var(--red-error)";
                  feedback.innerText = "Incorrect zone placement. Try again! ❌";
                  selected.classList.remove('selected');
                  selected.classList.add('shake-error');
                  const cardEl = selected;
                  setTimeout(() => cardEl.classList.remove('shake-error'), 400);
                  selected = null;
                  
                  if (errorCount >= 2) {
                    hintBox.style.display = 'block';
                  }
                }
              });
            });

            slide.addEventListener('show-answer', () => {
              cards.forEach(c => {
                c.classList.add('correct-placed');
                const target = document.getElementById('zone-' + c.getAttribute('data-zone'));
                if (target) target.appendChild(c);
              });
              feedback.innerText = "All cards sorted! ✅";
              feedback.style.color = "var(--green-success)";
            });
          })();
        </script>
      `,
      teacherNotes: `<p>Explain that 'lean mud mortar' is critical because it contains sand and water ratios that let bricks wiggle. Rigid modern cement bonds tightly and shatters under shear stress.</p>`
    },
    {
      title: "Traditional Kashmiri Earthquake Resistant Systems",
      theme: "light",
      standardHtml: `
        <div style="display:flex; gap:30px;">
          <div style="flex:1; background: var(--soft-grey); padding:20px; border-left:6px solid var(--orange); border-radius:4px;">
            <h3 style="font-family:'Outfit'; color:var(--navy); font-size:24px; margin-bottom:10px;">The Taq System</h3>
            <p style="font-size:20px; line-height:1.5; margin-bottom:15px;">Large horizontal timbers are embedded into the brick walls at floor and window levels. This acts like horizontal ties, binding the walls together. When seismic waves hit, the wood flexes and distributes stress, preventing brick cracks.</p>
          </div>
          <div style="flex:1; background: var(--soft-grey); padding:20px; border-left:6px solid var(--blue); border-radius:4px;">
            <h3 style="font-family:'Outfit'; color:var(--navy); font-size:24px; margin-bottom:10px;">The Dhajji-Dewari System</h3>
            <p style="font-size:20px; line-height:1.5;">Uses timber cage frames with diagonal cross-braces, dividing brick walls into small panels. The frame absorbs shaking, while flexible lean mud mortar allows bricks to shift microscopically without collapsing the whole house.</p>
          </div>
        </div>
        <div class="remember-box" style="margin-top:20px; font-size:20px; padding:15px 20px;">
          <strong>Seismic Engineering Key Concept:</strong> Dissipation vs. Resistance. Traditional structures dissipate seismic energy through flexibility, whereas rigid structures try to resist it and snap.
        </div>
      `,
      teacherNotes: `<p>Conduct a whiteboard check (CFU): Ask students to write down the name of the system that uses diagonal timber cross beams (Dhajji-Dewari).</p>`
    },
    {
      title: "Indigenous Stories & Scientific Observations",
      theme: "light",
      standardHtml: `
        <p class="intro-text">Identify observations of physical geological changes within this traditional cultural account.</p>
        <div class="cloze-container" id="l2-indig" style="margin-top:10px; padding:20px; border-width:2px;">
          <div class="cloze-text" style="font-size:22px; line-height:1.7;">
            "The giant serpent beneath the land began to stir. The ground <span class="highlight-word" data-correct="true" id="hw1">rolled like ocean waves</span>. 
            Suddenly, a <span class="highlight-word" data-correct="true" id="hw2">deep crack ripped through the hills</span>, and red mud began to boil. 
            The mountains <span class="highlight-word" data-correct="false" id="hw3">sang a song of anger</span>, while the trees <span class="highlight-word" data-correct="true" id="hw4">shook and snapped in half</span>."
          </div>
          <div class="interactive-feedback" id="l2-indig-feedback" style="font-size:20px; min-height:28px;">Click on the words/phrases that describe empirical scientific observations.</div>
          <div class="hint-box" id="l2-indig-hint" style="font-size:18px; padding:10px 15px;">Hint: Empirical observations are physical, visible changes to land or structures (e.g. cracks, ground rolls, broken trees).</div>
        </div>
        <script>
          (function() {
            const slide = document.getElementById('slide-4');
            const container = document.getElementById('l2-indig');
            const words = container.querySelectorAll('.highlight-word');
            const feedback = document.getElementById('l2-indig-feedback');
            const hintBox = document.getElementById('l2-indig-hint');
            let correctCount = 0;
            let errorCount = 0;

            words.forEach(word => {
              word.addEventListener('click', () => {
                if (word.classList.contains('correct-highlight') || word.classList.contains('incorrect-highlight')) return;
                
                const isCorrect = word.getAttribute('data-correct') === 'true';
                if (isCorrect) {
                  word.classList.add('correct-highlight');
                  correctCount++;
                  feedback.innerText = "Scientific observation identified! 🌟";
                  feedback.style.color = "var(--green-success)";
                  if (correctCount === 3) {
                    feedback.innerText = "Excellent! You found all physical geological observations. 🎉";
                  }
                } else {
                  word.classList.add('incorrect-highlight');
                  errorCount++;
                  feedback.innerText = "Not a physical geological observation. Try again! ❌";
                  feedback.style.color = "var(--red-error)";
                  setTimeout(() => word.classList.remove('incorrect-highlight'), 500);
                  
                  if (errorCount >= 2) {
                    hintBox.style.display = 'block';
                  }
                }
              });
            });

            slide.addEventListener('show-answer', () => {
              words.forEach(w => {
                if (w.getAttribute('data-correct') === 'true') {
                  w.classList.add('correct-highlight');
                }
              });
              feedback.innerText = "All observations revealed! ✅";
              feedback.style.color = "var(--green-success)";
            });
          })();
        </script>
      `,
      teacherNotes: `<p>Discuss the importance of oral histories. Explain that Mount Gambier's volcanic eruptions were recorded by local Gunditjmara people over 9,000 years ago, matching modern carbon dating. Stories are valuable geologic records.</p>`
    },
    {
      title: "Exit Quiz: Seismic Engineers",
      theme: "light",
      standardHtml: `
        <div class="quiz-container" style="gap:20px;">
          <div class="quiz-question-box" style="font-size:26px; padding:20px;">
            Why does a timber-frame construction survive earthquakes better than unreinforced concrete walls?
          </div>
          <div class="quiz-grid" style="gap:15px;">
            <button class="quiz-option-btn" style="font-size:20px; padding:15px;" data-correct="false">A. Wood blocks seismic waves from traveling through the ground.</button>
            <button class="quiz-option-btn" style="font-size:20px; padding:15px;" data-correct="true">B. Timber frames can flex and distribute seismic energy, whereas rigid concrete cracks.</button>
            <button class="quiz-option-btn" style="font-size:20px; padding:15px;" data-correct="false">C. Wood is heavier and anchors the building down.</button>
            <button class="quiz-option-btn" style="font-size:20px; padding:15px;" data-correct="false">D. Rigid materials absorb energy more effectively.</button>
          </div>
          <div class="quiz-explanation-box" style="font-size:20px; padding:15px;">
            <div class="quiz-explanation-title"></div>
            Flexibility allows building frames to sway and absorb the ground displacements. Rigid structures attempt to remain static and shear under load.
          </div>
        </div>
      `,
      teacherNotes: `<p>Verify that students understand the core revision concepts of Lesson R2 before ending.</p>`
    }
  ];
  
  await generateHTMLPresentation(filename, slides);
}

// Generate the 3rd Presentation (Geologists)
async function buildLesson3Presentation(filename) {
  const slides = [
    {
      title: "DISASTER RESPONSE ACADEMY: GEOLOGISTS",
      subtitle: "REVISION LESSON 3: LANDFORM CHANGES & EARTH'S SURFACE",
      theme: "dark",
      standardHtml: `<p>Welcome, Forensic Geologists! Today we will examine how earthquakes reshape Earth's surface vertically and horizontally, and predict displacements on linear paths.</p>`,
      teacherNotes: `<p>Welcome class. Emphasize that earthquakes are rapid geologic events that alter landscapes. Define horizontal and vertical faulting.</p>`
    },
    {
      title: "Warm-Up: Landslide Dam Sequence",
      theme: "light",
      standardHtml: `
        <p class="intro-text">Arrange the steps of a landslide dam formation in the correct order.</p>
        <div class="seq-container" id="l3-seq">
          <div class="seq-list">
            <div class="seq-strip" data-index="1" id="seq1">
              <span class="seq-number">?</span>
              <span class="seq-text">Ground shaking causes steep valley slopes to become unstable.</span>
            </div>
            <div class="seq-strip" data-index="3" id="seq2">
              <span class="seq-number">?</span>
              <span class="seq-text">Massive rocks and soil slide down, blocking the river channel.</span>
            </div>
            <div class="seq-strip" data-index="2" id="seq3">
              <span class="seq-number">?</span>
              <span class="seq-text">Landslides are triggered on the hillsides.</span>
            </div>
            <div class="seq-strip" data-index="4" id="seq4">
              <span class="seq-number">?</span>
              <span class="seq-text">River water accumulates behind the slide block, forming a lake upstream.</span>
            </div>
          </div>
          <button class="interactive-submit-btn" id="l3-seq-submit">Submit Order</button>
          <div class="interactive-feedback" id="l3-feedback" style="color: var(--navy);">Click on a strip to select it, then click another to swap their positions.</div>
          <div class="hint-box" id="l3-hint">Hint: Shaking must trigger the slide before the debris can block the water flow.</div>
        </div>
        <script>
          (function() {
            const slide = document.getElementById('slide-2');
            const seqList = document.querySelector('.seq-list');
            const strips = Array.from(document.querySelectorAll('.seq-strip'));
            const feedback = document.getElementById('l3-feedback');
            const hintBox = document.getElementById('l3-hint');
            const submitBtn = document.getElementById('l3-seq-submit');
            let selectedStrip = null;
            let errorCount = 0;

            strips.forEach(strip => {
              strip.addEventListener('click', () => {
                if (strip.classList.contains('correct-seq')) return;
                
                if (selectedStrip === null) {
                  selectedStrip = strip;
                  strip.classList.add('selected');
                  feedback.innerText = "Select another item to swap positions.";
                } else {
                  // Swap elements in DOM
                  const index1 = strips.indexOf(selectedStrip);
                  const index2 = strips.indexOf(strip);
                  
                  // Swap in array
                  strips[index1] = strip;
                  strips[index2] = selectedStrip;
                  
                  // Re-render list
                  seqList.innerHTML = '';
                  strips.forEach(s => seqList.appendChild(s));
                  
                  selectedStrip.classList.remove('selected');
                  selectedStrip = null;
                  feedback.innerText = "Items swapped. Check order and submit!";
                }
              });
            });

            submitBtn.addEventListener('click', () => {
              let allCorrect = true;
              strips.forEach((strip, idx) => {
                const targetIdx = parseInt(strip.getAttribute('data-index')) - 1;
                if (idx !== targetIdx) {
                  allCorrect = false;
                  strip.classList.add('incorrect-seq');
                  setTimeout(() => strip.classList.remove('incorrect-seq'), 500);
                } else {
                  strip.classList.add('correct-seq');
                }
              });

              if (allCorrect) {
                feedback.innerText = "Order correct! Landslide dam sequence validated. 🎉";
                feedback.style.color = "var(--green-success)";
                submitBtn.disabled = true;
                strips.forEach((s, idx) => {
                  s.querySelector('.seq-number').innerText = (idx + 1);
                });
              } else {
                errorCount++;
                feedback.innerText = "Order incorrect. Try again! ❌";
                feedback.style.color = "var(--red-error)";
                if (errorCount >= 2) {
                  hintBox.style.display = 'block';
                }
              }
            });

            slide.addEventListener('show-answer', () => {
              // Sort strips array by data-index
              strips.sort((a, b) => parseInt(a.getAttribute('data-index')) - parseInt(b.getAttribute('data-index')));
              seqList.innerHTML = '';
              strips.forEach((s, idx) => {
                seqList.appendChild(s);
                s.classList.add('correct-seq');
                s.querySelector('.seq-number').innerText = (idx + 1);
              });
              feedback.innerText = "Order resolved! ✅";
              feedback.style.color = "var(--green-success)";
              submitBtn.disabled = true;
            });
          })();
        </script>
      `,
      teacherNotes: `<p>Verify that students understand how a landslide dam can cause upstream flooding while starving the downstream riverbed. This is a common exam scenario.</p>`
    },
    {
      title: "Fault Types 1: Normal Faults (Extension)",
      theme: "light",
      standardHtml: `
        <style>
          @keyframes normalSlide {
            0% { transform: translate(0, 0); }
            50% { transform: translate(15px, 30px); }
            100% { transform: translate(0, 0); }
          }
          .normal-hw {
            animation: normalSlide 4s ease-in-out infinite;
          }
        </style>
        <div style="display:flex; gap:30px; align-items:center;">
          <div style="flex:1;">
            <p style="font-size:22px; line-height:1.5; margin-bottom:15px; font-family:'Outfit', sans-serif;">
              <strong>Normal faults</strong> are created by horizontal <strong>tensional stress</strong> (pulling apart).
            </p>
            <p style="font-size:20px; line-height:1.5; margin-bottom:15px; font-family:'Outfit', sans-serif;">
              - <strong>Tectonic Boundary</strong>: Divergent boundary.<br>
              - <strong>Movement</strong>: The hanging wall moves <strong>downward</strong> relative to the footwall along the fault plane.<br>
              - <strong>Surface Features</strong>: Creates steep cliff faces called <em>fault scarps</em> and rift valleys.
            </p>
          </div>
          <div style="flex:1; display:flex; flex-direction:column; align-items:center;">
            <svg viewBox="0 0 300 240" style="background:#f8fafc; border:2px solid var(--navy); border-radius:6px; width:300px; height:240px;">
              <!-- Tension Force Arrows -->
              <path d="M 30,30 L 10,30 M 10,30 L 18,25 M 10,30 L 18,35" stroke="var(--orange)" stroke-width="3" fill="none" />
              <path d="M 270,30 L 290,30 M 290,30 L 282,25 M 290,30 L 282,35" stroke="var(--orange)" stroke-width="3" fill="none" />
              <text x="75" y="35" font-size="12" font-weight="bold" fill="var(--orange)" font-family="'Outfit', sans-serif">TENSION (PULLING APART)</text>
              
              <!-- Footwall (Stable Left Block) with 3 strata layers -->
              <g>
                <!-- Layer 1 (top): Terracotta -->
                <polygon points="10,100 100,100 120,140 10,140" fill="#e29c6f" stroke="var(--navy)" stroke-width="2" />
                <!-- Layer 2 (middle): Soft Blue -->
                <polygon points="10,140 120,140 140,180 10,180" fill="#3f72af" stroke="var(--navy)" stroke-width="2" />
                <!-- Layer 3 (bottom): Slate Blue -->
                <polygon points="10,180 140,180 160,220 10,220" fill="#476083" stroke="var(--navy)" stroke-width="2" />
                
                <!-- Footwall label centered on middle layer -->
                <text x="35" y="165" fill="#ffffff" font-size="13" font-weight="bold" font-family="'Outfit', sans-serif">Footwall</text>
              </g>
              
              <!-- Hanging Wall (Sliding Right Block) with 3 strata layers -->
              <g class="normal-hw">
                <!-- Layer 1 (top): Terracotta -->
                <polygon points="100,100 220,100 240,140 120,140" fill="#e29c6f" stroke="var(--navy)" stroke-width="2" />
                <!-- Layer 2 (middle): Soft Blue -->
                <polygon points="120,140 240,140 260,180 140,180" fill="#3f72af" stroke="var(--navy)" stroke-width="2" />
                <!-- Layer 3 (bottom): Slate Blue -->
                <polygon points="140,180 260,180 280,220 160,220" fill="#476083" stroke="var(--navy)" stroke-width="2" />
                
                <!-- Hanging Wall label centered on middle layer -->
                <text x="150" y="165" fill="#ffffff" font-size="13" font-weight="bold" font-family="'Outfit', sans-serif">Hanging Wall</text>
                
                <!-- Downward slip indicator arrow -->
                <path d="M 130,85 L 140,105 M 140,105 L 133,105 M 140,105 L 140,98" stroke="var(--orange)" stroke-width="3" fill="none" />
              </g>
              <!-- Fault Plane Line -->
              <line x1="100" y1="100" x2="160" y2="220" stroke="var(--red-error)" stroke-width="3" stroke-dasharray="4,2" />
            </svg>
          </div>
        </div>
      `,
      teacherNotes: `<p>In normal faults, the rock is under tension (stretching). Point out that the layers of rock (terracotta, blue, and slate) match but have slipped down on the right. Gravity pulls the hanging wall down.</p>`
    },
    {
      title: "Fault Types 2: Reverse Faults (Compression)",
      theme: "light",
      standardHtml: `
        <style>
          @keyframes reverseSlide {
            0% { transform: translate(0, 0); }
            50% { transform: translate(-15px, -30px); }
            100% { transform: translate(0, 0); }
          }
          .reverse-hw {
            animation: reverseSlide 4s ease-in-out infinite;
          }
        </style>
        <div style="display:flex; gap:30px; align-items:center;">
          <div style="flex:1;">
            <p style="font-size:22px; line-height:1.5; margin-bottom:15px; font-family:'Outfit', sans-serif;">
              <strong>Reverse faults</strong> (including low-angle <em>thrust faults</em>) are created by horizontal <strong>compressional stress</strong> (squeezing).
            </p>
            <p style="font-size:20px; line-height:1.5; margin-bottom:15px; font-family:'Outfit', sans-serif;">
              - <strong>Tectonic Boundary</strong>: Convergent boundary.<br>
              - <strong>Movement</strong>: The hanging wall is pushed <strong>upward</strong> and over the footwall along the fault plane.<br>
              - <strong>Surface Features</strong>: Thrusts massive slabs of rock upwards, folding the crust and building tall mountain ranges (e.g. Himalayas).
            </p>
          </div>
          <div style="flex:1; display:flex; flex-direction:column; align-items:center;">
            <svg viewBox="0 0 300 240" style="background:#f8fafc; border:2px solid var(--navy); border-radius:6px; width:300px; height:240px;">
              <!-- Compression Force Arrows -->
              <path d="M 10,30 L 30,30 M 30,30 L 22,25 M 30,30 L 22,35" stroke="var(--orange)" stroke-width="3" fill="none" />
              <path d="M 290,30 L 270,30 M 270,30 L 278,25 M 270,30 L 278,35" stroke="var(--orange)" stroke-width="3" fill="none" />
              <text x="65" y="35" font-size="12" font-weight="bold" fill="var(--orange)" font-family="'Outfit', sans-serif">COMPRESSION (PUSHING TOGETHER)</text>
              
              <!-- Footwall (Stable Left Block) with 3 strata layers -->
              <g>
                <!-- Layer 1 (top): Terracotta -->
                <polygon points="10,100 100,100 120,140 10,140" fill="#e29c6f" stroke="var(--navy)" stroke-width="2" />
                <!-- Layer 2 (middle): Soft Blue -->
                <polygon points="10,140 120,140 140,180 10,180" fill="#3f72af" stroke="var(--navy)" stroke-width="2" />
                <!-- Layer 3 (bottom): Slate Blue -->
                <polygon points="10,180 140,180 160,220 10,220" fill="#476083" stroke="var(--navy)" stroke-width="2" />
                
                <!-- Footwall label centered on middle layer -->
                <text x="35" y="165" fill="#ffffff" font-size="13" font-weight="bold" font-family="'Outfit', sans-serif">Footwall</text>
              </g>
              
              <!-- Hanging Wall (Pushed Up Right Block) with 3 strata layers -->
              <g class="reverse-hw">
                <!-- Layer 1 (top): Terracotta -->
                <polygon points="100,100 220,100 240,140 120,140" fill="#e29c6f" stroke="var(--navy)" stroke-width="2" />
                <!-- Layer 2 (middle): Soft Blue -->
                <polygon points="120,140 240,140 260,180 140,180" fill="#3f72af" stroke="var(--navy)" stroke-width="2" />
                <!-- Layer 3 (bottom): Slate Blue -->
                <polygon points="140,180 260,180 280,220 160,220" fill="#476083" stroke="var(--navy)" stroke-width="2" />
                
                <!-- Hanging Wall label centered on middle layer -->
                <text x="150" y="165" fill="#ffffff" font-size="13" font-weight="bold" font-family="'Outfit', sans-serif">Hanging Wall</text>
                
                <!-- Upward slip indicator arrow -->
                <path d="M 140,105 L 130,85 M 130,85 L 137,85 M 130,85 L 130,92" stroke="var(--orange)" stroke-width="3" fill="none" />
              </g>
              <!-- Fault Plane Line -->
              <line x1="100" y1="100" x2="160" y2="220" stroke="var(--red-error)" stroke-width="3" stroke-dasharray="4,2" />
            </svg>
          </div>
        </div>
      `,
      teacherNotes: `<p>Explain that reverse faults occur under compressional (squeezing) forces. The hanging wall climbs up the footwall. These create the most powerful megathrust earthquakes at convergence zones.</p>`
    },
    {
      title: "Fault Types 3: Strike-Slip Faults (Shear)",
      theme: "light",
      standardHtml: `
        <style>
          @keyframes strikeSlide {
            0% { transform: translate(0, 0); }
            50% { transform: translate(15px, 35px); }
            100% { transform: translate(0, 0); }
          }
          .strike-right {
            animation: strikeSlide 4s ease-in-out infinite;
          }
        </style>
        <div style="display:flex; gap:30px; align-items:center;">
          <div style="flex:1;">
            <p style="font-size:22px; line-height:1.5; margin-bottom:15px; font-family:'Outfit', sans-serif;">
              <strong>Strike-slip faults</strong> are created by horizontal <strong>shear stress</strong> (sliding past).
            </p>
            <p style="font-size:20px; line-height:1.5; margin-bottom:15px; font-family:'Outfit', sans-serif;">
              - <strong>Tectonic Boundary</strong>: Transform boundary.<br>
              - <strong>Movement</strong>: Blocks of crust slide past each other horizontally with little or no vertical movement.<br>
              - <strong>Surface Features</strong>: Offsets straight linear elements like roads, fences, and riverbeds. (e.g. San Andreas Fault).
            </p>
          </div>
          <div style="flex:1; display:flex; flex-direction:column; align-items:center;">
            <svg viewBox="0 0 300 240" style="background:#f8fafc; border:2px solid var(--navy); border-radius:6px; width:300px; height:240px;">
              <!-- Shear Force Arrows -->
              <path d="M 50,225 L 10,225 M 10,225 L 18,220 M 10,225 L 18,230" stroke="var(--orange)" stroke-width="3" fill="none" />
              <path d="M 250,15 L 290,15 M 290,15 L 282,10 M 290,15 L 282,20" stroke="var(--orange)" stroke-width="3" fill="none" />
              <text x="85" y="125" font-size="12" font-weight="bold" fill="var(--orange)" font-family="'Outfit', sans-serif" transform="rotate(-30 85 125)">SHEAR STRESS</text>
              
              <!-- Left Block (Stable) -->
              <g>
                <!-- Top Surface (warm light clay) -->
                <polygon points="20,80 90,80 120,150 20,150" fill="#e2c29c" stroke="var(--navy)" stroke-width="1.5" />
                <!-- Road Part on Left Block -->
                <line x1="105" y1="115" x2="105" y2="150" stroke="#7f8c8d" stroke-width="8" stroke-linecap="round" />
                <line x1="105" y1="115" x2="105" y2="150" stroke="#ffffff" stroke-width="2" stroke-dasharray="3,3" />
                
                <!-- Front Face Strata Layers -->
                <!-- Layer 1: Terracotta -->
                <polygon points="20,150 120,150 123,170 20,170" fill="#e29c6f" stroke="var(--navy)" stroke-width="1.5" />
                <!-- Layer 2: Soft Blue -->
                <polygon points="20,170 123,170 126,190 20,190" fill="#3f72af" stroke="var(--navy)" stroke-width="1.5" />
                <!-- Layer 3: Slate Blue -->
                <polygon points="20,190 126,190 130,210 20,210" fill="#476083" stroke="var(--navy)" stroke-width="1.5" />
                
                <!-- Block label -->
                <text x="40" y="195" fill="#ffffff" font-size="12" font-weight="bold" font-family="'Outfit', sans-serif">Block A</text>
              </g>
              
              <!-- Right Block (Sliding) -->
              <g class="strike-right">
                <!-- Top Surface (warm light clay) -->
                <polygon points="90,80 190,80 220,150 120,150" fill="#e2c29c" stroke="var(--navy)" stroke-width="1.5" />
                <!-- Road Part on Right Block -->
                <line x1="105" y1="80" x2="105" y2="115" stroke="#7f8c8d" stroke-width="8" stroke-linecap="round" />
                <line x1="105" y1="80" x2="105" y2="115" stroke="#ffffff" stroke-width="2" stroke-dasharray="3,3" />
                
                <!-- Front Face Strata Layers -->
                <!-- Layer 1: Terracotta -->
                <polygon points="120,150 220,150 223,170 123,170" fill="#e29c6f" stroke="var(--navy)" stroke-width="1.5" />
                <!-- Layer 2: Soft Blue -->
                <polygon points="123,170 223,170 226,190 126,190" fill="#3f72af" stroke="var(--navy)" stroke-width="1.5" />
                <!-- Layer 3: Slate Blue -->
                <polygon points="126,190 226,190 230,210 130,210" fill="#476083" stroke="var(--navy)" stroke-width="1.5" />
                
                <!-- Block label -->
                <text x="145" y="195" fill="#ffffff" font-size="12" font-weight="bold" font-family="'Outfit', sans-serif">Block B</text>
                
                <!-- Horizontal slip arrows -->
                <path d="M 140,65 L 165,65 M 165,65 L 159,60 M 165,65 L 159,70" stroke="var(--orange)" stroke-width="2.5" fill="none" />
              </g>
              
              <!-- Fault line split down the middle (Top and Front) -->
              <line x1="90" y1="80" x2="120" y2="150" stroke="var(--red-error)" stroke-width="2.5" stroke-linecap="round" />
              <line x1="120" y1="150" x2="130" y2="210" stroke="var(--red-error)" stroke-width="2.5" stroke-linecap="round" />
              
              <!-- Fault Line Label pointer -->
              <text x="135" y="125" fill="var(--red-error)" font-size="11" font-weight="bold" font-family="'Outfit', sans-serif">Fault Line</text>
              <path d="M 130,121 L 112,112" stroke="var(--red-error)" stroke-width="1.5" fill="none" />
            </svg>
          </div>
        </div>
      `,
      teacherNotes: `<p>Highlight that strike-slip movements are horizontal. There is no vertical step (scarp). Ask students: if a straight road crossed this line, what would happen? (It would split and the parts would shift sideways).</p>`
    },
    {
      title: "Fault Line Displacement: Railroad Shift",
      theme: "light",
      standardHtml: `
        <div style="display:flex; gap:30px;">
          <div style="flex:1;">
            <p style="font-size:22px; line-height:1.5; margin-bottom:15px;">
              Imagine straight railway tracks crossed by a horizontal (strike-slip) fault line. During an earthquake, the blocks of land slide past each other.
            </p>
            <div class="remember-box" style="font-size:20px; padding:15px; margin-top:20px;">
              <strong>Geologic Principle:</strong> Linear features (tracks, roads, fences) running across a fault are cut and shifted. If a fence is parallel to the tracks, both are shifted by the <em>exact same amount</em>.
            </div>
          </div>
          <div style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center;">
            <svg viewBox="0 0 200 200" style="background:#eef2f6; border:2px solid var(--navy); border-radius:6px; width:250px; height:250px;" id="rail-svg">
              <!-- Fault line horizontal -->
              <line x1="0" y1="100" x2="200" y2="100" stroke="red" stroke-width="4" stroke-dasharray="4,4" />
              <!-- Tracks (Normal) -->
              <g id="normal-tracks">
                <line x1="80" y1="0" x2="80" y2="200" stroke="#476083" stroke-width="6" />
                <line x1="120" y1="0" x2="120" y2="200" stroke="#476083" stroke-width="6" />
                <!-- Ties -->
                <line x1="75" y1="30" x2="125" y2="30" stroke="#333" stroke-width="3" />
                <line x1="75" y1="70" x2="125" y2="70" stroke="#333" stroke-width="3" />
                <line x1="75" y1="130" x2="125" y2="130" stroke="#333" stroke-width="3" />
                <line x1="75" y1="170" x2="125" y2="170" stroke="#333" stroke-width="3" />
              </g>
              <!-- Tracks (Shifted) -->
              <g id="shifted-tracks" style="display:none;">
                <!-- Top Half (unmoved) -->
                <line x1="80" y1="0" x2="80" y2="100" stroke="#476083" stroke-width="6" />
                <line x1="120" y1="0" x2="120" y2="100" stroke="#476083" stroke-width="6" />
                <line x1="75" y1="30" x2="125" y2="30" stroke="#333" stroke-width="3" />
                <line x1="75" y1="70" x2="125" y2="70" stroke="#333" stroke-width="3" />
                
                <!-- Bottom Half (shifted left by 40px) -->
                <line x1="40" y1="100" x2="40" y2="200" stroke="#476083" stroke-width="6" />
                <line x1="80" y1="100" x2="80" y2="200" stroke="#476083" stroke-width="6" />
                <line x1="35" y1="130" x2="85" y2="130" stroke="#333" stroke-width="3" />
                <line x1="35" y1="170" x2="85" y2="170" stroke="#333" stroke-width="3" />
              </g>
            </svg>
            <button class="interactive-submit-btn" id="l3-shift-btn">Simulate Displacement</button>
          </div>
        </div>
        <script>
          (function() {
            const slide = document.getElementById('slide-6'); // Updated to Slide 6
            const normalTracks = document.getElementById('normal-tracks');
            const shiftedTracks = document.getElementById('shifted-tracks');
            const btn = document.getElementById('l3-shift-btn');
            let isShifted = false;

            btn.addEventListener('click', () => {
              isShifted = !isShifted;
              if (isShifted) {
                normalTracks.style.display = 'none';
                shiftedTracks.style.display = 'block';
                btn.innerText = "Reset Tracks";
              } else {
                normalTracks.style.display = 'block';
                shiftedTracks.style.display = 'none';
                btn.innerText = "Simulate Displacement";
              }
            });

            slide.addEventListener('show-answer', () => {
              normalTracks.style.display = 'none';
              shiftedTracks.style.display = 'block';
              btn.innerText = "Reset Tracks";
              isShifted = true;
            });
          })();
        </script>
      `,
      teacherNotes: `<p>Use the drawing tools to sketch a parallel fence on the slide. Show that if the fence runs parallel to the tracks, it will have the exact same horizontal offset at the fault boundary.</p>`
    },
    {
      title: "Exit Quiz: Earth Surface Changes",
      theme: "light",
      standardHtml: `
        <div class="quiz-container" style="gap:20px;">
          <div class="quiz-question-box" style="font-size:26px; padding:20px;">
            In addition to visual cracks or offsets, which instrument provides the best empirical evidence of an earthquake?
          </div>
          <div class="quiz-grid" style="gap:15px;">
            <button class="quiz-option-btn" style="font-size:20px; padding:15px;" data-correct="false">A. Barometer atmospheric gauges.</button>
            <button class="quiz-option-btn" style="font-size:20px; padding:15px;" data-correct="true">B. Seismograph recordings of seismic wave frequencies.</button>
            <button class="quiz-option-btn" style="font-size:20px; padding:15px;" data-correct="false">C. Rain gauge data boards.</button>
            <button class="quiz-option-btn" style="font-size:20px; padding:15px;" data-correct="false">D. Anemometer registers.</button>
          </div>
          <div class="quiz-explanation-box" style="font-size:20px; padding:15px;">
            <div class="quiz-explanation-title"></div>
            Seismographs measure and record ground vibrations (seismic waves). This data provides direct scientific measurements of magnitude and epicenter locations.
          </div>
        </div>
      `,
      teacherNotes: `<p>Summarise all three lessons. Remind students that revision is complete and they are ready for their final assessment.</p>`
    }
  ];
  
  await generateHTMLPresentation(filename, slides);
}

// Main Runner
async function run() {
  const baseDir = path.join(__dirname, '..');
  
  // Create folders if they don't exist
  const r1Dir = path.join(baseDir, 'Lesson_R1');
  const r2Dir = path.join(baseDir, 'Lesson_R2');
  const r3Dir = path.join(baseDir, 'Lesson_R3');
  
  fs.mkdirSync(r1Dir, { recursive: true });
  fs.mkdirSync(r2Dir, { recursive: true });
  fs.mkdirSync(r3Dir, { recursive: true });
  
  console.log("Generating revision files...");
  
  // Lesson 1 files
  await buildLesson1Handout(path.join(r1Dir, 'Lesson_R1_Handout.docx'));
  await buildLesson1Assessment(path.join(r1Dir, 'Lesson_R1_Assessment.docx'));
  await buildLesson1Presentation(path.join(r1Dir, 'Lesson_R1_Presentation.html'));
  
  // Lesson 2 files
  await buildLesson2Handout(path.join(r2Dir, 'Lesson_R2_Handout.docx'));
  await buildLesson2Assessment(path.join(r2Dir, 'Lesson_R2_Assessment.docx'));
  await buildLesson2Presentation(path.join(r2Dir, 'Lesson_R2_Presentation.html'));
  
  // Lesson 3 files
  await buildLesson3Handout(path.join(r3Dir, 'Lesson_R3_Handout.docx'));
  await buildLesson3Assessment(path.join(r3Dir, 'Lesson_R3_Assessment.docx'));
  await buildLesson3Presentation(path.join(r3Dir, 'Lesson_R3_Presentation.html'));
  
  console.log("🎉 All natural disaster revision lessons successfully compiled!");
}

run().catch(console.error);
