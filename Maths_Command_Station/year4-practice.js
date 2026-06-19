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
        solvedPathwayVariants: [],
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
                    const code = normalizeDescriptorCode(DESCRIPTOR_BADGES[descKey].code);
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
                migrateDescriptorProfileKeys(profile);
            } catch (e) {
                console.error("Failed to parse stored profile", e);
            }
        }

        // Ensure new sub-fields exist
        if (!profile.scoresByDescriptor) profile.scoresByDescriptor = {};
        if (!profile.solvedContexts) profile.solvedContexts = {};
        if (!profile.consecutiveCorrect) profile.consecutiveCorrect = {};
        if (!profile.solvedPathwayVariants) profile.solvedPathwayVariants = [];

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
        activeInterval: null,
        sessionSeenQuestions: new Set(),
        usedPathwayVariants: [],
        pathwayScenarios: null,
        lastPathwayOutcome: null,
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

    // SVG Scaled Column Graph — migrated to MCS column-graph widget (Phase 2.5)

    function expandRotationalSymmetry(seedCells, size, order) {
        const seen = new Set();
        const out = [];
        seedCells.forEach(seed => {
            let cur = { r: seed.r, c: seed.c };
            for (let i = 0; i < order; i++) {
                const key = `${cur.r},${cur.c}`;
                if (
                    cur.r >= 1 && cur.r <= size &&
                    cur.c >= 1 && cur.c <= size &&
                    !seen.has(key)
                ) {
                    seen.add(key);
                    out.push({ r: cur.r, c: cur.c });
                }
                const center = (size + 1) / 2;
                const dr = cur.r - center;
                const dc = cur.c - center;
                cur = {
                    r: Math.round(center + dc),
                    c: Math.round(center - dr)
                };
            }
        });
        return out;
    }

    function symmetryCellsEqual(a, b) {
        if (!a || !b || a.length !== b.length) return false;
        const set = new Set(a.map(p => `${p.r},${p.c}`));
        return b.every(p => set.has(`${p.r},${p.c}`));
    }

    // ----------------------------------------------------
    // Legacy-keep recall helpers (Phase 3c — badge context coverage)
    // ----------------------------------------------------
    function formatDollarsCents(amount) {
        return Number(amount).toFixed(2);
    }

    function computeGridRoute(start, steps, cols, rows) {
        const path = [{ col: start.col, row: start.row }];
        let colIdx = cols.indexOf(start.col);
        let rowIdx = rows.indexOf(start.row);
        if (colIdx < 0 || rowIdx < 0) return path;

        steps.forEach((step) => {
            for (let i = 0; i < step.count; i += 1) {
                if (step.dir === 'forward') rowIdx -= 1;
                else if (step.dir === 'right') colIdx += 1;
                else if (step.dir === 'backward') rowIdx += 1;
                else if (step.dir === 'left') colIdx -= 1;

                if (colIdx >= 0 && colIdx < cols.length && rowIdx >= 0 && rowIdx < rows.length) {
                    path.push({ col: cols[colIdx], row: rows[rowIdx] });
                }
            }
        });
        return path;
    }

    const PATHWAY_DIR_LABELS = {
        forward: 'Forward',
        right: 'Right',
        backward: 'Backward',
        left: 'Left',
    };

    function buildPathwayVariantKey(start, steps) {
        return `${start.col}${start.row}|${steps.map((s) => `${s.dir}:${s.count}`).join(',')}`;
    }

    function formatPathwayPrompt(start, steps) {
        const stepText = steps
            .map((s) => `**${PATHWAY_DIR_LABELS[s.dir]} ${s.count}**`)
            .join(', ');
        return `Start at **${start.col}${start.row}**. Follow: ${stepText}. Where do you finish if the grid moves only along lines?`;
    }

    function describePathwaySolution(start, steps, path) {
        let cursor = 0;
        const phrases = [];
        steps.forEach((step, stepNum) => {
            cursor += step.count;
            const cell = path[cursor];
            if (!cell) return;
            const label = PATHWAY_DIR_LABELS[step.dir];
            if (stepNum === 0) {
                phrases.push(
                    `${label} ${step.count} from ${start.col}${start.row} reaches **${cell.col}${cell.row}**`
                );
            } else {
                phrases.push(`${label.toLowerCase()} ${step.count} reaches **${cell.col}${cell.row}**`);
            }
        });
        return `${phrases.join(', ')}.`;
    }

    function isValidPathwayRoute(start, steps, cols, rows) {
        const path = computeGridRoute(start, steps, cols, rows);
        const expectedLen = 1 + steps.reduce((sum, step) => sum + step.count, 0);
        if (path.length !== expectedLen) return null;
        const end = path[path.length - 1];
        if (end.col === start.col && end.row === start.row) return null;
        return path;
    }

    function buildPathwayScenarios() {
        const cols = ['A', 'B', 'C', 'D', 'E'];
        const rows = [5, 4, 3, 2, 1];
        const starts = [
            { col: 'A', row: 1 }, { col: 'A', row: 2 }, { col: 'A', row: 3 },
            { col: 'B', row: 1 }, { col: 'B', row: 2 }, { col: 'B', row: 3 },
            { col: 'C', row: 1 }, { col: 'C', row: 2 }, { col: 'C', row: 3 },
            { col: 'D', row: 1 }, { col: 'D', row: 2 },
            { col: 'E', row: 1 }, { col: 'E', row: 2 },
        ];
        const stepTemplates = [
            [{ dir: 'forward', count: 2 }, { dir: 'right', count: 1 }],
            [{ dir: 'right', count: 2 }, { dir: 'forward', count: 1 }],
            [{ dir: 'forward', count: 1 }, { dir: 'right', count: 2 }],
            [{ dir: 'left', count: 1 }, { dir: 'forward', count: 2 }],
            [{ dir: 'forward', count: 1 }, { dir: 'left', count: 1 }],
            [{ dir: 'backward', count: 1 }, { dir: 'right', count: 2 }],
            [{ dir: 'forward', count: 2 }, { dir: 'right', count: 1 }, { dir: 'forward', count: 1 }],
            [{ dir: 'right', count: 1 }, { dir: 'forward', count: 2 }, { dir: 'right', count: 1 }],
            [{ dir: 'forward', count: 1 }, { dir: 'right', count: 1 }, { dir: 'forward', count: 2 }],
            [{ dir: 'backward', count: 1 }, { dir: 'right', count: 2 }, { dir: 'forward', count: 1 }],
            [{ dir: 'left', count: 2 }, { dir: 'forward', count: 2 }],
            [{ dir: 'forward', count: 3 }, { dir: 'right', count: 1 }],
            [{ dir: 'right', count: 2 }, { dir: 'backward', count: 1 }, { dir: 'forward', count: 1 }],
            [
                { dir: 'forward', count: 1 },
                { dir: 'right', count: 1 },
                { dir: 'forward', count: 2 },
                { dir: 'right', count: 1 },
            ],
            [
                { dir: 'forward', count: 3 },
                { dir: 'right', count: 1 },
                { dir: 'backward', count: 1 },
            ],
            [
                { dir: 'right', count: 2 },
                { dir: 'forward', count: 1 },
                { dir: 'left', count: 1 },
                { dir: 'forward', count: 1 },
            ],
            [
                { dir: 'left', count: 2 },
                { dir: 'forward', count: 2 },
                { dir: 'right', count: 1 },
            ],
            [
                { dir: 'forward', count: 2 },
                { dir: 'left', count: 1 },
                { dir: 'forward', count: 1 },
                { dir: 'right', count: 2 },
            ],
            [
                { dir: 'forward', count: 1 },
                { dir: 'right', count: 2 },
                { dir: 'backward', count: 1 },
                { dir: 'right', count: 1 },
            ],
        ];
        const dirs = ['forward', 'right', 'backward', 'left'];
        const scenarios = [];
        const seen = new Set();

        function addScenario(start, steps) {
            const path = isValidPathwayRoute(start, steps, cols, rows);
            if (!path) return;
            const key = buildPathwayVariantKey(start, steps);
            if (seen.has(key)) return;
            seen.add(key);
            scenarios.push({ start, steps, path, key });
        }

        starts.forEach((start) => {
            stepTemplates.forEach((steps) => addScenario(start, steps));
        });

        for (let attempt = 0; attempt < 80 && scenarios.length < 48; attempt += 1) {
            const start = starts[Math.floor(Math.random() * starts.length)];
            const instructionCount = 2 + Math.floor(Math.random() * 3);
            const steps = [];
            for (let i = 0; i < instructionCount; i += 1) {
                steps.push({
                    dir: dirs[Math.floor(Math.random() * dirs.length)],
                    count: 1 + Math.floor(Math.random() * 3),
                });
            }
            addScenario(start, steps);
        }

        return scenarios;
    }

    function pickPathwayScenario() {
        if (!state.pathwayScenarios) {
            state.pathwayScenarios = buildPathwayScenarios();
        }
        const solved = profile.solvedPathwayVariants || [];
        let pool = state.pathwayScenarios.filter(
            (scenario) =>
                !state.usedPathwayVariants.includes(scenario.key)
                && !solved.includes(scenario.key)
        );
        if (pool.length === 0) {
            pool = state.pathwayScenarios.filter(
                (scenario) => !state.usedPathwayVariants.includes(scenario.key)
            );
        }
        if (pool.length === 0) {
            state.usedPathwayVariants = [];
            pool = state.pathwayScenarios.slice();
        }
        return pool[Math.floor(Math.random() * pool.length)];
    }

    function buildPathwayDistractors(end, correct, path, cols, rows) {
        const allCells = [];
        cols.forEach((col) => {
            rows.forEach((row) => {
                allCells.push(`Cell ${col}${row}`);
            });
        });
        const wrong = allCells.filter((label) => label !== correct);
        const pathCells = new Set(path.map((point) => `Cell ${point.col}${point.row}`));
        const nearMiss = wrong.filter((label) => pathCells.has(label));
        const pool = shuffleArray([...new Set([...nearMiss, ...wrong])]);
        return shuffleArray([correct, ...pool.slice(0, 3)]);
    }

    function markPathwayVariantUsed(question, wasCorrect) {
        if (!question || question.context !== 'pathway-algorithm' || !question.pathwayVariantKey) return;
        if (!state.usedPathwayVariants.includes(question.pathwayVariantKey)) {
            state.usedPathwayVariants.push(question.pathwayVariantKey);
        }
        if (wasCorrect) {
            if (!profile.solvedPathwayVariants) profile.solvedPathwayVariants = [];
            if (!profile.solvedPathwayVariants.includes(question.pathwayVariantKey)) {
                profile.solvedPathwayVariants.push(question.pathwayVariantKey);
                saveProfile();
            }
        }
    }

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

    function buildAreaGridDisplay(w, h) {
        const cell = '<span style="display:block;width:1.35rem;height:1.35rem;background:var(--mcs-accent-soft);border:1px solid var(--outline);border-radius:2px;" aria-hidden="true"></span>';
        const cells = cell.repeat(w * h);
        return `<div role="img" aria-label="Grid shape ${w} squares wide by ${h} squares tall" style="display:inline-grid;grid-template-columns:repeat(${w},1.35rem);gap:4px;padding:10px;border:1px solid var(--outline-variant);border-radius:4px;">${cells}</div>`;
    }

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

                // legacy-keep: dropdown decimal ordering — comparison skill, not placement widget (Phase 3c policy)
                return {
                    descriptor: 'AC9M4N01',
                    context: 'decimal-ordering',
                    category: 'number',
                    title: 'DECIMAL ORDERING',
                    prompt: 'Order the decimal numbers from smallest to largest:',
                    widgets: [{
                        id: 'form',
                        type: 'legacy-passthrough',
                        config: {
                            render(container) {
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
                                ['dec-ord-1', 'dec-ord-2', 'dec-ord-3', 'dec-ord-4'].forEach((id) => {
                                    const sel = container.querySelector(`#${id}`);
                                    sel.innerHTML = '<option value="">-</option>';
                                    shuffled.forEach((d) => {
                                        sel.innerHTML += `<option value="${d}">${d}</option>`;
                                    });
                                });
                            },
                        },
                    }],
                    inputs: [],
                    evaluate() {
                        const v1 = parseFloat(document.getElementById('dec-ord-1').value);
                        const v2 = parseFloat(document.getElementById('dec-ord-2').value);
                        const v3 = parseFloat(document.getElementById('dec-ord-3').value);
                        const v4 = parseFloat(document.getElementById('dec-ord-4').value);
                        if (isNaN(v1) || isNaN(v2) || isNaN(v3) || isNaN(v4)) return false;
                        return v1 === sorted[0] && v2 === sorted[1] && v3 === sorted[2] && v4 === sorted[3];
                    },
                    hint: {
                        text: `<p>Align place value columns (Ones, tenths, hundredths, thousandths). Pad numbers with zeroes to compare: e.g., <strong>${shuffled[0]} ➔ ${shuffled[0].toFixed(3)}</strong>.</p>`,
                        highlight: ['form'],
                    },
                    solution: {
                        text: `Sorted from smallest to largest: ${sorted.join(' < ')}.`,
                        show: {},
                    },
                    points: 10,
                };
            } else if (chosenType === 'place-value-shifter') {
                const baseVal = parseFloat((Math.floor(Math.random() * 5) + 2 + Math.floor(Math.random() * 9) * 0.1 + 5 * 0.01).toFixed(2)); // e.g. 4.35
                const shiftCol = Math.random() > 0.5 ? 'tenths' : 'hundredths';
                const diff = shiftCol === 'tenths' ? (Math.random() > 0.5 ? 0.4 : -0.3) : (Math.random() > 0.5 ? 0.05 : -0.04);
                const targetVal = parseFloat((baseVal + diff).toFixed(2));
                const operationStr = diff > 0 ? `Add ${Math.abs(diff)}` : `Subtract ${Math.abs(diff)}`;

                let currentVal = baseVal;

                // legacy-keep: place-value shifter device — interactive calculator already works (Phase 3c policy)
                return {
                    descriptor: 'AC9M4N01',
                    context: 'decimal-place-value',
                    category: 'number',
                    title: 'PLACE VALUE SHIFTER',
                    prompt: 'Use the shifter to find the operation that changes the display value:',
                    widgets: [{
                        id: 'shifter',
                        type: 'legacy-passthrough',
                        config: {
                            render(container) {
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
                                const readout = container.querySelector('#prac-calc-readout');
                                container.querySelectorAll('.calc-btn.op-btn').forEach((btn) => {
                                    btn.addEventListener('click', () => {
                                        sounds.click();
                                        const val = parseFloat(btn.dataset.val);
                                        currentVal = parseFloat((currentVal + val).toFixed(2));
                                        readout.textContent = currentVal.toFixed(2);
                                        if (currentVal === targetVal) {
                                            container.querySelector('#prac-calc-sel').value = String(diff);
                                            sounds.success();
                                        }
                                    });
                                });
                                container.querySelector('#prac-calc-reset').addEventListener('click', () => {
                                    sounds.click();
                                    currentVal = baseVal;
                                    readout.textContent = baseVal.toFixed(2);
                                    container.querySelector('#prac-calc-sel').value = '';
                                });
                            },
                        },
                    }],
                    inputs: [],
                    evaluate() {
                        const val = parseFloat(document.getElementById('prac-calc-sel').value);
                        return Math.abs(val - diff) < 0.001;
                    },
                    hint: {
                        text: `<p>To change ${baseVal} to ${targetVal}, notice which place value column changes. The **${shiftCol}** column changed by ${Math.abs(diff)}. Therefore, we must ${operationStr.toLowerCase()}.</p>`,
                        highlight: ['shifter'],
                    },
                    solution: {
                        text: `Operation: ${baseVal} + (${diff}) = ${targetVal}. So, we ${operationStr}.`,
                        show: {},
                    },
                    points: 10,
                };
            } else {
                const wholes = [1, 2];
                const whole = wholes[Math.floor(Math.random() * wholes.length)];
                const denoms = [2, 3, 4];
                const den = denoms[Math.floor(Math.random() * denoms.length)];
                const num = Math.floor(Math.random() * (den - 1)) + 1;
                const markedValue = whole + num / den;

                return {
                    descriptor: 'AC9M4N04',
                    context: 'mixed-numeral-lines',
                    category: 'number',
                    title: 'MIXED NUMERAL',
                    prompt: 'Determine the **mixed numeral** marked by the dot on the number line.',
                    widgets: [
                        {
                            id: 'line',
                            type: 'number-line',
                            config: {
                                mode: 'read-point',
                                band: 'C',
                                min: 0,
                                max: 3,
                                markedValue,
                                showFractionLabels: true,
                                fractionDenominator: den,
                                snapStep: 1 / den,
                                ticks: { major: 1, minor: 1 / den, labels: 'major' },
                            },
                        },
                    ],
                    inputs: [
                        {
                            id: 'whole',
                            type: 'number-input',
                            config: { label: 'Whole', placeholder: '?', width: '64px' },
                        },
                        {
                            id: 'num',
                            type: 'number-input',
                            config: { label: 'Numerator', placeholder: '?', width: '52px' },
                        },
                        {
                            id: 'den',
                            type: 'number-input',
                            config: { label: 'Denominator', placeholder: '?', width: '52px' },
                        },
                    ],
                    evaluate(values) {
                        return (
                            values.whole === whole &&
                            values.num === num &&
                            values.den === den
                        );
                    },
                    hint: {
                        text: `<p>First find the whole integer before the dot: **${whole}**. The interval is split into **${den}** parts (denominator). The dot is at the **${num}**<sup>th</sup> tick past the whole (numerator).</p>`,
                        highlight: ['line'],
                    },
                    solution: {
                        text: `The dot is at **${whole} ${num}/${den}**.`,
                        show: {
                            whole,
                            num,
                            den,
                            line: markedValue,
                        },
                    },
                    points: 10,
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

                // legacy-keep: inverse operations — plain number inputs faster than MathLive for fluency (Phase 3c policy)
                return {
                    descriptor: 'AC9M4A01',
                    context: pos === 1 ? 'inverse-equations-subtraction' : 'inverse-equations-addition',
                    category: 'algebra',
                    title: 'INVERSE EQUATIONS',
                    prompt: 'Find the unknown (?) in this numerical equation using inverse operations:',
                    widgets: [{
                        id: 'eq',
                        type: 'legacy-passthrough',
                        config: {
                            render(container) {
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
                        },
                    }],
                    inputs: [],
                    evaluate() {
                        const t1 = parseInt(document.getElementById('inv-t1').value, 10);
                        const t2 = parseInt(document.getElementById('inv-t2').value, 10);
                        const ansVal = parseInt(document.getElementById('inv-ans').value, 10);
                        if (isNaN(t1) || isNaN(t2) || isNaN(ansVal)) return false;
                        return t1 === firstTerm && t2 === a && ansVal === targetUnknown;
                    },
                    hint: {
                        text: `<p>To find <code>?</code>, apply the inverse operation: subtraction is the inverse of addition. Subtract the known part: <code>? = ${sum} − ${a}</code>.</p>`,
                        highlight: ['eq'],
                    },
                    solution: {
                        text: `Using inverse operations: ? = ${sum} − ${a}. Thus, ? = ${targetUnknown}.`,
                        show: {},
                    },
                    points: 10,
                };
            } else {
                // Recall facts timed
                const isDivision = Math.random() > 0.5;
                const a = Math.floor(Math.random() * 8) + 3; // 3-10
                const b = Math.floor(Math.random() * 9) + 2; // 2-10
                const product = a * b;
                const displayExpr = isDivision ? `${product} ÷ ${a}` : `${a} × ${b}`;
                const ans = isDivision ? b : product;
                const recallContext = isDivision ? 'recall-facts-division' : 'recall-facts-multiplication';

                // legacy-keep: timed fluency recall — widget overhead slows countdown flow (Phase 3c policy)
                let timeLeft = 100;

                return {
                    descriptor: 'AC9M4A02',
                    context: recallContext,
                    category: 'algebra',
                    title: 'FACT FLUENCY',
                    prompt: 'Demonstrate fact fluency (10s countdown):',
                    widgets: [{
                        id: 'timed',
                        type: 'legacy-passthrough',
                        config: {
                            render(container) {
                                container.innerHTML = `
                                    <div class="flex-col align-center gap-12">
                                        <div style="font-size:2.8rem; font-weight:700; color:var(--primary); font-family:var(--font-display);">${displayExpr}</div>
                                        <div class="engine-progress-bar" style="width:200px; height:6px;">
                                            <div class="engine-progress-fill" id="timed-progress-fill" style="width:100%;"></div>
                                        </div>
                                    </div>
                                `;
                            },
                        },
                    }],
                    inputs: [{
                        id: 'ans',
                        type: 'number-input',
                        config: {
                            label: '',
                            placeholder: '?',
                            width: '120px',
                            ariaLabel: isDivision ? 'Division answer' : 'Multiplication answer',
                        },
                    }],
                    evaluate(values) {
                        if (state.activeInterval) clearInterval(state.activeInterval);
                        return values.ans === ans;
                    },
                    hint: {
                        text: isDivision
                            ? `<p>Recall the division fact: ${product} divided by ${a}. Think: ${a} × ? = ${product}.</p>`
                            : `<p>Recall the multiplication fact: ${a} times ${b}. Skip count in ${a}s if needed.</p>`,
                        highlight: ['timed', 'ans'],
                    },
                    solution: {
                        text: `${displayExpr} is exactly ${ans}.`,
                        show: { ans },
                    },
                    points: 10,
                    wireSession(session, ui) {
                        if (state.activeInterval) clearInterval(state.activeInterval);
                        timeLeft = 100;
                        const fill = document.getElementById('timed-progress-fill');
                        state.activeInterval = setInterval(() => {
                            timeLeft -= 2;
                            if (fill) fill.style.width = `${timeLeft}%`;
                            if (timeLeft <= 0) {
                                clearInterval(state.activeInterval);
                                sounds.error();
                                addLog('Fluency time expired!', 'error');
                                if (ui.submitBtn) ui.submitBtn.click();
                            }
                        }, 200);
                        setTimeout(() => {
                            const inp = document.querySelector('.mcs-input-region[data-input-id="ans"] input');
                            if (inp) inp.focus();
                        }, 50);
                    },
                };
            }
        },
        measurement: () => {
            const subTypes = ['time-duration', 'schedule-planning', 'angle-evaluator'];
            const chosenType = subTypes[Math.floor(Math.random() * subTypes.length)];

            if (chosenType === 'time-duration') {
                const startHour = Math.floor(Math.random() * 4) + 8;
                const startMin = Math.random() > 0.5 ? 15 : 30;
                const durationHours = Math.floor(Math.random() * 2) + 1;
                const durationMins = Math.random() > 0.5 ? 15 : 30;
                const endMin = (startMin + durationMins) % 60;
                const hourCarry = Math.floor((startMin + durationMins) / 60);
                const endHour = startHour + durationHours + hourCarry;
                const totalMinutes = durationHours * 60 + durationMins;
                const pad = (n) => String(n).padStart(2, '0');

                return {
                    descriptor: 'AC9M4M03',
                    context: 'time-duration',
                    category: 'measurement',
                    title: 'ELAPSED TIME',
                    prompt: 'Determine the **duration** of time elapsed between the start and end clocks.',
                    widgets: [
                        {
                            id: 'clocks',
                            type: 'analog-clock',
                            config: {
                                mode: 'elapsed',
                                band: 'C',
                                start: { hours: startHour, minutes: startMin },
                                end: { hours: endHour, minutes: endMin },
                                showDigital: true,
                                gear: true,
                            },
                        },
                    ],
                    inputs: [
                        {
                            id: 'duration',
                            type: 'time-pair',
                            config: {
                                label: 'Duration:',
                                hourPlaceholder: 'hours',
                                minutePlaceholder: 'mins',
                                ariaLabel: 'Elapsed duration in hours and minutes',
                            },
                        },
                    ],
                    evaluate(values) {
                        const d = values.duration;
                        if (!d || d.hours == null || d.minutes == null) return false;
                        return d.hours * 60 + d.minutes === totalMinutes;
                    },
                    hint: {
                        text: `<p>Subtract the start time from the end time. From **${startHour}:${pad(startMin)}** to **${endHour}:${pad(endMin)}** is **${durationHours}** hour(s) and **${durationMins}** minutes.</p>`,
                        highlight: ['clocks', 'duration'],
                    },
                    solution: {
                        text: `Start: ${startHour}:${pad(startMin)}, End: ${endHour}:${pad(endMin)}. Elapsed duration: **${durationHours} hr ${durationMins} min** (${totalMinutes} minutes).`,
                        show: {
                            duration: { hours: durationHours, minutes: durationMins },
                            clocks: {},
                        },
                    },
                    points: 10,
                };
            }

            if (chosenType === 'schedule-planning') {
                // legacy-keep: schedule word problem — text timetable reasoning (Phase 3c policy)
                const events = [
                    { label: 'Sport', startH: 11, startM: 15, durH: 1, durM: 15 },
                    { label: 'Assembly', startH: 9, startM: 0, durH: 0, durM: 45 },
                    { label: 'Music', startH: 10, startM: 30, durH: 1, durM: 0 },
                ];
                const ev = events[Math.floor(Math.random() * events.length)];
                const endMin = (ev.startM + ev.durM) % 60;
                const endHour = ev.startH + ev.durH + Math.floor((ev.startM + ev.durM) / 60);
                const pad = (n) => String(n).padStart(2, '0');

                return {
                    descriptor: 'AC9M4M03',
                    context: 'schedule-planning',
                    category: 'measurement',
                    title: 'SCHEDULE PLANNING',
                    prompt: `**${ev.label}** starts at **${ev.startH}:${pad(ev.startM)} AM** and lasts **${ev.durH ? ev.durH + ' hour' + (ev.durH > 1 ? 's' : '') + ' ' : ''}${ev.durM ? ev.durM + ' minutes' : ''}**. What time does it **finish**?`,
                    widgets: [],
                    inputs: [
                        {
                            id: 'finish',
                            type: 'time-pair',
                            config: {
                                label: 'Finish time:',
                                ariaLabel: 'Finish time hours and minutes',
                            },
                        },
                    ],
                    evaluate(values) {
                        const f = values.finish;
                        if (!f || f.hours == null || f.minutes == null) return false;
                        return f.hours === endHour && f.minutes === endMin;
                    },
                    hint: {
                        text: `<p>Add the duration to the start time. Count forward from **${ev.startH}:${pad(ev.startM)}** by **${ev.durH ? ev.durH + ' hr ' : ''}${ev.durM ? ev.durM + ' min' : ''}**.</p>`,
                        highlight: ['finish'],
                    },
                    solution: {
                        text: `${ev.label} finishes at **${endHour}:${pad(endMin)} AM**.`,
                        show: { finish: { hours: endHour, minutes: endMin } },
                    },
                    points: 10,
                };
            }

            {
                const angles = [
                    { deg: 45, name: 'acute' },
                    { deg: 90, name: 'right' },
                    { deg: 135, name: 'obtuse' },
                    { deg: 180, name: 'straight' },
                    { deg: 270, name: 'reflex' }
                ];
                const measureAngles = [30, 45, 60, 75, 90, 105, 120, 135, 150];
                const isMeasure = Math.random() > 0.5;

                if (isMeasure) {
                    const angleDeg = measureAngles[Math.floor(Math.random() * measureAngles.length)];

                    return {
                        descriptor: 'AC9M4M04',
                        context: 'protractor-reading',
                        category: 'measurement',
                        title: 'PROTRACTOR READING',
                        prompt: 'Position the protractor over the angle, then enter the **degree measure** shown by the orange arm.',
                        widgets: [
                            {
                                id: 'pro',
                                type: 'protractor',
                                config: {
                                    mode: 'measure',
                                    band: 'C',
                                    angleDeg,
                                    snapStep: 5,
                                },
                            },
                        ],
                        inputs: [
                            {
                                id: 'reading',
                                type: 'number-input',
                                config: { label: 'Angle (°):', placeholder: '?' },
                            },
                        ],
                        evaluate(values) {
                            return values.reading === angleDeg;
                        },
                        hint: {
                            text: `<p>Align the protractor centre with the angle vertex and the baseline with the horizontal arm. Read where the **orange arm** crosses the scale.</p><p>This angle measures **${angleDeg}°**.</p>`,
                            highlight: ['pro'],
                        },
                        solution: {
                            text: `The orange arm opens to **${angleDeg}°** on the protractor scale.`,
                            show: {
                                reading: angleDeg,
                                pro: { placement: { rotation: 0 } },
                            },
                        },
                        points: 10,
                    };
                }

                const selected = angles[Math.floor(Math.random() * angles.length)];

                return {
                    descriptor: 'AC9M4M04',
                    context: 'angle-classification',
                    category: 'measurement',
                    title: 'ANGLE CLASSIFICATION',
                    prompt: 'Classify the angle size relative to **90°** using the buttons below the diagram.',
                    widgets: [
                        {
                            id: 'pro',
                            type: 'protractor',
                            config: {
                                mode: 'classify',
                                band: 'C',
                                angleDeg: selected.deg,
                            },
                        },
                    ],
                    inputs: [],
                    evaluate(values) {
                        return values.pro && values.pro.classification === selected.name;
                    },
                    hint: {
                        text: `<p>An **acute** angle is less than 90°. A **right** angle is exactly 90°. An **obtuse** angle is between 90° and 180°. A **straight** angle is exactly 180°. A **reflex** angle is greater than 180°.</p>`,
                        highlight: ['pro'],
                    },
                    solution: {
                        text: `The rendered angle is **${selected.deg}°**, which is classified as an **${selected.name}** angle.`,
                        show: { pro: { classification: selected.name } },
                    },
                    points: 10,
                };
            }
        },
        space: () => {
            const subTypes = ['alphanumeric-routing', 'symmetry-paint'];
            const chosenType = subTypes[Math.floor(Math.random() * subTypes.length)];

            if (chosenType === 'alphanumeric-routing') {
                const landmarks = [
                    { col: 'C', row: 3, icon: '🏫', name: 'School' },
                    { col: 'E', row: 2, icon: '🌳', name: 'Park' },
                    { col: 'B', row: 4, icon: '📚', name: 'Library' },
                ];
                const landmark = Math.random() > 0.5 ? landmarks[0] : landmarks[1];
                const context = Math.random() > 0.5 ? 'alphanumeric-routing' : 'grid-reference';

                return {
                    descriptor: 'AC9M4SP02',
                    context,
                    category: 'space',
                    title: 'GRID REFERENCE',
                    prompt: `Tap the grid cell where the **${landmark.name} ${landmark.icon}** is located.`,
                    widgets: [
                        {
                            id: 'map',
                            type: 'coordinate-plotter',
                            config: {
                                mode: 'alpha-grid',
                                band: 'C',
                                landmarks,
                            },
                        },
                    ],
                    inputs: [],
                    evaluate(values) {
                        const g = values.map;
                        return g && g.col === landmark.col && g.row === landmark.row;
                    },
                    hint: {
                        text: `<p>Find **${landmark.icon}** on the map. Read the column letter first (**${landmark.col}**), then the row number (**${landmark.row}**).</p>`,
                        highlight: ['map'],
                    },
                    solution: {
                        text: `The ${landmark.name} ${landmark.icon} is at **${landmark.col}${landmark.row}**.`,
                        show: { map: { col: landmark.col, row: landmark.row, cell: `${landmark.col}${landmark.row}` } },
                    },
                    points: 10,
                };
            } else {
                const isRotational = Math.random() > 0.5;
                const context = isRotational ? 'symmetry-rotational' : 'symmetry-paint-mirror';

                const mirrorPatterns = [
                    [{ r: 2, c: 2 }, { r: 4, c: 3 }],
                    [{ r: 1, c: 3 }, { r: 5, c: 1 }],
                    [{ r: 3, c: 1 }, { r: 4, c: 2 }]
                ];
                const rotationalPatterns = [
                    [{ r: 2, c: 2 }, { r: 3, c: 1 }],
                    [{ r: 1, c: 2 }, { r: 2, c: 3 }],
                    [{ r: 2, c: 1 }, { r: 4, c: 2 }]
                ];

                const prefilled = (isRotational ? rotationalPatterns : mirrorPatterns)[
                    Math.floor(Math.random() * (isRotational ? rotationalPatterns : mirrorPatterns).length)
                ];

                const gridSize = 6;
                const expected = isRotational
                    ? expandRotationalSymmetry(prefilled, gridSize, 4)
                    : prefilled.map(pos => ({ r: pos.r, c: gridSize + 1 - pos.c }));
                const paintableExpected = expected.filter(
                    exp => !prefilled.some(pre => pre.r === exp.r && pre.c === exp.c)
                );

                return {
                    descriptor: 'AC9M4SP03',
                    context,
                    category: 'space',
                    title: isRotational ? 'ROTATIONAL SYMMETRY' : 'MIRROR SYMMETRY',
                    prompt: isRotational
                        ? 'Complete the **rotational symmetry** pattern. Tap cells to paint the missing parts so the design looks the same after a quarter turn.'
                        : 'Complete the symmetrical pattern across the **vertical red line**. Tap cells on the open side to mirror the coloured blocks.',
                    widgets: [
                        {
                            id: 'grid',
                            type: 'symmetry-painter',
                            config: {
                                mode: isRotational ? 'rotational' : 'complete-mirror',
                                band: 'C',
                                gridSize,
                                mirrorAxis: 'vertical',
                                rotationalOrder: 4,
                                prefilled,
                                solution: paintableExpected,
                            },
                        },
                    ],
                    inputs: [],
                    evaluate(values) {
                        const cells = values.grid && values.grid.cells;
                        return symmetryCellsEqual(cells, paintableExpected);
                    },
                    hint: {
                        text: isRotational
                            ? `<p>Imagine rotating the board a quarter turn about the centre dot. Each coloured block should have matching blocks in the other three positions.</p>`
                            : `<p>For each coloured block on the left, find the cell directly opposite it on the right at the same row. Column 2 mirrors to column 5, column 3 to column 4.</p>`,
                        highlight: ['grid'],
                    },
                    solution: {
                        text: isRotational
                            ? `Rotational images: ${paintableExpected.map(p => `Row ${p.r}, Col ${p.c}`).join(' · ')}.`
                            : `Reflected blocks: ${paintableExpected.map(p => `Row ${p.r}, Col ${p.c}`).join(' · ')}.`,
                        show: { grid: { cells: paintableExpected } },
                    },
                    points: 10,
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

            const likelihoodContext = Math.random() > 0.5 ? 'likelihood-scale-eval' : 'likelihood-scale-order';

            // legacy-keep: select-per-event likelihood — acceptable Band C UX (Phase 3c policy)
            return {
                descriptor: 'AC9M4P01',
                context: likelihoodContext,
                category: 'probability',
                title: 'LIKELIHOOD SPECTRUM',
                prompt: 'Assess the likelihood of each everyday event and order them on the spectrum:',
                widgets: [{
                    id: 'form',
                    type: 'legacy-passthrough',
                    config: {
                        render(container) {
                            container.innerHTML = `
                                <div class="flex-col gap-12" style="width:100%; max-width:480px; margin:0 auto;">
                                    <p style="font-size:0.85rem; color:var(--on-surface-variant); text-align:center;">Classify each event by choosing its position on the probability spectrum:</p>
                                    <div class="flex-col gap-8" style="margin-top:6px; display:flex; flex-direction:column; gap:8px;">
                                        ${shuffledPool.map((item, idx) => `
                                            <div class="flex-col gap-4" style="border: 1px solid var(--outline-variant); padding: 8px 12px; border-radius: 6px; background: var(--surface-container-low);">
                                                <div style="font-size:0.85rem; font-weight:600;">Event ${idx + 1}: "${item.desc}"</div>
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
                    },
                }],
                inputs: [],
                evaluate() {
                    let correct = true;
                    shuffledPool.forEach((item, idx) => {
                        const val = document.getElementById(`prob-scale-sel-${idx}`).value;
                        if (val !== item.scale) correct = false;
                    });
                    return correct;
                },
                hint: {
                    text: `<p>Analyse the likelihood description for each event:
                           <ul>
                               <li>**Impossible**: Cannot happen (0% chance).</li>
                               <li>**Unlikely**: Low chance but possible.</li>
                               <li>**Equal Chance**: Exactly 50/50.</li>
                               <li>**Likely**: High chance but not guaranteed.</li>
                               <li>**Certain**: Absolutely guaranteed (100% chance).</li>
                           </ul></p>`,
                    highlight: ['form'],
                },
                solution: {
                    text: `Correct assessment values: ${shuffledPool.map(e => `"${e.desc}" ➔ ${e.scale.toUpperCase()}`).join(', ')}.`,
                    show: {},
                },
                points: 10,
            };
        }
    };

    // P1 + P2 gap generators — badge context coverage (Phase 3c)
    const gapGenerators = {
        number: [
            // legacy-keep: odd/even classification — MCQ recall (Phase 3c policy)
            function generateOddEven() {
                const nums = [
                    { n: 24, parity: 'Even' },
                    { n: 37, parity: 'Odd' },
                    { n: 50, parity: 'Even' },
                    { n: 63, parity: 'Odd' },
                ];
                const q = nums[Math.floor(Math.random() * nums.length)];
                return makeLegacyChoice({
                    descriptor: 'AC9M4N02',
                    context: 'odd-even-classification',
                    category: 'number',
                    title: 'ODD OR EVEN?',
                    prompt: `Is **${q.n}** an **odd** or **even** number?`,
                    options: ['Odd', 'Even'],
                    correct: q.parity,
                    hint: 'Even numbers end in 0, 2, 4, 6, or 8. Odd numbers end in 1, 3, 5, 7, or 9.',
                    solution: `${q.n} is ${q.parity.toLowerCase()} because it ${q.parity === 'Even' ? 'is divisible by 2' : 'is not divisible by 2'}.`,
                });
            },
            // legacy-keep: divisibility puzzle — numeric recall (Phase 3c policy)
            function generateDivisibilityPuzzle() {
                const puzzles = [
                    { n: 36, divisor: 3, ans: 0, hint: 'Add the digits: 3 + 6 = 9. If the digit sum is divisible by 3, the number is too.' },
                    { n: 45, divisor: 5, ans: 0, hint: 'Numbers divisible by 5 end in 0 or 5.' },
                    { n: 28, divisor: 4, ans: 0, hint: '28 ÷ 4 = 7 with no remainder.' },
                    { n: 17, divisor: 3, ans: 2, hint: '1 + 7 = 8. 8 is not divisible by 3, so 17 leaves a remainder.' },
                ];
                const q = puzzles[Math.floor(Math.random() * puzzles.length)];
                return makeLegacyNumeric({
                    descriptor: 'AC9M4N02',
                    context: 'divisibility-puzzle',
                    category: 'number',
                    title: 'DIVISIBILITY PUZZLE',
                    prompt: `What is the **remainder** when **${q.n}** is divided by **${q.divisor}**?`,
                    answer: q.ans,
                    hint: q.hint,
                    solution: `${q.n} ÷ ${q.divisor} leaves remainder **${q.ans}**.`,
                });
            },
            // legacy-keep: equivalent fractions — MCQ recall (Phase 3c policy)
            (function equivalentFractionsGenerator() {
                let lastPrompt = null;

                const variants = [
                    // Find a scaled equivalent
                    () => ({
                        prompt: 'Which fraction is **equivalent to 1/2**?',
                        options: ['2/4', '1/3', '3/5', '2/3'],
                        correct: '2/4',
                        hint: 'Multiply or divide numerator and denominator by the same number.',
                        solution: '2/4 = 1/2 because both numerator and denominator were doubled.',
                    }),
                    () => ({
                        prompt: 'Which fraction is **equivalent to 1/4**?',
                        options: ['2/8', '1/5', '3/4', '2/5'],
                        correct: '2/8',
                        hint: 'Multiply or divide numerator and denominator by the same number.',
                        solution: '2/8 = 1/4 because both numerator and denominator were doubled.',
                    }),
                    () => ({
                        prompt: 'Which fraction is **equivalent to 3/4**?',
                        options: ['6/8', '3/5', '2/3', '4/6'],
                        correct: '6/8',
                        hint: 'Multiply or divide numerator and denominator by the same number.',
                        solution: '6/8 = 3/4 because both numerator and denominator were doubled.',
                    }),
                    () => ({
                        prompt: 'Which fraction is **equivalent to 1/3**?',
                        options: ['2/6', '1/4', '2/5', '3/8'],
                        correct: '2/6',
                        hint: 'Multiply or divide numerator and denominator by the same number.',
                        solution: '2/6 = 1/3 because both numerator and denominator were doubled.',
                    }),
                    () => ({
                        prompt: 'Which fraction is **equivalent to 2/5**?',
                        options: ['4/10', '2/10', '3/10', '5/10'],
                        correct: '4/10',
                        hint: 'Think in tenths — what denominator makes comparison easier?',
                        solution: '4/10 = 2/5 because both numerator and denominator were doubled.',
                    }),
                    () => ({
                        prompt: 'Which fraction is **equivalent to 1/5**?',
                        options: ['2/10', '3/10', '1/10', '4/10'],
                        correct: '2/10',
                        hint: 'Convert to tenths: multiply top and bottom by 2.',
                        solution: '2/10 = 1/5 because both numerator and denominator were doubled.',
                    }),
                    // Simplify / another name
                    () => ({
                        prompt: 'Which fraction is **another name for 4/8**?',
                        options: ['1/2', '1/4', '2/3', '3/4'],
                        correct: '1/2',
                        hint: 'Divide numerator and denominator by the same number.',
                        solution: '4/8 simplifies to 1/2 — divide top and bottom by 4.',
                    }),
                    () => ({
                        prompt: 'Which fraction is **another name for 6/8**?',
                        options: ['3/4', '1/2', '2/3', '4/6'],
                        correct: '3/4',
                        hint: 'Divide numerator and denominator by the same number.',
                        solution: '6/8 simplifies to 3/4 — divide top and bottom by 2.',
                    }),
                    () => ({
                        prompt: 'Which fraction is **another name for 6/10**?',
                        options: ['3/5', '2/5', '1/2', '4/5'],
                        correct: '3/5',
                        hint: 'Divide numerator and denominator by the same number.',
                        solution: '6/10 simplifies to 3/5 — divide top and bottom by 2.',
                    }),
                    // NOT equivalent
                    () => ({
                        prompt: 'Which fraction is **NOT equivalent to 1/2**?',
                        options: ['2/4', '3/6', '5/10', '2/5'],
                        correct: '2/5',
                        hint: 'Check each option — two of them are just 1/2 written differently.',
                        solution: '2/5 is not equal to 1/2. The others all simplify to one half.',
                    }),
                    () => ({
                        prompt: 'Which fraction is **NOT equivalent to 1/4**?',
                        options: ['2/8', '3/12', '2/5', '4/16'],
                        correct: '2/5',
                        hint: 'Check each option — three of them are just 1/4 written differently.',
                        solution: '2/5 is not equal to 1/4. The others all simplify to one quarter.',
                    }),
                    // Tenths equivalence
                    () => ({
                        prompt: '**2/5** is the same as how many **tenths**?',
                        options: ['4/10', '2/10', '5/10', '6/10'],
                        correct: '4/10',
                        hint: 'Multiply numerator and denominator by 2 to make tenths.',
                        solution: '2/5 = 4/10 — multiply top and bottom by 2.',
                    }),
                    () => ({
                        prompt: '**3/5** is the same as how many **tenths**?',
                        options: ['6/10', '3/10', '5/10', '8/10'],
                        correct: '6/10',
                        hint: 'Multiply numerator and denominator by 2 to make tenths.',
                        solution: '3/5 = 6/10 — multiply top and bottom by 2.',
                    }),
                    () => ({
                        prompt: '**1/2** is the same as how many **tenths**?',
                        options: ['5/10', '2/10', '1/10', '4/10'],
                        correct: '5/10',
                        hint: 'Multiply numerator and denominator by 5 to make tenths.',
                        solution: '1/2 = 5/10 — multiply top and bottom by 5.',
                    }),
                    // Conceptual
                    () => ({
                        prompt: 'How many **quarters** make up **one half**?',
                        options: ['2', '1', '3', '4'],
                        correct: '2',
                        hint: 'Draw a half and see how many quarter-pieces fit inside.',
                        solution: 'Two quarters (2/4) make one half (1/2).',
                    }),
                ];

                return function generateEquivalentFractions() {
                    let q = null;
                    let attempts = 0;
                    const maxAttempts = Math.max(variants.length * 4, 8);

                    do {
                        q = variants[Math.floor(Math.random() * variants.length)]();
                        attempts += 1;
                    } while (
                        variants.length > 1
                        && q.prompt === lastPrompt
                        && attempts < maxAttempts
                    );

                    lastPrompt = q.prompt;
                    return makeLegacyChoice({
                        descriptor: 'AC9M4N03',
                        context: 'equivalent-fractions',
                        category: 'number',
                        title: 'EQUIVALENT FRACTIONS',
                        prompt: q.prompt,
                        options: q.options,
                        correct: q.correct,
                        hint: q.hint,
                        solution: q.solution,
                    });
                };
            })(),
            // legacy-keep: equivalent decimals — MCQ recall (Phase 3c policy)
            function generateEquivalentDecimals() {
                const sets = [
                    { frac: '1/4', correct: '0.25', options: ['0.25', '0.4', '0.5', '0.75'] },
                    { frac: '1/2', correct: '0.5', options: ['0.5', '0.2', '0.25', '0.75'] },
                    { frac: '3/4', correct: '0.75', options: ['0.75', '0.34', '0.5', '0.25'] },
                ];
                const q = sets[Math.floor(Math.random() * sets.length)];
                return makeLegacyChoice({
                    descriptor: 'AC9M4N03',
                    context: 'equivalent-decimals',
                    category: 'number',
                    title: 'FRACTION ↔ DECIMAL',
                    prompt: `Which decimal is **equal to ${q.frac}**?`,
                    options: q.options,
                    correct: q.correct,
                    hint: `Divide the numerator by the denominator: ${q.frac.split('/')[0]} ÷ ${q.frac.split('/')[1]}.`,
                    solution: `${q.frac} = ${q.correct}.`,
                });
            },
            // legacy-keep: multiply by 10/100 — place-value shift (Phase 3c policy)
            function generateMultiplyBy10() {
                const factor = Math.random() > 0.5 ? 10 : 100;
                const n = Math.floor(Math.random() * 90) + 10;
                const ans = n * factor;
                return makeLegacyNumeric({
                    descriptor: 'AC9M4N05',
                    context: 'multiply-by-10',
                    category: 'number',
                    title: 'POWER SHIFTER (×)',
                    prompt: `Calculate **${n} × ${factor}**.`,
                    answer: ans,
                    hint: `Multiplying by ${factor} shifts digits ${factor === 10 ? 'one' : 'two'} place(s) to the left.`,
                    solution: `${n} × ${factor} = ${ans}.`,
                });
            },
            // legacy-keep: divide by 10/100 — place-value shift (Phase 3c policy)
            function generateDivideBy10() {
                const factor = Math.random() > 0.5 ? 10 : 100;
                const ans = Math.floor(Math.random() * 90) + 10;
                const n = ans * factor;
                return makeLegacyNumeric({
                    descriptor: 'AC9M4N05',
                    context: 'divide-by-10',
                    category: 'number',
                    title: 'POWER SHIFTER (÷)',
                    prompt: `Calculate **${n} ÷ ${factor}**.`,
                    answer: ans,
                    hint: `Dividing by ${factor} shifts digits ${factor === 10 ? 'one' : 'two'} place(s) to the right.`,
                    solution: `${n} ÷ ${factor} = ${ans}.`,
                });
            },
            // legacy-keep: grid multiplication — partition grid widget (Phase 3c policy)
            function generateGridMultiplication() {
                let a = Math.floor(Math.random() * 89) + 11;
                while (a % 10 === 0) a++; // Ensure not ending in 0
                const b = Math.floor(Math.random() * 8) + 2;
                const ans = a * b;

                const parts = [];
                const tens = Math.floor(a / 10) * 10;
                const ones = a % 10;
                if (tens > 0) parts.push(tens);
                if (ones > 0) parts.push(ones);
                const expectedPartials = parts.map((p) => p * b);

                return {
                    descriptor: 'AC9M4N06',
                    context: 'grid-multiplication',
                    category: 'number',
                    title: 'GRID MULTIPLICATION',
                    prompt: `Use the grid method: **${a} × ${b}** = ?`,
                    widgets: [
                        {
                            id: 'grid',
                            type: 'multiplication-grid',
                            config: {
                                multiplicand: a,
                                multiplier: b,
                                parts,
                            },
                        },
                    ],
                    inputs: [],
                    evaluate(values) {
                        const g = values.grid;
                        if (!g || g.total == null || g.partials.some((p) => p == null)) return false;
                        const partialsOk = g.partials.every((p, i) => p === expectedPartials[i]);
                        return partialsOk && g.total === ans;
                    },
                    hint: {
                        text: `<p>Split **${a}** into **${parts.join('** + **')}**. Multiply each part by **${b}**, write the results in the grid, then add them for the total.</p>`,
                        highlight: ['grid'],
                    },
                    solution: {
                        text: `${a} × ${b} = (${tens} × ${b}) + (${ones} × ${b}) = ${tens * b} + ${ones * b} = ${ans}.`,
                        show: { grid: { partials: expectedPartials, total: ans } },
                    },
                    points: 10,
                };
            },
            // legacy-keep: short division no remainder (Phase 3c policy)
            function generateDivisionStepNoRem() {
                const pairs = [
                    { display: '84 ÷ 4', ans: 21 },
                    { display: '96 ÷ 3', ans: 32 },
                    { display: '75 ÷ 5', ans: 15 },
                ];
                const q = pairs[Math.floor(Math.random() * pairs.length)];
                return makeLegacyNumeric({
                    descriptor: 'AC9M4N06',
                    context: 'division-step-no-rem',
                    category: 'number',
                    title: 'DIVISION STEPS',
                    prompt: `Divide with **no remainder**: **${q.display}**`,
                    answer: q.ans,
                    hint: 'Share equally step by step — each digit from left to right.',
                    solution: `${q.display} = ${q.ans}.`,
                });
            },
            // legacy-keep: rounding to nearest 10 (Phase 3c policy)
            function generateRoundingCheck() {
                const vals = [
                    { n: 47, ans: 50 },
                    { n: 52, ans: 50 },
                    { n: 74, ans: 70 },
                ];
                const q = vals[Math.floor(Math.random() * vals.length)];
                return makeLegacyNumeric({
                    descriptor: 'AC9M4N07',
                    context: 'rounding-check',
                    category: 'number',
                    title: 'ROUNDING CHECK',
                    prompt: `Round **${q.n}** to the **nearest 10**.`,
                    answer: q.ans,
                    hint: 'Look at the ones digit: 5 or more rounds up; 4 or less rounds down.',
                    solution: `${q.n} rounds to ${q.ans}.`,
                });
            },
            // legacy-keep: financial estimation — shopping scenario (Phase 3c policy)
            function generateFinancialEstimation() {
                const price = [4.95, 2.50, 6.80][Math.floor(Math.random() * 3)];
                const priceStr = formatDollarsCents(price);
                const qty = [2, 3, 4][Math.floor(Math.random() * 3)];
                const roundedPrice = Math.ceil(price);
                const ans = roundedPrice * qty;
                return makeLegacyNumeric({
                    descriptor: 'AC9M4N07',
                    context: 'financial-estimation',
                    category: 'number',
                    title: 'BUDGET ESTIMATE',
                    prompt: `Items cost about **$${priceStr}** each. Estimate the total for **${qty}** items by rounding each price to the nearest dollar.`,
                    answer: ans,
                    label: '$',
                    hint: `Round $${priceStr} to $${roundedPrice}, then multiply by ${qty}.`,
                    solution: `$${priceStr} ≈ $${roundedPrice}. Estimated total: $${roundedPrice} × ${qty} = $${ans}.`,
                    width: '120px',
                });
            },
            // legacy-keep: algebraic number sentence — symbolic recall (Phase 3c P2)
            function generateAlgebraicSentence() {
                const a = Math.floor(Math.random() * 8) + 3;
                const b = Math.floor(Math.random() * 8) + 2;
                const sum = a + b;
                return makeLegacyNumeric({
                    descriptor: 'AC9M4N08',
                    context: 'algebraic-sentence',
                    category: 'number',
                    title: 'NUMBER SENTENCE',
                    prompt: `Find the missing number: **? + ${a} = ${sum}**`,
                    answer: b,
                    hint: `Subtract ${a} from ${sum} to find the unknown.`,
                    solution: `${sum} − ${a} = ${b}, so ? = ${b}.`,
                });
            },
            // legacy-keep: scenario modelling — word problem recall (Phase 3c P2)
            function generateScenarioModelling() {
                const packs = Math.floor(Math.random() * 4) + 2;
                const perPack = [4, 5, 6][Math.floor(Math.random() * 3)];
                const ans = packs * perPack;
                return makeLegacyNumeric({
                    descriptor: 'AC9M4N08',
                    context: 'scenario-modelling',
                    category: 'number',
                    title: 'SCENARIO MODEL',
                    prompt: `A canteen sells juice boxes in packs of **${perPack}**. The school orders **${packs}** packs for an excursion. How many **juice boxes** in total?`,
                    answer: ans,
                    hint: `Multiply packs × boxes per pack: ${packs} × ${perPack}.`,
                    solution: `${packs} × ${perPack} = ${ans} juice boxes.`,
                    width: '120px',
                });
            },
            // legacy-keep: pathway algorithm — directional steps MCQ (Phase 3c P2)
            function generatePathwayAlgorithm() {
                const cols = ['A', 'B', 'C', 'D', 'E'];
                const rows = [5, 4, 3, 2, 1];
                const scenario = pickPathwayScenario();
                const { start, steps, path: routePath, key: pathwayVariantKey } = scenario;
                const end = routePath[routePath.length - 1];
                const correct = `Cell ${end.col}${end.row}`;
                const options = buildPathwayDistractors(end, correct, routePath, cols, rows);

                return {
                    descriptor: 'AC9M4N09',
                    context: 'pathway-algorithm',
                    category: 'number',
                    title: 'PATHWAY ALGORITHM',
                    prompt: formatPathwayPrompt(start, steps),
                    pathwayVariantKey,
                    widgets: [
                        {
                            id: 'grid',
                            type: 'coordinate-plotter',
                            config: {
                                mode: 'alpha-grid',
                                band: 'C',
                                cols,
                                rows,
                                selectionMode: 'path-trace',
                                showAxisTitles: true,
                            },
                        },
                    ],
                    inputs: [
                        {
                            id: 'choice',
                            type: 'select-input',
                            config: {
                                label: 'Answer:',
                                width: '220px',
                                options: [
                                    { value: '', label: 'Choose…' },
                                    ...options.map((o) => ({ value: o, label: o })),
                                ],
                            },
                        },
                    ],
                    evaluate(values) {
                        const selected = values.choice;
                        if (selected == null || selected === '') return false;
                        return String(selected) === correct;
                    },
                    hint: {
                        text: '<p>Use the grid: **columns** are labelled A–E across the top and **rows** are labelled 1–5 down the side. **Forward** moves up one row; **Right** moves across one column; **Backward** moves down one row; **Left** moves across left. Tap each cell along your route as you work through the steps, then choose your finishing cell below.</p>',
                        highlight: ['grid', 'choice'],
                    },
                    solution: {
                        text: describePathwaySolution(start, steps, routePath),
                        show: { choice: correct, grid: { routePath } },
                    },
                    points: 10,
                };
            },
            // legacy-keep: sequencing check — algorithm order MCQ (Phase 3c P2)
            function generateSequencingCheck() {
                const options = [
                    'Fold in half → fold wings → fold nose',
                    'Fold nose → fold in half → fold wings',
                    'Fold wings → fold nose → fold in half',
                    'Cut paper → fold in half → fold wings',
                ];
                const correct = 'Fold in half → fold wings → fold nose';
                return {
                    descriptor: 'AC9M4N09',
                    context: 'sequencing-check',
                    category: 'number',
                    title: 'SEQUENCING CHECK',
                    prompt: 'To make a paper plane, which step order is **correct**?',
                    widgets: [],
                    inputs: [
                        {
                            id: 'choice',
                            type: 'radio-choice-input',
                            config: {
                                ariaLabel: 'Choose the correct step order',
                                options,
                            },
                        },
                    ],
                    evaluate(values) {
                        return values.choice === correct;
                    },
                    hint: {
                        text: 'Algorithms must follow a logical sequence — centre fold before wing folds.',
                        highlight: ['choice'],
                    },
                    solution: { text: 'Fold in half first, then wings, then the nose point.', show: { choice: correct } },
                    points: 10,
                };
            },
        ],
        measurement: [
            // legacy-keep: gauge reading with unmarked intervals (Phase 3c policy)
            function generateGaugeReading() {
                const gauges = [
                    { min: 0, max: 100, step: 10, reading: 60, label: 'Temperature (°C)' },
                    { min: 0, max: 50, step: 5, reading: 35, label: 'Speed (km/h)' },
                    { min: 0, max: 20, step: 2, reading: 14, label: 'Pressure (units)' },
                ];
                const g = gauges[Math.floor(Math.random() * gauges.length)];
                const range = g.max - g.min;
                const needlePct = ((g.reading - g.min) / range) * 100;
                const tickHtml = [];
                for (let v = g.min; v <= g.max; v += 1) {
                    const pct = ((v - g.min) / range) * 100;
                    const major = v % 10 === 0;
                    tickHtml.push(
                        `<span class="mcs-gauge-tick${major ? ' mcs-gauge-tick--major' : ''}" style="left:${pct}%"></span>`,
                    );
                }
                const labelHtml = [];
                for (let v = g.min; v <= g.max; v += 10) {
                    const pct = ((v - g.min) / range) * 100;
                    labelHtml.push(`<span class="mcs-gauge-label" style="left:${pct}%">${v}</span>`);
                }
                const display = `
                    <div class="mcs-gauge-reading">
                        <div class="mcs-gauge-reading__title">${g.label}</div>
                        <div class="mcs-gauge-reading__track">
                            <div class="mcs-gauge-reading__ticks" aria-hidden="true">${tickHtml.join('')}</div>
                            <div class="mcs-gauge-reading__needle" style="left:${needlePct}%"></div>
                        </div>
                        <div class="mcs-gauge-reading__labels">${labelHtml.join('')}</div>
                        <p class="mcs-gauge-reading__hint">The needle points between labelled values. Each small mark is <strong>1</strong>; taller marks are every <strong>10</strong>.</p>
                    </div>`;
                return makeLegacyNumeric({
                    descriptor: 'AC9M4M01',
                    context: 'gauge-reading',
                    category: 'measurement',
                    title: 'GAUGE READING',
                    prompt: `Read the gauge shown below. What value does the **red needle** indicate?`,
                    display,
                    answer: g.reading,
                    hint: `Count steps of ${g.step} from ${g.min}. The needle is at the ${g.reading / g.step}th mark.`,
                    solution: `The needle indicates **${g.reading}**.`,
                    width: '100px',
                });
            },
            // legacy-keep: perimeter of rectangle — symbolic recall (Phase 3c P2)
            function generatePerimeterShapes() {
                const w = [4, 5, 6][Math.floor(Math.random() * 3)];
                const h = [3, 4, 5][Math.floor(Math.random() * 3)];
                const ans = 2 * (w + h);
                return makeLegacyNumeric({
                    descriptor: 'AC9M4M02',
                    context: 'perimeter-shapes',
                    category: 'measurement',
                    title: 'PERIMETER SHAPES',
                    prompt: `A rectangle is **${w} cm** long and **${h} cm** wide. What is its **perimeter in cm**?`,
                    answer: ans,
                    label: 'cm',
                    hint: 'Perimeter = 2 × (length + width).',
                    solution: `2 × (${w} + ${h}) = ${ans} cm.`,
                    width: '100px',
                });
            },
            // legacy-keep: area on square grid — count squares (Phase 3c P2)
            function generateAreaGrids() {
                const w = [3, 4, 5][Math.floor(Math.random() * 3)];
                const h = [2, 3, 4][Math.floor(Math.random() * 3)];
                const ans = w * h;
                return makeLegacyNumeric({
                    descriptor: 'AC9M4M02',
                    context: 'area-grids',
                    category: 'measurement',
                    title: 'AREA GRIDS',
                    prompt: `A shape covers **${w}** squares across and **${h}** squares down on a grid. What is its **area in square units**?`,
                    display: buildAreaGridDisplay(w, h),
                    answer: ans,
                    hint: 'Area on a grid = number of unit squares = width × height.',
                    solution: `${w} × ${h} = ${ans} square units.`,
                    width: '100px',
                });
            },
        ],
        space: [
            // legacy-keep: shape combination — MCQ recall (Phase 3c P2)
            function generateShapeCombination() {
                return makeLegacyChoice({
                    descriptor: 'AC9M4SP01',
                    context: 'shape-combination',
                    category: 'space',
                    title: 'SHAPE COMBINATION',
                    prompt: 'Two **identical right triangles** are placed together along their longest sides. What new shape do they make?',
                    options: ['Rectangle', 'Pentagon', 'Circle', 'Trapezium only'],
                    correct: 'Rectangle',
                    hint: 'Two congruent right triangles can form a rectangle when paired on the hypotenuse.',
                    solution: 'Pairing two identical right triangles along the hypotenuse forms a rectangle.',
                });
            },
            // legacy-keep: composite structures — 3D MCQ recall (Phase 3c P2)
            function generateCompositeStructures() {
                return makeLegacyChoice({
                    descriptor: 'AC9M4SP01',
                    context: 'composite-structures',
                    category: 'space',
                    title: 'COMPOSITE STRUCTURES',
                    prompt: 'A **cube** is stacked on top of another **identical cube**. How many **faces** are visible on the outside of the combined structure (not counting hidden faces)?',
                    options: ['10', '12', '8', '6'],
                    correct: '10',
                    hint: 'Each cube has 6 faces, but 2 faces touch and are hidden inside.',
                    solution: '12 total faces − 2 hidden contact faces = 10 visible faces.',
                });
            },
        ],
        statistics: [
            // legacy-keep: distribution shape — MCQ recall (Phase 3c policy)
            function generateDistributionShape() {
                const scenarios = [
                    {
                        dataset: '2, 2, 2, 8, 8, 8',
                        correct: 'Bunched at both ends',
                        hint: 'Look at where most values cluster — here values group at 2 and at 8.',
                        solution: 'Values cluster at both 2 and 8, so the distribution is bunched at both ends.',
                    },
                    {
                        dataset: '3, 4, 5, 6, 7',
                        correct: 'Spread evenly',
                        hint: 'Values increase steadily with roughly equal spacing across the range.',
                        solution: 'Values spread across the range with no clustering at the ends.',
                    },
                    {
                        dataset: '5, 5, 5, 5, 5',
                        correct: 'All the same value',
                        hint: 'Every value in the set is identical.',
                        solution: 'All values are 5 — there is no spread.',
                    },
                    {
                        dataset: '1, 2, 3, 4, 9',
                        correct: 'Only one outlier',
                        hint: 'Most values are close together; one value sits far away.',
                        solution: '9 is much higher than 1–4, so one outlier stands apart.',
                    },
                ];
                const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
                return makeLegacyChoice({
                    descriptor: 'AC9M4ST02',
                    context: 'distribution-shape',
                    category: 'statistics',
                    title: 'DISTRIBUTION SHAPE',
                    prompt: `Dataset: **${scenario.dataset}**. Which word best describes this distribution?`,
                    options: ['Bunched at both ends', 'Spread evenly', 'All the same value', 'Only one outlier'],
                    correct: scenario.correct,
                    hint: scenario.hint,
                    solution: scenario.solution,
                });
            },
            // legacy-keep: chart comparison — MCQ recall (Phase 3c policy)
            function generateChartComparison() {
                return makeLegacyChoice({
                    descriptor: 'AC9M4ST02',
                    context: 'chart-comparison',
                    category: 'statistics',
                    title: 'CHART COMPARISON',
                    prompt: 'You want to compare **exact counts** of pets owned by students. Which display is **most suitable**?',
                    options: ['Column graph with a scale', 'Pictograph with half-icons', 'Line graph of temperature', 'Pie chart of favourite colours'],
                    correct: 'Column graph with a scale',
                    hint: 'Column graphs show precise counts when the y-axis scale is clear.',
                    solution: 'A column graph with a labelled scale best shows exact counts for comparison.',
                });
            },
            // legacy-keep: survey compiling — tally totals (Phase 3c P2)
            function generateSurveyCompiling() {
                const tallies = [
                    { label: 'Soccer', count: 8 },
                    { label: 'Netball', count: 5 },
                    { label: 'Swimming', count: 3 },
                ];
                const target = tallies[Math.floor(Math.random() * tallies.length)];
                const display = `
                    <table style="width:100%; max-width:280px; font-size:0.85rem; border-collapse:collapse;">
                        <tr style="border-bottom:1px solid var(--outline-variant);"><th style="text-align:left; padding:4px;">Sport</th><th style="text-align:right; padding:4px;">Votes</th></tr>
                        ${tallies.map((t) => `<tr><td style="padding:4px;">${t.label}</td><td style="text-align:right; padding:4px;">${t.count}</td></tr>`).join('')}
                    </table>`;
                return makeLegacyNumeric({
                    descriptor: 'AC9M4ST03',
                    context: 'survey-compiling',
                    category: 'statistics',
                    title: 'SURVEY COMPILING',
                    prompt: `Use the class survey table below. How many students chose **${target.label}**?`,
                    display,
                    answer: target.count,
                    hint: 'Read the vote count directly from the table row.',
                    solution: `${target.label}: **${target.count}** votes.`,
                });
            },
            // legacy-keep: survey reading — interpret results MCQ (Phase 3c P2)
            function generateSurveyReading() {
                return makeLegacyChoice({
                    descriptor: 'AC9M4ST03',
                    context: 'survey-reading',
                    category: 'statistics',
                    title: 'SURVEY READING',
                    prompt: 'Survey results: **Dogs 12**, **Cats 8**, **Fish 4**. Which statement is **best supported** by the data?',
                    options: [
                        'Dogs were the most popular choice',
                        'More students chose fish than cats',
                        'Exactly half chose cats',
                        'No students chose dogs',
                    ],
                    correct: 'Dogs were the most popular choice',
                    hint: 'Compare the counts — largest value wins.',
                    solution: '12 > 8 > 4, so dogs were most popular.',
                });
            },
        ],
        probability: [
            // legacy-keep: coin toss record — frequency recall (Phase 3c policy)
            function generateCoinTossRecord() {
                const heads = [6, 7, 8][Math.floor(Math.random() * 3)];
                const flips = 10;
                return makeLegacyChoice({
                    descriptor: 'AC9M4P02',
                    context: 'coin-toss-record',
                    category: 'probability',
                    title: 'COIN TOSS RECORD',
                    prompt: `A fair coin is flipped **${flips}** times. **Heads** appears **${heads}** times. What fraction of flips were heads?`,
                    options: [`${heads}/10`, `${heads - 1}/10`, `${heads + 1}/10`, `${flips - heads}/10`],
                    correct: `${heads}/10`,
                    hint: `Fraction = favourable outcomes ÷ total trials = ${heads} ÷ ${flips}.`,
                    solution: `${heads} heads out of ${flips} flips = **${heads}/10**.`,
                });
            },
            // legacy-keep: coin toss variation — experimental vs theoretical (Phase 3c policy)
            function generateCoinTossVariation() {
                return makeLegacyChoice({
                    descriptor: 'AC9M4P02',
                    context: 'coin-toss-variation',
                    category: 'probability',
                    title: 'TOSS VARIATION',
                    prompt: 'After **10** coin flips you get **7 heads** instead of exactly **5**. Why is this normal?',
                    options: [
                        'Short trials vary around 50% — more flips smooth results',
                        'The coin must be broken',
                        'Heads is always more likely',
                        'Probability only works after 1000 flips',
                    ],
                    correct: 'Short trials vary around 50% — more flips smooth results',
                    hint: 'Experimental results fluctuate; theoretical probability is 1/2 over many trials.',
                    solution: 'Small samples vary. Over many flips, heads and tails tend toward equal frequency.',
                });
            },
        ],
    };

    function pickCategoryQuestion(category) {
        const gaps = gapGenerators[category] || [];
        const legacy = generators[category];
        if (!legacy && gaps.length === 0) return null;

        const generateFn = () => {
            const poolSize = gaps.length + (legacy ? 1 : 0);
            const pick = Math.floor(Math.random() * poolSize);
            return pick < gaps.length ? gaps[pick]() : legacy();
        };

        return MCS.questionPicker.pick(generateFn, state.sessionSeenQuestions);
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
        state.lastPathwayOutcome = null;
        pracAttemptsLeft.textContent = "2 ATTEMPTS LEFT";
        pracAttemptsLeft.className = "rank-pill";
        
        pracHintContainer.style.display = 'none';
        pracSolutionContainer.style.display = 'none';
        pracFeedbackText.style.display = 'none';
        
        btnPracHint.style.display = 'none';
        btnPracSubmit.style.display = 'block';
        btnPracSubmit.disabled = false;
        btnPracSubmit.style.opacity = '1';
        btnPracSubmit.style.pointerEvents = 'auto';
        btnPracNext.style.display = 'none';

        const rawQuestion = pickCategoryQuestion(state.activeCategory);
        if (!rawQuestion) return;

        state.currentQuestion = rawQuestion;
        const band =
            (rawQuestion.widgets && rawQuestion.widgets[0] && rawQuestion.widgets[0].config && rawQuestion.widgets[0].config.band)
            || 'C';
        state.questionSession = MCS.runQuestion(rawQuestion, {
            widgetMount: pracInteractivePanel,
            promptMount: pracTaskTitle,
            band,
        });
        if (typeof rawQuestion.wireSession === 'function') {
            rawQuestion.wireSession(state.questionSession, { submitBtn: btnPracSubmit });
        }
        const codeEl = document.getElementById('practice-code');
        if (codeEl && rawQuestion.descriptor) {
            codeEl.textContent = `[${rawQuestion.descriptor}]`;
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
        }
        pracHintContainer.style.display = 'block';
        btnPracHint.style.display = 'none';
        addLog("Hint module active.", "system");
    });

    btnPracSubmit.addEventListener('click', () => {
        if (!state.currentQuestion || !state.questionSession) return;

        const isCorrect = state.questionSession.evaluate();

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
            state.lastPathwayOutcome = true;
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
                }
                pracSolutionContainer.style.display = 'block';
                
                gainPoints(0, false, state.activeCategory, state.currentQuestion.descriptor, state.currentQuestion.context);
                state.lastPathwayOutcome = false;
                addLog(`Calibration failed for strand ${state.activeCategory.toUpperCase()}. Realignment required.`, "error");
            }
        }
    });

    btnPracNext.addEventListener('click', () => {
        sounds.click();
        if (state.currentQuestion) {
            markPathwayVariantUsed(state.currentQuestion, state.lastPathwayOutcome === true);
        }
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

    // Booting practice session
    loadProfile();
    initSandboxQuestion();
});
