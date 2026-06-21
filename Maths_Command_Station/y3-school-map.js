/**
 * Year 3 AC9M3SP02 — familiar top-view school map layouts and question helpers.
 * Shared by year3-practice.js and year3.js assessment.
 */
(function (global) {
  'use strict';

  var DEFAULT_COLS = ['A', 'B', 'C', 'D', 'E'];
  var DEFAULT_ROWS = [5, 4, 3, 2, 1];

  var SCHOOL_MAP_LAYOUTS = [
    {
      id: 'school-yard-basic',
      title: 'Top View School Plan',
      cols: DEFAULT_COLS,
      rows: DEFAULT_ROWS,
      landmarks: [
        { id: 'library', label: 'Library', icon: '📚', col: 'B', row: 4 },
        { id: 'office', label: 'Office', icon: '🏫', col: 'D', row: 4 },
        { id: 'tuckshop', label: 'Tuckshop', icon: '🍎', col: 'A', row: 3 },
        { id: 'garden', label: 'Garden', icon: '🌱', col: 'B', row: 2 },
        { id: 'playground', label: 'Playground', icon: '🛝', col: 'D', row: 2 },
        { id: 'oval', label: 'Oval', icon: '⚽', col: 'C', row: 1 },
        { id: 'gate', label: 'Gate', icon: '🚪', col: 'E', row: 3 },
      ],
      interpretFacts: [
        {
          relation: 'beside',
          ref: 'library',
          answerId: 'office',
          prompt: 'Look at the school map. Which landmark is **beside** the Library?',
        },
        {
          relation: 'between',
          refs: ['library', 'office'],
          answerId: null,
          emptyCell: { col: 'C', row: 4 },
          prompt: 'What is **between** the Library and the Office on the map?',
          options: [
            { value: 'open-space', label: 'Open space (no landmark)' },
            { value: 'garden', label: 'Garden' },
            { value: 'oval', label: 'Oval' },
          ],
          correct: 'open-space',
        },
        {
          relation: 'below',
          ref: 'library',
          answerId: 'garden',
          prompt: 'Which landmark is **below** the Library on the map?',
        },
        {
          relation: 'above',
          ref: 'garden',
          answerId: 'library',
          prompt: 'Which landmark is **above** the Garden on the map?',
        },
        {
          relation: 'left of',
          ref: 'office',
          answerId: 'library',
          prompt: 'Which landmark is to the **left of** the Office?',
        },
        {
          relation: 'right of',
          ref: 'library',
          answerId: 'office',
          prompt: 'Which landmark is to the **right of** the Library?',
        },
        {
          relation: 'near',
          ref: 'tuckshop',
          answerId: 'garden',
          altAnswerIds: ['library'],
          prompt: 'Which landmark is **near** the Tuckshop?',
        },
      ],
      createFacts: [
        {
          relation: 'between',
          refs: ['library', 'office'],
          answerCell: { col: 'C', row: 4 },
          acceptableCells: [{ col: 'C', row: 4 }],
          clue: 'Place the lost lunchbox **between** the Library and the Office.',
          placedMarkerIcon: '🥪',
          placedMarkerLabel: 'Lost Lunchbox',
        },
        {
          relation: 'beside',
          ref: 'garden',
          acceptableCells: [
            { col: 'A', row: 2 },
            { col: 'C', row: 2 },
          ],
          clue: 'Place the water bottle **beside** the Garden.',
          placedMarkerIcon: '💧',
          placedMarkerLabel: 'Water Bottle',
        },
        {
          relation: 'below',
          ref: 'library',
          answerCell: { col: 'B', row: 3 },
          acceptableCells: [{ col: 'B', row: 3 }, { col: 'B', row: 2 }],
          clue: 'Place the lost hat **below** the Library.',
          placedMarkerIcon: '🧢',
          placedMarkerLabel: 'Lost Hat',
        },
        {
          relation: 'above',
          ref: 'playground',
          answerCell: { col: 'D', row: 3 },
          acceptableCells: [{ col: 'D', row: 3 }, { col: 'D', row: 4 }],
          clue: 'Place the sports bag **above** the Playground.',
          placedMarkerIcon: '🎒',
          placedMarkerLabel: 'Sports Bag',
        },
      ],
    },
    {
      id: 'school-buildings',
      title: 'Top View School Plan',
      cols: DEFAULT_COLS,
      rows: DEFAULT_ROWS,
      landmarks: [
        { id: 'library', label: 'Library', icon: '📚', col: 'A', row: 4 },
        { id: 'classroom', label: 'Year 3 Classroom', icon: '🏫', col: 'C', row: 4 },
        { id: 'toilets', label: 'Toilets', icon: '🚻', col: 'E', row: 4 },
        { id: 'firstaid', label: 'First-aid Room', icon: '⛑️', col: 'B', row: 2 },
        { id: 'playground', label: 'Playground', icon: '🛝', col: 'D', row: 2 },
        { id: 'oval', label: 'Oval', icon: '⚽', col: 'C', row: 1 },
      ],
      interpretFacts: [
        {
          relation: 'beside',
          ref: 'classroom',
          answerId: 'library',
          altAnswerIds: ['toilets'],
          prompt: 'Which landmark is **beside** the Year 3 Classroom?',
        },
        {
          relation: 'between',
          refs: ['library', 'toilets'],
          answerId: 'classroom',
          prompt: 'Which landmark is **between** the Library and the Toilets?',
        },
        {
          relation: 'below',
          ref: 'classroom',
          answerId: 'oval',
          prompt: 'Which landmark is **below** the Year 3 Classroom?',
        },
        {
          relation: 'above',
          ref: 'firstaid',
          answerId: 'library',
          altAnswerIds: ['classroom'],
          prompt: 'Which landmark is **above** the First-aid Room?',
        },
      ],
      createFacts: [
        {
          relation: 'between',
          refs: ['library', 'toilets'],
          answerCell: { col: 'C', row: 4 },
          acceptableCells: [{ col: 'C', row: 4 }],
          clue: 'Place the lost reader **between** the Library and the Toilets.',
          placedMarkerIcon: '📖',
          placedMarkerLabel: 'Lost Reader',
        },
        {
          relation: 'beside',
          ref: 'playground',
          acceptableCells: [
            { col: 'C', row: 2 },
            { col: 'E', row: 2 },
          ],
          clue: 'Place the lunch order **beside** the Playground.',
          placedMarkerIcon: '🥪',
          placedMarkerLabel: 'Lunch Order',
        },
      ],
    },
  ];

  var SCHOOL_MAP_ASSESSMENT = {
    title: 'TOP VIEW SCHOOL PLAN',
    cols: DEFAULT_COLS,
    rows: DEFAULT_ROWS,
    landmarks: [
      { id: 'library', label: 'Library', icon: '📚', col: 'B', row: 4 },
      { id: 'office', label: 'Office', icon: '🏫', col: 'D', row: 4 },
      { id: 'tuckshop', label: 'Tuckshop', icon: '🍎', col: 'A', row: 3 },
      { id: 'garden', label: 'Garden', icon: '🌱', col: 'B', row: 2 },
      { id: 'playground', label: 'Playground', icon: '🛝', col: 'D', row: 2 },
      { id: 'oval', label: 'Oval', icon: '⚽', col: 'C', row: 1 },
    ],
    clue: 'The delivery note was left **between** the Office and the Library. Tap the correct place on the school map.',
    placedMarkerIcon: '📝',
    placedMarkerLabel: 'Delivery Note',
    answer: { col: 'C', row: 4 },
  };

  function findLandmark(layout, id) {
    return (layout.landmarks || []).find(function (lm) {
      return lm.id === id;
    });
  }

  function landmarkName(layout, id) {
    var lm = findLandmark(layout, id);
    return lm ? lm.label : id;
  }

  function widgetLandmarks(layout) {
    return (layout.landmarks || []).map(function (lm) {
      return {
        id: lm.id,
        label: lm.label,
        name: lm.label,
        icon: lm.icon,
        col: lm.col,
        row: lm.row,
      };
    });
  }

  function schoolMapWidgetConfig(layout, extra) {
    var base = {
      mode: 'alpha-grid',
      presentation: 'school-map',
      band: 'B',
      cols: layout.cols || DEFAULT_COLS,
      rows: layout.rows || DEFAULT_ROWS,
      hideGridLabels: true,
      mapTitle: layout.title || 'Top View School Plan',
      landmarkLabels: true,
      landmarks: widgetLandmarks(layout),
    };
    if (!extra) return base;
    Object.keys(extra).forEach(function (k) {
      base[k] = extra[k];
    });
    return base;
  }

  function cellsMatch(a, b) {
    return a && b && a.col === b.col && a.row === b.row;
  }

  function cellInList(cell, list) {
    return (list || []).some(function (c) {
      return cellsMatch(c, cell);
    });
  }

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function shuffleArray(arr) {
    var copy = arr.slice();
    for (var i = copy.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
    }
    return copy;
  }

  function buildInterpretOptions(layout, fact) {
    if (fact.options) return fact.options;
    var ids = (layout.landmarks || []).map(function (lm) {
      return lm.id;
    });
    var correctId = fact.answerId;
    var pool = ids.filter(function (id) {
      return id !== correctId;
    });
    var distractors = shuffleArray(pool).slice(0, 3);
    var options = [{ value: correctId, label: landmarkName(layout, correctId) }];
    distractors.forEach(function (id) {
      options.push({ value: id, label: landmarkName(layout, id) });
    });
    return shuffleArray(options);
  }

  function buildInterpretQuestion(layout, fact) {
    var correct = fact.correct || fact.answerId;
    var options = buildInterpretOptions(layout, fact);
    var correctLabel = fact.correct
      ? (options.find(function (o) { return o.value === correct; }) || {}).label
      : landmarkName(layout, correct);

    return {
      descriptor: 'AC9M3SP02',
      context: 'familiar-map-interpret',
      category: 'space',
      title: 'READ THE SCHOOL MAP',
      prompt: fact.prompt,
      widgets: [
        {
          id: 'map',
          type: 'coordinate-plotter',
          config: schoolMapWidgetConfig(layout, { readOnly: true }),
        },
      ],
      inputs: [
        {
          id: 'choice',
          type: 'select-input',
          config: {
            label: 'Your answer:',
            width: '240px',
            options: [{ value: '', label: 'Choose…' }].concat(options),
          },
        },
      ],
      evaluate: function (values) {
        var selected = values.choice;
        if (selected == null || selected === '') return false;
        if (String(selected) === String(correct)) return true;
        if (fact.altAnswerIds && fact.altAnswerIds.indexOf(selected) >= 0) return true;
        return false;
      },
      hint: {
        text: fact.hint || '<p>Use the landmark names on the map. Look for the place described in the question.</p>',
        highlight: ['map', 'choice'],
      },
      solution: {
        text: fact.solution || 'The answer is **' + correctLabel + '**.',
        show: { choice: correct },
      },
      points: 10,
    };
  }

  function buildCreateQuestion(layout, fact) {
    var acceptable = fact.acceptableCells || (fact.answerCell ? [fact.answerCell] : []);
    var primary = fact.answerCell || acceptable[0];
    var solutionText = fact.solution;
    if (!solutionText) {
      if (fact.relation === 'between' && fact.refs && fact.refs.length === 2) {
        solutionText =
          'The ' +
          (fact.placedMarkerLabel || 'object').toLowerCase() +
          ' belongs in the space **between** the ' +
          landmarkName(layout, fact.refs[0]) +
          ' and the ' +
          landmarkName(layout, fact.refs[1]) +
          '.';
      } else if (fact.ref) {
        solutionText =
          'Place the ' +
          (fact.placedMarkerLabel || 'object').toLowerCase() +
          ' **' +
          fact.relation +
          '** the ' +
          landmarkName(layout, fact.ref) +
          '.';
      } else {
        solutionText = 'Tap the correct place on the school map.';
      }
    }

    return {
      descriptor: 'AC9M3SP02',
      context: 'familiar-map-create',
      category: 'space',
      title: 'COMPLETE THE SCHOOL MAP',
      prompt: fact.clue,
      widgets: [
        {
          id: 'map',
          type: 'coordinate-plotter',
          config: schoolMapWidgetConfig(layout, {
            positional: false,
            placedMarkerIcon: fact.placedMarkerIcon || '📍',
            placedMarkerLabel: fact.placedMarkerLabel || 'Object',
          }),
        },
      ],
      inputs: [],
      evaluate: function (values) {
        var g = values.map || {};
        if (!g.col || g.row == null) return false;
        return cellInList({ col: g.col, row: g.row }, acceptable);
      },
      hint: {
        text: fact.hint || '<p>Read the clue carefully. Use landmark names — not grid letters or numbers.</p>',
        highlight: ['map'],
      },
      solution: {
        text: solutionText,
        show: primary
          ? { map: { col: primary.col, row: primary.row, cell: primary.col + primary.row } }
          : {},
      },
      points: 10,
    };
  }

  function generatePracticeQuestion() {
    var layout = pickRandom(SCHOOL_MAP_LAYOUTS);
    var isInterpret = Math.random() > 0.5;
    if (isInterpret) {
      var interpretFacts = layout.interpretFacts || [];
      if (!interpretFacts.length) return generatePracticeQuestion();
      return buildInterpretQuestion(layout, pickRandom(interpretFacts));
    }
    var createFacts = layout.createFacts || [];
    if (!createFacts.length) return generatePracticeQuestion();
    return buildCreateQuestion(layout, pickRandom(createFacts));
  }

  global.Y3SchoolMap = {
    SCHOOL_MAP_LAYOUTS: SCHOOL_MAP_LAYOUTS,
    SCHOOL_MAP_ASSESSMENT: SCHOOL_MAP_ASSESSMENT,
    schoolMapWidgetConfig: schoolMapWidgetConfig,
    widgetLandmarks: widgetLandmarks,
    generatePracticeQuestion: generatePracticeQuestion,
    buildInterpretQuestion: buildInterpretQuestion,
    buildCreateQuestion: buildCreateQuestion,
    cellsMatch: cellsMatch,
    cellInList: cellInList,
  };
})(typeof window !== 'undefined' ? window : globalThis);
