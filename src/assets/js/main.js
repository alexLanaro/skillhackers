// Skill Hackers — interactions
(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', function () {

    /* Mobile nav */
    var nav = document.querySelector('.nav');
    var toggle = document.querySelector('.nav-toggle');
    if (nav && toggle) {
      toggle.addEventListener('click', function () {
        var open = nav.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }

    /* Reveal on scroll, staggered among siblings */
    var revealEls = document.querySelectorAll('.reveal, .flow-compare, .timeline');
    revealEls.forEach(function (el) {
      if (!el.classList.contains('reveal')) return;
      var siblings = Array.prototype.filter.call(el.parentNode.children, function (c) { return c.classList.contains('reveal'); });
      var i = siblings.indexOf(el);
      el.style.setProperty('--d', (Math.min(i, 5) * 0.09) + 's');
    });
    document.querySelectorAll('.flow__steps, .timeline').forEach(function (list) {
      Array.prototype.forEach.call(list.children, function (c, i) { c.style.setProperty('--i', i); });
    });

    function onVisible(el) {
      el.classList.add('is-visible');
      el.querySelectorAll('[data-count]').forEach(countUp);
      if (el.hasAttribute('data-count')) countUp(el);
    }
    if ('IntersectionObserver' in window && !reduced) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { onVisible(e.target); io.unobserve(e.target); }
        });
      }, { threshold: 0.18, rootMargin: '0px 0px -40px 0px' });
      revealEls.forEach(function (el) { io.observe(el); });
    } else {
      revealEls.forEach(onVisible);
    }

    /* Count-up numbers. data-count="5000" data-prefix=">" ; data-count-final="incalcolabili" ends on a word */
    function countUp(el) {
      if (el.dataset.done) return;
      el.dataset.done = '1';
      var target = parseFloat(el.dataset.count);
      var prefix = el.dataset.prefix || '';
      var finalText = el.dataset.countFinal;
      var locale = document.documentElement.lang === 'it' ? 'it-IT' : 'en-US';
      if (reduced) { el.textContent = finalText || prefix + target.toLocaleString(locale); return; }
      var start = null, dur = finalText ? 1400 : 1600;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + Math.round(target * eased).toLocaleString(locale);
        if (p < 1) requestAnimationFrame(step);
        else if (finalText) { el.textContent = finalText; el.classList.add('is-final'); }
      }
      requestAnimationFrame(step);
    }

    /* Hero rotating phrase */
    var rot = document.querySelector('[data-rotate]');
    if (rot) {
      var phrases = JSON.parse(rot.getAttribute('data-rotate'));
      var out = rot.querySelector('b');
      if (reduced) { out.textContent = phrases[0]; }
      else {
        var pi = 0, ci = 0, deleting = false;
        (function tick() {
          var word = phrases[pi];
          if (!deleting) {
            ci++;
            out.textContent = word.slice(0, ci);
            if (ci === word.length) { deleting = true; return setTimeout(tick, 2200); }
            return setTimeout(tick, 42);
          }
          ci--;
          out.textContent = word.slice(0, ci);
          if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; return setTimeout(tick, 250); }
          setTimeout(tick, 22);
        })();
      }
    }

    /* Cursor spotlight on dark cards */
    document.querySelectorAll('.spot').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });

    /* Accordion */
    document.querySelectorAll('.acc').forEach(function (acc) {
      var btn = acc.querySelector('.acc__btn');
      btn.addEventListener('click', function () {
        var open = acc.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    });

    /* Client carousel: rows auto-scroll in opposite directions, pause on hover/touch, draggable, arrows move all rows */
    document.querySelectorAll('.carousel').forEach(function (car) {
      var rows = [];
      car.querySelectorAll('.carousel__viewport').forEach(function (vp) {
        var track = vp.querySelector('.carousel__track');
        var originals = Array.prototype.slice.call(track.children);
        originals.forEach(function (n) { var c = n.cloneNode(true); c.setAttribute('aria-hidden', 'true'); track.appendChild(c); });
        var row = { vp: vp, track: track, speed: parseFloat(vp.getAttribute('data-speed') || '0.4'), pos: 0, hovering: false, dragging: false, pausedUntil: 0 };
        row.half = function () { return track.scrollWidth / 2; };
        row.wrap = function () {
          var h = row.half();
          if (row.pos >= h) row.pos -= h;
          if (row.pos < 0) row.pos += h;
          vp.scrollLeft = row.pos;
        };
        // reverse rows start mid-way so they can move right immediately
        if (row.speed < 0) { row.pos = row.half() / 2; }
        rows.push(row);

        vp.addEventListener('mouseenter', function () { row.hovering = true; });
        vp.addEventListener('mouseleave', function () { row.hovering = false; });
        vp.addEventListener('touchstart', function () { row.pausedUntil = Date.now() + 3000; }, { passive: true });
        vp.addEventListener('scroll', function () { if (row.dragging || Date.now() < row.pausedUntil) row.pos = vp.scrollLeft; }, { passive: true });
        vp.addEventListener('wheel', function () { row.pausedUntil = Date.now() + 1800; }, { passive: true });

        var startX = 0, startPos = 0;
        vp.addEventListener('pointerdown', function (e) {
          if (e.pointerType !== 'mouse') return;
          row.dragging = true; startX = e.clientX; startPos = row.pos;
          vp.classList.add('is-dragging'); vp.setPointerCapture(e.pointerId);
        });
        vp.addEventListener('pointermove', function (e) {
          if (!row.dragging) return;
          row.pos = startPos - (e.clientX - startX); row.wrap();
        });
        function endDrag() { if (!row.dragging) return; row.dragging = false; vp.classList.remove('is-dragging'); row.pausedUntil = Date.now() + 1500; }
        vp.addEventListener('pointerup', endDrag);
        vp.addEventListener('pointercancel', endDrag);
      });

      // smooth nudge from the arrows, applied to every row
      var nudge = 0;
      car.querySelectorAll('[data-dir]').forEach(function (b) {
        b.addEventListener('click', function () { nudge += 260 * parseInt(b.getAttribute('data-dir'), 10); });
      });

      (function loop() {
        var step = nudge * 0.12;
        if (Math.abs(nudge) < 0.5) { step = nudge; }
        nudge -= step;
        rows.forEach(function (row) {
          var auto = (!reduced && !row.hovering && !row.dragging && Date.now() >= row.pausedUntil) ? row.speed : 0;
          if (step !== 0 || auto !== 0) { row.pos += auto + step; row.wrap(); }
        });
        requestAnimationFrame(loop);
      })();
    });
  });
})();
