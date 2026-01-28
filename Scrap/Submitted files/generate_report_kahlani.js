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
            new Paragraph({ children: [new TextRun({ text: "Student Name: ", bold: true }), new TextRun("Kahlani Tanuvasa")] }),
            new Paragraph({ children: [new TextRun({ text: "Date: ", bold: true }), new TextRun("2026-01-28")] }),
            new Paragraph({ children: [new TextRun({ text: "Total Score: ", bold: true }), new TextRun("12/47")] }),

            new Paragraph({ text: "Executive Summary", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: "Overall Strengths", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "• Excellent and evocative opening sentence that immediately creates Atmosphere.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Good use of character-driven detail ('Emma grasped her mum's hand') to show emotion.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Strong metaphorical language ('bag filled with bravery and curiosity') to describe Emma's state of mind.", numbering: { reference: "bullet-points", level: 0 } }),

            new Paragraph({ text: "Areas for Development", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "• Narrative completion—ensure the story has a clear complication and a resolution for the reader.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Sentence boundaries—using full stops to separate independent thoughts and avoid long, connected sentences.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Elaborating on the mystery—what exactly did Emma see or find in the shed?", numbering: { reference: "bullet-points", level: 0 } }),

            new Paragraph({ text: "Detailed Assessment by Criterion", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: "1. Audience (2/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Successfully orients the reader to Emma's first day at camp with engaging and sensory language." }),
            new Paragraph({ text: "Evidence: \"...the air filled with excitement as the beaming kids ran on the bus.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Keep using those descriptive words for feelings! They really help to draw the reader into Emma's thoughts." }),

            new Paragraph({ text: "2. Text Structure (1/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Includes a very strong orientation but ends abruptly just as the complication is introduced.", }),
            new Paragraph({ text: "Evidence: \"Emma ran down the big hill down to the shed and locked herself in.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Think about what could happen next! Does Emma find a secret map or a hidden door in the shed?" }),

            new Paragraph({ text: "3. Ideas (2/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: The idea of a summer camp mystery is a great hook that provides plenty of room for creative development." }),
            new Paragraph({ text: "Evidence: \"'CREEK.' 'CREEK' CREEK.'\"", italics: true }),
            new Paragraph({ text: "Recommendations: What was making the 'creek' sound? Was it an old floorboard or a mystery creature?" }),

            new Paragraph({ text: "4. Character and Setting (2/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: The character of Emma and the setting of the summer camp are both introduced with effective and imaginative detail." }),
            new Paragraph({ text: "Evidence: \"Emma grasped her mum's hand as soon as they arrived at camp...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Describe the shed! Was it dark and dusty or bright and full of old toys?" }),

            new Paragraph({ text: "5. Vocabulary (2/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Uses some very effective and precise vocabulary to describe excitement and curiosity." }),
            new Paragraph({ text: "Evidence: \"...beaming kids... filled with bravery and curiosity...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Look for alternatives to the word 'ran' to show how Emma was moving down the hill (e.g., 'tumbled', 'sprinted')." }),

            new Paragraph({ text: "6. Cohesion (1/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Basic temporal markers like 'Once' and 'And then' are used to signal the sequence of events." }),
            new Paragraph({ text: "Evidence: \"Once had TUG A WAR had begun Emma ran...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Use words like 'Eventually' or 'Unexpectedly' to bridge your sentences more effectively." }),

            new Paragraph({ text: "7. Paragraphing (1/2 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: There is one paragraph break, but the text is too short to show consistent organization of action." }),
            new Paragraph({ text: "Recommendations: Start a new paragraph every time the location changes or a new event starts." }),

            new Paragraph({ text: "8. Sentence Structure (1/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Most sentences are simple or compound; some are quite long and lack clear boundaries." }),
            new Paragraph({ text: "Evidence: \"...as Emma's bag filled with bravery and curiosity, wondering what she would do...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Practice using short sentences for big emotional impact. For example: 'Emma was ready.'" }),

            new Paragraph({ text: "9. Punctuation (1/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Correct implementation of basic punctuation, but some sentences run together without clear separation." }),
            new Paragraph({ text: "Evidence: \"...the air filled with excitement as the beaming kids ran on the bus.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Ensure every sentence ends with a full stop to help your reader understand where one thought ends and the next begins." }),

            new Paragraph({ text: "10. Spelling (1/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Common words are spelled correctly, but the brevity of the text limits the evidence of full proficiency." }),
            new Paragraph({ text: "Evidence: 'excitement', 'curiosity', 'adventure'.", italics: true }),
            new Paragraph({ text: "Recommendations: Keep up the great work with these big words! Practice spelling more technical words like 'onomatopoeia'." }),

            new Paragraph({ text: "Score Summary", heading: HeadingLevel.HEADING_1 }),
            new Table({
                columnWidths: [4680, 2340, 2340],
                rows: [
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Criterion", bold: true })], shading: { fill: "D5E8F0", type: ShadingType.CLEAR } }), new TableCell({ children: [new Paragraph({ text: "Score", bold: true })], shading: { fill: "D5E8F0", type: ShadingType.CLEAR } }), new TableCell({ children: [new Paragraph({ text: "Max", bold: true })], shading: { fill: "D5E8F0", type: ShadingType.CLEAR } })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Audience" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] }), new TableCell({ children: [new Paragraph({ text: "6" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Text Structure" })] }), new TableCell({ children: [new Paragraph({ text: "1" })] }), new TableCell({ children: [new Paragraph({ text: "4" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Ideas" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] }), new TableCell({ children: [new Paragraph({ text: "5" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Character and Setting" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] }), new TableCell({ children: [new Paragraph({ text: "4" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Vocabulary" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] }), new TableCell({ children: [new Paragraph({ text: "5" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Cohesion" })] }), new TableCell({ children: [new Paragraph({ text: "1" })] }), new TableCell({ children: [new Paragraph({ text: "4" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Paragraphing" })] }), new TableCell({ children: [new Paragraph({ text: "1" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Sentence Structure" })] }), new TableCell({ children: [new Paragraph({ text: "1" })] }), new TableCell({ children: [new Paragraph({ text: "6" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Punctuation" })] }), new TableCell({ children: [new Paragraph({ text: "1" })] }), new TableCell({ children: [new Paragraph({ text: "5" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Spelling" })] }), new TableCell({ children: [new Paragraph({ text: "1" })] }), new TableCell({ children: [new Paragraph({ text: "6" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "TOTAL", bold: true })] }), new TableCell({ children: [new Paragraph({ text: "12", bold: true })] }), new TableCell({ children: [new Paragraph({ text: "47", bold: true })] })] }),
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
    fs.writeFileSync("c:\\Users\\dsuth\\Documents\\Joshua\\Scrap\\Submitted files\\TANUVASA, Kahlani (ktanu6)\\NAPLAN Assessment - Kahlani Tanuvasa.docx", buffer);
});
