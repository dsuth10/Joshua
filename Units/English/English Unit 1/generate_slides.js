const fs = require('fs');
const path = require('path');

const slidesDir = path.join(__dirname, 'Resources', 'Slides');
if (!fs.existsSync(slidesDir)) {
    fs.mkdirSync(slidesDir, { recursive: true });
}

const commonStyle = `
<style>
    body {
        width: 720pt;
        height: 405pt;
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
        display: flex;
        flex-direction: column;
        background-color: #FFFFFF;
        color: #000000;
        border: 2pt solid #1C2833;
    }
    .header {
        background-color: #1C2833;
        color: #FFFFFF;
        padding: 20pt;
        text-align: center;
    }
    h1 { margin: 0; font-size: 32pt; }
    h2 { font-size: 24pt; color: #2E4053; margin-top: 20pt; }
    .content {
        padding: 40pt;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    p, li { font-size: 18pt; line-height: 1.5; }
    ul { margin-top: 10pt; }
    .example-box {
        background-color: #F4F6F6;
        border-left: 5pt solid #E74C3C;
        padding: 15pt;
        margin-top: 20pt;
    }
    .footer {
        padding: 10pt;
        font-size: 10pt;
        text-align: right;
        color: #AAB7B8;
    }
</style>
`;

const slides = [
    {
        name: 'slide0.html',
        content: `
        <div class="header"><h1>Figurative Language</h1></div>
        <div class="content" style="text-align: center;">
            <p><strong>Year 5 English</strong></p>
            <p>Similes, Metaphors, and Personification</p>
            <div class="example-box">
                <p>Bringing our writing to life!</p>
            </div>
        </div>
        <div class="footer">Joshua Project | English Unit 1</div>
        `
    },
    {
        name: 'slide1.html',
        content: `
        <div class="header"><h1>Learning Intentions</h1></div>
        <div class="content">
            <h2>WALT: We Are Learning To...</h2>
            <ul>
                <li>Identify and use similes, metaphors, and personification to enhance our writing.</li>
            </ul>
            <h2>WILF: What I Look For...</h2>
            <ul>
                <li>I can define each device.</li>
                <li>I can find them in a text.</li>
                <li>I can write my own original examples.</li>
            </ul>
        </div>
        `
    },
    {
        name: 'slide2.html',
        content: `
        <div class="header"><h1>The Simile</h1></div>
        <div class="content">
            <h2>Definition</h2>
            <p>A <strong>simile</strong> compares two different things using the words <strong>"like"</strong> or <strong>"as"</strong>.</p>
            <div class="example-box">
                <p>Example: "The athlete ran as fast as lightning."</p>
            </div>
        </div>
        `
    },
    {
        name: 'slide3.html',
        content: `
        <div class="header"><h1>More Similes</h1></div>
        <div class="content">
            <ul>
                <li>As cool as a cucumber.</li>
                <li>Fought like cats and dogs.</li>
                <li>As blind as a bat.</li>
                <li>Slept like a log.</li>
            </ul>
            <p style="margin-top: 20pt;">Can you think of a simile for a <strong>heavy bag</strong>?</p>
        </div>
        `
    },
    {
        name: 'slide4.html',
        content: `
        <div class="header"><h1>The Metaphor</h1></div>
        <div class="content">
            <h2>Definition</h2>
            <p>A <strong>metaphor</strong> says one thing <strong>is</strong> another thing. It is not literal!</p>
            <div class="example-box">
                <p>Example: "The classroom was a zoo."</p>
            </div>
        </div>
        `
    },
    {
        name: 'slide5.html',
        content: `
        <div class="header"><h1>More Metaphors</h1></div>
        <div class="content">
            <ul>
                <li>You are my sunshine.</li>
                <li>Life is a highway.</li>
                <li>He is a night owl.</li>
                <li>The world is a stage.</li>
            </ul>
            <p style="margin-top: 20pt;">What does it mean if someone says <strong>"Time is money"</strong>?</p>
        </div>
        `
    },
    {
        name: 'slide6.html',
        content: `
        <div class="header"><h1>Personification</h1></div>
        <div class="content">
            <h2>Definition</h2>
            <p><strong>Personification</strong> gives human qualities, feelings, or actions to non-human things.</p>
            <div class="example-box">
                <p>Example: "The wind whispered through the dark trees."</p>
            </div>
        </div>
        `
    },
    {
        name: 'slide7.html',
        content: `
        <div class="header"><h1>More Personification</h1></div>
        <div class="content">
            <ul>
                <li>The alarm clock yelled at me this morning.</li>
                <li>The camera loves her.</li>
                <li>The fire swallowed the entire forest.</li>
                <li>The stars danced in the sky.</li>
            </ul>
        </div>
        `
    },
    // Worksheet questions
    {
        name: 'slide8.html',
        content: `
        <div class="header"><h1>Worksheet Review: Q1</h1></div>
        <div class="content">
            <p><strong>Identify: Simile (S), Metaphor (M), or Personification (P)</strong></p>
            <div class="example-box">
                <p>1. The library was as quiet as a tomb.</p>
            </div>
            <p style="margin-top: 20pt; font-weight: bold; color: #E74C3C;">Answer: Simile (S)</p>
        </div>
        `
    },
    {
        name: 'slide9.html',
        content: `
        <div class="header"><h1>Worksheet Review: Q2</h1></div>
        <div class="content">
            <p><strong>Identify: Simile (S), Metaphor (M), or Personification (P)</strong></p>
            <div class="example-box">
                <p>2. The stars danced playfully in the moonlit sky.</p>
            </div>
            <p style="margin-top: 20pt; font-weight: bold; color: #E74C3C;">Answer: Personification (P)</p>
        </div>
        `
    },
    {
        name: 'slide10.html',
        content: `
        <div class="header"><h1>Worksheet Review: Q3</h1></div>
        <div class="content">
            <p><strong>Identify: Simile (S), Metaphor (M), or Personification (P)</strong></p>
            <div class="example-box">
                <p>3. Life is a roller coaster.</p>
            </div>
            <p style="margin-top: 20pt; font-weight: bold; color: #E74C3C;">Answer: Metaphor (M)</p>
        </div>
        `
    },
    {
        name: 'slide11.html',
        content: `
        <div class="header"><h1>Worksheet Review: Q4</h1></div>
        <div class="content">
            <p><strong>Identify: Simile (S), Metaphor (M), or Personification (P)</strong></p>
            <div class="example-box">
                <p>4. The ancient car groaned as it climbed the steep hill.</p>
            </div>
            <p style="margin-top: 20pt; font-weight: bold; color: #E74C3C;">Answer: Personification (P)</p>
        </div>
        `
    },
    {
        name: 'slide12.html',
        content: `
        <div class="header"><h1>Worksheet Review: Q5</h1></div>
        <div class="content">
            <p><strong>Identify: Simile (S), Metaphor (M), or Personification (P)</strong></p>
            <div class="example-box">
                <p>5. His eyes were like sparkling emeralds.</p>
            </div>
            <p style="margin-top: 20pt; font-weight: bold; color: #E74C3C;">Answer: Simile (S)</p>
        </div>
        `
    },
    {
        name: 'slide13.html',
        content: `
        <div class="header"><h1>Worksheet Review: Transformation 1</h1></div>
        <div class="content">
            <p><strong>Boring:</strong> The rain fell on the roof.</p>
            <div class="example-box" style="border-left-color: #3498DB;">
                <p><strong>Figurative Example:</strong> The rain drummed a rhythmic beat on the tin roof, like a tiny army marching to war.</p>
            </div>
        </div>
        `
    },
    {
        name: 'slide14.html',
        content: `
        <div class="header"><h1>Worksheet Review: Transformation 2</h1></div>
        <div class="content">
            <p><strong>Boring:</strong> The ice cream was cold.</p>
            <div class="example-box" style="border-left-color: #3498DB;">
                <p><strong>Figurative Example:</strong> The ice cream was a frozen block of winter, biting my tongue with every spoonful.</p>
            </div>
        </div>
        `
    },
    {
        name: 'slide15.html',
        content: `
        <div class="header"><h1>Creative Writing Challenge</h1></div>
        <div class="content">
            <p>Write a short paragraph about a storm.</p>
            <p>You MUST include:</p>
            <ul>
                <li>At least one <strong>simile</strong>.</li>
                <li>At least one <strong>metaphor</strong>.</li>
                <li>At least one example of <strong>personification</strong>.</li>
            </ul>
        </div>
        `
    }
];

slides.forEach(slide => {
    const html = `<!DOCTYPE html><html><head>${commonStyle}</head><body>${slide.content}</body></html>`;
    fs.writeFileSync(path.join(slidesDir, slide.name), html);
});

console.log('HTML slides generated.');
