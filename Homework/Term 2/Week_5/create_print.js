const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, TabStopType, WidthType, ShadingType } = require('docx');
const fs = require('fs');
const path = require('path');

const NONE = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noBorder = { top: NONE, bottom: NONE, left: NONE, right: NONE };
const PAGE_W = 11906, MARGIN = 720, USABLE = PAGE_W - MARGIN * 2;
const COL = Math.floor(USABLE / 2);
const TAB = Math.floor(COL / 2);

function qPara(stem, opts, showAns) {
  const paragraphs = [];
  paragraphs.push(new Paragraph({
    spacing: { before: 80, after: 20 },
    children: [new TextRun({ text: stem, bold: true, size: 20, font: 'Arial' })]
  }));
  paragraphs.push(new Paragraph({
    spacing: { before: 0, after: 0 },
    children: [new TextRun({ text: `A. ${opts[0]}`, size: 20, font: 'Arial' }),
      new TextRun({ text: `\tB. ${opts[1]}`, size: 20, font: 'Arial' })]
  }));
  paragraphs.push(new Paragraph({
    tabStops: [{ type: TabStopType.LEFT, position: TAB }],
    spacing: { before: 0, after: 80 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'BBBBBB', space: 4 } },
    children: [new TextRun({ text: `C. ${opts[2]}`, size: 20, font: 'Arial' }),
      new TextRun({ text: `\tD. ${opts[3]}`, size: 20, font: 'Arial' })]
  }));
  return paragraphs;
}

function readingParas(title, body) {
  return [
    new Paragraph({ spacing: { before: 0, after: 160 }, children: [new TextRun({ text: title, bold: true, size: 28, font: 'Arial' })] }),
    ...body.map(t => new Paragraph({ spacing: { before: 0, after: 140 }, children: [new TextRun({ text: t, size: 24, font: 'Arial' })] }))
  ];
}

function sectionHead(text) {
  return new Paragraph({ spacing: { before: 160, after: 80 }, children: [new TextRun({ text, bold: true, size: 22, font: 'Arial', color: '333333' })] });
}

function buildPrint(title, body, readQs, mathQs) {
  const children = [
    ...readingParas(title, body),
    sectionHead('Reading Questions'),
  ];
  readQs.forEach((q, i) => children.push(...qPara(`${i+1}. ${q.q}`, q.opts.map(o => o.slice(3)), false)));

  const left = mathQs.slice(0, 8);
  const right = mathQs.slice(8);
  function col(qs, start) {
    const ps = [new Paragraph({ spacing: { before: 0, after: 80 }, children: [new TextRun({ text: 'Maths Questions', bold: true, size: 22, font: 'Arial', color: '333333' })] })];
    qs.forEach((q, i) => ps.push(...qPara(`${start+i}. ${q.q}`, q.opts.map(o => o.slice(3)), false)));
    return ps;
  }

  children.push(new Table({
    columnWidths: [COL, COL],
    rows: [new TableRow({ children: [
      new TableCell({ borders: noBorder, width: { size: COL, type: WidthType.DXA }, shading: { fill: 'FFFFFF', type: ShadingType.CLEAR }, children: col(left, 16) }),
      new TableCell({ borders: noBorder, width: { size: COL, type: WidthType.DXA }, shading: { fill: 'FFFFFF', type: ShadingType.CLEAR }, children: col(right, 24) })
    ]})]
  }));

  return new Document({
    styles: { default: { document: { run: { font: 'Arial', size: 20 } } } },
    sections: [{ properties: { page: { size: { width: PAGE_W, height: 16838 }, margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN } } }, children }]
  });
}

