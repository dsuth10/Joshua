/**
 * MCS space widgets — coordinate-plotter, transform-board (JSXGraph);
 * symmetry-painter, pattern-blocks, shape-builder (Konva).
 */
(function (MCS) {
  'use strict';

  function transformBoardSingleStep(container, config) {
    if (typeof Konva === 'undefined' || !MCS.stage) {
      throw new Error('transform-board single-step requires Konva');
    }
    config = config || {};
    var bandId = config.band || 'B';
    var bandTokens = MCS.band(bandId);
    var theme = MCS.theme(true);
    var gridSize = config.gridSize != null ? config.gridSize : 8;
    var cellSize = Math.max(36, bandTokens.minTouchTarget * 0.55);
    var preImage = (config.preImage || [
      { x: 2, y: 2 },
      { x: 2, y: 4 },
      { x: 4, y: 4 },
    ]).map(function (v) {
      return { x: v.x, y: v.y };
    });
    var expectedAction = config.action || 'flip-vertical';
    var slideDx = config.slideDx != null ? config.slideDx : 2;
    var slideDy = config.slideDy != null ? config.slideDy : 0;
    var mirrorX = config.mirrorX != null ? config.mirrorX : 4;
    var rotateCenter = config.rotateCenter || { x: 3, y: 3 };
    var enabled = true;
    var changeCallbacks = [];
    var currentVerts = preImage.map(function (v) {
      return { x: v.x, y: v.y };
    });
    var actionApplied = null;

    function computeTarget(action) {
      if (action === 'flip-vertical') {
        return preImage.map(function (v) {
          return { x: 2 * mirrorX - v.x, y: v.y };
        });
      }
      if (action === 'slide-right' || action === 'slide') {
        return preImage.map(function (v) {
          return { x: v.x + slideDx, y: v.y + slideDy };
        });
      }
      if (action === 'turn-cw' || action === 'turn') {
        var cx = rotateCenter.x;
        var cy = rotateCenter.y;
        return preImage.map(function (v) {
          var dx = v.x - cx;
          var dy = v.y - cy;
          return { x: cx + dy, y: cy - dx };
        });
      }
      return preImage;
    }

    var targetVerts = computeTarget(expectedAction);

    function vertsMatch(a, b) {
      if (!a || !b || a.length !== b.length) return false;
      return a.every(function (v, i) {
        return v.x === b[i].x && v.y === b[i].y;
      });
    }

    container.innerHTML = '';
    container.classList.add('mcs-transform-board', 'mcs-transform-board-single-step');

    var liveRegion = MCS.stage.ariaHost(container);
    var boardWrap = document.createElement('div');
    boardWrap.className = 'mcs-transform-board-canvas';
    boardWrap.setAttribute('role', 'application');
    boardWrap.setAttribute('aria-label', 'Use Flip, Slide, or Turn to move the shape');
    container.appendChild(boardWrap);

    var controls = document.createElement('div');
    controls.className = 'mcs-transform-board-controls flex-row gap-12 justify-center';
    container.appendChild(controls);

    var btnFlip = document.createElement('button');
    btnFlip.type = 'button';
    btnFlip.className = 'btn-terminal band-a-action-btn mcs-transform-btn';
    btnFlip.textContent = 'Flip ↔';
    btnFlip.setAttribute('aria-label', 'Flip the shape');
    var btnSlide = document.createElement('button');
    btnSlide.type = 'button';
    btnSlide.className = 'btn-terminal band-a-action-btn mcs-transform-btn';
    btnSlide.textContent = 'Slide →';
    btnSlide.setAttribute('aria-label', 'Slide the shape');
    var btnTurn = document.createElement('button');
    btnTurn.type = 'button';
    btnTurn.className = 'btn-terminal band-a-action-btn mcs-transform-btn';
    btnTurn.textContent = 'Turn ↻';
    btnTurn.setAttribute('aria-label', 'Turn the shape one quarter turn');
    controls.appendChild(btnFlip);
    controls.appendChild(btnSlide);
    controls.appendChild(btnTurn);

    var stageWidth = gridSize * cellSize + 24;
    var stageHeight = stageWidth;
    var host = document.createElement('div');
    host.className = 'mcs-konva-host';
    host.style.width = stageWidth + 'px';
    host.style.height = stageHeight + 'px';
    boardWrap.appendChild(host);

    var stage = new Konva.Stage({ container: host, width: stageWidth, height: stageHeight });
    var gridLayer = new Konva.Layer();
    var shapeLayer = new Konva.Layer();
    stage.add(gridLayer);
    stage.add(shapeLayer);

    function gridToPx(v) {
      return { x: 12 + v.x * cellSize, y: stageHeight - 12 - v.y * cellSize };
    }

    function drawGrid() {
      gridLayer.destroyChildren();
      var gi;
      for (gi = 0; gi <= gridSize; gi++) {
        var gx = 12 + gi * cellSize;
        var gy = stageHeight - 12 - gi * cellSize;
        gridLayer.add(
          new Konva.Line({
            points: [12, gy, stageWidth - 12, gy],
            stroke: theme.gridLine,
            strokeWidth: 1,
            listening: false,
          })
        );
        gridLayer.add(
          new Konva.Line({
            points: [gx, 12, gx, stageHeight - 12],
            stroke: theme.gridLine,
            strokeWidth: 1,
            listening: false,
          })
        );
      }
      if (expectedAction === 'flip-vertical') {
        var mx = 12 + mirrorX * cellSize;
        gridLayer.add(
          new Konva.Line({
            points: [mx, 12, mx, stageHeight - 12],
            stroke: theme.error,
            strokeWidth: 2,
            dash: [8, 6],
            listening: false,
          })
        );
      }
      gridLayer.batchDraw();
    }

    function drawShape(verts, stroke, fill) {
      var pts = [];
      verts.forEach(function (v) {
        var p = gridToPx(v);
        pts.push(p.x, p.y);
      });
      return new Konva.Line({
        points: pts,
        closed: true,
        fill: fill || theme.accentSoft,
        stroke: stroke || theme.accent,
        strokeWidth: 2.5,
        listening: false,
      });
    }

    function redrawShape() {
      shapeLayer.destroyChildren();
      shapeLayer.add(drawShape(preImage, theme.gridLine, 'rgba(148,163,184,0.15)'));
      shapeLayer.add(drawShape(currentVerts, theme.accent, theme.accentSoft));
      shapeLayer.batchDraw();
    }

    function applyAction(action) {
      if (!enabled || actionApplied) return;
      actionApplied = action;
      if (action === 'flip') currentVerts = computeTarget('flip-vertical');
      else if (action === 'slide') currentVerts = computeTarget('slide-right');
      else if (action === 'turn') currentVerts = computeTarget('turn-cw');
      MCS.audio.emit('snap');
      redrawShape();
      notifyChange();
    }

    function announce() {
      liveRegion.textContent = actionApplied
        ? actionApplied.charAt(0).toUpperCase() + actionApplied.slice(1) + ' applied'
        : 'Choose Flip, Slide, or Turn';
    }

    function notifyChange() {
      announce();
      changeCallbacks.forEach(function (cb) {
        try {
          cb(api.getValue());
        } catch (e) {
          console.warn('transform-board single-step onChange error', e);
        }
      });
    }

    btnFlip.addEventListener('click', function () {
      applyAction('flip');
    });
    btnSlide.addEventListener('click', function () {
      applyAction('slide');
    });
    btnTurn.addEventListener('click', function () {
      applyAction('turn');
    });

    drawGrid();
    redrawShape();
    announce();

    var api = {
      getValue: function getValue() {
        return {
          vertices: currentVerts.map(function (v) {
            return { x: v.x, y: v.y };
          }),
          action: actionApplied,
          mode: 'single-step',
        };
      },
      setValue: function setValue(v) {
        if (v && v.reset) {
          currentVerts = preImage.map(function (p) {
            return { x: p.x, y: p.y };
          });
          actionApplied = null;
        } else if (v && v.vertices) {
          currentVerts = v.vertices.map(function (p) {
            return { x: p.x, y: p.y };
          });
          actionApplied = v.action || null;
        }
        redrawShape();
        notifyChange();
      },
      setEnabled: function setEnabled(on) {
        enabled = !!on;
        btnFlip.disabled = !enabled;
        btnSlide.disabled = !enabled;
        btnTurn.disabled = !enabled;
        boardWrap.style.opacity = enabled ? '1' : '0.65';
      },
      showSolution: function showSolution(v) {
        var verts = (v && v.vertices) || targetVerts;
        var act =
          v && v.action
            ? v.action
            : expectedAction === 'flip-vertical'
              ? 'flip'
              : expectedAction.indexOf('slide') === 0
                ? 'slide'
                : 'turn';
        api.setValue({ vertices: verts, action: act });
        boardWrap.classList.add('mcs-transform-board-solution-glow');
        window.setTimeout(function () {
          boardWrap.classList.remove('mcs-transform-board-solution-glow');
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

    return api;
  }

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
      var paintableList = [];
      var focusIdx = 0;
      var solutionTweenIds = [];
      prefilled.forEach(function (p) {
        prefilledSet[cellKey(p.r, p.c)] = true;
      });
      Object.keys(paintableSet).forEach(function (key) {
        paintableList.push(parseCellKey(key));
      });
      paintableList.sort(function (a, b) {
        return a.r === b.r ? a.c - b.c : a.r - b.r;
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
        var idx = paintableIndexAt(r, c);
        if (idx !== -1) {
          focusIdx = idx;
          if (document.activeElement === boardWrap) syncFocusRing();
        }
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
        if (document.activeElement === boardWrap) syncFocusRing();
      }

      drawGrid();

      var resizeHandle = MCS.observeResize(boardWrap, function () {
        drawGrid();
      });

      function applySolutionCells(cells, useSolutionStyle) {
        studentCells = (cells || []).slice();
        Object.keys(cellNodes).forEach(function (key) {
          if (prefilledSet[key]) return;
          var painted = studentCells.some(function (p) {
            return cellKey(p.r, p.c) === key;
          });
          if (painted && useSolutionStyle) {
            setCellVisual(key, 'solution');
          } else if (painted) {
            setCellVisual(key, 'active');
          } else {
            setCellVisual(key, 'empty');
          }
        });
        announceState();
      }

      function cancelSolutionTween() {
        solutionTweenIds.forEach(function (id) {
          window.clearTimeout(id);
        });
        solutionTweenIds.length = 0;
      }

      function paintableIndexAt(r, c) {
        return paintableList.findIndex(function (p) {
          return p.r === r && p.c === c;
        });
      }

      function syncFocusRing() {
        if (!paintableList.length) return;
        if (focusIdx < 0) focusIdx = 0;
        if (focusIdx >= paintableList.length) focusIdx = paintableList.length - 1;
        var focus = paintableList[focusIdx];
        Object.keys(cellNodes).forEach(function (key) {
          var node = cellNodes[key];
          if (!node) return;
          var parts = parseCellKey(key);
          var isFocus = focus && parts.r === focus.r && parts.c === focus.c;
          node.stroke(isFocus ? theme.focusRing || '#2563eb' : theme.gridLine || '#c3c5d9');
          node.strokeWidth(isFocus ? 3 : 1);
        });
        objLayer.batchDraw();
      }

      function onBoardKeyDown(e) {
        if (!enabled || !paintableList.length) return;
        var focus = paintableList[focusIdx];
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          focusIdx = (focusIdx + 1) % paintableList.length;
          syncFocusRing();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          focusIdx = (focusIdx - 1 + paintableList.length) % paintableList.length;
          syncFocusRing();
        } else if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          if (focus) toggleStudentCell(focus.r, focus.c);
        }
      }

      boardWrap.addEventListener('keydown', onBoardKeyDown);
      boardWrap.addEventListener('focus', function () {
        boardWrap.classList.add('mcs-symmetry-painter-focused');
        syncFocusRing();
      });
      boardWrap.addEventListener('blur', function () {
        boardWrap.classList.remove('mcs-symmetry-painter-focused');
        Object.keys(cellNodes).forEach(function (key) {
          var node = cellNodes[key];
          if (!node || prefilledSet[key]) return;
          node.stroke(theme.gridLine || '#c3c5d9');
          node.strokeWidth(1);
        });
        objLayer.batchDraw();
      });

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
          cancelSolutionTween();
          var target = (v && v.cells) || solutionCells.filter(function (p) {
            return !prefilledSet[cellKey(p.r, p.c)];
          });
          var toPaint = target.filter(function (p) {
            return paintableSet[cellKey(p.r, p.c)];
          });

          function finishSolution() {
            applySolutionCells(target, true);
            boardWrap.classList.add('mcs-symmetry-painter-solution-glow');
            window.setTimeout(function () {
              boardWrap.classList.remove('mcs-symmetry-painter-solution-glow');
            }, 900);
            fireChange();
          }

          if (!toPaint.length || MCS.prefersReducedMotion()) {
            finishSolution();
            return;
          }

          studentCells = [];
          Object.keys(cellNodes).forEach(function (key) {
            if (!prefilledSet[key]) setCellVisual(key, 'empty');
          });

          var stepMs = Math.max(80, Math.floor(800 / toPaint.length));
          toPaint.forEach(function (cell, idx) {
            var id = window.setTimeout(function () {
              if (!studentCells.some(function (p) {
                return p.r === cell.r && p.c === cell.c;
              })) {
                studentCells.push({ r: cell.r, c: cell.c });
              }
              setCellVisual(cellKey(cell.r, cell.c), 'solution');
              announceState();
              if (idx === toPaint.length - 1) finishSolution();
            }, idx * stepMs);
            solutionTweenIds.push(id);
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
          cancelSolutionTween();
          boardWrap.removeEventListener('keydown', onBoardKeyDown);
          if (resizeHandle) resizeHandle.disconnect();
          MCS.stage.destroy(stageCtx);
          container.innerHTML = '';
          changeCallbacks.length = 0;
          MCS._releaseContainer(container);
        },
      };
    });

    // -------------------------------------------------------------------------
    // pattern-blocks — continue-pattern (Phase 5.6 — F6 repeating pattern)
    // -------------------------------------------------------------------------

    var PATTERN_PIECE_DEFS = {
      'blue-square': { shape: 'square', fill: '#3b82f6', stroke: '#1d4ed8', label: 'blue square' },
      'yellow-triangle': { shape: 'triangle', fill: '#fbbf24', stroke: '#d97706', label: 'yellow triangle' },
      'green-circle': { shape: 'circle', fill: '#22c55e', stroke: '#15803d', label: 'green circle' },
    };

    function patternBlocksShuffle(arr) {
      var copy = arr.slice();
      for (var i = copy.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = copy[i];
        copy[i] = copy[j];
        copy[j] = tmp;
      }
      return copy;
    }

    function patternBlocksUsableWidth(el) {
      var node = el;
      while (node) {
        if (node.clientWidth > 0) return node.clientWidth;
        node = node.parentElement;
      }
      return 320;
    }

    function patternBlocksAddShape(group, pieceId, size) {
      var def = PATTERN_PIECE_DEFS[pieceId] || PATTERN_PIECE_DEFS['blue-square'];
      var half = size / 2;
      if (def.shape === 'square') {
        group.add(
          new Konva.Rect({
            x: -half,
            y: -half,
            width: size,
            height: size,
            fill: def.fill,
            stroke: def.stroke,
            strokeWidth: 2,
            cornerRadius: 6,
          })
        );
      } else if (def.shape === 'circle') {
        group.add(
          new Konva.Circle({
            x: 0,
            y: 0,
            radius: half,
            fill: def.fill,
            stroke: def.stroke,
            strokeWidth: 2,
          })
        );
      } else {
        group.add(
          new Konva.RegularPolygon({
            x: 0,
            y: 0,
            sides: 3,
            radius: half,
            fill: def.fill,
            stroke: def.stroke,
            strokeWidth: 2,
          })
        );
      }
    }

    function patternBlocksContinuePattern(container, config) {
      config = config || {};
      var bandId = config.band || 'A';
      var bandTokens = MCS.band(bandId);
      var sequence = config.sequence || ['blue-square', 'yellow-triangle', 'blue-square', 'yellow-triangle'];
      var blankCount = config.blankCount != null ? config.blankCount : 2;
      var trayIds = config.tray || patternBlocksShuffle(sequence.slice(0, blankCount).concat(sequence.slice(0, blankCount)));
      var theme = MCS.theme(true);
      var enabled = true;
      var changeCallbacks = [];
      var dragHandles = [];

      var pieceSize = Math.max(bandTokens.minTouchTarget - 8, bandId === 'A' ? 56 : 48);
      var gap = 10;
      var slotCount = sequence.length + blankCount;
      var padding = 12;

      container.innerHTML = '';
      container.classList.add('mcs-pattern-blocks', 'mcs-pattern-blocks-continue');

      var liveRegion = MCS.stage.ariaHost(container);
      var boardWrap = document.createElement('div');
      boardWrap.className = 'mcs-pattern-blocks-board';
      boardWrap.setAttribute('role', 'application');
      boardWrap.setAttribute('aria-label', 'Drag blocks to continue the repeating pattern');
      boardWrap.tabIndex = 0;
      container.appendChild(boardWrap);

      var laneLabel = document.createElement('div');
      laneLabel.className = 'mcs-pattern-blocks-lane-label';
      laneLabel.textContent = 'Continue the pattern →';
      container.insertBefore(laneLabel, boardWrap);

      var trayLabel = document.createElement('div');
      trayLabel.className = 'mcs-pattern-blocks-tray-label';
      trayLabel.textContent = 'Pattern blocks';
      container.appendChild(trayLabel);

      var resetBtn = document.createElement('button');
      resetBtn.type = 'button';
      resetBtn.className = 'btn-terminal mcs-pattern-blocks-reset';
      resetBtn.textContent = '↺ Reset';
      resetBtn.setAttribute('aria-label', 'Reset all blocks to the tray');
      container.appendChild(resetBtn);

      var stageWidth = Math.min(Math.max(patternBlocksUsableWidth(container), 300), 540);
      var laneHeight = Math.round(pieceSize + padding * 4);
      var trayHeight = Math.round(pieceSize + padding * 3);
      var stageHeight = laneHeight + trayHeight + 20;

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

      if (stage.content) {
        stage.content.addEventListener('touchmove', function (e) {
          e.preventDefault();
        }, { passive: false });
      }

      var laneRect = {
        x: padding,
        y: padding,
        width: stageWidth - padding * 2,
        height: laneHeight - padding,
      };
      var trayRect = {
        x: padding,
        y: laneHeight + 10,
        width: stageWidth - padding * 2,
        height: trayHeight - 8,
      };

      bgLayer.add(
        new Konva.Rect({
          x: laneRect.x,
          y: laneRect.y,
          width: laneRect.width,
          height: laneRect.height,
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

      function slotCenters(rect, count) {
        var totalGap = gap * (count - 1);
        var slotW = (rect.width - totalGap) / count;
        var centres = [];
        var i;
        for (i = 0; i < count; i++) {
          centres.push({
            x: rect.x + slotW * i + slotW / 2,
            y: rect.y + rect.height / 2,
            slotW: slotW,
          });
        }
        return centres;
      }

      var laneSlots = slotCenters(laneRect, slotCount);
      var traySlots = slotCenters(trayRect, trayIds.length);
      var blankStart = sequence.length;

      function drawLaneMarkers() {
        laneSlots.forEach(function (slot, idx) {
          if (idx >= blankStart) {
            bgLayer.add(
              new Konva.Rect({
                x: slot.x - (slot.slotW - 6) / 2,
                y: laneRect.y + 6,
                width: slot.slotW - 6,
                height: laneRect.height - 12,
                fill: 'rgba(255,255,255,0.45)',
                stroke: theme.accent,
                strokeWidth: 1.5,
                dash: [6, 4],
                cornerRadius: 8,
                listening: false,
              })
            );
          }
        });
      }

      drawLaneMarkers();

      var blankAssignments = [];
      var i;
      for (i = 0; i < blankCount; i++) blankAssignments.push(null);

      var trayPieces = trayIds.map(function (pieceId, idx) {
        return {
          instanceId: 'tray-' + idx,
          pieceId: pieceId,
          trayIndex: idx,
          blankIndex: -1,
          node: null,
        };
      });

      var lockedNodes = [];

      sequence.forEach(function (pieceId, idx) {
        var slot = laneSlots[idx];
        var group = new Konva.Group({ x: slot.x, y: slot.y, listening: false });
        patternBlocksAddShape(group, pieceId, pieceSize);
        lockedNodes.push(group);
        objLayer.add(group);
      });

      function positionForTrayPiece(piece) {
        var ti = piece.trayIndex >= 0 ? piece.trayIndex : 0;
        return traySlots[Math.min(ti, traySlots.length - 1)];
      }

      function positionForBlank(blankIndex) {
        return laneSlots[blankStart + blankIndex];
      }

      function makeTrayNode(piece) {
        var pos = positionForTrayPiece(piece);
        var group = new Konva.Group({
          x: pos.x,
          y: pos.y,
          name: piece.instanceId,
        });
        patternBlocksAddShape(group, piece.pieceId, pieceSize);
        piece.node = group;
        objLayer.add(group);

        var handle = MCS.stage.draggable(group, {
          enabled: enabled,
          onSnap: function onSnap(node) {
            var cx = node.x();
            var cy = node.y();
            var nearestBlank = -1;
            var nearestBlankDist = Infinity;
            var bi;
            for (bi = 0; bi < blankCount; bi++) {
              var bslot = positionForBlank(bi);
              var dx = cx - bslot.x;
              var dy = cy - bslot.y;
              var dist = dx * dx + dy * dy;
              if (dist < nearestBlankDist) {
                nearestBlankDist = dist;
                nearestBlank = bi;
              }
            }

            var inLane =
              cx >= laneRect.x &&
              cx <= laneRect.x + laneRect.width &&
              cy >= laneRect.y &&
              cy <= laneRect.y + laneRect.height;
            var inTray =
              cx >= trayRect.x &&
              cx <= trayRect.x + trayRect.width &&
              cy >= trayRect.y &&
              cy <= trayRect.y + trayRect.height;

            if (inLane && nearestBlank >= 0 && nearestBlankDist < pieceSize * pieceSize * 2.5) {
              var prior = blankAssignments[nearestBlank];
              if (prior && prior !== piece.instanceId) {
                var priorPiece = trayPieces.filter(function (p) {
                  return p.instanceId === prior;
                })[0];
                if (priorPiece) {
                  priorPiece.blankIndex = -1;
                  priorPiece.trayIndex = piece.trayIndex >= 0 ? piece.trayIndex : 0;
                  var ppos = positionForTrayPiece(priorPiece);
                  if (!MCS.prefersReducedMotion()) {
                    priorPiece.node.to({ x: ppos.x, y: ppos.y, duration: 0.12 });
                  } else {
                    priorPiece.node.position(ppos);
                  }
                }
              } else if (piece.blankIndex >= 0) {
                blankAssignments[piece.blankIndex] = null;
              }
              blankAssignments[nearestBlank] = piece.instanceId;
              piece.blankIndex = nearestBlank;
              piece.trayIndex = -1;
            } else if (inTray || !inLane) {
              if (piece.blankIndex >= 0) {
                blankAssignments[piece.blankIndex] = null;
                piece.blankIndex = -1;
              }
              var nearestTray = 0;
              var nearestTrayDist = Infinity;
              traySlots.forEach(function (slot, idx) {
                var dx2 = cx - slot.x;
                var dy2 = cy - slot.y;
                var dist2 = dx2 * dx2 + dy2 * dy2;
                if (dist2 < nearestTrayDist) {
                  nearestTrayDist = dist2;
                  nearestTray = idx;
                }
              });
              piece.trayIndex = nearestTray;
            }

            relayoutTrayIndices();
            var snapPos =
              piece.blankIndex >= 0 ? positionForBlank(piece.blankIndex) : positionForTrayPiece(piece);
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
        dragHandles.push(handle);
      }

      trayPieces.forEach(makeTrayNode);
      bgLayer.draw();
      objLayer.draw();

      function getBlanks() {
        return blankAssignments.map(function (instId) {
          if (!instId) return null;
          var piece = trayPieces.filter(function (p) {
            return p.instanceId === instId;
          })[0];
          return piece ? piece.pieceId : null;
        });
      }

      function filledCount() {
        return blankAssignments.filter(function (id) {
          return id != null;
        }).length;
      }

      var instanceApi = {
        getValue: function getValue() {
          return {
            mode: 'continue-pattern',
            blanks: getBlanks(),
            filled: filledCount(),
          };
        },
      };

      function announceState() {
        var n = filledCount();
        liveRegion.textContent =
          n === 0
            ? 'No blocks placed in the pattern yet'
            : n + ' of ' + blankCount + ' pattern blocks placed';
      }

      function notifyChange() {
        announceState();
        changeCallbacks.forEach(function (cb) {
          try {
            cb(instanceApi.getValue());
          } catch (e) {
            console.warn('pattern-blocks onChange error', e);
          }
        });
      }

      function relayoutTrayIndices() {
        var inTray = trayPieces.filter(function (p) {
          return p.blankIndex < 0;
        });
        inTray.forEach(function (p, idx) {
          p.trayIndex = idx;
        });
      }

      function relayoutAll() {
        relayoutTrayIndices();
        trayPieces.forEach(function (piece) {
          if (!piece.node) return;
          var pos =
            piece.blankIndex >= 0 ? positionForBlank(piece.blankIndex) : positionForTrayPiece(piece);
          piece.node.position(pos);
        });
        objLayer.batchDraw();
      }

      function resetToTray() {
        blankAssignments = [];
        for (i = 0; i < blankCount; i++) blankAssignments.push(null);
        var order = patternBlocksShuffle(
          trayPieces.map(function (p) {
            return p.instanceId;
          })
        );
        order.forEach(function (instId, idx) {
          var piece = trayPieces.filter(function (p) {
            return p.instanceId === instId;
          })[0];
          if (!piece) return;
          piece.blankIndex = -1;
          piece.trayIndex = idx;
        });
        relayoutAll();
        notifyChange();
      }

      resetBtn.addEventListener('click', function () {
        if (!enabled) return;
        MCS.audio.emit('tick');
        resetToTray();
      });

      notifyChange();

      var resizeHandle = MCS.observeResize(container, function () {
        stageWidth = Math.min(Math.max(patternBlocksUsableWidth(container), 300), 540);
        laneHeight = Math.round(pieceSize + padding * 4);
        trayHeight = Math.round(pieceSize + padding * 3);
        stageHeight = laneHeight + trayHeight + 20;
        host.style.width = stageWidth + 'px';
        host.style.height = stageHeight + 'px';
        stage.width(stageWidth);
        stage.height(stageHeight);
        laneRect.width = stageWidth - padding * 2;
        trayRect.y = laneHeight + 10;
        trayRect.width = stageWidth - padding * 2;
        laneSlots = slotCenters(laneRect, slotCount);
        traySlots = slotCenters(trayRect, trayIds.length);
        lockedNodes.forEach(function (group, idx) {
          var slot = laneSlots[idx];
          if (slot) group.position({ x: slot.x, y: slot.y });
        });
        relayoutAll();
        bgLayer.batchDraw();
      });

      function setDragEnabled(on) {
        dragHandles.forEach(function (h) {
          if (h && typeof h.setEnabled === 'function') h.setEnabled(on);
        });
      }

      function placeBlankPiece(pieceId, blankIndex, onDone) {
        var piece = null;
        var pi;
        for (pi = 0; pi < trayPieces.length; pi++) {
          if (trayPieces[pi].pieceId === pieceId && trayPieces[pi].blankIndex < 0) {
            piece = trayPieces[pi];
            break;
          }
        }
        if (!piece) {
          if (typeof onDone === 'function') onDone();
          return;
        }
        if (blankAssignments[blankIndex]) {
          var oldId = blankAssignments[blankIndex];
          var oldPiece = trayPieces.filter(function (p) {
            return p.instanceId === oldId;
          })[0];
          if (oldPiece) {
            oldPiece.blankIndex = -1;
            oldPiece.trayIndex = piece.trayIndex;
          }
        }
        blankAssignments[blankIndex] = piece.instanceId;
        piece.blankIndex = blankIndex;
        piece.trayIndex = -1;
        relayoutTrayIndices();
        var pos = positionForBlank(blankIndex);
        if (!MCS.prefersReducedMotion()) {
          piece.node.to({
            x: pos.x,
            y: pos.y,
            duration: 0.35,
            onFinish: function () {
              objLayer.batchDraw();
              if (typeof onDone === 'function') onDone();
            },
          });
        } else {
          piece.node.position(pos);
          objLayer.batchDraw();
          if (typeof onDone === 'function') onDone();
        }
      }

      return {
        getValue: instanceApi.getValue,

        setValue: function setValue(v) {
          if (!v) return;
          if (v.reset) {
            resetToTray();
            return;
          }
          if (v.blanks && v.blanks.length) {
            blankAssignments = [];
            for (i = 0; i < blankCount; i++) blankAssignments.push(null);
            trayPieces.forEach(function (p) {
              p.blankIndex = -1;
            });
            v.blanks.forEach(function (pieceId, idx) {
              if (!pieceId) return;
              var piece = trayPieces.filter(function (p) {
                return p.pieceId === pieceId && p.blankIndex < 0;
              })[0];
              if (!piece) return;
              blankAssignments[idx] = piece.instanceId;
              piece.blankIndex = idx;
              piece.trayIndex = -1;
            });
            relayoutTrayIndices();
            relayoutAll();
            notifyChange();
          }
        },

        setEnabled: function setEnabled(on) {
          enabled = !!on;
          boardWrap.style.pointerEvents = enabled ? '' : 'none';
          resetBtn.disabled = !enabled;
          setDragEnabled(enabled);
        },

        showSolution: function showSolution(v) {
          if (!v || !v.blanks) return;
          var steps = v.blanks.map(function (pieceId, idx) {
            return { pieceId: pieceId, blankIndex: idx };
          });
          var step = 0;
          function next() {
            if (step >= steps.length) {
              boardWrap.classList.add('mcs-pattern-blocks-solution-glow');
              window.setTimeout(function () {
                boardWrap.classList.remove('mcs-pattern-blocks-solution-glow');
              }, 900);
              notifyChange();
              return;
            }
            var s = steps[step];
            placeBlankPiece(s.pieceId, s.blankIndex, function () {
              step++;
              window.setTimeout(next, MCS.prefersReducedMotion() ? 0 : 280);
            });
          }
          next();
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
          if (resizeHandle) resizeHandle.disconnect();
          stage.destroy();
          container.innerHTML = '';
          changeCallbacks.length = 0;
          dragHandles.length = 0;
          MCS._releaseContainer(container);
        },
      };
    }

    MCS.register('pattern-blocks', function patternBlocksFactory(container, config) {
      config = config || {};
      var mode = config.mode || 'continue-pattern';
      if (mode === 'continue-pattern') return patternBlocksContinuePattern(container, config);
      throw new Error('pattern-blocks: unknown mode "' + mode + '"');
    });

    function vertexKey(c, r) {
      return c + ',' + r;
    }

    function verticesMatch(a, b) {
      if (!a || !b || a.length !== b.length) return false;
      var set = Object.create(null);
      a.forEach(function (v) {
        set[vertexKey(v[0], v[1])] = true;
      });
      return b.every(function (v) {
        return set[vertexKey(v[0], v[1])];
      });
    }

    function shapeBuilderCopyShape(container, config) {
      config = config || {};
      var bandId = config.band || 'A';
      var bandTokens = MCS.band(bandId);
      var cols = config.cols != null ? config.cols : 6;
      var rows = config.rows != null ? config.rows : 5;
      var buildOffset = config.buildColOffset != null ? config.buildColOffset : 3;
      var referenceVertices = (config.referenceVertices || []).map(function (v) {
        return [v[0], v[1]];
      });
      var targetVertices = (config.targetVertices || []).map(function (v) {
        return [v[0], v[1]];
      });
      if (!targetVertices.length && referenceVertices.length) {
        targetVertices = referenceVertices.map(function (v) {
          return [v[0] + buildOffset, v[1]];
        });
      }
      var shapeLabel = config.shapeLabel || config.shape || 'shape';
      var theme = MCS.theme(true);
      var enabled = true;
      var changeCallbacks = [];
      var studentVertices = [];

      container.innerHTML = '';
      container.classList.add('mcs-shape-builder', 'mcs-shape-builder-copy');

      var liveRegion = MCS.stage.ariaHost(container);
      var boardWrap = document.createElement('div');
      boardWrap.className = 'mcs-shape-builder-board';
      boardWrap.setAttribute('role', 'application');
      boardWrap.setAttribute('aria-label', 'Copy the ' + shapeLabel + ' on the pegboard');
      container.appendChild(boardWrap);

      var caption = document.createElement('div');
      caption.className = 'mcs-shape-builder-caption';
      caption.textContent = 'Tap pegs on the right to copy the ' + shapeLabel + '.';
      container.appendChild(caption);

      var cellPitch = Math.max(bandTokens.minTouchTarget, bandId === 'A' ? 68 : 56);
      var padding = 16;
      var stageW = padding * 2 + cols * cellPitch;
      var stageH = padding * 2 + rows * cellPitch + 24;
      var pegRadius = Math.max(14, bandTokens.minTouchTarget / 4.5);

      var host = document.createElement('div');
      host.className = 'mcs-konva-host';
      host.style.width = stageW + 'px';
      host.style.height = stageH + 'px';
      boardWrap.appendChild(host);

      var stage = new Konva.Stage({ container: host, width: stageW, height: stageH });
      var layer = new Konva.Layer();
      stage.add(layer);

      function pegXY(c, r) {
        return {
          x: padding + c * cellPitch + cellPitch / 2,
          y: padding + r * cellPitch + cellPitch / 2,
        };
      }

      function polygonPoints(verts) {
        var pts = [];
        verts.forEach(function (v) {
          var p = pegXY(v[0], v[1]);
          pts.push(p.x, p.y);
        });
        return pts;
      }

      function announce() {
        liveRegion.textContent =
          studentVertices.length +
          ' of ' +
          targetVertices.length +
          ' pegs placed for the ' +
          shapeLabel;
      }

      function notifyChange() {
        announce();
        changeCallbacks.forEach(function (cb) {
          try {
            cb(api.getValue());
          } catch (e) {
            console.warn('shape-builder onChange error', e);
          }
        });
      }

      function isBuildCol(c) {
        return c >= buildOffset;
      }

      function drawBoard() {
        layer.destroyChildren();

        layer.add(
          new Konva.Line({
            points: [
              padding + buildOffset * cellPitch - cellPitch / 2,
              padding - 4,
              padding + buildOffset * cellPitch - cellPitch / 2,
              padding + rows * cellPitch + 4,
            ],
            stroke: theme.gridLine,
            strokeWidth: 2,
            dash: [8, 6],
            listening: false,
          })
        );

        layer.add(
          new Konva.Text({
            x: padding,
            y: stageH - 20,
            width: buildOffset * cellPitch,
            align: 'center',
            text: 'Copy this',
            fontSize: 12,
            fontFamily: 'Work Sans, sans-serif',
            fontStyle: '600',
            fill: theme.gridLine,
            listening: false,
          })
        );
        layer.add(
          new Konva.Text({
            x: padding + buildOffset * cellPitch,
            y: stageH - 20,
            width: (cols - buildOffset) * cellPitch,
            align: 'center',
            text: 'Your shape',
            fontSize: 12,
            fontFamily: 'Work Sans, sans-serif',
            fontStyle: '600',
            fill: theme.gridLine,
            listening: false,
          })
        );

        if (referenceVertices.length >= 3) {
          layer.add(
            new Konva.Line({
              points: polygonPoints(referenceVertices),
              closed: true,
              fill: theme.accentSoft,
              stroke: theme.accent,
              strokeWidth: 2.5,
              opacity: 0.92,
              listening: false,
            })
          );
        }

        if (studentVertices.length >= 2) {
          layer.add(
            new Konva.Line({
              points: polygonPoints(studentVertices),
              closed: studentVertices.length >= 3,
              stroke: theme.accent,
              strokeWidth: 3,
              lineJoin: 'round',
              listening: false,
            })
          );
        }

        var r;
        var c;
        for (r = 0; r < rows; r++) {
          for (c = 0; c < cols; c++) {
            (function (col, row) {
              var pos = pegXY(col, row);
              var isStudent = studentVertices.some(function (v) {
                return v[0] === col && v[1] === row;
              });
              var isRef = referenceVertices.some(function (v) {
                return v[0] === col && v[1] === row;
              });
              var canTap = isBuildCol(col);
              var peg = new Konva.Circle({
                x: pos.x,
                y: pos.y,
                radius: pegRadius,
                fill: isStudent ? theme.accent : isRef ? theme.accentSoft : '#ffffff',
                stroke: isStudent ? theme.ink : theme.gridLine,
                strokeWidth: isStudent ? 2.5 : 1.5,
                listening: canTap,
              });
              if (canTap) {
                peg.on('click tap', function () {
                  if (!enabled) return;
                  var idx = studentVertices.findIndex(function (v) {
                    return v[0] === col && v[1] === row;
                  });
                  if (idx >= 0) {
                    studentVertices.splice(idx, 1);
                    MCS.audio.emit('tick');
                  } else if (studentVertices.length < targetVertices.length) {
                    studentVertices.push([col, row]);
                    MCS.audio.emit('drop');
                  }
                  drawBoard();
                  notifyChange();
                });
              }
              layer.add(peg);
            })(c, r);
          }
        }

        layer.batchDraw();
      }

      drawBoard();
      announce();

      var api = {
        getValue: function getValue() {
          return {
            vertices: studentVertices.slice(),
            targetVertices: targetVertices.slice(),
            shape: shapeLabel,
            mode: 'copy-shape',
            complete: verticesMatch(studentVertices, targetVertices),
          };
        },
        setValue: function setValue(v) {
          if (v && v.reset) {
            studentVertices = [];
          } else if (v && Array.isArray(v.vertices)) {
            studentVertices = v.vertices.map(function (pt) {
              return [pt[0], pt[1]];
            });
          } else {
            studentVertices = [];
          }
          drawBoard();
          notifyChange();
        },
        setEnabled: function setEnabled(on) {
          enabled = !!on;
          boardWrap.style.opacity = enabled ? '1' : '0.65';
          boardWrap.style.pointerEvents = enabled ? '' : 'none';
        },
        showSolution: function showSolution(v) {
          var verts =
            v && v.vertices
              ? v.vertices
              : v && v.targetVertices
                ? v.targetVertices
                : targetVertices;
          api.setValue({ vertices: verts });
          boardWrap.classList.add('mcs-shape-builder-solution-glow');
          window.setTimeout(function () {
            boardWrap.classList.remove('mcs-shape-builder-solution-glow');
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

      return api;
    }

    MCS.register('shape-builder', function shapeBuilderFactory(container, config) {
      config = config || {};
      var mode = config.mode || 'copy-shape';
      if (mode === 'copy-shape') return shapeBuilderCopyShape(container, config);
      throw new Error('shape-builder: unknown mode "' + mode + '"');
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

  function buildAlphaGrid(container, config) {
    config = config || {};
    var bandId = config.band || 'C';
    var bandTokens = MCS.band(bandId);
    var cols = config.cols || ['A', 'B', 'C', 'D', 'E'];
    var rows = config.rows || [5, 4, 3, 2, 1];
    var landmarks = config.landmarks || [];
    var selectionMode = config.selectionMode || 'single';
    var pathTrace = selectionMode === 'path-trace';
    var anchor = config.anchor || null;
    var positional = !!(config.positional && anchor && anchor.col && anchor.row != null);
    var roverIcon = config.roverIcon || '🚀';
    var readOnly = !!config.readOnly && !pathTrace;
    var showAxisTitles = !!config.showAxisTitles;
    var isSchoolMap = config.presentation === 'school-map';
    var hideGridLabels = !!(config.hideGridLabels || isSchoolMap);
    var mapTitle = config.mapTitle || '';
    var landmarkLabels = !!(config.landmarkLabels || isSchoolMap);
    var placedMarkerIcon = config.placedMarkerIcon || '';
    var placedMarkerLabel = config.placedMarkerLabel || '';
    var routePath = pathTrace ? [] : (Array.isArray(config.routePath) ? config.routePath : []);
    var tracedPath = [];
    var routeIndexMap = Object.create(null);
    routePath.forEach(function (point, idx) {
      if (point && point.col && point.row != null) {
        routeIndexMap[point.col + point.row] = idx + 1;
      }
    });
    var enabled = !readOnly;
    var changeCallbacks = [];
    var selectedCol = '';
    var selectedRow = 0;
    var dualSchool = { col: '', row: 0 };
    var dualPath = { col: '', row: 0 };
    var dualTarget = 'school';
    var cellSize =
      bandId === 'A'
        ? Math.max(bandTokens.minTouchTarget, 64)
        : Math.max(bandTokens.minTouchTarget - 4, 34);
    var cellMap = Object.create(null);

    container.innerHTML = '';
    container.classList.add('mcs-coordinate-plotter', 'mcs-alpha-grid');
    if (positional) container.classList.add('mcs-alpha-grid-positional');
    if (readOnly) container.classList.add('mcs-alpha-grid-readonly');
    if (pathTrace) container.classList.add('mcs-alpha-grid-path-trace');
    if (showAxisTitles) container.classList.add('mcs-alpha-grid-titled');
    if (isSchoolMap) container.classList.add('mcs-alpha-grid-school-map');
    if (hideGridLabels) container.classList.add('mcs-alpha-grid-no-labels');

    if (isSchoolMap && mapTitle) {
      var titleEl = document.createElement('div');
      titleEl.className = 'school-map-title';
      titleEl.textContent = mapTitle;
      titleEl.setAttribute('aria-hidden', 'true');
      container.appendChild(titleEl);
    }

    var liveRegion = MCS.stage.ariaHost(container);
    liveRegion.textContent = isSchoolMap
      ? readOnly
        ? 'Top-view school map. Use the landmark names to answer.'
        : 'Top-view school map. Use the landmark names and the clue to place the object.'
      : readOnly
        ? 'Alphanumeric grid map with column and row labels. Follow the numbered route.'
        : pathTrace
          ? 'Pathway grid. Tap cells along your route as you work through each step.'
          : positional
            ? 'Positional grid. Tap where the rover should go.'
            : 'Alphanumeric grid. Tap the cell for the landmark.';

    var layoutWrap = null;
    var gridColumn = null;
    if (showAxisTitles) {
      layoutWrap = document.createElement('div');
      layoutWrap.className = 'mcs-alpha-grid-layout';
      container.appendChild(layoutWrap);

      var yAxisTitle = document.createElement('div');
      yAxisTitle.className = 'alpha-grid-axis-y-title';
      yAxisTitle.textContent = 'Rows';
      yAxisTitle.setAttribute('aria-hidden', 'true');
      layoutWrap.appendChild(yAxisTitle);

      gridColumn = document.createElement('div');
      gridColumn.className = 'mcs-alpha-grid-column';
      layoutWrap.appendChild(gridColumn);

      var xAxisTitle = document.createElement('div');
      xAxisTitle.className = 'alpha-grid-axis-x-title';
      xAxisTitle.textContent = 'Columns';
      xAxisTitle.setAttribute('aria-hidden', 'true');
      gridColumn.appendChild(xAxisTitle);
    }

    var boardWrap = document.createElement('div');
    boardWrap.className = 'mcs-alpha-grid-board';
    boardWrap.setAttribute('role', readOnly ? 'img' : 'application');
    boardWrap.setAttribute(
      'aria-label',
      isSchoolMap
        ? mapTitle || 'Top-view school map.'
        : readOnly
          ? 'Grid map with columns labelled A to E and rows labelled 1 to 5.'
          : 'Alphanumeric coordinate grid.'
    );
    if (!readOnly) boardWrap.tabIndex = 0;
    if (gridColumn) {
      gridColumn.appendChild(boardWrap);
    } else {
      container.appendChild(boardWrap);
    }

    var gridEl = document.createElement('div');
    gridEl.className = 'alpha-grid-container';
    gridEl.style.gridTemplateColumns =
      'repeat(' + (hideGridLabels ? cols.length : cols.length + 1) + ', ' + cellSize + 'px)';
    gridEl.style.gridTemplateRows =
      'repeat(' + (hideGridLabels ? rows.length : rows.length + 1) + ', ' + cellSize + 'px)';
    boardWrap.appendChild(gridEl);

    if (!hideGridLabels) {
      var corner = document.createElement('div');
      corner.className = 'alpha-grid-cell label-cell';
      gridEl.appendChild(corner);

      cols.forEach(function (col) {
        var head = document.createElement('div');
        head.className = 'alpha-grid-cell label-cell';
        head.textContent = col;
        gridEl.appendChild(head);
      });
    }

    function landmarkAt(col, row) {
      if (positional && anchor && anchor.col === col && anchor.row === row) {
        return anchor;
      }
      var found = null;
      landmarks.forEach(function (lm) {
        if (lm.col === col && lm.row === row) found = lm;
      });
      return found;
    }

    function isAnchorCell(col, row) {
      return positional && anchor && anchor.col === col && anchor.row === row;
    }

    function landmarkLabel(lm) {
      return lm && (lm.label || lm.name || '');
    }

    function renderMarkerContent(cell, icon, label) {
      cell.innerHTML = '';
      if (landmarkLabels && label) {
        var wrap = document.createElement('span');
        wrap.className = 'school-map-marker';
        var iconEl = document.createElement('span');
        iconEl.className = 'school-map-marker-icon';
        iconEl.textContent = icon || '';
        iconEl.setAttribute('aria-hidden', 'true');
        var labelEl = document.createElement('span');
        labelEl.className = 'school-map-marker-label';
        labelEl.textContent = label;
        wrap.appendChild(iconEl);
        wrap.appendChild(labelEl);
        cell.appendChild(wrap);
        return;
      }
      cell.textContent = icon || '';
    }

    function renderCellContent(cell, col, row) {
      if (isSchoolMap && selectedCol === col && selectedRow === row && placedMarkerIcon) {
        renderMarkerContent(cell, placedMarkerIcon, placedMarkerLabel);
        return;
      }
      if (isAnchorCell(col, row)) {
        renderMarkerContent(cell, anchor.icon || '🛰️', anchor.label || 'Satellite');
        cell.classList.add('alpha-grid-anchor');
        return;
      }
      cell.classList.remove('alpha-grid-anchor');
      if (positional && selectedCol === col && selectedRow === row) {
        cell.textContent = roverIcon;
        return;
      }
      var lm = landmarkAt(col, row);
      if (lm && (lm.icon || landmarkLabel(lm))) {
        renderMarkerContent(cell, lm.icon, landmarkLabel(lm));
        return;
      }
      var routeStep = routeIndexMap[col + row];
      if (readOnly && routeStep != null) {
        cell.textContent = '';
        var stepEl = cell.querySelector('.alpha-grid-route-step');
        if (!stepEl) {
          stepEl = document.createElement('span');
          stepEl.className = 'alpha-grid-route-step';
          cell.appendChild(stepEl);
        }
        stepEl.textContent = String(routeStep);
        return;
      }
      cell.textContent = '';
    }

    function applyRouteStyles(cell, col, row) {
      var routeStep = routeIndexMap[col + row];
      if (routeStep == null) return;
      cell.classList.add('alpha-grid-route');
      if (routeStep === 1) cell.classList.add('alpha-grid-route-start');
      if (routeStep === routePath.length) cell.classList.add('alpha-grid-route-end');
    }

    function syncTraceHighlight() {
      Object.keys(cellMap).forEach(function (key) {
        var isTraced = tracedPath.some(function (p) {
          return p.col + p.row === key;
        });
        cellMap[key].classList.toggle('alpha-grid-traced', isTraced);
      });
    }

    function clearSolutionRouteDisplay() {
      Object.keys(cellMap).forEach(function (key) {
        var cell = cellMap[key];
        cell.classList.remove(
          'alpha-grid-route',
          'alpha-grid-route-start',
          'alpha-grid-route-end',
          'alpha-grid-solution-end'
        );
        var stepEl = cell.querySelector('.alpha-grid-route-step');
        if (stepEl) stepEl.remove();
      });
    }

    function displaySolutionRoute(solutionRoute) {
      if (!Array.isArray(solutionRoute)) return;
      clearSolutionRouteDisplay();
      tracedPath = [];
      syncTraceHighlight();
      solutionRoute.forEach(function (point, idx) {
        if (!point || !point.col || point.row == null) return;
        var cell = cellMap[point.col + point.row];
        if (!cell) return;
        cell.classList.add('alpha-grid-route');
        if (idx === 0) cell.classList.add('alpha-grid-route-start');
        if (idx === solutionRoute.length - 1) cell.classList.add('alpha-grid-route-end');
        var stepEl = document.createElement('span');
        stepEl.className = 'alpha-grid-route-step';
        stepEl.textContent = String(idx + 1);
        cell.appendChild(stepEl);
      });
    }

    function syncSelectionHighlight() {
      if (pathTrace) {
        syncTraceHighlight();
        return;
      }
      if (selectionMode === 'dual') {
        Object.keys(cellMap).forEach(function (key) {
          var isSchool = dualSchool.col && key === dualSchool.col + dualSchool.row;
          var isPath = dualPath.col && key === dualPath.col + dualPath.row;
          cellMap[key].classList.toggle('selected', isSchool || isPath);
        });
        return;
      }
      Object.keys(cellMap).forEach(function (key) {
        var parts = key.match(/^([A-Z]+)(\d+)$/);
        if (!parts) return;
        var col = parts[1];
        var row = parseInt(parts[2], 10);
        var isSelected = key === selectedCol + selectedRow;
        cellMap[key].classList.toggle('selected', isSelected && !isAnchorCell(col, row));
        if (positional || readOnly || isSchoolMap) renderCellContent(cellMap[key], col, row);
      });
    }

    function selectCell(col, row, silent) {
      if (!enabled) return;
      if (isAnchorCell(col, row)) return;
      if (pathTrace) {
        var traceIdx = tracedPath.findIndex(function (p) {
          return p.col === col && p.row === row;
        });
        if (traceIdx >= 0) {
          tracedPath.splice(traceIdx, 1);
        } else {
          tracedPath.push({ col: col, row: row });
        }
        syncTraceHighlight();
        if (!silent) {
          MCS.audio.emit('click');
          liveRegion.textContent =
            tracedPath.length === 1
              ? 'Traced cell ' + col + row + '.'
              : 'Traced ' + tracedPath.length + ' cells.';
          fireChange();
        }
        return;
      }
      if (selectionMode === 'dual') {
        if (dualTarget === 'school') {
          dualSchool = { col: col, row: row };
          dualTarget = 'path';
        } else {
          dualPath = { col: col, row: row };
        }
        syncSelectionHighlight();
        if (!silent) {
          MCS.audio.emit('click');
          var schoolLabel = dualSchool.col ? dualSchool.col + dualSchool.row : 'none';
          var pathLabel = dualPath.col ? dualPath.col + dualPath.row : 'none';
          liveRegion.textContent = 'School cell ' + schoolLabel + ', path cell ' + pathLabel + '.';
          fireChange();
        }
        return;
      }
      selectedCol = col;
      selectedRow = row;
      syncSelectionHighlight();
      if (!silent) {
        MCS.audio.emit('click');
        liveRegion.textContent = isSchoolMap
          ? placedMarkerLabel
            ? placedMarkerLabel + ' placed on the school map.'
            : 'Selected location on the school map.'
          : positional
            ? 'Rover placed at ' + col + row + '.'
            : 'Selected cell ' + col + row + '.';
        fireChange();
      }
    }

    rows.forEach(function (row) {
      if (!hideGridLabels) {
        var rowLabel = document.createElement('div');
        rowLabel.className = 'alpha-grid-cell label-cell';
        rowLabel.textContent = String(row);
        gridEl.appendChild(rowLabel);
      }

      cols.forEach(function (col) {
        var cell = readOnly ? document.createElement('div') : document.createElement('button');
        if (!readOnly) cell.type = 'button';
        cell.className = 'alpha-grid-cell';
        if (readOnly) cell.classList.add('alpha-grid-cell-readonly');
        cell.dataset.col = col;
        cell.dataset.row = String(row);
        var lm = landmarkAt(col, row);
        if (isAnchorCell(col, row)) {
          cell.setAttribute(
            'aria-label',
            (anchor.label || 'Satellite') + (isSchoolMap ? '' : ' at ' + col + row)
          );
          cell.classList.add('alpha-grid-anchor');
        } else if (lm && landmarkLabel(lm)) {
          cell.setAttribute(
            'aria-label',
            landmarkLabel(lm) + (isSchoolMap ? ' on the school map' : ' at ' + col + row)
          );
        } else if (routeIndexMap[col + row] != null) {
          cell.setAttribute(
            'aria-label',
            'Route step ' + routeIndexMap[col + row] + ' at cell ' + col + row
          );
        } else {
          cell.setAttribute(
            'aria-label',
            isSchoolMap
              ? 'Empty space on the school map'
              : positional
                ? 'Place rover at ' + col + row
                : 'Grid cell ' + col + row
          );
        }
        if (!readOnly) {
          cell.addEventListener('click', function () {
            selectCell(col, row, false);
          });
        }
        applyRouteStyles(cell, col, row);
        cellMap[col + row] = cell;
        if (positional || readOnly || isSchoolMap) renderCellContent(cell, col, row);
        gridEl.appendChild(cell);
      });
    });

    var focusColIdx = 0;
    var focusRowIdx = 0;

    function focusCellAt(colIdx, rowIdx) {
      if (colIdx < 0) colIdx = 0;
      if (colIdx >= cols.length) colIdx = cols.length - 1;
      if (rowIdx < 0) rowIdx = 0;
      if (rowIdx >= rows.length) rowIdx = rows.length - 1;
      focusColIdx = colIdx;
      focusRowIdx = rowIdx;
      var col = cols[colIdx];
      var row = rows[rowIdx];
      var cell = cellMap[col + row];
      if (cell) cell.focus();
      selectCell(col, row, true);
    }

    function onKeyDown(e) {
      if (!enabled) return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        focusCellAt(focusColIdx + 1, focusRowIdx);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        focusCellAt(focusColIdx - 1, focusRowIdx);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        focusCellAt(focusColIdx, focusRowIdx + 1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        focusCellAt(focusColIdx, focusRowIdx - 1);
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        selectCell(cols[focusColIdx], rows[focusRowIdx], false);
      }
    }

    boardWrap.addEventListener('keydown', onKeyDown);
    if (!readOnly) {
      boardWrap.addEventListener('focus', function () {
        boardWrap.classList.add('mcs-alpha-grid-focused');
        focusCellAt(focusColIdx, focusRowIdx);
      });
      boardWrap.addEventListener('blur', function () {
        boardWrap.classList.remove('mcs-alpha-grid-focused');
      });
    }

    function fireChange() {
      var val = getValueObject();
      changeCallbacks.forEach(function (cb) {
        try {
          cb(val);
        } catch (e) {
          console.warn('alpha-grid onChange error', e);
        }
      });
    }

    function getValueObject() {
      if (pathTrace) {
        return {
          tracedPath: tracedPath.slice(),
          cells: tracedPath.map(function (p) {
            return p.col + p.row;
          }),
          mode: 'path-trace',
        };
      }
      if (selectionMode === 'dual') {
        return {
          school: {
            col: dualSchool.col,
            row: dualSchool.row,
            cell: dualSchool.col && dualSchool.row ? dualSchool.col + dualSchool.row : '',
          },
          path: {
            col: dualPath.col,
            row: dualPath.row,
            cell: dualPath.col && dualPath.row ? dualPath.col + dualPath.row : '',
          },
        };
      }
      return {
        col: selectedCol,
        row: selectedRow,
        cell: selectedCol && selectedRow ? selectedCol + selectedRow : '',
        mode: positional ? 'positional' : 'alpha-grid',
      };
    }

    return {
      getValue: getValueObject,

      setValue: function setValue(v) {
        if (pathTrace) {
          tracedPath = [];
          if (v && Array.isArray(v.tracedPath)) {
            tracedPath = v.tracedPath
              .filter(function (p) {
                return p && p.col && p.row != null;
              })
              .map(function (p) {
                return { col: p.col, row: p.row };
              });
          }
          clearSolutionRouteDisplay();
          syncTraceHighlight();
          return;
        }
        if (selectionMode === 'dual') {
          dualSchool = { col: '', row: 0 };
          dualPath = { col: '', row: 0 };
          dualTarget = 'school';
          if (v && v.school && v.school.col && v.school.row) {
            dualSchool = { col: v.school.col, row: v.school.row };
          }
          if (v && v.path && v.path.col && v.path.row) {
            dualPath = { col: v.path.col, row: v.path.row };
            dualTarget = 'path';
          } else if (dualSchool.col) {
            dualTarget = 'path';
          }
          syncSelectionHighlight();
          return;
        }
        if (!v) return;
        var col = v.col || (v.cell ? v.cell.charAt(0) : '');
        var row = v.row != null ? v.row : v.cell ? parseInt(v.cell.slice(1), 10) : 0;
        if (col && row) {
          focusColIdx = cols.indexOf(col);
          focusRowIdx = rows.indexOf(row);
          selectCell(col, row, true);
        } else if (positional) {
          selectedCol = '';
          selectedRow = 0;
          syncSelectionHighlight();
        }
      },

      setEnabled: function setEnabled(on) {
        enabled = !!on;
        Object.keys(cellMap).forEach(function (key) {
          cellMap[key].disabled = !on;
        });
        boardWrap.style.pointerEvents = enabled ? '' : 'none';
        boardWrap.setAttribute('aria-disabled', enabled ? 'false' : 'true');
      },

      showSolution: function showSolution(v) {
        if (pathTrace && v && Array.isArray(v.routePath) && v.routePath.length) {
          displaySolutionRoute(v.routePath);
          enabled = false;
          Object.keys(cellMap).forEach(function (key) {
            cellMap[key].disabled = true;
          });
          boardWrap.style.pointerEvents = 'none';
          boardWrap.setAttribute('aria-disabled', 'true');
          boardWrap.classList.add('mcs-alpha-grid-solution-glow');
          window.setTimeout(function () {
            boardWrap.classList.remove('mcs-alpha-grid-solution-glow');
          }, 900);
          return;
        }
        var col = v && v.col;
        var row = v && v.row != null ? v.row : null;
        if (v && v.cell && (!col || row == null)) {
          col = v.cell.charAt(0);
          row = parseInt(v.cell.slice(1), 10);
        }
        if (v && v.highlightEnd && v.highlightEnd.col && v.highlightEnd.row != null) {
          col = v.highlightEnd.col;
          row = v.highlightEnd.row;
        }
        if (col && row != null) {
          if (readOnly) {
            Object.keys(cellMap).forEach(function (key) {
              cellMap[key].classList.remove('alpha-grid-solution-end');
            });
            var endCell = cellMap[col + row];
            if (endCell) endCell.classList.add('alpha-grid-solution-end');
          } else {
            focusColIdx = cols.indexOf(col);
            focusRowIdx = rows.indexOf(row);
            selectCell(col, row, true);
          }
        } else if (positional && !readOnly) {
          selectedCol = '';
          selectedRow = 0;
          syncSelectionHighlight();
        }
        boardWrap.classList.add('mcs-alpha-grid-solution-glow');
        window.setTimeout(function () {
          boardWrap.classList.remove('mcs-alpha-grid-solution-glow');
        }, 900);
        if (!readOnly) fireChange();
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
        boardWrap.removeEventListener('keydown', onKeyDown);
        container.innerHTML = '';
        changeCallbacks.length = 0;
        MCS._releaseContainer(container);
      },
    };
  }

  function buildPathRoverPlotter(container, config) {
    config = config || {};
    var bandId = config.band || 'B';
    var bandTokens = MCS.band(bandId);
    var xMin = config.xMin != null ? config.xMin : 0;
    var xMax = config.xMax != null ? config.xMax : 4;
    var yMin = config.yMin != null ? config.yMin : 0;
    var yMax = config.yMax != null ? config.yMax : 4;
    var routeSpeed = config.routeSpeed != null ? config.routeSpeed : 0.035;
    var landmarks = config.landmarks || [
      { x: 0, y: 0, label: 'WH(0,0)', kind: 'warehouse' },
      { x: 1, y: 3, label: 'Shop A(1,3)', shopKey: 'A' },
      { x: 3, y: 4, label: 'Shop C(3,4)', shopKey: 'C' },
      { x: 4, y: 2, label: 'Shop B(4,2)', shopKey: 'B' },
    ];
    var routePath = config.routePath || [
      { x: 0, y: 0 },
      { x: 1, y: 3 },
      { x: 3, y: 4 },
      { x: 4, y: 2 },
    ];
    var cargoSchedule = Array.isArray(config.cargoSchedule)
      ? config.cargoSchedule.slice()
      : [213, 203, 193, 183];
    var segmentShopKeys = config.segmentShopKeys || ['A', 'C', 'B'];
    var enabled = true;
    var changeCallbacks = [];
    var vanX = routePath[0].x;
    var vanY = routePath[0].y;
    var vanCargo = cargoSchedule[0];
    var shopStatus = { A: 'AWAITING', C: 'AWAITING', B: 'AWAITING' };
    var routeRunning = false;
    var routeComplete = false;
    var animFrameId = null;
    var roverPoint = null;
    var shopMarkers = Object.create(null);
    var hudEl = null;

    container.innerHTML = '';
    container.classList.add('mcs-coordinate-plotter', 'mcs-path-rover');

    var liveRegion = document.createElement('div');
    liveRegion.className = 'mcs-sr-live';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    container.appendChild(liveRegion);

    var outerWrap = document.createElement('div');
    outerWrap.className = 'mcs-path-rover-wrap';
    outerWrap.style.position = 'relative';
    outerWrap.style.width = '100%';
    container.appendChild(outerWrap);

    var boardWrap = document.createElement('div');
    boardWrap.className = 'mcs-coordinate-plotter-board';
    boardWrap.setAttribute('role', 'application');
    boardWrap.setAttribute(
      'aria-label',
      config.ariaLabel || 'Delivery route map. Run the van along the plotted route.'
    );
    boardWrap.tabIndex = 0;
    outerWrap.appendChild(boardWrap);

    hudEl = document.createElement('div');
    hudEl.className = 'mcs-path-rover-hud';
    hudEl.style.cssText =
      'position:absolute;top:8px;left:8px;padding:6px 8px;border-radius:4px;' +
      'background:var(--surface-container-low);border:1px solid var(--outline-variant);' +
      'font-family:var(--font-mono);font-size:0.62rem;line-height:1.45;color:var(--on-surface);' +
      'opacity:0.92;pointer-events:none;max-width:calc(100% - 16px);';
    outerWrap.appendChild(hudEl);

    var boardWidth = container.clientWidth;
    if (!boardWidth && container.parentElement) {
      boardWidth = container.parentElement.clientWidth;
    }
    if (!boardWidth) boardWidth = 240;
    var plotSize = Math.min(Math.max(boardWidth, 220), 320);
    boardWrap.style.width = plotSize + 'px';
    boardWrap.style.height = plotSize + 'px';
    void boardWrap.offsetHeight;

    var boardCtx = MCS.board.make(boardWrap, {
      boundingbox: [xMin - 0.6, yMax + 0.6, xMax + 0.6, yMin - 0.6],
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

    for (var pi = 0; pi < routePath.length - 1; pi++) {
      var a = routePath[pi];
      var b = routePath[pi + 1];
      board.create(
        'segment',
        [
          [a.x, a.y],
          [b.x, b.y],
        ],
        {
          strokeColor: theme.ink,
          strokeWidth: 1.5,
          dash: 3,
          fixed: true,
          highlight: false,
        }
      );
    }

    function shopDelivered(key) {
      return shopStatus[key] === 'DELIVERED';
    }

    landmarks.forEach(function (lm) {
      var lx = lm.x != null ? lm.x : 0;
      var ly = lm.y != null ? lm.y : 0;
      var lbl = lm.label != null ? lm.label : '';
      if (lm.kind === 'warehouse') {
        board.create(
          'polygon',
          [
            [lx - 0.12, ly - 0.12],
            [lx + 0.12, ly - 0.12],
            [lx + 0.12, ly + 0.12],
            [lx - 0.12, ly + 0.12],
          ],
          {
            fillColor: theme.accentSoft || theme.accent,
            strokeColor: theme.ink,
            strokeWidth: 1.2,
            fixed: true,
            highlight: false,
          }
        );
      } else if (lm.shopKey) {
        var delivered = shopDelivered(lm.shopKey);
        var marker = MCS.board.point(boardCtx, {
          coords: [lx, ly],
          size: pinSize,
          fixed: true,
          strokeColor: theme.accent,
          fillColor: delivered ? theme.accent : theme.accentSoft || theme.surface,
          snapToGrid: false,
        });
        shopMarkers[lm.shopKey] = marker;
      }
      board.create('text', [lx, ly + 0.42, lbl], {
        fontSize: Math.max(9, bandTokens.fontSizeMin - 3),
        strokeColor: shopDelivered(lm.shopKey) ? theme.accent : theme.ink,
        fixed: true,
        highlight: false,
        anchorX: 'middle',
        anchorY: 'top',
        cssStyle: 'font-family:' + theme.fontMono + ';font-weight:700;',
      });
    });

    roverPoint = MCS.board.point(boardCtx, {
      coords: [vanX, vanY],
      size: pinSize + 2,
      fixed: true,
      strokeColor: theme.surface || '#fff',
      fillColor: theme.accent,
      snapToGrid: false,
    });
    board.update();

    function refreshShopMarkers() {
      Object.keys(shopMarkers).forEach(function (key) {
        var marker = shopMarkers[key];
        if (!marker) return;
        marker.setAttribute({
          fillColor: shopDelivered(key) ? theme.accent : theme.accentSoft || theme.surface,
        });
      });
      board.update();
    }

    function refreshHud() {
      if (!hudEl) return;
      hudEl.innerHTML =
        '<div style="font-weight:700;margin-bottom:2px;">RADAR_STATUS</div>' +
        '<div style="color:var(--primary);">Cargo: ' +
        vanCargo +
        ' crt</div>' +
        '<div>Pos: (' +
        vanX.toFixed(1) +
        ', ' +
        vanY.toFixed(1) +
        ')</div>' +
        '<div style="color:var(--tertiary);font-size:0.58rem;">A: ' +
        shopStatus.A +
        ' | C: ' +
        shopStatus.C +
        ' | B: ' +
        shopStatus.B +
        '</div>';
    }

    function setVanPosition(x, y) {
      vanX = x;
      vanY = y;
      if (roverPoint) {
        roverPoint.setPosition(JXG.COORDS_BY_USER, [vanX, vanY]);
        board.update();
      }
      refreshHud();
    }

    function fireChange() {
      var payload = {
        vanCargo: vanCargo,
        vanPosition: { x: vanX, y: vanY },
        shopStatus: {
          A: shopStatus.A,
          C: shopStatus.C,
          B: shopStatus.B,
        },
        routeComplete: routeComplete,
      };
      changeCallbacks.forEach(function (cb) {
        try {
          cb(payload);
        } catch (e) {
          console.warn('path-rover onChange error', e);
        }
      });
    }

    function stopAnimation() {
      if (animFrameId != null) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
      }
      routeRunning = false;
    }

    function completeSegment(segmentIndex, opts) {
      var shopKey = segmentShopKeys[segmentIndex - 1];
      if (shopKey) {
        shopStatus[shopKey] = 'DELIVERED';
      }
      if (cargoSchedule[segmentIndex] != null) {
        vanCargo = cargoSchedule[segmentIndex];
      }
      refreshShopMarkers();
      refreshHud();
      fireChange();
      if (opts && typeof opts.onSegmentComplete === 'function') {
        opts.onSegmentComplete({
          segment: segmentIndex,
          shopKey: shopKey,
          cargo: vanCargo,
        });
      }
    }

    function playRoute(opts) {
      opts = opts || {};
      if (!enabled || routeRunning || routeComplete) return false;
      routeRunning = true;
      MCS.audio.emit('click');

      var segment = 0;
      var percent = 0;

      function animateRoute() {
        percent += routeSpeed;
        if (percent >= 1) {
          percent = 0;
          segment++;
          if (segment >= 1 && segment <= segmentShopKeys.length) {
            completeSegment(segment, opts);
          }
        }

        if (segment < routePath.length - 1) {
          var startPt = routePath[segment];
          var endPt = routePath[segment + 1];
          setVanPosition(
            startPt.x + (endPt.x - startPt.x) * percent,
            startPt.y + (endPt.y - startPt.y) * percent
          );
          fireChange();
          animFrameId = requestAnimationFrame(animateRoute);
        } else {
          var end = routePath[routePath.length - 1];
          setVanPosition(end.x, end.y);
          routeComplete = true;
          routeRunning = false;
          animFrameId = null;
          fireChange();
          if (typeof opts.onRouteComplete === 'function') {
            opts.onRouteComplete({ cargo: vanCargo });
          }
        }
      }

      animateRoute();
      return true;
    }

    function resetRoute() {
      stopAnimation();
      routeComplete = false;
      vanCargo = cargoSchedule[0];
      shopStatus.A = 'AWAITING';
      shopStatus.C = 'AWAITING';
      shopStatus.B = 'AWAITING';
      setVanPosition(routePath[0].x, routePath[0].y);
      refreshShopMarkers();
      fireChange();
    }

    refreshHud();

    return {
      getValue: function getValue() {
        return {
          vanCargo: vanCargo,
          vanPosition: { x: vanX, y: vanY },
          shopStatus: {
            A: shopStatus.A,
            C: shopStatus.C,
            B: shopStatus.B,
          },
          routeComplete: routeComplete,
        };
      },

      playRoute: playRoute,

      resetRoute: resetRoute,

      setEnabled: function setEnabled(on) {
        enabled = !!on;
        if (!on) stopAnimation();
        boardWrap.style.pointerEvents = enabled ? '' : 'none';
        boardWrap.setAttribute('aria-disabled', enabled ? 'false' : 'true');
      },

      onChange: function onChange(callback) {
        if (typeof callback === 'function') changeCallbacks.push(callback);
      },

      destroy: function destroy() {
        stopAnimation();
        MCS.board.destroy(boardCtx);
        container.innerHTML = '';
        changeCallbacks.length = 0;
        MCS._releaseContainer(container);
      },
    };
  }

  MCS.register('coordinate-plotter', function coordinatePlotterFactory(container, config) {
    config = config || {};
    var mode = config.mode || 'plot-point';
    if (mode === 'alpha-grid') {
      return buildAlphaGrid(container, config);
    }
    if (mode === 'path-rover') {
      return buildPathRoverPlotter(container, config);
    }
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
    var waypointsMode = mode === 'plot-waypoints';
    var ariaTask =
      config.ariaLabel ||
      (manhattanMode
        ? 'Coordinate grid. Tap grid intersections to trace the path from A to B.'
        : waypointsMode
          ? 'Coordinate grid. Tap to plot the active waypoint on the grid.'
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
    var pinC = null;
    var pinAX = 0;
    var pinAY = 0;
    var pinBX = 1;
    var pinBY = 0;
    var pinCX = 0;
    var pinCY = 0;
    var activeWaypointLabel = config.activeWaypoint || 'A';
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
          } else if (waypointsMode) {
            cb({
              A: { x: pinAX, y: pinAY },
              B: { x: pinBX, y: pinBY },
              C: { x: pinCX, y: pinCY },
            });
          } else if (duoMode) {
            cb({ a: { x: pinAX, y: pinAY }, b: { x: pinBX, y: pinBY } });
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

    function setWaypointPinPosition(which, x, y, animate, onComplete) {
      var key = String(which).toUpperCase();
      var targetPin = key === 'A' ? pinA : key === 'B' ? pinB : pinC;
      if (!targetPin) {
        if (typeof onComplete === 'function') onComplete();
        return;
      }
      var tx = snapCoord(x, snap, xMin, xMax);
      var ty = snapCoord(y, snap, yMin, yMax);
      if (activeTween) activeTween.cancel();

      function assignCoords(sx, sy) {
        if (key === 'A') {
          pinAX = sx;
          pinAY = sy;
        } else if (key === 'B') {
          pinBX = sx;
          pinBY = sy;
        } else {
          pinCX = sx;
          pinCY = sy;
        }
      }

      if (!animate || MCS.prefersReducedMotion()) {
        targetPin.setPosition(JXG.COORDS_BY_USER, [tx, ty]);
        targetPin.setAttribute({ size: pinSize });
        assignCoords(tx, ty);
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
          assignCoords(tx, ty);
          board.update();
          announce(tx, ty);
          activeTween = null;
          if (typeof onComplete === 'function') onComplete();
        },
      });
    }

    function attachWaypointPinHandlers(jxgPin, which) {
      var key = String(which).toUpperCase();
      jxgPin.on('down', function () {
        if (!enabled) return;
        activeWaypointLabel = key;
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
        var changed = false;
        if (key === 'A' && (sx !== pinAX || sy !== pinAY)) {
          pinAX = sx;
          pinAY = sy;
          changed = true;
        } else if (key === 'B' && (sx !== pinBX || sy !== pinBY)) {
          pinBX = sx;
          pinBY = sy;
          changed = true;
        } else if (key === 'C' && (sx !== pinCX || sy !== pinCY)) {
          pinCX = sx;
          pinCY = sy;
          changed = true;
        }
        if (changed) {
          MCS.audio.emit('snap');
          announce(sx, sy);
          fireChange();
        }
        board.update();
        MCS.audio.emit('drop');
      });
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
    } else if (waypointsMode) {
      var wpInit = config.initialWaypoints || {};
      var wpA = wpInit.A || { x: 0, y: 0 };
      var wpB = wpInit.B || { x: 0, y: 0 };
      var wpC = wpInit.C || { x: 0, y: 0 };
      pinAX = snapCoord(wpA.x != null ? wpA.x : 0, snap, xMin, xMax);
      pinAY = snapCoord(wpA.y != null ? wpA.y : 0, snap, yMin, yMax);
      pinBX = snapCoord(wpB.x != null ? wpB.x : 0, snap, xMin, xMax);
      pinBY = snapCoord(wpB.y != null ? wpB.y : 0, snap, yMin, yMax);
      pinCX = snapCoord(wpC.x != null ? wpC.x : 0, snap, xMin, xMax);
      pinCY = snapCoord(wpC.y != null ? wpC.y : 0, snap, yMin, yMax);

      var primaryStroke = theme.accent;
      var secondaryStroke = theme.ink;
      var tertiaryStroke = theme.tertiary || '#7c3aed';

      pinA = MCS.board.point(boardCtx, {
        coords: [pinAX, pinAY],
        size: pinSize,
        snapToGrid: true,
        snapSizeX: snap,
        snapSizeY: snap,
        fixed: false,
        strokeColor: primaryStroke,
        fillColor: theme.accentSoft || 'transparent',
        strokeWidth: 2.5,
      });
      pinB = MCS.board.point(boardCtx, {
        coords: [pinBX, pinBY],
        size: pinSize,
        snapToGrid: true,
        snapSizeX: snap,
        snapSizeY: snap,
        fixed: false,
        strokeColor: secondaryStroke,
        fillColor: 'transparent',
        strokeWidth: 2.5,
      });
      pinC = MCS.board.point(boardCtx, {
        coords: [pinCX, pinCY],
        size: pinSize,
        snapToGrid: true,
        snapSizeX: snap,
        snapSizeY: snap,
        fixed: false,
        strokeColor: tertiaryStroke,
        fillColor: 'transparent',
        strokeWidth: 2.5,
      });

      attachWaypointPinHandlers(pinA, 'A');
      attachWaypointPinHandlers(pinB, 'B');
      attachWaypointPinHandlers(pinC, 'C');

      board.on('down', function (e) {
        if (!enabled) return;
        var usr = board.getUsrCoordsOfMouse(e);
        if (!usr) return;
        var nearA =
          Math.abs(usr[0] - pinAX) < snap * 0.75 && Math.abs(usr[1] - pinAY) < snap * 0.75;
        var nearB =
          Math.abs(usr[0] - pinBX) < snap * 0.75 && Math.abs(usr[1] - pinBY) < snap * 0.75;
        var nearC =
          Math.abs(usr[0] - pinCX) < snap * 0.75 && Math.abs(usr[1] - pinCY) < snap * 0.75;
        if (nearA || nearB || nearC) return;
        var tx = snapCoord(usr[0], snap, xMin, xMax);
        var ty = snapCoord(usr[1], snap, yMin, yMax);
        setWaypointPinPosition(activeWaypointLabel, tx, ty, false);
        MCS.audio.emit('snap');
        fireChange();
      });

      announce(pinAX, pinAY);
    }

    function onKeyDown(e) {
      if (!enabled || readOnly || manhattanMode || duoMode || waypointsMode || !pin) return;
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
        if (waypointsMode) {
          return {
            A: { x: pinAX, y: pinAY },
            B: { x: pinBX, y: pinBY },
            C: { x: pinCX, y: pinCY },
          };
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
        if (waypointsMode) {
          if (v.A) setWaypointPinPosition('A', v.A.x != null ? v.A.x : 0, v.A.y != null ? v.A.y : 0, false, fireChange);
          if (v.B) setWaypointPinPosition('B', v.B.x != null ? v.B.x : 0, v.B.y != null ? v.B.y : 0, false, fireChange);
          if (v.C) setWaypointPinPosition('C', v.C.x != null ? v.C.x : 0, v.C.y != null ? v.C.y : 0, false, fireChange);
          return;
        }
        setPinPosition(v.x != null ? v.x : 0, v.y != null ? v.y : 0, false, fireChange);
      },

      setEnabled: function setEnabled(on) {
        enabled = !!on;
        if (pin) pin.setAttribute({ fixed: !enabled || readOnly });
        if (pinA) pinA.setAttribute({ fixed: !enabled });
        if (pinB) pinB.setAttribute({ fixed: !enabled });
        if (pinC) pinC.setAttribute({ fixed: !enabled });
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
        if (waypointsMode) {
          ['A', 'B', 'C'].forEach(function (label) {
            var pt = v[label];
            if (pt) setWaypointPinPosition(label, pt.x, pt.y, true);
          });
          boardWrap.classList.add('mcs-coordinate-plotter-solution-glow');
          window.setTimeout(function () {
            boardWrap.classList.remove('mcs-coordinate-plotter-solution-glow');
          }, 900);
          fireChange();
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

      setActiveWaypoint: function setActiveWaypoint(label) {
        if (!waypointsMode || !label) return;
        activeWaypointLabel = String(label).toUpperCase();
        liveRegion.textContent = 'Active waypoint ' + activeWaypointLabel;
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
    if (mode === 'single-step') return transformBoardSingleStep(container, config);
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
