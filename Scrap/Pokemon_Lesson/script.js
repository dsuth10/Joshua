/**
 * Joshua Project - CYBERNETIC POKÉDEX Theme
 * Interactive Lesson Logic Engine
 * All interactions strictly client-side, zero external library dependencies, 100% iPad/touchscreen compatible
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       01) SCROLL REVEAL ANIMATIONS
       ========================================================================== */
    const revealOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, revealOptions);

    document.querySelectorAll('.reveal').forEach(element => {
        revealObserver.observe(element);
    });


    /* ==========================================================================
       02) INTERACTIVE LINGUISTIC QUIZ ENGINE
       ========================================================================== */
    let activeQuestion = 1;
    let quizScore = 0;
    const totalQuestions = 3;

    // Detailed, premium linguistic explanations
    const quizFeedback = {
        1: {
            correct: "CORRECT_SCAN // LOCALISATION_SUCCESSFUL\n\nExcellent. Localisation is about adaptation, not just translation. For Pokémon to succeed globally, the teams had to invent names like 'Squirtle' (squirt + turtle) and 'Bulbasaur' (bulb + dinosaur) so that children outside of Japan could immediately deduce their physical and elemental types.",
            incorrect: "SCAN_ERROR // LITERAL_TRANSLATION_FAIL\n\nIncorrect. Translating a text literally (word-for-word) often removes cultural jokes, wordplay, and descriptive clues. For instance, translating the Japanese name 'Zenigame' literally would give us 'Baby Coin Turtle'—which fails to convey its water-type characteristics to an English speaker."
        },
        2: {
            correct: "CORRECT_SCAN // MEMORY_CONSTRAINT_RESOLVED\n\nCorrect. In 1996, game cartridges had a tiny 512KB memory limit. Because text strings occupy valuable bytes, game writers were forced to avoid long descriptions. They used compact, highly precise vocabulary (e.g., 'timid', 'flees') and simple clauses to pack max detail into min characters.",
            incorrect: "SCAN_ERROR // COMPROMISED_EFFICIENCY\n\nIncorrect. Cartridge limits did not prevent written English, nor did they lead to massive stories. On the contrary, text is data, and data space was scarce. Writers had to be highly efficient, relying on expanded adjectives and short, punchy declarative sentences to convey traits."
        },
        3: {
            correct: "CORRECT_SCAN // SYNTAX_VERIFIED\n\nCorrect! Expanded noun groups are the primary linguistic tool inside Pokédex entries. By taking a central noun (e.g., 'reptile') and wrapping it with descriptive adjectives before ('timid, fire-breathing') and qualifiers after ('with a flaming tail'), writers paint a rich picture in a single sentence.",
            incorrect: "SCAN_ERROR // SYNTAX_MISALIGNMENT\n\nIncorrect. Pokédex entries are informative descriptions, so they rarely use commands (imperatives) or questions (interrogatives). Instead, they rely heavily on noun-modifier structures—specifically expanded noun groups—to describe the creatures' attributes efficiently."
        }
    };

    const optButtons = document.querySelectorAll('.opt-btn');
    const nextQBtn = document.getElementById('next-q-btn');
    const feedbackTerminal = document.getElementById('feedback-terminal');
    const terminalCursor = document.getElementById('terminal-cursor');
    const feedbackContent = document.getElementById('feedback-content');
    const scoreValDisplay = document.getElementById('quiz-score');

    optButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const btn = e.currentTarget;
            const qNum = parseInt(btn.getAttribute('data-question'));
            const isCorrect = btn.getAttribute('data-correct') === 'true';

            // 1. Disable all options for this specific question
            const currentCard = document.getElementById(`q${qNum}-card`);
            const siblingButtons = currentCard.querySelectorAll('.opt-btn');
            siblingButtons.forEach(sib => sib.disabled = true);

            // 2. Visual highlight states
            if (isCorrect) {
                btn.classList.add('correct');
                quizScore++;
                // Update score display immediately with leading zero padding
                scoreValDisplay.textContent = `${String(quizScore).padStart(2, '0')} // ${String(totalQuestions).padStart(2, '0')}`;
                
                // Terminal Feedback Update
                terminalCursor.textContent = "DECONSTRUCTION_SUCCESS";
                terminalCursor.className = "terminal-status text-accent";
                feedbackContent.innerText = quizFeedback[qNum].correct;
                feedbackTerminal.classList.add('side-accent');
            } else {
                btn.classList.add('incorrect');
                // Find and highlight correct answer as well to teach the student
                siblingButtons.forEach(sib => {
                    if (sib.getAttribute('data-correct') === 'true') {
                        sib.classList.add('correct');
                    }
                });

                // Terminal Feedback Update
                terminalCursor.textContent = "DECONSTRUCTION_FAILED";
                terminalCursor.className = "terminal-status";
                feedbackContent.innerText = quizFeedback[qNum].incorrect;
                feedbackTerminal.classList.remove('side-accent');
            }

            // 3. Mark the progress dot as completed
            const currentDot = document.getElementById(`dot-q${qNum}`);
            currentDot.classList.remove('active');
            currentDot.classList.add('completed');

            // 4. Reveal "Next Question" nav button
            nextQBtn.classList.remove('hidden');
            if (qNum === totalQuestions) {
                nextQBtn.textContent = "CONCLUDE_QUIZ";
            }
        });
    });

    nextQBtn.addEventListener('click', () => {
        if (activeQuestion < totalQuestions) {
            // Hide current active card
            const currentCard = document.getElementById(`q${activeQuestion}-card`);
            currentCard.classList.remove('active');

            // Increment and show next active card
            activeQuestion++;
            const nextCard = document.getElementById(`q${activeQuestion}-card`);
            nextCard.classList.add('active');

            // Update progress dot indicators
            const nextDot = document.getElementById(`dot-q${activeQuestion}`);
            nextDot.classList.add('active');

            // Reset terminal panel back to ready state
            terminalCursor.textContent = "AWAITING_INPUT...";
            terminalCursor.className = "terminal-status";
            feedbackContent.innerText = "Select an option on the quiz panel to initiate technical deconstruction.";
            nextQBtn.classList.add('hidden');
        } else {
            // Final slide completion event
            const finalPercent = Math.round((quizScore / totalQuestions) * 100);
            terminalCursor.textContent = "QUIZ_DECK_CONCLUDED";
            terminalCursor.className = "terminal-status text-accent";
            
            feedbackContent.innerHTML = `<strong>SCAN REPORT SUMMARY:</strong><br><br>` +
                `Total Accuracy: ${finalPercent}% (${quizScore} / ${totalQuestions} nodes verified).<br><br>` +
                `Linguistic deconstruction sequence is locked. You may now scroll down and enter the Vocabulary Matching Lab.`;
                
            nextQBtn.classList.add('hidden');
        }
    });


    /* ==========================================================================
       03) CLICK-TO-PLACE VOCABULARY MATCHING ENGINE (IPAD COMPATIBLE)
       ========================================================================== */
    let selectedTermId = null;
    const termCards = document.querySelectorAll('.term-card');
    const targetSlots = document.querySelectorAll('.target-slot');
    const verifyMatchBtn = document.getElementById('verify-match-btn');
    const resetMatchBtn = document.getElementById('reset-match-btn');
    
    const matchStatusTitle = document.getElementById('match-status-title');
    const matchStatusDesc = document.getElementById('match-status-desc');
    const correctCountDisplay = document.getElementById('correct-matches-count');

    // 1. Select Term Event
    termCards.forEach(card => {
        card.addEventListener('click', () => {
            // If already matched, lock out selection
            if (card.classList.contains('matched-correct')) return;

            if (selectedTermId === card.getAttribute('data-term')) {
                // Clicking the same card toggles selection off
                card.classList.remove('selected');
                selectedTermId = null;
                matchStatusDesc.textContent = "Connect all 4 term cards to their correct definition slots, then trigger verification scans.";
            } else {
                // Clear previous selections
                termCards.forEach(c => c.classList.remove('selected'));
                
                // Mark active selection
                card.classList.add('selected');
                selectedTermId = card.getAttribute('data-term');
                
                const title = card.querySelector('.card-title').textContent;
                matchStatusDesc.textContent = `Term selected: "${title}". Now click a matching target slot on the right to assign it.`;
            }
        });
    });

    // 2. Click Target Slot to Place Term
    targetSlots.forEach(slot => {
        slot.addEventListener('click', () => {
            const currentSlotOccupant = slot.getAttribute('data-occupied-by');

            // Case A: A term is selected and slot is empty or occupied
            if (selectedTermId !== null) {
                // If the term was already occupied in another slot, clear that previous slot first!
                targetSlots.forEach(s => {
                    if (s.getAttribute('data-occupied-by') === selectedTermId) {
                        clearSlot(s);
                    }
                });

                // Place the selected term into this slot
                placeTermInSlot(slot, selectedTermId);
                
                // Clear selection state
                termCards.forEach(c => c.classList.remove('selected'));
                selectedTermId = null;
                matchStatusDesc.textContent = "Connection recorded. You can click on another term card or press 'VERIFY_CONNECTIONS' when ready.";
            } 
            // Case B: No term is selected, but user clicks an occupied slot (this clears it!)
            else if (currentSlotOccupant !== null) {
                clearSlot(slot);
                matchStatusDesc.textContent = "Connection removed. Select a term card on the left to re-assign.";
            }
        });
    });

    function placeTermInSlot(slot, termId) {
        const matchingCard = document.getElementById(`term-${termId}`);
        const cardTitle = matchingCard.querySelector('.card-title').textContent;
        const cardNum = matchingCard.querySelector('.card-num').textContent;

        slot.setAttribute('data-occupied-by', termId);
        slot.innerHTML = `<span class="placed-card-tag">[${cardNum}] ${cardTitle}</span>`;
        slot.classList.add('occupied');
        
        // Mark card as active-linked (visual indicator)
        matchingCard.style.opacity = "0.75";
        matchingCard.style.borderColor = "var(--sub-accent)";
        
        // Remove individual verification borders if they were active
        slot.classList.remove('correct-match', 'incorrect-match');
    }

    function clearSlot(slot) {
        const occupiedBy = slot.getAttribute('data-occupied-by');
        if (occupiedBy) {
            const card = document.getElementById(`term-${occupiedBy}`);
            if (card) {
                card.style.opacity = "1";
                card.style.borderColor = "rgba(255, 255, 255, 0.12)";
            }
        }
        
        slot.removeAttribute('data-occupied-by');
        const expectedNum = slot.getAttribute('data-expected');
        slot.innerHTML = `<span class="slot-placeholder">CLICK TO MATCH T.0${expectedNum}...</span>`;
        slot.classList.remove('occupied', 'correct-match', 'incorrect-match');
    }

    // 3. Verify Match Handler
    verifyMatchBtn.addEventListener('click', () => {
        let correctCount = 0;
        let allOccupied = true;

        targetSlots.forEach(slot => {
            const occupantId = slot.getAttribute('data-occupied-by');
            const expectedId = slot.getAttribute('data-expected');

            if (!occupantId) {
                allOccupied = false;
                slot.classList.add('incorrect-match');
                return;
            }

            // Remove previous checks
            slot.classList.remove('correct-match', 'incorrect-match');

            if (occupantId === expectedId) {
                correctCount++;
                slot.classList.add('correct-match');
                
                // Permanently lock out the matched term card
                const matchingCard = document.getElementById(`term-${occupantId}`);
                matchingCard.classList.add('matched-correct');
                matchingCard.style.opacity = "0.4";
            } else {
                slot.classList.add('incorrect-match');
            }
        });

        // Update score indicators
        correctCountDisplay.textContent = `${correctCount} / 4`;

        if (correctCount === 4) {
            matchStatusTitle.textContent = "GRID_VERIFIED";
            matchStatusTitle.className = "status-indicator success";
            matchStatusDesc.innerHTML = "<strong>GEN_V9_INTEGRITY_LOCKED!</strong><br><br>All vocabulary mappings have matched their semantic equivalents perfectly. Excellent linguistic analytical scanning.";
        } else {
            matchStatusTitle.textContent = "ERROR_DETECTED";
            matchStatusTitle.className = "status-indicator error";
            matchStatusDesc.textContent = "Visual alignment error. Incorrect mappings have been highlighted in crimson. Click on an incorrect slot to release the card and attempt re-routing.";
        }
    });

    // 4. Reset Match Handler
    resetMatchBtn.addEventListener('click', () => {
        targetSlots.forEach(slot => clearSlot(slot));
        termCards.forEach(card => {
            card.classList.remove('matched-correct', 'selected');
            card.style.opacity = "1";
            card.style.borderColor = "rgba(255, 255, 255, 0.12)";
        });
        
        selectedTermId = null;
        correctCountDisplay.textContent = "0 / 4";
        matchStatusTitle.textContent = "PENDING_PLACEMENTS";
        matchStatusTitle.className = "status-indicator warning";
        matchStatusDesc.textContent = "Connect all 4 term cards to their correct definition slots, then trigger verification scans.";
    });


    /* ==========================================================================
       04) DYNAMIC NOUN GROUP SELECTOR CYCLE
       ========================================================================== */
    const builderData = {
        adjectives: [
            "A sneaky, shadow-dwelling",
            "A fierce, fire-breathing",
            "A massive, armored, water-spouting",
            "A tiny, high-voltage, yellow",
            "A majestic, soaring, telepathic"
        ],
        nouns: [
            "ghost",
            "reptile",
            "turtle",
            "rodent",
            "phoenix"
        ],
        qualifiers: [
            "with a mischievous grin.",
            "with a flaming tail and sharp claws.",
            "with heavy water cannons on its shell.",
            "with bright crimson cheeks.",
            "with a crown of golden feathers."
        ]
    };

    const selectAdj = document.getElementById('selector-adj');
    const selectNoun = document.getElementById('selector-noun');
    const selectQual = document.getElementById('selector-qual');
    const outputConsole = document.getElementById('dynamic-noun-group-output');

    function updateDynamicOutput() {
        const adjIdx = parseInt(selectAdj.getAttribute('data-current'));
        const nounIdx = parseInt(selectNoun.getAttribute('data-current'));
        const qualIdx = parseInt(selectQual.getAttribute('data-current'));

        const adjectiveVal = builderData.adjectives[adjIdx];
        const nounVal = builderData.nouns[nounIdx];
        const qualVal = builderData.qualifiers[qualIdx];

        // Format outputs dynamically
        outputConsole.innerHTML = `"${adjectiveVal} <span class="text-accent">${nounVal}</span> ${qualVal}"`;
        
        // Add momentary highlight glow to console output box
        outputConsole.parentElement.style.borderColor = "var(--sub-accent)";
        setTimeout(() => {
            outputConsole.parentElement.style.borderColor = "var(--accent)";
        }, 150);
    }

    // Set up click listeners for each dynamic segment selector
    selectAdj.addEventListener('click', () => {
        let current = parseInt(selectAdj.getAttribute('data-current'));
        current = (current + 1) % builderData.adjectives.length;
        selectAdj.setAttribute('data-current', current);
        selectAdj.querySelector('.active-val').textContent = builderData.adjectives[current];
        updateDynamicOutput();
    });

    selectNoun.addEventListener('click', () => {
        let current = parseInt(selectNoun.getAttribute('data-current'));
        current = (current + 1) % builderData.nouns.length;
        selectNoun.setAttribute('data-current', current);
        selectNoun.querySelector('.active-val').textContent = builderData.nouns[current];
        updateDynamicOutput();
    });

    selectQual.addEventListener('click', () => {
        let current = parseInt(selectQual.getAttribute('data-current'));
        current = (current + 1) % builderData.qualifiers.length;
        selectQual.setAttribute('data-current', current);
        selectQual.querySelector('.active-val').textContent = builderData.qualifiers[current];
        updateDynamicOutput();
    });


    /* ==========================================================================
       05) INTERACTIVE COMPLETION CHECKLIST & SELF-ASSESSMENT
       ========================================================================== */
    const checkboxes = document.querySelectorAll('.check-box');
    const completionStatus = document.getElementById('completion-status');
    const completionDesc = document.getElementById('completion-desc');

    checkboxes.forEach(box => {
        box.addEventListener('change', () => {
            const allChecked = Array.from(checkboxes).every(cb => cb.checked);

            if (allChecked) {
                completionStatus.textContent = "REPORT_COMPLETE";
                completionStatus.className = "status-indicator success";
                completionDesc.innerHTML = "<strong>CONGRATULATIONS!</strong><br><br>You have verified all three learning outcomes for this unit. Show your teacher your completed physical worksheet and dynamic Pokédex build to conclude the sequence!";
            } else {
                completionStatus.textContent = "REPORT_INCOMPLETE";
                completionStatus.className = "status-indicator error";
                completionDesc.textContent = "Check all learning outcomes on the checklist to sign off on this multimodal sequence.";
            }
        });
    });

});
