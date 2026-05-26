/**
 * HASS Year 5 - HOW A BILL BECOMES A LAW
 * Interactive Parliament Simulation Script
 * Theme: Radical River Brutalism
 */

// Global State Object
const state = {
    currentStage: 0,
    selectedIssue: null, // 'a', 'b', or 'c'
    selectedSponsor: {
        id: null,
        name: "",
        title: "",
        emoji: ""
    },
    billTitle: "",
    selectedClause: "",
    houseSpeech: "",
    houseVotePassed: false,
    houseVotes: { aye: 0, no: 0 },
    senateConsensusChoice: null,
    senateVotePassed: false,
    senateVotes: { aye: 0, no: 0 },
    signatureLocked: false,
    royalAssentStamped: false
};

// Database of Issues, Clauses, Debates & Consensus Questions
const issueDatabase = {
    a: {
        id: "a",
        category: "ENVIRONMENT",
        shortName: "Marine Plastic Ban",
        defaultTitle: "Plastic Bag and Straw Protection Bill 2026",
        clauses: [
            {
                id: "clause-a1",
                text: "Retailers throughout Australia shall be prohibited from supplying single-use plastic shopping bags and straws, requiring a transition to fabric or paper bags by December 2026."
            },
            {
                id: "clause-a2",
                text: "Commercial shipping vessels and fishing operators face penalties and fines of up to $50,000 for discarding plastic nets, lines, or general waste into Australian marine territories."
            },
            {
                id: "clause-a3",
                text: "All Commonwealth-managed beaches and national park waterways are declared 'Zero Plastic Sanctuary Zones' with an on-the-spot $200 fine for any synthetic littering."
            }
        ],
        speechSuggestions: ["Great Barrier Reef", "marine turtles", "plastic pollution", "eco-friendly alternatives", "future generations", "coastal cleanups"],
        houseDebate: [
            { speaker: "Marcus Vance (MP for Kennedy)", side: "right", text: "While we care deeply about marine animals, what about our local fish and chip shops? Will paper packaging increase costs for small family businesses in coastal towns?" },
            { speaker: "Aisha Khan (MP for Lilley)", side: "left", text: "This bill includes provisions for Queensland's tourism. Our Great Barrier Reef brings in over $6 billion a year. A clean beach means thriving local economies!" },
            { speaker: "Zoe Chen (MP for Melbourne)", side: "left", text: "Australians use millions of single-use bags daily. They block storm drains and harm sea turtles. We must lead the globe in environmental protection." }
        ],
        senateChallenge: {
            question: "Regional Senators worry that country bakeries and small grocers cannot source paper alternatives quickly enough and might face immediate fines.",
            options: [
                {
                    id: "opt-a1",
                    score: "correct",
                    text: "Create a regional transition grant to subsidise compostable packaging and delay fines in rural areas for 12 months.",
                    feedback: "EXCELLENT CONSENSUS! This reassures rural businesses and secures the support of independent Senators."
                },
                {
                    id: "opt-a2",
                    score: "partial",
                    text: "Exempt any businesses with fewer than 5 employees from the ban permanently.",
                    feedback: "PARTIAL consensus. It helps small shops, but leaves a massive loop-hole allowing plastic to continue being distributed."
                },
                {
                    id: "opt-a3",
                    score: "fail",
                    text: "Reject their concerns. Assert that saving marine life takes priority over packaging sourcing delays.",
                    feedback: "FAIL! The regional Senators are offended and threaten to block the bill. Consensus is broken!"
                }
            ]
        }
    },
    b: {
        id: "b",
        category: "SAFETY",
        shortName: "E-Scooter Park Safety",
        defaultTitle: "Electric Scooter and Park Pathway Regulation Bill 2026",
        clauses: [
            {
                id: "clause-b1",
                text: "Every person riding an electric scooter, skateboard, or bicycle on designated shared council pathways must wear a securely fitted safety helmet, carrying a penalty of $150."
            },
            {
                id: "clause-b2",
                text: "The maximum allowable speed for motorized micro-mobility transport devices on park footpaths and shared boardwalks is capped at 12 km/h."
            },
            {
                id: "clause-b3",
                text: "Shared rental e-scooter operators are legally mandated to install smart GPS geofencing to automatically disable motor throttle in busy pedestrian plazas and playground perimeters."
            }
        ],
        speechSuggestions: ["pedestrian safety", "shared pathways", "injury prevention", "protective helmets", "geofencing rules", "accessible parks", "elderly safety"],
        houseDebate: [
            { speaker: "Aisha Khan (MP for Lilley)", side: "right", text: "If we enforce a $150 fine on kids riding scooters without helmets, will we just stop kids from exercising outdoors? We don't want police chasing children!" },
            { speaker: "Marcus Vance (MP for Kennedy)", side: "left", text: "As sponsor of this safety measure, I say: this is about prevention. Every week, hospitals treat severe head injuries from pathway accidents. Helmets save lives!" },
            { speaker: "Zoe Chen (MP for Melbourne)", side: "left", text: "Pedestrians, including elderly walkers and young parents with strollers, deserve to feel safe in park environments without e-scooters flying past at high speeds." }
        ],
        senateChallenge: {
            question: "Senators raise concerns that police might target low-income teenagers who cannot afford premium safety helmets, leading to unfair debt.",
            options: [
                {
                    id: "opt-b1",
                    score: "correct",
                    text: "Lower the first penalty to a caution for under-16s, and establish local library schemes giving away free safety helmets.",
                    feedback: "BRILLIANT CONSENSUS! You address equity, safety, and community support in one go. The Senate is highly impressed!"
                },
                {
                    id: "opt-b2",
                    score: "partial",
                    text: "Change the helmet rule so it only applies to rental scooters, leaving private scooters unregulated.",
                    feedback: "WEAK consensus. Senators accept it, but it leaves private scooter riders unprotected, which defeats the safety goal."
                },
                {
                    id: "opt-b3",
                    score: "fail",
                    text: "Increase park police funding to strictly hand out fines, insisting that law enforcement must be uncompromised.",
                    feedback: "FAIL! Senators block the funding bill, calling the approach aggressive and unsympathetic to young families."
                }
            ]
        }
    },
    c: {
        id: "c",
        category: "HEALTH",
        shortName: "School Canteen Nutrition",
        defaultTitle: "Healthy Canteen and School Nutrition Standards Bill 2026",
        clauses: [
            {
                id: "clause-c1",
                text: "The sale of high-sugar carbonated beverages, energy drinks, and highly processed confectionery is prohibited on all government school campuses."
            },
            {
                id: "clause-c2",
                text: "School tuckshops and canteens must ensure that healthy green-rated items (fresh fruit, wraps, water, dairy) constitute a minimum of 60% of their advertised menu."
            },
            {
                id: "clause-c3",
                text: "Fast-food franchises and high-sugar brand logos are prohibited from sponsoring primary school sporting teams, uniforms, and school athletic equipment."
            }
        ],
        speechSuggestions: ["active brains", "sugar spikes", "classroom focus", "nutrition standards", "tuckshop menus", "healthy habits", "childhood wellbeing"],
        houseDebate: [
            { speaker: "Zoe Chen (MP for Melbourne)", side: "right", text: "Many volunteer-run parent committees rely on chocolate and pie days to buy computers and shade sails. Won't healthy canteens lower tuckshop profits?" },
            { speaker: "Marcus Vance (MP for Kennedy)", side: "left", text: "Schools are places of learning. If we teach health education in class, our school canteens must lead by example instead of selling junk foods." },
            { speaker: "Aisha Khan (MP for Lilley)", side: "left", text: "Sugary sodas cause energy crashes, leading to low concentration after lunch. A healthy lunch creates active, focused brains." }
        ],
        senateChallenge: {
            question: "Senators representing agricultural regions protest that the sugary drink ban could harm local orange and apple orchard farmers who supply real fruit juice to canteens.",
            options: [
                {
                    id: "opt-c1",
                    score: "correct",
                    text: "Amend the bill to explicitly allow natural, 100% Australian fruit juice sales, while keeping artificial sodas and energy drinks banned.",
                    feedback: "SUPERB CONSENSUS! You protect agricultural jobs and ensure school kids have access to real fruit options. The Senate passes this unanimously!"
                },
                {
                    id: "opt-c2",
                    score: "partial",
                    text: "Provide a direct financial grant to tuckshops to buy local fruit, but keep fruit juice completely banned.",
                    feedback: "MODERATE consensus. It costs the government extra money, but regional farmers are still upset about the juice ban."
                },
                {
                    id: "opt-c3",
                    score: "fail",
                    text: "Maintain that all juices are high in sugar and must be banned, advising farmers to seek international export markets.",
                    feedback: "FAIL! Regional Senators band together to filibuster the bill. The agriculture block breaks consensus completely!"
                }
            ]
        }
    }
};

