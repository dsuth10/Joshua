/**
 * Floods Archive - Educational Terminology Tooltips
 * 
 * Re-engineered Tooltip System (Marine Theme - Volume III)
 * Provides interactive pop-ups for technical vocabulary via click-to-open.
 */

class TooltipSystem {
    constructor(options = {}) {
        this.theme = options.theme || {
            primary: '#1e7a74', // Floods Teal
            surface: 'rgba(27, 42, 50, 0.98)', // Dark Navy
            text: '#d6eae8',
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
        console.log('TooltipSystem initialized: Marine Theme');
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
                line-height: 1.5;
                max-width: 300px;
                z-index: 10000;
                pointer-events: none;
                box-shadow: 0 15px 35px -5px rgba(0, 0, 0, 0.5);
                transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1), transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                opacity: 0;
                transform: translateY(10px);
                font-family: ${this.theme.font};
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
            }
            
            .archive-tooltip.visible {
                opacity: 1;
                transform: translateY(0);
            }
            
            [data-tooltip] {
                cursor: help;
                text-decoration: none;
                border-bottom: 2px dashed ${this.theme.primary}80; /* 50% opacity */
                padding-bottom: 1px;
                transition: all 0.2s ease;
            }
            
            [data-tooltip]:hover, [data-tooltip].active {
                background-color: ${this.theme.primary}15; /* 8% opacity */
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
        // Close on click outside
        document.addEventListener('click', (e) => {
            const target = e.target.closest('[data-tooltip]');
            if (!target) {
                this.hideTooltip();
            }
        }, { capture: true });

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.hideTooltip();
        });
    }

    /**
     * Public method used by glossary loaders to attach handlers to specific elements
     */
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
        // If another was active, hide it first
        if (this.activeTarget) {
            this.activeTarget.classList.remove('active');
        }

        const content = target.getAttribute('data-tooltip');
        if (!content || content === "true" || content === "") return;

        this.tooltipElement.textContent = content;
        this.activeTarget = target;
        target.classList.add('active');
        
        // Position calculation
        const rect = target.getBoundingClientRect();
        
        // Ensure visible so we can get its dimensions
        this.tooltipElement.style.visibility = 'hidden';
        this.tooltipElement.classList.add('visible');
        const tooltipRect = this.tooltipElement.getBoundingClientRect();
        this.tooltipElement.style.visibility = 'visible';
        
        let top = rect.top - tooltipRect.height - 15;
        let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        
        // Boundary checks
        if (top < 15) {
            top = rect.bottom + 15; // Flip to bottom
        }
        
        if (left < 15) left = 15;
        if (left + tooltipRect.width > window.innerWidth - 15) {
            left = window.innerWidth - tooltipRect.width - 15;
        }
        
        this.tooltipElement.style.top = `${top}px`;
        this.tooltipElement.style.left = `${left}px`;
    }

    hideTooltip() {
        if (this.tooltipElement) {
            this.tooltipElement.classList.remove('visible');
        }
        if (this.activeTarget) {
            this.activeTarget.classList.remove('active');
            this.activeTarget = null;
        }
    }
}

// Export to global scope
window.TooltipSystem = TooltipSystem;

// Self-initialize for delegation support on pages that don't use a dynamic glossary
document.addEventListener('DOMContentLoaded', () => {
    const system = new TooltipSystem();
    
    // Attach to existing elements that might not be handled by floors-glossary.js
    document.querySelectorAll('[data-tooltip]').forEach(el => {
        system.attachEventHandlers(el);
    });
});
