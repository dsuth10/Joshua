const { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  Table, 
  TableRow, 
  TableCell, 
  ImageRun, 
  WidthType, 
  BorderStyle, 
  ShadingType, 
  AlignmentType, 
  HeadingLevel, 
  VerticalAlign, 
  LevelFormat, 
  PageBreak 
} = require('docx');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const THEME = { 
  navy: '112D4E', 
  orange: 'F96D00', 
  white: 'F9F7F7', 
  blue: '3F72AF',
  grey: 'F0F0F0',
  lightOrange: 'FFF3E0',
  borderGrey: 'CCCCCC'
};

const TEMPLATE_PATH = 'c:\\Users\\dsuth\\Documents\\Joshua\\.agent\\skills\\lesson-creator\\assets\\presentation_template.html';

// Create directories if they do not exist
const baseDir = 'c:\\Users\\dsuth\\Documents\\Joshua\\Units\\Maths\\Converting_Length_Measurements';
const scriptsDir = path.join(baseDir, 'scripts');
if (!fs.existsSync(scriptsDir)) {
  fs.mkdirSync(scriptsDir, { recursive: true });
}

const rulerPath = path.join(baseDir, 'ruler.png');
const handoutPath = path.join(baseDir, 'Converting_Length_Measurements_Handout.docx');
const presentationPath = path.join(baseDir, 'Converting_Length_Measurements_Presentation.html');
const assessmentPath = path.join(baseDir, 'Converting_Length_Measurements_Assessment.docx');

// --- 1. GENERATE RULER GRAPHIC USING SVG AND SHARP ---
async function generateRulerImage(outputPath) {
  const width = 1200;
  const height = 240;
  
  let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">`;
  
  // Background (light cream/gold ruler style)
  svg += `<rect x="2" y="2" width="${width - 4}" height="${height - 4}" fill="#fdf6e2" stroke="#8d7857" stroke-width="4" rx="6" ry="6" />`;
  
  // Ruler ticks
  // x goes from 50 to 1150 (usable width = 1100 px).
  // Ruler is 13.5 cm long. So each cm is 1100 / 13.5 = 81.48 pixels.
  const startX = 50;
  const endX = 1150;
  const totalCm = 13.5;
  const pxPerCm = (endX - startX) / totalCm;
  const pxPerMm = pxPerCm / 10;
  
  const ticksY = 180;
  
  // Draw ruler ticks
  for (let mm = 0; mm <= totalCm * 10; mm++) {
    const x = startX + mm * pxPerMm;
    let tickHeight = 0;
    let strokeWidth = 1;
    
    if (mm % 10 === 0) {
      // Centimetre mark
      tickHeight = 35;
      strokeWidth = 3;
      const cmVal = mm / 10;
      svg += `<text x="${x}" y="${ticksY - tickHeight - 12}" font-family="Arial" font-size="24" font-weight="bold" fill="#000000" text-anchor="middle">${cmVal}</text>`;
    } else if (mm % 5 === 0) {
      // 5 mm mark
      tickHeight = 22;
      strokeWidth = 2;
    } else {
      // 1 mm mark
      tickHeight = 12;
      strokeWidth = 1;
    }
    
    svg += `<line x1="${x}" y1="${ticksY}" x2="${x}" y2="${ticksY - tickHeight}" stroke="#000000" stroke-width="${strokeWidth}" />`;
  }
  
  // Draw horizontal bottom line
  svg += `<line x1="${startX}" y1="${ticksY}" x2="${endX}" y2="${ticksY}" stroke="#000000" stroke-width="3" />`;
  
  // Draw pointers A, B, C, D, E (matching worksheet values)
  const pointers = [
    { label: 'A', value: 2.6 },
    { label: 'B', value: 3.9 },
    { label: 'C', value: 6.4 },
    { label: 'D', value: 9.0 },
    { label: 'E', value: 12.8 }
  ];
  
  pointers.forEach(p => {
    const x = startX + p.value * pxPerCm;
    
    // Vertical indicator line
    svg += `<line x1="${x}" y1="100" x2="${x}" y2="140" stroke="#f96d00" stroke-width="3" />`;
    
    // Draw arrow head
    svg += `<polygon points="${x},145 ${x - 8},133 ${x + 8},133" fill="#f96d00" />`;
    
    // Draw navy circle for label letter
    svg += `<circle cx="${x}" cy="70" r="20" fill="#112d4e" />`;
    
    // Draw label letter inside circle
    svg += `<text x="${x}" y="76" font-family="Arial" font-size="22" font-weight="bold" fill="#ffffff" text-anchor="middle">${p.label}</text>`;
  });
  
  svg += `</svg>`;
  
  const buffer = Buffer.from(svg);
  await sharp(buffer)
    .png()
    .toFile(outputPath);
    
  console.log(`✅ Custom ruler image generated: ${path.basename(outputPath)}`);
}

