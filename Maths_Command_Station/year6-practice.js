/**
 * Joshua Math Practice Console - State & Logic Engine (Year 6)
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
        scoresByDescriptor: {},
        solvedContexts: {},
        consecutiveCorrect: {},
        scoresByCatY6: {
            number: 0,
            algebra: 0,
            measurement: 0,
            space: 0,
            statistics: 0,
            probability: 0
        },
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
    profile.scoresByCat = profile.scoresByCatY6; // Reference Year 6 in Practice Console

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

    function recalculateCategoryScores() {
        const activeYears = [3, 4, 5, 6];
        const strands = ['number', 'algebra', 'measurement', 'space', 'statistics', 'probability'];
        
        activeYears.forEach(yr => {
            const strandKey = `scoresByCatY${yr}`;
            if (!profile[strandKey]) {
                profile[strandKey] = { number: 0, algebra: 0, measurement: 0, space: 0, statistics: 0, probability: 0 };
            }
            strands.forEach(strand => {
                const descriptors = Object.keys(DESCRIPTOR_BADGES).filter(key => {
                    const desc = DESCRIPTOR_BADGES[key];
                    return desc.year === yr && desc.strand === strand;
                });
                
                let sum = 0;
                descriptors.forEach(descKey => {
                    const code = DESCRIPTOR_BADGES[descKey].code;
                    sum += (profile.scoresByDescriptor[code] || 0);
                });
                
                profile[strandKey][strand] = sum;
            });
        });
        
        profile.scoresByCat = profile.scoresByCatY6; 
    }

    function loadProfile() {
        const stored = localStorage.getItem('joshua_math_profile');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (parsed.scoresByCat && !parsed.scoresByCatY6) {
                    parsed.scoresByCatY6 = parsed.scoresByCat;
                }
                Object.assign(profile, parsed);
            } catch (e) {
                console.error("Failed to parse stored profile", e);
            }
        }

        if (!profile.scoresByDescriptor) profile.scoresByDescriptor = {};
        if (!profile.solvedContexts) profile.solvedContexts = {};
        if (!profile.consecutiveCorrect) profile.consecutiveCorrect = {};

        // Guarantee all descriptors in config have values
        Object.keys(DESCRIPTOR_BADGES).forEach(key => {
            const code = DESCRIPTOR_BADGES[key].code;
            if (profile.scoresByDescriptor[code] === undefined) profile.scoresByDescriptor[code] = 0;
            if (profile.solvedContexts[code] === undefined) profile.solvedContexts[code] = [];
            if (profile.consecutiveCorrect[code] === undefined) profile.consecutiveCorrect[code] = 0;
        });

        if (!profile.scoresByCatY6) {
            profile.scoresByCatY6 = { number: 0, algebra: 0, measurement: 0, space: 0, statistics: 0, probability: 0 };
        }
        if (!profile.scoresByCatY5) {
            profile.scoresByCatY5 = { number: 0, algebra: 0, measurement: 0, space: 0, statistics: 0, probability: 0 };
        }
        if (!profile.scoresByCatY4) {
            profile.scoresByCatY4 = { number: 0, algebra: 0, measurement: 0, space: 0, statistics: 0, probability: 0 };
        }
        if (!profile.scoresByCatY3) {
            profile.scoresByCatY3 = { number: 0, algebra: 0, measurement: 0, space: 0, statistics: 0, probability: 0 };
        }
        
        recalculateCategoryScores();

        elNameEdit.value = profile.name;
        elAvatar.textContent = (profile.name[0] || 'E').toUpperCase();
        elScore.textContent = `${profile.score} PTS`;
        elStreak.textContent = profile.streak;
        
        const cur = calculateLevelAndRank(profile.score);
        profile.level = cur.level;
        profile.rank = cur.rank;
        elRank.textContent = profile.rank;
        elLevel.textContent = `Level ${profile.level}`;

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

        renderBadgeShelf();
    }

    function saveProfile() {
        localStorage.setItem('joshua_math_profile', JSON.stringify(profile));
    }

    // ----------------------------------------------------
    // Confetti Ceremony Overlay (Grand Mastery Award)
    // ----------------------------------------------------
    function triggerConfettiCeremony(name, emoji) {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        overlay.style.zIndex = '9999';
        overlay.style.display = 'flex';
        overlay.style.flexDirection = 'column';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.color = 'white';
        overlay.style.fontFamily = "'Space Grotesk', sans-serif";
        overlay.id = 'confetti-ceremony-root';
        
        overlay.innerHTML = `
            <canvas id="confetti-canvas" style="position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none;"></canvas>
            <div style="z-index: 10000; text-align:center; animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;">
                <div style="font-size: 6rem; margin-bottom: 20px; filter: drop-shadow(0 0 20px rgba(255,215,0,0.6));">${emoji}</div>
                <div style="font-size: 1.5rem; text-transform:uppercase; letter-spacing: 4px; color: #ffd700; font-weight:700;">Strand Mastery Unlocked!</div>
                <div style="font-size: 3rem; font-weight:800; margin: 10px 0 30px 0; text-shadow: 0 4px 15px rgba(0,0,0,0.5);">${name}</div>
                <button class="cert-btn cert-btn-print" id="btn-close-ceremony" style="padding: 12px 30px; font-size:1rem; border:none; background:#ffd700; color:black; font-weight:700; cursor:pointer; border-radius:8px;">CONTINUE MISSION</button>
            </div>
            <style>
                @keyframes popIn {
                    0% { transform: scale(0.5); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
            </style>
        `;
        document.body.appendChild(overlay);
        
        const canvas = document.getElementById('confetti-canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const colors = ['#059669', '#10b981', '#ffd700', '#003ec7', '#b45309', '#ba1a1a'];
        const particles = [];
        for (let i = 0; i < 150; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                r: Math.random() * 6 + 4,
                d: Math.random() * canvas.height,
                color: colors[Math.floor(Math.random() * colors.length)],
                tilt: Math.random() * 10 - 5,
                tiltAngleIncremental: Math.random() * 0.07 + 0.02,
                tiltAngle: 0
            });
        }
        
        let animationFrameId;
        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p, idx) => {
                p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
                p.x += Math.sin(p.tiltAngle);
                p.tiltAngle += p.tiltAngleIncremental;
                
                ctx.beginPath();
                ctx.lineWidth = p.r;
                ctx.strokeStyle = p.color;
                ctx.moveTo(p.x + p.r + p.tilt / 2, p.y);
                ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
                ctx.stroke();
                
                if (p.y > canvas.height) {
                    particles[idx] = {
                        x: Math.random() * canvas.width,
                        y: -20,
                        r: p.r,
                        d: p.d,
                        color: p.color,
                        tilt: p.tilt,
                        tiltAngleIncremental: p.tiltAngleIncremental,
                        tiltAngle: p.tiltAngle
                    };
                }
            });
            animationFrameId = requestAnimationFrame(draw);
        }
        draw();
        
        document.getElementById('btn-close-ceremony').addEventListener('click', () => {
            cancelAnimationFrame(animationFrameId);
            overlay.remove();
            sounds.click();
        });
    }

    // ----------------------------------------------------
    // Achievement Certificate Modal
    // ----------------------------------------------------
    function showCertificateModal(badgeId) {
        let label = '';
        let emoji = '';
        let desc = '';
        
        if (GLOBAL_BADGES[badgeId]) {
            const b = GLOBAL_BADGES[badgeId];
            label = b.badgeName;
            emoji = b.emoji;
            desc = b.desc;
        } else if (DESCRIPTOR_BADGES[badgeId]) {
            const b = DESCRIPTOR_BADGES[badgeId];
            label = b.badgeName;
            emoji = b.emoji;
            desc = b.desc;
        } else if (GRAND_BADGES[badgeId]) {
            const b = GRAND_BADGES[badgeId];
            label = b.name;
            emoji = b.emoji;
            desc = b.desc;
        } else {
            return;
        }

        const today = new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });

        const existing = document.getElementById('cert-print-root');
        if (existing) existing.remove();

        const root = document.createElement('div');
        root.id = 'cert-print-root';
        root.innerHTML = `
            <div class="cert-modal-overlay" id="cert-overlay">
                <div class="cert-card" role="dialog" aria-modal="true" aria-label="${label} Certificate">
                    <div class="cert-header-band" style="background: linear-gradient(135deg, #059669 0%, #10b981 60%, #047857 100%);">
                        <div class="cert-star-row">★ ★ ★ ★ ★</div>
                        <div class="cert-title">Joshua Maths Command Station</div>
                        <div class="cert-achievement-label">${label.toUpperCase()}</div>
                    </div>
                    <div class="cert-body">
                        <div class="cert-badge-display">${emoji}</div>
                        <div class="cert-awarded-to">Certificate of Achievement — Awarded to</div>
                        <div class="cert-student-name">
                            <input type="text" class="cert-name-input" id="cert-name-input" placeholder="ENTER YOUR NAME" maxlength="30" autocomplete="off" />
                            <span class="cert-name-print-only" id="cert-name-print-only"></span>
                        </div>
                        <p class="cert-description">${desc}</p>
                        <div class="cert-date-row">DATE AWARDED: ${today.toUpperCase()}</div>
                    </div>
                    <div class="cert-footer">
                        <button class="cert-btn cert-btn-close" id="cert-btn-close">✕ Close</button>
                        <button class="cert-btn cert-btn-print" id="cert-btn-print" style="background: linear-gradient(135deg, #059669, #10b981); box-shadow: 0 4px 16px rgba(5, 150, 105, 0.3);">🖨️ Print as PDF</button>
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

        document.getElementById('cert-btn-close').addEventListener('click', () => {
            sounds.click();
            closeModal();
        });
        document.getElementById('cert-overlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                sounds.click();
                closeModal();
            }
        });
        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escHandler);
            }
        });

        document.getElementById('cert-btn-print').addEventListener('click', () => {
            sounds.click();
            window.print();
        });

        sounds.click();
    }

    // ----------------------------------------------------
    // Dynamic Sidebar Shelf Renderer
    // ----------------------------------------------------
    function renderBadgeShelf() {
        const shelf = document.getElementById('badge-shelf-container');
        if (!shelf) return;
        shelf.innerHTML = '';
        
        const activeYear = 6;
        const y6Descriptors = Object.keys(DESCRIPTOR_BADGES).filter(key => DESCRIPTOR_BADGES[key].year === activeYear);
        const y6GrandBadges = Object.keys(GRAND_BADGES).filter(key => GRAND_BADGES[key].year === activeYear);
        const allBadgeKeys = [...Object.keys(GLOBAL_BADGES), ...y6Descriptors, ...y6GrandBadges];
        
        allBadgeKeys.forEach(key => {
            const isGlobal = GLOBAL_BADGES[key] !== undefined;
            const isGrand = GRAND_BADGES[key] !== undefined;
            const isDesc = DESCRIPTOR_BADGES[key] !== undefined;
            
            let badgeName = '';
            let emoji = '';
            let desc = '';
            let themeColour = 'var(--primary)';
            let isUnlocked = profile.badges.includes(key);
            
            if (isGlobal) {
                const b = GLOBAL_BADGES[key];
                badgeName = b.badgeName;
                emoji = b.emoji;
                desc = b.desc;
                themeColour = '#7c3aed';
            } else if (isGrand) {
                const b = GRAND_BADGES[key];
                badgeName = b.name;
                emoji = b.emoji;
                desc = b.desc;
                themeColour = '#eab308';
            } else if (isDesc) {
                const b = DESCRIPTOR_BADGES[key];
                badgeName = b.badgeName;
                emoji = b.emoji;
                desc = b.desc;
                const theme = STRAND_THEMES[b.strand];
                themeColour = theme ? theme.colour : 'var(--primary)';
            }
            
            const badgeEl = document.createElement('div');
            badgeEl.className = `badge-item ${isUnlocked ? 'unlocked' : 'locked'} ${isDesc ? DESCRIPTOR_BADGES[key].strand : ''}`;
            badgeEl.id = `badge-${key}`;
            if (isUnlocked) {
                badgeEl.style.borderColor = themeColour;
                badgeEl.style.boxShadow = `inset 0 0 10px ${themeColour}22, 0 4px 10px ${themeColour}33`;
            }
            badgeEl.setAttribute('data-tooltip', isUnlocked ? `${badgeName} (Unlocked)` : `${badgeName} (Locked)`);
            badgeEl.textContent = emoji;
            
            if (isUnlocked) {
                badgeEl.addEventListener('click', () => showCertificateModal(key));
            }
            
            shelf.appendChild(badgeEl);
        });
    }

    function gainPoints(pts, isCorrect, category, descriptor, context) {
        if (descriptor) {
            const normalizedDesc = descriptor.toUpperCase();
            if (profile.scoresByDescriptor[normalizedDesc] === undefined) {
                profile.scoresByDescriptor[normalizedDesc] = 0;
            }
            profile.scoresByDescriptor[normalizedDesc] += pts;
            
            if (isCorrect && context) {
                if (!profile.solvedContexts[normalizedDesc]) {
                    profile.solvedContexts[normalizedDesc] = [];
                }
                if (!profile.solvedContexts[normalizedDesc].includes(context)) {
                    profile.solvedContexts[normalizedDesc].push(context);
                }
                profile.consecutiveCorrect[normalizedDesc] = (profile.consecutiveCorrect[normalizedDesc] || 0) + 1;
            } else if (!isCorrect) {
                profile.consecutiveCorrect[normalizedDesc] = 0;
            }
        }
        
        recalculateCategoryScores();
        
        let totalScore = 0;
        const activeYears = [3, 4, 5, 6];
        const strands = ['number', 'algebra', 'measurement', 'space', 'statistics', 'probability'];
        activeYears.forEach(yr => {
            const strandKey = `scoresByCatY${yr}`;
            if (profile[strandKey]) {
                strands.forEach(strand => {
                    totalScore += (profile[strandKey][strand] || 0);
                });
            }
        });
        profile.score = totalScore;

        if (isCorrect) {
            profile.streak += 1;
            profile.highestStreak = Math.max(profile.highestStreak, profile.streak);
        } else {
            profile.streak = 0;
        }

        const addBadge = (id) => {
            if (!profile.badges.includes(id)) {
                profile.badges.push(id);
                return true;
            }
            return false;
        };

        if (profile.score > 0) addBadge('first-step');
        if (profile.streak >= 5) addBadge('streak-5');
        if (profile.streak >= 10) addBadge('streak-10');
        if (profile.streak >= 20) addBadge('streak-20');

        // Check content descriptors badges
        Object.keys(DESCRIPTOR_BADGES).forEach(descKey => {
            const desc = DESCRIPTOR_BADGES[descKey];
            const code = desc.code;
            const pointsReq = desc.requirements.points;
            const contextsReq = desc.requirements.contexts;
            
            const currentPoints = profile.scoresByDescriptor[code] || 0;
            const currentContexts = profile.solvedContexts[code] || [];
            
            const pointsMet = currentPoints >= pointsReq;
            const contextsMet = contextsReq.every(c => currentContexts.includes(c));
            
            if (pointsMet && contextsMet) {
                if (addBadge(descKey)) {
                    sounds.badgeUnlock();
                    addLog(`ACHIEVEMENT UNLOCKED: Earned '${desc.badgeName}' Badge for ${desc.code}!`, "success");
                }
            }
        });

        // Check Grand Badges
        Object.keys(GRAND_BADGES).forEach(grandKey => {
            const gb = GRAND_BADGES[grandKey];
            const descriptors = Object.keys(DESCRIPTOR_BADGES).filter(key => {
                const desc = DESCRIPTOR_BADGES[key];
                return desc.year === gb.year && desc.strand === gb.strand;
            });
            const allUnlocked = descriptors.length > 0 && descriptors.every(key => profile.badges.includes(key));
            if (allUnlocked) {
                if (addBadge(grandKey)) {
                    sounds.badgeUnlock();
                    triggerConfettiCeremony(gb.name, gb.emoji);
                    addLog(`🌟 GRAND MASTERY UNLOCKED: Earned '${gb.name}'!`, "success");
                }
            }
        });

        saveProfile();
        loadProfile();
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
    // Question Generators mapping to year 6 descriptors
    // ----------------------------------------------------
    const questions = {
        number: [
            // AC9M6N01: negative number lines
            function generateN01() {
                const val = Math.floor(Math.random() * 19) - 9; // -9 to 9
                const svgId = 'svg-numline-' + Math.random().toString(36).slice(2, 9);
                return {
                    descriptor: 'AC9M6N01',
                    context: 'negative-number-line',
                    title: 'INTEGERS ON NUMBER LINE',
                    html: `
                        <p style="margin-bottom: 8px;">What integer is marked by the red pin on the number line?</p>
                        <div style="display:flex; justify-content:center; align-items:center; margin-bottom:12px;">
                            <svg viewBox="0 0 320 60" style="width:100%; max-width:280px; height:auto;" id="${svgId}">
                                <line x1="20" y1="35" x2="300" y2="35" stroke="var(--on-surface-variant)" stroke-width="2" />
                                ${(() => {
                                    let s = '';
                                    for (let i = -10; i <= 10; i++) {
                                        const x = 20 + (i + 10) * 14;
                                        s += `<line x1="${x}" y1="30" x2="${x}" y2="40" stroke="var(--on-surface-variant)" stroke-width="1" />`;
                                        if (i % 5 === 0) {
                                            s += `<text x="${x}" y="52" font-family="var(--font-mono)" font-size="7" fill="var(--outline)" text-anchor="middle">${i}</text>`;
                                        }
                                    }
                                    // Plot red marker pin
                                    const mx = 20 + (val + 10) * 14;
                                    s += `<circle cx="${mx}" cy="35" r="4" fill="var(--error)" />`;
                                    s += `<line x1="${mx}" y1="15" x2="${mx}" y2="35" stroke="var(--error)" stroke-width="1.5" />`;
                                    return s;
                                })()}
                            </svg>
                        </div>
                        <div class="question-input-group justify-center">
                            <input type="number" id="ans-n01" class="input-text-terminal input-number-small" placeholder="?" autocomplete="off" />
                        </div>
                    `,
                    validate: () => {
                        const valIn = parseInt(document.getElementById('ans-n01').value.trim(), 10);
                        return valIn === val;
                    },
                    hint: `The number line goes from -10 to +10, with major ticks every 5 units. Count the small ticks from the nearest major number.`,
                    solution: `The marked position points exactly to ${val}.`
                };
            },
            // AC9M6N02: Prime/Composite sorting
            function generateN02() {
                const primes = [11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
                const composites = [12, 14, 15, 18, 20, 21, 22, 24, 26, 27, 28, 30];
                const squares = [16, 25, 36, 49];

                const type = Math.floor(Math.random() * 3); // 0: prime, 1: composite, 2: square
                let val, correct;
                if (type === 0) {
                    val = primes[Math.floor(Math.random() * primes.length)];
                    correct = 'prime';
                } else if (type === 1) {
                    val = composites[Math.floor(Math.random() * composites.length)];
                    correct = 'composite';
                } else {
                    val = squares[Math.floor(Math.random() * squares.length)];
                    correct = 'square';
                }

                return {
                    descriptor: 'AC9M6N02',
                    context: 'prime-composite-sort',
                    title: 'NUMBER CLASSIFICATION',
                    html: `
                        <p style="margin-bottom: 12px;">Classify the number **${val}**:</p>
                        <div class="flex-row justify-center gap-12" id="ans-n02-group">
                            <label class="btn-portal" style="padding:10px 20px; border:1px solid var(--outline-variant); cursor:pointer;">
                                <input type="radio" name="n02-choice" value="prime" /> Prime
                            </label>
                            <label class="btn-portal" style="padding:10px 20px; border:1px solid var(--outline-variant); cursor:pointer;">
                                <input type="radio" name="n02-choice" value="composite" /> Composite
                            </label>
                            <label class="btn-portal" style="padding:10px 20px; border:1px solid var(--outline-variant); cursor:pointer;">
                                <input type="radio" name="n02-choice" value="square" /> Square
                            </label>
                        </div>
                    `,
                    validate: () => {
                        const sel = document.querySelector('input[name="n02-choice"]:checked');
                        return sel && sel.value === correct;
                    },
                    hint: `A prime number has only 2 factors (1 and itself). A composite number has more than 2 factors. A square number is the result of multiplying an integer by itself (e.g. 4 × 4 = 16).`,
                    solution: `The number ${val} is classified as a **${correct.toUpperCase()}** number.`
                };
            },
            // AC9M6N05: Fraction addition/subtraction
            function generateN05() {
                const questionsList = [
                    { eq: '1/2 + 1/4', ansNum: 3, ansDen: 4, hint: 'Convert 1/2 to 2/4 and add.' },
                    { eq: '1/3 + 1/6', ansNum: 1, ansDen: 2, hint: 'Convert 1/3 to 2/6. The sum is 3/6, which simplifies to 1/2.' },
                    { eq: '3/4 - 1/2', ansNum: 1, ansDen: 4, hint: 'Convert 1/2 to 2/4. The difference is 1/4.' },
                    { eq: '2/5 + 1/10', ansNum: 1, ansDen: 2, hint: 'Convert 2/5 to 4/10. The sum is 5/10, which simplifies to 1/2.' }
                ];
                const q = questionsList[Math.floor(Math.random() * questionsList.length)];
                return {
                    descriptor: 'AC9M6N05',
                    context: 'fraction-add-sub-sums',
                    title: 'FRACTION OPERATIONS',
                    html: `
                        <p style="margin-bottom: 12px;">Solve the following fraction sum and simplify your answer: **${q.eq}**</p>
                        <div class="flex-row align-center justify-center gap-4">
                            <input type="number" id="ans-n05-num" class="input-text-terminal" placeholder="num" style="width:60px; text-align:center;" autocomplete="off" />
                            <span style="font-size:1.5rem; font-weight:bold;">/</span>
                            <input type="number" id="ans-n05-den" class="input-text-terminal" placeholder="den" style="width:60px; text-align:center;" autocomplete="off" />
                        </div>
                    `,
                    validate: () => {
                        const n = parseInt(document.getElementById('ans-n05-num').value.trim(), 10);
                        const d = parseInt(document.getElementById('ans-n05-den').value.trim(), 10);
                        return n === q.ansNum && d === q.ansDen;
                    },
                    hint: q.hint,
                    solution: `The simplified fraction result is **${q.ansNum}/${q.ansDen}**.`
                };
            },
            // AC9M6N07: Percentage discounts
            function generateN07() {
                const originalPrice = [20, 40, 50, 80, 100, 120, 200][Math.floor(Math.random() * 7)];
                const discountPct = [10, 25, 50, 20][Math.floor(Math.random() * 4)];
                const discountAmt = (originalPrice * discountPct) / 100;
                const finalPrice = originalPrice - discountAmt;

                return {
                    descriptor: 'AC9M6N07',
                    context: 'percentage-discount',
                    title: 'SHOPPING DISCOUNT CALIBRATOR',
                    html: `
                        <p style="margin-bottom: 12px;">A jacket originally costs **$${originalPrice}**. It is currently discounted by **${discountPct}%**. What is the new final price?</p>
                        <div class="question-input-group justify-center">
                            <span>$</span>
                            <input type="number" id="ans-n07" class="input-text-terminal input-number-small" placeholder="?" style="width:100px;" autocomplete="off" />
                        </div>
                    `,
                    validate: () => {
                        const valIn = parseFloat(document.getElementById('ans-n07').value.trim());
                        return Math.abs(valIn - finalPrice) < 0.01;
                    },
                    hint: `Find ${discountPct}% of $${originalPrice} by dividing by 100 and multiplying, then subtract that discount from the original price.`,
                    solution: `A ${discountPct}% discount on $${originalPrice} is $${discountAmt}. The final price is $${finalPrice}.`
                };
            }
        ],
        algebra: [
            // AC9M6A02: BODMAS Brackets
            function generateA02() {
                const equations = [
                    { eq: '5 × (12 - 4) + 6', ans: 46 },
                    { eq: '(18 ÷ 3) × (2 + 5)', ans: 42 },
                    { eq: '20 - 4 × (6 - 3)', ans: 8 },
                    { eq: '8 + 12 ÷ (2 × 3)', ans: 10 }
                ];
                const q = equations[Math.floor(Math.random() * equations.length)];
                return {
                    descriptor: 'AC9M6A02',
                    context: 'order-operations-brackets',
                    title: 'ORDER OF OPERATIONS (BODMAS)',
                    html: `
                        <p style="margin-bottom: 12px;">Solve the bracketed equation: **${q.eq}**</p>
                        <div class="question-input-group justify-center">
                            <input type="number" id="ans-a02" class="input-text-terminal input-number-small" placeholder="?" autocomplete="off" />
                        </div>
                    `,
                    validate: () => {
                        const valIn = parseInt(document.getElementById('ans-a02').value.trim(), 10);
                        return valIn === q.ans;
                    },
                    hint: `Remember BODMAS: Brackets first, then Orders (powers), Division & Multiplication (left to right), and finally Addition & Subtraction (left to right).`,
                    solution: `Evaluating brackets first: ${q.eq} = **${q.ans}**.`
                };
            }
        ],
        measurement: [
            // AC9M6M01: Metric conversion length
            function generateM01() {
                const km = [1.5, 2.75, 0.5, 4.2][Math.floor(Math.random() * 4)];
                const m = km * 1000;
                return {
                    descriptor: 'AC9M6M01',
                    context: 'metric-slider-length',
                    title: 'METRIC SHIFT LENGTHS',
                    html: `
                        <p style="margin-bottom: 12px;">Convert **${km} km** into meters:</p>
                        <div class="question-input-group justify-center">
                            <input type="number" id="ans-m01" class="input-text-terminal" placeholder="?" style="width:120px; text-align:center; font-size:1.2rem;" autocomplete="off" />
                            <span>meters</span>
                        </div>
                    `,
                    validate: () => {
                        const valIn = parseFloat(document.getElementById('ans-m01').value.trim());
                        return Math.abs(valIn - m) < 0.01;
                    },
                    hint: `There are 1000 meters in 1 kilometer. Multiply the kilometer value by 1000 (shift the decimal place three spaces to the right).`,
                    solution: `${km} km = **${m}** meters.`
                };
            },
            // AC9M6M04: Angle opposite solver
            function generateM04() {
                const angleVal = [45, 60, 75, 115, 130][Math.floor(Math.random() * 5)];
                const supplementary = 180 - angleVal;
                
                return {
                    descriptor: 'AC9M6M04',
                    context: 'opposite-angle-solver',
                    title: 'INTERSECTING LINES ANGLES',
                    html: `
                        <p style="margin-bottom: 12px;">Two straight lines intersect. If one angle is **${angleVal}°**, what is its vertically opposite angle?</p>
                        <div class="question-input-group justify-center">
                            <input type="number" id="ans-m04" class="input-text-terminal input-number-small" placeholder="?" autocomplete="off" />
                            <span>°</span>
                        </div>
                    `,
                    validate: () => {
                        const valIn = parseInt(document.getElementById('ans-m04').value.trim(), 10);
                        return valIn === angleVal;
                    },
                    hint: `Vertically opposite angles are equal. The angle opposite ${angleVal}° will be the same.`,
                    solution: `The vertically opposite angle is equal to **${angleVal}°**.`
                };
            }
        ],
        space: [
            // AC9M6SP02: Four quadrant reads
            function generateSP02() {
                const x = Math.floor(Math.random() * 9) - 4; // -4 to 4
                const y = Math.floor(Math.random() * 9) - 4; // -4 to 4
                const transX = Math.floor(Math.random() * 5) - 2; // -2 to 2
                const transY = Math.floor(Math.random() * 5) - 2; // -2 to 2
                
                const finalX = x + transX;
                const finalY = y + transY;

                return {
                    descriptor: 'AC9M6SP02',
                    context: 'four-quadrant-plotter',
                    title: '4-QUADRANT COORDINATE TRANSLATION',
                    html: `
                        <p style="margin-bottom: 12px;">Point P is at **(${x}, ${y})**. If P is translated by vector **[${transX}, ${transY}]**, what are the new coordinates of P'?</p>
                        <div class="flex-row align-center justify-center gap-4">
                            <span>P' = (</span>
                            <input type="number" id="ans-sp02-x" class="input-text-terminal" placeholder="x" style="width:60px; text-align:center;" autocomplete="off" />
                            <span>,</span>
                            <input type="number" id="ans-sp02-y" class="input-text-terminal" placeholder="y" style="width:60px; text-align:center;" autocomplete="off" />
                            <span>)</span>
                        </div>
                    `,
                    validate: () => {
                        const px = parseInt(document.getElementById('ans-sp02-x').value.trim(), 10);
                        const py = parseInt(document.getElementById('ans-sp02-y').value.trim(), 10);
                        return px === finalX && py === finalY;
                    },
                    hint: `Add the translation vector coordinates to the original position: new X = ${x} + (${transX}), new Y = ${y} + (${transY}).`,
                    solution: `P' = (${x} + ${transX}, ${y} + ${transY}) = **(${finalX}, ${finalY})**.`
                };
            }
        ],
        statistics: [
            // AC9M6ST01: Range calculation
            function generateST01() {
                const raw = [
                    [12, 18, 5, 23, 15, 11],
                    [44, 38, 52, 41, 48, 35],
                    [2, 9, 15, 4, 11, 7]
                ][Math.floor(Math.random() * 3)];
                const sorted = [...raw].sort((a,b)=>a-b);
                const min = sorted[0];
                const max = sorted[sorted.length-1];
                const range = max - min;

                return {
                    descriptor: 'AC9M6ST01',
                    context: 'range-comparisons',
                    title: 'DATASET RANGE DIAGNOSTICS',
                    html: `
                        <p style="margin-bottom: 12px;">Calculate the range for the dataset: **[ ${raw.join(', ')} ]**</p>
                        <div class="question-input-group justify-center">
                            <input type="number" id="ans-st01" class="input-text-terminal input-number-small" placeholder="?" autocomplete="off" />
                        </div>
                    `,
                    validate: () => {
                        const valIn = parseInt(document.getElementById('ans-st01').value.trim(), 10);
                        return valIn === range;
                    },
                    hint: `The range of a dataset is the difference between the maximum (highest) value and the minimum (lowest) value: Range = ${max} - ${min}.`,
                    solution: `Max value is ${max}, Min value is ${min}. Range = ${max} - ${min} = **${range}**.`
                };
            }
        ],
        probability: [
            // AC9M6P01: Convert probabilities
            function generateP01() {
                const fraction = '3/4';
                const decimal = 0.75;
                const percent = 75;

                return {
                    descriptor: 'AC9M6P01',
                    context: 'chance-percentage-slider',
                    title: 'PROBABILITY SCALES MAPPING',
                    html: `
                        <p style="margin-bottom: 12px;">A probability is represented as **${fraction}**. Convert this representation to percentage notation:</p>
                        <div class="question-input-group justify-center">
                            <input type="number" id="ans-p01" class="input-text-terminal input-number-small" placeholder="?" autocomplete="off" />
                            <span>%</span>
                        </div>
                    `,
                    validate: () => {
                        const valIn = parseInt(document.getElementById('ans-p01').value.trim(), 10);
                        return valIn === percent;
                    },
                    hint: `To convert 3/4 to a percentage, divide 3 by 4 to get 0.75, then multiply by 100.`,
                    solution: `3/4 = 0.75 = **${percent}%**.`
                };
            }
        ]
    };

    // ----------------------------------------------------
    // Active Question State Management
    // ----------------------------------------------------
    function loadNextQuestion() {
        // Reset visual cards
        pracHintContainer.style.display = 'none';
        pracSolutionContainer.style.display = 'none';
        pracFeedbackText.style.display = 'none';
        btnPracHint.style.display = 'none';
        btnPracSubmit.style.display = 'inline-block';
        btnPracNext.style.display = 'none';
        
        state.attemptsLeft = 2;
        pracAttemptsLeft.textContent = `2 ATTEMPTS LEFT`;
        pracAttemptsLeft.className = 'rank-pill';

        const categoryGenerators = questions[state.activeCategory];
        if (!categoryGenerators || categoryGenerators.length === 0) return;
        
        const randomGen = categoryGenerators[Math.floor(Math.random() * categoryGenerators.length)];
        state.currentQuestion = randomGen();
        
        pracTaskTitle.textContent = state.currentQuestion.title;
        pracInteractivePanel.innerHTML = state.currentQuestion.html;
        
        document.getElementById('practice-code').textContent = `[${state.currentQuestion.descriptor}]`;
        addLog(`Loading practice exercise for descriptor ${state.currentQuestion.descriptor}.`, "system");
    }

    // Tab selectors
    document.querySelectorAll('.selector-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            sounds.click();
            document.querySelectorAll('.selector-tab').forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            state.activeCategory = e.target.getAttribute('data-task');
            loadNextQuestion();
        });
    });

    // Submit Action
    btnPracSubmit.addEventListener('click', () => {
        if (!state.currentQuestion) return;

        const isCorrect = state.currentQuestion.validate();
        
        if (isCorrect) {
            sounds.success();
            pracFeedbackText.className = 'active-feedback-text feedback-success';
            
            // Score calculations: +10 pts on 1st attempt, +5 pts on 2nd attempt
            const pointsEarned = state.attemptsLeft === 2 ? 10 : 5;
            pracFeedbackText.textContent = `CORRECT! +${pointsEarned} POINTS`;
            pracFeedbackText.style.display = 'block';
            
            gainPoints(
                pointsEarned, 
                true, 
                state.activeCategory, 
                state.currentQuestion.descriptor, 
                state.currentQuestion.context
            );

            btnPracSubmit.style.display = 'none';
            btnPracHint.style.display = 'none';
            btnPracNext.style.display = 'inline-block';
            addLog(`Exercise validated. Student awarded +${pointsEarned} points.`, "success");
        } else {
            sounds.error();
            state.attemptsLeft--;
            
            if (state.attemptsLeft === 1) {
                pracAttemptsLeft.textContent = `1 ATTEMPT LEFT`;
                pracAttemptsLeft.className = 'rank-pill status-dot loading'; // amber glow
                pracFeedbackText.className = 'active-feedback-text feedback-error';
                pracFeedbackText.textContent = `CALIBRATION DISCREPANCY. TRY AGAIN.`;
                pracFeedbackText.style.display = 'block';
                btnPracHint.style.display = 'inline-block';
                addLog(`Validation failed. 1 attempt remaining. Hint unlocked.`, "error");
            } else {
                pracAttemptsLeft.textContent = `0 ATTEMPTS LEFT`;
                pracAttemptsLeft.className = 'rank-pill';
                pracFeedbackText.className = 'active-feedback-text feedback-error';
                pracFeedbackText.textContent = `SYSTEM ERROR. EXERCISE LOCKED.`;
                pracFeedbackText.style.display = 'block';
                
                // Show solutions
                pracSolutionContent.innerHTML = state.currentQuestion.solution;
                pracSolutionContainer.style.display = 'block';
                
                gainPoints(
                    0, 
                    false, 
                    state.activeCategory, 
                    state.currentQuestion.descriptor, 
                    state.currentQuestion.context
                );

                btnPracSubmit.style.display = 'none';
                btnPracHint.style.display = 'none';
                btnPracNext.style.display = 'inline-block';
                addLog(`Validation failed. 0 attempts remaining. Solved solution displayed.`, "error");
            }
        }
    });

    btnPracHint.addEventListener('click', () => {
        sounds.click();
        if (state.currentQuestion) {
            pracHintContent.textContent = state.currentQuestion.hint;
            pracHintContainer.style.display = 'block';
        }
    });

    btnPracNext.addEventListener('click', () => {
        sounds.click();
        loadNextQuestion();
    });

    // ----------------------------------------------------
    // Trophy Room Overlay Modal Logic
    // ----------------------------------------------------
    let trophyActiveYear = 6;
    const btnOpenTrophy = document.getElementById('btn-open-trophy');
    const btnCloseTrophy = document.getElementById('btn-close-trophy');
    const elTrophyModal = document.getElementById('trophy-modal');

    if (btnOpenTrophy) {
        btnOpenTrophy.addEventListener('click', () => {
            sounds.click();
            if (elTrophyModal) {
                elTrophyModal.classList.add('active');
                renderTrophyRoom();
            }
        });
    }

    if (btnCloseTrophy) {
        btnCloseTrophy.addEventListener('click', () => {
            sounds.click();
            if (elTrophyModal) elTrophyModal.classList.remove('active');
        });
    }

    if (elTrophyModal) {
        elTrophyModal.addEventListener('click', (e) => {
            if (e.target === elTrophyModal) {
                sounds.click();
                elTrophyModal.classList.remove('active');
            }
        });
    }

    function renderTrophyRoom() {
        const tabsContainer = document.getElementById('trophy-tabs-container');
        const bodyContainer = document.getElementById('trophy-body-container');
        if (!tabsContainer || !bodyContainer) return;
        
        const years = [3, 4, 5, 6];
        tabsContainer.innerHTML = '';
        years.forEach(yr => {
            const btn = document.createElement('button');
            btn.className = `trophy-tab-btn ${trophyActiveYear === yr ? 'active' : ''}`;
            btn.textContent = `Year ${yr}`;
            btn.addEventListener('click', () => {
                sounds.click();
                trophyActiveYear = yr;
                renderTrophyRoom();
            });
            tabsContainer.appendChild(btn);
        });
        
        bodyContainer.innerHTML = '';
        
        const yearDescriptors = Object.keys(DESCRIPTOR_BADGES).filter(key => DESCRIPTOR_BADGES[key].year === trophyActiveYear);
        const unlockedDescriptors = yearDescriptors.filter(key => profile.badges.includes(key));
        const totalPointsForYear = yearDescriptors.reduce((sum, key) => sum + (profile.scoresByDescriptor[DESCRIPTOR_BADGES[key].code] || 0), 0);
        
        const summarySec = document.createElement('div');
        summarySec.className = 'trophy-summary-section';
        summarySec.innerHTML = `
            <div class="trophy-stat-card">
                <div class="trophy-stat-val" style="color:var(--primary); font-family:'Space Grotesk', sans-serif;">${unlockedDescriptors.length}/${yearDescriptors.length}</div>
                <div class="trophy-stat-label">BADGES UNLOCKED IN YEAR ${trophyActiveYear}</div>
            </div>
            <div class="trophy-stat-card">
                <div class="trophy-stat-val" style="color:var(--primary); font-family:'Space Grotesk', sans-serif;">${totalPointsForYear}</div>
                <div class="trophy-stat-label">TOTAL POINTS EARNED</div>
            </div>
        `;
        bodyContainer.appendChild(summarySec);
        
        const grandShowcase = document.createElement('div');
        grandShowcase.className = 'grand-showcase-container';
        grandShowcase.innerHTML = `
            <div class="grand-showcase-title">🏆 Year ${trophyActiveYear} Strand Mastery Awards</div>
            <div class="grand-showcase-grid" id="grand-showcase-grid-inner"></div>
        `;
        bodyContainer.appendChild(grandShowcase);
        const grandGridInner = grandShowcase.querySelector('#grand-showcase-grid-inner');
        
        const yearGrandBadges = Object.keys(GRAND_BADGES).filter(key => GRAND_BADGES[key].year === trophyActiveYear);
        yearGrandBadges.forEach(key => {
            const gb = GRAND_BADGES[key];
            const isUnlocked = profile.badges.includes(key);
            const badgeEl = document.createElement('div');
            badgeEl.className = `grand-badge-icon ${isUnlocked ? gb.borderClass : 'locked'}`;
            badgeEl.setAttribute('data-tooltip', isUnlocked ? `${gb.name} (Unlocked)` : `${gb.name} (Locked: Unlock all ${gb.strand} badges)`);
            badgeEl.innerHTML = gb.emoji;
            if (isUnlocked) {
                badgeEl.addEventListener('click', () => showCertificateModal(key));
            }
            grandGridInner.appendChild(badgeEl);
        });
        
        const strands = ['number', 'algebra', 'measurement', 'space', 'statistics', 'probability'];
        const strandsGrid = document.createElement('div');
        strandsGrid.className = 'trophy-strands-grid';
        
        strands.forEach(strand => {
            const strandTheme = STRAND_THEMES[strand] || { name: strand.toUpperCase(), colour: 'var(--primary)' };
            const strandDescriptors = yearDescriptors.filter(key => DESCRIPTOR_BADGES[key].strand === strand);
            if (strandDescriptors.length === 0) return;
            
            const unlockedStrandDescriptors = strandDescriptors.filter(key => profile.badges.includes(key));
            const pct = Math.round((unlockedStrandDescriptors.length / strandDescriptors.length) * 100);
            
            const strandCard = document.createElement('div');
            strandCard.className = `trophy-strand-card strand-border-${strand}`;
            
            strandCard.innerHTML = `
                <div class="trophy-strand-header" style="background-color: ${strandTheme.colour};">
                    <span>${strandTheme.name.toUpperCase()} STRAND</span>
                    <span style="font-size:0.8rem;">${unlockedStrandDescriptors.length}/${strandDescriptors.length} Badges</span>
                </div>
                <div class="trophy-strand-body">
                    <div class="trophy-strand-progress">
                        <div class="progress-bar-wide">
                            <div class="progress-bar-fill-wide" style="width: ${pct}%; background-color: ${strandTheme.colour};"></div>
                        </div>
                        <span class="progress-label" style="color: ${strandTheme.colour}; font-weight:700; text-align:right; width:40px;">${pct}%</span>
                    </div>
                    <div class="trophy-badge-grid" id="badge-grid-${strand}"></div>
                </div>
            `;
            
            const badgeGrid = strandCard.querySelector(`#badge-grid-${strand}`);
            strandDescriptors.forEach(key => {
                const b = DESCRIPTOR_BADGES[key];
                const isUnlocked = profile.badges.includes(key);
                const descCode = b.code;
                const pointsEarned = profile.scoresByDescriptor[descCode] || 0;
                
                const bEl = document.createElement('div');
                bEl.className = `badge-item ${isUnlocked ? 'unlocked' : 'locked'} ${strand}`;
                if (isUnlocked) {
                    bEl.style.borderColor = strandTheme.colour;
                    bEl.style.boxShadow = `inset 0 0 10px ${strandTheme.colour}22, 0 4px 10px ${strandTheme.colour}33`;
                }
                bEl.setAttribute('data-tooltip', isUnlocked ? `${b.badgeName} (Unlocked)` : `${b.badgeName} (Locked: Need 50 points in ${b.code}. Current: ${pointsEarned}/50)`);
                bEl.textContent = b.emoji;
                if (isUnlocked) {
                    bEl.addEventListener('click', () => showCertificateModal(key));
                }
                badgeGrid.appendChild(bEl);
            });
            
            strandsGrid.appendChild(strandCard);
        });
        
        bodyContainer.appendChild(strandsGrid);
    }

    // Initialise System
    loadProfile();
    loadNextQuestion();
});
