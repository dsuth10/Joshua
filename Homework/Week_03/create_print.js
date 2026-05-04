const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType, WidthType, BorderStyle, TabStopType } = require('docx');
const fs = require('fs');
const path = require('path');

const OUT = __dirname;
const WEEK = "03";
const TITLE = "When the River Rose: The 2011 Brisbane Floods";

// --- CONTENT DATA ---

const RED_TEXT = [
    "In January 2011, major flooding hit south-east Queensland. It was one of Australia's worst natural disasters. Homes, businesses, and roads were damaged across the region.",
    "The floods had been building for months. A La Niña weather pattern had brought heavy rain to Queensland throughout late 2010. By January 2011, the soil was completely saturated. When more rain fell, it ran straight into rivers and creeks instead of soaking into the ground.",
    "Wivenhoe Dam had been built after the 1974 Brisbane floods to help reduce flood risk. But during the 2011 event, the dam filled to capacity. Engineers had to release large volumes of water to protect the dam. These releases raised levels further downstream in the Brisbane River.",
    "The river peaked at 4.46 metres at the City Gauge. About 26,600 homes and 5,000 businesses were inundated. Riverside suburbs like Rocklea and Oxley were among the hardest hit. Water stayed in some streets for several days before receding.",
    "Thirty-three people died across Queensland during the floods. Thousands more were forced to leave their homes. Once the water fell, a massive clean-up began. Tens of thousands of volunteers joined what became known as the \"Mud Army.\" They helped affected residents remove debris and start rebuilding.",
    "After the 2011 floods, a government inquiry examined the event. Improvements were made to flood mapping, dam operations, and emergency planning. These changes aimed to better protect communities from future flood events."
];

const BLUE_TEXT = [
    "In January 2011, the Brisbane River flooded and caused damage across south-east Queensland. Thousands of homes and businesses were affected. It was one of the worst floods in Queensland's history.",
    "The flooding had been building for months. A weather pattern called La Niña brought heavy rainfall to Queensland during late 2010. By early January 2011, the ground was completely full of water. When more rain fell, it ran quickly into rivers and creeks instead of soaking into the soil.",
    "Wivenhoe Dam had been built after the 1974 Brisbane floods to help protect the city. In January 2011, the dam filled up very quickly. To keep the dam safe, engineers had to release large amounts of water. These releases made the Brisbane River rise even higher.",
    "At its highest point, the Brisbane River reached 4.46 metres at the City Gauge. This was enough to flood around 26,600 homes and 5,000 businesses. Suburbs along the river, including Rocklea and Oxley, were among the worst affected areas. Floodwater stayed in many streets for several days before going down.",
    "Thirty-three people died across Queensland during the floods. Thousands of families had to leave their homes. When the water dropped, a large clean-up effort began. Tens of thousands of volunteers joined what became known as the \"Mud Army.\" They worked together to help people remove mud and debris from their homes.",
    "After the floods, the Queensland Government held an inquiry into the disaster. Improvements were then made to flood mapping, emergency planning, and the management of the dam."
];

const GREEN_TEXT = [
    "In January 2011, the Brisbane River flooded and caused a lot of damage. Many homes and businesses were underwater. It was one of the worst floods in Queensland's history.",
    "There had been a lot of rain for many months before the floods. The ground was already very wet. When more rain fell in January, the water had nowhere to go. It ran straight into the rivers and creeks.",
    "Brisbane had a big dam called Wivenhoe Dam. The dam was built to help stop floods. But in 2011, the dam got very full. Workers had to let water out of the dam to keep it safe. This made the river rise even more.",
    "The river reached 4.46 metres at the City Gauge. About 26,600 homes and 5,000 businesses were flooded. Many people had to leave their homes.",
    "Thirty-three people died in the floods across Queensland. Many more people lost everything they owned. After the water went away, thousands of volunteers came to help. They were called the \"Mud Army.\" They helped people clean up their homes and streets.",
    "After the floods, the government made new plans to keep people safer in the future."
];

