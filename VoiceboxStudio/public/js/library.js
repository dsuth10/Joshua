// library.js — student audio library
/* global getLibrary, getAudioUrl */

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch { return iso; }
}

function renderLibraryCard(item) {
  const card = document.createElement('div');
  card.className = 'library-card';
  const url = getAudioUrl(item.filename);
  card.innerHTML = `
    <div class="library-card-meta">
      <strong style="color:var(--accent)">${escHtml(item.profileName || 'Unknown Voice')}</strong>
      &nbsp;·&nbsp; ${formatDate(item.createdAt)}
    </div>
    <div class="library-card-text">"${escHtml(item.text)}"</div>
    <audio controls src="${url}" style="width:100%;margin-top:0.25rem;"></audio>
    <a href="${url}" download="${escHtml(item.filename)}" class="btn btn-ghost btn-sm" style="align-self:flex-start;">⬇ Download</a>
  `;
  return card;
}

async function loadLibrary() {
  const listEl  = document.getElementById('library-list');
  const emptyEl = document.getElementById('library-empty');
  if (!listEl) return;

  listEl.innerHTML = '';
  try {
    const items = await getLibrary();
    if (!items.length) {
      listEl.appendChild(emptyEl);
      emptyEl.style.display = '';
      return;
    }
    emptyEl.style.display = 'none';
    items.forEach(item => listEl.appendChild(renderLibraryCard(item)));
  } catch (e) {
    listEl.innerHTML = `<p style="color:var(--danger);padding:1rem;">Failed to load library: ${e.message}</p>`;
  }
}

function escHtml(str) {
  return String(str).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}
