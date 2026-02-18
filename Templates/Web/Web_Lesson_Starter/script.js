/**
 * Joshua Project - RADICAL RIVER Theme
 * Lesson Template Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // Reveal Animation on Scroll
    const revealOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Unobserve if we only want animate once
                // revealObserver.unobserve(entry.target);
            }
        });
    }, revealOptions);

    document.querySelectorAll('.reveal').forEach(element => {
        revealObserver.observe(element);
    });

    // Premium Interaction: Micro-animations for boxes
    const featureBoxes = document.querySelectorAll('.feature-box');
    featureBoxes.forEach(box => {
        box.addEventListener('mouseenter', () => {
            // Logic for hover interactions can be extended here
        });
    });
});
