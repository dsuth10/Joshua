/**
 * Year 1 practice console (Phase 5.9 scaffold + 5.10 number-track + 5.10b teen partition + 5.10c jumps).
 * Band A→B chrome, scoresByCatY1 profile.
 */
document.addEventListener('DOMContentLoaded', () => {
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  function playSound(freq, duration, type = 'sine', volume = 0.1) {
    try {
      initAudio();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn('Audio failed:', e);
    }
  }

  const sounds = {
    click: () => playSound(600, 0.05, 'square', 0.04),
    success: () => {
      playSound(523.25, 0.08, 'sine', 0.08);
      setTimeout(() => playSound(659.25, 0.08, 'sine', 0.08), 80);
      setTimeout(() => playSound(783.99, 0.12, 'sine', 0.08), 160);
    },
    error: () => playSound(200, 0.2, 'triangle', 0.1),
  };

  if (typeof MCS !== 'undefined' && MCS.audio) {
    MCS.audio.register(playSound);
  }

  const STRAND_PLACEHOLDERS = {
    measurement: 'Measuring and clock missions (Y1-5, Y1-6) arrive in a later slice.',
    space: 'Shape builder missions (Y1-7) arrive in a later slice.',
    statistics: 'Picture graph missions (Y1-8) arrive in a later slice.',
  };

  const profile = {
    name: 'ENGINEER',
    score: 0,
    level: 1,
    streak: 0,
    rank: 'Cadet Navigator',
    badges: [],
    scoresByDescriptor: {},
    solvedContexts: {},
    scoresByCatY1: MCSBandA
      ? Object.assign({}, MCSBandA.DEFAULT_CATS)
      : {
          number: 0,
          algebra: 0,
          measurement: 0,
          space: 0,
          statistics: 0,
          probability: 0,
        },
  };

  function loadProfile() {
    try {
      const raw = localStorage.getItem('joshua_math_profile');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      Object.assign(profile, parsed);
      if (typeof MCSBandA !== 'undefined') {
        MCSBandA.ensureCategoryScores(profile, 'scoresByCatY1');
      } else if (!profile.scoresByCatY1) {
        profile.scoresByCatY1 = {
          number: 0,
          algebra: 0,
          measurement: 0,
          space: 0,
          statistics: 0,
          probability: 0,
        };
      }
    } catch (e) {
      console.warn('Profile load failed', e);
    }
  }

  function saveProfile() {
    localStorage.setItem('joshua_math_profile', JSON.stringify(profile));
  }

  loadProfile();

  const state = {
    activeCategory: 'number',
    questionSession: null,
    currentQuestion: null,
    attemptsLeft: 2,
  };

  const pracTaskTitle = document.getElementById('prac-task-title');
  const pracInteractivePanel = document.getElementById('prac-interactive-panel');
  const pracAttemptsLeft = document.getElementById('prac-attempts-left');
  const pracHintContainer = document.getElementById('prac-hint-container');
  const pracHintContent = document.getElementById('prac-hint-content');
  const pracSolutionContainer = document.getElementById('prac-solution-container');
  const pracSolutionContent = document.getElementById('prac-solution-content');
  const pracFeedbackText = document.getElementById('prac-feedback-text');
  const btnPracSubmit = document.getElementById('btn-prac-submit');
  const btnPracNext = document.getElementById('btn-prac-next');
  const btnPracResetWidget = document.getElementById('btn-prac-reset-widget');
  const btnPromptAudio = document.getElementById('btn-prompt-audio');
  const pracPromptNumeral = document.getElementById('prac-prompt-numeral');
  const profileScoreEl = document.getElementById('profile-score');
  const profileLevelEl = document.getElementById('profile-level');
  const profileLevelRatio = document.getElementById('profile-level-ratio');
  const profileProgressFill = document.getElementById('profile-progress-fill');
  const profileNameEdit = document.getElementById('profile-name-edit');
  const profileAvatar = document.getElementById('profile-avatar');

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function generateMissingNext() {
    const anchor = randomInt(4, 24);
    const correct = anchor + 1;
    const min = Math.max(1, anchor - 3);
    const max = Math.min(30, anchor + 6);
    return {
      descriptor: 'AC9M1N01',
      context: 'number-track-missing-next',
      category: 'number',
      kind: 'missing-number',
      title: 'WHAT COMES NEXT?',
      prompt: `What number comes **after ${anchor}**? Tap it on the track.`,
      promptAudio: `What number comes after ${anchor}? Tap it on the track.`,
      promptNumeral: String(correct),
      widgets: [
        {
          id: 'track',
          type: 'number-track',
          config: {
            mode: 'missing-numbers',
            band: 'A',
            min,
            max,
            columns: 10,
            anchor,
            correct,
          },
        },
      ],
      inputs: [],
      evaluate(values) {
        const sel = values.track || [];
        return sel.length === 1 && sel[0] === correct;
      },
      hint: {
        text: `Start at **${anchor}** and count on one more. The next number is **${correct}**.`,
      },
      solution: {
        text: `After **${anchor}** comes **${correct}**.`,
        show: { track: [correct] },
      },
      points: 10,
      _correct: correct,
      _anchor: anchor,
    };
  }

  function generateCountBy() {
    const steps = [
      { step: 2, start: 2, max: 20 },
      { step: 5, start: 0, max: 25 },
      { step: 10, start: 0, max: 30 },
    ];
    const pick = steps[randomInt(0, steps.length - 1)];
    const expected = [];
    for (let n = pick.start; n <= pick.max; n += pick.step) {
      expected.push(n);
    }
    return {
      descriptor: 'AC9M1A01',
      context: 'number-track-count-by-steps',
      category: 'number',
      kind: 'count-by',
      title: 'COUNT BY ' + pick.step + 'S',
      prompt: `Tap every number when you **count by ${pick.step}s** on the track.`,
      promptAudio: `Tap every number when you count by ${pick.step}s on the track.`,
      promptNumeral: String(pick.step),
      widgets: [
        {
          id: 'track',
          type: 'number-track',
          config: {
            mode: 'count-by',
            band: 'A',
            min: pick.start,
            max: pick.max,
            start: pick.start,
            step: pick.step,
            columns: 10,
          },
        },
      ],
      inputs: [],
      evaluate(values) {
        const sel = values.track || [];
        if (sel.length !== expected.length) return false;
        const set = new Set(sel);
        return expected.every((n) => set.has(n));
      },
      hint: {
        text: `Start at **${pick.start}** and keep adding **${pick.step}**: ${expected.slice(0, 5).join(', ')}${expected.length > 5 ? '…' : ''}.`,
      },
      solution: {
        text: `Counting by **${pick.step}s**: ${expected.join(', ')}.`,
        show: { track: expected },
      },
      points: 10,
      _expected: expected,
      _step: pick.step,
    };
  }

  function generateTeenPartition() {
    const teen = randomInt(11, 19);
    const ones = teen % 10;
    const askOnes = Math.random() > 0.5;

    if (askOnes) {
      return {
        descriptor: 'AC9M1N02',
        context: 'teen-partition-double-frame',
        category: 'number',
        kind: 'teen-partition',
        subkind: 'ones',
        title: 'HOW MANY ONES?',
        prompt: 'Look at the double ten-frame. How many **ones** are there?',
        promptAudio: 'Look at the double ten frame. How many ones are there?',
        promptNumeral: String(teen),
        widgets: [
          {
            id: 'frame',
            type: 'ten-frame',
            config: {
              mode: 'double-frame',
              band: 'A',
              teen,
            },
          },
        ],
        inputs: [
          {
            id: 'answer',
            type: 'number-pad',
            config: { band: 'A', min: 0, max: 9 },
          },
        ],
        evaluate(values) {
          const ans = values.answer || {};
          return ans.number === ones;
        },
        hint: {
          text: `The left frame is **1 ten** (10 dots). Count the dots in the **ones** frame on the right.`,
        },
        solution: {
          text: `**${teen}** is **1 ten and ${ones} ones**.`,
          show: {
            frame: { teen },
            answer: { number: ones },
          },
        },
        points: 10,
        _teen: teen,
        _ones: ones,
        _correct: ones,
      };
    }

    return {
      descriptor: 'AC9M1N02',
      context: 'teen-partition-double-frame',
      category: 'number',
      kind: 'teen-partition',
      subkind: 'total',
      title: 'WHAT NUMBER?',
      prompt: `**1 ten** and **${ones} ones**. What number is that?`,
      promptAudio: `One ten and ${ones} ones. What number is that?`,
      promptNumeral: String(ones),
      widgets: [
        {
          id: 'frame',
          type: 'ten-frame',
          config: {
            mode: 'double-frame',
            band: 'A',
            tens: 1,
            ones,
          },
        },
      ],
      inputs: [
        {
          id: 'answer',
          type: 'number-pad',
          config: { band: 'A', min: 10, max: 19 },
        },
      ],
      evaluate(values) {
        const ans = values.answer || {};
        return ans.number === teen;
      },
      hint: {
        text: `Start at **10** for the full ten-frame, then count on **${ones}** more.`,
      },
      solution: {
        text: `**1 ten and ${ones} ones** makes **${teen}**.`,
        show: {
          frame: { teen },
          answer: { number: teen },
        },
      },
      points: 10,
      _teen: teen,
      _ones: ones,
      _correct: teen,
    };
  }

  function generateNumberLineJump() {
    const isAdd = Math.random() > 0.5;
    const delta = randomInt(1, 5);
    let start;
    let correct;
    let operation;
    let title;
    let prompt;
    let promptAudio;

    if (isAdd) {
      start = randomInt(0, 20 - delta);
      correct = start + delta;
      operation = 'add';
      title = 'JUMP FORWARD';
      prompt = `Start at **${start}**. Hop forward **${delta}** steps. Where do you land?`;
      promptAudio = `Start at ${start}. Hop forward ${delta} steps. Where do you land?`;
    } else {
      start = randomInt(delta, 18);
      correct = start - delta;
      operation = 'subtract';
      title = 'JUMP BACK';
      prompt = `Start at **${start}**. Hop back **${delta}** steps. Where do you land?`;
      promptAudio = `Start at ${start}. Hop back ${delta} steps. Where do you land?`;
    }

    return {
      descriptor: 'AC9M1N04',
      context: 'number-line-jump-within-twenty',
      category: 'algebra',
      kind: 'number-line-jump',
      subkind: operation,
      title,
      prompt,
      promptAudio,
      promptNumeral: isAdd ? '+' + delta : '−' + delta,
      widgets: [
        {
          id: 'line',
          type: 'number-line',
          config: {
            mode: 'jump',
            band: 'A',
            min: 0,
            max: 20,
            start,
            delta,
            operation,
          },
        },
      ],
      inputs: [],
      evaluate(values) {
        const line = values.line || {};
        return line.position === correct;
      },
      hint: {
        text: isAdd
          ? `Hop forward from **${start}** one step at a time. Count **${delta}** hops.`
          : `Hop back from **${start}** one step at a time. Count **${delta}** hops.`,
      },
      solution: {
        text: isAdd
          ? `**${start} + ${delta} = ${correct}**.`
          : `**${start} − ${delta} = ${correct}**.`,
        show: { line: { position: correct, target: correct } },
      },
      points: 10,
      _start: start,
      _delta: delta,
      _correct: correct,
      _operation: operation,
    };
  }

  const generators = {
    number: [generateMissingNext, generateCountBy, generateTeenPartition],
    algebra: [generateNumberLineJump],
    measurement: [],
    space: [],
    statistics: [],
  };

  function updateProfileUI() {
    profileScoreEl.textContent = `${profile.score} PTS`;
    const levelPts = profile.score % 100;
    profileLevelEl.textContent = `Level ${profile.level}`;
    profileLevelRatio.textContent = `${levelPts}/100 PTS`;
    profileProgressFill.style.width = `${levelPts}%`;
    profileNameEdit.value = profile.name;
    profileAvatar.textContent = (profile.name || 'E').charAt(0).toUpperCase();
  }

  profileNameEdit.addEventListener('change', () => {
    profile.name = profileNameEdit.value.trim().slice(0, 12) || 'ENGINEER';
    saveProfile();
    updateProfileUI();
  });

  function hasAttemptableState(values) {
    const q = state.currentQuestion;
    if (values.answer && values.answer.number != null) return true;
    const line = values.line;
    if (q?.kind === 'number-line-jump') {
      return line && line.position != null && line.position !== line.start;
    }
    const sel = values.track;
    if (!Array.isArray(sel)) return false;
    if (q?.kind === 'missing-number') return sel.length === 1;
    if (q?.kind === 'count-by') {
      return sel.length === (q._expected?.length || 0);
    }
    return sel.length > 0;
  }

  function updateSubmitGate() {
    if (!state.questionSession) {
      btnPracSubmit.disabled = true;
      return;
    }
    const values = state.questionSession.collect();
    btnPracSubmit.disabled = !hasAttemptableState(values);
  }

  function wireChangeHandlers() {
    if (!state.questionSession) return;
    Object.values(state.questionSession.instances).forEach((inst) => {
      if (inst && typeof inst.onChange === 'function') {
        inst.onChange(updateSubmitGate);
      }
    });
  }

  function flagPrimaryWidget(method) {
    if (!state.questionSession) return;
    const q = state.currentQuestion;
    const inst = state.questionSession.instances;
    if (q?.kind === 'teen-partition' && inst.answer && typeof inst.answer[method] === 'function') {
      inst.answer[method]();
      return;
    }
    if (inst.line && typeof inst.line[method] === 'function') {
      inst.line[method]();
      return;
    }
    if (inst.track && typeof inst.track[method] === 'function') {
      inst.track[method]();
    }
  }

  function showStrandPlaceholder() {
    if (state.questionSession) {
      state.questionSession.dispose();
      state.questionSession = null;
    }

    pracTaskTitle.textContent = 'MISSIONS LOADING';
    pracPromptNumeral.textContent = '';
    btnPromptAudio.disabled = true;
    btnPracSubmit.disabled = true;
    btnPracResetWidget.disabled = true;
    btnPracNext.style.display = 'none';
    btnPracSubmit.style.display = 'inline-block';
    pracAttemptsLeft.textContent = 'SOON';
    pracHintContainer.style.display = 'none';
    pracSolutionContainer.style.display = 'none';
    pracFeedbackText.style.display = 'none';

    const codeEl = document.getElementById('practice-code');
    if (codeEl) codeEl.textContent = '[Y1-SCAFFOLD]';

    if (typeof MCSBandA !== 'undefined') {
      MCSBandA.showEmptyStrand(
        pracInteractivePanel,
        STRAND_PLACEHOLDERS[state.activeCategory] || 'More missions coming soon.'
      );
    }
  }

  function loadQuestion() {
    if (state.questionSession) {
      state.questionSession.dispose();
      state.questionSession = null;
    }

    pracHintContainer.style.display = 'none';
    pracSolutionContainer.style.display = 'none';
    pracFeedbackText.style.display = 'none';
    btnPracSubmit.style.display = 'inline-block';
    btnPracNext.style.display = 'none';
    btnPracSubmit.disabled = true;

    const pool = generators[state.activeCategory] || [];
    if (!pool.length) {
      showStrandPlaceholder();
      return;
    }

    state.attemptsLeft = 2;
    pracAttemptsLeft.textContent = '2 TRIES LEFT';
    btnPromptAudio.disabled = false;
    btnPracResetWidget.disabled = false;

    const rawQuestion = pool[Math.floor(Math.random() * pool.length)]();
    state.currentQuestion = rawQuestion;

    state.questionSession = MCS.runQuestion(rawQuestion, {
      widgetMount: pracInteractivePanel,
      promptMount: pracTaskTitle,
      band: 'A',
      speakPrompt: true,
    });

    pracPromptNumeral.textContent = rawQuestion.promptNumeral || '';
    const codeEl = document.getElementById('practice-code');
    if (codeEl && rawQuestion.descriptor) {
      codeEl.textContent = `[${rawQuestion.descriptor}]`;
    }

    wireChangeHandlers();
    updateSubmitGate();
  }

  btnPromptAudio.addEventListener('click', () => {
    sounds.click();
    if (state.currentQuestion?.promptAudio && MCS.speech) {
      MCS.speech.speak(state.currentQuestion.promptAudio);
    }
  });

  btnPracResetWidget.addEventListener('click', () => {
    sounds.click();
    if (!state.questionSession) return;
    const inst = state.questionSession.instances;
    if (inst.line && typeof inst.line.setValue === 'function') {
      inst.line.setValue({ reset: true });
    }
    if (inst.track && typeof inst.track.setValue === 'function') {
      inst.track.setValue([]);
    }
    if (inst.answer && typeof inst.answer.setValue === 'function') {
      inst.answer.setValue({ number: null });
    }
    updateSubmitGate();
  });

  btnPracSubmit.addEventListener('click', () => {
    if (!state.questionSession) return;
    sounds.click();
    const correct = state.questionSession.evaluate();
    const q = state.currentQuestion;

    if (correct) {
      sounds.success();
      flagPrimaryWidget('flagCorrect');
      pracFeedbackText.textContent = 'GREAT JOB! +10 POINTS';
      pracFeedbackText.className = 'active-feedback-text feedback-success';
      pracFeedbackText.style.display = 'block';

      profile.score += q.points || 10;
      profile.level = Math.floor(profile.score / 100) + 1;
      const cat = q.category || 'number';
      profile.scoresByCatY1[cat] = (profile.scoresByCatY1[cat] || 0) + (q.points || 10);
      const ctxKey = `${q.descriptor}::${q.context}`;
      profile.solvedContexts[ctxKey] = (profile.solvedContexts[ctxKey] || 0) + 1;
      saveProfile();
      updateProfileUI();
      if (typeof MCSBandA !== 'undefined') {
        MCSBandA.renderBadgeShelf(profile, 'badge-shelf-container', 3);
      }

      state.questionSession.setEnabled(false);
      btnPracSubmit.style.display = 'none';
      btnPracNext.style.display = 'inline-block';
    } else {
      sounds.error();
      flagPrimaryWidget('flagIncorrect');
      state.attemptsLeft -= 1;
      if (state.attemptsLeft > 0) {
        pracAttemptsLeft.textContent = `${state.attemptsLeft} TRIES LEFT`;
        state.questionSession.showHint(pracHintContent);
        pracHintContainer.style.display = 'block';
      } else {
        pracAttemptsLeft.textContent = 'SHOWING ANSWER';
        state.questionSession.showSolution(pracSolutionContent);
        pracSolutionContainer.style.display = 'block';
        state.questionSession.setEnabled(false);
        btnPracSubmit.style.display = 'none';
        btnPracNext.style.display = 'inline-block';
      }
    }
  });

  btnPracNext.addEventListener('click', () => {
    sounds.click();
    loadQuestion();
  });

  document.querySelectorAll('.selector-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      sounds.click();
      document.querySelectorAll('.selector-tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      state.activeCategory = tab.getAttribute('data-task');
      loadQuestion();
    });
  });

  updateProfileUI();
  if (typeof MCSBandA !== 'undefined') {
    MCSBandA.applyStrandTabs(document);
    MCSBandA.renderBadgeShelf(profile, 'badge-shelf-container', 3);
    MCSBandA.initAdultConsole({
      getSummary: function () {
        const cats = profile.scoresByCatY1 || {};
        const solved = Object.keys(profile.solvedContexts || {}).length;
        return (
          'Year 1 · ' +
          profile.name +
          '\nScore: ' +
          profile.score +
          ' · Contexts solved: ' +
          solved +
          '\nY1 strand pts: N' +
          (cats.number || 0) +
          ' A' +
          (cats.algebra || 0) +
          ' M' +
          (cats.measurement || 0) +
          ' S' +
          (cats.space || 0) +
          ' St' +
          (cats.statistics || 0)
        );
      },
    });
  }
  loadQuestion();
});
