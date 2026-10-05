/* ════════════════════════════════════════════════
   MAISON — Interior Design Studio
   JavaScript: Interactions & Animations
   ════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. NAVBAR: scroll behaviour + hamburger ── */
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  const backToTop = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ── 2. HERO: Ken Burns effect trigger ──────── */
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    setTimeout(() => heroSection.classList.add('loaded'), 100);
  }

  /* ── 3. REVEAL ON SCROLL (IntersectionObserver) */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          // Stagger sibling reveals
          const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')];
          const delay    = siblings.indexOf(entry.target) * 80;
          setTimeout(() => entry.target.classList.add('visible'), delay);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
  );
  revealEls.forEach(el => revealObserver.observe(el));

  /* ── 4. COUNTER ANIMATION (Stats) ───────────── */
  const statNums = document.querySelectorAll('.stat-num');
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  statNums.forEach(el => counterObserver.observe(el));

  function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const step     = 16;
    const steps    = duration / step;
    let current    = 0;

    const timer = setInterval(() => {
      current += target / steps;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current);
    }, step);
  }

  /* ── 5. PORTFOLIO FILTER ─────────────────────── */
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      portfolioItems.forEach(item => {
        const cat = item.dataset.category;
        const show = filter === 'all' || cat === filter;

        if (show) {
          item.classList.remove('hidden');
          // Re-trigger reveal animation
          item.classList.remove('visible');
          setTimeout(() => item.classList.add('visible'), 50);
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  /* ── 6. TESTIMONIALS SLIDER ──────────────────── */
  const track      = document.getElementById('testimonials-track');
  const prevBtn    = document.getElementById('slider-prev');
  const nextBtn    = document.getElementById('slider-next');
  const dotsWrap   = document.getElementById('slider-dots');
  const cards      = track ? track.querySelectorAll('.testimonial-card') : [];
  let   current    = 0;
  let   autoTimer  = null;

  if (cards.length > 0) {
    // Create dots
    cards.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = `dot${i === 0 ? ' active' : ''}`;
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });

    function goTo(index) {
      current = (index + cards.length) % cards.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      dotsWrap.querySelectorAll('.dot').forEach((d, i) =>
        d.classList.toggle('active', i === current)
      );
    }

    function startAuto() {
      stopAuto();
      autoTimer = setInterval(() => goTo(current + 1), 5500);
    }

    function stopAuto() {
      if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
    }

    prevBtn.addEventListener('click', () => { goTo(current - 1); stopAuto(); startAuto(); });
    nextBtn.addEventListener('click', () => { goTo(current + 1); stopAuto(); startAuto(); });

    // Touch / swipe support
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend',   e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) { diff > 0 ? goTo(current + 1) : goTo(current - 1); }
    });

    startAuto();
  }

  /* ── 7. BACK TO TOP ──────────────────────────── */
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── 8. CONTACT FORM (basic UX) ─────────────── */
  const formBtn = document.querySelector('.btn-full');
  if (formBtn) {
    formBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const inputs = document.querySelectorAll('.form-input');
      let valid = true;

      inputs.forEach(input => {
        if (!input.value.trim()) {
          input.style.borderColor = '#e07070';
          valid = false;
          setTimeout(() => { input.style.borderColor = ''; }, 2500);
        }
      });

      if (valid) {
        formBtn.textContent = 'Message Sent ✓';
        formBtn.style.background = '#4caf88';
        formBtn.style.borderColor = '#4caf88';
        inputs.forEach(input => { input.value = ''; });
        setTimeout(() => {
          formBtn.textContent = 'Send Message';
          formBtn.style.background = '';
          formBtn.style.borderColor = '';
        }, 3500);
      }
    });
  }

  /* ── 9. SMOOTH ANCHOR NAV (offset for fixed header) */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = navbar.offsetHeight + 16;
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── 10. PARALLAX HERO SUBTLE ────────────────── */
  const heroImg = document.querySelector('.hero-img');
  if (heroImg && window.matchMedia('(min-width: 769px)').matches) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      heroImg.style.transform = `scale(1) translateY(${y * 0.22}px)`;
    }, { passive: true });
  }

});
