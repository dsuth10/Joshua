const { Document, Packer, Paragraph, TextRun, AlignmentType } = require('docx');
const fs = require('fs');
const path = require('path');

const OUT = __dirname;

// ── COMPREHENSION QUESTIONS ──────────────────────────────────────────────────

const RED_COMP = [
  { q: 'What caused the Brisbane River to flood in January 2011?', a: 'Heavy rainfall after months of above-average rain during a La Niña weather pattern', opts: ['A government decision to release dam water', 'Heavy rainfall after months of above-average rain during a La Niña weather pattern', 'A tropical cyclone called Wanda', 'Storm surge from Moreton Bay'], ans: 'B' },
  { q: 'Why was the soil unable to absorb more water by January 2011?', a: 'It was already completely saturated from months of La Niña rainfall', opts: ['The soil was frozen solid', 'It was already completely saturated from months of La Niña rainfall', 'Construction in the area had covered the soil with concrete', 'A drought had made the soil too hard to absorb water'], ans: 'B' },
  { q: 'Why was Wivenhoe Dam originally built?', a: 'To reduce the risk of flooding in Brisbane after the 1974 disaster', opts: ['To supply drinking water to Ipswich', 'To generate electricity for south-east Queensland', 'To reduce the risk of flooding in Brisbane after the 1974 disaster', 'To store water for irrigation on farms'], ans: 'C' },
  { q: 'What difficult decision did engineers face during the 2011 floods?', a: 'They had to release dam water to protect the dam, which worsened flooding downstream', opts: ['Whether to warn residents or keep the situation quiet', 'They had to release dam water to protect the dam, which worsened flooding downstream', 'Whether to build a new dam or reinforce the existing one', 'They had to choose which suburbs would be flooded first'], ans: 'B' },
  { q: 'How high did the Brisbane River reach at the City Gauge during the 2011 floods?', a: '4.46 metres', opts: ['5.45 metres', '8.35 metres', '4.46 metres', '3.85 metres'], ans: 'C' },
  { q: 'How many homes were inundated during the 2011 Brisbane floods?', a: 'Approximately 26,600', opts: ['Approximately 8,500', 'Approximately 18,000', 'Approximately 26,600', 'Approximately 38,000'], ans: 'C' },
  { q: 'How did the 2011 Brisbane River peak compare to the 1974 peak?', a: 'It was lower than 1974 but still caused widespread inundation', opts: ['It was higher than 1974 and caused more damage', 'It was exactly the same as 1974', 'It was lower than 1974 but still caused widespread inundation', 'It was much lower than 1974 and barely damaged any homes'], ans: 'C' },
  { q: 'How many people died across Queensland during the 2011 flood sequence?', a: 'Thirty-three', opts: ['Thirteen', 'Twenty-two', 'Thirty-three', 'Forty-five'], ans: 'C' },
  { q: 'What was the "Mud Army"?', a: 'Tens of thousands of volunteers who helped with the clean-up after the floods', opts: ['A government agency that managed dam releases', 'The name given to the floodwater that spread mud through suburbs', 'Tens of thousands of volunteers who helped with the clean-up after the floods', 'A special army unit deployed to rescue flood victims'], ans: 'C' },
  { q: 'What does the word "inundated" most likely mean in this text?', a: 'Flooded or covered with water', opts: ['Damaged by fire', 'Flooded or covered with water', 'Repaired by workers', 'Evacuated by residents'], ans: 'B' },
  { q: 'Which two cities were specifically mentioned as having homes and businesses flooded?', a: 'Brisbane and Ipswich', opts: ['Brisbane and Cairns', 'Brisbane and Ipswich', 'Ipswich and Toowoomba', 'Brisbane and the Gold Coast'], ans: 'B' },
  { q: 'What did the government do after the 2011 floods to prevent future disasters?', a: 'Launched an inquiry and made improvements to flood mapping and dam operations', opts: ['Built a second dam upstream of Wivenhoe', 'Launched an inquiry and made improvements to flood mapping and dam operations', 'Relocated all riverside suburbs to higher ground', 'Introduced new laws banning development near rivers'], ans: 'B' },
  { q: 'What does the text suggest was the main reason volunteers joined the clean-up effort?', a: 'Community solidarity and a desire to help those affected', opts: ['They were paid by the government to do so', 'Community solidarity and a desire to help those affected', 'They were ordered to help by emergency services', 'They wanted to reclaim their own property'], ans: 'B' },
  { q: 'Which suburbs are named in the text as being among the hardest hit?', a: 'Rocklea and Oxley', opts: ['Chelmer and Indooroopilly', 'Rocklea and Oxley', 'Toowong and Auchenflower', 'Kenmore and Brookfield'], ans: 'B' },
  { q: 'What is the main purpose of this text?', a: 'To inform readers about the causes, impacts, and aftermath of the 2011 Brisbane floods', opts: ['To persuade readers that dams should be removed', 'To entertain readers with a story about a flood survivor', 'To inform readers about the causes, impacts, and aftermath of the 2011 Brisbane floods', 'To argue that Brisbane should not have been built on a floodplain'], ans: 'C' },
];

