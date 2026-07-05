/**
 * Maths Command Station - Focused Descriptor Session
 * 
 * Centralises the logic for the "Command Calibration Dashboard" where students
 * select a descriptor (topic) to practice instead of a strand tab.
 */

window.MCS = window.MCS || {};

window.MCS.focusedSession = (function() {
    // -------------------------------------------------------------------------
    // Constants & UI Lookups
    // -------------------------------------------------------------------------
    const THEMES = typeof STRAND_THEMES !== 'undefined' ? STRAND_THEMES : {
        'number': { name: 'Number', colour: '#003ec7', label: 'NUMBER' },
        'algebra': { name: 'Algebra', colour: '#b45309', label: 'ALGEBRA' },
        'measurement': { name: 'Measurement', colour: '#005471', label: 'MEASUREMENT' },
        'space': { name: 'Space', colour: '#ba1a1a', label: 'SPACE' },
        'statistics': { name: 'Statistics', colour: '#585f6a', label: 'STATISTICS' },
        'probability': { name: 'Probability', colour: '#059669', label: 'PROBABILITY' }
    };

    // -------------------------------------------------------------------------
    // Rendering
    // -------------------------------------------------------------------------
    function renderDashboard(containerId, targetYear, profile, onSelect) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Group by strand
        const grouped = {
            'number': [], 'algebra': [], 'measurement': [],
            'space': [], 'statistics': [], 'probability': []
        };

        let foundAny = false;
        
        // Use DESCRIPTOR_BADGES from achievements-config.js
        if (typeof DESCRIPTOR_BADGES !== 'undefined') {
            for (const [badgeId, badge] of Object.entries(DESCRIPTOR_BADGES)) {
                if (badge.year === targetYear) {
                    if (grouped[badge.strand]) {
                        grouped[badge.strand].push({ id: badgeId, ...badge });
                        foundAny = true;
                    }
                }
            }
        }

        if (!foundAny) {
            container.innerHTML = `<div style="padding:20px; color:var(--error);">NO TOPICS CONFIGURED FOR YEAR ${targetYear}</div>`;
            return;
        }

        let html = '';
        const solvedMap = profile?.solvedContexts || {};
        
        const strands = ['number', 'algebra', 'measurement', 'space', 'statistics', 'probability'];
        
        strands.forEach(strand => {
            const badges = grouped[strand];
            if (badges.length === 0) return;

            const theme = THEMES[strand];
            html += `<div class="strand-section">
                <div class="strand-header" style="background-color: ${theme.colour}20; color: ${theme.colour}; border-left: 4px solid ${theme.colour}; margin-bottom: 12px; padding: 8px 12px; font-weight: 700; border-radius: 0 4px 4px 0;">
                    ${theme.label} MISSION LOGS
                </div>
                <div class="dashboard-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; margin-bottom: 24px;">`;

            badges.forEach(b => {
                const requiredContexts = b.requirements?.contexts || [];
                const solvedForThis = solvedMap[b.code] || [];
                
                let dotsHtml = '';
                requiredContexts.forEach(ctx => {
                    const isSolved = solvedForThis.includes(ctx);
                    dotsHtml += `<div class="tick-dot" style="width:12px; height:12px; border-radius:50%; display:inline-block; margin-right:4px; 
                        ${isSolved ? `background-color: ${theme.colour};` : 'border: 2px solid var(--outline-variant);'}"></div>`;
                });

                html += `
                    <div class="topic-card" data-badge="${b.id}" style="border: 1px solid var(--outline-variant); border-radius: 8px; padding: 16px; cursor: pointer; transition: all 0.2s; background: var(--surface);">
                        <div style="font-size: 2rem; margin-bottom: 8px;">${b.emoji}</div>
                        <div style="font-weight: 700; font-size: 0.9rem; color: ${theme.colour}; margin-bottom: 4px;">${b.code}</div>
                        <div style="font-weight: 700; font-size: 1.1rem; margin-bottom: 8px;">${b.badgeName}</div>
                        <div style="font-size: 0.8rem; color: var(--on-surface-variant); margin-bottom: 12px; line-height: 1.4;">${b.desc}</div>
                        <div style="display:flex;">${dotsHtml}</div>
                    </div>
                `;
            });

            html += `</div></div>`; // End grid & section
        });

        container.innerHTML = html;

        // Attach event listeners
        const cards = container.querySelectorAll('.topic-card');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const badgeId = card.getAttribute('data-badge');
                if (onSelect && typeof onSelect === 'function') {
                    onSelect(badgeId);
                }
            });
            card.addEventListener('mouseover', () => {
                card.style.transform = 'translateY(-2px)';
                card.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            });
            card.addEventListener('mouseout', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = 'none';
            });
        });
    }

    // -------------------------------------------------------------------------
    // Session State Management
    // -------------------------------------------------------------------------
    function start(state, badgeId) {
        if (typeof DESCRIPTOR_BADGES === 'undefined') return false;
        
        const badge = DESCRIPTOR_BADGES[badgeId];
        if (!badge) return false;

        const normaliseCode = code => (code || '').toUpperCase();

        state.activeDescriptor = normaliseCode(badge.code);
        state.sessionSeenQuestions = new Set();
        
        state.descriptorSession = {
            badgeId: badgeId,
            descriptorCode: normaliseCode(badge.code),
            contexts: [...(badge.requirements?.contexts || [])],
            activeContextIdx: 0,
            correctCountForActiveContext: 0,
            completed: false
        };

        // UI visibility
        const dashView = document.getElementById('practice-dashboard-view');
        const sandboxView = document.getElementById('practice-sandbox-view');
        const codeTag = document.getElementById('practice-code');

        if (dashView) dashView.style.display = 'none';
        if (sandboxView) sandboxView.style.display = 'flex';
        if (codeTag) codeTag.textContent = `[FOCUSED_${badge.code}]`;

        return true;
    }

    function exit(state, completed, callbacks) {
        state.activeDescriptor = null;
        state.activeContext = null;
        state.descriptorSession = null;

        // UI visibility
        const dashView = document.getElementById('practice-dashboard-view');
        const sandboxView = document.getElementById('practice-sandbox-view');
        const codeTag = document.getElementById('practice-code');

        if (sandboxView) sandboxView.style.display = 'none';
        if (dashView) dashView.style.display = 'block';
        if (codeTag) codeTag.textContent = '[SELECT_TASK]';

        if (callbacks && typeof callbacks.onExit === 'function') {
            callbacks.onExit(completed);
        }
    }

    function updateProgress(session, selectors) {
        if (!session) return;
        
        const textId = selectors?.textId || 'session-progress-text';
        const fillId = selectors?.fillId || 'session-progress-fill';
        
        const textEl = document.getElementById(textId);
        const fillEl = document.getElementById(fillId);

        if (!session.contexts || session.contexts.length === 0) return;

        const totalRequired = session.contexts.length * 3;
        const solvedInSession = (session.activeContextIdx * 3) + session.correctCountForActiveContext;
        const pct = Math.min(100, Math.max(0, (solvedInSession / totalRequired) * 100));

        if (textEl) {
            textEl.textContent = `PROGRESS: ${solvedInSession}/${totalRequired} SOLVED`;
        }
        if (fillEl) {
            fillEl.style.width = `${pct}%`;
        }
        
        const nextBtn = document.getElementById('btn-prac-next');
        if (nextBtn && session.completed) {
            nextBtn.textContent = "FINISH & RETURN";
        } else if (nextBtn) {
            nextBtn.textContent = "NEXT CHALLENGE";
        }
    }
    
    function onCorrectAnswer(session) {
        if (!session || session.completed) return false;
        
        session.correctCountForActiveContext++;
        let advancedContext = false;

        if (session.correctCountForActiveContext >= 3) {
            if (session.activeContextIdx < session.contexts.length - 1) {
                session.activeContextIdx++;
                session.correctCountForActiveContext = 0;
                advancedContext = true;
            } else {
                session.completed = true;
            }
        }
        
        return advancedContext; // Returns true if the session advanced to the next context
    }

    return {
        renderDashboard,
        start,
        exit,
        updateProgress,
        onCorrectAnswer
    };
})();
