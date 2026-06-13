/**
 * MCS space widgets — coordinate-plotter, transform-board (JSXGraph);
 * symmetry-painter (Konva).
 */
(function (MCS) {
  'use strict';

  // ---------------------------------------------------------------------------
  // symmetry-painter (Konva) — Phase 3c
  // ---------------------------------------------------------------------------
  if (typeof Konva !== 'undefined' && MCS.stage) {
    function cellKey(r, c) {
      return r + ',' + c;
    }

    function parseCellKey(key) {
      var parts = key.split(',');
      return { r: parseInt(parts[0], 10), c: parseInt(parts[1], 10) };
    }

    function mirrorCell(r, c, gridSize, axis) {
      if (axis === 'horizontal') {
        return { r: gridSize + 1 - r, c: c };
      }
      return { r: r, c: gridSize + 1 - c };
    }

    function rotateCell90(r, c, gridSize) {
      var center = (gridSize + 1) / 2;
      var dr = r - center;
      var dc = c - center;
      return {
        r: Math.round(center + dc),
        c: Math.round(center - dr),
      };
    }

    function expandRotationalCells(seedCells, gridSize, order) {
      var seen = Object.create(null);
      var out = [];
      seedCells.forEach(function (seed) {
        var cur = { r: seed.r, c: seed.c };
        for (var i = 0; i < order; i++) {
          var key = cellKey(cur.r, cur.c);
          if (
            cur.r >= 1 &&
            cur.r <= gridSize &&
            cur.c >= 1 &&
            cur.c <= gridSize &&
            !seen[key]
          ) {
            seen[key] = true;
            out.push({ r: cur.r, c: cur.c });
          }
          cur = rotateCell90(cur.r, cur.c, gridSize);
        }
      });
      return out;
    }

    function cellsMatch(a, b) {
      if (!a || !b || a.length !== b.length) return false;
      var set = Object.create(null);
      a.forEach(function (p) {
        set[cellKey(p.r, p.c)] = true;
      });
      return b.every(function (p) {
        return set[cellKey(p.r, p.c)];
      });
    }

    MCS.register('symmetry-painter', function symmetryPainterFactory(container, config) {
      config = config || {};
      var mode = config.mode || 'complete-mirror';
      var bandId = config.band || 'C';
      var bandTokens = MCS.band(bandId);
      var gridSize = config.gridSize != null ? config.gridSize : 6;
      var mirrorAxis = config.mirrorAxis || 'vertical';
      var rotationalOrder = config.rotationalOrder != null ? config.rotationalOrder : 4;
      var prefilled = (config.prefilled || []).slice();
      var solutionCells = (config.solution || []).slice();
      var enabled = true;
      var changeCallbacks = [];

      if (!solutionCells.length && prefilled.length) {
        if (mode === 'rotational') {
          solutionCells = expandRotationalCells(prefilled, gridSize, rotationalOrder);
        } else {
          solutionCells = prefilled.map(function (p) {
            return mirrorCell(p.r, p.c, gridSize, mirrorAxis);
          });
        }
      }

      var paintableSet = Object.create(null);
      solutionCells.forEach(function (p) {
        var isPre = prefilled.some(function (pre) {
          return pre.r === p.r && pre.c === p.c;
        });
        if (!isPre) paintableSet[cellKey(p.r, p.c)] = true;
      });

      var studentCells = [];
      var cellNodes = Object.create(null);
      var prefilledSet = Object.create(null);
      prefilled.forEach(function (p) {
        prefilledSet[cellKey(p.r, p.c)] = true;
      });

      container.innerHTML = '';
      container.classList.add('mcs-symmetry-painter');

      var liveRegion = MCS.stage.ariaHost(container);
      liveRegion.textContent =
        mode === 'rotational'
          ? 'Rotational symmetry grid. Tap cells to complete the pattern.'
          : 'Mirror symmetry grid. Tap cells on the open side to complete the reflection.';

      var boardWrap = document.createElement('div');
      boardWrap.className = 'symmetry-board-container mcs-symmetry-painter-board';
      boardWrap.setAttribute('role', 'application');
      boardWrap.tabIndex = 0;
      container.appendChild(boardWrap);

      var cellSize = Math.max(bandTokens.minTouchTarget - 8, 32);
      var gap = 2;
      var gridPx = gridSize * cellSize + (gridSize - 1) * gap + 4;
      var stageHeight = gridPx + 8;

      var stageCtx = MCS.stage.make(boardWrap, {
        size: gridPx,
      });
      var bgLayer = stageCtx.bgLayer;
      var objLayer = stageCtx.objLayer;
      stageCtx.stage.height(stageHeight);

      var theme = MCS.theme();

      function announceState() {
        liveRegion.textContent =
          studentCells.length +
          ' cell' +
          (studentCells.length === 1 ? '' : 's') +
          ' painted.';
      }

      function fireChange() {
        changeCallbacks.forEach(function (cb) {
          try {
            cb({ cells: studentCells.slice() });
          } catch (e) {
            console.warn('symmetry-painter onChange error', e);
          }
        });
      }

      function setCellVisual(key, state) {
        var node = cellNodes[key];
        if (!node) return;
        if (state === 'prefilled') {
          node.fill(theme.accent || '#d97706');
          node.stroke(theme.ink);
          node.opacity(1);
        } else if (state === 'active') {
          node.fill(theme.accent || '#d97706');
          node.stroke(theme.ink);
          node.opacity(0.92);
        } else if (state === 'solution') {
          node.fill(theme.correct || '#059669');
          node.stroke(theme.correct || '#059669');
          node.opacity(0.85);
        } else {
          node.fill(theme.accentSoft || '#f3f4f6');
          node.stroke(theme.gridLine || '#c3c5d9');
          node.opacity(1);
        }
        objLayer.batchDraw();
      }

      function toggleStudentCell(r, c) {
        if (!enabled) return;
        var key = cellKey(r, c);
        if (!paintableSet[key]) return;
        var idx = studentCells.findIndex(function (p) {
          return p.r === r && p.c === c;
        });
        if (idx !== -1) {
          studentCells.splice(idx, 1);
          setCellVisual(key, 'empty');
        } else {
          studentCells.push({ r: r, c: c });
          setCellVisual(key, 'active');
        }
        MCS.audio.emit('click');
        announceState();
        fireChange();
      }

      function drawGrid() {
        bgLayer.destroyChildren();
        objLayer.destroyChildren();
        cellNodes = Object.create(null);

        var stageW = stageCtx.stage.width();
        var offsetX = (stageW - gridPx) / 2 + 2;
        var offsetY = 4;

        bgLayer.add(
          new Konva.Rect({
            x: offsetX - 2,
            y: offsetY - 2,
            width: gridPx,
            height: gridPx - 4,
            fill: theme.gridLine || '#c3c5d9',
            cornerRadius: 6,
            listening: false,
          })
        );

        if (mode === 'complete-mirror') {
          var axisX =
            mirrorAxis === 'vertical'
              ? offsetX + (gridSize / 2) * (cellSize + gap) - gap / 2 - 2
              : null;
          var axisY =
            mirrorAxis === 'horizontal'
              ? offsetY + (gridSize / 2) * (cellSize + gap) - gap / 2 - 2
              : null;
          bgLayer.add(
            new Konva.Line({
              points:
                mirrorAxis === 'vertical'
                  ? [axisX, offsetY, axisX, offsetY + gridPx - 4]
                  : [offsetX, axisY, offsetX + gridPx - 4, axisY],
              stroke: '#dc2626',
              strokeWidth: 4,
              lineCap: 'round',
              listening: false,
            })
          );
        } else {
          var cx = offsetX + gridPx / 2 - 2;
          var cy = offsetY + (gridPx - 4) / 2;
          bgLayer.add(
            new Konva.Circle({
              x: cx,
              y: cy,
              radius: 5,
              stroke: '#dc2626',
              strokeWidth: 2,
              listening: false,
            })
          );
        }

        for (var r = 1; r <= gridSize; r++) {
          for (var c = 1; c <= gridSize; c++) {
            var key = cellKey(r, c);
            var x = offsetX + (c - 1) * (cellSize + gap);
            var y = offsetY + (r - 1) * (cellSize + gap);
            var isPre = !!prefilledSet[key];
            var isPaintable = !!paintableSet[key];
            var isPainted = studentCells.some(function (p) {
              return p.r === r && p.c === c;
            });

            var rect = new Konva.Rect({
              x: x,
              y: y,
              width: cellSize,
              height: cellSize,
              cornerRadius: 3,
              fill: isPre || isPainted ? theme.accent || '#d97706' : theme.accentSoft || '#f3f4f6',
              stroke: theme.gridLine || '#c3c5d9',
              strokeWidth: 1,
              opacity: isPre ? 1 : isPaintable ? 0.92 : 0.55,
            });

            cellNodes[key] = rect;

            if (isPre) {
              rect.listening(false);
            } else if (isPaintable) {
              rect.on('mouseenter', function () {
                if (enabled && stageCtx.stage.container()) {
                  stageCtx.stage.container().style.cursor = 'pointer';
                }
              });
              rect.on('mouseleave', function () {
                if (stageCtx.stage.container()) {
                  stageCtx.stage.container().style.cursor = 'default';
                }
              });
              (function (row, col, cellKeyVal) {
                rect.on('tap click', function () {
                  toggleStudentCell(row, col);
                });
              })(r, c, key);
            } else {
              rect.listening(false);
            }

            objLayer.add(rect);
          }
        }

        bgLayer.batchDraw();
        objLayer.batchDraw();
      }

      drawGrid();

      var resizeHandle = MCS.observeResize(boardWrap, function () {
        drawGrid();
      });

      function applySolutionCells(cells) {
        studentCells = (cells || []).slice();
        Object.keys(cellNodes).forEach(function (key) {
          if (prefilledSet[key]) return;
          var painted = studentCells.some(function (p) {
            return cellKey(p.r, p.c) === key;
          });
          var isSolution = (cells || []).some(function (p) {
            return cellKey(p.r, p.c) === key;
          });
          if (isSolution && painted) {
            setCellVisual(key, 'solution');
          } else if (painted) {
            setCellVisual(key, 'active');
          } else {
            setCellVisual(key, 'empty');
          }
        });
        announceState();
      }

      return {
        getValue: function getValue() {
          return { cells: studentCells.slice() };
        },

        setValue: function setValue(v) {
          if (!v || !v.cells) return;
          studentCells = v.cells.slice();
          drawGrid();
          announceState();
        },

        setEnabled: function setEnabled(on) {
          enabled = !!on;
          boardWrap.style.pointerEvents = enabled ? '' : 'none';
          boardWrap.setAttribute('aria-disabled', enabled ? 'false' : 'true');
        },

        showSolution: function showSolution(v) {
          var target = (v && v.cells) || solutionCells.filter(function (p) {
            return !prefilledSet[cellKey(p.r, p.c)];
          });
          applySolutionCells(target);
          boardWrap.classList.add('mcs-symmetry-painter-solution-glow');
          window.setTimeout(function () {
            boardWrap.classList.remove('mcs-symmetry-painter-solution-glow');
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
          MCS.stage.destroy(stageCtx);
          container.innerHTML = '';
          changeCallbacks.length = 0;
          MCS._releaseContainer(container);
        },
      };
    });
  }

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
    var duoMode = mode === 'plot-duo';
    var ariaTask =
      config.ariaLabel ||
      (manhattanMode
        ? 'Coordinate grid. Tap grid intersections to trace the path from A to B.'
        : duoMode
          ? 'Four-quadrant plane. Plot point A and the translated point A prime.'
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
    var pinA = null;
    var pinB = null;
    var pinAX = 0;
    var pinAY = 0;
    var pinBX = 1;
    var pinBY = 0;
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

    if (duoMode && config.showTranslationVector && markers.length >= 2) {
      var fromM = markers[0];
      var toM = markers[1];
      var fx = fromM.x != null ? fromM.x : 0;
      var fy = fromM.y != null ? fromM.y : 0;
      var tx = toM.x != null ? toM.x : 0;
      var ty = toM.y != null ? toM.y : 0;
      board.create(
        'segment',
        [
          [fx, fy],
          [tx, ty],
        ],
        {
          strokeColor: theme.accent,
          strokeWidth: 2,
          dash: 3,
          fixed: true,
          highlight: false,
          lastarrow: {
            type: 2,
            size: 5,
            color: theme.accent,
          },
        }
      );
      board.update();
    }

    function setDuoPinPosition(which, x, y, animate, onComplete) {
      var targetPin = which === 'a' ? pinA : pinB;
      if (!targetPin) {
        if (typeof onComplete === 'function') onComplete();
        return;
      }
      var tx = snapCoord(x, snap, xMin, xMax);
      var ty = snapCoord(y, snap, yMin, yMax);
      if (activeTween) activeTween.cancel();

      if (!animate || MCS.prefersReducedMotion()) {
        targetPin.setPosition(JXG.COORDS_BY_USER, [tx, ty]);
        targetPin.setAttribute({ size: pinSize });
        if (which === 'a') {
          pinAX = tx;
          pinAY = ty;
        } else {
          pinBX = tx;
          pinBY = ty;
        }
        board.update();
        announce(tx, ty);
        if (typeof onComplete === 'function') onComplete();
        return;
      }

      var startX = targetPin.X();
      var startY = targetPin.Y();
      activeTween = MCS.tween({
        duration: 0.8,
        onUpdate: function (t) {
          targetPin.setPosition(JXG.COORDS_BY_USER, [
            startX + (tx - startX) * t,
            startY + (ty - startY) * t,
          ]);
          board.update();
        },
        onComplete: function () {
          targetPin.setPosition(JXG.COORDS_BY_USER, [tx, ty]);
          targetPin.setAttribute({ size: pinSize });
          if (which === 'a') {
            pinAX = tx;
            pinAY = ty;
          } else {
            pinBX = tx;
            pinBY = ty;
          }
          board.update();
          announce(tx, ty);
          activeTween = null;
          if (typeof onComplete === 'function') onComplete();
        },
      });
    }

    function attachDuoPinHandlers(jxgPin, which) {
      jxgPin.on('down', function () {
        if (!enabled) return;
        jxgPin.setAttribute({ size: pinSize * 1.1 });
        MCS.audio.emit('pickup');
      });
      jxgPin.on('drag', function () {
        if (!enabled) return;
        jxgPin.setPosition(JXG.COORDS_BY_USER, [jxgPin.X(), jxgPin.Y()]);
      });
      jxgPin.on('up', function () {
        if (!enabled) return;
        var sx = snapCoord(jxgPin.X(), snap, xMin, xMax);
        var sy = snapCoord(jxgPin.Y(), snap, yMin, yMax);
        jxgPin.setPosition(JXG.COORDS_BY_USER, [sx, sy]);
        jxgPin.setAttribute({ size: pinSize });
        if (which === 'a') {
          if (sx !== pinAX || sy !== pinAY) {
            pinAX = sx;
            pinAY = sy;
            MCS.audio.emit('snap');
            announce(sx, sy);
            fireChange();
          }
        } else {
          if (sx !== pinBX || sy !== pinBY) {
            pinBX = sx;
            pinBY = sy;
            MCS.audio.emit('snap');
            announce(sx, sy);
            fireChange();
          }
        }
        board.update();
        MCS.audio.emit('drop');
      });
    }

    function nearestDuoPinDist(ux, uy) {
      var da = Math.hypot(ux - pinAX, uy - pinAY);
      var db = Math.hypot(ux - pinBX, uy - pinBY);
      return da <= db ? 'a' : 'b';
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
    } else if (duoMode) {
      var duoStartA =
        config.initialA && config.initialA.x != null
          ? config.initialA
          : { x: config.initialAX != null ? config.initialAX : 0, y: config.initialAY != null ? config.initialAY : 0 };
      var duoStartB =
        config.initialB && config.initialB.x != null
          ? config.initialB
          : { x: config.initialBX != null ? config.initialBX : 1, y: config.initialBY != null ? config.initialBY : 0 };
      pinAX = snapCoord(duoStartA.x, snap, xMin, xMax);
      pinAY = snapCoord(duoStartA.y, snap, yMin, yMax);
      pinBX = snapCoord(duoStartB.x, snap, xMin, xMax);
      pinBY = snapCoord(duoStartB.y, snap, yMin, yMax);

      var tertiaryStroke = theme.tertiary || '#7c3aed';
      var errorStroke = theme.error || '#dc2626';

      pinA = MCS.board.point(boardCtx, {
        coords: [pinAX, pinAY],
        size: pinSize,
        snapToGrid: true,
        snapSizeX: snap,
        snapSizeY: snap,
        fixed: false,
        strokeColor: tertiaryStroke,
        fillColor: 'transparent',
        strokeWidth: 2.5,
      });
      pinB = MCS.board.point(boardCtx, {
        coords: [pinBX, pinBY],
        size: pinSize,
        snapToGrid: true,
        snapSizeX: snap,
        snapSizeY: snap,
        fixed: false,
        strokeColor: errorStroke,
        fillColor: 'transparent',
        strokeWidth: 2.5,
      });

      attachDuoPinHandlers(pinA, 'a');
      attachDuoPinHandlers(pinB, 'b');

      board.on('down', function (e) {
        if (!enabled) return;
        var usr = board.getUsrCoordsOfMouse(e);
        if (!usr) return;
        var nearA =
          Math.abs(usr[0] - pinAX) < snap * 0.75 && Math.abs(usr[1] - pinAY) < snap * 0.75;
        var nearB =
          Math.abs(usr[0] - pinBX) < snap * 0.75 && Math.abs(usr[1] - pinBY) < snap * 0.75;
        if (nearA || nearB) return;
        var tx = snapCoord(usr[0], snap, xMin, xMax);
        var ty = snapCoord(usr[1], snap, yMin, yMax);
        var which = nearestDuoPinDist(tx, ty);
        setDuoPinPosition(which, tx, ty, false);
        MCS.audio.emit('snap');
        fireChange();
      });

      announce(pinAX, pinAY);
    }

    function onKeyDown(e) {
      if (!enabled || readOnly || manhattanMode || duoMode || !pin) return;
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
        if (duoMode) {
          return { a: { x: pinAX, y: pinAY }, b: { x: pinBX, y: pinBY } };
        }
        if (readOnly) return {};
        return { x: currentX, y: currentY };
      },

      setValue: function setValue(v) {
        if (manhattanMode || readOnly || !v) return;
        if (duoMode) {
          if (v.a) setDuoPinPosition('a', v.a.x != null ? v.a.x : 0, v.a.y != null ? v.a.y : 0, false, fireChange);
          if (v.b) setDuoPinPosition('b', v.b.x != null ? v.b.x : 0, v.b.y != null ? v.b.y : 0, false, fireChange);
          return;
        }
        setPinPosition(v.x != null ? v.x : 0, v.y != null ? v.y : 0, false, fireChange);
      },

      setEnabled: function setEnabled(on) {
        enabled = !!on;
        if (pin) pin.setAttribute({ fixed: !enabled || readOnly });
        if (pinA) pinA.setAttribute({ fixed: !enabled });
        if (pinB) pinB.setAttribute({ fixed: !enabled });
        boardWrap.style.pointerEvents = enabled ? '' : 'none';
        boardWrap.setAttribute('aria-disabled', enabled ? 'false' : 'true');
      },

      showSolution: function showSolution(v) {
        if (!v) return;
        if (duoMode) {
          if (v.a) {
            setDuoPinPosition('a', v.a.x, v.a.y, true);
          }
          if (v.b) {
            setDuoPinPosition('b', v.b.x, v.b.y, true, function () {
              if (v.a) flashCrosshair(v.a.x, v.a.y);
              flashCrosshair(v.b.x, v.b.y);
              boardWrap.classList.add('mcs-coordinate-plotter-solution-glow');
              window.setTimeout(function () {
                boardWrap.classList.remove('mcs-coordinate-plotter-solution-glow');
              }, 900);
              fireChange();
            });
          }
          return;
        }
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
