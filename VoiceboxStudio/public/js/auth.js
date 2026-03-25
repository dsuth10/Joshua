// auth.js — session guard and login/logout helpers
/* global sessionStorage, window */

function requireLogin() {
  if (!sessionStorage.getItem('vb_token')) {
    window.location.href = '/';
  }
}

function getDisplayName() {
  return sessionStorage.getItem('vb_display') || 'Student';
}
