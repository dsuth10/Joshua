/* Authored challenge library for Mix-It-Up Day. */
window.MixContent = {
  core: [
    {
      id: 'vending-machine', title: 'The Vending Machine That Sold…', icon: '🥤', type: 'Writing', minutes: 25,
      brief: 'A strange vending machine has appeared at school. What could it sell?',
      prompt: 'Choose one button: weather, tiny adventures, or unusual talents. Write a short story (about 120–180 words) about someone who presses it. Include what they bought, a problem or surprise, and how the story ends.',
      support: 'Try this plan: First… Then… Oh no!… Finally… Add one detail that helps us picture the machine.',
      stretch: 'Make an ordinary object from the school play an important part in the ending.',
      criteria: ['My story has a beginning, a surprise or problem, and an ending.', 'I used details to make the idea easy to imagine.', 'I reread and improved at least one sentence.'],
      fields: [
        { id: 'button', label: 'Which button was pressed?', type: 'choice', options: ['Weather', 'Tiny adventures', 'Unusual talents'] },
        { id: 'story', label: 'My story', type: 'text', multiline: true, wordTarget: [120, 180], placeholder: 'The machine hummed as…' },
        { id: 'improvedSentence', label: 'A sentence I improved', type: 'text', wordTarget: [8, 20], placeholder: 'Paste or write your improved sentence here.' }
      ]
    },
    {
      id: 'snack-shop', title: 'Snack Shop Showdown', icon: '🍓', type: 'Maths', minutes: 25,
      brief: 'Four friends have $20.00 for a shared snack order.',
      prompt: 'Use this menu: fruit cup $2, popcorn $3, cheese toastie $4, smoothie $5. Ava wants fruit, Ben wants popcorn, Cleo wants a toastie, and Dev wants a smoothie. Buy at least one of each. What is the cheapest order that works? Then work out the change from $20. Which is the better deal: 2 smoothies for $9, or two single smoothies?',
      support: 'List the four must-have items first. Add their prices carefully, then subtract from $20.00. Remember: two single smoothies cost 2 × $5.',
      stretch: 'Spend as close as possible to $20 without going over. Explain what you added and why.',
      criteria: ['My order includes every friend’s requested snack.', 'My total and change match my working.', 'I explained the better smoothie deal.'],
      fields: [
        { id: 'order', label: 'My snack order and calculations', type: 'text', multiline: true, wordTarget: [15, 35], placeholder: '1 fruit cup = $2…' },
        { id: 'total', label: 'Total cost ($)', type: 'number', answer: 14, feedbackCorrect: 'Yes — the four required snacks cost $14.', feedbackIncorrect: 'Check that you included one of each of the four requested snacks.' },
        { id: 'change', label: 'Change from $20 ($)', type: 'number', answer: 6, feedbackCorrect: 'Correct. $20 − $14 = $6.', feedbackIncorrect: 'Subtract your total cost from $20.' },
        { id: 'deal', label: 'Which smoothie deal is better?', type: 'choice', options: ['2 smoothies for $9', 'Two single smoothies', 'They cost the same'], answer: '2 smoothies for $9', feedbackCorrect: 'Correct — $9 is $1 less than $10.', feedbackIncorrect: 'Work out the cost of two single smoothies before you compare.' },
        { id: 'dealReason', label: 'Explain your choice', type: 'text', wordTarget: [12, 25], placeholder: 'I chose… because…' }
      ]
    },
    {
      id: 'number-trick-lab', title: 'Number Trick Lab', icon: '🧪', type: 'Maths', minutes: 20,
      brief: 'Test your number powers in three small puzzles.',
      prompt: 'Solve each puzzle. Show enough working that another person could follow your thinking. 1) Use 3, 4, 6 and 8 once each to make 24. 2) Find the missing number: □ × 7 = 56. 3) Continue the pattern: 5, 9, 13, 17, __, __. Explain the rule.',
      support: 'For the target, look for pairs you can multiply or add. In a multiplication equation, think: “What times 7 makes 56?” Look at the gap between pattern numbers.',
      stretch: 'Create your own target-24 puzzle with four numbers and test it on someone else.',
      criteria: ['I recorded an expression or working for each puzzle.', 'My pattern rule explains every jump.', 'I checked my answers.'],
      fields: [
        { id: 'targetWorking', label: 'Make 24: my expression', type: 'text', wordTarget: [3, 12], placeholder: 'For example: ( … )' },
        { id: 'missingFactor', label: '□ × 7 = 56. The missing number is', type: 'number', answer: 8, feedbackCorrect: 'Correct — 8 groups of 7 make 56.', feedbackIncorrect: 'Try sharing 56 into 7 equal groups.' },
        { id: 'nextOne', label: 'First next pattern number', type: 'number', answer: 21, feedbackCorrect: 'Correct.', feedbackIncorrect: 'Compare 5 to 9, then use the same jump.' },
        { id: 'nextTwo', label: 'Second next pattern number', type: 'number', answer: 25, feedbackCorrect: 'Correct.', feedbackIncorrect: 'Keep using the same jump after 21.' },
        { id: 'rule', label: 'Pattern rule', type: 'text', wordTarget: [8, 18], placeholder: 'Each time I…' }
      ]
    },
    {
      id: 'unusual-class-pet', title: 'A Very Unusual Class Pet', icon: '🐉', type: 'Writing', minutes: 25,
      brief: 'The class needs a new pet. Your pitch might win the vote.',
      prompt: 'Choose a tiny dragon, talking snail, or miniature mammoth. Write a persuasive pitch (about 100–150 words) convincing the class to choose it. Give two reasons, explain how it would be cared for, and answer one worry someone might have.',
      support: 'Start with “Our class should choose…” Use “Firstly” and “Also” for your reasons. A worry might begin, “Some people may think…”',
      stretch: 'Add a slogan that would look good on a campaign poster.',
      criteria: ['I clearly stated my opinion.', 'I gave at least two developed reasons.', 'I included a practical care plan and answered a possible worry.'],
      fields: [
        { id: 'pet', label: 'My pet choice', type: 'choice', options: ['Tiny dragon', 'Talking snail', 'Miniature mammoth'] },
        { id: 'pitch', label: 'My persuasive pitch', type: 'text', multiline: true, wordTarget: [100, 150], placeholder: 'Our class should choose…' },
        { id: 'slogan', label: 'Optional campaign slogan', type: 'text', optional: true, wordTarget: [2, 8], placeholder: 'Vote for…' }
      ]
    },
    {
      id: 'great-day-out', title: 'The Great Day-Out Puzzle', icon: '🗺️', type: 'Word problem', minutes: 25,
      brief: 'Plan a fun day that fits the clock and the budget.',
      prompt: 'Your group arrives at Fun Park at 10:00 am and must leave at 2:30 pm. Travel between activities takes 10 minutes. Lunch takes 30 minutes. Choose activities: climbing wall 45 min ($6), laser maze 30 min ($5), science show 40 min ($4), and mini golf 50 min ($7). Plan a schedule with lunch and at least three activities. Can four students buy a group pass for $20 instead of four climbing-wall tickets? Explain.',
      support: 'Make a timeline. Add 10 minutes each time you move to another activity. For tickets, find the cost of four single climbing-wall tickets first.',
      stretch: 'Find two different schedules that both work. Which one gives more free time?',
      criteria: ['My schedule fits between 10:00 am and 2:30 pm.', 'I included lunch and travel time.', 'I showed why the group pass does or does not save money.'],
      fields: [
        { id: 'schedule', label: 'My timetable and working', type: 'text', multiline: true, wordTarget: [20, 45], placeholder: '10:00–10:45 climbing wall…' },
        { id: 'singleTickets', label: 'Four climbing-wall tickets cost ($)', type: 'number', answer: 24, feedbackCorrect: 'Correct — 4 × $6 = $24.', feedbackIncorrect: 'Multiply the price of one climbing ticket by four.' },
        { id: 'groupPass', label: 'Does the $20 group pass save money?', type: 'choice', options: ['Yes, it saves $4', 'No, it costs $4 more', 'No, the prices are equal'], answer: 'Yes, it saves $4', feedbackCorrect: 'Correct — $24 − $20 = $4 saved.', feedbackIncorrect: 'Compare $20 with the cost of four single tickets.' },
        { id: 'possible', label: 'Why is your schedule possible?', type: 'text', wordTarget: [15, 30], placeholder: 'It works because…' }
      ]
    },
    {
      id: 'pixel-playground', title: 'Pixel Playground', icon: '🎨', type: 'Maths design', minutes: 20,
      brief: 'Make a tiny piece of pixel art with fraction and symmetry rules.',
      prompt: 'Colour the 4 × 4 grid. Use exactly 8 blue squares (one half), 4 yellow squares (one quarter), and 4 mint squares. Make your design symmetrical from left to right. Then explain how you checked it.',
      support: 'There are 16 squares altogether. Work one half of the grid first, then mirror it on the other side. Count each colour when you finish.',
      stretch: 'Use the same colour totals to make a second, different symmetrical design.',
      criteria: ['My grid has 8 blue, 4 yellow and 4 mint squares.', 'The left and right sides mirror each other.', 'My explanation tells how I checked the fractions and symmetry.'],
      fields: [
        { id: 'design', label: 'My pixel design', type: 'grid', rows: 4, cols: 4, palette: [{ id: 'blue', label: 'Blue', color: '#3277e8' }, { id: 'yellow', label: 'Yellow', color: '#ffd43b' }, { id: 'mint', label: 'Mint', color: '#63d9b0' }], rules: { counts: { blue: 8, yellow: 4, mint: 4 }, symmetry: 'vertical' } },
        { id: 'explanation', label: 'How I checked my design', type: 'text', multiline: true, wordTarget: [20, 40], placeholder: 'I counted… and I checked the mirror line by…' }
      ]
    }
  ],
  extras: [
    {
      id: 'invisible-backpack', title: 'Lost: One Invisible Backpack', icon: '🎒', type: 'Writing extra', minutes: 15,
      brief: 'Someone lost an invisible backpack. A great notice needs excellent clues.',
      prompt: 'Write a funny lost-property notice that helps the owner get their invisible backpack back. Include at least three precise clues, where it was last seen, and safe instructions for the finder.',
      support: 'Even invisible things can leave clues: a sound, smell, trail, shape, or what is inside.', stretch: 'Add a small reward that makes people want to help.',
      criteria: ['I included three useful clues.', 'I said where it was last seen.', 'I gave clear finder instructions.'],
      fields: [{ id: 'notice', label: 'My lost-property notice', type: 'text', multiline: true, wordTarget: [60, 90], placeholder: 'LOST: An invisible backpack…' }]
    },
    {
      id: 'worst-superpower', title: 'Worst Superpower, Best Rescue', icon: '🦸', type: 'Writing extra', minutes: 20,
      brief: 'A weird power turns out to be exactly what is needed.',
      prompt: 'Write an 80–120-word scene where a seemingly useless power solves a real problem. Pick one: make toast slightly warmer, understand pigeons, or turn shoelaces purple.',
      support: 'Give your character a problem first. Then show the odd power being useful in an unexpected way.', stretch: 'End with a twist that changes how people see the power.',
      criteria: ['My scene has a problem and a solution.', 'The unusual power matters to the solution.', 'I used details or dialogue.'],
      fields: [{ id: 'power', label: 'Power choice', type: 'choice', options: ['Warmer toast', 'Understand pigeons', 'Purple shoelaces'] }, { id: 'scene', label: 'My rescue scene', type: 'text', multiline: true, wordTarget: [80, 120], placeholder: 'Everyone laughed at… until…' }]
    },
    {
      id: 'sticker-swap', title: 'Sticker Swap', icon: '⭐', type: 'Maths extra', minutes: 15,
      brief: 'Work out fair sticker trades.',
      prompt: 'Mia has 5 packs of 8 stickers. Leo has 7 packs of 6 stickers. How many stickers do they have altogether? If they share all stickers equally between 4 people, how many does each person get and how many are left? Is trading 3 packs of 8 for 4 packs of 6 fair? Explain.',
      support: 'Find each collection first, then add. For sharing, divide the total by 4. Compare the two trade totals.', stretch: 'Invent a fair trade using different numbers of packs.',
      criteria: ['I showed each multiplication.', 'I recorded the equal share and remainder.', 'I justified whether the trade is fair.'],
      fields: [{ id: 'total', label: 'Total stickers', type: 'number', answer: 82, feedbackCorrect: 'Correct — 40 + 42 = 82.', feedbackIncorrect: 'Work out 5 × 8 and 7 × 6, then add.' }, { id: 'each', label: 'Each person gets', type: 'number', answer: 20, feedbackCorrect: 'Correct.', feedbackIncorrect: 'Share 82 equally between 4 people.' }, { id: 'remainder', label: 'Stickers left over', type: 'number', answer: 2, feedbackCorrect: 'Correct.', feedbackIncorrect: 'Use the remainder after sharing 82 between 4.' }, { id: 'fair', label: 'Is 3 packs of 8 for 4 packs of 6 fair?', type: 'choice', options: ['Yes, both are 24 stickers', 'No, 3 packs of 8 is more', 'No, 4 packs of 6 is more'], answer: 'Yes, both are 24 stickers', feedbackCorrect: 'Correct — both sides equal 24.', feedbackIncorrect: 'Multiply the number of packs by stickers in each pack.' }, { id: 'working', label: 'My working and explanation', type: 'text', multiline: true, wordTarget: [20, 45] }]
    },
    {
      id: 'mini-golf-designer', title: 'Mini-Golf Designer', icon: '⛳', type: 'Maths extra', minutes: 20,
      brief: 'Design two course shapes that have the same area but different fences.',
      prompt: 'Use the grid to draw a 12-square rectangle for Course A and a different 12-square rectangle for Course B. Record each rectangle’s length, width, area and perimeter. Explain why the areas match but the perimeters can differ.',
      support: 'Possible factor pairs for 12 are 1 × 12, 2 × 6, and 3 × 4. Perimeter means the distance all the way around.', stretch: 'Find two shapes with the same perimeter but different areas.',
      criteria: ['Both designs use 12 squares.', 'I calculated both perimeters.', 'I explained the area/perimeter difference.'],
      fields: [{ id: 'courseA', label: 'Course A: length × width', type: 'text', wordTarget: [3, 8], placeholder: 'For example: 3 × 4' }, { id: 'courseB', label: 'Course B: length × width', type: 'text', wordTarget: [3, 8], placeholder: 'For example: 2 × 6' }, { id: 'explanation', label: 'Area and perimeter working', type: 'text', multiline: true, wordTarget: [20, 45], placeholder: 'Course A area… perimeter…' }, { id: 'courses', label: 'My course sketch', type: 'grid', rows: 6, cols: 6, palette: [{ id: 'a', label: 'Course A', color: '#5c7cfa' }, { id: 'b', label: 'Course B', color: '#ff8787' }, { id: 'blank', label: 'Erase', color: '#f8f9fa' }], rules: { note: 'Draw two separate rectangles, each covering 12 cells.' } }]
    },
    {
      id: 'mystery-number', title: 'Mystery Number', icon: '🔍', type: 'Maths extra', minutes: 15,
      brief: 'Use clues to trap a number.',
      prompt: 'Find the mystery number. It is greater than 40 and less than 60. Its tens digit is 5. It is even. It is a multiple of 3. Then write a new set of clues for one number between 10 and 99.',
      support: 'List the even numbers in the fifties. Cross out any that are not multiples of 3.', stretch: 'Make your clue set use a factor as well as a multiple.',
      criteria: ['I used every clue to find the number.', 'My new clues point to exactly one answer.', 'I tested my own clue set.'],
      fields: [{ id: 'answer', label: 'Mystery number', type: 'number', answer: 54, feedbackCorrect: 'Correct — 54 fits every clue.', feedbackIncorrect: 'Check the even numbers from 50 to 59, then test multiples of 3.' }, { id: 'working', label: 'How I used the clues', type: 'text', multiline: true, wordTarget: [20, 40] }, { id: 'newClues', label: 'My new mystery-number clues', type: 'text', multiline: true, wordTarget: [25, 50], placeholder: 'My number is…' }, { id: 'newAnswer', label: 'The answer to my new clues', type: 'number' }]
    },
    {
      id: 'would-you-rather', title: 'Would You Rather? Prove It!', icon: '🤔', type: 'Word problem extra', minutes: 15,
      brief: 'Use maths to choose between two imaginary deals.',
      prompt: 'You need 18 glow sticks for a night walk. Deal A: packs of 3 for $4. Deal B: packs of 5 for $6. Which deal would you choose if you need at least 18 glow sticks? Work out what you would buy, how many glow sticks you would get, and the cost.',
      support: 'Work out how many packs are needed for each deal. You may get more than 18 glow sticks, but not fewer.', stretch: 'Invent Deal C that is cheaper than both for 18 glow sticks, then explain how it works.',
      criteria: ['I bought enough glow sticks in both comparisons.', 'I showed pack calculations and costs.', 'My recommendation matches my maths.'],
      fields: [{ id: 'dealA', label: 'Deal A: packs, glow sticks and cost', type: 'text', wordTarget: [5, 12], placeholder: '6 packs, 18 glow sticks, $24' }, { id: 'dealB', label: 'Deal B: packs, glow sticks and cost', type: 'text', wordTarget: [5, 12], placeholder: '4 packs, 20 glow sticks, $24' }, { id: 'recommendation', label: 'Which would you choose?', type: 'choice', options: ['Deal A', 'Deal B', 'Either — they cost the same'], answer: 'Either — they cost the same', feedbackCorrect: 'Correct — both choices cost $24, though they give different totals.', feedbackIncorrect: 'Calculate the number of packs needed and multiply by each pack price.' }, { id: 'reason', label: 'Explain your recommendation', type: 'text', multiline: true, wordTarget: [20, 40], placeholder: 'I would choose… because…' }]
    }
  ]
};
