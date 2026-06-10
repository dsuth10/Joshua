/**
 * MCS Question Package API — canonical question runner + legacy adapters.
 * Phase 1: passthrough widget wraps existing Y3–5 / Y6 question shapes unchanged.
 */
(function (MCS) {
  'use strict';

  if (!window.MCS) {
    throw new Error('mcs-question-adapter.js requires mcs-core.js loaded first');
  }

  // ---------------------------------------------------------------------------
  // Legacy passthrough pseudo-widget (doc 02 §4.3)
  // ---------------------------------------------------------------------------
  MCS.register('legacy-passthrough', function legacyPassthrough(container, config) {
    config = config || {};
    container.innerHTML = '';

    if (typeof config.render === 'function') {
      config.render(container);
    } else if (config.html != null) {
      container.innerHTML = config.html;
    }

    var changeCallbacks = [];
    var enabled = true;

    function setContainerEnabled(on) {
      container.querySelectorAll('input, select, textarea, button').forEach(function (el) {
        el.disabled = !on;
      });
    }

    return {
      getValue: function () {
        return {};
      },
      setValue: function () {},
      setEnabled: function (on) {
        enabled = !!on;
        setContainerEnabled(enabled);
      },
      showSolution: function () {},
      flagCorrect: function () {
        container.classList.add('mcs-flag-correct');
        window.setTimeout(function () {
          container.classList.remove('mcs-flag-correct');
        }, 600);
      },
      flagIncorrect: function () {
        container.classList.add('mcs-flag-incorrect');
        window.setTimeout(function () {
          container.classList.remove('mcs-flag-incorrect');
        }, 450);
      },
      onChange: function (callback) {
        if (typeof callback === 'function') changeCallbacks.push(callback);
      },
      destroy: function () {
        container.innerHTML = '';
        changeCallbacks.length = 0;
        MCS._releaseContainer(container);
      },
    };
  });

  // ---------------------------------------------------------------------------
  // Legacy adapters
  // ---------------------------------------------------------------------------

  /**
   * Years 3–5 shape: { questionText, renderFunc, validateFunc, hintText, solutionText, ... }
   */
  MCS.adaptLegacyY35 = function adaptLegacyY35(q) {
    if (!q) return q;

    return {
      descriptor: q.descriptor,
      context: q.context,
      category: q.category,
      title: q.questionText || q.title || '',
      prompt: q.questionText || null,
      promptAudio: q.promptAudio || null,
      widgets: [
        {
          id: 'legacy',
          type: 'legacy-passthrough',
          config: { render: q.renderFunc },
        },
      ],
      inputs: [],
      evaluate: function () {
        return q.validateFunc();
      },
      hint: {
        text: q.hintText || '',
        highlight: q.hintHighlight || [],
      },
      solution: {
        text: q.solutionText || '',
        show: q.solutionShow || null,
      },
      points: q.points != null ? q.points : 10,
      _legacy: q,
    };
  };

  /**
   * Year 6 shape: { title, html, validate, hint, solution, ... }
   */
  MCS.adaptLegacyY6 = function adaptLegacyY6(q) {
    if (!q) return q;

    var hintText = typeof q.hint === 'string' ? q.hint : q.hint && q.hint.text ? q.hint.text : '';
    var solutionText =
      typeof q.solution === 'string' ? q.solution : q.solution && q.solution.text ? q.solution.text : '';

    return {
      descriptor: q.descriptor,
      context: q.context,
      category: q.category,
      title: q.title || '',
      prompt: q.prompt || null,
      promptAudio: q.promptAudio || null,
      widgets: [
        {
          id: 'legacy',
          type: 'legacy-passthrough',
          config: { html: q.html },
        },
      ],
      inputs: [],
      evaluate: function () {
        return q.validate();
      },
      hint: {
        text: hintText,
        highlight: q.hintHighlight || [],
      },
      solution: {
        text: solutionText,
        show: q.solutionShow || null,
      },
      points: q.points != null ? q.points : 10,
      _legacy: q,
    };
  };

  // ---------------------------------------------------------------------------
  // Question runner (doc 02 §4.2)
  // ---------------------------------------------------------------------------

  function normaliseHint(hint) {
    if (!hint) return { text: '', highlight: [] };
    if (typeof hint === 'string') return { text: hint, highlight: [] };
    return {
      text: hint.text || '',
      highlight: hint.highlight || [],
    };
  }

  function normaliseSolution(solution) {
    if (!solution) return { text: '', show: null };
    if (typeof solution === 'string') return { text: solution, show: null };
    return {
      text: solution.text || '',
      show: solution.show || null,
    };
  }

  /**
   * Mount a canonical question package and return a session handle.
   * @param {Object} question — canonical shape (or output of adaptLegacy*)
   * @param {Object} options
   * @param {HTMLElement} options.widgetMount — interactive region
   * @param {HTMLElement} [options.promptMount] — title / prompt element
   * @param {'A'|'B'|'C'} [options.band='C']
   */
  MCS.runQuestion = function runQuestion(question, options) {
    options = options || {};
    var widgetMount = options.widgetMount;
    var promptMount = options.promptMount;
    var band = options.band || 'C';

    if (!question) {
      throw new Error('MCS.runQuestion requires a question package');
    }
    if (!widgetMount) {
      throw new Error('MCS.runQuestion requires options.widgetMount');
    }

    if (promptMount) {
      promptMount.textContent = question.title || question.prompt || '';
    }

    widgetMount.innerHTML = '';
    var instances = Object.create(null);
    var widgets = question.widgets || [];

    widgets.forEach(function (spec) {
      var region = document.createElement('div');
      region.className = 'mcs-widget-region';
      region.dataset.widgetId = spec.id;
      region.setAttribute('role', 'group');
      widgetMount.appendChild(region);

      var widgetConfig = Object.assign({}, spec.config || {}, { band: band });
      instances[spec.id] = MCS.create(spec.type, region, widgetConfig);
    });

    (question.inputs || []).forEach(function (spec) {
      var region = document.createElement('div');
      region.className = 'mcs-input-region';
      region.dataset.inputId = spec.id;
      widgetMount.appendChild(region);
      var inputConfig = Object.assign({}, spec.config || {}, { band: band });
      try {
        instances[spec.id] = MCS.create(spec.type, region, inputConfig);
      } catch (err) {
        console.warn('MCS.runQuestion: skipped unregistered input type "' + spec.type + '"');
      }
    });

    var hintNorm = normaliseHint(question.hint);
    var solutionNorm = normaliseSolution(question.solution);

    return {
      question: question,
      instances: instances,

      collect: function collect() {
        var values = Object.create(null);
        Object.keys(instances).forEach(function (id) {
          var inst = instances[id];
          if (inst && typeof inst.getValue === 'function') {
            values[id] = inst.getValue();
          }
        });
        return values;
      },

      evaluate: function evaluate() {
        var values = this.collect();
        if (typeof question.evaluate === 'function') {
          return question.evaluate(values);
        }
        return false;
      },

      applyHintHighlights: function applyHintHighlights() {
        hintNorm.highlight.forEach(function (target) {
          var parts = String(target).split(':');
          var widgetId = parts[0];
          var el = widgetMount.querySelector('[data-widget-id="' + widgetId + '"]');
          if (el) el.classList.add('mcs-hint-highlight');
        });
      },

      clearHintHighlights: function clearHintHighlights() {
        widgetMount.querySelectorAll('.mcs-hint-highlight').forEach(function (el) {
          el.classList.remove('mcs-hint-highlight');
        });
      },

      showHint: function showHint(hintTextEl) {
        if (hintTextEl) {
          if (hintTextEl.tagName === 'INPUT' || hintTextEl.tagName === 'TEXTAREA') {
            hintTextEl.value = hintNorm.text;
          } else if (hintNorm.text.indexOf('<') !== -1) {
            hintTextEl.innerHTML = hintNorm.text;
          } else {
            hintTextEl.textContent = hintNorm.text;
          }
        }
        this.applyHintHighlights();
      },

      showSolution: function showSolution(solutionTextEl) {
        if (solutionNorm.show) {
          Object.keys(solutionNorm.show).forEach(function (id) {
            var inst = instances[id];
            if (inst && typeof inst.showSolution === 'function') {
              inst.showSolution(solutionNorm.show[id]);
            }
          });
        }
        if (solutionTextEl) {
          solutionTextEl.innerHTML = solutionNorm.text;
        }
      },

      setEnabled: function setEnabled(on) {
        Object.keys(instances).forEach(function (id) {
          var inst = instances[id];
          if (inst && typeof inst.setEnabled === 'function') {
            inst.setEnabled(on);
          }
        });
      },

      dispose: function dispose() {
        Object.keys(instances).forEach(function (id) {
          var inst = instances[id];
          if (inst && typeof inst.destroy === 'function') {
            inst.destroy();
          }
        });
        widgetMount.innerHTML = '';
      },
    };
  };
})(window.MCS);
