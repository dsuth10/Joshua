/**
 * Joshua Math Practice Console - State & Logic Engine (Year 5)
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
        scoresByCatY3: {
            number: 0,
            algebra: 0,
            measurement: 0,
            space: 0,
            statistics: 0,
            probability: 0
        }
    };
    profile.scoresByCat = profile.scoresByCatY5; // Reference link

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
        const stored = localStorage.getItem('joshua_math_profile');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                
                // Migrate legacy scoresByCat to scoresByCatY5
                if (parsed.scoresByCat && !parsed.scoresByCatY5) {
                    parsed.scoresByCatY5 = parsed.scoresByCat;
                }
                
                // Migration logic: On load, if old category keys exist, sum their totals into number
                if (parsed.scoresByCatY5 && (parsed.scoresByCatY5.recall !== undefined || parsed.scoresByCatY5['place-value'] !== undefined || parsed.scoresByCatY5.dispatch !== undefined)) {
                    const oldRecall = parsed.scoresByCatY5.recall || 0;
                    const oldPv = parsed.scoresByCatY5['place-value'] || 0;
                    const oldDispatch = parsed.scoresByCatY5.dispatch || 0;
                    
                    parsed.scoresByCatY5 = {
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
        if (!profile.scoresByCatY5) {
            profile.scoresByCatY5 = { number: 0, algebra: 0, measurement: 0, space: 0, statistics: 0, probability: 0 };
        }
        if (!profile.scoresByCatY3) {
            profile.scoresByCatY3 = { number: 0, algebra: 0, measurement: 0, space: 0, statistics: 0, probability: 0 };
        }
        
        // Link scoresByCat to active Year 5 scores
        profile.scoresByCat = profile.scoresByCatY5;

        const cats = ['number', 'algebra', 'measurement', 'space', 'statistics', 'probability'];
        cats.forEach(c => {
            if (profile.scoresByCatY5[c] === undefined) profile.scoresByCatY5[c] = 0;
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

        // Remove any existing modal
        const existing = document.getElementById('cert-print-root');
        if (existing) existing.remove();

        // Build the modal
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

        // Pre-fill only if name is custom (not default 'ENGINEER')
        const initialName = (profile.name && profile.name !== 'ENGINEER') ? profile.name : '';
        nameInput.value = initialName;
        namePrintOnly.textContent = initialName || 'STUDENT';

        nameInput.addEventListener('input', () => {
            namePrintOnly.textContent = nameInput.value.toUpperCase() || 'STUDENT';
        });

        // Close handlers
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

        // Print handler
        document.getElementById('cert-btn-print').addEventListener('click', () => {
            window.print();
        });

        sounds.click();
    }

    // Wire up badge clicks (called after each loadProfile so new unlocked badges get listeners)
    function attachBadgeClickHandlers() {
        document.querySelectorAll('.badge-item.unlocked').forEach(el => {
            // Avoid double-binding
            if (el.dataset.certBound) return;
            el.dataset.certBound = 'true';
            const badgeId = el.id.replace('badge-', '');
            el.addEventListener('click', () => showCertificateModal(badgeId));
        });
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

        const getSum = (cat) => (profile.scoresByCatY5[cat] || 0) + (profile.scoresByCatY3[cat] || 0);

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

        // All rounder badge: 50pts in every category
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
        currentQuestion: null,
        activeInterval: null
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

    // SVG Number Line Helper (Fractions)
    function makeNumberLineSvg(fractions, min, max) {
        let svg = `<svg viewBox="0 0 320 80" style="width:100%; max-width:320px; height:auto; display:block; margin:8px auto;">`;
        svg += `<line x1="20" y1="40" x2="300" y2="40" stroke="var(--on-surface)" stroke-width="2" />`;
        const scale = 280 / (max - min);
        for (let i = min; i <= max; i++) {
            const x = 20 + (i - min) * scale;
            svg += `<line x1="${x}" y1="32" x2="${x}" y2="48" stroke="var(--on-surface)" stroke-width="2" />`;
            svg += `<text x="${x}" y="62" font-family="var(--font-mono)" font-size="10" text-anchor="middle" fill="var(--on-surface)">${i}</text>`;
        }
        const colors = ["var(--primary)", "var(--secondary)", "var(--tertiary)", "#e65100"];
        fractions.forEach((f, idx) => {
            const val = f.num / f.den;
            const x = 20 + (val - min) * scale;
            const color = colors[idx % colors.length];
            svg += `<circle cx="${x}" cy="40" r="5" fill="${color}" stroke="var(--surface)" stroke-width="1.5" />`;
            const yOffset = idx % 2 === 0 ? 18 : 28;
            svg += `<text x="${x}" y="${yOffset}" font-family="var(--font-mono)" font-weight="700" font-size="9" text-anchor="middle" fill="${color}">${f.label || (f.num + '/' + f.den)}</text>`;
        });
        svg += `</svg>`;
        return svg;
    }

    // SVG Fraction Bar Helper (Addition)
    function makeFractionBarSvg(frac1, frac2, operation) {
        let svg = `<svg viewBox="0 0 360 120" style="width:100%; max-width:360px; height:auto; display:block; margin:8px auto;">`;
        svg += `<text x="10" y="20" font-family="var(--font-display)" font-size="10" font-weight="600" fill="var(--on-surface)">Fraction A (${frac1.num}/${frac1.den})</text>`;
        const width = 340;
        const h = 20;
        const y1 = 28;
        const w1 = width / frac1.den;
        for (let i = 0; i < frac1.den; i++) {
            const isFilled = i < frac1.num;
            const fill = isFilled ? "rgba(0, 62, 199, 0.4)" : "transparent";
            svg += `<rect x="${10 + i * w1}" y="${y1}" width="${w1}" height="${h}" fill="${fill}" stroke="var(--outline)" stroke-width="1" />`;
        }
        svg += `<text x="180" y="62" font-family="var(--font-display)" font-size="14" font-weight="700" text-anchor="middle" fill="var(--primary)">${operation}</text>`;
        svg += `<text x="10" y="80" font-family="var(--font-display)" font-size="10" font-weight="600" fill="var(--on-surface)">Fraction B (${frac2.num}/${frac2.den})</text>`;
        const y2 = 88;
        const w2 = width / frac2.den;
        for (let i = 0; i < frac2.den; i++) {
            const isFilled = i < frac2.num;
            const fill = isFilled ? "rgba(0, 62, 199, 0.4)" : "transparent";
            svg += `<rect x="${10 + i * w2}" y="${y2}" width="${w2}" height="${h}" fill="${fill}" stroke="var(--outline)" stroke-width="1" />`;
        }
        svg += `</svg>`;
        return svg;
    }

    // SVG Angle Protractor Helper (Angles)
    function makeAngleSvg(angleDeg, showProtractor = false) {
        let svg = `<svg viewBox="0 0 300 240" style="width:100%; max-width:300px; height:auto; display:block; margin:8px auto;" class="protractor-container">`;
        const cx = 150;
        const cy = 130;
        const r = 90;
        const rad = angleDeg * Math.PI / 180;
        if (showProtractor) {
            svg += `<circle cx="${cx}" cy="${cy}" r="${r + 10}" fill="rgba(255, 255, 255, 0.15)" stroke="var(--outline)" stroke-width="1" stroke-dasharray="2 2" />`;
            svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="transparent" stroke="var(--outline)" stroke-width="0.5" />`;
            for (let deg = 0; deg < 360; deg += 10) {
                const phi = deg * Math.PI / 180;
                const isMajor = deg % 30 === 0;
                const rStart = isMajor ? r - 8 : r - 4;
                const x1 = cx + rStart * Math.cos(phi);
                const y1 = cy - rStart * Math.sin(phi);
                const x2 = cx + r * Math.cos(phi);
                const y2 = cy - r * Math.sin(phi);
                svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="protractor-tick" />`;
                if (isMajor) {
                    const tx = cx + (r - 18) * Math.cos(phi);
                    const ty = cy - (r - 18) * Math.sin(phi) + 3;
                    svg += `<text x="${tx}" y="${ty}" class="protractor-label" text-anchor="middle">${deg}°</text>`;
                }
            }
        }
        if (angleDeg > 0) {
            const arcRadius = 35;
            const ax = cx + arcRadius * Math.cos(rad);
            const ay = cy - arcRadius * Math.sin(rad);
            const largeArcFlag = angleDeg > 180 ? 1 : 0;
            svg += `<path d="M ${cx} ${cy} L ${cx + arcRadius} ${cy} A ${arcRadius} ${arcRadius} 0 ${largeArcFlag} 0 ${ax} ${ay} Z" class="angle-sector" />`;
        }
        svg += `<circle cx="${cx}" cy="${cy}" r="4" fill="var(--on-surface)" />`;
        svg += `<line x1="${cx}" y1="${cy}" x2="${cx + r}" y2="${cy}" class="angle-arm" />`;
        const rx = cx + r * Math.cos(rad);
        const ry = cy - r * Math.sin(rad);
        svg += `<line x1="${cx}" y1="${cy}" x2="${rx}" y2="${ry}" class="angle-arm rotated" />`;
        svg += `</svg>`;
        return svg;
    }

    // SVG Bar Chart Helper (Statistics)
    function makeBarChartSvg(categories, frequencies, title = "Data Set", highlightIdx = null) {
        let svg = `<svg viewBox="0 0 400 240" style="width:100%; height:100%;" class="bar-chart-container">`;
        svg += `<text x="200" y="22" class="graph-title" font-family="var(--font-display)" font-size="12" font-weight="700" text-anchor="middle" fill="var(--on-surface)">${title}</text>`;
        const maxFreq = Math.max(...frequencies, 5);
        const yMax = Math.ceil(maxFreq / 5) * 5;
        for (let val = 0; val <= yMax; val += Math.ceil(yMax / 5)) {
            const y = 190 - (val / yMax) * 140;
            svg += `<line x1="45" y1="${y}" x2="380" y2="${y}" stroke="var(--outline-variant)" stroke-width="0.5" stroke-dasharray="2 2" />`;
            svg += `<text x="35" y="${y + 3}" font-family="var(--font-mono)" font-size="9" text-anchor="end" fill="var(--outline)">${val}</text>`;
        }
        svg += `<line x1="45" y1="190" x2="380" y2="190" stroke="var(--on-surface)" stroke-width="1.5" />`;
        svg += `<line x1="45" y1="50" x2="45" y2="190" stroke="var(--on-surface)" stroke-width="1.5" />`;
        const numBars = categories.length;
        const chartWidth = 320;
        const barSpacing = chartWidth / numBars;
        const barWidth = barSpacing * 0.6;
        frequencies.forEach((freq, idx) => {
            const barHeight = (freq / yMax) * 140;
            const x = 45 + idx * barSpacing + (barSpacing - barWidth) / 2;
            const y = 190 - barHeight;
            const isHighlight = idx === highlightIdx;
            svg += `<rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="2" class="chart-bar ${isHighlight ? 'highlight' : ''}" fill="${isHighlight ? 'var(--tertiary)' : 'var(--primary)'}" />`;
            svg += `<text x="${x + barWidth/2}" y="${y - 5}" font-family="var(--font-mono)" font-size="9" font-weight="700" text-anchor="middle" fill="var(--on-surface)">${freq}</text>`;
            svg += `<text x="${x + barWidth/2}" y="205" class="chart-bar-label" font-family="var(--font-display)" font-size="9" text-anchor="middle" fill="var(--on-surface-variant)">${categories[idx]}</text>`;
        });
        svg += `</svg>`;
        return svg;
    }

    // SVG Reflection/Rotation Coordinate Grid Helper
    function makeReflectionGridSvg(originalVertices, transformationType, param, studentVertices, correctVertices = null, showSolution = false) {
        let svg = `<svg viewBox="0 0 300 300" style="width:100%; height:100%;">`;
        svg += `
        <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--on-surface)" />
            </marker>
        </defs>
        `;
        for (let i = 0; i <= 10; i++) {
            const x = 30 + i * 24;
            const y = 270 - i * 24;
            svg += `<line x1="${x}" y1="30" x2="${x}" y2="270" class="coord-gridline" />`;
            svg += `<line x1="30" y1="${y}" x2="270" y2="${y}" class="coord-gridline" />`;
            svg += `<text x="${x}" y="285" class="coord-label">${i}</text>`;
            svg += `<text x="15" y="${y}" class="coord-label coord-label-y">${i}</text>`;
        }
        svg += `<line x1="30" y1="270" x2="280" y2="270" class="coord-axis" marker-end="url(#arrow)" />`;
        svg += `<line x1="30" y1="270" x2="30" y2="20" class="coord-axis" marker-end="url(#arrow)" />`;
        svg += `<text x="285" y="280" class="coord-label" style="font-weight:700;">x</text>`;
        svg += `<text x="35" y="15" class="coord-label" style="font-weight:700;">y</text>`;

        if (transformationType === 'reflection' && param) {
            if (param.axis === 'x') {
                const lx = 30 + param.value * 24;
                svg += `<line x1="${lx}" y1="20" x2="${lx}" y2="280" class="mirror-line" />`;
                svg += `<text x="${lx + 4}" y="28" font-family="var(--font-mono)" font-size="8" fill="var(--error)" font-weight="bold">Mirror x=${param.value}</text>`;
            } else if (param.axis === 'y') {
                const ly = 270 - param.value * 24;
                svg += `<line x1="20" y1="${ly}" x2="280" y2="${ly}" class="mirror-line" />`;
                svg += `<text x="220" y="${ly - 4}" font-family="var(--font-mono)" font-size="8" fill="var(--error)" font-weight="bold">Mirror y=${param.value}</text>`;
            }
        }
        if (transformationType === 'rotation' && param && param.center) {
            const cx = 30 + param.center.x * 24;
            const cy = 270 - param.center.y * 24;
            svg += `<circle cx="${cx}" cy="${cy}" r="5" fill="var(--error)" />`;
            svg += `<line x1="${cx - 10}" y1="${cy}" x2="${cx + 10}" y2="${cy}" stroke="var(--error)" stroke-width="1.5" />`;
            svg += `<line x1="${cx}" y1="${cy - 10}" x2="${cx}" y2="${cy + 10}" stroke="var(--error)" stroke-width="1.5" />`;
            svg += `<text x="${cx + 6}" y="${cy - 6}" font-family="var(--font-mono)" font-size="8" fill="var(--error)" font-weight="bold">Center C(${param.center.x},${param.center.y})</text>`;
        }
        for (let x = 0; x <= 10; x++) {
            for (let y = 0; y <= 10; y++) {
                const cx = 30 + x * 24;
                const cy = 270 - y * 24;
                svg += `<circle cx="${cx}" cy="${cy}" r="11" class="coord-cell" data-x="${x}" data-y="${y}" />`;
            }
        }
        const drawShape = (vertices, strokeColor, strokeWidth, fillStyle, strokeDash = "") => {
            if (vertices.length < 2) return "";
            let pathD = `M ${30 + vertices[0].x * 24} ${270 - vertices[0].y * 24}`;
            for (let i = 1; i < vertices.length; i++) {
                pathD += ` L ${30 + vertices[i].x * 24} ${270 - vertices[i].y * 24}`;
            }
            if (vertices.length > 2) {
                pathD += " Z";
            }
            return `<path d="${pathD}" stroke="${strokeColor}" stroke-width="${strokeWidth}" fill="${fillStyle}" stroke-dasharray="${strokeDash}" />`;
        };
        svg += drawShape(originalVertices, "var(--primary)", 2.5, "rgba(0, 62, 199, 0.15)");
        originalVertices.forEach((v, idx) => {
            const vx = 30 + v.x * 24;
            const vy = 270 - v.y * 24;
            svg += `<circle cx="${vx}" cy="${vy}" r="4" fill="var(--primary)" />`;
            svg += `<text x="${vx + 5}" y="${vy - 5}" class="shape-vertex-label">P${idx+1}</text>`;
        });
        if (showSolution && correctVertices) {
            svg += drawShape(correctVertices, "var(--secondary)", 2, "rgba(0, 0, 0, 0.05)", "4 2");
            correctVertices.forEach((v, idx) => {
                const vx = 30 + v.x * 24;
                const vy = 270 - v.y * 24;
                svg += `<circle cx="${vx}" cy="${vy}" r="4" fill="var(--secondary)" />`;
                svg += `<text x="${vx + 5}" y="${vy - 5}" class="shape-vertex-label" style="fill:var(--secondary);">P${idx+1}'</text>`;
            });
        }
        if (studentVertices && studentVertices.length > 0) {
            svg += drawShape(studentVertices, "var(--tertiary)", 2, "rgba(0, 0, 0, 0.05)");
            studentVertices.forEach((v, idx) => {
                const vx = 30 + v.x * 24;
                const vy = 270 - v.y * 24;
                svg += `<circle cx="${vx}" cy="${vy}" r="5" fill="var(--tertiary)" stroke="var(--surface)" stroke-width="1.5" />`;
                svg += `<text x="${vx + 5}" y="${vy - 5}" class="shape-vertex-label" style="fill:var(--tertiary);">P${idx+1}'</text>`;
            });
        }
        svg += `</svg>`;
        return svg;
    }

    // ----------------------------------------------------
    // 5. Dynamic Category Generators & Helpers (6 strands)
    // ----------------------------------------------------
    const generators = {
        number: () => {
            const subTypes = ['decimal-ordering', 'factor-multiple', 'percentage-converter', 'multiplication', 'division-remainder', 'fraction-ordering', 'fraction-addition', 'word-problem'];
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
            } else if (chosenType === 'division-remainder') {
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
                                <div class="flex-col gap-8 align-center" style="margin-top: 10px; border-top: 1px dashed var(--outline-variant); padding-top: 10px; width: 100%;">
                                    <div class="flex-row gap-8 align-center">
                                        <span style="font-size:0.9rem; font-weight:600;">As a decimal (2 d.p.):</span>
                                        <input type="number" step="0.01" id="div-rem-dec" class="input-text-terminal" placeholder="0.00" style="width:100px; text-align:center;" autocomplete="off">
                                    </div>
                                    <div class="flex-row gap-8 align-center">
                                        <span style="font-size:0.9rem; font-weight:600;">Remainder as a fraction:</span>
                                        <input type="text" id="div-rem-frac" class="input-text-terminal" placeholder="e.g. 3/7" style="width:100px; text-align:center;" autocomplete="off">
                                    </div>
                                </div>
                            </div>
                        `;
                    },
                    validateFunc: () => {
                        const userQ = parseInt(document.getElementById('div-rem-q').value.trim(), 10);
                        const userR = parseInt(document.getElementById('div-rem-r').value.trim(), 10);
                        const userDec = parseFloat(document.getElementById('div-rem-dec').value.trim());
                        const userFracStr = document.getElementById('div-rem-frac').value.trim();
                        const userFrac = parseFraction(userFracStr);

                        if (isNaN(userQ) || isNaN(userR) || isNaN(userDec) || userFrac === null) return false;

                        const qCorrect = userQ === Q;
                        const rCorrect = userR === R;
                        const decCorrect = Math.abs(userDec - (A / B)) <= 0.015;
                        const fracCorrect = Math.abs(userFrac - (R / B)) < 0.001;

                        return qCorrect && rCorrect && decCorrect && fracCorrect;
                    }
                };
            } else if (chosenType === 'fraction-ordering') {
                const denoms = [2, 3, 4, 5, 8, 10];
                const baseDenom = denoms[Math.floor(Math.random() * denoms.length)];
                const fractionPool = [];
                const possibleFractions = [];
                for (let d of [baseDenom, baseDenom * 2]) {
                    if (d > 12) continue;
                    for (let n = 1; n < d * 2; n++) {
                        const val = n / d;
                        if (!possibleFractions.some(f => Math.abs(f.val - val) < 0.001)) {
                            let label = "";
                            if (n > d) {
                                const whole = Math.floor(n / d);
                                const rem = n % d;
                                if (rem === 0) {
                                    label = `${whole}`;
                                } else {
                                    label = `${whole} ${rem}/${d}`;
                                }
                            } else {
                                label = `${n}/${d}`;
                            }
                            possibleFractions.push({ num: n, den: d, label, val });
                        }
                    }
                }
                const selected = shuffleArray(possibleFractions).slice(0, 4);
                const sorted = [...selected].sort((a, b) => a.val - b.val);
                const shuffled = shuffleArray(selected);

                return {
                    category: 'number',
                    type: 'fraction-ordering',
                    questionText: 'Order the fractions and mixed numerals from smallest to largest:',
                    targetAns: sorted,
                    hintText: `
                        <p>To order fractions, convert them to a common denominator or convert them to decimals:</p>
                        <div style="margin-top:8px;">
                            ${makeNumberLineSvg(shuffled, 0, 2)}
                        </div>
                    `,
                    solutionText: `Converting to decimals: ${sorted.map(s => `${s.label} ≈ ${s.val.toFixed(2)}`).join(', ')}. Sorted: ${sorted.map(s => s.label).join(' < ')}.`,
                    renderFunc: (container) => {
                        let optionsHtml = shuffled.map((f, i) => `<option value="${f.num}/${f.den}">${f.label}</option>`).join('');
                        container.innerHTML = `
                            <div class="flex-col align-center gap-12">
                                <div class="flex-row gap-16 align-center justify-center" style="flex-wrap:wrap; font-size:1.8rem; margin:10px 0;">
                                    ${shuffled.map(f => `
                                        <div class="fraction-display" style="border: 1px solid var(--outline-variant); padding: 8px 12px; border-radius: 4px; background: var(--surface-container-low);">
                                            ${f.label.includes('/') ? `
                                                <div class="flex-row align-center gap-4">
                                                    ${f.label.split(' ')[0].includes('/') ? '' : `<span>${f.label.split(' ')[0]}</span>`}
                                                    <div class="fraction-display">
                                                        <span class="frac-num">${f.label.split(' ').pop().split('/')[0]}</span>
                                                        <div class="frac-line"></div>
                                                        <span class="frac-den">${f.label.split(' ').pop().split('/')[1]}</span>
                                                    </div>
                                                </div>
                                            ` : `<span>${f.label}</span>`}
                                        </div>
                                    `).join('')}
                                </div>
                                <div class="flex-row gap-8 align-center justify-center" style="flex-wrap:wrap; margin-top:8px;">
                                    ${[0, 1, 2, 3].map(pos => `
                                        <div class="flex-col align-center gap-4">
                                            <span style="font-size:0.75rem; font-weight:600; color:var(--outline);">${pos + 1}<sup>${['st','nd','rd','th'][pos]}</sup></span>
                                            <select id="frac-order-${pos}" class="input-text-terminal" style="width:100px; padding: 4px; font-size:0.9rem;">
                                                <option value="">-- select --</option>
                                                ${optionsHtml}
                                            </select>
                                        </div>
                                        ${pos < 3 ? '<span style="font-size:1.2rem; font-weight:bold; align-self:flex-end; margin-bottom:4px;">&lt;</span>' : ''}
                                    `).join('')}
                                </div>
                            </div>
                        `;
                    },
                    validateFunc: () => {
                        const userVals = [0, 1, 2, 3].map(pos => {
                            const val = document.getElementById(`frac-order-${pos}`).value;
                            return parseFraction(val);
                        });
                        if (userVals.some(v => v === null || isNaN(v))) return false;
                        return userVals[0] < userVals[1] && userVals[1] < userVals[2] && userVals[2] < userVals[3] &&
                               userVals.every(uv => sorted.some(sv => Math.abs(sv.val - uv) < 0.001));
                    }
                };
            } else if (chosenType === 'fraction-addition') {
                const op = Math.random() < 0.7 ? '+' : '−';
                const denoms = [
                    [3, 3], [4, 4], [5, 5], [6, 6], [8, 8], [10, 10],
                    [2, 4], [3, 6], [5, 10], [4, 8], [2, 6], [2, 8]
                ];
                const denomPair = denoms[Math.floor(Math.random() * denoms.length)];
                const denA = denomPair[0];
                const denB = denomPair[1];
                let numA = Math.floor(Math.random() * denA) + 1;
                let numB = Math.floor(Math.random() * denB) + 1;
                if (op === '−') {
                    while (numA / denA <= numB / denB) {
                        numA = Math.floor(Math.random() * denA) + 1;
                        numB = Math.floor(Math.random() * denB) + 1;
                    }
                }
                const valA = numA / denA;
                const valB = numB / denB;
                const correctVal = op === '+' ? valA + valB : valA - valB;

                return {
                    category: 'number',
                    type: 'fraction-addition',
                    questionText: `Solve the fraction calculation:`,
                    targetAns: correctVal,
                    hintText: `
                        <p>To add or subtract fractions, they must have a <strong>common denominator</strong>.</p>
                        <p style="margin-top:4px;">1. Find the Lowest Common Denominator (LCD).</p>
                        <p>2. Convert each fraction to have the LCD.</p>
                        <p>3. Perform the addition or subtraction on the numerators.</p>
                        <div style="margin-top:8px;">
                            ${makeFractionBarSvg({num: numA, den: denA}, {num: numB, den: denB}, op)}
                        </div>
                    `,
                    solutionText: `Step-by-step: Convert fractions to common denominator. ${numA}/${denA} ${op} ${numB}/${denB} = ${correctVal.toFixed(2)} (or equivalent fraction).`,
                    renderFunc: (container) => {
                        container.innerHTML = `
                            <div class="flex-col align-center gap-12">
                                <div class="flex-row gap-16 align-center justify-center" style="font-size:2rem; font-weight:700; margin:15px 0;">
                                    <div class="fraction-display">
                                        <span class="frac-num">${numA}</span>
                                        <div class="frac-line"></div>
                                        <span class="frac-den">${denA}</span>
                                    </div>
                                    <span>${op}</span>
                                    <div class="fraction-display">
                                        <span class="frac-num">${numB}</span>
                                        <div class="frac-line"></div>
                                        <span class="frac-den">${denB}</span>
                                    </div>
                                    <span>=</span>
                                    <div class="flex-row align-center gap-4">
                                        <input type="number" id="frac-add-whole" class="input-text-terminal" placeholder="whole" style="width:65px; font-size:1.1rem; text-align:center; height:36px;" autocomplete="off">
                                        <div class="fraction-display">
                                            <input type="number" id="frac-add-num" class="input-text-terminal" placeholder="num" style="width:50px; font-size:0.9rem; text-align:center; padding: 2px;" autocomplete="off">
                                            <div class="frac-line" style="margin: 2px 0;"></div>
                                            <input type="number" id="frac-add-den" class="input-text-terminal" placeholder="den" style="width:50px; font-size:0.9rem; text-align:center; padding: 2px;" autocomplete="off">
                                        </div>
                                    </div>
                                </div>
                                <p style="font-size:0.75rem; color:var(--outline); margin-top:2px; text-align:center;">
                                    Enter as a mixed numeral, or write the fraction using the numerator and denominator inputs. Leave the 'whole' input blank for proper fractions.
                                </p>
                            </div>
                        `;
                    },
                    validateFunc: () => {
                        const wholeStr = document.getElementById('frac-add-whole').value.trim();
                        const numStr = document.getElementById('frac-add-num').value.trim();
                        const denStr = document.getElementById('frac-add-den').value.trim();
                        const whole = wholeStr !== "" ? parseInt(wholeStr, 10) : 0;
                        const num = numStr !== "" ? parseInt(numStr, 10) : 0;
                        const den = denStr !== "" ? parseInt(denStr, 10) : 1;
                        if (isNaN(whole) || isNaN(num) || isNaN(den) || den === 0) return false;
                        let userVal = 0;
                        if (wholeStr === "" && numStr === "" && denStr === "") return false;
                        if (wholeStr !== "") userVal += whole;
                        if (numStr !== "") userVal += (num / den);
                        return Math.abs(userVal - correctVal) < 0.001;
                    }
                };
            } else if (chosenType === 'estimation-check') {
                const variant = Math.random() < 0.5 ? 'multiplication' : 'financial';
                let problemText = "";
                let trueVal = 0;
                let proposedVal = 0;
                let estimateText = "";
                let isReasonable = false;

                if (variant === 'multiplication') {
                    const A = Math.floor(Math.random() * 88) + 12;
                    const B = Math.floor(Math.random() * 27) + 3;
                    trueVal = A * B;
                    isReasonable = Math.random() < 0.6;
                    if (isReasonable) {
                        proposedVal = trueVal;
                    } else {
                        const sign = Math.random() < 0.5 ? 1 : -1;
                        const percentOff = 0.3 + Math.random() * 0.2;
                        proposedVal = Math.round(trueVal * (1 + sign * percentOff));
                        if (proposedVal === trueVal) proposedVal += 10;
                    }
                    const rA = Math.round(A / 10) * 10;
                    const rB = Math.round(B / 10) * 10;
                    const est = rA * rB;
                    estimateText = `${A} rounds to ${rA}, and ${B} rounds to ${rB}. ${rA} × ${rB} = ${est}.`;
                    problemText = `A warehouse is packing <strong>${B} boxes</strong>. Each box contains <strong>${A} items</strong>. The packing list shows a total of <strong>${proposedVal} items</strong>.`;
                } else {
                    const N = Math.floor(Math.random() * 10) + 3;
                    const price = Math.floor(Math.random() * 2000) / 100 + 4.50;
                    trueVal = N * price;
                    isReasonable = Math.random() < 0.6;
                    if (isReasonable) {
                        proposedVal = parseFloat(trueVal.toFixed(2));
                    } else {
                        const sign = Math.random() < 0.5 ? 1 : -1;
                        const percentOff = 0.3 + Math.random() * 0.2;
                        proposedVal = parseFloat((trueVal * (1 + sign * percentOff)).toFixed(2));
                        if (proposedVal === trueVal) proposedVal = parseFloat((trueVal + 5).toFixed(2));
                    }
                    const rPrice = Math.round(price);
                    const est = N * rPrice;
                    estimateText = `The price $${price.toFixed(2)} rounds to $${rPrice}. ${N} × $${rPrice} = $${est}.`;
                    problemText = `You are buying <strong>${N} movie tickets</strong>. Each ticket costs <strong>$${price.toFixed(2)}</strong>. The cashier requests a total of <strong>$${proposedVal.toFixed(2)}</strong>.`;
                }
                let selectedChoice = null;

                return {
                    category: 'number',
                    type: 'estimation-check',
                    questionText: `Use estimation to judge if the proposed total is reasonable:`,
                    targetAns: isReasonable ? 'yes' : 'no',
                    hintText: `
                        <p>To check if an answer is reasonable without doing complex math, round the numbers and multiply them.</p>
                        <p style="margin-top:6px;">${estimateText}</p>
                    `,
                    solutionText: `${problemText} Using estimation: ${estimateText} The proposed value of ${proposedVal} is ${isReasonable ? 'close to' : 'very far from'} our estimate, so it is ${isReasonable ? 'REASONABLE' : 'UNREASONABLE'}.`,
                    renderFunc: (container) => {
                        const renderUI = () => {
                            container.innerHTML = `
                                <div class="flex-col align-center gap-12" style="width:100%;">
                                    <div class="lab-instruction-box" style="width:100%; box-sizing:border-box; margin:5px 0; padding:12px; background:var(--surface-container-low); border:1px solid var(--outline-variant); border-radius:4px; font-size:0.95rem;">
                                        ${problemText}
                                    </div>
                                    <div style="font-size:1.1rem; font-weight:600; text-align:center;">
                                        Is the proposed total of <span style="color:var(--primary); font-weight:bold;">${variant === 'financial' ? '$' + proposedVal.toFixed(2) : proposedVal}</span> reasonable?
                                    </div>
                                    <div class="flex-row gap-12 align-center justify-center" style="margin-top:4px; width:100%;">
                                        <button type="button" id="est-reasonable-yes" class="btn ${selectedChoice === 'yes' ? 'btn-primary' : 'btn-secondary'}" style="width:140px; padding:8px 0; ${selectedChoice === 'yes' ? 'background-color:var(--primary); color:white;' : ''}">YES, reasonable</button>
                                        <button type="button" id="est-reasonable-no" class="btn ${selectedChoice === 'no' ? 'btn-primary' : 'btn-secondary'}" style="width:140px; padding:8px 0; ${selectedChoice === 'no' ? 'background-color:var(--primary); color:white;' : ''}">NO, unreasonable</button>
                                    </div>
                                    <div class="flex-col gap-4" style="width:100%; margin-top:8px;">
                                        <label for="est-explanation" style="font-size:0.85rem; font-weight:600; color:var(--outline);">Explain your estimation logic:</label>
                                        <input type="text" id="est-explanation" class="input-text-terminal" placeholder="e.g. Rounded price to $10, 8 tickets x $10 = $80, which is close to..." style="width:100%; box-sizing:border-box;" autocomplete="off">
                                    </div>
                                </div>
                            `;
                            document.getElementById('est-reasonable-yes').addEventListener('click', () => {
                                sounds.click();
                                selectedChoice = 'yes';
                                renderUI();
                            });
                            document.getElementById('est-reasonable-no').addEventListener('click', () => {
                                sounds.click();
                                selectedChoice = 'no';
                                renderUI();
                            });
                        };
                        renderUI();
                    },
                    validateFunc: () => {
                        const explanation = document.getElementById('est-explanation').value.trim();
                        if (!selectedChoice) return false;
                        if (explanation.length < 15) return false;
                        return selectedChoice === (isReasonable ? 'yes' : 'no');
                    }
                };
            } else if (chosenType === 'word-problem') {
                const scenarios = [
                    {
                        generate: () => {
                            const n1 = Math.floor(Math.random() * 4) + 2;
                            const p1 = Math.floor(Math.random() * 5) + 3;
                            const n2 = Math.floor(Math.random() * 3) + 2;
                            const p2 = Math.floor(Math.random() * 8) + 8;
                            const ans = n1 * p1 + n2 * p2;
                            return {
                                text: `Alex bought <strong>${n1} packets of pens</strong> at <strong>$${p1} each</strong>, and <strong>${n2} notebooks</strong> at <strong>$${p2} each</strong>. How much did Alex spend in total?`,
                                prefix: "$",
                                ans: ans,
                                working: `Total spend = (${n1} × $${p1}) + (${n2} × $${p2}) = $${n1 * p1} + $${n2 * p2} = $${ans}.`
                            };
                        }
                    },
                    {
                        generate: () => {
                            const note = 50;
                            const cost = Math.floor(Math.random() * 2000) / 100 + 10;
                            const ans = parseFloat((note - cost).toFixed(2));
                            return {
                                text: `You pay with a <strong>$50 note</strong> for groceries that cost <strong>$${cost.toFixed(2)}</strong>. How much change should you receive?`,
                                prefix: "$",
                                ans: ans,
                                working: `Change = $${note} − $${cost.toFixed(2)} = $${ans.toFixed(2)}.`
                            };
                        }
                    },
                    {
                        generate: () => {
                            const budget = Math.floor(Math.random() * 4) * 20 + 60;
                            const price = Math.floor(Math.random() * 5) + 6;
                            const count = Math.floor(budget / price);
                            const remainder = budget % price;
                            return {
                                text: `You have a budget of <strong>$${budget}</strong>. If movie posters cost <strong>$${price} each</strong>, what is the maximum number of posters you can buy?`,
                                suffix: "posters",
                                ans: count,
                                working: `Number of posters = floor($${budget} ÷ $${price}) = ${count} posters (with $${remainder} left over).`
                            };
                        }
                    },
                    {
                        generate: () => {
                            const total = Math.floor(Math.random() * 150) + 50;
                            const students = Math.random() < 0.5 ? 4 : 5;
                            const ans = parseFloat((total / students).toFixed(2));
                            return {
                                text: `A prize of <strong>$${total}</strong> is shared equally among <strong>${students} students</strong>. How much money does each student receive?`,
                                prefix: "$",
                                ans: ans,
                                working: `Share per student = $${total} ÷ ${students} = $${ans.toFixed(2)}.`
                            };
                        }
                    },
                    {
                        generate: () => {
                            const morning = Math.floor(Math.random() * 3) + 1.5;
                            const afternoon = Math.floor(Math.random() * 2) + 2.5;
                            const days = Math.floor(Math.random() * 4) + 4;
                            const daily = morning + afternoon;
                            const ans = parseFloat((daily * days).toFixed(2));
                            return {
                                text: `Jordan walks <strong>${morning} km</strong> in the morning and <strong>${afternoon} km</strong> in the afternoon. Jordan repeats this route for <strong>${days} days</strong>. What is the total distance Jordan walked?`,
                                suffix: "km",
                                ans: ans,
                                working: `Daily distance = ${morning} + ${afternoon} = ${daily} km. Total distance over ${days} days = ${daily} × ${days} = ${ans} km.`
                            };
                        }
                    },
                    {
                        generate: () => {
                            const guests = Math.floor(Math.random() * 50) + 60;
                            const seatsPerTable = Math.random() < 0.5 ? 6 : 8;
                            const ans = Math.ceil(guests / seatsPerTable);
                            return {
                                text: `You are organising catering for <strong>${guests} guests</strong>. If each table seats exactly <strong>${seatsPerTable} people</strong>, how many tables must you set up so that every guest has a seat?`,
                                suffix: "tables",
                                ans: ans,
                                working: `Exact fraction = ${guests} ÷ ${seatsPerTable} = ${(guests / seatsPerTable).toFixed(2)}. Since you cannot have a fraction of a table, you must round up to the nearest whole table: ${ans} tables.`
                            };
                        }
                    }
                ];
                const chosenScenario = scenarios[Math.floor(Math.random() * scenarios.length)].generate();

                return {
                    category: 'number',
                    type: 'word-problem',
                    questionText: `Solve the word problem:`,
                    targetAns: chosenScenario.ans,
                    hintText: `
                        <p>Read the problem carefully. Determine what arithmetic operations (addition, subtraction, multiplication, or division) are required, and solve step-by-step.</p>
                        <p style="margin-top:6px; font-weight:700;">Always remember to align units and perform decimal rounding carefully.</p>
                    `,
                    solutionText: `${chosenScenario.text} Working: ${chosenScenario.working}`,
                    renderFunc: (container) => {
                        container.innerHTML = `
                            <div class="flex-col align-center gap-12" style="width:100%;">
                                <div class="lab-instruction-box" style="width:100%; box-sizing:border-box; margin:5px 0; padding:12px; background:var(--surface-container-low); border:1px solid var(--outline-variant); border-radius:4px; font-size:0.95rem;">
                                    ${chosenScenario.text}
                                </div>
                                <div class="question-input-group flex-row gap-8 align-center justify-center">
                                    ${chosenScenario.prefix ? `<span style="font-size:1.5rem; font-weight:bold;">${chosenScenario.prefix}</span>` : ''}
                                    <input type="number" step="0.01" id="prac-word-ans" class="input-text-terminal input-number-small" placeholder="?" style="width:120px; font-size:1.5rem; text-align:center;" autocomplete="off">
                                    ${chosenScenario.suffix ? `<span style="font-size:1.2rem; font-weight:600;">${chosenScenario.suffix}</span>` : ''}
                                </div>
                            </div>
                        `;
                    },
                    validateFunc: () => {
                        const val = parseFloat(document.getElementById('prac-word-ans').value.trim());
                        if (isNaN(val)) return false;
                        return Math.abs(val - chosenScenario.ans) <= 0.015;
                    }
                };
            } else if (chosenType === 'divisibility-patterns') {
                const targets = [3, 4, 6, 8, 9];
                const target = targets[Math.floor(Math.random() * targets.length)];
                const correctMultiples = [];
                for (let i = 1; i <= 50; i++) {
                    if (i % target === 0) correctMultiples.push(i);
                }
                let testNum = 0;
                let isDivisible = false;
                let explanationText = "";

                if (target === 3) {
                    testNum = Math.floor(Math.random() * 200) + 301;
                    isDivisible = testNum % 3 === 0;
                    explanationText = `A number is divisible by 3 if the sum of its digits is divisible by 3. Digit sum of ${testNum} is ${testNum.toString().split('').reduce((sum, d) => sum + parseInt(d,10), 0)}, which is ${isDivisible ? '' : 'not '}divisible by 3.`;
                } else if (target === 4) {
                    testNum = Math.floor(Math.random() * 300) + 400;
                    isDivisible = testNum % 4 === 0;
                    const lastTwo = testNum % 100;
                    explanationText = `A number is divisible by 4 if the last two digits are divisible by 4. For ${testNum}, the last two digits are ${lastTwo.toString().padStart(2, '0')}, which is ${isDivisible ? '' : 'not '}divisible by 4.`;
                } else if (target === 6) {
                    testNum = Math.floor(Math.random() * 200) + 200;
                    isDivisible = testNum % 6 === 0;
                    const isEven = testNum % 2 === 0;
                    const digitSum = testNum.toString().split('').reduce((sum, d) => sum + parseInt(d,10), 0);
                    const div3 = digitSum % 3 === 0;
                    explanationText = `A number is divisible by 6 if it is even AND the sum of its digits is divisible by 3. ${testNum} is ${isEven ? 'even' : 'odd'} and digit sum is ${digitSum} (${div3 ? 'divisible' : 'not divisible'} by 3).`;
                } else if (target === 8) {
                    testNum = Math.floor(Math.random() * 100) * 8 + 1000 + (Math.random() < 0.5 ? 2 : 0);
                    isDivisible = testNum % 8 === 0;
                    explanationText = `A number is divisible by 8 if the last three digits are divisible by 8. For ${testNum}, ${testNum % 1000} is ${isDivisible ? '' : 'not '}divisible by 8.`;
                } else {
                    testNum = Math.floor(Math.random() * 500) + 500;
                    isDivisible = testNum % 9 === 0;
                    const digitSum = testNum.toString().split('').reduce((sum, d) => sum + parseInt(d,10), 0);
                    explanationText = `A number is divisible by 9 if the sum of its digits is divisible by 9. The digit sum of ${testNum} is ${digitSum}, which is ${isDivisible ? '' : 'not '}divisible by 9.`;
                }

                const patternsPool = {
                    3: {
                        correct: "The sum of the digits is always a multiple of 3.",
                        wrong: ["All multiples of 3 end in 3, 6, or 9.", "Every multiple of 3 is an odd number."]
                    },
                    4: {
                        correct: "All multiples of 4 are even numbers.",
                        wrong: ["All multiples of 4 end in 4 or 8.", "Every multiple of 4 ends in an even digit sum."]
                    },
                    6: {
                        correct: "Every multiple of 6 is even and divisible by 3.",
                        wrong: ["All multiples of 6 end in 6.", "The digits of multiples of 6 always sum to 6."]
                    },
                    8: {
                        correct: "All multiples of 8 are even numbers.",
                        wrong: ["All multiples of 8 are also multiples of 16.", "Every multiple of 8 ends in 0, 4, or 8."]
                    },
                    9: {
                        correct: "The sum of the digits is always a multiple of 9.",
                        wrong: ["All multiples of 9 end in odd numbers.", "Every multiple of 9 is an odd number."]
                    }
                };

                const correctPattern = patternsPool[target].correct;
                const wrongPatterns = patternsPool[target].wrong;
                const patternOptions = shuffleArray([correctPattern, ...wrongPatterns]);
                let clickedMultiples = [];
                let selectedPattern = null;
                let testDivisibleChoice = null;

                return {
                    category: 'number',
                    type: 'divisibility-patterns',
                    questionText: `Explore divisibility patterns for the number <strong>${target}</strong>:`,
                    targetAns: correctMultiples,
                    hintText: `
                        <p>1. Shading grid: count by ${target}s up to 50: ${target}, ${target*2}, ${target*3}...</p>
                        <p>2. Patterns: Look closely at digit sums or even/odd properties.</p>
                        <p>3. Large number divisibility test: use the divisibility rules (e.g. digit sum for 3 and 9, evenness + digit sum for 6, last 2 digits for 4).</p>
                    `,
                    solutionText: `Multiples of ${target}: ${correctMultiples.join(', ')}. Correct pattern: "${correctPattern}". Divisibility of ${testNum}: ${isDivisible ? 'YES' : 'NO'}. ${explanationText}`,
                    renderFunc: (container) => {
                        const renderUI = () => {
                            let gridHtml = `<div class="number-grid-50">`;
                            for (let i = 1; i <= 50; i++) {
                                const isSelected = clickedMultiples.includes(i);
                                gridHtml += `<div class="outcome-chip ${isSelected ? 'selected' : ''}" data-num="${i}" style="width:auto; height:32px; display:flex; align-items:center; justify-content:center; cursor:pointer; font-weight:bold; font-size:0.85rem; border:1px solid var(--outline-variant); border-radius:4px; ${isSelected ? 'background-color:var(--primary); color:white; border-color:var(--primary);' : 'background-color:var(--surface-container-low);'}">${i}</div>`;
                            }
                            gridHtml += `</div>`;

                            container.innerHTML = `
                                <div class="flex-col gap-12" style="width:100%;">
                                    <p style="font-size:0.9rem; font-weight:600; text-align:center; margin-bottom:4px;">
                                        Step 1: Click to shade all multiples of <strong>${target}</strong> on the grid below:
                                    </p>
                                    ${gridHtml}
                                    <div class="flex-col gap-6" style="margin-top:8px;">
                                        <p style="font-size:0.9rem; font-weight:600;">Step 2: Which pattern is true for all multiples of <strong>${target}</strong>?</p>
                                        <div class="flex-col gap-4">
                                            ${patternOptions.map((opt, idx) => `
                                                <label class="flex-row gap-8 align-center" style="cursor:pointer; font-size:0.85rem; padding: 6px 10px; border: 1px solid var(--outline-variant); border-radius: 4px; background: ${selectedPattern === opt ? 'rgba(0, 62, 199, 0.08)' : 'transparent'};">
                                                    <input type="radio" name="div-pattern" value="${opt}" ${selectedPattern === opt ? 'checked' : ''} style="margin:0;">
                                                    <span>${opt}</span>
                                                </label>
                                            `).join('')}
                                        </div>
                                    </div>
                                    <div class="flex-col gap-6" style="margin-top:8px; border-top:1px dashed var(--outline-variant); padding-top:12px;">
                                        <p style="font-size:0.9rem; font-weight:600;">Step 3: Is <strong>${testNum}</strong> divisible by <strong>${target}</strong>?</p>
                                        <div class="flex-row gap-12 align-center justify-center">
                                            <button type="button" id="div-test-yes" class="btn ${testDivisibleChoice === 'yes' ? 'btn-primary' : 'btn-secondary'}" style="width:100px; padding:6px 0; ${testDivisibleChoice === 'yes' ? 'background-color:var(--primary); color:white;' : ''}">YES</button>
                                            <button type="button" id="div-test-no" class="btn ${testDivisibleChoice === 'no' ? 'btn-primary' : 'btn-secondary'}" style="width:100px; padding:6px 0; ${testDivisibleChoice === 'no' ? 'background-color:var(--primary); color:white;' : ''}">NO</button>
                                        </div>
                                        <div class="flex-col gap-4" style="margin-top:4px;">
                                            <label for="div-explanation" style="font-size:0.8rem; font-weight:600; color:var(--outline);">Explain why using divisibility rules:</label>
                                            <input type="text" id="div-explanation" class="input-text-terminal" placeholder="e.g. Digit sum is 15, which is divisible by 3..." style="width:100%; box-sizing:border-box;" autocomplete="off">
                                        </div>
                                    </div>
                                </div>
                            `;

                            container.querySelectorAll('.number-grid-50 .outcome-chip').forEach(chip => {
                                chip.addEventListener('click', (e) => {
                                    sounds.click();
                                    const num = parseInt(e.currentTarget.getAttribute('data-num'), 10);
                                    if (clickedMultiples.includes(num)) {
                                        clickedMultiples = clickedMultiples.filter(n => n !== num);
                                    } else {
                                        clickedMultiples.push(num);
                                    }
                                    renderUI();
                                });
                            });

                            container.querySelectorAll('input[name="div-pattern"]').forEach(rad => {
                                rad.addEventListener('change', (e) => {
                                    sounds.click();
                                    selectedPattern = e.target.value;
                                    renderUI();
                                });
                            });

                            document.getElementById('div-test-yes').addEventListener('click', () => {
                                sounds.click();
                                testDivisibleChoice = 'yes';
                                renderUI();
                            });
                            document.getElementById('div-test-no').addEventListener('click', () => {
                                sounds.click();
                                testDivisibleChoice = 'no';
                                renderUI();
                            });
                        };
                        renderUI();
                    },
                    validateFunc: () => {
                        const explanation = document.getElementById('div-explanation').value.trim();
                        if (explanation.length < 15) return false;
                        if (!selectedPattern || !testDivisibleChoice) return false;
                        const gridCorrect = correctMultiples.length === clickedMultiples.length &&
                                            correctMultiples.every(val => clickedMultiples.includes(val));
                        const patternCorrect = selectedPattern === correctPattern;
                        const divisibilityCorrect = testDivisibleChoice === (isDivisible ? 'yes' : 'no');
                        return gridCorrect && patternCorrect && divisibilityCorrect;
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
            const subTypes = ['perimeter-area', 'time-conversion', 'unit-selector', 'angle-estimator'];
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
            } else if (chosenType === 'time-conversion') {
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
            } else if (chosenType === 'unit-selector') {
                const scenarios = [
                    { text: "the length of a standard pencil", type: "length", options: ["mm", "cm", "m", "km"], correct: "cm" },
                    { text: "the thickness of a credit card", type: "length", options: ["mm", "cm", "m", "km"], correct: "mm" },
                    { text: "the length of a primary school classroom", type: "length", options: ["mm", "cm", "m", "km"], correct: "m" },
                    { text: "the distance from Sydney to Melbourne", type: "length", options: ["mm", "cm", "m", "km"], correct: "km" },
                    { text: "the mass of a standard metal paperclip", type: "mass", options: ["mg", "g", "kg", "t"], correct: "g" },
                    { text: "the mass of a large watermelon", type: "mass", options: ["mg", "g", "kg", "t"], correct: "kg" },
                    { text: "the mass of a family SUV car", type: "mass", options: ["mg", "g", "kg", "t"], correct: "kg" },
                    { text: "the water capacity of a typical backyard swimming pool", type: "capacity", options: ["mL", "L", "kL", "ML"], correct: "L" },
                    { text: "the volume of medicine in a baby's teaspoon", type: "capacity", options: ["mL", "L", "kL", "ML"], correct: "mL" },
                    { text: "the volume of juice in a standard juice box", type: "capacity", options: ["mL", "L", "kL", "ML"], correct: "mL" }
                ];
                const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
                
                const conversions = [
                    { from: "cm", to: "mm", factor: 10, valRange: [1, 20], dec: 0 },
                    { from: "m", to: "cm", factor: 100, valRange: [1, 10], dec: 1 },
                    { from: "km", to: "m", factor: 1000, valRange: [0.5, 5], dec: 2 },
                    { from: "mm", to: "cm", factor: 0.1, valRange: [5, 150], dec: 0 },
                    { from: "cm", to: "m", factor: 0.01, valRange: [20, 800], dec: 0 },
                    { from: "m", to: "km", factor: 0.001, valRange: [100, 4500], dec: 0 },
                    { from: "kg", to: "g", factor: 1000, valRange: [0.5, 4], dec: 2 },
                    { from: "g", to: "kg", factor: 0.001, valRange: [250, 3500], dec: 0 },
                    { from: "L", to: "mL", factor: 1000, valRange: [0.5, 3.5], dec: 2 },
                    { from: "mL", to: "L", factor: 0.001, valRange: [100, 2500], dec: 0 }
                ];
                
                const conv = conversions[Math.floor(Math.random() * conversions.length)];
                let convVal = 0;
                if (conv.dec === 0) {
                    convVal = Math.floor(Math.random() * (conv.valRange[1] - conv.valRange[0] + 1)) + conv.valRange[0];
                } else if (conv.dec === 1) {
                    convVal = parseFloat((Math.floor(Math.random() * (conv.valRange[1] * 10 - conv.valRange[0] * 10 + 1)) / 10 + conv.valRange[0]).toFixed(1));
                } else {
                    convVal = parseFloat((Math.floor(Math.random() * (conv.valRange[1] * 100 - conv.valRange[0] * 100 + 1)) / 100 + conv.valRange[0]).toFixed(2));
                }
                const convAns = parseFloat((convVal * conv.factor).toFixed(3));
                
                let selectedUnit = null;

                return {
                    category: 'measurement',
                    type: 'unit-selector',
                    questionText: `Choose the appropriate metric unit and solve the metric conversion:`,
                    targetAns: { unit: scenario.correct, value: convAns },
                    hintText: `
                        <p>1. <strong>Unit Selection</strong>: Think about relative sizes. Pencil lengths are in centimetres (cm). Distances between cities are in kilometres (km). Small volumes in millilitres (mL), large volumes in litres (L).</p>
                        <p>2. <strong>Conversion rules</strong>:</p>
                        <ul>
                            <li>cm ➔ mm: multiply by 10</li>
                            <li>m ➔ cm: multiply by 100</li>
                            <li>km ➔ m: multiply by 1000</li>
                            <li>kg ➔ g: multiply by 1000</li>
                            <li>L ➔ mL: multiply by 1000</li>
                            <li>To go the opposite way, divide instead of multiply!</li>
                        </ul>
                    `,
                    solutionText: `The correct unit for ${scenario.text} is ${scenario.correct}. Conversion: ${convVal} ${conv.from} is equal to ${convAns} ${conv.to}.`,
                    renderFunc: (container) => {
                        const renderUI = () => {
                            container.innerHTML = `
                                <div class="flex-col gap-12" style="width:100%;">
                                    <div class="flex-col gap-4">
                                        <p style="font-size:0.9rem; font-weight:600;">Part A: Which metric unit is most appropriate for measuring <strong>${scenario.text}</strong>?</p>
                                        <div class="flex-row gap-8 align-center justify-center" style="flex-wrap:wrap; margin-top:4px;">
                                            ${scenario.options.map(opt => `
                                                <label class="flex-row gap-6 align-center" style="cursor:pointer; font-size:0.9rem; padding: 6px 12px; border: 1px solid var(--outline-variant); border-radius: 4px; background: ${selectedUnit === opt ? 'rgba(0, 62, 199, 0.08)' : 'transparent'};">
                                                    <input type="radio" name="meas-unit" value="${opt}" ${selectedUnit === opt ? 'checked' : ''} style="margin:0;">
                                                    <span>${opt}</span>
                                                </label>
                                            `).join('')}
                                        </div>
                                    </div>
                                    <div class="flex-col gap-4" style="margin-top:10px; border-top:1px dashed var(--outline-variant); padding-top:12px;">
                                        <p style="font-size:0.9rem; font-weight:600; text-align:center;">Part B: Solve the conversion equation:</p>
                                        <div class="flex-row gap-8 align-center justify-center" style="font-size:1.3rem; font-weight:700;">
                                            <span>${convVal} ${conv.from}</span>
                                            <span>=</span>
                                            <input type="number" id="prac-unit-conv" class="input-text-terminal input-number-small" placeholder="?" style="width:110px; font-size:1.2rem; text-align:center;" autocomplete="off">
                                            <span>${conv.to}</span>
                                        </div>
                                    </div>
                                </div>
                            `;

                            container.querySelectorAll('input[name="meas-unit"]').forEach(rad => {
                                rad.addEventListener('change', (e) => {
                                    sounds.click();
                                    selectedUnit = e.target.value;
                                    renderUI();
                                });
                            });
                        };
                        renderUI();
                    },
                    validateFunc: () => {
                        const userVal = parseFloat(document.getElementById('prac-unit-conv').value.trim());
                        if (!selectedUnit || isNaN(userVal)) return false;
                        return selectedUnit === scenario.correct && Math.abs(userVal - convAns) < 0.001;
                    }
                };
            } else if (chosenType === 'angle-estimator') {
                const variant = Math.random() < 0.5 ? 'classify' : 'estimate';
                let theta = 0;
                while (theta === 0 || (theta % 90 < 8) || (theta % 90 > 82)) {
                    theta = Math.floor(Math.random() * 69) * 5 + 15;
                }

                let correctClassification = "";
                if (theta > 0 && theta < 90) correctClassification = "acute";
                else if (theta === 90) correctClassification = "right";
                else if (theta > 90 && theta < 180) correctClassification = "obtuse";
                else if (theta === 180) correctClassification = "straight";
                else if (theta > 180 && theta < 360) correctClassification = "reflex";

                let selectedClass = null;

                // Build multiple-choice options for the 'estimate' variant using standard intervals
                const buildAngleChoices = (correct) => {
                    // Choose offset scheme: standard 15-degree steps or standard 10-degree steps
                    const isFifteen = Math.random() < 0.6;
                    const offsets = isFifteen ? [-30, -15, 15, 30] : [-20, -10, 10, 20];
                    const choices = new Set([correct]);
                    
                    offsets.forEach(offset => {
                        let candidate = correct + offset;
                        candidate = Math.max(10, Math.min(350, candidate));
                        if (candidate !== correct) {
                            choices.add(candidate);
                        }
                    });

                    // If near boundaries (10° or 350°), use the alternate scheme to fill remaining spots
                    const backupOffsets = isFifteen ? [-20, -10, 10, 20] : [-30, -15, 15, 30];
                    let backupIdx = 0;
                    while (choices.size < 4 && backupIdx < backupOffsets.length) {
                        let candidate = correct + backupOffsets[backupIdx];
                        candidate = Math.max(10, Math.min(350, candidate));
                        choices.add(candidate);
                        backupIdx++;
                    }

                    // Fallback to random padding (multiples of 5) if still needed
                    let pad = 5;
                    while (choices.size < 4) {
                        let c1 = Math.max(10, Math.min(350, correct + pad));
                        choices.add(c1);
                        let c2 = Math.max(10, Math.min(350, correct - pad));
                        choices.add(c2);
                        pad += 5;
                    }

                    return shuffleArray([...choices].slice(0, 4));
                };

                const angleChoices = buildAngleChoices(theta);
                let selectedAngleChoice = null;

                return {
                    category: 'measurement',
                    type: 'angle-estimator',
                    questionText: variant === 'classify' ? `Classify the highlighted angle below:` : `Which measurement best estimates the highlighted angle?`,
                    targetAns: variant === 'classify' ? correctClassification : theta,
                    hintText: variant === 'classify' ? `
                        <p>Angle classifications:</p>
                        <ul>
                            <li><strong>Acute</strong>: less than 90°</li>
                            <li><strong>Right</strong>: exactly 90°</li>
                            <li><strong>Obtuse</strong>: between 90° and 180°</li>
                            <li><strong>Straight</strong>: exactly 180°</li>
                            <li><strong>Reflex</strong>: between 180° and 360°</li>
                        </ul>
                    ` : `
                        <p>Use the protractor overlay to judge where the orange arm sits on the degree scale:</p>
                        <div style="max-width:220px; margin: 4px auto;">
                            ${makeAngleSvg(theta, true)}
                        </div>
                    `,
                    solutionText: `The angle is exactly <strong>${theta}°</strong>, which is classified as a <strong>${correctClassification.toUpperCase()}</strong> angle.`,
                    renderFunc: (container) => {
                        const renderUI = () => {
                            if (variant === 'classify') {
                                container.innerHTML = `
                                    <div class="flex-col align-center gap-12" style="width:100%;">
                                        <div style="max-width:260px; width:100%;">
                                            ${makeAngleSvg(theta, false)}
                                        </div>
                                        <div class="flex-col gap-6" style="width:100%;">
                                            <p style="font-size:0.9rem; font-weight:600; text-align:center;">This angle is:</p>
                                            <div class="flex-row gap-6 align-center justify-center" style="flex-wrap:wrap; width:100%;">
                                                ${["acute", "right", "obtuse", "straight", "reflex"].map(c => `
                                                    <label class="flex-row gap-4 align-center" style="cursor:pointer; font-size:0.85rem; padding: 6px 10px; border: 1px solid var(--outline-variant); border-radius: 4px; background: ${selectedClass === c ? 'rgba(0, 62, 199, 0.08)' : 'transparent'};">
                                                        <input type="radio" name="angle-class" value="${c}" ${selectedClass === c ? 'checked' : ''} style="margin:0;">
                                                        <span style="text-transform:capitalize;">${c}</span>
                                                    </label>
                                                `).join('')}
                                            </div>
                                        </div>
                                    </div>
                                `;
                                container.querySelectorAll('input[name="angle-class"]').forEach(rad => {
                                    rad.addEventListener('change', (e) => {
                                        sounds.click();
                                        selectedClass = e.target.value;
                                        renderUI();
                                    });
                                });
                            } else {
                                // Multiple-choice estimate variant
                                container.innerHTML = `
                                    <div class="flex-col align-center gap-12" style="width:100%;">
                                        <div style="max-width:260px; width:100%;">
                                            ${makeAngleSvg(theta, false)}
                                        </div>
                                        <div class="flex-col gap-6" style="width:100%;">
                                            <p style="font-size:0.9rem; font-weight:600; text-align:center;">Choose the best estimate for this angle:</p>
                                            <div class="angle-mc-grid">
                                                ${angleChoices.map((choice, idx) => `
                                                    <label class="angle-mc-option ${selectedAngleChoice === choice ? 'selected' : ''}" id="angle-mc-label-${idx}">
                                                        <input type="radio" name="angle-est-mc" value="${choice}" ${selectedAngleChoice === choice ? 'checked' : ''} style="margin:0; position:absolute; opacity:0; pointer-events:none;">
                                                        <span class="angle-mc-value">${choice}°</span>
                                                    </label>
                                                `).join('')}
                                            </div>
                                        </div>
                                    </div>
                                `;
                                container.querySelectorAll('input[name="angle-est-mc"]').forEach(radio => {
                                    radio.addEventListener('change', (e) => {
                                        sounds.click();
                                        selectedAngleChoice = parseInt(e.target.value, 10);
                                        renderUI();
                                    });
                                });
                                // Also allow clicking the label directly
                                container.querySelectorAll('.angle-mc-option').forEach(label => {
                                    label.addEventListener('click', () => {
                                        const radio = label.querySelector('input[type="radio"]');
                                        if (radio) {
                                            selectedAngleChoice = parseInt(radio.value, 10);
                                            sounds.click();
                                            renderUI();
                                        }
                                    });
                                });
                            }
                        };
                        renderUI();
                    },
                    validateFunc: () => {
                        if (variant === 'classify') {
                            return selectedClass === correctClassification;
                        } else {
                            return selectedAngleChoice === theta;
                        }
                    }
                };
            }
        },

        space: () => {
            const subTypes = ['read-coordinate', 'movement', 'distance', 'net-matcher', 'reflection'];
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
                                    Type the coordinate values manually in the input boxes.
                                </p>
                            </div>
                        `;

                        const inpX = document.getElementById('prac-coord-x');
                        const inpY = document.getElementById('prac-coord-y');

                        const attachGridListeners = () => {
                            // Grid click events disabled to prevent coordinate exposure
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
                                    Type your landing point coordinate values manually.
                                </p>
                            </div>
                        `;

                        const inpX = document.getElementById('prac-coord-x');
                        const inpY = document.getElementById('prac-coord-y');

                        const attachGridListeners = () => {
                            // Grid click events disabled to keep inputs manual
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
            } else if (chosenType === 'distance') {
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
            } else if (chosenType === 'net-matcher') {
                const netData = {
                    'cube': {
                        name: 'Cube',
                        wireframe: `<svg viewBox="0 0 100 100" style="width:70px; height:70px;">
                            <rect x="25" y="35" width="40" height="40" fill="rgba(0, 62, 199, 0.15)" stroke="var(--primary)" stroke-width="1.5" />
                            <rect x="40" y="20" width="40" height="40" fill="transparent" stroke="var(--primary)" stroke-width="1" stroke-dasharray="2 2" />
                            <line x1="25" y1="35" x2="40" y2="20" stroke="var(--primary)" stroke-width="1.5" />
                            <line x1="65" y1="35" x2="80" y2="20" stroke="var(--primary)" stroke-width="1.5" />
                            <line x1="25" y1="75" x2="40" y2="60" stroke="var(--primary)" stroke-width="1" stroke-dasharray="2 2" />
                            <line x1="65" y1="75" x2="80" y2="60" stroke="var(--primary)" stroke-width="1.5" />
                        </svg>`,
                        options: [
                            `<svg viewBox="0 0 100 100"><path class="net-face" d="M 40 10 h 20 v 20 h -20 z M 40 30 h 20 v 20 h -20 z M 40 50 h 20 v 20 h -20 z M 40 70 h 20 v 20 h -20 z M 20 30 h 20 v 20 h -20 z M 60 30 h 20 v 20 h -20 z" /></svg>`,
                            `<svg viewBox="0 0 100 100"><path class="net-face" d="M 20 20 h 20 v 20 h -20 z M 40 20 h 20 v 20 h -20 z M 60 20 h 20 v 20 h -20 z M 20 40 h 20 v 20 h -20 z M 40 40 h 20 v 20 h -20 z M 60 40 h 20 v 20 h -20 z" /></svg>`,
                            `<svg viewBox="0 0 100 100"><path class="net-face" d="M 40 10 h 20 v 20 h -20 z M 40 30 h 20 v 20 h -20 z M 40 50 h 20 v 20 h -20 z M 40 70 h 20 v 20 h -20 z M 20 30 h 20 v 20 h -20 z M 20 50 h 20 v 20 h -20 z" /></svg>`,
                            `<svg viewBox="0 0 100 100"><path class="net-face" d="M 10 40 h 16 v 16 h -16 z M 26 40 h 16 v 16 h -16 z M 42 40 h 16 v 16 h -16 z M 58 40 h 16 v 16 h -16 z M 74 40 h 16 v 16 h -16 z" /></svg>`
                        ],
                        correctIdx: 0,
                        explanation: "A standard cube net consists of 6 square faces. The correct net is the 'T-shape' net, which folds perfectly into a cube."
                    },
                    'rectangular-prism': {
                        name: 'Rectangular Prism',
                        wireframe: `<svg viewBox="0 0 100 100" style="width:70px; height:70px;">
                            <rect x="20" y="40" width="50" height="30" fill="rgba(0, 62, 199, 0.15)" stroke="var(--primary)" stroke-width="1.5" />
                            <rect x="35" y="25" width="50" height="30" fill="transparent" stroke="var(--primary)" stroke-width="1" stroke-dasharray="2 2" />
                            <line x1="20" y1="40" x2="35" y2="25" stroke="var(--primary)" stroke-width="1.5" />
                            <line x1="70" y1="40" x2="85" y2="25" stroke="var(--primary)" stroke-width="1.5" />
                            <line x1="20" y1="70" x2="35" y2="55" stroke="var(--primary)" stroke-width="1" stroke-dasharray="2 2" />
                            <line x1="70" y1="70" x2="85" y2="55" stroke="var(--primary)" stroke-width="1.5" />
                        </svg>`,
                        options: [
                            `<svg viewBox="0 0 100 100"><path class="net-face" d="M 40 10 h 20 v 15 h -20 z M 40 25 h 20 v 25 h -20 z M 40 50 h 20 v 15 h -20 z M 40 65 h 20 v 25 h -20 z M 15 25 h 25 v 25 h -25 z M 60 25 h 25 v 25 h -25 z" /></svg>`,
                            `<svg viewBox="0 0 100 100"><path class="net-face" d="M 40 10 h 20 v 20 h -20 z M 40 30 h 20 v 20 h -20 z M 40 50 h 20 v 20 h -20 z M 40 70 h 20 v 20 h -20 z M 25 30 h 15 v 20 h -15 z M 60 30 h 15 v 15 h -15 z" /></svg>`,
                            `<svg viewBox="0 0 100 100"><path class="net-face" d="M 40 10 h 20 v 15 h -20 z M 40 25 h 20 v 25 h -20 z M 40 50 h 20 v 15 h -20 z M 40 65 h 20 v 25 h -20 z M 15 25 h 25 v 25 h -25 z M 15 50 h 25 v 15 h -25 z" /></svg>`,
                            `<svg viewBox="0 0 100 100"><path class="net-face" d="M 40 10 h 20 v 15 h -20 z M 40 25 h 20 v 25 h -20 z M 40 50 h 20 v 15 h -20 z M 15 25 h 25 v 25 h -25 z M 60 25 h 25 v 25 h -25 z" /></svg>`
                        ],
                        correctIdx: 0,
                        explanation: "A rectangular prism net needs 3 pairs of matching rectangular faces. The correct net arranges them in a T-like shape where opposite faces match in size when folded."
                    },
                    'triangular-prism': {
                        name: 'Triangular Prism',
                        wireframe: `<svg viewBox="0 0 100 100" style="width:70px; height:70px;">
                            <polygon points="30,70 70,70 50,30" fill="rgba(0, 62, 199, 0.15)" stroke="var(--primary)" stroke-width="1.5" />
                            <polygon points="45,55 85,55 65,15" fill="transparent" stroke="var(--primary)" stroke-width="1" stroke-dasharray="2 2" />
                            <line x1="30" y1="70" x2="45" y2="55" stroke="var(--primary)" stroke-width="1" stroke-dasharray="2 2" />
                            <line x1="70" y1="70" x2="85" y2="55" stroke="var(--primary)" stroke-width="1.5" />
                            <line x1="50" y1="30" x2="65" y2="15" stroke="var(--primary)" stroke-width="1.5" />
                        </svg>`,
                        options: [
                            `<svg viewBox="0 0 100 100"><path class="net-face" d="M 35 15 h 30 v 20 h -30 z M 35 35 h 30 v 30 h -30 z M 35 65 h 30 v 20 h -30 z M 35 35 L 15 50 L 35 65 Z M 65 35 L 85 50 L 65 65 Z" /></svg>`,
                            `<svg viewBox="0 0 100 100"><path class="net-face" d="M 35 15 h 30 v 20 h -30 z M 35 35 h 30 v 30 h -30 z M 35 65 h 30 v 20 h -30 z M 35 35 L 15 50 L 35 65 Z M 35 65 L 15 80 L 35 95 Z" /></svg>`,
                            `<svg viewBox="0 0 100 100"><path class="net-face" d="M 35 25 h 30 v 20 h -30 z M 35 45 h 30 v 20 h -30 z M 15 25 h 20 v 20 h -20 z M 65 25 h 20 v 20 h -20 z M 35 65 L 50 85 L 65 65 Z" /></svg>`,
                            `<svg viewBox="0 0 100 100"><path class="net-face" d="M 35 15 h 30 v 25 h -30 z M 35 40 h 30 v 25 h -30 z M 35 40 h -20 v 25 h 20 z M 65 40 L 85 52 L 65 65 Z" /></svg>`
                        ],
                        correctIdx: 0,
                        explanation: "A triangular prism net has 3 rectangular faces and 2 matching triangular bases. The two triangles must fold up from opposite sides to cap the prism."
                    },
                    'square-pyramid': {
                        name: 'Square Pyramid',
                        wireframe: `<svg viewBox="0 0 100 100" style="width:70px; height:70px;">
                            <polygon points="20,70 60,75 75,60 35,55" fill="rgba(0, 62, 199, 0.15)" stroke="var(--primary)" stroke-width="1.5" />
                            <line x1="20" y1="70" x2="48" y2="25" stroke="var(--primary)" stroke-width="1.5" />
                            <line x1="60" y1="75" x2="48" y2="25" stroke="var(--primary)" stroke-width="1.5" />
                            <line x1="75" y1="60" x2="48" y2="25" stroke="var(--primary)" stroke-width="1.5" />
                            <line x1="35" y1="55" x2="48" y2="25" stroke="var(--primary)" stroke-width="1" stroke-dasharray="2 2" />
                        </svg>`,
                        options: [
                            `<svg viewBox="0 0 100 100"><path class="net-face" d="M 35 35 h 30 v 30 h -30 z M 35 35 L 50 10 L 65 35 Z M 65 35 L 90 50 L 65 65 Z M 35 65 L 50 90 L 65 65 Z M 35 35 L 10 50 L 35 65 Z" /></svg>`,
                            `<svg viewBox="0 0 100 100"><path class="net-face" d="M 35 35 L 50 10 L 65 35 Z M 65 35 L 80 60 L 50 60 Z M 50 60 L 20 60 L 35 35 Z M 35 35 L 20 60 L 50 60 Z" /></svg>`,
                            `<svg viewBox="0 0 100 100"><path class="net-face" d="M 35 35 h 30 v 30 h -30 z M 35 35 L 50 10 L 65 35 Z M 65 35 L 90 50 L 65 65 Z M 65 65 L 90 80 L 65 95 Z M 35 35 L 10 50 L 35 65 Z" /></svg>`,
                            `<svg viewBox="0 0 100 100"><path class="net-face" d="M 35 35 h 30 v 30 h -30 z M 35 35 L 50 10 L 65 35 Z M 65 35 L 90 50 L 65 65 Z M 35 35 L 10 50 L 35 65 Z" /></svg>`
                        ],
                        correctIdx: 0,
                        explanation: "A square pyramid has 1 square base and 4 triangular lateral faces. The correct net has the triangles attached to each of the 4 edges of the square base."
                    }
                };

                const shapeKeys = ['cube', 'rectangular-prism', 'triangular-prism', 'square-pyramid'];
                const chosenShapeKey = shapeKeys[Math.floor(Math.random() * shapeKeys.length)];
                const shapeInfo = netData[chosenShapeKey];
                
                const options = shapeInfo.options.map((html, idx) => ({
                    html,
                    isCorrect: idx === shapeInfo.correctIdx
                }));
                const shuffledOptions = shuffleArray(options);
                let selectedIdx = null;

                return {
                    category: 'space',
                    type: 'net-matcher',
                    questionText: `Identify the correct 2D folding net for the 3D <strong>${shapeInfo.name}</strong> wireframe shown:`,
                    targetAns: shapeInfo.name,
                    hintText: `
                        <p>To identify the correct net:</p>
                        <ul>
                            <li>Count the faces: a <strong>Cube</strong> has 6 squares, a <strong>Rectangular Prism</strong> has 6 rectangles, a <strong>Triangular Prism</strong> has 3 rectangles and 2 triangles, a <strong>Square Pyramid</strong> has 1 square and 4 triangles.</li>
                            <li>Check for overlapping faces: opposite faces must not fold onto the same position.</li>
                        </ul>
                    `,
                    solutionText: shapeInfo.explanation,
                    renderFunc: (container) => {
                        const renderUI = () => {
                            container.innerHTML = `
                                <div class="flex-col align-center gap-12" style="width:100%;">
                                    <div style="background:var(--surface-container-low); border:1px solid var(--outline-variant); padding:8px; border-radius:var(--radius-md); display:flex; align-items:center; justify-content:center;">
                                        ${shapeInfo.wireframe}
                                    </div>
                                    <div class="net-options-grid" style="width:100%;">
                                        ${shuffledOptions.map((opt, idx) => `
                                            <div class="net-option ${selectedIdx === idx ? 'selected' : ''}" data-idx="${idx}">
                                                ${opt.html}
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            `;

                            container.querySelectorAll('.net-option').forEach(card => {
                                card.addEventListener('click', (e) => {
                                    sounds.click();
                                    selectedIdx = parseInt(e.currentTarget.getAttribute('data-idx'), 10);
                                    renderUI();
                                });
                            });
                        };
                        renderUI();
                    },
                    validateFunc: () => {
                        if (selectedIdx === null) return false;
                        return shuffledOptions[selectedIdx].isCorrect;
                    }
                };
            } else if (chosenType === 'reflection') {
                const isRotation = Math.random() > 0.5;
                let originalVertices = [];
                let correctVertices = [];
                let description = "";
                let hint = "";
                let solution = "";
                
                if (!isRotation) {
                    const axis = Math.random() < 0.5 ? 'x' : 'y';
                    const value = 5;
                    
                    if (axis === 'x') {
                        const x1 = Math.floor(Math.random() * 2) + 1;
                        const x2 = Math.floor(Math.random() * 2) + 3;
                        const y1 = Math.floor(Math.random() * 3) + 2;
                        const y2 = Math.floor(Math.random() * 3) + 6;
                        originalVertices = [
                            { x: x1, y: y1 },
                            { x: x2, y: y1 },
                            { x: x1, y: y2 }
                        ];
                        correctVertices = originalVertices.map(v => ({
                            x: 10 - v.x,
                            y: v.y
                        }));
                        description = `Reflect the blue triangle across the vertical mirror line <strong>x = 5</strong>. Plot the 3 reflected vertices P₁', P₂', P₃' on the grid:`;
                        hint = `
                            <p>To reflect across a vertical mirror line (x=5):</p>
                            <ul>
                                <li>The vertical distance (y-coordinate) stays the same for each point.</li>
                                <li>The new x-coordinate is mirrored: e.g., if a point is 3 units to the left of the line (x = 2), its reflection will be 3 units to the right of the line (x = 8).</li>
                            </ul>
                        `;
                        solution = `Mirroring across x=5: P₁(${originalVertices[0].x},${originalVertices[0].y}) ➔ P₁'(${correctVertices[0].x},${correctVertices[0].y}), P₂(${originalVertices[1].x},${originalVertices[1].y}) ➔ P₂'(${correctVertices[1].x},${correctVertices[1].y}), P₃(${originalVertices[2].x},${originalVertices[2].y}) ➔ P₃'(${correctVertices[2].x},${correctVertices[2].y}).`;
                    } else {
                        const x1 = Math.floor(Math.random() * 3) + 2;
                        const x2 = Math.floor(Math.random() * 3) + 6;
                        const y1 = Math.floor(Math.random() * 2) + 1;
                        const y2 = Math.floor(Math.random() * 2) + 3;
                        originalVertices = [
                            { x: x1, y: y1 },
                            { x: x2, y: y1 },
                            { x: x1, y: y2 }
                        ];
                        correctVertices = originalVertices.map(v => ({
                            x: v.x,
                            y: 10 - v.y
                        }));
                        description = `Reflect the blue triangle across the horizontal mirror line <strong>y = 5</strong>. Plot the 3 reflected vertices P₁', P₂', P₃' on the grid:`;
                        hint = `
                            <p>To reflect across a horizontal mirror line (y=5):</p>
                            <ul>
                                <li>The horizontal distance (x-coordinate) stays the same for each point.</li>
                                <li>The new y-coordinate is mirrored: e.g., if a point is 4 units below the line (y = 1), its reflection will be 4 units above the line (y = 9).</li>
                            </ul>
                        `;
                        solution = `Mirroring across y=5: P₁(${originalVertices[0].x},${originalVertices[0].y}) ➔ P₁'(${correctVertices[0].x},${correctVertices[0].y}), P₂(${originalVertices[1].x},${originalVertices[1].y}) ➔ P₂'(${correctVertices[1].x},${correctVertices[1].y}), P₃(${originalVertices[2].x},${originalVertices[2].y}) ➔ P₃'(${correctVertices[2].x},${correctVertices[2].y}).`;
                    }
                } else {
                    const cx = 5;
                    const cy = 5;
                    const angles = [90, 180, 270];
                    const angle = angles[Math.floor(Math.random() * angles.length)];
                    const x1 = Math.floor(Math.random() * 2) + 1;
                    const x2 = Math.floor(Math.random() * 2) + 3;
                    const y1 = Math.floor(Math.random() * 2) + 6;
                    const y2 = Math.floor(Math.random() * 2) + 8;
                    originalVertices = [
                        { x: x1, y: y1 },
                        { x: x2, y: y1 },
                        { x: x1, y: y2 }
                    ];

                    if (angle === 90) {
                        correctVertices = originalVertices.map(v => ({
                            x: cx + (v.y - cy),
                            y: cy - (v.x - cx)
                        }));
                        description = `Rotate the blue triangle <strong>90° clockwise</strong> about center point <strong>C(5, 5)</strong>. Plot the 3 rotated vertices on the grid:`;
                        hint = `
                            <p>To rotate a point 90° Clockwise about C(5, 5):</p>
                            <ul>
                                <li>Find the offset from the center: dx = x − 5, dy = y − 5.</li>
                                <li>The new coordinates are: x' = 5 + dy, y' = 5 − dx.</li>
                            </ul>
                        `;
                    } else if (angle === 180) {
                        correctVertices = originalVertices.map(v => ({
                            x: 10 - v.x,
                            y: 10 - v.y
                        }));
                        description = `Rotate the blue triangle <strong>180°</strong> about center point <strong>C(5, 5)</strong>. Plot the 3 rotated vertices on the grid:`;
                        hint = `
                            <p>To rotate a point 180° about C(5, 5):</p>
                            <ul>
                                <li>The coordinates are mirrored through the center: x' = 10 − x, y' = 10 − y.</li>
                            </ul>
                        `;
                    } else {
                        correctVertices = originalVertices.map(v => ({
                            x: cx - (v.y - cy),
                            y: cy + (v.x - cx)
                        }));
                        description = `Rotate the blue triangle <strong>90° counter-clockwise</strong> about center point <strong>C(5, 5)</strong>. Plot the 3 rotated vertices on the grid:`;
                        hint = `
                            <p>To rotate a point 90° Counter-Clockwise about C(5, 5):</p>
                            <ul>
                                <li>Find the offset from the center: dx = x − 5, dy = y − 5.</li>
                                <li>The new coordinates are: x' = 5 − dy, y' = 5 + dx.</li>
                            </ul>
                        `;
                    }
                    solution = `Rotating ${angle === 270 ? '90° CCW' : angle + '°'} about C(5,5): P₁(${originalVertices[0].x},${originalVertices[0].y}) ➔ P₁'(${correctVertices[0].x},${correctVertices[0].y}), P₂(${originalVertices[1].x},${originalVertices[1].y}) ➔ P₂'(${correctVertices[1].x},${correctVertices[1].y}), P₃(${originalVertices[2].x},${originalVertices[2].y}) ➔ P₃'(${correctVertices[2].x},${correctVertices[2].y}).`;
                }

                let studentVertices = [];

                return {
                    category: 'space',
                    type: 'reflection',
                    questionText: description,
                    targetAns: correctVertices,
                    hintText: hint,
                    solutionText: solution,
                    renderFunc: (container) => {
                        const activeAxisValue = 5;
                        const activeAxis = description.includes('x = 5') ? 'x' : 'y';
                        const angleVal = description.includes('180°') ? 180 : (description.includes('clockwise') && !description.includes('counter') ? 90 : 270);

                        const renderGrid = () => {
                            const gridHost = document.getElementById('transformation-grid-host');
                            if (gridHost) {
                                gridHost.innerHTML = makeReflectionGridSvg(
                                    originalVertices,
                                    isRotation ? 'rotation' : 'reflection',
                                    isRotation ? { center: { x: 5, y: 5 }, angle: angleVal } : { axis: activeAxis, value: activeAxisValue },
                                    studentVertices,
                                    correctVertices,
                                    state.attemptsLeft === 0
                                );
                                attachGridListeners();
                                updateTextInputs();
                            }
                        };

                        const updateTextInputs = () => {
                            for (let i = 0; i < 3; i++) {
                                const inpX = document.getElementById(`prac-trans-x-${i}`);
                                const inpY = document.getElementById(`prac-trans-y-${i}`);
                                if (inpX && inpY) {
                                    if (studentVertices[i]) {
                                        inpX.value = studentVertices[i].x;
                                        inpY.value = studentVertices[i].y;
                                    } else {
                                        inpX.value = "";
                                        inpY.value = "";
                                    }
                                }
                            }
                        };

                        container.innerHTML = `
                            <div class="flex-col align-center gap-12">
                                <div class="coordinate-grid-container" id="transformation-grid-host" style="width:280px; height:280px;">
                                    ${makeReflectionGridSvg(
                                        originalVertices,
                                        isRotation ? 'rotation' : 'reflection',
                                        isRotation ? { center: { x: 5, y: 5 }, angle: angleVal } : { axis: activeAxis, value: activeAxisValue },
                                        studentVertices
                                    )}
                                </div>
                                <div class="flex-row gap-8 align-center justify-center flex-wrap" style="width:100%;">
                                    ${[0, 1, 2].map(i => `
                                        <div class="flex-col align-center gap-2" style="border: 1px solid var(--outline-variant); padding: 4px 6px; border-radius: 4px; background: var(--surface-container-low);">
                                            <span style="font-size:0.75rem; font-weight:600; color:var(--primary);">P${i+1}'</span>
                                            <div class="coord-input-pair" style="font-size:0.85rem;">
                                                <span>(</span>
                                                <input type="number" id="prac-trans-x-${i}" class="input-text-terminal" placeholder="x" min="0" max="10" style="width:32px; padding:2px;" autocomplete="off">
                                                <span>,</span>
                                                <input type="number" id="prac-trans-y-${i}" class="input-text-terminal" placeholder="y" min="0" max="10" style="width:32px; padding:2px;" autocomplete="off">
                                                <span>)</span>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                                <p style="font-size:0.75rem; color:var(--outline); margin-top:2px; text-align:center;">
                                    Click 3 points on the grid to plot the vertices, or type coordinates above. Click a plotted point to clear it.
                                </p>
                            </div>
                        `;

                        const attachGridListeners = () => {
                            container.querySelectorAll('#transformation-grid-host .coord-cell').forEach(cell => {
                                cell.addEventListener('click', (e) => {
                                    sounds.click();
                                    const x = parseInt(e.currentTarget.getAttribute('data-x'), 10);
                                    const y = parseInt(e.currentTarget.getAttribute('data-y'), 10);
                                    const existingIdx = studentVertices.findIndex(v => v.x === x && v.y === y);
                                    if (existingIdx !== -1) {
                                        studentVertices.splice(existingIdx, 1);
                                    } else {
                                        if (studentVertices.length < 3) {
                                            studentVertices.push({ x, y });
                                        }
                                    }
                                    renderGrid();
                                });
                            });
                        };

                        const handleTextInp = () => {
                            studentVertices = [];
                            for (let i = 0; i < 3; i++) {
                                const valX = parseInt(document.getElementById(`prac-trans-x-${i}`).value, 10);
                                const valY = parseInt(document.getElementById(`prac-trans-y-${i}`).value, 10);
                                if (!isNaN(valX) && valX >= 0 && valX <= 10 && !isNaN(valY) && valY >= 0 && valY <= 10) {
                                    studentVertices.push({ x: valX, y: valY });
                                }
                            }
                            const gridHost = document.getElementById('transformation-grid-host');
                            if (gridHost) {
                                gridHost.innerHTML = makeReflectionGridSvg(
                                    originalVertices,
                                    isRotation ? 'rotation' : 'reflection',
                                    isRotation ? { center: { x: 5, y: 5 }, angle: angleVal } : { axis: activeAxis, value: activeAxisValue },
                                    studentVertices
                                );
                                attachGridListeners();
                            }
                        };

                        for (let i = 0; i < 3; i++) {
                            document.getElementById(`prac-trans-x-${i}`).addEventListener('input', handleTextInp);
                            document.getElementById(`prac-trans-y-${i}`).addEventListener('input', handleTextInp);
                        }
                        attachGridListeners();
                    },
                    validateFunc: () => {
                        const userPts = [];
                        for (let i = 0; i < 3; i++) {
                            const valX = parseInt(document.getElementById(`prac-trans-x-${i}`).value.trim(), 10);
                            const valY = parseInt(document.getElementById(`prac-trans-y-${i}`).value.trim(), 10);
                            if (!isNaN(valX) && !isNaN(valY)) {
                                userPts.push({ x: valX, y: valY });
                            }
                        }
                        if (userPts.length !== 3) return false;
                        return correctVertices.every(cv => userPts.some(uv => uv.x === cv.x && uv.y === cv.y));
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

            const subTypes = ['read-value', 'max-min', 'biggest-increase', 'data-display', 'investigation-planner'];
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
            } else if (chosenType === 'biggest-increase') {
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
            } else if (chosenType === 'data-display') {
                const topics = [
                    {
                        title: "Favourite Fruit Survey",
                        categories: ["Apples", "Bananas", "Oranges", "Grapes", "Melons"],
                        unit: "students"
                    },
                    {
                        title: "School Travel Methods",
                        categories: ["Walk", "Car", "Bus", "Bicycle", "Train"],
                        unit: "students"
                    },
                    {
                        title: "Favourite Book Genres",
                        categories: ["Adventure", "Sci-Fi", "Comedy", "Fantasy", "Mystery"],
                        unit: "students"
                    },
                    {
                        title: "Common Household Pets",
                        categories: ["Dog", "Cat", "Fish", "Bird", "Rabbit"],
                        unit: "students"
                    },
                    {
                        title: "Favourite Colour Survey",
                        categories: ["Red", "Blue", "Green", "Yellow", "Orange"],
                        unit: "students"
                    }
                ];
                const topic = topics[Math.floor(Math.random() * topics.length)];
                
                let frequencies = [];
                let hasUniqueMode = false;
                let maxIdx = -1;
                while (!hasUniqueMode) {
                    frequencies = [];
                    for (let i = 0; i < topic.categories.length; i++) {
                        frequencies.push(Math.floor(Math.random() * 11) + 2); // 2 to 12
                    }
                    const maxVal = Math.max(...frequencies);
                    const countMax = frequencies.filter(f => f === maxVal).length;
                    if (countMax === 1) {
                        hasUniqueMode = true;
                        maxIdx = frequencies.indexOf(maxVal);
                    }
                }
                const totalStudents = frequencies.reduce((a, b) => a + b, 0);
                const modeCategory = topic.categories[maxIdx];
                
                const variants = ['find-mode', 'difference', 'fraction'];
                const variant = variants[Math.floor(Math.random() * variants.length)];
                
                let questionText = "";
                let targetAns = null;
                let hintText = "";
                let solutionText = "";
                let renderFunc = null;
                let validateFunc = null;

                if (variant === 'find-mode') {
                    questionText = `Identify the mode (most common category) from the bar chart:`;
                    targetAns = modeCategory;
                    hintText = `
                        <p>The **mode** is the category with the highest frequency.</p>
                        <ul>
                            <li>Look for the tallest bar in the chart.</li>
                            <li>Find the label below that tallest bar.</li>
                        </ul>
                    `;
                    solutionText = `The tallest bar in the chart is for the category **${modeCategory}** with a frequency of ${frequencies[maxIdx]}. Therefore, the mode is ${modeCategory}.`;
                    
                    renderFunc = (container) => {
                        container.innerHTML = `
                            <div class="flex-col align-center gap-12" style="width:100%;">
                                <p style="text-align:center;">Based on the chart below, what is the <strong>mode</strong> (most popular category)?</p>
                                <div style="width:100%; max-width:400px; height:240px; margin:0 auto;">
                                    ${makeBarChartSvg(topic.categories, frequencies, topic.title)}
                                </div>
                                <div class="question-input-group flex-row gap-8 align-center justify-center" style="margin-top:8px;">
                                    <span style="font-size:0.9rem; font-weight:600;">Mode:</span>
                                    <select id="prac-chart-mode" class="input-text-terminal" style="width:130px;">
                                        <option value="">-</option>
                                        ${topic.categories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
                                    </select>
                                </div>
                            </div>
                        `;
                    };
                    validateFunc = () => {
                        const val = document.getElementById('prac-chart-mode').value;
                        return val === modeCategory;
                    };
                } else if (variant === 'difference') {
                    const idxA = Math.floor(Math.random() * topic.categories.length);
                    let idxB = Math.floor(Math.random() * topic.categories.length);
                    while (idxA === idxB) {
                        idxB = Math.floor(Math.random() * topic.categories.length);
                    }
                    const catA = topic.categories[idxA];
                    const catB = topic.categories[idxB];
                    const diff = Math.abs(frequencies[idxA] - frequencies[idxB]);
                    
                    questionText = `Calculate differences between data categories:`;
                    targetAns = diff;
                    hintText = `
                        <p>To find the difference between two categories:</p>
                        <ul>
                            <li>Read the value for <strong>${catA}</strong> (labeled at the top of its bar).</li>
                            <li>Read the value for <strong>${catB}</strong>.</li>
                            <li>Subtract the smaller value from the larger one: <strong>|${frequencies[idxA]} − ${frequencies[idxB]}|</strong>.</li>
                        </ul>
                    `;
                    solutionText = `The frequency for ${catA} is ${frequencies[idxA]} and for ${catB} is ${frequencies[idxB]}. The difference is ${frequencies[idxA]} − ${frequencies[idxB]} = ${diff} ${topic.unit}.`;
                    
                    renderFunc = (container) => {
                        container.innerHTML = `
                            <div class="flex-col align-center gap-12" style="width:100%;">
                                <p style="text-align:center;">How many more ${topic.unit} preferred <strong>${frequencies[idxA] >= frequencies[idxB] ? catA : catB}</strong> than <strong>${frequencies[idxA] >= frequencies[idxB] ? catB : catA}</strong>?</p>
                                <div style="width:100%; max-width:400px; height:240px; margin:0 auto;">
                                    ${makeBarChartSvg(topic.categories, frequencies, topic.title)}
                                </div>
                                <div class="question-input-group flex-row gap-8 align-center justify-center" style="margin-top:8px;">
                                    <input type="number" id="prac-chart-diff" class="input-text-terminal input-number-small" placeholder="?" style="width:100px; text-align:center;" autocomplete="off">
                                    <span style="font-size:0.9rem;">${topic.unit}</span>
                                </div>
                            </div>
                        `;
                    };
                    validateFunc = () => {
                        const val = parseInt(document.getElementById('prac-chart-diff').value.trim(), 10);
                        return val === diff;
                    };
                } else {
                    const idx = Math.floor(Math.random() * topic.categories.length);
                    const cat = topic.categories[idx];
                    const count = frequencies[idx];
                    const fractionDecimal = count / totalStudents;
                    
                    questionText = `Express data categories as fractional parts:`;
                    targetAns = fractionDecimal;
                    hintText = `
                        <p>To write the fraction of students who chose ${cat}:</p>
                        <ul>
                            <li>Find the number of students who chose <strong>${cat}</strong> (${count}).</li>
                            <li>Find the total number of students in the survey: <strong>${frequencies.join(' + ')} = ${totalStudents}</strong>.</li>
                            <li>Write the fraction as: <strong>${count}/${totalStudents}</strong> (or simplify it if possible).</li>
                        </ul>
                    `;
                    solutionText = `The number of students for ${cat} is ${count}. The total number of students is ${totalStudents}. The fraction is **${count}/${totalStudents}** (equivalent to ${(count/totalStudents).toFixed(3)}).`;
                    
                    renderFunc = (container) => {
                        container.innerHTML = `
                            <div class="flex-col align-center gap-12" style="width:100%;">
                                <p style="text-align:center;">What fraction of the total group of ${totalStudents} students chose <strong>${cat}</strong>? Express as a fraction (e.g. 5/30):</p>
                                <div style="width:100%; max-width:400px; height:240px; margin:0 auto;">
                                    ${makeBarChartSvg(topic.categories, frequencies, topic.title)}
                                </div>
                                <div class="question-input-group flex-row gap-8 align-center justify-center" style="margin-top:8px;">
                                    <input type="text" id="prac-chart-frac" class="input-text-terminal text-center" placeholder="e.g. 5/30" style="width:120px;" autocomplete="off">
                                </div>
                            </div>
                        `;
                    };
                    validateFunc = () => {
                        const val = document.getElementById('prac-chart-frac').value.trim();
                        const userVal = parseFraction(val);
                        return userVal !== null && Math.abs(userVal - fractionDecimal) < 0.001;
                    };
                }

                return {
                    category: 'statistics',
                    type: 'data-display',
                    questionText,
                    targetAns,
                    hintText,
                    solutionText,
                    renderFunc,
                    validateFunc
                };
            } else if (chosenType === 'investigation-planner') {
                const scenarios = [
                    {
                        text: "You want to find the most popular sport among Year 5 students to decide what equipment to buy for the school.",
                        q1Opts: [
                            "The favourite sport preferences of each Year 5 student",
                            "The weight of school sports equipment in kilograms",
                            "The temperature of the school oval in degrees Celsius",
                            "The height of Year 5 students in centimetres"
                        ],
                        q1Ans: 0,
                        q2Opts: [
                            "Conduct a survey/questionnaire asking each student their favourite sport",
                            "Measure the heights of students with a tape measure",
                            "Roll a six-sided die multiple times"
                        ],
                        q2Ans: 0,
                        q3Opts: [
                            "Bar chart (to compare counts of discrete sport categories)",
                            "Line graph (to show change over time)",
                            "Scatter plot (to look for numerical correlation)"
                        ],
                        q3Ans: 0,
                        explanation: "Since 'favourite sport' is categorical data, you collect sport categories via a survey. The best graph to compare categorical counts is a bar chart."
                    },
                    {
                        text: "You want to investigate how the temperature of the school canteen changes over a 24-hour cycle during winter.",
                        q1Opts: [
                            "The temperature in degrees Celsius at hourly intervals",
                            "The number of lunch orders placed at the canteen",
                            "The names of students buying lunch each hour",
                            "The price of canteen items in dollars"
                        ],
                        q1Ans: 0,
                        q2Opts: [
                            "Record hourly temperature readings using a digital thermometer",
                            "Ask students how warm they felt on a scale of 1 to 10",
                            "Tally the number of pies sold each hour"
                        ],
                        q2Ans: 0,
                        q3Opts: [
                            "Line graph (best for showing trends and changes over continuous time)",
                            "Bar chart (to compare unrelated categories)",
                            "Pie chart (to show parts of a whole)"
                        ],
                        q3Ans: 0,
                        explanation: "Temperature changes over time represent continuous numerical data. You measure it with a thermometer and display the trend over time on a line graph."
                    },
                    {
                        text: "You want to determine the most common type of pet owned by students in your class to write a newsletter article.",
                        q1Opts: [
                            "The types of pets owned (e.g. Dog, Cat, Fish, None)",
                            "The total cost of feeding pets each week",
                            "The age of students' pets in years",
                            "The speed of students' dogs in kilometres per hour"
                        ],
                        q1Ans: 0,
                        q2Opts: [
                            "Conduct a quick hands-up survey or questionnaire in class",
                            "Measure the weight of pets in grams",
                            "Look up global animal statistics on the internet"
                        ],
                        q2Ans: 0,
                        q3Opts: [
                            "Bar chart (to compare the counts of each pet category)",
                            "Line graph (to show a trend over time)",
                            "Time table (to plan feeding schedules)"
                        ],
                        q3Ans: 0,
                        explanation: "Pet type is categorical data. You collect this using a class survey and compare the frequencies of different pet groups on a bar chart."
                    },
                    {
                        text: "You want to track the growth of a bean plant measured weekly in centimetres over a 2-month science project.",
                        q1Opts: [
                            "The height of the plant in centimetres at weekly intervals",
                            "The number of leaves on the plant",
                            "The amount of water in millilitres poured on the plant",
                            "The name of the soil brand used"
                        ],
                        q1Ans: 0,
                        q2Opts: [
                            "Measure the height of the plant with a ruler once a week",
                            "Count how many seeds are in the packet",
                            "Survey classmates about their favourite plants"
                        ],
                        q2Ans: 0,
                        q3Opts: [
                            "Line graph (to show the continuous growth trend over time)",
                            "Bar chart (to show counts of distinct plant types)",
                            "Pie chart (to show proportions of soil ingredients)"
                        ],
                        q3Ans: 0,
                        explanation: "Plant height is numerical data that changes over time. You measure it with a ruler and show the growth progress over the weeks using a line graph."
                    }
                ];

                const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];

                return {
                    category: 'statistics',
                    type: 'investigation-planner',
                    questionText: `Plan a statistical investigation and choose appropriate representations:`,
                    targetAns: { q1: scenario.q1Ans, q2: scenario.q2Ans, q3: scenario.q3Ans },
                    hintText: `
                        <p>Think about the nature of the data:</p>
                        <ul>
                            <li><strong>Categorical data</strong> (like sports, colours, pets) is grouped into words. Use a <strong>bar chart</strong>.</li>
                            <li><strong>Numerical data over time</strong> (like temperature hourly, height weekly) shows a trend. Use a <strong>line graph</strong>.</li>
                            <li><strong>Surveys</strong> are good for opinions/preferences, while <strong>measurement tools</strong> (ruler, thermometer) are for physical values.</li>
                        </ul>
                    `,
                    solutionText: scenario.explanation,
                    renderFunc: (container) => {
                        container.innerHTML = `
                            <div class="flex-col gap-12 align-stretch" style="width:100%; text-align:left;">
                                <div class="lab-instruction-box" style="margin: 0; padding: 10px; font-size: 0.9rem; line-height: 1.4; border-left: 3px solid var(--primary);">
                                    <strong>Scenario:</strong> ${scenario.text}
                                </div>
                                
                                <div class="flex-col gap-8">
                                    <p style="font-weight:600; font-size:0.85rem; margin: 4px 0 2px;">1. What specific data variable should you collect?</p>
                                    <div class="probability-options" id="prac-ip-q1">
                                        ${scenario.q1Opts.map((opt, idx) => `
                                            <label style="padding: 6px 10px; font-size: 0.8rem;">
                                                <input type="radio" name="ip-q1" value="${idx}">
                                                <span>${opt}</span>
                                            </label>
                                        `).join('')}
                                    </div>
                                </div>

                                <div class="flex-col gap-8">
                                    <p style="font-weight:600; font-size:0.85rem; margin: 4px 0 2px;">2. How should you collect this data?</p>
                                    <div class="probability-options" id="prac-ip-q2">
                                        ${scenario.q2Opts.map((opt, idx) => `
                                            <label style="padding: 6px 10px; font-size: 0.8rem;">
                                                <input type="radio" name="ip-q2" value="${idx}">
                                                <span>${opt}</span>
                                            </label>
                                        `).join('')}
                                    </div>
                                </div>

                                <div class="flex-col gap-8">
                                    <p style="font-weight:600; font-size:0.85rem; margin: 4px 0 2px;">3. Which display representation is best suited to present the final findings?</p>
                                    <div class="probability-options" id="prac-ip-q3">
                                        ${scenario.q3Opts.map((opt, idx) => `
                                            <label style="padding: 6px 10px; font-size: 0.8rem;">
                                                <input type="radio" name="ip-q3" value="${idx}">
                                                <span>${opt}</span>
                                            </label>
                                        `).join('')}
                                    </div>
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
                        const checked1 = container.querySelector('input[name="ip-q1"]:checked');
                        const checked2 = container.querySelector('input[name="ip-q2"]:checked');
                        const checked3 = container.querySelector('input[name="ip-q3"]:checked');
                        
                        if (!checked1 || !checked2 || !checked3) return false;
                        
                        return parseInt(checked1.value, 10) === scenario.q1Ans &&
                               parseInt(checked2.value, 10) === scenario.q2Ans &&
                               parseInt(checked3.value, 10) === scenario.q3Ans;
                    }
                };
            }
        },

        probability: () => {
            const subTypes = ['die-outcomes', 'marble-likelihood', 'chance-fraction', 'chance-experiment'];
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
            } else if (chosenType === 'chance-fraction') {
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
            } else if (chosenType === 'chance-experiment') {
                const isCoin = Math.random() > 0.5;
                const outcomes = isCoin ? ['Heads', 'Tails'] : ['1', '2', '3', '4', '5', '6'];
                const targetOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
                
                let simulationRun = false;
                let frequencies = {};
                outcomes.forEach(out => frequencies[out] = 0);
                
                const theoreticalProb = isCoin ? 0.5 : 1 / 6;
                const theoreticalProbText = isCoin ? "1/2" : "1/6";

                return {
                    category: 'probability',
                    type: 'chance-experiment',
                    questionText: `Conduct a chance simulation experiment and analyze results:`,
                    targetAns: targetOutcome,
                    hintText: `
                        <p>To analyze the chance experiment results:</p>
                        <ul>
                            <li>The <strong>experimental probability</strong> is the count of success trials divided by total trials (20): <strong>frequency / 20</strong>.</li>
                            <li>The <strong>theoretical probability</strong> is what we expect to happen mathematically: <strong>1/2</strong> for a coin or <strong>1/6</strong> for a die.</li>
                            <li>Experimental results can differ from theoretical expectations due to short-term random chance.</li>
                        </ul>
                    `,
                    solutionText: "", 
                    renderFunc: (container) => {
                        const getSolutionText = () => {
                            const targetFreq = frequencies[targetOutcome] || 0;
                            return `The target outcome **${targetOutcome}** appeared **${targetFreq}** times out of 20 trials. Experimental probability: **${targetFreq}/20**. Theoretical probability: **${theoreticalProbText}**. They are typically different due to random fluctuations in small sample sizes.`;
                        };
                        
                        state.currentQuestion.solutionText = getSolutionText();

                        const renderTallyBars = () => {
                            const tallyHost = document.getElementById('prac-tally-grid');
                            if (!tallyHost) return;
                            tallyHost.innerHTML = outcomes.map(out => {
                                const freq = frequencies[out] || 0;
                                const height = Math.max(4, freq * 8); 
                                return `
                                    <div class="tally-bar-wrapper">
                                        <span class="tally-count">${freq}</span>
                                        <div class="tally-bar" style="height:${height}px;"></div>
                                        <span class="tally-label">${out}</span>
                                    </div>
                                `;
                            }).join('');
                        };

                        const unlockUI = () => {
                            const inpExp = document.getElementById('prac-exp-prob');
                            const inpTheo = document.getElementById('prac-theo-prob');
                            const compRadios = document.getElementsByName('prob-comp');
                            const radioLabels = document.querySelectorAll('#prac-comp-options label');
                            
                            if (inpExp) inpExp.disabled = false;
                            if (inpTheo) inpTheo.disabled = false;
                            compRadios.forEach(rad => rad.disabled = false);
                            radioLabels.forEach(lbl => {
                                lbl.style.pointerEvents = 'auto';
                                lbl.style.opacity = '1';
                            });

                            const parentSubmit = document.getElementById('btn-prac-submit');
                            if (parentSubmit) {
                                parentSubmit.disabled = false;
                                parentSubmit.style.opacity = '1';
                                parentSubmit.style.pointerEvents = 'auto';
                            }
                        };

                        const buildHTML = () => {
                            container.innerHTML = `
                                <div class="flex-col align-center gap-12" style="width:100%;">
                                    <p style="text-align:center;">
                                        We will run a simulated trial of 20 ${isCoin ? 'coin flips' : 'rolls of a fair 6-sided die'}. 
                                        Click <strong>Simulate</strong> below to conduct the experiment.
                                    </p>
                                    
                                    <div class="flex-col align-center" style="margin-bottom:8px;">
                                        <div id="prac-experiment-icon" class="${isCoin ? 'coin-icon' : 'die-icon'}">?</div>
                                        ${!simulationRun ? `
                                            <button id="btn-run-simulation" class="btn-primary" style="margin:4px auto 0;">Simulate 20 Trials</button>
                                        ` : ''}
                                    </div>

                                    <div class="experiment-tally" id="prac-tally-grid" style="width:100%; max-width:320px;">
                                        <!-- Tally bars will render here -->
                                    </div>

                                    <div class="flex-col gap-12 align-stretch" style="width:100%; max-width:360px; margin-top:8px;">
                                        <div class="flex-row justify-between align-center">
                                            <span style="font-size:0.85rem; font-weight:600;">Experimental probability of <strong>${targetOutcome}</strong>:</span>
                                            <input type="text" id="prac-exp-prob" class="input-text-terminal text-center" placeholder="e.g. 9/20" style="width:100px;" ${!simulationRun ? 'disabled' : ''} autocomplete="off">
                                        </div>
                                        
                                        <div class="flex-row justify-between align-center">
                                            <span style="font-size:0.85rem; font-weight:600;">Theoretical probability of <strong>${targetOutcome}</strong>:</span>
                                            <input type="text" id="prac-theo-prob" class="input-text-terminal text-center" placeholder="e.g. 1/2" style="width:100px;" ${!simulationRun ? 'disabled' : ''} autocomplete="off">
                                        </div>

                                        <div class="flex-col gap-6" style="margin-top:4px;">
                                            <span style="font-size:0.85rem; font-weight:600; text-align:center;">Did the experimental and theoretical probabilities match?</span>
                                            <div class="probability-options flex-row gap-8 justify-center" id="prac-comp-options" style="flex-direction:row;">
                                                <label style="padding: 6px 12px; ${!simulationRun ? 'pointer-events: none; opacity: 0.5;' : ''}">
                                                    <input type="radio" name="prob-comp" value="yes" ${!simulationRun ? 'disabled' : ''}>
                                                    <span>Yes</span>
                                                </label>
                                                <label style="padding: 6px 12px; ${!simulationRun ? 'pointer-events: none; opacity: 0.5;' : ''}">
                                                    <input type="radio" name="prob-comp" value="no" ${!simulationRun ? 'disabled' : ''}>
                                                    <span>No</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `;

                            renderTallyBars();

                            if (!simulationRun) {
                                const parentSubmit = document.getElementById('btn-prac-submit');
                                if (parentSubmit) {
                                    parentSubmit.disabled = true;
                                    parentSubmit.style.opacity = '0.5';
                                    parentSubmit.style.pointerEvents = 'none';
                                }

                                const simBtn = document.getElementById('btn-run-simulation');
                                if (simBtn) {
                                    simBtn.addEventListener('click', () => {
                                        sounds.click();
                                        simBtn.disabled = true;
                                        simBtn.style.opacity = '0.5';
                                        
                                        const icon = document.getElementById('prac-experiment-icon');
                                        icon.classList.add(isCoin ? 'flipping' : 'rolling');
                                        
                                        let step = 0;
                                        state.activeInterval = setInterval(() => {
                                            sounds.click();
                                            const spinVal = outcomes[Math.floor(Math.random() * outcomes.length)];
                                            icon.textContent = isCoin ? (spinVal === 'Heads' ? 'H' : 'T') : spinVal;
                                            
                                            const stepVal = outcomes[Math.floor(Math.random() * outcomes.length)];
                                            frequencies[stepVal]++;
                                            renderTallyBars();
                                            
                                            step++;
                                            if (step >= 20) {
                                                clearInterval(state.activeInterval);
                                                state.activeInterval = null;
                                                icon.classList.remove(isCoin ? 'flipping' : 'rolling');
                                                icon.textContent = isCoin ? (stepVal === 'Heads' ? 'H' : 'T') : stepVal;
                                                simulationRun = true;
                                                simBtn.style.display = 'none';
                                                unlockUI();
                                            }
                                        }, 100);
                                    });
                                }
                            }

                            container.querySelectorAll('#prac-comp-options label').forEach(lbl => {
                                lbl.addEventListener('click', () => {
                                    sounds.click();
                                });
                            });
                        };

                        buildHTML();
                    },
                    validateFunc: () => {
                        if (!simulationRun) return false;
                        
                        const expVal = document.getElementById('prac-exp-prob').value.trim();
                        const theoVal = document.getElementById('prac-theo-prob').value.trim();
                        const checkedComp = container.querySelector('input[name="prob-comp"]:checked');
                        
                        const userExp = parseFraction(expVal);
                        const userTheo = parseFraction(theoVal);
                        
                        if (userExp === null || userTheo === null || !checkedComp) return false;
                        
                        const expectedExp = (frequencies[targetOutcome] || 0) / 20;
                        const correctComp = (Math.abs(expectedExp - theoreticalProb) < 0.001) ? "yes" : "no";
                        
                        return Math.abs(userExp - expectedExp) < 0.001 &&
                               Math.abs(userTheo - theoreticalProb) < 0.001 &&
                               checkedComp.value === correctComp;
                    }
                };
            }
        }
    };

    // Load active sandbox question
    function loadNextPracticeQuestion() {
        if (state.activeInterval) {
            clearInterval(state.activeInterval);
            state.activeInterval = null;
        }
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
        btnPracSubmit.disabled = false;
        btnPracSubmit.style.opacity = '1';
        btnPracSubmit.style.pointerEvents = 'auto';
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
