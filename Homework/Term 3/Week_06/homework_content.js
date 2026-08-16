const texts = {
  Red: {
    title: "Guardians of the Rainforest: The Dayak Peoples of Borneo",
    paragraphs: [
      "The Dayak are the native peoples of Borneo, the third-largest island in the world. Borneo is shared by Indonesia, Malaysia and Brunei. It is covered in thick tropical rainforests and wide rivers. For thousands of years, many Dayak groups have lived here, such as the Iban, Kayan, Kenyah and Bidayuh. Each group has rich cultural traditions. These traditions are closely tied to the land, plants and animals of the rainforest.",
      "In traditional Dayak life, rivers served as the main highways for travel and trade. People built their villages along these waterways. They built large homes called longhouses, known as rumah betang or lamin. These longhouses were raised on strong wooden stilts made of hard ironwood. The stilts protected people from floods and wild animals. A single longhouse could be over one hundred metres long. It could shelter dozens of families under one roof. Private family rooms opened onto a wide shared porch. This large porch was used for village meetings, daily tasks, music, and telling old stories.",
      "Dayak farming relies on customary knowledge and rotational planting, called ladang. Farmers clear small forest plots to grow hill rice, vegetables, fruits and herbs. After a few harvests, the plot is left alone. This allows the forest soil to rest and grow back naturally. The rainforest also gives useful materials for crafts. Skilled makers weave strong baskets from rattan vines. They carve wooden shields with detailed patterns, and string colourful beads into festive clothing. During harvest feasts like Gawai Dayak, musicians play the sape. The sape is a wooden boat-shaped lute that makes gentle, plucked notes.",
      "Today, Dayak communities face changes from logging, mining and palm oil farms. These activities can harm forest plants and animals and change traditional ways of life. In response, Dayak leaders and young people work to protect their ancestral lands. They combine customary community rules with modern digital map tools to record forest borders. By protecting their homelands, the Dayak people preserve their ancient culture. They also help save one of the most important rainforests on Earth."
    ]
  },
  Blue: {
    title: "The Dayak Peoples of Borneo",
    paragraphs: [
      "The Dayak are the native peoples of Borneo. Borneo is a huge tropical island in Southeast Asia. It is shared by Indonesia, Malaysia and Brunei. Thick green rainforests and long rivers cover much of the land. For thousands of years, many Dayak groups have lived here, such as the Iban, Kayan and Kenyah. Each group has its own rich culture and customs.",
      "In traditional times, rivers were the main roads for Dayak families. People travelled by boat and built their towns next to the water. They built large homes called longhouses. A longhouse is built on tall wooden poles called stilts. These poles keep the house safe from floods and forest animals. One longhouse can be more than one hundred metres long. Dozens of families can live inside together under one roof. Each family has its own room. All the rooms open onto a wide shared porch. Families meet on the porch to talk, work, make music and share stories.",
      "Dayak people are skilled farmers. They use a method called ladang, which means rotational farming. Farmers clear small patches of land to grow rice, vegetables and fruit. When the soil needs a rest, they move to another plot. This allows the old patch to grow trees and heal naturally. The forest gives useful items for crafts. Craft workers weave baskets from rattan vines, carve wooden shields, and make beaded clothes. At harvest time, they celebrate festivals like Gawai Dayak. People play the sape, a wooden lute that makes lovely, calm sounds.",
      "Today, Dayak groups face challenges from logging, mining and new palm oil farms. These activities can harm the rainforest. Dayak leaders and young people work to protect their forest home. They use customary rules and modern digital maps to mark their lands. This helps save their culture and the rainforest."
    ]
  },
  Green: {
    title: "The Dayak People of Borneo",
    paragraphs: [
      "The Dayak people live on the island of Borneo. Borneo is a big island with thick, green rainforests. Many rivers flow through the land. The Dayak have lived here for a very long time.",
      "Dayak families built big homes called longhouses. A longhouse stands on tall wooden stilts. The stilts keep the house safe from flood waters. Many families live together in one longhouse. Each family has its own room. All the rooms open onto a big porch. People sit on the porch to talk, work, and tell stories.",
      "Dayak people grow rice and vegetables on small forest plots. When the soil is tired, they let the forest grow back. This keeps the land healthy. People also make baskets from vines and carve wooden shields. At harvest time, they have big celebrations. Musicians play the sape, a wooden lute that makes gentle music.",
      "Today, trees are cut down for wood and oil palm farms. Dayak people are working hard to protect their forest home. They use maps to guard their land and keep their culture alive."
    ]
  }
};

