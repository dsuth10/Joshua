const fs = require('fs');
const path = require('path');
const { 
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, TabStopType, 
  PageNumber, Header, Footer, ImageRun, PageBreak
} = require('docx');

// Page Sizing Constants
// A4 dimensions: 11906 x 16838 DXA.
const PRINT_PAGE_WIDTH = 11906;
const PRINT_PAGE_HEIGHT = 16838;

// Standard margins for standard documents (1 inch / 1440 DXA)
const STANDARD_MARGINS = { top: 1440, right: 1440, bottom: 1440, left: 1440 };
const STANDARD_MARGIN_PROPS = {
  margin: STANDARD_MARGINS,
  size: { width: 11906, height: 16838 } // Explicitly A4
};

// Styling configurations
const STYLES = {
  default: {
    document: {
      run: {
        font: "Arial",
        size: 24 // 12pt default
      }
    }
  }
};

// Reading texts (validated to pass readability targets)
const TEXT_RED = {
  title: "The Palm Oil Paradox: Livelihoods and Leafy Canopies",
  paragraphs: [
    "In the lush rainforests of Sumatra and Borneo, a complex conflict is happening. This conflict is between human survival and saving nature. At the heart of this problem is palm oil. Palm oil is a cheap vegetable oil found in half of all supermarket products, like biscuits and soaps. For ecologists, the rapid growth of palm oil plantations is a serious threat. Huge areas of rainforest are cleared daily to make way for these trees. This clearing destroys one of the most diverse habitats on our planet. This destruction directly threatens the survival of wild orangutans. They lose their nests, food sources, and travel pathways. As Malia explains in her school speech in the book Berani, wild orangutans face extinction. Their forest homes are replaced by large plantations. Captured orangutans like Ginger Juice in Malang are sad reminders of this problem. Ecologists argue that saving these forests is vital for the global climate and wildlife.",
    "Conversely, for millions of Indonesian farmers, palm oil is a crucial economic lifeline. Small farmers rely on palm oil to lift their families out of poverty. It provides a reliable source of income that is hard to find in rural areas. The money from these plantations allows farmers to pay for school fees, access healthcare, and support local villages. Without palm oil, many families would struggle to afford basic needs. When Malia's mother points out that some families rely on this industry, she shows that the issue is not simple. Farmers argue that they have a right to develop their land and improve their lives. In addition, banning palm oil could force companies to use other oil crops. These other crops require up to ten times more land to produce the same amount of oil. Finding a fair solution is one of the most pressing challenges of our time. This includes sustainable palm oil that protects forests while supporting local farmers."
  ]
};

const TEXT_BLUE = {
  title: "Palm Oil: A Balancing Act in the Forest",
  paragraphs: [
    "In the rainforests of Sumatra and Borneo, a big conflict is happening between human needs and saving nature. The main cause of this problem is palm oil. Palm oil is a very useful oil used in many foods and soaps.",
    "For ecologists, the growth of palm farms is a major disaster. Large areas of beautiful rainforest are cut down every day. This clears away the homes of many rare animals. Wild orangutans lose their food and nests when the trees are cleared. In the book Berani, a girl named Malia gives a speech. She talks about this sad problem. She explains that orangutans are in danger of dying out. Captive animals like Ginger Juice in Malang show what happens when forests are lost. Ecologists argue that we must protect the forests to save the Earth's climate and wildlife.",
    "However, for millions of Indonesian farmers, palm oil is an important lifeline. Many small farmers grow palm fruit to support their families. The money they make from palm oil helps lift them out of poverty. It allows parents to pay for school fees and healthcare. As Malia’s mother reminds her, many families depend on this industry to survive. Farmers argue that they need to use their land to live. Also, banning palm oil might make things worse. Other oil crops need much more land to grow the same amount of oil. Today, people are trying to find a middle ground by growing sustainable palm oil."
  ]
};

const TEXT_GREEN = {
  title: "Palm Oil and the Rainforest",
  paragraphs: [
    "Palm oil is a very common oil. It is in many foods like biscuits and chocolate. It also helps make soap. This oil comes from palm trees that grow in warm places.",
    "In Indonesia, people cut down wild rainforests to plant palm trees. This is a big problem for ecologists. Ecologists want to protect nature. When forests are cut down, wild animals lose their homes. In the book Berani, Malia wants to help the orangutans. She tells her school about the lost trees. Wild orangutans like Ginger Juice lose their forest homes. Ecologists say we must save the trees.",
    "But local farmers need palm oil too. Farming palm trees helps them earn money. This money pays for food, houses, and school. Many families would be very poor without palm oil. Farmers want to help their children. Banning palm oil is not easy because other oil crops need even more land to grow. Today, people are trying to grow palm oil safely. They want to protect the forests and help the farmers at the same time."
  ]
};

