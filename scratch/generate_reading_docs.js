const { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } = require('docx');
const fs = require('fs');
const path = require('path');

const weekNum = "4";
const topic = "The Science of Flooding";
const outputDir = path.join("Homework", `Week_04`);

const texts = {
    Red: `The Science of Flooding: Understanding Inundation Patterns\n\nFlooding is a natural event that happens when water covers land that is usually dry. While flooding is a normal part of the Earth's environment, it often causes problems for buildings, farms, and safety. By studying why rivers, storms, and the ocean cause floods, we can find better ways to stay safe.\n\nRiverine flooding, also called river flooding, happens when a river's water level gets too high for its channel. For example, heavy rain over many days can soak the ground and increase the water flowing into the river. This extra water causes the river level to rise until it spills over the banks and onto the flat land nearby. Because of this, towns built near rivers face a high risk of flooding. It is important for people in these areas to watch the water level and follow safety plans when it rains a lot.\n\nIn contrast, flash flooding happens very quickly and with a high-speed flow. This type of flood usually results from very heavy rainfall—such as a sudden, strong thunderstorm—where there is too much water for the ground to soak up. The rushing water can turn streets into fast rivers and cause damage to bridges and buildings. Because flash floods happen with very little warning, they are often seen as the most dangerous type of flood. Therefore, staying aware of sudden changes in the weather is a key safety measure.\n\nCoastal flooding is caused by the ocean and is often linked to big storms like cyclones. A storm surge happens when strong winds and low pressure push a huge amount of sea water toward the coast. For instance, during a major storm, the surge can join with a high tide to break through sea walls and flood coastal towns. The salt water from the ocean can also cause long-term damage to buildings and local plants. Building strong sea walls and protecting natural areas like mangroves is vital for keeping these coastal regions safe.\n\nIn conclusion, flooding can happen in different ways depending on the environment. Whether it starts from rivers, sudden storms, or the ocean, the science of floods is a very important topic. Understanding these causes helps us build safer towns and improve how we act during emergencies.`,
    Blue: `The Science of Flooding\n\nFlooding is a natural event that happens when water overflows onto dry land. While floods are part of the Earth's natural cycle, they can be dangerous and cause damage to buildings and roads. Understanding the different types of flooding helps us prepare for bad weather.\n\nRiverine flooding, or river flooding, happens when a river cannot hold any more water. For example, heavy rain in the mountains may flow into a river for several days. This causes the water level to rise until it spills over the riverbanks. The water then flows onto the flat plains nearby. This means that homes located in low areas are at risk of getting wet. People living near rivers must watch for flood warnings when it rains.\n\nFlash flooding is a very sudden type of flood that happens without much warning. A large amount of rain falls during a big storm in a very short time. This heavy rainfall causes water to collect and rush through streets like a powerful river. Because flash floods happen so quickly, they are often the most dangerous type of flood. It is important to stay away from storm drains and low bridges during heavy rain.\n\nCoastal flooding occurs along the edges of the ocean. Strong winds from storms push a large wall of sea water onto the land. This is called a storm surge. For instance, during a cyclone, high tides and big waves can flood coastal roads. This salt water can damage plants and buildings near the beach. Towns on the coast must have strong walls and plans to stay safe.\n\nIn conclusion, flooding comes in many forms depending on where you live. Whether it is river, flash, or coastal flooding, water is very strong. Learning the science behind these events helps us build safer towns. Always check the weather to stay prepared for rising waters.`,
    Green: `The Science of Flooding\n\nFloods happen when there is too much water on the land. This water covers the ground. Flooding can be very dangerous. It is important to know why floods happen. This helps us stay safe.\n\nRiver floods happen when a river is too full. For example, heavy rain falls for many days. This extra water spills over the banks. This means houses near the water might get wet. We must watch the river when it rains a lot.\n\nFlash floods happen very fast. A huge amount of rain falls in a short time. This causes water to rush down the streets. It looks like a fast river. This happens quickly so we must move fast. Do not play in the rain.\n\nCoastal floods happen near the beach. Strong winds push the sea water onto the dry land. This often happens during a big storm. The salt water can flood shops near the coast. We should stay away from the beach during storms.\n\nFlooding has many causes. Water can be very powerful. Learning about floods helps us get ready. Always listen to the news to stay safe.`
};

async function generateDoc(level, text) {
    const paragraphs = text.split('\n\n').map((para, index) => {
        if (index === 0) {
            return new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 240 },
                children: [new TextRun({ text: para, bold: true, size: 32, font: "Arial" })]
            });
        }
        return new Paragraph({
            spacing: { after: 120 },
            lineSpacing: { before: 0, after: 0, line: 276 }, // 1.15 line spacing (240 * 1.15 = 276)
            children: [new TextRun({ text: para, size: 24, font: "Arial" })]
        });
    });

    const doc = new Document({
        styles: {
            default: {
                document: {
                    run: { font: "Arial", size: 24 }
                }
            }
        },
        sections: [{
            properties: {
                page: {
                    size: { width: 11906, height: 16838 }, // A4
                    margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
                }
            },
            children: [
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: `Week ${weekNum} Homework — ${topic}`, bold: true, size: 24, font: "Arial" })]
                }),
                new Paragraph({ spacing: { after: 480 }, children: [] }),
                ...paragraphs
            ]
        }]
    });

    const buffer = await Packer.toBuffer(doc);
    const fileName = path.join(outputDir, `Week_${weekNum.padStart(2, '0')}_Reading_${level}.docx`);
    fs.writeFileSync(fileName, buffer);
    console.log(`Created ${fileName}`);
}

(async () => {
    for (const level in texts) {
        await generateDoc(level, texts[level]);
    }
})();
