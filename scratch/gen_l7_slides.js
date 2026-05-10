const pptx = require('pptxgenjs');
const fs = require('fs');

let pres = new pptx();

// Slide 1: Title
pres.addSlide().addText("Lesson 7: Structure & Convection", { x: 0.5, y: 1.0, w: 9.0, h: 1.0, fontSize: 44, bold: true, align: 'center' });

// Slide 2: Recall Quiz
let slide2 = pres.addSlide();
slide2.addText("Recall Quiz", { x: 0.5, y: 0.2, fontSize: 36, bold: true });
slide2.addText("1. Min sea temp? (26.5°C)\n2. Wind speed? (62 km/h)\n3. Australia term? (Cyclone)\n4. Rotation direction? (Clockwise)\n5. Calm centre? (Eye)", { x: 1.0, y: 1.5, fontSize: 24 });

// Slide 3: Structure
let slide3 = pres.addSlide();
slide3.addText("Cyclone Structure", { x: 0.5, y: 0.2, fontSize: 36, bold: true });
slide3.addText("- Eye: Calm centre, low pressure\n- Eye Wall: Strongest winds\n- Rain Bands: Spiral arms of rain", { x: 1.0, y: 1.5, fontSize: 24 });

// Slide 4: Tracy Aftermath
let slide4 = pres.addSlide();
slide4.addText("Aftermath: Cyclone Tracy", { x: 0.5, y: 0.2, fontSize: 36, bold: true });
slide4.addImage({ path: "../../English/English_Unit_2/Resources/Website/Cyclones/Cyclone_Tracy/Suburb.png", x: 1.0, y: 1.0, w: 8.0, h: 4.0 });

// Slide 5: Althea
let slide5 = pres.addSlide();
slide5.addText("Failure: Cyclone Althea", { x: 0.5, y: 0.2, fontSize: 36, bold: true });
slide5.addImage({ path: "../../English/English_Unit_2/Resources/Website/Cyclones/Cyclone_Althea/hero.png", x: 1.0, y: 1.0, w: 8.0, h: 4.0 });

// Slide 6: Convection
let slide6 = pres.addSlide();
slide6.addText("Convection Currents", { x: 0.5, y: 0.2, fontSize: 36, bold: true });
slide6.addText("1. Warm fluid RISES (less dense)\n2. Cool fluid SINKS (more dense)\n3. Circular movement forms.", { x: 1.0, y: 1.5, fontSize: 24 });

pres.writeFile({ fileName: "Lessons_06_08/Lesson_07/Lesson_07_Slides.pptx" });