const RED_COMP = [
    { q: "What caused the Brisbane River to flood in January 2011?", opts: ["A government decision to release dam water", "Heavy rainfall after months of above-average rain during a La Niña weather pattern", "A tropical cyclone called Wanda", "Storm surge from Moreton Bay"] },
    { q: "Why was the soil unable to absorb more water by January 2011?", opts: ["The soil was frozen solid", "It was already completely saturated from months of La Niña rainfall", "Construction in the area had covered the soil with concrete", "A drought had made the soil too hard to absorb water"] },
    { q: "Why was Wivenhoe Dam originally built?", opts: ["To supply drinking water to Ipswich", "To generate electricity for south-east Queensland", "To reduce the risk of flooding in Brisbane after the 1974 disaster", "To store water for irrigation on farms"] },
    { q: "What difficult decision did engineers face during the 2011 floods?", opts: ["Whether to warn residents or keep the situation quiet", "They had to release dam water to protect the dam, which worsened flooding downstream", "Whether to build a new dam or reinforce the existing one", "They had to choose which suburbs would be flooded first"] },
    { q: "How high did the Brisbane River reach at the City Gauge during the 2011 floods?", opts: ["5.45 metres", "8.35 metres", "4.46 metres", "3.85 metres"] },
    { q: "How many homes were inundated during the 2011 Brisbane floods?", opts: ["Approximately 26,600", "Approximately 18,000", "Approximately 26,600", "Approximately 38,000"] },
    { q: "How did the 2011 Brisbane River peak compare to the 1974 peak?", opts: ["It was higher than 1974 and caused more damage", "It was exactly the same as 1974", "It was lower than 1974 but still caused widespread inundation", "It was much lower than 1974 and barely damaged any homes"] },
    { q: "How many people died across Queensland during the flood sequence?", opts: ["Thirteen", "Twenty-two", "Thirty-three", "Forty-five"] },
    { q: "What was the \"Mud Army\"?", opts: ["A government agency that managed dam releases", "The name given to the floodwater that spread mud through suburbs", "Tens of thousands of volunteers who helped with the clean-up after the floods", "A special army unit deployed to rescue flood victims"] },
    { q: "What does the word \"inundated\" most likely mean in this text?", opts: ["Damaged by fire", "Flooded or covered with water", "Repaired by workers", "Evacuated by residents"] },
    { q: "Which two cities were specifically mentioned as having homes and businesses flooded?", opts: ["Brisbane and Cairns", "Brisbane and Ipswich", "Ipswich and Toowoomba", "Brisbane and the Gold Coast"] },
    { q: "What did the government do after the 2011 floods to prevent future disasters?", opts: ["Built a second dam upstream of Wivenhoe", "Launched an inquiry and made improvements to flood mapping and dam operations", "Relocated all riverside suburbs to higher ground", "Introduced new laws banning development near rivers"] },
    { q: "What does the text suggest was the main reason volunteers joined the clean-up effort?", opts: ["They were paid by the government to do so", "Community solidarity and a desire to help those affected", "They were ordered to help by emergency services", "They wanted to reclaim their own property"] },
    { q: "Which suburbs are named in the text as being among the hardest hit?", opts: ["Chelmer and Indooroopilly", "Rocklea and Oxley", "Toowong and Auchenflower", "Kenmore and Brookfield"] },
    { q: "What is the main purpose of this text?", opts: ["To persuade readers that dams should be removed", "To entertain readers with a story about a flood survivor", "To inform readers about the causes, impacts, and aftermath of the 2011 Brisbane floods", "To argue that Brisbane should not have been built on a floodplain"] }
];