// Comprehension Questions
const QUESTIONS_RED_COMP = [
  { q: "What is the central conflict described in the passage?", a: "Local Indonesian farmers arguing with teachers about school fees.", b: "The struggle between economic survival for farmers and forest conservation.", c: "Banning biscuits and soaps from local supermarkets.", d: "Deciding whether Sumatra or Borneo has more diverse habitats.", ans: "B" },
  { q: "Why is palm oil so widely used by manufacturing companies?", a: "It is cheap and can be found in a huge variety of common products.", b: "It is the only oil that can grow in warm, tropical climates.", c: "It is certified sustainable by global ecologists.", d: "It has been proven to reverse global climate change.", ans: "A" },
  { q: "According to the text, how does palm oil farming threaten wild orangutans?", a: "Farmers actively capture orangutans to sell to restaurants.", b: "The clearing of rainforests destroys their nests, food sources, and travel paths.", c: "The palm oil itself is toxic to orangutans if they eat it.", d: "Orangutans are forced to work on the plantations.", ans: "B" },
  { q: "Based on the passage, what does the character Ginger Juice represent?", a: "Malia's mother's favorite drink.", b: "A symbol of the successful economic rise of rural Indonesian villages.", c: "A real-world example of the tragic loss of wild orangutan habitats.", d: "The scientist who discovered dwarf elephants in Sumatra.", ans: "C" },
  { q: "In Berani, what is the purpose of Malia's school speech?", a: "To explain how to make cheap vegetable oil.", b: "To advocate for the rights of smallholder farmers to clear land.", c: "To raise awareness about the threat of extinction facing wild orangutans.", d: "To encourage her classmates to move to Malang.", ans: "C" },
  { q: "Why does Malia's mother tell her that some children at her school have families in the palm oil industry?", a: "To suggest that Malia should ask them for donations for her petition.", b: "To show that the palm oil issue is complex and affects real people's livelihoods.", c: "To encourage Malia to visit a palm oil plantation during the holidays.", d: "To prove that ecologists are wrong about deforestation.", ans: "B" },
  { q: "What is a key argument used by Indonesian farmers to justify palm oil farming?", a: "They want to completely eliminate the wild orangutan population.", b: "They have a right to use their land to improve their lives, just as wealthier nations did.", c: "Palm trees are native to Borneo and belong in the rainforest.", d: "It requires more land than any other oil crop.", ans: "B" },
  { q: "What unexpected consequence might occur if palm oil is completely banned?", a: "Companies might use other crops that require up to ten times more land.", b: "Orangutans would immediately regain all their lost habitats.", c: "The global climate would stabilize within a single year.", d: "All Indonesian schools would become completely free.", ans: "A" },
  { q: "Which of the following best describes the author's tone when discussing both sides?", a: "Very angry at the ecologists for trying to stop economic growth.", b: "Completely dismissive of the farmers' struggle to afford school fees.", c: "Objective, presenting both the ecological damage and the economic necessity.", d: "Playful, focusing on the cute behavior of monkeys in Malang.", ans: "C" },
  { q: "What does the term 'crucial economic lifeline' suggest about palm oil for rural families?", a: "It is a secondary source of income they could easily live without.", b: "It is absolutely essential for their basic survival and financial stability.", c: "It is a dangerous job that put their lives at risk daily.", d: "It is a hobby that they participate in during the weekend.", ans: "B" },
  { q: "What is the main ecological reason to protect the rainforests of Sumatra and Borneo?", a: "To make sure there is enough wood to build new schools.", b: "To preserve highly diverse habitats and maintain global climate stability.", c: "To allow farmers to clear the land for soy crops instead.", d: "To expand the menu at Warung Malang.", ans: "B" },
  { q: "What does the passage suggest is a potential 'fair solution' to the palm oil paradox?", a: "Banning all supermarket products that contain vegetable oils.", b: "Relocating all rural Indonesian farmers to big cities like Surabaya.", c: "Using sustainable palm oil that protects forests while supporting local farmers.", d: "Keeping all wild orangutans in cages for their own protection.", ans: "C" },
  { q: "Which group would most likely support the rapid clearing of rainforest land?", a: "Malia and her fellow student activists.", b: "Ecologists studying climate stability.", c: "Rural families relying on palm tree cultivation to pay school fees.", d: "Tourists visiting Malang to see wild animals.", ans: "C" },
  { q: "How does the passage connect the events of the novel Berani to the global palm oil debate?", a: "By showing how characters like Malia face the real-world consequences of the debate.", b: "By explaining that the novel was written by a palm oil farmer.", c: "By proving that Malia's presentation was completely factual.", d: "By listing the legal laws of the Indonesian government.", ans: "A" },
  { q: "What is the ultimate message of the text regarding the palm oil problem?", a: "Ecologists should stop complaining and let farmers work.", b: "It is a simple problem that can be solved by banning all palm oil.", c: "It is a complex issue requiring a balance between human needs and environmental protection.", d: "The Indonesian government should buy all the plantations.", ans: "C" }
];

