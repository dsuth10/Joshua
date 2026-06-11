/**
 * MCS MathLive input layer — math-field widget, keyboard profiles, answer checking.
 * Phase 2.6 — requires vendor/mathlive/mathlive.min.js on the page.
 */
(function (MCS) {
  'use strict';

  if (!window.MCS) {
    throw new Error('mcs-input.js requires mcs-core.js loaded first');
  }

  if (typeof MathLive === 'undefined' && !customElements.get('math-field')) {
    console.warn('mcs-input.js: MathLive not loaded — math-field widget unavailable');
    MCS.input = MCS.input || {
      registerKeyboard: function () {},
      check: function () {
        return false;
      },
      isEmpty: function () {
        return true;
      },
    };
    return;
  }

  var MFE = MathLive.MathfieldElement || window.MathfieldElement;
  var mathVirtualKeyboard = window.mathVirtualKeyboard;

  // ---------------------------------------------------------------------------
  // One-time MathLive bootstrap (file:// safe — static fonts via mathlive-fonts.css)
  // ---------------------------------------------------------------------------
  var mathLiveReady = false;

  function initMathLive() {
    if (mathLiveReady) return;
    MFE.fontsDirectory = null;
    MFE.soundsDirectory = null;
    mathLiveReady = true;
  }

  function isTouchDevice() {
    return (
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(pointer: coarse)').matches
    );
  }

  // ---------------------------------------------------------------------------
  // Keyboard profile registry (doc 05 §4)
  // ---------------------------------------------------------------------------
  var keyboardRegistry = Object.create(null);

  function keyRowDigits() {
    return ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
  }

  function navRow() {
    return [
      '[left]',
      '[right]',
      { label: '[backspace]', class: 'action mcs-kb-backspace' },
      '[hide-keyboard]',
    ];
  }

  function makeLayout(label, rows) {
    return {
      label: label,
      layers: [
        {
          style: '.MLK__keycap { min-height: 48px; font-family: var(--mcs-kb-font, "JetBrains Mono", monospace); }',
          rows: rows,
        },
      ],
    };
  }

  function registerDefaultKeyboards() {
    var fracKey = { latex: '\\frac{#@}{#0}', class: 'small mcs-kb-frac' };
    var mixedKey = { latex: '#?\\frac{#?}{#?}', label: 'n a/b', class: 'small mcs-kb-mixed' };
    var minusKey = '-';
    var dotKey = { label: '[.]', variants: [] };

    MCS.input.registerKeyboard('integers', [
      makeLayout('123', [
        keyRowDigits(),
        [minusKey, '[separator]', '[separator]', '[separator]', '[separator]', '[separator]'].concat(
          navRow()
        ),
      ]),
    ]);

    MCS.input.registerKeyboard('fractions-y3', [
      makeLayout('a/b', [
        keyRowDigits(),
        [fracKey, '[separator]', '[separator]', '[separator]'].concat(navRow()),
      ]),
    ]);

    MCS.input.registerKeyboard('fractions-y5', [
      makeLayout('a/b', [
        keyRowDigits(),
        [fracKey, mixedKey, dotKey, minusKey, '[separator]'].concat(navRow()),
      ]),
    ]);
  }

  MCS.input = MCS.input || {};
  MCS.input._lastCheck = null;

  MCS.input.registerKeyboard = function registerKeyboard(name, layoutDef) {
    if (!name) return;
    keyboardRegistry[name] = layoutDef;
  };

  MCS.input.getKeyboard = function getKeyboard(name) {
    return keyboardRegistry[name] || null;
  };

  MCS.input.applyKeyboard = function applyKeyboard(name) {
    if (!mathVirtualKeyboard || !keyboardRegistry[name]) return;
    mathVirtualKeyboard.layouts = keyboardRegistry[name];
  };

  registerDefaultKeyboards();

  // ---------------------------------------------------------------------------
  // LaTeX → numeric parser (Phase 2 fallback evaluator)
  // ---------------------------------------------------------------------------
  function gcd(a, b) {
    a = Math.abs(Math.round(a));
    b = Math.abs(Math.round(b));
    while (b) {
      var t = b;
      b = a % b;
      a = t;
    }
    return a || 1;
  }

  function normalizeLatex(latex) {
    return String(latex || '')
      .replace(/\s+/g, '')
      .replace(/\\left/g, '')
      .replace(/\\right/g, '')
      .replace(/\\cdot/g, '\\times');
  }

  function parseLatexToRational(latex) {
    var raw = String(latex || '').trim();
    if (!raw) {
      return { value: null, num: null, den: null, mathjson: null, empty: true };
    }

    var norm = normalizeLatex(raw);
    var mathjson = null;
    var num = null;
    var den = null;
    var value = null;

    // Mixed numeral: 2\frac{1}{3}
    var mixedMatch = norm.match(/^(-?\d+)\\frac\{(\d+)\}\{(\d+)\}$/);
    if (mixedMatch) {
      var whole = parseInt(mixedMatch[1], 10);
      num = parseInt(mixedMatch[2], 10);
      den = parseInt(mixedMatch[3], 10);
      var sign = whole < 0 ? -1 : 1;
      value = whole + sign * (num / den);
      mathjson = ['Add', whole, ['Divide', num, den]];
      return { value: value, num: num, den: den, whole: whole, mathjson: mathjson, empty: false };
    }

    // Simple fraction: \frac{a}{b}
    var fracMatch = norm.match(/^(-?)\\frac\{(\d+)\}\{(\d+)\}$/);
    if (fracMatch) {
      var neg = fracMatch[1] === '-' ? -1 : 1;
      num = parseInt(fracMatch[2], 10);
      den = parseInt(fracMatch[3], 10);
      value = neg * (num / den);
      mathjson = ['Divide', neg * num, den];
      return { value: value, num: neg * num, den: den, mathjson: mathjson, empty: false };
    }

    // Integer or decimal
    var decMatch = norm.match(/^(-?\d+(?:\.\d+)?)$/);
    if (decMatch) {
      value = parseFloat(decMatch[1]);
      if (!isNaN(value)) {
        return { value: value, num: null, den: null, mathjson: ['Number', value], empty: false };
      }
    }

    // Fallback: try MathLive numeric value if available on caller
    return { value: null, num: null, den: null, mathjson: null, empty: false, unparseable: true };
  }

  function resolveNumericValue(fieldValue) {
    if (!fieldValue) return { value: null, empty: true };
    if (fieldValue.empty) return { value: null, empty: true };
    if (fieldValue.value != null && !isNaN(fieldValue.value)) {
      return {
        value: fieldValue.value,
        num: fieldValue.num,
        den: fieldValue.den,
        empty: false,
      };
    }
    var parsed = parseLatexToRational(fieldValue.latex);
    return parsed;
  }

  MCS.input.isEmpty = function isEmpty(fieldValue) {
    if (!fieldValue) return true;
    if (fieldValue.empty === true) return true;
    var latex = String(fieldValue.latex || '').trim();
    return latex === '' || fieldValue.value == null;
  };

  MCS.input.check = function check(fieldValue, spec) {
    spec = spec || {};
    MCS.input._lastCheck = null;

    if (MCS.input.isEmpty(fieldValue)) {
      MCS.input._lastCheck = { ok: false, reason: 'empty' };
      return false;
    }

    var parsed = resolveNumericValue(fieldValue);
    if (parsed.empty || parsed.value == null || isNaN(parsed.value)) {
      MCS.input._lastCheck = { ok: false, reason: 'unparseable' };
      return false;
    }

    var tolerance = spec.tolerance != null ? spec.tolerance : 1e-9;
    var target = spec.equals;
    var targetValue = null;
    var targetNum = null;
    var targetDen = null;

    if (typeof target === 'number') {
      targetValue = target;
    } else if (target && typeof target === 'object') {
      if (target.num != null && target.den != null) {
        targetNum = target.num;
        targetDen = target.den;
        targetValue = targetNum / targetDen;
      } else if (target.value != null) {
        targetValue = target.value;
      }
    }

    if (targetValue == null || isNaN(targetValue)) {
      MCS.input._lastCheck = { ok: false, reason: 'bad-spec' };
      return false;
    }

    var numericMatch = Math.abs(parsed.value - targetValue) < tolerance;

    if (spec.form === 'exact-latex') {
      var ok =
        normalizeLatex(fieldValue.latex) === normalizeLatex(String(spec.equals || ''));
      MCS.input._lastCheck = { ok: ok, reason: ok ? null : 'exact-latex' };
      return ok;
    }

    if (!numericMatch) {
      MCS.input._lastCheck = { ok: false, reason: 'incorrect' };
      return false;
    }

    if (spec.form === 'simplest') {
      var frac = parseLatexToRational(fieldValue.latex);
      if (frac.num != null && frac.den != null) {
        var g = gcd(frac.num, frac.den);
        var simplest = g === 1;
        if (!simplest) {
          MCS.input._lastCheck = { ok: false, reason: 'wrong-form', numericMatch: true };
          return false;
        }
      }
    }

    MCS.input._lastCheck = { ok: true, reason: null };
    return true;
  };

  // Debug helper (manual console QA — doc 06-math-field §Step 4)
  MCS.input._debugSet = function _debugSet(latex, spec) {
    var val = parseLatexToRational(latex);
    val.latex = latex;
    var result = MCS.input.check(val, spec || { equals: 0.75, form: 'any' });
    console.log('[MCS.input._debugSet]', { latex: latex, parsed: val, spec: spec, result: result, last: MCS.input._lastCheck });
    return result;
  };

  // ---------------------------------------------------------------------------
  // math-field widget (doc 05 §3, widget contract doc 02 §3)
  // ---------------------------------------------------------------------------
  MCS.register('math-field', function mathFieldWidget(container, config) {
    config = config || {};
    initMathLive();

    container.innerHTML = '';
    container.className = (container.className + ' mcs-math-field-wrap').trim();

    var bandId = config.band || 'C';
    var bandTokens = MCS.band(bandId);
    var theme = MCS.theme();
    var keyboardName = config.keyboard || 'fractions-y5';
    var changeCallbacks = [];
    var enabled = true;

    var row = document.createElement('div');
    row.className = 'mcs-math-field-row';

    if (config.label) {
      var labelEl = document.createElement('span');
      labelEl.className = 'mcs-math-field-label';
      labelEl.textContent = config.label;
      row.appendChild(labelEl);
    }

    var fieldWrap = document.createElement('div');
    fieldWrap.className = 'mcs-math-field-inner';
    row.appendChild(fieldWrap);

    var kbDock = document.createElement('div');
    kbDock.className = 'mcs-math-keyboard-dock';
    kbDock.id = 'mcs-kb-dock-' + Math.random().toString(36).slice(2, 9);
    row.appendChild(kbDock);

    var emptyHint = document.createElement('div');
    emptyHint.className = 'mcs-math-empty-hint';
    emptyHint.setAttribute('aria-live', 'polite');
    emptyHint.hidden = true;
    emptyHint.textContent = 'Finish your answer';
    row.appendChild(emptyHint);

    container.appendChild(row);

    var mf = new MFE();
    mf.className = 'mcs-math-field';
    mf.setAttribute('aria-label', config.ariaLabel || 'Math answer');
    mf.style.setProperty('--primary', theme.accent);
    mf.style.setProperty('--caret-color', theme.accent);
    mf.style.setProperty('--selection-background-color', theme.accentSoft);
    mf.style.setProperty('--placeholder-color', theme.gridLine);
    mf.style.setProperty('--contains-size', 'size');
    mf.style.setProperty('--_contains-font-size', Math.max(bandTokens.fontSizeMin, 20) + 'px');
    mf.style.fontFamily = theme.fontMono;
    mf.style.minHeight = Math.max(bandTokens.minTouchTarget, 48) + 'px';

    mf.smartFence = true;
    mf.smartSuperscript = true;
    mf.defaultMode = 'math';
    mf.mathModeSpace = '\\:';
    mf.readOnly = false;

    if (config.placeholder) {
      mf.placeholder = config.placeholder;
    }

    mf.virtualKeyboardContainer = '#' + kbDock.id;
    mf.virtualKeyboardPolicy = isTouchDevice() ? 'onfocus' : 'manual';

    fieldWrap.appendChild(mf);

    var kbToggle = null;
    if (!isTouchDevice()) {
      kbToggle = document.createElement('button');
      kbToggle.type = 'button';
      kbToggle.className = 'mcs-math-kb-toggle btn-terminal';
      kbToggle.textContent = '⌨ Maths keyboard';
      kbToggle.setAttribute('aria-label', 'Show maths keyboard');
      fieldWrap.appendChild(kbToggle);
      kbToggle.addEventListener('click', function () {
        if (!enabled) return;
        MCS.input.applyKeyboard(keyboardName);
        if (mathVirtualKeyboard) {
          mathVirtualKeyboard.show({ animate: true });
        }
        mf.focus();
      });
    }

    function onFocusIn() {
      if (!enabled) return;
      MCS.input.applyKeyboard(keyboardName);
    }

    function onPaste(e) {
      e.preventDefault();
    }

    function buildValue() {
      var latex = mf.getValue('latex') || '';
      var trimmed = latex.trim();
      if (!trimmed) {
        return { latex: '', value: null, mathjson: null, empty: true };
      }

      var mlNumeric = null;
      try {
        mlNumeric = mf.getValue('value');
      } catch (e) {
        mlNumeric = null;
      }

      var parsed = parseLatexToRational(trimmed);
      var value = parsed.value;
      if ((value == null || isNaN(value)) && mlNumeric != null && !isNaN(mlNumeric)) {
        value = mlNumeric;
      }

      return {
        latex: trimmed,
        value: value,
        mathjson: parsed.mathjson,
        num: parsed.num,
        den: parsed.den,
        empty: false,
      };
    }

    function notify() {
      emptyHint.hidden = true;
      var val = buildValue();
      changeCallbacks.forEach(function (cb) {
        try {
          cb(val);
        } catch (e) {
          console.warn('math-field onChange error', e);
        }
      });
    }

    mf.addEventListener('input', notify);
    mf.addEventListener('focusin', onFocusIn);
    mf.addEventListener('paste', onPaste);

    return {
      getValue: function getValue() {
        return buildValue();
      },

      setValue: function setValue(v) {
        if (!v) return;
        if (v.latex != null) {
          mf.setValue(v.latex, { insertionMode: 'replaceAll' });
        }
      },

      setEnabled: function setEnabled(on) {
        enabled = !!on;
        mf.readOnly = !enabled;
        if (kbToggle) kbToggle.disabled = !enabled;
        if (!enabled && mathVirtualKeyboard) {
          mathVirtualKeyboard.hide();
        }
      },

      showSolution: function showSolution(v) {
        if (!v) return;
        if (v.latex != null) {
          mf.setValue(v.latex, { insertionMode: 'replaceAll' });
        }
      },

      flagCorrect: function flagCorrect() {
        fieldWrap.classList.add('mcs-flag-correct');
        emptyHint.hidden = true;
        window.setTimeout(function () {
          fieldWrap.classList.remove('mcs-flag-correct');
        }, 600);
      },

      flagIncorrect: function flagIncorrect(opts) {
        fieldWrap.classList.remove('mcs-wrong-form');
        fieldWrap.classList.add('mcs-flag-incorrect');
        if (opts && opts.wrongForm) {
          fieldWrap.classList.add('mcs-wrong-form');
        }
        window.setTimeout(function () {
          fieldWrap.classList.remove('mcs-flag-incorrect');
        }, 450);
      },

      flagEmpty: function flagEmpty() {
        fieldWrap.classList.add('mcs-flag-incorrect');
        emptyHint.hidden = false;
        window.setTimeout(function () {
          fieldWrap.classList.remove('mcs-flag-incorrect');
        }, 450);
      },

      onChange: function onChange(callback) {
        if (typeof callback === 'function') changeCallbacks.push(callback);
      },

      destroy: function destroy() {
        mf.removeEventListener('input', notify);
        mf.removeEventListener('focusin', onFocusIn);
        mf.removeEventListener('paste', onPaste);
        if (mathVirtualKeyboard) mathVirtualKeyboard.hide();
        container.innerHTML = '';
        changeCallbacks.length = 0;
        MCS._releaseContainer(container);
      },
    };
  });
})(window.MCS);
