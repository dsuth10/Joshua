const fs = require('fs');
const path = require('path');
const pptxgen = require('pptxgenjs');
const html2pptx = require('c:/Users/dsuth/Documents/Joshua/.agent/skills/pptx/scripts/html2pptx.js');

const buildDir = path.join(__dirname, 'build');
if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir);
}

const css = `
html { background: #ffffff; }
body {
  width: 720pt; height: 405pt; margin: 0; padding: 0;
  background: #f0f4f8; font-family: Arial, sans-serif;
}
`;

const slides = [
    {
        name: 'slide1',
        html: `<!DOCTYPE html><html><head><style>${css}</style></head><body>
            <div style="width: 100%; height: 100%; background: #1a365d; text-align: center; padding-top: 130pt; box-sizing: border-box;">
                <h1 style="color: #ffffff; font-size: 36pt; margin: 0 0 10pt 0;">Lesson 10: Using Operations</h1>
                <p style="color: #bee3f8; font-size: 18pt; margin: 0;">Maths Unit 2 • Problem Solving Strategies</p>
            </div>
        </body></html>`
    },
    {
        name: 'slide2',
        html: `<!DOCTYPE html><html><head><style>${css}</style></head><body>
            <div style="width: 100%; height: 100%; padding: 20pt; background: #f0f4f8; box-sizing: border-box;">
                <div style="background: #2b6cb0; padding: 10pt; border-radius: 6pt; margin-bottom: 10pt;">
                    <h1 style="color: #ffffff; font-size: 16pt; margin: 0;">Example 1: Finding the total, then the difference</h1>
                </div>
                <div style="width: 45%; float: left;">
                    <div style="background: #ffffff; padding: 10pt; border: 2pt solid #cbd5e0; border-radius: 6pt; box-shadow: 1px 1px 4px rgba(0,0,0,0.1);">
                        <p style="font-size: 12pt; color: #2d3748; margin: 0; line-height: 1.3;">A school needs $1,500 for a new garden. They raised $425 from a bake sale, $615 from a disco, and $230 from a free dress day. How much more money do they need to raise?</p>
                    </div>
                </div>
                <div style="width: 52%; float: right;">
                    <div style="background: #ebf8ff; padding: 10pt; border-left: 6pt solid #3182ce; border-radius: 4pt;">
                        <p style="font-size: 11pt; color: #2b6cb0; margin: 0 0 4pt 0; line-height: 1.2;"><b>1. Box Keywords:</b> "raised" (add), "how much more" (subtract), "goal" (target)</p>
                        <p style="font-size: 11pt; color: #2b6cb0; margin: 0 0 2pt 0; line-height: 1.2;"><b>2. Step 1 (Add):</b> Find the total amount raised.</p>
                        <ul style="margin: 0 0 6pt 0; padding-left: 15pt; line-height: 1.2;"><li style="font-size: 11pt; color: #2d3748;">$425 + $615 + $230 = $1,270</li></ul>
                        <p style="font-size: 11pt; color: #2b6cb0; margin: 0 0 2pt 0; line-height: 1.2;"><b>3. Step 2 (Subtract):</b> Find the difference to the goal.</p>
                        <ul style="margin: 0 0 8pt 0; padding-left: 15pt; line-height: 1.2;"><li style="font-size: 11pt; color: #2d3748;">$1,500 - $1,270 = $230</li></ul>
                        <p style="font-size: 12pt; color: #e53e3e; margin: 0; line-height: 1.2;"><b>Answer:</b> They need to raise <b>$230 dollars</b> more.</p>
                    </div>
                </div>
            </div>
        </body></html>`
    },
    {
        name: 'slide3',
        html: `<!DOCTYPE html><html><head><style>${css}</style></head><body>
            <div style="width: 100%; height: 100%; padding: 20pt; background: #f0f4f8; box-sizing: border-box;">
                <div style="background: #2b6cb0; padding: 10pt; border-radius: 6pt; margin-bottom: 10pt;">
                    <h1 style="color: #ffffff; font-size: 16pt; margin: 0;">Example 2: Extraneous Information</h1>
                </div>
                <div style="width: 45%; float: left;">
                    <div style="background: #ffffff; padding: 10pt; border: 2pt solid #cbd5e0; border-radius: 6pt; box-shadow: 1px 1px 4px rgba(0,0,0,0.1);">
                        <p style="font-size: 12pt; color: #2d3748; margin: 0; line-height: 1.3;">A fruit shop owner buys 15 boxes of apples for the week. Each box contains 24 apples. While unpacking the boxes on Tuesday morning, the owner notices that 18 apples are badly bruised and have to be thrown away. How many good apples does the owner have left to sell?</p>
                    </div>
                </div>
                <div style="width: 52%; float: right;">
                    <div style="background: #ebf8ff; padding: 10pt; border-left: 6pt solid #3182ce; border-radius: 4pt;">
                        <p style="font-size: 11pt; color: #2b6cb0; margin: 0 0 4pt 0; line-height: 1.2;"><b>1. Circle Numbers:</b> 15, 24, "Tuesday" (not a math number!), 18</p>
                        <p style="font-size: 11pt; color: #2b6cb0; margin: 0 0 2pt 0; line-height: 1.2;"><b>2. Step 1 (Multiply):</b> Find the total number of apples bought.</p>
                        <ul style="margin: 0 0 6pt 0; padding-left: 15pt; line-height: 1.2;"><li style="font-size: 11pt; color: #2d3748;">15 boxes x 24 apples per box = 360 apples total</li></ul>
                        <p style="font-size: 11pt; color: #2b6cb0; margin: 0 0 2pt 0; line-height: 1.2;"><b>3. Step 2 (Subtract):</b> Take away the spoiled apples ("thrown away").</p>
                        <ul style="margin: 0 0 8pt 0; padding-left: 15pt; line-height: 1.2;"><li style="font-size: 11pt; color: #2d3748;">360 total - 18 bruised = 342</li></ul>
                        <p style="font-size: 12pt; color: #e53e3e; margin: 0; line-height: 1.2;"><b>Answer:</b> The owner has <b>342 apples</b> left to sell.</p>
                    </div>
                </div>
            </div>
        </body></html>`
    },
    {
        name: 'slide4',
        html: `<!DOCTYPE html><html><head><style>${css}</style></head><body>
            <div style="width: 100%; height: 100%; padding: 20pt; background: #f0f4f8; box-sizing: border-box;">
                <div style="background: #2b6cb0; padding: 10pt; border-radius: 6pt; margin-bottom: 10pt;">
                    <h1 style="color: #ffffff; font-size: 16pt; margin: 0;">Example 3: Division followed by Subtraction</h1>
                </div>
                <div style="width: 45%; float: left;">
                    <div style="background: #ffffff; padding: 10pt; border: 2pt solid #cbd5e0; border-radius: 6pt; box-shadow: 1px 1px 4px rgba(0,0,0,0.1);">
                        <p style="font-size: 12pt; color: #2d3748; margin: 0; line-height: 1.3;">A baker makes a massive batch of 450 cookies. He wants to pack them evenly into large boxes that hold 12 cookies each. How many full boxes can he make, and how many cookies will be left over?</p>
                    </div>
                </div>
                <div style="width: 52%; float: right;">
                    <div style="background: #ebf8ff; padding: 10pt; border-left: 6pt solid #3182ce; border-radius: 4pt;">
                        <p style="font-size: 11pt; color: #2b6cb0; margin: 0 0 4pt 0; line-height: 1.2;"><b>1. Box Keywords:</b> "pack them evenly" (divide), "left over" (remainder/subtract)</p>
                        <p style="font-size: 11pt; color: #2b6cb0; margin: 0 0 2pt 0; line-height: 1.2;"><b>2. Step 1 (Divide):</b> Divide total cookies by box capacity.</p>
                        <ul style="margin: 0 0 6pt 0; padding-left: 15pt; line-height: 1.2;"><li style="font-size: 11pt; color: #2d3748;">450 ÷ 12 = 37 with a remainder.</li></ul>
                        <p style="font-size: 11pt; color: #2b6cb0; margin: 0 0 2pt 0; line-height: 1.2;"><b>3. Step 2 (Multiply & Subtract):</b> How many cookies are in 37 boxes?</p>
                        <ul style="margin: 0 0 8pt 0; padding-left: 15pt; line-height: 1.2;">
                            <li style="font-size: 11pt; color: #2d3748;">37 boxes x 12 cookies = 444 cookies packed</li>
                            <li style="font-size: 11pt; color: #2d3748;">450 total - 444 packed = 6 left over</li>
                        </ul>
                        <p style="font-size: 12pt; color: #e53e3e; margin: 0; line-height: 1.2;"><b>Answer:</b> He can make <b>37 boxes</b> with <b>6 cookies</b> left over.</p>
                    </div>
                </div>
            </div>
        </body></html>`
    },
    {
        name: 'slide5',
        html: `<!DOCTYPE html><html><head><style>${css}</style></head><body>
            <div style="width: 100%; height: 100%; padding: 20pt; background: #f0f4f8; box-sizing: border-box;">
                <div style="background: #2b6cb0; padding: 10pt; border-radius: 6pt; margin-bottom: 10pt;">
                    <h1 style="color: #ffffff; font-size: 16pt; margin: 0;">Example 4: Complex Multi-step</h1>
                </div>
                <div style="width: 45%; float: left;">
                    <div style="background: #ffffff; padding: 10pt; border: 2pt solid #cbd5e0; border-radius: 6pt; box-shadow: 1px 1px 4px rgba(0,0,0,0.1);">
                        <p style="font-size: 12pt; color: #2d3748; margin: 0; line-height: 1.3;">My family car travels 8 km on a single litre of fuel. How much fuel would I use to travel to a holiday park that is 104 km away? If fuel costs 150 cents per litre, what is the total cost?</p>
                    </div>
                </div>
                <div style="width: 52%; float: right;">
                    <div style="background: #ebf8ff; padding: 10pt; border-left: 6pt solid #3182ce; border-radius: 4pt;">
                        <p style="font-size: 11pt; color: #2b6cb0; margin: 0 0 2pt 0; line-height: 1.2;"><b>1. Step 1 (Divide):</b> Find how many litres we need.</p>
                        <ul style="margin: 0 0 4pt 0; padding-left: 15pt; line-height: 1.2;"><li style="font-size: 11pt; color: #2d3748;">104 km total ÷ 8 km per litre = 13 litres.</li></ul>
                        <p style="font-size: 11pt; color: #2b6cb0; margin: 0 0 2pt 0; line-height: 1.2;"><b>2. Step 2 (Multiply):</b> Calculate the total cost.</p>
                        <ul style="margin: 0 0 4pt 0; padding-left: 15pt; line-height: 1.2;"><li style="font-size: 11pt; color: #2d3748;">13 litres x 150 cents = 1,950 cents.</li></ul>
                        <p style="font-size: 11pt; color: #2b6cb0; margin: 0 0 2pt 0; line-height: 1.2;"><b>3. Step 3 (Convert):</b> Change cents to dollars.</p>
                        <ul style="margin: 0 0 6pt 0; padding-left: 15pt; line-height: 1.2;"><li style="font-size: 11pt; color: #2d3748;">1,950 cents ÷ 100 = $19.50</li></ul>
                        <p style="font-size: 12pt; color: #e53e3e; margin: 0; line-height: 1.2;"><b>Answer:</b> I would use <b>13 litres</b>, and it would cost <b>$19.50 dollars</b>.</p>
                    </div>
                </div>
            </div>
        </body></html>`
    }
];

async function generate() {
    console.log("Generating PPTX...");
    try {
        const pres = new pptxgen();
        pres.layout = 'LAYOUT_16x9';
        
        for (const slideData of slides) {
            const filepath = path.join(buildDir, slideData.name + '.html');
            fs.writeFileSync(filepath, slideData.html);
            await html2pptx(filepath, pres);
        }
        
        const outputPath = path.join(__dirname, 'Lesson_10_Presentation.pptx');
        await pres.writeFile({ fileName: outputPath });
        console.log("Successfully created Lesson_10_Presentation.pptx!");
    } catch (err) {
        console.error("Error during PPTX generation:", err);
    }
}

generate();