const redBody = [
  'Australia is one of the most fire-prone countries on Earth. Large areas of dry native bush, long droughts, and extreme heat create the right conditions for dangerous fires. Bushfires are a natural part of many Australian environments. However, they have become more intense and more frequent in recent decades.',
  'For a fire to burn, three things are needed: heat, fuel, and oxygen. Together, these are called the "fire triangle." Fuel includes dry grass, leaf litter, fallen bark, and shrubs. When temperatures are high, humidity is low, and strong winds are blowing, a fire can spread very quickly. Hot, dry winds from Australia\'s inland regions are especially dangerous during summer.',
  'The amount of fuel in an area is called fuel load. It refers to the dry plant material that has built up over time. Fire agencies reduce this risk through hazard reduction burns. These are planned, controlled fires lit carefully under safe conditions. By removing dry material before the fire season, future fires are less likely to become extreme.',
  'The 2019–2020 Black Summer was one of Australia\'s worst fire seasons. Around 18.6 million hectares burned across southeastern Australia. This is an area larger than the country of Syria. The fires caused 33 direct deaths and contributed to the deaths of about one billion animals. Thick smoke covered major cities for weeks, making the air quality extremely poor and causing serious breathing problems for many people.',
  'Many Australian plants have special features that help them survive fire. The banksia has cones that stay tightly sealed until heat causes them to open. Seeds then fall onto nutrient-rich, ash-rich soil, where they can germinate and grow. The grass tree also bounces back quickly after a burn, because its thick leaf base protects its growing point from heat.',
  'Recovery from a major bushfire takes many years. Homes need to be rebuilt and wildlife populations need time to recover. The emotional impact on affected communities can also last a long time. Being prepared for bushfires is an important skill for all Australians.'
];
const blueBody = [
  'Australia has more bushfires than almost any other country. Much of the land is covered in dry native bush. The climate is hot, and droughts are common. While fires are a natural part of the environment, they can cause great damage.',
  'A fire needs three things to burn: heat, fuel, and oxygen. This is called the "fire triangle." Fuel includes dry grass, leaves, and bark. When it is hot and windy, a fire can spread very quickly. Hot winds from the dry inland are very dangerous in summer.',
  'Fire crews work to stop large fires by doing hazard reduction burns. These are small, planned fires lit when the weather is safe. By burning dry plants before the fire season, there is less fuel left. This means later fires are less likely to get out of control.',
  'The 2019–2020 Black Summer fires were some of the worst ever. About 18.6 million hectares burned across Australia. The fires killed 33 people and around one billion animals. Thick smoke covered cities like Sydney and Canberra for many weeks. Air quality became very poor and many people had breathing problems.',
  'Some Australian plants can survive fire. The banksia has cones that open only after being exposed to heat. After a fire, the seeds drop onto ash-covered ground. This soil is rich in nutrients and good for new plants. Many animals shelter underground or in water to stay safe.',
  'After a bushfire, recovery takes a long time. Homes need to be rebuilt and animals need care. Native plants grow back slowly over many years. All Australians should know what to do in a bushfire.'
];
const greenBody = [
  'Every year, Australia has many bushfires. A bushfire burns dry grass, leaves, and trees. Bushfires can be very dangerous to people and animals.',
  'A fire needs three things to start. It needs heat, fuel, and air. Dry leaves and grass are fuel. When the weather is very hot, fires can start fast. Strong winds help fires spread even more quickly.',
  'Some fires are started by lightning. Some are started by accident. Firefighters work hard to keep people safe.',
  'Fire crews sometimes do hazard reduction burns. They light a small fire on purpose to burn away dry grass and leaves. This means there is less for a big fire to burn later on. It helps keep everyone safer.',
  'In 2019 and 2020, there were very big fires in Australia. Many homes were destroyed. Lots of animals lost their homes too. People from all over helped each other.',
  'After a bushfire, plants start to grow back. Some plants, like the banksia, need fire to open their seed pods. After a fire, the seeds fall onto the ground and start to grow. Over time, the bush comes back to life.',
  'Knowing what to do in a bushfire is very important. Firefighters and emergency workers are always ready to help.'
];

