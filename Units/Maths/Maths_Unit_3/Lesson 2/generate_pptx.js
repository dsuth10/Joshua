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
  background: #f4f6f7; font-family: Arial, sans-serif;
  color: #2d3748;
}
.dark-bg {
  width: 100%; height: 100%;
  background: #1b4f72;
  box-sizing: border-box;
}
.container {
  width: 100%; height: 100%;
  padding: 20pt;
  box-sizing: border-box;
}
.header-banner {
  background: #1b4f72;
  padding: 8pt 15pt;
  border-radius: 4pt;
  margin-bottom: 12pt;
}
.header-banner h1 {
  color: #ffffff;
  font-size: 18pt;
  margin: 0;
}
.card {
  background: #ffffff;
  border: 1.5pt solid #d5dbdb;
  border-radius: 6pt;
  padding: 10pt;
}
.alert-card {
  background: #ebf5fb;
  border-left: 6pt solid #1b4f72;
  border-radius: 4pt;
  padding: 8pt 12pt;
}
.success-card {
  background: #e8f8f5;
  border-left: 6pt solid #17a589;
  border-radius: 4pt;
  padding: 8pt 12pt;
}
.highlight-text {
  color: #e67e22;
  font-weight: bold;
}
`;

const slides = [
    // Slide 1: Title
    {
        name: 'slide1',
        html: `<!DOCTYPE html><html><head><style>${css}</style></head><body>
            <div class="dark-bg" style="padding-top: 120pt; text-align: center;">
                <h1 style="color: #ffffff; font-size: 38pt; margin: 0 0 8pt 0;">Lesson 15: Converting Metric Lengths</h1>
                <p style="color: #aed6f1; font-size: 18pt; margin: 0 0 15pt 0;">Maths Unit 2 • Measurement & Geometry</p>
                <div style="display: inline-block; background: #e67e22; height: 3pt; width: 120pt;"></div>
            </div>
        </body></html>`
    },
    // Slide 2: Introduction to Units
    {
        name: 'slide2',
        html: `<!DOCTYPE html><html><head><style>${css}</style></head><body>
            <div class="container">
                <div class="header-banner">
                    <h1>Real-World Metric Units</h1>
                </div>
                <div style="width: 48%; float: left;">
                    <div class="card" style="height: 290pt; box-sizing: border-box; padding: 12pt;">
                        <h2 style="font-size: 14pt; color: #1b4f72; margin: 0 0 10pt 0;">The Four Length Units (Standard)</h2>
                        <ul style="margin: 0; padding-left: 15pt; line-height: 1.5;">
                            <li style="font-size: 11pt; margin-bottom: 8pt;"><b>Millimetre (mm):</b> Thickness of a plastic card. Used for tiny measurements.</li>
                            <li style="font-size: 11pt; margin-bottom: 8pt;"><b>Centimetre (cm):</b> Width of a standard fingernail. ($10\\text{ mm} = 1\\text{ cm}$).</li>
                            <li style="font-size: 11pt; margin-bottom: 8pt;"><b>Metre (m):</b> One large adult stride. ($100\\text{ cm} = 1\\text{ m}$).</li>
                            <li style="font-size: 11pt; margin-bottom: 8pt;"><b>Kilometre (km):</b> Length of a 10-minute walk. ($1000\\text{ m} = 1\\text{ km}$).</li>
                        </ul>
                        <div class="alert-card" style="margin-top: 15pt; padding: 6pt 10pt;">
                            <p style="font-size: 10pt; color: #1b4f72; margin: 0;">⚠️ <b>Spelling Note:</b> Always use Australian spelling ending in <b>-tre</b> (metre, centimetre, millimetre, kilometre).</p>
                        </div>
                    </div>
                </div>
                <div style="width: 48%; float: right;">
                    <div class="card" style="height: 290pt; box-sizing: border-box; padding: 12pt;">
                        <h2 style="font-size: 14pt; color: #17a589; margin: 0 0 10pt 0;">Warm-Up: Choose the Best Unit</h2>
                        <p style="font-size: 11pt; margin: 0 0 12pt 0; line-height: 1.4;">Select the most appropriate unit (<b>mm, cm, m, km</b>) to measure:</p>
                        <div style="margin-bottom: 10pt; background: #f8f9f9; padding: 6pt; border-left: 3pt solid #17a589;">
                            <p style="font-size: 11pt; margin: 0;"><b>1. Length of an ant:</b> <span class="highlight-text">mm</span></p>
                        </div>
                        <div style="margin-bottom: 10pt; background: #f8f9f9; padding: 6pt; border-left: 3pt solid #17a589;">
                            <p style="font-size: 11pt; margin: 0;"><b>2. Height of a basketball hoop:</b> <span class="highlight-text">m</span></p>
                        </div>
                        <div style="margin-bottom: 10pt; background: #f8f9f9; padding: 6pt; border-left: 3pt solid #17a589;">
                            <p style="font-size: 11pt; margin: 0;"><b>3. Length of a pencil:</b> <span class="highlight-text">cm</span></p>
                        </div>
                        <div style="background: #f8f9f9; padding: 6pt; border-left: 3pt solid #17a589;">
                            <p style="font-size: 11pt; margin: 0;"><b>4. Distance between two cities:</b> <span class="highlight-text">km</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </body></html>`
    },
    // Slide 3: The Conversion Chart
    {
        name: 'slide3',
        html: `<!DOCTYPE html><html><head><style>${css}</style></head><body>
            <div class="container">
                <div class="header-banner">
                    <h1>The Metric Conversion Chart</h1>
                </div>
                <div style="width: 100%;">
                    <div class="card" style="padding: 15pt; text-align: center;">
                        <h2 style="font-size: 15pt; color: #1b4f72; margin: 0 0 15pt 0;">How to Convert Metric Units</h2>
                        
                        <!-- Visual representation of conversion chart -->
                        <div style="background: #ebf5fb; padding: 15pt; border-radius: 8pt; margin-bottom: 15pt; border: 1.5pt solid #aed6f1;">
                            <p style="font-size: 18pt; margin: 0 0 10pt 0; font-weight: bold; color: #1b4f72;">
                                km &nbsp; ➔ &nbsp; (x1000) &nbsp; ➔ &nbsp; m &nbsp; ➔ &nbsp; (x100) &nbsp; ➔ &nbsp; cm &nbsp; ➔ &nbsp; (x10) &nbsp; ➔ &nbsp; mm
                            </p>
                            <p style="font-size: 18pt; margin: 0; font-weight: bold; color: #17a589;">
                                mm &nbsp; ➔ &nbsp; (÷10) &nbsp; ➔ &nbsp; cm &nbsp; ➔ &nbsp; (÷100) &nbsp; ➔ &nbsp; m &nbsp; ➔ &nbsp; (÷1000) &nbsp; ➔ &nbsp; km
                            </p>
                        </div>

                        <div style="width: 48%; float: left; text-align: left;">
                            <div class="success-card">
                                <h3 style="font-size: 12pt; margin: 0 0 5pt 0; color: #17a589;">Larger Unit to Smaller Unit</h3>
                                <p style="font-size: 11pt; margin: 0; line-height: 1.3;">Multiply the value because you need <b>more</b> smaller parts to cover the same length.</p>
                            </div>
                        </div>
                        <div style="width: 48%; float: right; text-align: left;">
                            <div class="alert-card">
                                <h3 style="font-size: 12pt; margin: 0 0 5pt 0; color: #1b4f72;">Smaller Unit to Larger Unit</h3>
                                <p style="font-size: 11pt; margin: 0; line-height: 1.3;">Divide the value because multiple small parts are grouped into <b>fewer</b> larger units.</p>
                            </div>
                        </div>
                        <div style="clear: both;"></div>
                    </div>
                </div>
            </div>
        </body></html>`
    },
    // Slide 4: I Do: Multiplying
    {
        name: 'slide4',
        html: `<!DOCTYPE html><html><head><style>${css}</style></head><body>
            <div class="container">
                <div class="header-banner">
                    <h1>I Do: Converting Larger Units to Smaller (Multiplication)</h1>
                </div>
                <div style="width: 48%; float: left;">
                    <div class="card" style="height: 290pt; box-sizing: border-box;">
                        <h2 style="font-size: 14pt; color: #1b4f72; margin: 0 0 8pt 0;">Example 1: Metres to Centimetres</h2>
                        <div class="success-card" style="margin-bottom: 10pt;">
                            <p style="font-size: 11pt; margin: 0;"><b>Problem:</b> Convert <b>5 metres (m)</b> to centimetres (cm).</p>
                        </div>
                        <p style="font-size: 11pt; margin: 0 0 8pt 0; line-height: 1.3;"><b>1. Identify the relationship:</b> $1\\text{ m} = 100\\text{ cm}$.</p>
                        <p style="font-size: 11pt; margin: 0 0 8pt 0; line-height: 1.3;"><b>2. Apply operation:</b> Convert larger to smaller $\\rightarrow$ multiply.</p>
                        <p style="font-size: 11pt; margin: 0 0 10pt 0; line-height: 1.3;"><b>3. Calculation:</b> $5 \\times 100 = 500$.</p>
                        <p style="font-size: 12pt; color: #17a589; margin: 0; font-weight: bold;">Answer: 500 cm</p>
                    </div>
                </div>
                <div style="width: 48%; float: right;">
                    <div class="card" style="height: 290pt; box-sizing: border-box;">
                        <h2 style="font-size: 14pt; color: #1b4f72; margin: 0 0 8pt 0;">Example 2: Kilometres to Metres (Decimal)</h2>
                        <div class="success-card" style="margin-bottom: 10pt;">
                            <p style="font-size: 11pt; margin: 0;"><b>Problem:</b> Convert <b>2.5 kilometres (km)</b> to metres (m).</p>
                        </div>
                        <p style="font-size: 11pt; margin: 0 0 8pt 0; line-height: 1.3;"><b>1. Identify the relationship:</b> $1\\text{ km} = 1000\\text{ m}$.</p>
                        <p style="font-size: 11pt; margin: 0 0 8pt 0; line-height: 1.3;"><b>2. Apply operation:</b> Convert larger to smaller $\\rightarrow$ multiply.</p>
                        <p style="font-size: 11pt; margin: 0 0 10pt 0; line-height: 1.3;"><b>3. Calculation:</b> $2.5 \\times 1000 = 2500$ (move decimal three places right).</p>
                        <p style="font-size: 12pt; color: #17a589; margin: 0; font-weight: bold;">Answer: 2500 m</p>
                    </div>
                </div>
            </div>
        </body></html>`
    },
    // Slide 5: I Do: Dividing
    {
        name: 'slide5',
        html: `<!DOCTYPE html><html><head><style>${css}</style></head><body>
            <div class="container">
                <div class="header-banner">
                    <h1>I Do: Converting Smaller Units to Larger (Division)</h1>
                </div>
                <div style="width: 48%; float: left;">
                    <div class="card" style="height: 290pt; box-sizing: border-box;">
                        <h2 style="font-size: 14pt; color: #1b4f72; margin: 0 0 8pt 0;">Example 3: Millimetres to Centimetres</h2>
                        <div class="alert-card" style="margin-bottom: 10pt;">
                            <p style="font-size: 11pt; margin: 0;"><b>Problem:</b> Convert <b>60 millimetres (mm)</b> to centimetres (cm).</p>
                        </div>
                        <p style="font-size: 11pt; margin: 0 0 8pt 0; line-height: 1.3;"><b>1. Identify relationship:</b> $10\\text{ mm} = 1\\text{ cm}$.</p>
                        <p style="font-size: 11pt; margin: 0 0 8pt 0; line-height: 1.3;"><b>2. Apply operation:</b> Convert smaller to larger $\\rightarrow$ divide.</p>
                        <p style="font-size: 11pt; margin: 0 0 10pt 0; line-height: 1.3;"><b>3. Calculation:</b> $60 \\div 10 = 6$.</p>
                        <p style="font-size: 12pt; color: #1b4f72; margin: 0; font-weight: bold;">Answer: 6 cm</p>
                    </div>
                </div>
                <div style="width: 48%; float: right;">
                    <div class="card" style="height: 290pt; box-sizing: border-box;">
                        <h2 style="font-size: 14pt; color: #1b4f72; margin: 0 0 8pt 0;">Example 4: Metres to Kilometres (Decimal Shift)</h2>
                        <div class="alert-card" style="margin-bottom: 10pt;">
                            <p style="font-size: 11pt; margin: 0;"><b>Problem:</b> Convert <b>450 metres (m)</b> to kilometres (km).</p>
                        </div>
                        <p style="font-size: 11pt; margin: 0 0 8pt 0; line-height: 1.3;"><b>1. Identify relationship:</b> $1000\\text{ m} = 1\\text{ km}$.</p>
                        <p style="font-size: 11pt; margin: 0 0 8pt 0; line-height: 1.3;"><b>2. Apply operation:</b> Convert smaller to larger $\\rightarrow$ divide.</p>
                        <p style="font-size: 11pt; margin: 0 0 10pt 0; line-height: 1.3;"><b>3. Calculation:</b> $450 \\div 1000 = 0.45$ (move decimal three places left).</p>
                        <p style="font-size: 12pt; color: #1b4f72; margin: 0; font-weight: bold;">Answer: 0.45 km</p>
                    </div>
                </div>
            </div>
        </body></html>`
    },
    // Slide 6: We Do: Guided Whiteboard Practice
    {
        name: 'slide6',
        html: `<!DOCTYPE html><html><head><style>${css}</style></head><body>
            <div class="container">
                <div class="header-banner">
                    <h1>We Do: Guided Whiteboard Practice</h1>
                </div>
                <div style="width: 100%;">
                    <div class="card" style="padding: 12pt;">
                        <p style="font-size: 12pt; margin: 0 0 12pt 0; text-align: center;">Write down your calculations on your mini-whiteboard. Hold them up when called!</p>
                        
                        <div style="width: 31%; float: left; margin-right: 3.5%;">
                            <div style="border: 2pt solid #1b4f72; border-radius: 6pt; padding: 10pt; height: 180pt; background: #fff; text-align: center;">
                                <h3 style="font-size: 13pt; color: #1b4f72; margin: 0 0 4pt 0;">Task 1</h3>
                                <div style="height: 2pt; background: #e67e22; margin-bottom: 8pt;"></div>
                                <p style="font-size: 11pt; margin: 0 0 15pt 0; font-weight: bold;">Convert 8.2 cm to millimetres (mm)</p>
                                <div style="background: #e8f8f5; padding: 8pt; border-radius: 4pt; margin-top: 15pt;">
                                    <p style="font-size: 11pt; color: #17a589; margin: 0; font-weight: bold;">Answer: 82 mm<br><span style="font-size: 9pt; font-weight: normal; color: #555;">($8.2 \\times 10 = 82$)</span></p>
                                </div>
                            </div>
                        </div>

                        <div style="width: 31%; float: left; margin-right: 3.5%;">
                            <div style="border: 2pt solid #1b4f72; border-radius: 6pt; padding: 10pt; height: 180pt; background: #fff; text-align: center;">
                                <h3 style="font-size: 13pt; color: #1b4f72; margin: 0 0 4pt 0;">Task 2</h3>
                                <div style="height: 2pt; background: #e67e22; margin-bottom: 8pt;"></div>
                                <p style="font-size: 11pt; margin: 0 0 15pt 0; font-weight: bold;">Convert 750 cm to metres (m)</p>
                                <div style="background: #e8f8f5; padding: 8pt; border-radius: 4pt; margin-top: 15pt;">
                                    <p style="font-size: 11pt; color: #17a589; margin: 0; font-weight: bold;">Answer: 7.5 m<br><span style="font-size: 9pt; font-weight: normal; color: #555;">($750 \\div 100 = 7.5$)</span></p>
                                </div>
                            </div>
                        </div>

                        <div style="width: 31%; float: left;">
                            <div style="border: 2pt solid #1b4f72; border-radius: 6pt; padding: 10pt; height: 180pt; background: #fff; text-align: center;">
                                <h3 style="font-size: 13pt; color: #1b4f72; margin: 0 0 4pt 0;">Task 3</h3>
                                <div style="height: 2pt; background: #e67e22; margin-bottom: 8pt;"></div>
                                <p style="font-size: 11pt; margin: 0 0 15pt 0; font-weight: bold;">Compare 1.5 m and 145 cm</p>
                                <div style="background: #e8f8f5; padding: 8pt; border-radius: 4pt; margin-top: 15pt;">
                                    <p style="font-size: 11pt; color: #17a589; margin: 0; font-weight: bold;">Answer: 1.5 m is longer<br><span style="font-size: 9pt; font-weight: normal; color: #555;">($1.5\\text{ m} = 150\\text{ cm} > 145\\text{ cm}$)</span></p>
                                </div>
                            </div>
                        </div>
                        <div style="clear: both;"></div>
                    </div>
                </div>
            </div>
        </body></html>`
    },
    // Slide 7: You Do: Word Problem Challenge
    {
        name: 'slide7',
        html: `<!DOCTYPE html><html><head><style>${css}</style></head><body>
            <div class="container">
                <div class="header-banner">
                    <h1>You Do: Word Problem Challenges</h1>
                </div>
                <div style="width: 48%; float: left;">
                    <div class="card" style="height: 290pt; box-sizing: border-box; padding: 10pt;">
                        <h2 style="font-size: 12pt; color: #1b4f72; margin: 0 0 3pt 0;">Challenge A: Sarah's Rope</h2>
                        <div style="height: 1.5pt; background: #e67e22; margin-bottom: 6pt;"></div>
                        <p style="font-size: 10pt; margin: 0 0 6pt 0; line-height: 1.3;">Sarah has a rope that is <b>3.2 m</b> long. She cuts off <b>80 cm</b>. How many centimetres (cm) are left?</p>
                        <div class="success-card" style="padding: 5pt 8pt;">
                            <p style="font-size: 10pt; color: #17a589; margin: 0;"><b>Working:</b> $3.2\\text{ m} \\times 100 = 320\\text{ cm}$.<br>$320 - 80 = 240\\text{ cm}$.<br><b>Answer:</b> 240 cm</p>
                        </div>
                        
                        <h2 style="font-size: 12pt; color: #1b4f72; margin: 8pt 0 3pt 0;">Challenge B: Athlete's Distance</h2>
                        <div style="height: 1.5pt; background: #e67e22; margin-bottom: 6pt;"></div>
                        <p style="font-size: 10pt; margin: 0 0 6pt 0; line-height: 1.3;">An athlete runs <b>3 km</b> and then another <b>850 m</b>. What is the total distance in metres (m)?</p>
                        <div class="success-card" style="padding: 5pt 8pt;">
                            <p style="font-size: 10pt; color: #17a589; margin: 0;"><b>Working:</b> $3\\text{ km} \\times 1000 = 3000\\text{ m}$.<br>$3000 + 850 = 3850\\text{ m}$.<br><b>Answer:</b> 3850 m</p>
                        </div>
                    </div>
                </div>
                <div style="width: 48%; float: right;">
                    <div class="card" style="height: 290pt; box-sizing: border-box; padding: 12pt;">
                        <h2 style="font-size: 13pt; color: #1b4f72; margin: 0 0 4pt 0;">Challenge C: Playground Perimeter</h2>
                        <div style="height: 1.5pt; background: #e67e22; margin-bottom: 8pt;"></div>
                        <p style="font-size: 11pt; margin: 0 0 10pt 0; line-height: 1.4;">A rectangular playground has a length of <b>350 cm</b> and a width of <b>2.4 m</b>. Calculate the playground's perimeter in <b>metres (m)</b>.</p>
                        <div class="alert-card" style="margin-bottom: 10pt; padding: 8pt;">
                            <p style="font-size: 11pt; margin: 0;"><b>Step 1: Convert to same unit (metres)</b><br>Length: $350\\text{ cm} \\div 100 = 3.5\\text{ m}$.</p>
                        </div>
                        <div class="alert-card" style="margin-bottom: 10pt; padding: 8pt;">
                            <p style="font-size: 11pt; margin: 0;"><b>Step 2: Apply the perimeter formula</b><br>Perimeter = $2 \\times (\\text{Length} + \\text{Width})$</p>
                        </div>
                        <div class="success-card" style="padding: 8pt;">
                            <p style="font-size: 11pt; color: #17a589; margin: 0;"><b>Step 3: Calculation</b><br>$2 \\times (3.5 + 2.4) = 2 \\times 5.9 = 11.8\\text{ m}$.<br><b>Answer:</b> 11.8 m</p>
                        </div>
                    </div>
                </div>
            </div>
        </body></html>`
    },
    // Slide 8: Lesson Plenary / Wrap-up
    {
        name: 'slide8',
        html: `<!DOCTYPE html><html><head><style>${css}</style></head><body>
            <div class="container">
                <div class="header-banner">
                    <h1>Lesson Wrap-Up & Reflection</h1>
                </div>
                <div style="width: 100%;">
                    <div class="card" style="padding: 15pt; height: 290pt; box-sizing: border-box;">
                        <h2 style="font-size: 15pt; color: #1b4f72; margin: 0 0 12pt 0; text-align: center;">Key Takeaways</h2>
                        <div style="background: #ebf5fb; padding: 12pt; border-radius: 6pt; margin-bottom: 15pt; border-left: 5pt solid #1b4f72;">
                            <ul style="margin: 0; padding-left: 20pt; line-height: 1.6; font-size: 12pt;">
                                <li><b>Multiply</b> when converting from a <b>larger unit to a smaller unit</b> (e.g. m to cm).</li>
                                <li><b>Divide</b> when converting from a <b>smaller unit to a larger unit</b> (e.g. m to km).</li>
                                <li>Check the units carefully in word problems before performing operations like addition or subtraction!</li>
                            </ul>
                        </div>
                        <div class="success-card" style="padding: 12pt; text-align: center;">
                            <h3 style="font-size: 13pt; color: #17a589; margin: 0 0 5pt 0;">Next Step: Assessment</h3>
                            <p style="font-size: 11pt; margin: 0; line-height: 1.4;">Open your student dashboard and launch the 15-question <b>Assessment_Forms.docx</b> quiz. Check your working out on scrap paper before entering your answers!</p>
                        </div>
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
        pres.author = 'Antigravity AI';
        pres.title = 'Converting Metric Units of Length';
        
        for (const slideData of slides) {
            const filepath = path.join(buildDir, slideData.name + '.html');
            fs.writeFileSync(filepath, slideData.html);
            console.log(`Rendering slide: ${slideData.name}...`);
            await html2pptx(filepath, pres);
        }
        
        const outputPath = path.join(__dirname, 'Lesson_15_Presentation.pptx');
        await pres.writeFile({ fileName: outputPath });
        console.log(`Successfully created Lesson_15_Presentation.pptx at: ${outputPath}`);
    } catch (err) {
        console.error("Error during PPTX generation:", err);
        process.exit(1);
    }
}

generate();
