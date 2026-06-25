/**
 * MiliTime — app.js
 * Loads posts.json, builds polaroid cards, handles lightbox.
 */

(function () {
  'use strict';

  // Small tilt variations so each polaroid feels hand-placed
  const TILTS = [-3.2, -1.8, -0.9, 0.6, 1.4, 2.5, -2.6, 0.3, 1.9, -1.1];

  // ─── DOM references ───────────────────────────────────────────────────────
  const grid        = document.getElementById('polaroidGrid');
  const emptyState  = document.getElementById('emptyState');
  const postCount   = document.getElementById('postCount');
  const heartCtr    = document.getElementById('heartCounter');
  const lightbox    = document.getElementById('lightbox');
  const overlay     = document.getElementById('lightboxOverlay');
  const lbClose     = document.getElementById('lightboxClose');
  const lbImg       = document.getElementById('lightboxImg');
  const lbLocation  = document.getElementById('lightboxLocation');
  const lbCaption   = document.getElementById('lightboxCaption');
  const lbDate      = document.getElementById('lightboxDate');
  const lbSong      = document.getElementById('lightboxSong');

  let posts = [];

  // ─── Fetch posts ──────────────────────────────────────────────────────────
  async function loadPosts () {
    try {
      const res  = await fetch('posts.json?v=' + Date.now()); // bust cache
      if (!res.ok) throw new Error('Network response not ok');
      posts = await res.json();
    } catch (err) {
      console.warn('Could not load posts.json:', err);
      posts = [];
    }

    renderPosts();
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  function renderPosts () {
    grid.innerHTML = '';

    if (!posts.length) {
      emptyState.style.display = 'flex';
      heartCtr.textContent     = '0 posts';
      postCount.textContent    = '';
      return;
    }

    emptyState.style.display = 'none';
    heartCtr.textContent     = posts.length === 1 ? '1 post 💕' : posts.length + ' posts 💕';
    postCount.textContent    = posts.length === 1
      ? 'One memory waiting for you'
      : posts.length + ' memories waiting for you';

    // Most recent first
    const sorted = [...posts].sort((a, b) => b.id - a.id);

    sorted.forEach((post, i) => {
      const card = buildCard(post, i);
      grid.appendChild(card);
    });

    // Intersection observer for staggered fade-in
    observeCards();
  }

  // ─── Build a single polaroid card ─────────────────────────────────────────
  function buildCard (post, index) {
    const tilt = TILTS[index % TILTS.length];

    const card = document.createElement('article');
    card.className  = 'polaroid';
    card.style.setProperty('--card-tilt', `${tilt}deg`);
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `View photo from ${post.location || 'the journey'}`);

    // Image or placeholder
    const imgWrap = document.createElement('div');
    imgWrap.className = 'polaroid-img-wrap';

    if (post.image) {
      const img = document.createElement('img');
      img.className = 'polaroid-img';
      img.alt   = post.caption || post.location || 'Travel photo';
      img.src   = post.image;

      // Graceful fallback if image missing
      img.onerror = function () {
        imgWrap.innerHTML = '';
        imgWrap.appendChild(placeholder());
      };

      imgWrap.appendChild(img);
    } else {
      imgWrap.appendChild(placeholder());
    }

    // Bottom caption strip
    const body = document.createElement('div');
    body.className = 'polaroid-body';

    const loc = document.createElement('p');
    loc.className   = 'polaroid-location';
    loc.textContent = post.location || '✈️';

    const date = document.createElement('p');
    date.className   = 'polaroid-date';
    date.textContent = post.date || '';

    body.appendChild(loc);
    body.appendChild(date);

    card.appendChild(imgWrap);
    card.appendChild(body);

    // Click / keyboard to open lightbox
    card.addEventListener('click',   () => openLightbox(post));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(post);
      }
    });

    return card;
  }

  function placeholder () {
    const div = document.createElement('div');
    div.className = 'polaroid-img-placeholder';
    div.innerHTML = '<span>📷</span><span>photo coming soon</span>';
    return div;
  }

  // ─── Intersection Observer — staggered fade-in ────────────────────────────
  function observeCards () {
    const cards = document.querySelectorAll('.polaroid');

    if (!('IntersectionObserver' in window)) {
      cards.forEach(c => c.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const card  = entry.target;
          const delay = Array.from(cards).indexOf(card) * 80;
          setTimeout(() => {
            card.classList.add('visible');
          }, delay);
          observer.unobserve(card);
        }
      });
    }, { threshold: 0.12 });

    cards.forEach(c => observer.observe(c));
  }

  // ─── Lightbox ─────────────────────────────────────────────────────────────
  function openLightbox (post) {
    lbImg.src         = post.image || '';
    lbImg.alt         = post.caption || '';
    lbLocation.textContent = post.location ? '📍 ' + post.location : '';
    lbCaption.textContent  = post.caption || '';
    lbDate.textContent     = post.date    || '';
    lbSong.textContent     = post.song    || '';

    lightbox.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }

  function closeLightbox () {
    lightbox.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  lbClose.addEventListener('click',  closeLightbox);
  overlay.addEventListener('click',  closeLightbox);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

 // ─── iOS Standalone Lifecycle Fix ─────────────────────────────────────────
  // Forces a fresh data fetch whenever the app is brought back to the foreground
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      loadPosts();
    }
  });

  // ─── Boot ─────────────────────────────────────────────────────────────────
  loadPosts();
})();
