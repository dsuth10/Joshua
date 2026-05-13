const pptxgen = require('pptxgenjs');
const fs = require('fs');
const path = require('path');
const html2pptx = require('c:\\Users\\dsuth\\Documents\\Joshua\\.agent\\skills\\pptx\\scripts\\html2pptx');

async function run() {
    const baseDir = "c:\\Users\\dsuth\\Documents\\Joshua\\Units\\English\\English_Unit_2\\Lesson_Plans\\Presentations";
    const slidesDir = path.join(baseDir, "Lesson_12_Slides");
    const outputPptx = path.join(baseDir, "Lesson_12_Presentation.pptx");

    const slideFiles = [
        "slide1.html", "slide2.html", "slide3.html", "slide4.html", "slide5.html",
        "slide6.html", "slide7.html", "slide8.html", "slide9.html", "slide10.html"
    ];

    console.log("Converting HTML slides to PPTX...");
    const pptx = new pptxgen();
    pptx.layout = 'LAYOUT_16x9';

    for (const file of slideFiles) {
        const slidePath = path.join(slidesDir, file);
        console.log(`Processing ${file}...`);
        await html2pptx(slidePath, pptx);
    }

    await pptx.writeFile({ fileName: outputPptx });
    console.log(`✅ Presentation generated at: ${outputPptx}`);
}

run().catch(console.error);