const comp = {
  Red: [
    { q: "Why are the Dayak referred to as the native peoples of Borneo?", a: "They moved to Borneo very recently.", b: "They have lived on Borneo for thousands of years and developed cultures tied to its land.", c: "They live only on coastal trading ships.", d: "They only visit Borneo during harvest festivals.", ans: "B" },
    { q: "Which three nations share territory on the island of Borneo?", a: "Indonesia, Malaysia and Brunei", b: "Indonesia, Thailand and Singapore", c: "Australia, Malaysia and Indonesia", d: "Brunei, Vietnam and the Philippines", ans: "A" },
    { q: "Why did traditional Dayak communities build their villages along rivers?", a: "Rivers were the only place to grow crops.", b: "Rivers served as the main highways for travel and trade.", c: "The interior forests were completely flat.", d: "Longhouses could only float on water.", ans: "B" },
    { q: "What was the practical purpose of raising longhouses on tall stilts made of ironwood?", a: "To catch higher winds for cooling only", b: "To prevent the longhouse from expanding over 100 metres", c: "To protect inhabitants from floods and forest animals", d: "To keep the building hidden underground", ans: "C" },
    { q: "What communal benefit did the longhouse design provide to Dayak villages?", a: "It forced each family to live in total isolation.", b: "It allowed dozens of families to share a wide porch for meetings, daily tasks and storytelling.", c: "It eliminated the need for farming.", d: "It replaced all customary laws.", ans: "B" },
    { q: "How does the rotational planting method (ladang) support the environment?", a: "It permanently clears large areas of primary rainforest.", b: "It relies completely on chemical fertilisers.", c: "It leaves plots fallow after a few harvests so the soil can recover naturally.", d: "It stops any crops other than hill rice from growing.", ans: "C" },
    { q: "Which of the following is NOT mentioned as a crop grown by Dayak farmers?", a: "Hill rice", b: "Vegetables", c: "Wheat", d: "Medicinal herbs", ans: "C" },
    { q: "What natural forest material is gathered to weave traditional baskets?", a: "Rattan vines", b: "Ironwood logs", c: "Palm oil leaves", d: "Metal wire", ans: "A" },
    { q: "What is the sape, and what is its role in Dayak culture?", a: "A heavy stone tool for ironwood carving", b: "A wooden boat-shaped lute played during harvest feasts to produce gentle melodies", c: "A ceremonial shield woven from vines", d: "A digital map tool used to mark boundaries", ans: "B" },
    { q: "What festival is specifically mentioned as a harvest celebration?", a: "Rumah Betang", b: "Ladang Day", c: "Gawai Dayak", d: "Lamin Sape", ans: "C" },
    { q: "According to the text, which modern commercial activities challenge Borneo's ecosystems?", a: "Weaving rattan baskets and singing", b: "Logging, mining and palm oil farms", c: "Building wooden stilts and playing the sape", d: "Practising rotational fallow farming", ans: "B" },
    { q: "How are contemporary Dayak leaders and youth responding to environmental challenges?", a: "By abandoning traditional customs and moving to big cities", b: "By combining customary community rules with modern digital map tools to record borders", c: "By stopping all farming of rice and vegetables", d: "By selling their ancestral lands to mining companies", ans: "B" },
    { q: "What can be inferred about the relationship between Dayak culture and the rainforest?", a: "Dayak culture is completely independent of the rainforest environment.", b: "Protecting ancestral lands is essential for preserving Dayak cultural heritage and biodiversity.", c: "Dayak traditions began only after modern logging started.", d: "The rainforest is viewed solely as a source of commercial timber.", ans: "B" },
    { q: "In the context of the longhouse, what was the function of the private family rooms?", a: "They served as public council halls for the entire village.", b: "They housed individual families while opening onto the shared communal porch.", c: "They were used exclusively for storing grain.", d: "They were reserved only for visiting traders.", ans: "B" },
    { q: "What is the primary central idea of the text?", a: "Borneo is an island with no modern industries or cities.", b: "The Dayak peoples have deep cultural ties to Borneo's rainforests and are actively working to protect their heritage.", c: "The sape is the only musical instrument played in Southeast Asia.", d: "Ironwood is the only tree species found in Borneo.", ans: "B" }
  ],
  Blue: [
    { q: "Where do the Dayak peoples live?", a: "On the island of Borneo in Southeast Asia", b: "In the mountains of New Zealand", c: "On islands in the Mediterranean Sea", d: "In the deserts of Australia", ans: "A" },
    { q: "Which countries share the island of Borneo?", a: "Indonesia, Malaysia and Brunei", b: "Australia, Fiji and Samoa", c: "Japan, China and Korea", d: "Thailand, Vietnam and Laos", ans: "A" },
    { q: "Why were rivers so important in traditional Dayak life?", a: "They were used to build roads on dry land.", b: "They were the main roads for travel and boat transport.", c: "They were the only place trees could grow.", d: "They were used to stop all farming.", ans: "B" },
    { q: "Why are longhouses built on tall wooden stilts?", a: "To catch rain for drinking water", b: "To keep the home safe from flood waters and forest animals", c: "To make the house easy to roll across land", d: "To hide the building underground", ans: "B" },
    { q: "How long can a traditional longhouse be?", a: "Less than five metres", b: "Exactly ten metres", c: "More than one hundred metres", d: "Several kilometres", ans: "C" },
    { q: "What happened on the wide shared porch of a longhouse?", a: "Only strangers were allowed to enter.", b: "Families gathered to talk, work, make music and share stories.", c: "It was used only to store seeds.", d: "Boats were kept there all year.", ans: "B" },
    { q: "What does the farming method ladang mean?", a: "Planting crops in deep ocean water", b: "Rotational farming where plots are given a rest to heal naturally", c: "Cutting down all trees permanently", d: "Using heavy machines in large factories", ans: "B" },
    { q: "What crops do Dayak farmers grow on their small plots?", a: "Rice, vegetables and fruit", b: "Wheat, oats and barley", c: "Apples, cherries and potatoes only", d: "Seaweed and kelp", ans: "A" },
    { q: "What do craft workers use rattan vines for?", a: "Weaving baskets", b: "Building boat engines", c: "Making ironwood poles", d: "Painting digital maps", ans: "A" },
    { q: "What musical instrument is played during harvest celebrations like Gawai Dayak?", a: "The trumpet", b: "The piano", c: "The sape", d: "The violin", ans: "C" },
    { q: "What does the sape look like and how is it played?", a: "It is a round metal drum beaten with sticks.", b: "It is a wooden lute that makes calm, plucked sounds.", c: "It is a long bamboo flute blown with air.", d: "It is a set of stone chimes.", ans: "B" },
    { q: "What three activities are currently challenging the rainforest in Borneo?", a: "Swimming, canoeing and fishing", b: "Logging, mining and new palm oil farms", c: "Weaving baskets, carving wood and singing", d: "Planting rice, fruit and herbs", ans: "B" },
    { q: "How are Dayak people helping to protect their forest home today?", a: "By using customary rules and modern digital maps to mark their lands", b: "By moving away from Borneo completely", c: "By cutting down all remaining trees", d: "By stopping all harvest celebrations", ans: "A" },
    { q: "Which group of people is described as living in a Dayak longhouse?", a: "Dozens of families living together under one roof", b: "Only one person per longhouse", c: "Only visitors from other countries", d: "Factory workers from big cities", ans: "A" },
    { q: "What is the main message of the text?", a: "Dayak culture has a rich history tied to nature, and people are working to protect it.", b: "Longhouses are no longer built with wood.", c: "Borneo has no rivers or forests left.", d: "Farming cannot be done on islands.", ans: "A" }
  ],
  Green: [
    { q: "On which island do the Dayak people live?", a: "Borneo", b: "Tasmania", c: "Hawaii", d: "Madagascar", ans: "A" },
    { q: "What kind of forest covers Borneo?", a: "Snowy pine forest", b: "Dry desert scrub", c: "Thick, green rainforest", d: "Grassland plains", ans: "C" },
    { q: "What is the name of the big homes Dayak families built?", a: "Igloos", b: "Longhouses", c: "Tents", d: "Castles", ans: "B" },
    { q: "Why is a longhouse built on tall wooden stilts?", a: "To keep it safe from flood waters", b: "To make it roll fast", c: "To touch the clouds", d: "To hide under water", ans: "A" },
    { q: "Who lives together in a longhouse?", a: "Only one person", b: "Many families together under one roof", c: "Only forest birds", d: "Nobody lives there", ans: "B" },
    { q: "What do all the family rooms open onto?", a: "A big porch", b: "A dark cave", c: "A swimming pool", d: "A stone wall", ans: "A" },
    { q: "What do people do on the big porch?", a: "Talk, work, and tell stories", b: "Sleep all day long", c: "Drive cars", d: "Fly planes", ans: "A" },
    { q: "What two crops do Dayak people grow on small forest plots?", a: "Rice and vegetables", b: "Wheat and oats", c: "Apples and pears", d: "Grass and seaweed", ans: "A" },
    { q: "What happens when the soil is tired after farming?", a: "People let the forest grow back to heal the land.", b: "People throw away the soil.", c: "People pave the land with concrete.", d: "People flood the land forever.", ans: "A" },
    { q: "What do Dayak craft makers weave baskets from?", a: "Plastic strips", b: "Vines from the forest", c: "Metal wires", d: "Paper strings", ans: "B" },
    { q: "What do craft makers carve from wood?", a: "Wooden shields", b: "Glass windows", c: "Steel cars", d: "Metal coins", ans: "A" },
    { q: "When do Dayak communities have big celebrations?", a: "In the middle of winter", b: "At harvest time", c: "Only when it snows", d: "Every hour", ans: "B" },
    { q: "What instrument makes gentle music at celebrations?", a: "The drum", b: "The flute", c: "The sape", d: "The bell", ans: "C" },
    { q: "Why are trees being cut down in Borneo today?", a: "For wood and oil palm farms", b: "To make space for snow", c: "To build sandcastles", d: "To dry out rivers", ans: "A" },
    { q: "How do Dayak people guard their land today?", a: "They use maps to guard their land and keep their culture alive.", b: "They leave the island forever.", c: "They stop singing music.", d: "They build stone castles.", ans: "A" }
  ]
};

