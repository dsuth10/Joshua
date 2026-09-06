const texts = {
  Red: {
    title: "Earth First: Why We Must Not Colonise Mars",
    paragraphs: [
      "Dear Editor,",
      "I am writing to share my deep concern about the push to send humans to colonise Mars. Space exploration is exciting, and looking at the night sky has inspired humanity for generations. However, spending hundreds of billions of dollars trying to build settlements on a dead planet is a serious mistake. World leaders and scientists must protect our living environment on Earth before chasing unrealistic dreams of Martian towns.",
      "First of all, the financial cost of going to Mars is far too high. Building giant space rockets, training crews, and designing sealed shelters requires immense wealth. This funding could instead solve urgent challenges right here on Earth. For example, public investment could restore damaged native forests, protect endangered wildlife, clean polluted oceans, and develop affordable clean energy. Diverting vital funds to build an outpost on a frozen world while our own home suffers is completely reckless.",
      "Furthermore, many people promote the false idea that Mars can serve as a backup home if Earth becomes damaged. In reality, Mars is an extremely harsh and deadly desert. The Red Planet has no breathable oxygen, almost no atmosphere, dangerous space radiation, and winter temperatures that drop past minus eighty degrees Celsius. Martian settlers would live trapped inside small underground pods. They would depend completely on fragile technology for every breath of air. Mars cannot replace Earth because its natural environment is hostile to human life.",
      "Finally, we have an important duty to care for the world that supports us. Earth provides clean drinking water, fertile soil, and fresh air to breathe. Turning our backs on our wonderful home to live in Martian dust would be foolish. We do not need to flee to a distant red rock. Instead, we must work together to heal and protect the unique planet we already call home.",
      "Yours sincerely,\nDr Evelyn Vance"
    ]
  },
  Blue: {
    title: "Why We Should Stay on Earth",
    paragraphs: [
      "Dear Editor,",
      "I am writing to share why we should not send people to live on Mars. Space rockets seem exciting, but spending billions of dollars on a distant planet is a mistake. We need to focus our time and effort on taking care of planet Earth first.",
      "To begin with, travelling to Mars is far too expensive. Governments and companies spend huge sums of money on rockets while our own planet faces real problems. This money could help protect wild animals, clean up plastic waste, and plant new forests. It makes little sense to spend fortunes on a dry planet when our own world needs help right now.",
      "In addition, Mars is a dangerous place for people. The Red Planet has no natural air to breathe, deadly cosmic rays, and freezing cold weather. People on Mars could never walk outside without thick spacesuits. They would have to stay inside small sealed pods day and night. Mars is not a cosy backup planet. It is a frozen desert that cannot support human life.",
      "Earth is the only planet that gives us clean water, fresh air, and green trees. Instead of planning to move away, we must work together to protect our wonderful home.",
      "Yours sincerely,\nMarcus Reed"
    ]
  },
  Green: {
    title: "Earth is Our Real Home",
    paragraphs: [
      "Dear Editor,",
      "I am writing to explain why people should not try to live on Mars. Big rockets look amazing, but moving humans to Mars is a bad idea. We need to look after our home planet Earth first.",
      "First, travelling to Mars costs far too much money. Building giant spaceships takes millions of dollars. We should use this money on Earth to help people, plant green trees, and clean up our oceans.",
      "Next, Mars is an unsafe and freezing red planet. It does not have fresh air for people to breathe. The weather is icy cold every day of the year. People on Mars would have to wear heavy space helmets and suits all the time. They would have to stay inside small metal rooms and could never play outside in the grass.",
      "Earth is our real home. Earth gives us clean air, cool water, and sunny days. We must protect Earth instead of flying away to a frozen rock.",
      "Yours sincerely,\nSam Taylor"
    ]
  }
};

