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
            new Paragraph({ children: [new TextRun({ text: "Student Name: ", bold: true }), new TextRun("Audrey Lalor")] }),
            new Paragraph({ children: [new TextRun({ text: "Date: ", bold: true }), new TextRun("2026-01-28")] }),
            new Paragraph({ children: [new TextRun({ text: "Total Score: ", bold: true }), new TextRun("30/47")] }),

            new Paragraph({ text: "Executive Summary", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: "Overall Strengths", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "• Strong emotive writing that successfully makes the reader feel empathy for the character.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Clear and well-balanced narrative structure with a satisfying and unexpected resolution.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Effective use of sensory details, particularly scent and sound, to enhance the cat's perspective.", numbering: { reference: "bullet-points", level: 0 } }),

            new Paragraph({ text: "Areas for Development", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "• Homophone accuracy—practice the difference between 'which' and 'witch', 'where' and 'were', and 'knew' and 'new'.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Capitalisation—ensure that names like 'Willow' always start with a capital letter throughout the story.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Sentence-level flow—using commas to separate independent ideas and make the narrative easier to read.", numbering: { reference: "bullet-points", level: 0 } }),

            new Paragraph({ text: "Detailed Assessment by Criterion", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: "1. Audience (3/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Successfully engages the reader through the character's vulnerability and emotional journey." }),
            new Paragraph({ text: "Evidence: \"Willow was losing hope she scratched at it for a while but no one came. Willows ears drooped.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Keep using those descriptive words for emotions. Instead of 'shocked', you could try 'astonished' or 'dumbfounded'!" }),

            new Paragraph({ text: "2. Text Structure (3/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: A controlled narrative with a clear orientation, a logical journey/complication, and a heartwarming resolution." }),
            new Paragraph({ text: "Evidence: \"...this is the place were the lost cats go.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Spend a little more time describing the cats inside the house to make the ending even more vivid." }),

            new Paragraph({ text: "3. Ideas (3/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: The core idea of a lost pet finding belonging in an unexpected way is well-executed." }),
            new Paragraph({ text: "Evidence: \"Willow made a lot of friends and new she made the right decision.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Why did Willow follow the butterfly? Was it because the butterfly looked like a toy or something else?" }),

            new Paragraph({ text: "4. Character and Setting (3/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Both the character of Willow and the setting of the house and its porch are described with some effective detail." }),
            new Paragraph({ text: "Evidence: \"She could hear the chirping sounds of birds filling her ears.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Describe the other cats! Were they different colours, or were they all white like Willow?" }),

            new Paragraph({ text: "5. Vocabulary (3/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Uses some precise and descriptive vocabulary, particularly to describe the cat's physical traits and emotions." }),
            new Paragraph({ text: "Evidence: \"...pearl white cat who loved the outdoors.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Look for alternatives to the word 'said' to show how the cats were speaking (e.g., 'purred', 'meowed', 'muttered')." }),

            new Paragraph({ text: "6. Cohesion (3/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Temporal markers help the narrative flow smoothly and logically from the past to the present." }),
            new Paragraph({ text: "Evidence: \"Willow soon got used to the place and was very happy there.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Use words like 'Eventually' or 'Consequently' to make your transitions more sophisticated." }),

            new Paragraph({ text: "7. Paragraphing (2/2 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Appropriate and effective use of paragraphs to organize the different stages of Willow's journey." }),
            new Paragraph({ text: "Recommendations: Excellent paragraphing control. Keep using this to guide your reader." }),

            new Paragraph({ text: "8. Sentence Structure (3/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Satisfactory control of simple and compound sentences, though some are a bit long." }),
            new Paragraph({ text: "Evidence: \"She could pick up the scent of her owner they were really close she could feel it.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Practice using full stops to break up those long sentences where you have multiple big ideas." }),

            new Paragraph({ text: "9. Punctuation (3/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Quotation marks and basic punctuation are used correctly, though capitalisation is inconsistent." }),
            new Paragraph({ text: "Evidence: \"witch hurt willow very badly.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Remember that names—no matter how small or furry the character—always need a capital letter!" }),

            new Paragraph({ text: "10. Spelling (4/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Most common words are spelled correctly, but homophones are a consistent area for growth." }),
            new Paragraph({ text: "Evidence: 'witch' for 'which', 'new' for 'knew', 'were' for 'where'.", italics: true }),
            new Paragraph({ text: "Recommendations: Practice the difference between words that sound the same but are spelled differently. It's a tricky part of English!" }),

            new Paragraph({ text: "Score Summary", heading: HeadingLevel.HEADING_1 }),
            new Table({
                columnWidths: [4680, 2340, 2340],
                rows: [
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Criterion", bold: true })], shading: { fill: "D5E8F0", type: ShadingType.CLEAR } }), new TableCell({ children: [new Paragraph({ text: "Score", bold: true })], shading: { fill: "D5E8F0", type: ShadingType.CLEAR } }), new TableCell({ children: [new Paragraph({ text: "Max", bold: true })], shading: { fill: "D5E8F0", type: ShadingType.CLEAR } })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Audience" })] }), new TableCell({ children: [new Paragraph({ text: "3" })] }), new TableCell({ children: [new Paragraph({ text: "6" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Text Structure" })] }), new TableCell({ children: [new Paragraph({ text: "3" })] }), new TableCell({ children: [new Paragraph({ text: "4" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Ideas" })] }), new TableCell({ children: [new Paragraph({ text: "3" })] }), new TableCell({ children: [new Paragraph({ text: "5" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Character and Setting" })] }), new TableCell({ children: [new Paragraph({ text: "3" })] }), new TableCell({ children: [new Paragraph({ text: "4" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Vocabulary" })] }), new TableCell({ children: [new Paragraph({ text: "3" })] }), new TableCell({ children: [new Paragraph({ text: "5" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Cohesion" })] }), new TableCell({ children: [new Paragraph({ text: "3" })] }), new TableCell({ children: [new Paragraph({ text: "4" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Paragraphing" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Sentence Structure" })] }), new TableCell({ children: [new Paragraph({ text: "3" })] }), new TableCell({ children: [new Paragraph({ text: "6" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Punctuation" })] }), new TableCell({ children: [new Paragraph({ text: "3" })] }), new TableCell({ children: [new Paragraph({ text: "5" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Spelling" })] }), new TableCell({ children: [new Paragraph({ text: "4" })] }), new TableCell({ children: [new Paragraph({ text: "6" })] })] }),
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
    fs.writeFileSync("c:\\Users\\dsuth\\Documents\\Joshua\\Scrap\\Submitted files\\LALOR, Audrey (alalo13)\\NAPLAN Assessment - Audrey Lalor.docx", buffer);
});