const redReadQs = [
  { q:"According to the text, which THREE conditions combine to make bushfires spread quickly?", opts:["A. High temperatures, low humidity, and strong winds","B. Low temperatures, high humidity, and calm winds","C. Heavy rainfall, dry soil, and strong winds","D. High humidity, dry fuel, and lightning"] },
  { q:"What does the term 'fuel load' refer to in the context of bushfires?", opts:["A. The cost of running fire trucks","B. The amount of dry combustible material built up in an area","C. The number of firefighters deployed","D. The speed at which a fire moves"] },
  { q:"Why are hot, dry winds from Australia's inland particularly dangerous?", opts:["A. They carry sparks into cities","B. They reduce fuel load by drying vegetation","C. They can cause a fire to spread very quickly","D. They ground firefighting aircraft"] },
  { q:"What is the main purpose of a hazard reduction burn?", opts:["A. To destroy invasive plants","B. To remove dry vegetation so future fires have less fuel","C. To create firebreaks around cities","D. To replenish soil nutrients"] },
  { q:"How large was the area burned during the 2019–2020 Black Summer fires?", opts:["A. 1.86 million hectares","B. 186 million hectares","C. 18.6 million hectares","D. 1860 hectares"] },
  { q:"The text compares the Black Summer area to which country?", opts:["A. France","B. Syria","C. Japan","D. Portugal"] },
  { q:"What does the text say happened to air quality during the Black Summer fires?", opts:["A. Slightly affected for a few days","B. Air quality improved","C. Thick smoke caused dangerous air quality for weeks","D. Cities were evacuated before smoke arrived"] },
  { q:"How many direct human deaths did the Black Summer fires cause?", opts:["A. 13","B. 33","C. 133","D. 330"] },
  { q:"Why do banksia cones remain sealed under normal conditions?", opts:["A. To protect seeds from animals","B. Because they only open when exposed to intense heat","C. Because they need rainfall to soften","D. To conserve water during drought"] },
  { q:"What advantage does ash-rich soil provide for banksia seeds?", opts:["A. It is compact, holding seeds in place","B. It is nutrient-rich, ideal for germination","C. It is cooler, preventing drying","D. It contains more water"] },
  { q:"How does the grass tree survive a bushfire?", opts:["A. Its roots store water to extinguish flames","B. Its leaves repel fire chemically","C. Its thick leaf base protects its growing point","D. It sheds all leaves before fire season"] },
  { q:"What does the text suggest about Australian plants and fire?", opts:["A. Plants evolved adaptations to survive and benefit from fire","B. All plants are destroyed and must be replanted","C. Only introduced species survive","D. Plants evolved to prevent fires starting"] },
  { q:"Why must hazard reduction burns be carefully timed?", opts:["A. Only after fire season ends","B. Under safe weather conditions to remain controlled","C. On public holidays","D. During rainfall"] },
  { q:"What makes recovery from a major bushfire complex?", opts:["A. Only physical structures need rebuilding","B. It involves rebuilding and addressing lasting psychological impacts","C. Wildlife recovers in weeks but homes take years","D. Emotional impact is temporary but physical damage permanent"] },
  { q:"What is the main purpose of this informational text?", opts:["A. To persuade readers to become firefighters","B. To explain the causes, effects, and ecological role of bushfires","C. To describe Black Summer survivor experiences","D. To argue climate change solely causes bushfires"] },
];

const blueReadQs = [
  { q:"Why does Australia experience more bushfires than most countries?", opts:["A. More lightning storms","B. Dry native bush and hot drought-affected climate","C. Less well-trained firefighters","D. Fewer rivers and lakes"] },
  { q:"What three things does a fire need to burn?", opts:["A. Rain, lightning, and dry grass","B. Smoke, ash, and wind","C. Heat, fuel, and oxygen","D. Sunlight, soil, and dry leaves"] },
  { q:"What types of material count as fuel in a bushfire?", opts:["A. Rocks, soil, and water","B. Dry grass, leaves, and bark","C. Green plants and wet soil","D. Animals and buildings"] },
  { q:"Why are hot inland winds particularly dangerous during a fire?", opts:["A. They bring heavy rain","B. Air too humid for aircraft","C. They cause fire to spread very quickly","D. Blow smoke away making fires harder to detect"] },
  { q:"What is the purpose of a hazard reduction burn?", opts:["A. Create smoke signals for firefighters","B. Burn dry plants before fire season so there is less fuel","C. Warm the landscape for seed germination","D. Clear land for homes and farms"] },
  { q:"When are hazard reduction burns carried out?", opts:["A. Middle of fire season","B. Only at night","C. When weather is safe and conditions are controlled","D. After a major fire has passed"] },
  { q:"How many hectares burned in the 2019–2020 Black Summer?", opts:["A. 1.86 million","B. 186 million","C. 18.6 million","D. 860,000"] },
  { q:"How many people were killed by the Black Summer fires?", opts:["A. 3","B. 13","C. 33","D. 330"] },
  { q:"How many animals are believed to have died?", opts:["A. Around 1 thousand","B. Around 1 million","C. Around 10 million","D. Around 1 billion"] },
  { q:"Which cities does the text say were affected by smoke?", opts:["A. Melbourne and Adelaide","B. Sydney and Canberra","C. Brisbane and Darwin","D. Perth and Hobart"] },
  { q:"What happens to banksia cones in a fire?", opts:["A. They burn completely","B. Carried away by wind","C. Heat causes them to open and release seeds","D. Firefighters carry them to safety"] },
  { q:"Why is ash-covered ground good for banksia seeds?", opts:["A. Soft and easy for roots to grow","B. Rich in nutrients","C. Dark colour keeps seeds warm","D. Contains no insects"] },
  { q:"How do some animals survive a bushfire?", opts:["A. Run ahead to safety in towns","B. Shelter underground or in waterways","C. Rescued by firefighters","D. Climb trees to escape flames"] },
  { q:"What happens to bush environments after a bushfire?", opts:["A. Never recover permanently","B. Replaced by farms and housing","C. Native plants and animals slowly come back over time","D. Recover within a few days"] },
  { q:"What does the text say all Australians should do?", opts:["A. Volunteer as firefighters","B. Move to less fire-prone areas","C. Know what to do in a bushfire","D. Plant banksia trees as a firebreak"] },
];

