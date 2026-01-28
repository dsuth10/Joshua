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
            new Paragraph({ children: [new TextRun({ text: "Student Name: ", bold: true }), new TextRun("Harvey Telford")] }),
            new Paragraph({ children: [new TextRun({ text: "Date: ", bold: true }), new TextRun("2026-01-28")] }),
            new Paragraph({ children: [new TextRun({ text: "Total Score: ", bold: true }), new TextRun("22/47")] }),

            new Paragraph({ text: "Executive Summary", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: "Overall Strengths", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "• Engaging and imaginative perspective from an orca character.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Excellent use of dialogue to show the reaction of other fish to Jimmy.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Clear narrative structure with a well-defined complication and a clever resolution.", numbering: { reference: "bullet-points", level: 0 } }),

            new Paragraph({ text: "Areas for Development", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "• Punctuation accuracy—using commas to separate ideas and clarify meaning in complex sentences.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Vocabulary expansion—experiment with different synonyms for 'said' and 'went'.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Descriptive detail—describing the 'fish' or the 'ghost net' with more sensory words to build the under-sea Atmosphere.", numbering: { reference: "bullet-points", level: 0 } }),

            new Paragraph({ text: "Detailed Assessment by Criterion", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: "1. Audience (3/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Successfully engages the reader through the unique point of view of an orca and humorous character reactions." }),
            new Paragraph({ text: "Evidence: \"...the fish ran away, screaming 'IT'S GONNA EAT US!' and pointed at him.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Keep using that humor! Try to describe how Jimmy felt when the fish were scared of him." }),

            new Paragraph({ text: "2. Text Structure (3/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: A controlled narrative with a clear orientation, a significant complication (the ghost net), and a satisfying resolution.", }),
            new Paragraph({ text: "Evidence: \"Jimmy grabbed the hook and cut the rope. He rushed to the surface and was greeted by the embrace of fresh air.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Describe the 'ghost net' more. Was it green and tangled or full of sand and shells?" }),

            new Paragraph({ text: "3. Ideas (3/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: The core idea of an orca rescue using a discarded fishing hook is original and well-developed.", }),
            new Paragraph({ text: "Evidence: \"...he also told them how he would be dead right now if it wasn't for a fishing hook.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Where did the fishing hook come from? Was it stuck in a rock or floating near the surface?" }),

            new Paragraph({ text: "4. Character and Setting (2/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Jimmy the orca is a well-defined character. The setting of the Gold Coast shoreline is used effectively." }),
            new Paragraph({ text: "Evidence: \"One day at the gold coast, Jimmy the orca went further away...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Describe Jimmy's pod! Were there many other orcas, or just a few?" }),

            new Paragraph({ text: "5. Vocabulary (2/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Uses some appropriate adjectives like 'weird' and 'impossible' and descriptive verbs like 'squirmed' and 'strangled'." }),
            new Paragraph({ text: "Evidence: \"...strangled Jimmy in an impossible knot.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Look for more precise words for 'fish' (e.g., 'tropical fish', 'scurrying schools')." }),

            new Paragraph({ text: "6. Cohesion (3/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Time markers and cause-and-effect links sustain the narrative's flow across different scenes effectively." }),
            new Paragraph({ text: "Evidence: \"Jimmy then saw something in the water. It was a fishing hook!\"", italics: true }),
            new Paragraph({ text: "Recommendations: Use words like 'Unexpectedly' or 'Consequently' to bridge your paragraphs." }),

            new Paragraph({ text: "7. Paragraphing (2/2 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Excellent and consistent use of paragraphs to organize the narrative stages." }),
            new Paragraph({ text: "Recommendations: Excellent paragraphing control. Keep using this to guide your reader." }),

            new Paragraph({ text: "8. Sentence Structure (2/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Mostly simple or compound sentences; there are some issues with sentence boundaries and repetitive subject use." }),
            new Paragraph({ text: "Evidence: \"Jimmy finds a fishing hook and Jimmy cuts himself free.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Practice using pronouns like 'he' and 'it' to avoid repeating 'Jimmy' too often in the same sentence." }),

            new Paragraph({ text: "9. Punctuation (2/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Basic implementation of punctuation, with some effective use of quotation marks for dialogue." }),
            new Paragraph({ text: "Evidence: \"pointing at him, screaming 'IT'S GONNA EAT US!'\"", italics: true }),
            new Paragraph({ text: "Recommendations: Remember that names of places (like Gold Coast) always start with capital letters!" }),

            new Paragraph({ text: "10. Spelling (2/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Consistent errors in high-frequency words and some technical terms." }),
            new Paragraph({ text: "Evidence: 'gold coast' for 'Gold Coast', 'breath' for 'breathe', 'plase' for 'place'.", italics: true }),
            new Paragraph({ text: "Recommendations: Practice spelling words with silent 'e' at the end, like 'breathe'." }),

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
    fs.writeFileSync("c:\\Users\\dsuth\\Documents\\Joshua\\Scrap\\Submitted files\\TELFORD, Harvey (htelf10)\\NAPLAN Assessment - Harvey Telford.docx", buffer);
});
