/**
 * App Controller - UI Wiring, Toolbar Handlers, Theme Switcher, Keyboard Hotkeys
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Canvas & Protractor Modules
  const canvasEngine = new DrawingCanvas('draw-canvas', 'grid-canvas');
  const protractorEngine = new InteractiveProtractor('protractor-container', 'protractor-svg-wrap');

  // Center protractor initially
  protractorEngine.resetPosition();

  // 2. DOM Elements
  const toolBtns = document.querySelectorAll('.tool-btn');
  const swatches = document.querySelectorAll('.swatch');
  const customColorPicker = document.getElementById('custom-color-picker');
  const strokeSlider = document.getElementById('stroke-width-slider');
  const strokeNumDisplay = document.getElementById('stroke-width-num');
  const strokePreview = document.getElementById('stroke-size-preview');

  const btnGridToggle = document.getElementById('btn-grid-toggle');
  const btnProtReset = document.getElementById('btn-prot-reset');
  const btnProtFlip = document.getElementById('btn-prot-flip');
  const btnSnapToggle = document.getElementById('btn-snap-toggle');

  const btnUndo = document.getElementById('btn-undo');
  const btnRedo = document.getElementById('btn-redo');
  const btnClear = document.getElementById('btn-clear');

  const btnThemeToggle = document.getElementById('btn-theme-toggle');
  const btnHelpToggle = document.getElementById('btn-help-toggle');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const helpModal = document.getElementById('help-modal');

  // --- Tool Switching ---
  const setActiveTool = (toolName) => {
    toolBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tool === toolName);
    });
    canvasEngine.setTool(toolName);
    document.body.className = `tool-${toolName}`;
  };

  toolBtns.forEach(btn => {
    btn.addEventListener('click', () => setActiveTool(btn.dataset.tool));
  });

  // --- Colour Selection ---
  const setActiveColor = (color) => {
    swatches.forEach(s => s.classList.toggle('active', s.dataset.color === color));
    customColorPicker.value = color;
    canvasEngine.setColor(color);
    strokePreview.style.backgroundColor = color;
  };

  swatches.forEach(s => {
    s.addEventListener('click', () => setActiveColor(s.dataset.color));
  });

  customColorPicker.addEventListener('input', (e) => {
    setActiveColor(e.target.value);
  });

  // --- Stroke Width ---
  strokeSlider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    canvasEngine.setStrokeWidth(val);
    strokeNumDisplay.textContent = `${val}px`;
    strokePreview.style.width = `${Math.min(val + 4, 18)}px`;
    strokePreview.style.height = `${Math.min(val + 4, 18)}px`;
  });

  // --- Grid Toggle ---
  btnGridToggle.addEventListener('click', () => {
    const mode = canvasEngine.cycleGridMode();
    btnGridToggle.title = `Grid Mode: ${mode.toUpperCase()} (Click to cycle)`;
  });

  // --- Protractor Controls ---
  btnProtReset.addEventListener('click', () => protractorEngine.resetPosition());
  btnProtFlip.addEventListener('click', () => protractorEngine.flip180());
  btnSnapToggle.addEventListener('click', () => {
    const isSnapping = protractorEngine.toggleSnapping();
    btnSnapToggle.classList.toggle('active', isSnapping);
  });

  // --- History (Undo / Redo / Clear) ---
  canvasEngine.onHistoryChange = ({ canUndo, canRedo }) => {
    btnUndo.disabled = !canUndo;
    btnRedo.disabled = !canRedo;
  };

  btnUndo.addEventListener('click', () => canvasEngine.undo());
  btnRedo.addEventListener('click', () => canvasEngine.redo());
  btnClear.addEventListener('click', () => {
    if (confirm('Clear entire drawing canvas?')) {
      canvasEngine.clear();
    }
  });

  // --- Theme Toggle ---
  btnThemeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    canvasEngine.drawGrid(); // Re-render grid lines for dark theme
  });

  // --- Help Modal ---
  const toggleModal = (show) => {
    helpModal.classList.toggle('hidden', !show);
  };
  btnHelpToggle.addEventListener('click', () => toggleModal(true));
  btnCloseModal.addEventListener('click', () => toggleModal(false));
  helpModal.addEventListener('click', (e) => {
    if (e.target === helpModal) toggleModal(false);
  });

  // --- Global Keyboard Shortcuts ---
  window.addEventListener('keydown', (e) => {
    // Ignore hotkeys when typing in input fields or modal open
    if (e.target.tagName === 'INPUT' || !helpModal.classList.contains('hidden')) return;

    if (e.ctrlKey || e.metaKey) {
      if (e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) canvasEngine.redo();
        else canvasEngine.undo();
      } else if (e.key.toLowerCase() === 'y') {
        e.preventDefault();
        canvasEngine.redo();
      }
      return;
    }

    switch (e.key.toLowerCase()) {
      case 'p':
        setActiveTool('pen');
        break;
      case 'l':
        setActiveTool('line');
        break;
      case 'e':
        setActiveTool('eraser');
        break;
      case 'v':
        setActiveTool('select');
        break;
      case 'c':
        if (confirm('Clear entire drawing canvas?')) {
          canvasEngine.clear();
        }
        break;
      case 'r':
        protractorEngine.flip180();
        break;
      case '?':
        toggleModal(true);
        break;
      case 'escape':
        toggleModal(false);
        break;
    }
  });
});
