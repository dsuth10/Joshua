const fs = require('fs');
const path = require('path');
const dir = "c:\\Users\\dsuth\\Documents\\Joshua\\Units\\English\\English_Unit_2\\Lesson_Plans\\Presentations\\Lesson_15_Slides";
const files = ["slide_1.html", "slide_2.html", "slide_3.html", "slide_4.html", "slide_5.html", "slide_6.html", "slide_7.html"];

files.forEach(file => {
    const p = path.join(dir, file);
    let content = fs.readFileSync(p, 'utf8');
    content = content.replace('margin: 0;', 'margin: 0; box-sizing: border-box;');
    fs.writeFileSync(p, content);
    console.log(`Fixed ${file}`);
});