const mathY5 = [
  { q: "A school excursion to a wildlife sanctuary costs $24 per student ticket and $35 per adult ticket. A group of 28 students and 4 adults attend. If the school receives a group discount of $75 off the total bill, how much does the excursion cost in total?", a: "$737", b: "$812", c: "$747", d: "$687", ans: "A" },
  { q: "A bakery bakes 148 blueberry muffins in the morning and 176 choc-chip muffins in the afternoon. The baker packs them into boxes of 6 muffins each. If 4 full boxes are kept for a catering order and the remaining full boxes are sold in the shop, how many full boxes are sold in the shop?", a: "48 boxes", b: "50 boxes", c: "54 boxes", d: "52 boxes", ans: "B" },
  { q: "The Year 5 sustainability club bought 8 boxes of plant seedlings for $45 per box. They grew the seedlings and sold a total of 160 potted plants for $6 each. The club then shared the total profit equally among 4 environmental charities. How much money did each charity receive?", a: "$240", b: "$125", c: "$150", d: "$175", ans: "C" },
  { q: "A school library starts the term with 1,250 books. During the first month, 345 books are loaned out and 180 of those are returned. Then, the library receives a donation of 15 boxes containing 24 new books each. How many books are in the library now?", a: "1,445", b: "1,365", c: "1,425", d: "1,515", ans: "A" },
  { q: "A soccer club orders 16 jerseys at $32 each and 16 pairs of shorts at $18 each. The delivery fee is $40. If the total cost is split equally among the 16 players on the team, how much does each player pay?", a: "$50.00", b: "$55.00", c: "$52.50", d: "$54.20", ans: "C" },
  { q: "An orchard harvests 45 crates of apples on Monday and 35 crates on Tuesday. Each crate holds 18 kg of apples. If 120 kg of apples are damaged and removed, and the rest are packed equally into 60 market bags, how many kilograms of apples are in each market bag?", a: "24 kg", b: "20 kg", c: "25 kg", d: "22 kg", ans: "D" },
  { q: "In a charity fun run, Maya runs 6 laps of a 400-metre track, Liam runs 8 laps, and Chloe runs 5 laps. If their combined goal was to run a total of 10,000 metres (10 km), how many more metres do they need to run to reach their goal?", a: "2,400 m", b: "2,600 m", c: "3,400 m", d: "1,800 m", ans: "A" },
  { q: "A community canteen bought 12 packs of juice bottles, with 24 bottles in each pack. Over the weekend, 168 bottles were sold. The canteen supervisor wants to pack the remaining bottles equally into 6 storage crates. How many bottles will be in each crate?", a: "18 bottles", b: "20 bottles", c: "22 bottles", d: "24 bottles", ans: "B" },
  { q: "There are 138 Year 5 students and 14 teachers going to camp. Each mini-bus can carry 19 passengers. If hiring each mini-bus costs $280 for the trip, what is the total cost to hire enough mini-buses for everyone?", a: "$1,960", b: "$2,240", c: "$2,520", d: "$2,180", ans: "B" },
  { q: "A community garden has 6 raised garden beds. Each bed requires 85 kg of topsoil and 15 kg of compost. Soil is sold in 25 kg bags. How many bags of soil and compost mix are needed in total to fill all 6 garden beds?", a: "20 bags", b: "22 bags", c: "24 bags", d: "28 bags", ans: "C" },
  { q: "Lucas saved $450 to set up a craft stall. He spent $165 on timber, bought 6 pots of paint at $14 each, and bought 8 brushes at $6 each. How much of his savings did Lucas have left?", a: "$143", b: "$163", c: "$173", d: "$153", ans: "D" },
  { q: "A teacher needs to print booklets for 3 classes of 28 students each. Each student receives a booklet that has 16 pages. If the printer prints 8 pages per minute, how many minutes will it take to print all the booklets?", a: "144 minutes", b: "168 minutes", c: "182 minutes", d: "196 minutes", ans: "B" },
  { q: "A swimming club printed 50 books of raffle tickets, with 20 tickets in each book. They sold 38 whole books and 15 individual tickets from an opened book. The remaining unsold tickets were shared equally among 5 committee members to return. How many unsold tickets did each committee member return?", a: "35 tickets", b: "40 tickets", c: "45 tickets", d: "50 tickets", ans: "C" },
  { q: "A farm has 3 rainwater tanks that each contain 1,500 litres of water. After a dry week, 1,860 litres are used for the vegetable gardens and 840 litres are used for livestock. The remaining water is to be used equally over the next 6 days. How many litres of water can be used per day?", a: "250 litres", b: "280 litres", c: "300 litres", d: "350 litres", ans: "C" },
  { q: "An event hall has 25 rows of chairs with 18 chairs in each row. For a science exhibition, workers remove 8 full rows of chairs, and then set up 45 extra single chairs near the stage. How many chairs are in the hall now?", a: "351 chairs", b: "341 chairs", c: "369 chairs", d: "385 chairs", ans: "A" }
];

