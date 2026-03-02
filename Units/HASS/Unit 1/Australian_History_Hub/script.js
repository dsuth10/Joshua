document.addEventListener('DOMContentLoaded', () => {
    // --- Scroll Reveal Intersection Observer ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });

    // --- Tooltip Engine ---
    const vocabs = document.querySelectorAll('.vocab');
    vocabs.forEach(vocab => {
        const definition = vocab.getAttribute('data-def');
        if (definition) {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = definition;
            vocab.appendChild(tooltip);
        }
    });

    // --- Timeline Interaction ---
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        item.addEventListener('click', () => {
            const eventId = item.getAttribute('data-event');
            const content = item.querySelector('.timeline-content');

            if (content) {
                content.style.transform = 'scale(1.05)';
                content.style.backgroundColor = '#fffdee';
            }

            setTimeout(() => {
                if (eventId) {
                    window.location.href = `event-details.html?event=${eventId}`;
                }
            }, 300);
        });
    });
});
