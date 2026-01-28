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
            new Paragraph({ children: [new TextRun({ text: "Student Name: ", bold: true }), new TextRun("Cheston Whitehead")] }),
            new Paragraph({ children: [new TextRun({ text: "Date: ", bold: true }), new TextRun("2026-01-28")] }),
            new Paragraph({ children: [new TextRun({ text: "Total Score: ", bold: true }), new TextRun("18/47")] }),

            new Paragraph({ text: "Executive Summary", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: "Overall Strengths", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "• Engaging and adventurous premise involving a journey down a 'ruff' river.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Creative and practical resolution to the complication (building a ramp to go back up).", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Good use of paragraphing to organize the narrative into logical sections of action.", numbering: { reference: "bullet-points", level: 0 } }),

            new Paragraph({ text: "Areas for Development", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "• Punctuation accuracy—using full stops to break up 'run-on' sentences and separate independent ideas.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Spelling of common high-frequency words and technical terms (e.g., 'rough', 'through', 'too', 'their').", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Elaborating on details—describe the boat or the river with more sensory words to make the scene more vivid.", numbering: { reference: "bullet-points", level: 0 } }),

            new Paragraph({ text: "Detailed Assessment by Criterion", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: "1. Audience (2/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Successfully engages the reader through the identification of a problem (waterfall) and a sense of adventure." }),
            new Paragraph({ text: "Evidence: \"Bob and Jerry had to stop because they saw a waterfall... they were already going way to fast to stop.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Try to describe how Jerry's stomach felt when he saw the waterfall. Was it like a 'rollercoaster drop'?" }),

            new Paragraph({ text: "2. Text Structure (2/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: A clear narrative with an orientation, a complication (waterfall), and a creative resolution (building a ramp).", }),
            new Paragraph({ text: "Evidence: \"Bob and Jerry started digging and putting the dirt in the river to make a ramp so they can get up the waterfall...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Spend a little more time describing the 'fixing the boat' part. What tools did they use from their backpacks?" }),

            new Paragraph({ text: "3. Ideas (2/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: The core idea of two friends overcoming a physical obstacle through teamwork and problem-solving is well-executed.", }),
            new Paragraph({ text: "Evidence: \"The two friends quickly jumped out of the boat onto land and the boat whent flinging of the edge.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Why was the boat 'awesome' and 'expensive'? Did Jerry build it himself?" }),

            new Paragraph({ text: "4. Character and Setting (2/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: The characters are defined by their actions and goals. The river and waterfall settings are used appropriately." }),
            new Paragraph({ text: "Evidence: \"Jerry went exploring in is boat down a river...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Describe the 'steep hill'! Was it covered in mud or rocks?" }),

            new Paragraph({ text: "5. Vocabulary (2/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Uses some appropriate adjectives like 'expensive' and 'awesome' and descriptive verbs like 'flinging' and 'repearing'." }),
            new Paragraph({ text: "Evidence: \"...and taking there tools out of there backpack and started to repear the boat.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Look for more precise words for 'ruff' (e.g., 'turbulent', 'rapid')." }),

            new Paragraph({ text: "6. Cohesion (2/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Simple temporal markers and cause-and-effect links sustain the narrative's flow across different scenes." }),
            new Paragraph({ text: "Evidence: \"The two friends quickly jumped out... and then they had finished fixing the boat.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Use words like 'Eventually' or 'Unexpectedly' to bridge your paragraphs more effectively." }),

            new Paragraph({ text: "7. Paragraphing (2/2 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Excellent and consistent use of paragraphs to organize the narrative into logical sections of action." }),
            new Paragraph({ text: "Recommendations: Excellent paragraphing control. Keep using this to guide your reader." }),

            new Paragraph({ text: "8. Sentence Structure (1/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Mostly simple or compound sentences; there are some issues with sentence boundaries and repetitive subject use." }),
            new Paragraph({ text: "Evidence: \"Bob and Jerry had to stop because they saw a waterfall, but they couldn't stop...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Practice joining two related thoughts with words like 'because' or 'therefore' to make your sentences even stronger." }),

            new Paragraph({ text: "9. Punctuation (1/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Minimal punctuation control, with many sentences lacking end markers and internal pauses (commas)." }),
            new Paragraph({ text: "Evidence: \"Jerry went exploring in is boat down a river with his best friend...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Every sentence should start with a capital letter and end with a full stop!" }),

            new Paragraph({ text: "10. Spelling (1/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Consistent errors in common and technical words, particularly homophones and phonetic spellings." }),
            new Paragraph({ text: "Evidence: 'is' for 'his', 'ruff' for 'rough', 'thew' for 'through', 'to' for 'too', 'whent' for 'went', 'steap' for 'steep', 'there' for 'their', 'repear' for 'repair'.", italics: true }),
            new Paragraph({ text: "Recommendations: Practice the difference between words that sound the same but are spelled differently. It's a tricky part of English!" }),

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
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Sentence Structure" })] }), new TableCell({ children: [new Paragraph({ text: "1" })] }), new TableCell({ children: [new Paragraph({ text: "6" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Punctuation" })] }), new TableCell({ children: [new Paragraph({ text: "1" })] }), new TableCell({ children: [new Paragraph({ text: "5" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Spelling" })] }), new TableCell({ children: [new Paragraph({ text: "1" })] }), new TableCell({ children: [new Paragraph({ text: "6" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "TOTAL", bold: true })] }), new TableCell({ children: [new Paragraph({ text: "18", bold: true })] }), new TableCell({ children: [new Paragraph({ text: "47", bold: true })] })] }),
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
    fs.writeFileSync("c:\\Users\\dsuth\\Documents\\Joshua\\Scrap\\Submitted files\\WHITEHEAD, Cheston (cwhit811)\\NAPLAN Assessment - Cheston Whitehead.docx", buffer);
});
