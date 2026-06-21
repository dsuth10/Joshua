/**
 * MCS Scratch Pad — student notes + drawing available across all pages.
 * Inserts a trigger beside #btn-prac-submit when present; otherwise uses a floating control.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'mcs-scratch-pad-v1';
  var PEN_WIDTH = 2.5;
  var ERASER_WIDTH = 28;
  var STAMP_RADIUS = 14;

  var state = {
    open: false,
    mode: 'pen',
    drawing: false,
    lastX: 0,
    lastY: 0,
    canvas: null,
    ctx: null,
    notesEl: null,
    backdrop: null,
    triggerBtn: null,
    saveTimer: null,
  };

  function loadSaved() {
    try {
      var raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : { notes: '', drawing: '' };
    } catch (e) {
      return { notes: '', drawing: '' };
    }
  }

  function scheduleSave() {
    if (state.saveTimer) clearTimeout(state.saveTimer);
    state.saveTimer = setTimeout(saveNow, 300);
  }

  function saveNow() {
    if (!state.canvas || !state.notesEl) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
        notes: state.notesEl.value,
        drawing: state.canvas.toDataURL('image/png'),
      }));
    } catch (e) {
      /* quota or privacy mode — ignore */
    }
  }

  function restoreSaved() {
    var saved = loadSaved();
    if (state.notesEl) state.notesEl.value = saved.notes || '';
    if (saved.drawing && state.ctx) {
      var img = new Image();
      img.onload = function () {
        state.ctx.clearRect(0, 0, state.canvas.width, state.canvas.height);
        state.ctx.drawImage(img, 0, 0, state.canvas.width, state.canvas.height);
      };
      img.src = saved.drawing;
    }
  }

  function canvasPoint(evt) {
    var rect = state.canvas.getBoundingClientRect();
    var scaleX = state.canvas.width / rect.width;
    var scaleY = state.canvas.height / rect.height;
    return {
      x: (evt.clientX - rect.left) * scaleX,
      y: (evt.clientY - rect.top) * scaleY,
    };
  }

  function beginStroke(x, y) {
    state.drawing = true;
    state.lastX = x;
    state.lastY = y;
    if (state.mode === 'stamp') {
      drawStamp(x, y);
      state.drawing = false;
      scheduleSave();
    }
  }

  function drawStamp(x, y) {
    var ctx = state.ctx;
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.beginPath();
    ctx.arc(x, y, STAMP_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#0052ff';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
    ctx.restore();
  }

  function continueStroke(x, y) {
    if (!state.drawing || state.mode === 'stamp') return;
    var ctx = state.ctx;
    ctx.beginPath();
    ctx.moveTo(state.lastX, state.lastY);
    ctx.lineTo(x, y);
    if (state.mode === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = ERASER_WIDTH;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = 'rgba(0,0,0,1)';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.lineWidth = PEN_WIDTH;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--on-surface').trim() || '#1a1c1e';
    }
    ctx.stroke();
    ctx.closePath();
    state.lastX = x;
    state.lastY = y;
  }

  function endStroke() {
    if (!state.drawing) return;
    state.drawing = false;
    scheduleSave();
  }

  function onPointerDown(evt) {
    if (evt.button !== undefined && evt.button !== 0) return;
    state.canvas.setPointerCapture(evt.pointerId);
    var pt = canvasPoint(evt);
    beginStroke(pt.x, pt.y);
    evt.preventDefault();
  }

  function onPointerMove(evt) {
    if (!state.drawing) return;
    var pt = canvasPoint(evt);
    continueStroke(pt.x, pt.y);
    evt.preventDefault();
  }

  function onPointerUp(evt) {
    endStroke();
    try { state.canvas.releasePointerCapture(evt.pointerId); } catch (e) { /* ignore */ }
  }

  function resizeCanvas() {
    if (!state.canvas || !state.ctx) return;
    var wrap = state.canvas.parentElement;
    var rect = wrap.getBoundingClientRect();
    var dpr = window.devicePixelRatio || 1;
    var w = Math.max(320, Math.floor(rect.width * dpr));
    var h = Math.max(240, Math.floor(rect.height * dpr));
    var snapshot = state.canvas.toDataURL('image/png');
    state.canvas.width = w;
    state.canvas.height = h;
    state.ctx = state.canvas.getContext('2d');
    state.ctx.lineCap = 'round';
    state.ctx.lineJoin = 'round';
    if (snapshot && snapshot !== 'data:,') {
      var img = new Image();
      img.onload = function () {
        state.ctx.drawImage(img, 0, 0, w, h);
      };
      img.src = snapshot;
    }
  }

  function setMode(mode) {
    state.mode = mode;
    if (!state.backdrop) return;
    state.backdrop.querySelectorAll('[data-scratch-tool]').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-scratch-tool') === mode);
    });
    if (state.canvas) {
      state.canvas.classList.toggle('mcs-scratch-canvas--stamp', mode === 'stamp');
    }
  }

  function clearCanvas() {
    if (!state.ctx || !state.canvas) return;
    state.ctx.clearRect(0, 0, state.canvas.width, state.canvas.height);
    scheduleSave();
  }

  function clearAll() {
    clearCanvas();
    if (state.notesEl) {
      state.notesEl.value = '';
      scheduleSave();
    }
  }

  function openPad() {
    state.open = true;
    state.backdrop.classList.add('active');
    state.backdrop.setAttribute('aria-hidden', 'false');
    if (state.triggerBtn) state.triggerBtn.setAttribute('aria-expanded', 'true');
    resizeCanvas();
    restoreSaved();
    var firstTool = state.backdrop.querySelector('[data-scratch-tool="pen"]');
    if (firstTool) firstTool.focus();
  }

  function closePad() {
    state.open = false;
    state.backdrop.classList.remove('active');
    state.backdrop.setAttribute('aria-hidden', 'true');
    if (state.triggerBtn) {
      state.triggerBtn.setAttribute('aria-expanded', 'false');
      state.triggerBtn.focus();
    }
    saveNow();
  }

  function togglePad() {
    if (state.open) closePad();
    else openPad();
  }

  function createOverlay() {
    var backdrop = document.createElement('div');
    backdrop.className = 'mcs-scratch-backdrop';
    backdrop.id = 'mcs-scratch-backdrop';
    backdrop.setAttribute('aria-hidden', 'true');
    backdrop.innerHTML =
      '<div class="mcs-scratch-window" role="dialog" aria-modal="true" aria-labelledby="mcs-scratch-title">' +
        '<div class="mcs-scratch-header">' +
          '<div>' +
            '<span class="mcs-scratch-kicker">STUDENT WORKSPACE</span>' +
            '<h2 id="mcs-scratch-title">Scratch Pad</h2>' +
          '</div>' +
          '<button type="button" class="mcs-scratch-close" id="btn-scratch-close" aria-label="Close scratch pad">✕</button>' +
        '</div>' +
        '<div class="mcs-scratch-body">' +
          '<label class="mcs-scratch-notes-label" for="mcs-scratch-notes">Write a note</label>' +
          '<textarea id="mcs-scratch-notes" class="mcs-scratch-notes" rows="3" placeholder="Jot down a message or working notes for your teacher or helper…"></textarea>' +
          '<div class="mcs-scratch-toolbar" role="toolbar" aria-label="Drawing tools">' +
            '<button type="button" class="mcs-scratch-tool active" data-scratch-tool="pen" aria-pressed="true" title="Draw">✏️ Pen</button>' +
            '<button type="button" class="mcs-scratch-tool" data-scratch-tool="eraser" aria-pressed="false" title="Erase">🧽 Eraser</button>' +
            '<button type="button" class="mcs-scratch-tool" data-scratch-tool="stamp" aria-pressed="false" title="Tap to stamp a circle counter">⭕ Circle</button>' +
            '<button type="button" class="mcs-scratch-tool mcs-scratch-tool--danger" data-scratch-action="clear" title="Clear drawing and notes">Clear all</button>' +
          '</div>' +
          '<div class="mcs-scratch-canvas-wrap">' +
            '<canvas id="mcs-scratch-canvas" class="mcs-scratch-canvas" aria-label="Drawing area"></canvas>' +
          '</div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(backdrop);

    state.backdrop = backdrop;
    state.notesEl = backdrop.querySelector('#mcs-scratch-notes');
    state.canvas = backdrop.querySelector('#mcs-scratch-canvas');
    state.ctx = state.canvas.getContext('2d');

    backdrop.querySelector('#btn-scratch-close').addEventListener('click', closePad);
    backdrop.addEventListener('click', function (evt) {
      if (evt.target === backdrop) closePad();
    });

    state.notesEl.addEventListener('input', scheduleSave);

    backdrop.querySelectorAll('[data-scratch-tool]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var mode = btn.getAttribute('data-scratch-tool');
        setMode(mode);
        backdrop.querySelectorAll('[data-scratch-tool]').forEach(function (b) {
          b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
        });
      });
    });

    backdrop.querySelector('[data-scratch-action="clear"]').addEventListener('click', function () {
      clearAll();
    });

    state.canvas.addEventListener('pointerdown', onPointerDown);
    state.canvas.addEventListener('pointermove', onPointerMove);
    state.canvas.addEventListener('pointerup', onPointerUp);
    state.canvas.addEventListener('pointercancel', onPointerUp);
    state.canvas.addEventListener('pointerleave', endStroke);

    document.addEventListener('keydown', function (evt) {
      if (evt.key === 'Escape' && state.open) closePad();
    });

    window.addEventListener('resize', function () {
      if (state.open) resizeCanvas();
    });
  }

  function createTriggerButton() {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn-terminal mcs-scratch-trigger';
    btn.id = 'btn-scratch-pad';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', 'mcs-scratch-backdrop');
    btn.title = 'Open scratch pad for notes and drawing';
    btn.textContent = 'SCRATCH PAD';
    if (document.body.classList.contains('band-a-layout')) {
      btn.classList.add('band-a-action-btn');
    }
    btn.addEventListener('click', togglePad);
    state.triggerBtn = btn;
    return btn;
  }

  function mountTriggerButton() {
    var submitBtn = document.getElementById('btn-prac-submit');
    var btn = createTriggerButton();

    if (submitBtn && submitBtn.parentElement) {
      submitBtn.parentElement.insertBefore(btn, submitBtn);
      return;
    }

    btn.classList.add('mcs-scratch-trigger--floating');
    document.body.appendChild(btn);
  }

  function init() {
    createOverlay();
    mountTriggerButton();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.MCS = window.MCS || {};
  window.MCS.ScratchPad = {
    open: openPad,
    close: closePad,
    toggle: togglePad,
    clear: clearAll,
  };
})();
