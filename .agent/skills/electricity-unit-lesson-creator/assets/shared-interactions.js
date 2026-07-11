/**
 * Science interaction helpers for electricity unit presentations.
 * Include via extraScripts in build_presentation.mjs
 */

function initSourceFormSorter(slideEl, options = {}) {
  const deck = slideEl.querySelector('.sort-deck');
  if (!deck) return;

  const hintBox = slideEl.querySelector('.hint-box');
  const hintText = options.hint || 'Hint: A source is where it comes from. A form is what it looks or feels like.';
  let selectedCard = null;
  let errors = 0;

  function getVisibleCards() {
    const pathway = document.body.classList.contains('lucas-active') ? '.lucas-only' : '.standard-only';
    const branch = slideEl.querySelector(pathway) || slideEl;
    return branch.querySelectorAll('.sort-card:not(.correct-placed)');
  }

  function getVisibleZones() {
    const pathway = document.body.classList.contains('lucas-active') ? '.lucas-only' : '.standard-only';
    const branch = slideEl.querySelector(pathway) || slideEl;
    return branch.querySelectorAll('.sort-zone');
  }

  function placeCorrect(card) {
    const cat = card.dataset.cat;
    const suffix = document.body.classList.contains('lucas-active') ? 'lucas' : 'std';
    const branch = slideEl.querySelector(document.body.classList.contains('lucas-active') ? '.lucas-only' : '.standard-only');
    const zone = branch?.querySelector(`[data-cat="${cat}"]`) || slideEl.querySelector(`#zone-${cat}-${suffix}`);
    if (zone) {
      zone.appendChild(card);
      card.classList.add('correct-placed');
      card.classList.remove('selected');
    }
  }

  function bindCards() {
    getVisibleCards().forEach((card) => {
      card.onclick = () => {
        if (card.classList.contains('correct-placed')) return;
        getVisibleCards().forEach((c) => c.classList.remove('selected'));
        card.classList.add('selected');
        selectedCard = card;
        getVisibleZones().forEach((z) => z.classList.add('active-target'));
      };
    });

    getVisibleZones().forEach((zone) => {
      zone.onclick = () => {
        if (!selectedCard) return;
        const targetCat = zone.dataset.cat || zone.id.replace(/^zone-(source|form)(-std|-lucas)?$/, '$1');
        if (selectedCard.dataset.cat === targetCat) {
          zone.appendChild(selectedCard);
          selectedCard.classList.add('correct-placed');
          selectedCard.classList.remove('selected');
          selectedCard = null;
          errors = 0;
          if (hintBox) hintBox.textContent = '';
          getVisibleZones().forEach((z) => z.classList.remove('active-target'));
        } else {
          errors++;
          selectedCard.classList.add('incorrect');
          selectedCard.style.animation = 'shake 0.4s ease-in-out';
          setTimeout(() => {
            selectedCard.classList.remove('incorrect');
            selectedCard.style.animation = '';
          }, 400);
          if (errors >= 2 && hintBox) {
            hintBox.textContent = hintText;
            hintBox.style.display = 'block';
          }
        }
      };
    });
  }

  function showAllAnswers() {
    slideEl.querySelectorAll('.sort-card').forEach((card) => {
      if (!card.classList.contains('correct-placed')) placeCorrect(card);
    });
    if (hintBox) {
      hintBox.textContent = 'Teacher override applied.';
      hintBox.style.display = 'block';
    }
  }

  slideEl.addEventListener('show-answer', showAllAnswers);
  bindCards();

  document.getElementById('pathwayToggleBtn')?.addEventListener('change', () => {
    selectedCard = null;
    errors = 0;
    setTimeout(bindCards, 50);
  });
}

window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-interaction="source-form-sorter"]').forEach((slide) => {
    initSourceFormSorter(slide);
  });
});
