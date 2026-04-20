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
  // Fetch initial dynamic data
  fetchDynamicData();
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

// ======== Forms (Mock API handling) ========
function initForms() {
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactFormSubmit);
  }
}

async function handleContactFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  if (submitBtn) {
    const oldText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    
    try {
      // Determine if it's a prayer request or regular contact based on a field or generic fallback
      const payload = {
        type: data.subject?.toLowerCase().includes("pray") ? "prayer" : "contact",
        sender: data.name,
        email: data.email,
        subject: data.subject || "Website Contact",
        message: data.message,
        date: new Date().toISOString().split('T')[0]
      };

      const res = await fetch('/api/messages', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        alert("Thanks — your message was sent! (Now connected to Admin Dashboard Inbox)");
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch (error) {
       console.error("Error submitting form", error);
       alert("Network error. Is the admin panel mock API running?");
    } finally {
       submitBtn.disabled = false;
       submitBtn.textContent = oldText;
       form.reset();
    }
  }
}

// ======== Fetching dynamic data from mock API ========
async function fetchDynamicData() {
  try {
    const [eventsRes, announcementsRes, sermonsRes, ministriesRes] = await Promise.all([
      fetch('/api/events').catch(() => null),
      fetch('/api/announcements').catch(() => null),
      fetch('/api/sermons').catch(() => null),
      fetch('/api/ministries').catch(() => null)
    ]);
    
    if (eventsRes && eventsRes.ok) {
      const events = await eventsRes.json();
      renderEvents(events);
    }

    if (announcementsRes && announcementsRes.ok) {
      const announcements = await announcementsRes.json();
      renderAnnouncements(announcements);
    }

    if (sermonsRes && sermonsRes.ok) {
        const data = await sermonsRes.json();
        renderSermons(data.sermons, data.livestream);
      renderHomeLivestream(data.livestream);
    } else {
      renderHomeLivestream(null);
    }

    if (ministriesRes && ministriesRes.ok) {
       const ministries = await ministriesRes.json();
       renderMinistries(ministries);
    }
    
  } catch (err) {
    console.error("Failed to load dynamic data. Falling back to static html.", err);
    renderHomeLivestream(null);
  }
}

function renderAnnouncements(announcements) {
  if (!announcements || announcements.length === 0) return;

  // Render Ticker
  const tickerContainer = document.querySelector('.ticker-content');
  const scrollingAnnouncements = announcements.filter(a => a.type?.toLowerCase() === 'scrolling' || a.type?.toLowerCase() === 'ticker');
  
  if (tickerContainer && scrollingAnnouncements.length > 0) {
    tickerContainer.innerHTML = scrollingAnnouncements.map(a => `<span class="ticker-item">${a.title}: ${a.content || a.message || ''}</span>`).join('');
  }

  // Render Daily/Important
  const dailyAnnouncements = announcements.filter(a => a.type === 'daily' || a.type === 'important');
  // If we had a designated spot on the homepage for daily announcements, we would inject them here.
  // For now, the user requested the scrolling ticker to be dynamic.
}

function extractYouTubeId(url) {
  if (!url) return null;
  const trimmed = String(url).trim();
  if (!trimmed) return null;

  // Accept direct video IDs entered from admin (11 chars).
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  const regExp = /^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/;
  const match = trimmed.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

function renderHomeLivestream(livestream) {
  const container = document.getElementById('homeLiveStreamContainer');
  const cta = document.getElementById('homeLiveStreamCta');
  if (!container) return;

  const fallbackHref = '/connect/join-online/index.html';
  const videoId = livestream?.active && livestream?.link ? extractYouTubeId(livestream.link) : null;

  if (videoId) {
    const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;

    container.innerHTML = `
      <div class="live-stream-frame-wrap">
        <iframe
          class="live-stream-iframe"
          src="https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1"
          title="New Jerusalem Live Stream"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
        ></iframe>
      </div>
      <p class="live-stream-status">Live stream is available now.</p>
    `;

    if (cta) {
      cta.href = watchUrl;
      cta.textContent = 'Watch on YouTube';
      cta.target = '_blank';
      cta.rel = 'noopener noreferrer';
    }
    return;
  }

  container.innerHTML = `
    <div class="live-stream-offline">
      <p>No active livestream right now. Please check again during service time.</p>
    </div>
  `;

  if (cta) {
    cta.href = fallbackHref;
    cta.textContent = 'Go to Join Online';
    cta.removeAttribute('target');
    cta.removeAttribute('rel');
  }
}

function renderSermons(sermons, livestream) {
  if (!sermons || sermons.length === 0) return;

  const track = document.querySelector('.featured-video-track');
  const dotsContainer = document.querySelector('.featured-carousel-dots');
  
  if (!track || !dotsContainer) return;

  // We will replace the static slides with dynamic ones.
  // We'll limit it to max 3 pinned or recent sermons
  const displaySermons = sermons.slice(0, 3);

  let htmlContent = '';
  let dotsContent = '';

  // 1. If livestream is active, inject it as the first slide
  if (livestream && livestream.active && livestream.link) {
    const videoId = extractYouTubeId(livestream.link);
    if (videoId) {
      htmlContent += `
        <article class="featured-video-slide active" data-slide-index="0" aria-hidden="false">
          <div class="featured-video-frame" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
            <iframe 
              src="https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0" 
              title="New Jerusalem Livestream" 
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen
              style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;"
            ></iframe>
            <div class="featured-video-overlay"></div>
            <div class="featured-video-caption">
              <span class="featured-video-tag" style="background: red; color: white;">LIVE NOW</span>
              <h3>Sunday Worship Livestream</h3>
              <p>Join us live in the presence of God from wherever you are.</p>
            </div>
          </div>
        </article>
      `;
      dotsContent += `<button class="featured-carousel-dot active" type="button" aria-label="Show Livestream" aria-current="true"></button>`;
    }
  }

  // 2. Map the rest of the standard sermons into additional slides
  htmlContent += displaySermons.map((sermon, i) => {
    const isFirstSlide = !livestream?.active && i === 0;
    const index = livestream?.active ? i + 1 : i; // offset index if livestream is present

    return `
       <article class="featured-video-slide ${isFirstSlide ? 'active' : ''}" data-slide-index="${index}" aria-hidden="${isFirstSlide ? 'false' : 'true'}">
          <div class="featured-video-frame">
            <video class="featured-video" muted loop playsinline preload="metadata" poster="${sermon.thumbnail || 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=1600'}">
              <source src="${sermon.videoUrl || 'https://videos.pexels.com/video-files/3987769/3987769-hd_1920_1080_24fps.mp4'}" type="video/mp4">
            </video>
            <div class="featured-video-overlay"></div>
            <div class="featured-video-caption">
              <span class="featured-video-tag">${sermon.series || 'Sermon'}</span>
              <h3>${sermon.title}</h3>
              <p>${sermon.description || 'Watch the latest message'}</p>
            </div>
          </div>
        </article>
    `;
  }).join('');

  dotsContent += displaySermons.map((sermon, i) => {
    const isFirstSlide = !livestream?.active && i === 0;
    return `<button class="featured-carousel-dot ${isFirstSlide ? 'active' : ''}" type="button" aria-label="Show ${sermon.title}" aria-current="${isFirstSlide ? 'true' : 'false'}"></button>`;
  }).join('');

  track.innerHTML = htmlContent;
  dotsContainer.innerHTML = dotsContent;

  // Re-initialize carousel events now that DOM has changed
  if (typeof initFeaturedVideoCarousel === 'function') {
    initFeaturedVideoCarousel();
  }
}

function renderEvents(events) {
  const allEventsGrid = document.getElementById('allEvents');
  const upcomingEventsGrid = document.querySelector('#upcoming-events .events-grid');
  
  if (!events || events.length === 0) return;

  const createEventHTML = (event) => {
    // Basic date parsing to get month and day
    const d = new Date(event.date);
    const month = d.toLocaleString('default', { month: 'short' }) || "TBD";
    const day = d.getDate() || "--";
    const weekday = d.toLocaleString('default', { weekday: 'short' }) || "";

    return `
      <article class="event-card event-item" data-category="all">
        <header class="event-header">
           <div class="event-date">${weekday}, ${month} ${day}</div>
           <h3 class="event-title">${event.title}</h3>
        </header>
        <div class="event-body">
           <p class="event-desc">${event.description}</p>
           <div class="event-meta">
             <span class="material-icons">place</span> ${event.location} 
             <span class="material-icons">schedule</span> ${event.time}
           </div>
           <div class="event-actions">
             <a href="#" class="btn ripple">Details</a>
           </div>
        </div>
      </article>
    `;
  };

  const createHomeEventHTML = (event) => {
    const d = new Date(event.date);
    const month = d.toLocaleString('default', { month: 'short' }) || "TBD";
    const day = d.getDate() || "--";
    const weekday = d.toLocaleString('default', { weekday: 'short' }) || "";

    return `
      <article class="event-card">
        <div class="event-card-header">
          <div class="event-date-wrap">
            <span class="event-weekday">${weekday}</span>
            <time class="event-date-box" datetime="${event.date}">
              <span class="event-month">${month}</span>
              <span class="event-day">${day}</span>
            </time>
          </div>
        </div>
        <div class="event-card-content">
          <h3>${event.title}</h3>
          <p class="event-time"><span class="material-icons">schedule</span> ${event.time}</p>
          <p class="event-location"><span class="material-icons">place</span> ${event.location}</p>
          <p class="event-desc">${event.description}</p>
          <a href="/connect/events" class="btn-event">Learn More</a>
        </div>
      </article>
    `;
  };

  if (allEventsGrid) {
    allEventsGrid.innerHTML = events.map(createEventHTML).join('');
  }

  if (upcomingEventsGrid) {
    upcomingEventsGrid.innerHTML = events.slice(0, 3).map(createHomeEventHTML).join('');
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

// Form mock functions removed to prefer new mock API handling

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

function renderMinistries(ministries) {
  if (!ministries || ministries.length === 0) return;

  const ministriesGrid = document.querySelector('.ministry-features-grid');
  // if on a dedicated ministries page we might target a different container
  const allMinistriesGrid = document.querySelector('#ministries .grid-3');

  const createMinistryHTML = (m) => `
    <div class="ministry-feature-card">
      <div class="ministry-feature-image">
        <img src="https://images.unsplash.com/photo-1507692049790-de58290a4334?q=80&w=800" alt="${m.name}">
      </div>
      <div class="ministry-feature-content">
        <h3>${m.name}</h3>
        <p>${m.description}</p>
        <a href="/ministry/${m.name.toLowerCase().replace(/\s+/g, '-')}" class="link-arrow">Learn More →</a>
      </div>
    </div>
  `;

  const createDetailMinistryHTML = (m) => `
    <div class="material-card">
      <h3>${m.name}</h3>
      <p>${m.description}</p>
      <div style="margin-top:0.5rem; font-size:0.85rem; color:var(--text-light);">
        <p><span class="material-icons" style="font-size:1rem;vertical-align:middle;margin-right:4px;">schedule</span> ${m.meeting}</p>
        <p><span class="material-icons" style="font-size:1rem;vertical-align:middle;margin-right:4px;">person</span> ${m.contact} (${m.phone})</p>
      </div>
    </div>
  `;

  if (ministriesGrid) {
    ministriesGrid.innerHTML = ministries.slice(0, 4).map(createMinistryHTML).join('');
  }

  if (allMinistriesGrid) {
    allMinistriesGrid.innerHTML = ministries.map(createDetailMinistryHTML).join('');
  }
}

// ======== Helpers ========
function clamp(n, a, b) { return Math.max(a, Math.min(n, b)); }
