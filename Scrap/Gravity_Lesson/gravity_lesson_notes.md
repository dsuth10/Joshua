# Gravity Lesson Construction - Developer Notes & Best Practices

This document compiles the detailed technical notes, problems solved, and architectural best practices discovered while constructing our first Year 7 Science interactive gravity lesson plan. These findings serve as our guide for future automated lesson generation.

---

## 🔍 Key Architectural Discoveries

### 1. Script Isolation via IIFEs (Scope Collision Prevention)
*   **The Problem**: When compilation embeds multiple slides into a single HTML file (`Lesson_Gravity_Presentation.html`), any inline `<script>` tags are loaded into the global page scope. If multiple slides define variables like `const canvas`, `const ctx`, `let g`, or `function draw()`, the browser throws a syntax error due to identifier redeclaration.
*   **The Solution**: We wrapped every slide's simulation logic in an **Immediately Invoked Function Expression (IIFE)**:
    ```javascript
    (function() {
      // All slide-specific variables remain isolated here
      const canvas = document.getElementById('gravitySimCanvas');
      ...
    })();
    ```
*   **Best Practice**: Every custom slide interactive MUST use a unique ID for all DOM elements and run its script within an isolated IIFE.

### 2. Draw Mode vs. Interactive Widgets (Pointer Event Layering)
*   **The Problem**: The presentation's built-in drawing overlay canvas sits on top of all slide content. If it captures mouse/touch inputs constantly, teachers cannot click select boxes, sliders, or buttons inside our simulations (like the "Drop" or "Reset" buttons in the gravity simulator).
*   **The Solution**: The master template uses `pointer-events: none` on the drawing canvas wrapper, which passes clicks straight through to the simulation buttons underneath. When the teacher activates **Pen** or **Highlighter** mode, the system toggles `pointer-events: auto` on the canvas.
*   **Best Practice**: This creates a clean modal interface. Teachers use **Cursor Mode** to interact with simulations, and switch to **Pen/Highlighter** to draw annotations directly over their simulated results.

### 3. Dual Pathway Differentiated Rendering (Standard vs. Lucas Support)
*   **The Problem**: The Lucas support pathway features a simplified interface and simulation structure. If both standard and support components are rendered on the same slide, how do we prevent script execution conflicts?
*   **The Solution**: We implemented two independent simulator wrappers (`gravitySimCanvas` and `gravitySimCanvasL`) each running their own isolated IIFE loop. The system toggles the `lucas-active` class on the `<body>` element. CSS takes care of the rest by hiding and showing the correct simulation:
    ```css
    .lucas-only { display: none; }
    body.lucas-active .lucas-only { display: block !important; }
    body.lucas-active .standard-only { display: none !important; }
    ```
*   **Best Practice**: Keep standard and support canvas IDs completely distinct. The browser continues to run both render loops in the background, but CSS handles display swapping seamlessly without resetting simulation states.

---

## 🚀 Physics & Simulator Engine Best Practices

*   **No External Dependencies**: To keep presentations completely offline-capable and lightweight, avoid loading heavy JavaScript physics engines (like Matter.js or p5.js).
*   **Euler Integration**: A simple 15-line Euler loop inside standard HTML5 Canvas is extremely fast and robust for classroom demonstrations:
    ```javascript
    const forceGravity = obj.mass * g;
    const forceDrag = hasAir ? obj.drag * obj.v : 0;
    const forceNet = forceGravity - forceDrag;
    const acceleration = forceNet / obj.mass;
    
    obj.v += acceleration * dt;
    obj.y += obj.v * scale * dt;
    ```
*   **Delta-Time Slicing**: Always calculate frame offsets (`dt = (timestamp - lastTime) / 1000`) and cap large values (e.g. `if (dt > 0.1) dt = 0.1`) to ensure smooth, physics-accurate transitions even on older classroom computers or smartboards.

---

## 📈 Plan for Iterating Over Lesson Creation Skills

Moving forward, when implementing or enhancing lesson-creation tools, we should adopt these standards:
1.  **Template Separation**: Keep static content markup clean and inject interactive simulator modules dynamically using standard placeholder tags.
2.  **Aussie English Strictness**: All text displays and simulations must explicitly use Australian spelling (e.g. `metres` instead of `meters`, `colour` instead of `color`).
3.  **Automatic IIFE Injection**: When our skills compile slide decks containing custom scripts, they should automatically wrap script blocks in unique IIFEs to protect the master namespace.
