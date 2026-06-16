/**
 * Year 2 practice console (Phase 5.11 scaffold + Y2-1–Y2-9 families).
 * Band B chrome, scoresByCatY2 profile.
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

  const profile = {
    name: 'ENGINEER',
    score: 0,
    level: 1,
    streak: 0,
    rank: 'Cadet Navigator',
    badges: [],
    scoresByDescriptor: {},
    solvedContexts: {},
    scoresByCatY2: MCSBandA
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
        MCSBandA.ensureCategoryScores(profile, 'scoresByCatY2');
      } else if (!profile.scoresByCatY2) {
        profile.scoresByCatY2 = {
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

  function formatMoneyCents(cents) {
    if (cents >= 100) {
      const dollars = Math.floor(cents / 100);
      const rem = cents % 100;
      return rem ? `$${dollars}.${String(rem).padStart(2, '0')}` : `$${dollars}`;
    }
    return `${cents}c`;
  }

  function generateMoneyMake() {
    const targets = [25, 35, 45, 55, 65, 75, 85, 95, 100, 120, 150];
    const targetCents = targets[randomInt(0, targets.length - 1)];
    const solutions = {
      25: { '5c': 1, '20c': 1 },
      35: { '5c': 1, '10c': 1, '20c': 1 },
      45: { '5c': 1, '20c': 2 },
      55: { '5c': 1, '50c': 1 },
      65: { '5c': 1, '10c': 1, '50c': 1 },
      75: { '5c': 1, '20c': 1, '50c': 1 },
      85: { '5c': 1, '20c': 2, '50c': 1 },
      95: { '5c': 1, '10c': 2, '20c': 1, '50c': 1 },
      100: { '1d': 1 },
      120: { '20c': 1, '1d': 1 },
      150: { '50c': 1, '1d': 1 },
    };
    const solutionCoins = solutions[targetCents] || { '50c': 1, '20c': 2, '5c': 1 };
    const amountLabel = formatMoneyCents(targetCents);
    return {
      descriptor: 'AC9M2N06',
      context: 'counters-money-make-amount',
      category: 'number',
      kind: 'money-make',
      title: 'MAKE THE AMOUNT',
      prompt: `Drag coins into the payment zone to make **${amountLabel}**.`,
      promptAudio: `Drag coins into the payment zone to make ${amountLabel.replace('$', ' dollars ').replace('c', ' cents')}.`,
      promptNumeral: amountLabel,
      widgets: [
        {
          id: 'coins',
          type: 'counters',
          config: {
            mode: 'money-make',
            band: 'B',
            zoneLabel: `Make ${amountLabel}`,
          },
        },
      ],
      inputs: [],
      evaluate(values) {
        const v = values.coins || {};
        return v.totalCents === targetCents;
      },
      hint: {
        text: `Try a **$1** or **50c** coin first, then add smaller coins until you reach **${amountLabel}**.`,
        highlight: ['coins'],
      },
      solution: {
        text: `One way to make **${amountLabel}** is shown in the payment zone.`,
        show: { coins: Object.assign({ totalCents: targetCents }, solutionCoins) },
      },
      points: 10,
      _targetCents: targetCents,
      _solutionCoins: solutionCoins,
    };
  }

  function generateQuarterClock() {
    const isPast = Math.random() > 0.5;
    let targetHours;
    let targetMinutes;
    let title;
    let prompt;
    let promptAudio;
    let promptNumeral;
    let hintText;
    let solutionText;

    if (isPast) {
      targetHours = randomInt(1, 11);
      targetMinutes = 15;
      title = 'QUARTER PAST';
      prompt = `Set the clock to **quarter past ${targetHours}**.`;
      promptAudio = `Set the clock to quarter past ${targetHours}.`;
      promptNumeral = `${targetHours}:15`;
      hintText =
        'The **short hand** points just past the hour. The **long hand** points to **3** (15 minutes).';
      solutionText = `Quarter past **${targetHours}** is **${targetHours}:15**.`;
    } else {
      const displayHour = randomInt(2, 12);
      targetHours = displayHour === 12 ? 11 : displayHour - 1;
      targetMinutes = 45;
      title = 'QUARTER TO';
      prompt = `Set the clock to **quarter to ${displayHour}**.`;
      promptAudio = `Set the clock to quarter to ${displayHour}.`;
      promptNumeral = `${targetHours}:45`;
      hintText =
        'Quarter to means **15 minutes before** the next hour. The long hand points to **9**.';
      solutionText = `Quarter to **${displayHour}** is **${targetHours}:45**.`;
    }

    return {
      descriptor: 'AC9M2M04',
      context: 'clock-set-quarter-past-to',
      category: 'measurement',
      kind: 'quarter-clock',
      subkind: isPast ? 'past' : 'to',
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
            band: 'B',
            hours: 12,
            minutes: 0,
            draggable: 'both',
            snapMinutes: 15,
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

  function generatePlaceValueBuild() {
    const target = randomInt(102, 987);
    const hundreds = Math.floor(target / 100);
    const tens = Math.floor((target % 100) / 10);
    const ones = target % 10;
    return {
      descriptor: 'AC9M2N01',
      context: 'place-value-blocks-build-three-digit',
      category: 'number',
      kind: 'place-value-build',
      title: 'BUILD THE NUMBER',
      prompt: `Build **${target}** with hundreds, tens, and ones blocks.`,
      promptAudio: `Build ${target} with hundreds, tens, and ones blocks.`,
      promptNumeral: String(target),
      widgets: [
        {
          id: 'blocks',
          type: 'place-value-blocks',
          config: {
            mode: 'build',
            band: 'B',
            interactive: true,
            showHundreds: true,
            max: 999,
          },
        },
      ],
      inputs: [],
      evaluate(values) {
        const b = values.blocks || {};
        return b.hundreds === hundreds && b.tens === tens && b.ones === ones;
      },
      hint: {
        text: `**${target}** has **${hundreds}** hundreds, **${tens}** tens, and **${ones}** ones.`,
        highlight: ['blocks'],
      },
      solution: {
        text: `**${target}** = **${hundreds}H ${tens}T ${ones}O**.`,
        show: { blocks: { hundreds, tens, ones } },
      },
      points: 10,
      _target: target,
      _hundreds: hundreds,
      _tens: tens,
      _ones: ones,
    };
  }

  function generatePlaceValueTrade() {
    const onesStart = randomInt(11, 18);
    const targetTens = 1;
    const targetOnes = onesStart % 10;
    const total = onesStart;
    return {
      descriptor: 'AC9M2N02',
      context: 'place-value-blocks-trade-regroup',
      category: 'number',
      kind: 'place-value-trade',
      title: 'TRADE BLOCKS',
      prompt: `You have **${onesStart} ones**. Trade to make **1 ten and ${targetOnes} ones** (same total).`,
      promptAudio: `You have ${onesStart} ones. Trade to make 1 ten and ${targetOnes} ones.`,
      promptNumeral: String(total),
      widgets: [
        {
          id: 'blocks',
          type: 'place-value-blocks',
          config: {
            mode: 'trade',
            band: 'B',
            showHundreds: false,
            max: 99,
            start: { hundreds: 0, tens: 0, ones: onesStart },
          },
        },
      ],
      inputs: [],
      evaluate(values) {
        const b = values.blocks || {};
        return b.tens === targetTens && b.ones === targetOnes && b.total === total;
      },
      hint: {
        text: 'When you have **10 or more ones**, tap **Trade 10 ones → 1 ten**.',
        highlight: ['blocks'],
      },
      solution: {
        text: `**${onesStart} ones** trades to **1 ten and ${targetOnes} ones** (still **${total}**).`,
        show: { blocks: { hundreds: 0, tens: targetTens, ones: targetOnes } },
      },
      points: 10,
      _start: { hundreds: 0, tens: 0, ones: onesStart },
      _targetTens: targetTens,
      _targetOnes: targetOnes,
      _total: total,
    };
  }

  function generateFractionShade() {
    const tasks = [
      {
        subkind: 'half',
        den: 2,
        num: 1,
        title: 'SHADE HALF',
        prompt: 'Tap parts to shade **half** of the bar.',
        promptAudio: 'Tap parts to shade half of the bar.',
        promptNumeral: '1/2',
        hint: 'Shade **1** of **2** equal parts — that is **half**.',
        solution: '**Half** means **1** of **2** equal parts shaded.',
      },
      {
        subkind: 'quarter',
        den: 4,
        num: 1,
        title: 'SHADE A QUARTER',
        prompt: 'Tap parts to shade **one quarter** of the bar.',
        promptAudio: 'Tap parts to shade one quarter of the bar.',
        promptNumeral: '1/4',
        hint: 'Shade **1** of **4** equal parts — that is **one quarter**.',
        solution: '**One quarter** means **1** of **4** equal parts shaded.',
      },
      {
        subkind: 'two-quarters',
        den: 4,
        num: 2,
        title: 'SHADE TWO QUARTERS',
        prompt: 'Tap parts to shade **two quarters** (half) of the bar.',
        promptAudio: 'Tap parts to shade two quarters of the bar.',
        promptNumeral: '2/4',
        hint: 'Shade **2** of **4** equal parts — the same as **half**.',
        solution: '**Two quarters** means **2** of **4** equal parts shaded.',
      },
      {
        subkind: 'eighth',
        den: 8,
        num: 1,
        title: 'SHADE AN EIGHTH',
        prompt: 'Tap parts to shade **one eighth** of the bar.',
        promptAudio: 'Tap parts to shade one eighth of the bar.',
        promptNumeral: '1/8',
        hint: 'Shade **1** of **8** equal parts — that is **one eighth**.',
        solution: '**One eighth** means **1** of **8** equal parts shaded.',
      },
      {
        subkind: 'two-eighths',
        den: 8,
        num: 2,
        title: 'SHADE TWO EIGHTHS',
        prompt: 'Tap parts to shade **two eighths** of the bar.',
        promptAudio: 'Tap parts to shade two eighths of the bar.',
        promptNumeral: '2/8',
        hint: 'Shade **2** of **8** equal parts.',
        solution: '**Two eighths** means **2** of **8** equal parts shaded.',
      },
    ];
    const pick = tasks[randomInt(0, tasks.length - 1)];
    return {
      descriptor: 'AC9M2N03',
      context: 'fraction-bars-shade-halves-quarters-eighths',
      category: 'number',
      kind: 'fraction-shade',
      subkind: pick.subkind,
      title: pick.title,
      prompt: pick.prompt,
      promptAudio: pick.promptAudio,
      promptNumeral: pick.promptNumeral,
      widgets: [
        {
          id: 'bar',
          type: 'fraction-bars',
          config: {
            mode: 'shade',
            band: 'B',
            denominator: pick.den,
            initialShaded: 0,
            allowToggle: true,
          },
        },
      ],
      inputs: [],
      evaluate(values) {
        const b = values.bar || {};
        return b.num === pick.num && b.den === pick.den;
      },
      hint: {
        text: pick.hint,
        highlight: ['bar'],
      },
      solution: {
        text: pick.solution,
        show: { bar: { num: pick.num, den: pick.den } },
      },
      points: 10,
      _targetNum: pick.num,
      _targetDen: pick.den,
    };
  }

  function generateArrayBuild() {
    const targetRows = randomInt(2, 4);
    const targetCols = randomInt(2, 5);
    const total = targetRows * targetCols;
    return {
      descriptor: 'AC9M2N05',
      context: 'array-builder-set-multiplication',
      category: 'algebra',
      kind: 'array-build',
      title: 'BUILD THE ARRAY',
      prompt: `Build an array with **${targetRows} rows** and **${targetCols} columns**.`,
      promptAudio: `Build an array with ${targetRows} rows and ${targetCols} columns.`,
      promptNumeral: targetRows + '\u00d7' + targetCols,
      widgets: [
        {
          id: 'array',
          type: 'array-builder',
          config: {
            mode: 'build-array',
            band: 'B',
            initialRows: 1,
            initialCols: 1,
            maxRows: 5,
            maxCols: 5,
          },
        },
      ],
      inputs: [],
      evaluate(values) {
        const a = values.array || {};
        return a.rows === targetRows && a.cols === targetCols;
      },
      hint: {
        text: `Use **+** and **\u2212** to set **${targetRows} rows** and **${targetCols} columns**. That makes **${total}** dots.`,
        highlight: ['array'],
      },
      solution: {
        text: `**${targetRows} \u00d7 ${targetCols} = ${total}** dots in the array.`,
        show: { array: { rows: targetRows, cols: targetCols } },
      },
      points: 10,
      _targetRows: targetRows,
      _targetCols: targetCols,
      _initialRows: 1,
      _initialCols: 1,
    };
  }

  function generateMeasureCm() {
    const length = randomInt(4, 10);
    const objects = ['cargo crate', 'fuel rod', 'data stick'];
    const objectLabel = objects[randomInt(0, objects.length - 1)];
    return {
      descriptor: 'AC9M2M01',
      context: 'ruler-measure-object-centimetres',
      category: 'measurement',
      kind: 'measure-cm',
      title: 'MEASURE IN CM',
      prompt: `How many **centimetres** long is the **${objectLabel}**? Tap the matching number on the ruler.`,
      promptAudio: `How many centimetres long is the ${objectLabel}? Tap the matching number on the ruler.`,
      promptNumeral: `${length} cm`,
      widgets: [
        {
          id: 'ruler',
          type: 'ruler',
          config: {
            mode: 'measure-object',
            band: 'B',
            length,
            objectLabel,
            maxCm: Math.max(length + 3, 12),
          },
        },
      ],
      inputs: [],
      evaluate(values) {
        const v = values.ruler || {};
        return v.length === length;
      },
      hint: {
        text: `Start at **0** on the ruler. Count each centimetre mark to the end of the **${objectLabel}**.`,
        highlight: ['ruler'],
      },
      solution: {
        text: `The **${objectLabel}** is **${length} cm** long.`,
        show: { ruler: { length } },
      },
      points: 10,
      _length: length,
      _objectLabel: objectLabel,
    };
  }

  function generateTransformStep() {
    const preImage = [
      { x: 2, y: 2 },
      { x: 2, y: 4 },
      { x: 4, y: 4 },
    ];
    const tasks = [
      {
        subkind: 'flip',
        action: 'flip-vertical',
        mirrorX: 4,
        title: 'FLIP THE SHAPE',
        prompt: 'Tap **Flip ↔** to flip the shape over the **dotted line**.',
        promptAudio: 'Tap Flip to flip the shape over the dotted line.',
        promptNumeral: '↔',
        hint: 'A **flip** makes a mirror image across the dotted line.',
        solution: 'After a **flip**, each point swaps sides of the dotted line.',
        expectedAction: 'flip',
      },
      {
        subkind: 'slide',
        action: 'slide-right',
        slideDx: 2,
        slideDy: 0,
        title: 'SLIDE THE SHAPE',
        prompt: 'Tap **Slide →** to move the shape **2 squares to the right**.',
        promptAudio: 'Tap Slide to move the shape two squares to the right.',
        promptNumeral: '→2',
        hint: 'A **slide** moves every corner the same number of squares in one direction.',
        solution: 'Sliding **2 right** adds **2** to every **x** position.',
        expectedAction: 'slide',
      },
      {
        subkind: 'turn',
        action: 'turn-cw',
        rotateCenter: { x: 3, y: 3 },
        title: 'TURN THE SHAPE',
        prompt: 'Tap **Turn ↻** to rotate the shape **one quarter turn**.',
        promptAudio: 'Tap Turn to rotate the shape one quarter turn.',
        promptNumeral: '↻',
        hint: 'A **quarter turn** rotates the shape **90 degrees** around its corner.',
        solution: 'One **quarter turn** moves each corner around the pivot.',
        expectedAction: 'turn',
      },
    ];
    const pick = tasks[randomInt(0, tasks.length - 1)];
    function computeTarget(action) {
      if (action === 'flip-vertical') {
        return preImage.map((v) => ({ x: 2 * pick.mirrorX - v.x, y: v.y }));
      }
      if (action === 'slide-right') {
        return preImage.map((v) => ({ x: v.x + pick.slideDx, y: v.y + pick.slideDy }));
      }
      const cx = pick.rotateCenter.x;
      const cy = pick.rotateCenter.y;
      return preImage.map((v) => {
        const dx = v.x - cx;
        const dy = v.y - cy;
        return { x: cx + dy, y: cy - dx };
      });
    }
    const targetVertices = computeTarget(pick.action);
    return {
      descriptor: 'AC9M2SP01',
      context: 'transform-board-single-step-flip-slide-turn',
      category: 'space',
      kind: 'transform-step',
      subkind: pick.subkind,
      title: pick.title,
      prompt: pick.prompt,
      promptAudio: pick.promptAudio,
      promptNumeral: pick.promptNumeral,
      widgets: [
        {
          id: 'board',
          type: 'transform-board',
          config: {
            mode: 'single-step',
            band: 'B',
            preImage,
            action: pick.action,
            mirrorX: pick.mirrorX,
            slideDx: pick.slideDx,
            slideDy: pick.slideDy,
            rotateCenter: pick.rotateCenter,
          },
        },
      ],
      inputs: [],
      evaluate(values) {
        const b = values.board || {};
        if (b.action !== pick.expectedAction) return false;
        const verts = b.vertices || [];
        if (verts.length !== targetVertices.length) return false;
        return verts.every((v, i) => v.x === targetVertices[i].x && v.y === targetVertices[i].y);
      },
      hint: {
        text: pick.hint,
        highlight: ['board'],
      },
      solution: {
        text: pick.solution,
        show: { board: { vertices: targetVertices, action: pick.expectedAction } },
      },
      points: 10,
      _expectedAction: pick.expectedAction,
      _targetVertices: targetVertices,
    };
  }

  const Y2_LIKELIHOOD_OPTIONS = [
    { value: '', label: 'Choose…' },
    { value: 'Likely', label: 'Likely' },
    { value: 'Unlikely', label: 'Unlikely' },
    { value: 'Impossible', label: 'Impossible' },
  ];

  function classifyY2Chance(count, total) {
    if (count === 0) return 'Impossible';
    if (count > total / 2) return 'Likely';
    return 'Unlikely';
  }

  function buildLikelihoodInput() {
    return {
      id: 'likelihood',
      type: 'select-input',
      config: {
        label: 'Chance word:',
        width: '220px',
        options: Y2_LIKELIHOOD_OPTIONS,
        ariaLabel: 'Choose likely, unlikely, or impossible',
      },
    };
  }

  function generateMarbleChance() {
    const scenarios = [
      { counts: { red: 5, blue: 1 }, target: 'blue', targetLabel: 'Blue' },
      { counts: { red: 1, blue: 5 }, target: 'blue', targetLabel: 'Blue' },
      { counts: { red: 6 }, target: 'blue', targetLabel: 'Blue' },
      { counts: { red: 4, green: 2 }, target: 'red', targetLabel: 'Red' },
      { counts: { red: 2, green: 4 }, target: 'red', targetLabel: 'Red' },
      { counts: { green: 6 }, target: 'red', targetLabel: 'Red' },
    ];
    const pick = scenarios[randomInt(0, scenarios.length - 1)];
    const total = Object.values(pick.counts).reduce((sum, n) => sum + n, 0);
    const targetCount = pick.counts[pick.target] || 0;
    const answer = classifyY2Chance(targetCount, total);
    const summary = Object.keys(pick.counts)
      .filter((k) => pick.counts[k] > 0)
      .map((k) => `${pick.counts[k]} ${k.charAt(0).toUpperCase() + k.slice(1)}`)
      .join(', ');
    return {
      descriptor: 'AC9M2P01',
      context: 'marble-bag-chance-words-read',
      category: 'probability',
      kind: 'chance-marble',
      subkind: answer.toLowerCase(),
      title: 'MARBLE BAG CHANCE',
      prompt: `Look at the bag. Drawing a **${pick.targetLabel}** marble is:`,
      promptAudio: `Look at the bag. Drawing a ${pick.targetLabel} marble is:`,
      promptNumeral: pick.targetLabel.charAt(0),
      widgets: [
        {
          id: 'bag',
          type: 'marble-bag',
          config: {
            band: 'B',
            mode: 'read',
            counts: pick.counts,
          },
        },
      ],
      inputs: [buildLikelihoodInput()],
      evaluate(values) {
        return values.likelihood === answer;
      },
      hint: {
        text:
          '**Impossible** = none of that colour · **Likely** = more than half · **Unlikely** = some, but less than half.',
        highlight: ['bag', 'likelihood'],
      },
      solution: {
        text: `The bag has **${summary}**. A **${pick.targetLabel}** draw is **${answer.toLowerCase()}**.`,
        show: { bag: {}, likelihood: answer },
      },
      points: 10,
      _answer: answer,
      _targetLabel: pick.targetLabel,
    };
  }

  function generateSpinnerChance() {
    const scenarios = [
      {
        sectors: [
          { label: 'Red', color: '#e53935' },
          { label: 'Red', color: '#e53935' },
          { label: 'Red', color: '#e53935' },
          { label: 'Green', color: '#43a047' },
        ],
        target: 'Green',
        answer: 'Unlikely',
      },
      {
        sectors: [
          { label: 'Red', color: '#e53935' },
          { label: 'Red', color: '#e53935' },
          { label: 'Red', color: '#e53935' },
          { label: 'Green', color: '#43a047' },
        ],
        target: 'Red',
        answer: 'Likely',
      },
      {
        sectors: [
          { label: 'Red', color: '#e53935' },
          { label: 'Red', color: '#e53935' },
          { label: 'Red', color: '#e53935' },
          { label: 'Red', color: '#e53935' },
        ],
        target: 'Green',
        answer: 'Impossible',
      },
      {
        sectors: [
          { label: 'Blue', color: '#1e88e5' },
          { label: 'Blue', color: '#1e88e5' },
          { label: 'Blue', color: '#1e88e5' },
          { label: 'Yellow', color: '#fdd835' },
        ],
        target: 'Yellow',
        answer: 'Unlikely',
      },
      {
        sectors: [
          { label: 'Blue', color: '#1e88e5' },
          { label: 'Yellow', color: '#fdd835' },
          { label: 'Yellow', color: '#fdd835' },
          { label: 'Yellow', color: '#fdd835' },
        ],
        target: 'Blue',
        answer: 'Unlikely',
      },
    ];
    const pick = scenarios[randomInt(0, scenarios.length - 1)];
    const total = pick.sectors.length;
    const targetCount = pick.sectors.filter((s) => s.label === pick.target).length;
    const answer = pick.answer || classifyY2Chance(targetCount, total);
    return {
      descriptor: 'AC9M2P01',
      context: 'spinner-predict-chance-words',
      category: 'probability',
      kind: 'chance-spinner',
      subkind: answer.toLowerCase(),
      title: 'SPINNER CHANCE',
      prompt: `Look at the spinner. Landing on **${pick.target}** is:`,
      promptAudio: `Look at the spinner. Landing on ${pick.target} is:`,
      promptNumeral: pick.target.charAt(0),
      widgets: [
        {
          id: 'spinner',
          type: 'spinner',
          config: {
            band: 'B',
            mode: 'predict',
            sectors: pick.sectors,
          },
        },
      ],
      inputs: [buildLikelihoodInput()],
      evaluate(values) {
        return values.likelihood === answer;
      },
      hint: {
        text: `Count the **${pick.target}** sectors. Compare to the other colours.`,
        highlight: ['spinner', 'likelihood'],
      },
      solution: {
        text: `**${targetCount}** of **${total}** sectors are **${pick.target}** — that is **${answer.toLowerCase()}**.`,
        show: { spinner: {}, likelihood: answer },
      },
      points: 10,
      _answer: answer,
      _target: pick.target,
    };
  }

  function generatePictureGraphCollect() {
    const surveys = [
      {
        topic: 'rockets or rovers',
        columnHint: 'Vehicle vote',
        trayLabel: 'Crew votes',
        columns: [
          { id: 'rocket', label: 'Rockets', emoji: '🚀' },
          { id: 'rover', label: 'Rovers', emoji: '🛞' },
        ],
        cards: [
          { id: 'a1', emoji: '👩‍🚀', label: 'Nova · Rockets', category: 'rocket' },
          { id: 'a2', emoji: '👨‍🚀', label: 'Orion · Rovers', category: 'rover' },
          { id: 'a3', emoji: '👩‍🚀', label: 'Lyra · Rockets', category: 'rocket' },
          { id: 'a4', emoji: '🧑‍🚀', label: 'Jet · Rovers', category: 'rover' },
          { id: 'a5', emoji: '👨‍🚀', label: 'Rex · Rockets', category: 'rocket' },
        ],
      },
      {
        topic: 'comets or moons',
        columnHint: 'Space vote',
        trayLabel: 'Crew votes',
        columns: [
          { id: 'comet', label: 'Comets', emoji: '☄️' },
          { id: 'moon', label: 'Moons', emoji: '🌙' },
        ],
        cards: [
          { id: 'b1', emoji: '👩‍🚀', label: 'Aria · Comets', category: 'comet' },
          { id: 'b2', emoji: '👨‍🚀', label: 'Blaze · Moons', category: 'moon' },
          { id: 'b3', emoji: '🧑‍🚀', label: 'Cruz · Comets', category: 'comet' },
          { id: 'b4', emoji: '👩‍🚀', label: 'Dawn · Moons', category: 'moon' },
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
      descriptor: 'AC9M2ST01',
      context: 'column-graph-picture-collect-one-to-one',
      category: 'statistics',
      kind: 'picture-collect',
      title: 'COLLECT THE DATA',
      prompt: `Sort each crew vote into **${colLabels}** to make a picture graph (one picture = one vote).`,
      promptAudio: `Sort each crew vote into ${colLabels} to make a picture graph.`,
      promptNumeral: '',
      widgets: [
        {
          id: 'graph',
          type: 'column-graph',
          config: {
            mode: 'picture-graph',
            band: 'B',
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
        const v = values.graph || {};
        const zones = v.zones || {};
        if ((v.filled || 0) !== pick.cards.length) return false;
        return pick.cards.every((c) => (zones[c.category] || []).includes(c.id));
      },
      hint: {
        text: `Read each vote card. Drag it into **${colLabels}**.`,
        highlight: ['graph'],
      },
      solution: {
        text: `One picture per vote — **${pick.columnHint.toLowerCase()}**.`,
        show: { graph: { zones: solutionZones } },
      },
      points: 10,
      _totalCards: pick.cards.length,
      _solutionZones: solutionZones,
    };
  }

  function generateColumnGraphBuild() {
    const datasets = [
      {
        topic: 'station snack',
        categories: ['Fruit', 'Crunch', 'Yogurt'],
        raw: [4, 6, 2],
        symbols: [2, 3, 1],
      },
      {
        topic: 'holiday activity',
        categories: ['Swim', 'Hike', 'Read'],
        raw: [6, 8, 4],
        symbols: [3, 4, 2],
      },
      {
        topic: 'pet choice',
        categories: ['Cats', 'Dogs', 'Fish'],
        raw: [2, 6, 4],
        symbols: [1, 3, 2],
      },
    ];
    const pick = datasets[randomInt(0, datasets.length - 1)];
    const scaleKey = 2;
    const tally = pick.categories.map(function (label, idx) {
      return { label: label, count: pick.raw[idx] };
    });
    const maxY = Math.max.apply(null, pick.symbols) + 1;
    return {
      descriptor: 'AC9M2ST02',
      context: 'column-graph-build-many-to-one',
      category: 'statistics',
      kind: 'graph-build',
      subkind: 'many-to-one',
      title: 'BUILD THE GRAPH',
      prompt: `Use the tally for **${pick.topic}**. Each square on the graph stands for **${scaleKey} votes**. Build the column graph.`,
      promptAudio: `Use the tally for ${pick.topic}. Each square stands for ${scaleKey} votes. Build the column graph.`,
      promptNumeral: '×' + scaleKey,
      widgets: [
        {
          id: 'graph',
          type: 'column-graph',
          config: {
            mode: 'build',
            band: 'B',
            categories: pick.categories,
            targetValues: pick.symbols,
            tally: tally,
            scaleKey: scaleKey,
            scaleInterval: 1,
            maxY: maxY,
          },
        },
      ],
      inputs: [],
      evaluate(values) {
        const v = values.graph || {};
        const built = v.values || [];
        if (built.length !== pick.symbols.length) return false;
        return built.every(function (n, idx) {
          return n === pick.symbols[idx];
        });
      },
      hint: {
        text: `Divide each tally count by **${scaleKey}** to get the column height. Example: **${pick.raw[0]}** votes → **${pick.symbols[0]}** squares for **${pick.categories[0]}**.`,
        highlight: ['graph'],
      },
      solution: {
        text: `With scale **1 square = ${scaleKey} votes**, the columns are **${pick.categories.map(function (c, i) {
          return c + ' ' + pick.symbols[i];
        }).join(', ')}**.`,
        show: { graph: { values: pick.symbols } },
      },
      points: 10,
      _targetValues: pick.symbols,
      _scaleKey: scaleKey,
    };
  }

  const generators = {
    number: [generatePlaceValueBuild, generatePlaceValueTrade, generateFractionShade, generateMoneyMake],
    algebra: [generateArrayBuild],
    measurement: [generateQuarterClock, generateMeasureCm],
    space: [generateTransformStep],
    statistics: [generatePictureGraphCollect, generateColumnGraphBuild],
    probability: [generateMarbleChance, generateSpinnerChance],
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
    if (q?.kind === 'quarter-clock' && values.clock) {
      const c = values.clock;
      return c.hours !== q._initialHours || c.minutes !== q._initialMinutes;
    }
    const blocks = values.blocks;
    if (q?.kind === 'place-value-build') {
      return blocks && blocks.total > 0;
    }
    if (q?.kind === 'place-value-trade') {
      const start = q._start || {};
      return (
        blocks &&
        (blocks.tens !== start.tens ||
          blocks.ones !== start.ones ||
          blocks.hundreds !== start.hundreds)
      );
    }
    const bar = values.bar;
    if (q?.kind === 'fraction-shade') {
      return bar && bar.num > 0;
    }
    const array = values.array;
    if (q?.kind === 'array-build') {
      const initR = q._initialRows != null ? q._initialRows : 1;
      const initC = q._initialCols != null ? q._initialCols : 1;
      return array && (array.rows !== initR || array.cols !== initC);
    }
    const coins = values.coins;
    if (q?.kind === 'money-make') {
      return coins && coins.payment > 0;
    }
    const ruler = values.ruler;
    if (q?.kind === 'measure-cm') {
      return ruler && ruler.length != null;
    }
    const board = values.board;
    if (q?.kind === 'transform-step') {
      return board && board.action != null;
    }
    if (q?.kind === 'chance-marble' || q?.kind === 'chance-spinner') {
      return values.likelihood != null && values.likelihood !== '';
    }
    const graph = values.graph;
    if (q?.kind === 'picture-collect') {
      return graph && (graph.filled || 0) === (q._totalCards || 0);
    }
    if (q?.kind === 'graph-build') {
      return graph && graph.values && graph.values.some(function (n) {
        return n > 0;
      });
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
    if (q?.kind === 'quarter-clock' && inst.clock && typeof inst.clock[method] === 'function') {
      inst.clock[method]();
      return;
    }
    if (inst.blocks && typeof inst.blocks[method] === 'function') {
      inst.blocks[method]();
      return;
    }
    if (inst.bar && typeof inst.bar[method] === 'function') {
      inst.bar[method]();
      return;
    }
    if (inst.array && typeof inst.array[method] === 'function') {
      inst.array[method]();
      return;
    }
    if (inst.coins && typeof inst.coins[method] === 'function') {
      inst.coins[method]();
      return;
    }
    if (inst.ruler && typeof inst.ruler[method] === 'function') {
      inst.ruler[method]();
      return;
    }
    if (inst.board && typeof inst.board[method] === 'function') {
      inst.board[method]();
      return;
    }
    if (inst.bag && typeof inst.bag[method] === 'function') {
      inst.bag[method]();
      return;
    }
    if (inst.spinner && typeof inst.spinner[method] === 'function') {
      inst.spinner[method]();
      return;
    }
    if (inst.likelihood && typeof inst.likelihood[method] === 'function') {
      inst.likelihood[method]();
      return;
    }
    if (inst.graph && typeof inst.graph[method] === 'function') {
      inst.graph[method]();
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
    if (codeEl) codeEl.textContent = '[Y2-SCAFFOLD]';

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
      band: 'B',
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
    const q = state.currentQuestion;
    const inst = state.questionSession.instances;
    if (inst.clock && typeof inst.clock.setValue === 'function') {
      inst.clock.setValue({
        hours: q?._initialHours != null ? q._initialHours : 12,
        minutes: q?._initialMinutes != null ? q._initialMinutes : 0,
      });
    }
    if (inst.blocks && typeof inst.blocks.setValue === 'function') {
      inst.blocks.setValue({ reset: true });
    }
    if (inst.bar && typeof inst.bar.setValue === 'function') {
      inst.bar.setValue({ num: 0 });
    }
    if (inst.array && typeof inst.array.setValue === 'function') {
      inst.array.setValue({ reset: true });
    }
    if (inst.coins && typeof inst.coins.setValue === 'function') {
      inst.coins.setValue({ reset: true });
    }
    if (inst.ruler && typeof inst.ruler.setValue === 'function') {
      inst.ruler.setValue({ reset: true });
    }
    if (inst.board && typeof inst.board.setValue === 'function') {
      inst.board.setValue({ reset: true });
    }
    if (inst.likelihood && typeof inst.likelihood.setValue === 'function') {
      inst.likelihood.setValue('');
    }
    if (inst.graph && typeof inst.graph.setValue === 'function') {
      inst.graph.setValue({ reset: true });
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
          category: q.category || 'measurement',
          descriptor: q.descriptor,
          context: q.context,
          year: 2,
          sounds: sounds,
          saveProfile: saveProfile,
          updateProfileUI: updateProfileUI,
          shelfId: 'badge-shelf-container',
        });
      } else {
        profile.score += q.points || 10;
        profile.level = Math.floor(profile.score / 100) + 1;
        const cat = q.category || 'measurement';
        profile.scoresByCatY2[cat] = (profile.scoresByCatY2[cat] || 0) + (q.points || 10);
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
          year: 2,
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
        const cats = profile.scoresByCatY2 || {};
        const solved = Object.keys(profile.solvedContexts || {}).length;
        return (
          'Year 2 · ' +
          profile.name +
          '\nScore: ' +
          profile.score +
          ' · Contexts solved: ' +
          solved +
          '\nY2 strand pts: N' +
          (cats.number || 0) +
          ' A' +
          (cats.algebra || 0) +
          ' M' +
          (cats.measurement || 0) +
          ' S' +
          (cats.space || 0) +
          ' St' +
          (cats.statistics || 0) +
          ' P' +
          (cats.probability || 0)
        );
      },
    });
  }
  loadQuestion();
});
