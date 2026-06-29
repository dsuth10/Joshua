/* Phase 0 spike script — throwaway. See _spike.html header comment. */
(function () {
  'use strict';

  // ---------- status helpers ----------
  const results = {};
  function setStatus(id, state, detail) {
    results[id] = state;
    const badge = document.getElementById('s-' + id);
    badge.textContent = state.toUpperCase();
    badge.className = 'status ' + (state === 'pass' ? 'pass' : state === 'fail' ? 'fail' : state === 'warn' ? 'warn' : '');
    if (detail !== undefined) document.getElementById('d-' + id).textContent = detail;
    updateSummary();
  }
  function updateSummary() {
    const el = document.getElementById('summary');
    const states = Object.values(results);
    if (states.includes('fail')) { el.className = 'fail'; el.textContent = 'GATE G0: FAIL — see red checks below.'; return; }
    const pending = ['load', 'jxg', 'snap', 'ml', 'mem', 'theme'].filter(k => !results[k] || results[k] === 'pending');
    if (pending.length) { el.className = ''; el.textContent = 'Checks pending: ' + pending.join(', '); return; }
    el.className = 'pass';
    el.textContent = 'GATE G0: PASS — all spike checks green (snap + memory require the manual/button steps above).';
  }
  function accent() {
    return getComputedStyle(document.body).getPropertyValue('--mcs-accent').trim();
  }

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    // ---------- 0.2 library load ----------
    const haveJXG = typeof window.JXG !== 'undefined';
    const haveKonva = typeof window.Konva !== 'undefined';
    const haveML = typeof window.MathLive !== 'undefined' || !!customElements.get('math-field');
    const lines = [
      'protocol            : ' + location.protocol,
      'JXG (JSXGraph)      : ' + (haveJXG ? 'v' + JXG.version : 'MISSING'),
      'Konva               : ' + (haveKonva ? 'v' + Konva.version : 'MISSING'),
      'MathLive global     : ' + (haveML ? 'present' : 'MISSING'),
      '<math-field> element: ' + (customElements.get('math-field') ? 'registered' : 'not registered'),
    ];
    setStatus('load', haveJXG && haveKonva && haveML ? 'pass' : 'fail', lines.join('\n'));
    if (!(haveJXG && haveKonva && haveML)) return;

    buildJxg();
    buildKonva();
    buildMathLive();
    wireMemoryTest();
    wireThemes();
  }

  // ---------- 0.2 / 0.6: JSXGraph board ----------
  let board = null;
  function buildJxg() {
    try {
      if (board) { JXG.JSXGraph.freeBoard(board); board = null; }
      board = JXG.JSXGraph.initBoard('jxg-board', {
        boundingbox: [-1, 11, 11, -1],
        axis: true, grid: true,
        showCopyright: false, showNavigation: false,
        keepAspectRatio: true,
        pan: { enabled: false }, zoom: { wheel: false, pinch: false },
      });
      const col = accent();
      const p = board.create('point', [3, 4], {
        name: 'P', size: 5, strokeColor: col, fillColor: col,
        snapToGrid: true, snapSizeX: 1, snapSizeY: 1,
      });
      const origin = board.create('point', [0, 0], { visible: false, fixed: true });
      board.create('segment', [origin, p], { strokeColor: col, strokeWidth: 2, dash: 2 });
      const label = board.create('text', [0.4, 10.3, () => 'P = (' + p.X() + ', ' + p.Y() + ')'], {
        fontSize: 14, strokeColor: col, fixed: true,
      });
      p.on('drag', () => board.update());
      window._spikeBoardPoint = p; // theming verification hook
      setStatus('jxg', 'pass', 'Board rendered (SVG). Point snaps to integers. label: ' + label.plaintext);
    } catch (e) {
      setStatus('jxg', 'fail', String(e));
    }
  }

  // ---------- 0.5: Konva pattern blocks with edge snapping ----------
  let stage = null;
  let snapHappened = false;
  function buildKonva() {
    try {
      if (stage) { stage.destroy(); stage = null; }
      const holder = document.getElementById('konva-holder');
      const W = holder.clientWidth, H = holder.clientHeight;
      stage = new Konva.Stage({ container: 'konva-holder', width: W, height: H });
      const layer = new Konva.Layer();
      stage.add(layer);

      const S = 56, HT = S * Math.sqrt(3) / 2;
      const hexPts = [S, 0, S / 2, HT, -S / 2, HT, -S, 0, -S / 2, -HT, S / 2, -HT];
      const trapPts = [-S, 0, S, 0, S / 2, HT, -S / 2, HT];
      const col = accent();

      function makePiece(points, x, y, fill, draggable) {
        const piece = new Konva.Line({
          points, closed: true, x, y,
          fill, stroke: col, strokeWidth: 2.5, lineJoin: 'round',
          draggable, shadowColor: 'black', shadowOpacity: 0, shadowBlur: 8,
        });
        if (draggable) {
          piece.on('mouseenter', () => stage.container().style.cursor = 'grab');
          piece.on('mouseleave', () => stage.container().style.cursor = 'default');
          piece.on('dragstart', () => { piece.shadowOpacity(0.25); piece.scale({ x: 1.06, y: 1.06 }); });
          piece.on('dragend', () => {
            piece.shadowOpacity(0); piece.scale({ x: 1, y: 1 });
            trySnap(piece);
          });
          piece.on('dblclick dbltap', () => { piece.rotation(piece.rotation() + 60); layer.batchDraw(); });
        }
        layer.add(piece);
        return piece;
      }

      const hex = makePiece(hexPts, W * 0.32, H * 0.5, getComputedStyle(document.body).getPropertyValue('--mcs-accent-soft').trim() || '#fef3c7', false);
      const t1 = makePiece(trapPts, W * 0.72, H * 0.28, '#ffffff', true);
      const t2 = makePiece(trapPts, W * 0.72, H * 0.72, '#ffffff', true);
      window._spikePieces = { hex, t1, t2 };

      function worldEdges(piece) {
        const tr = piece.getAbsoluteTransform();
        const pts = piece.points();
        const v = [];
        for (let i = 0; i < pts.length; i += 2) v.push(tr.point({ x: pts[i], y: pts[i + 1] }));
        const edges = [];
        for (let i = 0; i < v.length; i++) {
          const a = v[i], b = v[(i + 1) % v.length];
          edges.push({
            mid: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
            len: Math.hypot(b.x - a.x, b.y - a.y),
            ang: Math.atan2(b.y - a.y, b.x - a.x),
          });
        }
        return edges;
      }

      function trySnap(piece) {
        const TOL_DIST = 22, TOL_LEN = 3, TOL_ANG = 0.22; // ~12.6 degrees
        const mine = worldEdges(piece);
        let best = null;
        layer.getChildren().forEach((other) => {
          if (other === piece) return;
          worldEdges(other).forEach((eo) => {
            mine.forEach((em) => {
              if (Math.abs(em.len - eo.len) > TOL_LEN) return;
              let d = Math.abs(em.ang - eo.ang) % Math.PI;
              if (d > Math.PI / 2) d = Math.PI - d;
              if (d > TOL_ANG) return;
              const dist = Math.hypot(em.mid.x - eo.mid.x, em.mid.y - eo.mid.y);
              if (dist < TOL_DIST && (!best || dist < best.dist)) {
                best = { dist, dx: eo.mid.x - em.mid.x, dy: eo.mid.y - em.mid.y };
              }
            });
          });
        });
        if (best) {
          new Konva.Tween({
            node: piece, duration: 0.12, easing: Konva.Easings.EaseOut,
            x: piece.x() + best.dx, y: piece.y() + best.dy,
          }).play();
          snapHappened = true;
          setStatus('snap', 'pass', 'Edge snap fired (gap was ' + best.dist.toFixed(1) + 'px, tweened shut). Konva stage + drag + hit detection all OK.');
        }
      }
      window._spikeTrySnap = trySnap; // automation hook

      if (!snapHappened) {
        setStatus('snap', 'warn', 'Stage rendered. MANUAL STEP: drag a trapezium against the hexagon until it snaps.');
      }
    } catch (e) {
      setStatus('snap', 'fail', String(e));
    }
  }

  // ---------- 0.4: MathLive offline fonts ----------
  function buildMathLive() {
    try {
      const MFE = (window.MathLive && MathLive.MathfieldElement) || window.MathfieldElement;
      // SPIKE FINDING: MathLive's dynamic font/sound loaders use fetch(), which
      // Chromium blocks on file://. Disable them and load fonts statically via
      // mathlive-fonts.css (linked in the page <head>) instead.
      MFE.fontsDirectory = null;
      MFE.soundsDirectory = null;

      const mf = new MFE();
      mf.value = '3\\frac{3}{4} + \\sqrt{x^2} = ?';
      document.getElementById('ml-holder').appendChild(mf);

      document.fonts.ready.then(() => {
        const katex = [...document.fonts].filter((f) => /KaTeX/i.test(f.family));
        const loaded = katex.filter((f) => f.status === 'loaded');
        const ok = loaded.length > 0;
        const val = mf.getValue('latex');
        setStatus('ml', ok ? 'pass' : 'warn', [
          'KaTeX font faces seen   : ' + katex.length,
          'KaTeX font faces loaded : ' + loaded.length + (ok ? '' : '  (fonts may still be lazy-loading — check glyphs visually)'),
          'field.getValue("latex") : ' + val,
        ].join('\n'));
      });
    } catch (e) {
      setStatus('ml', 'fail', String(e));
    }
  }

  // ---------- 0.3: memory lifecycle ----------
  function wireMemoryTest() {
    setStatus('mem', 'warn', 'Not run yet — click the button.');
    document.getElementById('btn-mem').addEventListener('click', runMemoryTest);
  }

  async function runMemoryTest() {
    const holder = document.getElementById('mem-holder');
    setStatus('mem', 'warn', 'Running…');
    await new Promise((r) => setTimeout(r, 50));

    const N = 200;
    const baseBoards = Object.keys(JXG.boards).length;
    const baseStages = Konva.stages.length;
    const baseNodes = document.getElementsByTagName('*').length;
    const heap0 = performance.memory ? performance.memory.usedJSHeapSize : null;
    const t0 = performance.now();

    try {
      for (let i = 0; i < N; i++) {
        const bd = document.createElement('div');
        bd.id = '_memb';
        bd.style.cssText = 'width:300px;height:200px;';
        holder.appendChild(bd);
        const b = JXG.JSXGraph.initBoard('_memb', {
          boundingbox: [-5, 5, 5, -5], axis: true, showCopyright: false, showNavigation: false,
        });
        const p1 = b.create('point', [1, 2], { snapToGrid: true });
        const p2 = b.create('point', [-2, -1]);
        b.create('segment', [p1, p2]);
        b.create('functiongraph', [(x) => Math.sin(x)]);

        const kd = document.createElement('div');
        holder.appendChild(kd);
        const st = new Konva.Stage({ container: kd, width: 300, height: 200 });
        const ly = new Konva.Layer();
        st.add(ly);
        ly.add(new Konva.Circle({ x: 60, y: 60, radius: 25, fill: '#0052ff', draggable: true }));
        ly.add(new Konva.Line({ points: [0, 0, 50, 50, 100, 0], closed: true, fill: '#d1fae5' }));
        ly.draw();

        JXG.JSXGraph.freeBoard(b);
        st.destroy();
        bd.remove();
        kd.remove();

        if (i % 25 === 0) await new Promise((r) => requestAnimationFrame(r));
      }
    } catch (e) {
      setStatus('mem', 'fail', 'Crashed at cycle: ' + String(e));
      return;
    }

    const ms = performance.now() - t0;
    const endBoards = Object.keys(JXG.boards).length;
    const endStages = Konva.stages.length;
    const endNodes = document.getElementsByTagName('*').length;
    const heap1 = performance.memory ? performance.memory.usedJSHeapSize : null;

    const regClean = endBoards === baseBoards && endStages === baseStages && endNodes <= baseNodes + 5;
    const heapLine = heap0 !== null
      ? 'JS heap delta        : ' + ((heap1 - heap0) / 1048576).toFixed(1) + ' MB (informational; GC may not have run)'
      : 'JS heap delta        : n/a (performance.memory not exposed in this browser)';

    setStatus('mem', regClean ? 'pass' : 'fail', [
      'cycles               : ' + N + ' boards + ' + N + ' stages in ' + ms.toFixed(0) + ' ms (' + (ms / N).toFixed(1) + ' ms/cycle)',
      'JXG.boards registry  : ' + baseBoards + ' -> ' + endBoards + (endBoards === baseBoards ? '  OK' : '  LEAK'),
      'Konva.stages registry: ' + baseStages + ' -> ' + endStages + (endStages === baseStages ? '  OK' : '  LEAK'),
      'DOM node count       : ' + baseNodes + ' -> ' + endNodes + (endNodes <= baseNodes + 5 ? '  OK' : '  LEAK'),
      heapLine,
    ].join('\n'));
  }

  // ---------- 0.6: theming bridge ----------
  function wireThemes() {
    document.querySelectorAll('button[data-theme]').forEach((btn) => {
      btn.addEventListener('click', () => applyTheme(btn.dataset.theme));
    });
    applyTheme('theme-amber'); // spike spec 0.6: verify on an amber page first
  }

  function applyTheme(cls) {
    document.body.className = cls;
    const token = accent();
    // Rebuild both surfaces so they re-read the token (same mechanism mcs-core will use).
    snapHappened = snapHappened; // snap status persists across rebuilds
    buildJxg();
    buildKonva();
    // Programmatic verification: the live JSXGraph point's stroke must equal the CSS token.
    const applied = (window._spikeBoardPoint.visProp.strokecolor || '').toLowerCase();
    const ok = applied === token.toLowerCase();
    setStatus('theme', ok ? 'pass' : 'fail', [
      'body class           : "' + cls + '"',
      'CSS --mcs-accent     : ' + token,
      'JSXGraph point stroke: ' + applied + (ok ? '   (matches token)' : '   (MISMATCH)'),
      'Konva pieces stroke  : ' + window._spikePieces.t1.stroke(),
    ].join('\n'));
  }
})();
