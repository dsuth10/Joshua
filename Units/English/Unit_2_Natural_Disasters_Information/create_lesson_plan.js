const { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, Table, TableRow, TableCell, BorderStyle, WidthType, ShadingType, UnderlineType, PageBreak } = require('docx');
const fs = require('fs');

// Shared styles and colors
const OCHRE = "B12E21";
const AMBER = "FFBF00";
const CHARCOAL = "2B2B2B";

const doc = new Document({
    styles: {
        default: {
            document: {
                run: { font: "Arial", size: 22, color: "000000" }
            }
        },
        paragraphStyles: [
            {
                id: "Title",
                name: "Title",
                basedOn: "Normal",
                run: { size: 56, bold: true, color: OCHRE, font: "Arial" },
                paragraph: { alignment: AlignmentType.CENTER, spacing: { before: 400, after: 200 } }
            },
            {
                id: "Heading1",
                name: "Heading 1",
                basedOn: "Normal",
                run: { size: 36, bold: true, color: OCHRE, font: "Arial" },
                paragraph: { spacing: { before: 300, after: 200 }, outlineLevel: 0, border: { bottom: { color: OCHRE, space: 1, style: BorderStyle.SINGLE, size: 6 } } }
            },
            {
                id: "Heading2",
                name: "Heading 2",
                basedOn: "Normal",
                run: { size: 28, bold: true, color: "333333", font: "Arial" },
                paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 }
            }
        ]
    },
    sections: [{
        children: [
            // Page 1: Lesson Overview & Activity 1
            new Paragraph({ text: "LESSON PLAN: ELEMENTAL MAGIC", heading: HeadingLevel.TITLE }),
            new Paragraph({ text: "Unit 1: Natural Disasters - Animal Survival & Text Structures", alignment: AlignmentType.CENTER, spacing: { after: 400 } }),

            new Paragraph({ text: "Learning Intentions", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({
                children: [
                    new TextRun({ text: "Students will be able to:", bold: true }),
                ]
            }),
            new Paragraph({ text: "• Identify and describe the purpose of specific text structures (headings, images, captions, paragraphs).", bullet: { level: 0 } }),
            new Paragraph({ text: "• Retrieve literal information from a complex informational text.", bullet: { level: 0 } }),
            new Paragraph({ text: "• Use evidence from the text to make inferences about animal behaviour and authorial intent.", bullet: { level: 0 } }),

            new Paragraph({ text: "Phase 1: Decoding the Magazine (Text Structures)", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({
                children: [
                    new TextRun("Before reading for content, students engage in a 'Visual Audit' of the article. They should use a highlighter to circle and label the following components:")
                ]
            }),
            new Paragraph({ text: "• The Master Heading: Why is it the largest text? What does its color suggest?", bullet: { level: 0 } }),
            new Paragraph({ text: "• Photographic Assets: How do the images help you understand the 'mood' of the fire?", bullet: { level: 0 } }),
            new Paragraph({ text: "• Sidebars/Fact Boxes: What is the benefit of pulling information out into a separate box?", bullet: { level: 0 } }),
            new Paragraph({ text: "• Informational Paragraphs: How does the author use the first sentence of each paragraph to signal which animal is being discussed?", bullet: { level: 0 } }),

            new Paragraph({ text: "Phase 2: Deep Reading", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({
                children: [
                    new TextRun("In pairs, students read the article. They are encouraged to look for 'clue words' that the author uses to describe the animals' survival as something 'magical' or 'prehistoric'.")
                ]
            }),

            new Paragraph({ children: [new PageBreak()] }),

            // Page 2: Comprehension & Inference Questions
            new Paragraph({ text: "Phase 3: Critical Response & Inference", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({
                children: [
                    new TextRun("Students answer the following questions in their workbooks. Encourage them to find specific quotes from the text to support their 'inference' answers.")
                ],
                spacing: { after: 200 }
            }),

            // Question Section
            new Paragraph({ text: "1. Literal Retrieval: Tactical Runners", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Which animal uses the 'Early Exit' strategy, and what specific chemical changes in the air do they sense to know a fire is coming?" }),

            new Paragraph({ text: "2. Literal Retrieval: Sanctuaries", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "The article mentions birds seeking out 'Elemental Sanctuaries.' Name two types of landscapes the birds go to for safety." }),

            new Paragraph({ text: "3. Inference: Word Choice", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "The author repeatedly uses terms like \"Magic,\" \"Bunkers,\" and \"Shields\" to describe biological adaptations. Why do you think the author chose these specific words instead of just using scientific terms? How does it make the reader feel about the animals?" }),

            new Paragraph({ text: "4. Deep Inference: Suspended Animation", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "The text describes the echidna waiting in a state of \"suspended animation\" while the bush above is a furnace. What does this suggest about the amount of energy the echidna is using during the fire? Why would this be helpful for survival?" }),

            new Paragraph({ text: "5. Analytical Comparison: Risk vs. Reward", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Compare the Kangaroo’s strategy (fleeing to open ground) with the Goanna’s strategy (hiding in tree hollows). Which animal do you think faces the most 'risk' if the fire is extremely large and fast? Use facts from the text to justify your answer." }),

            new Paragraph({ text: "6. Visual Literacy: The Tone", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Look at the visual structure of the article—the dark 'Charcoal' background and the glowing 'Amber' text. How does this design support the theme of 'Resilience' mentioned in the title?" }),

            new Paragraph({ text: "Teacher Reflections / Extension", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: "Ask students to choose one other animal (e.g., a Koala or a Wombat) and research if they have their own 'Magic Toolkit' for fire survival. If they don't, why are they more vulnerable?" })
        ]
    }]
});

Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync('c:/Users/dsuth/Documents/Joshua/Units/English/Unit_1_Natural_Disasters_Information/Elemental_Magic_Detailed_Lesson_Plan.docx', buffer);
    console.log('Lesson Plan created successfully');
});
