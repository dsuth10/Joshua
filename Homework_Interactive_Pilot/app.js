/**
 * Main Application Controller for Homework Interactive Pilot
 */
class HomeworkApp {
  constructor() {
    this.currentLevel = localStorage.getItem("hw_level") || "Red";
    this.studentName = localStorage.getItem("hw_student_name") || "Student";
    this.activeSection = "reading";
    this.theme = localStorage.getItem("hw_theme") || "light";
    this.points = parseInt(localStorage.getItem("hw_points") || "0", 10);
    this.speechSynth = window.speechSynthesis;
    this.isSpeaking = false;

    this.init();
  }

  init() {
    document.documentElement.setAttribute("data-theme", this.theme);
    this.bindHeaderControls();
    this.bindSectionNav();
    this.initGlossaryModal();

    // Instantiate Viewers
    window.mapViewerInstance = new MapViewer("map-viewer-container");
    window.chartViewerInstance = new ChartViewer("chart-viewer-container");

    this.mathQuiz = new QuizEngine("math-quiz-container", {
      level: this.currentLevel,
      mode: "math",
      mapViewer: window.mapViewerInstance,
      chartViewer: window.chartViewerInstance
    });

    this.readingQuiz = new QuizEngine("reading-quiz-container", {
      level: this.currentLevel,
      mode: "reading"
    });

    this.updateLevelUi();
    this.renderReadingSection();
    this.updateSummarySection();
  }

  setLevel(newLevel) {
    if (["Red", "Blue", "Green"].includes(newLevel)) {
      this.currentLevel = newLevel;
      localStorage.setItem("hw_level", newLevel);
      this.updateLevelUi();
      this.renderReadingSection();
      this.mathQuiz.setLevel(newLevel);
      this.readingQuiz.setLevel(newLevel);
      this.updateSummarySection();
    }
  }

