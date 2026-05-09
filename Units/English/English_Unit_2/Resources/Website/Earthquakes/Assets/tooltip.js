/**
 * The Trembling Earth — Earthquake Terminology Tooltip System
 * Australian Severe Weather — Volume IV
 * Adapted from Floods Archive tooltip engine (Marine Theme → Geological Theme)
 */

class TooltipSystem {
    constructor(options = {}) {
        this.theme = options.theme || {
            primary: '#c2692a',       // Geological amber-rust
            surface: 'rgba(44, 32, 22, 0.98)',
            text: '#ede0d4',
            font: "'Outfit', sans-serif"
        };

        this.tooltipElement = null;
        this.activeTarget = null;
        this.init();
    }

    init() {
        this.injectStyles();
        this.createTooltipElement();
        this.attachGlobalListeners();
    }

    injectStyles() {
        if (document.getElementById('tooltip-system-styles')) return;

        const style = document.createElement('style');
        style.id = 'tooltip-system-styles';
        style.textContent = `
            .archive-tooltip {
                position: fixed;
                background-color: ${this.theme.surface};
                color: ${this.theme.text};
                padding: 1rem 1.25rem;
                border-radius: 0.75rem;
                border: 1px solid ${this.theme.primary};
                font-size: 0.9rem;
                line-height: 1.55;
                max-width: 300px;
                z-index: 10000;
                pointer-events: none;
                box-shadow: 0 15px 35px -5px rgba(0, 0, 0, 0.6);
                transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1), transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                opacity: 0;
                transform: translateY(10px);
                font-family: ${this.theme.font};
                -webkit-backdrop-filter: blur(8px);
                backdrop-filter: blur(8px);
            }

            .archive-tooltip.visible {
                opacity: 1;
                transform: translateY(0);
            }

            [data-tooltip] {
                cursor: help;
                text-decoration: none;
                border-bottom: 2px dashed ${this.theme.primary}80;
                padding-bottom: 1px;
                transition: all 0.2s ease;
            }

            [data-tooltip]:hover,
            [data-tooltip].active {
                background-color: ${this.theme.primary}18;
                border-bottom-color: ${this.theme.primary};
            }

            [data-tooltip].active {
                outline: none;
            }
        `;
        document.head.appendChild(style);
    }

    createTooltipElement() {
        this.tooltipElement = document.createElement('div');
        this.tooltipElement.className = 'archive-tooltip';
        document.body.appendChild(this.tooltipElement);
    }

    attachGlobalListeners() {
        document.addEventListener('click', (e) => {
            const target = e.target.closest('[data-tooltip]');
            if (!target) this.hideTooltip();
        }, { capture: true });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.hideTooltip();
        });
    }

    attachEventHandlers(element) {
        if (element.dataset.tooltipInitialized) return;

        element.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (this.activeTarget === element) {
                this.hideTooltip();
            } else {
                this.showTooltip(element);
            }
        });

        element.dataset.tooltipInitialized = 'true';
    }

    showTooltip(target) {
        if (this.activeTarget) {
            this.activeTarget.classList.remove('active');
        }

        const content = target.getAttribute('data-tooltip');
        if (!content || content === 'true' || content === '') return;

        this.tooltipElement.textContent = content;
        this.activeTarget = target;
        target.classList.add('active');

        const rect = target.getBoundingClientRect();

        this.tooltipElement.style.visibility = 'hidden';
        this.tooltipElement.classList.add('visible');
        const tooltipRect = this.tooltipElement.getBoundingClientRect();
        this.tooltipElement.style.visibility = 'visible';

        let top = rect.top - tooltipRect.height - 15;
        let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);

        if (top < 15) top = rect.bottom + 15;
        if (left < 15) left = 15;
        if (left + tooltipRect.width > window.innerWidth - 15) {
            left = window.innerWidth - tooltipRect.width - 15;
        }

        this.tooltipElement.style.top = `${top}px`;
        this.tooltipElement.style.left = `${left}px`;
    }

    hideTooltip() {
        if (this.tooltipElement) this.tooltipElement.classList.remove('visible');
        if (this.activeTarget) {
            this.activeTarget.classList.remove('active');
            this.activeTarget = null;
        }
    }
}

window.TooltipSystem = TooltipSystem;

document.addEventListener('DOMContentLoaded', () => {
    const system = new TooltipSystem();
    document.querySelectorAll('[data-tooltip]').forEach(el => {
        system.attachEventHandlers(el);
    });
});
