const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = require('docx');
const fs = require('fs');

const doc = new Document({
    styles: {
        default: { document: { run: { font: "Arial", size: 24 } } },
        paragraphStyles: [
            { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", run: { size: 32, bold: true }, paragraph: { spacing: { before: 240, after: 240 } } }
        ]
    },
    sections: [{
        children: [
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Case Study: Cyclone Yasi (2011)")] }),
            new Paragraph({ children: [new TextRun({ text: "Source: The Cyclone Archive", italics: true })] }),
            new Paragraph({ spacing: { before: 200 }, children: [new TextRun("Cyclone Yasi was one of the most powerful cyclones to hit Queensland since records began. It crossed the coast near Mission Beach on February 3, 2011, as a massive Category 5 system.")] }),
            new Paragraph({ spacing: { before: 200 }, children: [new TextRun("At landfall, Yasi was carrying peak wind gusts of 285 km/h. Its scale was immense—the eye was approximately 35 kilometres wide, and the destructive wind core stretched for hundreds of kilometres.")] }),
            new Paragraph({ spacing: { before: 200 }, children: [new TextRun("Impact on Communities:")] }),
            new Paragraph({ children: [new TextRun("Yasi triggered Australia's largest peacetime evacuation. Over 10,000 people were moved to emergency shelters. Despite its power, only one direct fatality was recorded, which experts attribute to the effective evacuation and warning systems.")] }),
            new Paragraph({ spacing: { before: 200 }, children: [new TextRun("Impact on the Environment:")] }),
            new Paragraph({ children: [new TextRun("The storm brought a 5-metre storm surge to the coast. It heavily impacted the Wet Tropics rainforests, stripping trees of leaves and branches. Farmland was decimated, with the banana and sugar cane industries suffering A$3.6 billion in total damage.")] })
        ]
    }]
});

Packer.toBuffer(doc).then(buffer => fs.writeFileSync("Lessons_06_08/Lesson_06/Lesson_06_Reading_Yasi.docx", buffer));
