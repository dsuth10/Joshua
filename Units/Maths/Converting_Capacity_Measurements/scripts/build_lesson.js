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
const baseDir = 'c:\\Users\\dsuth\\Documents\\Joshua\\Units\\Maths\\Converting_Capacity_Measurements';
const scriptsDir = path.join(baseDir, 'scripts');
if (!fs.existsSync(scriptsDir)) {
  fs.mkdirSync(scriptsDir, { recursive: true });
}

const beakerAPath = path.join(baseDir, 'beaker_a.png');
const beakerBPath = path.join(baseDir, 'beaker_b.png');
const beakerCPath = path.join(baseDir, 'beaker_c.png');
const displacementPath = path.join(baseDir, 'displacement.png');

const handoutPath = path.join(baseDir, 'Converting_Capacity_Measurements_Handout.docx');
const presentationPath = path.join(baseDir, 'Converting_Capacity_Measurements_Presentation.html');
const assessmentPath = path.join(baseDir, 'Converting_Capacity_Measurements_Assessment.docx');

// --- 1. GENERATE BEAKER IMAGES USING SVG AND SHARP ---
async function generateBeakerImage(label, waterLevelML, labelText, bottleText, bottleColor, outputPath) {
  const width = 450;
  const height = 500;
  
  let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">`;
  
  // Background (white)
  svg += `<rect x="0" y="0" width="${width}" height="${height}" fill="#ffffff" />`;
  
  // Beaker dimensions
  const beakerXStart = 140;
  const beakerWidth = 200;
  const beakerHeight = 320;
  const beakerYBottom = 450;
  const beakerYTop = beakerYBottom - beakerHeight; // 130
  
  // Water mapping: 0 mL = 450, 500 mL = 210 (height 240px)
  const pxPerMl = 240 / 500;
  const waterHeight = waterLevelML * pxPerMl;
  const waterY = beakerYBottom - waterHeight;
  
  // Water layer (transparent blue)
  svg += `<rect x="${beakerXStart + 4}" y="${waterY}" width="${beakerWidth - 8}" height="${waterHeight - 4}" fill="#3f72af" fill-opacity="0.55" rx="4" ry="4" />`;
  
  // Beaker outer path
  svg += `<path d="M ${beakerXStart},${beakerYTop} L ${beakerXStart},${beakerYBottom - 8} A 8,8 0 0 0 ${beakerXStart + 8},${beakerYBottom} L ${beakerXStart + beakerWidth - 8},${beakerYBottom} A 8,8 0 0 0 ${beakerXStart + beakerWidth},${beakerYBottom - 8} L ${beakerXStart + beakerWidth},${beakerYTop}" fill="none" stroke="#112d4e" stroke-width="6" stroke-linecap="round" />`;
  
  // Beaker top lip
  svg += `<ellipse cx="${beakerXStart + beakerWidth/2}" cy="${beakerYTop}" rx="${beakerWidth/2 + 5}" ry="10" fill="none" stroke="#112d4e" stroke-width="5" />`;
  
  // Calibration marks
  const levels = [
    { ml: 125, label: '' },
    { ml: 250, label: '250 mL' },
    { ml: 375, label: '' },
    { ml: 500, label: '500 mL' }
  ];
  
  levels.forEach(lvl => {
    const y = beakerYBottom - lvl.ml * pxPerMl;
    svg += `<line x1="${beakerXStart}" y1="${y}" x2="${beakerXStart + 20}" y2="${y}" stroke="#112d4e" stroke-width="4" />`;
    if (lvl.label) {
      svg += `<text x="${beakerXStart - 15}" y="${y + 7}" font-family="Arial" font-size="20" font-weight="bold" fill="#112d4e" text-anchor="end">${lvl.label}</text>`;
    }
  });
  
  // Pouring stream
  svg += `<path d="M 310,120 Q 280,140 250,${waterY}" fill="none" stroke="#3f72af" stroke-width="8" stroke-opacity="0.8" stroke-linecap="round" />`;
  
  // Rotated Pouring Bottle
  svg += `<g transform="translate(320, 110) rotate(-45)">`;
  if (bottleText === 'Soft Drink') {
    svg += `<rect x="-25" y="-60" width="50" height="90" fill="${bottleColor}" stroke="#112d4e" stroke-width="4" rx="5" ry="5" />`;
    svg += `<ellipse cx="0" cy="-60" rx="25" ry="6" fill="#cccccc" stroke="#112d4e" stroke-width="3" />`;
    svg += `<rect x="-25" y="-30" width="50" height="40" fill="#e63946" />`;
    svg += `<text x="0" y="-5" font-family="Arial" font-size="10" font-weight="bold" fill="#ffffff" text-anchor="middle" transform="rotate(90)">COLA</text>`;
  } else if (bottleText === 'Sauce') {
    svg += `<path d="M -20,-70 L 20,-70 C 25,-40 25,10 20,30 L -20,30 C -25,10 -25,-40 -20,-70 Z" fill="${bottleColor}" stroke="#112d4e" stroke-width="4" />`;
    svg += `<path d="M -8,-70 L 0,-90 L 8,-70 Z" fill="#e63946" stroke="#112d4e" stroke-width="3" />`;
    svg += `<rect x="-18" y="-40" width="36" height="45" fill="#fdf6e2" stroke="#112d4e" stroke-width="2" />`;
    svg += `<text x="0" y="-15" font-family="Arial" font-size="10" font-weight="bold" fill="#8B4513" text-anchor="middle" transform="rotate(90)">SAUCE</text>`;
  } else {
    // Eucalyptus Oil
    svg += `<rect x="-22" y="-50" width="44" height="80" fill="${bottleColor}" stroke="#112d4e" stroke-width="4" rx="6" ry="6" />`;
    svg += `<rect x="-10" y="-65" width="20" height="15" fill="#222222" stroke="#112d4e" stroke-width="3" />`;
    svg += `<rect x="-4" y="-75" width="8" height="10" fill="#cccccc" stroke="#112d4e" stroke-width="2" />`;
    svg += `<rect x="-18" y="-30" width="36" height="45" fill="#ffffff" stroke="#112d4e" stroke-width="2" />`;
    svg += `<text x="0" y="-8" font-family="Arial" font-size="8" font-weight="bold" fill="#112d4e" text-anchor="middle" transform="rotate(90)">OIL</text>`;
  }
  svg += `</g>`;
  
  // Bottle labels in SVG space (not rotated) to make it legible
  svg += `<text x="350" y="50" font-family="Arial" font-size="20" font-weight="bold" fill="#112d4e" text-anchor="middle">${bottleText}</text>`;
  
  // Letter badge (orange circle)
  svg += `<circle cx="50" cy="50" r="22" fill="#f96d00" />`;
  svg += `<text x="50" y="58" font-family="Arial" font-size="24" font-weight="bold" fill="#ffffff" text-anchor="middle">${labelText}</text>`;
  
  svg += `</svg>`;
  
  const buffer = Buffer.from(svg);
  await sharp(buffer).png().toFile(outputPath);
  console.log(`✅ Beaker image generated: ${path.basename(outputPath)}`);
}

