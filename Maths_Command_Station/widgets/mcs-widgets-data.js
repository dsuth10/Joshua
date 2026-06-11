/**
 * MCS data widgets — column-graph, line-graph (JSXGraph);
 * marble-bag, dice-coin-lab, spinner (Konva, Phase 3a Slice 5).
 */
(function (MCS) {
  'use strict';

  if (typeof JXG !== 'undefined' && MCS.board) {

  function computeMaxY(values, scaleInterval, maxYOverride) {
    if (maxYOverride != null) return maxYOverride;
    var maxVal = 0;
    for (var i = 0; i < values.length; i++) {
      if (values[i] > maxVal) maxVal = values[i];
    }
    return Math.ceil(maxVal / scaleInterval) * scaleInterval;
  }

  function formatColumnSpeech(category, value) {
    return category + ' column shows ' + value;
  }

  function categoryIndex(categories, name) {
    for (var i = 0; i < categories.length; i++) {
      if (categories[i] === name) return i;
    }
    return -1;
  }

  MCS.register('column-graph', function columnGraphFactory(container, config) {
    config = config || {};
    var mode = config.mode || 'read';
    var bandId = config.band || 'C';
    var bandTokens = MCS.band(bandId);
    var categories = config.categories || [];
    var values = config.values || [];
    var scaleInterval = config.scaleInterval != null ? config.scaleInterval : 2;
    var numCats = categories.length;
    var maxY = computeMaxY(values, scaleInterval, config.maxY);
    var colWidth = 0.55;

    container.innerHTML = '';
    container.classList.add('mcs-column-graph');

    var liveRegion = document.createElement('div');
    liveRegion.className = 'mcs-sr-live';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    container.appendChild(liveRegion);

    var boardWrap = document.createElement('div');
    boardWrap.className = 'mcs-column-graph-board';
    boardWrap.setAttribute('role', 'application');
    boardWrap.setAttribute(
      'aria-label',
      'Column graph showing favourite pets. Tap a column to read its value.'
    );
    boardWrap.tabIndex = 0;
    container.appendChild(boardWrap);

    var boardWidth = container.clientWidth;
    if (!boardWidth && container.parentElement) {
      boardWidth = container.parentElement.clientWidth;
    }
    if (!boardWidth) boardWidth = 320;
    var chartWidth = Math.min(Math.max(boardWidth, 260), 380);
    var chartHeight = bandId === 'A' ? 220 : bandId === 'B' ? 230 : 240;
    boardWrap.style.width = chartWidth + 'px';
    boardWrap.style.height = chartHeight + 'px';
    void boardWrap.offsetHeight;

    var xMin = -0.85;
    var xMax = numCats + 0.15;
    var yMin = -0.65;
    var yMax = maxY + scaleInterval * 0.35;

    var boardCtx = MCS.board.make(boardWrap, {
      boundingbox: [xMin, yMax, xMax, yMin],
      height: chartHeight + 'px',
      minHeight: chartHeight + 'px',
      keepAspectRatio: false,
    });
    var board = boardCtx.board;
    var theme = boardCtx.theme;

    var selectedCategory = config.selectedCategory || null;
    var selectedValue = null;
    var focusIndex = 0;
    var enabled = true;
    var changeCallbacks = [];
    var activeTween = null;
    var columnPolys = [];
    var guideLine = null;
    var guideLabel = null;
    var gridLines = [];

    function columnCenterX(index) {
      return index + 0.5;
    }

    function columnPolygonCoords(index, value) {
      var cx = columnCenterX(index);
      var half = colWidth / 2;
      return [
        [cx - half, 0],
        [cx + half, 0],
        [cx + half, value],
        [cx - half, value],
      ];
    }

    function drawGridAndAxes() {
      gridLines.forEach(function (el) {
        try {
          board.removeObject(el);
        } catch (e) {
          /* ignore */
        }
      });
      gridLines = [];

      for (var v = 0; v <= maxY; v += scaleInterval) {
        gridLines.push(
          board.create(
            'segment',
            [
              [0, v],
              [numCats, v],
            ],
            {
              strokeColor: theme.gridLine,
              strokeWidth: 1,
              dash: 2,
              fixed: true,
              highlight: false,
              withLabel: false,
            }
          )
        );
        gridLines.push(
          MCS.board.label(boardCtx, [-0.12, v], String(v), {
            fontSize: bandTokens.fontSizeMin - 2,
            anchorX: 'right',
            anchorY: 'middle',
          })
        );
      }

      gridLines.push(
        board.create(
          'segment',
          [
            [0, 0],
            [numCats, 0],
          ],
          {
            strokeColor: theme.ink,
            strokeWidth: 2,
            fixed: true,
            highlight: false,
            withLabel: false,
          }
        )
      );
      gridLines.push(
        board.create(
          'segment',
          [
            [0, 0],
            [0, maxY],
          ],
          {
            strokeColor: theme.ink,
            strokeWidth: 2,
            fixed: true,
            highlight: false,
            withLabel: false,
          }
        )
      );

      for (var ci = 0; ci < numCats; ci++) {
        gridLines.push(
          MCS.board.label(boardCtx, [columnCenterX(ci), -0.28], categories[ci], {
            fontSize: bandTokens.fontSizeMin - 1,
            anchorY: 'top',
          })
        );
      }
    }

    function removeGuide() {
      if (guideLine) {
        try {
          board.removeObject(guideLine);
        } catch (e) {
          /* ignore */
        }
        guideLine = null;
      }
      if (guideLabel) {
        try {
          board.removeObject(guideLabel);
        } catch (e) {
          /* ignore */
        }
        guideLabel = null;
      }
    }

    function showGuideForIndex(index, animate) {
      if (index < 0 || index >= numCats) return;
      var val = values[index];
      var cx = columnCenterX(index);
      removeGuide();

      guideLine = board.create(
        'segment',
        [
          [0, val],
          [cx, val],
        ],
        {
          strokeColor: theme.accent,
          strokeWidth: 2,
          dash: 2,
          fixed: true,
          highlight: false,
          withLabel: false,
        }
      );

      guideLabel = board.create('text', [-0.18, val, String(val)], {
        fontSize: bandTokens.fontSizeMin,
        strokeColor: theme.accent,
        fixed: true,
        highlight: false,
        anchorX: 'right',
        anchorY: 'middle',
        cssStyle: 'font-family:' + theme.fontMono + ';font-weight:700;',
      });

      if (columnPolys[index]) {
        columnPolys[index].setAttribute({
          fillColor: theme.accent,
          strokeColor: theme.accent,
        });
      }

      for (var hi = 0; hi < columnPolys.length; hi++) {
        if (hi !== index && columnPolys[hi]) {
          columnPolys[hi].setAttribute({
            fillColor: theme.accentSoft,
            strokeColor: theme.accent,
          });
        }
      }

      selectedCategory = categories[index];
      selectedValue = val;
      focusIndex = index;
      liveRegion.textContent = formatColumnSpeech(selectedCategory, selectedValue);
      board.update();

      if (animate && !MCS.prefersReducedMotion()) {
        /* subtle pulse on guide */
        boardWrap.classList.add('mcs-column-graph-guide-pulse');
        window.setTimeout(function () {
          boardWrap.classList.remove('mcs-column-graph-guide-pulse');
        }, 400);
      }
    }

    function buildColumns() {
      columnPolys.forEach(function (poly) {
        try {
          board.removeObject(poly);
        } catch (e) {
          /* ignore */
        }
      });
      columnPolys = [];

      for (var i = 0; i < numCats; i++) {
        (function (index) {
          var coords = columnPolygonCoords(index, values[index]);
          var poly = board.create('polygon', coords, {
            fillColor: theme.accentSoft,
            fillOpacity: 0.92,
            borders: {
              strokeColor: theme.accent,
              strokeWidth: 1.5,
            },
            fixed: true,
            highlight: true,
            hasInnerPoints: true,
            highlightFillColor: theme.accent,
            highlightStrokeColor: theme.accent,
          });

          poly.on('down', function () {
            if (!enabled || mode !== 'read') return;
            selectColumn(index);
          });

          columnPolys.push(poly);
        })(i);
      }

      board.update();
    }

    function selectColumn(index) {
      if (!enabled || mode !== 'read') return;
      showGuideForIndex(index, true);
      MCS.audio.emit('tick');
      fireChange();
    }

    function fireChange() {
      changeCallbacks.forEach(function (cb) {
        try {
          cb({ selectedCategory: selectedCategory, selectedValue: selectedValue });
        } catch (e) {
          console.warn('column-graph onChange error', e);
        }
      });
    }

    drawGridAndAxes();
    buildColumns();

    if (selectedCategory != null) {
      var startIdx = categoryIndex(categories, selectedCategory);
      if (startIdx >= 0) showGuideForIndex(startIdx, false);
    }

    function onKeyDown(e) {
      if (!enabled || mode !== 'read') return;
      var handled = false;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        focusIndex = focusIndex > 0 ? focusIndex - 1 : numCats - 1;
        handled = true;
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        focusIndex = focusIndex < numCats - 1 ? focusIndex + 1 : 0;
        handled = true;
      } else if (e.key === 'Enter' || e.key === ' ') {
        selectColumn(focusIndex);
        handled = true;
      }
      if (handled) {
        e.preventDefault();
        if (e.key !== 'Enter' && e.key !== ' ') {
          showGuideForIndex(focusIndex, false);
          MCS.audio.emit('tick');
        }
      }
    }

    boardWrap.addEventListener('keydown', onKeyDown);
    boardWrap.addEventListener('focus', function () {
      boardWrap.classList.add('mcs-column-graph-focused');
    });
    boardWrap.addEventListener('blur', function () {
      boardWrap.classList.remove('mcs-column-graph-focused');
    });

    function preventTouchScroll(e) {
      if (!enabled) return;
      e.preventDefault();
    }
    boardWrap.addEventListener('touchmove', preventTouchScroll, { passive: false });

    function showSolutionForCategory(name, onComplete) {
      var idx = categoryIndex(categories, name);
      if (idx < 0) {
        if (typeof onComplete === 'function') onComplete();
        return;
      }
      if (activeTween) activeTween.cancel();

      if (MCS.prefersReducedMotion()) {
        showGuideForIndex(idx, false);
        if (typeof onComplete === 'function') onComplete();
        return;
      }

      activeTween = MCS.tween({
        duration: 0.45,
        onUpdate: function () {},
        onComplete: function () {
          showGuideForIndex(idx, true);
          activeTween = null;
          if (typeof onComplete === 'function') onComplete();
        },
      });
    }

    return {
      getValue: function getValue() {
        return {
          selectedCategory: selectedCategory,
          selectedValue: selectedValue,
        };
      },

      setValue: function setValue(v) {
        if (!v) return;
        if (v.selectedCategory != null) {
          var idx = categoryIndex(categories, v.selectedCategory);
          if (idx >= 0) showGuideForIndex(idx, false);
        }
      },

      setEnabled: function setEnabled(on) {
        enabled = !!on;
        boardWrap.style.pointerEvents = enabled ? '' : 'none';
        boardWrap.setAttribute('aria-disabled', enabled ? 'false' : 'true');
      },

      showSolution: function showSolution(v) {
        if (!v) return;
        var list = v.categories || (v.category != null ? [v.category] : []);
        if (!list.length) return;

        var step = 0;
        function nextStep() {
          if (step >= list.length) {
            boardWrap.classList.add('mcs-column-graph-solution-glow');
            window.setTimeout(function () {
              boardWrap.classList.remove('mcs-column-graph-solution-glow');
            }, 900);
            fireChange();
            return;
          }
          showSolutionForCategory(list[step], function () {
            step++;
            if (step < list.length) {
              window.setTimeout(nextStep, MCS.prefersReducedMotion() ? 0 : 350);
            } else {
              nextStep();
            }
          });
        }
        nextStep();
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
        boardWrap.removeEventListener('keydown', onKeyDown);
        MCS.board.destroy(boardCtx);
        container.innerHTML = '';
        changeCallbacks.length = 0;
        MCS._releaseContainer(container);
      },
    };
  });

  // ---------------------------------------------------------------------------
  // line-graph (Phase 3a — Y5 statistics pilot)
  // ---------------------------------------------------------------------------

  function normaliseLinePoints(config) {
    if (config.points && config.points.length) {
      return config.points.map(function (p, i) {
        return {
          x: p.x != null ? p.x : i + 1,
          y: p.y,
          label: p.label || 'Day ' + (i + 1),
        };
      });
    }
    var values = config.values || [];
    return values.map(function (y, i) {
      return { x: i + 1, y: y, label: 'Day ' + (i + 1) };
    });
  }

  function computeLineMaxY(points, scaleInterval, maxYOverride) {
    if (maxYOverride != null) return maxYOverride;
    var maxVal = 0;
    for (var i = 0; i < points.length; i++) {
      if (points[i].y > maxVal) maxVal = points[i].y;
    }
    return Math.ceil(maxVal / scaleInterval) * scaleInterval;
  }

  MCS.register('line-graph', function lineGraphFactory(container, config) {
    config = config || {};
    var mode = config.mode || 'read';
    var bandId = config.band || 'C';
    var bandTokens = MCS.band(bandId);
    var points = normaliseLinePoints(config);
    var numPoints = points.length;
    var scaleInterval = config.scaleInterval != null ? config.scaleInterval : 20;
    var maxY = computeLineMaxY(points, scaleInterval, config.maxY);
    var title = config.title || 'Data Set';
    var yUnit = config.yLabel || '';

    container.innerHTML = '';
    container.classList.add('mcs-line-graph');

    var liveRegion = document.createElement('div');
    liveRegion.className = 'mcs-sr-live';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    container.appendChild(liveRegion);

    if (title) {
      var titleEl = document.createElement('div');
      titleEl.className = 'mcs-line-graph-title';
      titleEl.textContent = title;
      container.appendChild(titleEl);
    }

    var boardWrap = document.createElement('div');
    boardWrap.className = 'mcs-line-graph-board';
    boardWrap.setAttribute('role', 'application');
    boardWrap.setAttribute(
      'aria-label',
      mode === 'trend'
        ? 'Line graph. Tap the segment with the steepest increase.'
        : 'Line graph. Tap a data point to read its value.'
    );
    boardWrap.tabIndex = 0;
    container.appendChild(boardWrap);

    var boardWidth = container.clientWidth;
    if (!boardWidth && container.parentElement) {
      boardWidth = container.parentElement.clientWidth;
    }
    if (!boardWidth) boardWidth = 320;
    var chartWidth = Math.min(Math.max(boardWidth, 280), 420);
    var chartHeight = bandId === 'A' ? 210 : bandId === 'B' ? 220 : 230;
    boardWrap.style.width = chartWidth + 'px';
    boardWrap.style.height = chartHeight + 'px';
    void boardWrap.offsetHeight;

    var xMin = 0.35;
    var xMax = numPoints + 0.65;
    var yMin = -0.08 * maxY;
    var yMax = maxY + scaleInterval * 0.35;

    var boardCtx = MCS.board.make(boardWrap, {
      boundingbox: [xMin, yMax, xMax, yMin],
      height: chartHeight + 'px',
      minHeight: chartHeight + 'px',
      keepAspectRatio: false,
    });
    var board = boardCtx.board;
    var theme = boardCtx.theme;

    var selectedPointIndex = null;
    var selectedSegmentStart = null;
    var focusIndex = 0;
    var enabled = true;
    var changeCallbacks = [];
    var activeTween = null;
    var staticObjects = [];
    var pointDots = [];
    var segmentHits = [];
    var crosshairV = null;
    var crosshairH = null;
    var crosshairLabel = null;
    var highlightSegment = null;

    var pointSize = bandTokens.objectSize || 5;

    function pointCoords(index) {
      return [points[index].x, points[index].y];
    }

    function formatPointSpeech(index) {
      var p = points[index];
      var unitSuffix = yUnit ? ' ' + yUnit : '';
      return p.label + ' shows ' + p.y + unitSuffix;
    }

    function formatSegmentSpeech(startIndex) {
      var left = points[startIndex];
      var right = points[startIndex + 1];
      var rise = right.y - left.y;
      return (
        'Segment from ' +
        left.label +
        ' to ' +
        right.label +
        ', change of ' +
        rise +
        (yUnit ? ' ' + yUnit : '')
      );
    }

    function removeCrosshair() {
      [crosshairV, crosshairH, crosshairLabel].forEach(function (el) {
        if (el) {
          try {
            board.removeObject(el);
          } catch (e) {
            /* ignore */
          }
        }
      });
      crosshairV = crosshairH = crosshairLabel = null;
    }

    function removeSegmentHighlight() {
      if (highlightSegment) {
        try {
          board.removeObject(highlightSegment);
        } catch (e) {
          /* ignore */
        }
        highlightSegment = null;
      }
    }

    function resetPointStyles() {
      for (var i = 0; i < pointDots.length; i++) {
        if (!pointDots[i]) continue;
        var isSelected = i === selectedPointIndex;
        pointDots[i].setAttribute({
          fillColor: isSelected ? theme.accent : theme.accentSoft,
          strokeColor: theme.accent,
          strokeWidth: isSelected ? 2.5 : 1.5,
          size: isSelected ? pointSize * 1.2 : pointSize,
        });
      }
    }

    function showCrosshairForIndex(index, animate) {
      if (index < 0 || index >= numPoints) return;
      removeCrosshair();
      removeSegmentHighlight();
      selectedPointIndex = index;
      selectedSegmentStart = null;
      var p = points[index];
      var cx = p.x;
      var cy = p.y;

      crosshairV = board.create(
        'segment',
        [
          [cx, 0],
          [cx, cy],
        ],
        {
          strokeColor: theme.accent,
          strokeWidth: 2,
          dash: 2,
          fixed: true,
          highlight: false,
          withLabel: false,
        }
      );
      crosshairH = board.create(
        'segment',
        [
          [xMin, cy],
          [cx, cy],
        ],
        {
          strokeColor: theme.accent,
          strokeWidth: 2,
          dash: 2,
          fixed: true,
          highlight: false,
          withLabel: false,
        }
      );
      crosshairLabel = board.create('text', [xMin + 0.02, cy, String(p.y)], {
        fontSize: bandTokens.fontSizeMin,
        strokeColor: theme.accent,
        fixed: true,
        highlight: false,
        anchorX: 'left',
        anchorY: 'middle',
        cssStyle: 'font-family:' + theme.fontMono + ';font-weight:700;',
      });

      resetPointStyles();
      focusIndex = index;
      liveRegion.textContent = formatPointSpeech(index);
      board.update();

      if (animate && !MCS.prefersReducedMotion()) {
        boardWrap.classList.add('mcs-line-graph-guide-pulse');
        window.setTimeout(function () {
          boardWrap.classList.remove('mcs-line-graph-guide-pulse');
        }, 400);
      }
    }

    function showSegmentHighlight(startIndex, animate) {
      if (startIndex < 0 || startIndex >= numPoints - 1) return;
      removeCrosshair();
      removeSegmentHighlight();
      selectedSegmentStart = startIndex;
      selectedPointIndex = null;

      var left = points[startIndex];
      var right = points[startIndex + 1];
      highlightSegment = board.create(
        'segment',
        [
          [left.x, left.y],
          [right.x, right.y],
        ],
        {
          strokeColor: theme.accent,
          strokeWidth: 5,
          fixed: true,
          highlight: false,
          withLabel: false,
        }
      );

      resetPointStyles();
      focusIndex = startIndex;
      liveRegion.textContent = formatSegmentSpeech(startIndex);
      board.update();

      if (animate && !MCS.prefersReducedMotion()) {
        boardWrap.classList.add('mcs-line-graph-guide-pulse');
        window.setTimeout(function () {
          boardWrap.classList.remove('mcs-line-graph-guide-pulse');
        }, 400);
      }
    }

    function drawGridAndAxes() {
      for (var v = 0; v <= maxY; v += scaleInterval) {
        staticObjects.push(
          board.create(
            'segment',
            [
              [xMin, v],
              [xMax, v],
            ],
            {
              strokeColor: theme.gridLine,
              strokeWidth: 1,
              dash: 2,
              fixed: true,
              highlight: false,
              withLabel: false,
            }
          )
        );
        staticObjects.push(
          MCS.board.label(boardCtx, [xMin + 0.02, v], String(v), {
            fontSize: bandTokens.fontSizeMin - 2,
            anchorX: 'left',
            anchorY: 'middle',
          })
        );
      }

      staticObjects.push(
        board.create(
          'segment',
          [
            [xMin, 0],
            [xMax, 0],
          ],
          {
            strokeColor: theme.ink,
            strokeWidth: 2,
            fixed: true,
            highlight: false,
            withLabel: false,
          }
        )
      );
      staticObjects.push(
        board.create(
          'segment',
          [
            [xMin, 0],
            [xMin, maxY],
          ],
          {
            strokeColor: theme.ink,
            strokeWidth: 2,
            fixed: true,
            highlight: false,
            withLabel: false,
          }
        )
      );

      for (var li = 0; li < numPoints; li++) {
        staticObjects.push(
          MCS.board.label(boardCtx, [points[li].x, -maxY * 0.06], points[li].label, {
            fontSize: bandTokens.fontSizeMin - 1,
            anchorY: 'top',
          })
        );
      }
    }

    function buildGraph() {
      var areaCoords = [[points[0].x, 0]];
      for (var ai = 0; ai < numPoints; ai++) {
        areaCoords.push(pointCoords(ai));
      }
      areaCoords.push([points[numPoints - 1].x, 0]);

      staticObjects.push(
        board.create('polygon', areaCoords, {
          fillColor: theme.accentSoft,
          fillOpacity: 0.35,
          borders: { strokeWidth: 0 },
          fixed: true,
          highlight: false,
          withLabel: false,
        })
      );

      var lineCoords = [];
      for (var li2 = 0; li2 < numPoints; li2++) {
        lineCoords.push(pointCoords(li2));
      }
      for (var seg = 0; seg < numPoints - 1; seg++) {
        staticObjects.push(
          board.create(
            'segment',
            [lineCoords[seg], lineCoords[seg + 1]],
            {
              strokeColor: theme.accent,
              strokeWidth: 2.5,
              fixed: true,
              highlight: false,
              withLabel: false,
            }
          )
        );
      }

      for (var pi = 0; pi < numPoints; pi++) {
        (function (index) {
          var dot = board.create('point', pointCoords(index), {
            size: pointSize,
            fillColor: theme.accentSoft,
            strokeColor: theme.accent,
            strokeWidth: 1.5,
            fixed: true,
            highlight: true,
            showInfobox: false,
            name: '',
          });
          if (mode === 'read') {
            dot.on('down', function () {
              if (!enabled) return;
              showCrosshairForIndex(index, true);
              MCS.audio.emit('tick');
              fireChange();
            });
          }
          pointDots.push(dot);
        })(pi);
      }

      if (mode === 'trend') {
        for (var si = 0; si < numPoints - 1; si++) {
          (function (startIndex) {
            var left = points[startIndex];
            var right = points[startIndex + 1];
            var hit = board.create(
              'segment',
              [
                [left.x, left.y],
                [right.x, right.y],
              ],
              {
                strokeColor: theme.accent,
                strokeOpacity: 0.001,
                strokeWidth: 14,
                fixed: true,
                highlight: false,
                withLabel: false,
              }
            );
            hit.on('down', function () {
              if (!enabled) return;
              showSegmentHighlight(startIndex, true);
              MCS.audio.emit('tick');
              fireChange();
            });
            segmentHits.push(hit);
          })(si);
        }
      }

      board.update();
    }

    function fireChange() {
      changeCallbacks.forEach(function (cb) {
        try {
          cb({
            pointIndex: selectedPointIndex,
            segmentStart: selectedSegmentStart,
          });
        } catch (e) {
          console.warn('line-graph onChange error', e);
        }
      });
    }

    drawGridAndAxes();
    buildGraph();

    if (config.highlightPointIndex != null) {
      showCrosshairForIndex(config.highlightPointIndex, false);
    } else if (config.highlightSegmentStart != null) {
      showSegmentHighlight(config.highlightSegmentStart, false);
    }

    function onKeyDown(e) {
      if (!enabled) return;
      var handled = false;
      var maxFocus = mode === 'trend' ? numPoints - 2 : numPoints - 1;
      if (maxFocus < 0) return;

      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        focusIndex = focusIndex > 0 ? focusIndex - 1 : maxFocus;
        handled = true;
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        focusIndex = focusIndex < maxFocus ? focusIndex + 1 : 0;
        handled = true;
      } else if (e.key === 'Enter' || e.key === ' ') {
        if (mode === 'trend') {
          showSegmentHighlight(focusIndex, true);
        } else {
          showCrosshairForIndex(focusIndex, true);
        }
        MCS.audio.emit('tick');
        fireChange();
        handled = true;
      }

      if (handled) {
        e.preventDefault();
        if (e.key !== 'Enter' && e.key !== ' ') {
          if (mode === 'trend') {
            showSegmentHighlight(focusIndex, false);
          } else {
            showCrosshairForIndex(focusIndex, false);
          }
          MCS.audio.emit('tick');
        }
      }
    }

    boardWrap.addEventListener('keydown', onKeyDown);
    boardWrap.addEventListener('focus', function () {
      boardWrap.classList.add('mcs-line-graph-focused');
    });
    boardWrap.addEventListener('blur', function () {
      boardWrap.classList.remove('mcs-line-graph-focused');
    });

    function preventTouchScroll(e) {
      if (!enabled) return;
      e.preventDefault();
    }
    boardWrap.addEventListener('touchmove', preventTouchScroll, { passive: false });

    return {
      getValue: function getValue() {
        return {
          pointIndex: selectedPointIndex,
          y: selectedPointIndex != null ? points[selectedPointIndex].y : null,
          segmentStart: selectedSegmentStart,
        };
      },

      setValue: function setValue(v) {
        if (!v) return;
        if (v.pointIndex != null) {
          showCrosshairForIndex(v.pointIndex, false);
        } else if (v.segmentStart != null) {
          showSegmentHighlight(v.segmentStart, false);
        }
      },

      setEnabled: function setEnabled(on) {
        enabled = !!on;
        boardWrap.style.pointerEvents = enabled ? '' : 'none';
        boardWrap.setAttribute('aria-disabled', enabled ? 'false' : 'true');
      },

      showSolution: function showSolution(v) {
        if (!v) return;
        if (activeTween) activeTween.cancel();

        function finish() {
          boardWrap.classList.add('mcs-line-graph-solution-glow');
          window.setTimeout(function () {
            boardWrap.classList.remove('mcs-line-graph-solution-glow');
          }, 900);
          fireChange();
        }

        if (MCS.prefersReducedMotion()) {
          if (v.segmentStart != null) {
            showSegmentHighlight(v.segmentStart, false);
          } else if (v.pointIndex != null) {
            showCrosshairForIndex(v.pointIndex, false);
          }
          finish();
          return;
        }

        activeTween = MCS.tween({
          duration: 0.45,
          onUpdate: function () {},
          onComplete: function () {
            if (v.segmentStart != null) {
              showSegmentHighlight(v.segmentStart, true);
            } else if (v.pointIndex != null) {
              showCrosshairForIndex(v.pointIndex, true);
            }
            activeTween = null;
            finish();
          },
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
        boardWrap.removeEventListener('keydown', onKeyDown);
        MCS.board.destroy(boardCtx);
        container.innerHTML = '';
        changeCallbacks.length = 0;
        MCS._releaseContainer(container);
      },
    };
  });
  }

  // ---------------------------------------------------------------------------
  // Probability suite — Konva (Phase 3a Slice 5)
  // ---------------------------------------------------------------------------

  if (typeof Konva !== 'undefined' && MCS.stage) {
    var MARBLE_GRADIENTS = {
      red: ['#ff6b6b', '#c0392b'],
      blue: ['#74b9ff', '#0984e3'],
      green: ['#55efc4', '#00b894'],
      yellow: ['#ffeaa7', '#fdcb6e'],
    };

    function marbleFill(color) {
      var g = MARBLE_GRADIENTS[color] || MARBLE_GRADIENTS.blue;
      return g[1];
    }

    function marbleHighlight(color) {
      var g = MARBLE_GRADIENTS[color] || MARBLE_GRADIENTS.blue;
      return g[0];
    }

    function usableKonvaWidth(el) {
      var node = el;
      while (node) {
        if (node.clientWidth > 0) return node.clientWidth;
        node = node.parentElement;
      }
      return 320;
    }

    function widgetFlag(container, cls, ms) {
      container.classList.add(cls);
      window.setTimeout(function () {
        container.classList.remove(cls);
      }, ms || 500);
    }

    function buildChipGrid(host, options, selected, onToggle, enabled) {
      host.innerHTML = '';
      host.className = 'outcome-grid mcs-outcome-grid';
      options.forEach(function (opt) {
        var chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'outcome-chip';
        chip.textContent = String(opt);
        chip.dataset.val = String(opt);
        if (selected.indexOf(String(opt)) !== -1) chip.classList.add('selected');
        chip.disabled = !enabled;
        chip.addEventListener('click', function () {
          if (!enabled) return;
          MCS.audio.emit('tick');
          chip.classList.toggle('selected');
          onToggle(String(opt), chip.classList.contains('selected'));
        });
        host.appendChild(chip);
      });
    }

    function syncChipGrid(host, selected) {
      host.querySelectorAll('.outcome-chip').forEach(function (chip) {
        var val = chip.dataset.val;
        chip.classList.toggle('selected', selected.indexOf(val) !== -1);
      });
    }

    function renderTallyBars(host, outcomes, frequencies) {
      host.innerHTML = outcomes
        .map(function (out) {
          var freq = frequencies[out] || 0;
          var height = Math.max(4, freq * 8);
          return (
            '<div class="tally-bar-wrapper">' +
            '<span class="tally-count">' +
            freq +
            '</span>' +
            '<div class="tally-bar" style="height:' +
            height +
            'px;"></div>' +
            '<span class="tally-label">' +
            out +
            '</span>' +
            '</div>'
          );
        })
        .join('');
    }

    MCS.register('marble-bag', function marbleBagFactory(container, config) {
      config = config || {};
      var mode = config.mode || 'read';
      var bandId = config.band || 'C';
      var counts = config.counts || { red: 5, blue: 5 };
      var enabled = true;
      var changeCallbacks = [];
      var theme = MCS.theme(true);

      container.innerHTML = '';
      container.classList.add('mcs-marble-bag');

      var liveRegion = MCS.stage.ariaHost(container);
      var boardWrap = document.createElement('div');
      boardWrap.className = 'mcs-marble-bag-board';
      boardWrap.setAttribute('role', 'img');
      boardWrap.setAttribute('aria-label', 'Bag of coloured marbles');
      container.appendChild(boardWrap);

      var stageW = Math.min(Math.max(usableKonvaWidth(container), 220), 320);
      var stageH = 200;
      var stageCtx = MCS.stage.make(boardWrap, { size: stageW });
      stageCtx.guardMultiTouch();
      var stage = stageCtx.stage;
      stage.height(stageH);
      var konvaHost = boardWrap.querySelector('.mcs-konva-host');
      if (konvaHost) konvaHost.style.height = stageH + 'px';

      function drawBag() {
        var bg = stageCtx.bgLayer;
        var obj = stageCtx.objLayer;
        bg.destroyChildren();
        obj.destroyChildren();

        var w = stage.width();
        var h = stage.height();
        var cx = w / 2;
        var bagTop = h * 0.18;
        var bagBottom = h * 0.88;

        bg.add(
          new Konva.Line({
            points: [
              cx - w * 0.34,
              bagTop,
              cx + w * 0.34,
              bagTop,
              cx + w * 0.38,
              bagBottom,
              cx - w * 0.38,
              bagBottom,
            ],
            closed: true,
            fill: theme.accentSoft || '#eef0ff',
            stroke: theme.ink,
            strokeWidth: 2,
            listening: false,
          })
        );

        bg.add(
          new Konva.Rect({
            x: cx - w * 0.22,
            y: bagTop - 14,
            width: w * 0.44,
            height: 16,
            cornerRadius: 6,
            fill: theme.ink,
            opacity: 0.15,
            listening: false,
          })
        );

        var marbles = [];
        Object.keys(counts).forEach(function (color) {
          var n = counts[color] || 0;
          for (var i = 0; i < n; i++) marbles.push(color);
        });

        var cols = Math.min(5, Math.max(3, Math.ceil(Math.sqrt(marbles.length))));
        var size = bandId === 'A' ? 22 : bandId === 'B' ? 20 : 18;
        var gap = 6;
        var gridW = cols * size + (cols - 1) * gap;
        var startX = cx - gridW / 2 + size / 2;
        var startY = bagTop + 28;

        marbles.forEach(function (color, idx) {
          var col = idx % cols;
          var row = Math.floor(idx / cols);
          var mx = startX + col * (size + gap);
          var my = startY + row * (size + gap);
          obj.add(
            new Konva.Circle({
              x: mx,
              y: my,
              radius: size / 2,
              fill: marbleFill(color),
              stroke: marbleHighlight(color),
              strokeWidth: 2,
              shadowColor: 'rgba(0,0,0,0.2)',
              shadowBlur: 3,
              shadowOffsetY: 2,
              listening: false,
            })
          );
        });

        stage.batchDraw();
        liveRegion.textContent =
          'Bag contains ' +
          Object.keys(counts)
            .map(function (c) {
              return (counts[c] || 0) + ' ' + c;
            })
            .join(', ');
      }

      drawBag();

      function fireChange() {
        changeCallbacks.forEach(function (cb) {
          try {
            cb({ counts: counts, mode: mode });
          } catch (e) {
            console.warn('marble-bag onChange error', e);
          }
        });
      }

      return {
        getValue: function getValue() {
          return { counts: counts, mode: mode };
        },
        setValue: function setValue() {},
        setEnabled: function setEnabled(on) {
          enabled = !!on;
        },
        showSolution: function showSolution() {
          widgetFlag(container, 'mcs-marble-bag-solution-glow', 900);
        },
        flagCorrect: function flagCorrect() {
          widgetFlag(container, 'mcs-flag-correct', 600);
        },
        flagIncorrect: function flagIncorrect() {
          widgetFlag(container, 'mcs-flag-incorrect', 450);
        },
        onChange: function onChange(cb) {
          if (typeof cb === 'function') changeCallbacks.push(cb);
        },
        destroy: function destroy() {
          MCS.stage.destroy(stageCtx);
          container.innerHTML = '';
          changeCallbacks.length = 0;
          MCS._releaseContainer(container);
        },
      };
    });

    MCS.register('dice-coin-lab', function diceCoinLabFactory(container, config) {
      config = config || {};
      var mode = config.mode || 'sample-space';
      var apparatus = config.apparatus || 'die';
      var bandId = config.band || 'C';
      var allOptions = config.allOptions || ['1', '2', '3', '4', '5', '6'];
      var outcomes =
        config.outcomes ||
        (apparatus === 'coin' ? ['Heads', 'Tails'] : apparatus === 'spinner' ? ['A', 'B', 'C', 'D'] : ['1', '2', '3', '4', '5', '6']);
      var trialCount = config.trialCount != null ? config.trialCount : 20;
      var enabled = true;
      var selected = [];
      var frequencies = {};
      var trialsComplete = false;
      var activeInterval = null;
      var changeCallbacks = [];
      var theme = MCS.theme(true);

      outcomes.forEach(function (o) {
        frequencies[o] = 0;
      });

      container.innerHTML = '';
      container.classList.add('mcs-dice-coin-lab');

      var liveRegion = MCS.stage.ariaHost(container);
      var visualWrap = document.createElement('div');
      visualWrap.className = 'mcs-dice-coin-lab-visual';
      container.appendChild(visualWrap);

      var controlsWrap = document.createElement('div');
      controlsWrap.className = 'mcs-dice-coin-lab-controls flex-col align-center gap-8';
      container.appendChild(controlsWrap);

      var stageSize = Math.min(Math.max(usableKonvaWidth(container), 180), 280);
      var stageCtx = MCS.stage.make(visualWrap, { size: stageSize });
      stageCtx.guardMultiTouch();
      var stage = stageCtx.stage;

      function drawDieFace(value) {
        var bg = stageCtx.bgLayer;
        var obj = stageCtx.objLayer;
        bg.destroyChildren();
        obj.destroyChildren();
        var w = stage.width();
        var h = stage.height();
        var cx = w / 2;
        var cy = h / 2;
        var side = Math.min(w, h) * 0.42;

        bg.add(
          new Konva.Rect({
            x: cx - side / 2,
            y: cy - side / 2,
            width: side,
            height: side,
            cornerRadius: 12,
            fill: theme.surface || '#fff',
            stroke: theme.ink,
            strokeWidth: 2,
            shadowColor: 'rgba(0,0,0,0.15)',
            shadowBlur: 6,
            shadowOffsetY: 3,
          })
        );

        var pip = side * 0.12;
        var positions = {
          1: [[0, 0]],
          2: [[-0.28, -0.28], [0.28, 0.28]],
          3: [[-0.28, -0.28], [0, 0], [0.28, 0.28]],
          4: [
            [-0.28, -0.28],
            [0.28, -0.28],
            [-0.28, 0.28],
            [0.28, 0.28],
          ],
          5: [
            [-0.28, -0.28],
            [0.28, -0.28],
            [0, 0],
            [-0.28, 0.28],
            [0.28, 0.28],
          ],
          6: [
            [-0.28, -0.28],
            [0.28, -0.28],
            [-0.28, 0],
            [0.28, 0],
            [-0.28, 0.28],
            [0.28, 0.28],
          ],
        };
        var faceVal = parseInt(value, 10) || 1;
        (positions[faceVal] || positions[1]).forEach(function (p) {
          obj.add(
            new Konva.Circle({
              x: cx + p[0] * side,
              y: cy + p[1] * side,
              radius: pip,
              fill: theme.ink,
              listening: false,
            })
          );
        });
        stage.batchDraw();
      }

      function drawCoinFace(label) {
        var bg = stageCtx.bgLayer;
        var obj = stageCtx.objLayer;
        bg.destroyChildren();
        obj.destroyChildren();
        var w = stage.width();
        var h = stage.height();
        var cx = w / 2;
        var cy = h / 2;
        var r = Math.min(w, h) * 0.34;
        bg.add(
          new Konva.Circle({
            x: cx,
            y: cy,
            radius: r,
            fill: '#f4d03f',
            stroke: '#c9a227',
            strokeWidth: 3,
            shadowColor: 'rgba(0,0,0,0.2)',
            shadowBlur: 6,
          })
        );
        obj.add(
          new Konva.Text({
            x: cx,
            y: cy,
            text: label === 'Tails' ? 'T' : 'H',
            fontSize: bandId === 'A' ? 36 : 30,
            fontFamily: theme.fontDisplay,
            fontStyle: 'bold',
            fill: theme.ink,
            align: 'center',
            verticalAlign: 'middle',
            offsetX: 12,
            offsetY: 14,
            listening: false,
          })
        );
        stage.batchDraw();
      }

      function drawSpinner() {
        var bg = stageCtx.bgLayer;
        var obj = stageCtx.objLayer;
        bg.destroyChildren();
        obj.destroyChildren();
        var w = stage.width();
        var h = stage.height();
        var cx = w / 2;
        var cy = h / 2;
        var r = Math.min(w, h) * 0.38;
        var sectors = outcomes.length || 4;
        var colors = [theme.accent, '#74b9ff', '#55efc4', '#fdcb6e', '#ff6b6b', '#a29bfe'];

        for (var i = 0; i < sectors; i++) {
          var start = (i * 360) / sectors - 90;
          var end = ((i + 1) * 360) / sectors - 90;
          bg.add(
            new Konva.Wedge({
              x: cx,
              y: cy,
              radius: r,
              angle: 360 / sectors,
              rotation: start,
              fill: colors[i % colors.length],
              stroke: theme.ink,
              strokeWidth: 1.5,
              listening: false,
            })
          );
          var mid = ((start + end) / 2) * (Math.PI / 180);
          obj.add(
            new Konva.Text({
              x: cx + Math.cos(mid) * r * 0.55,
              y: cy + Math.sin(mid) * r * 0.55,
              text: String(outcomes[i]),
              fontSize: 16,
              fontFamily: theme.fontMono,
              fontStyle: 'bold',
              fill: '#fff',
              align: 'center',
              offsetX: 6,
              offsetY: 8,
              listening: false,
            })
          );
        }
        obj.add(
          new Konva.Circle({
            x: cx,
            y: cy,
            radius: 8,
            fill: theme.ink,
            listening: false,
          })
        );
        stage.batchDraw();
      }

      function drawApparatus(displayValue) {
        if (apparatus === 'coin') drawCoinFace(displayValue || 'Heads');
        else if (apparatus === 'spinner') drawSpinner();
        else drawDieFace(displayValue || '1');
      }

      var chipHost = document.createElement('div');
      var tallyHost = document.createElement('div');
      tallyHost.className = 'experiment-tally mcs-experiment-tally';

      function rebuildControls() {
        controlsWrap.innerHTML = '';
        if (mode === 'sample-space') {
          controlsWrap.appendChild(chipHost);
          buildChipGrid(
            chipHost,
            allOptions,
            selected,
            function (val, isOn) {
              if (!enabled) return;
              if (isOn && selected.indexOf(val) === -1) selected.push(val);
              else if (!isOn) selected = selected.filter(function (s) {
                return s !== val;
              });
              fireChange();
            },
            enabled
          );
        } else if (mode === 'experiment') {
          controlsWrap.appendChild(tallyHost);
          if (!trialsComplete) {
            var runBtn = document.createElement('button');
            runBtn.type = 'button';
            runBtn.className = 'btn-primary mcs-run-trials-btn';
            runBtn.textContent = 'Simulate ' + trialCount + ' Trials';
            runBtn.disabled = !enabled;
            runBtn.addEventListener('click', runTrials);
            controlsWrap.insertBefore(runBtn, tallyHost);
          }
          renderTallyBars(tallyHost, outcomes, frequencies);
        }
      }

      function runTrials() {
        if (!enabled || trialsComplete) return;
        MCS.audio.emit('tick');
        trialsComplete = false;
        outcomes.forEach(function (o) {
          frequencies[o] = 0;
        });
        renderTallyBars(tallyHost, outcomes, frequencies);

        var step = 0;
        var runBtn = controlsWrap.querySelector('.mcs-run-trials-btn');
        if (runBtn) {
          runBtn.disabled = true;
          runBtn.style.opacity = '0.5';
        }

        if (activeInterval) clearInterval(activeInterval);
        activeInterval = setInterval(function () {
          MCS.audio.emit('tick');
          var result = outcomes[Math.floor(Math.random() * outcomes.length)];
          frequencies[result]++;
          drawApparatus(result);
          renderTallyBars(tallyHost, outcomes, frequencies);
          liveRegion.textContent = 'Trial ' + (step + 1) + ': ' + result;
          step++;
          if (step >= trialCount) {
            clearInterval(activeInterval);
            activeInterval = null;
            trialsComplete = true;
            if (runBtn) runBtn.remove();
            fireChange();
          }
        }, MCS.prefersReducedMotion() ? 40 : 100);
      }

      function fireChange() {
        changeCallbacks.forEach(function (cb) {
          try {
            cb({
              selected: selected.slice(),
              frequencies: Object.assign({}, frequencies),
              trialsComplete: trialsComplete,
            });
          } catch (e) {
            console.warn('dice-coin-lab onChange error', e);
          }
        });
      }

      drawApparatus();
      rebuildControls();

      return {
        getValue: function getValue() {
          return {
            apparatus: apparatus,
            mode: mode,
            selected: selected.slice(),
            frequencies: Object.assign({}, frequencies),
            trialsComplete: trialsComplete,
            outcomes: outcomes.slice(),
          };
        },
        setValue: function setValue(v) {
          if (!v) return;
          if (v.selected) {
            selected = v.selected.map(String);
            syncChipGrid(chipHost, selected);
          }
        },
        setEnabled: function setEnabled(on) {
          enabled = !!on;
          rebuildControls();
        },
        showSolution: function showSolution(v) {
          if (mode === 'sample-space' && v && v.selected) {
            selected = v.selected.map(String);
            syncChipGrid(chipHost, selected);
          }
          widgetFlag(container, 'mcs-dice-coin-lab-solution-glow', 900);
        },
        flagCorrect: function flagCorrect() {
          widgetFlag(container, 'mcs-flag-correct', 600);
        },
        flagIncorrect: function flagIncorrect() {
          widgetFlag(container, 'mcs-flag-incorrect', 450);
        },
        onChange: function onChange(cb) {
          if (typeof cb === 'function') changeCallbacks.push(cb);
        },
        destroy: function destroy() {
          if (activeInterval) clearInterval(activeInterval);
          MCS.stage.destroy(stageCtx);
          container.innerHTML = '';
          changeCallbacks.length = 0;
          MCS._releaseContainer(container);
        },
      };
    });

    MCS.register('spinner', function spinnerFactory(container, config) {
      config = config || {};
      var mode = config.mode || 'display';
      var sectors = config.sectors || [
        { label: 'A', color: '#0052ff' },
        { label: 'B', color: '#0984e3' },
        { label: 'C', color: '#00b894' },
        { label: 'D', color: '#fdcb6e' },
      ];
      var trialCount = config.trialCount != null ? config.trialCount : 20;
      var enabled = true;
      var frequencies = {};
      var trialsComplete = false;
      var rotation = 0;
      var activeTween = null;
      var changeCallbacks = [];
      var theme = MCS.theme(true);

      sectors.forEach(function (s) {
        frequencies[s.label] = 0;
      });

      container.innerHTML = '';
      container.classList.add('mcs-spinner-widget');

      var liveRegion = MCS.stage.ariaHost(container);
      var visualWrap = document.createElement('div');
      visualWrap.className = 'mcs-spinner-visual';
      container.appendChild(visualWrap);

      var controlsWrap = document.createElement('div');
      controlsWrap.className = 'mcs-spinner-controls flex-col align-center gap-8';
      container.appendChild(controlsWrap);

      var stageSize = Math.min(Math.max(usableKonvaWidth(container), 180), 260);
      var stageCtx = MCS.stage.make(visualWrap, { size: stageSize });
      stageCtx.guardMultiTouch();
      var stage = stageCtx.stage;
      var wheelGroup = new Konva.Group({ x: stage.width() / 2, y: stage.height() / 2 });
      stageCtx.objLayer.add(wheelGroup);

      function drawWheel() {
        wheelGroup.destroyChildren();
        var r = Math.min(stage.width(), stage.height()) * 0.38;
        var n = sectors.length;
        for (var i = 0; i < n; i++) {
          var start = (i * 360) / n - 90;
          wheelGroup.add(
            new Konva.Wedge({
              x: 0,
              y: 0,
              radius: r,
              angle: 360 / n,
              rotation: start,
              fill: sectors[i].color || theme.accent,
              stroke: theme.ink,
              strokeWidth: 1.5,
              listening: false,
            })
          );
          var mid = ((start + start + 360 / n) / 2) * (Math.PI / 180);
          wheelGroup.add(
            new Konva.Text({
              x: Math.cos(mid) * r * 0.55,
              y: Math.sin(mid) * r * 0.55,
              text: sectors[i].label,
              fontSize: 15,
              fontFamily: theme.fontMono,
              fontStyle: 'bold',
              fill: '#fff',
              offsetX: 6,
              offsetY: 8,
              listening: false,
            })
          );
        }
        wheelGroup.add(
          new Konva.Circle({
            x: 0,
            y: 0,
            radius: 8,
            fill: theme.ink,
            listening: false,
          })
        );
        wheelGroup.rotation(rotation);
        stage.batchDraw();
      }

      var tallyHost = document.createElement('div');
      tallyHost.className = 'experiment-tally mcs-experiment-tally';
      var labels = sectors.map(function (s) {
        return s.label;
      });

      function rebuildControls() {
        controlsWrap.innerHTML = '';
        if (mode === 'experiment') {
          controlsWrap.appendChild(tallyHost);
          if (!trialsComplete) {
            var runBtn = document.createElement('button');
            runBtn.type = 'button';
            runBtn.className = 'btn-primary mcs-run-trials-btn';
            runBtn.textContent = 'Spin ' + trialCount + ' Times';
            runBtn.disabled = !enabled;
            runBtn.addEventListener('click', runSpins);
            controlsWrap.insertBefore(runBtn, tallyHost);
          }
          renderTallyBars(
            tallyHost,
            labels,
            frequencies
          );
        }
      }

      function pickSector() {
        return sectors[Math.floor(Math.random() * sectors.length)];
      }

      function runSpins() {
        if (!enabled || trialsComplete) return;
        MCS.audio.emit('tick');
        var runBtn = controlsWrap.querySelector('.mcs-run-trials-btn');
        if (runBtn) {
          runBtn.disabled = true;
          runBtn.style.opacity = '0.5';
        }

        var step = 0;
        function nextSpin() {
          if (step >= trialCount) {
            trialsComplete = true;
            if (runBtn) runBtn.remove();
            fireChange();
            return;
          }
          var picked = pickSector();
          frequencies[picked.label]++;
          var extra = MCS.prefersReducedMotion() ? 0 : 360 + Math.random() * 720;
          rotation += extra;
          if (activeTween) activeTween.cancel();
          if (MCS.prefersReducedMotion()) {
            wheelGroup.rotation(rotation % 360);
            stage.batchDraw();
            renderTallyBars(tallyHost, labels, frequencies);
            liveRegion.textContent = 'Spin ' + (step + 1) + ': ' + picked.label;
            step++;
            window.setTimeout(nextSpin, 30);
          } else {
            activeTween = MCS.tween({
              duration: 0.35,
              onUpdate: function (t) {
                wheelGroup.rotation(rotation - extra * (1 - t));
                stage.batchDraw();
              },
              onComplete: function () {
                wheelGroup.rotation(rotation % 360);
                stage.batchDraw();
                renderTallyBars(tallyHost, labels, frequencies);
                liveRegion.textContent = 'Spin ' + (step + 1) + ': ' + picked.label;
                MCS.audio.emit('tick');
                step++;
                window.setTimeout(nextSpin, 80);
              },
            });
          }
        }
        nextSpin();
      }

      function fireChange() {
        changeCallbacks.forEach(function (cb) {
          try {
            cb({ frequencies: Object.assign({}, frequencies), trialsComplete: trialsComplete });
          } catch (e) {
            console.warn('spinner onChange error', e);
          }
        });
      }

      drawWheel();
      rebuildControls();

      return {
        getValue: function getValue() {
          return {
            frequencies: Object.assign({}, frequencies),
            trialsComplete: trialsComplete,
            sectors: sectors.map(function (s) {
              return s.label;
            }),
          };
        },
        setValue: function setValue() {},
        setEnabled: function setEnabled(on) {
          enabled = !!on;
          rebuildControls();
        },
        showSolution: function showSolution() {
          widgetFlag(container, 'mcs-spinner-solution-glow', 900);
        },
        flagCorrect: function flagCorrect() {
          widgetFlag(container, 'mcs-flag-correct', 600);
        },
        flagIncorrect: function flagIncorrect() {
          widgetFlag(container, 'mcs-flag-incorrect', 450);
        },
        onChange: function onChange(cb) {
          if (typeof cb === 'function') changeCallbacks.push(cb);
        },
        destroy: function destroy() {
          if (activeTween) activeTween.cancel();
          MCS.stage.destroy(stageCtx);
          container.innerHTML = '';
          changeCallbacks.length = 0;
          MCS._releaseContainer(container);
        },
      };
    });
  }
})(window.MCS || {});
