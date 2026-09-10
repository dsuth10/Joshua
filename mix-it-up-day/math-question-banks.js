/* Extra question banks for the Mix It Up Day maths missions. */
(function () {
  const n = (id, prompt, answer, feedbackCorrect, feedbackIncorrect) => ({ id, prompt, type: 'number', answer, feedbackCorrect, feedbackIncorrect });
  const c = (id, prompt, choices, answer, feedbackCorrect, feedbackIncorrect) => ({ id, prompt, type: 'choice', choices, answer, feedbackCorrect, feedbackIncorrect });
  const l = (id, prompt, answer, min, max, ticks) => ({ id, prompt, type: 'numberLine', answer, min, max, ticks, feedbackCorrect: 'Great placing on the number line!', feedbackIncorrect: 'Use the labels and equal jumps to find the point.' });
  const f = (id, prompt, numerator, denominator) => ({ id, prompt, type: 'fractionShade', answer: `${numerator}/${denominator}`, numerator, denominator, feedbackCorrect: 'Correct fraction shaded!', feedbackIncorrect: 'Count the equal parts, then shade the required number.' });

  window.MixMathBanks = {
    'snack-shop': [
      n('ss1', 'A fruit cup costs $2 and popcorn costs $3. What is the total?', 5, 'Yes, $2 + $3 = $5.', 'Add the two prices.'),
      n('ss2', 'Four cheese toasties cost $4 each. What is the total?', 16, 'Correct: 4 × $4 = $16.', 'Use 4 groups of $4.'),
      n('ss3', 'You pay $20 for snacks costing $14. How much change?', 6, 'Correct: $20 − $14 = $6.', 'Subtract the cost from $20.'),
      c('ss4', 'Which deal costs less for two smoothies?', ['Two at $5 each', 'Two for $9', 'They are equal'], 'Two for $9', 'Correct: $9 is $1 cheaper.', 'Work out two single smoothies: 2 × $5.'),
      n('ss5', 'Three fruit cups and two popcorns cost how much?', 12, 'Correct: $6 + $6 = $12.', 'Find 3 × $2 and 2 × $3 first.'),
      n('ss6', 'A $15 voucher pays for $11 of snacks. How much is left?', 4, 'Correct: $15 − $11 = $4.', 'Subtract the snack cost from the voucher.'),
      c('ss7', 'A toastie is $4. Which is the price of 5 toasties?', ['$9', '$16', '$20'], '$20', 'Correct: 5 × $4 = $20.', 'Multiply 5 by 4.'),
      n('ss8', 'A smoothie is $5. What is the cost of 6 smoothies?', 30, 'Correct: 6 × $5 = $30.', 'Count six lots of $5.'),
      n('ss9', 'Your basket costs $18.50. You pay with $20. What change?', 1.5, 'Correct: $20.00 − $18.50 = $1.50.', 'Line up the decimal points when subtracting.'),
      c('ss10', 'Which order is closest to $20 without going over?', ['$19', '$20', '$21'], '$20', 'Exactly $20 is closest without going over.', 'Look for the greatest amount that is not more than $20.')
    ],
    'number-trick-lab': [
      n('ntl1', 'What number makes □ × 7 = 56?', 8, 'Correct: 8 × 7 = 56.', 'Think: 56 shared into 7 equal groups.'),
      n('ntl2', 'Continue: 5, 9, 13, 17, __.', 21, 'Correct: add 4.', 'Find the equal jump between the numbers.'),
      n('ntl3', 'What is 9 × 6?', 54, 'Correct: 9 groups of 6 make 54.', 'Use a multiplication fact or repeated addition.'),
      n('ntl4', 'What number is halfway between 30 and 50?', 40, 'Correct: 40 is in the middle.', 'Count the distance from 30 to 50, then halve it.'),
      c('ntl5', 'Which number is a factor of 36?', ['5', '6', '7'], '6', 'Correct: 6 × 6 = 36.', 'A factor divides 36 with no remainder.'),
      c('ntl6', 'Which number is a multiple of 8?', ['24', '26', '30'], '24', 'Correct: 8 × 3 = 24.', 'Count in eights.'),
      n('ntl7', 'Solve: 84 ÷ 7.', 12, 'Correct: 12 × 7 = 84.', 'Ask what number times 7 makes 84.'),
      n('ntl8', 'What is 300 + 40 + 6?', 346, 'Correct: 346.', 'Use hundreds, tens and ones.'),
      l('ntl9', 'Place 73 on the line from 0 to 100.', 73, 0, 100, 10),
      n('ntl10', 'A pattern starts at 100 and subtracts 12 each time. What comes after 76?', 64, 'Correct: 76 − 12 = 64.', 'Take away 10, then take away 2.')
    ],
    'great-day-out': [
      n('gdo1', 'The bus leaves at 9:20 and arrives at 9:55. How many minutes?', 35, 'Correct: the trip is 35 minutes.', 'Count from 9:20 to 9:55.'),
      n('gdo2', 'Tickets cost $8 each for 3 children. Total cost?', 24, 'Correct: 3 × $8 = $24.', 'Multiply the ticket price by 3.'),
      n('gdo3', 'Lunch costs $27. You have $35. How much remains?', 8, 'Correct: $35 − $27 = $8.', 'Subtract the lunch cost.'),
      c('gdo4', 'A movie starts at 1:30 and ends at 3:00. How long?', ['1 hour', '1 hour 30 minutes', '2 hours'], '1 hour 30 minutes', 'Correct: 90 minutes is 1 hour 30 minutes.', 'Count from 1:30 to 2:30, then to 3:00.'),
      n('gdo5', 'The train arrives at 10:15. A show begins at 10:45. Waiting time?', 30, 'Correct: 30 minutes.', 'Count forward from 10:15.'),
      n('gdo6', 'Four ice blocks cost $3 each. What is the total?', 12, 'Correct: 4 × $3 = $12.', 'Use four groups of $3.'),
      c('gdo7', 'Which is cheaper for 2 people?', ['$7 each', '$13 for two', 'They cost the same'], '$13 for two', 'Correct: $13 is less than $14.', 'Work out 2 × $7.'),
      n('gdo8', 'You leave home at 8:40 and return at 2:10. How many minutes away?', 330, 'Correct: 5 hours 30 minutes = 330 minutes.', 'Find 5 hours 30 minutes, then convert hours to minutes.'),
      l('gdo9', 'Place 45 minutes on a 0–120 minute trip line.', 45, 0, 120, 15),
      n('gdo10', 'A day-out budget is $50. Tickets cost $24 and lunch $17. Money left?', 9, 'Correct: $50 − $41 = $9.', 'Add the costs, then subtract from $50.')
    ],
    'pixel-playground': [
      f('pp1', 'Shade one half of the bar.', 1, 2),
      f('pp2', 'Shade three quarters of the bar.', 3, 4),
      f('pp3', 'Shade two sixths of the bar.', 2, 6),
      n('pp4', 'A rectangle is 6 squares long and 4 squares wide. Area?', 24, 'Correct: 6 × 4 = 24 squares.', 'Multiply length by width.'),
      n('pp5', 'A square has side length 5. What is its perimeter?', 20, 'Correct: 4 × 5 = 20.', 'Add all four equal sides.'),
      c('pp6', 'Which fraction is equal to one half?', ['2/4', '2/3', '3/4'], '2/4', 'Correct: 2 of 4 equal parts is half.', 'Imagine splitting each half into two equal pieces.'),
      n('pp7', 'A design has 18 red pixels and 12 blue pixels. How many pixels?', 30, 'Correct: 18 + 12 = 30.', 'Add both colour totals.'),
      n('pp8', 'A 10 by 10 grid has 100 squares. If 25 are yellow, how many are not yellow?', 75, 'Correct: 100 − 25 = 75.', 'Take the yellow squares away from 100.'),
      l('pp9', 'Place 0.6 on the line from 0 to 1.', 0.6, 0, 1, 0.1),
      c('pp10', 'A shape has matching left and right halves. What is it?', ['Symmetrical', 'Random', 'Unequal'], 'Symmetrical', 'Correct: its halves mirror each other.', 'Think about a mirror line down the middle.')
    ],
    'sticker-swap': [
      n('sts1', 'Mia has 24 stickers. She shares them equally with 6 friends. Each gets?', 4, 'Correct: 24 ÷ 6 = 4.', 'Share 24 into 6 equal groups.'),
      n('sts2', 'Five packs hold 8 stickers each. How many stickers?', 40, 'Correct: 5 × 8 = 40.', 'Use five groups of 8.'),
      n('sts3', 'Sam trades 7 stickers and gets 12. How many more now?', 5, 'Correct: 12 − 7 = 5 more.', 'Compare what Sam gets with what Sam gives.'),
      c('sts4', 'Which trade is fair?', ['4 for 4', '3 for 7', '8 for 2'], '4 for 4', 'Correct: both people trade the same amount.', 'Compare the number given and received.'),
      n('sts5', 'There are 37 stickers shared by 5 children. How many left over?', 2, 'Correct: 5 × 7 = 35, so 2 remain.', 'Find the biggest multiple of 5 below 37.'),
      n('sts6', 'A rare sticker is worth 3 regular stickers. Two rare stickers are worth?', 6, 'Correct: 2 × 3 = 6.', 'Use two groups of 3.'),
      n('sts7', 'A collector needs 50 stickers and has 38. How many more?', 12, 'Correct: 50 − 38 = 12.', 'Count up from 38 to 50.'),
      c('sts8', 'Which array shows 24 stickers?', ['3 rows of 8', '3 rows of 7', '4 rows of 5'], '3 rows of 8', 'Correct: 3 × 8 = 24.', 'Multiply rows by stickers in each row.'),
      l('sts9', 'Place 36 on the line from 0 to 60.', 36, 0, 60, 6),
      n('sts10', 'A pack of 10 costs $4. What do 3 packs cost?', 12, 'Correct: 3 × $4 = $12.', 'Multiply the pack price by 3.')
    ],
    'mini-golf-designer': [
      n('mg1', 'A rectangular green is 8 m by 3 m. What is its area?', 24, 'Correct: 8 × 3 = 24 m².', 'Multiply length by width.'),
      n('mg2', 'That 8 m by 3 m green has what perimeter?', 22, 'Correct: 8 + 3 + 8 + 3 = 22 m.', 'Add every outside side.'),
      n('mg3', 'A square obstacle has sides of 4 m. Its perimeter?', 16, 'Correct: 4 × 4 = 16 m.', 'A square has four equal sides.'),
      c('mg4', 'Which shape has area 12 square metres?', ['3 by 4', '2 by 5', '1 by 10'], '3 by 4', 'Correct: 3 × 4 = 12.', 'Multiply each pair of side lengths.'),
      n('mg5', 'A hole is 27 m long. A player hits 9 m each shot. How many shots?', 3, 'Correct: 27 ÷ 9 = 3.', 'Share 27 metres into jumps of 9.'),
      n('mg6', 'Three players score 4, 6 and 5 shots. What is the total?', 15, 'Correct: 4 + 6 + 5 = 15.', 'Add the three scores.'),
      c('mg7', 'Lower scores are better. Who wins: Ali 18, Bo 16, Cai 17?', ['Ali', 'Bo', 'Cai'], 'Bo', 'Correct: 16 is the lowest score.', 'Compare the three scores.'),
      n('mg8', 'A 5 m by 5 m square has area?', 25, 'Correct: 5 × 5 = 25 m².', 'Multiply the side lengths.'),
      l('mg9', 'Place 14 on the score line from 0 to 30.', 14, 0, 30, 2),
      n('mg10', 'A course has 9 holes. You score 2 on each. Total score?', 18, 'Correct: 9 × 2 = 18.', 'Use nine groups of 2.')
    ],
    'mystery-number': [
      n('mn1', 'I am 6 hundreds, 4 tens and 2 ones. What number?', 642, 'Correct: 642.', 'Build the number from its place values.'),
      n('mn2', 'What number is 100 more than 378?', 478, 'Correct: 378 + 100 = 478.', 'Increase the hundreds digit by 1.'),
      n('mn3', 'What number is 10 less than 650?', 640, 'Correct: 650 − 10 = 640.', 'Decrease the tens digit by 1.'),
      c('mn4', 'Which number is divisible by 5?', ['42', '45', '48'], '45', 'Correct: numbers ending in 0 or 5 divide by 5.', 'Look at the ones digit.'),
      c('mn5', 'Which number is prime?', ['19', '21', '27'], '19', 'Correct: 19 has only two factors.', 'A prime has just 1 and itself as factors.'),
      n('mn6', 'I am an even number between 70 and 80. I am 4 more than 72. What am I?', 76, 'Correct: 72 + 4 = 76.', 'Add 4 to 72.'),
      n('mn7', 'What is the greatest 3-digit number you can make with 2, 8 and 5?', 852, 'Correct: put the greatest digit in hundreds place.', 'Put 8 first, then 5, then 2.'),
      n('mn8', 'A number has 9 tens and 7 ones. What is it?', 97, 'Correct: 90 + 7 = 97.', 'Nine tens is 90.'),
      l('mn9', 'Place 425 on the line from 400 to 500.', 425, 400, 500, 10),
      n('mn10', 'I am a multiple of 9. I am 9 more than 63. What number?', 72, 'Correct: 63 + 9 = 72.', 'Add one more group of 9.')
    ],
    'would-you-rather': [
      n('wyr1', 'Option A gives 3 comic books for $12. What is each book worth?', 4, 'Correct: $12 ÷ 3 = $4.', 'Share $12 equally across 3 books.'),
      n('wyr2', 'Option B gives 5 comic books for $20. What is each book worth?', 4, 'Correct: $20 ÷ 5 = $4.', 'Share $20 equally across 5 books.'),
      c('wyr3', 'Which comic option is better value?', ['3 for $12', '5 for $20', 'They are equal value'], 'They are equal value', 'Correct: both cost $4 each.', 'Find the cost of one book in each option.'),
      n('wyr4', 'A ride gives 4 turns for $10. What is one turn worth?', 2.5, 'Correct: $10 ÷ 4 = $2.50.', 'Share $10 across 4 equal turns.'),
      n('wyr5', 'A game gives 6 tokens for $9. How much are 12 tokens at the same rate?', 18, 'Correct: double 6 tokens and double $9.', '12 is twice 6.'),
      c('wyr6', 'Would you rather get 2 bags of 7 lollies or 3 bags of 4?', ['2 bags of 7', '3 bags of 4', 'Same amount'], '2 bags of 7', 'Correct: 14 is greater than 12.', 'Find 2 × 7 and 3 × 4.'),
      n('wyr7', 'A $30 prize is shared equally by 5 winners. Each gets?', 6, 'Correct: $30 ÷ 5 = $6.', 'Share 30 into 5 equal groups.'),
      n('wyr8', 'A 750 m walk or three 200 m laps: how many more metres is the walk?', 150, 'Correct: 750 − 600 = 150 m.', 'Find three laps first, then compare.'),
      l('wyr9', 'Place 1.25 on the line from 0 to 2.', 1.25, 0, 2, 0.25),
      f('wyr10', 'Shade three fifths of the bar.', 3, 5)
    ]
  };

  /* Twenty extra, context-specific questions per mission. Together with the authored
     opening ten, each bank supplies a 30-question deck for a 24-question mission. */
  const addTwenty = (key, build) => { for (let index = 0; index < 20; index += 1) window.MixMathBanks[key].push(build(index)); };
  addTwenty('snack-shop', i => { const price = 2 + (i % 6), count = 2 + (i % 5), total = price * count, voucher = total + 3 + (i % 7); return i % 2 ? n(`ssx${i}`, `${count} smoothies cost $${price} each. What is the total?`, total, `Correct: ${count} × $${price} = $${total}.`, `Use ${count} groups of $${price}.`) : n(`ssx${i}`, `Your snack order costs $${total}. You pay with $${voucher}. What change?`, voucher - total, `Correct: $${voucher} − $${total} = $${voucher - total}.`, 'Subtract the order cost from the amount paid.'); });
  addTwenty('number-trick-lab', i => { const a = 3 + (i % 7), b = 4 + ((i * 3) % 6), product = a * b; if (i % 4 === 0) return n(`ntlx${i}`, `What is ${a} × ${b}?`, product, `Correct: ${a} × ${b} = ${product}.`, 'Use equal groups or a known fact.'); if (i % 4 === 1) return n(`ntlx${i}`, `What number makes □ × ${a} = ${product}?`, b, `Correct: ${b} × ${a} = ${product}.`, 'Share the product into equal groups.'); if (i % 4 === 2) return n(`ntlx${i}`, `Continue the pattern: ${10 + i}, ${13 + i}, ${16 + i}, __.`, 19 + i, 'Correct: the rule is add 3.', 'Check the equal jump between each pair.'); return n(`ntlx${i}`, `What is ${product} ÷ ${a}?`, b, `Correct: ${product} ÷ ${a} = ${b}.`, `Ask what number times ${a} makes ${product}.`); });
  addTwenty('great-day-out', i => { const start = 10 + (i % 5), duration = 20 + (i % 5) * 10, ticket = 5 + (i % 4), people = 2 + (i % 4); if (i % 2) return n(`gdox${i}`, `An activity starts at ${start}:00 and lasts ${duration} minutes. How many minutes after ${start}:00 does it finish?`, duration, `Correct: it lasts ${duration} minutes.`, 'Use the activity duration.'); return n(`gdox${i}`, `${people} tickets cost $${ticket} each. What is the total?`, people * ticket, `Correct: ${people} × $${ticket} = $${people * ticket}.`, 'Multiply the number of tickets by the price.'); });
  addTwenty('pixel-playground', i => { const length = 3 + (i % 6), width = 2 + ((i * 2) % 5); if (i % 4 === 0) { const den = [2,4,5,6,8][i % 5], num = Math.max(1, den - 2); return f(`ppx${i}`, `Shade ${num}/${den} of the bar.`, num, den); } if (i % 2) return n(`ppx${i}`, `A pixel rectangle is ${length} squares by ${width} squares. What is its area?`, length * width, `Correct: ${length} × ${width} = ${length * width}.`, 'Multiply length by width.'); return n(`ppx${i}`, `A pixel rectangle is ${length} squares by ${width} squares. What is its perimeter?`, 2 * (length + width), `Correct: 2 × (${length} + ${width}) = ${2 * (length + width)}.`, 'Add all four outside sides.'); });
  addTwenty('sticker-swap', i => { const groups = 3 + (i % 4), each = 4 + ((i * 2) % 7), total = groups * each; if (i % 3 === 0) return n(`stsx${i}`, `${groups} packs have ${each} stickers each. How many stickers?`, total, `Correct: ${groups} × ${each} = ${total}.`, 'Multiply packs by stickers in each pack.'); if (i % 3 === 1) return n(`stsx${i}`, `${total} stickers are shared equally between ${groups} children. How many each?`, each, `Correct: ${total} ÷ ${groups} = ${each}.`, 'Share into equal groups.'); return n(`stsx${i}`, `A collector has ${total - each} stickers and needs ${total}. How many more?`, each, `Correct: ${total} − ${total - each} = ${each}.`, 'Count up to the target.'); });
  addTwenty('mini-golf-designer', i => { const length = 3 + (i % 7), width = 2 + ((i * 3) % 5); return i % 2 ? n(`mgx${i}`, `A mini-golf green is ${length} m by ${width} m. What is its area?`, length * width, `Correct: ${length} × ${width} = ${length * width} m².`, 'Multiply length by width.') : n(`mgx${i}`, `A mini-golf green is ${length} m by ${width} m. What is its perimeter?`, 2 * (length + width), `Correct: 2 × (${length} + ${width}) = ${2 * (length + width)} m.`, 'Add every outside side.'); });
  addTwenty('mystery-number', i => { const hundreds = 2 + (i % 7), tens = (i * 3) % 10, ones = (i * 7) % 10, value = hundreds * 100 + tens * 10 + ones; if (i % 3 === 0) return n(`mnx${i}`, `I have ${hundreds} hundreds, ${tens} tens and ${ones} ones. What number am I?`, value, `Correct: ${value}.`, 'Build the number from hundreds, tens and ones.'); if (i % 3 === 1) return n(`mnx${i}`, `What is 100 more than ${value}?`, value + 100, `Correct: ${value} + 100 = ${value + 100}.`, 'Increase the hundreds digit by one.'); return n(`mnx${i}`, `What is 10 less than ${value}?`, value - 10, `Correct: ${value} − 10 = ${value - 10}.`, 'Decrease the tens digit by one.'); });
  addTwenty('would-you-rather', i => { const packs = 2 + (i % 5), items = 3 + ((i * 2) % 6), price = 2 + (i % 7), total = packs * price; if (i % 3 === 0) return n(`wyrx${i}`, `${packs} packs cost $${price} each. What is the total cost?`, total, `Correct: ${packs} × $${price} = $${total}.`, 'Multiply packs by price.'); if (i % 3 === 1) return n(`wyrx${i}`, `$${total} pays for ${packs} equal packs. What is the price per pack?`, price, `Correct: $${total} ÷ ${packs} = $${price}.`, 'Share the total cost equally.'); return n(`wyrx${i}`, `${packs} packs hold ${items} items each. How many items altogether?`, packs * items, `Correct: ${packs} × ${items} = ${packs * items}.`, 'Multiply the number of packs by items in each pack.'); });
}());
