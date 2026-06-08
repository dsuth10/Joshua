const { chromium } = require('playwright');

(async () => {
  console.log('Starting automated QA test for Maths Practice Companion Page...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Capture browser logs
  page.on('console', msg => console.log(`BROWSER_LOG: ${msg.text()}`));
  page.on('pageerror', err => console.log(`BROWSER_ERROR: ${err.message}`));
  
  // Navigate to practice page
  await page.goto('http://localhost:8000/practice.html');
  console.log('Practice page loaded successfully.');

  // Take initial screenshot of practice dashboard
  await page.screenshot({ path: 'scratch/practice_welcome_qa.png' });

  // 1. Verify Profile Editing
  const initialName = await page.inputValue('#profile-name-edit');
  console.log(`Initial student profile name: ${initialName}`);
  
  await page.fill('#profile-name-edit', 'JOSHUA');
  await page.dispatchEvent('#profile-name-edit', 'change');
  
  const updatedAvatar = await page.textContent('#profile-avatar');
  console.log(`Updated avatar initials: ${updatedAvatar} (Expected: J)`);

  // 2. Solve a dynamic Recall Fact Correctly on 1st attempt
  // Get equation
  const equationText = await page.textContent('#prac-interactive-panel');
  console.log(`Active recall question raw display: "${equationText.trim()}"`);
  
  // Parse equation (e.g. "5 + 7 = ?")
  const match = equationText.match(/(\d+)\s*([\+\-])\s*(\d+)/);
  if (!match) {
    throw new Error('Failed to parse equation text: ' + equationText);
  }
  const operand1 = parseInt(match[1], 10);
  const operator = match[2];
  const operand2 = parseInt(match[3], 10);
  
  const correctAns = operator === '+' ? (operand1 + operand2) : (operand1 - operand2);
  console.log(`Parsed equation: ${operand1} ${operator} ${operand2}. Calculated correct answer: ${correctAns}`);

  // Input correct answer
  await page.fill('#prac-recall-input', correctAns.toString());
  await page.click('#btn-prac-submit');
  
  // Verify correct feedback
  await page.waitForSelector('#prac-feedback-text:visible');
  const feedbackText = await page.textContent('#prac-feedback-text');
  console.log(`Feedback received: "${feedbackText.trim()}"`);

  const currentScore = await page.textContent('#profile-score');
  console.log(`Current profile score: ${currentScore}`);

  // 3. Verify Visual Hint on Incorrect 1st attempt
  // Click next challenge
  await page.click('#btn-prac-next');
  await page.waitForTimeout(500);

  // Input wrong answer
  await page.fill('#prac-recall-input', '999');
  await page.click('#btn-prac-submit');
  console.log('Wrong answer submitted for attempt 1.');

  // Verify attempt decrement and hint visibility
  const attemptsLabel = await page.textContent('#prac-attempts-left');
  console.log(`Attempts status: ${attemptsLabel.trim()} (Expected: 1 ATTEMPT LEFT)`);
  
  await page.waitForSelector('#prac-hint-container:visible');
  const hintVisible = await page.isVisible('#prac-hint-container');
  console.log(`Visual hint container visible: ${hintVisible}`);
  
  // Take screenshot of active hint
  await page.screenshot({ path: 'scratch/practice_hint_active_qa.png' });

  // 4. Solve correctly on 2nd attempt
  const eqText2 = await page.textContent('#prac-interactive-panel');
  const match2 = eqText2.match(/(\d+)\s*([\+\-])\s*(\d+)/);
  const correctAns2 = match2[2] === '+' ? (parseInt(match2[1], 10) + parseInt(match2[3], 10)) : (parseInt(match2[1], 10) - parseInt(match2[3], 10));
  
  await page.fill('#prac-recall-input', correctAns2.toString());
  await page.click('#btn-prac-submit');
  console.log(`Correct answer submitted on 2nd attempt: ${correctAns2}`);

  await page.waitForSelector('#prac-feedback-text:visible');
  const feedbackText2 = await page.textContent('#prac-feedback-text');
  console.log(`Feedback received: "${feedbackText2.trim()}"`);

  const currentScore2 = await page.textContent('#profile-score');
  console.log(`Updated profile score: ${currentScore2} (Expected: 15 PTS)`);

  // 5. Verify local storage persistency across page reload
  await page.reload();
  console.log('Page reloaded to check persistent localStorage states.');
  
  const persistedName = await page.inputValue('#profile-name-edit');
  const persistedScore = await page.textContent('#profile-score');
  const persistedAvatar = await page.textContent('#profile-avatar');
  
  console.log(`Persisted Student Name: ${persistedName} (Expected: JOSHUA)`);
  console.log(`Persisted Score: ${persistedScore} (Expected: 15 PTS)`);
  console.log(`Persisted Avatar: ${persistedAvatar} (Expected: J)`);

  // Check if first-step badge is unlocked (should contain class .unlocked)
  const classAttr = await page.getAttribute('#badge-first-step', 'class');
  const isFirstBadgeUnlocked = classAttr.includes('unlocked');
  console.log(`First Step badge unlocked on shelf: ${isFirstBadgeUnlocked}`);

  await page.screenshot({ path: 'scratch/practice_final_qa.png' });

  await browser.close();
  console.log('Practice companion QA test finished.');
})();