const QUESTIONS_BLUE_COMP = [
  { q: "In which two places are the rainforests mentioned in the text located?", a: "Java and Bali", b: "Sumatra and Borneo", c: "Malang and Surabaya", d: "Jakarta and Toronto", ans: "B" },
  { q: "What are two common items that use palm oil, according to the text?", a: "Cars and computers", b: "Paper and pencils", c: "Foods and soaps", d: "Clothes and shoes", ans: "C" },
  { q: "Why do ecologists consider the spread of palm farms a disaster?", a: "Because palm oil is unhealthy for humans to eat.", b: "Because it causes large areas of rainforest to be cut down, destroying animal homes.", c: "Because the trees make the soil too wet.", d: "Because farmers do not earn enough money from it.", ans: "B" },
  { q: "What happens to wild orangutans when the rainforest is cleared?", a: "They learn to live in the palm trees.", b: "They lose their food sources and their nests.", c: "They are moved to schools by ecologists.", d: "They migrate to other countries like Canada.", ans: "B" },
  { q: "Who is Malia in the book Berani?", a: "A scientist studying palm trees.", b: "A student who gives a speech about the orangutan threat.", c: "A farmer who owns a large plantation.", d: "Ari's aunt who runs a restaurant.", ans: "B" },
  { q: "What does the captive orangutan Ginger Juice show us?", a: "That orangutans are happy living in cages.", b: "What happens when wild forests are lost.", c: "How to make freshly squeezed juice.", d: "That mynah birds can sing rock songs.", ans: "B" },
  { q: "Why is palm oil farming described as an 'important lifeline' for Indonesian farmers?", a: "It helps them build larger schools.", b: "It lifts them out of poverty and helps them support their families.", c: "It is a very safe job with no hard work.", d: "It allows them to travel to other countries.", ans: "B" },
  { q: "What does the money made from palm oil help farmers pay for?", a: "Supermarket products and petitions.", b: "School fees and healthcare.", c: "Cars and restaurant menus.", d: "Rainforest plants and trees.", ans: "B" },
  { q: "Who reminds Malia that many families depend on palm oil to survive?", a: "Her teacher", b: "Her mother", c: "Ari's uncle", d: "Ginger Juice", ans: "B" },
  { q: "What do farmers argue about their land?", a: "They want to sell it to ecologists.", b: "They need to use it to live and support their families.", c: "They want to plant soy instead of palm trees.", d: "They do not want to grow any crops.", ans: "B" },
  { q: "According to the text, why might banning palm oil completely make things worse?", a: "Other oil crops need much more land to grow the same amount of oil.", b: "Farmers would stop paying all taxes.", c: "Orangutans would lose their remaining forest homes even faster.", d: "The climate would become much hotter.", ans: "A" },
  { q: "What is the 'middle ground' that people are trying to grow today?", a: "Banning all soaps and foods that use oil.", b: "Sustainable palm oil that balances human and nature needs.", c: "Giant cages for all animals in Malang.", d: "Organic soy and coconut farms.", ans: "B" },
  { q: "Which of the following is NOT mentioned as a threat to orangutans?", a: "Loss of nests in the canopy.", b: "Loss of wild food sources.", c: "Farmers feeding them too many bananas in cages.", d: "Replacing forests with palm plantations.", ans: "C" },
  { q: "Based on the passage, what is the main disagreement between ecologists and farmers?", a: "Which country makes the best oxtail soup.", b: "Whether to protect rainforests or clear them for farming income.", c: "How many hours a day children should spend at school.", d: "The price of supermarket products.", ans: "B" },
  { q: "What makes the palm oil issue 'far from black and white'?", a: "Both sides have strong, valid reasons for their viewpoints.", b: "Palm oil itself is yellow and the trees are green.", c: "There are no laws in Indonesia about forests.", d: "The book Berani does not have a clear ending.", ans: "A" }
];

