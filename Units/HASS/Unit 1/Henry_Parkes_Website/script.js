document.addEventListener('DOMContentLoaded', () => {
    // Scroll Progress Bar
    window.onscroll = function () { updateProgress() };

    function updateProgress() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        document.getElementById("myBar").style.width = scrolled + "%";
    }

    // Scroll Reveal Intersection Observer
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

    // Timeline Interaction and Navigation
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        item.addEventListener('click', () => {
            const eventId = item.getAttribute('data-event');
            const content = item.querySelector('.timeline-content');

            // Animation before navigation
            content.style.transform = 'scale(1.05)';
            content.style.backgroundColor = '#fffdee';

            setTimeout(() => {
                if (eventId) {
                    window.location.href = `event-details.html?event=${eventId}`;
                }
            }, 300);
        });
    });
});
