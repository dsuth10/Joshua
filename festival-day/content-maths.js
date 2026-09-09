/* Fictional maths mission content for the Great Neighbourhood Film Festival. */
window.FestivalMaths = {
  missions: [
    {
      id: "m03",
      title: "Make the Grounds Work",
      film: 3,
      type: "core",
      brief: "The festival needs a safe outdoor screen area. Use the site plan and the measurements to choose a layout that fits the space. Show the committee how you know it will work.",
      reading: {
        main: "The Bayview Community Festival has a flat grass area that is 36 metres long and 24 metres wide. The committee wants a rectangular Screen Zone inside it. The Screen Zone must leave a 2 metre-wide walking path around every side. The committee also needs a low rope fence around the outside edge of the Screen Zone.\n\nTwo plans are being discussed. Plan A is 28 metres long and 16 metres wide. Plan B is 30 metres long and 18 metres wide. The grass is large enough for either plan, but the walking path still has to fit. The committee has 95 metres of rope.\n\nA local family has offered 350 square metres of picnic mats. The committee would like to cover as much of the Screen Zone as possible, but people can also sit on the grass.",
        support: "Helpful words: area means the space inside a shape. For a rectangle, multiply length by width. Perimeter means the distance around the edge. Add all four sides, or use 2 times length plus 2 times width."
      },
      sources: [
        { label: "Site-measurement card", text: "Festival grass area: 36 m by 24 m. Required walking path: 2 m wide on every side of the Screen Zone." },
        { label: "Equipment card", text: "Rope available: 95 m. Picnic mats available: 350 m²." }
      ],
      questions: [
        {
          id: "m03-q1",
          kind: "number",
          prompt: "What is the area of Plan A's Screen Zone in square metres?",
          answer: 448,
          unit: "m²",
          feedback: { correct: "Yes. 28 × 16 = 448 m².", incorrect: "Find area by multiplying the length by the width. Try 28 × 16." }
        },
        {
          id: "m03-q2",
          kind: "choice",
          prompt: "Which plan can have the 2 m walking path around every side and still fit inside the 36 m by 24 m grass area?",
          options: [
            { value: "a", label: "Plan A only" },
            { value: "b", label: "Plan B only" },
            { value: "both", label: "Both plans" },
            { value: "neither", label: "Neither plan" }
          ],
          answer: "both",
          feedback: { correct: "Correct. Plan A needs 32 m by 20 m including paths. Plan B needs 34 m by 22 m. Both fit.", incorrect: "Add 4 m to both the length and width of each plan, because there is a 2 m path on two opposite sides." }
        },
        {
          id: "m03-q3",
          kind: "number",
          prompt: "How many metres of rope would be left after fencing Plan B?",
          answer:  -1,
          unit: "m",
          feedback: { correct: "Correct. Plan B needs 96 m of rope, so the committee is short by 1 m. Record this as −1 m or explain that it is 1 m short.", incorrect: "Plan B's perimeter is 2 × (30 + 18). Compare that with 95 m." }
        }
      ],
      writing: {
        prompt: "Write a recommendation to the committee. Choose Plan A or Plan B. Explain its area and perimeter, say whether the paths fit, and explain what should happen with the rope and picnic mats. Use numbers and units in your paragraph.",
        stems: ["I recommend Plan ... because ...", "The Screen Zone has an area of ... m².", "The fence would need ... m of rope, so ...", "The picnic mats would ..."]
      },
      criteria: ["Uses correct area and perimeter information", "Explains whether the plan and paths fit", "Gives a clear recommendation with units"],
      extension: "Draw or describe a third rectangular Screen Zone that fits with the paths and uses no more than 95 m of rope. Calculate its area and explain one advantage of your design.",
      sourceNote: "All figures and place names are fictional teaching data, designed for area and perimeter practice."
    },
    {
      id: "m05",
      title: "The Allocation Challenge",
      film: 5,
      type: "core",
      brief: "The festival has a limited supply of tickets, water and fabric. Work out a fair plan, then explain how your choices would help different visitors.",
      reading: {
        main: "The Festival Welcome Team has 240 free tickets. Three eighths of the tickets are for local primary-school families. One quarter is for older community members. The rest are for visiting families from nearby towns.\n\nThe team has 18 litres of drinking water for the volunteer table. Water is poured into 600 millilitre bottles. The team also has 7.5 metres of bright fabric to make table signs. Each sign needs 75 centimetres of fabric.\n\nA volunteer suggests giving every group exactly the same number of tickets. Another volunteer says the ticket plan should follow the fractions that the community agreed on.",
        support: "Helpful words: a fraction is part of a whole. To find one quarter of 240, divide by 4. To find three eighths, first divide by 8, then multiply by 3. 1 litre = 1,000 millilitres. 1 metre = 100 centimetres."
      },
      sources: [
        { label: "Ticket agreement", text: "240 total tickets: 3/8 primary-school families, 1/4 older community members, the rest visiting families." },
        { label: "Supply list", text: "18 L water; bottles hold 600 mL each. 7.5 m fabric; each table sign needs 75 cm." }
      ],
      questions: [
        {
          id: "m05-q1",
          kind: "number",
          prompt: "How many tickets are for local primary-school families?",
          answer: 90,
          unit: "tickets",
          feedback: { correct: "Correct. One eighth of 240 is 30, and three eighths is 90.", incorrect: "Divide 240 by 8 first. Then multiply that answer by 3." }
        },
        {
          id: "m05-q2",
          kind: "number",
          prompt: "How many 600 mL bottles can be filled from 18 litres of water?",
          answer: 30,
          unit: "bottles",
          feedback: { correct: "Correct. 18 L is 18,000 mL, and 18,000 ÷ 600 = 30.", incorrect: "Change litres to millilitres before dividing: 18 L = 18,000 mL." }
        },
        {
          id: "m05-q3",
          kind: "choice",
          prompt: "How many table signs can be made from 7.5 m of fabric?",
          options: [
            { value: "7", label: "7 signs" },
            { value: "10", label: "10 signs" },
            { value: "75", label: "75 signs" },
            { value: "100", label: "100 signs" }
          ],
          answer: "10",
          feedback: { correct: "Correct. 7.5 m is 750 cm, and 750 ÷ 75 = 10.", incorrect: "Convert 7.5 m to centimetres, then divide by 75 cm per sign." }
        }
      ],
      writing: {
        prompt: "Write a short allocation note for the Festival Welcome Team. State how many tickets each group should receive, how many water bottles can be filled and how many signs can be made. Explain why following the agreed fractions is fairer than giving every group the same number of tickets.",
        stems: ["The 240 tickets should be shared as ...", "This leaves ... tickets for visiting families.", "The team can fill ... bottles.", "Following the fractions is fair because ..."]
      },
      criteria: ["Calculates fractions of the ticket total correctly", "Converts metric units correctly", "Explains fairness using the agreed plan"],
      extension: "The team finds another 4.8 L of water. Work out the new number of full bottles. Then suggest how 10 signs could be shared between three areas of the festival, and explain your choice.",
      sourceNote: "All allocations are fictional teaching data. Metric conversions use standard Australian units."
    },
    {
      id: "e03",
      title: "Extension: The Rain-Shelter Repair",
      film: 9,
      type: "extension",
      brief: "Rain is predicted. The committee needs to cover a rectangular reading tent floor and buy enough edge tape to stop the mat from curling.",
      reading: {
        main: "A reading tent floor is 6 m long and 4 m wide. The committee has four identical rubber mats. Each mat is 1.5 m long and 2 m wide. They will place the mats side by side with no gaps. They also want tape around the outside edge of the finished mat area. Tape is sold in 5 m rolls.\n\nThe stall owner says three rolls will be enough. Check the claim before the committee spends money.",
        support: "Start by finding the area of the tent floor and one mat. Then find the distance around the finished rectangle."
      },
      sources: [
        { label: "Tent card", text: "Tent floor: 6 m by 4 m." },
        { label: "Mat and tape card", text: "Four mats: 1.5 m by 2 m each. Tape rolls: 5 m each." }
      ],
      questions: [
        { id: "e03-q1", kind: "number", prompt: "What is the area of the tent floor?", answer: 24, unit: "m²", feedback: { correct: "Correct. 6 × 4 = 24 m².", incorrect: "Multiply the length by the width." } },
        { id: "e03-q2", kind: "choice", prompt: "Do four mats cover the whole tent floor?", options: [{ value: "yes", label: "Yes, exactly" }, { value: "no", label: "No, there is a gap" }], answer: "no", feedback: { correct: "Correct. Each mat has an area of 3 m², so four mats cover 12 m². The 24 m² floor would still have a gap.", incorrect: "Each mat is 1.5 × 2 = 3 m². Four mats cover 12 m², so compare with the 24 m² floor." } },
        { id: "e03-q3", kind: "number", prompt: "How many 5 m tape rolls are needed to tape around the tent floor?", answer: 4, unit: "rolls", feedback: { correct: "Correct. The perimeter is 20 m. Four 5 m rolls make 20 m.", incorrect: "Find the perimeter first: 2 × (6 + 4). Then divide by 5." } }
      ],
      writing: { prompt: "Write to the stall owner. Explain whether the four mats cover the floor and whether three tape rolls are enough. Use calculations to support your answer.", stems: ["The floor area is ...", "The mats cover ...", "The tape needed is ...", "Therefore ..."] },
      criteria: ["Finds area and perimeter", "Checks a claim with evidence", "Explains the result clearly"],
      extension: "Correct the tent plan by choosing a new number or size of mats that would cover 24 m² exactly.",
      sourceNote: "Fictional extension data for checking area and perimeter claims."
    },
    {
      id: "e04",
      title: "Extension: The Fraction Vote",
      film: 10,
      type: "extension",
      brief: "The Festival Committee has asked children to vote for the final activity. Check whether the announcement reports the fractions correctly.",
      reading: {
        main: "Forty students voted for one of four final activities. One quarter chose a puppet show. Three tenths chose a dance workshop. One fifth chose a science show. The remaining students chose a drawing table.\n\nThe announcement says, ‘Half of all students chose the drawing table.’ The committee needs you to check this before it is published.",
        support: "Find each part out of 40. The remaining number is what is left after the first three choices."
      },
      sources: [{ label: "Voting card", text: "40 votes: 1/4 puppet show, 3/10 dance workshop, 1/5 science show, remainder drawing table." }],
      questions: [
        { id: "e04-q1", kind: "number", prompt: "How many students chose the puppet show?", answer: 10, unit: "students", feedback: { correct: "Correct. One quarter of 40 is 10.", incorrect: "Divide 40 into four equal groups." } },
        { id: "e04-q2", kind: "number", prompt: "How many students chose the dance workshop?", answer: 12, unit: "students", feedback: { correct: "Correct. One tenth of 40 is 4, and three tenths is 12.", incorrect: "Find one tenth of 40, then multiply by 3." } },
        { id: "e04-q3", kind: "choice", prompt: "Is the announcement about the drawing table correct?", options: [{ value: "yes", label: "Yes, it is half" }, { value: "no", label: "No, it is not half" }], answer: "no", feedback: { correct: "Correct. 10 + 12 + 8 = 30, leaving 10. Ten out of 40 is one quarter, not one half.", incorrect: "Work out the first three groups, then subtract their total from 40." } }
      ],
      writing: { prompt: "Write a corrected announcement. Include the number of students for every activity and explain the mistake in the first announcement.", stems: ["Out of 40 students, ...", "The drawing table received ... votes.", "The first announcement was wrong because ..."] },
      criteria: ["Finds fractions of a whole", "Calculates the remainder", "Explains an error accurately"],
      extension: "Make a new vote of 50 students using fractions that can be worked out exactly. Write a question for another student to solve.",
      sourceNote: "Fictional vote figures for fraction and remainder practice."
    },
    {
      id: "e05",
      title: "Extension: The Supply-Run Conversion",
      film: 11,
      type: "extension",
      brief: "The lighting crew has written its measurements in mixed units. Convert them so the supplier can pack the right amount of cable and tape.",
      reading: {
        main: "The lighting crew needs 3.6 m of yellow safety cable, 275 cm of blue cable and 4,500 mm of silver tape. The supplier packs cable in 1 m lengths and tape in 1 m rolls.\n\nThe crew leader says, ‘We need 6 m of cable and 4 rolls of tape.’ Check the list. The supplier can only give whole lengths and whole rolls, so amounts must be rounded up when there is some left over.",
        support: "1 m = 100 cm = 1,000 mm. To change centimetres to metres, divide by 100. To change millimetres to metres, divide by 1,000."
      },
      sources: [{ label: "Crew list", text: "Yellow cable: 3.6 m. Blue cable: 275 cm. Silver tape: 4,500 mm. Supplies come in whole 1 m lengths or rolls." }],
      questions: [
        { id: "e05-q1", kind: "number", prompt: "How many metres of blue cable are needed?", answer: 2.75, unit: "m", feedback: { correct: "Correct. 275 cm ÷ 100 = 2.75 m.", incorrect: "There are 100 cm in 1 m, so divide 275 by 100." } },
        { id: "e05-q2", kind: "number", prompt: "How many whole 1 m cable lengths must the supplier pack for both cable colours together?", answer: 7, unit: "lengths", feedback: { correct: "Correct. 3.6 m + 2.75 m = 6.35 m, so 7 whole lengths are needed.", incorrect: "Add the yellow and blue amounts in metres, then round up to a whole metre." } },
        { id: "e05-q3", kind: "choice", prompt: "How many 1 m tape rolls are needed?", options: [{ value: "4", label: "4 rolls" }, { value: "5", label: "5 rolls" }, { value: "45", label: "45 rolls" }], answer: "5", feedback: { correct: "Correct. 4,500 mm is 4.5 m, so the crew needs 5 whole rolls.", incorrect: "Change 4,500 mm to metres, then remember to round up for a whole roll." } }
      ],
      writing: { prompt: "Write a packing note for the supplier. State the amounts in metres and explain why the crew leader's list needs to change.", stems: ["The blue cable is ... m.", "Together, the cables measure ... m.", "The supplier should pack ...", "This is because ..."] },
      criteria: ["Converts centimetres and millimetres to metres", "Rounds up whole supplies correctly", "Explains the supplier decision"],
      extension: "The supplier offers 50 cm cable pieces instead of 1 m pieces. Work out the smallest number of pieces needed for 6.35 m of cable.",
      sourceNote: "Fictional supply list for metric conversion and practical rounding practice."
    }
  ]
};
