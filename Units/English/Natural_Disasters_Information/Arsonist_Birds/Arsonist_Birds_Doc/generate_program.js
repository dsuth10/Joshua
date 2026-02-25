const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType, VerticalAlign } = require('docx');
const fs = require('fs');
const path = require('path');

const outputDir = "c:\\Users\\dsuth\\Documents\\Joshua\\Arsonist_Birds_Doc";
const fileName = "5C_Class_Program_2026-02-03.docx";

const THEME = {
    font: "Arial",
    headerColor: "2B2B2B",
    borderColor: "CCCCCC",
    shadingColor: "F9F9F9"
};

const createCell = (text, isHeader = false, width = 3120) => {
    return new TableCell({
        width: { size: width, type: WidthType.DXA },
        shading: isHeader ? { fill: "E0E0E0", type: ShadingType.CLEAR } : { fill: THEME.shadingColor, type: ShadingType.CLEAR },
        verticalAlign: VerticalAlign.CENTER,
        margins: { top: 100, bottom: 100, left: 100, right: 100 },
        children: [new Paragraph({
            alignment: isHeader ? AlignmentType.CENTER : AlignmentType.LEFT,
            children: [new TextRun({ text: text, bold: isHeader, font: THEME.font, size: isHeader ? 24 : 22 })]
        })]
    });
};

const createRow = (time, activity, isHeader = false) => {
    return new TableRow({
        children: [
            createCell(time, isHeader, 2000),
            createCell(activity, isHeader, 3000),
            createCell(isHeader ? "Details" : "", isHeader, 4360) // Extra space for user details
        ]
    });
};

const doc = new Document({
    styles: {
        default: { document: { run: { font: THEME.font, size: 22 } } }
    },
    sections: [{
        children: [
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 200 },
                children: [new TextRun({ text: "CLASS PROGRAM: 5C", bold: true, size: 36, font: THEME.font })]
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 400 },
                children: [new TextRun({ text: "Tuesday, 3rd February 2026", size: 28, font: THEME.font })]
            }),

            new Table({
                width: { size: 9360, type: WidthType.DXA },
                rows: [
                    createRow("Time", "Activity", true),
                    createRow("9:10 am", "Signpost Maths (1 hour)"),
                    createRow("10:10 am", "English Comprehension Activity (1 hour)"),
                    createRow("11:10 am", "BREAK", true),
                    createRow("11:50 am", "Japanese (1 hour)"),
                    createRow("12:50 pm", "Spelling"),
                    createRow("Lunch", "BREAK", true),
                    createRow("Afternoon", "Science")
                ]
            }),

            new Paragraph({
                spacing: { before: 400 },
                children: [new TextRun({ text: "Notes / Reminders:", bold: true, font: THEME.font })]
            }),
            new Paragraph({
                spacing: { before: 200 },
                children: [new TextRun({ text: "__________________________________________________________________________", font: THEME.font })]
            }),
            new Paragraph({
                spacing: { before: 200 },
                children: [new TextRun({ text: "__________________________________________________________________________", font: THEME.font })]
            }),
            new Paragraph({
                spacing: { before: 200 },
                children: [new TextRun({ text: "__________________________________________________________________________", font: THEME.font })]
            })
        ]
    }]
});

Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync(path.join(outputDir, fileName), buffer);
    console.log(`Success: Program created at ${path.join(outputDir, fileName)}`);
}).catch(err => {
    console.error("Error creating program:", err);
    process.exit(1);
});