const BLUE_COMP = [
    { q: "What caused the 2011 Brisbane floods?", opts: ["A storm surge from the Pacific Ocean", "Heavy rainfall during a La Niña weather pattern that had been building for months", "A massive earthquake under the Brisbane River", "Heavy snow melting on the Great Dividing Range"] },
    { q: "Why could the ground not absorb any more water by early January 2011?", opts: ["The ground had been covered with concrete", "A drought had cracked and hardened the soil", "It was completely saturated from months of heavy rainfall", "Frost had made the soil rock solid"] },
    { q: "What was Wivenhoe Dam built to do?", opts: ["To generate electricity for south-east Queensland", "To help protect Brisbane from future flooding after 1974", "To provide irrigation water for farms west of Brisbane", "To stop salt water from entering the river from the sea"] },
    { q: "Why did engineers release water from Wivenhoe Dam during the 2011 floods?", opts: ["To cool the dam walls during hot weather", "To make room for new water being pumped in from elsewhere", "To keep the dam structure safe as it was filling up very quickly", "To flush sediment from the bottom of the dam"] },
    { q: "How high did the Brisbane River rise at the City Gauge?", opts: ["5.45 metres", "4.46 metres", "3.85 metres", "6.60 metres"] },
    { q: "How many homes were flooded during the 2011 event?", opts: ["About 26,600", "About 18,000", "About 26,600", "About 38,000"] },
    { q: "Which suburbs are mentioned as being among the worst affected?", opts: ["Toowong, Auchenflower, and St Lucia", "Rocklea, Oxley, and Chelmer", "Indooroopilly, Kenmore, and Brookfield", "Fortitude Valley, Newstead, and Teneriffe"] },
    { q: "How many people died across Queensland during the floods?", opts: ["Thirteen", "Twenty-two", "Thirty-three", "Forty-eight"] },
    { q: "What did thousands of volunteers do after the floods?", opts: ["They rebuilt homes and businesses from scratch", "They helped affected residents remove mud and debris from their homes", "They worked around the clock to release water from the dam", "They delivered food and water to flood victims in shelters"] },
    { q: "What nickname was given to the volunteer clean-up group?", opts: ["The Flood Force", "The Mud Army", "The Clean Crew", "The Brisbane Brigade"] },
    { q: "What does the word \"displaced\" most likely mean in this text?", opts: ["Hurt or injured during the flood", "Forced to leave their homes and live somewhere else", "Given money to help with repairs", "Rescued by helicopter from rooftops"] },
    { q: "What did the Queensland Government do after the 2011 floods?", opts: ["Built another dam upstream", "Launched an inquiry and improved flood maps and dam management", "Moved all homes away from the river", "Blamed the dam engineers for the damage"] },
    { q: "What does the text say the floodwater became after it ran off the saturated ground?", opts: ["Steam that evaporated into the atmosphere", "Runoff that poured into rivers and creeks", "Groundwater that seeped slowly into the ocean", "Irrigation water used by nearby farms"] },
    { q: "Which earlier flood event is mentioned in the text?", opts: ["The 1893 Brisbane floods", "The 1974 Brisbane floods", "The 2022 south-east Queensland floods", "The 2013 Brisbane River flood"] },
    { q: "What is the main topic of this text?", opts: ["Why Wivenhoe Dam was built", "How volunteers helped rebuild Brisbane", "The causes and impact of the 2011 Brisbane River floods", "How the Queensland Government manages natural disasters"] }
];

const GREEN_COMP = [
    { q: "When did the Brisbane River flood?", opts: ["January 1974", "January 2011", "February 2022", "March 2013"] },
    { q: "What caused the floods?", opts: ["Strong winds blowing water onto land", "A lot of rain that fell for many months", "An earthquake shaking the riverbed", "A very hot summer melting ice upstream"] },
    { q: "Why did the water run into the rivers instead of soaking into the ground?", opts: ["The ground was covered in concrete", "The ground was already very wet", "The ground was frozen solid", "People had blocked all the drains"] },
    { q: "What is Wivenhoe Dam?", opts: ["A bridge over the Brisbane River", "A power station near Ipswich", "A big dam built to help stop floods", "A park beside the river"] },
    { q: "Why did workers let water out of the dam?", opts: ["To water the farms downstream", "To lower the temperature of the water", "To keep the dam safe because it was too full", "To test if the dam was working properly"] },
    { q: "How high did the river rise at the City Gauge?", opts: ["2.10 metres", "3.85 metres", "4.46 metres", "5.45 metres"] },
    { q: "How many homes were flooded?", opts: ["About 1,000", "About 5,000", "About 10,000", "About 26,600"] },
    { q: "How many people died in the floods across Queensland?", opts: ["Three", "Thirteen", "Thirty-three", "One hundred"] },
    { q: "What did many people have to do during the floods?", opts: ["Go to school as normal", "Leave their homes", "Travel overseas for safety", "Stay in their attics without food"] },
    { q: "What was the group of volunteers called?", opts: ["The Rescue Squad", "The Mud Army", "The Clean Team", "The River Crew"] },
    { q: "What did the volunteers help people do?", opts: ["Build new houses", "Clean up their homes and streets", "Find missing pets", "Repair the dam"] },
    { q: "What does the word \"dam\" mean?", opts: ["A type of flood warning signal", "A large wall built to hold back water", "A government office that controls rivers", "A type of boat used for rescues"] },
    { q: "Why is this event described as one of the worst floods in Queensland's history?", opts: ["Because it happened during winter", "Because so many homes and lives were affected", "Because it only lasted one day", "Because no rain had fallen for months before it"] },
    { q: "What did the government do after the floods?", opts: ["Built a new city away from the river", "Closed all rivers to the public", "Made new plans to keep people safer", "Sent everyone to live in another state"] },
    { q: "What is this text mainly about?", opts: ["How dams are built", "The 2011 Brisbane River floods", "Why Queensland gets so much rain", "How to volunteer during a flood"] }
];

