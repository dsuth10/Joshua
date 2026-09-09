(() => {
  const cfg = window.FestivalConfig?.reader;
  const audio = document.querySelector("#reader-audio");
  let activeBtn = null;

  function enabled() {
    return Boolean(cfg?.enabled !== false && audio);
  }

  function bar(missionId, clipKey) {
    if (!enabled()) return "";
    return `<div class="listen-bar"><button type="button" class="secondary listen" data-mission="${missionId}" data-clip="${clipKey}" data-listen-for="${clipKey}">Listen</button><span class="small listen-status" hidden></span></div>`;
  }

  function setStatus(btn, text) {
    const status = btn.parentElement?.querySelector(".listen-status");
    if (status) {
      status.hidden = !text;
      status.textContent = text || "";
    }
  }

  function resetBtn(btn) {
    if (!btn) return;
    btn.textContent = "Listen";
    btn.removeAttribute("aria-busy");
    setStatus(btn, "");
  }

  function audioPathFor(btn) {
    const missionId = btn.dataset.mission;
    const clipKey = btn.dataset.clip || btn.dataset.listenFor;
    if (!missionId || !clipKey) return "";
    const base = String(cfg?.audioBasePath || "./audio/").replace(/\/?$/, "/");
    return `${base}${missionId}/${clipKey}.mp3`;
  }

  async function playFrom(btn) {
    if (activeBtn === btn && (btn.textContent === "Stop" || !audio.paused)) {
      audio.pause();
      resetBtn(btn);
      activeBtn = null;
      return;
    }
    const src = audioPathFor(btn);
    if (!src) {
      setStatus(btn, "This reading has no audio file.");
      return;
    }
    audio.pause();
    resetBtn(activeBtn);
    activeBtn = btn;
    btn.textContent = "Stop";
    btn.setAttribute("aria-busy", "true");
    setStatus(btn, "Reading…");
    try {
      audio.src = src;
      await audio.play();
      if (activeBtn !== btn) return;
      setStatus(btn, "Reading…");
    } catch (err) {
      if (activeBtn !== btn) return;
      resetBtn(btn);
      const missing = /no supported source|failed to load|not supported|NotSupportedError/i.test(String(err?.name || err?.message || ""));
      setStatus(btn, missing
        ? "Audio file is missing for this section."
        : (err.message || "Could not start the reader."));
      activeBtn = null;
    }
  }

  audio?.addEventListener("ended", () => {
    resetBtn(activeBtn);
    activeBtn = null;
  });

  audio?.addEventListener("error", () => {
    if (!activeBtn) return;
    const expected = audioPathFor(activeBtn);
    const current = audio.currentSrc || audio.src || "";
    if (expected && current && !current.endsWith(expected.replace(/^\.\//, "")) && !current.includes(expected.replace(/^\.\//, ""))) {
      return;
    }
    setStatus(activeBtn, "Audio file is missing for this section.");
    resetBtn(activeBtn);
    activeBtn = null;
  });

  window.FestivalReader = {
    bar,
    bind(root = document) {
      if (!enabled()) return;
      root.querySelectorAll("[data-clip], [data-listen-for]").forEach(btn => {
        if (btn.dataset.bound) return;
        btn.dataset.bound = "1";
        btn.addEventListener("click", () => playFrom(btn));
      });
    }
  };
})();
