/**
 * Mathematics Content Module for Term 3 Week 6 Interactive Homework
 * Multi-Step Word Problems (Questions 16–30)
 * Red & Blue: Year 5 Level (AC9M5N04)
 * Green: Year 3/4 Level (AC9M3N04 / AC9M4N03)
 */
window.MATH_CONTENT = {
  // Year 5 Multi-Step Problems (Shared by Red & Blue tiers)
  Year5: [
    {
      id: "m_y5_1",
      number: 16,
      focus: "Money & Multiplication with Subtraction",
      q: "A school excursion to a wildlife sanctuary costs $24 per student ticket and $35 per adult ticket. A group of 28 students and 4 adults attend. If the school receives a group discount of $75 off the total bill, how much does the excursion cost in total?",
      options: ["$737", "$812", "$747", "$687"],
      ans: 0,
      hint: "Find total student cost, total adult cost, add them together, then subtract the $75 discount.",
      steps: [
        "Step 1 (Students): 28 × $24 = $672",
        "Step 2 (Adults): 4 × $35 = $140",
        "Step 3 (Subtotal): $672 + $140 = $812",
        "Step 4 (Apply Discount): $812 - $75 = $737"
      ],
      explanation: "Calculate student tickets ($28 × $24 = $672) and adult tickets ($4 × $35 = $140). Total before discount = $672 + $140 = $812. After applying the $75 discount: $812 - $75 = $737."
    },
    {
      id: "m_y5_2",
      number: 17,
      focus: "Addition & Division with Remainder Context",
      q: "A bakery bakes 148 blueberry muffins in the morning and 176 choc-chip muffins in the afternoon. The baker packs them into boxes of 6 muffins each. If 4 full boxes are kept for a catering order and the remaining full boxes are sold in the shop, how many full boxes are sold in the shop?",
      options: ["48 boxes", "50 boxes", "54 boxes", "52 boxes"],
      ans: 1,
      hint: "Add both batches together, divide by 6 to find total full boxes, then subtract the 4 catering boxes.",
      steps: [
        "Step 1 (Total Muffins): 148 + 176 = 324 muffins",
        "Step 2 (Total Packed Boxes): 324 ÷ 6 = 54 full boxes",
        "Step 3 (Shop Boxes): 54 - 4 = 50 full boxes"
      ],
      explanation: "Total muffins baked = 148 + 176 = 324 muffins. Full boxes packed = 324 ÷ 6 = 54 boxes. Boxes sold in shop = 54 - 4 = 50 boxes."
    },
    {
      id: "m_y5_3",
      number: 18,
      focus: "Multiplication, Profit & Equal Sharing",
      q: "The Year 5 sustainability club bought 8 boxes of plant seedlings for $45 per box. They grew the seedlings and sold a total of 160 potted plants for $6 each. The club then shared the total profit equally among 4 environmental charities. How much money did each charity receive?",
      options: ["$240", "$125", "$150", "$175"],
      ans: 2,
      hint: "Find total cost (8 × $45) and revenue (160 × $6). Subtract to get profit, then divide by 4 charities.",
      steps: [
        "Step 1 (Cost): 8 × $45 = $360",
        "Step 2 (Revenue): 160 × $6 = $960",
        "Step 3 (Profit): $960 - $360 = $600",
        "Step 4 (Per Charity): $600 ÷ 4 = $150"
      ],
      explanation: "Seedling cost = 8 × $45 = $360. Sales revenue = 160 × $6 = $960. Total profit = $960 - $360 = $600. Share per charity = $600 ÷ 4 = $150."
    },
    {
      id: "m_y5_4",
      number: 19,
      focus: "Addition, Subtraction & Box Multiplication",
      q: "A school library starts the term with 1,250 books. During the first month, 345 books are loaned out and 180 of those are returned. Then, the library receives a donation of 15 boxes containing 24 new books each. How many books are in the library now?",
      options: ["1,445", "1,365", "1,425", "1,515"],
      ans: 0,
      hint: "Find how many books are still loaned out (345 - 180), subtract from 1,250, then add the new donated books (15 × 24).",
      steps: [
        "Step 1 (Currently on Loan): 345 - 180 = 165 books",
        "Step 2 (Remaining in Library): 1,250 - 165 = 1,085 books",
        "Step 3 (Donated Books): 15 × 24 = 360 books",
        "Step 4 (Final Total): 1,085 + 360 = 1,445 books"
      ],
      explanation: "Books currently out on loan = 345 - 180 = 165 books. Remaining = 1,250 - 165 = 1,085 books. Donated books = 15 × 24 = 360 books. Total = 1,085 + 360 = 1,445 books."
    },
    {
      id: "m_y5_5",
      number: 20,
      focus: "Money, Uniform Pricing & Equal Division",
      q: "A soccer club orders 16 jerseys at $32 each and 16 pairs of shorts at $18 each. The delivery fee is $40. If the total cost is split equally among the 16 players on the team, how much does each player pay?",
      options: ["$50.00", "$55.00", "$52.50", "$54.20"],
      ans: 2,
      hint: "Calculate jersey cost (16 × $32), shorts cost (16 × $18), add $40 delivery, then divide total by 16 players.",
      steps: [
        "Step 1 (Jerseys): 16 × $32 = $512",
        "Step 2 (Shorts): 16 × $18 = $288",
        "Step 3 (Subtotal + Delivery): $512 + $288 + $40 = $840",
        "Step 4 (Per Player): $840 ÷ 16 = $52.50"
      ],
      explanation: "Jerseys = 16 × $32 = $512. Shorts = 16 × $18 = $288. Total with delivery = $512 + $288 + $40 = $840. Cost per player = $840 ÷ 16 = $52.50."
    },
    {
      id: "m_y5_6",
      number: 21,
      focus: "Mass / Weight, Crates & Bagging",
      q: "An orchard harvests 45 crates of apples on Monday and 35 crates on Tuesday. Each crate holds 18 kg of apples. If 120 kg of apples are damaged and removed, and the rest are packed equally into 60 market bags, how many kilograms of apples are in each market bag?",
      options: ["24 kg", "20 kg", "25 kg", "22 kg"],
      ans: 3,
      hint: "Find total crates (45 + 35 = 80), total mass (80 × 18 kg), remove damaged apples (-120 kg), then divide by 60 bags.",
      steps: [
        "Step 1 (Total Crates): 45 + 35 = 80 crates",
        "Step 2 (Total Harvest Mass): 80 × 18 = 1,440 kg",
        "Step 3 (Usable Apples): 1,440 - 120 = 1,320 kg",
        "Step 4 (Mass per Bag): 1,320 ÷ 60 = 22 kg"
      ],
      explanation: "Total crates = 45 + 35 = 80 crates. Total mass = 80 × 18 kg = 1,440 kg. Usable mass = 1,440 - 120 = 1,320 kg. Kilograms per bag = 1,320 ÷ 60 = 22 kg."
    },
    {
      id: "m_y5_7",
      number: 22,
      focus: "Length / Distance & Combined Goals",
      q: "In a charity fun run, Maya runs 6 laps of a 400-metre track, Liam runs 8 laps, and Chloe runs 5 laps. If their combined goal was to run a total of 10,000 metres (10 km), how many more metres do they need to run to reach their goal?",
      options: ["2,400 m", "2,600 m", "3,400 m", "1,800 m"],
      ans: 0,
      hint: "Add the laps together (6 + 8 + 5 = 19 laps), multiply by 400 m, then subtract from 10,000 m.",
      steps: [
        "Step 1 (Total Laps Run): 6 + 8 + 5 = 19 laps",
        "Step 2 (Total Distance Run): 19 × 400 m = 7,600 m",
        "Step 3 (Metres to Goal): 10,000 m - 7,600 m = 2,400 m"
      ],
      explanation: "Total laps run = 6 + 8 + 5 = 19 laps. Total distance run = 19 × 400 m = 7,600 m. Remaining distance = 10,000 m - 7,600 m = 2,400 m."
    },
    {
      id: "m_y5_8",
      number: 23,
      focus: "Pack Multiplication, Subtraction & Crates",
      q: "A community canteen bought 12 packs of juice bottles, with 24 bottles in each pack. Over the weekend, 168 bottles were sold. The canteen supervisor wants to pack the remaining bottles equally into 6 storage crates. How many bottles will be in each crate?",
      options: ["18 bottles", "20 bottles", "22 bottles", "24 bottles"],
      ans: 1,
      hint: "Multiply 12 × 24 to get total stock, subtract 168 sold bottles, then divide the remainder by 6 crates.",
      steps: [
        "Step 1 (Initial Stock): 12 × 24 = 288 bottles",
        "Step 2 (Remaining Stock): 288 - 168 = 120 bottles",
        "Step 3 (Bottles per Crate): 120 ÷ 6 = 20 bottles"
      ],
      explanation: "Total bottles bought = 12 × 24 = 288 bottles. Remaining bottles = 288 - 168 = 120 bottles. Bottles per crate = 120 ÷ 6 = 20 bottles."
    },
    {
      id: "m_y5_9",
      number: 24,
      focus: "Division with Remainder / Bus Capacity & Cost",
      q: "There are 138 Year 5 students and 14 teachers going to camp. Each mini-bus can carry 19 passengers. If hiring each mini-bus costs $280 for the trip, what is the total cost to hire enough mini-buses for everyone?",
      options: ["$1,960", "$2,240", "$2,520", "$2,180"],
      ans: 1,
      hint: "Find total people (138 + 14 = 152), divide by 19 to find number of buses, then multiply by $280.",
      steps: [
        "Step 1 (Total Passengers): 138 + 14 = 152 people",
        "Step 2 (Buses Needed): 152 ÷ 19 = 8 buses exactly",
        "Step 3 (Total Hire Cost): 8 × $280 = $2,240"
      ],
      explanation: "Total passengers = 138 + 14 = 152 people. Number of mini-buses = 152 ÷ 19 = 8 buses. Total hire cost = 8 × $280 = $2,240."
    },
    {
      id: "m_y5_10",
      number: 25,
      focus: "Garden Soil Mixture & Bag Division",
      q: "A community garden has 6 raised garden beds. Each bed requires 85 kg of topsoil and 15 kg of compost. Soil is sold in 25 kg bags. How many bags of soil and compost mix are needed in total to fill all 6 garden beds?",
      options: ["20 bags", "22 bags", "24 bags", "28 bags"],
      ans: 2,
      hint: "Find mass per bed (85 + 15 = 100 kg), multiply by 6 beds (600 kg), then divide by 25 kg per bag.",
      steps: [
        "Step 1 (Mass per Bed): 85 kg + 15 kg = 100 kg",
        "Step 2 (Total Mass for 6 Beds): 6 × 100 kg = 600 kg",
        "Step 3 (Bags Needed): 600 ÷ 25 = 24 bags"
      ],
      explanation: "Each bed needs 85 kg + 15 kg = 100 kg. Total mix for 6 beds = 6 × 100 kg = 600 kg. Total 25 kg bags needed = 600 ÷ 25 = 24 bags."
    },
    {
      id: "m_y5_11",
      number: 26,
      focus: "Multi-Item Budget & Remaining Savings",
      q: "Lucas saved $450 to set up a craft stall. He spent $165 on timber, bought 6 pots of paint at $14 each, and bought 8 brushes at $6 each. How much of his savings did Lucas have left?",
      options: ["$143", "$163", "$173", "$153"],
      ans: 3,
      hint: "Calculate paint cost (6 × $14) and brush cost (8 × $6). Add all expenses ($165 + paint + brushes) and subtract from $450.",
      steps: [
        "Step 1 (Paint Cost): 6 × $14 = $84",
        "Step 2 (Brush Cost): 8 × $6 = $48",
        "Step 3 (Total Spent): $165 + $84 + $48 = $297",
        "Step 4 (Remaining Savings): $450 - $297 = $153"
      ],
      explanation: "Paint = 6 × $14 = $84. Brushes = 8 × $6 = $48. Total spent = $165 + $84 + $48 = $297. Remaining savings = $450 - $297 = $153."
    },
    {
      id: "m_y5_12",
      number: 27,
      focus: "Rate, Page Count & Time Calculation",
      q: "A teacher needs to print booklets for 3 classes of 28 students each. Each student receives a booklet that has 16 pages. If the printer prints 8 pages per minute, how many minutes will it take to print all the booklets?",
      options: ["144 minutes", "168 minutes", "182 minutes", "196 minutes"],
      ans: 1,
      hint: "Find total students (3 × 28), multiply by 16 pages to get total pages, then divide by 8 pages per minute.",
      steps: [
        "Step 1 (Total Students): 3 × 28 = 84 students",
        "Step 2 (Total Pages to Print): 84 × 16 = 1,344 pages",
        "Step 3 (Print Time): 1,344 ÷ 8 = 168 minutes"
      ],
      explanation: "Total students = 3 × 28 = 84 students. Total pages to print = 84 × 16 = 1,344 pages. Print time = 1,344 ÷ 8 pages/min = 168 minutes."
    },
    {
      id: "m_y5_13",
      number: 28,
      focus: "Raffle Books, Subtraction & Committee Division",
      q: "A swimming club printed 50 books of raffle tickets, with 20 tickets in each book. They sold 38 whole books and 15 individual tickets from an opened book. The remaining unsold tickets were shared equally among 5 committee members to return. How many unsold tickets did each committee member return?",
      options: ["35 tickets", "40 tickets", "45 tickets", "50 tickets"],
      ans: 2,
      hint: "Total tickets = 50 × 20 = 1,000. Sold = (38 × 20) + 15 = 775. Unsold = 1,000 - 775 = 225. Divide 225 by 5.",
      steps: [
        "Step 1 (Total Tickets): 50 × 20 = 1,000 tickets",
        "Step 2 (Sold Tickets): (38 × 20) + 15 = 760 + 15 = 775 tickets",
        "Step 3 (Unsold Tickets): 1,000 - 775 = 225 tickets",
        "Step 4 (Per Member): 225 ÷ 5 = 45 tickets"
      ],
      explanation: "Total tickets printed = 50 × 20 = 1,000 tickets. Tickets sold = (38 × 20) + 15 = 775 tickets. Unsold tickets = 1,000 - 775 = 225 tickets. Returned per member = 225 ÷ 5 = 45 tickets."
    },
    {
      id: "m_y5_14",
      number: 29,
      focus: "Capacity (Litres), Tank Multiplication & Daily Rate",
      q: "A farm has 3 rainwater tanks that each contain 1,500 litres of water. After a dry week, 1,860 litres are used for the vegetable gardens and 840 litres are used for livestock. The remaining water is to be used equally over the next 6 days. How many litres of water can be used per day?",
      options: ["250 litres", "280 litres", "300 litres", "350 litres"],
      ans: 2,
      hint: "Find initial water (3 × 1,500 L = 4,500 L). Add water used (1,860 + 840 = 2,700 L). Subtract to get remainder (1,800 L), then divide by 6 days.",
      steps: [
        "Step 1 (Total Initial Water): 3 × 1,500 L = 4,500 L",
        "Step 2 (Total Water Used): 1,860 L + 840 L = 2,700 L",
        "Step 3 (Remaining Water): 4,500 L - 2,700 L = 1,800 L",
        "Step 4 (Daily Rate): 1,800 L ÷ 6 = 300 L per day"
      ],
      explanation: "Total initial water = 3 × 1,500 L = 4,500 L. Total water used = 1,860 L + 840 L = 2,700 L. Remaining water = 4,500 L - 2,700 L = 1,800 L. Water available per day = 1,800 L ÷ 6 = 300 litres."
    },
    {
      id: "m_y5_15",
      number: 30,
      focus: "Row Multiplication, Row Removal & Stage Addition",
      q: "An event hall has 25 rows of chairs with 18 chairs in each row. For a science exhibition, workers remove 8 full rows of chairs, and then set up 45 extra single chairs near the stage. How many chairs are in the hall now?",
      options: ["351 chairs", "341 chairs", "369 chairs", "385 chairs"],
      ans: 0,
      hint: "Find remaining rows (25 - 8 = 17 rows), multiply by 18 chairs per row (306), then add the 45 extra stage chairs.",
      steps: [
        "Step 1 (Remaining Rows): 25 - 8 = 17 rows",
        "Step 2 (Chairs in Rows): 17 × 18 = 306 chairs",
        "Step 3 (Add Stage Chairs): 306 + 45 = 351 chairs"
      ],
      explanation: "Remaining rows = 25 - 8 = 17 rows. Chairs in remaining rows = 17 × 18 = 306 chairs. Total chairs after adding 45 stage chairs = 306 + 45 = 351 chairs."
    }
  ],

  // Year 3/4 Multi-Step Problems (Green tier)
  Year34: [
    {
      id: "m_y34_1",
      number: 16,
      focus: "Multiplication & Subtraction",
      q: "Ethan buys 4 sheets of stickers. Each sheet has 15 stickers on it. He gives 18 stickers to his sister. How many stickers does Ethan have left?",
      options: ["38", "45", "48", "42"],
      ans: 3,
      hint: "Multiply 4 × 15 to find the total stickers, then subtract the 18 stickers given away.",
      steps: [
        "Step 1: 4 × 15 = 60 stickers in total",
        "Step 2: 60 - 18 = 42 stickers left"
      ],
      explanation: "Total stickers = 4 × 15 = 60 stickers. Stickers left = 60 - 18 = 42 stickers."
    },
    {
      id: "m_y34_2",
      number: 17,
      focus: "Multiplication & Addition",
      q: "Mia bakes 5 trays of cookies with 12 cookies on each tray. Her brother brings 16 more freshly baked cookies from his class. How many cookies do they have altogether?",
      options: ["60", "76", "74", "80"],
      ans: 1,
      hint: "Multiply 5 × 12 to find Mia's cookies, then add 16 more cookies.",
      steps: [
        "Step 1: 5 × 12 = 60 cookies baked by Mia",
        "Step 2: 60 + 16 = 76 cookies altogether"
      ],
      explanation: "Mia's cookies = 5 × 12 = 60 cookies. Total cookies = 60 + 16 = 76 cookies."
    },
    {
      id: "m_y34_3",
      number: 18,
      focus: "Addition & Equal Sharing (Division)",
      q: "Oliver has 28 toy cars and Liam has 20 toy cars. They combine all their cars and share them equally into 6 storage boxes. How many cars are in each box?",
      options: ["8", "6", "7", "9"],
      ans: 0,
      hint: "Add 28 + 20 to get the total cars, then divide by 6 boxes.",
      steps: [
        "Step 1: 28 + 20 = 48 cars in total",
        "Step 2: 48 ÷ 6 = 8 cars per box"
      ],
      explanation: "Total cars = 28 + 20 = 48 cars. Cars per box = 48 ÷ 6 = 8 cars."
    },
    {
      id: "m_y34_4",
      number: 19,
      focus: "Money, Multiplication & Spending",
      q: "Ruby saves $8 each week for 6 weeks. She then spends $19 on a new board game. How much money does Ruby have left?",
      options: ["$29", "$31", "$33", "$39"],
      ans: 0,
      hint: "Multiply 6 × $8 to find her total savings, then subtract $19.",
      steps: [
        "Step 1: 6 × $8 = $48 saved",
        "Step 2: $48 - $19 = $29 left"
      ],
      explanation: "Total saved = 6 × $8 = $48. Money left = $48 - $19 = $29."
    },
    {
      id: "m_y34_5",
      number: 20,
      focus: "Subtraction & Division into Bags",
      q: "A fruit shop had 65 apples in a crate. 17 bruised apples were thrown away. The remaining good apples were packed equally into 6 bags. How many apples were in each bag?",
      options: ["6", "7", "10", "8"],
      ans: 3,
      hint: "Subtract 17 from 65 to find the good apples, then divide by 6 bags.",
      steps: [
        "Step 1: 65 - 17 = 48 good apples",
        "Step 2: 48 ÷ 6 = 8 apples per bag"
      ],
      explanation: "Good apples = 65 - 17 = 48 apples. Apples per bag = 48 ÷ 6 = 8 apples."
    },
    {
      id: "m_y34_6",
      number: 21,
      focus: "Multiplication & Adding Items",
      q: "A classroom has 7 pencil pots. Each pot contains 8 coloured pencils. The teacher adds 14 new pencils to the pots. How many pencils are there in total?",
      options: ["64", "68", "70", "72"],
      ans: 2,
      hint: "Multiply 7 × 8 to get the pencils in the pots, then add 14 new pencils.",
      steps: [
        "Step 1: 7 × 8 = 56 pencils",
        "Step 2: 56 + 14 = 70 pencils in total"
      ],
      explanation: "Initial pencils = 7 × 8 = 56 pencils. Total pencils = 56 + 14 = 70 pencils."
    },
    {
      id: "m_y34_7",
      number: 22,
      focus: "Multiplication & Remaining Target",
      q: "Jack reads 9 pages of his book every day for 5 days. If the whole book has 80 pages, how many pages does Jack still have left to read?",
      options: ["35", "40", "45", "55"],
      ans: 0,
      hint: "Multiply 5 × 9 to find pages read, then subtract from 80 pages.",
      steps: [
        "Step 1: 5 × 9 = 45 pages read",
        "Step 2: 80 - 45 = 35 pages left"
      ],
      explanation: "Pages read = 5 × 9 = 45 pages. Pages left = 80 - 45 = 35 pages."
    },
    {
      id: "m_y34_8",
      number: 23,
      focus: "Egg Cartons & Broken Eggs",
      q: "A farmer collects 6 full cartons of eggs, with 12 eggs in each carton. On the way to the kitchen, 7 eggs break. How many unbroken eggs does the farmer have?",
      options: ["63", "65", "67", "70"],
      ans: 1,
      hint: "Multiply 6 × 12 to find total eggs, then subtract 7 broken eggs.",
      steps: [
        "Step 1: 6 × 12 = 72 eggs collected",
        "Step 2: 72 - 7 = 65 unbroken eggs"
      ],
      explanation: "Total eggs = 6 × 12 = 72 eggs. Unbroken eggs = 72 - 7 = 65 eggs."
    },
    {
      id: "m_y34_9",
      number: 24,
      focus: "Three-Factor Multiplication",
      q: "In a soccer drill, 4 teams of 6 players each score 3 practice goals per player. How many practice goals were scored in total?",
      options: ["54", "64", "72", "84"],
      ans: 2,
      hint: "Multiply 4 teams × 6 players (24 players), then multiply by 3 goals per player.",
      steps: [
        "Step 1: 4 × 6 = 24 players",
        "Step 2: 24 × 3 = 72 practice goals"
      ],
      explanation: "Total players = 4 × 6 = 24 players. Total goals = 24 × 3 = 72 goals."
    },
    {
      id: "m_y34_10",
      number: 25,
      focus: "Multiplication, Subtraction & Platters",
      q: "The tuckshop makes 8 packs of sandwiches with 6 sandwiches in each pack. In the morning, 12 sandwiches are sold. The remaining sandwiches are packed equally into 4 lunch platters for teachers. How many sandwiches are on each platter?",
      options: ["7", "8", "9", "12"],
      ans: 2,
      hint: "Multiply 8 × 6 = 48, subtract 12 sold sandwiches (36), then divide by 4 platters.",
      steps: [
        "Step 1: 8 × 6 = 48 sandwiches made",
        "Step 2: 48 - 12 = 36 sandwiches remaining",
        "Step 3: 36 ÷ 4 = 9 sandwiches per platter"
      ],
      explanation: "Total sandwiches = 8 × 6 = 48. Remaining after sales = 48 - 12 = 36. Sandwiches per platter = 36 ÷ 4 = 9 sandwiches."
    },
    {
      id: "m_y34_11",
      number: 26,
      focus: "Addition & Shelves Division",
      q: "Grace potted 34 sunflower seedlings and Noah potted 26 sunflower seedlings. They placed the pots equally onto 5 garden shelves. How many pots are on each shelf?",
      options: ["10", "12", "14", "15"],
      ans: 1,
      hint: "Add 34 + 26 to find the total pots (60), then divide by 5 shelves.",
      steps: [
        "Step 1: 34 + 26 = 60 pots in total",
        "Step 2: 60 ÷ 5 = 12 pots per shelf"
      ],
      explanation: "Total pots = 34 + 26 = 60 pots. Pots per shelf = 60 ÷ 5 = 12 pots."
    },
    {
      id: "m_y34_12",
      number: 27,
      focus: "Bus Rows & Empty Seats",
      q: "A school bus has 11 rows of seats with 4 seats in each row. If 35 students sit on the bus, how many empty seats are left?",
      options: ["7", "8", "11", "9"],
      ans: 3,
      hint: "Multiply 11 × 4 to get total seats (44), then subtract the 35 students sitting down.",
      steps: [
        "Step 1: 11 × 4 = 44 total seats",
        "Step 2: 44 - 35 = 9 empty seats"
      ],
      explanation: "Total seats = 11 × 4 = 44 seats. Empty seats = 44 - 35 = 9 seats."
    },
    {
      id: "m_y34_13",
      number: 28,
      focus: "Bag Multiplication & Adding Marbles",
      q: "Leo has 4 bags of marbles with 15 marbles in each bag. He wins 18 more marbles in a game at lunch. How many marbles does Leo have now?",
      options: ["78", "68", "75", "84"],
      ans: 0,
      hint: "Multiply 4 × 15 = 60, then add 18 marbles.",
      steps: [
        "Step 1: 4 × 15 = 60 marbles",
        "Step 2: 60 + 18 = 78 marbles in total"
      ],
      explanation: "Initial marbles = 4 × 15 = 60 marbles. Total marbles = 60 + 18 = 78 marbles."
    },
    {
      id: "m_y34_14",
      number: 29,
      focus: "Addition, Box Multiplication & Sharing",
      q: "Sophia buys 3 boxes of strawberry cupcakes and 2 boxes of chocolate cupcakes. Each box contains 6 cupcakes. She shares all the cupcakes equally among 5 friends. How many cupcakes does each friend get?",
      options: ["5", "6", "7", "8"],
      ans: 1,
      hint: "Add boxes (3 + 2 = 5), multiply by 6 cupcakes per box (30), then divide by 5 friends.",
      steps: [
        "Step 1: 3 + 2 = 5 boxes in total",
        "Step 2: 5 × 6 = 30 cupcakes",
        "Step 3: 30 ÷ 5 = 6 cupcakes per friend"
      ],
      explanation: "Total boxes = 3 + 2 = 5 boxes. Total cupcakes = 5 × 6 = 30 cupcakes. Cupcakes per friend = 30 ÷ 5 = 6 cupcakes."
    },
    {
      id: "m_y34_15",
      number: 30,
      focus: "Pool Laps & Distance to Goal",
      q: "Zoe swims 8 laps of a 25-metre pool. Her goal for the morning is to swim 300 metres. How many more metres does Zoe need to swim to reach her goal?",
      options: ["75 m", "125 m", "150 m", "100 m"],
      ans: 3,
      hint: "Multiply 8 × 25 m to get the distance swum (200 m), then subtract from 300 m.",
      steps: [
        "Step 1: 8 × 25 m = 200 m swum",
        "Step 2: 300 m - 200 m = 100 m to goal"
      ],
      explanation: "Distance already swum = 8 × 25 m = 200 m. Remaining distance to goal = 300 m - 200 m = 100 metres."
    }
  ]
};
