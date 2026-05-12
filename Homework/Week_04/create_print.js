const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType, BorderStyle, WidthType, TabStopType, TabStopPosition } = require('docx');
const fs = require('fs');
const path = require('path');

const weekNum = "04";
const topic = "The Science of Flooding";
const outputDir = path.join("Homework", `Week_04`);

const data = {
    Red: {
        text: `The Science of Flooding: Understanding Inundation Patterns\n\nFlooding is a natural event that happens when water covers land that is usually dry. While flooding is a normal part of the Earth's environment, it often causes problems for buildings, farms, and safety. By studying why rivers, storms, and the ocean cause floods, we can find better ways to stay safe.\n\nRiverine flooding, also called river flooding, happens when a river's water level gets too high for its channel. For example, heavy rain over many days can soak the ground and increase the water flowing into the river. This extra water causes the river level to rise until it spills over the banks and onto the flat land nearby. Because of this, towns built near rivers face a high risk of flooding. It is important for people in these areas to watch the water level and follow safety plans when it rains a lot.\n\nIn contrast, flash flooding happens very quickly and with a high-speed flow. This type of flood usually results from very heavy rainfall—such as a sudden, strong thunderstorm—where there is too much water for the ground to soak up. The rushing water can turn streets into fast rivers and cause damage to bridges and buildings. Because flash floods happen with very little warning, they are often seen as the most dangerous type of flood. Therefore, staying aware of sudden changes in the weather is a key safety measure.\n\nCoastal flooding is caused by the ocean and is often linked to big storms like cyclones. A storm surge happens when strong winds and low pressure push a huge amount of sea water toward the coast. For instance, during a major storm, the surge can join with a high tide to break through sea walls and flood coastal towns. The salt water from the ocean can also cause long-term damage to buildings and local plants. Building strong sea walls and protecting natural areas like mangroves is vital for keeping these coastal regions safe.\n\nIn conclusion, flooding can happen in different ways depending on the environment. Whether it starts from rivers, sudden storms, or the ocean, the science of floods is a very important topic. Understanding these causes helps us build safer towns and improve how we act during emergencies.`,
        questions: [
            { q: "What does the text suggest is a key responsibility for people living near rivers?", a: "A. Building their own sea walls", b: "B. Monitoring gauges and following safety plans", c: "C. Stopping the rain from falling", d: "D. Moving to a different country" },
            { q: "Why might flash floods be described as the 'most dangerous' type of flood?", a: "A. Because they only happen in the ocean", b: "B. Because they happen with very little warning", c: "C. Because the water is always freezing cold", d: "D. Because they last for many months" },
            { q: "How does the text describe the relationship between storm surges and high tides?", a: "A. They never happen at the same time", b: "B. They can combine to cause more severe flooding", c: "C. Tides prevent storm surges from happening", d: "D. They are two names for the same thing" },
            { q: "What is the primary driver of coastal flooding according to the text?", a: "A. Melting snow in the mountains", b: "B. Overflowing river channels", c: "C. Oceanic factors and major weather systems", d: "D. Broken water pipes in the city" },
            { q: "What role do mangroves play in flood management?", a: "A. They increase the speed of the water", b: "B. They act as a natural area that helps protect the coast", c: "C. They provide food for the floodwaters", d: "D. They make the water more salty" },
            { q: "What can be inferred about the impact of salt water on coastal towns?", a: "A. It helps the plants grow faster", b: "B. It causes long-term damage to buildings and ecosystems", c: "C. It is easier to clean up than fresh water", d: "D. It has no effect on the environment" },
            { q: "What does 'discharge exceeds the capacity of its channel' mean in the context of riverine flooding?", a: "A. The river has run out of water", b: "B. The river has more water than it can hold", c: "C. The river is flowing backwards", d: "D. The river is getting deeper" },
            { q: "Why is studying the science of floods considered important for society?", a: "A. To help us build safer communities", b: "B. To make the rain stop falling", c: "C. To change the direction of the ocean", d: "D. To eliminate the need for emergency services" },
            { q: "What factor contributes to the rapid onset of a flash flood?", a: "A. Many days of light drizzle", b: "B. Extreme rainfall that the ground cannot absorb", c: "C. A slow increase in river levels", d: "D. The movement of tectonic plates" },
            { q: "Which type of flooding is most likely to affect land far away from the coast or major rivers?", a: "A. Coastal flooding", b: "B. Riverine flooding", c: "C. Flash flooding", d: "D. Tidal flooding" },
            { q: "What is the result of persistent precipitation in a drainage basin?", a: "A. The soil becomes dry and cracked", b: "B. The ground becomes saturated, increasing runoff", c: "C. The river level stays exactly the same", d: "D. The ocean level begins to drop" },
            { q: "How do low-pressure cells influence coastal flooding?", a: "A. They push sea water toward the shoreline", b: "B. They cause the sun to shine brighter", c: "C. They prevent waves from forming", d: "D. They reduce the height of the tides" },
            { q: "What is the primary difference between riverine and flash flooding mentioned in the text?", a: "A. The temperature of the water", b: "B. The speed at which they occur", c: "C. The color of the floodwater", d: "D. The amount of salt in the water" },
            { q: "Based on the conclusion, what is the best way to safeguard communities?", a: "A. Ignoring weather data", b: "B. Continuous monitoring of environmental data", c: "C. Moving all cities to the mountains", d: "D. Building more roads in floodplains" },
            { q: "What does the term 'inundation' most likely mean in this text?", a: "A. A period of extreme drought", b: "B. The covering of land with water", c: "C. The cleaning of a river bed", d: "D. The building of a new bridge" },
            // Maths
            { q: "Calculate 124 x 3.", a: "A. 362", b: "B. 372", c: "C. 382", d: "D. 392" },
            { q: "What is 215 multiplied by 4?", a: "A. 840", b: "B. 850", c: "C. 860", d: "D. 870" },
            { q: "Solve: 302 x 5.", a: "A. 1500", b: "B. 1510", c: "C. 1520", d: "D. 1530" },
            { q: "Find the product of 148 and 2.", a: "A. 286", b: "B. 296", c: "C. 306", d: "D. 316" },
            { q: "What is 411 x 6?", a: "A. 2466", b: "B. 2476", c: "C. 2486", d: "D. 2496" },
            { q: "Multiply 135 by 7.", a: "A. 935", b: "B. 945", c: "C. 955", d: "D. 965" },
            { q: "Solve: 250 x 3.", a: "A. 650", b: "B. 700", c: "C. 750", d: "D. 800" },
            { q: "What is 108 x 9?", a: "A. 962", b: "B. 972", c: "C. 982", d: "D. 992" },
            { q: "Calculate 321 x 4.", a: "A. 1284", b: "B. 1294", c: "C. 1304", d: "D. 1314" },
            { q: "Find the total of 115 groups of 8.", a: "A. 910", b: "B. 920", c: "C. 930", d: "D. 940" },
            { q: "Multiply 405 by 2.", a: "A. 800", b: "B. 810", c: "C. 820", d: "D. 830" },
            { q: "What is 222 x 3?", a: "A. 646", b: "B. 656", c: "C. 666", d: "D. 676" },
            { q: "Solve: 156 x 4.", a: "A. 614", b: "B. 624", c: "C. 634", d: "D. 644" },
            { q: "Find the product of 333 and 3.", a: "A. 989", b: "B. 999", c: "C. 1009", d: "D. 1019" },
            { q: "What is 102 x 7?", a: "A. 704", b: "B. 714", c: "C. 724", d: "D. 734" }
        ]
    },
    Blue: {
        text: `The Science of Flooding\n\nFlooding is a natural event that happens when water overflows onto dry land. While floods are part of the Earth's natural cycle, they can be dangerous and cause damage to buildings and roads. Understanding the different types of flooding helps us prepare for bad weather.\n\nRiverine flooding, or river flooding, happens when a river cannot hold any more water. For example, heavy rain in the mountains may flow into a river for several days. This causes the water level to rise until it spills over the riverbanks. The water then flows onto the flat plains nearby. This means that homes located in low areas are at risk of getting wet. People living near rivers must watch for flood warnings when it rains.\n\nFlash flooding is a very sudden type of flood that happens without much warning. A large amount of rain falls during a big storm in a very short time. This heavy rainfall causes water to collect and rush through streets like a powerful river. Because flash floods happen so quickly, they are often the most dangerous type of flood. It is important to stay away from storm drains and low bridges during heavy rain.\n\nCoastal flooding occurs along the edges of the ocean. Strong winds from storms push a large wall of sea water onto the land. This is called a storm surge. For instance, during a cyclone, high tides and big waves can flood coastal roads. This salt water can damage plants and buildings near the beach. Towns on the coast must have strong walls and plans to stay safe.\n\nIn conclusion, flooding comes in many forms depending on where you live. Whether it is river, flash, or coastal flooding, water is very strong. Learning the science behind these events helps us build safer towns. Always check the weather to stay prepared for rising waters.`,
        questions: [
            { q: "What happens to the ground during a flood?", a: "A. It becomes dry", b: "B. It gets covered in water", c: "C. It turns into sand", d: "D. It gets very hot" },
            { q: "Why is it important to understand the different types of flooding?", a: "A. To help us prepare for bad weather", b: "B. To make it stop raining", c: "C. To change the color of the water", d: "D. To stop the wind from blowing" },
            { q: "What causes a river to overflow its banks?", a: "A. Too many boats", b: "B. Prolonged heavy rain", c: "C. The sun shining too bright", d: "D. Wind blowing from the north" },
            { q: "Where does the water go when it spills over the riverbanks?", a: "A. Into the mountains", b: "B. Onto the flat plains nearby", c: "C. Into the clouds", d: "D. To the moon" },
            { q: "What should people living near rivers do when it rains?", a: "A. Watch for flood warnings", b: "B. Go swimming in the river", c: "C. Build a new house", d: "D. Ignore the news" },
            { q: "How much warning do people usually have before a flash flood?", a: "A. Several days", b: "B. Very little warning", c: "C. One month", d: "D. Exactly one hour" },
            { q: "What causes water to rush through streets like a river during a flash flood?", a: "A. A small leaky pipe", b: "B. Heavy rainfall in a short time", c: "C. The ocean tides", d: "D. Melting ice cubes" },
            { q: "Why are flash floods considered very dangerous?", a: "A. Because they happen so quickly", b: "B. Because they are always freezing", c: "C. Because they only happen at night", d: "D. Because they are very slow" },
            { q: "Where should you stay away from during heavy storms?", a: "A. High ground", b: "B. Storm drains and low bridges", c: "C. The living room", d: "D. Your bed" },
            { q: "What is a 'storm surge'?", a: "A. A very fast river", b: "B. A wall of sea water pushed onto land", c: "C. A type of cloud", d: "D. A heavy rainfall" },
            { q: "What can push sea water onto the land during a coastal flood?", a: "A. Strong winds", b: "B. Many people jumping in the ocean", c: "C. The heat from the sun", d: "D. Small fish" },
            { q: "What can be damaged by salt water in coastal areas?", a: "A. Only the sand", b: "B. Plants and buildings", c: "C. The clouds", d: "D. Nothing at all" },
            { q: "How can towns on the coast prepare for flooding?", a: "A. By moving the ocean", b: "B. By building strong walls and having plans", c: "C. By staying at the beach", d: "D. By doing nothing" },
            { q: "What helps us stay prepared for rising waters?", a: "A. Ignoring the forecast", b: "B. Checking the weather forecast", c: "C. Sleeping all day", d: "D. Playing outside in the rain" },
            { q: "Is flooding a part of the Earth's natural cycle?", a: "A. Yes", b: "B. No", c: "C. Only in summer", d: "D. Only in winter" },
            // Maths
            { q: "Calculate 112 x 4.", a: "A. 438", b: "B. 448", c: "C. 458", d: "D. 468" },
            { q: "What is 203 multiplied by 3?", a: "A. 606", b: "B. 609", c: "C. 612", d: "D. 615" },
            { q: "Solve: 125 x 2.", a: "A. 240", b: "B. 250", c: "C. 260", d: "D. 270" },
            { q: "Find the product of 310 and 3.", a: "A. 910", b: "B. 920", c: "C. 930", d: "D. 940" },
            { q: "What is 402 x 2?", a: "A. 804", b: "B. 806", c: "C. 808", d: "D. 810" },
            { q: "Multiply 111 by 5.", a: "A. 545", b: "B. 555", c: "C. 565", d: "D. 575" },
            { q: "Solve: 210 x 4.", a: "A. 820", b: "B. 840", c: "C. 860", d: "D. 880" },
            { q: "What is 105 x 6?", a: "A. 620", b: "B. 630", c: "C. 640", d: "D. 650" },
            { q: "Calculate 300 x 3.", a: "A. 800", b: "B. 900", c: "C. 1000", d: "D. 1100" },
            { q: "Find the total of 120 groups of 4.", a: "A. 460", b: "B. 480", c: "C. 500", d: "D. 520" },
            { q: "Multiply 201 by 4.", a: "A. 802", b: "B. 804", c: "C. 806", d: "D. 808" },
            { q: "What is 113 x 2?", a: "A. 226", b: "B. 236", c: "C. 246", d: "D. 256" },
            { q: "Solve: 320 x 2.", a: "A. 620", b: "B. 640", c: "C. 660", d: "D. 680" },
            { q: "Find the product of 101 and 8.", a: "A. 806", b: "B. 808", c: "C. 810", d: "D. 812" },
            { q: "What is 110 x 5?", a: "A. 540", b: "B. 550", c: "C. 560", d: "D. 570" }
        ]
    },
    Green: {
        text: `The Science of Flooding\n\nFloods happen when there is too much water on the land. This water covers the ground. Flooding can be very dangerous. It is important to know why floods happen. This helps us stay safe.\n\nRiver floods happen when a river is too full. For example, heavy rain falls for many days. This extra water spills over the banks. This means houses near the water might get wet. We must watch the river when it rains a lot.\n\nFlash floods happen very fast. A huge amount of rain falls in a short time. This causes water to rush down the streets. It looks like a fast river. This happens quickly so we must move fast. Do not play in the rain.\n\nCoastal floods happen near the beach. Strong winds push the sea water onto the land. This often happens during a big storm. The salt water can flood shops near the coast. We should stay away from the beach during storms.\n\nFlooding has many causes. Water can be very powerful. Learning about floods helps us get ready. Always listen to the news to stay safe.`,
        questions: [
            { q: "What covers the ground during a flood?", a: "A. Water", b: "B. Snow", c: "C. Dirt", d: "D. Flowers" },
            { q: "Is flooding dangerous?", a: "A. Yes", b: "B. No", c: "C. Only in the sun", d: "D. Only on the moon" },
            { q: "Why should we learn about floods?", a: "A. To stay safe", b: "B. To get wet", c: "C. To go swimming", d: "D. To play outside" },
            { q: "When do river floods happen?", a: "A. When a river is too full", b: "B. When a river is empty", c: "C. In the desert", d: "D. On the road" },
            { q: "What can cause a river to spill over its banks?", a: "A. Heavy rain for many days", b: "B. Small clouds", c: "C. The stars", d: "D. A bird" },
            { q: "What might get wet near a river?", a: "A. Houses", b: "B. Planes", c: "C. The sun", d: "D. Spaceships" },
            { q: "How fast do flash floods happen?", a: "A. Very fast", b: "B. Very slow", c: "C. Over one year", d: "D. They never happen" },
            { q: "What does a flash flood look like in the street?", a: "A. A fast river", b: "B. A small puddle", c: "C. A garden", d: "D. A playground" },
            { q: "Should you play in the rain during a storm?", a: "A. No", b: "B. Yes", c: "C. Only with a ball", d: "D. Only with friends" },
            { q: "Where do coastal floods happen?", a: "A. Near the beach", b: "B. In the forest", c: "C. On a mountain", d: "D. In a cave" },
            { q: "What pushes sea water onto the land?", a: "A. Strong winds", b: "B. Many fish", c: "C. The sand", d: "D. Boats" },
            { q: "When do coastal floods often happen?", a: "A. During a big storm", b: "B. When it is sunny", c: "C. At lunch time", d: "D. On your birthday" },
            { q: "What can get flooded near the coast?", a: "A. Shops", b: "B. Clouds", c: "C. The moon", d: "D. Stars" },
            { q: "What should you listen to for flood news?", a: "A. The news", b: "B. A toy", c: "C. A song", d: "D. A cat" },
            { q: "Is water powerful?", a: "A. Yes", b: "B. No", c: "C. Only in a glass", d: "D. Only in a bath" },
            // Maths
            { q: "Calculate 12 x 3.", a: "A. 34", b: "B. 36", c: "C. 38", d: "D. 40" },
            { q: "What is 21 x 4?", a: "A. 82", b: "B. 84", c: "C. 86", d: "D. 88" },
            { q: "Solve: 10 x 5.", a: "A. 40", b: "B. 50", c: "C. 60", d: "D. 70" },
            { q: "Find the product of 11 and 6.", a: "A. 62", b: "B. 66", c: "C. 70", d: "D. 74" },
            { q: "What is 20 x 3?", a: "A. 50", b: "B. 60", c: "C. 70", d: "D. 80" },
            { q: "Multiply 13 by 2.", a: "A. 24", b: "B. 26", c: "C. 28", d: "D. 30" },
            { q: "Solve: 31 x 3.", a: "A. 90", b: "B. 93", c: "C. 96", d: "D. 99" },
            { q: "What is 44 x 2?", a: "A. 84", b: "B. 88", c: "C. 92", d: "D. 96" },
            { q: "Calculate 10 x 9.", a: "A. 80", b: "B. 90", c: "C. 100", d: "D. 110" },
            { q: "Find the total of 15 groups of 2.", a: "A. 25", b: "B. 30", c: "C. 35", d: "D. 40" },
            { q: "Multiply 11 by 8.", a: "A. 80", b: "B. 88", c: "C. 96", d: "D. 104" },
            { q: "What is 22 x 4?", a: "A. 84", b: "B. 88", c: "C. 92", d: "D. 96" },
            { q: "Solve: 30 x 2.", a: "A. 50", b: "B. 60", c: "C. 70", d: "D. 80" },
            { q: "Find the product of 12 and 4.", a: "A. 44", b: "B. 48", c: "C. 52", d: "D. 56" },
            { q: "What is 14 x 2?", a: "A. 24", b: "B. 28", c: "C. 32", d: "D. 36" }
        ]
    }
};

