const { chromium } = require('playwright');
const path = require('path');

(async () => {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Set viewport to standard desktop width (A4 ratio) to force desktop grid
  await page.setViewportSize({ width: 1024, height: 1448 });
  
  const htmlPath = 'file:///' + path.resolve(__dirname, '../Units/English/English_Unit_2/Lesson_Plans/Lesson_25.2/Tsunami_Reading/index.html').replace(/\\/g, '/');
  console.log(`Loading page: ${htmlPath}`);
  
  await page.goto(htmlPath, { waitUntil: 'networkidle' });
  
  // Emulate print media to apply print styles
  await page.emulateMedia({ media: 'print' });
  
  const outputPath = path.resolve(__dirname, '../Units/English/English_Unit_2/Lesson_Plans/Lesson_25.2/Tsunami_Reading/Tsunamis_Y5.pdf');
  console.log(`Saving PDF to: ${outputPath}`);
  
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '0mm',
      right: '0mm',
      bottom: '0mm',
      left: '0mm'
    }
  });
  
  // Also take a screenshot for visual confirmation
  const screenshotPath = path.resolve(__dirname, '../Units/English/English_Unit_2/Lesson_Plans/Lesson_25.2/Tsunami_Reading/render_check.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`Screenshot saved to: ${screenshotPath}`);
  
  await browser.close();
  console.log('PDF generated successfully!');
})().catch(err => {
  console.error('Error generating PDF:', err);
  process.exit(1);
});
