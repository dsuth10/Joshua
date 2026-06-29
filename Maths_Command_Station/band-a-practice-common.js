/**
 * Shared Band A/B practice chrome (Phase 5.9 — Prep, Year 1 & Year 2 pages).
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

    /** Maps achievement year (0=Prep) to profile scoresByCat key. */
    catKeyForYear: function catKeyForYear(year) {
      if (year === 0) return 'scoresByCatF';
      return 'scoresByCatY' + year;
    },

    migrateLegacyContexts: function migrateLegacyContexts(profile) {
      if (!profile.solvedContexts) profile.solvedContexts = {};
      Object.keys(profile.solvedContexts).forEach(function (key) {
        if (key.indexOf('::') === -1) return;
        var parts = key.split('::');
        var desc = typeof normalizeDescriptorCode === 'function'
          ? normalizeDescriptorCode(parts[0])
          : parts[0].toUpperCase();
        var ctx = parts[1];
        if (!Array.isArray(profile.solvedContexts[desc])) {
          profile.solvedContexts[desc] = [];
        }
        if (profile.solvedContexts[desc].indexOf(ctx) === -1) {
          profile.solvedContexts[desc].push(ctx);
        }
        delete profile.solvedContexts[key];
      });
      if (typeof migrateDescriptorProfileKeys === 'function') {
        migrateDescriptorProfileKeys(profile);
      }
    },

    ensureDescriptorFields: function ensureDescriptorFields(profile) {
      if (!profile.scoresByDescriptor) profile.scoresByDescriptor = {};
      if (!profile.solvedContexts) profile.solvedContexts = {};
      if (!profile.consecutiveCorrect) profile.consecutiveCorrect = {};
      if (typeof migrateDescriptorProfileKeys === 'function') {
        migrateDescriptorProfileKeys(profile);
      }
      if (typeof DESCRIPTOR_BADGES === 'undefined') return;
      Object.keys(DESCRIPTOR_BADGES).forEach(function (key) {
        var code = typeof normalizeDescriptorCode === 'function'
          ? normalizeDescriptorCode(DESCRIPTOR_BADGES[key].code)
          : DESCRIPTOR_BADGES[key].code.toUpperCase();
        if (profile.scoresByDescriptor[code] === undefined) profile.scoresByDescriptor[code] = 0;
        if (!Array.isArray(profile.solvedContexts[code])) profile.solvedContexts[code] = [];
        if (profile.consecutiveCorrect[code] === undefined) profile.consecutiveCorrect[code] = 0;
      });
    },

    recalculateCategoryScores: function recalculateCategoryScores(profile, year) {
      if (typeof DESCRIPTOR_BADGES === 'undefined') return;
      var catKey = MCSBandA.catKeyForYear(year);
      MCSBandA.ensureCategoryScores(profile, catKey);
      var strands = Object.keys(DEFAULT_CATS);
      strands.forEach(function (strand) {
        var descriptors = Object.keys(DESCRIPTOR_BADGES).filter(function (key) {
          var desc = DESCRIPTOR_BADGES[key];
          return desc.year === year && desc.strand === strand;
        });
        var sum = 0;
        descriptors.forEach(function (descKey) {
          var code = typeof normalizeDescriptorCode === 'function'
            ? normalizeDescriptorCode(DESCRIPTOR_BADGES[descKey].code)
            : DESCRIPTOR_BADGES[descKey].code.toUpperCase();
          sum += profile.scoresByDescriptor[code] || 0;
        });
        profile[catKey][strand] = sum;
      });
    },

    recalculateLifetimeScore: function recalculateLifetimeScore(profile) {
      var total = 0;
      var strands = Object.keys(DEFAULT_CATS);
      var yearKeys = ['scoresByCatF', 'scoresByCatY1', 'scoresByCatY2', 'scoresByCatY3', 'scoresByCatY4', 'scoresByCatY5', 'scoresByCatY6'];
      yearKeys.forEach(function (key) {
        if (!profile[key]) return;
        strands.forEach(function (strand) {
          total += profile[key][strand] || 0;
        });
      });
      profile.score = total;
      profile.level = Math.floor(profile.score / 100) + 1;
    },

    gainPoints: function gainPoints(opts) {
      opts = opts || {};
      var profile = opts.profile;
      var pts = opts.pts || 10;
      var isCorrect = !!opts.isCorrect;
      var descriptor = opts.descriptor;
      var context = opts.context;
      var year = opts.year != null ? opts.year : 0;
      var sounds = opts.sounds;
      if (!profile || !descriptor) return false;

      MCSBandA.migrateLegacyContexts(profile);
      MCSBandA.ensureDescriptorFields(profile);

      var normalizedDesc = typeof normalizeDescriptorCode === 'function'
        ? normalizeDescriptorCode(descriptor)
        : descriptor.toUpperCase();
      if (profile.scoresByDescriptor[normalizedDesc] === undefined) {
        profile.scoresByDescriptor[normalizedDesc] = 0;
      }
      if (isCorrect) {
        profile.scoresByDescriptor[normalizedDesc] += pts;
      }

      if (isCorrect && context) {
        if (!Array.isArray(profile.solvedContexts[normalizedDesc])) {
          profile.solvedContexts[normalizedDesc] = [];
        }
        if (profile.solvedContexts[normalizedDesc].indexOf(context) === -1) {
          profile.solvedContexts[normalizedDesc].push(context);
        }
        profile.consecutiveCorrect[normalizedDesc] = (profile.consecutiveCorrect[normalizedDesc] || 0) + 1;
      } else if (!isCorrect) {
        profile.consecutiveCorrect[normalizedDesc] = 0;
      }

      MCSBandA.recalculateCategoryScores(profile, year);
      MCSBandA.recalculateLifetimeScore(profile);

      if (isCorrect) {
        profile.streak = (profile.streak || 0) + 1;
        profile.highestStreak = Math.max(profile.highestStreak || 0, profile.streak);
      } else {
        profile.streak = 0;
      }

      if (typeof DESCRIPTOR_BADGES === 'undefined') return false;

      var unlocked = false;
      var addBadge = function (id) {
        if (!profile.badges) profile.badges = [];
        if (profile.badges.indexOf(id) === -1) {
          profile.badges.push(id);
          return true;
        }
        return false;
      };

      if (profile.score > 0) addBadge('first-step');
      if (profile.streak >= 5) addBadge('streak-5');
      if (profile.streak >= 10) addBadge('streak-10');
      if (profile.streak >= 20) addBadge('streak-20');

      Object.keys(DESCRIPTOR_BADGES).forEach(function (descKey) {
        var desc = DESCRIPTOR_BADGES[descKey];
        var code = typeof normalizeDescriptorCode === 'function'
          ? normalizeDescriptorCode(desc.code)
          : desc.code.toUpperCase();
        var pointsReq = desc.requirements.points;
        var contextsReq = desc.requirements.contexts;
        var currentPoints = profile.scoresByDescriptor[code] || 0;
        var currentContexts = profile.solvedContexts[code] || [];
        if (currentPoints >= pointsReq && contextsReq.every(function (c) { return currentContexts.indexOf(c) !== -1; })) {
          if (addBadge(descKey)) {
            unlocked = true;
            if (sounds && typeof sounds.badgeUnlock === 'function') sounds.badgeUnlock();
          }
        }
      });

      Object.keys(GRAND_BADGES || {}).forEach(function (grandKey) {
        var gb = GRAND_BADGES[grandKey];
        var descriptors = Object.keys(DESCRIPTOR_BADGES).filter(function (key) {
          var desc = DESCRIPTOR_BADGES[key];
          return desc.year === gb.year && desc.strand === gb.strand;
        });
        if (descriptors.length > 0 && descriptors.every(function (key) { return profile.badges.indexOf(key) !== -1; })) {
          if (addBadge(grandKey)) {
            unlocked = true;
            if (sounds && typeof sounds.badgeUnlock === 'function') sounds.badgeUnlock();
          }
        }
      });

      if (typeof opts.saveProfile === 'function') opts.saveProfile();
      if (typeof opts.updateProfileUI === 'function') opts.updateProfileUI();
      if (typeof opts.renderBadgeShelf === 'function') {
        opts.renderBadgeShelf();
      } else if (opts.shelfId) {
        MCSBandA.renderBadgeShelf(profile, opts.shelfId, opts.shelfMax || 3);
      }

      return unlocked;
    },

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
