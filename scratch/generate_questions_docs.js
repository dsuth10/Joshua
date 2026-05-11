const { Document, Packer, Paragraph, TextRun, AlignmentType, LevelFormat } = require('docx');
const fs = require('fs');
const path = require('path');

const weekNum = "04";
const outputDir = path.join("Homework", `Week_04`);

// Questions for each level
const questions = {
    Red: [
        // Reading (Inference)
        { q: "What does the text suggest is a key responsibility for people living near rivers?", a: "A. Building their own sea walls", b: "B. Monitoring gauges and following safety plans", c: "C. Stopping the rain from falling", d: "D. Moving to a different country", ans: "B" },
        { q: "Why might flash floods be described as the 'most dangerous' type of flood?", a: "A. Because they only happen in the ocean", b: "B. Because they happen with very little warning", c: "C. Because the water is always freezing cold", d: "D. Because they last for many months", ans: "B" },
        { q: "How does the text describe the relationship between storm surges and high tides?", a: "A. They never happen at the same time", b: "B. They can combine to cause more severe flooding", c: "C. Tides prevent storm surges from happening", d: "D. They are two names for the same thing", ans: "B" },
        { q: "What is the primary driver of coastal flooding according to the text?", a: "A. Melting snow in the mountains", b: "B. Overflowing river channels", c: "C. Oceanic factors and major weather systems", d: "D. Broken water pipes in the city", ans: "C" },
        { q: "What role do mangroves play in flood management?", a: "A. They increase the speed of the water", b: "B. They act as a natural area that helps protect the coast", c: "C. They provide food for the floodwaters", d: "D. They make the water more salty", ans: "B" },
        { q: "What can be inferred about the impact of salt water on coastal towns?", a: "A. It helps the plants grow faster", b: "B. It causes long-term damage to buildings and ecosystems", c: "C. It is easier to clean up than fresh water", d: "D. It has no effect on the environment", ans: "B" },
        { q: "What does 'discharge exceeds the capacity of its channel' mean in the context of riverine flooding?", a: "A. The river has run out of water", b: "B. The river has more water than it can hold", c: "C. The river is flowing backwards", d: "D. The river is getting deeper", ans: "B" },
        { q: "Why is studying the science of floods considered important for society?", a: "A. To help us build safer communities", b: "B. To make the rain stop falling", c: "C. To change the direction of the ocean", d: "D. To eliminate the need for emergency services", ans: "A" },
        { q: "What factor contributes to the rapid onset of a flash flood?", a: "A. Many days of light drizzle", b: "B. Extreme rainfall that the ground cannot absorb", c: "C. A slow increase in river levels", d: "D. The movement of tectonic plates", ans: "B" },
        { q: "Which type of flooding is most likely to affect land far away from the coast or major rivers?", a: "A. Coastal flooding", b: "B. Riverine flooding", c: "C. Flash flooding", d: "D. Tidal flooding", ans: "C" },
        { q: "What is the result of persistent precipitation in a drainage basin?", a: "A. The soil becomes dry and cracked", b: "B. The ground becomes saturated, increasing runoff", c: "C. The river level stays exactly the same", d: "D. The ocean level begins to drop", ans: "B" },
        { q: "How do low-pressure cells influence coastal flooding?", a: "A. They push sea water toward the shoreline", b: "B. They cause the sun to shine brighter", c: "C. They prevent waves from forming", d: "D. They reduce the height of the tides", ans: "A" },
        { q: "What is the primary difference between riverine and flash flooding mentioned in the text?", a: "A. The temperature of the water", b: "B. The speed at which they occur", c: "C. The color of the floodwater", d: "D. The amount of salt in the water", ans: "B" },
        { q: "Based on the conclusion, what is the best way to safeguard communities?", a: "A. Ignoring weather data", b: "B. Continuous monitoring of environmental data", c: "C. Moving all cities to the mountains", d: "D. Building more roads in floodplains", ans: "B" },
        { q: "What does the term 'inundation' most likely mean in this text?", a: "A. A period of extreme drought", b: "B. The covering of land with water", c: "C. The cleaning of a river bed", d: "D. The building of a new bridge", ans: "B" },
        // Maths (3-digit by 1-digit)
        { q: "Calculate 124 x 3.", a: "A. 362", b: "B. 372", c: "C. 382", d: "D. 392", ans: "B" },
        { q: "What is 215 multiplied by 4?", a: "A. 840", b: "B. 850", c: "C. 860", d: "D. 870", ans: "C" },
        { q: "Solve: 302 x 5.", a: "A. 1500", b: "B. 1510", c: "C. 1520", d: "D. 1530", ans: "B" },
        { q: "Find the product of 148 and 2.", a: "A. 286", b: "B. 296", c: "C. 306", d: "D. 316", ans: "B" },
        { q: "What is 411 x 6?", a: "A. 2466", b: "B. 2476", c: "C. 2486", d: "D. 2496", ans: "A" },
        { q: "Multiply 135 by 7.", a: "A. 935", b: "B. 945", c: "C. 955", d: "D. 965", ans: "B" },
        { q: "Solve: 250 x 3.", a: "A. 650", b: "B. 700", c: "C. 750", d: "D. 800", ans: "C" },
        { q: "What is 108 x 9?", a: "A. 962", b: "B. 972", c: "C. 982", d: "D. 992", ans: "B" },
        { q: "Calculate 321 x 4.", a: "A. 1284", b: "B. 1294", c: "C. 1304", d: "D. 1314", ans: "A" },
        { q: "Find the total of 115 groups of 8.", a: "A. 910", b: "B. 920", c: "C. 930", d: "D. 940", ans: "B" },
        { q: "Multiply 405 by 2.", a: "A. 800", b: "B. 810", c: "C. 820", d: "D. 830", ans: "B" },
        { q: "What is 222 x 3?", a: "A. 646", b: "B. 656", c: "C. 666", d: "D. 676", ans: "C" },
        { q: "Solve: 156 x 4.", a: "A. 614", b: "B. 624", c: "C. 634", d: "D. 644", ans: "B" },
        { q: "Find the product of 333 and 3.", a: "A. 989", b: "B. 999", c: "C. 1009", d: "D. 1019", ans: "B" },
        { q: "What is 102 x 7?", a: "A. 704", b: "B. 714", c: "C. 724", d: "D. 734", ans: "B" }
    ],
    Blue: [
        // Reading (Mix)
        { q: "What happens to the ground during a flood?", a: "A. It becomes dry", b: "B. It gets covered in water", c: "C. It turns into sand", d: "D. It gets very hot", ans: "B" },
        { q: "Why is it important to understand the different types of flooding?", a: "A. To help us prepare for bad weather", b: "B. To make it stop raining", c: "C. To change the color of the water", d: "D. To stop the wind from blowing", ans: "A" },
        { q: "What causes a river to overflow its banks?", a: "A. Too many boats", b: "B. Prolonged heavy rain", c: "C. The sun shining too bright", d: "D. Wind blowing from the north", ans: "B" },
        { q: "Where does the water go when it spills over the riverbanks?", a: "A. Into the mountains", b: "B. Onto the flat plains nearby", c: "C. Into the clouds", d: "D. To the moon", ans: "B" },
        { q: "What should people living near rivers do when it rains?", a: "A. Watch for flood warnings", b: "B. Go swimming in the river", c: "C. Build a new house", d: "D. Ignore the news", ans: "A" },
        { q: "How much warning do people usually have before a flash flood?", a: "A. Several days", b: "B. Very little warning", c: "C. One month", d: "D. Exactly one hour", ans: "B" },
        { q: "What causes water to rush through streets like a river during a flash flood?", a: "A. A small leaky pipe", b: "B. Heavy rainfall in a short time", c: "C. The ocean tides", d: "D. Melting ice cubes", ans: "B" },
        { q: "Why are flash floods considered very dangerous?", a: "A. Because they happen so quickly", b: "B. Because they are always freezing", c: "C. Because they only happen at night", d: "D. Because they are very slow", ans: "A" },
        { q: "Where should you stay away from during heavy storms?", a: "A. High ground", b: "B. Storm drains and low bridges", c: "C. The living room", d: "D. Your bed", ans: "B" },
        { q: "What is a 'storm surge'?", a: "A. A very fast river", b: "B. A wall of sea water pushed onto land", c: "C. A type of cloud", d: "D. A heavy rainfall", ans: "B" },
        { q: "What can push sea water onto the land during a coastal flood?", a: "A. Strong winds", b: "B. Many people jumping in the ocean", c: "C. The heat from the sun", d: "D. Small fish", ans: "A" },
        { q: "What can be damaged by salt water in coastal areas?", a: "A. Only the sand", b: "B. Plants and buildings", c: "C. The clouds", d: "D. Nothing at all", ans: "B" },
        { q: "How can towns on the coast prepare for flooding?", a: "A. By moving the ocean", b: "B. By building strong walls and having plans", c: "C. By staying at the beach", d: "D. By doing nothing", ans: "B" },
        { q: "What helps us stay prepared for rising waters?", a: "A. Ignoring the forecast", b: "B. Checking the weather forecast", c: "C. Sleeping all day", d: "D. Playing outside in the rain", ans: "B" },
        { q: "Is flooding a part of the Earth's natural cycle?", a: "A. Yes", b: "B. No", c: "C. Only in summer", d: "D. Only in winter", ans: "A" },
        // Maths (3-digit by 1-digit)
        { q: "Calculate 112 x 4.", a: "A. 438", b: "B. 448", c: "C. 458", d: "D. 468", ans: "B" },
        { q: "What is 203 multiplied by 3?", a: "A. 606", b: "B. 609", c: "C. 612", d: "D. 615", ans: "B" },
        { q: "Solve: 125 x 2.", a: "A. 240", b: "B. 250", c: "C. 260", d: "D. 270", ans: "B" },
        { q: "Find the product of 310 and 3.", a: "A. 910", b: "B. 920", c: "C. 930", d: "D. 940", ans: "C" },
        { q: "What is 402 x 2?", a: "A. 804", b: "B. 806", c: "C. 808", d: "D. 810", ans: "A" },
        { q: "Multiply 111 by 5.", a: "A. 545", b: "B. 555", c: "C. 565", d: "D. 575", ans: "B" },
        { q: "Solve: 210 x 4.", a: "A. 820", b: "B. 840", c: "C. 860", d: "D. 880", ans: "B" },
        { q: "What is 105 x 6?", a: "A. 620", b: "B. 630", c: "C. 640", d: "D. 650", ans: "B" },
        { q: "Calculate 300 x 3.", a: "A. 800", b: "B. 900", c: "C. 1000", d: "D. 1100", ans: "B" },
        { q: "Find the total of 120 groups of 4.", a: "A. 460", b: "B. 480", c: "C. 500", d: "D. 520", ans: "B" },
        { q: "Multiply 201 by 4.", a: "A. 802", b: "B. 804", c: "C. 806", d: "D. 808", ans: "B" },
        { q: "What is 113 x 2?", a: "A. 226", b: "B. 236", c: "C. 246", d: "D. 256", ans: "A" },
        { q: "Solve: 320 x 2.", a: "A. 620", b: "B. 640", c: "C. 660", d: "D. 680", ans: "B" },
        { q: "Find the product of 101 and 8.", a: "A. 806", b: "B. 808", c: "C. 810", d: "D. 812", ans: "B" },
        { q: "What is 110 x 5?", a: "A. 540", b: "B. 550", c: "C. 560", d: "D. 570", ans: "B" }
    ],
    Green: [
        // Reading (Literal)
        { q: "What covers the ground during a flood?", a: "A. Snow", b: "B. Water", c: "C. Dirt", d: "D. Flowers", ans: "B" },
        { q: "Is flooding dangerous?", a: "A. Yes", b: "B. No", c: "C. Only in the sun", d: "D. Only on the moon", ans: "A" },
        { q: "Why should we learn about floods?", a: "A. To get wet", b: "B. To stay safe", c: "C. To go swimming", d: "D. To play outside", ans: "B" },
        { q: "When do river floods happen?", a: "A. When a river is too full", b: "B. When a river is empty", c: "C. In the desert", d: "D. On the road", ans: "A" },
        { q: "What can cause a river to spill over its banks?", a: "A. Small clouds", b: "B. Heavy rain for many days", c: "C. The stars", d: "D. A bird", ans: "B" },
        { q: "What might get wet near a river?", a: "A. Planes", b: "B. Houses", c: "C. The sun", d: "D. Spaceships", ans: "B" },
        { q: "How fast do flash floods happen?", a: "A. Very slow", b: "B. Very fast", c: "C. Over one year", d: "D. They never happen", ans: "B" },
        { q: "What does a flash flood look like in the street?", a: "A. A small puddle", b: "B. A fast river", c: "C. A garden", d: "D. A playground", ans: "B" },
        { q: "Should you play in the rain during a storm?", a: "A. Yes", b: "B. No", c: "C. Only with a ball", d: "D. Only with friends", ans: "B" },
        { q: "Where do coastal floods happen?", a: "A. In the forest", b: "B. Near the beach", c: "C. On a mountain", d: "D. In a cave", ans: "B" },
        { q: "What pushes sea water onto the land?", a: "A. Strong winds", b: "B. Many fish", c: "C. The sand", d: "D. Boats", ans: "A" },
        { q: "When do coastal floods often happen?", a: "A. During a big storm", b: "B. When it is sunny", c: "C. At lunch time", d: "D. On your birthday", ans: "A" },
        { q: "What can get flooded near the coast?", a: "A. Clouds", b: "B. Shops", c: "C. The moon", d: "D. Stars", ans: "B" },
        { q: "What should you listen to for flood news?", a: "A. A toy", b: "B. The news", c: "C. A song", d: "D. A cat", ans: "B" },
        { q: "Is water powerful?", a: "A. Yes", b: "B. No", c: "C. Only in a glass", d: "D. Only in a bath", ans: "A" },
        // Maths (2-digit by 1-digit)
        { q: "Calculate 12 x 3.", a: "A. 34", b: "B. 36", c: "C. 38", d: "D. 40", ans: "B" },
        { q: "What is 21 x 4?", a: "A. 82", b: "B. 84", c: "C. 86", d: "D. 88", ans: "B" },
        { q: "Solve: 10 x 5.", a: "A. 40", b: "B. 50", c: "C. 60", d: "D. 70", ans: "B" },
        { q: "Find the product of 11 and 6.", a: "A. 62", b: "B. 66", c: "C. 70", d: "D. 74", ans: "B" },
        { q: "What is 20 x 3?", a: "A. 50", b: "B. 60", c: "C. 70", d: "D. 80", ans: "B" },
        { q: "Multiply 13 by 2.", a: "A. 24", b: "B. 26", c: "C. 28", d: "D. 30", ans: "B" },
        { q: "Solve: 31 x 3.", a: "A. 90", b: "B. 93", c: "C. 96", d: "D. 99", ans: "B" },
        { q: "What is 44 x 2?", a: "A. 84", b: "B. 88", c: "C. 92", d: "D. 96", ans: "B" },
        { q: "Calculate 10 x 9.", a: "A. 80", b: "B. 90", c: "C. 100", d: "D. 110", ans: "B" },
        { q: "Find the total of 15 groups of 2.", a: "A. 25", b: "B. 30", c: "C. 35", d: "D. 40", ans: "B" },
        { q: "Multiply 11 by 8.", a: "A. 80", b: "B. 88", c: "C. 96", d: "D. 104", ans: "B" },
        { q: "What is 22 x 4?", a: "A. 84", b: "B. 88", c: "C. 92", d: "D. 96", ans: "B" },
        { q: "Solve: 30 x 2.", a: "A. 50", b: "B. 60", c: "C. 70", d: "D. 80", ans: "B" },
        { q: "Find the product of 12 and 4.", a: "A. 44", b: "B. 48", c: "C. 52", d: "D. 56", ans: "B" },
        { q: "What is 14 x 2?", a: "A. 24", b: "B. 28", c: "C. 32", d: "D. 36", ans: "B" }
    ]
};