const BLUE_COMP = [
  { q: 'What caused the 2011 Brisbane floods?', a: 'Heavy rainfall during a La Niña weather pattern that had been building for months', opts: ['A storm surge from the Pacific Ocean', 'Heavy rainfall during a La Niña weather pattern that had been building for months', 'A massive earthquake under the Brisbane River', 'Heavy snow melting on the Great Dividing Range'], ans: 'B' },
  { q: 'Why could the ground not absorb any more water by early January 2011?', a: 'It was completely saturated from months of heavy rainfall', opts: ['The ground had been covered with concrete', 'A drought had cracked and hardened the soil', 'It was completely saturated from months of heavy rainfall', 'Frost had made the soil rock solid'], ans: 'C' },
  { q: 'What was Wivenhoe Dam built to do?', a: 'To help protect Brisbane from future flooding after 1974', opts: ['To generate electricity for south-east Queensland', 'To help protect Brisbane from future flooding after 1974', 'To provide irrigation water for farms west of Brisbane', 'To stop salt water from entering the river from the sea'], ans: 'B' },
  { q: 'Why did engineers release water from Wivenhoe Dam during the 2011 floods?', a: 'To keep the dam structure safe as it was filling up very quickly', opts: ['To cool the dam walls during hot weather', 'To make room for new water being pumped in from elsewhere', 'To keep the dam structure safe as it was filling up very quickly', 'To flush sediment from the bottom of the dam'], ans: 'C' },
  { q: 'How high did the Brisbane River rise at the City Gauge?', a: '4.46 metres', opts: ['5.45 metres', '4.46 metres', '3.85 metres', '6.60 metres'], ans: 'B' },
  { q: 'How many homes were flooded during the 2011 event?', a: 'About 26,600', opts: ['About 8,500', 'About 18,000', 'About 26,600', 'About 38,000'], ans: 'C' },
  { q: 'Which suburbs are mentioned as being among the worst affected?', a: 'Rocklea, Oxley, and Chelmer', opts: ['Toowong, Auchenflower, and St Lucia', 'Rocklea, Oxley, and Chelmer', 'Indooroopilly, Kenmore, and Brookfield', 'Fortitude Valley, Newstead, and Teneriffe'], ans: 'B' },
  { q: 'How many people died across Queensland during the floods?', a: 'Thirty-three', opts: ['Thirteen', 'Twenty-two', 'Thirty-three', 'Forty-eight'], ans: 'C' },
  { q: 'What did thousands of volunteers do after the floods?', a: 'They helped affected residents remove mud and debris from their homes', opts: ['They rebuilt homes and businesses from scratch', 'They helped affected residents remove mud and debris from their homes', 'They worked around the clock to release water from the dam', 'They delivered food and water to flood victims in shelters'], ans: 'B' },
  { q: 'What nickname was given to the volunteer clean-up group?', a: 'The Mud Army', opts: ['The Flood Force', 'The Mud Army', 'The Clean Crew', 'The Brisbane Brigade'], ans: 'B' },
  { q: 'What does the word "displaced" most likely mean in this text?', a: 'Forced to leave their homes and live somewhere else', opts: ['Hurt or injured during the flood', 'Forced to leave their homes and live somewhere else', 'Given money to help with repairs', 'Rescued by helicopter from rooftops'], ans: 'B' },
  { q: 'What did the Queensland Government do after the 2011 floods?', a: 'Launched an inquiry and improved flood maps and dam management', opts: ['Built another dam upstream', 'Launched an inquiry and improved flood maps and dam management', 'Moved all homes away from the river', 'Blamed the dam engineers for the damage'], ans: 'B' },
  { q: 'What does the text say the floodwater became after it ran off the saturated ground?', a: 'Runoff that poured into rivers and creeks', opts: ['Steam that evaporated into the atmosphere', 'Runoff that poured into rivers and creeks', 'Groundwater that seeped slowly into the ocean', 'Irrigation water used by nearby farms'], ans: 'B' },
  { q: 'Which earlier flood event is mentioned in the text?', a: 'The 1974 Brisbane floods', opts: ['The 1893 Brisbane floods', 'The 1974 Brisbane floods', 'The 2022 south-east Queensland floods', 'The 2013 Brisbane River flood'], ans: 'B' },
  { q: 'What is the main topic of this text?', a: 'The causes and impact of the 2011 Brisbane River floods', opts: ['Why Wivenhoe Dam was built', 'How volunteers helped rebuild Brisbane', 'The causes and impact of the 2011 Brisbane River floods', 'How the Queensland Government manages natural disasters'], ans: 'C' },
];

