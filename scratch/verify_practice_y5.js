const { chromium } = require('playwright');

(async () => {
  console.log("Starting Practice Console Verification...");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    // Navigate to practice page
    await page.goto('http://localhost:8000/practice.html');
    console.log("Navigated to practice page.");

    // Check Title
    const title = await page.title();
    console.log(`Page Title: "${title}"`);
    if (!title.includes("Year 5 Console")) {
      throw new Error(`Title mismatch. Got: "${title}"`);
    }

    // Check Name Edit
    const nameInput = await page.locator('#profile-name-edit');
    await nameInput.fill('ADVENTURER');
    await nameInput.press('Enter');
    
    const avatar = await page.locator('#profile-avatar').textContent();
    console.log(`Updated Avatar: "${avatar}"`);
    if (avatar !== 'A') {
      throw new Error(`Avatar did not update. Got: "${avatar}"`);
    }

    // Verify Rank
    const rank = await page.locator('#profile-rank').textContent();
    console.log(`Initial Rank: "${rank}"`);
    if (rank !== 'Novice Calibrator') {
      throw new Error(`Rank mismatch. Got: "${rank}"`);
    }

    // Check 6 selector tabs
    const tabs = ['tab-number', 'tab-algebra', 'tab-measurement', 'tab-space', 'tab-statistics', 'tab-probability'];
    for (const tabId of tabs) {
      const tab = page.locator(`#${tabId}`);
      await expectToExist(tab, tabId);
      const label = await tab.textContent();
      console.log(`Found Tab: "${label}"`);
    }

    // Click tabs and verify content loads
    for (const tabId of tabs) {
      console.log(`Clicking Tab: "${tabId}"`);
      await page.click(`#${tabId}`);
      // Give a tiny moment for generators to run
      await page.waitForTimeout(100);
      
      const qText = await page.locator('#prac-task-title').textContent();
      console.log(`  Question generated: "${qText.substring(0, 60)}..."`);
      
      const interactivePanel = page.locator('#prac-interactive-panel');
      await expectToExist(interactivePanel, `interactive panel for ${tabId}`);
    }

    console.log("✅ All 6 Practice Bay tabs successfully verified!");
  } catch (error) {
    console.error("❌ Verification failed:", error);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();

async function expectToExist(locator, name) {
  const count = await locator.count();
  if (count === 0) {
    throw new Error(`Element "${name}" was not found on page.`);
  }
}
