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
            new Paragraph({ children: [new TextRun({ text: "Student Name: ", bold: true }), new TextRun("Isabelle Newell")] }),
            new Paragraph({ children: [new TextRun({ text: "Date: ", bold: true }), new TextRun("2026-01-28")] }),
            new Paragraph({ children: [new TextRun({ text: "Total Score: ", bold: true }), new TextRun("33/47")] }),

            new Paragraph({ text: "Executive Summary", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: "Overall Strengths", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "• Excellent character development, establishing Kiro K as a distinct and relatable protagonist with a unique struggle.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Strong use of descriptive imagery, particularly when describing the 'jungle' garden and Kiro's appearance.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Good control of sentence variety, using short sentences effectively for emotional impact.", numbering: { reference: "bullet-points", level: 0 } }),

            new Paragraph({ text: "Areas for Development", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "• Narrative logic—adding a few more clues about the potion's origin would make the discovery feel more earned.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Sentence flow—ensuring that complex ideas are connected clearly without becoming too dense for the reader.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Dialogue elaboration—adding more depth to the conversation between Kiro and her parents about the 'cure'.", numbering: { reference: "bullet-points", level: 0 } }),

            new Paragraph({ text: "Detailed Assessment by Criterion", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: "1. Audience (3/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Successfully orients the reader to Kiro's world and creates empathy for her emotional condition." }),
            new Paragraph({ text: "Evidence: \"Life sounds tough for her. She lives in a mini cute cabin with lots of decorations.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Keep using those descriptive adjectives! Try to describe the 'jungle garden' with even more sensory words (smell, touch)." }),

            new Paragraph({ text: "2. Text Structure (3/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: A well-paced narrative that moves from an interesting orientation through a clear complication to a heartwarming resolution." }),
            new Paragraph({ text: "Evidence: \"She felt a mixture of confusion and happiness, she ran to her mum and dad and explained everything.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Describe Kiro's journey into the garden more. Did the trees seem scary or magical as she 'stomped' past?" }),

            new Paragraph({ text: "3. Ideas (3/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: The core idea of an emotional 'cure' found in nature is a creative take on the narrative prompt." }),
            new Paragraph({ text: "Evidence: \"Inside was this weird, purple liquid, the date said 27/1/2026.\"", italics: true }),
            new Paragraph({ text: "Recommendations: What did the potion taste like? Was it sweet like berries or bitter like medicine?" }),

            new Paragraph({ text: "4. Character and Setting (3/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Kiro K is a very well-defined character with a distinct look and a clearly explained internal struggle." }),
            new Paragraph({ text: "Evidence: \"...always wearing a mini sequin top. The only time I'd ever see her is when she roams around...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Describe Kiro's parents more. Were they worried about her, or were they always hopeful she would find a cure?" }),

            new Paragraph({ text: "5. Vocabulary (3/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Uses some very effective and precise vocabulary to describe emotions and movements." }),
            new Paragraph({ text: "Evidence: \"Barely. Though today changed.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Use different words for 'mini' to show the reader exactly how small something is (e.g., 'minuscule', 'tiny')." }),

            new Paragraph({ text: "6. Cohesion (3/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Good use of cohesive devices to link events across time and different locations." }),
            new Paragraph({ text: "Evidence: \"Later she woke up, in her bed, it felt like the day had start over...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Use words like 'Unexpectedly' or 'Consequently' to make your transitions more sophisticated." }),

            new Paragraph({ text: "7. Paragraphing (2/2 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Paragraphs are used effectively and consistently to organize the story's stages." }),
            new Paragraph({ text: "Recommendations: Excellent paragraphing control. Keep using this to guide your reader." }),

            new Paragraph({ text: "8. Sentence Structure (4/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: A good variety of sentence types are used, with effective use of short sentences for impact." }),
            new Paragraph({ text: "Evidence: \"Meet Kiro K, a silent but smart kid. Kiro wasn't like others.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Check that every long sentence has a clear 'break' so it doesn't run on too long." }),

            new Paragraph({ text: "9. Punctuation (4/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Punctuation is used correctly to signal tone and dialogue, with good variety." }),
            new Paragraph({ text: "Evidence: \"'Another day, another way.' the girl muttered.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Try using a semi-colon instead of a comma when you're connecting two big ideas that are closely related." }),

            new Paragraph({ text: "10. Spelling (5/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Almost all words are spelled correctly, including more difficult technical terms." }),
            new Paragraph({ text: "Evidence: 'sequin', 'emotionless', 'braided'.", italics: true }),
            new Paragraph({ text: "Recommendations: Keep up the great spelling! Double-check the spelling of unusual word combinations." }),

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
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Sentence Structure" })] }), new TableCell({ children: [new Paragraph({ text: "4" })] }), new TableCell({ children: [new Paragraph({ text: "6" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Punctuation" })] }), new TableCell({ children: [new Paragraph({ text: "4" })] }), new TableCell({ children: [new Paragraph({ text: "5" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Spelling" })] }), new TableCell({ children: [new Paragraph({ text: "5" })] }), new TableCell({ children: [new Paragraph({ text: "6" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "TOTAL", bold: true })] }), new TableCell({ children: [new Paragraph({ text: "33", bold: true })] }), new TableCell({ children: [new Paragraph({ text: "47", bold: true })] })] }),
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
    fs.writeFileSync("c:\\Users\\dsuth\\Documents\\Joshua\\Scrap\\Submitted files\\NEWELL, Isabelle (inewe5)\\NAPLAN Assessment - Isabelle Newell.docx", buffer);
});
