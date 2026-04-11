/**
 * Bushfire Archive — "Did You Know?" Floating Fact Bubble
 * Appears after 30 seconds on any page, rotates through 20 fire facts.
 * Auto-detects light/dark page theme and adapts its visual style.
 */
(function () {
    'use strict';

    const FACTS = [
        "Eucalyptus trees actually need fire to release their seeds — some species won't germinate without it.",
        "The Forest Fire Danger Index (FFDI) has no upper limit. On Black Saturday, it exceeded 180 in some areas — more than double the 'Catastrophic' threshold.",
        "Australia has more volunteer firefighters per capita than almost any other country on Earth — over 200,000 people donate their time.",
        "During the 2019–20 Black Summer fires, smoke from Australian blazes circled the entire globe, reaching as far as South America.",
        "A large bushfire can create its own weather system, called a 'pyroconvective storm,' capable of generating lightning, tornadoes, and fire whirls.",
        "The 2019–20 Black Summer fires burnt an estimated 18.6 million hectares — an area larger than the entire country of Great Britain.",
        "Embers from a fast-moving bushfire can travel up to 40 kilometres ahead of the fire front, igniting new spot fires far in advance.",
        "The National Aerial Firefighting Centre's Large Air Tankers can drop up to 15,000 litres of fire retardant in a single pass — equivalent to six full backyard swimming pools.",
        "The CFA (Country Fire Authority) in Victoria alone has over 55,000 trained volunteers — more personnel than most small countries' armies.",
        "Backburning, or 'prescribed burning,' is one of the oldest fire management tools in Australia — Aboriginal and Torres Strait Islander peoples have used it for over 65,000 years.",
        "After the 2009 Black Saturday fires, Australia introduced a new, highest-ever fire danger rating: 'Catastrophic' (Code Red). On these days, schools in at-risk zones are pre-emptively closed.",
        "A crown fire burning through the tops of eucalyptus trees can travel at up to 12 kilometres per hour — fast enough that a fit adult cannot outrun it for long.",
        "The smoke haze from the Black Summer fires caused Sydney to record the worst air quality of any major city in the world for several days in January 2020.",
        "Koalas are particularly vulnerable to wildfires because they move slowly and shelter in tree hollows, which are the first places to catch alight in a crown fire.",
        "In the aftermath of the 2019–20 fires, an estimated 3 billion animals were killed or displaced — making it one of the worst wildlife disasters in modern recorded history.",
        "Australia's 'fire season' is now starting earlier and ending later than historical averages due to climate change, with some regions experiencing year-round fire risk.",
        "The Ash Wednesday fires of 1983 killed 75 people across South Australia and Victoria in under 12 hours — a speed that completely overwhelmed emergency services of the era.",
        "The total economic cost of Australia's 2019–20 Black Summer bushfires is estimated to exceed $103 billion, making it one of the costliest natural disasters in Australian history.",
        "Firefighters cannot work more than 12 consecutive hours on the fire line due to safety regulations — after that, physical and cognitive performance drops sharply, increasing risk of fatal errors.",
        "Australia's fire danger rating system was fundamentally redesigned in 2022, replacing the old Severe–Extreme–Catastrophic scale with a new six-level system that gives communities clearer, earlier warnings.",
    ];

    const SHOW_DELAY_MS  = 30_000; // 30 seconds
    const ROTATE_DELAY_MS = 12_000; // 12 seconds between auto-rotations

    let currentIndex = 0;
    let rotateTimer  = null;
    let isVisible    = false;

    // ── Theme detection ──────────────────────────────────────────────────────
    // Pages with light background (Black Saturday, Ash Wednesday, Black Summer, Prevention)
    // use bg-background-light / bg-paper. Dark pages use bg-surface-dim / bg-background-dark.
    function isDarkPage() {
        const bodyBg = window.getComputedStyle(document.body).backgroundColor;
        // Parse RGB and check if luminance is below threshold
        const match = bodyBg.match(/\d+/g);
        if (!match) return true;
        const [r, g, b] = match.map(Number);
        const luminance  = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance < 0.5;
    }

    // ── Styles ───────────────────────────────────────────────────────────────
    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #dyk-bubble {
                position: fixed;
                bottom: 28px;
                right: 28px;
                z-index: 9999;
                max-width: 340px;
                width: calc(100vw - 56px);
                border-radius: 18px;
                padding: 20px 22px 18px;
                box-shadow: 0 24px 60px -10px rgba(0,0,0,0.35), 0 0 0 1px rgba(249,115,22,0.18);
                font-family: 'Outfit', system-ui, sans-serif;
                cursor: default;
                opacity: 0;
                transform: translateY(24px) scale(0.96);
                transition: opacity 0.45s cubic-bezier(0.34,1.56,0.64,1), transform 0.45s cubic-bezier(0.34,1.56,0.64,1);
                pointer-events: none;
            }

            /* Dark variant (default — dark pages) */
            #dyk-bubble.dyk-dark {
                background: rgba(20, 14, 10, 0.92);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                border: 1px solid rgba(249, 115, 22, 0.22);
            }
            /* Light variant (editorial / light-bg pages) */
            #dyk-bubble.dyk-light {
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                border: 1px solid rgba(249, 115, 22, 0.28);
                box-shadow: 0 16px 50px -8px rgba(0,0,0,0.12), 0 0 0 1px rgba(249,115,22,0.14);
            }

            #dyk-bubble.dyk-visible {
                opacity: 1;
                transform: translateY(0) scale(1);
                pointer-events: all;
            }

            /* Slide-out animation */
            #dyk-bubble.dyk-hiding {
                opacity: 0;
                transform: translateY(16px) scale(0.97);
                pointer-events: none;
            }

            /* ── Header row ── */
            #dyk-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 12px;
            }
            #dyk-label {
                display: flex;
                align-items: center;
                gap: 7px;
                font-size: 10px;
                font-weight: 700;
                letter-spacing: 0.18em;
                text-transform: uppercase;
                color: #f97316;
            }
            #dyk-label .dyk-fire-icon {
                font-size: 14px;
                line-height: 1;
                font-variation-settings: 'FILL' 1, 'wght' 700, 'GRAD' 0, 'opsz' 20;
            }

            /* ── Close button ── */
            #dyk-close {
                background: none;
                border: none;
                cursor: pointer;
                border-radius: 50%;
                width: 26px;
                height: 26px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.2s;
                flex-shrink: 0;
            }
            .dyk-dark  #dyk-close { color: rgba(255,255,255,0.4); }
            .dyk-light #dyk-close { color: rgba(0,0,0,0.35); }
            #dyk-close:hover { background: rgba(249,115,22,0.12); color: #f97316 !important; }
            #dyk-close .material-symbols-outlined { font-size: 17px; }

            /* ── Fact text ── */
            #dyk-text {
                font-size: 13.5px;
                line-height: 1.65;
                font-weight: 300;
                transition: opacity 0.25s, transform 0.25s;
            }
            .dyk-dark  #dyk-text { color: rgba(243,244,246,0.92); }
            .dyk-light #dyk-text { color: #334155; }

            /* Text swap animation */
            #dyk-text.dyk-text-out {
                opacity: 0;
                transform: translateY(6px);
            }

            /* ── Footer / controls ── */
            #dyk-footer {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-top: 14px;
            }
            #dyk-dots {
                display: flex;
                gap: 5px;
            }
            .dyk-dot {
                width: 5px;
                height: 5px;
                border-radius: 50%;
                transition: background 0.3s, transform 0.3s;
            }
            .dyk-dark  .dyk-dot          { background: rgba(255,255,255,0.18); }
            .dyk-light .dyk-dot          { background: rgba(0,0,0,0.15); }
            .dyk-dot.dyk-dot-active      { background: #f97316 !important; transform: scale(1.3); }

            /* ── Next button ── */
            #dyk-next {
                background: none;
                border: 1px solid rgba(249,115,22,0.3);
                border-radius: 999px;
                padding: 4px 12px;
                font-size: 10px;
                font-weight: 700;
                letter-spacing: 0.12em;
                text-transform: uppercase;
                color: #f97316;
                cursor: pointer;
                font-family: 'Outfit', system-ui, sans-serif;
                transition: background 0.2s, border-color 0.2s;
            }
            #dyk-next:hover {
                background: rgba(249,115,22,0.1);
                border-color: rgba(249,115,22,0.6);
            }

            /* ── Subtle left accent bar ── */
            #dyk-bubble::before {
                content: '';
                position: absolute;
                left: 0; top: 18px; bottom: 18px;
                width: 3px;
                border-radius: 0 3px 3px 0;
                background: linear-gradient(to bottom, #f97316, #ea580c);
                opacity: 0.75;
            }

            /* Mobile: full-width, bottom sheet style */
            @media (max-width: 480px) {
                #dyk-bubble {
                    bottom: 0;
                    right: 0;
                    left: 0;
                    max-width: 100%;
                    width: 100%;
                    border-radius: 20px 20px 0 0;
                    border-bottom: none;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // ── Build DOM ────────────────────────────────────────────────────────────
    function buildBubble(dark) {
        const bubble = document.createElement('div');
        bubble.id    = 'dyk-bubble';
        bubble.classList.add(dark ? 'dyk-dark' : 'dyk-light');
        bubble.setAttribute('role', 'status');
        bubble.setAttribute('aria-live', 'polite');

        bubble.innerHTML = `
            <div id="dyk-header">
                <div id="dyk-label">
                    <span class="dyk-fire-icon material-symbols-outlined">local_fire_department</span>
                    Did You Know?
                </div>
                <button id="dyk-close" aria-label="Dismiss fact">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>
            <p id="dyk-text">${FACTS[currentIndex]}</p>
            <div id="dyk-footer">
                <div id="dyk-dots"></div>
                <button id="dyk-next">Next Fact →</button>
            </div>
        `;

        document.body.appendChild(bubble);
        buildDots();
        return bubble;
    }

    // ── Dot indicators (shows up to 5 dots around the active one) ───────────
    function buildDots() {
        const container = document.getElementById('dyk-dots');
        if (!container) return;
        container.innerHTML = '';
        // Show 5 dot slots cycling around current position
        const total   = FACTS.length;
        const display = 5;
        for (let i = 0; i < display; i++) {
            const dot = document.createElement('span');
            dot.className = 'dyk-dot';
            if (i === Math.floor(display / 2)) dot.classList.add('dyk-dot-active');
            container.appendChild(dot);
        }
    }

    // ── Rotate fact with text fade ───────────────────────────────────────────
    function rotateFact(direction = 1) {
        const textEl = document.getElementById('dyk-text');
        if (!textEl) return;

        textEl.classList.add('dyk-text-out');
        setTimeout(() => {
            currentIndex = (currentIndex + direction + FACTS.length) % FACTS.length;
            textEl.textContent = FACTS[currentIndex];
            textEl.classList.remove('dyk-text-out');
            buildDots();
        }, 260);

        resetAutoRotate();
    }

    function resetAutoRotate() {
        clearInterval(rotateTimer);
        rotateTimer = setInterval(() => rotateFact(1), ROTATE_DELAY_MS);
    }

    // ── Show / Hide ──────────────────────────────────────────────────────────
    function showBubble(bubble) {
        isVisible = true;
        requestAnimationFrame(() => {
            bubble.classList.add('dyk-visible');
        });
        resetAutoRotate();
    }

    function dismissBubble(bubble) {
        if (!isVisible) return;
        isVisible = false;
        clearInterval(rotateTimer);
        bubble.classList.remove('dyk-visible');
        bubble.classList.add('dyk-hiding');
        setTimeout(() => bubble.remove(), 500);
    }

    // ── Init ─────────────────────────────────────────────────────────────────
    function init() {
        // Shuffle starting fact so it varies between pages/visits
        currentIndex = Math.floor(Math.random() * FACTS.length);

        injectStyles();

        // Wait for Material Symbols to be available (fonts loaded via link tag)
        setTimeout(() => {
            const dark   = isDarkPage();
            const bubble = buildBubble(dark);

            // Controls
            document.getElementById('dyk-close').addEventListener('click', () => dismissBubble(bubble));
            document.getElementById('dyk-next').addEventListener('click', () => rotateFact(1));

            // Swipe to dismiss on mobile
            let touchStartX = 0;
            bubble.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
            bubble.addEventListener('touchend', e => {
                if (e.changedTouches[0].clientX - touchStartX > 60) dismissBubble(bubble);
            }, { passive: true });

            // Show after delay
            setTimeout(() => showBubble(bubble), SHOW_DELAY_MS);

        }, 100); // tiny delay ensures body styles are computed
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
