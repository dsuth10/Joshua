/**
 * ==========================================================================
 * FRACTIONS & DECIMALS MASTERCLASS — CORE APPLICATION ENGINE
 * Australian Curriculum v9 | Year 5 Mathematics
 * 5 Rich Questions + 5 Parallel Variations per Clinic (20 Items / Pathway)
 * ==========================================================================
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // 1. STUDENT ROSTER DIRECTORY & TARGETED PATHWAY MAP
  // ---------------------------------------------------------------------------
  const ROSTER_DATABASE = {
    // Group 3 Pathway
    jtayl1104: { id: 'jtayl1104', pathway: 't3', name: 'Jordan Taylor' },
    dmcdo222:  { id: 'dmcdo222',  pathway: 't3', name: 'Darcy McDonald' },

    // Group 2 Pathway
    kfiel89:   { id: 'kfiel89',   pathway: 't2', name: 'Koby Fielding' },
    shart259:  { id: 'shart259',  pathway: 't2', name: 'Samantha Hart' },
    hherz0:    { id: 'hherz0',    pathway: 't2', name: 'Hugo Herzog' },
    lmcdo381:  { id: 'lmcdo381',  pathway: 't2', name: 'Liam McDonald' },
    cpono2:    { id: 'cpono2',    pathway: 't2', name: 'Chloe Ponomarev' },
    mreed71:   { id: 'mreed71',   pathway: 't2', name: 'Marcus Reed' },
    jfull212:  { id: 'jfull212',  pathway: 't2', name: 'Jessica Fuller' },

    // Group 1 Pathway
    wnich33:   { id: 'wnich33',   pathway: 't1', name: 'William Nicholls' },
    fpick8:    { id: 'fpick8',    pathway: 't1', name: 'Freya Pickering' },
    fwend2:    { id: 'fwend2',    pathway: 't1', name: 'Felix Wendt' },
    smorg220:  { id: 'smorg220',  pathway: 't1', name: 'Sophie Morgan' },
    jbart350:  { id: 'jbart350',  pathway: 't1', name: 'Joshua Barton' },
    jbinn27:   { id: 'jbinn27',   pathway: 't1', name: 'Jack Binns' },
    lheck4:    { id: 'lheck4',    pathway: 't1', name: 'Lucas Heck' },
    epryo13:   { id: 'epryo13',   pathway: 't1', name: 'Eva Pryor' }
  };

  // ---------------------------------------------------------------------------
  // 2. MATHEMATICAL RENDERING UTILITIES (CHILD-FRIENDLY VERTICALLY STACKED)
  // ---------------------------------------------------------------------------
  function renderFrac(num, den) {
    return `<span class="frac"><span class="num">${num}</span><span class="den">${den}</span></span>`;
  }

  function renderMixed(whole, num, den) {
    return `<span class="mixed-frac"><span class="whole">${whole}</span><span class="frac"><span class="num">${num}</span><span class="den">${den}</span></span></span>`;
  }

  function renderPV(whole, tenth, hundredth) {
    return `<span class="pv-badge"><span class="pv-whole">${whole}</span><span class="pv-dot">.</span><span class="pv-tenth">${tenth}</span><span class="pv-hundredth">${hundredth}</span></span>`;
  }

  // ---------------------------------------------------------------------------
  // 3. CURRICULUM CLINICS & QUESTION CONTENT REPOSITORY
  // ---------------------------------------------------------------------------
  const PATHWAY_CLINICS = {
    // -------------------------------------------------------------------------
    // PATHWAY T3 CLINICS (20 Questions Total)
    // -------------------------------------------------------------------------
    t3: [
      {
        id: 't3_c1',
        title: 'Clinic 1: Decimal Place Value & Zero Placeholders',
        subtitle: 'Mastering the difference between tenths (0.1) and hundredths (0.01)',
        icon: '🔢',
        questions: [
          // Q1
          {
            id: 't3_c1_q1',
            concept: 'Hundredths Zero Placeholder',
            prompt: `What is ${renderMixed(6, 8, 100)} written in decimal form?`,
            visualAid: { type: 'place-value-grid', whole: 6, tenths: 0, hundredths: 8, compareTenths: 8 },
            options: [
              { id: 'A', text: '6.8', isCorrect: false, trap: '6.8 means 6 wholes and 8 TENTHS (equal to 80 hundredths!). Because there are 0 tenths, we need a 0 placeholder in the tenths column.' },
              { id: 'B', text: '6.08', isCorrect: true },
              { id: 'C', text: '0.68', isCorrect: false, trap: '0.68 forgot the 6 whole units entirely! The 6 must sit in the Ones place before the decimal point.' },
              { id: 'D', text: '68.0', isCorrect: false, trap: '68.0 turns hundredths into whole tens. Hundredths are tiny fractions smaller than 1.' }
            ],
            explanation: {
              trapText: 'A common trap is choosing <strong>6.8</strong>. The first spot after the decimal point is for TENTHS. 6.8 means 8 tenths (80 hundredths)!',
              solutionText: `To write 8 hundredths, put a <strong>0</strong> in the tenths spot as a placeholder: ${renderPV(6, 0, 8)} = <strong>6.08</strong>.`,
              visualType: 'place-value-grid',
              visualConfig: { whole: 6, tenths: 0, hundredths: 8, compareTenths: 8 }
            },
            parallelVariation: {
              id: 't3_c1_q1_var',
              concept: 'Hundredths Zero Placeholder (Practice Variation)',
              prompt: `What is ${renderMixed(3, 4, 100)} written in decimal form?`,
              visualAid: { type: 'place-value-grid', whole: 3, tenths: 0, hundredths: 4, compareTenths: 4 },
              options: [
                { id: 'A', text: '3.4', isCorrect: false, trap: '3.4 has 4 tenths (40 hundredths). You need 0 tenths and 4 hundredths.' },
                { id: 'B', text: '0.34', isCorrect: false, trap: '0.34 is missing the 3 whole units.' },
                { id: 'C', text: '3.04', isCorrect: true },
                { id: 'D', text: '34.0', isCorrect: false, trap: '34.0 is far too large; 4 hundredths is smaller than 1 whole.' }
              ],
              explanation: {
                trapText: 'Remember: 3.4 means 4 tenths (3.40). 4 hundredths needs a 0 in the tenths place.',
                solutionText: `${renderMixed(3, 4, 100)} has 3 ones, 0 tenths, and 4 hundredths = <strong>3.04</strong>.`,
                visualType: 'place-value-grid',
                visualConfig: { whole: 3, tenths: 0, hundredths: 4, compareTenths: 4 }
              }
            }
          },

          // Q2
          {
            id: 't3_c1_q2',
            concept: 'Two-Digit Whole Number with Hundredths',
            prompt: `What is ${renderMixed(10, 5, 100)} written in decimal form?`,
            visualAid: { type: 'place-value-grid', whole: 10, tenths: 0, hundredths: 5, compareTenths: 5 },
            options: [
              { id: 'A', text: '10.5', isCorrect: false, trap: '10.5 represents 5 tenths (50 hundredths). 5 hundredths needs a zero placeholder.' },
              { id: 'B', text: '10.05', isCorrect: true },
              { id: 'C', text: '1.05', isCorrect: false, trap: 'The whole number is 10, not 1.' },
              { id: 'D', text: '105.0', isCorrect: false, trap: 'Hundredths are parts of a whole, not hundreds.' }
            ],
            explanation: {
              trapText: '10.5 has 5 tenths. To show 5 hundredths, place a 0 in the tenths column.',
              solutionText: `10 wholes + 0 tenths + 5 hundredths = <strong>10.05</strong>.`,
              visualType: 'place-value-grid',
              visualConfig: { whole: 10, tenths: 0, hundredths: 5, compareTenths: 5 }
            },
            parallelVariation: {
              id: 't3_c1_q2_var',
              concept: 'Two-Digit Whole Number with Hundredths (Practice Variation)',
              prompt: `What is ${renderMixed(7, 9, 100)} written in decimal form?`,
              visualAid: { type: 'place-value-grid', whole: 7, tenths: 0, hundredths: 9, compareTenths: 9 },
              options: [
                { id: 'A', text: '7.9', isCorrect: false, trap: '7.9 is 9 tenths (90 hundredths).' },
                { id: 'B', text: '7.09', isCorrect: true },
                { id: 'C', text: '0.79', isCorrect: false, trap: 'Remember the 7 whole units in the ones column.' },
                { id: 'D', text: '79.0', isCorrect: false, trap: '79.0 is a whole number.' }
              ],
              explanation: {
                trapText: '9 hundredths requires a 0 in the tenths position.',
                solutionText: `${renderMixed(7, 9, 100)} = <strong>7.09</strong>.`,
                visualType: 'place-value-grid',
                visualConfig: { whole: 7, tenths: 0, hundredths: 9, compareTenths: 9 }
              }
            }
          },

          // Q3
          {
            id: 't3_c1_q3',
            concept: 'Proper Fraction Hundredths to Decimals',
            prompt: `What is the fraction ${renderFrac(43, 100)} written in decimal form?`,
            visualAid: { type: 'place-value-grid', whole: 0, tenths: 4, hundredths: 3, compareTenths: 0 },
            options: [
              { id: 'A', text: '4.3', isCorrect: false, trap: '4.3 is 4 wholes and 3 tenths.' },
              { id: 'B', text: '0.043', isCorrect: false, trap: '0.043 is thousandths (three decimal places).' },
              { id: 'C', text: '0.43', isCorrect: true },
              { id: 'D', text: '43.0', isCorrect: false, trap: '43.0 is 43 whole units.' }
            ],
            explanation: {
              trapText: 'Hundredths means two decimal places after the point.',
              solutionText: `43 hundredths has 4 tenths and 3 hundredths = <strong>0.43</strong>.`,
              visualType: 'place-value-grid',
              visualConfig: { whole: 0, tenths: 4, hundredths: 3, compareTenths: 0 }
            },
            parallelVariation: {
              id: 't3_c1_q3_var',
              concept: 'Proper Fraction Hundredths (Practice Variation)',
              prompt: `What is the fraction ${renderFrac(67, 100)} written in decimal form?`,
              visualAid: { type: 'place-value-grid', whole: 0, tenths: 6, hundredths: 7, compareTenths: 0 },
              options: [
                { id: 'A', text: '6.7', isCorrect: false, trap: '6.7 is 6 wholes and 7 tenths.' },
                { id: 'B', text: '0.67', isCorrect: true },
                { id: 'C', text: '0.067', isCorrect: false, trap: '0.067 has three decimal places.' },
                { id: 'D', text: '67.0', isCorrect: false, trap: '67.0 is a whole number.' }
              ],
              explanation: {
                trapText: '67 hundredths = 6 tenths and 7 hundredths = 0.67.',
                solutionText: `${renderFrac(67, 100)} = <strong>0.67</strong>.`,
                visualType: 'place-value-grid',
                visualConfig: { whole: 0, tenths: 6, hundredths: 7, compareTenths: 0 }
              }
            }
          },

          // Q4
          {
            id: 't3_c1_q4',
            concept: 'Decimal to Mixed Number with Placeholder',
            prompt: `Convert the decimal number <strong>8.07</strong> into a mixed number.`,
            visualAid: { type: 'place-value-grid', whole: 8, tenths: 0, hundredths: 7, compareTenths: 7 },
            options: [
              { id: 'A', text: renderMixed(8, 7, 10), isCorrect: false, trap: '8 and 7/10 would be written as 8.7.' },
              { id: 'B', text: renderMixed(8, 7, 100), isCorrect: true },
              { id: 'C', text: renderMixed(8, 70, 100), isCorrect: false, trap: '8 and 70/100 is 8.70 (equal to 8.7).' },
              { id: 'D', text: renderFrac(87, 100), isCorrect: false, trap: 'You missed the 8 whole units.' }
            ],
            explanation: {
              trapText: 'Because the 7 is in the SECOND decimal place (hundredths), the denominator must be 100.',
              solutionText: `8 wholes and 7 hundredths = <strong>${renderMixed(8, 7, 100)}</strong>.`,
              visualType: 'place-value-grid',
              visualConfig: { whole: 8, tenths: 0, hundredths: 7, compareTenths: 7 }
            },
            parallelVariation: {
              id: 't3_c1_q4_var',
              concept: 'Decimal to Mixed Number (Practice Variation)',
              prompt: `Convert the decimal number <strong>4.03</strong> into a mixed number.`,
              visualAid: { type: 'place-value-grid', whole: 4, tenths: 0, hundredths: 3, compareTenths: 3 },
              options: [
                { id: 'A', text: renderMixed(4, 3, 10), isCorrect: false, trap: '4 and 3/10 is 4.3.' },
                { id: 'B', text: renderMixed(4, 3, 100), isCorrect: true },
                { id: 'C', text: renderMixed(4, 30, 100), isCorrect: false, trap: '4 and 30/100 is 4.30.' },
                { id: 'D', text: renderFrac(43, 100), isCorrect: false, trap: 'Missing the 4 wholes.' }
              ],
              explanation: {
                trapText: 'The 3 is in the hundredths spot.',
                solutionText: `4.03 = <strong>${renderMixed(4, 3, 100)}</strong>.`,
                visualType: 'place-value-grid',
                visualConfig: { whole: 4, tenths: 0, hundredths: 3, compareTenths: 3 }
              }
            }
          },

          // Q5
          {
            id: 't3_c1_q5',
            concept: 'Comparing Tenths vs Hundredths Magnitudes',
            prompt: `Which comparison statement is mathematically correct?`,
            visualAid: { type: 'place-value-grid', whole: 0, tenths: 0, hundredths: 8, compareTenths: 8 },
            options: [
              { id: 'A', text: '0.8 is equal to 0.08', isCorrect: false, trap: '0.8 is 80 hundredths, while 0.08 is only 8 hundredths.' },
              { id: 'B', text: '0.8 is larger than 0.08', isCorrect: true },
              { id: 'C', text: '0.08 is larger than 0.8', isCorrect: false, trap: '8 hundredths is 10 times smaller than 8 tenths.' },
              { id: 'D', text: '0.8 and 0.08 both represent 8 tenths', isCorrect: false, trap: '0.08 represents hundredths, not tenths.' }
            ],
            explanation: {
              trapText: '0.8 = 8 tenths = 80 hundredths. 0.08 = 8 hundredths.',
              solutionText: `80 hundredths is much larger than 8 hundredths, so <strong>0.8 is larger than 0.08</strong>.`,
              visualType: 'place-value-grid',
              visualConfig: { whole: 0, tenths: 0, hundredths: 8, compareTenths: 8 }
            },
            parallelVariation: {
              id: 't3_c1_q5_var',
              concept: 'Comparing Tenths vs Hundredths (Practice Variation)',
              prompt: `Which statement about <strong>0.5</strong> and <strong>0.05</strong> is true?`,
              visualAid: { type: 'place-value-grid', whole: 0, tenths: 0, hundredths: 5, compareTenths: 5 },
              options: [
                { id: 'A', text: '0.5 is equal to 0.05', isCorrect: false, trap: '0.5 is 50 hundredths; 0.05 is 5 hundredths.' },
                { id: 'B', text: '0.5 is larger than 0.05', isCorrect: true },
                { id: 'C', text: '0.05 is larger than 0.5', isCorrect: false, trap: 'Hundredths are smaller than tenths.' },
                { id: 'D', text: '0.05 equals 5 tenths', isCorrect: false, trap: '0.05 is 5 hundredths.' }
              ],
              explanation: {
                trapText: '0.5 = 5 tenths = 50 hundredths, which is larger than 5 hundredths (0.05).',
                solutionText: `<strong>0.5 is larger than 0.05</strong>.`,
                visualType: 'place-value-grid',
                visualConfig: { whole: 0, tenths: 0, hundredths: 5, compareTenths: 5 }
              }
            }
          }
        ]
      },

      // -----------------------------------------------------------------------
      // T3 CLINIC 2: RENAMING WHOLE FRACTIONS (5 Questions)
      // -----------------------------------------------------------------------
      {
        id: 't3_c2',
        title: 'Clinic 2: Renaming Whole Fractions (n/n = 1 Whole)',
        subtitle: 'Understanding when fractional parts combine to make a new whole number',
        icon: '🍕',
        questions: [
          // Q1
          {
            id: 't3_c2_q1',
            concept: 'Renaming Whole Tenths in Mixed Sums',
            prompt: `Calculate the sum and express it in simplest form: ${renderMixed(1, 7, 10)} <span class="math-op">+</span> ${renderFrac(3, 10)}`,
            visualAid: { type: 'fraction-bar-rename', whole: 1, part1: 7, part2: 3, den: 10 },
            options: [
              { id: 'A', text: '1 ' + renderFrac(10, 10), isCorrect: false, trap: 'Leaving the answer as 1 10/10 is unsimplified. Whenever the numerator equals the denominator (10/10), it equals 1 WHOLE! Combine 1 + 1 to get 2.' },
              { id: 'B', text: '2', isCorrect: true },
              { id: 'C', text: '1 ' + renderFrac(4, 10), isCorrect: false, trap: '7 tenths + 3 tenths = 10 tenths, not 4 tenths.' },
              { id: 'D', text: renderFrac(10, 10), isCorrect: false, trap: 'You forgot the 1 whole unit that was already there!' }
            ],
            explanation: {
              trapText: `Leaving the answer as <strong>1 and 10/10</strong> is incomplete. 10 tenths fills an entire second bar!`,
              solutionText: `Step 1: Add tenths: ${renderFrac(7, 10)} + ${renderFrac(3, 10)} = ${renderFrac(10, 10)}.<br>Step 2: Rename ${renderFrac(10, 10)} as <strong>1 whole</strong>.<br>Step 3: Combine wholes: 1 + 1 = <strong>2</strong>.`,
              visualType: 'fraction-bar-rename',
              visualConfig: { whole: 1, part1: 7, part2: 3, den: 10 }
            },
            parallelVariation: {
              id: 't3_c2_q1_var',
              concept: 'Renaming Whole Eighths (Practice Variation)',
              prompt: `Calculate the sum in simplest form: ${renderMixed(4, 5, 8)} <span class="math-op">+</span> ${renderFrac(3, 8)}`,
              visualAid: { type: 'fraction-bar-rename', whole: 4, part1: 5, part2: 3, den: 8 },
              options: [
                { id: 'A', text: '4 ' + renderFrac(8, 8), isCorrect: false, trap: '8/8 equals 1 whole. Combine 4 + 1 to simplify fully.' },
                { id: 'B', text: '5', isCorrect: true },
                { id: 'C', text: '4 ' + renderFrac(2, 8), isCorrect: false, trap: '5 eighths + 3 eighths = 8 eighths, not 2 eighths.' },
                { id: 'D', text: '4 ' + renderFrac(8, 16), isCorrect: false, trap: 'Do not add denominators together!' }
              ],
              explanation: {
                trapText: 'Never leave 8/8 in your final mixed number answer. 8/8 = 1 whole.',
                solutionText: `4 wholes + (5/8 + 3/8) = 4 wholes + 8/8 = 4 + 1 = <strong>5</strong>.`,
                visualType: 'fraction-bar-rename',
                visualConfig: { whole: 4, part1: 5, part2: 3, den: 8 }
              }
            }
          },

          // Q2
          {
            id: 't3_c2_q2',
            concept: 'Renaming Whole Fifths in Mixed Sums',
            prompt: `Calculate in simplest form: ${renderMixed(2, 4, 5)} <span class="math-op">+</span> ${renderFrac(1, 5)}`,
            visualAid: { type: 'fraction-bar-rename', whole: 2, part1: 4, part2: 1, den: 5 },
            options: [
              { id: 'A', text: '2 ' + renderFrac(5, 5), isCorrect: false, trap: '5/5 equals 1 whole. Add 1 to the 2 wholes to get 3.' },
              { id: 'B', text: '3', isCorrect: true },
              { id: 'C', text: '2 ' + renderFrac(3, 5), isCorrect: false, trap: '4 fifths + 1 fifth = 5 fifths, not 3 fifths.' },
              { id: 'D', text: '2 ' + renderFrac(5, 10), isCorrect: false, trap: 'Denominators stay fifths.' }
            ],
            explanation: {
              trapText: '4/5 + 1/5 = 5/5 = 1 whole.',
              solutionText: `2 + ${renderFrac(5, 5)} = 2 + 1 = <strong>3</strong>.`,
              visualType: 'fraction-bar-rename',
              visualConfig: { whole: 2, part1: 4, part2: 1, den: 5 }
            },
            parallelVariation: {
              id: 't3_c2_q2_var',
              concept: 'Renaming Whole Quarters (Practice Variation)',
              prompt: `Calculate in simplest form: ${renderMixed(1, 3, 4)} <span class="math-op">+</span> ${renderFrac(1, 4)}`,
              visualAid: { type: 'fraction-bar-rename', whole: 1, part1: 3, part2: 1, den: 4 },
              options: [
                { id: 'A', text: '1 ' + renderFrac(4, 4), isCorrect: false, trap: '4/4 is 1 whole. 1 + 1 = 2.' },
                { id: 'B', text: '2', isCorrect: true },
                { id: 'C', text: '1 ' + renderFrac(2, 4), isCorrect: false, trap: '3/4 + 1/4 = 4/4.' },
                { id: 'D', text: renderFrac(4, 4), isCorrect: false, trap: 'Remember the starting 1 whole.' }
              ],
              explanation: {
                trapText: '3 quarters + 1 quarter completes the whole unit.',
                solutionText: `1 and 4/4 = 1 + 1 = <strong>2</strong>.`,
                visualType: 'fraction-bar-rename',
                visualConfig: { whole: 1, part1: 3, part2: 1, den: 4 }
              }
            }
          },

          // Q3
          {
            id: 't3_c2_q3',
            concept: 'Renaming with Higher Whole Numbers',
            prompt: `Calculate: ${renderMixed(3, 6, 10)} <span class="math-op">+</span> ${renderFrac(4, 10)}`,
            visualAid: { type: 'fraction-bar-rename', whole: 3, part1: 6, part2: 4, den: 10 },
            options: [
              { id: 'A', text: '3 ' + renderFrac(10, 10), isCorrect: false, trap: 'Rename 10/10 as 1 whole and add to 3.' },
              { id: 'B', text: '4', isCorrect: true },
              { id: 'C', text: '3 ' + renderFrac(2, 10), isCorrect: false, trap: '6 + 4 = 10, not 2.' },
              { id: 'D', text: renderFrac(40, 10), isCorrect: false, trap: 'Express as a whole number.' }
            ],
            explanation: {
              trapText: '3 wholes + 10 tenths = 3 + 1 = 4.',
              solutionText: `${renderMixed(3, 6, 10)} + ${renderFrac(4, 10)} = 3 + 1 = <strong>4</strong>.`,
              visualType: 'fraction-bar-rename',
              visualConfig: { whole: 3, part1: 6, part2: 4, den: 10 }
            },
            parallelVariation: {
              id: 't3_c2_q3_var',
              concept: 'Renaming with Higher Whole Numbers (Practice Variation)',
              prompt: `Calculate: ${renderMixed(5, 7, 8)} <span class="math-op">+</span> ${renderFrac(1, 8)}`,
              visualAid: { type: 'fraction-bar-rename', whole: 5, part1: 7, part2: 1, den: 8 },
              options: [
                { id: 'A', text: '5 ' + renderFrac(8, 8), isCorrect: false, trap: '8/8 equals 1 whole. 5 + 1 = 6.' },
                { id: 'B', text: '6', isCorrect: true },
                { id: 'C', text: '5 ' + renderFrac(6, 8), isCorrect: false, trap: '7 + 1 = 8.' },
                { id: 'D', text: '5 ' + renderFrac(8, 16), isCorrect: false, trap: 'Never add denominators.' }
              ],
              explanation: {
                trapText: '7 eighths + 1 eighth = 8 eighths = 1 whole.',
                solutionText: `5 + 8/8 = <strong>6</strong>.`,
                visualType: 'fraction-bar-rename',
                visualConfig: { whole: 5, part1: 7, part2: 1, den: 8 }
              }
            }
          },

          // Q4
          {
            id: 't3_c2_q4',
            concept: 'Identifying 1 Whole Equivalent Fraction',
            prompt: `Which of the following fractions is equal to exactly <strong>1 whole</strong>?`,
            visualAid: { type: 'fraction-bar-rename', whole: 0, part1: 8, part2: 0, den: 8 },
            options: [
              { id: 'A', text: renderFrac(1, 8), isCorrect: false, trap: '1/8 is only one out of eight pieces.' },
              { id: 'B', text: renderFrac(8, 8), isCorrect: true },
              { id: 'C', text: renderFrac(8, 10), isCorrect: false, trap: '8/10 is less than 1 whole (needs 10/10).' },
              { id: 'D', text: renderFrac(7, 8), isCorrect: false, trap: '7/8 is missing one piece to be a whole.' }
            ],
            explanation: {
              trapText: 'A fraction equals 1 whole whenever the numerator equals the denominator.',
              solutionText: `${renderFrac(8, 8)} means you have all 8 slices out of 8 = <strong>1 whole</strong>.`,
              visualType: 'fraction-bar-rename',
              visualConfig: { whole: 0, part1: 8, part2: 0, den: 8 }
            },
            parallelVariation: {
              id: 't3_c2_q4_var',
              concept: 'Identifying 1 Whole (Practice Variation)',
              prompt: `Which fraction equals <strong>1 whole</strong>?`,
              visualAid: { type: 'fraction-bar-rename', whole: 0, part1: 5, part2: 0, den: 5 },
              options: [
                { id: 'A', text: renderFrac(5, 5), isCorrect: true },
                { id: 'B', text: renderFrac(1, 5), isCorrect: false, trap: '1/5 is less than 1.' },
                { id: 'C', text: renderFrac(4, 5), isCorrect: false, trap: '4/5 is less than 1.' },
                { id: 'D', text: renderFrac(5, 10), isCorrect: false, trap: '5/10 is half a whole.' }
              ],
              explanation: {
                trapText: 'Numerator must match denominator.',
                solutionText: `${renderFrac(5, 5)} = <strong>1 whole</strong>.`,
                visualType: 'fraction-bar-rename',
                visualConfig: { whole: 0, part1: 5, part2: 0, den: 5 }
              }
            }
          },

          // Q5
          {
            id: 't3_c2_q5',
            concept: 'Combining Two Fraction Parts to Complete a Whole',
            prompt: `Calculate: 2 <span class="math-op">+</span> ${renderFrac(3, 6)} <span class="math-op">+</span> ${renderFrac(3, 6)}`,
            visualAid: { type: 'fraction-bar-rename', whole: 2, part1: 3, part2: 3, den: 6 },
            options: [
              { id: 'A', text: '2 ' + renderFrac(6, 6), isCorrect: false, trap: '6/6 is 1 whole. 2 + 1 = 3.' },
              { id: 'B', text: '3', isCorrect: true },
              { id: 'C', text: '2 ' + renderFrac(6, 12), isCorrect: false, trap: 'Do not add denominators.' },
              { id: 'D', text: renderFrac(6, 6), isCorrect: false, trap: 'Remember the starting 2 wholes.' }
            ],
            explanation: {
              trapText: '3 sixths + 3 sixths = 6 sixths = 1 whole. 2 + 1 = 3.',
              solutionText: `2 + ${renderFrac(6, 6)} = <strong>3</strong>.`,
              visualType: 'fraction-bar-rename',
              visualConfig: { whole: 2, part1: 3, part2: 3, den: 6 }
            },
            parallelVariation: {
              id: 't3_c2_q5_var',
              concept: 'Completing a Whole (Practice Variation)',
              prompt: `Calculate: 1 <span class="math-op">+</span> ${renderFrac(4, 10)} <span class="math-op">+</span> ${renderFrac(6, 10)}`,
              visualAid: { type: 'fraction-bar-rename', whole: 1, part1: 4, part2: 6, den: 10 },
              options: [
                { id: 'A', text: '1 ' + renderFrac(10, 10), isCorrect: false, trap: '10/10 is 1 whole. 1 + 1 = 2.' },
                { id: 'B', text: '2', isCorrect: true },
                { id: 'C', text: '1 ' + renderFrac(10, 20), isCorrect: false, trap: 'Denominators stay tenths.' },
                { id: 'D', text: renderFrac(10, 10), isCorrect: false, trap: 'Remember the 1 whole.' }
              ],
              explanation: {
                trapText: '4 tenths + 6 tenths = 10 tenths = 1 whole.',
                solutionText: `1 + 10/10 = 1 + 1 = <strong>2</strong>.`,
                visualType: 'fraction-bar-rename',
                visualConfig: { whole: 1, part1: 4, part2: 6, den: 10 }
              }
            }
          }
        ]
      },

      // -----------------------------------------------------------------------
      // T3 CLINIC 3: THE GOLDEN RULE (5 Questions)
      // -----------------------------------------------------------------------
      {
        id: 't3_c3',
        title: 'Clinic 3: The Golden Rule (Related Denominators)',
        subtitle: 'Converting smaller denominators to match before adding or subtracting',
        icon: '⚖️',
        questions: [
          // Q1
          {
            id: 't3_c3_q1',
            concept: 'Adding Quarters and Eighths',
            prompt: `Calculate: ${renderFrac(1, 4)} <span class="math-op">+</span> ${renderFrac(3, 8)}`,
            visualAid: { type: 'golden-rule-wall', origNum: 1, origDen: 4, scale: 2, targetNum: 3, targetDen: 8 },
            options: [
              { id: 'A', text: renderFrac(4, 8), isCorrect: false, trap: 'You added 1 + 3 without converting 1/4 into 2/8 first!' },
              { id: 'B', text: renderFrac(4, 12), isCorrect: false, trap: 'Adding numerators and denominators straight across (1+3)/(4+8) breaks the Golden Rule!' },
              { id: 'C', text: renderFrac(5, 8), isCorrect: true },
              { id: 'D', text: renderFrac(2, 8), isCorrect: false, trap: '2/8 is only the converted first fraction; you still need to add 3/8.' }
            ],
            explanation: {
              trapText: 'You cannot add quarters and eighths directly! Always convert to matching eighths first.',
              solutionText: `Step 1: ${renderFrac(1, 4)} = ${renderFrac('1 × 2', '4 × 2')} = ${renderFrac(2, 8)}.<br>Step 2: ${renderFrac(2, 8)} + ${renderFrac(3, 8)} = <strong>${renderFrac(5, 8)}</strong>.`,
              visualType: 'golden-rule-wall',
              visualConfig: { origNum: 1, origDen: 4, scale: 2, targetNum: 3, targetDen: 8 }
            },
            parallelVariation: {
              id: 't3_c3_q1_var',
              concept: 'Adding Fifths and Tenths (Practice Variation)',
              prompt: `Calculate: ${renderFrac(3, 5)} <span class="math-op">+</span> ${renderFrac(3, 10)}`,
              visualAid: { type: 'golden-rule-wall', origNum: 3, origDen: 5, scale: 2, targetNum: 3, targetDen: 10 },
              options: [
                { id: 'A', text: renderFrac(6, 10), isCorrect: false, trap: '6/10 is only 3/5 converted. Add the 3/10 to get 9/10.' },
                { id: 'B', text: renderFrac(6, 15), isCorrect: false, trap: 'Never add denominators (5 + 10 = 15).' },
                { id: 'C', text: renderFrac(9, 10), isCorrect: true },
                { id: 'D', text: renderFrac(6, 10), isCorrect: false, trap: '3/5 = 6/10; 6/10 + 3/10 = 9/10.' }
              ],
              explanation: {
                trapText: 'Convert 3/5 to tenths by multiplying by 2 = 6/10.',
                solutionText: `6/10 + 3/10 = <strong>${renderFrac(9, 10)}</strong>.`,
                visualType: 'golden-rule-wall',
                visualConfig: { origNum: 3, origDen: 5, scale: 2, targetNum: 3, targetDen: 10 }
              }
            }
          },

          // Q2
          {
            id: 't3_c3_q2',
            concept: 'Adding Halves and Eighths',
            prompt: `Calculate: ${renderFrac(1, 2)} <span class="math-op">+</span> ${renderFrac(3, 8)}`,
            visualAid: { type: 'golden-rule-wall', origNum: 1, origDen: 2, scale: 4, targetNum: 3, targetDen: 8 },
            options: [
              { id: 'A', text: renderFrac(4, 10), isCorrect: false, trap: 'Do not add numerators and denominators straight across.' },
              { id: 'B', text: renderFrac(7, 8), isCorrect: true },
              { id: 'C', text: renderFrac(4, 8), isCorrect: false, trap: '1/2 is 4/8; 4/8 + 3/8 = 7/8.' },
              { id: 'D', text: renderFrac(5, 8), isCorrect: false, trap: '1/2 = 4/8.' }
            ],
            explanation: {
              trapText: 'Multiply 1/2 top and bottom by 4 to convert to eighths (4/8).',
              solutionText: `${renderFrac(1, 2)} = ${renderFrac(4, 8)}.<br>${renderFrac(4, 8)} + ${renderFrac(3, 8)} = <strong>${renderFrac(7, 8)}</strong>.`,
              visualType: 'golden-rule-wall',
              visualConfig: { origNum: 1, origDen: 2, scale: 4, targetNum: 3, targetDen: 8 }
            },
            parallelVariation: {
              id: 't3_c3_q2_var',
              concept: 'Adding Halves and Tenths (Practice Variation)',
              prompt: `Calculate in simplest form: ${renderFrac(1, 2)} <span class="math-op">+</span> ${renderFrac(3, 10)}`,
              visualAid: { type: 'golden-rule-wall', origNum: 1, origDen: 2, scale: 5, targetNum: 3, targetDen: 10 },
              options: [
                { id: 'A', text: renderFrac(4, 12), isCorrect: false, trap: 'Do not add denominators.' },
                { id: 'B', text: renderFrac(4, 5), isCorrect: true },
                { id: 'C', text: renderFrac(8, 10), isCorrect: false, trap: '8/10 can be simplified by dividing by 2 = 4/5.' },
                { id: 'D', text: renderFrac(4, 10), isCorrect: false, trap: '1/2 = 5/10; 5/10 + 3/10 = 8/10.' }
              ],
              explanation: {
                trapText: '1/2 = 5/10. 5/10 + 3/10 = 8/10. Simplify 8/10 = 4/5.',
                solutionText: `1/2 + 3/10 = 8/10 = <strong>${renderFrac(4, 5)}</strong>.`,
                visualType: 'golden-rule-wall',
                visualConfig: { origNum: 1, origDen: 2, scale: 5, targetNum: 3, targetDen: 10 }
              }
            }
          },

          // Q3
          {
            id: 't3_c3_q3',
            concept: 'Subtracting Related Denominators',
            prompt: `Calculate: ${renderFrac(3, 4)} <span class="math-op">−</span> ${renderFrac(1, 8)}`,
            visualAid: { type: 'golden-rule-wall', origNum: 3, origDen: 4, scale: 2, targetNum: 1, targetDen: 8 },
            options: [
              { id: 'A', text: renderFrac(2, 4), isCorrect: false, trap: 'Convert 3/4 to eighths first (6/8).' },
              { id: 'B', text: renderFrac(5, 8), isCorrect: true },
              { id: 'C', text: renderFrac(2, 8), isCorrect: false, trap: '3/4 is 6/8; 6/8 - 1/8 = 5/8.' },
              { id: 'D', text: renderFrac(2, 0), isCorrect: false, trap: 'Never subtract denominators.' }
            ],
            explanation: {
              trapText: '3/4 = (3 × 2)/(4 × 2) = 6/8.',
              solutionText: `${renderFrac(6, 8)} - ${renderFrac(1, 8)} = <strong>${renderFrac(5, 8)}</strong>.`,
              visualType: 'golden-rule-wall',
              visualConfig: { origNum: 3, origDen: 4, scale: 2, targetNum: 1, targetDen: 8 }
            },
            parallelVariation: {
              id: 't3_c3_q3_var',
              concept: 'Subtracting Related Fifths and Tenths (Practice Variation)',
              prompt: `Calculate in simplest form: ${renderFrac(4, 5)} <span class="math-op">−</span> ${renderFrac(3, 10)}`,
              visualAid: { type: 'golden-rule-wall', origNum: 4, origDen: 5, scale: 2, targetNum: 3, targetDen: 10 },
              options: [
                { id: 'A', text: renderFrac(1, 2), isCorrect: true },
                { id: 'B', text: renderFrac(5, 10), isCorrect: false, trap: '5/10 simplifies to 1/2.' },
                { id: 'C', text: renderFrac(1, 5), isCorrect: false, trap: '4/5 is 8/10; 8/10 - 3/10 = 5/10.' },
                { id: 'D', text: renderFrac(1, 0), isCorrect: false, trap: 'Never subtract denominators.' }
              ],
              explanation: {
                trapText: '4/5 = 8/10. 8/10 - 3/10 = 5/10 = 1/2.',
                solutionText: `8/10 - 3/10 = 5/10 = <strong>${renderFrac(1, 2)}</strong>.`,
                visualType: 'golden-rule-wall',
                visualConfig: { origNum: 4, origDen: 5, scale: 2, targetNum: 3, targetDen: 10 }
              }
            }
          },

          // Q4
          {
            id: 't3_c3_q4',
            concept: 'Finding the Equivalence Multiplier',
            prompt: `What number must you multiply the top and bottom of ${renderFrac(1, 3)} by to create an equivalent fraction with a denominator of 6?`,
            visualAid: { type: 'golden-rule-wall', origNum: 1, origDen: 3, scale: 2, targetNum: 2, targetDen: 6 },
            options: [
              { id: 'A', text: 'Multiply by 3', isCorrect: false, trap: '3 × 3 = 9, not 6.' },
              { id: 'B', text: 'Multiply by 2', isCorrect: true },
              { id: 'C', text: 'Add 3 to top and bottom', isCorrect: false, trap: 'Adding numbers breaks equivalence! You must multiply.' },
              { id: 'D', text: 'Multiply by 6', isCorrect: false, trap: '3 × 6 = 18.' }
            ],
            explanation: {
              trapText: 'To go from denominator 3 to 6, divide 6 ÷ 3 = 2.',
              solutionText: `Multiply top and bottom by <strong>2</strong>: ${renderFrac('1 × 2', '3 × 2')} = ${renderFrac(2, 6)}.`,
              visualType: 'golden-rule-wall',
              visualConfig: { origNum: 1, origDen: 3, scale: 2, targetNum: 2, targetDen: 6 }
            },
            parallelVariation: {
              id: 't3_c3_q4_var',
              concept: 'Finding Multiplier for Tenths (Practice Variation)',
              prompt: `What multiplier converts ${renderFrac(2, 5)} to an equivalent fraction with denominator 10?`,
              visualAid: { type: 'golden-rule-wall', origNum: 2, origDen: 5, scale: 2, targetNum: 4, targetDen: 10 },
              options: [
                { id: 'A', text: 'Multiply top and bottom by 2', isCorrect: true },
                { id: 'B', text: 'Multiply top and bottom by 5', isCorrect: false, trap: '5 × 5 = 25.' },
                { id: 'C', text: 'Add 5 to top and bottom', isCorrect: false, trap: 'Never add to create equivalent fractions.' },
                { id: 'D', text: 'Multiply top by 2 and bottom by 5', isCorrect: false, trap: 'Must multiply both by the same number.' }
              ],
              explanation: {
                trapText: '5 × 2 = 10.',
                solutionText: `Multiply top and bottom by <strong>2</strong>: (2 × 2)/(5 × 2) = 4/10.`,
                visualType: 'golden-rule-wall',
                visualConfig: { origNum: 2, origDen: 5, scale: 2, targetNum: 4, targetDen: 10 }
              }
            }
          },

          // Q5
          {
            id: 't3_c3_q5',
            concept: 'Sum of Quarters and Eighths',
            prompt: `Calculate: ${renderFrac(1, 4)} <span class="math-op">+</span> ${renderFrac(5, 8)}`,
            visualAid: { type: 'golden-rule-wall', origNum: 1, origDen: 4, scale: 2, targetNum: 5, targetDen: 8 },
            options: [
              { id: 'A', text: renderFrac(6, 8), isCorrect: false, trap: '1/4 is 2/8; 2/8 + 5/8 = 7/8.' },
              { id: 'B', text: renderFrac(6, 12), isCorrect: false, trap: 'Never add denominators (4 + 8 = 12).' },
              { id: 'C', text: renderFrac(7, 8), isCorrect: true },
              { id: 'D', text: renderFrac(4, 8), isCorrect: false, trap: 'Check your conversion: 1/4 = 2/8.' }
            ],
            explanation: {
              trapText: '1/4 = 2/8. 2/8 + 5/8 = 7/8.',
              solutionText: `${renderFrac(2, 8)} + ${renderFrac(5, 8)} = <strong>${renderFrac(7, 8)}</strong>.`,
              visualType: 'golden-rule-wall',
              visualConfig: { origNum: 1, origDen: 4, scale: 2, targetNum: 5, targetDen: 8 }
            },
            parallelVariation: {
              id: 't3_c3_q5_var',
              concept: 'Sum of Fifths and Tenths (Practice Variation)',
              prompt: `Calculate in simplest form: ${renderFrac(2, 5)} <span class="math-op">+</span> ${renderFrac(1, 10)}`,
              visualAid: { type: 'golden-rule-wall', origNum: 2, origDen: 5, scale: 2, targetNum: 1, targetDen: 10 },
              options: [
                { id: 'A', text: renderFrac(1, 2), isCorrect: true },
                { id: 'B', text: renderFrac(5, 10), isCorrect: false, trap: '5/10 simplifies to 1/2.' },
                { id: 'C', text: renderFrac(3, 15), isCorrect: false, trap: 'Never add denominators.' },
                { id: 'D', text: renderFrac(3, 10), isCorrect: false, trap: '2/5 is 4/10; 4/10 + 1/10 = 5/10 = 1/2.' }
              ],
              explanation: {
                trapText: '2/5 = 4/10. 4/10 + 1/10 = 5/10 = 1/2.',
                solutionText: `4/10 + 1/10 = 5/10 = <strong>${renderFrac(1, 2)}</strong>.`,
                visualType: 'golden-rule-wall',
                visualConfig: { origNum: 2, origDen: 5, scale: 2, targetNum: 1, targetDen: 10 }
              }
            }
          }
        ]
      },

      // -----------------------------------------------------------------------
      // T3 CLINIC 4: SIMPLIFYING FRACTIONS (5 Questions)
      // -----------------------------------------------------------------------
      {
        id: 't3_c4',
        title: 'Clinic 4: Simplifying Fractions to Lowest Terms',
        subtitle: 'Dividing numerator and denominator by the Highest Common Factor',
        icon: '✂️',
        questions: [
          // Q1
          {
            id: 't3_c4_q1',
            concept: 'Simplifying 8/12',
            prompt: `Simplify ${renderFrac(8, 12)} to its simplest form.`,
            visualAid: { type: 'simplification-dots', num: 8, den: 12, factor: 4, finalNum: 2, finalDen: 3 },
            options: [
              { id: 'A', text: renderFrac(4, 6), isCorrect: false, trap: '4/6 is partially simplified (divided by 2), but both 4 and 6 can still be divided by 2 again to reach simplest form (2/3)!' },
              { id: 'B', text: renderFrac(2, 3), isCorrect: true },
              { id: 'C', text: renderFrac(1, 2), isCorrect: false, trap: '8/12 is larger than 1/2 (which would be 6/12).' },
              { id: 'D', text: renderFrac(8, 12), isCorrect: false, trap: 'This has not been simplified at all.' }
            ],
            explanation: {
              trapText: 'Stopping at 4/6 is incomplete. Divide both top and bottom by 4 (the HCF).',
              solutionText: `${renderFrac('8 ÷ 4', '12 ÷ 4')} = <strong>${renderFrac(2, 3)}</strong>.`,
              visualType: 'simplification-dots',
              visualConfig: { num: 8, den: 12, factor: 4, finalNum: 2, finalDen: 3 }
            },
            parallelVariation: {
              id: 't3_c4_q1_var',
              concept: 'Simplifying 6/10 (Practice Variation)',
              prompt: `Simplify ${renderFrac(6, 10)} to its simplest form.`,
              visualAid: { type: 'simplification-dots', num: 6, den: 10, factor: 2, finalNum: 3, finalDen: 5 },
              options: [
                { id: 'A', text: renderFrac(3, 5), isCorrect: true },
                { id: 'B', text: renderFrac(6, 10), isCorrect: false, trap: 'Divide both top and bottom by 2.' },
                { id: 'C', text: renderFrac(1, 2), isCorrect: false, trap: '6/10 is not 1/2 (5/10).' },
                { id: 'D', text: renderFrac(3, 10), isCorrect: false, trap: 'Divide denominator by 2 as well.' }
              ],
              explanation: {
                trapText: 'Divide 6 and 10 by 2.',
                solutionText: `${renderFrac('6 ÷ 2', '10 ÷ 2')} = <strong>${renderFrac(3, 5)}</strong>.`,
                visualType: 'simplification-dots',
                visualConfig: { num: 6, den: 10, factor: 2, finalNum: 3, finalDen: 5 }
              }
            }
          },

          // Q2
          {
            id: 't3_c4_q2',
            concept: 'Simplifying 4/8 to 1/2',
            prompt: `Simplify ${renderFrac(4, 8)} to its simplest form.`,
            visualAid: { type: 'simplification-dots', num: 4, den: 8, factor: 4, finalNum: 1, finalDen: 2 },
            options: [
              { id: 'A', text: renderFrac(2, 4), isCorrect: false, trap: '2/4 can be simplified further to 1/2.' },
              { id: 'B', text: renderFrac(1, 2), isCorrect: true },
              { id: 'C', text: renderFrac(4, 8), isCorrect: false, trap: 'Not simplified.' },
              { id: 'D', text: renderFrac(1, 4), isCorrect: false, trap: '4 is half of 8, not a quarter.' }
            ],
            explanation: {
              trapText: 'Divide numerator and denominator by 4.',
              solutionText: `${renderFrac('4 ÷ 4', '8 ÷ 4')} = <strong>${renderFrac(1, 2)}</strong>.`,
              visualType: 'simplification-dots',
              visualConfig: { num: 4, den: 8, factor: 4, finalNum: 1, finalDen: 2 }
            },
            parallelVariation: {
              id: 't3_c4_q2_var',
              concept: 'Simplifying 5/10 (Practice Variation)',
              prompt: `Simplify ${renderFrac(5, 10)} to its simplest form.`,
              visualAid: { type: 'simplification-dots', num: 5, den: 10, factor: 5, finalNum: 1, finalDen: 2 },
              options: [
                { id: 'A', text: renderFrac(1, 2), isCorrect: true },
                { id: 'B', text: renderFrac(5, 10), isCorrect: false, trap: 'Divide top and bottom by 5.' },
                { id: 'C', text: renderFrac(1, 5), isCorrect: false, trap: '5 is half of 10, not one fifth.' },
                { id: 'D', text: renderFrac(2, 5), isCorrect: false, trap: 'Check your division: 10 ÷ 5 = 2.' }
              ],
              explanation: {
                trapText: '5 ÷ 5 = 1, 10 ÷ 5 = 2.',
                solutionText: `5/10 = <strong>${renderFrac(1, 2)}</strong>.`,
                visualType: 'simplification-dots',
                visualConfig: { num: 5, den: 10, factor: 5, finalNum: 1, finalDen: 2 }
              }
            }
          },

          // Q3
          {
            id: 't3_c4_q3',
            concept: 'Simplifying 10/12',
            prompt: `Simplify ${renderFrac(10, 12)} to its simplest form.`,
            visualAid: { type: 'simplification-dots', num: 10, den: 12, factor: 2, finalNum: 5, finalDen: 6 },
            options: [
              { id: 'A', text: renderFrac(10, 12), isCorrect: false, trap: 'Both 10 and 12 can be divided by 2.' },
              { id: 'B', text: renderFrac(5, 6), isCorrect: true },
              { id: 'C', text: renderFrac(1, 2), isCorrect: false, trap: '10/12 is much larger than 1/2 (6/12).' },
              { id: 'D', text: renderFrac(5, 12), isCorrect: false, trap: 'You must divide the denominator 12 by 2 as well.' }
            ],
            explanation: {
              trapText: 'Divide 10 and 12 by 2.',
              solutionText: `${renderFrac('10 ÷ 2', '12 ÷ 2')} = <strong>${renderFrac(5, 6)}</strong>.`,
              visualType: 'simplification-dots',
              visualConfig: { num: 10, den: 12, factor: 2, finalNum: 5, finalDen: 6 }
            },
            parallelVariation: {
              id: 't3_c4_q3_var',
              concept: 'Simplifying 8/10 (Practice Variation)',
              prompt: `Simplify ${renderFrac(8, 10)} to its simplest form.`,
              visualAid: { type: 'simplification-dots', num: 8, den: 10, factor: 2, finalNum: 4, finalDen: 5 },
              options: [
                { id: 'A', text: renderFrac(4, 5), isCorrect: true },
                { id: 'B', text: renderFrac(8, 10), isCorrect: false, trap: 'Divide both by 2.' },
                { id: 'C', text: renderFrac(2, 5), isCorrect: false, trap: '8 ÷ 2 = 4, not 2.' },
                { id: 'D', text: renderFrac(4, 10), isCorrect: false, trap: 'Divide 10 by 2 as well.' }
              ],
              explanation: {
                trapText: '8 ÷ 2 = 4 and 10 ÷ 2 = 5.',
                solutionText: `8/10 = <strong>${renderFrac(4, 5)}</strong>.`,
                visualType: 'simplification-dots',
                visualConfig: { num: 8, den: 10, factor: 2, finalNum: 4, finalDen: 5 }
              }
            }
          },

          // Q4
          {
            id: 't3_c4_q4',
            concept: 'Identifying Highest Common Factor',
            prompt: `What is the Highest Common Factor (HCF) used to simplify ${renderFrac(9, 12)} to ${renderFrac(3, 4)}?`,
            visualAid: { type: 'simplification-dots', num: 9, den: 12, factor: 3, finalNum: 3, finalDen: 4 },
            options: [
              { id: 'A', text: 'Divide by 2', isCorrect: false, trap: '9 cannot be divided evenly by 2.' },
              { id: 'B', text: 'Divide by 3', isCorrect: true },
              { id: 'C', text: 'Divide by 4', isCorrect: false, trap: '9 cannot be divided by 4.' },
              { id: 'D', text: 'Divide by 9', isCorrect: false, trap: '12 cannot be divided evenly by 9.' }
            ],
            explanation: {
              trapText: 'Both 9 and 12 can be divided evenly by 3.',
              solutionText: `9 ÷ 3 = 3 and 12 ÷ 3 = 4. The HCF is <strong>3</strong>.`,
              visualType: 'simplification-dots',
              visualConfig: { num: 9, den: 12, factor: 3, finalNum: 3, finalDen: 4 }
            },
            parallelVariation: {
              id: 't3_c4_q4_var',
              concept: 'Identifying HCF (Practice Variation)',
              prompt: `What is the Highest Common Factor (HCF) of 6 and 8?`,
              visualAid: { type: 'simplification-dots', num: 6, den: 8, factor: 2, finalNum: 3, finalDen: 4 },
              options: [
                { id: 'A', text: '2', isCorrect: true },
                { id: 'B', text: '3', isCorrect: false, trap: '8 cannot be divided evenly by 3.' },
                { id: 'C', text: '4', isCorrect: false, trap: '6 cannot be divided evenly by 4.' },
                { id: 'D', text: '6', isCorrect: false, trap: '8 cannot be divided by 6.' }
              ],
              explanation: {
                trapText: 'The largest number that divides into both 6 and 8 is 2.',
                solutionText: `The HCF of 6 and 8 is <strong>2</strong> (${renderFrac(6, 8)} = ${renderFrac(3, 4)}).`,
                visualType: 'simplification-dots',
                visualConfig: { num: 6, den: 8, factor: 2, finalNum: 3, finalDen: 4 }
              }
            }
          },

          // Q5
          {
            id: 't3_c4_q5',
            concept: 'Simplifying 6/9',
            prompt: `Simplify ${renderFrac(6, 9)} to lowest terms.`,
            visualAid: { type: 'simplification-dots', num: 6, den: 9, factor: 3, finalNum: 2, finalDen: 3 },
            options: [
              { id: 'A', text: renderFrac(3, 4), isCorrect: false, trap: '6/9 is equal to 2/3, not 3/4.' },
              { id: 'B', text: renderFrac(2, 3), isCorrect: true },
              { id: 'C', text: renderFrac(2, 9), isCorrect: false, trap: 'Divide the denominator 9 by 3 as well.' },
              { id: 'D', text: renderFrac(1, 3), isCorrect: false, trap: '6 ÷ 3 = 2, not 1.' }
            ],
            explanation: {
              trapText: 'Divide 6 and 9 by 3.',
              solutionText: `${renderFrac('6 ÷ 3', '9 ÷ 3')} = <strong>${renderFrac(2, 3)}</strong>.`,
              visualType: 'simplification-dots',
              visualConfig: { num: 6, den: 9, factor: 3, finalNum: 2, finalDen: 3 }
            },
            parallelVariation: {
              id: 't3_c4_q5_var',
              concept: 'Simplifying 4/6 (Practice Variation)',
              prompt: `Simplify ${renderFrac(4, 6)} to lowest terms.`,
              visualAid: { type: 'simplification-dots', num: 4, den: 6, factor: 2, finalNum: 2, finalDen: 3 },
              options: [
                { id: 'A', text: renderFrac(2, 3), isCorrect: true },
                { id: 'B', text: renderFrac(4, 6), isCorrect: false, trap: 'Divide both numbers by 2.' },
                { id: 'C', text: renderFrac(1, 3), isCorrect: false, trap: '4 ÷ 2 = 2, not 1.' },
                { id: 'D', text: renderFrac(2, 6), isCorrect: false, trap: 'Divide denominator by 2 as well.' }
              ],
              explanation: {
                trapText: '4 ÷ 2 = 2, 6 ÷ 2 = 3.',
                solutionText: `4/6 = <strong>${renderFrac(2, 3)}</strong>.`,
                visualType: 'simplification-dots',
                visualConfig: { num: 4, den: 6, factor: 2, finalNum: 2, finalDen: 3 }
              }
            }
          }
        ]
      }
    ],

    // -------------------------------------------------------------------------
    // PATHWAY T2 CLINICS (20 Questions Total)
    // -------------------------------------------------------------------------
    t2: [
      {
        id: 't2_c1',
        title: 'Clinic 1: Decimal Place Value & Grid Percentages',
        subtitle: 'Mastering improper hundredths and complement percentages',
        icon: '📊',
        questions: [
          // Q1
          {
            id: 't2_c1_q1',
            concept: 'Improper Hundredths to Decimals',
            prompt: `Convert the fraction ${renderFrac(237, 100)} into decimal form.`,
            visualAid: { type: 'place-value-grid', whole: 2, tenths: 3, hundredths: 7, compareTenths: 0 },
            options: [
              { id: 'A', text: '23.7', isCorrect: false, trap: '23.7 divided by 10 instead of 100. Hundredths means two decimal places.' },
              { id: 'B', text: '237.0', isCorrect: false, trap: '237.0 treats hundredths as whole units!' },
              { id: 'C', text: '2.37', isCorrect: true },
              { id: 'D', text: '0.237', isCorrect: false, trap: '0.237 divided by 1000 (thousandths), not 100.' }
            ],
            explanation: {
              trapText: 'Dividing by 100 moves the decimal point 2 places to the left, giving 2 whole units, 3 tenths, and 7 hundredths.',
              solutionText: `200 hundredths = 2 wholes. 37 hundredths = 0.37.<br>Together: <strong>2.37</strong>.`,
              visualType: 'place-value-grid',
              visualConfig: { whole: 2, tenths: 3, hundredths: 7, compareTenths: 0 }
            },
            parallelVariation: {
              id: 't2_c1_q1_var',
              concept: 'Improper Hundredths to Decimals (Practice Variation)',
              prompt: `Convert ${renderFrac(405, 100)} into decimal form.`,
              visualAid: { type: 'place-value-grid', whole: 4, tenths: 0, hundredths: 5, compareTenths: 5 },
              options: [
                { id: 'A', text: '4.5', isCorrect: false, trap: '4.5 is 4 wholes and 5 tenths (4.50). 5 hundredths needs a 0 placeholder: 4.05.' },
                { id: 'B', text: '4.05', isCorrect: true },
                { id: 'C', text: '40.5', isCorrect: false, trap: '40.5 is 40 wholes and 5 tenths.' },
                { id: 'D', text: '0.405', isCorrect: false, trap: '0.405 is thousandths.' }
              ],
              explanation: {
                trapText: 'Notice the 0 in the tens place of 405! That means 0 tenths.',
                solutionText: `400 hundredths = 4 wholes, 0 tenths, 5 hundredths = <strong>4.05</strong>.`,
                visualType: 'place-value-grid',
                visualConfig: { whole: 4, tenths: 0, hundredths: 5, compareTenths: 5 }
              }
            }
          },

          // Q2
          {
            id: 't2_c1_q2',
            concept: '100-Grid Complement Percentage',
            prompt: `In a 100-square grid, 45 squares are shaded. What percentage of the grid is <strong>unshaded</strong>?`,
            visualAid: { type: 'place-value-grid', whole: 0, tenths: 4, hundredths: 5, compareTenths: 0 },
            options: [
              { id: 'A', text: '45%', isCorrect: false, trap: '45% is the shaded amount. Subtract from 100% to find unshaded.' },
              { id: 'B', text: '55%', isCorrect: true },
              { id: 'C', text: '65%', isCorrect: false, trap: '100 - 45 = 55, not 65.' },
              { id: 'D', text: '0.55%', isCorrect: false, trap: '55 squares out of 100 is 55%, not 0.55%.' }
            ],
            explanation: {
              trapText: '100% - 45% = 55%.',
              solutionText: `Total grid (100%) - shaded (45%) = <strong>55% unshaded</strong>.`,
              visualType: 'place-value-grid',
              visualConfig: { whole: 0, tenths: 4, hundredths: 5, compareTenths: 0 }
            },
            parallelVariation: {
              id: 't2_c1_q2_var',
              concept: 'Complement Percentage (Practice Variation)',
              prompt: `If 65 squares of a 100-grid are shaded, what percentage is <strong>unshaded</strong>?`,
              visualAid: { type: 'place-value-grid', whole: 0, tenths: 6, hundredths: 5, compareTenths: 0 },
              options: [
                { id: 'A', text: '65%', isCorrect: false, trap: '65% is shaded. 100 - 65 = 35%.' },
                { id: 'B', text: '35%', isCorrect: true },
                { id: 'C', text: '45%', isCorrect: false, trap: '100 - 65 = 35, not 45.' },
                { id: 'D', text: '25%', isCorrect: false, trap: 'Check subtraction: 100 - 65 = 35.' }
              ],
              explanation: {
                trapText: '100 - 65 = 35%.',
                solutionText: `Unshaded percentage = <strong>35%</strong>.`,
                visualType: 'place-value-grid',
                visualConfig: { whole: 0, tenths: 6, hundredths: 5, compareTenths: 0 }
              }
            }
          },

          // Q3
          {
            id: 't2_c1_q3',
            concept: 'Hundredths with 0 Tenths Placeholder',
            prompt: `What is ${renderMixed(10, 5, 100)} as a decimal?`,
            visualAid: { type: 'place-value-grid', whole: 10, tenths: 0, hundredths: 5, compareTenths: 5 },
            options: [
              { id: 'A', text: '10.5', isCorrect: false, trap: '10.5 is 10 and 5 tenths (10.50).' },
              { id: 'B', text: '10.05', isCorrect: true },
              { id: 'C', text: '1.05', isCorrect: false, trap: 'The whole number is 10.' },
              { id: 'D', text: '105.0', isCorrect: false, trap: 'Hundredths are fractional parts.' }
            ],
            explanation: {
              trapText: '5 hundredths requires a 0 in the tenths column.',
              solutionText: `${renderMixed(10, 5, 100)} = <strong>10.05</strong>.`,
              visualType: 'place-value-grid',
              visualConfig: { whole: 10, tenths: 0, hundredths: 5, compareTenths: 5 }
            },
            parallelVariation: {
              id: 't2_c1_q3_var',
              concept: 'Hundredths with 0 Tenths (Practice Variation)',
              prompt: `What is ${renderMixed(12, 8, 100)} as a decimal?`,
              visualAid: { type: 'place-value-grid', whole: 12, tenths: 0, hundredths: 8, compareTenths: 8 },
              options: [
                { id: 'A', text: '12.8', isCorrect: false, trap: '12.8 is 8 tenths (80 hundredths).' },
                { id: 'B', text: '12.08', isCorrect: true },
                { id: 'C', text: '1.28', isCorrect: false, trap: 'The whole number is 12.' },
                { id: 'D', text: '128.0', isCorrect: false, trap: '128.0 is a whole number.' }
              ],
              explanation: {
                trapText: '8 hundredths needs 0 tenths: 12.08.',
                solutionText: `12 and 8 hundredths = <strong>12.08</strong>.`,
                visualType: 'place-value-grid',
                visualConfig: { whole: 12, tenths: 0, hundredths: 8, compareTenths: 8 }
              }
            }
          },

          // Q4
          {
            id: 't2_c1_q4',
            concept: 'Battery Indicator Decimal to Fraction',
            prompt: `A tablet battery display shows <strong>0.43</strong> charged. What fraction of a full charge is this?`,
            visualAid: { type: 'place-value-grid', whole: 0, tenths: 4, hundredths: 3, compareTenths: 0 },
            options: [
              { id: 'A', text: renderFrac(43, 10), isCorrect: false, trap: '43/10 would be 4.3 (more than 4 whole charges!).' },
              { id: 'B', text: renderFrac(43, 100), isCorrect: true },
              { id: 'C', text: renderFrac(4, 3), isCorrect: false, trap: '0.43 is hundredths, not thirds.' },
              { id: 'D', text: renderFrac(43, 1000), isCorrect: false, trap: '43/1000 is 0.043.' }
            ],
            explanation: {
              trapText: 'Two decimal digits represent hundredths (denominator 100).',
              solutionText: `0.43 = <strong>${renderFrac(43, 100)}</strong>.`,
              visualType: 'place-value-grid',
              visualConfig: { whole: 0, tenths: 4, hundredths: 3, compareTenths: 0 }
            },
            parallelVariation: {
              id: 't2_c1_q4_var',
              concept: 'Decimal to Fraction (Practice Variation)',
              prompt: `Convert the decimal <strong>0.79</strong> into a fraction.`,
              visualAid: { type: 'place-value-grid', whole: 0, tenths: 7, hundredths: 9, compareTenths: 0 },
              options: [
                { id: 'A', text: renderFrac(79, 100), isCorrect: true },
                { id: 'B', text: renderFrac(79, 10), isCorrect: false, trap: '79/10 is 7.9.' },
                { id: 'C', text: renderFrac(7, 9), isCorrect: false, trap: '0.79 is hundredths.' },
                { id: 'D', text: renderFrac(79, 1000), isCorrect: false, trap: '79/1000 is 0.079.' }
              ],
              explanation: {
                trapText: '79 hundredths = 79/100.',
                solutionText: `0.79 = <strong>${renderFrac(79, 100)}</strong>.`,
                visualType: 'place-value-grid',
                visualConfig: { whole: 0, tenths: 7, hundredths: 9, compareTenths: 0 }
              }
            }
          },

          // Q5
          {
            id: 't2_c1_q5',
            concept: 'Composing Ones and Hundredths',
            prompt: `Which decimal represents <strong>6 ones and 8 hundredths</strong>?`,
            visualAid: { type: 'place-value-grid', whole: 6, tenths: 0, hundredths: 8, compareTenths: 8 },
            options: [
              { id: 'A', text: '6.8', isCorrect: false, trap: '6.8 has 8 tenths (80 hundredths).' },
              { id: 'B', text: '6.08', isCorrect: true },
              { id: 'C', text: '0.68', isCorrect: false, trap: '0.68 has 0 ones.' },
              { id: 'D', text: '68.0', isCorrect: false, trap: '68.0 is 6 tens and 8 ones.' }
            ],
            explanation: {
              trapText: 'Ones go before the dot, tenths have 0, hundredths have 8.',
              solutionText: `6 ones and 8 hundredths = <strong>6.08</strong>.`,
              visualType: 'place-value-grid',
              visualConfig: { whole: 6, tenths: 0, hundredths: 8, compareTenths: 8 }
            },
            parallelVariation: {
              id: 't2_c1_q5_var',
              concept: 'Composing Ones and Hundredths (Practice Variation)',
              prompt: `Which decimal represents <strong>5 ones and 3 hundredths</strong>?`,
              visualAid: { type: 'place-value-grid', whole: 5, tenths: 0, hundredths: 3, compareTenths: 3 },
              options: [
                { id: 'A', text: '5.3', isCorrect: false, trap: '5.3 is 3 tenths.' },
                { id: 'B', text: '5.03', isCorrect: true },
                { id: 'C', text: '0.53', isCorrect: false, trap: 'Missing 5 ones.' },
                { id: 'D', text: '53.0', isCorrect: false, trap: '53.0 is whole units.' }
              ],
              explanation: {
                trapText: '3 hundredths needs 0 tenths.',
                solutionText: `5 ones + 0 tenths + 3 hundredths = <strong>5.03</strong>.`,
                visualType: 'place-value-grid',
                visualConfig: { whole: 5, tenths: 0, hundredths: 3, compareTenths: 3 }
              }
            }
          }
        ]
      },

      // -----------------------------------------------------------------------
      // T2 CLINIC 2: SUBTRACTING FROM WHOLE NUMBERS (5 Questions)
      // -----------------------------------------------------------------------
      {
        id: 't2_c2',
        title: 'Clinic 2: Subtracting Fractions from Whole Numbers',
        subtitle: 'Renaming a whole number into equivalent fractional parts',
        icon: '➖',
        questions: [
          // Q1
          {
            id: 't2_c2_q1',
            concept: 'Whole Number Fraction Subtraction',
            prompt: `Calculate: 4 <span class="math-op">−</span> ${renderFrac(1, 5)}`,
            visualAid: { type: 'fraction-bar-rename', whole: 3, part1: 5, part2: -1, den: 5 },
            options: [
              { id: 'A', text: renderFrac(3, 5), isCorrect: false, trap: 'You subtracted 4 - 1 = 3 in the numerator and lost the 3 whole units entirely!' },
              { id: 'B', text: renderMixed(3, 4, 5), isCorrect: true },
              { id: 'C', text: renderMixed(3, 1, 5), isCorrect: false, trap: '5/5 - 1/5 = 4/5, not 1/5.' },
              { id: 'D', text: renderMixed(4, 1, 5), isCorrect: false, trap: 'You added the fraction instead of subtracting.' }
            ],
            explanation: {
              trapText: 'Regroup 4 as 3 wholes + 5/5.',
              solutionText: `3 and 5/5 - 1/5 = <strong>${renderMixed(3, 4, 5)}</strong>.`,
              visualType: 'fraction-bar-rename',
              visualConfig: { whole: 3, part1: 5, part2: -1, den: 5 }
            },
            parallelVariation: {
              id: 't2_c2_q1_var',
              concept: 'Whole Subtraction (Practice Variation)',
              prompt: `Calculate: 5 <span class="math-op">−</span> ${renderFrac(3, 8)}`,
              visualAid: { type: 'fraction-bar-rename', whole: 4, part1: 8, part2: -3, den: 8 },
              options: [
                { id: 'A', text: renderMixed(4, 5, 8), isCorrect: true },
                { id: 'B', text: renderMixed(4, 3, 8), isCorrect: false, trap: '8/8 - 3/8 = 5/8.' },
                { id: 'C', text: renderMixed(5, 5, 8), isCorrect: false, trap: 'Leaves 4 wholes.' },
                { id: 'D', text: renderFrac(2, 8), isCorrect: false, trap: 'Remember the 4 wholes.' }
              ],
              explanation: {
                trapText: 'Regroup 5 as 4 and 8/8. 8/8 - 3/8 = 5/8.',
                solutionText: `5 - 3/8 = <strong>${renderMixed(4, 5, 8)}</strong>.`,
                visualType: 'fraction-bar-rename',
                visualConfig: { whole: 4, part1: 8, part2: -3, den: 8 }
              }
            }
          },

          // Q2
          {
            id: 't2_c2_q2',
            concept: 'Whole Subtraction with Halves/Quarters',
            prompt: `Calculate in simplest form: 3 <span class="math-op">−</span> ${renderFrac(2, 4)}`,
            visualAid: { type: 'fraction-bar-rename', whole: 2, part1: 4, part2: -2, den: 4 },
            options: [
              { id: 'A', text: renderMixed(2, 2, 4), isCorrect: false, trap: '2 and 2/4 is numerically correct, but 2/4 simplifies to 1/2!' },
              { id: 'B', text: renderMixed(2, 1, 2), isCorrect: true },
              { id: 'C', text: renderMixed(3, 1, 2), isCorrect: false, trap: 'Subtracting reduces 3 wholes to 2.' },
              { id: 'D', text: renderFrac(1, 2), isCorrect: false, trap: 'Remember the 2 remaining whole units.' }
            ],
            explanation: {
              trapText: '3 = 2 and 4/4. 4/4 - 2/4 = 2/4 = 1/2.',
              solutionText: `3 - 2/4 = 2 and 2/4 = <strong>${renderMixed(2, 1, 2)}</strong>.`,
              visualType: 'fraction-bar-rename',
              visualConfig: { whole: 2, part1: 4, part2: -2, den: 4 }
            },
            parallelVariation: {
              id: 't2_c2_q2_var',
              concept: 'Whole Subtraction Sixths (Practice Variation)',
              prompt: `Calculate in simplest form: 4 <span class="math-op">−</span> ${renderFrac(3, 6)}`,
              visualAid: { type: 'fraction-bar-rename', whole: 3, part1: 6, part2: -3, den: 6 },
              options: [
                { id: 'A', text: renderMixed(3, 1, 2), isCorrect: true },
                { id: 'B', text: renderMixed(3, 3, 6), isCorrect: false, trap: 'Simplify 3/6 to 1/2.' },
                { id: 'C', text: renderMixed(4, 1, 2), isCorrect: false, trap: 'Leaves 3 wholes.' },
                { id: 'D', text: renderFrac(1, 2), isCorrect: false, trap: 'Missing 3 wholes.' }
              ],
              explanation: {
                trapText: '4 = 3 and 6/6. 6/6 - 3/6 = 3/6 = 1/2.',
                solutionText: `4 - 3/6 = <strong>${renderMixed(3, 1, 2)}</strong>.`,
                visualType: 'fraction-bar-rename',
                visualConfig: { whole: 3, part1: 6, part2: -3, den: 6 }
              }
            }
          },

          // Q3
          {
            id: 't2_c2_q3',
            concept: 'Mixed Addition to Exact Whole Number',
            prompt: `Calculate in simplest form: ${renderMixed(2, 3, 4)} <span class="math-op">+</span> ${renderFrac(1, 4)}`,
            visualAid: { type: 'fraction-bar-rename', whole: 2, part1: 3, part2: 1, den: 4 },
            options: [
              { id: 'A', text: '2 ' + renderFrac(4, 4), isCorrect: false, trap: '4/4 is 1 whole. Combine 2 + 1 = 3.' },
              { id: 'B', text: '3', isCorrect: true },
              { id: 'C', text: '2 ' + renderFrac(2, 4), isCorrect: false, trap: '3/4 + 1/4 = 4/4.' },
              { id: 'D', text: '2 ' + renderFrac(4, 8), isCorrect: false, trap: 'Do not add denominators.' }
            ],
            explanation: {
              trapText: '3 quarters + 1 quarter = 4 quarters = 1 whole.',
              solutionText: `2 + 4/4 = 2 + 1 = <strong>3</strong>.`,
              visualType: 'fraction-bar-rename',
              visualConfig: { whole: 2, part1: 3, part2: 1, den: 4 }
            },
            parallelVariation: {
              id: 't2_c2_q3_var',
              concept: 'Mixed Addition Sixths (Practice Variation)',
              prompt: `Calculate in simplest form: ${renderMixed(1, 5, 6)} <span class="math-op">+</span> ${renderFrac(1, 6)}`,
              visualAid: { type: 'fraction-bar-rename', whole: 1, part1: 5, part2: 1, den: 6 },
              options: [
                { id: 'A', text: '1 ' + renderFrac(6, 6), isCorrect: false, trap: '6/6 is 1 whole. 1 + 1 = 2.' },
                { id: 'B', text: '2', isCorrect: true },
                { id: 'C', text: '1 ' + renderFrac(4, 6), isCorrect: false, trap: '5/6 + 1/6 = 6/6.' },
                { id: 'D', text: renderFrac(6, 6), isCorrect: false, trap: 'Remember the starting 1 whole.' }
              ],
              explanation: {
                trapText: '5 sixths + 1 sixth = 6 sixths = 1 whole.',
                solutionText: `1 and 6/6 = <strong>2</strong>.`,
                visualType: 'fraction-bar-rename',
                visualConfig: { whole: 1, part1: 5, part2: 1, den: 6 }
              }
            }
          },

          // Q4
          {
            id: 't2_c2_q4',
            concept: 'Subtracting Tenths from Whole Numbers',
            prompt: `Calculate: 6 <span class="math-op">−</span> ${renderFrac(3, 10)}`,
            visualAid: { type: 'fraction-bar-rename', whole: 5, part1: 10, part2: -3, den: 10 },
            options: [
              { id: 'A', text: renderMixed(5, 7, 10), isCorrect: true },
              { id: 'B', text: renderMixed(5, 3, 10), isCorrect: false, trap: '10/10 - 3/10 = 7/10, not 3/10.' },
              { id: 'C', text: renderMixed(6, 7, 10), isCorrect: false, trap: 'Subtracting reduces 6 wholes to 5.' },
              { id: 'D', text: renderFrac(3, 10), isCorrect: false, trap: 'Remember the 5 whole units.' }
            ],
            explanation: {
              trapText: '6 = 5 and 10/10. 10/10 - 3/10 = 7/10.',
              solutionText: `6 - 3/10 = <strong>${renderMixed(5, 7, 10)}</strong>.`,
              visualType: 'fraction-bar-rename',
              visualConfig: { whole: 5, part1: 10, part2: -3, den: 10 }
            },
            parallelVariation: {
              id: 't2_c2_q4_var',
              concept: 'Subtracting Tenths (Practice Variation)',
              prompt: `Calculate: 7 <span class="math-op">−</span> ${renderFrac(1, 10)}`,
              visualAid: { type: 'fraction-bar-rename', whole: 6, part1: 10, part2: -1, den: 10 },
              options: [
                { id: 'A', text: renderMixed(6, 9, 10), isCorrect: true },
                { id: 'B', text: renderMixed(6, 1, 10), isCorrect: false, trap: '10/10 - 1/10 = 9/10.' },
                { id: 'C', text: renderMixed(7, 9, 10), isCorrect: false, trap: 'Leaves 6 wholes.' },
                { id: 'D', text: renderFrac(6, 10), isCorrect: false, trap: '7 wholes minus 1 tenth = 6 and 9/10.' }
              ],
              explanation: {
                trapText: '7 = 6 and 10/10. 10/10 - 1/10 = 9/10.',
                solutionText: `7 - 1/10 = <strong>${renderMixed(6, 9, 10)}</strong>.`,
                visualType: 'fraction-bar-rename',
                visualConfig: { whole: 6, part1: 10, part2: -1, den: 10 }
              }
            }
          },

          // Q5
          {
            id: 't2_c2_q5',
            concept: 'Regrouping Representation for Whole Numbers',
            prompt: `How can the whole number <strong>5</strong> be renamed so you can subtract eighths?`,
            visualAid: { type: 'fraction-bar-rename', whole: 4, part1: 8, part2: 0, den: 8 },
            options: [
              { id: 'A', text: '4 and ' + renderFrac(8, 8), isCorrect: true },
              { id: 'B', text: '5 and ' + renderFrac(8, 8), isCorrect: false, trap: '5 and 8/8 equals 6 wholes, not 5!' },
              { id: 'C', text: renderFrac(5, 8), isCorrect: false, trap: '5/8 is less than 1 whole.' },
              { id: 'D', text: '4 and ' + renderFrac(1, 8), isCorrect: false, trap: '1/8 is not a full whole unit.' }
            ],
            explanation: {
              trapText: 'Borrow 1 whole from 5 (leaving 4) and turn that 1 whole into 8/8.',
              solutionText: `5 = 4 wholes + 1 whole = <strong>4 and ${renderFrac(8, 8)}</strong>.`,
              visualType: 'fraction-bar-rename',
              visualConfig: { whole: 4, part1: 8, part2: 0, den: 8 }
            },
            parallelVariation: {
              id: 't2_c2_q5_var',
              concept: 'Regrouping Tenths (Practice Variation)',
              prompt: `How can <strong>3</strong> be renamed into wholes and tenths?`,
              visualAid: { type: 'fraction-bar-rename', whole: 2, part1: 10, part2: 0, den: 10 },
              options: [
                { id: 'A', text: '2 and ' + renderFrac(10, 10), isCorrect: true },
                { id: 'B', text: '3 and ' + renderFrac(10, 10), isCorrect: false, trap: '3 and 10/10 equals 4.' },
                { id: 'C', text: renderFrac(3, 10), isCorrect: false, trap: '3/10 is less than 1.' },
                { id: 'D', text: '2 and ' + renderFrac(1, 10), isCorrect: false, trap: 'Needs 10/10.' }
              ],
              explanation: {
                trapText: '3 = 2 wholes + 10/10.',
                solutionText: `3 = <strong>2 and ${renderFrac(10, 10)}</strong>.`,
                visualType: 'fraction-bar-rename',
                visualConfig: { whole: 2, part1: 10, part2: 0, den: 10 }
              }
            }
          }
        ]
      },

      // -----------------------------------------------------------------------
      // T2 CLINIC 3: RELATED DENOMINATOR OPERATIONS (5 Questions)
      // -----------------------------------------------------------------------
      {
        id: 't2_c3',
        title: 'Clinic 3: Related Denominators in Subtraction & Addition',
        subtitle: 'Applying the Golden Rule before operating on unlike fractions',
        icon: '🎯',
        questions: [
          // Q1
          {
            id: 't2_c3_q1',
            concept: 'Subtracting Related Quarters from Eighths',
            prompt: `Calculate: ${renderFrac(5, 8)} <span class="math-op">−</span> ${renderFrac(1, 4)}`,
            visualAid: { type: 'golden-rule-wall', origNum: 1, origDen: 4, scale: 2, targetNum: 5, targetDen: 8 },
            options: [
              { id: 'A', text: renderFrac(4, 8), isCorrect: false, trap: 'Did you subtract 5 - 1 = 4 without converting 1/4 into 2/8 first?' },
              { id: 'B', text: renderFrac(4, 4), isCorrect: false, trap: 'Never subtract denominators (8 - 4 = 4)!' },
              { id: 'C', text: renderFrac(3, 8), isCorrect: true },
              { id: 'D', text: renderFrac(1, 2), isCorrect: false, trap: '1/2 is 4/8.' }
            ],
            explanation: {
              trapText: 'Convert 1/4 = 2/8. 5/8 - 2/8 = 3/8.',
              solutionText: `${renderFrac(5, 8)} - ${renderFrac(2, 8)} = <strong>${renderFrac(3, 8)}</strong>.`,
              visualType: 'golden-rule-wall',
              visualConfig: { origNum: 1, origDen: 4, scale: 2, targetNum: 5, targetDen: 8 }
            },
            parallelVariation: {
              id: 't2_c3_q1_var',
              concept: 'Subtracting Fifths from Tenths (Practice Variation)',
              prompt: `Calculate: ${renderFrac(7, 10)} <span class="math-op">−</span> ${renderFrac(2, 5)}`,
              visualAid: { type: 'golden-rule-wall', origNum: 2, origDen: 5, scale: 2, targetNum: 7, targetDen: 10 },
              options: [
                { id: 'A', text: renderFrac(5, 5), isCorrect: false, trap: 'Never subtract denominators.' },
                { id: 'B', text: renderFrac(5, 10), isCorrect: false, trap: 'Convert 2/5 to 4/10: 7/10 - 4/10 = 3/10.' },
                { id: 'C', text: renderFrac(3, 10), isCorrect: true },
                { id: 'D', text: renderFrac(1, 10), isCorrect: false, trap: '7 - 4 = 3 tenths.' }
              ],
              explanation: {
                trapText: '2/5 = 4/10. 7/10 - 4/10 = 3/10.',
                solutionText: `7/10 - 4/10 = <strong>${renderFrac(3, 10)}</strong>.`,
                visualType: 'golden-rule-wall',
                visualConfig: { origNum: 2, origDen: 5, scale: 2, targetNum: 7, targetDen: 10 }
              }
            }
          },

          // Q2
          {
            id: 't2_c3_q2',
            concept: 'Subtracting Eighths from Quarters',
            prompt: `Calculate: ${renderFrac(3, 4)} <span class="math-op">−</span> ${renderFrac(3, 8)}`,
            visualAid: { type: 'golden-rule-wall', origNum: 3, origDen: 4, scale: 2, targetNum: 3, targetDen: 8 },
            options: [
              { id: 'A', text: renderFrac(3, 8), isCorrect: true },
              { id: 'B', text: renderFrac(0, 4), isCorrect: false, trap: '3/4 is 6/8, not 3/8.' },
              { id: 'C', text: renderFrac(6, 8), isCorrect: false, trap: '6/8 is only the converted 3/4.' },
              { id: 'D', text: renderFrac(1, 4), isCorrect: false, trap: '6/8 - 3/8 = 3/8.' }
            ],
            explanation: {
              trapText: '3/4 = 6/8. 6/8 - 3/8 = 3/8.',
              solutionText: `${renderFrac(6, 8)} - ${renderFrac(3, 8)} = <strong>${renderFrac(3, 8)}</strong>.`,
              visualType: 'golden-rule-wall',
              visualConfig: { origNum: 3, origDen: 4, scale: 2, targetNum: 3, targetDen: 8 }
            },
            parallelVariation: {
              id: 't2_c3_q2_var',
              concept: 'Subtracting Tenths from Fifths (Practice Variation)',
              prompt: `Calculate: ${renderFrac(4, 5)} <span class="math-op">−</span> ${renderFrac(1, 10)}`,
              visualAid: { type: 'golden-rule-wall', origNum: 4, origDen: 5, scale: 2, targetNum: 1, targetDen: 10 },
              options: [
                { id: 'A', text: renderFrac(7, 10), isCorrect: true },
                { id: 'B', text: renderFrac(3, 5), isCorrect: false, trap: '4/5 is 8/10; 8/10 - 1/10 = 7/10.' },
                { id: 'C', text: renderFrac(3, 10), isCorrect: false, trap: '8 - 1 = 7 tenths.' },
                { id: 'D', text: renderFrac(3, 0), isCorrect: false, trap: 'Never subtract denominators.' }
              ],
              explanation: {
                trapText: '4/5 = 8/10. 8/10 - 1/10 = 7/10.',
                solutionText: `8/10 - 1/10 = <strong>${renderFrac(7, 10)}</strong>.`,
                visualType: 'golden-rule-wall',
                visualConfig: { origNum: 4, origDen: 5, scale: 2, targetNum: 1, targetDen: 10 }
              }
            }
          },

          // Q3
          {
            id: 't2_c3_q3',
            concept: 'Adding Fifths and Tenths',
            prompt: `Calculate: ${renderFrac(2, 5)} <span class="math-op">+</span> ${renderFrac(3, 10)}`,
            visualAid: { type: 'golden-rule-wall', origNum: 2, origDen: 5, scale: 2, targetNum: 3, targetDen: 10 },
            options: [
              { id: 'A', text: renderFrac(5, 15), isCorrect: false, trap: 'Do not add numerators and denominators straight across.' },
              { id: 'B', text: renderFrac(7, 10), isCorrect: true },
              { id: 'C', text: renderFrac(5, 10), isCorrect: false, trap: '2/5 is 4/10; 4/10 + 3/10 = 7/10.' },
              { id: 'D', text: renderFrac(4, 10), isCorrect: false, trap: '4/10 is only 2/5 converted.' }
            ],
            explanation: {
              trapText: '2/5 = (2 × 2)/(5 × 2) = 4/10.',
              solutionText: `${renderFrac(4, 10)} + ${renderFrac(3, 10)} = <strong>${renderFrac(7, 10)}</strong>.`,
              visualType: 'golden-rule-wall',
              visualConfig: { origNum: 2, origDen: 5, scale: 2, targetNum: 3, targetDen: 10 }
            },
            parallelVariation: {
              id: 't2_c3_q3_var',
              concept: 'Adding Quarters and Eighths (Practice Variation)',
              prompt: `Calculate: ${renderFrac(1, 4)} <span class="math-op">+</span> ${renderFrac(5, 8)}`,
              visualAid: { type: 'golden-rule-wall', origNum: 1, origDen: 4, scale: 2, targetNum: 5, targetDen: 8 },
              options: [
                { id: 'A', text: renderFrac(7, 8), isCorrect: true },
                { id: 'B', text: renderFrac(6, 12), isCorrect: false, trap: 'Do not add denominators.' },
                { id: 'C', text: renderFrac(6, 8), isCorrect: false, trap: '1/4 is 2/8; 2/8 + 5/8 = 7/8.' },
                { id: 'D', text: renderFrac(4, 8), isCorrect: false, trap: '1/4 = 2/8.' }
              ],
              explanation: {
                trapText: '1/4 = 2/8. 2/8 + 5/8 = 7/8.',
                solutionText: `2/8 + 5/8 = <strong>${renderFrac(7, 8)}</strong>.`,
                visualType: 'golden-rule-wall',
                visualConfig: { origNum: 1, origDen: 4, scale: 2, targetNum: 5, targetDen: 8 }
              }
            }
          },

          // Q4
          {
            id: 't2_c3_q4',
            concept: 'Subtracting Halves from Eighths',
            prompt: `Calculate: ${renderFrac(7, 8)} <span class="math-op">−</span> ${renderFrac(1, 2)}`,
            visualAid: { type: 'golden-rule-wall', origNum: 1, origDen: 2, scale: 4, targetNum: 7, targetDen: 8 },
            options: [
              { id: 'A', text: renderFrac(6, 6), isCorrect: false, trap: 'Do not subtract denominators straight across.' },
              { id: 'B', text: renderFrac(3, 8), isCorrect: true },
              { id: 'C', text: renderFrac(6, 8), isCorrect: false, trap: '1/2 is 4/8; 7/8 - 4/8 = 3/8.' },
              { id: 'D', text: renderFrac(4, 8), isCorrect: false, trap: '4/8 is only 1/2.' }
            ],
            explanation: {
              trapText: '1/2 = 4/8. 7/8 - 4/8 = 3/8.',
              solutionText: `${renderFrac(7, 8)} - ${renderFrac(4, 8)} = <strong>${renderFrac(3, 8)}</strong>.`,
              visualType: 'golden-rule-wall',
              visualConfig: { origNum: 1, origDen: 2, scale: 4, targetNum: 7, targetDen: 8 }
            },
            parallelVariation: {
              id: 't2_c3_q4_var',
              concept: 'Subtracting Halves from Tenths (Practice Variation)',
              prompt: `Calculate in simplest form: ${renderFrac(9, 10)} <span class="math-op">−</span> ${renderFrac(1, 2)}`,
              visualAid: { type: 'golden-rule-wall', origNum: 1, origDen: 2, scale: 5, targetNum: 9, targetDen: 10 },
              options: [
                { id: 'A', text: renderFrac(2, 5), isCorrect: true },
                { id: 'B', text: renderFrac(4, 10), isCorrect: false, trap: '4/10 simplifies to 2/5.' },
                { id: 'C', text: renderFrac(8, 8), isCorrect: false, trap: 'Never subtract denominators.' },
                { id: 'D', text: renderFrac(5, 10), isCorrect: false, trap: '1/2 is 5/10; 9/10 - 5/10 = 4/10 = 2/5.' }
              ],
              explanation: {
                trapText: '1/2 = 5/10. 9/10 - 5/10 = 4/10 = 2/5.',
                solutionText: `9/10 - 5/10 = 4/10 = <strong>${renderFrac(2, 5)}</strong>.`,
                visualType: 'golden-rule-wall',
                visualConfig: { origNum: 1, origDen: 2, scale: 5, targetNum: 9, targetDen: 10 }
              }
            }
          },

          // Q5
          {
            id: 't2_c3_q5',
            concept: 'Adding Tenths and Halves with Simplification',
            prompt: `Calculate in simplest form: ${renderFrac(3, 10)} <span class="math-op">+</span> ${renderFrac(1, 2)}`,
            visualAid: { type: 'golden-rule-wall', origNum: 1, origDen: 2, scale: 5, targetNum: 3, targetDen: 10 },
            options: [
              { id: 'A', text: renderFrac(4, 12), isCorrect: false, trap: 'Do not add denominators.' },
              { id: 'B', text: renderFrac(4, 5), isCorrect: true },
              { id: 'C', text: renderFrac(8, 10), isCorrect: false, trap: '8/10 can be simplified by dividing by 2 = 4/5.' },
              { id: 'D', text: renderFrac(4, 10), isCorrect: false, trap: '1/2 = 5/10; 3/10 + 5/10 = 8/10 = 4/5.' }
            ],
            explanation: {
              trapText: '1/2 = 5/10. 3/10 + 5/10 = 8/10. Simplify by dividing by 2 = 4/5.',
              solutionText: `3/10 + 5/10 = 8/10 = <strong>${renderFrac(4, 5)}</strong>.`,
              visualType: 'golden-rule-wall',
              visualConfig: { origNum: 1, origDen: 2, scale: 5, targetNum: 3, targetDen: 10 }
            },
            parallelVariation: {
              id: 't2_c3_q5_var',
              concept: 'Adding Eighths and Quarters (Practice Variation)',
              prompt: `Calculate: ${renderFrac(1, 8)} <span class="math-op">+</span> ${renderFrac(3, 4)}`,
              visualAid: { type: 'golden-rule-wall', origNum: 3, origDen: 4, scale: 2, targetNum: 1, targetDen: 8 },
              options: [
                { id: 'A', text: renderFrac(7, 8), isCorrect: true },
                { id: 'B', text: renderFrac(4, 12), isCorrect: false, trap: 'Do not add denominators.' },
                { id: 'C', text: renderFrac(6, 8), isCorrect: false, trap: '3/4 is 6/8; 1/8 + 6/8 = 7/8.' },
                { id: 'D', text: renderFrac(4, 8), isCorrect: false, trap: '3/4 = 6/8.' }
              ],
              explanation: {
                trapText: '3/4 = 6/8. 1/8 + 6/8 = 7/8.',
                solutionText: `1/8 + 6/8 = <strong>${renderFrac(7, 8)}</strong>.`,
                visualType: 'golden-rule-wall',
                visualConfig: { origNum: 3, origDen: 4, scale: 2, targetNum: 1, targetDen: 8 }
              }
            }
          }
        ]
      },

      // -----------------------------------------------------------------------
      // T2 CLINIC 4: IMPROPER FRACTIONS & MIXED NUMBERS (5 Questions)
      // -----------------------------------------------------------------------
      {
        id: 't2_c4',
        title: 'Clinic 4: Converting Improper Fractions to Mixed Numbers',
        subtitle: 'Grouping fractional pieces into whole units and simplified remainders',
        icon: '📦',
        questions: [
          // Q1
          {
            id: 't2_c4_q1',
            concept: 'Improper to Mixed Simplification (22/4)',
            prompt: `Convert ${renderFrac(22, 4)} into a mixed number in simplest form.`,
            visualAid: { type: 'fraction-bar-rename', whole: 5, part1: 2, part2: 0, den: 4 },
            options: [
              { id: 'A', text: renderMixed(4, 2, 4), isCorrect: false, trap: '4 wholes is only 16/4. 22 divided by 4 is 5 with remainder 2!' },
              { id: 'B', text: renderMixed(22, 1, 4), isCorrect: false, trap: '22 is the numerator of quarters, not the whole number!' },
              { id: 'C', text: renderMixed(5, 2, 4), isCorrect: false, trap: '5 and 2/4 is numerically correct, but 2/4 simplifies to 1/2!' },
              { id: 'D', text: renderMixed(5, 1, 2), isCorrect: true }
            ],
            explanation: {
              trapText: '22 ÷ 4 = 5 wholes remainder 2 quarters (5 and 2/4). Simplify 2/4 = 1/2.',
              solutionText: `22/4 = 5 and 2/4 = <strong>${renderMixed(5, 1, 2)}</strong>.`,
              visualType: 'fraction-bar-rename',
              visualConfig: { whole: 5, part1: 2, part2: 0, den: 4 }
            },
            parallelVariation: {
              id: 't2_c4_q1_var',
              concept: 'Improper to Mixed (Practice Variation)',
              prompt: `Convert ${renderFrac(18, 4)} into a mixed number in simplest form.`,
              visualAid: { type: 'fraction-bar-rename', whole: 4, part1: 2, part2: 0, den: 4 },
              options: [
                { id: 'A', text: renderMixed(4, 2, 4), isCorrect: false, trap: 'Simplify 2/4 to 1/2.' },
                { id: 'B', text: renderMixed(4, 1, 2), isCorrect: true },
                { id: 'C', text: renderMixed(3, 2, 4), isCorrect: false, trap: '18 ÷ 4 = 4 remainder 2.' },
                { id: 'D', text: renderMixed(18, 1, 4), isCorrect: false, trap: '18 is the total quarters.' }
              ],
              explanation: {
                trapText: '18 ÷ 4 = 4 wholes with 2/4 left over. Simplify 2/4 = 1/2.',
                solutionText: `18/4 = <strong>${renderMixed(4, 1, 2)}</strong>.`,
                visualType: 'fraction-bar-rename',
                visualConfig: { whole: 4, part1: 2, part2: 0, den: 4 }
              }
            }
          },

          // Q2
          {
            id: 't2_c4_q2',
            concept: 'Improper Thirds to Mixed',
            prompt: `Convert ${renderFrac(14, 3)} into a mixed number.`,
            visualAid: { type: 'fraction-bar-rename', whole: 4, part1: 2, part2: 0, den: 3 },
            options: [
              { id: 'A', text: renderMixed(3, 2, 3), isCorrect: false, trap: '3 × 3 = 9. 14 ÷ 3 is 4 wholes with remainder 2!' },
              { id: 'B', text: renderMixed(4, 2, 3), isCorrect: true },
              { id: 'C', text: renderMixed(4, 1, 3), isCorrect: false, trap: '4 × 3 = 12; 14 - 12 = 2 thirds remaining.' },
              { id: 'D', text: renderMixed(14, 1, 3), isCorrect: false, trap: '14 is total thirds.' }
            ],
            explanation: {
              trapText: '14 ÷ 3 = 4 with a remainder of 2.',
              solutionText: `14 thirds = 4 wholes and 2 thirds = <strong>${renderMixed(4, 2, 3)}</strong>.`,
              visualType: 'fraction-bar-rename',
              visualConfig: { whole: 4, part1: 2, part2: 0, den: 3 }
            },
            parallelVariation: {
              id: 't2_c4_q2_var',
              concept: 'Improper Thirds (Practice Variation)',
              prompt: `Convert ${renderFrac(16, 3)} into a mixed number.`,
              visualAid: { type: 'fraction-bar-rename', whole: 5, part1: 1, part2: 0, den: 3 },
              options: [
                { id: 'A', text: renderMixed(5, 1, 3), isCorrect: true },
                { id: 'B', text: renderMixed(4, 4, 3), isCorrect: false, trap: '4/3 is more than 1 whole; 16 ÷ 3 = 5 remainder 1.' },
                { id: 'C', text: renderMixed(5, 2, 3), isCorrect: false, trap: '5 × 3 = 15; 16 - 15 = 1 third.' },
                { id: 'D', text: renderMixed(3, 1, 3), isCorrect: false, trap: '3 × 3 = 9.' }
              ],
              explanation: {
                trapText: '16 ÷ 3 = 5 remainder 1.',
                solutionText: `16/3 = <strong>${renderMixed(5, 1, 3)}</strong>.`,
                visualType: 'fraction-bar-rename',
                visualConfig: { whole: 5, part1: 1, part2: 0, den: 3 }
              }
            }
          },

          // Q3
          {
            id: 't2_c4_q3',
            concept: 'Improper Fifths to Mixed',
            prompt: `Convert ${renderFrac(13, 5)} into a mixed number.`,
            visualAid: { type: 'fraction-bar-rename', whole: 2, part1: 3, part2: 0, den: 5 },
            options: [
              { id: 'A', text: renderMixed(3, 2, 5), isCorrect: false, trap: '3 × 5 = 15 (too big!). 13 ÷ 5 = 2 remainder 3.' },
              { id: 'B', text: renderMixed(2, 3, 5), isCorrect: true },
              { id: 'C', text: renderMixed(1, 8, 5), isCorrect: false, trap: '8/5 contains another whole.' },
              { id: 'D', text: renderMixed(2, 1, 5), isCorrect: false, trap: '13 - 10 = 3 fifths left.' }
            ],
            explanation: {
              trapText: '13 ÷ 5 = 2 with 3 fifths left over.',
              solutionText: `13/5 = <strong>${renderMixed(2, 3, 5)}</strong>.`,
              visualType: 'fraction-bar-rename',
              visualConfig: { whole: 2, part1: 3, part2: 0, den: 5 }
            },
            parallelVariation: {
              id: 't2_c4_q3_var',
              concept: 'Improper Fifths (Practice Variation)',
              prompt: `Convert ${renderFrac(17, 5)} into a mixed number.`,
              visualAid: { type: 'fraction-bar-rename', whole: 3, part1: 2, part2: 0, den: 5 },
              options: [
                { id: 'A', text: renderMixed(3, 2, 5), isCorrect: true },
                { id: 'B', text: renderMixed(2, 7, 5), isCorrect: false, trap: '7/5 has another whole unit.' },
                { id: 'C', text: renderMixed(3, 1, 5), isCorrect: false, trap: '17 - 15 = 2 fifths left.' },
                { id: 'D', text: renderMixed(4, 2, 5), isCorrect: false, trap: '4 × 5 = 20 (too big).' }
              ],
              explanation: {
                trapText: '17 ÷ 5 = 3 remainder 2.',
                solutionText: `17/5 = <strong>${renderMixed(3, 2, 5)}</strong>.`,
                visualType: 'fraction-bar-rename',
                visualConfig: { whole: 3, part1: 2, part2: 0, den: 5 }
              }
            }
          },

          // Q4
          {
            id: 't2_c4_q4',
            concept: 'Recipe Measurement Conversion',
            prompt: `A recipe calls for ${renderMixed(2, 3, 4)} cups of flour. If you only have a ${renderFrac(1, 4)}-cup scoop, exactly how many scoops do you need?`,
            visualAid: { type: 'fraction-bar-rename', whole: 2, part1: 3, part2: 0, den: 4 },
            options: [
              { id: 'A', text: '6 quarter-cups', isCorrect: false, trap: '2 wholes is 8 quarters. 8 + 3 = 11 scoops!' },
              { id: 'B', text: '11 quarter-cups', isCorrect: true },
              { id: 'C', text: '8 quarter-cups', isCorrect: false, trap: '8 scoops is only 2 wholes; you still need the 3/4 cup.' },
              { id: 'D', text: '14 quarter-cups', isCorrect: false, trap: 'Check: (2 × 4) + 3 = 11.' }
            ],
            explanation: {
              trapText: 'Convert mixed to improper: (2 × 4) + 3 = 11 quarters.',
              solutionText: `2 wholes = 8 quarters + 3 quarters = <strong>11 quarter-cups</strong>.`,
              visualType: 'fraction-bar-rename',
              visualConfig: { whole: 2, part1: 3, part2: 0, den: 4 }
            },
            parallelVariation: {
              id: 't2_c4_q4_var',
              concept: 'Recipe Measurement (Practice Variation)',
              prompt: `A cake needs ${renderMixed(3, 1, 4)} cups of sugar. How many ${renderFrac(1, 4)}-cup scoops is this?`,
              visualAid: { type: 'fraction-bar-rename', whole: 3, part1: 1, part2: 0, den: 4 },
              options: [
                { id: 'A', text: '13 scoops', isCorrect: true },
                { id: 'B', text: '7 scoops', isCorrect: false, trap: '3 × 4 = 12; 12 + 1 = 13 scoops.' },
                { id: 'C', text: '12 scoops', isCorrect: false, trap: '12 scoops is only 3 cups; add the 1/4 cup.' },
                { id: 'D', text: '16 scoops', isCorrect: false, trap: '16 scoops is 4 cups.' }
              ],
              explanation: {
                trapText: '(3 × 4) + 1 = 13.',
                solutionText: `3 and 1/4 = <strong>13 scoops</strong>.`,
                visualType: 'fraction-bar-rename',
                visualConfig: { whole: 3, part1: 1, part2: 0, den: 4 }
              }
            }
          },

          // Q5
          {
            id: 't2_c4_q5',
            concept: 'Pizza Slices Word Problem',
            prompt: `At a class party, students eat 15 quarter-slices of pizza. How many whole pizzas and extra slices was this?`,
            visualAid: { type: 'fraction-bar-rename', whole: 3, part1: 3, part2: 0, den: 4 },
            options: [
              { id: 'A', text: '1 whole pizza and ' + renderFrac(5, 4) + ' pizza', isCorrect: false, trap: '5/4 contains another whole pizza!' },
              { id: 'B', text: '3 whole pizzas and ' + renderFrac(3, 4) + ' pizza', isCorrect: true },
              { id: 'C', text: '4 whole pizzas', isCorrect: false, trap: '4 pizzas would be 16 slices.' },
              { id: 'D', text: '2 whole pizzas and ' + renderFrac(7, 4) + ' pizza', isCorrect: false, trap: 'Group all full groups of 4 slices.' }
            ],
            explanation: {
              trapText: '15 ÷ 4 = 3 whole pizzas with 3 slices left over.',
              solutionText: `15/4 = <strong>3 whole pizzas and ${renderFrac(3, 4)} pizza</strong> (${renderMixed(3, 3, 4)}).`,
              visualType: 'fraction-bar-rename',
              visualConfig: { whole: 3, part1: 3, part2: 0, den: 4 }
            },
            parallelVariation: {
              id: 't2_c4_q5_var',
              concept: 'Pizza Slices (Practice Variation)',
              prompt: `If 17 quarter-slices of pizza are eaten, what mixed number of pizzas is that?`,
              visualAid: { type: 'fraction-bar-rename', whole: 4, part1: 1, part2: 0, den: 4 },
              options: [
                { id: 'A', text: renderMixed(4, 1, 4), isCorrect: true },
                { id: 'B', text: renderMixed(3, 5, 4), isCorrect: false, trap: '5/4 contains another whole pizza.' },
                { id: 'C', text: renderMixed(4, 3, 4), isCorrect: false, trap: '17 - 16 = 1 slice left.' },
                { id: 'D', text: renderMixed(17, 1, 4), isCorrect: false, trap: '17 is total slices.' }
              ],
              explanation: {
                trapText: '17 ÷ 4 = 4 with remainder 1.',
                solutionText: `17/4 = <strong>${renderMixed(4, 1, 4)}</strong> pizzas.`,
                visualType: 'fraction-bar-rename',
                visualConfig: { whole: 4, part1: 1, part2: 0, den: 4 }
              }
            }
          }
        ]
      }
    ],

    // -------------------------------------------------------------------------
    // PATHWAY T1 CLINICS (20 Questions Total)
    // -------------------------------------------------------------------------
    t1: [
      {
        id: 't1_c1',
        title: 'Clinic 1: Equivalence Proofs & Logic Statements',
        subtitle: 'Reviewing subtle comparisons and inequality proofs',
        icon: '🔍',
        questions: [
          // Q1
          {
            id: 't1_c1_q1',
            concept: 'Fraction Inequalities and Equivalence Proofs',
            prompt: `Which of the following statements about fraction addition is <strong>FALSE</strong>?`,
            visualAid: { type: 'golden-rule-wall', origNum: 1, origDen: 5, scale: 1, targetNum: 2, targetDen: 5 },
            options: [
              { id: 'A', text: `${renderFrac(1, 5)} <span class="math-op">+</span> ${renderFrac(2, 5)} <span class="math-op">&lt;</span> ${renderFrac(3, 5)}`, isCorrect: true, trap: 'This statement claims that 1/5 + 2/5 is LESS THAN 3/5. But 1/5 + 2/5 IS EXACTLY 3/5! So this statement is FALSE (which is the correct answer).' },
              { id: 'B', text: `${renderFrac(1, 4)} <span class="math-op">+</span> ${renderFrac(3, 8)} <span class="math-eq">=</span> ${renderFrac(5, 8)}`, isCorrect: false, trap: 'This is a TRUE statement (2/8 + 3/8 = 5/8).' },
              { id: 'C', text: `${renderMixed(1, 7, 10)} <span class="math-op">+</span> ${renderFrac(3, 10)} <span class="math-eq">=</span> 2`, isCorrect: false, trap: 'This is a TRUE statement (1 + 10/10 = 2).' },
              { id: 'D', text: `${renderMixed(6, 8, 100)} <span class="math-eq">=</span> 6.08`, isCorrect: false, trap: 'This is a TRUE statement (8 hundredths has a 0 tenths placeholder).' }
            ],
            explanation: {
              trapText: '1/5 + 2/5 = 3/5, so claiming it is "< 3/5" is mathematically false.',
              solutionText: `${renderFrac(1, 5)} + ${renderFrac(2, 5)} = ${renderFrac(3, 5)}, which is EQUAL to ${renderFrac(3, 5)}. Statement A is false.`,
              visualType: 'golden-rule-wall',
              visualConfig: { origNum: 1, origDen: 5, scale: 1, targetNum: 2, targetDen: 5 }
            },
            parallelVariation: {
              id: 't1_c1_q1_var',
              concept: 'Inequality Logic Proofs (Practice Variation)',
              prompt: `Which comparison statement is mathematically <strong>TRUE</strong>?`,
              visualAid: { type: 'golden-rule-wall', origNum: 3, origDen: 8, scale: 1, targetNum: 2, targetDen: 8 },
              options: [
                { id: 'A', text: `${renderFrac(3, 8)} <span class="math-op">+</span> ${renderFrac(2, 8)} <span class="math-op">&gt;</span> ${renderFrac(5, 8)}`, isCorrect: false, trap: '3/8 + 2/8 is equal to 5/8, not greater.' },
                { id: 'B', text: `${renderFrac(3, 8)} <span class="math-op">+</span> ${renderFrac(2, 8)} <span class="math-eq">=</span> ${renderFrac(5, 8)}`, isCorrect: true },
                { id: 'C', text: `${renderFrac(3, 8)} <span class="math-op">+</span> ${renderFrac(2, 8)} <span class="math-op">&lt;</span> ${renderFrac(4, 8)}`, isCorrect: false, trap: '5/8 is greater than 4/8.' },
                { id: 'D', text: `${renderFrac(3, 8)} <span class="math-op">+</span> ${renderFrac(2, 8)} <span class="math-eq">=</span> ${renderFrac(5, 16)}`, isCorrect: false, trap: 'Denominators are never added!' }
              ],
              explanation: {
                trapText: '3 eighths + 2 eighths = 5 eighths exactly.',
                solutionText: `Statement B is the true statement: 3/8 + 2/8 = <strong>5/8</strong>.`,
                visualType: 'golden-rule-wall',
                visualConfig: { origNum: 3, origDen: 8, scale: 1, targetNum: 2, targetDen: 8 }
              }
            }
          },

          // Q2
          {
            id: 't1_c1_q2',
            concept: 'Diagnosing Equivalent Fraction Logic Errors',
            prompt: `Sam says that ${renderFrac(1, 3)} is equivalent to ${renderFrac(2, 4)} because he added 1 to both the numerator and denominator. Why is Sam's mathematical reasoning incorrect?`,
            visualAid: { type: 'golden-rule-wall', origNum: 1, origDen: 3, scale: 2, targetNum: 2, targetDen: 6 },
            options: [
              { id: 'A', text: 'Sam should have subtracted 1 instead of adding', isCorrect: false, trap: 'Subtracting also changes the fraction value! You must MULTIPLY.' },
              { id: 'B', text: 'Equivalent fractions require MULTIPLYING top and bottom by the same number, not adding', isCorrect: true },
              { id: 'C', text: 'Sam should have only added to the denominator', isCorrect: false, trap: 'Adding to only one number breaks proportion.' },
              { id: 'D', text: 'Sam is actually correct; 1/3 does equal 2/4', isCorrect: false, trap: '1/3 is about 0.33, while 2/4 is 0.5 (half).' }
            ],
            explanation: {
              trapText: 'Adding to numerator and denominator changes the slice proportions. You must multiply (e.g. 1/3 × 2/2 = 2/6).',
              solutionText: `To maintain equivalence, you must <strong>multiply</strong> both numerator and denominator by the same scaling factor.`,
              visualType: 'golden-rule-wall',
              visualConfig: { origNum: 1, origDen: 3, scale: 2, targetNum: 2, targetDen: 6 }
            },
            parallelVariation: {
              id: 't1_c1_q2_var',
              concept: 'Diagnosing Logic Errors (Practice Variation)',
              prompt: `Why is ${renderFrac(2, 5)} <strong>NOT</strong> equal to ${renderFrac(3, 6)}?`,
              visualAid: { type: 'golden-rule-wall', origNum: 2, origDen: 5, scale: 2, targetNum: 4, targetDen: 10 },
              options: [
                { id: 'A', text: 'Because adding 1 to top and bottom changes the value (2/5 = 0.4, but 3/6 = 0.5)', isCorrect: true },
                { id: 'B', text: 'Because you must add 2 instead of 1', isCorrect: false, trap: 'Adding any number changes the fraction value.' },
                { id: 'C', text: 'They are equal', isCorrect: false, trap: '2/5 is 0.4; 3/6 is 0.5.' },
                { id: 'D', text: 'Because 6 is not a multiple of 5', isCorrect: false, trap: 'Even if multiples match, adding breaks equivalence.' }
              ],
              explanation: {
                trapText: 'Adding changes proportion: 2/5 = 0.40, while 3/6 = 0.50.',
                solutionText: `Adding 1 to top and bottom does not create an equivalent fraction.`,
                visualType: 'golden-rule-wall',
                visualConfig: { origNum: 2, origDen: 5, scale: 2, targetNum: 4, targetDen: 10 }
              }
            }
          },

          // Q3
          {
            id: 't1_c1_q3',
            concept: 'Calculator Conversion Operation',
            prompt: `To convert the fraction ${renderFrac(43, 100)} to a decimal on a calculator, which key sequence is correct?`,
            visualAid: { type: 'place-value-grid', whole: 0, tenths: 4, hundredths: 3, compareTenths: 0 },
            options: [
              { id: 'A', text: '100 ÷ 43', isCorrect: false, trap: 'This inverts the division and calculates 100 divided by 43 (approx 2.32)!' },
              { id: 'B', text: '43 ÷ 100', isCorrect: true },
              { id: 'C', text: '43 × 100', isCorrect: false, trap: 'Multiplication gives 4300.' },
              { id: 'D', text: '43 − 100', isCorrect: false, trap: 'A fraction bar means division, not subtraction.' }
            ],
            explanation: {
              trapText: 'The fraction bar means "divided by". Numerator ÷ Denominator = 43 ÷ 100 = 0.43.',
              solutionText: `Always enter <strong>Numerator ÷ Denominator</strong>: 43 ÷ 100 = <strong>0.43</strong>.`,
              visualType: 'place-value-grid',
              visualConfig: { whole: 0, tenths: 4, hundredths: 3, compareTenths: 0 }
            },
            parallelVariation: {
              id: 't1_c1_q3_var',
              concept: 'Calculator Division (Practice Variation)',
              prompt: `To calculate ${renderFrac(7, 8)} as a decimal, what do you enter?`,
              visualAid: { type: 'golden-rule-wall', origNum: 7, origDen: 8, scale: 1, targetNum: 7, targetDen: 8 },
              options: [
                { id: 'A', text: '7 ÷ 8', isCorrect: true },
                { id: 'B', text: '8 ÷ 7', isCorrect: false, trap: 'Numerator must be divided by denominator.' },
                { id: 'C', text: '7 × 8', isCorrect: false, trap: 'Fraction bar means division.' },
                { id: 'D', text: '8 − 7', isCorrect: false, trap: 'Not subtraction.' }
              ],
              explanation: {
                trapText: 'Numerator ÷ Denominator = 7 ÷ 8 = 0.875.',
                solutionText: `Enter <strong>7 ÷ 8</strong>.`,
                visualType: 'golden-rule-wall',
                visualConfig: { origNum: 7, origDen: 8, scale: 1, targetNum: 7, targetDen: 8 }
              }
            }
          },

          // Q4
          {
            id: 't1_c1_q4',
            concept: 'Ordering Fractions Smallest to Largest',
            prompt: `Which list shows the fractions ordered correctly from <strong>smallest to largest</strong>?`,
            visualAid: { type: 'golden-rule-wall', origNum: 1, origDen: 8, scale: 1, targetNum: 6, targetDen: 8 },
            options: [
              { id: 'A', text: `${renderFrac(3, 4)}, ${renderFrac(1, 2)}, ${renderFrac(3, 8)}, ${renderFrac(1, 8)}`, isCorrect: false, trap: 'This is reverse order (largest to smallest)!' },
              { id: 'B', text: `${renderFrac(1, 8)}, ${renderFrac(3, 8)}, ${renderFrac(1, 2)}, ${renderFrac(3, 4)}`, isCorrect: true },
              { id: 'C', text: `${renderFrac(1, 8)}, ${renderFrac(1, 2)}, ${renderFrac(3, 8)}, ${renderFrac(3, 4)}`, isCorrect: false, trap: '1/2 (4/8) is larger than 3/8.' },
              { id: 'D', text: `${renderFrac(3, 8)}, ${renderFrac(1, 8)}, ${renderFrac(1, 2)}, ${renderFrac(3, 4)}`, isCorrect: false, trap: '1/8 is smaller than 3/8.' }
            ],
            explanation: {
              trapText: 'Convert all to eighths: 1/8 (1/8), 3/8 (3/8), 1/2 (4/8), 3/4 (6/8).',
              solutionText: `In order: <strong>${renderFrac(1, 8)} &lt; ${renderFrac(3, 8)} &lt; ${renderFrac(1, 2)} &lt; ${renderFrac(3, 4)}</strong>.`,
              visualType: 'golden-rule-wall',
              visualConfig: { origNum: 1, origDen: 8, scale: 1, targetNum: 6, targetDen: 8 }
            },
            parallelVariation: {
              id: 't1_c1_q4_var',
              concept: 'Ordering Fractions Tenths (Practice Variation)',
              prompt: `Which list orders fractions from <strong>smallest to largest</strong>?`,
              visualAid: { type: 'golden-rule-wall', origNum: 1, origDen: 10, scale: 1, targetNum: 9, targetDen: 10 },
              options: [
                { id: 'A', text: `${renderFrac(1, 10)}, ${renderFrac(2, 5)}, ${renderFrac(1, 2)}, ${renderFrac(9, 10)}`, isCorrect: true },
                { id: 'B', text: `${renderFrac(9, 10)}, ${renderFrac(1, 2)}, ${renderFrac(2, 5)}, ${renderFrac(1, 10)}`, isCorrect: false, trap: 'This is largest to smallest.' },
                { id: 'C', text: `${renderFrac(1, 10)}, ${renderFrac(1, 2)}, ${renderFrac(2, 5)}, ${renderFrac(9, 10)}`, isCorrect: false, trap: '2/5 (4/10) is smaller than 1/2 (5/10).' },
                { id: 'D', text: `${renderFrac(2, 5)}, ${renderFrac(1, 10)}, ${renderFrac(1, 2)}, ${renderFrac(9, 10)}`, isCorrect: false, trap: '1/10 is the smallest.' }
              ],
              explanation: {
                trapText: 'Convert to tenths: 1/10, 4/10 (2/5), 5/10 (1/2), 9/10.',
                solutionText: `Order: <strong>${renderFrac(1, 10)}, ${renderFrac(2, 5)}, ${renderFrac(1, 2)}, ${renderFrac(9, 10)}</strong>.`,
                visualType: 'golden-rule-wall',
                visualConfig: { origNum: 1, origDen: 10, scale: 1, targetNum: 9, targetDen: 10 }
              }
            }
          },

          // Q5
          {
            id: 't1_c1_q5',
            concept: 'Equivalence Multiplier Verification',
            prompt: `What common factor was multiplied to both top and bottom to create ${renderFrac(3, 5)} <span class="math-eq">=</span> ${renderFrac(9, 15)}?`,
            visualAid: { type: 'golden-rule-wall', origNum: 3, origDen: 5, scale: 3, targetNum: 9, targetDen: 15 },
            options: [
              { id: 'A', text: '5', isCorrect: false, trap: '3 × 5 = 15, not 9.' },
              { id: 'B', text: '3', isCorrect: true },
              { id: 'C', text: '6', isCorrect: false, trap: '3 × 6 = 18.' },
              { id: 'D', text: '9', isCorrect: false, trap: '3 × 9 = 27.' }
            ],
            explanation: {
              trapText: '9 ÷ 3 = 3 and 15 ÷ 5 = 3.',
              solutionText: `The multiplier is <strong>3</strong>: ${renderFrac('3 × 3', '5 × 3')} = ${renderFrac(9, 15)}.`,
              visualType: 'golden-rule-wall',
              visualConfig: { origNum: 3, origDen: 5, scale: 3, targetNum: 9, targetDen: 15 }
            },
            parallelVariation: {
              id: 't1_c1_q5_var',
              concept: 'Multiplier Verification (Practice Variation)',
              prompt: `What multiplier was used to turn ${renderFrac(2, 7)} into ${renderFrac(8, 28)}?`,
              visualAid: { type: 'golden-rule-wall', origNum: 2, origDen: 7, scale: 4, targetNum: 8, targetDen: 28 },
              options: [
                { id: 'A', text: '4', isCorrect: true },
                { id: 'B', text: '6', isCorrect: false, trap: '2 × 6 = 12.' },
                { id: 'C', text: '7', isCorrect: false, trap: '2 × 7 = 14.' },
                { id: 'D', text: '8', isCorrect: false, trap: '2 × 8 = 16.' }
              ],
              explanation: {
                trapText: '8 ÷ 2 = 4 and 28 ÷ 7 = 4.',
                solutionText: `The multiplier is <strong>4</strong>.`,
                visualType: 'golden-rule-wall',
                visualConfig: { origNum: 2, origDen: 7, scale: 4, targetNum: 8, targetDen: 28 }
              }
            }
          }
        ]
      },

      // -----------------------------------------------------------------------
      // T1 CLINIC 2: MULTI-STEP 3-FRACTION EXPRESSIONS (5 Questions)
      // -----------------------------------------------------------------------
      {
        id: 't1_c2',
        title: 'Clinic 2: Multi-Step 3-Fraction Expressions',
        subtitle: 'Solving multi-part fraction operations from 1 whole unit',
        icon: '📐',
        questions: [
          // Q1
          {
            id: 't1_c2_q1',
            concept: 'Subtracting 2 Fractions from 1 Whole',
            prompt: `A sheet of paper represents 1 whole unit (${renderFrac(10, 10)}). An artist cuts away ${renderFrac(4, 10)} for a collage and ${renderFrac(3, 10)} for a border. What fraction of the original paper remains?`,
            visualAid: { type: 'fraction-bar-rename', whole: 0, part1: 4, part2: 3, den: 10 },
            options: [
              { id: 'A', text: renderFrac(7, 10), isCorrect: false, trap: '7/10 is the amount of paper CUT AWAY (4/10 + 3/10). The question asked for what REMAINS (10/10 - 7/10)!' },
              { id: 'B', text: renderFrac(3, 10), isCorrect: true },
              { id: 'C', text: renderFrac(4, 10), isCorrect: false, trap: '10/10 - 4/10 - 3/10 leaves 3/10, not 4/10.' },
              { id: 'D', text: renderFrac(1, 10), isCorrect: false, trap: '10 - 4 - 3 = 3.' }
            ],
            explanation: {
              trapText: 'Total used: 4/10 + 3/10 = 7/10. Remaining: 10/10 - 7/10 = 3/10.',
              solutionText: `Paper remaining = <strong>${renderFrac(3, 10)}</strong>.`,
              visualType: 'fraction-bar-rename',
              visualConfig: { whole: 0, part1: 4, part2: 3, den: 10 }
            },
            parallelVariation: {
              id: 't1_c2_q1_var',
              concept: 'Multi-Step Subtraction Eighths (Practice Variation)',
              prompt: `A timber plank is 1 whole metre (${renderFrac(8, 8)}). A builder cuts off ${renderFrac(3, 8)}\\text{ m} and then another ${renderFrac(2, 8)}\\text{ m}. What fraction of the plank is left?`,
              visualAid: { type: 'fraction-bar-rename', whole: 0, part1: 3, part2: 2, den: 8 },
              options: [
                { id: 'A', text: renderFrac(5, 8), isCorrect: false, trap: '5/8 was cut off in total. 8/8 - 5/8 = 3/8 left!' },
                { id: 'B', text: renderFrac(3, 8), isCorrect: true },
                { id: 'C', text: renderFrac(2, 8), isCorrect: false, trap: '8 - 3 - 2 = 3 eighths.' },
                { id: 'D', text: renderFrac(1, 8), isCorrect: false, trap: '8 - 5 = 3.' }
              ],
              explanation: {
                trapText: 'Subtract the total cuts (5/8) from 1 whole (8/8).',
                solutionText: `8/8 - 5/8 = <strong>${renderFrac(3, 8)}</strong> m.`,
                visualType: 'fraction-bar-rename',
                visualConfig: { whole: 0, part1: 3, part2: 2, den: 8 }
              }
            }
          },

          // Q2
          {
            id: 't1_c2_q2',
            concept: 'Sequential Eighths Subtraction with Simplification',
            prompt: `Calculate in simplest form: ${renderFrac(7, 8)} <span class="math-op">−</span> ${renderFrac(2, 8)} <span class="math-op">−</span> ${renderFrac(1, 8)}`,
            visualAid: { type: 'fraction-bar-rename', whole: 0, part1: 4, part2: 0, den: 8 },
            options: [
              { id: 'A', text: renderFrac(4, 8), isCorrect: false, trap: '4/8 is numerically correct, but can be simplified by dividing by 4 to get 1/2!' },
              { id: 'B', text: renderFrac(1, 2), isCorrect: true },
              { id: 'C', text: renderFrac(3, 8), isCorrect: false, trap: '7 - 2 - 1 = 4 eighths.' },
              { id: 'D', text: renderFrac(5, 8), isCorrect: false, trap: 'Remember to subtract both fractions.' }
            ],
            explanation: {
              trapText: '7/8 - 2/8 - 1/8 = 4/8. Simplify 4/8 = 1/2.',
              solutionText: `4/8 simplifies to <strong>${renderFrac(1, 2)}</strong>.`,
              visualType: 'fraction-bar-rename',
              visualConfig: { whole: 0, part1: 4, part2: 0, den: 8 }
            },
            parallelVariation: {
              id: 't1_c2_q2_var',
              concept: 'Sequential Tenths Subtraction (Practice Variation)',
              prompt: `Calculate in simplest form: ${renderFrac(9, 10)} <span class="math-op">−</span> ${renderFrac(3, 10)} <span class="math-op">−</span> ${renderFrac(2, 10)}`,
              visualAid: { type: 'fraction-bar-rename', whole: 0, part1: 4, part2: 0, den: 10 },
              options: [
                { id: 'A', text: renderFrac(2, 5), isCorrect: true },
                { id: 'B', text: renderFrac(4, 10), isCorrect: false, trap: 'Simplify 4/10 by dividing by 2 = 2/5.' },
                { id: 'C', text: renderFrac(5, 10), isCorrect: false, trap: '9 - 3 - 2 = 4 tenths.' },
                { id: 'D', text: renderFrac(1, 2), isCorrect: false, trap: '4/10 is not 1/2 (5/10).' }
              ],
              explanation: {
                trapText: '9/10 - 3/10 - 2/10 = 4/10. Divide by 2 = 2/5.',
                solutionText: `4/10 = <strong>${renderFrac(2, 5)}</strong>.`,
                visualType: 'fraction-bar-rename',
                visualConfig: { whole: 0, part1: 4, part2: 0, den: 10 }
              }
            }
          },

          // Q3
          {
            id: 't1_c2_q3',
            concept: 'Subtracting Multiple Quarters from Mixed Number',
            prompt: `Calculate: ${renderMixed(1, 1, 2)} <span class="math-op">−</span> ${renderFrac(1, 4)} <span class="math-op">−</span> ${renderFrac(1, 4)}`,
            visualAid: { type: 'fraction-bar-rename', whole: 1, part1: 0, part2: 0, den: 4 },
            options: [
              { id: 'A', text: '1', isCorrect: true },
              { id: 'B', text: renderMixed(1, 1, 4), isCorrect: false, trap: '1/4 + 1/4 = 2/4 = 1/2. 1 and 1/2 - 1/2 = 1.' },
              { id: 'C', text: renderFrac(3, 4), isCorrect: false, trap: 'Remember the whole unit.' },
              { id: 'D', text: renderMixed(1, 1, 2), isCorrect: false, trap: 'Subtract both quarters.' }
            ],
            explanation: {
              trapText: '1/4 + 1/4 = 2/4 = 1/2. Taking 1/2 away from 1 and 1/2 leaves exactly 1.',
              solutionText: `1 and 1/2 - 1/2 = <strong>1</strong>.`,
              visualType: 'fraction-bar-rename',
              visualConfig: { whole: 1, part1: 0, part2: 0, den: 4 }
            },
            parallelVariation: {
              id: 't1_c2_q3_var',
              concept: 'Subtracting Parts from 2 Wholes (Practice Variation)',
              prompt: `Calculate: 2 <span class="math-op">−</span> ${renderFrac(1, 2)} <span class="math-op">−</span> ${renderFrac(1, 4)}`,
              visualAid: { type: 'fraction-bar-rename', whole: 1, part1: 1, part2: 0, den: 4 },
              options: [
                { id: 'A', text: renderMixed(1, 1, 4), isCorrect: true },
                { id: 'B', text: renderMixed(1, 3, 4), isCorrect: false, trap: '2 - 1/2 = 1 and 1/2 (1 and 2/4). 1 and 2/4 - 1/4 = 1 and 1/4.' },
                { id: 'C', text: renderFrac(3, 4), isCorrect: false, trap: 'Remember the 1 remaining whole.' },
                { id: 'D', text: renderMixed(1, 1, 2), isCorrect: false, trap: 'You must subtract the 1/4 as well.' }
              ],
              explanation: {
                trapText: '2 - 1/2 = 1 and 2/4. 1 and 2/4 - 1/4 = 1 and 1/4.',
                solutionText: `2 - 1/2 - 1/4 = <strong>${renderMixed(1, 1, 4)}</strong>.`,
                visualType: 'fraction-bar-rename',
                visualConfig: { whole: 1, part1: 1, part2: 0, den: 4 }
              }
            }
          },

          // Q4
          {
            id: 't1_c2_q4',
            concept: 'Subtracting Related Fractions from 1 Whole',
            prompt: `Calculate: 1 <span class="math-op">−</span> ${renderFrac(1, 4)} <span class="math-op">−</span> ${renderFrac(3, 8)}`,
            visualAid: { type: 'golden-rule-wall', origNum: 1, origDen: 4, scale: 2, targetNum: 3, targetDen: 8 },
            options: [
              { id: 'A', text: renderFrac(3, 8), isCorrect: true },
              { id: 'B', text: renderFrac(4, 8), isCorrect: false, trap: '1/4 is 2/8. 8/8 - 2/8 - 3/8 = 3/8.' },
              { id: 'C', text: renderFrac(5, 8), isCorrect: false, trap: '5/8 is total subtracted (2/8 + 3/8). 8/8 - 5/8 = 3/8.' },
              { id: 'D', text: renderFrac(2, 8), isCorrect: false, trap: 'Check: 8 - 2 - 3 = 3.' }
            ],
            explanation: {
              trapText: 'Convert all to eighths: 8/8 - 2/8 - 3/8 = 3/8.',
              solutionText: `1 - 1/4 - 3/8 = 8/8 - 5/8 = <strong>${renderFrac(3, 8)}</strong>.`,
              visualType: 'golden-rule-wall',
              visualConfig: { origNum: 1, origDen: 4, scale: 2, targetNum: 3, targetDen: 8 }
            },
            parallelVariation: {
              id: 't1_c2_q4_var',
              concept: 'Subtracting Fifths and Tenths from 1 (Practice Variation)',
              prompt: `Calculate: 1 <span class="math-op">−</span> ${renderFrac(2, 5)} <span class="math-op">−</span> ${renderFrac(3, 10)}`,
              visualAid: { type: 'golden-rule-wall', origNum: 2, origDen: 5, scale: 2, targetNum: 3, targetDen: 10 },
              options: [
                { id: 'A', text: renderFrac(3, 10), isCorrect: true },
                { id: 'B', text: renderFrac(7, 10), isCorrect: false, trap: '7/10 is total subtracted. 10/10 - 7/10 = 3/10.' },
                { id: 'C', text: renderFrac(4, 10), isCorrect: false, trap: '2/5 = 4/10. 10 - 4 - 3 = 3 tenths.' },
                { id: 'D', text: renderFrac(1, 5), isCorrect: false, trap: '3/10 is the remainder.' }
              ],
              explanation: {
                trapText: '10/10 - 4/10 - 3/10 = 3/10.',
                solutionText: `1 - 2/5 - 3/10 = <strong>${renderFrac(3, 10)}</strong>.`,
                visualType: 'golden-rule-wall',
                visualConfig: { origNum: 2, origDen: 5, scale: 2, targetNum: 3, targetDen: 10 }
              }
            }
          },

          // Q5
          {
            id: 't1_c2_q5',
            concept: 'Sum of 3 Related Fractions',
            prompt: `Calculate: ${renderFrac(2, 5)} <span class="math-op">+</span> ${renderFrac(1, 5)} <span class="math-op">+</span> ${renderFrac(1, 10)}`,
            visualAid: { type: 'golden-rule-wall', origNum: 3, origDen: 5, scale: 2, targetNum: 1, targetDen: 10 },
            options: [
              { id: 'A', text: renderFrac(4, 20), isCorrect: false, trap: 'Never add denominators.' },
              { id: 'B', text: renderFrac(7, 10), isCorrect: true },
              { id: 'C', text: renderFrac(6, 10), isCorrect: false, trap: '2/5 + 1/5 = 3/5 = 6/10; 6/10 + 1/10 = 7/10.' },
              { id: 'D', text: renderFrac(4, 10), isCorrect: false, trap: '2/5 is 4/10; 4 + 2 + 1 = 7 tenths.' }
            ],
            explanation: {
              trapText: '2/5 + 1/5 = 3/5 = 6/10. 6/10 + 1/10 = 7/10.',
              solutionText: `Total = <strong>${renderFrac(7, 10)}</strong>.`,
              visualType: 'golden-rule-wall',
              visualConfig: { origNum: 3, origDen: 5, scale: 2, targetNum: 1, targetDen: 10 }
            },
            parallelVariation: {
              id: 't1_c2_q5_var',
              concept: 'Sum of 3 Fractions (Practice Variation)',
              prompt: `Calculate in simplest form: ${renderFrac(1, 8)} <span class="math-op">+</span> ${renderFrac(3, 8)} <span class="math-op">+</span> ${renderFrac(1, 4)}`,
              visualAid: { type: 'golden-rule-wall', origNum: 1, origDen: 4, scale: 2, targetNum: 4, targetDen: 8 },
              options: [
                { id: 'A', text: renderFrac(3, 4), isCorrect: true },
                { id: 'B', text: renderFrac(6, 8), isCorrect: false, trap: '6/8 simplifies to 3/4.' },
                { id: 'C', text: renderFrac(5, 8), isCorrect: false, trap: '1/4 is 2/8. 1/8 + 3/8 + 2/8 = 6/8 = 3/4.' },
                { id: 'D', text: renderFrac(5, 20), isCorrect: false, trap: 'Never add denominators.' }
              ],
              explanation: {
                trapText: '1/8 + 3/8 + 2/8 = 6/8. Divide by 2 = 3/4.',
                solutionText: `Total = <strong>${renderFrac(3, 4)}</strong>.`,
                visualType: 'golden-rule-wall',
                visualConfig: { origNum: 1, origDen: 4, scale: 2, targetNum: 4, targetDen: 8 }
              }
            }
          }
        ]
      },

      // -----------------------------------------------------------------------
      // T1 CLINIC 3: ADVANCED CAPACITY WORD PROBLEMS (5 Questions)
      // -----------------------------------------------------------------------
      {
        id: 't1_c3',
        title: 'Clinic 3: Advanced Capacity Word Problems',
        subtitle: 'Multi-step real-world capacity and measurement reasoning',
        icon: '🧪',
        questions: [
          // Q1
          {
            id: 't1_c3_q1',
            concept: 'Jug Volume Subtraction',
            prompt: `A water jug contains 2 litres of juice. If Mia pours out ${renderFrac(3, 4)} litre into a glass, exactly how much juice remains in the jug?`,
            visualAid: { type: 'fraction-bar-rename', whole: 1, part1: 4, part2: -3, den: 4 },
            options: [
              { id: 'A', text: '1 ' + renderFrac(3, 4) + ' litres', isCorrect: false, trap: '4/4 - 3/4 = 1/4 remaining with the 1 whole unit.' },
              { id: 'B', text: renderFrac(1, 4) + ' litre', isCorrect: false, trap: 'You forgot the 1 untouched whole litre!' },
              { id: 'C', text: '1 ' + renderFrac(1, 4) + ' litres', isCorrect: true },
              { id: 'D', text: '2 ' + renderFrac(1, 4) + ' litres', isCorrect: false, trap: 'Pouring out juice decreases the volume.' }
            ],
            explanation: {
              trapText: '2 litres = 1 litre + 4/4 litre. 1 and 4/4 - 3/4 = 1 and 1/4 litres.',
              solutionText: `Juice remaining = <strong>${renderMixed(1, 1, 4)} litres</strong>.`,
              visualType: 'fraction-bar-rename',
              visualConfig: { whole: 1, part1: 4, part2: -3, den: 4 }
            },
            parallelVariation: {
              id: 't1_c3_q1_var',
              concept: 'Oil Bottle Subtraction (Practice Variation)',
              prompt: `A bottle holds 3 litres of olive oil. A chef uses ${renderFrac(1, 4)} litre. How much oil remains?`,
              visualAid: { type: 'fraction-bar-rename', whole: 2, part1: 4, part2: -1, den: 4 },
              options: [
                { id: 'A', text: '2 ' + renderFrac(3, 4) + ' litres', isCorrect: true },
                { id: 'B', text: '2 ' + renderFrac(1, 4) + ' litres', isCorrect: false, trap: '4/4 - 1/4 = 3/4.' },
                { id: 'C', text: renderFrac(3, 4) + ' litre', isCorrect: false, trap: 'Remember the 2 untouched litres.' },
                { id: 'D', text: '3 ' + renderFrac(3, 4) + ' litres', isCorrect: false, trap: 'Volume must decrease.' }
              ],
              explanation: {
                trapText: '3 litres = 2 litres + 4/4 litre. 2 and 4/4 - 1/4 = 2 and 3/4 litres.',
                solutionText: `Oil remaining = <strong>${renderMixed(2, 3, 4)} litres</strong>.`,
                visualType: 'fraction-bar-rename',
                visualConfig: { whole: 2, part1: 4, part2: -1, den: 4 }
              }
            }
          },

          // Q2
          {
            id: 't1_c3_q2',
            concept: 'Recipe Scoop Calculation',
            prompt: `A bakery recipe requires ${renderMixed(2, 3, 4)} cups of sugar. If you only have a ${renderFrac(1, 4)}-cup scoop, how many scoops are needed?`,
            visualAid: { type: 'fraction-bar-rename', whole: 2, part1: 3, part2: 0, den: 4 },
            options: [
              { id: 'A', text: '6 scoops', isCorrect: false, trap: '2 cups = 8 scoops. 8 + 3 = 11 scoops.' },
              { id: 'B', text: '11 scoops', isCorrect: true },
              { id: 'C', text: '8 scoops', isCorrect: false, trap: '8 scoops is only 2 cups.' },
              { id: 'D', text: '14 scoops', isCorrect: false, trap: '(2 × 4) + 3 = 11.' }
            ],
            explanation: {
              trapText: '2 wholes × 4 = 8 quarters + 3 quarters = 11 quarters.',
              solutionText: `Total scoops needed = <strong>11 scoops</strong>.`,
              visualType: 'fraction-bar-rename',
              visualConfig: { whole: 2, part1: 3, part2: 0, den: 4 }
            },
            parallelVariation: {
              id: 't1_c3_q2_var',
              concept: 'Scoop Calculation (Practice Variation)',
              prompt: `A pancake mix needs ${renderMixed(1, 3, 4)} cups of milk. How many ${renderFrac(1, 4)}-cup scoops is this?`,
              visualAid: { type: 'fraction-bar-rename', whole: 1, part1: 3, part2: 0, den: 4 },
              options: [
                { id: 'A', text: '7 scoops', isCorrect: true },
                { id: 'B', text: '4 scoops', isCorrect: false, trap: '4 scoops is only 1 cup.' },
                { id: 'C', text: '5 scoops', isCorrect: false, trap: '(1 × 4) + 3 = 7.' },
                { id: 'D', text: '8 scoops', isCorrect: false, trap: '8 scoops is 2 cups.' }
              ],
              explanation: {
                trapText: '(1 × 4) + 3 = 7.',
                solutionText: `Total scoops = <strong>7 scoops</strong>.`,
                visualType: 'fraction-bar-rename',
                visualConfig: { whole: 1, part1: 3, part2: 0, den: 4 }
              }
            }
          },

          // Q3
          {
            id: 't1_c3_q3',
            concept: 'Multi-Cut Ribbon Remainder',
            prompt: `Liam has a 5-metre ribbon. He uses ${renderMixed(1, 1, 4)}\\text{ m} for a gift and ${renderMixed(2, 1, 4)}\\text{ m} for a banner. How much ribbon is left in simplest form?`,
            visualAid: { type: 'fraction-bar-rename', whole: 1, part1: 2, part2: 0, den: 4 },
            options: [
              { id: 'A', text: renderMixed(1, 2, 4) + ' metres', isCorrect: false, trap: '1 and 2/4 simplifies to 1 and 1/2 metres!' },
              { id: 'B', text: renderMixed(1, 1, 2) + ' metres', isCorrect: true },
              { id: 'C', text: renderMixed(2, 1, 2) + ' metres', isCorrect: false, trap: 'Total used is 3 and 1/2 m. 5 - 3 and 1/2 = 1 and 1/2 m.' },
              { id: 'D', text: renderFrac(1, 2) + ' metre', isCorrect: false, trap: 'Remember the 1 whole metre remaining.' }
            ],
            explanation: {
              trapText: 'Total used: 1 1/4 + 2 1/4 = 3 2/4 = 3 1/2 m. Remaining: 5 - 3 1/2 = 1 1/2 m.',
              solutionText: `Ribbon left = <strong>${renderMixed(1, 1, 2)} metres</strong>.`,
              visualType: 'fraction-bar-rename',
              visualConfig: { whole: 1, part1: 2, part2: 0, den: 4 }
            },
            parallelVariation: {
              id: 't1_c3_q3_var',
              concept: 'Multi-Cut Timber (Practice Variation)',
              prompt: `A carpenter has 4 metres of timber. She cuts off ${renderMixed(1, 3, 8)}\\text{ m} and ${renderMixed(1, 1, 8)}\\text{ m}. How much timber remains in simplest form?`,
              visualAid: { type: 'fraction-bar-rename', whole: 1, part1: 4, part2: 0, den: 8 },
              options: [
                { id: 'A', text: renderMixed(1, 1, 2) + ' metres', isCorrect: true },
                { id: 'B', text: renderMixed(1, 4, 8) + ' metres', isCorrect: false, trap: 'Simplify 4/8 to 1/2.' },
                { id: 'C', text: renderMixed(2, 1, 2) + ' metres', isCorrect: false, trap: 'Total cut is 2 and 4/8 = 2 and 1/2. 4 - 2 and 1/2 = 1 and 1/2.' },
                { id: 'D', text: renderFrac(1, 2) + ' metre', isCorrect: false, trap: 'Missing 1 whole metre.' }
              ],
              explanation: {
                trapText: 'Used: 2 and 4/8 = 2 1/2. Remaining: 4 - 2 1/2 = 1 1/2 m.',
                solutionText: `Timber left = <strong>${renderMixed(1, 1, 2)} metres</strong>.`,
                visualType: 'fraction-bar-rename',
                visualConfig: { whole: 1, part1: 4, part2: 0, den: 8 }
              }
            }
          },

          // Q4
          {
            id: 't1_c3_q4',
            concept: 'Fuel Tank Related Fraction Subtraction',
            prompt: `A car fuel tank is ${renderFrac(3, 4)} full. After a trip, ${renderFrac(3, 8)} of a tank is used. What fraction of the tank is still full?`,
            visualAid: { type: 'golden-rule-wall', origNum: 3, origDen: 4, scale: 2, targetNum: 3, targetDen: 8 },
            options: [
              { id: 'A', text: renderFrac(3, 8) + ' tank', isCorrect: true },
              { id: 'B', text: '0 tank (empty)', isCorrect: false, trap: '3/4 is 6/8. 6/8 - 3/8 = 3/8.' },
              { id: 'C', text: renderFrac(6, 8) + ' tank', isCorrect: false, trap: '6/8 is the starting fuel volume.' },
              { id: 'D', text: renderFrac(1, 4) + ' tank', isCorrect: false, trap: '6/8 - 3/8 = 3/8.' }
            ],
            explanation: {
              trapText: '3/4 = 6/8. 6/8 - 3/8 = 3/8 of a tank.',
              solutionText: `Fuel remaining = <strong>${renderFrac(3, 8)} tank</strong>.`,
              visualType: 'golden-rule-wall',
              visualConfig: { origNum: 3, origDen: 4, scale: 2, targetNum: 3, targetDen: 8 }
            },
            parallelVariation: {
              id: 't1_c3_q4_var',
              concept: 'Fuel Tank Fifths (Practice Variation)',
              prompt: `A fuel tank is ${renderFrac(4, 5)} full. A generator consumes ${renderFrac(3, 10)} of a tank. How much fuel remains in simplest form?`,
              visualAid: { type: 'golden-rule-wall', origNum: 4, origDen: 5, scale: 2, targetNum: 3, targetDen: 10 },
              options: [
                { id: 'A', text: renderFrac(1, 2) + ' tank', isCorrect: true },
                { id: 'B', text: renderFrac(5, 10) + ' tank', isCorrect: false, trap: '5/10 simplifies to 1/2.' },
                { id: 'C', text: renderFrac(1, 5) + ' tank', isCorrect: false, trap: '4/5 = 8/10; 8/10 - 3/10 = 5/10 = 1/2.' },
                { id: 'D', text: renderFrac(7, 10) + ' tank', isCorrect: false, trap: '8 - 3 = 5 tenths.' }
              ],
              explanation: {
                trapText: '4/5 = 8/10. 8/10 - 3/10 = 5/10 = 1/2.',
                solutionText: `Fuel left = <strong>${renderFrac(1, 2)} tank</strong>.`,
                visualType: 'golden-rule-wall',
                visualConfig: { origNum: 4, origDen: 5, scale: 2, targetNum: 3, targetDen: 10 }
              }
            }
          },

          // Q5
          {
            id: 't1_c3_q5',
            concept: 'Paint Mixture Total Volume',
            prompt: `An artist mixes ${renderFrac(1, 4)}\\text{ L} blue paint, ${renderFrac(3, 8)}\\text{ L} yellow paint, and ${renderFrac(1, 8)}\\text{ L} white paint. What is the total volume in simplest form?`,
            visualAid: { type: 'golden-rule-wall', origNum: 1, origDen: 4, scale: 2, targetNum: 4, targetDen: 8 },
            options: [
              { id: 'A', text: renderFrac(3, 4) + ' litre', isCorrect: true },
              { id: 'B', text: renderFrac(6, 8) + ' litre', isCorrect: false, trap: '6/8 simplifies by dividing by 2 to get 3/4 litre!' },
              { id: 'C', text: renderFrac(5, 8) + ' litre', isCorrect: false, trap: '1/4 is 2/8. 2/8 + 3/8 + 1/8 = 6/8 = 3/4.' },
              { id: 'D', text: '1 litre', isCorrect: false, trap: '6/8 is less than 1 whole.' }
            ],
            explanation: {
              trapText: '1/4 = 2/8. 2/8 + 3/8 + 1/8 = 6/8. Simplify 6/8 = 3/4.',
              solutionText: `Total volume = <strong>${renderFrac(3, 4)} litre</strong>.`,
              visualType: 'golden-rule-wall',
              visualConfig: { origNum: 1, origDen: 4, scale: 2, targetNum: 4, targetDen: 8 }
            },
            parallelVariation: {
              id: 't1_c3_q5_var',
              concept: 'Juice Mixture Volume (Practice Variation)',
              prompt: `A smoothie uses ${renderFrac(2, 5)}\\text{ L} orange juice, ${renderFrac(3, 10)}\\text{ L} mango juice, and ${renderFrac(1, 10)}\\text{ L} passionfruit juice. What is the total volume in simplest form?`,
              visualAid: { type: 'golden-rule-wall', origNum: 2, origDen: 5, scale: 2, targetNum: 4, targetDen: 10 },
              options: [
                { id: 'A', text: renderFrac(4, 5) + ' litre', isCorrect: true },
                { id: 'B', text: renderFrac(8, 10) + ' litre', isCorrect: false, trap: '8/10 simplifies to 4/5.' },
                { id: 'C', text: renderFrac(6, 10) + ' litre', isCorrect: false, trap: '2/5 is 4/10; 4 + 3 + 1 = 8 tenths.' },
                { id: 'D', text: '1 litre', isCorrect: false, trap: '8/10 is less than 1.' }
              ],
              explanation: {
                trapText: '2/5 = 4/10. 4/10 + 3/10 + 1/10 = 8/10 = 4/5 litre.',
                solutionText: `Total volume = <strong>${renderFrac(4, 5)} litre</strong>.`,
                visualType: 'golden-rule-wall',
                visualConfig: { origNum: 2, origDen: 5, scale: 2, targetNum: 4, targetDen: 10 }
              }
            }
          }
        ]
      },

      // -----------------------------------------------------------------------
      // T1 CLINIC 4: MULTI-FRACTION UNLIKE OPERATIONS (5 Questions)
      // -----------------------------------------------------------------------
      {
        id: 't1_c4',
        title: 'Clinic 4: 3-Fraction Expressions with Related Denominators',
        subtitle: 'Combining multiple unlike fractions with common denominators',
        icon: '🏆',
        questions: [
          // Q1
          {
            id: 't1_c4_q1',
            concept: '3-Fraction Unlike Subtraction',
            prompt: `Calculate the expression and simplify to lowest terms: ${renderFrac(7, 8)} <span class="math-op">−</span> ${renderFrac(1, 4)} <span class="math-op">−</span> ${renderFrac(1, 8)}`,
            visualAid: { type: 'golden-rule-wall', origNum: 1, origDen: 4, scale: 2, targetNum: 7, targetDen: 8 },
            options: [
              { id: 'A', text: renderFrac(4, 8), isCorrect: false, trap: '4/8 is correct before simplifying, but both 4 and 8 can be divided by 4 to get 1/2 in simplest form.' },
              { id: 'B', text: renderFrac(1, 2), isCorrect: true },
              { id: 'C', text: renderFrac(5, 8), isCorrect: false, trap: 'Did you forget to subtract the final 1/8?' },
              { id: 'D', text: renderFrac(3, 8), isCorrect: false, trap: '1/4 is 2/8. 7/8 - 2/8 - 1/8 = 4/8 = 1/2.' }
            ],
            explanation: {
              trapText: 'Convert 1/4 = 2/8. 7/8 - 2/8 - 1/8 = 4/8. Divide by 4 = 1/2.',
              solutionText: `Final simplified answer = <strong>${renderFrac(1, 2)}</strong>.`,
              visualType: 'golden-rule-wall',
              visualConfig: { origNum: 1, origDen: 4, scale: 2, targetNum: 7, targetDen: 8 }
            },
            parallelVariation: {
              id: 't1_c4_q1_var',
              concept: '3-Fraction Subtraction Tenths (Practice Variation)',
              prompt: `Calculate in simplest form: ${renderFrac(9, 10)} <span class="math-op">−</span> ${renderFrac(2, 5)} <span class="math-op">−</span> ${renderFrac(1, 10)}`,
              visualAid: { type: 'golden-rule-wall', origNum: 2, origDen: 5, scale: 2, targetNum: 9, targetDen: 10 },
              options: [
                { id: 'A', text: renderFrac(4, 10), isCorrect: false, trap: '4/10 can be simplified by dividing by 2.' },
                { id: 'B', text: renderFrac(2, 5), isCorrect: true },
                { id: 'C', text: renderFrac(6, 10), isCorrect: false, trap: '2/5 is 4/10. 9/10 - 4/10 - 1/10 = 4/10.' },
                { id: 'D', text: renderFrac(1, 2), isCorrect: false, trap: '4/10 is 2/5, not 1/2.' }
              ],
              explanation: {
                trapText: '2/5 = 4/10. 9/10 - 4/10 - 1/10 = 4/10 = 2/5.',
                solutionText: `Final answer = <strong>${renderFrac(2, 5)}</strong>.`,
                visualType: 'golden-rule-wall',
                visualConfig: { origNum: 2, origDen: 5, scale: 2, targetNum: 9, targetDen: 10 }
              }
            }
          },

          // Q2
          {
            id: 't1_c4_q2',
            concept: '3-Fraction Addition with Related Denominators',
            prompt: `Calculate in simplest form: ${renderFrac(1, 4)} <span class="math-op">+</span> ${renderFrac(3, 8)} <span class="math-op">+</span> ${renderFrac(1, 8)}`,
            visualAid: { type: 'golden-rule-wall', origNum: 1, origDen: 4, scale: 2, targetNum: 4, targetDen: 8 },
            options: [
              { id: 'A', text: renderFrac(6, 8), isCorrect: false, trap: 'Simplify 6/8 by dividing by 2 = 3/4.' },
              { id: 'B', text: renderFrac(3, 4), isCorrect: true },
              { id: 'C', text: renderFrac(5, 8), isCorrect: false, trap: '1/4 is 2/8. 2 + 3 + 1 = 6 eighths = 3/4.' },
              { id: 'D', text: renderFrac(5, 20), isCorrect: false, trap: 'Never add denominators.' }
            ],
            explanation: {
              trapText: '1/4 = 2/8. 2/8 + 3/8 + 1/8 = 6/8 = 3/4.',
              solutionText: `Sum = <strong>${renderFrac(3, 4)}</strong>.`,
              visualType: 'golden-rule-wall',
              visualConfig: { origNum: 1, origDen: 4, scale: 2, targetNum: 4, targetDen: 8 }
            },
            parallelVariation: {
              id: 't1_c4_q2_var',
              concept: '3-Fraction Addition Tenths (Practice Variation)',
              prompt: `Calculate: ${renderFrac(1, 5)} <span class="math-op">+</span> ${renderFrac(3, 10)} <span class="math-op">+</span> ${renderFrac(2, 10)}`,
              visualAid: { type: 'golden-rule-wall', origNum: 1, origDen: 5, scale: 2, targetNum: 5, targetDen: 10 },
              options: [
                { id: 'A', text: renderFrac(7, 10), isCorrect: true },
                { id: 'B', text: renderFrac(6, 10), isCorrect: false, trap: '1/5 is 2/10. 2 + 3 + 2 = 7 tenths.' },
                { id: 'C', text: renderFrac(6, 25), isCorrect: false, trap: 'Never add denominators.' },
                { id: 'D', text: renderFrac(4, 5), isCorrect: false, trap: '2 + 3 + 2 = 7 tenths.' }
              ],
              explanation: {
                trapText: '1/5 = 2/10. 2/10 + 3/10 + 2/10 = 7/10.',
                solutionText: `Sum = <strong>${renderFrac(7, 10)}</strong>.`,
                visualType: 'golden-rule-wall',
                visualConfig: { origNum: 1, origDen: 5, scale: 2, targetNum: 5, targetDen: 10 }
              }
            }
          },

          // Q3
          {
            id: 't1_c4_q3',
            concept: 'Mixed Number Addition with Related Denominators',
            prompt: `Calculate: ${renderMixed(1, 1, 4)} <span class="math-op">+</span> ${renderFrac(5, 8)}`,
            visualAid: { type: 'golden-rule-wall', origNum: 1, origDen: 4, scale: 2, targetNum: 5, targetDen: 8 },
            options: [
              { id: 'A', text: renderMixed(1, 7, 8), isCorrect: true },
              { id: 'B', text: renderMixed(1, 6, 8), isCorrect: false, trap: '1/4 is 2/8. 2/8 + 5/8 = 7/8.' },
              { id: 'C', text: renderMixed(1, 6, 12), isCorrect: false, trap: 'Never add denominators.' },
              { id: 'D', text: '2', isCorrect: false, trap: '1 and 7/8 is 1/8 short of 2.' }
            ],
            explanation: {
              trapText: '1/4 = 2/8. 1 and 2/8 + 5/8 = 1 and 7/8.',
              solutionText: `Sum = <strong>${renderMixed(1, 7, 8)}</strong>.`,
              visualType: 'golden-rule-wall',
              visualConfig: { origNum: 1, origDen: 4, scale: 2, targetNum: 5, targetDen: 8 }
            },
            parallelVariation: {
              id: 't1_c4_q3_var',
              concept: 'Mixed Addition Fifths and Tenths (Practice Variation)',
              prompt: `Calculate: ${renderMixed(2, 1, 5)} <span class="math-op">+</span> ${renderFrac(7, 10)}`,
              visualAid: { type: 'golden-rule-wall', origNum: 1, origDen: 5, scale: 2, targetNum: 7, targetDen: 10 },
              options: [
                { id: 'A', text: renderMixed(2, 9, 10), isCorrect: true },
                { id: 'B', text: renderMixed(2, 8, 10), isCorrect: false, trap: '1/5 is 2/10; 2/10 + 7/10 = 9/10.' },
                { id: 'C', text: '3', isCorrect: false, trap: '2 and 9/10 is less than 3.' },
                { id: 'D', text: renderMixed(2, 8, 15), isCorrect: false, trap: 'Do not add denominators.' }
              ],
              explanation: {
                trapText: '1/5 = 2/10. 2 and 2/10 + 7/10 = 2 and 9/10.',
                solutionText: `Sum = <strong>${renderMixed(2, 9, 10)}</strong>.`,
                visualType: 'golden-rule-wall',
                visualConfig: { origNum: 1, origDen: 5, scale: 2, targetNum: 7, targetDen: 10 }
              }
            }
          },

          // Q4
          {
            id: 't1_c4_q4',
            concept: 'Mixed Number Subtraction with Related Denominators',
            prompt: `Calculate: ${renderMixed(2, 3, 8)} <span class="math-op">−</span> ${renderFrac(1, 4)}`,
            visualAid: { type: 'golden-rule-wall', origNum: 1, origDen: 4, scale: 2, targetNum: 3, targetDen: 8 },
            options: [
              { id: 'A', text: renderMixed(2, 1, 8), isCorrect: true },
              { id: 'B', text: renderMixed(2, 2, 8), isCorrect: false, trap: '1/4 is 2/8. 3/8 - 2/8 = 1/8.' },
              { id: 'C', text: renderMixed(2, 2, 4), isCorrect: false, trap: 'Denominators stay eighths.' },
              { id: 'D', text: renderMixed(1, 7, 8), isCorrect: false, trap: '3/8 is larger than 2/8, so no regrouping from the 2 wholes is needed.' }
            ],
            explanation: {
              trapText: '1/4 = 2/8. 2 and 3/8 - 2/8 = 2 and 1/8.',
              solutionText: `Answer = <strong>${renderMixed(2, 1, 8)}</strong>.`,
              visualType: 'golden-rule-wall',
              visualConfig: { origNum: 1, origDen: 4, scale: 2, targetNum: 3, targetDen: 8 }
            },
            parallelVariation: {
              id: 't1_c4_q4_var',
              concept: 'Mixed Subtraction Tenths (Practice Variation)',
              prompt: `Calculate: ${renderMixed(3, 7, 10)} <span class="math-op">−</span> ${renderFrac(2, 5)}`,
              visualAid: { type: 'golden-rule-wall', origNum: 2, origDen: 5, scale: 2, targetNum: 7, targetDen: 10 },
              options: [
                { id: 'A', text: renderMixed(3, 3, 10), isCorrect: true },
                { id: 'B', text: renderMixed(3, 5, 10), isCorrect: false, trap: '2/5 is 4/10. 7/10 - 4/10 = 3/10.' },
                { id: 'C', text: renderMixed(3, 5, 5), isCorrect: false, trap: 'Denominators stay tenths.' },
                { id: 'D', text: renderMixed(2, 9, 10), isCorrect: false, trap: 'No borrowing needed: 7 tenths - 4 tenths = 3 tenths.' }
              ],
              explanation: {
                trapText: '2/5 = 4/10. 3 and 7/10 - 4/10 = 3 and 3/10.',
                solutionText: `Answer = <strong>${renderMixed(3, 3, 10)}</strong>.`,
                visualType: 'golden-rule-wall',
                visualConfig: { origNum: 2, origDen: 5, scale: 2, targetNum: 7, targetDen: 10 }
              }
            }
          },

          // Q5
          {
            id: 't1_c4_q5',
            concept: 'Mixed Operation with 3 Fractions',
            prompt: `Calculate: ${renderFrac(3, 4)} <span class="math-op">+</span> ${renderFrac(1, 8)} <span class="math-op">−</span> ${renderFrac(1, 2)}`,
            visualAid: { type: 'golden-rule-wall', origNum: 3, origDen: 4, scale: 2, targetNum: 1, targetDen: 8 },
            options: [
              { id: 'A', text: renderFrac(3, 8), isCorrect: true },
              { id: 'B', text: renderFrac(4, 8), isCorrect: false, trap: '3/4 = 6/8, 1/2 = 4/8. 6/8 + 1/8 = 7/8; 7/8 - 4/8 = 3/8.' },
              { id: 'C', text: renderFrac(5, 8), isCorrect: false, trap: 'Check: 6 + 1 - 4 = 3 eighths.' },
              { id: 'D', text: renderFrac(3, 10), isCorrect: false, trap: 'Denominators stay eighths.' }
            ],
            explanation: {
              trapText: 'Convert all to eighths: 6/8 + 1/8 - 4/8 = 3/8.',
              solutionText: `Final answer = <strong>${renderFrac(3, 8)}</strong>.`,
              visualType: 'golden-rule-wall',
              visualConfig: { origNum: 3, origDen: 4, scale: 2, targetNum: 1, targetDen: 8 }
            },
            parallelVariation: {
              id: 't1_c4_q5_var',
              concept: 'Mixed 3-Fraction Operation Tenths (Practice Variation)',
              prompt: `Calculate in simplest form: ${renderFrac(4, 5)} <span class="math-op">+</span> ${renderFrac(1, 10)} <span class="math-op">−</span> ${renderFrac(1, 2)}`,
              visualAid: { type: 'golden-rule-wall', origNum: 4, origDen: 5, scale: 2, targetNum: 1, targetDen: 10 },
              options: [
                { id: 'A', text: renderFrac(2, 5), isCorrect: true },
                { id: 'B', text: renderFrac(4, 10), isCorrect: false, trap: '4/10 simplifies by dividing by 2 = 2/5.' },
                { id: 'C', text: renderFrac(5, 10), isCorrect: false, trap: '8/10 + 1/10 = 9/10; 9/10 - 5/10 = 4/10 = 2/5.' },
                { id: 'D', text: renderFrac(3, 5), isCorrect: false, trap: '8 + 1 - 5 = 4 tenths = 2/5.' }
              ],
              explanation: {
                trapText: '8/10 + 1/10 - 5/10 = 4/10 = 2/5.',
                solutionText: `Final answer = <strong>${renderFrac(2, 5)}</strong>.`,
                visualType: 'golden-rule-wall',
                visualConfig: { origNum: 4, origDen: 5, scale: 2, targetNum: 1, targetDen: 10 }
              }
            }
          }
        ]
      }
    ]
  };

  // ---------------------------------------------------------------------------
  // 4. APPLICATION STATE MACHINE
  // ---------------------------------------------------------------------------
  const state = {
    currentUser: null,
    currentPathway: 't2',
    currentClinicIdx: 0,
    currentQuestionIdx: 0,
    isOnParallelRetry: false,
    currentActiveQuestion: null,
    sessionStartTime: null,
    telemetry: {
      firstTryCorrect: 0,
      remediatedCount: 0,
      totalAttempts: 0,
      misconceptionsTriggered: [],
      masteredConcepts: [],
      itemLog: []
    }
  };

  // ---------------------------------------------------------------------------
  // 5. DOM ELEMENTS CACHE
  // ---------------------------------------------------------------------------
  const DOM = {
    // Screens
    screenLogin: document.getElementById('screenLogin'),
    screenTierDashboard: document.getElementById('screenTierDashboard'),
    screenQuestionArena: document.getElementById('screenQuestionArena'),
    screenSummary: document.getElementById('screenSummary'),
    
    // Header
    headerUserStatus: document.getElementById('headerUserStatus'),
    studentTag: document.getElementById('studentTag'),
    studentIdDisplay: document.getElementById('studentIdDisplay'),
    btnSwitchUser: document.getElementById('btnSwitchUser'),
    btnTeacherView: document.getElementById('btnTeacherView'),
    
    // Login
    loginForm: document.getElementById('loginForm'),
    inputUsername: document.getElementById('inputUsername'),
    rosterGridAllStudents: document.getElementById('rosterGridAllStudents'),
    
    // Dashboard
    dashboardTierHeading: document.getElementById('dashboardTierHeading'),
    dashboardTierDesc: document.getElementById('dashboardTierDesc'),
    btnStartFullMission: document.getElementById('btnStartFullMission'),
    clinicModulesList: document.getElementById('clinicModulesList'),
    
    // Question Arena
    arenaCrumbTitle: document.getElementById('arenaCrumbTitle'),
    questionProgressFill: document.getElementById('questionProgressFill'),
    questionIndexBadge: document.getElementById('questionIndexBadge'),
    parallelVariationBadge: document.getElementById('parallelVariationBadge'),
    questionPromptText: document.getElementById('questionPromptText'),
    visualAidCanvas: document.getElementById('visualAidCanvas'),
    optionsGrid: document.getElementById('optionsGrid'),
    
    // Misconception Modal
    misconceptionModal: document.getElementById('misconceptionModal'),
    modalTrapExplanation: document.getElementById('modalTrapExplanation'),
    modalSolutionExplanation: document.getElementById('modalSolutionExplanation'),
    modalVisualAidCanvas: document.getElementById('modalVisualAidCanvas'),
    btnModalTryVariation: document.getElementById('btnModalTryVariation'),
    
    // Summary
    statMasteryRate: document.getElementById('statMasteryRate'),
    statFirstTry: document.getElementById('statFirstTry'),
    statRemediated: document.getElementById('statRemediated'),
    statTotalItems: document.getElementById('statTotalItems'),
    listMasteredConcepts: document.getElementById('listMasteredConcepts'),
    listRemediatedTraps: document.getElementById('listRemediatedTraps'),
    btnDownloadJson: document.getElementById('btnDownloadJson'),
    btnDownloadCsv: document.getElementById('btnDownloadCsv'),
    btnRestartMission: document.getElementById('btnRestartMission'),
    
    // Teacher Modal
    teacherModal: document.getElementById('teacherModal'),
    teacherSessionCount: document.getElementById('teacherSessionCount'),
    teacherTableBody: document.getElementById('teacherTableBody'),
    btnExportAllClassJson: document.getElementById('btnExportAllClassJson'),
    btnExportAllClassCsv: document.getElementById('btnExportAllClassCsv'),
    btnClearStorage: document.getElementById('btnClearStorage'),
    btnCloseTeacherModal: document.getElementById('btnCloseTeacherModal')
  };

  // ---------------------------------------------------------------------------
  // 6. INITIALISATION & ROSTER CHIP RENDERING
  // ---------------------------------------------------------------------------
  function init() {
    renderRosterChips();
    bindEvents();
    checkExistingSession();
  }

  function renderRosterChips() {
    DOM.rosterGridAllStudents.innerHTML = '';

    const studentsSorted = Object.values(ROSTER_DATABASE).sort((a, b) => a.id.localeCompare(b.id));

    studentsSorted.forEach(student => {
      const chip = document.createElement('div');
      chip.className = 'roster-chip';
      chip.innerHTML = `
        <span class="roster-chip-id">${student.id}</span>
        <div class="roster-chip-meta">
          <span>${student.name}</span>
        </div>
      `;
      chip.addEventListener('click', () => {
        loginStudent(student.id);
      });
      DOM.rosterGridAllStudents.appendChild(chip);
    });
  }

  function bindEvents() {
    DOM.loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const raw = DOM.inputUsername.value.trim().toLowerCase();
      if (raw) loginStudent(raw);
    });

    DOM.btnSwitchUser.addEventListener('click', () => {
      switchScreen('login');
      DOM.studentTag.classList.add('hidden');
      DOM.btnSwitchUser.classList.add('hidden');
      DOM.inputUsername.value = '';
    });

    DOM.btnStartFullMission.addEventListener('click', () => {
      startClinic(0);
    });

    DOM.btnModalTryVariation.addEventListener('click', () => {
      DOM.misconceptionModal.classList.add('hidden');
      // Load the parallel practice variation
      loadQuestion(state.currentClinicIdx, state.currentQuestionIdx, true);
    });

    DOM.btnDownloadJson.addEventListener('click', exportStudentJson);
    DOM.btnDownloadCsv.addEventListener('click', exportStudentCsv);
    DOM.btnRestartMission.addEventListener('click', () => {
      renderTierDashboard();
      switchScreen('dashboard');
    });

    // Teacher Hub Events
    DOM.btnTeacherView.addEventListener('click', openTeacherHub);
    DOM.btnCloseTeacherModal.addEventListener('click', () => {
      DOM.teacherModal.classList.add('hidden');
    });
    DOM.btnExportAllClassJson.addEventListener('click', exportAllClassJson);
    DOM.btnExportAllClassCsv.addEventListener('click', exportAllClassCsv);
    DOM.btnClearStorage.addEventListener('click', clearAllTelemetry);
  }

  function checkExistingSession() {
    const saved = localStorage.getItem('mcs_last_user');
    if (saved && ROSTER_DATABASE[saved]) {
      DOM.inputUsername.value = saved;
    }
  }

  // ---------------------------------------------------------------------------
  // 7. SCREEN SWITCHER & LOGIN HANDLER
  // ---------------------------------------------------------------------------
  function switchScreen(screenName) {
    DOM.screenLogin.classList.add('hidden');
    DOM.screenTierDashboard.classList.add('hidden');
    DOM.screenQuestionArena.classList.add('hidden');
    DOM.screenSummary.classList.add('hidden');

    if (screenName === 'login') DOM.screenLogin.classList.remove('hidden');
    if (screenName === 'dashboard') DOM.screenTierDashboard.classList.remove('hidden');
    if (screenName === 'arena') DOM.screenQuestionArena.classList.remove('hidden');
    if (screenName === 'summary') DOM.screenSummary.classList.remove('hidden');
  }

  function loginStudent(studentId) {
    let student = ROSTER_DATABASE[studentId];
    if (!student) {
      student = {
        id: studentId,
        pathway: 't2',
        name: studentId.toUpperCase()
      };
    }

    state.currentUser = student;
    state.currentPathway = student.pathway;
    state.sessionStartTime = new Date().toISOString();
    state.telemetry = {
      firstTryCorrect: 0,
      remediatedCount: 0,
      totalAttempts: 0,
      misconceptionsTriggered: [],
      masteredConcepts: [],
      itemLog: []
    };

    localStorage.setItem('mcs_last_user', student.id);

    DOM.studentIdDisplay.textContent = student.id;
    DOM.studentTag.classList.remove('hidden');
    DOM.btnSwitchUser.classList.remove('hidden');

    renderTierDashboard();
    switchScreen('dashboard');
  }

  // ---------------------------------------------------------------------------
  // 8. MISSION DASHBOARD RENDERING
  // ---------------------------------------------------------------------------
  function renderTierDashboard() {
    const student = state.currentUser;
    const clinics = PATHWAY_CLINICS[student.pathway] || PATHWAY_CLINICS.t2;

    DOM.dashboardTierHeading.textContent = `Welcome, ${student.name.split(' ')[0]}!`;
    DOM.dashboardTierDesc.textContent = 'Work through each clinic below to master your fraction and decimal skills.';

    DOM.clinicModulesList.innerHTML = '';

    clinics.forEach((clinic, idx) => {
      const card = document.createElement('div');
      card.className = 'clinic-card';
      card.innerHTML = `
        <div class="clinic-icon-circle">${clinic.icon}</div>
        <div class="clinic-details">
          <h3>${clinic.title}</h3>
          <p>${clinic.subtitle} &middot; <strong>${clinic.questions.length} Questions</strong></p>
        </div>
        <div class="clinic-badge-status status-pending">Start &rarr;</div>
      `;
      card.addEventListener('click', () => {
        startClinic(idx);
      });
      DOM.clinicModulesList.appendChild(card);
    });
  }

  // ---------------------------------------------------------------------------
  // 9. QUESTION ARENA & PRACTICE VARIATION ENGINE
  // ---------------------------------------------------------------------------
  function startClinic(clinicIdx) {
    state.currentClinicIdx = clinicIdx;
    state.currentQuestionIdx = 0;
    state.isOnParallelRetry = false;
    loadQuestion(clinicIdx, 0, false);
    switchScreen('arena');
  }

  function loadQuestion(clinicIdx, questionIdx, isParallel) {
    const clinics = PATHWAY_CLINICS[state.currentPathway] || PATHWAY_CLINICS.t2;
    const clinic = clinics[clinicIdx];
    const baseQuestion = clinic.questions[questionIdx];
    const q = isParallel ? baseQuestion.parallelVariation : baseQuestion;

    state.currentActiveQuestion = {
      base: baseQuestion,
      active: q,
      isParallel: isParallel
    };

    DOM.arenaCrumbTitle.textContent = clinic.title;
    
    // Overall progress calculation across all questions
    let totalQuestionsInMission = 0;
    let completedQuestionsCount = 0;
    clinics.forEach((c, cIdx) => {
      totalQuestionsInMission += c.questions.length;
      if (cIdx < clinicIdx) {
        completedQuestionsCount += c.questions.length;
      } else if (cIdx === clinicIdx) {
        completedQuestionsCount += questionIdx;
      }
    });

    const progressPct = ((completedQuestionsCount) / totalQuestionsInMission) * 100;
    DOM.questionProgressFill.style.width = `${progressPct}%`;
    DOM.questionIndexBadge.textContent = `Clinic ${clinicIdx + 1} of ${clinics.length} · Q ${questionIdx + 1} of ${clinic.questions.length}`;

    if (isParallel) {
      DOM.parallelVariationBadge.classList.remove('hidden');
    } else {
      DOM.parallelVariationBadge.classList.add('hidden');
    }

    // Render Question Prompt (with clean child-friendly typography)
    DOM.questionPromptText.innerHTML = q.prompt;

    // Render Embedded Visual Reasoning Aid
    renderVisualAidWidget(DOM.visualAidCanvas, q.visualAid);

    // Render Multiple Choice Options
    DOM.optionsGrid.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D'];

    q.options.forEach((opt, oIdx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'option-button';
      btn.innerHTML = `
        <span class="option-letter">${letters[oIdx]}</span>
        <span class="option-content">${opt.text}</span>
      `;
      btn.addEventListener('click', () => {
        handleOptionSelection(opt);
      });
      DOM.optionsGrid.appendChild(btn);
    });
  }

  // ---------------------------------------------------------------------------
  // 10. OPTION EVALUATION & STRATEGY TIP POPUP
  // ---------------------------------------------------------------------------
  function handleOptionSelection(chosenOption) {
    const activeData = state.currentActiveQuestion;
    const activeQ = activeData.active;
    const baseQ = activeData.base;
    const isParallel = activeData.isParallel;

    state.telemetry.totalAttempts++;

    if (chosenOption.isCorrect) {
      if (!isParallel) {
        state.telemetry.firstTryCorrect++;
        state.telemetry.masteredConcepts.push(baseQ.concept);
      } else {
        state.telemetry.remediatedCount++;
        state.telemetry.masteredConcepts.push(`${baseQ.concept} (Mastered on practice retry)`);
      }

      state.telemetry.itemLog.push({
        clinicId: PATHWAY_CLINICS[state.currentPathway][state.currentClinicIdx].id,
        concept: baseQ.concept,
        isParallelVariation: isParallel,
        chosen: chosenOption.text,
        outcome: 'CORRECT',
        timestamp: new Date().toISOString()
      });

      advanceToNextQuestion();
    } else {
      state.telemetry.misconceptionsTriggered.push({
        clinicId: PATHWAY_CLINICS[state.currentPathway][state.currentClinicIdx].id,
        concept: baseQ.concept,
        isParallelVariation: isParallel,
        chosen: chosenOption.text,
        trapExplanation: chosenOption.trap || activeQ.explanation.trapText,
        timestamp: new Date().toISOString()
      });

      state.telemetry.itemLog.push({
        clinicId: PATHWAY_CLINICS[state.currentPathway][state.currentClinicIdx].id,
        concept: baseQ.concept,
        isParallelVariation: isParallel,
        chosen: chosenOption.text,
        outcome: 'STRATEGY_TIP_SHOWN',
        timestamp: new Date().toISOString()
      });

      showMisconceptionModal(chosenOption, activeQ);
    }
  }

  function showMisconceptionModal(chosenOption, questionObj) {
    DOM.modalTrapExplanation.innerHTML = chosenOption.trap 
      ? `<strong>Why this choice didn't work:</strong> ${chosenOption.trap}`
      : questionObj.explanation.trapText;

    DOM.modalSolutionExplanation.innerHTML = questionObj.explanation.solutionText;

    if (questionObj.explanation.visualType) {
      renderVisualAidWidget(DOM.modalVisualAidCanvas, {
        type: questionObj.explanation.visualType,
        ...questionObj.explanation.visualConfig
      });
    }

    DOM.misconceptionModal.classList.remove('hidden');
  }

  function advanceToNextQuestion() {
    const clinics = PATHWAY_CLINICS[state.currentPathway] || PATHWAY_CLINICS.t2;
    const currentClinic = clinics[state.currentClinicIdx];

    if (state.currentQuestionIdx + 1 < currentClinic.questions.length) {
      state.currentQuestionIdx++;
      state.isOnParallelRetry = false;
      loadQuestion(state.currentClinicIdx, state.currentQuestionIdx, false);
    } else if (state.currentClinicIdx + 1 < clinics.length) {
      state.currentClinicIdx++;
      state.currentQuestionIdx = 0;
      state.isOnParallelRetry = false;
      loadQuestion(state.currentClinicIdx, 0, false);
    } else {
      // Mission Complete!
      finishMission();
    }
  }

  // ---------------------------------------------------------------------------
  // 11. INTERACTIVE VISUAL AID RENDERING
  // ---------------------------------------------------------------------------
  function renderVisualAidWidget(container, config) {
    container.innerHTML = '';
    if (!config) return;

    if (config.type === 'place-value-grid') {
      const wrap = document.createElement('div');
      wrap.className = 'pv-visual-wrap';

      // Shaded Hundredths Box
      const box1 = document.createElement('div');
      box1.className = 'pv-grid-box';
      const grid1 = document.createElement('div');
      grid1.className = 'grid-100';
      for (let i = 0; i < 100; i++) {
        const cell = document.createElement('div');
        cell.className = 'grid-100-cell' + (i < config.hundredths ? ' shaded-hundredth' : '');
        grid1.appendChild(cell);
      }
      box1.appendChild(grid1);
      box1.innerHTML += `<div style="font-size:0.85rem; font-weight:700; color:#047857;">${config.hundredths} Hundredths (${config.whole}.${config.tenths}${config.hundredths})</div>`;

      // Compare Tenths Box
      if (config.compareTenths > 0) {
        const box2 = document.createElement('div');
        box2.className = 'pv-grid-box';
        const grid2 = document.createElement('div');
        grid2.className = 'grid-100';
        for (let i = 0; i < 100; i++) {
          const cell = document.createElement('div');
          cell.className = 'grid-100-cell' + (i < config.compareTenths * 10 ? ' shaded-tenth' : '');
          grid2.appendChild(cell);
        }
        box2.appendChild(grid2);
        box2.innerHTML += `<div style="font-size:0.85rem; font-weight:700; color:#b45309;">${config.compareTenths} Tenths (${config.whole}.${config.compareTenths} = ${config.compareTenths * 10} hundredths)</div>`;
        wrap.appendChild(box1);
        wrap.appendChild(box2);
      } else {
        wrap.appendChild(box1);
      }

      container.appendChild(wrap);
    } 
    else if (config.type === 'fraction-bar-rename') {
      const wrap = document.createElement('div');
      wrap.className = 'bar-model-wrap';

      const row1 = document.createElement('div');
      row1.className = 'fraction-bar-row';
      row1.innerHTML = `<span class="bar-row-label">Base (${config.whole} wholes + ${config.part1}/${config.den}):</span>`;
      const strip1 = document.createElement('div');
      strip1.className = 'bar-strip';
      for (let i = 0; i < config.den; i++) {
        const slice = document.createElement('div');
        slice.className = 'bar-slice ' + (i < config.part1 ? 'filled-blue' : 'empty');
        slice.style.flex = '1';
        slice.textContent = i < config.part1 ? `1/${config.den}` : '';
        strip1.appendChild(slice);
      }
      row1.appendChild(strip1);
      wrap.appendChild(row1);

      if (config.part2 !== 0 && config.part2 !== undefined) {
        const isAdd = config.part2 > 0;
        const row2 = document.createElement('div');
        row2.className = 'fraction-bar-row';
        row2.innerHTML = `<span class="bar-row-label">${isAdd ? 'Add (+' : 'Subtract (-'}${Math.abs(config.part2)}/${config.den}):</span>`;
        const strip2 = document.createElement('div');
        strip2.className = 'bar-strip';
        for (let i = 0; i < config.den; i++) {
          const slice = document.createElement('div');
          let cl = 'empty';
          let txt = '';
          if (isAdd) {
            if (i < config.part1) {
              cl = 'filled-blue';
              txt = `1/${config.den}`;
            } else if (i < config.part1 + config.part2) {
              cl = 'filled-amber';
              txt = `+1/${config.den}`;
            }
          } else {
            const rem = config.part1 + config.part2;
            if (i < rem) {
              cl = 'filled-blue';
              txt = `1/${config.den}`;
            }
          }
          slice.className = `bar-slice ${cl}`;
          slice.style.flex = '1';
          slice.textContent = txt;
          strip2.appendChild(slice);
        }
        row2.appendChild(strip2);
        wrap.appendChild(row2);
      }

      container.appendChild(wrap);
    }
    else if (config.type === 'golden-rule-wall') {
      const wrap = document.createElement('div');
      wrap.className = 'fraction-wall-wrap';

      const row1 = document.createElement('div');
      row1.style.marginBottom = '4px';
      row1.innerHTML = `<div style="font-size:0.8rem; font-weight:700; color:#1e3a8a; margin-bottom:2px;">Step 1: ${config.origNum}/${config.origDen} scaled by ×${config.scale} ➔ ${config.origNum * config.scale}/${config.origDen * config.scale}</div>`;
      const wall1 = document.createElement('div');
      wall1.className = 'wall-level';
      for (let i = 0; i < config.origDen; i++) {
        const b = document.createElement('div');
        b.className = 'wall-block ' + (i < config.origNum ? 'active-split' : '');
        b.textContent = `1/${config.origDen}`;
        wall1.appendChild(b);
      }
      row1.appendChild(wall1);
      wrap.appendChild(row1);

      const row2 = document.createElement('div');
      row2.innerHTML = `<div style="font-size:0.8rem; font-weight:700; color:#15803d; margin-bottom:2px;">Step 2: Matching Denominator (${config.targetDen}ths)</div>`;
      const wall2 = document.createElement('div');
      wall2.className = 'wall-level';
      for (let i = 0; i < config.targetDen; i++) {
        const b = document.createElement('div');
        b.className = 'wall-block ' + (i < (config.origNum * config.scale) ? 'target-match' : '');
        b.textContent = `1/${config.targetDen}`;
        wall2.appendChild(b);
      }
      row2.appendChild(wall2);
      wrap.appendChild(row2);

      container.appendChild(wrap);
    }
    else if (config.type === 'simplification-dots') {
      const wrap = document.createElement('div');
      wrap.style.display = 'flex';
      wrap.style.flexDirection = 'column';
      wrap.style.alignItems = 'center';
      wrap.style.gap = '8px';

      wrap.innerHTML = `
        <div style="font-size: 0.95rem; font-weight: 700; color: #1e3a8a;">
          Divide Top and Bottom by HCF (÷ ${config.factor})
        </div>
        <div style="display: flex; gap: 1.5rem; align-items: center; font-size: 1.15rem; font-weight: 700;">
          <span>${renderFrac(config.num, config.den)}</span>
          <span style="color: var(--brand-blue);">&rarr;</span>
          <span style="color: #059669;">${renderFrac(config.finalNum, config.finalDen)}</span>
        </div>
      `;
      container.appendChild(wrap);
    }
  }

  // ---------------------------------------------------------------------------
  // 12. COMPLETION, TELEMETRY & LOCAL STORAGE
  // ---------------------------------------------------------------------------
  function finishMission() {
    const student = state.currentUser;
    const t = state.telemetry;

    saveSessionTelemetry(student.id, {
      studentId: student.id,
      studentName: student.name,
      startTime: state.sessionStartTime,
      completedTime: new Date().toISOString(),
      firstTryCorrect: t.firstTryCorrect,
      remediatedCount: t.remediatedCount,
      totalAttempts: t.totalAttempts,
      masteredConcepts: Array.from(new Set(t.masteredConcepts)),
      misconceptionsTriggered: t.misconceptionsTriggered,
      itemLog: t.itemLog
    });

    const totalChallenges = t.firstTryCorrect + t.remediatedCount;
    const masteryPct = totalChallenges > 0 ? 100 : 0;
    DOM.statMasteryRate.textContent = `${masteryPct}%`;
    DOM.statFirstTry.textContent = t.firstTryCorrect;
    DOM.statRemediated.textContent = t.remediatedCount;
    DOM.statTotalItems.textContent = totalChallenges;

    DOM.listMasteredConcepts.innerHTML = '';
    const uniqueMastered = Array.from(new Set(t.masteredConcepts));
    uniqueMastered.forEach(c => {
      const item = document.createElement('div');
      item.className = 'concept-item';
      item.innerHTML = `<span style="color:#16a34a; font-weight:700;">✓</span> <span>${c}</span>`;
      DOM.listMasteredConcepts.appendChild(item);
    });

    DOM.listRemediatedTraps.innerHTML = '';
    if (t.misconceptionsTriggered.length === 0) {
      DOM.listRemediatedTraps.innerHTML = '<div class="concept-item" style="color:#16a34a;">★ Perfect run! Solved all challenges on the first try.</div>';
    } else {
      t.misconceptionsTriggered.forEach(m => {
        const item = document.createElement('div');
        item.className = 'concept-item';
        item.innerHTML = `<span style="color:#d97706; font-weight:700;">✦</span> <span>${m.concept}: Successfully practised and solved.</span>`;
        DOM.listRemediatedTraps.appendChild(item);
      });
    }

    switchScreen('summary');
  }

  function saveSessionTelemetry(studentId, sessionData) {
    try {
      const all = JSON.parse(localStorage.getItem('mcs_all_sessions') || '{}');
      all[studentId] = sessionData;
      localStorage.setItem('mcs_all_sessions', JSON.stringify(all));
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  }

  // ---------------------------------------------------------------------------
  // 13. EXPORT CAPABILITIES (JSON & CSV)
  // ---------------------------------------------------------------------------
  function exportStudentJson() {
    const student = state.currentUser;
    const t = state.telemetry;
    const payload = {
      studentId: student.id,
      studentName: student.name,
      startTime: state.sessionStartTime,
      completedTime: new Date().toISOString(),
      summary: {
        totalItemsCompleted: t.firstTryCorrect + t.remediatedCount,
        firstTryCorrect: t.firstTryCorrect,
        practisedCount: t.remediatedCount,
        totalAttempts: t.totalAttempts,
        masteryPercentage: 100
      },
      conceptsMastered: Array.from(new Set(t.masteredConcepts)),
      strategyLogs: t.misconceptionsTriggered,
      itemLog: t.itemLog
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Maths_Masterclass_${student.id}_Report.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportStudentCsv() {
    const student = state.currentUser;
    const t = state.telemetry;

    let csv = 'Timestamp,Student ID,Concept,Variation,Chosen Option,Outcome\n';
    t.itemLog.forEach(log => {
      csv += `"${log.timestamp}","${student.id}","${log.concept}","${log.isParallelVariation ? 'Practice' : 'Initial'}","${log.chosen.replace(/"/g, '""')}","${log.outcome}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Maths_Masterclass_${student.id}_Log.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ---------------------------------------------------------------------------
  // 14. TEACHER HUB OVERSIGHT MODAL
  // ---------------------------------------------------------------------------
  function openTeacherHub() {
    const all = JSON.parse(localStorage.getItem('mcs_all_sessions') || '{}');
    const keys = Object.keys(all);
    DOM.teacherSessionCount.textContent = keys.length;
    DOM.teacherTableBody.innerHTML = '';

    if (keys.length === 0) {
      DOM.teacherTableBody.innerHTML = `
        <tr>
          <td colspan="5" style="padding: 16px; text-align: center; color: var(--text-muted);">
            No student sessions recorded on this device yet. Have students complete their missions!
          </td>
        </tr>
      `;
    } else {
      keys.forEach(k => {
        const s = all[k];
        const tr = document.createElement('tr');
        tr.style.borderBottom = '1px solid #e2e8f0';
        tr.innerHTML = `
          <td style="padding: 8px 12px; font-weight:700;">${s.studentId}</td>
          <td style="padding: 8px 12px; color:#15803d; font-weight:700;">100%</td>
          <td style="padding: 8px 12px;">${s.firstTryCorrect}</td>
          <td style="padding: 8px 12px;">${s.remediatedCount}</td>
          <td style="padding: 8px 12px; font-size:0.75rem; color:#64748b;">${new Date(s.completedTime).toLocaleTimeString()}</td>
        `;
        DOM.teacherTableBody.appendChild(tr);
      });
    }

    DOM.teacherModal.classList.remove('hidden');
  }

  function exportAllClassJson() {
    const all = localStorage.getItem('mcs_all_sessions') || '{}';
    const blob = new Blob([all], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Class_Fractions_Masterclass_Telemetry_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportAllClassCsv() {
    const all = JSON.parse(localStorage.getItem('mcs_all_sessions') || '{}');
    let csv = 'Student ID,Student Name,First Try Correct,Practised Count,Total Attempts,Completed Time\n';
    Object.values(all).forEach(s => {
      csv += `"${s.studentId}","${s.studentName}",${s.firstTryCorrect},${s.remediatedCount},${s.totalAttempts},"${s.completedTime}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Class_Fractions_Masterclass_Summary_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function clearAllTelemetry() {
    if (confirm('Are you sure you want to clear all stored student session telemetry on this device?')) {
      localStorage.removeItem('mcs_all_sessions');
      openTeacherHub();
    }
  }

  window.addEventListener('DOMContentLoaded', init);

})();
