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
            new Paragraph({ children: [new TextRun({ text: "Student Name: ", bold: true }), new TextRun("Spencer Lincoln")] }),
            new Paragraph({ children: [new TextRun({ text: "Date: ", bold: true }), new TextRun("2026-01-28")] }),
            new Paragraph({ children: [new TextRun({ text: "Total Score: ", bold: true }), new TextRun("30/47")] }),

            new Paragraph({ text: "Executive Summary", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: "Overall Strengths", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "• Excellent use of descriptive vocabulary to build a sense of mystery and danger.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Clear and compelling narrative structure that follows a classic adventurer's journey.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Effective use of paragraphing to guide the reader through different stages of the story.", numbering: { reference: "bullet-points", level: 0 } }),

            new Paragraph({ text: "Areas for Development", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "• Spelling accuracy—focus on learning the spelling of common words like 'if' and 'know' (used as 'I've' and 'now' in the text).", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Sentence flow—practicing the use of commas and full stops to separate independent thoughts more clearly.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Character reaction—expanding on Steven's fear or relief during the bandit escape to deepen the engagement.", numbering: { reference: "bullet-points", level: 0 } }),

            new Paragraph({ text: "Detailed Assessment by Criterion", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: "1. Audience (3/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Successfully engages the reader through the use of evocative words and a sense of peril." }),
            new Paragraph({ text: "Evidence: \"...he went on a long, lonely journey on the way he saw many species of animals.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Try to describe thebandits more. Were they wearing masks? Were they tall or short?" }),

            new Paragraph({ text: "2. Text Structure (3/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: A controlled and effective narrative with a clear orientation, multiple complications, and an intriguing resolution.", }),
            new Paragraph({ text: "Evidence: \"He slipped as soon as he got into the cave nearly fracturing his skull...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Spend a little more time on the 'waking up' part. How did Steven feel about the dream?", }),

            new Paragraph({ text: "3. Ideas (3/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: The idea of a 'mythical cave' and a 'poison' that causes blackouts is very creative and well-developed.", }),
            new Paragraph({ text: "Evidence: \"...the poison stopped it wouldn't go black he could see it was still night...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Why was the cave mythical? Did it look like a dragon's mouth or something else unique?" }),

            new Paragraph({ text: "4. Character and Setting (3/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Both the character of Steven and the dangerous settings are described with great detail and atmosphere." }),
            new Paragraph({ text: "Evidence: \"...waves splashed at him while he was climbing up the jagged rocks...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Describe Steven's face. Did he look determined as he was climbing the cliffs?" }),

            new Paragraph({ text: "5. Vocabulary (4/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Uses some very effective and sophisticated vocabulary for effect." }),
            new Paragraph({ text: "Evidence: \"...pitch black repeatedly numerous time...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Keep using those big words like 'numerous' and 'fracturing'! They make your writing sound very professional." }),

            new Paragraph({ text: "6. Cohesion (3/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Time and sequence markers sustain the story's flow across different scenes effectively." }),
            new Paragraph({ text: "Evidence: \"But as soon as he got out of the cage...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Use some more complex linking words like 'Meanwhile' or 'Consequently' to show the bandits' actions." }),

            new Paragraph({ text: "7. Paragraphing (2/2 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Effective and logical use of paragraphs to organize the narrative into its main stages." }),
            new Paragraph({ text: "Recommendations: Excellent work. Keep using paragraphs to guide your reader." }),

            new Paragraph({ text: "8. Sentence Structure (3/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: A good variety of sentence types are used, though some are slightly tangled by missing words." }),
            new Paragraph({ text: "Evidence: \"There was one a boy named Steven he was 8...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Read your sentences out loud to make sure they haven't become too long and 'run-on'!" }),

            new Paragraph({ text: "9. Punctuation (3/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Correct implementation of basic punctuation, with effective use of commas and semi-colons." }),
            new Paragraph({ text: "Evidence: \"...unwelcoming tribe of bandits who were set out to stop him on his journey.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Ensure every sentence has a clear full stop at the end to separate your big ideas." }),

            new Paragraph({ text: "10. Spelling (3/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Some common words are consistently misspelled, though difficult ones are often correct." }),
            new Paragraph({ text: "Evidence: 'fracturing' is correct; 'takin' for 'taken' and 'I've' for 'if' are errors.", italics: true }),
            new Paragraph({ text: "Recommendations: Be careful with words that sound the same, like 'if' and 'I've'. Practice 'taken' as well!" }),

            new Paragraph({ text: "Score Summary", heading: HeadingLevel.HEADING_1 }),
            new Table({
                columnWidths: [4680, 2340, 2340],
                rows: [
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Criterion", bold: true })], shading: { fill: "D5E8F0", type: ShadingType.CLEAR } }), new TableCell({ children: [new Paragraph({ text: "Score", bold: true })], shading: { fill: "D5E8F0", type: ShadingType.CLEAR } }), new TableCell({ children: [new Paragraph({ text: "Max", bold: true })], shading: { fill: "D5E8F0", type: ShadingType.CLEAR } })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Audience" })] }), new TableCell({ children: [new Paragraph({ text: "3" })] }), new TableCell({ children: [new Paragraph({ text: "6" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Text Structure" })] }), new TableCell({ children: [new Paragraph({ text: "3" })] }), new TableCell({ children: [new Paragraph({ text: "4" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Ideas" })] }), new TableCell({ children: [new Paragraph({ text: "3" })] }), new TableCell({ children: [new Paragraph({ text: "5" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Character and Setting" })] }), new TableCell({ children: [new Paragraph({ text: "3" })] }), new TableCell({ children: [new Paragraph({ text: "4" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Vocabulary" })] }), new TableCell({ children: [new Paragraph({ text: "4" })] }), new TableCell({ children: [new Paragraph({ text: "5" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Cohesion" })] }), new TableCell({ children: [new Paragraph({ text: "3" })] }), new TableCell({ children: [new Paragraph({ text: "4" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Paragraphing" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Sentence Structure" })] }), new TableCell({ children: [new Paragraph({ text: "3" })] }), new TableCell({ children: [new Paragraph({ text: "6" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Punctuation" })] }), new TableCell({ children: [new Paragraph({ text: "3" })] }), new TableCell({ children: [new Paragraph({ text: "5" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Spelling" })] }), new TableCell({ children: [new Paragraph({ text: "3" })] }), new TableCell({ children: [new Paragraph({ text: "6" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "TOTAL", bold: true })] }), new TableCell({ children: [new Paragraph({ text: "30", bold: true })] }), new TableCell({ children: [new Paragraph({ text: "47", bold: true })] })] }),
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
    fs.writeFileSync("c:\\Users\\dsuth\\Documents\\Joshua\\Scrap\\Submitted files\\LINCOLN, Spencer (slinc20)\\NAPLAN Assessment - Spencer Lincoln.docx", buffer);
});
