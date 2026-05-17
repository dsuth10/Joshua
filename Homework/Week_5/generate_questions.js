const { Document, Packer, Paragraph, TextRun, AlignmentType } = require('docx');
const fs = require('fs');
const path = require('path');
const OUT = path.join(__dirname);

// ─── Question data ────────────────────────────────────────────────────────────

const redComprehension = [
  { q: "According to the text, which THREE conditions combine to make bushfires spread quickly?", opts: ["A. High temperatures, low humidity, and strong winds", "B. Low temperatures, high humidity, and calm winds", "C. Heavy rainfall, dry soil, and strong winds", "D. High humidity, dry fuel, and lightning"], ans: "A" },
  { q: "What does the term 'fuel load' refer to in the context of bushfires?", opts: ["A. The cost of running fire trucks during a bushfire", "B. The amount of dry combustible material that has built up in an area", "C. The number of firefighters deployed to a fire zone", "D. The speed at which a fire moves across the landscape"], ans: "B" },
  { q: "Why are hot, dry winds from Australia's inland regions particularly dangerous during summer?", opts: ["A. They carry sparks from distant fires directly into cities", "B. They reduce fuel load by drying out vegetation too quickly", "C. They can cause a fire to spread very quickly", "D. They cause firefighting aircraft to be grounded"], ans: "C" },
  { q: "What is the main purpose of a hazard reduction burn?", opts: ["A. To destroy invasive plant species before spring", "B. To remove dry vegetation so future fires have less fuel", "C. To create firebreaks around major cities", "D. To replenish soil nutrients for native plants"], ans: "B" },
  { q: "How large was the area burned during the 2019–2020 Black Summer fires?", opts: ["A. 1.86 million hectares", "B. 186 million hectares", "C. 18.6 million hectares", "D. 1860 hectares"], ans: "C" },
  { q: "The text compares the area burned in the Black Summer fires to which country?", opts: ["A. France", "B. Syria", "C. Japan", "D. Portugal"], ans: "B" },
  { q: "What does the text say happened to air quality in major cities during the Black Summer fires?", opts: ["A. Air quality was only slightly affected for a few days", "B. Air quality improved because fires burned away pollution", "C. Thick smoke caused dangerous air quality for weeks", "D. Cities were evacuated before smoke could reach them"], ans: "C" },
  { q: "How many direct human deaths did the Black Summer fires cause, according to the text?", opts: ["A. 13", "B. 33", "C. 133", "D. 330"], ans: "B" },
  { q: "Why do banksia cones remain sealed under normal conditions?", opts: ["A. To protect seeds from animals that might eat them", "B. Because they only open when exposed to intense heat", "C. Because they need rainfall to soften before opening", "D. To conserve water during drought conditions"], ans: "B" },
  { q: "What advantage does ash-rich soil provide for banksia seeds after a fire?", opts: ["A. It is harder and more compact, holding seeds in place", "B. It is nutrient-rich, providing ideal conditions for germination", "C. It is cooler than normal soil, preventing seeds from drying out", "D. It contains more water, reducing the need for rainfall"], ans: "B" },
  { q: "How does the grass tree survive a bushfire, according to the text?", opts: ["A. Its roots store enough water to extinguish nearby flames", "B. Its leaves burn quickly, releasing a chemical that repels fire", "C. Its thick leaf base protects its growing point from heat", "D. It sheds all leaves before the fire season begins"], ans: "C" },
  { q: "What does the text suggest about the relationship between Australian plants and fire?", opts: ["A. Australian plants evolved adaptations that allow them to survive and benefit from fire", "B. All Australian plants are destroyed by fire and must be replanted by humans", "C. Only introduced plant species can survive the intensity of Australian bushfires", "D. Australian plants evolved to prevent fires from starting in the first place"], ans: "A" },
  { q: "Which statement best describes why hazard reduction burns must be carefully timed?", opts: ["A. They must occur only after the fire season has officially ended", "B. They must be lit under safe weather conditions to remain controlled", "C. They must happen on public holidays when fewer people are outdoors", "D. They must coincide with rainfall to ensure the fire spreads evenly"], ans: "B" },
  { q: "According to the text, what makes the recovery from a major bushfire complex?", opts: ["A. The recovery only involves rebuilding physical structures such as homes", "B. It involves rebuilding infrastructure and addressing lasting psychological impacts", "C. Wildlife populations recover within weeks, but homes take years to rebuild", "D. The emotional impact is temporary but the physical damage is permanent"], ans: "B" },
  { q: "What is the main purpose of this informational text?", opts: ["A. To persuade readers to become volunteer firefighters", "B. To explain the causes, effects, and ecological role of Australian bushfires", "C. To describe the personal experiences of Black Summer survivors", "D. To argue that climate change is solely responsible for Australian bushfires"], ans: "B" },
];

