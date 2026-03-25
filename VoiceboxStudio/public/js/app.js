// app.js — bootstrap, routing, nav
/* global requireLogin, getDisplayName, logout, initVoicesView, initStudio, loadLibrary */

requireLogin();

// Set user display info
const displayName = getDisplayName();
const nameEl  = document.getElementById('user-name');
const avatarEl = document.getElementById('user-avatar');
if (nameEl)   nameEl.textContent  = displayName;
if (avatarEl) avatarEl.textContent = displayName.charAt(0).toUpperCase();

// Logout
document.getElementById('logout-btn').addEventListener('click', () => logout());

// ── View Router ────────────────────────────────────────────────────────
const VIEWS = ['voices', 'studio', 'library'];

function showView(name) {
  VIEWS.forEach(v => {
    const viewEl = document.getElementById(`view-${v}`);
    const navEl  = document.getElementById(`nav-${v}`);
    if (viewEl) viewEl.style.display = v === name ? '' : 'none';
    if (navEl)  navEl.classList.toggle('active', v === name);
  });

  // Lazy load data when switching to a view
  if (name === 'voices')  loadVoices();
  if (name === 'studio')  populateStudioDropdown(allProfiles);
  if (name === 'library') loadLibrary();
}

document.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('click', () => showView(btn.dataset.view));
});

// ── Init ───────────────────────────────────────────────────────────────
initVoicesView();
initStudio();

// Default view
showView('voices');
