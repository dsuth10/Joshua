const fs = require('fs');
const path = require('path');
const pptxgen = require('pptxgenjs');
const html2pptx = require('c:\\Users\\dsuth\\Documents\\Joshua\\.agent\\skills\\pptx\\scripts\\html2pptx');

const OUTPUT_DIR = path.join(__dirname, '..', 'Lesson_Plans');
const TEMP_DIR = path.join(__dirname, 'temp_slides');

if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR);

const slidesData = [
    {
        title: "Lesson 03: Structural Navigation Features",
        content: `
            <div class="box" style="margin-top: 30pt;">
                <p style="text-align: center; font-size: 32pt;">Year 5 English — Unit 2</p>
                <p style="text-align: center; font-size: 20pt; color: #f9f7f7;">Examining Informative Texts</p>
            </div>
            <p style="text-align: center; margin-top: 20pt; font-size: 24pt; color: #112d4e; font-weight: bold;">Tarampa State School</p>
        `
    },
    {
        title: "Learning Intentions",
        content: `
            <div class="box">
                <p style="font-size: 20pt;"><span class="highlight">I can</span> explain how structural navigation features help readers find and understand information.</p>
            </div>
            <div class="grid" style="margin-top: 15pt;">
                <div class="box" style="background: #112d4e;">
                    <p style="font-size: 16pt; color: #f96d00; font-weight: bold;">Success Criteria:</p>
                    <ul style="font-size: 14pt; color: white; margin-top: 5pt;">
                        <li>Identify navigation features.</li>
                        <li>Explain their purpose.</li>
                        <li>Compare to book features.</li>
                    </ul>
                </div>
            </div>
        `
    },
    {
        title: "Navigation Challenge!",
        content: `
            <div class="box" style="background: #f96d00;">
                <p style="color: white; text-align: center; font-size: 24pt; font-weight: bold;">READY?</p>
            </div>
            <p style="text-align: center; font-size: 20pt; margin-top: 15pt;">Find the page about <span class="highlight">Cyclone Tracy</span> in the archive...</p>
            <div class="box" style="margin-top: 10pt; background: #112d4e;">
                <p style="text-align: center; font-size: 32pt; color: #f96d00; font-weight: bold;">30 SECONDS</p>
            </div>
        `
    },
    {
        title: "What is a 'Hub Page'?",
        content: `
            <div class="grid">
                <div>
                    <p style="font-size: 18pt;">The <span class="highlight">Hub Page</span> is like the 'Front Door' of the archive.</p>
                    <p style="font-size: 14pt; margin-top: 5pt;">It contains links to all the sub-pages and gives a general overview of the topic.</p>
                </div>
                <div class="box">
                    <p style="font-size: 14pt;">Think about a book... Is a Hub Page more like a <span class="highlight">Cover</span> or a <span class="highlight">Contents Page</span>?</p>
                </div>
            </div>
        `
    },
    {
        title: "Signposts: Headings",
        content: `
            <div class="box">
                <p style="font-size: 18pt;">Headings and Subheadings act as <span class="highlight">Signposts</span>.</p>
            </div>
            <p style="margin-top: 10pt; font-size: 16pt;">They tell the reader exactly what information is in that section.</p>
            <div class="box" style="background: #3f72af; margin-top: 10pt;">
                <p style="font-size: 14pt;">Scan the page for the heading <span class="highlight">'Impacts'</span>. What do you think you will find there?</p>
            </div>
        `
    },
    {
        title: "Portals: Internal Links",
        content: `
            <div class="grid">
                <div>
                    <p style="font-size: 18pt;"><span class="highlight">Internal Links</span> are like portals that take you to related information instantly.</p>
                </div>
                <div class="box">
                    <p style="font-size: 14pt;">How is this different from using an <span class="highlight">Index</span> in a physical book?</p>
                </div>
            </div>
            <div class="box" style="margin-top: 10pt; background: #112d4e;">
                <p style="color: #f96d00; font-size: 14pt;">Challenge: Find a blue link. Where does it take you?</p>
            </div>
        `
    },
    {
        title: "Teacher Modelling",
        content: `
            <div class="box">
                <p style="font-size: 18pt;">Let's annotate the <span class="highlight">Cyclone Tracy</span> page together.</p>
            </div>
            <ul style="margin-top: 10pt; font-size: 16pt;">
                <li>Identify the main heading.</li>
                <li>Find the navigation menu.</li>
                <li>Locate the 'Back to Hub' link.</li>
                <li>Spot the pull quotes.</li>
            </ul>
        `
    },
    {
        title: "Independent Task",
        content: `
            <div class="box">
                <p style="font-size: 16pt;">1. Explore the <span class="highlight">Cyclone Archive</span>.</p>
                <p style="font-size: 16pt;">2. Record <span class="highlight">5 features</span> on your worksheet.</p>
                <p style="font-size: 16pt;">3. Explain <span class="highlight">how</span> each feature helps you.</p>
            </div>
            <div class="box" style="background: #112d4e; margin-top: 10pt;">
                <p style="color: #f96d00; font-size: 14pt;">Lucas: Identify 2 features on the Cyclone Tracy page and draw them!</p>
            </div>
        `
    },
    {
        title: "Reflection",
        content: `
            <div class="box" style="background: #f96d00;">
                <p style="color: white; text-align: center; font-size: 20pt;">Which navigation feature is the MOST helpful?</p>
            </div>
            <p style="text-align: center; margin-top: 20pt; font-size: 18pt;">Why? Share your answer with a partner.</p>
        `
    }
];

const template = fs.readFileSync('c:\\Users\\dsuth\\Documents\\Joshua\\.agent\\skills\\english-lesson\\assets\\slide_template.html', 'utf8');

async function generate() {
    const slidePaths = [];
    slidesData.forEach((data, index) => {
        let html = template
            .replace('<h1>Slide Title</h1>', `<h1>${data.title}</h1>`)
            .replace('<div class="content">', `<div class="content">${data.content}</div>`);
        
        // Remove the default template content if it exists
        html = html.replace(/<div class="box">\s*<p>This is a <span class="highlight">Vibrant Orange<\/span> highlight inside a Soft Blue box.<\/p>\s*<\/div>/, '');
        html = html.replace(/<div class="grid">\s*<div>\s*<p>Column 1 content goes here. Use short, punchy sentences.<\/p>\s*<\/div>\s*<div>\s*<p>Column 2 content. Perfect for comparisons or images.<\/p>\s*<\/div>\s*<\/div>/, '');

        const fileName = `slide_${(index + 1).toString().padStart(2, '0')}.html`;
        const filePath = path.join(TEMP_DIR, fileName);
        fs.writeFileSync(filePath, html);
        slidePaths.push(filePath);
    });

    const pptx = new pptxgen();
    pptx.layout = 'LAYOUT_16x9';

    console.log("Starting PPTX conversion...");
    for (const s of slidePaths) {
        console.log(`Processing: ${path.basename(s)}`);
        await html2pptx(s, pptx);
        console.log(`✅ Processed: ${path.basename(s)}`);
    }

    const outputPath = path.join(OUTPUT_DIR, 'Lesson_03_Slides.pptx');
    await pptx.writeFile({ fileName: outputPath });
    console.log(`Successfully created ${outputPath}`);
    
    // Cleanup temp files
    slidePaths.forEach(p => fs.unlinkSync(p));
    fs.rmdirSync(TEMP_DIR);
}

generate().catch(err => {
    console.error(err);
    process.exit(1);
});
