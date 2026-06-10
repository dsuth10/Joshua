/**
 * Joshua Math Assessment Terminal - State & Logic Engine (Year 3)
 * Handles addition/subtraction fact recall, place value accordion expansions,
 * unit fractions number lines, analog clocks, and landmark coordinate grid dispatch.
 */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. Core State Definition
    // ----------------------------------------------------
    const state = {
        activeStage: 'intro', // 'intro', '1', '2', '3', '4'
        stage2SubStation: 1,  // 1 to 4
        stage3SubStage: 1,    // 1 to 2
        
        // Stage 1: Fact Recall
        recallQuestions: [
            { eq: '5 + 7', ans: 12 },
            { eq: '12 - 4', ans: 8 },
            { eq: '8 + 8', ans: 16 },
            { eq: '15 - 9', ans: 6 },
            { eq: '6 + 9', ans: 15 },
            { eq: '14 - 6', ans: 8 },
            { eq: '9 + 4', ans: 13 },
            { eq: '11 - 3', ans: 8 },
            { eq: '7 + 7', ans: 14 },
            { eq: '18 - 9', ans: 9 },
            { eq: '8 + 5', ans: 13 },
            { eq: '13 - 7', ans: 6 },
            { eq: '9 + 9', ans: 18 },
            { eq: '16 - 8', ans: 8 },
            { eq: '4 + 8', ans: 12 },
            { eq: '17 - 9', ans: 8 },
            { eq: '7 + 6', ans: 13 },
            { eq: '15 - 8', ans: 7 },
            { eq: '9 + 7', ans: 16 },
            { eq: '14 - 7', ans: 7 }
        ],
        currentRecallIndex: 0,
        recallAnswers: [], // Stores user inputs
        
        // Stage 2: Place Value Lab
        calcChoice: '',       // Selected multiple choice (e.g. 'add-10')
        calcExplanation: '',  // Text area content
        fractionPlotterVal: 0.0, // Draggable slider snapped fraction
        expanderHCollapsed: false,
        expanderTCollapsed: false,
        expanderTens: null,   // User input
        expanderOnes: null,   // User input
        hundreds702: null,    // User input
        tenLess952: null,     // User input
        thirtyFourTens: null, // User input
        
        // Stage 3: Eggerling's Eggs
        eggCartons: null,     // User input
        eggWorking: '',       // Text explanation
        vanLeft: null,        // User input
        clockHour: 12,        // Draggable departure clock hour
        clockMinute: 0,       // Draggable departure clock minute
        
        // Animation Flags & Coordinates
        eggPackerRan: false,
        vanDeliveryRan: false,
        vanX: 0,
        vanY: 0,
        vanCargo: 213,
        shopAStatus: 'AWAITING',
        shopCStatus: 'AWAITING',
        shopBStatus: 'AWAITING'
    };

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
            viewTitle.textContent = 'PHASE_01: ADDITIVE_FACTS';
            viewCode.textContent = '[FACT_ENG_A]';
            trackers.intro.classList.add('complete');
            addLog("Phase 1: Recalling addition and subtraction facts.", "system");
            initStage1();
        } else if (stageKey === '2') {
            viewTitle.textContent = 'PHASE_02: PLACE_VALUE_LAB';
            viewCode.textContent = '[PV_LAB_B]';
            trackers['1'].classList.add('complete');
            addLog("Phase 2: Place value calibration laboratory loaded.", "system");
            initStage2();
        } else if (stageKey === '3') {
            viewTitle.textContent = 'PHASE_03: EGGERLING_DISPATCH';
            viewCode.textContent = '[DELIVERY_C]';
            trackers['2'].classList.add('complete');
            addLog("Phase 3: Logistics and egg partition routines active.", "system");
            initStage3();
        } else if (stageKey === '4') {
            viewTitle.textContent = 'DIAGNOSTICS_SUMMARY';
            viewCode.textContent = '[REPORT_D]';
            trackers['3'].classList.add('complete');
            addLog("Diagnostics complete. Final score compiled.", "success");
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

    document.querySelectorAll('.num-key').forEach(btn => {
        btn.addEventListener('click', (e) => {
            sounds.click();
            const val = e.target.getAttribute('data-val');
            if (equationInput.value.length < 3) {
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
        
        if (e.key >= '0' && e.key <= '9') {
            sounds.click();
            if (equationInput.value.length < 3) {
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

        const numericAns = parseInt(val, 10);
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
            labInstruction.textContent = "CALIBRATOR DIAGNOSTICS: Run calculations to verify how to change 796 into 806.";
            addLog("Calibrator Diagnostic interface booted.", "system");
        } else if (state.stage2SubStation === 2) {
            labInstruction.textContent = "FRACTION LINE CALIBRATION: Plot the fraction 3/4 on the coordinate number line.";
            addLog("Fraction Plotter workspace active.", "system");
            initFractionPlotter();
        } else if (state.stage2SubStation === 3) {
            labInstruction.textContent = "ACCORDION EXPANDER: Click joints to fold and unfold equivalent groupings.";
            addLog("Accordion Expander 952 active.", "system");
            initAccordionExpander();
        } else if (state.stage2SubStation === 4) {
            labInstruction.textContent = "FINAL CALIBRATION: Solve hundreds count, subtraction bounds, and tens grouping.";
            addLog("Final place value diagnostic registers active.", "system");
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
                addLog("Place Value Laboratory successfully calibrated.", "success");
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
            const explanation = document.getElementById('calc-explanation').value.trim();
            if (!selectedOpt) return false;
            state.calcChoice = selectedOpt.value;
            state.calcExplanation = explanation;
            return true;
        } else if (num === 2) {
            // Fraction plotter represents visual calibration, validation always accepts
            return state.fractionPlotterVal !== null;
        } else if (num === 3) {
            const tensVal = document.getElementById('exp-952-tens').value.trim();
            const onesVal = document.getElementById('exp-952-ones').value.trim();
            if (tensVal === '' || onesVal === '') return false;
            state.expanderTens = parseInt(tensVal, 10);
            state.expanderOnes = parseInt(onesVal, 10);
            return true;
        } else if (num === 4) {
            const hundreds702Val = document.getElementById('val-702-hundreds').value.trim();
            const tenLessVal = document.getElementById('val-952-ten-less').value.trim();
            const thirtyFourVal = document.getElementById('val-34-tens').value.trim();
            if (hundreds702Val === '' || tenLessVal === '' || thirtyFourVal === '') return false;
            
            state.hundreds702 = parseInt(hundreds702Val, 10);
            state.tenLess952 = parseInt(tenLessVal, 10);
            state.thirtyFourTens = parseInt(thirtyFourVal, 10);
            return true;
        }
        return false;
    }

    // Sub-station 1: Calculator controls
    const calcReadout = document.getElementById('calc-readout');
    let calcCurrentVal = 796;

    document.querySelectorAll('.calc-btn.op-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            sounds.click();
            const op = e.target.getAttribute('data-op');
            if (op === '+100') calcCurrentVal += 100;
            else if (op === '+10') calcCurrentVal += 10;
            else if (op === '+14') calcCurrentVal += 14;
            else if (op === '-90') calcCurrentVal -= 90;
            else if (op === '-190') calcCurrentVal -= 190;
            
            calcReadout.textContent = calcCurrentVal;
            addLog(`Calibrator output adjusted to ${calcCurrentVal}`, "input");

            if (calcCurrentVal === 806) {
                const radio10 = document.getElementById('calc-c2');
                if (radio10) radio10.checked = true;
                addLog("Calibrator calibrated to target value 806! Please write explanation.", "success");
                sounds.successNode();
            }
        });
    });

    document.getElementById('calc-reset').addEventListener('click', () => {
        sounds.click();
        calcCurrentVal = 796;
        calcReadout.textContent = calcCurrentVal;
        addLog("Calibrator reset to default 796.", "system");
    });

    // ----------------------------------------------------
    // SVG Widget 1: Fraction Number Line Plotter (AC9M3N02)
    // ----------------------------------------------------
    function initFractionPlotter() {
        const host = document.getElementById('fraction-plotter-svg-host');
        if (!host) return;

        // Start fraction plotter value
        state.fractionPlotterVal = 0.0;

        const drawPlotter = (val) => {
            const width = 300;
            const xStart = 30;
            const xEnd = 270;
            const scale = xEnd - xStart; // 240px
            const xThumb = xStart + val * scale;
            
            let fracStr = "0/4";
            if (val === 0.25) fracStr = "1/4";
            else if (val === 0.5) fracStr = "2/4";
            else if (val === 0.75) fracStr = "3/4";
            else if (val === 1.0) fracStr = "4/4";
            
            let svg = `<svg viewBox="0 0 300 85" style="width:100%; height:100%; overflow:visible; user-select:none;" id="fraction-svg">
                <line x1="${xStart}" y1="40" x2="${xEnd}" y2="40" stroke="var(--outline-variant)" stroke-width="6" stroke-linecap="round" />
                <line x1="${xStart}" y1="40" x2="${xThumb}" y2="40" stroke="var(--primary)" stroke-width="6" stroke-linecap="round" />
            `;
            
            for (let i = 0; i <= 4; i++) {
                const tVal = i / 4;
                const tx = xStart + tVal * scale;
                const isSelected = Math.abs(val - tVal) < 0.01;
                
                svg += `
                    <line x1="${tx}" y1="32" x2="${tx}" y2="48" stroke="${isSelected ? 'var(--primary)' : 'var(--outline)'}" stroke-width="2" />
                    <text x="${tx}" y="68" font-family="var(--font-mono)" font-size="10" font-weight="700" text-anchor="middle" fill="${isSelected ? 'var(--primary)' : 'var(--on-surface-variant)'}">
                        ${i === 0 ? '0' : (i === 4 ? '1' : i + '/4')}
                    </text>
                `;
            }
            
            svg += `
                <circle cx="${xThumb}" cy="40" r="12" fill="var(--surface)" stroke="var(--primary)" stroke-width="3.5" style="cursor: grab;" id="fraction-thumb" />
                <circle cx="${xThumb}" cy="40" r="4" fill="var(--primary)" />
            </svg>`;
            
            host.innerHTML = svg;

            const selectedValText = document.getElementById('fraction-selected-val');
            if (selectedValText) {
                selectedValText.textContent = fracStr;
                selectedValText.style.color = 'var(--primary)';
            }

            const svgEl = document.getElementById('fraction-svg');
            const thumb = document.getElementById('fraction-thumb');
            let isDragging = false;
            
            const getValFromX = (clientX) => {
                const rect = svgEl.getBoundingClientRect();
                const relativeX = ((clientX - rect.left) / rect.width) * 300;
                const clampedX = Math.max(xStart, Math.min(xEnd, relativeX));
                const rawVal = (clampedX - xStart) / scale;
                return Math.round(rawVal * 4) / 4;
            };

            const handleStart = (clientX) => {
                isDragging = true;
                thumb.style.cursor = 'grabbing';
                const snappedVal = getValFromX(clientX);
                if (snappedVal !== state.fractionPlotterVal) {
                    state.fractionPlotterVal = snappedVal;
                    sounds.click();
                    drawPlotter(snappedVal);
                }
            };

            const handleMove = (clientX) => {
                if (!isDragging) return;
                const snappedVal = getValFromX(clientX);
                if (snappedVal !== state.fractionPlotterVal) {
                    state.fractionPlotterVal = snappedVal;
                    sounds.click();
                    drawPlotter(snappedVal);
                }
            };

            const handleEnd = () => {
                if (isDragging) {
                    isDragging = false;
                    thumb.style.cursor = 'grab';
                    if (state.fractionPlotterVal === 0.75) {
                        sounds.successNode();
                        addLog("Fraction calibrated to 3/4!", "success");
                    }
                }
            };

            thumb.addEventListener('mousedown', (e) => {
                e.preventDefault();
                handleStart(e.clientX);
            });
            svgEl.addEventListener('mousedown', (e) => {
                if (e.target !== thumb) {
                    e.preventDefault();
                    handleStart(e.clientX);
                }
            });
            window.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    e.preventDefault();
                    handleMove(e.clientX);
                }
            });
            window.addEventListener('mouseup', handleEnd);

            thumb.addEventListener('touchstart', (e) => {
                e.preventDefault();
                handleStart(e.touches[0].clientX);
            });
            svgEl.addEventListener('touchstart', (e) => {
                if (e.target !== thumb) {
                    e.preventDefault();
                    handleStart(e.touches[0].clientX);
                }
            });
            window.addEventListener('touchmove', (e) => {
                if (isDragging) {
                    handleMove(e.touches[0].clientX);
                }
            }, { passive: false });
            window.addEventListener('touchend', handleEnd);
        };

        drawPlotter(state.fractionPlotterVal);
    }

    // ----------------------------------------------------
    // SVG Widget 2: Accordion Place Value Expander (AC9M3N01)
    // ----------------------------------------------------
    function initAccordionExpander() {
        const host = document.getElementById('expander-952');
        if (!host) return;

        state.expanderHCollapsed = false;
        state.expanderTCollapsed = false;

        const drawExpander = () => {
            const hCol = state.expanderHCollapsed;
            const tCol = state.expanderTCollapsed;

            let numHText = "9";
            let numTText = "5";
            let numOText = "2";

            if (hCol && tCol) {
                numHText = "";
                numTText = "";
                numOText = "952";
            } else if (hCol) {
                numHText = "9";
                numTText = "95";
                numOText = "2";
            } else if (tCol) {
                numHText = "9";
                numTText = "5";
                numOText = "52";
            }

            let svg = `<svg viewBox="0 0 480 80" style="width:100%; height:100%; user-select:none; overflow:visible;" id="expander-svg">`;
            let currentX = 10;
            
            // Hundreds Block
            if (!hCol || (!tCol && hCol)) {
                svg += `
                    <rect x="${currentX}" y="10" width="50" height="60" fill="var(--surface-container-low)" stroke="var(--outline-variant)" stroke-width="1.5" rx="4" />
                    <text x="${currentX + 25}" y="48" font-family="'Space Grotesk', sans-serif" font-size="28" font-weight="700" text-anchor="middle" fill="var(--primary)">${numHText}</text>
                `;
                currentX += 50;

                if (!hCol) {
                    svg += `
                        <rect x="${currentX}" y="10" width="80" height="60" fill="var(--surface)" stroke="var(--outline-variant)" stroke-width="1.5" stroke-dasharray="3 3" rx="4" />
                        <text x="${currentX + 40}" y="45" font-family="'Work Sans', sans-serif" font-size="13" font-weight="600" text-anchor="middle" fill="var(--on-surface-variant)">Hundreds</text>
                    `;
                    currentX += 80;
                }
            }

            // Joint H
            if (numHText !== "") {
                svg += `
                    <g id="svg-joint-h" style="cursor:pointer;">
                        <rect x="${currentX}" y="10" width="30" height="60" fill="${hCol ? 'var(--primary)' : 'var(--surface-container-highest)'}" stroke="var(--outline-variant)" stroke-width="1.5" rx="4" />
                        <text x="${currentX + 15}" y="45" font-family="'Work Sans', sans-serif" font-size="14" font-weight="700" text-anchor="middle" fill="${hCol ? 'var(--on-primary)' : 'var(--primary)'}">↔</text>
                    </g>
                `;
                currentX += 30;
            }

            // Tens Block
            if (!tCol || (hCol && tCol)) {
                svg += `
                    <rect x="${currentX}" y="10" width="60" height="60" fill="var(--surface-container-low)" stroke="var(--outline-variant)" stroke-width="1.5" rx="4" />
                    <text x="${currentX + 30}" y="48" font-family="'Space Grotesk', sans-serif" font-size="28" font-weight="700" text-anchor="middle" fill="var(--primary)">${numTText}</text>
                `;
                currentX += 60;

                if (!tCol) {
                    svg += `
                        <rect x="${currentX}" y="10" width="80" height="60" fill="var(--surface)" stroke="var(--outline-variant)" stroke-width="1.5" stroke-dasharray="3 3" rx="4" />
                        <text x="${currentX + 40}" y="45" font-family="'Work Sans', sans-serif" font-size="13" font-weight="600" text-anchor="middle" fill="var(--on-surface-variant)">Tens</text>
                    `;
                    currentX += 80;
                }
            }

            // Joint T
            if (numTText !== "") {
                svg += `
                    <g id="svg-joint-t" style="cursor:pointer;">
                        <rect x="${currentX}" y="10" width="30" height="60" fill="${tCol ? 'var(--primary)' : 'var(--surface-container-highest)'}" stroke="var(--outline-variant)" stroke-width="1.5" rx="4" />
                        <text x="${currentX + 15}" y="45" font-family="'Work Sans', sans-serif" font-size="14" font-weight="700" text-anchor="middle" fill="${tCol ? 'var(--on-primary)' : 'var(--primary)'}">↔</text>
                    </g>
                `;
                currentX += 30;
            }

            // Ones Block
            svg += `
                <rect x="${currentX}" y="10" width="70" height="60" fill="var(--surface-container-low)" stroke="var(--outline-variant)" stroke-width="1.5" rx="4" />
                <text x="${currentX + 35}" y="48" font-family="'Space Grotesk', sans-serif" font-size="${numOText.length > 2 ? 22 : 28}" font-weight="700" text-anchor="middle" fill="var(--primary)">${numOText}</text>
            `;
            currentX += 70;

            svg += `
                <rect x="${currentX}" y="10" width="80" height="60" fill="var(--surface)" stroke="var(--outline-variant)" stroke-width="1.5" rx="4" />
                <text x="${currentX + 40}" y="45" font-family="'Work Sans', sans-serif" font-size="13" font-weight="600" text-anchor="middle" fill="var(--on-surface-variant)">Ones</text>
            </svg>`;
            
            host.innerHTML = svg;

            const jointH = document.getElementById('svg-joint-h');
            const jointT = document.getElementById('svg-joint-t');

            if (jointH) {
                jointH.addEventListener('click', () => {
                    sounds.click();
                    state.expanderHCollapsed = !state.expanderHCollapsed;
                    drawExpander();
                    logExpanderState();
                });
            }

            if (jointT) {
                jointT.addEventListener('click', () => {
                    sounds.click();
                    state.expanderTCollapsed = !state.expanderTCollapsed;
                    drawExpander();
                    logExpanderState();
                });
            }
        };

        const logExpanderState = () => {
            const hCol = state.expanderHCollapsed;
            const tCol = state.expanderTCollapsed;
            if (hCol && tCol) {
                addLog("Expander collapsed completely: 952 ones.", "system");
            } else if (hCol) {
                addLog("Expander folded hundreds joint: 95 tens, 2 ones.", "system");
            } else if (tCol) {
                addLog("Expander folded tens joint: 9 hundreds, 52 ones.", "system");
            } else {
                addLog("Expander fully expanded: 9 hundreds, 5 tens, 2 ones.", "system");
            }
        };

        drawExpander();
    }

    // ----------------------------------------------------
    // 7. Stage 3: Eggerling's Dispatch Center
    // ----------------------------------------------------
    const eggerlingSub1 = document.getElementById('eggerling-sub-1');
    const eggerlingSub2 = document.getElementById('eggerling-sub-2');
    const eggCanvas = document.getElementById('egg-canvas');
    const btnRunPacker = document.getElementById('btn-run-packer');
    const btnSubmitEggs = document.getElementById('btn-submit-eggs');
    const btnPrevEggerling = document.getElementById('btn-prev-eggerling');
    const btnSubmitDelivery = document.getElementById('btn-submit-delivery');
    
    function initStage3() {
        state.stage3SubStage = 1;
        updateEggerlingView();
    }

    function updateEggerlingView() {
        eggerlingSub1.classList.remove('active');
        eggerlingSub2.classList.remove('active');

        if (state.stage3SubStage === 1) {
            eggerlingSub1.classList.add('active');
            addLog("Egg packing station booted. Awaiting carton calculation.", "system");
        } else {
            eggerlingSub2.classList.add('active');
            addLog("Delivery route station booted. Awaiting dispatch calculations.", "system");
            initDeliveryGridMap();
            initAnalogClock();
        }
    }

    // Stage 3 Sub-stage 1: Egg Packing
    btnRunPacker.addEventListener('click', () => {
        sounds.engineHum();
        eggCanvas.innerHTML = '';
        state.eggPackerRan = true;
        
        for (let c = 1; c <= 23; c++) {
            const carton = document.createElement('div');
            carton.className = 'egg-carton packed';
            
            const grid = document.createElement('div');
            grid.className = 'carton-grid';
            
            for (let e = 0; e < 10; e++) {
                const slot = document.createElement('div');
                slot.className = 'egg-slot';
                const egg = document.createElement('div');
                egg.className = 'egg-node';
                slot.appendChild(egg);
                grid.appendChild(slot);
            }
            
            const label = document.createElement('div');
            label.className = 'carton-label';
            label.textContent = `CARTON_${c}`;
            
            carton.appendChild(grid);
            carton.appendChild(label);
            eggCanvas.appendChild(carton);
        }
        
        const bin = document.createElement('div');
        bin.className = 'loose-eggs-bin';
        bin.innerHTML = `
            <div style="font-size:0.7rem; color:var(--text-muted); margin-bottom: 4px;">LOOSE_EGGS_TRAY</div>
            <div class="loose-eggs-grid" id="loose-bin-grid"></div>
        `;
        eggCanvas.appendChild(bin);
        
        const looseBin = document.getElementById('loose-bin-grid');
        for (let le = 0; le < 4; le++) {
            const slot = document.createElement('div');
            slot.className = 'egg-slot';
            slot.style.width = '18px';
            const egg = document.createElement('div');
            egg.className = 'egg-node';
            slot.appendChild(egg);
            looseBin.appendChild(slot);
        }

        addLog("Simulator output: 23 cartons packed completely. 4 loose eggs remaining on tray.", "success");
    });

    btnSubmitEggs.addEventListener('click', () => {
        const inputVal = document.getElementById('egg-cartons-input').value.trim();
        const working = document.getElementById('egg-packing-working').value.trim();
        
        if (inputVal === '') {
            sounds.error();
            addLog("Dispatch error: Carton capacity calculation parameter missing.", "error");
            return;
        }

        state.eggCartons = parseInt(inputVal, 10);
        state.eggWorking = working;

        sounds.successNode();
        state.stage3SubStage = 2;
        updateEggerlingView();
    });

    // ----------------------------------------------------
    // SVG Widget 3: Departure Analog Clock Widget (AC9M3M04)
    // ----------------------------------------------------
    function initAnalogClock() {
        const host = document.getElementById('clock-svg-host');
        if (!host) return;

        state.clockHour = 12;
        state.clockMinute = 0;

        const drawClock = () => {
            const cx = 55;
            const cy = 55;
            const r = 48;
            
            const minAngle = state.clockMinute * 6;
            const hourAngle = (state.clockHour % 12) * 30 + state.clockMinute * 0.5;

            let svg = `<svg viewBox="0 0 110 110" style="width:100%; height:100%; overflow:visible; user-select:none;" id="clock-svg">
                <circle cx="${cx}" cy="${cy}" r="${r}" fill="var(--surface-container-low)" stroke="var(--outline-variant)" stroke-width="1.5" />
                <circle cx="${cx}" cy="${cy}" r="3" fill="var(--on-surface)" />
            `;

            for (let i = 0; i < 12; i++) {
                const angleRad = (i * 30) * Math.PI / 180;
                const x1 = cx + (r - 4) * Math.sin(angleRad);
                const y1 = cy - (r - 4) * Math.cos(angleRad);
                const x2 = cx + r * Math.sin(angleRad);
                const y2 = cy - r * Math.cos(angleRad);
                svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--on-surface-variant)" stroke-width="${i % 3 === 0 ? '1.5' : '0.8'}" />`;
            }

            // Hour Hand
            const hRad = hourAngle * Math.PI / 180;
            const hx = cx + 22 * Math.sin(hRad);
            const hy = cy - 22 * Math.cos(hRad);
            svg += `<line x1="${cx}" y1="${cy}" x2="${hx}" y2="${hy}" stroke="var(--on-surface)" stroke-width="3.2" stroke-linecap="round" />`;

            // Minute Hand
            const mRad = minAngle * Math.PI / 180;
            const mx = cx + 33 * Math.sin(mRad);
            const my = cy - 33 * Math.cos(mRad);
            svg += `<line x1="${cx}" y1="${cy}" x2="${mx}" y2="${my}" stroke="var(--primary)" stroke-width="2" stroke-linecap="round" />`;

            svg += `</svg>`;
            host.innerHTML = svg;

            const clockTimeText = document.getElementById('clock-selected-time');
            if (clockTimeText) {
                const padMin = state.clockMinute.toString().padStart(2, '0');
                clockTimeText.textContent = `Time: ${state.clockHour}:${padMin} PM`;
            }

            const svgEl = document.getElementById('clock-svg');
            let isDragging = false;

            const updateTimeFromCoords = (clientX, clientY) => {
                const rect = svgEl.getBoundingClientRect();
                const px = clientX - rect.left - rect.width / 2;
                const py = clientY - rect.top - rect.height / 2;
                const dist = Math.sqrt(px * px + py * py);
                
                let angle = Math.atan2(px, -py) * (180 / Math.PI);
                if (angle < 0) angle += 360;

                if (dist < rect.width * 0.28) {
                    let hour = Math.round(angle / 30);
                    if (hour === 0) hour = 12;
                    if (state.clockHour !== hour) {
                        state.clockHour = hour;
                        sounds.click();
                        drawClock();
                    }
                } else {
                    let minute = Math.round(angle / 6) % 60;
                    if (state.clockMinute !== minute) {
                        state.clockMinute = minute;
                        sounds.click();
                        drawClock();
                    }
                }
            };

            const handleStart = (clientX, clientY) => {
                isDragging = true;
                updateTimeFromCoords(clientX, clientY);
            };

            const handleMove = (clientX, clientY) => {
                if (!isDragging) return;
                updateTimeFromCoords(clientX, clientY);
            };

            const handleEnd = () => {
                if (isDragging) {
                    isDragging = false;
                    checkTimeMatch();
                }
            };

            svgEl.addEventListener('mousedown', (e) => {
                e.preventDefault();
                handleStart(e.clientX, e.clientY);
            });
            window.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    e.preventDefault();
                    handleMove(e.clientX, e.clientY);
                }
            });
            window.addEventListener('mouseup', handleEnd);

            svgEl.addEventListener('touchstart', (e) => {
                e.preventDefault();
                handleStart(e.touches[0].clientX, e.touches[0].clientY);
            });
            window.addEventListener('touchmove', (e) => {
                if (isDragging) {
                    handleMove(e.touches[0].clientX, e.touches[0].clientY);
                }
            }, { passive: false });
            window.addEventListener('touchend', handleEnd);
        };

        const checkTimeMatch = () => {
            if (state.clockHour === 3 && state.clockMinute === 45) {
                sounds.successNode();
                addLog("Clock aligned to departure time: 3:45 PM!", "success");
            }
        };

        const adjustHMinus = document.getElementById('clock-adjust-h-minus');
        const adjustHPlus = document.getElementById('clock-adjust-h-plus');
        const adjustMMinus = document.getElementById('clock-adjust-m-minus');
        const adjustMPlus = document.getElementById('clock-adjust-m-plus');

        adjustHMinus.onclick = () => {
            sounds.click();
            state.clockHour = (state.clockHour - 2 + 12) % 12 + 1;
            drawClock();
            checkTimeMatch();
        };

        adjustHPlus.onclick = () => {
            sounds.click();
            state.clockHour = (state.clockHour % 12) + 1;
            drawClock();
            checkTimeMatch();
        };

        adjustMMinus.onclick = () => {
            sounds.click();
            state.clockMinute -= 5;
            if (state.clockMinute < 0) {
                state.clockMinute += 60;
                state.clockHour = (state.clockHour - 2 + 12) % 12 + 1;
            }
            drawClock();
            checkTimeMatch();
        };

        adjustMPlus.onclick = () => {
            sounds.click();
            state.clockMinute += 5;
            if (state.clockMinute >= 60) {
                state.clockMinute -= 60;
                state.clockHour = (state.clockHour % 12) + 1;
            }
            drawClock();
            checkTimeMatch();
        };

        drawClock();
    }

    // ----------------------------------------------------
    // SVG Widget 4: 5x5 Landmark Path Grid Map (AC9M3SP02)
    // ----------------------------------------------------
    function initDeliveryGridMap() {
        const host = document.getElementById('delivery-grid-svg-host');
        if (!host) return;

        state.vanX = 0;
        state.vanY = 0;
        state.vanCargo = 213;
        state.shopAStatus = 'AWAITING';
        state.shopCStatus = 'AWAITING';
        state.shopBStatus = 'AWAITING';

        const drawGridMap = () => {
            // Coordinate space calculations
            // sx = 30 + px * 45
            // sy = 210 - py * 45
            const origin = 30;
            const step = 45;

            const getSx = (x) => origin + x * step;
            const getSy = (y) => 210 - y * step;

            let svg = `<svg viewBox="0 0 240 240" style="width:100%; height:100%; overflow:visible; user-select:none;" id="delivery-grid-svg">
                <!-- Outer Bounds -->
                <rect x="30" y="30" width="180" height="180" fill="var(--surface)" stroke="var(--outline-variant)" stroke-width="1.5" />
            `;

            // Draw grid lines
            for (let i = 1; i < 4; i++) {
                const pos = origin + i * step;
                svg += `
                    <line x1="${pos}" y1="30" x2="${pos}" y2="210" stroke="var(--outline-variant)" stroke-width="0.5" stroke-dasharray="2 2" />
                    <line x1="30" y1="${pos}" x2="210" y2="${pos}" stroke="var(--outline-variant)" stroke-width="0.5" stroke-dasharray="2 2" />
                `;
            }

            // Draw axis labels
            for (let i = 0; i <= 4; i++) {
                svg += `
                    <text x="${origin + i * step}" y="226" font-family="var(--font-mono)" font-size="9" font-weight="700" text-anchor="middle" fill="var(--on-surface-variant)">${i}</text>
                    <text x="16" y="${210 - i * step + 3}" font-family="var(--font-mono)" font-size="9" font-weight="700" text-anchor="middle" fill="var(--on-surface-variant)">${i}</text>
                `;
            }

            // Draw delivery path segments
            svg += `
                <line x1="${getSx(0)}" y1="${getSy(0)}" x2="${getSx(1)}" y2="${getSy(3)}" stroke="var(--outline)" stroke-width="1.5" stroke-dasharray="3 3" />
                <line x1="${getSx(1)}" y1="${getSy(3)}" x2="${getSx(3)}" y2="${getSy(4)}" stroke="var(--outline)" stroke-width="1.5" stroke-dasharray="3 3" />
                <line x1="${getSx(3)}" y1="${getSy(4)}" x2="${getSx(4)}" y2="${getSy(2)}" stroke="var(--outline)" stroke-width="1.5" stroke-dasharray="3 3" />
            `;

            // Draw Warehouse (0,0)
            svg += `
                <rect x="${getSx(0) - 6}" y="${getSy(0) - 6}" width="12" height="12" fill="var(--tertiary)" rx="1" />
                <text x="${getSx(0)}" y="${getSy(0) - 9}" font-family="'Work Sans', sans-serif" font-size="7" font-weight="700" text-anchor="middle" fill="var(--tertiary)">WH(0,0)</text>
            `;

            // Draw Shop A (1,3)
            const aDel = state.shopAStatus === 'DELIVERED';
            svg += `
                <circle cx="${getSx(1)}" cy="${getSy(3)}" r="6" fill="${aDel ? 'var(--primary)' : 'var(--surface-container-highest)'}" stroke="var(--primary)" stroke-width="1.5" />
                <text x="${getSx(1)}" y="${getSy(3) - 9}" font-family="'Work Sans', sans-serif" font-size="7" font-weight="700" text-anchor="middle" fill="${aDel ? 'var(--primary)' : 'var(--on-surface-variant)'}">Shop A(1,3)</text>
            `;

            // Draw Shop C (3,4)
            const cDel = state.shopCStatus === 'DELIVERED';
            svg += `
                <circle cx="${getSx(3)}" cy="${getSy(4)}" r="6" fill="${cDel ? 'var(--primary)' : 'var(--surface-container-highest)'}" stroke="var(--primary)" stroke-width="1.5" />
                <text x="${getSx(3)}" y="${getSy(4) - 9}" font-family="'Work Sans', sans-serif" font-size="7" font-weight="700" text-anchor="middle" fill="${cDel ? 'var(--primary)' : 'var(--on-surface-variant)'}">Shop C(3,4)</text>
            `;

            // Draw Shop B (4,2)
            const bDel = state.shopBStatus === 'DELIVERED';
            svg += `
                <circle cx="${getSx(4)}" cy="${getSy(2)}" r="6" fill="${bDel ? 'var(--primary)' : 'var(--surface-container-highest)'}" stroke="var(--primary)" stroke-width="1.5" />
                <text x="${getSx(4)}" y="${getSy(2) - 9}" font-family="'Work Sans', sans-serif" font-size="7" font-weight="700" text-anchor="middle" fill="${bDel ? 'var(--primary)' : 'var(--on-surface-variant)'}">Shop B(4,2)</text>
            `;

            // Status Panel Overlay in SVG
            svg += `
                <rect x="35" y="35" width="105" height="42" fill="var(--surface-container-low)" opacity="0.9" rx="3" stroke="var(--outline-variant)" stroke-width="0.5" />
                <text x="40" y="46" font-family="var(--font-mono)" font-size="6.5" font-weight="700" fill="var(--on-surface)">RADAR_STATUS</text>
                <text x="40" y="55" font-family="var(--font-mono)" font-size="6.5" fill="var(--primary)">Cargo: ${state.vanCargo} crt</text>
                <text x="40" y="64" font-family="var(--font-mono)" font-size="6.5" fill="var(--on-surface-variant)">Pos: (${state.vanX.toFixed(1)}, ${state.vanY.toFixed(1)})</text>
                <text x="40" y="73" font-family="var(--font-mono)" font-size="5.5" fill="var(--tertiary)">A: ${state.shopAStatus} | C: ${state.shopCStatus} | B: ${state.shopBStatus}</text>
            `;

            // Draw Van Node
            svg += `
                <circle cx="${getSx(state.vanX)}" cy="${getSy(state.vanY)}" r="7.5" fill="var(--primary)" stroke="var(--surface)" stroke-width="1.5" />
                <circle cx="${getSx(state.vanX)}" cy="${getSy(state.vanY)}" r="2.5" fill="var(--on-primary)" />
            </svg>`;

            host.innerHTML = svg;
        };

        btnRunDelivery.onclick = () => {
            if (state.vanDeliveryRan) return;
            sounds.engineHum();
            state.vanDeliveryRan = true;

            const path = [
                { x: 0.0, y: 0.0 }, // WH
                { x: 1.0, y: 3.0 }, // Shop A
                { x: 3.0, y: 4.0 }, // Shop C
                { x: 4.0, y: 2.0 }  // Shop B
            ];

            let segment = 0;
            let percent = 0.0;

            const animateRoute = () => {
                percent += 0.035;
                if (percent >= 1.0) {
                    percent = 0.0;
                    segment++;
                    
                    if (segment === 1) {
                        state.shopAStatus = 'DELIVERED';
                        state.vanCargo = 203;
                        sounds.successNode();
                        addLog("Shop A delivery complete. 10 cartons unloaded. Remaining: 203.", "system");
                    } else if (segment === 2) {
                        state.shopCStatus = 'DELIVERED';
                        state.vanCargo = 193;
                        sounds.successNode();
                        addLog("Shop C delivery complete. 10 cartons unloaded. Remaining: 193.", "system");
                    } else if (segment === 3) {
                        state.shopBStatus = 'DELIVERED';
                        state.vanCargo = 183;
                        sounds.successNode();
                        addLog("Shop B delivery complete. 10 cartons unloaded. Remaining: 183.", "system");
                    }
                }

                if (segment < 3) {
                    const startPt = path[segment];
                    const endPt = path[segment + 1];
                    state.vanX = startPt.x + (endPt.x - startPt.x) * percent;
                    state.vanY = startPt.y + (endPt.y - startPt.y) * percent;
                    drawGridMap();
                    requestAnimationFrame(animateRoute);
                } else {
                    state.vanX = path[3].x;
                    state.vanY = path[3].y;
                    drawGridMap();
                    
                    const vanLeftInput = document.getElementById('van-left-input');
                    if (vanLeftInput) {
                        vanLeftInput.value = 183;
                        state.vanLeft = 183;
                    }
                    sounds.successNode();
                    addLog("All delivery drops complete. Cartons remaining: 183.", "success");
                }
            };

            animateRoute();
        };

        drawGridMap();
    }

    btnPrevEggerling.addEventListener('click', () => {
        state.stage3SubStage = 1;
        sounds.click();
        updateEggerlingView();
    });

    btnSubmitDelivery.addEventListener('click', () => {
        const inputVal = document.getElementById('van-left-input').value.trim();
        
        if (inputVal === '') {
            sounds.error();
            addLog("Dispatch error: Remaining cargo capacity field missing.", "error");
            return;
        }

        state.vanLeft = parseInt(inputVal, 10);

        sounds.stageComplete();
        transitionToStage('4');
    });

    // ----------------------------------------------------
    // 8. Stage 4: Diagnostics & Auto Grading (30 Marks)
    // ----------------------------------------------------
    const reportScore = document.getElementById('report-score');
    const reportTableBody = document.getElementById('report-table-body');
    const reportFeedback = document.getElementById('report-feedback');
    const btnResetApp = document.getElementById('btn-reset-app');

    function compileReport() {
        const grading = [];
        let totalScore = 0;
        let maxScore = 0;

        // 1. Part A: Recall Fluency (20 Marks)
        let recallCorrectCount = 0;
        for (let i = 0; i < state.recallQuestions.length; i++) {
            if (state.recallAnswers[i] === state.recallQuestions[i].ans) {
                recallCorrectCount++;
            }
        }
        totalScore += recallCorrectCount;
        maxScore += 20;
        grading.push({
            test: "PART_A: FACT_RECALL",
            concept: "Addition and subtraction recall facts",
            status: `${recallCorrectCount} / 20 Correct`,
            score: `${recallCorrectCount} / 20`
        });

        // 2. Part B: Dale's Calculator (1 Mark)
        let calcScore = 0;
        let calcStatus = "Incorrect";
        if (state.calcChoice === 'add-10') {
            calcScore = 1;
            calcStatus = "Calibrated";
        }
        totalScore += calcScore;
        maxScore += 1;
        grading.push({
            test: "PART_B: CALIBRATOR_HACK",
            concept: "Regrouping and shifting digits by 10",
            status: calcStatus,
            score: `${calcScore} / 1`
        });

        // 3. Part B: Fraction Plotter (1 Mark)
        let fractionScore = 0;
        let fractionStatus = "Incorrect";
        if (state.fractionPlotterVal === 0.75) {
            fractionScore = 1;
            fractionStatus = "Calibrated";
        }
        totalScore += fractionScore;
        maxScore += 1;
        grading.push({
            test: "PART_B: FRACTION_PLOTTER",
            concept: "Representing fractions on a number line",
            status: fractionStatus,
            score: `${fractionScore} / 1`
        });

        // 4. Part B: Accordion Expander (2 Marks)
        let expScore = 0;
        if (state.expanderTens === 95) expScore += 1;
        if (state.expanderOnes === 2) expScore += 1;
        totalScore += expScore;
        maxScore += 2;
        grading.push({
            test: "PART_B: ACCORDION_EXPANDER",
            concept: "Equivalent place value partitions",
            status: `${expScore} / 2 Validated`,
            score: `${expScore} / 2`
        });

        // 5. Part B: Core Registers (3 Marks)
        let h702Score = 0;
        if (state.hundreds702 === 7) h702Score = 1;
        
        let tenLessScore = 0;
        if (state.tenLess952 === 942) tenLessScore = 1;
        
        let thirtyFourScore = 0;
        if (state.thirtyFourTens === 340) thirtyFourScore = 1;

        const coreScore = h702Score + tenLessScore + thirtyFourScore;
        totalScore += coreScore;
        maxScore += 3;
        grading.push({
            test: "PART_B: CORE_REGISTERS",
            concept: "Identifying values, subtraction, regrouping",
            status: `${coreScore} / 3 Correct`,
            score: `${coreScore} / 3`
        });

        // 6. Stage 3: Egg Packer (1 Mark)
        let cartonScore = 0;
        let cartonStatus = "Incorrect";
        if (state.eggCartons === 23 || state.eggCartons === 24) {
            cartonScore = 1;
            cartonStatus = "Calculated";
        }
        totalScore += cartonScore;
        maxScore += 1;
        grading.push({
            test: "PART_C: EGG_CAPACITY",
            concept: "Grouping base-10 units into sets of 10",
            status: cartonStatus,
            score: `${cartonScore} / 1`
        });

        // 7. Stage 3: Van Delivery remaining (1 Mark)
        let deliveryScore = 0;
        let deliveryStatus = "Incorrect";
        if (state.vanLeft === 183) {
            deliveryScore = 1;
            deliveryStatus = "Dispatched";
        }
        totalScore += deliveryScore;
        maxScore += 1;
        grading.push({
            test: "PART_C: DELIVERY_DISPATCH",
            concept: "Repeated subtraction problem-solving",
            status: deliveryStatus,
            score: `${deliveryScore} / 1`
        });

        // 8. Stage 3: Departure Clock (1 Mark)
        let clockScore = 0;
        let clockStatus = "Incorrect";
        if (state.clockHour === 3 && state.clockMinute === 45) {
            clockScore = 1;
            clockStatus = "Aligned";
        }
        totalScore += clockScore;
        maxScore += 1;
        grading.push({
            test: "PART_C: DEPARTURE_CLOCK",
            concept: "Setting analog clocks to the minute",
            status: clockStatus,
            score: `${clockScore} / 1`
        });

        // Render report
        reportScore.textContent = `${totalScore} / ${maxScore}`;
        reportTableBody.innerHTML = '';
        grading.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="padding: 10px 8px; font-weight:600;">${row.test}</td>
                <td style="padding: 10px 8px; color:var(--on-surface-variant); font-size:0.75rem;">${row.concept}</td>
                <td style="padding: 10px 8px; color: ${row.score.startsWith('0') ? 'var(--red)' : 'var(--green)'}">${row.status}</td>
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
                
                if (!parsed.scoresByCatY3) {
                    parsed.scoresByCatY3 = { number: 0, algebra: 0, measurement: 0, space: 0, statistics: 0, probability: 0 };
                }
                parsed.scoresByCatY3.algebra = (parsed.scoresByCatY3.algebra || 0) + recallCorrectCount * 10;
                
                const numScore = calcScore + expScore + coreScore + cartonScore + deliveryScore;
                parsed.scoresByCatY3.number = (parsed.scoresByCatY3.number || 0) + numScore * 10;
                
                const spaceScore = (state.vanDeliveryRan ? 1 : 0);
                parsed.scoresByCatY3.space = (parsed.scoresByCatY3.space || 0) + spaceScore * 10;
                
                const measScore = clockScore;
                parsed.scoresByCatY3.measurement = (parsed.scoresByCatY3.measurement || 0) + measScore * 10;

                localStorage.setItem('joshua_math_profile', JSON.stringify(parsed));
                addLog("Assessment diagnostics synced with user profile.", "success");
            } catch(e) {
                console.error("Profile sync failed: ", e);
            }
        }

        // Generate teacher feedback
        let feedback = '';
        if (totalScore === maxScore) {
            feedback = "EXCELLENT PERFORMANCE: All terminal calibration metrics are operational. The student has shown a complete mastery of additive recall facts, fraction number line plots, regrouping through number expanders, calculator offsets, analog clock alignments, and coordinate grid pathing.";
        } else {
            feedback = "DIAGNOSTICS ADVISORY: System calibration is incomplete. ";
            const gaps = [];
            if (recallCorrectCount < 16) {
                gaps.push("remediate addition and subtraction recall fact fluency (Part A)");
            }
            if (calcScore < 1 || fractionScore < 1 || expScore < 2 || coreScore < 3) {
                gaps.push("reinforce place value digit shifting, accordion number expanding, and plotting fractions (Part B)");
            }
            if (cartonScore < 1 || deliveryScore < 1 || clockScore < 1) {
                gaps.push("practise carton packaging divisions, coordinate grid pathing, and setting analog clock face times (Part C)");
            }
            feedback += "Suggested remediation paths: " + gaps.join(', ') + ".";
        }
        reportFeedback.textContent = feedback;
    }

    btnResetApp.addEventListener('click', () => {
        state.calcChoice = '';
        state.calcExplanation = '';
        state.fractionPlotterVal = 0.0;
        state.expanderHCollapsed = false;
        state.expanderTCollapsed = false;
        state.expanderTens = null;
        state.expanderOnes = null;
        state.hundreds702 = null;
        state.tenLess952 = null;
        state.thirtyFourTens = null;
        state.eggCartons = null;
        state.eggWorking = '';
        state.vanLeft = null;
        state.clockHour = 12;
        state.clockMinute = 0;
        state.eggPackerRan = false;
        state.vanDeliveryRan = false;
        
        document.querySelectorAll('input[type="number"]').forEach(el => el.value = '');
        document.querySelectorAll('input[type="text"]').forEach(el => el.value = '');
        document.querySelectorAll('textarea').forEach(el => el.value = '');
        document.querySelectorAll('input[type="radio"]').forEach(el => el.checked = false);
        
        calcCurrentVal = 796;
        calcReadout.textContent = '796';
        
        eggCanvas.innerHTML = '';
        
        document.querySelectorAll('.tracker-node').forEach(node => {
            node.classList.remove('complete');
            node.classList.remove('active');
        });

        transitionToStage('intro');
    });

    document.getElementById('btn-start-assessment').addEventListener('click', () => {
        transitionToStage('1');
    });

    transitionToStage('intro');
});
