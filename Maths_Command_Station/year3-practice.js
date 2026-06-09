/**
 * Joshua Math Practice Console - State & Logic Engine (Year 3)
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
        scoresByCatY5: {
            number: 0,
            algebra: 0,
            measurement: 0,
            space: 0,
            statistics: 0,
            probability: 0
        },
        scoresByCatY4: {
            number: 0,
            algebra: 0,
            measurement: 0,
            space: 0,
            statistics: 0,
            probability: 0
        },
        scoresByCatY3: {
            number: 0,
            algebra: 0,
            measurement: 0,
            space: 0,
            statistics: 0,
            probability: 0
        }
    };
    profile.scoresByCat = profile.scoresByCatY3; // Link active grade category scores

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
        const stored = localStorage.getItem('joshua_math_profile');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                
                // Migrate legacy scoresByCat to scoresByCatY3
                if (parsed.scoresByCat && !parsed.scoresByCatY3 && !parsed.scoresByCatY5) {
                    parsed.scoresByCatY3 = parsed.scoresByCat;
                }
                
                Object.assign(profile, parsed);
            } catch (e) {
                console.error("Failed to parse stored profile", e);
            }
        }

        // Ensure all keys are present
        if (!profile.scoresByCatY5) {
            profile.scoresByCatY5 = { number: 0, algebra: 0, measurement: 0, space: 0, statistics: 0, probability: 0 };
        }
        if (!profile.scoresByCatY4) {
            profile.scoresByCatY4 = { number: 0, algebra: 0, measurement: 0, space: 0, statistics: 0, probability: 0 };
        }
        if (!profile.scoresByCatY3) {
            profile.scoresByCatY3 = { number: 0, algebra: 0, measurement: 0, space: 0, statistics: 0, probability: 0 };
        }
        
        // Link scoresByCat to active Year 3 scores
        profile.scoresByCat = profile.scoresByCatY3;

        const cats = ['number', 'algebra', 'measurement', 'space', 'statistics', 'probability'];
        cats.forEach(c => {
            if (profile.scoresByCatY5[c] === undefined) profile.scoresByCatY5[c] = 0;
            if (profile.scoresByCatY4[c] === undefined) profile.scoresByCatY4[c] = 0;
            if (profile.scoresByCatY3[c] === undefined) profile.scoresByCatY3[c] = 0;
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
        
        attachBadgeClickHandlers();
    }

    function saveProfile() {
        localStorage.setItem('joshua_math_profile', JSON.stringify(profile));
    }

    // ----------------------------------------------------
    // Achievement Certificate Modal
    // ----------------------------------------------------
    const BADGE_META = {
        'first-step':       { label: 'First Step',          emoji: '🌱', desc: 'Completed your very first practice task. Every great journey starts with a single step!' },
        'streak-5':         { label: 'High Five',           emoji: '🖐️', desc: 'Answered 5 questions correctly in a row without a single mistake. Impressive focus!' },
        'streak-10':        { label: 'Perfect Ten',         emoji: '🏆', desc: 'Achieved a 10-question correct streak. An outstanding display of mathematical accuracy!' },
        'streak-20':        { label: 'Unstoppable',         emoji: '🔥', desc: 'Powered through 20 consecutive correct answers. You are truly unstoppable!' },
        'number-100':       { label: 'Number Cruncher',     emoji: '🔢', desc: 'Earned 100 points in the Number strand. Your skills with place value, fractions and operations are rock solid.' },
        'algebra-100':      { label: 'Equation Solver',     emoji: '⚡', desc: 'Earned 100 points in Algebra. Patterns, rules and unknowns hold no secrets from you!' },
        'measurement-100':  { label: 'Precision Engineer',  emoji: '📐', desc: 'Earned 100 points in Measurement. You measure, convert and calculate with expert precision.' },
        'space-100':        { label: 'Coordinate Ace',      emoji: '🗺️', desc: 'Earned 100 points in Space. Coordinates, reflections and transformations are your playground.' },
        'stats-100':        { label: 'Data Analyst',        emoji: '📊', desc: 'Earned 100 points in Statistics. You read, interpret and compare data sets with confidence.' },
        'probability-100':  { label: 'Chance Master',       emoji: '🎲', desc: 'Earned 100 points in Probability. You understand chance, likelihood and experimental results.' },
        'all-rounder':      { label: 'All Rounder',         emoji: '🌟', desc: 'Earned at least 50 points in every single strand. A true all-round mathematician — well done!' },
    };

    function showCertificateModal(badgeId) {
        const meta = BADGE_META[badgeId];
        if (!meta) return;

        const today = new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });

        const existing = document.getElementById('cert-print-root');
        if (existing) existing.remove();

        const root = document.createElement('div');
        root.id = 'cert-print-root';
        root.innerHTML = `
            <div class="cert-modal-overlay" id="cert-overlay">
                <div class="cert-card" role="dialog" aria-modal="true" aria-label="${meta.label} Certificate">
                    <div class="cert-header-band">
                        <div class="cert-star-row">⭐ ⭐ ⭐</div>
                        <div class="cert-title">Joshua Maths Command Station</div>
                        <div class="cert-achievement-label">${meta.label}</div>
                    </div>
                    <div class="cert-body">
                        <div class="cert-badge-display">${meta.emoji}</div>
                        <div class="cert-awarded-to">Certificate of Achievement — Awarded to</div>
                        <div class="cert-student-name">
                            <input type="text" class="cert-name-input" id="cert-name-input" placeholder="ENTER YOUR NAME" maxlength="30" autocomplete="off" />
                            <span class="cert-name-print-only" id="cert-name-print-only"></span>
                        </div>
                        <p class="cert-description">${meta.desc}</p>
                        <div class="cert-date-row">DATE AWARDED: ${today.toUpperCase()}</div>
                    </div>
                    <div class="cert-footer">
                        <button class="cert-btn cert-btn-close" id="cert-btn-close">✕ Close</button>
                        <button class="cert-btn cert-btn-print" id="cert-btn-print">🖨️ Print as PDF</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(root);

        const nameInput = document.getElementById('cert-name-input');
        const namePrintOnly = document.getElementById('cert-name-print-only');

        const initialName = (profile.name && profile.name !== 'ENGINEER') ? profile.name : '';
        nameInput.value = initialName;
        namePrintOnly.textContent = initialName || 'STUDENT';

        nameInput.addEventListener('input', () => {
            namePrintOnly.textContent = nameInput.value.toUpperCase() || 'STUDENT';
        });

        const closeModal = () => {
            const overlay = document.getElementById('cert-overlay');
            if (overlay) {
                overlay.classList.add('closing');
                overlay.addEventListener('animationend', () => root.remove(), { once: true });
            }
        };

        document.getElementById('cert-btn-close').addEventListener('click', closeModal);
        document.getElementById('cert-overlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) closeModal();
        });
        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') { closeModal(); document.removeEventListener('keydown', escHandler); }
        });

        document.getElementById('cert-btn-print').addEventListener('click', () => {
            window.print();
        });

        sounds.click();
    }

    function attachBadgeClickHandlers() {
        document.querySelectorAll('.badge-item.unlocked').forEach(el => {
            if (el.dataset.certBound) return;
            el.dataset.certBound = 'true';
            const badgeId = el.id.replace('badge-', '');
            el.addEventListener('click', () => showCertificateModal(badgeId));
        });
    }

    function gainPoints(pts, isCorrect, category) {
        profile.score += pts;
        profile.scoresByCat[category] = (profile.scoresByCat[category] || 0) + pts;

        if (isCorrect) {
            profile.streak += 1;
            profile.highestStreak = Math.max(profile.highestStreak, profile.streak);
        } else {
            profile.streak = 0;
        }

        const oldBadgesCount = profile.badges.length;
        const addBadge = (id) => {
            if (!profile.badges.includes(id)) {
                profile.badges.push(id);
            }
        };

        const getSum = (cat) => (profile.scoresByCatY5[cat] || 0) + (profile.scoresByCatY4[cat] || 0) + (profile.scoresByCatY3[cat] || 0);

        if (profile.score > 0) addBadge('first-step');
        if (profile.streak >= 5) addBadge('streak-5');
        if (profile.streak >= 10) addBadge('streak-10');
        if (profile.streak >= 20) addBadge('streak-20');

        if (getSum('number') >= 100) addBadge('number-100');
        if (getSum('algebra') >= 100) addBadge('algebra-100');
        if (getSum('measurement') >= 100) addBadge('measurement-100');
        if (getSum('space') >= 100) addBadge('space-100');
        if (getSum('statistics') >= 100) addBadge('stats-100');
        if (getSum('probability') >= 100) addBadge('probability-100');

        const cats = ['number', 'algebra', 'measurement', 'space', 'statistics', 'probability'];
        const isAllRounder = cats.every(cat => getSum(cat) >= 50);
        if (isAllRounder) addBadge('all-rounder');

        saveProfile();
        loadProfile();

        if (profile.badges.length > oldBadgesCount) {
            sounds.badgeUnlock();
            addLog(`ACHIEVEMENT UNLOCKED: New badge is active on your profile shelf!`, "success");
        }
    }

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
        activeCategory: 'number',
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
    // Helpers & SVG Generation Functions
    // ----------------------------------------------------
    function shuffleArray(arr) {
        const copy = [...arr];
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    }

    // SVG Number Line for Year 3 Fractions
    function makeFractionLineSvg(denominator, numerator) {
        let svg = `<svg viewBox="0 0 320 100" style="width:100%; max-width:320px; height:auto; display:block; margin:8px auto;">`;
        // Draw axis line
        svg += `<line x1="20" y1="50" x2="300" y2="50" stroke="var(--on-surface)" stroke-width="2" />`;
        
        const scale = 280;
        
        // Draw tick marks
        for (let i = 0; i <= denominator; i++) {
            const x = 20 + (i / denominator) * scale;
            svg += `<line x1="${x}" y1="42" x2="${x}" y2="58" stroke="var(--on-surface)" stroke-width="2" />`;
            // Label
            let label = i === 0 ? "0" : (i === denominator ? "1" : `${i}/${denominator}`);
            svg += `<text x="${x}" y="76" font-family="var(--font-mono)" font-size="10" text-anchor="middle" fill="var(--on-surface)">${label}</text>`;
        }
        
        // Plot target fraction dot
        const tx = 20 + (numerator / denominator) * scale;
        svg += `<circle cx="${tx}" cy="50" r="6.5" fill="var(--primary)" stroke="var(--surface)" stroke-width="1.5" />`;
        svg += `<circle cx="${tx}" cy="50" r="10" fill="transparent" stroke="var(--primary)" stroke-width="1" class="pulse-ring" />`;
        svg += `<text x="${tx}" y="30" font-family="var(--font-mono)" font-weight="700" font-size="11" text-anchor="middle" fill="var(--primary)">?</text>`;
        
        svg += `</svg>`;
        return svg;
    }

    // SVG Analog Clock for Year 3 Clock reading
    function makeClockSvg(hours, minutes) {
        let svg = `<svg viewBox="0 0 200 200" style="width:100%; max-width:200px; height:auto; display:block; margin:8px auto;">`;
        
        const cx = 100;
        const cy = 100;
        const r = 80;
        
        // Clock face circle
        svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="var(--surface-container-low)" stroke="var(--outline)" stroke-width="2" />`;
        svg += `<circle cx="${cx}" cy="${cy}" r="3" fill="var(--on-surface)" />`;
        
        // Draw ticks and numbers
        for (let i = 1; i <= 12; i++) {
            const angle = (i * 30) * Math.PI / 180;
            const x1 = cx + (r - 6) * Math.sin(angle);
            const y1 = cy - (r - 6) * Math.cos(angle);
            const x2 = cx + r * Math.sin(angle);
            const y2 = cy - r * Math.cos(angle);
            svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--on-surface)" stroke-width="1.5" />`;
            
            // Numbers
            const tx = cx + (r - 16) * Math.sin(angle);
            const ty = cy - (r - 16) * Math.cos(angle) + 4;
            svg += `<text x="${tx}" y="${ty}" font-family="var(--font-display)" font-size="10" font-weight="600" text-anchor="middle" fill="var(--on-surface)">${i}</text>`;
        }
        
        // Hands angles
        const minAngle = (minutes * 6) * Math.PI / 180;
        const hourAngle = ((hours % 12) * 30 + minutes * 0.5) * Math.PI / 180;
        
        // Hour Hand
        const hx = cx + 45 * Math.sin(hourAngle);
        const hy = cy - 45 * Math.cos(hourAngle);
        svg += `<line x1="${cx}" y1="${cy}" x2="${hx}" y2="${hy}" stroke="var(--on-surface)" stroke-width="3.5" stroke-linecap="round" />`;
        
        // Minute Hand
        const mx = cx + 65 * Math.sin(minAngle);
        const my = cy - 65 * Math.cos(minAngle);
        svg += `<line x1="${cx}" y1="${cy}" x2="${mx}" y2="${my}" stroke="var(--primary)" stroke-width="2" stroke-linecap="round" />`;
        
        svg += `</svg>`;
        return svg;
    }

    // SVG 5x5 Coordinate Landmark Grid Map for Year 3 Space
    function makeLandmarkGridSvg(landmarks, studentX = null, studentY = null) {
        let svg = `<svg viewBox="0 0 220 220" style="width:100%; max-width:220px; height:auto; display:block; margin:8px auto;">`;
        
        // Draw grid lines
        for (let i = 0; i <= 4; i++) {
            const coord = 20 + i * 40;
            // Vertical
            svg += `<line x1="${coord}" y1="20" x2="${coord}" y2="180" stroke="var(--outline-variant)" stroke-width="0.75" />`;
            // Horizontal
            svg += `<line x1="20" y1="${coord}" x2="180" y2="${coord}" stroke="var(--outline-variant)" stroke-width="0.75" />`;
            // Labels
            svg += `<text x="${coord}" y="195" font-family="var(--font-mono)" font-size="9" text-anchor="middle" fill="var(--on-surface)">${i}</text>`;
            svg += `<text x="10" y="${200 - coord}" font-family="var(--font-mono)" font-size="9" text-anchor="middle" fill="var(--on-surface)">${i}</text>`;
        }
        
        // Draw landmarks
        landmarks.forEach(lm => {
            const lx = 20 + lm.x * 40;
            const ly = 180 - lm.y * 40;
            svg += `<circle cx="${lx}" cy="${ly}" r="6" fill="var(--primary)" stroke="var(--surface)" stroke-width="1" />`;
            svg += `<text x="${lx + 8}" y="${ly + 3}" font-family="var(--font-display)" font-size="8" font-weight="700" fill="var(--on-surface)">${lm.label}</text>`;
        });
        
        // Plot student cursor selection point
        if (studentX !== null && studentY !== null) {
            const sx = 20 + studentX * 40;
            const sy = 180 - studentY * 40;
            svg += `<circle cx="${sx}" cy="${sy}" r="4" fill="var(--tertiary)" stroke="var(--surface)" stroke-width="1" />`;
        }
        
        svg += `</svg>`;
        return svg;
    }

    // SVG Bar Chart for Year 3 Statistics
    function makeBarChartSvg(categories, values, targetCategory = "") {
        let svg = `<svg viewBox="0 0 240 160" style="width:100%; max-width:240px; height:auto; display:block; margin:8px auto;">`;
        const maxVal = Math.max(...values, 5);
        const yMax = Math.ceil(maxVal / 2) * 2;
        
        // Gridlines
        for (let v = 0; v <= yMax; v += 2) {
            const y = 130 - (v / yMax) * 100;
            svg += `<line x1="30" y1="${y}" x2="220" y2="${y}" stroke="var(--outline-variant)" stroke-width="0.5" stroke-dasharray="2 2" />`;
            svg += `<text x="24" y="${y + 3}" font-family="var(--font-mono)" font-size="8" text-anchor="end" fill="var(--outline)">${v}</text>`;
        }
        
        // Axes
        svg += `<line x1="30" y1="130" x2="220" y2="130" stroke="var(--on-surface)" stroke-width="1.5" />`;
        svg += `<line x1="30" y1="30" x2="30" y2="130" stroke="var(--on-surface)" stroke-width="1.5" />`;
        
        const spacing = 190 / categories.length;
        const width = spacing * 0.5;
        
        values.forEach((val, idx) => {
            const h = (val / yMax) * 100;
            const x = 30 + idx * spacing + (spacing - width) / 2;
            const y = 130 - h;
            const isTarget = categories[idx] === targetCategory;
            const color = isTarget ? "var(--primary-container)" : "var(--primary)";
            const stroke = isTarget ? "var(--primary)" : "none";
            const strokeW = isTarget ? "1.5" : "0";
            
            svg += `<rect x="${x}" y="${y}" width="${width}" height="${h}" rx="1" fill="${color}" stroke="${stroke}" stroke-width="${strokeW}" />`;
            svg += `<text x="${x + width/2}" y="${y - 4}" font-family="var(--font-mono)" font-weight="700" font-size="8" text-anchor="middle" fill="var(--on-surface)">${val}</text>`;
            svg += `<text x="${x + width/2}" y="142" font-family="var(--font-display)" font-size="8" text-anchor="middle" fill="var(--on-surface-variant)">${categories[idx]}</text>`;
        });
        
        svg += `</svg>`;
        return svg;
    }

    // ----------------------------------------------------
    // 5. Dynamic Category Generators (Year 3 Strands)
    // ----------------------------------------------------
    const generators = {
        number: () => {
            const subTypes = ['numeral-ordering', 'unit-fractions', 'addition-subtraction-regroup'];
            const chosenType = subTypes[Math.floor(Math.random() * subTypes.length)];

            if (chosenType === 'numeral-ordering') {
                // Generate 4 unique five-digit numbers within same ten-thousands boundary
                const base = (Math.floor(Math.random() * 8) + 1) * 10000; // 10000 to 80000
                const numList = [];
                while (numList.length < 4) {
                    const val = base + Math.floor(Math.random() * 900) * 10; // offset by 10s
                    if (!numList.includes(val)) numList.push(val);
                }
                const sorted = [...numList].sort((a, b) => a - b);
                const shuffled = shuffleArray(numList);

                return {
                    category: 'number',
                    type: 'numeral-ordering',
                    questionText: 'Order the numbers from smallest to largest:',
                    targetAns: sorted,
                    hintText: `
                        <p>Align the numbers column by column starting from the Ten-Thousands place:</p>
                        <ul style="margin-top:4px; padding-left:16px;">
                            <li>Compare the Ten-Thousands first. (They are all the same: ${Math.floor(base/10000)}0,000)</li>
                            <li>Compare the Thousands place.</li>
                            <li>Compare the Hundreds place.</li>
                        </ul>
                    `,
                    solutionText: `The correct ordering from smallest to largest is: ${sorted[0]} &lt; ${sorted[1]} &lt; ${sorted[2]} &lt; ${sorted[3]}.`,
                    renderFunc: (container) => {
                        container.innerHTML = `
                            <div class="flex-col align-center gap-12">
                                <p>Arrange these numerals from smallest (1st) to largest (4th):</p>
                                <div class="flex-row gap-12 justify-center" style="font-size:1.4rem; font-weight:700; color:var(--primary); margin-bottom:8px; flex-wrap:wrap;">
                                    ${shuffled.map(n => `<span class="hint-expander-place" style="padding: 4px 10px;">${n.toLocaleString('en-AU')}</span>`).join('')}
                                </div>
                                <div class="flex-row gap-8 align-center flex-wrap justify-center">
                                    <span>1st:</span>
                                    <select id="num-ord-1" class="input-text-terminal" style="width:105px;"></select>
                                    <span>&lt; 2nd:</span>
                                    <select id="num-ord-2" class="input-text-terminal" style="width:105px;"></select>
                                    <span>&lt; 3rd:</span>
                                    <select id="num-ord-3" class="input-text-terminal" style="width:105px;"></select>
                                    <span>&lt; 4th:</span>
                                    <select id="num-ord-4" class="input-text-terminal" style="width:105px;"></select>
                                </div>
                            </div>
                        `;
                        const selects = ['num-ord-1', 'num-ord-2', 'num-ord-3', 'num-ord-4'];
                        selects.forEach(id => {
                            const sel = document.getElementById(id);
                            sel.innerHTML = '<option value="">-</option>';
                            shuffled.forEach(n => {
                                sel.innerHTML += `<option value="${n}">${n.toLocaleString('en-AU')}</option>`;
                            });
                        });
                    },
                    validateFunc: () => {
                        const v1 = parseInt(document.getElementById('num-ord-1').value, 10);
                        const v2 = parseInt(document.getElementById('num-ord-2').value, 10);
                        const v3 = parseInt(document.getElementById('num-ord-3').value, 10);
                        const v4 = parseInt(document.getElementById('num-ord-4').value, 10);
                        if (isNaN(v1) || isNaN(v2) || isNaN(v3) || isNaN(v4)) return false;
                        return v1 === sorted[0] && v2 === sorted[1] && v3 === sorted[2] && v4 === sorted[3];
                    }
                };
            } else if (chosenType === 'unit-fractions') {
                const denominators = [2, 3, 4, 5, 10];
                const den = denominators[Math.floor(Math.random() * denominators.length)];
                const num = Math.floor(Math.random() * (den - 1)) + 1; // unit fractions and their multiples

                return {
                    category: 'number',
                    type: 'unit-fractions',
                    questionText: 'Determine the fraction marked by the dot on the number line below:',
                    targetAns: { num, den },
                    hintText: `
                        <p>1. Count how many equal intervals split the line from 0 to 1. That is the bottom number (denominator): <strong>${den}</strong>.</p>
                        <p>2. Count the jumps from 0 to the target dot. That is the top number (numerator): <strong>${num}</strong>.</p>
                    `,
                    solutionText: `The number line is divided into ${den} equal parts. The dot is at the ${num}th tick, representing the fraction <strong>${num}/${den}</strong>.`,
                    renderFunc: (container) => {
                        container.innerHTML = `
                            <div class="flex-col align-center gap-8">
                                ${makeFractionLineSvg(den, num)}
                                <div class="flex-row gap-8 align-center justify-center" style="margin-top:12px;">
                                    <span>Fraction input:</span>
                                    <input type="number" id="frac-num-inp" class="input-text-terminal" style="width:55px; text-align:center;" placeholder="num" min="1" max="99">
                                    <span style="font-size: 1.5rem; font-weight: bold;">/</span>
                                    <input type="number" id="frac-den-inp" class="input-text-terminal" style="width:55px; text-align:center;" placeholder="den" min="2" max="99">
                                </div>
                            </div>
                        `;
                    },
                    validateFunc: () => {
                        const userNum = parseInt(document.getElementById('frac-num-inp').value, 10);
                        const userDen = parseInt(document.getElementById('frac-den-inp').value, 10);
                        if (isNaN(userNum) || isNaN(userDen)) return false;
                        return userNum === num && userDen === den;
                    }
                };
            } else if (chosenType === 'addition-subtraction-regroup') {
                const isAdd = Math.random() > 0.5;
                let num1, num2, ans, sign;
                
                if (isAdd) {
                    num1 = Math.floor(Math.random() * 400) + 150; // 150 to 550
                    num2 = Math.floor(Math.random() * 300) + 80;  // 80 to 380
                    ans = num1 + num2;
                    sign = '+';
                } else {
                    num1 = Math.floor(Math.random() * 600) + 300; // 300 to 900
                    num2 = Math.floor(Math.random() * 200) + 50;  // 50 to 250
                    ans = num1 - num2;
                    sign = '−';
                }

                return {
                    category: 'number',
                    type: 'addition-subtraction-regroup',
                    questionText: `Solve the place value equation:`,
                    targetAns: ans,
                    hintText: `
                        <p>Write the numbers vertically aligned by their place value columns (Hundreds, Tens, Ones):</p>
                        <p style="font-family:var(--font-mono); margin-top:4px; margin-left:16px;">
                           &nbsp;&nbsp;${num1}<br>
                           ${sign} ${num2}<br>
                           ------
                        </p>
                        <p style="margin-top:6px;">Add or subtract from the ones column, regrouping (carrying or borrowing) to the tens column if needed.</p>
                    `,
                    solutionText: `Direct vertical alignment calculation shows: ${num1} ${sign} ${num2} = <strong>${ans}</strong>.`,
                    renderFunc: (container) => {
                        container.innerHTML = `
                            <div class="flex-col align-center gap-12">
                                <div style="font-size:2.8rem; font-weight:700; color:var(--primary); font-family:var(--font-display);">${num1} ${sign} ${num2}</div>
                                <div class="question-input-group">
                                    <input type="number" id="add-sub-regroup-ans" class="input-text-terminal input-number-small" placeholder="?" autocomplete="off" style="width:130px;">
                                </div>
                            </div>
                        `;
                    },
                    validateFunc: () => {
                        const userAns = parseInt(document.getElementById('add-sub-regroup-ans').value, 10);
                        return userAns === ans;
                    }
                };
            }
        },
        algebra: () => {
            const subTypes = ['fact-families', 'multiplication-recall', 'division-facts'];
            const chosenType = subTypes[Math.floor(Math.random() * subTypes.length)];

            if (chosenType === 'fact-families') {
                const a = Math.floor(Math.random() * 30) + 12; // 12 to 41
                const b = Math.floor(Math.random() * 25) + 8;  // 8 to 32
                const sum = a + b;
                const pos = Math.floor(Math.random() * 3); // three equation positions

                let eqText = "";
                let targetUnknown = 0;

                if (pos === 0) {
                    eqText = `? + ${b} = ${sum}`;
                    targetUnknown = a;
                } else if (pos === 1) {
                    eqText = `${a} + ? = ${sum}`;
                    targetUnknown = b;
                } else {
                    eqText = `${sum} − ? = ${a}`;
                    targetUnknown = b;
                }

                return {
                    category: 'algebra',
                    type: 'fact-families',
                    questionText: 'Determine the unknown value (?) in the equation using inverse operations:',
                    targetAns: targetUnknown,
                    hintText: `
                        <p>Addition and Subtraction are inverse operations:</p>
                        <ul style="margin-top:4px; padding-left:16px;">
                            <li>If <code>? + B = C</code>, then <code>? = C − B</code>.</li>
                            <li>If <code>C − ? = A</code>, then <code>? = C − A</code>.</li>
                        </ul>
                    `,
                    solutionText: `Applying inverse operation: ${eqText.replace('?', `<strong>${targetUnknown}</strong>`)}.`,
                    renderFunc: (container) => {
                        container.innerHTML = `
                            <div class="flex-col align-center gap-12">
                                <div style="font-size:2.8rem; font-weight:700; color:var(--primary); font-family:var(--font-display);">${eqText}</div>
                                <div class="question-input-group">
                                    <input type="number" id="fact-family-ans" class="input-text-terminal input-number-small" placeholder="?" autocomplete="off">
                                </div>
                            </div>
                        `;
                    },
                    validateFunc: () => {
                        const userAns = parseInt(document.getElementById('fact-family-ans').value, 10);
                        return userAns === targetUnknown;
                    }
                };
            } else if (chosenType === 'multiplication-recall') {
                const tables = [3, 4, 5, 10];
                const factor1 = tables[Math.floor(Math.random() * tables.length)];
                const factor2 = Math.floor(Math.random() * 10) + 1; // 1 to 10
                const ans = factor1 * factor2;

                return {
                    category: 'algebra',
                    type: 'multiplication-recall',
                    questionText: 'Recall and calculate the multiplication fact:',
                    targetAns: ans,
                    hintText: `<p>Use skip counting to find the answer: Count in groups of ${factor1} total of ${factor2} times.</p>`,
                    solutionText: `${factor1} groups of ${factor2} equals <strong>${ans}</strong>. (${factor1} × ${factor2} = ${ans})`,
                    renderFunc: (container) => {
                        container.innerHTML = `
                            <div class="flex-col align-center gap-12">
                                <div style="font-size:2.8rem; font-weight:700; color:var(--primary); font-family:var(--font-display);">${factor1} × ${factor2}</div>
                                <div class="question-input-group">
                                    <input type="number" id="mult-recall-ans" class="input-text-terminal input-number-small" placeholder="?" autocomplete="off">
                                </div>
                            </div>
                        `;
                    },
                    validateFunc: () => {
                        const userAns = parseInt(document.getElementById('mult-recall-ans').value, 10);
                        return userAns === ans;
                    }
                };
            } else if (chosenType === 'division-facts') {
                const tables = [3, 4, 5, 10];
                const divisor = tables[Math.floor(Math.random() * tables.length)];
                const quotient = Math.floor(Math.random() * 10) + 1; // 1 to 10
                const dividend = divisor * quotient;

                return {
                    category: 'algebra',
                    type: 'division-facts',
                    questionText: 'Recall and calculate the related division fact:',
                    targetAns: quotient,
                    hintText: `<p>Think: What number multiplied by ${divisor} equals ${dividend}? (i.e. ${divisor} × ? = ${dividend})</p>`,
                    solutionText: `${dividend} split into groups of ${divisor} gives <strong>${quotient}</strong> groups. (${dividend} ÷ ${divisor} = ${quotient})`,
                    renderFunc: (container) => {
                        container.innerHTML = `
                            <div class="flex-col align-center gap-12">
                                <div style="font-size:2.8rem; font-weight:700; color:var(--primary); font-family:var(--font-display);">${dividend} ÷ ${divisor}</div>
                                <div class="question-input-group">
                                    <input type="number" id="div-facts-ans" class="input-text-terminal input-number-small" placeholder="?" autocomplete="off">
                                </div>
                            </div>
                        `;
                    },
                    validateFunc: () => {
                        const userAns = parseInt(document.getElementById('div-facts-ans').value, 10);
                        return userAns === quotient;
                    }
                };
            }
        },
        measurement: () => {
            const subTypes = ['analog-clock', 'money-values'];
            const chosenType = subTypes[Math.floor(Math.random() * subTypes.length)];

            if (chosenType === 'analog-clock') {
                const hours = Math.floor(Math.random() * 12) + 1;
                // Generate minutes in multiples of 5, or random minutes for precision
                const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 12, 28, 43, 57][Math.floor(Math.random() * 16)];

                return {
                    category: 'measurement',
                    type: 'analog-clock',
                    questionText: 'Read the time shown on the analog clock to the nearest minute:',
                    targetAns: { hours, minutes },
                    hintText: `
                        <p>1. Identify the short hand (Hour Hand). It shows the hour. If it lies between two numbers, read the smaller number (unless between 12 and 1).</p>
                        <p>2. Identify the long hand (Minute Hand). Multiply the number it points to by 5, then add any additional single minute tick marks.</p>
                    `,
                    solutionText: `The hour hand points at or just past ${hours}, and the minute hand points at exactly ${minutes} minutes. The time is <strong>${hours}:${minutes.toString().padStart(2, '0')}</strong>.`,
                    renderFunc: (container) => {
                        container.innerHTML = `
                            <div class="flex-col align-center gap-8">
                                ${makeClockSvg(hours, minutes)}
                                <div class="flex-row gap-8 align-center justify-center" style="margin-top:12px;">
                                    <input type="number" id="clock-hr-inp" class="input-text-terminal" style="width:60px; text-align:center;" placeholder="hour" min="1" max="12">
                                    <span style="font-size: 1.5rem; font-weight: bold;">:</span>
                                    <input type="number" id="clock-min-inp" class="input-text-terminal" style="width:60px; text-align:center;" placeholder="min" min="0" max="59">
                                </div>
                            </div>
                        `;
                    },
                    validateFunc: () => {
                        const userHr = parseInt(document.getElementById('clock-hr-inp').value, 10);
                        const userMin = parseInt(document.getElementById('clock-min-inp').value, 10);
                        if (isNaN(userHr) || isNaN(userMin)) return false;
                        return userHr === hours && userMin === minutes;
                    }
                };
            } else if (chosenType === 'money-values') {
                const note5 = Math.floor(Math.random() * 2); // 0 or 1
                const coin2 = Math.floor(Math.random() * 3) + 1; // 1 to 3
                const coin50 = Math.floor(Math.random() * 2) + 1; // 1 or 2
                const coin20 = Math.floor(Math.random() * 3); // 0 to 2
                
                const totalCents = (note5 * 500) + (coin2 * 200) + (coin50 * 50) + (coin20 * 20);
                const dollarsStr = (totalCents / 100).toFixed(2);

                return {
                    category: 'measurement',
                    type: 'money-values',
                    questionText: 'Calculate the total money value of the following currency collection:',
                    targetAns: parseFloat(dollarsStr),
                    hintText: `
                        <p>Calculate the value of notes and coins separately, then sum them:</p>
                        <ul style="margin-top:4px; padding-left:16px;">
                            ${note5 ? `<li>One $5 note = $5.00</li>` : ''}
                            <li>${coin2} × $2 coins = $${(coin2 * 2).toFixed(2)}</li>
                            <li>${coin50} × 50c coins = $${(coin50 * 0.5).toFixed(2)}</li>
                            ${coin20 ? `<li>${coin20} × 20c coins = $${(coin20 * 0.2).toFixed(2)}</li>` : ''}
                        </ul>
                    `,
                    solutionText: `Summing the currency values: ${note5 ? `$5.00 + ` : ''}$${(coin2 * 2).toFixed(2)} + $${(coin50 * 0.5).toFixed(2)}${coin20 ? ` + $${(coin20 * 0.2).toFixed(2)}` : ''} = <strong>$${dollarsStr}</strong>.`,
                    renderFunc: (container) => {
                        container.innerHTML = `
                            <div class="flex-col gap-12" style="max-width: 440px; margin: 0 auto;">
                                <p>You have the following notes and coins in your register:</p>
                                <ul style="margin-left: 24px; line-height:1.6; font-size:0.95rem;">
                                    ${note5 ? `<li><strong>${note5}</strong> × $5 note</li>` : ''}
                                    <li><strong>${coin2}</strong> × $2 gold coins</li>
                                    <li><strong>${coin50}</strong> × 50c silver coins</li>
                                    ${coin20 ? `<li><strong>${coin20}</strong> × 20c silver coins</li>` : ''}
                                </ul>
                                <div class="question-input-group justify-center" style="margin-top:12px;">
                                    <span style="font-size: 1.5rem; font-weight: bold; color:var(--primary);">$</span>
                                    <input type="number" id="money-total-ans" class="input-text-terminal" placeholder="0.00" step="0.01" style="width:140px; font-weight:bold; font-size:1.2rem;" autocomplete="off">
                                </div>
                            </div>
                        `;
                    },
                    validateFunc: () => {
                        const userAns = parseFloat(document.getElementById('money-total-ans').value);
                        if (isNaN(userAns)) return false;
                        return Math.abs(userAns - parseFloat(dollarsStr)) < 0.01;
                    }
                };
            }
        },
        space: () => {
            // landmark 2D grid coordinates
            const labels = ['Tree', 'Pond', 'Hut', 'Cave', 'Well'];
            const shuffledLabels = shuffleArray(labels);
            
            const landmarks = [
                { label: shuffledLabels[0], x: Math.floor(Math.random() * 2), y: Math.floor(Math.random() * 2) }, // Bottom-Left quadrant
                { label: shuffledLabels[1], x: Math.floor(Math.random() * 2) + 2, y: Math.floor(Math.random() * 2) + 2 }, // Top-Right quadrant
                { label: shuffledLabels[2], x: Math.floor(Math.random() * 2) + 2, y: Math.floor(Math.random() * 2) } // Bottom-Right quadrant
            ];

            const questionType = Math.random() > 0.5 ? 'locate' : 'navigate';
            
            if (questionType === 'locate') {
                const targetLm = landmarks[Math.floor(Math.random() * landmarks.length)];

                return {
                    category: 'space',
                    type: 'landmark-locate',
                    questionText: `Locate the <strong>${targetLm.label}</strong> on the grid map:`,
                    targetAns: { x: targetLm.x, y: targetLm.y },
                    hintText: `
                        <p>Find the <strong>${targetLm.label}</strong> on the grid map.</p>
                        <p>1. Look down at the horizontal x-axis to find its x-coordinate (column): <strong>${targetLm.x}</strong>.</p>
                        <p>2. Look left at the vertical y-axis to find its y-coordinate (row): <strong>${targetLm.y}</strong>.</p>
                    `,
                    solutionText: `The ${targetLm.label} sits at column ${targetLm.x} and row ${targetLm.y}. The coordinates are <strong>(${targetLm.x}, ${targetLm.y})</strong>.`,
                    renderFunc: (container) => {
                        container.innerHTML = `
                            <div class="flex-col align-center gap-8">
                                ${makeLandmarkGridSvg(landmarks)}
                                <div class="flex-row gap-8 align-center justify-center" style="margin-top:12px;">
                                    <span>Coordinates of ${targetLm.label}:</span>
                                    <span>(</span>
                                    <input type="number" id="space-loc-x" class="input-text-terminal" style="width:55px; text-align:center;" placeholder="x" min="0" max="4">
                                    <span>,</span>
                                    <input type="number" id="space-loc-y" class="input-text-terminal" style="width:55px; text-align:center;" placeholder="y" min="0" max="4">
                                    <span>)</span>
                                </div>
                            </div>
                        `;
                    },
                    validateFunc: () => {
                        const ux = parseInt(document.getElementById('space-loc-x').value, 10);
                        const uy = parseInt(document.getElementById('space-loc-y').value, 10);
                        if (isNaN(ux) || isNaN(uy)) return false;
                        return ux === targetLm.x && uy === targetLm.y;
                    }
                };
            } else {
                // Navigate
                const startLm = landmarks[0];
                const destLm = landmarks[1];
                
                const dx = destLm.x - startLm.x; // units Right
                const dy = destLm.y - startLm.y; // units Up

                return {
                    category: 'space',
                    type: 'landmark-navigate',
                    questionText: `Navigate the environment grid:`,
                    targetAns: destLm.label,
                    hintText: `
                        <p>Start at the <strong>${startLm.label}</strong> at (${startLm.x}, ${startLm.y}).</p>
                        <p>Move ${dx} grid units Right (to column ${destLm.x}) and ${dy} grid units Up (to row ${destLm.y}).</p>
                        <p>See which landmark sits at those ending coordinates.</p>
                    `,
                    solutionText: `Starting at the ${startLm.label} (${startLm.x}, ${startLm.y}), shifting ${dx} units Right and ${dy} units Up leads to (${destLm.x}, ${destLm.y}), which is the <strong>${destLm.label}</strong>.`,
                    renderFunc: (container) => {
                        container.innerHTML = `
                            <div class="flex-col align-center gap-8">
                                ${makeLandmarkGridSvg(landmarks)}
                                <div class="flex-col align-center justify-center" style="margin-top:12px; font-size:0.95rem; text-align:center; max-width:400px;">
                                    <p>Start at the <strong>${startLm.label}</strong>. Move <strong>${dx} units Right</strong> and <strong>${dy} units Up</strong>.</p>
                                    <div class="flex-row gap-8 align-center justify-center style="margin-top:8px;">
                                        <span>What landmark do you reach?</span>
                                        <select id="space-nav-select" class="input-text-terminal" style="width:140px;">
                                            <option value="">-Select-</option>
                                            ${landmarks.map(lm => `<option value="${lm.label}">${lm.label}</option>`).join('')}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        `;
                    },
                    validateFunc: () => {
                        const userAns = document.getElementById('space-nav-select').value;
                        return userAns === destLm.label;
                    }
                };
            }
        },
        statistics: () => {
            const categories = ['Dogs', 'Cats', 'Birds', 'Fish'];
            const vals = [];
            while (vals.length < 4) {
                const rVal = (Math.floor(Math.random() * 5) + 1) * 2; // even values 2 to 10
                if (!vals.includes(rVal)) vals.push(rVal);
            }
            
            const randIdx1 = Math.floor(Math.random() * 4);
            let randIdx2 = Math.floor(Math.random() * 4);
            while (randIdx1 === randIdx2) {
                randIdx2 = Math.floor(Math.random() * 4);
            }
            
            const cat1 = categories[randIdx1];
            const cat2 = categories[randIdx2];
            const val1 = vals[randIdx1];
            const val2 = vals[randIdx2];
            
            const diff = Math.abs(val1 - val2);
            const isMore = val1 > val2;

            return {
                category: 'statistics',
                type: 'read-column-chart',
                questionText: `Read and interpret the pet classroom frequency chart:`,
                targetAns: diff,
                hintText: `
                    <p>1. Find the height of the column for <strong>${cat1}</strong>: It represents <strong>${val1}</strong> pets.</p>
                    <p>2. Find the height of the column for <strong>${cat2}</strong>: It represents <strong>${val2}</strong> pets.</p>
                    <p>3. Calculate the difference: subtract the smaller value from the larger value.</p>
                `,
                solutionText: `Looking at the chart, ${cat1} = ${val1} and ${cat2} = ${val2}. The difference is: |${val1} − ${val2}| = <strong>${diff}</strong>.`,
                renderFunc: (container) => {
                    container.innerHTML = `
                        <div class="flex-col align-center gap-8">
                            ${makeBarChartSvg(categories, vals, cat1)}
                            <div class="flex-col align-center justify-center" style="margin-top:12px; font-size:0.95rem; text-align:center;">
                                <p>How many ${isMore ? 'more' : 'fewer'} <strong>${cat1}</strong> are there than <strong>${cat2}</strong>?</p>
                                <input type="number" id="stats-chart-ans" class="input-text-terminal input-number-small" placeholder="?" style="margin-top:8px; width:100px;">
                            </div>
                        </div>
                    `;
                },
                validateFunc: () => {
                    const userAns = parseInt(document.getElementById('stats-chart-ans').value, 10);
                    return userAns === diff;
                }
            };
        },
        probability: () => {
            // Marble bag chance descriptors: Likely, Unlikely, Certain, Impossible
            const type = Math.floor(Math.random() * 3);
            
            let bagColors = [];
            let targetColor = "";
            let targetLikelihood = "";
            let questionPrompt = "";

            if (type === 0) {
                // Certain or Impossible
                const isCertain = Math.random() > 0.5;
                if (isCertain) {
                    bagColors = ['Blue', 'Blue', 'Blue', 'Blue', 'Blue', 'Blue'];
                    targetColor = 'Blue';
                    targetLikelihood = 'Certain';
                } else {
                    bagColors = ['Blue', 'Blue', 'Blue', 'Blue', 'Blue', 'Blue'];
                    targetColor = 'Red';
                    targetLikelihood = 'Impossible';
                }
            } else {
                // Likely or Unlikely
                const isLikely = Math.random() > 0.5;
                if (isLikely) {
                    bagColors = ['Blue', 'Blue', 'Blue', 'Blue', 'Blue', 'Green'];
                    targetColor = 'Blue';
                    targetLikelihood = 'Likely';
                } else {
                    bagColors = ['Blue', 'Blue', 'Blue', 'Blue', 'Blue', 'Green'];
                    targetColor = 'Green';
                    targetLikelihood = 'Unlikely';
                }
            }
            
            questionPrompt = `If you draw one marble from the bag at random, the chance of drawing a <strong>${targetColor}</strong> marble is:`;

            // Draw marble bag SVG helper
            const makeMarbleBagSvg = (marbles) => {
                let svg = `<svg viewBox="0 0 160 140" style="width:100%; max-width:160px; height:auto; display:block; margin:8px auto;">`;
                // Draw jar/bag outline
                svg += `<path d="M 40,40 L 40,110 A 40,20 0 0,0 120,110 L 120,40 Z" fill="rgba(0, 82, 255, 0.03)" stroke="var(--outline)" stroke-width="2" />`;
                svg += `<ellipse cx="80" cy="40" rx="40" ry="8" fill="rgba(255, 255, 255, 0.4)" stroke="var(--outline)" stroke-width="1.5" />`;
                
                // Plot circular marbles with radial gradients
                const coords = [
                    { x: 65, y: 70 }, { x: 95, y: 72 }, { x: 80, y: 88 },
                    { x: 55, y: 92 }, { x: 105, y: 90 }, { x: 80, y: 110 }
                ];
                
                marbles.forEach((col, idx) => {
                    const c = coords[idx % coords.length];
                    const fillColor = col === 'Blue' ? '#0052ff' : (col === 'Green' ? '#2e7d32' : '#d32f2f');
                    svg += `<circle cx="${c.x}" cy="${c.y}" r="11" fill="${fillColor}" stroke="var(--surface)" stroke-width="1.5" />`;
                });
                
                svg += `</svg>`;
                return svg;
            };

            return {
                category: 'probability',
                type: 'chance-likelihood',
                questionText: 'Analyse the marble bag contents to evaluate the chance event:',
                targetAns: targetLikelihood,
                hintText: `
                    <p>Assess the bag marbles:</p>
                    <ul style="margin-top:4px; padding-left:16px;">
                        <li><strong>Certain</strong>: ALL marbles match the color.</li>
                        <li><strong>Likely</strong>: Most (but not all) marbles match the color.</li>
                        <li><strong>Unlikely</strong>: Very few marbles match the color.</li>
                        <li><strong>Impossible</strong>: There are ZERO marbles of that color.</li>
                    </ul>
                `,
                solutionText: `The bag contains: ${bagColors.filter(c => c === 'Blue').length} Blue and ${bagColors.filter(c => c === 'Green').length} Green marbles. Drawing a ${targetColor} marble is <strong>${targetLikelihood.toLowerCase()}</strong>.`,
                renderFunc: (container) => {
                    container.innerHTML = `
                        <div class="flex-col align-center gap-8">
                            ${makeMarbleBagSvg(bagColors)}
                            <div class="flex-col align-center justify-center" style="margin-top:12px; font-size:0.95rem; text-align:center; max-width:400px;">
                                <p style="margin-bottom:8px;">${questionPrompt}</p>
                                <div class="flex-row gap-8 justify-center flex-wrap" id="prob-buttons-group">
                                    <button class="btn-terminal prob-choice-btn" data-val="Certain">Certain</button>
                                    <button class="btn-terminal prob-choice-btn" data-val="Likely">Likely</button>
                                    <button class="btn-terminal prob-choice-btn" data-val="Unlikely">Unlikely</button>
                                    <button class="btn-terminal prob-choice-btn" data-val="Impossible">Impossible</button>
                                </div>
                            </div>
                        </div>
                    `;
                    
                    const btns = document.querySelectorAll('.prob-choice-btn');
                    btns.forEach(btn => {
                        btn.addEventListener('click', () => {
                            sounds.click();
                            btns.forEach(b => b.classList.remove('primary'));
                            btn.classList.add('primary');
                            btn.blur();
                        });
                    });
                },
                validateFunc: () => {
                    const selected = document.querySelector('.prob-choice-btn.primary');
                    if (!selected) return false;
                    return selected.getAttribute('data-val') === targetLikelihood;
                }
            };
        }
    };

    // ----------------------------------------------------
    // 6. Interactive Sandbox Question Control Loop
    // ----------------------------------------------------
    function loadQuestion() {
        // Reset panels
        pracHintContainer.style.display = 'none';
        pracSolutionContainer.style.display = 'none';
        pracFeedbackText.style.display = 'none';
        btnPracHint.style.display = 'none';
        btnPracSubmit.style.display = 'inline-block';
        btnPracNext.style.display = 'none';

        state.attemptsLeft = 2;
        pracAttemptsLeft.textContent = `2 ATTEMPTS LEFT`;
        pracAttemptsLeft.className = 'rank-pill';

        // Load new question
        const gen = generators[state.activeCategory];
        state.currentQuestion = gen();

        // Render details
        pracTaskTitle.textContent = state.currentQuestion.questionText;
        state.currentQuestion.renderFunc(pracInteractivePanel);

        addLog(`Calibrating Year 3 task strand: ${state.activeCategory.toUpperCase()}`, "system");
    }

    // Tab Event bindings
    document.querySelectorAll('.selector-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            sounds.click();
            document.querySelectorAll('.selector-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            state.activeCategory = tab.getAttribute('data-task');
            loadQuestion();
        });
    });

    btnPracHint.addEventListener('click', () => {
        sounds.hint();
        pracHintContent.innerHTML = state.currentQuestion.hintText;
        pracHintContainer.style.display = 'block';
        btnPracHint.style.display = 'none';
    });

    btnPracSubmit.addEventListener('click', () => {
        if (!state.currentQuestion) return;

        const isCorrect = state.currentQuestion.validateFunc();
        
        if (isCorrect) {
            sounds.success();
            pracFeedbackText.className = 'active-feedback-text feedback-success';
            
            // Score calculations based on attempts
            let ptsGained = state.attemptsLeft === 2 ? 10 : 5;
            pracFeedbackText.textContent = `CORRECT! +${ptsGained} POINTS`;
            pracFeedbackText.style.display = 'block';

            btnPracSubmit.style.display = 'none';
            btnPracNext.style.display = 'inline-block';
            pracAttemptsLeft.textContent = `SUCCESS`;
            pracAttemptsLeft.className = 'rank-pill unlocked';
            
            addLog(`Task solved correctly! Score adjustment completed.`, "success");
            gainPoints(ptsGained, true, state.activeCategory);
        } else {
            sounds.error();
            state.attemptsLeft--;
            
            if (state.attemptsLeft === 1) {
                pracAttemptsLeft.textContent = `1 ATTEMPT LEFT`;
                pracAttemptsLeft.className = 'rank-pill warning';
                
                pracFeedbackText.className = 'active-feedback-text feedback-error';
                pracFeedbackText.textContent = `CALIBRATION FAILED. TRY AGAIN.`;
                pracFeedbackText.style.display = 'block';
                
                btnPracHint.style.display = 'inline-block';
                addLog(`Incorrect answer. Diagnostic hint module loaded.`, "error");
            } else {
                // Out of attempts
                pracAttemptsLeft.textContent = `FAILED`;
                pracAttemptsLeft.className = 'rank-pill locked';
                
                pracFeedbackText.className = 'active-feedback-text feedback-error';
                pracFeedbackText.textContent = `CALIBRATION SYSTEM LOCKOUT.`;
                pracFeedbackText.style.display = 'block';
                
                pracSolutionContent.innerHTML = state.currentQuestion.solutionText;
                pracSolutionContainer.style.display = 'block';
                
                btnPracSubmit.style.display = 'none';
                btnPracNext.style.display = 'inline-block';
                btnPracHint.style.display = 'none';
                
                addLog(`System lock. Solutions database query complete.`, "error");
                gainPoints(0, false, state.activeCategory);
            }
        }
    });

    btnPracNext.addEventListener('click', () => {
        sounds.click();
        loadQuestion();
    });

    // Initialize Page
    loadProfile();
    loadQuestion();
});
