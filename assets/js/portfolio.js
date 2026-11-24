/* portfolio.js: collage, lightbox, header reveal, project overview, licenses.
   Content comes from assets/js/content.js. */
(function () {
  var GALLERY = window.GALLERY || [];
  var PROJECTS = window.PROJECTS || [];
  var LICENSES = window.LICENSES || [];

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* =======================================================
     1. COLLAGE
     ======================================================= */
  var collage = document.querySelector('[data-collage]');
  if (collage) {
    collage.innerHTML = GALLERY.map(function (g, i) {
      var cls = 'tile ' + (g.featured ? 'tile-featured' : 'tile-' + (g.size || 'square')) + (g.invert ? ' tile-invert' : '');
      return (
        '<button type="button" class="' + cls + '" data-index="' + i + '" style="--d:' + (g.featured ? 0 : 120 + i * 70) + 'ms" aria-label="View image: ' + esc(g.alt) + '">' +
          '<img src="' + esc(g.src) + '" alt="' + esc(g.alt) + '"' + (i > 8 ? ' loading="lazy"' : '') + ' decoding="async">' +
        '</button>'
      );
    }).join('');
    collage.querySelectorAll('.tile').forEach(function (tile) {
      var img = tile.querySelector('img');
      var show = function () { tile.classList.add('is-loaded'); };
      if (img.complete) show(); else { img.addEventListener('load', show); img.addEventListener('error', show); }
    });
  }

  /* ---------- Lightbox (only on click) ---------- */
  var lb = document.querySelector('[data-lightbox]');
  if (lb && collage) {
    var lbImg = lb.querySelector('[data-lb-img]');
    var current = 0, lastFocus = null;
    var showAt = function (i) {
      current = (i + GALLERY.length) % GALLERY.length;
      var g = GALLERY[current];
      lbImg.src = g.src; lbImg.alt = g.alt;
      lbImg.classList.toggle('tile-invert', !!g.invert);
    };
    var open = function (i) {
      lastFocus = document.activeElement;
      showAt(i); lb.hidden = false; document.body.style.overflow = 'hidden';
      lb.querySelector('[data-lb-close]').focus();
    };
    var close = function () {
      lb.hidden = true; document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    };
    collage.addEventListener('click', function (e) {
      var t = e.target.closest('.tile');
      if (t) open(+t.getAttribute('data-index'));
    });
    lb.querySelector('[data-lb-close]').addEventListener('click', close);
    lb.querySelector('[data-lb-prev]').addEventListener('click', function () { showAt(current - 1); });
    lb.querySelector('[data-lb-next]').addEventListener('click', function () { showAt(current + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') showAt(current - 1);
      else if (e.key === 'ArrowRight') showAt(current + 1);
    });
  }

  /* ---------- Header: hidden over the collage ---------- */
  var header = document.querySelector('[data-header]');
  var intro = document.querySelector('[data-collage-section]');
  if (header && intro) {
    var onScroll = function () {
      var hide = window.scrollY < intro.offsetHeight - 120;
      header.classList.toggle('is-hidden', hide);
      if (hide) {
        var t = header.querySelector('[data-nav-toggle]');
        if (t && t.getAttribute('aria-expanded') === 'true') t.click();
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
  }

  /* =======================================================
     2. PROJECT OVERVIEW
     All projects side by side; click one and it slides over
     to fill the whole panel. "All projects" slides back.
     ======================================================= */
  var VISUALS = {
    reaper:
      '<div class="crest-wrap">' +
        '<img class="crest-scythe" src="assets/img/reaper-scythe.webp" alt="" aria-hidden="true">' +
        '<img class="crest" src="assets/img/reaper-logo.webp" alt="Reaper crest logo">' +
      '</div>',
    gambit: '<img class="gambit-logo" src="assets/img/gambit-4588g.webp" alt="Gambit 4588G logo">'
  };

  var showcase = document.querySelector('[data-showcase]');
  if (showcase) {
    showcase.innerHTML = PROJECTS.map(function (p, i) {
      var id = 'sc-' + i;
      return (
        '<article class="sc-panel theme-' + esc(p.theme) + '" data-panel aria-labelledby="' + id + '-t">' +
          '<button type="button" class="sc-hit" aria-expanded="false" aria-controls="' + id + '-d">' +
            '<span class="visually-hidden">Show ' + esc(p.title) + '</span></button>' +
          '<div class="sc-visual">' + (VISUALS[p.theme] || '') + '</div>' +
          '<div class="sc-body">' +
            '<h3 id="' + id + '-t">' + esc(p.title) + '</h3>' +
            '<div class="sc-details" id="' + id + '-d">' +
              '<p>' + esc(p.summary) + '</p>' +
              '<ul class="panel-tags">' + (p.tags || []).map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' +
              '<a class="panel-cta" href="' + esc(p.href) + '" tabindex="-1">' + esc(p.cta || 'Open') + ' <i aria-hidden="true">→</i></a>' +
            '</div>' +
          '</div>' +
          '<span class="sc-hint" aria-hidden="true">View <i>+</i></span>' +
          '<button type="button" class="sc-close" tabindex="-1">← All projects</button>' +
        '</article>'
      );
    }).join('');

    var panels = showcase.querySelectorAll('[data-panel]');
    var setOpen = function (panel) {
      showcase.classList.toggle('has-open', !!panel);
      panels.forEach(function (p) {
        var on = p === panel;
        p.classList.toggle('is-open', on);
        p.querySelector('.sc-hit').setAttribute('aria-expanded', String(on));
        p.querySelector('.sc-hit').tabIndex = panel ? -1 : 0;
        p.querySelector('.panel-cta').tabIndex = on ? 0 : -1;
        p.querySelector('.sc-close').tabIndex = on ? 0 : -1;
      });
    };
    panels.forEach(function (p) {
      p.querySelector('.sc-hit').addEventListener('click', function () {
        setOpen(p);
        setTimeout(function () { p.querySelector('.panel-cta').focus({ preventScroll: true }); }, 450);
      });
      p.querySelector('.sc-close').addEventListener('click', function () {
        setOpen(null);
        p.querySelector('.sc-hit').focus({ preventScroll: true });
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && showcase.classList.contains('has-open') && (!lb || lb.hidden)) {
        var open = showcase.querySelector('.is-open');
        setOpen(null);
        if (open) open.querySelector('.sc-hit').focus({ preventScroll: true });
      }
    });
  }

  /* =======================================================
     3. LICENSES
     ======================================================= */
  var ICONS = {
    // quadcopter: four rotors, arms and body
    drone: '<circle cx="5.5" cy="5.5" r="3"/><circle cx="18.5" cy="5.5" r="3"/><circle cx="5.5" cy="18.5" r="3"/><circle cx="18.5" cy="18.5" r="3"/><path d="M7.6 7.6 10 10M16.4 7.6 14 10M7.6 16.4 10 14M16.4 16.4 14 14"/><rect x="9.5" y="9.5" width="5" height="5" rx="1.2"/>',
    // hard hat
    hardhat: '<path d="M3 17h18"/><path d="M4.5 17v-2.5a7.5 7.5 0 0 1 15 0V17"/><path d="M10 8V5.5a2 2 0 0 1 4 0V8"/><path d="M12 9.5V13"/><path d="M2.5 19.5h19"/>',
    // chef hat
    chef: '<path d="M7 14.5a4 4 0 0 1-1.2-7.8 5 5 0 0 1 9.4-1.5A4 4 0 1 1 17 14.5"/><path d="M7 14.5V20h10v-5.5"/><path d="M7 17h10"/>',
    // wine glass
    glass: '<path d="M7 3h10l-.6 5.5a4.4 4.4 0 0 1-8.8 0z"/><path d="M7.4 7h9.2"/><path d="M12 13v7"/><path d="M8.5 21h7"/>'
  };
  // Picture icons (used when one exists; the SVGs above are the fallback)
  var ICON_IMAGES = {
    drone: 'assets/img/lic-drone.png',
    hardhat: 'assets/img/lic-hardhat.png',
    chef: 'assets/img/lic-chef.png',
    glass: 'assets/img/lic-bottle.png'
  };
  var licEl = document.querySelector('[data-licenses]');
  if (licEl) {
    licEl.innerHTML = LICENSES.map(function (l) {
      return (
        '<article class="license' + (l.tone === 'brown' ? ' tone-brown' : '') + '">' +
          '<div class="license-top">' +
            (ICON_IMAGES[l.icon]
              ? '<div class="license-icon has-img"><img src="' + ICON_IMAGES[l.icon] + '" alt="" aria-hidden="true" loading="lazy" decoding="async"></div>'
              : '<div class="license-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[l.icon] || ICONS.drone) + '</svg></div>') +
            (l.code ? '<span class="license-code">' + esc(l.code) + '</span>' : '') +
          '</div>' +
          '<div class="license-body">' +
            '<h4>' + esc(l.name) + '</h4>' +
            (l.issuer ? '<p class="license-issuer">' + esc(l.issuer) + '</p>' : '') +
            (l.detail ? '<p class="license-detail">' + esc(l.detail) + '</p>' : '') +
            (l.year ? '<span class="license-meta">' + esc(l.year) + '</span>' : '') +
          '</div>' +
        '</article>'
      );
    }).join('');
  }
})();