const QUESTIONS_GREEN_COMP = [
  { q: "Where does palm oil come from?", a: "Orange trees in cold places", b: "Palm trees in warm places", c: "Cocoa beans in the forest", d: "Soap factories in Malang", ans: "B" },
  { q: "Which of these foods contains palm oil, according to the text?", a: "Fresh apples", b: "Biscuits and chocolate", c: "Oxtail soup", d: "Bananas and papayas", ans: "B" },
  { q: "What do people in Indonesia do to plant palm trees?", a: "They plant them in school gardens.", b: "They cut down wild rainforests.", c: "They grow them inside cages.", d: "They build new restaurants.", ans: "B" },
  { q: "Who wants to protect nature, according to the text?", a: "Palm oil farmers", b: "Ecologists", c: "Shop owners", d: "Mynah birds", ans: "B" },
  { q: "What happens to wild animals when forests are cut down?", a: "They learn to fly.", b: "They lose their homes.", c: "They find more food.", d: "They go to the city.", ans: "B" },
  { q: "Who wants to help the orangutans in the book Berani?", a: "Ari's uncle", b: "Malia", c: "Elvis Presley", d: "A local farmer", ans: "B" },
  { q: "What does Malia tell her school about?", a: "How to cook oxtail soup", b: "The lost trees in the forest", c: "Her favorite books", d: "The city of Surabaya", ans: "B" },
  { q: "Who is Ginger Juice in the text?", a: "A wild orangutan who lost her forest home", b: "Malia's favorite teacher", c: "A drink made with green oranges", d: "A local farmer's child", ans: "A" },
  { q: "Why do local farmers need to grow palm trees?", a: "To make the forest look pretty", b: "To earn money for their families", c: "To feed the wild birds", d: "To clear the roads for trucks", ans: "B" },
  { q: "What does the money from palm farming pay for?", a: "Supermarket toys", b: "Food, houses, and school", c: "Cage cleaning supplies", d: "Trips to other countries", ans: "B" },
  { q: "What would happen to many farming families without palm oil?", a: "They would be very rich.", b: "They would be very poor.", c: "They would move to Malang.", d: "They would become ecologists.", ans: "B" },
  { q: "Why is banning palm oil not easy?", a: "Farmers do not like other plants.", b: "Other oil crops need even more land to grow.", c: "The trees are too hard to cut down.", d: "No one knows how to make soap.", ans: "B" },
  { q: "What are people trying to do today with palm oil?", a: "Stop using it in all foods.", b: "Grow it safely to protect forests and help farmers.", c: "Move all palm trees to Canada.", d: "Make it only in factories.", ans: "B" },
  { q: "Ecologists say we must save the:", a: "Supermarkets", b: "Trees", c: "Fences", d: "Roads", ans: "B" },
  { q: "Farmers grow palm trees because they want to help their:", a: "Pets", b: "Children", c: "Teachers", d: "Friends", ans: "B" }
];

// Maths Questions
const MATHS_Y5 = [
  { q: "A rectangular paddock has a length of 12 metres and a width of 7 metres. What is its perimeter?", a: "84 metres", b: "38 metres", c: "19 metres", d: "48 metres", ans: "B" },
  { q: "A rectangular nature reserve has an area of 108 square kilometres. If its length is 12 kilometres, what is its width?", a: "9 kilometres", b: "96 kilometres", c: "18 kilometres", d: "8 kilometres", ans: "A" },
  { q: "An L-shaped vegetable garden is made by joining two rectangular plots. Plot 1 is 8 metres long and 4 metres wide. Plot 2 is 5 metres long and 3 metres wide. What is the total area of the garden?", a: "20 square metres", b: "47 square metres", c: "32 square metres", d: "40 square metres", ans: "B" },
  { q: "A square agricultural field has an area of 64 square metres. What is the perimeter of this field?", a: "16 metres", b: "32 metres", c: "64 metres", d: "24 metres", ans: "B" },
  { q: "A rectangular reserve has a width of 15 metres and an area of 300 square metres. What is the perimeter of the reserve?", a: "70 metres", b: "20 metres", c: "35 metres", d: "150 metres", ans: "A" },
  { q: "[SEE IMAGE: q21_l_shape_perimeter.png]\nWhat is the perimeter of the compound shape shown in the diagram?", a: "30 metres", b: "36 metres", c: "40 metres", d: "28 metres", ans: "B" },
  { q: "A farmer wants to fence a rectangular palm tree nursery that is 22 metres long and 18 metres wide. Fencing costs $8 per metre. What is the total cost of the fence?", a: "$3168", b: "$640", c: "$320", d: "$1280", ans: "B" },
  { q: "A rectangular reserve has an area of 120 square metres. If the width of the reserve is 8 metres, what is the length?", a: "15 metres", b: "112 metres", c: "30 metres", d: "12 metres", ans: "A" },
  { q: "[SEE IMAGE: q24_t_shape_area.png]\nWhat is the total area of the T-shaped compound zone shown in the diagram?", a: "72 square metres", b: "60 square metres", c: "48 square metres", d: "36 square metres", ans: "B" },
  { q: "A square playground has a perimeter of 48 metres. What is the area of the playground?", a: "144 square metres", b: "48 square metres", c: "12 square metres", d: "96 square metres", ans: "A" },
  { q: "A rectangular paddock is 20 metres long and has a perimeter of 60 metres. What is the area of the paddock?", a: "200 square metres", b: "300 square metres", c: "400 square metres", d: "800 square metres", ans: "A" },
  { q: "[SEE IMAGE: q27_cutout_area.png]\nWhat is the area of the remaining shape after the corner is removed?", a: "80 square metres", b: "74 square metres", c: "68 square metres", d: "86 square metres", ans: "B" },
  { q: "A rectangular classroom has an area of 72 square metres. If its length is 9 metres, what is its perimeter?", a: "34 metres", b: "17 metres", c: "8 metres", d: "64 metres", ans: "A" },
  { q: "A square garden bed has an area of 100 square metres. If we double the length of its sides, what will the new area be?", a: "200 square metres", b: "400 square metres", c: "300 square metres", d: "1000 square metres", ans: "B" },
  { q: "A rectangular courtyard measures 15 metres by 10 metres. A 1-metre wide brick path is built inside the courtyard, running all the way around the inner edge. What is the area of the brick path?", a: "46 square metres", b: "50 square metres", c: "150 square metres", d: "104 square metres", ans: "A" }
];

