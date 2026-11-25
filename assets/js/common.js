/* common.js — small helpers shared by every page. No dependencies. */
(function () {
  document.documentElement.classList.add('js');

  // Intro on/off: <button data-intro-toggle="storageKey">. Off is stored as '1'; on by default.
  document.querySelectorAll('[data-intro-toggle]').forEach(function (btn) {
    if (btn.hasAttribute('data-intro-bound')) return;   // both common.js and reaper.js run on Reaper pages
    btn.setAttribute('data-intro-bound', '');
    var key = btn.getAttribute('data-intro-toggle');
    function isOff() { try { return !!localStorage.getItem(key); } catch (e) { return false; } }
    function paint() {
      var off = isOff();
      btn.classList.toggle('is-off', off);
      btn.setAttribute('aria-pressed', String(!off));
      var label = off ? 'Intro animation: off (click to turn on)' : 'Intro animation: on (click to turn off)';
      btn.setAttribute('title', label);
      btn.setAttribute('aria-label', label);
      var txt = btn.querySelector('[data-intro-label]');
      if (txt) txt.textContent = off ? 'Intro off' : 'Intro on';
    }
    btn.addEventListener('click', function () {
      var turningOn = isOff();
      try { if (turningOn) localStorage.removeItem(key); else localStorage.setItem(key, '1'); } catch (e) { /* storage blocked */ }
      paint();
      // Turning it back on plays the intro right away so you can see it.
      if (turningOn && window.siteIntro && window.siteIntro.key === key) window.siteIntro.play();
    });
    paint();
  });

  // Mobile nav toggle: <button data-nav-toggle aria-controls="id">
  document.querySelectorAll('[data-nav-toggle]').forEach(function (btn) {
    var menu = document.getElementById(btn.getAttribute('aria-controls'));
    if (!menu) return;
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      menu.classList.toggle('is-open', !open);
      document.body.classList.toggle('nav-open', !open);
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        btn.setAttribute('aria-expanded', 'false');
        menu.classList.remove('is-open');
        document.body.classList.remove('nav-open');
      });
    });
  });

  // Header gets a "scrolled" class for a solid background
  var header = document.querySelector('[data-header]');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 12); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Desktop: the portfolio header stays hidden until the mouse reaches the top edge.
  // Phones/tablets (no hover) keep their normal behavior.
  var siteHeader = document.querySelector('.site-header');
  if (siteHeader && window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var hint = document.querySelector('.header-hint');
    if (!hint) { hint = document.createElement('div'); hint.className = 'header-hint'; hint.setAttribute('aria-hidden', 'true'); document.body.appendChild(hint); }
    var peeking = false;
    var setPeek = function (on) {
      if (on === peeking) return;
      peeking = on;
      siteHeader.classList.toggle('is-peek', on);
      hint.classList.toggle('is-hidden', on);
    };
    document.addEventListener('mousemove', function (e) {
      if (e.clientY <= 16) setPeek(true);
      else if (peeking && e.clientY > siteHeader.offsetHeight + 28 && !siteHeader.matches(':hover')) setPeek(false);
    }, { passive: true });
    document.documentElement.addEventListener('mouseleave', function (e) { if (e.clientY > 16) setPeek(false); });
  }

  // Scroll reveal
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // Copy buttons for every <pre> that has data-copy
  document.querySelectorAll('pre[data-copy]').forEach(function (pre) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'copy-btn';
    btn.textContent = 'Copy';
    btn.setAttribute('aria-label', 'Copy code');
    btn.addEventListener('click', function () {
      var text = pre.querySelector('code') ? pre.querySelector('code').innerText : pre.innerText;
      var done = function () {
        btn.textContent = 'Copied';
        setTimeout(function () { btn.textContent = 'Copy'; }, 1600);
      };
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(done, function () { btn.textContent = 'Failed'; });
      } else {
        var ta = document.createElement('textarea');
        ta.value = text; document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); done(); } catch (err) { btn.textContent = 'Failed'; }
        ta.remove();
      }
    });
    pre.appendChild(btn);
  });

  // Footer year
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
