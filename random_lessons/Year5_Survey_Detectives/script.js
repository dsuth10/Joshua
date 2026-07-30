(() => {
  "use strict";

  const slides = [...document.querySelectorAll(".slide")];
  const progressBar = document.getElementById("progressBar");
  const slideCount = document.getElementById("slideCount");
  const notesPanel = document.getElementById("teacherNotes");
  const notesText = document.getElementById("notesText");
  const timerPanel = document.getElementById("timerPanel");
  let current = 0;

  function isTyping() {
    const tag = document.activeElement && document.activeElement.tagName;
    return tag === "INPUT" || tag === "TEXTAREA" || document.activeElement?.isContentEditable;
  }

  function showSlide(index, updateHash = true) {
    current = Math.max(0, Math.min(slides.length - 1, index));
    slides.forEach((slide, i) => slide.classList.toggle("active", i === current));
    slideCount.textContent = `${current + 1} / ${slides.length}`;
    progressBar.style.width = `${((current + 1) / slides.length) * 100}%`;
    notesText.textContent = slides[current].dataset.notes || "No notes for this slide.";
    slides[current].scrollTop = 0;
    if (updateHash) history.replaceState(null, "", `#slide-${current + 1}`);
  }

  function initialSlideFromHash() {
    const match = window.location.hash.match(/slide-(\d+)/);
    return match ? Number(match[1]) - 1 : 0;
  }

  document.getElementById("prevSlide").addEventListener("click", () => showSlide(current - 1));
  document.getElementById("nextSlide").addEventListener("click", () => showSlide(current + 1));
  document.getElementById("notesButton").addEventListener("click", () => notesPanel.classList.toggle("open"));
  document.getElementById("closeNotes").addEventListener("click", () => notesPanel.classList.remove("open"));
  document.getElementById("timerButton").addEventListener("click", () => timerPanel.classList.toggle("open"));
  document.getElementById("timerClose").addEventListener("click", () => timerPanel.classList.remove("open"));

  document.getElementById("fullscreenButton").addEventListener("click", async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {
      document.getElementById("fullscreenButton").textContent = "Fullscreen unavailable";
    }
  });

  document.addEventListener("keydown", event => {
    if (isTyping()) return;
    if (["ArrowRight", "PageDown", " "].includes(event.key)) {
      event.preventDefault();
      showSlide(current + 1);
    }
    if (["ArrowLeft", "PageUp"].includes(event.key)) {
      event.preventDefault();
      showSlide(current - 1);
    }
    if (event.key.toLowerCase() === "n") notesPanel.classList.toggle("open");
    if (event.key.toLowerCase() === "t") timerPanel.classList.toggle("open");
    if (event.key.toLowerCase() === "f") document.getElementById("fullscreenButton").click();
  });

  document.querySelectorAll("#predictionChoices .choice-card").forEach(card => {
    card.addEventListener("click", () => {
      document.querySelectorAll("#predictionChoices .choice-card").forEach(item => item.classList.remove("selected"));
      card.classList.add("selected");
      document.getElementById("predictionFeedback").textContent =
        "Prediction locked. Keep your reason—we will compare it with evidence later.";
    });
  });

  document.querySelectorAll(".reveal-card").forEach(card => {
    card.addEventListener("click", () => card.classList.toggle("open"));
  });

  document.querySelectorAll(".quality-card").forEach(card => {
    card.addEventListener("click", () => card.classList.toggle("open"));
  });

  document.getElementById("openCase").addEventListener("click", () => {
    document.getElementById("caseHint").textContent =
      "Case open: the next screen shows all 19 synthetic response pairs.";
    showSlide(current + 1);
  });

  const csvText = [
    "Response ID,Enjoys sport,Enjoys Maths",
    "S01,Yes,Yes",
    "S02,No,No",
    "S03,Yes,No",
    "S04,Yes,Yes",
    "S05,No,Yes",
    "S06,Yes,Yes",
    "S07,No,No",
    "S08,Yes,No",
    "S09,Yes,Yes",
    "S10,No,No",
    "S11,Yes,Yes",
    "S12,Yes,Yes",
    "S13,No,Yes",
    "S14,Yes,No",
    "S15,No,No",
    "S16,Yes,Yes",
    "S17,No,Yes",
    "S18,Yes,No",
    "S19,Yes,Yes"
  ].join("\n");

  document.getElementById("downloadCsv").addEventListener("click", () => {
    const blob = new Blob([csvText], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "synthetic_demo_responses.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  });

  function updateTallyFeedback() {
    const checked = document.querySelectorAll(".count-cell.revealed").length;
    document.getElementById("tallyFeedback").textContent =
      checked === 4
        ? "All four groups checked: 8 + 4 + 3 + 4 = 19 complete responses."
        : `${checked} of 4 groups checked.`;
  }

  document.querySelectorAll(".count-cell").forEach(cell => {
    cell.addEventListener("click", () => {
      cell.classList.toggle("revealed");
      cell.querySelector("span").textContent = cell.classList.contains("revealed") ? cell.dataset.count : "?";
      updateTallyFeedback();
    });
  });

  const conclusionMessages = {
    causal: {
      text: "Too strong. A survey can show an association, but it cannot prove that sport caused the Maths preference.",
      className: "warn"
    },
    wrong: {
      text: "The counts contradict this: 8 sport-enjoyers liked Maths, while 4 did not.",
      className: "warn"
    },
    best: {
      text: "Best supported. The wording stays inside this synthetic class and matches 8 of 12 versus 4 of 12.",
      className: "good"
    }
  };

  document.querySelectorAll(".conclusion-card").forEach(card => {
    card.addEventListener("click", () => {
      document.querySelectorAll(".conclusion-card").forEach(item => {
        item.classList.remove("selected", "correct", "incorrect");
      });
      const result = conclusionMessages[card.dataset.verdict];
      card.classList.add("selected", card.dataset.verdict === "best" ? "correct" : "incorrect");
      const feedback = document.getElementById("conclusionFeedback");
      feedback.textContent = result.text;
      feedback.classList.remove("good", "warn");
      feedback.classList.add(result.className);
    });
  });

  const promptDetails = {
    1: {
      title: "Strategy games × Maths",
      q1: "Do you enjoy strategy games such as chess, logic games or tactical video games? — Yes / No",
      q2: "Do you enjoy Maths? — Yes / No"
    },
    2: {
      title: "Team sport × group learning",
      q1: "Do you usually prefer team sports to individual sports? — Yes / No",
      q2: "Do you usually prefer group learning to independent learning? — Yes / No"
    },
    3: {
      title: "Reading frequency × writing enjoyment",
      q1: "In a usual week, do you read for fun on at least three days? — Yes / No",
      q2: "Do you enjoy writing? — Yes / No"
    },
    4: {
      title: "Creative subjects × open-ended tasks",
      q1: "Do you enjoy creative subjects such as Art, Music or Drama? — Yes / No",
      q2: "Do you prefer tasks that can have more than one successful answer? — Yes / No"
    },
    5: {
      title: "Science × Maths",
      q1: "Do you enjoy Science? — Yes / No",
      q2: "Do you enjoy Maths? — Yes / No"
    },
    6: {
      title: "Active breaks × HPE",
      q1: "At break time, do you usually choose an active outdoor game? — Yes / No",
      q2: "Do you enjoy Health and Physical Education lessons? — Yes / No"
    },
    7: {
      title: "Planning × confidence",
      q1: "Before a large school task, do you usually make a plan? — Yes / No",
      q2: "Do you usually feel confident when beginning a large school task? — Yes / No"
    },
    8: {
      title: "Worked examples × independent practice",
      q1: "Do worked examples usually help you understand a new skill? — Yes / No",
      q2: "After an explanation, do you prefer to begin practice independently? — Yes / No"
    },
    9: {
      title: "Puzzles × productive struggle",
      q1: "Do you enjoy solving puzzles? — Yes / No",
      q2: "Do you enjoy school tasks that may take more than one attempt? — Yes / No"
    },
    10: {
      title: "Fiction × imaginative writing",
      q1: "Do you usually prefer fiction to non-fiction? — Yes / No",
      q2: "Do you usually prefer imaginative writing to informative writing? — Yes / No"
    }
  };

  document.querySelectorAll(".prompt-card").forEach(card => {
    card.addEventListener("click", () => {
      document.querySelectorAll(".prompt-card").forEach(item => item.classList.remove("selected"));
      card.classList.add("selected");
      const detail = promptDetails[card.dataset.prompt];
      document.getElementById("promptDetail").innerHTML =
        `<strong>${detail.title}</strong><p><b>Q1:</b> ${detail.q1}<br><b>Q2:</b> ${detail.q2}</p>`;
    });
  });

  const planFields = ["bigQuestion", "surveyQ1", "surveyQ2", "optionsQ1", "optionsQ2"];
  const storageKey = "survey-detectives-plan-v1";

  function readStoredPlan() {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || "{}");
    } catch {
      return {};
    }
  }

  function storePlan() {
    const data = {};
    planFields.forEach(id => { data[id] = document.getElementById(id).value; });
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
      document.getElementById("saveStatus").textContent = "Draft saved on this device.";
    } catch {
      document.getElementById("saveStatus").textContent = "Local saving is unavailable; copy your wording before closing.";
    }
  }

  function loadPlan(data) {
    planFields.forEach(id => {
      document.getElementById(id).value = data[id] || "";
    });
  }

  loadPlan(readStoredPlan());
  planFields.forEach(id => {
    document.getElementById(id).addEventListener("input", storePlan);
  });

  document.getElementById("loadDemoPlan").addEventListener("click", () => {
    loadPlan({
      bigQuestion: "Do students who enjoy sport tend to enjoy Maths, or not enjoy Maths?",
      surveyQ1: "Do you enjoy playing or watching sport?",
      surveyQ2: "Do you enjoy Maths?",
      optionsQ1: "Yes / No",
      optionsQ2: "Yes / No"
    });
    storePlan();
  });

  document.getElementById("clearPlan").addEventListener("click", () => {
    loadPlan({});
    try { localStorage.removeItem(storageKey); } catch { /* Saving may be unavailable. */ }
    document.getElementById("saveStatus").textContent = "Saved plan cleared.";
  });

  function updateGate() {
    const checked = document.querySelectorAll("#qualityChecklist button.checked").length;
    const status = document.getElementById("gateStatus");
    status.querySelector("strong").textContent = `${checked} / 6`;
    status.querySelector("span").textContent = checked === 6 ? "READY TO SHARE" : "Keep checking.";
    status.classList.toggle("ready", checked === 6);
  }

  document.querySelectorAll("#qualityChecklist button").forEach(item => {
    item.addEventListener("click", () => {
      item.classList.toggle("checked");
      item.querySelector("span").textContent = item.classList.contains("checked") ? "✓" : "□";
      updateGate();
    });
  });

  let timerSeconds = 600;
  let timerInitial = 600;
  let timerInterval = null;
  const timerDisplay = document.getElementById("timerDisplay");
  const timerStart = document.getElementById("timerStart");

  function renderTimer() {
    const minutes = Math.floor(timerSeconds / 60);
    const seconds = timerSeconds % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    timerDisplay.classList.toggle("finished", timerSeconds === 0);
  }

  function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    timerStart.textContent = timerSeconds === 0 ? "Start" : "Resume";
  }

  function runTimer() {
    if (timerInterval) {
      stopTimer();
      timerStart.textContent = "Resume";
      return;
    }
    if (timerSeconds === 0) timerSeconds = timerInitial;
    timerStart.textContent = "Pause";
    timerInterval = setInterval(() => {
      timerSeconds -= 1;
      renderTimer();
      if (timerSeconds <= 0) stopTimer();
    }, 1000);
  }

  document.querySelectorAll("[data-minutes]").forEach(button => {
    button.addEventListener("click", () => {
      stopTimer();
      timerInitial = Number(button.dataset.minutes) * 60;
      timerSeconds = timerInitial;
      timerStart.textContent = "Start";
      renderTimer();
    });
  });
  timerStart.addEventListener("click", runTimer);
  document.getElementById("timerReset").addEventListener("click", () => {
    stopTimer();
    timerSeconds = timerInitial;
    timerStart.textContent = "Start";
    renderTimer();
  });

  function resetInteractions() {
    document.querySelectorAll(".selected, .open, .revealed, .correct, .incorrect, .checked").forEach(element => {
      if (element !== notesPanel && element !== timerPanel) {
        element.classList.remove("selected", "open", "revealed", "correct", "incorrect", "checked");
      }
    });
    document.querySelectorAll(".count-cell span").forEach(span => { span.textContent = "?"; });
    document.querySelectorAll("#qualityChecklist button span").forEach(span => { span.textContent = "□"; });
    document.getElementById("predictionFeedback").textContent = "Choose, then explain what made you predict that.";
    document.getElementById("caseHint").textContent =
      "Before opening: how many of the sport-enjoyers do you predict will also enjoy Maths?";
    document.getElementById("conclusionFeedback").textContent =
      "Choose, then defend your decision with a number.";
    document.getElementById("conclusionFeedback").classList.remove("good", "warn");
    document.getElementById("promptDetail").innerHTML =
      "<strong>Select a case.</strong><p>The exact two survey questions will appear here.</p>";
    updateTallyFeedback();
    updateGate();
    notesPanel.classList.remove("open");
    timerPanel.classList.remove("open");
    stopTimer();
    timerSeconds = timerInitial;
    timerStart.textContent = "Start";
    renderTimer();
  }

  document.getElementById("resetButton").addEventListener("click", resetInteractions);

  renderTimer();
  showSlide(initialSlideFromHash(), false);
})();
