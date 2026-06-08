/**
 * Luminous Math Assessment Terminal - State & Logic Engine (Year 5)
 * Coordinates 10x10 grid dispatch, decimal expander folding joints, and diagnostics scoring.
 */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. Core State Definition
    // ----------------------------------------------------
    const state = {
        activeStage: 'intro', // 'intro', '1', '2', '3', '4'
        stage2SubStation: 1,  // 1 to 4
        stage3SubStage: 1,    // 1 to 2
        
        // Stage 1: Fact Fluency questions generated dynamically
        recallQuestions: [],
        currentRecallIndex: 0,
        recallAnswers: [], // Stores user numeric/decimal inputs
        
        // Stage 2: Calibration Lab User Inputs
        calcChoice: '',       // MC choice ('+0.01', '+0.1', etc.)
        calcExplanation: '',  // explanation textarea
        expanderTenths: null,  // user inputs for expander
        expanderHundredths: null,
        expanderThousandths: null,
        regDecimal: null,      // register decimal (0.75)
        regFraction: '',      // register fraction ("3/4")
        divPair1: null,       // factor pair first
        divPair2: null,       // factor pair second
        divYesNo: '',         // divisibility choice ("yes", "no")
        divExplanation: '',   // divisibility textarea
        
        // Stage 3: Cargo & Coordinates
        cargoWeight: null,     // user cargo weight (2.35)
        cargoWorking: '',     // cargo explanation textarea
        waypoints: {
            A: { x: 2, y: 3 },
            B: { x: 8, y: 5 },
            C: { x: 5, y: 9 }
        },
        studentWps: {
            A: { x: null, y: null },
            B: { x: null, y: null },
            C: { x: null, y: null }
        },
        routeDistance: null    // user route distance input
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

    // Generate Stage 1 questions (10 mult, 5 div, 5 dec arithmetic)
    function generateStage1Questions() {
        const list = [];
        // 10 Multiplication Facts (e.g. 5x6 up to 12x12)
        for (let i = 0; i < 10; i++) {
            const a = Math.floor(Math.random() * 8) + 5;  // 5 to 12
            const b = Math.floor(Math.random() * 10) + 3; // 3 to 12
            list.push({ eq: `${a} × ${b}`, ans: a * b });
        }
        // 5 Division Facts
        for (let i = 0; i < 5; i++) {
            const div = Math.floor(Math.random() * 7) + 5; // divisor: 5 to 11
            const ans = Math.floor(Math.random() * 8) + 4; // quotient: 4 to 11
            list.push({ eq: `${div * ans} ÷ ${div}`, ans: ans });
        }
        // 5 Decimal Addition/Subtraction to hundredths
        const decimals = [
            { eq: '12.5 - 4.25', ans: 8.25 },
            { eq: '4.75 + 1.5', ans: 6.25 },
            { eq: '8.5 - 3.25', ans: 5.25 },
            { eq: '1.25 + 2.5', ans: 3.75 },
            { eq: '0.65 + 0.35', ans: 1.0 },
            { eq: '9.8 - 4.55', ans: 5.25 },
            { eq: '3.75 + 2.25', ans: 6.0 },
            { eq: '15.5 - 6.75', ans: 8.75 }
        ];
        const shuffledDecs = shuffleArray(decimals).slice(0, 5);
        shuffledDecs.forEach(item => {
            list.push(item);
        });
        return list;
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
        click: () => playSound(600, 0.05, 'square', 0.05),
        successNode: () => {
            playSound(523.25, 0.1, 'sine', 0.1); // C5
            setTimeout(() => playSound(659.25, 0.1, 'sine', 0.1), 100); // E5
            setTimeout(() => playSound(783.99, 0.15, 'sine', 0.1), 200); // G5
        },
        error: () => playSound(150, 0.3, 'sawtooth', 0.15),
        stageComplete: () => {
            playSound(440, 0.1, 'triangle', 0.1);
            setTimeout(() => playSound(554, 0.1, 'triangle', 0.1), 80);
            setTimeout(() => playSound(659, 0.1, 'triangle', 0.1), 160);
            setTimeout(() => playSound(880, 0.3, 'triangle', 0.1), 240);
        },
        engineHum: () => {
            playSound(100, 0.5, 'sine', 0.2);
            setTimeout(() => playSound(200, 0.3, 'sine', 0.1), 150);
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
            viewCode.textContent = '[FACT_ENG_V5]';
            trackers.intro.classList.add('complete');
            addLog("Phase 1: Recalling multiplication, division, and decimal arithmetic facts.", "system");
            initStage1();
        } else if (stageKey === '2') {
            viewTitle.textContent = 'PHASE_02: CALIBRATION_LAB';
            viewCode.textContent = '[CAL_LAB_V5]';
            trackers['1'].classList.add('complete');
            addLog("Phase 2: Decimal place value, percentages, and divisibility laboratory.", "system");
            initStage2();
        } else if (stageKey === '3') {
            viewTitle.textContent = 'PHASE_03: DISPATCH_GRID';
            viewCode.textContent = '[GRID_ROUTE_V5]';
            trackers['2'].classList.add('complete');
            addLog("Phase 3: Cargo partitioning and 10x10 coordinate grid routing.", "system");
            initStage3();
        } else if (stageKey === '4') {
            viewTitle.textContent = 'DIAGNOSTICS_SUMMARY';
            viewCode.textContent = '[REPORT_Y5]';
            trackers['3'].classList.add('complete');
            addLog("Diagnostics complete. Year 5 scorecard compiled.", "success");
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
            // Allow decimals and digits up to 5 chars
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
    
    // Sub-station structures
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
            labInstruction.textContent = "CALIBRATOR DIAGNOSTICS: Run calculations to shift 68.91 to 69.01.";
            addLog("Calibrator Shifter interface booted.", "system");
        } else if (state.stage2SubStation === 2) {
            labInstruction.textContent = "DECIMAL EXPANDER: Collapse place value joints for decimal number 9.524.";
            addLog("Decimal Expander 9.524 active.", "system");
            updateExpanderVisuals();
        } else if (state.stage2SubStation === 3) {
            labInstruction.textContent = "PERCENTAGE CONVERTER: Complete equivalence register for 75%.";
            addLog("Percentage Equivalence Register active.", "system");
        } else if (state.stage2SubStation === 4) {
            labInstruction.textContent = "FACTOR DIAGNOSTICS: List divisibility pair for 48 and check rules.";
            addLog("Divisibility Diagnostics active.", "system");
        }
    }

    // Sub-navigation handlers
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

    function parseFractionRatio(str) {
        const parts = str.trim().split('/');
        if (parts.length === 2) {
            const num = parseInt(parts[0], 10);
            const den = parseInt(parts[1], 10);
            if (!isNaN(num) && !isNaN(den) && den !== 0) {
                return num / den;
            }
        }
        return null;
    }

    function validateSubstation(num) {
        if (num === 1) {
            const selectedOpt = document.querySelector('input[name="calc-choice"]:checked');
            const explanation = document.getElementById('calc-explanation').value.trim();
            if (!selectedOpt) return false;
            state.calcChoice = selectedOpt.value;
            state.calcExplanation = explanation;
            return true;
        } else if (num === 2) {
            const tenthsVal = document.getElementById('exp-9524-tenths').value.trim();
            const hundredthsVal = document.getElementById('exp-9524-hundreds').value.trim();
            const thousandthsVal = document.getElementById('exp-9524-thousandths').value.trim();
            if (tenthsVal === '' || hundredthsVal === '' || thousandthsVal === '') return false;
            state.expanderTenths = parseInt(tenthsVal, 10);
            state.expanderHundredths = parseInt(hundredthsVal, 10);
            state.expanderThousandths = parseInt(thousandthsVal, 10);
            return true;
        } else if (num === 3) {
            const decVal = document.getElementById('reg-decimal').value.trim();
            const fracVal = document.getElementById('reg-fraction').value.trim();
            if (decVal === '' || fracVal === '') return false;
            state.regDecimal = parseFloat(decVal);
            state.regFraction = fracVal;
            return true;
        } else if (num === 4) {
            const p1 = document.getElementById('div-pair-1').value.trim();
            const p2 = document.getElementById('div-pair-2').value.trim();
            const divCheck = document.querySelector('input[name="div-48-yesno"]:checked');
            const explanation = document.getElementById('div-explanation').value.trim();
            
            if (p1 === '' || p2 === '' || !divCheck) return false;
            state.divPair1 = parseInt(p1, 10);
            state.divPair2 = parseInt(p2, 10);
            state.divYesNo = divCheck.value;
            state.divExplanation = explanation;
            return true;
        }
        return false;
    }

    // Sub-station 1: Calculator controls
    const calcReadout = document.getElementById('calc-readout');
    let calcCurrentVal = 68.91;

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

            // Automatically check matching option when target reached
            if (calcCurrentVal === 69.01) {
                document.getElementById('calc-c2').checked = true;
                addLog("Calibrator calibrated to target value 69.01! Please write explanation.", "success");
                sounds.successNode();
            }
        });
    });

    document.getElementById('calc-reset').addEventListener('click', () => {
        sounds.click();
        calcCurrentVal = 68.91;
        calcReadout.textContent = '68.91';
        addLog("Calibrator reset to default 68.91.", "system");
    });

    // Sub-station 2: Accordion Decimal Expander 9.524
    const blockO = document.getElementById('block-ones');
    const blockT = document.getElementById('block-tenths');
    const blockH = document.getElementById('block-hundreds');
    
    const numO = document.getElementById('num-exp-o');
    const numT = document.getElementById('num-exp-t');
    const numH = document.getElementById('num-exp-h');
    const numTh = document.getElementById('num-exp-th');

    document.getElementById('joint-o').addEventListener('click', () => {
        sounds.click();
        blockO.classList.toggle('collapsed');
        updateExpanderVisuals();
    });

    document.getElementById('joint-t').addEventListener('click', () => {
        sounds.click();
        blockT.classList.toggle('collapsed');
        updateExpanderVisuals();
    });

    document.getElementById('joint-h').addEventListener('click', () => {
        sounds.click();
        blockH.classList.toggle('collapsed');
        updateExpanderVisuals();
    });

    function updateExpanderVisuals() {
        const oCollapsed = blockO.classList.contains('collapsed');
        const tCollapsed = blockT.classList.contains('collapsed');
        const hCollapsed = blockH.classList.contains('collapsed');

        // Reset visibility & defaults
        numO.style.display = 'block';
        numT.style.display = 'block';
        numH.style.display = 'block';
        numTh.style.display = 'block';

        numO.textContent = "9";
        numT.textContent = "5";
        numH.textContent = "2";
        numTh.textContent = "4";

        if (oCollapsed) {
            numO.style.display = 'none';
            numT.textContent = "95";
        }
        
        if (tCollapsed) {
            numT.style.display = 'none';
            const currentT = oCollapsed ? 95 : 5;
            numH.textContent = (currentT * 10 + 2).toString();
        }
        
        if (hCollapsed) {
            numH.style.display = 'none';
            const currentH = tCollapsed ? (oCollapsed ? 952 : 52) : 2;
            numTh.textContent = (currentH * 10 + 4).toString();
        }

        // Logs for visual representation
        if (oCollapsed && tCollapsed && hCollapsed) {
            addLog("Expander collapsed completely: 9524 thousandths.", "system");
        } else if (oCollapsed && tCollapsed) {
            addLog("Ones and Tenths folded: 952 hundredths, 4 thousandths.", "system");
        } else if (oCollapsed) {
            addLog("Ones folded: 95 tenths, 2 hundredths, 4 thousandths.", "system");
        } else {
            addLog("Expander fully expanded: 9 ones, 5 tenths, 2 hundredths, 4 thousandths.", "system");
        }
    }

    // ----------------------------------------------------
    // 7. Stage 3: Cargo & Coordinates Dispatch
    // ----------------------------------------------------
    const eggerlingSub1 = document.getElementById('eggerling-sub-1');
    const eggerlingSub2 = document.getElementById('eggerling-sub-2');
    const btnSubmitCargo = document.getElementById('btn-submit-cargo');
    const btnPrevEggerling = document.getElementById('btn-prev-eggerling');
    const btnSubmitDelivery = document.getElementById('btn-submit-delivery');
    const assessmentGridHost = document.getElementById('assessment-grid-host');

    let activeWpFocus = 'A';

    function initStage3() {
        state.stage3SubStage = 1;
        updateEggerlingView();
    }

    function updateEggerlingView() {
        eggerlingSub1.classList.remove('active');
        eggerlingSub2.classList.remove('active');

        if (state.stage3SubStage === 1) {
            eggerlingSub1.classList.add('active');
            addLog("Cargo Partitioning active. Awaiting weight divisions.", "system");
        } else {
            eggerlingSub2.classList.add('active');
            addLog("Dispatch Coordinates active. Awaiting waypoint plots.", "system");
            activeWpFocus = 'A';
            updateWpFocus();
            renderAssessmentGrid();
        }
    }

    // Sub-stage 1: Cargo Partitioning
    btnSubmitCargo.addEventListener('click', () => {
        const inputVal = document.getElementById('cargo-weight-input').value.trim();
        const working = document.getElementById('cargo-working').value.trim();
        
        if (inputVal === '') {
            sounds.error();
            addLog("Dispatch error: Cargo weight parameter required.", "error");
            return;
        }

        const cargoW = parseFloat(inputVal);
        state.cargoWeight = cargoW;
        state.cargoWorking = working;

        if (cargoW === 2.35) {
            sounds.successNode();
            addLog("Cargo verified successfully: 2.35 tonnes per container.", "success");
            
            // Loader animations
            const boxes = document.querySelectorAll('#cargo-boxes-group rect');
            boxes.forEach((box, idx) => {
                setTimeout(() => {
                    box.setAttribute('fill', 'var(--primary)');
                    box.setAttribute('stroke', 'var(--primary)');
                    playSound(523 + idx * 40, 0.08, 'sine', 0.05);
                }, idx * 80);
            });
            document.getElementById('cargo-status-text').textContent = "LOADED: 2.35 t / BOX";
            
            setTimeout(() => {
                state.stage3SubStage = 2;
                updateEggerlingView();
            }, 1200);
        } else {
            sounds.error();
            addLog("Calibration deviation: Cargo division incorrect.", "error");
        }
    });

    // Sub-stage 2: Coordinates and Grid
    function renderAssessmentGrid() {
        assessmentGridHost.innerHTML = makeAssessmentGridSvg();
        attachGridListeners();
    }

    function updateWpFocus() {
        ['A', 'B', 'C'].forEach(wp => {
            const row = document.getElementById(`wp-row-${wp.toLowerCase()}`);
            if (row) {
                if (wp === activeWpFocus) {
                    row.style.backgroundColor = 'var(--on-primary-container)';
                    row.style.borderColor = 'var(--primary)';
                    row.style.borderWidth = '1px';
                    row.style.borderStyle = 'solid';
                    row.style.borderRadius = 'var(--radius-default)';
                    row.style.padding = '4px 8px';
                } else {
                    row.style.backgroundColor = 'transparent';
                    row.style.borderColor = 'transparent';
                    row.style.padding = '4px 8px';
                }
            }
        });
    }

    ['A', 'B', 'C'].forEach(wp => {
        const row = document.getElementById(`wp-row-${wp.toLowerCase()}`);
        if (row) {
            row.addEventListener('click', () => {
                sounds.click();
                activeWpFocus = wp;
                updateWpFocus();
            });
        }
    });

    function attachGridListeners() {
        assessmentGridHost.querySelectorAll('.coord-cell').forEach(cell => {
            cell.addEventListener('click', (e) => {
                const x = parseInt(e.currentTarget.getAttribute('data-x'), 10);
                const y = parseInt(e.currentTarget.getAttribute('data-y'), 10);
                
                sounds.click();
                document.getElementById(`waypoint-${activeWpFocus.toLowerCase()}-x`).value = x;
                document.getElementById(`waypoint-${activeWpFocus.toLowerCase()}-y`).value = y;

                state.studentWps[activeWpFocus].x = x;
                state.studentWps[activeWpFocus].y = y;

                addLog(`Registered Point ${activeWpFocus} coordinates to (${x}, ${y})`, "input");

                // Auto-advance focus
                if (activeWpFocus === 'A') activeWpFocus = 'B';
                else if (activeWpFocus === 'B') activeWpFocus = 'C';
                else activeWpFocus = 'A';

                updateWpFocus();
                renderAssessmentGrid();
            });
        });
    }

    function makeAssessmentGridSvg() {
        let svg = `<svg viewBox="0 0 300 300" style="width:100%; height:100%; max-width:280px; aspect-ratio:1;">`;
        
        svg += `
        <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--on-surface)" />
            </marker>
        </defs>
        `;

        // Grid lines (0 to 10)
        for (let i = 0; i <= 10; i++) {
            const x = 30 + i * 24;
            const y = 270 - i * 24;
            svg += `<line x1="${x}" y1="30" x2="${x}" y2="270" class="coord-gridline" />`;
            svg += `<line x1="30" y1="${y}" x2="270" y2="${y}" class="coord-gridline" />`;
            svg += `<text x="${x}" y="285" class="coord-label">${i}</text>`;
            svg += `<text x="15" y="${y}" class="coord-label coord-label-y">${i}</text>`;
        }

        // Axes
        svg += `<line x1="30" y1="270" x2="280" y2="270" class="coord-axis" marker-end="url(#arrow)" />`;
        svg += `<line x1="30" y1="270" x2="30" y2="20" class="coord-axis" marker-end="url(#arrow)" />`;
        
        svg += `<text x="285" y="280" class="coord-label" style="font-weight:700;">x</text>`;
        svg += `<text x="35" y="15" class="coord-label" style="font-weight:700;">y</text>`;

        // Clickable cells overlay
        for (let x = 0; x <= 10; x++) {
            for (let y = 0; y <= 10; y++) {
                const cx = 30 + x * 24;
                const cy = 270 - y * 24;
                svg += `<circle cx="${cx}" cy="${cy}" r="10" class="coord-cell" data-x="${x}" data-y="${y}" />`;
            }
        }

        // Plot True Target Waypoints
        const wpList = [
            { label: 'A', pt: state.waypoints.A, color: 'var(--primary)' },
            { label: 'B', pt: state.waypoints.B, color: 'var(--secondary)' },
            { label: 'C', pt: state.waypoints.C, color: 'var(--tertiary)' }
        ];

        wpList.forEach(wp => {
            const cx = 30 + wp.pt.x * 24;
            const cy = 270 - wp.pt.y * 24;
            svg += `<circle cx="${cx}" cy="${cy}" r="5.5" fill="${wp.color}" stroke="var(--surface)" stroke-width="1.5" />`;
            svg += `<text x="${cx + 6}" y="${cy - 6}" class="coord-waypoint-label" style="fill:var(--on-surface); font-weight:bold;">${wp.label}</text>`;
        });

        // Trace student inputs
        const sA = state.studentWps.A;
        const sB = state.studentWps.B;
        const sC = state.studentWps.C;

        if (sA.x !== null && sA.y !== null) {
            const cx = 30 + sA.x * 24;
            const cy = 270 - sA.y * 24;
            svg += `<circle cx="${cx}" cy="${cy}" r="3.5" fill="var(--primary)" stroke="var(--on-surface)" stroke-width="1" />`;
        }
        if (sB.x !== null && sB.y !== null) {
            const cx = 30 + sB.x * 24;
            const cy = 270 - sB.y * 24;
            svg += `<circle cx="${cx}" cy="${cy}" r="3.5" fill="var(--secondary)" stroke="var(--on-surface)" stroke-width="1" />`;
        }
        if (sC.x !== null && sC.y !== null) {
            const cx = 30 + sC.x * 24;
            const cy = 270 - sC.y * 24;
            svg += `<circle cx="${cx}" cy="${cy}" r="3.5" fill="var(--tertiary)" stroke="var(--on-surface)" stroke-width="1" />`;
        }

        svg += `</svg>`;
        return svg;
    }

    btnPrevEggerling.addEventListener('click', () => {
        state.stage3SubStage = 1;
        sounds.click();
        updateEggerlingView();
    });

    btnSubmitDelivery.addEventListener('click', () => {
        const distVal = document.getElementById('route-distance-input').value.trim();
        
        const saX = parseInt(document.getElementById('waypoint-a-x').value, 10);
        const saY = parseInt(document.getElementById('waypoint-a-y').value, 10);
        const sbX = parseInt(document.getElementById('waypoint-b-x').value, 10);
        const sbY = parseInt(document.getElementById('waypoint-b-y').value, 10);
        const scX = parseInt(document.getElementById('waypoint-c-x').value, 10);
        const scY = parseInt(document.getElementById('waypoint-c-y').value, 10);

        if (isNaN(saX) || isNaN(saY) || isNaN(sbX) || isNaN(sbY) || isNaN(scX) || isNaN(scY) || distVal === '') {
            sounds.error();
            addLog("Dispatch error: Coordinates or route distance parameters missing.", "error");
            return;
        }

        state.studentWps.A = { x: saX, y: saY };
        state.studentWps.B = { x: sbX, y: sbY };
        state.studentWps.C = { x: scX, y: scY };
        state.routeDistance = parseInt(distVal, 10);

        sounds.stageComplete();
        transitionToStage('4');
    });

    // ----------------------------------------------------
    // 8. Stage 4: Diagnostics & Auto Grading (36 Marks)
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
            concept: "Multiplication, division, and decimal arithmetic",
            status: `${recallCorrectCount} / 20 Correct`,
            score: `${recallCorrectCount} / 20`
        });

        // 2. Decimal Digit Shifter
        let calcScore = 0;
        let calcStatus = "Incorrect";
        if (state.calcChoice === '+0.1') {
            calcScore += 1;
            calcStatus = "Calibrated";
        }
        if (state.calcExplanation.length >= 8) {
            calcScore += 1;
            if (calcStatus === "Calibrated") calcStatus = "Fully Calibrated";
            else calcStatus = "Explain Only";
        }
        totalScore += calcScore;
        maxScore += 2;
        grading.push({
            test: "PART_B: DECIMAL_SHIFTER",
            concept: "Shifting place value digits across tenths column",
            status: calcStatus,
            score: `${calcScore} / 2`
        });

        // 3. Decimal Expander 9.524 (3 Marks: 1 per position)
        let expScore = 0;
        if (state.expanderTenths === 95) expScore += 1;
        if (state.expanderHundredths === 2) expScore += 1;
        if (state.expanderThousandths === 4) expScore += 1;
        
        totalScore += expScore;
        maxScore += 3;
        grading.push({
            test: "PART_B: DECIMAL_EXPANDER",
            concept: "Equivalent decimal place value representations",
            status: `${expScore} / 3 Validated`,
            score: `${expScore} / 3`
        });

        // 4. Percentage Equivalence (2 Marks)
        let pctScore = 0;
        if (state.regDecimal === 0.75) pctScore += 1;
        
        const parsedRatio = parseFractionRatio(state.regFraction);
        if (parsedRatio !== null && Math.abs(parsedRatio - 0.75) < 0.001) {
            pctScore += 1;
        }

        totalScore += pctScore;
        maxScore += 2;
        grading.push({
            test: "PART_B: EQUIVALENCE_REGISTER",
            concept: "Converting percentages to decimals & fractions",
            status: `${pctScore} / 2 Registered`,
            score: `${pctScore} / 2`
        });

        // 5. Divisibility Diagnostics (3 Marks)
        let divScore = 0;
        // Factor pair: 4 and 12 (or 12 and 4)
        const isPairCorrect = (state.divPair1 === 4 && state.divPair2 === 12) || (state.divPair1 === 12 && state.divPair2 === 4);
        if (isPairCorrect) divScore += 1;
        if (state.divYesNo === 'yes') divScore += 1;
        if (state.divExplanation.length >= 8) divScore += 1;

        totalScore += divScore;
        maxScore += 3;
        grading.push({
            test: "PART_B: DIVISIBILITY_DIAG",
            concept: "Factors, multiples and divisibility rules",
            status: `${divScore} / 3 Diagnosed`,
            score: `${divScore} / 3`
        });

        // 6. Cargo Partitioning (2 Marks)
        let cargoScore = 0;
        if (state.cargoWeight === 2.35) cargoScore += 1;
        if (state.cargoWorking.length >= 8) cargoScore += 1;

        totalScore += cargoScore;
        maxScore += 2;
        grading.push({
            test: "PART_C: CARGO_PARTITION",
            concept: "Dividing decimal numbers by 10",
            status: cargoScore === 2 ? "Fully Calibrated" : cargoScore === 1 ? "Weight Calibrated" : "Incorrect",
            score: `${cargoScore} / 2`
        });

        // 7. Coordinate Grid (4 Marks)
        let gridScore = 0;
        const wps = state.waypoints;
        const swps = state.studentWps;
        if (swps.A.x === wps.A.x && swps.A.y === wps.A.y) gridScore += 1;
        if (swps.B.x === wps.B.x && swps.B.y === wps.B.y) gridScore += 1;
        if (swps.C.x === wps.C.x && swps.C.y === wps.C.y) gridScore += 1;
        
        // Manhattan distance: A(2,3) -> B(8,5) is 6+2=8; B(8,5) -> C(5,9) is 3+4=7; Total=15
        if (state.routeDistance === 15) gridScore += 1;

        totalScore += gridScore;
        maxScore += 4;
        grading.push({
            test: "PART_C: COORDINATE_DISPATCH",
            concept: "2D coordinate grids and Manhattan distance",
            status: `${gridScore} / 4 Dispatched`,
            score: `${gridScore} / 4`
        });

        // Render report Score
        reportScore.textContent = `${totalScore} / ${maxScore}`;
        reportTableBody.innerHTML = '';
        grading.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.test}</td>
                <td style="color:var(--text-muted); font-size:0.75rem;">${row.concept}</td>
                <td style="color: ${row.score.startsWith('0') ? 'var(--red)' : 'var(--green)'}">${row.status}</td>
                <td style="font-weight:700;">${row.score}</td>
            `;
            reportTableBody.appendChild(tr);
        });

        // Save totalScore to persistent profile if higher or for stats
        const storedProfile = localStorage.getItem('luminous_math_profile');
        if (storedProfile) {
            try {
                const parsed = JSON.parse(storedProfile);
                parsed.score = (parsed.score || 0) + totalScore * 10; // scale assessment score
                localStorage.setItem('luminous_math_profile', JSON.stringify(parsed));
            } catch(e) {}
        }

        // Generate teacher feedback
        let feedback = '';
        if (totalScore === maxScore) {
            feedback = "EXCELLENT PERFORMANCE: All diagnostic core modules are fully functional. The student demonstrates comprehensive mastery of Year 5 mathematics standards, including rapid multiplication/division recall, decimal place value shifts, percentage equivalents, and 2D grid coordinate translations.";
        } else {
            feedback = "DIAGNOSTICS ADVISORY: System calibration has detected target gaps. ";
            const gaps = [];
            if (recallCorrectCount < 16) {
                gaps.push("remediate multiplication/division recall speed and decimal arithmetic (Part A)");
            }
            if (calcScore < 2 || expScore < 3 || pctScore < 2 || divScore < 3) {
                gaps.push("reinforce decimal place value structures, equivalent percentages/fractions, and divisibility diagnostics (Part B)");
            }
            if (cargoScore < 2 || gridScore < 4) {
                gaps.push("practise decimal division by 10 and plotting route paths on 2D coordinate systems (Part C)");
            }
            feedback += "Suggested remediation: " + gaps.join(', ') + ".";
        }
        reportFeedback.textContent = feedback;
    }

    btnResetApp.addEventListener('click', () => {
        // Reset state
        state.calcChoice = '';
        state.calcExplanation = '';
        state.expanderTenths = null;
        state.expanderHundredths = null;
        state.expanderThousandths = null;
        state.regDecimal = null;
        state.regFraction = '';
        state.divPair1 = null;
        state.divPair2 = null;
        state.divYesNo = '';
        state.divExplanation = '';
        state.cargoWeight = null;
        state.cargoWorking = '';
        state.studentWps = {
            A: { x: null, y: null },
            B: { x: null, y: null },
            C: { x: null, y: null }
        };
        state.routeDistance = null;

        // Reset inputs
        document.querySelectorAll('input[type="number"]').forEach(el => el.value = '');
        document.querySelectorAll('input[type="text"]').forEach(el => el.value = '');
        document.querySelectorAll('textarea').forEach(el => el.value = '');
        document.querySelectorAll('input[type="radio"]').forEach(el => el.checked = false);

        calcCurrentVal = 68.91;
        calcReadout.textContent = '68.91';

        blockO.className = 'expander-block';
        blockT.className = 'expander-block';
        blockH.className = 'expander-block';
        updateExpanderVisuals();

        const cargoBoxes = document.querySelectorAll('#cargo-boxes-group rect');
        cargoBoxes.forEach(box => {
            box.setAttribute('fill', 'none');
            box.setAttribute('stroke', 'var(--outline-variant)');
        });
        document.getElementById('cargo-status-text').textContent = "WAITING FOR INP...";
        document.getElementById('cargo-status-text').setAttribute('fill', 'var(--on-surface-variant)');

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
