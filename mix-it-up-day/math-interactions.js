/* Reusable, dependency-free visual answer controls for Mix It Up Day. */
(function () {
  'use strict';

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function numberLineValues(question) {
    if (Array.isArray(question.ticks) && question.ticks.length) return question.ticks;
    var start = Number(question.start == null ? (question.min == null ? 0 : question.min) : question.start);
    var end = Number(question.end == null ? (question.max == null ? 10 : question.max) : question.end);
    var step = Number(question.step == null ? (question.ticks == null ? 1 : question.ticks) : question.step);
    var values = [];
    if (!isFinite(start) || !isFinite(end) || !isFinite(step) || step <= 0) return values;
    for (var n = start; n <= end + (step / 1000000); n += step) {
      values.push(Number(n.toFixed(8)));
    }
    var answer = Number(question.answer);
    if (isFinite(answer) && answer >= start && answer <= end && values.indexOf(answer) === -1) values.push(answer);
    values.sort(function (a, b) { return a - b; });
    return values;
  }

  function denominator(question) {
    var value = Number(question.denominator || question.parts || 4);
    return isFinite(value) && value > 0 ? Math.min(Math.floor(value), 24) : 4;
  }

  function numerator(value, total) {
    var match = String(value || '').match(/^(\d+)\s*\/\s*(\d+)$/);
    if (!match || Number(match[2]) !== total) return 0;
    return Math.max(0, Math.min(total, Number(match[1])));
  }

  function renderNumberLine(question, value) {
    var values = numberLineValues(question);
    var selected = String(value == null ? '' : value);
    var label = question.ariaLabel || question.label || question.prompt || 'Choose a point on the number line';
    return '<div class="math-number-line" data-math-control="numberLine" role="group" aria-label="' + escapeHtml(label) + '">' +
      '<div class="math-number-line__track" aria-hidden="true"></div>' +
      '<div class="math-number-line__ticks">' + values.map(function (tick) {
        var tickValue = String(tick);
        var isSelected = tickValue === selected;
        return '<button type="button" class="math-number-line__tick' + (isSelected ? ' is-selected' : '') + '" data-math-value="' + escapeHtml(tickValue) + '" aria-pressed="' + isSelected + '"><span class="math-number-line__mark"></span><span class="math-number-line__label">' + escapeHtml(tickValue) + '</span></button>';
      }).join('') + '</div>' +
      '<p class="math-control-status" aria-live="polite">' + (selected ? 'Selected: ' + escapeHtml(selected) : 'Choose a number.') + '</p></div>';
  }

  function renderFractionShade(question, value) {
    var total = denominator(question);
    var shaded = numerator(value, total);
    var label = question.ariaLabel || question.label || question.prompt || 'Shade fraction parts';
    var parts = [];
    for (var index = 0; index < total; index += 1) {
      var selected = index < shaded;
      parts.push('<button type="button" class="fraction-shade__part' + (selected ? ' is-shaded' : '') + '" data-fraction-index="' + index + '" aria-pressed="' + selected + '" aria-label="Part ' + (index + 1) + ' of ' + total + (selected ? ', shaded' : ', unshaded') + '"><span aria-hidden="true">' + (index + 1) + '</span></button>');
    }
    return '<div class="fraction-shade" data-math-control="fractionShade" data-denominator="' + total + '" style="--fraction-parts:' + total + '" role="group" aria-label="' + escapeHtml(label) + '">' +
      '<div class="fraction-shade__parts">' + parts.join('') + '</div>' +
      '<p class="math-control-status" aria-live="polite">' + shaded + '/' + total + ' shaded</p></div>';
  }

  function render(question, value) {
    if (!question) return '';
    if (question.type === 'numberLine') return renderNumberLine(question, value);
    if (question.type === 'fractionShade') return renderFractionShade(question, value);
    return '';
  }

  function bind(container, onChange) {
    if (!container) return;
    container.__mixMathOnChange = onChange;
    if (container.dataset.mathInteractionsBound === 'true') return;
    container.dataset.mathInteractionsBound = 'true';
    container.addEventListener('click', function (event) {
      var numberTick = event.target.closest('[data-math-value]');
      if (numberTick && container.contains(numberTick)) {
        var line = numberTick.closest('[data-math-control="numberLine"]');
        if (!line) return;
        line.querySelectorAll('[data-math-value]').forEach(function (button) {
          var selected = button === numberTick;
          button.classList.toggle('is-selected', selected);
          button.setAttribute('aria-pressed', String(selected));
        });
        var status = line.querySelector('.math-control-status');
        if (status) status.textContent = 'Selected: ' + numberTick.dataset.mathValue;
        if (typeof container.__mixMathOnChange === 'function') container.__mixMathOnChange(numberTick.dataset.mathValue, line);
        return;
      }
      var fractionPart = event.target.closest('[data-fraction-index]');
      if (!fractionPart || !container.contains(fractionPart)) return;
      var fraction = fractionPart.closest('[data-math-control="fractionShade"]');
      if (!fraction) return;
      var total = Number(fraction.dataset.denominator);
      var count = Number(fractionPart.dataset.fractionIndex) + 1;
      fraction.querySelectorAll('[data-fraction-index]').forEach(function (button, index) {
        var selected = index < count;
        button.classList.toggle('is-shaded', selected);
        button.setAttribute('aria-pressed', String(selected));
        button.setAttribute('aria-label', 'Part ' + (index + 1) + ' of ' + total + (selected ? ', shaded' : ', unshaded'));
      });
      var fractionValue = count + '/' + total;
      var fractionStatus = fraction.querySelector('.math-control-status');
      if (fractionStatus) fractionStatus.textContent = fractionValue + ' shaded';
      if (typeof container.__mixMathOnChange === 'function') container.__mixMathOnChange(fractionValue, fraction);
    });
  }

  window.MixMathInteractions = { render: render, bind: bind };
}());