const comp = {
  Red: [
    {
      q: "What is the primary purpose of Dr Evelyn Vance's letter to the editor?",
      a: "To celebrate recent technological breakthroughs in rocket propulsion",
      b: "To persuade readers that colonising Mars is an irresponsible use of resources",
      c: "To outline a detailed financial budget for future space tourism",
      d: "To explain the geographical terrain and mineral composition of Mars",
      ans: "B"
    },
    {
      q: "Which term best describes the author's tone throughout the letter?",
      a: "Enthusiastic and optimistic",
      b: "Neutral and indifferent",
      c: "Urgent, critical, and persuasive",
      d: "Humorous and lighthearted",
      ans: "C"
    },
    {
      q: "Why does the author describe spending hundreds of billions of dollars on Mars as a serious mistake?",
      a: "Because humans have already built thriving cities on the Moon",
      b: "Because severe environmental and social problems on Earth urgently require funding",
      c: "Because Mars has too many oceans to build dry settlements",
      d: "Because rockets produce too much noise pollution during launch",
      ans: "B"
    },
    {
      q: "According to paragraph 3, what could public funding be used for instead of Mars exploration?",
      a: "Constructing larger luxury cruise liners",
      b: "Developing weapon systems for deep space defense",
      c: "Restoring native forests, protecting wildlife, cleaning oceans, and developing clean energy",
      d: "Building underground theme parks on Earth",
      ans: "C"
    },
    {
      q: "What counterargument does the author address in paragraph 4?",
      a: "The claim that space travel is completely free of cost",
      b: "The belief that Mars can serve as a backup home if Earth is damaged",
      c: "The idea that Mars has warmer weather than Earth",
      d: "The theory that humans will quickly evolve to breathe carbon dioxide",
      ans: "B"
    },
    {
      q: "What environmental condition on Mars is highlighted to show it is hostile to human life?",
      a: "Extreme atmospheric humidity and frequent rainstorms",
      b: "Overabundant oxygen that causes uncontrolled fires",
      c: "Freezing temperatures below minus eighty degrees Celsius and lack of breathable oxygen",
      d: "Dense tropical vegetation blocking solar panels",
      ans: "C"
    },
    {
      q: "How does the author describe the daily living reality for potential Martian settlers?",
      a: "Living in spacious outdoor garden estates",
      b: "Trapped in small underground pods and totally reliant on fragile machines for air",
      c: "Travelling freely across open Martian plains in solar cars",
      d: "Sailing across frozen Martian lakes for recreation",
      ans: "B"
    },
    {
      q: "In the sentence \"Diverting vital funds to build an outpost on a frozen world...\", what does \"vital\" mean?",
      a: "Unnecessary and extra",
      b: "Crucial and essential",
      c: "Cheap and easily replaced",
      d: "Temporary and experimental",
      ans: "B"
    },
    {
      q: "Why does the author argue that moving to Mars is foolish?",
      a: "Because Earth provides irreplaceable living systems like clean water, fertile soil, and fresh air",
      b: "Because rockets take more than fifty years to reach Mars",
      c: "Because no human has ever looked through a telescope",
      d: "Because astronauts prefer travelling to Jupiter instead",
      ans: "A"
    },
    {
      q: "Which persuasive device is used in the phrase \"chasing unrealistic dreams of Martian towns\"?",
      a: "Technical jargon to explain rocket engines",
      b: "Evaluative, emotive language to criticise colonisation plans",
      c: "A statistical breakdown of government budgets",
      d: "A direct quotation from an astronaut",
      ans: "B"
    },
    {
      q: "What ethical duty does the author emphasise in the final paragraph?",
      a: "The duty to build robotic probes for deep space",
      b: "The duty to care for and protect the living planet that supports us",
      c: "The duty to sell natural resources to private space corporations",
      d: "The duty to move humanity to multiple planets as quickly as possible",
      ans: "B"
    },
    {
      q: "What can be inferred about the author's view on Martian life-support technology?",
      a: "Technology on Mars will easily solve all human health problems",
      b: "Artificial life support on Mars is fragile and cannot replace Earth's natural balance",
      c: "Modern technology should be completely banned on Earth",
      d: "Technology has already eliminated all pollution on Earth",
      ans: "B"
    },
    {
      q: "How does the structure of the letter support its persuasive intent?",
      a: "It lists random facts about astronomy without an argument",
      b: "It presents a clear contention, followed by financial, environmental, and ethical arguments",
      c: "It tells an imaginary story about an astronaut lost in space",
      d: "It alternates between debating pros and cons without taking a side",
      ans: "B"
    },
    {
      q: "Which statement would the author most likely agree with?",
      a: "\"Escaping Earth is easier than fixing climate change.\"",
      b: "\"We must invest our intelligence and wealth into healing Earth before exploring other planets.\"",
      c: "\"Governments should cancel all science education in schools.\"",
      d: "\"Mars will become a paradise within the next five years.\"",
      ans: "B"
    },
    {
      q: "What is the central message of the letter?",
      a: "Humanity must urgently focus on protecting and restoring Earth rather than attempting to colonise Mars.",
      b: "Space travel should be restricted only to robotic satellites.",
      c: "Mars has more natural resources than Earth.",
      d: "Private companies should completely take over government space programmes.",
      ans: "A"
    }
  ],
  Blue: [
    {
      q: "Why did Marcus Reed write this letter to the editor?",
      a: "To encourage children to become astronauts",
      b: "To persuade people that sending humans to live on Mars is a mistake",
      c: "To explain how rockets are built in factories",
      d: "To describe what Mars looks like through a telescope",
      ans: "B"
    },
    {
      q: "What does Marcus believe we should focus our time and effort on first?",
      a: "Building bigger space stations",
      b: "Taking care of planet Earth",
      c: "Sending robots to the Sun",
      d: "Buying expensive space telescopes",
      ans: "B"
    },
    {
      q: "According to the second paragraph, what problem does space travel to Mars create?",
      a: "It uses too much electricity in schools",
      b: "It costs far too much money while our own planet faces real problems",
      c: "It causes rainstorms on the Moon",
      d: "It makes rocket fuel too cheap",
      ans: "B"
    },
    {
      q: "Which of the following is an example given of how money could be better spent on Earth?",
      a: "Building giant gold statues",
      b: "Protecting wild animals, cleaning plastic waste, and planting forests",
      c: "Buying luxury cars for scientists",
      d: "Creating video games about Mars",
      ans: "B"
    },
    {
      q: "What makes Mars a dangerous place for human beings?",
      a: "It has too many rivers and floods",
      b: "It has no natural air to breathe, deadly cosmic rays, and freezing cold weather",
      c: "It has dense jungles full of wild predators",
      d: "It has heavy rainstorms every afternoon",
      ans: "B"
    },
    {
      q: "What would people on Mars have to wear whenever they walk outside?",
      a: "Normal winter jackets and boots",
      b: "Thick spacesuits",
      c: "Scuba diving flippers",
      d: "Sunglasses and sunhats",
      ans: "B"
    },
    {
      q: "Where would people living on Mars have to stay day and night?",
      a: "Inside large wooden farmhouses",
      b: "Inside small sealed pods",
      c: "Under open canvas tents",
      d: "In treehouses built in tall forests",
      ans: "B"
    },
    {
      q: "In the text, Mars is described as a \"frozen desert\". What does this tell the reader?",
      a: "It is dry, freezing cold, and cannot support human life naturally",
      b: "It is covered in delicious ice cream",
      c: "It has plenty of fertile soil for growing apples",
      d: "It is warm and sunny like a beach",
      ans: "A"
    },
    {
      q: "What natural gifts does Earth provide that Mars does not?",
      a: "Clean water, fresh air, and green trees",
      b: "Endless dust storms and freezing rocks",
      c: "Giant volcanoes and craters",
      d: "Space radiation and empty land",
      ans: "A"
    },
    {
      q: "What does the word \"fortunes\" mean in the phrase \"spend fortunes on a dry planet\"?",
      a: "Lucky predictions about the future",
      b: "Very large amounts of money",
      c: "Small treasure maps",
      d: "Free tickets to an event",
      ans: "B"
    },
    {
      q: "Why does Marcus reject the idea that Mars is a \"backup planet\"?",
      a: "Because humans cannot naturally survive in its harsh environment",
      b: "Because Mars is too close to the Sun",
      c: "Because rockets can never reach Mars",
      d: "Because nobody has ever seen Mars in the sky",
      ans: "A"
    },
    {
      q: "What action does Marcus call for in the final paragraph?",
      a: "Building more rockets to fly to Saturn",
      b: "Working together to protect our wonderful home on Earth",
      c: "Moving everyone to underground shelters on Earth",
      d: "Selling all spacesuits to museums",
      ans: "B"
    },
    {
      q: "How is Marcus Reed's letter organised?",
      a: "It begins with a strong opinion, gives supporting reasons, and ends with a call to action",
      b: "It tells a fictional story about an alien visit",
      c: "It lists instructions on how to build a rocket step by step",
      d: "It gives a timeline of space missions from 1950 to today",
      ans: "A"
    },
    {
      q: "Which statement best summarises Marcus's argument about money?",
      a: "Governments should print unlimited money for space travel",
      b: "Money spent on Mars missions would be better used solving problems on Earth",
      c: "Earth has run out of money completely",
      d: "Rockets cost very little money compared to planting trees",
      ans: "B"
    },
    {
      q: "What is the main message of the entire text?",
      a: "We must protect and care for Earth instead of trying to move to Mars.",
      b: "Mars is a great vacation destination for families.",
      c: "Space exploration should be banned forever.",
      d: "Astronauts are the only people who can help Earth.",
      ans: "A"
    }
  ],
  Green: [
    {
      q: "Who wrote this letter?",
      a: "Marcus Reed",
      b: "Sam Taylor",
      c: "Dr Vance",
      d: "A Martian astronaut",
      ans: "B"
    },
    {
      q: "What does Sam Taylor think about people moving to Mars?",
      a: "It is a wonderful plan",
      b: "It is a bad idea",
      c: "It should happen tomorrow",
      d: "It will be very easy",
      ans: "B"
    },
    {
      q: "What does Sam say we should look after first?",
      a: "The Moon",
      b: "Our home planet Earth",
      c: "Giant space rockets",
      d: "Distant red stars",
      ans: "B"
    },
    {
      q: "Why does Sam say going to Mars is a problem in paragraph 3?",
      a: "It costs far too much money",
      b: "The rockets are too slow",
      c: "It is too dark to fly",
      d: "There are no pilots",
      ans: "A"
    },
    {
      q: "What does Sam suggest we do with our money instead?",
      a: "Buy more video games",
      b: "Help people, plant green trees, and clean up our oceans",
      c: "Paint all rockets bright red",
      d: "Build a giant swimming pool on the Moon",
      ans: "B"
    },
    {
      q: "What is the weather like on Mars?",
      a: "Hot and sunny every day",
      b: "Icy cold every day of the year",
      c: "Warm and rainy",
      d: "Just like summer on Earth",
      ans: "B"
    },
    {
      q: "What is missing on Mars that humans need to breathe?",
      a: "Fresh air",
      b: "Water vapor",
      c: "Dust",
      d: "Cloud cover",
      ans: "A"
    },
    {
      q: "What would people on Mars have to wear all the time?",
      a: "Shorts and t-shirts",
      b: "Heavy space helmets and suits",
      c: "Raincoats and gumboots",
      d: "Party hats",
      ans: "B"
    },
    {
      q: "Where would people on Mars have to stay?",
      a: "Inside big houses with gardens",
      b: "Inside small metal rooms",
      c: "In outdoor tents on the sand",
      d: "In wooden cabins by a river",
      ans: "B"
    },
    {
      q: "What can children NOT do on Mars?",
      a: "Look at rocks",
      b: "Play outside in the grass",
      c: "Wear a helmet",
      d: "Sit inside a room",
      ans: "B"
    },
    {
      q: "What does Earth give us that makes it our real home?",
      a: "Clean air, cool water, and sunny days",
      b: "Red dust and frozen ice",
      c: "Metal rooms and spacesuits",
      d: "Deadly space rays",
      ans: "A"
    },
    {
      q: "What does Sam call Mars at the end of the letter?",
      a: "A green rock",
      b: "A frozen rock",
      c: "A bright yellow rock",
      d: "A blue rock",
      ans: "B"
    },
    {
      q: "What should people do instead of flying away to Mars?",
      a: "Stop planting trees",
      b: "Protect Earth",
      c: "Throw plastic in rivers",
      d: "Build bigger rockets",
      ans: "B"
    },
    {
      q: "What type of writing is this text?",
      a: "A recipe for baking bread",
      b: "A letter sharing an opinion",
      c: "A poem about animals",
      d: "A comic book story",
      ans: "B"
    },
    {
      q: "What is the main idea of Sam's letter?",
      a: "Earth is our home and we must protect it instead of going to Mars.",
      b: "Rockets are the best toys in the world.",
      c: "Mars is a warm place to visit.",
      d: "Space travel is completely free.",
      ans: "A"
    }
  ]
};

