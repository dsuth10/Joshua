const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType, VerticalAlign } = require('docx');
const fs = require('fs');

const doc = new Document({
    styles: {
        default: { document: { run: { font: "Arial", size: 24 } } },
        paragraphStyles: [
            { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 32, bold: true, color: "000000", font: "Arial" }, paragraph: { spacing: { before: 240, after: 120 } } },
            { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 28, bold: true, color: "000000", font: "Arial" }, paragraph: { spacing: { before: 180, after: 120 } } },
        ],
    },
    sections: [{
        children: [
            new Paragraph({ text: "NAPLAN Narrative Marking Report", heading: HeadingLevel.TITLE, alignment: AlignmentType.CENTER }),
            new Paragraph({ children: [new TextRun({ text: "Student Name: ", bold: true }), new TextRun("Laikyn Carr")] }),
            new Paragraph({ children: [new TextRun({ text: "Date: ", bold: true }), new TextRun("2026-01-28")] }),
            new Paragraph({ children: [new TextRun({ text: "Total Score: ", bold: true }), new TextRun("15/47")] }),

            new Paragraph({ text: "Executive Summary", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: "Overall Strengths", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "• Clear narrative arc with a defined beginning, middle, and end.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Good use of dialogue to express character personalities and motivations.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Inclusion of a moral/thematic conclusion about saving lives and leadership.", numbering: { reference: "bullet-points", level: 0 } }),

            new Paragraph({ text: "Areas for Development", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "• Spelling accuracy—focus on common words like 'family', 'because', and 'together'.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Punctuation control—practicing the use of full stops and capital letters at the end and start of sentences.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Descriptive detail—adding more information about how characters look and where they are.", numbering: { reference: "bullet-points", level: 0 } }),

            new Paragraph({ text: "Detailed Assessment by Criterion", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: "1. Audience (2/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Successfully orients the reader to the conflict between the toads and the crow." }),
            new Paragraph({ text: "Evidence: \"But the toads don't know wiye until the crow yield...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Try to use more descriptive words to show how scary the crow is to make the reader feel more for the toads." }),

            new Paragraph({ text: "2. Text Structure (2/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Follows a basic narrative structure including orientation, complication, and resolution." }),
            new Paragraph({ text: "Evidence: \"And that is how that toad became a king.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Work on expanding each section. For example, describe the toad family's home before the crow arrives." }),

            new Paragraph({ text: "3. Ideas (2/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: The core idea of a brave animal saving its family is clear and well-carried through the text." }),
            new Paragraph({ text: "Evidence: \"...sqwert owt his poison that hit the crows eye...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Think about why the toad wanted to be king. Was it just because of the poison, or did he have other ideas for the family?" }),

            new Paragraph({ text: "4. Character and Setting (1/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Characters are present but lack individual detail. The setting is not described." }),
            new Paragraph({ text: "Evidence: \"The Toad femly runs togfer...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Use words to describe the toad—is he green, small, or have bumpy skin?" }),

            new Paragraph({ text: "5. Vocabulary (2/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Uses some descriptive verbs like 'hunting' and 'sqwert' (squirt)." }),
            new Paragraph({ text: "Evidence: \"...brave enough to sqwert owt his poison...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Keep a list of interesting words from books you read and try to use one or two in your next story." }),

            new Paragraph({ text: "6. Cohesion (2/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Narrative flow is maintained through simple connectives like 'But' and 'And which'. " }),
            new Paragraph({ text: "Evidence: \"And which that he became the onley toad KING...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Try to vary how you start your sentences. Instead of 'But' or 'And', try 'Suddenly' or 'Eventually'." }),

            new Paragraph({ text: "7. Paragraphing (1/2 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: There is some evidence of segmenting ideas into sections." }),
            new Paragraph({ text: "Recommendations: Use a new paragraph every time a different character speaks." }),

            new Paragraph({ text: "8. Sentence Structure (1/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Sentence boundaries are often unclear, and there are several grammatical errors." }),
            new Paragraph({ text: "Evidence: \"The Toad femly runs togfer as the crow chases theme down.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Focus on full stops. Every time a complete thought is finished, use a full stop." }),

            new Paragraph({ text: "9. Punctuation (1/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Inconsistent use of capitals and lack of ending punctuation for most sentences." }),
            new Paragraph({ text: "Evidence: \"...which made the crow blind \"AHHHHH\" the crow yield owt.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Practice using capital letters at the beginning of every sentence and for names like 'King Toad'." }),

            new Paragraph({ text: "10. Spelling (1/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Many errors in simple and common words." }),
            new Paragraph({ text: "Evidence: 'femly', 'wiye', 'becors'.", italics: true }),
            new Paragraph({ text: "Recommendations: Focus on learning the spelling of common 'high-frequency' words like 'because' and 'together'." }),

            new Paragraph({ text: "Score Summary", heading: HeadingLevel.HEADING_1 }),
            new Table({
                columnWidths: [4680, 2340, 2340],
                rows: [
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Criterion", bold: true })], shading: { fill: "D5E8F0", type: ShadingType.CLEAR } }), new TableCell({ children: [new Paragraph({ text: "Score", bold: true })], shading: { fill: "D5E8F0", type: ShadingType.CLEAR } }), new TableCell({ children: [new Paragraph({ text: "Max", bold: true })], shading: { fill: "D5E8F0", type: ShadingType.CLEAR } })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Audience" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] }), new TableCell({ children: [new Paragraph({ text: "6" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Text Structure" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] }), new TableCell({ children: [new Paragraph({ text: "4" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Ideas" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] }), new TableCell({ children: [new Paragraph({ text: "5" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Character and Setting" })] }), new TableCell({ children: [new Paragraph({ text: "1" })] }), new TableCell({ children: [new Paragraph({ text: "4" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Vocabulary" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] }), new TableCell({ children: [new Paragraph({ text: "5" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Cohesion" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] }), new TableCell({ children: [new Paragraph({ text: "4" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Paragraphing" })] }), new TableCell({ children: [new Paragraph({ text: "1" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Sentence Structure" })] }), new TableCell({ children: [new Paragraph({ text: "1" })] }), new TableCell({ children: [new Paragraph({ text: "6" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Punctuation" })] }), new TableCell({ children: [new Paragraph({ text: "1" })] }), new TableCell({ children: [new Paragraph({ text: "5" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Spelling" })] }), new TableCell({ children: [new Paragraph({ text: "1" })] }), new TableCell({ children: [new Paragraph({ text: "6" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "TOTAL", bold: true })] }), new TableCell({ children: [new Paragraph({ text: "15", bold: true })] }), new TableCell({ children: [new Paragraph({ text: "47", bold: true })] })] }),
                ],
            }),
        ],
    }],
    numbering: {
        config: [
            { reference: "bullet-points", levels: [{ level: 0, format: "bullet", text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
        ],
    },
});

Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync("c:\\Users\\dsuth\\Documents\\Joshua\\Scrap\\Submitted files\\CARR, Laikyn (lcarr204)\\NAPLAN Assessment - Laikyn Carr.docx", buffer);
});
