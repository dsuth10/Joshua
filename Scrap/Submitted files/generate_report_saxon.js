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
            new Paragraph({ children: [new TextRun({ text: "Student Name: ", bold: true }), new TextRun("Saxon Chandler")] }),
            new Paragraph({ children: [new TextRun({ text: "Date: ", bold: true }), new TextRun("2026-01-28")] }),
            new Paragraph({ children: [new TextRun({ text: "Total Score: ", bold: true }), new TextRun("15/47")] }),

            new Paragraph({ text: "Executive Summary", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: "Overall Strengths", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "• Relatable and clear character motivation (a boy who loves dinosaurs).", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Inclusion of a clear complication and a satisfying resolution.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Use of sensory details ('the trees rustled') and onomatopoeia ('arrrf').", numbering: { reference: "bullet-points", level: 0 } }),

            new Paragraph({ text: "Areas for Development", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "• Sentence structure—focus on breaking long run-on sentences into shorter, clearer ones.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Punctuation accuracy—using full stops and capital letters to show where one thought ends and another begins.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Spelling of common words like 'said', 'real', and 'doesn't'.", numbering: { reference: "bullet-points", level: 0 } }),

            new Paragraph({ text: "Detailed Assessment by Criterion", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: "1. Audience (2/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Successfully orients the reader by introducing Fred and his love for dinosaurs." }),
            new Paragraph({ text: "Evidence: \"Fred is a kind boy who loves dinosaurs...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Try to show why Fred wants a real dinosaur. Is he lonely? Or does he just want a big pet?" }),

            new Paragraph({ text: "2. Text Structure (2/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: The story has all the parts of a narrative, but they happen very quickly." }),
            new Paragraph({ text: "Evidence: \"...then something pued him up he opened his eyes and saw a dinosaur...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Slow down the middle of your story. Describe the scary feeling of being in the creek for longer." }),

            new Paragraph({ text: "3. Ideas (2/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: The idea of finding a friend in a forest is a classic and effective narrative choice." }),
            new Paragraph({ text: "Evidence: \"...he snuck out of bed and went into the forest\"", italics: true }),
            new Paragraph({ text: "Recommendations: Try to add a reason for 'why' the dinosaur was in the forest. Was it lost too?" }),

            new Paragraph({ text: "4. Character and Setting (1/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Fred's character is clear, but the forest and the dinosaur need more description." }),
            new Paragraph({ text: "Evidence: \"...the trees rustled...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Describe Bob the dinosaur. What colour is he? Does he have spikes or long teeth?" }),

            new Paragraph({ text: "5. Vocabulary (2/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Uses some effective verbs like 'rustled' and 'snuck'." }),
            new Paragraph({ text: "Evidence: \"...so one night he snuck out of bed...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Try to use different words for 'went' or 'took' to make your writing more interesting." }),

            new Paragraph({ text: "6. Cohesion (1/4 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: The story relies too much on the word 'and' and 'so', which makes it sound like one very long sentence." }),
            new Paragraph({ text: "Evidence: \"...in his room has dinosaur stuff all over his room but he dosint...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Every time you want to say 'and', see if you can use a full stop instead." }),

            new Paragraph({ text: "7. Paragraphing (1/2 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: There are some spaces between sections of the story." }),
            new Paragraph({ text: "Recommendations: Start a new paragraph when Fred moves from his room to the forest." }),

            new Paragraph({ text: "8. Sentence Structure (1/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Most of the writing consists of run-on sentences with multiple clauses." }),
            new Paragraph({ text: "Evidence: \"Fred is a kind boy who loves dinosaurs he lives in a small town...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Focus on simple sentences: 'Fred is a kind boy. He loves dinosaurs. He lives in a small town.'" }),

            new Paragraph({ text: "9. Punctuation (1/5 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Very few full stops and capital letters are used throughout the text." }),
            new Paragraph({ text: "Evidence: \"...arrrf yay, so Fred took the dinosaur home...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Practice adding a full stop at the end of every sentence you write." }),

            new Paragraph({ text: "10. Spelling (2/6 points)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Assessment: Some common words are misspelled but difficult words are attempted." }),
            new Paragraph({ text: "Evidence: 'rustled' is correct; 'Sed' and 'reel' are misspelled.", italics: true }),
            new Paragraph({ text: "Recommendations: Focus on learning 'sight words' like 'said' and 'would'." }),

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
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Cohesion" })] }), new TableCell({ children: [new Paragraph({ text: "1" })] }), new TableCell({ children: [new Paragraph({ text: "4" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Paragraphing" })] }), new TableCell({ children: [new Paragraph({ text: "1" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Sentence Structure" })] }), new TableCell({ children: [new Paragraph({ text: "1" })] }), new TableCell({ children: [new Paragraph({ text: "6" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Punctuation" })] }), new TableCell({ children: [new Paragraph({ text: "1" })] }), new TableCell({ children: [new Paragraph({ text: "5" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Spelling" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] }), new TableCell({ children: [new Paragraph({ text: "6" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "TOTAL", bold: true })] }), new TableCell({ children: [new Paragraph({ text: "15", bold: true })] }), new TableCell({ children: [new Paragraph({ text: "47", bold: true })] })] }),
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
    fs.writeFileSync("c:\\Users\\dsuth\\Documents\\Joshua\\Scrap\\Submitted files\\CHANDLER, Saxon (schan274)\\NAPLAN Assessment - Saxon Chandler.docx", buffer);
});
