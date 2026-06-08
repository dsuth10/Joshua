/**
 * Luminous Math Practice Console - State & Logic Engine
 * Persistent local storage student profile, infinite generators, dual-attempt visual hints.
 */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. Audio Synthesizer (Web Audio API)
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
            console.warn("Audio failed: ", e);
        }
    }

    const sounds = {
        click: () => playSound(600, 0.05, 'square', 0.04),
        success: () => {
            playSound(523.25, 0.08, 'sine', 0.08); // C5
            setTimeout(() => playSound(659.25, 0.08, 'sine', 0.08), 80); // E5
            setTimeout(() => playSound(783.99, 0.12, 'sine', 0.08), 160); // G5
        },
        error: () => playSound(160, 0.25, 'sawtooth', 0.12),
        hint: () => {
            playSound(440, 0.1, 'triangle', 0.08); // A4
            setTimeout(() => playSound(554.37, 0.15, 'triangle', 0.08), 100); // C#5
        },
        badgeUnlock: () => {
            playSound(261.63, 0.1, 'sine', 0.1); // C4
            setTimeout(() => playSound(329.63, 0.1, 'sine', 0.1), 80); // E4
            setTimeout(() => playSound(392.00, 0.1, 'sine', 0.1), 160); // G4
            setTimeout(() => playSound(523.25, 0.25, 'sine', 0.15), 240); // C5
        }
    };

    // ----------------------------------------------------
    // 2. Persistent Profile Database (localStorage)
    // ----------------------------------------------------
    const profile = {
        name: 'ENGINEER',
        score: 0,
        level: 1,
        streak: 0,
        highestStreak: 0,
        rank: 'Novice Calibrator',
        badges: [],
        scoresByCat: {
            recall: 0,
            'place-value': 0,
            dispatch: 0
        }
    };

    // UI Elements for profile
    const elNameEdit = document.getElementById('profile-name-edit');
    const elAvatar = document.getElementById('profile-avatar');
    const elRank = document.getElementById('profile-rank');
    const elLevel = document.getElementById('profile-level');
    const elLevelRatio = document.getElementById('profile-level-ratio');
    const elProgressFill = document.getElementById('profile-progress-fill');
    const elScore = document.getElementById('profile-score');
    const elStreak = document.getElementById('profile-streak');

    function getLevelBounds(lvl) {
        if (lvl === 1) return { min: 0, max: 100 };
        if (lvl === 2) return { min: 100, max: 250 };
        if (lvl === 3) return { min: 250, max: 500 };
        if (lvl === 4) return { min: 500, max: 1000 };
        return { min: 1000, max: 999999 };
    }

    function calculateLevelAndRank(totalScore) {
        let level = 1;
        let rank = 'Novice Calibrator';

        if (totalScore >= 1000) {
            level = 5;
            rank = 'Maths Commander';
        } else if (totalScore >= 500) {
            level = 4;
            rank = 'Logic Architect';
        } else if (totalScore >= 250) {
            level = 3;
            rank = 'Systems Operator';
        } else if (totalScore >= 100) {
            level = 2;
            rank = 'Data Apprentice';
        }

        return { level, rank };
    }

    function loadProfile() {
        const stored = localStorage.getItem('luminous_math_profile');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                Object.assign(profile, parsed);
            } catch (e) {
                console.error("Failed to parse stored profile", e);
            }
        }

        // Render inputs
        elNameEdit.value = profile.name;
        elAvatar.textContent = (profile.name[0] || 'E').toUpperCase();
        elScore.textContent = `${profile.score} PTS`;
        elStreak.textContent = profile.streak;
        
        // Recalculate level and rank
        const cur = calculateLevelAndRank(profile.score);
        profile.level = cur.level;
        profile.rank = cur.rank;
        elRank.textContent = profile.rank;
        elLevel.textContent = `Level ${profile.level}`;

        // Level Up Progress Bar calculations
        const bounds = getLevelBounds(profile.level);
        if (profile.level === 5) {
            elLevelRatio.textContent = 'MAX LEVEL';
            elProgressFill.style.width = '100%';
        } else {
            const range = bounds.max - bounds.min;
            const progress = profile.score - bounds.min;
            const percentage = Math.min(100, Math.max(0, (progress / range) * 100));
            elLevelRatio.textContent = `${profile.score} / ${bounds.max} PTS`;
            elProgressFill.style.width = `${percentage}%`;
        }

        // Update Badges Visuals
        document.querySelectorAll('.badge-item').forEach(el => {
            const id = el.id.replace('badge-', '');
            if (profile.badges.includes(id)) {
                el.classList.add('unlocked');
            } else {
                el.classList.remove('unlocked');
            }
        });
    }

    function saveProfile() {
        localStorage.setItem('luminous_math_profile', JSON.stringify(profile));
    }

    function gainPoints(pts, isCorrect, category) {
        // Adjust points
        profile.score += pts;
        profile.scoresByCat[category] = (profile.scoresByCat[category] || 0) + pts;

        // Update streaks
        if (isCorrect) {
            profile.streak += 1;
            profile.highestStreak = Math.max(profile.highestStreak, profile.streak);
        } else {
            profile.streak = 0;
        }

        // Check badge unlocks
        const oldBadgesCount = profile.badges.length;
        
        if (profile.score > 0 && !profile.badges.includes('first-step')) {
            profile.badges.push('first-step');
        }
        if (profile.streak >= 5 && !profile.badges.includes('streak-5')) {
            profile.badges.push('streak-5');
        }
        if (profile.streak >= 10 && !profile.badges.includes('streak-10')) {
            profile.badges.push('streak-10');
        }
        if (profile.scoresByCat.recall >= 100 && !profile.badges.includes('fact-100')) {
            profile.badges.push('fact-100');
        }
        if (profile.scoresByCat['place-value'] >= 100 && !profile.badges.includes('pv-100')) {
            profile.badges.push('pv-100');
        }
        if (profile.scoresByCat.dispatch >= 100 && !profile.badges.includes('dispatch-100')) {
            profile.badges.push('dispatch-100');
        }

        saveProfile();
        loadProfile();

        if (profile.badges.length > oldBadgesCount) {
            sounds.badgeUnlock();
            addLog(`ACHIEVEMENT UNLOCKED: New badge badge-item is active on your profile shelf!`, "success");
        }
    }

    // Name change listener
    elNameEdit.addEventListener('change', (e) => {
        const val = e.target.value.trim().toUpperCase() || 'ENGINEER';
        profile.name = val;
        saveProfile();
        loadProfile();
        addLog(`Student name profile updated to: ${profile.name}`, "system");
        sounds.click();
    });

    // ----------------------------------------------------
    // 3. Logger Panel
    // ----------------------------------------------------
    function addLog(message, type = 'system') {
        const logList = document.getElementById('log-list');
        if (!logList) return;
        const time = new Date().toLocaleTimeString('en-AU', { hour12: false });
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry ${type}`;
        logEntry.innerHTML = `
            <div class="log-time">${time}</div>
            <div>${message}</div>
        `;
        
        logList.insertBefore(logEntry, logList.firstChild);
        
        while (logList.children.length > 25) {
            logList.removeChild(logList.lastChild);
        }
    }

    // ----------------------------------------------------
    // 4. Sandbox Question Core Engine
    // ----------------------------------------------------
    const state = {
        activeCategory: 'recall', // 'recall', 'place-value', 'dispatch'
        attemptsLeft: 2,
        currentQuestion: null
    };

    const pracTaskTitle = document.getElementById('prac-task-title');
    const pracAttemptsLeft = document.getElementById('prac-attempts-left');
    const pracInteractivePanel = document.getElementById('prac-interactive-panel');
    const pracHintContainer = document.getElementById('prac-hint-container');
    const pracHintContent = document.getElementById('prac-hint-content');
    const pracSolutionContainer = document.getElementById('prac-solution-container');
    const pracSolutionContent = document.getElementById('prac-solution-content');
    const pracFeedbackText = document.getElementById('prac-feedback-text');
    
    const btnPracHint = document.getElementById('btn-prac-hint');
    const btnPracSubmit = document.getElementById('btn-prac-submit');
    const btnPracNext = document.getElementById('btn-prac-next');

    // ----------------------------------------------------
    // 5. Dynamic Category Generators & Helpers
    // ----------------------------------------------------
    const generators = {
        recall: () => {
            const isAdd = Math.random() > 0.5;
            let a, b, eq, ans, hintHtml, solution;
            
            if (isAdd) {
                a = Math.floor(Math.random() * 9) + 2; // 2 to 10
                b = Math.floor(Math.random() * 9) + 2;
                eq = `${a} + ${b}`;
                ans = a + b;
                
                // SVG / CSS dots representation for hint
                let dotsA = '';
                for (let i = 0; i < a; i++) dotsA += '<span class="hint-dot"></span>';
                let dotsB = '';
                for (let i = 0; i < b; i++) dotsB += '<span class="hint-dot" style="background-color:var(--tertiary);"></span>';
                
                hintHtml = `
                    <p>Visualise addition using counters: count all the dots altogether.</p>
                    <div class="hint-dots-container">${dotsA} <span style="margin: 0 10px; font-weight:700;">+</span> ${dotsB}</div>
                `;
                
                solution = `To solve ${a} + ${b}, partition the smaller number. For example, add to make 10, then add the rest: ${a} + ${10-a} = 10, then add ${b-(10-a)} to equal ${ans}.`;
            } else {
                // Subtraction
                ans = Math.floor(Math.random() * 8) + 2; // 2 to 9
                b = Math.floor(Math.random() * 8) + 2;
                a = ans + b;
                eq = `${a} - ${b}`;
                
                let dots = '';
                for (let i = 0; i < a; i++) {
                    if (i >= a - b) {
                        dots += '<span class="hint-dot subtraction-dot"></span>';
                    } else {
                        dots += '<span class="hint-dot"></span>';
                    }
                }
                
                hintHtml = `
                    <p>Visualise subtraction using counters: cross out ${b} counters from the total of ${a}. The filled circles show the answer.</p>
                    <div class="hint-dots-container">${dots}</div>
                `;
                
                solution = `Start at the total ${a} and count back by ${b}. Partition ${b} to jump to 10 first, then subtract the remaining units to get ${ans}.`;
            }

            return {
                category: 'recall',
                type: 'fact',
                questionText: `Solve the addition/subtraction fact recall query:`,
                targetAns: ans,
                hintText: hintHtml,
                solutionText: solution,
                renderFunc: (container) => {
                    container.innerHTML = `
                        <div class="flex-col align-center" style="gap: 16px;">
                            <div class="equation-display" style="font-size: 4.5rem; margin-bottom: 8px;">${eq} = ?</div>
                            <input type="number" class="input-text-terminal input-number-small" id="prac-recall-input" placeholder="?" style="font-size: 2rem; width: 140px; border-bottom-width: 3px;" autocomplete="off" min="0" max="99">
                        </div>
                    `;
                    // Auto-focus input
                    setTimeout(() => {
                        const inp = document.getElementById('prac-recall-input');
                        if (inp) inp.focus();
                    }, 50);
                },
                validateFunc: () => {
                    const inputEl = document.getElementById('prac-recall-input');
                    if (!inputEl) return false;
                    return parseInt(inputEl.value.trim(), 10) === ans;
                }
            };
        },

        'place-value': () => {
            const pvTypes = ['calc', 'count-hundreds', 'expander', 'ten-less', 'tens-group'];
            const chosenType = pvTypes[Math.floor(Math.random() * pvTypes.length)];
            
            if (chosenType === 'calc') {
                const startNum = Math.floor(Math.random() * 700) + 150; // 150 to 850
                const ops = [
                    { label: 'Add 100', val: 100 },
                    { label: 'Add 10', val: 10 },
                    { label: 'Add 14', val: 14 },
                    { label: 'Take away 90', val: -90 },
                    { label: 'Take away 190', val: -190 }
                ];
                const selectedOp = ops[Math.floor(Math.random() * ops.length)];
                const targetNum = startNum + selectedOp.val;

                return {
                    category: 'place-value',
                    type: 'calc',
                    questionText: `Dale's calculator displays <strong>${startNum}</strong>. What must he do to change it to show <strong>${targetNum}</strong>?`,
                    targetAns: selectedOp.label,
                    hintText: `
                        <p>Look at how the place value digits shifted from ${startNum} to ${targetNum}:</p>
                        <div class="flex-row gap-12" style="margin-top: 8px;">
                            <span class="hint-expander-place">START: ${startNum}</span>
                            <span class="hint-expander-place">TARGET: ${targetNum}</span>
                        </div>
                        <p style="margin-top: 8px;">Difference is: ${targetNum} - ${startNum} = <strong>${selectedOp.val > 0 ? '+' : ''}${selectedOp.val}</strong>.</p>
                    `,
                    solutionText: `To change ${startNum} to ${targetNum}, we must calculate target - start, which is ${selectedOp.val}. This corresponds to selecting the "${selectedOp.label}" operation option.`,
                    renderFunc: (container) => {
                        let optionsHtml = '';
                        ops.forEach((op, idx) => {
                            optionsHtml += `
                                <label class="flex-row align-center gap-8" style="font-size:0.9rem; border:1px solid var(--outline-variant); padding:8px 12px; border-radius:var(--radius-default);">
                                    <input type="radio" name="prac-calc-choice" value="${op.label}" id="prac-op-${idx}">
                                    <span>${op.label}</span>
                                </label>
                            `;
                        });
                        container.innerHTML = `
                            <div class="flex-col gap-12" style="max-width: 500px; margin: 0 auto;">
                                <div class="flex-row gap-16 align-center justify-center" style="margin-bottom:12px;">
                                    <div class="calc-device" style="width:180px; padding:8px;">
                                        <div class="calc-screen" style="height:44px; font-size:1.6rem;">${startNum}</div>
                                    </div>
                                    <span style="font-size:1.5rem; font-weight:700;">➔</span>
                                    <div class="calc-device" style="width:180px; padding:8px; border-color:var(--primary);">
                                        <div class="calc-screen" style="height:44px; font-size:1.6rem; color:var(--primary);">${targetNum}</div>
                                    </div>
                                </div>
                                <div class="flex-col gap-8" id="prac-calc-options">
                                    ${optionsHtml}
                                </div>
                            </div>
                        `;
                    },
                    validateFunc: () => {
                        const checked = document.querySelector('input[name="prac-calc-choice"]:checked');
                        if (!checked) return false;
                        return checked.value === selectedOp.label;
                    }
                };
            } else if (chosenType === 'count-hundreds') {
                const hundreds = Math.floor(Math.random() * 8) + 1; // 1 to 8
                const tens = 0;
                const ones = Math.floor(Math.random() * 9) + 1; // 1 to 9
                const num = hundreds * 100 + ones; // e.g. 702, 305

                return {
                    category: 'place-value',
                    type: 'count-hundreds',
                    questionText: `How many hundreds are there in the number <strong>${num}</strong>?`,
                    targetAns: hundreds,
                    hintText: `
                        <p>Look at the digit positions in the number ${num}:</p>
                        <div class="flex-row gap-8" style="margin-top:8px;">
                            <span class="hint-expander-place"><strong>${hundreds}</strong> Hundreds</span>
                            <span class="hint-expander-place"><strong>${tens}</strong> Tens</span>
                            <span class="hint-expander-place"><strong>${ones}</strong> Ones</span>
                        </div>
                        <p style="margin-top: 8px;">The hundreds column is the third position from the right.</p>
                    `,
                    solutionText: `The number ${num} partitions into ${hundreds} Hundreds, ${tens} Tens, and ${ones} Ones. Therefore, there are exactly ${hundreds} hundreds.`,
                    renderFunc: (container) => {
                        container.innerHTML = `
                            <div class="flex-col align-center" style="gap:16px;">
                                <div style="font-size: 2.2rem; font-weight:700; color:var(--primary);">${num}</div>
                                <div class="question-input-group">
                                    <input type="number" class="input-text-terminal input-number-small" id="prac-hundreds-input" placeholder="?" autocomplete="off" min="0">
                                    <span style="font-size:0.9rem; font-weight:600; color:var(--on-surface-variant);">hundreds</span>
                                </div>
                            </div>
                        `;
                    },
                    validateFunc: () => {
                        const inp = document.getElementById('prac-hundreds-input');
                        if (!inp) return false;
                        return parseInt(inp.value.trim(), 10) === hundreds;
                    }
                };
            } else if (chosenType === 'expander') {
                // Number expander target 952 (95 tens, 2 ones)
                const h = Math.floor(Math.random() * 8) + 1; // 1-8
                const t = Math.floor(Math.random() * 8) + 1; // 1-8
                const o = Math.floor(Math.random() * 8) + 1; // 1-8
                const num = h * 100 + t * 10 + o;
                
                const targetTens = h * 10 + t;
                const targetOnes = o;

                return {
                    category: 'place-value',
                    type: 'expander',
                    questionText: `Using the expander columns altogether, write how many tens and ones the number <strong>${num}</strong> has:`,
                    targetAns: { tens: targetTens, ones: targetOnes },
                    hintText: `
                        <p>Folds the Hundreds joint on the expander to join Hundreds and Tens:</p>
                        <div class="flex-row gap-8" style="margin-top: 8px; font-family:var(--font-mono); font-size:0.85rem;">
                            <span class="hint-expander-place" style="border-color:var(--primary); color:var(--primary);">${h * 10 + t} Tens</span>
                            <span class="hint-expander-place">${o} Ones</span>
                        </div>
                        <p style="margin-top: 8px;">Folding ${h} hundreds converts them into ${h * 10} tens. Adding the ${t} tens gives ${targetTens} tens altogether.</p>
                    `,
                    solutionText: `Since 1 hundred = 10 tens, the ${h} hundreds in ${num} are equal to ${h * 10} tens. Adding the remaining ${t} tens yields ${targetTens} tens, with ${targetOnes} ones leftover.`,
                    renderFunc: (container) => {
                        container.innerHTML = `
                            <div class="flex-col align-center" style="gap:16px;">
                                <div class="number-expander-widget" style="margin-bottom:12px;">
                                    <div class="expander-block" id="prac-exp-block-h">
                                        <div class="expander-number">${h}</div>
                                        <div class="expander-label" id="prac-label-h">Hundreds</div>
                                        <button class="expander-joint" id="prac-joint-h">↔</button>
                                    </div>
                                    <div class="expander-block" id="prac-exp-block-t">
                                        <div class="expander-number" id="prac-num-t">${t}</div>
                                        <div class="expander-label" id="prac-label-t">Tens</div>
                                        <button class="expander-joint" id="prac-joint-t">↔</button>
                                    </div>
                                    <div class="expander-block">
                                        <div class="expander-number" id="prac-num-o">${o}</div>
                                        <div class="expander-label">Ones</div>
                                    </div>
                                </div>
                                <div class="question-input-group">
                                    <input type="number" class="input-text-terminal input-number-small" id="prac-exp-tens" placeholder="?" autocomplete="off">
                                    <span style="font-size:0.9rem;">tens and</span>
                                    <input type="number" class="input-text-terminal input-number-small" id="prac-exp-ones" placeholder="?" autocomplete="off">
                                    <span style="font-size:0.9rem;">ones altogether</span>
                                </div>
                            </div>
                        `;

                        // Add expander toggle logic inside the practice panel
                        const blockH = document.getElementById('prac-exp-block-h');
                        const blockT = document.getElementById('prac-exp-block-t');
                        const numTText = document.getElementById('prac-num-t');
                        const numOText = document.getElementById('prac-num-o');

                        document.getElementById('prac-joint-h').addEventListener('click', () => {
                            sounds.click();
                            blockH.classList.toggle('collapsed');
                            updateExpander();
                        });

                        document.getElementById('prac-joint-t').addEventListener('click', () => {
                            sounds.click();
                            blockT.classList.toggle('collapsed');
                            updateExpander();
                        });

                        function updateExpander() {
                            const hColl = blockH.classList.contains('collapsed');
                            const tColl = blockT.classList.contains('collapsed');
                            
                            numTText.textContent = t;
                            numOText.textContent = o;

                            if (hColl && tColl) {
                                numOText.textContent = h * 100 + t * 10 + o;
                            } else if (hColl) {
                                numTText.textContent = h * 10 + t;
                            } else if (tColl) {
                                numOText.textContent = t * 10 + o;
                            }
                        }
                    },
                    validateFunc: () => {
                        const tensInp = document.getElementById('prac-exp-tens');
                        const onesInp = document.getElementById('prac-exp-ones');
                        if (!tensInp || !onesInp) return false;
                        
                        const userTens = parseInt(tensInp.value.trim(), 10);
                        const userOnes = parseInt(onesInp.value.trim(), 10);
                        
                        return userTens === targetTens && userOnes === targetOnes;
                    }
                };
            } else if (chosenType === 'ten-less') {
                const num = Math.floor(Math.random() * 800) + 150; // 150 to 950
                const target = num - 10;

                return {
                    category: 'place-value',
                    type: 'ten-less',
                    questionText: `What number is <strong>10 less</strong> than <strong>${num}</strong>?`,
                    targetAns: target,
                    hintText: `
                        <p>Subtracting 10 means reducing the value in the tens place column by 1:</p>
                        <p style="margin-top: 6px; font-family:var(--font-mono);">Value = ${num} - 10 = <strong>${target}</strong></p>
                    `,
                    solutionText: `Subtract 1 ten from the tens digit of ${num}. The tens digit decreases by 1, resulting in ${target}.`,
                    renderFunc: (container) => {
                        container.innerHTML = `
                            <div class="flex-col align-center" style="gap:16px;">
                                <div style="font-size: 2.2rem; font-weight:700; color:var(--primary);">${num}</div>
                                <div class="question-input-group">
                                    <input type="number" class="input-text-terminal input-number-small" id="prac-tenless-input" placeholder="?" style="width:120px;" autocomplete="off">
                                </div>
                            </div>
                        `;
                    },
                    validateFunc: () => {
                        const inp = document.getElementById('prac-tenless-input');
                        if (!inp) return false;
                        return parseInt(inp.value.trim(), 10) === target;
                    }
                };
            } else {
                // tens-group (34 tens)
                const tensCount = Math.floor(Math.random() * 70) + 12; // 12 to 82 tens (e.g. 34)
                const targetVal = tensCount * 10;

                return {
                    category: 'place-value',
                    type: 'tens-group',
                    questionText: `Write the number that has <strong>${tensCount} tens</strong> only:`,
                    targetAns: targetVal,
                    hintText: `
                        <p>Each ten represents the number 10. Multiplies the number of tens by 10:</p>
                        <p style="margin-top: 6px; font-family:var(--font-mono);">${tensCount} × 10 = <strong>${targetVal}</strong></p>
                    `,
                    solutionText: `Since 1 ten = 10, ${tensCount} tens equals ${tensCount} × 10, which is ${targetVal} (by appending a zero to ${tensCount}).`,
                    renderFunc: (container) => {
                        container.innerHTML = `
                            <div class="flex-col align-center" style="gap:16px;">
                                <div style="font-size: 2rem; font-weight:700; color:var(--primary);">${tensCount} Tens</div>
                                <div class="question-input-group">
                                    <input type="number" class="input-text-terminal input-number-small" id="prac-tensgroup-input" placeholder="?" style="width:120px;" autocomplete="off">
                                </div>
                            </div>
                        `;
                    },
                    validateFunc: () => {
                        const inp = document.getElementById('prac-tensgroup-input');
                        if (!inp) return false;
                        return parseInt(inp.value.trim(), 10) === targetVal;
                    }
                };
            }
        },

        dispatch: () => {
            const isEgg = Math.random() > 0.5;
            
            if (isEgg) {
                const cartons = Math.floor(Math.random() * 20) + 11; // 11 to 30 cartons (e.g. 23)
                const leftover = Math.floor(Math.random() * 9) + 1; // 1 to 9 (e.g. 4)
                const eggs = cartons * 10 + leftover; // e.g. 234

                return {
                    category: 'dispatch',
                    type: 'egg-packing',
                    questionText: `Eggerling's Organic Eggs sell their eggs in cartons of 10. Mini Eggerling collected <strong>${eggs}</strong> eggs. How many cartons did she use to pack her eggs?`,
                    targetAns: cartons,
                    hintText: `
                        <p>Group the eggs into cartons of 10. Check the tens column in the egg count:</p>
                        <p style="margin-top: 6px;">Dividing ${eggs} by 10 gives <strong>${cartons} full cartons</strong>, with ${leftover} eggs leftover.</p>
                    `,
                    solutionText: `To find the number of cartons of 10 in ${eggs}, divide ${eggs} by 10. This results in ${cartons} full cartons, with ${leftover} loose eggs remaining unpacked.`,
                    renderFunc: (container) => {
                        container.innerHTML = `
                            <div class="eggerling-panel-split active" style="gap: 16px;">
                                <div class="flex-col gap-12">
                                    <div class="question-input-group">
                                        <input type="number" class="input-text-terminal input-number-small" id="prac-egg-cartons" placeholder="?" autocomplete="off">
                                        <span style="font-size:0.9rem; font-weight:600;">cartons</span>
                                    </div>
                                    <p style="font-size:0.75rem; color:var(--outline); margin-top:8px;">
                                        Tip: Enter your calculation carton estimate, or click "RUN PACKER" on the right to pack visually.
                                    </p>
                                </div>
                                <div class="visual-workbench" style="min-height: 180px;">
                                    <div class="panel-header" style="padding: 4px 12px;">
                                        <span>EGG_PACKING_BAY</span>
                                        <button class="btn-terminal primary" id="btn-prac-packer" style="padding: 2px 6px; font-size: 0.65rem; height:24px; min-width:auto;">RUN PACKER</button>
                                    </div>
                                    <div class="egg-packer-canvas" id="prac-egg-canvas"></div>
                                </div>
                            </div>
                        `;

                        document.getElementById('btn-prac-packer').addEventListener('click', () => {
                            sounds.success();
                            const eggCanvas = document.getElementById('prac-egg-canvas');
                            eggCanvas.innerHTML = '';

                            // Render dynamic cartons
                            for (let c = 1; c <= cartons; c++) {
                                const carton = document.createElement('div');
                                carton.className = 'egg-carton packed';
                                carton.style.padding = '4px';
                                carton.style.gap = '2px';
                                
                                const grid = document.createElement('div');
                                grid.className = 'carton-grid';
                                grid.style.height = '30px';
                                for (let e = 0; e < 10; e++) {
                                    const slot = document.createElement('div');
                                    slot.className = 'egg-slot';
                                    const egg = document.createElement('div');
                                    egg.className = 'egg-node';
                                    slot.appendChild(egg);
                                    grid.appendChild(slot);
                                }
                                carton.appendChild(grid);
                                eggCanvas.appendChild(carton);
                            }

                            // Render leftover tray
                            const bin = document.createElement('div');
                            bin.className = 'loose-eggs-bin';
                            bin.style.marginTop = '8px';
                            bin.style.paddingTop = '8px';
                            bin.innerHTML = `
                                <div style="font-size:0.65rem; color:var(--outline); margin-bottom: 2px;">LOOSE_EGGS_TRAY (${leftover})</div>
                                <div class="loose-eggs-grid" id="prac-loose-grid"></div>
                            `;
                            eggCanvas.appendChild(bin);
                            const looseGrid = document.getElementById('prac-loose-grid');
                            for (let le = 0; le < leftover; le++) {
                                const slot = document.createElement('div');
                                slot.className = 'egg-slot';
                                slot.style.width = '16px';
                                const egg = document.createElement('div');
                                egg.className = 'egg-node';
                                slot.appendChild(egg);
                                looseGrid.appendChild(slot);
                            }
                            addLog(`Practice Packer: ${cartons} cartons fully loaded. ${leftover} eggs remaining.`, "success");
                        });
                    },
                    validateFunc: () => {
                        const inp = document.getElementById('prac-egg-cartons');
                        if (!inp) return false;
                        const userVal = parseInt(inp.value.trim(), 10);
                        return userVal === cartons || userVal === (cartons + 1); // Accept total cartons or full cartons
                    }
                };
            } else {
                // Van Delivery Subtraction
                const start = Math.floor(Math.random() * 100) + 120; // 120 to 220
                const shops = Math.floor(Math.random() * 3) + 3; // 3 to 5 shops
                const delivered = shops * 10;
                const remaining = start - delivered;

                return {
                    category: 'dispatch',
                    type: 'van-dispatch',
                    questionText: `There are <strong>${start}</strong> cartons in the Eggerling's delivery van. Ten cartons are delivered to each of <strong>${shops}</strong> shops. How many cartons are left in the van after shop ${shops}?`,
                    targetAns: remaining,
                    hintText: `
                        <p>Calculate the total delivered load first:</p>
                        <p style="margin-top: 4px;">Delivered = ${shops} shops × 10 cartons/shop = <strong>${delivered}</strong> cartons.</p>
                        <p style="margin-top: 6px;">Subtract this from starting load: ${start} - ${delivered} = <strong>${remaining}</strong>.</p>
                    `,
                    solutionText: `Deliveries of 10 cartons to each of ${shops} shops means a total reduction of ${shops} × 10 = ${delivered} cartons. Cartons left = ${start} - ${delivered} = ${remaining}.`,
                    renderFunc: (container) => {
                        container.innerHTML = `
                            <div class="eggerling-panel-split active" style="gap: 16px;">
                                <div class="flex-col gap-12">
                                    <div class="question-input-group">
                                        <input type="number" class="input-text-terminal input-number-small" id="prac-van-left" placeholder="?" autocomplete="off">
                                        <span style="font-size:0.9rem; font-weight:600;">cartons left</span>
                                    </div>
                                    <p style="font-size:0.75rem; color:var(--outline); margin-top:8px;">
                                        Tip: Enter your calculation cargo estimate, or click "ROUTE VAN" on the dispatch radar on the right.
                                    </p>
                                </div>
                                <div class="map-canvas" style="min-height: 180px;">
                                    <div class="panel-header" style="padding: 4px 12px;">
                                        <span>DISPATCH_RADAR</span>
                                        <button class="btn-terminal primary" id="btn-prac-radar" style="padding: 2px 6px; font-size: 0.65rem; height:24px; min-width:auto;">ROUTE VAN</button>
                                    </div>
                                    <div class="map-canvas" id="prac-radar-map" style="border:none;">
                                        <div class="radar-sweep"></div>
                                        <div class="shop-node shop-1" id="prac-shop-1" style="top:25%; left:15%; width:50px; height:44px; font-size:0.55rem;"><div style="font-size:0.8rem;">🏬</div>SHOP_A</div>
                                        <div class="shop-node shop-2" id="prac-shop-2" style="top:55%; left:65%; width:50px; height:44px; font-size:0.55rem;"><div style="font-size:0.8rem;">🏬</div>SHOP_B</div>
                                        <div class="van-node" id="prac-delivery-van" style="bottom:10px; left:10px; width:40px; height:30px; font-size:0.9rem;">🚚</div>
                                    </div>
                                </div>
                            </div>
                        `;

                        let animated = false;
                        document.getElementById('btn-prac-radar').addEventListener('click', () => {
                            if (animated) return;
                            animated = true;
                            sounds.success();
                            const van = document.getElementById('prac-delivery-van');
                            
                            // Animate route
                            setTimeout(() => {
                                van.style.top = '25%';
                                van.style.left = '15%';
                                document.getElementById('prac-shop-1').classList.add('delivered');
                            }, 100);

                            setTimeout(() => {
                                van.style.top = '55%';
                                van.style.left = '65%';
                                document.getElementById('prac-shop-2').classList.add('delivered');
                                addLog(`Practice dispatch route animation completed.`, "success");
                            }, 1400);
                        });
                    },
                    validateFunc: () => {
                        const inp = document.getElementById('prac-van-left');
                        if (!inp) return false;
                        return parseInt(inp.value.trim(), 10) === remaining;
                    }
                };
            }
        }
    };

    // Load active sandbox question
    function loadNextPracticeQuestion() {
        state.attemptsLeft = 2;
        pracAttemptsLeft.textContent = "2 ATTEMPTS LEFT";
        pracAttemptsLeft.className = "rank-pill";
        pracAttemptsLeft.style.backgroundColor = "var(--secondary-container)";
        pracAttemptsLeft.style.color = "var(--secondary)";
        
        pracHintContainer.style.display = 'none';
        pracSolutionContainer.style.display = 'none';
        pracFeedbackText.style.display = 'none';
        
        btnPracHint.style.display = 'none';
        btnPracSubmit.style.display = 'inline-flex';
        btnPracNext.style.display = 'none';

        // Choose generator based on active Category
        const gen = generators[state.activeCategory];
        state.currentQuestion = gen();

        // Render Title & interactive Panel
        pracTaskTitle.innerHTML = state.currentQuestion.questionText;
        state.currentQuestion.renderFunc(pracInteractivePanel);
        
        addLog(`Generated fresh practice calibration task for category: ${state.activeCategory.toUpperCase()}`, "system");
    }

    // Tab switcher listeners
    document.querySelectorAll('.selector-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            document.querySelectorAll('.selector-tab').forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            
            state.activeCategory = e.target.getAttribute('data-task');
            document.getElementById('practice-code').textContent = `[${state.activeCategory.toUpperCase()}_ENG]`;
            sounds.click();
            loadNextPracticeQuestion();
        });
    });

    // Submit Calibration Handler
    btnPracSubmit.addEventListener('click', () => {
        if (!state.currentQuestion) return;

        const isCorrect = state.currentQuestion.validateFunc();

        if (isCorrect) {
            sounds.success();
            pracFeedbackText.className = "active-feedback-text feedback-success";
            
            // Score calculations based on attempts
            let gainedPoints = 10;
            if (state.attemptsLeft === 1) {
                gainedPoints = 5;
            }
            pracFeedbackText.textContent = `CORRECT CALIBRATION! +${gainedPoints} PTS`;
            pracFeedbackText.style.display = 'block';

            // Save status
            gainPoints(gainedPoints, true, state.currentQuestion.category);

            btnPracSubmit.style.display = 'none';
            btnPracNext.style.display = 'inline-flex';
            pracAttemptsLeft.textContent = "CALIBRATION STABLE";
            pracAttemptsLeft.style.backgroundColor = "var(--on-tertiary-container)";
            pracAttemptsLeft.style.color = "var(--tertiary)";
            
            addLog(`Task solved correctly on attempt ${3 - state.attemptsLeft}. Awarded +${gainedPoints} points. Streak: ${profile.streak}`, "success");
        } else {
            // Incorrect
            sounds.error();
            state.attemptsLeft--;

            if (state.attemptsLeft === 1) {
                // Hint display
                pracAttemptsLeft.textContent = "1 ATTEMPT LEFT";
                pracAttemptsLeft.style.backgroundColor = "var(--error-container)";
                pracAttemptsLeft.style.color = "var(--error)";
                
                pracHintContent.innerHTML = state.currentQuestion.hintText;
                pracHintContainer.style.display = 'block';
                btnPracHint.style.display = 'inline-flex';

                addLog(`Calibration deviation detected. Attempt 1 failed. Displaying diagnostic hint.`, "error");
            } else {
                // Out of attempts
                pracAttemptsLeft.textContent = "CALIBRATION OFFLINE";
                pracAttemptsLeft.style.backgroundColor = "var(--error-container)";
                pracAttemptsLeft.style.color = "var(--error)";

                // Show visual correction solution
                pracSolutionContent.innerHTML = `<p>${state.currentQuestion.solutionText}</p>`;
                pracSolutionContainer.style.display = 'block';
                pracHintContainer.style.display = 'none';
                
                pracFeedbackText.className = "active-feedback-text feedback-error";
                pracFeedbackText.textContent = `SYSTEM CRITICAL: Solutions shown below.`;
                pracFeedbackText.style.display = 'block';

                // Reset streak
                gainPoints(0, false, state.currentQuestion.category);

                btnPracSubmit.style.display = 'none';
                btnPracHint.style.display = 'none';
                btnPracNext.style.display = 'inline-flex';

                addLog(`Calibration routine failed twice. Visual solutions forced onto console. Streak reset.`, "error");
            }
        }
    });

    // Next Question Handler
    btnPracNext.addEventListener('click', () => {
        sounds.click();
        loadNextPracticeQuestion();
    });

    // Hint toggle link handler
    btnPracHint.addEventListener('click', () => {
        sounds.click();
        if (pracHintContainer.style.display === 'none') {
            pracHintContainer.style.display = 'block';
        } else {
            pracHintContainer.style.display = 'none';
        }
    });

    // ----------------------------------------------------
    // 6. Init Boot Sequence
    // ----------------------------------------------------
    loadProfile();
    loadNextPracticeQuestion();
    addLog("Practice Console systems fully booted.", "system");
});
