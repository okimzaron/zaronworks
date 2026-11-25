/* intro.js: first-visit portfolio intro.
   1. A crumpled ball of paper drops in, wobbles, and un-crumples into a flat sheet.
   2. "Za'Ron Lee" is handwritten across it, left to right, with a pen tip.
   3. The sheet lifts away to reveal the collage.
   Plays on every visit unless turned off with the header's intro button (localStorage 'zl-intro-off'). Click or press any key to skip. Add ?intro to replay.
   Uses the Web Animations API, so it still plays when CSS animations are reduced. */
(function () {
  var root = document.documentElement;
  var KEY = 'zl-intro-off';
  var force = /[?&]intro\b/.test(location.search);
  var off = false;
  try { off = !!localStorage.getItem(KEY); } catch (e) { off = false; }
  // Links straight to a section (#work, #about, etc.) skip the intro.
  if ((off || location.hash) && !force) { root.classList.remove('zl-intro-pending'); return; }

  var NAME = "Za'Ron Lee";
  var vw = window.innerWidth, vh = window.innerHeight;
  var W = Math.round(Math.min(760, vw * 0.88));
  var H = Math.round(W * 0.6);
  var cx = W / 2, cy = H / 2;

  /* ---------- build the shapes ---------- */
  // angles around the center: evenly spaced, plus the four exact corners so the flat sheet is a true rectangle
  var corner = Math.atan2(cy, cx);
  var ANGLES = [];
  for (var q = 0; q < 20; q++) ANGLES.push((q / 20) * Math.PI * 2);
  [corner, Math.PI - corner, Math.PI + corner, 2 * Math.PI - corner].forEach(function (c) { ANGLES.push(c); });
  ANGLES.sort(function (a, b) { return a - b; });
  var N = ANGLES.length;
  function rand(seed) { var x = Math.sin(seed * 9301 + 49297) * 233280; return x - Math.floor(x); }
  function rectRadius(a) {                       // distance from center to the sheet edge at angle a
    var c = Math.abs(Math.cos(a)), s = Math.abs(Math.sin(a));
    return Math.min(c ? cx / c : Infinity, s ? cy / s : Infinity);
  }
  function poly(t, jitter, seed) {               // t: 0 = ball, 1 = flat sheet
    var ball = Math.min(W, H) * 0.22;
    var pts = [];
    for (var i = 0; i < N; i++) {
      var a = ANGLES[i];
      var r0 = ball * (0.85 + rand(i + seed) * 0.3);
      var r = r0 + (rectRadius(a) - r0) * t;
      r *= 1 - jitter * rand(i * 7 + seed);       // crumpled bites out of the edge
      pts.push((cx + Math.cos(a) * r).toFixed(1) + 'px ' + (cy + Math.sin(a) * r).toFixed(1) + 'px');
    }
    return 'polygon(' + pts.join(',') + ')';
  }

  // crease lines: pairs of dark + light strokes, like paper that's been balled up
  var creases = '';
  for (var k = 0; k < 18; k++) {
    var x1 = rand(k + 11) * W, y1 = rand(k + 23) * H, x2 = rand(k + 37) * W, y2 = rand(k + 51) * H;
    creases += '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="rgba(60,38,22,.28)" stroke-width="1.2"/>' +
               '<line x1="' + (x1 + 1.5) + '" y1="' + (y1 + 1.5) + '" x2="' + (x2 + 1.5) + '" y2="' + (y2 + 1.5) + '" stroke="rgba(255,255,255,.55)" stroke-width="1"/>';
  }
  var facets = '';
  for (var f = 0; f < 10; f++) {
    var px = rand(f + 71) * W, py = rand(f + 83) * H;
    facets += '<polygon points="' + px + ',' + py + ' ' + (px + 60 + rand(f + 3) * 120) + ',' + (py + rand(f + 5) * 90) + ' ' + (px + rand(f + 9) * 80) + ',' + (py + 50 + rand(f + 13) * 110) + '" fill="rgba(80,50,30,' + (0.04 + rand(f + 17) * 0.07).toFixed(3) + ')"/>';
  }

  /* ---------- DOM ---------- */
  var el = document.createElement('div');
  el.className = 'zl-intro';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML =
    '<div class="zi-bg"></div>' +
    '<div class="zi-sheet" style="width:' + W + 'px;height:' + H + 'px">' +
      '<div class="zi-paper"></div>' +
      '<svg class="zi-creases" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none">' + facets + creases + '</svg>' +
      '<div class="zi-shade"></div>' +
      '<div class="zi-writing">' +
        '<svg class="zi-name" viewBox="0 0 600 200"><text x="300" y="130" text-anchor="middle">' + NAME.replace("'", '&#39;') + '</text>' +
        '<path class="zi-swash" d="M150 168 C 260 150, 380 178, 470 156" /></svg>' +
        '<span class="zi-pen"></span>' +
      '</div>' +
    '</div>' +
    '<button type="button" class="zi-skip">Skip</button>';
  document.body.appendChild(el);
  root.classList.remove('zl-intro-pending');
  document.body.style.overflow = 'hidden';

  var $ = function (s) { return el.querySelector(s); };
  var bg = $('.zi-bg'), sheet = $('.zi-sheet'), creaseEl = $('.zi-creases'), shade = $('.zi-shade'),
      writing = $('.zi-writing'), nameSvg = $('.zi-name'), text = $('.zi-name text'), swash = $('.zi-swash'), pen = $('.zi-pen');

  var anims = [], timers = [], done = false, exiting = false;
  var play = function (node, frames, opts) { var a = node.animate(frames, Object.assign({ fill: 'forwards' }, opts)); anims.push(a); return a; };
  var at = function (ms, fn) { timers.push(setTimeout(fn, ms)); };

  // start crumpled
  sheet.style.clipPath = poly(0, 0.12, 1);
  sheet.style.transform = 'translate(-50%,-50%) rotate(-28deg)';

  /* 1. drop in + wobble */
  play(sheet, [
    { transform: 'translate(-50%,-140%) rotate(-60deg) scale(.7)', opacity: 0 },
    { transform: 'translate(-50%,-50%) rotate(-28deg) scale(1)', opacity: 1, offset: .55 },
    { transform: 'translate(-50%,-50%) rotate(-18deg) scale(1.03)', offset: .75 },
    { transform: 'translate(-50%,-50%) rotate(-28deg) scale(1)' }
  ], { duration: 720, easing: 'cubic-bezier(.3,.8,.3,1)' });

  /* 2. un-crumple */
  at(780, function () {
    var dur = 1350, ease = 'cubic-bezier(.55,.05,.25,1)';
    play(sheet, [
      { clipPath: poly(0, 0.12, 1), transform: 'translate(-50%,-50%) rotate(-28deg)' },
      { clipPath: poly(0.35, 0.22, 2), transform: 'translate(-50%,-50%) rotate(-12deg)', offset: .3 },
      { clipPath: poly(0.7, 0.12, 3), transform: 'translate(-50%,-50%) rotate(5deg)', offset: .62 },
      { clipPath: poly(0.94, 0.03, 4), transform: 'translate(-50%,-50%) rotate(-1.5deg)', offset: .85 },
      { clipPath: poly(1, 0, 5), transform: 'translate(-50%,-50%) rotate(0deg)' }
    ], { duration: dur, easing: ease });
    play(creaseEl, [{ opacity: 1 }, { opacity: .2 }], { duration: dur, easing: 'ease-in' });
    play(shade, [{ opacity: 1 }, { opacity: 0 }], { duration: dur * .8, easing: 'ease-out' });
  });

  /* 3. handwriting (waits for the font, at most ~1.2s) */
  var fontReady = (document.fonts && document.fonts.load) ? document.fonts.load('600 120px "Caveat"') : Promise.resolve();
  var waitFont = Promise.race([fontReady, new Promise(function (r) { setTimeout(r, 1200); })]);

  at(2200, function () {
    waitFont.then(function () {
      if (exiting) return;
      // fit the writing box to the real text width so the pen sweeps exactly across it
      var bb; try { bb = text.getBBox(); } catch (e) { bb = { x: 60, y: 40, width: 480, height: 110 }; }
      var pad = 14;
      nameSvg.setAttribute('viewBox', (bb.x - pad) + ' ' + (bb.y - pad) + ' ' + (bb.width + pad * 2) + ' ' + (bb.height + pad * 2 + 30));
      writing.style.aspectRatio = (bb.width + pad * 2) + ' / ' + (bb.height + pad * 2 + 30);
      var dur = 1500, ease = 'cubic-bezier(.45,.05,.55,.95)';
      writing.style.opacity = 1;
      play(writing, [{ clipPath: 'inset(-10% 100% -10% 0)' }, { clipPath: 'inset(-10% 0% -10% 0)' }], { duration: dur, easing: ease });
      play(text, [{ strokeDashoffset: 900 }, { strokeDashoffset: 0 }], { duration: dur + 200, easing: 'ease-out' });
      play(pen, [
        { left: '0%', top: '58%', opacity: 1 },
        { top: '40%', offset: .15 }, { top: '66%', offset: .3 }, { top: '42%', offset: .45 },
        { top: '64%', offset: .6 }, { top: '44%', offset: .75 }, { top: '60%', offset: .9 },
        { left: '100%', top: '52%', opacity: 1 }
      ], { duration: dur, easing: ease });
      timers.push(setTimeout(function () {
        play(pen, [{ opacity: 1 }, { opacity: 0 }], { duration: 200 });
        play(text, [{ fillOpacity: 0 }, { fillOpacity: 1 }], { duration: 380, easing: 'ease-out' });
        play(swash, [{ strokeDashoffset: 400 }, { strokeDashoffset: 0 }], { duration: 420, easing: 'ease-out' });
      }, dur));
      timers.push(setTimeout(exit, dur + 1100));
    });
  });

  /* 4. lift the sheet away */
  function exit() {
    if (exiting) return;
    exiting = true;
    timers.forEach(clearTimeout); timers = [];
    play(sheet, [
      { opacity: 1, transform: getComputedStyle(sheet).transform === 'none' ? 'translate(-50%,-50%)' : getComputedStyle(sheet).transform },
      { opacity: 0, transform: 'translate(-50%,-62%) rotate(-3deg) scale(1.08)' }
    ], { duration: 560, easing: 'cubic-bezier(.6,0,.3,1)' });
    play(bg, [{ opacity: 1 }, { opacity: 0 }], { duration: 650, delay: 150, easing: 'ease-in-out' });
    timers.push(setTimeout(finish, 820));
  }

  function finish() {
    if (done) return;
    done = true;
    document.body.style.overflow = '';
    el.remove();
    document.removeEventListener('keydown', exit);
    // replay the collage's own entrance now that it's visible
    var tiles = document.querySelectorAll('.tile');
    tiles.forEach(function (t) { t.style.transition = 'none'; t.classList.remove('is-loaded'); });
    void document.body.offsetWidth;
    requestAnimationFrame(function () {
      tiles.forEach(function (t) { t.style.transition = ''; t.classList.add('is-loaded'); });
    });
    document.querySelectorAll('.name-line').forEach(function (n) {
      n.style.animation = 'none'; void n.offsetWidth; n.style.animation = '';
    });
  }

  el.addEventListener('click', exit);
  document.addEventListener('keydown', exit);
})();
