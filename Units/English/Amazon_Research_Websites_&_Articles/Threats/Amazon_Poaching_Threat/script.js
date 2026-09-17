// Copied from mining template for identical interactivity
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('animate'); } });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.feature-card, .adaptation-card, .threat-card, .initiative');
    animateElements.forEach(el => { el.classList.add('scroll-animate'); observer.observe(el); });
});

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) { heroImage.style.transform = `translateY(${scrolled * -0.5}px)`; }
});

function animateCounter(element, target, duration = 2000) {
    let start = 0; const increment = target / (duration / 16);
    function updateCounter() { start += increment; if (start < target) { element.textContent = Math.floor(start); requestAnimationFrame(updateCounter); } else { element.textContent = target; } }
    updateCounter();
}

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.stat-number');
            counters.forEach(counter => { const number = parseInt(counter.textContent.replace(/\D/g, '')); if (!isNaN(number)) { animateCounter(counter, number); } });
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', () => {
    const heroSection = document.querySelector('.hero');
    if (heroSection) counterObserver.observe(heroSection);
});

document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.feature-card, .adaptation-card, .threat-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => { card.style.transform = 'translateY(-10px) scale(1.02)'; });
        card.addEventListener('mouseleave', () => { card.style.transform = 'translateY(0) scale(1)'; });
    });
});

function typeWriter(element, text, speed = 50) {
    let i = 0; element.innerHTML = '';
    function type() { if (i < text.length) { element.innerHTML += text.charAt(i); i++; setTimeout(type, speed); } }
    type();
}

document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) { const originalText = heroTitle.textContent; setTimeout(() => { typeWriter(heroTitle, originalText, 50); }, 800); }
});

window.addEventListener('load', () => { document.body.classList.add('loaded'); });
const style = document.createElement('style');
style.textContent = `
    body:not(.loaded) { overflow: hidden; }
    body:not(.loaded)::before { content: ''; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(135deg, #2c5530, #4a90e2); z-index: 9999; }
    body:not(.loaded)::after { content: 'Loading...'; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-size: 1.5rem; font-weight: 600; z-index: 10000; }
    body.loaded::before, body.loaded::after { display: none; }
`;
document.head.appendChild(style);

const progressBar = document.createElement('div');
progressBar.style.cssText = `position: fixed; top: 0; left: 0; width: 0%; height: 3px; background: linear-gradient(90deg, #4a90e2, #2c5530); z-index: 1001; transition: width 0.3s ease;`;
document.body.appendChild(progressBar);
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset; const docHeight = document.body.offsetHeight - window.innerHeight; const scrollPercent = (scrollTop / docHeight) * 100; progressBar.style.width = scrollPercent + '%';
});

const backToTop = document.createElement('button');
backToTop.innerHTML = '<i class="fas fa-chevron-up"></i>';
backToTop.style.cssText = `position: fixed; bottom: 30px; right: 30px; width: 50px; height: 50px; background: linear-gradient(135deg, #4a90e2, #2c5530); color: white; border: none; border-radius: 50%; cursor: pointer; opacity: 0; visibility: hidden; transition: all 0.3s ease; z-index: 1000; box-shadow: 0 4px 15px rgba(74, 144, 226, 0.3);`;
document.body.appendChild(backToTop);
backToTop.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });
window.addEventListener('scroll', () => { if (window.pageYOffset > 300) { backToTop.style.opacity = '1'; backToTop.style.visibility = 'visible'; } else { backToTop.style.opacity = '0'; backToTop.style.visibility = 'hidden'; } });
backToTop.addEventListener('mouseenter', () => { backToTop.style.transform = 'translateY(-3px)'; backToTop.style.boxShadow = '0 6px 20px rgba(74, 144, 226, 0.4)'; });
backToTop.addEventListener('mouseleave', () => { backToTop.style.transform = 'translateY(0)'; backToTop.style.boxShadow = '0 4px 15px rgba(74, 144, 226, 0.3)'; });

document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { hamburger.classList.remove('active'); navMenu.classList.remove('active'); } });
document.querySelectorAll('.nav-link, .cta-button, .feature-card, .adaptation-card, .threat-card').forEach(element => {
    element.addEventListener('focus', () => { element.style.outline = '2px solid #4a90e2'; element.style.outlineOffset = '2px'; });
    element.addEventListener('blur', () => { element.style.outline = 'none'; });
});

document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) { const img = entry.target; img.style.opacity = '1'; img.style.transform = 'scale(1)'; imageObserver.unobserve(img); } });
    });
    images.forEach(img => { img.style.opacity = '0'; img.style.transform = 'scale(0.95)'; img.style.transition = 'opacity 0.6s ease, transform 0.6s ease'; imageObserver.observe(img); });
});

document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', () => {
            img.style.display = 'none';
            const fallback = document.createElement('div');
            fallback.style.cssText = 'width:100%;height:300px;background:linear-gradient(135deg,#f0f0f0,#e0e0e0);display:flex;align-items:center;justify-content:center;color:#666;font-size:1.1rem;';
            fallback.textContent = 'Image not available';
            img.parentNode.insertBefore(fallback, img);
        });
    });
});

console.log('Amazon Poaching Threat website loaded successfully!');


