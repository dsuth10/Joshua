const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType, VerticalAlign } = require('docx');
const fs = require('fs');

const doc = new Document({
    styles: {
        default: {
            document: {
                run: {
                    font: "Arial",
                    size: 24, // 12pt
                },
            },
        },
        paragraphStyles: [
            {
                id: "Heading1",
                name: "Heading 1",
                basedOn: "Normal",
                next: "Normal",
                quickFormat: true,
                run: {
                    size: 32,
                    bold: true,
                    color: "000000",
                    font: "Arial",
                },
                paragraph: {
                    spacing: { before: 240, after: 120 },
                },
            },
            {
                id: "Heading2",
                name: "Heading 2",
                basedOn: "Normal",
                next: "Normal",
                quickFormat: true,
                run: {
                    size: 28,
                    bold: true,
                    color: "000000",
                    font: "Arial",
                },
                paragraph: {
                    spacing: { before: 180, after: 120 },
                },
            },
        ],
    },
    sections: [{
        children: [
            new Paragraph({
                text: "NAPLAN Narrative Marking Report",
                heading: HeadingLevel.TITLE,
                alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
                children: [
                    new TextRun({ text: "Student Name: ", bold: true }),
                    new TextRun("Julia Bereny"),
                ],
            }),
            new Paragraph({
                children: [
                    new TextRun({ text: "Date: ", bold: true }),
                    new TextRun("2026-01-28"),
                ],
            }),
            new Paragraph({
                children: [
                    new TextRun({ text: "Total Score: ", bold: true }),
                    new TextRun("31/47"),
                ],
            }),

            new Paragraph({
                text: "Executive Summary",
                heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
                text: "Overall Strengths",
                heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({ text: "• Clear and effective narrative structure with orientation, complication, and resolution.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Evocative setting description using sensory imagery (e.g., \"aroma smelt of sweet ecliptics\").", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Good use of character dialogue to move the story forward and reveal character reactions.", numbering: { reference: "bullet-points", level: 0 } }),

            new Paragraph({
                text: "Areas for Development",
                heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({ text: "• Spelling accuracy for high-frequency but slightly complex words like \"extinct\".", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Punctuation control within dialogue, particularly comma and full stop placement.", numbering: { reference: "bullet-points", level: 0 } }),
            new Paragraph({ text: "• Further elaboration on the \"weird noise\" and build-up to the discovery to increase suspense.", numbering: { reference: "bullet-points", level: 0 } }),

            new Paragraph({
                text: "Detailed Assessment by Criterion",
                heading: HeadingLevel.HEADING_1,
            }),

            // Criterion 1: Audience
            new Paragraph({
                text: "1. Audience (3/6 points)",
                heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({ text: "Assessment: Successfully orients and engages the reader through the use of an adventurous premise and emotive dialogue." }),
            new Paragraph({ text: "Evidence: \"'Oh my gosh!' she exclaimed.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Try to use more descriptive language to show how Rosey felt rather than just telling the reader she was 'nervous'." }),

            // Criterion 2: Text Structure
            new Paragraph({
                text: "2. Text Structure (3/4 points)",
                heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({ text: "Assessment: A controlled narrative with a clear beginning, middle, and end. The discovery and subsequent resolution are well-handled." }),
            new Paragraph({ text: "Evidence: \"Suddenly Rosey heard a weird noise... Right in front of her was a stegosaurs!\"", italics: true }),
            new Paragraph({ text: "Recommendations: Consider adding a slightly longer build-up between hearing the noise and seeing the dinosaur to increase the narrative tension." }),

            // Criterion 3: Ideas
            new Paragraph({
                text: "3. Ideas (3/5 points)",
                heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({ text: "Assessment: The idea of finding a living dinosaur is clear and successfully developed into a full story." }),
            new Paragraph({ text: "Evidence: \"No one knew how the dinosaurs still lived till today.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Experiment with more unusual or unique complications to make the story stand out from common adventure tropes." }),

            // Criterion 4: Character and Setting
            new Paragraph({
                text: "4. Character and Setting (3/4 points)",
                heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({ text: "Assessment: Setting is established early with good sensory details. Characters have distinct reactions that feel realistic within the story's context." }),
            new Paragraph({ text: "Evidence: \"The aroma smelt of sweet ecliptics and she heard the chirping...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Describe the stegosaurus in more detail—its size, its scales, or how it moved—to make the setting even more vivid." }),

            // Criterion 5: Vocabulary
            new Paragraph({
                text: "5. Vocabulary (3/5 points)",
                heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({ text: "Assessment: Uses some precise words like 'balmy', 'vast', and 'sprinted' to enhance the writing." }),
            new Paragraph({ text: "Evidence: \"One balmy afternoon...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Look for alternatives to common words like 'said' and 'went' to add more flavour to the character actions." }),

            // Criterion 6: Cohesion
            new Paragraph({
                text: "6. Cohesion (3/4 points)",
                heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({ text: "Assessment: Cohesive links like 'Suddenly' and 'Later' help the story flow smoothly across time and locations." }),
            new Paragraph({ text: "Evidence: \"Later Rosey became an adventurist...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Use a wider variety of connectives to link ideas within paragraphs as well as between them." }),

            // Criterion 7: Paragraphing
            new Paragraph({
                text: "7. Paragraphing (2/2 points)",
                heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({ text: "Assessment: Paragraphs are used correctly to separate different stages of the story and different speakers in the dialogue." }),
            new Paragraph({ text: "Recommendations: Great work. Keep using paragraphs to signal shifts in time, place, or focus." }),

            // Criterion 8: Sentence Structure
            new Paragraph({
                text: "8. Sentence Structure (4/6 points)",
                heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({ text: "Assessment: Good variety in sentence length and type. Most sentences are grammatically sound." }),
            new Paragraph({ text: "Evidence: \"Rosey went the same direction she remembered with Mum and Dad following closely behind her...\"", italics: true }),
            new Paragraph({ text: "Recommendations: Practice combining shorter sentences into complex ones using words like 'although', 'because', or 'which'." }),

            // Criterion 9: Punctuation
            new Paragraph({
                text: "9. Punctuation (3/5 points)",
                heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({ text: "Assessment: Fundamental punctuation is mostly correct. Dialogue is generally well-punctuated." }),
            new Paragraph({ text: "Evidence: \"'What is it, Rosey?' asked Mum.\"", italics: true }),
            new Paragraph({ text: "Recommendations: Watch out for missing full stops at the end of reported speech sentences." }),

            // Criterion 10: Spelling
            new Paragraph({
                text: "10. Spelling (4/6 points)",
                heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({ text: "Assessment: Correct spelling of several challenging and difficult words." }),
            new Paragraph({ text: "Evidence: 'exploring', 'imagination', 'scientists'.", italics: true }),
            new Paragraph({ text: "Recommendations: Double-check the spelling of words with silent letters or unusual endings, like 'extinct'." }),

            new Paragraph({
                text: "Score Summary",
                heading: HeadingLevel.HEADING_1,
            }),
            new Table({
                columnWidths: [4680, 2340, 2340],
                rows: [
                    new TableRow({
                        tableHeader: true,
                        children: [
                            new TableCell({ children: [new Paragraph({ text: "Criterion", bold: true })], shading: { fill: "D5E8F0", type: ShadingType.CLEAR } }),
                            new TableCell({ children: [new Paragraph({ text: "Score", bold: true })], shading: { fill: "D5E8F0", type: ShadingType.CLEAR } }),
                            new TableCell({ children: [new Paragraph({ text: "Max", bold: true })], shading: { fill: "D5E8F0", type: ShadingType.CLEAR } }),
                        ],
                    }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Audience" })] }), new TableCell({ children: [new Paragraph({ text: "3" })] }), new TableCell({ children: [new Paragraph({ text: "6" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Text Structure" })] }), new TableCell({ children: [new Paragraph({ text: "3" })] }), new TableCell({ children: [new Paragraph({ text: "4" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Ideas" })] }), new TableCell({ children: [new Paragraph({ text: "3" })] }), new TableCell({ children: [new Paragraph({ text: "5" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Character and Setting" })] }), new TableCell({ children: [new Paragraph({ text: "3" })] }), new TableCell({ children: [new Paragraph({ text: "4" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Vocabulary" })] }), new TableCell({ children: [new Paragraph({ text: "3" })] }), new TableCell({ children: [new Paragraph({ text: "5" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Cohesion" })] }), new TableCell({ children: [new Paragraph({ text: "3" })] }), new TableCell({ children: [new Paragraph({ text: "4" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Paragraphing" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] }), new TableCell({ children: [new Paragraph({ text: "2" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Sentence Structure" })] }), new TableCell({ children: [new Paragraph({ text: "4" })] }), new TableCell({ children: [new Paragraph({ text: "6" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Punctuation" })] }), new TableCell({ children: [new Paragraph({ text: "3" })] }), new TableCell({ children: [new Paragraph({ text: "5" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Spelling" })] }), new TableCell({ children: [new Paragraph({ text: "4" })] }), new TableCell({ children: [new Paragraph({ text: "6" })] })] }),
                    new TableRow({
                        children: [
                            new TableCell({ children: [new Paragraph({ text: "TOTAL", bold: true })] }),
                            new TableCell({ children: [new Paragraph({ text: "31", bold: true })] }),
                            new TableCell({ children: [new Paragraph({ text: "47", bold: true })] }),
                        ],
                    }),
                ],
            }),
        ],
    }],
    numbering: {
        config: [
            {
                reference: "bullet-points",
                levels: [
                    {
                        level: 0,
                        format: "bullet",
                        text: "•",
                        alignment: AlignmentType.LEFT,
                        style: {
                            paragraph: {
                                indent: { left: 720, hanging: 360 },
                            },
                        },
                    },
                ],
            },
        ],
    },
});

Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync("c:\\Users\\dsuth\\Documents\\Joshua\\Scrap\\Submitted files\\BERENY, Julia (jbere25)\\NAPLAN Assessment - Julia Bereny.docx", buffer);
});
