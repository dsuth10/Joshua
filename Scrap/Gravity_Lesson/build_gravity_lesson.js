const path = require('path');
const fs = require('fs');
const { generateHTMLPresentation, generateHandout } = require('../../.agent/skills/english-lesson/scripts/create_lesson_resources');

// Structured Slides Data for Year 7 Science: Forces and Gravity [AC9S7U04]
const slidesData = [
  {
    title: "Gravitational Forces in Action",
    subtitle: "Year 7 Science - Australian Curriculum v9 [AC9S7U04]",
    theme: "dark",
    standardHtml: `
      <p style="font-size: 28px; color: var(--white); max-width: 800px; margin: 0 auto;">
        Welcome to your interactive science presentation! Today we are exploring the invisible, non-contact pull that governs our universe: <strong>Gravity</strong>.
      </p>
    `,
    teacherNotes: `
      <h3>Pedagogical Context</h3>
      <p>This lesson aligns directly with Content Descriptor <strong>AC9S7U04</strong> from Australian Curriculum v9.</p>
      <ul>
        <li><strong>Goal</strong>: Investigate and represent balanced and unbalanced forces, including gravity.</li>
        <li><strong>Hook</strong>: Ask students why objects fall to the ground when dropped, and how we define weight vs. mass.</li>
      </ul>
    `
  },
  {
    title: "What is Gravity?",
    theme: "light",
    standardHtml: `
      <p>Gravity is a <strong>non-contact, attractive force</strong> that pulls objects toward one another. Every object in the universe that has mass has its own gravitational pull.</p>
      <div style="display: flex; gap: 40px; margin-top: 30px; align-items: center; justify-content: center;">
        <div style="flex: 1; background: var(--pure-white); border: 2px dashed var(--orange); border-radius: 8px; padding: 20px; box-shadow: var(--shadow-sm);">
          <h4 style="color: var(--navy); margin-bottom: 10px; font-size: 20px;">Mass Rules Gravity:</h4>
          <ul style="margin-left: 20px; font-size: 18px; line-height: 1.5;">
            <li>The <strong>greater</strong> the mass of an object, the stronger its gravitational pull.</li>
            <li>The <strong>closer</strong> two objects are, the stronger the pull between them.</li>
          </ul>
        </div>
        <div style="flex: 1; font-size: 18px; line-height: 1.6;">
          <p>For example, because the Earth has an immense mass, its gravity pulling us toward its centre is what keeps our feet firmly on the ground, controls the oceans' tides, and maintains the Moon's orbit!</p>
        </div>
      </div>
    `,
    lucasHtml: `
      <p>Gravity is an <strong>invisible pull</strong>. It is a force that pulls objects toward each other.</p>
      <div style="background: #eef2f6; border-radius: 8px; padding: 20px; margin-top: 25px; box-shadow: var(--shadow-sm);">
        <h4 style="color: var(--orange); margin-bottom: 10px;">Three Easy Facts about Gravity:</h4>
        <ul style="margin-left: 25px; font-size: 19px; line-height: 1.6;">
          <li><strong>Mass (Stuff)</strong>: Heavy things pull much harder than light things.</li>
          <li><strong>The Earth</strong>: Because the Earth is huge, it pulls us down so we do not float away!</li>
          <li><strong>Orbits</strong>: Earth's gravity holds the Moon in orbit.</li>
        </ul>
      </div>
    `,
    teacherNotes: `
      <h3>Key Teaching Points</h3>
      <p>Clarify that gravity is an attractive field force that operates without physical contact. Emphasise that weight is a force, while mass is a measure of physical matter.</p>
      <p>For support pathway (Lucas), focus heavily on the visual concept of gravity acting like an "invisible magnet" pulling things downward.</p>
    `
  },
  {
    title: "Weight vs. Mass (The Mathematics)",
    theme: "light",
    standardHtml: `
      <p>In everyday speech, people use "weight" and "mass" to mean the same thing. In physics, however, they are entirely different quantities!</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 18px; box-shadow: var(--shadow-sm);">
        <thead>
          <tr style="background-color: var(--navy); color: var(--white);">
            <th style="padding: 12px; border: 1px solid #cbd5e1; text-align: left; width: 50%;">Mass (m)</th>
            <th style="padding: 12px; border: 1px solid #cbd5e1; text-align: left; width: 50%;">Weight (W)</th>
          </tr>
        </thead>
        <tbody>
          <tr style="background-color: var(--pure-white);">
            <td style="padding: 12px; border: 1px solid #cbd5e1;">The amount of matter inside an object.</td>
            <td style="padding: 12px; border: 1px solid #cbd5e1;">The force of gravity acting on that mass.</td>
          </tr>
          <tr style="background-color: var(--soft-grey);">
            <td style="padding: 12px; border: 1px solid #cbd5e1;">Measured in <strong>kilograms (kg)</strong>.</td>
            <td style="padding: 12px; border: 1px solid #cbd5e1;">Measured in <strong>Newtons (N)</strong>.</td>
          </tr>
          <tr style="background-color: var(--pure-white);">
            <td style="padding: 12px; border: 1px solid #cbd5e1;"><strong>Never changes</strong>, regardless of your location.</td>
            <td style="padding: 12px; border: 1px solid #cbd5e1;"><strong>Changes</strong> depending on local gravitational field strength.</td>
          </tr>
        </tbody>
      </table>
      <div style="margin-top: 25px; background: #fff7ed; border-left: 5px solid var(--orange); padding: 15px; border-radius: 4px;">
        <h4 style="color: var(--navy); margin-bottom: 5px;">Calculating Weight:</h4>
        <p style="font-size: 20px; font-family: monospace;">Weight (W) = Mass (m) &times; Gravitational Strength (g)</p>
        <p style="margin-top: 5px; font-size: 16px; color: #555;">On Earth, gravity ($g$) is roughly <strong>$9.8\\text{ m/s}^2$</strong> (or $9.8\\text{ N/kg}$). On the Moon, it is only <strong>$1.6\\text{ m/s}^2$</strong>.</p>
      </div>
    `,
    lucasHtml: `
      <p>What is the difference between Weight and Mass?</p>
      <div style="display: flex; gap: 20px; margin-top: 20px;">
        <div style="flex: 1; background: #eff6ff; border: 2px solid #bfdbfe; border-radius: 8px; padding: 20px;">
          <h4 style="color: var(--blue); margin-bottom: 10px;">Mass:</h4>
          <p style="font-size: 18px;">How much "stuff" you are made of. This is measured in <strong>kilograms (kg)</strong>. It is the same everywhere!</p>
        </div>
        <div style="flex: 1; background: #fff7ed; border: 2px solid #fed7aa; border-radius: 8px; padding: 20px;">
          <h4 style="color: var(--orange); margin-bottom: 10px;">Weight:</h4>
          <p style="font-size: 18px;">How hard gravity pulls down on you. This is measured in <strong>Newtons (N)</strong>. Your weight changes on different planets!</p>
        </div>
      </div>
      <p style="margin-top: 25px; text-align: center; font-size: 20px;">
        <em>On the Moon, you weigh much less because the Moon is smaller and pulls with less force!</em>
      </p>
    `,
    teacherNotes: `
      <h3>Mathematical Exercises</h3>
      <p>Have students practice the formula $W = m \\times g$ using Earth gravity ($g \\approx 10$) and Moon gravity ($g \\approx 1.6$).</p>
      <ul>
        <li><strong>Example 1</strong>: A 50 kg student has a mass of 50 kg. Their weight on Earth is: $50 \\times 10 = 500\\text{ Newtons (N)}$.</li>
        <li><strong>Example 2</strong>: The same student travels to the Moon. Mass remains 50 kg, but weight is now: $50 \\times 1.6 = 80\\text{ Newtons (N)}$.</li>
      </ul>
    `
  },
  {
    title: "Interactive Gravity Simulator",
    theme: "light",
    standardHtml: `
      <p style="font-size: 20px; margin-bottom: 15px;">Observe gravitational acceleration and air resistance in real-time. Drop a <strong>10 kg red bowling ball</strong> and a <strong>1 kg blue ball</strong> simultaneously.</p>
      
      <div class="gravity-sim-container" style="display: flex; gap: 25px; border: 1px solid #cbd5e1; border-radius: 8px; padding: 15px; background: #f8fafc; box-shadow: var(--shadow-sm); z-index: 10; position: relative;">
        <!-- Simulation controls -->
        <div class="sim-controls" style="flex: 1; display: flex; flex-direction: column; gap: 15px; font-size: 16px;">
          <div>
            <label style="font-weight: 600; display: block; margin-bottom: 5px;">1. Select Environment:</label>
            <select id="simPlanet" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #cbd5e1; background: white; font-size: 15px; font-family: inherit;">
              <option value="9.8">Earth (g = 9.8 m/s²)</option>
              <option value="1.6">Moon (g = 1.6 m/s²)</option>
              <option value="24.8">Jupiter (g = 24.8 m/s²)</option>
              <option value="0">Zero-G Space (g = 0 m/s²)</option>
            </select>
          </div>
          
          <div>
            <label style="font-weight: 600; display: block; margin-bottom: 5px;">2. Atmosphere:</label>
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                <input type="radio" name="atmosphere" value="air" checked style="cursor: pointer;"> Air Resistance (Drag)
              </label>
              <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                <input type="radio" name="atmosphere" value="vacuum" style="cursor: pointer;"> Vacuum (No Air)
              </label>
            </div>
          </div>
          
          <div style="border-top: 1px solid #e2e8f0; padding-top: 10px; font-size: 14px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 5px;">
              <span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background: #ff4d4d;"></span>
              <strong>Red Ball (Heavy):</strong> 10 kg
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background: #3b82f6;"></span>
              <strong>Blue Ball (Light):</strong> 1 kg
            </div>
          </div>
          
          <div style="margin-top: auto; display: flex; gap: 10px;">
            <button id="btnSimDrop" style="flex: 1; padding: 10px; background: var(--orange); color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 14px; transition: background 0.2s;">Drop Objects</button>
            <button id="btnSimReset" style="flex: 1; padding: 10px; background: var(--navy); color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 14px; transition: background 0.2s;">Reset</button>
          </div>
        </div>
        
        <!-- Canvas Display -->
        <div style="flex: 2; height: 320px; position: relative; border: 1px solid #cbd5e1; border-radius: 6px; background: #0f172a; overflow: hidden; display: flex;">
          <canvas id="gravitySimCanvas" width="420" height="320" style="display: block; width: 100%; height: 100%;"></canvas>
          
          <!-- Live Readings Overlay -->
          <div style="position: absolute; top: 12px; left: 12px; color: white; font-family: monospace; font-size: 11px; background: rgba(15, 23, 42, 0.85); border: 1px solid rgba(255,255,255,0.15); padding: 8px 12px; border-radius: 6px; pointer-events: none; line-height: 1.4; box-shadow: var(--shadow-md);">
            <div>Elapsed Time: <span id="lblSimTime">0.00</span> s</div>
            <div style="border-bottom: 1px solid rgba(255,255,255,0.25); margin: 6px 0;"></div>
            <div style="color: #ff8080;">Red V: <span id="lblRedV">0.0</span> m/s</div>
            <div style="color: #ff8080;">Red Weight: <span id="lblRedW">98.0</span> N</div>
            <div style="border-bottom: 1px solid rgba(255,255,255,0.15); margin: 6px 0;"></div>
            <div style="color: #80b3ff;">Blue V: <span id="lblBlueV">0.0</span> m/s</div>
            <div style="color: #80b3ff;">Blue Weight: <span id="lblBlueW">9.8</span> N</div>
          </div>
        </div>
      </div>
      
      <script>
      (function() {
        const canvas = document.getElementById('gravitySimCanvas');
        const ctx = canvas.getContext('2d');
        const simPlanet = document.getElementById('simPlanet');
        const btnDrop = document.getElementById('btnSimDrop');
        const btnReset = document.getElementById('btnSimReset');
        const lblTime = document.getElementById('lblSimTime');
        const lblRedV = document.getElementById('lblRedV');
        const lblRedW = document.getElementById('lblRedW');
        const lblBlueV = document.getElementById('lblBlueV');
        const lblBlueW = document.getElementById('lblBlueW');
        
        let g = 9.8;
        let hasAir = true;
        let isFalling = false;
        let simTime = 0;
        
        // Physics constants
        const startY = 30;
        const groundY = 280;
        const scale = 50; // pixels per metre
        
        let redObj = { y: startY, v: 0, mass: 10, radius: 18, color: '#ff4d4d', drag: 0.12 };
        let blueObj = { y: startY, v: 0, mass: 1, radius: 11, color: '#3b82f6', drag: 0.28 };
        
        let animationId = null;
        let lastTime = 0;
        
        function updateReadings() {
          lblTime.innerText = simTime.toFixed(2);
          lblRedV.innerText = redObj.v.toFixed(1);
          lblRedW.innerText = (redObj.mass * g).toFixed(1);
          lblBlueV.innerText = blueObj.v.toFixed(1);
          lblBlueW.innerText = (blueObj.mass * g).toFixed(1);
        }
        
        function draw() {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Draw sky/background
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Draw horizontal metric markers (metres)
          ctx.strokeStyle = 'rgba(255,255,255,0.06)';
          ctx.lineWidth = 1;
          for (let y = startY; y < groundY; y += scale) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
          }
          
          // Draw ground
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);
          ctx.fillStyle = '#475569';
          ctx.fillRect(0, groundY, canvas.width, 2);
          
          // Draw Red object
          ctx.beginPath();
          ctx.arc(130, redObj.y, redObj.radius, 0, Math.PI * 2);
          ctx.fillStyle = redObj.color;
          ctx.shadowBlur = 12;
          ctx.shadowColor = redObj.color;
          ctx.fill();
          ctx.shadowBlur = 0;
          
          // Draw Blue object
          ctx.beginPath();
          ctx.arc(290, blueObj.y, blueObj.radius, 0, Math.PI * 2);
          ctx.fillStyle = blueObj.color;
          ctx.shadowBlur = 12;
          ctx.shadowColor = blueObj.color;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
        
        function loop(timestamp) {
          if (!lastTime) lastTime = timestamp;
          let dt = (timestamp - lastTime) / 1000;
          if (dt > 0.1) dt = 0.1; // Limit stutter skips
          lastTime = timestamp;
          
          if (isFalling) {
            simTime += dt;
            g = parseFloat(simPlanet.value);
            const airRadio = document.querySelector('input[name="atmosphere"]:checked');
            hasAir = airRadio && airRadio.value === 'air';
            
            [redObj, blueObj].forEach(obj => {
              if (obj.y < groundY - obj.radius) {
                // Weight Force: F_gravity = m * g
                const forceGravity = obj.mass * g;
                
                // Drag Force: F_drag = drag_coeff * v
                const forceDrag = hasAir ? obj.drag * obj.v : 0;
                
                // Net Force: F_net = F_gravity - F_drag
                const forceNet = forceGravity - forceDrag;
                
                // Acceleration: a = F_net / m
                const acceleration = forceNet / obj.mass;
                
                obj.v += acceleration * dt;
                obj.y += obj.v * scale * dt;
                
                if (obj.y >= groundY - obj.radius) {
                  obj.y = groundY - obj.radius;
                  obj.v = 0;
                }
              }
            });
            
            updateReadings();
          }
          
          draw();
          animationId = requestAnimationFrame(loop);
        }
        
        btnDrop.addEventListener('click', () => {
          isFalling = true;
          lastTime = 0;
        });
        
        btnReset.addEventListener('click', () => {
          isFalling = false;
          simTime = 0;
          redObj.y = startY;
          redObj.v = 0;
          blueObj.y = startY;
          blueObj.v = 0;
          updateReadings();
        });
        
        simPlanet.addEventListener('change', () => {
          g = parseFloat(simPlanet.value);
          updateReadings();
        });
        
        animationId = requestAnimationFrame(loop);
        updateReadings();
      })();
      </script>
    `,
    lucasHtml: `
      <p style="font-size: 19px; margin-bottom: 12px;">Watch gravity pull the objects down! Drop the <strong>heavy red ball</strong> and the <strong>light blue ball</strong>.</p>
      
      <div class="gravity-sim-container" style="display: flex; gap: 20px; border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px; background: #f8fafc;">
        <!-- Simple Controls -->
        <div style="flex: 1; display: flex; flex-direction: column; gap: 10px; font-size: 15px;">
          <div>
            <strong>1. Select Planet:</strong>
            <select id="simPlanetL" style="width:100%; padding:6px; margin-top:4px; border: 1px solid #ccc; border-radius: 4px;">
              <option value="9.8">Earth (Normal pull)</option>
              <option value="1.6">Moon (Very weak pull)</option>
              <option value="24.8">Jupiter (Extremely strong pull)</option>
            </select>
          </div>
          
          <div>
            <strong>2. Choose Air Style:</strong>
            <div style="margin-top:4px;">
              <label><input type="radio" name="atmosphereL" value="air" checked> Air (Standard)</label><br>
              <label><input type="radio" name="atmosphereL" value="vacuum"> Vacuum (Space - No Air)</label>
            </div>
          </div>
          
          <div style="margin-top: auto; display: flex; gap: 8px;">
            <button id="btnSimDropL" style="flex: 1; padding: 8px; background: var(--orange); color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">Drop</button>
            <button id="btnSimResetL" style="flex: 1; padding: 8px; background: var(--navy); color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">Reset</button>
          </div>
        </div>
        
        <!-- Simulation Area -->
        <div style="flex: 2; height: 260px; position: relative; border: 1px solid #ccc; border-radius: 6px; background: #0f172a; overflow: hidden;">
          <canvas id="gravitySimCanvasL" width="400" height="260" style="display: block; width: 100%; height: 100%;"></canvas>
        </div>
      </div>
      
      <script>
      (function() {
        const canvas = document.getElementById('gravitySimCanvasL');
        const ctx = canvas.getContext('2d');
        const simPlanet = document.getElementById('simPlanetL');
        const btnDrop = document.getElementById('btnSimDropL');
        const btnReset = document.getElementById('btnSimResetL');
        
        let g = 9.8;
        let hasAir = true;
        let isFalling = false;
        
        const startY = 20;
        const groundY = 225;
        const scale = 40;
        
        let redObj = { y: startY, v: 0, mass: 10, radius: 15, color: '#ff4d4d', drag: 0.12 };
        let blueObj = { y: startY, v: 0, mass: 1, radius: 10, color: '#3b82f6', drag: 0.28 };
        
        let lastTime = 0;
        
        function draw() {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);
          ctx.fillStyle = '#475569';
          ctx.fillRect(0, groundY, canvas.width, 2);
          
          // Red
          ctx.beginPath();
          ctx.arc(120, redObj.y, redObj.radius, 0, Math.PI * 2);
          ctx.fillStyle = redObj.color;
          ctx.fill();
          
          // Blue
          ctx.beginPath();
          ctx.arc(280, blueObj.y, blueObj.radius, 0, Math.PI * 2);
          ctx.fillStyle = blueObj.color;
          ctx.fill();
        }
        
        function loop(timestamp) {
          if (!lastTime) lastTime = timestamp;
          let dt = (timestamp - lastTime) / 1000;
          if (dt > 0.1) dt = 0.1;
          lastTime = timestamp;
          
          if (isFalling) {
            g = parseFloat(simPlanet.value);
            const airRadio = document.querySelector('input[name="atmosphereL"]:checked');
            hasAir = airRadio && airRadio.value === 'air';
            
            [redObj, blueObj].forEach(obj => {
              if (obj.y < groundY - obj.radius) {
                const forceGravity = obj.mass * g;
                const forceDrag = hasAir ? obj.drag * obj.v : 0;
                const forceNet = forceGravity - forceDrag;
                const acceleration = forceNet / obj.mass;
                
                obj.v += acceleration * dt;
                obj.y += obj.v * scale * dt;
                
                if (obj.y >= groundY - obj.radius) {
                  obj.y = groundY - obj.radius;
                  obj.v = 0;
                }
              }
            });
          }
          
          draw();
          requestAnimationFrame(loop);
        }
        
        btnDrop.addEventListener('click', () => {
          isFalling = true;
          lastTime = 0;
        });
        
        btnReset.addEventListener('click', () => {
          isFalling = false;
          redObj.y = startY;
          redObj.v = 0;
          blueObj.y = startY;
          blueObj.v = 0;
        });
        
        requestAnimationFrame(loop);
      })();
      </script>
    `,
    teacherNotes: `
      <h3>How to Run the Simulation</h3>
      <p>Demonstrate the simulation in both modes to the class:</p>
      <ol>
        <li><strong>Earth + Air</strong>: The Red ball will hit the ground slightly faster due to higher mass overcoming air resistance (unbalanced force vs drag).</li>
        <li><strong>Earth + Vacuum</strong>: Watch the balls land at <strong>precisely the same moment</strong>. Explain Galileo's equivalence principle.</li>
        <li><strong>Moon vs. Jupiter</strong>: Switch planets to see how weak Moon gravity creates low, slow drops while Jupiter drops are lightning-fast.</li>
      </ol>
    `
  },
  {
    title: "Check Your Understanding",
    theme: "light",
    standardHtml: `
      <p style="font-size: 22px; margin-bottom: 20px;">Use your lesson notes and calculations to answer the following questions:</p>
      <div style="display: flex; flex-direction: column; gap: 15px; font-size: 18px;">
        <div style="background: var(--pure-white); border: 1px solid #cbd5e1; border-radius: 6px; padding: 15px;">
          <strong>Question 1:</strong> An astronaut travels to Mars, where gravity is roughly $3.7\\text{ m/s}^2$. 
          If their mass is $75\\text{ kg}$, does their mass change on Mars? Calculate their weight on Mars.
        </div>
        <div style="background: var(--pure-white); border: 1px solid #cbd5e1; border-radius: 6px; padding: 15px;">
          <strong>Question 2:</strong> Explain why a feather and a hammer dropped on Earth land at different times, but fell at the exact same rate when dropped by astronauts on the Moon during the Apollo 15 mission.
        </div>
        <div style="background: var(--pure-white); border: 1px solid #cbd5e1; border-radius: 6px; padding: 15px;">
          <strong>Question 3:</strong> Draw a free-body force diagram showing an object reaching its terminal velocity in air. Label the forces as balanced or unbalanced.
        </div>
      </div>
    `,
    lucasHtml: `
      <p style="font-size: 20px; margin-bottom: 15px;">Try these check-in questions:</p>
      <div style="display: flex; flex-direction: column; gap: 12px; font-size: 18px;">
        <div style="background: #eef2f6; border-radius: 6px; padding: 12px; border-left: 4px solid var(--blue);">
          <strong>Question 1:</strong> If you fly to the Moon, does the amount of matter in your body (your mass) change? Yes or No?
        </div>
        <div style="background: #eef2f6; border-radius: 6px; padding: 12px; border-left: 4px solid var(--orange);">
          <strong>Question 2:</strong> In a room with no air (vacuum), which object lands first when dropped: a feather or a hammer?
        </div>
      </div>
    `,
    teacherNotes: `
      <h3>Quiz Review and Solutions</h3>
      <ul>
        <li><strong>A1</strong>: Mass does <strong>not</strong> change (still 75 kg). Weight on Mars: $75 \\times 3.7 = 277.5\\text{ Newtons (N)}$.</li>
        <li><strong>A2</strong>: On Earth, air resistance slows down the feather (balanced forces quickly). On the Moon, there is no atmosphere (vacuum), so both accelerate under gravity equally and land together.</li>
        <li><strong>A3</strong>: The free-body diagram should show equal arrows: Gravity pulling down, and Air Resistance pushing up. Since forces are balanced, there is no change in motion (constant terminal velocity).</li>
      </ul>
    `
  }
];

// Mock Handout and Lesson metadata for DOCX handout compiler
const lessonMetadata = {
  lessonTitle: "Forces and Gravity: Year 7 Science",
  units: "Unit 2 Physics: Forces in Action",
  // additional structures
};

async function main() {
  const outputDir = path.join(__dirname);
  const presentationPath = path.join(outputDir, 'Lesson_Gravity_Presentation.html');
  const handoutPath = path.join(outputDir, 'Lesson_Gravity_Handout.docx');
  
  console.log(`Compiling sample Gravity lesson files into: ${outputDir}`);
  
  try {
    // 1. Compile Presentation
    await generateHTMLPresentation(presentationPath, slidesData);
    
    // 2. Generate accompanying handout (satisfying standard teacher requirements)
    await generateHandout(handoutPath, lessonMetadata);
    
    console.log("Success! Gravity Lesson resources created and saved successfully.");
  } catch (error) {
    console.error("❌ Compile error occurred:", error);
  }
}

main();
