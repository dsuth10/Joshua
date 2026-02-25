// Interactive features for Brisbane floods webpage

document.addEventListener('DOMContentLoaded', function () {
    // Animate timeline items on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe timeline items
    document.querySelectorAll('.timeline-item').forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(50px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(item);
    });

    // Observe other sections
    document.querySelectorAll('.content-section, .impact-section, .economic-section, .mud-army-section, .lessons-section, .reflection-section, .quiz-section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });

    // Animate impact cards
    const impactCards = document.querySelectorAll('.impact-card');
    impactCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.8)';
        card.style.transition = `opacity 0.6s ease ${index * 0.15}s, transform 0.6s ease ${index * 0.15}s`;
        observer.observe(card);
    });

    // Animate economic cards
    const economicCards = document.querySelectorAll('.economic-card');
    economicCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateX(-30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });

    // Animate lesson cards
    const lessonCards = document.querySelectorAll('.lesson-card');
    lessonCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.15}s, transform 0.6s ease ${index * 0.15}s`;
        observer.observe(card);
    });

    // Counter animation for hero stats
    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
        }, 16);
    }

    // Trigger counter animations when hero is visible
    const heroObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = document.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    const text = stat.textContent;
                    if (text.includes('$')) {
                        // Skip animation for dollar amounts
                        return;
                    }
                    const number = parseInt(text.replace(/,/g, ''));
                    if (!isNaN(number)) {
                        stat.textContent = '0';
                        setTimeout(() => {
                            animateCounter(stat, number);
                        }, 500);
                    }
                });
                heroObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const hero = document.querySelector('.hero');
    if (hero) {
        heroObserver.observe(hero);
    }

    // Save quiz answers to localStorage
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach((textarea, index) => {
        // Load saved answer
        const savedAnswer = localStorage.getItem(`brisbane-quiz-${index}`);
        if (savedAnswer) {
            textarea.value = savedAnswer;
        }

        // Save on input
        textarea.addEventListener('input', function () {
            localStorage.setItem(`brisbane-quiz-${index}`, this.value);
        });
    });

    // Add pulse effect to critical timeline items
    const criticalItems = document.querySelectorAll('.timeline-item.critical');
    criticalItems.forEach(item => {
        item.addEventListener('mouseenter', function () {
            this.querySelector('.timeline-content').style.animation = 'pulse 0.5s ease';
        });

        item.addEventListener('mouseleave', function () {
            this.querySelector('.timeline-content').style.animation = '';
        });
    });

    // Add smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add print functionality
    const printButton = document.createElement('button');
    printButton.textContent = '🖨️ Print';
    printButton.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        padding: 15px 30px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 50px;
        font-size: 1rem;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        z-index: 1000;
    `;

    printButton.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-5px)';
        this.style.boxShadow = '0 10px 30px rgba(0,0,0,0.4)';
    });

    printButton.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 5px 20px rgba(0,0,0,0.3)';
    });

    printButton.addEventListener('click', function () {
        window.print();
    });

    document.body.appendChild(printButton);

    // Add "Back to Top" button
    const backToTopButton = document.createElement('button');
    backToTopButton.textContent = '↑';
    backToTopButton.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 1.5rem;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        transition: transform 0.3s ease, opacity 0.3s ease;
        z-index: 1000;
        opacity: 0;
        pointer-events: none;
    `;

    window.addEventListener('scroll', function () {
        if (window.scrollY > 500) {
            backToTopButton.style.opacity = '1';
            backToTopButton.style.pointerEvents = 'auto';
        } else {
            backToTopButton.style.opacity = '0';
            backToTopButton.style.pointerEvents = 'none';
        }
    });

    backToTopButton.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    document.body.appendChild(backToTopButton);

    // Add navigation between pages
    const navButton = document.createElement('a');
    navButton.href = 'understanding_floods.html';
    navButton.textContent = '📚 Understanding Floods';
    navButton.style.cssText = `
        position: fixed;
        top: 30px;
        right: 30px;
        padding: 12px 25px;
        background: rgba(255,255,255,0.95);
        color: #2c5364;
        text-decoration: none;
        border-radius: 25px;
        font-weight: bold;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        transition: transform 0.3s ease;
        z-index: 1000;
    `;

    navButton.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-3px)';
    });

    navButton.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0)';
    });

    document.body.appendChild(navButton);
});

// Add CSS animation for pulse effect
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
    }
`;
document.head.appendChild(style);
