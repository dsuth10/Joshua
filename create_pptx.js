const pptxgen = require('pptxgenjs');
const path = require('path');
const html2pptx = require(path.join(process.cwd(), '.agent/skills/pptx/scripts/html2pptx.js'));

async function createPresentation() {
    const pptx = new pptxgen();
    pptx.layout = 'LAYOUT_16x9';
    pptx.author = 'Antigravity AI';
    pptx.title = 'Grid Coordinates Lesson 1';

    const slidesDir = 'Units/Maths/Maths_Unit_1/grid-coordinates-1/Presentation';
    const slides = [
        'slide1.html',
        'slide2.html',
        'slide3.html',
        'slide4.html',
        'slide5.html',
        'slide6.html'
    ];

    for (const slideFile of slides) {
        console.log(`Processing ${slideFile}...`);
        await html2pptx(path.join(slidesDir, slideFile), pptx);
    }

    const outputPath = path.join(slidesDir, 'Grid_Coordinates_Lesson_1.pptx');
    await pptx.writeFile({ fileName: outputPath });
    console.log(`Presentation created successfully at: ${outputPath}`);
}

createPresentation().catch(err => {
    console.error('Error creating presentation:', err);
    process.exit(1);
});
