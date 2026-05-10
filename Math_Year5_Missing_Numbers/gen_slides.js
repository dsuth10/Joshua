const pptxgen = require('pptxgenjs');
const path = require('path');
const fs = require('fs');
const html2pptx = require('c:/Users/dsuth/Documents/Joshua/.agent/skills/pptx/scripts/html2pptx.js');

async function generateSlides() {
    const pptx = new pptxgen();
    pptx.layout = 'LAYOUT_16x9';
    pptx.title = 'Finding Missing Numbers';
    pptx.author = 'Antigravity AI';

    const slidesDir = path.join(__dirname, 'slides');
    const slideFiles = [
        'slide1.html', 'slide2.html', 'slide3.html', 'slide4.html',
        'slide5.html', 'slide6.html', 'slide7.html', 'slide8.html'
    ];

    for (const file of slideFiles) {
        console.log(`Processing ${file}...`);
        const htmlPath = path.join(slidesDir, file);
        await html2pptx(htmlPath, pptx);
    }

    await pptx.writeFile({ fileName: 'Finding_Missing_Numbers_Slides.pptx' });
    console.log('Presentation generated successfully: Finding_Missing_Numbers_Slides.pptx');
}

generateSlides().catch(err => {
    console.error('Error generating slides:', err);
    process.exit(1);
});
