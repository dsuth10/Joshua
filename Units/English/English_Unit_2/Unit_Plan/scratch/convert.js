const fs = require('fs');
const marked = require('marked');
const docx = require('docx');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, BorderStyle, WidthType, ShadingType, VerticalAlign, AlignmentType, PageOrientation } = docx;

const mdContent = fs.readFileSync('../Teaching_and_Learning_Sequence.md', 'utf8');

// Custom renderer to just use tokens
const lexer = new marked.Lexer();
const tokens = lexer.lex(mdContent);

function processText(text) {
    if (!text) return [];
    
    // Replace quotes with smart quotes
    let cleanText = text.replace(/"([^"]*)"/g, '\u201C$1\u201D').replace(/'([^']*)'/g, '\u2018$1\u2019');
    
    const parts = cleanText.split(/(\*\*.*?\*\*|\*.*?\*|__.*?__|_.*?_)/g);
    return parts.map(part => {
        if (!part) return null;
        if (part.startsWith('**') && part.endsWith('**')) {
            return new TextRun({ text: part.slice(2, -2), bold: true });
        } else if (part.startsWith('*') && part.endsWith('*')) {
            return new TextRun({ text: part.slice(1, -1), italics: true });
        } else if (part.startsWith('__') && part.endsWith('__')) {
            return new TextRun({ text: part.slice(2, -2), bold: true });
        } else if (part.startsWith('_') && part.endsWith('_')) {
            return new TextRun({ text: part.slice(1, -1), italics: true });
        } else {
            return new TextRun({ text: part });
        }
    }).filter(Boolean);
}

const docChildren = [];
const tableBorder = { style: BorderStyle.SINGLE, size: 2, color: "CCCCCC" };
const cellBorders = { top: tableBorder, bottom: tableBorder, left: tableBorder, right: tableBorder };
const usableWidth = 13958;

for (const token of tokens) {
    if (token.type === 'heading') {
        let level;
        if (token.depth === 1) level = HeadingLevel.TITLE;
        else if (token.depth === 2) level = HeadingLevel.HEADING_1;
        else if (token.depth === 3) level = HeadingLevel.HEADING_2;
        else level = HeadingLevel.HEADING_3;
        
        docChildren.push(new Paragraph({
            heading: level,
            children: processText(token.text)
        }));
    } else if (token.type === 'paragraph') {
        docChildren.push(new Paragraph({
            children: processText(token.text)
        }));
    } else if (token.type === 'space') {
        // Ignored or add small spacing
    } else if (token.type === 'hr') {
        // No direct HR in docx, ignore or add empty para
    } else if (token.type === 'table') {
        const header = token.header;
        const rows = token.rows;
        
        const numCols = header.length;
        const colWidth = Math.floor(usableWidth / numCols);
        const remainder = usableWidth % numCols;
        const columnWidths = Array(numCols).fill(colWidth);
        columnWidths[numCols - 1] += remainder;

        const tableRows = [];
        
        // Header
        tableRows.push(new TableRow({
            tableHeader: true,
            children: header.map((cell, i) => {
                return new TableCell({
                    borders: cellBorders,
                    width: { size: columnWidths[i], type: WidthType.DXA },
                    shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                    verticalAlign: VerticalAlign.CENTER,
                    children: [new Paragraph({
                        children: processText(cell.text) // Could make it bold implicitly, but relying on markdown
                    })]
                });
            })
        }));
        
        // Data rows
        for (const row of rows) {
            tableRows.push(new TableRow({
                children: row.map((cell, i) => {
                    return new TableCell({
                        borders: cellBorders,
                        width: { size: columnWidths[i], type: WidthType.DXA },
                        children: [new Paragraph({
                            children: processText(cell.text)
                        })]
                    });
                })
            }));
        }
        
        docChildren.push(new Table({
            columnWidths: columnWidths,
            margins: { top: 100, bottom: 100, left: 180, right: 180 },
            rows: tableRows
        }));
        
        docChildren.push(new Paragraph({ text: "" })); // spacing after table
    } else if (token.type === 'blockquote') {
        docChildren.push(new Paragraph({
            style: "Quote",
            children: processText(token.text)
        }));
    }
}

const doc = new Document({
    styles: {
        default: { document: { run: { font: "Arial", size: 24 } } },
        paragraphStyles: [
            { id: "Title", name: "Title", basedOn: "Normal",
              run: { size: 48, bold: true, color: "000000", font: "Arial" },
              paragraph: { spacing: { before: 240, after: 120 }, alignment: AlignmentType.CENTER } },
            { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
              run: { size: 36, bold: true, color: "1A365D", font: "Arial" },
              paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 } },
            { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
              run: { size: 28, bold: true, color: "2B6CB0", font: "Arial" },
              paragraph: { spacing: { before: 180, after: 120 }, outlineLevel: 1 } },
            { id: "Quote", name: "Quote", basedOn: "Normal",
              run: { italics: true, color: "4A5568" },
              paragraph: { indent: { left: 720 }, spacing: { before: 120, after: 120 } } }
        ]
    },
    sections: [{
        properties: {
            page: {
                size: { width: 16838, height: 11906, orientation: PageOrientation.LANDSCAPE }, // landscape A4 -> width & height swapped visually by Word but DXA needs careful setting per docx-js doc, it says "docx-js swaps them internally when orientation: PageOrientation.LANDSCAPE is set". So we pass portrait dimensions!
// wait, docx-js doc says "For Australian standard, use A4 (11906 x 16838 DXA). docx-js swaps them internally".
// So I will pass size: { width: 11906, height: 16838, orientation: PageOrientation.LANDSCAPE } instead of swapping manually.
            }
        },
        children: docChildren
    }]
});

// Fix page size
// (removed unsafe internal property access)

const correctDoc = new Document({
    styles: {
        default: { document: { run: { font: "Arial", size: 20 } } }, // 10pt for readability in tables
        paragraphStyles: [
            { id: "Title", name: "Title", basedOn: "Normal",
              run: { size: 48, bold: true, color: "000000", font: "Arial" },
              paragraph: { spacing: { before: 240, after: 120 }, alignment: AlignmentType.CENTER } },
            { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
              run: { size: 32, bold: true, color: "1A365D", font: "Arial" },
              paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 } },
            { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
              run: { size: 26, bold: true, color: "2B6CB0", font: "Arial" },
              paragraph: { spacing: { before: 180, after: 120 }, outlineLevel: 1 } },
            { id: "Quote", name: "Quote", basedOn: "Normal",
              run: { italics: true, color: "4A5568" },
              paragraph: { indent: { left: 720 }, spacing: { before: 120, after: 120 } } }
        ]
    },
    sections: [{
        properties: {
            page: {
                margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
                size: { width: 11906, height: 16838, orientation: PageOrientation.LANDSCAPE }
            }
        },
        children: docChildren
    }]
});

Packer.toBuffer(correctDoc).then(buffer => {
    fs.writeFileSync('../Teaching_and_Learning_Sequence.docx', buffer);
    console.log("Document generated successfully!");
}).catch(e => console.error("Error formatting document:", e));