const blueComprehension = [
  { q: "According to the text, why does Australia experience more bushfires than most other countries?", opts: ["A. Australia has more lightning storms than other countries", "B. Much of Australia is covered in dry native bush and has a hot, drought-affected climate", "C. Australian firefighters are not as well-trained as those in other countries", "D. Australia has fewer rivers and lakes to slow fires down"], ans: "B" },
  { q: "What three things does a fire need to burn?", opts: ["A. Rain, lightning, and dry grass", "B. Smoke, ash, and wind", "C. Heat, fuel, and oxygen", "D. Sunlight, soil, and dry leaves"], ans: "C" },
  { q: "What types of material count as 'fuel' in a bushfire?", opts: ["A. Rocks, soil, and water", "B. Dry grass, leaves, and bark", "C. Green plants and wet soil", "D. Animals and buildings"], ans: "B" },
  { q: "Why are hot winds from Australia's dry inland particularly dangerous during a fire?", opts: ["A. They bring heavy rain that can make fires harder to fight", "B. They make the air too humid for aircraft to fly safely", "C. They can cause a fire to spread very quickly", "D. They blow smoke away from cities, making it harder to detect fires"], ans: "C" },
  { q: "What is the purpose of a hazard reduction burn?", opts: ["A. To create smoke signals so that firefighters can locate fires quickly", "B. To burn dry plants before the fire season so there is less fuel for future fires", "C. To warm the landscape so that native seeds can germinate", "D. To clear land for new homes and farms"], ans: "B" },
  { q: "When are hazard reduction burns carried out?", opts: ["A. In the middle of the fire season when fires are at their worst", "B. Only at night so the smoke does not affect people", "C. When the weather is safe and conditions are controlled", "D. After a major bushfire has already passed through an area"], ans: "C" },
  { q: "How many hectares burned during the 2019–2020 Black Summer fires?", opts: ["A. 1.86 million", "B. 186 million", "C. 18.6 million", "D. 860,000"], ans: "C" },
  { q: "How many people were killed by the Black Summer fires?", opts: ["A. 3", "B. 13", "C. 33", "D. 330"], ans: "C" },
  { q: "How many animals are believed to have died as a result of the Black Summer fires?", opts: ["A. Around 1 thousand", "B. Around 1 million", "C. Around 10 million", "D. Around 1 billion"], ans: "D" },
  { q: "Which cities does the text mention were affected by smoke from the Black Summer fires?", opts: ["A. Melbourne and Adelaide", "B. Sydney and Canberra", "C. Brisbane and Darwin", "D. Perth and Hobart"], ans: "B" },
  { q: "According to the text, what happens to banksia cones in a fire?", opts: ["A. They burn completely, destroying the seeds inside", "B. They are carried away by the wind before the fire reaches them", "C. The heat causes them to open and release their seeds", "D. They fall off the tree and are carried by firefighters to safety"], ans: "C" },
  { q: "Why is ash-covered ground good for banksia seeds after a fire?", opts: ["A. It is soft and easy for roots to grow through", "B. It is rich in nutrients that help seeds grow", "C. It is dark in colour, which helps seeds stay warm", "D. It contains no insects that might eat the seeds"], ans: "B" },
  { q: "How do some animals survive a bushfire, according to the text?", opts: ["A. They run ahead of the fire to reach safety in towns", "B. They shelter underground or in waterways", "C. They are rescued by firefighters and taken to shelters", "D. They climb trees to escape the flames below"], ans: "B" },
  { q: "Which of the following best describes what happens to bush environments after a bushfire?", opts: ["A. They never recover and remain barren permanently", "B. They are quickly replaced by farms and housing developments", "C. Native plants and animals slowly come back over time", "D. They recover within a few days once the ash cools down"], ans: "C" },
  { q: "What does the text say all Australians should do?", opts: ["A. Volunteer as firefighters during the fire season", "B. Move to areas that are less likely to be affected by fires", "C. Know what to do in a bushfire", "D. Plant banksia trees around their homes as a natural firebreak"], ans: "C" },
];

