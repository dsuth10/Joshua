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

    // 3. Species Card Interaction logging
    const cards = document.querySelectorAll('.species-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            console.log(`Exploring strategy: ${card.dataset.animal}`);
        });
    });
});
