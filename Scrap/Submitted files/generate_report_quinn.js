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
            new Paragraph({ children: [new TextRun({ text: "Student Name: ", bold: true }), new TextRun("Quinn Macrae")] }),
            new Paragraph({ children: [new TextRun({ text: "Date: ", bold: true }), new TextRun("2026-01-28")] }),
            new Paragraph({ children: [new TextRun({ text: "Total Score: ", bold: true }), new TextRun("14/47")] }),

            new Paragraph({ text: "Executive Summary", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: "Overall Strengths", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "• High-energy dialogue that quickly establishes the relationship between characters.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Imaginative hook with the discovery of a 'mysterious blue duck' in a cave.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Effective use of onomatopoeia to convey the excitement and danger of the drop.", numbering: { reference: "bullet-points", level: 0 } }),

            new Paragraph({ text: "Areas for Development", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "• Spelling of high-frequency words (e.g., 'finally', 'wait', 'waiting').", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Punctuation accuracy—using full stops to separate ideas and quotation marks for dialogue.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Paragraphing—breaking the text into smaller sections to help the reader follow the action.", numbering: { reference: "bullet-points", level: 0 } }),

            new Paragraph({ text: "Detailed Assessment by Criterion", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: "1. Audience (2/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Successfully orients the reader to the fishing scene and engages through fast-paced dialogue." }),
            new Paragraph({ text: "Evidence: \"Lets go I finely got a fish on the hook Jayson said...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Try to describe how Jayson and Mavrick looked. Were they wearing fishing hats or were they soaking wet?" }),

            new Paragraph({ text: "2. Text Structure (2/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: The story moves quickly through orientation, complication, and resolution, but transitions are very rapid." }),
            new Paragraph({ text: "Evidence: \"...ahhhhhhhhh what the hell is happening Jayson...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Spend a little more time describing the cave before Jayson sees the blue duck." }),

            new Paragraph({ text: "3. Ideas (2/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: The inclusion of a 'mysterious blue duck' is an imaginative and fun idea." }),
            new Paragraph({ text: "Evidence: \"...wate do you see that mysterious blue duck .\"", italics: true }),
            new Paragraph({ text: "Recommendations: Why was the duck blue? Was it glowing or just a strange colour?" }),

            new Paragraph({ text: "4. Character and Setting (1/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Characters and settings are named but lack individual description to build atmosphere." }),
            new Paragraph({ text: "Evidence: \"...near were we were yesterday and small but deep pond .\"", italics: true }),
            new Paragraph({ text: "Recommendations: Describe the pond. Was the water clear and blue, or muddy and green?" }),

            new Paragraph({ text: "5. Vocabulary (2/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Uses some appropriate words for effect like 'flash flood' and 'mysterious'." }),
            new Paragraph({ text: "Evidence: \"...mysterious blue duck .\"", italics: true }),
            new Paragraph({ text: "Recommendations: Use stronger verbs for how Jayson and Mavrick moved, like 'scrambled' or 'darted' instead of 'go'." }),

            new Paragraph({ text: "6. Cohesion (2/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Simple links are used to keep the reader moving through the fast-paced events." }),
            new Paragraph({ text: "Evidence: \"So what are we wating for lets go .\"", italics: true }),
            new Paragraph({ text: "Recommendations: Use words like 'Eventually' or 'Unexpectedly' to bridge your sentences." }),

            new Paragraph({ text: "7. Paragraphing (0/2 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: No paragraphing is used to organize the text into sections." }),
            new Paragraph({ text: "Recommendations: Start a new paragraph every time a new person starts speaking or you move to a new place." }),

            new Paragraph({ text: "8. Sentence Structure (1/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Sentences often run together and lack clear subject-verb agreement." }),
            new Paragraph({ text: "Evidence: \"...Jayson what ,did , you , do wate do you see...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Focus on finishing one thought with a full stop before starting the next one." }),

            new Paragraph({ text: "9. Punctuation (1/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Minimal punctuation control, with inconsistent use of full stops and a lack of dialogue markers." }),
            new Paragraph({ text: "Evidence: \"...oh no flash flood run um Mavrick I think that's enough trouble...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Every time someone speaks, put their words inside 'quotation marks' so the reader knows who is talking." }),

            new Paragraph({ text: "10. Spelling (1/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Extensive spelling errors in common and high-frequency words." }),
            new Paragraph({ text: "Evidence: 'finely' for 'finally', 'wating' for 'waiting', 'wail' for 'while'.", italics: true }),
            new Paragraph({ text: "Recommendations: Words like 'wait' and 'while' are really important for stories. Practice spelling those specifically!" }),

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
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Paragraphing" })] }), new TableCell({ children: [new Paragraph({ text: "0" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Sentence Structure" })] }), new TableCell({ children: [new Paragraph({ text: "1" })] }), new TableCell({ children: [new Paragraph({ text: "6" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Punctuation" })] }), new TableCell({ children: [new Paragraph({ text: "1" })] }), new TableCell({ children: [new Paragraph({ text: "5" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Spelling" })] }), new TableCell({ children: [new Paragraph({ text: "1" })] }), new TableCell({ children: [new Paragraph({ text: "6" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "TOTAL", bold: true })] }), new TableCell({ children: [new Paragraph({ text: "14", bold: true })] }), new TableCell({ children: [new Paragraph({ text: "47", bold: true })] })] }),
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
    fs.writeFileSync("c:\\Users\\dsuth\\Documents\\Joshua\\Scrap\\Submitted files\\MACRAE, Quinn (qmacr0)\\NAPLAN Assessment - Quinn Macrae.docx", buffer);
});
