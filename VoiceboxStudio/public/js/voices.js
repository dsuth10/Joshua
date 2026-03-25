// voices.js — voice profile management
/* global getProfiles, createProfile, uploadSample, getProfileSamples */

let allProfiles = [];

function renderVoiceCard(profile) {
  const card = document.createElement('div');
  card.className = 'voice-card';
  card.innerHTML = `
    <div class="voice-card-icon">🎤</div>
    <div class="voice-card-name">${escHtml(profile.name)}</div>
    <div class="voice-card-desc">${escHtml(profile.description || 'No description')}</div>
    <span class="voice-card-lang">${escHtml(profile.language || 'en')}</span>
    <div class="voice-card-samples" id="samples-${profile.id}">Loading samples…</div>
  `;
  loadSampleCount(profile.id);
  return card;
}

async function loadSampleCount(profileId) {
  try {
    const samples = await getProfileSamples(profileId);
    const el = document.getElementById(`samples-${profileId}`);
    if (el) el.textContent = `${samples.length || 0} sample(s) uploaded`;
  } catch { /* silent */ }
}

async function loadVoices() {
  const listEl = document.getElementById('voices-list');
  const emptyEl = document.getElementById('voices-empty');
  if (!listEl) return;

  listEl.innerHTML = '';
  try {
    allProfiles = await getProfiles();
    populateStudioDropdown(allProfiles);

    if (!allProfiles.length) {
      listEl.appendChild(emptyEl);
      emptyEl.style.display = '';
      return;
    }
    emptyEl.style.display = 'none';

    allProfiles.forEach(p => listEl.appendChild(renderVoiceCard(p)));
  } catch (e) {
    listEl.innerHTML = `<p style="color:var(--danger);padding:1rem;">Failed to load voices: ${e.message}</p>`;
  }
}

function populateStudioDropdown(profiles) {
  const sel = document.getElementById('studio-profile');
  if (!sel) return;
  sel.innerHTML = '<option value="">— Choose a voice —</option>';
  profiles.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = p.name;
    opt.dataset.name = p.name;
    sel.appendChild(opt);
  });
}

function initVoicesView() {
  const newBtn        = document.getElementById('btn-new-voice');
  const panel         = document.getElementById('create-voice-panel');
  const cancelBtn     = document.getElementById('cancel-voice-btn');
  const form          = document.getElementById('create-voice-form');
  const pickBtn       = document.getElementById('audio-pick-btn');
  const fileInput     = document.getElementById('audio-file');
  const selectedName  = document.getElementById('file-selected-name');
  const errEl         = document.getElementById('create-voice-error');

  newBtn.addEventListener('click', () => {
    panel.style.display = '';
    newBtn.style.display = 'none';
  });

  cancelBtn.addEventListener('click', () => {
    panel.style.display = 'none';
    newBtn.style.display = '';
    form.reset();
    selectedName.style.display = 'none';
    errEl.style.display = 'none';
  });

  pickBtn.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', () => {
    if (fileInput.files[0]) {
      selectedName.textContent = `✓ ${fileInput.files[0].name}`;
      selectedName.style.display = '';
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const saveBtn = document.getElementById('save-voice-btn');
    errEl.style.display = 'none';
    saveBtn.disabled = true;
    saveBtn.textContent = 'Creating…';

    try {
      const name = document.getElementById('voice-name').value.trim();
      const desc = document.getElementById('voice-desc').value.trim();
      const lang = document.getElementById('voice-lang').value;
      const file = fileInput.files[0];
      const transcript = document.getElementById('audio-transcript').value.trim();

      if (!file) throw new Error('Please choose an audio file.');

      const profile = await createProfile(name, desc, lang);
      await uploadSample(profile.id || profile.profile_id, file, transcript);

      form.reset();
      selectedName.style.display = 'none';
      panel.style.display = 'none';
      newBtn.style.display = '';
      await loadVoices();
    } catch (err) {
      errEl.textContent = err.message;
      errEl.style.display = '';
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = 'Create Voice';
    }
  });

  loadVoices();
}

function escHtml(str) {
  return String(str).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}
