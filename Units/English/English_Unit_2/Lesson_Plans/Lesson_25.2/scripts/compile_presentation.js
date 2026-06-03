const fs = require('fs');
const path = require('path');

function compile() {
  const rootPath = 'c:\\Users\\dsuth\\Documents\\Joshua';
  const templatePath = path.join(rootPath, '.agent', 'skills', 'lesson-creator', 'assets', 'presentation_template.html');
  const outputPath = path.join(__dirname, '..', 'Lesson_25.2_Presentation.html');
  
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
        <h1>Causes of Earthquakes</h1>
        <h2>Plate Tectonics & Part A Prep</h2>
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
        <p class="intro-text">Can you locate the answers to these three questions in under 30 seconds?</p>
        
        <div class="scenario-box">
          <ol style="margin-left: 25px; font-size: 24px; line-height: 1.6;">
            <li>How fast do tectonic plates move each year?</li>
            <li>What is the force that resists movement between stuck plates?</li>
            <li>What special machine measures the strength of ground movements?</li>
          </ol>
        </div>
        
        <div class="timer-countdown-display" id="scanningTimerDisplay" style="font-size: 48px; font-weight: bold; color: var(--orange); text-align: center; margin-top: 15px;">30</div>
        <div class="countdown-btn-box" style="display: flex; justify-content: center; margin-top: 20px; gap: 15px;">
          <button class="btn-action" id="startScanningTimerBtn">Start Countdown</button>
          <button class="btn-action" id="resetScanningTimerBtn" style="background-color: var(--blue);">Reset</button>
        </div>
        
        <div class="teacher-notes" style="display:none;">
          <strong>Teacher Notes - Warm-up:</strong>
          <p>Instruct students to scan (run eyes over headings and bold text) rather than reading line-by-line. Click "Start Countdown".</p>
          <ul>
            <li><strong>Answer 1:</strong> Only a few centimetres each year (Paragraph 1).</li>
            <li><strong>Answer 2:</strong> Friction (Paragraph 3).</li>
            <li><strong>Answer 3:</strong> Seismograph (Paragraph 8).</li>
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
    
    <!-- Slide 4: Explore: Plate Tectonics Grid (theme-light) -->
    <div class="slide theme-light standard-only" id="slide4">
      <h2 class="slide-title">02. Plate Boundary Types</h2>
      <div class="content fade-in-up delay-1">
        <p class="intro-text">Click on a boundary card to explore its direction of movement and geological features.</p>
        
        <div class="tectonics-grid" style="grid-template-columns: 1fr 1fr; gap: 30px; height: auto; margin-top: 15px;">
          <div style="display: grid; grid-template-columns: 1fr; gap: 15px;">
            <button class="quiz-option-btn" id="cardConvergent" style="height: 90px; font-size: 24px;">CONVERGENT</button>
            <button class="quiz-option-btn" id="cardDivergent" style="height: 90px; font-size: 24px;">DIVERGENT</button>
            <button class="quiz-option-btn" id="cardTransform" style="height: 90px; font-size: 24px;">TRANSFORM</button>
          </div>
          
          <div class="tectonics-info-card" id="boundaryInfoCard" style="min-height: 280px; justify-content: center; align-items: center; text-align: center; color: var(--text-dark); background-color: var(--white); border: 3px solid var(--navy); box-shadow: 6px 6px 0px rgba(17,45,78,0.1); border-radius: 8px; padding: 25px; display: flex; flex-direction: column;">
            <h3 class="info-title" id="boundaryCardTitle" style="border-bottom: none; font-size: 26px; font-weight: 700; color: var(--navy); margin-bottom: 12px; text-transform: uppercase;">Select a Boundary Type</h3>
            <div id="boundaryCardTag" class="info-tag" style="display: none; background-color: var(--orange); color: var(--white); padding: 3px 8px; border-radius: 4px; font-weight: bold; margin-bottom: 8px; font-size: 14px; text-transform: uppercase;"></div>
            <div class="info-detail-box" id="boundaryCardDetail" style="margin-top: 10px;">
              <p style="font-size: 22px; color: #555;">Click any boundary type button on the left to reveal the movement direction and geological products.</p>
            </div>
          </div>
        </div>
        
        <div class="teacher-notes" style="display:none;">
          <strong>Teacher Notes - Plate Boundaries:</strong>
          <p>Guide students to understand that different tectonic plate movements produce different geological outcomes. Emphasise how the comparison table summarizes this information for the reader.</p>
        </div>
      </div>
      <script>
        (function() {
          const data = {
            Convergent: {
              title: "CONVERGENT BOUNDARY",
              tag: "Direction: Plates push into each other",
              detail: "When plates collide, one is forced underneath (subduction) or the land is buckled upward. This forms massive fold mountains, deep ocean trenches, and extremely strong earthquakes."
            },
            Divergent: {
              title: "DIVERGENT BOUNDARY",
              tag: "Direction: Plates pull apart",
              detail: "As plates separate, magma rises from deep inside the mantle to fill the gap. This creates new crust, rift valleys, volcanic activity, and generally mild earthquakes."
            },
            Transform: {
              title: "TRANSFORM BOUNDARY",
              tag: "Direction: Plates slide sideways",
              detail: "Plates grind past one another horizontally. The jagged edges catch, building massive shear stress. When they release, active fault lines experience highly destructive, shallow earthquakes."
            }
          };

          const titleEl = document.getElementById('boundaryCardTitle');
          const tagEl = document.getElementById('boundaryCardTag');
          const detailEl = document.getElementById('boundaryCardDetail');

          function showBoundary(key) {
            ['Convergent', 'Divergent', 'Transform'].forEach(k => {
              document.getElementById('card' + k).classList.remove('correct');
            });

            document.getElementById('card' + key).classList.add('correct');

            titleEl.innerText = data[key].title;
            tagEl.innerText = data[key].tag;
            tagEl.style.display = 'inline-block';
            detailEl.innerHTML = "\\<p style=\\"font-size: 22px; line-height: 1.5; text-align: left;\\">" + data[key].detail + "\\</p>";
          }

          document.getElementById('cardConvergent').addEventListener('click', () => showBoundary('Convergent'));
          document.getElementById('cardDivergent').addEventListener('click', () => showBoundary('Divergent'));
          document.getElementById('cardTransform').addEventListener('click', () => showBoundary('Transform'));

          // Show Answer override listener
          document.getElementById('slide4').addEventListener('show-answer', () => {
            showBoundary('Transform');
          });
        })();
      </script>
    </div>
    
    <!-- Slide 5: Model: Interactive Annotations (theme-light) -->
    <div class="slide theme-light standard-only" id="slide5">
      <h2 class="slide-title">03. Decoding Text structures</h2>
      <div class="content fade-in-up delay-1">
        <p class="intro-text">Click on the highlighted text segments to decode their language features and precise effect.</p>
        
        <div class="annotations-grid" style="grid-template-columns: 1.2fr 0.8fr; margin-top: 15px;">
          <div class="text-workspace" style="font-size: 22px; line-height: 1.8; background-color: var(--pure-white); border: 3px solid var(--navy); border-radius: 8px; box-shadow: 6px 6px 0px rgba(17,45,78,0.1); padding: 30px; max-height: 400px; overflow-y: auto; color: var(--text-dark);">
            <p>Earth feels solid under our feet. <span class="decodable-segment" id="seg1" style="background-color: var(--blue-light); border-bottom: 2px dashed var(--orange); padding: 0 4px; cursor: pointer; border-radius: 2px; font-weight: 500;">However, our planet's crust (the hard, rocky outer layer of Earth) is actually broken into huge pieces.</span></p>
            <p style="margin-top: 15px;"><span class="decodable-segment" id="seg2" style="background-color: var(--blue-light); border-bottom: 2px dashed var(--orange); padding: 0 4px; cursor: pointer; border-radius: 2px; font-weight: 500;">As these plates float, they interact in three main ways. First, some plates pull apart...</span></p>
            <p style="margin-top: 15px;"><span class="decodable-segment" id="seg3" style="background-color: var(--blue-light); border-bottom: 2px dashed var(--orange); padding: 0 4px; cursor: pointer; border-radius: 2px; font-weight: 500;">When the rocks suddenly slip, they release a massive amount of stored energy.</span></p>
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
          <p>Model the two-step response formula. Emphasise how cohesive markers guide reader expectations and how noun groups create description.</p>
        </div>
      </div>
      <script>
        (function() {
          const data = {
            seg1: {
              title: "1. Parenthetical Definition & Contrast",
              content: "<strong>Feature:</strong> Contrast conjunction ('However') combined with a parenthetical definition '(the hard, rocky outer layer of Earth)'.<br><br><strong>Precise Effect:</strong> Introduces scientific terminology while immediately scaffolding the reader's understanding with a brief definition, making the text accessible without losing vocabulary rigor."
            },
            seg2: {
              title: "2. Cohesive Transition Markers",
              content: "<strong>Feature:</strong> Conjunction marker ('As these plates float') combined with sequential signposts ('First', 'Second', 'Third').<br><br><strong>Precise Effect:</strong> Creates solid cohesion, organizing the three types of interactions chronologically to help the reader follow and locate geological facts."
            },
            seg3: {
              title: "3. Cause-and-Effect Clause Structure",
              content: "<strong>Feature:</strong> Dependent adverbial clause ('When the rocks suddenly slip') and expanded noun group ('a massive amount of stored energy').<br><br><strong>Precise Effect:</strong> Links cause (rock slippage) directly to the effect (energy release), explaining the physical trigger of earthquakes in an objective, scientific tone."
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
            selectSegment('seg3');
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
            <div class="timer-container" style="width: 100%; height: 15px; background-color: #cbd5e1; border-radius: 10px; overflow: hidden; margin-bottom: 15px; border: 2px solid var(--navy);">
              <div class="timer-bar" id="quizTimerBar" style="height: 100%; width: 100%; background-color: var(--orange); transition: width 1s linear;"></div>
            </div>
            
            <div class="quiz-question-box" id="quizQuestionBox" style="background: var(--pure-white); border: 3px solid var(--navy); padding: 28px; font-size: 32px; font-weight: 600; color: var(--navy); text-align: center; box-shadow: 6px 6px 0px var(--orange); margin-bottom: 15px; line-height: 1.3;">Loading Question...</div>
            
            <div class="quiz-grid" id="quizOptionsGrid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px;"></div>
            
            <div class="quiz-explanation-box" id="quizExplanationBox" style="margin-top: 20px; background: #eef2f6; border-left: 5px solid var(--blue); padding: 22px; display: none; font-size: 24px; line-height: 1.5;">
              <div class="quiz-explanation-title" id="quizExplanationTitle" style="font-weight: bold; margin-bottom: 8px;">Result</div>
              <div id="quizExplanationText">Explanation details...</div>
            </div>
          </div>
          
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
                  <span>480 pts</span>
                </li>
                <li class="leaderboard-item" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; font-size: 15px;">
                  <div style="display:flex; align-items:center; gap:8px;">
                    <div class="leaderboard-avatar" style="width: 32px; height: 32px; border-radius: 50%; background-color: var(--blue); border: 2px solid var(--white); display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; color: var(--white);">L</div>
                    <strong>Liam (Standard)</strong>
                  </div>
                  <span>420 pts</span>
                </li>
                <li class="leaderboard-item" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; font-size: 15px;">
                  <div style="display:flex; align-items:center; gap:8px;">
                    <div class="leaderboard-avatar" style="width: 32px; height: 32px; border-radius: 50%; background-color: var(--blue); border: 2px solid var(--white); display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; color: var(--white);">C</div>
                    <strong>Charlotte (Standard)</strong>
                  </div>
                  <span>380 pts</span>
                </li>
              </ul>
            </div>
            
            <button class="btn-action" id="quizActionBtn" style="width: 100%; font-size: 16px; margin-top: 15px; border: 3px solid var(--white); background-color: var(--navy); color: var(--white); font-family: 'Outfit', sans-serif; font-weight: bold; text-transform: uppercase; padding: 10px; cursor: pointer; transition: all 0.2s ease;">Next Question</button>
          </div>
        </div>
      </div>
      <script>
        (function() {
          const questions = [
            {
              q: "What is the primary topic of the Earthquakes informative text?",
              options: [
                "How plate tectonic movements build stress and release energy causing ground shaking.",
                "Detailing the engineering guidelines of earthquake-proof skyscrapers.",
                "Describing volcanic explosions along ocean trenches.",
                "Explaining how ocean waves are formed by weather shifts."
              ],
              correct: 0,
              explanation: "The text explains the scientific cause-and-effect chain: tectonic plate movements build tension, rocks slip, releasing energy as seismic waves (ground shaking)."
            },
            {
              q: "What force causes rough plate edges to stick together as they try to move?",
              options: [
                "Tension",
                "Friction",
                "Gravity",
                "Magnetism"
              ],
              correct: 1,
              explanation: "Paragraph 3 explicitly states they stick together because of 'friction, which is a force that resists movement.'"
            },
            {
              q: "How does the comparison table at the end of the text help the reader?",
              options: [
                "It lists spelling definitions for vocabulary notebooks.",
                "It maps the locations of past active fault zones.",
                "It summarizes and compares the three plate boundary movements and geological outcomes for easy scanning.",
                "It lists the names of researchers who study Earth sciences."
              ],
              correct: 2,
              explanation: "Tables serve as visual organizers, allowing the reader to compare boundary types, movements, and geological outcomes instantly without reading blocks of text."
            },
            {
              q: "Identify the Expanded Noun Group in: 'These giant puzzle pieces float on hot, melted rock.'",
              options: [
                "float on hot",
                "These giant puzzle pieces",
                "puzzle pieces float",
                "hot, melted rock"
              ],
              correct: 1,
              explanation: "'These giant puzzle pieces' is the subject noun group, expanded with adjectives ('giant', 'puzzle') to describe tectonic plates."
            },
            {
              q: "What is the scientific difference between the Focus and the Epicentre?",
              options: [
                "The Focus is the surface point, and the Epicentre is deep underground.",
                "The Focus is where shaking stops, and the Epicentre is where it starts.",
                "The Focus is deep underground where rocks first slip, and the Epicentre is directly above it on the surface.",
                "The Focus is the fault line, and the Epicentre is the magma layer."
              ],
              correct: 2,
              explanation: "The focus is the origin deep underground where rocks fracture. The epicentre is the surface point directly above it, experiencing the strongest shaking."
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
                handleSubmission(-1);
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
            } else {
              score = Math.max(0, score - 50);
              scoreDisp.innerText = String(score).padStart(4, '0');
              if (selectedIdx !== -1) {
                buttons[selectedIdx].classList.add('incorrect');
              }
              expTitle.innerText = selectedIdx === -1 ? "Time's Up! -50 Points" : "Incorrect! -50 Points";
              expTitle.style.color = 'var(--red)';
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
    
    <!-- Slide 7: Lucas Pathway: Structure Patrol (theme-light) -->
    <div class="slide theme-light lucas-only" id="slide7">
      <h2 class="slide-title">Lucas: Web Page Structure Patrol</h2>
      <div class="content fade-in-up delay-1">
        <p class="intro-text" style="font-size: 28px;">With your helper, click the correct parts of our website mockup!</p>
        
        <div class="lucas-stage" style="display: grid; grid-template-columns: 1.3fr 0.7fr; gap: 25px; margin-top: 15px;">
          <div class="website-mockup" id="lucasMockup" style="max-height: 400px; padding: 25px; background-color: var(--pure-white); border: 3px dashed var(--navy); border-radius: 8px; box-shadow: 6px 6px 0px rgba(17,45,78,0.1); position: relative;">
            <div class="mock-header" id="lucasTitle" style="font-size: 28px; font-weight: bold; background-color: #ffe0b2; margin-bottom: 20px; border: 2px solid var(--navy); border-radius: 6px; padding: 10px; text-align: center; cursor: pointer; transition: all 0.2s ease;">
              CAUSES OF EARTHQUAKES
            </div>
            
            <div class="mock-content-row" style="display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 15px;">
              <div class="mock-body-card" style="font-size: 18px; padding: 15px; background-color: #f8fafc; border: 2px solid var(--navy); border-radius: 6px; color: #475569;">
                <div id="lucasHeading" style="font-weight: bold; font-size: 20px; color: var(--orange); margin-bottom: 8px; border-bottom: 2px solid var(--orange); padding-bottom: 4px; cursor: pointer; text-align: center; transition: all 0.2s ease;">
                  01. PLATE BOUNDARY ZONES
                </div>
                Tectonic plates slide, bump, and pull apart from each other.
              </div>
              
              <div class="mock-image-container" id="lucasDiagram" style="height: 140px; background-color: #cbd5e1; border: 2px solid var(--navy); border-radius: 6px; display: flex; flex-direction: column; justify-content: center; align-items: center; cursor: pointer; transition: all 0.2s ease;">
                <span style="font-weight: bold; font-size: 18px; color: var(--navy);">Fault Line Diagram</span>
                <div class="mock-caption" id="lucasCaption" style="font-size: 12px; margin-top: 5px; cursor: pointer; border-bottom: 1px dotted var(--navy); padding-bottom: 2px;">Figure 1: Inside a Fault Zone</div>
              </div>
            </div>
          </div>
          
          <div class="lucas-coach-card" style="min-height: 250px; justify-content: center; align-items: center; text-align: center; background-color: var(--pure-white); border: 3px solid var(--navy); box-shadow: 6px 6px 0px rgba(17,45,78,0.1); border-radius: 8px; padding: 25px; display: flex; flex-direction: column;">
            <h3 class="info-title" id="lucasCoachTitle" style="border-bottom: none; font-size: 26px; font-weight: 700; color: var(--navy); margin-bottom: 12px; text-transform: uppercase;">Web Structure Patrol</h3>
            <div class="info-detail-box" id="lucasCoachDetail" style="font-size: 22px; margin-top: 10px;">
              Click the **Website Title**, the **Section Heading**, or the **Earthquake Diagram** to complete your checklist!
            </div>
          </div>
        </div>
      </div>
      <script>
        (function() {
          const title = document.getElementById('lucasTitle');
          const heading = document.getElementById('lucasHeading');
          const diag = document.getElementById('lucasDiagram');
          const coachTitle = document.getElementById('lucasCoachTitle');
          const coachDetail = document.getElementById('lucasCoachDetail');

          title.addEventListener('click', () => {
            title.classList.toggle('circled');
            if (title.classList.contains('circled')) {
              coachTitle.innerText = "⭐ Title Patrol Successful!";
              coachDetail.innerText = "Awesome! You found the main Website Title. It tells us the big topic in large letters!";
            }
          });

          heading.addEventListener('click', () => {
            heading.classList.toggle('circled');
            if (heading.classList.contains('circled')) {
              coachTitle.innerText = "⭐ Heading Patrol Successful!";
              coachDetail.innerText = "Excellent! You found the Section Heading. It tells us we are starting a new section!";
            }
          });

          diag.addEventListener('click', () => {
            diag.classList.toggle('circled');
            if (diag.classList.contains('circled')) {
              coachTitle.innerText = "⭐ Diagram Patrol Successful!";
              coachDetail.innerText = "Superb! You found the Fault Line Diagram. Pictures and drawings help us see how plates slide!";
            }
          });

          // Show Answer override listener
          document.getElementById('slide7').addEventListener('show-answer', () => {
            title.classList.add('circled');
            heading.classList.add('circled');
            diag.classList.add('circled');
            coachTitle.innerText = "⭐ Full Patrol Completed!";
            coachDetail.innerText = "Wonderful work! You found the Title, Heading, and Diagram! You are a master website structural detective!";
          });
        })();
      </script>
    </div>
  `;
  
  // Replace standard placeholder
  let finalContent = templateContent.replace('<!-- SLIDES GO HERE DURING DYNAMIC COMPILATION -->', slidesContent);
  
  // Update page title and add SEO metadata
  finalContent = finalContent.replace('<title>Classroom Presentation Template</title>', `
    <title>Lesson 25.2: Causes of Earthquakes & Assessment Preparation</title>
    <meta name="description" content="Interactive classroom slide presentation for Year 5 English Unit 2 Lesson 25.2 on Earthquakes.">
    <meta property="og:title" content="Lesson 25.2: Causes of Earthquakes & Assessment Preparation">
    <meta property="og:description" content="Interactive classroom slide presentation for Year 5 English Unit 2 Lesson 25.2 on Earthquakes.">
    <meta property="og:type" content="website">
  `);
  
  // Write compiled slides file
  fs.writeFileSync(outputPath, finalContent, 'utf8');
  console.log("🎉 Standalone Interactive Presentation compiled successfully!");
}

compile();