const GREEN_COMP = [
  { q: 'When did the Brisbane River flood?', a: 'January 2011', opts: ['January 1974', 'January 2011', 'February 2022', 'March 2013'], ans: 'B' },
  { q: 'What caused the floods?', a: 'A lot of rain that fell for many months', opts: ['Strong winds blowing water onto land', 'A lot of rain that fell for many months', 'An earthquake shaking the riverbed', 'A very hot summer melting ice upstream'], ans: 'B' },
  { q: 'Why did the water run into the rivers instead of soaking into the ground?', a: 'The ground was already very wet', opts: ['The ground was covered in concrete', 'The ground was already very wet', 'The ground was frozen solid', 'People had blocked all the drains'], ans: 'B' },
  { q: 'What is Wivenhoe Dam?', a: 'A big dam built to help stop floods', opts: ['A bridge over the Brisbane River', 'A power station near Ipswich', 'A big dam built to help stop floods', 'A park beside the river'], ans: 'C' },
  { q: 'Why did workers let water out of the dam?', a: 'To keep the dam safe because it was too full', opts: ['To water the farms downstream', 'To lower the temperature of the water', 'To keep the dam safe because it was too full', 'To test if the dam was working properly'], ans: 'C' },
  { q: 'How high did the river rise at the City Gauge?', a: '4.46 metres', opts: ['2.10 metres', '3.85 metres', '4.46 metres', '5.45 metres'], ans: 'C' },
  { q: 'How many homes were flooded?', a: 'About 26,600', opts: ['About 1,000', 'About 5,000', 'About 10,000', 'About 26,600'], ans: 'D' },
  { q: 'How many people died in the floods across Queensland?', a: 'Thirty-three', opts: ['Three', 'Thirteen', 'Thirty-three', 'One hundred'], ans: 'C' },
  { q: 'What did many people have to do during the floods?', a: 'Leave their homes', opts: ['Go to school as normal', 'Leave their homes', 'Travel overseas for safety', 'Stay in their attics without food'], ans: 'B' },
  { q: 'What was the group of volunteers called?', a: 'The Mud Army', opts: ['The Rescue Squad', 'The Mud Army', 'The Clean Team', 'The River Crew'], ans: 'B' },
  { q: 'What did the volunteers help people do?', a: 'Clean up their homes and streets', opts: ['Build new houses', 'Clean up their homes and streets', 'Find missing pets', 'Repair the dam'], ans: 'B' },
  { q: 'What does the word "dam" mean?', a: 'A large wall built to hold back water', opts: ['A type of flood warning signal', 'A large wall built to hold back water', 'A government office that controls rivers', 'A type of boat used for rescues'], ans: 'B' },
  { q: 'Why is this event described as one of the worst floods in Queensland\'s history?', a: 'Because so many homes and lives were affected', opts: ['Because it happened during winter', 'Because so many homes and lives were affected', 'Because it only lasted one day', 'Because no rain had fallen for months before it'], ans: 'B' },
  { q: 'What did the government do after the floods?', a: 'Made new plans to keep people safer', opts: ['Built a new city away from the river', 'Closed all rivers to the public', 'Made new plans to keep people safer', 'Sent everyone to live in another state'], ans: 'C' },
  { q: 'What is this text mainly about?', a: 'The 2011 Brisbane River floods', opts: ['How dams are built', 'The 2011 Brisbane River floods', 'Why Queensland gets so much rain', 'How to volunteer during a flood'], ans: 'B' },
];

// ── MATHS QUESTIONS ──────────────────────────────────────────────────────────

