/**
 * MCS Konva stage substrate — shared by analog-clock, pattern blocks, etc.
 * Phase 2.3: stage factory, drag helper, aria host.
 */
(function (MCS) {
  'use strict';

  if (typeof Konva === 'undefined') {
    return;
  }

  function usableWidth(el) {
    var node = el;
    while (node) {
      if (node.clientWidth > 0) return node.clientWidth;
      node = node.parentElement;
    }
    return 320;
  }

  function stageHost(container) {
    var host = container.querySelector('.mcs-konva-host');
    if (!host) {
      host = document.createElement('div');
      host.className = 'mcs-konva-host';
      host.style.width = '100%';
      host.style.position = 'relative';
      container.appendChild(host);
    }
    return host;
  }

  MCS.stage = {
    /**
     * @param {HTMLElement} container
     * @param {Object} opts
     * @param {number} [opts.size] — square stage dimension in px
     */
    make: function make(container, opts) {
      opts = opts || {};
      var host = stageHost(container);
      host.innerHTML = '';

      var size = opts.size || Math.min(Math.max(usableWidth(container), 180), 420);
      host.style.width = size + 'px';
      host.style.height = size + 'px';

      var stage = new Konva.Stage({
        container: host,
        width: size,
        height: size,
      });
      var bgLayer = new Konva.Layer();
      var objLayer = new Konva.Layer();
      stage.add(bgLayer);
      stage.add(objLayer);

      var activePointerId = null;

      function blockTouchScroll(e) {
        e.preventDefault();
      }

      if (stage.content) {
        stage.content.addEventListener('touchmove', blockTouchScroll, { passive: false });
      }

      var resizeHandle = MCS.observeResize(container, function () {
        var next = opts.size || Math.min(Math.max(usableWidth(container), 180), 420);
        host.style.width = next + 'px';
        host.style.height = next + 'px';
        stage.width(next);
        stage.height(next);
        if (typeof opts.onResize === 'function') {
          opts.onResize({ width: next, height: next });
        }
        stage.batchDraw();
      });

      return {
        stage: stage,
        host: host,
        bgLayer: bgLayer,
        objLayer: objLayer,
        size: size,
        centre: function centre() {
          return { x: stage.width() / 2, y: stage.height() / 2 };
        },
        guardMultiTouch: function guardMultiTouch() {
          stage.on('mousedown touchstart', function (evt) {
            if (activePointerId !== null && evt.evt && 'pointerId' in evt.evt) {
              if (evt.evt.pointerId !== activePointerId) {
                evt.cancelBubble = true;
              }
            } else if (activePointerId !== null) {
              evt.cancelBubble = true;
            } else {
              activePointerId = evt.evt && evt.evt.pointerId != null ? evt.evt.pointerId : 0;
            }
          });
          stage.on('mouseup touchend mouseleave', function () {
            activePointerId = null;
          });
        },
        destroy: function destroyStage() {
          if (resizeHandle) resizeHandle.disconnect();
          if (stage.content) {
            stage.content.removeEventListener('touchmove', blockTouchScroll);
          }
          stage.destroy();
          host.innerHTML = '';
        },
      };
    },

    /**
     * Attach drag behaviour with pickup scale, shadow, and snap-on-release.
     */
    draggable: function draggable(node, opts) {
      opts = opts || {};
      var pickupScale = opts.pickupScale != null ? opts.pickupScale : 1.1;
      var onSnap = opts.onSnap;
      var onChange = opts.onChange;
      var enabled = opts.enabled !== false;

      node.draggable(enabled);

      node.on('mouseenter', function () {
        if (enabled && node.getStage()) {
          node.getStage().container().style.cursor = 'grab';
        }
      });
      node.on('mouseleave', function () {
        if (node.getStage()) node.getStage().container().style.cursor = 'default';
      });
      node.on('dragstart', function () {
        if (!enabled) return;
        node.shadowOpacity(0.22);
        node.shadowBlur(8);
        node.scale({ x: pickupScale, y: pickupScale });
        MCS.audio.emit('pickup');
      });
      node.on('dragend', function () {
        if (!enabled) return;
        node.shadowOpacity(0);
        node.shadowBlur(0);
        node.scale({ x: 1, y: 1 });
        if (typeof onSnap === 'function') onSnap(node);
        if (typeof onChange === 'function') onChange();
        MCS.audio.emit('drop');
      });

      return {
        setEnabled: function setEnabled(on) {
          enabled = !!on;
          node.draggable(enabled);
        },
      };
    },

    ariaHost: function ariaHost(container) {
      var live = container.querySelector('.mcs-sr-live');
      if (!live) {
        live = document.createElement('div');
        live.className = 'mcs-sr-live';
        live.setAttribute('aria-live', 'polite');
        live.setAttribute('aria-atomic', 'true');
        container.insertBefore(live, container.firstChild);
      }
      return live;
    },

    destroy: function destroy(ctx) {
      if (ctx && typeof ctx.destroy === 'function') ctx.destroy();
    },
  };
})(window.MCS || {});