const MATHS_Y5 = [
    { q: "A stall at the school fair earned $348 selling sausage sizzles. It cost $127 to buy the ingredients. What was the profit?", opts: ["$121", "$221", "$231", "$475"] },
    { q: "A small bakery had weekly income of $1,250 and expenses of $875. What was the profit for the week?", opts: ["$275", "$375", "$475", "$2,125"] },
    { q: "A lemonade stand spent $18.50 on lemons, sugar, and cups. It earned $42.00 in sales. What was the profit?", opts: ["$13.50", "$23.50", "$33.50", "$60.50"] },
    { q: "A school tuckshop took in $620 but spent $710 on food supplies. Which statement is correct?", opts: ["It made a profit of $90", "It made a profit of $710", "It made a loss of $90", "It broke even"] },
    { q: "Mia sold handmade bracelets for $6.50 each. She made 12 bracelets and sold them all. Her materials cost $28. What was her profit?", opts: ["$42.00", "$50.00", "$50.50", "$78.00"] },
    { q: "A market stall had income of $1,840 and costs of $1,380. What was the profit?", opts: ["$360", "$460", "$560", "$3,220"] },
    { q: "A car wash business spent $95 on soap, water, and cloths. It charged $15 per car and washed 8 cars. What was the profit or loss?", opts: ["$25 profit", "$25 loss", "$95 profit", "$120 profit"] },
    { q: "Jaxon spent $340 buying second-hand books and resold them for $295. What was his result?", opts: ["$45 profit", "$45 loss", "$295 profit", "$635 loss"] },
    { q: "A class raised $215 at a cake stall. The ingredients cost $58 and the hire of the table was $12. What was the profit?", opts: ["$135", "$145", "$157", "$170"] },
    { q: "A florist had monthly income of $3,600 and total expenses of $2,975. How much profit did the florist make?", opts: ["$525", "$625", "$725", "$6,575"] },
    { q: "A school canteen had expenditure of $430 and income of $390 in one week. What was the result?", opts: ["$40 profit", "$40 loss", "$430 profit", "$390 loss"] },
    { q: "Zara ran a pet-minding service during the school holidays. She earned $660 and spent $215 on supplies and advertising. What was her profit?", opts: ["$345", "$415", "$445", "$875"] },
    { q: "A community market stall bought craft supplies for $186 and sold all items for a total of $245. What was the profit?", opts: ["$49", "$59", "$69", "$79"] },
    { q: "Tom's fruit and vegetable stall had income of $2,100 and expenses of $1,855 for the month. How much profit did he make?", opts: ["$155", "$245", "$355", "$445"] },
    { q: "A sausage sizzle raised $174.00. Bread cost $18.50, sausages cost $47.80, and sauce and napkins cost $6.70. What was the profit?", opts: ["$91.00", "$101.00", "$111.00", "$174.00"] }
];

