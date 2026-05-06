const fs = require('fs');
const path = require('path');
const dir = "c:\\Users\\dsuth\\Documents\\Joshua\\Units\\English\\English_Unit_2\\Lesson_Plans\\Presentations\\Lesson_15_Slides";

const slides = {
"slide_1.html": `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: 'Arial', sans-serif; margin: 0; box-sizing: border-box; padding: 40pt; width: 720pt; height: 405pt; background: #112d4e; color: #f9f7f7; display: flex; align-items: center; justify-content: center; text-align: center; }
        .container { width: 90%; }
        h1 { font-size: 48pt; color: #f96d00; margin-bottom: 20pt; }
        p.subtitle { font-size: 24pt; color: #3f72af; }
        p.li { margin-top: 40pt; font-size: 18pt; color: #e0e0e0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Lesson 15: Floods</h1>
        <p class="subtitle">Recognising Point of View (POV)</p>
        <p class="li">LI: I can recognise that the point of view in a text influences how readers interpret and respond to it.</p>
    </div>
</body>
</html>`,

"slide_2.html": `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: 'Arial', sans-serif; margin: 0; box-sizing: border-box; padding: 30pt; width: 720pt; height: 405pt; background: #f9f7f7; color: #333; }
        .header-container { border-bottom: 4pt solid #f96d00; margin-bottom: 15pt; }
        h2 { font-size: 28pt; color: #112d4e; margin: 0; padding-bottom: 5pt; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15pt; }
        .box { padding: 12pt; background: #e0e0e0; border-radius: 8pt; }
        p.label { font-weight: bold; color: #f96d00; margin-bottom: 5pt; font-size: 14pt; }
        p.text { font-size: 16pt; margin: 0; }
    </style>
</head>
<body>
    <div class="header-container">
        <h2>Warm-up: Fact or Feeling?</h2>
    </div>
    <div class="grid">
        <div class="box">
            <p class="label">Sentence 1</p>
            <p class="text">"The Brisbane River peaked at 4.46 metres in 2011."</p>
        </div>
        <div class="box">
            <p class="label">Sentence 2</p>
            <p class="text">"The sound of the rushing water was absolutely terrifying."</p>
        </div>
        <div class="box">
            <p class="label">Sentence 3</p>
            <p class="text">"Insurance claims reached $6.4 billion."</p>
        </div>
        <div class="box">
            <p class="label">Sentence 4</p>
            <p class="text">"I felt so helpless watching the mud cover my garden."</p>
        </div>
    </div>
</body>
</html>`,

"slide_3.html": `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: 'Arial', sans-serif; margin: 0; box-sizing: border-box; padding: 40pt; width: 720pt; height: 405pt; background: #112d4e; color: #f9f7f7; }
        h2 { font-size: 32pt; color: #f96d00; }
        .content { margin-top: 30pt; }
        p { font-size: 22pt; line-height: 1.4; margin-bottom: 10pt; }
        ul { list-style-type: none; padding: 0; }
        li { font-size: 22pt; margin-bottom: 15pt; padding-left: 30pt; position: relative; }
        li::before { content: '➔'; position: absolute; left: 0; color: #f96d00; }
    </style>
</head>
<body>
    <h2>What is Point of View (POV)?</h2>
    <div class="content">
        <p>In informative texts, POV is not just about "who is talking." It is about <b>choices</b>:</p>
        <ul>
            <li>What facts are included (and what are left out).</li>
            <li>Which words are used (Scientific vs. Emotional).</li>
            <li>Who is the authority (A witness vs. a researcher).</li>
        </ul>
        <p style="color: #3f72af; margin-top: 20pt;">POV influences how we feel and what we learn.</p>
    </div>
</body>
</html>`,

"slide_4.html": \`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: 'Arial', sans-serif; margin: 0; box-sizing: border-box; padding: 40pt; width: 720pt; height: 405pt; background: #f9f7f7; color: #333; }
        h2 { font-size: 28pt; color: #f96d00; margin-bottom: 10pt; }
        .quote-container { background: #fff; padding: 20pt; border-left: 10pt solid #f96d00; border-radius: 4pt; }
        p.quote { font-size: 18pt; font-style: italic; line-height: 1.4; margin: 0; }
        .analysis { margin-top: 20pt; display: flex; gap: 10pt; }
        .chip { background: #112d4e; padding: 5pt 12pt; border-radius: 20pt; }
        .chip p { color: #fff; font-size: 14pt; margin: 0; }
    </style>
</head>
<body>
    <h2>Source A: The Survivor's Voice</h2>
    <div class="quote-container">
        <p class="quote">"I stood in the hallway, looking at twenty years of memories and knowing I couldn't save them... Watching the water seep into the floorboards felt like watching someone slowly take my home away."</p>
    </div>
    <div class="analysis">
        <div class="chip"><p>Subjective</p></div>
        <div class="chip"><p>First-Person ("I")</p></div>
        <div class="chip"><p>Emotional Vocabulary</p></div>
        <div class="chip"><p>Sensory Details</p></div>
    </div>
</body>
</html>\`,

"slide_5.html": \`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: 'Arial', sans-serif; margin: 0; box-sizing: border-box; padding: 40pt; width: 720pt; height: 405pt; background: #f9f7f7; color: #333; }
        h2 { font-size: 28pt; color: #3f72af; margin-bottom: 10pt; }
        .text-container { background: #fff; padding: 20pt; border-left: 10pt solid #3f72af; border-radius: 4pt; }
        p.text { font-size: 18pt; line-height: 1.4; margin: 0; }
        .analysis { margin-top: 20pt; display: flex; gap: 10pt; }
        .chip { background: #112d4e; padding: 5pt 12pt; border-radius: 20pt; }
        .chip p { color: #fff; font-size: 14pt; margin: 0; }
    </style>
</head>
<body>
    <h2>Source B: The Scientist's Voice</h2>
    <div class="text-container">
        <p class="text">"The Deloitte report estimated the social and financial cost of the 2022 floods at A$7.7 billion... Beyond the immediate loss of life (46 fatalities), the compounding effects on community mental health have been substantial."</p>
    </div>
    <div class="analysis">
        <div class="chip"><p>Objective</p></div>
        <div class="chip"><p>Third-Person</p></div>
        <div class="chip"><p>Technical Vocabulary</p></div>
        <div class="chip"><p>Statistical Data</p></div>
    </div>
</body>
</html>\`,

"slide_6.html": `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: 'Arial', sans-serif; margin: 0; box-sizing: border-box; padding: 40pt; width: 720pt; height: 405pt; background: #112d4e; color: #f9f7f7; }
        h2 { font-size: 32pt; color: #f96d00; text-align: center; margin-bottom: 20pt; }
        .table { display: grid; grid-template-columns: 1fr 1fr 1fr; border: 1pt solid #3f72af; }
        .cell { padding: 10pt; border: 0.5pt solid #3f72af; }
        p { font-size: 14pt; margin: 0; }
        .header { background: #3f72af; font-weight: bold; }
    </style>
</head>
<body>
    <h2>Authorial Choices</h2>
    <div class="table">
        <div class="cell header"><p>Choice</p></div>
        <div class="cell header"><p>Source A (Survivor)</p></div>
        <div class="cell header"><p>Source B (Archive)</p></div>
        
        <div class="cell"><p><b>Vocabulary</b></p></div>
        <div class="cell"><p>Terrifying, memories, home</p></div>
        <div class="cell"><p>Fatality, sediment, GDP</p></div>
        
        <div class="cell"><p><b>Sentences</b></p></div>
        <div class="cell"><p>"I stood...", "Watching..."</p></div>
        <div class="cell"><p>"The report...", "In 2011..."</p></div>
        
        <div class="cell"><p><b>Focus</b></p></div>
        <div class="cell"><p>Personal loss & feelings</p></div>
        <div class="cell"><p>Global impact & stats</p></div>
    </div>
</body>
</html>`,

"slide_7.html": `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: 'Arial', sans-serif; margin: 0; box-sizing: border-box; padding: 40pt; width: 720pt; height: 405pt; background: #f9f7f7; color: #333; }
        h2 { font-size: 32pt; color: #112d4e; margin-bottom: 20pt; }
        .box { background: #fff; border: 4pt solid #f96d00; padding: 25pt; border-radius: 12pt; }
        p { font-size: 20pt; line-height: 1.6; margin: 0; }
        span.highlight { color: #f96d00; font-weight: bold; }
    </style>
</head>
<body>
    <h2>Modelling Analysis</h2>
    <div class="box">
        <p>"The author's point of view in the Floods Archive is <span class="highlight">objective and authoritative</span>. I can tell because they use <span class="highlight">specialist vocabulary</span> like 'socio-economic disruption' and provide <span class="highlight">statistical evidence</span> from sources like the World Bank to support their claims."</p>
    </div>
</body>
</html>`,

"slide_8.html": `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: 'Arial', sans-serif; margin: 0; box-sizing: border-box; padding: 30pt; width: 720pt; height: 405pt; background: #112d4e; color: #f9f7f7; }
        h2 { font-size: 28pt; color: #f96d00; text-align: center; margin-bottom: 10pt; }
        .checklist { margin-top: 10pt; }
        .item { margin-bottom: 8pt; display: flex; align-items: center; }
        .checkbox { width: 25pt; height: 25pt; border: 2pt solid #f96d00; margin-right: 15pt; border-radius: 4pt; flex-shrink: 0; }
        p { font-size: 18pt; margin: 0; }
    </style>
</head>
<body>
    <h2>Success Criteria: How did you go?</h2>
    <div class="checklist">
        <div class="item"><div class="checkbox"></div> <p>I can define "Point of View" in my own words.</p></div>
        <div class="item"><div class="checkbox"></div> <p>I can spot the difference between facts and feelings.</p></div>
        <div class="item"><div class="checkbox"></div> <p>I can identify an author's POV using clues in the text.</p></div>
        <div class="item"><div class="checkbox"></div> <p>I can compare two texts about the same event.</p></div>
    </div>
</body>
</html>`
};

for (const [name, content] of Object.entries(slides)) {
    fs.writeFileSync(path.join(dir, name), content);
    console.log(`Updated ${name}`);
}
