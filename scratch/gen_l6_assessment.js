const { Document, Packer, Paragraph, TextRun } = require('docx');
const fs = require('fs');

const doc = new Document({
    styles: {
        default: { document: { run: { font: "Arial", size: 24 } } }
    },
    sections: [{
        children: [
            new Paragraph({ children: [new TextRun({ text: "Lesson 6 Assessment: Introducing Tropical Cyclones", bold: true, size: 32 })] }),
            new Paragraph({ spacing: { before: 200 }, children: [new TextRun("1. What is the minimum sea surface temperature required for a tropical cyclone to form?")] }),
            new Paragraph({ children: [new TextRun("A. 20.5°C")] }),
            new Paragraph({ children: [new TextRun("B. 24.0°C")] }),
            new Paragraph({ children: [new TextRun("C. 26.5°C")] }),
            new Paragraph({ children: [new TextRun("D. 30.0°C")] }),
            new Paragraph({ children: [new TextRun("ANSWER: C")] }),
            new Paragraph({ children: [new TextRun("POINT: 1")] }),

            new Paragraph({ spacing: { before: 200 }, children: [new TextRun("2. At what wind speed is a tropical low classified as a Category 1 tropical cyclone?")] }),
            new Paragraph({ children: [new TextRun("A. 40 km/h")] }),
            new Paragraph({ children: [new TextRun("B. 62 km/h")] }),
            new Paragraph({ children: [new TextRun("C. 100 km/h")] }),
            new Paragraph({ children: [new TextRun("D. 120 km/h")] }),
            new Paragraph({ children: [new TextRun("ANSWER: B")] }),
            new Paragraph({ children: [new TextRun("POINT: 1")] }),

            new Paragraph({ spacing: { before: 200 }, children: [new TextRun("3. In which hemisphere do tropical cyclones rotate in a clockwise direction?")] }),
            new Paragraph({ children: [new TextRun("A. Northern Hemisphere")] }),
            new Paragraph({ children: [new TextRun("B. Southern Hemisphere")] }),
            new Paragraph({ children: [new TextRun("C. Both Hemispheres")] }),
            new Paragraph({ children: [new TextRun("D. Neither Hemisphere")] }),
            new Paragraph({ children: [new TextRun("ANSWER: B")] }),
            new Paragraph({ children: [new TextRun("POINT: 1")] }),

            new Paragraph({ spacing: { before: 200 }, children: [new TextRun("4. What is the term used for a tropical cyclone in the Atlantic and Northeast Pacific?")] }),
            new Paragraph({ children: [new TextRun("A. Typhoon")] }),
            new Paragraph({ children: [new TextRun("B. Tornado")] }),
            new Paragraph({ children: [new TextRun("C. Hurricane")] }),
            new Paragraph({ children: [new TextRun("D. Storm Surge")] }),
            new Paragraph({ children: [new TextRun("ANSWER: C")] }),
            new Paragraph({ children: [new TextRun("POINT: 1")] }),

            new Paragraph({ spacing: { before: 200 }, children: [new TextRun("5. Which of these is a major difference between a cyclone and a tornado?")] }),
            new Paragraph({ children: [new TextRun("A. Tornadoes form over water; cyclones form over land.")] }),
            new Paragraph({ children: [new TextRun("B. Cyclones are much larger and last longer than tornadoes.")] }),
            new Paragraph({ children: [new TextRun("C. Tornadoes only happen in Australia.")] }),
            new Paragraph({ children: [new TextRun("D. There is no difference.")] }),
            new Paragraph({ children: [new TextRun("ANSWER: B")] }),
            new Paragraph({ children: [new TextRun("POINT: 1")] }),

            new Paragraph({ spacing: { before: 200 }, children: [new TextRun("6. What is the name of the calm centre of a tropical cyclone?")] }),
            new Paragraph({ children: [new TextRun("A. The Eye Wall")] }),
            new Paragraph({ children: [new TextRun("B. The Eye")] }),
            new Paragraph({ children: [new TextRun("C. The Rain Band")] }),
            new Paragraph({ children: [new TextRun("D. The Core")] }),
            new Paragraph({ children: [new TextRun("ANSWER: B")] }),
            new Paragraph({ children: [new TextRun("POINT: 1")] }),

            new Paragraph({ spacing: { before: 200 }, children: [new TextRun("7. Cyclone Yasi (2011) was classified as which category storm at landfall?")] }),
            new Paragraph({ children: [new TextRun("A. Category 1")] }),
            new Paragraph({ children: [new TextRun("B. Category 3")] }),
            new Paragraph({ children: [new TextRun("C. Category 5")] }),
            new Paragraph({ children: [new TextRun("D. Category 2")] }),
            new Paragraph({ children: [new TextRun("ANSWER: C")] }),
            new Paragraph({ children: [new TextRun("POINT: 1")] }),

            new Paragraph({ spacing: { before: 200 }, children: [new TextRun("8. Why did Cyclone Larry (2006) have zero direct fatalities?")] }),
            new Paragraph({ children: [new TextRun("A. It wasn't a strong storm.")] }),
            new Paragraph({ children: [new TextRun("B. It hit an unpopulated area.")] }),
            new Paragraph({ children: [new TextRun("C. Effective warning systems and evacuations.")] }),
            new Paragraph({ children: [new TextRun("D. It didn't reach the land.")] }),
            new Paragraph({ children: [new TextRun("ANSWER: C")] }),
            new Paragraph({ children: [new TextRun("POINT: 1")] }),

            new Paragraph({ spacing: { before: 200 }, children: [new TextRun("9. What is a 'storm surge'?")] }),
            new Paragraph({ children: [new TextRun("A. A sudden increase in wind speed.")] }),
            new Paragraph({ children: [new TextRun("B. A rise in sea level caused by a cyclone.")] }),
            new Paragraph({ children: [new TextRun("C. A type of electrical storm.")] }),
            new Paragraph({ children: [new TextRun("D. A dry wind from the desert.")] }),
            new Paragraph({ children: [new TextRun("ANSWER: B")] }),
            new Paragraph({ children: [new TextRun("POINT: 1")] }),

            new Paragraph({ spacing: { before: 200 }, children: [new TextRun("10. Which government agency is responsible for issuing cyclone warnings in Australia?")] }),
            new Paragraph({ children: [new TextRun("A. Bureau of Meteorology (BOM)")] }),
            new Paragraph({ children: [new TextRun("B. Department of Education")] }),
            new Paragraph({ children: [new TextRun("C. The Police")] }),
            new Paragraph({ children: [new TextRun("D. NASA")] }),
            new Paragraph({ children: [new TextRun("ANSWER: A")] }),
            new Paragraph({ children: [new TextRun("POINT: 1")] })
        ]
    }]
});

Packer.toBuffer(doc).then(buffer => fs.writeFileSync("Lessons_06_08/Lesson_06/Lesson_06_Assessment.docx", buffer));