const MATHS_Y34 = [
  { q: "A rectangular garden has a length of 6 metres and a width of 4 metres. What is its perimeter?", a: "10 metres", b: "20 metres", c: "24 metres", d: "12 metres", ans: "B" },
  { q: "A rectangular desk is 5 metres long and 3 metres wide. What is its area?", a: "15 square metres", b: "16 square metres", c: "8 square metres", d: "30 square metres", ans: "A" },
  { q: "A square sandpit has an area of 25 square metres. How long is one of its sides?", a: "5 metres", b: "10 metres", c: "4 metres", d: "20 metres", ans: "A" },
  { q: "A rectangular playground has an area of 24 square metres. If the length is 6 metres, what is the width?", a: "4 metres", b: "18 metres", c: "8 metres", d: "12 metres", ans: "A" },
  { q: "A rectangular rug has a perimeter of 18 metres. If its length is 5 metres, what is its width?", a: "4 metres", b: "13 metres", c: "9 metres", d: "8 metres", ans: "A" },
  { q: "[SEE IMAGE: q21_green_l_shape_area.png]\nWhat is the total area of the L-shaped garden shown in the diagram?", a: "20 square metres", b: "26 square metres", c: "14 square metres", d: "30 square metres", ans: "B" },
  { q: "A square field has side lengths of 7 metres. What is the perimeter of the field?", a: "14 metres", b: "28 metres", c: "49 metres", d: "21 metres", ans: "B" },
  { q: "A rectangular box lid has a perimeter of 30 centimetres. If the width is 5 centimetres, what is the length?", a: "10 centimetres", b: "25 centimetres", c: "15 centimetres", d: "20 centimetres", ans: "A" },
  { q: "[SEE IMAGE: q24_green_compound_perimeter.png]\nWhat is the total perimeter around the outside of this combined shape?", a: "20 metres", b: "18 metres", c: "24 metres", d: "14 metres", ans: "B" },
  { q: "A farmer has a rectangular chicken coop that is 8 metres long and 5 metres wide. How many metres of fencing does the farmer need to go all the way around it?", a: "13 metres", b: "26 metres", c: "40 metres", d: "16 metres", ans: "B" },
  { q: "A rectangular paddock has an area of 36 square metres. If the width is 4 metres, what is the length?", a: "9 metres", b: "32 metres", c: "6 metres", d: "8 metres", ans: "A" },
  { q: "[SEE IMAGE: q27_green_cutout_perimeter.png]\nWhat is the perimeter of this L-shaped block?", a: "24 centimetres", b: "20 centimetres", c: "16 centimetres", d: "18 centimetres", ans: "B" },
  { q: "A square towel has an area of 81 square centimetres. What is the length of one side of the towel?", a: "9 centimetres", b: "18 centimetres", c: "27 centimetres", d: "36 centimetres", ans: "A" },
  { q: "A rectangular poster is 10 decimetres long and 8 decimetres wide. What is the area of the poster?", a: "18 square decimetres", b: "80 square decimetres", c: "36 square decimetres", d: "40 square decimetres", ans: "B" },
  { q: "A rectangular vegetable garden is 7 metres long and 3 metres wide. What is the area of the garden?", a: "20 square metres", b: "21 square metres", c: "10 square metres", d: "14 square metres", ans: "B" }
];

// Generates the Reading DOCX file
function makeReadingDoc(title, textObj) {
  const children = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 240, after: 120 },
      children: [
        new TextRun({
          text: title,
          bold: true,
          size: 32 // 16pt
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 240 },
      children: [
        new TextRun({
          text: textObj.title,
          bold: true,
          italics: true,
          size: 26, // 13pt
          color: "444444"
        })
      ]
    })
  ];

  textObj.paragraphs.forEach(p => {
    children.push(
      new Paragraph({
        spacing: { before: 0, after: 140, line: 276, lineRule: 'auto' }, // 1.15 line spacing
        children: [
          new TextRun({
            text: p,
            size: 24 // 12pt
          })
        ]
      })
    );
  });

  return new Document({
    styles: STYLES,
    sections: [{
      properties: {
        page: STANDARD_MARGIN_PROPS
      },
      children: children
    }]
  });
}

