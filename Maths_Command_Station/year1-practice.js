/**
 * Year 1 practice console (Phase 5.9 scaffold + 5.10–5.10g — all 8 Y1 families).
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
    badgeUnlock: () => {
      playSound(261.63, 0.1, 'sine', 0.1);
      setTimeout(() => playSound(329.63, 0.1, 'sine', 0.1), 80);
      setTimeout(() => playSound(392.0, 0.1, 'sine', 0.1), 160);
      setTimeout(() => playSound(523.25, 0.25, 'sine', 0.15), 240);
    },
  };

  if (typeof MCS !== 'undefined' && MCS.audio) {
    MCS.audio.register(playSound);
  }

  const STRAND_PLACEHOLDERS = {};

  const SHAPE_TEMPLATES = [
    {
      shape: 'triangle',
      label: 'triangle',
      referenceVertices: [
        [0, 3],
        [1, 1],
        [2, 3],
      ],
    },
    {
      shape: 'square',
      label: 'square',
      referenceVertices: [
        [0, 1],
        [1, 1],
        [1, 2],
        [0, 2],
      ],
    },
    {
      shape: 'rectangle',
      label: 'rectangle',
      referenceVertices: [
        [0, 1],
        [2, 1],
        [2, 3],
        [0, 3],
      ],
    },
  ];

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
        MCSBandA.migrateLegacyContexts(profile);
        MCSBandA.ensureDescriptorFields(profile);
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
    sessionSeenQuestions: new Set(),
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

  function generateInformalUnits() {
    const length = randomInt(3, 9);
    const objects = ['pencil', 'crayon', 'ribbon'];
    const objectLabel = objects[randomInt(0, objects.length - 1)];
    return {
      descriptor: 'AC9M1M01',
      context: 'ruler-informal-units-paperclips',
      category: 'measurement',
      kind: 'informal-units',
      title: 'MEASURE WITH CLIPS',
      prompt: `Place **paperclips** end-to-end to measure the **${objectLabel}**.`,
      promptAudio: `Place paperclips end to end to measure the ${objectLabel}.`,
      promptNumeral: String(length),
      widgets: [
        {
          id: 'ruler',
          type: 'ruler',
          config: {
            mode: 'informal-units',
            band: 'A',
            length,
            objectLabel,
          },
        },
      ],
      inputs: [],
      evaluate(values) {
        const v = values.ruler || {};
        return v.unitsUsed === length;
      },
      hint: {
        text: `Lay one paperclip after another along the **${objectLabel}** until you reach the end. Count each clip.`,
      },
      solution: {
        text: `The **${objectLabel}** is **${length} paperclips** long.`,
        show: { ruler: { unitsUsed: length } },
      },
      points: 10,
      _length: length,
      _objectLabel: objectLabel,
    };
  }

  function generateHourHalfClock() {
    const targetHours = randomInt(1, 12);
    const isHalfPast = Math.random() > 0.5;
    const targetMinutes = isHalfPast ? 30 : 0;
    const title = isHalfPast ? 'HALF PAST' : "O'CLOCK";
    const prompt = isHalfPast
      ? `Set the clock to **half past ${targetHours}**.`
      : `Set the clock to **${targetHours} o'clock**.`;
    const promptAudio = isHalfPast
      ? `Set the clock to half past ${targetHours}.`
      : `Set the clock to ${targetHours} o'clock.`;
    const promptNumeral = isHalfPast ? `${targetHours}:30` : `${targetHours}:00`;
    const hintText = isHalfPast
      ? 'Half past means **30 minutes**. The **long hand** points to **6**. The **short hand** is halfway between two numbers.'
      : 'The **long hand** points to **12**. The **short hand** points straight at the hour number.';
    const solutionText = isHalfPast
      ? `Half past **${targetHours}** is **${targetHours}:30**.`
      : `**${targetHours} o'clock** is **${targetHours}:00**.`;

    return {
      descriptor: 'AC9M1M03',
      context: 'clock-set-oclock-half-past',
      category: 'measurement',
      kind: 'hour-half-clock',
      subkind: isHalfPast ? 'half-past' : 'oclock',
      title,
      prompt,
      promptAudio,
      promptNumeral,
      widgets: [
        {
          id: 'clock',
          type: 'analog-clock',
          config: {
            mode: 'set-time',
            band: 'A',
            hours: 12,
            minutes: 0,
            draggable: 'both',
            snapMinutes: 30,
            gear: true,
            showDigital: false,
          },
        },
      ],
      inputs: [],
      evaluate(values) {
        const c = values.clock || {};
        return c.hours === targetHours && c.minutes === targetMinutes;
      },
      hint: {
        text: hintText,
        highlight: ['clock'],
      },
      solution: {
        text: solutionText,
        show: { clock: { hours: targetHours, minutes: targetMinutes } },
      },
      points: 10,
      _targetHours: targetHours,
      _targetMinutes: targetMinutes,
      _initialHours: 12,
      _initialMinutes: 0,
    };
  }

  function generateCopyShape() {
    const pick = SHAPE_TEMPLATES[randomInt(0, SHAPE_TEMPLATES.length - 1)];
    const buildOffset = 3;
    const targetVertices = pick.referenceVertices.map(([c, r]) => [c + buildOffset, r]);
    return {
      descriptor: 'AC9M1SP01',
      context: 'shape-builder-copy-pegboard',
      category: 'space',
      kind: 'copy-shape',
      title: 'COPY THE SHAPE',
      prompt: `Copy the **${pick.label}** on the pegboard.`,
      promptAudio: `Copy the ${pick.label} on the pegboard. Tap the pegs on the right to match.`,
      promptNumeral: pick.label.charAt(0).toUpperCase(),
      widgets: [
        {
          id: 'shapes',
          type: 'shape-builder',
          config: {
            mode: 'copy-shape',
            band: 'A',
            shape: pick.shape,
            shapeLabel: pick.label,
            referenceVertices: pick.referenceVertices,
            targetVertices,
            buildColOffset: buildOffset,
          },
        },
      ],
      inputs: [],
      evaluate(values) {
        const v = values.shapes || {};
        const student = v.vertices || [];
        const target = v.targetVertices || targetVertices;
        if (student.length !== target.length) return false;
        const set = new Set(student.map(([c, r]) => `${c},${r}`));
        return target.every(([c, r]) => set.has(`${c},${r}`));
      },
      hint: {
        text: `Look at the **${pick.label}** on the left. Tap the same pegs on the **right side** to match.`,
        highlight: ['shapes'],
      },
      solution: {
        text: `Place pegs at the same spots as the **${pick.label}** on the right side.`,
        show: { shapes: { vertices: targetVertices } },
      },
      points: 10,
      _targetVertices: targetVertices,
      _vertexCount: targetVertices.length,
      _shapeLabel: pick.label,
    };
  }

  function generatePictureGraphFavourites() {
    const surveys = [
      {
        topic: 'cats or dogs',
        columnHint: 'Favourite pet',
        trayLabel: 'Friend cards',
        columns: [
          { id: 'cat', label: 'Cats', emoji: '🐱' },
          { id: 'dog', label: 'Dogs', emoji: '🐶' },
        ],
        cards: [
          { id: 'amy', emoji: '👧', label: 'Amy · Cats', category: 'cat' },
          { id: 'ben', emoji: '👦', label: 'Ben · Dogs', category: 'dog' },
          { id: 'cleo', emoji: '👧', label: 'Cleo · Cats', category: 'cat' },
          { id: 'dan', emoji: '👦', label: 'Dan · Dogs', category: 'dog' },
        ],
      },
      {
        topic: 'apples or bananas',
        columnHint: 'Favourite fruit',
        trayLabel: 'Friend cards',
        columns: [
          { id: 'apple', label: 'Apples', emoji: '🍎' },
          { id: 'banana', label: 'Bananas', emoji: '🍌' },
        ],
        cards: [
          { id: 'ella', emoji: '👧', label: 'Ella · Apple', category: 'apple' },
          { id: 'finn', emoji: '👦', label: 'Finn · Banana', category: 'banana' },
          { id: 'gus', emoji: '👦', label: 'Gus · Apple', category: 'apple' },
          { id: 'hana', emoji: '👧', label: 'Hana · Banana', category: 'banana' },
        ],
      },
      {
        topic: 'red or blue',
        columnHint: 'Favourite colour',
        trayLabel: 'Friend cards',
        columns: [
          { id: 'red', label: 'Red', emoji: '🔴' },
          { id: 'blue', label: 'Blue', emoji: '🔵' },
        ],
        cards: [
          { id: 'ivy', emoji: '👧', label: 'Ivy · Red', category: 'red' },
          { id: 'jay', emoji: '👦', label: 'Jay · Blue', category: 'blue' },
          { id: 'kim', emoji: '👧', label: 'Kim · Red', category: 'red' },
          { id: 'leo', emoji: '👦', label: 'Leo · Blue', category: 'blue' },
          { id: 'mia', emoji: '👧', label: 'Mia · Red', category: 'red' },
        ],
      },
    ];
    const pick = surveys[randomInt(0, surveys.length - 1)];
    const solutionZones = {};
    pick.columns.forEach((col) => {
      solutionZones[col.id] = [];
    });
    pick.cards.forEach((c) => {
      solutionZones[c.category].push(c.id);
    });
    const colLabels = pick.columns.map((c) => c.label).join(' or ');
    return {
      descriptor: 'AC9M1ST01',
      context: 'picture-graph-favourites-one-to-one',
      category: 'statistics',
      kind: 'picture-sort',
      title: 'BUILD THE GRAPH',
      prompt: `Sort each friend into **${colLabels}** to make a picture graph.`,
      promptAudio: `Sort each friend into ${colLabels} to make a picture graph.`,
      promptNumeral: '',
      widgets: [
        {
          id: 'sort',
          type: 'sorting-table',
          config: {
            mode: 'picture-graph',
            band: 'A',
            columns: pick.columns,
            cards: pick.cards,
            columnHint: pick.columnHint,
            trayLabel: pick.trayLabel,
            shuffle: true,
          },
        },
      ],
      inputs: [],
      evaluate(values) {
        const v = values.sort || {};
        const zones = v.zones || {};
        if ((v.filled || 0) !== pick.cards.length) return false;
        return pick.cards.every((c) => (zones[c.category] || []).includes(c.id));
      },
      hint: {
        text: `Read each card. Drag it into the **${colLabels}** column that matches.`,
        highlight: ['sort'],
      },
      solution: {
        text: `One picture in each column for every friend — **${pick.columnHint.toLowerCase()}**.`,
        show: { sort: { zones: solutionZones } },
      },
      points: 10,
      _totalCards: pick.cards.length,
      _solutionZones: solutionZones,
    };
  }

  const generators = {
    number: [generateMissingNext, generateCountBy, generateTeenPartition],
    algebra: [generateNumberLineJump],
    measurement: [generateInformalUnits, generateHourHalfClock],
    space: [generateCopyShape],
    statistics: [generatePictureGraphFavourites],
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
    const ruler = values.ruler;
    if (q?.kind === 'informal-units') {
      return ruler && ruler.unitsUsed > 0;
    }
    if (q?.kind === 'hour-half-clock' && values.clock) {
      const c = values.clock;
      return c.hours !== q._initialHours || c.minutes !== q._initialMinutes;
    }
    const shapes = values.shapes;
    if (q?.kind === 'copy-shape') {
      const verts = shapes?.vertices || [];
      return verts.length === (q._vertexCount || 0);
    }
    const sort = values.sort;
    if (q?.kind === 'picture-sort') {
      return (sort?.filled || 0) === (q._totalCards || 0);
    }
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
      return;
    }
    if (inst.ruler && typeof inst.ruler[method] === 'function') {
      inst.ruler[method]();
      return;
    }
    if (inst.clock && typeof inst.clock[method] === 'function') {
      inst.clock[method]();
      return;
    }
    if (inst.shapes && typeof inst.shapes[method] === 'function') {
      inst.shapes[method]();
      return;
    }
    if (inst.sort && typeof inst.sort[method] === 'function') {
      inst.sort[method]();
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

    let rawQuestion;
    if (state.activeDescriptor && state.descriptorSession) {
        const activeContext = state.descriptorSession.contexts[state.descriptorSession.activeContextIdx];
        let tries = 0;
        const maxTries = 1000;
        while (tries < maxTries) {
            rawQuestion = MCS.questionPicker.pickFromPool(pool, state.sessionSeenQuestions);
            if (rawQuestion.context === activeContext) break;
            tries++;
        }
        if (tries >= maxTries) {
            console.warn(`Could not generate question for context ${activeContext} after ${maxTries} tries. Falling back.`);
            rawQuestion = MCS.questionPicker.pickFromPool(pool, state.sessionSeenQuestions);
        }
    } else {
        rawQuestion = MCS.questionPicker.pickFromPool(pool, state.sessionSeenQuestions);
    }
    if (!rawQuestion) return;
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
    if (inst.ruler && typeof inst.ruler.setValue === 'function') {
      inst.ruler.setValue({ reset: true });
    }
    if (inst.clock && typeof inst.clock.setValue === 'function') {
      const q = state.currentQuestion;
      inst.clock.setValue({
        hours: q?._initialHours != null ? q._initialHours : 12,
        minutes: q?._initialMinutes != null ? q._initialMinutes : 0,
      });
    }
    if (inst.shapes && typeof inst.shapes.setValue === 'function') {
      inst.shapes.setValue({ reset: true });
    }
    if (inst.sort && typeof inst.sort.setValue === 'function') {
      inst.sort.setValue({ reset: true });
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

      if (typeof MCSBandA !== 'undefined') {
        MCSBandA.gainPoints({
          profile: profile,
          pts: q.points || 10,
          isCorrect: true,
          category: q.category || 'number',
          descriptor: q.descriptor,
          context: q.context,
          year: 1,
          sounds: sounds,
          saveProfile: saveProfile,
          updateProfileUI: updateProfileUI,
          shelfId: 'badge-shelf-container',
        });
      } else {
        profile.score += q.points || 10;
        profile.level = Math.floor(profile.score / 100) + 1;
        const cat = q.category || 'number';
        profile.scoresByCatY1[cat] = (profile.scoresByCatY1[cat] || 0) + (q.points || 10);
        saveProfile();
        updateProfileUI();
      }

      state.questionSession.setEnabled(false);
      btnPracSubmit.style.display = 'none';
      btnPracNext.style.display = 'inline-block';
    } else {
      sounds.error();
      flagPrimaryWidget('flagIncorrect');
      if (typeof MCSBandA !== 'undefined' && q.descriptor) {
        MCSBandA.gainPoints({
          profile: profile,
          pts: 0,
          isCorrect: false,
          descriptor: q.descriptor,
          context: q.context,
          year: 1,
          saveProfile: saveProfile,
        });
      }
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
        if (state.descriptorSession && state.descriptorSession.completed && typeof MCS !== 'undefined' && MCS.focusedSession) {
            MCS.focusedSession.exit(state, true, {
                onExit: (completed) => {
                    MCS.focusedSession.renderDashboard('dashboard-strands-container', 1, profile);
                    if (typeof renderBadgeShelf !== 'undefined') renderBadgeShelf();
                    if (typeof renderTrophyRoom !== 'undefined') renderTrophyRoom();
                }
            });
            return;
        }
        if (state.descriptorSession && typeof MCS !== 'undefined' && MCS.focusedSession) {
            MCS.focusedSession.updateProgress(state.descriptorSession);
        }
    sounds.click();
    loadQuestion();
  });

  
    if (typeof MCS !== 'undefined' && MCS.focusedSession) {
        MCS.focusedSession.renderDashboard('dashboard-strands-container', 1, profile, (badgeId) => {
            if (MCS.focusedSession.start(state, badgeId)) {
                const badgeConfig = DESCRIPTOR_BADGES[badgeId];
                if (badgeConfig) state.activeCategory = badgeConfig.strand;
                MCS.focusedSession.updateProgress(state.descriptorSession);
                loadQuestion();
            }
        });
    }

    const backBtn = document.getElementById('btn-back-to-dashboard');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            if (state.descriptorSession) {
                MCS.focusedSession.exit(state, false, {
                    onExit: () => {
                        MCS.focusedSession.renderDashboard('dashboard-strands-container', 1, profile);
                        if (typeof renderBadgeShelf !== 'undefined') renderBadgeShelf();
                        if (typeof renderTrophyRoom !== 'undefined') renderTrophyRoom();
                    }
                });
            }
        });
    }

    if (typeof updateUI !== 'undefined') updateUI();
    if (typeof renderBadgeShelf !== 'undefined') renderBadgeShelf();
    if (typeof renderTrophyRoom !== 'undefined') renderTrophyRoom();
});

