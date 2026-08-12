(() => {
  const all = (selector, scope=document) => [...scope.querySelectorAll(selector)];
  all('.quiz-container').forEach((quiz) => {
    const answer = quiz.dataset.answer;
    const slide = quiz.closest('.slide');
    const feedback = slide.querySelector('.interaction-feedback');
    const hint = slide.querySelector('.hint-box');
    let errors = 0;
    const show = () => {
      all('button', quiz).forEach((button) => {
        const correct = button.dataset.choice === answer;
        button.classList.toggle('is-correct', correct);
        button.classList.remove('is-wrong');
        button.setAttribute('aria-pressed', String(correct));
      });
      feedback.textContent = 'Model answer shown. Explain which detail supports it.';
      hint.classList.add('visible');
    };
    all('button', quiz).forEach((button) => button.addEventListener('click', () => {
      const correct = button.dataset.choice === answer;
      if (correct) {
        all('button', quiz).forEach((item) => item.classList.remove('is-wrong'));
        button.classList.add('is-correct');
        button.setAttribute('aria-pressed', 'true');
        feedback.textContent = 'Yes. Now justify the choice using a detail from the text.';
        return;
      }
      errors += 1;
      button.classList.add('is-wrong');
      feedback.textContent = errors === 1 ? 'Try again: look for the decision that changes what happens next.' : 'Use the clue below, then explain your choice.';
      if (errors >= 2) hint.classList.add('visible');
    }));
    slide.addEventListener('show-answer', show);
  });
})();
