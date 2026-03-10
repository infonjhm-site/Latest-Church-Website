// ======== Utilities & Setup ========
const SELECTORS = {
  navLinks: 'nav-links',
  navbar: 'navbar',
  menuToggle: 'menuToggle',
  fab: 'fab',
  scrollProgress: 'scrollProgress',
};

document.addEventListener('DOMContentLoaded', () => {
  // Attach navigation link handlers
  initNavLinks();
  // Mobile menu
  initMenuToggle();
  // Scroll listeners
  window.addEventListener('scroll', onScroll);
  onScroll();
  // Counters
  initializeCounters();
  // Event filters
  initializeEventFilters();
  // Form handlers
  initForms();
  // Live viewers update (periodic)
  setInterval(updateLiveViewers, 30000);
  // Set year in footer
  document.getElementById('currentYear') && (document.getElementById('currentYear').textContent = new Date().getFullYear());
  // Setup ripple animation keyframes in DOM (for the dynamic ripple element)
  appendRippleKeyframes();
  // Setup dropdowns
  initDropdowns();
  // Setup featured worship carousel
  initFeaturedVideoCarousel();
});

// ======== Dropdowns ========
function initDropdowns() {
  const toggles = document.querySelectorAll('.dropdown-toggle');
  toggles.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const parent = btn.closest('.has-dropdown');
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      // close any other
      document.querySelectorAll('.has-dropdown.open').forEach(h => { if (h !== parent) h.classList.remove('open'); });
      parent.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(!expanded));
    });

    // keyboard support
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const parent = btn.closest('.has-dropdown');
        parent.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        btn.focus();
      }
    });
  });

  // Close on outside click
  document.addEventListener('click', (ev) => {
    document.querySelectorAll('.has-dropdown.open').forEach(h => {
      if (!h.contains(ev.target)) {
        h.classList.remove('open');
        const t = h.querySelector('.dropdown-toggle');
        if (t) t.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

// ======== Navigation & Page Switching ========
function initNavLinks() {
  const links = document.querySelectorAll('[data-link]');
  links.forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const target = a.getAttribute('data-link');
      if (target) showPage(target);
      // If link was inside nav, close mobile menu
      closeMobileMenu();
    });
  });
}

function showPage(pageId) {
  const pages = document.querySelectorAll('.page');
  const target = document.getElementById(pageId);
  if (!target) return;

  pages.forEach(p => p.classList.remove('active'));
  target.classList.add('active');
  // Scroll to top of the content area smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // update aria-selected for nav links
  document.querySelectorAll('[data-link]').forEach(el => {
    const linkTarget = el.getAttribute('data-link');
    if (linkTarget === pageId) {
      el.setAttribute('aria-current', 'page');
    } else {
      el.removeAttribute('aria-current');
    }
  });

  // Re-init counters if home is shown
  if (pageId === 'home') {
    setTimeout(initializeCounters, 300);
  }
}

function initMenuToggle() {
  const menuBtn = document.getElementById(SELECTORS.menuToggle);
  const navLinks = document.getElementById(SELECTORS.navLinks);
  if (!menuBtn || !navLinks) return;
  menuBtn.addEventListener('click', () => {
    const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', String(!expanded));
    navLinks.classList.toggle('show');
  });

  // Close when clicking outside on mobile
  document.addEventListener('click', (ev) => {
    const nav = document.querySelector('.navbar');
    if (!nav) return;
    if (!nav.contains(ev.target)) {
      navLinks.classList.remove('show');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // Close when resizing to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 640) {
      navLinks.classList.remove('show');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

function closeMobileMenu() {
  const navLinks = document.getElementById(SELECTORS.navLinks);
  const menuBtn = document.getElementById(SELECTORS.menuToggle);
  if (navLinks) navLinks.classList.remove('show');
  if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
}

// ======== Scroll / Navbar / FAB / Progress ========
function onScroll() {
  updateNavbarScroll();
  updateScrollProgress();
  toggleFab();
}

function updateNavbarScroll() {
  const navbar = document.getElementById(SELECTORS.navbar);
  if (!navbar) return;
  if (window.pageYOffset > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

function updateScrollProgress() {
  const progress = document.getElementById(SELECTORS.scrollProgress);
  if (!progress) return;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const docHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) - window.innerHeight;
  const pct = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;
  progress.style.width = pct + '%';
  progress.setAttribute('aria-valuenow', String(pct));
}

function toggleFab() {
  const fab = document.getElementById(SELECTORS.fab);
  if (!fab) return;
  if (window.pageYOffset > 300) {
    fab.style.transform = 'translateY(0)';
    fab.style.opacity = '1';
    fab.addEventListener('click', scrollToTop);
  } else {
    fab.style.transform = 'translateY(20px)';
    fab.style.opacity = '0';
    fab.removeEventListener('click', scrollToTop);
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ======== Animated Counters ========
function animateCounter(element, target, duration = 1400) {
  if (!element) return;
  const startTime = performance.now();
  const startValue = 0;
  const frame = (time) => {
    const progress = Math.min((time - startTime) / duration, 1);
    const eased = easeOutCubic(progress);
    const current = Math.floor(startValue + (target - startValue) * eased);
    element.textContent = current.toLocaleString();
    if (progress < 1) {
      requestAnimationFrame(frame);
    } else {
      element.textContent = target.toLocaleString();
    }
  };
  requestAnimationFrame(frame);
}

function easeOutCubic(t) { return (--t) * t * t + 1; }

function initializeCounters() {
  const memberEl = document.getElementById('memberCount');
  const eventEl = document.getElementById('eventCount');
  const ministryEl = document.getElementById('ministryCount');
  const yearEl = document.getElementById('yearCount');
  // Only animate if visible on screen (simple check)
  if (isElementInViewport(memberEl)) animateCounter(memberEl, 1250, 1600);
  if (isElementInViewport(eventEl)) animateCounter(eventEl, 85, 1200);
  if (isElementInViewport(ministryEl)) animateCounter(ministryEl, 12, 1000);
  if (isElementInViewport(yearEl)) animateCounter(yearEl, 35, 1100);
}

function isElementInViewport(el) {
  if (!el) return false;
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom >= 0;
}

// ======== Featured worship carousel ========
function initFeaturedVideoCarousel() {
  const carousels = document.querySelectorAll('[data-featured-carousel]');
  if (!carousels.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  carousels.forEach((carousel) => {
    const viewport = carousel.querySelector('.featured-video-viewport');
    const track = carousel.querySelector('.featured-video-track');
    const slides = Array.from(carousel.querySelectorAll('.featured-video-slide'));
    const dots = Array.from(carousel.querySelectorAll('.featured-carousel-dot'));

    if (!viewport || !track || !slides.length) return;

    let currentIndex = 0;
    let autoSlideId = null;
    let pointerStart = null;

    const syncVideos = () => {
      slides.forEach((slide, index) => {
        const video = slide.querySelector('video');
        const isActive = index === currentIndex;

        slide.classList.toggle('active', isActive);
        slide.setAttribute('aria-hidden', String(!isActive));

        if (!video) return;

        if (isActive) {
          const playPromise = video.play();
          if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(() => {});
          }
        } else {
          video.pause();
          video.currentTime = 0;
        }
      });
    };

    const updateDots = () => {
      dots.forEach((dot, index) => {
        const isActive = index === currentIndex;
        dot.classList.toggle('active', isActive);
        dot.setAttribute('aria-current', String(isActive));
        dot.tabIndex = isActive ? 0 : -1;
      });
    };

    const stopAutoSlide = () => {
      if (autoSlideId) {
        window.clearInterval(autoSlideId);
        autoSlideId = null;
      }
    };

    const startAutoSlide = () => {
      if (prefersReducedMotion || slides.length < 2) return;
      stopAutoSlide();
      autoSlideId = window.setInterval(() => {
        goToSlide(currentIndex + 1);
      }, 7000);
    };

    const restartAutoSlide = () => {
      stopAutoSlide();
      startAutoSlide();
    };

    const goToSlide = (index, { restart = false } = {}) => {
      currentIndex = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateDots();
      syncVideos();

      if (restart) {
        restartAutoSlide();
      }
    };

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        goToSlide(index, { restart: true });
      });
    });

    const resetPointer = () => {
      pointerStart = null;
    };

    viewport.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      pointerStart = { x: event.clientX, y: event.clientY };
      stopAutoSlide();
    });

    viewport.addEventListener('pointerup', (event) => {
      if (!pointerStart) return;

      const deltaX = event.clientX - pointerStart.x;
      const deltaY = event.clientY - pointerStart.y;
      resetPointer();

      if (Math.abs(deltaX) > 60 && Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX < 0) {
          goToSlide(currentIndex + 1, { restart: true });
        } else {
          goToSlide(currentIndex - 1, { restart: true });
        }
        return;
      }

      startAutoSlide();
    });

    viewport.addEventListener('pointercancel', () => {
      resetPointer();
      startAutoSlide();
    });

    viewport.addEventListener('pointerleave', () => {
      if (!pointerStart) return;
      resetPointer();
      startAutoSlide();
    });

    carousel.addEventListener('mouseenter', stopAutoSlide);
    carousel.addEventListener('mouseleave', startAutoSlide);
    carousel.addEventListener('focusin', stopAutoSlide);
    carousel.addEventListener('focusout', (event) => {
      if (!carousel.contains(event.relatedTarget)) {
        startAutoSlide();
      }
    });

    carousel.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        goToSlide(currentIndex + 1, { restart: true });
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goToSlide(currentIndex - 1, { restart: true });
      }
    });

    goToSlide(0);
    startAutoSlide();
  });
}

