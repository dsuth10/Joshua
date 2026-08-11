const fs = require('fs');
const path = require('path');

const templatePath = path.resolve(__dirname, '../../../../../../.agent/skills/lesson-creator/assets/presentation_template.html');
const outputPath = path.join(__dirname, '../Lesson_CAMERA_Prompting_Presentation.html');

console.log('Reading template from:', templatePath);
let templateHtml = fs.readFileSync(templatePath, 'utf8');

const slidesHtml = `
    <!-- SLIDE 1: Title Slide (Dark Theme) -->
    <div class="slide theme-dark" id="slide-1">
      <div style="max-width: 900px; margin: 0 auto; text-align: center;">
        <div style="font-size: 80px; margin-bottom: 20px;">🎬</div>
        <h1 style="font-size: 64px; color: var(--orange); text-transform: uppercase; letter-spacing: 3px; font-weight: 700; font-family: 'Outfit', sans-serif; margin-bottom: 15px;">CAMERA</h1>
        <h3 style="font-size: 32px; color: var(--white); font-weight: 400; margin-bottom: 30px;">AI Video Prompt Builder</h3>
        <p style="font-size: 22px; color: var(--text-light); background: rgba(255,255,255,0.08); padding: 18px 30px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.15); display: inline-block;">
          <strong>Plan one clear shot. Direct one strong AI video prompt.</strong>
        </p>
      </div>
      <div class="teacher-notes">
        <h3>Teacher Notes & Logistics</h3>
        <p><strong>DO:</strong> Project this title slide as students take their seats. Ensure laptops/tablets are open with <code>index.html</code> ready.</p>
        <p><strong>WORK:</strong> Welcome students to their AI video directing session. Explain that today they learn how professional directors communicate with AI tools.</p>
        <p><strong>RECORD:</strong> Students prepare to explore the 6 stages of the CAMERA prompting method.</p>
        <p><strong>FINISH:</strong> Transition to Slide 2 to contrast vague vs. directed prompts.</p>
      </div>
    </div>

    <!-- SLIDE 2: Why Prompt Structure Matters -->
    <div class="slide theme-light" id="slide-2">
      <h2 class="slide-title">Why Prompt Structure Matters</h2>
      <div class="content">
        <p style="font-size: 20px; margin-bottom: 25px; color: var(--navy);">
          AI video models don't guess what's in your imagination — you must direct the camera!
        </p>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-top: 15px;">
          <!-- Vague Card -->
          <div style="background: #ffebee; border: 2px solid var(--red-error); border-radius: 12px; padding: 25px; box-shadow: var(--shadow-md);">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
              <span style="font-size: 28px;">❌</span>
              <h3 style="font-size: 24px; color: var(--red-error);">Vague Prompt</h3>
            </div>
            <div style="background: #ffffff; padding: 15px; border-radius: 8px; font-family: monospace; font-size: 16px; border: 1px solid #ffcdd2; margin-bottom: 15px;">
              "a tiger running in a forest looking cool"
            </div>
            <ul style="font-size: 16px; color: #b71c1c; line-height: 1.6; padding-left: 20px;">
              <li>Unpredictable framing and camera movement.</li>
              <li>AI invents random art styles and lighting.</li>
              <li>Character detail changes or warps midway.</li>
              <li>Wastes generation time and credits.</li>
            </ul>
          </div>

          <!-- Structured Card -->
          <div style="background: #e8f5e9; border: 2px solid var(--green-success); border-radius: 12px; padding: 25px; box-shadow: var(--shadow-md);">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
              <span style="font-size: 28px;">✅</span>
              <h3 style="font-size: 24px; color: var(--green-success);">Structured CAMERA Prompt</h3>
            </div>
            <div style="background: #ffffff; padding: 15px; border-radius: 8px; font-family: monospace; font-size: 15px; border: 1px solid #c8e6c9; margin-bottom: 15px;">
              "Medium eye-level tracking shot of a ten-year-old explorer in a yellow raincoat... [Tracking shot] Stylised 3D animation..."
            </div>
            <ul style="font-size: 16px; color: #1b5e20; line-height: 1.6; padding-left: 20px;">
              <li>Clear camera framing & smooth subject tracking.</li>
              <li>Specific actor appearance and clothing locked.</li>
              <li>Visible physical movement described step-by-step.</li>
              <li>Consistent visual style and atmosphere.</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="teacher-notes">
        <h3>Teacher Notes & CFU</h3>
        <p><strong>DO:</strong> Highlight the contrast between guessing and directing. Ask students if they've ever had an AI image/video turn out weird because of vague words.</p>
        <p><strong>WORK:</strong> Read both sample prompts out loud. Ask students to spot what extra details the CAMERA prompt gives the computer.</p>
        <p><strong>CHECK:</strong> Why does "looking cool" fail as a prompt instruction? (Because it's an opinion, not a physical thing the camera can see!).</p>
      </div>
    </div>

    <!-- SLIDE 3: C - CAMERA -->
    <div class="slide theme-light" id="slide-3">
      <h2 class="slide-title">C — CAMERA: Framing & Movement</h2>
      <div class="content">
        <p style="font-size: 18px; margin-bottom: 20px; color: var(--navy);">
          Decide how the audience sees your shot. Control shot size, camera angle, and camera motion.
        </p>

        <!-- Shot Size Grid with Inline Diagrams -->
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 20px;">
          <!-- Card 1 -->
          <div style="border: 2px solid var(--blue); border-radius: 10px; padding: 12px; background: #ffffff; text-align: center;">
            <svg width="60" height="45" viewBox="0 0 100 75" style="margin-bottom: 8px;">
              <rect x="5" y="5" width="90" height="65" fill="none" stroke="#112d4e" stroke-width="3" stroke-dasharray="4,4"/>
              <circle cx="50" cy="38" r="22" fill="#f96d00"/>
              <circle cx="42" cy="34" r="4" fill="#ffffff"/>
              <circle cx="58" cy="34" r="4" fill="#ffffff"/>
            </svg>
            <div style="font-weight: 700; font-size: 15px; color: var(--navy);">Extreme Close-Up</div>
            <div style="font-size: 12px; color: #555; margin-top: 4px;">Tiny details (eyes, hands)</div>
          </div>

          <!-- Card 2 -->
          <div style="border: 2px solid var(--blue); border-radius: 10px; padding: 12px; background: #ffffff; text-align: center;">
            <svg width="60" height="45" viewBox="0 0 100 75" style="margin-bottom: 8px;">
              <rect x="5" y="5" width="90" height="65" fill="none" stroke="#112d4e" stroke-width="3"/>
              <circle cx="50" cy="28" r="16" fill="#3f72af"/>
              <path d="M 30 65 Q 50 48 70 65 Z" fill="#3f72af"/>
            </svg>
            <div style="font-weight: 700; font-size: 15px; color: var(--navy);">Close-Up</div>
            <div style="font-size: 12px; color: #555; margin-top: 4px;">Face & expressions</div>
          </div>

          <!-- Card 3 -->
          <div style="border: 2px solid var(--orange); border-radius: 10px; padding: 12px; background: #fff3e0; text-align: center;">
            <svg width="60" height="45" viewBox="0 0 100 75" style="margin-bottom: 8px;">
              <rect x="5" y="5" width="90" height="65" fill="none" stroke="#f96d00" stroke-width="3"/>
              <circle cx="50" cy="22" r="12" fill="#f96d00"/>
              <path d="M 32 70 Q 50 38 68 70 Z" fill="#f96d00"/>
            </svg>
            <div style="font-weight: 700; font-size: 15px; color: var(--orange);">Medium Shot</div>
            <div style="font-size: 12px; color: #555; margin-top: 4px;">Waist up (action & dialogue)</div>
          </div>

          <!-- Card 4 -->
          <div style="border: 2px solid var(--blue); border-radius: 10px; padding: 12px; background: #ffffff; text-align: center;">
            <svg width="60" height="45" viewBox="0 0 100 75" style="margin-bottom: 8px;">
              <rect x="5" y="5" width="90" height="65" fill="none" stroke="#112d4e" stroke-width="3"/>
              <circle cx="50" cy="30" r="6" fill="#112d4e"/>
              <line x1="50" y1="36" x2="50" y2="54" stroke="#112d4e" stroke-width="3"/>
              <path d="M 15 65 Q 50 55 85 65" fill="none" stroke="#2e7d32" stroke-width="3"/>
            </svg>
            <div style="font-weight: 700; font-size: 15px; color: var(--navy);">Wide Shot</div>
            <div style="font-size: 12px; color: #555; margin-top: 4px;">Whole body & location</div>
          </div>
        </div>

        <!-- Camera Angles & Movements list -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; background: var(--soft-grey); padding: 18px; border-radius: 10px;">
          <div>
            <h4 style="color: var(--navy); font-size: 18px; margin-bottom: 8px;">Camera Angles</h4>
            <ul style="font-size: 14px; line-height: 1.5; color: #333; padding-left: 18px;">
              <li><strong>Eye Level:</strong> Natural & neutral perspective.</li>
              <li><strong>Low Angle:</strong> Camera looks UP (powerful/heroic).</li>
              <li><strong>High Angle:</strong> Camera looks DOWN (small/vulnerable).</li>
              <li><strong>Dutch Angle:</strong> Tilted horizon (tense/unstable).</li>
            </ul>
          </div>
          <div>
            <h4 style="color: var(--navy); font-size: 18px; margin-bottom: 8px;">Camera Movements</h4>
            <ul style="font-size: 14px; line-height: 1.5; color: #333; padding-left: 18px;">
              <li><strong>Static:</strong> Fixed tripod (no movement).</li>
              <li><strong>Tracking Shot:</strong> Camera moves WITH subject.</li>
              <li><strong>Push In / Pull Out:</strong> Move towards or away.</li>
              <li><strong>Pan / Tilt:</strong> Swivel horizontally or vertically.</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="teacher-notes">
        <h3>Teacher Notes</h3>
        <p><strong>DO:</strong> Point out the SVG framing diagrams. Explain how choosing shot sizes sets the stage.</p>
        <p><strong>WORK:</strong> Ask students which shot size they'd use if they want to show a character's terrified facial expression vs. showing a character exploring a vast jungle.</p>
      </div>
    </div>

    <!-- SLIDE 4: A - ACTOR -->
    <div class="slide theme-light" id="slide-4">
      <h2 class="slide-title">A — ACTOR: Subject & Character Detail</h2>
      <div class="content">
        <p style="font-size: 18px; margin-bottom: 20px; color: var(--navy);">
          Decide who or what the camera is watching. Specific details prevent AI character morphing!
        </p>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px;">
          <!-- Left: Actor Form Breakdown -->
          <div style="background: #ffffff; border: 2px solid var(--blue); border-radius: 12px; padding: 20px; box-shadow: var(--shadow-sm);">
            <h4 style="color: var(--navy); font-size: 20px; margin-bottom: 12px;">Guided Character Fields</h4>
            
            <div style="margin-bottom: 10px;">
              <span style="font-size: 13px; font-weight: bold; color: var(--orange);">SUBJECT TYPE & COUNT:</span>
              <div style="font-size: 15px; color: #333;">Person · One subject (Best for AI focus)</div>
            </div>
            
            <div style="margin-bottom: 10px;">
              <span style="font-size: 13px; font-weight: bold; color: var(--orange);">AGE / TYPE:</span>
              <div style="font-size: 15px; color: #333; font-family: monospace; background: var(--soft-grey); padding: 4px 8px; border-radius: 4px;">ten-year-old explorer</div>
            </div>

            <div style="margin-bottom: 10px;">
              <span style="font-size: 13px; font-weight: bold; color: var(--orange);">HAIR & APPEARANCE:</span>
              <div style="font-size: 15px; color: #333; font-family: monospace; background: var(--soft-grey); padding: 4px 8px; border-radius: 4px;">curly black hair</div>
            </div>

            <div style="margin-bottom: 10px;">
              <span style="font-size: 13px; font-weight: bold; color: var(--orange);">CLOTHING & COLOURS:</span>
              <div style="font-size: 15px; color: #333; font-family: monospace; background: var(--soft-grey); padding: 4px 8px; border-radius: 4px;">yellow raincoat and small red backpack</div>
            </div>

            <div>
              <span style="font-size: 13px; font-weight: bold; color: var(--orange);">DISTINCTIVE FEATURE:</span>
              <div style="font-size: 15px; color: #333; font-family: monospace; background: var(--soft-grey); padding: 4px 8px; border-radius: 4px;">round red glasses</div>
            </div>
          </div>

          <!-- Right: Assembled Actor Sentence & Emotion Rule -->
          <div style="display: flex; flex-direction: column; gap: 20px;">
            <div style="background: #e3f2fd; border-left: 5px solid var(--blue); padding: 18px; border-radius: 8px;">
              <h4 style="color: var(--navy); font-size: 18px; margin-bottom: 8px;">Assembled Actor Description</h4>
              <p style="font-size: 16px; font-style: italic; color: #0d47a1; line-height: 1.5;">
                "a ten-year-old explorer with curly black hair, wearing a yellow raincoat, a small red backpack, and round red glasses"
              </p>
            </div>

            <div style="background: #fff8e1; border-left: 5px solid #ffa000; padding: 18px; border-radius: 8px;">
              <h4 style="color: #b56c00; font-size: 18px; margin-bottom: 8px;">💡 The Emotion Golden Rule</h4>
              <p style="font-size: 15px; color: #424242; line-height: 1.5;">
                Don't just pick an emotion word like <em>"nervous"</em>. Translate it into <strong>visible behaviour</strong> for the camera (e.g. <em>"glances around cautiously while clutching her backpack straps"</em>).
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="teacher-notes">
        <h3>Teacher Notes & Tip</h3>
        <p><strong>DO:</strong> Emphasise why clothing colours matter (e.g. yellow raincoat, red backpack). Bright colours help the AI track the character across frames.</p>
        <p><strong>CHECK:</strong> Why do we encourage selecting ONE subject for beginner shots? (Multiple subjects often bleed features or morph into each other).</p>
      </div>
    </div>

    <!-- SLIDE 5: M - MOVEMENT -->
    <div class="slide theme-light" id="slide-5">
      <h2 class="slide-title">M — MOVEMENT: Visible Physical Action</h2>
      <div class="content">
        <p style="font-size: 18px; margin-bottom: 20px; color: var(--navy);">
          Tell the AI exactly what happens during the shot. Rule: Describe something the camera can see!
        </p>

        <!-- Movement Options Builder Grid -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 25px;">
          <!-- Action Verbs -->
          <div style="background: var(--soft-grey); padding: 15px; border-radius: 10px;">
            <h4 style="color: var(--navy); font-size: 16px; margin-bottom: 10px;">1. Main Action Verb</h4>
            <div style="display: flex; flex-wrap: wrap; gap: 6px;">
              <span style="background: var(--orange); color: white; padding: 4px 10px; border-radius: 15px; font-size: 13px; font-weight: bold;">walks</span>
              <span style="background: white; color: #333; padding: 4px 10px; border-radius: 15px; font-size: 13px;">runs</span>
              <span style="background: white; color: #333; padding: 4px 10px; border-radius: 15px; font-size: 13px;">turns</span>
              <span style="background: white; color: #333; padding: 4px 10px; border-radius: 15px; font-size: 13px;">reaches</span>
              <span style="background: white; color: #333; padding: 4px 10px; border-radius: 15px; font-size: 13px;">picks up</span>
            </div>
          </div>

          <!-- Direction & Speed -->
          <div style="background: var(--soft-grey); padding: 15px; border-radius: 10px;">
            <h4 style="color: var(--navy); font-size: 16px; margin-bottom: 10px;">2. Direction & Speed</h4>
            <div style="display: flex; flex-wrap: wrap; gap: 6px;">
              <span style="background: var(--orange); color: white; padding: 4px 10px; border-radius: 15px; font-size: 13px; font-weight: bold;">left to right</span>
              <span style="background: var(--orange); color: white; padding: 4px 10px; border-radius: 15px; font-size: 13px; font-weight: bold;">slowly</span>
              <span style="background: white; color: #333; padding: 4px 10px; border-radius: 15px; font-size: 13px;">towards camera</span>
            </div>
          </div>

          <!-- Manner -->
          <div style="background: var(--soft-grey); padding: 15px; border-radius: 10px;">
            <h4 style="color: var(--navy); font-size: 16px; margin-bottom: 10px;">3. Manner / Style</h4>
            <div style="display: flex; flex-wrap: wrap; gap: 6px;">
              <span style="background: var(--orange); color: white; padding: 4px 10px; border-radius: 15px; font-size: 13px; font-weight: bold;">carefully</span>
              <span style="background: white; color: #333; padding: 4px 10px; border-radius: 15px; font-size: 13px;">cautiously</span>
              <span style="background: white; color: #333; padding: 4px 10px; border-radius: 15px; font-size: 13px;">energetically</span>
            </div>
          </div>
        </div>

        <!-- Live Preview Output Box -->
        <div style="background: var(--navy); color: var(--white); padding: 20px; border-radius: 12px; border-left: 6px solid var(--orange);">
          <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: var(--orange); font-weight: bold; margin-bottom: 6px;">Live Movement Sentence Preview:</div>
          <div style="font-size: 22px; font-family: 'Outfit', sans-serif;">
            "She walks slowly from left to right, moving carefully."
          </div>
        </div>
      </div>

      <div class="teacher-notes">
        <h3>Teacher Notes</h3>
        <p><strong>WORK:</strong> Show how selecting cards instantly builds a fluent English sentence in the live preview box.</p>
        <p><strong>CHECK:</strong> Is "thinks about her homework" a good movement prompt? (No! The camera cannot film someone's thoughts. Use "scratches her head and looks down" instead!).</p>
      </div>
    </div>

    <!-- SLIDE 6: E - ENVIRONMENT -->
    <div class="slide theme-light" id="slide-6">
      <h2 class="slide-title">E — ENVIRONMENT: Location & Atmosphere</h2>
      <div class="content">
        <p style="font-size: 18px; margin-bottom: 20px; color: var(--navy);">
          Set the stage. Define location, weather, time of day, and 2–3 key background details.
        </p>

        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 25px;">
          <!-- Time of Day Cards -->
          <div style="background: #e1f5fe; padding: 15px; border-radius: 10px; text-align: center; border: 1px solid #81d4fa;">
            <div style="font-size: 28px;">🌅</div>
            <div style="font-weight: bold; color: #0277bd; margin-top: 5px;">Dawn</div>
            <div style="font-size: 12px; color: #555;">Soft morning light</div>
          </div>

          <div style="background: #fffde7; padding: 15px; border-radius: 10px; text-align: center; border: 1px solid #fff59d;">
            <div style="font-size: 28px;">☀️</div>
            <div style="font-weight: bold; color: #f57f17; margin-top: 5px;">Midday</div>
            <div style="font-size: 12px; color: #555;">Bright overhead sun</div>
          </div>

          <div style="background: #fff3e0; padding: 15px; border-radius: 10px; text-align: center; border: 1px solid #ffcc80;">
            <div style="font-size: 28px;">🌇</div>
            <div style="font-weight: bold; color: #e65100; margin-top: 5px;">Golden Hour</div>
            <div style="font-size: 12px; color: #555;">Warm glowing sun</div>
          </div>

          <div style="background: #ede7f6; padding: 15px; border-radius: 10px; text-align: center; border: 1px solid #b39ddb;">
            <div style="font-size: 28px;">🌙</div>
            <div style="font-weight: bold; color: #4527a0; margin-top: 5px;">Night</div>
            <div style="font-size: 12px; color: #555;">Cool moonlight & shadows</div>
          </div>
        </div>

        <!-- Key Background Details Rule -->
        <div style="background: #ffffff; border: 2px solid var(--blue); padding: 20px; border-radius: 12px; box-shadow: var(--shadow-sm);">
          <h4 style="color: var(--navy); font-size: 18px; margin-bottom: 10px;">Select 2 to 3 Essential Background Details</h4>
          <p style="font-size: 15px; color: #555; margin-bottom: 12px;">Don't overload the scene with dozens of objects! Pick the most important elements:</p>
          <div style="display: flex; gap: 15px;">
            <span style="background: #e8eaf6; color: #1a237e; font-weight: bold; padding: 8px 16px; border-radius: 20px; font-size: 14px;">1. tall green ferns</span>
            <span style="background: #e8eaf6; color: #1a237e; font-weight: bold; padding: 8px 16px; border-radius: 20px; font-size: 14px;">2. wet leaves</span>
            <span style="background: #e8eaf6; color: #1a237e; font-weight: bold; padding: 8px 16px; border-radius: 20px; font-size: 14px;">3. pale fog drifting between trees</span>
          </div>
        </div>
      </div>

      <div class="teacher-notes">
        <h3>Teacher Notes</h3>
        <p><strong>DO:</strong> Explain that background elements should enhance the setting without distracting from the main actor action.</p>
      </div>
    </div>

    <!-- SLIDE 7: R - RENDERING -->
    <div class="slide theme-light" id="slide-7">
      <h2 class="slide-title">R — RENDERING: Art Style & Visual Feel</h2>
      <div class="content">
        <p style="font-size: 18px; margin-bottom: 20px; color: var(--navy);">
          Decide what the finished video looks and feels like. Art direction creates visual harmony.
        </p>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px;">
          <!-- Visual Style Options -->
          <div style="background: var(--soft-grey); padding: 20px; border-radius: 12px;">
            <h4 style="color: var(--navy); font-size: 18px; margin-bottom: 12px;">Visual Art Styles</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px;">
              <div style="background: white; padding: 10px; border-radius: 6px; border-left: 4px solid var(--orange); font-weight: bold;">Stylised 3D Animation</div>
              <div style="background: white; padding: 10px; border-radius: 6px;">Live-action Cinematic</div>
              <div style="background: white; padding: 10px; border-radius: 6px;">Photorealistic</div>
              <div style="background: white; padding: 10px; border-radius: 6px;">2D Animation</div>
              <div style="background: white; padding: 10px; border-radius: 6px;">Stop Motion / Clay</div>
              <div style="background: white; padding: 10px; border-radius: 6px;">Watercolour Style</div>
            </div>
          </div>

          <!-- Lighting & Mood -->
          <div style="background: var(--soft-grey); padding: 20px; border-radius: 12px;">
            <h4 style="color: var(--navy); font-size: 18px; margin-bottom: 12px;">Lighting, Colour & Mood</h4>
            <div style="margin-bottom: 10px;">
              <strong style="color: var(--navy); font-size: 14px;">Lighting:</strong>
              <div style="font-size: 14px; color: #444;">Soft dawn light / Warm golden light</div>
            </div>
            <div style="margin-bottom: 10px;">
              <strong style="color: var(--navy); font-size: 14px;">Colour Palette:</strong>
              <div style="font-size: 14px; color: #444;">Rich green & warm golden hues</div>
            </div>
            <div>
              <strong style="color: var(--navy); font-size: 14px;">Overall Mood:</strong>
              <div style="font-size: 14px; color: #444;">Adventurous / Mysterious / Tense</div>
            </div>
          </div>
        </div>
      </div>

      <div class="teacher-notes">
        <h3>Teacher Notes</h3>
        <p><strong>CHECK:</strong> Why shouldn't you mix "Stop motion clay animation" with "Photorealistic live-action documentary" in the same prompt? (It confuses the AI renderer!).</p>
      </div>
    </div>

    <!-- SLIDE 8: A - ANCHORS -->
    <div class="slide theme-light" id="slide-8">
      <h2 class="slide-title">A — ANCHORS: Duration & Consistency</h2>
      <div class="content">
        <p style="font-size: 18px; margin-bottom: 20px; color: var(--navy);">
          Tell the AI what must remain consistent throughout the clip to maintain video continuity.
        </p>

        <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 25px;">
          <!-- Duration Control -->
          <div style="background: #e0f2f1; border: 2px solid #009688; padding: 20px; border-radius: 12px; text-align: center;">
            <div style="font-size: 36px; margin-bottom: 5px;">⏱️</div>
            <h4 style="color: #004d40; font-size: 22px; margin-bottom: 8px;">Clip Duration</h4>
            <div style="font-size: 32px; font-weight: bold; color: var(--navy); margin-bottom: 8px;">6 Seconds</div>
            <div style="font-size: 13px; color: #00695c; background: #b2dfdb; padding: 4px 8px; border-radius: 10px; display: inline-block;">
              Recommended while learning
            </div>
          </div>

          <!-- Continuity Locks -->
          <div style="background: #ffffff; border: 2px solid var(--blue); padding: 20px; border-radius: 12px; box-shadow: var(--shadow-sm);">
            <h4 style="color: var(--navy); font-size: 18px; margin-bottom: 12px;">Continuity Anchors (Checkboxes)</h4>
            
            <div style="display: flex; flex-direction: column; gap: 10px; font-size: 15px;">
              <label style="display: flex; align-items: center; gap: 10px; color: var(--navy);">
                <input type="checkbox" checked disabled style="width: 20px; height: 20px; accent-color: var(--orange);">
                One continuous shot (No random cuts or jumps)
              </label>

              <label style="display: flex; align-items: center; gap: 10px; color: var(--navy);">
                <input type="checkbox" checked disabled style="width: 20px; height: 20px; accent-color: var(--orange);">
                Keep subject appearance consistent across frames
              </label>

              <label style="display: flex; align-items: center; gap: 10px; color: var(--navy);">
                <input type="checkbox" checked disabled style="width: 20px; height: 20px; accent-color: var(--orange);">
                Keep clothing & main colours unchanged (Yellow raincoat, red backpack)
              </label>
            </div>
          </div>
        </div>
      </div>

      <div class="teacher-notes">
        <h3>Teacher Notes</h3>
        <p><strong>DO:</strong> Explain that short clips (6s) are easier for AI to render smoothly without glitches or distortion.</p>
      </div>
    </div>

    <!-- SLIDE 9: Compiler & Conflict Checker -->
    <div class="slide theme-light" id="slide-9">
      <h2 class="slide-title">The Prompt Compiler & Conflict Checker</h2>
      <div class="content">
        <p style="font-size: 18px; margin-bottom: 20px; color: var(--navy);">
          The app turns your structured choices into a single prompt sentence and checks for mistakes!
        </p>

        <!-- Warning Levels -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 25px;">
          <!-- Level 1: Good -->
          <div style="background: #edf7ed; border-left: 5px solid var(--green-success); padding: 15px; border-radius: 8px;">
            <div style="font-weight: bold; color: var(--green-success); font-size: 16px; margin-bottom: 5px;">✓ Good</div>
            <div style="font-size: 13px; color: #1e4620;">All choices align logically. Your prompt is healthy!</div>
          </div>

          <!-- Level 2: Director's Tip -->
          <div style="background: #fff8e1; border-left: 5px solid #ffa000; padding: 15px; border-radius: 8px;">
            <div style="font-weight: bold; color: #b56c00; font-size: 16px; margin-bottom: 5px;">💡 Director's Tip</div>
            <div style="font-size: 13px; color: #424242;">Not wrong, but hard (e.g. Extreme Close-up + giant rainforest description).</div>
          </div>

          <!-- Level 3: Fix This -->
          <div style="background: #ffebee; border-left: 5px solid var(--red-error); padding: 15px; border-radius: 8px;">
            <div style="font-weight: bold; color: var(--red-error); font-size: 16px; margin-bottom: 5px;">⚠ Fix This</div>
            <div style="font-size: 13px; color: #b71c1c;">Contradictory instructions (e.g. Static Camera + Tracking Shot).</div>
          </div>
        </div>

        <!-- Sample Compiled Prompt Box -->
        <div style="background: #ffffff; border: 2px solid var(--navy); padding: 18px; border-radius: 10px; font-size: 14px; line-height: 1.6; color: #333;">
          <strong style="color: var(--orange); display: block; margin-bottom: 6px; font-size: 14px; text-transform: uppercase;">Compiled Prompt Output:</strong>
          "Medium eye-level shot of a ten-year-old explorer with curly black hair, wearing a yellow raincoat and a small red backpack. She walks slowly from left to right through a misty subtropical rainforest. [Tracking shot] Stylised 3D animation with soft dawn light and an adventurous mood. One continuous six-second shot."
        </div>
      </div>

      <div class="teacher-notes">
        <h3>Teacher Notes</h3>
        <p><strong>WORK:</strong> Review the three conflict warning levels with students. Emphasise fixing Red warnings before copying their prompt.</p>
      </div>
    </div>

    <!-- SLIDE 10: App Launch & Next Steps (Dark Summary) -->
    <div class="slide theme-dark" id="slide-10">
      <div style="max-width: 900px; margin: 0 auto; text-align: center;">
        <div style="font-size: 70px; margin-bottom: 15px;">🚀</div>
        <h1 style="font-size: 48px; color: var(--orange); margin-bottom: 20px;">Ready to Direct Your Video!</h1>
        
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; text-align: left; margin-bottom: 30px;">
          <div style="background: rgba(255,255,255,0.08); padding: 15px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.15);">
            <div style="color: var(--orange); font-weight: bold; font-size: 18px;">1. OPEN</div>
            <div style="font-size: 14px; color: var(--text-light); margin-top: 5px;">Double-click <code>index.html</code></div>
          </div>

          <div style="background: rgba(255,255,255,0.08); padding: 15px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.15);">
            <div style="color: var(--orange); font-weight: bold; font-size: 18px;">2. DIRECT</div>
            <div style="font-size: 14px; color: var(--text-light); margin-top: 5px;">Complete 6 C-A-M-E-R-A stages</div>
          </div>

          <div style="background: rgba(255,255,255,0.08); padding: 15px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.15);">
            <div style="color: var(--orange); font-weight: bold; font-size: 18px;">3. COPY & SAVE</div>
            <div style="font-size: 14px; color: var(--text-light); margin-top: 5px;">Copy prompt & save <code>.json</code></div>
          </div>

          <div style="background: rgba(255,255,255,0.08); padding: 15px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.15);">
            <div style="color: var(--orange); font-weight: bold; font-size: 18px;">4. GENERATE</div>
            <div style="font-size: 14px; color: var(--text-light); margin-top: 5px;">Paste into AI & evaluate clip!</div>
          </div>
        </div>

        <p style="font-size: 20px; color: var(--white); font-weight: 600;">
          Let's open the CAMERA app and begin directing!
        </p>
      </div>

      <div class="teacher-notes">
        <h3>Teacher Notes</h3>
        <p><strong>FINISH:</strong> Instruct students to double-click <code>index.html</code> on their devices and enter their project title to start directing.</p>
      </div>
    </div>
`;

// Replace the comment placeholder in the template with slidesHtml
const finalHtml = templateHtml.replace('<!-- SLIDES GO HERE DURING DYNAMIC COMPILATION -->', slidesHtml);

console.log('Writing compiled presentation to:', outputPath);
fs.writeFileSync(outputPath, finalHtml, 'utf8');
console.log('Successfully compiled Lesson_CAMERA_Prompting_Presentation.html!');
