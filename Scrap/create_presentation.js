const pptxgen = require('pptxgenjs');
const path = require('path');
const fs = require('fs');
const html2pptx = require(path.join(__dirname, '..', '.agent', 'skills', 'pptx', 'scripts', 'html2pptx.js'));

async function createPresentation() {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';
  pptx.author = 'Joshua AI';
  pptx.title = 'Who Influences Me? - Lesson 1';

  const slidesDir = path.join(__dirname, 'slides');
  const slideFiles = ['slide1.html', 'slide2.html', 'slide3.html', 'slide4.html', 'slide5.html', 'slide6.html', 'slide7.html', 'slide8.html', 'slide9.html', 'slide10.html', 'slide11.html', 'slide12.html'];

  for (const file of slideFiles) {
    const htmlPath = path.join(slidesDir, file);
    console.log(`Processing ${file}...`);
    await html2pptx(htmlPath, pptx);
  }

  const outPath = 'c:\\Users\\dsuth\\Documents\\Joshua\\Units\\Health\\Who influences me Part B\\Lesson 1 - Presentation.pptx';
  await pptx.writeFile({ fileName: outPath });
  console.log('Presentation created successfully:', outPath);
}

createPresentation().catch(err => {
  console.error('Error creating presentation:', err);
  process.exit(1);
});
