const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType,
    PageOrientation, HeadingLevel, WidthType, ShadingType, VerticalAlign, BorderStyle } = require('docx');

const data = JSON.parse(fs.readFileSync('sequence_data.json', 'utf8'));

const tableBorder = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const cellBorders = { top: tableBorder, bottom: tableBorder, left: tableBorder, right: tableBorder };

// Column widths for Landscape (Total ~15840 DXA approx for A4 landscape with 1" margins)
// A4 landscape is 11.69 inches wide. With 1" margins, usable width is 9.69 inches.
// 1440 DXA per inch. 9.69 * 1440 = 13953.6 DXA. Let's aim for ~13900 total.
// Wk (400), Seq (400), Les (400), LI (1800), Sequence (4500), Read (1200), Diff (3500), Res (1700) = 13900
const COL_WIDTHS = [500, 500, 500, 2000, 4200, 1100, 3500, 1600];

function createHeaderCell(text) {
    return new TableCell({
        borders: cellBorders,
        shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
        verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 120, after: 120 },
            children: [new TextRun({ text: text, bold: true, size: 20, font: "Arial" })]
        })]
    });
}

function createDataCell(text, align = AlignmentType.LEFT) {
    // Process markdown line breaks <br> into separate paragraphs
    const paragraphs = text.split('<br>').map(t => {
        const cleanText = t.replace(/\*\*/g, '').trim(); // Remove bold markers for cleaner look in Word
        return new Paragraph({
            spacing: { before: 80, after: 80 },
            alignment: align,
            children: [new TextRun({ text: cleanText, size: 18, font: "Arial" })]
        });
    });

    return new TableCell({
        borders: cellBorders,
        verticalAlign: VerticalAlign.TOP,
        children: paragraphs
    });
}

const headerRow = new TableRow({
    tableHeader: true,
    children: [
        createHeaderCell("Week"),
        createHeaderCell("Seq"),
        createHeaderCell("Les"),
        createHeaderCell("Learning Intention"),
        createHeaderCell("Teaching Sequence"),
        createHeaderCell("Reading"),
        createHeaderCell("Differentiation"),
        createHeaderCell("Resources")
    ]
});

const dataRows = data.map(item => new TableRow({
    children: [
        createDataCell(item.week, AlignmentType.CENTER),
        createDataCell(item.sequence, AlignmentType.CENTER),
        createDataCell(item.lesson, AlignmentType.CENTER),
        createDataCell(item.li),
        createDataCell(item.sequence_text),
        createDataCell(item.reading),
        createDataCell(item.diff),
        createDataCell(item.resources)
    ]
}));

const sequenceTable = new Table({
    columnWidths: COL_WIDTHS,
    rows: [headerRow, ...dataRows]
});

const doc = new Document({
    styles: {
        default: { document: { run: { font: "Arial", size: 22 } } },
        paragraphStyles: [
            {
                id: "Title", name: "Title", basedOn: "Normal", run: { size: 48, bold: true, color: "2E5984", font: "Arial" },
                paragraph: { spacing: { before: 240, after: 240 }, alignment: AlignmentType.CENTER }
            },
            {
                id: "Heading1", name: "Heading 1", basedOn: "Normal", run: { size: 28, bold: true, color: "2E5984", font: "Arial" },
                paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 }
            }
        ]
    },
    sections: [{
        properties: {
            page: {
                size: { orientation: PageOrientation.LANDSCAPE },
                margin: { top: 720, right: 720, bottom: 720, left: 720 } // 0.5 inch margins for more space
            }
        },
        children: [
            new Paragraph({ text: "English Teaching Sequence: Eliza Bird: Child Convict", heading: HeadingLevel.TITLE }),
            new Paragraph({
                alignment: AlignmentType.CENTER, children: [
                    new TextRun({ text: "Combined Year 3/4 | Historical Fiction Unit", italics: true, color: "666666" })
                ]
            }),
            new Paragraph({ spacing: { before: 240 } }),
            sequenceTable
        ]
    }]
});

Packer.toBuffer(doc).then(buffer => {
    fs.writeFileSync("Year34_English_Sequence/Eliza_Bird_Sequence.docx", buffer);
    console.log("Document created successfully at Year34_English_Sequence/Eliza_Bird_Sequence.docx");
});
