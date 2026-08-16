/**
 * Math, Map-Reading & Data-Discernment Question Bank
 * Differentiated by Level: Red (L1), Blue (L2), Green (L3)
 */
window.MATH_QUESTIONS = {
  Red: [
    {
      id: "mq_r1",
      targetMapLayer: "forest",
      targetRegionId: "kaltara",
      q: "Examine the Rainforest Canopy Cover map layer and legend. Which province in Kalimantan is shaded in the darkest green, indicating over 65% remaining intact forest cover?",
      options: [
        "South Kalimantan (Kalimantan Selatan)",
        "North Kalimantan (Kalimantan Utara)",
        "West Kalimantan (Kalimantan Barat)",
        "Central Kalimantan (Kalimantan Tengah)"
      ],
      ans: 1,
      hint: "Check the top-right province on Borneo (capital: Tanjung Selor) and match its shade with the legend bin 'Over 65%'.",
      explanation: "North Kalimantan (Kalimantan Utara) has 74% forest cover, placing it in the >65% category (darkest green)."
    },
    {
      id: "mq_r2",
      targetMapLayer: "density",
      targetRegionId: "kalteng",
      q: "According to the Population Density map legend, which color category represents Central Kalimantan (density: 17.9 people/km²)?",
      options: [
        "Lightest Blue — Under 20 (Sparse / Remote)",
        "Sky Blue — 20 to 50 (Low Density)",
        "Deep Sky Blue — 50 to 100 (Moderate)",
        "Navy Blue — Over 500 (Extreme Urban)"
      ],
      ans: 0,
      hint: "Locate Central Kalimantan on the map and check where 17.9 fits in the density scale.",
      explanation: "Central Kalimantan's density of 17.9 people/km² falls strictly into the 'Under 20' bracket, shaded in the lightest blue."
    },
    {
      id: "mq_r3",
      targetMapLayer: "density",
      targetRegionId: "kalsel",
      q: "Which province has the HIGHEST population density on the entire island of Borneo, and what is its density classification?",
      options: [
        "East Kalimantan (30.6 people/km² — Low)",
        "South Kalimantan (108.4 people/km² — High Density)",
        "Sarawak (23.3 people/km² — Low)",
        "West Kalimantan (37.3 people/km² — Low)"
      ],
      ans: 1,
      hint: "Inspect the south-eastern corner of Kalimantan around Banjarmasin.",
      explanation: "South Kalimantan has 108.4 people/km², placing it in the '100–500 (High Density)' category (#0284C7), the highest on Borneo."
    },
    {
      id: "mq_r4",
      targetMapLayer: "density",
      targetRegionId: "kalbar",
      q: "West Kalimantan has a population of 5,500,000 and North Kalimantan has 720,000. What is the exact difference in population between these two provinces?",
      options: [
        "4,280,000",
        "4,780,000",
        "5,220,000",
        "6,220,000"
      ],
      ans: 1,
      hint: "Subtract 720,000 from 5,500,000 (5,500,000 - 720,000).",
      explanation: "5,500,000 - 720,000 = 4,780,000 people."
    },
    {
      id: "mq_r5",
      targetMapLayer: "density",
      targetRegionId: "none",
      q: "Refer to the Island Populations Chart. The island of Java has approximately 156,000,000 people, while all of Kalimantan has 17,100,000. Approximately how many times more populous is Java than Kalimantan?",
      options: [
        "About 3 times more populous",
        "About 5 times more populous",
        "About 9 times more populous",
        "About 20 times more populous"
      ],
      ans: 2,
      hint: "Calculate 156 ÷ 17.1 (or estimate 156,000,000 ÷ 17,000,000).",
      explanation: "156,000,000 ÷ 17,100,000 ≈ 9.12, so Java has roughly 9 times more people than Kalimantan."
    },
    {
      id: "mq_r6",
      targetMapLayer: "dayak",
      targetRegionId: "kalteng",
      q: "Central Kalimantan has a population of 2,750,000. According to the Dayak Population Share map, 53% of its population is Dayak. What is the estimated Dayak population in Central Kalimantan?",
      options: [
        "850,000",
        "1,120,000",
        "1,457,500",
        "2,100,000"
      ],
      ans: 2,
      hint: "Calculate 53% of 2,750,000 (0.53 × 2,750,000 = 2,750,000 × 53 ÷ 100).",
      explanation: "2,750,000 × 0.53 = 1,457,500 Dayak people living in Central Kalimantan."
    },
    {
      id: "mq_r7",
      targetMapLayer: "forest",
      targetRegionId: "none",
      q: "Examine the Borneo Forest Cover Timeline chart (1970–2025). Between 1970 and 2010, forest cover fell from 75% to 49%. By how many percentage points did the canopy decrease during this 40-year period?",
      options: [
        "16 percentage points",
        "24 percentage points",
        "26 percentage points",
        "36 percentage points"
      ],
      ans: 2,
      hint: "Calculate 75% - 49%.",
      explanation: "75% - 49% = 26 percentage points loss over 4 decades."
    },
    {
      id: "mq_r8",
      targetMapLayer: "density",
      targetRegionId: "none",
      q: "Australia's national population density is approximately 3.4 people/km², while Indonesia's national density is approximately 146 people/km². Approximately how many times denser is Indonesia than Australia?",
      options: [
        "About 10 times denser",
        "About 25 times denser",
        "About 43 times denser",
        "About 100 times denser"
      ],
      ans: 2,
      hint: "Calculate 146 ÷ 3.4.",
      explanation: "146 ÷ 3.4 ≈ 42.94, so Indonesia is approximately 43 times more densely populated than Australia."
    },
    {
      id: "mq_r9",
      targetMapLayer: "density",
      targetRegionId: "none",
      q: "Refer to the Australian States Comparison chart. What is the total combined population of New South Wales (8.4M), Victoria (6.8M), and Queensland (5.5M)?",
      options: [
        "19,700,000",
        "20,700,000",
        "21,200,000",
        "22,500,000"
      ],
      ans: 1,
      hint: "Add 8,400,000 + 6,800,000 + 5,500,000 (8.4 + 6.8 + 5.5 = 20.7 million).",
      explanation: "8.4M + 6.8M + 5.5M = 20.7 million = 20,700,000."
    },
    {
      id: "mq_r10",
      targetMapLayer: "dayak",
      targetRegionId: "none",
      q: "Looking at the Dayak Population Share map across all regions of Borneo, what geographic trend can be inferred?",
      options: [
        "Dayak populations live exclusively in coastal cities and ports.",
        "Dayak proportions are highest in the interior, central, and northern highland provinces rather than coastal commercial hubs.",
        "There are no Dayak people in Indonesian Kalimantan.",
        "Every single province has the exact same 25% Dayak share."
      ],
      ans: 1,
      hint: "Compare Central/West Kalimantan and Sarawak against the coastal urban hub of South Kalimantan.",
      explanation: "The thematic map shows that inland, riverine, and highland provinces (Central, West, North Kalimantan, and Sarawak) retain the highest percentages of Indigenous Dayak populations."
    }
  ],

  Blue: [
    {
      id: "mq_b1",
      targetMapLayer: "density",
      targetRegionId: "sabah",
      q: "On the Population Density map, what colour shade represents regions with a density between 50 and 100 people/km² (such as Sabah at 53 people/km²)?",
      options: [
        "Lightest Blue (#E0F2FE)",
        "Sky Blue (#38BDF8)",
        "Dark Navy (#0C4A6E)",
        "Forest Green (#15803D)"
      ],
      ans: 1,
      hint: "Check the map legend bin '50 – 100 (Moderate)' and note its color swatch.",
      explanation: "The 50–100 range is coded in Sky Blue (#38BDF8), which matches Sabah and Brunei."
    },
    {
      id: "mq_b2",
      targetMapLayer: "density",
      targetRegionId: "kaltara",
      q: "Which province on Borneo has the LOWEST population density (only 9.5 people/km²)?",
      options: [
        "South Kalimantan",
        "North Kalimantan (Kalimantan Utara)",
        "East Kalimantan",
        "Sabah"
      ],
      ans: 1,
      hint: "Look for the region shaded in the lightest colour with the smallest population per area.",
      explanation: "North Kalimantan has a density of only 9.5 people/km² across its rugged mountainous territory."
    },
    {
      id: "mq_b3",
      targetMapLayer: "density",
      targetRegionId: "none",
      q: "Looking at the Island Populations chart, which Indonesian island has the second-highest population after Java?",
      options: [
        "Sulawesi (20.5 million)",
        "Sumatra (60 million)",
        "Kalimantan (17.1 million)",
        "Bali & Nusa Tenggara (15.2 million)"
      ],
      ans: 1,
      hint: "Find the second tallest bar on the chart.",
      explanation: "Sumatra has 60,000,000 people, making it the second most populous island in Indonesia."
    },
    {
      id: "mq_b4",
      targetMapLayer: "density",
      targetRegionId: "kalsel",
      q: "East Kalimantan has 3,900,000 people and South Kalimantan has 4,200,000 people. How many more people live in South Kalimantan?",
      options: [
        "100,000",
        "200,000",
        "300,000",
        "400,000"
      ],
      ans: 2,
      hint: "Subtract 3,900,000 from 4,200,000.",
      explanation: "4,200,000 - 3,900,000 = 300,000 people."
    },
    {
      id: "mq_b5",
      targetMapLayer: "dayak",
      targetRegionId: "kalteng",
      q: "On the Dayak Population Share map, what does the dark amber colour (#F59E0B / #B45309) indicate?",
      options: [
        "Under 20% Dayak population",
        "High Dayak population concentration (Over 40%)",
        "No forest left in the region",
        "A region with no people"
      ],
      ans: 1,
      hint: "Read the labels next to the darker swatches on the Dayak map legend.",
      explanation: "Dark amber and brown colors signify regions with high Dayak population shares (>40% to >55%)."
    },
    {
      id: "mq_b6",
      targetMapLayer: "forest",
      targetRegionId: "none",
      q: "Look at the Forest Cover Timeline chart. What was Borneo's estimated forest canopy cover percentage in 1970?",
      options: [
        "25%",
        "50%",
        "75%",
        "95%"
      ],
      ans: 2,
      hint: "Check the first point on the timeline bar (1970).",
      explanation: "In 1970, approximately 75% of Borneo was covered by primary tropical rainforest."
    },
    {
      id: "mq_b7",
      targetMapLayer: "density",
      targetRegionId: "none",
      q: "Which Australian state has a population of 2,900,000, which is very close to Central Kalimantan's population (2,750,000)?",
      options: [
        "New South Wales (NSW)",
        "Victoria (VIC)",
        "Western Australia (WA)",
        "Tasmania (TAS)"
      ],
      ans: 2,
      hint: "Check the Australian States chart for a population bar around 2.9 million.",
      explanation: "Western Australia has 2,900,000 people, very close to Central Kalimantan's 2,750,000."
    },
    {
      id: "mq_b8",
      targetMapLayer: "density",
      targetRegionId: "kalbar",
      q: "West Kalimantan's population is 5,500,000. What is 5,500,000 rounded to the nearest million?",
      options: [
        "5,000,000",
        "6,000,000",
        "5,500,000",
        "10,000,000"
      ],
      ans: 1,
      hint: "When the hundreds-thousands digit is 5, round UP to the next million.",
      explanation: "5,500,000 rounds up to 6,000,000."
    },
    {
      id: "mq_b9",
      targetMapLayer: "density",
      targetRegionId: "none",
      q: "Why is South Kalimantan shaded in darker blue than Central Kalimantan on the density map?",
      options: [
        "Because South Kalimantan is larger in land area.",
        "Because South Kalimantan has a much higher population density (108.4 vs 17.9 people/km²).",
        "Because South Kalimantan has more trees.",
        "Because South Kalimantan is located further north."
      ],
      ans: 1,
      hint: "Remember that darker blue means more people per square kilometre.",
      explanation: "South Kalimantan packs 4.2 million people into a smaller area (108.4 people/km²), making it much denser than Central Kalimantan (17.9 people/km²)."
    },
    {
      id: "mq_b10",
      targetMapLayer: "dayak",
      targetRegionId: "sarawak",
      q: "Sarawak in Malaysia has a population of 2,900,000 with a 40% Dayak population share. How many Dayak people live in Sarawak?",
      options: [
        "580,000",
        "1,160,000",
        "1,450,000",
        "2,000,000"
      ],
      ans: 1,
      hint: "Calculate 40% of 2,900,000 (0.4 × 2,900,000).",
      explanation: "2,900,000 × 0.40 = 1,160,000 Dayak people."
    }
  ],

  Green: [
    {
      id: "mq_g1",
      targetMapLayer: "density",
      targetRegionId: "none",
      q: "Look at the Population Density map legend. What does the LIGHTEST blue colour (#E0F2FE) mean?",
      options: [
        "Under 20 people per square kilometre (Sparse / Few people)",
        "Over 500 people per square kilometre (Very crowded)",
        "Thick rainforest with no animals",
        "A huge ocean"
      ],
      ans: 0,
      hint: "Read the top box in the map key/legend.",
      explanation: "The lightest blue box in the legend shows 'Under 20 (Sparse / Remote)'."
    },
    {
      id: "mq_g2",
      targetMapLayer: "density",
      targetRegionId: "none",
      q: "Look at the Island Populations chart. Which island has the TALLEST bar (the most people)?",
      options: [
        "Java",
        "Sumatra",
        "Kalimantan",
        "Papua"
      ],
      ans: 0,
      hint: "Find the bar that reaches up to 156 million.",
      explanation: "Java has 156 million people, making its bar by far the tallest."
    },
    {
      id: "mq_g3",
      targetMapLayer: "density",
      targetRegionId: "kaltara",
      q: "North Kalimantan has a population of 720,000. In words, how do you say this number?",
      options: [
        "Seventy-two thousand",
        "Seven hundred and twenty thousand",
        "Seven million and twenty",
        "Seven hundred and two"
      ],
      ans: 1,
      hint: "720 thousands = Seven hundred and twenty thousand.",
      explanation: "720,000 is written in words as 'Seven hundred and twenty thousand'."
    },
    {
      id: "mq_g4",
      targetMapLayer: "density",
      targetRegionId: "kalbar",
      q: "West Kalimantan has a population of 5,500,000. What is the value of the digit 5 in the hundred-thousands place (the middle 5)?",
      options: [
        "500",
        "5,000",
        "50,000",
        "500,000"
      ],
      ans: 3,
      hint: "In 5,500,000, the first 5 is 5 millions, and the second 5 is in the hundred-thousands place.",
      explanation: "The middle 5 represents five hundred thousand (500,000)."
    },
    {
      id: "mq_g5",
      targetMapLayer: "density",
      targetRegionId: "none",
      q: "Which list correctly puts these three populations in order from SMALLEST to LARGEST?",
      options: [
        "720,000  →  2,750,000  →  5,500,000",
        "5,500,000  →  2,750,000  →  720,000",
        "2,750,000  →  720,000  →  5,500,000",
        "720,000  →  5,500,000  →  2,750,000"
      ],
      ans: 0,
      hint: "Start with North Kalimantan (720k), then Central (2.75M), then West (5.5M).",
      explanation: "720,000 is less than 2,750,000, which is less than 5,500,000."
    },
    {
      id: "mq_g6",
      targetMapLayer: "forest",
      targetRegionId: "none",
      q: "Look at the Forest Cover Timeline chart. Did the green rainforest cover become BIGGER or SMALLER between 1970 and 2010?",
      options: [
        "It got BIGGER.",
        "It got SMALLER (from 75% down to 49%).",
        "It stayed exactly the same.",
        "The forest disappeared completely in 1970."
      ],
      ans: 1,
      hint: "The percentage went from 75% down to 49%.",
      explanation: "The rainforest became smaller due to logging and farming between 1970 and 2010."
    },
    {
      id: "mq_g7",
      targetMapLayer: "dayak",
      targetRegionId: "none",
      q: "In a Dayak village, 250 people live in Longhouse A and 180 people live in Longhouse B. How many people live in both longhouses in total?",
      options: [
        "330",
        "420",
        "430",
        "530"
      ],
      ans: 2,
      hint: "Add 250 + 180 (250 + 100 = 350; 350 + 80 = 430).",
      explanation: "250 + 180 = 430 people."
    },
    {
      id: "mq_g8",
      targetMapLayer: "density",
      targetRegionId: "none",
      q: "Look at the Australian States chart. Which state has the LARGEST population (tallest bar)?",
      options: [
        "New South Wales (NSW — 8.4 million)",
        "Tasmania (TAS — 570 thousand)",
        "Northern Territory (NT — 250 thousand)",
        "South Australia (SA — 1.85 million)"
      ],
      ans: 0,
      hint: "Find the state with the highest bar (8,400,000).",
      explanation: "New South Wales has the largest population in Australia with 8,400,000 people."
    },
    {
      id: "mq_g9",
      targetMapLayer: "forest",
      targetRegionId: "kaltara",
      q: "Look at the Rainforest Canopy Cover map. What colour shows areas with OVER 65% forest cover?",
      options: [
        "Pink / Light Red",
        "Light Green",
        "Dark Forest Green (#15803D)",
        "Yellow"
      ],
      ans: 2,
      hint: "Check the bottom box on the Rainforest Cover legend.",
      explanation: "The dark forest green swatch (#15803D) represents over 65% remaining intact rainforest."
    },
    {
      id: "mq_g10",
      targetMapLayer: "density",
      targetRegionId: "none",
      q: "A wildlife sanctuary had 900 orangutans. 350 were safely released into a new protected park. How many orangutans remained in the sanctuary?",
      options: [
        "450",
        "550",
        "650",
        "1,250"
      ],
      ans: 1,
      hint: "Subtract 350 from 900 (900 - 300 = 600; 600 - 50 = 550).",
      explanation: "900 - 350 = 550 orangutans."
    }
  ]
};
