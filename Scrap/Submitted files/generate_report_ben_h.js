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
            new Paragraph({ children: [new TextRun({ text: "Student Name: ", bold: true }), new TextRun("Ben Hicks")] }),
            new Paragraph({ children: [new TextRun({ text: "Date: ", bold: true }), new TextRun("2026-01-28")] }),
            new Paragraph({ children: [new TextRun({ text: "Total Score: ", bold: true }), new TextRun("19/47")] }),

            new Paragraph({ text: "Executive Summary", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: "Overall Strengths", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "• Highly imaginative and original storyline involving a T-Rex and a frog living in a mansion.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Good use of descriptive imagery, such as the 'boots on the ceiling' and 'invisible glass box'.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Effective use of paragraphing to structure the different parts of the afternoon.", numbering: { reference: "bullet-points", level: 0 } }),

            new Paragraph({ text: "Areas for Development", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "• Punctuation accuracy—ensure every sentence ends with a full stop and dialogue is marked with quotation marks.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Spelling—focus on learning the spelling of common words like 'movie' and 'friends'.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Narrative link—providing more explanation for how the characters go from a hunt in the woods to a movie night in a mansion.", numbering: { reference: "bullet-points", level: 0 } }),

            new Paragraph({ text: "Detailed Assessment by Criterion", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: "1. Audience (2/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Successfully orients the reader to a fun and whimsical world through an engaging opening." }),
            new Paragraph({ text: "Evidence: \"...when it jumped it was like a Earthquake .\"", italics: true }),
            new Paragraph({ text: "Recommendations: Try to describe Sam's feelings when he's tired. Was his stomach rumbling or were his legs 'like jelly'?" }),

            new Paragraph({ text: "2. Text Structure (2/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: The narrative moves through a series of connected events, but the transition between the woods and the mansion is very quick." }),
            new Paragraph({ text: "Evidence: \"Sam made it to BOBS MANSION...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Use a few sentences to describe the walk (or ride) to the mansion. What did Sam see on the way?" }),

            new Paragraph({ text: "3. Ideas (2/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: The inclusion of a magic, indestructible book is an exciting idea that could be expanded." }),
            new Paragraph({ text: "Evidence: \"...there was a mysteries book and Bob said theres magic in that...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Maybe the magic book could have helped Sam find his food at the start of the story!" }),

            new Paragraph({ text: "4. Character and Setting (2/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Interesting character dynamics and unique setting details like 'boots on the ceiling' make the story memorable." }),
            new Paragraph({ text: "Evidence: \"...some boots on the ceiling then they go into a masive movie room.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Describe Sam the T-Rex. Is he a big, scary-looking dinosaur with a gentle heart?" }),

            new Paragraph({ text: "5. Vocabulary (2/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Uses some great verbs and adjectives like 'chomp' and 'indestructible'." }),
            new Paragraph({ text: "Evidence: \"...it's indestructible .\"", italics: true }),
            new Paragraph({ text: "Recommendations: Use different words for 'said' to show how Sam and Bob were speaking (e.g., 'bellowed', 'whispered')." }),

            new Paragraph({ text: "6. Cohesion (2/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Simple links are used to keep the reader moving through the timeline of the afternoon." }),
            new Paragraph({ text: "Evidence: \"after dinner he said do you want to come over to my house...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Use words like 'Eventually' or 'Suddenly' to make your transitions more exciting." }),

            new Paragraph({ text: "7. Paragraphing (2/2 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Paragraphs are used appropriately to organize the story into different scenes." }),
            new Paragraph({ text: "Recommendations: Excellent work. Keep using paragraphs to guide your reader through the story." }),

            new Paragraph({ text: "8. Sentence Structure (2/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Most sentences are simple or compound, though there are some missing words in places." }),
            new Paragraph({ text: "Evidence: \"The frog me a ride home .\"", italics: true }),
            new Paragraph({ text: "Recommendations: Every sentence needs a 'doing' word (verb). For example: 'The frog GAVE me a ride home.'" }),

            new Paragraph({ text: "9. Punctuation (1/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Inconsistent use of full stops and a lack of dialogue punctuation make the text harder to follow." }),
            new Paragraph({ text: "Evidence: \"Sam made it to BOBS MANSION there was a mysteries book...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Use quotation marks whenever a character starts and stops speaking." }),

            new Paragraph({ text: "10. Spelling (2/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: High-frequency words like 'movie' and 'friends' are misspelled, but complex words are attempted." }),
            new Paragraph({ text: "Evidence: 'indestructible' is correct; 'move' for 'movie' and 'frends' for 'friends' are errors.", italics: true }),
            new Paragraph({ text: "Recommendations: Practice common words that have 'silent' letters or multiple vowels, like 'movie'." }),

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
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Cohesion" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] }), new TableCell({ children: [new Paragraph({ text: "4" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Paragraphing" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Sentence Structure" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] }), new TableCell({ children: [new Paragraph({ text: "6" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Punctuation" })] }), new TableCell({ children: [new Paragraph({ text: "1" })] }), new TableCell({ children: [new Paragraph({ text: "5" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Spelling" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] }), new TableCell({ children: [new Paragraph({ text: "6" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "TOTAL", bold: true })] }), new TableCell({ children: [new Paragraph({ text: "19", bold: true })] }), new TableCell({ children: [new Paragraph({ text: "47", bold: true })] })] }),
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
    fs.writeFileSync("c:\\Users\\dsuth\\Documents\\Joshua\\Scrap\\Submitted files\\HICKS, Ben (bhick124)\\NAPLAN Assessment - Ben Hicks.docx", buffer);
});
