/**
 * MCS JSXGraph board substrate — shared by number-line, coordinate plotter, etc.
 * Phase 2.1: minimum surface for number-line pilot.
 */
(function (MCS) {
  'use strict';

  if (typeof JXG === 'undefined') {
    return;
  }

  function usableWidth(el) {
    var node = el;
    while (node) {
      if (node.clientWidth > 0) return node.clientWidth;
      node = node.parentElement;
    }
    return 400;
  }

  function boardHost(container) {
    var host = container.querySelector('.mcs-jxg-host');
    if (!host) {
      host = document.createElement('div');
      host.className = 'mcs-jxg-host';
      host.style.width = '100%';
      host.style.height = '100%';
      host.style.minHeight = '120px';
      container.appendChild(host);
    }
    return host;
  }

  function uniqueBoardId(container) {
    return 'mcs-jxg-' + Math.random().toString(36).slice(2, 11);
  }

  function applyPointTheme(point, theme) {
    if (!point || !point.setAttribute) return;
    point.setAttribute({
      strokeColor: theme.accent,
      fillColor: theme.accent,
    });
  }

  function saneDim(value, fallback) {
    var n = Number(value);
    return n > 0 && isFinite(n) ? n : fallback;
  }

  MCS.board = {
    /**
     * @param {HTMLElement} container
     * @param {Object} opts
     * @param {number[]} opts.boundingbox — [xMin, yMax, xMax, yMin]
     * @param {function():void} [opts.onResize]
     */
    make: function make(container, opts) {
      opts = opts || {};
      var host = boardHost(container);
      var boardId = uniqueBoardId(container);
      host.id = boardId;
      var hostWidth = saneDim(usableWidth(container), 400);
      host.style.width = hostWidth + 'px';
      host.style.minHeight = opts.minHeight || '140px';
      host.style.height = opts.height || '140px';
      host.style.display = 'block';
      host.style.boxSizing = 'border-box';
      void host.offsetHeight;

      var board = JXG.JSXGraph.initBoard(boardId, {
        boundingbox: opts.boundingbox || [-1, 2, 11, -2],
        axis: false,
        grid: false,
        showCopyright: false,
        showNavigation: false,
        keepAspectRatio: opts.keepAspectRatio !== false,
        pan: { enabled: false },
        zoom: { wheel: false, pinch: false },
      });

      var theme = MCS.theme(true);
      var themedPoints = [];

      function safeResize() {
        if (!board || typeof board.updateContainerDims !== 'function') return;
        try {
          /* resizeContainer() with no args sets NaN — use updateContainerDims instead */
          board.updateContainerDims();
          board.update();
        } catch (e) {
          /* renderer not ready yet */
        }
      }

      var resizeHandle = MCS.observeResize(container, function (dims) {
        var w = saneDim(dims.width, saneDim(container.clientWidth, hostWidth));
        host.style.width = w + 'px';
        safeResize();
        if (typeof opts.onResize === 'function') {
          opts.onResize({ width: w, height: saneDim(container.clientHeight, 140) });
        }
      });

      safeResize();
      requestAnimationFrame(safeResize);

      function refreshTheme() {
        theme = MCS.theme(true);
        themedPoints.forEach(function (p) {
          applyPointTheme(p, theme);
        });
        if (board) {
          board.update();
        }
      }

      var mo = null;
      if (typeof MutationObserver !== 'undefined') {
        mo = new MutationObserver(function (mutations) {
          for (var i = 0; i < mutations.length; i++) {
            if (mutations[i].attributeName === 'class') {
              MCS.invalidateTheme();
              refreshTheme();
              break;
            }
          }
        });
        mo.observe(document.documentElement, { attributes: true });
        if (document.body) {
          mo.observe(document.body, { attributes: true });
        }
      }

      return {
        board: board,
        host: host,
        theme: theme,
        themedPoints: themedPoints,
        refreshTheme: refreshTheme,
        resizeHandle: resizeHandle,
        themeObserver: mo,
        destroy: function () {
          if (resizeHandle) resizeHandle.disconnect();
          if (mo) mo.disconnect();
          if (board) {
            JXG.JSXGraph.freeBoard(board);
            board = null;
          }
          host.innerHTML = '';
        },
      };
    },

    /**
     * Draggable themed point.
     */
    point: function point(boardCtx, opts) {
      opts = opts || {};
      var board = boardCtx.board;
      var theme = boardCtx.theme || MCS.theme();
      var coords = opts.coords || [0, 0];

      var pt = board.create('point', coords, {
        name: opts.name != null ? opts.name : '',
        size: opts.size != null ? opts.size : 4,
        strokeColor: opts.strokeColor || theme.accent,
        fillColor: opts.fillColor || theme.accent,
        strokeWidth: opts.strokeWidth != null ? opts.strokeWidth : 2,
        snapToGrid: !!opts.snapToGrid,
        snapSizeX: opts.snapSizeX != null ? opts.snapSizeX : 1,
        snapSizeY: opts.snapSizeY != null ? opts.snapSizeY : 1,
        withLabel: false,
        showInfobox: false,
        fixed: !!opts.fixed,
        highlight: opts.highlight !== false,
        visible: opts.visible !== false,
      });

      if (opts.trackTheme !== false) {
        boardCtx.themedPoints.push(pt);
      }

      return pt;
    },

    /**
     * Fixed text label on the board.
     */
    label: function label(boardCtx, coords, text, opts) {
      opts = opts || {};
      var theme = boardCtx.theme || MCS.theme();
      return boardCtx.board.create('text', [coords[0], coords[1], text], {
        fontSize: opts.fontSize != null ? opts.fontSize : 14,
        strokeColor: opts.strokeColor || theme.ink,
        fixed: true,
        highlight: false,
        anchorX: opts.anchorX || 'middle',
        anchorY: opts.anchorY || 'top',
        cssStyle: opts.cssStyle || 'font-family:' + theme.fontMono + ';',
      });
    },

    /**
     * Unit grid lines across the plane.
     */
    grid: function grid(boardCtx, opts) {
      opts = opts || {};
      var xMin = opts.xMin != null ? opts.xMin : -5;
      var xMax = opts.xMax != null ? opts.xMax : 5;
      var yMin = opts.yMin != null ? opts.yMin : -5;
      var yMax = opts.yMax != null ? opts.yMax : 5;
      var step = opts.step != null ? opts.step : 1;
      var theme = boardCtx.theme || MCS.theme();
      var stroke = opts.strokeColor || theme.gridLine;
      var lines = [];

      for (var x = xMin; x <= xMax; x += step) {
        lines.push(
          boardCtx.board.create(
            'segment',
            [
              [x, yMin],
              [x, yMax],
            ],
            {
              strokeColor: stroke,
              strokeWidth: 1,
              dash: 2,
              fixed: true,
              highlight: false,
              withLabel: false,
            }
          )
        );
      }
      for (var y = yMin; y <= yMax; y += step) {
        lines.push(
          boardCtx.board.create(
            'segment',
            [
              [xMin, y],
              [xMax, y],
            ],
            {
              strokeColor: stroke,
              strokeWidth: 1,
              dash: 2,
              fixed: true,
              highlight: false,
              withLabel: false,
            }
          )
        );
      }
      return lines;
    },

    /**
     * Themed x/y axes with optional numeric labels.
     */
    axes: function axes(boardCtx, opts) {
      opts = opts || {};
      var xMin = opts.xMin != null ? opts.xMin : -5;
      var xMax = opts.xMax != null ? opts.xMax : 5;
      var yMin = opts.yMin != null ? opts.yMin : -5;
      var yMax = opts.yMax != null ? opts.yMax : 5;
      var labelStep = opts.labelStep != null ? opts.labelStep : 2;
      var labelMode = opts.labels || 'axis';
      var fontSize = opts.fontSize != null ? opts.fontSize : 12;
      var theme = boardCtx.theme || MCS.theme();
      var elements = [];

      elements.push(
        boardCtx.board.create(
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
      elements.push(
        boardCtx.board.create(
          'segment',
          [
            [0, yMin],
            [0, yMax],
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
      elements.push(
        boardCtx.board.create('point', [0, 0], {
          size: 2,
          strokeColor: theme.accent,
          fillColor: theme.accent,
          fixed: true,
          highlight: false,
          withLabel: false,
          showInfobox: false,
        })
      );

      function shouldLabel(v) {
        if (labelMode === 'none') return false;
        if (labelMode === 'all') return true;
        return v % labelStep === 0;
      }

      for (var xv = xMin; xv <= xMax; xv++) {
        if (xv === 0 || !shouldLabel(xv)) continue;
        elements.push(
          MCS.board.label(boardCtx, [xv, -0.35], String(xv), {
            fontSize: fontSize,
            anchorY: 'top',
          })
        );
      }
      for (var yv = yMin; yv <= yMax; yv++) {
        if (yv === 0 || !shouldLabel(yv)) continue;
        elements.push(
          MCS.board.label(boardCtx, [-0.35, yv], String(yv), {
            fontSize: fontSize,
            anchorX: 'right',
            anchorY: 'middle',
          })
        );
      }

      return elements;
    },

    destroy: function destroy(boardCtx) {
      if (boardCtx && typeof boardCtx.destroy === 'function') {
        boardCtx.destroy();
      }
    },
  };
})(window.MCS || {});
