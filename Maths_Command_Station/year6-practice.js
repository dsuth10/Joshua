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

    if (typeof MCS !== 'undefined' && MCS.audio) {
        MCS.audio.register(playSound);
    }

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
                    const code = normalizeDescriptorCode(DESCRIPTOR_BADGES[descKey].code);
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
                migrateDescriptorProfileKeys(profile);
            } catch (e) {
                console.error("Failed to parse stored profile", e);
            }
        }

        if (!profile.scoresByDescriptor) profile.scoresByDescriptor = {};
        if (!profile.solvedContexts) profile.solvedContexts = {};
        if (!profile.consecutiveCorrect) profile.consecutiveCorrect = {};

        // Guarantee all descriptors in config have values
        Object.keys(DESCRIPTOR_BADGES).forEach(key => {
            const code = normalizeDescriptorCode(DESCRIPTOR_BADGES[key].code);
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
            const normalizedDesc = normalizeDescriptorCode(descriptor);
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
            const code = normalizeDescriptorCode(desc.code);
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
        questionSession: null,
        activeInterval: null,
        sessionSeenQuestions: new Set(),
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

    const SPINNER_SECTORS = [
        { label: 'A', color: '#0052ff' },
        { label: 'B', color: '#0984e3' },
        { label: 'C', color: '#00b894' },
        { label: 'D', color: '#fdcb6e' },
    ];
    const LARGE_TRIAL_COUNT = 50;

    function wireSpinnerTrialSession(session, ui, opts) {
        const inputIds = opts.inputIds || [];
        const spinnerId = opts.spinnerId || 'spinner';
        const lockInputs = () => {
            inputIds.forEach((id) => {
                const inst = session.instances[id];
                if (inst && typeof inst.setEnabled === 'function') inst.setEnabled(false);
            });
            if (ui.submitBtn) {
                ui.submitBtn.disabled = true;
                ui.submitBtn.style.opacity = '0.5';
                ui.submitBtn.style.pointerEvents = 'none';
            }
        };
        const unlockInputs = () => {
            inputIds.forEach((id) => {
                const inst = session.instances[id];
                if (inst && typeof inst.setEnabled === 'function') inst.setEnabled(true);
            });
            if (ui.submitBtn) {
                ui.submitBtn.disabled = false;
                ui.submitBtn.style.opacity = '1';
                ui.submitBtn.style.pointerEvents = 'auto';
            }
        };
        lockInputs();
        const spinner = session.instances[spinnerId];
        if (spinner && typeof spinner.onChange === 'function') {
            spinner.onChange((spinState) => {
                if (spinState.trialsComplete) {
                    unlockInputs();
                    if (typeof opts.onTrialsComplete === 'function') {
                        opts.onTrialsComplete(session, spinState);
                    }
                }
            });
        }
    }

    // ----------------------------------------------------
    // Legacy-keep recall helpers (Phase 3b — badge context coverage)
    // ----------------------------------------------------
    function makeLegacyNumeric(opts) {
        const answer = opts.answer;
        return {
            descriptor: opts.descriptor,
            context: opts.context,
            category: opts.category,
            title: opts.title,
            prompt: opts.prompt,
            widgets: opts.display
                ? [{
                    id: 'display',
                    type: 'legacy-passthrough',
                    config: {
                        render: (container) => {
                            container.innerHTML = opts.display;
                        },
                    },
                }]
                : [],
            inputs: [
                {
                    id: 'ans',
                    type: 'number-input',
                    config: {
                        label: opts.label || '',
                        placeholder: '?',
                        width: opts.width || '100px',
                        ariaLabel: opts.ariaLabel || 'Numeric answer',
                    },
                },
            ],
            evaluate(values) {
                return values.ans === answer;
            },
            hint: { text: opts.hint, highlight: ['ans'] },
            solution: { text: opts.solution, show: { ans: answer } },
            points: 10,
        };
    }

    function makeLegacyChoice(opts) {
        const correct = opts.correct;
        return {
            descriptor: opts.descriptor,
            context: opts.context,
            category: opts.category,
            title: opts.title,
            prompt: opts.prompt,
            widgets: opts.display
                ? [{
                    id: 'display',
                    type: 'legacy-passthrough',
                    config: {
                        render: (container) => {
                            container.innerHTML = opts.display;
                        },
                    },
                }]
                : [],
            inputs: [
                {
                    id: 'choice',
                    type: 'select-input',
                    config: {
                        label: opts.label || 'Answer:',
                        width: opts.width || '220px',
                        options: [
                            { value: '', label: 'Choose…' },
                            ...opts.options.map((o) => (
                                typeof o === 'string'
                                    ? { value: o, label: o }
                                    : { value: o.value, label: o.label }
                            )),
                        ],
                    },
                },
            ],
            evaluate(values) {
                const selected = values.choice;
                if (selected == null || selected === '') return false;
                return String(selected) === String(correct);
            },
            hint: { text: opts.hint, highlight: ['choice'] },
            solution: { text: opts.solution, show: { choice: correct } },
            points: 10,
        };
    }

    function makeLegacyMathField(opts) {
        return {
            descriptor: opts.descriptor,
            context: opts.context,
            category: opts.category,
            title: opts.title,
            prompt: opts.prompt,
            widgets: [],
            inputs: [
                {
                    id: 'ans',
                    type: 'math-field',
                    config: {
                        band: 'C',
                        keyboard: opts.keyboard || 'fractions-y5',
                        expect: opts.expect || 'fraction',
                        placeholder: opts.placeholder || '\\frac{?}{?}',
                        ariaLabel: opts.ariaLabel || 'Answer',
                    },
                },
            ],
            evaluate(values) {
                if (MCS.input.isEmpty(values.ans)) return false;
                return MCS.input.check(values.ans, {
                    equals: opts.equals,
                    form: opts.form || 'simplest',
                    tolerance: 1e-9,
                });
            },
            hint: { text: opts.hint, highlight: ['ans'] },
            solution: {
                text: opts.solution,
                show: { ans: { latex: opts.latex } },
            },
            points: 10,
        };
    }

    const gapGenerators = {
        number: [
            // legacy-keep: factor tree recall — symbolic prime factor (Phase 3b policy)
            function generateFactorTree() {
                const nums = [
                    { n: 42, factor: 2, hint: '42 is even, so divide by 2 first.' },
                    { n: 63, factor: 3, hint: '6 + 3 = 9, so 63 is divisible by 3.' },
                    { n: 55, factor: 5, hint: '55 ends in 5, so 5 is the smallest prime factor.' },
                ];
                const q = nums[Math.floor(Math.random() * nums.length)];
                return makeLegacyNumeric({
                    descriptor: 'AC9M6N02',
                    context: 'factor-tree-check',
                    category: 'number',
                    title: 'FACTOR TREE CHECK',
                    prompt: `What is the **smallest prime factor** of **${q.n}**?`,
                    answer: q.factor,
                    hint: q.hint,
                    solution: `The smallest prime factor of ${q.n} is ${q.factor}.`,
                });
            },
            // legacy-keep: equivalence recall — no number-line widget required for MCQ (Phase 3b policy)
            function generateEquivFraction() {
                return makeLegacyChoice({
                    descriptor: 'AC9M6N03',
                    context: 'equivalence-fraction-check',
                    category: 'number',
                    title: 'EQUIVALENT FRACTION CHECK',
                    prompt: 'Which fraction is **equivalent to 1/2**?',
                    options: ['2/4', '1/3', '3/5', '2/3'],
                    correct: '2/4',
                    hint: 'Multiply or divide numerator and denominator by the same number. 1/2 × 2/2 = 2/4.',
                    solution: '2/4 = 1/2 because both numerator and denominator were multiplied by 2.',
                });
            },
            // legacy-keep: fraction position on unit interval — symbolic recall (Phase 3b policy)
            function generateNumberLinePosition() {
                return makeLegacyChoice({
                    descriptor: 'AC9M6N03',
                    context: 'number-line-position',
                    category: 'number',
                    title: 'NUMBER LINE POSITION',
                    prompt: 'On a number line from **0 to 1**, which value marks **3/4** of the way from 0 to 1?',
                    options: ['0.25', '0.5', '0.75', '1.0'],
                    correct: '0.75',
                    hint: '3/4 means three quarters of the distance from 0 to 1. Convert: 3 ÷ 4 = 0.75.',
                    solution: '3/4 = 0.75, which is three quarters along the unit interval.',
                });
            },
            // legacy-keep: vertical decimal addition — symbolic column recall (Phase 3b policy)
            function generateDecimalAdd() {
                return makeLegacyChoice({
                    descriptor: 'AC9M6N04',
                    context: 'vertical-decimal-addition',
                    category: 'number',
                    title: 'DECIMAL ADDITION GRID',
                    prompt: 'Add the decimals: **2.45 + 1.32**',
                    options: ['3.77', '3.67', '4.77', '2.87'],
                    correct: '3.77',
                    hint: 'Line up decimal places and add column by column: 2.45 + 1.32 = 3.77.',
                    solution: '2.45 + 1.32 = 3.77.',
                });
            },
            // legacy-keep: vertical decimal subtraction — symbolic column recall (Phase 3b policy)
            function generateDecimalSub() {
                return makeLegacyChoice({
                    descriptor: 'AC9M6N04',
                    context: 'vertical-decimal-subtraction',
                    category: 'number',
                    title: 'DECIMAL SUBTRACTION GRID',
                    prompt: 'Subtract: **5.6 − 2.3**',
                    options: ['3.3', '3.7', '2.3', '8.9'],
                    correct: '3.3',
                    hint: 'Line up decimal places before subtracting tenths and ones.',
                    solution: '5.6 − 2.3 = 3.3.',
                });
            },
            // legacy-keep: LCD recall — symbolic (Phase 3b policy)
            function generateLcd() {
                const pairs = [
                    { a: 4, b: 6, lcd: 12 },
                    { a: 3, b: 5, lcd: 15 },
                    { a: 6, b: 8, lcd: 24 },
                ];
                const q = pairs[Math.floor(Math.random() * pairs.length)];
                return makeLegacyNumeric({
                    descriptor: 'AC9M6N05',
                    context: 'common-denominator-lcd',
                    category: 'number',
                    title: 'LOWEST COMMON DENOMINATOR',
                    prompt: `What is the **lowest common denominator (LCD)** of **${q.a}** and **${q.b}**?`,
                    answer: q.lcd,
                    hint: 'List multiples of each denominator. The LCD is the smallest number that appears in both lists.',
                    solution: `Multiples of ${q.a} and ${q.b} share ${q.lcd} first — the LCD is ${q.lcd}.`,
                });
            },
            // legacy-keep: decimal power-of-10 multiply — mirrors assessment shift regulator (Phase 3b policy)
            function generateDecimalShiftMul() {
                const pairs = [
                    { base: 2.5, power: 10, ans: 25 },
                    { base: 0.45, power: 100, ans: 45 },
                    { base: 3.5, power: 10, ans: 35 },
                ];
                const q = pairs[Math.floor(Math.random() * pairs.length)];
                return makeLegacyNumeric({
                    descriptor: 'AC9M6N06',
                    context: 'decimal-shift-multiply',
                    category: 'number',
                    title: 'DECIMAL POWER SHIFT (×)',
                    prompt: `Multiply **${q.base} × ${q.power}**.`,
                    answer: q.ans,
                    hint: `Multiplying by ${q.power} shifts the decimal point ${q.power === 10 ? 'one' : 'two'} place(s) to the right.`,
                    solution: `${q.base} × ${q.power} = ${q.ans}.`,
                });
            },
            // legacy-keep: decimal power-of-10 divide (Phase 3b policy)
            function generateDecimalShiftDiv() {
                const pairs = [
                    { display: '480 ÷ 10', ans: 48 },
                    { display: '3500 ÷ 100', ans: 35 },
                    { display: '720 ÷ 10', ans: 72 },
                ];
                const q = pairs[Math.floor(Math.random() * pairs.length)];
                return makeLegacyNumeric({
                    descriptor: 'AC9M6N06',
                    context: 'decimal-shift-divide',
                    category: 'number',
                    title: 'DECIMAL POWER SHIFT (÷)',
                    prompt: `Calculate **${q.display}**.`,
                    answer: q.ans,
                    hint: 'Dividing by 10 or 100 shifts the decimal point to the left.',
                    solution: `${q.display} = ${q.ans}.`,
                });
            },
            // legacy-keep: percent of quantity — symbolic (Phase 3b policy)
            function generateQuantityPercent() {
                const qty = [80, 120, 200][Math.floor(Math.random() * 3)];
                const pct = [10, 25, 50][Math.floor(Math.random() * 3)];
                const answer = (qty * pct) / 100;
                return makeLegacyNumeric({
                    descriptor: 'AC9M6N07',
                    context: 'quantity-percentage',
                    category: 'number',
                    title: 'PERCENT OF QUANTITY',
                    prompt: `What is **${pct}%** of **${qty}**?`,
                    answer,
                    hint: `Convert ${pct}% to a decimal (${pct / 100}) and multiply by ${qty}.`,
                    solution: `${pct}% of ${qty} = ${answer}.`,
                });
            },
            // legacy-keep: rational rounding — symbolic recall (Phase 3b policy)
            function generateRationalRound() {
                const vals = [
                    { raw: '12.96', ans: 13, text: '13' },
                    { raw: '47.4', ans: 47, text: '47' },
                ];
                const q = vals[Math.floor(Math.random() * vals.length)];
                return makeLegacyNumeric({
                    descriptor: 'AC9M6N08',
                    context: 'rational-rounding',
                    category: 'number',
                    title: 'RATIONAL ROUNDING',
                    prompt: `Round **${q.raw}** to the **nearest whole number**.`,
                    answer: q.ans,
                    hint: 'Look at the tenths digit to decide whether to round up or down.',
                    solution: `${q.raw} rounds to ${q.text}.`,
                });
            },
            // legacy-keep: rational estimation — mental math recall (Phase 3b policy)
            function generateRationalEst() {
                const pairs = [
                    { eq: '49 × 21', est: 1000 },
                    { eq: '198 ÷ 4', est: 50 },
                ];
                const q = pairs[Math.floor(Math.random() * pairs.length)];
                return makeLegacyNumeric({
                    descriptor: 'AC9M6N08',
                    context: 'rational-estimation',
                    category: 'number',
                    title: 'RATIONAL ESTIMATION',
                    prompt: `Estimate **${q.eq}** by rounding to friendly numbers. Enter your **best whole-number estimate**.`,
                    answer: q.est,
                    hint: 'Round each value to the nearest ten (or hundred), then calculate mentally.',
                    solution: `A reasonable estimate for ${q.eq} is about ${q.est}.`,
                    width: '120px',
                });
            },
            // legacy-keep: financial word scenario — reading comprehension (Phase 3b policy)
            function generateRationalWord() {
                const items = ['ticket', 'program', 'workbook', 'show pass', 'meal deal'];
                const item = items[Math.floor(Math.random() * items.length)];
                const price = Math.floor(Math.random() * 9) + 4;
                const qty = Math.floor(Math.random() * 7) + 3;
                const ans = price * qty;

                const templates = [
                    () => ({
                        prompt: `Tickets cost **$${price}** each. A group buys **${qty}** tickets. What is the **total cost in dollars**?`,
                        hint: `Multiply price × quantity: $${price} × ${qty}.`,
                        solution: `$${price} × ${qty} = $${ans}.`,
                    }),
                    () => ({
                        prompt: `Each ${item} costs **$${price}**. The school orders **${qty}** for an excursion. What is the **total cost in dollars**?`,
                        hint: `Multiply the unit price by how many are bought: $${price} × ${qty}.`,
                        solution: `$${price} × ${qty} = $${ans}.`,
                    }),
                    () => ({
                        prompt: `A canteen sells lunch wraps for **$${price}** each. **${qty}** students each buy one wrap. What is the **total spent in dollars**?`,
                        hint: `Each student pays $${price}. Multiply by ${qty} students.`,
                        solution: `$${price} × ${qty} = $${ans}.`,
                    }),
                    () => ({
                        prompt: `Bus travel costs **$${price}** per person. A team of **${qty}** players needs return tickets (one fare each way is already included in the price). What is the **total fare in dollars**?`,
                        hint: `Multiply the fare per person by the number of players: $${price} × ${qty}.`,
                        solution: `$${price} × ${qty} = $${ans}.`,
                    }),
                    () => ({
                        prompt: `Fundraising chocolates sell for **$${price}** each. One class sells **${qty}** boxes in a day. What is the **total sales in dollars**?`,
                        hint: `Total sales = price per box × number sold.`,
                        solution: `$${price} × ${qty} = $${ans}.`,
                    }),
                    () => ({
                        prompt: `Entry to the science fair is **$${price}** per student. **${qty}** students from one school attend. What is the **total entry cost in dollars**?`,
                        hint: `Multiply $${price} by ${qty} students.`,
                        solution: `$${price} × ${qty} = $${ans}.`,
                    }),
                ];

                const q = templates[Math.floor(Math.random() * templates.length)]();
                return makeLegacyNumeric({
                    descriptor: 'AC9M6N09',
                    context: 'rational-word-scenarios',
                    category: 'number',
                    title: 'RATIONAL WORD SCENARIO',
                    prompt: q.prompt,
                    answer: ans,
                    label: '$',
                    hint: q.hint,
                    solution: q.solution,
                });
            },
            // legacy-keep: multi-step rational model — symbolic recall (Phase 3b policy)
            function generateRationalSteps() {
                const start = 100;
                const discount = 20;
                const ans = start - discount;
                return makeLegacyNumeric({
                    descriptor: 'AC9M6N09',
                    context: 'rational-step-models',
                    category: 'number',
                    title: 'MULTI-STEP RATIONAL MODEL',
                    prompt: `A jacket costs **$${start}**. A **$${discount}** voucher is applied, then no further charges. What is the **final price in dollars**?`,
                    answer: ans,
                    label: '$',
                    hint: 'Subtract the voucher from the starting price.',
                    solution: `$${start} − $${discount} = $${ans}.`,
                });
            },
        ],
        algebra: [
            // legacy-keep: growing sequence — symbolic recall (Phase 3b policy)
            function generateSequenceGrowth() {
                const starts = [2, 3, 4, 5, 7, 10];
                const steps = [2, 3, 4, 5, 6, 7, 8];
                const start = starts[Math.floor(Math.random() * starts.length)];
                const step = steps[Math.floor(Math.random() * steps.length)];
                const seq = [start, start + step, start + 2 * step, start + 3 * step];
                const next = start + 4 * step;
                return makeLegacyNumeric({
                    descriptor: 'AC9M6A01',
                    context: 'sequence-growth',
                    category: 'algebra',
                    title: 'GROWING SEQUENCE',
                    prompt: `Find the next term: **${seq.join(', ')}, ?**`,
                    answer: next,
                    hint: `The pattern adds ${step} each time.`,
                    solution: `Each term increases by ${step}. The next term is ${next}.`,
                });
            },
            // legacy-keep: pattern description — MCQ recall (Phase 3b policy)
            function generatePatternVis() {
                const start = Math.floor(Math.random() * 6) + 1; // 1..6
                const steps = [2, 3, 4, 5, 6, 7, 8];
                const step = steps[Math.floor(Math.random() * steps.length)];
                const seq = [start, start + step, start + 2 * step, start + 3 * step];
                const correct = `Add ${step} each time`;
                const distractorSteps = steps.filter((s) => s !== step);
                const wrongAddA = distractorSteps[Math.floor(Math.random() * distractorSteps.length)];
                const remaining = distractorSteps.filter((s) => s !== wrongAddA);
                const wrongAddB = remaining[Math.floor(Math.random() * remaining.length)];

                return makeLegacyChoice({
                    descriptor: 'AC9M6A01',
                    context: 'pattern-visualisation',
                    category: 'algebra',
                    title: 'PATTERN VISUALISATION',
                    prompt: `Look at the pattern: **${seq.join(', ')}, …** Which rule describes it?`,
                    options: [correct, `Add ${wrongAddA} each time`, `Add ${wrongAddB} each time`, 'Multiply by 2 each time'],
                    correct,
                    hint: `Compare consecutive terms: ${seq[1]} − ${seq[0]} = ${step}, ${seq[2]} − ${seq[1]} = ${step}, ${seq[3]} − ${seq[2]} = ${step}.`,
                    solution: `The constant difference of ${step} means “add ${step} each time”.`,
                });
            },
            // legacy-keep: BODMAS flowchart — symbolic recall (Phase 3b policy)
            function generateBodmasFlow() {
                return makeLegacyNumeric({
                    descriptor: 'AC9M6A02',
                    context: 'bodmas-flowchart',
                    category: 'algebra',
                    title: 'BODMAS FLOWCHART',
                    prompt: 'Follow the flowchart order: **(8 + 4) × 2 − 6**. What is the result?',
                    answer: 18,
                    hint: 'Brackets first: 8 + 4 = 12. Then multiply: 12 × 2 = 24. Finally subtract 6.',
                    solution: '(8 + 4) × 2 − 6 = 12 × 2 − 6 = 24 − 6 = 18.',
                });
            },
            // legacy-keep: rule generation — symbolic recall (Phase 3b policy)
            function generateRuleFormula() {
                return makeLegacyNumeric({
                    descriptor: 'AC9M6A03',
                    context: 'rule-generation-formula',
                    category: 'algebra',
                    title: 'RULE GENERATION',
                    prompt: 'Input **3 → 10**, **4 → 13**, **5 → 16**. If the rule is **multiply by 3, then add 1**, what is the output for input **7**?',
                    answer: 22,
                    hint: '7 × 3 = 21, then add 1.',
                    solution: '7 × 3 + 1 = 22.',
                });
            },
            // legacy-keep: custom pattern run — apply stated rule (Phase 3b policy)
            function generateCustomPattern() {
                const n = 6;
                const ans = 2 * n + 5;
                return makeLegacyNumeric({
                    descriptor: 'AC9M6A03',
                    context: 'custom-pattern-run',
                    category: 'algebra',
                    title: 'CUSTOM PATTERN RUN',
                    prompt: `A machine uses the rule **output = 2 × input + 5**. What is the output when the input is **${n}**?`,
                    answer: ans,
                    hint: `Substitute ${n}: 2 × ${n} + 5.`,
                    solution: `2 × ${n} + 5 = ${ans}.`,
                });
            },
        ],
        measurement: [
            // legacy-keep: metric mass conversion — symbolic (Phase 3b policy)
            function generateMetricMass() {
                const kg = [1.5, 2.5, 0.75][Math.floor(Math.random() * 3)];
                const grams = Math.round(kg * 1000);
                return makeLegacyNumeric({
                    descriptor: 'AC9M6M01',
                    context: 'metric-slider-mass',
                    category: 'measurement',
                    title: 'METRIC SHIFT MASS',
                    prompt: `Convert **${kg} kg** to **grams**.`,
                    answer: grams,
                    label: 'g',
                    hint: 'Multiply kilograms by 1000 to get grams.',
                    solution: `${kg} kg = ${grams} g.`,
                    width: '120px',
                });
            },
            // legacy-keep: rectangle area formula — symbolic recall (Phase 3b policy)
            function generateAreaRect() {
                const w = 6;
                const h = 4;
                return makeLegacyNumeric({
                    descriptor: 'AC9M6M02',
                    context: 'area-formula-rect',
                    category: 'measurement',
                    title: 'RECTANGLE AREA FORMULA',
                    prompt: `A rectangle is **${w} cm** by **${h} cm**. What is its area in **cm²**?`,
                    answer: w * h,
                    hint: 'Area of a rectangle = length × width.',
                    solution: `${w} × ${h} = ${w * h} cm².`,
                });
            },
            // legacy-keep: composite area — symbolic recall (Phase 3b policy)
            function generateCompositeArea() {
                return makeLegacyNumeric({
                    descriptor: 'AC9M6M02',
                    context: 'composite-area-solver',
                    category: 'measurement',
                    title: 'COMPOSITE AREA SOLVER',
                    prompt: 'An L-shape is made from a **6×4** rectangle plus a **2×3** rectangle (no overlap). What is the **total area in cm²**?',
                    answer: 30,
                    hint: 'Find each rectangle area, then add: (6×4) + (2×3).',
                    solution: '6×4 = 24, 2×3 = 6. Total area = 24 + 6 = 30 cm².',
                });
            },
            // legacy-keep: timetable reading — symbolic recall (Phase 3b policy)
            function generateTimetable() {
                return makeLegacyChoice({
                    descriptor: 'AC9M6M03',
                    context: 'timetable-bus-schedule',
                    category: 'measurement',
                    title: 'BUS TIMETABLE READ',
                    prompt: 'Bus **Route 12** departs Central at **08:15** and arrives at North Station at **08:42**. How long is the journey?',
                    options: ['27 minutes', '17 minutes', '37 minutes', '42 minutes'],
                    correct: '27 minutes',
                    display: '<div style="font-size:0.9rem; padding:8px; border:1px solid var(--outline-variant); border-radius:4px;">Route 12 · Central 08:15 → North 08:42</div>',
                    hint: 'Subtract departure from arrival: 42 − 15 = 27 minutes (same hour).',
                    solution: '08:42 − 08:15 = 27 minutes.',
                });
            },
            // legacy-keep: itinerary duration — symbolic recall (Phase 3b policy)
            function generateItinerary() {
                return makeLegacyNumeric({
                    descriptor: 'AC9M6M03',
                    context: 'itinerary-calculations',
                    category: 'measurement',
                    title: 'ITINERARY CALCULATIONS',
                    prompt: 'A tour starts at **09:20** and ends at **11:05**. How many **minutes** long is the tour?',
                    answer: 105,
                    hint: 'From 09:20 to 10:00 is 40 min; from 10:00 to 11:05 is 65 min.',
                    solution: '40 + 65 = 105 minutes.',
                    width: '120px',
                });
            },
            // legacy-keep: straight-line angle sum — symbolic recall (Phase 3b policy)
            function generateStraightLineAngle() {
                const knownPool = [20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160];
                const known = knownPool[Math.floor(Math.random() * knownPool.length)];
                const unknown = 180 - known;
                const knownOnLeft = Math.random() < 0.5;
                const leftDeg = knownOnLeft ? known : unknown;
                const rightDeg = 180 - leftDeg;
                const vx = 160;
                const vy = 120;
                const rayLen = 78;
                const leftBaseDeg = 180;
                const rayDeg = 180 - leftDeg;
                const rayRad = (rayDeg * Math.PI) / 180;
                const rayX = vx + rayLen * Math.cos(rayRad);
                const rayY = vy - rayLen * Math.sin(rayRad);

                const labelRadius = 34;
                const leftMidDeg = leftBaseDeg - leftDeg / 2;
                const rightMidDeg = rayDeg / 2;
                const leftMidRad = (leftMidDeg * Math.PI) / 180;
                const rightMidRad = (rightMidDeg * Math.PI) / 180;
                const leftLabelX = vx + labelRadius * Math.cos(leftMidRad);
                const leftLabelY = vy - labelRadius * Math.sin(leftMidRad);
                const rightLabelX = vx + labelRadius * Math.cos(rightMidRad);
                const rightLabelY = vy - labelRadius * Math.sin(rightMidRad);

                const leftArcR = 22;
                const rightArcR = 22;
                function pointAt(deg, r) {
                    const rad = (deg * Math.PI) / 180;
                    return {
                        x: vx + r * Math.cos(rad),
                        y: vy - r * Math.sin(rad),
                    };
                }
                const leftArcStart = pointAt(180, leftArcR);
                const leftArcEnd = pointAt(rayDeg, leftArcR);
                const leftArcCtrl = pointAt(leftMidDeg, leftArcR * 0.62);
                const rightArcStart = pointAt(rayDeg, rightArcR);
                const rightArcEnd = pointAt(0, rightArcR);
                const rightArcCtrl = pointAt(rightMidDeg, rightArcR * 0.62);
                const leftLabel = knownOnLeft ? `${known}°` : '?°';
                const rightLabel = knownOnLeft ? '?°' : `${known}°`;
                const prompt = knownOnLeft
                    ? `On the straight-line diagram, the left angle is **${known}°** and the right angle is **?°**. Find the missing angle.`
                    : `On the straight-line diagram, the left angle is **?°** and the right angle is **${known}°**. Find the missing angle.`;
                const display = `
                    <div style="margin:8px auto 4px; max-width:320px; padding:8px; border:1px solid var(--outline-variant); border-radius:6px; background:color-mix(in srgb, var(--surface) 90%, var(--primary) 10%);">
                        <svg viewBox="0 0 320 170" style="width:100%; height:auto; display:block;" role="img" aria-label="Straight line with two adjacent angles, one known and one unknown">
                            <line x1="36" y1="120" x2="284" y2="120" stroke="var(--on-surface)" stroke-width="3" />
                            <line x1="${vx}" y1="${vy}" x2="${rayX.toFixed(2)}" y2="${rayY.toFixed(2)}" stroke="var(--primary)" stroke-width="3" />
                            <circle cx="${vx}" cy="${vy}" r="4" fill="var(--on-surface)" />
                            <path d="M${leftArcStart.x.toFixed(2)} ${leftArcStart.y.toFixed(2)} Q ${leftArcCtrl.x.toFixed(2)} ${leftArcCtrl.y.toFixed(2)} ${leftArcEnd.x.toFixed(2)} ${leftArcEnd.y.toFixed(2)}" fill="none" stroke="var(--primary)" stroke-width="2.5" />
                            <path d="M${rightArcStart.x.toFixed(2)} ${rightArcStart.y.toFixed(2)} Q ${rightArcCtrl.x.toFixed(2)} ${rightArcCtrl.y.toFixed(2)} ${rightArcEnd.x.toFixed(2)} ${rightArcEnd.y.toFixed(2)}" fill="none" stroke="var(--secondary)" stroke-width="2.5" />
                            <text x="${leftLabelX.toFixed(2)}" y="${leftLabelY.toFixed(2)}" fill="var(--primary)" font-size="15" font-weight="700">${leftLabel}</text>
                            <text x="${rightLabelX.toFixed(2)}" y="${rightLabelY.toFixed(2)}" fill="var(--secondary)" font-size="15" font-weight="700">${rightLabel}</text>
                            <text x="74" y="146" fill="var(--on-surface-variant)" font-size="12">Straight line</text>
                        </svg>
                    </div>
                `;
                return makeLegacyNumeric({
                    descriptor: 'AC9M6M04',
                    context: 'straight-line-angle',
                    category: 'measurement',
                    title: 'STRAIGHT LINE ANGLES',
                    prompt,
                    display,
                    answer: unknown,
                    label: '°',
                    hint: 'Angles on a straight line sum to 180°.',
                    solution: `180° − ${known}° = ${unknown}°.`,
                });
            },
        ],
        space: [
            // legacy-keep: prism cross-section — MCQ recall (Phase 3b policy)
            function generatePrismSlice() {
                return makeLegacyChoice({
                    descriptor: 'AC9M6SP01',
                    context: 'prism-cross-section',
                    category: 'space',
                    title: 'PRISM CROSS-SECTION',
                    prompt: 'A **cube** is sliced **parallel to its base**. What shape is the cross-section?',
                    options: ['Square', 'Triangle', 'Circle', 'Rectangle (not square)'],
                    correct: 'Square',
                    hint: 'Every face of a cube is a square. A slice parallel to the base matches that face.',
                    solution: 'A horizontal slice through a cube produces a square cross-section.',
                });
            },
            // legacy-keep: pyramid slice — MCQ recall (Phase 3b policy)
            function generatePyramidSlice() {
                return makeLegacyChoice({
                    descriptor: 'AC9M6SP01',
                    context: 'pyramid-slice-visual',
                    category: 'space',
                    title: 'PYRAMID SLICE VISUAL',
                    prompt: 'A **square pyramid** is sliced **parallel to its base**. What shape is the cross-section?',
                    options: ['Square', 'Triangle', 'Pentagon', 'Circle'],
                    correct: 'Square',
                    hint: 'The base is a square; a parallel slice near the base stays square (smaller).',
                    solution: 'A slice parallel to the base of a square pyramid is a square.',
                });
            },
            // legacy-keep: tessellation rotation — MCQ recall (Phase 3b policy)
            function generateTessellation() {
                return makeLegacyChoice({
                    descriptor: 'AC9M6SP03',
                    context: 'tessellation-rotations',
                    category: 'space',
                    title: 'TESSELLATION ROTATIONS',
                    prompt: 'A regular **hexagon** is rotated **60°** about its centre. How many times does it match its original position in one full **360°** turn?',
                    options: ['6', '3', '4', '8'],
                    correct: '6',
                    hint: '360° ÷ 60° = 6 rotational symmetries for a regular hexagon.',
                    solution: 'A regular hexagon has 6-fold rotational symmetry: 360 ÷ 60 = 6.',
                });
            },
            // legacy-keep: tile matching — MCQ recall (Phase 3b policy)
            function generateTileMatch() {
                return makeLegacyChoice({
                    descriptor: 'AC9M6SP03',
                    context: 'tile-matching-puzzles',
                    category: 'space',
                    title: 'TILE MATCHING PUZZLE',
                    prompt: 'Which regular polygon **tessellates the plane by itself** with no gaps?',
                    options: ['Equilateral triangle', 'Regular pentagon', 'Regular octagon', 'None of these'],
                    correct: 'Equilateral triangle',
                    hint: 'Interior angles must divide 360° evenly. Triangles (60°), squares (90°), and hexagons (120°) work — pentagons do not.',
                    solution: 'Equilateral triangles tessellate (60° × 6 = 360°). Regular pentagons do not.',
                });
            },
        ],
        statistics: [
            // legacy-keep: distribution comparison — MCQ recall (Phase 3b policy)
            function generateDistributionMatch() {
                return makeLegacyChoice({
                    descriptor: 'AC9M6ST01',
                    context: 'distribution-match',
                    category: 'statistics',
                    title: 'DISTRIBUTION MATCH',
                    prompt: 'Dataset A: **2, 2, 2, 8, 8**. Dataset B: **3, 4, 5, 6, 7**. Which has the **higher mode**?',
                    options: ['Dataset A (mode 2)', 'Dataset B (mode 5)', 'Both equal', 'Neither has a mode'],
                    correct: 'Dataset A (mode 2)',
                    hint: 'Mode = most frequent value. Compare the highest frequency in each set.',
                    solution: 'Dataset A’s mode is 2 (appears 3 times). Dataset B has no repeated value — Dataset A has the clearer mode.',
                });
            },
            // legacy-keep: media graph critique — MCQ recall (Phase 3b policy)
            function generateMediaGraph() {
                return makeLegacyChoice({
                    descriptor: 'AC9M6ST02',
                    context: 'media-graph-errors',
                    category: 'statistics',
                    title: 'MEDIA GRAPH ERRORS',
                    prompt: 'A bar chart **truncates the y-axis at 90** instead of 0, making a small change look huge. What error is this?',
                    options: ['Misleading axis scale', 'Wrong sample size', 'Correct rounding', 'Missing title only'],
                    correct: 'Misleading axis scale',
                    hint: 'When the axis does not start at zero, differences appear exaggerated.',
                    solution: 'Truncating the y-axis is a misleading scale error common in media graphs.',
                });
            },
            // legacy-keep: survey bias — MCQ recall (Phase 3b policy)
            function generateBiasCheck() {
                return makeLegacyChoice({
                    descriptor: 'AC9M6ST02',
                    context: 'bias-checks',
                    category: 'statistics',
                    title: 'BIAS CHECKS',
                    prompt: 'A survey asks **“Don’t you love our new canteen food?”** at the canteen exit. What bias is most likely?',
                    options: ['Leading question bias', 'Random sampling', 'Large sample size', 'No bias'],
                    correct: 'Leading question bias',
                    hint: 'The wording pushes a positive answer; location also skews who is asked.',
                    solution: 'Leading questions and convenience sampling both introduce bias.',
                });
            },
            // legacy-keep: investigation conclusion — MCQ recall (Phase 3b policy)
            function generateInvestigationConclusion() {
                return makeLegacyChoice({
                    descriptor: 'AC9M6ST03',
                    context: 'investigation-conclusion',
                    category: 'statistics',
                    title: 'INVESTIGATION CONCLUSION',
                    prompt: 'A class surveys **30 students** and finds **18 prefer soccer**. Which conclusion is **best supported**?',
                    options: [
                        'About 60% of this class prefer soccer',
                        'All students in the country prefer soccer',
                        'Soccer is the only valid sport',
                        'The survey proves causation',
                    ],
                    correct: 'About 60% of this class prefer soccer',
                    hint: 'Conclusions should match the sample — not over-generalise beyond the data collected.',
                    solution: '18/30 = 60%. The data supports a claim about this class, not the whole population.',
                });
            },
            // legacy-keep: data set analysis — symbolic recall (Phase 3b policy)
            function generateDataSetAnalysis() {
                const data = [4, 6, 8, 10, 12];
                const mean = data.reduce((a, b) => a + b, 0) / data.length;
                return makeLegacyNumeric({
                    descriptor: 'AC9M6ST03',
                    context: 'data-set-analysis',
                    category: 'statistics',
                    title: 'DATA SET ANALYSIS',
                    prompt: `Find the **mean** of: **${data.join(', ')}**.`,
                    answer: mean,
                    hint: 'Mean = sum of values ÷ count of values.',
                    solution: `Sum = ${data.reduce((a, b) => a + b, 0)}. Mean = ${data.reduce((a, b) => a + b, 0)} ÷ ${data.length} = ${mean}.`,
                });
            },
        ],
        probability: [
            // legacy-keep: fraction ↔ decimal probability — MathLive entry (Phase 3b policy)
            function generateFracDecProb() {
                return makeLegacyMathField({
                    descriptor: 'AC9M6P01',
                    context: 'fraction-decimal-probability',
                    category: 'probability',
                    title: 'FRACTION ↔ DECIMAL PROBABILITY',
                    prompt: 'Express the probability **0.25** as a **fraction in simplest form**.',
                    equals: 0.25,
                    form: 'simplest',
                    latex: '\\frac{1}{4}',
                    hint: '0.25 = 25/100. Simplify by dividing numerator and denominator by 25.',
                    solution: '0.25 = 25/100 = 1/4.',
                });
            },
        ],
    };

    // ----------------------------------------------------
    // Question Generators mapping to year 6 descriptors
    // ----------------------------------------------------
    const questions = {
        number: [
            // AC9M6N01: negative number lines (canonical — drag-pin number-line widget)
            function generateN01() {
                const target = -(Math.floor(Math.random() * 15) + 1); // -1 to -15
                let initialValue = 0;
                if (initialValue === target) {
                    initialValue = target > -15 ? target - 1 : target + 1;
                }

                return {
                    descriptor: 'AC9M6N01',
                    context: 'negative-number-line',
                    category: 'number',
                    title: 'INTEGERS ON NUMBER LINE',
                    prompt: `Drag the pin to **${target}** on the number line.`,
                    widgets: [
                        {
                            id: 'line',
                            type: 'number-line',
                            config: {
                                mode: 'place-point',
                                band: 'C',
                                min: -15,
                                max: 3,
                                snapStep: 1,
                                ticks: { major: 1, minor: 1, labels: 'zero' },
                                initialValue: initialValue,
                                token: 'pin',
                                showFractionLabels: false,
                            },
                        },
                    ],
                    inputs: [],
                    evaluate(values) {
                        return values.line === target;
                    },
                    hint: {
                        text: 'Use the 0 marker as your anchor, then count left one tick at a time to place negative values.',
                        highlight: ['line'],
                    },
                    solution: {
                        text: `The pin belongs at ${target}.`,
                        show: { line: target },
                    },
                    points: 10,
                };
            },
            // AC9M6N01: four-quadrant coordinate read (canonical — coordinate-plotter)
            function generateN01cartesian() {
                function pickCoord() {
                    let x;
                    let y;
                    do {
                        x = Math.floor(Math.random() * 9) - 4;
                        y = Math.floor(Math.random() * 9) - 4;
                    } while (x === 0 && y === 0);
                    return { x, y };
                }

                const a = pickCoord();
                let b = pickCoord();
                while (b.x === a.x && b.y === a.y) {
                    b = pickCoord();
                }

                return {
                    descriptor: 'AC9M6N01',
                    context: 'cartesian-four-quadrants',
                    category: 'number',
                    title: 'CARTESIAN QUADRANT READOUT',
                    prompt: 'Read the coordinates of points **A** and **B** on the four-quadrant plane.',
                    widgets: [
                        {
                            id: 'grid',
                            type: 'coordinate-plotter',
                            config: {
                                mode: 'read-point',
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
                                markers: [
                                    { x: a.x, y: a.y, label: 'A' },
                                    { x: b.x, y: b.y, label: 'B' },
                                ],
                                draggable: false,
                            },
                        },
                    ],
                    inputs: [
                        {
                            id: 'coordsA',
                            type: 'coordinate-pair',
                            config: { prefix: 'A = (', band: 'C' },
                        },
                        {
                            id: 'coordsB',
                            type: 'coordinate-pair',
                            config: { prefix: 'B = (', band: 'C' },
                        },
                    ],
                    evaluate(values) {
                        return (
                            values.coordsA &&
                            values.coordsB &&
                            values.coordsA.x === a.x &&
                            values.coordsA.y === a.y &&
                            values.coordsB.x === b.x &&
                            values.coordsB.y === b.y
                        );
                    },
                    hint: {
                        text: 'For each point, read how far along the x-axis (left or right from 0), then the y-axis (up or down from 0). Quadrant I is top-right; II top-left; III bottom-left; IV bottom-right.',
                        highlight: ['grid'],
                    },
                    solution: {
                        text: `Point A is at (${a.x}, ${a.y}). Point B is at (${b.x}, ${b.y}).`,
                        show: {
                            grid: { x: a.x, y: a.y },
                            coordsA: { x: a.x, y: a.y },
                            coordsB: { x: b.x, y: b.y },
                        },
                    },
                    points: 10,
                };
            },
            // AC9M6N02: Prime/Composite sorting (legacy-keep — radio MCQ)
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
                    category: 'number',
                    title: 'NUMBER CLASSIFICATION',
                    prompt: `Classify the number **${val}**:`,
                    widgets: [
                        {
                            id: 'display',
                            type: 'legacy-passthrough',
                            config: {
                                render: (container) => {
                                    container.innerHTML = `
                                        <div class="flex-col align-center gap-8">
                                            <div style="font-size:2.5rem; font-weight:700; color:var(--primary);">${val}</div>
                                        </div>
                                    `;
                                },
                            },
                        },
                    ],
                    inputs: [
                        {
                            id: 'choice',
                            type: 'select-input',
                            config: {
                                label: 'Classification:',
                                width: '200px',
                                options: [
                                    { value: '', label: 'Choose…' },
                                    { value: 'prime', label: 'Prime' },
                                    { value: 'composite', label: 'Composite' },
                                    { value: 'square', label: 'Square' },
                                ],
                            },
                        },
                    ],
                    evaluate(values) {
                        return values.choice === correct;
                    },
                    hint: {
                        text: 'A prime number has only 2 factors (1 and itself). A composite number has more than 2 factors. A square number is the result of multiplying an integer by itself (e.g. 4 × 4 = 16).',
                        highlight: ['choice'],
                    },
                    solution: {
                        text: `The number ${val} is classified as a ${correct.toUpperCase()} number.`,
                        show: { choice: correct },
                    },
                    points: 10,
                };
            },
            // AC9M6N02: Multiple sieve shading (canonical — number-track)
            function generateN02Sieve() {
                const divisors = [2, 3, 5];
                const divisor = divisors[Math.floor(Math.random() * divisors.length)];
                const min = 2;
                const max = 30;
                const expectedMultiples = [];
                for (let n = min; n <= max; n++) {
                    if (n % divisor === 0) expectedMultiples.push(n);
                }

                return {
                    descriptor: 'AC9M6N02',
                    context: 'prime-composite-sort',
                    category: 'number',
                    title: 'MULTIPLE SIEVE SHADING',
                    prompt: `Tap every multiple of **${divisor}** on the number track from **${min}** to **${max}**. Shade each multiple exactly once.`,
                    widgets: [
                        {
                            id: 'track',
                            type: 'number-track',
                            config: {
                                mode: 'sieve-shade',
                                band: 'C',
                                min,
                                max,
                                divisor,
                                columns: 10,
                            },
                        },
                    ],
                    inputs: [],
                    evaluate(values) {
                        const shaded = values.track || [];
                        if (shaded.length !== expectedMultiples.length) return false;
                        const set = new Set(shaded);
                        return expectedMultiples.every((n) => set.has(n));
                    },
                    hint: {
                        text: `Start at ${divisor} and keep adding ${divisor}: ${expectedMultiples.slice(0, 6).join(', ')}${expectedMultiples.length > 6 ? '…' : ''}. Tap each to shade it.`,
                        highlight: ['track'],
                    },
                    solution: {
                        text: `Multiples of ${divisor} from ${min} to ${max}: ${expectedMultiples.join(', ')}.`,
                        show: { track: expectedMultiples },
                    },
                    points: 10,
                };
            },
            // AC9M6N05: Fraction addition/subtraction (canonical — math-field)
            function generateN05() {
                const sameDenominators = [5, 6, 7, 8, 10, 12];
                const mixedPairs = [
                    [2, 4],
                    [3, 6],
                    [4, 8],
                    [5, 10],
                    [6, 12],
                    [3, 12],
                    [4, 12],
                    [5, 15],
                ];
                const targetResultDenominators = [2, 3, 4, 5, 6, 7, 8, 10, 12, 15];

                function gcd(a, b) {
                    a = Math.abs(Math.trunc(a));
                    b = Math.abs(Math.trunc(b));
                    while (b) {
                        const t = b;
                        b = a % b;
                        a = t;
                    }
                    return a || 1;
                }

                function lcm(a, b) {
                    return Math.abs(a * b) / gcd(a, b);
                }

                function simplify(num, den) {
                    const sign = num < 0 ? -1 : 1;
                    const g = gcd(num, den);
                    return { num: sign * (Math.abs(num) / g), den: den / g };
                }

                function pickInt(min, max) {
                    return min + Math.floor(Math.random() * (max - min + 1));
                }

                function pickNumerator(den) {
                    return pickInt(1, den - 1);
                }

                function buildHint(aNum, aDen, bNum, bDen, op, commonDen) {
                    if (aDen === bDen) {
                        return `Both fractions already have denominator ${aDen}, so ${op === '+' ? 'add' : 'subtract'} numerators, keep denominator ${aDen}, then simplify.`;
                    }
                    return `Use a common denominator of ${commonDen}. Convert ${aNum}/${aDen} and ${bNum}/${bDen} to /${commonDen}, then ${op === '+' ? 'add' : 'subtract'} and simplify.`;
                }

                function buildQuestion() {
                    const useMixedPair = Math.random() < 0.6;
                    let d1;
                    let d2;
                    if (useMixedPair) {
                        [d1, d2] = mixedPairs[Math.floor(Math.random() * mixedPairs.length)];
                    } else {
                        d1 = sameDenominators[Math.floor(Math.random() * sameDenominators.length)];
                        d2 = d1;
                    }

                    const op = Math.random() < 0.5 ? '+' : '-';
                    const n1 = pickNumerator(d1);
                    const n2 = pickNumerator(d2);
                    const commonDen = lcm(d1, d2);
                    const scaled1 = n1 * (commonDen / d1);
                    const scaled2 = n2 * (commonDen / d2);
                    const rawNum = op === '+' ? scaled1 + scaled2 : scaled1 - scaled2;

                    if (rawNum <= 0 || rawNum >= commonDen) return null;

                    const simplified = simplify(rawNum, commonDen);
                    if (!targetResultDenominators.includes(simplified.den)) return null;

                    return {
                        eq: `${n1}/${d1} ${op} ${n2}/${d2}`,
                        ansNum: simplified.num,
                        ansDen: simplified.den,
                        hint: buildHint(n1, d1, n2, d2, op, commonDen),
                    };
                }

                let q = null;
                for (let i = 0; i < 12; i += 1) {
                    q = buildQuestion();
                    if (q) break;
                }
                if (!q) {
                    q = {
                        eq: '3/4 - 1/2',
                        ansNum: 1,
                        ansDen: 4,
                        hint: 'Convert to denominator 4, subtract numerators, then simplify.',
                    };
                }
                const correctVal = q.ansNum / q.ansDen;

                return {
                    descriptor: 'AC9M6N05',
                    context: 'fraction-add-sub-sums',
                    category: 'number',
                    title: 'FRACTION OPERATIONS',
                    prompt: `Solve the following fraction sum and simplify your answer: **${q.eq}**`,
                    widgets: [],
                    inputs: [
                        {
                            id: 'ans',
                            type: 'math-field',
                            config: {
                                band: 'C',
                                keyboard: 'fractions-y5',
                                expect: 'fraction',
                                placeholder: '\\frac{?}{?}',
                                ariaLabel: 'Simplified fraction answer',
                            },
                        },
                    ],
                    evaluate(values) {
                        if (MCS.input.isEmpty(values.ans)) return false;
                        return MCS.input.check(values.ans, {
                            equals: correctVal,
                            form: 'simplest',
                            tolerance: 1e-9,
                        });
                    },
                    hint: {
                        text: q.hint,
                        highlight: ['ans'],
                    },
                    solution: {
                        text: `The simplified fraction result is ${q.ansNum}/${q.ansDen}.`,
                        show: { ans: { latex: `\\frac{${q.ansNum}}{${q.ansDen}}` } },
                    },
                    points: 10,
                };
            },
            // AC9M6N07: Percentage discounts (canonical — number-input)
            function generateN07() {
                const originalPrice = [20, 40, 50, 80, 100, 120, 200][Math.floor(Math.random() * 7)];
                const discountPct = [10, 25, 50, 20][Math.floor(Math.random() * 4)];
                const discountAmt = (originalPrice * discountPct) / 100;
                const finalPrice = originalPrice - discountAmt;

                return {
                    descriptor: 'AC9M6N07',
                    context: 'percentage-discount',
                    category: 'number',
                    title: 'SHOPPING DISCOUNT CALIBRATOR',
                    prompt: `A jacket originally costs **$${originalPrice}**. It is currently discounted by **${discountPct}%**. What is the new final price?`,
                    widgets: [],
                    inputs: [
                        {
                            id: 'price',
                            type: 'number-input',
                            config: {
                                label: '$',
                                placeholder: '?',
                                width: '100px',
                                ariaLabel: 'Final price in dollars',
                            },
                        },
                    ],
                    evaluate(values) {
                        return values.price === finalPrice;
                    },
                    hint: {
                        text: `Find ${discountPct}% of $${originalPrice} by dividing by 100 and multiplying, then subtract that discount from the original price.`,
                        highlight: ['price'],
                    },
                    solution: {
                        text: `A ${discountPct}% discount on $${originalPrice} is $${discountAmt}. The final price is $${finalPrice}.`,
                        show: { price: finalPrice },
                    },
                    points: 10,
                };
            }
        ],
        algebra: [
            // AC9M6A02: BODMAS Brackets (legacy-keep — symbolic recall)
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
                    category: 'algebra',
                    title: 'ORDER OF OPERATIONS (BODMAS)',
                    prompt: `Solve the bracketed equation: **${q.eq}**`,
                    widgets: [
                        {
                            id: 'display',
                            type: 'legacy-passthrough',
                            config: {
                                render: (container) => {
                                    container.innerHTML = `
                                        <div class="flex-col align-center gap-8">
                                            <div style="font-size:1.8rem; font-weight:700; color:var(--primary);">${q.eq}</div>
                                        </div>
                                    `;
                                },
                            },
                        },
                    ],
                    inputs: [
                        {
                            id: 'ans',
                            type: 'number-input',
                            config: { placeholder: '?', ariaLabel: 'Numeric answer' },
                        },
                    ],
                    evaluate(values) {
                        return values.ans === q.ans;
                    },
                    hint: {
                        text: 'Remember BODMAS: Brackets first, then Orders (powers), Division & Multiplication (left to right), and finally Addition & Subtraction (left to right).',
                        highlight: ['display'],
                    },
                    solution: {
                        text: `Evaluating brackets first: ${q.eq} = ${q.ans}.`,
                        show: { ans: q.ans },
                    },
                    points: 10,
                };
            }
        ],
        measurement: [
            // AC9M6M01: Metric conversion length (legacy-keep — symbolic conversion)
            function generateM01() {
                const km = [1.5, 2.75, 0.5, 4.2][Math.floor(Math.random() * 4)];
                const m = km * 1000;
                return {
                    descriptor: 'AC9M6M01',
                    context: 'metric-slider-length',
                    category: 'measurement',
                    title: 'METRIC SHIFT LENGTHS',
                    prompt: `Convert **${km} km** into meters:`,
                    widgets: [],
                    inputs: [
                        {
                            id: 'ans',
                            type: 'number-input',
                            config: {
                                label: 'meters',
                                placeholder: '?',
                                width: '120px',
                                ariaLabel: 'Length in meters',
                            },
                        },
                    ],
                    evaluate(values) {
                        return values.ans === m;
                    },
                    hint: {
                        text: 'There are 1000 meters in 1 kilometer. Multiply the kilometer value by 1000 (shift the decimal place three spaces to the right).',
                        highlight: ['ans'],
                    },
                    solution: {
                        text: `${km} km = ${m} meters.`,
                        show: { ans: m },
                    },
                    points: 10,
                };
            },
            // AC9M6M04: Angle opposite solver (legacy-keep — angle fact recall)
            function generateM04() {
                const anglePool = [20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160];
                const angleVal = anglePool[Math.floor(Math.random() * anglePool.length)];
                const supplementary = 180 - angleVal;

                const vx = 160;
                const vy = 86;
                const lineLen = 116;
                const diag1Deg = 15 + Math.floor(Math.random() * 51); // 15..65 for orientation variety
                const diag2Deg = diag1Deg + angleVal;
                const d1r = (diag1Deg * Math.PI) / 180;
                const d2r = (diag2Deg * Math.PI) / 180;
                const d1x1 = vx - lineLen * Math.cos(d1r);
                const d1y1 = vy + lineLen * Math.sin(d1r);
                const d1x2 = vx + lineLen * Math.cos(d1r);
                const d1y2 = vy - lineLen * Math.sin(d1r);
                const d2x1 = vx - lineLen * Math.cos(d2r);
                const d2y1 = vy + lineLen * Math.sin(d2r);
                const d2x2 = vx + lineLen * Math.cos(d2r);
                const d2y2 = vy - lineLen * Math.sin(d2r);

                const labelRadiusA = 34;
                const labelRadiusB = 48;
                const midA = (diag1Deg + diag2Deg) / 2;
                const midAOpp = midA + 180;
                const midB = midA + 90;
                const midBOpp = midB + 180;
                const midARad = (midA * Math.PI) / 180;
                const midAOppRad = (midAOpp * Math.PI) / 180;
                const midBRad = (midB * Math.PI) / 180;
                const midBOppRad = (midBOpp * Math.PI) / 180;

                const labelAX = vx + labelRadiusA * Math.cos(midARad);
                const labelAY = vy - labelRadiusA * Math.sin(midARad);
                const labelAOppX = vx + labelRadiusA * Math.cos(midAOppRad);
                const labelAOppY = vy - labelRadiusA * Math.sin(midAOppRad);
                const labelBX = vx + labelRadiusB * Math.cos(midBRad);
                const labelBY = vy - labelRadiusB * Math.sin(midBRad);
                const labelBOppX = vx + labelRadiusB * Math.cos(midBOppRad);
                const labelBOppY = vy - labelRadiusB * Math.sin(midBOppRad);

                const arcRA = 22;
                const angleLarge = angleVal > 90 ? 1 : 0;
                const aStartX = vx + arcRA * Math.cos(d1r);
                const aStartY = vy - arcRA * Math.sin(d1r);
                const aEndX = vx + arcRA * Math.cos(d2r);
                const aEndY = vy - arcRA * Math.sin(d2r);
                const aOppStartX = vx - arcRA * Math.cos(d1r);
                const aOppStartY = vy + arcRA * Math.sin(d1r);
                const aOppEndX = vx - arcRA * Math.cos(d2r);
                const aOppEndY = vy + arcRA * Math.sin(d2r);

                const display = `
                    <div style="margin:8px auto 4px; max-width:320px; padding:8px; border:1px solid var(--outline-variant); border-radius:6px; background:color-mix(in srgb, var(--surface) 90%, var(--primary) 10%);">
                        <svg viewBox="0 0 320 180" style="width:100%; height:auto; display:block;" role="img" aria-label="Two intersecting lines with vertically opposite angles">
                            <line x1="${d1x1.toFixed(2)}" y1="${d1y1.toFixed(2)}" x2="${d1x2.toFixed(2)}" y2="${d1y2.toFixed(2)}" stroke="var(--on-surface)" stroke-width="3" />
                            <line x1="${d2x1.toFixed(2)}" y1="${d2y1.toFixed(2)}" x2="${d2x2.toFixed(2)}" y2="${d2y2.toFixed(2)}" stroke="var(--on-surface)" stroke-width="3" />
                            <circle cx="${vx}" cy="${vy}" r="4" fill="var(--on-surface)" />

                            <path d="M${aStartX.toFixed(2)} ${aStartY.toFixed(2)} A ${arcRA} ${arcRA} 0 ${angleLarge} 1 ${aEndX.toFixed(2)} ${aEndY.toFixed(2)}" fill="none" stroke="var(--primary)" stroke-width="2.5" />
                            <path d="M${aOppStartX.toFixed(2)} ${aOppStartY.toFixed(2)} A ${arcRA} ${arcRA} 0 ${angleLarge} 1 ${aOppEndX.toFixed(2)} ${aOppEndY.toFixed(2)}" fill="none" stroke="var(--primary)" stroke-width="2.5" />

                            <text x="${labelAX.toFixed(2)}" y="${labelAY.toFixed(2)}" fill="var(--primary)" font-size="14" font-weight="700">${angleVal}°</text>
                            <text x="${labelAOppX.toFixed(2)}" y="${labelAOppY.toFixed(2)}" fill="var(--primary)" font-size="14" font-weight="700">?°</text>
                            <text x="${labelBX.toFixed(2)}" y="${labelBY.toFixed(2)}" fill="var(--secondary)" font-size="12" font-weight="700">${supplementary}°</text>
                            <text x="${labelBOppX.toFixed(2)}" y="${labelBOppY.toFixed(2)}" fill="var(--secondary)" font-size="12" font-weight="700">${supplementary}°</text>
                        </svg>
                    </div>
                `;

                return {
                    descriptor: 'AC9M6M04',
                    context: 'opposite-angle-solver',
                    category: 'measurement',
                    title: 'INTERSECTING LINES ANGLES',
                    prompt: `Two straight lines intersect as shown. If one angle is **${angleVal}°**, what is its vertically opposite angle?`,
                    widgets: [
                        {
                            id: 'display',
                            type: 'legacy-passthrough',
                            config: {
                                render: (container) => {
                                    container.innerHTML = display;
                                },
                            },
                        },
                    ],
                    inputs: [
                        {
                            id: 'ans',
                            type: 'number-input',
                            config: {
                                label: '°',
                                placeholder: '?',
                                ariaLabel: 'Angle in degrees',
                            },
                        },
                    ],
                    evaluate(values) {
                        return values.ans === angleVal;
                    },
                    hint: {
                        text: `Vertically opposite angles are equal. The angle opposite ${angleVal}° will be the same.`,
                        highlight: ['ans'],
                    },
                    solution: {
                        text: `The vertically opposite angle is equal to ${angleVal}°.`,
                        show: { ans: angleVal },
                    },
                    points: 10,
                };
            }
        ],
        space: [
            // AC9M6SP02: Plot a point on four-quadrant grid (canonical)
            function generateSP02plot() {
                const x = Math.floor(Math.random() * 9) - 4;
                const y = Math.floor(Math.random() * 9) - 4;
                let initialX = 0;
                let initialY = 0;
                if (initialX === x && initialY === y) {
                    initialX = x > -4 ? x - 1 : x + 1;
                }

                return {
                    descriptor: 'AC9M6SP02',
                    context: 'four-quadrant-plotter',
                    category: 'space',
                    title: 'PLOT THE WAYPOINT',
                    prompt: `Tap or drag the pin to plot the point **(${x}, ${y})**.`,
                    widgets: [
                        {
                            id: 'grid',
                            type: 'coordinate-plotter',
                            config: {
                                mode: 'plot-point',
                                band: 'C',
                                quadrants: 4,
                                xMin: -5,
                                xMax: 5,
                                yMin: -5,
                                yMax: 5,
                                snap: 1,
                                showAxes: true,
                                showGrid: true,
                                pinCount: 1,
                                labels: 'axis',
                                initialX,
                                initialY,
                            },
                        },
                    ],
                    inputs: [],
                    evaluate(values) {
                        return values.grid && values.grid.x === x && values.grid.y === y;
                    },
                    hint: {
                        text: `Start at the origin (0, 0). Move ${Math.abs(x)} unit${Math.abs(x) === 1 ? '' : 's'} ${x >= 0 ? 'right' : 'left'}, then ${Math.abs(y)} unit${Math.abs(y) === 1 ? '' : 's'} ${y >= 0 ? 'up' : 'down'}.`,
                        highlight: ['grid'],
                    },
                    solution: {
                        text: `The point belongs at **(${x}, ${y})**.`,
                        show: { grid: { x, y } },
                    },
                    points: 10,
                };
            },
            // AC9M6SP02: Read coordinates of a fixed point (canonical)
            function generateSP02read() {
                const x = Math.floor(Math.random() * 9) - 4;
                const y = Math.floor(Math.random() * 9) - 4;

                return {
                    descriptor: 'AC9M6SP02',
                    context: 'four-quadrant-reads',
                    category: 'space',
                    title: 'READ THE WAYPOINT',
                    prompt: 'What are the coordinates of point **P**?',
                    widgets: [
                        {
                            id: 'grid',
                            type: 'coordinate-plotter',
                            config: {
                                mode: 'read-point',
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
                                markers: [{ x, y, label: 'P', fixed: true }],
                                draggable: false,
                            },
                        },
                    ],
                    inputs: [
                        {
                            id: 'coords',
                            type: 'coordinate-pair',
                            config: {},
                        },
                    ],
                    evaluate(values) {
                        return values.coords && values.coords.x === x && values.coords.y === y;
                    },
                    hint: {
                        text: `Find how far point P is from the origin along the x-axis (${x >= 0 ? 'right' : 'left'}), then the y-axis (${y >= 0 ? 'up' : 'down'}).`,
                        highlight: ['grid'],
                    },
                    solution: {
                        text: `Point P is at **(${x}, ${y})**.`,
                        show: { grid: { x, y }, coords: { x, y } },
                    },
                    points: 10,
                };
            },
        ],
        statistics: [
            // AC9M6ST01: Range calculation (legacy-keep — numeric recall)
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
                    category: 'statistics',
                    title: 'DATASET RANGE DIAGNOSTICS',
                    prompt: `Calculate the range for the dataset: **[ ${raw.join(', ')} ]**`,
                    widgets: [],
                    inputs: [
                        {
                            id: 'ans',
                            type: 'number-input',
                            config: { placeholder: '?', ariaLabel: 'Range' },
                        },
                    ],
                    evaluate(values) {
                        return values.ans === range;
                    },
                    hint: {
                        text: `The range of a dataset is the difference between the maximum (highest) value and the minimum (lowest) value: Range = ${max} - ${min}.`,
                        highlight: ['ans'],
                    },
                    solution: {
                        text: `Max value is ${max}, Min value is ${min}. Range = ${max} - ${min} = ${range}.`,
                        show: { ans: range },
                    },
                    points: 10,
                };
            }
        ],
        probability: [
            // AC9M6P01: Convert probabilities (canonical — math-field)
            function generateP01() {
                const fraction = '3/4';
                const percent = 75;

                return {
                    descriptor: 'AC9M6P01',
                    context: 'chance-percentage-slider',
                    category: 'probability',
                    title: 'PROBABILITY SCALES MAPPING',
                    prompt: `A probability is represented as **${fraction}**. Convert this representation to percentage notation (enter a whole number, without the % sign):`,
                    widgets: [],
                    inputs: [
                        {
                            id: 'ans',
                            type: 'math-field',
                            config: {
                                band: 'C',
                                keyboard: 'integers',
                                expect: 'integer',
                                placeholder: '?',
                                ariaLabel: 'Percentage answer',
                            },
                        },
                    ],
                    evaluate(values) {
                        if (MCS.input.isEmpty(values.ans)) return false;
                        return MCS.input.check(values.ans, {
                            equals: percent,
                            form: 'any',
                        });
                    },
                    hint: {
                        text: 'To convert 3/4 to a percentage, divide 3 by 4 to get 0.75, then multiply by 100.',
                        highlight: ['ans'],
                    },
                    solution: {
                        text: `3/4 = 0.75 = ${percent}%.`,
                        show: { ans: { latex: String(percent) } },
                    },
                    points: 10,
                };
            },
            // AC9M6P02: Large trial spinner record (canonical — spinner widget)
            function generateP02LargeTrial() {
                const labels = SPINNER_SECTORS.map((s) => s.label);
                const targetLabel = labels[Math.floor(Math.random() * labels.length)];

                return {
                    descriptor: 'AC9M6P02',
                    context: 'large-trial-spinner',
                    category: 'probability',
                    title: 'LARGE TRIAL SPINNER SIMULATOR',
                    prompt: `Run **${LARGE_TRIAL_COUNT} spins** on the fair four-sector spinner, then record how many times sector **${targetLabel}** appeared.`,
                    widgets: [
                        {
                            id: 'spinner',
                            type: 'spinner',
                            config: {
                                mode: 'experiment',
                                band: 'C',
                                sectors: SPINNER_SECTORS,
                                trialCount: LARGE_TRIAL_COUNT,
                            },
                        },
                    ],
                    inputs: [
                        {
                            id: 'count',
                            type: 'number-input',
                            config: {
                                label: `Count for ${targetLabel}:`,
                                placeholder: '?',
                                width: '90px',
                                ariaLabel: `Frequency count for sector ${targetLabel}`,
                            },
                        },
                    ],
                    evaluate(values) {
                        if (!values.spinner || !values.spinner.trialsComplete) return false;
                        const actual = values.spinner.frequencies[targetLabel] || 0;
                        return values.count === actual;
                    },
                    hint: {
                        text: `After all ${LARGE_TRIAL_COUNT} spins finish, read the tally bar for sector ${targetLabel}. Large trials still vary around the expected 25% (about 12–13 for ${targetLabel}), but your answer must match the simulation tally exactly.`,
                        highlight: ['spinner'],
                    },
                    solution: {
                        text: '',
                        show: { spinner: {} },
                    },
                    points: 10,
                    requiresTrials: true,
                    wireSession(session, ui) {
                        wireSpinnerTrialSession(session, ui, {
                            spinnerId: 'spinner',
                            inputIds: ['count'],
                            onTrialsComplete(session, spinState) {
                                const freq = spinState.frequencies[targetLabel] || 0;
                                session.question.solution.text = `Sector ${targetLabel} appeared **${freq}** times out of ${LARGE_TRIAL_COUNT} spins.`;
                                const countInst = session.instances.count;
                                if (countInst && typeof countInst.showSolution === 'function') {
                                    countInst.showSolution(freq);
                                }
                            },
                        });
                    },
                };
            },
            // AC9M6P02: Frequency comparison after large trial (canonical — spinner widget)
            function generateP02FrequencyCompare() {
                const labels = SPINNER_SECTORS.map((s) => s.label);

                return {
                    descriptor: 'AC9M6P02',
                    context: 'frequency-comparison',
                    category: 'probability',
                    title: 'FREQUENCY COMPARISON LAB',
                    prompt: `Run **${LARGE_TRIAL_COUNT} spins** on the fair spinner, then identify which sector had the **highest** frequency.`,
                    widgets: [
                        {
                            id: 'spinner',
                            type: 'spinner',
                            config: {
                                mode: 'experiment',
                                band: 'C',
                                sectors: SPINNER_SECTORS,
                                trialCount: LARGE_TRIAL_COUNT,
                            },
                        },
                    ],
                    inputs: [
                        {
                            id: 'most',
                            type: 'select-input',
                            config: {
                                label: 'Highest frequency:',
                                width: '160px',
                                options: [
                                    { value: '', label: 'Choose…' },
                                    ...labels.map((l) => ({ value: l, label: `Sector ${l}` })),
                                ],
                            },
                        },
                    ],
                    evaluate(values) {
                        if (!values.spinner || !values.spinner.trialsComplete || !values.most) {
                            return false;
                        }
                        const freqs = values.spinner.frequencies;
                        const max = Math.max(...labels.map((l) => freqs[l] || 0));
                        return (freqs[values.most] || 0) === max;
                    },
                    hint: {
                        text: 'Compare the tally bars after all spins finish. The sector with the longest bar had the highest experimental frequency. Ties are possible — pick any sector that shares the top count.',
                        highlight: ['spinner'],
                    },
                    solution: {
                        text: '',
                        show: { spinner: {} },
                    },
                    points: 10,
                    requiresTrials: true,
                    wireSession(session, ui) {
                        wireSpinnerTrialSession(session, ui, {
                            spinnerId: 'spinner',
                            inputIds: ['most'],
                            onTrialsComplete(session, spinState) {
                                const freqs = spinState.frequencies;
                                const max = Math.max(...labels.map((l) => freqs[l] || 0));
                                const winners = labels.filter((l) => (freqs[l] || 0) === max);
                                session.question.solution.text = `Highest frequency: **${max}** spin(s). Top sector(s): **${winners.join(', ')}**. Tallies — A:${freqs.A || 0}, B:${freqs.B || 0}, C:${freqs.C || 0}, D:${freqs.D || 0}.`;
                                const mostInst = session.instances.most;
                                if (mostInst && typeof mostInst.showSolution === 'function') {
                                    mostInst.showSolution(winners[0]);
                                }
                            },
                        });
                    },
                };
            }
        ]
    };

    Object.keys(gapGenerators).forEach((strand) => {
        questions[strand].push(...gapGenerators[strand]);
    });

    // ----------------------------------------------------
    // Active Question State Management
    // ----------------------------------------------------
    function loadNextQuestion() {
        // Tear down previous question session (widget lifecycle)
        if (state.questionSession) {
            state.questionSession.dispose();
            state.questionSession = null;
        }

        // Reset visual cards
        pracHintContainer.style.display = 'none';
        pracSolutionContainer.style.display = 'none';
        pracFeedbackText.style.display = 'none';
        btnPracHint.style.display = 'none';
        btnPracSubmit.style.display = 'inline-block';
        btnPracSubmit.disabled = false;
        btnPracSubmit.style.opacity = '1';
        btnPracSubmit.style.pointerEvents = 'auto';
        btnPracNext.style.display = 'none';
        
        state.attemptsLeft = 2;
        pracAttemptsLeft.textContent = `2 ATTEMPTS LEFT`;
        pracAttemptsLeft.className = 'rank-pill';

        const categoryGenerators = questions[state.activeCategory];
        if (!categoryGenerators || categoryGenerators.length === 0) return;

        const rawQuestion = MCS.questionPicker.pickFromPool(categoryGenerators, state.sessionSeenQuestions);
        if (!rawQuestion) return;
        state.currentQuestion = rawQuestion;

        state.questionSession = MCS.runQuestion(state.currentQuestion, {
            widgetMount: pracInteractivePanel,
            promptMount: pracTaskTitle,
            band: 'C',
        });
        if (typeof rawQuestion.wireSession === 'function') {
            rawQuestion.wireSession(state.questionSession, { submitBtn: btnPracSubmit });
        }
        
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
        if (!state.currentQuestion || !state.questionSession) return;

        const values = state.questionSession.collect();
        if (state.currentQuestion.requiresTrials) {
            const spinnerVal = values.spinner;
            if (!spinnerVal || !spinnerVal.trialsComplete) {
                pracFeedbackText.className = 'active-feedback-text feedback-error';
                pracFeedbackText.textContent = 'Run all spins before submitting.';
                pracFeedbackText.style.display = 'block';
                sounds.error();
                return;
            }
        }

        const isCorrect = state.questionSession.evaluate();
        
        if (isCorrect) {
            sounds.success();
            Object.keys(state.questionSession.instances).forEach((id) => {
                const inst = state.questionSession.instances[id];
                if (inst && typeof inst.flagCorrect === 'function') inst.flagCorrect();
            });
            state.questionSession.setEnabled(false);
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
            Object.keys(state.questionSession.instances).forEach((id) => {
                const inst = state.questionSession.instances[id];
                if (inst && typeof inst.flagIncorrect === 'function') inst.flagIncorrect();
            });
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
                state.questionSession.setEnabled(false);
                state.questionSession.showSolution(pracSolutionContent);
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
        if (state.currentQuestion && state.questionSession) {
            state.questionSession.showHint(pracHintContent);
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
        const totalPointsForYear = yearDescriptors.reduce((sum, key) => sum + (profile.scoresByDescriptor[normalizeDescriptorCode(DESCRIPTOR_BADGES[key].code)] || 0), 0);
        
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
            badgeEl.style.cursor = 'pointer';
            badgeEl.addEventListener('click', () => {
                sounds.click();
                showBadgeProgressModal(profile, key, {
                    onViewCertificate: isUnlocked ? () => showCertificateModal(key) : null,
                });
            });
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
                const descCode = normalizeDescriptorCode(b.code);
                const pointsEarned = profile.scoresByDescriptor[descCode] || 0;
                const contextTicks = formatBadgeContextTicks(profile, key);
                
                const bEl = document.createElement('div');
                bEl.className = `badge-item ${isUnlocked ? 'unlocked' : 'locked'} ${strand}`;
                if (isUnlocked) {
                    bEl.style.borderColor = strandTheme.colour;
                    bEl.style.boxShadow = `inset 0 0 10px ${strandTheme.colour}22, 0 4px 10px ${strandTheme.colour}33`;
                }
                bEl.setAttribute('data-tooltip', isUnlocked ? `${b.badgeName} (Unlocked)` : formatBadgeLockedTooltip(profile, key));
                bEl.innerHTML = `<span class="trophy-badge-emoji">${b.emoji}</span>${contextTicks ? `<span class="trophy-context-ticks" aria-hidden="true">${contextTicks}</span>` : ''}`;
                bEl.style.cursor = 'pointer';
                bEl.addEventListener('click', () => {
                    sounds.click();
                    showBadgeProgressModal(profile, key, {
                        onViewCertificate: isUnlocked ? () => showCertificateModal(key) : null,
                    });
                });
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
