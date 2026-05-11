const { 
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, 
  AlignmentType, LevelFormat, HeadingLevel, BorderStyle, WidthType, 
  ShadingType, VerticalAlign, PageBreak, Header, Footer, PageNumber 
} = require('docx');
const fs = require('fs');

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Title", name: "Title", basedOn: "Normal",
        run: { size: 48, bold: true, color: "1F4E78", font: "Arial" },
        paragraph: { spacing: { before: 240, after: 120 }, alignment: AlignmentType.CENTER } },
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, color: "2E75B6", font: "Arial" },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 } },
      { id: "TierHeader", name: "Tier Header", basedOn: "Normal",
        run: { size: 24, bold: true, color: "C00000", font: "Arial" },
        paragraph: { spacing: { before: 200, after: 100 } } }
    ]
  },
  sections: [{
    properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
    headers: {
      default: new Header({
        children: [
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ text: "Name: ________________________  Date: ________", size: 20 })]
          })
        ]
      })
    },
    footers: {
      default: new Footer({
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "Quantum Quest Theme Park Engineering Dept | Page ", size: 16 }), new TextRun({ children: [PageNumber.CURRENT] })]
          })
        ]
      })
    },
    children: [
      new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun("Maths Mission: Long Multiplication")] }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Quantum Quest Theme Park Logistics", italics: true, color: "548235" })]
      }),

      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("The Algorithm Blueprint")] }),
      new Paragraph({
        children: [
          new TextRun("To multiply by a 2-digit number:"),
        ]
      }),
      new Paragraph({ children: [new TextRun("1. Multiply by the units digit.")], spacing: { before: 100 } }),
      new Paragraph({ children: [new TextRun("2. Put down the "), new TextRun({ text: "Magic Zero", bold: true, color: "FF0000" }), new TextRun(" (the placeholder).")] }),
      new Paragraph({ children: [new TextRun("3. Multiply by the tens digit.")] }),
      new Paragraph({ children: [new TextRun("4. Add the results together.")] }),

      new Paragraph({ style: "TierHeader", children: [new TextRun("Tier 1: Junior Builders (Support)")] }),
      new Paragraph({ children: [new TextRun("Use the grids below to calculate the supplies. The Magic Zero is pre-filled for you!")] }),
      
      // Grid for 12 x 23
      new Paragraph({ children: [new TextRun("a) 12 x 23 (Ordering 12 boxes of 23 anti-gravity pins)")], spacing: { before: 200 } }),
      createMultiplicationTable(1, 2, 2, 3, true),

      new Paragraph({ style: "TierHeader", children: [new TextRun("Tier 2: Senior Engineers (Core)")] }),
      new Paragraph({ children: [new TextRun("Apply the standard algorithm to solve these ride capacity challenges. Remember the Magic Zero!")] }),
      
      new Paragraph({ children: [new TextRun("a) 24 x 35 (24 carriages with 35 seats each)")], spacing: { before: 200 } }),
      createMultiplicationTable(2, 4, 3, 5, false),

      new Paragraph({ children: [new TextRun("b) 42 x 56 (42 staff members working 56 hours each)")], spacing: { before: 200 } }),
      createMultiplicationTable(4, 2, 5, 6, false),

      new Paragraph({ style: "TierHeader", children: [new TextRun("Tier 3: Project Directors (Extension)")] }),
      new Paragraph({ children: [new TextRun("Solve these complex budget and logistics problems.")] }),

      new Paragraph({ 
        children: [
          new TextRun("Problem: "),
          new TextRun({ text: "The Cosmic Coaster carries 24 people per trip. It runs 32 times a day. If each ticket costs $15, how much total revenue is made in one day?", bold: true })
        ],
        spacing: { before: 200 }
      }),
      new Paragraph({ children: [new TextRun("Space for Working:")], spacing: { before: 100 } }),
      // Empty grid for working
      createEmptyGrid(6, 6)
    ]
  }]
});

function createMultiplicationTable(n1_1, n1_2, n2_1, n2_2, prefillZero) {
  const border = { style: BorderStyle.SINGLE, size: 1, color: "000000" };
  const cellBorders = { top: border, bottom: border, left: border, right: border };
  
  return new Table({
    columnWidths: [400, 400, 400, 400],
    rows: [
      new TableRow({ children: [
        new TableCell({ children: [] }), 
        new TableCell({ children: [] }), 
        new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun(n1_1.toString())] })] }), 
        new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun(n1_2.toString())] })] })
      ]}),
      new TableRow({ children: [
        new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun("x")] })] }), 
        new TableCell({ children: [] }), 
        new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun(n2_1.toString())] })] }), 
        new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun(n2_2.toString())] })] })
      ]}),
      new TableRow({ children: [
        new TableCell({ children: [], borders: { bottom: { style: BorderStyle.DOUBLE, size: 2 } } }), 
        new TableCell({ children: [], borders: { bottom: { style: BorderStyle.DOUBLE, size: 2 } } }), 
        new TableCell({ children: [], borders: { bottom: { style: BorderStyle.DOUBLE, size: 2 } } }), 
        new TableCell({ children: [], borders: { bottom: { style: BorderStyle.DOUBLE, size: 2 } } })
      ]}),
      new TableRow({ children: [
        new TableCell({ children: [] }), 
        new TableCell({ children: [] }), 
        new TableCell({ children: [], borders: cellBorders }), 
        new TableCell({ children: [], borders: cellBorders })
      ]}),
      new TableRow({ children: [
        new TableCell({ children: [] }), 
        new TableCell({ children: [], borders: cellBorders }), 
        new TableCell({ children: [], borders: cellBorders }), 
        new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: prefillZero ? "0" : "", color: "FF0000", bold: true })] })], borders: cellBorders })
      ]}),
      new TableRow({ children: [
        new TableCell({ children: [], borders: { bottom: { style: BorderStyle.SINGLE, size: 1 } } }), 
        new TableCell({ children: [], borders: { bottom: { style: BorderStyle.SINGLE, size: 1 } } }), 
        new TableCell({ children: [], borders: { bottom: { style: BorderStyle.SINGLE, size: 1 } } }), 
        new TableCell({ children: [], borders: { bottom: { style: BorderStyle.SINGLE, size: 1 } } })
      ]}),
      new TableRow({ children: [
        new TableCell({ children: [] }), 
        new TableCell({ children: [], borders: cellBorders }), 
        new TableCell({ children: [], borders: cellBorders }), 
        new TableCell({ children: [], borders: cellBorders })
      ]})
    ]
  });
}

function createEmptyGrid(rows, cols) {
  const border = { style: BorderStyle.DOTTED, size: 1, color: "CCCCCC" };
  const cellBorders = { top: border, bottom: border, left: border, right: border };
  
  const tableRows = [];
  for (let i = 0; i < rows; i++) {
    const cells = [];
    for (let j = 0; j < cols; j++) {
      cells.push(new TableCell({ children: [], borders: cellBorders, width: { size: 400, type: WidthType.DXA } }));
    }
    tableRows.push(new TableRow({ children: cells }));
  }
  
  return new Table({
    columnWidths: Array(cols).fill(400),
    rows: tableRows
  });
}

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("Math_Year5_Multiplication_Long/handout.docx", buffer);
  console.log("Handout generated successfully.");
});
