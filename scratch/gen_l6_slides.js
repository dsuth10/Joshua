const pptx = require('pptxgenjs');
const fs = require('fs');

let pres = new pptx();

// Slide 1: Title
let slide1 = pres.addSlide();
slide1.addText("Lesson 6: Introducing Tropical Cyclones", { x: 0.5, y: 1.0, w: 9.0, h: 1.0, fontSize: 44, bold: true, align: 'center', color: '363636' });
slide1.addText("Science Unit 2: Natural Disasters", { x: 0.5, y: 2.5, w: 9.0, h: 0.5, fontSize: 24, align: 'center', color: '7F7F7F' });

// Slide 2: What is a cyclone?
let slide2 = pres.addSlide();
slide2.addText("What is a Tropical Cyclone?", { x: 0.5, y: 0.2, fontSize: 36, bold: true });
slide2.addImage({ path: "../../English/English_Unit_2/Resources/Website/Cyclones/Cyclone_Yasi/hero.png", x: 0.5, y: 1.0, w: 5.0, h: 4.0 });
slide2.addText("A tropical cyclone is a low-pressure system that forms over warm tropical waters.", { x: 5.8, y: 1.5, w: 3.5, fontSize: 18 });
slide2.addText("Key Feature: The Eye (calm centre).", { x: 5.8, y: 3.0, w: 3.5, fontSize: 18, bold: true });

// Slide 3: Yasi Satellite View
let slide3 = pres.addSlide();
slide3.addText("Satellite View: Cyclone Yasi", { x: 0.5, y: 0.2, fontSize: 36, bold: true });
slide3.addImage({ path: "../../English/English_Unit_2/Resources/Website/Cyclones/Cyclone_Larry/Larry.A2006078.0025.250m-small.png", x: 1.5, y: 1.0, w: 7.0, h: 4.0 });

// Slide 4: Cyclone vs Hurricane vs Typhoon
let slide4 = pres.addSlide();
slide4.addText("Terminology", { x: 0.5, y: 0.2, fontSize: 36, bold: true });
slide4.addTable([
    [{ text: "Term", options: { bold: true } }, { text: "Location", options: { bold: true } }],
    ["Cyclone", "South Pacific, Indian Ocean"],
    ["Hurricane", "Atlantic, Northeast Pacific"],
    ["Typhoon", "Northwest Pacific"]
], { x: 0.5, y: 1.5, w: 9.0 });

// Slide 5: Cyclone Categories
let slide5 = pres.addSlide();
slide5.addText("Cyclone Categories", { x: 0.5, y: 0.2, fontSize: 36, bold: true });
slide5.addTable([
    [{ text: "Category", options: { bold: true } }, { text: "Wind Gusts (km/h)", options: { bold: true } }, { text: "Impact", options: { bold: true } }],
    ["1", "Less than 125", "Minor damage"],
    ["2", "125 - 164", "Significant damage"],
    ["3", "165 - 224", "Structural damage"],
    ["4", "225 - 279", "Extreme damage"],
    ["5", "More than 280", "Widespread destruction"]
], { x: 0.5, y: 1.5, w: 9.0 });

// Slide 6: Devastation
let slide6 = pres.addSlide();
slide6.addText("Impact: Cyclone Larry", { x: 0.5, y: 0.2, fontSize: 36, bold: true });
slide6.addImage({ path: "../../English/English_Unit_2/Resources/Website/Cyclones/Cyclone_Larry/Devastation.png", x: 1.0, y: 1.0, w: 8.0, h: 4.0 });

// Slide 7: Storm Surge
let slide7 = pres.addSlide();
slide7.addText("Storm Surge", { x: 0.5, y: 0.2, fontSize: 36, bold: true });
slide7.addImage({ path: "../../English/English_Unit_2/Resources/Website/Cyclones/Cyclone_Yasi/surge.png", x: 1.0, y: 1.0, w: 8.0, h: 4.0 });

// Slide 8: Fast Facts
let slide8 = pres.addSlide();
slide8.addText("Cyclone Fast Facts", { x: 0.5, y: 0.2, fontSize: 36, bold: true });
slide8.addImage({ path: "../../English/English_Unit_2/Resources/Website/Cyclones/Screenshots/fast_facts.png", x: 1.0, y: 1.0, w: 8.0, h: 2.0 });

pres.writeFile({ fileName: "Lessons_06_08/Lesson_06/Lesson_06_Slides.pptx" });