const greenReadQs = [
  { q:"What does a bushfire burn?", opts:["A. Roads, bridges, and footpaths","B. Dry grass, leaves, and trees","C. Rocks, soil, and water","D. Houses and cars only"] },
  { q:"What three things does a fire need to start?", opts:["A. Water, soil, and sunlight","B. Rain, wind, and clouds","C. Heat, fuel, and air","D. Smoke, ash, and lightning"] },
  { q:"What are examples of fuel for a bushfire?", opts:["A. Roads and footpaths","B. Rocks and soil","C. Dry leaves and grass","D. Water and mud"] },
  { q:"What happens when the weather is very hot?", opts:["A. Fires slow down","B. Fires can start fast","C. Rainforests grow quickly","D. Animals come out to cool down"] },
  { q:"What makes fires spread more quickly?", opts:["A. Cold temperatures","B. Heavy rain","C. Strong winds","D. Calm still air"] },
  { q:"What are two ways bushfires can start?", opts:["A. Heavy rain and cold weather","B. Lightning and accidents","C. Strong winds and dry soil","D. Fallen trees and flooding"] },
  { q:"Who works hard to keep people safe during bushfires?", opts:["A. Doctors and nurses","B. Teachers and principals","C. Firefighters","D. Bus drivers"] },
  { q:"What is a hazard reduction burn?", opts:["A. A fire that burns out of control","B. A small careful fire to burn away dry grass and leaves","C. A fire started by lightning","D. A machine used to water the bush"] },
  { q:"Why do fire crews do hazard reduction burns?", opts:["A. To clear land for new homes","B. To warm soil for plants","C. So there is less for a big fire to burn later","D. To get rid of unwanted animals"] },
  { q:"When did the very big fires in Australia occur?", opts:["A. 2015 and 2016","B. 2017 and 2018","C. 2019 and 2020","D. 2021 and 2022"] },
  { q:"What happened to many homes during the 2019–2020 fires?", opts:["A. They were flooded","B. They were destroyed","C. They were moved to safety","D. They were left undamaged"] },
  { q:"What happened to animals during the big fires?", opts:["A. All survived by swimming","B. Taken to zoos","C. Lots of animals lost their homes","D. Animals helped firefighters"] },
  { q:"What does the banksia plant need to open its seed pods?", opts:["A. Heavy rainfall","B. Cold winters","C. Fire","D. Strong winds"] },
  { q:"What happens to banksia seeds after a fire?", opts:["A. Eaten by animals","B. They fall onto the ground and start to grow","C. Carried to faraway places","D. Stay sealed for many years"] },
  { q:"Who does the text say is always ready to help?", opts:["A. Scientists and researchers","B. Pilots and sailors","C. Firefighters and emergency workers","D. Farmers and gardeners"] },
];

const mathsY5 = [
  { q:"A fire crew had 1,240 L of water. They used 480 L on a house then 315 L on a shed. How many litres were left?", opts:["A. 445 L","B. 455 L","C. 465 L","D. 475 L"] },
  { q:"Firefighters planted 6 rows of 48 trees. A fire destroyed 85 of them. How many survived?", opts:["A. 193","B. 203","C. 213","D. 223"] },
  { q:"A shelter rescued 124 animals day 1 and 89 day 2. Then 76 were released. How many remained?", opts:["A. 127","B. 137","C. 147","D. 157"] },
  { q:"9 fire trucks carry 1,800 L each. After a fire 4,250 L were used. How many litres remained?", opts:["A. 11,950 L","B. 12,050 L","C. 12,150 L","D. 12,250 L"] },
  { q:"Volunteers filled 15 sandbags/hr for 8 hrs. 47 bags were washed away. How many remained?", opts:["A. 63","B. 73","C. 83","D. 93"] },
  { q:"345 kg food collected then 218 kg more. 412 kg distributed. How much was left?", opts:["A. 141 kg","B. 151 kg","C. 161 kg","D. 171 kg"] },
  { q:"A nature reserve of 122 ha was threatened by a fire burning at 12 ha/hr. After 7 hrs, firefighters contained the fire. How many hectares were saved?", opts:["A. 46","B. 122","C. 38","D. 84"] },
  { q:"Community raised $2,450. Spent $875 on food then $640 on clothing. How much remained?", opts:["A. $835","B. $935","C. $945","D. $955"] },
  { q:"Plane carries 3,000 L/load. After 6 loads, 4,200 L evaporated. How many L reached the fire?", opts:["A. 12,600","B. 13,600","C. 13,800","D. 14,600"] },
  { q:"265 homes in warning zone. 143 contacted by phone then 78 visited in person. How many not yet contacted?", opts:["A. 34","B. 44","C. 54","D. 64"] },
  { q:"8 firefighters per shift worked 14-hr shifts for 3 days. How many total hours?", opts:["A. 316","B. 326","C. 336","D. 346"] },
  { q:"24 boxes × 16 items. 57 items returned. How many items were kept?", opts:["A. 317","B. 327","C. 337","D. 347"] },
  { q:"Day 6 temp was 8°C below day 5's reading of 41°C. What was day 6?", opts:["A. 29°C","B. 31°C","C. 33°C","D. 35°C"] },
  { q:"Budget $15,000. Spent $4,320 on gear then $6,450 on hoses. How much remained?", opts:["A. $3,230","B. $4,230","C. $5,230","D. $6,230"] },
  { q:"540 enclosures. They set aside 7 rows of 12 enclosures for rescues, keeping 1 extra for emergencies. How many enclosures still empty?", opts:["A. 449","B. 455","C. 459","D. 461"] },
];

