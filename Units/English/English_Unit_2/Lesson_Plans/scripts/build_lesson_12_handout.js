const { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, LevelFormat, Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle } = require('docx');
const fs = require('fs');

const doc = new Document({
    styles: {
        default: {
            document: {
                run: { font: "Arial", size: 24 }
            }
        },
        paragraphStyles: [
            {
                id: "Heading1",
                name: "Heading 1",
                basedOn: "Normal",
                next: "Normal",
                quickFormat: true,
                run: { size: 36, bold: true, color: "000000", font: "Arial" },
                paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 }
            },
            {
                id: "Heading2",
                name: "Heading 2",
                basedOn: "Normal",
                next: "Normal",
                quickFormat: true,
                run: { size: 28, bold: true, color: "000000", font: "Arial" },
                paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 }
            }
        ]
    },
    sections: [{
        properties: {
            page: {
                margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
                size: { width: 11906, height: 16838 } // A4
            }
        },
        children: [
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                    new TextRun({ text: "Year 5 English: Unit 2 — Lesson 12", bold: true, size: 28 }),
                ]
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 400 },
                children: [
                    new TextRun({ text: "Controlling the Message: Cohesion", bold: true, size: 32 }),
                ]
            }),
            new Paragraph({
                children: [
                    new TextRun({ text: "Learning Intention:", bold: true }),
                    new TextRun(" I can explain how texts are made cohesive by using the starting point of a sentence or paragraph to give prominence to the message."),
                ]
            }),
            new Paragraph({
                spacing: { before: 240 },
                children: [
                    new TextRun({ text: "Success Criteria:", bold: true }),
                ]
            }),
            new Paragraph({
                children: [new TextRun("• I can identify the Theme (starting point) and Rheme (the rest) of a sentence.")],
                spacing: { before: 120 }
            }),
            new Paragraph({
                children: [new TextRun("• I can rewrite sentences to change what information is emphasised.")],
            }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Part 1: Theme and Rheme")] }),
            new Paragraph({
                children: [
                    new TextRun("Every sentence has a starting point. This is called the "),
                    new TextRun({ text: "Theme", bold: true }),
                    new TextRun(". The rest of the sentence is called the "),
                    new TextRun({ text: "Rheme", bold: true }),
                    new TextRun("."),
                ]
            }),
            new Paragraph({
                spacing: { before: 120 },
                children: [
                    new TextRun("Example: "),
                    new TextRun({ text: "The floodwaters ", bold: true, color: "0000FF" }),
                    new TextRun({ text: "(Theme) ", italic: true }),
                    new TextRun({ text: "rose quickly. ", bold: true, color: "FF0000" }),
                    new TextRun({ text: "(Rheme)", italic: true }),
                ]
            }),

            new Paragraph({
                spacing: { before: 240 },
                children: [
                    new TextRun("The Theme tells the reader what the sentence is about and what is most important in that moment."),
                ]
            }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Part 2: Identifying the Theme")] }),
            new Paragraph({
                children: [new TextRun("Underline the Theme (starting point) in these sentences from the Floods Archive.")],
                spacing: { after: 240 }
            }),
            
            new Paragraph({
                children: [new TextRun("1. In 1893, three separate floods hit Brisbane within weeks of each other.")],
                spacing: { after: 240 }
            }),
            new Paragraph({
                children: [new TextRun("2. Fast-moving water is deceptive and lethal.")],
                spacing: { after: 240 }
            }),
            new Paragraph({
                children: [new TextRun("3. Across the 2011 and 2022 events, 46 lives were lost.")],
                spacing: { after: 240 }
            }),
            new Paragraph({
                children: [new TextRun("4. Brisbane's relationship with the river is a cycle of catastrophe and adaptation.")],
                spacing: { after: 240 }
            }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Part 3: Rewriting for Prominence")] }),
            new Paragraph({
                children: [new TextRun("The main focus of today's lesson is to rewrite sentences to change what we want the reader to notice first. This gives 'prominence' to certain information.")],
                spacing: { after: 240 }
            }),

            new Paragraph({
                children: [new TextRun("Task: Rewrite each sentence below, starting with the suggested words. Think about how the focus of the sentence changes.")],
                spacing: { after: 240 }
            }),

            new Paragraph({
                children: [new TextRun({ text: "1. Original: ", bold: true }), new TextRun("Fast-moving water is deceptive and lethal.")],
            }),
            new Paragraph({
                children: [new TextRun({ text: "Rewrite (Start with 'Because...'):", italics: true })],
                spacing: { after: 120 }
            }),
            new Paragraph({ children: [new TextRun("__________________________________________________________________________")], spacing: { after: 400 } }),

            new Paragraph({
                children: [new TextRun({ text: "2. Original: ", bold: true }), new TextRun("Wivenhoe Dam was built following the trauma of the 1974 floods.")],
            }),
            new Paragraph({
                children: [new TextRun({ text: "Rewrite (Start with 'Following...'):", italics: true })],
                spacing: { after: 120 }
            }),
            new Paragraph({ children: [new TextRun("__________________________________________________________________________")], spacing: { after: 400 } }),

            new Paragraph({
                children: [new TextRun({ text: "3. Original: ", bold: true }), new TextRun("Month after month of rainfall saturated every catchment in Queensland during the 2011 event.")],
            }),
            new Paragraph({
                children: [new TextRun({ text: "Rewrite (Start with 'During...'):", italics: true })],
                spacing: { after: 120 }
            }),
            new Paragraph({ children: [new TextRun("__________________________________________________________________________")], spacing: { after: 400 } }),

            new Paragraph({
                children: [new TextRun({ text: "4. Original: ", bold: true }), new TextRun("An atmospheric block trapped a severe weather system over South East Queensland in February 2022.")],
            }),
            new Paragraph({
                children: [new TextRun({ text: "Rewrite (Start with 'In February 2022...'):", italics: true })],
                spacing: { after: 120 }
            }),
            new Paragraph({ children: [new TextRun("__________________________________________________________________________")], spacing: { after: 400 } }),

            new Paragraph({
                children: [new TextRun({ text: "5. Original: ", bold: true }), new TextRun("12,500 properties were inundated in Brisbane alone when the river peaked.")],
            }),
            new Paragraph({
                children: [new TextRun({ text: "Rewrite (Start with 'When the river peaked...'):", italics: true })],
                spacing: { after: 120 }
            }),
            new Paragraph({ children: [new TextRun("__________________________________________________________________________")], spacing: { after: 400 } }),
        ]
    }]
});

Packer.toBuffer(doc).then(buffer => {
    fs.writeFileSync("c:/Users/dsuth/Documents/Joshua/Units/English/English_Unit_2/Lesson_Plans/Handouts/Lesson_12_Handout_Cohesion.docx", buffer);
    console.log("Handout created successfully.");
});
