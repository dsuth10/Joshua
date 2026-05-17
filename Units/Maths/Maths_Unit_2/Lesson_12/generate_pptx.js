const fs = require('fs');
const path = require('path');
const pptxgen = require('pptxgenjs');
const html2pptx = require('c:/Users/dsuth/Documents/Joshua/.agent/skills/pptx/scripts/html2pptx.js');

const buildDir = path.join(__dirname, 'build');
if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir);
}

const css = `
html { background: #ffffff; margin: 0; padding: 0; }
body {
  width: 720pt; height: 405pt; margin: 0; padding: 0;
  background: #f7fafc; font-family: Arial, sans-serif;
  display: flex; flex-direction: column; box-sizing: border-box;
}
.slide-container {
  width: 100%; height: 100%; padding: 20pt 30pt; box-sizing: border-box;
  display: flex; flex-direction: column; justify-content: space-between;
}
.header {
  background: #276749; padding: 12pt 20pt; border-radius: 0 0 15pt 15pt;
  box-shadow: 0 4pt 6pt rgba(0,0,0,0.1);
  margin-bottom: 10pt;
}
.title { color: #ffffff; font-size: 24pt; margin: 0; font-weight: bold; }
.content-box {
  background: #ffffff; margin: 10pt; padding: 15pt;
  border-radius: 12pt; border: 1pt solid #e2e8f0;
  box-shadow: 0 2pt 4pt rgba(0,0,0,0.05);
  flex-grow: 1;
}
.vocab-card {
  background: #ebf9f1; border-left: 5pt solid #38a169;
  padding: 10pt; margin-bottom: 8pt; border-radius: 4pt;
}
.vocab-term { font-weight: bold; color: #276749; font-size: 16pt; }
.vocab-def { color: #2d3748; font-size: 13pt; margin-top: 4pt; }
p, li {
  color: #2d3748; font-size: 13pt; margin: 0; line-height: 1.45;
}
`;

