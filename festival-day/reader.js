(() => {
  const cfg = window.FestivalConfig?.reader;
  const audio = document.querySelector("#reader-audio");
  const cache = new Map();
  let activeBtn = null;

  function enabled() {
    return Boolean(cfg?.enabled && cfg.profileId && audio);
  }

  function baseUrl() {
    return String(cfg.voiceboxUrl || "/voicebox").replace(/\/$/, "");
  }

  function bar(targetId) {
    if (!enabled()) return "";
    return `<div class="listen-bar"><button type="button" class="secondary listen" data-listen-for="${targetId}">Listen</button><span class="small listen-status" hidden></span></div>`;
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

  function textFor(btn) {
    const el = document.getElementById(btn.dataset.listenFor);
    return (el?.innerText || "").replace(/\s+/g, " ").trim();
  }

  async function waitFor(id) {
    for (let i = 0; i < 180; i += 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const res = await fetch(`${baseUrl()}/history/${id}`);
      if (!res.ok) continue;
      const job = await res.json();
      if (job.status === "completed") return `${baseUrl()}/audio/${id}`;
      if (job.status === "failed" || job.error) throw new Error(job.error || "That reading could not be finished.");
    }
    throw new Error("That reading is taking too long. Try a shorter section.");
  }

  async function audioUrlFor(text) {
    if (cache.has(text)) return cache.get(text);
    const res = await fetch(`${baseUrl()}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        profile_id: cfg.profileId,
        text,
        language: "en",
        engine: cfg.engine || "qwen",
        model_size: cfg.modelSize || "0.6B"
      })
    });
    if (!res.ok) throw new Error("Voicebox did not accept that reading. Check that the voice server is running.");
    const job = await res.json();
    const url = job.status === "completed" && job.id
      ? `${baseUrl()}/audio/${job.id}`
      : await waitFor(job.id);
    cache.set(text, url);
    return url;
  }

  async function playFrom(btn) {
    const text = textFor(btn);
    if (!text) return;
    if (activeBtn === btn && !audio.paused) {
      audio.pause();
      resetBtn(btn);
      activeBtn = null;
      return;
    }
    audio.pause();
    resetBtn(activeBtn);
    activeBtn = btn;
    btn.textContent = "Stop";
    btn.setAttribute("aria-busy", "true");
    setStatus(btn, "Preparing Doug's voice…");
    try {
      const url = await audioUrlFor(text);
      if (activeBtn !== btn) return;
      audio.src = url;
      setStatus(btn, "Reading…");
      await audio.play();
    } catch (err) {
      resetBtn(btn);
      setStatus(btn, err.message || "Could not start the reader.");
      activeBtn = null;
    }
  }

  audio?.addEventListener("ended", () => {
    resetBtn(activeBtn);
    activeBtn = null;
  });

  window.FestivalReader = {
    bar,
    bind(root = document) {
      if (!enabled()) return;
      root.querySelectorAll("[data-listen-for]").forEach(btn => {
        if (btn.dataset.bound) return;
        btn.dataset.bound = "1";
        btn.addEventListener("click", () => playFrom(btn));
      });
    }
  };
})();