  setSection(sectionId) {
    this.activeSection = sectionId;
    document.querySelectorAll(".section-nav-btn").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-section") === sectionId);
    });

    document.querySelectorAll(".app-section").forEach(sec => {
      sec.classList.toggle("active", sec.id === `sec-${sectionId}`);
    });

    if (sectionId === "summary") {
      this.updateSummarySection();
    } else if (sectionId === "maps" && window.mapViewerInstance && window.mapViewerInstance.map) {
      setTimeout(() => window.mapViewerInstance.map.invalidateSize(), 60);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  toggleTheme() {
    this.theme = this.theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", this.theme);
    localStorage.setItem("hw_theme", this.theme);
    const btn = document.getElementById("theme-toggle-btn");
    if (btn) {
      btn.textContent = this.theme === "light" ? "🌙" : "☀️";
    }
  }

  addPoints(pts) {
    this.points += pts;
    localStorage.setItem("hw_points", this.points.toString());
    const el = document.getElementById("header-points-count");
    if (el) el.textContent = `${this.points} pts`;
  }

  updateLevelUi() {
    document.querySelectorAll(".level-btn").forEach(btn => {
      btn.classList.remove("active");
      if (btn.getAttribute("data-level") === this.currentLevel) {
        btn.classList.add("active");
      }
    });

    const levelBadge = document.getElementById("active-level-indicator");
    if (levelBadge) {
      levelBadge.className = `badge badge-${this.currentLevel.toLowerCase()}`;
      levelBadge.textContent = `${this.currentLevel} Group`;
    }
  }

  renderReadingSection() {
    const readingData = window.READING_DATA.levels[this.currentLevel];
    if (!readingData) return;

    const titleEl = document.getElementById("reading-title-el");
    const subEl = document.getElementById("reading-sub-el");
    const metaBar = document.getElementById("reading-meta-bar");
    const articleBody = document.getElementById("reading-article-body");

    if (titleEl) titleEl.textContent = readingData.title;
    if (subEl) subEl.textContent = readingData.subtitle;
    if (metaBar) {
      metaBar.innerHTML = `
        <span class="badge badge-${this.currentLevel.toLowerCase()}">${readingData.levelName}</span>
        <span class="badge info-badge">⏱️ ${readingData.readingTime}</span>
        <span class="badge info-badge">📝 ${readingData.wordCount} words</span>
        <span class="badge info-badge">🎯 F-K Grade: ${readingData.fkGrade}</span>
      `;
    }

    if (articleBody) {
      // Process bold / glossary keywords in text
      let html = "";
      readingData.paragraphs.forEach(pText => {
        let processed = pText;
        // Replace **Word** with glossary button
        processed = processed.replace(/\*\*(.*?)\*\*/g, (match, word) => {
          const cleanKey = word.toLowerCase();
          // Find matching glossary term
          const glossKey = Object.keys(window.READING_DATA.glossary).find(k => k.toLowerCase() === cleanKey || cleanKey.includes(k.toLowerCase()));
          if (glossKey) {
            return `<span class="glossary-word" data-term="${glossKey}">${word}</span>`;
          }
          return `<strong>${word}</strong>`;
        });
        html += `<p>${processed}</p>`;
      });
      articleBody.innerHTML = html;

      // Bind glossary clicks in body
      articleBody.querySelectorAll(".glossary-word").forEach(el => {
        el.addEventListener("click", () => {
          this.openGlossaryModal(el.getAttribute("data-term"));
        });
      });
    }

    this.renderGlossarySidebar();
  }

  renderGlossarySidebar() {
    const list = document.getElementById("sidebar-glossary-list");
    if (!list) return;

    const terms = window.READING_DATA.glossary;
    let html = "";
    Object.keys(terms).forEach(termKey => {
      const item = terms[termKey];
      html += `
        <div class="glossary-item" data-term="${termKey}">
          <div class="glossary-term-header">
            <span class="glossary-term">${termKey}</span>
            <span class="glossary-phonetic">${item.phonetic}</span>
          </div>
          <p class="glossary-def">${item.definition}</p>
        </div>
      `;
    });

    list.innerHTML = html;
    list.querySelectorAll(".glossary-item").forEach(el => {
      el.addEventListener("click", () => {
        this.openGlossaryModal(el.getAttribute("data-term"));
      });
    });
  }

  openGlossaryModal(termKey) {
    const item = window.READING_DATA.glossary[termKey];
    if (!item) return;

    const overlay = document.getElementById("glossary-modal-overlay");
    const title = document.getElementById("modal-term-title");
    const phonetic = document.getElementById("modal-term-phonetic");
    const cat = document.getElementById("modal-term-category");
    const def = document.getElementById("modal-term-def");

    if (title) title.textContent = termKey;
    if (phonetic) phonetic.textContent = item.phonetic;
    if (cat) cat.textContent = item.category;
    if (def) def.textContent = item.definition;

    if (overlay) overlay.classList.add("active");
  }

  initGlossaryModal() {
    const overlay = document.getElementById("glossary-modal-overlay");
    const closeBtn = document.getElementById("modal-close-btn");
    const audioBtn = document.getElementById("modal-speak-btn");

    if (closeBtn && overlay) {
      closeBtn.addEventListener("click", () => overlay.classList.remove("active"));
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) overlay.classList.remove("active");
      });
    }

    if (audioBtn) {
      audioBtn.addEventListener("click", () => {
        const title = document.getElementById("modal-term-title");
        if (title && 'speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(title.textContent);
          utterance.lang = "en-AU";
          window.speechSynthesis.speak(utterance);
        }
      });
    }
  }

  toggleTextToSpeech() {
    if (!('speechSynthesis' in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }

    if (this.isSpeaking) {
      this.speechSynth.cancel();
      this.isSpeaking = false;
      const btn = document.getElementById("read-aloud-btn");
      if (btn) btn.innerHTML = "🔊 Listen to Reading Passage";
      return;
    }

    const readingData = window.READING_DATA.levels[this.currentLevel];
    if (!readingData) return;

    const textToRead = `${readingData.title}. ${readingData.paragraphs.join(" ")}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = "en-AU";
    utterance.rate = 0.95;

    utterance.onend = () => {
      this.isSpeaking = false;
      const btn = document.getElementById("read-aloud-btn");
      if (btn) btn.innerHTML = "🔊 Listen to Reading Passage";
    };

    this.speechSynth.speak(utterance);
    this.isSpeaking = true;
    const btn = document.getElementById("read-aloud-btn");
    if (btn) btn.innerHTML = "⏹️ Stop Reading Audio";
  }

  updateSummarySection() {
    const nameEl = document.getElementById("summary-student-name");
    const levelEl = document.getElementById("summary-active-level");
    const mathScoreEl = document.getElementById("summary-math-score");
    const readScoreEl = document.getElementById("summary-read-score");
    const pointsEl = document.getElementById("summary-total-points");

    if (nameEl) nameEl.textContent = this.studentName;
    if (levelEl) levelEl.textContent = `${this.currentLevel} Group`;
    if (mathScoreEl && this.mathQuiz) {
      const qCount = this.mathQuiz.getQuestions().length;
      const correct = Object.values(this.mathQuiz.answersState).filter(a => a.isCorrect).length;
      mathScoreEl.textContent = `${correct} / ${qCount}`;
    }
    if (readScoreEl && this.readingQuiz) {
      const qCount = this.readingQuiz.getQuestions().length;
      const correct = Object.values(this.readingQuiz.answersState).filter(a => a.isCorrect).length;
      readScoreEl.textContent = `${correct} / ${qCount}`;
    }
    if (pointsEl) pointsEl.textContent = `${this.points} pts`;
  }

  bindHeaderControls() {
    document.querySelectorAll(".level-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        this.setLevel(btn.getAttribute("data-level"));
      });
    });

    const themeBtn = document.getElementById("theme-toggle-btn");
    if (themeBtn) {
      themeBtn.addEventListener("click", () => this.toggleTheme());
    }

    const nameInput = document.getElementById("student-name-input");
    if (nameInput) {
      nameInput.value = this.studentName;
      nameInput.addEventListener("change", (e) => {
        this.studentName = e.target.value.trim() || "Student";
        localStorage.setItem("hw_student_name", this.studentName);
        this.updateSummarySection();
      });
    }

    const ttsBtn = document.getElementById("read-aloud-btn");
    if (ttsBtn) {
      ttsBtn.addEventListener("click", () => this.toggleTextToSpeech());
    }

    const printSummaryBtn = document.getElementById("print-summary-btn");
    if (printSummaryBtn) {
      printSummaryBtn.addEventListener("click", () => window.print());
    }
  }

  bindSectionNav() {
    document.querySelectorAll(".section-nav-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        this.setSection(btn.getAttribute("data-section"));
      });
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.homeworkApp = new HomeworkApp();
});