// ======== Events filter logic ========
function initializeEventFilters() {
  const filterButtons = document.querySelectorAll('.event-filter');
  const items = document.querySelectorAll('.event-item');
  if (!filterButtons.length) return;

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      filterButtons.forEach(b => b.setAttribute('aria-pressed', 'false'));
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      const filter = btn.getAttribute('data-filter');
      items.forEach(item => {
        const cat = item.getAttribute('data-category') || 'all';
        if (filter === 'all' || filter === cat) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

// ======== Live viewers (simulated updates) ========
function updateLiveViewers() {
  const el = document.getElementById('liveViewers');
  if (!el) return;
  const current = parseInt(el.textContent.replace(/,/g, ''), 10) || 0;
  const change = Math.floor((Math.random() - 0.5) * 40); // random change
  const next = Math.max(0, current + change);
  el.textContent = next.toLocaleString();
}

// ======== Forms (simple client handling) ========
function initForms() {
  const contactForm = document.getElementById('contactForm');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const supportForms = document.querySelectorAll('.support-form');

  if (contactForm) contactForm.addEventListener('submit', (e) => handleFormSubmit(e, 'Contact form'));
  if (loginForm) loginForm.addEventListener('submit', (e) => handleFormSubmit(e, 'Login'));
  if (registerForm) registerForm.addEventListener('submit', (e) => handleFormSubmit(e, 'Registration'));
  if (supportForms && supportForms.length) {
    supportForms.forEach(f => f.addEventListener('submit', handleSupportForm));
  }
}

// ======== Homepage cards interactions ========
document.addEventListener('click', (ev) => {
  const card = ev.target.closest('.home-card');
  if (!card) return;
  const target = card.getAttribute('data-link');
  ev.preventDefault();
  if (target) {
    showPage(target);
    closeMobileMenu();
  }
});

function handleFormSubmit(e, name = 'Form') {
  e.preventDefault();
  const submitBtn = e.target.querySelector('button[type="submit"]');
  if (submitBtn) {
    const oldText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    setTimeout(() => {
      alert(`Thanks — your ${name} was sent! (This demo shows a client-side mock.)`);
      submitBtn.disabled = false;
      submitBtn.textContent = oldText;
      e.target.reset();
    }, 900);
  } else {
    alert(`Thanks — your ${name} was sent! (Demo)`);
    e.target.reset();
  }
}

function handleSupportForm(e) {
  e.preventDefault();
  const form = e.target;
  if (!form.checkValidity()) {
    // Let native validation UI show
    form.reportValidity();
    return;
  }

  const submitBtn = form.querySelector('button[type="submit"]');
  if (submitBtn) {
    const oldText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    setTimeout(() => {
      // Try finding a local support message container inside the form or its container
      let msg = form.querySelector('#supportMsg');
      if (!msg) {
        msg = form.closest('.form-container') ? form.closest('.form-container').querySelector('#supportMsg') : null;
      }
      if (!msg) msg = document.getElementById('supportMsg');

      if (msg) {
        msg.classList.remove('hidden');
        msg.innerHTML = '<div class="success-banner"><div class="success-icon material-icons">thumb_up</div><div><strong>Thanks!</strong><p>We received your submission. We will contact you soon.</p></div></div>';
      }
      submitBtn.disabled = false;
      submitBtn.textContent = oldText;
      form.reset();
    }, 900);
  }
}

// ======== Ripple click effect (for dynamic ripples) ========
document.addEventListener('click', (ev) => {
  const btn = ev.target.closest('.ripple');
  if (!btn) return;

  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 1.2;
  const ripple = document.createElement('span');
  ripple.className = 'ripple-effect';
  ripple.style.position = 'absolute';
  ripple.style.left = (ev.clientX - rect.left - size / 2) + 'px';
  ripple.style.top = (ev.clientY - rect.top - size / 2) + 'px';
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.borderRadius = '50%';
  ripple.style.background = 'rgba(255,255,255,0.5)';
  ripple.style.transform = 'scale(0)';
  ripple.style.pointerEvents = 'none';
  ripple.style.transition = 'transform 520ms cubic-bezier(.22,.9,.35,1), opacity 520ms ease';
  btn.appendChild(ripple);
  requestAnimationFrame(() => {
    ripple.style.transform = 'scale(2.6)';
    ripple.style.opacity = '0';
  });
  setTimeout(() => ripple.remove(), 600);
});

function appendRippleKeyframes() {
  if (document.getElementById('rippleKeyframes')) return;
  const s = document.createElement('style');
  s.id = 'rippleKeyframes';
  s.textContent = `
    .ripple-effect { will-change: transform, opacity; }
  `;
  document.head.appendChild(s);
}

// ======== Helpers ========
function clamp(n, a, b) { return Math.max(a, Math.min(n, b)); }
