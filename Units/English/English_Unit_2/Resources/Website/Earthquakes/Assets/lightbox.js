document.addEventListener('DOMContentLoaded', () => {
    // Create lightbox container
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox-overlay';
    
    const lightboxImage = document.createElement('img');
    lightboxImage.className = 'lightbox-image';
    
    const closeBtn = document.createElement('div');
    closeBtn.className = 'lightbox-close';
    closeBtn.innerHTML = '<span class="material-symbols-outlined">close</span>';

    lightbox.appendChild(closeBtn);
    lightbox.appendChild(lightboxImage);
    document.body.appendChild(lightbox);

    // Event listeners
    const triggers = document.querySelectorAll('.lightbox-trigger');
    
    triggers.forEach(img => {
        img.addEventListener('click', () => {
            lightboxImage.src = img.src;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling using default
        // Wait for transition before clearing src
        setTimeout(() => {
            if (!lightbox.classList.contains('active')) {
                lightboxImage.src = '';
            }
        }, 300);
    };

    lightbox.addEventListener('click', (e) => {
        if (e.target !== lightboxImage) {
            closeLightbox();
        }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
});
