(() => {
  const setupChoice = (slide, selector, correct) => {
    if (!slide) return;
    const buttons=[...slide.querySelectorAll(selector)], feedback=slide.querySelector('.interactive-feedback'), hint=slide.querySelector('.hint-box'); let errors=0;
    const reveal=()=>{buttons.forEach(b=>b.classList.toggle('correct',b.dataset.kind===correct||b.dataset.job===correct));feedback.textContent='The strong choice makes an action and position clear. Explain which words do that.';hint?.classList.remove('show');};
    buttons.forEach(button=>button.addEventListener('click',()=>{const value=button.dataset.kind||button.dataset.job;if(value===correct){reveal();return;}errors++;button.classList.add('incorrect');feedback.textContent=errors===1?'Retry: use the criteria, not a guess.':'Look for the action, audience and position.';if(errors>=2)hint?.classList.add('show');}));
    slide.addEventListener('show-answer',reveal);
  };
  setupChoice(document.getElementById('proposalSlide'),'.shade-choice','claim');
  setupChoice(document.getElementById('jobsSlide'),'.shade-choice','thesis');
})();
