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
            new Paragraph({ children: [new TextRun({ text: "Student Name: ", bold: true }), new TextRun("Rylee Dawson")] }),
            new Paragraph({ children: [new TextRun({ text: "Date: ", bold: true }), new TextRun("2026-01-28")] }),
            new Paragraph({ children: [new TextRun({ text: "Total Score: ", bold: true }), new TextRun("5/47")] }),

            new Paragraph({ text: "Executive Summary", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: "Overall Strengths", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "• Use of evocative and ambitious adjectives to describe the environment.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Effective use of a simile ('like a bullet') to describe movement.", numbering: { reference: "bullet-points", level: 0 } }),

            new Paragraph({ text: "Areas for Development", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "• Completion—the story is currently unfinished and requires a complication and resolution.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Spelling—double-check the spelling of common words like 'bullet' and 'speed'.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Punctuation—adding a full stop to finish the thought and start the next part of the story.", numbering: { reference: "bullet-points", level: 0 } }),

            new Paragraph({ text: "Detailed Assessment by Criterion", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: "1. Audience (1/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Briefly orients the reader to a summer day but stops before the story begins." }),
            new Paragraph({ text: "Evidence: \"On a hot summer day...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Keep going! What happened on that summer day? Who was there?" }),

            new Paragraph({ text: "2. Text Structure (0/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: No narrative structure is present beyond a partial orientation." }),
            new Paragraph({ text: "Recommendations: A story needs a problem (complication) and a fix (resolution). Plan these out before you start writing." }),

            new Paragraph({ text: "3. Ideas (1/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: The seed of an idea is present but not developed." }),
            new Paragraph({ text: "Recommendations: Use the wind as a character—what does the wind do to the people in your story?" }),

            new Paragraph({ text: "4. Character and Setting (1/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Some atmosphere is created through the description of the wind and heat." }),
            new Paragraph({ text: "Evidence: \"...wild wisping grasping wind...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Introduce a character whose hair is getting 'grasped' by that wind!" }),

            new Paragraph({ text: "5. Vocabulary (2/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Excellent choice of verbs and adjectives in the opening line." }),
            new Paragraph({ text: "Evidence: \"...wild wisping grasping wind...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Continue using these expressive words as you write more of the story." }),

            new Paragraph({ text: "6. Cohesion (0/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: The text is too short to demonstrate control of cohesive links." }),
            new Paragraph({ text: "Recommendations: Use words like 'Suddenly' to introduce the first problem in your story." }),

            new Paragraph({ text: "7. Paragraphing (0/2 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: No paragraphing is present in this short excerpt." }),
            new Paragraph({ text: "Recommendations: Remember to use a new paragraph when you change the time or place." }),

            new Paragraph({ text: "8. Sentence Structure (0/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: The text contains one incomplete sentence." }),
            new Paragraph({ text: "Evidence: \"...flow throw the sky like.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Ensure every sentence is a 'full thought' with a subject and a verb." }),

            new Paragraph({ text: "9. Punctuation (0/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: No punctuation is used in the text." }),
            new Paragraph({ text: "Recommendations: Every sentence needs to end with a full stop, a question mark, or an exclamation mark." }),

            new Paragraph({ text: "10. Spelling (1/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Some errors in simple words." }),
            new Paragraph({ text: "Evidence: 'bulitt' for 'bullet', 'sped' for 'speed'.", italics: true }),
            new Paragraph({ text: "Recommendations: Use a dictionary or ask for help with words that sound different than they are spelled." }),

            new Paragraph({ text: "Score Summary", heading: HeadingLevel.HEADING_1 }),
            new Table({
                columnWidths: [4680, 2340, 2340],
                rows: [
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Criterion", bold: true })], shading: { fill: "D5E8F0", type: ShadingType.CLEAR } }), new TableCell({ children: [new Paragraph({ text: "Score", bold: true })], shading: { fill: "D5E8F0", type: ShadingType.CLEAR } }), new TableCell({ children: [new Paragraph({ text: "Max", bold: true })], shading: { fill: "D5E8F0", type: ShadingType.CLEAR } })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Audience" })] }), new TableCell({ children: [new Paragraph({ text: "1" })] }), new TableCell({ children: [new Paragraph({ text: "6" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Text Structure" })] }), new TableCell({ children: [new Paragraph({ text: "0" })] }), new TableCell({ children: [new Paragraph({ text: "4" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Ideas" })] }), new TableCell({ children: [new Paragraph({ text: "1" })] }), new TableCell({ children: [new Paragraph({ text: "5" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Character and Setting" })] }), new TableCell({ children: [new Paragraph({ text: "1" })] }), new TableCell({ children: [new Paragraph({ text: "4" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Vocabulary" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] }), new TableCell({ children: [new Paragraph({ text: "5" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Cohesion" })] }), new TableCell({ children: [new Paragraph({ text: "0" })] }), new TableCell({ children: [new Paragraph({ text: "4" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Paragraphing" })] }), new TableCell({ children: [new Paragraph({ text: "0" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Sentence Structure" })] }), new TableCell({ children: [new Paragraph({ text: "0" })] }), new TableCell({ children: [new Paragraph({ text: "6" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Punctuation" })] }), new TableCell({ children: [new Paragraph({ text: "0" })] }), new TableCell({ children: [new Paragraph({ text: "5" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Spelling" })] }), new TableCell({ children: [new Paragraph({ text: "1" })] }), new TableCell({ children: [new Paragraph({ text: "6" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "TOTAL", bold: true })] }), new TableCell({ children: [new Paragraph({ text: "5", bold: true })] }), new TableCell({ children: [new Paragraph({ text: "47", bold: true })] })] }),
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
    fs.writeFileSync("c:\\Users\\dsuth\\Documents\\Joshua\\Scrap\\Submitted files\\DAWSON, Rylee (rdaws78)\\NAPLAN Assessment - Rylee Dawson.docx", buffer);
});
