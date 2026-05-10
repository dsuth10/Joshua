const pptx = require('pptxgenjs');
const fs = require('fs');

let pres = new pptx();

// Slide 1: Title
pres.addSlide().addText("Lesson 8: Modelling Cyclones", { x: 0.5, y: 1.0, w: 9.0, h: 1.0, fontSize: 44, bold: true, align: 'center' });

// Slide 2: Rotation
let slide2 = pres.addSlide();
slide2.addText("Why do they spin?", { x: 0.5, y: 0.2, fontSize: 36, bold: true });
slide2.addText("The Coriolis Effect: Earth's rotation deflects air.\nSouthern Hemisphere = CLOCKWISE", { x: 1.0, y: 1.5, fontSize: 24 });

// Slide 3: George
let slide3 = pres.addSlide();
slide3.addText("Cyclone George (2007)", { x: 0.5, y: 0.2, fontSize: 36, bold: true });
slide3.addImage({ path: "../../English/English_Unit_2/Resources/Website/Cyclones/Cyclone_George/hero.png", x: 1.0, y: 1.0, w: 8.0, h: 4.0 });

// Slide 4: George Infrastructure
let slide4 = pres.addSlide();
slide4.addText("Mining Damage: Cyclone George", { x: 0.5, y: 0.2, fontSize: 36, bold: true });
slide4.addImage({ path: "../../English/English_Unit_2/Resources/Website/Cyclones/Cyclone_George/mine-damage.png", x: 1.0, y: 1.0, w: 8.0, h: 4.0 });

// Slide 5: Mahina
let slide5 = pres.addSlide();
slide5.addText("Deadliest: Cyclone Mahina", { x: 0.5, y: 0.2, fontSize: 36, bold: true });
slide5.addImage({ path: "../../English/English_Unit_2/Resources/Website/Cyclones/Cyclone_Mahina/hero.png", x: 1.0, y: 1.0, w: 8.0, h: 4.0 });

// Slide 6: Timeline
let slide6 = pres.addSlide();
slide6.addText("Cyclone History Timeline", { x: 0.5, y: 0.2, fontSize: 36, bold: true });
slide6.addImage({ path: "../../English/English_Unit_2/Resources/Website/Cyclones/Screenshots/timeline.png", x: 1.0, y: 1.0, w: 8.0, h: 2.0 });

pres.writeFile({ fileName: "Lessons_06_08/Lesson_08/Lesson_08_Slides.pptx" });
