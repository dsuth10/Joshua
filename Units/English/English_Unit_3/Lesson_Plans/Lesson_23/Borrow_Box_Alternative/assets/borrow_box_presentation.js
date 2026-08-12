window.addEventListener('DOMContentLoaded', () => {
  const isConcise = () => document.body.classList.contains('concise-active');

  const fairSlide = document.getElementById('fairConcernSlide');
  if (fairSlide) {
    let mistakes = 0;
    const feedback = fairSlide.querySelector('.bb-feedback');
    fairSlide.querySelectorAll('.bb-choice').forEach(button => button.addEventListener('click', () => {
      fairSlide.querySelectorAll('.bb-choice').forEach(item => item.classList.remove('wrong-choice'));
      if (button.dataset.kind === 'fair') {
        button.classList.add('correct-choice');
        feedback.textContent = isConcise() ? 'Yes. This is a real worry.' : 'Defensible. This names a genuine concern the audience could hold.';
      } else {
        mistakes += 1;
        button.classList.add('wrong-choice');
        feedback.textContent = mistakes === 1 ? 'Try again. Read the concern without the insult.' : 'This assumes a motive, so it is easier to dismiss than answer.';
        if (mistakes >= 2) fairSlide.querySelector('.bb-hint').classList.add('visible');
      }
    }));
    fairSlide.addEventListener('show-answer', () => {
      fairSlide.querySelectorAll('[data-kind="fair"]').forEach(button => button.classList.add('correct-choice'));
      feedback.textContent = 'A fair counterargument names a practical or ethical concern without blaming the people who hold it.';
      fairSlide.querySelector('.bb-hint').classList.add('visible');
    });
  }

  const replySlide = document.getElementById('replySlide');
  if (replySlide) {
    let mistakes = 0;
    const feedback = replySlide.querySelector('.bb-feedback');
    replySlide.querySelectorAll('.bb-answer').forEach(button => button.addEventListener('click', () => {
      replySlide.querySelectorAll('.bb-answer').forEach(item => item.classList.remove('wrong-choice'));
      if (button.dataset.kind === 'reply') {
        button.classList.add('correct-choice');
        feedback.textContent = isConcise() ? 'Yes. It gives a helpful action for the queue.' : 'Defensible. The safeguard directly answers the queue concern and can be checked.';
      } else {
        mistakes += 1;
        button.classList.add('wrong-choice');
        feedback.textContent = mistakes === 1 ? 'Try again. Which answer changes the queue problem?' : 'Look for a response that reduces waiting or checks whether waiting is acceptable.';
        if (mistakes >= 2) replySlide.querySelector('.bb-hint').classList.add('visible');
      }
    }));
    replySlide.addEventListener('show-answer', () => {
      replySlide.querySelectorAll('[data-kind="reply"]').forEach(button => button.classList.add('correct-choice'));
      feedback.textContent = 'A rebuttal connects a concern to a relevant action, reason or safeguard.';
      replySlide.querySelector('.bb-hint').classList.add('visible');
    });
  }

  const modelSlide = document.getElementById('ackModelSlide');
  if (modelSlide) {
    let step = 0;
    const reveal = () => { if (step < 5) { step += 1; modelSlide.querySelectorAll(`[data-step="${step}"]`).forEach(line => line.classList.add('shown')); } };
    modelSlide.querySelector('.reveal-model').addEventListener('click', reveal);
    modelSlide.addEventListener('show-answer', () => { step = 5; modelSlide.querySelectorAll('.bb-model-line').forEach(line => line.classList.add('shown')); });
  }

  const timer = document.getElementById('writeTimer');
  if (timer) {
    let seconds = 600, timerId = null;
    const draw = () => timer.textContent = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
    document.getElementById('timerStart').addEventListener('click', () => {
      if (timerId) { clearInterval(timerId); timerId = null; return; }
      timerId = setInterval(() => { if (seconds > 0) { seconds -= 1; draw(); } else { clearInterval(timerId); timerId = null; } }, 1000);
    });
    document.getElementById('timerReset').addEventListener('click', () => { clearInterval(timerId); timerId = null; seconds = 600; draw(); });
    draw();
  }
});
