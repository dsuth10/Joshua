/**
 * Maths Command Station - State and Logic Engine
 * Optimized for small laptop viewports and Year 3 mathematics assessment
 */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. Core State Definition
    // ----------------------------------------------------
    const state = {
        activeStage: 'intro', // 'intro', 'stage-1', 'stage-2', 'stage-3', 'stage-4'
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
        hundreds702: null,    // User input
        expanderTens: null,   // User input
        expanderOnes: null,   // User input
        hundreds952: null,    // User input
        tenLess952: null,     // User input
        thirtyFourTens: null, // User input
        
        // Stage 3: Eggerling's Eggs
        eggCartons: null,     // User input
        eggWorking: '',       // Text explanation
        vanLeft: null,        // User input
        vanWorking: '',       // Text explanation
        
        // Simulation Animation Flags
        eggPackerRan: false,
        vanDeliveryRan: false
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
            // Short mechanical synth sweep
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
        
        // Keep logs clean and bounded
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
        
        // Progress UI
        const progressPercentage = (state.currentRecallIndex / state.recallQuestions.length) * 100;
        equationProgress.style.width = `${progressPercentage}%`;
        equationCounter.textContent = `QUESTION ${state.currentRecallIndex + 1} OF ${state.recallQuestions.length}`;
        
        addLog(`Calibrating Fact ${state.currentRecallIndex + 1}: ${currentQ.eq} = ?`, "input");
    }

    // Keypad and keyboard handling for Recall
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

    // Keyboard bindings for numerical entry
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
            labInstruction.textContent = "CALIBRATOR DIAGNOSTICS: Run calculations to verify how to change 796 into 806.";
            addLog("Calibrator Diagnostic interface booted.", "system");
        } else if (state.stage2SubStation === 2) {
            labInstruction.textContent = "CORE REGISTER CALIBRATION: Determine the number of hundreds in 702.";
            addLog("Register 702 calibration active.", "system");
        } else if (state.stage2SubStation === 3) {
            labInstruction.textContent = "ACCORDION EXPANDER: Test partition combinations on the expander device.";
            addLog("Accordion Expander 952 active.", "system");
        } else if (state.stage2SubStation === 4) {
            labInstruction.textContent = "FINAL CALIBRATION: Solve hundreds count, subtraction bounds, and tens grouping.";
            addLog("Final place value diagnostic registers active.", "system");
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
        // Validation per substation before proceeding
        if (validateSubstation(state.stage2SubStation)) {
            if (state.stage2SubStation < 4) {
                state.stage2SubStation++;
                sounds.successNode();
                updateSubstationView();
            } else {
                // Save and move to Stage 3
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
            const hundreds702Val = document.getElementById('val-702-hundreds').value.trim();
            if (hundreds702Val === '') return false;
            state.hundreds702 = parseInt(hundreds702Val, 10);
            return true;
        } else if (num === 3) {
            const tensVal = document.getElementById('exp-952-tens').value.trim();
            const onesVal = document.getElementById('exp-952-ones').value.trim();
            if (tensVal === '' || onesVal === '') return false;
            state.expanderTens = parseInt(tensVal, 10);
            state.expanderOnes = parseInt(onesVal, 10);
            return true;
        } else if (num === 4) {
            const hundreds952Val = document.getElementById('val-952-hundreds').value.trim();
            const tenLessVal = document.getElementById('val-952-ten-less').value.trim();
            const thirtyFourVal = document.getElementById('val-34-tens').value.trim();
            if (hundreds952Val === '' || tenLessVal === '' || thirtyFourVal === '') return false;
            
            state.hundreds952 = parseInt(hundreds952Val, 10);
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

            // Automatically check matching radio button when student adjusts calculator to 806
            if (calcCurrentVal === 806) {
                document.getElementById('calc-c2').checked = true;
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

    // Sub-station 3: Accordion Number Expander Simulation
    const blockH = document.getElementById('block-hundreds');
    const blockT = document.getElementById('block-tens');
    const numH = document.getElementById('num-exp-h');
    const numT = document.getElementById('num-exp-t');
    const numO = document.getElementById('num-exp-o');

    document.getElementById('joint-h').addEventListener('click', () => {
        sounds.click();
        blockH.classList.toggle('collapsed');
        updateExpanderVisuals();
    });

    document.getElementById('joint-t').addEventListener('click', () => {
        sounds.click();
        blockT.classList.toggle('collapsed');
        updateExpanderVisuals();
    });

    function updateExpanderVisuals() {
        const hCollapsed = blockH.classList.contains('collapsed');
        const tCollapsed = blockT.classList.contains('collapsed');

        // Initial base state
        numH.textContent = "9";
        numT.textContent = "5";
        numO.textContent = "2";

        if (hCollapsed && tCollapsed) {
            // Both collapsed -> merges all to ones: 952 ones
            numO.textContent = "952";
            addLog("Expander collapsed completely: 952 ones.", "system");
        } else if (hCollapsed) {
            // Hundreds collapsed -> merges to tens: 95 tens
            numT.textContent = "95";
            addLog("Expander folded hundreds joint: 95 tens, 2 ones.", "system");
        } else if (tCollapsed) {
            // Tens collapsed -> merges tens to ones: 52 ones
            numO.textContent = "52";
            addLog("Expander folded tens joint: 9 hundreds, 52 ones.", "system");
        } else {
            addLog("Expander fully expanded: 9 hundreds, 5 tens, 2 ones.", "system");
        }
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
            initDeliveryVanMap();
        }
    }

    // Stage 3 Sub-stage 1: Egg Packing
    btnRunPacker.addEventListener('click', () => {
        sounds.engineHum();
        eggCanvas.innerHTML = ''; // Clear packer display
        state.eggPackerRan = true;
        
        // Render 23 cartons of 10 eggs
        for (let c = 1; c <= 23; c++) {
            const carton = document.createElement('div');
            carton.className = 'egg-carton packed';
            
            const grid = document.createElement('div');
            grid.className = 'carton-grid';
            
            // Draw 10 egg nodes inside carton
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
        
        // Render loose bin with 4 eggs
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

    // Stage 3 Sub-stage 2: Delivery Van
    const vanNode = document.getElementById('delivery-van');
    const vanCrateCount = document.getElementById('van-crate-count');
    const btnRunDelivery = document.getElementById('btn-run-delivery');

    function initDeliveryVanMap() {
        vanNode.style.bottom = '15px';
        vanNode.style.left = '15px';
        vanCrateCount.textContent = '213';
        document.querySelectorAll('.shop-node').forEach(shop => {
            shop.classList.remove('delivered');
        });
        document.getElementById('shop-a-status').textContent = 'AWAITING';
        document.getElementById('shop-b-status').textContent = 'AWAITING';
        document.getElementById('shop-c-status').textContent = 'AWAITING';
    }

    btnRunDelivery.addEventListener('click', () => {
        if (state.vanDeliveryRan) return;
        sounds.engineHum();
        state.vanDeliveryRan = true;

        // Drive route: Dispatch -> Shop 1 -> Shop 3 -> Shop 2
        // Shop 1 coords: top 20%, left 15%
        // Shop 3 coords: top 25%, left 60%
        // Shop 2 coords: top 60%, left 75%
        
        // Shop A delivery
        setTimeout(() => {
            vanNode.style.top = '20%';
            vanNode.style.left = '15%';
            playSound(400, 0.2, 'sawtooth', 0.05);
        }, 100);

        setTimeout(() => {
            document.getElementById('shop-node-1').classList.add('delivered');
            document.getElementById('shop-a-status').textContent = 'DELIVERED';
            vanCrateCount.textContent = '203';
            playSound(550, 0.15, 'sine', 0.08);
            addLog("Shop A delivery complete. 10 cartons unloaded. Remaining: 203.", "system");
        }, 1300);

        // Shop C delivery
        setTimeout(() => {
            vanNode.style.top = '25%';
            vanNode.style.left = '60%';
            playSound(400, 0.2, 'sawtooth', 0.05);
        }, 2000);

        setTimeout(() => {
            document.getElementById('shop-node-3').classList.add('delivered');
            document.getElementById('shop-c-status').textContent = 'DELIVERED';
            vanCrateCount.textContent = '193';
            playSound(550, 0.15, 'sine', 0.08);
            addLog("Shop C delivery complete. 10 cartons unloaded. Remaining: 193.", "system");
        }, 3200);

        // Shop B delivery
        setTimeout(() => {
            vanNode.style.top = '60%';
            vanNode.style.left = '75%';
            playSound(400, 0.2, 'sawtooth', 0.05);
        }, 3900);

        setTimeout(() => {
            document.getElementById('shop-node-2').classList.add('delivered');
            document.getElementById('shop-b-status').textContent = 'DELIVERED';
            vanCrateCount.textContent = '183';
            playSound(550, 0.15, 'sine', 0.08);
            addLog("Shop B delivery complete. 10 cartons unloaded. Remaining: 183.", "system");
            sounds.successNode();
        }, 5100);
    });

    btnPrevEggerling.addEventListener('click', () => {
        state.stage3SubStage = 1;
        sounds.click();
        updateEggerlingView();
    });

    btnSubmitDelivery.addEventListener('click', () => {
        const inputVal = document.getElementById('van-left-input').value.trim();
        const working = document.getElementById('van-delivery-working').value.trim();

        if (inputVal === '') {
            sounds.error();
            addLog("Dispatch error: Remaining cargo capacity field missing.", "error");
            return;
        }

        state.vanLeft = parseInt(inputVal, 10);
        state.vanWorking = working;

        sounds.stageComplete();
        transitionToStage('4');
    });

    // ----------------------------------------------------
    // 8. Stage 4: Diagnostics & Auto Grading
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

        // 2. Part B: Dale's Calculator
        let calcScore = 0;
        let calcStatus = "Incorrect";
        if (state.calcChoice === 'add-10') {
            calcScore += 1;
            calcStatus = "Calibrated";
        }
        // Check explanation completeness
        if (state.calcExplanation.length >= 8) {
            calcScore += 1;
            if (calcStatus === "Calibrated") calcStatus = "Fully Calibrated";
            else calcStatus = "Explain Only";
        }
        totalScore += calcScore;
        maxScore += 2;
        grading.push({
            test: "PART_B: CALIBRATOR_HACK",
            concept: "Regrouping and shifting digits by 10",
            status: calcStatus,
            score: `${calcScore} / 2`
        });

        // 3. Hundreds in 702
        let h702Score = 0;
        if (state.hundreds702 === 7) {
            h702Score = 1;
        }
        totalScore += h702Score;
        maxScore += 1;
        grading.push({
            test: "PART_B: REGISTER_702",
            concept: "Identifying place value digits (Hundreds)",
            status: h702Score ? "Correct" : "Incorrect",
            score: `${h702Score} / 1`
        });

        // 4. Number Expander 952 (2 Marks: 1 for tens, 1 for ones)
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

        // 5. Hundreds in 952
        let h952Score = 0;
        if (state.hundreds952 === 9) h952Score = 1;
        totalScore += h952Score;
        maxScore += 1;
        grading.push({
            test: "PART_B: REGISTER_952_H",
            concept: "Identifying place value digits (Hundreds)",
            status: h952Score ? "Correct" : "Incorrect",
            score: `${h952Score} / 1`
        });

        // 6. 10 Less than 952
        let tenLessScore = 0;
        if (state.tenLess952 === 942) tenLessScore = 1;
        totalScore += tenLessScore;
        maxScore += 1;
        grading.push({
            test: "PART_B: TEN_LESS_CALIBRATION",
            concept: "Shifting 10 down across 3 digits",
            status: tenLessScore ? "Correct" : "Incorrect",
            score: `${tenLessScore} / 1`
        });

        // 7. 34 Tens
        let thirtyFourScore = 0;
        if (state.thirtyFourTens === 340) thirtyFourScore = 1;
        totalScore += thirtyFourScore;
        maxScore += 1;
        grading.push({
            test: "PART_B: REGISTRY_34_TENS",
            concept: "Reassembling grouped units to standard form",
            status: thirtyFourScore ? "Correct" : "Incorrect",
            score: `${thirtyFourScore} / 1`
        });

        // 8. Stage 3: Eggerling Cartons
        let cartonScore = 0;
        let cartonStatus = "Incorrect";
        // 23 is correct for division, 24 is also acceptable if working indicates packaging all 234 eggs
        if (state.eggCartons === 23 || state.eggCartons === 24) {
            cartonScore += 1;
            cartonStatus = "Calculated";
        }
        if (state.eggWorking.length >= 8) {
            cartonScore += 1;
            if (cartonStatus === "Calculated") cartonStatus = "Fully Documented";
            else cartonStatus = "Working Only";
        }
        totalScore += cartonScore;
        maxScore += 2;
        grading.push({
            test: "PART_C: EGG_CAPACITY",
            concept: "Grouping base-10 units into sets of 10",
            status: cartonStatus,
            score: `${cartonScore} / 2`
        });

        // 9. Stage 3: Van Delivery remaining
        let deliveryScore = 0;
        let deliveryStatus = "Incorrect";
        if (state.vanLeft === 183) {
            deliveryScore += 1;
            deliveryStatus = "Dispatched";
        }
        if (state.vanWorking.length >= 8) {
            deliveryScore += 1;
            if (deliveryStatus === "Dispatched") deliveryStatus = "Fully Documented";
            else deliveryStatus = "Working Only";
        }
        totalScore += deliveryScore;
        maxScore += 2;
        grading.push({
            test: "PART_C: DELIVERY_DISPATCH",
            concept: "Repeated subtraction problem-solving",
            status: deliveryStatus,
            score: `${deliveryScore} / 2`
        });

        // Render report
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

        // Generate teacher feedback
        let feedback = '';
        if (totalScore === maxScore) {
            feedback = "EXCELLENT PERFORMANCE: All terminal calibration metrics are operational. The student has shown a complete mastery of additive recall facts, regrouping through number expanders, calculator offsets, and base-10 partitioning calculations.";
        } else {
            feedback = "DIAGNOSTICS ADVISORY: System calibration is incomplete. ";
            const gaps = [];
            if (recallCorrectCount < 16) {
                gaps.push("remediate addition and subtraction recall fact fluency (Part A)");
            }
            if (calcScore < 2 || h702Score === 0 || expScore < 2 || h952Score === 0 || tenLessScore === 0 || thirtyFourScore === 0) {
                gaps.push("reinforce three-digit place value partitioning using number expanders and digit-shift exercises (Part B)");
            }
            if (cartonScore < 2 || deliveryScore < 2) {
                gaps.push("practise partitioning groupings and repeated subtraction problem-solving scenarios (Part C)");
            }
            feedback += "Suggested remediation paths: " + gaps.join(', ') + ".";
        }
        reportFeedback.textContent = feedback;
    }

    btnResetApp.addEventListener('click', () => {
        state.calcChoice = '';
        state.calcExplanation = '';
        state.hundreds702 = null;
        state.expanderTens = null;
        state.expanderOnes = null;
        state.hundreds952 = null;
        state.tenLess952 = null;
        state.thirtyFourTens = null;
        state.eggCartons = null;
        state.eggWorking = '';
        state.vanLeft = null;
        state.vanWorking = '';
        state.eggPackerRan = false;
        state.vanDeliveryRan = false;
        
        // Reset HTML forms
        document.querySelectorAll('input[type="number"]').forEach(el => el.value = '');
        document.querySelectorAll('input[type="text"]').forEach(el => el.value = '');
        document.querySelectorAll('textarea').forEach(el => el.value = '');
        document.querySelectorAll('input[type="radio"]').forEach(el => el.checked = false);
        
        calcCurrentVal = 796;
        calcReadout.textContent = '796';
        
        blockH.className = 'expander-block';
        blockT.className = 'expander-block';
        updateExpanderVisuals();
        
        eggCanvas.innerHTML = '';
        initDeliveryVanMap();
        
        // Reset Tracker Complete classes
        document.querySelectorAll('.tracker-node').forEach(node => node.classList.remove('complete'));

        transitionToStage('intro');
    });

    // Start assessment handler
    document.getElementById('btn-start-assessment').addEventListener('click', () => {
        transitionToStage('1');
    });

    // Initialise intro view
    transitionToStage('intro');
});
