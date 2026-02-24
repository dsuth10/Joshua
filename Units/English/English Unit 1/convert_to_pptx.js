const pptxgen = require('pptxgenjs');
const path = require('path');
const fs = require('fs');

// Note: In this environment, we may need to use a slightly different approach 
// if html2pptx is not working as expected, but I will try to use the library first.
// However, since I don't have the library path easily, I'll use pptxgenjs directly 
// for simplicity and reliability if it's already installed.
// Wait, the skill says: const html2pptx = require('./html2pptx'); 
// and I found it at c:\\Users\\dsuth\\Documents\\Joshua\\.agent\\skills\\pptx\\scripts\\html2pptx.js

const html2pptxPath = "c:\\Users\\dsuth\\Documents\\Joshua\\.agent\\skills\\pptx\\scripts\\html2pptx.js";
const html2pptx = require(html2pptxPath);

async function createPresentation() {
    const pptx = new pptxgen();
    pptx.layout = 'LAYOUT_16x9';
    pptx.author = 'Antigravity Assistant';
    pptx.title = 'Figurative Language - Year 5 English';

    const slidesDir = path.join(__dirname, 'Resources', 'Slides');
    const slideFiles = fs.readdirSync(slidesDir).filter(f => f.endsWith('.html')).sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)[0]);
        const numB = parseInt(b.match(/\d+/)[0]);
        return numA - numB;
    });

    for (const file of slideFiles) {
        console.log(`Processing ${file}...`);
        await html2pptx(path.join(slidesDir, file), pptx);
    }

    const outputPath = path.join(__dirname, 'Resources', 'figurative_language_presentation.pptx');
    await pptx.writeFile({ fileName: outputPath });
    console.log(`Presentation created at: ${outputPath}`);
}

createPresentation().catch(err => {
    console.error("Error creating presentation:", err);
    process.exit(1);
});
