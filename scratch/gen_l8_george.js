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
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Case Study: Cyclone George (2007) and Mahina (1899)")] }),
            new Paragraph({ children: [new TextRun({ text: "Source: The Cyclone Archive", italics: true })] }),
            new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "Cyclone George (2007):", bold: true })] }),
            new Paragraph({ children: [new TextRun("In March 2007, Cyclone George tore through the Pilbara region of Western Australia. It was a powerful Category 5 system with wind gusts reaching 285 km/h. George was significant because it directly hit mining infrastructure, including a railway and mining camps.")] }),
            new Paragraph({ children: [new TextRun("The impact was felt globally. The closure of the Pilbara's iron ore ports for several days caused world iron ore prices to spike. It served as a stark reminder of how natural disasters in remote regions can disrupt global trade networks.")] }),
            
            new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "Cyclone Mahina (1899):", bold: true })] }),
            new Paragraph({ children: [new TextRun("Cyclone Mahina remains the deadliest natural disaster in Australian history. In March 1899, it struck a pearling fleet in Princess Charlotte Bay, Queensland. Over 300 people lost their lives.")] }),
            new Paragraph({ children: [new TextRun("The storm was famous for its massive storm surge, which was reported to be over 13 metres high—the highest ever recorded in Australia. Without the early warning systems we have today, the people on the ships had no chance to escape the path of the storm.")] })
        ]
    }]
});

Packer.toBuffer(doc).then(buffer => fs.writeFileSync("Lessons_06_08/Lesson_08/Lesson_08_Reading_George.docx", buffer));
