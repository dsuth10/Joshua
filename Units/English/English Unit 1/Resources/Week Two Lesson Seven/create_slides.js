const pptxgen = require('pptxgenjs');
const path = require('path');
const html2pptx = require('c:\\Users\\dsuth\\Documents\\Joshua\\.agent\\skills\\pptx\\scripts\\html2pptx');

async function createPresentation() {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';
  pptx.author = 'Joshua';
  pptx.title = 'Week 2 Lesson 7 Presentation';

  const baseDir = "c:\\Users\\dsuth\\Documents\\Joshua\\Units\\English\\English Unit 1\\Resources\\Week Two Lesson Seven";
  const slidesDir = path.join(baseDir, "slides");
  
  const slides = [
    'slide1.html', 'slide2.html', 'slide3.html', 
    'slide4.html', 'slide5.html', 'slide6.html', 'slide7.html'
  ];

  console.log("Starting slide conversion...");
  for (const slideHtml of slides) {
    const fullPath = path.join(slidesDir, slideHtml);
    console.log(`Processing: ${fullPath}`);
    await html2pptx(fullPath, pptx);
  }

  const outputPath = path.join(baseDir, 'Presentation.pptx');
  console.log(`Saving to: ${outputPath}`);
  
  // Using string filename instead of object if version is older, 
  // though some versions prefer the object. Let's try string first.
  await pptx.writeFile(outputPath); 
  console.log('Finished create_slides script successfully');
}

createPresentation().catch(err => {
  console.error("CRITICAL ERROR IN SCRIPT:");
  console.error(err);
  process.exit(1);
});
