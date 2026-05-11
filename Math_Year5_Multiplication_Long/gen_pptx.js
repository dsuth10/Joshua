const pptxgen = require('pptxgenjs');
const path = require('path');
const html2pptx = require('../.agent/skills/pptx/scripts/html2pptx.js');

async function createPresentation() {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';
  pptx.author = 'Antigravity Assistant';
  pptx.title = 'Quantum Quest: Long Multiplication';

  const slidesDir = path.join(__dirname, 'slides');
  const slideFiles = [
    'slide1.html', 'slide2.html', 'slide3.html', 'slide4.html', 'slide5.html',
    'slide6.html', 'slide7.html', 'slide8.html', 'slide9.html', 'slide10.html'
  ];

  for (const file of slideFiles) {
    console.log(`Processing ${file}...`);
    await html2pptx(path.join(slidesDir, file), pptx);
  }

  const outputPath = path.join(__dirname, 'presentation.pptx');
  await pptx.writeFile({ fileName: outputPath });
  console.log(`Presentation saved to ${outputPath}`);
}

createPresentation().catch(err => {
  console.error('Error creating presentation:', err);
  process.exit(1);
});
