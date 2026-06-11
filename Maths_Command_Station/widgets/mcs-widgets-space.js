/**
 * MCS space widgets — coordinate-plotter (Phase 2.2 pilot).
 */
(function (MCS) {
  'use strict';

  if (typeof JXG === 'undefined' || !MCS.board) {
    return;
  }

  function snapCoord(value, step, min, max) {
    var snapped = Math.round(value / step) * step;
    if (snapped < min) snapped = min;
    if (snapped > max) snapped = max;
    if (step < 1) {
      snapped = parseFloat(snapped.toFixed(Math.ceil(-Math.log10(step))));
    }
    return snapped;
  }

  function formatCoordSpeech(x, y) {
    var xs = x < 0 ? 'negative ' + Math.abs(x) : String(x);
    var ys = y < 0 ? 'negative ' + Math.abs(y) : String(y);
    return 'Point at ' + xs + ', ' + ys;
  }

  function jxgSizeFromBand(bandId) {
    return Math.max(4, Math.round(MCS.band(bandId).objectSize / 6));
  }

  MCS.register('coordinate-plotter', function coordinatePlotterFactory(container, config) {
    config = config || {};
    var mode = config.mode || 'plot-point';
    var bandId = config.band || 'C';
    var bandTokens = MCS.band(bandId);
    var xMin = config.xMin != null ? config.xMin : -5;
    var xMax = config.xMax != null ? config.xMax : 5;
    var yMin = config.yMin != null ? config.yMin : -5;
    var yMax = config.yMax != null ? config.yMax : 5;
    var snap = config.snap != null ? config.snap : 1;
    var showAxes = config.showAxes !== false;
    var showGrid = config.showGrid !== false;
    var labels = config.labels || 'axis';
    var markers = config.markers || [];
    var quadrants = config.quadrants || 4;
    var readOnly = mode === 'read-point' || config.draggable === false;
    var plotMode = mode === 'plot-point' || mode === 'path';
    var manhattanMode = mode === 'manhattan';
    var ariaTask =
      config.ariaLabel ||
      (manhattanMode
        ? 'Coordinate grid. Tap grid intersections to trace the path from A to B.'
        : mode === 'path'
          ? 'Coordinate grid. Drag the pin to the landing point.'
          : readOnly
            ? 'Coordinate plane. Read the coordinates of the marked point.'
            : 'Coordinate plane. Plot the point on the grid.');

    container.innerHTML = '';
    container.classList.add('mcs-coordinate-plotter');

    var liveRegion = document.createElement('div');
    liveRegion.className = 'mcs-sr-live';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    container.appendChild(liveRegion);

    var boardWrap = document.createElement('div');
    boardWrap.className = 'mcs-coordinate-plotter-board';
    boardWrap.setAttribute('role', 'application');
    boardWrap.setAttribute('aria-label', ariaTask);
    boardWrap.tabIndex = 0;
    container.appendChild(boardWrap);

    var boardWidth = container.clientWidth;
    if (!boardWidth && container.parentElement) {
      boardWidth = container.parentElement.clientWidth;
    }
    if (!boardWidth) boardWidth = 360;
    var plotSize = Math.min(Math.max(boardWidth, 280), 420);
    boardWrap.style.width = plotSize + 'px';
    boardWrap.style.height = plotSize + 'px';
    void boardWrap.offsetHeight;

    var boardCtx = MCS.board.make(boardWrap, {
      boundingbox: [xMin - 1, yMax + 1, xMax + 1, yMin - 1],
      height: plotSize + 'px',
      minHeight: plotSize + 'px',
    });
    var board = boardCtx.board;
    var theme = boardCtx.theme;

    if (showGrid) {
      MCS.board.grid(boardCtx, { xMin: xMin, xMax: xMax, yMin: yMin, yMax: yMax, step: 1 });
    }
    if (showAxes) {
      MCS.board.axes(boardCtx, {
        xMin: xMin,
        xMax: xMax,
        yMin: yMin,
        yMax: yMax,
        labels: labels,
        labelStep: labels === 'all' ? 1 : 2,
        fontSize: bandTokens.fontSizeMin,
      });
    }

    if (quadrants === 4 && bandId === 'C') {
      var qFont = Math.max(10, bandTokens.fontSizeMin - 2);
      var qStyle = 'font-family:' + theme.fontMono + ';opacity:0.45;';
      [
        ['I', 2.6, 2.6],
        ['II', -2.6, 2.6],
        ['III', -2.6, -2.6],
        ['IV', 2.6, -2.6],
      ].forEach(function (q) {
        board.create('text', [q[1], q[2], q[0]], {
          fontSize: qFont,
          strokeColor: theme.ink,
          fixed: true,
          highlight: false,
          anchorX: 'middle',
          anchorY: 'middle',
          cssStyle: qStyle,
        });
      });
    }

    var pinSize = jxgSizeFromBand(bandId);
    var pin = null;
    var currentX = 0;
    var currentY = 0;
    var enabled = true;
    var changeCallbacks = [];
    var activeTween = null;
    var crosshairEls = [];
    var pathPoints = [];
    var pathSegments = [];
    var tracedDistance = null;
    var pathComplete = false;

    function announce(x, y) {
      liveRegion.textContent = formatCoordSpeech(x, y);
    }

    function renderFixedMarkers(markerList) {
      markerList.forEach(function (m) {
        var mx = m.x != null ? m.x : 0;
        var my = m.y != null ? m.y : 0;
        var lbl = m.label != null ? m.label : 'P';
        MCS.board.point(boardCtx, {
          coords: [mx, my],
          size: pinSize,
          fixed: true,
          strokeColor: m.color === 'secondary' ? theme.ink : theme.accent,
          fillColor: theme.accentSoft || theme.accent,
          snapToGrid: false,
        });
        board.create('text', [mx + 0.55, my + 0.55, lbl], {
          fontSize: bandTokens.fontSizeMin,
          strokeColor: theme.ink,
          fixed: true,
          highlight: false,
          cssStyle: 'font-family:' + theme.fontMono + ';font-weight:700;',
        });
      });
    }

    function fireChange() {
      changeCallbacks.forEach(function (cb) {
        try {
          if (manhattanMode) {
            cb({ distance: tracedDistance, pathComplete: pathComplete });
          } else if (readOnly) {
            cb({});
          } else {
            cb({ x: currentX, y: currentY });
          }
        } catch (e) {
          console.warn('coordinate-plotter onChange error', e);
        }
      });
    }

    function setPinPosition(x, y, animate, onComplete) {
      if (!pin) {
        if (typeof onComplete === 'function') onComplete();
        return;
      }
      var tx = snapCoord(x, snap, xMin, xMax);
      var ty = snapCoord(y, snap, yMin, yMax);
      if (activeTween) activeTween.cancel();

      if (!animate || MCS.prefersReducedMotion()) {
        pin.setPosition(JXG.COORDS_BY_USER, [tx, ty]);
        pin.setAttribute({ size: pinSize });
        currentX = tx;
        currentY = ty;
        board.update();
        announce(tx, ty);
        if (typeof onComplete === 'function') onComplete();
        return;
      }

      var startX = pin.X();
      var startY = pin.Y();
      activeTween = MCS.tween({
        duration: 0.8,
        onUpdate: function (t) {
          pin.setPosition(JXG.COORDS_BY_USER, [
            startX + (tx - startX) * t,
            startY + (ty - startY) * t,
          ]);
          board.update();
        },
        onComplete: function () {
          pin.setPosition(JXG.COORDS_BY_USER, [tx, ty]);
          pin.setAttribute({ size: pinSize });
          currentX = tx;
          currentY = ty;
          board.update();
          announce(tx, ty);
          activeTween = null;
          if (typeof onComplete === 'function') onComplete();
        },
      });
    }

    function flashCrosshair(x, y) {
      crosshairEls.forEach(function (el) {
        try {
          board.removeObject(el);
        } catch (e) {
          /* ignore */
        }
      });
      crosshairEls = [];
      var col = theme.accent;
      crosshairEls.push(
        board.create(
          'segment',
          [
            [xMin, y],
            [xMax, y],
          ],
          {
            strokeColor: col,
            strokeWidth: 2,
            dash: 2,
            fixed: true,
            highlight: false,
          }
        )
      );
      crosshairEls.push(
        board.create(
          'segment',
          [
            [x, yMin],
            [x, yMax],
          ],
          {
            strokeColor: col,
            strokeWidth: 2,
            dash: 2,
            fixed: true,
            highlight: false,
          }
        )
      );
      board.update();
      window.setTimeout(function () {
        crosshairEls.forEach(function (el) {
          try {
            board.removeObject(el);
          } catch (e) {
            /* ignore */
          }
        });
        crosshairEls = [];
        board.update();
      }, 300);
    }

    function drawManhattanPath(fromPt, toPt, persist) {
      var sx = fromPt.x != null ? fromPt.x : fromPt[0];
      var sy = fromPt.y != null ? fromPt.y : fromPt[1];
      var ex = toPt.x != null ? toPt.x : toPt[0];
      var ey = toPt.y != null ? toPt.y : toPt[1];
      var seg1 = board.create(
        'segment',
        [
          [sx, sy],
          [ex, sy],
        ],
        {
          strokeColor: theme.accent,
          strokeWidth: 3,
          dash: persist ? 0 : 2,
          fixed: true,
          highlight: false,
        }
      );
      var seg2 = board.create(
        'segment',
        [
          [ex, sy],
          [ex, ey],
        ],
        {
          strokeColor: theme.accent,
          strokeWidth: 3,
          dash: persist ? 0 : 2,
          fixed: true,
          highlight: false,
        }
      );
      if (persist) {
        pathSegments.push(seg1, seg2);
      } else {
        window.setTimeout(function () {
          try {
            board.removeObject(seg1);
            board.removeObject(seg2);
          } catch (e) {
            /* ignore */
          }
          board.update();
        }, MCS.prefersReducedMotion() ? 0 : 900);
      }
      board.update();
    }

    function appendPathPoint(x, y) {
      var last = pathPoints[pathPoints.length - 1];
      if (!last) return false;
      if (last.x === x && last.y === y) return false;
      var stepDist = Math.abs(x - last.x) + Math.abs(y - last.y);
      if (stepDist !== 1) return false;

      pathPoints.push({ x: x, y: y });
      pathSegments.push(
        board.create(
          'segment',
          [
            [last.x, last.y],
            [x, y],
          ],
          {
            strokeColor: theme.accent,
            strokeWidth: 3,
            fixed: true,
            highlight: false,
          }
        )
      );
      tracedDistance = pathPoints.length - 1;
      board.update();

      if (markers.length > 1) {
        var endM = markers[markers.length - 1];
        if (x === endM.x && y === endM.y) {
          pathComplete = true;
          liveRegion.textContent = 'Path complete. Distance ' + tracedDistance + ' units.';
        } else {
          liveRegion.textContent = 'Path step to ' + x + ', ' + y + '. ' + tracedDistance + ' units so far.';
        }
      }
      return true;
    }

    if (markers.length) {
      renderFixedMarkers(markers);
    }

    if (mode === 'read-point') {
      markers.forEach(function (m) {
        currentX = m.x != null ? m.x : 0;
        currentY = m.y != null ? m.y : 0;
      });
    } else if (manhattanMode) {
      if (markers.length >= 2) {
        pathPoints = [{ x: markers[0].x, y: markers[0].y }];
        tracedDistance = 0;
      }

      board.on('down', function (e) {
        if (!enabled) return;
        var usr = board.getUsrCoordsOfMouse(e);
        if (!usr) return;
        var tx = snapCoord(usr[0], snap, xMin, xMax);
        var ty = snapCoord(usr[1], snap, yMin, yMax);
        if (appendPathPoint(tx, ty)) {
          MCS.audio.emit('tick');
          fireChange();
        }
      });
    } else if (plotMode) {
      var startX =
        config.initialX != null
          ? config.initialX
          : markers.length && markers[0].x != null
            ? markers[0].x
            : 0;
      var startY =
        config.initialY != null
          ? config.initialY
          : markers.length && markers[0].y != null
            ? markers[0].y
            : 0;
      currentX = snapCoord(startX, snap, xMin, xMax);
      currentY = snapCoord(startY, snap, yMin, yMax);

      pin = MCS.board.point(boardCtx, {
        coords: [currentX, currentY],
        size: pinSize,
        snapToGrid: true,
        snapSizeX: snap,
        snapSizeY: snap,
        fixed: false,
      });

      pin.on('down', function () {
        if (!enabled) return;
        pin.setAttribute({ size: pinSize * 1.1 });
        MCS.audio.emit('pickup');
      });

      pin.on('drag', function () {
        if (!enabled) return;
        pin.setPosition(JXG.COORDS_BY_USER, [pin.X(), pin.Y()]);
      });

      pin.on('up', function () {
        if (!enabled) return;
        var sx = snapCoord(pin.X(), snap, xMin, xMax);
        var sy = snapCoord(pin.Y(), snap, yMin, yMax);
        pin.setPosition(JXG.COORDS_BY_USER, [sx, sy]);
        pin.setAttribute({ size: pinSize });
        if (sx !== currentX || sy !== currentY) {
          currentX = sx;
          currentY = sy;
          MCS.audio.emit('snap');
          announce(sx, sy);
          fireChange();
        }
        board.update();
        MCS.audio.emit('drop');
      });

      board.on('down', function (e) {
        if (!enabled || readOnly) return;
        var usr = board.getUsrCoordsOfMouse(e);
        if (!usr) return;
        var nearPin =
          Math.abs(usr[0] - currentX) < snap * 0.75 &&
          Math.abs(usr[1] - currentY) < snap * 0.75;
        if (nearPin) return;
        var tx = snapCoord(usr[0], snap, xMin, xMax);
        var ty = snapCoord(usr[1], snap, yMin, yMax);
        setPinPosition(tx, ty, false);
        MCS.audio.emit('snap');
        fireChange();
      });

      announce(currentX, currentY);
    }

    function onKeyDown(e) {
      if (!enabled || readOnly || manhattanMode || !pin) return;
      var handled = false;
      if (e.key === 'ArrowLeft') {
        setPinPosition(currentX - snap, currentY, false);
        handled = true;
      } else if (e.key === 'ArrowRight') {
        setPinPosition(currentX + snap, currentY, false);
        handled = true;
      } else if (e.key === 'ArrowDown') {
        setPinPosition(currentX, currentY - snap, false);
        handled = true;
      } else if (e.key === 'ArrowUp') {
        setPinPosition(currentX, currentY + snap, false);
        handled = true;
      } else if (e.key === 'Enter') {
        fireChange();
        handled = true;
      }
      if (handled) {
        e.preventDefault();
        if (e.key !== 'Enter') {
          MCS.audio.emit('snap');
          fireChange();
        }
      }
    }

    function preventTouchScroll(e) {
      if (!enabled) return;
      e.preventDefault();
    }

    boardWrap.addEventListener('keydown', onKeyDown);
    boardWrap.addEventListener('touchmove', preventTouchScroll, { passive: false });
    boardWrap.addEventListener('focus', function () {
      boardWrap.classList.add('mcs-coordinate-plotter-focused');
    });
    boardWrap.addEventListener('blur', function () {
      boardWrap.classList.remove('mcs-coordinate-plotter-focused');
    });

    function spawnParticles() {
      if (!pin) return;
      var rect = boardWrap.getBoundingClientRect();
      var fracX = (currentX - xMin) / (xMax - xMin);
      var fracY = (yMax - currentY) / (yMax - yMin);
      var px = rect.width * fracX;
      var py = rect.height * fracY;
      for (var i = 0; i < 8; i++) {
        var dot = document.createElement('span');
        dot.className = 'mcs-pin-particle';
        dot.style.left = px + 'px';
        dot.style.top = py + 'px';
        dot.style.setProperty('--dx', (Math.random() - 0.5) * 40 + 'px');
        dot.style.setProperty('--dy', (Math.random() - 0.5) * 40 + 'px');
        boardWrap.appendChild(dot);
        (function (el) {
          window.setTimeout(function () {
            if (el.parentNode) el.parentNode.removeChild(el);
          }, 600);
        })(dot);
      }
    }

    return {
      getValue: function getValue() {
        if (manhattanMode) {
          return { distance: tracedDistance, pathComplete: pathComplete };
        }
        if (readOnly) return {};
        return { x: currentX, y: currentY };
      },

      setValue: function setValue(v) {
        if (manhattanMode || readOnly || !v) return;
        setPinPosition(v.x != null ? v.x : 0, v.y != null ? v.y : 0, false, fireChange);
      },

      setEnabled: function setEnabled(on) {
        enabled = !!on;
        if (pin) pin.setAttribute({ fixed: !enabled || readOnly });
        boardWrap.style.pointerEvents = enabled ? '' : 'none';
        boardWrap.setAttribute('aria-disabled', enabled ? 'false' : 'true');
      },

      showSolution: function showSolution(v) {
        if (!v) return;
        if (manhattanMode) {
          var from = v.from || (markers.length ? markers[0] : null);
          var to = v.to || (markers.length > 1 ? markers[1] : null);
          if (from && to) {
            drawManhattanPath(from, to, true);
            tracedDistance =
              Math.abs((to.x != null ? to.x : to[0]) - (from.x != null ? from.x : from[0])) +
              Math.abs((to.y != null ? to.y : to[1]) - (from.y != null ? from.y : from[1]));
            pathComplete = true;
            fireChange();
          }
          boardWrap.classList.add('mcs-coordinate-plotter-solution-glow');
          window.setTimeout(function () {
            boardWrap.classList.remove('mcs-coordinate-plotter-solution-glow');
          }, 900);
          return;
        }
        if (readOnly) {
          flashCrosshair(v.x, v.y);
          return;
        }
        setPinPosition(v.x, v.y, true, function () {
          flashCrosshair(v.x, v.y);
          boardWrap.classList.add('mcs-coordinate-plotter-solution-glow');
          window.setTimeout(function () {
            boardWrap.classList.remove('mcs-coordinate-plotter-solution-glow');
          }, 900);
          fireChange();
        });
      },

      flagCorrect: function flagCorrect() {
        boardWrap.classList.add('mcs-flag-correct');
        spawnParticles();
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
        boardWrap.removeEventListener('keydown', onKeyDown);
        boardWrap.removeEventListener('touchmove', preventTouchScroll);
        MCS.board.destroy(boardCtx);
        container.innerHTML = '';
        changeCallbacks.length = 0;
        MCS._releaseContainer(container);
      },
    };
  });

  function computeTargetVertices(preImage, mode, config) {
    if (!preImage || !preImage.length) return [];
    if (mode === 'reflect' && config.mirrorLine) {
      var ml = config.mirrorLine;
      if (ml.axis === 'x') {
        return preImage.map(function (v) {
          return { x: 2 * ml.value - v.x, y: v.y };
        });
      }
      return preImage.map(function (v) {
        return { x: v.x, y: 2 * ml.value - v.y };
      });
    }
    if (mode === 'rotate' && config.rotation) {
      var rot = config.rotation;
      var cx = rot.center.x;
      var cy = rot.center.y;
      if (rot.angle === 180) {
        return preImage.map(function (v) {
          return { x: 2 * cx - v.x, y: 2 * cy - v.y };
        });
      }
      return preImage.map(function (v) {
        var dx = v.x - cx;
        var dy = v.y - cy;
        if (rot.angle === 90 && rot.direction === 'cw') {
          return { x: cx + dy, y: cy - dx };
        }
        return { x: cx - dy, y: cy + dx };
      });
    }
    return [];
  }

  MCS.register('transform-board', function transformBoardFactory(container, config) {
    config = config || {};
    var mode = config.mode || 'reflect';
    var bandId = config.band || 'C';
    var bandTokens = MCS.band(bandId);
    var xMin = config.xMin != null ? config.xMin : 0;
    var xMax = config.xMax != null ? config.xMax : 10;
    var yMin = config.yMin != null ? config.yMin : 0;
    var yMax = config.yMax != null ? config.yMax : 10;
    var snap = config.snap != null ? config.snap : 1;
    var preImage = config.preImage || [];
    var vertexCount = preImage.length || 3;
    var targetVertices = computeTargetVertices(preImage, mode, config);

    container.innerHTML = '';
    container.classList.add('mcs-transform-board');

    var liveRegion = document.createElement('div');
    liveRegion.className = 'mcs-sr-live';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    container.appendChild(liveRegion);

    var boardWrap = document.createElement('div');
    boardWrap.className = 'mcs-transform-board-canvas';
    boardWrap.setAttribute('role', 'application');
    boardWrap.setAttribute(
      'aria-label',
      config.ariaLabel ||
        (mode === 'rotate'
          ? 'Transformation grid. Tap intersections to plot rotated vertices, then drag to adjust.'
          : 'Transformation grid. Tap intersections to plot reflected vertices, then drag to adjust.')
    );
    boardWrap.tabIndex = 0;
    container.appendChild(boardWrap);

    var caption = document.createElement('p');
    caption.className = 'mcs-transform-board-caption';
    caption.textContent =
      'Tap up to ' +
      vertexCount +
      ' grid points to plot the image vertices. Tap a plotted point to remove it.';
    container.appendChild(caption);

    var boardWidth = container.clientWidth;
    if (!boardWidth && container.parentElement) {
      boardWidth = container.parentElement.clientWidth;
    }
    if (!boardWidth) boardWidth = 360;
    var plotSize = Math.min(Math.max(boardWidth, 280), 420);
    boardWrap.style.width = plotSize + 'px';
    boardWrap.style.height = plotSize + 'px';
    void boardWrap.offsetHeight;

    var boardCtx = MCS.board.make(boardWrap, {
      boundingbox: [xMin - 1, yMax + 1, xMax + 1, yMin - 1],
      height: plotSize + 'px',
      minHeight: plotSize + 'px',
    });
    var board = boardCtx.board;
    var theme = boardCtx.theme;
    var pinSize = jxgSizeFromBand(bandId);

    MCS.board.grid(boardCtx, { xMin: xMin, xMax: xMax, yMin: yMin, yMax: yMax, step: 1 });
    MCS.board.axes(boardCtx, {
      xMin: xMin,
      xMax: xMax,
      yMin: yMin,
      yMax: yMax,
      labels: config.labels || 'all',
      labelStep: 1,
      fontSize: bandTokens.fontSizeMin,
    });

    if (preImage.length >= 2) {
      var prePts = preImage.map(function (v) {
        return MCS.board.point(boardCtx, {
          coords: [v.x, v.y],
          size: pinSize - 1,
          fixed: true,
          strokeColor: theme.accent,
          fillColor: theme.accentSoft || theme.accent,
          snapToGrid: false,
        });
      });
      board.create('polygon', prePts, {
        borders: {
          strokeColor: theme.accent,
          strokeWidth: 2.5,
          dash: 0,
        },
        fillColor: theme.accentSoft || 'rgba(0, 82, 255, 0.12)',
        fixed: true,
        highlight: false,
        withLines: true,
        vertices: { visible: false },
      });
      preImage.forEach(function (v, idx) {
        board.create('text', [v.x + 0.45, v.y + 0.45, 'P' + (idx + 1)], {
          fontSize: bandTokens.fontSizeMin,
          strokeColor: theme.accent,
          fixed: true,
          highlight: false,
          cssStyle: 'font-family:' + theme.fontMono + ';font-weight:700;',
        });
      });
    }

    if (mode === 'reflect' && config.mirrorLine) {
      var ml = config.mirrorLine;
      if (ml.axis === 'x') {
        board.create(
          'segment',
          [
            [ml.value, yMin - 0.5],
            [ml.value, yMax + 0.5],
          ],
          {
            strokeColor: theme.error,
            strokeWidth: 2.5,
            dash: 2,
            fixed: true,
            highlight: false,
          }
        );
        board.create('text', [ml.value + 0.3, yMax + 0.35, 'x = ' + ml.value], {
          fontSize: bandTokens.fontSizeMin - 1,
          strokeColor: theme.error,
          fixed: true,
          highlight: false,
          cssStyle: 'font-family:' + theme.fontMono + ';font-weight:700;',
        });
      } else {
        board.create(
          'segment',
          [
            [xMin - 0.5, ml.value],
            [xMax + 0.5, ml.value],
          ],
          {
            strokeColor: theme.error,
            strokeWidth: 2.5,
            dash: 2,
            fixed: true,
            highlight: false,
          }
        );
        board.create('text', [xMax - 1.5, ml.value + 0.35, 'y = ' + ml.value], {
          fontSize: bandTokens.fontSizeMin - 1,
          strokeColor: theme.error,
          fixed: true,
          highlight: false,
          cssStyle: 'font-family:' + theme.fontMono + ';font-weight:700;',
        });
      }
    } else if (mode === 'rotate' && config.rotation) {
      var cen = config.rotation.center;
      MCS.board.point(boardCtx, {
        coords: [cen.x, cen.y],
        size: pinSize,
        fixed: true,
        strokeColor: theme.error,
        fillColor: theme.error,
        snapToGrid: false,
      });
      board.create(
        'segment',
        [
          [cen.x - 0.8, cen.y],
          [cen.x + 0.8, cen.y],
        ],
        {
          strokeColor: theme.error,
          strokeWidth: 1.5,
          fixed: true,
          highlight: false,
        }
      );
      board.create(
        'segment',
        [
          [cen.x, cen.y - 0.8],
          [cen.x, cen.y + 0.8],
        ],
        {
          strokeColor: theme.error,
          strokeWidth: 1.5,
          fixed: true,
          highlight: false,
        }
      );
      board.create('text', [cen.x + 0.55, cen.y + 0.55, 'C(' + cen.x + ',' + cen.y + ')'], {
        fontSize: bandTokens.fontSizeMin - 1,
        strokeColor: theme.error,
        fixed: true,
        highlight: false,
        cssStyle: 'font-family:' + theme.fontMono + ';font-weight:700;',
      });
    }

    var ghostPts = [];
    var ghostLabels = [];
    var ghostPoly = null;
    if (targetVertices.length >= 2) {
      targetVertices.forEach(function (v) {
        ghostPts.push(
          board.create('point', [v.x, v.y], {
            visible: false,
            fixed: true,
            withLabel: false,
            showInfobox: false,
          })
        );
      });
      ghostPoly = board.create('polygon', ghostPts, {
        visible: false,
        borders: {
          strokeColor: theme.correct,
          strokeWidth: 2,
          dash: 2,
        },
        fillColor: 'rgba(5, 150, 105, 0.08)',
        fixed: true,
        highlight: false,
        withLines: true,
        vertices: { visible: false },
      });
      targetVertices.forEach(function (v, idx) {
        ghostLabels.push(
          board.create('text', [v.x + 0.45, v.y + 0.45, 'P' + (idx + 1) + "'"], {
            visible: false,
            fontSize: bandTokens.fontSizeMin,
            strokeColor: theme.correct,
            fixed: true,
            highlight: false,
            cssStyle: 'font-family:' + theme.fontMono + ';font-weight:700;',
          })
        );
      });
    }

    var studentPts = [];
    var studentPoly = null;
    var studentLabels = [];
    var enabled = true;
    var changeCallbacks = [];
    var activeTweens = [];

    function cancelTweens() {
      activeTweens.forEach(function (tw) {
        if (tw && tw.cancel) tw.cancel();
      });
      activeTweens = [];
    }

    function studentVertices() {
      return studentPts.map(function (pt) {
        return { x: snapCoord(pt.X(), snap, xMin, xMax), y: snapCoord(pt.Y(), snap, yMin, yMax) };
      });
    }

    function announceState() {
      var verts = studentVertices();
      if (!verts.length) {
        liveRegion.textContent = 'No image vertices plotted yet.';
        return;
      }
      liveRegion.textContent =
        verts.length +
        ' of ' +
        vertexCount +
        ' vertices plotted. ' +
        verts
          .map(function (v, i) {
            return "P" + (i + 1) + "' (" + v.x + ', ' + v.y + ')';
          })
          .join('; ');
    }

    function fireChange() {
      var payload = { vertices: studentVertices() };
      changeCallbacks.forEach(function (cb) {
        try {
          cb(payload);
        } catch (e) {
          console.warn('transform-board onChange error', e);
        }
      });
    }

    function rebuildStudentPolygon() {
      if (studentPoly) {
        try {
          board.removeObject(studentPoly);
        } catch (e) {
          /* ignore */
        }
        studentPoly = null;
      }
      if (studentPts.length >= 2) {
        studentPoly = board.create('polygon', studentPts, {
          borders: {
            strokeColor: theme.ink,
            strokeWidth: 2,
          },
          fillColor: 'rgba(26, 28, 30, 0.06)',
          fixed: true,
          highlight: false,
          withLines: true,
          vertices: { visible: true },
        });
      }
      board.update();
    }

    function removeStudentPoint(idx) {
      var pt = studentPts[idx];
      if (!pt) return;
      try {
        board.removeObject(pt);
      } catch (e) {
        /* ignore */
      }
      if (studentLabels[idx]) {
        try {
          board.removeObject(studentLabels[idx]);
        } catch (e) {
          /* ignore */
        }
      }
      studentPts.splice(idx, 1);
      studentLabels.splice(idx, 1);
      rebuildStudentPolygon();
      announceState();
      fireChange();
    }

    function addStudentPoint(x, y) {
      if (studentPts.length >= vertexCount) return;
      var sx = snapCoord(x, snap, xMin, xMax);
      var sy = snapCoord(y, snap, yMin, yMax);
      var existingIdx = -1;
      for (var ei = 0; ei < studentPts.length; ei++) {
        var ept = studentPts[ei];
        if (
          snapCoord(ept.X(), snap, xMin, xMax) === sx &&
          snapCoord(ept.Y(), snap, yMin, yMax) === sy
        ) {
          existingIdx = ei;
          break;
        }
      }
      if (existingIdx !== -1) {
        removeStudentPoint(existingIdx);
        MCS.audio.emit('click');
        return;
      }

      var pt = MCS.board.point(boardCtx, {
        coords: [sx, sy],
        size: pinSize,
        snapToGrid: true,
        snapSizeX: snap,
        snapSizeY: snap,
        fixed: false,
        strokeColor: theme.ink,
        fillColor: theme.ink,
      });
      var labelIdx = studentPts.length;
      var lbl = board.create('text', [sx + 0.45, sy + 0.45, 'P' + (labelIdx + 1) + "'"], {
        fontSize: bandTokens.fontSizeMin,
        strokeColor: theme.ink,
        fixed: true,
        highlight: false,
        cssStyle: 'font-family:' + theme.fontMono + ';font-weight:700;',
      });

      pt.on('down', function () {
        if (!enabled) return;
        MCS.audio.emit('pickup');
      });

      pt.on('drag', function () {
        if (!enabled) return;
        lbl.setPosition(JXG.COORDS_BY_USER, [pt.X() + 0.45, pt.Y() + 0.45]);
      });

      pt.on('up', function () {
        if (!enabled) return;
        var nx = snapCoord(pt.X(), snap, xMin, xMax);
        var ny = snapCoord(pt.Y(), snap, yMin, yMax);
        pt.setPosition(JXG.COORDS_BY_USER, [nx, ny]);
        lbl.setPosition(JXG.COORDS_BY_USER, [nx + 0.45, ny + 0.45]);
        MCS.audio.emit('snap');
        announceState();
        fireChange();
      });

      studentPts.push(pt);
      studentLabels.push(lbl);
      rebuildStudentPolygon();
      MCS.audio.emit('snap');
      announceState();
      fireChange();
    }

    function setGhostVisible(show) {
      if (!ghostPoly) return;
      ghostPoly.setAttribute({ visible: show });
      ghostPts.forEach(function (gp) {
        gp.setAttribute({ visible: show });
      });
      ghostLabels.forEach(function (gl) {
        gl.setAttribute({ visible: show });
      });
      board.update();
    }

    var hintObserver = null;
    var widgetRegion = container.closest('.mcs-widget-region');
    if (widgetRegion && typeof MutationObserver !== 'undefined') {
      hintObserver = new MutationObserver(function () {
        setGhostVisible(widgetRegion.classList.contains('mcs-hint-highlight'));
      });
      hintObserver.observe(widgetRegion, { attributes: true, attributeFilter: ['class'] });
    }

    board.on('down', function (e) {
      if (!enabled) return;
      var usr = board.getUsrCoordsOfMouse(e);
      if (!usr) return;
      var tx = snapCoord(usr[0], snap, xMin, xMax);
      var ty = snapCoord(usr[1], snap, yMin, yMax);
      for (var ni = 0; ni < studentPts.length; ni++) {
        var npt = studentPts[ni];
        if (
          Math.abs(npt.X() - tx) < snap * 0.6 &&
          Math.abs(npt.Y() - ty) < snap * 0.6
        ) {
          removeStudentPoint(ni);
          MCS.audio.emit('click');
          return;
        }
      }
      addStudentPoint(tx, ty);
    });

    function preventTouchScroll(e) {
      if (!enabled) return;
      e.preventDefault();
    }

    boardWrap.addEventListener('touchmove', preventTouchScroll, { passive: false });

    function animateVerticesTo(targets, onDone) {
      cancelTweens();
      if (!targets || !targets.length) {
        if (typeof onDone === 'function') onDone();
        return;
      }

      while (studentPts.length < targets.length) {
        addStudentPoint(targets[studentPts.length].x, targets[studentPts.length].y);
      }
      while (studentPts.length > targets.length) {
        removeStudentPoint(studentPts.length - 1);
      }

      var pending = targets.length;
      if (!pending) {
        if (typeof onDone === 'function') onDone();
        return;
      }

      targets.forEach(function (target, idx) {
        var pt = studentPts[idx];
        var lbl = studentLabels[idx];
        if (!pt) {
          pending -= 1;
          return;
        }
        var startX = pt.X();
        var startY = pt.Y();
        var endX = target.x;
        var endY = target.y;

        if (MCS.prefersReducedMotion()) {
          pt.setPosition(JXG.COORDS_BY_USER, [endX, endY]);
          if (lbl) lbl.setPosition(JXG.COORDS_BY_USER, [endX + 0.45, endY + 0.45]);
          pending -= 1;
          if (pending === 0) {
            rebuildStudentPolygon();
            announceState();
            fireChange();
            if (typeof onDone === 'function') onDone();
          }
          return;
        }

        var tw = MCS.tween({
          duration: 0.8,
          onUpdate: function (t) {
            var cx = startX + (endX - startX) * t;
            var cy = startY + (endY - startY) * t;
            pt.setPosition(JXG.COORDS_BY_USER, [cx, cy]);
            if (lbl) lbl.setPosition(JXG.COORDS_BY_USER, [cx + 0.45, cy + 0.45]);
            board.update();
          },
          onComplete: function () {
            pt.setPosition(JXG.COORDS_BY_USER, [endX, endY]);
            if (lbl) lbl.setPosition(JXG.COORDS_BY_USER, [endX + 0.45, endY + 0.45]);
            pending -= 1;
            if (pending === 0) {
              rebuildStudentPolygon();
              announceState();
              fireChange();
              if (typeof onDone === 'function') onDone();
            }
          },
        });
        activeTweens.push(tw);
      });
      board.update();
    }

    return {
      getValue: function getValue() {
        return { vertices: studentVertices() };
      },

      setValue: function setValue(v) {
        if (!v || !v.vertices) return;
        while (studentPts.length) removeStudentPoint(0);
        v.vertices.forEach(function (vert) {
          addStudentPoint(vert.x, vert.y);
        });
      },

      setEnabled: function setEnabled(on) {
        enabled = !!on;
        studentPts.forEach(function (pt) {
          pt.setAttribute({ fixed: !enabled });
        });
        boardWrap.style.pointerEvents = enabled ? '' : 'none';
        boardWrap.setAttribute('aria-disabled', enabled ? 'false' : 'true');
      },

      showSolution: function showSolution(v) {
        var targets = (v && v.vertices) || targetVertices;
        setGhostVisible(false);
        animateVerticesTo(targets, function () {
          boardWrap.classList.add('mcs-transform-board-solution-glow');
          window.setTimeout(function () {
            boardWrap.classList.remove('mcs-transform-board-solution-glow');
          }, 900);
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
        cancelTweens();
        if (hintObserver) hintObserver.disconnect();
        boardWrap.removeEventListener('touchmove', preventTouchScroll);
        MCS.board.destroy(boardCtx);
        container.innerHTML = '';
        changeCallbacks.length = 0;
        MCS._releaseContainer(container);
      },
    };
  });
})(window.MCS || {});