// Year 5 — Financial Maths: Profit, Loss, Income & Expenditure word problems
// AC9M5N08, AC9M5N09
const MATHS_Y5 = [
  { q: 'A stall at the school fair earned $348 selling sausage sizzles. It cost $127 to buy the ingredients. What was the profit?', opts: ['$121', '$221', '$231', '$475'], ans: 'B' },
  { q: 'A small bakery had weekly income of $1,250 and expenses of $875. What was the profit for the week?', opts: ['$275', '$375', '$475', '$2,125'], ans: 'B' },
  { q: 'A lemonade stand spent $18.50 on lemons, sugar, and cups. It earned $42.00 in sales. What was the profit?', opts: ['$13.50', '$23.50', '$33.50', '$60.50'], ans: 'B' },
  { q: 'A school tuckshop took in $620 but spent $710 on food supplies. Which statement is correct?', opts: ['It made a profit of $90', 'It made a profit of $710', 'It made a loss of $90', 'It broke even'], ans: 'C' },
  { q: 'Mia sold handmade bracelets for $6.50 each. She made 12 bracelets and sold them all. Her materials cost $28. What was her profit?', opts: ['$42.00', '$50.00', '$50.50', '$78.00'], ans: 'C' },
  { q: 'A market stall had income of $1,840 and costs of $1,380. What was the profit?', opts: ['$360', '$460', '$560', '$3,220'], ans: 'B' },
  { q: 'A car wash business spent $95 on soap, water, and cloths. It charged $15 per car and washed 8 cars. What was the profit or loss?', opts: ['$25 profit', '$25 loss', '$95 profit', '$120 profit'], ans: 'A' },
  { q: 'Jaxon spent $340 buying second-hand books and resold them for $295. What was his result?', opts: ['$45 profit', '$45 loss', '$295 profit', '$635 loss'], ans: 'B' },
  { q: 'A class raised $215 at a cake stall. The ingredients cost $58 and the hire of the table was $12. What was the profit?', opts: ['$135', '$145', '$157', '$170'], ans: 'B' },
  { q: 'A florist had monthly income of $3,600 and total expenses of $2,975. How much profit did the florist make?', opts: ['$525', '$625', '$725', '$6,575'], ans: 'B' },
  { q: 'A school canteen had expenditure of $430 and income of $390 in one week. What was the result?', opts: ['$40 profit', '$40 loss', '$430 profit', '$390 loss'], ans: 'B' },
  { q: 'Zara ran a pet-minding service during the school holidays. She earned $660 and spent $215 on supplies and advertising. What was her profit?', opts: ['$345', '$415', '$445', '$875'], ans: 'C' },
  { q: 'A community market stall bought craft supplies for $186 and sold all items for a total of $245. What was the profit?', opts: ['$49', '$59', '$69', '$79'], ans: 'B' },
  { q: 'Tom\'s fruit and vegetable stall had income of $2,100 and expenses of $1,855 for the month. How much profit did he make?', opts: ['$155', '$245', '$355', '$445'], ans: 'B' },
  { q: 'A sausage sizzle raised $174.00. Bread cost $18.50, sausages cost $47.80, and sauce and napkins cost $6.70. What was the profit?', opts: ['$91.00', '$101.00', '$111.00', '$174.00'], ans: 'B' },
];

