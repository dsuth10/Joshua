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
        
        profile.scoresByCat = profile.scoresByCatY3; 
    }

    function loadProfile() {
        const stored = localStorage.getItem('joshua_math_profile');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                
                // Migrate legacy scoresByCat to scoresByCatY3
                if (parsed.scoresByCat && !parsed.scoresByCatY3 && !parsed.scoresByCatY5 && !parsed.scoresByCatY4) {
                    parsed.scoresByCatY3 = parsed.scoresByCat;
                }
                
                Object.assign(profile, parsed);
                migrateDescriptorProfileKeys(profile);
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
                                    const code = normalizeDescriptorCode(DESCRIPTOR_BADGES[descKey].code);
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
            const code = normalizeDescriptorCode(DESCRIPTOR_BADGES[key].code);
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
        
        const activeYear = 3;
        const y3Descriptors = Object.keys(DESCRIPTOR_BADGES).filter(key => DESCRIPTOR_BADGES[key].year === activeYear);
        const y3GrandBadges = Object.keys(GRAND_BADGES).filter(key => GRAND_BADGES[key].year === activeYear);
        const allBadgeKeys = [...Object.keys(GLOBAL_BADGES), ...y3Descriptors, ...y3GrandBadges];
        
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

    function buildDotArrayDisplay(rows, colsPerRow) {
        const dot = '<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:var(--primary);margin:2px;" aria-hidden="true"></span>';
        const rowHtml = Array.from({ length: rows }, () =>
            `<div style="display:flex;justify-content:center;gap:2px;">${dot.repeat(colsPerRow)}</div>`
        ).join('');
        return `<div style="display:flex;flex-direction:column;align-items:center;gap:6px;margin:8px 0 4px;">${rowHtml}</div>`;
    }

    function y3LandmarkGridConfig(extra) {
        return Object.assign({
            band: 'B',
            xMin: 0,
            xMax: 4,
            yMin: 0,
            yMax: 4,
            quadrants: 1,
            snap: 1,
            labels: 'all',
            showGrid: true,
            showAxes: true,
        }, extra || {});
    }

    function landmarkMarkers(landmarks) {
        return landmarks.map((lm) => ({
            x: lm.x,
            y: lm.y,
            label: lm.label.charAt(0),
        }));
    }

    function arrayLayoutForSum(total) {
        const cols = Math.min(10, total);
        const rows = Math.ceil(total / cols);
        return { rows, cols };
    }

    // ----------------------------------------------------
    // Legacy-keep recall helpers (Phase 3d Slice 0 — badge context coverage)
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
                        placeholder: opts.placeholder || '?',
                        width: opts.width || '100px',
                        step: opts.step,
                        ariaLabel: opts.ariaLabel || 'Numeric answer',
                    },
                },
            ],
            evaluate(values) {
                const user = values.ans;
                if (user == null || user === '') return false;
                const parsed = Number(user);
                const expected = Number(answer);
                if (!Number.isFinite(parsed) || !Number.isFinite(expected)) return false;
                if (opts.tolerance != null) {
                    return Math.abs(parsed - expected) <= opts.tolerance;
                }
                return parsed === expected;
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

    // ----------------------------------------------------
    // 5. Dynamic Category Generators (Year 3 Strands)
    // ----------------------------------------------------
    const generators = {
        number: () => {
            const subTypes = ['numeral-ordering', 'unit-fractions', 'addition-subtraction-regroup'];
            const chosenType = subTypes[Math.floor(Math.random() * subTypes.length)];

            if (chosenType === 'numeral-ordering') {
                // legacy-keep: dropdown ordering is age-appropriate and fast (Phase 3d Slice 4)
                const base = (Math.floor(Math.random() * 8) + 1) * 10000;
                const numList = [];
                while (numList.length < 4) {
                    const val = base + Math.floor(Math.random() * 900) * 10;
                    if (!numList.includes(val)) numList.push(val);
                }
                const sorted = [...numList].sort((a, b) => a - b);
                const shuffled = shuffleArray(numList);
                const selectOptions = [
                    { value: '', label: '—' },
                    ...shuffled.map((n) => ({
                        value: n,
                        label: n.toLocaleString('en-AU'),
                    })),
                ];
                const ordLabels = ['1st (smallest)', '2nd', '3rd', '4th (largest)'];
                const ordIds = ['ord1', 'ord2', 'ord3', 'ord4'];

                return {
                    descriptor: 'AC9M3N01',
                    context: Math.random() > 0.5 ? 'numeral-ordering-value' : 'numeral-partitioning',
                    category: 'number',
                    type: 'numeral-ordering',
                    title: 'Order the numbers from smallest to largest:',
                    prompt: 'Arrange these numerals from smallest (1st) to largest (4th).',
                    widgets: [
                        {
                            id: 'display',
                            type: 'legacy-passthrough',
                            config: {
                                render: (container) => {
                                    container.innerHTML = `
                                        <div class="flex-row gap-12 justify-center flex-wrap" style="font-size:1.4rem; font-weight:700; color:var(--primary); margin-bottom:8px;">
                                            ${shuffled.map((n) => `<span class="hint-expander-place" style="padding: 4px 10px;">${n.toLocaleString('en-AU')}</span>`).join('')}
                                        </div>
                                    `;
                                },
                            },
                        },
                    ],
                    inputs: ordIds.map((id, idx) => ({
                        id,
                        type: 'select-input',
                        config: {
                            label: ordLabels[idx] + ':',
                            width: '120px',
                            options: selectOptions,
                            ariaLabel: `Position ${idx + 1} in order`,
                        },
                    })),
                    evaluate(values) {
                        const picks = ordIds.map((id) => values[id]);
                        if (picks.some((v) => v == null || v === '')) return false;
                        const nums = picks.map((v) => (typeof v === 'number' ? v : parseInt(v, 10)));
                        if (nums.some((v) => isNaN(v))) return false;
                        if (new Set(nums).size !== 4) return false;
                        return nums[0] === sorted[0] && nums[1] === sorted[1]
                            && nums[2] === sorted[2] && nums[3] === sorted[3];
                    },
                    hint: {
                        text: `
                            <p>Align the numbers column by column starting from the Ten-Thousands place:</p>
                            <ul style="margin-top:4px; padding-left:16px;">
                                <li>Compare the Ten-Thousands first. (They are all the same: ${Math.floor(base / 10000)}0,000)</li>
                                <li>Compare the Thousands place.</li>
                                <li>Compare the Hundreds place.</li>
                            </ul>
                        `,
                        highlight: ['display', 'ord1', 'ord2', 'ord3', 'ord4'],
                    },
                    solution: {
                        text: `The correct ordering from smallest to largest is: ${sorted[0]} < ${sorted[1]} < ${sorted[2]} < ${sorted[3]}.`,
                        show: { ord1: sorted[0], ord2: sorted[1], ord3: sorted[2], ord4: sorted[3] },
                    },
                    points: 10,
                };
            } else if (chosenType === 'unit-fractions') {
                const denominators = [2, 3, 4, 5, 10];
                const den = denominators[Math.floor(Math.random() * denominators.length)];
                const num = Math.floor(Math.random() * (den - 1)) + 1;
                const useBars = Math.random() > 0.5;

                if (useBars) {
                    return {
                        descriptor: 'AC9M3N02',
                        context: 'unit-fraction-bars',
                        category: 'number',
                        title: 'SHADE THE FRACTION',
                        prompt: `Tap parts of the bar to shade **${num}/${den}** of the whole.`,
                        widgets: [
                            {
                                id: 'bar',
                                type: 'fraction-bars',
                                config: {
                                    mode: 'shade',
                                    band: 'B',
                                    denominator: den,
                                    bars: 1,
                                    maxShaded: den,
                                    initialShaded: 0,
                                    allowToggle: true,
                                },
                            },
                        ],
                        inputs: [],
                        evaluate(values) {
                            return values.bar && values.bar.num === num && values.bar.den === den;
                        },
                        hint: {
                            text: `<p>Tap exactly <strong>${num}</strong> of the <strong>${den}</strong> equal parts to shade <strong>${num}/${den}</strong> of the bar.</p><p>Each segment is one equal part. Tap a shaded part again to unshade it.</p>`,
                            highlight: ['bar:segments'],
                        },
                        solution: {
                            text: `Shade <strong>${num}</strong> of the <strong>${den}</strong> equal parts — that is the fraction <strong>${num}/${den}</strong>.`,
                            show: { bar: { num, den } },
                        },
                        points: 10,
                    };
                }

                return {
                    descriptor: 'AC9M3N02',
                    context: 'unit-fraction-lines',
                    category: 'number',
                    title: 'READ THE FRACTION',
                    prompt: 'Determine the fraction marked by the dot on the number line below:',
                    widgets: [
                        {
                            id: 'line',
                            type: 'number-line',
                            config: {
                                mode: 'read-point',
                                band: 'B',
                                min: 0,
                                max: 1,
                                markedValue: num / den,
                                showFractionLabels: true,
                                fractionDenominator: den,
                                snapStep: 1 / den,
                                ticks: { major: 1, minor: 1 / den, labels: 'major' },
                            },
                        },
                    ],
                    inputs: [
                        {
                            id: 'num',
                            type: 'number-input',
                            config: { label: 'Numerator', placeholder: '?', width: '55px' },
                        },
                        {
                            id: 'den',
                            type: 'number-input',
                            config: { label: 'Denominator', placeholder: '?', width: '55px' },
                        },
                    ],
                    evaluate(values) {
                        return values.num === num && values.den === den;
                    },
                    hint: {
                        text: `<p>1. Count how many equal intervals split the line from 0 to 1. That is the denominator: <strong>${den}</strong>.</p><p>2. Count the jumps from 0 to the target dot. That is the numerator: <strong>${num}</strong>.</p>`,
                        highlight: ['line'],
                    },
                    solution: {
                        text: `The number line is divided into ${den} equal parts. The dot is at the ${num}th tick, representing **${num}/${den}**.`,
                        show: { num, den, line: num / den },
                    },
                    points: 10,
                };
            } else if (chosenType === 'addition-subtraction-regroup') {
                const isAdd = Math.random() > 0.5;
                let num1, num2, ans, sign;

                if (isAdd) {
                    num1 = Math.floor(Math.random() * 400) + 150;
                    num2 = Math.floor(Math.random() * 300) + 80;
                    ans = num1 + num2;
                    sign = '+';
                } else {
                    num1 = Math.floor(Math.random() * 600) + 300;
                    num2 = Math.floor(Math.random() * 200) + 50;
                    ans = num1 - num2;
                    sign = '−';
                }

                // legacy-keep: written algorithm primary; place-value-blocks hint (Phase 3d Slice 3)
                return {
                    descriptor: 'AC9M3N03',
                    context: isAdd ? 'addition-regroup' : 'subtraction-regroup',
                    category: 'number',
                    type: 'addition-subtraction-regroup',
                    title: 'Solve the place value equation:',
                    prompt: `Work out **${num1} ${sign} ${num2}**.`,
                    widgets: [
                        {
                            id: 'display',
                            type: 'legacy-passthrough',
                            config: {
                                render: (container) => {
                                    container.innerHTML = `
                                        <div class="flex-col align-center gap-8">
                                            <div style="font-size:2.8rem; font-weight:700; color:var(--primary); font-family:var(--font-display);">${num1} ${sign} ${num2}</div>
                                        </div>
                                    `;
                                },
                            },
                        },
                        {
                            id: 'blocks',
                            type: 'place-value-blocks',
                            config: {
                                mode: 'build',
                                band: 'B',
                                values: [num1, num2],
                                sign,
                                max: 999,
                                showHundreds: true,
                                hintOnly: true,
                            },
                        },
                    ],
                    inputs: [
                        {
                            id: 'ans',
                            type: 'number-input',
                            config: {
                                placeholder: '?',
                                width: '130px',
                                ariaLabel: 'Answer',
                            },
                        },
                    ],
                    evaluate(values) {
                        const user = values.ans;
                        return typeof user === 'number' && user === ans;
                    },
                    hint: {
                        text: `
                            <p>Write the numbers vertically aligned by place value (Hundreds, Tens, Ones):</p>
                            <p style="font-family:var(--font-mono); margin-top:4px; margin-left:16px;">
                               &nbsp;&nbsp;${num1}<br>
                               ${sign} ${num2}<br>
                               ------
                            </p>
                            <p style="margin-top:6px;">Use the <strong>place-value blocks</strong> to see how each digit is made of hundreds, tens, and ones. Add or subtract from the ones column first, regrouping to the tens column if needed.</p>
                        `,
                        highlight: ['blocks', 'ans'],
                    },
                    solution: {
                        text: `Direct vertical alignment calculation shows: ${num1} ${sign} ${num2} = **${ans}**.`,
                        show: { ans, blocks: [num1, num2] },
                    },
                    points: 10,
                };
            }
        },
        algebra: () => {
            const subTypes = ['fact-families', 'multiplication-recall', 'division-facts'];
            const chosenType = subTypes[Math.floor(Math.random() * subTypes.length)];

            if (chosenType === 'fact-families') {
                const a = Math.floor(Math.random() * 30) + 12;
                const b = Math.floor(Math.random() * 25) + 8;
                const sum = a + b;
                const pos = Math.floor(Math.random() * 3);

                let eqText = '';
                let targetUnknown = 0;
                let splitAt = 0;
                const grid = arrayLayoutForSum(sum);

                if (pos === 0) {
                    eqText = `? + ${b} = ${sum}`;
                    targetUnknown = a;
                    splitAt = b;
                } else if (pos === 1) {
                    eqText = `${a} + ? = ${sum}`;
                    targetUnknown = b;
                    splitAt = a;
                } else {
                    eqText = `${sum} − ? = ${a}`;
                    targetUnknown = b;
                    splitAt = a;
                }

                // legacy-keep: recall primary; array-builder hint visual (Phase 3d Slice 3)
                return {
                    descriptor: 'AC9M3A01',
                    context: pos === 2 ? 'fact-families-sub' : 'fact-families-add',
                    category: 'algebra',
                    type: 'fact-families',
                    title: 'Determine the unknown value (?) in the equation using inverse operations:',
                    prompt: eqText,
                    widgets: [
                        {
                            id: 'display',
                            type: 'legacy-passthrough',
                            config: {
                                render: (container) => {
                                    container.innerHTML = `
                                        <div class="flex-col align-center gap-8">
                                            <div style="font-size:2.8rem; font-weight:700; color:var(--primary); font-family:var(--font-display);">${eqText}</div>
                                        </div>
                                    `;
                                },
                            },
                        },
                        {
                            id: 'array',
                            type: 'array-builder',
                            config: {
                                mode: 'show-array',
                                band: 'B',
                                rows: grid.rows,
                                cols: grid.cols,
                                total: sum,
                                splitAt,
                                hintOnly: true,
                            },
                        },
                    ],
                    inputs: [
                        {
                            id: 'ans',
                            type: 'number-input',
                            config: {
                                placeholder: '?',
                                width: '100px',
                                ariaLabel: 'Unknown value',
                            },
                        },
                    ],
                    evaluate(values) {
                        const user = values.ans;
                        return typeof user === 'number' && user === targetUnknown;
                    },
                    hint: {
                        text: `
                            <p>Addition and subtraction are inverse operations:</p>
                            <ul style="margin-top:4px; padding-left:16px;">
                                <li>If <code>? + B = C</code>, then <code>? = C − B</code>.</li>
                                <li>If <code>C − ? = A</code>, then <code>? = C − A</code>.</li>
                            </ul>
                            <p style="margin-top:6px;">The <strong>dot array</strong> shows ${sum} in rows of 10. The highlighted dots are the known amount; count the rest to find <strong>?</strong>.</p>
                        `,
                        highlight: ['array', 'ans'],
                    },
                    solution: {
                        text: `Applying inverse operation: ${eqText.replace('?', `**${targetUnknown}**`)}.`,
                        show: { ans: targetUnknown, array: { rows: grid.rows, cols: grid.cols, total: sum, splitAt } },
                    },
                    points: 10,
                };
            } else if (chosenType === 'multiplication-recall') {
                const tables = [3, 4, 5, 10];
                const factor1 = tables[Math.floor(Math.random() * tables.length)];
                const factor2 = Math.floor(Math.random() * 10) + 1;
                const ans = factor1 * factor2;

                // legacy-keep: recall speed (Phase 3d Slice 5)
                return makeLegacyNumeric({
                    descriptor: 'AC9M3A03',
                    context: (factor1 === 3 || factor1 === 4)
                        ? 'multiplication-recall-3-4'
                        : 'multiplication-recall-5-10',
                    category: 'algebra',
                    title: 'Recall and calculate the multiplication fact:',
                    display: `<div style="font-size:2.8rem; font-weight:700; color:var(--primary); font-family:var(--font-display); text-align:center;">${factor1} × ${factor2}</div>`,
                    answer: ans,
                    hint: `<p>Use skip counting to find the answer: Count in groups of ${factor1} a total of ${factor2} times.</p>`,
                    solution: `${factor1} groups of ${factor2} equals **${ans}**. (${factor1} × ${factor2} = ${ans})`,
                });
            } else if (chosenType === 'division-facts') {
                const tables = [3, 4, 5, 10];
                const divisor = tables[Math.floor(Math.random() * tables.length)];
                const quotient = Math.floor(Math.random() * 10) + 1;
                const dividend = divisor * quotient;

                // legacy-keep: recall speed (Phase 3d Slice 5)
                return makeLegacyNumeric({
                    descriptor: 'AC9M3A03',
                    context: (divisor === 3 || divisor === 4)
                        ? 'multiplication-recall-3-4'
                        : 'multiplication-recall-5-10',
                    category: 'algebra',
                    title: 'Recall and calculate the related division fact:',
                    display: `<div style="font-size:2.8rem; font-weight:700; color:var(--primary); font-family:var(--font-display); text-align:center;">${dividend} ÷ ${divisor}</div>`,
                    answer: quotient,
                    hint: `<p>Think: What number multiplied by ${divisor} equals ${dividend}? (i.e. ${divisor} × ? = ${dividend})</p>`,
                    solution: `${dividend} split into groups of ${divisor} gives **${quotient}** groups. (${dividend} ÷ ${divisor} = ${quotient})`,
                });
            }
        },
        measurement: () => {
            const subTypes = ['analog-clock', 'money-values'];
            const chosenType = subTypes[Math.floor(Math.random() * subTypes.length)];

            if (chosenType === 'analog-clock') {
                const hours = Math.floor(Math.random() * 12) + 1;
                const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 12, 28, 43, 57][
                    Math.floor(Math.random() * 16)
                ];
                const padded = minutes.toString().padStart(2, '0');
                const isSetTime = Math.random() > 0.5;

                if (isSetTime) {
                    return {
                        descriptor: 'AC9M3M04',
                        context: 'set-clock-time',
                        category: 'measurement',
                        title: 'SET THE CLOCK',
                        prompt: `Set the clock to **${hours}:${padded}**.`,
                        widgets: [
                            {
                                id: 'clock',
                                type: 'analog-clock',
                                config: {
                                    mode: 'set-time',
                                    band: 'B',
                                    hours: 12,
                                    minutes: 0,
                                    draggable: 'both',
                                    snapMinutes: 5,
                                    gear: true,
                                    showDigital: false,
                                },
                            },
                        ],
                        inputs: [],
                        evaluate(values) {
                            return (
                                values.clock &&
                                values.clock.hours === hours &&
                                values.clock.minutes === minutes
                            );
                        },
                        hint: {
                            text: `Move the long hand (minutes) first — each number is 5 minutes. The short hand (hours) follows along. Target: ${hours}:${padded}.`,
                            highlight: ['clock'],
                        },
                        solution: {
                            text: `The clock should show **${hours}:${padded}**.`,
                            show: { clock: { hours, minutes } },
                        },
                        points: 10,
                    };
                }

                const readContext =
                    Math.random() > 0.5 ? 'read-clock-hour' : 'read-clock-minute';
                const readHint =
                    readContext === 'read-clock-hour'
                        ? `<p>Look at the <strong>short hour hand</strong> first. Which number has it reached or just passed?</p><p>Then check the minute hand for the exact minutes.</p>`
                        : `<p>Look at the <strong>long minute hand</strong>. Count by fives for each number, then add any extra minutes.</p><p>The hour is shown by the short hand.</p>`;

                return {
                    descriptor: 'AC9M3M04',
                    context: readContext,
                    category: 'measurement',
                    title: 'READ THE CLOCK',
                    prompt: 'Read the time shown on the analog clock to the nearest minute.',
                    widgets: [
                        {
                            id: 'clock',
                            type: 'analog-clock',
                            config: {
                                mode: 'read-time',
                                band: 'B',
                                hours,
                                minutes,
                                draggable: 'none',
                                gear: true,
                                showDigital: false,
                            },
                        },
                    ],
                    inputs: [{ id: 'time', type: 'time-pair', config: {} }],
                    evaluate(values) {
                        return (
                            values.time &&
                            values.time.hours === hours &&
                            values.time.minutes === minutes
                        );
                    },
                    hint: {
                        text: readHint,
                        highlight: ['clock'],
                    },
                    solution: {
                        text: `The hour hand points at or just past ${hours}, and the minute hand shows ${minutes} minutes. The time is **${hours}:${padded}**.`,
                        show: { time: { hours, minutes } },
                    },
                    points: 10,
                };
            } else if (chosenType === 'money-values') {
                const note5 = Math.floor(Math.random() * 2);
                const coin2 = Math.floor(Math.random() * 3) + 1;
                const coin50 = Math.floor(Math.random() * 2) + 1;
                const coin20 = Math.floor(Math.random() * 3);

                const totalCents = (note5 * 500) + (coin2 * 200) + (coin50 * 50) + (coin20 * 20);
                const dollarsStr = (totalCents / 100).toFixed(2);

                // legacy-keep: static coin illustration + arithmetic (Phase 3d Slice 5)
                return makeLegacyNumeric({
                    descriptor: 'AC9M3M06',
                    context: Math.random() > 0.5 ? 'money-addition' : 'money-subtraction',
                    category: 'measurement',
                    title: 'Calculate the total money value of the following currency collection:',
                    prompt: 'Add the notes and coins below.',
                    display: `
                        <div class="flex-col gap-8" style="max-width:440px; margin:0 auto;">
                            <ul style="margin-left:24px; line-height:1.6; font-size:0.95rem;">
                                ${note5 ? `<li><strong>${note5}</strong> × $5 note</li>` : ''}
                                <li><strong>${coin2}</strong> × $2 gold coins</li>
                                <li><strong>${coin50}</strong> × 50c silver coins</li>
                                ${coin20 ? `<li><strong>${coin20}</strong> × 20c silver coins</li>` : ''}
                            </ul>
                        </div>
                    `,
                    label: 'Total $',
                    placeholder: '0.00',
                    width: '140px',
                    step: 0.01,
                    answer: parseFloat(dollarsStr),
                    tolerance: 0.01,
                    hint: `
                        <p>Calculate the value of notes and coins separately, then sum them:</p>
                        <ul style="margin-top:4px; padding-left:16px;">
                            ${note5 ? `<li>One $5 note = $5.00</li>` : ''}
                            <li>${coin2} × $2 coins = $${(coin2 * 2).toFixed(2)}</li>
                            <li>${coin50} × 50c coins = $${(coin50 * 0.5).toFixed(2)}</li>
                            ${coin20 ? `<li>${coin20} × 20c coins = $${(coin20 * 0.2).toFixed(2)}</li>` : ''}
                        </ul>
                    `,
                    solution: `Summing the currency values: ${note5 ? `$5.00 + ` : ''}$${(coin2 * 2).toFixed(2)} + $${(coin50 * 0.5).toFixed(2)}${coin20 ? ` + $${(coin20 * 0.2).toFixed(2)}` : ''} = **$${dollarsStr}**.`,
                });
            }
        },
        space: () => {
            const labels = ['Tree', 'Pond', 'Hut', 'Cave', 'Well'];
            const shuffledLabels = shuffleArray(labels);

            const landmarks = [
                { label: shuffledLabels[0], x: Math.floor(Math.random() * 2), y: Math.floor(Math.random() * 2) },
                { label: shuffledLabels[1], x: Math.floor(Math.random() * 2) + 2, y: Math.floor(Math.random() * 2) + 2 },
                { label: shuffledLabels[2], x: Math.floor(Math.random() * 2) + 2, y: Math.floor(Math.random() * 2) },
            ];
            const markers = landmarkMarkers(landmarks);
            const questionType = Math.random() > 0.5 ? 'locate' : 'navigate';

            if (questionType === 'locate') {
                const targetLm = landmarks[Math.floor(Math.random() * landmarks.length)];

                return {
                    descriptor: 'AC9M3SP02',
                    context: 'landmark-locate-coords',
                    category: 'space',
                    title: 'LOCATE LANDMARK',
                    prompt: `Locate **${targetLm.label}** on the grid map. Enter its coordinates.`,
                    widgets: [
                        {
                            id: 'map',
                            type: 'coordinate-plotter',
                            config: y3LandmarkGridConfig({
                                mode: 'read-point',
                                draggable: false,
                                markers,
                            }),
                        },
                    ],
                    inputs: [
                        {
                            id: 'coords',
                            type: 'coordinate-pair',
                            config: { prefix: '(', suffix: ')' },
                        },
                    ],
                    evaluate(values) {
                        return (
                            values.coords &&
                            values.coords.x === targetLm.x &&
                            values.coords.y === targetLm.y
                        );
                    },
                    hint: {
                        text: `<p>Find **${targetLm.label}** on the grid map.</p><p>1. Read the x-coordinate (column): <strong>${targetLm.x}</strong>.</p><p>2. Read the y-coordinate (row): <strong>${targetLm.y}</strong>.</p>`,
                        highlight: ['map'],
                    },
                    solution: {
                        text: `The ${targetLm.label} sits at column ${targetLm.x} and row ${targetLm.y}. Coordinates: **(${targetLm.x}, ${targetLm.y})**.`,
                        show: { coords: { x: targetLm.x, y: targetLm.y }, map: { x: targetLm.x, y: targetLm.y } },
                    },
                    points: 10,
                };
            }

            const startLm = landmarks[0];
            const destLm = landmarks[1];
            const dx = destLm.x - startLm.x;
            const dy = destLm.y - startLm.y;

            return {
                descriptor: 'AC9M3SP02',
                context: 'landmark-navigate-coords',
                category: 'space',
                title: 'NAVIGATE GRID',
                prompt: `Start at the **${startLm.label}**. Move **${dx} units Right** and **${dy} units Up**. Drag the pin to the landing point.`,
                widgets: [
                    {
                        id: 'map',
                        type: 'coordinate-plotter',
                        config: y3LandmarkGridConfig({
                            mode: 'path',
                            markers,
                            initialX: startLm.x,
                            initialY: startLm.y,
                        }),
                    },
                ],
                inputs: [],
                evaluate(values) {
                    return values.map && values.map.x === destLm.x && values.map.y === destLm.y;
                },
                hint: {
                    text: `<p>Start at **${startLm.label}** (${startLm.x}, ${startLm.y}).</p><p>Move ${dx} grid units Right (to column ${destLm.x}) and ${dy} grid units Up (to row ${destLm.y}).</p><p>The landing landmark is **${destLm.label}**.</p>`,
                    highlight: ['map'],
                },
                solution: {
                    text: `Starting at ${startLm.label} (${startLm.x}, ${startLm.y}), shifting ${dx} Right and ${dy} Up leads to (${destLm.x}, ${destLm.y}) — the **${destLm.label}**.`,
                    show: { map: { x: destLm.x, y: destLm.y } },
                },
                points: 10,
            };
        },
        statistics: () => {
            const categories = ['Dogs', 'Cats', 'Birds', 'Fish'];
            const vals = [];
            while (vals.length < 4) {
                const rVal = (Math.floor(Math.random() * 5) + 1) * 2;
                if (!vals.includes(rVal)) vals.push(rVal);
            }
            const scaleInterval = 2;
            const varType = Math.random() > 0.5 ? 0 : 1;

            let context;
            let prompt;
            let ans;
            let hintText;
            let solutionText;
            let solutionShow;
            let title;

            if (varType === 0) {
                const targetIdx = Math.floor(Math.random() * 4);
                context = 'read-column-chart-3';
                title = 'READ THE COLUMN GRAPH';
                prompt = `According to the column graph, how many students chose **${categories[targetIdx]}** as their favourite pet?`;
                ans = vals[targetIdx];
                hintText = `<p>Tap the <strong>${categories[targetIdx]}</strong> column to project a guide line to the y-axis.</p><p>Each division on the axis scales by <strong>${scaleInterval}</strong> units.</p>`;
                solutionText = `The column for ${categories[targetIdx]} aligns with **${vals[targetIdx]}** on the scaled y-axis.`;
                solutionShow = { chart: { category: categories[targetIdx] }, ans };
            } else {
                let randIdx1 = Math.floor(Math.random() * 4);
                let randIdx2 = Math.floor(Math.random() * 4);
                while (randIdx1 === randIdx2) {
                    randIdx2 = Math.floor(Math.random() * 4);
                }
                const cat1 = categories[randIdx1];
                const cat2 = categories[randIdx2];
                const val1 = vals[randIdx1];
                const val2 = vals[randIdx2];
                context = 'column-chart-difference-3';
                title = 'COMPARE COLUMNS';
                prompt = `How many ${val1 > val2 ? 'more' : 'fewer'} **${cat1}** are there than **${cat2}**?`;
                ans = Math.abs(val1 - val2);
                hintText = `<p>Tap the <strong>${cat1}</strong> and <strong>${cat2}</strong> columns to read each value from the y-axis.</p><p>Subtract the smaller value from the larger. Each axis division is <strong>${scaleInterval}</strong> units.</p>`;
                solutionText = `${cat1} = **${val1}** and ${cat2} = **${val2}**. The difference is |${val1} − ${val2}| = **${ans}**.`;
                solutionShow = {
                    chart: { categories: [cat1, cat2] },
                    ans,
                };
            }

            return {
                descriptor: 'AC9M3ST02',
                context,
                category: 'statistics',
                title,
                prompt,
                widgets: [
                    {
                        id: 'chart',
                        type: 'column-graph',
                        config: {
                            mode: 'read',
                            band: 'B',
                            categories,
                            values: vals,
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
            const type = Math.floor(Math.random() * 3);

            let bagColors = [];
            let targetColor = '';
            let targetLikelihood = '';

            if (type === 0) {
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

            const marbleCounts = bagColors.reduce((acc, col) => {
                const key = col.toLowerCase();
                acc[key] = (acc[key] || 0) + 1;
                return acc;
            }, {});
            const countSummary = Object.keys(marbleCounts)
                .filter((k) => marbleCounts[k] > 0)
                .map((k) => `${marbleCounts[k]} ${k.charAt(0).toUpperCase() + k.slice(1)}`)
                .join(', ');

            return {
                descriptor: 'AC9M3P01',
                context: 'chance-likelihood-3',
                category: 'probability',
                type: 'chance-likelihood',
                title: 'Analyse the marble bag contents to evaluate the chance event:',
                prompt: `If you draw one marble from the bag at random, the chance of drawing a **${targetColor}** marble is:`,
                widgets: [
                    {
                        id: 'bag',
                        type: 'marble-bag',
                        config: {
                            band: 'B',
                            mode: 'read',
                            counts: marbleCounts,
                        },
                    },
                ],
                inputs: [
                    {
                        id: 'likelihood',
                        type: 'select-input',
                        config: {
                            label: 'Likelihood:',
                            width: '200px',
                            options: [
                                { value: '', label: 'Choose…' },
                                { value: 'Certain', label: 'Certain' },
                                { value: 'Likely', label: 'Likely' },
                                { value: 'Unlikely', label: 'Unlikely' },
                                { value: 'Impossible', label: 'Impossible' },
                            ],
                            ariaLabel: 'Likelihood of drawing the target colour',
                        },
                    },
                ],
                evaluate(values) {
                    return values.likelihood === targetLikelihood;
                },
                hint: {
                    text: `
                        <p>Assess the bag marbles:</p>
                        <ul style="margin-top:4px; padding-left:16px;">
                            <li><strong>Certain</strong>: ALL marbles match the colour.</li>
                            <li><strong>Likely</strong>: Most (but not all) marbles match the colour.</li>
                            <li><strong>Unlikely</strong>: Very few marbles match the colour.</li>
                            <li><strong>Impossible</strong>: There are ZERO marbles of that colour.</li>
                        </ul>
                        <p style="margin-top:6px;">This bag has ${countSummary.replace(/,([^,]*)$/, ' and$1')} marble${bagColors.length === 1 ? '' : 's'}.</p>
                    `,
                    highlight: ['bag', 'likelihood'],
                },
                solution: {
                    text: `The bag contains: ${countSummary}. Drawing a ${targetColor} marble is **${targetLikelihood.toLowerCase()}**.`,
                    show: { bag: {}, likelihood: targetLikelihood },
                },
                points: 10,
            };
        }
    };

    // P1 + P2 gap generators — legacy-keep badge context coverage (Phase 3d Slice 0)
    const gapGenerators = {
        number: [
            function generateGridArrayMultiplication() {
                const rows = Math.floor(Math.random() * 3) + 2;
                const cols = Math.floor(Math.random() * 4) + 2;
                const ans = rows * cols;
                return makeLegacyNumeric({
                    descriptor: 'AC9M3N04',
                    context: 'grid-array-multiplication',
                    category: 'number',
                    title: 'ARRAY MULTIPLICATION',
                    display: buildDotArrayDisplay(rows, cols),
                    prompt: `This array has **${rows} rows** with **${cols} dots in each row**. How many dots are there **in total**?`,
                    answer: ans,
                    hint: `Multiply rows × dots per row: ${rows} × ${cols}.`,
                    solution: `${rows} × ${cols} = **${ans}** dots in total.`,
                });
            },
            function generateGridArrayDivision() {
                const groups = [3, 4, 5][Math.floor(Math.random() * 3)];
                const perGroup = Math.floor(Math.random() * 5) + 2;
                const total = groups * perGroup;
                return makeLegacyNumeric({
                    descriptor: 'AC9M3N04',
                    context: 'grid-array-division',
                    category: 'number',
                    title: 'ARRAY DIVISION',
                    display: buildDotArrayDisplay(groups, perGroup),
                    prompt: `There are **${total} dots in total**, arranged in **${groups} equal rows** as shown. How many dots are in **each row**?`,
                    answer: perGroup,
                    hint: `Share the total equally: ${total} ÷ ${groups}. Do not multiply ${total} × ${groups}.`,
                    solution: `${total} ÷ ${groups} = **${perGroup}** dots in each row.`,
                });
            },
            function generateQuantityEstimation() {
                const sets = [
                    { count: 48, options: ['About 50', 'About 20', 'About 100', 'About 500'], correct: 'About 50' },
                    { count: 23, options: ['About 20', 'About 80', 'About 200', 'About 5'], correct: 'About 20' },
                    { count: 95, options: ['About 100', 'About 30', 'About 10', 'About 400'], correct: 'About 100' },
                ];
                const q = sets[Math.floor(Math.random() * sets.length)];
                return makeLegacyChoice({
                    descriptor: 'AC9M3N05',
                    context: 'quantity-estimation',
                    category: 'number',
                    title: 'ESTIMATE THE QUANTITY',
                    prompt: `A jar holds roughly **${q.count}** marbles. Which is the **best estimate**?`,
                    options: q.options,
                    correct: q.correct,
                    hint: 'Round to the nearest friendly ten or hundred.',
                    solution: `${q.count} is closest to **${q.correct.replace('About ', '')}**.`,
                });
            },
            function generateReasonablenessCheck() {
                const sets = [
                    { calc: '38 + 42', ans: 80, reasonable: 'Yes — about 40 + 40 = 80', options: ['Yes — about 40 + 40 = 80', 'No — should be 800', 'No — should be 8', 'No — should be 70'] },
                    { calc: '91 − 28', ans: 63, reasonable: 'Yes — 90 − 30 ≈ 60', options: ['Yes — 90 − 30 ≈ 60', 'No — should be 119', 'No — should be 6', 'No — should be 900'] },
                ];
                const q = sets[Math.floor(Math.random() * sets.length)];
                return makeLegacyChoice({
                    descriptor: 'AC9M3N05',
                    context: 'reasonableness-check',
                    category: 'number',
                    title: 'REASONABLENESS CHECK',
                    prompt: `Is **${q.calc} = ${q.ans}** a **reasonable** answer?`,
                    options: q.options,
                    correct: q.reasonable,
                    hint: 'Round each number and check mentally before deciding.',
                    solution: `${q.calc} = ${q.ans}. ${q.reasonable}.`,
                });
            },
            function generateFinancialAdditive() {
                const a = Math.floor(Math.random() * 4) + 2;
                const b = Math.floor(Math.random() * 4) + 1;
                const ans = a + b;
                return makeLegacyNumeric({
                    descriptor: 'AC9M3N06',
                    context: 'financial-additive',
                    category: 'number',
                    title: 'SHOPPING TOTAL',
                    prompt: `You buy a pencil for **$${a}** and an eraser for **$${b}**. What is the **total cost** in dollars?`,
                    answer: ans,
                    hint: 'Add the two prices together.',
                    solution: `$${a} + $${b} = **$${ans}**.`,
                });
            },
            function generateFinancialMultiplicative() {
                const price = Math.floor(Math.random() * 4) + 2;
                const qty = Math.floor(Math.random() * 4) + 2;
                const ans = price * qty;
                return makeLegacyNumeric({
                    descriptor: 'AC9M3N06',
                    context: 'financial-multiplicative',
                    category: 'number',
                    title: 'BUY IN BULK',
                    prompt: `Each sticker costs **$${price}**. You buy **${qty}** stickers. What is the **total cost** in dollars?`,
                    answer: ans,
                    hint: `Multiply price × quantity: ${price} × ${qty}.`,
                    solution: `$${price} × ${qty} = **$${ans}**.`,
                });
            },
            function generateAlgorithmFlowchart() {
                const sets = [
                    {
                        steps: 'Start → Add 5 → Double → Stop',
                        start: 3,
                        apply(n) { return (n + 5) * 2; },
                        partial(n) { return n + 5; },
                        hint: 'Follow each step in order: 3 + 5 = 8, then double to 16.',
                        solution: '3 + 5 = 8, then 8 × 2 = **16**.',
                    },
                    {
                        steps: 'Start → Double → Add 3 → Stop',
                        start: 4,
                        apply(n) { return n * 2 + 3; },
                        partial(n) { return n * 2; },
                        hint: 'Follow each step: 4 × 2 = 8, then 8 + 3 = 11.',
                        solution: '4 × 2 = 8, then 8 + 3 = **11**.',
                    },
                    {
                        steps: 'Start → Subtract 2 → Double → Stop',
                        start: 6,
                        apply(n) { return (n - 2) * 2; },
                        partial(n) { return n - 2; },
                        hint: 'Follow each step: 6 − 2 = 4, then double to 8.',
                        solution: '6 − 2 = 4, then 4 × 2 = **8**.',
                    },
                    {
                        steps: 'Start → Add 10 → Subtract 3 → Stop',
                        start: 5,
                        apply(n) { return n + 10 - 3; },
                        partial(n) { return n + 10; },
                        hint: 'Follow each step: 5 + 10 = 15, then 15 − 3 = 12.',
                        solution: '5 + 10 = 15, then 15 − 3 = **12**.',
                    },
                    {
                        steps: 'Start → Add 6 → Stop',
                        start: 9,
                        apply(n) { return n + 6; },
                        partial(n) { return n; },
                        hint: 'There is only one step: 9 + 6 = 15.',
                        solution: '9 + 6 = **15**.',
                    },
                ];
                const q = sets[Math.floor(Math.random() * sets.length)];
                const ans = q.apply(q.start);
                const ansStr = String(ans);
                const wrong = [];
                for (const v of [q.partial(q.start), ans - 1, ans + 1, q.start, ans + 2]) {
                    if (v > 0 && v !== ans && !wrong.includes(v)) wrong.push(v);
                    if (wrong.length >= 3) break;
                }
                while (wrong.length < 3) {
                    const filler = ans + wrong.length + 3;
                    if (filler !== ans && !wrong.includes(filler)) wrong.push(filler);
                }
                const options = shuffleArray([ansStr, ...wrong.slice(0, 3).map(String)]);
                return makeLegacyChoice({
                    descriptor: 'AC9M3N07',
                    context: 'algorithm-flowchart',
                    category: 'number',
                    title: 'FLOWCHART STEP',
                    prompt: `A flowchart says: **${q.steps}**. If you start with **${q.start}**, what is the result?`,
                    options,
                    correct: ansStr,
                    hint: q.hint,
                    solution: q.solution,
                });
            },
            function generateSequencePattern() {
                const sets = [
                    { seq: '5, 10, 15, 20', next: 25, options: ['25', '22', '30', '18'] },
                    { seq: '2, 4, 6, 8', next: 10, options: ['10', '9', '12', '7'] },
                    { seq: '100, 90, 80, 70', next: 60, options: ['60', '50', '65', '75'] },
                ];
                const q = sets[Math.floor(Math.random() * sets.length)];
                return makeLegacyChoice({
                    descriptor: 'AC9M3N07',
                    context: 'sequence-pattern',
                    category: 'number',
                    title: 'NUMBER PATTERN',
                    prompt: `What number comes **next** in the pattern: **${q.seq}, ?**`,
                    options: q.options,
                    correct: String(q.next),
                    hint: 'Find the rule — add or subtract the same amount each time.',
                    solution: `The pattern continues with **${q.next}**.`,
                });
            },
        ],
        algebra: [
            function generateMentalRecallGrid() {
                const sets = [
                    { prompt: 'What is **6 + 7**?', ans: 13, options: ['13', '12', '14', '11'] },
                    { prompt: 'What is **9 + 8**?', ans: 17, options: ['17', '16', '18', '15'] },
                    { prompt: 'What is **15 − 6**?', ans: 9, options: ['9', '8', '10', '7'] },
                ];
                const q = sets[Math.floor(Math.random() * sets.length)];
                return makeLegacyChoice({
                    descriptor: 'AC9M3A02',
                    context: 'mental-recall-grid',
                    category: 'algebra',
                    title: 'MENTAL STRATEGY',
                    prompt: q.prompt,
                    options: q.options,
                    correct: String(q.ans),
                    hint: 'Use doubles, near-doubles, or bridge through 10.',
                    solution: `The answer is **${q.ans}**.`,
                });
            },
            function generateMentalPartitioning() {
                const total = Math.floor(Math.random() * 6) + 12;
                const part = 10;
                const ans = total - part;
                return makeLegacyNumeric({
                    descriptor: 'AC9M3A02',
                    context: 'mental-partitioning',
                    category: 'algebra',
                    title: 'PARTITION TO 10',
                    prompt: `Partition **${total}** into **10** and another part. What is the missing part?`,
                    answer: ans,
                    hint: `Think: 10 + ? = ${total}.`,
                    solution: `${total} = 10 + **${ans}**.`,
                });
            },
        ],
        measurement: [
            function generateUnitSelectionLength() {
                return makeLegacyChoice({
                    descriptor: 'AC9M3M01',
                    context: 'unit-selection-length',
                    category: 'measurement',
                    title: 'LENGTH UNIT',
                    prompt: 'Which unit is **best** for measuring the length of a **classroom**?',
                    options: ['Metres (m)', 'Millimetres (mm)', 'Kilometres (km)', 'Centimetres (cm) only'],
                    correct: 'Metres (m)',
                    hint: 'Pick a unit that matches the size of the object — not too big, not too small.',
                    solution: 'A classroom is several metres long, so **metres** are best.',
                });
            },
            function generateUnitSelectionCapacity() {
                return makeLegacyChoice({
                    descriptor: 'AC9M3M01',
                    context: 'unit-selection-capacity',
                    category: 'measurement',
                    title: 'CAPACITY UNIT',
                    prompt: 'Which unit is **best** for measuring water in a **drink bottle**?',
                    options: ['Millilitres (mL)', 'Litres (L) only', 'Kilograms (kg)', 'Metres (m)'],
                    correct: 'Millilitres (mL)',
                    hint: 'Capacity measures liquid volume — think cups and bottles.',
                    solution: 'A drink bottle holds a few hundred **millilitres**.',
                });
            },
            function generateRulerMeasurement() {
                const cm = [4, 7, 9, 12][Math.floor(Math.random() * 4)];
                return makeLegacyNumeric({
                    descriptor: 'AC9M3M02',
                    context: 'ruler-measurement',
                    category: 'measurement',
                    title: 'RULER READING',
                    prompt: `A pencil line starts at **0 cm** and ends at the **${cm} cm** mark. How long is the pencil in **centimetres**?`,
                    answer: cm,
                    hint: 'Read the mark where the object ends on the ruler.',
                    solution: `The pencil is **${cm} cm** long.`,
                });
            },
            function generateScaleCylinderReading() {
                const vol = [200, 250, 300, 350][Math.floor(Math.random() * 4)];
                return makeLegacyChoice({
                    descriptor: 'AC9M3M02',
                    context: 'scale-cylinder-reading',
                    category: 'measurement',
                    title: 'CYLINDER READING',
                    prompt: `Water in a measuring cylinder reaches the **${vol} mL** mark. What is the volume?`,
                    options: [`${vol} mL`, `${vol - 50} mL`, `${vol + 50} mL`, `${vol / 2} mL`],
                    correct: `${vol} mL`,
                    hint: 'Read the bottom of the curved surface (meniscus) at eye level.',
                    solution: `The volume is **${vol} mL**.`,
                });
            },
            function generateTimeConversionSeconds() {
                const mins = [2, 3, 5][Math.floor(Math.random() * 3)];
                const ans = mins * 60;
                return makeLegacyNumeric({
                    descriptor: 'AC9M3M03',
                    context: 'time-conversion-seconds',
                    category: 'measurement',
                    title: 'SECONDS CONVERSION',
                    prompt: `How many **seconds** are in **${mins} minutes**?`,
                    answer: ans,
                    hint: '1 minute = 60 seconds. Multiply minutes × 60.',
                    solution: `${mins} × 60 = **${ans}** seconds.`,
                });
            },
            function generateTimeConversionHours() {
                const sets = [
                    { mins: 120, ans: 2 },
                    { mins: 180, ans: 3 },
                    { mins: 60, ans: 1 },
                ];
                const q = sets[Math.floor(Math.random() * sets.length)];
                return makeLegacyNumeric({
                    descriptor: 'AC9M3M03',
                    context: 'time-conversion-hours',
                    category: 'measurement',
                    title: 'HOURS CONVERSION',
                    prompt: `How many **whole hours** are in **${q.mins} minutes**?`,
                    answer: q.ans,
                    hint: '60 minutes = 1 hour. Divide minutes by 60.',
                    solution: `${q.mins} minutes = **${q.ans}** hour(s).`,
                });
            },
            function generateAngleTurnDirection() {
                return makeLegacyChoice({
                    descriptor: 'AC9M3M05',
                    context: 'angle-turn-direction',
                    category: 'measurement',
                    title: 'TURN DIRECTION',
                    prompt: 'You face **North** and turn **a quarter turn clockwise**. Which direction do you face?',
                    options: ['East', 'West', 'South', 'North'],
                    correct: 'East',
                    hint: 'Clockwise follows the clock hands: N → E → S → W.',
                    solution: 'A quarter turn clockwise from North faces **East**.',
                });
            },
            function generateAngleRightCompare() {
                return makeLegacyChoice({
                    descriptor: 'AC9M3M05',
                    context: 'angle-right-compare',
                    category: 'measurement',
                    title: 'RIGHT ANGLE COMPARE',
                    prompt: 'Which angle is **smaller than a right angle** (less than 90°)?',
                    options: ['45°', '90°', '120°', '180°'],
                    correct: '45°',
                    hint: 'A right angle is exactly 90° — like the corner of a square.',
                    solution: '**45°** is acute — smaller than a right angle.',
                });
            },
        ],
        space: [
            function generateShapeClassify3d() {
                const shapes = [
                    { clue: '6 square faces, 12 edges, 8 corners', name: 'Cube' },
                    { clue: 'Rolls smoothly, no flat faces', name: 'Sphere' },
                    { clue: '1 circular base that tapers to a point', name: 'Cone' },
                ];
                const q = shapes[Math.floor(Math.random() * shapes.length)];
                return makeLegacyChoice({
                    descriptor: 'AC9M3SP01',
                    context: 'shape-classify-3d',
                    category: 'space',
                    title: 'CLASSIFY 3D OBJECT',
                    prompt: `Which 3D object matches: **${q.clue}**?`,
                    options: ['Cube', 'Sphere', 'Cone', 'Cylinder'],
                    correct: q.name,
                    hint: 'Count faces, edges, and whether it can roll.',
                    solution: `That description fits a **${q.name}**.`,
                });
            },
            function generateShapeProperties3d() {
                return makeLegacyChoice({
                    descriptor: 'AC9M3SP01',
                    context: 'shape-properties-3d',
                    category: 'space',
                    title: '3D PROPERTIES',
                    prompt: 'How many **flat faces** does a **cube** have?',
                    options: ['6', '4', '8', '12'],
                    correct: '6',
                    hint: 'A cube is like a dice — count the square sides.',
                    solution: 'A cube has **6** square faces.',
                });
            },
        ],
        statistics: [
            function generateTallyMarksBuild() {
                const count = [7, 8, 12, 13][Math.floor(Math.random() * 4)];
                const groups = Math.floor(count / 5);
                const remainder = count % 5;
                let tally = '';
                for (let i = 0; i < groups; i++) tally += '|||| ';
                for (let i = 0; i < remainder; i++) tally += '|';
                return makeLegacyNumeric({
                    descriptor: 'AC9M3ST01',
                    context: 'tally-marks-build',
                    category: 'statistics',
                    title: 'READ TALLY MARKS',
                    prompt: `How many does this tally show? **${tally.trim()}**`,
                    answer: count,
                    hint: 'Each group of 5 is four vertical marks with one strike-through.',
                    solution: `The tally represents **${count}**.`,
                });
            },
            function generateFrequencyTableBuild() {
                const a = Math.floor(Math.random() * 4) + 3;
                const b = Math.floor(Math.random() * 4) + 2;
                const c = Math.floor(Math.random() * 3) + 1;
                const ans = a + b + c;
                return makeLegacyNumeric({
                    descriptor: 'AC9M3ST01',
                    context: 'frequency-table-build',
                    category: 'statistics',
                    title: 'FREQUENCY TOTAL',
                    display: `<table style="margin:0 auto;border-collapse:collapse;font-size:0.9rem;"><tr><th style="padding:4px 12px;border:1px solid var(--outline-variant);">Colour</th><th style="padding:4px 12px;border:1px solid var(--outline-variant);">Tally count</th></tr><tr><td style="padding:4px 12px;border:1px solid var(--outline-variant);">Red</td><td style="padding:4px 12px;border:1px solid var(--outline-variant);text-align:center;">${a}</td></tr><tr><td style="padding:4px 12px;border:1px solid var(--outline-variant);">Blue</td><td style="padding:4px 12px;border:1px solid var(--outline-variant);text-align:center;">${b}</td></tr><tr><td style="padding:4px 12px;border:1px solid var(--outline-variant);">Green</td><td style="padding:4px 12px;border:1px solid var(--outline-variant);text-align:center;">${c}</td></tr></table>`,
                    prompt: 'What is the **total** number of responses in the frequency table?',
                    answer: ans,
                    hint: 'Add all the frequency counts together.',
                    solution: `${a} + ${b} + ${c} = **${ans}** responses.`,
                });
            },
            function generateQuestionFormulation() {
                return makeLegacyChoice({
                    descriptor: 'AC9M3ST03',
                    context: 'question-formulation',
                    category: 'statistics',
                    title: 'SURVEY QUESTION',
                    prompt: 'Which is the **best statistical question** to ask your class?',
                    options: [
                        'What is your favourite fruit?',
                        'Who is the best athlete in the world?',
                        'Why is maths boring?',
                        'What number am I thinking of?',
                    ],
                    correct: 'What is your favourite fruit?',
                    hint: 'A statistical question expects **varied** answers you can collect and count.',
                    solution: '**What is your favourite fruit?** gives data you can tally and graph.',
                });
            },
            function generateDataOrganisation() {
                return makeLegacyChoice({
                    descriptor: 'AC9M3ST03',
                    context: 'data-organisation',
                    category: 'statistics',
                    title: 'ORGANISE DATA',
                    prompt: 'You collected favourite pets from 20 students. What is the **best first step** to organise the data?',
                    options: [
                        'Make a tally or frequency table',
                        'Guess the most popular pet',
                        'Draw a random picture',
                        'Throw away the slips',
                    ],
                    correct: 'Make a tally or frequency table',
                    hint: 'Organise raw answers before making a graph.',
                    solution: 'Start with a **tally or frequency table**, then graph the results.',
                });
            },
        ],
        probability: [
            function generateSpinnerTrialRecord() {
                const red = [6, 7, 8][Math.floor(Math.random() * 3)];
                const spins = 10;
                return makeLegacyChoice({
                    descriptor: 'AC9M3P02',
                    context: 'spinner-trial-record',
                    category: 'probability',
                    title: 'SPINNER TRIAL RECORD',
                    prompt: `A spinner is spun **${spins}** times. **Red** lands **${red}** times. What fraction of spins were red?`,
                    options: [`${red}/${spins}`, `${red - 1}/${spins}`, `${spins - red}/${spins}`, `${red}/${spins + 1}`],
                    correct: `${red}/${spins}`,
                    hint: `Fraction = red outcomes ÷ total spins = ${red} ÷ ${spins}.`,
                    solution: `${red} red out of ${spins} spins = **${red}/${spins}**.`,
                });
            },
            function generateSpinnerTrialCompare() {
                return makeLegacyChoice({
                    descriptor: 'AC9M3P02',
                    context: 'spinner-trial-compare',
                    category: 'probability',
                    title: 'COMPARE TRIALS',
                    prompt: 'Class A gets **7/10** red spins; Class B gets **3/10** red spins on the same spinner. Which class likely had **more red sections** on their spinner?',
                    options: ['Class A', 'Class B', 'Both the same', 'Cannot tell'],
                    correct: 'Class A',
                    hint: 'More red outcomes in the same number of spins suggests a spinner with more red.',
                    solution: '**Class A** had more red results — their spinner likely had more red.',
                });
            },
        ],
    };

    function pickCategoryQuestion(category) {
        const gaps = gapGenerators[category] || [];
        const legacy = generators[category];
        if (!legacy && gaps.length === 0) return null;
        const poolSize = gaps.length + (legacy ? 1 : 0);
        const pick = Math.floor(Math.random() * poolSize);
        if (pick < gaps.length) {
            return gaps[pick]();
        }
        return legacy();
    }

    // ----------------------------------------------------
    // 6. Interactive Sandbox Question Control Loop
    // ----------------------------------------------------
    function loadQuestion() {
        if (state.questionSession) {
            state.questionSession.dispose();
            state.questionSession = null;
        }

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

        const rawQuestion = pickCategoryQuestion(state.activeCategory);
        if (!rawQuestion) return;

        state.currentQuestion = rawQuestion;
        const band =
            (rawQuestion.widgets &&
                rawQuestion.widgets[0] &&
                rawQuestion.widgets[0].config &&
                rawQuestion.widgets[0].config.band) ||
            'B';
        state.questionSession = MCS.runQuestion(rawQuestion, {
            widgetMount: pracInteractivePanel,
            promptMount: pracTaskTitle,
            band: band,
        });
        const codeEl = document.getElementById('practice-code');
        if (codeEl && rawQuestion.descriptor) {
            codeEl.textContent = `[${rawQuestion.descriptor}]`;
        }

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
        state.questionSession.showHint(pracHintContent);
        pracHintContainer.style.display = 'block';
        btnPracHint.style.display = 'none';
    });

    btnPracSubmit.addEventListener('click', () => {
        if (!state.currentQuestion || !state.questionSession) return;

        const isCorrect = state.questionSession.evaluate();
        const lastEval = state.questionSession.getLastEval
            ? state.questionSession.getLastEval()
            : { incomplete: false };

        if (!isCorrect && lastEval.incomplete) {
            sounds.error();
            pracFeedbackText.className = 'active-feedback-text feedback-error';
            pracFeedbackText.textContent = 'Choose an answer from the list before submitting.';
            pracFeedbackText.style.display = 'block';
            return;
        }

        if (isCorrect) {
            sounds.success();
            Object.keys(state.questionSession.instances).forEach((id) => {
                const inst = state.questionSession.instances[id];
                if (inst && typeof inst.flagCorrect === 'function') inst.flagCorrect();
            });
            state.questionSession.setEnabled(false);
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
            gainPoints(ptsGained, true, state.activeCategory, state.currentQuestion.descriptor, state.currentQuestion.context);
        } else {
            sounds.error();
            Object.keys(state.questionSession.instances).forEach((id) => {
                const inst = state.questionSession.instances[id];
                if (inst && typeof inst.flagIncorrect === 'function') inst.flagIncorrect();
            });
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

                state.questionSession.setEnabled(false);
                state.questionSession.showSolution(pracSolutionContent);
                pracSolutionContainer.style.display = 'block';
                
                btnPracSubmit.style.display = 'none';
                btnPracNext.style.display = 'inline-block';
                btnPracHint.style.display = 'none';
                
                addLog(`System lock. Solutions database query complete.`, "error");
                gainPoints(0, false, state.activeCategory, state.currentQuestion.descriptor, state.currentQuestion.context);
            }
        }
    });

    btnPracNext.addEventListener('click', () => {
        sounds.click();
        loadQuestion();
    });

    // ----------------------------------------------------
    // Trophy Room Overlay Modal Logic
    // ----------------------------------------------------
    let trophyActiveYear = 3;
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
            badgeEl.style.cursor = 'pointer';
            badgeEl.addEventListener('click', () => {
                sounds.click();
                showBadgeProgressModal(profile, key, {
                    onViewCertificate: isUnlocked ? () => showCertificateModal(key) : null,
                });
            });
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

    // Initialize Page
    loadProfile();
    loadQuestion();
});
