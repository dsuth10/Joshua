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
            new Paragraph({ children: [new TextRun({ text: "Student Name: ", bold: true }), new TextRun("Charlotte Fuller")] }),
            new Paragraph({ children: [new TextRun({ text: "Date: ", bold: true }), new TextRun("2026-01-28")] }),
            new Paragraph({ children: [new TextRun({ text: "Total Score: ", bold: true }), new TextRun("27/47")] }),

            new Paragraph({ text: "Executive Summary", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: "Overall Strengths", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "• Excellent use of sensory language to build a vivid and enchanting atmosphere.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Strong cohesion through the use of time and sequence markers.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Effective use of onomatopoeia to heighten moments of action and surprise.", numbering: { reference: "bullet-points", level: 0 } }),

            new Paragraph({ text: "Areas for Development", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "• Spelling of common and high-frequency words (e.g., 'dense', 'able', 'float').", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Narrative completion—the body of the story currently ends before the resolution occurs.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Sentence-level accuracy—ensuring words like 'through' (instead of 'throw') are used correctly.", numbering: { reference: "bullet-points", level: 0 } }),

            new Paragraph({ text: "Detailed Assessment by Criterion", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: "1. Audience (3/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Successfully orients the reader with a beautiful description of spring and engages through a sense of magic." }),
            new Paragraph({ text: "Evidence: \"...the golden flowers bloomed and crisp leave fell on freshly cut grass.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Keep using those wonderful descriptive sentences to show the reader the new world the girls find themselves in." }),

            new Paragraph({ text: "2. Text Structure (2/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: The narrative has a strong orientation and an exciting complication but lacks a resolution in the body text." }),
            new Paragraph({ text: "Evidence: \"Ahhh they were sucked into a mini portal...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Make sure to leave enough time to write the 'ending' where the girls get home or win their award." }),

            new Paragraph({ text: "3. Ideas (3/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: The portal and fairy ideas are classic fantasy elements that are well-integrated into the sleepover setting." }),
            new Paragraph({ text: "Evidence: \"...misty dence forest soon mmhhh the sound was back but louder...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Try to add a unique twist to the fairy. What makes this fairy different from the ones in other books?" }),

            new Paragraph({ text: "4. Character and Setting (3/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Both the cottage neighborhood and the misty forest are described with great detail." }),
            new Paragraph({ text: "Evidence: \"...little cozy cottages spread around the coast...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Describe the girls' reactions more. How did their faces look when they saw the hidden portal?" }),

            new Paragraph({ text: "5. Vocabulary (3/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Uses some sophisticated and precise words like 'enchanting' and 'bellowed'." }),
            new Paragraph({ text: "Evidence: \"On an enchanting, day Olivia and Rylee...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Watch out for words that sound the same but are spelled differently, like 'through' and 'throw'." }),

            new Paragraph({ text: "6. Cohesion (3/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Good use of cohesive devices to link events over time and space." }),
            new Paragraph({ text: "Evidence: \"shortly after her arrival, they had already started...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Try to use some more complex linking words like 'Meanwhile' or 'Consequently' to show how the characters are feeling." }),

            new Paragraph({ text: "7. Paragraphing (2/2 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Paragraphs are used effectively to signal changes in focus and to organize dialogue." }),
            new Paragraph({ text: "Recommendations: Excellent paragraphing control. Keep using this to guide your reader." }),

            new Paragraph({ text: "8. Sentence Structure (3/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: A variety of sentence types are used, though there are some errors in complex constructions." }),
            new Paragraph({ text: "Evidence: \"...as we stepped forwards it was light as a feather...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Read your long sentences out loud to make sure they haven't become 'tangled' in the middle." }),

            new Paragraph({ text: "9. Punctuation (3/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Punctuation is used to create effect, though some basic sentence-level punctuation is missing." }),
            new Paragraph({ text: "Evidence: \"...bam! Olivia shot into the room\"", italics: true }),
            new Paragraph({ text: "Recommendations: Check that every sentence ends with a clear punctuation mark like a full stop or exclamation mark." }),

            new Paragraph({ text: "10. Spelling (2/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Many common and high-frequency words are misspelled." }),
            new Paragraph({ text: "Evidence: 'dence' for 'dense', 'eble' for 'able', 'flout' for 'float'.", italics: true }),
            new Paragraph({ text: "Recommendations: Focus on double-checking words with 'silent' letters or unusual vowel patterns." }),

            new Paragraph({ text: "Score Summary", heading: HeadingLevel.HEADING_1 }),
            new Table({
                columnWidths: [4680, 2340, 2340],
                rows: [
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Criterion", bold: true })], shading: { fill: "D5E8F0", type: ShadingType.CLEAR } }), new TableCell({ children: [new Paragraph({ text: "Score", bold: true })], shading: { fill: "D5E8F0", type: ShadingType.CLEAR } }), new TableCell({ children: [new Paragraph({ text: "Max", bold: true })], shading: { fill: "D5E8F0", type: ShadingType.CLEAR } })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Audience" })] }), new TableCell({ children: [new Paragraph({ text: "3" })] }), new TableCell({ children: [new Paragraph({ text: "6" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Text Structure" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] }), new TableCell({ children: [new Paragraph({ text: "4" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Ideas" })] }), new TableCell({ children: [new Paragraph({ text: "3" })] }), new TableCell({ children: [new Paragraph({ text: "5" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Character and Setting" })] }), new TableCell({ children: [new Paragraph({ text: "3" })] }), new TableCell({ children: [new Paragraph({ text: "4" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Vocabulary" })] }), new TableCell({ children: [new Paragraph({ text: "3" })] }), new TableCell({ children: [new Paragraph({ text: "5" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Cohesion" })] }), new TableCell({ children: [new Paragraph({ text: "3" })] }), new TableCell({ children: [new Paragraph({ text: "4" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Paragraphing" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Sentence Structure" })] }), new TableCell({ children: [new Paragraph({ text: "3" })] }), new TableCell({ children: [new Paragraph({ text: "6" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Punctuation" })] }), new TableCell({ children: [new Paragraph({ text: "3" })] }), new TableCell({ children: [new Paragraph({ text: "5" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Spelling" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] }), new TableCell({ children: [new Paragraph({ text: "6" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "TOTAL", bold: true })] }), new TableCell({ children: [new Paragraph({ text: "27", bold: true })] }), new TableCell({ children: [new Paragraph({ text: "47", bold: true })] })] }),
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
    fs.writeFileSync("c:\\Users\\dsuth\\Documents\\Joshua\\Scrap\\Submitted files\\FULLER, Charlotte (cfull118)\\NAPLAN Assessment - Charlotte Fuller.docx", buffer);
});
