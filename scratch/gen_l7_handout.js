const { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle } = require('docx');
const fs = require('fs');

const tableBorder = { style: BorderStyle.SINGLE, size: 1, color: "000000" };
const cellBorders = { top: tableBorder, bottom: tableBorder, left: tableBorder, right: tableBorder };

const doc = new Document({
    styles: {
        default: { document: { run: { font: "Arial", size: 24 } } },
        paragraphStyles: [
            { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", run: { size: 36, bold: true }, paragraph: { spacing: { before: 240, after: 240 }, alignment: AlignmentType.CENTER } },
            { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", run: { size: 28, bold: true }, paragraph: { spacing: { before: 200, after: 120 } } }
        ]
    },
    sections: [{
        children: [
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Lesson 7 Handout: Cyclone Structure & Convection")] }),
            
            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Section A: Cyclone Structure Diagram")] }),
            new Paragraph({ children: [new TextRun("Label the diagram of the cyclone with the following terms: Eye, Eye Wall, Rain Bands, Spiral Arms, Warm Air Rising, Cool Air Sinking.")] }),
            new Paragraph({ children: [new TextRun("[IMAGE PLACEHOLDER: CYCLONE STRUCTURE]")] }),
            new Paragraph({ spacing: { before: 400 }, children: [new TextRun("Section B: Annotations")] }),
            new Paragraph({ children: [new TextRun("Choose 4 labels from above and add an annotation (explanation) for each:")] }),
            new Paragraph({ children: [new TextRun("1. ________________: ___________________________________________")] }),
            new Paragraph({ children: [new TextRun("2. ________________: ___________________________________________")] }),
            new Paragraph({ children: [new TextRun("3. ________________: ___________________________________________")] }),
            new Paragraph({ children: [new TextRun("4. ________________: ___________________________________________")] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Section C: Reading Comprehension")] }),
            new Paragraph({ children: [new TextRun("1. Why did many homes fail during Cyclone Althea?")] }),
            new Paragraph({ children: [new TextRun("____________________________________________________________")] }),
            new Paragraph({ children: [new TextRun("2. What is the role of the Cyclone Testing Station?")] }),
            new Paragraph({ children: [new TextRun("____________________________________________________________")] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Section D: Convection Investigation")] }),
            new Paragraph({ children: [new TextRun("Prediction: What will happen when hot red water is added to cold blue water?")] }),
            new Paragraph({ children: [new TextRun("____________________________________________________________")] }),
            new Paragraph({ children: [new TextRun("Draw your annotated diagram of the results below:")] }),
            new Paragraph({ children: [new TextRun("[SPACE FOR DIAGRAM]")] })
        ]
    }]
});

Packer.toBuffer(doc).then(buffer => fs.writeFileSync("Lessons_06_08/Lesson_07/Lesson_07_Handout.docx", buffer));
