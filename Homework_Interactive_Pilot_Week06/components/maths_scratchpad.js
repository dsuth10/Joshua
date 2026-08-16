/**
 * Interactive Maths Scratchpad & Problem Solver Component
 * Provides students with step-by-step reasoning support, scratchpad working, and mini-calculations.
 */
class MathsScratchpad {
  constructor() {
    this.isOpen = false;
    this.currentQuestion = null;
    this.scratchNotes = {};
    this.init();
  }

  init() {
    this.createModalElement();
    this.bindEvents();
  }

  createModalElement() {
    let existing = document.getElementById("maths-scratchpad-modal");
    if (existing) existing.remove();

    const wrapper = document.createElement("div");
    wrapper.id = "maths-scratchpad-modal";
    wrapper.className = "scratchpad-modal-overlay";
    wrapper.setAttribute("role", "dialog");
    wrapper.setAttribute("aria-modal", "true");
    wrapper.innerHTML = `
      <div class="scratchpad-modal-card glass">
        <div class="scratchpad-modal-header">
          <div class="scratchpad-modal-title">
            <span class="scratchpad-icon">🧮</span>
            <div>
              <h3>Maths Step-by-Step Scratchpad</h3>
              <p class="scratchpad-sub" id="scratchpad-q-title">Question 16 Working Out Space</p>
            </div>
          </div>
          <button class="btn btn-xs btn-ghost" id="scratchpad-close-btn" aria-label="Close Scratchpad">✕</button>
        </div>

        <div class="scratchpad-body-grid">
          <!-- Problem Reference & Steps -->
          <div class="scratchpad-left-pane">
            <div class="scratchpad-q-stem card" id="scratchpad-q-stem-box">
              <span class="badge info-badge" id="scratchpad-q-focus">Focus</span>
              <p id="scratchpad-q-stem-text">Question stem here...</p>
            </div>

            <div class="scratchpad-steps-box card">
              <h4><span>💡</span> Guided Steps Clue</h4>
              <ul class="scratchpad-steps-list" id="scratchpad-steps-list">
                <!-- Injected via openForQuestion -->
              </ul>
            </div>
          </div>

          <!-- Interactive Calculator & Scratch Notes -->
          <div class="scratchpad-right-pane">
            <div class="scratchpad-calc-card card">
              <h4><span>🔢</span> Quick Step Calculator</h4>
              <div class="calc-screen">
                <input type="text" id="scratchpad-calc-input" placeholder="e.g. 28 * 24 + 4 * 35 - 75" autocomplete="off">
                <div class="calc-result" id="scratchpad-calc-result">= 0</div>
              </div>
              <div class="calc-btn-grid">
                <button class="calc-key" data-key="7">7</button>
                <button class="calc-key" data-key="8">8</button>
                <button class="calc-key" data-key="9">9</button>
                <button class="calc-key calc-op" data-key="/">÷</button>

                <button class="calc-key" data-key="4">4</button>
                <button class="calc-key" data-key="5">5</button>
                <button class="calc-key" data-key="6">6</button>
                <button class="calc-key calc-op" data-key="*">×</button>

                <button class="calc-key" data-key="1">1</button>
                <button class="calc-key" data-key="2">2</button>
                <button class="calc-key" data-key="3">3</button>
                <button class="calc-key calc-op" data-key="-">−</button>

                <button class="calc-key" data-key="0">0</button>
                <button class="calc-key" data-key=".">.</button>
                <button class="calc-key calc-clear" data-key="clear">C</button>
                <button class="calc-key calc-op" data-key="+">+</button>
              </div>
              <button class="btn btn-primary btn-sm calc-eval-btn" id="scratchpad-calc-eval-btn" style="width: 100%; margin-top: 8px;">Calculate Result (=)</button>
            </div>

            <div class="scratchpad-notes-card card">
              <h4><span>📝</span> Your Working Notes</h4>
              <textarea id="scratchpad-notes-area" placeholder="Jot down your sub-totals and notes here..."></textarea>
            </div>
          </div>
        </div>

        <div class="scratchpad-footer">
          <button class="btn btn-primary" id="scratchpad-done-btn">Done Working</button>
        </div>
      </div>
    `;

    document.body.appendChild(wrapper);
  }

