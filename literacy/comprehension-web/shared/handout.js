// shared/handout.js
// Runtime engine for content-aware reading layouts in Literacy Rotations

document.addEventListener("DOMContentLoaded", () => {
    HandoutEngine.init();
});

const HandoutEngine = {
    config: null,
    state: {
        studentName: "",
        studentDate: "",
        submissionId: "",
        startedAt: "",
        lastSavedAt: "",
        answers: {}, // questionId -> response text
        currentTab: 0,
        activeTasks: {} // sectionId -> active task index (0-based)
    },
    saveTimeout: null,
    confettiActive: false,

    init() {
        try {
            const configEl = document.getElementById("activity-config");
            if (!configEl) {
                console.error("Activity configuration element missing");
                return;
            }
            this.config = JSON.parse(configEl.textContent);
        } catch (e) {
            console.error("Failed to parse activity configuration", e);
            return;
        }

        // Initialize empty answers state from config
        this.config.sections.forEach(sec => {
            sec.questions.forEach(q => {
                this.state.answers[q.questionId] = "";
            });
            if (sec.layout === "focus-passage-list") {
                this.state.activeTasks[sec.sectionId] = 0;
            }
        });

        // Load saved draft or initialize new submission
        this.loadDraft();

        // Setup event listeners
        this.setupEventListeners();

        // Initial UI sync
        this.syncDOM();
        this.updateSectionPosition();
        this.updateAllBadges();
    },

    setupEventListeners() {
        // Theme toggle
        const toggleBtn = document.querySelector("[data-theme-toggle]");
        if (toggleBtn) {
            // Restore theme preference
            const savedTheme = localStorage.getItem("theme") || "light";
            document.documentElement.setAttribute("data-theme", savedTheme);
            toggleBtn.addEventListener("click", () => {
                const current = document.documentElement.getAttribute("data-theme");
                const next = current === "dark" ? "light" : "dark";
                document.documentElement.setAttribute("data-theme", next);
                localStorage.setItem("theme", next);
            });
        }

        // Username and Date changes
        const nameInput = document.getElementById("student-name");
        const dateInput = document.getElementById("student-date");
        if (nameInput) {
            nameInput.addEventListener("input", (e) => {
                this.state.studentName = e.target.value.trim();
                this.saveDraftDebounced();
                this.syncPrintMetadata();
            });
        }
        if (dateInput) {
            dateInput.addEventListener("change", (e) => {
                this.state.studentDate = e.target.value;
                this.saveDraftDebounced();
                this.syncPrintMetadata();
            });
        }

        // Textarea changes (delegated)
        const workspace = document.getElementById("activity-workspace");
        if (workspace) {
            workspace.addEventListener("input", (e) => {
                if (e.target.classList.contains("answer-textarea")) {
                    const qId = e.target.getAttribute("data-question-id");
                    const secIdx = parseInt(e.target.getAttribute("data-section-index"), 10);
                    const val = e.target.value;
                    
                    this.state.answers[qId] = val;
                    this.state.lastSavedAt = new Date().toISOString();
                    
                    this.updateWordCounter(qId, val);
                    this.updateSectionBadge(secIdx);
                    this.saveDraftDebounced();
                    this.checkCompletion();
                }
            });
        }

        // Section switches via sidebar buttons (delegated)
        const sidebar = document.getElementById("activity-sidebar");
        if (sidebar) {
            sidebar.addEventListener("click", (e) => {
                const btn = e.target.closest("[data-action='switch-section']");
                if (btn) {
                    const secIdx = parseInt(btn.getAttribute("data-section-index"), 10);
                    this.switchSection(secIdx);
                }
            });
        }

        // Focus layout navigation and Shared reading focus toggles (delegated)
        if (workspace) {
            workspace.addEventListener("click", (e) => {
                // Focus task navigation
                const prevTaskBtn = e.target.closest("[data-action='previous-task']");
                const nextTaskBtn = e.target.closest("[data-action='next-task']");
                if (prevTaskBtn) {
                    this.moveFocusTask(-1);
                } else if (nextTaskBtn) {
                    this.moveFocusTask(1);
                }

                // Reading focus toggle for shared layout
                const toggleFocusBtn = e.target.closest("[data-action='toggle-reading-focus']");
                if (toggleFocusBtn) {
                    this.toggleReadingFocus(toggleFocusBtn);
                }
            });
        }
    },

    loadDraft() {
        const draftKey = this.config.storage.draftKey;
        const tabKey = this.config.storage.tabKey;
        
        // Load draft data
        const rawDraft = localStorage.getItem(draftKey);
        if (rawDraft) {
            try {
                const parsed = JSON.parse(rawDraft);
                this.state.studentName = parsed.studentName || "";
                this.state.studentDate = parsed.studentDate || "";
                this.state.submissionId = parsed.submissionId || parsed.uuid || crypto.randomUUID();
                this.state.startedAt = parsed.startedAt || new Date().toISOString();
                this.state.lastSavedAt = parsed.lastSavedAt || new Date().toISOString();
                
                // Merge answers
                if (parsed.answers) {
                    Object.keys(parsed.answers).forEach(qId => {
                        if (qId in this.state.answers) {
                            this.state.answers[qId] = parsed.answers[qId];
                        }
                    });
                }
                
                // Restore focus task positions
                if (parsed.activeTasks) {
                    Object.keys(parsed.activeTasks).forEach(secId => {
                        this.state.activeTasks[secId] = parsed.activeTasks[secId];
                    });
                }
            } catch (e) {
                console.error("Failed to parse saved draft, starting fresh", e);
                this.resetState();
            }
        } else {
            this.resetState();
        }

        // Load active section tab index
        const savedTab = localStorage.getItem(tabKey);
        if (savedTab !== null) {
            const secIdx = parseInt(savedTab, 10);
            if (secIdx >= 0 && secIdx < this.config.sections.length) {
                this.state.currentTab = secIdx;
            }
        }
    },

    resetState() {
        this.state.studentName = "";
        this.state.studentDate = "";
        this.state.submissionId = crypto.randomUUID();
        this.state.startedAt = new Date().toISOString();
        this.state.lastSavedAt = new Date().toISOString();
        Object.keys(this.state.answers).forEach(qId => {
            this.state.answers[qId] = "";
        });
        Object.keys(this.state.activeTasks).forEach(secId => {
            this.state.activeTasks[secId] = 0;
        });
    },

    saveDraft() {
        const draftKey = this.config.storage.draftKey;
        this.state.lastSavedAt = new Date().toISOString();
        localStorage.setItem(draftKey, JSON.stringify(this.state));
        
        const statusEl = document.getElementById("draft-status");
        if (statusEl) {
            statusEl.textContent = "Draft saved";
            statusEl.classList.add("saved");
            setTimeout(() => statusEl.classList.remove("saved"), 2000);
        }
    },

    saveDraftDebounced() {
        const statusEl = document.getElementById("draft-status");
        if (statusEl) {
            statusEl.textContent = "Saving...";
        }
        clearTimeout(this.saveTimeout);
        this.saveTimeout = setTimeout(() => this.saveDraft(), 500);
    },

    syncDOM() {
        // Username and date inputs
        const nameInput = document.getElementById("student-name");
        const dateInput = document.getElementById("student-date");
        if (nameInput) nameInput.value = this.state.studentName;
        if (dateInput) dateInput.value = this.state.studentDate;
        
        this.syncPrintMetadata();

        // Textareas
        Object.keys(this.state.answers).forEach(qId => {
            const el = document.getElementById(qId);
            if (el) {
                el.value = this.state.answers[qId];
                this.updateWordCounter(qId, this.state.answers[qId]);
            }
        });

        // Tabs panels and sidebar buttons active states
        this.switchSection(this.state.currentTab, false);
    },

    syncPrintMetadata() {
        const pName = document.getElementById("print-lbl-name");
        const pDate = document.getElementById("print-lbl-date");
        if (pName) pName.textContent = this.state.studentName || "....................................................";
        if (pDate) pDate.textContent = this.state.studentDate || "....................................................";
    },

    updateWordCounter(qId, text) {
        const counterEl = document.getElementById(`words-${qId}`);
        const printBox = document.getElementById(`print-${qId}`);
        
        const clean = (text || "").trim();
        const wordCount = clean === "" ? 0 : clean.split(/\s+/).length;
        
        if (counterEl) {
            counterEl.textContent = `${wordCount} word${wordCount === 1 ? "" : "s"}`;
        }
        
        // Sync response text into the print container so it displays when printing
        if (printBox) {
            printBox.textContent = clean;
        }
    },

    updateSectionBadge(secIdx) {
        const sec = this.config.sections[secIdx];
        const badge = document.getElementById(`badge-${secIdx}`);
        if (!badge) return;

        let answered = 0;
        sec.questions.forEach(q => {
            if (this.state.answers[q.questionId]?.trim() !== "") {
                answered++;
            }
        });

        badge.textContent = `${answered}/${sec.questions.length}`;
        if (answered === sec.questions.length) {
            badge.classList.add("complete");
        } else {
            badge.classList.remove("complete");
        }
    },

    updateAllBadges() {
        this.config.sections.forEach((_, idx) => this.updateSectionBadge(idx));
    },

    switchSection(secIdx, persist = true) {
        this.state.currentTab = secIdx;
        if (persist) {
            localStorage.setItem(this.config.storage.tabKey, secIdx);
        }

        // Toggle sidebar active button state
        const sidebar = document.getElementById("activity-sidebar");
        if (sidebar) {
            const btns = sidebar.querySelectorAll("[data-action='switch-section']");
            btns.forEach((btn, idx) => {
                if (idx === secIdx) {
                    btn.classList.add("active");
                } else {
                    btn.classList.remove("active");
                }
            });
        }

        // Toggle panels visibility
        const panels = document.querySelectorAll(".section-panel");
        panels.forEach((panel, idx) => {
            if (idx === secIdx) {
                panel.removeAttribute("hidden");
                // Synchronize task layout active element state
                const secConfig = this.config.sections[idx];
                if (secConfig.layout === "focus-passage-list") {
                    this.syncFocusTaskLayout(panel, secConfig.sectionId);
                }
            } else {
                panel.setAttribute("hidden", "");
            }
        });

        this.updateSectionPosition();
    },

    moveSection(dir) {
        const target = this.state.currentTab + dir;
        if (target >= 0 && target < this.config.sections.length) {
            this.switchSection(target);
        }
    },

    updateSectionPosition() {
        const current = this.state.currentTab;
        const total = this.config.sections.length;
        
        const posIndicator = document.getElementById("section-position");
        const prevBtn = document.getElementById("previous-section");
        const nextBtn = document.getElementById("next-section");

        if (posIndicator) {
            posIndicator.textContent = `Part ${current + 1} of ${total}`;
        }
        if (prevBtn) {
            prevBtn.disabled = current === 0;
        }
        if (nextBtn) {
            nextBtn.disabled = current === total - 1;
        }
    },

    // Focus Layout (focus-passage-list) helper routines
    syncFocusTaskLayout(panel, secId) {
        const activeIdx = this.state.activeTasks[secId] || 0;
        const tasks = panel.querySelectorAll(".focus-task");
        const total = tasks.length;
        
        tasks.forEach((task, idx) => {
            if (idx === activeIdx) {
                task.removeAttribute("hidden");
            } else {
                task.setAttribute("hidden", "");
            }
        });

        const nav = panel.querySelector(".focus-task-nav");
        if (nav) {
            const pos = nav.querySelector(".focus-task-position");
            if (pos) {
                pos.textContent = `Task ${activeIdx + 1} of ${total}`;
            }
            
            const prevBtn = nav.querySelector("[data-action='previous-task']");
            const nextBtn = nav.querySelector("[data-action='next-task']");
            if (prevBtn) prevBtn.disabled = activeIdx === 0;
            if (nextBtn) nextBtn.disabled = activeIdx === total - 1;
        }
    },

    moveFocusTask(dir) {
        const secIdx = this.state.currentTab;
        const sec = this.config.sections[secIdx];
        if (sec.layout !== "focus-passage-list") return;

        const currentTask = this.state.activeTasks[sec.sectionId] || 0;
        const panel = document.getElementById(`panel-${secIdx}`);
        const total = panel.querySelectorAll(".focus-task").length;

        const target = currentTask + dir;
        if (target >= 0 && target < total) {
            this.state.activeTasks[sec.sectionId] = target;
            this.syncFocusTaskLayout(panel, sec.sectionId);
            this.saveDraftDebounced();
        }
    },

    // Shared Layout reading focus toggle helper
    toggleReadingFocus(btn) {
        const panel = btn.closest(".section-panel");
        const workspace = panel.querySelector(".shared-passage-workspace");
        if (!workspace) return;

        const currentMode = workspace.getAttribute("data-reading-mode") || "split";
        const nextMode = currentMode === "split" ? "focus" : "split";
        
        workspace.setAttribute("data-reading-mode", nextMode);
        btn.textContent = nextMode === "focus" ? "Split screen" : "Reading focus";
        btn.classList.toggle("active", nextMode === "focus");
    },

    // Reader scale text resizing utility
    changeReaderScale(delta) {
        let currentScale = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--reader-scale")) || 1.0;
        let newScale = Math.min(Math.max(currentScale + delta, 0.8), 1.5);
        document.documentElement.style.setProperty("--reader-scale", newScale);
    },

    // Focus mode toggler
    toggleFocusMode() {
        const workspace = document.getElementById("activity-workspace");
        const btn = document.getElementById("focus-button");
        if (!workspace) return;
        
        const isFocus = workspace.classList.toggle("workspace-focus");
        if (btn) {
            btn.textContent = isFocus ? "Split view" : "Focus view";
            btn.classList.toggle("active", isFocus);
        }
    },

    confirmReset() {
        if (confirm("Are you sure you want to clear all your answers? This cannot be undone.")) {
            this.resetState();
            localStorage.removeItem(this.config.storage.draftKey);
            this.syncDOM();
            this.updateAllBadges();
            this.showToast("All answers cleared");
        }
    },

    // Check completion and trigger Confetti if 100% complete
    checkCompletion() {
        const total = Object.keys(this.state.answers).length;
        let answered = 0;
        Object.keys(this.state.answers).forEach(qId => {
            if (this.state.answers[qId].trim() !== "") {
                answered++;
            }
        });

        if (answered === total && total > 0 && !this.confettiActive) {
            this.triggerConfetti();
        }
    },

    // Canvas Confetti Implementation (Premium Details)
    triggerConfetti() {
        this.confettiActive = true;
        const canvas = document.getElementById("confetti-canvas");
        if (!canvas) return;

        canvas.style.display = "block";
        const ctx = canvas.getContext("2d");
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        window.addEventListener("resize", () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const colors = ["#2F6F95", "#E3F0F7", "#F59E0B", "#10B981", "#EF4444", "#8B5CF6"];
        const confetti = Array.from({ length: 150 }).map(() => ({
            x: Math.random() * width,
            y: Math.random() * height - height,
            r: Math.random() * 6 + 4,
            d: Math.random() * width,
            color: colors[Math.floor(Math.random() * colors.length)],
            tilt: Math.random() * 10 - 5,
            tiltAngleIncremental: Math.random() * 0.07 + 0.02,
            tiltAngle: 0
        }));

        let animationFrame;
        const draw = () => {
            ctx.clearRect(0, 0, width, height);
            
            let active = false;
            confetti.forEach((p) => {
                p.tiltAngle += p.tiltAngleIncremental;
                p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
                p.x += Math.sin(p.tiltAngle);
                p.tilt = Math.sin(p.tiltAngle - p.r / 2) * 15;
                
                if (p.y <= height) {
                    active = true;
                }

                ctx.beginPath();
                ctx.lineWidth = p.r;
                ctx.strokeStyle = p.color;
                ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
                ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
                ctx.stroke();
            });

            if (active) {
                animationFrame = requestAnimationFrame(draw);
            } else {
                canvas.style.display = "none";
                cancelAnimationFrame(animationFrame);
                this.confettiActive = false;
            }
        };

        draw();
        this.showToast("🎉 Awesome job! You've completed all questions!", 4000);
    },

    showToast(message, duration = 3000) {
        const toast = document.getElementById("toast");
        if (!toast) return;
        
        toast.textContent = message;
        toast.classList.add("show");
        
        setTimeout(() => {
            toast.classList.remove("show");
        }, duration);
    },

    // Response file JSON Export logic
    downloadResponse() {
        const nameInput = document.getElementById("student-name");
        const studentName = nameInput ? nameInput.value.trim() : "";
        if (!studentName) {
            alert("Please enter your School Username before saving.");
            if (nameInput) nameInput.focus();
            return;
        }

        const dateInput = document.getElementById("student-date");
        const studentDate = dateInput ? dateInput.value : "";
        if (!studentDate) {
            alert("Please enter today's date before saving.");
            if (dateInput) dateInput.focus();
            return;
        }

        // Generate JSON structure
        const totalQs = Object.keys(this.state.answers).length;
        let answeredCount = 0;
        
        const sectionsExport = this.config.sections.map((sec, secIdx) => {
            let passageText = "";
            if (sec.passages) {
                // Item scoped: join passages by two newlines
                passageText = sec.passages.join("\n\n");
            } else {
                passageText = sec.passage;
            }

            const responses = sec.questions.map((q, qIdx) => {
                const ans = this.state.answers[q.questionId] || "";
                if (ans.trim() !== "") {
                    answeredCount++;
                }
                const words = ans.trim() === "" ? 0 : ans.trim().split(/\s+/).length;
                return {
                    questionId: q.questionId,
                    order: qIdx + 1,
                    prompt: q.prompt,
                    response: ans,
                    wordCount: words,
                    answered: ans.trim() !== ""
                };
            });

            return {
                sectionId: sec.sectionId,
                order: secIdx + 1,
                title: sec.title,
                passage: passageText,
                responses: responses
            };
        });

        const percentage = totalQs > 0 ? Math.round((answeredCount / totalQs) * 100) : 0;

        const exportData = {
            schemaVersion: "1.0",
            exportType: `literacy_${this.config.skill}_student_response`,
            activity: {
                activityId: this.config.activityId,
                title: this.config.skillLabel,
                level: this.config.level,
                handout: this.config.handout,
                skill: this.getSkillDisplayDescription(this.config.skill)
            },
            student: {
                name: studentName,
                activityDate: studentDate
            },
            submission: {
                submissionId: this.state.submissionId,
                startedAt: this.state.startedAt,
                lastSavedAt: this.state.lastSavedAt,
                exportedAt: new Date().toISOString(),
                appVersion: "2.1.0",
                completion: {
                    answeredQuestions: answeredCount,
                    totalQuestions: totalQs,
                    percentage: percentage,
                    isComplete: answeredCount === totalQs
                }
            },
            sections: sectionsExport
        };

        const filename = `${this.config.activityId}_${studentName}_${studentDate}.json`;
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showToast("Response file saved!");
    },

    getSkillDisplayDescription(skill) {
        if (skill === "inferencing") return "Clue-based textual inference and evidence lookup";
        if (skill === "reorganization") return "Information retrieval, collation, and structuring";
        if (skill === "evaluation") return "Evaluative reading and text-evidence reasoning";
        return skill;
    },

    // Response file JSON Import logic
    importResponse(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                // Safety checks on imported data structure
                if (data.schemaVersion !== "1.0" || !data.activity || !data.student || !data.submission) {
                    alert("Invalid response file structure");
                    return;
                }

                if (data.activity.activityId !== this.config.activityId) {
                    alert(`This file belongs to a different handout: "${data.activity.activityId}"`);
                    return;
                }

                // Restore state values
                this.state.studentName = data.student.name || "";
                this.state.studentDate = data.student.activityDate || "";
                this.state.submissionId = data.submission.submissionId || crypto.randomUUID();
                this.state.startedAt = data.submission.startedAt || new Date().toISOString();
                this.state.lastSavedAt = data.submission.lastSavedAt || new Date().toISOString();

                // Map answers back by question ID
                data.sections.forEach(sec => {
                    sec.responses.forEach(resp => {
                        if (resp.questionId in this.state.answers) {
                            this.state.answers[resp.questionId] = resp.response || "";
                        }
                    });
                });

                // Save loaded state as local draft
                this.saveDraft();
                
                // Sync elements and refresh
                this.syncDOM();
                this.updateAllBadges();
                this.showToast("Response loaded successfully!");
                
            } catch (err) {
                console.error("Failed to parse imported file", err);
                alert("Could not load response file: Invalid JSON format");
            }
        };
        reader.readAsText(file);
        
        // Reset input element value to allow re-uploading the same file
        event.target.value = "";
    }
};

// Expose HandoutEngine methods to the global scope for inline HTML event handlers
window.downloadResponse = () => HandoutEngine.downloadResponse();
window.importResponse = (e) => HandoutEngine.importResponse(e);
window.confirmReset = () => HandoutEngine.confirmReset();
window.changeReaderScale = (d) => HandoutEngine.changeReaderScale(d);
window.toggleFocusMode = () => HandoutEngine.toggleFocusMode();
window.moveSection = (d) => HandoutEngine.moveSection(d);
window.updateStudentMeta = () => {
    // Handled automatically via event listeners in HandoutEngine.setupEventListeners()
};

