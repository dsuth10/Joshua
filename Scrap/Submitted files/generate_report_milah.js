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
            new Paragraph({ children: [new TextRun({ text: "Student Name: ", bold: true }), new TextRun("Milah Whip")] }),
            new Paragraph({ children: [new TextRun({ text: "Date: ", bold: true }), new TextRun("2026-01-28")] }),
            new Paragraph({ children: [new TextRun({ text: "Total Score: ", bold: true }), new TextRun("26/47")] }),

            new Paragraph({ text: "Executive Summary", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: "Overall Strengths", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "• Excellent and imaginative hook with the discovery of a 'magic book' in a mountain cave.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Creative use of rhyming dialogue for the spell, which adds a lot of flavor to the story.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Effective use of simile ('as clueless as a chickpea') to show character traits.", numbering: { reference: "bullet-points", level: 0 } }),

            new Paragraph({ text: "Areas for Development", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "• Sentence-level variety—experiment with connecting thoughts using conjunctions like 'while' or 'although' to avoid 'run-on' sentences.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Homophone accuracy—practice the difference between 'too' and 'to' in your writing.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Punctuation accuracy—using commas to separate ideas and make the narrative easier for the reader to follow.", numbering: { reference: "bullet-points", level: 0 } }),

            new Paragraph({ text: "Detailed Assessment by Criterion", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: "1. Audience (3/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Successfully engages the reader through the identification of a mystery and a sense of wonder." }),
            new Paragraph({ text: "Evidence: \"...she saw a little cave with a bright light shining out.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Keep using those descriptive words for scenes! Try to describe the mountain climb more. Was it cold or sunny?" }),

            new Paragraph({ text: "2. Text Structure (3/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: A controlled narrative with a clear orientation, multiple complications (Bob getting lost, magic book), and a satisfied resolution.", }),
            new Paragraph({ text: "Evidence: \"On the way back to the village, they saw their parents looking for them...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Spend more time on the 'room spinning' part. What did Lucy see or hear as the magic was working?" }),

            new Paragraph({ text: "3. Ideas (3/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: The core idea of a rhyming spell found in an old book is a creative take on the narrative prompt.", }),
            new Paragraph({ text: "Evidence: \"'To the left is blue,to the right is green, Bring Bob back like it was all a dream'.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Why was the book in the cave? Was it an old gift or a lost treasure?" }),

            new Paragraph({ text: "4. Character and Setting (2/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Lucy and Bob's characters are established. The settings of the mountain and the village are used appropriately." }),
            new Paragraph({ text: "Evidence: \"Character: lucy a blond little girl and bob a boy with brown hair.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Describe the parents more! Were they worried or just happy to see the kids?" }),

            new Paragraph({ text: "5. Vocabulary (3/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Uses some appropriate adjectives like 'bright' and 'wide' and descriptive similes like 'clueless as a chickpea'." }),
            new Paragraph({ text: "Evidence: \"...as clueless as a chickpea.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Look for more precise words for 'wandered' (e.g., 'scrambled', 'darted')." }),

            new Paragraph({ text: "6. Cohesion (3/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Effective use of time markers and cause-and-effect links to sustain the narrative's logic." }),
            new Paragraph({ text: "Evidence: \"Without thinking she picked up the spell book and started saying a spell...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Use words like 'Eventually' or 'Unexpectedly' to bridge your paragraphs more effectively." }),

            new Paragraph({ text: "7. Paragraphing (2/2 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Excellent and consistent use of paragraphs to organize the different stages of the story." }),
            new Paragraph({ text: "Recommendations: Excellent paragraphing control. Keep using this to guide your reader." }),

            new Paragraph({ text: "8. Sentence Structure (2/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Mostly simple or compound sentences; there are some issues with sentence boundaries and repetitive subject use." }),
            new Paragraph({ text: "Evidence: \"As she turned her head to tell Bob she realised, he had wandered off...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Practice joining two related thoughts with words like 'because' or 'therefore' to make your sentences even stronger." }),

            new Paragraph({ text: "9. Punctuation (2/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Basic implementation of punctuation, with effective use of quotation marks for the spell." }),
            new Paragraph({ text: "Evidence: \"...saying a spell which was 'To the left is blue,to the right is green, Bring Bob back like it was all a dream'.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Ensure every sentence should start with a capital letter and end with a full stop!" }),

            new Paragraph({ text: "10. Spelling (3/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Some errors in high-frequency words and common homophones." }),
            new Paragraph({ text: "Evidence: 'too' for 'to', 'wandered' for 'wondered' (used in both contexts).", italics: true }),
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
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Vocabulary" })] }), new TableCell({ children: [new Paragraph({ text: "3" })] }), new TableCell({ children: [new Paragraph({ text: "5" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Cohesion" })] }), new TableCell({ children: [new Paragraph({ text: "3" })] }), new TableCell({ children: [new Paragraph({ text: "4" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Paragraphing" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Sentence Structure" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] }), new TableCell({ children: [new Paragraph({ text: "6" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Punctuation" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] }), new TableCell({ children: [new Paragraph({ text: "5" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Spelling" })] }), new TableCell({ children: [new Paragraph({ text: "3" })] }), new TableCell({ children: [new Paragraph({ text: "6" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "TOTAL", bold: true })] }), new TableCell({ children: [new Paragraph({ text: "26", bold: true })] }), new TableCell({ children: [new Paragraph({ text: "47", bold: true })] })] }),
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
    fs.writeFileSync("c:\\Users\\dsuth\\Documents\\Joshua\\Scrap\\Submitted files\\WHIP, Milah (mwhip0)\\NAPLAN Assessment - Milah Whip.docx", buffer);
});