const mathY34 = [
  { q: "Ethan buys 4 sheets of stickers. Each sheet has 15 stickers on it. He gives 18 stickers to his sister. How many stickers does Ethan have left?", a: "38", b: "45", c: "48", d: "42", ans: "D" },
  { q: "Mia bakes 5 trays of cookies with 12 cookies on each tray. Her brother brings 16 more freshly baked cookies from his class. How many cookies do they have altogether?", a: "60", b: "76", c: "74", d: "80", ans: "B" },
  { q: "Oliver has 28 toy cars and Liam has 20 toy cars. They combine all their cars and share them equally into 6 storage boxes. How many cars are in each box?", a: "8", b: "6", c: "7", d: "9", ans: "A" },
  { q: "Ruby saves $8 each week for 6 weeks. She then spends $19 on a new board game. How much money does Ruby have left?", a: "$29", b: "$31", c: "$33", d: "$39", ans: "A" },
  { q: "A fruit shop had 65 apples in a crate. 17 bruised apples were thrown away. The remaining good apples were packed equally into 6 bags. How many apples were in each bag?", a: "6", b: "7", c: "10", d: "8", ans: "D" },
  { q: "A classroom has 7 pencil pots. Each pot contains 8 coloured pencils. The teacher adds 14 new pencils to the pots. How many pencils are there in total?", a: "64", b: "68", c: "70", d: "72", ans: "C" },
  { q: "Jack reads 9 pages of his book every day for 5 days. If the whole book has 80 pages, how many pages does Jack still have left to read?", a: "35", b: "40", c: "45", d: "55", ans: "A" },
  { q: "A farmer collects 6 full cartons of eggs, with 12 eggs in each carton. On the way to the kitchen, 7 eggs break. How many unbroken eggs does the farmer have?", a: "63", b: "65", c: "67", d: "70", ans: "B" },
  { q: "In a soccer drill, 4 teams of 6 players each score 3 practice goals per player. How many practice goals were scored in total?", a: "54", b: "64", c: "72", d: "84", ans: "C" },
  { q: "The tuckshop makes 8 packs of sandwiches with 6 sandwiches in each pack. In the morning, 12 sandwiches are sold. The remaining sandwiches are packed equally into 4 lunch platters for teachers. How many sandwiches are on each platter?", a: "7", b: "8", c: "9", d: "12", ans: "C" },
  { q: "Grace potted 34 sunflower seedlings and Noah potted 26 sunflower seedlings. They placed the pots equally onto 5 garden shelves. How many pots are on each shelf?", a: "10", b: "12", c: "14", d: "15", ans: "B" },
  { q: "A school bus has 11 rows of seats with 4 seats in each row. If 35 students sit on the bus, how many empty seats are left?", a: "7", b: "8", c: "11", d: "9", ans: "D" },
  { q: "Leo has 4 bags of marbles with 15 marbles in each bag. He wins 18 more marbles in a game at lunch. How many marbles does Leo have now?", a: "78", b: "68", c: "75", d: "84", ans: "A" },
  { q: "Sophia buys 3 boxes of strawberry cupcakes and 2 boxes of chocolate cupcakes. Each box contains 6 cupcakes. She shares all the cupcakes equally among 5 friends. How many cupcakes does each friend get?", a: "5", b: "6", c: "7", d: "8", ans: "B" },
  { q: "Zoe swims 8 laps of a 25-metre pool. Her goal for the morning is to swim 300 metres. How many more metres does Zoe need to swim to reach her goal?", a: "75 m", b: "125 m", c: "150 m", d: "100 m", ans: "D" }
];

module.exports = { texts, comp, mathY5, mathY34 };
