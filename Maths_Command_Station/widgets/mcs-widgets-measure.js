/**
 * MCS measurement widgets — shape-measurer (JSXGraph), analog-clock, protractor (Konva);
 * ruler, balance-scale, capacity-jug Band A compare (Phase 5.7).
 */
(function (MCS) {
  'use strict';

  if (typeof JXG !== 'undefined' && MCS.board) {
    MCS.register('shape-measurer', function shapeMeasurerFactory(container, config) {
      config = config || {};
      var mode = config.mode || 'missing-sides';
      var bandId = config.band || 'C';
      var bandTokens = MCS.band(bandId);
      var W = config.width != null ? config.width : 10;
      var H = config.height != null ? config.height : 10;
      var cutW = config.cutWidth != null ? config.cutWidth : 3;
      var cutH = config.cutHeight != null ? config.cutHeight : 3;
      var unit = config.unit || 'm';
      var topW = W - cutW;
      var rightH = H - cutH;

      container.innerHTML = '';
      container.classList.add('mcs-shape-measurer');

      var liveRegion = document.createElement('div');
      liveRegion.className = 'mcs-sr-live';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      container.appendChild(liveRegion);

      var boardWrap = document.createElement('div');
      boardWrap.className = 'mcs-shape-measurer-board';
      boardWrap.setAttribute('role', 'application');
      boardWrap.setAttribute(
        'aria-label',
        config.ariaLabel ||
          'Compound L-shape on a unit grid. Tap edges to highlight them while finding the perimeter.'
      );
      boardWrap.tabIndex = 0;
      container.appendChild(boardWrap);

      var boardWidth = container.clientWidth;
      if (!boardWidth && container.parentElement) {
        boardWidth = container.parentElement.clientWidth;
      }
      if (!boardWidth) boardWidth = 360;
      var plotSize = Math.min(Math.max(boardWidth, 280), 420);
      boardWrap.style.width = plotSize + 'px';
      boardWrap.style.height = Math.round(plotSize * 0.92) + 'px';
      void boardWrap.offsetHeight;

      var boardCtx = MCS.board.make(boardWrap, {
        boundingbox: [-1.2, H + 1.8, W + 1.8, -1.2],
        height: Math.round(plotSize * 0.92) + 'px',
        minHeight: Math.round(plotSize * 0.92) + 'px',
      });
      var board = boardCtx.board;
      var theme = boardCtx.theme;

      MCS.board.grid(boardCtx, {
        xMin: 0,
        xMax: W,
        yMin: 0,
        yMax: H,
        step: 1,
      });

      var verts = [
        [0, H],
        [topW, H],
        [topW, cutH],
        [W, cutH],
        [W, 0],
        [0, 0],
      ];

      board.create('polygon', verts, {
        borders: {
          strokeColor: theme.accent,
          strokeWidth: 2.5,
        },
        fillColor: theme.accentSoft || 'rgba(0, 82, 255, 0.12)',
        fixed: true,
        highlight: false,
        withLines: true,
        vertices: { visible: false },
      });

      var edgeDefs = [
        { id: 'top', p1: [0, H], p2: [topW, H], len: topW, hidden: mode === 'missing-sides' },
        {
          id: 'rightUpper',
          p1: [topW, H],
          p2: [topW, cutH],
          len: rightH,
          hidden: mode === 'missing-sides',
        },
        { id: 'inner', p1: [topW, cutH], p2: [W, cutH], len: cutW, hidden: false },
        { id: 'rightLower', p1: [W, cutH], p2: [W, 0], len: cutH, hidden: false },
        { id: 'bottom', p1: [W, 0], p2: [0, 0], len: W, hidden: false },
        { id: 'left', p1: [0, 0], p2: [0, H], len: H, hidden: false },
      ];

      var labelEls = {};
      var edgeSegs = [];
      var highlighted = Object.create(null);
      var labelsRevealed = mode !== 'missing-sides';
      var enabled = true;
      var changeCallbacks = [];

      function midPoint(p1, p2) {
        return [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
      }

      function labelOffset(edge) {
        if (edge.id === 'top') return [0, 0.55];
        if (edge.id === 'bottom') return [0, -0.55];
        if (edge.id === 'left') return [-0.55, 0];
        if (edge.id === 'rightUpper' || edge.id === 'rightLower') return [0.55, 0];
        if (edge.id === 'inner') return [0, -0.45];
        return [0, 0];
      }

      function labelText(edge) {
        if (!labelsRevealed && edge.hidden) return '?';
        return edge.len + ' ' + unit;
      }

      function refreshLabels() {
        edgeDefs.forEach(function (edge) {
          var mid = midPoint(edge.p1, edge.p2);
          var off = labelOffset(edge);
          var text = labelText(edge);
          if (!labelEls[edge.id]) {
            labelEls[edge.id] = board.create(
              'text',
              [mid[0] + off[0], mid[1] + off[1], text],
              {
                fontSize: bandTokens.fontSizeMin,
                strokeColor: edge.hidden && !labelsRevealed ? theme.error : theme.ink,
                fixed: true,
                highlight: false,
                anchorX: 'middle',
                anchorY: 'middle',
                cssStyle:
                  'font-family:' +
                  theme.fontMono +
                  ';font-weight:700;' +
                  (edge.hidden && !labelsRevealed ? 'font-size:110%;' : ''),
              }
            );
          } else {
            labelEls[edge.id].setText(text);
            labelEls[edge.id].setAttribute({
              strokeColor: edge.hidden && !labelsRevealed ? theme.error : theme.ink,
            });
          }
        });
        board.update();
      }

      refreshLabels();

      edgeDefs.forEach(function (edge) {
        var seg = board.create('segment', [edge.p1, edge.p2], {
          strokeColor: theme.accent,
          strokeWidth: 8,
          opacity: 0.01,
          fixed: false,
          highlight: false,
          withLabel: false,
          showInfobox: false,
        });
        seg.on('down', function () {
          if (!enabled) return;
          highlighted[edge.id] = !highlighted[edge.id];
          seg.setAttribute({
            strokeColor: highlighted[edge.id] ? theme.correct : theme.accent,
            strokeWidth: highlighted[edge.id] ? 5 : 8,
            opacity: highlighted[edge.id] ? 0.95 : 0.01,
          });
          MCS.audio.emit(highlighted[edge.id] ? 'tick' : 'click');
          var count = Object.keys(highlighted).filter(function (k) {
            return highlighted[k];
          }).length;
          liveRegion.textContent =
            count +
            ' edge' +
            (count === 1 ? '' : 's') +
            ' highlighted. Total highlighted length: ' +
            edgeDefs
              .filter(function (e) {
                return highlighted[e.id];
              })
              .reduce(function (sum, e) {
                return sum + e.len;
              }, 0) +
            ' ' +
            unit;
          fireChange();
        });
        edgeSegs.push({ edge: edge, seg: seg });
      });

      function fireChange() {
        var payload = {
          highlightedEdges: edgeDefs
            .filter(function (e) {
              return highlighted[e.id];
            })
            .map(function (e) {
              return e.id;
            }),
        };
        changeCallbacks.forEach(function (cb) {
          try {
            cb(payload);
          } catch (e) {
            console.warn('shape-measurer onChange error', e);
          }
        });
      }

      function setLabelsRevealed(show) {
        labelsRevealed = !!show;
        refreshLabels();
      }

      function highlightAllEdges() {
        edgeSegs.forEach(function (item) {
          highlighted[item.edge.id] = true;
          item.seg.setAttribute({
            strokeColor: theme.correct,
            strokeWidth: 5,
            opacity: 0.95,
          });
        });
        board.update();
        fireChange();
      }

      var hintObserver = null;
      var widgetRegion = container.closest('.mcs-widget-region');
      if (widgetRegion && typeof MutationObserver !== 'undefined' && mode === 'missing-sides') {
        hintObserver = new MutationObserver(function () {
          if (widgetRegion.classList.contains('mcs-hint-highlight')) {
            setLabelsRevealed(true);
          }
        });
        hintObserver.observe(widgetRegion, { attributes: true, attributeFilter: ['class'] });
      }

      function preventTouchScroll(e) {
        if (!enabled) return;
        e.preventDefault();
      }

      boardWrap.addEventListener('touchmove', preventTouchScroll, { passive: false });

      return {
        getValue: function getValue() {
          return {
            highlightedEdges: edgeDefs
              .filter(function (e) {
                return highlighted[e.id];
              })
              .map(function (e) {
                return e.id;
              }),
          };
        },

        setValue: function setValue() {},

        setEnabled: function setEnabled(on) {
          enabled = !!on;
          boardWrap.style.pointerEvents = enabled ? '' : 'none';
          boardWrap.setAttribute('aria-disabled', enabled ? 'false' : 'true');
        },

        showSolution: function showSolution(v) {
          if (!v || v.revealLabels !== false) {
            setLabelsRevealed(true);
          }
          if (!v || v.highlightEdges !== false) {
            highlightAllEdges();
          }
          boardWrap.classList.add('mcs-shape-measurer-solution-glow');
          window.setTimeout(function () {
            boardWrap.classList.remove('mcs-shape-measurer-solution-glow');
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
          boardWrap.removeEventListener('touchmove', preventTouchScroll);
          MCS.board.destroy(boardCtx);
          container.innerHTML = '';
          changeCallbacks.length = 0;
          MCS._releaseContainer(container);
        },
      };
    });
  }

  if (typeof Konva === 'undefined' || !MCS.stage) {
    return;
  }

  function normalizeHour(h) {
    h = Math.round(h);
    while (h > 12) h -= 12;
    while (h < 1) h += 12;
    return h;
  }

  function normalizeMinute(m) {
    m = Math.round(m);
    while (m >= 60) m -= 60;
    while (m < 0) m += 60;
    return m;
  }

  function snapMinute(m, step) {
    m = Math.round(m / step) * step;
    return normalizeMinute(m);
  }

  function timeToTotal(h, m) {
    var hm = h === 12 ? 0 : h;
    return hm * 60 + m;
  }

  function totalToTime(total) {
    total = ((total % 720) + 720) % 720;
    var h = Math.floor(total / 60);
    var m = total % 60;
    if (h === 0) h = 12;
    return { hours: h, minutes: m };
  }

  function formatTimeSpeech(h, m) {
    return 'Time set to ' + h + ':' + String(m).padStart(2, '0');
  }

  function pointerAngleDeg(stage) {
    var pos = stage.getPointerPosition();
    if (!pos) return null;
    var cx = stage.width() / 2;
    var cy = stage.height() / 2;
    var dx = pos.x - cx;
    var dy = pos.y - cy;
    var angle = (Math.atan2(dx, -dy) * 180) / Math.PI;
    if (angle < 0) angle += 360;
    return angle;
  }

  function usableWidth(el) {
    var node = el;
    while (node) {
      if (node.clientWidth > 0) return node.clientWidth;
      node = node.parentElement;
    }
    return 320;
  }

  function formatDigital(h, m) {
    return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
  }

  function drawStaticClockIntoStage(stageCtx, hours, minutes, bandId, bandTokens, theme, gear) {
    var stage = stageCtx.stage;
    var bgLayer = stageCtx.bgLayer;
    var objLayer = stageCtx.objLayer;
    bgLayer.destroyChildren();
    objLayer.destroyChildren();

    var cx = stage.width() / 2;
    var cy = stage.height() / 2;
    var radius = Math.min(stage.width(), stage.height()) / 2 - 12;
    var hourLen = radius * 0.48;
    var minuteLen = radius * 0.68;

    bgLayer.add(
      new Konva.Circle({
        x: cx,
        y: cy,
        radius: radius,
        fill: theme.accentSoft || '#f3f4f6',
        stroke: theme.ink,
        strokeWidth: 2,
        listening: false,
      })
    );

    for (var t = 0; t < 60; t++) {
      var major = t % 5 === 0;
      var ang = (t * 6 * Math.PI) / 180;
      var inner = radius - (major ? 8 : 5);
      bgLayer.add(
        new Konva.Line({
          points: [
            cx + inner * Math.sin(ang),
            cy - inner * Math.cos(ang),
            cx + radius * Math.sin(ang),
            cy - radius * Math.cos(ang),
          ],
          stroke: theme.ink,
          strokeWidth: major ? 1.5 : 1,
          listening: false,
        })
      );
    }

    for (var n = 1; n <= 12; n++) {
      var nAng = (n * 30 * Math.PI) / 180;
      var tx = cx + (radius - 18) * Math.sin(nAng);
      var ty = cy - (radius - 18) * Math.cos(nAng);
      bgLayer.add(
        new Konva.Text({
          x: tx,
          y: ty,
          text: String(n),
          fontSize: Math.max(9, bandTokens.fontSizeMin - 2),
          fontFamily: (theme.fontDisplay || 'Space Grotesk, sans-serif').replace(/'/g, ''),
          fill: theme.ink,
          offsetX: 5,
          offsetY: 5,
          listening: false,
        })
      );
    }

    var hourAngle = (hours % 12) * 30 + (gear !== false ? minutes * 0.5 : 0);
    var minuteAngle = minutes * 6;

    objLayer.add(
      new Konva.Line({
        points: [cx, cy, cx + hourLen * Math.sin((hourAngle * Math.PI) / 180), cy - hourLen * Math.cos((hourAngle * Math.PI) / 180)],
        stroke: theme.ink,
        strokeWidth: bandId === 'A' ? 5 : 4,
        lineCap: 'round',
        listening: false,
      })
    );
    objLayer.add(
      new Konva.Line({
        points: [cx, cy, cx + minuteLen * Math.sin((minuteAngle * Math.PI) / 180), cy - minuteLen * Math.cos((minuteAngle * Math.PI) / 180)],
        stroke: theme.accent,
        strokeWidth: bandId === 'A' ? 4 : 3,
        lineCap: 'round',
        listening: false,
      })
    );
    bgLayer.add(
      new Konva.Circle({
        x: cx,
        y: cy,
        radius: 4,
        fill: theme.accent,
        stroke: theme.ink,
        strokeWidth: 1,
        listening: false,
      })
    );

    bgLayer.batchDraw();
    objLayer.batchDraw();
  }

  function elapsedMinutesBetween(start, end) {
    var startTotal = timeToTotal(start.hours, start.minutes);
    var endTotal = timeToTotal(end.hours, end.minutes);
    if (endTotal < startTotal) endTotal += 720;
    return endTotal - startTotal;
  }

  function buildElapsedAnalogClock(container, config) {
    config = config || {};
    var bandId = config.band || 'C';
    var bandTokens = MCS.band(bandId);
    var theme = MCS.theme(true);
    var showDigital = config.showDigital !== false;
    var gear = config.gear !== false;
    var start = config.start || { hours: 8, minutes: 0 };
    var end = config.end || { hours: 10, minutes: 0 };
    start = {
      hours: normalizeHour(start.hours != null ? start.hours : 8),
      minutes: normalizeMinute(start.minutes != null ? start.minutes : 0),
    };
    end = {
      hours: normalizeHour(end.hours != null ? end.hours : 10),
      minutes: normalizeMinute(end.minutes != null ? end.minutes : 0),
    };
    var elapsedMinutes = elapsedMinutesBetween(start, end);
    var enabled = true;
    var changeCallbacks = [];
    var stageContexts = [];

    container.innerHTML = '';
    container.classList.add('mcs-analog-clock', 'mcs-analog-clock-elapsed');

    var liveRegion = MCS.stage.ariaHost(container);
    liveRegion.textContent =
      'Elapsed time from ' +
      formatDigital(start.hours, start.minutes) +
      ' to ' +
      formatDigital(end.hours, end.minutes) +
      '.';

    var wrap = document.createElement('div');
    wrap.className = 'mcs-elapsed-clocks-wrap';
    wrap.setAttribute('role', 'group');
    wrap.setAttribute(
      'aria-label',
      'Start and end times on analog clocks'
    );
    container.appendChild(wrap);

    function addFacePanel(label, h, m) {
      var panel = document.createElement('div');
      panel.className = 'mcs-elapsed-face';
      var lbl = document.createElement('span');
      lbl.className = 'mcs-elapsed-label';
      lbl.textContent = label;
      panel.appendChild(lbl);
      var board = document.createElement('div');
      board.className = 'mcs-analog-clock-board mcs-elapsed-clock-board';
      board.setAttribute('aria-hidden', 'true');
      panel.appendChild(board);
      if (showDigital) {
        var dig = document.createElement('div');
        dig.className = 'mcs-elapsed-digital';
        dig.textContent = formatDigital(h, m);
        panel.appendChild(dig);
      }
      wrap.appendChild(panel);
      return board;
    }

    var startBoard = addFacePanel('START TIME', start.hours, start.minutes);
    var arcPanel = document.createElement('div');
    arcPanel.className = 'mcs-elapsed-connector';
    arcPanel.setAttribute('aria-hidden', 'true');
    wrap.appendChild(arcPanel);
    var endBoard = addFacePanel('END TIME', end.hours, end.minutes);

    var faceSize = Math.max(120, Math.min(Math.floor(usableWidth(container) / 2.6), 168));
    var arcSize = Math.max(52, Math.floor(faceSize * 0.42));

    function mountFace(boardEl, h, m) {
      var stageCtx = MCS.stage.make(boardEl, { size: faceSize });
      drawStaticClockIntoStage(stageCtx, h, m, bandId, bandTokens, theme, gear);
      stageContexts.push(stageCtx);
      return stageCtx;
    }

    mountFace(startBoard, start.hours, start.minutes);
    mountFace(endBoard, end.hours, end.minutes);

    var arcStageCtx = MCS.stage.make(arcPanel, { size: arcSize });
    stageContexts.push(arcStageCtx);
    var arcLayer = arcStageCtx.bgLayer;

    function drawElapsedArc(highlight) {
      arcLayer.destroyChildren();
      var w = arcStageCtx.stage.width();
      var h = arcStageCtx.stage.height();
      var cx = w / 2;
      var cy = h - 2;
      var r = Math.min(w / 2 - 2, h - 4);
      var maxMins = 180;
      var sweep = Math.min(180, (elapsedMinutes / maxMins) * 180);
      arcLayer.add(
        new Konva.Arc({
          x: cx,
          y: cy,
          innerRadius: Math.max(4, r - 10),
          outerRadius: r,
          angle: 180,
          rotation: 180,
          stroke: theme.gridLine || '#c3c5d9',
          strokeWidth: 1,
          fill: theme.accentSoft || 'rgba(0, 82, 255, 0.08)',
          listening: false,
        })
      );
      if (sweep > 0) {
        arcLayer.add(
          new Konva.Arc({
            x: cx,
            y: cy,
            innerRadius: Math.max(4, r - 10),
            outerRadius: r,
            angle: sweep,
            rotation: 180,
            fill: highlight ? theme.correct || '#059669' : theme.accent || '#0052ff',
            opacity: highlight ? 0.65 : 0.4,
            listening: false,
          })
        );
      }
      arcLayer.batchDraw();
    }

    drawElapsedArc(false);

    var resizeHandle = MCS.observeResize(container, function () {
      faceSize = Math.max(120, Math.min(Math.floor(usableWidth(container) / 2.6), 168));
      stageContexts.forEach(function (ctx) {
        MCS.stage.destroy(ctx);
      });
      stageContexts.length = 0;
      mountFace(startBoard, start.hours, start.minutes);
      mountFace(endBoard, end.hours, end.minutes);
      arcStageCtx = MCS.stage.make(arcPanel, { size: Math.max(52, Math.floor(faceSize * 0.42)) });
      stageContexts.push(arcStageCtx);
      arcLayer = arcStageCtx.bgLayer;
      drawElapsedArc(false);
    });

    function fireChange() {
      var val = {
        start: { hours: start.hours, minutes: start.minutes },
        end: { hours: end.hours, minutes: end.minutes },
        elapsedMinutes: elapsedMinutes,
      };
      changeCallbacks.forEach(function (cb) {
        try {
          cb(val);
        } catch (e) {
          console.warn('analog-clock elapsed onChange error', e);
        }
      });
    }

    return {
      getValue: function getValue() {
        return {
          start: { hours: start.hours, minutes: start.minutes },
          end: { hours: end.hours, minutes: end.minutes },
          elapsedMinutes: elapsedMinutes,
        };
      },

      setValue: function setValue() {},

      setEnabled: function setEnabled(on) {
        enabled = !!on;
        wrap.style.opacity = enabled ? '' : '0.72';
        wrap.setAttribute('aria-disabled', enabled ? 'false' : 'true');
      },

      showSolution: function showSolution() {
        drawElapsedArc(true);
        wrap.classList.add('mcs-analog-clock-solution-glow');
        window.setTimeout(function () {
          wrap.classList.remove('mcs-analog-clock-solution-glow');
        }, 900);
        var hrs = Math.floor(elapsedMinutes / 60);
        var mins = elapsedMinutes % 60;
        liveRegion.textContent =
          'Elapsed duration: ' + hrs + ' hour' + (hrs === 1 ? '' : 's') + ' and ' + mins + ' minutes.';
        fireChange();
      },

      flagCorrect: function flagCorrect() {
        wrap.classList.add('mcs-flag-correct');
        window.setTimeout(function () {
          wrap.classList.remove('mcs-flag-correct');
        }, 600);
      },

      flagIncorrect: function flagIncorrect() {
        wrap.classList.add('mcs-flag-incorrect');
        window.setTimeout(function () {
          wrap.classList.remove('mcs-flag-incorrect');
        }, 450);
      },

      onChange: function onChange(callback) {
        if (typeof callback === 'function') changeCallbacks.push(callback);
      },

      destroy: function destroy() {
        if (resizeHandle) resizeHandle.disconnect();
        stageContexts.forEach(function (ctx) {
          MCS.stage.destroy(ctx);
        });
        stageContexts.length = 0;
        container.innerHTML = '';
        changeCallbacks.length = 0;
        MCS._releaseContainer(container);
      },
    };
  }

  MCS.register('analog-clock', function analogClockFactory(container, config) {
    config = config || {};
    var mode = config.mode || 'set-time';
    if (mode === 'elapsed') {
      return buildElapsedAnalogClock(container, config);
    }
    var bandId = config.band || 'B';
    var bandTokens = MCS.band(bandId);
    var snapMinutes = config.snapMinutes != null ? config.snapMinutes : bandId === 'B' ? 5 : 1;
    var gear = config.gear !== false;
    var readOnly = mode === 'read-time' || config.draggable === 'none';
    var draggableHands = readOnly ? 'none' : config.draggable || 'both';

    container.innerHTML = '';
    container.classList.add('mcs-analog-clock');

    var liveRegion = MCS.stage.ariaHost(container);
    var boardWrap = document.createElement('div');
    boardWrap.className = 'mcs-analog-clock-board';
    boardWrap.setAttribute('role', 'application');
    boardWrap.setAttribute(
      'aria-label',
      readOnly
        ? 'Analog clock. Read the time shown.'
        : 'Analog clock. Set the time by dragging the hands.'
    );
    boardWrap.tabIndex = 0;
    container.appendChild(boardWrap);

    var minFace = bandId === 'A' ? 220 : bandId === 'B' ? 180 : 160;
    var stageSize = Math.max(minFace, Math.min(usableWidth(container), 320));

    var stageCtx = MCS.stage.make(boardWrap, {
      size: stageSize,
    });
    stageCtx.guardMultiTouch();

    var stage = stageCtx.stage;
    var bgLayer = stageCtx.bgLayer;
    var objLayer = stageCtx.objLayer;
    var theme = MCS.theme(true);

    var hours = normalizeHour(config.hours != null ? config.hours : 12);
    var minutes = normalizeMinute(config.minutes != null ? config.minutes : 0);
    var enabled = true;
    var changeCallbacks = [];
    var activeTween = null;
    var faceCircle = null;

    var cx = stage.width() / 2;
    var cy = stage.height() / 2;
    var radius = stageSize / 2 - 16;
    var hourLen = radius * 0.48;
    var minuteLen = radius * 0.68;
    var hitWidth = Math.max(bandTokens.minTouchTarget / 3, 18);

    var hourGroup = new Konva.Group({ x: cx, y: cy, name: 'hour-hand' });
    var minuteGroup = new Konva.Group({ x: cx, y: cy, name: 'minute-hand' });

    var hourLine = new Konva.Line({
      points: [0, 8, 0, -hourLen],
      stroke: theme.ink,
      strokeWidth: bandId === 'A' ? 6 : 5,
      lineCap: 'round',
      hitStrokeWidth: hitWidth,
    });
    var minuteLine = new Konva.Line({
      points: [0, 10, 0, -minuteLen],
      stroke: theme.accent,
      strokeWidth: bandId === 'A' ? 5 : 4,
      lineCap: 'round',
      hitStrokeWidth: hitWidth + 4,
    });

    hourGroup.add(hourLine);
    minuteGroup.add(minuteLine);
    objLayer.add(hourGroup);
    objLayer.add(minuteGroup);

    function drawFace() {
      bgLayer.destroyChildren();
      cx = stage.width() / 2;
      cy = stage.height() / 2;
      radius = Math.min(stage.width(), stage.height()) / 2 - 16;
      hourLen = radius * 0.48;
      minuteLen = radius * 0.68;
      hourGroup.position({ x: cx, y: cy });
      minuteGroup.position({ x: cx, y: cy });
      hourLine.points([0, 8, 0, -hourLen]);
      minuteLine.points([0, 10, 0, -minuteLen]);

      faceCircle = new Konva.Circle({
        x: cx,
        y: cy,
        radius: radius,
        fill: theme.accentSoft || '#f3f4f6',
        stroke: theme.ink,
        strokeWidth: 2,
      });
      bgLayer.add(faceCircle);

      for (var t = 0; t < 60; t++) {
        var major = t % 5 === 0;
        var ang = (t * 6 * Math.PI) / 180;
        var inner = radius - (major ? 10 : 6);
        bgLayer.add(
          new Konva.Line({
            points: [
              cx + inner * Math.sin(ang),
              cy - inner * Math.cos(ang),
              cx + radius * Math.sin(ang),
              cy - radius * Math.cos(ang),
            ],
            stroke: theme.ink,
            strokeWidth: major ? 2 : 1,
            listening: false,
          })
        );
      }

      for (var n = 1; n <= 12; n++) {
        var nAng = (n * 30 * Math.PI) / 180;
        var tx = cx + (radius - 22) * Math.sin(nAng);
        var ty = cy - (radius - 22) * Math.cos(nAng);
        bgLayer.add(
          new Konva.Text({
            x: tx,
            y: ty,
            text: String(n),
            fontSize: bandTokens.fontSizeMin,
            fontFamily: (theme.fontDisplay || 'Space Grotesk, sans-serif').replace(/'/g, ''),
            fill: theme.ink,
            align: 'center',
            verticalAlign: 'middle',
            offsetX: 6,
            offsetY: 6,
            listening: false,
          })
        );
      }

      bgLayer.add(
        new Konva.Circle({
          x: cx,
          y: cy,
          radius: 5,
          fill: theme.accent,
          stroke: theme.ink,
          strokeWidth: 1,
          listening: false,
        })
      );
      bgLayer.batchDraw();
    }

    function applyHandAngles(announce) {
      var hourAngle = (hours % 12) * 30 + (gear ? minutes * 0.5 : 0);
      var minuteAngle = minutes * 6;
      hourGroup.rotation(hourAngle);
      minuteGroup.rotation(minuteAngle);
      objLayer.batchDraw();
      if (announce) {
        liveRegion.textContent = formatTimeSpeech(hours, minutes);
      }
    }

    function setTime(h, m, silent) {
      hours = normalizeHour(h);
      minutes = gear ? snapMinute(normalizeMinute(m), snapMinutes) : normalizeMinute(m);
      applyHandAngles(!silent);
      if (!silent) fireChange();
    }

    function fireChange() {
      var val = { hours: hours, minutes: minutes };
      changeCallbacks.forEach(function (cb) {
        try {
          cb(val);
        } catch (e) {
          console.warn('analog-clock onChange error', e);
        }
      });
    }

    function updateHandFromPointer(hand) {
      var angle = pointerAngleDeg(stage);
      if (angle == null) return;
      if (hand === 'minute') {
        var newMin = snapMinute(Math.round(angle / 6) % 60, snapMinutes);
        if (newMin !== minutes) {
          minutes = newMin;
          MCS.audio.emit('snap');
        }
        applyHandAngles(true);
      } else {
        var newHour = Math.round(angle / 30) % 12;
        if (newHour === 0) newHour = 12;
        if (newHour !== hours) {
          hours = newHour;
          MCS.audio.emit('tick');
        }
        applyHandAngles(true);
      }
    }

    var draggingHand = null;

    function endPointerDrag() {
      if (!draggingHand) return;
      draggingHand = null;
      hourGroup.shadowOpacity(0);
      hourGroup.shadowBlur(0);
      minuteGroup.shadowOpacity(0);
      minuteGroup.shadowBlur(0);
      if (stage.container()) stage.container().style.cursor = 'default';
      fireChange();
      MCS.audio.emit('drop');
    }

    function bindHandPointer(group, hand) {
      group.on('mouseenter', function () {
        if (enabled && !readOnly && !draggingHand && stage.container()) {
          stage.container().style.cursor = 'grab';
        }
      });
      group.on('mouseleave', function () {
        if (!draggingHand && stage.container()) {
          stage.container().style.cursor = 'default';
        }
      });
      group.on('mousedown touchstart', function (evt) {
        if (!enabled || readOnly) return;
        evt.cancelBubble = true;
        draggingHand = hand;
        group.moveToTop();
        group.shadowOpacity(0.22);
        group.shadowBlur(8);
        if (stage.container()) stage.container().style.cursor = 'grabbing';
        MCS.audio.emit('pickup');
        updateHandFromPointer(hand);
      });
    }

    function onStagePointerMove() {
      if (!draggingHand || !enabled || readOnly) return;
      updateHandFromPointer(draggingHand);
    }

    function onWindowPointerUp() {
      endPointerDrag();
    }

    stage.on('mousemove touchmove', onStagePointerMove);
    stage.on('mouseup touchend', endPointerDrag);
    window.addEventListener('mouseup', onWindowPointerUp);
    window.addEventListener('touchend', onWindowPointerUp);

    drawFace();
    applyHandAngles(true);

    var resizeHandle = MCS.observeResize(boardWrap, function () {
      drawFace();
      applyHandAngles(false);
    });

    if (!readOnly) {
      if (draggableHands === 'both' || draggableHands === 'minute') {
        bindHandPointer(minuteGroup, 'minute');
      }
      if (draggableHands === 'both' || draggableHands === 'hour') {
        bindHandPointer(hourGroup, 'hour');
      }
    }

    function tweenToTime(targetH, targetM, onComplete) {
      if (activeTween) activeTween.cancel();
      var startTotal = timeToTotal(hours, minutes);
      var endTotal = timeToTotal(targetH, targetM);

      if (MCS.prefersReducedMotion()) {
        setTime(targetH, targetM, true);
        if (typeof onComplete === 'function') onComplete();
        return;
      }

      activeTween = MCS.tween({
        duration: 0.8,
        onUpdate: function (t) {
          var total = Math.round(startTotal + (endTotal - startTotal) * t);
          var tm = totalToTime(total);
          hours = tm.hours;
          minutes = tm.minutes;
          applyHandAngles(false);
        },
        onComplete: function () {
          setTime(targetH, targetM, true);
          activeTween = null;
          applyHandAngles(true);
          if (typeof onComplete === 'function') onComplete();
        },
      });
    }

    function onKeyDown(e) {
      if (!enabled || readOnly) return;
      var handled = false;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        if (e.shiftKey) {
          setTime(hours === 1 ? 12 : hours - 1, minutes);
        } else {
          setTime(hours, minutes - snapMinutes);
        }
        handled = true;
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        if (e.shiftKey) {
          setTime(hours === 12 ? 1 : hours + 1, minutes);
        } else {
          setTime(hours, minutes + snapMinutes);
        }
        handled = true;
      } else if (e.key === 'Enter') {
        fireChange();
        handled = true;
      }
      if (handled) {
        e.preventDefault();
        if (e.key !== 'Enter') MCS.audio.emit('snap');
      }
    }

    boardWrap.addEventListener('keydown', onKeyDown);
    boardWrap.addEventListener('focus', function () {
      boardWrap.classList.add('mcs-analog-clock-focused');
    });
    boardWrap.addEventListener('blur', function () {
      boardWrap.classList.remove('mcs-analog-clock-focused');
    });

    return {
      getValue: function getValue() {
        return { hours: hours, minutes: minutes };
      },

      setValue: function setValue(v) {
        if (!v) return;
        setTime(v.hours != null ? v.hours : hours, v.minutes != null ? v.minutes : minutes);
      },

      nudgeMinutes: function nudgeMinutes(delta) {
        var total = timeToTotal(hours, minutes) + delta;
        var tm = totalToTime(total);
        setTime(tm.hours, tm.minutes);
      },

      nudgeHours: function nudgeHours(delta) {
        var total = timeToTotal(hours, minutes) + delta * 60;
        var tm = totalToTime(total);
        setTime(tm.hours, tm.minutes);
      },

      setEnabled: function setEnabled(on) {
        enabled = !!on;
        if (!on) endPointerDrag();
        boardWrap.style.pointerEvents = enabled ? '' : 'none';
        boardWrap.setAttribute('aria-disabled', enabled ? 'false' : 'true');
      },

      showSolution: function showSolution(v) {
        if (!v) return;
        tweenToTime(
          v.hours != null ? v.hours : hours,
          v.minutes != null ? v.minutes : minutes,
          function () {
            boardWrap.classList.add('mcs-analog-clock-solution-glow');
            window.setTimeout(function () {
              boardWrap.classList.remove('mcs-analog-clock-solution-glow');
            }, 900);
            fireChange();
          }
        );
      },

      flagCorrect: function flagCorrect() {
        boardWrap.classList.add('mcs-flag-correct');
        if (faceCircle) {
          faceCircle.stroke(theme.correct);
          bgLayer.batchDraw();
        }
        window.setTimeout(function () {
          boardWrap.classList.remove('mcs-flag-correct');
          if (faceCircle) {
            faceCircle.stroke(theme.ink);
            bgLayer.batchDraw();
          }
        }, 600);
      },

      flagIncorrect: function flagIncorrect() {
        var shakeTarget = minuteGroup;
        var baseRot = shakeTarget.rotation();
        shakeTarget.to({
          rotation: baseRot - 3,
          duration: 0.08,
          onFinish: function () {
            shakeTarget.to({
              rotation: baseRot + 3,
              duration: 0.08,
              onFinish: function () {
                shakeTarget.rotation(baseRot);
                objLayer.batchDraw();
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
        endPointerDrag();
        boardWrap.removeEventListener('keydown', onKeyDown);
        stage.off('mousemove touchmove', onStagePointerMove);
        stage.off('mouseup touchend', endPointerDrag);
        window.removeEventListener('mouseup', onWindowPointerUp);
        window.removeEventListener('touchend', onWindowPointerUp);
        if (resizeHandle) resizeHandle.disconnect();
        MCS.stage.destroy(stageCtx);
        container.innerHTML = '';
        changeCallbacks.length = 0;
        MCS._releaseContainer(container);
      },
    };
  });

  function classifyAngle(deg) {
    deg = ((deg % 360) + 360) % 360;
    if (deg === 0) return 'straight';
    if (deg === 90) return 'right';
    if (deg === 180) return 'straight';
    if (deg > 0 && deg < 90) return 'acute';
    if (deg > 90 && deg < 180) return 'obtuse';
    if (deg > 180 && deg < 360) return 'reflex';
    return 'straight';
  }

  function snapDeg(deg, step) {
    return Math.round(deg / step) * step;
  }

  MCS.register('protractor', function protractorFactory(container, config) {
    config = config || {};
    var mode = config.mode || 'classify';
    var bandId = config.band || 'C';
    var bandTokens = MCS.band(bandId);
    var angleDeg = config.angleDeg != null ? config.angleDeg : 45;
    var givenAngleDeg = config.givenAngleDeg != null ? config.givenAngleDeg : angleDeg;
    var snapStep = config.snapStep != null ? config.snapStep : 5;
    var enabled = true;
    var changeCallbacks = [];
    var selectedClass = '';
    var theme = MCS.theme();
    var intersectingMode = mode === 'intersecting-lines';

    container.innerHTML = '';
    container.classList.add('mcs-protractor');
    if (intersectingMode) {
      container.classList.add('mcs-protractor-intersecting');
    }

    var liveRegion = MCS.stage.ariaHost(container);
    liveRegion.textContent =
      intersectingMode
        ? 'Intersecting lines diagram. Vertically opposite and supplementary angle relationships.'
        : mode === 'measure'
          ? 'Drag the protractor to measure the angle, then enter your reading.'
          : 'Classify the angle shown below.';

    var boardWrap = document.createElement('div');
    boardWrap.className = 'mcs-protractor-board';
    boardWrap.setAttribute('role', 'application');
    boardWrap.tabIndex = 0;
    container.appendChild(boardWrap);

    var mcqWrap = null;
    var classifyOptions = ['acute', 'right', 'obtuse', 'straight', 'reflex'];

    if (mode === 'classify') {
      mcqWrap = document.createElement('div');
      mcqWrap.className = 'angle-mc-grid mcs-protractor-mcq';
      mcqWrap.style.cssText =
        'display:grid;grid-template-columns:repeat(3,1fr);gap:8px;width:100%;max-width:380px;margin:12px auto 0;';
      classifyOptions.forEach(function (name) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn-terminal angle-btn';
        btn.dataset.name = name;
        btn.textContent = name.toUpperCase();
        btn.style.padding = '6px';
        btn.style.fontSize = '0.85rem';
        btn.addEventListener('click', function () {
          if (!enabled) return;
          selectClassifyOption(name, false);
        });
        mcqWrap.appendChild(btn);
      });
      container.appendChild(mcqWrap);
    }

    var stageW = Math.min(Math.max(usableWidth(container), 260), 380);
    var stageH = intersectingMode ? 240 : mode === 'measure' ? 220 : 180;
    var stageCtx = MCS.stage.make(boardWrap, {
      size: stageW,
    });
    stageCtx.stage.height(stageH);

    var bgLayer = stageCtx.bgLayer;
    var objLayer = stageCtx.objLayer;
    var protractorGroup = null;
    var protractorRadius = 0;
    var activeTween = null;
    var mcqFocusIdx = 0;
    var rotating = false;
    var rotateStartDeg = 0;
    var rotatePtrStart = 0;
    var vertex = { x: stageW / 2, y: stageH - 28 };
    var armLen = Math.min(stageW, stageH) * 0.42;

    function fireChange() {
      changeCallbacks.forEach(function (cb) {
        try {
          cb(getValueObject());
        } catch (e) {
          console.warn('protractor onChange error', e);
        }
      });
    }

    function getProtractorCenter() {
      if (!protractorGroup) return { x: vertex.x, y: vertex.y };
      return {
        x: protractorGroup.x() + protractorRadius,
        y: protractorGroup.y() + protractorRadius,
      };
    }

    function getAlignedPlacement() {
      return {
        x: vertex.x - protractorRadius,
        y: vertex.y - protractorRadius,
        rotation: 0,
      };
    }

    function cancelTween() {
      if (activeTween) {
        activeTween.cancel();
        activeTween = null;
      }
    }

    function applySolutionGlow() {
      boardWrap.classList.add('mcs-protractor-solution-glow');
      window.setTimeout(function () {
        boardWrap.classList.remove('mcs-protractor-solution-glow');
      }, 900);
    }

    function selectClassifyOption(name, silent) {
      selectedClass = name;
      if (mcqWrap) {
        mcqWrap.querySelectorAll('.angle-btn').forEach(function (b, idx) {
          var on = b.dataset.name === name;
          b.classList.toggle('primary', on);
          if (on) mcqFocusIdx = idx;
        });
      }
      if (!silent) {
        MCS.audio.emit('click');
        liveRegion.textContent = 'Selected ' + name + ' angle.';
        fireChange();
      }
    }

    function syncMcqFocus() {
      if (!mcqWrap) return;
      var buttons = mcqWrap.querySelectorAll('.angle-btn');
      if (!buttons.length) return;
      if (mcqFocusIdx < 0) mcqFocusIdx = 0;
      if (mcqFocusIdx >= buttons.length) mcqFocusIdx = buttons.length - 1;
      buttons[mcqFocusIdx].focus();
    }

    function onBoardKeyDown(e) {
      if (!enabled) return;
      if (mode === 'classify' && mcqWrap) {
        var buttons = mcqWrap.querySelectorAll('.angle-btn');
        if (!buttons.length) return;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          mcqFocusIdx = (mcqFocusIdx + 1) % buttons.length;
          syncMcqFocus();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          mcqFocusIdx = (mcqFocusIdx - 1 + buttons.length) % buttons.length;
          syncMcqFocus();
        } else if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          var btn = buttons[mcqFocusIdx];
          if (btn) selectClassifyOption(btn.dataset.name, false);
        }
        return;
      }
      if (mode === 'measure' && protractorGroup && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        e.preventDefault();
        var delta = e.key === 'ArrowRight' ? snapStep : -snapStep;
        protractorGroup.rotation(snapDeg(protractorGroup.rotation() + delta, snapStep));
        objLayer.batchDraw();
        MCS.audio.emit('snap');
        fireChange();
      }
    }

    boardWrap.addEventListener('keydown', onBoardKeyDown);
    boardWrap.addEventListener('focus', function () {
      boardWrap.classList.add('mcs-protractor-focused');
      if (mode === 'classify') syncMcqFocus();
    });
    boardWrap.addEventListener('blur', function () {
      boardWrap.classList.remove('mcs-protractor-focused');
    });

    function getValueObject() {
      if (mode === 'classify') {
        return { classification: selectedClass };
      }
      var rot = protractorGroup ? protractorGroup.rotation() : 0;
      var pos = protractorGroup ? protractorGroup.position() : { x: 0, y: 0 };
      var center = getProtractorCenter();
      var originDist = Math.hypot(center.x - vertex.x, center.y - vertex.y);
      return {
        angle: angleDeg,
        placement: {
          x: pos.x,
          y: pos.y,
          rotation: rot,
          originAligned: originDist < 24,
        },
      };
    }

    function drawAngleArms(layer, cx, cy, len, deg) {
      var rad = (deg * Math.PI) / 180;
      layer.add(
        new Konva.Circle({
          x: cx,
          y: cy,
          radius: 4,
          fill: theme.ink,
          listening: false,
        })
      );
      layer.add(
        new Konva.Line({
          points: [cx, cy, cx + len, cy],
          stroke: theme.ink,
          strokeWidth: 3,
          lineCap: 'round',
          listening: false,
        })
      );
      layer.add(
        new Konva.Line({
          points: [cx, cy, cx + len * Math.cos(rad), cy - len * Math.sin(rad)],
          stroke: theme.accent,
          strokeWidth: 3.5,
          lineCap: 'round',
          listening: false,
        })
      );
      if (deg > 0 && deg <= 180) {
        var arcR = Math.min(28, len * 0.35);
        layer.add(
          new Konva.Arc({
            x: cx,
            y: cy,
            innerRadius: arcR - 2,
            outerRadius: arcR,
            angle: deg,
            rotation: 0,
            fill: theme.accentSoft || 'rgba(0, 82, 255, 0.12)',
            stroke: theme.accent,
            strokeWidth: 1.5,
            listening: false,
          })
        );
      }
    }

    function bindRotateHandle(group, radius) {
      var handle = new Konva.Circle({
        x: radius,
        y: 14,
        radius: Math.max(10, bandTokens.minTouchTarget / 4),
        fill: theme.accent,
        stroke: theme.ink,
        strokeWidth: 1.5,
        name: 'rotate-handle',
      });
      group.add(handle);

      function pointerAngleFromCenter() {
        var stage = group.getStage();
        if (!stage) return null;
        var ptr = stage.getPointerPosition();
        if (!ptr) return null;
        var center = group.getAbsoluteTransform().point({ x: radius, y: radius });
        return (Math.atan2(ptr.y - center.y, ptr.x - center.x) * 180) / Math.PI;
      }

      handle.on('mouseenter', function () {
        if (enabled && stageCtx.stage.container()) {
          stageCtx.stage.container().style.cursor = 'grab';
        }
      });
      handle.on('mouseleave', function () {
        if (!rotating && stageCtx.stage.container()) {
          stageCtx.stage.container().style.cursor = 'default';
        }
      });
      handle.on('mousedown touchstart', function (evt) {
        if (!enabled) return;
        evt.cancelBubble = true;
        rotating = true;
        rotateStartDeg = group.rotation();
        var stage = group.getStage();
        var ptr = stage && stage.getPointerPosition();
        if (ptr) {
          var center = group.getAbsoluteTransform().point({ x: radius, y: radius });
          rotatePtrStart = (Math.atan2(ptr.y - center.y, ptr.x - center.x) * 180) / Math.PI;
        } else {
          rotatePtrStart = 0;
        }
        if (stageCtx.stage.container()) stageCtx.stage.container().style.cursor = 'grabbing';
        MCS.audio.emit('pickup');
      });
    }

    function onRotatePointerMove() {
      if (!rotating || !enabled || !protractorGroup) return;
      var stage = stageCtx.stage;
      var ptr = stage.getPointerPosition();
      if (!ptr) return;
      var center = protractorGroup.getAbsoluteTransform().point({
        x: protractorRadius,
        y: protractorRadius,
      });
      var ang = (Math.atan2(ptr.y - center.y, ptr.x - center.x) * 180) / Math.PI;
      protractorGroup.rotation(snapDeg(rotateStartDeg + (ang - rotatePtrStart), snapStep));
      objLayer.batchDraw();
    }

    function endRotatePointer() {
      if (!rotating) return;
      rotating = false;
      if (stageCtx.stage.container()) stageCtx.stage.container().style.cursor = 'default';
      MCS.audio.emit('drop');
      fireChange();
    }

    stageCtx.stage.on('mousemove.protractor-rotate touchmove.protractor-rotate', onRotatePointerMove);
    stageCtx.stage.on('mouseup.protractor-rotate touchend.protractor-rotate', endRotatePointer);

    function buildProtractorGroup(cx, cy, radius) {
      protractorRadius = radius;
      var group = new Konva.Group({
        x: cx - radius,
        y: cy - radius,
        draggable: mode === 'measure' && enabled,
      });

      group.add(
        new Konva.Arc({
          x: radius,
          y: radius,
          innerRadius: radius - 14,
          outerRadius: radius,
          angle: 180,
          rotation: 180,
          fill: 'rgba(217, 119, 6, 0.12)',
          stroke: theme.gridLine || '#c3c5d9',
          strokeWidth: 1,
        })
      );

      for (var deg = 0; deg <= 180; deg += 15) {
        var phi = ((180 - deg) * Math.PI) / 180;
        var major = deg % 30 === 0;
        var rStart = radius - (major ? 12 : 6);
        group.add(
          new Konva.Line({
            points: [
              radius + rStart * Math.cos(phi),
              radius - rStart * Math.sin(phi),
              radius + radius * Math.cos(phi),
              radius - radius * Math.sin(phi),
            ],
            stroke: theme.gridLine || '#c3c5d9',
            strokeWidth: major ? 1 : 0.5,
            listening: false,
          })
        );
        if (major) {
          group.add(
            new Konva.Text({
              x: radius + (radius - 22) * Math.cos(phi) - 6,
              y: radius - (radius - 22) * Math.sin(phi) - 6,
              text: String(deg),
              fontSize: Math.max(9, bandTokens.fontSizeMin - 4),
              fontFamily: (theme.fontMono || 'JetBrains Mono, monospace').replace(/'/g, ''),
              fill: theme.ink,
              listening: false,
            })
          );
        }
      }

      group.add(
        new Konva.Circle({
          x: radius,
          y: radius,
          radius: 4,
          fill: theme.accent,
          stroke: theme.ink,
          strokeWidth: 1,
        })
      );

      if (mode === 'measure') {
        bindRotateHandle(group, radius);
        group.on('dragstart', function () {
          if (!enabled) return;
          group.moveToTop();
          MCS.audio.emit('pickup');
        });
        group.on('dragend', function () {
          if (!enabled) return;
          MCS.audio.emit('drop');
          fireChange();
        });
        group.on('wheel', function (e) {
          if (!enabled) return;
          e.evt.preventDefault();
          var delta = e.evt.deltaY > 0 ? -snapStep : snapStep;
          group.rotation(snapDeg(group.rotation() + delta, snapStep));
          objLayer.batchDraw();
          fireChange();
        });
      } else {
        group.listening(false);
        group.opacity(0.35);
      }

      return group;
    }

    function drawIntersectingLines(layer, cx, cy, givenDeg) {
      var len = Math.min(stageW, stageH) * 0.38;
      var radA = ((180 - givenDeg) * Math.PI) / 180;
      var x1 = cx - len * Math.cos(radA);
      var y1 = cy - len * Math.sin(radA);
      var x2 = cx + len * Math.cos(radA);
      var y2 = cy + len * Math.sin(radA);
      var x3 = cx - len * Math.cos(radA);
      var y3 = cy + len * Math.sin(radA);
      var x4 = cx + len * Math.cos(radA);
      var y4 = cy - len * Math.sin(radA);

      layer.add(
        new Konva.Line({
          points: [x1, y1, x2, y2],
          stroke: theme.onSurfaceVariant || theme.ink,
          strokeWidth: 2.5,
          lineCap: 'round',
          listening: false,
        })
      );
      layer.add(
        new Konva.Line({
          points: [x3, y3, x4, y4],
          stroke: theme.onSurfaceVariant || theme.ink,
          strokeWidth: 2.5,
          lineCap: 'round',
          listening: false,
        })
      );
      layer.add(
        new Konva.Circle({
          x: cx,
          y: cy,
          radius: 4.5,
          fill: theme.ink,
          listening: false,
        })
      );

      var arcR = 22;
      var arcRad = (givenDeg * Math.PI) / 180;
      layer.add(
        new Konva.Arc({
          x: cx,
          y: cy,
          innerRadius: arcR - 2,
          outerRadius: arcR,
          angle: givenDeg,
          rotation: 180 - givenDeg,
          stroke: theme.accent,
          strokeWidth: 2,
          listening: false,
        })
      );
      layer.add(
        new Konva.Arc({
          x: cx,
          y: cy,
          innerRadius: arcR - 2,
          outerRadius: arcR,
          angle: givenDeg,
          rotation: 0,
          stroke: theme.tertiary || '#7c3aed',
          strokeWidth: 2,
          listening: false,
        })
      );
      layer.add(
        new Konva.Arc({
          x: cx,
          y: cy,
          innerRadius: arcR - 2,
          outerRadius: arcR,
          angle: 180 - givenDeg,
          rotation: 90,
          stroke: theme.error || '#dc2626',
          strokeWidth: 2,
          listening: false,
        })
      );

      var labelFont = Math.max(10, bandTokens.fontSizeMin - 2);
      var mono = (theme.fontMono || 'JetBrains Mono, monospace').replace(/'/g, '');
      layer.add(
        new Konva.Text({
          x: cx - len * 0.55,
          y: cy - 6,
          text: givenDeg + '°',
          fontSize: labelFont,
          fontFamily: mono,
          fontStyle: 'bold',
          fill: theme.accent,
          listening: false,
        })
      );
      layer.add(
        new Konva.Text({
          x: cx + len * 0.35,
          y: cy - 6,
          text: 'x',
          fontSize: labelFont + 1,
          fontFamily: mono,
          fontStyle: 'bold',
          fill: theme.tertiary || '#7c3aed',
          listening: false,
        })
      );
      layer.add(
        new Konva.Text({
          x: cx - 6,
          y: cy - len * 0.55,
          text: 'y',
          fontSize: labelFont + 1,
          fontFamily: mono,
          fontStyle: 'bold',
          fill: theme.error || '#dc2626',
          listening: false,
        })
      );
      layer.add(
        new Konva.Text({
          x: cx - 6,
          y: cy + 4,
          text: 'O',
          fontSize: labelFont,
          fontFamily: mono,
          fontStyle: 'bold',
          fill: theme.ink,
          listening: false,
        })
      );
    }

    function drawScene() {
      bgLayer.destroyChildren();
      objLayer.destroyChildren();

      stageW = stageCtx.stage.width();
      stageH = stageCtx.stage.height();

      if (intersectingMode) {
        var icx = stageW / 2;
        var icy = stageH / 2;
        var interLayer = new Konva.Group({ listening: false });
        drawIntersectingLines(interLayer, icx, icy, givenAngleDeg);
        bgLayer.add(interLayer);
        bgLayer.batchDraw();
        objLayer.batchDraw();
        return;
      }

      vertex = { x: stageW / 2, y: stageH - 28 };
      armLen = Math.min(stageW, stageH) * 0.42;

      var underLayer = new Konva.Group({ listening: false });
      drawAngleArms(underLayer, vertex.x, vertex.y, armLen, angleDeg);
      bgLayer.add(underLayer);

      if (mode === 'measure') {
        protractorGroup = buildProtractorGroup(vertex.x, vertex.y, Math.min(armLen + 18, stageW * 0.38));
        objLayer.add(protractorGroup);
      } else {
        var ghost = buildProtractorGroup(vertex.x, vertex.y, Math.min(armLen + 10, stageW * 0.34));
        objLayer.add(ghost);
      }

      bgLayer.batchDraw();
      objLayer.batchDraw();
    }

    drawScene();

    var resizeHandle = MCS.observeResize(boardWrap, function () {
      drawScene();
    });

    return {
      getValue: function getValue() {
        return getValueObject();
      },

      setValue: function setValue(v) {
        if (!v) return;
        if (mode === 'classify' && v.classification) {
          selectClassifyOption(v.classification, true);
        }
        if (mode === 'measure' && protractorGroup && v.placement) {
          protractorGroup.position({ x: v.placement.x || 0, y: v.placement.y || 0 });
          protractorGroup.rotation(v.placement.rotation || 0);
          objLayer.batchDraw();
        }
      },

      setEnabled: function setEnabled(on) {
        enabled = !!on;
        boardWrap.style.pointerEvents = enabled ? '' : 'none';
        boardWrap.setAttribute('aria-disabled', enabled ? 'false' : 'true');
        if (mcqWrap) {
          mcqWrap.querySelectorAll('button').forEach(function (btn) {
            btn.disabled = !on;
          });
        }
        if (protractorGroup) {
          protractorGroup.draggable(mode === 'measure' && enabled);
        }
      },

      showSolution: function showSolution(v) {
        cancelTween();
        if (mode === 'classify') {
          var cls = (v && v.classification) || classifyAngle(angleDeg);
          selectClassifyOption(cls, true);
          applySolutionGlow();
          fireChange();
          return;
        }
        if (mode === 'measure' && protractorGroup) {
          var aligned = getAlignedPlacement();
          var targetX =
            v && v.placement && v.placement.x != null ? v.placement.x : aligned.x;
          var targetY =
            v && v.placement && v.placement.y != null ? v.placement.y : aligned.y;
          var targetRot =
            v && v.placement && v.placement.rotation != null
              ? v.placement.rotation
              : aligned.rotation;
          var startX = protractorGroup.x();
          var startY = protractorGroup.y();
          var startRot = protractorGroup.rotation();

          function finishMeasureSolution() {
            protractorGroup.position({ x: targetX, y: targetY });
            protractorGroup.rotation(targetRot);
            objLayer.batchDraw();
            applySolutionGlow();
            fireChange();
          }

          if (MCS.prefersReducedMotion()) {
            finishMeasureSolution();
            return;
          }

          activeTween = MCS.tween({
            duration: 0.8,
            onUpdate: function (t) {
              protractorGroup.position({
                x: startX + (targetX - startX) * t,
                y: startY + (targetY - startY) * t,
              });
              protractorGroup.rotation(startRot + (targetRot - startRot) * t);
              objLayer.batchDraw();
            },
            onComplete: function () {
              activeTween = null;
              finishMeasureSolution();
            },
          });
          return;
        }
        applySolutionGlow();
        fireChange();
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
        cancelTween();
        rotating = false;
        boardWrap.removeEventListener('keydown', onBoardKeyDown);
        stageCtx.stage.off('mousemove.protractor-rotate touchmove.protractor-rotate');
        stageCtx.stage.off('mouseup.protractor-rotate touchend.protractor-rotate');
        if (resizeHandle) resizeHandle.disconnect();
        MCS.stage.destroy(stageCtx);
        container.innerHTML = '';
        changeCallbacks.length = 0;
        MCS._releaseContainer(container);
      },
    };
  });

  // -------------------------------------------------------------------------
  // Band A tap-compare helper + ruler / balance-scale / capacity-jug (5.7 F7)
  // -------------------------------------------------------------------------

  function measureCompareTap(container, config, opts) {
    config = config || {};
    opts = opts || {};
    var bandId = config.band || 'A';
    var bandTokens = MCS.band(bandId);
    var zones = config.zones || [];
    var compareWord = config.compare || opts.compareDefault || 'more';
    var theme = MCS.theme(true);
    var enabled = true;
    var selected = null;
    var changeCallbacks = [];

    container.innerHTML = '';
    container.classList.add(opts.rootClass);

    var liveRegion = MCS.stage.ariaHost(container);
    var boardWrap = document.createElement('div');
    boardWrap.className = opts.boardClass;
    boardWrap.setAttribute('role', 'application');
    boardWrap.setAttribute('aria-label', opts.ariaLabel || 'Tap to compare');
    container.appendChild(boardWrap);

    var stageWidth = Math.min(Math.max(usableWidth(container), 300), 520);
    var stageHeight = Math.round(stageWidth * 0.42);
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

    function drawCompare() {
      bgLayer.destroyChildren();
      zones.forEach(function (z, zi) {
        var rect = {
          x: padding + zi * (colWidth + colGap),
          y: padding,
          width: colWidth,
          height: stageHeight - padding * 2 - 28,
        };
        var group = new Konva.Group({ name: 'zone-' + z.id });
        var isSelected = selected === z.id;
        var bg = new Konva.Rect({
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
          fill: isSelected ? theme.accentSoft : '#ffffff',
          stroke: isSelected ? theme.accent : theme.gridLine,
          strokeWidth: isSelected ? 3 : 1.5,
          cornerRadius: 12,
        });
        group.add(bg);
        if (typeof opts.drawZone === 'function') {
          opts.drawZone(group, z, rect, theme, bandTokens, isSelected);
        }
        var label = new Konva.Text({
          x: rect.x,
          y: rect.y + rect.height + 4,
          width: rect.width,
          align: 'center',
          text: z.label || (zi === 0 ? 'A' : 'B'),
          fontSize: bandTokens.fontSizeMin - 6,
          fontFamily: theme.fontBody,
          fontStyle: 'bold',
          fill: theme.ink,
          listening: false,
        });
        group.add(label);
        group.on('click tap', function () {
          if (!enabled) return;
          selected = z.id;
          MCS.audio.emit('tick');
          drawCompare();
          notifyChange();
        });
        bgLayer.add(group);
      });
      bgLayer.batchDraw();
    }

    function announce() {
      if (!selected) {
        liveRegion.textContent = 'Tap the item that is ' + compareWord;
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
          console.warn(opts.warnTag + ' onChange error', e);
        }
      });
    }

    drawCompare();

    var api = {
      getValue: function getValue() {
        return { selected: selected, mode: opts.modeValue };
      },
      setValue: function setValue(v) {
        selected = v && v.selected != null ? v.selected : null;
        drawCompare();
        notifyChange();
      },
      setEnabled: function setEnabled(on) {
        enabled = !!on;
        boardWrap.style.opacity = enabled ? '1' : '0.65';
        boardWrap.style.pointerEvents = enabled ? '' : 'none';
      },
      showSolution: function showSolution(v) {
        api.setValue(v || {});
        boardWrap.classList.add(opts.glowClass || 'mcs-measure-compare-solution-glow');
        window.setTimeout(function () {
          boardWrap.classList.remove(opts.glowClass || 'mcs-measure-compare-solution-glow');
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

  function rulerInformalCompare(container, config) {
    return measureCompareTap(container, config, {
      rootClass: 'mcs-ruler mcs-ruler-compare',
      boardClass: 'mcs-ruler-board',
      ariaLabel: 'Compare rod lengths. Tap the longer rod.',
      compareDefault: 'longer',
      modeValue: 'informal-compare',
      warnTag: 'ruler',
      glowClass: 'mcs-ruler-solution-glow',
      drawZone: function drawZone(group, zone, rect, theme, bandTokens) {
        var units = zone.units != null ? zone.units : 4;
        var unitW = Math.min(22, (rect.width - 24) / Math.max(units, 1));
        var unitH = Math.max(14, bandTokens.minTouchTarget / 4);
        var totalW = units * unitW + (units - 1) * 4;
        var startX = rect.x + (rect.width - totalW) / 2;
        var cy = rect.y + rect.height / 2;
        var ui;
        for (ui = 0; ui < units; ui++) {
          group.add(
            new Konva.Rect({
              x: startX + ui * (unitW + 4),
              y: cy - unitH / 2,
              width: unitW,
              height: unitH,
              fill: theme.accent,
              stroke: theme.ink,
              strokeWidth: 1.5,
              cornerRadius: 4,
              listening: false,
            })
          );
        }
      },
    });
  }

  function balanceScaleCompare(container, config) {
    return measureCompareTap(container, config, {
      rootClass: 'mcs-balance-scale mcs-balance-scale-compare',
      boardClass: 'mcs-balance-scale-board',
      ariaLabel: 'Compare weights on the balance scale. Tap the heavier side.',
      compareDefault: 'heavier',
      modeValue: 'compare',
      warnTag: 'balance-scale',
      glowClass: 'mcs-balance-scale-solution-glow',
      drawZone: function drawZone(group, zone, rect, theme, bandTokens) {
        var mass = zone.mass != null ? zone.mass : 3;
        var cx = rect.x + rect.width / 2;
        var panY = rect.y + rect.height * 0.62;
        var blockSize = Math.max(18, bandTokens.minTouchTarget / 3.5);
        var gap = 4;
        var cols = Math.min(3, mass);
        var rows = Math.ceil(mass / cols);
        var gridW = cols * blockSize + (cols - 1) * gap;
        var startX = cx - gridW / 2;
        var startY = panY - rows * (blockSize + gap);
        group.add(
          new Konva.Line({
            points: [cx - rect.width * 0.28, panY + 6, cx + rect.width * 0.28, panY + 6],
            stroke: theme.ink,
            strokeWidth: 3,
            lineCap: 'round',
            listening: false,
          })
        );
        var bi;
        for (bi = 0; bi < mass; bi++) {
          var col = bi % cols;
          var row = Math.floor(bi / cols);
          group.add(
            new Konva.Rect({
              x: startX + col * (blockSize + gap),
              y: startY + row * (blockSize + gap),
              width: blockSize,
              height: blockSize,
              fill: theme.accent,
              stroke: theme.ink,
              strokeWidth: 1.5,
              cornerRadius: 4,
              listening: false,
            })
          );
        }
      },
    });
  }

  function capacityJugCompare(container, config) {
    return measureCompareTap(container, config, {
      rootClass: 'mcs-capacity-jug mcs-capacity-jug-compare',
      boardClass: 'mcs-capacity-jug-board',
      ariaLabel: 'Compare jugs. Tap the one that holds more.',
      compareDefault: 'more',
      modeValue: 'compare',
      warnTag: 'capacity-jug',
      glowClass: 'mcs-capacity-jug-solution-glow',
      drawZone: function drawZone(group, zone, rect, theme) {
        var level = zone.level != null ? zone.level : 0.5;
        var cx = rect.x + rect.width / 2;
        var jugW = Math.min(72, rect.width * 0.55);
        var jugH = rect.height * 0.72;
        var jugX = cx - jugW / 2;
        var jugY = rect.y + (rect.height - jugH) / 2;
        var liquidH = Math.max(8, jugH * level);
        group.add(
          new Konva.Rect({
            x: jugX,
            y: jugY,
            width: jugW,
            height: jugH,
            fill: 'rgba(255,255,255,0.9)',
            stroke: theme.ink,
            strokeWidth: 2,
            cornerRadius: [8, 8, 12, 12],
            listening: false,
          })
        );
        group.add(
          new Konva.Rect({
            x: jugX + 4,
            y: jugY + jugH - liquidH,
            width: jugW - 8,
            height: liquidH,
            fill: '#38bdf8',
            opacity: 0.85,
            cornerRadius: 4,
            listening: false,
          })
        );
        group.add(
          new Konva.Rect({
            x: cx - jugW * 0.12,
            y: jugY - 10,
            width: jugW * 0.24,
            height: 12,
            fill: theme.ink,
            opacity: 0.2,
            cornerRadius: 3,
            listening: false,
          })
        );
      },
    });
  }

  function rulerInformalUnits(container, config) {
    config = config || {};
    var bandId = config.band || 'A';
    var bandTokens = MCS.band(bandId);
    var objectLength = Math.max(2, Math.min(12, config.length != null ? config.length : 6));
    var objectLabel = config.objectLabel || 'object';
    var theme = MCS.theme(true);
    var enabled = true;
    var placed = 0;
    var changeCallbacks = [];

    container.innerHTML = '';
    container.classList.add('mcs-ruler', 'mcs-ruler-informal-units');

    var liveRegion = MCS.stage.ariaHost(container);
    var boardWrap = document.createElement('div');
    boardWrap.className = 'mcs-ruler-board';
    boardWrap.setAttribute('role', 'application');
    boardWrap.setAttribute('aria-label', 'Place paperclips end to end to measure the ' + objectLabel);
    container.appendChild(boardWrap);

    var caption = document.createElement('div');
    caption.className = 'mcs-ruler-caption';
    caption.textContent = 'Tap to place paperclips along the ' + objectLabel + '.';
    container.appendChild(caption);

    var countEl = document.createElement('div');
    countEl.className = 'mcs-ruler-unit-count';
    countEl.setAttribute('aria-live', 'polite');
    container.appendChild(countEl);

    var unitW = Math.max(28, bandTokens.minTouchTarget / 2.2);
    var unitH = Math.max(16, bandTokens.minTouchTarget / 4);
    var unitGap = 4;
    var objPad = 24;
    var stageWidth = Math.min(Math.max(usableWidth(container), 300), 520);
    var trackW = objectLength * unitW + (objectLength - 1) * unitGap;
    var stageHeight = Math.max(160, unitH * 4 + 72);

    var host = document.createElement('div');
    host.className = 'mcs-konva-host';
    host.style.width = stageWidth + 'px';
    host.style.height = stageHeight + 'px';
    boardWrap.appendChild(host);

    var stage = new Konva.Stage({ container: host, width: stageWidth, height: stageHeight });
    var layer = new Konva.Layer();
    stage.add(layer);

    function trackStartX() {
      return (stageWidth - trackW) / 2;
    }

    function announce() {
      countEl.textContent = placed + ' paperclip' + (placed === 1 ? '' : 's') + ' placed';
      liveRegion.textContent =
        placed + ' of up to ' + objectLength + ' paperclips placed along the ' + objectLabel;
    }

    function notifyChange() {
      announce();
      changeCallbacks.forEach(function (cb) {
        try {
          cb(api.getValue());
        } catch (e) {
          console.warn('ruler informal-units onChange error', e);
        }
      });
    }

    function drawScene() {
      layer.destroyChildren();
      var startX = trackStartX();
      var objY = 28;
      var clipY = objY + unitH + 28;

      layer.add(
        new Konva.Rect({
          x: startX - 8,
          y: objY,
          width: trackW + 16,
          height: unitH + 8,
          fill: theme.accentSoft,
          stroke: theme.gridLine,
          strokeWidth: 1.5,
          cornerRadius: 8,
          listening: false,
        })
      );
      layer.add(
        new Konva.Rect({
          x: startX,
          y: objY + 4,
          width: trackW,
          height: unitH,
          fill: theme.accent,
          opacity: 0.85,
          cornerRadius: 6,
          listening: false,
        })
      );

      var pi;
      for (pi = 0; pi < placed; pi++) {
        var px = startX + pi * (unitW + unitGap);
        layer.add(
          new Konva.Group({
            x: px,
            y: clipY,
            listening: false,
          }).add(
            new Konva.Ellipse({
              x: unitW / 2,
              y: unitH / 2,
              radiusX: unitW / 2 - 2,
              radiusY: unitH / 2,
              fill: '#e2e8f0',
              stroke: theme.ink,
              strokeWidth: 1.5,
            })
          )
        );
      }

      if (placed < objectLength) {
        var nextX = startX + placed * (unitW + unitGap);
        var tapZone = new Konva.Rect({
          x: nextX - 4,
          y: clipY - 8,
          width: unitW + 8,
          height: unitH + 16,
          fill: 'rgba(0,0,0,0.001)',
          cornerRadius: 6,
        });
        tapZone.on('click tap', function () {
          if (!enabled) return;
          placed += 1;
          MCS.audio.emit('drop');
          drawScene();
          notifyChange();
        });
        layer.add(tapZone);
        layer.add(
          new Konva.Rect({
            x: nextX,
            y: clipY,
            width: unitW,
            height: unitH,
            stroke: theme.accent,
            strokeWidth: 2,
            dash: [6, 4],
            cornerRadius: 6,
            listening: false,
          })
        );
      }

      if (placed > 0) {
        var lastX = startX + (placed - 1) * (unitW + unitGap);
        var removeZone = new Konva.Rect({
          x: lastX - 4,
          y: clipY - 8,
          width: unitW + 8,
          height: unitH + 16,
          fill: 'rgba(0,0,0,0.001)',
        });
        removeZone.on('click tap', function (e) {
          if (!enabled || placed <= 0) return;
          e.cancelBubble = true;
          placed -= 1;
          MCS.audio.emit('tick');
          drawScene();
          notifyChange();
        });
        layer.add(removeZone);
      }

      layer.batchDraw();
    }

    drawScene();
    announce();

    var api = {
      getValue: function getValue() {
        return { unitsUsed: placed, length: objectLength, mode: 'informal-units' };
      },
      setValue: function setValue(v) {
        if (v && v.reset) {
          placed = 0;
        } else if (v && v.unitsUsed != null) {
          placed = Math.max(0, Math.min(objectLength, v.unitsUsed));
        } else {
          placed = 0;
        }
        drawScene();
        notifyChange();
      },
      setEnabled: function setEnabled(on) {
        enabled = !!on;
        boardWrap.style.opacity = enabled ? '1' : '0.65';
        boardWrap.style.pointerEvents = enabled ? '' : 'none';
      },
      showSolution: function showSolution(v) {
        var n = v && v.unitsUsed != null ? v.unitsUsed : objectLength;
        api.setValue({ unitsUsed: n });
        boardWrap.classList.add('mcs-ruler-solution-glow');
        window.setTimeout(function () {
          boardWrap.classList.remove('mcs-ruler-solution-glow');
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

  function rulerMeasureObject(container, config) {
    config = config || {};
    var bandId = config.band || 'B';
    var bandTokens = MCS.band(bandId);
    var objectLength = Math.max(3, Math.min(12, config.length != null ? config.length : 7));
    var objectLabel = config.objectLabel || 'cargo crate';
    var maxCm = Math.max(objectLength + 2, config.maxCm != null ? config.maxCm : 15);
    var theme = MCS.theme(true);
    var enabled = true;
    var selected = null;
    var changeCallbacks = [];

    container.innerHTML = '';
    container.classList.add('mcs-ruler', 'mcs-ruler-measure');

    var liveRegion = MCS.stage.ariaHost(container);
    var boardWrap = document.createElement('div');
    boardWrap.className = 'mcs-ruler-board';
    boardWrap.setAttribute('role', 'application');
    boardWrap.setAttribute('aria-label', 'Tap the centimetre mark that matches the length of the ' + objectLabel);
    container.appendChild(boardWrap);

    var caption = document.createElement('div');
    caption.className = 'mcs-ruler-caption';
    caption.textContent = 'How many centimetres long is the ' + objectLabel + '? Tap a number on the ruler.';
    container.appendChild(caption);

    var pickEl = document.createElement('div');
    pickEl.className = 'mcs-ruler-unit-count';
    pickEl.setAttribute('aria-live', 'polite');
    container.appendChild(pickEl);

    var cmSize = Math.max(22, bandTokens.minTouchTarget / 2.8);
    var stageWidth = Math.min(Math.max(usableWidth(container), 300), 520);
    var rulerW = maxCm * cmSize;
    var stageHeight = Math.max(200, cmSize * 5 + 80);
    var startX = (stageWidth - rulerW) / 2;

    var host = document.createElement('div');
    host.className = 'mcs-konva-host';
    host.style.width = stageWidth + 'px';
    host.style.height = stageHeight + 'px';
    boardWrap.appendChild(host);

    var stage = new Konva.Stage({ container: host, width: stageWidth, height: stageHeight });
    var layer = new Konva.Layer();
    stage.add(layer);

    function announce() {
      pickEl.textContent =
        selected == null ? 'No reading selected yet' : 'You selected ' + selected + ' cm';
      liveRegion.textContent =
        selected == null
          ? 'Tap a centimetre number on the ruler'
          : 'Selected length ' + selected + ' centimetres';
    }

    function notifyChange() {
      announce();
      changeCallbacks.forEach(function (cb) {
        try {
          cb(api.getValue());
        } catch (e) {
          console.warn('ruler measure-object onChange error', e);
        }
      });
    }

    function drawScene() {
      layer.destroyChildren();
      var objY = 24;
      var rulerY = objY + cmSize * 2 + 20;
      var objW = objectLength * cmSize;

      layer.add(
        new Konva.Rect({
          x: startX,
          y: objY,
          width: objW,
          height: cmSize * 1.4,
          fill: theme.accent,
          opacity: 0.88,
          stroke: theme.ink,
          strokeWidth: 1.5,
          cornerRadius: 6,
          listening: false,
        })
      );
      layer.add(
        new Konva.Line({
          points: [startX, rulerY, startX + rulerW, rulerY],
          stroke: theme.ink,
          strokeWidth: 2,
          listening: false,
        })
      );

      var ci;
      for (ci = 0; ci <= maxCm; ci++) {
        var cx = startX + ci * cmSize;
        var tickH = ci % 5 === 0 ? 14 : 8;
        layer.add(
          new Konva.Line({
            points: [cx, rulerY, cx, rulerY + tickH],
            stroke: theme.ink,
            strokeWidth: ci % 5 === 0 ? 2 : 1,
            listening: false,
          })
        );
        if (ci <= maxCm - 1 || ci === maxCm) {
          var tapZone = new Konva.Rect({
            x: cx - cmSize / 2,
            y: rulerY + tickH,
            width: cmSize,
            height: cmSize * 1.2,
            fill: selected === ci ? theme.accentSoft : 'rgba(0,0,0,0.001)',
            cornerRadius: 6,
          });
          (function (cmVal) {
            tapZone.on('click tap', function () {
              if (!enabled) return;
              selected = cmVal;
              MCS.audio.emit('click');
              drawScene();
              notifyChange();
            });
          })(ci);
          layer.add(tapZone);
          layer.add(
            new Konva.Text({
              x: cx - cmSize / 2,
              y: rulerY + tickH + 6,
              width: cmSize,
              text: String(ci),
              fontSize: Math.max(12, cmSize * 0.42),
              fontStyle: 'bold',
              fill: selected === ci ? theme.accent : theme.ink,
              align: 'center',
              listening: false,
            })
          );
        }
      }

      layer.batchDraw();
    }

    drawScene();
    announce();

    var api = {
      getValue: function getValue() {
        return { length: selected, unit: 'cm', mode: 'measure-object' };
      },
      setValue: function setValue(v) {
        if (v && v.reset) {
          selected = null;
        } else if (v && v.length != null) {
          selected = v.length;
        } else {
          selected = null;
        }
        drawScene();
        notifyChange();
      },
      setEnabled: function setEnabled(on) {
        enabled = !!on;
        boardWrap.style.opacity = enabled ? '1' : '0.65';
        boardWrap.style.pointerEvents = enabled ? '' : 'none';
      },
      showSolution: function showSolution(v) {
        var n = v && v.length != null ? v.length : objectLength;
        api.setValue({ length: n });
        boardWrap.classList.add('mcs-ruler-solution-glow');
        window.setTimeout(function () {
          boardWrap.classList.remove('mcs-ruler-solution-glow');
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

  MCS.register('ruler', function rulerFactory(container, config) {
    config = config || {};
    var mode = config.mode || 'informal-compare';
    if (mode === 'informal-compare') return rulerInformalCompare(container, config);
    if (mode === 'informal-units') return rulerInformalUnits(container, config);
    if (mode === 'measure-object') return rulerMeasureObject(container, config);
    throw new Error('ruler: unknown mode "' + mode + '"');
  });

  MCS.register('balance-scale', function balanceScaleFactory(container, config) {
    config = config || {};
    var mode = config.mode || 'compare';
    if (mode === 'compare') return balanceScaleCompare(container, config);
    throw new Error('balance-scale: unknown mode "' + mode + '"');
  });

  MCS.register('capacity-jug', function capacityJugFactory(container, config) {
    config = config || {};
    var mode = config.mode || 'compare';
    if (mode === 'compare') return capacityJugCompare(container, config);
    throw new Error('capacity-jug: unknown mode "' + mode + '"');
  });
})(window.MCS || {});
