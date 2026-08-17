/**
 * Canvas Engine - High DPI Canvas, Smooth Bezier Drawing, Straight Line Tool, Eraser, and Undo/Redo
 */

class DrawingCanvas {
  constructor(drawCanvasId, gridCanvasId) {
    this.drawCanvas = document.getElementById(drawCanvasId);
    this.gridCanvas = document.getElementById(gridCanvasId);
    this.ctx = this.drawCanvas.getContext('2d');
    this.gridCtx = this.gridCanvas.getContext('2d');

    // Drawing State
    this.activeTool = 'pen'; // 'select', 'pen', 'line', 'eraser'
    this.currentColor = '#1e293b';
    this.strokeWidth = 3;
    this.gridMode = 'dots'; // 'none', 'dots', 'graph'
    this.isDrawing = false;
    
    // Line / Shape Draft State
    this.startPoint = { x: 0, y: 0 };
    this.currentPoint = { x: 0, y: 0 };
    this.currentPath = [];

    // History (Undo / Redo Stack)
    this.historyStack = [];
    this.redoStack = [];
    this.maxHistory = 30;

    // Callbacks
    this.onHistoryChange = null;

    this.init();
  }

  init() {
    this.resizeCanvas();
    window.addEventListener('resize', () => this.handleResize());

    // Pointer Event Listeners
    this.drawCanvas.addEventListener('pointerdown', (e) => this.onPointerDown(e));
    this.drawCanvas.addEventListener('pointermove', (e) => this.onPointerMove(e));
    this.drawCanvas.addEventListener('pointerup', (e) => this.onPointerUp(e));
    this.drawCanvas.addEventListener('pointercancel', (e) => this.onPointerUp(e));

    // Save Initial Blank State
    this.saveState();
    this.drawGrid();
  }

