const pptxgen = require('pptxgenjs');
const html2pptx = require('c:\\Users\\dsuth\\Documents\\Joshua\\.agent\\skills\\pptx\\scripts\\html2pptx');
const path = require('path');

async function generatePresentation() {
    const pptx = new pptxgen();
    pptx.layout = 'LAYOUT_16x9';

    const slidesDir = path.join(__dirname, 'slides');
    const slideFiles = [
        'slide1.html', 'slide2.html', 'slide3.html', 'slide4.html', 'slide5.html',
        'slide6.html', 'slide7.html', 'slide8.html', 'slide9.html', 'slide10.html'
    ];

    for (const file of slideFiles) {
        const filePath = path.join(slidesDir, file);
        console.log(`Processing ${file}...`);
        try {
            await html2pptx(filePath, pptx);
            console.log(`Successfully processed ${file}`);
        } catch (error) {
            console.error(`Error processing ${file}:`, error);
        }
    }

    const outputName = "c:/Users/dsuth/Documents/Joshua/random_lessons/Year-5-Persuasive-Writing/Lesson_Presentation.pptx";
    await pptx.writeFile({ fileName: outputName });
    console.log(`Presentation saved to ${outputName}`);
}

generatePresentation().catch(console.error);
