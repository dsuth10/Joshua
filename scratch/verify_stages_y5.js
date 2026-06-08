const { chromium } = require('playwright');

(async () => {
  console.log("Starting Assessment Terminal Verification...");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Capture browser console logs and errors
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));

  try {
    // Navigate to assessment page
    await page.goto('http://localhost:8000/index.html');
    console.log("Navigated to assessment page.");

    // Check Title
    const title = await page.title();
    console.log(`Page Title: "${title}"`);
    if (!title.includes("Year 5 Assessment")) {
      throw new Error(`Title mismatch. Got: "${title}"`);
    }

    // Start assessment
    await page.click('#btn-start-assessment');
    console.log("Started Assessment.");

    // --- STAGE 1: Fact Fluency ---
    console.log("Completing Stage 1: Fact Fluency (20 questions)...");
    for (let i = 0; i < 20; i++) {
      // Wait for equation to render
      await page.waitForSelector('#equation-text');
      const eqText = await page.locator('#equation-text').textContent();
      
      // Solve equation
      const cleanEq = eqText.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
      const ans = eval(cleanEq);
      
      // Type answer via keyboard
      const ansStr = ans.toString();
      await page.locator('#equation-input').click(); // focus
      for (const char of ansStr) {
        await page.keyboard.press(char);
      }
      await page.keyboard.press('Enter');
      
      // Wait a short moment
      await page.waitForTimeout(50);
    }
    console.log("Stage 1 completed.");

    // --- STAGE 2: Calibration Laboratory ---
    console.log("Completing Stage 2: Calibration Laboratory...");
    
    // Sub-station 1: Shifter
    await page.waitForSelector('#station-2-1.active');
    console.log("  Sub-station 1: Decimal Shifter active.");
    await page.click('#calc-c2', { force: true }); // select "+0.1"
    await page.fill('#calc-explanation', "Shifting digits across tenths place value column.");
    await page.click('#btn-next-substation');
    await page.waitForTimeout(100);

    // Sub-station 2: Expander
    await page.waitForSelector('#station-2-2.active');
    console.log("  Sub-station 2: Decimal Expander active.");
    await page.fill('#exp-9524-tenths', "95");
    await page.fill('#exp-9524-hundreds', "2");
    await page.fill('#exp-9524-thousandths', "4");
    await page.click('#btn-next-substation');
    await page.waitForTimeout(100);

    // Sub-station 3: Percentage Register
    await page.waitForSelector('#station-2-3.active');
    console.log("  Sub-station 3: Percentage Register active.");
    await page.fill('#reg-decimal', "0.75");
    await page.fill('#reg-fraction', "3/4");
    await page.click('#btn-next-substation');
    await page.waitForTimeout(100);

    // Sub-station 4: Divisibility
    await page.waitForSelector('#station-2-4.active');
    console.log("  Sub-station 4: Divisibility active.");
    await page.fill('#div-pair-1', "4");
    await page.fill('#div-pair-2', "12");
    await page.click('#div-yes', { force: true });
    await page.fill('#div-explanation', "The sum of digits is 4+8=12, which is divisible by 3.");
    await page.click('#btn-next-substation');
    console.log("Stage 2 completed.");

    // --- STAGE 3: Dispatch & Coordinates ---
    console.log("Completing Stage 3: Dispatch & Coordinates...");
    
    // Sub-stage 1: Cargo Partitioning
    await page.waitForSelector('#eggerling-sub-1.active');
    console.log("  Sub-stage 1: Cargo Partitioning active.");
    await page.fill('#cargo-weight-input', "2.35");
    await page.fill('#cargo-working', "Dividing 23.5 by 10 shifts decimal digits one place to the left.");
    await page.click('#btn-submit-cargo');
    
    // Wait for loader animation and transition
    await page.waitForTimeout(1500);

    // Sub-stage 2: Coordinate Grid Dispatch
    await page.waitForSelector('#eggerling-sub-2.active');
    console.log("  Sub-stage 2: Coordinate Grid active.");
    
    // Click coordinates on SVG grid: Waypoint A(2,3), Waypoint B(8,5), Waypoint C(5,9)
    console.log("  Clicking coordinates on 10x10 SVG grid...");
    
    const cellA = page.locator('#assessment-grid-host .coord-cell[data-x="2"][data-y="3"]');
    await cellA.click({ force: true });
    await page.waitForTimeout(200);

    const cellB = page.locator('#assessment-grid-host .coord-cell[data-x="8"][data-y="5"]');
    await cellB.click({ force: true });
    await page.waitForTimeout(200);

    const cellC = page.locator('#assessment-grid-host .coord-cell[data-x="5"][data-y="9"]');
    await cellC.click({ force: true });
    await page.waitForTimeout(200);

    // Verify coordinates filled
    const ax = await page.locator('#waypoint-a-x').inputValue();
    const ay = await page.locator('#waypoint-a-y').inputValue();
    const bx = await page.locator('#waypoint-b-x').inputValue();
    const by = await page.locator('#waypoint-b-y').inputValue();
    const cx = await page.locator('#waypoint-c-x').inputValue();
    const cy = await page.locator('#waypoint-c-y').inputValue();
    console.log(`  Waypoint A registered: (${ax}, ${ay})`);
    console.log(`  Waypoint B registered: (${bx}, ${by})`);
    console.log(`  Waypoint C registered: (${cx}, ${cy})`);
    
    if (ax !== '2' || ay !== '3' || bx !== '8' || by !== '5' || cx !== '5' || cy !== '9') {
      throw new Error(`Coordinate inputs not filled correctly. Got A(${ax},${ay}), B(${bx},${by}), C(${cx},${cy})`);
    }

    // Fill route distance
    await page.fill('#route-distance-input', "15");
    await page.click('#btn-submit-delivery');
    console.log("Stage 3 completed.");

    // --- STAGE 4: Diagnostics Report ---
    console.log("Verifying Stage 4: Diagnostics Report...");
    await page.waitForSelector('#stage-4.active');
    
    const score = await page.locator('#report-score').textContent();
    console.log(`Assessment Score: "${score}"`);
    if (score !== '36 / 36') {
      throw new Error(`Expected perfect score 36 / 36. Got: "${score}"`);
    }

    const feedback = await page.locator('#report-feedback').textContent();
    console.log(`Teacher Feedback: "${feedback}"`);
    if (!feedback.includes("EXCELLENT PERFORMANCE")) {
      throw new Error("Feedback does not indicate excellent performance.");
    }

    console.log("✅ All Assessment Stages successfully verified with perfect score!");
  } catch (error) {
    console.error("❌ Verification failed:", error);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
