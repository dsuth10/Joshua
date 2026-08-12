window.addEventListener('DOMContentLoaded', () => {
  const languageToggle = document.getElementById('pathwayToggleBtn');
  if (languageToggle) {
    languageToggle.setAttribute('aria-label', 'Change language view');
    const saved = sessionStorage.getItem('cupFamilyLanguage');
    if (saved === 'green') {
      languageToggle.checked = true;
      document.body.classList.add('lucas-active');
    }
    languageToggle.setAttribute('aria-checked', String(languageToggle.checked));
    languageToggle.addEventListener('change', () => {
      sessionStorage.setItem('cupFamilyLanguage', languageToggle.checked ? 'green' : 'red');
      languageToggle.setAttribute('aria-checked', String(languageToggle.checked));
    });
  }

  const fairSlide = document.getElementById('fairSlide');
  let fairMistakes = 0;
  const fairFeedback = fairSlide.querySelector('.fair-feedback');
  const fairHint = fairSlide.querySelector('.fair-hint');
  fairSlide.querySelectorAll('.choice').forEach(button => {
    button.addEventListener('click', () => {
      fairSlide.querySelectorAll('.choice').forEach(item => item.classList.remove('wrong-choice', 'shake-error'));
      if (button.dataset.kind === 'good') {
        button.classList.add('correct-choice');
        fairFeedback.textContent = document.body.classList.contains('lucas-active')
          ? 'Yes. This is the real worry.'
          : 'Defensible. This represents the genuine concern accurately.';
        fairFeedback.className = 'feedback fair-feedback good';
        return;
      }
      fairMistakes += 1;
      button.classList.add('wrong-choice', 'shake-error');
      fairFeedback.textContent = fairMistakes === 1 ? 'Try again.' : button.dataset.hint;
      fairFeedback.className = 'feedback fair-feedback retry';
      if (fairMistakes >= 2) fairHint.classList.add('visible');
    });
  });
  fairSlide.addEventListener('show-answer', () => {
    fairSlide.querySelectorAll('.choice[data-kind="good"]').forEach(item => item.classList.add('correct-choice'));
    fairFeedback.textContent = 'The fair choice names safety, workflow and livelihood without attacking the family.';
    fairFeedback.className = 'feedback fair-feedback good';
    fairHint.classList.remove('visible');
  });

  const boundarySlide = document.getElementById('boundarySlide');
  boundarySlide.querySelectorAll('.statement').forEach(card => {
    let mistakes = 0;
    card.querySelectorAll('.answer').forEach(button => {
      button.addEventListener('click', () => {
        card.querySelectorAll('.answer').forEach(item => item.classList.remove('wrong-choice', 'shake-error'));
        const result = card.querySelector('.result');
        if (button.dataset.a === card.dataset.correct) {
          button.classList.add('correct-choice');
          result.textContent = document.body.classList.contains('lucas-active')
            ? 'Yes. Explain your reason.'
            : 'Defensible. Explain the evidence boundary.';
          result.style.color = '#bff4cd';
          return;
        }
        mistakes += 1;
        button.classList.add('wrong-choice', 'shake-error');
        result.textContent = 'Try again.';
        result.style.color = '#ffd0c5';
        if (mistakes >= 2) card.querySelector('.hint-box').classList.add('visible');
      });
    });
  });
  boundarySlide.addEventListener('show-answer', () => {
    boundarySlide.querySelectorAll('.statement').forEach(card => {
      card.querySelector(`[data-a="${card.dataset.correct}"]`).classList.add('correct-choice');
      card.querySelector('.result').textContent = 'Correct classification shown.';
      card.querySelector('.result').style.color = '#bff4cd';
    });
  });

  const modelSlide = document.getElementById('modelSlide');
  let modelStep = 0;
  const revealModel = () => {
    if (modelStep < 6) modelStep += 1;
    modelSlide.querySelectorAll(`.model-line[data-step="${modelStep}"]`).forEach(line => line.classList.add('shown'));
  };
  modelSlide.querySelector('.reveal-model').addEventListener('click', revealModel);
  modelSlide.addEventListener('show-answer', () => {
    modelStep = 6;
    modelSlide.querySelectorAll('.model-line').forEach(line => line.classList.add('shown'));
  });

  let seconds = 720;
  let timerId = null;
  const timer = document.getElementById('timer');
  const drawTimer = () => {
    timer.textContent = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  };
  document.getElementById('timerStart').addEventListener('click', () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
      return;
    }
    timerId = setInterval(() => {
      if (seconds > 0) {
        seconds -= 1;
        drawTimer();
      } else {
        clearInterval(timerId);
        timerId = null;
      }
    }, 1000);
  });
  document.getElementById('timerReset').addEventListener('click', () => {
    clearInterval(timerId);
    timerId = null;
    seconds = 720;
    drawTimer();
  });
  drawTimer();
});
