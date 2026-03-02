const pptxgen = require('pptxgenjs');
const fs = require('fs');

async function run() {
    const pptx = new pptxgen();
    pptx.layout = 'LAYOUT_16x9';

    // Slide 1: Title
    let s1 = pptx.addSlide();
    s1.background = { color: '112D4E' };
    s1.addText("Mastering Speech Marks", { x: 0.5, y: 1.0, w: '90%', h: 1, fontSize: 44, color: 'FFFFFF', bold: true, align: 'center' });
    s1.addText("A Guide to Direct Speech & Punctuation", { x: 0.5, y: 2.2, w: '90%', fontSize: 28, color: '3F72AF', align: 'center' });
    s1.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 3.5, w: '100%', h: 0.2, fill: { color: '03A9F4' } });

    // Slide 2: Rule 1
    let s2 = pptx.addSlide();
    s2.addText("Rule 1: The 'Container'", { x: 0.5, y: 0.3, fontSize: 32, color: '112D4E', bold: true });
    s2.addText("Speech marks (\" \") only go around the words that come out of someone's mouth.", { x: 0.5, y: 1.2, w: '90%', fontSize: 24, color: '112D4E' });
    s2.addText("\"I built this plane myself,\" said Dylan.", { x: 0.5, y: 2.8, w: '90%', fontSize: 28, color: '112D4E', italic: true, bold: true });

    // Slide 3: Rule 2
    let s3 = pptx.addSlide();
    s3.addText("Rule 2: Start with a Capital", { x: 0.5, y: 0.3, fontSize: 32, color: '112D4E', bold: true });
    s3.addText("Dylan whispered, \"That is a great throw!\"", { x: 0.5, y: 2.5, w: '90%', fontSize: 28, color: '112D4E', align: 'center' });
    s3.addShape(pptx.shapes.RECTANGLE, { x: 3.5, y: 2.4, w: 0.5, h: 0.6, fill: { color: 'FF9800', transparency: 70 } });

    // Slide 4: Rule 3
    let s4 = pptx.addSlide();
    s4.addText("Rule 3: Punctuation Lives Inside", { x: 0.5, y: 0.3, fontSize: 32, color: '112D4E', bold: true });
    s4.addText("\"Will we win?\" asked Dylan.", { x: 0.5, y: 2.5, w: '90%', fontSize: 28, color: '112D4E', align: 'center' });

    // Slide 5: Rule 4
    let s5 = pptx.addSlide();
    s5.addText("Rule 4: The Reporting Comma", { x: 0.5, y: 0.3, fontSize: 32, color: '112D4E', bold: true });
    s5.addText("Jack said, \"Try holding it like this.\"", { x: 0.5, y: 2.5, w: '90%', fontSize: 28, color: '112D4E', align: 'center' });
    s5.addShape(pptx.shapes.OVAL, { x: 3.0, y: 2.7, w: 0.2, h: 0.2, fill: { color: 'FF9800' } });

    // Slide 6: Variety
    let s6 = pptx.addSlide();
    s6.addText("Variety Check!", { x: 0.5, y: 0.3, fontSize: 32, color: '112D4E', bold: true });
    s6.addText("1. \"Look!\" Kevin pointed at the sky.", { x: 1, y: 1.2, fontSize: 22, color: '112D4E' });
    s6.addText("2. \"I hope,\" Jack sighed, \"that it stays up.\"", { x: 1, y: 2.0, fontSize: 22, color: '112D4E' });

    // Slide 7: Error 1
    let s7 = pptx.addSlide();
    s7.addText("Spot the Error! #1", { x: 0.5, y: 0.3, fontSize: 32, color: 'D32F2F', bold: true });
    s7.addText("dylan said \"keep your arm straight\".", { x: 0.5, y: 2.2, w: '90%', fontSize: 28, color: '112D4E', align: 'center', bold: true });

    // Slide 8: Error 2
    let s8 = pptx.addSlide();
    s8.addText("Spot the Error! #2", { x: 0.5, y: 0.3, fontSize: 32, color: 'D32F2F', bold: true });
    s8.addText("\"I can't believe it\"! yelled Jason.", { x: 0.5, y: 2.2, w: '90%', fontSize: 28, color: '112D4E', align: 'center', bold: true });

    // Slide 9: Error 3
    let s9 = pptx.addSlide();
    s9.addText("Spot the Error! #3", { x: 0.5, y: 0.3, fontSize: 32, color: 'D32F2F', bold: true });
    s9.addText("Grandfather asked \"Are you ready?\"", { x: 0.5, y: 2.2, w: '90%', fontSize: 28, color: '112D4E', align: 'center', bold: true });

    // Slide 10: Error 4
    let s10 = pptx.addSlide();
    s10.addText("Spot the Error! #4", { x: 0.5, y: 0.3, fontSize: 32, color: 'D32F2F', bold: true });
    s10.addText("Kevin shouted, \"watch out!\"", { x: 0.5, y: 2.2, w: '90%', fontSize: 28, color: '112D4E', align: 'center', bold: true });

    // Slide 11: Error 5
    let s11 = pptx.addSlide();
    s11.addText("Spot the Error! #5", { x: 0.5, y: 0.3, fontSize: 32, color: 'D32F2F', bold: true });
    s11.addText("Hold it steady \"said Jack.\"", { x: 0.5, y: 2.2, w: '90%', fontSize: 28, color: '112D4E', align: 'center', bold: true });

    // Slide 12: Error 6
    let s12 = pptx.addSlide();
    s12.addText("Spot the Error! #6", { x: 0.5, y: 0.3, fontSize: 32, color: 'D32F2F', bold: true });
    s12.addText("\"We should go,\" whispered Dylan \"Before it rains.\"", { x: 0.5, y: 2.2, w: '90%', fontSize: 28, color: '112D4E', align: 'center', bold: true });

    // Slide 13: Summary
    let s13 = pptx.addSlide();
    s13.background = { color: '112D4E' };
    s13.addText("13 Slides Ready!", { x: 0.5, y: 1.5, w: '90%', fontSize: 44, color: 'FFFFFF', bold: true, align: 'center' });

    await pptx.writeFile({ fileName: 'c:\\Users\\dsuth\\Documents\\Joshua\\Units\\English\\English Unit 1\\Lesson Speech Marks\\Speech_Marks_Lesson_v2.pptx' });
    console.log('✅ Final Expanded PowerPoint generated successfully.');
}

run().catch(console.error);
