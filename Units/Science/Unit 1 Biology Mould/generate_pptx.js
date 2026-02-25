const pptxgen = require('pptxgenjs');
const fs = require('fs');
const path = require('path');
const html2pptx = require('c:/Users/dsuth/OneDrive/Documents/Joshua/.agent/skills/pptx/scripts/html2pptx.js');

async function createLessonPresentation() {
    const pptx = new pptxgen();
    pptx.layout = 'LAYOUT_16x9';
    pptx.title = 'Biology: Mould - Lessons 3 & 4';
    pptx.author = 'Antigravity';

    const slidesDir = path.join(__dirname, 'Lesson_3_4_Presentation');
    const slideFiles = [
        'slide1.html', 'slide2.html', 'slide3.html', 'slide4.html', 'slide5.html',
        'slide6.html', 'slide7.html', 'slide8.html', 'slide9.html'
    ];

    console.log('Starting PowerPoint generation...');

    for (const file of slideFiles) {
        const filePath = path.join(slidesDir, file);
        console.log(`Processing ${file}...`);
        try {
            await html2pptx(filePath, pptx);
        } catch (error) {
            console.error(`Error processing ${file}:`, error);
            throw error;
        }
    }

    const outputFile = 'Lesson_3_4_Environmental_Factors_v2.pptx';
    const outputPath = path.join(__dirname, outputFile);

    await pptx.writeFile({ fileName: outputPath });
    console.log(`Presentation created successfully: ${outputPath}`);
}

createLessonPresentation().catch(err => {
    console.error('Failed to create presentation:', err);
    process.exit(1);
});
