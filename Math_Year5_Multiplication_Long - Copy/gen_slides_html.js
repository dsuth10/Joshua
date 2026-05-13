const fs = require('fs');
const path = require('path');

const slidesDir = path.join(__dirname, 'slides');

const commonStyle = `
  body { width: 720pt; height: 405pt; font-family: Arial; margin: 0; padding: 0; display: flex; flex-direction: column; overflow: hidden; background: white; }
  .header { height: 45pt; background: #180A2D; color: #00D2FF; display: flex; align-items: center; padding: 0 30pt; }
  .header h2 { font-size: 18pt; margin: 0; text-transform: uppercase; }
  .content { flex: 1; padding: 15pt 30pt 40pt 30pt; display: flex; flex-direction: column; }
  h1 { font-size: 24pt; color: #180A2D; margin-bottom: 8pt; margin-top: 0; }
  p { font-size: 16pt; color: #333; line-height: 1.2; margin: 0 0 6pt 0; }
  ul { font-size: 16pt; color: #333; margin: 0 0 8pt 0; }
  li { margin-bottom: 4pt; }
  .algorithm-grid { display: grid; grid-template-columns: repeat(4, 40pt); grid-template-rows: repeat(7, 30pt); border: 1pt solid #ccc; width: fit-content; margin: 5pt 0; background: #f9f9f9; }
  .cell { display: flex; align-items: center; justify-content: center; font-size: 18pt; font-weight: bold; border: 0.5pt solid #eee; }
  .cell p { margin: 0; padding: 0; }
  .magic-zero { color: #FF0000; }
  .highlight-box { background: #D5E8F0; border-radius: 4pt; }
`;

