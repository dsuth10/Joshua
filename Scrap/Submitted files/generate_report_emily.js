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
            new Paragraph({ children: [new TextRun({ text: "Student Name: ", bold: true }), new TextRun("Emily Warburton")] }),
            new Paragraph({ children: [new TextRun({ text: "Date: ", bold: true }), new TextRun("2026-01-28")] }),
            new Paragraph({ children: [new TextRun({ text: "Total Score: ", bold: true }), new TextRun("22/47")] }),

            new Paragraph({ text: "Executive Summary", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: "Overall Strengths", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "• Highly imaginative and original plot involving magical shoes and transformations.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Clear narrative structure with a well-defined orientation, complications, and resolution.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Excellent use of paragraphing to organize the story's stages and shifts in action.", numbering: { reference: "bullet-points", level: 0 } }),

            new Paragraph({ text: "Areas for Development", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "• Punctuation accuracy—using full stops to break up 'run-on' sentences and separate independent ideas.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Spelling of common homophones and high-frequency words (e.g., 'costumers' vs 'customers', 'their' vs 'there').", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Sentence variety—experiment with starting sentences in different ways to make the writing even more engageing.", numbering: { reference: "bullet-points", level: 0 } }),

            new Paragraph({ text: "Detailed Assessment by Criterion", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: "1. Audience (3/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Successfully engages the reader through the identification of a unique and magical problem." }),
            new Paragraph({ text: "Evidence: \"Max put own of the shoes on when suddenly he turned into the person who owned the shoes...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Try to describe how Max felt when he first transformed. Was he scared, or was it just a bit 'weird'?" }),

            new Paragraph({ text: "2. Text Structure (3/4 points)", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: "Assessment: A controlled narrative with a clear orientation, multiple complications (transforming, broken machine), and a satisfied resolution.", }),
            new Paragraph({ text: "Evidence: \"Max had to keep making shoes... he uncovered an old shoe machine that he had to pedal...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Spend a little more time describing the basement. Was it dark and dusty or full of interesting old tools?" }),

            new Paragraph({ text: "3. Ideas (3/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: The core idea of 'stepping into someone else's shoes' literally is a very clever and well-executed concept.", }),
            new Paragraph({ text: "Evidence: \"Max tried all the tens on they all did the same thing Max turned into the people...\"", italics: true }),
            new Paragraph({ text: "Recommendations: What kind of person did Max turn into that was his favorite? Was it a famous person or just someone friendly?" }),

            new Paragraph({ text: "4. Character and Setting (2/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Max's character as a dedicated and curious shoemaker is well-established. The shop and basement settings are used appropriately." }),
            new Paragraph({ text: "Evidence: \"...he was the best shoemaker in all the town.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Describe the shoes more! Were they shiny leather or colorful sneakers?" }),

            new Paragraph({ text: "5. Vocabulary (2/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Uses some appropriate adjectives like 'amazingly' and 'suprised' and descriptive verbs like 'uncovered' and 'pedal'." }),
            new Paragraph({ text: "Evidence: \"...he uncovered and old shoe machine that he had to pedal...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Look for alternatives to the word 'guy' or 'person' to add more flavour to your writing (e.g., 'gentleman', 'individual')." }),

            new Paragraph({ text: "6. Cohesion (3/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Effective use of time markers and cause-and-effect links to sustain the narrative's logic." }),
            new Paragraph({ text: "Evidence: \"...but out of know where the shoe machine stopped working...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Use words like 'Unexpectedly' or 'Consequently' to bridge your sentences more effectively." }),

            new Paragraph({ text: "7. Paragraphing (2/2 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Excellent and consistent use of paragraphs to organize the narrative into logical sections." }),
            new Paragraph({ text: "Recommendations: Excellent paragraphing control. Keep using this to guide your reader." }),

            new Paragraph({ text: "8. Sentence Structure (2/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Mostly simple or compound sentences; there are some issues with sentence boundaries and repetitive subject use." }),
            new Paragraph({ text: "Evidence: \"...he was looking for a size 10 because he was a size 10, he was looking until suddenly...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Practice joining two related thoughts with words like 'because' or 'therefore' to make your sentences even stronger." }),

            new Paragraph({ text: "9. Punctuation (1/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Minimal punctuation control, with most sentences lacking end markers and internal pauses (commas)." }),
            new Paragraph({ text: "Evidence: \"There was a guy named Max he owned an amazing shoe store...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Every sentence should start with a capital letter and end with a full stop!" }),

            new Paragraph({ text: "10. Spelling (1/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Consistent errors in common and technical words, particularly homophones." }),
            new Paragraph({ text: "Evidence: 'costumers' for 'customers', 'their' for 'there', 'hole' for 'whole', 'heles' for 'heels', 'know where' for 'nowhere'.", italics: true }),
            new Paragraph({ text: "Recommendations: Practice the difference between words that sound the same but are spelled differently. It's a tricky part of English!" }),

            new Paragraph({ text: "Score Summary", heading: HeadingLevel.HEADING_1 }),
            new Table({
                columnWidths: [4680, 2340, 2340],
                rows: [
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Criterion", bold: true })], shading: { fill: "D5E8F0", type: ShadingType.CLEAR } }), new TableCell({ children: [new Paragraph({ text: "Score", bold: true })], shading: { fill: "D5E8F0", type: ShadingType.CLEAR } }), new TableCell({ children: [new Paragraph({ text: "Max", bold: true })], shading: { fill: "D5E8F0", type: ShadingType.CLEAR } })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Audience" })] }), new TableCell({ children: [new Paragraph({ text: "3" })] }), new TableCell({ children: [new Paragraph({ text: "6" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Text Structure" })] }), new TableCell({ children: [new Paragraph({ text: "3" })] }), new TableCell({ children: [new Paragraph({ text: "4" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Ideas" })] }), new TableCell({ children: [new Paragraph({ text: "3" })] }), new TableCell({ children: [new Paragraph({ text: "5" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Character and Setting" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] }), new TableCell({ children: [new Paragraph({ text: "4" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Vocabulary" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] }), new TableCell({ children: [new Paragraph({ text: "5" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Cohesion" })] }), new TableCell({ children: [new Paragraph({ text: "3" })] }), new TableCell({ children: [new Paragraph({ text: "4" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Paragraphing" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Sentence Structure" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] }), new TableCell({ children: [new Paragraph({ text: "6" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Punctuation" })] }), new TableCell({ children: [new Paragraph({ text: "1" })] }), new TableCell({ children: [new Paragraph({ text: "5" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Spelling" })] }), new TableCell({ children: [new Paragraph({ text: "1" })] }), new TableCell({ children: [new Paragraph({ text: "6" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "TOTAL", bold: true })] }), new TableCell({ children: [new Paragraph({ text: "22", bold: true })] }), new TableCell({ children: [new Paragraph({ text: "47", bold: true })] })] }),
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
    fs.writeFileSync("c:\\Users\\dsuth\\Documents\\Joshua\\Scrap\\Submitted files\\WARBURTON, Emily (ewarb11)\\NAPLAN Assessment - Emily Warburton.docx", buffer);
});
