/**
 * Interactive Quiz & Assessment Engine for Homework Pilot
 * Supports both Reading Comprehension (Q1–15) and Multi-Step Mathematics (Q16–30)
 */
class QuizEngine {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.level = options.level || "Red";
    this.mode = options.mode || "reading"; // "reading" | "math"
    this.scratchpad = options.scratchpad || null;
    this.answersState = {}; // { questionId: { selectedIndex, isCorrect } }
    this.revealedHints = {}; // { questionId: boolean }
    this.score = 0;

    this.loadState();
    this.init();
  }

  getStorageKey() {
    return `hw_quiz_state_${this.mode}_${this.level}`;
  }

  loadState() {
    try {
      const saved = localStorage.getItem(this.getStorageKey());
      if (saved) {
        this.answersState = JSON.parse(saved);
      } else {
        this.answersState = {};
      }
    } catch (e) {
      this.answersState = {};
    }
  }

  saveState() {
    try {
      localStorage.setItem(this.getStorageKey(), JSON.stringify(this.answersState));
    } catch (e) {
      // ignore local storage errors
    }
  }

  setLevel(level) {
    this.level = level;
    this.loadState();
    this.render();
  }

  setMode(mode) {
    this.mode = mode;
    this.loadState();
    this.render();
  }

  getQuestions() {
    if (this.mode === "math") {
      if (this.level === "Green") {
        return window.MATH_CONTENT.Year34 || [];
      } else {
        return window.MATH_CONTENT.Year5 || [];
      }
    } else {
      const readingData = window.READING_DATA.levels[this.level];
      return readingData ? readingData.comprehensionQuestions : [];
    }
  }

  init() {
    if (!this.container) return;
    this.render();
  }

  render() {
    const questions = this.getQuestions();
    const isMath = this.mode === "math";
    const totalCount = questions.length;
    const answeredCount = Object.keys(this.answersState).length;
    const correctCount = Object.values(this.answersState).filter(a => a.isCorrect).length;

    const title = isMath ? "Multi-Step Mathematics Challenge (Questions 16–30)" : "Reading Comprehension Check (Questions 1–15)";
    const subtitle = isMath
      ? `${this.level === 'Green' ? 'Year 3/4 Foundational' : 'Year 5 Standard/Advanced'} Multi-Step Problem Solving & Four Operations`
      : `Text-Based Comprehension & Analysis — ${this.level} Group`;

    this.container.innerHTML = `
      <div class="quiz-wrapper card glass">
        <div class="quiz-header">
          <div class="quiz-title-area">
            <h3 class="quiz-title">
              <span class="icon-quiz">${isMath ? '🧮' : '📝'}</span>
              ${title}
            </h3>
            <p class="quiz-subtitle">
              Level: <strong class="level-tag tag-${this.level.toLowerCase()}">${this.level} Group</strong>
              • <em>${subtitle}</em>
            </p>
          </div>
          <div class="quiz-stats-pill">
            <span>Answered: <strong>${answeredCount} / ${totalCount}</strong></span>
            <span>Score: <strong class="text-accent">${correctCount} / ${totalCount}</strong></span>
          </div>
        </div>

        <div class="quiz-questions-list">
          ${questions.map((q) => this.renderQuestionCard(q)).join("")}
        </div>

        <div class="quiz-footer-actions">
          <button class="btn btn-outline" id="quiz-reset-btn-${this.mode}">↺ Reset This Section</button>
          <button class="btn btn-primary" onclick="window.homeworkApp.setSection('summary')">🏆 View Overall Progress</button>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  renderQuestionCard(q) {
    const isMath = this.mode === "math";
    const state = this.answersState[q.id];
    const isAnswered = state !== undefined;
    const isCorrect = state && state.isCorrect;
    const isHintOpen = this.revealedHints[q.id] || false;

    let optionsHtml = q.options.map((opt, optIdx) => {
      let optClass = "quiz-option-btn";
      let icon = `<span class="opt-letter">${"ABCD"[optIdx]}</span>`;

      if (isAnswered) {
        if (optIdx === q.ans) {
          optClass += " option-correct";
          icon = `<span class="opt-icon-feedback">✓</span>`;
        } else if (state.selectedIndex === optIdx) {
          optClass += " option-wrong";
          icon = `<span class="opt-icon-feedback">✗</span>`;
        } else {
          optClass += " option-disabled";
        }
      }

      return `
        <button class="${optClass}" data-qid="${q.id}" data-opt="${optIdx}" ${isAnswered ? 'disabled' : ''}>
          ${icon}
          <span class="opt-text">${opt}</span>
        </button>
      `;
    }).join("");

    let toolButtons = "";
    if (isMath) {
      toolButtons = `
        <div class="q-tool-buttons">
          <button class="btn btn-xs btn-outline q-scratchpad-btn" data-qid="${q.id}" title="Open Scratchpad Calculator">
            🧮 Scratchpad
          </button>
          <button class="btn btn-xs btn-ghost q-hint-toggle-btn" data-qid="${q.id}" title="Show Step-by-Step Clue">
            💡 ${isHintOpen ? 'Hide Steps Clue' : 'Show Steps Clue'}
          </button>
        </div>
      `;
    }

    let hintDrawer = "";
    if (isMath && isHintOpen) {
      const stepsHtml = (q.steps || []).map((step, idx) => `
        <div class="hint-step-item">
          <span class="hint-step-badge">Step ${idx + 1}</span>
          <span>${step}</span>
        </div>
      `).join("");

      hintDrawer = `
        <div class="q-hint-drawer slide-in">
          <h5><span>💡</span> Problem Breakdown Clue:</h5>
          <div class="hint-steps-container">
            ${stepsHtml || `<p>${q.hint}</p>`}
          </div>
        </div>
      `;
    }

    let feedbackHtml = "";
    if (isAnswered) {
      feedbackHtml = `
        <div class="feedback-card ${isCorrect ? 'feedback-success' : 'feedback-error'} slide-in">
          <div class="feedback-status">
            ${isCorrect ? '🎉 <strong>Correct!</strong> Great work.' : '💡 <strong>Not quite.</strong> Let\'s look at the complete solution:'}
          </div>
          <p class="feedback-expl">${q.explanation}</p>
        </div>
      `;
    }

    return `
      <div class="question-card card ${isAnswered ? (isCorrect ? 'card-answered-correct' : 'card-answered-wrong') : ''}" id="q-card-${q.id}">
        <div class="q-header">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="q-number">Question ${q.number}</span>
            ${q.focus ? `<span class="badge info-badge" style="font-size: 11px;">${q.focus}</span>` : ''}
          </div>
          ${toolButtons}
        </div>
        <h4 class="q-stem">${q.q}</h4>
        ${hintDrawer}
        <div class="q-options-grid">
          ${optionsHtml}
        </div>
        ${feedbackHtml}
      </div>
    `;
  }

  selectAnswer(qId, selectedIndex) {
    const questions = this.getQuestions();
    const q = questions.find(item => item.id === qId);
    if (!q || this.answersState[qId] !== undefined) return;

    const isCorrect = selectedIndex === q.ans;
    this.answersState[qId] = {
      selectedIndex,
      isCorrect
    };

    this.saveState();

    if (isCorrect && window.homeworkApp) {
      window.homeworkApp.addPoints(10);
    }

    if (window.homeworkApp) {
      window.homeworkApp.updateSummarySection();
    }

    this.render();
  }

  bindEvents() {
    this.container.querySelectorAll(".quiz-option-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const qId = btn.getAttribute("data-qid");
        const optIdx = parseInt(btn.getAttribute("data-opt"), 10);
        this.selectAnswer(qId, optIdx);
      });
    });

    this.container.querySelectorAll(".q-hint-toggle-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const qId = btn.getAttribute("data-qid");
        this.revealedHints[qId] = !this.revealedHints[qId];
        this.render();
      });
    });

    this.container.querySelectorAll(".q-scratchpad-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const qId = btn.getAttribute("data-qid");
        const questions = this.getQuestions();
        const q = questions.find(item => item.id === qId);
        if (q && window.mathsScratchpadInstance) {
          window.mathsScratchpadInstance.openForQuestion(q);
        }
      });
    });

    const resetBtn = document.getElementById(`quiz-reset-btn-${this.mode}`);
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to reset your answers for this section?")) {
          this.answersState = {};
          this.revealedHints = {};
          this.saveState();
          if (window.homeworkApp) {
            window.homeworkApp.updateSummarySection();
          }
          this.render();
        }
      });
    }
  }
}

window.QuizEngine = QuizEngine;