// Target DOM Elements cache
let sigCanvas, ctx, isDrawing = false;

// Initialize on DOM Load
window.addEventListener("DOMContentLoaded", () => {
    initSignaturePad();
    setupEventListeners();
    updateUIForStage();
    
    // Status Indicator Initial Log
    logSystemStatus("SIMULATION LOADED // STANDBY");
});

// Setup App-wide Button & Key Listeners
function setupEventListeners() {
    // Live update the bill preview as the user types the title
    const billTitleInput = document.getElementById("input-bill-title");
    if (billTitleInput) {
        billTitleInput.addEventListener("input", (e) => {
            state.billTitle = e.target.value;
            document.getElementById("preview-bill-name").innerText = state.billTitle || "Untitled Bill 2026";
            validateStage2Button();
        });
    }

    // Monitor speech notepad input length
    const houseSpeechInput = document.getElementById("input-house-speech");
    if (houseSpeechInput) {
        houseSpeechInput.addEventListener("input", (e) => {
            state.houseSpeech = e.target.value;
            const words = state.houseSpeech.trim().split(/\s+/).filter(w => w.length > 0).length;
            document.getElementById("notepad-char-count").innerText = `${words} WORDS`;
            
            // Require at least 5 words for speech validation
            const debateSubmitBtn = document.getElementById("btn-submit-debate");
            if (words >= 5) {
                debateSubmitBtn.classList.remove("btn-disabled");
            } else {
                debateSubmitBtn.classList.add("btn-disabled");
            }
        });
    }
}

