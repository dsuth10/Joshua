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
            new Paragraph({ children: [new TextRun({ text: "Student Name: ", bold: true }), new TextRun("Eva Korner")] }),
            new Paragraph({ children: [new TextRun({ text: "Date: ", bold: true }), new TextRun("2026-01-28")] }),
            new Paragraph({ children: [new TextRun({ text: "Total Score: ", bold: true }), new TextRun("34/47")] }),

            new Paragraph({ text: "Executive Summary", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: "Overall Strengths", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "• Excellent and highly engaging narrator's voice that immediately captures the reader's interest.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Superior control of punctuation (exclamation marks, question marks) to convey tone and excitement.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Well-structured narrative with a clear orientation, a unique complication, and a satisfied resolution.", numbering: { reference: "bullet-points", level: 0 } }),

            new Paragraph({ text: "Areas for Development", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "• Narrative focus—ensure the introductory details (like the Nutella and stickers) link directly to the main 'frog' storyline.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Sentence-level variety—experiment with connecting thoughts using conjunctions like 'while' or 'although' to create more complex sentences.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Descriptive elaboration—show us how the frogs looked on the ground. Were they green, slippery, or jumping on the cars?", numbering: { reference: "bullet-points", level: 0 } }),

            new Paragraph({ text: "Detailed Assessment by Criterion", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: "1. Audience (4/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Great capacity to engage the reader through a direct and friendly narrative voice." }),
            new Paragraph({ text: "Evidence: \"I'm Eva, this year I am turning 11 in April. But something about me is that, I LOVE NUTELLA!\"", italics: true }),
            new Paragraph({ text: "Recommendations: Keep using those rhetorical questions! They really help to draw the reader into your thoughts." }),

            new Paragraph({ text: "2. Text Structure (3/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: A logical and effective narrative structure that moves from a normal routine to an extraordinary event and its resolution." }),
            new Paragraph({ text: "Evidence: \"I jumped out of bed and put a chair right at the window. 9am just hit the clock.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Spend a little more time describing the news announcement to make the resolution feel even more important." }),

            new Paragraph({ text: "3. Ideas (3/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: The idea of 'raining frogs' is a great choice that provides plenty of room for creative description and character reaction." }),
            new Paragraph({ text: "Evidence: \"...it was RAINING FROGS! So many questions!\"", italics: true }),
            new Paragraph({ text: "Recommendations: Think about what exactly caused the frogs to rain. Was it a strange wind or a bit of mystery magic?" }),

            new Paragraph({ text: "4. Character and Setting (3/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Eva's character is very well established. The setting of the bedroom window is used effectively to observe the action." }),
            new Paragraph({ text: "Evidence: \"I looked out my window and it was RAINING FROGS!\"", italics: true }),
            new Paragraph({ text: "Recommendations: Describe Olivia's house too. Was it raining frogs there as well, or was it just Eva's street?" }),

            new Paragraph({ text: "5. Vocabulary (3/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Uses a good range of precise and descriptive words appropriate for the story's lighthearted tone." }),
            new Paragraph({ text: "Evidence: \"Literally everywhere! And no-one knew who did it!\"", italics: true }),
            new Paragraph({ text: "Recommendations: Look for alternatives to common words like 'said' or 'got' to add more flavour to your writing." }),

            new Paragraph({ text: "6. Cohesion (3/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Time markers and sequence words help the narrative flow smoothly and logically." }),
            new Paragraph({ text: "Evidence: \"It was Monday, the 3rd week of school... By 10am all the frogs are gone!\"", italics: true }),
            new Paragraph({ text: "Recommendations: Use longer connecting words like 'Consequently' or 'Unexpectedly' to bridge your paragraphs." }),

            new Paragraph({ text: "7. Paragraphing (2/2 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Paragraphs are used consistently to organize different stages of the day and shifts in action." }),
            new Paragraph({ text: "Recommendations: Excellent paragraphing control. Keep using this to guide your reader." }),

            new Paragraph({ text: "8. Sentence Structure (4/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Good variety in sentence length and type. Most sentences are grammatically sound." }),
            new Paragraph({ text: "Evidence: \"School is closed, due to raining frogs.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Practice joining two related thoughts with words like 'because' or 'therefore' to make your sentences even stronger." }),

            new Paragraph({ text: "9. Punctuation (4/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Excellent use of punctuation to convey tone, excitement, and emphasis." }),
            new Paragraph({ text: "Evidence: \"EVERYWHERE!! At school, on the road, on my clothes.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Great work. Try to use some more complex punctuation like semi-colons or dashes." }),

            new Paragraph({ text: "10. Spelling (5/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Almost all common and complex words are spelled correctly." }),
            new Paragraph({ text: "Evidence: 'uniform', 'confused', 'mystery'.", italics: true }),
            new Paragraph({ text: "Recommendations: Double-check the spelling of unusual plurals or words with double letters." }),

            new Paragraph({ text: "Score Summary", heading: HeadingLevel.HEADING_1 }),
            new Table({
                columnWidths: [4680, 2340, 2340],
                rows: [
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Criterion", bold: true })], shading: { fill: "D5E8F0", type: ShadingType.CLEAR } }), new TableCell({ children: [new Paragraph({ text: "Score", bold: true })], shading: { fill: "D5E8F0", type: ShadingType.CLEAR } }), new TableCell({ children: [new Paragraph({ text: "Max", bold: true })], shading: { fill: "D5E8F0", type: ShadingType.CLEAR } })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Audience" })] }), new TableCell({ children: [new Paragraph({ text: "4" })] }), new TableCell({ children: [new Paragraph({ text: "6" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Text Structure" })] }), new TableCell({ children: [new Paragraph({ text: "3" })] }), new TableCell({ children: [new Paragraph({ text: "4" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Ideas" })] }), new TableCell({ children: [new Paragraph({ text: "3" })] }), new TableCell({ children: [new Paragraph({ text: "5" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Character and Setting" })] }), new TableCell({ children: [new Paragraph({ text: "3" })] }), new TableCell({ children: [new Paragraph({ text: "4" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Vocabulary" })] }), new TableCell({ children: [new Paragraph({ text: "3" })] }), new TableCell({ children: [new Paragraph({ text: "5" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Cohesion" })] }), new TableCell({ children: [new Paragraph({ text: "3" })] }), new TableCell({ children: [new Paragraph({ text: "4" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Paragraphing" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Sentence Structure" })] }), new TableCell({ children: [new Paragraph({ text: "4" })] }), new TableCell({ children: [new Paragraph({ text: "6" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Punctuation" })] }), new TableCell({ children: [new Paragraph({ text: "4" })] }), new TableCell({ children: [new Paragraph({ text: "5" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Spelling" })] }), new TableCell({ children: [new Paragraph({ text: "5" })] }), new TableCell({ children: [new Paragraph({ text: "6" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "TOTAL", bold: true })] }), new TableCell({ children: [new Paragraph({ text: "34", bold: true })] }), new TableCell({ children: [new Paragraph({ text: "47", bold: true })] })] }),
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
    fs.writeFileSync("c:\\Users\\dsuth\\Documents\\Joshua\\Scrap\\Submitted files\\KORNER, Eva (ekorn10)\\NAPLAN Assessment - Eva Korner.docx", buffer);
});
