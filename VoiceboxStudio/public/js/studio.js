// studio.js — text-to-speech generation + queue management
/* global generate, getHealth, getAudioUrl */

let currentJobId = null;
let currentFilename = null;
let eventSource = null;
let generatedAudioUrl = null;

function initStudio() {
  const generateBtn  = document.getElementById('generate-btn');
  const textArea     = document.getElementById('studio-text');
  const charCount    = document.getElementById('char-count');
  const saveBtn      = document.getElementById('save-to-library-btn');
  const downloadBtn  = document.getElementById('download-btn');
  const errEl        = document.getElementById('studio-error');

  // Char counter
  textArea.addEventListener('input', () => {
    charCount.textContent = textArea.value.length;
  });

  // Health badge
  checkHealth();
  setInterval(checkHealth, 15000);

  // Generate
  generateBtn.addEventListener('click', async () => {
    errEl.style.display = 'none';
    const profileSel = document.getElementById('studio-profile');
    const profileId  = profileSel.value;
    const profileName = profileSel.options[profileSel.selectedIndex]?.dataset?.name || '';
    const text = textArea.value.trim();

    if (!profileId) { showErr(errEl, 'Please select a voice first.'); return; }
    if (!text) { showErr(errEl, 'Please enter some text.'); return; }

    generateBtn.disabled = true;
    hideResult();
    showQueue('Joining the queue…', 0);

    try {
      const { jobId, position } = await generate(profileId, text, profileName);
      currentJobId = jobId;

      if (position === 1) {
        updateQueue('Generating your speech…', 75, '⚙️');
      } else {
        updateQueue(`You are #${position} in the queue`, 20, '⏳');
      }

      listenForEvents(jobId, text, profileName);
    } catch (err) {
      hideQueue();
      showErr(errEl, err.message);
      generateBtn.disabled = false;
    }
  });

  // Save to library button — audio already saved server-side, just show confirmation
  saveBtn.addEventListener('click', () => {
    const successEl = document.getElementById('save-success');
    successEl.style.display = '';
    saveBtn.disabled = true;
    saveBtn.textContent = '✓ Saved';
  });
}

function listenForEvents(jobId, text, profileName) {
  if (eventSource) eventSource.close();

  const token = sessionStorage.getItem('vb_token');
  eventSource = new EventSource(`/api/generate/${jobId}/events?token=${encodeURIComponent(token)}`);

  // The server uses the x-session-token header; for SSE we pass it as query param
  // (server must accept it — handled by token() in middleware if we patch it, see note)

  eventSource.onmessage = (e) => {
    const data = JSON.parse(e.data);

    if (data.status === 'queued') {
      updateQueue(`You are #${data.position} in the queue (${data.total} total)`, (1 / data.total) * 100 * (data.total - data.position + 1), '⏳');
    } else if (data.status === 'generating') {
      updateQueue('Generating your speech…', 80, '⚙️');
    } else if (data.status === 'complete') {
      hideQueue();
      currentFilename = data.filename;
      showResultPanel(data.filename);
      eventSource.close();
      document.getElementById('generate-btn').disabled = false;
    } else if (data.status === 'error') {
      hideQueue();
      const errEl = document.getElementById('studio-error');
      showErr(errEl, data.message || 'Generation failed. Please try again.');
      eventSource.close();
      document.getElementById('generate-btn').disabled = false;
    }
  };

  eventSource.onerror = () => {
    // SSE disconnection — if result already shown, ignore
    if (currentFilename) return;
    eventSource.close();
  };
}

function showResultPanel(filename) {
  const panel     = document.getElementById('result-panel');
  const audioEl   = document.getElementById('result-audio');
  const dlBtn     = document.getElementById('download-btn');
  const saveSucc  = document.getElementById('save-success');
  const saveBtn   = document.getElementById('save-to-library-btn');

  const url = getAudioUrl(filename);
  audioEl.src = url;
  dlBtn.href = url;
  dlBtn.download = filename;
  saveSucc.style.display = 'none';
  saveBtn.disabled = false;
  saveBtn.textContent = '💾 Save to My Library';

  panel.style.display = '';
}

function hideResult() {
  document.getElementById('result-panel').style.display = 'none';
  currentFilename = null;
}

function showQueue(msg, pct, icon = '⏳') {
  const panel = document.getElementById('queue-panel');
  panel.style.display = '';
  document.getElementById('queue-status-text').textContent = msg;
  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('queue-icon').textContent = icon;
}

function updateQueue(msg, pct, icon) {
  document.getElementById('queue-status-text').textContent = msg;
  document.getElementById('progress-fill').style.width = pct + '%';
  if (icon) document.getElementById('queue-icon').textContent = icon;
}

function hideQueue() {
  document.getElementById('queue-panel').style.display = 'none';
}

function showErr(el, msg) {
  el.textContent = msg;
  el.style.display = '';
}

async function checkHealth() {
  const badge = document.getElementById('health-badge');
  if (!badge) return;
  try {
    const h = await getHealth();
    if (h.status === 'voicebox_offline') {
      badge.textContent = '● Voicebox Offline';
      badge.className = 'health-badge offline';
    } else {
      const queue = h.queueLength || 0;
      badge.textContent = queue > 0 ? `● Online — ${queue} in queue` : '● Online';
      badge.className = 'health-badge online';
    }
  } catch {
    badge.textContent = '● Cannot connect';
    badge.className = 'health-badge offline';
  }
}