const mathY5 = [
  {
    q: "A school environmental club collects 864 seedlings to plant across 8 community reserves. If the seedlings are divided equally among all 8 reserves, how many seedlings does each reserve receive?",
    a: "104 seedlings",
    b: "108 seedlings",
    c: "112 seedlings",
    d: "118 seedlings",
    ans: "B"
  },
  {
    q: "A team of 6 scientists shares a total research grant of $4,350 equally to fund ocean water testing. How much funding does each scientist receive?",
    a: "$675",
    b: "$715",
    c: "$725",
    d: "$745",
    ans: "C"
  },
  {
    q: "A solar farm produces 2,736 kilowatt-hours of clean electricity over a 9-day period. On average, how many kilowatt-hours of electricity were generated each day?",
    a: "294 kWh",
    b: "304 kWh",
    c: "314 kWh",
    d: "324 kWh",
    ans: "B"
  },
  {
    q: "An organic farm harvested 1,575 kilograms of apples. The apples are packed into crates that each hold 15 kilograms. How many full crates of apples can be packed?",
    a: "95 crates",
    b: "105 crates",
    c: "115 crates",
    d: "125 crates",
    ans: "B"
  },
  {
    q: "A wildlife sanctuary has 348 injured native birds. Each large outdoor flight aviary can safely house up to 12 birds. How many aviaries are needed to house all 348 birds?",
    a: "27 aviaries",
    b: "28 aviaries",
    c: "29 aviaries",
    d: "31 aviaries",
    ans: "C"
  },
  {
    q: "A council environmental team has 1,250 native tree saplings to transport. Each small truck can carry a maximum of 45 saplings per trip. How many total trips must the truck make to transport all 1,250 saplings?",
    a: "27 trips",
    b: "28 trips",
    c: "29 trips",
    d: "30 trips",
    ans: "B"
  },
  {
    q: "A factory produces 3,890 metal water bottles. The bottles are boxed into cartons of 24. How many bottles are left over after packing as many full cartons as possible?",
    a: "2 bottles",
    b: "6 bottles",
    c: "12 bottles",
    d: "18 bottles",
    ans: "A"
  },
  {
    q: "A community raised $6,120 during a sustainability festival. The organisers distributed the money equally between 18 local river-care projects. How much money did each project receive?",
    a: "$320",
    b: "$340",
    c: "$360",
    d: "$380",
    ans: "B"
  },
  {
    q: "A bakery uses 1,848 grams of flour to make 7 identical large sourdough loaves. How many grams of flour are in each loaf?",
    a: "254 g",
    b: "264 g",
    c: "274 g",
    d: "284 g",
    ans: "B"
  },
  {
    q: "A primary school has 437 students going on an excursion to an eco-discovery centre. Each bus seats 52 passengers. How many buses must the school book so that every student has a seat?",
    a: "7 buses",
    b: "8 buses",
    c: "9 buses",
    d: "10 buses",
    ans: "C"
  },
  {
    q: "A group of 14 volunteers collected a total of 1,022 pieces of plastic debris along a beach during a clean-up. What was the average number of pieces collected per volunteer?",
    a: "68 pieces",
    b: "71 pieces",
    c: "73 pieces",
    d: "77 pieces",
    ans: "C"
  },
  {
    q: "A school bought 16 identical solar battery kits for a total cost of $1,568. What was the cost of one single solar battery kit?",
    a: "$92",
    b: "$96",
    c: "$98",
    d: "$104",
    ans: "C"
  },
  {
    q: "A water storage tank holds 5,000 litres of rainwater. If a community garden uses 125 litres each day to water crops, for how many days will the water in the tank last?",
    a: "35 days",
    b: "40 days",
    c: "45 days",
    d: "50 days",
    ans: "B"
  },
  {
    q: "A book publisher printed 2,475 copies of an environmental guide. The books are packed into boxes of 12. How many complete full boxes can be made?",
    a: "204 boxes",
    b: "206 boxes",
    c: "207 boxes",
    d: "210 boxes",
    ans: "B"
  },
  {
    q: "A recycling depot processed 4,752 kg of cardboard over 11 working days. If an equal weight was processed each day, how many kilograms of cardboard were processed per day?",
    a: "422 kg",
    b: "432 kg",
    c: "442 kg",
    d: "452 kg",
    ans: "B"
  }
];