// --- 2. GENERATE DISPLACEMENT IMAGE ---
async function generateDisplacementImage(outputPath) {
  const width = 750;
  const height = 400;
  
  let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">`;
  
  // Background (white)
  svg += `<rect x="0" y="0" width="${width}" height="${height}" fill="#ffffff" />`;
  
  // LEFT CYLINDER (Water only, 10 mL)
  const c1X = 80;
  const c1W = 120;
  const c1Bottom = 350;
  const c1Top = 50;
  
  // Water (10 mL level)
  svg += `<rect x="${c1X + 4}" y="230" width="${c1W - 8}" height="116" fill="#3f72af" fill-opacity="0.55" rx="2" ry="2" />`;
  
  // Outline
  svg += `<path d="M ${c1X},${c1Top} L ${c1X},${c1Bottom - 6} A 6,6 0 0 0 ${c1X + 6},${c1Bottom} L ${c1X + c1W - 6},${c1Bottom} A 6,6 0 0 0 ${c1X + c1W},${c1Bottom - 6} L ${c1X + c1W},${c1Top}" fill="none" stroke="#112d4e" stroke-width="5" />`;
  svg += `<ellipse cx="${c1X + c1W/2}" cy="${c1Top}" rx="${c1W/2 + 2}" ry="6" fill="none" stroke="#112d4e" stroke-width="4" />`;
  
  // Ticks
  const pxPerMl = 120 / 10; // 12px per mL
  for (let ml = 0; ml <= 25; ml += 5) {
    const y = c1Bottom - ml * pxPerMl;
    const isMajor = ml % 10 === 0;
    const len = isMajor ? 18 : 10;
    svg += `<line x1="${c1X}" y1="${y}" x2="${c1X + len}" y2="${y}" stroke="#112d4e" stroke-width="${isMajor ? 3 : 2}" />`;
    if (isMajor) {
      svg += `<text x="${c1X - 10}" y="${y + 6}" font-family="Arial" font-size="16" font-weight="bold" fill="#112d4e" text-anchor="end">${ml} mL</text>`;
    }
  }
  
  // RIGHT CYLINDER (Water + Immersed Blocks, 22 mL)
  const c2X = 500;
  const c2W = 120;
  const c2Bottom = 350;
  const c2Top = 50;
  
  // Draw block model (3D isometric cubes)
  const x_origin = c2X + c2W / 2;
  const y_origin = 328;
  const scale = 14;
  
  let blockSvg = '';
  // 3x2x2 block grid: u=0..2, v=0..1, w=0..1
  for (let w = 0; w <= 1; w++) {
    for (let v = 1; v >= 0; v--) {
      for (let u = 0; u <= 2; u++) {
        const cx = x_origin + (u - v) * scale * 0.866;
        const cy = y_origin + (u + v) * scale * 0.5 - w * scale * 1.0;
        
        // Cube top face
        blockSvg += `<polygon points="${cx},${cy - scale} ${cx + scale * 0.866},${cy - scale * 0.5} ${cx},${cy} ${cx - scale * 0.866},${cy - scale * 0.5}" fill="#4dabf7" stroke="#112d4e" stroke-width="1.5" />`;
        // Cube left face
        blockSvg += `<polygon points="${cx - scale * 0.866},${cy - scale * 0.5} ${cx},${cy} ${cx},${cy + scale} ${cx - scale * 0.866},${cy + scale * 0.5}" fill="#1971c2" stroke="#112d4e" stroke-width="1.5" />`;
        // Cube right face
        blockSvg += `<polygon points="${cx},${cy} ${cx + scale * 0.866},${cy - scale * 0.5} ${cx + scale * 0.866},${cy + scale * 0.5} ${cx},${cy + scale}" fill="#228be6" stroke="#112d4e" stroke-width="1.5" />`;
      }
    }
  }
  
  svg += blockSvg;
  
  // Water in right cylinder (22 mL level, y = 86)
  svg += `<rect x="${c2X + 4}" y="86" width="${c2W - 8}" height="260" fill="#3f72af" fill-opacity="0.55" rx="2" ry="2" />`;
  
  // Outline of right cylinder
  svg += `<path d="M ${c2X},${c2Top} L ${c2X},${c2Bottom - 6} A 6,6 0 0 0 ${c2X + 6},${c2Bottom} L ${c2X + c2W - 6},${c2Bottom} A 6,6 0 0 0 ${c2X + c2W},${c2Bottom - 6} L ${c2X + c2W},${c2Top}" fill="none" stroke="#112d4e" stroke-width="5" />`;
  svg += `<ellipse cx="${c2X + c2W/2}" cy="${c2Top}" rx="${c2W/2 + 2}" ry="6" fill="none" stroke="#112d4e" stroke-width="4" />`;
  
  // Ticks for right cylinder
  for (let ml = 0; ml <= 25; ml += 5) {
    const y = c2Bottom - ml * pxPerMl;
    const isMajor = ml % 10 === 0;
    const len = isMajor ? 18 : 10;
    svg += `<line x1="${c2X}" y1="${y}" x2="${c2X + len}" y2="${y}" stroke="#112d4e" stroke-width="${isMajor ? 3 : 2}" />`;
    if (isMajor) {
      svg += `<text x="${c2X - 10}" y="${y + 6}" font-family="Arial" font-size="16" font-weight="bold" fill="#112d4e" text-anchor="end">${ml} mL</text>`;
    }
  }
  
  // Arrow in the middle
  svg += `<path d="M 260,200 L 410,200" fill="none" stroke="#f96d00" stroke-width="12" stroke-linecap="round" />`;
  svg += `<polygon points="420,200 400,185 400,215" fill="#f96d00" />`;
  svg += `<text x="340" y="165" font-family="Arial" font-size="20" font-weight="bold" fill="#f96d00" text-anchor="middle">Model Immersed</text>`;
  
  svg += `</svg>`;
  
  const buffer = Buffer.from(svg);
  await sharp(buffer).png().toFile(outputPath);
  console.log(`✅ Displacement diagram generated: ${path.basename(outputPath)}`);
}

