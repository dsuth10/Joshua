/**
 * MCS measurement widgets — shape-measurer (JSXGraph), analog-clock (Konva).
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

  MCS.register('analog-clock', function analogClockFactory(container, config) {
    config = config || {};
    var mode = config.mode || 'set-time';
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
          selectedClass = name;
          mcqWrap.querySelectorAll('.angle-btn').forEach(function (b) {
            b.classList.toggle('primary', b.dataset.name === name);
          });
          MCS.audio.emit('click');
          liveRegion.textContent = 'Selected ' + name + ' angle.';
          fireChange();
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

    function getValueObject() {
      if (mode === 'classify') {
        return { classification: selectedClass };
      }
      var rot = protractorGroup ? protractorGroup.rotation() : 0;
      var pos = protractorGroup ? protractorGroup.position() : { x: 0, y: 0 };
      var originDist = Math.hypot(pos.x + vertex.x - vertex.x, pos.y + vertex.y - vertex.y);
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

    function buildProtractorGroup(cx, cy, radius) {
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
          selectedClass = v.classification;
          if (mcqWrap) {
            mcqWrap.querySelectorAll('.angle-btn').forEach(function (b) {
              b.classList.toggle('primary', b.dataset.name === selectedClass);
            });
          }
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
        if (mode === 'classify') {
          var cls = (v && v.classification) || classifyAngle(angleDeg);
          selectedClass = cls;
          if (mcqWrap) {
            mcqWrap.querySelectorAll('.angle-btn').forEach(function (b) {
              b.classList.toggle('primary', b.dataset.name === cls);
            });
          }
        }
        boardWrap.classList.add('mcs-protractor-solution-glow');
        window.setTimeout(function () {
          boardWrap.classList.remove('mcs-protractor-solution-glow');
        }, 900);
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
        if (resizeHandle) resizeHandle.disconnect();
        MCS.stage.destroy(stageCtx);
        container.innerHTML = '';
        changeCallbacks.length = 0;
        MCS._releaseContainer(container);
      },
    };
  });
})(window.MCS || {});