// --- 2. GENERATE STUDENT HANDOUT (DOCX) ---
async function generateHandout(outputPath) {
  const tableBorder = { style: BorderStyle.SINGLE, size: 4, color: THEME.borderGrey };
  const cellBorders = { top: tableBorder, bottom: tableBorder, left: tableBorder, right: tableBorder };
  
  const doc = new Document({
    styles: {
      default: { document: { run: { font: 'Arial', size: 22 } } },
      paragraphStyles: [
        {
          id: 'TitleStyle',
          name: 'Title Style',
          basedOn: 'Normal',
          run: { size: 36, bold: true, color: THEME.navy },
          paragraph: { spacing: { before: 240, after: 120 }, alignment: AlignmentType.CENTER }
        },
        {
          id: 'Heading1',
          name: 'Heading 1',
          basedOn: 'Normal',
          run: { size: 28, bold: true, color: THEME.navy },
          paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 }
        },
        {
          id: 'Heading2',
          name: 'Heading 2',
          basedOn: 'Normal',
          run: { size: 24, bold: true, color: THEME.orange },
          paragraph: { spacing: { before: 180, after: 120 }, outlineLevel: 1 }
        }
      ]
    },
    sections: [{
      properties: { 
        page: { 
          size: { width: 11906, height: 16838 }, // A4 Dimensions
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } // 1 inch margins (usable width = 9026)
        } 
      },
      children: [
        // Title
        new Paragraph({ style: 'TitleStyle', children: [new TextRun('Converting Length Measurements')] }),
        
        // Metadata Table
        new Table({
          columnWidths: [1800, 7226],
          margins: { top: 100, bottom: 100, left: 150, right: 150 },
          rows: [
            new TableRow({
              children: [
                new TableCell({ width: { size: 1800, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: 'Name:', bold: true })] })] }),
                new TableCell({ width: { size: 7226, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [] })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ width: { size: 1800, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: 'Date / Class:', bold: true })] })] }),
                new TableCell({ width: { size: 7226, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [] })] })
              ]
            })
          ]
        }),
        
        new Paragraph({ spacing: { after: 200 } }),
        
        // Learning rule box
        new Table({
          columnWidths: [9026],
          margins: { top: 150, bottom: 150, left: 200, right: 200 },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 9026, type: WidthType.DXA },
                  borders: {
                    left: { style: BorderStyle.SINGLE, size: 30, color: THEME.orange },
                    top: { style: BorderStyle.NONE },
                    bottom: { style: BorderStyle.NONE },
                    right: { style: BorderStyle.NONE }
                  },
                  shading: { fill: THEME.grey, type: ShadingType.CLEAR },
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({ text: 'Metric Conversion Key Concept: ', bold: true, color: THEME.navy }),
                        new TextRun('To convert millimetres to centimetres, we divide by 10 (shift decimal point 1 place left). ')
                      ]
                    }),
                    new Paragraph({
                      children: [
                        new TextRun('To convert centimetres to metres, we divide by 100 (shift decimal point 2 places left). ')
                      ]
                    }),
                    new Paragraph({
                      children: [
                        new TextRun('To convert metres to centimetres, we multiply by 100 (shift decimal point 2 places right).')
                      ]
                    })
                  ]
                })
              ]
            })
          ]
        }),
        
        // Part 1: Record Lengths
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('Part 1: Reading Ruler Measurements')] }),
        new Paragraph({ children: [new TextRun('Record the lengths shown on the ruler below in both millimetres (mm) and centimetres (cm).')] }),
        new Paragraph({ spacing: { after: 150 } }),
        
        // Embed Ruler Image
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new ImageRun({
            type: 'png',
            data: fs.readFileSync(rulerPath),
            transformation: { width: 550, height: 110 },
            altText: { title: 'Classroom Ruler with Letters A to E', description: 'Interactive ruler with letters A, B, C, D, E', name: 'RulerGraphic' }
          })]
        }),
        new Paragraph({ spacing: { after: 150 } }),
        
        // Ruler Questions Grid
        new Table({
          columnWidths: [1805, 1805, 1805, 1805, 1805],
          margins: { top: 120, bottom: 120, left: 100, right: 100 },
          rows: [
            new TableRow({
              tableHeader: true,
              children: ['A', 'B', 'C', 'D', 'E'].map(letter => (
                new TableCell({
                  width: { size: 1805, type: WidthType.DXA },
                  borders: cellBorders,
                  shading: { fill: THEME.navy, type: ShadingType.CLEAR },
                  verticalAlign: VerticalAlign.CENTER,
                  children: [new Paragraph({ 
                    alignment: AlignmentType.CENTER, 
                    children: [new TextRun({ text: `Point ${letter}`, bold: true, color: THEME.white })] 
                  })]
                })
              ))
            }),
            new TableRow({
              children: Array(5).fill(0).map(() => (
                new TableCell({
                  width: { size: 1805, type: WidthType.DXA },
                  borders: cellBorders,
                  children: [
                    new Paragraph({ spacing: { before: 100, after: 100 }, children: [new TextRun('________ mm')] }),
                    new Paragraph({ spacing: { before: 100, after: 100 }, children: [new TextRun('________ cm')] })
                  ]
                })
              ))
            })
          ]
        }),
        
        new Paragraph({ spacing: { after: 300 } }),
        
        // Part 2: mm to cm
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('Part 2: Use decimal form to write these as centimetres')] }),
        new Table({
          columnWidths: [4513, 4513],
          margins: { top: 100, bottom: 100, left: 150, right: 150 },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 4513, type: WidthType.DXA },
                  children: [
                    new Paragraph({ children: [new TextRun('a)  49 mm  =  __________ cm')] }),
                    new Paragraph({ spacing: { before: 100 }, children: [new TextRun('c)  83 mm  =  __________ cm')] }),
                    new Paragraph({ spacing: { before: 100 }, children: [new TextRun('e)  92 mm  =  __________ cm')] }),
                    new Paragraph({ spacing: { before: 100 }, children: [new TextRun('g)  108 mm =  __________ cm')] })
                  ]
                }),
                new TableCell({
                  width: { size: 4513, type: WidthType.DXA },
                  children: [
                    new Paragraph({ children: [new TextRun('b)  64 mm  =  __________ cm')] }),
                    new Paragraph({ spacing: { before: 100 }, children: [new TextRun('d)  51 mm  =  __________ cm')] }),
                    new Paragraph({ spacing: { before: 100 }, children: [new TextRun('f)  75 mm  =  __________ cm')] }),
                    new Paragraph({ spacing: { before: 100 }, children: [new TextRun('h)  123 mm =  __________ cm')] })
                  ]
                })
              ]
            })
          ]
        }),

        new Paragraph({ children: [new PageBreak()] }), // Clean page break for formatting
        
        // Part 3: cm to m
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('Part 3: Use decimal form to write these as metres')] }),
        new Table({
          columnWidths: [4513, 4513],
          margins: { top: 100, bottom: 100, left: 150, right: 150 },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 4513, type: WidthType.DXA },
                  children: [
                    new Paragraph({ children: [new TextRun('a)  251 cm  =  __________ m')] }),
                    new Paragraph({ spacing: { before: 100 }, children: [new TextRun('c)  375 cm  =  __________ m')] }),
                    new Paragraph({ spacing: { before: 100 }, children: [new TextRun('e)  563 cm  =  __________ m')] }),
                    new Paragraph({ spacing: { before: 100 }, children: [new TextRun('g)  1021 cm =  __________ m')] })
                  ]
                }),
                new TableCell({
                  width: { size: 4513, type: WidthType.DXA },
                  children: [
                    new Paragraph({ children: [new TextRun('b)  829 cm  =  __________ m')] }),
                    new Paragraph({ spacing: { before: 100 }, children: [new TextRun('d)  642 cm  =  __________ m')] }),
                    new Paragraph({ spacing: { before: 100 }, children: [new TextRun('f)  925 cm  =  __________ m')] }),
                    new Paragraph({ spacing: { before: 100 }, children: [new TextRun('h)  1165 cm =  __________ m')] })
                  ]
                })
              ]
            })
          ]
        }),
        
        new Paragraph({ spacing: { after: 300 } }),
        
        // Part 4: m to cm
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('Part 4: Write these as centimetres')] }),
        new Table({
          columnWidths: [4513, 4513],
          margins: { top: 100, bottom: 100, left: 150, right: 150 },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 4513, type: WidthType.DXA },
                  children: [
                    new Paragraph({ children: [new TextRun('a)  3.16 m  =  __________ cm')] }),
                    new Paragraph({ spacing: { before: 100 }, children: [new TextRun('c)  4.65 m  =  __________ cm')] }),
                    new Paragraph({ spacing: { before: 100 }, children: [new TextRun('e)  5.27 m  =  __________ cm')] }),
                    new Paragraph({ spacing: { before: 100 }, children: [new TextRun('g)  7.45 m  =  __________ cm')] })
                  ]
                }),
                new TableCell({
                  width: { size: 4513, type: WidthType.DXA },
                  children: [
                    new Paragraph({ children: [new TextRun('b)  8.31 m  =  __________ cm')] }),
                    new Paragraph({ spacing: { before: 100 }, children: [new TextRun('d)  9.54 m  =  __________ cm')] }),
                    new Paragraph({ spacing: { before: 100 }, children: [new TextRun('f)  2.95 m  =  __________ cm')] }),
                    new Paragraph({ spacing: { before: 100 }, children: [new TextRun('h)  10.75 m =  __________ cm')] })
                  ]
                })
              ]
            })
          ]
        }),
        
        new Paragraph({ spacing: { after: 300 } }),
        
        // Part 5: Choose unit
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('Part 5: Choose the most suitable unit (km, m, cm, mm)')] }),
        new Table({
          columnWidths: [4513, 4513],
          margins: { top: 100, bottom: 100, left: 150, right: 150 },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 4513, type: WidthType.DXA },
                  children: [
                    new Paragraph({ children: [new TextRun('a)  the length of a plane:  ___________')] }),
                    new Paragraph({ spacing: { before: 100 }, children: [new TextRun('c)  the length of a river:  ___________')] }),
                    new Paragraph({ spacing: { before: 100 }, children: [new TextRun('e)  the thickness of a match: _________')] })
                  ]
                }),
                new TableCell({
                  width: { size: 4513, type: WidthType.DXA },
                  children: [
                    new Paragraph({ children: [new TextRun('b)  the width of a road:     ___________')] }),
                    new Paragraph({ spacing: { before: 100 }, children: [new TextRun('d)  the length of a classroom: _________')] }),
                    new Paragraph({ spacing: { before: 100 }, children: [new TextRun('f)  the distance to Perth:   ___________')] })
                  ]
                })
              ]
            })
          ]
        }),
        
        new Paragraph({ spacing: { after: 300 } }),
        
        // Part 6: Order units
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('Part 6: Order Units of Length')] }),
        new Paragraph({ children: [new TextRun('Order m, km, mm, and cm in order from smallest unit to longest unit:')] }),
        new Paragraph({ spacing: { before: 100, after: 150 }, children: [new TextRun('__________________________________________________________________________________')] }),
        
        new Paragraph({ spacing: { after: 300 } }),
        
        // Part 7: Classroom measuring activity
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('Part 7: Classroom Measurement Activity')] }),
        new Paragraph({ children: [new TextRun('Measure objects that are less than 1 m. Estimate their length first, then record your actual measurements in both millimetres and centimetres.')] }),
        new Paragraph({ spacing: { after: 150 } }),
        
        new Table({
          columnWidths: [3500, 1842, 1842, 1842],
          margins: { top: 120, bottom: 120, left: 100, right: 100 },
          rows: [
            new TableRow({
              tableHeader: true,
              children: [
                new TableCell({ width: { size: 3500, type: WidthType.DXA }, borders: cellBorders, shading: { fill: THEME.navy, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Object measurement', bold: true, color: THEME.white })] })] }),
                new TableCell({ width: { size: 1842, type: WidthType.DXA }, borders: cellBorders, shading: { fill: THEME.navy, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Estimate (cm)', bold: true, color: THEME.white })] })] }),
                new TableCell({ width: { size: 1842, type: WidthType.DXA }, borders: cellBorders, shading: { fill: THEME.navy, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Actual (mm)', bold: true, color: THEME.white })] })] }),
                new TableCell({ width: { size: 1842, type: WidthType.DXA }, borders: cellBorders, shading: { fill: THEME.navy, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Actual (cm)', bold: true, color: THEME.white })] })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ width: { size: 3500, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun('pencil sharpener length')] })] }),
                new TableCell({ width: { size: 1842, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun('3 cm')] })] }),
                new TableCell({ width: { size: 1842, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun('26 mm')] })] }),
                new TableCell({ width: { size: 1842, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun('2.6 cm')] })] })
              ]
            }),
            ...Array(3).fill(0).map(() => (
              new TableRow({
                children: [
                  new TableCell({ width: { size: 3500, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [] })] }),
                  new TableCell({ width: { size: 1842, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [] })] }),
                  new TableCell({ width: { size: 1842, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [] })] }),
                  new TableCell({ width: { size: 1842, type: WidthType.DXA }, borders: cellBorders, children: [new Paragraph({ children: [] })] })
                ]
              })
            ))
          ]
        })
      ]
    }]
  });
  
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);
  console.log(`✅ Handout DOCX generated: ${path.basename(outputPath)}`);
}