// Generates the Questions DOCX file (Microsoft Forms format)
function makeQuestionsDoc(title, compQs, mathsQs) {
  const children = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 240, after: 240 },
      children: [
        new TextRun({
          text: title,
          bold: true,
          size: 32 // 16pt
        })
      ]
    })
  ];

  let qNum = 1;

  // Add Reading Questions
  compQs.forEach(q => {
    children.push(new Paragraph({ spacing: { before: 180, after: 60 }, children: [new TextRun({ text: `${qNum}. ${q.q}`, bold: true, size: 22 })] }));
    children.push(new Paragraph({ spacing: { before: 0, after: 40 }, children: [new TextRun({ text: `A. ${q.a}`, size: 20 })] }));
    children.push(new Paragraph({ spacing: { before: 0, after: 40 }, children: [new TextRun({ text: `B. ${q.b}`, size: 20 })] }));
    children.push(new Paragraph({ spacing: { before: 0, after: 40 }, children: [new TextRun({ text: `C. ${q.c}`, size: 20 })] }));
    children.push(new Paragraph({ spacing: { before: 0, after: 40 }, children: [new TextRun({ text: `D. ${q.d}`, size: 20 })] }));
    children.push(new Paragraph({ spacing: { before: 0, after: 40 }, children: [new TextRun({ text: `ANSWER: ${q.ans}`, bold: true, size: 20 })] }));
    children.push(new Paragraph({ spacing: { before: 0, after: 120 }, children: [new TextRun({ text: `POINT: 1`, bold: true, size: 20 })] }));
    qNum++;
  });

  // Add Maths Questions
  mathsQs.forEach(q => {
    // We need to keep diagram references intact, but make sure they match the new question numbers
    // Let's rewrite the diagram reference line to match the target compiled question number
    let modifiedQText = q.q;
    if (modifiedQText.includes("[SEE IMAGE:")) {
      // Find the old image name and replace with the correct qNum matching the output Questions doc
      // e.g. [SEE IMAGE: q21_l_shape_perimeter.png] or similar. We should keep it as is, or rename.
      // The images are generated for the compiled question number.
      // Let's check which number this math question is: qNum.
      // We can do a string replace of q21, q24, q27 to match the actual qNum.
      modifiedQText = modifiedQText.replace(/q(21|24|27)/, `q${qNum}`);
    }
    
    children.push(new Paragraph({ spacing: { before: 180, after: 60 }, children: [new TextRun({ text: `${qNum}. ${modifiedQText}`, bold: true, size: 22 })] }));
    children.push(new Paragraph({ spacing: { before: 0, after: 40 }, children: [new TextRun({ text: `A. ${q.a}`, size: 20 })] }));
    children.push(new Paragraph({ spacing: { before: 0, after: 40 }, children: [new TextRun({ text: `B. ${q.b}`, size: 20 })] }));
    children.push(new Paragraph({ spacing: { before: 0, after: 40 }, children: [new TextRun({ text: `C. ${q.c}`, size: 20 })] }));
    children.push(new Paragraph({ spacing: { before: 0, after: 40 }, children: [new TextRun({ text: `D. ${q.d}`, size: 20 })] }));
    children.push(new Paragraph({ spacing: { before: 0, after: 40 }, children: [new TextRun({ text: `ANSWER: ${q.ans}`, bold: true, size: 20 })] }));
    children.push(new Paragraph({ spacing: { before: 0, after: 120 }, children: [new TextRun({ text: `POINT: 1`, bold: true, size: 20 })] }));
    qNum++;
  });

  return new Document({
    styles: STYLES,
    sections: [{
      properties: {
        page: STANDARD_MARGIN_PROPS
      },
      children: children
    }]
  });
}

