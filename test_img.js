const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER:', msg.text()));
  await page.goto('file:///c:/Users/dsuth/Documents/Joshua/Units/English/English_Unit_2/Lesson_Plans/Presentations/Lesson_06_Slides/slide_4.html', { waitUntil: 'networkidle' });
  const dims = await page.evaluate(() => {
    const img = document.querySelector('img');
    return { w: img.width, h: img.height, nw: img.naturalWidth, nh: img.naturalHeight, src: img.src };
  });
  console.log(dims);
  await browser.close();
})();