const mathY34 = [
  {
    q: "A class collects 72 empty drink cans for recycling. If 8 students share the cans equally to count them, how many cans does each student get?",
    a: "7 cans",
    b: "8 cans",
    c: "9 cans",
    d: "10 cans",
    ans: "C"
  },
  {
    q: "A teacher has 84 coloured pencils to share equally among 4 art tables. How many coloured pencils will each table receive?",
    a: "19 pencils",
    b: "21 pencils",
    c: "22 pencils",
    d: "24 pencils",
    ans: "B"
  },
  {
    q: "A gardener has 96 flower bulbs to plant in 6 equal garden rows. How many flower bulbs are planted in each row?",
    a: "14 bulbs",
    b: "15 bulbs",
    c: "16 bulbs",
    d: "18 bulbs",
    ans: "C"
  },
  {
    q: "A pack of 60 native tree seeds is divided equally between 5 students. How many seeds does each student get?",
    a: "10 seeds",
    b: "12 seeds",
    c: "14 seeds",
    d: "15 seeds",
    ans: "B"
  },
  {
    q: "A baker bakes 108 bread rolls. She puts 9 rolls into each bag. How many bags of bread rolls does she make?",
    a: "11 bags",
    b: "12 bags",
    c: "13 bags",
    d: "14 bags",
    ans: "B"
  },
  {
    q: "There are 45 students in a sports clinic. The coach divides them into equal teams of 5. How many teams are formed?",
    a: "7 teams",
    b: "8 teams",
    c: "9 teams",
    d: "10 teams",
    ans: "C"
  },
  {
    q: "A farmer has 135 eggs. He packs them into cartons of 6. How many full cartons can he make, and how many eggs are left over?",
    a: "21 cartons and 3 eggs left over",
    b: "22 cartons and 3 eggs left over",
    c: "22 cartons and 5 eggs left over",
    d: "23 cartons and 0 eggs left over",
    ans: "B"
  },
  {
    q: "A library receives 150 new books. The librarian divides them equally across 5 empty shelves. How many books are placed on each shelf?",
    a: "25 books",
    b: "30 books",
    c: "35 books",
    d: "40 books",
    ans: "B"
  },
  {
    q: "Four friends wash cars to raise money for a wildlife shelter. They earn a total of $92 and split the money equally. How much money does each friend get?",
    a: "$21",
    b: "$22",
    c: "$23",
    d: "$24",
    ans: "C"
  },
  {
    q: "A teacher has 58 stickers to give to 7 students. If each student gets the same number of stickers, how many stickers are left over?",
    a: "1 sticker",
    b: "2 stickers",
    c: "3 stickers",
    d: "4 stickers",
    ans: "B"
  },
  {
    q: "A school garden produced 144 strawberries. If 12 children share them equally, how many strawberries does each child receive?",
    a: "10 strawberries",
    b: "11 strawberries",
    c: "12 strawberries",
    d: "14 strawberries",
    ans: "C"
  },
  {
    q: "A box contains 180 building blocks. A group of 6 children shares the blocks equally. How many blocks does each child get?",
    a: "25 blocks",
    b: "30 blocks",
    c: "35 blocks",
    d: "40 blocks",
    ans: "B"
  },
  {
    q: "A class of 29 students is going on a mini-bus trip. Each small van can seat 8 students. How many vans are needed to take all 29 students?",
    a: "3 vans",
    b: "4 vans",
    c: "5 vans",
    d: "6 vans",
    ans: "B"
  },
  {
    q: "A runner ran 84 kilometres over 7 days, running the exact same distance each day. How many kilometres did she run each day?",
    a: "11 km",
    b: "12 km",
    c: "13 km",
    d: "14 km",
    ans: "B"
  },
  {
    q: "A shop sells packs of 4 eco-friendly wooden pencils for $8. How much does one wooden pencil cost?",
    a: "$1",
    b: "$2",
    c: "$3",
    d: "$4",
    ans: "B"
  }
];

module.exports = { texts, comp, mathY5, mathY34 };