async function generateQuestionsDoc(level, qSet) {
    const children = [];

    qSet.forEach((item, index) => {
        children.push(new Paragraph({
            spacing: { before: 240, after: 0 },
            children: [new TextRun({ text: `${index + 1}. ${item.q}`, size: 24, font: "Arial" })]
        }));
        children.push(new Paragraph({ children: [new TextRun({ text: item.a, size: 24, font: "Arial" })] }));
        children.push(new Paragraph({ children: [new TextRun({ text: item.b, size: 24, font: "Arial" })] }));
        children.push(new Paragraph({ children: [new TextRun({ text: item.c, size: 24, font: "Arial" })] }));
        children.push(new Paragraph({ children: [new TextRun({ text: item.d, size: 24, font: "Arial" })] }));
        children.push(new Paragraph({ children: [new TextRun({ text: `ANSWER: ${item.ans}`, size: 24, font: "Arial" })] }));
        children.push(new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: `POINT: 1`, size: 24, font: "Arial" })] }));
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
            children: children
        }]
    });

    const buffer = await Packer.toBuffer(doc);
    const fileName = path.join(outputDir, `Week_${weekNum}_Questions_${level}.docx`);
    fs.writeFileSync(fileName, buffer);
    console.log(`Created ${fileName}`);
}

(async () => {
    for (const level in questions) {
        await generateQuestionsDoc(level, questions[level]);
    }
})();