const slides = [
    {
        name: 'slide1',
        html: `<!DOCTYPE html><html><head><style>${css}</style></head><body>
            <div style="width: 100%; height: 100%; background: #276749; text-align: center; padding-top: 130pt; box-sizing: border-box;">
                <h1 style="color: #ffffff; font-size: 42pt; margin: 0 0 10pt 0;">Lesson 12: Planning a Fundraiser</h1>
                <p style="color: #c6f6d5; font-size: 20pt; margin: 0;">Maths Unit 2 • Financial Modelling</p>
                <div style="margin-top: 40pt; color: #f0fff4; font-size: 14pt; border-top: 1pt solid #48bb78; display: inline-block; padding-top: 10pt;">
                    <p style="margin: 0; color: #c6f6d5;">Year 5 Mathematics • AC9M5N09</p>
                </div>
            </div>
        </body></html>`
    },
    {
        name: 'slide2',
        html: `<!DOCTYPE html><html><head><style>${css}</style></head><body>
            <div class="header"><h1 class="title">The "Big Three" Vocabulary</h1></div>
            <div class="content-box">
                <div class="vocab-card">
                    <div class="vocab-term"><p style="margin: 0;">1. Income</p></div>
                    <div class="vocab-def"><p style="margin: 0;">The total money you receive from people paying for your activity. (Money IN)</p></div>
                </div>
                <div class="vocab-card">
                    <div class="vocab-term"><p style="margin: 0;">2. Expenses</p></div>
                    <div class="vocab-def"><p style="margin: 0;">The money you have to spend to buy ingredients, supplies, or equipment. (Money OUT)</p></div>
                </div>
                <div class="vocab-card" style="background: #fffaf0; border-left-color: #ed8936;">
                    <div class="vocab-term" style="color: #c05621;"><p style="margin: 0;">3. Profit</p></div>
                    <div class="vocab-def"><p style="margin: 0;">The money left over for your goal after you have paid all your expenses.</p></div>
                    <div style="font-weight: bold; font-size: 20pt; margin-top: 10pt; text-align: center; color: #2d3748;">
                        <p style="margin: 0;">Income - Expenses = Profit</p>
                    </div>
                </div>
            </div>
        </body></html>`
    },
    {
        name: 'slide3',
        html: `<!DOCTYPE html><html><head><style>${css}</style></head><body>
            <div class="header"><h1 class="title">I Do: Sausage Sizzle Modelling</h1></div>
            <div class="content-box">
                <h2 style="color: #276749; margin-top: 0; font-size: 18pt;">Step 1: UNDERSTAND the Problem</h2>
                <ul style="font-size: 14pt; color: #2d3748; line-height: 1.6; margin: 0; padding-left: 20pt;">
                    <li><b>The Goal:</b> Raise money for Year 5 Camp.</li>
                    <li><b>What we know:</b> There are 150 students. Sausages cost $1.20 each to buy.</li>
                    <li><b>The Decision:</b> We will sell sausages for $3.00 each.</li>
                </ul>
                <div style="background: #f7fafc; padding: 15pt; border: 1pt dashed #cbd5e0; border-radius: 8pt; margin-top: 15pt;">
                    <p style="margin: 0; font-style: italic; color: #4a5568; font-size: 14pt;">"If everyone buys one sausage, will we make enough money?"</p>
                </div>
            </div>
        </body></html>`
    },
    {
        name: 'slide4',
        html: `<!DOCTYPE html><html><head><style>${css}</style></head><body>
            <div class="header"><h1 class="title">I Do: Sausage Sizzle Modelling</h1></div>
            <div class="content-box">
                <h2 style="color: #276749; margin-top: 0; font-size: 18pt;">Step 2: PLAN & SOLVE</h2>
                <div style="display: flex; gap: 15pt; margin-top: 10pt;">
                    <div style="flex: 1; background: #ebf8ff; padding: 12pt; border-radius: 8pt;">
                        <h3 style="color: #2b6cb0; margin: 0 0 5pt 0; font-size: 16pt;">Calculate Income</h3>
                        <p style="font-size: 13pt;">150 students x $3.00 per sausage</p>
                        <p style="font-size: 18pt; font-weight: bold; color: #2b6cb0; margin-top: 10pt;">Total Income: $450.00</p>
                    </div>
                    <div style="flex: 1; background: #fff5f5; padding: 12pt; border-radius: 8pt;">
                        <h3 style="color: #c53030; margin: 0 0 5pt 0; font-size: 16pt;">Calculate Expenses</h3>
                        <p style="font-size: 13pt;">150 x $1.20 (sausage + bread + sauce)</p>
                        <p style="font-size: 18pt; font-weight: bold; color: #c53030; margin-top: 10pt;">Total Expenses: $180.00</p>
                    </div>
                </div>
                <div style="margin-top: 15pt; padding: 12pt; background: #276749; color: white; border-radius: 12pt; text-align: center;">
                    <p style="margin: 0; font-size: 16pt;">
                        $450.00 - $180.00 = <span style="font-size: 24pt; font-weight: bold;">$270.00 PROFIT</span>
                    </p>
                </div>
            </div>
        </body></html>`
    },
    {
        name: 'slide5',
        html: `<!DOCTYPE html><html><head><style>${css}</style></head><body>
            <div class="header"><h1 class="title">Independent Task: Your Turn!</h1></div>
            <div class="content-box">
                <h2 style="color: #276749; margin-top: 0; font-size: 18pt;">Task: Plan your Year 5 Camp Fundraiser</h2>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20pt; margin-top: 10pt;">
                    <div style="background: #f0fff4; padding: 15pt; border-radius: 8pt; border: 1pt solid #c6f6d5;">
                        <h3 style="margin: 0 0 8pt 0; color: #2f855a; font-size: 16pt;">1. UNDERSTAND</h3>
                        <ul style="font-size: 13pt; padding-left: 15pt; margin: 0; line-height: 1.5;">
                            <li>What is your activity?</li>
                            <li>What do you notice/wonder?</li>
                            <li>What info do you need to find out?</li>
                        </ul>
                    </div>
                    <div style="background: #ebf8ff; padding: 15pt; border-radius: 8pt; border: 1pt solid #bee3f8;">
                        <h3 style="margin: 0 0 8pt 0; color: #2b6cb0; font-size: 16pt;">2. PLAN & SOLVE</h3>
                        <ul style="font-size: 13pt; padding-left: 15pt; margin: 0; line-height: 1.5;">
                            <li>How much will you charge?</li>
                            <li>What items must you buy?</li>
                            <li>Show your math: Profit = Income - Expenses</li>
                        </ul>
                    </div>
                </div>
                <div style="margin-top: 15pt; text-align: center; font-weight: bold;">
                    <p style="margin: 0; font-size: 13pt; color: #4a5568;">Challenge: What if the weather is bad and only 50 students show up?</p>
                </div>
            </div>
        </body></html>`
    }
];

async function generate() {
    console.log("Generating Lesson 12 PPTX...");
    try {
        const pres = new pptxgen();
        pres.layout = 'LAYOUT_16x9';
        
        for (const slideData of slides) {
            const filepath = path.join(buildDir, slideData.name + '.html');
            fs.writeFileSync(filepath, slideData.html);
            console.log(`Writing HTML for ${slideData.name}...`);
            await html2pptx(filepath, pres);
        }
        
        const outputPath = path.join(__dirname, 'Lesson_12_Presentation.pptx');
        await pres.writeFile({ fileName: outputPath });
        console.log("Successfully created Lesson_12_Presentation.pptx!");
    } catch (err) {
        console.error("Error during Lesson 12 PPTX generation:", err);
    }
}

generate();
