const fs = require('fs');
const path = require('path');

function compile() {
  const rootPath = 'c:\\Users\\dsuth\\Documents\\Joshua';
  const templatePath = path.join(rootPath, '.agent', 'skills', 'lesson-creator', 'assets', 'presentation_template.html');
  const outputPath = path.join(__dirname, '..', 'Lesson_25.1_Presentation.html');
  
  if (!fs.existsSync(templatePath)) {
    console.error("❌ Standard presentation template not found at:", templatePath);
    process.exit(1);
  }
  
  let templateContent = fs.readFileSync(templatePath, 'utf8');
  
  // Custom slides structure
  const slidesContent = `
    <!-- Slide 1: Title Slide (theme-dark) -->
    <div class="slide theme-dark" id="slide1">
      <div class="fade-in-up">
        <h1>Elemental Magic</h1>
        <h2>Animal Survival & Part A Prep</h2>
        <p class="subtitle">An interactive learning sequence to master skimming, scanning, and analytical comprehension for the Part A English Assessment.</p>
      </div>
    </div>
    
    <!-- Slide 2: Learning Intentions & Success Criteria (theme-light) -->
    <div class="slide theme-light" id="slide2">
      <h2 class="slide-title">Learning Intentions & Success Criteria</h2>
      <div class="content fade-in-up delay-1">
        <div class="remember-box" style="margin-top: 10px;">
          <strong>Learning Intention:</strong> I can read and comprehend an informative text, explaining purpose, audience, text structures, and language/visual features. (AC9E5LY03, AC9E5LY04, AC9E5LY05)
        </div>
        <ul class="success-list" style="margin-top: 25px;">
          <li class="delay-2">I can scan a complex informative text to locate literal facts under time pressure.</li>
          <li class="delay-3">I can identify structural features of an information report (comparison tables, glossary).</li>
          <li class="delay-4">I can explain how language features (expanded noun groups, clause structures, precise verbs) make meaning precise.</li>
          <li class="delay-5">I can construct a structured, two-step comprehension response (Evidence + Technical Effect) to prepare for the assessment.</li>
        </ul>
      </div>
    </div>
    
    <!-- Slide 3: Activate: Skimming & Scanning Challenge (theme-light) -->
    <div class="slide theme-light standard-only" id="slide3">
      <h2 class="slide-title">01. Skimming & Scanning Challenge</h2>
      <div class="content fade-in-up delay-1">
        <p class="intro-text">Can you locate the answers to these three questions on the <strong>Elemental Magic</strong> page in under 30 seconds?</p>
        
        <div class="scenario-box">
          <ol style="margin-left: 25px; font-size: 24px; line-height: 1.6;">
            <li>What extreme temperature effect highlights the intensity of bushfires?</li>
            <li>Which animal uses shovel-like claws to burrow into the soil?</li>
            <li>What is the 'Post-Fire Menu' rich in?</li>
          </ol>
        </div>
        
        <div class="timer-countdown-display" id="scanningTimerDisplay" style="font-size: 48px; font-weight: bold; color: var(--orange); text-align: center; margin-top: 15px;">30</div>
        <div class="countdown-btn-box" style="display: flex; justify-content: center; margin-top: 20px; gap: 15px;">
          <button class="btn-action" id="startScanningTimerBtn">Start Countdown</button>
          <button class="btn-action" id="resetScanningTimerBtn" style="background-color: var(--blue);">Reset</button>
        </div>
        
        <div class="teacher-notes" style="display:none;">
          <strong>Teacher Notes - Warm-up:</strong>
          <p>Have the class open the live Elemental Magic page. When they are ready, click "Start Countdown". Ensure students are scanning (running eyes over headings and bold words) rather than reading line-by-line.</p>
          <ul>
            <li><strong>Answer 1:</strong> Reaching temperatures that can melt steel (Module 1).</li>
            <li><strong>Answer 2:</strong> Echidnas (Module 2/4).</li>
            <li><strong>Answer 3:</strong> Rich in nutrients (Module 7).</li>
          </ul>
        </div>
      </div>
      <script>
        (function() {
          let timeLeft = 30;
          let timerId = null;
          const display = document.getElementById('scanningTimerDisplay');
          const startBtn = document.getElementById('startScanningTimerBtn');
          const resetBtn = document.getElementById('resetScanningTimerBtn');

          startBtn.addEventListener('click', () => {
            if (timerId !== null) return;
            startBtn.disabled = true;
            timerId = setInterval(() => {
              timeLeft--;
              display.innerText = timeLeft;
              if (timeLeft <= 5) {
                display.style.color = 'var(--red)';
                display.classList.add('shake');
              }
              if (timeLeft <= 0) {
                clearInterval(timerId);
                timerId = null;
                display.innerText = "Time's Up!";
                display.classList.remove('shake');
              }
            }, 1000);
          });

          resetBtn.addEventListener('click', () => {
            clearInterval(timerId);
            timerId = null;
            timeLeft = 30;
            display.innerText = timeLeft;
            display.style.color = 'var(--orange)';
            display.classList.remove('shake');
            startBtn.disabled = false;
          });
        })();
      </script>
    </div>
    
    <!-- Slide 4: Explore: Wildlife Survival Strategies (theme-light) -->
    <div class="slide theme-light standard-only" id="slide4">
      <h2 class="slide-title">02. Animal Adaptation Strategies</h2>
      <div class="content fade-in-up delay-1">
        <p class="intro-text">Click on an animal card to explore their biological and behavioural \"survival magic\".</p>
        
        <div class="tectonics-grid" style="grid-template-columns: 1fr 1fr; gap: 30px; height: auto; margin-top: 15px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <button class="quiz-option-btn" id="cardKangaroo" style="height: 120px; font-size: 26px;">KANGAROOS</button>
            <button class="quiz-option-btn" id="cardEchidna" style="height: 120px; font-size: 26px;">ECHIDNAS</button>
            <button class="quiz-option-btn" id="cardGoanna" style="height: 120px; font-size: 26px;">GOANNAS</button>
            <button class="quiz-option-btn" id="cardBirds" style="height: 120px; font-size: 26px;">BIRDS</button>
          </div>
          
          <div class="tectonics-info-card" id="animalStrategyCard" style="min-height: 280px; justify-content: center; align-items: center; text-align: center; color: var(--text-dark); background-color: var(--white); border: 3px solid var(--navy); box-shadow: 6px 6px 0px rgba(17,45,78,0.1); border-radius: 8px; padding: 25px; display: flex; flex-direction: column;">
            <h3 class="info-title" id="animalCardTitle" style="border-bottom: none; font-size: 26px; font-weight: 700; color: var(--navy); margin-bottom: 12px; text-transform: uppercase;">Select an Animal</h3>
            <div id="animalCardTag" class="info-tag" style="display: none; background-color: var(--orange); color: var(--white); padding: 3px 8px; border-radius: 4px; font-weight: bold; margin-bottom: 8px; font-size: 14px; text-transform: uppercase;"></div>
            <div class="info-detail-box" id="animalCardDetail" style="margin-top: 10px;">
              <p style="font-size: 22px; color: #555;">Click any animal button on the left to reveal their survival mechanisms, tactical shelters, and habitat actions.</p>
            </div>
          </div>
        </div>
        
        <div class="teacher-notes" style="display:none;">
          <strong>Teacher Notes - Animal Strategies:</strong>
          <p>Guide students to classify animal actions as either Fleeing, Sheltering, or Timing. Connect this back to tomorrow's assessment: students must explain why certain tactics protect from radiant heat (insulation, topography).</p>
        </div>
      </div>
      <script>
        (function() {
          const data = {
            Kangaroo: {
              title: "KANGAROOS: Tactical Runners",
              tag: "Strategy: Fleeing & Sanctuary",
              detail: "Kangaroos use powerful hind legs and endurance to sense smoke early. They evacuate to 'Tactical Sanctuaries' like cleared paddocks, rocky outcrops, or waterholes to remove themselves from dry leaf fuel and lethal radiant heat."
            },
            Echidna: {
              title: "ECHIDNAS: Earth Shields",
              tag: "Strategy: Sheltering & Insulation",
              detail: "Echidnas use shovel-like claws to burrow into soil or leaf litter. Soil provides outstanding thermal insulation, protecting them from extreme surface heat. They curl into a tight ball, exposing only sharp spines."
            },
            Goanna: {
              title: "GOANNAS: Canopy bunkers",
              tag: "Strategy: Crevice Real Estate",
              detail: "As cold-blooded reptiles, they are sensitive to temperature shifts. Goannas squeeze their bodies into tree hollows and deep rock crevices. They remain patient, breathing slowly until danger passes."
            },
            Birds: {
              title: "BIRDS: Sky Guardians",
              tag: "Strategy: Flight & Wetlands",
              detail: "While some hunt the fire margins for fleeing insects, most find 'Elemental Sanctuaries' (damp wetlands, gullies). They wait for the wind to shift, returning to the burnt ground where finding food is exceptionally easy."
            }
          };

          const titleEl = document.getElementById('animalCardTitle');
          const tagEl = document.getElementById('animalCardTag');
          const detailEl = document.getElementById('animalCardDetail');

          function showAnimal(key) {
            // Remove active class from all buttons
            ['Kangaroo', 'Echidna', 'Goanna', 'Birds'].forEach(k => {
              document.getElementById('card' + k).classList.remove('correct');
            });

            // Set active on clicked
            document.getElementById('card' + key).classList.add('correct');

            titleEl.innerText = data[key].title;
            tagEl.innerText = data[key].tag;
            tagEl.style.display = 'inline-block';
            detailEl.innerHTML = "\\<p style=\\"font-size: 22px; line-height: 1.5; text-align: left;\\">" + data[key].detail + "\\</p>";
          }

          document.getElementById('cardKangaroo').addEventListener('click', () => showAnimal('Kangaroo'));
          document.getElementById('cardEchidna').addEventListener('click', () => showAnimal('Echidna'));
          document.getElementById('cardGoanna').addEventListener('click', () => showAnimal('Goanna'));
          document.getElementById('cardBirds').addEventListener('click', () => showAnimal('Birds'));

          // Show Answer override listener
          document.getElementById('slide4').addEventListener('show-answer', () => {
            showAnimal('Echidna');
          });
        })();
      </script>
    </div>
    
    <!-- Slide 5: Model: Interactive Annotations (theme-light) -->
    <div class="slide theme-light standard-only" id="slide5">
      <h2 class="slide-title">03. Decoding the Text structures</h2>
      <div class="content fade-in-up delay-1">
        <p class="intro-text">Click on the highlighted text segments to decode their language features and precise effect.</p>
        
        <div class="annotations-grid" style="grid-template-columns: 1.2fr 0.8fr; margin-top: 15px;">
          <div class="text-workspace" style="font-size: 22px; line-height: 1.8; background-color: var(--pure-white); border: 3px solid var(--navy); border-radius: 8px; box-shadow: 6px 6px 0px rgba(17,45,78,0.1); padding: 30px; max-height: 400px; overflow-y: auto; color: var(--text-dark);">
            <p>Bushfires are a fundamental, albeit terrifying, part of the Australian landscape. They move with incredible speed, reaching temperatures that can melt steel. <span class="decodable-segment" id="seg1" style="background-color: var(--blue-light); border-bottom: 2px dashed var(--orange); padding: 0 4px; cursor: pointer; border-radius: 2px; font-weight: 500;">Yet, for the animals that call the bush home, fire is not a new enemy.</span></p>
            <p style="margin-top: 15px;">Over millions of years, creatures from kangaroos to tiny echidnas <span class="decodable-segment" id="seg2" style="background-color: var(--blue-light); border-bottom: 2px dashed var(--orange); padding: 0 4px; cursor: pointer; border-radius: 2px; font-weight: 500;">have developed a sophisticated toolkit of 'survival magic'</span>—behaviours and biological features that <span class="decodable-segment" id="seg3" style="background-color: var(--blue-light); border-bottom: 2px dashed var(--orange); padding: 0 4px; cursor: pointer; border-radius: 2px; font-weight: 500;">allow them to endure where others cannot.</span></p>
          </div>
          
          <div class="annotation-sidebar" id="decodeInfoCard" style="min-height: 300px; justify-content: center; align-items: center; text-align: center; color: var(--text-dark); background-color: var(--pure-white); border: 3px solid var(--navy); border-radius: 8px; box-shadow: 6px 6px 0px rgba(17,45,78,0.1); padding: 25px; display: flex; flex-direction: column;">
            <h3 class="sidebar-header" id="decodeTitle" style="border-bottom: none; font-size: 22px; font-weight: bold; color: var(--navy); margin-bottom: 12px;">Select highlighted text</h3>
            <div class="sidebar-content" id="decodeContent" style="font-size: 16px; line-height: 1.5;">
              <p style="font-size: 18px; color: #555;">Click any underlined segment in the text block to reveal its two-step grammatical analysis and precision effect.</p>
            </div>
          </div>
        </div>
        
        <div class="teacher-notes" style="display:none;">
          <strong>Teacher Notes - Analytical Decoding:</strong>
          <p>Model the two-step response formula for students: Identify the precise grammatical feature, then explain its informative effect. Explain that using specific vocabulary replaces general words to create scientific accuracy.</p>
        </div>
      </div>
      <script>
        (function() {
          const data = {
            seg1: {
              title: "1. Cohesive Device (Concession)",
              content: "<strong>Feature:</strong> Concession started sentence (using the starting word 'Yet').<br><br><strong>Precise Effect:</strong> Establishes a sharp logical contrast between the terrifying power of bushfires described in the previous sentence and the resilient survival of Australian wildlife, guiding the reader's expectation."
            },
            seg2: {
              title: "2. Expanded Noun Group",
              content: "<strong>Feature:</strong> Expanded noun group 'a sophisticated toolkit of survival magic'.<br><br><strong>Precise Effect:</strong> Summarises diverse biological and behavioural traits under an engaging scientific metaphor, informing the reader that survival is a complex system of adaptations."
            },
            seg3: {
              title: "3. Tense Contrast & Precise Verb",
              content: "<strong>Feature:</strong> Contrast between Present Perfect ('have developed') and Present Simple ('allow').<br><br><strong>Precise Effect:</strong> Connects millions of years of evolutionary history to the active present function, explaining the cause-and-effect of survival mechanisms in an objective tone."
            }
          };

          const titleEl = document.getElementById('decodeTitle');
          const contentEl = document.getElementById('decodeContent');

          function selectSegment(id) {
            ['seg1', 'seg2', 'seg3'].forEach(k => {
              document.getElementById(k).classList.remove('active-decode');
            });
            document.getElementById(id).classList.add('active-decode');
            titleEl.innerText = data[id].title;
            titleEl.style.borderBottom = '3px solid var(--orange)';
            contentEl.innerHTML = "\\<p style=\\"font-size: 20px; line-height: 1.5; text-align: left;\\">" + data[id].content + "\\</p>";
          }

          document.getElementById('seg1').addEventListener('click', () => selectSegment('seg1'));
          document.getElementById('seg2').addEventListener('click', () => selectSegment('seg2'));
          document.getElementById('seg3').addEventListener('click', () => selectSegment('seg3'));

          // Show Answer override listener
          document.getElementById('slide5').addEventListener('show-answer', () => {
            selectSegment('seg2');
          });
        })();
      </script>
    </div>
    
    <!-- Slide 6: Connect: Part A Comprehension Quiz Show (theme-light) -->
    <div class="slide theme-light standard-only" id="slide6">
      <h2 class="slide-title">04. Part A Practice Quiz Show</h2>
      <div class="content fade-in-up delay-1">
        <div class="quiz-layout" style="display: grid; grid-template-columns: 1.4fr 0.6fr; gap: 25px; margin-top: 10px; height: auto;">
          <div class="quiz-stage" style="background-color: var(--pure-white); border: 3px solid var(--navy); box-shadow: 6px 6px 0px rgba(17,45,78,0.1); border-radius: 8px; padding: 30px; display: flex; flex-direction: column; justify-content: space-between; position: relative;">
            <!-- Timer Bar -->
            <div class="timer-container" style="width: 100%; height: 15px; background-color: #cbd5e1; border-radius: 10px; overflow: hidden; margin-bottom: 15px; border: 2px solid var(--navy);">
              <div class="timer-bar" id="quizTimerBar" style="height: 100%; width: 100%; background-color: var(--orange); transition: width 1s linear;"></div>
            </div>
            
            <!-- Question Box -->
            <div class="quiz-question-box" id="quizQuestionBox" style="background: var(--pure-white); border: 3px solid var(--navy); padding: 28px; font-size: 32px; font-weight: 600; color: var(--navy); text-align: center; box-shadow: 6px 6px 0px var(--orange); margin-bottom: 15px; line-height: 1.3;">Loading Question...</div>
            
            <!-- Options Grid -->
            <div class="quiz-grid" id="quizOptionsGrid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px;">
              <!-- Dynamically populated buttons -->
            </div>
            
            <!-- Explanation Panel -->
            <div class="quiz-explanation-box" id="quizExplanationBox" style="margin-top: 20px; background: #eef2f6; border-left: 5px solid var(--blue); padding: 22px; display: none; font-size: 24px; line-height: 1.5; animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);">
              <div class="quiz-explanation-title" id="quizExplanationTitle" style="font-weight: bold; margin-bottom: 8px;">Result</div>
              <div id="quizExplanationText">Explanation details...</div>
            </div>
          </div>
          
          <!-- Scoreboard Sidebar -->
          <div class="quiz-sidebar" style="background-color: var(--navy); border: 3px solid var(--navy); box-shadow: 6px 6px 0px rgba(17,45,78,0.1); border-radius: 8px; padding: 20px; color: var(--white); display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div class="scoreboard-title" style="font-family: 'Outfit', sans-serif; font-size: 20px; font-weight: bold; color: var(--orange); text-transform: uppercase; border-bottom: 2px solid rgba(255,255,255,0.2); padding-bottom: 6px; margin-bottom: 15px;">CLASS SCOREBOARD</div>
              <div class="score-display" id="quizScoreDisplay" style="font-size: 42px; font-weight: 700; color: var(--pure-white); font-family: 'Outfit', sans-serif; text-align: center; margin: 10px 0;">0000</div>
            </div>
            
            <div>
              <div class="scoreboard-title" style="font-size: 15px; margin-top: 15px; border-bottom: 2px solid rgba(255,255,255,0.2); padding-bottom: 6px; margin-bottom: 15px;">TOP SCORERS</div>
              <ul class="leaderboard-list" style="list-style-type: none;">
                <li class="leaderboard-item" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; font-size: 15px;">
                  <div style="display:flex; align-items:center; gap:8px;">
                    <div class="leaderboard-avatar" style="width: 32px; height: 32px; border-radius: 50%; background-color: var(--orange); border: 2px solid var(--white); display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; color: var(--white);">M</div>
                    <strong>Mia (Standard)</strong>
                  </div>
                  <span>450 pts</span>
                </li>
                <li class="leaderboard-item" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; font-size: 15px;">
                  <div style="display:flex; align-items:center; gap:8px;">
                    <div class="leaderboard-avatar" style="width: 32px; height: 32px; border-radius: 50%; background-color: var(--blue); border: 2px solid var(--white); display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; color: var(--white);">L</div>
                    <strong>Liam (Standard)</strong>
                  </div>
                  <span>400 pts</span>
                </li>
                <li class="leaderboard-item" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; font-size: 15px;">
                  <div style="display:flex; align-items:center; gap:8px;">
                    <div class="leaderboard-avatar" style="width: 32px; height: 32px; border-radius: 50%; background-color: var(--blue); border: 2px solid var(--white); display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; color: var(--white);">C</div>
                    <strong>Charlotte (Standard)</strong>
                  </div>
                  <span>350 pts</span>
                </li>
              </ul>
            </div>
            
            <button class="btn-action" id="quizActionBtn" style="width: 100%; font-size: 16px; margin-top: 15px; border: 3px solid var(--white); background-color: var(--navy); color: var(--white); font-family: 'Outfit', sans-serif; font-weight: bold; text-transform: uppercase; padding: 10px; cursor: pointer; transition: all 0.2s ease;">Next Question</button>
          </div>
        </div>
        
        <div class="teacher-notes" style="display:none;">
          <strong>Teacher Notes - Practice Quiz Show:</strong>
          <p>Have students read the questions together. Prompt them to scan their worksheets or the live text to verify the answers before they submit. Encourage them to explain *why* wrong choices are incorrect.</p>
        </div>
      </div>
      <script>
        (function() {
          const questions = [
            {
              q: "What is the primary main idea of the 'Elemental Magic' informative feature?",
              options: [
                "Showing how Australian animals have developed biological and behavioural strategies to survive bushfires.",
                "Detailing how firefighters extinguish forest fires using modern technology and tools.",
                "Describing why bushfires are increasing in frequency across the outback.",
                "Informing readers how to build fireproof homes in the Australian bush."
              ],
              correct: 0,
              explanation: "The text explains the sophisticated toolkit of biological and behavioural strategies (Fleeing, Sheltering, Timing) that native creatures use to survive fires."
            },
            {
              q: "Why do kangaroos seek out 'Tactical Sanctuaries' like rock outcrops and waterholes during a fire?",
              options: [
                "These places have the highest wind speeds to blow smoke.",
                "Waterholes and rocks contain fresh green grass shoots to eat.",
                "These areas lack dry leaves and tall grass, protecting them from lethal radiant heat.",
                "Predators like goannas cannot climb steep rocks, keeping safe."
              ],
              correct: 2,
              explanation: "Open spaces and cleared paddocks lack dry leaves and grass, removing fuel from the fire and shielding kangaroos from radiant heat."
            },
            {
              q: "How does a few centimetres of soil protect an echidna from high surface temperatures?",
              options: [
                "Soil possesses excellent thermal insulation properties, shielding them from scorching surface heat.",
                "The soil blocks the scent of smoke, preventing predators from finding them.",
                "Damp dirt allows echidnas to breathe oxygen generated by tree roots.",
                "The soil absorbs the fire's water to create a cool mud bath."
              ],
              correct: 0,
              explanation: "Soil acts as a natural insulator; even a thin layer blocks surface heat, allowing the burrowed echidna to remain cool as the fire front passes."
            },
            {
              q: "Identify the Expanded Noun Group in: 'These short-beaked monotremes possess a remarkable Thermal Shield.'",
              options: [
                "monotremes possess",
                "These short-beaked monotremes",
                "possess a",
                "remarkable Thermal"
              ],
              correct: 1,
              explanation: "'These short-beaked monotremes' is the subject noun group, expanded with adjectives ('short-beaked') to describe the animal precisely."
            },
            {
              q: "What visual purpose does the 'Comparison Table' serve at the end of the text?",
              options: [
                "It lists the spelling words students must copy into vocabulary books.",
                "It shows a map of fire-prone areas in Australia.",
                "It summarizes and categorizes the four animals, their survival strategies, and shelter types for quick navigation.",
                "It lists the names of all researchers who studied outback animals."
              ],
              correct: 2,
              explanation: "Tables act as visual organizers, summarizing key factual combinations (animal, strategy, shelter) so readers can compare them instantly without scanning blocks of text."
            }
          ];

          let currentQIdx = 0;
          let score = 0;
          let timeLeft = 30;
          let timerId = null;

          const qBox = document.getElementById('quizQuestionBox');
          const grid = document.getElementById('quizOptionsGrid');
          const scoreDisp = document.getElementById('quizScoreDisplay');
          const actionBtn = document.getElementById('quizActionBtn');
          const timerBar = document.getElementById('quizTimerBar');
          const expBox = document.getElementById('quizExplanationBox');
          const expTitle = document.getElementById('quizExplanationTitle');
          const expText = document.getElementById('quizExplanationText');

          function startQuestionTimer() {
            clearInterval(timerId);
            timeLeft = 30;
            timerBar.style.width = '100%';
            timerBar.style.backgroundColor = 'var(--orange)';
            timerId = setInterval(() => {
              timeLeft--;
              const percent = (timeLeft / 30) * 100;
              timerBar.style.width = percent + '%';
              if (timeLeft <= 5) {
                timerBar.style.backgroundColor = 'var(--red)';
              }
              if (timeLeft <= 0) {
                clearInterval(timerId);
                handleSubmission(-1); // timeout
              }
            }, 1000);
          }

          function loadQuestion(idx) {
            if (idx >= questions.length) {
              qBox.innerText = "Quiz Completed! Outstanding Effort!";
              grid.innerHTML = '';
              clearInterval(timerId);
              timerBar.style.width = '0%';
              actionBtn.style.display = 'none';
              expBox.style.display = 'none';
              return;
            }

            const q = questions[idx];
            qBox.innerText = (idx + 1) + ". " + q.q;
            grid.innerHTML = '';
            expBox.style.display = 'none';
            actionBtn.style.display = 'none';

            q.options.forEach((opt, oIdx) => {
              const btn = document.createElement('button');
              btn.className = 'quiz-option-btn';
              btn.innerText = opt;
              btn.style.width = '100%';
              btn.style.justifyContent = 'flex-start';
              btn.addEventListener('click', () => handleSubmission(oIdx));
              grid.appendChild(btn);
            });

            startQuestionTimer();
          }

          function handleSubmission(selectedIdx) {
            clearInterval(timerId);
            const q = questions[currentQIdx];
            const buttons = grid.querySelectorAll('.quiz-option-btn');

            buttons.forEach((btn, idx) => {
              btn.disabled = true;
              btn.classList.add('disabled');
              if (idx === q.correct) {
                btn.classList.add('correct');
              }
            });

            if (selectedIdx === q.correct) {
              score += 100;
              scoreDisp.innerText = String(score).padStart(4, '0');
              expTitle.innerText = "Correct! +100 Points";
              expTitle.style.color = 'var(--green)';
              expBox.classList.add('correct-explained');
            } else {
              score = Math.max(0, score - 50);
              scoreDisp.innerText = String(score).padStart(4, '0');
              if (selectedIdx !== -1) {
                buttons[selectedIdx].classList.add('incorrect');
              }
              expTitle.innerText = selectedIdx === -1 ? "Time's Up! -50 Points" : "Incorrect! -50 Points";
              expTitle.style.color = 'var(--red)';
              expBox.classList.remove('correct-explained');
            }

            expText.innerHTML = q.explanation;
            expBox.style.display = 'block';
            actionBtn.style.display = 'block';
          }

          actionBtn.addEventListener('click', () => {
            currentQIdx++;
            loadQuestion(currentQIdx);
          });

          // Show Answer override listener
          document.getElementById('slide6').addEventListener('show-answer', () => {
            handleSubmission(questions[currentQIdx].correct);
          });

          loadQuestion(0);
        })();
      </script>
    </div>
    
    <!-- Slide 7: Lucas Pathway: Heading & Image Finder (theme-light) -->
    <div class="slide theme-light lucas-only" id="slide7">
      <h2 class="slide-title">Lucas: Web Page Structure Patrol</h2>
      <div class="content fade-in-up delay-1">
        <p class="intro-text" style="font-size: 28px;">With your helper, click the correct parts of our website mockup!</p>
        
        <div class="lucas-stage" style="display: grid; grid-template-columns: 1.3fr 0.7fr; gap: 25px; margin-top: 15px;">
          <div class="website-mockup" id="lucasMockup" style="max-height: 400px; padding: 25px; background-color: var(--pure-white); border: 3px dashed var(--navy); border-radius: 8px; box-shadow: 6px 6px 0px rgba(17,45,78,0.1); position: relative;">
            <div class="mock-header" id="lucasTitle" style="font-size: 28px; font-weight: bold; background-color: #ffe0b2; margin-bottom: 20px; border: 2px solid var(--navy); border-radius: 6px; padding: 10px; text-align: center; cursor: pointer; transition: all 0.2s ease;">
              ELEMENTAL MAGIC
            </div>
            
            <div class="mock-content-row" style="display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 15px;">
              <div class="mock-body-card" style="font-size: 18px; padding: 15px; background-color: #f8fafc; border: 2px solid var(--navy); border-radius: 6px; color: #475569;">
                <div id="lucasHeading" style="font-weight: bold; font-size: 20px; color: var(--orange); margin-bottom: 8px; border-bottom: 2px solid var(--orange); padding-bottom: 4px; cursor: pointer; text-align: center; transition: all 0.2s ease;">
                  04. ECHIDNAS: EARTH SHIELDS
                </div>
                Echidnas curl into a tight ball underground to stay cool.
              </div>
              
              <div class="mock-image-container" id="lucasImage" style="height: 140px; background-color: #cbd5e1; border: 2px solid var(--navy); border-radius: 6px; display: flex; flex-direction: column; justify-content: center; align-items: center; cursor: pointer; transition: all 0.2s ease;">
                <span style="font-weight: bold; font-size: 18px; color: var(--navy);">Echidna Photo</span>
                <div class="mock-caption" id="lucasCaption" style="font-size: 12px; margin-top: 5px; cursor: pointer; border-bottom: 1px dotted var(--navy); padding-bottom: 2px;">Figure 1: Echidna in burrow</div>
              </div>
            </div>
          </div>
          
          <div class="lucas-coach-card" style="min-height: 250px; justify-content: center; align-items: center; text-align: center; background-color: var(--pure-white); border: 3px solid var(--navy); box-shadow: 6px 6px 0px rgba(17,45,78,0.1); border-radius: 8px; padding: 25px; display: flex; flex-direction: column;">
            <h3 class="info-title" id="lucasCoachTitle" style="border-bottom: none; font-size: 26px; font-weight: 700; color: var(--navy); margin-bottom: 12px; text-transform: uppercase;">Web Structure Patrol</h3>
            <div class="info-detail-box" id="lucasCoachDetail" style="font-size: 22px; margin-top: 10px;">
              Click the **Website Title**, the **Section Heading**, or the **Animal Image** to complete your patrol checklist!
            </div>
          </div>
        </div>
      </div>
      <script>
        (function() {
          const title = document.getElementById('lucasTitle');
          const heading = document.getElementById('lucasHeading');
          const img = document.getElementById('lucasImage');
          const coachTitle = document.getElementById('lucasCoachTitle');
          const coachDetail = document.getElementById('lucasCoachDetail');

          title.addEventListener('click', () => {
            title.classList.toggle('circled');
            if (title.classList.contains('circled')) {
              coachTitle.innerText = "⭐ Title Patrol Successful!";
              coachDetail.innerText = "Awesome! You found the main Website Title. It tells us the big topic of the whole page in large letters!";
            }
          });

          heading.addEventListener('click', () => {
            heading.classList.toggle('circled');
            if (heading.classList.contains('circled')) {
              coachTitle.innerText = "⭐ Heading Patrol Successful!";
              coachDetail.innerText = "Excellent! You found the Section Heading. It tells us we are starting a new section about Echidnas!";
            }
          });

          img.addEventListener('click', () => {
            img.classList.toggle('circled');
            if (img.classList.contains('circled')) {
              coachTitle.innerText = "⭐ Image Patrol Successful!";
              coachDetail.innerText = "Superb! You found the Animal Image. Pictures help us see what is happening in the text!";
            }
          });

          // Show Answer override listener
          document.getElementById('slide7').addEventListener('show-answer', () => {
            title.classList.add('circled');
            heading.classList.add('circled');
            img.classList.add('circled');
            coachTitle.innerText = "⭐ Full Patrol Completed!";
            coachDetail.innerText = "Wonderful work! You found the Title, Heading, and Image! You are a master website structural detective!";
          });
        })();
      </script>
    </div>
  `;
  
  // Replace standard placeholder
  let finalContent = templateContent.replace('<!-- SLIDES GO HERE DURING DYNAMIC COMPILATION -->', slidesContent);
  
  // Update page title and description
  finalContent = finalContent.replace('<title>Classroom Presentation Template</title>', '<title>Lesson 25.1: Elemental Magic & Assessment Preparation</title>');
  
  // Write compiled slides file
  fs.writeFileSync(outputPath, finalContent, 'utf8');
  console.log("🎉 Standalone Interactive Presentation compiled successfully!");
}

compile();
