/**
 * Protractor Module - Dynamic SVG Protractor Generation, 2D Transforms, Pointer/Touch Gestures & Snapping
 */

class InteractiveProtractor {
  constructor(containerId, svgWrapId) {
    this.container = document.getElementById(containerId);
    this.svgWrap = document.getElementById(svgWrapId);
    this.angleBadge = document.getElementById('prot-angle-value');
    this.scaleBadge = document.getElementById('prot-scale-value');

    // Transform State
    this.posX = window.innerWidth / 2;
    this.posY = window.innerHeight / 2;
    this.rotation = 0; // degrees
    this.scale = 1.0;
    this.baseWidth = 500;
    this.baseHeight = 260;

    // Interaction Modes & Settings
    this.isSnapping = true;
    this.snapAngle = 5; // degrees
    this.isDragging = false;
    this.isRotating = false;
    this.isScaling = false;

    // Pointer tracking
    this.dragStart = { x: 0, y: 0 };
    this.initialTransform = { posX: 0, posY: 0, rotation: 0, scale: 1.0 };
    this.activeTouchDistance = null;

    this.init();
  }

  init() {
    this.renderSVG();
    this.updateTransform();
    this.bindEvents();
  }

  /**
   * Render SVG 180° Protractor with crisp dual scale numbers (0-180 and 180-0)
   */
  renderSVG() {
    const W = 500;
    const H = 260;
    const cx = 250;
    const cy = 240; // baseline y-coord
    const R_outer = 225;
    const R_inner = 135;

    let svg = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`;

    // 1. Semi-Circular Body Path
    // Path: start at baseline left (cx - R_outer, cy), arc around to right (cx + R_outer, cy), then straight line across baseline
    const bodyPath = `M ${cx - R_outer} ${cy} A ${R_outer} ${R_outer} 0 0 1 ${cx + R_outer} ${cy} Z`;
    svg += `<path d="${bodyPath}" class="prot-body-path" />`;

    // Inner cutout arc for transparency & baseline visibility
    const cutPath = `M ${cx - 70} ${cy} A 70 70 0 0 1 ${cx + 70} ${cy} Z`;
    svg += `<path d="${cutPath}" fill="none" stroke="var(--prot-stroke)" stroke-width="1.5" stroke-dasharray="3,3" />`;

    // 2. Degree Tick Marks & Numbers (0° to 180°)
    for (let deg = 0; deg <= 180; deg += 1) {
      const rad = (deg * Math.PI) / 180; // 0 deg is left (-X direction)
      const cos = -Math.cos(rad);
      const sin = -Math.sin(rad);

      let tickLen = 6;
      let isMajor = deg % 10 === 0;
      let isMedium = deg % 5 === 0 && !isMajor;

      if (isMajor) tickLen = 16;
      else if (isMedium) tickLen = 10;

      // Outer Ticks
      const x1 = cx + cos * R_outer;
      const y1 = cy + sin * R_outer;
      const x2 = cx + cos * (R_outer - tickLen);
      const y2 = cy + sin * (R_outer - tickLen);

      const strokeW = isMajor ? 2.2 : (isMedium ? 1.5 : 1.0);
      svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="prot-tick" stroke-width="${strokeW}" />`;

      // Draw Numbers every 10 degrees
      if (isMajor) {
        // Outer Scale Number (0 on Left to 180 on Right)
        const outerNum = deg;
        const R_outer_text = R_outer - 28;
        const txOuter = cx + cos * R_outer_text;
        const tyOuter = cy + sin * R_outer_text;

        svg += `<text x="${txOuter}" y="${tyOuter}" class="prot-text outer">${outerNum}</text>`;

        // Inner Scale Number (180 on Left to 0 on Right)
        const innerNum = 180 - deg;
        const R_inner_text = R_inner + 12;
        const txInner = cx + cos * R_inner_text;
        const tyInner = cy + sin * R_inner_text;

        svg += `<text x="${txInner}" y="${tyInner}" class="prot-text inner">${innerNum}</text>`;

        // Inner Scale Ticks
        const ix1 = cx + cos * R_inner;
        const iy1 = cy + sin * R_inner;
        const ix2 = cx + cos * (R_inner + 8);
        const iy2 = cy + sin * (R_inner + 8);
        svg += `<line x1="${ix1}" y1="${iy1}" x2="${ix2}" y2="${iy2}" class="prot-tick" stroke-width="1.2" />`;
      }
    }

