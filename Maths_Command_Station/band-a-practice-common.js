/**
 * Shared Band A practice chrome (Phase 5.9 — Prep & Year 1 pages).
 * Badge shelf, strand tab colours, adult console toggle.
 */
(function (global) {
  'use strict';

  var DEFAULT_CATS = {
    number: 0,
    algebra: 0,
    measurement: 0,
    space: 0,
    statistics: 0,
    probability: 0,
  };

  function resolveBadgeEmoji(key) {
    if (typeof GLOBAL_BADGES !== 'undefined' && GLOBAL_BADGES[key]) {
      return GLOBAL_BADGES[key].emoji;
    }
    if (typeof DESCRIPTOR_BADGES !== 'undefined' && DESCRIPTOR_BADGES[key]) {
      return DESCRIPTOR_BADGES[key].emoji;
    }
    if (typeof GRAND_BADGES !== 'undefined' && GRAND_BADGES[key]) {
      return GRAND_BADGES[key].emoji;
    }
    return '🏅';
  }

  function resolveBadgeColour(key) {
    if (typeof DESCRIPTOR_BADGES !== 'undefined' && DESCRIPTOR_BADGES[key]) {
      var strand = DESCRIPTOR_BADGES[key].strand;
      if (typeof STRAND_THEMES !== 'undefined' && STRAND_THEMES[strand]) {
        return STRAND_THEMES[strand].colour;
      }
    }
    return 'var(--primary)';
  }

  var MCSBandA = {
    DEFAULT_CATS: DEFAULT_CATS,

    ensureCategoryScores: function ensureCategoryScores(profile, catKey) {
      if (!profile[catKey]) {
        profile[catKey] = Object.assign({}, DEFAULT_CATS);
      }
      return profile[catKey];
    },

    renderBadgeShelf: function renderBadgeShelf(profile, containerId, maxCount) {
      var shelf = document.getElementById(containerId);
      if (!shelf) return;
      shelf.innerHTML = '';
      shelf.classList.add('band-a-badge-shelf');
      var badges = (profile.badges || []).slice(-(maxCount || 3));
      if (!badges.length) {
        var empty = document.createElement('div');
        empty.className = 'band-a-badge-empty';
        empty.textContent = '—';
        empty.setAttribute('aria-hidden', 'true');
        shelf.appendChild(empty);
        return;
      }
      badges.forEach(function (key) {
        var el = document.createElement('div');
        el.className = 'badge-item unlocked band-a-badge-icon';
        el.textContent = resolveBadgeEmoji(key);
        el.style.borderColor = resolveBadgeColour(key);
        el.setAttribute('title', key);
        el.setAttribute('aria-label', 'Badge earned');
        shelf.appendChild(el);
      });
    },

    applyStrandTabs: function applyStrandTabs(root) {
      var host = root || document;
      if (typeof STRAND_THEMES === 'undefined') return;
      host.querySelectorAll('.selector-tab[data-strand]').forEach(function (tab) {
        var strand = tab.getAttribute('data-strand');
        var theme = STRAND_THEMES[strand];
        if (theme && theme.colour) {
          tab.style.setProperty('--strand-tab-colour', theme.colour);
        }
      });
    },

    initAdultConsole: function initAdultConsole(options) {
      options = options || {};
      var toggle = document.getElementById(options.toggleId || 'btn-adult-console');
      var panel = document.getElementById(options.panelId || 'band-a-adult-console');
      var summaryEl = document.getElementById(options.summaryId || 'adult-console-summary');
      if (!toggle || !panel) return;

      function refreshSummary() {
        if (!summaryEl || typeof options.getSummary !== 'function') return;
        summaryEl.textContent = options.getSummary();
      }

      toggle.addEventListener('click', function () {
        var open = panel.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (open) refreshSummary();
      });

      return { refresh: refreshSummary };
    },

    showEmptyStrand: function showEmptyStrand(mountEl, message) {
      if (!mountEl) return;
      mountEl.innerHTML =
        '<div class="band-a-empty-strand" role="status">' +
        '<p class="band-a-empty-strand-title">Coming soon</p>' +
        '<p class="band-a-empty-strand-body">' +
        (message || 'New missions arrive in the next update.') +
        '</p></div>';
    },
  };

  global.MCSBandA = MCSBandA;
})(window);