  bindEvents() {
    const overlay = document.getElementById("maths-scratchpad-modal");
    const closeBtn = document.getElementById("scratchpad-close-btn");
    const doneBtn = document.getElementById("scratchpad-done-btn");
    const calcInput = document.getElementById("scratchpad-calc-input");
    const calcEvalBtn = document.getElementById("scratchpad-calc-eval-btn");
    const notesArea = document.getElementById("scratchpad-notes-area");

    if (closeBtn && overlay) {
      closeBtn.addEventListener("click", () => this.close());
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) this.close();
      });
    }

    if (doneBtn) {
      doneBtn.addEventListener("click", () => this.close());
    }

    // Calc buttons
    overlay.querySelectorAll(".calc-key").forEach(btn => {
      btn.addEventListener("click", () => {
        const key = btn.getAttribute("data-key");
        if (key === "clear") {
          calcInput.value = "";
          document.getElementById("scratchpad-calc-result").textContent = "= 0";
        } else {
          calcInput.value += key;
          this.evalCalc();
        }
      });
    });

    if (calcInput) {
      calcInput.addEventListener("input", () => this.evalCalc());
      calcInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          this.evalCalc();
        }
      });
    }

    if (calcEvalBtn) {
      calcEvalBtn.addEventListener("click", () => this.evalCalc());
    }

    if (notesArea) {
      notesArea.addEventListener("input", (e) => {
        if (this.currentQuestion) {
          this.scratchNotes[this.currentQuestion.id] = e.target.value;
        }
      });
    }
  }

  evalCalc() {
    const input = document.getElementById("scratchpad-calc-input");
    const resultEl = document.getElementById("scratchpad-calc-result");
    if (!input || !resultEl) return;

    const raw = input.value.trim();
    if (!raw) {
      resultEl.textContent = "= 0";
      return;
    }

    try {
      // Safe arithmetic evaluator
      const sanitized = raw.replace(/[^0-9+\-*/().\s]/g, "");
      if (sanitized) {
        // eslint-disable-next-line no-eval
        const res = Function(`'use strict'; return (${sanitized})`)();
        if (typeof res === "number" && !isNaN(res)) {
          resultEl.textContent = `= ${Number.isInteger(res) ? res : res.toFixed(2)}`;
        }
      }
    } catch (e) {
      // ignore parsing errors while student types
    }
  }

  openForQuestion(q) {
    this.currentQuestion = q;
    const overlay = document.getElementById("maths-scratchpad-modal");
    const titleEl = document.getElementById("scratchpad-q-title");
    const focusEl = document.getElementById("scratchpad-q-focus");
    const stemEl = document.getElementById("scratchpad-q-stem-text");
    const stepsList = document.getElementById("scratchpad-steps-list");
    const notesArea = document.getElementById("scratchpad-notes-area");
    const calcInput = document.getElementById("scratchpad-calc-input");
    const resultEl = document.getElementById("scratchpad-calc-result");

    if (titleEl) titleEl.textContent = `Question ${q.number || 16} Working Out Space`;
    if (focusEl) focusEl.textContent = q.focus || "Multi-Step Maths";
    if (stemEl) stemEl.textContent = q.q;

    if (stepsList) {
      if (q.steps && q.steps.length > 0) {
        stepsList.innerHTML = q.steps.map((step, idx) => `
          <li>
            <span class="step-num-pill">${idx + 1}</span>
            <span>${step}</span>
          </li>
        `).join("");
      } else if (q.hint) {
        stepsList.innerHTML = `<li><span class="step-num-pill">💡</span><span>${q.hint}</span></li>`;
      } else {
        stepsList.innerHTML = `<li><small>Read the question carefully, identify the operations needed, and calculate each step.</small></li>`;
      }
    }

    if (notesArea) {
      notesArea.value = this.scratchNotes[q.id] || "";
    }

    if (calcInput) calcInput.value = "";
    if (resultEl) resultEl.textContent = "= 0";

    if (overlay) overlay.classList.add("active");
    this.isOpen = true;
  }

  close() {
    const overlay = document.getElementById("maths-scratchpad-modal");
    if (overlay) overlay.classList.remove("active");
    this.isOpen = false;
  }
}

window.MathsScratchpad = MathsScratchpad;
