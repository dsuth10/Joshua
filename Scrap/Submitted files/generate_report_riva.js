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
            new Paragraph({ children: [new TextRun({ text: "Student Name: ", bold: true }), new TextRun("Riva Welch")] }),
            new Paragraph({ children: [new TextRun({ text: "Date: ", bold: true }), new TextRun("2026-01-28")] }),
            new Paragraph({ children: [new TextRun({ text: "Total Score: ", bold: true }), new TextRun("20/47")] }),

            new Paragraph({ text: "Executive Summary", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: "Overall Strengths", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "• Strong use of suspense and escalating danger to build a dark and engaging Atmosphere.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Good use of character labels and relationships to ground the story in a family setting.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Effective use of onomatopoeia ('POW!', 'RAW!') to heighten the drama during the resolution.", numbering: { reference: "bullet-points", level: 0 } }),

            new Paragraph({ text: "Areas for Development", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "• Punctuation accuracy—using full stops to break up 'run-on' sentences and separate independent ideas.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Spelling of high-frequency words (e.g., 'rangers' instead of 'ranges', 'probably' instead of 'probbly').", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Narrative tone—ensure the level of graphic detail remains appropriate for the intended audience.", numbering: { reference: "bullet-points", level: 0 } }),

            new Paragraph({ text: "Detailed Assessment by Criterion", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: "1. Audience (2/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Successfully engages the reader through the identification of a mystery and a sense of peril." }),
            new Paragraph({ text: "Evidence: \"Everything was nice and there were all having a nice time until a very strange sound woke them up...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Keep using those descriptive words for scenes! Try to describe the national park more. Was it full of tall pine trees or steep mountains?" }),

            new Paragraph({ text: "2. Text Structure (2/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: A clear narrative with an orientation, multiple complications (marks, noises, sightings), and a dark resolution.", }),
            new Paragraph({ text: "Evidence: \"Blood drained out of it but it was still alive, and it ran at the dad...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Spend more time on the 'strange sound' part. What did it sound like? Was it a low growl or a high-pitched scream?" }),

            new Paragraph({ text: "3. Ideas (2/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: The core idea of a 'creature feature' in a national park is a classic horror concept that is well-executed.", }),
            new Paragraph({ text: "Evidence: \"He described it as eight feet tall human like a very fury with sha piercing ears and yellow Soules eyes.\"", italics: true }),
            new Paragraph({ text: "Recommendations: What kind of monster was it? Was it an old legend from the park, or something completely new?" }),

            new Paragraph({ text: "4. Character and Setting (2/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: The characters are defined by their reactions to the creature. The national park setting is established as a place of isolation and danger." }),
            new Paragraph({ text: "Evidence: \"...one of the biggest national parks, ever.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Describe the RV! Was it a big white one or a small rusty camper?" }),

            new Paragraph({ text: "5. Vocabulary (2/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Uses some appropriate adjectives like 'massive', 'strange', and 'menacingly' and descriptive verbs like 'barged' and 'sprinting'." }),
            new Paragraph({ text: "Evidence: \"...standing menacingly so the shot it POW!\"", italics: true }),
            new Paragraph({ text: "Recommendations: Look for alternatives to the word 'nice' to describe the day (e.g., 'radiant', 'gleaming')." }),

            new Paragraph({ text: "6. Cohesion (2/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Simple temporal markers help the reader navigate the sequence of days and nights during the trip." }),
            new Paragraph({ text: "Evidence: \"The next day they went outside and saw massive claw marks...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Use words like 'Eventually' or 'Consequently' to bridge your paragraphs more effectively." }),

            new Paragraph({ text: "7. Paragraphing (2/2 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Excellent and consistent use of paragraphs to organize the narrative into logical sections of action." }),
            new Paragraph({ text: "Recommendations: Excellent paragraphing control. Keep using this to guide your reader." }),

            new Paragraph({ text: "8. Sentence Structure (2/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Mostly simple or compound sentences; there are some issues with sentence boundaries and repetitive subject use." }),
            new Paragraph({ text: "Evidence: \"Everything was nice and there were all having a nice time until...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Practice joining two related thoughts with words like 'because' or 'therefore' to make your sentences even stronger." }),

            new Paragraph({ text: "9. Punctuation (1/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Minimal punctuation control, with many sentences lacking end markers and internal pauses (commas)." }),
            new Paragraph({ text: "Evidence: \"One nice sunny day a family of three decided to go camping...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Every sentence should start with a capital letter and end with a full stop!" }),

            new Paragraph({ text: "10. Spelling (2/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Consistent errors in common and technical words, particularly those related to the genre." }),
            new Paragraph({ text: "Evidence: 'ranges' for 'rangers', 'probbly' for 'probably', 'Soules' for 'soulless', 'fury' for 'furry'.", italics: true }),
            new Paragraph({ text: "Recommendations: Practice spelling words with double letters and silent letters. It's a tricky part of English!" }),

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
    fs.writeFileSync("c:\\Users\\dsuth\\Documents\\Joshua\\Scrap\\Submitted files\\WELCH, Riva (rwelc16)\\NAPLAN Assessment - Riva Welch.docx", buffer);
});
