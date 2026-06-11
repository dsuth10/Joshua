/**
 * Joshua Math Practice Console - State & Logic Engine (Year 4)
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
        click: () => playSound(550, 0.05, 'square', 0.04),
        success: () => {
            playSound(587.33, 0.08, 'sine', 0.08); // D5
            setTimeout(() => playSound(739.99, 0.08, 'sine', 0.08), 80); // F#5
            setTimeout(() => playSound(880.00, 0.12, 'sine', 0.08), 160); // A5
        },
        error: () => playSound(180, 0.25, 'sawtooth', 0.12),
        hint: () => {
            playSound(440, 0.1, 'triangle', 0.08); // A4
            setTimeout(() => playSound(554.37, 0.15, 'triangle', 0.08), 100); // C#5
        },
        badgeUnlock: () => {
            playSound(293.66, 0.1, 'sine', 0.1); // D4
            setTimeout(() => playSound(369.99, 0.1, 'sine', 0.1), 80); // F#4
            setTimeout(() => playSound(440.00, 0.1, 'sine', 0.1), 160); // A4
            setTimeout(() => playSound(587.33, 0.25, 'sine', 0.15), 240); // D5
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
    profile.scoresByCat = profile.scoresByCatY4; // Link active grade category scores

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
        
        profile.scoresByCat = profile.scoresByCatY4; 
    }

    function loadProfile() {
        const stored = localStorage.getItem('joshua_math_profile');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                
                // Migrate legacy scoresByCat to scoresByCatY4
                if (parsed.scoresByCat && !parsed.scoresByCatY4 && !parsed.scoresByCatY5 && !parsed.scoresByCatY3) {
                    parsed.scoresByCatY4 = parsed.scoresByCat;
                }
                
                Object.assign(profile, parsed);
            } catch (e) {
                console.error("Failed to parse stored profile", e);
            }
        }

        // Ensure new sub-fields exist
        if (!profile.scoresByDescriptor) profile.scoresByDescriptor = {};
        if (!profile.solvedContexts) profile.solvedContexts = {};
        if (!profile.consecutiveCorrect) profile.consecutiveCorrect = {};

        // Migrate legacy points to descriptors if descriptors are all zero
        const activeYears = [3, 4, 5, 6];
        const strands = ['number', 'algebra', 'measurement', 'space', 'statistics', 'probability'];
        const descriptorPointsSum = Object.values(profile.scoresByDescriptor).reduce((a, b) => a + b, 0);
        
        if (descriptorPointsSum === 0) {
            activeYears.forEach(yr => {
                const strandKey = `scoresByCatY${yr}`;
                const yearScores = profile[strandKey];
                if (yearScores) {
                    strands.forEach(strand => {
                        const strandScore = yearScores[strand] || 0;
                        if (strandScore > 0) {
                            const descriptors = Object.keys(DESCRIPTOR_BADGES).filter(key => {
                                const desc = DESCRIPTOR_BADGES[key];
                                return desc.year === yr && desc.strand === strand;
                            });
                            if (descriptors.length > 0) {
                                const evenShare = Math.floor(strandScore / descriptors.length);
                                const remainder = strandScore % descriptors.length;
                                descriptors.forEach((descKey, idx) => {
                                    const code = DESCRIPTOR_BADGES[descKey].code;
                                    profile.scoresByDescriptor[code] = evenShare + (idx === 0 ? remainder : 0);
                                });
                            }
                        }
                    });
                }
            });
        }

        // Guarantee all descriptors in config have values
        Object.keys(DESCRIPTOR_BADGES).forEach(key => {
            const code = DESCRIPTOR_BADGES[key].code;
            if (profile.scoresByDescriptor[code] === undefined) profile.scoresByDescriptor[code] = 0;
            if (profile.solvedContexts[code] === undefined) profile.solvedContexts[code] = [];
            if (profile.consecutiveCorrect[code] === undefined) profile.consecutiveCorrect[code] = 0;
        });

        // Ensure all legacy year level category containers exist
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
        
        const colors = ['#ffd700', '#003ec7', '#b45309', '#005471', '#ba1a1a', '#059669', '#10b981'];
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
        
        const closeBtn = document.getElementById('btn-close-ceremony');
        closeBtn.addEventListener('click', () => {
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

        // Remove any existing modal
        const existing = document.getElementById('cert-print-root');
        if (existing) existing.remove();

        // Build the modal
        const root = document.createElement('div');
        root.id = 'cert-print-root';
        root.innerHTML = `
            <div class="cert-modal-overlay" id="cert-overlay">
                <div class="cert-card" role="dialog" aria-modal="true" aria-label="${label} Certificate">
                    <div class="cert-header-band" style="background: linear-gradient(135deg, #d97706 0%, #f59e0b 60%, #b45309 100%);">
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
                        <button class="cert-btn cert-btn-print" id="cert-btn-print" style="background: linear-gradient(135deg, #d97706, #f59e0b); box-shadow: 0 4px 16px rgba(217, 119, 6, 0.3);">🖨️ Print as PDF</button>
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

        // Close handlers
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

        // Print handler
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
        
        const activeYear = 4;
        const y4Descriptors = Object.keys(DESCRIPTOR_BADGES).filter(key => DESCRIPTOR_BADGES[key].year === activeYear);
        const y4GrandBadges = Object.keys(GRAND_BADGES).filter(key => GRAND_BADGES[key].year === activeYear);
        const allBadgeKeys = [...Object.keys(GLOBAL_BADGES), ...y4Descriptors, ...y4GrandBadges];
        
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
        
        // Update global lifetime score
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

        const oldBadgesCount = profile.badges.length;
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

        const getSum = (cat) => (profile.scoresByCatY5[cat] || 0) + (profile.scoresByCatY4[cat] || 0) + (profile.scoresByCatY3[cat] || 0);

        if (getSum('number') >= 100) addBadge('number-100');
        if (getSum('algebra') >= 100) addBadge('algebra-100');
        if (getSum('measurement') >= 100) addBadge('measurement-100');
        if (getSum('space') >= 100) addBadge('space-100');
        if (getSum('statistics') >= 100) addBadge('stats-100');
        if (getSum('probability') >= 100) addBadge('probability-100');

        const isAllRounder = strands.every(cat => getSum(cat) >= 50);
        if (isAllRounder) addBadge('all-rounder');

        saveProfile();
        loadProfile();
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
        questionSession: null,
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

    // SVG Number Line for Mixed Numerals
    function makeMixedNumberLineSvg(whole, numerator, denominator) {
        let svg = `<svg viewBox="0 0 320 80" style="width:100%; max-width:320px; height:auto; display:block; margin:8px auto;">`;
        svg += `<line x1="20" y1="40" x2="300" y2="40" stroke="var(--on-surface)" stroke-width="2" />`;
        
        // Ticks for 0, 1, 2, 3
        const scale = 280 / 3;
        for (let i = 0; i <= 3; i++) {
            const x = 20 + i * scale;
            svg += `<line x1="${x}" y1="30" x2="${x}" y2="50" stroke="var(--on-surface)" stroke-width="2" />`;
            svg += `<text x="${x}" y="65" font-family="var(--font-mono)" font-size="10" text-anchor="middle" fill="var(--on-surface)">${i}</text>`;
        }

        // Sub-ticks
        for (let i = 0; i < 3; i++) {
            const startX = 20 + i * scale;
            for (let j = 1; j < denominator; j++) {
                const subX = startX + (j / denominator) * scale;
                svg += `<line x1="${subX}" y1="35" x2="${subX}" y2="45" stroke="var(--outline)" stroke-width="1" />`;
            }
        }

        // Target dot
        const targetVal = whole + (numerator / denominator);
        const tx = 20 + targetVal * (280 / 3);
        svg += `<circle cx="${tx}" cy="40" r="6" fill="var(--primary)" stroke="var(--surface)" stroke-width="1.5" />`;
        svg += `<circle cx="${tx}" cy="40" r="10" fill="transparent" stroke="var(--primary)" stroke-width="1" class="pulse-ring" style="transform-origin: ${tx}px 40px;" />`;
        svg += `<text x="${tx}" y="24" font-family="var(--font-mono)" font-weight="700" font-size="10" text-anchor="middle" fill="var(--primary)">?</text>`;

        svg += `</svg>`;
        return svg;
    }

    // SVG Analog-Digital Clock for Time Duration
    function makePracticeClockSvg(hours, minutes, label) {
        let svg = `<div class="flex-col align-center gap-4" style="flex:1; min-width:130px;">`;
        svg += `<span style="font-size:0.75rem; font-weight:700; color:var(--outline);">${label}</span>`;
        svg += `<svg viewBox="0 0 120 120" style="width:100px; height:100px; display:block;">`;
        const cx = 60;
        const cy = 60;
        const r = 50;
        svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="var(--surface-container-low)" stroke="var(--outline)" stroke-width="1.5" />`;
        svg += `<circle cx="${cx}" cy="${cy}" r="2" fill="var(--on-surface)" />`;
        
        for (let i = 1; i <= 12; i++) {
            const angle = (i * 30) * Math.PI / 180;
            const x1 = cx + (r - 4) * Math.sin(angle);
            const y1 = cy - (r - 4) * Math.cos(angle);
            const x2 = cx + r * Math.sin(angle);
            const y2 = cy - r * Math.cos(angle);
            svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--on-surface)" stroke-width="1" />`;
            if (i % 3 === 0) {
                const tx = cx + (r - 10) * Math.sin(angle);
                const ty = cy - (r - 10) * Math.cos(angle) + 3;
                svg += `<text x="${tx}" y="${ty}" font-family="var(--font-display)" font-size="8" font-weight="600" text-anchor="middle" fill="var(--on-surface)">${i}</text>`;
            }
        }
        
        const minAngle = (minutes * 6) * Math.PI / 180;
        const hourAngle = ((hours % 12) * 30 + minutes * 0.5) * Math.PI / 180;
        
        // Hour hand
        const hx = cx + 28 * Math.sin(hourAngle);
        const hy = cy - 28 * Math.cos(hourAngle);
        svg += `<line x1="${cx}" y1="${cy}" x2="${hx}" y2="${hy}" stroke="var(--on-surface)" stroke-width="2.5" stroke-linecap="round" />`;
        
        // Minute hand
        const mx = cx + 42 * Math.sin(minAngle);
        const my = cy - 42 * Math.cos(minAngle);
        svg += `<line x1="${cx}" y1="${cy}" x2="${mx}" y2="${my}" stroke="var(--primary)" stroke-width="1.5" stroke-linecap="round" />`;
        
        svg += `</svg>`;
        const padH = String(hours).padStart(2, '0');
        const padM = String(minutes).padStart(2, '0');
        svg += `<div style="font-family:var(--font-mono); font-weight:700; font-size:0.95rem; border:1px solid var(--outline-variant); padding:2px 8px; border-radius:4px; margin-top:4px;">${padH}:${padM}</div>`;
        svg += `</div>`;
        return svg;
    }

    // SVG Angle Protractor Evaluator
    function makeAngleSvg(angleDeg) {
        let svg = `<svg viewBox="0 0 240 160" style="width:100%; max-width:240px; height:auto; display:block; margin:8px auto;">`;
        const cx = 120;
        const cy = 110;
        const r = 70;
        const rad = angleDeg * Math.PI / 180;

        // Protractor background overlay
        svg += `<circle cx="${cx}" cy="${cy}" r="${r + 10}" fill="rgba(217, 119, 6, 0.08)" stroke="var(--outline-variant)" stroke-width="0.5" stroke-dasharray="2 2" />`;
        svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="transparent" stroke="var(--outline-variant)" stroke-width="0.5" />`;

        for (let deg = 0; deg <= 180; deg += 15) {
            const phi = (180 - deg) * Math.PI / 180;
            const isMajor = deg % 30 === 0;
            const rStart = isMajor ? r - 6 : r - 3;
            const x1 = cx + rStart * Math.cos(phi);
            const y1 = cy - rStart * Math.sin(phi);
            const x2 = cx + r * Math.cos(phi);
            const y2 = cy - r * Math.sin(phi);
            svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--outline)" stroke-width="0.5" />`;
            if (isMajor) {
                const tx = cx + (r - 14) * Math.cos(phi);
                const ty = cy - (r - 14) * Math.sin(phi) + 3;
                svg += `<text x="${tx}" y="${ty}" font-family="var(--font-mono)" font-size="6" text-anchor="middle" fill="var(--outline)">${deg}</text>`;
            }
        }

        // Draw Angle Arms
        svg += `<circle cx="${cx}" cy="${cy}" r="3" fill="var(--on-surface)" />`;
        // Baseline (rightwards)
        svg += `<line x1="${cx}" y1="${cy}" x2="${cx + r}" y2="${cy}" stroke="var(--on-surface)" stroke-width="2.5" stroke-linecap="round" />`;
        // Rotated arm
        const rx = cx + r * Math.cos(rad);
        const ry = cy - r * Math.sin(rad);
        svg += `<line x1="${cx}" y1="${cy}" x2="${rx}" y2="${ry}" stroke="var(--primary)" stroke-width="3" stroke-linecap="round" />`;

        // Small arc sector
        if (angleDeg > 0) {
            const arcR = 25;
            const ax = cx + arcR * Math.cos(rad);
            const ay = cy - arcR * Math.sin(rad);
            svg += `<path d="M ${cx + arcR} ${cy} A ${arcR} ${arcR} 0 0 0 ${ax} ${ay}" fill="none" stroke="var(--primary)" stroke-width="1.5" />`;
        }

        svg += `</svg>`;
        return svg;
    }

    // SVG Scaled Column Graph — migrated to MCS column-graph widget (Phase 2.5)

    // ----------------------------------------------------
    // 5. Dynamic Category Generators & Helpers (6 strands)
    // ----------------------------------------------------
    const generators = {
        number: () => {
            const subTypes = ['decimal-ordering', 'place-value-shifter', 'mixed-numeral-line'];
            const chosenType = subTypes[Math.floor(Math.random() * subTypes.length)];

            if (chosenType === 'decimal-ordering') {
                const decimals = [];
                const base = Math.floor(Math.random() * 8) + 1; // 1-8
                const offsets = [0.2, 0.24, 0.204, 0.04, 0.08, 0.4, 0.15, 0.105];
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
                    hintText: `<p>Align place value columns (Ones, tenths, hundredths, thousandths). Pad numbers with zeroes to compare: e.g., <strong>${shuffled[0]} ➔ ${shuffled[0].toFixed(3)}</strong>.</p>`,
                    solutionText: `Sorted from smallest to largest: ${sorted.join(' < ')}.`,
                    renderFunc: (container) => {
                        container.innerHTML = `
                            <div class="flex-col align-center gap-12">
                                <p>Arrange these decimal values from smallest (1st) to largest (4th):</p>
                                <div class="flex-row gap-12 justify-center" style="font-size:1.4rem; font-weight:700; color:var(--primary); margin-bottom:8px; flex-wrap:wrap; display:flex;">
                                    ${shuffled.map(d => `<span class="hint-expander-place" style="padding:4px 10px;">${d}</span>`).join('')}
                                </div>
                                <div class="flex-row gap-8 align-center flex-wrap justify-center" style="display:flex; justify-content:center; align-items:center; gap:8px;">
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
            } else if (chosenType === 'place-value-shifter') {
                const baseVal = parseFloat((Math.floor(Math.random() * 5) + 2 + Math.floor(Math.random() * 9) * 0.1 + 5 * 0.01).toFixed(2)); // e.g. 4.35
                const shiftCol = Math.random() > 0.5 ? 'tenths' : 'hundredths';
                const diff = shiftCol === 'tenths' ? (Math.random() > 0.5 ? 0.4 : -0.3) : (Math.random() > 0.5 ? 0.05 : -0.04);
                const targetVal = parseFloat((baseVal + diff).toFixed(2));
                const operationStr = diff > 0 ? `Add ${Math.abs(diff)}` : `Subtract ${Math.abs(diff)}`;

                let currentVal = baseVal;

                return {
                    category: 'number',
                    type: 'place-value-shifter',
                    questionText: `Decimal place value shifter:`,
                    targetAns: diff,
                    hintText: `<p>To change ${baseVal} to ${targetVal}, notice which place value column changes. The **${shiftCol}** column changed by ${Math.abs(diff)}. Therefore, we must ${operationStr.toLowerCase()}.</p>`,
                    solutionText: `Operation: ${baseVal} + (${diff}) = ${targetVal}. So, we ${operationStr}.`,
                    renderFunc: (container) => {
                        container.innerHTML = `
                            <div class="calc-hacker-grid" style="display:grid; grid-template-columns:220px 1fr; gap:20px;">
                                <div class="calc-device">
                                    <div class="calc-screen" id="prac-calc-readout">${baseVal}</div>
                                    <div class="calc-buttons">
                                        <button class="calc-btn op-btn" id="prac-op-add-1" data-val="1">+1</button>
                                        <button class="calc-btn op-btn" id="prac-op-add-t" data-val="0.1">+0.1</button>
                                        <button class="calc-btn op-btn" id="prac-op-add-h" data-val="0.01">+0.01</button>
                                        <button class="calc-btn op-btn" id="prac-op-sub-1" data-val="-1">-1</button>
                                        <button class="calc-btn op-btn" id="prac-op-sub-t" data-val="-0.1">-0.1</button>
                                        <button class="calc-btn op-btn" id="prac-op-sub-h" data-val="-0.01">-0.01</button>
                                        <button class="calc-btn" id="prac-calc-reset" style="background-color: var(--error); color: white; grid-column: span 3; padding: 4px;">RESET</button>
                                    </div>
                                </div>
                                <div class="calc-explain-panel">
                                    <p>The screen displays <strong>${baseVal}</strong>. What must you do to shift the digits and display <strong>${targetVal}</strong>?</p>
                                    <select id="prac-calc-sel" class="input-text-terminal" style="width:100%; max-width:280px; margin-top:8px;">
                                        <option value="">-- select operation --</option>
                                        <option value="1">Add 1</option>
                                        <option value="0.1">Add 0.1</option>
                                        <option value="0.4">Add 0.4</option>
                                        <option value="0.05">Add 0.05</option>
                                        <option value="-1">Subtract 1</option>
                                        <option value="-0.1">Subtract 0.1</option>
                                        <option value="-0.3">Subtract 0.3</option>
                                        <option value="-0.04">Subtract 0.04</option>
                                    </select>
                                </div>
                            </div>
                        `;
                        const readout = document.getElementById('prac-calc-readout');
                        document.querySelectorAll('.calc-btn.op-btn').forEach(btn => {
                            btn.addEventListener('click', () => {
                                sounds.click();
                                const val = parseFloat(btn.dataset.val);
                                currentVal = parseFloat((currentVal + val).toFixed(2));
                                readout.textContent = currentVal.toFixed(2);
                                
                                if (currentVal === targetVal) {
                                    const opt = document.getElementById('prac-calc-sel');
                                    opt.value = String(diff);
                                    sounds.success();
                                }
                            });
                        });
                        document.getElementById('prac-calc-reset').addEventListener('click', () => {
                            sounds.click();
                            currentVal = baseVal;
                            readout.textContent = baseVal.toFixed(2);
                            document.getElementById('prac-calc-sel').value = '';
                        });
                    },
                    validateFunc: () => {
                        const val = parseFloat(document.getElementById('prac-calc-sel').value);
                        return Math.abs(val - diff) < 0.001;
                    }
                };
            } else {
                // Mixed Numeral Number Line
                const wholes = [1, 2];
                const whole = wholes[Math.floor(Math.random() * wholes.length)];
                const denoms = [2, 3, 4];
                const den = denoms[Math.floor(Math.random() * denoms.length)];
                const num = Math.floor(Math.random() * (den - 1)) + 1;

                return {
                    category: 'number',
                    type: 'mixed-numeral-line',
                    questionText: 'Determine the mixed numeral marked by the dot on the number line:',
                    targetAns: { whole, num, den },
                    hintText: `<p>First find the whole integer before the dot: <strong>${whole}</strong>. Then count how many divisions split each integer interval (denominator = <strong>${den}</strong>). Finally count the ticks past the whole number (numerator = <strong>${num}</strong>).</p>`,
                    solutionText: `The dot is located past integer ${whole}. The interval is split into ${den} parts, and the dot is at the ${num}th tick. Thus, the value is ${whole} and ${num}/${den}.`,
                    renderFunc: (container) => {
                        container.innerHTML = `
                            <div class="flex-col align-center gap-8">
                                ${makeMixedNumberLineSvg(whole, num, den)}
                                <div class="flex-row gap-8 align-center justify-center" style="display:flex; justify-content:center; align-items:center; gap:8px; margin-top:10px;">
                                    <input type="number" id="numline-whole-inp" class="input-text-terminal" placeholder="whole" style="width:65px; text-align:center;">
                                    <div class="fraction-display" style="display:flex; flex-direction:column; align-items:center;">
                                        <input type="number" id="numline-num-inp" class="input-text-terminal" placeholder="num" style="width:45px; text-align:center; padding:2px;">
                                        <div style="width:100%; height:1px; background:var(--outline); margin: 2px 0;"></div>
                                        <input type="number" id="numline-den-inp" class="input-text-terminal" placeholder="den" style="width:45px; text-align:center; padding:2px;">
                                    </div>
                                </div>
                            </div>
                        `;
                    },
                    validateFunc: () => {
                        const w = parseInt(document.getElementById('numline-whole-inp').value, 10);
                        const n = parseInt(document.getElementById('numline-num-inp').value, 10);
                        const d = parseInt(document.getElementById('numline-den-inp').value, 10);
                        if (isNaN(w) || isNaN(n) || isNaN(d)) return false;
                        return w === whole && n === num && d === den;
                    }
                };
            }
        },
        algebra: () => {
            const subTypes = ['inverse-equations', 'recall-facts-timed'];
            const chosenType = subTypes[Math.floor(Math.random() * subTypes.length)];

            if (chosenType === 'inverse-equations') {
                const a = Math.floor(Math.random() * 200) + 100; // 100-299
                const b = Math.floor(Math.random() * 300) + 301; // 301-600
                const sum = a + b;
                const pos = Math.floor(Math.random() * 2); // 0 or 1

                let eqStr = '';
                let targetUnknown = 0;
                let firstTerm = 0;

                if (pos === 0) {
                    eqStr = `? + ${a} = ${sum}`;
                    targetUnknown = b;
                    firstTerm = sum;
                } else {
                    eqStr = `${sum} − ? = ${a}`;
                    targetUnknown = b;
                    firstTerm = sum;
                }

                return {
                    category: 'algebra',
                    type: 'inverse-equations',
                    questionText: 'Find the unknown (?) in this numerical equation using inverse operations:',
                    targetAns: { ans: targetUnknown, term1: firstTerm, term2: a },
                    hintText: `<p>To find <code>?</code>, apply the inverse operation: subtraction is the inverse of addition. Subtract the known part: <code>? = ${sum} − ${a}</code>.</p>`,
                    solutionText: `Using inverse operations: ? = ${sum} − ${a}. Thus, ? = ${targetUnknown}.`,
                    renderFunc: (container) => {
                        container.innerHTML = `
                            <div class="flex-col align-center gap-12">
                                <div style="font-size:2.2rem; font-weight:700; color:var(--primary); font-family:var(--font-display);">${eqStr}</div>
                                <div class="flex-col gap-8 align-center" style="width:100%; max-width:320px; margin: 0 auto;">
                                    <div class="flex-row align-center gap-4" style="display:flex; align-items:center; gap:4px;">
                                        <span>Inverse equation: ? = </span>
                                        <input type="number" id="inv-t1" class="input-text-terminal" placeholder="e.g. ${sum}" style="width:80px; text-align:center;">
                                        <span> − </span>
                                        <input type="number" id="inv-t2" class="input-text-terminal" placeholder="e.g. ${a}" style="width:80px; text-align:center;">
                                    </div>
                                    <div class="flex-row align-center gap-8" style="display:flex; align-items:center; gap:8px; margin-top:8px;">
                                        <span>Value of ? is:</span>
                                        <input type="number" id="inv-ans" class="input-text-terminal" placeholder="?" style="width:90px; text-align:center;">
                                    </div>
                                </div>
                            </div>
                        `;
                    },
                    validateFunc: () => {
                        const t1 = parseInt(document.getElementById('inv-t1').value, 10);
                        const t2 = parseInt(document.getElementById('inv-t2').value, 10);
                        const ans = parseInt(document.getElementById('inv-ans').value, 10);
                        if (isNaN(t1) || isNaN(t2) || isNaN(ans)) return false;
                        return t1 === firstTerm && t2 === a && ans === targetUnknown;
                    }
                };
            } else {
                // Recall facts timed
                const a = Math.floor(Math.random() * 8) + 3; // 3-10
                const b = Math.floor(Math.random() * 9) + 2; // 2-10
                const ans = a * b;

                let timeLeft = 100;

                return {
                    category: 'algebra',
                    type: 'recall-facts-timed',
                    questionText: 'Demonstrate fact fluency (10s countdown):',
                    targetAns: ans,
                    hintText: `<p>Recall the multiplication fact: ${a} times ${b}. Skip count in ${a}s if needed.</p>`,
                    solutionText: `${a} × ${b} is exactly ${ans}.`,
                    renderFunc: (container) => {
                        container.innerHTML = `
                            <div class="flex-col align-center gap-12">
                                <div style="font-size:2.8rem; font-weight:700; color:var(--primary); font-family:var(--font-display);">${a} × ${b}</div>
                                <input type="number" id="prac-timed-ans" class="input-text-terminal input-number-small" placeholder="?" style="font-size:1.8rem; width:120px;" autocomplete="off">
                                <div class="engine-progress-bar" style="width:200px; height:6px;">
                                    <div class="engine-progress-fill" id="timed-progress-fill" style="width:100%;"></div>
                                </div>
                            </div>
                        `;
                        
                        // Timed countdown simulation
                        if (state.activeInterval) clearInterval(state.activeInterval);
                        timeLeft = 100;
                        const fill = document.getElementById('timed-progress-fill');
                        
                        state.activeInterval = setInterval(() => {
                            timeLeft -= 2;
                            if (fill) fill.style.width = `${timeLeft}%`;
                            if (timeLeft <= 0) {
                                clearInterval(state.activeInterval);
                                sounds.error();
                                addLog("Fluency time expired!", "error");
                                const submitBtn = document.getElementById('btn-prac-submit');
                                if (submitBtn) submitBtn.click();
                            }
                        }, 200);

                        // Auto focus
                        setTimeout(() => {
                            const inp = document.getElementById('prac-timed-ans');
                            if (inp) inp.focus();
                        }, 50);
                    },
                    validateFunc: () => {
                        if (state.activeInterval) clearInterval(state.activeInterval);
                        const val = parseInt(document.getElementById('prac-timed-ans').value.trim(), 10);
                        return val === ans;
                    }
                };
            }
        },
        measurement: () => {
            const subTypes = ['time-duration', 'angle-evaluator'];
            const chosenType = subTypes[Math.floor(Math.random() * subTypes.length)];

            if (chosenType === 'time-duration') {
                const startHour = Math.floor(Math.random() * 4) + 8; // 8-11 AM
                const startMin = Math.random() > 0.5 ? 15 : 30;
                
                const durationHours = Math.floor(Math.random() * 2) + 1; // 1-2 hours
                const durationMins = Math.random() > 0.5 ? 15 : 30;
                
                const endMin = (startMin + durationMins) % 60;
                const hourCarry = Math.floor((startMin + durationMins) / 60);
                const endHour = startHour + durationHours + hourCarry;

                const totalMinutes = durationHours * 60 + durationMins;

                return {
                    category: 'measurement',
                    type: 'time-duration',
                    questionText: 'Determine the duration of time elapsed between the start and end clocks:',
                    targetAns: totalMinutes,
                    hintText: `<p>Subtract the start time from the end time. Calculate hours and minutes separately: e.g. from ${startHour}:${startMin} to ${endHour}:${endMin} is ${durationHours} hour(s) and ${durationMins} minutes.</p>`,
                    solutionText: `Start: ${startHour}:${startMin} AM, End: ${endHour}:${endMin} AM. Elapsed duration: ${durationHours} hour(s) and ${durationMins} minutes, which equals ${totalMinutes} minutes in total.`,
                    renderFunc: (container) => {
                        container.innerHTML = `
                            <div class="flex-col align-center gap-12">
                                <div class="flex-row gap-16 justify-center flex-wrap" style="display:flex; justify-content:center; gap:20px; width:100%;">
                                    ${makePracticeClockSvg(startHour, startMin, 'START TIME')}
                                    ${makePracticeClockSvg(endHour, endMin, 'END TIME')}
                                </div>
                                <div class="flex-row align-center justify-center gap-8" style="display:flex; justify-content:center; align-items:center; gap:8px; margin-top:8px;">
                                    <span>Duration:</span>
                                    <input type="number" id="duration-h-inp" class="input-text-terminal" placeholder="hours" style="width:70px; text-align:center;">
                                    <span>hr, and</span>
                                    <input type="number" id="duration-m-inp" class="input-text-terminal" placeholder="mins" style="width:70px; text-align:center;">
                                    <span>mins.</span>
                                </div>
                            </div>
                        `;
                    },
                    validateFunc: () => {
                        const h = parseInt(document.getElementById('duration-h-inp').value, 10);
                        const m = parseInt(document.getElementById('duration-m-inp').value, 10);
                        if (isNaN(h) || isNaN(m)) return false;
                        return (h * 60 + m) === totalMinutes;
                    }
                };
            } else {
                // Angle evaluator
                const angles = [
                    { deg: 45, name: 'acute' },
                    { deg: 90, name: 'right' },
                    { deg: 135, name: 'obtuse' },
                    { deg: 180, name: 'straight' },
                    { deg: 270, name: 'reflex' }
                ];
                const selected = angles[Math.floor(Math.random() * angles.length)];

                let clickedChoice = '';

                return {
                    category: 'measurement',
                    type: 'angle-evaluator',
                    questionText: `SVG Protractor Angle Evaluator:`,
                    targetAns: selected.name,
                    hintText: `<p>An **acute** angle is less than 90°. An **obtuse** angle is between 90° and 180°. A **straight** angle is exactly 180°. A **reflex** angle is greater than 180°.</p>`,
                    solutionText: `The rendered angle is ${selected.deg}°, which is classified as an **${selected.name}** angle.`,
                    renderFunc: (container) => {
                        const renderUI = () => {
                            container.innerHTML = `
                                <div class="flex-col align-center gap-12" style="width:100%;">
                                    ${makeAngleSvg(selected.deg)}
                                    <div style="font-weight:600; text-align:center; font-size:1rem; margin-top:4px;">
                                        Classify the angle size relative to 90°:
                                    </div>
                                    <div class="angle-mc-grid" style="display:grid; grid-template-columns: repeat(3, 1fr); gap:8px; width:100%; max-width:380px; margin:0 auto;">
                                        ${['acute', 'obtuse', 'straight', 'reflex'].map(name => `
                                            <button type="button" class="btn-terminal angle-btn ${clickedChoice === name ? 'primary' : ''}" data-name="${name}" style="padding:6px; font-size:0.85rem;">${name.toUpperCase()}</button>
                                        `).join('')}
                                    </div>
                                </div>
                            `;
                            document.querySelectorAll('.angle-btn').forEach(btn => {
                                btn.addEventListener('click', () => {
                                    sounds.click();
                                    clickedChoice = btn.dataset.name;
                                    renderUI();
                                });
                            });
                        };
                        renderUI();
                    },
                    validateFunc: () => {
                        return clickedChoice === selected.name;
                    }
                };
            }
        },
        space: () => {
            const subTypes = ['alphanumeric-routing', 'symmetry-paint'];
            const chosenType = subTypes[Math.floor(Math.random() * subTypes.length)];

            if (chosenType === 'alphanumeric-routing') {
                const landmark = Math.random() > 0.5 ? { name: 'School', icon: '🏫', col: 'C', row: 3 } : { name: 'Park', icon: '🌳', col: 'E', row: 2 };

                return {
                    category: 'space',
                    type: 'alphanumeric-routing',
                    questionText: `Identify landmark grid reference systems:`,
                    targetAns: { col: landmark.col, row: landmark.row },
                    hintText: `<p>Look at the map. Find the landmark ${landmark.icon}. Read the bottom column letter first (**${landmark.col}**), then read the side row number (**${landmark.row}**).</p>`,
                    solutionText: `The ${landmark.name} ${landmark.icon} is located in grid sector **${landmark.col}${landmark.row}**.`,
                    renderFunc: (container) => {
                        container.innerHTML = `
                            <div class="calc-hacker-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:20px; align-items:center; min-height:0; flex-grow:1;">
                                <div class="flex-col gap-12">
                                    <p>Select the correct alphanumeric grid coordinate for the <strong>${landmark.name} ${landmark.icon}</strong>:</p>
                                    <div class="flex-row gap-8 align-center" style="display:flex; align-items:center; gap:8px; margin-top:8px;">
                                        <span>Grid coordinate: </span>
                                        <select id="prac-grid-col" class="input-text-terminal" style="width:75px;">
                                            <option value="">Col</option>
                                            <option value="A">A</option>
                                            <option value="B">B</option>
                                            <option value="C">C</option>
                                            <option value="D">D</option>
                                            <option value="E">E</option>
                                        </select>
                                        <select id="prac-grid-row" class="input-text-terminal" style="width:75px;">
                                            <option value="">Row</option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="visual-workbench" style="display:flex; flex-direction:column; justify-content:center; align-items:center; padding:16px;">
                                    <div class="alpha-grid-container" style="grid-template-columns: repeat(6, 36px); grid-template-rows: repeat(6, 36px);">
                                        <div class="alpha-grid-cell label-cell"></div>
                                        ${['A', 'B', 'C', 'D', 'E'].map(c => `<div class="alpha-grid-cell label-cell">${c}</div>`).join('')}
                                        ${[5, 4, 3, 2, 1].map(r => `
                                            <div class="alpha-grid-cell label-cell">${r}</div>
                                            ${['A', 'B', 'C', 'D', 'E'].map(c => {
                                                let content = '';
                                                if (c === 'C' && r === 3) content = '🏫';
                                                if (c === 'E' && r === 2) content = '🌳';
                                                if (c === 'B' && r === 4) content = '📚';
                                                return `<div class="alpha-grid-cell" id="prac-c-${c}${r}">${content}</div>`;
                                            }).join('')}
                                        `).join('')}
                                    </div>
                                </div>
                            </div>
                        `;
                        ['prac-grid-col', 'prac-grid-row'].forEach(id => {
                            document.getElementById(id).addEventListener('change', () => {
                                sounds.click();
                                document.querySelectorAll('.alpha-grid-cell').forEach(el => el.classList.remove('selected'));
                                const col = document.getElementById('prac-grid-col').value;
                                const row = document.getElementById('prac-grid-row').value;
                                if (col && row) {
                                    const cell = document.getElementById(`prac-c-${col}${row}`);
                                    if (cell) cell.classList.add('selected');
                                }
                            });
                        });
                    },
                    validateFunc: () => {
                        const col = document.getElementById('prac-grid-col').value;
                        const row = parseInt(document.getElementById('prac-grid-row').value, 10);
                        return col === landmark.col && row === landmark.row;
                    }
                };
            } else {
                // Symmetry paint
                // Mirroring cells across vertical line. Left side has 2 prefilled blocks.
                // Reflected coordinate: (7 - c, r).
                const patterns = [
                    [{ r: 2, c: 2 }, { r: 4, c: 3 }],
                    [{ r: 1, c: 3 }, { r: 5, c: 1 }],
                    [{ r: 3, c: 1 }, { r: 4, c: 2 }]
                ];
                const prefilled = patterns[Math.floor(Math.random() * patterns.length)];
                
                const expected = prefilled.map(pos => ({ r: pos.r, c: 7 - pos.c }));
                let studentCells = [];

                return {
                    category: 'space',
                    type: 'symmetry-paint',
                    questionText: 'Complete the symmetrical pattern across the vertical red line:',
                    targetAns: expected,
                    hintText: `<p>For each colored block on the left, find the cell directly opposite it on the right side at the same row. For example, if row 2 has a block at column 2 (2 squares from axis), color the cell at row 2, column 5 (2 squares right of axis).</p>`,
                    solutionText: `Reflected columns are mirrored: column 1 mirrors to column 6, column 2 to column 5, and column 3 to column 4. Reflected blocks: ${expected.map(p => `Row ${p.r}, Col ${p.c}`).join(' & ')}.`,
                    renderFunc: (container) => {
                        container.innerHTML = `
                            <div class="symmetry-board-container">
                                <div class="symmetry-grid" id="prac-sym-grid" style="grid-template-columns: repeat(6, 32px);">
                                    <!-- Rendered dynamically -->
                                </div>
                            </div>
                        `;
                        const grid = document.getElementById('prac-sym-grid');
                        
                        // Red vertical line
                        const axis = document.createElement('div');
                        axis.className = 'symmetry-axis-line vertical';
                        grid.appendChild(axis);

                        for (let r = 1; r <= 6; r++) {
                            for (let c = 1; c <= 6; c++) {
                                const cell = document.createElement('div');
                                cell.className = 'symmetry-cell';
                                cell.dataset.r = r;
                                cell.dataset.c = c;

                                const isPre = prefilled.some(p => p.r === r && p.c === c);
                                if (isPre) {
                                    cell.classList.add('pre-filled');
                                }

                                if (c > 3) {
                                    cell.addEventListener('click', () => {
                                        sounds.click();
                                        cell.classList.toggle('active');
                                        
                                        const idx = studentCells.findIndex(pos => pos.r === r && pos.c === c);
                                        if (idx !== -1) {
                                            studentCells.splice(idx, 1);
                                        } else {
                                            studentCells.push({ r, c });
                                        }
                                    });
                                }
                                grid.appendChild(cell);
                            }
                        }
                    },
                    validateFunc: () => {
                        let isCorrect = (studentCells.length === expected.length);
                        if (isCorrect) {
                            expected.forEach(exp => {
                                const matched = studentCells.some(cell => cell.r === exp.r && cell.c === exp.c);
                                if (!matched) isCorrect = false;
                            });
                        }
                        return isCorrect;
                    }
                };
            }
        },
        statistics: () => {
            const categories = ['Dogs', 'Cats', 'Fish', 'Birds'];
            const scaleInterval = Math.random() > 0.5 ? 5 : 2;
            const values = [
                (Math.floor(Math.random() * 4) + 1) * scaleInterval,
                (Math.floor(Math.random() * 5) + 2) * scaleInterval,
                (Math.floor(Math.random() * 3) + 1) * scaleInterval,
                (Math.floor(Math.random() * 4) + 1) * scaleInterval
            ];

            const varType = Math.random() > 0.5 ? 0 : 1;
            let context;
            let prompt;
            let ans;
            let solutionText;
            let hintText;
            let solutionShow;

            if (varType === 0) {
                const targetIdx = Math.floor(Math.random() * 4);
                context = 'read-column-chart';
                prompt = `According to the column graph, how many students chose **${categories[targetIdx]}** as their favourite pet?`;
                ans = values[targetIdx];
                hintText = `<p>Tap the <strong>${categories[targetIdx]}</strong> column to project a guide line to the y-axis.</p><p>Each division on the axis scales by <strong>${scaleInterval}</strong> units.</p>`;
                solutionText = `The column for ${categories[targetIdx]} aligns with <strong>${values[targetIdx]}</strong> on the scaled y-axis.`;
                solutionShow = { chart: { category: categories[targetIdx] }, ans };
            } else {
                const targetIdx1 = 1;
                const targetIdx2 = 2;
                context = 'column-chart-difference';
                prompt = `How many more students chose **${categories[targetIdx1]}** than **${categories[targetIdx2]}**?`;
                ans = values[targetIdx1] - values[targetIdx2];
                hintText = `<p>Tap the <strong>${categories[targetIdx1]}</strong> and <strong>${categories[targetIdx2]}</strong> columns to read each value from the y-axis.</p><p>Subtract the smaller value from the larger. Each axis division is <strong>${scaleInterval}</strong> units.</p>`;
                solutionText = `${categories[targetIdx1]} column aligns with <strong>${values[targetIdx1]}</strong>, and ${categories[targetIdx2]} with <strong>${values[targetIdx2]}</strong>. Difference: ${values[targetIdx1]} − ${values[targetIdx2]} = <strong>${ans}</strong>.`;
                solutionShow = {
                    chart: { categories: [categories[targetIdx1], categories[targetIdx2]] },
                    ans,
                };
            }

            return {
                descriptor: 'AC9M4ST01',
                context,
                category: 'statistics',
                title: varType === 0 ? 'READ THE COLUMN GRAPH' : 'COMPARE COLUMNS',
                prompt,
                widgets: [
                    {
                        id: 'chart',
                        type: 'column-graph',
                        config: {
                            mode: 'read',
                            band: 'C',
                            categories,
                            values,
                            scaleInterval,
                        },
                    },
                ],
                inputs: [
                    {
                        id: 'ans',
                        type: 'number-input',
                        config: { label: 'Answer:', placeholder: '?' },
                    },
                ],
                evaluate(valuesCollected) {
                    return valuesCollected.ans === ans;
                },
                hint: {
                    text: hintText,
                    highlight: ['chart'],
                },
                solution: {
                    text: solutionText,
                    show: solutionShow,
                },
                points: 10,
            };
        },
        probability: () => {
            // Drag-and-drop likelihood scale
            // Events list
            const pool = [
                { desc: "The sun will rise tomorrow.", scale: "certain" },
                { desc: "Rolling a 7 on a standard 6-sided die.", scale: "impossible" },
                { desc: "Flipping a coin and getting heads.", scale: "equal" },
                { desc: "Getting a red light at an intersection.", scale: "likely" },
                { desc: "Snowing in Brisbane during summer.", scale: "unlikely" }
            ];
            
            const shuffledPool = shuffleArray(pool).slice(0, 3);

            return {
                category: 'probability',
                type: 'likelihood-scale',
                questionText: 'Assess the likelihood of each everyday event and order them on the spectrum:',
                targetAns: shuffledPool,
                hintText: `<p>Analyse the likelihood description for each event:
                           <ul>
                               <li>**Impossible**: Cannot happen (0% chance).</li>
                               <li>**Unlikely**: Low chance but possible.</li>
                               <li>**Equal Chance**: Exactly 50/50.</li>
                               <li>**Likely**: High chance but not guaranteed.</li>
                               <li>**Certain**: Absolutely guaranteed (100% chance).</li>
                           </ul></p>`,
                solutionText: `Correct assessment values: ${shuffledPool.map(e => `"${e.desc}" ➔ ${e.scale.toUpperCase()}`).join(', ')}.`,
                renderFunc: (container) => {
                    container.innerHTML = `
                        <div class="flex-col gap-12" style="width:100%; max-width:480px; margin:0 auto;">
                            <p style="font-size:0.85rem; color:var(--on-surface-variant); text-align:center;">Classify each event by choosing its position on the probability spectrum:</p>
                            <div class="flex-col gap-8" style="margin-top:6px; display:flex; flex-direction:column; gap:8px;">
                                ${shuffledPool.map((item, idx) => `
                                    <div class="flex-col gap-4" style="border: 1px solid var(--outline-variant); padding: 8px 12px; border-radius: 6px; background: var(--surface-container-low);">
                                        <div style="font-size:0.85rem; font-weight:600;">Event ${idx+1}: "${item.desc}"</div>
                                        <select id="prob-scale-sel-${idx}" class="input-text-terminal" style="width:100%; font-size:0.82rem; padding: 4px; margin-top: 4px;">
                                            <option value="">-- select likelihood --</option>
                                            <option value="impossible">Impossible</option>
                                            <option value="unlikely">Unlikely</option>
                                            <option value="equal">Equal Chance</option>
                                            <option value="likely">Likely</option>
                                            <option value="certain">Certain</option>
                                        </select>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `;
                },
                validateFunc: () => {
                    let correct = true;
                    shuffledPool.forEach((item, idx) => {
                        const val = document.getElementById(`prob-scale-sel-${idx}`).value;
                        if (val !== item.scale) correct = false;
                    });
                    return correct;
                }
            };
        }
    };

    // assignDescriptorAndContext helper for Year 4
    function assignDescriptorAndContext(q) {
        if (!q) return;
        if (q.descriptor && q.context) return;

        q.descriptor = '';
        q.context = '';
        
        const text = (q.questionText || '').toLowerCase();
        
        switch (q.type) {
            case 'decimal-ordering':
                q.descriptor = 'AC9M4N01';
                q.context = 'decimal-ordering';
                break;
            case 'place-value-shifter':
                q.descriptor = 'AC9M4N01';
                q.context = 'decimal-place-value';
                break;
            case 'mixed-numeral-line':
                q.descriptor = 'AC9M4N04';
                q.context = 'mixed-numeral-lines';
                break;
                
            // Algebra
            case 'inverse-equations':
                q.descriptor = 'AC9M4A01';
                q.context = text.includes('−') || text.includes('-') || text.includes('subtract') ? 'inverse-equations-subtraction' : 'inverse-equations-addition';
                break;
            case 'recall-facts-timed':
                q.descriptor = 'AC9M4A02';
                q.context = text.includes('÷') || text.includes('divide') ? 'recall-facts-division' : 'recall-facts-multiplication';
                break;
                
            // Measurement
            case 'time-duration':
                q.descriptor = 'AC9M4M03';
                q.context = Math.random() > 0.5 ? 'time-duration' : 'schedule-planning';
                break;
            case 'angle-evaluator':
                q.descriptor = 'AC9M4M04';
                q.context = text.includes('protractor') ? 'protractor-reading' : 'angle-classification';
                break;
                
            // Space
            case 'alphanumeric-routing':
                q.descriptor = 'AC9M4SP02';
                q.context = Math.random() > 0.5 ? 'alphanumeric-routing' : 'grid-reference';
                break;
            case 'symmetry-paint':
                q.descriptor = 'AC9M4SP03';
                q.context = Math.random() > 0.5 ? 'symmetry-paint-mirror' : 'symmetry-rotational';
                break;
                
            // Statistics
            case 'scaled-column-graph':
                q.descriptor = 'AC9M4ST01';
                q.context = text.includes('more') ? 'column-chart-difference' : 'read-column-chart';
                break;
                
            // Probability
            case 'likelihood-scale':
                q.descriptor = 'AC9M4P01';
                q.context = Math.random() > 0.5 ? 'likelihood-scale-eval' : 'likelihood-scale-order';
                break;
        }
    }

    // ----------------------------------------------------
    // 6. Practice Console Workflow Engine
    // ----------------------------------------------------
    function initSandboxQuestion() {
        if (state.activeInterval) clearInterval(state.activeInterval);

        if (state.questionSession) {
            state.questionSession.dispose();
            state.questionSession = null;
        }
        
        state.attemptsLeft = 2;
        pracAttemptsLeft.textContent = "2 ATTEMPTS LEFT";
        pracAttemptsLeft.className = "rank-pill";
        
        pracHintContainer.style.display = 'none';
        pracSolutionContainer.style.display = 'none';
        pracFeedbackText.style.display = 'none';
        
        btnPracHint.style.display = 'none';
        btnPracSubmit.style.display = 'block';
        btnPracNext.style.display = 'none';

        const gen = generators[state.activeCategory];
        if (!gen) return;

        const rawQuestion = gen();

        if (rawQuestion.widgets && rawQuestion.widgets.length) {
            state.currentQuestion = rawQuestion;
            const band =
                (rawQuestion.widgets[0].config && rawQuestion.widgets[0].config.band) || 'C';
            state.questionSession = MCS.runQuestion(rawQuestion, {
                widgetMount: pracInteractivePanel,
                promptMount: pracTaskTitle,
                band: band,
            });
        } else {
            assignDescriptorAndContext(rawQuestion);
            state.currentQuestion = rawQuestion;
            pracTaskTitle.innerHTML = rawQuestion.questionText;
            pracInteractivePanel.innerHTML = '';
            rawQuestion.renderFunc(pracInteractivePanel);
        }
            
        addLog(`New practice challenge generated for strand: ${state.activeCategory.toUpperCase()}`, "system");
    }

    // Tab switcher
    document.querySelectorAll('.selector-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            sounds.click();
            document.querySelectorAll('.selector-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            state.activeCategory = tab.dataset.task;
            initSandboxQuestion();
        });
    });

    btnPracHint.addEventListener('click', () => {
        sounds.hint();
        if (state.questionSession) {
            state.questionSession.showHint(pracHintContent);
        } else if (state.currentQuestion) {
            pracHintContent.innerHTML = state.currentQuestion.hintText;
        }
        pracHintContainer.style.display = 'block';
        btnPracHint.style.display = 'none';
        addLog("Hint module active.", "system");
    });

    btnPracSubmit.addEventListener('click', () => {
        if (!state.currentQuestion) return;

        const isCorrect = state.questionSession
            ? state.questionSession.evaluate()
            : state.currentQuestion.validateFunc();

        if (isCorrect) {
            sounds.success();
            if (state.questionSession) {
                Object.keys(state.questionSession.instances).forEach((id) => {
                    const inst = state.questionSession.instances[id];
                    if (inst && typeof inst.flagCorrect === 'function') inst.flagCorrect();
                });
                state.questionSession.setEnabled(false);
            }
            pracFeedbackText.textContent = "CORRECT! +10 POINTS";
            pracFeedbackText.className = "active-feedback-text feedback-success";
            pracFeedbackText.style.display = 'block';
            
            btnPracSubmit.style.display = 'none';
            btnPracHint.style.display = 'none';
            btnPracNext.style.display = 'block';

            if (state.activeInterval) clearInterval(state.activeInterval);

            const pointsGained = state.attemptsLeft === 2 ? 10 : 5;
            gainPoints(pointsGained, true, state.activeCategory, state.currentQuestion.descriptor, state.currentQuestion.context);
            addLog(`Calibration verified successfully! Awarded +${pointsGained} PTS in ${state.activeCategory.toUpperCase()}.`, "success");
        } else {
            sounds.error();
            if (state.questionSession) {
                Object.keys(state.questionSession.instances).forEach((id) => {
                    const inst = state.questionSession.instances[id];
                    if (inst && typeof inst.flagIncorrect === 'function') inst.flagIncorrect();
                });
            }
            state.attemptsLeft--;
            pracAttemptsLeft.textContent = `${state.attemptsLeft} ATTEMPTS LEFT`;

            if (state.attemptsLeft === 1) {
                pracAttemptsLeft.classList.add('warning');
                pracFeedbackText.textContent = "DEVIATION DETECTED. TRY AGAIN.";
                pracFeedbackText.className = "active-feedback-text feedback-error";
                pracFeedbackText.style.display = 'block';
                btnPracHint.style.display = 'block';
                addLog("System calibration mismatch. Attempt 2 active.", "error");
            } else {
                pracAttemptsLeft.textContent = "0 ATTEMPTS LEFT";
                pracAttemptsLeft.classList.add('error');
                pracFeedbackText.textContent = "CALIBRATION FAILED.";
                pracFeedbackText.className = "active-feedback-text feedback-error";
                pracFeedbackText.style.display = 'block';
                
                btnPracSubmit.style.display = 'none';
                btnPracHint.style.display = 'none';
                btnPracNext.style.display = 'block';

                if (state.activeInterval) clearInterval(state.activeInterval);

                if (state.questionSession) {
                    state.questionSession.setEnabled(false);
                    state.questionSession.showSolution(pracSolutionContent);
                } else {
                    pracSolutionContent.innerHTML = state.currentQuestion.solutionText;
                }
                pracSolutionContainer.style.display = 'block';
                
                gainPoints(0, false, state.activeCategory, state.currentQuestion.descriptor, state.currentQuestion.context);
                addLog(`Calibration failed for strand ${state.activeCategory.toUpperCase()}. Realignment required.`, "error");
            }
        }
    });

    btnPracNext.addEventListener('click', () => {
        sounds.click();
        initSandboxQuestion();
    });

    // ----------------------------------------------------
    // Trophy Room Overlay Modal Logic
    // ----------------------------------------------------
    let trophyActiveYear = 4;
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
        
        // Render year selector tabs
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
        
        // Grand Mastery Showcase
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
        
        // Render strands
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

    // Booting practice session
    loadProfile();
    initSandboxQuestion();
});
