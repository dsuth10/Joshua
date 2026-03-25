// api.js — all server API calls
/* global sessionStorage */

const BASE = '';

function token() {
  return sessionStorage.getItem('vb_token') || '';
}

function headers(extra = {}) {
  return { 'Content-Type': 'application/json', 'x-session-token': token(), ...extra };
}

async function apiFetch(url, opts = {}) {
  const res = await fetch(BASE + url, opts);
  if (res.status === 401) {
    sessionStorage.clear();
    window.location.href = '/';
    return;
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body.error || res.statusText);
  }
  return res.json();
}

// Auth
function login(username, pin) {
  return apiFetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, pin }),
  });
}

function logout() {
  return apiFetch('/api/logout', { method: 'POST', headers: headers() }).finally(() => {
    sessionStorage.clear();
    window.location.href = '/';
  });
}

function getMe() {
  return apiFetch('/api/me', { headers: headers() });
}

// Profiles
function getProfiles() {
  return apiFetch('/api/profiles', { headers: headers() });
}

function createProfile(name, description, language) {
  return apiFetch('/api/profiles', {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ name, description, language }),
  });
}

function uploadSample(profileId, file, text) {
  const form = new FormData();
  form.append('audio', file);
  if (text) form.append('text', text);
  return fetch(`/api/profiles/${profileId}/samples`, {
    method: 'POST',
    headers: { 'x-session-token': token() },
    body: form,
  }).then(async r => {
    if (!r.ok) {
      const b = await r.json().catch(() => ({ error: r.statusText }));
      throw new Error(b.error || r.statusText);
    }
    return r.json();
  });
}

function getProfileSamples(profileId) {
  return apiFetch(`/api/profiles/${profileId}/samples`, { headers: headers() });
}

// Generate (returns jobId + position)
function generate(profileId, text, profileName) {
  return apiFetch('/api/generate', {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ profile_id: profileId, text, language: 'en', profile_name: profileName }),
  });
}

// Library
function getLibrary() {
  return apiFetch('/api/library', { headers: headers() });
}

function getAudioUrl(filename) {
  return `/api/library/${filename}`;
}

// Health
function getHealth() {
  return apiFetch('/api/health', { headers: headers() });
}
