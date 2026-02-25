// Interactive features for the floods webpage

document.addEventListener('DOMContentLoaded', function () {
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('.content-section, .flood-type, .safety-section, .quiz-section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Add interactive hover effects to cause cards
    const causeCards = document.querySelectorAll('.cause-card');
    causeCards.forEach(card => {
        card.addEventListener('click', function () {
            this.style.animation = 'pulse 0.5s ease';
            setTimeout(() => {
                this.style.animation = '';
            }, 500);
        });
    });

    // Save quiz answers to localStorage
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach((textarea, index) => {
        // Load saved answer
        const savedAnswer = localStorage.getItem(`flood-quiz-${index}`);
        if (savedAnswer) {
            textarea.value = savedAnswer;
        }

        // Save on input
        textarea.addEventListener('input', function () {
            localStorage.setItem(`flood-quiz-${index}`, this.value);
        });
    });

    // Add pulse animation to safety rules on hover
    const safetyRules = document.querySelectorAll('.safety-rule');
    safetyRules.forEach(rule => {
        rule.addEventListener('mouseenter', function () {
            const number = this.querySelector('.rule-number');
            number.style.animation = 'pulse 0.5s ease';
        });

        rule.addEventListener('mouseleave', function () {
            const number = this.querySelector('.rule-number');
            number.style.animation = '';
        });
    });

    // Add smooth scrolling for any internal links
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
    printButton.textContent = '🖨️ Print This Page';
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

    // Add a "Back to Top" button
    const backToTopButton = document.createElement('button');
    backToTopButton.textContent = '↑';
    backToTopButton.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
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
