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
            new Paragraph({ children: [new TextRun({ text: "Student Name: ", bold: true }), new TextRun("Imogen McKechnie")] }),
            new Paragraph({ children: [new TextRun({ text: "Date: ", bold: true }), new TextRun("2026-01-28")] }),
            new Paragraph({ children: [new TextRun({ text: "Total Score: ", bold: true }), new TextRun("21/47")] }),

            new Paragraph({ text: "Executive Summary", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: "Overall Strengths", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "• Excellent use of dialogue to show the girl's feelings and the 'bossy' nature of her parents.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Clear connection between the character's desires and the wishes granted by the genie.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Effective use of lists ('no more disgusting food', 'no more teasing') to build sympathy for the character.", numbering: { reference: "bullet-points", level: 0 } }),

            new Paragraph({ text: "Areas for Development", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "• Spelling of high-frequency words (e.g., 'piece' instead of 'peace', 'there' instead of 'their').", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Narrative pacing—spend more time describing the rescue from the lake so the reader can share the character's relief.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Punctuation accuracy—ensure every sentence ends with a full stop, even when a character is speaking.", numbering: { reference: "bullet-points", level: 0 } }),

            new Paragraph({ text: "Detailed Assessment by Criterion", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: "1. Audience (2/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Successfully orients the reader to a character who is unhappy and looking for a change." }),
            new Paragraph({ text: "Evidence: \"She hated every day of her life she wanted a change.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Keep using those strong feelings! Try to describe how the girl's face looked when she was sad vs. when she was happy." }),

            new Paragraph({ text: "2. Text Structure (2/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: The narrative has all the required components but moves through them very quickly, especially the transition from the lake to home.", }),
            new Paragraph({ text: "Evidence: \"When she found a long peace of rope someone had rescued her she was safe...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Use a few more sentences to describe the person who rescued her. Was it a mystery person or a friend?" }),

            new Paragraph({ text: "3. Ideas (2/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: The idea of 'three wishes' to escape a difficult life is a classic and effective choice for a short story." }),
            new Paragraph({ text: "Evidence: \"...no more bossy parents, no more going to bed at 6:00...\"", italics: true }),
            new Paragraph({ text: "Recommendations: What did the jungle look like? Was it full of tall trees or fruit that tasted like Nutella?" }),

            new Paragraph({ text: "4. Character and Setting (2/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Both the girl's home and the jungle setting are used to contrast her unhappiness with her new found joy." }),
            new Paragraph({ text: "Evidence: \"...make freinds with all the jungle animals...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Describe the blue person (the genie) more. Was he glowing or did he wear a special hat?" }),

            new Paragraph({ text: "5. Vocabulary (3/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Uses some precise and evocative adjectives like 'dusty', 'disgusting', and 'bossy'." }),
            new Paragraph({ text: "Evidence: \"...no more disgusting food for dinner...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Use stronger verbs for the 'roar'—did it 'shake the trees' or 'echo through the forest'?" }),

            new Paragraph({ text: "6. Cohesion (2/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Temporal markers help keep the stream of events in a logical order for the reader." }),
            new Paragraph({ text: "Evidence: \"Back at home none of her family cared...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Use longer connecting words like 'Eventually' or 'Consequently' to make your transitions more sophisticated." }),

            new Paragraph({ text: "7. Paragraphing (2/2 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Appropriate and consistent use of paragraphs to organize the different stages of the girl's journey." }),
            new Paragraph({ text: "Recommendations: Excellent paragraphing control. Keep using this to guide your reader." }),

            new Paragraph({ text: "8. Sentence Structure (2/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Most sentences are simple or compound; there are some issues with sentence boundaries." }),
            new Paragraph({ text: "Evidence: \"She took it with her to the deep cold lake suddenly the water rised...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Practice using words like 'while' or 'because' to connect your ideas into longer, more complex sentences." }),

            new Paragraph({ text: "9. Punctuation (2/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Quotation marks and exclamation marks are used with some variety, though capitalisation is sometimes missing." }),
            new Paragraph({ text: "Evidence: \"GET TO BED NOW''! And angrily.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Ensure that every sentence starts with a capital letter and ends with a full stop, even if it has an exclamation mark too!" }),

            new Paragraph({ text: "10. Spelling (2/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Errors are present in high-frequency words and common homophones." }),
            new Paragraph({ text: "Evidence: 'their' for 'there', 'peace' for 'piece', 'freinds' for 'friends'.", italics: true }),
            new Paragraph({ text: "Recommendations: Practice words that sound the same but are spelled differently. It makes a big difference to your reader's understanding!" }),

            new Paragraph({ text: "Score Summary", heading: HeadingLevel.HEADING_1 }),
            new Table({
                columnWidths: [4680, 2340, 2340],
                rows: [
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Criterion", bold: true })], shading: { fill: "D5E8F0", type: ShadingType.CLEAR } }), new TableCell({ children: [new Paragraph({ text: "Score", bold: true })], shading: { fill: "D5E8F0", type: ShadingType.CLEAR } }), new TableCell({ children: [new Paragraph({ text: "Max", bold: true })], shading: { fill: "D5E8F0", type: ShadingType.CLEAR } })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Audience" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] }), new TableCell({ children: [new Paragraph({ text: "6" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Text Structure" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] }), new TableCell({ children: [new Paragraph({ text: "4" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Ideas" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] }), new TableCell({ children: [new Paragraph({ text: "5" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Character and Setting" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] }), new TableCell({ children: [new Paragraph({ text: "4" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Vocabulary" })] }), new TableCell({ children: [new Paragraph({ text: "3" })] }), new TableCell({ children: [new Paragraph({ text: "5" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Cohesion" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] }), new TableCell({ children: [new Paragraph({ text: "4" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Paragraphing" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Sentence Structure" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] }), new TableCell({ children: [new Paragraph({ text: "6" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Punctuation" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] }), new TableCell({ children: [new Paragraph({ text: "5" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Spelling" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] }), new TableCell({ children: [new Paragraph({ text: "6" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "TOTAL", bold: true })] }), new TableCell({ children: [new Paragraph({ text: "21", bold: true })] }), new TableCell({ children: [new Paragraph({ text: "47", bold: true })] })] }),
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
    fs.writeFileSync("c:\\Users\\dsuth\\Documents\\Joshua\\Scrap\\Submitted files\\MCKECHNIE, Imogen (imcke57)\\NAPLAN Assessment - Imogen McKechnie.docx", buffer);
});
