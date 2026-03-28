/* =========================================================
   PORTFOLIO — scripts.js
   Vanilla ES6+. No external dependencies.
========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initConstellation();
  initScrollReveal();
  initGrepTypewriter();
  initEmailObfuscation();
  initMetrics();
  initYear();
  initHexFilter();
  initExpYears();
});

/* ---------------------------------------------------------
   NAV — blur on scroll + mobile hamburger
--------------------------------------------------------- */
function initNav() {
  const nav       = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  const menu      = document.getElementById('mobile-menu');
  const iconOpen  = document.getElementById('icon-open');
  const iconClose = document.getElementById('icon-close');

  if (!nav || !hamburger || !menu) return;

  // Blur nav background on scroll
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  // Toggle mobile overlay
  hamburger.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    iconOpen.classList.toggle('hidden', isOpen);
    iconClose.classList.toggle('hidden', !isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Expose close for inline onclick handlers in HTML
  window.closeMobileMenu = () => {
    menu.classList.remove('open');
    iconOpen.classList.remove('hidden');
    iconClose.classList.add('hidden');
    document.body.style.overflow = '';
  };
}

/* ---------------------------------------------------------
   CONSTELLATION CANVAS
   Fewer particles on mobile for performance.
   Pauses when tab is hidden (saves battery / CPU).
--------------------------------------------------------- */
function initConstellation() {
  const canvas = document.getElementById('constellation');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const isMobile = window.innerWidth < 768;
  const COUNT    = isMobile ? 28 : 55;
  const MAX_DIST = isMobile ? 75 : 110;

  let dots  = [];
  let animId;

  function buildDots() {
    dots = Array.from({ length: COUNT }, () => ({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.38,
      vy: (Math.random() - 0.5) * 0.38,
      r:  Math.random() * 1.4 + 0.5,
    }));
  }

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    buildDots();
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const d of dots) {
      d.x += d.vx;
      d.y += d.vy;
      if (d.x < 0 || d.x > canvas.width)  d.vx *= -1;
      if (d.y < 0 || d.y > canvas.height) d.vy *= -1;
    }

    // Connections
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx   = dots[i].x - dots[j].x;
        const dy   = dots[i].y - dots[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.strokeStyle = `rgba(251,146,60,${0.28 * (1 - dist / MAX_DIST)})`;
          ctx.lineWidth   = 0.6;
          ctx.stroke();
        }
      }
    }

    // Dots
    for (const d of dots) {
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(251,146,60,0.7)';
      ctx.fill();
    }

    animId = requestAnimationFrame(draw);
  }

  // Pause when tab hidden — saves battery
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animId);
    } else {
      draw();
    }
  });

  // Resize observer — no resize event listener overhead
  new ResizeObserver(resize).observe(canvas);
  resize();
  draw();
}

/* ---------------------------------------------------------
   SCROLL REVEAL
   IntersectionObserver — zero scroll listeners.
   Elements with [data-reveal] slide up and fade in.
--------------------------------------------------------- */
function initScrollReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  els.forEach((el) => observer.observe(el));
}

/* ---------------------------------------------------------
   GREP TYPEWRITER
   Lines inside #grep-panel type in one-by-one when the
   panel scrolls into view. IntersectionObserver only —
   no scroll listeners.
--------------------------------------------------------- */
function initGrepTypewriter() {
  const panel = document.getElementById('grep-panel');
  if (!panel) return;

  const typeable = panel.querySelectorAll(
    '.t-prompt, .t-group-label, .t-line, .t-summary'
  );

  let started = false;

  const typeAll = () => {
    if (started) return;
    started = true;

    let delay = 0;
    typeable.forEach((el) => {
      const isCursorLine = el.querySelector('.t-cursor') !== null;
      setTimeout(() => el.classList.add('revealed'), delay);
      if (!isCursorLine) delay += 55;
    });
  };

  new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) typeAll();
    },
    { threshold: 0.15 }
  ).observe(panel);
}

/* ---------------------------------------------------------
   EMAIL OBFUSCATION
   The email address is never written in the HTML source.
   Assembled from data attributes only on first interaction,
   so scrapers scanning static HTML cannot harvest it.
--------------------------------------------------------- */
function initEmailObfuscation() {
  const link = document.getElementById('email-link');
  if (!link) return;

  const assemble = () => {
    const user   = link.dataset.user;
    const domain = link.dataset.domain;
    if (user && domain) link.href = `mailto:${user}@${domain}`;
  };

  link.addEventListener('click',      assemble, { once: true });
  link.addEventListener('focus',      assemble, { once: true });
  link.addEventListener('touchstart', assemble, { once: true, passive: true });
}

/* ---------------------------------------------------------
   SRE METRICS — live-ticking cosmetic counters
--------------------------------------------------------- */
function initMetrics() {
  const uptimeEl = document.getElementById('uptime-val');
  const commitEl = document.getElementById('commit-val');
  if (!uptimeEl || !commitEl) return;

  let commits = 2847;

  setInterval(() => {
    const v = 99.90 + Math.random() * 0.09;
    uptimeEl.textContent = v.toFixed(2) + '%';
  }, 2600);

  setInterval(() => {
    if (Math.random() < 0.12) {
      commits++;
      commitEl.textContent = commits.toLocaleString('en-US');
    }
  }, 1900);
}

/* ---------------------------------------------------------
   HEX GRID FILTER
   Clicking a legend item highlights that category;
   multiple categories can be active at once.
   Clicking the only active category resets the filter.
--------------------------------------------------------- */
function initHexFilter() {
  const items = document.querySelectorAll('.legend-item[data-filter]');
  const hexes = document.querySelectorAll('.hex[data-cat]');
  if (!items.length || !hexes.length) return;

  const active = new Set();

  function applyFilter() {
    if (active.size === 0) {
      hexes.forEach(h => h.classList.remove('dimmed'));
      items.forEach(i => i.classList.remove('active', 'inactive'));
      return;
    }
    hexes.forEach(h => {
      h.classList.toggle('dimmed', !active.has(h.dataset.cat));
    });
    items.forEach(i => {
      const on = active.has(i.dataset.filter);
      i.classList.toggle('active', on);
      i.classList.toggle('inactive', !on);
    });
  }

  items.forEach(item => {
    item.addEventListener('click', () => {
      const cat = item.dataset.filter;
      if (active.has(cat)) {
        active.delete(cat);
      } else {
        active.add(cat);
      }
      applyFilter();
    });
  });
}

/* ---------------------------------------------------------
   EXPERIENCE YEARS — dynamic count from Jan 2020
--------------------------------------------------------- */
function initExpYears() {
  const start = new Date('2020-01-01');
  const years = Math.floor((Date.now() - start) / (1000 * 60 * 60 * 24 * 365.25));
  document.querySelectorAll('[data-exp-years]').forEach(el => {
    el.textContent = years;
  });
}

/* ---------------------------------------------------------
   FOOTER YEAR
--------------------------------------------------------- */
function initYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}
