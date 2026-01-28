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
            new Paragraph({ children: [new TextRun({ text: "Student Name: ", bold: true }), new TextRun("Jared Dengate")] }),
            new Paragraph({ children: [new TextRun({ text: "Date: ", bold: true }), new TextRun("2026-01-28")] }),
            new Paragraph({ children: [new TextRun({ text: "Total Score: ", bold: true }), new TextRun("16/47")] }),

            new Paragraph({ text: "Executive Summary", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: "Overall Strengths", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "• Clear chronological structure using 'first', 'second', and 'last' markers.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Success in communicating the character's emotional state throughout the story.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Adoption of a imaginative fantasy premise (the three wishes).", numbering: { reference: "bullet-points", level: 0 } }),

            new Paragraph({ text: "Areas for Development", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "• Spelling of common past tense verbs (e.g., 'happened' instead of 'happen', 'had' instead of 'hade').", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Sentence structure—work on connecting ideas without repeating the same words like 'was' and 'it'.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Elaboration—adding more detail about the wizard or the magical environment.", numbering: { reference: "bullet-points", level: 0 } }),

            new Paragraph({ text: "Detailed Assessment by Criterion", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: "1. Audience (2/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Successfully orients the reader to the magical premise and shares the character's excitement." }),
            new Paragraph({ text: "Evidence: \"The magic wizard gave me 3 wishes I was so happy...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Try to describe the wizard more. Was he tall with a pointy hat, or did he look like a normal person?" }),

            new Paragraph({ text: "2. Text Structure (2/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Follows a simple narrative arc, including a small complication when a wish is denied." }),
            new Paragraph({ text: "Evidence: \"...but he said no I was very upset...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Spend more time on the 'no' part. Why did the wizard say no? How did the character feel exactly?" }),

            new Paragraph({ text: "3. Ideas (2/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: The core idea of 'three wishes' is a classic and effective choice for a short story." }),
            new Paragraph({ text: "Evidence: \"...super powers but he said no I was very upset so I wish that was much better a soccer...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Try to think of one wish that is really unusual or funny to surprise the reader." }),

            new Paragraph({ text: "4. Character and Setting (1/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Characters and settings are named but lack individual description." }),
            new Paragraph({ text: "Evidence: \"The magic wizard...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Describe where this happened. Was it in your bedroom, at school, or in a deep, dark cave?" }),

            new Paragraph({ text: "5. Vocabulary (2/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Uses some appropriate words like 'wizard' and 'super powers'." }),
            new Paragraph({ text: "Evidence: \"...last wish was to have all the super powers...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Use stronger feeling words instead of just 'happy' or 'upset', like 'thrilled' or 'devastated'." }),

            new Paragraph({ text: "6. Cohesion (2/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Uses temporal markers ('first', 'last') to help the reader follow the sequence of events." }),
            new Paragraph({ text: "Evidence: \"And my 3d and last wish was...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Use longer words to connect sentences, like 'Eventually' or 'Consequently'." }),

            new Paragraph({ text: "7. Paragraphing (1/2 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Some evidence of breaking the text into sections based on the different wishes." }),
            new Paragraph({ text: "Recommendations: Start a new paragraph every time the wizard speaks or a new wish is made." }),

            new Paragraph({ text: "8. Sentence Structure (1/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Sentences are often missing correctly formed verbs." }),
            new Paragraph({ text: "Evidence: \"...the have was a million dollar's...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Check that every sentence has a clear action that already happened (past tense)." }),

            new Paragraph({ text: "9. Punctuation (1/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Inconsistent use of full stops and capital letters to mark sentence boundaries." }),
            new Paragraph({ text: "Evidence: \"...and it happen I was so happy .\"", italics: true }),
            new Paragraph({ text: "Recommendations: Practice putting a full stop at the end of every sentence before starting the next one with a capital letter." }),

            new Paragraph({ text: "10. Spelling (2/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Some common words are misspelled but more difficult words like 'wizard' are correct." }),
            new Paragraph({ text: "Evidence: 'hade' for 'had', 'wated' for 'waited'.", italics: true }),
            new Paragraph({ text: "Recommendations: Practice adding '-ed' to the end of words to show they happened in the past." }),

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
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Spelling" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] }), new TableCell({ children: [new Paragraph({ text: "6" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "TOTAL", bold: true })] }), new TableCell({ children: [new Paragraph({ text: "16", bold: true })] }), new TableCell({ children: [new Paragraph({ text: "47", bold: true })] })] }),
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
    fs.writeFileSync("c:\\Users\\dsuth\\Documents\\Joshua\\Scrap\\Submitted files\\DENGATE, Jared (jdeng28)\\NAPLAN Assessment - Jared Dengate.docx", buffer);
});
