const pptxgen = require('pptxgenjs');
const path = require('path');
const html2pptx = require('c:\\Users\\dsuth\\Documents\\Joshua\\.agent\\skills\\pptx\\scripts\\html2pptx');

async function run() {
    const baseDir = "c:\\Users\\dsuth\\Documents\\Joshua\\Units\\English\\English_Unit_2\\Lesson_Plans\\Presentations";
    const slidesDir = path.join(baseDir, "Lesson_13_Slides");
    const outputPptx = path.join(baseDir, "Lesson_13_Presentation.pptx");

    const slideFiles = [
        "slide_1.html", "slide_2.html", "slide_3.html", "slide_4.html", "slide_5.html",
        "slide_6.html", "slide_7.html", "slide_8.html", "slide_9.html", "slide_10.html"
    ];

    console.log("Converting Lesson 13 HTML slides to PPTX...");
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
