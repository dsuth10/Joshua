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

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Section B: Annotated Diagram")] }),
            new Paragraph({ children: [new TextRun("Choose at least 6 labels from above and add a detailed annotation (explanation) for each. Describe what each part does:")] }),
            new Paragraph({ spacing: { before: 120 }, children: [new TextRun("1. ________________: ___________________________________________")] }),
            new Paragraph({ children: [new TextRun("2. ________________: ___________________________________________")] }),
            new Paragraph({ children: [new TextRun("3. ________________: ___________________________________________")] }),
            new Paragraph({ children: [new TextRun("4. ________________: ___________________________________________")] }),
            new Paragraph({ children: [new TextRun("5. ________________: ___________________________________________")] }),
            new Paragraph({ children: [new TextRun("6. ________________: ___________________________________________")] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Section C: Reading Comprehension")] }),
            new Paragraph({ children: [new TextRun("1. Why did many homes fail during Cyclone Althea?")] }),
            new Paragraph({ children: [new TextRun("____________________________________________________________")] }),
            new Paragraph({ children: [new TextRun("2. What is the role of the Cyclone Testing Station?")] }),
            new Paragraph({ children: [new TextRun("____________________________________________________________")] }),
            new Paragraph({ children: [new TextRun("3. What was 'Operation Navy Help'?")] }),
            new Paragraph({ children: [new TextRun("____________________________________________________________")] }),
            new Paragraph({ children: [new TextRun("4. How did Cyclone Tracy change building codes?")] }),
            new Paragraph({ children: [new TextRun("____________________________________________________________")] }),
            new Paragraph({ children: [new TextRun("5. Identify two ways modern houses are safer than pre-1974 houses.")] }),
            new Paragraph({ children: [new TextRun("____________________________________________________________")] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Section D: Convection & Cyclone Formation")] }),
            new Paragraph({ children: [new TextRun("In your own words, describe how convection currents lead to the formation of a tropical cyclone.")] }),
            new Paragraph({ children: [new TextRun("____________________________________________________________")] }),
            new Paragraph({ children: [new TextRun("____________________________________________________________")] }),
            new Paragraph({ children: [new TextRun("____________________________________________________________")] })
        ]
    }]
});

Packer.toBuffer(doc).then(buffer => fs.writeFileSync("Lessons_06_08/Lesson_07/Lesson_07_Handout_NEW.docx", buffer));
