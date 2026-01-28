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
            new Paragraph({ children: [new TextRun({ text: "Student Name: ", bold: true }), new TextRun("Elijah Steele")] }),
            new Paragraph({ children: [new TextRun({ text: "Date: ", bold: true }), new TextRun("2026-01-28")] }),
            new Paragraph({ children: [new TextRun({ text: "Total Score: ", bold: true }), new TextRun("8/47")] }),

            new Paragraph({ text: "Executive Summary", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: "Overall Strengths", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "• Clear orientation establishing the character and his initial success.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Use of a significant time marker ('4 years later') to move the plot forward.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Concept of a high-stakes fall from grace is a strong starting point for a narrative.", numbering: { reference: "bullet-points", level: 0 } }),

            new Paragraph({ text: "Areas for Development", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "• Narrative elaboration—the story needs more detail about why things changed and how Albert felt.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Descriptive language—use adjectives to describe the circus and Albert's magic tricks.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Punctuation accuracy—using full stops to separate independent ideas and make the text easier to read.", numbering: { reference: "bullet-points", level: 0 } }),

            new Paragraph({ text: "Detailed Assessment by Criterion", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: "1. Audience (1/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Minimal engagement due to the very brief nature of the text." }),
            new Paragraph({ text: "Evidence: \"There was a magic man albert he works at the circus...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Try to describe what music or smells Albert experienced at the circus!" }),

            new Paragraph({ text: "2. Text Structure (1/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Includes a basic orientation and a sudden complication/resolution, but lacks development.", }),
            new Paragraph({ text: "Evidence: \"Albert burnt the place down.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Spend more time describing the 4 years between Albert being successful and being fired." }),

            new Paragraph({ text: "3. Ideas (1/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: A simple idea focusing on a character's career and its end." }),
            new Paragraph({ text: "Evidence: \"...career was gone.\"", italics: true }),
            new Paragraph({ text: "Recommendations: What kind of magic did Albert do? Was it card tricks or pulling rabbits out of hats?" }),

            new Paragraph({ text: "4. Character and Setting (1/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Character is named but the circus setting is not described in detail." }),
            new Paragraph({ text: "Evidence: \"...albert he works at the circus...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Describe Albert's magic outfit! Did he wear a top hat and a red coat?" }),

            new Paragraph({ text: "5. Vocabulary (1/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Uses some appropriate words like 'magic', 'billions', and 'career'." }),
            new Paragraph({ text: "Evidence: \"...he earned billions...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Look for stronger verbs to describe Albert's firing—did he get 'dismissed' or 'ousted'?" }),

            new Paragraph({ text: "6. Cohesion (1/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Basic links like 'but' and '4 years later' are used to signal changes in time." }),
            new Paragraph({ text: "Evidence: \"...but 4 years later everything had changed...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Use words like 'Eventually' or 'Unexpectedly' to bridge your thoughts." }),

            new Paragraph({ text: "7. Paragraphing (1/2 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: There is one paragraph break, but the text is too short to show consistent organization." }),
            new Paragraph({ text: "Recommendations: Start a new paragraph every time the action or location moves to a new place." }),

            new Paragraph({ text: "8. Sentence Structure (1/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Simple sentences that often run together without clear boundaries." }),
            new Paragraph({ text: "Evidence: \"...he was fired he lost all his money his career was gone.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Practice using full stops to finish one big thought before starting the next one." }),

            new Paragraph({ text: "9. Punctuation (1/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Minimal punctuation control, with most sentences lacking end markers." }),
            new Paragraph({ text: "Evidence: \"There was a magic man albert he works at the circus...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Every sentence should start with a capital letter and end with a full stop!" }),

            new Paragraph({ text: "10. Spelling (1/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Limited evidence of proficiency due to the brevity of the text, though common words are spelled correctly." }),
            new Paragraph({ text: "Evidence: 'magic', 'circus', 'career'.", italics: true }),
            new Paragraph({ text: "Recommendations: Keep practicing your spelling by writing longer stories with more descriptive words!" }),

            new Paragraph({ text: "Score Summary", heading: HeadingLevel.HEADING_1 }),
            new Table({
                columnWidths: [4680, 2340, 2340],
                rows: [
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Criterion", bold: true })], shading: { fill: "D5E8F0", type: ShadingType.CLEAR } }), new TableCell({ children: [new Paragraph({ text: "Score", bold: true })], shading: { fill: "D5E8F0", type: ShadingType.CLEAR } }), new TableCell({ children: [new Paragraph({ text: "Max", bold: true })], shading: { fill: "D5E8F0", type: ShadingType.CLEAR } })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Audience" })] }), new TableCell({ children: [new Paragraph({ text: "1" })] }), new TableCell({ children: [new Paragraph({ text: "6" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Text Structure" })] }), new TableCell({ children: [new Paragraph({ text: "1" })] }), new TableCell({ children: [new Paragraph({ text: "4" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Ideas" })] }), new TableCell({ children: [new Paragraph({ text: "1" })] }), new TableCell({ children: [new Paragraph({ text: "5" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Character and Setting" })] }), new TableCell({ children: [new Paragraph({ text: "1" })] }), new TableCell({ children: [new Paragraph({ text: "4" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Vocabulary" })] }), new TableCell({ children: [new Paragraph({ text: "1" })] }), new TableCell({ children: [new Paragraph({ text: "5" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Cohesion" })] }), new TableCell({ children: [new Paragraph({ text: "1" })] }), new TableCell({ children: [new Paragraph({ text: "4" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Paragraphing" })] }), new TableCell({ children: [new Paragraph({ text: "1" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Sentence Structure" })] }), new TableCell({ children: [new Paragraph({ text: "1" })] }), new TableCell({ children: [new Paragraph({ text: "6" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Punctuation" })] }), new TableCell({ children: [new Paragraph({ text: "1" })] }), new TableCell({ children: [new Paragraph({ text: "5" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Spelling" })] }), new TableCell({ children: [new Paragraph({ text: "1" })] }), new TableCell({ children: [new Paragraph({ text: "6" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "TOTAL", bold: true })] }), new TableCell({ children: [new Paragraph({ text: "8", bold: true })] }), new TableCell({ children: [new Paragraph({ text: "47", bold: true })] })] }),
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
    fs.writeFileSync("c:\\Users\\dsuth\\Documents\\Joshua\\Scrap\\Submitted files\\STEELE, Elijah (estee62)\\NAPLAN Assessment - Elijah Steele.docx", buffer);
});
