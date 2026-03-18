const pptxgen = require('pptxgenjs');
const path = require('path');
const html2pptx = require('c:\\Users\\dsuth\\Documents\\Joshua\\.agent\\skills\\pptx\\scripts\\html2pptx');

async function generatePresentation() {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';

  const slidesDir = path.join(__dirname, 'Slides');
  const slideFiles = [
    'slide1.html', 'slide2.html', 'slide3.html', 'slide4.html', 'slide5.html',
    'slide6.html', 'slide7.html', 'slide8.html', 'slide9.html', 'slide10.html'
  ];

  for (let i = 0; i < slideFiles.length; i++) {
    const file = slideFiles[i];
    const slidePath = path.join(slidesDir, file);
    try {
      console.log(`[${i+1}/10] Processing: ${file}...`);
      await html2pptx(slidePath, pptx);
      console.log(`✅ Processed: ${file}`);
      // Add a small delay to prevent browser launch overhead issues
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err) {
      console.error(`❌ Error on ${file}:`, err);
    }
  }

  const outputPath = path.join(__dirname, 'Lesson_1_Presentation.pptx');
  try {
    console.log(`Attempting to save to: ${outputPath}`);
    await pptx.writeFile({ fileName: outputPath });
    console.log(`✨ Presentation saved successfully!`);
  } catch (err) {
    console.error(`❌ Failed to save presentation:`, err.message);
    const fallbackPath = path.join(__dirname, `Lesson_1_Presentation_${Date.now()}.pptx`);
    console.log(`Trying fallback path: ${fallbackPath}`);
    await pptx.writeFile({ fileName: fallbackPath });
  }
}

generatePresentation().catch(err => {
    console.error("FATAL ERROR:", err);
    process.exit(1);
});
