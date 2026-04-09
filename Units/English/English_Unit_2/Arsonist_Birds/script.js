document.addEventListener('DOMContentLoaded', () => {
    // 1. Module Highlighting
    const modules = document.querySelectorAll('.module');

    modules.forEach(module => {
        module.addEventListener('mouseenter', () => {
            modules.forEach(m => m.classList.remove('active'));
            module.classList.add('active');
        });
    });

    // 2. Initial state: Activate first module
    if (modules.length > 0) {
        modules[0].classList.add('active');
    }

    // 3. Species Card Reveal (Handled by CSS, but JS could add sound or logger)
    const cards = document.querySelectorAll('.species-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            console.log(`Exploring: ${card.dataset.bird}`);
        });
    });

    // 4. Smooth Scrolling/Transitions could be added here
});
