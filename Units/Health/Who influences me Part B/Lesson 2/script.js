/**
 * Joshua Project - RADICAL RIVER Theme
 * Lesson 2: Health Messages & Problem-Solving - Interactive Presentation Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. REVEAL ANIMATIONS ON SCROLL (Observer Pattern)
    // ----------------------------------------------------
    const revealOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Keep tracking the current active step in the sidebar
                if (entry.target.id) {
                    updateStepSidebar(entry.target.id);
                }
            }
        });
    }, revealOptions);

    document.querySelectorAll('.reveal').forEach(element => {
        revealObserver.observe(element);
    });

    // ----------------------------------------------------
    // 2. DYNAMIC STEP INDICATOR SYNC
    // ----------------------------------------------------
    const sidebarItems = document.querySelectorAll('.step-indicator-item');
    
    function updateStepSidebar(sectionId) {
        // Map section ID to step index
        const stepMap = {
            'step-1-sec': 'step-1-ind',
            'step-2-sec': 'step-2-ind',
            'step-3-sec': 'step-3-ind',
            'step-4-sec': 'step-4-ind',
            'step-5-sec': 'step-5-ind',
            'step-6-sec': 'step-6-ind',
            'workspace-sec': 'workspace-ind'
        };

        const targetIndicatorId = stepMap[sectionId];
        if (targetIndicatorId) {
            sidebarItems.forEach(item => {
                if (item.id === targetIndicatorId) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        }
    }

    // ----------------------------------------------------
    // 3. INTERACTIVE GUIDELINE CARD SELECTION
    // ----------------------------------------------------
    const guidelineCards = document.querySelectorAll('.guideline-card');
    const selectedGuidelineInput = document.getElementById('selected-guideline');
    const guidelineBadge = document.getElementById('selected-guideline-badge');
    const promotingQuestionInput = document.getElementById('promoting-question');

    guidelineCards.forEach(card => {
        const selectBtn = card.querySelector('.select-btn');
        if (selectBtn) {
            selectBtn.addEventListener('click', () => {
                const titleText = card.querySelector('h4').innerText.trim();
                
                // Update Worksheet Inputs
                if (selectedGuidelineInput) {
                    selectedGuidelineInput.value = titleText;
                }
                if (guidelineBadge) {
                    guidelineBadge.innerText = `Active Guideline: ${titleText}`;
                }
                
                // Formulate promoting question automatically
                if (promotingQuestionInput) {
                    promotingQuestionInput.value = `How can we promote the guideline \u201C${titleText}\u201D in a health message to Year 5/6 students?`;
                }

                // Smooth scroll to the interactive worksheet
                const workspace = document.getElementById('workspace-sec');
                if (workspace) {
                    workspace.scrollIntoView({ behavior: 'smooth' });
                }

                // Highlight selected card visually
                guidelineCards.forEach(c => c.style.borderColor = 'rgba(255, 255, 255, 0.1)');
                card.style.borderColor = '#FF4800';
            });
        }
    });

    // ----------------------------------------------------
    // 4. PRINT / PDF EXPORT VALIDATION
    // ----------------------------------------------------
    const exportBtn = document.getElementById('export-campaign-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            // Check essential fields
            const studentName = document.getElementById('student-name').value.trim();
            const dateValue = document.getElementById('date-field').value.trim();
            const guideline = selectedGuidelineInput ? selectedGuidelineInput.value.trim() : '';
            const msgSentence = document.getElementById('health-msg-sentence').value.trim();

            if (!studentName) {
                alert('CRITICAL: Please enter your Student Name before exporting!');
                document.getElementById('student-name').focus();
                return;
            }

            if (!guideline) {
                alert('CRITICAL: Please select a healthy living guideline from Step 1 before exporting!');
                document.getElementById('guidelines-sec').scrollIntoView({ behavior: 'smooth' });
                return;
            }

            if (!msgSentence) {
                alert('CRITICAL: Please write your Step 4 Health Message Sentence before exporting!');
                document.getElementById('health-msg-sentence').focus();
                return;
            }

            // All critical fields complete - invoke window print
            window.print();
        });
    }
});
