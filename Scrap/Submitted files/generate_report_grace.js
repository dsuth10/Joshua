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
            new Paragraph({ children: [new TextRun({ text: "Student Name: ", bold: true }), new TextRun("Grace John")] }),
            new Paragraph({ children: [new TextRun({ text: "Date: ", bold: true }), new TextRun("2026-01-28")] }),
            new Paragraph({ children: [new TextRun({ text: "Total Score: ", bold: true }), new TextRun("22/47")] }),

            new Paragraph({ text: "Executive Summary", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: "Overall Strengths", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "• Excellent and engaging narrator's voice with a strong sense of personality.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Effective use of specialized horse-related vocabulary ('tack up', 'warm up', 'paddock').", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Creative use of internal monologue to show character feelings and build tension.", numbering: { reference: "bullet-points", level: 0 } }),

            new Paragraph({ text: "Areas for Development", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "• Spelling of high-frequency words (e.g., 'coach' instead of 'couch', 'fault' instead of 'folt').", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Narrative structure—ensuring the ending relates to the problems introduced at the start of the story.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Sentence control—practicing the use of full stops to break up long streams of thought.", numbering: { reference: "bullet-points", level: 0 } }),

            new Paragraph({ text: "Detailed Assessment by Criterion", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: "1. Audience (3/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: The writer successfully engages the reader through a very direct and emotive internal monologue." }),
            new Paragraph({ text: "Evidence: \"OMG grace u are overacting so so much just go and get the horse.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Keep using that wonderful 'voice'! Try to describe what Grace sees as well as what she thinks." }),

            new Paragraph({ text: "2. Text Structure (2/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: The orientation and complication are well-established, but the magical ending feels disconnected from the earlier realism." }),
            new Paragraph({ text: "Evidence: \"...at that second the mad horse started flying...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Try to drop 'clues' about the magic earlier in the story so the flying horse doesn't come as such a shock!" }),

            new Paragraph({ text: "3. Ideas (2/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: The idea of anxiety about a lesson and a 'mean' horse is very relatable and clear." }),
            new Paragraph({ text: "Evidence: \"Moonlight is very mean to other horses, but my horse is a different story...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Show us one thing Moonlight did that was mean. Did he steal Andy's hay or bite him?" }),

            new Paragraph({ text: "4. Character and Setting (2/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Grace's character is very well-defined through her thoughts. The setting of the paddock is functional." }),
            new Paragraph({ text: "Evidence: \"Ok ready 3 2 1 ok i am going steady boy...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Describe the paddock. Was it muddy, or was the sun shining on the horses' coats?" }),

            new Paragraph({ text: "5. Vocabulary (3/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Uses good technical vocabulary that shows a real knowledge of horse riding." }),
            new Paragraph({ text: "Evidence: \"...five minutes to tack up and be warmed up...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Use some stronger verbs for how Grace moves, like 'scurried' or 'rushed' instead of 'go'." }),

            new Paragraph({ text: "6. Cohesion (2/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: The story flows well as a stream of consciousness, with markers like 'Wait no' and 'Now we are done'." }),
            new Paragraph({ text: "Evidence: \"...wait no this is my Folt i didn't go into the paddock when i needed to...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Use more formal linking words like 'Meanwhile' to connect different characters' actions." }),

            new Paragraph({ text: "7. Paragraphing (2/2 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Effective use of paragraphs to organize the internal debate, the dialogue, and the lesson itself." }),
            new Paragraph({ text: "Recommendations: Great work. Keep using paragraphs to signal shifts in focus." }),

            new Paragraph({ text: "8. Sentence Structure (2/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Sentence structure is often sacrificed for the high-energy 'talky' style." }),
            new Paragraph({ text: "Evidence: \"...ok i am going steady boy i just need to get Andy ok pls don't hurt me...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Even in a stream of consciousness, full stops help the reader 'breathe' between thoughts." }),

            new Paragraph({ text: "9. Punctuation (2/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Punctuation is used creatively for emphasis (all caps), but formal control is lacking." }),
            new Paragraph({ text: "Evidence: \"NOOOOOOOOOOO my horse is in the same paddock...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Practice using quotation marks for every person who speaks, including Amy the coach." }),

            new Paragraph({ text: "10. Spelling (2/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Several common high-frequency words are consistently misspelled." }),
            new Paragraph({ text: "Evidence: 'couch' for 'coach', 'Folt' for 'fault', 'onley' for 'only'.", italics: true }),
            new Paragraph({ text: "Recommendations: Some words sound the same but have different meanings. Practice 'coach' and 'fault' specifically." }),

            new Paragraph({ text: "Score Summary", heading: HeadingLevel.HEADING_1 }),
            new Table({
                columnWidths: [4680, 2340, 2340],
                rows: [
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Criterion", bold: true })], shading: { fill: "D5E8F0", type: ShadingType.CLEAR } }), new TableCell({ children: [new Paragraph({ text: "Score", bold: true })], shading: { fill: "D5E8F0", type: ShadingType.CLEAR } }), new TableCell({ children: [new Paragraph({ text: "Max", bold: true })], shading: { fill: "D5E8F0", type: ShadingType.CLEAR } })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Audience" })] }), new TableCell({ children: [new Paragraph({ text: "3" })] }), new TableCell({ children: [new Paragraph({ text: "6" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Text Structure" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] }), new TableCell({ children: [new Paragraph({ text: "4" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Ideas" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] }), new TableCell({ children: [new Paragraph({ text: "5" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Character and Setting" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] }), new TableCell({ children: [new Paragraph({ text: "4" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Vocabulary" })] }), new TableCell({ children: [new Paragraph({ text: "3" })] }), new TableCell({ children: [new Paragraph({ text: "5" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Cohesion" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] }), new TableCell({ children: [new Paragraph({ text: "4" })] })] }),
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
    fs.writeFileSync("c:\\Users\\dsuth\\Documents\\Joshua\\Scrap\\Submitted files\\JOHN, Grace (gjohn206)\\NAPLAN Assessment - Grace John.docx", buffer);
});