    // 3. Baseline Ruler Markings (cm / mm along flat edge)
    const rulerY = cy;
    svg += `<line x1="${cx - R_outer}" y1="${rulerY}" x2="${cx + R_outer}" y2="${rulerY}" class="prot-baseline-line" />`;

    const mmSpacing = 4.5; // pixel width per mm
    const totalMM = Math.floor((R_outer * 2) / mmSpacing);
    const startX = cx - (totalMM * mmSpacing) / 2;

    for (let i = 0; i <= totalMM; i++) {
      const rx = startX + i * mmSpacing;
      let rLen = 4;
      if (i % 10 === 0) rLen = 12;
      else if (i % 5 === 0) rLen = 8;

      svg += `<line x1="${rx}" y1="${rulerY}" x2="${rx}" y2="${rulerY - rLen}" stroke="var(--prot-ticks)" stroke-width="${i % 10 === 0 ? 1.5 : 1}" />`;
    }

    // 4. Origin Crosshair & Center Circle
    svg += `<line x1="${cx - 15}" y1="${cy}" x2="${cx + 15}" y2="${cy}" stroke="var(--prot-origin)" stroke-width="2" />`;
    svg += `<line x1="${cx}" y1="${cy - 15}" x2="${cx}" y2="${cy + 5}" stroke="var(--prot-origin)" stroke-width="2" />`;
    svg += `<circle cx="${cx}" cy="${cy}" r="4" fill="none" stroke="var(--prot-origin)" stroke-width="2" />`;

