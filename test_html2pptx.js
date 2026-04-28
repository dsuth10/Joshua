const pptxgen = require('pptxgenjs');
const html2pptx = require('c:\\Users\\dsuth\\Documents\\Joshua\\.agent\\skills\\pptx\\scripts\\html2pptx');
const path = require('path');

async function test() {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';
  
  const slidePath = path.resolve('Units/English/English_Unit_2/Lesson_Plans/Presentations/Lesson_06_Slides/slide_4.html');
  const res = await html2pptx(slidePath, pptx);
  
  console.log("Placeholders:", res.placeholders);
  console.log("Slide added!");
  await pptx.writeFile({ fileName: 'c:/Users/dsuth/Documents/Joshua/test_pptx2.pptx' });
  console.log("Done");
}

test().catch(console.error);
