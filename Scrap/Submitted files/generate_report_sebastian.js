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
            new Paragraph({ children: [new TextRun({ text: "Student Name: ", bold: true }), new TextRun("Sebastian Huber")] }),
            new Paragraph({ children: [new TextRun({ text: "Date: ", bold: true }), new TextRun("2026-01-28")] }),
            new Paragraph({ children: [new TextRun({ text: "Total Score: ", bold: true }), new TextRun("29/47")] }),

            new Paragraph({ text: "Executive Summary", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: "Overall Strengths", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "• Engaging and technical narrative that clearly draws on a specific area of interest (drifting).", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Effective use of similes ('slippery as soap') to convey environmental conditions to the reader.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Well-structured resolution that provides closure to the character's journey.", numbering: { reference: "bullet-points", level: 0 } }),

            new Paragraph({ text: "Areas for Development", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "• Spelling of high-frequency words (e.g., 'soap' instead of 'sope', 'done' instead of 'doon').", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Sentence control—avoiding 'double comparative' phrases like 'most best'.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Punctuation in dialogue—ensuring clear markers for when a character starts and stops speaking.", numbering: { reference: "bullet-points", level: 0 } }),

            new Paragraph({ text: "Detailed Assessment by Criterion", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: "1. Audience (3/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Successfully orients the reader to the competitive world of Japanese drifting and engages through high-speed action." }),
            new Paragraph({ text: "Evidence: \"Zoom the race started and he flew past every one...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Try to describe Hahn's car in more detail—how did it sound when it 'zoomed' past everyone?" }),

            new Paragraph({ text: "2. Text Structure (3/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: A controlled narrative with a clear orientation, a significant complication, and a logical resolution." }),
            new Paragraph({ text: "Evidence: \"Hahn had doon the most best drift and then crashed.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Spend a little more time describing the crash. What did Hahn see or hear as the car hit the wall?" }),

            new Paragraph({ text: "3. Ideas (3/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: The central storyline of a professional whose career is cut short by an accident is well-crafted." }),
            new Paragraph({ text: "Evidence: \"He was so annoyed because he had quit drifting and he lost his car...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Show the reader Hahn's pride after a win. Did he celebrate with his team or keep it to himself?" }),

            new Paragraph({ text: "4. Character and Setting (3/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: The professional racing setting in Japan is effectively established with relevant details." }),
            new Paragraph({ text: "Evidence: \"...the track was as slippery as Sope on a water slide.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Describe the hospital setting too—did it feel quiet and lonely compared to the noisy race track?" }),

            new Paragraph({ text: "5. Vocabulary (3/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Uses some precise and technical language related to motorsports." }),
            new Paragraph({ text: "Evidence: \"...one of the best drifters in Japan.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Experiment with more descriptive words for the fire or the rain to further enhance the mood." }),

            new Paragraph({ text: "6. Cohesion (3/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Cohesive links sustain the flow of the story across different locations and time periods." }),
            new Paragraph({ text: "Evidence: \"After each win he got he would be interviewed...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Use words like 'Despite' or 'Nevertheless' to show Hahn's determination to move on after the crash." }),

            new Paragraph({ text: "7. Paragraphing (2/2 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Paragraphs are used appropriately to organize the narrative into its main stages." }),
            new Paragraph({ text: "Recommendations: Great work. Keep using paragraphs to guide your reader through shifts in time and place." }),

            new Paragraph({ text: "8. Sentence Structure (3/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Satisfactory control of simple and compound sentences, with some evidence of variety." }),
            new Paragraph({ text: "Evidence: \"Today was a really rainy day and that means the track was as slippery...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Practice using 'most' or 'best' on their own, rather than combining them into 'most best'." }),

            new Paragraph({ text: "9. Punctuation (3/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Correct implementation of basic punctuation, with some variety for effect." }),
            new Paragraph({ text: "Evidence: \"'Thank you, mum and dad'.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Ensure every piece of dialogue starts and ends with those important quotation marks." }),

            new Paragraph({ text: "10. Spelling (3/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Several common errors are present, though more difficult words are attempted successfully." }),
            new Paragraph({ text: "Evidence: 'professional', 'medallion' are correct; 'Sope' and 'doon' are errors.", italics: true }),
            new Paragraph({ text: "Recommendations: Focus on double-checking words that sound the same but have different spellings, like 'soap'." }),

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
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Spelling" })] }), new TableCell({ children: [new Paragraph({ text: "3" })] }), new TableCell({ children: [new Paragraph({ text: "6" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "TOTAL", bold: true })] }), new TableCell({ children: [new Paragraph({ text: "29", bold: true })] }), new TableCell({ children: [new Paragraph({ text: "47", bold: true })] })] }),
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
    fs.writeFileSync("c:\\Users\\dsuth\\Documents\\Joshua\\Scrap\\Submitted files\\HUBER, Sebastian (shube9)\\NAPLAN Assessment - Sebastian Huber.docx", buffer);
});