// --- 3. GENERATE STUDENT HANDOUT (DOCX) ---
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
          size: { width: 11906, height: 16838 }, // A4
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } // 1 inch margins (usable width = 9026)
        } 
      },
      children: [
        // Title
        new Paragraph({ style: 'TitleStyle', children: [new TextRun('Converting Capacity Measurements')] }),
        
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
        
        // Key Concept Box
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
                        new TextRun({ text: 'Metric Capacity & Volume Concept: ', bold: true, color: THEME.navy }),
                        new TextRun('To convert Litres (L) to Millilitres (mL), multiply by 1000. ')
                      ]
                    }),
                    new Paragraph({
                      children: [
                        new TextRun('To convert Millilitres (mL) to Litres (L), divide by 1000. ')
                      ]
                    }),
                    new Paragraph({
                      children: [
                        new TextRun('Volume/Capacity Equivalence: 1 cubic centimetre (cm³) = 1 Millilitre (mL) of fluid displacement.')
                      ]
                    })
                  ]
                })
              ]
            })
          ]
        }),
        
        new Paragraph({ spacing: { after: 300 } }),
        
        // Part 1: Calibrated Containers
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('Part 1: Reading Scales of Calibrated Containers')] }),
        new Paragraph({ children: [new TextRun('The contents of each full container was poured into the empty calibrated measuring container. Read the scale to find the capacity of each emptied container.')] }),
        new Paragraph({ spacing: { after: 200 } }),
        
        // Beaker Images Side-by-Side
        new Table({
          columnWidths: [3008, 3008, 3008],
          margins: { top: 100, bottom: 100, left: 100, right: 100 },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 3008, type: WidthType.DXA },
                  borders: cellBorders,
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [new ImageRun({
                        type: 'png',
                        data: fs.readFileSync(beakerAPath),
                        transformation: { width: 140, height: 155 }
                      })]
                    }),
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      spacing: { before: 100 },
                      children: [new TextRun({ text: 'Container A (Sauce):\n', bold: true }), new TextRun('______________ mL')]
                    })
                  ]
                }),
                new TableCell({
                  width: { size: 3008, type: WidthType.DXA },
                  borders: cellBorders,
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [new ImageRun({
                        type: 'png',
                        data: fs.readFileSync(beakerBPath),
                        transformation: { width: 140, height: 155 }
                      })]
                    }),
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      spacing: { before: 100 },
                      children: [new TextRun({ text: 'Container B (Soda):\n', bold: true }), new TextRun('______________ mL')]
                    })
                  ]
                }),
                new TableCell({
                  width: { size: 3008, type: WidthType.DXA },
                  borders: cellBorders,
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [new ImageRun({
                        type: 'png',
                        data: fs.readFileSync(beakerCPath),
                        transformation: { width: 140, height: 155 }
                      })]
                    }),
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      spacing: { before: 100 },
                      children: [new TextRun({ text: 'Container C (Oil):\n', bold: true }), new TextRun('______________ mL')]
                    })
                  ]
                })
              ]
            })
          ]
        }),
        
        new Paragraph({ spacing: { before: 150 } }),
        new Paragraph({ children: [new TextRun({ text: 'Question: ', bold: true }), new TextRun('Order containers A, B and C from smallest to largest capacity:')] }),
        new Paragraph({ spacing: { before: 100, after: 300 }, children: [new TextRun('__________________________________________________________________________________')] }),
        
        // Part 2: Choose Unit
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('Part 2: Choose Appropriate Unit (mL or L)')] }),
        new Paragraph({ children: [new TextRun('Would you use millilitres (mL) or litres (L) to measure the capacity of the following items?')] }),
        new Table({
          columnWidths: [4513, 4513],
          margins: { top: 100, bottom: 100, left: 150, right: 150 },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 4513, type: WidthType.DXA },
                  children: [
                    new Paragraph({ children: [new TextRun('a)  a bath:  _______________')] }),
                    new Paragraph({ spacing: { before: 120 }, children: [new TextRun('c)  a sink:  _______________')] })
                  ]
                }),
                new TableCell({
                  width: { size: 4513, type: WidthType.DXA },
                  children: [
                    new Paragraph({ children: [new TextRun('b)  a cup:   _______________')] }),
                    new Paragraph({ spacing: { before: 120 }, children: [new TextRun('d)  a drink bottle: _________')] })
                  ]
                })
              ]
            })
          ]
        }),
        
        new Paragraph({ children: [new PageBreak()] }), // Page Break

        // Part 3: Litres to Millilitres
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('Part 3: How many millilitres are in these Litre volumes?')] }),
        new Table({
          columnWidths: [4513, 4513],
          margins: { top: 100, bottom: 100, left: 150, right: 150 },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 4513, type: WidthType.DXA },
                  children: [
                    new Paragraph({ children: [new TextRun('a)  4 L    =  ________________ mL')] }),
                    new Paragraph({ spacing: { before: 120 }, children: [new TextRun('c)  22 L   =  ________________ mL')] }),
                    new Paragraph({ spacing: { before: 120 }, children: [new TextRun('e)  7.4 L  =  ________________ mL')] })
                  ]
                }),
                new TableCell({
                  width: { size: 4513, type: WidthType.DXA },
                  children: [
                    new Paragraph({ children: [new TextRun('b)  10 L   =  ________________ mL')] }),
                    new Paragraph({ spacing: { before: 120 }, children: [new TextRun('d)  5.3 L  =  ________________ mL')] }),
                    new Paragraph({ spacing: { before: 120 }, children: [new TextRun('f)  3.6 L  =  ________________ mL')] })
                  ]
                })
              ]
            })
          ]
        }),
        
        new Paragraph({ spacing: { after: 300 } }),
        
        // Part 4: Millilitres to Litres
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('Part 4: How many litres are in these millilitre volumes?')] }),
        new Table({
          columnWidths: [4513, 4513],
          margins: { top: 100, bottom: 100, left: 150, right: 150 },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 4513, type: WidthType.DXA },
                  children: [
                    new Paragraph({ children: [new TextRun('a)  9000 mL =  ________________ L')] }),
                    new Paragraph({ spacing: { before: 120 }, children: [new TextRun('c)  3000 mL =  ________________ L')] }),
                    new Paragraph({ spacing: { before: 120 }, children: [new TextRun('e)  6800 mL =  ________________ L')] })
                  ]
                }),
                new TableCell({
                  width: { size: 4513, type: WidthType.DXA },
                  children: [
                    new Paragraph({ children: [new TextRun('b)  5000 mL =  ________________ L')] }),
                    new Paragraph({ spacing: { before: 120 }, children: [new TextRun('d)  1500 mL =  ________________ L')] }),
                    new Paragraph({ spacing: { before: 120 }, children: [new TextRun('f)  2600 mL =  ________________ L')] })
                  ]
                })
              ]
            })
          ]
        }),
        
        new Paragraph({ spacing: { after: 300 } }),
        
        // Part 5: Compound units
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('Part 5: Write these compound volumes in Millilitres')] }),
        new Table({
          columnWidths: [3008, 3008, 3008],
          margins: { top: 100, bottom: 100, left: 150, right: 150 },
          rows: [
            new TableRow({
              children: [
                new TableCell({ width: { size: 3008, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun('a) 1 L 600 mL =\n___________ mL')] })] }),
                new TableCell({ width: { size: 3008, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun('b) 1 L 950 mL =\n___________ mL')] })] }),
                new TableCell({ width: { size: 3008, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun('c) 2 L 300 mL =\n___________ mL')] })] })
              ]
            })
          ]
        }),
        
        new Paragraph({ spacing: { after: 300 } }),
        
        // Part 6: Split units
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('Part 6: Write these as Litres and Millilitres')] }),
        new Table({
          columnWidths: [3008, 3008, 3008],
          margins: { top: 100, bottom: 100, left: 150, right: 150 },
          rows: [
            new TableRow({
              children: [
                new TableCell({ width: { size: 3008, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun('a) 7530 mL =\n____ L ____ mL')] })] }),
                new TableCell({ width: { size: 3008, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun('b) 1075 mL =\n____ L ____ mL')] })] }),
                new TableCell({ width: { size: 3008, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun('c) 35700 mL =\n____ L ____ mL')] })] })
              ]
            })
          ]
        }),
        
        new Paragraph({ children: [new PageBreak()] }), // Page Break

        // Part 7: Displacement Model
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('Part 7: Fluid Displacement & 3D Block Models')] }),
        new Paragraph({ children: [new TextRun('This model was immersed into the container. An ones block (1 cubic centimetre) displaces exactly 1 mL of fluid.')] }),
        new Paragraph({ spacing: { after: 150 } }),
        
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new ImageRun({
            type: 'png',
            data: fs.readFileSync(displacementPath),
            transformation: { width: 480, height: 256 }
          })]
        }),
        
        new Paragraph({ spacing: { before: 150 } }),
        new Paragraph({ children: [new TextRun({ text: 'a) ', bold: true }), new TextRun('2 layers of 6 ones blocks = ___________ ones blocks.')] }),
        new Paragraph({ spacing: { before: 100 }, children: [new TextRun({ text: 'b) ', bold: true }), new TextRun('What is the volume of this model? ____________ mL  or  ____________ cubic centimetres.')] }),
        
        new Paragraph({ spacing: { after: 300 } }),
        
        // Part 8: Convert to cubic centimetres
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('Part 8: Convert millilitre capacity to cubic centimetres')] }),
        new Table({
          columnWidths: [3008, 3008, 3008],
          margins: { top: 100, bottom: 100, left: 150, right: 150 },
          rows: [
            new TableRow({
              children: [
                new TableCell({ width: { size: 3008, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun('a) 42 mL =\n________ cm³')] })] }),
                new TableCell({ width: { size: 3008, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun('b) 327 mL =\n________ cm³')] })] }),
                new TableCell({ width: { size: 3008, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun('c) 608 mL =\n________ cm³')] })] })
              ]
            })
          ]
        }),
        
        new Paragraph({ spacing: { after: 300 } }),
        
        // Part 9: Convert to millilitres
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('Part 9: Convert cubic centimetres to millilitre capacity')] }),
        new Table({
          columnWidths: [3008, 3008, 3008],
          margins: { top: 100, bottom: 100, left: 150, right: 150 },
          rows: [
            new TableRow({
              children: [
                new TableCell({ width: { size: 3008, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun('a) 15 cubic centimetres =\n________ mL')] })] }),
                new TableCell({ width: { size: 3008, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun('b) 138 cubic centimetres =\n________ mL')] })] }),
                new TableCell({ width: { size: 3008, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun('c) 569 cubic centimetres =\n________ mL')] })] })
              ]
            })
          ]
        })
      ]
    }]
  });
  
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);
  console.log(`✅ Student Handout DOCX generated: ${path.basename(outputPath)}`);
}