const mathsY3 = [
  { q:"A fire crew had 240 L of water. Used 85 L then 60 L more. How many were left?", opts:["A. 85 L","B. 95 L","C. 105 L","D. 115 L"] },
  { q:"Firefighters planted 4 rows of 12 trees. Fire burned 18. How many were left?", opts:["A. 24","B. 30","C. 34","D. 48"] },
  { q:"Rescued 35 animals Saturday, 28 Sunday. 14 released. How many remain?", opts:["A. 39","B. 47","C. 49","D. 63"] },
  { q:"3 compartments × 90 L foam each. 145 L used. How many L were left?", opts:["A. 125 L","B. 120 L","C. 115 L","D. 110 L"] },
  { q:"5 boxes × 20 items. 36 given out. How many items left?", opts:["A. 54","B. 64","C. 74","D. 84"] },
  { q:"48 kg food + 27 kg more collected. 35 kg given to animals. How much left?", opts:["A. 30 kg","B. 40 kg","C. 50 kg","D. 60 kg"] },
  { q:"120 sandbags. Used 45 on one building then 38 on another. How many unused?", opts:["A. 27","B. 37","C. 47","D. 57"] },
  { q:"6 firefighters each carried 15 L, each had 4 L left after. How many L did all 6 use?", opts:["A. 54 L","B. 60 L","C. 64 L","D. 66 L"] },
  { q:"85 animals at centre. 34 more taken in, 29 released. How many now?", opts:["A. 80","B. 90","C. 100","D. 110"] },
  { q:"Fundraiser: $180 Friday + $95 Saturday. Spent $145 on supplies. How much left?", opts:["A. $120","B. $130","C. $140","D. $150"] },
  { q:"3 hoses × 8 m tubing each. 7 m left over. How long was the original roll?", opts:["A. 24 m","B. 27 m","C. 31 m","D. 33 m"] },
  { q:"5 farms × 9 animals each. 12 needed medical care. How many were healthy?", opts:["A. 27","B. 33","C. 39","D. 45"] },
  { q:"Fire moved 7 km/hr for 4 hrs. Stopped 6 km before the town. How far was the town from the start?", opts:["A. 28 km","B. 30 km","C. 32 km","D. 34 km"] },
  { q:"96 bottles + 24 more collected. Packed into bags of 6. How many bags?", opts:["A. 18","B. 20","C. 22","D. 24"] },
  { q:"8 rows × 9 plants each. 16 plants didn't survive. How many still growing?", opts:["A. 52","B. 56","C. 60","D. 64"] },
];

async function main() {
  const groups = [
    { name: 'Week_5_Print_Red.docx', title: 'Week 5 Homework — Informational Text', body: redBody, readQs: redReadQs, mathQs: mathsY5 },
    { name: 'Week_5_Print_Blue.docx', title: 'Week 5 Homework — Informational Text', body: blueBody, readQs: blueReadQs, mathQs: mathsY5 },
    { name: 'Week_5_Print_Green.docx', title: 'Week 5 Homework — Informational Text', body: greenBody, readQs: greenReadQs, mathQs: mathsY3 },
  ];
  for (const g of groups) {
    const buf = await Packer.toBuffer(buildPrint(g.title, g.body, g.readQs, g.mathQs));
    fs.writeFileSync(path.join(__dirname, g.name), buf);
    console.log(`Created: ${g.name}`);
  }
}
main().catch(console.error);
