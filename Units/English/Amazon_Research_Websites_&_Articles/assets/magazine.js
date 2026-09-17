/* Amazon Field Guide — highlight current section in the contents rail */
(function () {
  var links = document.querySelectorAll(".contents-rail a[href^='#']");
  if (!links.length) return;

  var sections = [];
  for (var i = 0; i < links.length; i++) {
    var id = links[i].getAttribute("href").slice(1);
    var el = document.getElementById(id);
    if (el) sections.push({ id: id, el: el, link: links[i] });
  }
  if (!sections.length) return;

  function setActive() {
    var y = window.scrollY + 120;
    var current = sections[0];
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].el.offsetTop <= y) current = sections[i];
    }
    for (var j = 0; j < sections.length; j++) {
      sections[j].link.classList.toggle("is-active", sections[j] === current);
    }
  }

  window.addEventListener("scroll", setActive, { passive: true });
  setActive();
})();
