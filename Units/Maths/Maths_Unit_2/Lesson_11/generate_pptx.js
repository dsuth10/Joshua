const fs = require('fs');
const path = require('path');
const pptxgen = require('pptxgenjs');
const sharp = require('sharp');
const html2pptx = require('c:/Users/dsuth/Documents/Joshua/.agent/skills/pptx/scripts/html2pptx.js');

const buildDir = path.join(__dirname, 'build');
if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir);
}

// ---------------------------------------------------------
// SVG DIAGRAM GENERATOR FUNCTIONS
// ---------------------------------------------------------

async function createDivisionDiagram() {
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="300" viewBox="0 0 600 300">
        <rect width="100%" height="100%" fill="#ffffff" rx="10" filter="drop-shadow(0px 4px 10px rgba(0,0,0,0.1))"/>
        
        <!-- Title/Header -->
        <text x="300" y="35" font-family="Arial" font-size="18" font-weight="bold" fill="#1B4F72" text-anchor="middle">
            Division Model: Labeled Sharing (Jeffrey's 6 Cans of Beans)
        </text>
        
        <!-- Left Side: Jeffrey / Start Group -->
        <circle cx="100" cy="150" r="45" fill="#fcf3cf" stroke="#f1c40f" stroke-width="3"/>
        <text x="100" y="140" font-family="Arial" font-size="12" font-weight="bold" fill="#7d6608" text-anchor="middle">Jeffrey</text>
        <text x="100" y="160" font-family="Arial" font-size="11" fill="#7d6608" text-anchor="middle">(Relief Worker)</text>
        
        <!-- Cans in Jeffrey's Group -->
        <!-- Can 1 -->
        <rect x="75" y="185" width="22" height="30" rx="3" fill="#D35400" stroke="#a04000" stroke-width="2"/>
        <rect x="75" y="182" width="22" height="5" fill="#BDC3C7"/>
        <text x="86" y="203" font-family="Arial" font-size="9" font-weight="bold" fill="#ffffff" text-anchor="middle">B</text>
        
        <!-- Can 2 -->
        <rect x="103" y="185" width="22" height="30" rx="3" fill="#D35400" stroke="#a04000" stroke-width="2"/>
        <rect x="103" y="182" width="22" height="5" fill="#BDC3C7"/>
        <text x="114" y="203" font-family="Arial" font-size="9" font-weight="bold" fill="#ffffff" text-anchor="middle">B</text>
        
        <!-- Can 3 -->
        <rect x="60" y="220" width="22" height="30" rx="3" fill="#D35400" stroke="#a04000" stroke-width="2"/>
        <rect x="60" y="217" width="22" height="5" fill="#BDC3C7"/>
        <text x="71" y="238" font-family="Arial" font-size="9" font-weight="bold" fill="#ffffff" text-anchor="middle">B</text>

        <!-- Can 4 -->
        <rect x="88" y="220" width="22" height="30" rx="3" fill="#D35400" stroke="#a04000" stroke-width="2"/>
        <rect x="88" y="217" width="22" height="5" fill="#BDC3C7"/>
        <text x="99" y="238" font-family="Arial" font-size="9" font-weight="bold" fill="#ffffff" text-anchor="middle">B</text>

        <!-- Can 5 -->
        <rect x="116" y="220" width="22" height="30" rx="3" fill="#D35400" stroke="#a04000" stroke-width="2"/>
        <rect x="116" y="217" width="22" height="5" fill="#BDC3C7"/>
        <text x="127" y="238" font-family="Arial" font-size="9" font-weight="bold" fill="#ffffff" text-anchor="middle">B</text>

        <!-- Can 6 -->
        <rect x="144" y="202" width="22" height="30" rx="3" fill="#D35400" stroke="#a04000" stroke-width="2"/>
        <rect x="144" y="199" width="22" height="5" fill="#BDC3C7"/>
        <text x="155" y="220" font-family="Arial" font-size="9" font-weight="bold" fill="#ffffff" text-anchor="middle">B</text>
        
        <text x="100" y="268" font-family="Arial" font-size="12" font-weight="bold" fill="#2d3748" text-anchor="middle">6 Cans Total</text>
        
        <!-- Right Side: 3 Survivors -->
        <!-- Survivor 1 -->
        <g transform="translate(480, 55)">
            <circle cx="20" cy="20" r="18" fill="#D5F5E3" stroke="#2ECC71" stroke-width="2"/>
            <text x="20" y="24" font-family="Arial" font-size="10" font-weight="bold" fill="#196F3D" text-anchor="middle">S1</text>
            <!-- 2 Cans -->
            <rect x="50" y="5" width="16" height="22" rx="2" fill="#D35400" stroke="#a04000" stroke-width="1.5"/>
            <text x="58" y="18" font-family="Arial" font-size="7" font-weight="bold" fill="#ffffff" text-anchor="middle">B</text>
            <rect x="70" y="5" width="16" height="22" rx="2" fill="#D35400" stroke="#a04000" stroke-width="1.5"/>
            <text x="78" y="18" font-family="Arial" font-size="7" font-weight="bold" fill="#ffffff" text-anchor="middle">B</text>
            <text x="63" y="38" font-family="Arial" font-size="10" font-weight="bold" fill="#2d3748" text-anchor="middle">2 Cans</text>
        </g>
        
        <!-- Survivor 2 -->
        <g transform="translate(480, 130)">
            <circle cx="20" cy="20" r="18" fill="#D5F5E3" stroke="#2ECC71" stroke-width="2"/>
            <text x="20" y="24" font-family="Arial" font-size="10" font-weight="bold" fill="#196F3D" text-anchor="middle">S2</text>
            <!-- 2 Cans -->
            <rect x="50" y="5" width="16" height="22" rx="2" fill="#D35400" stroke="#a04000" stroke-width="1.5"/>
            <text x="58" y="18" font-family="Arial" font-size="7" font-weight="bold" fill="#ffffff" text-anchor="middle">B</text>
            <rect x="70" y="5" width="16" height="22" rx="2" fill="#D35400" stroke="#a04000" stroke-width="1.5"/>
            <text x="78" y="18" font-family="Arial" font-size="7" font-weight="bold" fill="#ffffff" text-anchor="middle">B</text>
            <text x="63" y="38" font-family="Arial" font-size="10" font-weight="bold" fill="#2d3748" text-anchor="middle">2 Cans</text>
        </g>

        <!-- Survivor 3 -->
        <g transform="translate(480, 205)">
            <circle cx="20" cy="20" r="18" fill="#D5F5E3" stroke="#2ECC71" stroke-width="2"/>
            <text x="20" y="24" font-family="Arial" font-size="10" font-weight="bold" fill="#196F3D" text-anchor="middle">S3</text>
            <!-- 2 Cans -->
            <rect x="50" y="5" width="16" height="22" rx="2" fill="#D35400" stroke="#a04000" stroke-width="1.5"/>
            <text x="58" y="18" font-family="Arial" font-size="7" font-weight="bold" fill="#ffffff" text-anchor="middle">B</text>
            <rect x="70" y="5" width="16" height="22" rx="2" fill="#D35400" stroke="#a04000" stroke-width="1.5"/>
            <text x="78" y="18" font-family="Arial" font-size="7" font-weight="bold" fill="#ffffff" text-anchor="middle">B</text>
            <text x="63" y="38" font-family="Arial" font-size="10" font-weight="bold" fill="#2d3748" text-anchor="middle">2 Cans</text>
        </g>

        <!-- Dynamic Action Lines (Sharing Arrows) -->
        <path d="M 230 110 Q 340 70 470 75" fill="none" stroke="#E74C3C" stroke-width="2" stroke-dasharray="4,4"/>
        <polygon points="470,75 460,70 464,78" fill="#E74C3C"/>

        <path d="M 240 150 L 470 150" fill="none" stroke="#E74C3C" stroke-width="2" stroke-dasharray="4,4"/>
        <polygon points="470,150 460,145 460,155" fill="#E74C3C"/>

        <path d="M 230 190 Q 340 230 470 225" fill="none" stroke="#E74C3C" stroke-width="2" stroke-dasharray="4,4"/>
        <polygon points="470,225 464,222 460,230" fill="#E74C3C"/>

        <text x="330" y="138" font-family="Arial" font-size="11" font-weight="bold" fill="#E74C3C" text-anchor="middle">Shared Equally Out To</text>
        <text x="330" y="170" font-family="Arial" font-size="13" font-weight="bold" fill="#17A589" text-anchor="middle">6 ÷ 3 = 2 Cans Each</text>
    </svg>`;
    await sharp(Buffer.from(svg)).png().toFile(path.join(buildDir, 'diagram_division.png'));
}

async function createMultiplicationDiagram() {
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="300" viewBox="0 0 600 300">
        <rect width="100%" height="100%" fill="#ffffff" rx="10" filter="drop-shadow(0px 4px 10px rgba(0,0,0,0.1))"/>
        
        <!-- Title/Header -->
        <text x="300" y="35" font-family="Arial" font-size="18" font-weight="bold" fill="#1B4F72" text-anchor="middle">
            Multiplication Model: Equal Groups (4 Trucks × 8 Packs)
        </text>

        <!-- Helper function simulation using groups -->
        <!-- Truck 1 -->
        <g transform="translate(30, 60)">
            <rect width="115" height="60" rx="5" fill="#34495E" stroke="#2c3e50" stroke-width="2"/>
            <rect x="85" y="15" width="30" height="35" rx="3" fill="#5D6D7E"/>
            <circle cx="25" cy="60" r="12" fill="#1C2833"/>
            <circle cx="85" cy="60" r="12" fill="#1C2833"/>
            <text x="45" y="35" font-family="Arial" font-size="12" font-weight="bold" fill="#ffffff">Truck 1</text>
            
            <!-- 8 Food Packs inside -->
            <g transform="translate(10, -35)">
                <rect x="0" y="0" width="16" height="16" rx="2" fill="#E67E22" stroke="#d35400" stroke-width="1"/>
                <rect x="20" y="0" width="16" height="16" rx="2" fill="#E67E22" stroke="#d35400" stroke-width="1"/>
                <rect x="40" y="0" width="16" height="16" rx="2" fill="#E67E22" stroke="#d35400" stroke-width="1"/>
                <rect x="60" y="0" width="16" height="16" rx="2" fill="#E67E22" stroke="#d35400" stroke-width="1"/>
                <rect x="0" y="18" width="16" height="16" rx="2" fill="#E67E22" stroke="#d35400" stroke-width="1"/>
                <rect x="20" y="18" width="16" height="16" rx="2" fill="#E67E22" stroke="#d35400" stroke-width="1"/>
                <rect x="40" y="18" width="16" height="16" rx="2" fill="#E67E22" stroke="#d35400" stroke-width="1"/>
                <rect x="60" y="18" width="16" height="16" rx="2" fill="#E67E22" stroke="#d35400" stroke-width="1"/>
            </g>
            <text x="57" y="90" font-family="Arial" font-size="12" font-weight="bold" fill="#2c3e50" text-anchor="middle">8 packs</text>
        </g>

        <!-- Truck 2 -->
        <g transform="translate(170, 60)">
            <rect width="115" height="60" rx="5" fill="#34495E" stroke="#2c3e50" stroke-width="2"/>
            <rect x="85" y="15" width="30" height="35" rx="3" fill="#5D6D7E"/>
            <circle cx="25" cy="60" r="12" fill="#1C2833"/>
            <circle cx="85" cy="60" r="12" fill="#1C2833"/>
            <text x="45" y="35" font-family="Arial" font-size="12" font-weight="bold" fill="#ffffff">Truck 2</text>
            
            <!-- 8 Food Packs inside -->
            <g transform="translate(10, -35)">
                <rect x="0" y="0" width="16" height="16" rx="2" fill="#E67E22" stroke="#d35400" stroke-width="1"/>
                <rect x="20" y="0" width="16" height="16" rx="2" fill="#E67E22" stroke="#d35400" stroke-width="1"/>
                <rect x="40" y="0" width="16" height="16" rx="2" fill="#E67E22" stroke="#d35400" stroke-width="1"/>
                <rect x="60" y="0" width="16" height="16" rx="2" fill="#E67E22" stroke="#d35400" stroke-width="1"/>
                <rect x="0" y="18" width="16" height="16" rx="2" fill="#E67E22" stroke="#d35400" stroke-width="1"/>
                <rect x="20" y="18" width="16" height="16" rx="2" fill="#E67E22" stroke="#d35400" stroke-width="1"/>
                <rect x="40" y="18" width="16" height="16" rx="2" fill="#E67E22" stroke="#d35400" stroke-width="1"/>
                <rect x="60" y="18" width="16" height="16" rx="2" fill="#E67E22" stroke="#d35400" stroke-width="1"/>
            </g>
            <text x="57" y="90" font-family="Arial" font-size="12" font-weight="bold" fill="#2c3e50" text-anchor="middle">8 packs</text>
        </g>

        <!-- Truck 3 -->
        <g transform="translate(310, 60)">
            <rect width="115" height="60" rx="5" fill="#34495E" stroke="#2c3e50" stroke-width="2"/>
            <rect x="85" y="15" width="30" height="35" rx="3" fill="#5D6D7E"/>
            <circle cx="25" cy="60" r="12" fill="#1C2833"/>
            <circle cx="85" cy="60" r="12" fill="#1C2833"/>
            <text x="45" y="35" font-family="Arial" font-size="12" font-weight="bold" fill="#ffffff">Truck 3</text>
            
            <!-- 8 Food Packs inside -->
            <g transform="translate(10, -35)">
                <rect x="0" y="0" width="16" height="16" rx="2" fill="#E67E22" stroke="#d35400" stroke-width="1"/>
                <rect x="20" y="0" width="16" height="16" rx="2" fill="#E67E22" stroke="#d35400" stroke-width="1"/>
                <rect x="40" y="0" width="16" height="16" rx="2" fill="#E67E22" stroke="#d35400" stroke-width="1"/>
                <rect x="60" y="0" width="16" height="16" rx="2" fill="#E67E22" stroke="#d35400" stroke-width="1"/>
                <rect x="0" y="18" width="16" height="16" rx="2" fill="#E67E22" stroke="#d35400" stroke-width="1"/>
                <rect x="20" y="18" width="16" height="16" rx="2" fill="#E67E22" stroke="#d35400" stroke-width="1"/>
                <rect x="40" y="18" width="16" height="16" rx="2" fill="#E67E22" stroke="#d35400" stroke-width="1"/>
                <rect x="60" y="18" width="16" height="16" rx="2" fill="#E67E22" stroke="#d35400" stroke-width="1"/>
            </g>
            <text x="57" y="90" font-family="Arial" font-size="12" font-weight="bold" fill="#2c3e50" text-anchor="middle">8 packs</text>
        </g>

        <!-- Truck 4 -->
        <g transform="translate(450, 60)">
            <rect width="115" height="60" rx="5" fill="#34495E" stroke="#2c3e50" stroke-width="2"/>
            <rect x="85" y="15" width="30" height="35" rx="3" fill="#5D6D7E"/>
            <circle cx="25" cy="60" r="12" fill="#1C2833"/>
            <circle cx="85" cy="60" r="12" fill="#1C2833"/>
            <text x="45" y="35" font-family="Arial" font-size="12" font-weight="bold" fill="#ffffff">Truck 4</text>
            
            <!-- 8 Food Packs inside -->
            <g transform="translate(10, -35)">
                <rect x="0" y="0" width="16" height="16" rx="2" fill="#E67E22" stroke="#d35400" stroke-width="1"/>
                <rect x="20" y="0" width="16" height="16" rx="2" fill="#E67E22" stroke="#d35400" stroke-width="1"/>
                <rect x="40" y="0" width="16" height="16" rx="2" fill="#E67E22" stroke="#d35400" stroke-width="1"/>
                <rect x="60" y="0" width="16" height="16" rx="2" fill="#E67E22" stroke="#d35400" stroke-width="1"/>
                <rect x="0" y="18" width="16" height="16" rx="2" fill="#E67E22" stroke="#d35400" stroke-width="1"/>
                <rect x="20" y="18" width="16" height="16" rx="2" fill="#E67E22" stroke="#d35400" stroke-width="1"/>
                <rect x="40" y="18" width="16" height="16" rx="2" fill="#E67E22" stroke="#d35400" stroke-width="1"/>
                <rect x="60" y="18" width="16" height="16" rx="2" fill="#E67E22" stroke="#d35400" stroke-width="1"/>
            </g>
            <text x="57" y="90" font-family="Arial" font-size="12" font-weight="bold" fill="#2c3e50" text-anchor="middle">8 packs</text>
        </g>

        <!-- Total brackets and text -->
        <path d="M 87 180 Q 300 220 513 180" fill="none" stroke="#E74C3C" stroke-width="3"/>
        <text x="300" y="225" font-family="Arial" font-size="14" font-weight="bold" fill="#E74C3C" text-anchor="middle">4 Equal Groups of 8</text>
        <text x="300" y="260" font-family="Arial" font-size="20" font-weight="bold" fill="#17A589" text-anchor="middle">4 × 8 = 32 Food Packs in Total</text>
    </svg>`;
    await sharp(Buffer.from(svg)).png().toFile(path.join(buildDir, 'diagram_multiplication.png'));
}

async function createSubtractionDiagram() {
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="300" viewBox="0 0 600 300">
        <rect width="100%" height="100%" fill="#ffffff" rx="10" filter="drop-shadow(0px 4px 10px rgba(0,0,0,0.1))"/>
        
        <!-- Title/Header -->
        <text x="300" y="35" font-family="Arial" font-size="18" font-weight="bold" fill="#1B4F72" text-anchor="middle">
            Subtraction Model: Part-Whole (120L Tank − 74L Used)
        </text>

        <!-- Entire Tank container -->
        <rect x="180" y="70" width="240" height="150" rx="8" fill="#ebf5fb" stroke="#3498db" stroke-width="3"/>
        
        <!-- Shaded Area representing used portion -->
        <rect x="182" y="72" width="236" height="92" fill="#fadbd8" rx="5"/>
        <line x1="180" y1="164" x2="420" y2="164" stroke="#e74c3c" stroke-width="2" stroke-dasharray="5,3"/>

        <!-- Text inside Tank -->
        <text x="300" y="115" font-family="Arial" font-size="13" font-weight="bold" fill="#c0392b" text-anchor="middle">74 Litres Used for Firefighting</text>
        <text x="300" y="130" font-family="Arial" font-size="10" fill="#78281f" text-anchor="middle">(Crossed out / removed)</text>
        
        <text x="300" y="200" font-family="Arial" font-size="15" font-weight="bold" fill="#2471a3" text-anchor="middle">? Litres Remaining</text>

        <!-- Brackets & Labels -->
        <!-- Full Height bracket -->
        <path d="M 440 70 L 450 70 L 450 145 L 460 145 L 450 145 L 450 220 L 440 220" fill="none" stroke="#2c3e50" stroke-width="2"/>
        <text x="475" y="150" font-family="Arial" font-size="14" font-weight="bold" fill="#2c3e50">120 Litres (Whole)</text>

        <!-- Formula bottom -->
        <text x="300" y="265" font-family="Arial" font-size="18" font-weight="bold" fill="#17A589" text-anchor="middle">
            120 − 74 = 46 Litres Remains
        </text>
    </svg>`;
    await sharp(Buffer.from(svg)).png().toFile(path.join(buildDir, 'diagram_subtraction.png'));
}

async function createAdditionDiagram() {
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="300" viewBox="0 0 600 300">
        <rect width="100%" height="100%" fill="#ffffff" rx="10" filter="drop-shadow(0px 4px 10px rgba(0,0,0,0.1))"/>
        
        <!-- Title/Header -->
        <text x="300" y="35" font-family="Arial" font-size="18" font-weight="bold" fill="#1B4F72" text-anchor="middle">
            Addition Model: Combining Groups (Team A + Team B)
        </text>

        <!-- Group A container -->
        <rect x="50" y="70" width="180" height="100" rx="8" fill="#e8f8f5" stroke="#1abc9c" stroke-width="2"/>
        <text x="140" y="100" font-family="Arial" font-size="14" font-weight="bold" fill="#16a085" text-anchor="middle">Team A Survivors</text>
        <circle cx="140" cy="130" r="20" fill="#1abc9c"/>
        <text x="140" y="136" font-family="Arial" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle">23</text>

        <!-- Plus sign -->
        <text x="275" y="130" font-family="Arial" font-size="40" font-weight="bold" fill="#7f8c8d" text-anchor="middle">+</text>

        <!-- Group B container -->
        <rect x="320" y="70" width="180" height="100" rx="8" fill="#e8f8f5" stroke="#1abc9c" stroke-width="2"/>
        <text x="410" y="100" font-family="Arial" font-size="14" font-weight="bold" fill="#16a085" text-anchor="middle">Team B Survivors</text>
        <circle cx="410" cy="130" r="20" fill="#1abc9c"/>
        <text x="410" y="136" font-family="Arial" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle">18</text>

        <!-- Arrows joining downwards -->
        <path d="M 140 180 Q 200 230 270 230" fill="none" stroke="#e67e22" stroke-width="3"/>
        <polygon points="275,230 266,225 268,235" fill="#e67e22"/>

        <path d="M 410 180 Q 350 230 285 230" fill="none" stroke="#e67e22" stroke-width="3"/>
        <polygon points="280,230 289,235 287,225" fill="#e67e22"/>

        <!-- Result Box -->
        <rect x="200" y="210" width="200" height="40" rx="5" fill="#fdebd0" stroke="#e67e22" stroke-width="2"/>
        <text x="300" y="235" font-family="Arial" font-size="14" font-weight="bold" fill="#d35400" text-anchor="middle">Combined Together</text>

        <text x="300" y="280" font-family="Arial" font-size="18" font-weight="bold" fill="#17A589" text-anchor="middle">
            23 + 18 = 41 Survivors Altogether
        </text>
    </svg>`;
    await sharp(Buffer.from(svg)).png().toFile(path.join(buildDir, 'diagram_addition.png'));
}

// ---------------------------------------------------------
// SLIDES DEFINITION & HTML GENERATION
// ---------------------------------------------------------

const css = `
html { background: #ffffff; margin: 0; padding: 0; }
body {
  width: 720pt; height: 405pt; margin: 0; padding: 0;
  background: #f5f5f5; font-family: Arial, sans-serif;
  display: flex; flex-direction: column; box-sizing: border-box;
}
.slide-container {
  width: 100%; height: 100%; padding: 25pt 35pt; box-sizing: border-box;
  display: flex; flex-direction: column; justify-content: space-between;
}
.header {
  margin-bottom: 12pt;
}
h1 {
  color: #1B4F72; font-size: 24pt; margin: 0 0 4pt 0; font-weight: bold;
}
.subtitle {
  color: #17A589; font-size: 13pt; margin: 0; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;
}
.content-box {
  display: flex; flex-direction: row; justify-content: space-between; align-items: stretch; flex-grow: 1;
}
.left-col {
  width: 45%; display: flex; flex-direction: column; justify-content: center;
}
.right-col {
  width: 50%; display: flex; flex-direction: column; justify-content: center; align-items: center;
}
.text-card {
  background: #ffffff; border-left: 6pt solid #17A589; padding: 15pt; border-radius: 6pt;
  box-shadow: 0 3px 10px rgba(0,0,0,0.06); margin-bottom: 10pt;
}
.text-card.coral {
  border-left-color: #E74C3C;
}
p {
  color: #2d3748; font-size: 13pt; margin: 0; line-height: 1.45;
}
li {
  color: #2d3748; font-size: 12pt; margin: 5pt 0; line-height: 1.4;
}
ul, ol {
  margin: 0; padding-left: 18pt;
}
.diagram-img {
  max-width: 100%; height: auto; border: 1pt solid #ddd; border-radius: 6pt;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}
.full-dark-bg {
  width: 100%; height: 100%; background: #1B4F72; display: flex; flex-direction: column;
  justify-content: center; align-items: center; padding: 40pt; box-sizing: border-box;
  text-align: center;
}
.full-dark-bg h1 {
  color: #ffffff; font-size: 38pt; margin: 0 0 15pt 0;
}
.full-dark-bg p {
  color: #D5F5E3; font-size: 18pt; margin: 0 0 5pt 0; font-weight: bold;
}
.steps-list {
  background: #ebf5fb; padding: 15pt 20pt; border-radius: 8pt; border-left: 6pt solid #2980b9;
  width: 100%; box-sizing: border-box;
}
.steps-list h3 {
  margin: 0 0 8pt 0; color: #2c3e50; font-size: 14pt; font-weight: bold;
}
`;

const slides = [
    {
        name: 'slide1',
        html: `<!DOCTYPE html><html><head><style>${css}</style></head><body>
            <div class="full-dark-bg">
                <h1>Draw It to Solve It!</h1>
                <p>Maths Unit 2 • Lesson 11</p>
                <p style="color: #f1c40f; font-size: 15pt; text-transform: uppercase; letter-spacing: 2px; margin-top: 10pt;">
                    Visualising Natural Disaster Word Problems on Whiteboards
                </p>
            </div>
        </body></html>`
    },
    {
        name: 'slide2',
        html: `<!DOCTYPE html><html><head><style>${css}</style></head><body>
            <div class="slide-container">
                <div class="header">
                    <p class="subtitle">Introduction</p>
                    <h1>Why Draw the Problem?</h1>
                </div>
                <div class="content-box">
                    <div class="left-col" style="width: 48%;">
                        <div class="text-card">
                            <p><b>A word problem is a story first!</b></p>
                            <p style="margin-top: 6pt;">Before doing any addition, subtraction, multiplication, or division, we must understand the action taking place in that story.</p>
                        </div>
                        <div class="text-card coral">
                            <p><b>If you can draw it, you understand it.</b></p>
                            <p style="margin-top: 6pt;">Your whiteboard is a sketchpad to show the people, the objects, and the mathematical action (distributing, taking away, grouping, or combining).</p>
                        </div>
                    </div>
                    <div class="right-col" style="width: 48%; align-items: stretch;">
                        <div class="steps-list">
                            <h3>Our Goal Today:</h3>
                            <ol>
                                <li><b>Read</b> the natural disaster scenario.</li>
                                <li><b>Draw</b> the people, items, and action.</li>
                                <li><b>Label</b> the numbers on the diagram.</li>
                                <li><b>Write</b> the number sentence.</li>
                                <li><b>Explain</b> your picture to your partner.</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </body></html>`
    },
    {
        name: 'slide3',
        html: `<!DOCTYPE html><html><head><style>${css}</style></head><body>
            <div class="slide-container">
                <div class="header">
                    <p class="subtitle">Model 1: Division</p>
                    <h1>Jeffrey's Canned Beans (Flood Relief)</h1>
                </div>
                <div class="content-box">
                    <div class="left-col">
                        <div class="text-card">
                            <p><b>Read the Scenario:</b></p>
                            <p style="margin-top: 8pt; font-style: italic; font-size: 12pt;">
                                "Jeffrey is a disaster relief worker. He has 6 cans of beans to share equally between 3 flood survivors. How many cans does each survivor receive?"
                            </p>
                        </div>
                        <div class="text-card coral">
                            <p><b>Notice the Action:</b></p>
                            <ul style="margin-top: 4pt; font-size: 11pt; padding-left: 14pt;">
                                <li>Start with a <b>whole group</b> (6 cans of beans).</li>
                                <li><b>Share out equally</b> to 3 different groups.</li>
                                <li><b>Action:</b> Splitting a whole into equal parts = <b>Division</b>!</li>
                            </ul>
                        </div>
                    </div>
                    <div class="right-col">
                        <img src="diagram_division.png" class="diagram-img"/>
                    </div>
                </div>
            </div>
        </body></html>`
    },
    {
        name: 'slide4',
        html: `<!DOCTYPE html><html><head><style>${css}</style></head><body>
            <div class="slide-container">
                <div class="header">
                    <p class="subtitle">Diagram Breakdown</p>
                    <h1>How to Draw Division</h1>
                </div>
                <div class="content-box">
                    <div class="left-col" style="width: 50%;">
                        <div class="steps-list">
                            <h3>Steps to Draw on your Whiteboard:</h3>
                            <ol>
                                <li><b>Draw the Starter (The Giver):</b> Sketch Jeffrey and the 6 cans of beans together.</li>
                                <li><b>Draw the Receivers:</b> Draw 3 separate survivor figures.</li>
                                <li><b>Draw the Action (Arrows):</b> Group the beans and draw sharing arrows from the beans to each person.</li>
                                <li><b>Label and Write:</b> Label how many beans each person got (2). Write <b>6 ÷ 3 = 2</b>.</li>
                            </ol>
                        </div>
                    </div>
                    <div class="right-col" style="width: 45%;">
                        <div class="text-card" style="border-left-color: #2980b9;">
                            <p><b>Student Whiteboard Check:</b></p>
                            <ul style="margin-top: 5pt; font-size: 11pt;">
                                <li>Did you draw 6 items?</li>
                                <li>Did you draw 3 target groups?</li>
                                <li>Did you divide them evenly?</li>
                                <li>Is your final answer labelled (<b>2 cans</b>)?</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </body></html>`
    },
    {
        name: 'slide5',
        html: `<!DOCTYPE html><html><head><style>${css}</style></head><body>
            <div class="slide-container">
                <div class="header">
                    <p class="subtitle">Model 2: Multiplication</p>
                    <h1>Flood Supply Trucks (Equal Groups)</h1>
                </div>
                <div class="content-box">
                    <div class="left-col">
                        <div class="text-card">
                            <p><b>Read the Scenario:</b></p>
                            <p style="margin-top: 8pt; font-style: italic; font-size: 12pt;">
                                "After the flood, 4 emergency supply trucks each carried 8 food packs to the disaster zone. How many food packs arrived in total?"
                            </p>
                        </div>
                        <div class="text-card coral">
                            <p><b>Notice the Action:</b></p>
                            <ul style="margin-top: 4pt; font-size: 11pt; padding-left: 14pt;">
                                <li>We have <b>4 trucks</b> (4 groups).</li>
                                <li>Each truck has <b>exactly 8 packs</b> (equal items per group).</li>
                                <li><b>Action:</b> Repeated addition of equal groups = <b>Multiplication</b>!</li>
                            </ul>
                        </div>
                    </div>
                    <div class="right-col">
                        <img src="diagram_multiplication.png" class="diagram-img"/>
                    </div>
                </div>
            </div>
        </body></html>`
    },
    {
        name: 'slide6',
        html: `<!DOCTYPE html><html><head><style>${css}</style></head><body>
            <div class="slide-container">
                <div class="header">
                    <p class="subtitle">Diagram Breakdown</p>
                    <h1>How to Draw Multiplication</h1>
                </div>
                <div class="content-box">
                    <div class="left-col" style="width: 50%;">
                        <div class="steps-list">
                            <h3>Steps to Draw on your Whiteboard:</h3>
                            <ol>
                                <li><b>Draw the Groups:</b> Sketch 4 simple trucks (rectangles with wheels are perfect!).</li>
                                <li><b>Draw the Items inside:</b> Draw 8 small box shapes inside/near each truck.</li>
                                <li><b>Label the Quantities:</b> Write "8" under each truck to represent the equal quantity.</li>
                                <li><b>Draw the Total Bracket:</b> Bracket them together and write the sum: <b>4 × 8 = 32</b>.</li>
                            </ol>
                        </div>
                    </div>
                    <div class="right-col" style="width: 45%;">
                        <div class="text-card" style="border-left-color: #2980b9;">
                            <p><b>Student Whiteboard Check:</b></p>
                            <ul style="margin-top: 5pt; font-size: 11pt;">
                                <li>Are all your groups equal (8 in each)?</li>
                                <li>Do you have exactly 4 groups?</li>
                                <li>Did you label the numbers?</li>
                                <li>Is your final answer labelled (<b>32 packs</b>)?</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </body></html>`
    },
    {
        name: 'slide7',
        html: `<!DOCTYPE html><html><head><style>${css}</style></head><body>
            <div class="slide-container">
                <div class="header">
                    <p class="subtitle">Model 3: Subtraction</p>
                    <h1>Bushfire Water Reserves (Taking Away)</h1>
                </div>
                <div class="content-box">
                    <div class="left-col">
                        <div class="text-card">
                            <p><b>Read the Scenario:</b></p>
                            <p style="margin-top: 8pt; font-style: italic; font-size: 12pt;">
                                "Before the bushfire, the town's reserve tank held 120 litres of water. After three days of firefighting, 74 litres had been used. How much water remains in the tank?"
                            </p>
                        </div>
                        <div class="text-card coral">
                            <p><b>Notice the Action:</b></p>
                            <ul style="margin-top: 4pt; font-size: 11pt; padding-left: 14pt;">
                                <li>We start with a <b>whole amount</b> (120 Litres).</li>
                                <li>We take a <b>part of it away</b> (74 Litres used).</li>
                                <li><b>Action:</b> Removing a part to find what is left = <b>Subtraction</b>!</li>
                            </ul>
                        </div>
                    </div>
                    <div class="right-col">
                        <img src="diagram_subtraction.png" class="diagram-img"/>
                    </div>
                </div>
            </div>
        </body></html>`
    },
    {
        name: 'slide8',
        html: `<!DOCTYPE html><html><head><style>${css}</style></head><body>
            <div class="slide-container">
                <div class="header">
                    <p class="subtitle">Diagram Breakdown</p>
                    <h1>How to Draw Subtraction</h1>
                </div>
                <div class="content-box">
                    <div class="left-col" style="width: 50%;">
                        <div class="steps-list">
                            <h3>Steps to Draw on your Whiteboard:</h3>
                            <ol>
                                <li><b>Draw the Whole (The Tank):</b> Draw a big box/cylinder and label the side "120 L".</li>
                                <li><b>Mark the Part Taken:</b> Partition the tank. Shade/cross out the top part and label it "74 L used".</li>
                                <li><b>Label the Unknown Part:</b> Put a "?" in the unshaded bottom part.</li>
                                <li><b>Write the Math sentence:</b> Solve for the remaining part: <b>120 − 74 = 46</b>.</li>
                            </ol>
                        </div>
                    </div>
                    <div class="right-col" style="width: 45%;">
                        <div class="text-card" style="border-left-color: #2980b9;">
                            <p><b>Student Whiteboard Check:</b></p>
                            <ul style="margin-top: 5pt; font-size: 11pt;">
                                <li>Did you start with the full amount (120)?</li>
                                <li>Did you clearly separate the part taken away?</li>
                                <li>Is the remaining part labeled "? remains"?</li>
                                <li>Is your final answer labelled (<b>46 litres</b>)?</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </body></html>`
    },
    {
        name: 'slide9',
        html: `<!DOCTYPE html><html><head><style>${css}</style></head><body>
            <div class="slide-container">
                <div class="header">
                    <p class="subtitle">Model 4: Addition</p>
                    <h1>Cyclone Evacuation (Combining Groups)</h1>
                </div>
                <div class="content-box">
                    <div class="left-col">
                        <div class="text-card">
                            <p><b>Read the Scenario:</b></p>
                            <p style="margin-top: 8pt; font-style: italic; font-size: 12pt;">
                                "Team A rescued 23 survivors from the cyclone damage. Team B rescued 18 survivors. How many survivors were rescued altogether?"
                            </p>
                        </div>
                        <div class="text-card coral">
                            <p><b>Notice the Action:</b></p>
                            <ul style="margin-top: 4pt; font-size: 11pt; padding-left: 14pt;">
                                <li>We have <b>two separate parts</b> (23 and 18).</li>
                                <li>We want to find the <b>total combined</b> amount.</li>
                                <li><b>Action:</b> Putting two unequal groups together = <b>Addition</b>!</li>
                            </ul>
                        </div>
                    </div>
                    <div class="right-col">
                        <img src="diagram_addition.png" class="diagram-img"/>
                    </div>
                </div>
            </div>
        </body></html>`
    },
    {
        name: 'slide10',
        html: `<!DOCTYPE html><html><head><style>${css}</style></head><body>
            <div class="slide-container">
                <div class="header">
                    <p class="subtitle">Diagram Breakdown</p>
                    <h1>How to Draw Addition</h1>
                </div>
                <div class="content-box">
                    <div class="left-col" style="width: 50%;">
                        <div class="steps-list">
                            <h3>Steps to Draw on your Whiteboard:</h3>
                            <ol>
                                <li><b>Draw the Parts:</b> Draw two separate boxes or circles side-by-side.</li>
                                <li><b>Label the Groups:</b> Label one "Team A: 23" and the other "Team B: 18".</li>
                                <li><b>Draw the Action (Combine):</b> Draw arrows from both circles leading down into a larger "Altogether" container.</li>
                                <li><b>Write the Math sentence:</b> Calculate the sum: <b>23 + 18 = 41</b>.</li>
                            </ol>
                        </div>
                    </div>
                    <div class="right-col" style="width: 45%;">
                        <div class="text-card" style="border-left-color: #2980b9;">
                            <p><b>Student Whiteboard Check:</b></p>
                            <ul style="margin-top: 5pt; font-size: 11pt;">
                                <li>Did you keep the two starter groups separate at first?</li>
                                <li>Did you draw arrows showing them combining?</li>
                                <li>Did you label both numbers?</li>
                                <li>Is your final answer labelled (<b>41 survivors</b>)?</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </body></html>`
    },
    {
        name: 'slide11',
        html: `<!DOCTYPE html><html><head><style>${css}</style></head><body>
            <div class="slide-container">
                <div class="header">
                    <p class="subtitle">Practice Time</p>
                    <h1>Your Turn! (Pair Whiteboard Practice)</h1>
                </div>
                <div class="content-box">
                    <div class="left-col" style="width: 48%;">
                        <div class="text-card" style="border-left-color: #f1c40f;">
                            <p><b>Directions:</b></p>
                            <p style="margin-top: 5pt; font-size: 11pt; line-height: 1.4;">
                                1. Work in pairs. Take a <b>Disaster Card</b>.<br/>
                                2. **Partner A:** Draw the scenario on the whiteboard. Focus on the action (people, items, movement).<br/>
                                3. **Partner B:** Identify the operation (+, −, ×, ÷) and write the matching number sentence below the drawing.<br/>
                                4. **Both:** Explain your choices to each other, erase, and swap roles!
                            </p>
                        </div>
                    </div>
                    <div class="right-col" style="width: 48%; align-items: stretch;">
                        <div class="steps-list" style="border-left-color: #16a085; background: #e8f8f5;">
                            <h3 style="color: #16a085;">Whiteboard Quality Guide:</h3>
                            <ul style="padding-left: 15pt; font-size: 11pt; color: #196f3d;">
                                <li>Sketch simple blocks, circles, or stick figures.</li>
                                <li>Use arrows to show sharing, taking away, or combining.</li>
                                <li>Label all numbers in the drawing.</li>
                                <li>Circle the operation symbol clearly at the bottom.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </body></html>`
    },
    {
        name: 'slide12',
        html: `<!DOCTYPE html><html><head><style>${css}</style></head><body>
            <div class="full-dark-bg">
                <h1>Reflecting on our Diagrams</h1>
                <p style="color: #f1c40f; margin-bottom: 20pt;">How did your whiteboard drawing help you?</p>
                <div style="display: flex; flex-direction: row; justify-content: space-around; width: 80%; text-align: left;">
                    <div style="width: 45%; background: rgba(255,255,255,0.1); padding: 15pt; border-radius: 6pt;">
                        <p style="color: #ffffff; font-size: 13pt; font-weight: bold; margin-bottom: 8pt;">"Your picture is your proof!"</p>
                        <p style="color: #e8f8f5; font-size: 11pt; line-height: 1.4;">If you're stuck on a word problem, don't guess. Draw the characters, draw the items, and do what the story tells you to do.</p>
                    </div>
                    <div style="width: 45%; background: rgba(255,255,255,0.1); padding: 15pt; border-radius: 6pt;">
                        <p style="color: #ffffff; font-size: 13pt; font-weight: bold; margin-bottom: 8pt;">Sharing is Caring</p>
                        <p style="color: #e8f8f5; font-size: 11pt; line-height: 1.4;">Explain your drawings to your peers! Speaking mathematically builds your brain's connection to word problems.</p>
                    </div>
                </div>
            </div>
        </body></html>`
    }
];

async function generate() {
    console.log("Generating Slide Diagrams...");
    try {
        await createDivisionDiagram();
        await createMultiplicationDiagram();
        await createSubtractionDiagram();
        await createAdditionDiagram();
        console.log("SVG Diagrams successfully generated and rasterised!");

        console.log("Generating PPTX...");
        const pres = new pptxgen();
        pres.layout = 'LAYOUT_16x9';
        
        for (const slideData of slides) {
            const filepath = path.join(buildDir, slideData.name + '.html');
            fs.writeFileSync(filepath, slideData.html);
            console.log(`Writing HTML for ${slideData.name}...`);
            await html2pptx(filepath, pres);
        }
        
        const outputPath = path.join(__dirname, 'Lesson_11_Presentation.pptx');
        await pres.writeFile({ fileName: outputPath });
        console.log("Successfully created Lesson_11_Presentation.pptx!");
    } catch (err) {
        console.error("Error during PPTX generation:", err);
    }
}

generate();
