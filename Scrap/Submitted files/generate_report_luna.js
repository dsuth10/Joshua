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
            new Paragraph({ children: [new TextRun({ text: "Student Name: ", bold: true }), new TextRun("Luna-Alice O'Reilly")] }),
            new Paragraph({ children: [new TextRun({ text: "Date: ", bold: true }), new TextRun("2026-01-28")] }),
            new Paragraph({ children: [new TextRun({ text: "Total Score: ", bold: true }), new TextRun("18/47")] }),

            new Paragraph({ text: "Executive Summary", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: "Overall Strengths", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "• Engaging plot involving a 'Geaney' (genie) with clear dialogue between characters.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Inclusion of specific character names (Lucy, Immy, Sophea) helps ground the story.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Good narrative flow from the initial trip/fall to the discovery of the magical item.", numbering: { reference: "bullet-points", level: 0 } }),

            new Paragraph({ text: "Areas for Development", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "• Spelling of common and technical words (e.g., 'geaney' for 'genie', 'cores' for 'course', 'stares' for 'stairs').", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Sentence structure and punctuation—ensure sentences start with capital letters and end with clear punctuation.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Vocabulary expansion—experiment with different synonyms for 'said' and 'yelled'.", numbering: { reference: "bullet-points", level: 0 } }),

            new Paragraph({ text: "Detailed Assessment by Criterion", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: "1. Audience (2/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Successfully orients the reader to Lucy and her friends' plans to visit Sophea." }),
            new Paragraph({ text: "Evidence: \"they where planning to go down the street to see Sophea's home then.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Try to describe how Lucy felt when she tripped. Was she scared, or just surprised?" }),

            new Paragraph({ text: "2. Text Structure (2/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: The story has an orientation, complication (tripping/finding the object), and a fun resolution.", }),
            new Paragraph({ text: "Evidence: \"Lucy ran to the shiny thing she picked it up. Lucy did not know what was it she thought it was a teapot.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Spend more time on the 'genie coming out' part. What did the genie look like? Did he have blue smoke?" }),

            new Paragraph({ text: "3. Ideas (2/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: The 'genie' idea is a classic fantasy element that is well-integrated into the girls' outing." }),
            new Paragraph({ text: "Evidence: \"A Geaney came out Lucy thought she was dreaming...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Give the genie a specific name and a funny reason for being lost!" }),

            new Paragraph({ text: "4. Character and Setting (1/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Characters are named, but the settings (Sophea's home, the street) lack descriptive detail." }),
            new Paragraph({ text: "Evidence: \"...played at her plase\"", italics: true }),
            new Paragraph({ text: "Recommendations: Describe Sophea's home. Was it big, or did it have a colorful door?" }),

            new Paragraph({ text: "5. Vocabulary (2/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Uses some appropriate adjectives and verbs to describe action ('shouted', 'planning')." }),
            new Paragraph({ text: "Evidence: \"...planning to go down the street...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Look for more descriptive words for the 'shiny thing'. Was it 'glimmering' or 'sparkling'?" }),

            new Paragraph({ text: "6. Cohesion (2/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Simple links ('One Minet later', 'Then', 'So') help the reader follow the sequence of events." }),
            new Paragraph({ text: "Evidence: \"One Minet later Lucy tripped over...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Try using more complex linking words like 'Meanwhile' or 'Consequently'." }),

            new Paragraph({ text: "7. Paragraphing (1/2 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Some intention to break the text into sections and organize dialogue." }),
            new Paragraph({ text: "Recommendations: Start a new paragraph every time someone new starts talking!" }),

            new Paragraph({ text: "8. Sentence Structure (2/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Most sentences are simple or compound; some are quite long without clear breaks." }),
            new Paragraph({ text: "Evidence: \"Lucy had one leg she and her friends where going out side of her house...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Practice using full stops to finish one thought before starting the next one." }),

            new Paragraph({ text: "9. Punctuation (2/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Basic implementation of punctuation, with some creative use of capital letters for emphasis." }),
            new Paragraph({ text: "Evidence: \"GET TO BED NOW''!\"", italics: true }),
            new Paragraph({ text: "Recommendations: Ensure all dialogue is enclosed in quotation marks, and check those capital letters at the start of sentences." }),

            new Paragraph({ text: "10. Spelling (2/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Consistently misspells common and technical words." }),
            new Paragraph({ text: "Evidence: 'Geaney' for 'Genie', 'cores' for 'course', 'stares' for 'stairs', 'fart' for 'fast'.", italics: true }),
            new Paragraph({ text: "Recommendations: Double-check words that sound like others but are spelled differently (homophones)." }),

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
    fs.writeFileSync("c:\\Users\\dsuth\\Documents\\Joshua\\Scrap\\Submitted files\\O'REILLY, Luna-Alice (lorei25)\\NAPLAN Assessment - Luna-Alice O'Reilly.docx", buffer);
});
