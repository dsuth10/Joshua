from pathlib import Path
import html

def build_package():
    base_dir = Path(__file__).resolve().parent
    sch_svg = (base_dir / "arduino_piano_schematic.svg").read_text(encoding="utf-8").replace("stroke-dasharray:-;", "")
    bb_svg = (base_dir / "arduino_piano_breadboard.svg").read_text(encoding="utf-8")

    
    html_content = f"""<!doctype html>
<html lang="en-AU">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Arduino 3-Button Tone Piano — Circuit &amp; Wiring Diagram</title>
  <style>
    :root {{
      --primary: #00878f;
      --primary-dark: #005c63;
      --accent: #2563eb;
      --bg: #f8fafc;
      --surface: #ffffff;
      --text: #0f172a;
      --text-muted: #64748b;
      --border: #e2e8f0;
      --shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.03);
    }}
    * {{ box-sizing: border-box; margin: 0; padding: 0; }}
    body {{
      font-family: 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.6;
      padding-bottom: 60px;
    }}
    .header {{
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: #ffffff;
      padding: 36px 24px;
      border-bottom: 4px solid var(--primary);
    }}
    .container {{
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }}
    .header-content {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 20px;
    }}
    .header h1 {{
      font-size: 2rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      margin-bottom: 6px;
    }}
    .header p {{
      color: #94a3b8;
      font-size: 1.05rem;
    }}
    .badge {{
      display: inline-block;
      padding: 6px 14px;
      border-radius: 9999px;
      background: rgba(0, 135, 143, 0.2);
      color: #2dd4bf;
      border: 1px solid rgba(45, 212, 191, 0.4);
      font-size: 0.85rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }}
    .nav-tabs {{
      display: flex;
      gap: 12px;
      margin-top: 28px;
      border-bottom: 2px solid var(--border);
    }}
    .tab-btn {{
      padding: 12px 24px;
      background: none;
      border: none;
      border-bottom: 3px solid transparent;
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--text-muted);
      cursor: pointer;
      transition: all 0.2s;
    }}
    .tab-btn:hover {{
      color: var(--primary);
    }}
    .tab-btn.active {{
      color: var(--primary);
      border-bottom-color: var(--primary);
    }}
    .viewer-card {{
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 16px;
      box-shadow: var(--shadow);
      margin-top: 24px;
      overflow: hidden;
    }}
    .viewer-toolbar {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 20px;
      background: #f1f5f9;
      border-bottom: 1px solid var(--border);
      flex-wrap: wrap;
      gap: 12px;
    }}
    .viewer-toolbar h2 {{
      font-size: 1.15rem;
      font-weight: 700;
      color: #1e293b;
    }}
    .btn-group {{
      display: flex;
      gap: 8px;
    }}
    .btn {{
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      border: 1px solid var(--border);
      background: #ffffff;
      color: #1e293b;
      transition: all 0.15s ease;
    }}
    .btn:hover {{
      background: #e2e8f0;
    }}
    .btn-primary {{
      background: var(--primary);
      border-color: var(--primary-dark);
      color: #ffffff;
    }}
    .btn-primary:hover {{
      background: var(--primary-dark);
    }}
    .diagram-display {{
      padding: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #ffffff;
      min-height: 520px;
      overflow-x: auto;
    }}
    .diagram-display svg {{
      max-width: 100%;
      height: auto;
      display: block;
    }}
    .tab-content {{
      display: none;
    }}
    .tab-content.active {{
      display: block;
    }}
    .grid-2 {{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
      gap: 24px;
      margin-top: 32px;
    }}
    .info-card {{
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 24px;
      box-shadow: var(--shadow);
    }}
    .info-card h3 {{
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 16px;
      color: #0f172a;
      display: flex;
      align-items: center;
      gap: 8px;
    }}
    table.spec-table {{
      width: 100%;
      border-collapse: collapse;
      font-size: 0.92rem;
    }}
    table.spec-table th, table.spec-table td {{
      padding: 10px 14px;
      text-align: left;
      border-bottom: 1px solid var(--border);
    }}
    table.spec-table th {{
      background: #f8fafc;
      color: #475569;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 0.8rem;
      letter-spacing: 0.05em;
    }}
    table.spec-table tr:hover td {{
      background: #f8fafc;
    }}
    .color-pill {{
      display: inline-block;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      vertical-align: middle;
      margin-right: 6px;
      border: 1px solid rgba(0,0,0,0.2);
    }}
    .resistor-display {{
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 14px;
      background: #f8fafc;
      border-radius: 10px;
      margin-bottom: 14px;
      border: 1px solid var(--border);
    }}
    .resistor-graphic {{
      width: 120px;
      height: 30px;
      background: #e8cfb0;
      border-radius: 8px;
      position: relative;
      border: 1px solid #b89770;
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      padding: 0 10px;
    }}
    .resistor-band {{
      width: 8px;
      height: 100%;
    }}
    pre code {{
      display: block;
      padding: 18px;
      background: #0f172a;
      color: #e2e8f0;
      border-radius: 12px;
      font-family: 'Consolas', 'Fira Code', Courier, monospace;
      font-size: 0.9rem;
      line-height: 1.5;
      overflow-x: auto;
    }}
    .copy-btn {{
      float: right;
      margin-bottom: -32px;
      position: relative;
      z-index: 10;
    }}
    .key-concept {{
      margin-top: 14px;
      padding: 14px 18px;
      border-left: 4px solid var(--primary);
      background: #f0fdfa;
      border-radius: 0 8px 8px 0;
      font-size: 0.92rem;
    }}
    .key-concept strong {{
      color: var(--primary-dark);
    }}
  </style>
</head>
<body>

  <header class="header">
    <div class="container">
      <div class="header-content">
        <div>
          <span class="badge">Arduino Uno Project</span>
          <h1>3-Button Arduino Tone Piano</h1>
          <p>Complete Electrical Schematic, Physical Breadboard Wiring &amp; C++ Code Reference</p>
        </div>
        <div class="header-tags">
          <span class="badge" style="background:#1e293b; color:#e2e8f0; border-color:#475569;">IEC Standard Symbols</span>
        </div>
      </div>
    </div>
  </header>

  <main class="container">
    <!-- Tab Controls -->
    <nav class="nav-tabs" aria-label="Diagram Views">
      <button class="tab-btn active" onclick="switchTab('schematic')">📐 Schematic Circuit Diagram</button>
      <button class="tab-btn" onclick="switchTab('breadboard')">🔌 Physical Breadboard Layout</button>
      <button class="tab-btn" onclick="switchTab('code')">💻 Arduino C++ Source Code</button>
      <button class="tab-btn" onclick="switchTab('guide')">📖 Circuit Theory &amp; Pinout</button>
    </nav>

    <!-- Tab 1: Schematic -->
    <div id="tab-schematic" class="tab-content active">
      <div class="viewer-card">
        <div class="viewer-toolbar">
          <h2>Symbolic Electrical Circuit Schematic (IEC 60617 Standard)</h2>
          <div class="btn-group">
            <button class="btn" onclick="downloadSVG('schematic-svg-container', 'arduino_piano_schematic.svg')">⬇ Download SVG</button>
            <button class="btn btn-primary" onclick="downloadPNG('schematic-svg-container', 'arduino_piano_schematic.png')">📷 Download PNG</button>
          </div>
        </div>
        <div class="diagram-display" id="schematic-svg-container">
          {sch_svg}
        </div>
      </div>
    </div>

    <!-- Tab 2: Breadboard Layout -->
    <div id="tab-breadboard" class="tab-content">
      <div class="viewer-card">
        <div class="viewer-toolbar">
          <h2>Physical Breadboard &amp; Jumper Wiring Hookup Diagram</h2>
          <div class="btn-group">
            <button class="btn" onclick="downloadSVG('breadboard-svg-container', 'arduino_piano_breadboard.svg')">⬇ Download SVG</button>
            <button class="btn btn-primary" onclick="downloadPNG('breadboard-svg-container', 'arduino_piano_breadboard.png')">📷 Download PNG</button>
          </div>
        </div>
        <div class="diagram-display" id="breadboard-svg-container">
          {bb_svg}
        </div>
      </div>
    </div>

    <!-- Tab 3: Code -->
    <div id="tab-code" class="tab-content">
      <div class="viewer-card" style="padding: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <h2 style="font-size: 1.25rem;">Arduino Tone Piano C++ Firmware</h2>
          <button class="btn btn-primary" onclick="copyCode()">📋 Copy Code</button>
        </div>
        <pre><code id="arduino-code">// Arduino 3-Button Tone Piano
// Generates musical notes C4, E4, and G4 using passive speaker / buzzer

const int speakerPin = 8;
const int button1 = 2; // Button 1 -> Tone C4 (262 Hz)
const int button2 = 3; // Button 2 -> Tone E4 (330 Hz)
const int button3 = 4; // Button 3 -> Tone G4 (392 Hz)

// Musical Pitch Frequencies (Hertz)
const int tone1 = 262; // C4 (Middle C)
const int tone2 = 330; // E4
const int tone3 = 392; // G4

void setup() {{
  pinMode(speakerPin, OUTPUT);
  // Buttons configured with external 10k pull-down resistors
  pinMode(button1, INPUT);
  pinMode(button2, INPUT);
  pinMode(button3, INPUT);
}}

void loop() {{
  if (digitalRead(button1) == HIGH) {{
    tone(speakerPin, tone1, 200); // Play C4 for 200 ms
  }}
  else if (digitalRead(button2) == HIGH) {{
    tone(speakerPin, tone2, 200); // Play E4 for 200 ms
  }}
  else if (digitalRead(button3) == HIGH) {{
    tone(speakerPin, tone3, 200); // Play G4 for 200 ms
  }}
}}</code></pre>
      </div>
    </div>

    <!-- Tab 4: Guide & Pinout -->
    <div id="tab-guide" class="tab-content">
      <div class="grid-2">
        <!-- Pinout Table Card -->
        <div class="info-card">
          <h3>📌 Complete Pinout &amp; Wiring Table</h3>
          <table class="spec-table">
            <thead>
              <tr>
                <th>Arduino Pin</th>
                <th>Target Component</th>
                <th>Electrical Role</th>
                <th>Wire Colour</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>5V</strong></td>
                <td>Breadboard Top (+) Rail</td>
                <td>System Logic Power (+5V DC)</td>
                <td><span class="color-pill" style="background:#dc2626;"></span>Red</td>
              </tr>
              <tr>
                <td><strong>GND</strong></td>
                <td>Breadboard Bottom (-) Rail</td>
                <td>System Ground Reference (0V)</td>
                <td><span class="color-pill" style="background:#0f172a;"></span>Black</td>
              </tr>
              <tr>
                <td><strong>Digital Pin 2</strong></td>
                <td>Button 1 &amp; R1 (10kΩ)</td>
                <td>Active-HIGH Input (C4: 262Hz)</td>
                <td><span class="color-pill" style="background:#10b981;"></span>Green</td>
              </tr>
              <tr>
                <td><strong>Digital Pin 3</strong></td>
                <td>Button 2 &amp; R2 (10kΩ)</td>
                <td>Active-HIGH Input (E4: 330Hz)</td>
                <td><span class="color-pill" style="background:#eab308;"></span>Yellow</td>
              </tr>
              <tr>
                <td><strong>Digital Pin 4</strong></td>
                <td>Button 3 &amp; R3 (10kΩ)</td>
                <td>Active-HIGH Input (G4: 392Hz)</td>
                <td><span class="color-pill" style="background:#f97316;"></span>Orange</td>
              </tr>
              <tr>
                <td><strong>Digital Pin 8</strong></td>
                <td>R4 (100Ω) &rarr; Speaker (+)</td>
                <td>Tone PWM Audio Output</td>
                <td><span class="color-pill" style="background:#8b5cf6;"></span>Purple</td>
              </tr>
              <tr>
                <td><strong>GND Rail</strong></td>
                <td>Speaker (-) Negative Lead</td>
                <td>Audio Return Ground Path</td>
                <td><span class="color-pill" style="background:#0f172a;"></span>Black</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Resistor Color Code Guide -->
        <div class="info-card">
          <h3>🎨 Resistor Colour Code Guide</h3>
          
          <div class="resistor-display">
            <div class="resistor-graphic">
              <div class="resistor-band" style="background:#854d0e;" title="Brown: 1"></div>
              <div class="resistor-band" style="background:#171717;" title="Black: 0"></div>
              <div class="resistor-band" style="background:#ea580c;" title="Orange: x1,000"></div>
              <div class="resistor-band" style="background:#d97706;" title="Gold: 5%"></div>
            </div>
            <div>
              <strong>10 kΩ (10,000 Ohms) &times; 3</strong><br>
              <span style="color:#64748b; font-size:0.85rem;">Bands: Brown - Black - Orange - Gold</span><br>
              <small>Role: Pull-down resistors for Push Buttons 1, 2, 3</small>
            </div>
          </div>

          <div class="resistor-display">
            <div class="resistor-graphic">
              <div class="resistor-band" style="background:#854d0e;" title="Brown: 1"></div>
              <div class="resistor-band" style="background:#171717;" title="Black: 0"></div>
              <div class="resistor-band" style="background:#854d0e;" title="Brown: x10"></div>
              <div class="resistor-band" style="background:#d97706;" title="Gold: 5%"></div>
            </div>
            <div>
              <strong>100 Ω (100 Ohms) &times; 1</strong><br>
              <span style="color:#64748b; font-size:0.85rem;">Bands: Brown - Black - Brown - Gold</span><br>
              <small>Role: Current-limiting protection for 8Ω Speaker</small>
            </div>
          </div>

          <div class="key-concept">
            <strong>Why 100Ω on the Speaker?</strong><br>
            A bare 8Ω speaker connected directly to a 5V digital pin would draw <code>I = V / R = 5V / 8Ω = 625 mA</code>! The absolute maximum safe current for an Arduino ATmega328P output pin is <strong>40 mA</strong>. Placing a 100Ω resistor in series limits current to safe levels (<code>5V / 108Ω &approx; 46 mA peak</code>), protecting both the pin and speaker coil.
          </div>
        </div>
      </div>

      <!-- Electrical Principles Card -->
      <div class="info-card" style="margin-top: 24px;">
        <h3>💡 Engineering Principles &amp; Working Mechanism</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
          <div>
            <h4 style="color:var(--primary); margin-bottom:8px;">1. Pull-Down Resistors (Active-HIGH)</h4>
            <p style="font-size:0.92rem; color:#475569;">
              When a tactile button is released (open circuit), the digital input pin is disconnected from the 5V rail. Without a pull-down resistor, the pin would "float"—acting as an antenna and picking up stray electromagnetic noise, causing random HIGH/LOW triggers. The 10kΩ resistor bleeds any residual charge to GND, maintaining a solid <strong>0V (LOW)</strong> state until pressed.
            </p>
          </div>
          <div>
            <h4 style="color:var(--primary); margin-bottom:8px;">2. Tone Generation Mechanics</h4>
            <p style="font-size:0.92rem; color:#475569;">
              The Arduino <code>tone(pin, frequency, duration)</code> function toggles Digital Pin 8 using an internal hardware timer (Timer 2) to output a 50% duty-cycle square wave at the target frequency. When the diaphragm in the 8Ω speaker oscillates at 262 Hz, 330 Hz, or 392 Hz, it creates acoustic compression waves corresponding to notes <strong>C4</strong>, <strong>E4</strong>, and <strong>G4</strong> (a C Major triad).
            </p>
          </div>
          <div>
            <h4 style="color:var(--primary); margin-bottom:8px;">3. Advanced Tip: Built-In INPUT_PULLUP</h4>
            <p style="font-size:0.92rem; color:#475569;">
              In production circuits, you can eliminate the external 10kΩ resistors altogether by setting <code>pinMode(pin, INPUT_PULLUP)</code>. This activates the internal 20kΩ-50kΩ pull-up resistors inside the ATmega328P. The buttons then connect directly between the digital pin and GND, inverting the code logic so <code>digitalRead(pin) == LOW</code> indicates a press!
            </p>
          </div>
        </div>
      </div>
    </div>
  </main>

  <script>
    function switchTab(tabId) {{
      document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
      
      const selectedBtn = Array.from(document.querySelectorAll('.tab-btn')).find(b => b.getAttribute('onclick').includes(tabId));
      if (selectedBtn) selectedBtn.classList.add('active');
      
      const targetContent = document.getElementById('tab-' + tabId);
      if (targetContent) targetContent.classList.add('active');
    }}

    function downloadSVG(containerId, filename) {{
      const svg = document.querySelector('#' + containerId + ' svg');
      if (!svg) return;
      const copy = svg.cloneNode(true);
      copy.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      const text = new XMLSerializer().serializeToString(copy);
      const blob = new Blob([text], {{ type: 'image/svg+xml;charset=utf-8' }});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }}

    function downloadPNG(containerId, filename) {{
      const svg = document.querySelector('#' + containerId + ' svg');
      if (!svg) return;
      const copy = svg.cloneNode(true);
      copy.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      const text = new XMLSerializer().serializeToString(copy);
      const blob = new Blob([text], {{ type: 'image/svg+xml;charset=utf-8' }});
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {{
        const canvas = document.createElement('canvas');
        const scale = 2.5; // High resolution
        const bbox = svg.viewBox.baseVal;
        const w = bbox.width || svg.clientWidth || 1000;
        const h = bbox.height || svg.clientHeight || 700;
        canvas.width = Math.ceil(w * scale);
        canvas.height = Math.ceil(h * scale);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        canvas.toBlob(out => {{
          const a = document.createElement('a');
          a.href = URL.createObjectURL(out);
          a.download = filename;
          a.click();
          setTimeout(() => URL.revokeObjectURL(a.href), 1000);
        }}, 'image/png');
      }};
      img.src = url;
    }}

    function copyCode() {{
      const code = document.getElementById('arduino-code').innerText;
      navigator.clipboard.writeText(code).then(() => {{
        alert('Arduino code copied to clipboard!');
      }}).catch(err => {{
        console.error('Failed to copy', err);
      }});
    }}
  </script>
</body>
</html>
"""
    out_file = base_dir / "index.html"
    out_file.write_text(html_content, encoding="utf-8")
    print("HTML package written to:", out_file)

if __name__ == "__main__":
    build_package()
