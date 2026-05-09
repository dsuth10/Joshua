document.addEventListener('DOMContentLoaded', () => {
    const slideshows = document.querySelectorAll('.event-slideshow');
    
    slideshows.forEach(slideshow => {
        const slides = slideshow.querySelectorAll('.event-slideshow-slide');
        const dots = slideshow.querySelectorAll('.event-slideshow-dot');
        const counter = slideshow.querySelector('.event-slideshow-counter');
        const caption = slideshow.querySelector('.event-slideshow-caption');
        const status = slideshow.querySelector('[aria-live="polite"]');
        
        let currentIndex = 0;
        const totalSlides = slides.length;

        // Find prev and next buttons (assuming prev is the first btn and next is the second)
        const buttons = slideshow.querySelectorAll('.event-slideshow-btn');
        if (buttons.length < 2) return; // Need both buttons
        const prevBtn = buttons[0];
        const nextBtn = buttons[1];

        // Function to update the slideshow to a specific index
        function goToSlide(index) {
            // Handle wrap-around
            if (index < 0) index = totalSlides - 1;
            if (index >= totalSlides) index = 0;
            
            // Remove active classes
            slides[currentIndex].classList.remove('is-active');
            if (dots[currentIndex]) {
                dots[currentIndex].classList.remove('is-active');
                dots[currentIndex].setAttribute('aria-current', 'false');
            }
            
            // Set new index
            currentIndex = index;
            
            // Add active classes
            slides[currentIndex].classList.add('is-active');
            if (dots[currentIndex]) {
                dots[currentIndex].classList.add('is-active');
                dots[currentIndex].setAttribute('aria-current', 'true');
            }
            
            // Update counter text
            if (counter) {
                counter.textContent = `${currentIndex + 1} / ${totalSlides}`;
            }
            
            // Update caption text
            if (caption && slides[currentIndex].dataset.caption) {
                caption.textContent = slides[currentIndex].dataset.caption;
            }
            
            // Announce to screen readers
            if (status) {
                status.textContent = `Showing slide ${currentIndex + 1} of ${totalSlides}`;
            }
        }

        // Event Listeners for Buttons
        prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
        nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

        // Event Listeners for Dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => goToSlide(index));
        });

        // Initialize the first slide explicitly to sync counter and caption
        goToSlide(0);
    });
});