const greenComprehension = [
  { q: "What does a bushfire burn?", opts: ["A. Roads, bridges, and footpaths", "B. Dry grass, leaves, and trees", "C. Rocks, soil, and water", "D. Houses, cars, and boats only"], ans: "B" },
  { q: "What three things does a fire need to start?", opts: ["A. Water, soil, and sunlight", "B. Rain, wind, and clouds", "C. Heat, fuel, and air", "D. Smoke, ash, and lightning"], ans: "C" },
  { q: "What are examples of fuel for a bushfire, according to the text?", opts: ["A. Roads and footpaths", "B. Rocks and soil", "C. Dry leaves and grass", "D. Water and mud"], ans: "C" },
  { q: "What does the text say happens when the weather is very hot?", opts: ["A. Fires slow down and stop", "B. Fires can start fast", "C. Rainforests grow more quickly", "D. Animals come out to cool down"], ans: "B" },
  { q: "What makes fires spread even more quickly?", opts: ["A. Cold temperatures", "B. Heavy rain", "C. Strong winds", "D. Calm and still air"], ans: "C" },
  { q: "According to the text, what are two ways that bushfires can start?", opts: ["A. Heavy rain and cold weather", "B. Lightning and accidents", "C. Strong winds and dry soil", "D. Fallen trees and flooding"], ans: "B" },
  { q: "Who does the text say works hard to keep people safe during bushfires?", opts: ["A. Doctors and nurses", "B. Teachers and principals", "C. Firefighters", "D. Bus drivers"], ans: "C" },
  { q: "What is a hazard reduction burn?", opts: ["A. A big fire that burns out of control", "B. A small, careful fire lit to burn away dry grass and leaves", "C. A fire started by lightning in dry conditions", "D. A machine used to water dry bushland"], ans: "B" },
  { q: "Why do fire crews do hazard reduction burns?", opts: ["A. To clear land for new homes", "B. To warm the soil so plants grow better", "C. So there is less for a big fire to burn later on", "D. To get rid of unwanted animals"], ans: "C" },
  { q: "When did the very big fires in Australia occur?", opts: ["A. 2015 and 2016", "B. 2017 and 2018", "C. 2019 and 2020", "D. 2021 and 2022"], ans: "C" },
  { q: "What happened to many homes during the 2019–2020 fires?", opts: ["A. They were flooded", "B. They were destroyed", "C. They were moved to safer areas", "D. They were left completely undamaged"], ans: "B" },
  { q: "What happened to animals during the big fires?", opts: ["A. All animals survived by swimming in rivers", "B. Animals were taken to zoos for safety", "C. Lots of animals lost their homes", "D. Animals helped firefighters put out the fires"], ans: "C" },
  { q: "What does the banksia plant need in order to open its seed pods?", opts: ["A. Heavy rainfall", "B. Cold winters", "C. Fire", "D. Strong winds"], ans: "C" },
  { q: "What happens to the banksia seeds after a fire?", opts: ["A. They are eaten by animals living in the ash", "B. They fall onto the ground and start to grow", "C. They are carried by wind to faraway places", "D. They stay sealed inside the pod for many years"], ans: "B" },
  { q: "Who does the text say is always ready to help during a bushfire?", opts: ["A. Scientists and researchers", "B. Pilots and sailors", "C. Firefighters and emergency workers", "D. Farmers and gardeners"], ans: "C" },
];

// ─── Maths Questions ──────────────────────────────────────────────────────────
// Year 5: AC9M5N09 — multi-operation word problems (add→subtract, multiply→subtract, add→multiply)
// All set in bushfire contexts

