/**
 * MCS number widgets — number-line, fraction-bars, number-track, counters, ten-frame (Phase 5),
 */
(function (MCS) {
  'use strict';

  if (typeof JXG !== 'undefined' && MCS.board) {

  function unitFractionDenominator(step) {
    if (!isFinite(step) || step <= 0) return 0;
    var den = Math.round(1 / step);
    if (den < 1 || den > 120) return 0;
    return Math.abs(step - 1 / den) < 1e-9 ? den : 0;
  }

  function stepDecimalPlaces(step) {
    var unitDen = unitFractionDenominator(step);
    if (unitDen) {
      var stepTicks = 1;
      while (stepTicks * unitDen % 10 === 0 && stepTicks < unitDen) {
        stepTicks *= 10;
      }
      var reducedStep = stepTicks / unitDen;
      var places = 0;
      while (places < 12 && Math.abs(reducedStep - Math.round(reducedStep)) > 1e-7) {
        reducedStep *= 10;
        places++;
      }
      return places;
    }
    if (!isFinite(step) || step <= 0) return 0;
    for (var places = 0; places <= 12; places++) {
      var scaled = step * Math.pow(10, places);
      if (Math.abs(scaled - Math.round(scaled)) < 1e-7) {
        return places;
      }
    }
    return 12;
  }

  function snapToStep(value, step, min, max) {
    var unitDen = unitFractionDenominator(step);
    if (unitDen) {
      var scale = unitDen;
      var minTicks = Math.round(min * scale);
      var maxTicks = Math.round(max * scale);
      var tick = Math.round(value * scale);
      if (tick < minTicks) tick = minTicks;
      if (tick > maxTicks) tick = maxTicks;
      return tick / scale;
    }
    var units = Math.round((value - min) / step);
    var snapped = min + units * step;
    if (snapped < min) snapped = min;
    if (snapped > max) snapped = max;
    var decimalPlaces = stepDecimalPlaces(step);
    if (decimalPlaces > 0) {
      snapped = parseFloat(snapped.toFixed(decimalPlaces));
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

  /** Tight horizontal padding so ticks use the full board width (see order-points line). */
  function numberLineBoundingBox(min, max) {
    var range = Math.max(max - min, 0.25);
    var xPadLeft = range <= 1 ? 0.06 : range <= 4 ? 0.12 : Math.min(1, range * 0.05);
    var xPadRight = range <= 1 ? 0.1 : range <= 4 ? 0.18 : Math.min(1, range * 0.05);
    var yBottom = range <= 1 ? -1.35 : -1.05;
    return [min - xPadLeft, 2.2, max + xPadRight, yBottom];
  }

  function numberLineTickLabelY(major) {
    return major ? -0.58 : -0.68;
  }

  function isNumberLineMajorTick(iv, min, max, majorStep, minorStep) {
    var onWhole =
      Math.abs(iv - Math.round(iv)) < minorStep / 2 ||
      Math.abs(iv - min) < minorStep / 2 ||
      Math.abs(iv - max) < minorStep / 2;
    if (!onWhole) return false;
    return (
      Math.abs((iv - min) / majorStep - Math.round((iv - min) / majorStep)) < 1e-6 ||
      Math.abs(iv - min) < minorStep / 2 ||
      Math.abs(iv - max) < minorStep / 2
    );
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

  function formatOrderLineTickLabel(value, minorStep) {
    if (Math.abs(value - Math.round(value)) < minorStep / 2) {
      return String(Math.round(value));
    }
    var decimals = minorStep < 1 ? Math.max(1, Math.ceil(-Math.log10(minorStep))) : 0;
    return parseFloat(value.toFixed(decimals)).toString();
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
    if (config.fractionDenominator) {
      var fracStep = 1 / config.fractionDenominator;
      if (config.snapStep == null) snapStep = fracStep;
      if (ticks.minor == null) minorStep = fracStep;
    }
    if (config.maxMinorStep != null && minorStep < config.maxMinorStep - 1e-9) {
      minorStep = config.maxMinorStep;
    }
    if (ticks.minor == null && minorStep > snapStep + 1e-9) {
      minorStep = snapStep;
    }
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
    boardWrap.className = 'mcs-number-line-board mcs-number-line-board-order';
    boardWrap.setAttribute('role', 'application');
    boardWrap.setAttribute(
      'aria-label',
      'Number line. Drag each labelled pin to its correct position.'
    );
    boardWrap.tabIndex = 0;
    container.appendChild(boardWrap);

    boardWrap.style.width = '100%';
    boardWrap.style.minWidth = '280px';
    boardWrap.style.height = '168px';
    void boardWrap.offsetHeight;

    var boardCtx = MCS.board.make(boardWrap, {
      boundingbox: [min - 0.06, 2.2, max + 0.1, -1.05],
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
      var onWhole =
        Math.abs(iv - Math.round(iv)) < minorStep / 2 ||
        Math.abs(iv - min) < minorStep / 2 ||
        Math.abs(iv - max) < minorStep / 2;
      var major =
        onWhole &&
        (Math.abs((iv - min) / majorStep - Math.round((iv - min) / majorStep)) <
          1e-6 ||
          Math.abs(iv - min) < minorStep / 2 ||
          Math.abs(iv - max) < minorStep / 2);
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
        (labelMode === 'all' ||
          (labelMode === 'major' && major) ||
          (labelMode === 'zero' && Math.abs(iv) < minorStep / 2));

      if (showLabel) {
        MCS.board.label(boardCtx, [iv, -0.72], formatOrderLineTickLabel(iv, minorStep), {
          fontSize: major ? labelFontSize + 1 : labelFontSize,
          anchorY: 'top',
          strokeColor: major ? theme.ink : undefined,
          cssStyle:
            'font-family:' +
            theme.fontMono +
            ';' +
            (major ? 'font-weight:700;' : ''),
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
        var targetValue = snapToStep(pt.value, snapStep, min, max);
        var startX = pickWrongStart(targetValue, snapStep, min, max, usedStarts);
        usedStarts.push(startX);

        var pin = MCS.board.point(boardCtx, {
          coords: [startX, 0],
          size: pinSize,
          snapToGrid: true,
          snapSizeX: snapStep,
          snapSizeY: 1,
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
          var x = snapToStep(pin.X(), snapStep, min, max);
          syncPinVisual(x, pinSize * 1.1);
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
          correctValue: targetValue,
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

  // -------------------------------------------------------------------------
  // number-line — jump mode (Phase 5.10c — Y1-3 within-20 hops)
  // -------------------------------------------------------------------------
  function createNumberLineJump(container, config) {
    config = config || {};
    var bandId = config.band || 'A';
    var bandTokens = MCS.band(bandId);
    var min = config.min != null ? config.min : 0;
    var max = config.max != null ? config.max : 20;
    var start = snapToStep(config.start != null ? config.start : 0, 1, min, max);
    var delta = Math.max(1, Math.abs(config.delta != null ? config.delta : 1));
    var direction =
      config.direction ||
      (config.operation === 'subtract' ? 'backward' : 'forward');
    var stepSign = direction === 'backward' ? -1 : 1;
    var target = snapToStep(start + stepSign * delta, 1, min, max);

    container.innerHTML = '';
    container.classList.add('mcs-number-line', 'mcs-number-line-jump');

    var liveRegion = document.createElement('div');
    liveRegion.className = 'mcs-sr-live';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    container.appendChild(liveRegion);

    var boardWrap = document.createElement('div');
    boardWrap.className = 'mcs-number-line-board';
    boardWrap.setAttribute('role', 'application');
    boardWrap.setAttribute('aria-label', 'Number line jump track');
    boardWrap.tabIndex = 0;
    container.appendChild(boardWrap);

    var statusEl = document.createElement('div');
    statusEl.className = 'mcs-number-line-jump-status';
    container.appendChild(statusEl);

    var controls = document.createElement('div');
    controls.className = 'mcs-number-line-jump-controls';
    container.appendChild(controls);

    var hopBtn = document.createElement('button');
    hopBtn.type = 'button';
    hopBtn.className = 'btn-terminal mcs-number-line-hop-btn band-a-action-btn';
    hopBtn.textContent = direction === 'backward' ? '← Hop back' : 'Hop forward →';
    hopBtn.setAttribute(
      'aria-label',
      direction === 'backward' ? 'Hop one step back' : 'Hop one step forward'
    );
    controls.appendChild(hopBtn);

    var resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'btn-terminal mcs-number-line-jump-reset';
    resetBtn.textContent = '↺ Reset';
    resetBtn.setAttribute('aria-label', 'Return to start and try again');
    controls.appendChild(resetBtn);

    var boardWidth = container.clientWidth;
    if (!boardWidth && container.parentElement) {
      boardWidth = container.parentElement.clientWidth;
    }
    if (!boardWidth) boardWidth = 480;
    boardWrap.style.width = boardWidth + 'px';
    boardWrap.style.height = bandId === 'A' ? '150px' : '140px';
    void boardWrap.offsetHeight;

    var boardCtx = MCS.board.make(boardWrap, {
      boundingbox: numberLineBoundingBox(min, max),
      keepAspectRatio: false,
    });
    var board = boardCtx.board;
    var theme = boardCtx.theme;
    var labelFontSize = bandTokens.fontSizeMin;

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

    var tickSteps = max - min;
    var ti;
    for (ti = 0; ti <= tickSteps; ti++) {
      var iv = min + ti;
      board.create(
        'segment',
        [
          [iv, -0.4],
          [iv, 0.4],
        ],
        {
          strokeColor: theme.gridLine,
          strokeWidth: 1.5,
          fixed: true,
          highlight: false,
        }
      );
      MCS.board.label(boardCtx, [iv, -0.9], String(iv), {
        fontSize: labelFontSize,
        anchorY: 'top',
      });
    }

    var pinSize = Math.max(5, jxgSizeFromBand(bandId) + 1);
    var position = start;
    var hopsUsed = 0;
    var enabled = true;
    var changeCallbacks = [];
    var activeTween = null;
    var arcNodes = [];

    var token = MCS.board.point(boardCtx, {
      coords: [position, 0.55],
      size: pinSize,
      fixed: true,
      name: '',
    });

    board.create(
      'segment',
      [
        [function () {
          return token.X();
        }, 0.2],
        [function () {
          return token.X();
        }, 0.9],
      ],
      {
        strokeColor: theme.accent,
        strokeWidth: 2.5,
        fixed: true,
        highlight: false,
        layer: 2,
      }
    );

    function updateStatus() {
      statusEl.textContent =
        'You are on ' + position + '. Hop until you land on the answer, then tap CHECK.';
    }

    function announce() {
      liveRegion.textContent = 'On ' + position + (hopsUsed ? ' after ' + hopsUsed + ' hops' : '');
      updateStatus();
    }

    function fireChange() {
      changeCallbacks.forEach(function (cb) {
        try {
          cb(api.getValue());
        } catch (e) {
          console.warn('number-line jump onChange error', e);
        }
      });
    }

    function drawArc(fromX, toX) {
      var arc = board.create(
        'curve',
        [
          function (t) {
            return fromX + (toX - fromX) * t;
          },
          function (t) {
            return 0.35 + Math.sin(Math.PI * t) * 0.75;
          },
        ],
        {
          strokeColor: theme.accent,
          strokeWidth: 2,
          fixed: true,
          highlight: false,
        }
      );
      arcNodes.push(arc);
    }

    function setTokenX(x, animate, onComplete) {
      var targetX = snapToStep(x, 1, min, max);
      if (activeTween) activeTween.cancel();

      if (!animate || MCS.prefersReducedMotion()) {
        token.setPosition(JXG.COORDS_BY_USER, [targetX, 0.55]);
        position = targetX;
        board.update();
        announce();
        if (typeof onComplete === 'function') onComplete();
        return;
      }

      var startX = token.X();
      activeTween = MCS.tween({
        duration: 0.35,
        onUpdate: function (t) {
          var nx = startX + (targetX - startX) * t;
          var ny = 0.55 + Math.sin(Math.PI * t) * 0.35;
          token.setPosition(JXG.COORDS_BY_USER, [nx, ny]);
          board.update();
        },
        onComplete: function () {
          token.setPosition(JXG.COORDS_BY_USER, [targetX, 0.55]);
          position = targetX;
          board.update();
          announce();
          activeTween = null;
          if (typeof onComplete === 'function') onComplete();
        },
      });
    }

    function clearArcs() {
      arcNodes.forEach(function (node) {
        board.removeObject(node);
      });
      arcNodes.length = 0;
      board.update();
    }

    function resetJump() {
      if (activeTween) activeTween.cancel();
      clearArcs();
      position = start;
      hopsUsed = 0;
      setTokenX(start, false);
      hopBtn.disabled = !enabled;
      fireChange();
    }

    function doHop(animate) {
      if (!enabled) return;
      var next = position + stepSign;
      if (next < min || next > max) {
        MCS.audio.emit('tick');
        return;
      }
      var fromX = position;
      drawArc(fromX, next);
      hopsUsed += 1;
      MCS.audio.emit('snap');
      setTokenX(next, animate !== false, function () {
        fireChange();
      });
    }

    hopBtn.addEventListener('click', function () {
      doHop(true);
    });

    resetBtn.addEventListener('click', function () {
      if (!enabled) return;
      resetJump();
    });

    boardWrap.addEventListener('keydown', function (e) {
      if (!enabled) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        doHop(true);
      }
    });

    announce();
    hopBtn.disabled = false;

    var api = {
      getValue: function getValue() {
        return {
          mode: 'jump',
          position: position,
          start: start,
          target: target,
          hopsUsed: hopsUsed,
          delta: delta,
          direction: direction,
        };
      },

      setValue: function setValue(v) {
        if (!v) {
          resetJump();
          return;
        }
        if (v.reset) {
          resetJump();
          return;
        }
        if (v.start != null && v.position == null && !v.target) {
          start = snapToStep(v.start, 1, min, max);
          resetJump();
          return;
        }
        if (v.position != null || v.target != null) {
          clearArcs();
          var land = snapToStep(
            v.position != null ? v.position : v.target,
            1,
            min,
            max
          );
          position = land;
          hopsUsed = Math.abs(land - start);
          setTokenX(land, !MCS.prefersReducedMotion());
          fireChange();
        }
      },

      setEnabled: function setEnabled(on) {
        enabled = !!on;
        hopBtn.disabled = !enabled;
        resetBtn.disabled = !enabled;
        boardWrap.style.pointerEvents = enabled ? '' : 'none';
        boardWrap.style.opacity = enabled ? '1' : '0.65';
      },

      showSolution: function showSolution(v) {
        var goal = target;
        if (v && (v.position != null || v.target != null)) {
          goal = snapToStep(
            v.position != null ? v.position : v.target,
            1,
            min,
            max
          );
        }
        resetJump();
        var steps = Math.abs(goal - start);
        var sign = goal >= start ? 1 : -1;
        var i = 0;
        function nextHop() {
          if (i >= steps) {
            hopsUsed = steps;
            boardWrap.classList.add('mcs-number-line-solution-glow');
            window.setTimeout(function () {
              boardWrap.classList.remove('mcs-number-line-solution-glow');
            }, 900);
            fireChange();
            return;
          }
          i += 1;
          var fromX = position;
          var toX = position + sign;
          drawArc(fromX, toX);
          setTokenX(toX, !MCS.prefersReducedMotion(), nextHop);
        }
        nextHop();
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
        MCS.board.destroy(boardCtx);
        container.innerHTML = '';
        changeCallbacks.length = 0;
        MCS._releaseContainer(container);
      },
    };

    return api;
  }

  MCS.register('number-line', function numberLineFactory(container, config) {
    config = config || {};
    var mode = config.mode || 'place-point';
    if (mode === 'order-points') {
      return createOrderPointsLine(container, config);
    }
    if (mode === 'jump') {
      return createNumberLineJump(container, config);
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

    boardWrap.style.width = '100%';
    boardWrap.style.minWidth = '280px';
    boardWrap.style.height = '140px';
    void boardWrap.offsetHeight;

    var boardCtx = MCS.board.make(boardWrap, {
      boundingbox: numberLineBoundingBox(min, max),
      keepAspectRatio: false,
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
      var iv = snapToStep(min + ti * minorStep, minorStep, min, max);
      var major = isNumberLineMajorTick(iv, min, max, majorStep, minorStep);
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

      var isZero = Math.abs(iv) < minorStep / 2;
      var showLabel =
        labelMode !== 'none' &&
        (labelMode === 'all' ||
          (labelMode === 'major' && major) ||
          (labelMode === 'zero' && isZero));

      if (showLabel) {
        var labelText = formatOrderLineTickLabel(iv, minorStep);
        MCS.board.label(boardCtx, [iv, numberLineTickLabelY(major)], labelText, {
          fontSize: isZero && labelMode === 'zero' ? labelFontSize + 2 : labelFontSize + (major ? 1 : 0),
          anchorY: 'top',
          strokeColor: isZero && labelMode === 'zero' ? theme.accent : major ? theme.ink : undefined,
          cssStyle:
            'font-family:' +
            theme.fontMono +
            ';' +
            (major ? 'font-weight:700;' : ''),
        });
      }
    }

    if (labelMode === 'zero') {
      board.create(
        'segment',
        [
          [0, -0.62],
          [0, 0.62],
        ],
        {
          strokeColor: theme.accent,
          strokeWidth: 2.5,
          fixed: true,
          highlight: false,
        }
      );
    }

    // Pin stem + head — smaller head when minor ticks are dense (e.g. quarters)
    var pinSize =
      readOnly && minorStep <= 0.25
        ? Math.max(3, jxgSizeFromBand(bandId) - 1)
        : jxgSizeFromBand(bandId);
    var pin = MCS.board.point(boardCtx, {
      coords: [initialValue, 0],
      size: pinSize,
      snapToGrid: !readOnly,
      snapSizeX: snapStep,
      snapSizeY: 1,
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

    // -------------------------------------------------------------------------
    // counters — compare-zones (Phase 5.3 — F3 tap more/fewer)
    // -------------------------------------------------------------------------
    function countersCompareZones(container, config) {
      config = config || {};
      var bandId = config.band || 'A';
      var bandTokens = MCS.band(bandId);
      var zones = config.zones || [
        { id: 'left', label: 'Group A', count: 4 },
        { id: 'right', label: 'Group B', count: 6 },
      ];
      var compareWord = config.compare === 'fewer' ? 'fewer' : 'more';
      var radius = Math.max(16, bandTokens.objectSize / 3);
      var gap = 8;
      var theme = MCS.theme(true);
      var enabled = true;
      var selected = null;
      var changeCallbacks = [];

      container.innerHTML = '';
      container.classList.add('mcs-counters', 'mcs-counters-compare');

      var liveRegion = MCS.stage.ariaHost(container);
      var boardWrap = document.createElement('div');
      boardWrap.className = 'mcs-counters-board';
      boardWrap.setAttribute('role', 'application');
      boardWrap.setAttribute('aria-label', 'Compare two groups');
      container.appendChild(boardWrap);

      var stageWidth = Math.min(Math.max(usableWidth(container), 300), 520);
      var stageHeight = Math.round(stageWidth * 0.45);
      var padding = 12;
      var colGap = 12;
      var colWidth = (stageWidth - padding * 2 - colGap) / 2;

      var host = document.createElement('div');
      host.className = 'mcs-konva-host';
      host.style.width = stageWidth + 'px';
      host.style.height = stageHeight + 'px';
      boardWrap.appendChild(host);

      var stage = new Konva.Stage({ container: host, width: stageWidth, height: stageHeight });
      var bgLayer = new Konva.Layer();
      stage.add(bgLayer);

      var zoneRects = [];
      var zoneGroups = [];

      function slotCenters(rect, count) {
        var cols = Math.max(1, Math.floor(rect.width / (radius * 2 + gap)));
        var rows = Math.max(1, Math.ceil(count / cols));
        var cellW = rect.width / cols;
        var cellH = rect.height / rows;
        var centres = [];
        var i;
        for (i = 0; i < count; i++) {
          var col = i % cols;
          var row = Math.floor(i / cols);
          centres.push({
            x: rect.x + cellW * col + cellW / 2,
            y: rect.y + cellH * row + cellH / 2,
          });
        }
        return centres;
      }

      function drawCompare() {
        bgLayer.destroyChildren();
        zoneRects.length = 0;
        zoneGroups.length = 0;
        zones.forEach(function (z, zi) {
          var rect = {
            x: padding + zi * (colWidth + colGap),
            y: padding,
            width: colWidth,
            height: stageHeight - padding * 2 - 28,
          };
          zoneRects.push(rect);
          var group = new Konva.Group({ name: 'zone-' + z.id });
          var bg = new Konva.Rect({
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
            fill: selected === z.id ? theme.accentSoft : '#ffffff',
            stroke: selected === z.id ? theme.accent : theme.gridLine,
            strokeWidth: selected === z.id ? 3 : 1.5,
            cornerRadius: 12,
          });
          var label = new Konva.Text({
            x: rect.x,
            y: rect.y + rect.height + 4,
            width: rect.width,
            align: 'center',
            text: z.label || z.id,
            fontSize: 14,
            fontFamily: theme.fontBody,
            fill: theme.ink,
            listening: false,
          });
          group.add(bg);
          group.add(label);
          var slots = slotCenters(rect, z.count || 0);
          var di;
          for (di = 0; di < (z.count || 0); di++) {
            var dot = new Konva.Circle({
              x: slots[di].x,
              y: slots[di].y,
              radius: radius,
              fill: theme.accent,
              stroke: theme.ink,
              strokeWidth: 1,
              listening: false,
            });
            group.add(dot);
          }
          group.on('click tap', function () {
            if (!enabled) return;
            selected = z.id;
            MCS.audio.emit('tick');
            drawCompare();
            notifyChange();
          });
          bgLayer.add(group);
          zoneGroups.push(group);
        });
        bgLayer.batchDraw();
      }

      function announce() {
        if (!selected) {
          liveRegion.textContent = 'Tap the group with ' + compareWord + ' satellites';
          return;
        }
        var z;
        for (var zi = 0; zi < zones.length; zi++) {
          if (zones[zi].id === selected) {
            z = zones[zi];
            break;
          }
        }
        liveRegion.textContent = 'Selected ' + (z && z.label ? z.label : selected);
      }

      function notifyChange() {
        announce();
        changeCallbacks.forEach(function (cb) {
          try {
            cb(api.getValue());
          } catch (e) {
            console.warn('counters compare onChange error', e);
          }
        });
      }

      drawCompare();

      var api = {
        getValue: function getValue() {
          return { selected: selected, mode: 'compare-zones' };
        },
        setValue: function setValue(v) {
          selected = v && v.selected != null ? v.selected : null;
          drawCompare();
          notifyChange();
        },
        setEnabled: function setEnabled(on) {
          enabled = !!on;
          boardWrap.style.opacity = enabled ? '1' : '0.65';
        },
        showSolution: function showSolution(v) {
          api.setValue(v || {});
          boardWrap.classList.add('mcs-counters-solution-glow');
          window.setTimeout(function () {
            boardWrap.classList.remove('mcs-counters-solution-glow');
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
        onChange: function onChange(cb) {
          if (typeof cb === 'function') changeCallbacks.push(cb);
        },
        destroy: function destroy() {
          stage.destroy();
          container.innerHTML = '';
          changeCallbacks.length = 0;
          MCS._releaseContainer(container);
        },
      };

      notifyChange();
      return api;
    }

    // -------------------------------------------------------------------------
    // counters — make-equal-groups (Phase 5.3 — F5 fair share)
    // -------------------------------------------------------------------------
    function countersMakeEqualGroups(container, config) {
      config = config || {};
      var bandId = config.band || 'A';
      var bandTokens = MCS.band(bandId);
      var zones = config.zones || [
        { id: 'roverA', label: 'Rover A', capacity: 12 },
        { id: 'roverB', label: 'Rover B', capacity: 12 },
      ];
      var total = config.total != null ? config.total : 8;
      var gap = bandId === 'A' ? 10 : 8;
      var radius = Math.max(20, bandTokens.objectSize / 2);
      var theme = MCS.theme(true);
      var enabled = true;
      var changeCallbacks = [];

      container.innerHTML = '';
      container.classList.add('mcs-counters', 'mcs-counters-share');

      var liveRegion = MCS.stage.ariaHost(container);
      zones.forEach(function (z) {
        var lbl = document.createElement('div');
        lbl.className = 'mcs-counters-zone-label';
        lbl.textContent = z.label || z.id;
        lbl.dataset.zoneId = z.id;
        container.appendChild(lbl);
      });

      var boardWrap = document.createElement('div');
      boardWrap.className = 'mcs-counters-board';
      boardWrap.setAttribute('role', 'application');
      boardWrap.setAttribute('aria-label', 'Share counters equally between rovers');
      container.appendChild(boardWrap);

      var trayLabel = document.createElement('div');
      trayLabel.className = 'mcs-counters-tray-label';
      trayLabel.textContent = 'Fuel cells — drag to rovers';
      container.appendChild(trayLabel);

      var resetBtn = document.createElement('button');
      resetBtn.type = 'button';
      resetBtn.className = 'btn-terminal mcs-counters-reset';
      resetBtn.textContent = '↺ Reset';
      container.appendChild(resetBtn);

      var stageWidth = Math.min(Math.max(usableWidth(container), 300), 520);
      var zoneBandHeight = Math.round(stageWidth * 0.38);
      var trayHeight = Math.round(stageWidth * 0.28);
      var stageHeight = zoneBandHeight + trayHeight + 16;
      var padding = 12;
      var colGap = 12;
      var colWidth = (stageWidth - padding * 2 - colGap) / zones.length;

      var host = document.createElement('div');
      host.className = 'mcs-konva-host';
      host.style.width = stageWidth + 'px';
      host.style.height = stageHeight + 'px';
      boardWrap.appendChild(host);

      var stage = new Konva.Stage({ container: host, width: stageWidth, height: stageHeight });
      var bgLayer = new Konva.Layer();
      var objLayer = new Konva.Layer();
      stage.add(bgLayer);
      stage.add(objLayer);

      var zoneRects = [];
      var zoneSlotsMap = {};
      var trayRect = {
        x: padding,
        y: zoneBandHeight + 8,
        width: stageWidth - padding * 2,
        height: trayHeight - 8,
      };

      function slotCenters(rect, count) {
        var cols = Math.max(1, Math.floor(rect.width / (radius * 2 + gap)));
        var rows = Math.max(1, Math.ceil(count / cols));
        var cellW = rect.width / cols;
        var cellH = rect.height / rows;
        var centres = [];
        var i;
        for (i = 0; i < count; i++) {
          var col = i % cols;
          var row = Math.floor(i / cols);
          centres.push({
            x: rect.x + cellW * col + cellW / 2,
            y: rect.y + cellH * row + cellH / 2,
          });
        }
        return centres;
      }

      zones.forEach(function (z, zi) {
        var rect = {
          x: padding + zi * (colWidth + colGap),
          y: padding,
          width: colWidth,
          height: zoneBandHeight - padding - 4,
          id: z.id,
        };
        zoneRects.push(rect);
        zoneSlotsMap[z.id] = slotCenters(rect, z.capacity || total);
      });
      var traySlots = slotCenters(trayRect, total);

      function drawBgs() {
        bgLayer.destroyChildren();
        zoneRects.forEach(function (rect) {
          bgLayer.add(
            new Konva.Rect({
              x: rect.x,
              y: rect.y,
              width: rect.width,
              height: rect.height,
              fill: theme.accentSoft,
              stroke: theme.accent,
              strokeWidth: 2,
              cornerRadius: 12,
              listening: false,
            })
          );
        });
        bgLayer.add(
          new Konva.Rect({
            x: trayRect.x,
            y: trayRect.y,
            width: trayRect.width,
            height: trayRect.height,
            fill: '#f8fafc',
            stroke: theme.gridLine,
            strokeWidth: 1.5,
            dash: [8, 6],
            cornerRadius: 10,
            listening: false,
          })
        );
        bgLayer.batchDraw();
      }

      var pieces = [];
      var i;
      for (i = 0; i < total; i++) {
        pieces.push({ id: i, zoneId: 'tray', slot: i, node: null });
      }

      function zoneForPoint(cx, cy) {
        var zi;
        for (zi = 0; zi < zoneRects.length; zi++) {
          var r = zoneRects[zi];
          if (cx >= r.x && cx <= r.x + r.width && cy >= r.y && cy <= r.y + r.height) {
            return r.id;
          }
        }
        if (
          cx >= trayRect.x &&
          cx <= trayRect.x + trayRect.width &&
          cy >= trayRect.y &&
          cy <= trayRect.y + trayRect.height
        ) {
          return 'tray';
        }
        return null;
      }

      function positionForPiece(piece) {
        if (piece.zoneId === 'tray') {
          return traySlots[Math.min(piece.slot, traySlots.length - 1)];
        }
        var slots = zoneSlotsMap[piece.zoneId] || traySlots;
        return slots[Math.min(piece.slot, slots.length - 1)];
      }

      function relayoutAll() {
        pieces.forEach(function (piece) {
          if (!piece.node) return;
          var pos = positionForPiece(piece);
          piece.node.position(pos);
        });
        objLayer.batchDraw();
      }

      function announceShare() {
        var val = api.getValue();
        var parts = zones
          .map(function (z) {
            return (z.label || z.id) + ': ' + (val[z.id] || 0);
          })
          .join(', ');
        liveRegion.textContent = parts + '. ' + val.placed + ' of ' + total + ' shared.';
      }

      function notifyChange() {
        announceShare();
        changeCallbacks.forEach(function (cb) {
          try {
            cb(api.getValue());
          } catch (e) {
            console.warn('counters share onChange error', e);
          }
        });
      }

      function assignSlot(zoneId, excludeId) {
        return pieces.filter(function (p) {
          return p.zoneId === zoneId && p.id !== excludeId;
        }).length;
      }

      function makeCounterNode(piece) {
        var pos = positionForPiece(piece);
        var group = new Konva.Group({ x: pos.x, y: pos.y, name: 'fuel-' + piece.id });
        group.add(
          new Konva.Circle({
            radius: radius,
            fill: theme.accent,
            stroke: theme.ink,
            strokeWidth: 1.5,
          })
        );
        piece.node = group;
        objLayer.add(group);
        MCS.stage.draggable(group, {
          enabled: enabled,
          onSnap: function onSnap(node) {
            var target = zoneForPoint(node.x(), node.y()) || piece.zoneId;
            if (target !== 'tray') {
              var cap = total;
              var occ = assignSlot(target, piece.id);
              if (piece.zoneId !== target) occ += 1;
              if (occ > cap) target = 'tray';
            }
            piece.zoneId = target;
            piece.slot = assignSlot(target, piece.id);
            var snapPos = positionForPiece(piece);
            if (!MCS.prefersReducedMotion()) {
              node.to({ x: snapPos.x, y: snapPos.y, duration: 0.12, onFinish: notifyChange });
            } else {
              node.position(snapPos);
              notifyChange();
            }
          },
          onChange: function () {},
        });
      }

      drawBgs();
      for (i = 0; i < pieces.length; i++) makeCounterNode(pieces[i]);
      objLayer.batchDraw();

      function resetToTray() {
        pieces.forEach(function (piece, idx) {
          piece.zoneId = 'tray';
          piece.slot = idx;
        });
        relayoutAll();
        notifyChange();
      }

      resetBtn.addEventListener('click', function () {
        if (!enabled) return;
        resetToTray();
      });

      var api = {
        getValue: function getValue() {
          var result = { unplaced: 0, placed: 0, mode: 'make-equal-groups' };
          zones.forEach(function (z) {
            result[z.id] = 0;
          });
          pieces.forEach(function (piece) {
            if (piece.zoneId === 'tray') result.unplaced += 1;
            else {
              result[piece.zoneId] = (result[piece.zoneId] || 0) + 1;
              result.placed += 1;
            }
          });
          return result;
        },
        setValue: function setValue(v) {
          if (!v) {
            resetToTray();
            return;
          }
          var perZone = {};
          var assigned = 0;
          zones.forEach(function (z) {
            if (v[z.id] != null) {
              perZone[z.id] = v[z.id];
              assigned += v[z.id];
            }
          });
          if (assigned === 0) {
            resetToTray();
            return;
          }
          var idx = 0;
          zones.forEach(function (z) {
            var n = perZone[z.id] || 0;
            var j;
            for (j = 0; j < n; j++) {
              if (idx < pieces.length) {
                pieces[idx].zoneId = z.id;
                pieces[idx].slot = j;
                idx += 1;
              }
            }
          });
          for (; idx < pieces.length; idx++) {
            pieces[idx].zoneId = 'tray';
            pieces[idx].slot = idx - assigned;
          }
          relayoutAll();
          notifyChange();
        },
        setEnabled: function setEnabled(on) {
          enabled = !!on;
          pieces.forEach(function (p) {
            if (p.node) p.node.draggable(enabled);
          });
          resetBtn.disabled = !enabled;
        },
        showSolution: function showSolution(v) {
          if (!v) v = {};
          var each = Math.floor(total / zones.length);
          var showVal = {};
          zones.forEach(function (z) {
            showVal[z.id] = v[z.id] != null ? v[z.id] : each;
          });
          api.setValue(showVal);
          boardWrap.classList.add('mcs-counters-solution-glow');
          window.setTimeout(function () {
            boardWrap.classList.remove('mcs-counters-solution-glow');
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
        onChange: function onChange(cb) {
          if (typeof cb === 'function') changeCallbacks.push(cb);
        },
        destroy: function destroy() {
          stage.destroy();
          container.innerHTML = '';
          changeCallbacks.length = 0;
          MCS._releaseContainer(container);
        },
      };

      notifyChange();
      return api;
    }

    // -------------------------------------------------------------------------
    // counters — money-make (Phase 5.11f — Y2-4 coin amount)
    // -------------------------------------------------------------------------
    function countersMoneyMake(container, config) {
      config = config || {};
      var bandId = config.band || 'B';
      var bandTokens = MCS.band(bandId);
      var theme = MCS.theme(true);
      var coinDefs = config.coins || [
        { id: '5c', value: 5, label: '5c', color: '#cbd5e1', stroke: '#64748b', max: 6 },
        { id: '10c', value: 10, label: '10c', color: '#e2e8f0', stroke: '#475569', max: 6 },
        { id: '20c', value: 20, label: '20c', color: '#f1f5f9', stroke: '#334155', max: 4 },
        { id: '50c', value: 50, label: '50c', color: '#dbeafe', stroke: '#1e40af', max: 4 },
        { id: '1d', value: 100, label: '$1', color: '#fde68a', stroke: '#b45309', max: 2 },
        { id: '2d', value: 200, label: '$2', color: '#fcd34d', stroke: '#92400e', max: 1 },
      ];
      var gap = bandId === 'A' ? 10 : 8;
      var radius = Math.max(22, bandTokens.objectSize / 2.4);
      var enabled = true;
      var changeCallbacks = [];

      container.innerHTML = '';
      container.classList.add('mcs-counters', 'mcs-counters-money');

      var liveRegion = MCS.stage.ariaHost(container);
      var zoneLabel = document.createElement('div');
      zoneLabel.className = 'mcs-counters-zone-label';
      zoneLabel.textContent = config.zoneLabel || 'Payment zone';
      container.appendChild(zoneLabel);

      var totalEl = document.createElement('div');
      totalEl.className = 'mcs-counters-money-total';
      totalEl.setAttribute('aria-live', 'polite');
      container.appendChild(totalEl);

      var boardWrap = document.createElement('div');
      boardWrap.className = 'mcs-counters-board';
      boardWrap.setAttribute('role', 'application');
      boardWrap.setAttribute('aria-label', 'Drag coins into the payment zone to make the amount');
      container.appendChild(boardWrap);

      var trayLabel = document.createElement('div');
      trayLabel.className = 'mcs-counters-tray-label';
      trayLabel.textContent = 'Coin tray — drag coins up';
      container.appendChild(trayLabel);

      var resetBtn = document.createElement('button');
      resetBtn.type = 'button';
      resetBtn.className = 'btn-terminal mcs-counters-reset';
      resetBtn.textContent = '↺ Reset';
      container.appendChild(resetBtn);

      var stageWidth = Math.min(Math.max(usableWidth(container), 300), 520);
      var zoneHeight = Math.round(stageWidth * 0.34);
      var trayHeight = Math.round(stageWidth * 0.42);
      var stageHeight = zoneHeight + trayHeight + 16;
      var padding = 12;

      var host = document.createElement('div');
      host.className = 'mcs-konva-host';
      host.style.width = stageWidth + 'px';
      host.style.height = stageHeight + 'px';
      boardWrap.appendChild(host);

      var stage = new Konva.Stage({ container: host, width: stageWidth, height: stageHeight });
      var bgLayer = new Konva.Layer();
      var objLayer = new Konva.Layer();
      stage.add(bgLayer);
      stage.add(objLayer);

      var zoneRect = {
        x: padding,
        y: padding,
        width: stageWidth - padding * 2,
        height: zoneHeight - padding,
      };
      var trayRect = {
        x: padding,
        y: zoneHeight + 8,
        width: stageWidth - padding * 2,
        height: trayHeight - 8,
      };

      function slotCenters(rect, count) {
        var cols = Math.max(1, Math.floor(rect.width / (radius * 2 + gap)));
        var rows = Math.max(1, Math.ceil(count / cols));
        var cellW = rect.width / cols;
        var cellH = rect.height / rows;
        var centres = [];
        var i;
        for (i = 0; i < count; i++) {
          var col = i % cols;
          var row = Math.floor(i / cols);
          centres.push({
            x: rect.x + cellW * col + cellW / 2,
            y: rect.y + cellH * row + cellH / 2,
          });
        }
        return centres;
      }

      var zoneCapacity = 12;
      var zoneSlots = slotCenters(zoneRect, zoneCapacity);
      var pieces = [];
      var pieceId = 0;
      coinDefs.forEach(function (def) {
        var max = def.max != null ? def.max : 4;
        var traySlots = slotCenters(trayRect, max);
        var ti;
        for (ti = 0; ti < max; ti++) {
          pieces.push({
            id: pieceId,
            coinId: def.id,
            value: def.value,
            label: def.label,
            color: def.color,
            stroke: def.stroke,
            zoneId: 'tray',
            slot: ti,
            traySlot: traySlots[ti],
            node: null,
          });
          pieceId += 1;
        }
      });

      function drawBgs() {
        bgLayer.destroyChildren();
        bgLayer.add(
          new Konva.Rect({
            x: zoneRect.x,
            y: zoneRect.y,
            width: zoneRect.width,
            height: zoneRect.height,
            fill: theme.accentSoft,
            stroke: theme.accent,
            strokeWidth: 2,
            cornerRadius: 12,
            listening: false,
          })
        );
        bgLayer.add(
          new Konva.Rect({
            x: trayRect.x,
            y: trayRect.y,
            width: trayRect.width,
            height: trayRect.height,
            fill: '#f8fafc',
            stroke: theme.gridLine,
            strokeWidth: 1.5,
            dash: [8, 6],
            cornerRadius: 10,
            listening: false,
          })
        );
        bgLayer.batchDraw();
      }

      function zoneForPoint(cx, cy) {
        if (
          cx >= zoneRect.x &&
          cx <= zoneRect.x + zoneRect.width &&
          cy >= zoneRect.y &&
          cy <= zoneRect.y + zoneRect.height
        ) {
          return 'payment';
        }
        if (
          cx >= trayRect.x &&
          cx <= trayRect.x + trayRect.width &&
          cy >= trayRect.y &&
          cy <= trayRect.y + trayRect.height
        ) {
          return 'tray';
        }
        return null;
      }

      function positionForPiece(piece) {
        if (piece.zoneId === 'payment') {
          return zoneSlots[Math.min(piece.slot, zoneSlots.length - 1)];
        }
        return piece.traySlot;
      }

      function formatCents(cents) {
        if (cents >= 100) {
          var dollars = Math.floor(cents / 100);
          var rem = cents % 100;
          return rem ? '$' + dollars + '.' + String(rem).padStart(2, '0') : '$' + dollars;
        }
        return cents + 'c';
      }

      function totalCents() {
        var sum = 0;
        pieces.forEach(function (p) {
          if (p.zoneId === 'payment') sum += p.value;
        });
        return sum;
      }

      function announceMoney() {
        var total = totalCents();
        totalEl.textContent = 'Total: ' + formatCents(total);
        liveRegion.textContent =
          total === 0
            ? 'No coins in the payment zone yet'
            : 'Payment zone total ' + formatCents(total);
      }

      function notifyChange() {
        announceMoney();
        changeCallbacks.forEach(function (cb) {
          try {
            cb(api.getValue());
          } catch (e) {
            console.warn('counters money onChange error', e);
          }
        });
      }

      function assignSlot(zoneId, excludeId) {
        return pieces.filter(function (p) {
          return p.zoneId === zoneId && p.id !== excludeId;
        }).length;
      }

      function makeCoinNode(piece) {
        var pos = positionForPiece(piece);
        var group = new Konva.Group({ x: pos.x, y: pos.y, name: 'coin-' + piece.id });
        group.add(
          new Konva.Circle({
            radius: radius,
            fill: piece.color,
            stroke: piece.stroke,
            strokeWidth: 2,
          })
        );
        group.add(
          new Konva.Text({
            text: piece.label,
            fontSize: Math.max(11, radius * 0.55),
            fontStyle: 'bold',
            fill: theme.ink,
            align: 'center',
            verticalAlign: 'middle',
            width: radius * 2,
            height: radius * 2,
            offsetX: radius,
            offsetY: radius,
            listening: false,
          })
        );
        piece.node = group;
        objLayer.add(group);
        MCS.stage.draggable(group, {
          enabled: enabled,
          onSnap: function onSnap(node) {
            var target = zoneForPoint(node.x(), node.y()) || piece.zoneId;
            if (target === 'payment') {
              var occ = assignSlot('payment', piece.id);
              if (piece.zoneId !== 'payment') occ += 1;
              if (occ > zoneCapacity) target = 'tray';
            }
            piece.zoneId = target;
            piece.slot = assignSlot(target, piece.id);
            var snapPos = positionForPiece(piece);
            if (!MCS.prefersReducedMotion()) {
              node.to({ x: snapPos.x, y: snapPos.y, duration: 0.12, onFinish: notifyChange });
            } else {
              node.position(snapPos);
              notifyChange();
            }
          },
          onChange: function () {},
        });
      }

      function relayoutAll() {
        pieces.forEach(function (piece) {
          if (!piece.node) return;
          piece.node.position(positionForPiece(piece));
        });
        objLayer.batchDraw();
      }

      function resetToTray() {
        var trayCounts = {};
        pieces.forEach(function (piece) {
          trayCounts[piece.coinId] = (trayCounts[piece.coinId] || 0) + 1;
          piece.zoneId = 'tray';
          piece.slot = trayCounts[piece.coinId] - 1;
        });
        relayoutAll();
        notifyChange();
      }

      drawBgs();
      pieces.forEach(makeCoinNode);
      objLayer.batchDraw();

      resetBtn.addEventListener('click', function () {
        if (!enabled) return;
        resetToTray();
      });

      var api = {
        getValue: function getValue() {
          var result = { totalCents: totalCents(), payment: 0, mode: 'money-make' };
          coinDefs.forEach(function (def) {
            result[def.id] = 0;
          });
          pieces.forEach(function (piece) {
            if (piece.zoneId === 'payment') {
              result.payment += 1;
              result[piece.coinId] = (result[piece.coinId] || 0) + 1;
            }
          });
          return result;
        },
        setValue: function setValue(v) {
          if (!v || v.reset) {
            resetToTray();
            return;
          }
          resetToTray();
          coinDefs.forEach(function (def) {
            var n = v[def.id] || 0;
            var placed = 0;
            pieces.forEach(function (piece) {
              if (piece.coinId === def.id && piece.zoneId === 'tray' && placed < n) {
                piece.zoneId = 'payment';
                piece.slot = assignSlot('payment', piece.id);
                placed += 1;
              }
            });
          });
          relayoutAll();
          notifyChange();
        },
        setEnabled: function setEnabled(on) {
          enabled = !!on;
          pieces.forEach(function (p) {
            if (p.node) p.node.draggable(enabled);
          });
          resetBtn.disabled = !enabled;
        },
        showSolution: function showSolution(v) {
          api.setValue(v || {});
          boardWrap.classList.add('mcs-counters-solution-glow');
          window.setTimeout(function () {
            boardWrap.classList.remove('mcs-counters-solution-glow');
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
        onChange: function onChange(cb) {
          if (typeof cb === 'function') changeCallbacks.push(cb);
        },
        destroy: function destroy() {
          stage.destroy();
          container.innerHTML = '';
          changeCallbacks.length = 0;
          MCS._releaseContainer(container);
        },
      };

      notifyChange();
      return api;
    }

    // -------------------------------------------------------------------------
    // counters (Phase 5 — Band A manipulative, free-count pilot)
    // -------------------------------------------------------------------------
    MCS.register('counters', function countersFactory(container, config) {
      config = config || {};
      var mode = config.mode || 'free-count';
      if (mode === 'compare-zones') return countersCompareZones(container, config);
      if (mode === 'make-equal-groups') return countersMakeEqualGroups(container, config);
      if (mode === 'money-make') return countersMoneyMake(container, config);
      var bandId = config.band || 'A';
      var bandTokens = MCS.band(bandId);
      var zones = config.zones || [{ id: 'bay', label: 'Docking Bay', capacity: 20 }];
      var maxSupply = config.maxSupply != null ? config.maxSupply : 20;
      var gap = bandId === 'A' ? 10 : 8;
      var radius = Math.max(22, bandTokens.objectSize / 2);

      container.innerHTML = '';
      container.classList.add('mcs-counters');

      var liveRegion = MCS.stage.ariaHost(container);
      var boardWrap = document.createElement('div');
      boardWrap.className = 'mcs-counters-board';
      boardWrap.setAttribute('role', 'application');
      boardWrap.setAttribute('aria-label', 'Counter tray and drop zones');
      boardWrap.tabIndex = 0;

      var zoneLabel = document.createElement('div');
      zoneLabel.className = 'mcs-counters-zone-label';
      zoneLabel.textContent = zones[0] && zones[0].label ? zones[0].label : 'Drop zone';
      container.appendChild(zoneLabel);
      container.appendChild(boardWrap);

      var trayLabel = document.createElement('div');
      trayLabel.className = 'mcs-counters-tray-label';
      trayLabel.textContent = 'Satellite tray';
      container.appendChild(trayLabel);

      var resetBtn = null;
      if (bandId === 'A' || bandId === 'B') {
        resetBtn = document.createElement('button');
        resetBtn.type = 'button';
        resetBtn.className = 'btn-terminal mcs-counters-reset';
        resetBtn.textContent = '↺ Reset';
        resetBtn.setAttribute('aria-label', 'Reset all counters to the tray');
        container.appendChild(resetBtn);
      }

      var theme = MCS.theme(true);
      var enabled = true;
      var changeCallbacks = [];
      var stageWidth = Math.min(Math.max(usableWidth(container), 280), 520);
      var zoneHeight = Math.round(stageWidth * 0.42);
      var trayHeight = Math.round(stageWidth * 0.32);
      var stageHeight = zoneHeight + trayHeight + 16;
      var padding = 12;

      var host = document.createElement('div');
      host.className = 'mcs-konva-host';
      host.style.width = stageWidth + 'px';
      host.style.height = stageHeight + 'px';
      boardWrap.appendChild(host);

      var stage = new Konva.Stage({ container: host, width: stageWidth, height: stageHeight });
      var bgLayer = new Konva.Layer();
      var objLayer = new Konva.Layer();
      stage.add(bgLayer);
      stage.add(objLayer);

      var zoneRect = {
        x: padding,
        y: padding,
        width: stageWidth - padding * 2,
        height: zoneHeight - padding,
      };
      var trayRect = {
        x: padding,
        y: zoneHeight + 8,
        width: stageWidth - padding * 2,
        height: trayHeight - 8,
      };

      var zoneBg = new Konva.Rect({
        x: zoneRect.x,
        y: zoneRect.y,
        width: zoneRect.width,
        height: zoneRect.height,
        fill: theme.accentSoft,
        stroke: theme.accent,
        strokeWidth: 2,
        cornerRadius: 12,
        listening: false,
      });
      var trayBg = new Konva.Rect({
        x: trayRect.x,
        y: trayRect.y,
        width: trayRect.width,
        height: trayRect.height,
        fill: '#f8fafc',
        stroke: theme.gridLine,
        strokeWidth: 1.5,
        dash: [8, 6],
        cornerRadius: 10,
        listening: false,
      });
      bgLayer.add(zoneBg);
      bgLayer.add(trayBg);

      function slotCenters(rect, count) {
        var cols = Math.max(1, Math.floor(rect.width / (radius * 2 + gap)));
        var rows = Math.max(1, Math.ceil(count / cols));
        var cellW = rect.width / cols;
        var cellH = rect.height / rows;
        var centres = [];
        var i;
        for (i = 0; i < count; i++) {
          var col = i % cols;
          var row = Math.floor(i / cols);
          centres.push({
            x: rect.x + cellW * col + cellW / 2,
            y: rect.y + cellH * row + cellH / 2,
          });
        }
        return centres;
      }

      var zoneSlots = slotCenters(zoneRect, zones[0].capacity || maxSupply);
      var traySlots = slotCenters(trayRect, maxSupply);

      var pieces = [];
      var i;
      for (i = 0; i < maxSupply; i++) {
        pieces.push({
          id: i,
          zoneId: 'tray',
          slot: i,
          node: null,
        });
      }

      function announceCount() {
        var val = instanceApi.getValue();
        var primary = zones[0] && zones[0].id ? zones[0].id : 'bay';
        var n = val[primary] || 0;
        liveRegion.textContent =
          n === 0
            ? 'No counters in the bay'
            : n === 1
              ? 'One counter in the bay'
              : n + ' counters in the bay';
      }

      function notifyChange() {
        announceCount();
        changeCallbacks.forEach(function (cb) {
          try {
            cb(instanceApi.getValue());
          } catch (e) {
            console.warn('counters onChange error', e);
          }
        });
      }

      function positionForPiece(piece) {
        var slots = piece.zoneId === 'tray' ? traySlots : zoneSlots;
        var idx = Math.min(piece.slot, slots.length - 1);
        return slots[idx];
      }

      function makeCounterNode(piece) {
        var pos = positionForPiece(piece);
        var group = new Konva.Group({ x: pos.x, y: pos.y, name: 'counter-' + piece.id });
        var body = new Konva.Circle({
          radius: radius,
          fill: theme.accent,
          stroke: theme.ink,
          strokeWidth: 1.5,
          shadowColor: '#000',
          shadowBlur: 4,
          shadowOpacity: 0.12,
          offsetX: 0,
          offsetY: 0,
        });
        var dish = new Konva.Line({
          points: [-radius * 0.55, 0, radius * 0.55, 0, 0, radius * 0.35],
          closed: true,
          fill: theme.accentSoft,
          stroke: theme.ink,
          strokeWidth: 1,
          listening: false,
        });
        group.add(body);
        group.add(dish);
        group.offset({ x: 0, y: 0 });
        piece.node = group;
        objLayer.add(group);

        MCS.stage.draggable(group, {
          enabled: enabled,
          onSnap: function onSnap(node) {
            var cx = node.x();
            var cy = node.y();
            var inZone =
              cx >= zoneRect.x &&
              cx <= zoneRect.x + zoneRect.width &&
              cy >= zoneRect.y &&
              cy <= zoneRect.y + zoneRect.height;
            var inTray =
              cx >= trayRect.x &&
              cx <= trayRect.x + trayRect.width &&
              cy >= trayRect.y &&
              cy <= trayRect.y + trayRect.height;
            var targetZone = inZone ? zones[0].id : inTray ? 'tray' : piece.zoneId;
            var zonePieces = pieces.filter(function (p) {
              return p.zoneId === targetZone;
            });
            var slot = zonePieces.length;
            if (targetZone !== 'tray') {
              var occupied = pieces.filter(function (p) {
                return p.zoneId === targetZone;
              }).length;
              if (piece.zoneId !== targetZone) occupied += 1;
              var cap = zones[0].capacity || zoneSlots.length;
              if (occupied > cap) {
                targetZone = 'tray';
              }
            }
            if (targetZone === 'tray') {
              piece.zoneId = 'tray';
              piece.slot = pieces.filter(function (p) {
                return p.zoneId === 'tray' && p.id !== piece.id;
              }).length;
            } else {
              piece.zoneId = targetZone;
              piece.slot = pieces.filter(function (p) {
                return p.zoneId === targetZone && p.id !== piece.id;
              }).length;
            }
            var snapPos = positionForPiece(piece);
            if (!MCS.prefersReducedMotion()) {
              node.to({
                x: snapPos.x,
                y: snapPos.y,
                duration: 0.12,
                onFinish: notifyChange,
              });
            } else {
              node.position(snapPos);
              notifyChange();
            }
          },
          onChange: function () {},
        });
      }

      for (i = 0; i < pieces.length; i++) {
        makeCounterNode(pieces[i]);
      }
      bgLayer.draw();
      objLayer.draw();

      function relayoutAll() {
        pieces.forEach(function (piece) {
          if (!piece.node) return;
          var pos = positionForPiece(piece);
          piece.node.position(pos);
        });
        objLayer.batchDraw();
      }

      function resetToTray() {
        pieces.forEach(function (piece, idx) {
          piece.zoneId = 'tray';
          piece.slot = idx;
        });
        relayoutAll();
        notifyChange();
      }

      if (resetBtn) {
        resetBtn.addEventListener('click', function () {
          if (!enabled) return;
          resetToTray();
        });
      }

      var resizeHandle = MCS.observeResize(container, function () {
        stageWidth = Math.min(Math.max(usableWidth(container), 280), 520);
        zoneHeight = Math.round(stageWidth * 0.42);
        trayHeight = Math.round(stageWidth * 0.32);
        stageHeight = zoneHeight + trayHeight + 16;
        host.style.width = stageWidth + 'px';
        host.style.height = stageHeight + 'px';
        stage.width(stageWidth);
        stage.height(stageHeight);
        zoneRect.width = stageWidth - padding * 2;
        zoneRect.height = zoneHeight - padding;
        trayRect.y = zoneHeight + 8;
        trayRect.width = stageWidth - padding * 2;
        trayRect.height = trayHeight - 8;
        zoneBg.width(zoneRect.width);
        zoneBg.height(zoneRect.height);
        trayBg.x(trayRect.x);
        trayBg.y(trayRect.y);
        trayBg.width(trayRect.width);
        trayBg.height(trayRect.height);
        zoneSlots = slotCenters(zoneRect, zones[0].capacity || maxSupply);
        traySlots = slotCenters(trayRect, maxSupply);
        relayoutAll();
        bgLayer.batchDraw();
      });

      var instanceApi = {
        getValue: function getValue() {
          var result = { unplaced: 0, placed: 0 };
          zones.forEach(function (z) {
            result[z.id] = 0;
          });
          pieces.forEach(function (piece) {
            if (piece.zoneId === 'tray') {
              result.unplaced += 1;
            } else {
              result[piece.zoneId] = (result[piece.zoneId] || 0) + 1;
              result.placed += 1;
            }
          });
          if (mode === 'free-count' && zones[0]) {
            result.placed = result[zones[0].id] || 0;
          }
          return result;
        },

        setValue: function setValue(v) {
          if (!v) return;
          var targetZone = zones[0] && zones[0].id ? zones[0].id : 'bay';
          var targetCount = v[targetZone] != null ? v[targetZone] : v.placed != null ? v.placed : 0;
          targetCount = Math.max(0, Math.min(targetCount, maxSupply));
          pieces.forEach(function (piece, idx) {
            piece.zoneId = idx < targetCount ? targetZone : 'tray';
            piece.slot =
              piece.zoneId === 'tray'
                ? idx - targetCount
                : pieces.slice(0, idx).filter(function (p) {
                    return p.zoneId === targetZone;
                  }).length;
          });
          relayoutAll();
          notifyChange();
        },

        setEnabled: function setEnabled(on) {
          enabled = !!on;
          pieces.forEach(function (piece) {
            if (piece.node) piece.node.draggable(enabled);
          });
          if (resetBtn) resetBtn.disabled = !enabled;
          boardWrap.style.pointerEvents = enabled ? '' : 'none';
        },

        showSolution: function showSolution(v) {
          instanceApi.setValue(v || {});
          boardWrap.classList.add('mcs-counters-solution-glow');
          window.setTimeout(function () {
            boardWrap.classList.remove('mcs-counters-solution-glow');
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
          if (resizeHandle) resizeHandle.disconnect();
          stage.destroy();
          container.innerHTML = '';
          changeCallbacks.length = 0;
          MCS._releaseContainer(container);
        },
      };

      notifyChange();
      return instanceApi;
    });

    // -------------------------------------------------------------------------
    // ten-frame — fill-to / make-ten (Phase 5.4 — F4 tap to fill)
    // -------------------------------------------------------------------------
    function tenFrameFillInteractive(container, config) {
      config = config || {};
      var mode = config.mode || 'fill-to';
      var bandId = config.band || 'A';
      var bandTokens = MCS.band(bandId);
      var target = mode === 'make-ten' ? 10 : config.target != null ? config.target : 5;
      var initial =
        config.initial != null
          ? config.initial
          : config.startFilled != null
            ? config.startFilled
            : 0;
      initial = Math.max(0, Math.min(10, initial));
      var cols = 5;
      var rows = 2;
      var gap = bandId === 'A' ? 8 : 6;
      var dotRadius = Math.max(18, bandTokens.objectSize / 3);
      var cellSize = dotRadius * 2 + gap + 8;

      container.innerHTML = '';
      container.classList.add('mcs-ten-frame', 'mcs-ten-frame-fill');

      var liveRegion = MCS.stage.ariaHost(container);
      var boardWrap = document.createElement('div');
      boardWrap.className = 'mcs-ten-frame-board';
      boardWrap.setAttribute('role', 'application');
      boardWrap.setAttribute('aria-label', 'Ten frame — tap to fill');
      boardWrap.tabIndex = 0;
      container.appendChild(boardWrap);

      var statusEl = document.createElement('div');
      statusEl.className = 'mcs-ten-frame-status';
      container.appendChild(statusEl);

      var resetBtn = document.createElement('button');
      resetBtn.type = 'button';
      resetBtn.className = 'btn-terminal mcs-ten-frame-reset';
      resetBtn.textContent = '↺ Reset';
      resetBtn.setAttribute('aria-label', 'Clear dots and start again');
      container.appendChild(resetBtn);

      var theme = MCS.theme(true);
      var enabled = true;
      var changeCallbacks = [];
      var filled = initial;

      var stageWidth = cols * cellSize + gap * 2;
      var stageHeight = rows * cellSize + gap * 2;

      var host = document.createElement('div');
      host.className = 'mcs-konva-host';
      host.style.width = stageWidth + 'px';
      host.style.height = stageHeight + 'px';
      boardWrap.appendChild(host);

      var stage = new Konva.Stage({ container: host, width: stageWidth, height: stageHeight });
      var bgLayer = new Konva.Layer();
      var dotLayer = new Konva.Layer();
      stage.add(bgLayer);
      stage.add(dotLayer);

      function cellOrigin(index) {
        var col = index % cols;
        var row = Math.floor(index / cols);
        return {
          x: gap + col * cellSize + cellSize / 2,
          y: gap + row * cellSize + cellSize / 2,
        };
      }

      function updateStatus() {
        if (mode === 'make-ten') {
          statusEl.textContent =
            filled >= 10
              ? 'Ten dots — ready to check!'
              : filled + ' dots — tap to make 10';
        } else {
          statusEl.textContent =
            filled === target
              ? target + ' dots — ready to check!'
              : 'Tap to fill to ' + target;
        }
      }

      function announce() {
        liveRegion.textContent =
          filled === 1 ? 'One dot in the frame' : filled + ' dots in the frame';
        updateStatus();
      }

      function notifyChange() {
        announce();
        changeCallbacks.forEach(function (cb) {
          try {
            cb(api.getValue());
          } catch (e) {
            console.warn('ten-frame fill onChange error', e);
          }
        });
      }

      function drawFrame() {
        bgLayer.destroyChildren();
        dotLayer.destroyChildren();
        var i;
        for (i = 0; i < cols * rows; i++) {
          (function (index) {
            var origin = cellOrigin(index);
            var isNext = index === filled && filled < 10;
            var cell = new Konva.Rect({
              x: origin.x - cellSize / 2 + 2,
              y: origin.y - cellSize / 2 + 2,
              width: cellSize - 4,
              height: cellSize - 4,
              stroke: isNext ? theme.accent : theme.gridLine,
              strokeWidth: isNext ? 2.5 : 1.5,
              cornerRadius: 6,
              fill: isNext ? theme.accentSoft : '#ffffff',
            });
            cell.on('click tap', function () {
              if (!enabled) return;
              if (index === filled && filled < 10) {
                filled += 1;
                MCS.audio.emit('drop');
                drawFrame();
                notifyChange();
              } else if (index === filled - 1 && filled > initial) {
                filled -= 1;
                MCS.audio.emit('tick');
                drawFrame();
                notifyChange();
              }
            });
            bgLayer.add(cell);
          })(i);
        }
        for (i = 0; i < filled; i++) {
          var pos = cellOrigin(i);
          var dot = new Konva.Circle({
            x: pos.x,
            y: pos.y,
            radius: dotRadius,
            fill: theme.accent,
            stroke: theme.ink,
            strokeWidth: 1.2,
            listening: false,
          });
          dotLayer.add(dot);
        }
        bgLayer.batchDraw();
        dotLayer.batchDraw();
      }

      function resetFill() {
        filled = initial;
        drawFrame();
        notifyChange();
      }

      resetBtn.addEventListener('click', function () {
        if (!enabled) return;
        resetFill();
      });

      drawFrame();

      var api = {
        getValue: function getValue() {
          return { filled: filled, target: target, initial: initial, mode: mode };
        },

        setValue: function setValue(v) {
          if (!v) {
            resetFill();
            return;
          }
          if (v.filled != null) filled = Math.max(0, Math.min(10, v.filled));
          if (v.count != null) filled = Math.max(0, Math.min(10, v.count));
          if (v.initial != null && v.filled == null && v.count == null) {
            initial = Math.max(0, Math.min(10, v.initial));
            filled = initial;
          }
          drawFrame();
          notifyChange();
        },

        setEnabled: function setEnabled(on) {
          enabled = !!on;
          resetBtn.disabled = !enabled;
          boardWrap.style.pointerEvents = enabled ? '' : 'none';
          boardWrap.style.opacity = enabled ? '1' : '0.65';
        },

        showSolution: function showSolution(v) {
          var goal = target;
          if (v && v.filled != null) goal = v.filled;
          if (v && v.count != null) goal = v.count;
          api.setValue({ filled: goal });
          boardWrap.classList.add('mcs-ten-frame-solution-glow');
          window.setTimeout(function () {
            boardWrap.classList.remove('mcs-ten-frame-solution-glow');
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

        onChange: function onChange(cb) {
          if (typeof cb === 'function') changeCallbacks.push(cb);
        },

        destroy: function destroy() {
          stage.destroy();
          container.innerHTML = '';
          changeCallbacks.length = 0;
          MCS._releaseContainer(container);
        },
      };

      notifyChange();
      return api;
    }

    // -------------------------------------------------------------------------
    // ten-frame — double-frame teen partition (Phase 5.10b — Y1-2)
    // -------------------------------------------------------------------------
    function tenFrameDoubleFrame(container, config) {
      config = config || {};
      var bandId = config.band || 'A';
      var bandTokens = MCS.band(bandId);
      var teen = config.teen;
      var tens =
        config.tens != null ? config.tens : teen != null ? Math.floor(teen / 10) : 1;
      var ones = config.ones != null ? config.ones : teen != null ? teen % 10 : 0;
      ones = Math.max(0, Math.min(9, ones));
      tens = Math.max(0, Math.min(1, tens));
      var total = teen != null ? teen : tens * 10 + ones;

      var cols = 5;
      var rows = 2;
      var gap = bandId === 'A' ? 8 : 6;
      var dotRadius = Math.max(18, bandTokens.objectSize / 3);
      var cellSize = dotRadius * 2 + gap + 8;
      var frameGap = bandId === 'A' ? 20 : 14;
      var frameWidth = cols * cellSize + gap * 2;
      var frameHeight = rows * cellSize + gap * 2;

      container.innerHTML = '';
      container.classList.add('mcs-ten-frame', 'mcs-ten-frame-double');

      var liveRegion = MCS.stage.ariaHost(container);
      var boardWrap = document.createElement('div');
      boardWrap.className = 'mcs-ten-frame-double-board';
      boardWrap.setAttribute('role', 'img');
      boardWrap.setAttribute(
        'aria-label',
        tens + (tens === 1 ? ' ten and ' : ' tens and ') + ones + ' ones'
      );
      container.appendChild(boardWrap);

      var statusEl = document.createElement('div');
      statusEl.className = 'mcs-ten-frame-status';
      statusEl.textContent = '1 ten and ' + ones + ' ones';
      container.appendChild(statusEl);

      var theme = MCS.theme(true);
      var changeCallbacks = [];

      function cellOrigin(index) {
        var col = index % cols;
        var row = Math.floor(index / cols);
        return {
          x: gap + col * cellSize + cellSize / 2,
          y: gap + row * cellSize + cellSize / 2,
        };
      }

      function drawFrameGroup(group, offsetX, filled) {
        var i;
        for (i = 0; i < cols * rows; i++) {
          var origin = cellOrigin(i);
          group.add(
            new Konva.Rect({
              x: offsetX + origin.x - cellSize / 2 + 2,
              y: origin.y - cellSize / 2 + 2,
              width: cellSize - 4,
              height: cellSize - 4,
              stroke: theme.gridLine,
              strokeWidth: 1.5,
              cornerRadius: 6,
              fill: '#ffffff',
              listening: false,
            })
          );
        }
        for (i = 0; i < filled; i++) {
          var pos = cellOrigin(i);
          group.add(
            new Konva.Circle({
              x: offsetX + pos.x,
              y: pos.y,
              radius: dotRadius,
              fill: theme.accent,
              stroke: theme.ink,
              strokeWidth: 1.2,
              listening: false,
            })
          );
        }
      }

      var stageWidth = frameWidth * 2 + frameGap + 8;
      var stageHeight = frameHeight + 8;
      var host = document.createElement('div');
      host.className = 'mcs-konva-host';
      host.style.width = stageWidth + 'px';
      host.style.height = stageHeight + 'px';
      boardWrap.appendChild(host);

      var stage = new Konva.Stage({ container: host, width: stageWidth, height: stageHeight });
      var layer = new Konva.Layer();
      stage.add(layer);

      var tensGroup = new Konva.Group({ x: 4, y: 4 });
      var onesGroup = new Konva.Group({ x: 4 + frameWidth + frameGap, y: 4 });
      layer.add(tensGroup);
      layer.add(onesGroup);
      drawFrameGroup(tensGroup, 0, 10);
      drawFrameGroup(onesGroup, 0, ones);
      layer.batchDraw();

      function announce() {
        liveRegion.textContent = boardWrap.getAttribute('aria-label');
      }

      function notifyChange() {
        announce();
        changeCallbacks.forEach(function (cb) {
          try {
            cb(api.getValue());
          } catch (e) {
            console.warn('ten-frame double-frame onChange error', e);
          }
        });
      }

      var api = {
        getValue: function getValue() {
          return {
            mode: 'double-frame',
            tens: tens,
            ones: ones,
            total: total,
            teen: total,
          };
        },

        setValue: function setValue(v) {
          if (!v) return;
          if (v.teen != null) {
            total = Math.max(11, Math.min(19, v.teen));
            tens = 1;
            ones = total % 10;
          } else {
            if (v.tens != null) tens = Math.max(0, Math.min(1, v.tens));
            if (v.ones != null) ones = Math.max(0, Math.min(9, v.ones));
            total = tens * 10 + ones;
          }
          tensGroup.destroy();
          onesGroup.destroy();
          tensGroup = new Konva.Group({ x: 4, y: 4 });
          onesGroup = new Konva.Group({ x: 4 + frameWidth + frameGap, y: 4 });
          layer.add(tensGroup);
          layer.add(onesGroup);
          drawFrameGroup(tensGroup, 0, 10);
          drawFrameGroup(onesGroup, 0, ones);
          statusEl.textContent = '1 ten and ' + ones + ' ones';
          boardWrap.setAttribute(
            'aria-label',
            tens + (tens === 1 ? ' ten and ' : ' tens and ') + ones + ' ones'
          );
          layer.batchDraw();
          notifyChange();
        },

        setEnabled: function setEnabled(on) {
          boardWrap.style.opacity = on ? '1' : '0.65';
        },

        showSolution: function showSolution(v) {
          api.setValue(v || { teen: total });
          boardWrap.classList.add('mcs-ten-frame-solution-glow');
          window.setTimeout(function () {
            boardWrap.classList.remove('mcs-ten-frame-solution-glow');
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

        onChange: function onChange(cb) {
          if (typeof cb === 'function') changeCallbacks.push(cb);
        },

        destroy: function destroy() {
          stage.destroy();
          container.innerHTML = '';
          changeCallbacks.length = 0;
          MCS._releaseContainer(container);
        },
      };

      notifyChange();
      return api;
    }

    // -------------------------------------------------------------------------
    // ten-frame (Phase 5 — Band A subitising / make-ten)
    // -------------------------------------------------------------------------
    MCS.register('ten-frame', function tenFrameFactory(container, config) {
      config = config || {};
      var mode = config.mode || 'show-me';
      if (mode === 'double-frame') {
        return tenFrameDoubleFrame(container, config);
      }
      if (mode === 'fill-to' || mode === 'make-ten') {
        return tenFrameFillInteractive(container, config);
      }
      var bandId = config.band || 'A';
      var bandTokens = MCS.band(bandId);
      var count = config.count != null ? config.count : 0;
      var flashMs = config.flashMs != null ? config.flashMs : 1400;
      var cols = 5;
      var rows = 2;
      var gap = bandId === 'A' ? 8 : 6;
      var dotRadius = Math.max(18, bandTokens.objectSize / 3);
      var cellSize = dotRadius * 2 + gap + 8;

      container.innerHTML = '';
      container.classList.add('mcs-ten-frame');

      var liveRegion = MCS.stage.ariaHost(container);
      var boardWrap = document.createElement('div');
      boardWrap.className = 'mcs-ten-frame-board';
      boardWrap.setAttribute('role', 'img');
      boardWrap.setAttribute('aria-label', 'Ten frame');
      container.appendChild(boardWrap);

      var statusEl = document.createElement('div');
      statusEl.className = 'mcs-ten-frame-status';
      statusEl.textContent = mode === 'show-me' ? 'Watch the dots…' : '';
      container.appendChild(statusEl);

      var replayBtn = null;
      if (mode === 'show-me') {
        replayBtn = document.createElement('button');
        replayBtn.type = 'button';
        replayBtn.className = 'btn-terminal mcs-ten-frame-replay';
        replayBtn.textContent = '👁 Show again';
        replayBtn.setAttribute('aria-label', 'Show the dots again');
        container.appendChild(replayBtn);
      }

      var theme = MCS.theme(true);
      var enabled = true;
      var changeCallbacks = [];
      var flashTimer = null;
      var dotsVisible = true;
      var filled = Math.max(0, Math.min(10, count));

      var stageWidth = cols * cellSize + gap * 2;
      var stageHeight = rows * cellSize + gap * 2;

      var host = document.createElement('div');
      host.className = 'mcs-konva-host';
      host.style.width = stageWidth + 'px';
      host.style.height = stageHeight + 'px';
      boardWrap.appendChild(host);

      var stage = new Konva.Stage({ container: host, width: stageWidth, height: stageHeight });
      var bgLayer = new Konva.Layer();
      var dotLayer = new Konva.Layer();
      stage.add(bgLayer);
      stage.add(dotLayer);

      var cellNodes = [];
      var dotNodes = [];

      function cellOrigin(index) {
        var col = index % cols;
        var row = Math.floor(index / cols);
        return {
          x: gap + col * cellSize + cellSize / 2,
          y: gap + row * cellSize + cellSize / 2,
        };
      }

      function drawFrame() {
        bgLayer.destroyChildren();
        dotLayer.destroyChildren();
        cellNodes.length = 0;
        dotNodes.length = 0;
        var i;
        for (i = 0; i < cols * rows; i++) {
          var origin = cellOrigin(i);
          var cell = new Konva.Rect({
            x: origin.x - cellSize / 2 + 2,
            y: origin.y - cellSize / 2 + 2,
            width: cellSize - 4,
            height: cellSize - 4,
            stroke: theme.gridLine,
            strokeWidth: 1.5,
            cornerRadius: 6,
            fill: '#ffffff',
            listening: false,
          });
          bgLayer.add(cell);
          cellNodes.push(cell);
        }
        for (i = 0; i < filled; i++) {
          var pos = cellOrigin(i);
          var dot = new Konva.Circle({
            x: pos.x,
            y: pos.y,
            radius: dotRadius,
            fill: theme.accent,
            stroke: theme.ink,
            strokeWidth: 1.2,
            opacity: dotsVisible ? 1 : 0,
            listening: false,
            name: 'dot-' + i,
          });
          dotLayer.add(dot);
          dotNodes.push(dot);
        }
        bgLayer.batchDraw();
        dotLayer.batchDraw();
      }

      function announce() {
        if (mode !== 'show-me') {
          liveRegion.textContent =
            filled === 1 ? 'One dot in the frame' : filled + ' dots in the frame';
          return;
        }
        liveRegion.textContent = dotsVisible
          ? filled === 1
            ? 'Flash: one dot'
            : 'Flash: ' + filled + ' dots'
          : 'Dots hidden — enter your answer';
      }

      function notifyChange() {
        announce();
        changeCallbacks.forEach(function (cb) {
          try {
            cb(instanceApi.getValue());
          } catch (e) {
            console.warn('ten-frame onChange error', e);
          }
        });
      }

      function hideDots() {
        dotsVisible = false;
        dotNodes.forEach(function (dot) {
          dot.opacity(0);
        });
        dotLayer.batchDraw();
        if (mode === 'show-me') {
          statusEl.textContent = 'How many dots did you see?';
        }
        notifyChange();
      }

      function showDots() {
        dotsVisible = true;
        dotNodes.forEach(function (dot) {
          dot.opacity(1);
        });
        dotLayer.batchDraw();
        if (mode === 'show-me') {
          statusEl.textContent = 'Watch the dots…';
        }
        announce();
      }

      function scheduleFlash() {
        if (flashTimer) window.clearTimeout(flashTimer);
        if (mode !== 'show-me' || flashMs <= 0) return;
        showDots();
        flashTimer = window.setTimeout(hideDots, flashMs);
      }

      drawFrame();
      scheduleFlash();

      if (replayBtn) {
        replayBtn.addEventListener('click', function () {
          if (!enabled) return;
          scheduleFlash();
        });
      }

      var resizeHandle = MCS.observeResize(container, function () {
        drawFrame();
        if (dotsVisible) showDots();
        else hideDots();
      });

      var instanceApi = {
        getValue: function getValue() {
          return { filled: filled, visible: dotsVisible };
        },

        setValue: function setValue(v) {
          if (!v) return;
          if (v.count != null) filled = Math.max(0, Math.min(10, v.count));
          if (v.filled != null) filled = Math.max(0, Math.min(10, v.filled));
          if (v.reveal) {
            drawFrame();
            showDots();
            if (flashTimer) window.clearTimeout(flashTimer);
            statusEl.textContent = filled + ' dots';
            return;
          }
          drawFrame();
          if (mode === 'show-me') scheduleFlash();
          else notifyChange();
        },

        replayFlash: function replayFlash() {
          scheduleFlash();
        },

        setEnabled: function setEnabled(on) {
          enabled = !!on;
          if (replayBtn) replayBtn.disabled = !enabled;
          boardWrap.style.opacity = enabled ? '1' : '0.65';
        },

        showSolution: function showSolution(v) {
          instanceApi.setValue(Object.assign({ reveal: true }, v || { count: filled }));
          boardWrap.classList.add('mcs-ten-frame-solution-glow');
          window.setTimeout(function () {
            boardWrap.classList.remove('mcs-ten-frame-solution-glow');
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
          if (flashTimer) window.clearTimeout(flashTimer);
          if (resizeHandle) resizeHandle.disconnect();
          stage.destroy();
          container.innerHTML = '';
          changeCallbacks.length = 0;
          MCS._releaseContainer(container);
        },
      };

      notifyChange();
      return instanceApi;
    });

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
    // number-track (Phase 3b — Y6 prime sieve; Phase 5.10 — Y1 missing / count-by)
    // -------------------------------------------------------------------------
    function numberTrackSieveShade(container, config) {
      config = config || {};
      var mode = 'sieve-shade';
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
    }

    function numberTrackBuildGrid(container, config, options) {
      options = options || {};
      var bandId = config.band || 'A';
      var bandTokens = MCS.band(bandId);
      var min = config.min != null ? config.min : 1;
      var max = config.max != null ? config.max : 20;
      var columns = config.columns != null ? config.columns : 10;
      var numbers = [];
      var ni;
      for (ni = min; ni <= max; ni++) numbers.push(ni);

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
      caption.textContent = options.caption || '';
      container.appendChild(caption);

      var theme = MCS.theme(true);
      var gap = 6;
      var cellSize = Math.max(
        bandTokens.minTouchTarget,
        bandId === 'A' ? 64 : bandId === 'B' ? 48 : 40
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

      var cellNodes = Object.create(null);
      var labelNodes = Object.create(null);

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

        if (typeof options.onCellTap === 'function') {
          rect.on('mousedown touchstart', function (evt) {
            evt.cancelBubble = true;
            options.onCellTap(num);
          });
        }

        objLayer.add(rect);
        objLayer.add(label);
        cellNodes[num] = rect;
        labelNodes[num] = label;
      });

      objLayer.draw();

      boardWrap.addEventListener('focus', function () {
        boardWrap.classList.add('mcs-number-track-focused');
      });
      boardWrap.addEventListener('blur', function () {
        boardWrap.classList.remove('mcs-number-track-focused');
      });

      function styleCell(num, style) {
        var rect = cellNodes[num];
        if (!rect) return;
        rect.fill(style.fill != null ? style.fill : theme.accentSoft || theme.surface);
        rect.stroke(style.stroke != null ? style.stroke : theme.ink);
        rect.strokeWidth(style.strokeWidth != null ? style.strokeWidth : 1);
        rect.opacity(style.opacity != null ? style.opacity : 0.85);
        objLayer.batchDraw();
      }

      function solutionGlow() {
        boardWrap.classList.add('mcs-number-track-solution-glow');
        window.setTimeout(function () {
          boardWrap.classList.remove('mcs-number-track-solution-glow');
        }, 900);
      }

      function flagCorrect() {
        boardWrap.classList.add('mcs-flag-correct');
        window.setTimeout(function () {
          boardWrap.classList.remove('mcs-flag-correct');
        }, 600);
      }

      function flagIncorrect() {
        boardWrap.classList.add('mcs-flag-incorrect');
        window.setTimeout(function () {
          boardWrap.classList.remove('mcs-flag-incorrect');
        }, 450);
      }

      return {
        numbers: numbers,
        bandId: bandId,
        theme: theme,
        liveRegion: liveRegion,
        boardWrap: boardWrap,
        caption: caption,
        stage: stage,
        objLayer: objLayer,
        cellNodes: cellNodes,
        labelNodes: labelNodes,
        cellSize: cellSize,
        styleCell: styleCell,
        solutionGlow: solutionGlow,
        flagCorrect: flagCorrect,
        flagIncorrect: flagIncorrect,
        destroy: function destroyGrid() {
          stage.destroy();
          container.innerHTML = '';
          MCS._releaseContainer(container);
        },
      };
    }

    function numberTrackMissingNumbers(container, config) {
      config = config || {};
      var anchor = config.anchor != null ? config.anchor : 5;
      var correct = config.correct != null ? config.correct : anchor + 1;
      var enabled = true;
      var changeCallbacks = [];
      var selected = null;

      var grid = numberTrackBuildGrid(container, config, {
        caption: 'Tap the number that comes next',
        onCellTap: function onCellTap(num) {
          if (!enabled) return;
          selected = selected === num ? null : num;
          MCS.audio.emit('tick');
          syncVisual();
          changeCallbacks.forEach(function (cb) {
            try {
              cb(selected != null ? [selected] : []);
            } catch (e) {
              console.warn('number-track onChange error', e);
            }
          });
        },
      });

      function syncVisual() {
        grid.numbers.forEach(function (num) {
          if (num === anchor) {
            grid.styleCell(num, {
              fill: grid.theme.accentSoft,
              stroke: grid.theme.accent,
              strokeWidth: 3,
              opacity: 1,
            });
          } else if (selected === num) {
            grid.styleCell(num, {
              fill: grid.theme.accent,
              stroke: grid.theme.accent,
              strokeWidth: 2,
              opacity: 1,
            });
          } else {
            grid.styleCell(num, {
              fill: grid.theme.accentSoft || grid.theme.surface,
              stroke: grid.theme.ink,
              strokeWidth: 1,
              opacity: 0.85,
            });
          }
        });
        grid.boardWrap.setAttribute(
          'aria-label',
          'Number track. After ' + anchor + '.' + (selected != null ? ' Selected ' + selected + '.' : '')
        );
        grid.liveRegion.textContent =
          selected != null ? 'Selected ' + selected : 'Tap the number after ' + anchor;
      }

      syncVisual();

      return {
        getValue: function getValue() {
          return selected != null ? [selected] : [];
        },

        setValue: function setValue(nums) {
          selected =
            Array.isArray(nums) && nums.length && nums[0] != null ? nums[0] : null;
          syncVisual();
        },

        setEnabled: function setEnabled(on) {
          enabled = !!on;
          grid.boardWrap.style.pointerEvents = enabled ? '' : 'none';
          grid.boardWrap.setAttribute('aria-disabled', enabled ? 'false' : 'true');
        },

        showSolution: function showSolution(nums) {
          var pick = Array.isArray(nums) && nums.length ? nums[0] : correct;
          selected = pick;
          syncVisual();
          grid.solutionGlow();
        },

        flagCorrect: grid.flagCorrect,
        flagIncorrect: grid.flagIncorrect,

        onChange: function onChange(callback) {
          if (typeof callback === 'function') changeCallbacks.push(callback);
        },

        destroy: function destroy() {
          changeCallbacks.length = 0;
          grid.destroy();
        },
      };
    }

    function numberTrackCountBy(container, config) {
      config = config || {};
      var step = config.step != null ? config.step : 2;
      var min = config.min != null ? config.min : 0;
      var max = config.max != null ? config.max : 30;
      var start = config.start != null ? config.start : min;
      var enabled = true;
      var changeCallbacks = [];
      var shaded = Object.create(null);

      function expectedList() {
        var out = [];
        var n;
        for (n = start; n <= max; n += step) out.push(n);
        return out;
      }

      var grid = numberTrackBuildGrid(container, config, {
        caption: 'Tap every number when counting by ' + step + 's',
        onCellTap: function onCellTap(num) {
          if (!enabled) return;
          shaded[num] = !shaded[num];
          MCS.audio.emit('tick');
          syncVisual(false);
          fireChange();
        },
      });

      grid.numbers.forEach(function (num) {
        shaded[num] = false;
      });

      function shadedList() {
        var out = [];
        grid.numbers.forEach(function (num) {
          if (shaded[num]) out.push(num);
        });
        return out;
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

      function syncVisual(animate) {
        grid.numbers.forEach(function (num) {
          if (shaded[num]) {
            grid.styleCell(num, {
              fill: grid.theme.accent,
              stroke: grid.theme.accent,
              strokeWidth: 2,
              opacity: 1,
            });
            if (animate) {
              var rect = grid.cellNodes[num];
              if (rect && !MCS.prefersReducedMotion()) {
                var baseY = rect.y();
                rect.to({
                  y: baseY - 3,
                  duration: 0.1,
                  onFinish: function () {
                    rect.to({ y: baseY, duration: 0.1 });
                  },
                });
              }
            }
          } else {
            grid.styleCell(num, {
              fill: grid.theme.accentSoft || grid.theme.surface,
              stroke: grid.theme.ink,
              strokeWidth: 1,
              opacity: 0.85,
            });
          }
        });
        var count = shadedList().length;
        grid.caption.textContent =
          count === 0
            ? 'Tap counting by ' + step + 's on the track'
            : count + ' tapped — keep going!';
        grid.liveRegion.textContent =
          count + ' selected: ' + (shadedList().join(', ') || 'none');
        grid.boardWrap.setAttribute(
          'aria-label',
          'Number track counting by ' + step + ' from ' + start + ' to ' + max
        );
      }

      syncVisual(false);

      return {
        getValue: function getValue() {
          return shadedList();
        },

        setValue: function setValue(nums) {
          grid.numbers.forEach(function (n) {
            shaded[n] = false;
          });
          if (Array.isArray(nums)) {
            nums.forEach(function (n) {
              if (shaded[n] !== undefined) shaded[n] = true;
            });
          }
          syncVisual(false);
          fireChange();
        },

        setEnabled: function setEnabled(on) {
          enabled = !!on;
          grid.boardWrap.style.pointerEvents = enabled ? '' : 'none';
          grid.boardWrap.setAttribute('aria-disabled', enabled ? 'false' : 'true');
        },

        showSolution: function showSolution(nums) {
          var list = Array.isArray(nums) ? nums.slice() : expectedList();
          grid.numbers.forEach(function (n) {
            shaded[n] = false;
          });
          syncVisual(false);
          var i = 0;
          var self = this;
          function next() {
            if (i >= list.length) {
              grid.solutionGlow();
              fireChange();
              return;
            }
            shaded[list[i]] = true;
            syncVisual(true);
            fireChange();
            i++;
            window.setTimeout(next, MCS.prefersReducedMotion() ? 0 : 320);
          }
          next();
        },

        flagCorrect: grid.flagCorrect,
        flagIncorrect: grid.flagIncorrect,

        onChange: function onChange(callback) {
          if (typeof callback === 'function') changeCallbacks.push(callback);
        },

        destroy: function destroy() {
          changeCallbacks.length = 0;
          grid.destroy();
        },
      };
    }

    MCS.register('number-track', function numberTrackFactory(container, config) {
      config = config || {};
      var mode = config.mode || 'sieve-shade';
      if (mode === 'missing-numbers') return numberTrackMissingNumbers(container, config);
      if (mode === 'count-by') return numberTrackCountBy(container, config);
      return numberTrackSieveShade(container, config);
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

    function decomposePlaceValueInteractive(n, showHundreds, max) {
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

    function placeValueBlocksInteractive(container, config) {
      config = config || {};
      var mode = config.mode || 'build';
      var bandId = config.band || 'B';
      var bandTokens = MCS.band(bandId);
      var showHundreds = config.showHundreds !== false;
      var max = config.max != null ? config.max : 999;
      var tradeMode = mode === 'trade';
      var startParts = config.start || { hundreds: 0, tens: 0, ones: 0 };
      var parts = {
        hundreds: startParts.hundreds || 0,
        tens: startParts.tens || 0,
        ones: startParts.ones || 0,
      };
      var enabled = true;
      var changeCallbacks = [];
      var theme = MCS.theme(true);
      var unit = bandId === 'A' ? 14 : bandId === 'B' ? 11 : 9;
      var gap = 6;
      var colGap = Math.max(14, unit * 1.2);
      var colW = unit * 10;

      container.innerHTML = '';
      container.classList.add('mcs-place-value-blocks', 'mcs-place-value-blocks-interactive');
      if (tradeMode) container.classList.add('mcs-place-value-blocks-trade');

      var liveRegion = MCS.stage.ariaHost(container);
      var boardWrap = document.createElement('div');
      boardWrap.className = 'mcs-place-value-blocks-board';
      boardWrap.setAttribute('role', 'application');
      container.appendChild(boardWrap);

      var caption = document.createElement('div');
      caption.className = 'mcs-place-value-blocks-caption';
      caption.textContent = tradeMode
        ? 'Trade blocks when you have 10 or more in a column.'
        : 'Tap + and − to build the number with blocks.';
      container.appendChild(caption);

      var totalEl = document.createElement('div');
      totalEl.className = 'mcs-place-value-blocks-total';
      totalEl.setAttribute('aria-live', 'polite');
      container.appendChild(totalEl);

      var controls = document.createElement('div');
      controls.className = 'mcs-place-value-blocks-controls';
      container.appendChild(controls);

      var tradeBar = document.createElement('div');
      tradeBar.className = 'mcs-place-value-blocks-trade-bar';
      if (tradeMode) container.appendChild(tradeBar);

      var stage = null;

      function totalFromParts() {
        return parts.hundreds * 100 + parts.tens * 10 + parts.ones;
      }

      function clampParts() {
        parts.hundreds = Math.max(0, Math.min(9, parts.hundreds));
        parts.tens = Math.max(0, Math.min(99, parts.tens));
        parts.ones = Math.max(0, Math.min(99, parts.ones));
        if (totalFromParts() > max) {
          var d = decomposePlaceValueInteractive(max, showHundreds, max);
          parts.hundreds = d.hundreds;
          parts.tens = d.tens;
          parts.ones = d.ones;
        }
      }

      function notifyChange() {
        totalEl.textContent = 'Total: ' + totalFromParts();
        liveRegion.textContent =
          parts.hundreds + ' hundreds, ' + parts.tens + ' tens, ' + parts.ones + ' ones';
        changeCallbacks.forEach(function (cb) {
          try {
            cb(api.getValue());
          } catch (e) {
            console.warn('place-value-blocks onChange error', e);
          }
        });
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
              listening: false,
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
            listening: false,
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
            listening: false,
          })
        );
        return y + side + gap;
      }

      function renderBlocks() {
        clampParts();
        var cols = showHundreds ? ['hundreds', 'tens', 'ones'] : ['tens', 'ones'];
        var labels = showHundreds ? ['H', 'T', 'O'] : ['T', 'O'];
        var colors = [theme.accentSoft, theme.gridLine, theme.accent];
        var maxH = unit * 10 + gap;
        if (parts.tens > 0) maxH = Math.max(maxH, parts.tens * (unit * 10 + gap));
        if (parts.ones > 0) maxH = Math.max(maxH, parts.ones * (unit + 2));
        if (parts.hundreds > 0) maxH = Math.max(maxH, parts.hundreds * (unit * 10 + gap));

        var stageW = Math.min(
          Math.max(usableWidth(container), 260),
          cols.length * colW + (cols.length - 1) * colGap + 48
        );
        var stageH = maxH + 48;

        boardWrap.innerHTML = '';
        var host = document.createElement('div');
        host.className = 'mcs-konva-host';
        host.style.width = stageW + 'px';
        host.style.height = stageH + 'px';
        boardWrap.appendChild(host);

        if (stage) stage.destroy();
        stage = new Konva.Stage({ container: host, width: stageW, height: stageH });
        var layer = new Konva.Layer();
        stage.add(layer);
        var root = new Konva.Group({ x: 16, y: 8 });
        layer.add(root);

        var colIdx;
        var x = 0;
        var baselineY = 22;
        for (colIdx = 0; colIdx < cols.length; colIdx++) {
          var key = cols[colIdx];
          var count = parts[key];
          var colX = x + (colW - unit) / 2;
          var blockY = baselineY;
          var ci;

          root.add(
            new Konva.Text({
              x: x,
              y: 0,
              width: colW,
              align: 'center',
              text: labels[colIdx],
              fontSize: 12,
              fontFamily: 'Work Sans, sans-serif',
              fontStyle: '600',
              fill: theme.gridLine,
              listening: false,
            })
          );

          if (key === 'hundreds') {
            for (ci = 0; ci < count; ci++) {
              blockY = drawHundredFlat(root, colX, blockY, colors[0]);
            }
          } else if (key === 'tens') {
            for (ci = 0; ci < count; ci++) {
              blockY = drawTenRod(root, colX, blockY, colors[1]);
            }
          } else {
            drawOnes(root, colX, blockY, count, colors[2]);
          }

          x += colW + colGap;
        }

        stage.batchDraw();
        rebuildControls();
        rebuildTradeBar();
        notifyChange();
      }

      function makeTapBtn(label, aria, onClick) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn-terminal mcs-place-value-blocks-btn';
        btn.textContent = label;
        btn.setAttribute('aria-label', aria);
        btn.style.minWidth = Math.max(64, bandTokens.minTouchTarget) + 'px';
        btn.style.minHeight = Math.max(44, bandTokens.minTouchTarget / 1.5) + 'px';
        btn.addEventListener('click', function () {
          if (!enabled) return;
          onClick();
        });
        return btn;
      }

      function rebuildControls() {
        controls.innerHTML = '';
        if (tradeMode) return;

        var cols = showHundreds
          ? [
              { key: 'hundreds', label: 'Hundreds' },
              { key: 'tens', label: 'Tens' },
              { key: 'ones', label: 'Ones' },
            ]
          : [
              { key: 'tens', label: 'Tens' },
              { key: 'ones', label: 'Ones' },
            ];

        cols.forEach(function (col) {
          var wrap = document.createElement('div');
          wrap.className = 'mcs-place-value-blocks-col-controls';
          var minus = makeTapBtn('−', 'Remove one ' + col.label.toLowerCase(), function () {
            if (parts[col.key] > 0) {
              parts[col.key] -= 1;
              MCS.audio.emit('tick');
              renderBlocks();
            }
          });
          var plus = makeTapBtn('+', 'Add one ' + col.label.toLowerCase(), function () {
            parts[col.key] += 1;
            MCS.audio.emit('drop');
            renderBlocks();
          });
          var lab = document.createElement('span');
          lab.className = 'mcs-place-value-blocks-col-label';
          lab.textContent = col.label;
          wrap.appendChild(minus);
          wrap.appendChild(lab);
          wrap.appendChild(plus);
          controls.appendChild(wrap);
        });
      }

      function rebuildTradeBar() {
        if (!tradeMode) return;
        tradeBar.innerHTML = '';
        if (parts.ones >= 10) {
          tradeBar.appendChild(
            makeTapBtn('Trade 10 ones → 1 ten', 'Trade ten ones for one ten rod', function () {
              parts.ones -= 10;
              parts.tens += 1;
              MCS.audio.emit('drop');
              renderBlocks();
            })
          );
        }
        if (showHundreds && parts.tens >= 10) {
          tradeBar.appendChild(
            makeTapBtn('Trade 10 tens → 1 hundred', 'Trade ten tens for one hundred flat', function () {
              parts.tens -= 10;
              parts.hundreds += 1;
              MCS.audio.emit('drop');
              renderBlocks();
            })
          );
        }
      }

      renderBlocks();

      var api = {
        getValue: function getValue() {
          return {
            hundreds: parts.hundreds,
            tens: parts.tens,
            ones: parts.ones,
            total: totalFromParts(),
            mode: mode,
          };
        },
        setValue: function setValue(v) {
          if (v && v.reset) {
            parts = {
              hundreds: startParts.hundreds || 0,
              tens: startParts.tens || 0,
              ones: startParts.ones || 0,
            };
          } else if (v && typeof v === 'object') {
            if (v.hundreds != null) parts.hundreds = v.hundreds;
            if (v.tens != null) parts.tens = v.tens;
            if (v.ones != null) parts.ones = v.ones;
          }
          renderBlocks();
        },
        setEnabled: function setEnabled(on) {
          enabled = !!on;
          controls.querySelectorAll('button').forEach(function (btn) {
            btn.disabled = !on;
          });
          tradeBar.querySelectorAll('button').forEach(function (btn) {
            btn.disabled = !on;
          });
          boardWrap.style.pointerEvents = on ? '' : 'none';
        },
        showSolution: function showSolution(v) {
          if (v && typeof v === 'object') {
            if (v.hundreds != null) parts.hundreds = v.hundreds;
            if (v.tens != null) parts.tens = v.tens;
            if (v.ones != null) parts.ones = v.ones;
          }
          renderBlocks();
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
        onChange: function onChange(cb) {
          if (typeof cb === 'function') changeCallbacks.push(cb);
        },
        destroy: function destroy() {
          if (stage) stage.destroy();
          container.innerHTML = '';
          changeCallbacks.length = 0;
          MCS._releaseContainer(container);
        },
      };

      return api;
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
      if (mode === 'trade' || (mode === 'build' && config.interactive === true)) {
        return placeValueBlocksInteractive(container, config);
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
    // array-builder (Phase 3d — Y3 show-array; Phase 5.11e — Y2 build-array)
    // -------------------------------------------------------------------------
    function arrayBuilderBuild(container, config) {
      config = config || {};
      var bandId = config.band || 'B';
      var bandTokens = MCS.band(bandId);
      var maxRows = config.maxRows != null ? config.maxRows : 5;
      var maxCols = config.maxCols != null ? config.maxCols : 5;
      var rows = Math.max(1, config.initialRows != null ? config.initialRows : 1);
      var cols = Math.max(1, config.initialCols != null ? config.initialCols : 1);
      var theme = MCS.theme(true);
      var enabled = true;
      var changeCallbacks = [];
      var dotR = bandId === 'A' ? 10 : bandId === 'B' ? 9 : 7;
      var spacing = dotR * 2 + (bandId === 'A' ? 10 : 8);
      var stage = null;
      var rootGroup = null;

      container.innerHTML = '';
      container.classList.add('mcs-array-builder', 'mcs-array-builder-build');

      var liveRegion = MCS.stage.ariaHost(container);
      var boardWrap = document.createElement('div');
      boardWrap.className = 'mcs-array-builder-board';
      boardWrap.setAttribute('role', 'application');
      boardWrap.setAttribute('aria-label', 'Build the dot array');
      container.appendChild(boardWrap);

      var caption = document.createElement('div');
      caption.className = 'mcs-array-builder-caption';
      container.appendChild(caption);

      var controls = document.createElement('div');
      controls.className = 'mcs-array-builder-controls';
      container.appendChild(controls);

      function announce() {
        var total = rows * cols;
        caption.textContent = rows + ' \u00d7 ' + cols + ' = ' + total + ' dots';
        liveRegion.textContent = rows + ' rows and ' + cols + ' columns, ' + total + ' dots';
      }

      function notifyChange() {
        announce();
        changeCallbacks.forEach(function (cb) {
          try {
            cb(api.getValue());
          } catch (e) {
            console.warn('array-builder onChange error', e);
          }
        });
      }

      function renderArray() {
        var stageW = Math.min(Math.max(usableWidth(container), 200), maxCols * spacing + 48);
        var stageH = maxRows * spacing + 24;

        boardWrap.innerHTML = '';
        var host = document.createElement('div');
        host.className = 'mcs-konva-host';
        host.style.width = stageW + 'px';
        host.style.height = stageH + 'px';
        boardWrap.appendChild(host);

        if (stage) stage.destroy();
        stage = new Konva.Stage({ container: host, width: stageW, height: stageH });
        var objLayer = new Konva.Layer();
        stage.add(objLayer);
        rootGroup = new Konva.Group({ x: 20, y: 12, name: 'array-build-root' });
        objLayer.add(rootGroup);

        var r;
        var c;
        for (r = 0; r < rows; r++) {
          for (c = 0; c < cols; c++) {
            rootGroup.add(
              new Konva.Circle({
                x: c * spacing + dotR,
                y: r * spacing + dotR,
                radius: dotR,
                fill: theme.accent,
                stroke: theme.ink,
                strokeWidth: 1.5,
                listening: false,
              })
            );
          }
        }
        stage.batchDraw();
        announce();
      }

      function makeStepBtn(label, aria, onClick) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn-terminal mcs-array-builder-btn';
        btn.textContent = label;
        btn.setAttribute('aria-label', aria);
        btn.style.minWidth = Math.max(44, bandTokens.minTouchTarget / 1.4) + 'px';
        btn.style.minHeight = Math.max(40, bandTokens.minTouchTarget / 1.6) + 'px';
        btn.addEventListener('click', function () {
          if (!enabled) return;
          onClick();
        });
        return btn;
      }

      function rebuildControls() {
        controls.innerHTML = '';
        var rowWrap = document.createElement('div');
        rowWrap.className = 'mcs-array-builder-dim-controls';
        rowWrap.appendChild(
          makeStepBtn('\u2212', 'Remove a row', function () {
            if (rows > 1) {
              rows -= 1;
              MCS.audio.emit('tick');
              renderArray();
              notifyChange();
            }
          })
        );
        var rowLab = document.createElement('span');
        rowLab.className = 'mcs-array-builder-dim-label';
        rowLab.textContent = 'Rows: ' + rows;
        rowWrap.appendChild(rowLab);
        rowWrap.appendChild(
          makeStepBtn('+', 'Add a row', function () {
            if (rows < maxRows) {
              rows += 1;
              MCS.audio.emit('drop');
              renderArray();
              notifyChange();
            }
          })
        );

        var colWrap = document.createElement('div');
        colWrap.className = 'mcs-array-builder-dim-controls';
        colWrap.appendChild(
          makeStepBtn('\u2212', 'Remove a column', function () {
            if (cols > 1) {
              cols -= 1;
              MCS.audio.emit('tick');
              renderArray();
              notifyChange();
            }
          })
        );
        var colLab = document.createElement('span');
        colLab.className = 'mcs-array-builder-dim-label';
        colLab.textContent = 'Cols: ' + cols;
        colWrap.appendChild(colLab);
        colWrap.appendChild(
          makeStepBtn('+', 'Add a column', function () {
            if (cols < maxCols) {
              cols += 1;
              MCS.audio.emit('drop');
              renderArray();
              notifyChange();
            }
          })
        );

        controls.appendChild(rowWrap);
        controls.appendChild(colWrap);
      }

      renderArray();
      rebuildControls();
      notifyChange();

      var initialRows = rows;
      var initialCols = cols;

      var api = {
        getValue: function getValue() {
          return { rows: rows, cols: cols, total: rows * cols, mode: 'build-array' };
        },
        setValue: function setValue(v) {
          if (v && v.reset) {
            rows = initialRows;
            cols = initialCols;
          } else {
            if (v.rows != null) rows = Math.max(1, Math.min(maxRows, v.rows));
            if (v.cols != null) cols = Math.max(1, Math.min(maxCols, v.cols));
          }
          renderArray();
          rebuildControls();
          notifyChange();
        },
        setEnabled: function setEnabled(on) {
          enabled = !!on;
          controls.querySelectorAll('button').forEach(function (btn) {
            btn.disabled = !on;
          });
          boardWrap.style.pointerEvents = on ? '' : 'none';
        },
        showSolution: function showSolution(v) {
          if (v) {
            if (v.rows != null) rows = v.rows;
            if (v.cols != null) cols = v.cols;
          }
          renderArray();
          rebuildControls();
          boardWrap.classList.add('mcs-array-builder-solution-glow');
          window.setTimeout(function () {
            boardWrap.classList.remove('mcs-array-builder-solution-glow');
          }, 900);
          notifyChange();
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
        onChange: function onChange(cb) {
          if (typeof cb === 'function') changeCallbacks.push(cb);
        },
        destroy: function destroy() {
          if (stage) stage.destroy();
          container.innerHTML = '';
          changeCallbacks.length = 0;
          MCS._releaseContainer(container);
        },
      };

      return api;
    }

    MCS.register('array-builder', function arrayBuilderFactory(container, config) {
      config = config || {};
      var mode = config.mode || 'show-array';
      if (mode === 'build-array') {
        return arrayBuilderBuild(container, config);
      }
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
        if (hintOnly) {
          container.style.display = show ? 'flex' : 'none';
        }
        rootGroup.opacity(1);
        if (caption) caption.style.opacity = '1';
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

  function partitionForGridMethod(multiplicand) {
    var tens = Math.floor(multiplicand / 10) * 10;
    var ones = multiplicand % 10;
    var parts = [];
    if (tens > 0) parts.push(tens);
    if (ones > 0) parts.push(ones);
    if (parts.length === 0) parts.push(0);
    return parts;
  }

  MCS.register('multiplication-grid', function multiplicationGridFactory(container, config) {
    config = config || {};
    var multiplicand = config.multiplicand != null ? config.multiplicand : 23;
    var multiplier = config.multiplier != null ? config.multiplier : 4;
    var parts = Array.isArray(config.parts) ? config.parts.slice() : partitionForGridMethod(multiplicand);
    var enabled = true;
    var changeCallbacks = [];
    var partialInputs = [];
    var totalInput = null;
    var expectedPartials = parts.map(function (part) {
      return part * multiplier;
    });
    var expectedTotal = multiplicand * multiplier;

    container.innerHTML = '';
    container.classList.add('mcs-multiplication-grid');

    var liveRegion = MCS.stage.ariaHost(container);
    liveRegion.textContent =
      'Grid multiplication for ' + multiplicand + ' times ' + multiplier + '. Fill each partial product, then the total.';

    var caption = document.createElement('div');
    caption.className = 'mcs-multiplication-grid-caption';
    caption.innerHTML =
      '<span class="mcs-mult-grid-expr">' +
      multiplicand +
      ' = <strong>' +
      parts.join('</strong> + <strong>') +
      '</strong></span>';
    container.appendChild(caption);

    var tableWrap = document.createElement('div');
    tableWrap.className = 'mcs-multiplication-grid-table-wrap';
    container.appendChild(tableWrap);

    var table = document.createElement('table');
    table.className = 'mcs-multiplication-grid-table';
    table.setAttribute('role', 'grid');
    table.setAttribute(
      'aria-label',
      'Partition grid for ' + multiplicand + ' multiplied by ' + multiplier
    );
    tableWrap.appendChild(table);

    var thead = document.createElement('thead');
    var headerRow = document.createElement('tr');
    ['Partition', '\u00d7', String(multiplier)].forEach(function (text, idx) {
      var th = document.createElement('th');
      th.scope = 'col';
      th.className = 'mcs-mult-grid-label';
      if (idx === 1) th.classList.add('mcs-mult-grid-op');
      th.textContent = text;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    var tbody = document.createElement('tbody');

    function makeGridInput(ariaLabel) {
      var input = document.createElement('input');
      input.type = 'number';
      input.className = 'input-text-terminal mcs-mult-grid-input';
      input.inputMode = 'numeric';
      input.autocomplete = 'off';
      input.placeholder = '?';
      input.setAttribute('aria-label', ariaLabel);
      input.addEventListener('input', notify);
      return input;
    }

    parts.forEach(function (part, idx) {
      var tr = document.createElement('tr');
      tr.setAttribute('role', 'row');

      var partCell = document.createElement('th');
      partCell.scope = 'row';
      partCell.className = 'mcs-mult-grid-label';
      partCell.textContent = String(part);
      tr.appendChild(partCell);

      var opCell = document.createElement('td');
      opCell.className = 'mcs-mult-grid-op';
      opCell.textContent = '\u00d7';
      opCell.setAttribute('aria-hidden', 'true');
      tr.appendChild(opCell);

      var inputCell = document.createElement('td');
      var input = makeGridInput(part + ' times ' + multiplier);
      input.dataset.partIndex = String(idx);
      partialInputs.push(input);
      inputCell.appendChild(input);
      tr.appendChild(inputCell);

      tbody.appendChild(tr);
    });

    var totalRow = document.createElement('tr');
    totalRow.className = 'mcs-mult-grid-total-row';
    totalRow.setAttribute('role', 'row');

    var totalLabel = document.createElement('th');
    totalLabel.scope = 'row';
    totalLabel.colSpan = 2;
    totalLabel.className = 'mcs-mult-grid-label mcs-mult-grid-total-label';
    totalLabel.textContent = 'Total';
    totalRow.appendChild(totalLabel);

    var totalCell = document.createElement('td');
    totalInput = makeGridInput('Total product for ' + multiplicand + ' times ' + multiplier);
    totalCell.appendChild(totalInput);
    totalRow.appendChild(totalCell);
    tbody.appendChild(totalRow);

    table.appendChild(tbody);

    function parseInput(el) {
      if (!el) return null;
      var raw = el.value.trim();
      if (raw === '') return null;
      var n = parseInt(raw, 10);
      return isNaN(n) ? null : n;
    }

    function getValueObject() {
      return {
        multiplicand: multiplicand,
        multiplier: multiplier,
        parts: parts.slice(),
        partials: partialInputs.map(parseInput),
        total: parseInput(totalInput),
      };
    }

    function notify() {
      changeCallbacks.forEach(function (cb) {
        try {
          cb(getValueObject());
        } catch (e) {
          console.warn('multiplication-grid onChange error', e);
        }
      });
    }

    function setInputsEnabled(on) {
      partialInputs.forEach(function (inp) {
        inp.disabled = !on;
      });
      if (totalInput) totalInput.disabled = !on;
      tableWrap.style.pointerEvents = on ? '' : 'none';
      tableWrap.style.opacity = on ? '' : '0.65';
    }

    return {
      getValue: getValueObject,

      setValue: function setValue(v) {
        if (!v) return;
        var partials = v.partials || expectedPartials;
        partialInputs.forEach(function (inp, idx) {
          if (partials[idx] != null) inp.value = String(partials[idx]);
        });
        if (totalInput && v.total != null) totalInput.value = String(v.total);
      },

      setEnabled: function setEnabled(on) {
        enabled = !!on;
        setInputsEnabled(enabled);
      },

      showSolution: function showSolution(v) {
        var partials = v && v.partials ? v.partials : expectedPartials;
        var total = v && v.total != null ? v.total : expectedTotal;
        partialInputs.forEach(function (inp, idx) {
          inp.value = String(partials[idx]);
        });
        if (totalInput) totalInput.value = String(total);
        tableWrap.classList.add('mcs-multiplication-grid-solution-glow');
        window.setTimeout(function () {
          tableWrap.classList.remove('mcs-multiplication-grid-solution-glow');
        }, 900);
      },

      flagCorrect: function flagCorrect() {
        tableWrap.classList.add('mcs-flag-correct');
        window.setTimeout(function () {
          tableWrap.classList.remove('mcs-flag-correct');
        }, 600);
      },

      flagIncorrect: function flagIncorrect() {
        tableWrap.classList.add('mcs-flag-incorrect');
        window.setTimeout(function () {
          tableWrap.classList.remove('mcs-flag-incorrect');
        }, 450);
      },

      onChange: function onChange(callback) {
        if (typeof callback === 'function') changeCallbacks.push(callback);
      },

      destroy: function destroy() {
        container.innerHTML = '';
        changeCallbacks.length = 0;
        partialInputs.length = 0;
        totalInput = null;
        MCS._releaseContainer(container);
      },
    };
  });
})(window.MCS || {});
