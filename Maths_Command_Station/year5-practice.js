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
        
        profile.scoresByCat = profile.scoresByCatY5; 
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
                    <div class="cert-header-band">
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
        
        const activeYear = 5;
        const y5Descriptors = Object.keys(DESCRIPTOR_BADGES).filter(key => DESCRIPTOR_BADGES[key].year === activeYear);
        const y5GrandBadges = Object.keys(GRAND_BADGES).filter(key => GRAND_BADGES[key].year === activeYear);
        const allBadgeKeys = [...Object.keys(GLOBAL_BADGES), ...y5Descriptors, ...y5GrandBadges];
        
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
        lastDieOutcomesScenarioId: null,
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

    function pickAvoidingRepeat(items, lastId, idKey = 'id') {
        if (!items.length) return null;
        const pool = lastId ? items.filter((item) => item[idKey] !== lastId) : items;
        return pool[Math.floor(Math.random() * pool.length)] || items[0];
    }

    const SAMPLE_SPACE_SCENARIOS = [
        {
            id: 'die-six',
            prompt: 'A standard fair 6-sided die is rolled once. Select all possible outcomes:',
            apparatus: 'die',
            targetOutcomes: ['1', '2', '3', '4', '5', '6'],
            allOptions: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
            hintLine: 'For a 6-sided die: faces numbered 1 to 6.',
        },
        {
            id: 'coin-flip',
            prompt: 'A fair coin is flipped once. Select all possible outcomes:',
            apparatus: 'coin',
            targetOutcomes: ['Heads', 'Tails'],
            allOptions: ['Heads', 'Tails', 'Both', 'Neither', 'Edge'],
            hintLine: 'For one coin flip: only Heads or Tails.',
        },
        {
            id: 'spinner-abcd',
            prompt:
                'A spinner with 4 equal sections labeled A, B, C and D is spun once. Select all possible outcomes:',
            apparatus: 'spinner',
            targetOutcomes: ['A', 'B', 'C', 'D'],
            allOptions: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
            hintLine: 'For a spinner labeled A, B, C, D: only those 4 letters.',
        },
        {
            id: 'spinner-rbg',
            prompt:
                'A spinner with 3 equal sections colored Red, Blue and Green is spun once. Select all possible outcomes:',
            apparatus: 'spinner',
            targetOutcomes: ['Red', 'Blue', 'Green'],
            allOptions: ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Pink', 'Brown'],
            hintLine: 'For a 3-color spinner: only Red, Blue and Green.',
        },
        {
            id: 'spinner-five',
            prompt:
                'A fair spinner has 5 equal sections numbered 1, 2, 3, 4 and 5. Select all possible outcomes:',
            apparatus: 'spinner',
            targetOutcomes: ['1', '2', '3', '4', '5'],
            allOptions: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
            hintLine: 'For a 5-section numbered spinner: only 1 through 5.',
        },
        {
            id: 'spinner-even-odd',
            prompt:
                'A spinner with 2 equal halves labeled Even and Odd is spun once. Select all possible outcomes:',
            apparatus: 'spinner',
            targetOutcomes: ['Even', 'Odd'],
            allOptions: ['Even', 'Odd', 'Both', 'Neither', 'Prime'],
            hintLine: 'For a two-way spinner: only Even and Odd.',
        },
    ];

    function y5Q1GridConfig(extra) {
        return Object.assign({
            band: 'C',
            quadrants: 1,
            xMin: 0,
            xMax: 10,
            yMin: 0,
            yMax: 10,
            snap: 1,
            showAxes: true,
            showGrid: true,
            labels: 'all',
        }, extra || {});
    }

    function verticesMatchSet(userVerts, correctVerts) {
        if (!userVerts || userVerts.length !== correctVerts.length) return false;
        return correctVerts.every(function (cv) {
            return userVerts.some(function (uv) {
                return uv.x === cv.x && uv.y === cv.y;
            });
        });
    }

    // SVG Line Graph Helper (Statistics)
    // legacy-keep: data-display / investigation-planner still use inline table/bar DOM (Phase 3 policy)

    function buildSevenDaySeries() {
        const daysData = [];
        let currentVal = Math.floor(Math.random() * 40) + 20;
        daysData.push(currentVal);
        for (let i = 1; i < 7; i++) {
            const diff = Math.floor(Math.random() * 31) - 15;
            currentVal = Math.min(95, Math.max(5, currentVal + diff));
            daysData.push(currentVal);
        }
        return daysData;
    }

    function daySelectOptions() {
        return [
            { value: '', label: '-' },
            { value: '1', label: 'Day 1' },
            { value: '2', label: 'Day 2' },
            { value: '3', label: 'Day 3' },
            { value: '4', label: 'Day 4' },
            { value: '5', label: 'Day 5' },
            { value: '6', label: 'Day 6' },
            { value: '7', label: 'Day 7' },
        ];
    }

    // ----------------------------------------------------
    // 5. Dynamic Category Generators & Helpers (6 strands)
    // ----------------------------------------------------
    const generators = {
        number: () => {
            const subTypes = ['decimal-ordering', 'factor-multiple', 'percentage-converter', 'multiplication', 'division-remainder', 'fraction-ordering', 'fraction-addition', 'word-problem'];
            const chosenType = subTypes[Math.floor(Math.random() * subTypes.length)];

            if (chosenType === 'decimal-ordering') {
                const decContexts = ['decimal-sorting', 'number-line-plots', 'decimal-magnitude-build', 'decimal-diagnostic-sort', 'decimal-race-times'];
                const decContext = decContexts[Math.floor(Math.random() * decContexts.length)];

                if (decContext === 'decimal-magnitude-build') {
                    const whole = Math.floor(Math.random() * 2) + 1;
                    const tenths = Math.floor(Math.random() * 10);
                    const hundredths = Math.floor(Math.random() * 9) + 1;
                    const val = Number((whole + tenths * 0.1 + hundredths * 0.01).toFixed(2));
                    return {
                        descriptor: 'AC9M5N01',
                        context: decContext,
                        category: 'number',
                        type: 'decimal-ordering',
                        title: 'Build the decimal number',
                        prompt: `Use the place-value blocks to build the number **${val.toFixed(2)}**.`,
                        widgets: [
                            {
                                id: 'blocks',
                                type: 'place-value-blocks',
                                config: {
                                    mode: 'build',
                                    interactive: true,
                                    decimal: true,
                                    max: 2.99,
                                }
                            }
                        ],
                        inputs: [],
                        evaluate(values) {
                            return values.blocks && values.blocks.total === val;
                        },
                        hint: {
                            text: `For ${val.toFixed(2)}, you need ${whole} ones, ${tenths} tenths, and ${hundredths} hundredths.`
                        },
                        solution: {
                            text: `Build ${val.toFixed(2)} with ${whole} ones (flats), ${tenths} tenths (rods), and ${hundredths} hundredths (small cubes).`,
                            show: { blocks: val }
                        },
                        points: 10
                    };
                }
                
                if (decContext === 'decimal-diagnostic-sort') {
                    const pool = [];
                    for(let i = 1; i <= 29; i++) pool.push(Number((i * 0.1).toFixed(1)));
                    const chosen = shuffleArray(pool).slice(0, 4);
                    const correctOrder = [...chosen].sort((a, b) => a - b);
                    let wrongOrder = shuffleArray([...chosen]);
                    while(wrongOrder.join(',') === correctOrder.join(',')) {
                        wrongOrder = shuffleArray([...chosen]);
                    }
                    const cards = wrongOrder.map((v, i) => ({ id: 'c' + i, label: v.toFixed(1), value: v }));
                    const sortedIds = correctOrder.map(v => cards.find(c => c.value === v).id);
                    return {
                        descriptor: 'AC9M5N01',
                        context: decContext,
                        category: 'number',
                        type: 'decimal-ordering',
                        title: 'Fix the decimal order',
                        prompt: 'A student tried to order these decimals from smallest to largest, but made a mistake. Drag the cards to fix the order.',
                        widgets: [
                            {
                                id: 'sort',
                                type: 'sorting-table',
                                config: {
                                    mode: 'sequence-lane',
                                    band: 'C',
                                    cards: cards,
                                    laneHint: 'Smallest → Largest',
                                    shuffle: false
                                }
                            }
                        ],
                        inputs: [],
                        evaluate(values) {
                            const seq = (values.sort && values.sort.sequence) || [];
                            if (seq.length !== sortedIds.length) return false;
                            return seq.every((id, i) => id === sortedIds[i]);
                        },
                        hint: {
                            text: 'Compare the numbers by looking at the ones column first, then the tenths column.'
                        },
                        solution: {
                            text: `The correct order is: ${correctOrder.map(v => v.toFixed(1)).join(', ')}.`,
                            show: { sort: { sequence: sortedIds } }
                        },
                        points: 10
                    };
                }
                
                if (decContext === 'decimal-race-times') {
                    const pool = [];
                    for(let i = 1; i < 20; i++) pool.push(Number((10 + i * 0.1).toFixed(1)));
                    const decimals = shuffleArray(pool).slice(0, 4);
                    const sorted = [...decimals].sort((a, b) => a - b);
                    const linePoints = decimals.map((d, i) => ({ id: 'r' + i, label: d.toFixed(1) + 's', value: d }));
                    const solutionPlacements = Object.fromEntries(linePoints.map(p => [p.id, p.value]));
                    return {
                        descriptor: 'AC9M5N01',
                        context: decContext,
                        category: 'number',
                        type: 'decimal-ordering',
                        title: 'Plot the race times',
                        prompt: 'Four sprinters finished a race. Drag each race time to its correct position on the timeline.',
                        widgets: [
                            {
                                id: 'line',
                                type: 'number-line',
                                config: {
                                    mode: 'order-points',
                                    band: 'C',
                                    min: 10,
                                    max: 12,
                                    snapStep: 0.1,
                                    ticks: { major: 1, minor: 0.1, labels: 'major' },
                                    points: linePoints
                                }
                            }
                        ],
                        inputs: [],
                        evaluate(values) {
                            const placements = values.line;
                            if (!placements) return false;
                            return linePoints.every((p) => {
                                const placed = placements[p.id];
                                return placed != null && Math.abs(placed - p.value) < 0.051;
                            });
                        },
                        hint: {
                            text: `To plot the times, look at the tenths. For example, ${sorted[0].toFixed(1)}s is just past the 10s mark.`
                        },
                        solution: {
                            text: `From fastest to slowest: ${sorted.map(v => v.toFixed(1) + 's').join(', ')}.`,
                            show: { line: solutionPlacements }
                        },
                        points: 10
                    };
                }

                const decPool = [];
                for (let t = 1; t <= 19; t++) {
                    decPool.push(t / 10);
                }
                const decimals = shuffleArray(decPool).slice(0, 4);
                const sorted = [...decimals].sort((a, b) => a - b);
                const shuffled = shuffleArray(decimals);
                const linePoints = shuffled.map((d, i) => ({
                    id: 'd' + i,
                    label: d.toFixed(1),
                    value: d,
                }));
                const solutionPlacements = Object.fromEntries(
                    linePoints.map((p) => [p.id, p.value])
                );
                const snapStep = 0.1;

                return {
                    descriptor: 'AC9M5N01',
                    context: decContext,
                    category: 'number',
                    type: 'decimal-ordering',
                    title:
                        decContext === 'number-line-plots'
                            ? 'Plot each decimal at the correct position on the number line:'
                            : 'Order the decimal numbers from smallest to largest:',
                    prompt: 'Drag each labelled pin to its correct position on the number line (0 to 2).',
                    widgets: [
                        {
                            id: 'line',
                            type: 'number-line',
                            config: {
                                mode: 'order-points',
                                band: 'C',
                                min: 0,
                                max: 2,
                                snapStep,
                                ticks: { major: 1, minor: snapStep, labels: 'major' },
                                points: linePoints,
                            },
                        },
                    ],
                    inputs: [],
                    evaluate(values) {
                        const placements = values.line;
                        if (!placements) return false;
                        return linePoints.every((p) => {
                            const placed = placements[p.id];
                            return placed != null && Math.abs(placed - p.value) < 0.051;
                        });
                    },
                    hint: {
                        text: `
                            <p>To order decimals, compare the tenths column first, then the ones:</p>
                            <div style="font-family:var(--font-mono); margin-top:8px; display:flex; flex-direction:column; gap:4px;">
                                ${shuffled.map((d) => `<span>${d.toFixed(1)}</span>`).join('')}
                            </div>
                        `,
                        highlight: ['line'],
                    },
                    solution: {
                        text: `From smallest to largest: ${sorted.map((d) => d.toFixed(1)).join(' < ')}.`,
                        show: { line: solutionPlacements },
                    },
                    points: 10,
                };
            } else if (chosenType === 'factor-multiple') {
                const subTypes = [
                    'factor-checking',
                    'factor-listing',
                    'factor-array-build',
                    'factor-list-debug',
                    'multiples-number-track',
                    'divisibility-sort',
                    'divisibility-grouping'
                ];
                const selectedSub = subTypes[Math.floor(Math.random() * subTypes.length)];

                if (selectedSub === 'factor-checking') {
                    const targetNums = [24, 30, 36, 40, 48];
                    const N = targetNums[Math.floor(Math.random() * targetNums.length)];
                    const isFact = Math.random() > 0.5;
                    let F = 1;
                    const facts = getFactors(N);
                    if (isFact) {
                        const subFacts = facts.filter(f => f !== 1 && f !== N);
                        F = subFacts.length > 0 ? subFacts[Math.floor(Math.random() * subFacts.length)] : 2;
                    } else {
                        const nonFacts = [];
                        for (let i = 3; i < 12; i++) {
                            if (N % i !== 0) nonFacts.push(i);
                        }
                        F = nonFacts[Math.floor(Math.random() * nonFacts.length)];
                    }

                    const isYes = (N % F === 0);

                    return {
                        descriptor: 'AC9M5N02',
                        context: 'factor-checking',
                        category: 'number',
                        type: 'factor-multiple',
                        title: 'FACTOR CHECKING',
                        prompt: `Is **${F}** a factor of **${N}**?`,
                        widgets: [],
                        inputs: [
                            {
                                id: 'ans',
                                type: 'radio-choice-input',
                                config: {
                                    options: [
                                        { label: 'Yes', value: 'yes' },
                                        { label: 'No', value: 'no' }
                                    ]
                                }
                            }
                        ],
                        evaluate(values) {
                            if (!values.ans) return false;
                            const expected = isYes ? 'yes' : 'no';
                            return values.ans === expected;
                        },
                        hint: {
                            text: `<p>A <strong>factor</strong> is a whole number that divides into another number exactly without leaving a remainder.</p>
                                   <p>Calculate: ${N} ÷ ${F}. If the result is a whole number, then ${F} is a factor of ${N}.</p>`,
                        },
                        solution: {
                            text: `${N} ÷ ${F} = ${(N / F).toFixed(2)}. Therefore, ${F} is ${isYes ? 'indeed' : 'not'} a factor of ${N}.`,
                            show: { ans: isYes ? 'yes' : 'no' }
                        },
                        points: 10
                    };

                } else if (selectedSub === 'factor-listing') {
                    const targetNums = [18, 20, 24, 28, 30, 36];
                    const N = targetNums[Math.floor(Math.random() * targetNums.length)];
                    const facts = getFactors(N);

                    return {
                        descriptor: 'AC9M5N02',
                        context: 'factor-listing',
                        category: 'number',
                        type: 'factor-multiple',
                        title: 'LIST ALL FACTORS',
                        prompt: `List all factors of **${N}**:`,
                        widgets: [],
                        inputs: [
                            {
                                id: 'ans',
                                type: 'math-field',
                                config: {
                                    band: 'C',
                                    keyboard: 'integers',
                                    placeholder: 'e.g. 1, 2, 3...'
                                }
                            }
                        ],
                        evaluate(values) {
                            if (!values.ans) return false;
                            const clean = values.ans.replace(/\\,/g, ',').replace(/[^0-9,]/g, '');
                            const userFacts = clean.split(',').map(x => parseInt(x, 10)).filter(x => !isNaN(x));
                            const uniqueUserFacts = [...new Set(userFacts)].sort((a, b) => a - b);
                            return (uniqueUserFacts.length === facts.length) && uniqueUserFacts.every((val, idx) => val === facts[idx]);
                        },
                        hint: {
                            text: `<p>Factors always come in pairs (e.g. 1 × ${N} = ${N}).</p>
                                   <p>Check every number starting from 1 to see if it divides ${N} evenly. Stop when your factor pairs start repeating.</p>`,
                        },
                        solution: {
                            text: `The complete factor set of ${N} is: ${facts.join(', ')}.`,
                            show: { ans: facts.join(',') }
                        },
                        points: 10
                    };

                } else if (selectedSub === 'factor-array-build') {
                    const targetNums = [12, 16, 18, 20, 24];
                    const N = targetNums[Math.floor(Math.random() * targetNums.length)];
                    const facts = getFactors(N);
                    const pairs = [];
                    for (let i = 2; i < N; i++) {
                        if (N % i === 0) {
                            pairs.push({ r: i, c: N / i });
                        }
                    }

                    return {
                        descriptor: 'AC9M5N02',
                        context: 'factor-array-build',
                        category: 'number',
                        type: 'factor-multiple',
                        title: 'BUILD FACTOR ARRAY',
                        prompt: `Build an array that shows **${N}** as a product of two factors. Use a factor pair other than 1 × ${N}.`,
                        widgets: [
                            {
                                id: 'array',
                                type: 'array-builder',
                                config: {
                                    mode: 'build-array',
                                    band: 'C',
                                    initialRows: 1,
                                    initialCols: 1,
                                    maxRows: 12,
                                    maxCols: 12
                                }
                            }
                        ],
                        inputs: [],
                        evaluate(values) {
                            const arr = values.array;
                            if (!arr) return false;
                            const r = arr.rows;
                            const c = arr.cols;
                            return (r * c === N) && (r !== 1) && (c !== 1);
                        },
                        hint: {
                            text: `<p>An array shows factors as dimensions. Drag the handles to resize the grid until the total dot count is exactly ${N}.</p>
                                   <p>Ensure neither row nor column size is 1 or ${N}. Valid options are pairs like ${pairs.map(p => `${p.r} × ${p.c}`).join(' or ')}.</p>`,
                            highlight: ['array']
                        },
                        solution: {
                            text: `A valid array has dimensions of a factor pair of ${N} (excluding 1). For example: ${pairs[0].r} rows × ${pairs[0].c} columns = ${N} dots.`,
                            show: { array: { rows: pairs[0].r, cols: pairs[0].c } }
                        },
                        points: 10
                    };

                } else if (selectedSub === 'factor-list-debug') {
                    const scenarios = [
                        { N: 36, incorrect: 5, missing: 18, list: [1, 2, 3, 5, 6, 9, 12, 36] },
                        { N: 24, incorrect: 7, missing: 8, list: [1, 2, 3, 4, 6, 7, 12, 24] },
                        { N: 30, incorrect: 9, missing: 10, list: [1, 2, 3, 5, 6, 9, 15, 30] },
                        { N: 28, incorrect: 6, missing: 7, list: [1, 2, 4, 6, 14, 28] }
                    ];
                    const pick = scenarios[Math.floor(Math.random() * scenarios.length)];
                    const options = pick.list.map(String);

                    return {
                        descriptor: 'AC9M5N02',
                        context: 'factor-list-debug',
                        category: 'number',
                        type: 'factor-multiple',
                        title: 'FIX THE FACTOR LIST',
                        prompt: `A student wrote the list below to show the factors of **${pick.N}**. **One number in the list is WRONG**, and **one factor is MISSING**.`,
                        widgets: [],
                        inputs: [
                            {
                                id: 'wrong_num',
                                type: 'radio-choice-input',
                                config: {
                                    label: 'Select the incorrect number in the list:',
                                    options: options
                                }
                            },
                            {
                                id: 'missing_num',
                                type: 'math-field',
                                config: {
                                    band: 'C',
                                    keyboard: 'integers',
                                    placeholder: 'Enter the missing factor'
                                }
                            }
                        ],
                        evaluate(values) {
                            if (values.wrong_num !== String(pick.incorrect)) return false;
                            return MCS.input.check(values.missing_num, { equals: pick.missing });
                        },
                        hint: {
                            text: `<p>Check each number in the list: does it divide ${pick.N} without a remainder? The one that doesn't is incorrect.</p>
                                   <p>Then list all actual factors of ${pick.N} and see which one is missing from the list.</p>`,
                        },
                        solution: {
                            text: `The number ${pick.incorrect} is not a factor of ${pick.N}. The missing factor is ${pick.missing}.`,
                            show: { wrong_num: String(pick.incorrect), missing_num: { latex: String(pick.missing) } }
                        },
                        points: 10
                    };

                } else if (selectedSub === 'multiples-number-track') {
                    const M = [6, 7, 8, 9][Math.floor(Math.random() * 4)];
                    const expected = [];
                    for (let i = 1; i <= 70; i++) {
                        if (i % M === 0) expected.push(i);
                    }

                    return {
                        descriptor: 'AC9M5N02',
                        context: 'multiples-number-track',
                        category: 'number',
                        type: 'factor-multiple',
                        title: 'MULTIPLES PATTERN',
                        prompt: `Tap all multiples of **${M}** on the number track up to 70:`,
                        widgets: [
                            {
                                id: 'track',
                                type: 'number-track',
                                config: {
                                    mode: 'sieve-shade',
                                    band: 'C',
                                    min: 1,
                                    max: 70,
                                    columns: 10,
                                    divisor: M
                                }
                            }
                        ],
                        inputs: [],
                        evaluate(values) {
                            const arr = values.track || [];
                            if (arr.length !== expected.length) return false;
                            return expected.every(val => arr.includes(val));
                        },
                        hint: {
                            text: `<p>Multiples are found by skip-counting. Tap numbers like ${M}, ${M*2}, ${M*3}, etc., all the way up to 70.</p>`,
                            highlight: ['track']
                        },
                        solution: {
                            text: `The multiples of ${M} up to 70 are: ${expected.join(', ')}.`,
                            show: { track: expected }
                        },
                        points: 10
                    };

                } else if (selectedSub === 'divisibility-sort') {
                    const D = [3, 4, 6][Math.floor(Math.random() * 3)];
                    const divNums = [];
                    const nonDivNums = [];
                    while (divNums.length < 3) {
                        const candidate = D * (Math.floor(Math.random() * 15) + 2);
                        if (!divNums.includes(candidate)) divNums.push(candidate);
                    }
                    while (nonDivNums.length < 3) {
                        const candidate = D * (Math.floor(Math.random() * 15) + 2) + (Math.floor(Math.random() * (D - 1)) + 1);
                        if (!nonDivNums.includes(candidate)) nonDivNums.push(candidate);
                    }

                    const allNums = shuffleArray([...divNums, ...nonDivNums]);
                    const cards = allNums.map((num, idx) => ({
                        id: 'num_' + idx,
                        label: String(num),
                        emoji: '🔢',
                        number: num
                    }));

                    const solutionZones = { divisible: [], not_divisible: [] };
                    cards.forEach(c => {
                        if (c.number % D === 0) solutionZones.divisible.push(c.id);
                        else solutionZones.not_divisible.push(c.id);
                    });

                    return {
                        descriptor: 'AC9M5N02',
                        context: 'divisibility-sort',
                        category: 'number',
                        type: 'factor-multiple',
                        title: 'DIVISIBILITY SORT',
                        prompt: `Sort these numbers based on whether they are divisible by **${D}**:`,
                        widgets: [
                            {
                                id: 'sort',
                                type: 'sorting-table',
                                config: {
                                    mode: 'shape-hangars',
                                    band: 'C',
                                    columns: [
                                        { id: 'divisible', label: `Divisible by ${D}`, emoji: '✅' },
                                        { id: 'not_divisible', label: `Not divisible`, emoji: '❌' }
                                    ],
                                    cards: cards,
                                    trayLabel: 'Numbers to sort:'
                                }
                            }
                        ],
                        inputs: [],
                        evaluate(values) {
                            const v = values.sort || {};
                            const zones = v.zones || {};
                            if ((v.filled || 0) !== cards.length) return false;
                            return cards.every(c => {
                                const expectedZone = (c.number % D === 0) ? 'divisible' : 'not_divisible';
                                return (zones[expectedZone] || []).includes(c.id);
                            });
                        },
                        hint: {
                            text: `<p>A number is divisible by ${D} if dividing it by ${D} leaves a remainder of 0.</p>`,
                            highlight: ['sort']
                        },
                        solution: {
                            text: `Numbers divisible by ${D}: ${divNums.join(', ')}. Not divisible: ${nonDivNums.join(', ')}.`,
                            show: { sort: { zones: solutionZones } }
                        },
                        points: 10
                    };

                } else if (selectedSub === 'divisibility-grouping') {
                    const N = [20, 21, 22, 23, 24, 25, 26, 27, 28][Math.floor(Math.random() * 9)];
                    const hasRemainder = (N % 4 !== 0);

                    return {
                        descriptor: 'AC9M5N02',
                        context: 'divisibility-grouping',
                        category: 'number',
                        type: 'factor-multiple',
                        title: 'DIVISIBILITY GROUPING',
                        prompt: `Drag all **${N} fuel cells** into the 4 rovers so each rover has an equal amount. Then answer: is there a remainder left in the tray?`,
                        widgets: [
                            {
                                id: 'counters',
                                type: 'counters',
                                config: {
                                    mode: 'make-equal-groups',
                                    band: 'C',
                                    total: N,
                                    zones: [
                                        { id: 'r1', label: 'Rover A', capacity: 8 },
                                        { id: 'r2', label: 'Rover B', capacity: 8 },
                                        { id: 'r3', label: 'Rover C', capacity: 8 },
                                        { id: 'r4', label: 'Rover D', capacity: 8 }
                                    ]
                                }
                            }
                        ],
                        inputs: [
                            {
                                id: 'ans',
                                type: 'radio-choice-input',
                                config: {
                                    label: 'Is there a remainder?',
                                    options: [
                                        { label: 'Yes, leftovers remain', value: 'yes' },
                                        { label: 'No, shared perfectly', value: 'no' }
                                    ]
                                }
                            }
                        ],
                        evaluate(values) {
                            const c = values.counters || {};
                            if (c.placed !== N) return false;
                            
                            const counts = [c.r1 || 0, c.r2 || 0, c.r3 || 0, c.r4 || 0];
                            const maxVal = Math.max(...counts);
                            const minVal = Math.min(...counts);
                            if (maxVal - minVal !== 0) return false;

                            const expected = hasRemainder ? 'yes' : 'no';
                            return values.ans === expected;
                        },
                        hint: {
                            text: `<p>Drag the fuel cells from the tray into the rovers one by one, keeping the numbers in each rover equal.</p>
                                   <p>If you cannot place all cells equally, the leftovers in the tray form the remainder.</p>`,
                            highlight: ['counters', 'ans']
                        },
                        solution: {
                            text: `${N} divided by 4 is ${Math.floor(N / 4)} with a remainder of ${N % 4}. Therefore, there is ${hasRemainder ? 'indeed' : 'no'} remainder.`,
                            show: {
                                counters: {
                                    r1: Math.floor(N / 4),
                                    r2: Math.floor(N / 4),
                                    r3: Math.floor(N / 4),
                                    r4: Math.floor(N / 4),
                                    unplaced: N % 4
                                },
                                ans: hasRemainder ? 'yes' : 'no'
                            }
                        },
                        points: 10
                    };
                }
            } else if (chosenType === 'percentage-converter') {
                const varType = Math.floor(Math.random() * 3);

                if (varType === 0) {
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
                        { text: '7/10', val: 70 },
                    ];
                    const selected = fracOptions[Math.floor(Math.random() * fracOptions.length)];

                    return {
                        descriptor: 'AC9M5N04',
                        context: 'fraction-to-percent',
                        category: 'number',
                        type: 'percentage-converter',
                        title: `Convert the fraction ${selected.text} to a percentage:`,
                        widgets: [
                            {
                                id: 'display',
                                type: 'legacy-passthrough',
                                config: {
                                    render: (container) => {
                                        container.innerHTML = `
                                            <div class="flex-col align-center gap-8">
                                                <div style="font-size:2.5rem; font-weight:700; color:var(--primary);">${selected.text}</div>
                                                <p style="font-size:0.8rem; color:var(--outline);">Enter a whole-number percentage below (with or without %).</p>
                                            </div>
                                        `;
                                    },
                                },
                            },
                        ],
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
                                equals: selected.val,
                                form: 'any',
                            });
                        },
                        hint: {
                            text: `<p>A percentage is a fraction out of 100. Find an equivalent fraction with a denominator of 100: e.g. ${selected.text} = (${selected.val}/100) = ${selected.val}%.</p>`,
                            highlight: ['display'],
                        },
                        solution: {
                            text: `Since ${selected.text} represents ${selected.val} hundredths, it is equal to ${selected.val}%.`,
                            show: { ans: { latex: String(selected.val) } },
                        },
                        points: 10,
                    };
                } else if (varType === 1) {
                    const pctOptions = [
                        { pct: 25, frac: '1/4', ratio: 0.25 },
                        { pct: 50, frac: '1/2', ratio: 0.5 },
                        { pct: 75, frac: '3/4', ratio: 0.75 },
                        { pct: 20, frac: '1/5', ratio: 0.2 },
                        { pct: 40, frac: '2/5', ratio: 0.4 },
                        { pct: 60, frac: '3/5', ratio: 0.6 },
                        { pct: 80, frac: '4/5', ratio: 0.8 },
                        { pct: 10, frac: '1/10', ratio: 0.1 },
                    ];
                    const selected = pctOptions[Math.floor(Math.random() * pctOptions.length)];

                    return {
                        descriptor: 'AC9M5N04',
                        context: 'percent-to-fraction',
                        category: 'number',
                        type: 'percentage-converter',
                        title: `Convert the percentage ${selected.pct}% to a simplified fraction:`,
                        widgets: [
                            {
                                id: 'display',
                                type: 'legacy-passthrough',
                                config: {
                                    render: (container) => {
                                        container.innerHTML = `
                                            <div class="flex-col align-center gap-8">
                                                <div style="font-size:2.5rem; font-weight:700; color:var(--primary);">${selected.pct}%</div>
                                            </div>
                                        `;
                                    },
                                },
                            },
                        ],
                        inputs: [
                            {
                                id: 'ans',
                                type: 'math-field',
                                config: {
                                    band: 'C',
                                    keyboard: 'fractions-y5',
                                    expect: 'fraction',
                                    placeholder: '\\frac{?}{?}',
                                },
                            },
                        ],
                        evaluate(values) {
                            if (MCS.input.isEmpty(values.ans)) return false;
                            return MCS.input.check(values.ans, {
                                equals: selected.ratio,
                                form: 'any',
                                tolerance: 1e-9,
                            });
                        },
                        hint: {
                            text: `<p>Write the percentage as a fraction over 100, then simplify: ${selected.pct}% = ${selected.pct}/100. Divide the numerator and denominator by their greatest common divisor.</p>`,
                            highlight: ['display'],
                        },
                        solution: {
                            text: `Writing as a fraction: ${selected.pct}/100. Simplifying it gives ${selected.frac}.`,
                            show: null,
                        },
                        points: 10,
                    };
                } else {
                    const decVal = parseFloat((Math.floor(Math.random() * 95) + 5) / 100).toFixed(2);
                    const pctVal = Math.round(decVal * 100);

                    return {
                        descriptor: 'AC9M5N04',
                        context: 'decimal-to-percent',
                        category: 'number',
                        type: 'percentage-converter',
                        title: `Convert the decimal ${decVal} to a percentage:`,
                        widgets: [
                            {
                                id: 'display',
                                type: 'legacy-passthrough',
                                config: {
                                    render: (container) => {
                                        container.innerHTML = `
                                            <div class="flex-col align-center gap-8">
                                                <div style="font-size:2.5rem; font-weight:700; color:var(--primary);">${decVal}</div>
                                                <p style="font-size:0.8rem; color:var(--outline);">Enter a whole-number percentage below (with or without %).</p>
                                            </div>
                                        `;
                                    },
                                },
                            },
                        ],
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
                                equals: pctVal,
                                form: 'any',
                            });
                        },
                        hint: {
                            text: `<p>To convert a decimal to a percentage, multiply by 100 (which shifts the decimal point two places to the right): e.g. ${decVal} × 100 = ${pctVal}%.</p>`,
                            highlight: ['display'],
                        },
                        solution: {
                            text: `Decimal ${decVal} multiplied by 100 is exactly ${pctVal}%.`,
                            show: { ans: { latex: String(pctVal) } },
                        },
                        points: 10,
                    };
                }
            } else if (chosenType === 'multiplication') {
                // legacy-keep: written algorithm — no widget benefit (Phase 3 policy)
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
                    descriptor: 'AC9M5N06',
                    context: Math.random() > 0.5 ? 'multiplication-grid' : 'multiplication-algorithm',
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
                // legacy-keep: written algorithm — no widget benefit (Phase 3 policy)
                const B = Math.floor(Math.random() * 6) + 4; // divisor: 4 to 9
                const Q = Math.floor(Math.random() * 80) + 12; // quotient: 12 to 91
                const R = Math.floor(Math.random() * (B - 1)) + 1; // remainder: 1 to B-1
                const A = Q * B + R;

                return {
                    category: 'number',
                    descriptor: 'AC9M5N07',
                    context: Math.random() > 0.5 ? 'remainder-decimal-forms' : 'remainder-algorithms',
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
                        let userFrac = null;
                        const fracParts = userFracStr.split('/');
                        if (fracParts.length === 2) {
                            const fracNum = parseInt(fracParts[0], 10);
                            const fracDen = parseInt(fracParts[1], 10);
                            if (!isNaN(fracNum) && !isNaN(fracDen) && fracDen !== 0) {
                                userFrac = fracNum / fracDen;
                            }
                        }

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
                const fracContext = Math.random() > 0.5 ? 'mixed-numeral-lines' : 'common-denominators';
                function fracGcd(a, b) {
                    while (b) {
                        const t = b;
                        b = a % b;
                        a = t;
                    }
                    return a || 1;
                }
                function fracLcm(a, b) {
                    return Math.abs(a * b) / fracGcd(a, b);
                }
                const lineDenom = selected.reduce((acc, f) => fracLcm(acc, f.den), 1);
                const snapStep = 1 / lineDenom;
                const linePoints = shuffled.map((f, i) => ({
                    id: 'p' + i,
                    label: f.label,
                    value: Math.round((f.num * lineDenom) / f.den) / lineDenom,
                }));
                const solutionPlacements = Object.fromEntries(
                    linePoints.map((p) => [p.id, p.value])
                );

                return {
                    descriptor: 'AC9M5N03',
                    context: fracContext,
                    category: 'number',
                    type: 'fraction-ordering',
                    title: 'Order the fractions and mixed numerals from smallest to largest:',
                    prompt: 'Drag each labelled pin to its correct position on the number line (0 to 2).',
                    widgets: [
                        {
                            id: 'line',
                            type: 'number-line',
                            config: {
                                mode: 'order-points',
                                band: 'C',
                                min: 0,
                                max: 2,
                                snapStep,
                                fractionDenominator: lineDenom,
                                ticks: { major: 1, minor: snapStep, labels: 'major' },
                                points: linePoints,
                            },
                        },
                    ],
                    inputs: [],
                    evaluate(values) {
                        const placements = values.line;
                        if (!placements) return false;
                        return linePoints.every((p) => {
                            const placed = placements[p.id];
                            return placed != null && Math.abs(placed - p.value) < snapStep / 2 - 1e-9;
                        });
                    },
                    hint: {
                        text: `
                            <p>To order fractions, convert them to a common denominator or convert them to decimals:</p>
                            <p style="margin-top:8px;">${shuffled.map((f) => `${f.label} ≈ ${f.val.toFixed(2)}`).join(' · ')}</p>
                        `,
                        highlight: ['line'],
                    },
                    solution: {
                        text: `Converting to decimals: ${sorted.map(s => `${s.label} ≈ ${s.val.toFixed(2)}`).join(', ')}. Sorted: ${sorted.map(s => s.label).join(' < ')}.`,
                        show: { line: solutionPlacements },
                    },
                    points: 10,
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

                const fracContext = Math.random() > 0.5 ? 'fractional-sums' : 'fraction-bar-addition';

                return {
                    descriptor: 'AC9M5N05',
                    context: fracContext,
                    category: 'number',
                    type: 'fraction-addition',
                    title: 'Solve the fraction calculation:',
                    widgets: [
                        {
                            id: 'display',
                            type: 'legacy-passthrough',
                            config: {
                                render: (container) => {
                                    container.innerHTML = `
                                        <div class="flex-col align-center gap-8">
                                            <div class="mcs-fraction-add-prompt">
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
                                                <span class="mcs-fraction-add-eq">=</span>
                                            </div>
                                            <p style="font-size:0.75rem; color:var(--outline); text-align:center; max-width:420px;">
                                                Type your answer as a fraction or mixed numeral. Equivalent fractions are accepted.
                                            </p>
                                        </div>
                                    `;
                                },
                            },
                        },
                    ],
                    inputs: [
                        {
                            id: 'ans',
                            type: 'math-field',
                            config: {
                                band: 'C',
                                keyboard: 'fractions-y5',
                                expect: 'fraction',
                                placeholder: '\\frac{?}{?}',
                            },
                        },
                    ],
                    evaluate(v) {
                        if (typeof MCS !== 'undefined' && MCS.input && MCS.input.isEmpty(v.ans)) {
                            return false;
                        }
                        return MCS.input.check(v.ans, {
                            equals: correctVal,
                            form: 'any',
                            tolerance: 1e-9,
                        });
                    },
                    hint: {
                        text: `
                            <p>To add or subtract fractions, they must have a <strong>common denominator</strong>.</p>
                            <p style="margin-top:4px;">1. Find the Lowest Common Denominator (LCD).</p>
                            <p>2. Convert each fraction to have the LCD.</p>
                            <p>3. Perform the addition or subtraction on the numerators.</p>
                        `,
                        highlight: [],
                    },
                    solution: {
                        text: `Step-by-step: Convert fractions to common denominator. ${numA}/${denA} ${op} ${numB}/${denB} = ${correctVal.toFixed(2)} (or equivalent fraction).`,
                        show: null,
                    },
                    points: 10,
                    _correctVal: correctVal,
                };
            } else if (chosenType === 'estimation-check') {
                // legacy-keep: reasonableness check — reading comprehension, no manipulative gain (Phase 3 policy)
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
                    descriptor: 'AC9M5N08',
                    context: variant === 'financial' ? 'budget-estimation' : 'rounding-checks',
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
                // legacy-keep: word scenario — reading comprehension, no manipulative gain (Phase 3 policy)
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
                                context: 'multiplicative-word-scenarios',
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
                                context: 'additive-word-scenarios',
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
                                context: 'multiplicative-word-scenarios',
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
                                context: 'additive-word-scenarios',
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
                                context: 'multiplicative-word-scenarios',
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
                                context: 'additive-word-scenarios',
                                working: `Exact fraction = ${guests} ÷ ${seatsPerTable} = ${(guests / seatsPerTable).toFixed(2)}. Since you cannot have a fraction of a table, you must round up to the nearest whole table: ${ans} tables.`
                            };
                        }
                    }
                ];
                const chosenScenario = scenarios[Math.floor(Math.random() * scenarios.length)].generate();

                return {
                    category: 'number',
                    descriptor: 'AC9M5N09',
                    context: chosenScenario.context,
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
                // legacy-keep: flowchart / divisor checker — symbolic recall (Phase 3 policy)
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
                    descriptor: 'AC9M5N10',
                    context: Math.random() > 0.5 ? 'flowchart-loops' : 'divisor-checkers',
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
            const subTypes = ['fact-families', 'find-unknown', 'balance-scale-unknowns', 'applied-unknown-mass', 'balanced-equation-sort'];
            const chosenType = subTypes[Math.floor(Math.random() * subTypes.length)];

            if (chosenType === 'fact-families') {
                // legacy-keep: fact-family recall speed — optional visual hint only (Phase 3 policy)
                const a = Math.floor(Math.random() * 8) + 4; // 4 to 11
                const b = Math.floor(Math.random() * 8) + 4; // 4 to 11
                if (a === b) return generators.algebra(); // prevent squares for fact families
                const c = a * b;

                return {
                    category: 'algebra',
                    descriptor: 'AC9M5A01',
                    context: Math.random() > 0.5 ? 'fact-families-multiplication' : 'fact-families-division',
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
            } else if (chosenType === 'find-unknown') {
                const type = Math.floor(Math.random() * 4);
                const a = Math.floor(Math.random() * 9) + 4; // 4 to 12
                const ans = Math.floor(Math.random() * 9) + 3; // 3 to 11
                const b = a * ans;
                const correctAns = type === 2 ? b : ans;
                const isMult = type === 0 || type === 1;
                const unknownContext = isMult ? 'unknown-multiplication' : 'unknown-division';

                let eqText = '';
                if (type === 0) {
                    eqText = `□ × ${a} = ${b}`;
                } else if (type === 1) {
                    eqText = `${a} × □ = ${b}`;
                } else if (type === 2) {
                    eqText = `□ ÷ ${a} = ${ans}`;
                } else {
                    eqText = `${b} ÷ □ = ${a}`;
                }

                return {
                    descriptor: 'AC9M5A02',
                    context: unknownContext,
                    category: 'algebra',
                    type: 'find-unknown',
                    title: 'Solve for the unknown value:',
                    widgets: [
                        {
                            id: 'display',
                            type: 'legacy-passthrough',
                            config: {
                                render: (container) => {
                                    container.innerHTML = `
                                        <div class="flex-col align-center gap-8">
                                            <div class="mcs-unknown-equation" style="font-size:2.2rem; font-weight:700; color:var(--primary); text-align:center;">
                                                ${eqText.replace('□', '<span class="mcs-unknown-box" aria-hidden="true">□</span>')}
                                            </div>
                                            <p style="font-size:0.75rem; color:var(--outline);">Enter the value that belongs in the box.</p>
                                        </div>
                                    `;
                                },
                            },
                        },
                    ],
                    inputs: [
                        {
                            id: 'ans',
                            type: 'math-field',
                            config: {
                                band: 'C',
                                keyboard: 'integers',
                                expect: 'integer',
                                placeholder: '?',
                                ariaLabel: 'Unknown value',
                            },
                        },
                    ],
                    evaluate(values) {
                        if (MCS.input.isEmpty(values.ans)) return false;
                        return MCS.input.check(values.ans, {
                            equals: correctAns,
                            form: 'any',
                        });
                    },
                    hint: {
                        text: `
                            <p>Use the inverse operation to solve for the unknown box:</p>
                            <ul>
                                <li>The inverse of multiplication is division. If <strong>□ × ${a} = ${b}</strong>, then <strong>□ = ${b} ÷ ${a}</strong>.</li>
                                <li>The inverse of division is multiplication. If <strong>□ ÷ ${a} = ${ans}</strong>, then <strong>□ = ${ans} × ${a}</strong>.</li>
                            </ul>
                        `,
                        highlight: [],
                    },
                    solution: {
                        text: `Working out: ${type === 2 ? `${ans} × ${a} = ${b}` : `${b} ÷ ${a} = ${ans}`}. The unknown value is ${correctAns}.`,
                        show: { ans: { latex: String(correctAns) } },
                    },
                    points: 10,
                };
            } else if (chosenType === 'balance-scale-unknowns') {
                const ans = Math.floor(Math.random() * 8) + 3;
                const leftU = Math.floor(Math.random() * 5) + 1;
                const rightU = ans + leftU;

                return {
                    descriptor: 'AC9M5A02',
                    context: 'balance-scale-unknowns',
                    category: 'algebra',
                    title: 'Find the unknown mass:',
                    prompt: 'The scale is balanced. What is the value of the unknown mass?',
                    widgets: [
                        {
                            id: 'scale',
                            type: 'balance-scale',
                            config: {
                                mode: 'solve-unknown',
                                band: 'C',
                                unknownSide: 'left',
                                unknownLabel: 'x',
                                leftUnits: leftU,
                                rightUnits: rightU,
                                unknownValue: ans
                            }
                        }
                    ],
                    inputs: [
                        {
                            id: 'ans',
                            type: 'math-field',
                            config: {
                                band: 'C',
                                keyboard: 'integers',
                                expect: 'integer',
                                placeholder: 'x = ?',
                                ariaLabel: 'Unknown value'
                            }
                        }
                    ],
                    evaluate(values) {
                        if (MCS.input.isEmpty(values.ans)) return false;
                        return MCS.input.check(values.ans, { equals: ans, form: 'any' });
                    },
                    hint: {
                        text: `<p>The scale is balanced, which means both sides have the same total mass.</p><p>The right side has ${rightU}. The left side has a mystery box (x) and ${leftU}.</p><p>To find x, you can subtract ${leftU} from both sides.</p>`,
                        highlight: ['scale']
                    },
                    solution: {
                        text: `The unknown mass is ${ans}.`,
                        show: { ans: { latex: String(ans) } }
                    },
                    points: 10
                };
            } else if (chosenType === 'applied-unknown-mass') {
                const ans = Math.floor(Math.random() * 10) + 5;
                const leftU = Math.floor(Math.random() * 8) + 2;
                const rightU = ans + leftU;

                return {
                    descriptor: 'AC9M5A02',
                    context: 'applied-unknown-mass',
                    category: 'algebra',
                    title: 'Balancing Cargo',
                    prompt: `A mystery cargo box and ${leftU} kg are balanced with ${rightU} kg on the other side. What is the mass of the mystery box?`,
                    widgets: [
                        {
                            id: 'scale',
                            type: 'balance-scale',
                            config: {
                                mode: 'solve-unknown',
                                band: 'C',
                                unknownSide: 'left',
                                unknownLabel: '?',
                                leftUnits: leftU,
                                rightUnits: rightU,
                                unknownValue: ans
                            }
                        }
                    ],
                    inputs: [
                        {
                            id: 'ans',
                            type: 'math-field',
                            config: {
                                band: 'C',
                                keyboard: 'integers',
                                expect: 'integer',
                                placeholder: '?',
                                ariaLabel: 'Unknown mass'
                            }
                        }
                    ],
                    evaluate(values) {
                        if (MCS.input.isEmpty(values.ans)) return false;
                        return MCS.input.check(values.ans, { equals: ans, form: 'any' });
                    },
                    hint: {
                        text: `<p>Think of it as an equation: ? + ${leftU} = ${rightU}.</p><p>Subtract ${leftU} from the total mass of ${rightU} kg to find the mystery box.</p>`,
                        highlight: ['scale']
                    },
                    solution: {
                        text: `The mass of the mystery box is ${ans} kg.`,
                        show: { ans: { latex: String(ans) } }
                    },
                    points: 10
                };
            } else if (chosenType === 'balanced-equation-sort') {
                const generateCard = (isBalanced, id) => {
                    const type = Math.floor(Math.random() * 3);
                    if (type === 0) {
                        const a = Math.floor(Math.random() * 6) + 3;
                        const b = Math.floor(Math.random() * 6) + 3;
                        const correct = a * b;
                        const shown = isBalanced ? correct : (correct + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 2) + 1));
                        return { id: id, text: `${a} × ${b} = ${shown}`, expected: isBalanced ? 'balanced' : 'unbalanced' };
                    } else if (type === 1) {
                        const b = Math.floor(Math.random() * 5) + 3;
                        const c = Math.floor(Math.random() * 6) + 3;
                        const a = b * c;
                        const shown = isBalanced ? c : (c + (Math.random() > 0.5 ? 1 : -1));
                        return { id: id, text: `${a} ÷ ${b} = ${shown}`, expected: isBalanced ? 'balanced' : 'unbalanced' };
                    } else {
                        const c = Math.floor(Math.random() * 4) + 2;
                        const d = Math.floor(Math.random() * 4) + 3;
                        const prod = c * d;
                        const a = Math.floor(Math.random() * (prod - 2)) + 1;
                        const correctB = prod - a;
                        const shownB = isBalanced ? correctB : (correctB + (Math.random() > 0.5 ? 1 : -1));
                        return { id: id, text: `${a} + ${shownB} = ${c} × ${d}`, expected: isBalanced ? 'balanced' : 'unbalanced' };
                    }
                };

                const cards = [generateCard(true, 'c-1'), generateCard(true, 'c-2'), generateCard(false, 'c-3'), generateCard(false, 'c-4')];
                for (let i = cards.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [cards[i], cards[j]] = [cards[j], cards[i]];
                }

                return {
                    descriptor: 'AC9M5A02',
                    context: 'balanced-equation-sort',
                    category: 'algebra',
                    title: 'Evaluate the equations',
                    prompt: 'Identify which equations are true (balanced) and which are false (unbalanced).',
                    widgets: [],
                    inputs: cards.map(c => ({
                        id: c.id,
                        type: 'select-input',
                        config: {
                            label: c.text,
                            options: [
                                { value: '', label: '-- Select --' },
                                { value: 'balanced', label: 'Balanced' },
                                { value: 'unbalanced', label: 'Unbalanced' }
                            ],
                            width: '140px'
                        }
                    })),
                    evaluate(values) {
                        return cards.every(c => values[c.id] === c.expected);
                    },
                    hint: {
                        text: '<p>Calculate the value of each side of the equation. If both sides are equal, the equation is balanced. If they are not equal, it is unbalanced.</p>',
                        highlight: cards.map(c => c.id)
                    },
                    solution: {
                        text: 'The equations have been evaluated correctly.',
                        show: cards.reduce((acc, c) => {
                            acc[c.id] = c.expected;
                            return acc;
                        }, {})
                    },
                    points: 10
                };
            }
        },

        measurement: () => {
            function angleSvg(angleDeg, showProtractor = false) {
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

            const subTypes = ['perimeter-area', 'time-conversion', 'unit-selector', 'angle-estimator'];
            const chosenType = subTypes[Math.floor(Math.random() * subTypes.length)];

            if (chosenType === 'perimeter-area') {
                const W = Math.floor(Math.random() * 5) + 8;
                const H = Math.floor(Math.random() * 5) + 8;
                const w = Math.floor(Math.random() * 3) + 3;
                const h = Math.floor(Math.random() * 3) + 3;
                const topW = W - w;
                const rightH = H - h;
                const perimeter = 2 * (W + H);
                const area = W * H - w * h;
                const context = Math.random() < 0.5 ? 'irregular-perimeter' : 'irregular-area';

                return {
                    descriptor: 'AC9M5M02',
                    context,
                    category: 'measurement',
                    title: 'Compound L-shape — perimeter & area',
                    prompt:
                        context === 'irregular-perimeter'
                            ? 'Calculate the **perimeter** and area of the compound shape below. Side lengths are in metres — find the missing lengths marked **?** first.'
                            : 'Calculate the perimeter and **area** of the compound shape below. Side lengths are in metres — find the missing lengths marked **?** first.',
                    widgets: [
                        {
                            id: 'shape',
                            type: 'shape-measurer',
                            config: {
                                band: 'C',
                                mode: 'missing-sides',
                                width: W,
                                height: H,
                                cutWidth: w,
                                cutHeight: h,
                                unit: 'm',
                            },
                        },
                    ],
                    inputs: [
                        {
                            id: 'perim',
                            type: 'number-input',
                            config: { label: 'Perimeter (m):', placeholder: '?' },
                        },
                        {
                            id: 'area',
                            type: 'number-input',
                            config: { label: 'Area (m²):', placeholder: '?' },
                        },
                    ],
                    evaluate(values) {
                        return values.perim === perimeter && values.area === area;
                    },
                    hint: {
                        text: `<p>1. Find the unknown side lengths first. Total width is ${W} m, so the top edge is ${W} − ${w} = **${topW} m**.</p><p>2. Total height is ${H} m, so the upper-right vertical edge is ${H} − ${h} = **${rightH} m**.</p><p>3. **Perimeter** — add all 6 side lengths.</p><p>4. **Area** — subtract the cut-out (${w} × ${h}) from the bounding rectangle (${W} × ${H}).</p>`,
                        highlight: ['shape'],
                    },
                    solution: {
                        text: `Missing sides: top = ${topW} m, upper-right = ${rightH} m. Perimeter = ${W} + ${H} + ${w} + ${h} + ${topW} + ${rightH} = ${perimeter} m. Area = (${W} × ${H}) − (${w} × ${h}) = ${W * H} − ${w * h} = ${area} m².`,
                        show: { shape: { revealLabels: true, highlightEdges: true } },
                    },
                    points: 10,
                };
            } else if (chosenType === 'time-conversion') {
                // legacy-keep: symbolic 12h↔24h conversion — clock widget is stretch (Phase 3 policy)
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
                    descriptor: 'AC9M5M03',
                    context: to24Hour ? 'time-conversion-12-to-24' : 'time-conversion-24-to-12',
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
                // legacy-keep: unit MCQ — no spatial widget benefit (Phase 3 policy)
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
                    descriptor: 'AC9M5M01',
                    context: Math.random() > 0.5 ? 'unit-comparison' : 'unit-matching',
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
                // legacy-keep: inline SVG + MCQ — protractor widget deferred to Phase 3c (Phase 3 policy)
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
                    descriptor: 'AC9M5M04',
                    context: variant === 'estimate' ? 'angle-protractor-reads' : 'angle-estimation',
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
                            ${angleSvg(theta, true)}
                        </div>
                    `,
                    solutionText: `The angle is exactly <strong>${theta}°</strong>, which is classified as a <strong>${correctClassification.toUpperCase()}</strong> angle.`,
                    renderFunc: (container) => {
                        const renderUI = () => {
                            if (variant === 'classify') {
                                container.innerHTML = `
                                    <div class="flex-col align-center gap-12" style="width:100%;">
                                        <div style="max-width:260px; width:100%;">
                                            ${angleSvg(theta, false)}
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
                                            ${angleSvg(theta, false)}
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

                return {
                    descriptor: 'AC9M5SP02',
                    context: 'read-coordinate',
                    category: 'space',
                    title: 'Identify the coordinates of the target point on the grid:',
                    prompt: 'What are the coordinates of the **target point T**?',
                    widgets: [
                        {
                            id: 'grid',
                            type: 'coordinate-plotter',
                            config: y5Q1GridConfig({
                                mode: 'read-point',
                                markers: [{ x: targetPt.x, y: targetPt.y, label: 'T' }],
                                draggable: false,
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
                            values.coords.x === targetPt.x &&
                            values.coords.y === targetPt.y
                        );
                    },
                    hint: {
                        text: `<p>Trace vertically down from **T** to the x-axis → x = ${targetPt.x}.</p><p>Trace horizontally left to the y-axis → y = ${targetPt.y}.</p><p>Write as **(${targetPt.x}, ${targetPt.y})**.</p>`,
                        highlight: ['grid'],
                    },
                    solution: {
                        text: `The target point aligns with x = ${targetPt.x} and y = ${targetPt.y}. Coordinates: (${targetPt.x}, ${targetPt.y}).`,
                        show: { grid: { x: targetPt.x, y: targetPt.y } },
                    },
                    points: 10,
                };
            } else if (chosenType === 'movement') {
                const startPt = {
                    x: Math.floor(Math.random() * 7) + 2,
                    y: Math.floor(Math.random() * 7) + 2
                };

                let dx = 0;
                let dy = 0;
                while (dx === 0 && dy === 0) {
                    dx = Math.floor(Math.random() * 5) - 2;
                    dy = Math.floor(Math.random() * 5) - 2;
                }

                const endX = startPt.x + dx;
                const endY = startPt.y + dy;
                const dirX = dx >= 0 ? 'right' : 'left';
                const dirY = dy >= 0 ? 'up' : 'down';

                return {
                    descriptor: 'AC9M5SP03',
                    context: 'vector-transformations',
                    category: 'space',
                    title: 'Trace the translation movement vector:',
                    prompt: `Start at **A (${startPt.x}, ${startPt.y})**. Move **${Math.abs(dx)} units ${dirX}** and **${Math.abs(dy)} units ${dirY}**. Drag the pin to the landing point.`,
                    widgets: [
                        {
                            id: 'grid',
                            type: 'coordinate-plotter',
                            config: y5Q1GridConfig({
                                mode: 'path',
                                markers: [{ x: startPt.x, y: startPt.y, label: 'A' }],
                                initialX: startPt.x,
                                initialY: startPt.y,
                            }),
                        },
                    ],
                    inputs: [],
                    evaluate(values) {
                        return values.grid && values.grid.x === endX && values.grid.y === endY;
                    },
                    hint: {
                        text: `<p>Start at **(${startPt.x}, ${startPt.y})**.</p><ul><li>Move horizontally: **${Math.abs(dx)} units ${dirX}**.</li><li>Move vertically: **${Math.abs(dy)} units ${dirY}**.</li></ul>`,
                        highlight: ['grid'],
                    },
                    solution: {
                        text: `Landing point: x = ${startPt.x} + (${dx}) = ${endX}; y = ${startPt.y} + (${dy}) = ${endY}. Coordinates: (${endX}, ${endY}).`,
                        show: { grid: { x: endX, y: endY } },
                    },
                    points: 10,
                };
            } else if (chosenType === 'distance') {
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
                    descriptor: 'AC9M5SP02',
                    context: 'distance-manhattan',
                    category: 'space',
                    title: 'Calculate Manhattan grid distance:',
                    prompt: `Find the grid distance along grid lines from **A (${startPt.x}, ${startPt.y})** to **B (${endPt.x}, ${endPt.y})**. Tap intersections to trace the path, or type the total distance.`,
                    widgets: [
                        {
                            id: 'grid',
                            type: 'coordinate-plotter',
                            config: y5Q1GridConfig({
                                mode: 'manhattan',
                                markers: [
                                    { x: startPt.x, y: startPt.y, label: 'A' },
                                    { x: endPt.x, y: endPt.y, label: 'B', color: 'secondary' },
                                ],
                            }),
                        },
                    ],
                    inputs: [
                        {
                            id: 'ans',
                            type: 'number-input',
                            config: { label: 'Distance (units):', placeholder: '?' },
                        },
                    ],
                    evaluate(values) {
                        return values.ans === dist;
                    },
                    hint: {
                        text: `<p>Manhattan distance = horizontal steps + vertical steps.</p><p>|${startPt.x} − ${endPt.x}| + |${startPt.y} − ${endPt.y}|</p>`,
                        highlight: ['grid'],
                    },
                    solution: {
                        text: `Horizontal distance = ${Math.abs(startPt.x - endPt.x)} units. Vertical distance = ${Math.abs(startPt.y - endPt.y)} units. Total = ${dist} units.`,
                        show: { grid: { from: startPt, to: endPt } },
                    },
                    points: 10,
                };
            } else if (chosenType === 'net-matcher') {
                // legacy-keep: net folding click task already interactive — net-folder is Phase 3 stretch (Phase 3 policy)
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
                    descriptor: 'AC9M5SP01',
                    context: Math.random() > 0.5 ? '3d-structure-maps' : 'net-folding',
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
                let prompt = '';
                let hintText = '';
                let solutionText = '';
                let boardConfig = y5Q1GridConfig({ preImage: [] });

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
                        prompt = 'Reflect the blue triangle across the vertical mirror line **x = 5**. Plot the 3 reflected vertices P₁\', P₂\', P₃\' on the grid.';
                        hintText = `<p>To reflect across a vertical mirror line (x=5):</p><ul><li>The y-coordinate stays the same for each point.</li><li>The x-coordinate mirrors across the line: a point 3 units left of x = 5 lands 3 units right (x = 8).</li></ul>`;
                        solutionText = `Mirroring across x=5: P₁(${originalVertices[0].x},${originalVertices[0].y}) ➔ P₁'(${correctVertices[0].x},${correctVertices[0].y}), P₂(${originalVertices[1].x},${originalVertices[1].y}) ➔ P₂'(${correctVertices[1].x},${correctVertices[1].y}), P₃(${originalVertices[2].x},${originalVertices[2].y}) ➔ P₃'(${correctVertices[2].x},${correctVertices[2].y}).`;
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
                        prompt = 'Reflect the blue triangle across the horizontal mirror line **y = 5**. Plot the 3 reflected vertices P₁\', P₂\', P₃\' on the grid.';
                        hintText = `<p>To reflect across a horizontal mirror line (y=5):</p><ul><li>The x-coordinate stays the same for each point.</li><li>The y-coordinate mirrors across the line: a point 4 units below y = 5 lands 4 units above (y = 9).</li></ul>`;
                        solutionText = `Mirroring across y=5: P₁(${originalVertices[0].x},${originalVertices[0].y}) ➔ P₁'(${correctVertices[0].x},${correctVertices[0].y}), P₂(${originalVertices[1].x},${originalVertices[1].y}) ➔ P₂'(${correctVertices[1].x},${correctVertices[1].y}), P₃(${originalVertices[2].x},${originalVertices[2].y}) ➔ P₃'(${correctVertices[2].x},${correctVertices[2].y}).`;
                    }

                    boardConfig = y5Q1GridConfig({
                        mode: 'reflect',
                        preImage: originalVertices,
                        mirrorLine: { axis, value },
                    });
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
                        prompt = 'Rotate the blue triangle **90° clockwise** about center point **C(5, 5)**. Plot the 3 rotated vertices on the grid.';
                        hintText = `<p>To rotate a point 90° clockwise about C(5, 5):</p><ul><li>Find the offset from the center: dx = x − 5, dy = y − 5.</li><li>The new coordinates are: x' = 5 + dy, y' = 5 − dx.</li></ul>`;
                    } else if (angle === 180) {
                        correctVertices = originalVertices.map(v => ({
                            x: 10 - v.x,
                            y: 10 - v.y
                        }));
                        prompt = 'Rotate the blue triangle **180°** about center point **C(5, 5)**. Plot the 3 rotated vertices on the grid.';
                        hintText = `<p>To rotate a point 180° about C(5, 5):</p><ul><li>The coordinates mirror through the center: x' = 10 − x, y' = 10 − y.</li></ul>`;
                    } else {
                        correctVertices = originalVertices.map(v => ({
                            x: cx - (v.y - cy),
                            y: cy + (v.x - cx)
                        }));
                        prompt = 'Rotate the blue triangle **90° counter-clockwise** about center point **C(5, 5)**. Plot the 3 rotated vertices on the grid.';
                        hintText = `<p>To rotate a point 90° counter-clockwise about C(5, 5):</p><ul><li>Find the offset from the center: dx = x − 5, dy = y − 5.</li><li>The new coordinates are: x' = 5 − dy, y' = 5 + dx.</li></ul>`;
                    }
                    solutionText = `Rotating ${angle === 270 ? '90° CCW' : angle + '°'} about C(5,5): P₁(${originalVertices[0].x},${originalVertices[0].y}) ➔ P₁'(${correctVertices[0].x},${correctVertices[0].y}), P₂(${originalVertices[1].x},${originalVertices[1].y}) ➔ P₂'(${correctVertices[1].x},${correctVertices[1].y}), P₃(${originalVertices[2].x},${originalVertices[2].y}) ➔ P₃'(${correctVertices[2].x},${correctVertices[2].y}).`;

                    boardConfig = y5Q1GridConfig({
                        mode: 'rotate',
                        preImage: originalVertices,
                        rotation: {
                            center: { x: cx, y: cy },
                            angle,
                            direction: angle === 90 ? 'cw' : angle === 270 ? 'ccw' : '180',
                        },
                    });
                }

                return {
                    descriptor: 'AC9M5SP03',
                    context: 'vector-reflection',
                    category: 'space',
                    title: 'Transformation on the coordinate grid:',
                    prompt,
                    widgets: [
                        {
                            id: 'board',
                            type: 'transform-board',
                            config: boardConfig,
                        },
                    ],
                    inputs: [],
                    evaluate(values) {
                        return verticesMatchSet(values.board && values.board.vertices, correctVertices);
                    },
                    hint: {
                        text: hintText,
                        highlight: ['board'],
                    },
                    solution: {
                        text: solutionText,
                        show: { board: { vertices: correctVertices } },
                    },
                    points: 10,
                };
            }
        },

        statistics: () => {
            const daysData = buildSevenDaySeries();
            const graphTitle = 'Station Water Core Reserves (kL)';
            const graphWidgetBase = {
                id: 'graph',
                type: 'line-graph',
                config: {
                    band: 'C',
                    title: graphTitle,
                    values: daysData,
                    yLabel: 'kL',
                    scaleInterval: 20,
                },
            };

            const subTypes = ['read-value', 'max-min', 'biggest-increase', 'data-display', 'investigation-planner'];
            const chosenType = subTypes[Math.floor(Math.random() * subTypes.length)];

            if (chosenType === 'read-value') {
                const D = Math.floor(Math.random() * 7) + 1;
                const targetVal = daysData[D - 1];

                return {
                    descriptor: 'AC9M5ST02',
                    context: 'read-value',
                    category: 'statistics',
                    title: 'Extract data values from line graphs:',
                    prompt: `What was the water core reserves level recorded on **Day ${D}**?`,
                    widgets: [
                        Object.assign({}, graphWidgetBase, {
                            config: Object.assign({}, graphWidgetBase.config, { mode: 'read' }),
                        }),
                    ],
                    inputs: [
                        {
                            id: 'ans',
                            type: 'number-input',
                            config: { label: 'Answer (kL):', placeholder: '?' },
                        },
                    ],
                    evaluate(values) {
                        return values.ans === targetVal;
                    },
                    hint: {
                        text: `<p>Locate <strong>Day ${D}</strong> on the horizontal axis.</p><p>Tap that point on the graph — the crosshair shows the value on the y-axis.</p>`,
                        highlight: ['graph'],
                    },
                    solution: {
                        text: `According to the line graph coordinates, the value plotted for Day ${D} is exactly ${targetVal} kL.`,
                        show: { graph: { pointIndex: D - 1 } },
                    },
                    points: 10,
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

                const targetDays = [];
                daysData.forEach((val, idx) => {
                    if (val === targetVal) targetDays.push(idx + 1);
                });

                return {
                    descriptor: 'AC9M5ST02',
                    context: 'max-min',
                    category: 'statistics',
                    title: 'Analyze and track trends on line graphs:',
                    prompt: `On which day did the reserves reach their **${findMax ? 'highest' : 'lowest'}** level?`,
                    widgets: [
                        Object.assign({}, graphWidgetBase, {
                            config: Object.assign({}, graphWidgetBase.config, { mode: 'read' }),
                        }),
                    ],
                    inputs: [
                        {
                            id: 'day',
                            type: 'select-input',
                            config: {
                                label: 'Day:',
                                options: daySelectOptions(),
                            },
                        },
                    ],
                    evaluate(values) {
                        return targetDays.some(function (d) {
                            return String(d) === String(values.day);
                        });
                    },
                    hint: {
                        text: `<p>Find the ${findMax ? 'peak (highest point)' : 'trough (lowest point)'} of the line graph.</p><p>Tap points to read values, then pick the correct day.</p>`,
                        highlight: ['graph'],
                    },
                    solution: {
                        text: `The ${findMax ? 'highest' : 'lowest'} value was ${targetVal} kL, which occurred on Day ${targetDays.join(' and Day ')}.`,
                        show: { graph: { pointIndex: targetDay - 1 } },
                    },
                    points: 10,
                };
            } else if (chosenType === 'biggest-increase') {
                let hasIncrease = false;
                for (let i = 1; i < 7; i++) {
                    if (daysData[i] > daysData[i - 1]) {
                        hasIncrease = true;
                        break;
                    }
                }
                if (!hasIncrease) {
                    daysData[3] = daysData[2] + 25;
                }

                let maxDiff = -999;
                let increaseStartDay = 1;

                for (let i = 1; i < 7; i++) {
                    const diff = daysData[i] - daysData[i - 1];
                    if (diff > maxDiff) {
                        maxDiff = diff;
                        increaseStartDay = i;
                    }
                }

                return {
                    descriptor: 'AC9M5ST02',
                    context: 'biggest-increase',
                    category: 'statistics',
                    title: 'Identify periods of fastest growth on line graphs:',
                    prompt: 'Between which two consecutive days did the water reserves **increase the most**? Tap the steepest rising segment on the graph.',
                    widgets: [
                        Object.assign({}, graphWidgetBase, {
                            config: Object.assign({}, graphWidgetBase.config, { mode: 'trend' }),
                        }),
                    ],
                    inputs: [],
                    evaluate(values) {
                        return values.graph && values.graph.segmentStart === increaseStartDay - 1;
                    },
                    hint: {
                        text: `<p>Look for the line segment that climbs upwards at the steepest angle from left to right.</p><p>Steepest increase rate = +${maxDiff} kL</p>`,
                        highlight: ['graph'],
                    },
                    solution: {
                        text: `The water reserves increased the most between Day ${increaseStartDay} (${daysData[increaseStartDay - 1]} kL) and Day ${increaseStartDay + 1} (${daysData[increaseStartDay]} kL), representing an increase of ${maxDiff} kL.`,
                        show: { graph: { segmentStart: increaseStartDay - 1 } },
                    },
                    points: 10,
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
                        frequencies.push(Math.floor(Math.random() * 11) + 2);
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
                const scaleInterval = Math.max(2, Math.ceil(Math.max(...frequencies) / 5));
                const chartWidget = {
                    id: 'chart',
                    type: 'column-graph',
                    config: {
                        mode: 'read',
                        band: 'C',
                        categories: topic.categories,
                        values: frequencies,
                        scaleInterval,
                    },
                };

                const variants = ['find-mode', 'difference', 'fraction'];
                const variant = variants[Math.floor(Math.random() * variants.length)];

                if (variant === 'find-mode') {
                    return {
                        descriptor: 'AC9M5ST01',
                        context: 'mode-highlight',
                        category: 'statistics',
                        type: 'data-display',
                        title: 'Identify the mode (most common category) from the bar chart:',
                        prompt: 'Based on the chart below, what is the **mode** (most popular category)?',
                        widgets: [chartWidget],
                        inputs: [
                            {
                                id: 'ans',
                                type: 'select-input',
                                config: {
                                    label: 'Mode:',
                                    options: [
                                        { value: '', label: '-' },
                                        ...topic.categories.map((cat) => ({ value: cat, label: cat })),
                                    ],
                                },
                            },
                        ],
                        evaluate(values) {
                            return values.ans === modeCategory;
                        },
                        hint: {
                            text: `
                                <p>The **mode** is the category with the highest frequency.</p>
                                <ul>
                                    <li>Look for the tallest bar in the chart.</li>
                                    <li>Find the label below that tallest bar.</li>
                                </ul>
                            `,
                            highlight: ['chart'],
                        },
                        solution: {
                            text: `The tallest bar in the chart is for the category **${modeCategory}** with a frequency of ${frequencies[maxIdx]}. Therefore, the mode is ${modeCategory}.`,
                            show: { chart: { selectedCategory: modeCategory } },
                        },
                        points: 10,
                    };
                }

                if (variant === 'difference') {
                    const idxA = Math.floor(Math.random() * topic.categories.length);
                    let idxB = Math.floor(Math.random() * topic.categories.length);
                    while (idxA === idxB) {
                        idxB = Math.floor(Math.random() * topic.categories.length);
                    }
                    const catA = topic.categories[idxA];
                    const catB = topic.categories[idxB];
                    const diff = Math.abs(frequencies[idxA] - frequencies[idxB]);
                    const higherCat = frequencies[idxA] >= frequencies[idxB] ? catA : catB;
                    const lowerCat = frequencies[idxA] >= frequencies[idxB] ? catB : catA;

                    return {
                        descriptor: 'AC9M5ST01',
                        context: 'highest-frequency-charts',
                        category: 'statistics',
                        type: 'data-display',
                        title: 'Calculate differences between data categories:',
                        prompt: `How many more ${topic.unit} preferred **${higherCat}** than **${lowerCat}**?`,
                        widgets: [chartWidget],
                        inputs: [
                            {
                                id: 'ans',
                                type: 'number-input',
                                config: { label: 'Difference:', placeholder: '?' },
                            },
                        ],
                        evaluate(values) {
                            return values.ans === diff;
                        },
                        hint: {
                            text: `
                                <p>To find the difference between two categories:</p>
                                <ul>
                                    <li>Read the value for <strong>${catA}</strong> (labeled at the top of its bar).</li>
                                    <li>Read the value for <strong>${catB}</strong>.</li>
                                    <li>Subtract the smaller value from the larger one: <strong>|${frequencies[idxA]} − ${frequencies[idxB]}|</strong>.</li>
                                </ul>
                            `,
                            highlight: ['chart'],
                        },
                        solution: {
                            text: `The frequency for ${catA} is ${frequencies[idxA]} and for ${catB} is ${frequencies[idxB]}. The difference is ${frequencies[idxA]} − ${frequencies[idxB]} = ${diff} ${topic.unit}.`,
                            show: { chart: { selectedCategory: higherCat } },
                        },
                        points: 10,
                    };
                }

                const idx = Math.floor(Math.random() * topic.categories.length);
                const cat = topic.categories[idx];
                const count = frequencies[idx];
                const fractionDecimal = count / totalStudents;

                return {
                    descriptor: 'AC9M5ST03',
                    context: 'data-display',
                    category: 'statistics',
                    type: 'data-display',
                    title: 'Express data categories as fractional parts:',
                    prompt: `What fraction of the total group of ${totalStudents} students chose **${cat}**? Express as a fraction (e.g. 5/30):`,
                    widgets: [chartWidget],
                    inputs: [
                        {
                            id: 'ans',
                            type: 'math-field',
                            config: {
                                band: 'C',
                                keyboard: 'fractions-y5',
                                expect: 'fraction',
                                placeholder: '\\frac{?}{?}',
                            },
                        },
                    ],
                    evaluate(v) {
                        if (typeof MCS !== 'undefined' && MCS.input && MCS.input.isEmpty(v.ans)) {
                            return false;
                        }
                        return MCS.input.check(v.ans, {
                            equals: fractionDecimal,
                            form: 'any',
                            tolerance: 0.001,
                        });
                    },
                    hint: {
                        text: `
                            <p>To write the fraction of students who chose ${cat}:</p>
                            <ul>
                                <li>Find the number of students who chose <strong>${cat}</strong> (${count}).</li>
                                <li>Find the total number of students in the survey: <strong>${frequencies.join(' + ')} = ${totalStudents}</strong>.</li>
                                <li>Write the fraction as: <strong>${count}/${totalStudents}</strong> (or simplify it if possible).</li>
                            </ul>
                        `,
                        highlight: ['chart'],
                    },
                    solution: {
                        text: `The number of students for ${cat} is ${count}. The total number of students is ${totalStudents}. The fraction is **${count}/${totalStudents}** (equivalent to ${(count / totalStudents).toFixed(3)}).`,
                        show: { chart: { selectedCategory: cat } },
                    },
                    points: 10,
                };
            } else if (chosenType === 'investigation-planner') {
                // legacy-keep: research planning MCQ — no spatial widget benefit (Phase 3 policy)
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
                    descriptor: 'AC9M5ST03',
                    context: 'investigation-planner',
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
                        const checked1 = document.querySelector('input[name="ip-q1"]:checked');
                        const checked2 = document.querySelector('input[name="ip-q2"]:checked');
                        const checked3 = document.querySelector('input[name="ip-q3"]:checked');
                        
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
                const scenario = pickAvoidingRepeat(
                    SAMPLE_SPACE_SCENARIOS,
                    state.lastDieOutcomesScenarioId
                );
                state.lastDieOutcomesScenarioId = scenario.id;
                const { targetOutcomes, allOptions, apparatus, prompt, hintLine } = scenario;

                return {
                    descriptor: 'AC9M5P01',
                    context: 'die-outcomes',
                    category: 'probability',
                    type: 'die-outcomes',
                    title: 'Identify all equally-likely sample space outcomes:',
                    prompt,
                    widgets: [
                        {
                            id: 'lab',
                            type: 'dice-coin-lab',
                            config: {
                                band: 'C',
                                mode: 'sample-space',
                                apparatus,
                                outcomes: targetOutcomes,
                                allOptions,
                            },
                        },
                    ],
                    inputs: [],
                    evaluate(values) {
                        const selected = (values.lab && values.lab.selected) || [];
                        if (selected.length !== targetOutcomes.length) return false;
                        return targetOutcomes.every((val) => selected.includes(String(val)));
                    },
                    hint: {
                        text: `
                            <p>The <strong>sample space</strong> lists all possible different results from a single trial.</p>
                            <ul>
                                <li>${hintLine}</li>
                            </ul>
                            <p style="font-size:0.75rem; color:var(--outline);">Tap chips to select; tap again to deselect.</p>
                        `,
                        highlight: ['lab'],
                    },
                    solution: {
                        text: `The list of all possible outcomes is: ${targetOutcomes.join(', ')}.`,
                        show: { lab: { selected: targetOutcomes } },
                    },
                    points: 10,
                };
            }

            if (chosenType === 'marble-likelihood') {
                const R = Math.floor(Math.random() * 7) + 2;
                const B = 10 - R;
                let answerKey = 'equal';
                if (R > B) answerKey = 'red';
                else if (B > R) answerKey = 'blue';

                return {
                    descriptor: 'AC9M5P01',
                    context: 'marble-likelihood',
                    category: 'probability',
                    type: 'marble-likelihood',
                    title: 'Compare outcome likelihoods for chance events:',
                    prompt: 'A marble is drawn at random from the bag below. Which event is most likely?',
                    widgets: [
                        {
                            id: 'bag',
                            type: 'marble-bag',
                            config: {
                                band: 'C',
                                mode: 'read-likelihood',
                                counts: { red: R, blue: B },
                            },
                        },
                    ],
                    inputs: [
                        {
                            id: 'choice',
                            type: 'select-input',
                            config: {
                                label: 'Most likely:',
                                width: '280px',
                                options: [
                                    { value: '', label: 'Choose…' },
                                    { value: 'red', label: 'More likely to draw a Red marble' },
                                    { value: 'blue', label: 'More likely to draw a Blue marble' },
                                    { value: 'equal', label: 'Equally likely to draw Red or Blue' },
                                ],
                            },
                        },
                    ],
                    evaluate(values) {
                        return values.choice === answerKey;
                    },
                    hint: {
                        text: `
                            <p>Compare the counts of each marble color in the bag:</p>
                            <ul>
                                <li>Red count: <strong>${R}</strong></li>
                                <li>Blue count: <strong>${B}</strong></li>
                            </ul>
                            <p style="margin-top:6px;">Whichever color has more marbles is <strong>more likely</strong> to be drawn.</p>
                        `,
                        highlight: ['bag'],
                    },
                    solution: {
                        text: `Since there are ${R} Red marbles and ${B} Blue marbles, drawing a ${
                            R === B
                                ? 'Red or Blue marble is equally'
                                : R > B
                                  ? 'Red marble is more'
                                  : 'Blue marble is more'
                        } likely.`,
                        show: { bag: {} },
                    },
                    points: 10,
                };
            }

            if (chosenType === 'chance-fraction') {
                const R = Math.floor(Math.random() * 3) + 1;
                const B = Math.floor(Math.random() * 3) + 2;
                const G = 10 - R - B;
                const targetRatio = B / 10;
                const simplified =
                    B === 2 ? '1/5' : B === 4 ? '2/5' : `${B}/10`;

                return {
                    descriptor: 'AC9M5P01',
                    context: 'chance-fraction',
                    category: 'probability',
                    type: 'chance-fraction',
                    title: 'Represent probability using fractional values:',
                    prompt:
                        'What is the probability of drawing a <strong>Blue</strong> marble from the bag below? Express it as a fraction (e.g. 3/10):',
                    widgets: [
                        {
                            id: 'bag',
                            type: 'marble-bag',
                            config: {
                                band: 'C',
                                mode: 'read',
                                counts: { red: R, blue: B, green: G },
                            },
                        },
                    ],
                    inputs: [
                        {
                            id: 'frac',
                            type: 'math-field',
                            config: {
                                band: 'C',
                                keyboard: 'fractions-y5',
                                expect: 'fraction',
                                placeholder: '\\frac{?}{?}',
                            },
                        },
                    ],
                    evaluate(values) {
                        if (MCS.input.isEmpty(values.frac)) return false;
                        return MCS.input.check(values.frac, {
                            equals: targetRatio,
                            form: 'any',
                            tolerance: 1e-9,
                        });
                    },
                    hint: {
                        text: `
                            <p>Probability as a fraction:</p>
                            <p style="font-size:1rem; font-weight:700; text-align:center; margin: 6px 0;">
                                P(Blue) = Blue Marbles / Total Marbles
                            </p>
                            <p>Count the Blue marbles and write it over 10.</p>
                        `,
                        highlight: ['bag'],
                    },
                    solution: {
                        text: `There are ${B} Blue marbles out of 10 total. The probability is ${B}/10 (simplifies to ${simplified}).`,
                        show: { bag: {} },
                    },
                    points: 10,
                };
            }

            const isCoin = Math.random() > 0.5;
            const outcomes = isCoin ? ['Heads', 'Tails'] : ['1', '2', '3', '4', '5', '6'];
            const targetOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
            const theoreticalProb = isCoin ? 0.5 : 1 / 6;
            const theoreticalProbText = isCoin ? '1/2' : '1/6';
            const apparatus = isCoin ? 'coin' : 'die';

            return {
                descriptor: 'AC9M5P02',
                context: Math.random() > 0.5 ? 'predicted-frequency' : 'chance-experiment',
                category: 'probability',
                type: 'chance-experiment',
                title: 'Conduct a chance simulation experiment and analyze results:',
                prompt: `Run a simulated trial of 20 ${isCoin ? 'coin flips' : 'rolls of a fair 6-sided die'}, then answer the questions below.`,
                widgets: [
                    {
                        id: 'lab',
                        type: 'dice-coin-lab',
                        config: {
                            band: 'C',
                            mode: 'experiment',
                            apparatus,
                            outcomes,
                            trialCount: 20,
                        },
                    },
                ],
                inputs: [
                    {
                        id: 'expProb',
                        type: 'math-field',
                        config: {
                            band: 'C',
                            keyboard: 'fractions-y5',
                            expect: 'fraction',
                            label: `Experimental P(${targetOutcome}):`,
                            placeholder: 'e.g. 9/20',
                        },
                    },
                    {
                        id: 'theoProb',
                        type: 'math-field',
                        config: {
                            band: 'C',
                            keyboard: 'fractions-y5',
                            expect: 'fraction',
                            label: `Theoretical P(${targetOutcome}):`,
                            placeholder: 'e.g. 1/2',
                        },
                    },
                    {
                        id: 'match',
                        type: 'select-input',
                        config: {
                            label: 'Did experimental and theoretical match?',
                            width: '120px',
                            options: [
                                { value: '', label: 'Choose…' },
                                { value: 'yes', label: 'Yes' },
                                { value: 'no', label: 'No' },
                            ],
                        },
                    },
                ],
                evaluate(values) {
                    if (!values.lab || !values.lab.trialsComplete) return false;
                    if (MCS.input.isEmpty(values.expProb) || MCS.input.isEmpty(values.theoProb)) {
                        return false;
                    }
                    if (!values.match) return false;

                    const targetFreq = values.lab.frequencies[targetOutcome] || 0;
                    const expectedExp = targetFreq / 20;
                    const correctComp =
                        Math.abs(expectedExp - theoreticalProb) < 0.001 ? 'yes' : 'no';

                    return (
                        MCS.input.check(values.expProb, {
                            equals: expectedExp,
                            form: 'any',
                            tolerance: 1e-9,
                        }) &&
                        MCS.input.check(values.theoProb, {
                            equals: theoreticalProb,
                            form: 'any',
                            tolerance: 1e-9,
                        }) &&
                        values.match === correctComp
                    );
                },
                hint: {
                    text: `
                        <p>To analyze the chance experiment results:</p>
                        <ul>
                            <li><strong>Experimental probability</strong> = count of <strong>${targetOutcome}</strong> ÷ 20.</li>
                            <li><strong>Theoretical probability</strong> = ${theoreticalProbText} for this apparatus.</li>
                            <li>Short samples often differ from theory due to random chance.</li>
                        </ul>
                    `,
                    highlight: ['lab'],
                },
                solution: {
                    text: '',
                    show: { lab: {} },
                },
                points: 10,
                requiresTrials: true,
                wireSession(session, ui) {
                    const lockInputs = () => {
                        ['expProb', 'theoProb', 'match'].forEach((id) => {
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
                        ['expProb', 'theoProb', 'match'].forEach((id) => {
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
                    const lab = session.instances.lab;
                    if (lab && typeof lab.onChange === 'function') {
                        lab.onChange((state) => {
                            if (state.trialsComplete) {
                                unlockInputs();
                                const freq = state.frequencies[targetOutcome] || 0;
                                const matchAns =
                                    Math.abs(freq / 20 - theoreticalProb) < 0.001 ? 'yes' : 'no';
                                session.question.solution.text = `The target outcome **${targetOutcome}** appeared **${freq}** times out of 20 trials. Experimental probability: **${freq}/20**. Theoretical probability: **${theoreticalProbText}**. Match: **${matchAns === 'yes' ? 'Yes' : 'No'}** — short samples often differ from theory due to random chance.`;
                                session.question.solution.show = {
                                    lab: {},
                                    expProb: { latex: `\\frac{${freq}}{20}` },
                                    theoProb: {
                                        latex: isCoin ? '\\frac{1}{2}' : '\\frac{1}{6}',
                                    },
                                    match: matchAns,
                                };
                            }
                        });
                    }
                },
            };
        }
    };

    // Load active sandbox question
    function loadNextPracticeQuestion() {
        if (state.questionSession) {
            state.questionSession.dispose();
            state.questionSession = null;
        }

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
        const rawQuestion = MCS.questionPicker.pick(gen, state.sessionSeenQuestions);
        const isNativeCanonical =
            (rawQuestion.widgets && rawQuestion.widgets.length) ||
            (rawQuestion.inputs && rawQuestion.inputs.length);
        state.currentQuestion = isNativeCanonical
            ? rawQuestion
            : MCS.adaptLegacyY5(rawQuestion);

        const band =
            (state.currentQuestion.inputs &&
                state.currentQuestion.inputs[0] &&
                state.currentQuestion.inputs[0].config &&
                state.currentQuestion.inputs[0].config.band) ||
            (state.currentQuestion.widgets &&
                state.currentQuestion.widgets[0] &&
                state.currentQuestion.widgets[0].config &&
                state.currentQuestion.widgets[0].config.band) ||
            'C';
        state.questionSession = MCS.runQuestion(state.currentQuestion, {
            widgetMount: pracInteractivePanel,
            promptMount: pracTaskTitle,
            band: band,
        });
        if (typeof rawQuestion.wireSession === 'function') {
            rawQuestion.wireSession(state.questionSession, { submitBtn: btnPracSubmit });
        }

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
        if (!state.currentQuestion || !state.questionSession) return;

        const values = state.questionSession.collect();
        if (state.currentQuestion && state.currentQuestion.requiresTrials) {
            const lab = values.lab;
            if (!lab || !lab.trialsComplete) {
                pracFeedbackText.className = 'active-feedback-text feedback-error';
                pracFeedbackText.textContent = 'Run the simulation before submitting';
                pracFeedbackText.style.display = 'block';
                return;
            }
        }
        if (
            typeof MCS !== 'undefined' &&
            MCS.input &&
            values.ans &&
            typeof values.ans === 'object' &&
            MCS.input.isEmpty(values.ans)
        ) {
            const ansInst = state.questionSession.instances.ans;
            if (ansInst && typeof ansInst.flagEmpty === 'function') {
                ansInst.flagEmpty();
            }
            pracFeedbackText.className = 'active-feedback-text feedback-error';
            pracFeedbackText.textContent = 'Finish your answer';
            pracFeedbackText.style.display = 'block';
            return;
        }

        const isCorrect = state.questionSession.evaluate();

        if (isCorrect) {
            sounds.success();
            Object.keys(state.questionSession.instances).forEach((id) => {
                const inst = state.questionSession.instances[id];
                if (inst && typeof inst.flagCorrect === 'function') inst.flagCorrect();
            });
            state.questionSession.setEnabled(false);
            pracFeedbackText.className = "active-feedback-text feedback-success";
            
            let gainedPoints = 10;
            if (state.attemptsLeft === 1) {
                gainedPoints = 5;
            }
            pracFeedbackText.textContent = `CORRECT CALIBRATION! +${gainedPoints} POINTS`;
            pracFeedbackText.style.display = 'block';

            gainPoints(
                gainedPoints,
                true,
                state.currentQuestion.category,
                state.currentQuestion.descriptor,
                state.currentQuestion.context
            );

            btnPracSubmit.style.display = 'none';
            btnPracHint.style.display = 'none';
            btnPracNext.style.display = 'inline-flex';
            pracAttemptsLeft.textContent = "CALIBRATION STABLE";
            pracAttemptsLeft.style.backgroundColor = "var(--on-tertiary-container)";
            pracAttemptsLeft.style.color = "var(--tertiary)";
            
            addLog(`Task solved correctly on attempt ${3 - state.attemptsLeft}. Awarded +${gainedPoints} points. Streak: ${profile.streak}`, "success");
        } else {
            sounds.error();
            const wrongForm =
                typeof MCS !== 'undefined' &&
                MCS.input &&
                MCS.input._lastCheck &&
                MCS.input._lastCheck.reason === 'wrong-form';
            Object.keys(state.questionSession.instances).forEach((id) => {
                const inst = state.questionSession.instances[id];
                if (inst && typeof inst.flagIncorrect === 'function') {
                    inst.flagIncorrect(id === 'ans' && wrongForm ? { wrongForm: true } : undefined);
                }
            });
            state.attemptsLeft--;

            if (state.attemptsLeft === 1) {
                pracAttemptsLeft.textContent = "1 ATTEMPT LEFT";
                pracAttemptsLeft.style.backgroundColor = "var(--error-container)";
                pracAttemptsLeft.style.color = "var(--error)";

                pracFeedbackText.className = "active-feedback-text feedback-error";
                pracFeedbackText.textContent = `CALIBRATION DISCREPANCY. TRY AGAIN.`;
                pracFeedbackText.style.display = 'block';
                btnPracHint.style.display = 'inline-flex';

                addLog(`Calibration deviation detected. Attempt 1 failed. Displaying diagnostic hint.`, "error");
            } else {
                pracAttemptsLeft.textContent = "CALIBRATION OFFLINE";
                pracAttemptsLeft.style.backgroundColor = "var(--error-container)";
                pracAttemptsLeft.style.color = "var(--error)";

                state.questionSession.setEnabled(false);
                state.questionSession.showSolution(pracSolutionContent);
                pracSolutionContainer.style.display = 'block';
                pracHintContainer.style.display = 'none';
                
                pracFeedbackText.className = "active-feedback-text feedback-error";
                pracFeedbackText.textContent = `SYSTEM CRITICAL: Solutions shown below.`;
                pracFeedbackText.style.display = 'block';

                gainPoints(0, false, state.currentQuestion.category, state.currentQuestion.descriptor, state.currentQuestion.context);

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

    btnPracHint.addEventListener('click', () => {
        sounds.hint();
        state.questionSession.showHint(pracHintContent);
        pracHintContainer.style.display = 'block';
        btnPracHint.style.display = 'none';
    });

    // ----------------------------------------------------
    // Trophy Room Overlay Modal Logic
    // ----------------------------------------------------
    let trophyActiveYear = 5;
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

    // ----------------------------------------------------
    // 6. Init Boot Sequence
    // ----------------------------------------------------
    loadProfile();
    loadNextPracticeQuestion();
    addLog("Practice Console systems fully booted.", "system");
});
