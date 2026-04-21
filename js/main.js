/* ===================================
   MONELLO PODCAST — main.js
   Scroll animations, nav, smooth scroll,
   banana fluid splash on logo click
   =================================== */

(function () {
  'use strict';

  /* ---------- Scroll Reveal ---------- */
  var animElements = document.querySelectorAll('[data-animate]');

  if ('IntersectionObserver' in window && animElements.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    animElements.forEach(function (el) { observer.observe(el); });
  } else {
    animElements.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Sticky Nav ---------- */
  var nav  = document.getElementById('nav');
  var hero = document.getElementById('hero');

  if (nav && hero) {
    function onScroll() {
      if (window.scrollY > hero.offsetHeight * 0.5) {
        nav.classList.add('nav--scrolled');
      } else {
        nav.classList.remove('nav--scrolled');
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Smooth Scroll ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = this.getAttribute('href');
      if (id === '#') return;
      var target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---------- Banana Fluid Splash on Logo Click ---------- */
  var logoImg = document.querySelector('.hero__logo-img');

  if (logoImg) {
    logoImg.addEventListener('click', function () { spawnFluid(this); });
    logoImg.addEventListener('touchstart', function () { spawnFluid(this); }, { passive: true });
  }

  function spawnFluid(el) {
    var rect = el.getBoundingClientRect();
    /* Banana tip: upper-right edge of the circle */
    var originX = rect.left + rect.width  * 0.73;
    var originY = rect.top  + rect.height * 0.07;
    var dropCount = 14 + Math.floor(Math.random() * 8);

    for (var i = 0; i < dropCount; i++) {
      createFluidDrop(originX, originY, i, dropCount, 'drop');
    }
    for (var j = 0; j < 4 + Math.floor(Math.random() * 3); j++) {
      createFluidDrop(originX, originY, j, dropCount, 'string');
    }
    for (var k = 0; k < 3 + Math.floor(Math.random() * 2); k++) {
      createFluidDrop(originX, originY, k, dropCount, 'glob');
    }
  }

  function createFluidDrop(x, y, index, total, type) {
    var drop = document.createElement('div');

    if (type === 'string') {
      drop.className = 'milk-drop milk-drop--string';
    } else if (type === 'glob') {
      drop.className = 'milk-drop milk-drop--glob';
    } else {
      var sizeClass = index < 4
        ? 'milk-drop--large'
        : (index > total - 4 ? 'milk-drop--small' : '');
      drop.className = 'milk-drop' + (sizeClass ? ' ' + sizeClass : '');
    }

    var baseAngle =
      type === 'string' ? -40 - Math.random() * 30 :
      type === 'glob'   ? -30 - Math.random() * 40 :
                          -15 - Math.random() * 65;

    var distance =
      type === 'glob'   ? 40  + Math.random() * 60  :
      type === 'string' ? 30  + Math.random() * 50  :
                          50  + Math.random() * 130;

    var rad      = baseAngle * Math.PI / 180;
    var tx       = Math.cos(rad) * distance + (Math.random() * 15 - 7);
    var ty       = Math.sin(rad) * distance;
    var gravity  = type === 'glob' ? (50 + Math.random() * 40)  : (35 + Math.random() * 70);
    var duration = type === 'glob' ? (1.0 + Math.random() * 0.4) : (0.7 + Math.random() * 0.6);
    var delay    = index * 0.025 + Math.random() * 0.04;
    var rot      = baseAngle + 90 + (Math.random() * 20 - 10);

    drop.style.cssText =
      'left:'              + (x + window.scrollX) + 'px;' +
      'top:'               + (y + window.scrollY) + 'px;' +
      '--tx:'              + tx       + 'px;'  +
      '--ty:'              + ty       + 'px;'  +
      '--gravity:'         + gravity  + 'px;'  +
      '--rot:'             + rot      + 'deg;' +
      '--fly-duration:'    + duration + 's;'   +
      '--delay:'           + delay    + 's;';

    document.body.appendChild(drop);

    setTimeout(function () {
      if (drop.parentNode) drop.parentNode.removeChild(drop);
    }, (duration + delay) * 1000 + 300);
  }

  /* ---------- Contact Form — Formspree ---------- */
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('.form-submit');
      var data = new FormData(form);

      btn.innerHTML = '⏳ Invio in corso...';
      btn.disabled = true;

      fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      })
      .then(function (response) {
        if (response.ok) {
          btn.innerHTML = '🍌 Messaggio inviato!';
          btn.style.background = 'linear-gradient(135deg,#25D366,#1aab52)';
          form.reset();
          setTimeout(function () {
            btn.innerHTML = 'Invia Messaggio <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>';
            btn.style.background = '';
            btn.disabled = false;
          }, 4000);
        } else {
          btn.innerHTML = '❌ Errore — riprova';
          btn.style.background = 'linear-gradient(135deg,#e84b8a,#c0002e)';
          btn.disabled = false;
          setTimeout(function () {
            btn.innerHTML = 'Invia Messaggio <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>';
            btn.style.background = '';
          }, 3000);
        }
      })
      .catch(function () {
        btn.innerHTML = '❌ Errore di rete — riprova';
        btn.style.background = 'linear-gradient(135deg,#e84b8a,#c0002e)';
        btn.disabled = false;
        setTimeout(function () {
          btn.innerHTML = 'Invia Messaggio <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>';
          btn.style.background = '';
        }, 3000);
      });
    });
  }

})();

/* ── Counter animation ── */
(function() {
  const counters = document.querySelectorAll('.counter-num');
  if (!counters.length) return;

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const steps = 60;
    let step = 0;
    const timer = setInterval(function() {
      step++;
      const progress = easeOut(step / steps);
      el.textContent = Math.round(progress * target) + suffix;
      if (step >= steps) {
        el.textContent = target + suffix;
        clearInterval(timer);
      }
    }, 2000 / steps);
  }

  const obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        animateCounter(e.target);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(function(c) { obs.observe(c); });
})();
