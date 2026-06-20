/**
 * MCS Question Package API — canonical question runner + legacy adapters.
 * Phase 1: passthrough widget wraps existing Y3–5 / Y6 question shapes unchanged.
 */
(function (MCS) {
  'use strict';

  if (!window.MCS) {
    throw new Error('mcs-question-adapter.js requires mcs-core.js loaded first');
  }

  // ---------------------------------------------------------------------------
  // Legacy passthrough pseudo-widget (doc 02 §4.3)
  // ---------------------------------------------------------------------------
  MCS.register('legacy-passthrough', function legacyPassthrough(container, config) {
    config = config || {};
    container.innerHTML = '';

    if (typeof config.render === 'function') {
      config.render(container);
    } else if (config.html != null) {
      container.innerHTML = config.html;
    }

    var changeCallbacks = [];
    var enabled = true;

    function setContainerEnabled(on) {
      container.querySelectorAll('input, select, textarea, button').forEach(function (el) {
        el.disabled = !on;
      });
    }

    return {
      getValue: function () {
        return {};
      },
      setValue: function () {},
      setEnabled: function (on) {
        enabled = !!on;
        setContainerEnabled(enabled);
      },
      showSolution: function () {},
      flagCorrect: function () {
        container.classList.add('mcs-flag-correct');
        window.setTimeout(function () {
          container.classList.remove('mcs-flag-correct');
        }, 600);
      },
      flagIncorrect: function () {
        container.classList.add('mcs-flag-incorrect');
        window.setTimeout(function () {
          container.classList.remove('mcs-flag-incorrect');
        }, 450);
      },
      onChange: function (callback) {
        if (typeof callback === 'function') changeCallbacks.push(callback);
      },
      destroy: function () {
        container.innerHTML = '';
        changeCallbacks.length = 0;
        MCS._releaseContainer(container);
      },
    };
  });

  // ---------------------------------------------------------------------------
  // Simple time pair input (Phase 2.3 — read-time clock questions)
  // ---------------------------------------------------------------------------
  MCS.register('time-pair', function timePairInput(container, config) {
    config = config || {};
    container.innerHTML = '';
    container.className = (container.className + ' mcs-time-pair-input').trim();

    var row = document.createElement('div');
    row.className = 'mcs-time-input-row';

    var hrInput = document.createElement('input');
    hrInput.type = 'number';
    hrInput.className = 'input-text-terminal';
    hrInput.style.width = '64px';
    hrInput.style.textAlign = 'center';
    hrInput.placeholder = 'hour';
    hrInput.min = '1';
    hrInput.max = '12';
    hrInput.autocomplete = 'off';
    hrInput.setAttribute('aria-label', 'Hour');

    var colon = document.createElement('span');
    colon.className = 'mcs-time-colon';
    colon.textContent = ':';

    var minInput = document.createElement('input');
    minInput.type = 'number';
    minInput.className = 'input-text-terminal';
    minInput.style.width = '64px';
    minInput.style.textAlign = 'center';
    minInput.placeholder = 'min';
    minInput.min = '0';
    minInput.max = '59';
    minInput.autocomplete = 'off';
    minInput.setAttribute('aria-label', 'Minutes');

    row.appendChild(hrInput);
    row.appendChild(colon);
    row.appendChild(minInput);
    container.appendChild(row);

    var changeCallbacks = [];

    function parseHour() {
      var raw = hrInput.value.trim();
      if (raw === '') return null;
      var n = parseInt(raw, 10);
      return isNaN(n) ? null : n;
    }

    function parseMinute() {
      var raw = minInput.value.trim();
      if (raw === '') return null;
      var n = parseInt(raw, 10);
      return isNaN(n) ? null : n;
    }

    function notify() {
      var val = { hours: parseHour(), minutes: parseMinute() };
      changeCallbacks.forEach(function (cb) {
        try {
          cb(val);
        } catch (e) {
          console.warn('time-pair onChange error', e);
        }
      });
    }

    hrInput.addEventListener('input', notify);
    minInput.addEventListener('input', notify);

    return {
      getValue: function getValue() {
        return { hours: parseHour(), minutes: parseMinute() };
      },
      setValue: function setValue(v) {
        if (!v) return;
        hrInput.value = v.hours != null ? String(v.hours) : '';
        minInput.value = v.minutes != null ? String(v.minutes) : '';
      },
      setEnabled: function setEnabled(on) {
        hrInput.disabled = !on;
        minInput.disabled = !on;
      },
      showSolution: function showSolution(v) {
        if (!v) return;
        hrInput.value = v.hours != null ? String(v.hours) : '';
        minInput.value =
          v.minutes != null ? String(v.minutes).padStart(2, '0') : '';
      },
      flagCorrect: function flagCorrect() {
        row.classList.add('mcs-flag-correct');
        window.setTimeout(function () {
          row.classList.remove('mcs-flag-correct');
        }, 600);
      },
      flagIncorrect: function flagIncorrect() {
        row.classList.add('mcs-flag-incorrect');
        window.setTimeout(function () {
          row.classList.remove('mcs-flag-incorrect');
        }, 450);
      },
      onChange: function onChange(callback) {
        if (typeof callback === 'function') changeCallbacks.push(callback);
      },
      destroy: function destroy() {
        container.innerHTML = '';
        changeCallbacks.length = 0;
        MCS._releaseContainer(container);
      },
    };
  });

  // ---------------------------------------------------------------------------
  // Simple numeric answer input (Phase 2.5 — column-graph questions)
  // ---------------------------------------------------------------------------
  MCS.register('number-input', function numberInput(container, config) {
    config = config || {};
    container.innerHTML = '';
    container.className = (container.className + ' mcs-number-input').trim();

    var row = document.createElement('div');
    row.className = 'mcs-number-input-row';

    if (config.label) {
      var label = document.createElement('span');
      label.textContent = config.label;
      row.appendChild(label);
    }

    var input = document.createElement('input');
    input.type = 'number';
    input.className = 'input-text-terminal input-number-small';
    input.style.width = config.width || '90px';
    input.style.textAlign = 'center';
    input.placeholder = config.placeholder != null ? config.placeholder : '?';
    if (config.step != null) input.step = String(config.step);
    input.autocomplete = 'off';
    input.setAttribute('aria-label', config.ariaLabel || 'Answer');
    row.appendChild(input);
    container.appendChild(row);

    var changeCallbacks = [];

    function parseVal() {
      var raw = input.value.trim();
      if (raw === '') return null;
      var n = config.step != null && Number(config.step) < 1
        ? parseFloat(raw)
        : parseInt(raw, 10);
      return isNaN(n) ? null : n;
    }

    function notify() {
      changeCallbacks.forEach(function (cb) {
        try {
          cb(parseVal());
        } catch (e) {
          console.warn('number-input onChange error', e);
        }
      });
    }

    input.addEventListener('input', notify);

    return {
      getValue: function getValue() {
        return parseVal();
      },
      setValue: function setValue(v) {
        input.value = v != null ? String(v) : '';
      },
      setEnabled: function setEnabled(on) {
        input.disabled = !on;
      },
      showSolution: function showSolution(v) {
        input.value = v != null ? String(v) : '';
      },
      flagCorrect: function flagCorrect() {
        row.classList.add('mcs-flag-correct');
        window.setTimeout(function () {
          row.classList.remove('mcs-flag-correct');
        }, 600);
      },
      flagIncorrect: function flagIncorrect() {
        row.classList.add('mcs-flag-incorrect');
        window.setTimeout(function () {
          row.classList.remove('mcs-flag-incorrect');
        }, 450);
      },
      onChange: function onChange(callback) {
        if (typeof callback === 'function') changeCallbacks.push(callback);
      },
      destroy: function destroy() {
        container.innerHTML = '';
        changeCallbacks.length = 0;
        MCS._releaseContainer(container);
      },
    };
  });

  // ---------------------------------------------------------------------------
  // Select dropdown input (Phase 3a — day pickers on line-graph questions)
  // ---------------------------------------------------------------------------
  MCS.register('select-input', function selectInput(container, config) {
    config = config || {};
    container.innerHTML = '';
    container.className = (container.className + ' mcs-select-input').trim();

    var row = document.createElement('div');
    row.className = 'mcs-number-input-row';

    if (config.label) {
      var label = document.createElement('span');
      label.textContent = config.label;
      row.appendChild(label);
    }

    var select = document.createElement('select');
    select.className = 'input-text-terminal';
    select.style.width = config.width || '100px';
    select.setAttribute('aria-label', config.ariaLabel || 'Select answer');

    var options = config.options || [];
    options.forEach(function (opt) {
      var optionEl = document.createElement('option');
      if (typeof opt === 'string') {
        optionEl.value = opt;
        optionEl.textContent = opt;
      } else {
        optionEl.value = opt.value != null ? String(opt.value) : '';
        optionEl.textContent = opt.label != null ? opt.label : optionEl.value;
      }
      select.appendChild(optionEl);
    });
    row.appendChild(select);
    container.appendChild(row);

    var changeCallbacks = [];

    function parseVal() {
      var raw = select.value.trim();
      if (raw === '') return null;
      return raw;
    }

    function notify() {
      changeCallbacks.forEach(function (cb) {
        try {
          cb(parseVal());
        } catch (e) {
          console.warn('select-input onChange error', e);
        }
      });
    }

    select.addEventListener('change', notify);
    select.addEventListener('input', notify);

    return {
      getValue: function getValue() {
        return parseVal();
      },
      setValue: function setValue(v) {
        select.value = v != null ? String(v) : '';
      },
      setEnabled: function setEnabled(on) {
        select.disabled = !on;
      },
      showSolution: function showSolution(v) {
        select.value = v != null ? String(v) : '';
      },
      flagCorrect: function flagCorrect() {
        row.classList.add('mcs-flag-correct');
        window.setTimeout(function () {
          row.classList.remove('mcs-flag-correct');
        }, 600);
      },
      flagIncorrect: function flagIncorrect() {
        row.classList.add('mcs-flag-incorrect');
        window.setTimeout(function () {
          row.classList.remove('mcs-flag-incorrect');
        }, 450);
      },
      onChange: function onChange(callback) {
        if (typeof callback === 'function') changeCallbacks.push(callback);
      },
      destroy: function destroy() {
        container.innerHTML = '';
        changeCallbacks.length = 0;
        MCS._releaseContainer(container);
      },
    };
  });

  // ---------------------------------------------------------------------------
  // Radio button multiple-choice input (full-width option labels)
  // ---------------------------------------------------------------------------
  MCS.register('radio-choice-input', function radioChoiceInput(container, config) {
    config = config || {};
    container.innerHTML = '';
    container.className = (container.className + ' mcs-radio-choice-input').trim();

    if (config.label) {
      var heading = document.createElement('div');
      heading.className = 'mcs-radio-choice-label';
      heading.textContent = config.label;
      container.appendChild(heading);
    }

    var group = document.createElement('div');
    group.className = 'mcs-radio-choice-group';
    group.setAttribute('role', 'radiogroup');
    group.setAttribute('aria-label', config.ariaLabel || 'Select answer');

    var groupName = 'mcs-radio-' + Math.random().toString(36).slice(2, 9);
    var options = config.options || [];
    var radios = [];

    options.forEach(function (opt) {
      var value = typeof opt === 'string' ? opt : (opt.value != null ? String(opt.value) : '');
      var labelText = typeof opt === 'string' ? opt : (opt.label != null ? opt.label : value);

      var label = document.createElement('label');
      label.className = 'mcs-radio-choice-option';

      var radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = groupName;
      radio.value = value;

      var text = document.createElement('span');
      text.textContent = labelText;

      label.appendChild(radio);
      label.appendChild(text);
      group.appendChild(label);
      radios.push(radio);
    });
    container.appendChild(group);

    var changeCallbacks = [];

    function parseVal() {
      var checked = radios.find(function (r) { return r.checked; });
      if (!checked) return null;
      var raw = checked.value.trim();
      return raw === '' ? null : raw;
    }

    function notify() {
      changeCallbacks.forEach(function (cb) {
        try {
          cb(parseVal());
        } catch (e) {
          console.warn('radio-choice-input onChange error', e);
        }
      });
    }

    radios.forEach(function (radio) {
      radio.addEventListener('change', notify);
    });

    function setCheckedValue(v) {
      var target = v != null ? String(v) : '';
      radios.forEach(function (radio) {
        radio.checked = radio.value === target;
      });
    }

    return {
      getValue: function getValue() {
        return parseVal();
      },
      setValue: function setValue(v) {
        setCheckedValue(v);
      },
      setEnabled: function setEnabled(on) {
        radios.forEach(function (radio) {
          radio.disabled = !on;
        });
      },
      showSolution: function showSolution(v) {
        setCheckedValue(v);
      },
      flagCorrect: function flagCorrect() {
        group.classList.add('mcs-flag-correct');
        window.setTimeout(function () {
          group.classList.remove('mcs-flag-correct');
        }, 600);
      },
      flagIncorrect: function flagIncorrect() {
        group.classList.add('mcs-flag-incorrect');
        window.setTimeout(function () {
          group.classList.remove('mcs-flag-incorrect');
        }, 450);
      },
      onChange: function onChange(callback) {
        if (typeof callback === 'function') changeCallbacks.push(callback);
      },
      destroy: function destroy() {
        container.innerHTML = '';
        changeCallbacks.length = 0;
        MCS._releaseContainer(container);
      },
    };
  });

  // ---------------------------------------------------------------------------
  // Simple coordinate pair input (Phase 2.2 — read-point questions)
  // ---------------------------------------------------------------------------
  MCS.register('coordinate-pair', function coordinatePairInput(container, config) {
    config = config || {};
    container.innerHTML = '';
    container.className = (container.className + ' mcs-coordinate-pair-input').trim();

    var row = document.createElement('div');
    row.className = 'mcs-coordinate-input-row';

    var prefix = document.createElement('span');
    prefix.textContent = config.prefix != null ? config.prefix : 'P = (';
    row.appendChild(prefix);

    var xInput = document.createElement('input');
    xInput.type = 'number';
    xInput.className = 'input-text-terminal input-number-small';
    xInput.style.width = '64px';
    xInput.style.textAlign = 'center';
    xInput.placeholder = 'x';
    xInput.autocomplete = 'off';
    xInput.setAttribute('aria-label', 'x coordinate');
    row.appendChild(xInput);

    var comma = document.createElement('span');
    comma.textContent = ',';
    row.appendChild(comma);

    var yInput = document.createElement('input');
    yInput.type = 'number';
    yInput.className = 'input-text-terminal input-number-small';
    yInput.style.width = '64px';
    yInput.style.textAlign = 'center';
    yInput.placeholder = 'y';
    yInput.autocomplete = 'off';
    yInput.setAttribute('aria-label', 'y coordinate');
    row.appendChild(yInput);

    var suffix = document.createElement('span');
    suffix.textContent = config.suffix != null ? config.suffix : ')';
    row.appendChild(suffix);

    container.appendChild(row);

    var changeCallbacks = [];

    function parseVal(input) {
      var raw = input.value.trim();
      if (raw === '') return null;
      var n = parseInt(raw, 10);
      return isNaN(n) ? null : n;
    }

    function notify() {
      var val = { x: parseVal(xInput), y: parseVal(yInput) };
      changeCallbacks.forEach(function (cb) {
        try {
          cb(val);
        } catch (e) {
          console.warn('coordinate-pair onChange error', e);
        }
      });
    }

    xInput.addEventListener('input', notify);
    yInput.addEventListener('input', notify);

    return {
      getValue: function getValue() {
        return { x: parseVal(xInput), y: parseVal(yInput) };
      },
      setValue: function setValue(v) {
        if (!v) return;
        xInput.value = v.x != null ? String(v.x) : '';
        yInput.value = v.y != null ? String(v.y) : '';
      },
      setEnabled: function setEnabled(on) {
        xInput.disabled = !on;
        yInput.disabled = !on;
      },
      showSolution: function showSolution(v) {
        if (!v) return;
        xInput.value = v.x != null ? String(v.x) : '';
        yInput.value = v.y != null ? String(v.y) : '';
      },
      flagCorrect: function flagCorrect() {
        row.classList.add('mcs-flag-correct');
        window.setTimeout(function () {
          row.classList.remove('mcs-flag-correct');
        }, 600);
      },
      flagIncorrect: function flagIncorrect() {
        row.classList.add('mcs-flag-incorrect');
        window.setTimeout(function () {
          row.classList.remove('mcs-flag-incorrect');
        }, 450);
      },
      onChange: function onChange(callback) {
        if (typeof callback === 'function') changeCallbacks.push(callback);
      },
      destroy: function destroy() {
        container.innerHTML = '';
        changeCallbacks.length = 0;
        MCS._releaseContainer(container);
      },
    };
  });

  // ---------------------------------------------------------------------------
  // Legacy adapters
  // ---------------------------------------------------------------------------

  /**
   * Years 3–5 shape: { questionText, renderFunc, validateFunc, hintText, solutionText, ... }
   */
  MCS.adaptLegacyY35 = function adaptLegacyY35(q) {
    if (!q) return q;

    return {
      descriptor: q.descriptor,
      context: q.context,
      category: q.category,
      title: q.questionText || q.title || '',
      prompt: q.questionText || null,
      promptAudio: q.promptAudio || null,
      widgets: [
        {
          id: 'legacy',
          type: 'legacy-passthrough',
          config: { render: q.renderFunc },
        },
      ],
      inputs: [],
      evaluate: function () {
        return q.validateFunc();
      },
      hint: {
        text: q.hintText || '',
        highlight: q.hintHighlight || [],
      },
      solution: {
        text: q.solutionText || '',
        show: q.solutionShow || null,
      },
      points: q.points != null ? q.points : 10,
      _legacy: q,
    };
  };

  /**
   * Year 5 legacy descriptor/context assignment (Phase 3a Slice 7).
   * Runs before adaptLegacyY35 until all generators assign inline.
   */
  function assignY5DescriptorAndContext(q) {
    if (!q) return;

    q.descriptor = q.descriptor || '';
    q.context = q.context || '';
    if (q.descriptor && q.context) return;

    var text = (q.questionText || q.title || '').toLowerCase();

    switch (q.type) {
      case 'decimal-ordering':
        q.descriptor = 'AC9M5N01';
        q.context = Math.random() > 0.5 ? 'decimal-sorting' : 'number-line-plots';
        break;
      case 'factor-multiple':
        q.descriptor = 'AC9M5N02';
        q.context = text.indexOf('list all factors') !== -1 ? 'factor-listing' : 'factor-checking';
        break;
      case 'fraction-ordering':
        q.descriptor = 'AC9M5N03';
        q.context = Math.random() > 0.5 ? 'mixed-numeral-lines' : 'common-denominators';
        break;
      case 'percentage-converter':
        q.descriptor = 'AC9M5N04';
        if (text.indexOf('fraction') !== -1 && text.indexOf('percentage') !== -1) {
          q.context = 'fraction-to-percent';
        } else if (text.indexOf('decimal') !== -1 && text.indexOf('percentage') !== -1) {
          q.context = 'decimal-to-percent';
        } else {
          q.context = 'percent-to-fraction';
        }
        break;
      case 'fraction-addition':
        q.descriptor = 'AC9M5N05';
        q.context = text.indexOf('model') !== -1 || text.indexOf('bar') !== -1 ? 'fraction-bar-addition' : 'fractional-sums';
        break;
      case 'multiplication':
        q.descriptor = 'AC9M5N06';
        q.context = text.indexOf('grid') !== -1 ? 'multiplication-grid' : 'multiplication-algorithm';
        break;
      case 'division-remainder':
        q.descriptor = 'AC9M5N07';
        q.context = text.indexOf('decimal') !== -1 ? 'remainder-decimal-forms' : 'remainder-algorithms';
        break;
      case 'estimation-check':
        q.descriptor = 'AC9M5N08';
        q.context = text.indexOf('budget') !== -1 || text.indexOf('spend') !== -1 ? 'budget-estimation' : 'rounding-checks';
        break;
      case 'word-problem':
        q.descriptor = 'AC9M5N09';
        q.context = text.indexOf('multipl') !== -1 || text.indexOf('times') !== -1 ? 'multiplicative-word-scenarios' : 'additive-word-scenarios';
        break;
      case 'divisibility-patterns':
        q.descriptor = 'AC9M5N10';
        q.context = text.indexOf('loop') !== -1 || text.indexOf('flowchart') !== -1 ? 'flowchart-loops' : 'divisor-checkers';
        break;
      case 'fact-families':
        q.descriptor = 'AC9M5A01';
        q.context = Math.random() > 0.5 ? 'fact-families-multiplication' : 'fact-families-division';
        break;
      case 'find-unknown':
        q.descriptor = 'AC9M5A02';
        q.context = text.indexOf('×') !== -1 || text.indexOf('multiplier') !== -1 ? 'unknown-multiplication' : 'unknown-division';
        break;
      case 'unit-selector':
        q.descriptor = 'AC9M5M01';
        q.context = text.indexOf('compare') !== -1 || text.indexOf('larger') !== -1 ? 'unit-comparison' : 'unit-matching';
        break;
      case 'perimeter-area':
        q.descriptor = 'AC9M5M02';
        q.context = text.indexOf('perimeter') !== -1 ? 'irregular-perimeter' : 'irregular-area';
        break;
      case 'time-conversion':
        q.descriptor = 'AC9M5M03';
        q.context = text.indexOf('24-hour') !== -1 ? 'time-conversion-12-to-24' : 'time-conversion-24-to-12';
        break;
      case 'angle-estimator':
        q.descriptor = 'AC9M5M04';
        q.context = text.indexOf('protractor') !== -1 ? 'angle-protractor-reads' : 'angle-estimation';
        break;
      case 'net-matcher':
        q.descriptor = 'AC9M5SP01';
        q.context = text.indexOf('map') !== -1 || text.indexOf('top view') !== -1 ? '3d-structure-maps' : 'net-folding';
        break;
      case 'reflection':
        q.descriptor = 'AC9M5SP03';
        q.context = 'vector-reflection';
        break;
      case 'data-display':
        q.descriptor = 'AC9M5ST01';
        q.context = text.indexOf('mode') !== -1 ? 'mode-highlight' : 'highest-frequency-charts';
        break;
      case 'investigation-planner':
        q.descriptor = 'AC9M5ST03';
        q.context = Math.random() > 0.5 ? 'investigation-planner' : 'data-display';
        break;
      case 'die-outcomes':
      case 'marble-likelihood':
        q.descriptor = 'AC9M5P01';
        q.context = q.type === 'die-outcomes' ? 'die-outcomes' : 'marble-likelihood';
        break;
      case 'chance-fraction':
        q.descriptor = 'AC9M5P01';
        q.context = 'chance-fraction';
        break;
      case 'chance-experiment':
        q.descriptor = 'AC9M5P02';
        q.context = text.indexOf('predict') !== -1 || text.indexOf('expect') !== -1 ? 'predicted-frequency' : 'chance-experiment';
        break;
      default:
        break;
    }
  }

  /**
   * Year 5 practice legacy shape — wraps renderFunc via adaptLegacyY35 after badge tags.
   */
  MCS.adaptLegacyY5 = function adaptLegacyY5(q) {
    if (!q) return q;
    assignY5DescriptorAndContext(q);
    var adapted = MCS.adaptLegacyY35(q);
    adapted.prompt = q.prompt || null;
    return adapted;
  };

  /**
   * Year 6 shape: { title, html, validate, hint, solution, ... }
   */
  MCS.adaptLegacyY6 = function adaptLegacyY6(q) {
    if (!q) return q;

    var hintText = typeof q.hint === 'string' ? q.hint : q.hint && q.hint.text ? q.hint.text : '';
    var solutionText =
      typeof q.solution === 'string' ? q.solution : q.solution && q.solution.text ? q.solution.text : '';

    return {
      descriptor: q.descriptor,
      context: q.context,
      category: q.category,
      title: q.title || '',
      prompt: q.prompt || null,
      promptAudio: q.promptAudio || null,
      widgets: [
        {
          id: 'legacy',
          type: 'legacy-passthrough',
          config: { html: q.html },
        },
      ],
      inputs: [],
      evaluate: function () {
        return q.validate();
      },
      hint: {
        text: hintText,
        highlight: q.hintHighlight || [],
      },
      solution: {
        text: solutionText,
        show: q.solutionShow || null,
      },
      points: q.points != null ? q.points : 10,
      _legacy: q,
    };
  };

  // ---------------------------------------------------------------------------
  // Question runner (doc 02 §4.2)
  // ---------------------------------------------------------------------------

  function normaliseHint(hint) {
    if (!hint) return { text: '', highlight: [] };
    if (typeof hint === 'string') return { text: hint, highlight: [] };
    return {
      text: hint.text || '',
      highlight: hint.highlight || [],
    };
  }

  function normaliseSolution(solution) {
    if (!solution) return { text: '', show: null };
    if (typeof solution === 'string') return { text: solution, show: null };
    return {
      text: solution.text || '',
      show: solution.show || null,
    };
  }

  function blurWidgetMountFocus(widgetMount) {
    var active = document.activeElement;
    if (active && widgetMount.contains(active) && typeof active.blur === 'function') {
      active.blur();
    }
  }

  function hasUnansweredInputs(inputs, values) {
    return (inputs || []).some(function (spec) {
      if (spec.type !== 'select-input' && spec.type !== 'radio-choice-input') {
        return false;
      }
      var v = values[spec.id];
      return v == null || v === '';
    });
  }

  /**
   * Mount a canonical question package and return a session handle.
   * @param {Object} question — canonical shape (or output of adaptLegacy*)
   * @param {Object} options
   * @param {HTMLElement} options.widgetMount — interactive region
   * @param {HTMLElement} [options.promptMount] — title / prompt element
   * @param {'A'|'B'|'C'} [options.band='C']
   */
  MCS.runQuestion = function runQuestion(question, options) {
    options = options || {};
    var widgetMount = options.widgetMount;
    var promptMount = options.promptMount;
    var band = options.band || 'C';

    if (!question) {
      throw new Error('MCS.runQuestion requires a question package');
    }
    if (!widgetMount) {
      throw new Error('MCS.runQuestion requires options.widgetMount');
    }

    if (promptMount) {
      promptMount.textContent = question.title || '';
    }

    if (
      question.promptAudio &&
      MCS.speech &&
      MCS.speech._autoPlay &&
      (band === 'A' || options.speakPrompt)
    ) {
      MCS.speech.speak(question.promptAudio);
    }

    widgetMount.innerHTML = '';
    void widgetMount.offsetHeight;

    if (question.prompt) {
      var promptEl = document.createElement('p');
      promptEl.className = 'mcs-question-prompt';
      promptEl.innerHTML = String(question.prompt).replace(
        /\*\*(.+?)\*\*/g,
        '<strong>$1</strong>'
      );
      widgetMount.appendChild(promptEl);
    }

    var instances = Object.create(null);
    var widgets = question.widgets || [];

    widgets.forEach(function (spec) {
      var region = document.createElement('div');
      region.className = 'mcs-widget-region';
      region.dataset.widgetId = spec.id;
      region.setAttribute('role', 'group');
      widgetMount.appendChild(region);
      void region.offsetHeight;

      var widgetConfig = Object.assign({}, spec.config || {}, { band: band });
      instances[spec.id] = MCS.create(spec.type, region, widgetConfig);
    });

    (question.inputs || []).forEach(function (spec) {
      var region = document.createElement('div');
      region.className = 'mcs-input-region';
      region.dataset.inputId = spec.id;
      widgetMount.appendChild(region);
      var inputConfig = Object.assign({}, spec.config || {}, { band: band });
      try {
        instances[spec.id] = MCS.create(spec.type, region, inputConfig);
      } catch (err) {
        console.warn('MCS.runQuestion: skipped unregistered input type "' + spec.type + '"');
      }
    });

    var hintNorm = normaliseHint(question.hint);
    var solutionNorm = normaliseSolution(question.solution);
    var lastEval = { incomplete: false, correct: false };

    return {
      question: question,
      instances: instances,

      collect: function collect() {
        var values = Object.create(null);
        Object.keys(instances).forEach(function (id) {
          var inst = instances[id];
          if (inst && typeof inst.getValue === 'function') {
            values[id] = inst.getValue();
          }
        });
        return values;
      },

      evaluate: function evaluate() {
        blurWidgetMountFocus(widgetMount);
        var values = this.collect();
        if (hasUnansweredInputs(question.inputs, values)) {
          lastEval = { incomplete: true, correct: false };
          return false;
        }
        var ok = false;
        if (typeof question.evaluate === 'function') {
          ok = question.evaluate(values);
        }
        lastEval = { incomplete: false, correct: ok };
        return ok;
      },

      getLastEval: function getLastEval() {
        return lastEval;
      },

      applyHintHighlights: function applyHintHighlights() {
        hintNorm.highlight.forEach(function (target) {
          var parts = String(target).split(':');
          var widgetId = parts[0];
          var el = widgetMount.querySelector('[data-widget-id="' + widgetId + '"]');
          if (el) el.classList.add('mcs-hint-highlight');
        });
      },

      clearHintHighlights: function clearHintHighlights() {
        widgetMount.querySelectorAll('.mcs-hint-highlight').forEach(function (el) {
          el.classList.remove('mcs-hint-highlight');
        });
      },

      showHint: function showHint(hintTextEl) {
        if (hintTextEl) {
          if (hintTextEl.tagName === 'INPUT' || hintTextEl.tagName === 'TEXTAREA') {
            hintTextEl.value = hintNorm.text;
          } else if (hintNorm.text.indexOf('<') !== -1) {
            hintTextEl.innerHTML = hintNorm.text;
          } else {
            hintTextEl.textContent = hintNorm.text;
          }
        }
        this.applyHintHighlights();
      },

      showSolution: function showSolution(solutionTextEl) {
        if (solutionNorm.show) {
          Object.keys(solutionNorm.show).forEach(function (id) {
            var inst = instances[id];
            if (inst && typeof inst.showSolution === 'function') {
              inst.showSolution(solutionNorm.show[id]);
            }
          });
        }
        if (solutionTextEl) {
          solutionTextEl.innerHTML = solutionNorm.text;
        }
      },

      setEnabled: function setEnabled(on) {
        Object.keys(instances).forEach(function (id) {
          var inst = instances[id];
          if (inst && typeof inst.setEnabled === 'function') {
            inst.setEnabled(on);
          }
        });
      },

      dispose: function dispose() {
        Object.keys(instances).forEach(function (id) {
          var inst = instances[id];
          if (inst && typeof inst.destroy === 'function') {
            inst.destroy();
          }
        });
        widgetMount.innerHTML = '';
      },
    };
  };
})(window.MCS);
