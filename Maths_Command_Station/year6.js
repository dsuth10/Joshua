/**
 * Joshua Math Assessment Terminal - State & Logic Engine (Year 6)
 * Handles Cartesian 4-Quadrant plane vector translations, flight itineraries, metric decimal shifting, and sieve sorting.
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
        recallAnswers: [], // Stores user numeric/decimal/negative inputs
        
        // Stage 2: Calibration Lab User Inputs
        // Substation 1: Factor sorting cards (number => classification)
        sieveStates: {
            11: 'neutral',
            15: 'neutral',
            16: 'neutral',
            23: 'neutral',
            25: 'neutral',
            36: 'neutral',
            41: 'neutral',
            49: 'neutral'
        },
        // Substation 2: Equivalent fractions
        fracEquivNum: null,
        fracEquivDen: null,
        fracSumNum: null,
        fracSumDen: null,
        // Substation 3: Metric Regulator
        metricShiftDecimalPos: 1, // index of decimal position: 1 means after digit 4 (4.25)
        metricShiftValue: 4.25,
        metricConversionAns: null,
        // Substation 4: Angle solver
        angleOppVal: null,
        angleSuppVal: null,
        
        // Stage 3: Flight Schedule & 4-Quadrant Grid
        flightHours: null,
        flightMins: null,
        layoverHours: null,
        layoverMins: null,
        studentWpA: { x: null, y: null },
        studentWpTrans: { x: null, y: null }
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

    // Generate Stage 1 questions (10 mult, 5 div, 5 order of ops/negative numbers)
    function generateStage1Questions() {
        const list = [];
        // 10 Multiplication Facts
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
        // 5 Negative numbers / BODMAS questions
        const y6Math = [
            { eq: '-4 + 9', ans: 5 },
            { eq: '5 - 12', ans: -7 },
            { eq: '3 × -6', ans: -18 },
            { eq: '-15 ÷ 3', ans: -5 },
            { eq: '4 + 3 × -2', ans: -2 },
            { eq: '10 - 2 × 4', ans: 2 },
            { eq: '6 + 18 ÷ 3', ans: 12 },
            { eq: '(8 - 3) × 4', ans: 20 },
            { eq: '-8 - 5', ans: -13 }
        ];
        const shuffledY6 = shuffleArray(y6Math).slice(0, 5);
        shuffledY6.forEach(item => {
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
        }
    };

    if (typeof MCS !== 'undefined' && MCS.audio) {
        MCS.audio.register(playSound);
    }

    // ----------------------------------------------------
    // 3b. MCS Widget Instances (Phase 4 assessment migration)
    // ----------------------------------------------------
    let angleWidget = null;
    let gridWidget = null;

    function destroyAngleWidget() {
        if (angleWidget) {
            angleWidget.destroy();
            angleWidget = null;
        }
        const mount = document.getElementById('angle-widget-mount');
        if (mount) mount.innerHTML = '';
    }

    function mountAngleWidget() {
        if (typeof MCS === 'undefined') return;
        destroyAngleWidget();
        const mount = document.getElementById('angle-widget-mount');
        if (!mount) return;
        const inner = document.createElement('div');
        inner.style.width = '100%';
        inner.style.maxWidth = '320px';
        mount.appendChild(inner);
        angleWidget = MCS.create('protractor', inner, {
            mode: 'intersecting-lines',
            band: 'C',
            givenAngleDeg: 124,
        });
    }

    function destroyGridWidget() {
        if (gridWidget) {
            gridWidget.destroy();
            gridWidget = null;
        }
        const host = document.getElementById('assessment-grid-host');
        if (host) host.innerHTML = '';
    }

    function updateCoordReadouts(a, b) {
        const ra = document.getElementById('coord-readout-a');
        const rb = document.getElementById('coord-readout-b');
        const ax = a && a.x != null ? a.x : '?';
        const ay = a && a.y != null ? a.y : '?';
        const bx = b && b.x != null ? b.x : '?';
        const by = b && b.y != null ? b.y : '?';
        if (ra) ra.textContent = `A = ( ${ax}, ${ay} )`;
        if (rb) rb.textContent = `A' = ( ${bx}, ${by} )`;
    }

    function mountGridWidget() {
        if (typeof MCS === 'undefined') return;
        destroyGridWidget();
        const host = document.getElementById('assessment-grid-host');
        if (!host) return;
        const inner = document.createElement('div');
        inner.style.width = '100%';
        inner.style.maxWidth = '360px';
        host.appendChild(inner);

        const startA = {
            x: state.studentWpA.x != null ? state.studentWpA.x : 0,
            y: state.studentWpA.y != null ? state.studentWpA.y : 0,
        };
        const startB = {
            x: state.studentWpTrans.x != null ? state.studentWpTrans.x : 1,
            y: state.studentWpTrans.y != null ? state.studentWpTrans.y : 0,
        };

        gridWidget = MCS.create('coordinate-plotter', inner, {
            mode: 'plot-duo',
            band: 'C',
            quadrants: 4,
            xMin: -5,
            xMax: 5,
            yMin: -5,
            yMax: 5,
            snap: 1,
            showAxes: true,
            showGrid: true,
            labels: 'axis',
            showTranslationVector: true,
            markers: [
                { x: 2, y: -3, label: 'A(2,-3)' },
                { x: -1, y: 1, label: "A'(-1,1)" },
            ],
            initialA: startA,
            initialB: startB,
        });

        gridWidget.onChange(() => {
            const v = gridWidget.getValue();
            if (v.a) state.studentWpA = { x: v.a.x, y: v.a.y };
            if (v.b) state.studentWpTrans = { x: v.b.x, y: v.b.y };
            updateCoordReadouts(state.studentWpA, state.studentWpTrans);
        });

        const v = gridWidget.getValue();
        state.studentWpA = { x: v.a.x, y: v.a.y };
        state.studentWpTrans = { x: v.b.x, y: v.b.y };
        updateCoordReadouts(state.studentWpA, state.studentWpTrans);
    }

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
        
        document.querySelectorAll('.stage-container').forEach(el => el.classList.remove('active'));
        stages[stageKey].classList.add('active');
        state.activeStage = stageKey;
        
        Object.keys(trackers).forEach(key => {
            trackers[key].classList.remove('active');
            if (key === stageKey) {
                trackers[key].classList.add('active');
            }
        });

        statusDot.className = 'status-dot';
        if (stageKey === 'intro') {
            viewTitle.textContent = 'STATION_INITIALISATION';
            viewCode.textContent = '[INIT_SEQ]';
            trackers.intro.classList.add('active');
            addLog("System awaiting initialisation sequence.", "system");
        } else if (stageKey === '1') {
            viewTitle.textContent = 'PHASE_01: FACT_FLUENCY';
            viewCode.textContent = '[FACT_ENG_V6]';
            trackers.intro.classList.add('complete');
            addLog("Phase 1: Recalling multiplication, division, and integer/BODMAS math.", "system");
            initStage1();
        } else if (stageKey === '2') {
            viewTitle.textContent = 'PHASE_02: CALIBRATION_LAB';
            viewCode.textContent = '[CAL_LAB_V6]';
            trackers['1'].classList.add('complete');
            addLog("Phase 2: Factor classification, denominators, metric shifts, and angle modeller.", "system");
            initStage2();
        } else if (stageKey === '3') {
            viewTitle.textContent = 'PHASE_03: DISPATCH_GRID';
            viewCode.textContent = '[GRID_ROUTE_V6]';
            trackers['2'].classList.add('complete');
            addLog("Phase 3: Travel scheduling and 4-Quadrant coordinate translation.", "system");
            initStage3();
        } else if (stageKey === '4') {
            viewTitle.textContent = 'DIAGNOSTICS_SUMMARY';
            viewCode.textContent = '[REPORT_Y6]';
            trackers['3'].classList.add('complete');
            addLog("Diagnostics complete. Year 6 scorecard compiled.", "success");
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
        
        const progressPercentage = (state.currentRecallIndex / state.recallQuestions.length) * 100;
        equationProgress.style.width = `${progressPercentage}%`;
        equationCounter.textContent = `QUESTION ${state.currentRecallIndex + 1} OF ${state.recallQuestions.length}`;
        
        addLog(`Calibrating Fact ${state.currentRecallIndex + 1}: ${currentQ.eq} = ?`, "input");
    }

    document.querySelectorAll('.num-key, .decimal-key, .minus-key').forEach(btn => {
        btn.addEventListener('click', (e) => {
            sounds.click();
            const val = e.target.getAttribute('data-val');
            // If negative sign, toggle or append at start
            if (val === '-') {
                if (equationInput.value.startsWith('-')) {
                    equationInput.value = equationInput.value.slice(1);
                } else {
                    equationInput.value = '-' + equationInput.value;
                }
            } else if (equationInput.value.length < 6) {
                equationInput.value += val;
            }
        });
    });

    document.getElementById('key-clear').addEventListener('click', () => {
        sounds.click();
        equationInput.value = '';
    });

    document.getElementById('key-submit').addEventListener('click', submitRecallAnswer);

    document.addEventListener('keydown', (e) => {
        if (state.activeStage !== '1') return;
        
        if ((e.key >= '0' && e.key <= '9') || e.key === '.' || e.key === '-') {
            sounds.click();
            if (e.key === '-') {
                if (equationInput.value.startsWith('-')) {
                    equationInput.value = equationInput.value.slice(1);
                } else {
                    equationInput.value = '-' + equationInput.value;
                }
            } else if (equationInput.value.length < 6) {
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
        if (val === '' || val === '-') {
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
        renderSieveGrid();
    }

    function updateSubstationView() {
        Object.keys(substations).forEach(key => {
            substations[key].classList.remove('active');
            if (parseInt(key, 10) === state.stage2SubStation) {
                substations[key].classList.add('active');
            }
        });

        btnPrevSubstation.disabled = (state.stage2SubStation === 1);
        if (state.stage2SubStation === 4) {
            btnNextSubstation.textContent = "CALIBRATE STAGE";
        } else {
            btnNextSubstation.textContent = "VERIFY & PROCEED";
        }

        if (state.stage2SubStation === 1) {
            labInstruction.textContent = "FACTOR CLASSIFICATION: Cycle numbers into Prime [P], Composite [C], or Square [S].";
            addLog("Factor Sieve interface booted.", "system");
        } else if (state.stage2SubStation === 2) {
            labInstruction.textContent = "FRACTION EQUIVALENT SUMS: Complete equivalent denominators for 1/2 + 1/4.";
            addLog("Equivalent Fractions Panel active.", "system");
        } else if (state.stage2SubStation === 3) {
            labInstruction.textContent = "METRIC SHIFT REGULATOR: Slide decimal point to convert 4.25 km into meters.";
            addLog("Metric Shift Regulator active.", "system");
            updateMetricShiftRegulator();
        } else if (state.stage2SubStation === 4) {
            labInstruction.textContent = "ANGLE RELATIONSHIPS: Calculate the vertically opposite and supplementary angles.";
            addLog("Angle Relationship Solver booted.", "system");
            mountAngleWidget();
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
            // Sieve sorting must have non-neutral states for all numbers
            return Object.values(state.sieveStates).every(v => v !== 'neutral');
        } else if (num === 2) {
            const eqNum = document.getElementById('frac-equiv-num').value.trim();
            const eqDen = document.getElementById('frac-equiv-den').value.trim();
            const sumNum = document.getElementById('frac-sum-num').value.trim();
            const sumDen = document.getElementById('frac-sum-den').value.trim();
            if (eqNum === '' || eqDen === '' || sumNum === '' || sumDen === '') return false;
            state.fracEquivNum = parseInt(eqNum, 10);
            state.fracEquivDen = parseInt(eqDen, 10);
            state.fracSumNum = parseInt(sumNum, 10);
            state.fracSumDen = parseInt(sumDen, 10);
            return true;
        } else if (num === 3) {
            const conversionVal = document.getElementById('metric-conversion-ans').value.trim();
            if (conversionVal === '') return false;
            state.metricConversionAns = parseFloat(conversionVal);
            return true;
        } else if (num === 4) {
            const oppVal = document.getElementById('angle-opp-val').value.trim();
            const suppVal = document.getElementById('angle-supp-val').value.trim();
            if (oppVal === '' || suppVal === '') return false;
            state.angleOppVal = parseInt(oppVal, 10);
            state.angleSuppVal = parseInt(suppVal, 10);
            return true;
        }
        return false;
    }

    // Substation 1: Sieve Grid Renderer
    function renderSieveGrid() {
        const container = document.getElementById('sieve-grid-container');
        container.innerHTML = '';
        Object.keys(state.sieveStates).forEach(num => {
            const card = document.createElement('div');
            card.className = 'sieve-number-card';
            const curState = state.sieveStates[num];
            
            if (curState === 'prime') {
                card.className += ' selected-prime';
                card.innerHTML = `${num}<br><span style="font-size:0.7rem; font-weight:bold;">[P]</span>`;
            } else if (curState === 'composite') {
                card.className += ' selected-composite';
                card.innerHTML = `${num}<br><span style="font-size:0.7rem; font-weight:bold;">[C]</span>`;
            } else if (curState === 'square') {
                card.className += ' selected-square';
                card.innerHTML = `${num}<br><span style="font-size:0.7rem; font-weight:bold;">[S]</span>`;
            } else {
                card.innerHTML = `${num}<br><span style="font-size:0.7rem; color:var(--outline);">NUM</span>`;
            }

            card.addEventListener('click', () => {
                sounds.click();
                if (curState === 'neutral') state.sieveStates[num] = 'prime';
                else if (curState === 'prime') state.sieveStates[num] = 'composite';
                else if (curState === 'composite') state.sieveStates[num] = 'square';
                else state.sieveStates[num] = 'neutral';
                renderSieveGrid();
            });

            container.appendChild(card);
        });
    }

    // Substation 3: Metric Shift Regulator Slider
    const metricDot = document.getElementById('metric-dot-indicator');
    const metricInput = document.getElementById('metric-conversion-ans');

    document.getElementById('btn-metric-shift-right').addEventListener('click', () => {
        sounds.click();
        if (state.metricShiftDecimalPos < 4) {
            state.metricShiftDecimalPos++;
            updateMetricShiftRegulator();
        }
    });

    document.getElementById('btn-metric-shift-left').addEventListener('click', () => {
        sounds.click();
        if (state.metricShiftDecimalPos > 0) {
            state.metricShiftDecimalPos--;
            updateMetricShiftRegulator();
        }
    });

    document.getElementById('btn-metric-reset').addEventListener('click', () => {
        sounds.click();
        state.metricShiftDecimalPos = 1; // back to 4.25
        updateMetricShiftRegulator();
    });

    function updateMetricShiftRegulator() {
        // Shifting decimal dot indicator using CSS transform Translate
        // Default position: index 1 (between 4 and 2).
        // Positions are: 0 (before 4), 1 (after 4), 2 (after 2), 3 (after 5), 4 (after first 0).
        // Each digit is 36px wide, plus 4px gap.
        const baseOffset = 42; // Width of digit container box
        const shiftAmount = (state.metricShiftDecimalPos - 1) * baseOffset;
        metricDot.style.transform = `translateX(${shiftAmount}px)`;
        
        // Calculate dynamic value shown
        if (state.metricShiftDecimalPos === 0) state.metricShiftValue = 0.425;
        else if (state.metricShiftDecimalPos === 1) state.metricShiftValue = 4.25;
        else if (state.metricShiftDecimalPos === 2) state.metricShiftValue = 42.5;
        else if (state.metricShiftDecimalPos === 3) state.metricShiftValue = 425;
        else if (state.metricShiftDecimalPos === 4) state.metricShiftValue = 4250;
        
        addLog(`Regulator value adjusted to ${state.metricShiftValue}`, "input");
        
        if (state.metricShiftValue === 4250) {
            metricInput.value = 4250;
            sounds.successNode();
            addLog("Metric regulator matched output! 4250 meters locked.", "success");
        }
    }

    // Substation 4: angle diagram via MCS protractor widget (Phase 4)

    // ----------------------------------------------------
    // 7. Stage 3: Cargo & Coordinates Dispatch
    // ----------------------------------------------------
    const eggerlingSub1 = document.getElementById('eggerling-sub-1');
    const eggerlingSub2 = document.getElementById('eggerling-sub-2');
    const btnSubmitItinerary = document.getElementById('btn-submit-itinerary');
    const btnPrevEggerling = document.getElementById('btn-prev-eggerling');
    const btnSubmitCoordinates = document.getElementById('btn-submit-coordinates');

    function initStage3() {
        state.stage3SubStage = 1;
        updateEggerlingView();
    }

    function updateEggerlingView() {
        eggerlingSub1.classList.remove('active');
        eggerlingSub2.classList.remove('active');

        if (state.stage3SubStage === 1) {
            eggerlingSub1.classList.add('active');
            addLog("Flight Itinerary calibration booted. Waiting for scheduling durations.", "system");
        } else {
            eggerlingSub2.classList.add('active');
            addLog("4-Quadrant Coordinates console booted.", "system");
            mountGridWidget();
        }
    }

    // Sub-stage 1: Flight Itinerary Planner
    btnSubmitItinerary.addEventListener('click', () => {
        const fhVal = document.getElementById('flight-hours').value.trim();
        const fmVal = document.getElementById('flight-mins').value.trim();
        const lhVal = document.getElementById('layover-hours').value.trim();
        const lmVal = document.getElementById('layover-mins').value.trim();
        
        if (fhVal === '' || fmVal === '' || lhVal === '' || lmVal === '') {
            sounds.error();
            addLog("Dispatch error: Flight itinerary schedule slots missing.", "error");
            return;
        }

        state.flightHours = parseInt(fhVal, 10);
        state.flightMins = parseInt(fmVal, 10);
        state.layoverHours = parseInt(lhVal, 10);
        state.layoverMins = parseInt(lmVal, 10);

        // Flights BNE->SYD (1hr 30m) + SYD->MEL (1hr 35m) = 3hr 5m
        // Layover SYD (15:45 to 17:00) = 1hr 15m
        const isDurationCorrect = (state.flightHours === 3 && state.flightMins === 5);
        const isLayoverCorrect = (state.layoverHours === 1 && state.layoverMins === 15);

        if (isDurationCorrect && isLayoverCorrect) {
            sounds.successNode();
            addLog("Shuttle flight path timing verified successfully!", "success");
            document.getElementById('shuttle-status-text').textContent = "TIMING ALIGNED";
            document.getElementById('shuttle-status-text').setAttribute('fill', 'var(--primary)');
            
            setTimeout(() => {
                state.stage3SubStage = 2;
                updateEggerlingView();
            }, 1000);
        } else {
            sounds.error();
            addLog("Calibration deviation: Travel calculations incorrect.", "error");
        }
    });

    // Sub-stage 2: 4-Quadrant Grid — tap-to-plot via coordinate-plotter (Phase 4)

    btnPrevEggerling.addEventListener('click', () => {
        state.stage3SubStage = 1;
        sounds.click();
        destroyGridWidget();
        updateCoordReadouts({ x: null, y: null }, { x: null, y: null });
        updateEggerlingView();
    });

    btnSubmitCoordinates.addEventListener('click', () => {
        if (gridWidget) {
            const v = gridWidget.getValue();
            state.studentWpA = { x: v.a.x, y: v.a.y };
            state.studentWpTrans = { x: v.b.x, y: v.b.y };
        }

        const ax = state.studentWpA.x;
        const ay = state.studentWpA.y;
        const tx = state.studentWpTrans.x;
        const ty = state.studentWpTrans.y;

        if (ax == null || ay == null || tx == null || ty == null) {
            sounds.error();
            addLog("Dispatch error: Coordinate point coordinates missing.", "error");
            return;
        }

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
            concept: "Multiplication, division, order of operations & integers",
            status: `${recallCorrectCount} / 20 Correct`,
            score: `${recallCorrectCount} / 20`
        });

        // 2. Factor Sieve (4 Marks - 0.5 per number)
        // Primes: 11, 23, 41. Composites: 15. Squares: 16, 25, 36, 49.
        let sievePoints = 0;
        const solution = {
            11: 'prime', 23: 'prime', 41: 'prime',
            15: 'composite',
            16: 'square', 25: 'square', 36: 'square', 49: 'square'
        };
        Object.keys(state.sieveStates).forEach(num => {
            if (state.sieveStates[num] === solution[num]) {
                sievePoints += 0.5;
            }
        });
        totalScore += sievePoints;
        maxScore += 4;
        grading.push({
            test: "PART_B: FACTOR_SIEVE",
            concept: "Classifying primes, composites, and square numbers",
            status: `${sievePoints} / 4 Validated`,
            score: `${sievePoints} / 4`
        });

        // 3. Fraction Builder (2 Marks)
        let fractionScore = 0;
        // LCD eq: 1/2 = 2/4
        if (state.fracEquivNum === 2 && state.fracEquivDen === 4) fractionScore += 1;
        // Sum: 1/2 + 1/4 = 3/4
        if (state.fracSumNum === 3 && state.fracSumDen === 4) fractionScore += 1;

        totalScore += fractionScore;
        maxScore += 2;
        grading.push({
            test: "PART_B: EQUIVALENT_SUMS",
            concept: "Solving fraction sums with different denominators",
            status: `${fractionScore} / 2 Calibrated`,
            score: `${fractionScore} / 2`
        });

        // 4. Metric Shift Regulator (2 Marks)
        let metricScore = 0;
        if (state.metricShiftValue === 4250) metricScore += 1;
        if (state.metricConversionAns === 4250) metricScore += 1;

        totalScore += metricScore;
        maxScore += 2;
        grading.push({
            test: "PART_B: METRIC_SHIFT",
            concept: "Metric conversions shifting by powers of 10",
            status: `${metricScore} / 2 Regulator Match`,
            score: `${metricScore} / 2`
        });

        // 5. Angle Relationship Solver (2 Marks)
        let angleScore = 0;
        if (state.angleOppVal === 124) angleScore += 1;
        if (state.angleSuppVal === 56) angleScore += 1;

        totalScore += angleScore;
        maxScore += 2;
        grading.push({
            test: "PART_B: ANGLE_SOLVER",
            concept: "Vertically opposite and supplementary angles",
            status: `${angleScore} / 2 Solved`,
            score: `${angleScore} / 2`
        });

        // 6. Itinerary Duration (2 Marks)
        let flightScore = 0;
        if (state.flightHours === 3 && state.flightMins === 5) flightScore += 1;
        if (state.layoverHours === 1 && state.layoverMins === 15) flightScore += 1;

        totalScore += flightScore;
        maxScore += 2;
        grading.push({
            test: "PART_C: FLIGHT_ITINERARY",
            concept: "Interpreting timetables and calculating durations",
            status: `${flightScore} / 2 Dispatched`,
            score: `${flightScore} / 2`
        });

        // 7. 4-Quadrant Plotter & Translation (4 Marks)
        let coordinatesScore = 0;
        if (state.studentWpA.x === 2 && state.studentWpA.y === -3) coordinatesScore += 1;
        if (state.studentWpTrans.x === -1 && state.studentWpTrans.y === 1) coordinatesScore += 2;
        // Confirm vector displacement matches [-3, 4]
        if (state.studentWpTrans.x - state.studentWpA.x === -3 && state.studentWpTrans.y - state.studentWpA.y === 4) {
            coordinatesScore += 1;
        }

        totalScore += coordinatesScore;
        maxScore += 4;
        grading.push({
            test: "PART_C: FOUR_QUADRANT_DISPATCH",
            concept: "Plotting all four quadrants and translation vectors",
            status: `${coordinatesScore} / 4 Translocated`,
            score: `${coordinatesScore} / 4`
        });

        // Display results
        reportScore.textContent = `${totalScore} / ${maxScore}`;
        reportTableBody.innerHTML = '';
        grading.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="padding: 10px 8px; font-weight:600;">${row.test}</td>
                <td style="padding: 10px 8px; color:var(--on-surface-variant); font-size:0.75rem;">${row.concept}</td>
                <td style="padding: 10px 8px; color: ${row.score.startsWith('0') ? 'var(--error)' : 'var(--primary)'}">${row.status}</td>
                <td style="padding: 10px 8px; font-weight:700;">${row.score}</td>
            `;
            reportTableBody.appendChild(tr);
        });

        // Synchronize with database profile
        const storedProfile = localStorage.getItem('joshua_math_profile');
        if (storedProfile) {
            try {
                const parsed = JSON.parse(storedProfile);
                parsed.score = (parsed.score || 0) + totalScore * 10;
                localStorage.setItem('joshua_math_profile', JSON.stringify(parsed));
            } catch(e) {}
        }

        // Generate feedback comments
        let feedback = '';
        if (totalScore === maxScore) {
            feedback = "EXCELLENT PERFORMANCE: All diagnostic core modules are fully functional. The student demonstrates comprehensive mastery of Year 6 mathematics standards, including rapid multiplication/division recall, prime/composite classification, equivalent denominator fraction addition, metric shifter conversions, angle relationships, travel durations, and 4-quadrant Cartesian transformations.";
        } else {
            feedback = "DIAGNOSTICS ADVISORY: System calibration has detected target gaps. ";
            const gaps = [];
            if (recallCorrectCount < 16) {
                gaps.push("remediate multiplication/division recall speed and negative/BODMAS math (Part A)");
            }
            if (sievePoints < 4 || fractionScore < 2 || metricScore < 2 || angleScore < 2) {
                gaps.push("reinforce prime/composite/square sorting, common denominators, metric shifting, and angle rules (Part B)");
            }
            if (flightScore < 2 || coordinatesScore < 4) {
                gaps.push("practise timetable duration math and plotting route translations on 4-quadrant Cartesian systems (Part C)");
            }
            feedback += "Suggested remediation: " + gaps.join(', ') + ".";
        }
        reportFeedback.textContent = feedback;
    }

    btnResetApp.addEventListener('click', () => {
        destroyAngleWidget();
        destroyGridWidget();
        updateCoordReadouts({ x: null, y: null }, { x: null, y: null });
        Object.keys(state.sieveStates).forEach(num => {
            state.sieveStates[num] = 'neutral';
        });
        state.fracEquivNum = null;
        state.fracEquivDen = null;
        state.fracSumNum = null;
        state.fracSumDen = null;
        state.metricShiftDecimalPos = 1;
        state.metricShiftValue = 4.25;
        state.metricConversionAns = null;
        state.angleOppVal = null;
        state.angleSuppVal = null;
        state.flightHours = null;
        state.flightMins = null;
        state.layoverHours = null;
        state.layoverMins = null;
        state.studentWpA = { x: null, y: null };
        state.studentWpTrans = { x: null, y: null };

        // Reset text boxes and options
        document.querySelectorAll('input[type="number"]').forEach(el => el.value = '');
        document.querySelectorAll('input[type="text"]').forEach(el => el.value = '');
        
        // Reset progress trackers
        document.querySelectorAll('.tracker-node').forEach(node => {
            node.classList.remove('complete');
            node.classList.remove('active');
        });

        state.recallQuestions = generateStage1Questions();
        transitionToStage('intro');
    });

    document.getElementById('btn-start-assessment').addEventListener('click', () => {
        transitionToStage('1');
    });

    // Start system at intro screen
    transitionToStage('intro');
});