    svg += `</svg>`;
    this.svgWrap.innerHTML = svg;
  }

  /**
   * Apply 2D Matrix / Transform CSS to Container
   */
  updateTransform() {
    this.container.style.transform = `translate(${this.posX - this.baseWidth / 2}px, ${this.posY - this.baseHeight + 20}px) rotate(${this.rotation}deg) scale(${this.scale})`;
    
    // Update Badge
    let normAngle = ((this.rotation % 360) + 360) % 360;
    this.angleBadge.textContent = `${normAngle.toFixed(1)}°`;
    this.scaleBadge.textContent = `${Math.round(this.scale * 100)}%`;
  }

  bindEvents() {
    // --- Move Dragging (Protractor Body / Origin) ---
    this.container.addEventListener('pointerdown', (e) => {
      // Ignore if clicking handles directly
      if (e.target.closest('.prot-handle')) return;
      
      this.isDragging = true;
      this.container.setPointerCapture(e.pointerId);
      this.dragStart = { x: e.clientX, y: e.clientY };
      this.initialTransform = { posX: this.posX, posY: this.posY };
      e.stopPropagation();
    });

    this.container.addEventListener('pointermove', (e) => {
      if (!this.isDragging) return;
      const dx = e.clientX - this.dragStart.x;
      const dy = e.clientY - this.dragStart.y;
      this.posX = this.initialTransform.posX + dx;
      this.posY = this.initialTransform.posY + dy;
      this.updateTransform();
    });

    const stopDrag = (e) => {
      if (this.isDragging) {
        this.isDragging = false;
        try { this.container.releasePointerCapture(e.pointerId); } catch(err){}
      }
    };
    this.container.addEventListener('pointerup', stopDrag);
    this.container.addEventListener('pointercancel', stopDrag);

    // --- Rotation Handle Dragging ---
    const rotateHandle = document.getElementById('prot-rotate-handle');
    rotateHandle.addEventListener('pointerdown', (e) => {
      this.isRotating = true;
      rotateHandle.setPointerCapture(e.pointerId);
      this.initialTransform.rotation = this.rotation;
      e.stopPropagation();
    });

    rotateHandle.addEventListener('pointermove', (e) => {
      if (!this.isRotating) return;
      
      // Calculate angle from origin center to pointer
      const dx = e.clientX - this.posX;
      const dy = e.clientY - this.posY;
      let angleRad = Math.atan2(dy, dx);
      let angleDeg = (angleRad * 180 / Math.PI) + 90; // offset for top handle

      if (this.isSnapping && this.snapAngle > 0) {
        angleDeg = Math.round(angleDeg / this.snapAngle) * this.snapAngle;
      }

      this.rotation = angleDeg;
      this.updateTransform();
    });

    const stopRotate = (e) => {
      if (this.isRotating) {
        this.isRotating = false;
        try { rotateHandle.releasePointerCapture(e.pointerId); } catch(err){}
      }
    };
    rotateHandle.addEventListener('pointerup', stopRotate);
    rotateHandle.addEventListener('pointercancel', stopRotate);

    // --- Mouse Wheel Rotation ---
    this.container.addEventListener('wheel', (e) => {
      e.preventDefault();
      let step = e.shiftKey ? 0.5 : (this.isSnapping ? this.snapAngle : 1);
      const delta = e.deltaY < 0 ? step : -step;
      this.rotation += delta;
      
      if (this.isSnapping && !e.shiftKey) {
        this.rotation = Math.round(this.rotation / this.snapAngle) * this.snapAngle;
      }
      this.updateTransform();
    }, { passive: false });

    // --- Corner Scale Handle Dragging ---
    const leftScaleHandle = document.getElementById('prot-scale-left');
    const rightScaleHandle = document.getElementById('prot-scale-right');

    const setupScaleHandle = (handle) => {
      handle.addEventListener('pointerdown', (e) => {
        this.isScaling = true;
        handle.setPointerCapture(e.pointerId);
        this.dragStart = { x: e.clientX, y: e.clientY };
        this.initialTransform.scale = this.scale;
        e.stopPropagation();
      });

      handle.addEventListener('pointermove', (e) => {
        if (!this.isScaling) return;
        const dx = e.clientX - this.dragStart.x;
        const dy = e.clientY - this.dragStart.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const sign = (dx * (handle.id.includes('right') ? 1 : -1) + dy) > 0 ? 1 : -1;
        
        let newScale = this.initialTransform.scale + (sign * dist * 0.005);
        this.scale = Math.max(0.4, Math.min(2.5, newScale));
        this.updateTransform();
      });

      const stopScale = (e) => {
        if (this.isScaling) {
          this.isScaling = false;
          try { handle.releasePointerCapture(e.pointerId); } catch(err){}
        }
      };
      handle.addEventListener('pointerup', stopScale);
      handle.addEventListener('pointercancel', stopScale);
    };

    setupScaleHandle(leftScaleHandle);
    setupScaleHandle(rightScaleHandle);

    // --- Multi-Touch Pinch Zoom ---
    this.container.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        this.activeTouchDistance = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        this.initialTransform.scale = this.scale;
      }
    });

    this.container.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2 && this.activeTouchDistance) {
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        const factor = dist / this.activeTouchDistance;
        this.scale = Math.max(0.4, Math.min(2.5, this.initialTransform.scale * factor));
        this.updateTransform();
      }
    });

    this.container.addEventListener('touchend', () => {
      this.activeTouchDistance = null;
    });
  }

  // --- Quick Actions ---

  resetPosition() {
    this.posX = window.innerWidth / 2;
    this.posY = window.innerHeight / 2 + 50;
    this.rotation = 0;
    this.scale = 1.0;
    this.updateTransform();
  }

  flip180() {
    this.rotation = (this.rotation + 180) % 360;
    this.updateTransform();
  }

  toggleSnapping() {
    this.isSnapping = !this.isSnapping;
    return this.isSnapping;
  }
}
