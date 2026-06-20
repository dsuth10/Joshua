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

    if (typeof MCS !== 'undefined' && MCS.audio) {
        MCS.audio.register(playSound);
    }

    // ----------------------------------------------------
    // 3b. MCS Widget Instances (Phase 4d assessment migration)
    // ----------------------------------------------------
    let fractionWidget = null;

    function fractionValToDisplay(val) {
        if (val === 0) return '0/4';
        if (val === 0.25) return '1/4';
        if (val === 0.5) return '2/4';
        if (val === 0.75) return '3/4';
        if (val === 1) return '4/4';
        return '0/4';
    }

    function updateFractionReadout(val) {
        const el = document.getElementById('fraction-selected-val');
        if (el) {
            el.textContent = fractionValToDisplay(val);
            el.style.color = 'var(--primary)';
        }
    }

    function destroyFractionWidget() {
        if (fractionWidget) {
            fractionWidget.destroy();
            fractionWidget = null;
        }
        const mount = document.getElementById('fraction-plotter-mount');
        if (mount) mount.innerHTML = '';
    }

    function mountFractionWidget() {
        if (typeof MCS === 'undefined') return;
        destroyFractionWidget();
        const mount = document.getElementById('fraction-plotter-mount');
        if (!mount) return;
        const inner = document.createElement('div');
        inner.style.width = '100%';
        mount.appendChild(inner);

        state.fractionPlotterVal = 0.0;

        fractionWidget = MCS.create('number-line', inner, {
            mode: 'place-point',
            band: 'B',
            min: 0,
            max: 1,
            snapStep: 0.25,
            fractionDenominator: 4,
            showFractionLabels: true,
            ticks: { major: 1, minor: 0.25, labels: 'all' },
            initialValue: 0,
        });

        fractionWidget.onChange((val) => {
            const prev = state.fractionPlotterVal;
            state.fractionPlotterVal = val;
            updateFractionReadout(val);
            if (val === 0.75 && prev !== 0.75) {
                sounds.successNode();
                addLog("Fraction calibrated to 3/4!", "success");
            }
        });
        updateFractionReadout(0);
    }

    let accordionWidget = null;

    function destroyAccordionWidget() {
        if (accordionWidget) {
            accordionWidget.destroy();
            accordionWidget = null;
        }
        const mount = document.getElementById('accordion-expander-mount');
        if (mount) mount.innerHTML = '';
    }

    function mountAccordionWidget() {
        if (typeof MCS === 'undefined') return;
        destroyAccordionWidget();
        const mount = document.getElementById('accordion-expander-mount');
        if (!mount) return;
        const inner = document.createElement('div');
        inner.style.width = '100%';
        inner.style.maxWidth = '480px';
        mount.appendChild(inner);

        accordionWidget = MCS.create('place-value-blocks', inner, {
            mode: 'accordion-integer',
            band: 'B',
            number: 952,
            joints: ['hundreds', 'tens'],
        });

        accordionWidget.onChange((payload) => {
            if (payload && payload.logMessage) {
                addLog(payload.logMessage, 'system');
            }
        });
    }

    let clockWidget = null;

    function destroyClockWidget() {
        if (clockWidget) {
            clockWidget.destroy();
            clockWidget = null;
        }
        const mount = document.getElementById('clock-widget-mount');
        if (mount) mount.innerHTML = '';
    }

    function updateClockReadout() {
        const el = document.getElementById('clock-selected-time');
        if (el) {
            const padMin = state.clockMinute.toString().padStart(2, '0');
            el.textContent = `Time: ${state.clockHour}:${padMin} PM`;
        }
    }

    function checkClockTimeMatch() {
        if (state.clockHour === 3 && state.clockMinute === 45) {
            sounds.successNode();
            addLog("Clock aligned to departure time: 3:45 PM!", "success");
        }
    }

    function syncClockFromWidget() {
        if (!clockWidget) return;
        const v = clockWidget.getValue();
        state.clockHour = v.hours;
        state.clockMinute = v.minutes;
        updateClockReadout();
        checkClockTimeMatch();
    }

    function mountClockWidget() {
        if (typeof MCS === 'undefined') return;
        destroyClockWidget();
        const mount = document.getElementById('clock-widget-mount');
        if (!mount) return;
        const inner = document.createElement('div');
        inner.style.width = '100%';
        inner.style.height = '100%';
        mount.appendChild(inner);

        state.clockHour = 12;
        state.clockMinute = 0;

        clockWidget = MCS.create('analog-clock', inner, {
            mode: 'set-time',
            band: 'B',
            gear: true,
            snapMinutes: 5,
            hours: 12,
            minutes: 0,
        });

        clockWidget.onChange(() => {
            syncClockFromWidget();
        });
        syncClockFromWidget();
    }

    let deliveryWidget = null;

    function destroyDeliveryWidget() {
        if (deliveryWidget) {
            deliveryWidget.destroy();
            deliveryWidget = null;
        }
        const mount = document.getElementById('delivery-grid-mount');
        if (mount) mount.innerHTML = '';
    }

    function syncDeliveryFromWidget(payload) {
        if (!payload) return;
        if (payload.vanPosition) {
            state.vanX = payload.vanPosition.x;
            state.vanY = payload.vanPosition.y;
        }
        if (payload.vanCargo != null) state.vanCargo = payload.vanCargo;
        if (payload.shopStatus) {
            if (payload.shopStatus.A) state.shopAStatus = payload.shopStatus.A;
            if (payload.shopStatus.C) state.shopCStatus = payload.shopStatus.C;
            if (payload.shopStatus.B) state.shopBStatus = payload.shopStatus.B;
        }
    }

    function mountDeliveryWidget() {
        if (typeof MCS === 'undefined') return;
        destroyDeliveryWidget();
        const mount = document.getElementById('delivery-grid-mount');
        if (!mount) return;

        state.vanX = 0;
        state.vanY = 0;
        state.vanCargo = 213;
        state.shopAStatus = 'AWAITING';
        state.shopCStatus = 'AWAITING';
        state.shopBStatus = 'AWAITING';
        state.vanDeliveryRan = false;

        const inner = document.createElement('div');
        inner.style.width = '100%';
        inner.style.height = '100%';
        inner.style.minHeight = '200px';
        mount.appendChild(inner);

        deliveryWidget = MCS.create('coordinate-plotter', inner, {
            mode: 'path-rover',
            band: 'B',
            xMin: 0,
            xMax: 4,
            yMin: 0,
            yMax: 4,
            quadrants: 1,
            labels: 'all',
            landmarks: [
                { x: 0, y: 0, label: 'WH(0,0)', kind: 'warehouse' },
                { x: 1, y: 3, label: 'Shop A(1,3)', shopKey: 'A' },
                { x: 3, y: 4, label: 'Shop C(3,4)', shopKey: 'C' },
                { x: 4, y: 2, label: 'Shop B(4,2)', shopKey: 'B' },
            ],
            routePath: [
                { x: 0, y: 0 },
                { x: 1, y: 3 },
                { x: 3, y: 4 },
                { x: 4, y: 2 },
            ],
            cargoSchedule: [213, 203, 193, 183],
        });

        deliveryWidget.onChange((payload) => {
            syncDeliveryFromWidget(payload);
        });
        syncDeliveryFromWidget(deliveryWidget.getValue());
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

        if (stageKey !== '2') {
            destroyFractionWidget();
            destroyAccordionWidget();
        }
        if (stageKey !== '3') {
            destroyClockWidget();
            destroyDeliveryWidget();
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
            mountFractionWidget();
        } else if (state.stage2SubStation === 3) {
            labInstruction.textContent = "ACCORDION EXPANDER: Click joints to fold and unfold equivalent groupings.";
            addLog("Accordion Expander 952 active.", "system");
            mountAccordionWidget();
        } else if (state.stage2SubStation === 4) {
            labInstruction.textContent = "FINAL CALIBRATION: Solve hundreds count, subtraction bounds, and tens grouping.";
            addLog("Final place value diagnostic registers active.", "system");
        }

        if (state.stage2SubStation !== 2) {
            destroyFractionWidget();
        }
        if (state.stage2SubStation !== 3) {
            destroyAccordionWidget();
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
    // 7. Stage 3: Eggerling's Dispatch Center
    // ----------------------------------------------------
    const eggerlingSub1 = document.getElementById('eggerling-sub-1');
    const eggerlingSub2 = document.getElementById('eggerling-sub-2');
    const eggCanvas = document.getElementById('egg-canvas');
    const btnRunPacker = document.getElementById('btn-run-packer');
    const btnSubmitEggs = document.getElementById('btn-submit-eggs');
    const btnPrevEggerling = document.getElementById('btn-prev-eggerling');
    const btnSubmitDelivery = document.getElementById('btn-submit-delivery');
    const btnRunDelivery = document.getElementById('btn-run-delivery');
    
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
            mountDeliveryWidget();
            mountClockWidget();
        }

        if (state.stage3SubStage !== 2) {
            destroyClockWidget();
            destroyDeliveryWidget();
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

    btnRunDelivery.addEventListener('click', () => {
        if (state.vanDeliveryRan) return;
        if (!deliveryWidget || typeof deliveryWidget.playRoute !== 'function') return;
        sounds.engineHum();
        state.vanDeliveryRan = true;

        deliveryWidget.playRoute({
            onSegmentComplete: (info) => {
                if (info.shopKey === 'A') {
                    sounds.successNode();
                    addLog("Shop A delivery complete. 10 cartons unloaded. Remaining: 203.", "system");
                } else if (info.shopKey === 'C') {
                    sounds.successNode();
                    addLog("Shop C delivery complete. 10 cartons unloaded. Remaining: 193.", "system");
                } else if (info.shopKey === 'B') {
                    sounds.successNode();
                    addLog("Shop B delivery complete. 10 cartons unloaded. Remaining: 183.", "system");
                }
            },
            onRouteComplete: () => {
                const vanLeftInput = document.getElementById('van-left-input');
                if (vanLeftInput) {
                    vanLeftInput.value = 183;
                    state.vanLeft = 183;
                }
                sounds.successNode();
                addLog("All delivery drops complete. Cartons remaining: 183.", "success");
            },
        });
    });

    btnPrevEggerling.addEventListener('click', () => {
        state.stage3SubStage = 1;
        sounds.click();
        updateEggerlingView();
    });

    document.getElementById('clock-adjust-h-minus').addEventListener('click', () => {
        if (!clockWidget || typeof clockWidget.nudgeHours !== 'function') return;
        sounds.click();
        clockWidget.nudgeHours(-1);
    });

    document.getElementById('clock-adjust-h-plus').addEventListener('click', () => {
        if (!clockWidget || typeof clockWidget.nudgeHours !== 'function') return;
        sounds.click();
        clockWidget.nudgeHours(1);
    });

    document.getElementById('clock-adjust-m-minus').addEventListener('click', () => {
        if (!clockWidget || typeof clockWidget.nudgeMinutes !== 'function') return;
        sounds.click();
        clockWidget.nudgeMinutes(-5);
    });

    document.getElementById('clock-adjust-m-plus').addEventListener('click', () => {
        if (!clockWidget || typeof clockWidget.nudgeMinutes !== 'function') return;
        sounds.click();
        clockWidget.nudgeMinutes(5);
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
        if (fractionWidget && typeof fractionWidget.setValue === 'function') {
            fractionWidget.setValue(0);
        }
        updateFractionReadout(0);
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
        if (clockWidget && typeof clockWidget.setValue === 'function') {
            clockWidget.setValue({ hours: 12, minutes: 0 });
        }
        updateClockReadout();
        state.eggPackerRan = false;
        state.vanDeliveryRan = false;
        state.vanX = 0;
        state.vanY = 0;
        state.vanCargo = 213;
        state.shopAStatus = 'AWAITING';
        state.shopCStatus = 'AWAITING';
        state.shopBStatus = 'AWAITING';
        if (deliveryWidget && typeof deliveryWidget.resetRoute === 'function') {
            deliveryWidget.resetRoute();
        }
        
        document.querySelectorAll('input[type="number"]').forEach(el => el.value = '');
        document.querySelectorAll('input[type="text"]').forEach(el => el.value = '');
        document.querySelectorAll('textarea').forEach(el => el.value = '');
        document.querySelectorAll('input[type="radio"]').forEach(el => el.checked = false);
        
        calcCurrentVal = 796;
        calcReadout.textContent = '796';

        if (accordionWidget && typeof accordionWidget.resetCollapsed === 'function') {
            accordionWidget.resetCollapsed();
        }
        
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
