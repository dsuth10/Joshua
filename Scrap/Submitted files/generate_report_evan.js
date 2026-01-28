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
            new Paragraph({ children: [new TextRun({ text: "Student Name: ", bold: true }), new TextRun("Evan Bryan")] }),
            new Paragraph({ children: [new TextRun({ text: "Date: ", bold: true }), new TextRun("2026-01-28")] }),
            new Paragraph({ children: [new TextRun({ text: "Total Score: ", bold: true }), new TextRun("16/47")] }),

            new Paragraph({ text: "Executive Summary", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: "Overall Strengths", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "• Energetic narrative with high-action sequences.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Effective use of similes ('as fast as sonic') to engage a younger audience.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Good use of onomatopoeia ('bangggg!!!', 'crashhhh') to create sensory impact.", numbering: { reference: "bullet-points", level: 0 } }),

            new Paragraph({ text: "Areas for Development", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "• Sentence structure and grammatical control—focus on complete sentences and correct verb forms.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Punctuation accuracy, particularly full stops and capitalization at the start of sentences.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Narrative flow—providing more detail so events don't feel too rushed or disconnected.", numbering: { reference: "bullet-points", level: 0 } }),

            new Paragraph({ text: "Detailed Assessment by Criterion", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: "1. Audience (2/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Attempts to engage the reader with action and pop-culture references, though the flow is fragmented." }),
            new Paragraph({ text: "Evidence: \"...ran down the stairs as fast as sonic.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Try to describe the scene more slowly so the reader can imagine the environment before the action happens." }),

            new Paragraph({ text: "2. Text Structure (2/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: The narrative contains a beginning, middle, and end, but transitions are very abrupt." }),
            new Paragraph({ text: "Evidence: \"She wakes up and she is in a cave.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Use 'linking' sentences to explain how the character moves from one place to another (e.g., from the waterfall to the cave)." }),

            new Paragraph({ text: "3. Ideas (2/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Interesting ideas like the pink light and the mysterious person are introduced but not fully explained." }),
            new Paragraph({ text: "Evidence: \"She a light that glows pink she gets closer.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Ask yourself: 'Why is the light pink?' or 'What does the person want?' and include those details." }),

            new Paragraph({ text: "4. Character and Setting (2/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Settings are named but not described in detail. The character shows resilience during the action." }),
            new Paragraph({ text: "Evidence: \"...gets her massive bag that is bigger than her back...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Use adjectives to describe the cave—was it dark, cold, or slimy?" }),

            new Paragraph({ text: "5. Vocabulary (2/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Uses mostly common words, with some effective action verbs." }),
            new Paragraph({ text: "Evidence: \"...vanishes into the dark.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Try to find 'grown-up' words for common actions, like 'sprint' instead of 'run' or 'descend' instead of 'go down'." }),

            new Paragraph({ text: "6. Cohesion (1/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Events jump very quickly, making it hard to follow the timeline of the story." }),
            new Paragraph({ text: "Evidence: \"She says to herself. There is no reason chasing someone...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Use words like 'Meanwhile', 'Shortly after', or 'Despite her injury' to connect ideas." }),

            new Paragraph({ text: "7. Paragraphing (1/2 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Some attempts at paragraphing are present but they don't always group related ideas." }),
            new Paragraph({ text: "Recommendations: Start a new paragraph every time the character moves to a new location." }),

            new Paragraph({ text: "8. Sentence Structure (1/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Many sentences are missing verbs or are run-on sentences." }),
            new Paragraph({ text: "Evidence: \"She a light that glows pink...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Check every sentence to make sure it has a 'doing' word (verb) and a clear 'who' (subject)." }),

            new Paragraph({ text: "9. Punctuation (1/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Inconsistent use of basic punctuation like full stops and capitals." }),
            new Paragraph({ text: "Evidence: \"... bangggg!!! It traps her legs...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Read your work aloud—every time you take a breath, you probably need a full stop!" }),

            new Paragraph({ text: "10. Spelling (2/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Some simple and common words are correct, but there are errors in basic words." }),
            new Paragraph({ text: "Evidence: 'massive', 'bandage' are correct; 'pecies' is an error.", italics: true }),
            new Paragraph({ text: "Recommendations: Practice common spelling patterns for words with 'ie' and 'ei', like 'pieces'." }),

            new Paragraph({ text: "Score Summary", heading: HeadingLevel.HEADING_1 }),
            new Table({
                columnWidths: [4680, 2340, 2340],
                rows: [
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Criterion", bold: true })], shading: { fill: "D5E8F0", type: ShadingType.CLEAR } }), new TableCell({ children: [new Paragraph({ text: "Score", bold: true })], shading: { fill: "D5E8F0", type: ShadingType.CLEAR } }), new TableCell({ children: [new Paragraph({ text: "Max", bold: true })], shading: { fill: "D5E8F0", type: ShadingType.CLEAR } })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Audience" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] }), new TableCell({ children: [new Paragraph({ text: "6" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Text Structure" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] }), new TableCell({ children: [new Paragraph({ text: "4" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Ideas" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] }), new TableCell({ children: [new Paragraph({ text: "5" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Character and Setting" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] }), new TableCell({ children: [new Paragraph({ text: "4" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Vocabulary" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] }), new TableCell({ children: [new Paragraph({ text: "5" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Cohesion" })] }), new TableCell({ children: [new Paragraph({ text: "1" })] }), new TableCell({ children: [new Paragraph({ text: "4" })] })] }),
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
    fs.writeFileSync("c:\\Users\\dsuth\\Documents\\Joshua\\Scrap\\Submitted files\\BRYAN, Evan (ebrya65)\\NAPLAN Assessment - Evan Bryan.docx", buffer);
});