// Year 3/4 — Financial Maths: Simple money problems
// AC9M3N06, AC9M3M06
const MATHS_Y34 = [
  { q: 'Lily sold 5 muffins for $2 each. She spent $4 on ingredients. How much money did she have left over?', opts: ['$4', '$6', '$10', '$14'], ans: 'B' },
  { q: 'Ben earned $15 mowing lawns. He spent $8 on a drink and a snack. How much money did he have left?', opts: ['$5', '$7', '$8', '$23'], ans: 'B' },
  { q: 'A toy costs $12. Aisha has $9. How much more money does she need?', opts: ['$2', '$3', '$4', '$21'], ans: 'B' },
  { q: 'Sam sold lemonade for 50 cents a cup. He sold 20 cups. How much money did he earn in total?', opts: ['$5.00', '$10.00', '$20.00', '$50.00'], ans: 'B' },
  { q: 'A stall sold 8 cupcakes at $3 each. It cost $10 to make them. How much was left over?', opts: ['$10', '$14', '$24', '$34'], ans: 'B' },
  { q: 'Ruby spent $6.50 on craft supplies and sold her crafts for $10.00. How much did she earn over her costs?', opts: ['$2.50', '$3.50', '$4.50', '$16.50'], ans: 'B' },
  { q: 'A class had $50 to spend on a party. They spent $32 on food and $11 on decorations. How much money was left?', opts: ['$5', '$7', '$8', '$43'], ans: 'B' },
  { q: 'Jake bought a book for $8 and sold it for $5. Did he make a profit or loss, and how much?', opts: ['Profit of $3', 'Loss of $3', 'Profit of $5', 'Loss of $5'], ans: 'B' },
  { q: 'Mia had $20. She bought a gift for $13.50. How much change did she get?', opts: ['$5.50', '$6.00', '$6.50', '$7.50'], ans: 'C' },
  { q: 'A school stall earned $45 and spent $28 on supplies. What was the profit?', opts: ['$13', '$17', '$28', '$73'], ans: 'B' },
  { q: 'Connor saved $5 every week for 6 weeks. How much money had he saved altogether?', opts: ['$11', '$25', '$30', '$35'], ans: 'C' },
  { q: 'A bakery sold 10 loaves of bread for $4 each. The flour cost $15. What was the profit?', opts: ['$15', '$25', '$40', '$55'], ans: 'B' },
  { q: 'Sophie bought 4 books at $6 each. She paid with a $30 note. How much change did she receive?', opts: ['$4', '$6', '$24', '$26'], ans: 'B' },
  { q: 'A lemonade stand earned $16.00 and spent $9.50 on supplies. What was the profit?', opts: ['$5.50', '$6.00', '$6.50', '$7.00'], ans: 'C' },
  { q: 'Lucas sold toy cars for $3 each and sold 9 of them. He spent $15 buying the cars. What was his profit?', opts: ['$9', '$12', '$15', '$27'], ans: 'B' },
];

// ── DOCUMENT BUILDER ─────────────────────────────────────────────────────────

function buildQParagraphs(qList, startNum) {
  const paras = [];
  qList.forEach((item, i) => {
    const n = startNum + i;
    paras.push(new Paragraph({
      spacing: { before: 160, after: 40 },
      children: [new TextRun({ text: `${n}. ${item.q}`, bold: true, size: 20, font: 'Arial' })],
    }));
    item.opts.forEach((opt, index) => {
      const letter = String.fromCharCode(65 + index);
      paras.push(new Paragraph({
        spacing: { before: 0, after: 20 },
        indent: { left: 360 },
        children: [new TextRun({ text: `${letter}. ${opt}`, size: 20, font: 'Arial' })],
      }));
    });
    paras.push(new Paragraph({
      spacing: { before: 20, after: 20 },
      indent: { left: 360 },
      children: [new TextRun({ text: `ANSWER: ${item.ans}`, size: 20, font: 'Arial', color: '888888' })],
    }));
    paras.push(new Paragraph({
      spacing: { before: 0, after: 80 },
      indent: { left: 360 },
      children: [new TextRun({ text: `POINT: 1`, size: 20, font: 'Arial', color: '888888' })],
    }));
  });
  return paras;
}

function makeQDoc(label, compQ, mathsQ) {
  return new Document({
    styles: { default: { document: { run: { font: 'Arial', size: 20 } } } },
    sections: [{
      properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
      children: [
        new Paragraph({
          spacing: { before: 0, after: 160 },
          children: [new TextRun({ text: `Week 3 Homework — Questions (${label} Group)`, bold: true, size: 28, font: 'Arial' })],
        }),
        new Paragraph({
          spacing: { before: 0, after: 200 },
          children: [new TextRun({ text: 'SECTION A: Reading Comprehension', bold: true, size: 22, font: 'Arial' })],
        }),
        ...buildQParagraphs(compQ, 1),
        new Paragraph({
          spacing: { before: 240, after: 200 },
          children: [new TextRun({ text: 'SECTION B: Mathematics — Financial Maths', bold: true, size: 22, font: 'Arial' })],
        }),
        ...buildQParagraphs(mathsQ, 16),
      ],
    }],
  });
}

async function main() {
  const sets = [
    { label: 'Red', comp: RED_COMP, maths: MATHS_Y5, file: 'Week_03_Questions_Red.docx' },
    { label: 'Blue', comp: BLUE_COMP, maths: MATHS_Y5, file: 'Week_03_Questions_Blue.docx' },
    { label: 'Green', comp: GREEN_COMP, maths: MATHS_Y34, file: 'Week_03_Questions_Green.docx' },
  ];
  for (const s of sets) {
    const buf = await Packer.toBuffer(makeQDoc(s.label, s.comp, s.maths));
    fs.writeFileSync(path.join(OUT, s.file), buf);
    console.log('Created:', s.file);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
