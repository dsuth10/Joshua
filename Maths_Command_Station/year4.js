/**
 * Joshua Math Assessment Terminal - State & Logic Engine (Year 4)
 * Coordinates place value decimal shifter, alphanumeric grid routing, and symmetry mirror painting.
 */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. Core State Definition
    // ----------------------------------------------------
    const state = {
        activeStage: 'intro', // 'intro', '1', '2', '3', '4'
        stage2SubStation: 1,  // 1 to 4
        stage3SubStage: 1,    // 1 to 2
        
        // Stage 1: Fact Fluency recall facts
        recallQuestions: [],
        currentRecallIndex: 0,
        recallAnswers: [], // Stores user numeric inputs
        
        // Stage 2: Calibration Lab User Inputs
        calcChoice: '',          // MC choice ('+0.4', etc.)
        regEquivNum: null,       // Equiv tenths numerator (6)
        regEquivDecimal: null,   // Equiv decimal (0.6)
        regEquivPercentage: null, // Equiv percentage (60)
        numlineWhole: null,      // Mixed numeral whole (1)
        numlineNum: null,        // Mixed numeral numerator (3)
        numlineDen: null,        // Mixed numeral denominator (4)
        inverseEqVal2: null,     // Inverse value 2 (152)
        inverseEqAns: null,      // Inverse result (328)
        
        // Stage 3: Pathfinder & Symmetry
        schCol: '',
        schRow: '',
        pathCol: '',
        pathRow: '',
        
        symmetryWidth: 6,
        symmetryHeight: 6,
        preFilledCells: [
            { r: 1, c: 1 },
            { r: 3, c: 2 },
            { r: 5, c: 3 }
        ],
        studentCells: [] // Array of { r, c } selected by student
    };

    // Helper to shuffle arrays
    function shuffleArray(arr) {
        const copy = [...arr];
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    }

    // Generate Stage 1 questions (10 multiplication facts up to 10x10, 10 related division facts)
    function generateStage1Questions() {
        const list = [];
        
        // 10 Multiplication Facts up to 10x10
        const multPairs = [];
        for (let i = 2; i <= 10; i++) {
            for (let j = 2; j <= 10; j++) {
                multPairs.push({ a: i, b: j });
            }
        }
        const shuffledMult = shuffleArray(multPairs).slice(0, 10);
        shuffledMult.forEach(pair => {
            list.push({ eq: `${pair.a} × ${pair.b}`, ans: pair.a * pair.b });
        });

        // 10 Related Division Facts
        const divPairs = [];
        for (let i = 2; i <= 10; i++) {
            for (let j = 2; j <= 10; j++) {
                divPairs.push({ quotient: i, divisor: j, product: i * j });
            }
        }
        const shuffledDiv = shuffleArray(divPairs).slice(0, 10);
        shuffledDiv.forEach(pair => {
            list.push({ eq: `${pair.product} ÷ ${pair.divisor}`, ans: pair.quotient });
        });

        return shuffleArray(list);
    }

    state.recallQuestions = generateStage1Questions();

    // ----------------------------------------------------
    // 2. Audio Synthesizer (Web Audio API)
    // ----------------------------------------------------
    let audioCtx = null;

    function initAudio() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    function playSound(freq, duration, type = 'sine', volume = 0.1) {
        try {
            initAudio();
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            osc.type = type;
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            
            gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
            
            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch (e) {
            console.warn("Audio Context failed: ", e);
        }
    }

    const sounds = {
        click: () => playSound(550, 0.05, 'square', 0.04),
        successNode: () => {
            playSound(587.33, 0.1, 'sine', 0.08); // D5
            setTimeout(() => playSound(739.99, 0.1, 'sine', 0.08), 100); // F#5
            setTimeout(() => playSound(880.00, 0.15, 'sine', 0.08), 200); // A5
        },
        error: () => playSound(180, 0.25, 'sawtooth', 0.12),
        stageComplete: () => {
            playSound(440, 0.1, 'triangle', 0.1);
            setTimeout(() => playSound(554, 0.1, 'triangle', 0.1), 80);
            setTimeout(() => playSound(659, 0.1, 'triangle', 0.1), 160);
            setTimeout(() => playSound(880, 0.3, 'triangle', 0.1), 240);
        }
    };

    // ----------------------------------------------------
    // 3. Logger System
    // ----------------------------------------------------
    const logList = document.getElementById('log-list');

    function addLog(message, type = 'system') {
        const time = new Date().toLocaleTimeString('en-AU', { hour12: false });
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry ${type}`;
        logEntry.innerHTML = `
            <div class="log-time">${time}</div>
            <div>${message}</div>
        `;
        
        logList.insertBefore(logEntry, logList.firstChild);
        
        while (logList.children.length > 30) {
            logList.removeChild(logList.lastChild);
        }
    }

    // ----------------------------------------------------
    // 4. Progression State Controller
    // ----------------------------------------------------
    const stages = {
        intro: document.getElementById('stage-intro'),
        1: document.getElementById('stage-1'),
        2: document.getElementById('stage-2'),
        3: document.getElementById('stage-3'),
        4: document.getElementById('stage-4')
    };

    const trackers = {
        intro: document.getElementById('tracker-intro'),
        1: document.getElementById('tracker-stage-1'),
        2: document.getElementById('tracker-stage-2'),
        3: document.getElementById('tracker-stage-3'),
        4: document.getElementById('tracker-stage-4')
    };

    const viewTitle = document.getElementById('viewport-title');
    const viewCode = document.getElementById('viewport-code');
    const statusDot = document.getElementById('system-status-dot');
    const statusText = document.getElementById('system-status-text');

    function transitionToStage(stageKey) {
        sounds.click();
        
        // Deactivate current active stage element
        document.querySelectorAll('.stage-container').forEach(el => el.classList.remove('active'));
        
        // Activate target stage
        stages[stageKey].classList.add('active');
        state.activeStage = stageKey;
        
        // Update header trackers
        Object.keys(trackers).forEach(key => {
            trackers[key].classList.remove('active');
            if (key === stageKey) {
                trackers[key].classList.add('active');
            }
        });

        // Set status and viewport header labels
        statusDot.className = 'status-dot';
        if (stageKey === 'intro') {
            viewTitle.textContent = 'STATION_INITIALISATION';
            viewCode.textContent = '[INIT_SEQ]';
            trackers.intro.classList.add('active');
            addLog("System awaiting initialisation sequence.", "system");
        } else if (stageKey === '1') {
            viewTitle.textContent = 'PHASE_01: FACT_FLUENCY';
            viewCode.textContent = '[FACT_ENG_V4]';
            trackers.intro.classList.add('complete');
            addLog("Phase 1: Recalling multiplication and division facts up to 10 x 10.", "system");
            initStage1();
        } else if (stageKey === '2') {
            viewTitle.textContent = 'PHASE_02: CALIBRATION_LAB';
            viewCode.textContent = '[CAL_LAB_V4]';
            trackers['1'].classList.add('complete');
            addLog("Phase 2: Decimal shifting, fractions equivalence registers, and inverse algebraic calibration.", "system");
            initStage2();
        } else if (stageKey === '3') {
            viewTitle.textContent = 'PHASE_03: DISPATCH_GRID';
            viewCode.textContent = '[GRID_ROUTE_V4]';
            trackers['2'].classList.add('complete');
            addLog("Phase 3: Alphanumeric grid pathfinding and vertical symmetry painting board.", "system");
            initStage3();
        } else if (stageKey === '4') {
            viewTitle.textContent = 'DIAGNOSTICS_SUMMARY';
            viewCode.textContent = '[REPORT_Y4]';
            trackers['3'].classList.add('complete');
            addLog("Diagnostics complete. Year 4 scorecard compiled.", "success");
            compileReport();
        }
    }

    // ----------------------------------------------------
    // 5. Stage 1: Fact Recall Engine
    // ----------------------------------------------------
    const equationText = document.getElementById('equation-text');
    const equationInput = document.getElementById('equation-input');
    const equationProgress = document.getElementById('equation-progress');
    const equationCounter = document.getElementById('equation-counter');

    function initStage1() {
        state.currentRecallIndex = 0;
        state.recallAnswers = [];
        equationInput.value = '';
        renderRecallQuestion();
    }

    function renderRecallQuestion() {
        const currentQ = state.recallQuestions[state.currentRecallIndex];
        equationText.textContent = currentQ.eq;
        equationInput.value = '';
        
        // Progress UI
        const progressPercentage = (state.currentRecallIndex / state.recallQuestions.length) * 100;
        equationProgress.style.width = `${progressPercentage}%`;
        equationCounter.textContent = `QUESTION ${state.currentRecallIndex + 1} OF ${state.recallQuestions.length}`;
        
        addLog(`Calibrating Fact ${state.currentRecallIndex + 1}: ${currentQ.eq} = ?`, "input");
    }

    // Keypad and keyboard handling for Recall
    document.querySelectorAll('.num-key, .decimal-key').forEach(btn => {
        btn.addEventListener('click', (e) => {
            sounds.click();
            const val = e.target.getAttribute('data-val');
            if (equationInput.value.length < 5) {
                equationInput.value += val;
            }
        });
    });

    document.getElementById('key-clear').addEventListener('click', () => {
        sounds.click();
        equationInput.value = '';
    });

    document.getElementById('key-submit').addEventListener('click', submitRecallAnswer);

    // Keyboard bindings for numerical entry
    document.addEventListener('keydown', (e) => {
        if (state.activeStage !== '1') return;
        
        if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
            sounds.click();
            if (equationInput.value.length < 5) {
                equationInput.value += e.key;
            }
        } else if (e.key === 'Backspace' || e.key === 'Delete') {
            sounds.click();
            equationInput.value = '';
        } else if (e.key === 'Enter') {
            submitRecallAnswer();
        }
    });

    function submitRecallAnswer() {
        const val = equationInput.value;
        if (val === '') {
            sounds.error();
            addLog("Calibration error: Input required.", "error");
            return;
        }

        const numericAns = parseFloat(val);
        state.recallAnswers.push(numericAns);
        
        sounds.successNode();
        
        state.currentRecallIndex++;
        if (state.currentRecallIndex < state.recallQuestions.length) {
            renderRecallQuestion();
        } else {
            sounds.stageComplete();
            equationProgress.style.width = '100%';
            addLog("Recall sequence completed successfully.", "success");
            setTimeout(() => {
                transitionToStage('2');
            }, 800);
        }
    }

    // ----------------------------------------------------
    // 6. Stage 2: Place Value Laboratory
    // ----------------------------------------------------
    const btnPrevSubstation = document.getElementById('btn-prev-substation');
    const btnNextSubstation = document.getElementById('btn-next-substation');
    const labInstruction = document.getElementById('lab-instruction');
    
    const substations = {
        1: document.getElementById('station-2-1'),
        2: document.getElementById('station-2-2'),
        3: document.getElementById('station-2-3'),
        4: document.getElementById('station-2-4')
    };

    function initStage2() {
        state.stage2SubStation = 1;
        updateSubstationView();
    }

    function updateSubstationView() {
        // Toggle active substations
        Object.keys(substations).forEach(key => {
            substations[key].classList.remove('active');
            if (parseInt(key, 10) === state.stage2SubStation) {
                substations[key].classList.add('active');
            }
        });

        // Navigation state bounds
        btnPrevSubstation.disabled = (state.stage2SubStation === 1);
        if (state.stage2SubStation === 4) {
            btnNextSubstation.textContent = "CALIBRATE STAGE";
        } else {
            btnNextSubstation.textContent = "VERIFY & PROCEED";
        }

        // Custom logs and instructions for each substation
        if (state.stage2SubStation === 1) {
            labInstruction.textContent = "CALIBRATOR DIAGNOSTICS: Shift digits from 3.45 to 3.85.";
            addLog("Decimal Digit Shifter interface booted.", "system");
        } else if (state.stage2SubStation === 2) {
            labInstruction.textContent = "EQUIVALENCE REGISTER: Map fraction 3/5 to tenths, decimals and percentages.";
            addLog("Fraction Equivalence Register active.", "system");
        } else if (state.stage2SubStation === 3) {
            labInstruction.textContent = "MIXED NUMBER LINE: Calculate coordinates for the point marked on the number line.";
            addLog("Mixed Numeral Number Line active.", "system");
            renderAssessmentNumberLine();
        } else if (state.stage2SubStation === 4) {
            labInstruction.textContent = "INVERSE FACT FAMILIES: Solve the unknown (?) in the inverse equation.";
            addLog("Inverse Fact Family grid active.", "system");
        }
    }

    btnPrevSubstation.addEventListener('click', () => {
        if (state.stage2SubStation > 1) {
            state.stage2SubStation--;
            sounds.click();
            updateSubstationView();
        }
    });

    btnNextSubstation.addEventListener('click', () => {
        if (validateSubstation(state.stage2SubStation)) {
            if (state.stage2SubStation < 4) {
                state.stage2SubStation++;
                sounds.successNode();
                updateSubstationView();
            } else {
                sounds.stageComplete();
                addLog("Calibration Laboratory successfully calibrated.", "success");
                setTimeout(() => {
                    transitionToStage('3');
                }, 800);
            }
        } else {
            sounds.error();
            addLog("Diagnostics error: Incomplete calibration parameters.", "error");
        }
    });

    function validateSubstation(num) {
        if (num === 1) {
            const selectedOpt = document.querySelector('input[name="calc-choice"]:checked');
            if (!selectedOpt) return false;
            state.calcChoice = selectedOpt.value;
            return true;
        } else if (num === 2) {
            const equivNum = document.getElementById('reg-equiv-num').value.trim();
            const equivDecimal = document.getElementById('reg-equiv-decimal').value.trim();
            const equivPercentage = document.getElementById('reg-equiv-percentage').value.trim();
            
            if (equivNum === '' || equivDecimal === '' || equivPercentage === '') return false;
            state.regEquivNum = parseInt(equivNum, 10);
            state.regEquivDecimal = parseFloat(equivDecimal);
            state.regEquivPercentage = parseInt(equivPercentage, 10);
            return true;
        } else if (num === 3) {
            const whole = document.getElementById('numline-whole').value.trim();
            const numVal = document.getElementById('numline-num').value.trim();
            const denVal = document.getElementById('numline-den').value.trim();
            
            if (whole === '' || numVal === '' || denVal === '') return false;
            state.numlineWhole = parseInt(whole, 10);
            state.numlineNum = parseInt(numVal, 10);
            state.numlineDen = parseInt(denVal, 10);
            return true;
        } else if (num === 4) {
            const invVal2 = document.getElementById('inverse-eq-val2').value.trim();
            const invAns = document.getElementById('inverse-eq-ans').value.trim();
            
            if (invVal2 === '' || invAns === '') return false;
            state.inverseEqVal2 = parseInt(invVal2, 10);
            state.inverseEqAns = parseInt(invAns, 10);
            return true;
        }
        return false;
    }

    // Sub-station 1: Calculator controls
    const calcReadout = document.getElementById('calc-readout');
    let calcCurrentVal = 3.45;

    document.querySelectorAll('.calc-btn.op-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            sounds.click();
            const op = e.target.getAttribute('data-op');
            const floatOp = parseFloat(op);
            if (!isNaN(floatOp)) {
                calcCurrentVal = parseFloat((calcCurrentVal + floatOp).toFixed(2));
            }
            
            calcReadout.textContent = calcCurrentVal.toFixed(2);
            addLog(`Calibrator output adjusted to ${calcCurrentVal}`, "input");

            // Auto-check target 3.85
            if (calcCurrentVal === 3.85) {
                document.getElementById('calc-c2').checked = true;
                addLog("Calibrator calibrated to target 3.85! (Added 0.4)", "success");
                sounds.successNode();
            }
        });
    });

    document.getElementById('calc-reset').addEventListener('click', () => {
        sounds.click();
        calcCurrentVal = 3.45;
        calcReadout.textContent = '3.45';
        document.querySelectorAll('input[name="calc-choice"]').forEach(r => r.checked = false);
        addLog("Calibrator reset to default 3.45.", "system");
    });

    // Sub-station 3: Number Line rendering
    function renderAssessmentNumberLine() {
        const host = document.getElementById('mixed-line-svg-host');
        host.innerHTML = `
            <svg viewBox="0 0 320 80" style="width:100%; max-width:320px; height:auto;">
                <!-- Line -->
                <line x1="20" y1="40" x2="300" y2="40" stroke="var(--on-surface)" stroke-width="2" />
                
                <!-- Major Ticks -->
                <line x1="20" y1="30" x2="20" y2="50" stroke="var(--on-surface)" stroke-width="2" />
                <text x="20" y="65" font-family="var(--font-mono)" font-size="10" text-anchor="middle" fill="var(--on-surface)">0</text>
                
                <line x1="113.3" y1="30" x2="113.3" y2="50" stroke="var(--on-surface)" stroke-width="2" />
                <text x="113.3" y="65" font-family="var(--font-mono)" font-size="10" text-anchor="middle" fill="var(--on-surface)">1</text>
                
                <line x1="206.6" y1="30" x2="206.6" y2="50" stroke="var(--on-surface)" stroke-width="2" />
                <text x="206.6" y="65" font-family="var(--font-mono)" font-size="10" text-anchor="middle" fill="var(--on-surface)">2</text>
                
                <line x1="300" y1="30" x2="300" y2="50" stroke="var(--on-surface)" stroke-width="2" />
                <text x="300" y="65" font-family="var(--font-mono)" font-size="10" text-anchor="middle" fill="var(--on-surface)">3</text>
                
                <!-- Sub-ticks for quarters -->
                <!-- Between 0 and 1 -->
                <line x1="43.3" y1="35" x2="43.3" y2="45" stroke="var(--outline)" stroke-width="1" />
                <line x1="66.6" y1="35" x2="66.6" y2="45" stroke="var(--outline)" stroke-width="1" />
                <line x1="90" y1="35" x2="90" y2="45" stroke="var(--outline)" stroke-width="1" />
                
                <!-- Between 1 and 2 -->
                <line x1="136.6" y1="35" x2="136.6" y2="45" stroke="var(--outline)" stroke-width="1" />
                <line x1="160" y1="35" x2="160" y2="45" stroke="var(--outline)" stroke-width="1" />
                <line x1="183.3" y1="35" x2="183.3" y2="45" stroke="var(--outline)" stroke-width="1" />
                
                <!-- Between 2 and 3 -->
                <line x1="230" y1="35" x2="230" y2="45" stroke="var(--outline)" stroke-width="1" />
                <line x1="253.3" y1="35" x2="253.3" y2="45" stroke="var(--outline)" stroke-width="1" />
                <line x1="276.6" y1="35" x2="276.6" y2="45" stroke="var(--outline)" stroke-width="1" />
                
                <!-- Plot Target Point at 1 and 3/4 -->
                <!-- 113.3 + 3/4 * (206.6 - 113.3) = 113.3 + 0.75 * 93.3 = 113.3 + 70 = 183.3 -->
                <circle cx="183.3" cy="40" r="5.5" fill="var(--primary)" stroke="var(--surface)" stroke-width="1.5" />
                <circle cx="183.3" cy="40" r="9.5" fill="transparent" stroke="var(--primary)" stroke-width="0.75" class="pulse-ring" style="transform-origin: 183.3px 40px;" />
                <text x="183.3" y="24" font-family="var(--font-mono)" font-weight="700" font-size="10" text-anchor="middle" fill="var(--primary)">?</text>
            </svg>
        `;
    }

    // ----------------------------------------------------
    // 7. Stage 3: Pathfinder & Symmetry Board
    // ----------------------------------------------------
    const eggerlingSub1 = document.getElementById('eggerling-sub-1');
    const eggerlingSub2 = document.getElementById('eggerling-sub-2');
    const btnSubmitPathfinder = document.getElementById('btn-submit-pathfinder');
    const btnPrevEggerling = document.getElementById('btn-prev-eggerling');
    const btnSubmitSymmetry = document.getElementById('btn-submit-symmetry');

    function initStage3() {
        state.stage3SubStage = 1;
        updateEggerlingView();
    }

    function updateEggerlingView() {
        eggerlingSub1.classList.remove('active');
        eggerlingSub2.classList.remove('active');

        if (state.stage3SubStage === 1) {
            eggerlingSub1.classList.add('active');
            addLog("Pathfinder grid active. Select coordinate positions.", "system");
            renderPathfinderGrid();
        } else {
            eggerlingSub2.classList.add('active');
            addLog("Symmetry Painter active. Mirror the left grid cells.", "system");
            renderSymmetryBoard();
        }
    }

    // Alphanumeric Map Generation
    function renderPathfinderGrid() {
        const host = document.getElementById('alphanumeric-grid-host');
        
        let html = `<div class="alpha-grid-container" style="grid-template-columns: repeat(6, 40px); grid-template-rows: repeat(6, 40px);">`;
        
        // Column headers labels (Empty, A, B, C, D, E)
        html += `<div class="alpha-grid-cell label-cell"></div>`;
        ['A', 'B', 'C', 'D', 'E'].forEach(col => {
            html += `<div class="alpha-grid-cell label-cell">${col}</div>`;
        });

        // Rows (5 down to 1)
        for (let r = 5; r >= 1; r--) {
            html += `<div class="alpha-grid-cell label-cell">${r}</div>`;
            for (let c = 1; c <= 5; c++) {
                const colLetter = ['A', 'B', 'C', 'D', 'E'][c - 1];
                let content = '';
                
                // Plotted landmarks
                if (colLetter === 'C' && r === 3) content = '🏫'; // School
                if (colLetter === 'E' && r === 2) content = '🌳'; // Park
                if (colLetter === 'B' && r === 4) content = '📚'; // Library
                if (colLetter === 'A' && r === 1) content = '🚩'; // Start
                
                html += `<div class="alpha-grid-cell" id="cell-${colLetter}${r}">${content}</div>`;
            }
        }
        
        html += `</div>`;
        host.innerHTML = html;
        
        // Highlight logic on selection
        ['grid-sch-col', 'grid-sch-row', 'grid-path-col', 'grid-path-row'].forEach(id => {
            document.getElementById(id).addEventListener('change', () => {
                sounds.click();
                clearGridHighlights();
                highlightSelectedCells();
            });
        });
    }

    function clearGridHighlights() {
        document.querySelectorAll('.alpha-grid-cell').forEach(el => el.classList.remove('selected'));
    }

    function highlightSelectedCells() {
        const schCol = document.getElementById('grid-sch-col').value;
        const schRow = document.getElementById('grid-sch-row').value;
        const pathCol = document.getElementById('grid-path-col').value;
        const pathRow = document.getElementById('grid-path-row').value;

        if (schCol && schRow) {
            const cell = document.getElementById(`cell-${schCol}${schRow}`);
            if (cell) cell.classList.add('selected');
        }
        if (pathCol && pathRow) {
            const cell = document.getElementById(`cell-${pathCol}${pathRow}`);
            if (cell) cell.classList.add('selected');
        }
    }

    btnSubmitPathfinder.addEventListener('click', () => {
        const schCol = document.getElementById('grid-sch-col').value;
        const schRow = document.getElementById('grid-sch-row').value;
        const pathCol = document.getElementById('grid-path-col').value;
        const pathRow = document.getElementById('grid-path-row').value;

        if (!schCol || !schRow || !pathCol || !pathRow) {
            sounds.error();
            addLog("Pathfinder error: Coordinate parameters missing.", "error");
            return;
        }

        state.schCol = schCol;
        state.schRow = schRow;
        state.pathCol = pathCol;
        state.pathRow = pathRow;

        const isSchCorrect = (schCol === 'C' && schRow === '3');
        const isPathCorrect = (pathCol === 'C' && pathRow === '4');

        if (isSchCorrect && isPathCorrect) {
            sounds.successNode();
            addLog("Pathfinder verified successfully! Moving to Symmetry Painter.", "success");
            setTimeout(() => {
                state.stage3SubStage = 2;
                updateEggerlingView();
            }, 800);
        } else {
            sounds.error();
            addLog("Pathfinder error: Incorrect coordinate or path mapping.", "error");
        }
    });

    // Symmetry Painting Board
    function renderSymmetryBoard() {
        const grid = document.getElementById('symmetry-board-grid');
        grid.innerHTML = '';
        state.studentCells = [];

        // Vertical axis line element
        const axisLine = document.createElement('div');
        axisLine.className = 'symmetry-axis-line vertical';
        grid.appendChild(axisLine);

        for (let r = 1; r <= state.symmetryHeight; r++) {
            for (let c = 1; c <= state.symmetryWidth; c++) {
                const cell = document.createElement('div');
                cell.className = 'symmetry-cell';
                cell.dataset.r = r;
                cell.dataset.c = c;

                const isPre = state.preFilledCells.some(cellPos => cellPos.r === r && cellPos.c === c);
                if (isPre) {
                    cell.classList.add('pre-filled');
                }

                // Interactive clicking (only for right side columns 4, 5, 6)
                if (c > state.symmetryWidth / 2) {
                    cell.addEventListener('click', () => {
                        sounds.click();
                        const rVal = parseInt(cell.dataset.r, 10);
                        const cVal = parseInt(cell.dataset.c, 10);

                        cell.classList.toggle('active');
                        
                        const idx = state.studentCells.findIndex(pos => pos.r === rVal && pos.c === cVal);
                        if (idx !== -1) {
                            state.studentCells.splice(idx, 1);
                        } else {
                            state.studentCells.push({ r: rVal, c: cVal });
                        }
                    });
                }

                grid.appendChild(cell);
            }
        }
    }

    btnPrevEggerling.addEventListener('click', () => {
        state.stage3SubStage = 1;
        sounds.click();
        updateEggerlingView();
    });

    btnSubmitSymmetry.addEventListener('click', () => {
        // Calculate correct reflected coordinates
        // Left side cells: (1,1), (3,2), (5,3)
        // Reflected coordinates: (1,6), (3,5), (5,4)
        const expected = [
            { r: 1, c: 6 },
            { r: 3, c: 5 },
            { r: 5, c: 4 }
        ];

        let isCorrect = (state.studentCells.length === expected.length);
        if (isCorrect) {
            expected.forEach(exp => {
                const matched = state.studentCells.some(cell => cell.r === exp.r && cell.c === exp.c);
                if (!matched) isCorrect = false;
            });
        }

        if (isCorrect) {
            sounds.stageComplete();
            addLog("Symmetry painting verified. All components calibrated.", "success");
            setTimeout(() => {
                transitionToStage('4');
            }, 800);
        } else {
            sounds.error();
            addLog("Symmetry deviation detected: Check mirror placements.", "error");
            
            // Flash wrong blocks
            document.querySelectorAll('.symmetry-cell.active').forEach(cell => {
                const r = parseInt(cell.dataset.r, 10);
                const c = parseInt(cell.dataset.c, 10);
                const isExpected = expected.some(exp => exp.r === r && exp.c === c);
                if (!isExpected) {
                    cell.classList.add('error-state');
                    setTimeout(() => cell.classList.remove('error-state'), 1200);
                }
            });
        }
    });

    // ----------------------------------------------------
    // 8. Stage 4: Diagnostics & Auto Grading (27 Marks)
    // ----------------------------------------------------
    const reportScore = document.getElementById('report-score');
    const reportTableBody = document.getElementById('report-table-body');
    const reportFeedback = document.getElementById('report-feedback');
    const btnResetApp = document.getElementById('btn-reset-app');

    function compileReport() {
        const grading = [];
        let totalScore = 0;
        let maxScore = 0;

        // 1. Fact Recall (20 Marks)
        let recallCorrectCount = 0;
        for (let i = 0; i < state.recallQuestions.length; i++) {
            if (state.recallAnswers[i] === state.recallQuestions[i].ans) {
                recallCorrectCount++;
            }
        }
        totalScore += recallCorrectCount;
        maxScore += 20;
        grading.push({
            test: "PART_A: FACT_FLUENCY",
            concept: "Recall multiplication and division facts up to 10 x 10",
            status: `${recallCorrectCount} / 20 Correct`,
            score: `${recallCorrectCount} / 20`
        });

        // 2. Decimal Digit Shifter (1 Mark)
        let calcScore = 0;
        let calcStatus = "Incorrect";
        if (state.calcChoice === '+0.4') {
            calcScore += 1;
            calcStatus = "Calibrated";
        }
        totalScore += calcScore;
        maxScore += 1;
        grading.push({
            test: "PART_B: DECIMAL_SHIFTER",
            concept: "Shift digits across place value columns",
            status: calcStatus,
            score: `${calcScore} / 1`
        });

        // 3. Fraction-Decimal Equivalence Register (3 Marks)
        let equivScore = 0;
        if (state.regEquivNum === 6) equivScore += 1;
        if (state.regEquivDecimal === 0.6) equivScore += 1;
        if (state.regEquivPercentage === 60) equivScore += 1;

        totalScore += equivScore;
        maxScore += 3;
        grading.push({
            test: "PART_B: EQUIVALENCE_REGISTER",
            concept: "Convert fractions to equivalent tenths, decimals & percentages",
            status: `${equivScore} / 3 Registered`,
            score: `${equivScore} / 3`
        });

        // 4. Mixed Numeral Number Line (2 Marks)
        let numlineScore = 0;
        // Point is 1 and 3/4
        if (state.numlineWhole === 1) numlineScore += 1;
        if (state.numlineNum === 3 && state.numlineDen === 4) numlineScore += 1;

        totalScore += numlineScore;
        maxScore += 2;
        grading.push({
            test: "PART_B: NUMBER_LINE_FINDER",
            concept: "Represent and locate mixed numerals on a number line",
            status: `${numlineScore} / 2 Located`,
            score: `${numlineScore} / 2`
        });

        // 5. Inverse Fact Family (2 Marks)
        let inverseScore = 0;
        if (state.inverseEqVal2 === 152) inverseScore += 1;
        if (state.inverseEqAns === 328) inverseScore += 1;

        totalScore += inverseScore;
        maxScore += 2;
        grading.push({
            test: "PART_B: INVERSE_CALIBRATOR",
            concept: "Find unknown values in equations using inverse properties",
            status: `${inverseScore} / 2 Calibrated`,
            score: `${inverseScore} / 2`
        });

        // 6. Pathfinder Alphanumeric Grid (2 Marks)
        let pathfinderScore = 0;
        if (state.schCol === 'C' && state.schRow === '3') pathfinderScore += 1;
        if (state.pathCol === 'C' && state.pathRow === '4') pathfinderScore += 1;

        totalScore += pathfinderScore;
        maxScore += 2;
        grading.push({
            test: "PART_C: GRID_PATHFINDER",
            concept: "Read grid references and trace directional pathways",
            status: `${pathfinderScore} / 2 Mapped`,
            score: `${pathfinderScore} / 2`
        });

        // 7. Symmetry Paint Canvas (2 Marks)
        // Checking for exactly matching studentCells
        let symmetryScore = 0;
        const expected = [
            { r: 1, c: 6 },
            { r: 3, c: 5 },
            { r: 5, c: 4 }
        ];
        let correctCount = 0;
        expected.forEach(exp => {
            if (state.studentCells.some(cell => cell.r === exp.r && cell.c === exp.c)) {
                correctCount++;
            }
        });
        const extraCount = state.studentCells.length - correctCount;
        
        if (correctCount === 3 && extraCount === 0) {
            symmetryScore = 2;
        } else if (correctCount > 0 && extraCount === 0) {
            symmetryScore = 1;
        }

        totalScore += symmetryScore;
        maxScore += 2;
        grading.push({
            test: "PART_C: SYMMETRICAL_PAINT",
            concept: "Create symmetrical patterns across a vertical axis",
            status: `${symmetryScore} / 2 Mirrored`,
            score: `${symmetryScore} / 2`
        });

        // Render report Score
        reportScore.textContent = `${totalScore} / ${maxScore}`;
        reportTableBody.innerHTML = '';
        grading.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="padding:10px 8px; border-bottom:1px solid var(--outline-variant); font-weight:600;">${row.test}</td>
                <td style="padding:10px 8px; border-bottom:1px solid var(--outline-variant); color:var(--outline); font-size:0.75rem;">${row.concept}</td>
                <td style="padding:10px 8px; border-bottom:1px solid var(--outline-variant); color: ${row.score.startsWith('0') ? 'var(--error)' : 'var(--primary)'}">${row.status}</td>
                <td style="padding:10px 8px; border-bottom:1px solid var(--outline-variant); font-weight:700;">${row.score}</td>
            `;
            reportTableBody.appendChild(tr);
        });

        // Save totalScore to persistent profile if higher or for stats
        const storedProfile = localStorage.getItem('joshua_math_profile');
        if (storedProfile) {
            try {
                const parsed = JSON.parse(storedProfile);
                parsed.score = (parsed.score || 0) + totalScore * 10; // scale assessment score
                
                if (!parsed.scoresByCatY4) {
                    parsed.scoresByCatY4 = { number: 0, algebra: 0, measurement: 0, space: 0, statistics: 0, probability: 0 };
                }
                
                // Add points into categories
                parsed.scoresByCatY4.number = (parsed.scoresByCatY4.number || 0) + recallCorrectCount * 2 + calcScore * 10 + equivScore * 5 + numlineScore * 10;
                parsed.scoresByCatY4.algebra = (parsed.scoresByCatY4.algebra || 0) + inverseScore * 15;
                parsed.scoresByCatY4.space = (parsed.scoresByCatY4.space || 0) + pathfinderScore * 10 + symmetryScore * 10;

                localStorage.setItem('joshua_math_profile', JSON.stringify(parsed));
            } catch(e) {}
        }

        // Generate teacher feedback
        let feedback = '';
        if (totalScore === maxScore) {
            feedback = "EXCELLENT PERFORMANCE: All diagnostic core modules are fully functional. The student demonstrates comprehensive mastery of Year 4 mathematics standards, including rapid multiplication/division recall, decimal place value shifts, equivalent fractions, and vertical symmetry mirroring.";
        } else {
            feedback = "DIAGNOSTICS ADVISORY: System calibration has detected target gaps. ";
            const gaps = [];
            if (recallCorrectCount < 16) {
                gaps.push("remediate multiplication and division recall speed (Part A)");
            }
            if (calcScore < 1 || equivScore < 3 || numlineScore < 2 || inverseScore < 2) {
                gaps.push("reinforce decimal place value structures, equivalent percentages/fractions, and mixed numeral location (Part B)");
            }
            if (pathfinderScore < 2 || symmetryScore < 2) {
                gaps.push("practise alphanumeric coordinate grid routing and shape symmetry mirroring (Part C)");
            }
            feedback += "Suggested remediation: " + gaps.join(', ') + ".";
        }
        reportFeedback.textContent = feedback;
    }

    btnResetApp.addEventListener('click', () => {
        // Reset state
        state.calcChoice = '';
        state.regEquivNum = null;
        state.regEquivDecimal = null;
        state.regEquivPercentage = null;
        state.numlineWhole = null;
        state.numlineNum = null;
        state.numlineDen = null;
        state.inverseEqVal2 = null;
        state.inverseEqAns = null;
        state.schCol = '';
        state.schRow = '';
        state.pathCol = '';
        state.pathRow = '';
        state.studentCells = [];

        // Reset inputs
        document.querySelectorAll('input[type="number"]').forEach(el => el.value = '');
        document.querySelectorAll('input[type="text"]').forEach(el => el.value = '');
        document.querySelectorAll('select').forEach(el => el.value = '');
        document.querySelectorAll('input[type="radio"]').forEach(el => el.checked = false);

        calcCurrentVal = 3.45;
        calcReadout.textContent = '3.45';

        // Regenerate questions for stage 1
        state.recallQuestions = generateStage1Questions();

        document.querySelectorAll('.tracker-node').forEach(node => {
            node.classList.remove('complete');
            node.classList.remove('active');
        });

        transitionToStage('intro');
    });

    // Start assessment
    document.getElementById('btn-start-assessment').addEventListener('click', () => {
        transitionToStage('1');
    });

    // Initialise intro view
    transitionToStage('intro');
});
