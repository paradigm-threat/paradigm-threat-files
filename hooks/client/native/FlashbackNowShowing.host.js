/**
 * Fill `[data-pt-flashback-ssr]` on the PT home page after paint.
 * Soft-hydrate keeps the SSR shell; this host fetches Flashback index.json
 * (CORS *) and writes the live Now showing list (CleverScript islands do not
 * swap this marker the way ChangeLog does).
 */
(function (global) {
  'use strict';

  var INDEX_URL = 'https://flashbackrepository.org/index.json';
  var ORIGIN = 'https://flashbackrepository.org';
  var STYLE_ID = 'pt-flashback-now-host-css';

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function titleFromSlug(slug) {
    var s = typeof slug === 'string' ? slug : '';
    if (s.length === 0) return 'Untitled';
    var parts = s.split('-');
    var out = [];
    for (var i = 0; i < parts.length; i++) {
      var w = parts[i];
      if (w.length === 0) continue;
      out.push(w.charAt(0).toUpperCase() + w.slice(1));
    }
    return out.join(' ');
  }

  function ensureCss() {
    try {
      var doc = global.document;
      if (!doc || doc.getElementById(STYLE_ID)) return;
      var st = doc.createElement('style');
      st.id = STYLE_ID;
      st.textContent =
        '.pt-flashback-now{margin:1.25rem 0 1.75rem;padding:1rem 1.1rem;border-radius:0.5rem;' +
        'border:1px solid #e2e8f0;background:#ffffff;box-sizing:border-box;}' +
        '.pt-flashback-now-head{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;' +
        'gap:0.5rem 1rem;margin:0 0 0.75rem;}' +
        '.pt-flashback-now-title{margin:0;font-size:1.05rem;font-weight:700;}' +
        '.pt-flashback-now-more{font-size:0.875rem;font-weight:600;}' +
        '.pt-flashback-now-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0.35rem;}' +
        '.pt-flashback-now-item{margin:0;font-size:0.95rem;line-height:1.4;}' +
        '.pt-flashback-now-item a{text-decoration:underline;text-underline-offset:2px;}' +
        '.pt-flashback-now-status{margin:0;font-size:0.875rem;}' +
        '@media (prefers-color-scheme: dark){' +
        '.pt-flashback-now{border-color:#1e293b;background:#020817;}' +
        '}' +
        'html.dark .pt-flashback-now{border-color:#1e293b;background:#020817;}' +
        'html.light .pt-flashback-now{border-color:#e2e8f0;background:#ffffff;}';
      (doc.head || doc.documentElement).appendChild(st);
    } catch (_) {}
  }

  function render(el, items, err) {
    if (!el) return;
    ensureCss();
    var head =
      '<div class="pt-flashback-now-head">' +
      '<h3 class="pt-flashback-now-title">Now showing</h3>' +
      '<a class="pt-flashback-now-more" href="' +
      esc(ORIGIN + '/') +
      '" target="_blank" rel="noopener noreferrer">Flashback Repository -&gt;</a>' +
      '</div>';
    var body = '';
    if (err === true) {
      body =
        '<p class="pt-muted pt-flashback-now-status">Could not load the live list. ' +
        '<a href="' +
        esc(ORIGIN + '/') +
        '" target="_blank" rel="noopener noreferrer">Open Flashback Repository</a>.</p>';
    } else if (!items || items.length === 0) {
      body =
        '<p class="pt-muted pt-flashback-now-status">Nothing listed as Now showing right now — browse the ' +
        '<a href="' +
        esc(ORIGIN + '/') +
        '" target="_blank" rel="noopener noreferrer">full library</a>.</p>';
    } else {
      var rows = [];
      for (var i = 0; i < items.length; i++) {
        var it = items[i];
        rows.push(
          '<li class="pt-flashback-now-item"><a href="' +
            esc(it.href) +
            '" target="_blank" rel="noopener noreferrer">' +
            esc(it.title) +
            '</a></li>',
        );
      }
      body =
        '<ul class="pt-flashback-now-list" aria-label="Now showing titles">' +
        rows.join('') +
        '</ul>';
    }
    el.innerHTML = head + body;
    el.removeAttribute('data-pt-flashback-ssr');
    el.setAttribute('data-pt-flashback-filled', '1');
  }

  function buildItems(json) {
    var slugs = json && Array.isArray(json.nowShowing) ? json.nowShowing : [];
    var projects = json && Array.isArray(json.projects) ? json.projects : [];
    var bySlug = {};
    for (var i = 0; i < projects.length; i++) {
      var p = projects[i];
      if (p && typeof p.slug === 'string') bySlug[p.slug] = p;
    }
    var items = [];
    for (var j = 0; j < slugs.length; j++) {
      var slug = slugs[j];
      if (typeof slug !== 'string' || slug.length === 0) continue;
      var proj = bySlug[slug];
      var title = titleFromSlug(slug);
      if (proj && typeof proj.title === 'string' && proj.title.length > 0) {
        title = proj.title;
      }
      items.push({ slug: slug, title: title, href: ORIGIN + '/' + slug });
    }
    return items;
  }

  function fill() {
    try {
      if (!global.fetch || !global.document) return;
      var nodes = global.document.querySelectorAll(
        '[data-pt-flashback-ssr]:not([data-pt-flashback-filled="1"])',
      );
      if (!nodes.length) return;
      global
        .fetch(INDEX_URL, { credentials: 'omit', cache: 'default' })
        .then(function (r) {
          if (!r || r.ok !== true) return null;
          return r.json();
        })
        .then(function (json) {
          var items = json ? buildItems(json) : null;
          var err = json ? false : true;
          for (var i = 0; i < nodes.length; i++) {
            render(nodes[i], items || [], err);
          }
        })
        .catch(function () {
          for (var i = 0; i < nodes.length; i++) {
            render(nodes[i], [], true);
          }
        });
    } catch (_) {}
  }

  function boot() {
    fill();
    var n = 0;
    var t = global.setInterval(function () {
      fill();
      n += 1;
      if (n > 40) global.clearInterval(t);
    }, 250);
    var sched = global.__fbScheduleParkNativeReupgrade;
    if (typeof sched === 'function') {
      sched(fill);
    }
  }

  if (typeof global.document !== 'undefined') {
    if (global.document.readyState === 'loading') {
      global.document.addEventListener('DOMContentLoaded', boot);
    } else {
      boot();
    }
  }
})(typeof globalThis !== 'undefined' ? globalThis : window);