// Generates the expansive, attractive Printable student document
// Generates the expansive, attractive Printable student document
function makePrintDoc(title, textObj, compQs, mathsQs) {
  // 0.5 inch margins for a dense but clean layout
  const margins = { top: 720, right: 720, bottom: 720, left: 720 };
  
  const qFontSize = 22; // 11pt
  const readFontSize = 24; // 12pt
  const readLineSpacing = 276; // 1.15 line spacing
  const tabPosition = 5000; // approx half page width

  const children = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 20, after: 80 },
      children: [
        new TextRun({
          text: title,
          bold: true,
          size: 28 // 14pt
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 120 },
      children: [
        new TextRun({
          text: textObj.title,
          bold: true,
          italics: true,
          size: 24, // 12pt
          color: "444444"
        })
      ]
    })
  ];

  // 1. Reading Text
  textObj.paragraphs.forEach(p => {
    children.push(
      new Paragraph({
        spacing: { before: 0, after: 120, line: readLineSpacing, lineRule: 'auto' },
        children: [
          new TextRun({
            text: p,
            size: readFontSize
          })
        ]
      })
    );
  });

  // Page break after reading text
  children.push(new Paragraph({
    children: [new PageBreak()]
  }));

  // 2. Reading Questions header
  children.push(
    new Paragraph({
      spacing: { before: 0, after: 120 },
      children: [
        new TextRun({
          text: "Part A: Reading Comprehension",
          bold: true,
          size: 24, // 12pt
          underline: true
        })
      ]
    })
  );

  // 3. Reading Questions (2x2 grid for options)
  let qNum = 1;
  compQs.forEach(q => {
    children.push(
      new Paragraph({
        spacing: { before: 80, after: 40 },
        children: [
          new TextRun({
            text: `${qNum}. ${q.q}`,
            bold: true,
            size: qFontSize
          })
        ]
      })
    );

    // Options line 1: A and B
    children.push(
      new Paragraph({
        tabStops: [{ type: TabStopType.LEFT, position: tabPosition }],
        spacing: { before: 0, after: 20 },
        children: [
          new TextRun({ text: `A. ${q.a}`, size: qFontSize }),
          new TextRun({ text: `\tB. ${q.b}`, size: qFontSize })
        ]
      })
    );

    // Options line 2: C and D
    children.push(
      new Paragraph({
        tabStops: [{ type: TabStopType.LEFT, position: tabPosition }],
        spacing: { before: 0, after: 40 },
        border: {
          bottom: { style: BorderStyle.SINGLE, size: 4, color: 'E0E0E0', space: 4 }
        },
        children: [
          new TextRun({ text: `C. ${q.c}`, size: qFontSize }),
          new TextRun({ text: `\tD. ${q.d}`, size: qFontSize })
        ]
      })
    );

    qNum++;
  });

  // Page break after comprehension questions
  children.push(new Paragraph({
    children: [new PageBreak()]
  }));

  // 4. Maths Questions header
  children.push(
    new Paragraph({
      spacing: { before: 0, after: 120 },
      children: [
        new TextRun({
          text: "Part B: Mathematics Word Problems",
          bold: true,
          size: 24, // 12pt
          underline: true
        })
      ]
    })
  );

  // 5. Maths Questions (Single column, embedded images)
  mathsQs.forEach(q => {
    let modifiedQText = q.q;
    let imageName = null;

    // Detect [SEE IMAGE: filename.png]
    const imgRegex = /\[SEE IMAGE:\s*([^\]]+)\]/i;
    const match = modifiedQText.match(imgRegex);
    if (match) {
      imageName = match[1].trim();
      modifiedQText = modifiedQText.replace(imgRegex, '').trim();
    }
    
    children.push(
      new Paragraph({
        spacing: { before: 80, after: 40 },
        children: [
          new TextRun({
            text: `${qNum}. ${modifiedQText}`,
            bold: true,
            size: qFontSize
          })
        ]
      })
    );

    // If an image was found, embed it
    if (imageName) {
      try {
        const imagePath = path.join(__dirname, 'images', imageName);
        const imageBuffer = fs.readFileSync(imagePath);
        
        children.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 40, after: 40 },
            children: [
              new ImageRun({
                data: imageBuffer,
                transformation: {
                  width: 250,
                  height: 187,
                },
              })
            ]
          })
        );
      } catch (err) {
        console.warn(`Could not load image ${imageName}:`, err.message);
      }
    }

    // Options line 1: A and B
    children.push(
      new Paragraph({
        tabStops: [{ type: TabStopType.LEFT, position: tabPosition }],
        spacing: { before: 0, after: 20 },
        children: [
          new TextRun({ text: `A. ${q.a}`, size: qFontSize }),
          new TextRun({ text: `\tB. ${q.b}`, size: qFontSize })
        ]
      })
    );

    // Options line 2: C and D
    children.push(
      new Paragraph({
        tabStops: [{ type: TabStopType.LEFT, position: tabPosition }],
        spacing: { before: 0, after: 40 },
        border: {
          bottom: { style: BorderStyle.SINGLE, size: 4, color: 'E0E0E0', space: 4 }
        },
        children: [
          new TextRun({ text: `C. ${q.c}`, size: qFontSize }),
          new TextRun({ text: `\tD. ${q.d}`, size: qFontSize })
        ]
      })
    );
    
    qNum++;
  });

  return new Document({
    styles: STYLES,
    sections: [{
      properties: {
        page: {
          margin: margins,
          size: { width: PRINT_PAGE_WIDTH, height: PRINT_PAGE_HEIGHT }
        }
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              spacing: { before: 0, after: 40 },
              children: [
                new TextRun({
                  text: "Name: ______________________   Date: __________",
                  size: 20,
                  color: "666666"
                })
              ]
            })
          ]
        })
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 40, after: 0 },
              children: [
                new TextRun({ text: "Page ", size: 16, color: "777777" }),
                new TextRun({ children: [PageNumber.CURRENT], size: 16, color: "777777" }),
                new TextRun({ text: " of ", size: 16, color: "777777" }),
                new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, color: "777777" })
              ]
            })
          ]
        })
      },
      children: children
    }]
  });
}

