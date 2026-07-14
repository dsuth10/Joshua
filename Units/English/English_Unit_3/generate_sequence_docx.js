const fs = require('fs');
const path = require('path');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType,
    PageOrientation, HeadingLevel, WidthType, ShadingType, VerticalAlign, BorderStyle } = require('docx');

const dataPath = path.join(__dirname, 'sequence_data.json');
const outputPath = path.join(__dirname, 'English_Unit_3_Plan_Sequence.docx');

const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const tableBorder = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const cellBorders = { top: tableBorder, bottom: tableBorder, left: tableBorder, right: tableBorder };

// Column widths for Landscape (Total ~13900 total: Wk (500), Seq (500), Les (500), LI (2000), Sequence (4200), Read (1100), Diff (3500), Res (1600))
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

function parseTextRuns(text) {
    // Splits text by markdown bold marker '**' and alternates between normal and bold runs.
    const parts = text.split('**');
    return parts.map((part, index) => {
        const isBold = index % 2 === 1;
        return new TextRun({ text: part, bold: isBold, size: 18, font: "Arial" });
    });
}

function createDataCell(text, align = AlignmentType.LEFT) {
    // Process markdown line breaks <br> into separate paragraphs
    const paragraphs = text.split('<br>').map(t => {
        return new Paragraph({
            spacing: { before: 80, after: 80 },
            alignment: align,
            children: parseTextRuns(t.trim())
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
                id: "Title", name: "Title", basedOn: "Normal", run: { size: 36, bold: true, color: "1A365D", font: "Arial" },
                paragraph: { spacing: { before: 240, after: 240 }, alignment: AlignmentType.CENTER }
            },
            {
                id: "Heading1", name: "Heading 1", basedOn: "Normal", run: { size: 24, bold: true, color: "1A365D", font: "Arial" },
                paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 }
            }
        ]
    },
    sections: [{
        properties: {
            page: {
                size: { orientation: PageOrientation.LANDSCAPE },
                margin: { top: 720, right: 720, bottom: 720, left: 720 } // 0.5 inch margins
            }
        },
        children: [
            new Paragraph({ text: "English Unit 3: Examining, creating and sharing persuasive texts", heading: HeadingLevel.TITLE }),
            new Paragraph({
                alignment: AlignmentType.CENTER, children: [
                    new TextRun({ text: "Year 5 & 6 Term 2 Plan | Core Text: Berani by Glenda Millard", italics: true, color: "555555" })
                ]
            }),
            new Paragraph({ spacing: { before: 240 } }),
            sequenceTable
        ]
    }]
});

Packer.toBuffer(doc).then(buffer => {
    fs.writeFileSync(outputPath, buffer);
    console.log(`Document created successfully at: ${outputPath}`);
});
