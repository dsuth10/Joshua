/**
 * Interactive Quiz & Assessment Engine with Map/Chart Linking & Instant Feedback
 */
class QuizEngine {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.level = options.level || "Red";
    this.mode = options.mode || "math"; // "math" | "reading"
    this.mapViewer = options.mapViewer || null;
    this.chartViewer = options.chartViewer || null;
    this.answersState = {}; // { questionId: selectedIndex }
    this.score = 0;
    this.init();
  }

  setLevel(level) {
    this.level = level;
    this.answersState = {};
    this.score = 0;
    this.render();
  }

  setMode(mode) {
    this.mode = mode;
    this.answersState = {};
    this.score = 0;
    this.render();
  }

  getQuestions() {
    if (this.mode === "math") {
      return window.MATH_QUESTIONS[this.level] || [];
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

    this.container.innerHTML = `
      <div class="quiz-wrapper card glass">
        <div class="quiz-header">
          <div class="quiz-title-area">
            <h3 class="quiz-title">
              <span class="icon-quiz">${isMath ? '🧭' : '📖'}</span>
              ${isMath ? 'Spatial Data & Map Discernment Challenge' : 'Reading Comprehension Check'}
            </h3>
            <p class="quiz-subtitle">
              Level: <strong class="level-tag tag-${this.level.toLowerCase()}">${this.level} Group</strong>
              (${isMath ? '10 Map & Chart Questions' : '15 Reading Questions'})
            </p>
          </div>
          <div class="quiz-stats-pill">
            <span>Answered: <strong>${answeredCount} / ${totalCount}</strong></span>
            <span>Score: <strong class="text-accent">${correctCount} pts</strong></span>
          </div>
        </div>

        <div class="quiz-questions-list">
          ${questions.map((q, idx) => this.renderQuestionCard(q, idx + 1)).join("")}
        </div>

        <div class="quiz-footer-actions">
          <button class="btn btn-primary" id="quiz-reset-btn">↺ Reset This Challenge</button>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  renderQuestionCard(q, number) {
    const state = this.answersState[q.id];
    const isAnswered = state !== undefined;
    const isCorrect = state && state.isCorrect;

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

    let mapLinkBtn = "";
    if (q.targetMapLayer && window.mapViewerInstance) {
      mapLinkBtn = `
        <button class="btn btn-xs btn-outline map-inspect-link" data-layer="${q.targetMapLayer}" data-region="${q.targetRegionId || ''}">
          🗺️ Show Layer on Map
        </button>
      `;
    }

    let feedbackHtml = "";
    if (isAnswered) {
      feedbackHtml = `
        <div class="feedback-card ${isCorrect ? 'feedback-success' : 'feedback-error'} slide-in">
          <div class="feedback-status">
            ${isCorrect ? '🎉 <strong>Correct!</strong> Well done.' : '💡 <strong>Not quite.</strong> Let\'s look at the reasoning:'}
          </div>
          <p class="feedback-expl">${q.explanation}</p>
        </div>
      `;
    }

    return `
      <div class="question-card card ${isAnswered ? (isCorrect ? 'card-answered-correct' : 'card-answered-wrong') : ''}" id="q-card-${q.id}">
        <div class="q-header">
          <span class="q-number">Question ${number}</span>
          ${mapLinkBtn}
        </div>
        <h4 class="q-stem">${q.q}</h4>
        ${q.hint && !isAnswered ? `<div class="q-hint"><small>💡 Clue: ${q.hint}</small></div>` : ''}
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

    if (isCorrect) {
      this.score += 1;
      if (window.homeworkApp) {
        window.homeworkApp.addPoints(10);
      }
    }

    this.render();
  }

  bindEvents() {
    this.container.querySelectorAll(".quiz-option-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const qId = btn.getAttribute("data-qid");
        const optIdx = parseInt(btn.getAttribute("data-opt"), 10);
        this.selectAnswer(qId, optIdx);
      });
    });

    this.container.querySelectorAll(".map-inspect-link").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const layer = btn.getAttribute("data-layer");
        const region = btn.getAttribute("data-region");
        if (window.homeworkApp) {
          window.homeworkApp.setSection('maps');
        }
        if (window.mapViewerInstance) {
          window.mapViewerInstance.setLayer(layer);
          if (region && region !== "none") {
            setTimeout(() => {
              if (window.mapViewerInstance) {
                window.mapViewerInstance.highlightRegion(region);
              }
            }, 120);
          }
        }
      });
    });

    const resetBtn = document.getElementById("quiz-reset-btn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        this.answersState = {};
        this.score = 0;
        this.render();
      });
    }
  }
}

window.QuizEngine = QuizEngine;