const mathsYear5 = [
  { q: "A fire crew had 1,240 litres of water on their truck. They used 480 litres to protect one house and then used another 315 litres on a nearby shed. How many litres of water were left?", opts: ["A. 445 litres", "B. 455 litres", "C. 465 litres", "D. 475 litres"], ans: "A" },
  { q: "Firefighters planted 6 rows of firebreak trees with 48 trees in each row. A bushfire then destroyed 85 of them. How many trees survived?", opts: ["A. 193", "B. 203", "C. 213", "D. 223"], ans: "B" },
  { q: "A wildlife shelter rescued 124 animals on the first day and 89 animals on the second day. Of all the animals rescued, 76 were released back into the wild. How many animals remained at the shelter?", opts: ["A. 127", "B. 137", "C. 147", "D. 157"], ans: "B" },
  { q: "Each of 9 fire trucks carries 1,800 litres of water. After fighting a fire, a total of 4,250 litres had been used across all trucks. How many litres remained?", opts: ["A. 11,950 litres", "B. 12,050 litres", "C. 12,150 litres", "D. 12,250 litres"], ans: "A" },
  { q: "Volunteers filled 15 sandbags per hour to protect homes. After 8 hours of work, a flood caused 47 sandbags to be washed away. How many sandbags were still in place?", opts: ["A. 63", "B. 73", "C. 83", "D. 93"], ans: "B" },
  { q: "A rescue team collected 345 kilograms of food donations. They then collected 218 kilograms more. They distributed 412 kilograms to fire-affected families. How much food was left?", opts: ["A. 141 kg", "B. 151 kg", "C. 161 kg", "D. 171 kg"], ans: "B" },
  { q: "A nature reserve of 122 hectares was threatened by a bushfire burning at 12 hectares per hour. After 7 hours, firefighters successfully contained the fire. How many hectares of the reserve were saved from burning?", opts: ["A. 46 hectares", "B. 122 hectares", "C. 38 hectares", "D. 84 hectares"], ans: "C" },
  { q: "A community raised $2,450 to help bushfire victims. They spent $875 on food and then $640 on clothing. How much money remained?", opts: ["A. $835", "B. $935", "C. $945", "D. $955"], ans: "B" },
  { q: "An aerial firefighting plane can carry 3,000 litres of water per load. After 6 loads, it had dropped water over a fire zone, and 4,200 litres had evaporated before reaching the flames. How many litres actually reached the fire?", opts: ["A. 12,600 litres", "B. 13,600 litres", "C. 13,800 litres", "D. 14,600 litres"], ans: "C" },
  { q: "There were 265 homes in a bushfire warning zone. Emergency workers contacted 143 residents and then visited 78 more homes in person. How many homes had not yet been contacted?", opts: ["A. 34", "B. 44", "C. 54", "D. 64"], ans: "B" },
  { q: "A fire station has 8 firefighters per shift. During a major fire event, each firefighter worked 14-hour shifts over 3 days. How many total firefighter hours were worked?", opts: ["A. 316 hours", "B. 326 hours", "C. 336 hours", "D. 346 hours"], ans: "C" },
  { q: "Volunteers packed 24 boxes of supplies with 16 items in each box. After distributing them to families, 57 items were returned because families already had them. How many items were kept?", opts: ["A. 317", "B. 327", "C. 337", "D. 347"], ans: "B" },
  { q: "A fire weather monitoring station recorded temperatures for 5 days. The total temperature across those days was 187 degrees Celsius. On the sixth day, the temperature dropped by 8 degrees from the previous day's reading of 41 degrees. What was the temperature on day 6?", opts: ["A. 29°C", "B. 31°C", "C. 33°C", "D. 35°C"], ans: "C" },
  { q: "Firefighters had a budget of $15,000 for equipment. They spent $4,320 on protective gear and then $6,450 on hoses and pumps. How much of their budget remained?", opts: ["A. $3,230", "B. $4,230", "C. $5,230", "D. $6,230"], ans: "B" },
  { q: "A wildlife organisation has 540 animal enclosures. They set aside 7 rows of enclosures with 12 enclosures in each row for new rescues, and kept 1 extra enclosure for emergencies. How many enclosures were still empty?", opts: ["A. 449", "B. 455", "C. 459", "D. 461"], ans: "B" },
];