const slides = [
  // Slide 1: Title
  {
    name: 'slide1.html',
    content: `
      <body style="background: #180A2D; color: white; align-items: center; justify-content: center;">
        <img style="width: 140pt; margin-bottom: 10pt;" src="logo.png">
        <h1 style="font-size: 32pt; color: #00D2FF; text-transform: uppercase; margin: 0;">Quantum Quest</h1>
        <p style="font-size: 18pt; color: #AAB7B8; margin: 5pt 0;">Mastering Long Multiplication</p>
        <p style="font-size: 11pt; color: #7F8C8D; margin-top: 20pt;">Engineering Dept | Mission #506</p>
      </body>
    `
  },
  // Slide 2: The Scenario
  {
    name: 'slide2.html',
    content: `
      <body>
        <div class="header"><h2>Mission Briefing</h2></div>
        <div class="content" style="flex-direction: row; align-items: center; gap: 20pt;">
          <div style="flex: 1;">
            <h1>Opening Day Logistics</h1>
            <p>Welcome, Engineers! Quantum Quest is ready to launch, but we need <b>exact numbers</b>.</p>
            <p>If we miscalculate, the park's systems will fail!</p>
            <p>Today, we use the <b>Long Multiplication Algorithm</b> to ensure success.</p>
          </div>
          <img style="width: 220pt; border-radius: 8pt; box-shadow: 5pt 5pt 15pt rgba(0,0,0,0.2);" src="coaster.png">
        </div>
      </body>
    `
  },
  // Slide 3: The Algorithm
  {
    name: 'slide3.html',
    content: `
      <body>
        <div class="header"><h2>The Blueprint</h2></div>
        <div class="content">
          <h1>The 2-Digit Strategy</h1>
          <p>We split the mission into four critical steps:</p>
          <div style="display: flex; gap: 20pt; align-items: flex-start;">
            <ul>
              <li><b>1.</b> Multiply by the <b>units</b> digit.</li>
              <li><b>2.</b> Drop the <span class="magic-zero">Magic Zero</span>.</li>
              <li><b>3.</b> Multiply by the <b>tens</b> digit.</li>
              <li><b>4.</b> Add the results together!</li>
            </ul>
            <div style="background: #E8F8F5; padding: 10pt; border-left: 3pt solid #1ABC9C; border-radius: 6pt;">
              <p style="font-size: 11pt; font-weight: bold; margin-bottom: 4pt;">Example: 36 x 72</p>
              <p style="font-size: 10pt; margin: 0;">Part 1: 36 x 2 = 72</p>
              <p style="font-size: 10pt; margin: 0;">Part 2: 36 x 70 = 2520</p>
              <div style="border-top: 1pt solid #333; margin-top: 2pt;">
                <p style="font-size: 10pt; margin: 0;">Total: 2592</p>
              </div>
            </div>
          </div>
        </div>
      </body>
    `
  },
  // Slide 4: The Magic Zero
  {
    name: 'slide4.html',
    content: `
      <body>
        <div class="header"><h2>Critical Component</h2></div>
        <div class="content" style="align-items: center;">
          <h1 style="color: #FF0000; margin-bottom: 10pt;">Don't Forget the Magic Zero!</h1>
          <p>We add a zero because we are multiplying by a <b>Multiple of 10</b>.</p>
          <div style="display: flex; align-items: center; gap: 20pt; margin-top: 10pt;">
            <div style="border: 2pt dashed #FF0000; border-radius: 60pt; width: 50pt; height: 50pt; display: flex; align-items: center; justify-content: center;">
              <p style="font-size: 28pt; font-weight: bold; color: #FF0000; margin: 0;">0</p>
            </div>
            <div style="font-size: 16pt;">
              <p>Multiplying by <span class="highlight-box" style="padding: 2pt 5pt; background: #D5E8F0;">7</span> in 72?</p>
              <p>Actually, it's <span class="highlight-box" style="padding: 2pt 5pt; background: #D5E8F0;">70</span>!</p>
              <p>The zero keeps our columns aligned.</p>
            </div>
          </div>
        </div>
      </body>
    `
  },
  // Slide 5: I Do Example
  {
    name: 'slide5.html',
    content: `
      <body>
        <div class="header"><h2>Engineering Walkthrough</h2></div>
        <div class="content">
          <h1>Scenario: The Zero-G Cafe</h1>
          <p>24 tables, 53 seats per table. How many total seats?</p>
          <div style="display: flex; gap: 25pt;">
            <div class="algorithm-grid" style="margin-top: 0;">
              <div class="cell"></div><div class="cell"></div><div class="cell"><p>2</p></div><div class="cell"><p>4</p></div>
              <div class="cell"><p>x</p></div><div class="cell"></div><div class="cell"><p>5</p></div><div class="cell"><p>3</p></div>
              <div class="cell" style="grid-column: 1/5; border-bottom: 2pt double black;"></div>
              <div class="cell"></div><div class="cell"></div><div class="cell"><p>7</p></div><div class="cell"><p>2</p></div>
              <div class="cell"><p>1</p></div><div class="cell"><p>2</p></div><div class="cell"><p>0</p></div><div class="cell"><p style="color: #FF0000;">0</p></div>
              <div class="cell" style="grid-column: 1/5; border-bottom: 1pt solid black;"></div>
              <div class="cell"><p>1</p></div><div class="cell"><p>2</p></div><div class="cell"><p>7</p></div><div class="cell"><p>2</p></div>
            </div>
            <div style="padding: 2pt;">
              <p style="font-size: 13pt;">1. 24 x 3 = 72</p>
              <p style="font-size: 13pt;">2. Drop the <span style="color: #FF0000; font-weight: bold;">0</span></p>
              <p style="font-size: 13pt;">3. 24 x 5 = 120</p>
              <p style="font-size: 13pt;">4. Add: 72 + 1200 = 1272</p>
            </div>
          </div>
        </div>
      </body>
    `
  },
  // Slide 6: We Do Practice
  {
    name: 'slide6.html',
    content: `
      <body>
        <div class="header"><h2>Team Check</h2></div>
        <div class="content">
          <h1>Mission: Cosmic Coaster</h1>
          <p>The coaster has <b>43 carriages</b>. Each carriage holds <b>31 riders</b>.</p>
          <p>Work on your boards: How many riders in a full train?</p>
          <div id="working-area" class="placeholder" style="width: 320pt; height: 130pt; margin-top: 5pt; border: 2pt dashed #ccc; background: #eee;"></div>
        </div>
      </body>
    `
  },
  // Slide 7: Differentiated Missions
  {
    name: 'slide7.html',
    content: `
      <body>
        <div class="header"><h2>Choose Your Mission</h2></div>
        <div class="content">
          <h1 style="margin-bottom: 10pt;">Select Your Engineering Role</h1>
          <div style="display: flex; gap: 10pt;">
            <div style="flex: 1; border: 1pt solid #ccc; padding: 6pt; border-radius: 5pt;">
              <h3 style="color: #2ECC71; margin: 0; font-size: 14pt;">Junior Builder</h3>
              <p style="font-size: 10pt;">Guided grids and smaller numbers.</p>
            </div>
            <div style="flex: 1; border: 1pt solid #ccc; padding: 6pt; border-radius: 5pt; background: #FDFEFE;">
              <h3 style="color: #3498DB; margin: 0; font-size: 14pt;">Senior Engineer</h3>
              <p style="font-size: 10pt;">Standard algorithm for logistics.</p>
            </div>
            <div style="flex: 1; border: 1pt solid #ccc; padding: 6pt; border-radius: 5pt;">
              <h3 style="color: #E67E22; margin: 0; font-size: 14pt;">Project Director</h3>
              <p style="font-size: 10pt;">Multi-step budget problems.</p>
            </div>
          </div>
          <p style="margin-top: 15pt; font-style: italic; font-size: 13pt;">"Check your blueprint twice, build once!"</p>
        </div>
      </body>
    `
  },
  // Slide 8: The Error Audit
  {
    name: 'slide8.html',
    content: `
      <body>
        <div class="header"><h2>Quality Control</h2></div>
        <div class="content">
          <h1>Spot the Glitch!</h1>
          <p>12 items at $89 each. Spot the error!</p>
          <div style="display: flex; gap: 20pt;">
            <div class="algorithm-grid" style="margin-top: 0;">
              <div class="cell"></div><div class="cell"></div><div class="cell"><p>8</p></div><div class="cell"><p>9</p></div>
              <div class="cell"><p>x</p></div><div class="cell"></div><div class="cell"><p>1</p></div><div class="cell"><p>2</p></div>
              <div class="cell" style="grid-column: 1/5; border-bottom: 1pt solid black;"></div>
              <div class="cell"></div><div class="cell"><p>1</p></div><div class="cell"><p>7</p></div><div class="cell"><p>8</p></div>
              <div class="cell"></div><div class="cell"></div><div class="cell"><p>8</p></div><div class="cell"><p>9</p></div>
              <div class="cell" style="grid-column: 1/5; border-bottom: 1pt solid black;"></div>
              <div class="cell"></div><div class="cell"><p>2</p></div><div class="cell"><p>6</p></div><div class="cell"><p>7</p></div>
            </div>
            <div style="color: #C0392B; padding-top: 10pt;">
              <p style="font-weight: bold; font-size: 13pt;">CRITICAL ERROR!</p>
              <p style="font-size: 11pt;">What did the engineer forget?</p>
              <p style="font-size: 11pt;">How much money was lost?</p>
            </div>
          </div>
        </div>
      </body>
    `
  },
  // Slide 9: Exit Ticket
  {
    name: 'slide9.html',
    content: `
      <body>
        <div class="header"><h2>Mission Complete?</h2></div>
        <div class="content" style="align-items: center; justify-content: center;">
          <h1 style="margin-bottom: 15pt;">Final Security Code</h1>
          <p>Solve this equation to exit the park:</p>
          <div style="font-size: 32pt; font-weight: bold; color: #180A2D; margin: 12pt;">
            <p>12 x 89 = ?</p>
          </div>
          <p style="font-size: 13pt;">Write your answer on your exit ticket!</p>
        </div>
      </body>
    `
  },
  // Slide 10: Conclusion
  {
    name: 'slide10.html',
    content: `
      <body style="background: #180A2D; color: white; align-items: center; justify-content: center;">
        <img style="width: 100pt; margin-bottom: 8pt;" src="logo.png">
        <h1 style="font-size: 28pt; color: #00D2FF; margin: 0;">Quantum Quest is Ready!</h1>
        <p style="font-size: 14pt; color: #AAB7B8; margin: 4pt 0;">Great job, Engineers. The park is safe.</p>
        <div style="margin-top: 20pt; border-top: 1pt solid #333; padding-top: 8pt;">
          <p style="font-size: 10pt; color: #7F8C8D;">"Precision in practice, excellence in engineering."</p>
        </div>
      </body>
    `
  }
];

slides.forEach(slide => {
  const fullHtml = `
    <!DOCTYPE html>
    <html>
    <head><style>${commonStyle}</style></head>
    ${slide.content}
    </html>
  `;
  fs.writeFileSync(path.join(slidesDir, slide.name), fullHtml);
});

console.log('10 HTML slides regenerated successfully with aggressive vertical reduction.');