// System Status Bar Logging
function logSystemStatus(msg) {
    const indicator = document.getElementById("current-action-indicator");
    if (indicator) {
        indicator.innerText = `SYS_STATUS: ${msg.toUpperCase()}`;
    }
}

// Stage Switching Engine
function goToStage(stageNum) {
    if (stageNum < 0 || stageNum > 7) return;
    
    // Deactivate previous stage view
    const currentActiveStage = document.querySelector(".stage.active");
    if (currentActiveStage) {
        currentActiveStage.classList.remove("active");
    }
    
    state.currentStage = stageNum;
    
    // Activate new stage view
    const targetStageEl = document.getElementById(`stage-${state.currentStage}`);
    if (targetStageEl) {
        // Simple trick to trigger CSS transitions after display switch
        setTimeout(() => {
            targetStageEl.classList.add("active");
        }, 30);
    }
    
    // Update Progress Tracker bar state
    const steps = document.querySelectorAll(".progress-step");
    steps.forEach((step, idx) => {
        step.classList.remove("current", "completed");
        if (idx === state.currentStage) {
            step.classList.add("current");
        } else if (idx < state.currentStage) {
            step.classList.add("completed");
        }
    });

    updateUIForStage();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Update specific elements depending on active stage view
function updateUIForStage() {
    logSystemStatus(`STAGE_${state.currentStage} // ACTIVE`);
    
    switch(state.currentStage) {
        case 0:
            logSystemStatus("WELCOME CHAMBER // INITIALISING");
            break;
            
        case 1:
            // Issue selection view
            logSystemStatus("SELECTING COMMUNITY ISSUE");
            validateStage1Button();
            break;
            
        case 2:
            // Drafting & Sponsor Selection
            logSystemStatus("DRAFTING LEGISLATION");
            setupStage2DraftingPanel();
            break;
            
        case 3:
            // House debate setup
            logSystemStatus("HOUSE OF REPS // IN DEBATE");
            setupStage3DebateFeed();
            break;
            
        case 4:
            // House Vote Screen
            logSystemStatus("HOUSE OF REPS // VOTING SYSTEM");
            resetVotingInterface();
            break;
            
        case 5:
            // Senate Debate & Consensus Questions
            logSystemStatus("THE SENATE // REVIEW COMMITTEE");
            setupStage5SenateFeed();
            break;
            
        case 6:
            // Governor General desk setup
            logSystemStatus("GOVERNOR-GENERAL OFFICE // DESK");
            setupStage6RoyalAssentDesk();
            break;
            
        case 7:
            // Act of Parliament Final Certificate Output
            logSystemStatus("ACT OF PARLIAMENT // PASSED LAW");
            buildFinalActCertificate();
            break;
    }
}

// ================= STAGE 1: ISSUE SELECTION =================

function selectIssue(issueType) {
    state.selectedIssue = issueType;
    
    // Update active highlight classes on cards
    const cards = ["a", "b", "c"];
    cards.forEach(c => {
        const card = document.getElementById(`issue-card-${c}`);
        const label = document.getElementById(`issue-select-label-${c}`);
        if (c === issueType) {
            card.classList.add("selected");
            label.innerText = "SELECTED ISSUE [✔]";
            label.style.color = "var(--accent)";
        } else {
            card.classList.remove("selected");
            label.innerText = "SELECT ISSUE →";
            label.style.color = "var(--text-muted)";
        }
    });
    
    validateStage1Button();
}

function validateStage1Button() {
    const btn = document.getElementById("btn-submit-issue");
    if (state.selectedIssue) {
        btn.classList.remove("btn-disabled");
    } else {
        btn.classList.add("btn-disabled");
    }
}

// ================= STAGE 2: BILL DRAFTING & SPONSOR =================

function selectAvatar(mpId, name, title, emoji) {
    state.selectedSponsor = { id: mpId, name, title, emoji };
    
    // Update active highlight classes on cards
    const avatars = ["mp1", "mp2", "mp3"];
    avatars.forEach(id => {
        const av = document.getElementById(`avatar-${id}`);
        if (id === mpId) {
            av.classList.add("selected");
        } else {
            av.classList.remove("selected");
        }
    });
    
    // Update preview document in real-time
    document.getElementById("preview-bill-sponsor").innerText = `${state.selectedSponsor.emoji} ${state.selectedSponsor.name} (${state.selectedSponsor.title})`;
    
    validateStage2Button();
}

function setupStage2DraftingPanel() {
    const db = issueDatabase[state.selectedIssue];
    
    // Injected default title if user hasn't typed anything yet
    if (!state.billTitle) {
        state.billTitle = db.defaultTitle;
        document.getElementById("input-bill-title").value = state.billTitle;
        document.getElementById("preview-bill-name").innerText = state.billTitle;
    }

    // Populate the Clause list radio pills
    const container = document.getElementById("clause-options-container");
    container.innerHTML = "";
    
    db.clauses.forEach((cl, idx) => {
        const pill = document.createElement("div");
        pill.className = "option-pill";
        pill.id = `clause-pill-${idx}`;
        pill.onclick = () => selectClause(idx, cl.text);
        
        // Highlight if already selected previously
        if (state.selectedClause === cl.text) {
            pill.classList.add("selected");
        }
        
        pill.innerHTML = `
            <span class="option-bullet"></span>
            <div>
                <strong>CLAUSE 0${idx + 1}:</strong> ${cl.text}
            </div>
        `;
        container.appendChild(pill);
    });
}

function selectClause(index, text) {
    state.selectedClause = text;
    
    // Reset highlights on all pills
    const pills = document.querySelectorAll("#clause-options-container .option-pill");
    pills.forEach((p, idx) => {
        if (idx === index) {
            p.classList.add("selected");
        } else {
            p.classList.remove("selected");
        }
    });
    
    // Update preview document
    document.getElementById("preview-bill-clause").innerText = text;
    
    validateStage2Button();
}

function validateStage2Button() {
    const btn = document.getElementById("btn-submit-bill");
    if (state.selectedSponsor.id && state.billTitle.trim().length > 0 && state.selectedClause) {
        btn.classList.remove("btn-disabled");
    } else {
        btn.classList.add("btn-disabled");
    }
}

// ================= STAGE 3: HOUSE DEBATE FEED =================

function setupStage3DebateFeed() {
    const db = issueDatabase[state.selectedIssue];
    const chatBox = document.getElementById("debate-chat-house");
    chatBox.innerHTML = "";
    
    // Populate Speech notepad vocabulary suggestions
    const suggestionsList = document.getElementById("notepad-suggestions-list");
    suggestionsList.innerHTML = "";
    db.speechSuggestions.forEach(word => {
        const pill = document.createElement("span");
        pill.className = "suggestion-pill";
        pill.innerText = `+ ${word}`;
        pill.onclick = () => insertWordIntoSpeech(word);
        suggestionsList.appendChild(pill);
    });

    // Animate and roll out simulated MP debate entries
    let msgIndex = 0;
    
    function loadNextMessage() {
        if (msgIndex < db.houseDebate.length) {
            document.getElementById("debate-typing-house").style.display = "block";
            
            // Artificial delay to simulate typing
            setTimeout(() => {
                document.getElementById("debate-typing-house").style.display = "none";
                const msg = db.houseDebate[msgIndex];
                
                const msgEl = document.createElement("div");
                msgEl.className = `debate-msg speaker-${msg.side}`;
                msgEl.innerHTML = `
                    <div class="debate-msg-meta">${msg.speaker}</div>
                    <div class="debate-msg-body">${msg.text}</div>
                `;
                chatBox.appendChild(msgEl);
                chatBox.scrollTop = chatBox.scrollHeight;
                
                msgIndex++;
                loadNextMessage();
            }, 3000);
        }
    }
    
    loadNextMessage();
}

function insertWordIntoSpeech(word) {
    const textarea = document.getElementById("input-house-speech");
    const currentText = textarea.value;
    textarea.value = currentText ? `${currentText} ${word}` : `I sponsor this bill to protect ${word}`;
    
    // Trigger the input character listener
    textarea.dispatchEvent(new Event("input"));
    textarea.focus();
}

// ================= STAGE 4: VOTING SYSTEM INTERACTIVE =================

function resetVotingInterface() {
    document.getElementById("tally-aye").innerText = "00";
    document.getElementById("tally-no").innerText = "00";
    document.getElementById("bar-aye").style.width = "0%";
    document.getElementById("bar-no").style.width = "0%";
    
    document.getElementById("vote-outcome-badge").style.display = "none";
    document.getElementById("btn-proceed-senate").classList.add("btn-disabled");
    document.getElementById("btn-start-vote").classList.remove("btn-disabled");
    
    // Draw empty Seats grid (151 seats total for Australian HoR)
    const grid = document.getElementById("parliament-seats");
    grid.innerHTML = "";
    for (let i = 0; i < 151; i++) {
        const seat = document.createElement("div");
        seat.className = "parl-seat";
        seat.id = `seat-${i}`;
        grid.appendChild(seat);
    }
}

function runVotingSimulation() {
    document.getElementById("btn-start-vote").classList.add("btn-disabled");
    logSystemStatus("HOUSE OF REPS // CASTING BALLOTS");
    
    let ayes = 0;
    let noes = 0;
    let seatIndex = 0;
    
    // Target counts. We simulate a supportive vote if speech is detailed.
    const words = state.houseSpeech.trim().split(/\s+/).length;
    let targetAyes = 76; // Minimum to pass out of 151
    
    if (words > 25) {
        targetAyes = 92; // Passes robustly
    } else if (words > 12) {
        targetAyes = 81; // Passes comfortably
    } else {
        targetAyes = 77; // Squeaks by
    }
    
    const targetNoes = 151 - targetAyes;
    
    // Shuffle seat assignments to make animation visual patterns look random
    const seatOrder = Array.from({length: 151}, (_, i) => i);
    shuffleArray(seatOrder);
    
    const interval = setInterval(() => {
        if (seatIndex < 151) {
            const seatNum = seatOrder[seatIndex];
            const seat = document.getElementById(`seat-${seatNum}`);
            
            // Allocate Vote based on target tallies
            if (ayes < targetAyes && (Math.random() < 0.6 || noes >= targetNoes)) {
                ayes++;
                seat.classList.add("voted-aye");
            } else {
                noes++;
                seat.classList.add("voted-no");
            }
            
            // Format tallies with leading zeros
            document.getElementById("tally-aye").innerText = String(ayes).padStart(2, '0');
            document.getElementById("tally-no").innerText = String(noes).padStart(2, '0');
            
            // Live fill progress bars
            document.getElementById("bar-aye").style.width = `${(ayes / 151) * 100}%`;
            document.getElementById("bar-no").style.width = `${(noes / 151) * 100}%`;
            
            seatIndex++;
        } else {
            clearInterval(interval);
            finishVotingOutcome(ayes, noes);
        }
    }, 30);
}

function finishVotingOutcome(ayes, noes) {
    state.houseVotes = { aye: ayes, no: noes };
    state.houseVotePassed = ayes > noes;
    
    const badge = document.getElementById("vote-outcome-badge");
    badge.style.display = "inline-block";
    
    if (state.houseVotePassed) {
        badge.innerText = `PASSED // AYES: ${ayes} vs NOES: ${noes}`;
        badge.style.backgroundColor = "var(--hor-green-bright)";
        badge.style.color = "var(--text-dark)";
        document.getElementById("btn-proceed-senate").classList.remove("btn-disabled");
        logSystemStatus("HOUSE OF REPS // BILL PASSED");
    } else {
        // Backup safety check: simulation should theoretically always pass for learning purposes,
        // but if not, let them proceed with a warning.
        badge.innerText = `REJECTED // AYES: ${ayes} vs NOES: ${noes}`;
        badge.style.backgroundColor = "var(--senate-red-bright)";
        badge.style.color = "#FFFFFF";
    }
}

// ================= STAGE 5: SENATE DEBATE & CONSENSUS =================

function setupStage5SenateFeed() {
    const db = issueDatabase[state.selectedIssue];
    const chatBox = document.getElementById("debate-chat-senate");
    chatBox.innerHTML = "";
    
    // Inject first message from Opposition Leader in Senate
    const welcomeMsg = document.createElement("div");
    welcomeMsg.className = "debate-msg speaker-right";
    welcomeMsg.innerHTML = `
        <div class="debate-msg-meta">Senator Rachel Warren (Leader of the Opposition in Senate)</div>
        <div class="debate-msg-body">This bill has passed the House of Representatives, but as Senators, our job is to act as a chamber of review. We have serious doubts about the details of these provisions...</div>
    `;
    chatBox.appendChild(welcomeMsg);

    // Setup Consensus questions
    const challenge = db.senateChallenge;
    document.getElementById("senate-challenge-question").innerText = challenge.question;
    
    const container = document.getElementById("senate-options-container");
    container.innerHTML = "";
    
    challenge.options.forEach((opt, idx) => {
        const pill = document.createElement("div");
        pill.className = "option-pill";
        pill.id = `senate-opt-${idx}`;
        pill.onclick = () => selectSenateConsensus(idx, opt);
        
        pill.innerHTML = `
            <span class="option-bullet"></span>
            <div>
                <strong>OPTION 0${idx + 1}:</strong> ${opt.text}
            </div>
        `;
        container.appendChild(pill);
    });
}

function selectSenateConsensus(index, option) {
    state.senateConsensusChoice = option;
    
    // Update active highlight classes on pills
    const pills = document.querySelectorAll("#senate-options-container .option-pill");
    pills.forEach((p, idx) => {
        if (idx === index) {
            p.classList.add("selected");
        } else {
            p.classList.remove("selected");
        }
    });

    // Populate feedback immediately in Senate chat feed
    const chatBox = document.getElementById("debate-chat-senate");
    
    // Remove any previous feedback messages
    const oldFeedback = document.querySelectorAll(".feedback-msg");
    oldFeedback.forEach(f => f.remove());
    
    document.getElementById("debate-typing-senate").style.display = "block";
    
    setTimeout(() => {
        document.getElementById("debate-typing-senate").style.display = "none";
        
        const feedbackEl = document.createElement("div");
        feedbackEl.className = "debate-msg speaker-left feedback-msg";
        
        let colorClass = "var(--text-muted)";
        if (option.score === "correct") {
            colorClass = "var(--hor-green-bright)";
            document.getElementById("btn-senate-vote").classList.remove("btn-disabled");
        } else if (option.score === "partial") {
            colorClass = "var(--accent)";
            document.getElementById("btn-senate-vote").classList.remove("btn-disabled");
        } else {
            colorClass = "var(--senate-red-bright)";
            document.getElementById("btn-senate-vote").classList.add("btn-disabled");
        }
        
        feedbackEl.innerHTML = `
            <div class="debate-msg-meta">Senate Committee Reviewer</div>
            <div class="debate-msg-body" style="border: 2px solid ${colorClass}; background: rgba(0,0,0,0.5);">
                <strong style="color: ${colorClass};">${option.score.toUpperCase()}!</strong><br>
                ${option.feedback}
            </div>
        `;
        chatBox.appendChild(feedbackEl);
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 800);
}

function runSenateVoting() {
    logSystemStatus("THE SENATE // CALLING FINAL VOTE");
    
    let targetAyes = 39; // Senate has 76 seats, 39 needed to pass
    if (state.senateConsensusChoice.score === "correct") {
        targetAyes = 58; // Passes with wide support
    } else {
        targetAyes = 41; // Passes by a narrow margin
    }
    
    const targetNoes = 76 - targetAyes;
    state.senateVotes = { aye: targetAyes, no: targetNoes };
    state.senateVotePassed = true;
    
    // Append vote results directly in chat box
    const chatBox = document.getElementById("debate-chat-senate");
    const voteResultEl = document.createElement("div");
    voteResultEl.className = "debate-msg speaker-right";
    voteResultEl.innerHTML = `
        <div class="debate-msg-meta">Senate Clerk Tally</div>
        <div class="debate-msg-body" style="background:#000; border: 1px solid var(--accent);">
            <strong>SENATE VOTE PASSED!</strong><br>
            AYES (YES): ${targetAyes}<br>
            NOES: ${targetNoes}<br>
            <em>The Bill is certified and prepared for Royal Assent.</em>
        </div>
    `;
    chatBox.appendChild(voteResultEl);
    chatBox.scrollTop = chatBox.scrollHeight;
    
    // Delay slightly before shifting to Governor General stage
    setTimeout(() => {
        goToStage(6);
    }, 3000);
}

// ================= STAGE 6: ROYAL ASSENT OFFICE =================

function setupStage6RoyalAssentDesk() {
    state.signatureLocked = false;
    state.royalAssentStamped = false;
    
    document.getElementById("gg-bill-title").innerText = state.billTitle.toUpperCase();
    document.getElementById("gg-bill-sponsor").innerText = `Introduced by ${state.selectedSponsor.emoji} ${state.selectedSponsor.name} (${state.selectedSponsor.title})`;
    document.getElementById("gg-bill-summary").innerText = state.selectedClause;
    
    // Reset desk widgets
    const stampTarget = document.getElementById("gg-seal-target");
    stampTarget.innerHTML = "WAX SEAL AREA";
    stampTarget.className = "gg-seal-space";
    
    document.getElementById("signature-preview-container").innerText = "";
    document.getElementById("btn-give-assent").classList.add("btn-disabled");
    document.getElementById("btn-proceed-act").classList.add("btn-disabled");
    
    clearSignature();
}

function initSignaturePad() {
    sigCanvas = document.getElementById("canvas-sig");
    if (!sigCanvas) return;
    
    ctx = sigCanvas.getContext("2d");
    
    // Fix canvas coordinates to match CSS boxes
    const rect = sigCanvas.getBoundingClientRect();
    sigCanvas.width = rect.width;
    sigCanvas.height = rect.height;
    
    ctx.strokeStyle = "#0000FF"; // Blue signature ink
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    
    // Setup drawing handlers for mouse
    sigCanvas.addEventListener("mousedown", startDrawing);
    sigCanvas.addEventListener("mousemove", draw);
    sigCanvas.addEventListener("mouseup", stopDrawing);
    sigCanvas.addEventListener("mouseleave", stopDrawing);
    
    // Setup drawing handlers for mobile devices
    sigCanvas.addEventListener("touchstart", (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent("mousedown", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        sigCanvas.dispatchEvent(mouseEvent);
    });
    
    sigCanvas.addEventListener("touchmove", (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent("mousemove", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        sigCanvas.dispatchEvent(mouseEvent);
    });
    
    sigCanvas.addEventListener("touchend", (e) => {
        e.preventDefault();
        const mouseEvent = new MouseEvent("mouseup", {});
        sigCanvas.dispatchEvent(mouseEvent);
    });
}

function startDrawing(e) {
    if (state.signatureLocked) return;
    isDrawing = true;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
}

function draw(e) {
    if (!isDrawing || state.signatureLocked) return;
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
}

function stopDrawing() {
    isDrawing = false;
}

function getPos(e) {
    const rect = sigCanvas.getBoundingClientRect();
    // Support touch scaling/offsets safely
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    
    return {
        x: clientX - rect.left,
        y: clientY - rect.top
    };
}

function clearSignature() {
    if (ctx && sigCanvas) {
        ctx.clearRect(0, 0, sigCanvas.width, sigCanvas.height);
        state.signatureLocked = false;
        document.getElementById("btn-give-assent").classList.add("btn-disabled");
    }
}

function lockSignature() {
    state.signatureLocked = true;
    document.getElementById("signature-preview-container").innerText = "Signed: GG_Assent_2026";
    document.getElementById("btn-give-assent").classList.remove("btn-disabled");
    logSystemStatus("SIGNATURE RECORDED // STANDBY FOR SEAL");
}

function applyRoyalAssentStamp() {
    if (!state.signatureLocked) return;
    
    state.royalAssentStamped = true;
    logSystemStatus("ROYAL ASSENT SEAL APPLIED");
    
    // Inject the Wax Seal component dynamically
    const stampTarget = document.getElementById("gg-seal-target");
    stampTarget.className = "gg-seal-space stamped";
    stampTarget.innerHTML = `
        <div class="wax-seal">
            <div>ROYAL</div>
            <div>ASSENT</div>
        </div>
    `;
    
    document.getElementById("btn-give-assent").classList.add("btn-disabled");
    document.getElementById("btn-proceed-act").classList.remove("btn-disabled");
}

// ================= STAGE 7: FINAL ACT CERTIFICATE =================

function buildFinalActCertificate() {
    document.getElementById("cert-bill-name").innerText = state.billTitle.toUpperCase();
    document.getElementById("cert-bill-clause").innerText = state.selectedClause;
    
    // Construct the customized reflective Speech block
    const speechBox = document.getElementById("cert-bill-speech");
    speechBox.innerHTML = `
        <em>"This Act addresses a critical issue identified by Australians. As representative sponsors, we argued in Parliament that this legislation stands for the safety, health, and wellbeing of our communities."</em>
        <br><br>
        <strong>Your Speeches Arguments:</strong><br>
        "${state.houseSpeech}"
    `;
    
    // Inject signatures
    document.getElementById("cert-gg-sig-output").innerText = "GG_Assent_2026";
    document.getElementById("cert-mp-sponsor-output").innerText = `${state.selectedSponsor.emoji} ${state.selectedSponsor.name}, MP`;
    
    // Copy the wax seal from the desk into the certificate seal slot
    const certSealTarget = document.getElementById("cert-seal-target");
    certSealTarget.innerHTML = `
        <div class="wax-seal" style="transform: scale(1); animation: none; width:90px; height:90px; font-size:0.7rem;">
            <div>ROYAL</div>
            <div>ASSENT</div>
        </div>
    `;
}

// ================= GLOBAL HELP DRAWER DRAWER =================

function toggleDrawer() {
    const panel = document.getElementById("curriculum-drawer");
    panel.classList.toggle("open");
}

function restartSimulation() {
    // Reset all state variables
    state.currentStage = 0;
    state.selectedIssue = null;
    state.selectedSponsor = { id: null, name: "", title: "", emoji: "" };
    state.billTitle = "";
    state.selectedClause = "";
    state.houseSpeech = "";
    state.houseVotePassed = false;
    state.houseVotes = { aye: 0, no: 0 };
    state.senateConsensusChoice = null;
    state.senateVotePassed = false;
    state.senateVotes = { aye: 0, no: 0 };
    state.signatureLocked = false;
    state.royalAssentStamped = false;

    // Reset visual highlights
    const issues = ["a", "b", "c"];
    issues.forEach(i => {
        document.getElementById(`issue-card-${i}`).classList.remove("selected");
        document.getElementById(`issue-select-label-${i}`).innerText = "SELECT ISSUE →";
        document.getElementById(`issue-select-label-${i}`).style.color = "var(--text-muted)";
    });
    
    const avatars = ["mp1", "mp2", "mp3"];
    avatars.forEach(id => {
        document.getElementById(`avatar-${id}`).classList.remove("selected");
    });
    
    document.getElementById("input-bill-title").value = "";
    document.getElementById("input-house-speech").value = "";
    document.getElementById("notepad-char-count").innerText = "0 WORDS";
    
    // Move to slide 0
    goToStage(0);
}

// Helper: Shuffle Array in-place (Fisher-Yates)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
