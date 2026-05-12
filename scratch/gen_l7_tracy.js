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
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Case Study: Cyclone Tracy (1974) and Althea (1971)")] }),
            new Paragraph({ children: [new TextRun({ text: "Source: The Cyclone Archive", italics: true })] }),
            new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "Cyclone Tracy (1974):", bold: true })] }),
            new Paragraph({ children: [new TextRun("Christmas Eve 1974 in Darwin was hot and humid. By midnight, a distant depression named Tracy had turned into a malevolent storm. At 3:00 AM on Christmas morning, the eye of Cyclone Tracy passed directly over the city, with wind speeds reaching 217 km/h before the anemometer broke.")] }),
            new Paragraph({ children: [new TextRun("The city was effectively wiped off the map. Over 90% of Darwin's homes were destroyed. In response, the Royal Australian Navy launched 'Operation Navy Help', and over 30,000 people were airlifted out in Australia's largest civil evacuation.")] }),
            
            new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "Cyclone Althea (1971):", bold: true })] }),
            new Paragraph({ children: [new TextRun("Three years before Tracy, Cyclone Althea struck Townsville on Christmas Eve. It damaged or destroyed over 3,300 homes. Engineers found that most homes failed because the connections between roofs and walls were too weak.")] }),
            new Paragraph({ children: [new TextRun("The legacy of Althea was the establishment of the Cyclone Testing Station at James Cook University in 1972. This facility rewrote Australian building codes, ensuring that modern homes in cyclone-prone areas are built to withstand much higher wind loads.")] })
        ]
    }]
});

Packer.toBuffer(doc).then(buffer => fs.writeFileSync("Lessons_06_08/Lesson_07/Lesson_07_Reading_Tracy.docx", buffer));