const MATHS_Y34 = [
    { q: "Lily sold 5 muffins for $2 each. She spent $4 on ingredients. How much money did she have left over?", opts: ["$4", "$6", "$10", "$14"] },
    { q: "Ben earned $15 mowing lawns. He spent $8 on a drink and a snack. How much money did he have left?", opts: ["$5", "$7", "$8", "$23"] },
    { q: "A toy costs $12. Aisha has $9. How much more money does she need?", opts: ["$2", "$3", "$4", "$21"] },
    { q: "Sam sold lemonade for 50 cents a cup. He sold 20 cups. How much money did he earn in total?", opts: ["$5.00", "$10.00", "$20.00", "$50.00"] },
    { q: "A stall sold 8 cupcakes at $3 each. It cost $10 to make them. How much was left over?", opts: ["$10", "$14", "$24", "$34"] },
    { q: "Ruby spent $6.50 on craft supplies and sold her crafts for $10.00. How much did she earn over her costs?", opts: ["$2.50", "$3.50", "$4.50", "$16.50"] },
    { q: "A class had $50 to spend on a party. They spent $32 on food and $11 on decorations. How much money was left?", opts: ["$5", "$7", "$8", "$43"] },
    { q: "Jake bought a book for $8 and sold it for $5. Did he make a profit or loss, and how much?", opts: ["Profit of $3", "Loss of $3", "Profit of $5", "Loss of $5"] },
    { q: "Mia had $20. She bought a gift for $13.50. How much change did she get?", opts: ["$5.50", "$6.00", "$6.50", "$7.50"] },
    { q: "A school stall earned $45 and spent $28 on supplies. What was the profit?", opts: ["$13", "$17", "$28", "$73"] },
    { q: "Connor saved $5 every week for 6 weeks. How much money had he saved altogether?", opts: ["$11", "$25", "$30", "$35"] },
    { q: "A bakery sold 10 loaves of bread for $4 each. The flour cost $15. What was the profit?", opts: ["$15", "$25", "$40", "$55"] },
    { q: "Sophie bought 4 books at $6 each. She paid with a $30 note. How much change did she receive?", opts: ["$4", "$6", "$24", "$26"] },
    { q: "A lemonade stand earned $16.00 and spent $9.50 on supplies. What was the profit?", opts: ["$5.50", "$6.00", "$6.50", "$7.00"] },
    { q: "Lucas sold toy cars for $3 each and sold 9 of them. He spent $15 buying the cars. What was his profit?", opts: ["$9", "$12", "$15", "$27"] }
];

// --- DOCUMENT CREATION LOGIC ---

