const pptxgen = require('pptxgenjs');
const path = require('path');

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_16x9';
pptx.author = 'Antigravity Assistant';
pptx.title = 'Figurative Language - Year 5 English';

const COLORS = {
    NAVY: '1C2833',
    SLATE: '2E4053',
    RED: 'E74C3C',
    LIGHT_GRAY: 'F4F6F6',
    WHITE: 'FFFFFF',
    BLACK: '000000',
    BLUE: '3498DB'
};

function addTitleSlide(title, subtitle, extra) {
    let slide = pptx.addSlide();
    slide.background = { fill: COLORS.WHITE };
    slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: '100%', h: 1.2, fill: { color: COLORS.NAVY } });
    slide.addText(title, { x: 0, y: 0, w: '100%', h: 1.2, align: 'center', color: COLORS.WHITE, bold: true, fontSize: 36 });
    slide.addText(subtitle, { x: 1, y: 2, w: 8, h: 1, align: 'center', fontSize: 24, bold: true });
    slide.addText(extra, { x: 1, y: 2.8, w: 8, h: 1, align: 'center', fontSize: 18 });
    slide.addShape(pptx.shapes.RECTANGLE, { x: 2, y: 4, w: 6, h: 1, fill: { color: COLORS.LIGHT_GRAY }, line: { color: COLORS.RED, width: 2 } });
    slide.addText("Bringing our writing to life!", { x: 2, y: 4, w: 6, h: 1, align: 'center', fontSize: 18, italic: true });
}

function addContentSlide(title, items, sections = []) {
    let slide = pptx.addSlide();
    slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: '100%', h: 1, fill: { color: COLORS.NAVY } });
    slide.addText(title, { x: 0, y: 0, w: '100%', h: 1, align: 'center', color: COLORS.WHITE, bold: true, fontSize: 32 });
    let yPos = 1.2;
    sections.forEach(sec => {
        slide.addText(sec.header, { x: 0.5, y: yPos, w: 9, h: 0.5, fontSize: 24, bold: true, color: COLORS.SLATE });
        yPos += 0.5;
        slide.addText(sec.text, { x: 0.5, y: yPos, w: 9, h: 0.5, fontSize: 20 });
        yPos += 0.7;
        if (sec.example) {
            slide.addShape(pptx.shapes.RECTANGLE, { x: 0.5, y: yPos, w: 9, h: 0.8, fill: { color: COLORS.LIGHT_GRAY }, line: { color: COLORS.RED, width: 2 } });
            slide.addText(`Example: ${sec.example}`, { x: 0.7, y: yPos, w: 8.6, h: 0.8, fontSize: 18, italic: true });
            yPos += 1;
        }
    });
    if (items && items.length > 0) {
        slide.addText(items.map(i => ({ text: i, options: { bullet: true, fontSize: 20 } })), { x: 0.5, y: yPos, w: 9, h: 2.5 });
    }
}

function addReviewSlide(title, question, answer) {
    let slide = pptx.addSlide();
    slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: '100%', h: 1, fill: { color: COLORS.NAVY } });
    slide.addText(title, { x: 0, y: 0, w: '100%', h: 1, align: 'center', color: COLORS.WHITE, bold: true, fontSize: 32 });
    slide.addText("Identify: Simile (S), Metaphor (M), or Personification (P)", { x: 0.5, y: 1.2, w: 9, h: 0.5, fontSize: 20, bold: true });
    slide.addShape(pptx.shapes.RECTANGLE, { x: 1, y: 2, w: 8, h: 1.5, fill: { color: COLORS.LIGHT_GRAY }, line: { color: COLORS.RED, width: 2 } });
    slide.addText(question, { x: 1.2, y: 2, w: 7.6, h: 1.5, align: 'center', fontSize: 24 });
    slide.addText(`Answer: ${answer}`, { x: 0.5, y: 4, w: 9, h: 1, align: 'center', fontSize: 28, bold: true, color: COLORS.RED });
}

// Slides
addTitleSlide("Figurative Language", "Year 5 English", "Similes, Metaphors, and Personification");
addContentSlide("Learning Intentions", [], [
    { header: "WALT: We Are Learning To...", text: "Identify and use similes, metaphors, and personification to enhance our writing." },
    { header: "WILF: What I Look For...", text: "I can define each device, find them in text, and write my own examples." }
]);
addContentSlide("The Simile", [], [{ header: "Definition", text: "A simile compares two different things using 'like' or 'as'.", example: "\"The athlete ran as fast as lightning.\"" }]);
addContentSlide("More Similes", ["As cool as a cucumber.", "Fought like cats and dogs.", "As blind as a bat.", "Slept like a log."]);
addContentSlide("The Metaphor", [], [{ header: "Definition", text: "A metaphor says one thing IS another thing. It is not literal!", example: "\"The classroom was a zoo.\"" }]);
addContentSlide("More Metaphors", ["You are my sunshine.", "Life is a highway.", "He is a night owl.", "The world is a stage."]);
addContentSlide("Personification", [], [{ header: "Definition", text: "Personification gives human qualities to non-human things.", example: "\"The wind whispered through the dark trees.\"" }]);
addContentSlide("More Personification", ["The alarm clock yelled at me.", "The camera loves her.", "The fire swallowed the forest.", "The stars danced."]);

// Review Q1-Q10
addReviewSlide("Worksheet Review: Q1", "1. The library was as quiet as a tomb.", "Simile (S)");
addReviewSlide("Worksheet Review: Q2", "2. The stars danced playfully in the moonlit sky.", "Personification (P)");
addReviewSlide("Worksheet Review: Q3", "3. Life is a roller coaster.", "Metaphor (M)");
addReviewSlide("Worksheet Review: Q4", "4. The ancient car groaned as it climbed the hill.", "Personification (P)");
addReviewSlide("Worksheet Review: Q5", "5. His eyes were like sparkling emeralds.", "Simile (S)");
addReviewSlide("Worksheet Review: Q6", "6. The ocean's waves reached out and grabbed the sand.", "Personification (P)");
addReviewSlide("Worksheet Review: Q7", "7. He has a heart of stone.", "Metaphor (M)");
addReviewSlide("Worksheet Review: Q8", "8. The clouds were like giant marshmallows.", "Simile (S)");
addReviewSlide("Worksheet Review: Q9", "9. The moon was a glowing lantern in the sky.", "Metaphor (M)");
addReviewSlide("Worksheet Review: Q10", "10. The skyscrapers poked their heads into the clouds.", "Personification (P)");

const outputPath = path.join(__dirname, 'Resources', 'figurative_language_presentation.pptx');
pptx.writeFile({ fileName: outputPath }).then(() => {
    console.log(`Presentation created at: ${outputPath}`);
}).catch(err => {
    console.error(err);
});
