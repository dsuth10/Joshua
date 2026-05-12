const { Document, Packer, Paragraph, TextRun, HeadingLevel } = require('docx');
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
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Case Study: Cyclone Larry (2006)")] }),
            new Paragraph({ children: [new TextRun({ text: "Source: The Cyclone Archive", italics: true })] }),
            new Paragraph({ spacing: { before: 200 }, children: [new TextRun("Cyclone Larry made landfall near Innisfail, Queensland, on March 20, 2006. It was a Category 5 tropical cyclone, making it one of the most intense to strike the Australian mainland in a generation.")] }),
            new Paragraph({ spacing: { before: 200 }, children: [new TextRun("At landfall, Larry carried sustained winds of 205 km/h and gusts exceeding 240 km/h. The town of Innisfail, known for its sugar and banana production, lay directly in its path.")] }),
            new Paragraph({ spacing: { before: 200 }, children: [new TextRun("A Miraculous Zero:")] }),
            new Paragraph({ children: [new TextRun("One of the most remarkable facts about Cyclone Larry is that there were zero direct fatalities. This was a testament to modern warning systems and the community's willingness to act on warnings by relocating to inland shelters or internal rooms of their homes.")] }),
            new Paragraph({ spacing: { before: 200 }, children: [new TextRun("Economic Impact:")] }),
            new Paragraph({ children: [new TextRun("While no lives were lost, the economic damage was immense, estimated at A$1.5 billion. Larry devastated the banana industry, destroying 80% of Australia's entire banana crop in a single morning. This led to banana prices across Australia surging to over six dollars per kilogram.")] })
        ]
    }]
});

Packer.toBuffer(doc).then(buffer => fs.writeFileSync("Lessons_06_08/Lesson_06/Lesson_06_Reading_Larry.docx", buffer));