function createPrintDoc(readingText, readingQuestions, mathsQuestions) {
    const divider = { bottom: { style: BorderStyle.SINGLE, size: 4, color: "BBBBBB", space: 4 } };
    const tabPos = 4680; // Midpoint of 9360 DXA usable width

    const children = [
        // Heading
        new Paragraph({
            spacing: { after: 240 },
            children: [new TextRun({ text: `Week ${WEEK} Homework — Informational Text`, bold: true, size: 32, font: "Arial" })]
        }),
        new Paragraph({
            spacing: { after: 320 },
            children: [new TextRun({ text: TITLE, bold: true, size: 24, font: "Arial" })]
        }),
        // Reading Text
        ...readingText.map(para => new Paragraph({
            spacing: { after: 140, line: 312, lineRule: "auto" }, // 1.3 line spacing for 12pt (12*20*1.3 = 312)
            children: [new TextRun({ text: para, size: 24, font: "Arial" })]
        })),
        // Reading Questions Section Heading
        new Paragraph({
            spacing: { before: 240, after: 120 },
            children: [new TextRun({ text: "Reading Comprehension Questions", bold: true, size: 24, font: "Arial" })]
        }),
        // Reading Questions
        ...readingQuestions.map((q, i) => [
            new Paragraph({
                spacing: { before: 80, after: 20 },
                children: [new TextRun({ text: `${i + 1}. ${q.q}`, bold: true, size: 20, font: "Arial" })]
            }),
            new Paragraph({
                tabStops: [{ type: TabStopType.LEFT, position: tabPos }],
                spacing: { after: 20 },
                children: [
                    new TextRun({ text: `A. ${q.opts[0]}`, size: 20, font: "Arial" }),
                    new TextRun({ text: `\tB. ${q.opts[1]}`, size: 20, font: "Arial" })
                ]
            }),
            new Paragraph({
                tabStops: [{ type: TabStopType.LEFT, position: tabPos }],
                spacing: { after: 80 },
                border: divider,
                children: [
                    new TextRun({ text: `C. ${q.opts[2]}`, size: 20, font: "Arial" }),
                    new TextRun({ text: `\tD. ${q.opts[3]}`, size: 20, font: "Arial" })
                ]
            })
        ]).flat(),
        // Maths Questions Section Heading
        new Paragraph({
            spacing: { before: 240, after: 120 },
            children: [new TextRun({ text: "Mathematics — Financial Maths", bold: true, size: 24, font: "Arial" })]
        })
    ];

    // Maths Questions in two columns
    const mathsRows = [];
    for (let i = 0; i < 8; i++) {
        const leftQ = mathsQuestions[i];
        const rightQ = mathsQuestions[i + 8] || null;

        const leftCells = [
            new Paragraph({
                spacing: { before: 80, after: 20 },
                children: [new TextRun({ text: `${i + 16}. ${leftQ.q}`, bold: true, size: 20, font: "Arial" })]
            }),
            new Paragraph({
                spacing: { after: 20 },
                children: [new TextRun({ text: `A. ${leftQ.opts[0]}   B. ${leftQ.opts[1]}`, size: 20, font: "Arial" })]
            }),
            new Paragraph({
                spacing: { after: 80 },
                border: divider,
                children: [new TextRun({ text: `C. ${leftQ.opts[2]}   D. ${leftQ.opts[3]}`, size: 20, font: "Arial" })]
            })
        ];

        const rightCells = rightQ ? [
            new Paragraph({
                spacing: { before: 80, after: 20 },
                children: [new TextRun({ text: `${i + 24}. ${rightQ.q}`, bold: true, size: 20, font: "Arial" })]
            }),
            new Paragraph({
                spacing: { after: 20 },
                children: [new TextRun({ text: `A. ${rightQ.opts[0]}   B. ${rightQ.opts[1]}`, size: 20, font: "Arial" })]
            }),
            new Paragraph({
                spacing: { after: 80 },
                border: divider,
                children: [new TextRun({ text: `C. ${rightQ.opts[2]}   D. ${rightQ.opts[3]}`, size: 20, font: "Arial" })]
            })
        ] : [];

        mathsRows.push(new TableRow({
            children: [
                new TableCell({ width: { size: 4680, type: WidthType.DXA }, borders: { top: BorderStyle.NONE, bottom: BorderStyle.NONE, left: BorderStyle.NONE, right: BorderStyle.NONE }, children: leftCells }),
                new TableCell({ width: { size: 4680, type: WidthType.DXA }, borders: { top: BorderStyle.NONE, bottom: BorderStyle.NONE, left: BorderStyle.NONE, right: BorderStyle.NONE }, children: rightCells })
            ]
        }));
    }

    children.push(new Table({
        columnWidths: [4680, 4680],
        rows: mathsRows,
        borders: { top: BorderStyle.NONE, bottom: BorderStyle.NONE, left: BorderStyle.NONE, right: BorderStyle.NONE, insideHorizontal: BorderStyle.NONE, insideVertical: BorderStyle.NONE }
    }));

    return new Document({
        styles: {
            default: { document: { run: { font: "Arial", size: 24 } } }
        },
        sections: [{
            properties: {
                page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
            },
            children: children
        }]
    });
}

async function main() {
    const configs = [
        { name: "Red", text: RED_TEXT, comp: RED_COMP, maths: MATHS_Y5 },
        { name: "Blue", text: BLUE_TEXT, comp: BLUE_COMP, maths: MATHS_Y5 },
        { name: "Green", text: GREEN_TEXT, comp: GREEN_COMP, maths: MATHS_Y34 }
    ];

    for (const config of configs) {
        const doc = createPrintDoc(config.text, config.comp, config.maths);
        const buffer = await Packer.toBuffer(doc);
        fs.writeFileSync(path.join(OUT, `Week_${WEEK}_Print_${config.name}.docx`), buffer);
        console.log(`Created Week_${WEEK}_Print_${config.name}.docx`);
    }
}

main().catch(console.error);
