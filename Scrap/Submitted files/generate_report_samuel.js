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
            new Paragraph({ children: [new TextRun({ text: "Student Name: ", bold: true }), new TextRun("Samuel Ross")] }),
            new Paragraph({ children: [new TextRun({ text: "Date: ", bold: true }), new TextRun("2026-01-28")] }),
            new Paragraph({ children: [new TextRun({ text: "Total Score: ", bold: true }), new TextRun("20/47")] }),

            new Paragraph({ text: "Executive Summary", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: "Overall Strengths", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "• Deeply emotive storyline that successfully engages the reader's sympathy.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Creative use of a magical element (the bear writing a letter) to solve a character's problem.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Good narrative arc from a childhood hobby to a future career (becoming a teacher).", numbering: { reference: "bullet-points", level: 0 } }),

            new Paragraph({ text: "Areas for Development", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "• Punctuation accuracy—using full stops to break up long sentences and separate distinct events.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Spelling of common and technical words (e.g., 'complements' for 'compliments', 'plase' for 'place').", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Narrative pacing—allowing the big emotional moments (like the news about the mother) to have more space in the story.", numbering: { reference: "bullet-points", level: 0 } }),

            new Paragraph({ text: "Detailed Assessment by Criterion", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: "1. Audience (2/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Successfully orients the reader to Ava's world and creates a strong emotional impact through the family tragedy." }),
            new Paragraph({ text: "Evidence: \"'Your mother died this morning from a car crash' the girl got home and was too sad to play...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Try to describe Ava's room more. Did it feel different now that she was sad?" }),

            new Paragraph({ text: "2. Text Structure (2/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: A controlled narrative with a clear orientation, a significant complication, and a magical/hopeful resolution.", }),
            new Paragraph({ text: "Evidence: \"...the bear went into her bedroom and somehow writ the girl a letter...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Spend a little more time describing the hospital visit. What did Ava see or hear as she walked down the hallway?" }),

            new Paragraph({ text: "3. Ideas (2/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: The inclusion of a bear that can write a comforting letter is a very imaginative and original idea.", }),
            new Paragraph({ text: "Evidence: \"...the bear went into her bedroom and somehow writ the girl a letter that said 'I wont hurt you'\"", italics: true }),
            new Paragraph({ text: "Recommendations: Why did the bear choose Ava? Was he a guardian or a lost bear himself?" }),

            new Paragraph({ text: "4. Character and Setting (1/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Characters are named, but the settings (school, home, hospital) lack descriptive detail to build atmosphere." }),
            new Paragraph({ text: "Evidence: \"...everyday she found sticks and built mini little castles out of them at school...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Describe the bear! Was he a big grizzly or a friendly-looking black bear?" }),

            new Paragraph({ text: "5. Vocabulary (2/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Uses some effective emotive phrases like 'crying his eyes out' and 'softly'." }),
            new Paragraph({ text: "Evidence: \"Wait Ava she said softly\"", italics: true }),
            new Paragraph({ text: "Recommendations: Look for more descriptive words for the 'mini castles'. Were they 'intricate' or 'towering'?" }),

            new Paragraph({ text: "6. Cohesion (2/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Simple temporal markers help the reader navigate the transition from Ava's childhood to her adulthood." }),
            new Paragraph({ text: "Evidence: \"A few years later Ava becomes a teacher...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Use words like 'Unexpectedly' or 'Consequently' to bridge your scenes more effectively." }),

            new Paragraph({ text: "7. Paragraphing (1/2 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Minimal attempt to organize the text into paragraphs to separate different scenes and dialogue." }),
            new Paragraph({ text: "Recommendations: Start a new paragraph every time the location changes (from school to home, from home to hospital)." }),

            new Paragraph({ text: "8. Sentence Structure (2/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Mostly simple or compound sentences; some are quite long and run together." }),
            new Paragraph({ text: "Evidence: \"Once there was a little girl named Ava and everyday she found sticks and built mini little castles...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Practice using short sentences for big emotional impact. For example: 'Ava was heartbroken.'" }),

            new Paragraph({ text: "9. Punctuation (2/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Correct implementation of some basic punctuation, but many sentences lack start or end markers." }),
            new Paragraph({ text: "Evidence: \"'Why are you so sad Dad?' He looked at her...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Ensure every sentence starts with a capital letter and ends with a full stop, even when dialogue is involved." }),

            new Paragraph({ text: "10. Spelling (2/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Consistent errors in high-frequency and technical words." }),
            new Paragraph({ text: "Evidence: 'complements' for 'compliments', 'writ' for 'wrote', 'plase' for 'place', 'wont' for 'won't'.", italics: true }),
            new Paragraph({ text: "Recommendations: Practice spelling words with silent letters and apostrophes, like 'won't'." }),

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
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Paragraphing" })] }), new TableCell({ children: [new Paragraph({ text: "1" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Sentence Structure" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] }), new TableCell({ children: [new Paragraph({ text: "6" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Punctuation" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] }), new TableCell({ children: [new Paragraph({ text: "5" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Spelling" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] }), new TableCell({ children: [new Paragraph({ text: "6" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "TOTAL", bold: true })] }), new TableCell({ children: [new Paragraph({ text: "20", bold: true })] }), new TableCell({ children: [new Paragraph({ text: "47", bold: true })] })] }),
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
    fs.writeFileSync("c:\\Users\\dsuth\\Documents\\Joshua\\Scrap\\Submitted files\\ROSS, Samuel (sross275)\\NAPLAN Assessment - Samuel Ross.docx", buffer);
});
