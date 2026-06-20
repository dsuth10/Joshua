/**
 * Prep / Foundation practice console (Phase 5).
 * Band A — audio prompts, counters / ten-frame + number-pad, scoresByCatF profile.
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
    hint: () => playSound(440, 0.1, 'triangle', 0.08),
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

  const profile = {
    name: 'ENGINEER',
    score: 0,
    level: 1,
    streak: 0,
    rank: 'Rookie Explorer',
    badges: [],
    scoresByDescriptor: {},
    solvedContexts: {},
    scoresByCatF: {
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
        MCSBandA.ensureCategoryScores(profile, 'scoresByCatF');
      }
      if (!profile.scoresByCatF) {
        profile.scoresByCatF = {
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
  const btnPromptAudio = document.getElementById('btn-prompt-audio');
  const pracPromptNumeral = document.getElementById('prac-prompt-numeral');
  const btnPracResetWidget = document.getElementById('btn-prac-reset-widget');
  const profileScoreEl = document.getElementById('profile-score');
  const profileLevelEl = document.getElementById('profile-level');
  const profileLevelRatio = document.getElementById('profile-level-ratio');
  const profileProgressFill = document.getElementById('profile-progress-fill');
  const profileNameEdit = document.getElementById('profile-name-edit');
  const profileAvatar = document.getElementById('profile-avatar');

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

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function generateCountDocking() {
    const target = randomInt(3, 8);
    return {
      descriptor: 'AC9MFN01',
      context: 'free-count-docking',
      category: 'number',
      kind: 'counters',
      title: 'COUNT THE SATELLITES',
      prompt: `Drag **${target}** satellites into the docking bay.`,
      promptAudio: `Drag ${target} satellites into the docking bay.`,
      promptNumeral: String(target),
      widgets: [
        {
          id: 'counters',
          type: 'counters',
          config: {
            mode: 'free-count',
            band: 'A',
            maxSupply: 20,
            zones: [{ id: 'bay', label: 'Docking Bay', capacity: target + 6 }],
          },
        },
      ],
      inputs: [],
      evaluate(values) {
        const v = values.counters || {};
        return (v.bay || 0) === target;
      },
      hint: {
        text: `Place exactly **${target}** satellites in the docking bay. Count each one as you drag.`,
      },
      solution: {
        text: `Put **${target}** satellites in the bay.`,
        show: { counters: { bay: target } },
      },
      points: 10,
      _target: target,
    };
  }

  function generateSubitiseFlash() {
    const count = randomInt(1, 6);
    return {
      descriptor: 'AC9MFN02',
      context: 'ten-frame-subitise',
      category: 'number',
      kind: 'subitise',
      title: 'HOW MANY DOTS?',
      prompt: 'Watch the ten-frame **flash**. How many dots did you see?',
      promptAudio: 'Watch the dots flash. How many dots did you see?',
      promptNumeral: '',
      widgets: [
        {
          id: 'frame',
          type: 'ten-frame',
          config: {
            mode: 'show-me',
            band: 'A',
            count,
            flashMs: 1400,
          },
        },
      ],
      inputs: [
        {
          id: 'answer',
          type: 'number-pad',
          config: { band: 'A', min: 0, max: 10 },
        },
      ],
      evaluate(values) {
        const ans = values.answer || {};
        return ans.number === count;
      },
      hint: {
        text: 'Tap **Show again** on the frame, then tap the number on the pad.',
      },
      solution: {
        text: `There were **${count}** dots on the ten-frame.`,
        show: {
          frame: { count, reveal: true },
          answer: { number: count },
        },
      },
      points: 10,
      _target: count,
    };
  }

  function generateCompareGroups() {
    const left = randomInt(2, 7);
    let right = randomInt(2, 7);
    while (right === left) right = randomInt(2, 7);
    const askMore = Math.random() > 0.5;
    const correctId = askMore ? (left > right ? 'left' : 'right') : left < right ? 'left' : 'right';
    const word = askMore ? 'more' : 'fewer';
    return {
      descriptor: 'AC9MFN03',
      context: 'compare-zones-more-fewer',
      category: 'number',
      kind: 'compare',
      title: askMore ? 'WHICH HAS MORE?' : 'WHICH HAS FEWER?',
      prompt: `Tap the group with **${word}** satellites.`,
      promptAudio: `Tap the group with ${word} satellites.`,
      promptNumeral: '',
      widgets: [
        {
          id: 'counters',
          type: 'counters',
          config: {
            mode: 'compare-zones',
            band: 'A',
            compare: word,
            zones: [
              { id: 'left', label: 'Group A', count: left },
              { id: 'right', label: 'Group B', count: right },
            ],
          },
        },
      ],
      inputs: [],
      evaluate(values) {
        const v = values.counters || {};
        return v.selected === correctId;
      },
      hint: {
        text: `Count the satellites in each group. Tap the one with **${word}**.`,
      },
      solution: {
        text: `**Group ${correctId === 'left' ? 'A' : 'B'}** has ${word}.`,
        show: { counters: { selected: correctId } },
      },
      points: 10,
      _correctId: correctId,
      _compare: word,
    };
  }

  function generateShareFair() {
    const total = 8;
    const perRover = total / 2;
    return {
      descriptor: 'AC9MFN06',
      context: 'make-equal-groups-share',
      category: 'number',
      kind: 'share',
      title: 'SHARE THE FUEL',
      prompt: `Share **${total}** fuel cells **fairly** between the two rovers.`,
      promptAudio: `Share ${total} fuel cells fairly between the two rovers.`,
      promptNumeral: String(total),
      widgets: [
        {
          id: 'counters',
          type: 'counters',
          config: {
            mode: 'make-equal-groups',
            band: 'A',
            total,
            zones: [
              { id: 'roverA', label: 'Rover A', capacity: total },
              { id: 'roverB', label: 'Rover B', capacity: total },
            ],
          },
        },
      ],
      inputs: [],
      evaluate(values) {
        const v = values.counters || {};
        return v.roverA === perRover && v.roverB === perRover;
      },
      hint: {
        text: `Each rover should get the **same** number. ${total} shared by 2 means **${perRover}** each.`,
      },
      solution: {
        text: `Put **${perRover}** fuel cells on each rover.`,
        show: { counters: { roverA: perRover, roverB: perRover } },
      },
      points: 10,
      _perRover: perRover,
    };
  }

  function generateFillTenFrame() {
    const target = Math.random() > 0.5 ? 5 : 10;
    return {
      descriptor: 'AC9MFN04',
      context: target === 5 ? 'ten-frame-fill-five' : 'ten-frame-fill-ten',
      category: 'number',
      kind: 'fill-frame',
      title: target === 5 ? 'MAKE 5' : 'MAKE 10',
      prompt: `Tap the ten-frame to fill **${target}** dots.`,
      promptAudio: `Tap the ten frame to fill ${target} dots.`,
      promptNumeral: String(target),
      widgets: [
        {
          id: 'frame',
          type: 'ten-frame',
          config: {
            mode: 'fill-to',
            band: 'A',
            target,
            initial: 0,
          },
        },
      ],
      inputs: [],
      evaluate(values) {
        const v = values.frame || {};
        return v.filled === target;
      },
      hint: {
        text: `Keep tapping until you have **${target}** dots in the frame.`,
      },
      solution: {
        text: `Fill **${target}** cells with dots.`,
        show: { frame: { filled: target } },
      },
      points: 10,
      _target: target,
      _initial: 0,
    };
  }

  function generateMakeTen() {
    const start = randomInt(1, 7);
    return {
      descriptor: 'AC9MFN04',
      context: 'ten-frame-make-ten',
      category: 'number',
      kind: 'fill-frame',
      title: 'MAKE 10',
      prompt: `You have **${start}** dots. Tap to **make 10**.`,
      promptAudio: `You have ${start} dots. Tap to make ten.`,
      promptNumeral: '10',
      widgets: [
        {
          id: 'frame',
          type: 'ten-frame',
          config: {
            mode: 'make-ten',
            band: 'A',
            initial: start,
          },
        },
      ],
      inputs: [],
      evaluate(values) {
        const v = values.frame || {};
        return v.filled === 10;
      },
      hint: {
        text: `You need **${10 - start}** more dots to make 10.`,
      },
      solution: {
        text: `Add dots until the frame shows **10**.`,
        show: { frame: { filled: 10 } },
      },
      points: 10,
      _target: 10,
      _initial: start,
    };
  }

  function generateMissionDayOrder() {
    const events = [
      { id: 'wake', label: 'Wake up', emoji: '🌅' },
      { id: 'breakfast', label: 'Breakfast', emoji: '🥣' },
      { id: 'mission', label: 'Mission', emoji: '🚀' },
      { id: 'bedtime', label: 'Bedtime', emoji: '🌙' },
    ];
    const correctOrder = events.map((e) => e.id);
    return {
      descriptor: 'AC9MFM02',
      context: 'sequence-lane-mission-day',
      category: 'measurement',
      kind: 'sequence',
      title: 'ORDER YOUR DAY',
      prompt: 'Drag the mission cards into order from **morning to night**.',
      promptAudio: 'Drag the mission cards into order from morning to night.',
      promptNumeral: '',
      widgets: [
        {
          id: 'sort',
          type: 'sorting-table',
          config: {
            mode: 'sequence-lane',
            band: 'A',
            cards: events,
            laneHint: 'Morning → Night',
            shuffle: true,
          },
        },
      ],
      inputs: [],
      evaluate(values) {
        const v = values.sort || {};
        const seq = v.sequence || [];
        if (seq.length !== correctOrder.length) return false;
        return seq.every((id, i) => id === correctOrder[i]);
      },
      hint: {
        text: 'Start with **wake up**, then breakfast, mission time, and **bedtime** last.',
      },
      solution: {
        text: 'Morning to night: **Wake up → Breakfast → Mission → Bedtime**.',
        show: { sort: { sequence: correctOrder } },
      },
      points: 10,
      _correctOrder: correctOrder,
    };
  }

  function generateContinuePattern() {
    const variants = [
      {
        sequence: ['blue-square', 'yellow-triangle', 'blue-square', 'yellow-triangle'],
        correctBlanks: ['blue-square', 'yellow-triangle'],
        tray: ['blue-square', 'yellow-triangle', 'yellow-triangle', 'blue-square'],
        unitA: 'blue square',
        unitB: 'yellow triangle',
      },
      {
        sequence: ['green-circle', 'blue-square', 'green-circle', 'blue-square'],
        correctBlanks: ['green-circle', 'blue-square'],
        tray: ['green-circle', 'blue-square', 'blue-square', 'green-circle'],
        unitA: 'green circle',
        unitB: 'blue square',
      },
      {
        sequence: ['yellow-triangle', 'green-circle', 'yellow-triangle', 'green-circle'],
        correctBlanks: ['yellow-triangle', 'green-circle'],
        tray: ['yellow-triangle', 'green-circle', 'green-circle', 'yellow-triangle'],
        unitA: 'yellow triangle',
        unitB: 'green circle',
      },
    ];
    const pick = variants[randomInt(0, variants.length - 1)];
    return {
      descriptor: 'AC9MFA01',
      context: 'continue-pattern-ab-blocks',
      category: 'algebra',
      kind: 'continue-pattern',
      title: 'CONTINUE THE PATTERN',
      prompt: 'Drag blocks to **continue** the repeating pattern.',
      promptAudio: 'Drag blocks to continue the repeating pattern.',
      promptNumeral: '',
      widgets: [
        {
          id: 'blocks',
          type: 'pattern-blocks',
          config: {
            mode: 'continue-pattern',
            band: 'A',
            sequence: pick.sequence,
            blankCount: 2,
            tray: pick.tray,
          },
        },
      ],
      inputs: [],
      evaluate(values) {
        const v = values.blocks || {};
        const blanks = v.blanks || [];
        if (blanks.length !== pick.correctBlanks.length) return false;
        return blanks.every((id, i) => id === pick.correctBlanks[i]);
      },
      hint: {
        text: `The pattern repeats **${pick.unitA}**, **${pick.unitB}**. What comes next?`,
      },
      solution: {
        text: `Continue with **${pick.unitA}** then **${pick.unitB}**.`,
        show: { blocks: { blanks: pick.correctBlanks } },
      },
      points: 10,
      _correctBlanks: pick.correctBlanks,
      _blankCount: 2,
    };
  }

  function generateCompareLength() {
    const left = randomInt(2, 5);
    let right = randomInt(2, 8);
    while (right === left) right = randomInt(2, 8);
    const correctId = left > right ? 'left' : 'right';
    return {
      descriptor: 'AC9MFM01',
      context: 'ruler-informal-compare-longer',
      category: 'measurement',
      kind: 'measure-compare',
      title: 'WHICH IS LONGER?',
      prompt: 'Tap the rod that is **longer**.',
      promptAudio: 'Tap the rod that is longer.',
      promptNumeral: '',
      widgets: [
        {
          id: 'ruler',
          type: 'ruler',
          config: {
            mode: 'informal-compare',
            band: 'A',
            compare: 'longer',
            zones: [
              { id: 'left', label: 'Rod A', units: left },
              { id: 'right', label: 'Rod B', units: right },
            ],
          },
        },
      ],
      inputs: [],
      evaluate(values) {
        return (values.ruler || {}).selected === correctId;
      },
      hint: {
        text: 'Count the **unit blocks** on each rod. Which has more?',
      },
      solution: {
        text: `**Rod ${correctId === 'left' ? 'A' : 'B'}** is longer (${Math.max(left, right)} units).`,
        show: { ruler: { selected: correctId } },
      },
      points: 10,
      _correctId: correctId,
    };
  }

  function generateCompareWeight() {
    const left = randomInt(1, 3);
    let right = randomInt(2, 6);
    while (right === left) right = randomInt(2, 6);
    const correctId = left > right ? 'left' : 'right';
    return {
      descriptor: 'AC9MFM01',
      context: 'balance-scale-compare-heavier',
      category: 'measurement',
      kind: 'measure-compare',
      title: 'WHICH IS HEAVIER?',
      prompt: 'Tap the side of the scale that is **heavier**.',
      promptAudio: 'Tap the side of the scale that is heavier.',
      promptNumeral: '',
      widgets: [
        {
          id: 'scale',
          type: 'balance-scale',
          config: {
            mode: 'compare',
            band: 'A',
            compare: 'heavier',
            zones: [
              { id: 'left', label: 'Left pan', mass: left },
              { id: 'right', label: 'Right pan', mass: right },
            ],
          },
        },
      ],
      inputs: [],
      evaluate(values) {
        return (values.scale || {}).selected === correctId;
      },
      hint: {
        text: 'Count the **blocks** on each pan. More blocks means heavier.',
      },
      solution: {
        text: `The **${correctId === 'left' ? 'left' : 'right'} pan** is heavier (${Math.max(left, right)} blocks).`,
        show: { scale: { selected: correctId } },
      },
      points: 10,
      _correctId: correctId,
    };
  }

  function generateCompareCapacity() {
    const left = randomInt(2, 4) / 10;
    let right = randomInt(5, 9) / 10;
    while (Math.abs(right - left) < 0.15) right = randomInt(5, 9) / 10;
    const correctId = left > right ? 'left' : 'right';
    return {
      descriptor: 'AC9MFM01',
      context: 'capacity-jug-compare-more',
      category: 'measurement',
      kind: 'measure-compare',
      title: 'WHICH HOLDS MORE?',
      prompt: 'Tap the jug that holds **more**.',
      promptAudio: 'Tap the jug that holds more.',
      promptNumeral: '',
      widgets: [
        {
          id: 'jug',
          type: 'capacity-jug',
          config: {
            mode: 'compare',
            band: 'A',
            compare: 'more',
            zones: [
              { id: 'left', label: 'Jug A', level: left },
              { id: 'right', label: 'Jug B', level: right },
            ],
          },
        },
      ],
      inputs: [],
      evaluate(values) {
        return (values.jug || {}).selected === correctId;
      },
      hint: {
        text: 'Look at the **water level** in each jug. Which is higher?',
      },
      solution: {
        text: `**Jug ${correctId === 'left' ? 'A' : 'B'}** holds more.`,
        show: { jug: { selected: correctId } },
      },
      points: 10,
      _correctId: correctId,
    };
  }

  function generatePositionalRover() {
    const anchor = { col: 'B', row: 2, icon: '🛰️', label: 'Satellite' };
    const variants = [
      {
        context: 'alpha-grid-positional-in-front',
        relation: 'in front of',
        promptAudio: 'in front of',
        target: { col: 'B', row: 3 },
        accept: (g) => g.col === 'B' && g.row === 3,
        hint: '**In front** means one square **above** the satellite (toward the top).',
        solution: 'Place the rover at **B3** — in front of the satellite.',
      },
      {
        context: 'alpha-grid-positional-behind',
        relation: 'behind',
        promptAudio: 'behind',
        target: { col: 'B', row: 1 },
        accept: (g) => g.col === 'B' && g.row === 1,
        hint: '**Behind** means one square **below** the satellite.',
        solution: 'Place the rover at **B1** — behind the satellite.',
      },
      {
        context: 'alpha-grid-positional-next-to',
        relation: 'next to',
        promptAudio: 'next to',
        target: null,
        accept: (g) => g.row === 2 && (g.col === 'A' || g.col === 'C'),
        hint: '**Next to** means in the square **beside** the satellite (left or right).',
        solution: 'Place the rover at **A2** or **C2** — next to the satellite.',
      },
    ];
    const pick = variants[randomInt(0, variants.length - 1)];
    return {
      descriptor: 'AC9MFSP02',
      context: pick.context,
      category: 'space',
      kind: 'positional',
      title: 'MOVE THE ROVER',
      prompt: `Tap where the rover should go — **${pick.relation}** the satellite.`,
      promptAudio: `Tap where the rover should go ${pick.promptAudio} the satellite.`,
      promptNumeral: '',
      widgets: [
        {
          id: 'map',
          type: 'coordinate-plotter',
          config: {
            mode: 'alpha-grid',
            band: 'A',
            cols: ['A', 'B', 'C'],
            rows: [3, 2, 1],
            positional: true,
            anchor,
            roverIcon: '🚀',
          },
        },
      ],
      inputs: [],
      evaluate(values) {
        const g = values.map || {};
        return pick.accept(g);
      },
      hint: {
        text: pick.hint,
      },
      solution: {
        text: pick.solution,
        show: pick.target
          ? { map: { col: pick.target.col, row: pick.target.row, cell: `${pick.target.col}${pick.target.row}` } }
          : { map: { col: 'C', row: 2, cell: 'C2' } },
      },
      points: 10,
      _target: pick.target,
    };
  }

  function generateShapeHangars() {
    const columns = [
      { id: 'circle', label: 'Circles', shape: 'circle', color: 'green' },
      { id: 'square', label: 'Squares', shape: 'square', color: 'blue' },
      { id: 'triangle', label: 'Triangles', shape: 'triangle', color: 'yellow' },
    ];
    const cards = [];
    const colors = ['green', 'blue', 'yellow'];
    columns.forEach((col, ci) => {
      for (let i = 0; i < 2; i++) {
        cards.push({
          id: `${col.id}-${i}`,
          category: col.id,
          shape: col.shape,
          color: colors[(ci + i) % colors.length],
        });
      }
    });
    const solutionZones = {};
    columns.forEach((col) => {
      solutionZones[col.id] = cards.filter((c) => c.category === col.id).map((c) => c.id);
    });
    return {
      descriptor: 'AC9MFSP01',
      context: 'shape-hangars-sort-shapes',
      category: 'space',
      kind: 'shape-sort',
      title: 'SORT THE SHAPES',
      prompt: 'Drag each shape into the **matching hangar**.',
      promptAudio: 'Drag each shape into the matching hangar.',
      promptNumeral: '',
      widgets: [
        {
          id: 'sort',
          type: 'sorting-table',
          config: {
            mode: 'shape-hangars',
            band: 'A',
            columns,
            cards,
            columnHint: 'Circle · Square · Triangle hangars',
            trayLabel: 'Shapes to sort',
            shuffle: true,
          },
        },
      ],
      inputs: [],
      evaluate(values) {
        const v = values.sort || {};
        const zones = v.zones || {};
        if ((v.filled || 0) !== cards.length) return false;
        return cards.every((c) => (zones[c.category] || []).includes(c.id));
      },
      hint: {
        text: 'Match the **shape** on each card to the hangar label — circles, squares, or triangles.',
      },
      solution: {
        text: 'Circles in the circle hangar, squares in the square hangar, triangles in the triangle hangar.',
        show: { sort: { zones: solutionZones } },
      },
      points: 10,
      _totalCards: cards.length,
      _solutionZones: solutionZones,
    };
  }

  function generatePictureGraphSort() {
    const surveys = [
      {
        topic: 'space food',
        cards: [
          { id: 'nova', emoji: '🧑‍🚀', label: 'Nova · Yes', category: 'yes' },
          { id: 'leo', emoji: '👨‍🚀', label: 'Leo · No', category: 'no' },
          { id: 'mira', emoji: '👩‍🚀', label: 'Mira · Yes', category: 'yes' },
          { id: 'jax', emoji: '🧑‍🚀', label: 'Jax · No', category: 'no' },
        ],
      },
      {
        topic: 'moon rocks',
        cards: [
          { id: 'aria', emoji: '👩‍🚀', label: 'Aria · Yes', category: 'yes' },
          { id: 'finn', emoji: '👨‍🚀', label: 'Finn · Yes', category: 'yes' },
          { id: 'zoe', emoji: '👩‍🚀', label: 'Zoe · No', category: 'no' },
          { id: 'kai', emoji: '🧑‍🚀', label: 'Kai · No', category: 'no' },
        ],
      },
      {
        topic: 'stargazing',
        cards: [
          { id: 'luna', emoji: '👩‍🚀', label: 'Luna · Yes', category: 'yes' },
          { id: 'orbit', emoji: '🧑‍🚀', label: 'Orbit · Yes', category: 'yes' },
          { id: 'pulse', emoji: '👨‍🚀', label: 'Pulse · Yes', category: 'yes' },
          { id: 'dash', emoji: '🧑‍🚀', label: 'Dash · No', category: 'no' },
        ],
      },
    ];
    const pick = surveys[randomInt(0, surveys.length - 1)];
    const columns = [
      { id: 'yes', label: 'Yes', emoji: '👍' },
      { id: 'no', label: 'No', emoji: '👎' },
    ];
    const solutionZones = { yes: [], no: [] };
    pick.cards.forEach((c) => {
      solutionZones[c.category].push(c.id);
    });
    return {
      descriptor: 'AC9MFST01',
      context: 'picture-graph-crew-yes-no',
      category: 'statistics',
      kind: 'picture-sort',
      title: 'SORT THE ANSWERS',
      prompt: `Do you like **${pick.topic}**? Sort each crew member into **Yes** or **No**.`,
      promptAudio: `Do you like ${pick.topic}? Sort each crew member into Yes or No.`,
      promptNumeral: '',
      widgets: [
        {
          id: 'sort',
          type: 'sorting-table',
          config: {
            mode: 'picture-graph',
            band: 'A',
            columns,
            cards: pick.cards,
            columnHint: 'Do you like ' + pick.topic + '?',
            trayLabel: 'Crew answers',
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
        text: 'Read each card. Put **Yes** answers in the Yes column and **No** answers in the No column.',
      },
      solution: {
        text: 'Sort each crew member by whether they said **yes** or **no**.',
        show: { sort: { zones: solutionZones } },
      },
      points: 10,
      _totalCards: pick.cards.length,
      _solutionZones: solutionZones,
    };
  }

  const generators = {
    number: [
      generateCountDocking,
      generateSubitiseFlash,
      generateCompareGroups,
      generateShareFair,
      generateFillTenFrame,
      generateMakeTen,
    ],
    patterns: [generateMissionDayOrder, generateContinuePattern],
    measuring: [generateCompareLength, generateCompareWeight, generateCompareCapacity],
    space: [generatePositionalRover, generateShapeHangars],
    statistics: [generatePictureGraphSort],
  };

  function hasAttemptableState(values) {
    const q = state.currentQuestion;
    if (values.counters) {
      const c = values.counters;
      if (c.mode === 'compare-zones' || q?.kind === 'compare') {
        return c.selected != null;
      }
      if (c.mode === 'make-equal-groups' || q?.kind === 'share') {
        const need = q?._perRover != null ? q._perRover * 2 : 8;
        return (c.placed || 0) === need;
      }
      if ((c.bay || 0) > 0) return true;
    }
    if (values.answer && values.answer.number != null) return true;
    if (values.frame) {
      const f = values.frame;
      if (f.mode === 'show-me' || q?.kind === 'subitise') return false;
      if (q?.kind === 'fill-frame') {
        const start = q._initial != null ? q._initial : 0;
        return (f.filled || 0) > start;
      }
      if ((f.filled || 0) > 0) return true;
    }
    if (values.sort) {
      const s = values.sort;
      if (q?.kind === 'sequence') return (s.filled || 0) === (q._correctOrder?.length || 0);
      if (q?.kind === 'shape-sort' || q?.kind === 'picture-sort') {
        return (s.filled || 0) === (q._totalCards || 0);
      }
      return (s.filled || 0) > 0;
    }
    if (values.blocks) {
      const b = values.blocks;
      if (q?.kind === 'continue-pattern') {
        return (b.filled || 0) === (q._blankCount || 2);
      }
      return (b.filled || 0) > 0;
    }
    if (q?.kind === 'measure-compare') {
      const m = values.ruler || values.scale || values.jug;
      return m?.selected != null;
    }
    if (q?.kind === 'positional') {
      const g = values.map;
      return !!(g?.col && g?.row);
    }
    return false;
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
    if (q.kind === 'subitise' && inst.answer && typeof inst.answer[method] === 'function') {
      inst.answer[method]();
      return;
    }
    if (inst.frame && typeof inst.frame[method] === 'function') {
      inst.frame[method]();
      return;
    }
    if (inst.counters && typeof inst.counters[method] === 'function') {
      inst.counters[method]();
      return;
    }
    if (inst.sort && typeof inst.sort[method] === 'function') {
      inst.sort[method]();
      return;
    }
    if (inst.blocks && typeof inst.blocks[method] === 'function') {
      inst.blocks[method]();
      return;
    }
    if (inst.ruler && typeof inst.ruler[method] === 'function') {
      inst.ruler[method]();
      return;
    }
    if (inst.scale && typeof inst.scale[method] === 'function') {
      inst.scale[method]();
      return;
    }
    if (inst.jug && typeof inst.jug[method] === 'function') {
      inst.jug[method]();
      return;
    }
    if (inst.map && typeof inst.map[method] === 'function') {
      inst.map[method]();
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

    state.attemptsLeft = 2;
    pracAttemptsLeft.textContent = '2 TRIES LEFT';

    const pool = generators[state.activeCategory] || [];
    if (!pool.length) return;

    const rawQuestion = MCS.questionPicker.pickFromPool(pool, state.sessionSeenQuestions);
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
    if (state.currentQuestion && state.currentQuestion.promptAudio && MCS.speech) {
      MCS.speech.speak(state.currentQuestion.promptAudio);
    }
  });

  btnPracResetWidget.addEventListener('click', () => {
    sounds.click();
    if (!state.questionSession) return;
    const inst = state.questionSession.instances;
    const q = state.currentQuestion;
    if (inst.frame && typeof inst.frame.setValue === 'function') {
      const start = q?._initial != null ? q._initial : 0;
      inst.frame.setValue({ filled: start, initial: start });
    }
    if (inst.counters && typeof inst.counters.setValue === 'function') {
      if (q?.kind === 'compare') inst.counters.setValue({ selected: null });
      else if (q?.kind === 'share') inst.counters.setValue({ roverA: 0, roverB: 0 });
      else inst.counters.setValue({ bay: 0 });
    }
    if (inst.answer && typeof inst.answer.setValue === 'function') {
      inst.answer.setValue({ number: null });
    }
    if (inst.sort && typeof inst.sort.setValue === 'function') {
      inst.sort.setValue({ reset: true });
    }
    if (inst.blocks && typeof inst.blocks.setValue === 'function') {
      inst.blocks.setValue({ reset: true });
    }
    if (inst.ruler && typeof inst.ruler.setValue === 'function') {
      inst.ruler.setValue({ selected: null });
    }
    if (inst.scale && typeof inst.scale.setValue === 'function') {
      inst.scale.setValue({ selected: null });
    }
    if (inst.jug && typeof inst.jug.setValue === 'function') {
      inst.jug.setValue({ selected: null });
    }
    if (inst.map && typeof inst.map.setValue === 'function') {
      inst.map.setValue({ col: '', row: 0 });
    }
    if (inst.frame && typeof inst.frame.replayFlash === 'function') {
      inst.frame.replayFlash();
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
          year: 0,
          sounds: sounds,
          saveProfile: saveProfile,
          updateProfileUI: updateProfileUI,
          shelfId: 'badge-shelf-container',
        });
      } else {
        profile.score += q.points || 10;
        profile.level = Math.floor(profile.score / 100) + 1;
        const cat = q.category || 'number';
        profile.scoresByCatF[cat] = (profile.scoresByCatF[cat] || 0) + (q.points || 10);
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
          year: 0,
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
    sounds.click();
    loadQuestion();
  });

  document.querySelectorAll('.selector-tab').forEach((tab) => {
    tab.addEventListener('click', (e) => {
      if (tab.disabled) return;
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
        var cats = profile.scoresByCatF || {};
        var solved = Object.keys(profile.solvedContexts || {}).length;
        return (
          'Prep · ' +
          profile.name +
          '\nScore: ' +
          profile.score +
          ' · Contexts solved: ' +
          solved +
          '\nF strand pts: N' +
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
