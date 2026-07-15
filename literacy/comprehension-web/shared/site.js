(function () {
    const THEME_KEY = 'literacy-comprehension-theme';

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(THEME_KEY, theme);
    }

    function toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        applyTheme(current === 'light' ? 'dark' : 'light');
    }

    function initTheme() {
        applyTheme(localStorage.getItem(THEME_KEY) || 'light');
    }

    document.addEventListener('DOMContentLoaded', () => {
        initTheme();
        document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
            btn.addEventListener('click', toggleTheme);
        });
    });

    window.LiteracySite = { toggleTheme, applyTheme };
})();
