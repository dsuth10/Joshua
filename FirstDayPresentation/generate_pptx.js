const pptxgen = require('pptxgenjs');
const path = require('path');
const fs = require('fs');

// Path to the html2pptx library
const html2pptx = require('./html2pptx_local.js');

console.log("Playwright version in use:", require('playwright/package.json').version);
console.log("Playwright path:", require.resolve('playwright'));

async function createPresentation() {
    console.log("Starting PowerPoint generation...");
    const pptx = new pptxgen();
    pptx.layout = 'LAYOUT_16x9';
    pptx.author = 'Antigravity';
    pptx.title = 'Welcome to 5C 2026';

    const slides = [
        'slide1.html',
        'slide2.html'
    ];

    for (const htmlFile of slides) {
        console.log(`Processing ${htmlFile}...`);
        const fullPath = path.resolve(__dirname, htmlFile);
        if (!fs.existsSync(fullPath)) {
            throw new Error(`HTML file not found: ${fullPath}`);
        }
        await html2pptx(fullPath, pptx);
    }

    const outputName = 'Class_5C_2026_Welcome.pptx';
    await pptx.writeFile({ fileName: outputName });
    console.log(`Presentation created successfully: ${outputName}`);
}

createPresentation().catch(err => {
    console.error("Error creating presentation:");
    console.error(err);
    process.exit(1);
});