// Shuffles options and updates correct answer key
function shuffleQuestion(q) {
  const options = [
    { text: q.a, isCorrect: q.ans === 'A' },
    { text: q.b, isCorrect: q.ans === 'B' },
    { text: q.c, isCorrect: q.ans === 'C' },
    { text: q.d, isCorrect: q.ans === 'D' }
  ];
  
  // Fisher-Yates Shuffle
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = options[i];
    options[i] = options[j];
    options[j] = temp;
  }
  
  // Map back to a, b, c, d
  q.a = options[0].text;
  q.b = options[1].text;
  q.c = options[2].text;
  q.d = options[3].text;
  
  // Find correct answer letter
  const correctIdx = options.findIndex(opt => opt.isCorrect);
  q.ans = ['A', 'B', 'C', 'D'][correctIdx];
  
  return q;
}

// Generate all files
async function main() {
  console.log("Generating Week 2 Homework Pack...");

  const outDir = __dirname;

  // Shuffle all questions before generating to randomize correct answer keys
  const shuffledRedComp = QUESTIONS_RED_COMP.map(q => shuffleQuestion({ ...q }));
  const shuffledBlueComp = QUESTIONS_BLUE_COMP.map(q => shuffleQuestion({ ...q }));
  const shuffledGreenComp = QUESTIONS_GREEN_COMP.map(q => shuffleQuestion({ ...q }));
  const shuffledMathsY5 = MATHS_Y5.map(q => shuffleQuestion({ ...q }));
  const shuffledMathsY34 = MATHS_Y34.map(q => shuffleQuestion({ ...q }));

  // 1. Reading DOCX files
  const readRed = makeReadingDoc("Week 2 Homework — Informational Text", TEXT_RED);
  const readBlue = makeReadingDoc("Week 2 Homework — Informational Text", TEXT_BLUE);
  const readGreen = makeReadingDoc("Week 2 Homework — Informational Text", TEXT_GREEN);

  fs.writeFileSync(path.join(outDir, "Week_2_Reading_Red.docx"), await Packer.toBuffer(readRed));
  fs.writeFileSync(path.join(outDir, "Week_2_Reading_Blue.docx"), await Packer.toBuffer(readBlue));
  fs.writeFileSync(path.join(outDir, "Week_2_Reading_Green.docx"), await Packer.toBuffer(readGreen));
  console.log("✅ Reading DOCX files created.");

  // 2. Questions DOCX files (Microsoft Forms format)
  const qRed = makeQuestionsDoc("Week 2 Homework Assessment — Red Group", shuffledRedComp, shuffledMathsY5);
  const qBlue = makeQuestionsDoc("Week 2 Homework Assessment — Blue Group", shuffledBlueComp, shuffledMathsY5);
  const qGreen = makeQuestionsDoc("Week 2 Homework Assessment — Green Group", shuffledGreenComp, shuffledMathsY34);

  fs.writeFileSync(path.join(outDir, "Week_2_Questions_Red.docx"), await Packer.toBuffer(qRed));
  fs.writeFileSync(path.join(outDir, "Week_2_Questions_Blue.docx"), await Packer.toBuffer(qBlue));
  fs.writeFileSync(path.join(outDir, "Week_2_Questions_Green.docx"), await Packer.toBuffer(qGreen));
  console.log("✅ Questions DOCX files created.");

  // 3. Print DOCX files (2-page student handouts)
  const printRed = makePrintDoc("Week 2 Homework — Red Group", TEXT_RED, shuffledRedComp, shuffledMathsY5);
  const printBlue = makePrintDoc("Week 2 Homework — Blue Group", TEXT_BLUE, shuffledBlueComp, shuffledMathsY5);
  const printGreen = makePrintDoc("Week 2 Homework — Green Group", TEXT_GREEN, shuffledGreenComp, shuffledMathsY34);

  fs.writeFileSync(path.join(outDir, "Week_2_Print_Red.docx"), await Packer.toBuffer(printRed));
  fs.writeFileSync(path.join(outDir, "Week_2_Print_Blue.docx"), await Packer.toBuffer(printBlue));
  fs.writeFileSync(path.join(outDir, "Week_2_Print_Green.docx"), await Packer.toBuffer(printGreen));
  console.log("✅ Print DOCX files created.");

  console.log("🎉 All Week 2 homework files successfully compiled.");
}

main().catch(err => {
  console.error("❌ Error compiling homework:", err);
});
