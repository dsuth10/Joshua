/**
 * Luminous Math Practice Console - State & Logic Engine (Year 5)
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
            number: 0,
            algebra: 0,
            measurement: 0,
            space: 0,
            statistics: 0,
            probability: 0
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
        if (lvl === 5) return { min: 1000, max: 2000 };
        if (lvl === 6) return { min: 2000, max: 5000 };
        return { min: 5000, max: 999999 };
    }

    function calculateLevelAndRank(totalScore) {
        let level = 1;
        let rank = 'Novice Calibrator';

        if (totalScore >= 5000) {
            level = 7;
            rank = 'Station Admiral';
        } else if (totalScore >= 2000) {
            level = 6;
            rank = 'Grand Strategist';
        } else if (totalScore >= 1000) {
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
                
                // Migration logic: On load, if old category keys exist, sum their totals into number
                if (parsed.scoresByCat && (parsed.scoresByCat.recall !== undefined || parsed.scoresByCat['place-value'] !== undefined || parsed.scoresByCat.dispatch !== undefined)) {
                    const oldRecall = parsed.scoresByCat.recall || 0;
                    const oldPv = parsed.scoresByCat['place-value'] || 0;
                    const oldDispatch = parsed.scoresByCat.dispatch || 0;
                    
                    parsed.scoresByCat = {
                        number: oldRecall + oldPv + oldDispatch,
                        algebra: 0,
                        measurement: 0,
                        space: 0,
                        statistics: 0,
                        probability: 0
                    };
                }
                
                Object.assign(profile, parsed);
            } catch (e) {
                console.error("Failed to parse stored profile", e);
            }
        }

        // Ensure all new keys are present
        if (!profile.scoresByCat) {
            profile.scoresByCat = {};
        }
        const cats = ['number', 'algebra', 'measurement', 'space', 'statistics', 'probability'];
        cats.forEach(c => {
            if (profile.scoresByCat[c] === undefined) {
                profile.scoresByCat[c] = 0;
            }
        });

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
        if (profile.level === 7) {
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
        const addBadge = (id) => {
            if (!profile.badges.includes(id)) {
                profile.badges.push(id);
            }
        };

        if (profile.score > 0) addBadge('first-step');
        if (profile.streak >= 5) addBadge('streak-5');
        if (profile.streak >= 10) addBadge('streak-10');
        if (profile.streak >= 20) addBadge('streak-20');

        if ((profile.scoresByCat.number || 0) >= 100) addBadge('number-100');
        if ((profile.scoresByCat.algebra || 0) >= 100) addBadge('algebra-100');
        if ((profile.scoresByCat.measurement || 0) >= 100) addBadge('measurement-100');
        if ((profile.scoresByCat.space || 0) >= 100) addBadge('space-100');
        if ((profile.scoresByCat.statistics || 0) >= 100) addBadge('stats-100');
        if ((profile.scoresByCat.probability || 0) >= 100) addBadge('probability-100');

        // All rounder badge: 50pts in every category
        const cats = ['number', 'algebra', 'measurement', 'space', 'statistics', 'probability'];
        const isAllRounder = cats.every(cat => (profile.scoresByCat[cat] || 0) >= 50);
        if (isAllRounder) addBadge('all-rounder');

        saveProfile();
        loadProfile();

        if (profile.badges.length > oldBadgesCount) {
            sounds.badgeUnlock();
            addLog(`ACHIEVEMENT UNLOCKED: New badge is active on your profile shelf!`, "success");
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
        activeCategory: 'number', // 'number', 'algebra', 'measurement', 'space', 'statistics', 'probability'
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
    // Helpers & Formatting Functions
    // ----------------------------------------------------
    const getFactors = (num) => {
        const facts = [];
        for (let i = 1; i <= num; i++) {
            if (num % i === 0) facts.push(i);
        }
        return facts;
    };

    function shuffleArray(arr) {
        const copy = [...arr];
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    }

    function parseFraction(str) {
        const parts = str.trim().split('/');
        if (parts.length === 2) {
            const num = parseInt(parts[0], 10);
            const den = parseInt(parts[1], 10);
            if (!isNaN(num) && !isNaN(den) && den !== 0) {
                return num / den;
            }
        }
        const val = parseFloat(str);
        if (!isNaN(val)) return val;
        return null;
    }

    // SVG Coordinate Grid Helper
    function makeGridSvg(targetPt, startPt, endPt, drawPath = false, studentPt = null) {
        let svg = `<svg viewBox="0 0 300 300" style="width:100%; height:100%;">`;
        
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
            // Vertical grid line
            svg += `<line x1="${x}" y1="30" x2="${x}" y2="270" class="coord-gridline" />`;
            // Horizontal grid line
            svg += `<line x1="30" y1="${y}" x2="270" y2="${y}" class="coord-gridline" />`;
            
            // X-axis label
            svg += `<text x="${x}" y="285" class="coord-label">${i}</text>`;
            // Y-axis label
            svg += `<text x="15" y="${y}" class="coord-label coord-label-y">${i}</text>`;
        }

        // Axis Lines
        svg += `<line x1="30" y1="270" x2="280" y2="270" class="coord-axis" marker-end="url(#arrow)" />`;
        svg += `<line x1="30" y1="270" x2="30" y2="20" class="coord-axis" marker-end="url(#arrow)" />`;
        
        // Axis Variable Labels
        svg += `<text x="285" y="280" class="coord-label" style="font-weight:700;">x</text>`;
        svg += `<text x="35" y="15" class="coord-label" style="font-weight:700;">y</text>`;

        // Trace Manhattan Path (Hint helper)
        if (drawPath && startPt && endPt) {
            const sx = 30 + startPt.x * 24;
            const sy = 270 - startPt.y * 24;
            const ex = 30 + endPt.x * 24;
            const ey = 270 - endPt.y * 24;
            svg += `<path d="M ${sx} ${sy} L ${ex} ${sy} L ${ex} ${ey}" class="coordinate-path" />`;
        }

        // Invisible Clickable Intersection Targets
        for (let x = 0; x <= 10; x++) {
            for (let y = 0; y <= 10; y++) {
                const cx = 30 + x * 24;
                const cy = 270 - y * 24;
                svg += `<circle cx="${cx}" cy="${cy}" r="11" class="coord-cell" data-x="${x}" data-y="${y}" />`;
            }
        }

        // Start Point A
        if (startPt) {
            const cx = 30 + startPt.x * 24;
            const cy = 270 - startPt.y * 24;
            svg += `<circle cx="${cx}" cy="${cy}" class="coordinate-point waypoint" />`;
            svg += `<text x="${cx + 6}" y="${cy - 6}" class="coord-waypoint-label">A(${startPt.x},${startPt.y})</text>`;
        }

        // End Point B
        if (endPt) {
            const cx = 30 + endPt.x * 24;
            const cy = 270 - endPt.y * 24;
            svg += `<circle cx="${cx}" cy="${cy}" class="coordinate-point waypoint" style="fill:var(--secondary);" />`;
            svg += `<text x="${cx + 6}" y="${cy - 6}" class="coord-waypoint-label" style="fill:var(--secondary);">B(${endPt.x},${endPt.y})</text>`;
        }

        // Target Point (pulsing)
        if (targetPt) {
            const cx = 30 + targetPt.x * 24;
            const cy = 270 - targetPt.y * 24;
            svg += `<circle cx="${cx}" cy="${cy}" class="coordinate-point target" />`;
        }

        // Student Intersect Marker (selected dot)
        if (studentPt) {
            const cx = 30 + studentPt.x * 24;
            const cy = 270 - studentPt.y * 24;
            svg += `<circle cx="${cx}" cy="${cy}" r="6" fill="var(--tertiary)" stroke="var(--surface)" stroke-width="2" />`;
        }

        svg += `</svg>`;
        return svg;
    }

    // SVG Line Graph Helper (Statistics)
    function makeLineGraphSvg(daysData, highlightedIdx = null, title = "Data Set") {
        let svg = `<svg viewBox="0 0 400 240" style="width:100%; height:100%;">`;
        
        // Title
        svg += `<text x="200" y="20" class="graph-title">${title}</text>`;

        // Gridlines (y = 0 to 100)
        for (let yVal = 0; yVal <= 100; yVal += 20) {
            const y = 200 - yVal * 1.6;
            svg += `<line x1="40" y1="${y}" x2="380" y2="${y}" class="graph-gridline" />`;
            svg += `<text x="30" y="${y}" class="graph-label graph-label-y">${yVal}</text>`;
        }

        // Days labels
        const xSpacing = 50;
        for (let i = 0; i < 7; i++) {
            const x = 70 + i * xSpacing;
            svg += `<text x="${x}" y="215" class="graph-label graph-label-x">Day ${i+1}</text>`;
        }

        // Axes
        svg += `<line x1="40" y1="200" x2="380" y2="200" class="graph-axis" />`;
        svg += `<line x1="40" y1="200" x2="40" y2="30" class="graph-axis" />`;

        // Draw path segments & dots
        let pointsStr = '';
        let dots = '';
        for (let i = 0; i < 7; i++) {
            const x = 70 + i * xSpacing;
            const yVal = daysData[i];
            const y = 200 - yVal * 1.6;
            pointsStr += `${x},${y} `;
            
            const isHighlight = (i === highlightedIdx);
            dots += `<circle cx="${x}" cy="${y}" class="graph-dot ${isHighlight ? 'highlight' : ''}" />`;
            dots += `<text x="${x}" y="${y - 8}" class="graph-label" style="text-anchor:middle; font-weight:bold; fill:var(--primary);">${yVal}</text>`;
        }

        // Fill area
        svg += `<polygon points="70,200 ${pointsStr} 370,200" class="graph-area" />`;
        // Draw line
        svg += `<polyline points="${pointsStr}" class="graph-line" />`;
        // Draw dots
        svg += dots;

        svg += `</svg>`;
        return svg;
    }

    // ----------------------------------------------------
    // 5. Dynamic Category Generators & Helpers (6 strands)
    // ----------------------------------------------------
    const generators = {
        number: () => {
            const subTypes = ['decimal-ordering', 'factor-multiple', 'percentage-converter', 'multiplication', 'division-remainder'];
            const chosenType = subTypes[Math.floor(Math.random() * subTypes.length)];

            if (chosenType === 'decimal-ordering') {
                // Generate 4 unique decimal numbers in a similar range
                const decimals = [];
                const base = Math.floor(Math.random() * 8) + 1; // 1 to 8
                
                // Form offsets to create numbers like: base.3, base.35, base.305, base.035
                const offsets = [0.3, 0.35, 0.305, 0.035, 0.05, 0.5, 0.25, 0.205];
                const selectedOffsets = shuffleArray(offsets).slice(0, 4);
                
                selectedOffsets.forEach(off => {
                    decimals.push(parseFloat((base + off).toFixed(3)));
                });
                
                const sorted = [...decimals].sort((a, b) => a - b);
                const shuffled = shuffleArray(decimals);

                return {
                    category: 'number',
                    type: 'decimal-ordering',
                    questionText: 'Order the decimal numbers from smallest to largest:',
                    targetAns: sorted,
                    hintText: `
                        <p>To order decimals, align the decimal places column by column (Ones, tenths, hundredths, thousandths). Padding numbers with zeroes helps compare: </p>
                        <div style="font-family:var(--font-mono); margin-top:8px; display:flex; flex-direction:column; gap:4px;">
                            ${shuffled.map(d => `<span>${d.toFixed(3).replace(/\.?0+$/, '')} ➔ ${d.toFixed(3)}</span>`).join('')}
                        </div>
                    `,
                    solutionText: `Aligning the decimal places, the correct sorted order from smallest to largest is: ${sorted[0]} < ${sorted[1]} < ${sorted[2]} < ${sorted[3]}.`,
                    renderFunc: (container) => {
                        container.innerHTML = `
                            <div class="flex-col align-center gap-12">
                                <p>Arrange these decimal values from smallest (1st) to largest (4th):</p>
                                <div class="flex-row gap-12 justify-center" style="font-size:1.4rem; font-weight:700; color:var(--primary); margin-bottom:8px; flex-wrap:wrap;">
                                    ${shuffled.map(d => `<span class="hint-expander-place">${d}</span>`).join('')}
                                </div>
                                <div class="flex-row gap-8 align-center flex-wrap justify-center">
                                    <span>1st:</span>
                                    <select id="dec-ord-1" class="input-text-terminal" style="width:90px;"></select>
                                    <span>&lt; 2nd:</span>
                                    <select id="dec-ord-2" class="input-text-terminal" style="width:90px;"></select>
                                    <span>&lt; 3rd:</span>
                                    <select id="dec-ord-3" class="input-text-terminal" style="width:90px;"></select>
                                    <span>&lt; 4th:</span>
                                    <select id="dec-ord-4" class="input-text-terminal" style="width:90px;"></select>
                                </div>
                            </div>
                        `;
                        const selects = ['dec-ord-1', 'dec-ord-2', 'dec-ord-3', 'dec-ord-4'];
                        selects.forEach(id => {
                            const sel = document.getElementById(id);
                            sel.innerHTML = '<option value="">-</option>';
                            shuffled.forEach(d => {
                                sel.innerHTML += `<option value="${d}">${d}</option>`;
                            });
                        });
                    },
                    validateFunc: () => {
                        const v1 = parseFloat(document.getElementById('dec-ord-1').value);
                        const v2 = parseFloat(document.getElementById('dec-ord-2').value);
                        const v3 = parseFloat(document.getElementById('dec-ord-3').value);
                        const v4 = parseFloat(document.getElementById('dec-ord-4').value);
                        if (isNaN(v1) || isNaN(v2) || isNaN(v3) || isNaN(v4)) return false;
                        return v1 === sorted[0] && v2 === sorted[1] && v3 === sorted[2] && v4 === sorted[3];
                    }
                };
            } else if (chosenType === 'factor-multiple') {
                const targetNums = [24, 30, 36, 40, 48];
                const N = targetNums[Math.floor(Math.random() * targetNums.length)];
                
                // Divisor factor check
                const isFact = Math.random() > 0.5;
                let F = 1;
                const facts = getFactors(N);
                
                if (isFact) {
                    // Pick a random factor (exclude 1 and N for fun if possible)
                    const subFacts = facts.filter(f => f !== 1 && f !== N);
                    F = subFacts.length > 0 ? subFacts[Math.floor(Math.random() * subFacts.length)] : 2;
                } else {
                    // Pick a non-factor between 3 and 11
                    const nonFacts = [];
                    for (let i = 3; i < 12; i++) {
                        if (N % i !== 0) nonFacts.push(i);
                    }
                    F = nonFacts[Math.floor(Math.random() * nonFacts.length)];
                }

                let isYesSelected = null;

                return {
                    category: 'number',
                    type: 'factor-multiple',
                    questionText: `Factor & Multiplicity diagnostic query:`,
                    targetAns: { isYes: (N % F === 0), factors: facts },
                    hintText: `
                        <p>A <strong>factor</strong> is a whole number that divides into another number exactly without leaving a remainder.</p>
                        <p>For example, to check if ${F} is a factor of ${N}, calculate: ${N} ÷ ${F}. If it is a whole number, then it is a factor.</p>
                        <p style="margin-top:6px;">Factors always come in pairs (e.g. 1 × ${N} = ${N}). Check all pairs up to the square root of ${N}.</p>
                    `,
                    solutionText: `Calculation check: ${N} ÷ ${F} = ${(N / F).toFixed(2)}. Therefore, ${F} is ${N % F === 0 ? 'indeed' : 'not'} a factor of ${N}. The complete factor set of ${N} is: ${facts.join(', ')}.`,
                    renderFunc: (container) => {
                        container.innerHTML = `
                            <div class="flex-col gap-12" style="max-width: 480px; margin: 0 auto;">
                                <div style="font-size:1rem; font-weight:600;">Part A: Is <strong>${F}</strong> a factor of <strong>${N}</strong>?</div>
                                <div class="flex-row gap-12 justify-center">
                                    <button type="button" class="btn-terminal" id="fact-mult-yes" style="flex:1;">YES</button>
                                    <button type="button" class="btn-terminal" id="fact-mult-no" style="flex:1;">NO</button>
                                </div>
                                <div style="font-size:1rem; font-weight:600; margin-top:8px;">Part B: List all factors of <strong>${N}</strong>:</div>
                                <input type="text" class="input-text-terminal" id="fact-mult-list" placeholder="e.g. 1, 2, 3, 4..." autocomplete="off">
                                <p style="font-size:0.75rem; color:var(--outline); margin-top: 4px;">Separate numbers with commas. You may write them in any order.</p>
                            </div>
                        `;

                        const yesBtn = document.getElementById('fact-mult-yes');
                        const noBtn = document.getElementById('fact-mult-no');

                        yesBtn.addEventListener('click', () => {
                            sounds.click();
                            isYesSelected = true;
                            yesBtn.classList.add('primary');
                            noBtn.classList.remove('primary');
                        });

                        noBtn.addEventListener('click', () => {
                            sounds.click();
                            isYesSelected = false;
                            noBtn.classList.add('primary');
                            yesBtn.classList.remove('primary');
                        });
                    },
                    validateFunc: () => {
                        const correctYesNo = (N % F === 0) ? (isYesSelected === true) : (isYesSelected === false);
                        const listVal = document.getElementById('fact-mult-list').value;
                        const userFacts = listVal.split(',')
                            .map(x => parseInt(x.trim(), 10))
                            .filter(x => !isNaN(x));
                        const uniqueUserFacts = [...new Set(userFacts)].sort((a, b) => a - b);
                        const listCorrect = (uniqueUserFacts.length === facts.length) && uniqueUserFacts.every((val, idx) => val === facts[idx]);
                        return correctYesNo && listCorrect;
                    }
                };
            } else if (chosenType === 'percentage-converter') {
                const varType = Math.floor(Math.random() * 3);
                
                if (varType === 0) {
                    // Fraction to Percentage
                    const fracOptions = [
                        { text: '1/2', val: 50 },
                        { text: '1/4', val: 25 },
                        { text: '3/4', val: 75 },
                        { text: '1/5', val: 20 },
                        { text: '2/5', val: 40 },
                        { text: '3/5', val: 60 },
                        { text: '4/5', val: 80 },
                        { text: '1/10', val: 10 },
                        { text: '3/10', val: 30 },
                        { text: '7/10', val: 70 }
                    ];
                    const selected = fracOptions[Math.floor(Math.random() * fracOptions.length)];

                    return {
                        category: 'number',
                        type: 'percentage-converter',
                        questionText: `Convert the fraction <strong>${selected.text}</strong> to a percentage:`,
                        targetAns: selected.val,
                        hintText: `<p>A percentage is a fraction out of 100. Find an equivalent fraction with a denominator of 100: e.g. ${selected.text} = (${selected.val}/100) = ${selected.val}%.</p>`,
                        solutionText: `Since ${selected.text} represents ${selected.val} hundredths, it is equal to ${selected.val}%.`,
                        renderFunc: (container) => {
                            container.innerHTML = `
                                <div class="flex-col align-center gap-12">
                                    <div style="font-size:2.5rem; font-weight:700; color:var(--primary);">${selected.text}</div>
                                    <div class="question-input-group">
                                        <input type="number" class="input-text-terminal input-number-small" id="prac-pct-ans" placeholder="?" style="width:100px;">
                                        <span style="font-size:1.5rem; font-weight:700;">%</span>
                                    </div>
                                </div>
                            `;
                        },
                        validateFunc: () => {
                            const val = parseInt(document.getElementById('prac-pct-ans').value.trim(), 10);
                            return val === selected.val;
                        }
                    };
                } else if (varType === 1) {
                    // Percentage to Fraction
                    const pctOptions = [
                        { pct: 25, frac: '1/4' },
                        { pct: 50, frac: '1/2' },
                        { pct: 75, frac: '3/4' },
                        { pct: 20, frac: '1/5' },
                        { pct: 40, frac: '2/5' },
                        { pct: 60, frac: '3/5' },
                        { pct: 80, frac: '4/5' },
                        { pct: 10, frac: '1/10' }
                    ];
                    const selected = pctOptions[Math.floor(Math.random() * pctOptions.length)];

                    return {
                        category: 'number',
                        type: 'percentage-converter',
                        questionText: `Convert the percentage <strong>${selected.pct}%</strong> to a simplified fraction:`,
                        targetAns: selected.frac,
                        hintText: `<p>Write the percentage as a fraction over 100, then simplify: ${selected.pct}% = ${selected.pct}/100. Divide the numerator and denominator by their greatest common divisor.</p>`,
                        solutionText: `Writing as a fraction: ${selected.pct}/100. Simplifying it gives ${selected.frac}.`,
                        renderFunc: (container) => {
                            container.innerHTML = `
                                <div class="flex-col align-center gap-12">
                                    <div style="font-size:2.5rem; font-weight:700; color:var(--primary);">${selected.pct}%</div>
                                    <div class="question-input-group">
                                        <input type="text" class="input-text-terminal input-number-small" id="prac-pct-ans" placeholder="e.g. 1/2" style="width:120px;">
                                    </div>
                                </div>
                            `;
                        },
                        validateFunc: () => {
                            const val = document.getElementById('prac-pct-ans').value.trim();
                            const userRatio = parseFraction(val);
                            const targetRatio = parseFraction(selected.frac);
                            return userRatio !== null && Math.abs(userRatio - targetRatio) < 0.001;
                        }
                    };
                } else {
                    // Decimal to Percentage
                    const decVal = parseFloat((Math.floor(Math.random() * 95) + 5) / 100).toFixed(2);
                    const pctVal = Math.round(decVal * 100);

                    return {
                        category: 'number',
                        type: 'percentage-converter',
                        questionText: `Convert the decimal <strong>${decVal}</strong> to a percentage:`,
                        targetAns: pctVal,
                        hintText: `<p>To convert a decimal to a percentage, multiply by 100 (which shifts the decimal point two places to the right): e.g. ${decVal} × 100 = ${pctVal}%.</p>`,
                        solutionText: `Decimal ${decVal} multiplied by 100 is exactly ${pctVal}%.`,
                        renderFunc: (container) => {
                            container.innerHTML = `
                                <div class="flex-col align-center gap-12">
                                    <div style="font-size:2.5rem; font-weight:700; color:var(--primary);">${decVal}</div>
                                    <div class="question-input-group">
                                        <input type="number" class="input-text-terminal input-number-small" id="prac-pct-ans" placeholder="?" style="width:100px;">
                                        <span style="font-size:1.5rem; font-weight:700;">%</span>
                                    </div>
                                </div>
                            `;
                        },
                        validateFunc: () => {
                            const val = parseInt(document.getElementById('prac-pct-ans').value.trim(), 10);
                            return val === pctVal;
                        }
                    };
                }
            } else if (chosenType === 'multiplication') {
                const isLargeOneDigit = Math.random() > 0.5;
                let A, B;
                if (isLargeOneDigit) {
                    A = Math.floor(Math.random() * 388) + 112; // 3-digit: 112 to 499
                    B = Math.floor(Math.random() * 7) + 3;      // 1-digit: 3 to 9
                } else {
                    A = Math.floor(Math.random() * 48) + 12;   // 2-digit: 12 to 59
                    B = Math.floor(Math.random() * 19) + 11;   // 2-digit: 11 to 29
                }
                const ans = A * B;

                return {
                    category: 'number',
                    type: 'multiplication',
                    questionText: `Calculate the product:`,
                    targetAns: ans,
                    hintText: `
                        <p>Work out the multiplication step-by-step. E.g. partition the numbers:</p>
                        <p style="font-family:var(--font-mono); font-size:0.85rem; margin-top:6px;">
                            ${isLargeOneDigit ? `${A} × ${B} = (${A - A%100}) × ${B} + (${A%100 - A%10}) × ${B} + (${A%10}) × ${B}` : `${A} × ${B} = ${A} × ${B - B%10} + ${A} × ${B%10}`}
                        </p>
                    `,
                    solutionText: `Using standard algorithms, ${A} multiplied by ${B} is exactly ${ans}.`,
                    renderFunc: (container) => {
                        container.innerHTML = `
                            <div class="flex-col align-center gap-12">
                                <div style="font-size:2.8rem; font-weight:700; color:var(--primary);">${A} × ${B}</div>
                                <div class="question-input-group">
                                    <input type="number" class="input-text-terminal input-number-small" id="prac-mult-ans" placeholder="?" style="width:140px; font-size:1.8rem;" autocomplete="off">
                                </div>
                            </div>
                        `;
                    },
                    validateFunc: () => {
                        const val = parseInt(document.getElementById('prac-mult-ans').value.trim(), 10);
                        return val === ans;
                    }
                };
            } else {
                // Division with remainder
                const B = Math.floor(Math.random() * 6) + 4; // divisor: 4 to 9
                const Q = Math.floor(Math.random() * 80) + 12; // quotient: 12 to 91
                const R = Math.floor(Math.random() * (B - 1)) + 1; // remainder: 1 to B-1
                const A = Q * B + R;

                return {
                    category: 'number',
                    type: 'division-remainder',
                    questionText: `Solve the division equation with remainders:`,
                    targetAns: { quotient: Q, remainder: R },
                    hintText: `
                        <p>Carry out short division step-by-step from the left:</p>
                        <p style="margin-top:6px;">E.g. for ${A} ÷ ${B}, check how many times ${B} fits into the hundreds/tens, write down the remainder, and carry it forward.</p>
                        <p style="margin-top:4px; font-family:var(--font-mono); font-size:0.85rem;">Formula check: divisor × quotient + remainder = total</p>
                    `,
                    solutionText: `${A} ÷ ${B} = ${Q} with a remainder of ${R}, because ${B} × ${Q} = ${B*Q}, and ${B*Q} + ${R} = ${A}.`,
                    renderFunc: (container) => {
                        container.innerHTML = `
                            <div class="flex-col align-center gap-12">
                                <div style="font-size:2.8rem; font-weight:700; color:var(--primary);">${A} ÷ ${B}</div>
                                <div class="flex-row gap-8 align-center">
                                    <input type="number" id="div-rem-q" class="input-text-terminal input-number-small" placeholder="Quotient" style="width:110px; font-size:1.2rem;" autocomplete="off">
                                    <span style="font-size:1.2rem; font-weight:700;">r</span>
                                    <input type="number" id="div-rem-r" class="input-text-terminal input-number-small" placeholder="Remainder" style="width:90px; font-size:1.2rem;" autocomplete="off">
                                </div>
                            </div>
                        `;
                    },
                    validateFunc: () => {
                        const userQ = parseInt(document.getElementById('div-rem-q').value.trim(), 10);
                        const userR = parseInt(document.getElementById('div-rem-r').value.trim(), 10);
                        return userQ === Q && userR === R;
                    }
                };
            }
        },

        algebra: () => {
            const subTypes = ['fact-families', 'find-unknown'];
            const chosenType = subTypes[Math.floor(Math.random() * subTypes.length)];

            if (chosenType === 'fact-families') {
                const a = Math.floor(Math.random() * 8) + 4; // 4 to 11
                const b = Math.floor(Math.random() * 8) + 4; // 4 to 11
                if (a === b) return generators.algebra(); // prevent squares for fact families
                const c = a * b;

                return {
                    category: 'algebra',
                    type: 'fact-families',
                    questionText: `Complete the related equations in this fact family:`,
                    targetAns: { a, b, c },
                    hintText: `
                        <p>Fact families relate multiplication and division. The three numbers involved are <strong>${a}</strong>, <strong>${b}</strong>, and <strong>${c}</strong>.</p>
                        <p>Since <strong>${a} × ${b} = ${c}</strong> is given:</p>
                        <ul>
                            <li>The second multiplication fact swaps the factors: <strong>? × ? = ${c}</strong></li>
                            <li>The two division facts start with the product: <strong>${c} ÷ ? = ?</strong></li>
                        </ul>
                    `,
                    solutionText: `The fact family equations are: ${b} × ${a} = ${c}, ${c} ÷ ${a} = ${b}, and ${c} ÷ ${b} = ${a}.`,
                    renderFunc: (container) => {
                        container.innerHTML = `
                            <div class="flex-col gap-12" style="max-width: 480px; margin: 0 auto;">
                                <p style="text-align:center;">Given: <strong>${a} × ${b} = ${c}</strong>. Enter the other three members of the family:</p>
                                <div class="flex-col gap-8">
                                    <div class="flex-row align-center gap-8 justify-center">
                                        <input type="number" id="ff-a1" class="input-text-terminal" style="width:60px; text-align:center;" autocomplete="off">
                                        <span style="font-weight:bold;">×</span>
                                        <input type="number" id="ff-a2" class="input-text-terminal" style="width:60px; text-align:center;" autocomplete="off">
                                        <span style="font-weight:bold;">=</span>
                                        <input type="number" id="ff-a3" class="input-text-terminal" style="width:70px; text-align:center;" autocomplete="off">
                                    </div>
                                    <div class="flex-row align-center gap-8 justify-center">
                                        <input type="number" id="ff-b1" class="input-text-terminal" style="width:70px; text-align:center;" autocomplete="off">
                                        <span style="font-weight:bold;">÷</span>
                                        <input type="number" id="ff-b2" class="input-text-terminal" style="width:60px; text-align:center;" autocomplete="off">
                                        <span style="font-weight:bold;">=</span>
                                        <input type="number" id="ff-b3" class="input-text-terminal" style="width:60px; text-align:center;" autocomplete="off">
                                    </div>
                                    <div class="flex-row align-center gap-8 justify-center">
                                        <input type="number" id="ff-c1" class="input-text-terminal" style="width:70px; text-align:center;" autocomplete="off">
                                        <span style="font-weight:bold;">÷</span>
                                        <input type="number" id="ff-c2" class="input-text-terminal" style="width:60px; text-align:center;" autocomplete="off">
                                        <span style="font-weight:bold;">=</span>
                                        <input type="number" id="ff-c3" class="input-text-terminal" style="width:60px; text-align:center;" autocomplete="off">
                                    </div>
                                </div>
                            </div>
                        `;
                    },
                    validateFunc: () => {
                        const a1 = parseInt(document.getElementById('ff-a1').value.trim(), 10);
                        const a2 = parseInt(document.getElementById('ff-a2').value.trim(), 10);
                        const a3 = parseInt(document.getElementById('ff-a3').value.trim(), 10);
                        
                        const b1 = parseInt(document.getElementById('ff-b1').value.trim(), 10);
                        const b2 = parseInt(document.getElementById('ff-b2').value.trim(), 10);
                        const b3 = parseInt(document.getElementById('ff-b3').value.trim(), 10);
                        
                        const c1 = parseInt(document.getElementById('ff-c1').value.trim(), 10);
                        const c2 = parseInt(document.getElementById('ff-c2').value.trim(), 10);
                        const c3 = parseInt(document.getElementById('ff-c3').value.trim(), 10);

                        if (isNaN(a1) || isNaN(a2) || isNaN(a3) || isNaN(b1) || isNaN(b2) || isNaN(b3) || isNaN(c1) || isNaN(c2) || isNaN(c3)) {
                            return false;
                        }

                        // Multiplication: we expect b * a = c (since a * b = c is given)
                        const multCorrect = (a1 === b && a2 === a && a3 === c);

                        // Division 1: b1 / b2 = b3 (starts with c, uses a & b)
                        const div1Correct = (b1 === c && ((b2 === a && b3 === b) || (b2 === b && b3 === a)));
                        // Division 2: c1 / c2 = c3 (starts with c, uses a & b)
                        const div2Correct = (c1 === c && ((c2 === a && c3 === b) || (c2 === b && c3 === a)));
                        // Ensure divisions are unique
                        const divsUnique = (b2 !== c2);

                        return multCorrect && div1Correct && div2Correct && divsUnique;
                    }
                };
            } else {
                // Find the unknown
                const type = Math.floor(Math.random() * 4);
                const a = Math.floor(Math.random() * 9) + 4; // 4 to 12
                const ans = Math.floor(Math.random() * 9) + 3; // 3 to 11
                const b = a * ans;

                let eqHtml = '';
                if (type === 0) {
                    eqHtml = `<input type="number" id="unknown-val" class="input-text-terminal input-number-small" style="width:80px; font-size:2rem; text-align:center;" autocomplete="off"> × ${a} = ${b}`;
                } else if (type === 1) {
                    eqHtml = `${a} × <input type="number" id="unknown-val" class="input-text-terminal input-number-small" style="width:80px; font-size:2rem; text-align:center;" autocomplete="off"> = ${b}`;
                } else if (type === 2) {
                    eqHtml = `<input type="number" id="unknown-val" class="input-text-terminal input-number-small" style="width:80px; font-size:2rem; text-align:center;" autocomplete="off"> ÷ ${a} = ${ans}`;
                } else {
                    eqHtml = `${b} ÷ <input type="number" id="unknown-val" class="input-text-terminal input-number-small" style="width:80px; font-size:2rem; text-align:center;" autocomplete="off"> = ${a}`;
                }

                return {
                    category: 'algebra',
                    type: 'find-unknown',
                    questionText: `Solve for the unknown value represented by the input box:`,
                    targetAns: type === 2 ? b : ans,
                    hintText: `
                        <p>Use the inverse operation to solve for the unknown box:</p>
                        <ul>
                            <li>The inverse of multiplication is division. If <strong>□ × ${a} = ${b}</strong>, then <strong>□ = ${b} ÷ ${a}</strong>.</li>
                            <li>The inverse of division is multiplication. If <strong>□ ÷ ${a} = ${ans}</strong>, then <strong>□ = ${ans} × ${a}</strong>.</li>
                        </ul>
                    `,
                    solutionText: `Working out: ${type === 2 ? `${ans} × ${a} = ${b}` : `${b} ÷ ${a} = ${ans}`}. The unknown value is ${type === 2 ? b : ans}.`,
                    renderFunc: (container) => {
                        container.innerHTML = `
                            <div class="flex-col align-center gap-12">
                                <div style="font-size:2.2rem; font-weight:700; color:var(--primary); display:flex; align-items:center; gap:8px;">
                                    ${eqHtml}
                                </div>
                            </div>
                        `;
                    },
                    validateFunc: () => {
                        const val = parseInt(document.getElementById('unknown-val').value.trim(), 10);
                        return val === (type === 2 ? b : ans);
                    }
                };
            }
        },

        measurement: () => {
            const subTypes = ['perimeter-area', 'time-conversion'];
            const chosenType = subTypes[Math.floor(Math.random() * subTypes.length)];

            if (chosenType === 'perimeter-area') {
                // Compound L-shape dimensions in metres
                const W = Math.floor(Math.random() * 5) + 8; // width: 8 to 12
                const H = Math.floor(Math.random() * 5) + 8; // height: 8 to 12
                const w = Math.floor(Math.random() * 3) + 3; // cut-out width: 3 to 5
                const h = Math.floor(Math.random() * 3) + 3; // cut-out height: 3 to 5

                const perimeter = 2 * (W + H);
                const area = W * H - w * h;

                // Scale for SVG drawing: standard box is 200x200
                const scale = 14;
                const topW = W - w;
                const rightH = H - h;

                return {
                    category: 'measurement',
                    type: 'perimeter-area',
                    questionText: `Calculate the perimeter and area of the compound shape below:`,
                    targetAns: { perimeter, area },
                    hintText: `
                        <p>1. Find the unknown side lengths first. The total width is ${W} m, so the bottom horizontal part is ${W} - ${w} = ${topW} m.</p>
                        <p>2. The total height is ${H} m, so the upper right vertical part is ${H} - ${h} = ${rightH} m.</p>
                        <p>3. <strong>Perimeter</strong> is the total distance around the boundary. Add all 6 side lengths together.</p>
                        <p>4. <strong>Area</strong> can be found by dividing the shape into two rectangles, or by subtracting the cut-out corner (${w} × ${h}) from the large bounding rectangle (${W} × ${H}).</p>
                    `,
                    solutionText: `Unknown sides: bottom horizontal = ${topW} m, right vertical = ${rightH} m. Perimeter = ${W} + ${H} + ${w} + ${h} + ${topW} + ${rightH} = ${perimeter} m. Area = (${W} × ${H}) - (${w} × ${h}) = ${W*H} - ${w*h} = ${area} m².`,
                    renderFunc: (container) => {
                        // Coordinates: start top-left (20,20), draw L-shape
                        // Path: M 20,20 h (topW*scale) v (rightH*scale) h (w*scale) v (h*scale) h (-W*scale) Z
                        const startX = 30;
                        const startY = 30;
                        const pTopW = topW * scale;
                        const pRightH = rightH * scale;
                        const pW = W * scale;
                        const pH = H * scale;
                        const pw = w * scale;
                        const ph = h * scale;

                        const pathStr = `M ${startX},${startY} h ${pTopW} v ${pRightH} h ${pw} v ${ph} h ${-pW} Z`;

                        container.innerHTML = `
                            <div class="flex-col align-center gap-12">
                                <div class="compound-shape-container">
                                    <svg viewBox="0 0 240 220" style="width:100%;">
                                        <!-- Shape -->
                                        <path d="${pathStr}" class="shape-fill" />
                                        
                                        <!-- Dimensions Labels -->
                                        <!-- Top Edge -->
                                        <text x="${startX + pTopW/2}" y="${startY - 8}" class="shape-dimension" text-anchor="middle">${topW} m</text>
                                        <!-- Left Edge -->
                                        <text x="${startX - 10}" y="${startY + pH/2}" class="shape-dimension" text-anchor="end" dominant-baseline="central">${H} m</text>
                                        <!-- Right Vertical Upper -->
                                        <text x="${startX + pTopW + 10}" y="${startY + pRightH/2}" class="shape-dimension" dominant-baseline="central">${rightH} m</text>
                                        <!-- Inner Horizontal -->
                                        <text x="${startX + pTopW + pw/2}" y="${startY + pRightH - 8}" class="shape-dimension" text-anchor="middle">${w} m</text>
                                        <!-- Right Lower Edge (labeled as h) -->
                                        <text x="${startX + pW + 10}" y="${startY + pRightH + ph/2}" class="shape-dimension" dominant-baseline="central">${h} m</text>
                                        <!-- Bottom Edge (labeled as W) -->
                                        <text x="${startX + pW/2}" y="${startY + pH + 15}" class="shape-dimension" text-anchor="middle">${W} m</text>
                                    </svg>
                                </div>
                                <div class="flex-row gap-16 align-center flex-wrap justify-center">
                                    <div class="question-input-group">
                                        <span style="font-size:0.9rem; font-weight:600;">Perimeter:</span>
                                        <input type="number" id="prac-meas-perim" class="input-text-terminal input-number-small" style="width:80px;" autocomplete="off">
                                        <span style="font-size:0.9rem;">m</span>
                                    </div>
                                    <div class="question-input-group">
                                        <span style="font-size:0.9rem; font-weight:600;">Area:</span>
                                        <input type="number" id="prac-meas-area" class="input-text-terminal input-number-small" style="width:80px;" autocomplete="off">
                                        <span style="font-size:0.9rem;">m²</span>
                                    </div>
                                </div>
                            </div>
                        `;
                    },
                    validateFunc: () => {
                        const userP = parseInt(document.getElementById('prac-meas-perim').value.trim(), 10);
                        const userA = parseInt(document.getElementById('prac-meas-area').value.trim(), 10);
                        return userP === perimeter && userA === area;
                    }
                };
            } else {
                // Time conversion: 12h ↔ 24h
                const to24Hour = Math.random() > 0.5;
                const hours12 = Math.floor(Math.random() * 12) + 1; // 1 to 12
                const mins = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55][Math.floor(Math.random() * 12)];
                const period = Math.random() > 0.5 ? 'AM' : 'PM';

                const minsStr = mins.toString().padStart(2, '0');
                const time12Str = `${hours12}:${minsStr} ${period}`;
                
                let hours24 = hours12;
                if (period === 'PM') {
                    hours24 = hours12 === 12 ? 12 : hours12 + 12;
                } else {
                    hours24 = hours12 === 12 ? 0 : hours12;
                }
                const time24Str = `${hours24.toString().padStart(2, '0')}:${minsStr}`;

                return {
                    category: 'measurement',
                    type: 'time-conversion',
                    questionText: to24Hour ? `Convert the 12-hour time representation to 24-hour time:` : `Convert the 24-hour time representation to 12-hour time:`,
                    targetAns: to24Hour ? time24Str : time12Str,
                    hintText: to24Hour ? `
                        <p>To convert to 24-hour time:</p>
                        <ul>
                            <li>For AM times (except 12:xx AM), the hour stays the same. Midnight (12:xx AM) becomes 00:xx.</li>
                            <li>For PM times (except 12:xx PM), add 12 to the hour value: e.g. ${hours12} PM + 12 = ${hours24}.</li>
                        </ul>
                    ` : `
                        <p>To convert from 24-hour time:</p>
                        <ul>
                            <li>If the hour is 00, it is 12:xx AM (midnight).</li>
                            <li>If the hour is 12, it is 12:xx PM (noon).</li>
                            <li>If the hour is 13 or more, subtract 12 and add "PM".</li>
                            <li>Otherwise, it is an "AM" time.</li>
                        </ul>
                    `,
                    solutionText: to24Hour ? `${time12Str} in 24-hour clock formatting is exactly ${time24Str}.` : `${time24Str} in 12-hour clock formatting is ${time12Str}.`,
                    renderFunc: (container) => {
                        container.innerHTML = `
                            <div class="flex-col align-center gap-16">
                                <div class="time-display">
                                    <div class="flex-col align-center">
                                        <span class="time-label">SOURCE TIME</span>
                                        <div class="time-clock">${to24Hour ? time12Str : time24Str}</div>
                                    </div>
                                    <span style="font-size:2rem; font-weight:700;">➔</span>
                                    <div class="flex-col align-center">
                                        <span class="time-label">CONVERTED RESULT</span>
                                        <input type="text" id="prac-time-ans" class="input-text-terminal text-center" style="font-size:1.8rem; font-family:var(--font-mono); width:180px; height:58px; font-weight:700;" placeholder="${to24Hour ? 'hh:mm' : 'hh:mm AM'}" autocomplete="off">
                                    </div>
                                </div>
                                <p style="font-size:0.75rem; color:var(--outline);">Type using AM/PM suffix (e.g. 3:45 PM) or 24-hour format (e.g. 15:45).</p>
                            </div>
                        `;
                    },
                    validateFunc: () => {
                        const userAns = document.getElementById('prac-time-ans').value.trim().toUpperCase();
                        if (to24Hour) {
                            // Validate 24-hour time input (e.g. "17:15" or "07:15")
                            const normalizedUser = userAns.replace(/^0/, ''); // strip leading zero for comparison
                            const normalizedTarget = time24Str.replace(/^0/, '');
                            return normalizedUser === normalizedTarget;
                        } else {
                            // Validate 12-hour time input (e.g. "7:15 PM", "07:15PM")
                            const parsedUser = userAns.replace(/\s+/g, ''); // strip spaces
                            const parsedTarget = time12Str.replace(/\s+/g, '').toUpperCase();
                            // Handle leading zeros in user input hour, e.g. "07:15PM" matches "7:15PM"
                            const cleanUser = parsedUser.replace(/^0/, '');
                            const cleanTarget = parsedTarget.replace(/^0/, '');
                            return cleanUser === cleanTarget;
                        }
                    }
                };
            }
        },

        space: () => {
            const subTypes = ['read-coordinate', 'movement', 'distance'];
            const chosenType = subTypes[Math.floor(Math.random() * subTypes.length)];

            if (chosenType === 'read-coordinate') {
                const targetPt = {
                    x: Math.floor(Math.random() * 9) + 1,
                    y: Math.floor(Math.random() * 9) + 1
                };
                let studentPt = null;

                return {
                    category: 'space',
                    type: 'read-coordinate',
                    questionText: `Identify the coordinate coordinates of the red target indicator point on the grid:`,
                    targetAns: targetPt,
                    hintText: `
                        <p>To read coordinates on a 2D grid:</p>
                        <ol>
                            <li>Trace vertical line straight down to the horizontal <strong>x-axis</strong>. That is ${targetPt.x}.</li>
                            <li>Trace horizontal line straight left to the vertical <strong>y-axis</strong>. That is ${targetPt.y}.</li>
                            <li>Write them in order: <strong>(x, y) ➔ (${targetPt.x}, ${targetPt.y})</strong>.</li>
                        </ol>
                    `,
                    solutionText: `The target point aligns with x = ${targetPt.x} on the horizontal axis and y = ${targetPt.y} on the vertical axis. Coordinates: (${targetPt.x}, ${targetPt.y}).`,
                    renderFunc: (container) => {
                        const renderGrid = () => {
                            const gridHost = document.getElementById('space-grid-host');
                            if (gridHost) {
                                gridHost.innerHTML = makeGridSvg(targetPt, null, null, false, studentPt);
                                attachGridListeners();
                            }
                        };

                        container.innerHTML = `
                            <div class="flex-col align-center gap-12">
                                <div class="coordinate-grid-container" id="space-grid-host">
                                    ${makeGridSvg(targetPt, null, null, false, studentPt)}
                                </div>
                                <div class="flex-row gap-16 align-center">
                                    <span style="font-size:0.9rem; font-weight:600;">Coordinates:</span>
                                    <div class="coord-input-pair">
                                        <span>(</span>
                                        <input type="number" id="prac-coord-x" class="input-text-terminal" placeholder="x" min="0" max="10" autocomplete="off">
                                        <span>,</span>
                                        <input type="number" id="prac-coord-y" class="input-text-terminal" placeholder="y" min="0" max="10" autocomplete="off">
                                        <span>)</span>
                                    </div>
                                </div>
                                <p style="font-size:0.75rem; color:var(--outline); margin-top:4px;">
                                    Click on any intersection point of the grid above, or type values manually.
                                </p>
                            </div>
                        `;

                        const inpX = document.getElementById('prac-coord-x');
                        const inpY = document.getElementById('prac-coord-y');

                        const attachGridListeners = () => {
                            container.querySelectorAll('.coord-cell').forEach(cell => {
                                cell.addEventListener('click', (e) => {
                                    sounds.click();
                                    const x = parseInt(e.currentTarget.getAttribute('data-x'), 10);
                                    const y = parseInt(e.currentTarget.getAttribute('data-y'), 10);
                                    inpX.value = x;
                                    inpY.value = y;
                                    studentPt = { x, y };
                                    renderGrid();
                                });
                            });
                        };

                        const handleTextInp = () => {
                            const x = parseInt(inpX.value, 10);
                            const y = parseInt(inpY.value, 10);
                            if (!isNaN(x) && x >= 0 && x <= 10 && !isNaN(y) && y >= 0 && y <= 10) {
                                studentPt = { x, y };
                                renderGrid();
                            }
                        };

                        inpX.addEventListener('input', handleTextInp);
                        inpY.addEventListener('input', handleTextInp);
                        attachGridListeners();
                    },
                    validateFunc: () => {
                        const userX = parseInt(document.getElementById('prac-coord-x').value.trim(), 10);
                        const userY = parseInt(document.getElementById('prac-coord-y').value.trim(), 10);
                        return userX === targetPt.x && userY === targetPt.y;
                    }
                };
            } else if (chosenType === 'movement') {
                const startPt = {
                    x: Math.floor(Math.random() * 7) + 2, // 2 to 8
                    y: Math.floor(Math.random() * 7) + 2  // 2 to 8
                };
                
                // Select moves that keep within 0..10 bounds
                let dx = 0, dy = 0;
                while (dx === 0 && dy === 0) {
                    dx = Math.floor(Math.random() * 5) - 2; // -2 to 2
                    dy = Math.floor(Math.random() * 5) - 2; // -2 to 2
                }

                const endX = startPt.x + dx;
                const endY = startPt.y + dy;

                const dirX = dx >= 0 ? 'right' : 'left';
                const dirY = dy >= 0 ? 'up' : 'down';

                let studentPt = null;

                return {
                    category: 'space',
                    type: 'movement',
                    questionText: `Trace the translation movement vector starting at Point A (${startPt.x}, ${startPt.y}):`,
                    targetAns: { x: endX, y: endY },
                    hintText: `
                        <p>Start at coordinate <strong>(${startPt.x}, ${startPt.y})</strong> on the grid.</p>
                        <ul>
                            <li>Move horizontally along the x-axis: <strong>${Math.abs(dx)} units ${dirX}</strong>.</li>
                            <li>Move vertically along the y-axis: <strong>${Math.abs(dy)} units ${dirY}</strong>.</li>
                        </ul>
                    `,
                    solutionText: `Landing point calculation: x = ${startPt.x} + (${dx}) = ${endX}; y = ${startPt.y} + (${dy}) = ${endY}. Coordinates are (${endX}, ${endY}).`,
                    renderFunc: (container) => {
                        const renderGrid = () => {
                            const gridHost = document.getElementById('space-grid-host');
                            if (gridHost) {
                                gridHost.innerHTML = makeGridSvg(null, startPt, null, false, studentPt);
                                attachGridListeners();
                            }
                        };

                        container.innerHTML = `
                            <div class="flex-col align-center gap-12">
                                <p style="text-align:center;">
                                    Start at <strong>A (${startPt.x}, ${startPt.y})</strong>. 
                                    Move <strong>${Math.abs(dx)} units ${dirX}</strong> and <strong>${Math.abs(dy)} units ${dirY}</strong>. 
                                    Where do you land?
                                </p>
                                <div class="coordinate-grid-container" id="space-grid-host">
                                    ${makeGridSvg(null, startPt, null, false, studentPt)}
                                </div>
                                <div class="flex-row gap-16 align-center">
                                    <span style="font-size:0.9rem; font-weight:600;">Landing point:</span>
                                    <div class="coord-input-pair">
                                        <span>(</span>
                                        <input type="number" id="prac-coord-x" class="input-text-terminal" placeholder="x" min="0" max="10" autocomplete="off">
                                        <span>,</span>
                                        <input type="number" id="prac-coord-y" class="input-text-terminal" placeholder="y" min="0" max="10" autocomplete="off">
                                        <span>)</span>
                                    </div>
                                </div>
                                <p style="font-size:0.75rem; color:var(--outline); margin-top:4px;">
                                    Click on your landing point intersection, or type values.
                                </p>
                            </div>
                        `;

                        const inpX = document.getElementById('prac-coord-x');
                        const inpY = document.getElementById('prac-coord-y');

                        const attachGridListeners = () => {
                            container.querySelectorAll('.coord-cell').forEach(cell => {
                                cell.addEventListener('click', (e) => {
                                    sounds.click();
                                    const x = parseInt(e.currentTarget.getAttribute('data-x'), 10);
                                    const y = parseInt(e.currentTarget.getAttribute('data-y'), 10);
                                    inpX.value = x;
                                    inpY.value = y;
                                    studentPt = { x, y };
                                    renderGrid();
                                });
                            });
                        };

                        const handleTextInp = () => {
                            const x = parseInt(inpX.value, 10);
                            const y = parseInt(inpY.value, 10);
                            if (!isNaN(x) && x >= 0 && x <= 10 && !isNaN(y) && y >= 0 && y <= 10) {
                                studentPt = { x, y };
                                renderGrid();
                            }
                        };

                        inpX.addEventListener('input', handleTextInp);
                        inpY.addEventListener('input', handleTextInp);
                        attachGridListeners();
                    },
                    validateFunc: () => {
                        const userX = parseInt(document.getElementById('prac-coord-x').value.trim(), 10);
                        const userY = parseInt(document.getElementById('prac-coord-y').value.trim(), 10);
                        return userX === endX && userY === endY;
                    }
                };
            } else {
                // Distance (Manhattan) on coordinate grid
                const startPt = {
                    x: Math.floor(Math.random() * 8) + 1,
                    y: Math.floor(Math.random() * 8) + 1
                };
                let endPt = {
                    x: Math.floor(Math.random() * 8) + 1,
                    y: Math.floor(Math.random() * 8) + 1
                };
                while (startPt.x === endPt.x || startPt.y === endPt.y) {
                    endPt = {
                        x: Math.floor(Math.random() * 8) + 1,
                        y: Math.floor(Math.random() * 8) + 1
                    };
                }

                const dist = Math.abs(startPt.x - endPt.x) + Math.abs(startPt.y - endPt.y);

                return {
                    category: 'space',
                    type: 'distance',
                    questionText: `Calculate the total Manhattan grid distance between Point A and Point B:`,
                    targetAns: dist,
                    hintText: `
                        <p>Manhattan distance is the distance travelled along gridlines (horizontal steps + vertical steps):</p>
                        <div class="coordinate-grid-container" style="max-width:220px; margin: 8px auto;">
                            ${makeGridSvg(null, startPt, endPt, true, null)}
                        </div>
                        <p style="text-align:center; font-weight:700;">
                            Steps = |${startPt.x} - ${endPt.x}| + |${startPt.y} - ${endPt.y}|
                        </p>
                    `,
                    solutionText: `Horizontal distance = |${startPt.x} - ${endPt.x}| = ${Math.abs(startPt.x - endPt.x)} units. Vertical distance = |${startPt.y} - ${endPt.y}| = ${Math.abs(startPt.y - endPt.y)} units. Total grid distance = ${dist} units.`,
                    renderFunc: (container) => {
                        container.innerHTML = `
                            <div class="flex-col align-center gap-12">
                                <p style="text-align:center;">
                                    Find the grid distance along the grid lines from <strong>A (${startPt.x}, ${startPt.y})</strong> to <strong>B (${endPt.x}, ${endPt.y})</strong>:
                                </p>
                                <div class="coordinate-grid-container">
                                    ${makeGridSvg(null, startPt, endPt, false, null)}
                                </div>
                                <div class="question-input-group">
                                    <input type="number" id="prac-grid-dist" class="input-text-terminal input-number-small" placeholder="?" style="width:100px; text-align:center;" autocomplete="off">
                                    <span style="font-size:0.9rem;">units</span>
                                </div>
                            </div>
                        `;
                    },
                    validateFunc: () => {
                        const val = parseInt(document.getElementById('prac-grid-dist').value.trim(), 10);
                        return val === dist;
                    }
                };
            }
        },

        statistics: () => {
            // Temperature values over 7 days (0..100)
            const daysData = [];
            let currentVal = Math.floor(Math.random() * 40) + 20; // start 20 to 60
            daysData.push(currentVal);
            for (let i = 1; i < 7; i++) {
                const diff = Math.floor(Math.random() * 31) - 15; // change -15 to +15
                currentVal = Math.min(95, Math.max(5, currentVal + diff));
                daysData.push(currentVal);
            }

            const subTypes = ['read-value', 'max-min', 'biggest-increase'];
            const chosenType = subTypes[Math.floor(Math.random() * subTypes.length)];
            const title = "Station Water Core Reserves (kL)";

            if (chosenType === 'read-value') {
                const D = Math.floor(Math.random() * 7) + 1; // day 1 to 7
                const targetVal = daysData[D - 1];

                return {
                    category: 'statistics',
                    type: 'read-value',
                    questionText: `Extract data values from line graphs:`,
                    targetAns: targetVal,
                    hintText: `
                        <p>Locate <strong>Day ${D}</strong> on the horizontal bottom axis.</p>
                        <div class="line-graph-container" style="max-width:260px; margin: 8px auto;">
                            ${makeLineGraphSvg(daysData, D - 1, title)}
                        </div>
                        <p>Trace vertically up to the point above Day ${D}. The value labeled above that dot is the core reserves level.</p>
                    `,
                    solutionText: `According to the line graph coordinates, the value plotted for Day ${D} is exactly ${targetVal} kL.`,
                    renderFunc: (container) => {
                        container.innerHTML = `
                            <div class="flex-col align-center gap-12">
                                <p style="text-align:center;">What was the water core reserves level recorded on <strong>Day ${D}</strong>?</p>
                                <div class="line-graph-container">
                                    ${makeLineGraphSvg(daysData, null, title)}
                                </div>
                                <div class="question-input-group">
                                    <input type="number" id="prac-graph-val" class="input-text-terminal input-number-small" placeholder="?" style="width:110px; text-align:center;" autocomplete="off">
                                    <span style="font-size:0.9rem;">kL</span>
                                </div>
                            </div>
                        `;
                    },
                    validateFunc: () => {
                        const val = parseInt(document.getElementById('prac-graph-val').value.trim(), 10);
                        return val === targetVal;
                    }
                };
            } else if (chosenType === 'max-min') {
                const findMax = Math.random() > 0.5;
                let targetVal = daysData[0];
                let targetDay = 1;

                for (let i = 1; i < 7; i++) {
                    if (findMax && daysData[i] > targetVal) {
                        targetVal = daysData[i];
                        targetDay = i + 1;
                    } else if (!findMax && daysData[i] < targetVal) {
                        targetVal = daysData[i];
                        targetDay = i + 1;
                    }
                }

                // Check if multiple days share the max/min
                const targetDays = [];
                daysData.forEach((val, idx) => {
                    if (val === targetVal) targetDays.push(idx + 1);
                });

                return {
                    category: 'statistics',
                    type: 'max-min',
                    questionText: `Analyze and track trends on line graphs:`,
                    targetAns: targetDays,
                    hintText: `
                        <p>Find the peak (highest point) or trough (lowest point) of the line graph:</p>
                        <ul>
                            <li>The <strong>highest</strong> point is the peak of the line.</li>
                            <li>The <strong>lowest</strong> point is the bottom trough of the line.</li>
                        </ul>
                    `,
                    solutionText: `The ${findMax ? 'highest' : 'lowest'} value was ${targetVal} kL, which occurred on Day ${targetDays.join(' and Day ')}.`,
                    renderFunc: (container) => {
                        container.innerHTML = `
                            <div class="flex-col align-center gap-12">
                                <p style="text-align:center;">On which day did the reserves reach their <strong>${findMax ? 'highest' : 'lowest'}</strong> level?</p>
                                <div class="line-graph-container">
                                    ${makeLineGraphSvg(daysData, null, title)}
                                </div>
                                <div class="question-input-group">
                                    <span style="font-size:0.9rem; font-weight:600;">Day:</span>
                                    <select id="prac-graph-day" class="input-text-terminal" style="width:100px;">
                                        <option value="">-</option>
                                        <option value="1">Day 1</option>
                                        <option value="2">Day 2</option>
                                        <option value="3">Day 3</option>
                                        <option value="4">Day 4</option>
                                        <option value="5">Day 5</option>
                                        <option value="6">Day 6</option>
                                        <option value="7">Day 7</option>
                                    </select>
                                </div>
                            </div>
                        `;
                    },
                    validateFunc: () => {
                        const userDay = parseInt(document.getElementById('prac-graph-day').value.trim(), 10);
                        if (isNaN(userDay)) return false;
                        return targetDays.includes(userDay);
                    }
                };
            } else {
                // Biggest Increase
                // We must ensure there is at least one increase in the data
                let hasIncrease = false;
                for (let i = 1; i < 7; i++) {
                    if (daysData[i] > daysData[i-1]) {
                        hasIncrease = true;
                        break;
                    }
                }

                // If not, modify data to have at least one clear increase
                if (!hasIncrease) {
                    daysData[3] = daysData[2] + 25; // force increase from Day 3 to 4
                }

                let maxDiff = -999;
                let increaseStartDay = 1; // 1-indexed

                for (let i = 1; i < 7; i++) {
                    const diff = daysData[i] - daysData[i-1];
                    if (diff > maxDiff) {
                        maxDiff = diff;
                        increaseStartDay = i; // Day i (which is index i-1) to Day i+1
                    }
                }

                return {
                    category: 'statistics',
                    type: 'biggest-increase',
                    questionText: `Identify periods of fastest growth on line graphs:`,
                    targetAns: { start: increaseStartDay, end: increaseStartDay + 1 },
                    hintText: `
                        <p>Look for the line segment that climbs upwards at the steepest angle from left to right.</p>
                        <p>Calculate the difference between each day and the previous day: (Day 2 - Day 1), (Day 3 - Day 2), etc.</p>
                        <p style="margin-top:6px; font-weight:700; color:var(--primary); text-align:center;">
                            Steepest increase rate = +${maxDiff} kL
                        </p>
                    `,
                    solutionText: `The water reserves increased the most between Day ${increaseStartDay} (${daysData[increaseStartDay - 1]} kL) and Day ${increaseStartDay + 1} (${daysData[increaseStartDay]} kL), representing an increase of ${maxDiff} kL.`,
                    renderFunc: (container) => {
                        container.innerHTML = `
                            <div class="flex-col align-center gap-12">
                                <p style="text-align:center;">Between which two consecutive days did the water reserves <strong>increase the most</strong>?</p>
                                <div class="line-graph-container">
                                    ${makeLineGraphSvg(daysData, null, title)}
                                </div>
                                <div class="flex-row gap-8 align-center justify-center flex-wrap">
                                    <span>From</span>
                                    <select id="prac-graph-inc-1" class="input-text-terminal" style="width:90px;">
                                        <option value="">-</option>
                                        <option value="1">Day 1</option>
                                        <option value="2">Day 2</option>
                                        <option value="3">Day 3</option>
                                        <option value="4">Day 4</option>
                                        <option value="5">Day 5</option>
                                        <option value="6">Day 6</option>
                                        <option value="7">Day 7</option>
                                    </select>
                                    <span>to</span>
                                    <select id="prac-graph-inc-2" class="input-text-terminal" style="width:90px;">
                                        <option value="">-</option>
                                        <option value="1">Day 1</option>
                                        <option value="2">Day 2</option>
                                        <option value="3">Day 3</option>
                                        <option value="4">Day 4</option>
                                        <option value="5">Day 5</option>
                                        <option value="6">Day 6</option>
                                        <option value="7">Day 7</option>
                                    </select>
                                </div>
                            </div>
                        `;
                    },
                    validateFunc: () => {
                        const d1 = parseInt(document.getElementById('prac-graph-inc-1').value.trim(), 10);
                        const d2 = parseInt(document.getElementById('prac-graph-inc-2').value.trim(), 10);
                        return d1 === increaseStartDay && d2 === (increaseStartDay + 1);
                    }
                };
            }
        },

        probability: () => {
            const subTypes = ['die-outcomes', 'marble-likelihood', 'chance-fraction'];
            const chosenType = subTypes[Math.floor(Math.random() * subTypes.length)];

            if (chosenType === 'die-outcomes') {
                const isSpinner = Math.random() > 0.5;
                let targetOutcomes = [];
                let allOptions = [];
                let questionTitle = '';

                if (isSpinner) {
                    questionTitle = "A spinner with 4 equal sections labeled A, B, C and D is spun once. Select all possible outcomes:";
                    targetOutcomes = ['A', 'B', 'C', 'D'];
                    allOptions = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
                } else {
                    questionTitle = "A standard fair 6-sided die is rolled once. Select all possible outcomes:";
                    targetOutcomes = [1, 2, 3, 4, 5, 6];
                    allOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
                }

                return {
                    category: 'probability',
                    type: 'die-outcomes',
                    questionText: `Identify all equally-likely sample space outcomes:`,
                    targetAns: targetOutcomes,
                    hintText: `
                        <p>The **sample space** lists all possible different results that can happen from a single chance experiment trial.</p>
                        <ul>
                            <li>For a 6-sided die: it has faces numbered 1 to 6.</li>
                            <li>For a spinner labeled A, B, C, D: it only has those 4 letters.</li>
                        </ul>
                    `,
                    solutionText: `The list of all possible outcomes is: ${targetOutcomes.join(', ')}.`,
                    renderFunc: (container) => {
                        let chipsHtml = '';
                        allOptions.forEach((opt, idx) => {
                            chipsHtml += `<div class="outcome-chip" id="out-chip-${idx}" data-val="${opt}">${opt}</div>`;
                        });

                        container.innerHTML = `
                            <div class="flex-col align-center gap-12">
                                <p style="text-align:center;">${questionTitle}</p>
                                <div class="outcome-grid" id="outcomes-grid">
                                    ${chipsHtml}
                                </div>
                                <p style="font-size:0.75rem; color:var(--outline); margin-top:4px;">
                                    Click on the chips to highlight and select them. Click again to deselect.
                                </p>
                            </div>
                        `;

                        container.querySelectorAll('.outcome-chip').forEach(chip => {
                            chip.addEventListener('click', (e) => {
                                sounds.click();
                                e.target.classList.toggle('selected');
                            });
                        });
                    },
                    validateFunc: () => {
                        const selected = Array.from(pracInteractivePanel.querySelectorAll('.outcome-chip.selected'))
                            .map(chip => chip.getAttribute('data-val'));
                        if (selected.length !== targetOutcomes.length) return false;
                        return targetOutcomes.every(val => selected.includes(val.toString()));
                    }
                };
            } else if (chosenType === 'marble-likelihood') {
                // Bag of marbles: 10 total, R red, B blue
                const R = Math.floor(Math.random() * 7) + 2; // red: 2 to 8
                const B = 10 - R;

                let answerKey = '';
                if (R > B) answerKey = 'red';
                else if (B > R) answerKey = 'blue';
                else answerKey = 'equal';

                return {
                    category: 'probability',
                    type: 'marble-likelihood',
                    questionText: `Compare outcome likelihoods for chance events:`,
                    targetAns: answerKey,
                    hintText: `
                        <p>Compare the counts of each marble color in the bag:</p>
                        <ul>
                            <li>Red count: <strong>${R}</strong></li>
                            <li>Blue count: <strong>${B}</strong></li>
                        </ul>
                        <p style="margin-top:6px;">Whichever color has more marbles is <strong>more likely</strong> to be drawn. If they are equal, it is <strong>equally likely</strong>.</p>
                    `,
                    solutionText: `Since there are ${R} Red marbles and ${B} Blue marbles, drawing a ${R === B ? 'Red or Blue marble is equally' : R > B ? 'Red marble is more' : 'Blue marble is more'} likely.`,
                    renderFunc: (container) => {
                        // Generate marbles layout
                        let marblesHtml = '';
                        for (let i = 0; i < R; i++) marblesHtml += '<div class="marble red"></div>';
                        for (let i = 0; i < B; i++) marblesHtml += '<div class="marble blue"></div>';
                        
                        container.innerHTML = `
                            <div class="flex-col align-center gap-12">
                                <p style="text-align:center;">A marble is drawn at random from the bag below. Which event is most likely?</p>
                                <div class="marble-bag">
                                    ${marblesHtml}
                                </div>
                                <div class="probability-options" style="width:100%; max-width:340px;">
                                    <label>
                                        <input type="radio" name="prac-prob-choice" value="red">
                                        <span>More likely to draw a Red marble</span>
                                    </label>
                                    <label>
                                        <input type="radio" name="prac-prob-choice" value="blue">
                                        <span>More likely to draw a Blue marble</span>
                                    </label>
                                    <label>
                                        <input type="radio" name="prac-prob-choice" value="equal">
                                        <span>Equally likely to draw Red or Blue</span>
                                    </label>
                                </div>
                            </div>
                        `;

                        container.querySelectorAll('.probability-options label').forEach(lbl => {
                            lbl.addEventListener('click', () => {
                                sounds.click();
                            });
                        });
                    },
                    validateFunc: () => {
                        const checked = pracInteractivePanel.querySelector('input[name="prac-prob-choice"]:checked');
                        if (!checked) return false;
                        return checked.value === answerKey;
                    }
                };
            } else {
                // Chance fractions: marbles with 3 colours (total 10)
                const R = Math.floor(Math.random() * 3) + 1; // 1 to 3 red
                const B = Math.floor(Math.random() * 3) + 2; // 2 to 4 blue
                const G = 10 - R - B;                         // remaining green (3 to 7)

                const targetRatio = B / 10;

                return {
                    category: 'probability',
                    type: 'chance-fraction',
                    questionText: `Represent probability using fractional values:`,
                    targetAns: targetRatio,
                    hintText: `
                        <p>Probability as a fraction is calculated as:</p>
                        <p style="font-size:1rem; font-weight:700; text-align:center; margin: 6px 0;">
                            P(Blue) = Blue Marbles / Total Marbles
                        </p>
                        <p>Count the Blue marbles (successful outcomes) and write it over the total number of marbles (10).</p>
                    `,
                    solutionText: `There are ${B} Blue marbles out of 10 total marbles. The probability is ${B}/10 (which simplifies to ${B === 2 ? '1/5' : B === 4 ? '2/5' : `${B}/10`}).`,
                    renderFunc: (container) => {
                        let marblesHtml = '';
                        for (let i = 0; i < R; i++) marblesHtml += '<div class="marble red"></div>';
                        for (let i = 0; i < B; i++) marblesHtml += '<div class="marble blue"></div>';
                        for (let i = 0; i < G; i++) marblesHtml += '<div class="marble green"></div>';

                        container.innerHTML = `
                            <div class="flex-col align-center gap-12">
                                <p style="text-align:center;">What is the probability of drawing a <strong>Blue</strong> marble from the bag below? Express it as a fraction (e.g. 3/10):</p>
                                <div class="marble-bag">
                                    ${marblesHtml}
                                </div>
                                <div class="question-input-group">
                                    <input type="text" id="prac-prob-frac" class="input-text-terminal input-number-small text-center" placeholder="e.g. 3/10" style="width:120px;" autocomplete="off">
                                </div>
                            </div>
                        `;
                    },
                    validateFunc: () => {
                        const val = document.getElementById('prac-prob-frac').value.trim();
                        const userVal = parseFraction(val);
                        return userVal !== null && Math.abs(userVal - targetRatio) < 0.001;
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

        const gen = generators[state.activeCategory];
        if (!gen) {
            console.error(`No generator found for category: ${state.activeCategory}`);
            return;
        }
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
            
            let gainedPoints = 10;
            if (state.attemptsLeft === 1) {
                gainedPoints = 5;
            }
            pracFeedbackText.textContent = `CORRECT CALIBRATION! +${gainedPoints} POINTS`;
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
