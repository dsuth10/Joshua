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

      board.create(
        'segment',
        [
          [
            function () {
              return pin.X();
            },
            0.15,
          ],
          [
            function () {
              return pin.X();
            },
            1.35,
          ],
        ],
        {
          strokeColor: color,
          strokeWidth: 2,
          fixed: true,
          highlight: false,
          layer: 1,
        }
      );

      MCS.board.label(boardCtx, [function () { return pin.X(); }, 1.55], pt.label || pt.id, {
        fontSize: labelFontSize,
        anchorY: 'bottom',
        cssStyle: 'color:' + color + ';font-weight:700;font-family:' + theme.fontMono + ';',
      });

      pin.on('drag', function () {
        if (!enabled) return;
        pin.setPosition(JXG.COORDS_BY_USER, [pin.X(), 0]);
        pin.setAttribute({ size: pinSize * 1.1 });
      });

      pin.on('down', function () {
        if (!enabled) return;
        MCS.audio.emit('pickup');
      });

      pin.on('up', function () {
        if (!enabled) return;
        var snapped = snapToStep(pin.X(), snapStep, min, max);
        pin.setPosition(JXG.COORDS_BY_USER, [snapped, 0]);
        pin.setAttribute({ size: pinSize });
        board.update();
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
      });
    });

    board.update();
    requestAnimationFrame(function () {
      try {
        if (board && board.resizeContainer) {
          board.resizeContainer();
          board.update();
        }
      } catch (e) {
        /* renderer settling */
      }
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
        entry.pin.setPosition(JXG.COORDS_BY_USER, [target, 0]);
        entry.pin.setAttribute({ size: pinSize });
        board.update();
        if (typeof onComplete === 'function') onComplete();
        return;
      }
      var startX = entry.pin.X();
      MCS.tween({
        duration: 0.55,
        onUpdate: function (t) {
          var x = startX + (target - startX) * t;
          entry.pin.setPosition(JXG.COORDS_BY_USER, [x, 0]);
          board.update();
        },
        onComplete: function () {
          entry.pin.setPosition(JXG.COORDS_BY_USER, [target, 0]);
          entry.pin.setAttribute({ size: pinSize });
          board.update();
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
    if ((config.mode || 'place-point') === 'order-points') {
      return createOrderPointsLine(container, config);
    }
    var bandId = config.band || 'C';
    var bandTokens = MCS.band(bandId);
    var min = config.min != null ? config.min : -10;
    var max = config.max != null ? config.max : 10;
    var snapStep = config.snapStep != null ? config.snapStep : 1;
    var ticks = config.ticks || { major: 5, minor: 1, labels: 'major' };
    var majorStep = ticks.major != null ? ticks.major : 5;
    var minorStep = ticks.minor != null ? ticks.minor : 1;
    var labelMode = ticks.labels || 'major';
    var initialValue = snapToStep(
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
      'Number line. Drag the pin to the target integer.'
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
    for (var iv = min; iv <= max; iv += minorStep) {
      var major = (iv - min) % majorStep === 0;
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

    // Pin stem + head
    var pinSize = jxgSizeFromBand(bandId);
    var pin = MCS.board.point(boardCtx, {
      coords: [initialValue, 0],
      size: pinSize,
      snapToGrid: true,
      snapSizeX: snapStep,
      snapSizeY: snapStep,
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

    pin.on('drag', function () {
      pin.setPosition(JXG.COORDS_BY_USER, [pin.X(), 0]);
      if (pickupScale) {
        pin.setAttribute({ size: pinSize * 1.1 });
      }
    });

    var currentValue = initialValue;
    var enabled = true;
    var changeCallbacks = [];
    var activeTween = null;
    var pickupScale = false;
    var lastAnnounced = null;

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

    pin.on('down', onPointerDown);
    pin.on('up', onPointerUp);

    // Touch: prevent page scroll during drag
    function preventTouchScroll(e) {
      if (!enabled) return;
      e.preventDefault();
    }
    boardWrap.addEventListener('touchmove', preventTouchScroll, { passive: false });

    // Keyboard path
    function onKeyDown(e) {
      if (!enabled) return;
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

    announce(initialValue);

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
        pin.setAttribute({ fixed: !enabled });
        boardWrap.style.pointerEvents = enabled ? '' : 'none';
        boardWrap.setAttribute('aria-disabled', enabled ? 'false' : 'true');
      },

      showSolution: function showSolution(v) {
        setPinValue(v, true, function () {
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
        boardWrap.removeEventListener('touchmove', preventTouchScroll);
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
  }
})(window.MCS || {});