  handleResize() {
    // Preserve current drawing data during canvas resize
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = this.drawCanvas.width;
    tempCanvas.height = this.drawCanvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(this.drawCanvas, 0, 0);

    this.resizeCanvas();

    // Restore drawing image
    this.ctx.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height, 0, 0, this.drawCanvas.width, this.drawCanvas.height);
    this.drawGrid();
  }

  resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Set display size
    this.drawCanvas.style.width = width + 'px';
    this.drawCanvas.style.height = height + 'px';
    this.gridCanvas.style.width = width + 'px';
    this.gridCanvas.style.height = height + 'px';

    // Set backing store size for sharp high-DPI rendering
    this.drawCanvas.width = Math.floor(width * dpr);
    this.drawCanvas.height = Math.floor(height * dpr);
    this.gridCanvas.width = Math.floor(width * dpr);
    this.gridCanvas.height = Math.floor(height * dpr);

    // Scale contexts
    this.ctx.scale(dpr, dpr);
    this.gridCtx.scale(dpr, dpr);

    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
  }

  getPointerPos(e) {
    const rect = this.drawCanvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  setTool(tool) {
    this.activeTool = tool;
  }

  setColor(color) {
    this.currentColor = color;
  }

  setStrokeWidth(width) {
    this.strokeWidth = width;
  }

  setGridMode(mode) {
    this.gridMode = mode;
    this.drawGrid();
  }

  cycleGridMode() {
    const modes = ['dots', 'graph', 'none'];
    const currentIndex = modes.indexOf(this.gridMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    this.setGridMode(nextMode);
    return nextMode;
  }

  drawGrid() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.gridCtx.clearRect(0, 0, w, h);

    if (this.gridMode === 'none') return;

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    if (this.gridMode === 'dots') {
      const spacing = 30;
      this.gridCtx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)';
      for (let x = spacing; x < w; x += spacing) {
        for (let y = spacing; y < h; y += spacing) {
          this.gridCtx.beginPath();
          this.gridCtx.arc(x, y, 1.2, 0, Math.PI * 2);
          this.gridCtx.fill();
        }
      }
    } else if (this.gridMode === 'graph') {
      const smallGrid = 15;
      const mainGrid = 60;

      // Small Grid Lines
      this.gridCtx.beginPath();
      this.gridCtx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
      this.gridCtx.lineWidth = 1;

      for (let x = smallGrid; x < w; x += smallGrid) {
        this.gridCtx.moveTo(x, 0);
        this.gridCtx.lineTo(x, h);
      }
      for (let y = smallGrid; y < h; y += smallGrid) {
        this.gridCtx.moveTo(0, y);
        this.gridCtx.lineTo(w, y);
      }
      this.gridCtx.stroke();

      // Main Grid Lines
      this.gridCtx.beginPath();
      this.gridCtx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)';
      this.gridCtx.lineWidth = 1.5;

      for (let x = mainGrid; x < w; x += mainGrid) {
        this.gridCtx.moveTo(x, 0);
        this.gridCtx.lineTo(x, h);
      }
      for (let y = mainGrid; y < h; y += mainGrid) {
        this.gridCtx.moveTo(0, y);
        this.gridCtx.lineTo(w, y);
      }
      this.gridCtx.stroke();
    }
  }

  // --- Pointer Handlers ---

  onPointerDown(e) {
    if (this.activeTool === 'select') return;
    
    this.isDrawing = true;
    this.startPoint = this.getPointerPos(e);
    this.currentPoint = { ...this.startPoint };
    this.currentPath = [this.startPoint];

    if (this.activeTool === 'pen') {
      this.ctx.beginPath();
      this.ctx.strokeStyle = this.currentColor;
      this.ctx.lineWidth = this.strokeWidth;
      this.ctx.globalCompositeOperation = 'source-over';
      this.ctx.moveTo(this.startPoint.x, this.startPoint.y);
    } else if (this.activeTool === 'eraser') {
      this.eraseAt(this.startPoint);
    } else if (this.activeTool === 'line') {
      // Save snapshot to restore while dragging live preview line
      this.linePreviewSnapshot = this.ctx.getImageData(0, 0, this.drawCanvas.width, this.drawCanvas.height);
    }
  }

  onPointerMove(e) {
    if (!this.isDrawing) return;
    const pos = this.getPointerPos(e);

    if (this.activeTool === 'pen') {
      this.currentPath.push(pos);
      
      // Draw smooth quadratic curve segment
      if (this.currentPath.length > 2) {
        const len = this.currentPath.length;
        const xc = (this.currentPath[len - 1].x + this.currentPath[len - 2].x) / 2;
        const yc = (this.currentPath[len - 1].y + this.currentPath[len - 2].y) / 2;
        this.ctx.quadraticCurveTo(this.currentPath[len - 2].x, this.currentPath[len - 2].y, xc, yc);
        this.ctx.stroke();
      }
    } else if (this.activeTool === 'eraser') {
      this.eraseAt(pos);
    } else if (this.activeTool === 'line') {
      this.currentPoint = pos;
      // Restore pre-line image snapshot
      if (this.linePreviewSnapshot) {
        this.ctx.putImageData(this.linePreviewSnapshot, 0, 0);
      }
      // Draw live preview straight line
      this.ctx.beginPath();
      this.ctx.strokeStyle = this.currentColor;
      this.ctx.lineWidth = this.strokeWidth;
      this.ctx.globalCompositeOperation = 'source-over';
      this.ctx.moveTo(this.startPoint.x, this.startPoint.y);
      this.ctx.lineTo(pos.x, pos.y);
      this.ctx.stroke();
    }
  }

  onPointerUp(e) {
    if (!this.isDrawing) return;
    this.isDrawing = false;

    if (this.activeTool === 'pen') {
      this.ctx.closePath();
    } else if (this.activeTool === 'line') {
      this.linePreviewSnapshot = null;
    }

    this.saveState();
  }

  eraseAt(pos) {
    this.ctx.save();
    this.ctx.globalCompositeOperation = 'destination-out';
    this.ctx.beginPath();
    const radius = Math.max(12, this.strokeWidth * 3);
    this.ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  }

  // --- History & Undo / Redo ---

  saveState() {
    // Save current canvas state to history stack
    const imageData = this.ctx.getImageData(0, 0, this.drawCanvas.width, this.drawCanvas.height);
    this.historyStack.push(imageData);

    if (this.historyStack.length > this.maxHistory) {
      this.historyStack.shift(); // Limit stack size
    }

    // Clear redo stack on new action
    this.redoStack = [];
    this.notifyHistoryChange();
  }

  undo() {
    if (this.historyStack.length <= 1) return; // Keep initial blank state
    const current = this.historyStack.pop();
    this.redoStack.push(current);

    const previous = this.historyStack[this.historyStack.length - 1];
    this.ctx.putImageData(previous, 0, 0);
    this.notifyHistoryChange();
  }

  redo() {
    if (this.redoStack.length === 0) return;
    const state = this.redoStack.pop();
    this.historyStack.push(state);

    this.ctx.putImageData(state, 0, 0);
    this.notifyHistoryChange();
  }

  clear() {
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    this.saveState();
  }

  notifyHistoryChange() {
    if (typeof this.onHistoryChange === 'function') {
      this.onHistoryChange({
        canUndo: this.historyStack.length > 1,
        canRedo: this.redoStack.length > 0
      });
    }
  }
}