// --- 4. GENERATE INTERACTIVE PRESENTATION (HTML) ---
function generatePresentation(outputPath) {
  const templateContent = fs.readFileSync(TEMPLATE_PATH, 'utf8');
  
  const slidesData = [
    {
      title: 'Converting Capacity Measurements',
      subtitle: 'Litres, Millilitres & Cubic Centimetres',
      theme: 'dark',
      standardHtml: `
        <div style="margin-top:50px;">
          <p style="font-size:32px; color:var(--orange); font-weight:600; margin-bottom:10px;">Year 5 Mathematics</p>
          <p style="font-size:24px; color:var(--text-light); max-width:800px; margin:0 auto; line-height:1.6;">
            Today we will learn how to read capacity scales, convert between Litres (L) and Millilitres (mL), and connect fluid capacity to physical volume (cm³).
          </p>
        </div>
      `,
      teacherNotes: `
        <h3>Lesson Introduction</h3>
        <p>Introduce learning intention: Understand the relationship between millilitres and litres, and convert between them using place value shifts.</p>
        <p>Highlight the real-world utility: medicine doses (mL), juice bottles (mL/L), fuel tanks (L).</p>
      `
    },
    {
      title: 'Warm-up: Ordering Capacity Units',
      theme: 'light',
      standardHtml: `
        <p class="intro-text">Can you arrange these capacity units in order from <strong>smallest to largest</strong>?</p>
        <div class="seq-container" id="slide-cap-seq">
          <div class="seq-list" id="slide-cap-list">
            <div class="seq-strip" data-index="0" data-correct-idx="1">
              <span class="seq-number">1</span>
              <span class="seq-text">Litres (L)</span>
              <div class="seq-controls">
                <button class="seq-btn seq-up"><svg viewBox="0 0 24 24" width="18" height="18"><path d="M7 14l5-5 5 5z" fill="currentColor"/></svg></button>
                <button class="seq-btn seq-down"><svg viewBox="0 0 24 24" width="18" height="18"><path d="M7 10l5 5 5-5z" fill="currentColor"/></svg></button>
              </div>
            </div>
            <div class="seq-strip" data-index="1" data-correct-idx="2">
              <span class="seq-number">2</span>
              <span class="seq-text">Kilolitres (kL)</span>
              <div class="seq-controls">
                <button class="seq-btn seq-up"><svg viewBox="0 0 24 24" width="18" height="18"><path d="M7 14l5-5 5 5z" fill="currentColor"/></svg></button>
                <button class="seq-btn seq-down"><svg viewBox="0 0 24 24" width="18" height="18"><path d="M7 10l5 5 5-5z" fill="currentColor"/></svg></button>
              </div>
            </div>
            <div class="seq-strip" data-index="2" data-correct-idx="0">
              <span class="seq-number">3</span>
              <span class="seq-text">Millilitres (mL)</span>
              <div class="seq-controls">
                <button class="seq-btn seq-up"><svg viewBox="0 0 24 24" width="18" height="18"><path d="M7 14l5-5 5 5z" fill="currentColor"/></svg></button>
                <button class="seq-btn seq-down"><svg viewBox="0 0 24 24" width="18" height="18"><path d="M7 10l5 5 5-5z" fill="currentColor"/></svg></button>
              </div>
            </div>
          </div>
          <button class="interactive-submit-btn" id="slide-cap-submit">Check Order</button>
          <div class="interactive-feedback" id="slide-cap-feedback"></div>
          <div class="hint-box" id="slide-cap-hint">
            <strong>Hint:</strong> Millilitres (mL) are tiny drops (like a spoonful of medicine). Litres (L) are like a carton of milk. Kilolitres (kL) are used for huge water tanks.
          </div>
        </div>
        
        <script>
          (function() {
            const list = document.getElementById('slide-cap-list');
            const submitBtn = document.getElementById('slide-cap-submit');
            const feedback = document.getElementById('slide-cap-feedback');
            const hint = document.getElementById('slide-cap-hint');
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
                  strip.style.animation = 'none';
                  setTimeout(() => { strip.style.animation = 'shake 0.4s ease'; }, 10);
                }
              });
              
              if (allCorrect) {
                feedback.innerHTML = '<span style="color:var(--green-success)">✓ Correct! Smallest to largest: mL &lt; L &lt; kL.</span>';
                hint.style.display = 'none';
              } else {
                mistakesCount++;
                feedback.innerHTML = '<span style="color:var(--red-error)">Try again! Check the order.</span>';
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
              feedback.innerHTML = '<span style="color:var(--green-success)">Answer revealed: Millilitres (mL) &lt; Litres (L) &lt; Kilolitres (kL)</span>';
              hint.style.display = 'none';
            });
          })();
        </script>
      `,
      teacherNotes: `
        <h3>Warm-up Sequencing (Capacity)</h3>
        <p>Prompt: "Which of these units is smallest?" Have students vote. Have them write the order on mini-whiteboards first.</p>
      `
    },
    {
      title: 'Warm-up: Ordering Length Units',
      theme: 'light',
      standardHtml: `
        <p class="intro-text">Can you arrange these metric length units in order from <strong>smallest to longest</strong>?</p>
        <div class="seq-container" id="slide-len-seq">
          <div class="seq-list" id="slide-len-list">
            <div class="seq-strip" data-index="0" data-correct-idx="2">
              <span class="seq-number">1</span>
              <span class="seq-text">Metres (m)</span>
              <div class="seq-controls">
                <button class="seq-btn seq-up"><svg viewBox="0 0 24 24" width="18" height="18"><path d="M7 14l5-5 5 5z" fill="currentColor"/></svg></button>
                <button class="seq-btn seq-down"><svg viewBox="0 0 24 24" width="18" height="18"><path d="M7 10l5 5 5-5z" fill="currentColor"/></svg></button>
              </div>
            </div>
            <div class="seq-strip" data-index="1" data-correct-idx="3">
              <span class="seq-number">2</span>
              <span class="seq-text">Kilometres (km)</span>
              <div class="seq-controls">
                <button class="seq-btn seq-up"><svg viewBox="0 0 24 24" width="18" height="18"><path d="M7 14l5-5 5 5z" fill="currentColor"/></svg></button>
                <button class="seq-btn seq-down"><svg viewBox="0 0 24 24" width="18" height="18"><path d="M7 10l5 5 5-5z" fill="currentColor"/></svg></button>
              </div>
            </div>
            <div class="seq-strip" data-index="2" data-correct-idx="0">
              <span class="seq-number">3</span>
              <span class="seq-text">Millimetres (mm)</span>
              <div class="seq-controls">
                <button class="seq-btn seq-up"><svg viewBox="0 0 24 24" width="18" height="18"><path d="M7 14l5-5 5 5z" fill="currentColor"/></svg></button>
                <button class="seq-btn seq-down"><svg viewBox="0 0 24 24" width="18" height="18"><path d="M7 10l5 5 5-5z" fill="currentColor"/></svg></button>
              </div>
            </div>
            <div class="seq-strip" data-index="3" data-correct-idx="1">
              <span class="seq-number">4</span>
              <span class="seq-text">Centimetres (cm)</span>
              <div class="seq-controls">
                <button class="seq-btn seq-up"><svg viewBox="0 0 24 24" width="18" height="18"><path d="M7 14l5-5 5 5z" fill="currentColor"/></svg></button>
                <button class="seq-btn seq-down"><svg viewBox="0 0 24 24" width="18" height="18"><path d="M7 10l5 5 5-5z" fill="currentColor"/></svg></button>
              </div>
            </div>
          </div>
          <button class="interactive-submit-btn" id="slide-len-submit">Check Order</button>
          <div class="interactive-feedback" id="slide-len-feedback"></div>
          <div class="hint-box" id="slide-len-hint">
            <strong>Hint:</strong> Millimetres (mm) are for tiny items (thickness of a coin), Centimetres (cm) for standard school tools, Metres (m) for classrooms, and Kilometres (km) for road trips.
          </div>
        </div>
        
        <script>
          (function() {
            const list = document.getElementById('slide-len-list');
            const submitBtn = document.getElementById('slide-len-submit');
            const feedback = document.getElementById('slide-len-feedback');
            const hint = document.getElementById('slide-len-hint');
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
                  strip.style.animation = 'none';
                  setTimeout(() => { strip.style.animation = 'shake 0.4s ease'; }, 10);
                }
              });
              
              if (allCorrect) {
                feedback.innerHTML = '<span style="color:var(--green-success)">✓ Correct! Smallest to longest: mm &lt; cm &lt; m &lt; km.</span>';
                hint.style.display = 'none';
              } else {
                mistakesCount++;
                feedback.innerHTML = '<span style="color:var(--red-error)">Try again! Check the order.</span>';
                if (mistakesCount >= 2) {
                  hint.style.display = 'block';
                }
              }
            });
            
            document.getElementById('slide-3').addEventListener('show-answer', function() {
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
        <h3>Warm-up Sequencing (Length)</h3>
        <p>Ask: "How do we measure the thickness of a fingernail? (mm). The length of a table? (cm or m). The distance to another city? (km)."</p>
      `
    },
    {
      title: 'Warm-up: Ordering Mass Units',
      theme: 'light',
      standardHtml: `
        <p class="intro-text">Can you arrange these metric mass units in order from <strong>lightest to heaviest</strong>?</p>
        <div class="seq-container" id="slide-mass-seq">
          <div class="seq-list" id="slide-mass-list">
            <div class="seq-strip" data-index="0" data-correct-idx="1">
              <span class="seq-number">1</span>
              <span class="seq-text">Grams (g)</span>
              <div class="seq-controls">
                <button class="seq-btn seq-up"><svg viewBox="0 0 24 24" width="18" height="18"><path d="M7 14l5-5 5 5z" fill="currentColor"/></svg></button>
                <button class="seq-btn seq-down"><svg viewBox="0 0 24 24" width="18" height="18"><path d="M7 10l5 5 5-5z" fill="currentColor"/></svg></button>
              </div>
            </div>
            <div class="seq-strip" data-index="1" data-correct-idx="2">
              <span class="seq-number">2</span>
              <span class="seq-text">Kilograms (kg)</span>
              <div class="seq-controls">
                <button class="seq-btn seq-up"><svg viewBox="0 0 24 24" width="18" height="18"><path d="M7 14l5-5 5 5z" fill="currentColor"/></svg></button>
                <button class="seq-btn seq-down"><svg viewBox="0 0 24 24" width="18" height="18"><path d="M7 10l5 5 5-5z" fill="currentColor"/></svg></button>
              </div>
            </div>
            <div class="seq-strip" data-index="2" data-correct-idx="0">
              <span class="seq-number">3</span>
              <span class="seq-text">Milligrams (mg)</span>
              <div class="seq-controls">
                <button class="seq-btn seq-up"><svg viewBox="0 0 24 24" width="18" height="18"><path d="M7 14l5-5 5 5z" fill="currentColor"/></svg></button>
                <button class="seq-btn seq-down"><svg viewBox="0 0 24 24" width="18" height="18"><path d="M7 10l5 5 5-5z" fill="currentColor"/></svg></button>
              </div>
            </div>
          </div>
          <button class="interactive-submit-btn" id="slide-mass-submit">Check Order</button>
          <div class="interactive-feedback" id="slide-mass-feedback"></div>
          <div class="hint-box" id="slide-mass-hint">
            <strong>Hint:</strong> Milligrams (mg) measure tiny weights (like a grain of sand). Grams (g) are for everyday items (like an apple). Kilograms (kg) measure heavy weights (like a bag of flour).
          </div>
        </div>
        
        <script>
          (function() {
            const list = document.getElementById('slide-mass-list');
            const submitBtn = document.getElementById('slide-mass-submit');
            const feedback = document.getElementById('slide-mass-feedback');
            const hint = document.getElementById('slide-mass-hint');
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
                  strip.style.animation = 'none';
                  setTimeout(() => { strip.style.animation = 'shake 0.4s ease'; }, 10);
                }
              });
              
              if (allCorrect) {
                feedback.innerHTML = '<span style="color:var(--green-success)">✓ Correct! Lightest to heaviest: mg &lt; g &lt; kg.</span>';
                hint.style.display = 'none';
              } else {
                mistakesCount++;
                feedback.innerHTML = '<span style="color:var(--red-error)">Try again! Check the order.</span>';
                if (mistakesCount >= 2) {
                  hint.style.display = 'block';
                }
              }
            });
            
            document.getElementById('slide-4').addEventListener('show-answer', function() {
              const strips = Array.from(list.querySelectorAll('.seq-strip'));
              strips.sort((a, b) => parseInt(a.getAttribute('data-correct-idx')) - parseInt(b.getAttribute('data-correct-idx')));
              strips.forEach(s => list.appendChild(s));
              updateNumbers();
              list.querySelectorAll('.seq-strip').forEach(s => {
                s.classList.remove('incorrect-seq');
                s.classList.add('correct-seq');
              });
              feedback.innerHTML = '<span style="color:var(--green-success)">Answer revealed: Milligrams (mg) &lt; Grams (g) &lt; Kilograms (kg)</span>';
              hint.style.display = 'none';
            });
          })();
        </script>
      `,
      teacherNotes: `
        <h3>Warm-up Sequencing (Mass)</h3>
        <p>Explain metric mass units. mg are for tiny masses, grams for everyday items, kilograms for heavy weights.</p>
      `
    },
    {
      title: 'Explicit Instruction: Reading Graduated Containers',
      theme: 'light',
      standardHtml: `
        <p class="intro-text" style="margin-bottom:10px;">Look at the three calibrated containers. Click on each card to reveal the capacity of the container.</p>
        
        <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:15px; text-align:center;">
          <div style="background:#eef2f6; border:2px solid var(--navy); border-radius:8px; padding:12px; cursor:pointer;" class="reveal-card" data-ans="A: 250 mL">
            <img src="beaker_a.png" style="max-height: 180px; width: auto; display:block; margin: 0 auto 10px; border-radius:4px;" alt="Container A">
            <div style="width:36px; height:36px; border-radius:50%; background:var(--navy); color:#fff; display:flex; align-items:center; justify-content:center; margin:0 auto 10px; font-weight:bold; font-size:20px;">A</div>
            <div class="reveal-content" style="font-weight:bold; font-size:20px; color:#555;">Click to reveal</div>
          </div>
          <div style="background:#eef2f6; border:2px solid var(--navy); border-radius:8px; padding:12px; cursor:pointer;" class="reveal-card" data-ans="B: 375 mL">
            <img src="beaker_b.png" style="max-height: 180px; width: auto; display:block; margin: 0 auto 10px; border-radius:4px;" alt="Container B">
            <div style="width:36px; height:36px; border-radius:50%; background:var(--navy); color:#fff; display:flex; align-items:center; justify-content:center; margin:0 auto 10px; font-weight:bold; font-size:20px;">B</div>
            <div class="reveal-content" style="font-weight:bold; font-size:20px; color:#555;">Click to reveal</div>
          </div>
          <div style="background:#eef2f6; border:2px solid var(--navy); border-radius:8px; padding:12px; cursor:pointer;" class="reveal-card" data-ans="C: 125 mL">
            <img src="beaker_c.png" style="max-height: 180px; width: auto; display:block; margin: 0 auto 10px; border-radius:4px;" alt="Container C">
            <div style="width:36px; height:36px; border-radius:50%; background:var(--navy); color:#fff; display:flex; align-items:center; justify-content:center; margin:0 auto 10px; font-weight:bold; font-size:20px;">C</div>
            <div class="reveal-content" style="font-weight:bold; font-size:20px; color:#555;">Click to reveal</div>
          </div>
        </div>
        
        <div style="margin-top:20px; text-align:center; font-size:24px; font-weight:bold; color:var(--navy);" id="slide-5-order-ans">
          Order from smallest to largest capacity: Container C (125 mL) &lt; Container A (250 mL) &lt; Container B (375 mL)
        </div>
        
        <script>
          (function() {
            const cards = document.querySelectorAll('#slide-5 .reveal-card');
            cards.forEach(card => {
              card.addEventListener('click', function() {
                const content = card.querySelector('.reveal-content');
                content.innerText = card.getAttribute('data-ans');
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
        <h3>Beaker Scale Reading</h3>
        <p>Ask: "How many segments are there between 0 and 500 mL? (Four). What is 500 divided by 4? (125 mL)."</p>
        <p>Demonstrate that each major tick line corresponds to a multiple of 125 mL: 125, 250, 375, 500.</p>
      `
    },
    {
      title: 'Converting Litres to Millilitres (× 1000)',
      theme: 'light',
      standardHtml: `
        <div style="display:flex; gap:30px; align-items:center; margin-top:20px;">
          <div style="flex:1;">
            <p class="intro-text">Since there are <strong>1000 millilitres</strong> in <strong>1 litre</strong>, we convert from Litres (large unit) to Millilitres (small unit) by multiplying by 1000.</p>
            <div class="remember-box" style="background:var(--lightOrange); padding:20px; border-left:6px solid var(--orange); border-radius:6px;">
              <span style="color:var(--orange); font-weight:bold; font-size:26px;">To convert L to mL:</span><br>
              Multiply the number of litres by <strong>1000</strong>.<br>
              <em>Place Value Rule: Shift the decimal point three places to the right.</em>
            </div>
            <div style="background:#eef2f6; padding:20px; border-radius:6px; margin-top:20px; font-size:24px;">
              <strong>Examples:</strong><br>
              • 4 L &rarr; 4 × 1000 = <strong>4000 mL</strong><br>
              • 5.3 L &rarr; 5.3 × 1000 = <strong>5300 mL</strong><br>
              • 7.4 L &rarr; 7.4 × 1000 = <strong>7400 mL</strong>
            </div>
          </div>
          <div style="width:300px; background:#fff3e0; border:2px solid var(--orange); border-radius:12px; padding:24px; text-align:center; box-shadow:var(--shadow-md);">
            <div style="font-size:80px; line-height:1;">👑</div>
            <div style="font-size:26px; font-weight:bold; color:var(--navy); margin-top:15px;">Mascot Rule</div>
            <p style="font-size:20px; margin-top:10px; line-height:1.4;">"Going from L to mL? Jump 3 places right!"</p>
            <div style="background:var(--navy); color:#fff; border-radius:6px; padding:10px; margin-top:15px; font-weight:bold; font-size:22px;">5.3 &rarr; 5300</div>
          </div>
        </div>
      `,
      teacherNotes: `
        <h3>Litres to Millilitres Instruction</h3>
        <p>Explain that multiplying shifts place values. Focus on how 5.3 L becomes 5300 mL by sliding the decimal place three spaces to fill trailing zeros.</p>
      `
    },
    {
      title: 'Converting Millilitres to Litres (÷ 1000)',
      theme: 'light',
      standardHtml: `
        <div style="display:flex; gap:30px; align-items:center; margin-top:20px;">
          <div style="flex:1;">
            <p class="intro-text">To convert from Millilitres (small unit) to Litres (large unit), we perform the inverse operation: we divide by 1000.</p>
            <div class="remember-box" style="background:#e3f2fd; padding:20px; border-left:6px solid var(--blue); border-radius:6px;">
              <span style="color:var(--blue); font-weight:bold; font-size:26px;">To convert mL to L:</span><br>
              Divide the number of millilitres by <strong>1000</strong>.<br>
              <em>Place Value Rule: Shift the decimal point three places to the left.</em>
            </div>
            <div style="background:#eef2f6; padding:20px; border-radius:6px; margin-top:20px; font-size:24px;">
              <strong>Examples:</strong><br>
              • 9000 mL &rarr; 9000 &divide; 1000 = <strong>9 L</strong><br>
              • 1500 mL &rarr; 1500 &divide; 1000 = <strong>1.5 L</strong><br>
              • 2600 mL &rarr; 2600 &divide; 1000 = <strong>2.6 L</strong>
            </div>
          </div>
          <div style="width:300px; background:#eef2f6; border:2px solid var(--blue); border-radius:12px; padding:24px; text-align:center; box-shadow:var(--shadow-md);">
            <div style="font-size:80px; line-height:1;">🤖</div>
            <div style="font-size:26px; font-weight:bold; color:var(--navy); margin-top:15px;">Place Value Shift</div>
            <p style="font-size:20px; margin-top:10px; line-height:1.4;">"Going from mL to L? Move 3 places left!"</p>
            <div style="background:var(--navy); color:#fff; border-radius:6px; padding:10px; margin-top:15px; font-weight:bold; font-size:22px;">1500 &rarr; 1.5</div>
          </div>
        </div>
      `,
      teacherNotes: `
        <h3>Millilitres to Litres Instruction</h3>
        <p>Model shifting digits to the right (decimal point left) by three places. Emphasize why 1500 mL equals 1.5 L rather than 15 L.</p>
      `
    },
    {
      title: 'CFU: Capacity Conversions (L ↔ mL)',
      theme: 'light',
      standardHtml: `
        <span class="cfu-badge" style="position:absolute; top:25px; left:460px; display:inline-block; background:var(--orange); color:white; padding:4px 12px; border-radius:15px; font-size:16px; font-weight:bold;">CFU - Whiteboard Option</span>
        <p class="intro-text">Match the metric capacity values on the left with their correct conversions on the right.</p>
        
        <div class="match-container" id="slide-8-match">
          <div class="match-cols-grid">
            <div class="match-col" id="slide-8-left">
              <div class="match-card" data-match="1">4 L</div>
              <div class="match-card" data-match="2">5.3 L</div>
              <div class="match-card" data-match="3">1500 mL</div>
              <div class="match-card" data-match="4">2600 mL</div>
            </div>
            <div class="match-col" id="slide-8-right">
              <div class="match-card" data-match="3">1.5 L</div>
              <div class="match-card" data-match="1">4000 mL</div>
              <div class="match-card" data-match="4">2.6 L</div>
              <div class="match-card" data-match="2">5300 mL</div>
            </div>
          </div>
          <div class="interactive-feedback" id="slide-8-feedback" style="margin-top:15px;"></div>
          <div class="hint-box" id="slide-8-hint">
            <strong>Hint:</strong> Litres to Millilitres: multiply by 1000. Millilitres to Litres: divide by 1000.
          </div>
        </div>
        
        <script>
          (function() {
            const container = document.getElementById('slide-8-match');
            const leftCol = document.getElementById('slide-8-left');
            const rightCol = document.getElementById('slide-8-right');
            const feedback = document.getElementById('slide-8-feedback');
            const hint = document.getElementById('slide-8-hint');
            
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
                  feedback.innerHTML = '<span style="color:var(--green-success)">✓ All conversions matched successfully!</span>';
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
                  tempLeft.classList.remove('incorrect-match', 'selected');
                  tempRight.classList.remove('incorrect-match', 'selected');
                }, 800);
                selectedLeft = null;
                selectedRight = null;
                if (mistakesCount >= 2) {
                  hint.style.display = 'block';
                }
              }
            }
            
            document.getElementById('slide-8').addEventListener('show-answer', function() {
              leftCol.querySelectorAll('.match-card').forEach(c => c.classList.add('matched'));
              rightCol.querySelectorAll('.match-card').forEach(c => c.classList.add('matched'));
              feedback.innerHTML = '<span style="color:var(--green-success)">Answers revealed: Conversions completed!</span>';
              hint.style.display = 'none';
            });
          })();
        </script>
      `,
      teacherNotes: `
        <h3>Conversions CFU</h3>
        <p>Prompt: Students solve each connection on their whiteboards and raise them. Verify that they multiply or divide by 1000 correctly.</p>
      `
    },
    {
      title: 'Explicit Instruction: Compound & Split Units',
      theme: 'light',
      standardHtml: `
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; margin-top:20px;">
          <div style="background:#f9f7f7; border: 2px solid var(--orange); padding:20px; border-radius:8px;">
            <h3 style="color:var(--navy); margin-bottom:15px;">Compound Units (L & mL &rarr; mL)</h3>
            <p style="font-size:22px; line-height:1.5; margin-bottom:15px;">
              To write compound volumes like <strong>1 L 600 mL</strong> in pure millilitres, we replace the Litres with 1000 mL and add the rest:
            </p>
            <div style="background:#fff; border:1px solid #ccc; padding:15px; border-radius:6px; font-weight:bold; font-size:24px;">
              • 1 L 600 mL = 1000 mL + 600 mL = <strong>1600 mL</strong><br>
              • 2 L 300 mL = 2000 mL + 300 mL = <strong>2300 mL</strong>
            </div>
          </div>
          
          <div style="background:#f9f7f7; border: 2px solid var(--blue); padding:20px; border-radius:8px;">
            <h3 style="color:var(--navy); margin-bottom:15px;">Split Units (mL &rarr; L & mL)</h3>
            <p style="font-size:22px; line-height:1.5; margin-bottom:15px;">
              To write pure millilitres like <strong>7530 mL</strong> as Litres and millilitres, we separate the thousands column:
            </p>
            <div style="background:#fff; border:1px solid #ccc; padding:15px; border-radius:6px; font-weight:bold; font-size:24px;">
              • 7530 mL = 7000 mL + 530 mL = <strong>7 L 530 mL</strong><br>
              • 1075 mL = 1000 mL + 75 mL = <strong>1 L 75 mL</strong>
            </div>
          </div>
        </div>
      `,
      teacherNotes: `
        <h3>Compound Units Instruction</h3>
        <p>Highlight the place value composition: the thousands place in millilitres represents whole Litres. E.g., 7530 has 7 thousands, meaning 7 Litres and 530 mL.</p>
      `
    },
    {
      title: 'CFU: Compound Conversions',
      theme: 'light',
      standardHtml: `
        <span class="cfu-badge" style="position:absolute; top:25px; left:440px; display:inline-block; background:var(--orange); color:white; padding:4px 12px; border-radius:15px; font-size:16px; font-weight:bold;">CFU - Whiteboard Option</span>
        <p class="intro-text">Find the missing blank values to complete these conversions.</p>
        
        <div class="cloze-container" id="slide-10-cloze" style="margin-top:20px; font-size:24px;">
          <div style="display:flex; flex-direction:column; gap:12px; max-width:650px; margin:0 auto;">
            
            <div style="display:flex; align-items:center; justify-content:space-between; background:rgba(17,45,78,0.03); padding:10px 20px; border-radius:8px; border:1px solid #e2e8f0;">
              <span style="font-weight:600; color:var(--navy);">1. 1 L 950 mL</span>
              <span style="font-weight:bold; color:var(--navy);">&rarr;</span>
              <div style="display:flex; align-items:center;">
                <span class="cloze-blank" data-ans="1950" style="display:inline-block; min-width:90px; height:38px; line-height:34px; border:2px dashed var(--navy); border-radius:6px; text-align:center; cursor:pointer; background:#fff; font-weight:bold; color:var(--blue);">?</span>
                <span style="font-weight:600; margin-left:10px; color:var(--navy);">mL</span>
              </div>
            </div>

            <div style="display:flex; align-items:center; justify-content:space-between; background:rgba(17,45,78,0.03); padding:10px 20px; border-radius:8px; border:1px solid #e2e8f0;">
              <span style="font-weight:600; color:var(--navy);">2. 2 L 300 mL</span>
              <span style="font-weight:bold; color:var(--navy);">&rarr;</span>
              <div style="display:flex; align-items:center;">
                <span class="cloze-blank" data-ans="2300" style="display:inline-block; min-width:90px; height:38px; line-height:34px; border:2px dashed var(--navy); border-radius:6px; text-align:center; cursor:pointer; background:#fff; font-weight:bold; color:var(--blue);">?</span>
                <span style="font-weight:600; margin-left:10px; color:var(--navy);">mL</span>
              </div>
            </div>

            <div style="display:flex; align-items:center; justify-content:space-between; background:rgba(17,45,78,0.03); padding:10px 20px; border-radius:8px; border:1px solid #e2e8f0;">
              <span style="font-weight:600; color:var(--navy);">3. 7530 mL</span>
              <span style="font-weight:bold; color:var(--navy);">&rarr;</span>
              <div style="display:flex; align-items:center; gap:5px;">
                <span class="cloze-blank" data-ans="7" style="display:inline-block; min-width:50px; height:38px; line-height:34px; border:2px dashed var(--navy); border-radius:6px; text-align:center; cursor:pointer; background:#fff; font-weight:bold; color:var(--blue);">?</span>
                <span style="font-weight:600; color:var(--navy); margin-right:10px;">L</span>
                <span class="cloze-blank" data-ans="530" style="display:inline-block; min-width:70px; height:38px; line-height:34px; border:2px dashed var(--navy); border-radius:6px; text-align:center; cursor:pointer; background:#fff; font-weight:bold; color:var(--blue);">?</span>
                <span style="font-weight:600; color:var(--navy);">mL</span>
              </div>
            </div>

            <div style="display:flex; align-items:center; justify-content:space-between; background:rgba(17,45,78,0.03); padding:10px 20px; border-radius:8px; border:1px solid #e2e8f0;">
              <span style="font-weight:600; color:var(--navy);">4. 1075 mL</span>
              <span style="font-weight:bold; color:var(--navy);">&rarr;</span>
              <div style="display:flex; align-items:center; gap:5px;">
                <span class="cloze-blank" data-ans="1" style="display:inline-block; min-width:50px; height:38px; line-height:34px; border:2px dashed var(--navy); border-radius:6px; text-align:center; cursor:pointer; background:#fff; font-weight:bold; color:var(--blue);">?</span>
                <span style="font-weight:600; color:var(--navy); margin-right:10px;">L</span>
                <span class="cloze-blank" data-ans="75" style="display:inline-block; min-width:70px; height:38px; line-height:34px; border:2px dashed var(--navy); border-radius:6px; text-align:center; cursor:pointer; background:#fff; font-weight:bold; color:var(--blue);">?</span>
                <span style="font-weight:600; color:var(--navy);">mL</span>
              </div>
            </div>

          </div>
          <div class="interactive-feedback" id="slide-10-feedback" style="margin-top:10px;"></div>
        </div>
        
        <script>
          (function() {
            const blanks = document.querySelectorAll('#slide-10 .cloze-blank');
            const feedback = document.getElementById('slide-10-feedback');
            
            blanks.forEach(b => {
              b.addEventListener('click', function() {
                b.innerText = b.getAttribute('data-ans');
                b.style.color = 'var(--green-success)';
                b.style.borderColor = 'var(--green-success)';
                b.style.borderStyle = 'solid';
                b.style.background = '#e8f5e9';
              });
            });
            
            document.getElementById('slide-10').addEventListener('show-answer', function() {
              blanks.forEach(b => {
                b.innerText = b.getAttribute('data-ans');
                b.style.color = 'var(--green-success)';
                b.style.borderColor = 'var(--green-success)';
                b.style.borderStyle = 'solid';
                b.style.background = '#e8f5e9';
              });
              feedback.innerHTML = '<span style="color:var(--green-success)">Answers revealed!</span>';
            });
          })();
        </script>
      `,
      teacherNotes: `
        <h3>Compound Conversions CFU</h3>
        <p>Ask students to work through these compound conversions. Direct them to check place value alignments (specifically warning about 1075 mL, where it is 75 mL, not 750 mL).</p>
      `
    },
    {
      title: 'Explicit Instruction: Volume & Displacement',
      theme: 'light',
      standardHtml: `
        <div style="display:flex; gap:20px; align-items:center; margin-top:20px;">
          <div style="flex:1;">
            <p class="intro-text" style="font-size:24px;">When a solid object is immersed into water, it pushes the water up. The volume of fluid pushed up equals the volume of the object.</p>
            <div class="remember-box" style="background:#eef2f6; border-left:6px solid var(--orange); padding:15px; font-size:24px;">
              <strong>Key Equivalence:</strong><br>
              <span style="font-size:28px; color:var(--orange); font-weight:bold;">1 mL = 1 cubic centimetre (cm³)</span><br>
              1 ones block (centicube) has a volume of <strong>1 cm³</strong> and displaces exactly <strong>1 mL</strong> of water.
            </div>
            <p style="margin-top:15px; font-size:22px;">
              In the diagram, a model made of <strong>12 blocks</strong> is immersed. <br>
              Water rises by <strong>12 mL</strong> (from 10 mL to 22 mL). <br>
              Therefore, the model volume is <strong>12 cm³</strong> or <strong>12 mL</strong>.
            </p>
          </div>
          <div style="flex:1; text-align:center;">
            <img src="displacement.png" style="max-width: 100%; height: auto; border: 1px solid #ccc; border-radius: 8px; box-shadow: var(--shadow-md);" alt="Displacement model">
          </div>
        </div>
      `,
      teacherNotes: `
        <h3>Volume and Displacement</h3>
        <p>Explain that capacity (mL, L) refers to how much fluid a container holds, while volume (cm³) is the space occupied by a solid object.</p>
        <p>Establish the 1-to-1 conversion between mL and cm³.</p>
      `
    },
    {
      title: 'CFU: Volume & Capacity Equivalence',
      theme: 'light',
      standardHtml: `
        <span class="cfu-badge" style="position:absolute; top:25px; left:480px; display:inline-block; background:var(--orange); color:white; padding:4px 12px; border-radius:15px; font-size:16px; font-weight:bold;">CFU - Whiteboard Option</span>
        <p class="intro-text">Match the volume/capacity measurements on the left with their equivalents on the right.</p>
        
        <div class="match-container" id="slide-12-match">
          <div class="match-cols-grid">
            <div class="match-col" id="slide-12-left">
              <div class="match-card" data-match="1">42 mL</div>
              <div class="match-card" data-match="2">608 mL</div>
              <div class="match-card" data-match="3">15 cm³</div>
              <div class="match-card" data-match="4">138 cm³</div>
            </div>
            <div class="match-col" id="slide-12-right">
              <div class="match-card" data-match="4">138 mL</div>
              <div class="match-card" data-match="1">42 cm³</div>
              <div class="match-card" data-match="3">15 mL</div>
              <div class="match-card" data-match="2">608 cm³</div>
            </div>
          </div>
          <div class="interactive-feedback" id="slide-12-feedback" style="margin-top:15px;"></div>
          <div class="hint-box" id="slide-12-hint">
            <strong>Hint:</strong> Remember, the conversion is 1-to-1! 1 mL is exactly equal to 1 cubic centimetre (cm³).
          </div>
        </div>
        
        <script>
          (function() {
            const container = document.getElementById('slide-12-match');
            const leftCol = document.getElementById('slide-12-left');
            const rightCol = document.getElementById('slide-12-right');
            const feedback = document.getElementById('slide-12-feedback');
            const hint = document.getElementById('slide-12-hint');
            
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
                  feedback.innerHTML = '<span style="color:var(--green-success)">✓ All equivalents matched successfully!</span>';
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
                  tempLeft.classList.remove('incorrect-match', 'selected');
                  tempRight.classList.remove('incorrect-match', 'selected');
                }, 800);
                selectedLeft = null;
                selectedRight = null;
                if (mistakesCount >= 2) {
                  hint.style.display = 'block';
                }
              }
            }
            
            document.getElementById('slide-12').addEventListener('show-answer', function() {
              leftCol.querySelectorAll('.match-card').forEach(c => c.classList.add('matched'));
              rightCol.querySelectorAll('.match-card').forEach(c => c.classList.add('matched'));
              feedback.innerHTML = '<span style="color:var(--green-success)">Answers revealed: Equivalents matched!</span>';
              hint.style.display = 'none';
            });
          })();
        </script>
      `,
      teacherNotes: `
        <h3>Volume-Capacity CFU</h3>
        <p>Ensure students appreciate the difference in terminology (capacity for fluids, volume for 3D solids) but the absolute numerical equivalence in metric scale (mL = cm³).</p>
      `
    },
    {
      title: 'Exit Ticket',
      theme: 'dark',
      standardHtml: `
        <div style="max-width:800px; margin:0 auto; text-align:left;">
          <p style="font-size:28px; text-align:center; color:var(--orange); font-weight:bold; margin-bottom:30px;">Show what you have learned!</p>
          <div style="background:rgba(255,255,255,0.1); padding:25px; border-radius:8px; font-size:24px; line-height:1.8;">
            1. Convert 5.4 L to millilitres: __________ mL<br>
            2. Convert 7530 mL to Litres and millilitres: ____ L ____ mL<br>
            3. Convert 138 cm³ to millilitres: __________ mL
          </div>
        </div>
      `,
      teacherNotes: `
        <h3>Consolidation checklist</h3>
        <p>Verify exit ticket solutions before dismissing the class. Ensure students understand how place value shift rules apply to mL/L conversions.</p>
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
  compiledContent = compiledContent.replace('<title>Classroom Presentation Template</title>', '<title>Converting Capacity Measurements</title>');
  
  fs.writeFileSync(outputPath, compiledContent, 'utf8');
  console.log(`✅ Interactive HTML Presentation generated: ${path.basename(outputPath)}`);
}

// --- 5. GENERATE MS FORMS ASSESSMENT (DOCX) ---
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
        new Paragraph({ style: 'TitleStyle', children: [new TextRun('Assessment: Converting Capacity Measurements (Forms Import)')] }),
        new Paragraph({ children: [new TextRun('This quiz is formatted for direct import into Microsoft Forms.')] }),
        new Paragraph({ spacing: { after: 300 } }),

        ...createFormsQuestion(1, 'How many millilitres are in 4 L?', '4000 mL', ['40 mL', '400 mL', '4000 mL', '40000 mL'], 'C'),
        ...createFormsQuestion(2, 'How many millilitres are in 5.3 L?', '5300 mL', ['53 mL', '530 mL', '5300 mL', '0.53 mL'], 'C'),
        ...createFormsQuestion(3, 'How many litres are in 9000 mL?', '9 L', ['0.9 L', '9 L', '90 L', '900 L'], 'B'),
        ...createFormsQuestion(4, 'How many litres are in 1500 mL?', '1.5 L', ['1.5 L', '15 L', '150 L', '0.15 L'], 'A'),
        ...createFormsQuestion(5, 'Write 1 L 600 mL in millilitres:', '1600 mL', ['160 mL', '1060 mL', '1600 mL', '16000 mL'], 'C'),
        ...createFormsQuestion(6, 'Write 7530 mL as litres and millilitres:', '7 L 530 mL', ['7 L 53 mL', '7 L 530 mL', '75 L 30 mL', '7.53 L'], 'B'),
        ...createFormsQuestion(7, 'If a block model of 12 cubes is immersed in a calibrated cylinder, how much water does it displace?', '12 mL', ['1.2 mL', '12 mL', '120 mL', '22 mL'], 'B'),
        ...createFormsQuestion(8, 'Convert 42 mL to cubic centimetres:', '42 cm³', ['4.2 cm³', '42 cm³', '420 cm³', '4200 cm³'], 'B'),
        ...createFormsQuestion(9, 'Convert 138 cubic centimetres to millilitres:', '138 mL', ['1.38 mL', '13.8 mL', '138 mL', '1380 mL'], 'C'),
        ...createFormsQuestion(10, 'Which of the following lists capacity units from smallest to largest?', 'mL, L, kL', ['L, mL, kL', 'mL, kL, L', 'mL, L, kL', 'kL, L, mL'], 'C')
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
  console.log('🚀 Starting compilation of Converting Capacity Measurements lesson pack...');
  
  // 1. Generate SVG image assets
  await generateBeakerImage('A', 250, 'A', 'Sauce', '#8B4513', beakerAPath);
  await generateBeakerImage('B', 375, 'B', 'Soft Drink', '#c0c0c0', beakerBPath);
  await generateBeakerImage('C', 125, 'C', 'Eucalyptus Oil', '#2d6a4f', beakerCPath);
  await generateDisplacementImage(displacementPath);
  
  // 2. Generate documents
  await generateHandout(handoutPath);
  generatePresentation(presentationPath);
  await generateAssessment(assessmentPath);
  
  console.log('🎉 Lesson Pack generated successfully!');
}

run().catch(err => {
  console.error('❌ Error during compilation:', err);
  process.exit(1);
});