// --- 3. GENERATE INTERACTIVE PRESENTATION (HTML) ---
function generatePresentation(outputPath) {
  if (!fs.existsSync(TEMPLATE_PATH)) {
    throw new Error(`Template not found at: ${TEMPLATE_PATH}`);
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

  const slidesData = [
    {
      title: 'Converting Length Measurements',
      theme: 'dark',
      subtitle: 'Year 5 Measurement and Geometry',
      standardHtml: `
        <div style="font-size:36px; color:var(--orange); font-weight:bold; margin-bottom:20px;">Welcome to Mathematics!</div>
        <p style="font-size:26px; max-width:800px; margin:0 auto; line-height:1.6;">
          Today we are learning to convert between different units of length (mm, cm, m, and km).
        </p>
      `,
      teacherNotes: `
        <h3>Lesson Introduction</h3>
        <p>Introduce the topic of metric conversions. Read the Learning Intention and Success Criteria.</p>
        <p>Explain that today we are building our procedural fluency in shifting decimals by 10 and 100 to convert length values.</p>
      `
    },
    {
      title: 'Warm-up: Ordering Units',
      theme: 'light',
      standardHtml: `
        <p class="intro-text">Can you arrange these metric length units in order from <strong>smallest to longest</strong>?</p>
        <div class="seq-container" id="slide-2-seq">
          <div class="seq-list" id="slide-2-list">
            <div class="seq-strip" data-index="0" data-correct-idx="2">
              <span class="seq-number">1</span>
              <span class="seq-text">Metres (m)</span>
              <div class="seq-controls">
                <button class="seq-btn seq-up"><svg viewBox="0 0 24 24"><path d="M7 14l5-5 5 5z"/></svg></button>
                <button class="seq-btn seq-down"><svg viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg></button>
              </div>
            </div>
            <div class="seq-strip" data-index="1" data-correct-idx="3">
              <span class="seq-number">2</span>
              <span class="seq-text">Kilometres (km)</span>
              <div class="seq-controls">
                <button class="seq-btn seq-up"><svg viewBox="0 0 24 24"><path d="M7 14l5-5 5 5z"/></svg></button>
                <button class="seq-btn seq-down"><svg viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg></button>
              </div>
            </div>
            <div class="seq-strip" data-index="2" data-correct-idx="0">
              <span class="seq-number">3</span>
              <span class="seq-text">Millimetres (mm)</span>
              <div class="seq-controls">
                <button class="seq-btn seq-up"><svg viewBox="0 0 24 24"><path d="M7 14l5-5 5 5z"/></svg></button>
                <button class="seq-btn seq-down"><svg viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg></button>
              </div>
            </div>
            <div class="seq-strip" data-index="3" data-correct-idx="1">
              <span class="seq-number">4</span>
              <span class="seq-text">Centimetres (cm)</span>
              <div class="seq-controls">
                <button class="seq-btn seq-up"><svg viewBox="0 0 24 24"><path d="M7 14l5-5 5 5z"/></svg></button>
                <button class="seq-btn seq-down"><svg viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg></button>
              </div>
            </div>
          </div>
          <button class="interactive-submit-btn" id="slide-2-submit">Check Order</button>
          <div class="interactive-feedback" id="slide-2-feedback"></div>
          <div class="hint-box" id="slide-2-hint">
            <strong>Hint:</strong> Think about which unit is used for tiny insects (mm) vs. measuring distances between cities (km).
          </div>
        </div>
        
        <script>
          (function() {
            const list = document.getElementById('slide-2-list');
            const submitBtn = document.getElementById('slide-2-submit');
            const feedback = document.getElementById('slide-2-feedback');
            const hint = document.getElementById('slide-2-hint');
            let mistakesCount = 0;
            
            function updateNumbers() {
              const strips = list.querySelectorAll('.seq-strip');
              strips.forEach((strip, i) => {
                strip.querySelector('.seq-number').innerText = i + 1;
              });
            }
            
            list.addEventListener('click', function(e) {
              const btn = e.target.closest('.seq-btn');
              if (!btn) return;
              
              const strip = btn.closest('.seq-strip');
              const isUp = btn.classList.contains('seq-up');
              
              if (isUp && strip.previousElementSibling) {
                list.insertBefore(strip, strip.previousElementSibling);
              } else if (!isUp && strip.nextElementSibling) {
                list.insertBefore(strip.nextElementSibling, strip);
              }
              updateNumbers();
              e.stopPropagation();
            });
            
            submitBtn.addEventListener('click', function() {
              const strips = Array.from(list.querySelectorAll('.seq-strip'));
              let allCorrect = true;
              
              strips.forEach((strip, idx) => {
                const correctIdx = parseInt(strip.getAttribute('data-correct-idx'));
                if (correctIdx === idx) {
                  strip.classList.remove('incorrect-seq');
                  strip.classList.add('correct-seq');
                } else {
                  strip.classList.remove('correct-seq');
                  strip.classList.add('incorrect-seq');
                  allCorrect = false;
                  // shake incorrect elements
                  strip.style.animation = 'none';
                  setTimeout(() => { strip.style.animation = 'shake 0.4s ease'; }, 10);
                }
              });
              
              if (allCorrect) {
                feedback.innerHTML = '<span style="color:var(--green-success)">✓ Fantastic! That is the correct order from smallest to longest.</span>';
                hint.style.display = 'none';
              } else {
                mistakesCount++;
                feedback.innerHTML = '<span style="color:var(--red-error)">Try again! Some units are out of order.</span>';
                if (mistakesCount >= 2) {
                  hint.style.display = 'block';
                }
              }
            });
            
            document.getElementById('slide-2').addEventListener('show-answer', function() {
              const strips = Array.from(list.querySelectorAll('.seq-strip'));
              strips.sort((a, b) => parseInt(a.getAttribute('data-correct-idx')) - parseInt(b.getAttribute('data-correct-idx')));
              strips.forEach(s => list.appendChild(s));
              updateNumbers();
              list.querySelectorAll('.seq-strip').forEach(s => {
                s.classList.remove('incorrect-seq');
                s.classList.add('correct-seq');
              });
              feedback.innerHTML = '<span style="color:var(--green-success)">Answer revealed: Millimetres (mm) &lt; Centimetres (cm) &lt; Metres (m) &lt; Kilometres (km)</span>';
              hint.style.display = 'none';
            });
          })();
        </script>
      `,
      teacherNotes: `
        <h3>Warm-up Guide</h3>
        <p>Ask students to discuss: Which unit is smallest? Which is longest?</p>
        <p>Let them write the order on their mini-whiteboards before solving it together on the smartboard.</p>
      `
    },
    {
      title: 'Understanding Metric Length Units',
      theme: 'light',
      standardHtml: `
        <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap:20px; margin-top:20px;">
          <div style="background:#e3f2fd; border-left:8px solid #1e88e5; padding:20px; border-radius:8px; box-shadow:var(--shadow-sm);">
            <h3 style="color:#0d47a1; font-size:28px; margin-bottom:10px;">Millimetre (mm)</h3>
            <p style="font-size:22px; line-height:1.4;">Used for tiny things. Think of the thickness of a small coin or a pencil lead. <br><strong>$10\\text{ mm} = 1\\text{ cm}$</strong></p>
          </div>
          <div style="background:#fff3e0; border-left:8px solid #fb8c00; padding:20px; border-radius:8px; box-shadow:var(--shadow-sm);">
            <h3 style="color:#e65100; font-size:28px; margin-bottom:10px;">Centimetre (cm)</h3>
            <p style="font-size:22px; line-height:1.4;">Used for everyday items. Think of the length of a pen or the width of a phone. <br><strong>$100\\text{ cm} = 1\\text{ m}$</strong></p>
          </div>
          <div style="background:#e8f5e9; border-left:8px solid #4caf50; padding:20px; border-radius:8px; box-shadow:var(--shadow-sm);">
            <h3 style="color:#1b5e20; font-size:28px; margin-bottom:10px;">Metre (m)</h3>
            <p style="font-size:22px; line-height:1.4;">Used for larger scale spaces. Think of classroom height or the width of a street. <br><strong>$1000\\text{ m} = 1\\text{ km}$</strong></p>
          </div>
          <div style="background:#f3e5f5; border-left:8px solid #ab47bc; padding:20px; border-radius:8px; box-shadow:var(--shadow-sm);">
            <h3 style="color:#4a148c; font-size:28px; margin-bottom:10px;">Kilometre (km)</h3>
            <p style="font-size:22px; line-height:1.4;">Used for long distances. Think of distances between towns or the length of a river.</p>
          </div>
        </div>
      `,
      teacherNotes: `
        <h3>Direct Instruction</h3>
        <p>Explicitly point out the scale differences. Highlight that the metric system is base 10, meaning conversions involve multiplying or dividing by 10, 100, or 1000.</p>
      `
    },
    {
      title: 'Converting mm to cm (Divide by 10)',
      theme: 'light',
      standardHtml: `
        <div style="display:flex; gap:30px; align-items:center; margin-top:20px;">
          <div style="flex:1;">
            <p class="intro-text">Since there are <strong>10 millimetres</strong> in <strong>1 centimetre</strong>, we can convert by dividing by 10.</p>
            <div class="remember-box">
              <span style="color:var(--orange); font-weight:bold; font-size:28px;">To convert mm to cm:</span><br>
              Divide the number of millimetres by <strong>10</strong>.<br>
              <em>Rule: Move the decimal point one place to the left.</em>
            </div>
            <div style="background:#eef2f6; padding:20px; border-radius:6px; margin-top:20px; font-size:24px;">
              <strong>Examples:</strong><br>
              • $34\\text{ mm} \\rightarrow 34 \\div 10 = \\mathbf{3.4\\text{ cm}}$<br>
              • $26\\text{ mm} \\rightarrow 26 \\div 10 = \\mathbf{2.6\\text{ cm}}$
            </div>
          </div>
          <div style="width:300px; background:#fff3e0; border:2px solid var(--orange); border-radius:12px; padding:24px; text-align:center; box-shadow:var(--shadow-md);">
            <div style="font-size:80px; line-height:1;">👑</div>
            <div style="font-size:26px; font-weight:bold; color:var(--navy); margin-top:15px;">Mascot Rule</div>
            <p style="font-size:20px; margin-top:10px; line-height:1.4;">"Just like the king says, $34\\text{ mm}$ splits into $3.4\\text{ cm}$!"</p>
            <div style="background:var(--navy); color:#fff; border-radius:6px; padding:10px; margin-top:15px; font-weight:bold; font-size:22px;">$34 \\div 10 = 3.4$</div>
          </div>
        </div>
      `,
      teacherNotes: `
        <h3>Dividing by 10</h3>
        <p>Explain that dividing by 10 shifts place value. Every digit moves one place to the right, which visually looks like shifting the decimal point one place to the left.</p>
      `
    },
    {
      title: 'Reading Measurements on a Ruler',
      theme: 'light',
      standardHtml: `
        <p class="intro-text" style="margin-bottom:10px;">Look at the ruler below. Let's find the values for A, B, C, D, and E.</p>
        <div style="text-align:center; margin-bottom:20px;">
          <img src="ruler.png" id="slide-5-ruler-img" style="max-height: 200px; width: auto; border: 1px solid #e2e8f0; border-radius: 6px; box-shadow: var(--shadow-sm);" alt="Measuring Ruler">
        </div>
        
        <div style="display:grid; grid-template-columns: repeat(5, 1fr); gap:15px; text-align:center;">
          <div style="background:#eef2f6; border:2px solid var(--navy); border-radius:8px; padding:12px; cursor:pointer;" class="reveal-card" data-ans="A: 26 mm = 2.6 cm">
            <div style="width:36px; height:36px; border-radius:50%; background:var(--navy); color:#fff; display:flex; align-items:center; justify-content:center; margin:0 auto 10px; font-weight:bold; font-size:20px;">A</div>
            <div class="reveal-content" style="font-weight:bold; font-size:20px; color:#555;">Click to reveal</div>
          </div>
          <div style="background:#eef2f6; border:2px solid var(--navy); border-radius:8px; padding:12px; cursor:pointer;" class="reveal-card" data-ans="B: 39 mm = 3.9 cm">
            <div style="width:36px; height:36px; border-radius:50%; background:var(--navy); color:#fff; display:flex; align-items:center; justify-content:center; margin:0 auto 10px; font-weight:bold; font-size:20px;">B</div>
            <div class="reveal-content" style="font-weight:bold; font-size:20px; color:#555;">Click to reveal</div>
          </div>
          <div style="background:#eef2f6; border:2px solid var(--navy); border-radius:8px; padding:12px; cursor:pointer;" class="reveal-card" data-ans="C: 64 mm = 6.4 cm">
            <div style="width:36px; height:36px; border-radius:50%; background:var(--navy); color:#fff; display:flex; align-items:center; justify-content:center; margin:0 auto 10px; font-weight:bold; font-size:20px;">C</div>
            <div class="reveal-content" style="font-weight:bold; font-size:20px; color:#555;">Click to reveal</div>
          </div>
          <div style="background:#eef2f6; border:2px solid var(--navy); border-radius:8px; padding:12px; cursor:pointer;" class="reveal-card" data-ans="D: 90 mm = 9.0 cm">
            <div style="width:36px; height:36px; border-radius:50%; background:var(--navy); color:#fff; display:flex; align-items:center; justify-content:center; margin:0 auto 10px; font-weight:bold; font-size:20px;">D</div>
            <div class="reveal-content" style="font-weight:bold; font-size:20px; color:#555;">Click to reveal</div>
          </div>
          <div style="background:#eef2f6; border:2px solid var(--navy); border-radius:8px; padding:12px; cursor:pointer;" class="reveal-card" data-ans="E: 128 mm = 12.8 cm">
            <div style="width:36px; height:36px; border-radius:50%; background:var(--navy); color:#fff; display:flex; align-items:center; justify-content:center; margin:0 auto 10px; font-weight:bold; font-size:20px;">E</div>
            <div class="reveal-content" style="font-weight:bold; font-size:20px; color:#555;">Click to reveal</div>
          </div>
        </div>
        
        <script>
          (function() {
            const cards = document.querySelectorAll('.reveal-card');
            cards.forEach(card => {
              card.addEventListener('click', function() {
                const content = card.querySelector('.reveal-content');
                const answer = card.getAttribute('data-ans');
                content.innerText = answer;
                content.style.color = 'var(--green-success)';
                card.style.borderColor = 'var(--green-success)';
              });
            });
            
            document.getElementById('slide-5').addEventListener('show-answer', function() {
              cards.forEach(card => {
                const content = card.querySelector('.reveal-content');
                content.innerText = card.getAttribute('data-ans');
                content.style.color = 'var(--green-success)';
                card.style.borderColor = 'var(--green-success)';
              });
            });
          })();
        </script>
      `,
      teacherNotes: `
        <h3>Ruler Demonstration</h3>
        <p>Ask a student to come up and show where Point A is. Have the class call out the mm value (26 mm) and cm value (2.6 cm).</p>
        <p>Click each card to reveal and verify student answers.</p>
      `
    },
    {
      title: 'CFU: Converting mm to cm',
      theme: 'light',
      standardHtml: `
        <span class="cfu-badge" style="position:absolute; top:25px; left:400px; display:inline-block; background:var(--orange); color:white; padding:4px 12px; border-radius:15px; font-size:16px; font-weight:bold;">CFU - Whiteboard Option</span>
        <p class="intro-text">Match the millimetre measurements on the left with their centimetre conversions on the right.</p>
        
        <div class="match-container" id="slide-6-match">
          <div class="match-cols-grid">
            <div class="match-col" id="slide-6-left">
              <div class="match-card" data-match="1">49 mm</div>
              <div class="match-card" data-match="2">83 mm</div>
              <div class="match-card" data-match="3">108 mm</div>
              <div class="match-card" data-match="4">123 mm</div>
            </div>
            <div class="match-col" id="slide-6-right">
              <div class="match-card" data-match="2">8.3 cm</div>
              <div class="match-card" data-match="4">12.3 cm</div>
              <div class="match-card" data-match="1">4.9 cm</div>
              <div class="match-card" data-match="3">10.8 cm</div>
            </div>
          </div>
          <div class="interactive-feedback" id="slide-6-feedback" style="margin-top:15px;"></div>
          <div class="hint-box" id="slide-6-hint">
            <strong>Hint:</strong> Remember, divide by 10. E.g., $49 \\div 10 = 4.9$.
          </div>
        </div>
        
        <script>
          (function() {
            const container = document.getElementById('slide-6-match');
            const leftCol = document.getElementById('slide-6-left');
            const rightCol = document.getElementById('slide-6-right');
            const feedback = document.getElementById('slide-6-feedback');
            const hint = document.getElementById('slide-6-hint');
            
            let selectedLeft = null;
            let selectedRight = null;
            let matchedCount = 0;
            let mistakesCount = 0;
            
            leftCol.addEventListener('click', function(e) {
              const card = e.target.closest('.match-card');
              if (!card || card.classList.contains('matched')) return;
              
              leftCol.querySelectorAll('.match-card').forEach(c => c.classList.remove('selected'));
              card.classList.add('selected');
              selectedLeft = card;
              checkMatch();
            });
            
            rightCol.addEventListener('click', function(e) {
              const card = e.target.closest('.match-card');
              if (!card || card.classList.contains('matched')) return;
              
              rightCol.querySelectorAll('.match-card').forEach(c => c.classList.remove('selected'));
              card.classList.add('selected');
              selectedRight = card;
              checkMatch();
            });
            
            function checkMatch() {
              if (!selectedLeft || !selectedRight) return;
              
              const idLeft = selectedLeft.getAttribute('data-match');
              const idRight = selectedRight.getAttribute('data-match');
              
              if (idLeft === idRight) {
                selectedLeft.classList.remove('selected');
                selectedRight.classList.remove('selected');
                selectedLeft.classList.add('matched');
                selectedRight.classList.add('matched');
                
                matchedCount++;
                feedback.innerHTML = '<span style="color:var(--green-success)">Correct match!</span>';
                
                selectedLeft = null;
                selectedRight = null;
                
                if (matchedCount === 4) {
                  feedback.innerHTML = '<span style="color:var(--green-success)">✓ All pairs matched successfully!</span>';
                  hint.style.display = 'none';
                }
              } else {
                mistakesCount++;
                selectedLeft.classList.add('incorrect-match');
                selectedRight.classList.add('incorrect-match');
                feedback.innerHTML = '<span style="color:var(--red-error)">Not a match! Try again.</span>';
                
                const tempLeft = selectedLeft;
                const tempRight = selectedRight;
                
                setTimeout(() => {
                  tempLeft.classList.remove('selected', 'incorrect-match');
                  tempRight.classList.remove('selected', 'incorrect-match');
                }, 500);
                
                selectedLeft = null;
                selectedRight = null;
                
                if (mistakesCount >= 2) {
                  hint.style.display = 'block';
                }
              }
            }
            
            document.getElementById('slide-6').addEventListener('show-answer', function() {
              leftCol.querySelectorAll('.match-card').forEach(c => {
                c.classList.add('matched');
                c.classList.remove('selected');
              });
              rightCol.querySelectorAll('.match-card').forEach(c => {
                c.classList.add('matched');
                c.classList.remove('selected');
              });
              feedback.innerHTML = '<span style="color:var(--green-success)">Answer revealed: All matched!</span>';
              hint.style.display = 'none';
            });
          })();
        </script>
      `,
      teacherNotes: `
        <h3>CFU Checklist</h3>
        <p>Conduct a whiteboard check before clicking digital items. Ask: "What is 83 mm in cm?"</p>
        <p>Select pairs to check student understanding of decimal point placement.</p>
      `
    },
    {
      title: 'Converting cm to m (Divide by 100)',
      theme: 'light',
      standardHtml: `
        <div style="display:flex; gap:30px; align-items:center; margin-top:20px;">
          <div style="flex:1;">
            <p class="intro-text">Since there are <strong>100 centimetres</strong> in <strong>1 metre</strong>, we divide by 100 to convert.</p>
            <div class="remember-box" style="border-left-color:var(--blue);">
              <span style="color:var(--blue); font-weight:bold; font-size:28px;">To convert cm to m:</span><br>
              Divide the number of centimetres by <strong>100</strong>.<br>
              <em>Rule: Move the decimal point two places to the left.</em>
            </div>
            <div style="background:#eef2f6; padding:20px; border-radius:6px; margin-top:20px; font-size:24px;">
              <strong>Examples:</strong><br>
              • $251\\text{ cm} \\rightarrow 251 \\div 100 = \\mathbf{2.51\\text{ m}}$<br>
              • $829\\text{ cm} \\rightarrow 829 \\div 100 = \\mathbf{8.29\\text{ m}}$<br>
              • $1165\\text{ cm} \\rightarrow 1165 \\div 100 = \\mathbf{11.65\\text{ m}}$
            </div>
          </div>
          <div style="width:300px; background:#e3f2fd; border:2px solid var(--blue); border-radius:12px; padding:24px; text-align:center; box-shadow:var(--shadow-md);">
            <div style="font-size:80px; line-height:1;">💡</div>
            <div style="font-size:26px; font-weight:bold; color:var(--navy); margin-top:15px;">Decimals Shift</div>
            <p style="font-size:20px; margin-top:10px; line-height:1.4;">"Dividing by 100 means shifting the decimal point 2 positions left."</p>
            <div style="background:var(--navy); color:#fff; border-radius:6px; padding:10px; margin-top:15px; font-weight:bold; font-size:22px;">$100\\text{ cm} = 1\\text{ m}$</div>
          </div>
        </div>
      `,
      teacherNotes: `
        <h3>Dividing by 100</h3>
        <p>Remind students that dividing by 100 is equivalent to two steps of dividing by 10. The decimal point shifts two places left.</p>
        <p>Ask: "How many metres are in 500 cm?" to check the baseline.</p>
      `
    },
    {
      title: 'Converting m to cm (Multiply by 100)',
      theme: 'light',
      standardHtml: `
        <div style="display:flex; gap:30px; align-items:center; margin-top:20px;">
          <div style="flex:1;">
            <p class="intro-text">To convert from a larger unit (metres) to a smaller unit (centimetres), we multiply by 100.</p>
            <div class="remember-box" style="background:#fffde7; border-left-color:var(--orange);">
              <span style="color:var(--orange); font-weight:bold; font-size:28px;">To convert m to cm:</span><br>
              Multiply the number of metres by <strong>100</strong>.<br>
              <em>Rule: Move the decimal point two places to the right.</em>
            </div>
            <div style="background:#eef2f6; padding:20px; border-radius:6px; margin-top:20px; font-size:24px;">
              <strong>Examples:</strong><br>
              • $3.16\\text{ m} \\rightarrow 3.16 \\times 100 = \\mathbf{316\\text{ cm}}$<br>
              • $9.54\\text{ m} \\rightarrow 9.54 \\times 100 = \\mathbf{954\\text{ cm}}$<br>
              • $10.75\\text{ m} \\rightarrow 10.75 \\times 100 = \\mathbf{1075\\text{ cm}}$
            </div>
          </div>
          <div style="width:300px; background:#fff9db; border:2px solid #fcc419; border-radius:12px; padding:24px; text-align:center; box-shadow:var(--shadow-md);">
            <div style="font-size:80px; line-height:1;">⚡</div>
            <div style="font-size:26px; font-weight:bold; color:var(--navy); margin-top:15px;">Inverse Operation</div>
            <p style="font-size:20px; margin-top:10px; line-height:1.4;">"Going from large unit to small unit? We multiply!"</p>
            <div style="background:var(--navy); color:#fff; border-radius:6px; padding:10px; margin-top:15px; font-weight:bold; font-size:22px;">$\\times 100$</div>
          </div>
        </div>
      `,
      teacherNotes: `
        <h3>Multiplying by 100</h3>
        <p>Discuss the visual shift. When multiplying, the number becomes larger, so the decimal point moves to the right.</p>
        <p>Give simple mental checks: "What is 2m in cm? What about 2.5m?"</p>
      `
    },
    {
      title: 'CFU: Conversions Challenge',
      theme: 'light',
      standardHtml: `
        <span class="cfu-badge" style="position:absolute; top:25px; left:450px; display:inline-block; background:var(--orange); color:white; padding:4px 12px; border-radius:15px; font-size:16px; font-weight:bold;">CFU - Whiteboard Option</span>
        <p class="intro-text">Fill in the blanks to complete the metric conversions.</p>
        
        <div class="cloze-container" id="slide-9-cloze">
          <div class="cloze-text">
            1. $375\\text{ cm} =$ 
            <span class="cloze-blank" data-ans="3.75" id="blank-1">Click to select</span> $\\text{ m}$<br>
            
            2. $563\\text{ cm} =$ 
            <span class="cloze-blank" data-ans="5.63" id="blank-2">Click to select</span> $\\text{ m}$<br>
            
            3. $5.27\\text{ m} =$ 
            <span class="cloze-blank" data-ans="527" id="blank-3">Click to select</span> $\\text{ cm}$<br>
            
            4. $10.75\\text{ m} =$ 
            <span class="cloze-blank" data-ans="1075" id="blank-4">Click to select</span> $\\text{ cm}$
          </div>
          
          <div class="cloze-options-pool" id="slide-9-pool">
            <div class="cloze-option" data-val="3.75">3.75</div>
            <div class="cloze-option" data-val="527">527</div>
            <div class="cloze-option" data-val="5.63">5.63</div>
            <div class="cloze-option" data-val="1075">1075</div>
            <div class="cloze-option" data-val="37.5">37.5</div>
          </div>
          
          <div class="interactive-feedback" id="slide-9-feedback"></div>
          <div class="hint-box" id="slide-9-hint">
            <strong>Hint:</strong> Remember, divide by 100 for cm to m, and multiply by 100 for m to cm.
          </div>
        </div>
        
        <script>
          (function() {
            const container = document.getElementById('slide-9-cloze');
            const blanks = container.querySelectorAll('.cloze-blank');
            const options = container.querySelectorAll('.cloze-option');
            const feedback = document.getElementById('slide-9-feedback');
            const hint = document.getElementById('slide-9-hint');
            
            let activeBlank = null;
            let mistakesCount = 0;
            
            blanks.forEach(blank => {
              blank.addEventListener('click', function() {
                if (blank.classList.contains('correct-blank')) return;
                blanks.forEach(b => b.classList.remove('active-blank'));
                blank.classList.add('active-blank');
                activeBlank = blank;
              });
            });
            
            options.forEach(option => {
              option.addEventListener('click', function() {
                if (!activeBlank) {
                  feedback.innerHTML = '<span style="color:var(--red-error)">Please click a blank space first!</span>';
                  return;
                }
                
                const val = option.getAttribute('data-val');
                const ans = activeBlank.getAttribute('data-ans');
                
                activeBlank.innerText = val;
                activeBlank.classList.remove('active-blank');
                
                if (val === ans) {
                  activeBlank.classList.add('correct-blank');
                  activeBlank.classList.remove('incorrect-blank');
                  feedback.innerHTML = '<span style="color:var(--green-success)">Correct!</span>';
                  activeBlank = null;
                  checkAllDone();
                } else {
                  mistakesCount++;
                  activeBlank.classList.add('incorrect-blank');
                  feedback.innerHTML = '<span style="color:var(--red-error)">Try again!</span>';
                  activeBlank = null;
                  
                  if (mistakesCount >= 2) {
                    hint.style.display = 'block';
                  }
                }
              });
            });
            
            function checkAllDone() {
              const allCorrect = Array.from(blanks).every(b => b.classList.contains('correct-blank'));
              if (allCorrect) {
                feedback.innerHTML = '<span style="color:var(--green-success)">✓ Conversions complete! Excellent work.</span>';
                hint.style.display = 'none';
              }
            }
            
            document.getElementById('slide-9').addEventListener('show-answer', function() {
              blanks.forEach(b => {
                b.innerText = b.getAttribute('data-ans');
                b.classList.add('correct-blank');
                b.classList.remove('active-blank', 'incorrect-blank');
              });
              feedback.innerHTML = '<span style="color:var(--green-success)">Answers revealed!</span>';
              hint.style.display = 'none';
            });
          })();
        </script>
      `,
      teacherNotes: `
        <h3>CFU Conversions</h3>
        <p>Check student work on whiteboards. Have them display their responses to matching decimals.</p>
        <p>Ensure students note the shift direction when dividing vs multiplying.</p>
      `
    },
    {
      title: 'Choosing the Most Suitable Unit',
      theme: 'light',
      standardHtml: `
        <p class="intro-text">Match the items to their most appropriate measurement unit.</p>
        
        <div class="sort-container" id="slide-10-sort">
          <div class="sort-deck" id="slide-10-deck">
            <div class="sort-card" data-cat="m" id="card-1">Length of a plane</div>
            <div class="sort-card" data-cat="m" id="card-2">Width of a road</div>
            <div class="sort-card" data-cat="km" id="card-3">Length of a river</div>
            <div class="sort-card" data-cat="mm" id="card-5">Thickness of a match</div>
            <div class="sort-card" data-cat="km" id="card-6">Distance to Perth</div>
            <div class="sort-card" data-cat="m" id="card-4">Length of a classroom</div>
          </div>
          
          <div class="sort-zones-grid">
            <div class="sort-zone" id="zone-mm" data-zone="mm">
              <div class="sort-zone-header">Millimetres (mm)</div>
            </div>
            <div class="sort-zone" id="zone-m" data-zone="m">
              <div class="sort-zone-header">Metres (m)</div>
            </div>
            <div class="sort-zone" id="zone-km" data-zone="km">
              <div class="sort-zone-header">Kilometres (km)</div>
            </div>
          </div>
          
          <div class="interactive-feedback" id="slide-10-feedback"></div>
          <div class="hint-box" id="slide-10-hint">
            <strong>Hint:</strong> Kilometres (km) are for long distances. Metres (m) are for building scale. Millimetres (mm) are for tiny objects.
          </div>
        </div>
        
        <script>
          (function() {
            const container = document.getElementById('slide-10-sort');
            const deck = document.getElementById('slide-10-deck');
            const cards = container.querySelectorAll('.sort-card');
            const zones = container.querySelectorAll('.sort-zone');
            const feedback = document.getElementById('slide-10-feedback');
            const hint = document.getElementById('slide-10-hint');
            
            let selectedCard = null;
            let mistakesCount = 0;
            
            cards.forEach(card => {
              card.addEventListener('click', function() {
                cards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                selectedCard = card;
                
                zones.forEach(z => z.classList.add('active-target'));
              });
            });
            
            zones.forEach(zone => {
              zone.addEventListener('click', function() {
                if (!selectedCard) return;
                
                const cardCat = selectedCard.getAttribute('data-cat');
                const zoneCat = zone.getAttribute('data-zone');
                
                zones.forEach(z => z.classList.remove('active-target'));
                
                if (cardCat === zoneCat) {
                  zone.appendChild(selectedCard);
                  selectedCard.classList.remove('selected');
                  selectedCard.classList.add('correct-placed');
                  selectedCard = null;
                  feedback.innerHTML = '<span style="color:var(--green-success)">Correct placement!</span>';
                  checkAllPlaced();
                } else {
                  mistakesCount++;
                  selectedCard.classList.remove('selected');
                  // Shake card
                  selectedCard.style.animation = 'none';
                  const temp = selectedCard;
                  setTimeout(() => { temp.style.animation = 'shake 0.4s ease'; }, 10);
                  selectedCard = null;
                  feedback.innerHTML = '<span style="color:var(--red-error)">Try a different unit!</span>';
                  
                  if (mistakesCount >= 2) {
                    hint.style.display = 'block';
                  }
                }
              });
            });
            
            function checkAllPlaced() {
              const remaining = deck.querySelectorAll('.sort-card').length;
              if (remaining === 0) {
                feedback.innerHTML = '<span style="color:var(--green-success)">✓ All objects sorted successfully!</span>';
                hint.style.display = 'none';
              }
            }
            
            document.getElementById('slide-10').addEventListener('show-answer', function() {
              cards.forEach(c => {
                const cat = c.getAttribute('data-cat');
                const targetZone = container.querySelector('#zone-' + cat);
                if (targetZone) {
                  targetZone.appendChild(c);
                  c.classList.add('correct-placed');
                  c.classList.remove('selected');
                }
              });
              feedback.innerHTML = '<span style="color:var(--green-success)">Answers revealed: Sorted by size!</span>';
              hint.style.display = 'none';
            });
          })();
        </script>
      `,
      teacherNotes: `
        <h3>Sorting Application</h3>
        <p>Ask: "Why do we measure the length of a river in km? What if we used mm?"</p>
        <p>Check that students understand the magnitude scale of mm, m, and km.</p>
      `
    },
    {
      title: 'Classroom Measuring Activity',
      theme: 'light',
      standardHtml: `
        <div style="display:flex; gap:30px; align-items:center; margin-top:20px;">
          <div style="flex:1;">
            <p class="intro-text">Now it's time to put your conversion skills to the test!</p>
            <div class="remember-box" style="background:#eef2f6; border-left-color:var(--navy);">
              <strong>Instructions:</strong><br>
              1. Work in pairs to find objects around the room.<br>
              2. Estimate the object length first.<br>
              3. Measure the object using a ruler.<br>
              4. Record the length in **both millimetres and centimetres**!
            </div>
          </div>
          <table style="width:400px; border-collapse:collapse; font-size:20px; border:2px solid var(--navy);">
            <thead>
              <tr style="background:var(--navy); color:#fff;">
                <th style="padding:10px; border:1px solid #fff;">Object</th>
                <th style="padding:10px; border:1px solid #fff;">mm</th>
                <th style="padding:10px; border:1px solid #fff;">cm</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding:10px; border:1px solid var(--navy);">pencil sharpener</td>
                <td style="padding:10px; border:1px solid var(--navy);">26 mm</td>
                <td style="padding:10px; border:1px solid var(--navy);">2.6 cm</td>
              </tr>
              <tr>
                <td style="padding:10px; border:1px solid var(--navy);">eraser length</td>
                <td style="padding:10px; border:1px solid var(--navy);">______ mm</td>
                <td style="padding:10px; border:1px solid var(--navy);">______ cm</td>
              </tr>
              <tr>
                <td style="padding:10px; border:1px solid var(--navy);">glue stick</td>
                <td style="padding:10px; border:1px solid var(--navy);">______ mm</td>
                <td style="padding:10px; border:1px solid var(--navy);">______ cm</td>
              </tr>
            </tbody>
          </table>
        </div>
      `,
      teacherNotes: `
        <h3>Hands-on Activity Guide</h3>
        <p>Ensure each student has a metric ruler.</p>
        <p>Remind them to look at the zero line on the ruler, as many rulers have a gap before zero.</p>
        <p>Circulate and support students with conversions between millimetres and centimetres.</p>
      `
    },
    {
      title: 'Exit Ticket',
      theme: 'dark',
      standardHtml: `
        <div style="max-width:800px; margin:0 auto; text-align:left;">
          <p style="font-size:28px; text-align:center; color:var(--orange); font-weight:bold; margin-bottom:30px;">Show what you have learned!</p>
          <div style="background:rgba(255,255,255,0.1); padding:25px; border-radius:8px; font-size:24px; line-height:1.8;">
            1. Convert $64\\text{ mm}$ to centimetres: __________ cm<br>
            2. Convert $1021\\text{ cm}$ to metres: __________ m<br>
            3. Convert $2.95\\text{ m}$ to centimetres: __________ cm
          </div>
        </div>
      `,
      teacherNotes: `
        <h3>Consolidation Checklist</h3>
        <p>Check exit ticket responses before dismissal.</p>
        <p>Identify students who need additional assistance on converting by 10 and 100.</p>
      `
    }
  ];

  let slidesHtml = '';
  
  slidesData.forEach((slide, idx) => {
    let slideClass = `slide theme-${slide.theme || 'light'}`;
    if (idx === 0) slideClass += ' active';
    
    let slideMarkup = `    <!-- SLIDE ${idx + 1}: ${slide.title} -->\n`;
    slideMarkup += `    <section class="${slideClass}" id="slide-${idx + 1}">\n`;
    
    if (slide.theme === 'dark') {
      slideMarkup += `      <div class="fade-in-up">\n        <h1>${slide.title}</h1>\n      </div>\n`;
      if (slide.subtitle) {
        slideMarkup += `      <div class="fade-in-up delay-1">\n        <p class="subtitle" style="font-size:26px; color:var(--text-light); margin-top:20px;">${slide.subtitle}</p>\n      </div>\n`;
      }
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
  
  // Set title on wrapper
  compiledContent = compiledContent.replace('<title>Classroom Presentation Template</title>', '<title>Converting Length Measurements</title>');
  
  fs.writeFileSync(outputPath, compiledContent, 'utf8');
  console.log(`✅ Interactive HTML Presentation generated: ${path.basename(outputPath)}`);
}

// --- 4. GENERATE MS FORMS ASSESSMENT (DOCX) ---
async function generateAssessment(outputPath) {
  const doc = new Document({
    styles: {
      default: { document: { run: { font: 'Arial', size: 22 } } },
      paragraphStyles: [
        {
          id: 'TitleStyle',
          name: 'Title Style',
          basedOn: 'Normal',
          run: { size: 32, bold: true, color: THEME.navy },
          paragraph: { spacing: { before: 240, after: 240 }, alignment: AlignmentType.CENTER }
        }
      ]
    },
    sections: [{
      properties: {
        page: {
          size: { width: 11906, height: 16838 }, // A4
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
        }
      },
      children: [
        new Paragraph({ style: 'TitleStyle', children: [new TextRun('Assessment: Converting Length Measurements (Forms Import)')] }),
        new Paragraph({ children: [new TextRun('This quiz is formatted for direct import into Microsoft Forms.')] }),
        new Paragraph({ spacing: { after: 300 } }),

        // Questions formatted for MS Forms:
        // Question
        // A) ...
        // B) ...
        // C) ...
        // D) ...
        // ANS: Option
        ...createFormsQuestion(1, 'Convert 34 mm to centimetres:', '3.4 cm', ['0.34 cm', '3.4 cm', '34 cm', '340 cm'], 'B'),
        ...createFormsQuestion(2, 'Convert 49 mm to centimetres:', '4.9 cm', ['490 cm', '49 cm', '4.9 cm', '0.49 cm'], 'C'),
        ...createFormsQuestion(3, 'Convert 108 mm to centimetres:', '10.8 cm', ['1.08 cm', '10.8 cm', '108 cm', '10.8 mm'], 'B'),
        ...createFormsQuestion(4, 'Convert 251 cm to metres:', '2.51 m', ['25.1 m', '251 m', '2.51 m', '0.251 m'], 'C'),
        ...createFormsQuestion(5, 'Convert 1165 cm to metres:', '11.65 m', ['11.65 m', '1.165 m', '116.5 m', '1165 m'], 'A'),
        ...createFormsQuestion(6, 'Convert 3.16 m to centimetres:', '316 cm', ['0.316 cm', '31.6 cm', '316 cm', '3160 cm'], 'C'),
        ...createFormsQuestion(7, 'Convert 10.75 m to centimetres:', '1075 cm', ['107.5 cm', '1075 cm', '10.75 cm', '10750 cm'], 'B'),
        ...createFormsQuestion(8, 'Choose the most suitable unit to measure the length of a river:', 'km', ['mm', 'cm', 'm', 'km'], 'D'),
        ...createFormsQuestion(9, 'Choose the most suitable unit to measure the thickness of a match:', 'mm', ['mm', 'cm', 'm', 'km'], 'A'),
        ...createFormsQuestion(10, 'Which of the following lists the units of length from smallest to longest?', 'mm, cm, m, km', ['km, m, cm, mm', 'mm, m, cm, km', 'mm, cm, m, km', 'cm, mm, m, km'], 'C')
      ]
    }]
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);
  console.log(`✅ Assessment DOCX generated: ${path.basename(outputPath)}`);
}

function createFormsQuestion(num, qText, correctAns, optionsList, correctAnsLetter) {
  const paras = [];
  paras.push(new Paragraph({
    spacing: { before: 180, after: 80 },
    children: [new TextRun({ text: `${num}. ${qText}`, bold: true })]
  }));
  
  const letters = ['A', 'B', 'C', 'D'];
  optionsList.forEach((opt, idx) => {
    paras.push(new Paragraph({
      spacing: { after: 60 },
      children: [new TextRun(`${letters[idx]}) ${opt}`)]
    }));
  });
  
  paras.push(new Paragraph({
    spacing: { after: 120 },
    children: [new TextRun({ text: `ANS: ${correctAnsLetter}`, bold: true, color: '2E7D32' })]
  }));
  
  return paras;
}

// --- MAIN RUN ---
async function run() {
  console.log('🚀 Starting compilation of Converting Length Measurements lesson pack...');
  await generateRulerImage(rulerPath);
  await generateHandout(handoutPath);
  generatePresentation(presentationPath);
  await generateAssessment(assessmentPath);
  console.log('🎉 Lesson Pack generated successfully!');
}

run().catch(err => {
  console.error('❌ Error during compilation:', err);
  process.exit(1);
});