async function generatePrintDoc(level, groupData) {
    const children = [];
    const colWidth = 4680; // half of 9360

    // Title
    children.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 240 },
        children: [new TextRun({ text: `Week ${weekNum} Homework — ${topic}`, bold: true, size: 28, font: "Arial" })]
    }));

    // Reading Text
    groupData.text.split('\n\n').forEach(para => {
        children.push(new Paragraph({
            spacing: { after: 140 },
            lineSpacing: { before: 0, after: 0, line: Math.round(12 * 20 * 1.3), lineRule: 'auto' },
            children: [new TextRun({ text: para, size: 24, font: "Arial" })]
        }));
    });

    // Reading Questions (1-15)
    for (let i = 0; i < 15; i++) {
        const q = groupData.questions[i];
        children.push(new Paragraph({
            spacing: { before: 80, after: 20 },
            children: [new TextRun({ text: `${i + 1}. ${q.q}`, bold: true, size: 20, font: "Arial" })]
        }));
        children.push(new Paragraph({
            tabStops: [{ type: TabStopType.LEFT, position: TabStopPosition.MAX / 2 }],
            spacing: { after: 20 },
            children: [
                new TextRun({ text: q.a, size: 20, font: "Arial" }),
                new TextRun({ text: `\t${q.b}`, size: 20, font: "Arial" })
            ]
        }));
        children.push(new Paragraph({
            tabStops: [{ type: TabStopType.LEFT, position: TabStopPosition.MAX / 2 }],
            spacing: { after: 80 },
            border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'BBBBBB', space: 4 } },
            children: [
                new TextRun({ text: q.c, size: 20, font: "Arial" }),
                new TextRun({ text: `\t${q.d}`, size: 20, font: "Arial" })
            ]
        }));
    }

    // Maths Questions (16-30) in Two Columns
    const leftQ = groupData.questions.slice(15, 23);
    const rightQ = groupData.questions.slice(23, 30);

    const createMathCell = (qList, startIndex) => {
        return new TableCell({
            width: { size: colWidth, type: WidthType.DXA },
            borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
            children: qList.map((q, idx) => {
                const qNum = startIndex + idx;
                return [
                    new Paragraph({
                        spacing: { before: 80, after: 20 },
                        children: [new TextRun({ text: `${qNum}. ${q.q}`, bold: true, size: 20, font: "Arial" })]
                    }),
                    new Paragraph({
                        tabStops: [{ type: TabStopType.LEFT, position: colWidth / 2 }],
                        spacing: { after: 20 },
                        children: [
                            new TextRun({ text: q.a, size: 20, font: "Arial" }),
                            new TextRun({ text: `\t${q.b}`, size: 20, font: "Arial" })
                        ]
                    }),
                    new Paragraph({
                        tabStops: [{ type: TabStopType.LEFT, position: colWidth / 2 }],
                        spacing: { after: 80 },
                        border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'BBBBBB', space: 4 } },
                        children: [
                            new TextRun({ text: q.c, size: 20, font: "Arial" }),
                            new TextRun({ text: `\t${q.d}`, size: 20, font: "Arial" })
                        ]
                    })
                ];
            }).flat()
        });
    };

    children.push(new Table({
        columnWidths: [colWidth, colWidth],
        rows: [
            new TableRow({
                children: [
                    createMathCell(leftQ, 16),
                    createMathCell(rightQ, 24)
                ]
            })
        ]
    }));

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
            children: children
        }]
    });

    const buffer = await Packer.toBuffer(doc);
    const fileName = path.join(outputDir, `Week_${weekNum}_Print_${level}.docx`);
    fs.writeFileSync(fileName, buffer);
    console.log(`Created ${fileName}`);
}

(async () => {
    for (const level in data) {
        await generatePrintDoc(level, data[level]);
    }
})();
