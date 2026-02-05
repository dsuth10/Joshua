/* ===========================================
   APP.JS - INTERACTIVE FUNCTIONALITY
   =========================================== */

// Section Switching
function switchSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.page-section');
    sections.forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none';
    });

    // Show selected section
    const targetSection = document.getElementById(`section-${sectionName}`);
    if (targetSection) {
        targetSection.style.display = 'block';
        setTimeout(() => {
            targetSection.classList.add('active');
        }, 10);
    }

    // Update sidebar active state
    const sectionItems = document.querySelectorAll('.section-item');
    sectionItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.section === sectionName) {
            item.classList.add('active');
        }
    });

    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Toggle Sidebar (for mobile)
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar.style.display === 'none') {
        sidebar.style.display = 'block';
    } else {
        sidebar.style.display = 'none';
    }
}

// Expand Note Cards
function expandNote(card) {
    const noteContent = card.querySelector('.note-content');
    if (noteContent) {
        if (noteContent.style.display === 'none' || !noteContent.style.display) {
            noteContent.style.display = 'block';
            card.style.transform = 'scale(1.02)';
        } else {
            noteContent.style.display = 'none';
            card.style.transform = '';
        }
    }
}

// Toggle Task Checkbox
function toggleTask(taskItem) {
    const checkbox = taskItem.querySelector('input[type="checkbox"]');
    const label = taskItem.querySelector('label');

    if (checkbox.checked) {
        label.style.textDecoration = 'line-through';
        label.style.color = 'var(--color-text-muted)';
    } else {
        label.style.textDecoration = 'none';
        label.style.color = 'var(--color-text)';
    }
}

// Add smooth entrance animations
document.addEventListener('DOMContentLoaded', () => {
    // Show welcome section by default
    const welcomeSection = document.getElementById('section-welcome');
    if (welcomeSection) {
        welcomeSection.style.display = 'block';
    }

    // Add task item styles
    const taskItems = document.querySelectorAll('.task-item');
    taskItems.forEach(item => {
        item.style.display = 'flex';
        item.style.alignItems = 'center';
        item.style.padding = 'var(--space-md)';
        item.style.borderRadius = 'var(--radius-sm)';
        item.style.marginBottom = 'var(--space-sm)';
        item.style.transition = 'background 200ms ease';
        item.style.cursor = 'pointer';

        item.addEventListener('mouseenter', () => {
            item.style.backgroundColor = '#F1F5F9';
        });

        item.addEventListener('mouseleave', () => {
            item.style.backgroundColor = 'transparent';
        });
    });

    // Style section items
    const sectionItems = document.querySelectorAll('.section-item');
    sectionItems.forEach(item => {
        item.style.display = 'block';
        item.style.padding = 'var(--space-md)';
        item.style.borderRadius = 'var(--radius-sm)';
        item.style.marginBottom = 'var(--space-sm)';
        item.style.transition = 'all 200ms ease';
        item.style.cursor = 'pointer';
        item.style.border = '2px solid transparent';

        item.addEventListener('mouseenter', () => {
            if (!item.classList.contains('active')) {
                item.style.backgroundColor = '#F1F5F9';
            }
        });

        item.addEventListener('mouseleave', () => {
            if (!item.classList.contains('active')) {
                item.style.backgroundColor = 'transparent';
            }
        });
    });

    // Style active section item
    const activeItem = document.querySelector('.section-item.active');
    if (activeItem) {
        activeItem.style.backgroundColor = '#EEF2FF';
        activeItem.style.borderColor = 'var(--color-primary)';
        activeItem.style.fontWeight = '600';
    }

    // Add page transition effects
    const pageSections = document.querySelectorAll('.page-section');
    pageSections.forEach(section => {
        section.style.transition = 'opacity 300ms ease, transform 300ms ease';
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
    });

    // Animate welcome section on load
    setTimeout(() => {
        if (welcomeSection) {
            welcomeSection.style.opacity = '1';
            welcomeSection.style.transform = 'translateY(0)';
        }
    }, 100);
});

// Update active section item styling when clicked
document.addEventListener('click', (e) => {
    if (e.target.closest('.section-item')) {
        const allItems = document.querySelectorAll('.section-item');
        allItems.forEach(item => {
            item.style.backgroundColor = 'transparent';
            item.style.borderColor = 'transparent';
            item.style.fontWeight = '400';
        });

        const clickedItem = e.target.closest('.section-item');
        clickedItem.style.backgroundColor = '#EEF2FF';
        clickedItem.style.borderColor = 'var(--color-primary)';
        clickedItem.style.fontWeight = '600';
    }
});

// Page section active class handler
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            const section = mutation.target;
            if (section.classList.contains('active')) {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }
        }
    });
});

document.querySelectorAll('.page-section').forEach(section => {
    observer.observe(section, { attributes: true });
});