// Year 3/4: AC9M3N06 — multi-operation word problems, smaller numbers
const mathsYear3 = [
  { q: "A fire crew had 240 litres of water. They used 85 litres on one fire and then 60 litres on another. How many litres were left?", opts: ["A. 85 litres", "B. 95 litres", "C. 105 litres", "D. 115 litres"], ans: "B" },
  { q: "Firefighters planted 4 rows of trees with 12 trees in each row. A fire then burned down 18 of them. How many trees were left?", opts: ["A. 24", "B. 30", "C. 34", "D. 48"], ans: "B" },
  { q: "A shelter rescued 35 animals on Saturday and 28 animals on Sunday. Then 14 animals were released back into the wild. How many animals were still at the shelter?", opts: ["A. 39", "B. 47", "C. 49", "D. 63"], ans: "C" },
  { q: "A fire truck has 3 compartments, each holding 90 litres of foam. After fighting a fire, 145 litres of foam were used. How many litres of foam were left?", opts: ["A. 125 litres", "B. 120 litres", "C. 115 litres", "D. 110 litres"], ans: "A" },
  { q: "Volunteers made 5 boxes of food donations with 20 items in each box. Then 36 items were given out to families. How many items were left?", opts: ["A. 54", "B. 64", "C. 74", "D. 84"], ans: "B" },
  { q: "A wildlife carer collected 48 kilograms of food. She then collected 27 kilograms more. She gave 35 kilograms to animals in care. How much food was left?", opts: ["A. 30 kg", "B. 40 kg", "C. 50 kg", "D. 60 kg"], ans: "B" },
  { q: "A community had 120 sandbags. They used 45 to protect one building and then 38 to protect another. How many sandbags were not used?", opts: ["A. 27", "B. 37", "C. 47", "D. 57"], ans: "B" },
  { q: "A fire station has 6 firefighters. Each firefighter carried 15 litres of water in their backpack. After the fire, each person had 4 litres left. How many litres of water did all 6 firefighters use in total?", opts: ["A. 54 litres", "B. 60 litres", "C. 64 litres", "D. 66 litres"], ans: "D" },
  { q: "There were 85 animals at a rescue centre. Helpers took in 34 more animals and then 29 animals were returned to the wild. How many animals were at the centre now?", opts: ["A. 80", "B. 90", "C. 100", "D. 110"], ans: "B" },
  { q: "A fundraiser earned $180 on Friday and $95 on Saturday. They then spent $145 on supplies for fire victims. How much money was left?", opts: ["A. $120", "B. $130", "C. $140", "D. $150"], ans: "B" },
  { q: "Firefighters had 3 hoses and each hose needed 8 metres of tubing to repair. After repairs, 7 metres of tubing were left over from the original roll. How long was the original roll?", opts: ["A. 24 metres", "B. 27 metres", "C. 31 metres", "D. 33 metres"], ans: "C" },
  { q: "A rescue team drove to 5 farms and checked on 9 animals at each farm. They found that 12 animals needed medical care. How many animals were healthy?", opts: ["A. 27", "B. 33", "C. 39", "D. 45"], ans: "B" },
  { q: "A fire burned for 4 hours and moved 7 kilometres each hour. Firefighters stopped it 6 kilometres before it reached the town. How far was the town from where the fire started?", opts: ["A. 28 km", "B. 30 km", "C. 32 km", "D. 34 km"], ans: "D" },
  { q: "A school collected 96 bottles of water to donate. Students then collected 24 more. They packed them into bags of 6 bottles each. How many bags did they make?", opts: ["A. 18 bags", "B. 20 bags", "C. 22 bags", "D. 24 bags"], ans: "B" },
  { q: "A team planted 8 rows of shrubs with 9 plants in each row. Over the next week, 16 plants did not survive. How many plants were still growing?", opts: ["A. 52", "B. 56", "C. 60", "D. 64"], ans: "B" },
];

// ─── Doc builder ──────────────────────────────────────────────────────────────

function buildDoc(questions) {
  const children = [];
  questions.forEach((item, i) => {
    const num = i + 1;
    children.push(
      new Paragraph({ spacing: { before: 160, after: 40 }, children: [new TextRun({ text: `${num}. ${item.q}`, bold: true, size: 22, font: 'Arial' })] })
    );
    item.opts.forEach(opt => {
      children.push(
        new Paragraph({ spacing: { before: 0, after: 0 }, indent: { left: 360 }, children: [new TextRun({ text: opt, size: 22, font: 'Arial' })] })
      );
    });
    children.push(
      new Paragraph({ spacing: { before: 40, after: 80 }, children: [new TextRun({ text: `ANSWER: ${item.ans}`, bold: true, size: 22, font: 'Arial', color: '2E7D32' })] })
    );
    children.push(
      new Paragraph({ spacing: { before: 0, after: 80 }, children: [new TextRun({ text: 'POINT: 1', bold: true, size: 22, font: 'Arial', color: '2E7D32' })] })
    );
  });

  return new Document({
    styles: { default: { document: { run: { font: 'Arial', size: 22 } } } },
    sections: [{
      properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 } } },
      children
    }]
  });
}

async function main() {
  const files = [
    { name: 'Week_5_Questions_Red.docx',   qs: [...redComprehension, ...mathsYear5] },
    { name: 'Week_5_Questions_Blue.docx',  qs: [...blueComprehension, ...mathsYear5] },
    { name: 'Week_5_Questions_Green.docx', qs: [...greenComprehension, ...mathsYear3] },
  ];

  for (const f of files) {
    const buf = await Packer.toBuffer(buildDoc(f.qs));
    fs.writeFileSync(path.join(OUT, f.name), buf);
    console.log(`Created: ${f.name}`);
  }
}

main().catch(console.error);
