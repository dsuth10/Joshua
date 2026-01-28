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
            new Paragraph({ children: [new TextRun({ text: "Student Name: ", bold: true }), new TextRun("Sophia Haufe")] }),
            new Paragraph({ children: [new TextRun({ text: "Date: ", bold: true }), new TextRun("2026-01-28")] }),
            new Paragraph({ children: [new TextRun({ text: "Total Score: ", bold: true }), new TextRun("17/47")] }),

            new Paragraph({ text: "Executive Summary", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: "Overall Strengths", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "• Ambitious attempt to cover a long period of characters' lives, spanning from childhood to university.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Good use of time markers (e.g., '5 mins later', '5 years later') to transition between scenes.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Effective paragraphing to separate different stages of the story and time jumps.", numbering: { reference: "bullet-points", level: 0 } }),

            new Paragraph({ text: "Areas for Development", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "• Spelling—this is a priority area. Focus on common words like 'says', 'they', and 'does', as well as more complex ones like 'graduate' and 'grammar'.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Narrative focus—try to stick to one main problem and solve it, rather than having many independent events happen quickly.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Punctuation accuracy—ensure every sentence starts with a capital letter and ends with a full stop.", numbering: { reference: "bullet-points", level: 0 } }),

            new Paragraph({ text: "Detailed Assessment by Criterion", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: "1. Audience (2/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Successfully orients the reader to the last day of school and uses colloquialisms like 'Avo' to engage." }),
            new Paragraph({ text: "Evidence: \"One brashy sunny Avo they walk home...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Try to explain the genie more. Why did the characters think they saw a genie if it was just a dog?" }),

            new Paragraph({ text: "2. Text Structure (2/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: The story has an orientation and several complications, but it shifts into a summary of events rather than a narrative resolution.", }),
            new Paragraph({ text: "Evidence: \"8 years later after Anabell gragerate they all go to the exact sane uni.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Focus the end of your story on the girls waking up and how they felt about the dog fairies, rather than jumping years ahead." }),

            new Paragraph({ text: "3. Ideas (2/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Several imaginative ideas are introduced (genies, fairies, snakes), but they aren't linked together into a strong central storyline." }),
            new Paragraph({ text: "Evidence: \"And the dog fairies flew to them and did cpr.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Pick your favorite idea—like the dog fairies—and tell a whole story about them." }),

            new Paragraph({ text: "4. Character and Setting (1/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Characters and settings are named but need more descriptive detail to come alive for the reader." }),
            new Paragraph({ text: "Evidence: \"Thay spot a tree and a genie.\"", italics: true }),
            new Paragraph({ text: "Recommendations: What did the backyard look like? Was it messy, or full of flowers?" }),

            new Paragraph({ text: "5. Vocabulary (2/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Uses some specific and technical words like 'CPR' and 'Graduate'." }),
            new Paragraph({ text: "Evidence: \"...did cpr. Thay did not wake up.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Use adjectives to describe the dog. Instead of 'fat dog', try 'rotund' or 'heavy-set'." }),

            new Paragraph({ text: "6. Cohesion (2/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Temporal markers help the reader navigate the large jumps in the story's timeline." }),
            new Paragraph({ text: "Evidence: \"After 4 years Olivia and Lilly gragerate...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Use more words like 'Meanwhile' or 'Consequently' to connect the character's actions to their consequences." }),

            new Paragraph({ text: "7. Paragraphing (2/2 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Appropriate use of paragraphs to organize the story's structure across different time jumps." }),
            new Paragraph({ text: "Recommendations: Great work. Keep using paragraphs to signal shifts in time and place." }),

            new Paragraph({ text: "8. Sentence Structure (2/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Most sentences are simple or compound; control over complex sentences is limited." }),
            new Paragraph({ text: "Evidence: \"Mum walks outside with the kids and there was nothing but a fat dog growling.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Focus on keeping your verb tenses consistent. Try to write the whole story in the past tense (e.g., 'they walked' instead of 'they walk')." }),

            new Paragraph({ text: "9. Punctuation (1/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Punctuation is inconsistent, with many sentences lacking start or end markers." }),
            new Paragraph({ text: "Evidence: \"...and olivea jumped on Lilly and the snake died but it was not politeness.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Every time you use a name like 'Olivia' or 'Lilly', it needs a capital letter. Names are important!" }),

            new Paragraph({ text: "10. Spelling (1/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Extensive spelling errors in common high-frequency words and specialized vocabulary." }),
            new Paragraph({ text: "Evidence: ' Sed', 'Thay', 'babby', 'gragerate'.", italics: true }),
            new Paragraph({ text: "Recommendations: Keep a personal dictionary of words you use often but find hard to spell, like 'Graduate'." }),

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
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Paragraphing" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Sentence Structure" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] }), new TableCell({ children: [new Paragraph({ text: "6" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Punctuation" })] }), new TableCell({ children: [new Paragraph({ text: "1" })] }), new TableCell({ children: [new Paragraph({ text: "5" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Spelling" })] }), new TableCell({ children: [new Paragraph({ text: "1" })] }), new TableCell({ children: [new Paragraph({ text: "6" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "TOTAL", bold: true })] }), new TableCell({ children: [new Paragraph({ text: "17", bold: true })] }), new TableCell({ children: [new Paragraph({ text: "47", bold: true })] })] }),
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
    fs.writeFileSync("c:\\Users\\dsuth\\Documents\\Joshua\\Scrap\\Submitted files\\HAUFE, Sophia (shauf0)\\NAPLAN Assessment - Sophia Haufe.docx", buffer);
});
