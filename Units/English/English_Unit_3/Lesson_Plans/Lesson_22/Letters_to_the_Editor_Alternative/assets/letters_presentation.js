window.addEventListener('DOMContentLoaded', () => {
  const concise = () => document.body.classList.contains('concise-active');
  const fingerprintTeachSlide = document.getElementById('fingerprintTeachSlide');
  const fingerprintPop = document.getElementById('fingerprintPop');
  if (fingerprintTeachSlide && fingerprintPop) {
    const panel = fingerprintPop.querySelector('.lz-pop-panel');
    const copies = fingerprintPop.querySelectorAll('.lz-pop-copy');
    const closeBtn = fingerprintPop.querySelector('.lz-pop-close');
    const openPrint = kind => {
      copies.forEach(copy => {
        copy.hidden = copy.dataset.print !== kind;
      });
      const title = fingerprintPop.querySelector('.lz-pop-copy:not([hidden]) h3');
      if (title) {
        fingerprintPop.querySelectorAll('h3').forEach(heading => heading.removeAttribute('id'));
        title.id = 'fingerprintPopTitle';
        panel.setAttribute('aria-labelledby', 'fingerprintPopTitle');
      }
      fingerprintPop.hidden = false;
      fingerprintPop.classList.add('open');
      closeBtn.focus();
    };
    const closePop = () => {
      fingerprintPop.classList.remove('open');
      fingerprintPop.hidden = true;
    };
    fingerprintTeachSlide.querySelectorAll('.lz-finger').forEach(btn => {
      btn.addEventListener('click', () => openPrint(btn.dataset.print));
    });
    closeBtn.addEventListener('click', closePop);
    fingerprintPop.addEventListener('click', event => {
      if (event.target === fingerprintPop) closePop();
    });
    window.addEventListener('keydown', event => {
      if (!fingerprintPop.classList.contains('open')) return;
      if (event.key === 'Escape' || event.key === 'ArrowRight' || event.key === 'ArrowLeft' || event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'PageDown' || event.key === 'PageUp' || event.key === ' ') {
        if (event.key === 'Escape') closePop();
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }, true);
    const slideWatcher = new MutationObserver(() => {
      if (!fingerprintTeachSlide.classList.contains('active')) closePop();
    });
    slideWatcher.observe(fingerprintTeachSlide, { attributes: true, attributeFilter: ['class'] });
  }
  const spectrumSlide = document.getElementById('spectrumSlide');
  const letterPop = document.getElementById('letterPop');
  const biasSpectrum = document.getElementById('biasSpectrum');
  if (spectrumSlide && letterPop && biasSpectrum) {
    const panel = letterPop.querySelector('.lz-pop-panel');
    const copies = letterPop.querySelectorAll('.lz-pop-copy');
    const closeBtn = letterPop.querySelector('.lz-pop-close');
    const openLetter = kind => {
      copies.forEach(copy => {
        copy.hidden = copy.dataset.letter !== kind;
      });
      const title = letterPop.querySelector('.lz-pop-copy:not([hidden]) h3');
      if (title) {
        letterPop.querySelectorAll('h3').forEach(heading => heading.removeAttribute('id'));
        title.id = 'letterPopTitle';
        panel.setAttribute('aria-labelledby', 'letterPopTitle');
      }
      letterPop.hidden = false;
      letterPop.classList.add('open');
      closeBtn.focus();
    };
    const closePop = () => {
      letterPop.classList.remove('open');
      letterPop.hidden = true;
    };
    const restoreOrder = () => {
      'ABCDEF'.split('').forEach(letter => {
        const card = biasSpectrum.querySelector(`[data-letter="${letter}"]`);
        if (card) biasSpectrum.append(card);
      });
    };
    closeBtn.addEventListener('click', closePop);
    letterPop.addEventListener('click', event => {
      if (event.target === letterPop) closePop();
    });
    window.addEventListener('keydown', event => {
      if (!letterPop.classList.contains('open')) return;
      if (event.key === 'Escape' || event.key === 'ArrowRight' || event.key === 'ArrowLeft' || event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'PageDown' || event.key === 'PageUp' || event.key === ' ') {
        if (event.key === 'Escape') closePop();
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }, true);
    const slideWatcher = new MutationObserver(() => {
      if (!spectrumSlide.classList.contains('active')) closePop();
    });
    slideWatcher.observe(spectrumSlide, { attributes: true, attributeFilter: ['class'] });

    let drag = null;
    let ignoreClick = false;
    const cards = () => [...biasSpectrum.querySelectorAll('.lz-spec-card')];
    const placeByX = x => {
      const others = cards().filter(card => card !== drag.card);
      const target = others.find(card => {
        const box = card.getBoundingClientRect();
        return x < box.left + box.width / 2;
      });
      if (target) target.before(drag.card);
      else biasSpectrum.append(drag.card);
    };
    biasSpectrum.addEventListener('pointerdown', event => {
      const card = event.target.closest('.lz-spec-card');
      if (!card || event.button) return;
      drag = { card, startX: event.clientX, startY: event.clientY, dragging: false, pointerId: event.pointerId };
      card.setPointerCapture(event.pointerId);
    });
    biasSpectrum.addEventListener('pointermove', event => {
      if (!drag || event.pointerId !== drag.pointerId) return;
      const dx = event.clientX - drag.startX;
      const dy = event.clientY - drag.startY;
      if (!drag.dragging && Math.hypot(dx, dy) > 8) {
        drag.dragging = true;
        drag.card.classList.add('dragging');
      }
      if (drag.dragging) placeByX(event.clientX);
    });
    const endDrag = event => {
      if (!drag || event.pointerId !== drag.pointerId) return;
      const { card, dragging } = drag;
      card.classList.remove('dragging');
      try { card.releasePointerCapture(event.pointerId); } catch (err) { /* already released */ }
      drag = null;
      if (dragging) ignoreClick = true;
    };
    biasSpectrum.addEventListener('pointerup', endDrag);
    biasSpectrum.addEventListener('pointercancel', endDrag);
    biasSpectrum.addEventListener('click', event => {
      const card = event.target.closest('.lz-spec-card');
      if (!card) return;
      if (ignoreClick) {
        ignoreClick = false;
        return;
      }
      openLetter(card.dataset.letter);
    });
    spectrumSlide.addEventListener('show-answer', restoreOrder);
  }
  const fingerprintSlide = document.getElementById('fingerprintSlide');
  if (fingerprintSlide) {
    let mistakes = 0;
    const feedback = fingerprintSlide.querySelector('.lz-feedback');
    const feedbackCopy = {
      'wrong-1': [
        'Try again. What does the writer claim to know about the critics?',
        'Try again. What does the writer guess about the critics?'
      ],
      'wrong-2': [
        'The phrase says critics fear change. That is a claim about their reason for acting.',
        'The writer says why the critics act, but does not prove it.'
      ],
      correct: [
        'Defensible. The writer claims to know the critics\' motive without evidence.',
        'Yes. The writer guesses why people disagree.'
      ],
      shown: [
        'Assumed motive: the writer states an unverified reason for another group\'s behaviour.',
        'Assumed motive: the writer guesses why another group acts.'
      ]
    };
    const renderFeedback = () => {
      const copy = feedbackCopy[feedback.dataset.feedbackState];
      if (copy) feedback.textContent = copy[concise() ? 1 : 0];
    };
    document.addEventListener('change', event => {
      if (event.target.matches('input[aria-label="Change language view"]')) renderFeedback();
    });
    fingerprintSlide.querySelectorAll('.lz-choice').forEach(btn => btn.addEventListener('click', () => {
      fingerprintSlide.querySelectorAll('.lz-choice').forEach(x => x.classList.remove('wrong-choice'));
      if (btn.dataset.kind === 'motive') {
        btn.classList.add('correct-choice');
        feedback.dataset.feedbackState = 'correct';
      } else {
        mistakes += 1; btn.classList.add('wrong-choice');
        feedback.dataset.feedbackState = mistakes === 1 ? 'wrong-1' : 'wrong-2';
        if (mistakes >= 2) fingerprintSlide.querySelector('.lz-hint').classList.add('visible');
      }
      renderFeedback();
    }));
    fingerprintSlide.addEventListener('show-answer', () => {
      fingerprintSlide.querySelector('[data-kind="motive"]').classList.add('correct-choice');
      feedback.dataset.feedbackState = 'shown';
      renderFeedback();
      fingerprintSlide.querySelector('.lz-hint').classList.add('visible');
    });
  }
  const trustSlide = document.getElementById('trustSlide');
  if (trustSlide) {
    let mistakes = 0;
    const feedback = trustSlide.querySelector('.lz-feedback');
    const feedbackCopy = {
      'wrong-1': [
        'Try again. Trust is not the same as agreeing.',
        'Try again. Agreeing does not make a letter trustworthy.'
      ],
      'wrong-2': [
        'Look for a reason based on language and evidence, not the position you prefer.',
        'Look for facts and fair language, not your favourite view.'
      ],
      correct: [
        'Defensible. This explanation uses evidence boundaries, fair concerns and measurable review.',
        'Yes. It checks facts, worries and what happens.'
      ],
      shown: [
        'The strongest judgement uses criteria: attribution, qualification, fair concession and evidence limits.',
        'The strongest reason checks whose view it is, uses careful words and names what is not known.'
      ]
    };
    const renderFeedback = () => {
      const copy = feedbackCopy[feedback.dataset.feedbackState];
      if (copy) feedback.textContent = copy[concise() ? 1 : 0];
    };
    document.addEventListener('change', event => {
      if (event.target.matches('input[aria-label="Change language view"]')) renderFeedback();
    });
    trustSlide.querySelectorAll('.lz-answer').forEach(btn => btn.addEventListener('click', () => {
      trustSlide.querySelectorAll('.lz-answer').forEach(x => x.classList.remove('wrong-choice'));
      if (btn.dataset.kind === 'criteria') {
        btn.classList.add('correct-choice');
        feedback.dataset.feedbackState = 'correct';
      } else {
        mistakes += 1; btn.classList.add('wrong-choice');
        feedback.dataset.feedbackState = mistakes === 1 ? 'wrong-1' : 'wrong-2';
        if (mistakes >= 2) trustSlide.querySelector('.lz-hint').classList.add('visible');
      }
      renderFeedback();
    }));
    trustSlide.addEventListener('show-answer', () => {
      trustSlide.querySelector('[data-kind="criteria"]').classList.add('correct-choice');
      feedback.dataset.feedbackState = 'shown';
      renderFeedback();
      trustSlide.querySelector('.lz-hint').classList.add('visible');
    });
  }
  const extraClassificationQuizzes = [
    {
      id: 'classificationLoaded', answer: 'loaded',
      feedback: {
        'wrong-1': ['Try again. Which words praise or blame the plan?', 'Try again. Which words judge the plan?'],
        'wrong-2': ['The words “reckless”, “peaceful” and “miserable” load the plan with judgement.', 'The phrase uses strong judging words about the plan.'],
        correct: ['Defensible. The phrase uses loaded evaluation before evidence is considered.', 'Yes. Strong judging words pull the reader.'],
        shown: ['Loaded evaluation: “reckless”, “peaceful” and “miserable” frame the plan emotionally.', 'Loaded evaluation: strong judging words push the reader.']
      }
    },
    {
      id: 'classificationGeneralisation', answer: 'generalisation',
      feedback: {
        'wrong-1': ['Try again. Who does “every sensible resident” claim to represent?', 'Try again. Does the phrase speak for everyone?'],
        'wrong-2': ['“Every sensible resident” speaks for a whole group and shuts out disagreement.', 'The phrase speaks for everyone and makes disagreement seem foolish.'],
        correct: ['Defensible. The writer generalises about residents without evidence for “every”.', 'Yes. The phrase speaks for everyone.'],
        shown: ['Sweeping generalisation: “every sensible resident” claims universal agreement.', 'Sweeping generalisation: it speaks for everyone.']
      }
    },
    {
      id: 'classificationMotive', answer: 'motive',
      feedback: {
        'wrong-1': ['Try again. What reason does the writer assign to councillors?', 'Try again. What does the writer guess about their reason?'],
        'wrong-2': ['The writer states a private reason for councillors’ action without evidence.', 'The writer guesses why the councillors act.'],
        correct: ['Defensible. The writer claims to know the councillors’ motive without evidence.', 'Yes. The writer guesses why the councillors act.'],
        shown: ['Assumed motive: the writer mind-reads the councillors’ reason for acting.', 'Assumed motive: the writer guesses their reason.']
      }
    },
    {
      id: 'classificationOmission', answer: 'omission',
      feedback: {
        'wrong-1': ['Try again. What relevant part of the proposal is not mentioned?', 'Try again. What important detail is left out?'],
        'wrong-2': ['The sentence selects benefits while leaving relevant concerns out of view.', 'It shows benefits but leaves other important details out.'],
        correct: ['Defensible. Selection makes the sentence one-sided by omitting relevant concerns.', 'Yes. It shows one side and leaves details out.'],
        shown: ['Omission / selection: the benefits may be real, but the sentence hides relevant concerns.', 'Omission / selection: one side is shown and other details are missing.']
      }
    },
    {
      id: 'classificationCertainty', answer: 'certainty',
      feedback: {
        'wrong-1': ['Try again. Does the phrase allow a middle option or qualify its prediction?', 'Try again. Does it give only two choices or a careful guess?'],
        'wrong-2': ['“Either...or...” removes middle options, while “will” and “forever” make a prediction sound certain.', 'It gives only two choices and treats a guess as a fact.'],
        correct: ['Defensible. The phrase creates a false choice and states an unsupported prediction as certainty.', 'Yes. It gives only two choices and sounds too certain.'],
        shown: ['Unsupported certainty / false choice: “either...or”, “will” and “forever” shut down reasonable alternatives.', 'Unsupported certainty / false choice: only two choices, with a guess treated as fact.']
      }
    }
  ];
  extraClassificationQuizzes.forEach(config => {
    const slide = document.getElementById(config.id);
    if (!slide) return;
    let mistakes = 0;
    const feedback = slide.querySelector('.lz-feedback');
    const renderFeedback = () => {
      const copy = config.feedback[feedback.dataset.feedbackState];
      if (copy) feedback.textContent = copy[concise() ? 1 : 0];
    };
    document.addEventListener('change', event => {
      if (event.target.matches('input[aria-label="Change language view"]')) renderFeedback();
    });
    slide.querySelectorAll('.lz-choice').forEach(btn => btn.addEventListener('click', () => {
      slide.querySelectorAll('.lz-choice').forEach(x => x.classList.remove('wrong-choice'));
      if (btn.dataset.kind === config.answer) {
        btn.classList.add('correct-choice');
        feedback.dataset.feedbackState = 'correct';
      } else {
        mistakes += 1;
        btn.classList.add('wrong-choice');
        feedback.dataset.feedbackState = mistakes === 1 ? 'wrong-1' : 'wrong-2';
        if (mistakes >= 2) slide.querySelector('.lz-hint').classList.add('visible');
      }
      renderFeedback();
    }));
    slide.addEventListener('show-answer', () => {
      slide.querySelectorAll('.lz-choice').forEach(x => x.classList.remove('wrong-choice'));
      slide.querySelector(`[data-kind="${config.answer}"]`).classList.add('correct-choice');
      feedback.dataset.feedbackState = 'shown';
      renderFeedback();
      slide.querySelector('.lz-hint').classList.add('visible');
    });
  });
  const modelSlide = document.getElementById('editorModelSlide');
  if (modelSlide) {
    let step = 0;
    modelSlide.querySelector('.reveal-model').addEventListener('click', () => {
      if (step < 5) step += 1;
      modelSlide.querySelectorAll(`[data-step="${step}"]`).forEach(x => x.classList.add('shown'));
    });
    modelSlide.addEventListener('show-answer', () => { step = 5; modelSlide.querySelectorAll('.lz-model-line').forEach(x => x.classList.add('shown')); });
  }
  const timer = document.getElementById('briefingTimer');
  if (timer) {
    let seconds = 600, id = null;
    const draw = () => timer.textContent = `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;
    document.getElementById('timerStart').addEventListener('click', () => { if (id) { clearInterval(id); id=null; return; } id=setInterval(()=>{ if(seconds>0){seconds-=1;draw();}else{clearInterval(id);id=null;} },1000); });
    document.getElementById('timerReset').addEventListener('click', () => { clearInterval(id);id=null;seconds=600;draw(); });
    draw();
  }
});
