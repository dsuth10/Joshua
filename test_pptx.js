const pptxgen = require('pptxgenjs');
const fs = require('fs');

async function test() {
  const pptx = new pptxgen();
  let slide = pptx.addSlide();
  
  // Test image 3
  slide.addImage({
    path: 'c:/Users/dsuth/Documents/Joshua/Units/English/English_Unit_2/Cyclones/Screenshots/heading.png',
    x: 1, y: 1, w: 2, h: 2
  });

  // Test image 4
  slide.addImage({
    path: 'c:/Users/dsuth/Documents/Joshua/Units/English/English_Unit_2/Cyclones/Screenshots/timeline.png',
    x: 4, y: 1, w: 2, h: 2
  });

  await pptx.writeFile({ fileName: 'c:/Users/dsuth/Documents/Joshua/test_pptx.pptx' });
  console.log("Done");
}

test().catch(console.error);
