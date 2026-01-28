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
            new Paragraph({ children: [new TextRun({ text: "Student Name: ", bold: true }), new TextRun("Amelia Schwager")] }),
            new Paragraph({ children: [new TextRun({ text: "Date: ", bold: true }), new TextRun("2026-01-28")] }),
            new Paragraph({ children: [new TextRun({ text: "Total Score: ", bold: true }), new TextRun("24/47")] }),

            new Paragraph({ text: "Executive Summary", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: "Overall Strengths", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "• Imaginative and well-paced plot involving a lucky coin and its impact on a character's life.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Excellent use of paragraphing to organize the narrative and signal shifts in action.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Strong emotional engagement through Milly's desperation to find a job and her care for Lucky the cat.", numbering: { reference: "bullet-points", level: 0 } }),

            new Paragraph({ text: "Areas for Development", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "• Spelling accuracy—focus on homophones (e.g., 'new' vs 'knew') and common high-frequency words (e.g., 'exhausted').", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Sentence-level flow—using connecting words like 'because' or 'although' to create more complex sentences.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Punctuation variety—while exclamation marks are used well for emphasis, consider using more commas to separate ideas.", numbering: { reference: "bullet-points", level: 0 } }),

            new Paragraph({ text: "Detailed Assessment by Criterion", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: "1. Audience (3/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Successfully engages the reader through the identification of a problem (debt) and a relatable passion (cats)." }),
            new Paragraph({ text: "Evidence: \"Then she pulled out her laptop and looked at how much debt she was in!\"", italics: true }),
            new Paragraph({ text: "Recommendations: Try to describe how Milly's stomach felt when she saw her debt. Was it like a 'knot' or a 'heavy stone'?" }),

            new Paragraph({ text: "2. Text Structure (3/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: A clear and effective narrative with an orientation, multiple complications (losing the cat/coin), and a satisfied resolution.", }),
            new Paragraph({ text: "Evidence: \"Milly rushed down there and stuck her hands in the cement and got it out!!!!!!\"", italics: true }),
            new Paragraph({ text: "Recommendations: Spend a little more time describing the sidewalk scene. What did the workers look like when Milly reached into the cement?" }),

            new Paragraph({ text: "3. Ideas (3/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: The core idea of a luck-swapping coin is a clever and well-executed supernatural element.", }),
            new Paragraph({ text: "Evidence: \"From that day on she was very lucky but the cat was not.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Why did the coin have a four-leaf clover? Was it an old gift from someone special?" }),

            new Paragraph({ text: "4. Character and Setting (2/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Milly's character is established through her actions and goals. The settings of the home and shelter are used appropriately." }),
            new Paragraph({ text: "Evidence: \"Milly and Lucky lived a very good life from that small coin with a four leaf clover on it!\"", italics: true }),
            new Paragraph({ text: "Recommendations: Describe the cat, Lucky! Was he a fluffy black cat or a sleek one with yellow eyes?" }),

            new Paragraph({ text: "5. Vocabulary (2/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Uses some appropriate adjectives like 'unlucky' and 'perfect' and descriptive verbs like 'snuggled' and 'escaped'." }),
            new Paragraph({ text: "Evidence: \"...found him snuggled up on her couch.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Look for alternatives to the word 'found' to show how Milly was searching (e.g., 'scoured', 'spied')." }),

            new Paragraph({ text: "6. Cohesion (3/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Effective use of time markers and cause-and-effect links to sustain the narrative's logic." }),
            new Paragraph({ text: "Evidence: \"Now they were both VERY unlucky so she looked everywhere...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Use some more sophisticated linking words like 'Unexpectedly' or 'Consequently' to bridge your paragraphs." }),

            new Paragraph({ text: "7. Paragraphing (2/2 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Excellent and consistent use of paragraphs to organize the different stages of the story." }),
            new Paragraph({ text: "Recommendations: Great work. Keep using this to guide your reader's journey." }),

            new Paragraph({ text: "8. Sentence Structure (2/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Mostly simple or compound sentences; there are some issues with sentence boundaries and subject-verb agreement." }),
            new Paragraph({ text: "Evidence: \"Milly and Lucky lived a very good life from that small coin with a four leaf clover on it!\"", italics: true }),
            new Paragraph({ text: "Recommendations: Practice joining two related thoughts with words like 'because' or 'therefore' to make your sentences even stronger." }),

            new Paragraph({ text: "9. Punctuation (2/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Exclamation marks are used for emphasis, but basic punctuation like full stops and commas are sometimes missing." }),
            new Paragraph({ text: "Evidence: \"BABYSITTING CATS!!!!!!!\"", italics: true }),
            new Paragraph({ text: "Recommendations: Remember that even with six exclamation marks, a sentence always needs a capital letter at the start!" }),

            new Paragraph({ text: "10. Spelling (2/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Consistent errors in common and technical words, particularly homophones." }),
            new Paragraph({ text: "Evidence: 'exughsted' for 'exhausted', 'new' for 'knew', 'sementing' for 'cementing', 'heled' for 'held'.", italics: true }),
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
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Punctuation" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] }), new TableCell({ children: [new Paragraph({ text: "5" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Spelling" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] }), new TableCell({ children: [new Paragraph({ text: "6" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "TOTAL", bold: true })] }), new TableCell({ children: [new Paragraph({ text: "24", bold: true })] }), new TableCell({ children: [new Paragraph({ text: "47", bold: true })] })] }),
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
    fs.writeFileSync("c:\\Users\\dsuth\\Documents\\Joshua\\Scrap\\Submitted files\\SCHWAGER, Amelia (aschw85)\\NAPLAN Assessment - Amelia Schwager.docx", buffer);
});
