(() => {
  const feedbackText = {
    correct: 'Yes — this choice does the persuasive job.',
    retry: 'Not yet. Explain what this choice does, then try again.'
  };

  document.querySelectorAll('.quiz-container[data-answer]').forEach(container => {
    const answer = container.dataset.answer;
    const feedback = container.parentElement.querySelector('.interactive-feedback') || container.querySelector('.interactive-feedback');
    const hint = container.parentElement.querySelector('.hint-box') || container.querySelector('.hint-box');
    let errors = 0;
    const buttons = container.querySelectorAll('[data-choice]');

    function revealAnswer() {
      buttons.forEach(btn => {
        btn.classList.toggle('correct', btn.dataset.choice === answer);
        btn.classList.remove('incorrect');
      });
      if (feedback) feedback.textContent = feedbackText.correct;
    }

    buttons.forEach(btn => btn.addEventListener('click', () => {
      if (btn.dataset.choice === answer) {
        revealAnswer();
      } else {
        errors += 1;
        btn.classList.add('incorrect');
        setTimeout(() => btn.classList.remove('incorrect'), 450);
        if (feedback) feedback.textContent = feedbackText.retry;
        if (errors >= 2 && hint) hint.classList.add('visible');
      }
    }));

    const slide = container.closest('.slide');
    slide?.addEventListener('show-answer', revealAnswer);
  });

  document.querySelectorAll('.seq-container').forEach(container => {
    const expected = container.dataset.order.split(',');
    const cards = [...container.querySelectorAll('.sequence-card')];
    const slots = container.querySelector('.sequence-slots');
    const feedback = container.querySelector('.interactive-feedback');
    const hint = container.querySelector('.hint-box');
    let chosen = [];
    let errors = 0;

    function draw() {
      slots.innerHTML = '';
      chosen.forEach(step => {
        const source = cards.find(card => card.dataset.step === step);
        const chip = document.createElement('button');
        chip.className = 'slot-chip';
        chip.textContent = source.textContent;
        chip.addEventListener('click', () => {
          chosen = chosen.filter(item => item !== step);
          source.classList.remove('selected');
          draw();
        });
        slots.appendChild(chip);
      });
    }

    function revealAnswer() {
      chosen = [...expected];
      cards.forEach(card => card.classList.add('selected'));
      draw();
      container.classList.add('correct-state');
      feedback.textContent = 'The chain now shows the action, explanation and learning result.';
    }

    cards.forEach(card => card.addEventListener('click', () => {
      if (!chosen.includes(card.dataset.step) && chosen.length < expected.length) {
        chosen.push(card.dataset.step);
        card.classList.add('selected');
        draw();
      }
    }));

    container.querySelector('.check-btn').addEventListener('click', () => {
      if (chosen.join(',') === expected.join(',')) return revealAnswer();
      errors += 1;
      feedback.textContent = 'Retry: begin with what students do and finish with what the class learns.';
      if (errors >= 2) hint.classList.add('visible');
    });
    container.closest('.slide')?.addEventListener('show-answer', revealAnswer);
  });

  document.querySelectorAll('.reveal-btn').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll(`[data-part="${button.dataset.reveal}"]`).forEach(part => part.classList.add('revealed'));
      button.classList.add('active');
    });
  });
  document.querySelector('#conclusion-slide')?.addEventListener('show-answer', () => {
    document.querySelectorAll('[data-part]').forEach(part => part.classList.add('revealed'));
    document.querySelectorAll('.reveal-btn').forEach(button => button.classList.add('active'));
  });

  let timer = 45;
  let timerId = null;
  const timerEl = document.querySelector('.timer');
  const drawTimer = () => { if (timerEl) timerEl.textContent = `00:${String(timer).padStart(2, '0')}`; };
  document.querySelector('#startTimerBtn')?.addEventListener('click', () => {
    if (timerId) return;
    timerId = setInterval(() => {
      timer = Math.max(0, timer - 1);
      drawTimer();
      if (timer === 0) { clearInterval(timerId); timerId = null; }
    }, 1000);
  });
  document.querySelector('#resetTimerBtn')?.addEventListener('click', () => {
    clearInterval(timerId); timerId = null; timer = 45; drawTimer();
  });
  document.querySelector('#voice-slide')?.addEventListener('show-answer', () => {
    clearInterval(timerId); timerId = null; timer = 45; drawTimer();
  });
  drawTimer();
})();

