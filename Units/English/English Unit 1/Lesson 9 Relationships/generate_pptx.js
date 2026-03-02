const pptxgen = require('pptxgenjs');
const fs = require('fs');
const path = require('path');
const html2pptx = require('c:\\Users\\dsuth\\Documents\\Joshua\\.agent\\skills\\pptx\\scripts\\html2pptx');

async function run() {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';
  
  const slidesDir = 'c:\\Users\\dsuth\\Documents\\Joshua\\Units\\English\\English Unit 1\\Lesson 9 Relationships\\slides';
  const slideFiles = ['slide1.html', 'slide2.html', 'slide3.html', 'slide4.html', 'slide5.html', 'slide6.html'];
  const outputFile = 'c:\\Users\\dsuth\\Documents\\Joshua\\Units\\English\\English Unit 1\\Lesson 9 Relationships\\Lesson_9_Relationships.pptx';

  for (const file of slideFiles) {
    const fullPath = path.join(slidesDir, file);
    console.log(`Processing ${file}...`);
    await html2pptx(fullPath, pptx);
  }

  await pptx.writeFile({ fileName: outputFile });
  console.log('✅ PowerPoint generated successfully.');
}

run().catch(console.error);
