const { chromium } = require('playwright');

(async () => {
  console.log('Starting automated QA test for Maths Command Station...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Navigate to local server
  await page.goto('http://localhost:8000');
  console.log('Page loaded successfully.');

  // Take initial screenshot of welcome screen
  await page.screenshot({ path: 'scratch/welcome_qa.png' });
  
  // Click start button
  await page.click('#btn-start-assessment');
  console.log('System initialised. Navigated to Stage 1.');

  // Answer all 20 addition/subtraction questions
  const answers = [12, 8, 16, 6, 15, 8, 13, 8, 14, 9, 13, 6, 18, 8, 12, 8, 13, 7, 16, 7];
  for (let i = 0; i < answers.length; i++) {
    const ansStr = answers[i].toString();
    // Use keypad inputs or type directly
    for (let char of ansStr) {
      await page.click(`.num-key[data-val="${char}"]`);
    }
    await page.click('#key-submit');
  }
  console.log('Stage 1 completed: All 20 fact recall questions answered.');

  // Wait for stage transition animation
  await page.waitForTimeout(1000);
  
  // Stage 2 Sub-station 1: Calculator Hack
  await page.click('#calc-c2'); // Select "Add 10" radio button
  await page.fill('#calc-explanation', 'Adding 1 ten (10) to 796 rolls 79 tens to 80 tens, which gives 806.');
  await page.click('#btn-next-substation');
  console.log('Stage 2 Sub-station 1 (Calculator) completed.');

  // Stage 2 Sub-station 2: Register 702
  await page.fill('#val-702-hundreds', '7');
  await page.click('#btn-next-substation');
  console.log('Stage 2 Sub-station 2 (702 Hundreds) completed.');

  // Stage 2 Sub-station 3: Number Expander 952
  await page.fill('#exp-952-tens', '95');
  await page.fill('#exp-952-ones', '2');
  await page.click('#btn-next-substation');
  console.log('Stage 2 Sub-station 3 (Expander) completed.');

  // Stage 2 Sub-station 4: Registers 952 & Ten Less & 34 Tens
  await page.fill('#val-952-hundreds', '9');
  await page.fill('#val-952-ten-less', '942');
  await page.fill('#val-34-tens', '340');
  await page.click('#btn-next-substation');
  console.log('Stage 2 Sub-station 4 completed. Stage 2 fully finished.');

  // Wait for stage transition
  await page.waitForTimeout(1000);

  // Stage 3 Sub-stage 1: Egg Packing
  await page.fill('#egg-cartons-input', '23');
  await page.fill('#egg-packing-working', '234 eggs packed in cartons of 10 gives 23 full cartons with 4 leftover eggs.');
  await page.click('#btn-submit-eggs');
  console.log('Stage 3 Sub-stage 1 (Egg Packer) completed.');

  // Stage 3 Sub-stage 2: Shop Delivery
  await page.fill('#van-left-input', '183');
  await page.fill('#van-delivery-working', '213 cartons - 3 shops * 10 cartons/shop = 183 cartons left.');
  await page.click('#btn-submit-delivery');
  console.log('Stage 3 Sub-stage 2 (Van Delivery) completed.');

  // Wait for report stage to load
  await page.waitForTimeout(1000);

  // Take screenshot of report
  await page.screenshot({ path: 'scratch/report_qa.png' });

  // Verify score
  const scoreText = await page.textContent('#report-score');
  console.log(`Final Diagnostic Score Readout: ${scoreText}`);
  
  if (scoreText.includes('32 / 32')) {
    console.log('SUCCESS: All diagnostic calibration tests passed with 100% accuracy!');
  } else {
    console.log(`WARNING: Score mismatch: ${scoreText}`);
  }

  // Print final feedback
  const feedback = await page.textContent('#report-feedback');
  console.log(`System Feedback Report:\n"${feedback}"`);

  await browser.close();
  console.log('QA test finished.');
})();
