/**
 * MCS Widget Engine — core namespace, registry, theming, audio bridge,
 * ResizeObserver plumbing, and tween helper.
 * Phase 1: engine skeleton (no library-backed widgets yet).
 */
(function (MCS) {
  'use strict';

  window.MCS = MCS;

  // ---------------------------------------------------------------------------
  // Widget registry & lifecycle
  // ---------------------------------------------------------------------------
  var factories = Object.create(null);
  var liveByContainer = new WeakMap();

  MCS.register = function register(type, factoryFn) {
    if (!type || typeof factoryFn !== 'function') {
      throw new Error('MCS.register requires (type, factoryFn)');
    }
    factories[type] = factoryFn;
  };

  MCS.create = function create(type, container, config) {
    if (!container || !container.nodeType) {
      throw new Error('MCS.create requires a DOM container element');
    }
    if (liveByContainer.has(container)) {
      throw new Error(
        'MCS.create: container still owns a live widget — call destroy() first'
      );
    }
    var factory = factories[type];
    if (!factory) {
      throw new Error('MCS.create: unknown widget type "' + type + '"');
    }
    config = config || {};
    var instance = factory(container, config);
    if (!instance || typeof instance.destroy !== 'function') {
      throw new Error('MCS.create: widget "' + type + '" must return an object with destroy()');
    }
    liveByContainer.set(container, instance);
    return instance;
  };

  MCS._releaseContainer = function _releaseContainer(container) {
    liveByContainer.delete(container);
  };

  MCS._hasLiveWidget = function _hasLiveWidget(container) {
    return liveByContainer.has(container);
  };

  // ---------------------------------------------------------------------------
  // Age-band tokens (doc 06 §2)
  // ---------------------------------------------------------------------------
  var BAND_TOKENS = {
    A: {
      minTouchTarget: 64,
      objectSize: 56,
      maxObjects: 12,
      textMode: 'numerals-icons',
      fontSizeMin: 24,
      snapRadius: 0.5,
    },
    B: {
      minTouchTarget: 48,
      objectSize: 40,
      maxObjects: 25,
      textMode: 'short-labels',
      fontSizeMin: 18,
      snapRadius: 0.35,
    },
    C: {
      minTouchTarget: 40,
      objectSize: 28,
      maxObjects: 50,
      textMode: 'full-labels',
      fontSizeMin: 14,
      snapRadius: 0.25,
    },
  };

  MCS.band = function band(bandId) {
    return BAND_TOKENS[bandId] || BAND_TOKENS.C;
  };

  // ---------------------------------------------------------------------------
  // Theme reader — CSS custom properties → widget factories (doc 02 §5)
  // ---------------------------------------------------------------------------
  var cachedTheme = null;

  function readCssVar(name, fallback) {
    var val = getComputedStyle(document.body).getPropertyValue(name).trim();
    return val || fallback;
  }

  MCS.theme = function theme(forceRefresh) {
    if (!forceRefresh && cachedTheme) {
      return cachedTheme;
    }
    cachedTheme = {
      accent: readCssVar('--mcs-accent', '#0052ff'),
      accentSoft: readCssVar('--mcs-accent-soft', '#dfe3ff'),
      ink: readCssVar('--mcs-ink', '#1a1c1e'),
      gridLine: readCssVar('--mcs-grid-line', '#c3c5d9'),
      correct: readCssVar('--mcs-correct', '#059669'),
      error: readCssVar('--mcs-error', '#ba1a1a'),
      focusRing: readCssVar('--mcs-focus-ring', readCssVar('--mcs-accent', '#0052ff')),
      fontDisplay: readCssVar('--mcs-font-display', "'Space Grotesk', sans-serif"),
      fontBody: readCssVar('--mcs-font-body', "'Work Sans', sans-serif"),
      fontMono: readCssVar('--mcs-font-mono', "'JetBrains Mono', monospace"),
    };
    return cachedTheme;
  };

  MCS.invalidateTheme = function invalidateTheme() {
    cachedTheme = null;
  };

  // ---------------------------------------------------------------------------
  // Audio bridge (doc 02 §6)
  // ---------------------------------------------------------------------------
  var DEFAULT_SOUND_MAP = {
    snap: [620, 0.05, 'square', 0.035],
    pickup: [520, 0.03, 'square', 0.03],
    drop: [420, 0.04, 'square', 0.03],
    tick: [740, 0.02, 'sine', 0.025],
  };

  MCS.audio = {
    _playFn: null,
    _soundMap: DEFAULT_SOUND_MAP,

    register: function register(playSoundFn, soundMap) {
      MCS.audio._playFn = playSoundFn;
      if (soundMap) {
        MCS.audio._soundMap = Object.assign({}, DEFAULT_SOUND_MAP, soundMap);
      }
    },

    emit: function emit(eventName) {
      var playFn = MCS.audio._playFn;
      if (!playFn) return;
      var preset = MCS.audio._soundMap[eventName];
      if (!preset) return;
      playFn(preset[0], preset[1], preset[2], preset[3]);
    },
  };

  // ---------------------------------------------------------------------------
  // ResizeObserver plumbing (doc 02 §3 lifecycle rule 2)
  // ---------------------------------------------------------------------------
  MCS.observeResize = function observeResize(container, callback) {
    if (!container || typeof callback !== 'function') {
      return { disconnect: function () {} };
    }

    function notify() {
      callback({
        width: container.clientWidth,
        height: container.clientHeight,
      });
    }

    notify();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', notify);
      return {
        disconnect: function () {
          window.removeEventListener('resize', notify);
        },
      };
    }

    var ro = new ResizeObserver(function () {
      notify();
    });
    ro.observe(container);
    return {
      disconnect: function () {
        ro.disconnect();
      },
    };
  };

  // ---------------------------------------------------------------------------
  // Tween helper — honours prefers-reduced-motion (doc 06 §7)
  // ---------------------------------------------------------------------------
  MCS.prefersReducedMotion = function prefersReducedMotion() {
    return (
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  };

  /**
   * @param {Object} opts
   * @param {number} opts.duration — seconds
   * @param {function(number):void} opts.onUpdate — receives eased progress 0..1
   * @param {function():void} [opts.onComplete]
   * @param {function(number):number} [opts.ease] — default ease-out cubic
   * @returns {{ cancel: function():void }}
   */
  MCS.tween = function tween(opts) {
    opts = opts || {};
    var duration = typeof opts.duration === 'number' ? opts.duration : 0.12;
    var onUpdate = opts.onUpdate;
    var onComplete = opts.onComplete;
    var ease =
      opts.ease ||
      function (t) {
        return 1 - Math.pow(1 - t, 3);
      };

    if (typeof onUpdate !== 'function') {
      return { cancel: function () {} };
    }

    if (MCS.prefersReducedMotion() || duration <= 0) {
      onUpdate(1);
      if (typeof onComplete === 'function') onComplete();
      return { cancel: function () {} };
    }

    var start = null;
    var rafId = null;
    var cancelled = false;

    function frame(ts) {
      if (cancelled) return;
      if (start === null) start = ts;
      var raw = Math.min(1, (ts - start) / (duration * 1000));
      onUpdate(ease(raw));
      if (raw < 1) {
        rafId = requestAnimationFrame(frame);
      } else if (typeof onComplete === 'function') {
        onComplete();
      }
    }

    rafId = requestAnimationFrame(frame);

    return {
      cancel: function () {
        cancelled = true;
        if (rafId !== null) cancelAnimationFrame(rafId);
      },
    };
  };

  // Invalidate cached theme when page accent class changes.
  if (typeof MutationObserver !== 'undefined') {
    var themeObserver = new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i++) {
        if (mutations[i].attributeName === 'class') {
          MCS.invalidateTheme();
          break;
        }
      }
    });
    themeObserver.observe(document.documentElement, { attributes: true });
    if (document.body) {
      themeObserver.observe(document.body, { attributes: true });
    } else {
      document.addEventListener('DOMContentLoaded', function () {
        themeObserver.observe(document.body, { attributes: true });
      });
    }
  }
})(window.MCS || {});
