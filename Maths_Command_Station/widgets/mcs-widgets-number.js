/**
 * MCS number widgets — number-line (Phase 2.1), fraction-bars (Phase 2.4),
 * number-track (Phase 3b — sieve-shade).
 */
(function (MCS) {
  'use strict';

  if (typeof JXG !== 'undefined' && MCS.board) {

  function snapToStep(value, step, min, max) {
    var snapped = Math.round(value / step) * step;
    if (snapped < min) snapped = min;
    if (snapped > max) snapped = max;
    var decimals = step < 1 ? Math.ceil(-Math.log10(step)) : 0;
    if (decimals > 0) {
      snapped = parseFloat(snapped.toFixed(decimals));
    }
    return snapped;
  }

  function formatIntegerSpeech(n) {
    if (n < 0) return 'Pin at negative ' + Math.abs(n);
    return 'Pin at ' + n;
  }

  function jxgSizeFromBand(bandId) {
    return Math.max(4, Math.round(MCS.band(bandId).objectSize / 6));
  }

  var PIN_COLORS = [
    'var(--primary)',
    'var(--secondary)',
    'var(--tertiary)',
    '#e65100',
  ];

  function pickWrongStart(correctValue, snapStep, min, max, usedPositions) {
    var candidates = [];
    var steps = Math.round((max - min) / snapStep);
    var ti;
    for (ti = 0; ti <= steps; ti++) {
      var snapped = snapToStep(min + ti * snapStep, snapStep, min, max);
      if (Math.abs(snapped - correctValue) < snapStep / 2) continue;
      if (usedPositions.indexOf(snapped) !== -1) continue;
      if (candidates.indexOf(snapped) === -1) candidates.push(snapped);
    }
    if (candidates.length === 0) {
      var offset = snapToStep(correctValue + snapStep * 2, snapStep, min, max);
      return offset === correctValue
        ? snapToStep(correctValue - snapStep * 2, snapStep, min, max)
        : offset;
    }
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  function createOrderPointsLine(container, config) {
    config = config || {};
    var bandId = config.band || 'C';
    var bandTokens = MCS.band(bandId);
    var min = config.min != null ? config.min : 0;
    var max = config.max != null ? config.max : 2;
    var snapStep = config.snapStep != null ? config.snapStep : 0.25;
    var ticks = config.ticks || { major: 1, minor: 0.25, labels: 'major' };
    var majorStep = ticks.major != null ? ticks.major : 1;
    var minorStep = ticks.minor != null ? ticks.minor : snapStep;
    var labelMode = ticks.labels || 'major';
    var pointSpecs = config.points || [];

    container.innerHTML = '';
    container.classList.add('mcs-number-line', 'mcs-number-line-order');

    var liveRegion = document.createElement('div');
    liveRegion.className = 'mcs-sr-live';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    container.appendChild(liveRegion);

    var boardWrap = document.createElement('div');
    boardWrap.className = 'mcs-number-line-board';
    boardWrap.setAttribute('role', 'application');
    boardWrap.setAttribute(
      'aria-label',
      'Number line. Drag each labelled pin to its correct position.'
    );
    boardWrap.tabIndex = 0;
    container.appendChild(boardWrap);

    var boardWidth = container.clientWidth;
    var ancestor = container.parentElement;
    while (!boardWidth && ancestor) {
      boardWidth = ancestor.clientWidth;
      ancestor = ancestor.parentElement;
    }
    if (!boardWidth) boardWidth = 480;
    boardWrap.style.width = boardWidth + 'px';
    boardWrap.style.minWidth = '280px';
    boardWrap.style.height = '168px';
    void boardWrap.offsetHeight;

    var boardCtx = MCS.board.make(boardWrap, {
      boundingbox: [min - 0.15, 2.2, max + 0.35, -0.6],
      height: '168px',
      keepAspectRatio: false,
    });
    var board = boardCtx.board;
    var theme = boardCtx.theme;

    board.create(
      'segment',
      [
        [min, 0],
        [max, 0],
      ],
      {
        strokeColor: theme.ink,
        strokeWidth: 2,
        fixed: true,
        highlight: false,
        withLabel: false,
      }
    );

    var labelFontSize = bandTokens.fontSizeMin;
    var tickCount = Math.round((max - min) / minorStep);
    var ti;
    for (ti = 0; ti <= tickCount; ti++) {
      var iv = snapToStep(min + ti * minorStep, minorStep, min, max);
      var major =
        Math.abs((iv - min) / majorStep - Math.round((iv - min) / majorStep)) <
        1e-6;
      var tickH = major ? 0.45 : 0.28;
      board.create(
        'segment',
        [
          [iv, -tickH],
          [iv, tickH],
        ],
        {
          strokeColor: theme.gridLine,
          strokeWidth: major ? 1.5 : 1,
          fixed: true,
          highlight: false,
        }
      );

      var showLabel =
        labelMode !== 'none' &&
        (labelMode === 'all' || (labelMode === 'major' && major));

      if (showLabel) {
        MCS.board.label(boardCtx, [iv, -0.85], String(iv), {
          fontSize: labelFontSize,
          anchorY: 'top',
        });
      }
    }

    var pinSize = jxgSizeFromBand(bandId);
    var usedStarts = [];
    var pinEntries = [];
    var changeCallbacks = [];
    var enabled = true;
    var activeTween = null;

    function buildPins() {
      pointSpecs.forEach(function (pt, idx) {
        var color = PIN_COLORS[idx % PIN_COLORS.length];
        var startX = pickWrongStart(pt.value, snapStep, min, max, usedStarts);
        usedStarts.push(startX);

        var pin = MCS.board.point(boardCtx, {
          coords: [startX, 0],
          size: pinSize,
          snapToGrid: true,
          snapSizeX: snapStep,
          snapSizeY: snapStep,
        });
        pin.setAttribute({
          strokeColor: color,
          fillColor: color,
        });

        var stemTop = board.create('point', [startX, 0.15], {
          visible: false,
          fixed: true,
          withLabel: false,
          showInfobox: false,
        });
        var stemBottom = board.create('point', [startX, 1.35], {
          visible: false,
          fixed: true,
          withLabel: false,
          showInfobox: false,
        });
        board.create('segment', [stemTop, stemBottom], {
          strokeColor: color,
          strokeWidth: 2,
          fixed: true,
          highlight: false,
          layer: 1,
        });

        var labelText = MCS.board.label(boardCtx, [startX, 1.55], pt.label || pt.id, {
          fontSize: labelFontSize,
          anchorY: 'bottom',
          cssStyle: 'color:' + color + ';font-weight:700;font-family:' + theme.fontMono + ';',
        });

        function syncPinVisual(x, size) {
          pin.setPosition(JXG.COORDS_BY_USER, [x, 0]);
          stemTop.setPosition(JXG.COORDS_BY_USER, [x, 0.15]);
          stemBottom.setPosition(JXG.COORDS_BY_USER, [x, 1.35]);
          labelText.setPosition(JXG.COORDS_BY_USER, [x, 1.55]);
          pin.setAttribute({ size: size != null ? size : pinSize });
          board.update();
        }

        pin.on('drag', function () {
          if (!enabled) return;
          syncPinVisual(pin.X(), pinSize * 1.1);
        });

        pin.on('down', function () {
          if (!enabled) return;
          MCS.audio.emit('pickup');
        });

        pin.on('up', function () {
          if (!enabled) return;
          var snapped = snapToStep(pin.X(), snapStep, min, max);
          syncPinVisual(snapped, pinSize);
          MCS.audio.emit('snap');
          MCS.audio.emit('drop');
          liveRegion.textContent =
            (pt.label || pt.id) + ' placed at ' + snapped;
          fireChange();
        });

        pinEntries.push({
          id: pt.id,
          pin: pin,
          label: pt.label || pt.id,
          correctValue: pt.value,
          syncPinVisual: syncPinVisual,
        });
      });
      board.update();
    }

    function settleBoard(then) {
      try {
        if (board && board.updateContainerDims) {
          board.updateContainerDims();
        }
        board.update();
      } catch (e) {
        /* renderer settling */
      }
      if (typeof then === 'function') then();
    }

    settleBoard(function () {
      buildPins();
      requestAnimationFrame(function () {
        settleBoard();
      });
    });

    function fireChange() {
      changeCallbacks.forEach(function (cb) {
        try {
          cb(getPlacements());
        } catch (e) {
          console.warn('number-line order-points onChange error', e);
        }
      });
    }

    function getPlacements() {
      var result = Object.create(null);
      pinEntries.forEach(function (entry) {
        result[entry.id] = snapToStep(entry.pin.X(), snapStep, min, max);
      });
      return result;
    }

    function setPinPosition(entry, value, animate, onComplete) {
      var target = snapToStep(value, snapStep, min, max);
      if (!animate || MCS.prefersReducedMotion()) {
        entry.syncPinVisual(target, pinSize);
        if (typeof onComplete === 'function') onComplete();
        return;
      }
      var startX = entry.pin.X();
      MCS.tween({
        duration: 0.55,
        onUpdate: function (t) {
          var x = startX + (target - startX) * t;
          entry.syncPinVisual(x, pinSize);
        },
        onComplete: function () {
          entry.syncPinVisual(target, pinSize);
          if (typeof onComplete === 'function') onComplete();
        },
      });
    }

    function preventTouchScroll(e) {
      if (!enabled) return;
      e.preventDefault();
    }
    boardWrap.addEventListener('touchmove', preventTouchScroll, { passive: false });

    return {
      getValue: getPlacements,

      setValue: function setValue(placements) {
        if (!placements) return;
        pinEntries.forEach(function (entry) {
          if (placements[entry.id] != null) {
            setPinPosition(entry, placements[entry.id], false);
          }
        });
        fireChange();
      },

      setEnabled: function setEnabled(on) {
        enabled = !!on;
        pinEntries.forEach(function (entry) {
          entry.pin.setAttribute({ fixed: !enabled });
        });
        boardWrap.style.pointerEvents = enabled ? '' : 'none';
        boardWrap.setAttribute('aria-disabled', enabled ? 'false' : 'true');
      },

      showSolution: function showSolution(placements) {
        var pending = pinEntries.length;
        pinEntries.forEach(function (entry) {
          var target =
            placements && placements[entry.id] != null
              ? placements[entry.id]
              : entry.correctValue;
          setPinPosition(entry, target, true, function () {
            pending--;
            if (pending === 0) {
              boardWrap.classList.add('mcs-number-line-solution-glow');
              window.setTimeout(function () {
                boardWrap.classList.remove('mcs-number-line-solution-glow');
              }, 900);
              fireChange();
            }
          });
        });
      },

      flagCorrect: function flagCorrect() {
        boardWrap.classList.add('mcs-flag-correct');
        window.setTimeout(function () {
          boardWrap.classList.remove('mcs-flag-correct');
        }, 600);
      },

      flagIncorrect: function flagIncorrect() {
        boardWrap.classList.add('mcs-flag-incorrect');
        window.setTimeout(function () {
          boardWrap.classList.remove('mcs-flag-incorrect');
        }, 450);
      },

      onChange: function onChange(callback) {
        if (typeof callback === 'function') changeCallbacks.push(callback);
      },

      destroy: function destroy() {
        if (activeTween) activeTween.cancel();
        boardWrap.removeEventListener('touchmove', preventTouchScroll);
        MCS.board.destroy(boardCtx);
        container.innerHTML = '';
        changeCallbacks.length = 0;
        MCS._releaseContainer(container);
      },
    };
  }

  MCS.register('number-line', function numberLineFactory(container, config) {
    config = config || {};
    var mode = config.mode || 'place-point';
    if (mode === 'order-points') {
      return createOrderPointsLine(container, config);
    }
    var readOnly = mode === 'read-point';
    var bandId = config.band || 'C';
    var bandTokens = MCS.band(bandId);
    var min = config.min != null ? config.min : -10;
    var max = config.max != null ? config.max : 10;
    var snapStep = config.snapStep != null ? config.snapStep : 1;
    var ticks = config.ticks || { major: 5, minor: 1, labels: 'major' };
    var majorStep = ticks.major != null ? ticks.major : 5;
    var minorStep = ticks.minor != null ? ticks.minor : 1;
    if (config.fractionDenominator && config.showFractionLabels) {
      minorStep = 1 / config.fractionDenominator;
      if (config.snapStep == null) snapStep = minorStep;
    }
    var labelMode = ticks.labels || 'major';
    var markedValue =
      config.markedValue != null
        ? config.markedValue
        : config.markerValue != null
          ? config.markerValue
          : null;
    var initialValue = readOnly
      ? snapToStep(markedValue != null ? markedValue : 0, snapStep, min, max)
      : snapToStep(
          config.initialValue != null ? config.initialValue : 0,
          snapStep,
          min,
          max
        );

    container.innerHTML = '';
    container.classList.add('mcs-number-line');

    var liveRegion = document.createElement('div');
    liveRegion.className = 'mcs-sr-live';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    container.appendChild(liveRegion);

    var boardWrap = document.createElement('div');
    boardWrap.className = 'mcs-number-line-board';
    boardWrap.setAttribute('role', 'application');
    boardWrap.setAttribute(
      'aria-label',
      readOnly
        ? 'Number line with a marked point. Read the mixed numeral shown.'
        : 'Number line. Drag the pin to the target integer.'
    );
    boardWrap.tabIndex = 0;
    container.appendChild(boardWrap);

    var boardWidth = container.clientWidth;
    if (!boardWidth && container.parentElement) {
      boardWidth = container.parentElement.clientWidth;
    }
    if (!boardWidth) boardWidth = 480;
    boardWrap.style.width = boardWidth + 'px';
    boardWrap.style.height = '140px';
    void boardWrap.offsetHeight;

    var boardCtx = MCS.board.make(boardWrap, {
      boundingbox: [-1, 2, max + 1, -2],
    });
    var board = boardCtx.board;
    var theme = boardCtx.theme;

    // Axis line
    board.create(
      'segment',
      [
        [min, 0],
        [max, 0],
      ],
      {
        strokeColor: theme.ink,
        strokeWidth: 2,
        fixed: true,
        highlight: false,
        withLabel: false,
      }
    );

    // Ticks + labels
    var labelFontSize = bandTokens.fontSizeMin;
    var tickSteps = Math.round((max - min) / minorStep);
    for (var ti = 0; ti <= tickSteps; ti++) {
      var iv = min + ti * minorStep;
      if (iv > max + 0.0001) break;
      iv = snapToStep(iv, minorStep, min, max);
      var major = Math.abs((iv - min) % majorStep) < minorStep / 2 || Math.abs(iv - Math.round(iv)) < 0.001;
      var tickH = major ? 0.45 : 0.28;
      board.create(
        'segment',
        [
          [iv, -tickH],
          [iv, tickH],
        ],
        {
          strokeColor: theme.gridLine,
          strokeWidth: major ? 1.5 : 1,
          fixed: true,
          highlight: false,
        }
      );

      var showLabel =
        labelMode !== 'none' &&
        (labelMode === 'all' || (labelMode === 'major' && major));

      if (showLabel) {
        var labelText = String(Math.abs(iv - Math.round(iv)) < 0.001 ? Math.round(iv) : iv);
        MCS.board.label(boardCtx, [iv, -0.85], labelText, {
          fontSize: labelFontSize,
          anchorY: 'top',
        });
      }
    }

    // Pin stem + head
    var pinSize = jxgSizeFromBand(bandId);
    var pin = MCS.board.point(boardCtx, {
      coords: [initialValue, 0],
      size: pinSize,
      snapToGrid: !readOnly,
      snapSizeX: snapStep,
      snapSizeY: snapStep,
      fixed: readOnly,
    });

    board.create(
      'segment',
      [
        [function () {
          return pin.X();
        }, 0.15],
        [function () {
          return pin.X();
        }, 1.35],
      ],
      {
        strokeColor: theme.accent,
        strokeWidth: 2,
        fixed: true,
        highlight: false,
        layer: 1,
      }
    );

    if (readOnly) {
      board.create('text', [initialValue, 1.15, '?'], {
        fontSize: labelFontSize,
        strokeColor: theme.accent,
        fixed: true,
        highlight: false,
        anchorX: 'middle',
        anchorY: 'middle',
        cssStyle: 'font-family:' + theme.fontMono + ';font-weight:700;',
      });
    }

    if (!readOnly) {
      pin.on('drag', function () {
        pin.setPosition(JXG.COORDS_BY_USER, [pin.X(), 0]);
        if (pickupScale) {
          pin.setAttribute({ size: pinSize * 1.1 });
        }
      });
    }

    var currentValue = initialValue;
    var enabled = true;
    var changeCallbacks = [];
    var activeTween = null;
    var pickupScale = false;
    var lastAnnounced = null;

    function preventTouchScroll(e) {
      if (!enabled) return;
      e.preventDefault();
    }

    function announce(value) {
      var msg = formatIntegerSpeech(value);
      if (msg === lastAnnounced) return;
      lastAnnounced = msg;
      liveRegion.textContent = msg;
    }

    function fireChange() {
      changeCallbacks.forEach(function (cb) {
        try {
          cb(currentValue);
        } catch (e) {
          console.warn('number-line onChange error', e);
        }
      });
    }

    function setPinValue(value, animate, onComplete) {
      var target = snapToStep(value, snapStep, min, max);
      if (activeTween) activeTween.cancel();

      if (!animate || MCS.prefersReducedMotion()) {
        pin.setPosition(JXG.COORDS_BY_USER, [target, 0]);
        pin.setAttribute({ size: pinSize });
        currentValue = target;
        board.update();
        announce(target);
        if (typeof onComplete === 'function') onComplete();
        return;
      }

      var startX = pin.X();
      activeTween = MCS.tween({
        duration: 0.8,
        onUpdate: function (t) {
          var x = startX + (target - startX) * t;
          pin.setPosition(JXG.COORDS_BY_USER, [x, 0]);
          board.update();
        },
        onComplete: function () {
          pin.setPosition(JXG.COORDS_BY_USER, [target, 0]);
          pin.setAttribute({ size: pinSize });
          currentValue = target;
          board.update();
          announce(target);
          activeTween = null;
          if (typeof onComplete === 'function') onComplete();
        },
      });
    }

    function onPointerDown() {
      if (!enabled) return;
      pickupScale = true;
      pin.setAttribute({ size: pinSize * 1.1 });
      MCS.audio.emit('pickup');
    }

    function onPointerUp() {
      if (!enabled) return;
      pickupScale = false;
      var snapped = snapToStep(pin.X(), snapStep, min, max);
      pin.setPosition(JXG.COORDS_BY_USER, [snapped, 0]);
      pin.setAttribute({ size: pinSize });
      if (snapped !== currentValue) {
        currentValue = snapped;
        MCS.audio.emit('snap');
        announce(snapped);
        fireChange();
      }
      board.update();
      MCS.audio.emit('drop');
    }

    if (!readOnly) {
      pin.on('down', onPointerDown);
      pin.on('up', onPointerUp);
    }

    // Touch: prevent page scroll during drag
    if (!readOnly) {
      boardWrap.addEventListener('touchmove', preventTouchScroll, { passive: false });
    }

    // Keyboard path
    function onKeyDown(e) {
      if (!enabled || readOnly) return;
      var step = snapStep;
      var handled = false;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        setPinValue(currentValue - step, false);
        fireChange();
        handled = true;
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        setPinValue(currentValue + step, false);
        fireChange();
        handled = true;
      } else if (e.key === 'Enter') {
        fireChange();
        handled = true;
      }
      if (handled) {
        e.preventDefault();
        MCS.audio.emit('snap');
      }
    }
    boardWrap.addEventListener('keydown', onKeyDown);

    if (readOnly) {
      liveRegion.textContent = 'Marked point on the number line. Enter the mixed numeral.';
    } else {
      announce(initialValue);
    }

    // Focus ring styling via focus on board wrap
    boardWrap.addEventListener('focus', function () {
      boardWrap.classList.add('mcs-number-line-focused');
    });
    boardWrap.addEventListener('blur', function () {
      boardWrap.classList.remove('mcs-number-line-focused');
    });

    function spawnParticles() {
      var rect = boardWrap.getBoundingClientRect();
      var frac = (currentValue - min) / (max - min);
      var x = rect.width * frac;
      var y = rect.height * 0.45;
      for (var i = 0; i < 8; i++) {
        var dot = document.createElement('span');
        dot.className = 'mcs-pin-particle';
        dot.style.left = x + 'px';
        dot.style.top = y + 'px';
        dot.style.setProperty('--dx', (Math.random() - 0.5) * 40 + 'px');
        dot.style.setProperty('--dy', (Math.random() - 0.5) * 40 + 'px');
        boardWrap.appendChild(dot);
        (function (el) {
          setTimeout(function () {
            if (el.parentNode) el.parentNode.removeChild(el);
          }, 600);
        })(dot);
      }
    }

    var api = {
      getValue: function getValue() {
        return currentValue;
      },

      setValue: function setValue(n) {
        setPinValue(n, false, fireChange);
      },

      setEnabled: function setEnabled(on) {
        enabled = !!on;
        if (!readOnly) pin.setAttribute({ fixed: !enabled });
        boardWrap.style.pointerEvents = enabled ? '' : 'none';
        boardWrap.setAttribute('aria-disabled', enabled ? 'false' : 'true');
      },

      showSolution: function showSolution(v) {
        var target = readOnly ? initialValue : v;
        setPinValue(target, !readOnly, function () {
          boardWrap.classList.add('mcs-number-line-solution-glow');
          setTimeout(function () {
            boardWrap.classList.remove('mcs-number-line-solution-glow');
          }, 900);
          fireChange();
        });
      },

      flagCorrect: function flagCorrect() {
        boardWrap.classList.add('mcs-flag-correct');
        spawnParticles();
        setTimeout(function () {
          boardWrap.classList.remove('mcs-flag-correct');
        }, 600);
      },

      flagIncorrect: function flagIncorrect() {
        boardWrap.classList.add('mcs-flag-incorrect');
        setTimeout(function () {
          boardWrap.classList.remove('mcs-flag-incorrect');
        }, 450);
      },

      onChange: function onChange(callback) {
        if (typeof callback === 'function') changeCallbacks.push(callback);
      },

      destroy: function destroy() {
        if (activeTween) activeTween.cancel();
        if (!readOnly) boardWrap.removeEventListener('touchmove', preventTouchScroll);
        boardWrap.removeEventListener('keydown', onKeyDown);
        MCS.board.destroy(boardCtx);
        container.innerHTML = '';
        changeCallbacks.length = 0;
        MCS._releaseContainer(container);
      },
    };

    if (window.MCS && window.MCS.debug) {
      api._debugSet = function _debugSet(n) {
        setPinValue(n, false);
      };
    }

    return api;
  });
  }

  // ---------------------------------------------------------------------------
  // fraction-bars (Phase 2.4 — Konva tap-to-shade)
  // ---------------------------------------------------------------------------
  if (typeof Konva !== 'undefined' && MCS.stage) {
    function usableWidth(el) {
      var node = el;
      while (node) {
        if (node.clientWidth > 0) return node.clientWidth;
        node = node.parentElement;
      }
      return 320;
    }

    function formatShadedSpeech(num, den) {
      if (num === 0) return 'No parts shaded';
      if (num === 1) return 'One of ' + den + ' parts shaded';
      return num + ' of ' + den + ' parts shaded';
    }

    MCS.register('fraction-bars', function fractionBarsFactory(container, config) {
      config = config || {};
      var mode = config.mode || 'shade';
      var bandId = config.band || 'B';
      var bandTokens = MCS.band(bandId);
      var den = config.denominator != null ? config.denominator : 4;
      var allowToggle = config.allowToggle !== false;
      var overflow = config.overflow || 'unshade-last';
      var gap = 1;
      var cornerRadius = bandId === 'A' ? 8 : 6;

      container.innerHTML = '';
      container.classList.add('mcs-fraction-bars');

      var liveRegion = MCS.stage.ariaHost(container);
      var boardWrap = document.createElement('div');
      boardWrap.className = 'mcs-fraction-bars-board';
      boardWrap.setAttribute('role', 'application');
      boardWrap.tabIndex = 0;
      container.appendChild(boardWrap);

      var labelEl = document.createElement('div');
      labelEl.className = 'mcs-fraction-bars-label';
      labelEl.setAttribute('aria-hidden', 'true');
      container.appendChild(labelEl);

      var resetBtn = null;
      if (bandId === 'B' || bandId === 'C') {
        resetBtn = document.createElement('button');
        resetBtn.type = 'button';
        resetBtn.className = 'btn-terminal mcs-fraction-bars-reset';
        resetBtn.textContent = 'Clear shading';
        resetBtn.setAttribute('aria-label', 'Clear all shaded parts');
        container.appendChild(resetBtn);
      }

      var theme = MCS.theme(true);
      var shaded = [];
      var i;
      for (i = 0; i < den; i++) shaded.push(false);

      var initial = config.initialShaded != null ? config.initialShaded : 0;
      for (i = 0; i < Math.min(initial, den); i++) shaded[i] = true;

      var enabled = true;
      var changeCallbacks = [];
      var activeTween = null;
      var focusIndex = 0;
      var gestureSegment = null;

      var minSegWidth = 32;
      var barHeight =
        bandId === 'A'
          ? Math.max(56, bandTokens.objectSize)
          : bandId === 'B'
            ? Math.max(40, bandTokens.objectSize)
            : Math.max(28, bandTokens.objectSize);
      var barWidth = Math.min(Math.max(usableWidth(container), den * minSegWidth), 480);
      if (barWidth / den < minSegWidth) barWidth = den * minSegWidth;
      var stageHeight = barHeight + 8;

      var host = document.createElement('div');
      host.className = 'mcs-konva-host';
      host.style.width = barWidth + 'px';
      host.style.height = stageHeight + 'px';
      boardWrap.appendChild(host);

      var stage = new Konva.Stage({
        container: host,
        width: barWidth,
        height: stageHeight,
      });
      var objLayer = new Konva.Layer();
      stage.add(objLayer);

      var barGroup = new Konva.Group({ x: 0, y: 4, name: 'bar-group' });
      objLayer.add(barGroup);

      var segmentNodes = [];
      var hatchGroups = [];

      function countShaded() {
        var n = 0;
        for (var s = 0; s < shaded.length; s++) {
          if (shaded[s]) n++;
        }
        return n;
      }

      function updateAria() {
        var num = countShaded();
        boardWrap.setAttribute(
          'aria-label',
          'Fraction bar with ' + den + ' equal parts. Shade ' + num + ' parts.'
        );
      }

      function updateLabel() {
        var num = countShaded();
        if (bandId === 'A') {
          if (num === 0) {
            labelEl.textContent = 'Tap parts to shade';
          } else if (num === den) {
            labelEl.textContent = 'Whole';
          } else if (den === 2 && num === 1) {
            labelEl.textContent = 'Half';
          } else if (den === 4 && num === 1) {
            labelEl.textContent = 'Quarter';
          } else if (den === 4 && num === 2) {
            labelEl.textContent = 'Half';
          } else {
            labelEl.textContent = num + ' / ' + den;
          }
        } else {
          labelEl.textContent = num + ' / ' + den;
        }
      }

      function announceState() {
        var num = countShaded();
        liveRegion.textContent = formatShadedSpeech(num, den);
        updateLabel();
        updateAria();
      }

      function fireChange() {
        changeCallbacks.forEach(function (cb) {
          try {
            cb({ num: countShaded(), den: den });
          } catch (e) {
            console.warn('fraction-bars onChange error', e);
          }
        });
      }

      function addHatch(group, w, h) {
        var spacing = 7;
        var d = -h;
        while (d < w + h) {
          group.add(
            new Konva.Line({
              points: [d, 0, d + h, h],
              stroke: theme.ink,
              strokeWidth: 1,
              opacity: 0.18,
              listening: false,
            })
          );
          d += spacing;
        }
        group.clipFunc(function (ctx) {
          ctx.rect(0, 0, w, h);
        });
      }

      function syncSegmentVisual(index, animateBounce) {
        var rect = segmentNodes[index];
        var hatch = hatchGroups[index];
        if (!rect) return;
        var isShaded = shaded[index];
        var segW = rect.width();
        var segH = rect.height();

        rect.fill(isShaded ? theme.accent : theme.accentSoft);
        rect.stroke(theme.ink);
        rect.strokeWidth(isShaded ? 1.5 : 1);
        rect.opacity(isShaded ? 1 : 0.55);

        if (hatch) hatch.destroy();
        hatchGroups[index] = null;

        if (isShaded) {
          var hg = new Konva.Group({
            x: rect.x(),
            y: rect.y(),
            listening: false,
          });
          addHatch(hg, segW, segH);
          barGroup.add(hg);
          hatchGroups[index] = hg;
        }

        if (animateBounce && isShaded) {
          var baseY = rect.y();
          rect.to({
            y: baseY - 4,
            duration: 0.12,
            onFinish: function () {
              rect.to({ y: baseY, duration: 0.12 });
            },
          });
        }

        objLayer.batchDraw();
      }

      function syncAllVisuals() {
        for (var idx = 0; idx < den; idx++) syncSegmentVisual(idx, false);
        announceState();
      }

      function buildBar(width) {
        barGroup.destroyChildren();
        segmentNodes.length = 0;
        hatchGroups.length = 0;

        var segWidth = (width - gap * (den - 1)) / den;
        var hitPad = Math.max(0, (bandTokens.minTouchTarget - segWidth) / 2);

        for (var si = 0; si < den; si++) {
          (function (index) {
            var x = index * (segWidth + gap);
            var rect = new Konva.Rect({
              x: x,
              y: 0,
              width: segWidth,
              height: barHeight,
              cornerRadius:
                index === 0
                  ? [cornerRadius, 0, 0, cornerRadius]
                  : index === den - 1
                    ? [0, cornerRadius, cornerRadius, 0]
                    : [0, 0, 0, 0],
              fill: theme.accentSoft,
              stroke: theme.ink,
              strokeWidth: 1,
              hitStrokeWidth: Math.max(hitPad * 2, bandTokens.minTouchTarget / 2),
            });

            rect.on('mousedown touchstart', function (evt) {
              if (!enabled || mode !== 'shade') return;
              if (gestureSegment !== null) return;
              gestureSegment = index;
              evt.cancelBubble = true;
              toggleSegment(index);
            });

            barGroup.add(rect);
            segmentNodes.push(rect);
            hatchGroups.push(null);
          })(si);
        }

        syncAllVisuals();
      }

      buildBar(barWidth);

      function toggleSegment(index) {
        if (!enabled || mode !== 'shade') return;

        var num = countShaded();
        if (shaded[index]) {
          if (!allowToggle) return;
          shaded[index] = false;
        } else {
          if (num >= den && overflow === 'ignore') return;
          if (num >= den && overflow === 'unshade-last') {
            for (var li = den - 1; li >= 0; li--) {
              if (shaded[li]) {
                shaded[li] = false;
                syncSegmentVisual(li, false);
                break;
              }
            }
          }
          shaded[index] = true;
        }

        syncSegmentVisual(index, false);
        MCS.audio.emit('tick');
        announceState();
        fireChange();
      }

      function clearShading() {
        for (var ci = 0; ci < den; ci++) shaded[ci] = false;
        syncAllVisuals();
        fireChange();
      }

      function setShadedCount(targetNum, animate, onComplete) {
        targetNum = Math.max(0, Math.min(den, Math.round(targetNum)));
        if (activeTween) activeTween.cancel();

        if (!animate || MCS.prefersReducedMotion()) {
          for (var fi = 0; fi < den; fi++) shaded[fi] = fi < targetNum;
          syncAllVisuals();
          if (typeof onComplete === 'function') onComplete();
          return;
        }

        activeTween = MCS.tween({
          duration: 0.8,
          onUpdate: function (t) {
            var want = Math.round(t * targetNum);
            for (var wi = 0; wi < den; wi++) shaded[wi] = wi < want;
            for (var vi = 0; vi < den; vi++) syncSegmentVisual(vi, false);
          },
          onComplete: function () {
            for (var si2 = 0; si2 < den; si2++) shaded[si2] = si2 < targetNum;
            syncAllVisuals();
            activeTween = null;
            if (typeof onComplete === 'function') onComplete();
          },
        });
      }

      function onPointerEnd() {
        gestureSegment = null;
      }

      stage.on('mouseup touchend', onPointerEnd);
      stage.on('mouseleave', onPointerEnd);

      if (stage.content) {
        stage.content.addEventListener('touchmove', function (e) {
          e.preventDefault();
        }, { passive: false });
      }

      if (resetBtn) {
        resetBtn.addEventListener('click', function () {
          if (!enabled) return;
          clearShading();
          MCS.audio.emit('tick');
        });
      }

      function onKeyDown(e) {
        if (!enabled || mode !== 'shade') return;
        var handled = false;
        if (e.key === 'Tab') {
          return;
        }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          focusIndex = focusIndex > 0 ? focusIndex - 1 : den - 1;
          handled = true;
        } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          focusIndex = focusIndex < den - 1 ? focusIndex + 1 : 0;
          handled = true;
        } else if (e.key === ' ' || e.key === 'Enter') {
          toggleSegment(focusIndex);
          handled = true;
        }
        if (handled) {
          e.preventDefault();
          boardWrap.classList.add('mcs-fraction-bars-segment-focus');
          segmentNodes[focusIndex].stroke(theme.focusRing);
          segmentNodes[focusIndex].strokeWidth(3);
          objLayer.batchDraw();
          window.setTimeout(function () {
            syncSegmentVisual(focusIndex, false);
          }, 180);
        }
      }

      boardWrap.addEventListener('keydown', onKeyDown);
      boardWrap.addEventListener('focus', function () {
        boardWrap.classList.add('mcs-fraction-bars-focused');
      });
      boardWrap.addEventListener('blur', function () {
        boardWrap.classList.remove('mcs-fraction-bars-focused');
      });

      var resizeHandle = MCS.observeResize(container, function () {
        var nextWidth = Math.min(Math.max(usableWidth(container), den * minSegWidth), 480);
        if (nextWidth / den < minSegWidth) nextWidth = den * minSegWidth;
        if (Math.abs(nextWidth - barWidth) < 2) return;
        barWidth = nextWidth;
        host.style.width = barWidth + 'px';
        stage.width(barWidth);
        buildBar(barWidth);
      });

      announceState();

      return {
        getValue: function getValue() {
          return { num: countShaded(), den: den };
        },

        setValue: function setValue(v) {
          if (!v) return;
          var target = v.num != null ? v.num : countShaded();
          setShadedCount(target, false);
          fireChange();
        },

        setEnabled: function setEnabled(on) {
          enabled = !!on;
          boardWrap.style.pointerEvents = enabled ? '' : 'none';
          boardWrap.setAttribute('aria-disabled', enabled ? 'false' : 'true');
          if (resetBtn) resetBtn.disabled = !enabled;
        },

        showSolution: function showSolution(v) {
          if (!v) return;
          var targetNum = v.num != null ? v.num : countShaded();
          setShadedCount(targetNum, true, function () {
            boardWrap.classList.add('mcs-fraction-bars-solution-glow');
            window.setTimeout(function () {
              boardWrap.classList.remove('mcs-fraction-bars-solution-glow');
            }, 900);
            fireChange();
          });
        },

        flagCorrect: function flagCorrect() {
          boardWrap.classList.add('mcs-flag-correct');
          for (var bi = 0; bi < den; bi++) {
            if (shaded[bi]) syncSegmentVisual(bi, true);
          }
          window.setTimeout(function () {
            boardWrap.classList.remove('mcs-flag-correct');
          }, 600);
        },

        flagIncorrect: function flagIncorrect() {
          var baseX = barGroup.x();
          barGroup.to({
            x: baseX - 6,
            duration: 0.08,
            onFinish: function () {
              barGroup.to({
                x: baseX + 6,
                duration: 0.08,
                onFinish: function () {
                  barGroup.to({
                    x: baseX - 4,
                    duration: 0.08,
                    onFinish: function () {
                      barGroup.x(baseX);
                      objLayer.batchDraw();
                    },
                  });
                },
              });
            },
          });
          boardWrap.classList.add('mcs-flag-incorrect');
          window.setTimeout(function () {
            boardWrap.classList.remove('mcs-flag-incorrect');
          }, 450);
        },

        onChange: function onChange(callback) {
          if (typeof callback === 'function') changeCallbacks.push(callback);
        },

        destroy: function destroy() {
          if (activeTween) activeTween.cancel();
          stage.off('mouseup touchend', onPointerEnd);
          stage.off('mouseleave', onPointerEnd);
          boardWrap.removeEventListener('keydown', onKeyDown);
          if (resizeHandle) resizeHandle.disconnect();
          stage.destroy();
          container.innerHTML = '';
          changeCallbacks.length = 0;
          MCS._releaseContainer(container);
        },
      };
    });

    // -------------------------------------------------------------------------
    // number-track (Phase 3b — Y6 prime sieve shading)
    // -------------------------------------------------------------------------
    MCS.register('number-track', function numberTrackFactory(container, config) {
      config = config || {};
      var mode = config.mode || 'sieve-shade';
      var bandId = config.band || 'C';
      var bandTokens = MCS.band(bandId);
      var min = config.min != null ? config.min : 2;
      var max = config.max != null ? config.max : 30;
      var divisor = config.divisor != null ? config.divisor : 2;
      var columns = config.columns != null ? config.columns : 10;

      var numbers = [];
      var ni;
      for (ni = min; ni <= max; ni++) numbers.push(ni);

      var shaded = Object.create(null);
      numbers.forEach(function (num) {
        shaded[num] = false;
      });

      container.innerHTML = '';
      container.classList.add('mcs-number-track');

      var liveRegion = MCS.stage.ariaHost(container);
      var boardWrap = document.createElement('div');
      boardWrap.className = 'mcs-number-track-board';
      boardWrap.setAttribute('role', 'application');
      boardWrap.tabIndex = 0;
      container.appendChild(boardWrap);

      var caption = document.createElement('div');
      caption.className = 'mcs-number-track-caption';
      if (mode === 'sieve-shade') {
        caption.textContent = 'Tap multiples to shade';
      }
      container.appendChild(caption);

      var theme = MCS.theme(true);
      var enabled = true;
      var changeCallbacks = [];
      var cellNodes = Object.create(null);
      var hatchGroups = Object.create(null);

      var gap = 6;
      var cellSize = Math.max(
        bandTokens.minTouchTarget,
        bandId === 'A' ? 48 : bandId === 'B' ? 44 : 40
      );
      var rows = Math.ceil(numbers.length / columns);
      var stageWidth = columns * cellSize + (columns - 1) * gap;
      var stageHeight = rows * cellSize + (rows - 1) * gap;

      var host = document.createElement('div');
      host.className = 'mcs-konva-host';
      host.style.width = stageWidth + 'px';
      host.style.height = stageHeight + 'px';
      boardWrap.appendChild(host);

      var stage = new Konva.Stage({
        container: host,
        width: stageWidth,
        height: stageHeight,
      });
      var objLayer = new Konva.Layer();
      stage.add(objLayer);

      function shadedList() {
        var out = [];
        numbers.forEach(function (num) {
          if (shaded[num]) out.push(num);
        });
        return out;
      }

      function updateAria() {
        var list = shadedList();
        boardWrap.setAttribute(
          'aria-label',
          mode === 'sieve-shade'
            ? 'Number track from ' + min + ' to ' + max + '. ' + list.length + ' cells shaded.'
            : 'Number track from ' + min + ' to ' + max + '.'
        );
      }

      function addCellHatch(group, w, h) {
        var spacing = 7;
        var d = -h;
        while (d < w + h) {
          group.add(
            new Konva.Line({
              points: [d, 0, d + h, h],
              stroke: theme.ink,
              strokeWidth: 1,
              opacity: 0.2,
              listening: false,
            })
          );
          d += spacing;
        }
        group.clipFunc(function (ctx) {
          ctx.rect(0, 0, w, h);
        });
      }

      function syncCell(num, animate) {
        var rect = cellNodes[num];
        var hatch = hatchGroups[num];
        if (!rect) return;
        var isOn = shaded[num];
        rect.fill(isOn ? theme.accent : theme.accentSoft || theme.surface);
        rect.stroke(isOn ? theme.accent : theme.ink);
        rect.strokeWidth(isOn ? 2 : 1);
        rect.opacity(isOn ? 1 : 0.85);

        if (hatch) {
          hatch.destroy();
          hatchGroups[num] = null;
        }
        if (isOn) {
          var hg = new Konva.Group({
            x: rect.x(),
            y: rect.y(),
            listening: false,
          });
          addCellHatch(hg, cellSize, cellSize);
          objLayer.add(hg);
          hatchGroups[num] = hg;
        }

        if (animate && isOn) {
          var baseY = rect.y();
          rect.to({
            y: baseY - 3,
            duration: 0.1,
            onFinish: function () {
              rect.to({ y: baseY, duration: 0.1 });
            },
          });
        }

        objLayer.batchDraw();
      }

      function syncAll(animate) {
        numbers.forEach(function (num) {
          syncCell(num, animate);
        });
        var count = shadedList().length;
        if (mode === 'sieve-shade') {
          caption.textContent =
            count === 0
              ? 'Tap every multiple on the track'
              : count + ' cell' + (count === 1 ? '' : 's') + ' shaded';
        }
        liveRegion.textContent =
          count + ' shaded: ' + (shadedList().join(', ') || 'none');
        updateAria();
      }

      function fireChange() {
        changeCallbacks.forEach(function (cb) {
          try {
            cb(shadedList());
          } catch (e) {
            console.warn('number-track onChange error', e);
          }
        });
      }

      function toggleCell(num) {
        if (!enabled) return;
        shaded[num] = !shaded[num];
        syncCell(num, true);
        MCS.audio.emit('tick');
        syncAll(false);
        fireChange();
      }

      numbers.forEach(function (num, index) {
        var col = index % columns;
        var row = Math.floor(index / columns);
        var x = col * (cellSize + gap);
        var y = row * (cellSize + gap);

        var rect = new Konva.Rect({
          x: x,
          y: y,
          width: cellSize,
          height: cellSize,
          cornerRadius: bandId === 'A' ? 10 : 6,
          fill: theme.accentSoft || theme.surface,
          stroke: theme.ink,
          strokeWidth: 1,
          hitStrokeWidth: Math.max(bandTokens.minTouchTarget / 2, 12),
        });

        var label = new Konva.Text({
          x: x,
          y: y + cellSize / 2 - bandTokens.fontSizeMin / 2,
          width: cellSize,
          text: String(num),
          fontSize: bandTokens.fontSizeMin,
          fontFamily: theme.fontMono || 'monospace',
          fontStyle: 'bold',
          fill: theme.ink,
          align: 'center',
          listening: false,
        });

        rect.on('mousedown touchstart', function (evt) {
          evt.cancelBubble = true;
          toggleCell(num);
        });

        objLayer.add(rect);
        objLayer.add(label);
        cellNodes[num] = rect;
      });

      syncAll(false);

      boardWrap.addEventListener('focus', function () {
        boardWrap.classList.add('mcs-number-track-focused');
      });
      boardWrap.addEventListener('blur', function () {
        boardWrap.classList.remove('mcs-number-track-focused');
      });

      return {
        getValue: function getValue() {
          return shadedList();
        },

        setValue: function setValue(nums) {
          numbers.forEach(function (n) {
            shaded[n] = false;
          });
          if (Array.isArray(nums)) {
            nums.forEach(function (n) {
              if (shaded[n] !== undefined) shaded[n] = true;
            });
          }
          syncAll(false);
          fireChange();
        },

        setEnabled: function setEnabled(on) {
          enabled = !!on;
          boardWrap.style.pointerEvents = enabled ? '' : 'none';
          boardWrap.setAttribute('aria-disabled', enabled ? 'false' : 'true');
        },

        showSolution: function showSolution(nums) {
          if (Array.isArray(nums)) {
            this.setValue(nums);
          } else if (mode === 'sieve-shade' && divisor) {
            var auto = [];
            numbers.forEach(function (n) {
              if (n % divisor === 0) auto.push(n);
            });
            this.setValue(auto);
          }
          boardWrap.classList.add('mcs-number-track-solution-glow');
          window.setTimeout(function () {
            boardWrap.classList.remove('mcs-number-track-solution-glow');
          }, 900);
        },

        flagCorrect: function flagCorrect() {
          boardWrap.classList.add('mcs-flag-correct');
          window.setTimeout(function () {
            boardWrap.classList.remove('mcs-flag-correct');
          }, 600);
        },

        flagIncorrect: function flagIncorrect() {
          boardWrap.classList.add('mcs-flag-incorrect');
          window.setTimeout(function () {
            boardWrap.classList.remove('mcs-flag-incorrect');
          }, 450);
        },

        onChange: function onChange(callback) {
          if (typeof callback === 'function') changeCallbacks.push(callback);
        },

        destroy: function destroy() {
          stage.destroy();
          container.innerHTML = '';
          changeCallbacks.length = 0;
          MCS._releaseContainer(container);
        },
      };
    });

    // -------------------------------------------------------------------------
    // place-value-blocks accordion modes (Phase 4b/4d assessment expanders)
    // -------------------------------------------------------------------------
    function parseAccordionDecimalDigits(n) {
      var fixed = Number(n).toFixed(3);
      var parts = fixed.split('.');
      var frac = parts[1] || '000';
      return {
        ones: parseInt(parts[0], 10) || 0,
        tenths: parseInt(frac.charAt(0), 10) || 0,
        hundredths: parseInt(frac.charAt(1), 10) || 0,
        thousandths: parseInt(frac.charAt(2), 10) || 0,
      };
    }

    function computeAccordionDecimalDisplay(collapsed, digits) {
      var display = {
        ones: String(digits.ones),
        tenths: String(digits.tenths),
        hundredths: String(digits.hundredths),
        thousandths: String(digits.thousandths),
      };
      var hide = { ones: false, tenths: false, hundredths: false, thousandths: false };

      if (collapsed.ones) {
        hide.ones = true;
        display.tenths = String(digits.ones * 10 + digits.tenths);
      }
      if (collapsed.tenths) {
        hide.tenths = true;
        var currentT = collapsed.ones ? digits.ones * 10 + digits.tenths : digits.tenths;
        display.hundredths = String(currentT * 10 + digits.hundredths);
      }
      if (collapsed.hundredths) {
        hide.hundredths = true;
        var currentT2 = collapsed.ones ? digits.ones * 10 + digits.tenths : digits.tenths;
        var currentH = collapsed.tenths ? currentT2 * 10 + digits.hundredths : digits.hundredths;
        display.thousandths = String(currentH * 10 + digits.thousandths);
      }

      return { display: display, hide: hide };
    }

    function accordionDecimalLogMessage(collapsed, digits, display) {
      if (collapsed.ones && collapsed.tenths && collapsed.hundredths) {
        return (
          'Expander collapsed completely: ' + display.thousandths + ' thousandths.'
        );
      }
      if (collapsed.ones && collapsed.tenths) {
        return (
          'Ones and Tenths folded: ' +
          display.hundredths +
          ' hundredths, ' +
          display.thousandths +
          ' thousandths.'
        );
      }
      if (collapsed.ones) {
        return (
          'Ones folded: ' +
          display.tenths +
          ' tenths, ' +
          display.hundredths +
          ' hundredths, ' +
          display.thousandths +
          ' thousandths.'
        );
      }
      return (
        'Expander fully expanded: ' +
        digits.ones +
        ' ones, ' +
        digits.tenths +
        ' tenths, ' +
        digits.hundredths +
        ' hundredths, ' +
        digits.thousandths +
        ' thousandths.'
      );
    }

    function createPlaceValueAccordionDecimal(container, config) {
      config = config || {};
      var bandId = config.band || 'C';
      var digits = parseAccordionDecimalDigits(config.number != null ? config.number : 9.524);
      var jointKeys = Array.isArray(config.joints)
        ? config.joints.slice()
        : ['ones', 'tenths', 'hundredths'];
      var blockDefs = [
        { key: 'ones', label: 'Ones' },
        { key: 'tenths', label: 'Tenths' },
        { key: 'hundredths', label: 'Hundredths' },
        { key: 'thousandths', label: 'Thousandths' },
      ];
      var collapsed = { ones: false, tenths: false, hundredths: false };
      var changeCallbacks = [];
      var enabled = true;
      var blockEls = {};
      var numEls = {};

      container.innerHTML = '';
      container.classList.add('mcs-place-value-blocks', 'mcs-accordion-decimal');

      var widgetRow = document.createElement('div');
      widgetRow.className = 'number-expander-widget';
      widgetRow.style.maxWidth = '100%';
      container.appendChild(widgetRow);

      blockDefs.forEach(function (def) {
        var block = document.createElement('div');
        block.className = 'expander-block';
        block.id = 'mcs-exp-block-' + def.key;

        var num = document.createElement('div');
        num.className = 'expander-number';
        num.id = 'mcs-exp-num-' + def.key;
        block.appendChild(num);
        numEls[def.key] = num;

        var label = document.createElement('div');
        label.className = 'expander-label';
        label.textContent = def.label;
        block.appendChild(label);

        if (jointKeys.indexOf(def.key) !== -1) {
          var joint = document.createElement('button');
          joint.type = 'button';
          joint.className = 'expander-joint';
          joint.setAttribute('aria-label', 'Fold ' + def.label.toLowerCase() + ' joint');
          joint.textContent = '↔';
          joint.addEventListener('click', function () {
            if (!enabled) return;
            MCS.audio.emit('click');
            collapsed[def.key] = !collapsed[def.key];
            block.classList.toggle('collapsed', collapsed[def.key]);
            refresh();
          });
          block.appendChild(joint);
        }

        widgetRow.appendChild(block);
        blockEls[def.key] = block;
      });

      function refresh() {
        var computed = computeAccordionDecimalDisplay(collapsed, digits);
        blockDefs.forEach(function (def) {
          var key = def.key;
          numEls[key].textContent = computed.display[key];
          numEls[key].style.display = computed.hide[key] ? 'none' : 'block';
        });
        var payload = {
          collapsed: {
            ones: collapsed.ones,
            tenths: collapsed.tenths,
            hundredths: collapsed.hundredths,
          },
          displayLabels: computed.display,
          logMessage: accordionDecimalLogMessage(collapsed, digits, computed.display),
        };
        changeCallbacks.forEach(function (cb) {
          cb(payload);
        });
      }

      refresh();

      return {
        getValue: function getValue() {
          var computed = computeAccordionDecimalDisplay(collapsed, digits);
          return {
            collapsed: {
              ones: collapsed.ones,
              tenths: collapsed.tenths,
              hundredths: collapsed.hundredths,
            },
            displayLabels: computed.display,
            mode: 'accordion-decimal',
            band: bandId,
          };
        },

        resetCollapsed: function resetCollapsed() {
          collapsed.ones = false;
          collapsed.tenths = false;
          collapsed.hundredths = false;
          jointKeys.forEach(function (key) {
            if (blockEls[key]) blockEls[key].classList.remove('collapsed');
          });
          refresh();
        },

        setEnabled: function setEnabled(on) {
          enabled = !!on;
          widgetRow.style.pointerEvents = enabled ? '' : 'none';
          widgetRow.setAttribute('aria-disabled', enabled ? 'false' : 'true');
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
    }

    function parseAccordionIntegerDigits(n) {
      var value = Math.max(0, Math.floor(Number(n) || 0));
      return {
        hundreds: Math.floor(value / 100),
        tens: Math.floor((value % 100) / 10),
        ones: value % 10,
      };
    }

    function computeAccordionIntegerDisplay(collapsed, digits) {
      var display = {
        hundreds: String(digits.hundreds),
        tens: String(digits.tens),
        ones: String(digits.ones),
      };
      var hide = { hundreds: false, tens: false, ones: false };

      if (collapsed.hundreds) {
        hide.hundreds = true;
        display.tens = String(digits.hundreds * 10 + digits.tens);
      }
      if (collapsed.tens) {
        hide.tens = true;
        var currentT = collapsed.hundreds
          ? digits.hundreds * 10 + digits.tens
          : digits.tens;
        display.ones = String(currentT * 10 + digits.ones);
      }

      return { display: display, hide: hide };
    }

    function accordionIntegerLogMessage(collapsed, digits, display) {
      if (collapsed.hundreds && collapsed.tens) {
        return 'Expander collapsed completely: ' + display.ones + ' ones.';
      }
      if (collapsed.hundreds) {
        return (
          'Expander folded hundreds joint: ' +
          display.tens +
          ' tens, ' +
          display.ones +
          ' ones.'
        );
      }
      if (collapsed.tens) {
        return (
          'Expander folded tens joint: ' +
          display.hundreds +
          ' hundreds, ' +
          display.ones +
          ' ones.'
        );
      }
      return (
        'Expander fully expanded: ' +
        digits.hundreds +
        ' hundreds, ' +
        digits.tens +
        ' tens, ' +
        digits.ones +
        ' ones.'
      );
    }

    function createPlaceValueAccordionInteger(container, config) {
      config = config || {};
      var bandId = config.band || 'B';
      var digits = parseAccordionIntegerDigits(config.number != null ? config.number : 952);
      var jointKeys = Array.isArray(config.joints)
        ? config.joints.slice()
        : ['hundreds', 'tens'];
      var blockDefs = [
        { key: 'hundreds', label: 'Hundreds' },
        { key: 'tens', label: 'Tens' },
        { key: 'ones', label: 'Ones' },
      ];
      var collapsed = { hundreds: false, tens: false };
      var changeCallbacks = [];
      var enabled = true;
      var blockEls = {};
      var numEls = {};

      container.innerHTML = '';
      container.classList.add('mcs-place-value-blocks', 'mcs-accordion-integer');

      var widgetRow = document.createElement('div');
      widgetRow.className = 'number-expander-widget';
      widgetRow.style.maxWidth = '100%';
      container.appendChild(widgetRow);

      blockDefs.forEach(function (def) {
        var block = document.createElement('div');
        block.className = 'expander-block';
        block.id = 'mcs-exp-block-' + def.key;

        var num = document.createElement('div');
        num.className = 'expander-number';
        num.id = 'mcs-exp-num-' + def.key;
        block.appendChild(num);
        numEls[def.key] = num;

        var label = document.createElement('div');
        label.className = 'expander-label';
        label.textContent = def.label;
        block.appendChild(label);

        if (jointKeys.indexOf(def.key) !== -1) {
          var joint = document.createElement('button');
          joint.type = 'button';
          joint.className = 'expander-joint';
          joint.setAttribute('aria-label', 'Fold ' + def.label.toLowerCase() + ' joint');
          joint.textContent = '↔';
          joint.addEventListener('click', function () {
            if (!enabled) return;
            MCS.audio.emit('click');
            collapsed[def.key] = !collapsed[def.key];
            block.classList.toggle('collapsed', collapsed[def.key]);
            refresh();
          });
          block.appendChild(joint);
        }

        widgetRow.appendChild(block);
        blockEls[def.key] = block;
      });

      function refresh() {
        var computed = computeAccordionIntegerDisplay(collapsed, digits);
        blockDefs.forEach(function (def) {
          var key = def.key;
          numEls[key].textContent = computed.display[key];
          numEls[key].style.display = computed.hide[key] ? 'none' : 'block';
        });
        var payload = {
          collapsed: {
            hundreds: collapsed.hundreds,
            tens: collapsed.tens,
          },
          displayLabels: computed.display,
          logMessage: accordionIntegerLogMessage(collapsed, digits, computed.display),
        };
        changeCallbacks.forEach(function (cb) {
          cb(payload);
        });
      }

      refresh();

      return {
        getValue: function getValue() {
          var computed = computeAccordionIntegerDisplay(collapsed, digits);
          return {
            collapsed: {
              hundreds: collapsed.hundreds,
              tens: collapsed.tens,
            },
            displayLabels: computed.display,
            mode: 'accordion-integer',
            band: bandId,
          };
        },

        resetCollapsed: function resetCollapsed() {
          collapsed.hundreds = false;
          collapsed.tens = false;
          jointKeys.forEach(function (key) {
            if (blockEls[key]) blockEls[key].classList.remove('collapsed');
          });
          refresh();
        },

        setEnabled: function setEnabled(on) {
          enabled = !!on;
          widgetRow.style.pointerEvents = enabled ? '' : 'none';
          widgetRow.setAttribute('aria-disabled', enabled ? 'false' : 'true');
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
    }

    // -------------------------------------------------------------------------
    // place-value-blocks (Phase 3d — Y3 regroup hint scaffold)
    // -------------------------------------------------------------------------
    function bindHintReveal(container, setVisible) {
      var widgetRegion = container.closest('.mcs-widget-region');
      if (!widgetRegion || typeof MutationObserver === 'undefined') {
        setVisible(true);
        return null;
      }
      setVisible(widgetRegion.classList.contains('mcs-hint-highlight'));
      var observer = new MutationObserver(function () {
        setVisible(widgetRegion.classList.contains('mcs-hint-highlight'));
      });
      observer.observe(widgetRegion, { attributes: true, attributeFilter: ['class'] });
      return observer;
    }

    function decomposePlaceValue(n, showHundreds, max) {
      var cap = max != null ? max : 999;
      n = Math.max(0, Math.min(Math.floor(n), cap));
      if (showHundreds) {
        return {
          hundreds: Math.floor(n / 100),
          tens: Math.floor((n % 100) / 10),
          ones: n % 10,
          total: n,
        };
      }
      return {
        hundreds: 0,
        tens: Math.floor(n / 10),
        ones: n % 10,
        total: n,
      };
    }

    MCS.register('place-value-blocks', function placeValueBlocksFactory(container, config) {
      config = config || {};
      var mode = config.mode || 'build';
      if (mode === 'accordion-decimal') {
        return createPlaceValueAccordionDecimal(container, config);
      }
      if (mode === 'accordion-integer') {
        return createPlaceValueAccordionInteger(container, config);
      }
      var bandId = config.band || 'B';
      var bandTokens = MCS.band(bandId);
      var showHundreds = config.showHundreds !== false;
      var max = config.max != null ? config.max : 999;
      var hintOnly = config.hintOnly === true;
      var interactive = config.interactive === true;
      var values = Array.isArray(config.values) ? config.values.slice(0, 2) : [config.value || 0];
      var sign = config.sign || '';

      container.innerHTML = '';
      container.classList.add('mcs-place-value-blocks');
      if (hintOnly) container.classList.add('mcs-hint-pending');

      var liveRegion = MCS.stage.ariaHost(container);
      var boardWrap = document.createElement('div');
      boardWrap.className = 'mcs-place-value-blocks-board';
      boardWrap.setAttribute('role', 'img');
      boardWrap.tabIndex = hintOnly ? -1 : 0;
      container.appendChild(boardWrap);

      var caption = document.createElement('div');
      caption.className = 'mcs-place-value-blocks-caption';
      caption.textContent = hintOnly ? 'Place-value hint (shown on second attempt)' : 'Build the number with blocks';
      if (hintOnly) caption.setAttribute('aria-hidden', 'true');
      container.appendChild(caption);

      var theme = MCS.theme(true);
      var unit = bandId === 'A' ? 14 : bandId === 'B' ? 11 : 9;
      var gap = 6;
      var colGap = Math.max(14, unit * 1.2);
      var enabled = true;
      var changeCallbacks = [];
      var hintObserver = null;
      var rootGroup = null;

      function blockHeight(parts) {
        var h = 0;
        if (parts.hundreds > 0) h += unit * 10 + gap;
        if (parts.tens > 0) h += parts.tens * (unit * 10 + gap);
        if (parts.ones > 0) h += parts.ones * (unit + gap);
        return Math.max(h, unit * 10);
      }

      function drawOnes(group, x, y, count, color) {
        var cy = y;
        var i;
        for (i = 0; i < count; i++) {
          group.add(
            new Konva.Rect({
              x: x,
              y: cy,
              width: unit,
              height: unit,
              fill: color,
              stroke: theme.ink,
              strokeWidth: 1,
              cornerRadius: 2,
              listening: interactive,
            })
          );
          cy += unit + 2;
        }
        return cy;
      }

      function drawTenRod(group, x, y, color) {
        var rodH = unit * 10;
        group.add(
          new Konva.Rect({
            x: x,
            y: y,
            width: unit,
            height: rodH,
            fill: color,
            stroke: theme.ink,
            strokeWidth: 1.2,
            cornerRadius: 2,
            listening: interactive,
          })
        );
        var seg;
        for (seg = 1; seg < 10; seg++) {
          group.add(
            new Konva.Line({
              points: [x, y + seg * unit, x + unit, y + seg * unit],
              stroke: theme.ink,
              strokeWidth: 0.6,
              opacity: 0.45,
              listening: false,
            })
          );
        }
        return y + rodH + gap;
      }

      function drawHundredFlat(group, x, y, color) {
        var side = unit * 10;
        group.add(
          new Konva.Rect({
            x: x,
            y: y,
            width: side,
            height: side,
            fill: color,
            stroke: theme.ink,
            strokeWidth: 1.2,
            cornerRadius: 3,
            listening: interactive,
          })
        );
        var gi;
        for (gi = 1; gi < 10; gi++) {
          group.add(
            new Konva.Line({
              points: [x + gi * unit, y, x + gi * unit, y + side],
              stroke: theme.ink,
              strokeWidth: 0.4,
              opacity: 0.35,
              listening: false,
            })
          );
          group.add(
            new Konva.Line({
              points: [x, y + gi * unit, x + side, y + gi * unit],
              stroke: theme.ink,
              strokeWidth: 0.4,
              opacity: 0.35,
              listening: false,
            })
          );
        }
        return y + side + gap;
      }

      function drawNumberColumn(group, startX, baselineY, parts, label) {
        var colW = unit * 10;
        var cols = showHundreds ? ['hundreds', 'tens', 'ones'] : ['tens', 'ones'];
        var labels = showHundreds ? ['H', 'T', 'O'] : ['T', 'O'];
        var colors = [theme.accentSoft, theme.gridLine, theme.accent];
        var colIdx;
        var x = startX;

        group.add(
          new Konva.Text({
            x: startX,
            y: 4,
            width: cols.length * colW + (cols.length - 1) * colGap,
            align: 'center',
            text: String(label != null ? label : parts.total),
            fontSize: bandId === 'A' ? 16 : 14,
            fontFamily: 'Space Grotesk, sans-serif',
            fontStyle: 'bold',
            fill: theme.ink,
            listening: false,
          })
        );

        for (colIdx = 0; colIdx < cols.length; colIdx++) {
          var key = cols[colIdx];
          var count = parts[key];
          var colX = x + (colW - unit) / 2;
          var blockY = baselineY;
          var ci;

          group.add(
            new Konva.Text({
              x: x,
              y: baselineY - 18,
              width: colW,
              align: 'center',
              text: labels[colIdx],
              fontSize: 11,
              fontFamily: 'Work Sans, sans-serif',
              fontStyle: '600',
              fill: theme.gridLine,
              listening: false,
            })
          );

          if (key === 'hundreds') {
            for (ci = 0; ci < count; ci++) {
              blockY = drawHundredFlat(group, colX, blockY, colors[0]);
            }
          } else if (key === 'tens') {
            for (ci = 0; ci < count; ci++) {
              blockY = drawTenRod(group, colX, blockY, colors[1]);
            }
          } else {
            drawOnes(group, colX, blockY, count, colors[2]);
          }

          x += colW + colGap;
        }

        return x;
      }

      function renderBlocks() {
        var decomposed = values.map(function (v) {
          return decomposePlaceValue(v, showHundreds, max);
        });
        var maxH = 0;
        decomposed.forEach(function (p) {
          maxH = Math.max(maxH, blockHeight(p));
        });

        var numCols = showHundreds ? 3 : 2;
        var colW = unit * 10;
        var perNumberW = numCols * colW + (numCols - 1) * colGap;
        var signW = values.length > 1 && sign ? unit * 2 : 0;
        var stageW = Math.min(
          Math.max(usableWidth(container), 260),
          values.length * perNumberW + (values.length - 1) * (signW + 24) + 32
        );
        var stageH = maxH + 56;

        boardWrap.innerHTML = '';
        var host = document.createElement('div');
        host.className = 'mcs-konva-host';
        host.style.width = stageW + 'px';
        host.style.height = stageH + 'px';
        boardWrap.appendChild(host);

        var stage = new Konva.Stage({
          container: host,
          width: stageW,
          height: stageH,
        });
        var objLayer = new Konva.Layer();
        stage.add(objLayer);
        rootGroup = new Konva.Group({ x: 16, y: 28, name: 'pvb-root' });
        objLayer.add(rootGroup);

        var cursorX = 0;
        var baselineY = 22;
        var vi;
        for (vi = 0; vi < decomposed.length; vi++) {
          if (vi > 0 && sign) {
            rootGroup.add(
              new Konva.Text({
                x: cursorX + 4,
                y: baselineY + maxH / 2 - 10,
                text: sign,
                fontSize: 22,
                fontFamily: 'Space Grotesk, sans-serif',
                fontStyle: 'bold',
                fill: theme.ink,
                listening: false,
              })
            );
            cursorX += signW + 12;
          }
          cursorX = drawNumberColumn(rootGroup, cursorX, baselineY, decomposed[vi], values[vi]) + 20;
        }

        boardWrap.setAttribute(
          'aria-label',
          'Place value blocks showing ' + values.join(' ' + sign + ' ')
        );
        liveRegion.textContent = boardWrap.getAttribute('aria-label');
        stage.batchDraw();
        return stage;
      }

      var stage = renderBlocks();

      function setHintVisible(show) {
        if (!rootGroup) return;
        rootGroup.opacity(show ? 1 : 0.08);
        if (caption) caption.style.opacity = show ? '1' : '0.35';
        stage.batchDraw();
      }

      if (hintOnly) {
        hintObserver = bindHintReveal(container, setHintVisible);
      }

      return {
        getValue: function getValue() {
          return {
            values: values.map(function (v) {
              return decomposePlaceValue(v, showHundreds, max);
            }),
            mode: mode,
          };
        },

        setValue: function setValue(v) {
          if (v == null) return;
          if (Array.isArray(v)) values = v.slice(0, 2);
          else if (typeof v === 'number') values = [v];
          if (stage) stage.destroy();
          stage = renderBlocks();
          if (hintOnly) setHintVisible(false);
        },

        setEnabled: function setEnabled(on) {
          enabled = !!on;
          boardWrap.style.pointerEvents = enabled && !hintOnly ? '' : 'none';
          boardWrap.setAttribute('aria-disabled', enabled ? 'false' : 'true');
        },

        showSolution: function showSolution(v) {
          if (v != null) this.setValue(v);
          setHintVisible(true);
          boardWrap.classList.add('mcs-place-value-blocks-solution-glow');
          window.setTimeout(function () {
            boardWrap.classList.remove('mcs-place-value-blocks-solution-glow');
          }, 900);
        },

        flagCorrect: function flagCorrect() {
          boardWrap.classList.add('mcs-flag-correct');
          window.setTimeout(function () {
            boardWrap.classList.remove('mcs-flag-correct');
          }, 600);
        },

        flagIncorrect: function flagIncorrect() {
          boardWrap.classList.add('mcs-flag-incorrect');
          window.setTimeout(function () {
            boardWrap.classList.remove('mcs-flag-incorrect');
          }, 450);
        },

        onChange: function onChange(callback) {
          if (typeof callback === 'function') changeCallbacks.push(callback);
        },

        destroy: function destroy() {
          if (hintObserver) hintObserver.disconnect();
          if (stage) stage.destroy();
          container.innerHTML = '';
          changeCallbacks.length = 0;
          MCS._releaseContainer(container);
        },
      };
    });

    // -------------------------------------------------------------------------
    // array-builder (Phase 3d — Y3 fact-family hint scaffold)
    // -------------------------------------------------------------------------
    MCS.register('array-builder', function arrayBuilderFactory(container, config) {
      config = config || {};
      var mode = config.mode || 'show-array';
      var bandId = config.band || 'B';
      var bandTokens = MCS.band(bandId);
      var rows = Math.max(1, config.rows != null ? config.rows : 1);
      var cols = Math.max(1, config.cols != null ? config.cols : 1);
      var totalDots = config.total != null ? config.total : rows * cols;
      var splitAt = config.splitAt != null ? config.splitAt : 0;
      var hintOnly = config.hintOnly === true;
      var dotR = bandId === 'A' ? 10 : bandId === 'B' ? 8 : 6;
      var spacing = dotR * 2 + (bandId === 'A' ? 10 : 8);

      container.innerHTML = '';
      container.classList.add('mcs-array-builder');
      if (hintOnly) container.classList.add('mcs-hint-pending');

      var liveRegion = MCS.stage.ariaHost(container);
      var boardWrap = document.createElement('div');
      boardWrap.className = 'mcs-array-builder-board';
      boardWrap.setAttribute('role', 'img');
      boardWrap.tabIndex = hintOnly ? -1 : 0;
      container.appendChild(boardWrap);

      var caption = document.createElement('div');
      caption.className = 'mcs-array-builder-caption';
      var total = totalDots;
      caption.textContent =
        mode === 'show-array'
          ? rows + ' \u00d7 ' + cols + ' array (' + total + ' dots)'
          : 'Drag to size the array';
      if (hintOnly) caption.setAttribute('aria-hidden', 'true');
      container.appendChild(caption);

      var theme = MCS.theme(true);
      var enabled = true;
      var changeCallbacks = [];
      var hintObserver = null;
      var rootGroup = null;
      var stage = null;

      function renderArray() {
        var stageW = Math.min(Math.max(usableWidth(container), 200), cols * spacing + 48);
        var stageH = rows * spacing + 48;

        boardWrap.innerHTML = '';
        var host = document.createElement('div');
        host.className = 'mcs-konva-host';
        host.style.width = stageW + 'px';
        host.style.height = stageH + 'px';
        boardWrap.appendChild(host);

        stage = new Konva.Stage({
          container: host,
          width: stageW,
          height: stageH,
        });
        var objLayer = new Konva.Layer();
        stage.add(objLayer);
        rootGroup = new Konva.Group({ x: 20, y: 20, name: 'array-root' });
        objLayer.add(rootGroup);

        var count = 0;
        var r;
        var c;
        for (r = 0; r < rows; r++) {
          for (c = 0; c < cols; c++) {
            if (count >= totalDots) break;
            var isKnown = count < splitAt;
            rootGroup.add(
              new Konva.Circle({
                x: c * spacing + dotR,
                y: r * spacing + dotR,
                radius: dotR,
                fill: isKnown ? theme.accent : theme.accentSoft,
                stroke: theme.ink,
                strokeWidth: isKnown ? 1.5 : 1,
                opacity: isKnown ? 1 : 0.65,
                listening: false,
              })
            );
            count++;
          }
          if (count >= totalDots) break;
        }

        if (splitAt > 0 && splitAt < total) {
          rootGroup.add(
            new Konva.Text({
              x: 0,
              y: rows * spacing + 4,
              width: cols * spacing,
              align: 'center',
              text: splitAt + ' + ' + (total - splitAt) + ' = ' + total,
              fontSize: 12,
              fontFamily: 'Work Sans, sans-serif',
              fontStyle: '600',
              fill: theme.gridLine,
              listening: false,
            })
          );
        }

        boardWrap.setAttribute(
          'aria-label',
          rows + ' by ' + cols + ' array of ' + total + ' dots'
        );
        liveRegion.textContent = boardWrap.getAttribute('aria-label');
        stage.batchDraw();
      }

      renderArray();

      function setHintVisible(show) {
        if (!rootGroup) return;
        rootGroup.opacity(show ? 1 : 0.08);
        if (caption) caption.style.opacity = show ? '1' : '0.35';
        if (stage) stage.batchDraw();
      }

      if (hintOnly) {
        hintObserver = bindHintReveal(container, setHintVisible);
      }

      return {
        getValue: function getValue() {
          return { rows: rows, cols: cols, total: totalDots, splitAt: splitAt };
        },

        setValue: function setValue(v) {
          if (!v) return;
          if (v.rows != null) rows = Math.max(1, v.rows);
          if (v.cols != null) cols = Math.max(1, v.cols);
          if (v.total != null) totalDots = v.total;
          if (v.splitAt != null) splitAt = v.splitAt;
          renderArray();
          if (hintOnly) setHintVisible(false);
        },

        setEnabled: function setEnabled(on) {
          enabled = !!on;
          boardWrap.style.pointerEvents = enabled && !hintOnly ? '' : 'none';
        },

        showSolution: function showSolution(v) {
          if (v) this.setValue(v);
          setHintVisible(true);
          boardWrap.classList.add('mcs-array-builder-solution-glow');
          window.setTimeout(function () {
            boardWrap.classList.remove('mcs-array-builder-solution-glow');
          }, 900);
        },

        flagCorrect: function flagCorrect() {
          boardWrap.classList.add('mcs-flag-correct');
          window.setTimeout(function () {
            boardWrap.classList.remove('mcs-flag-correct');
          }, 600);
        },

        flagIncorrect: function flagIncorrect() {
          boardWrap.classList.add('mcs-flag-incorrect');
          window.setTimeout(function () {
            boardWrap.classList.remove('mcs-flag-incorrect');
          }, 450);
        },

        onChange: function onChange(callback) {
          if (typeof callback === 'function') changeCallbacks.push(callback);
        },

        destroy: function destroy() {
          if (hintObserver) hintObserver.disconnect();
          if (stage) stage.destroy();
          container.innerHTML = '';
          changeCallbacks.length = 0;
          MCS._releaseContainer(container);
        },
      };
    });
  }
})(window.MCS || {});
