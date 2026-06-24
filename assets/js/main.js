// Scroll progress bar
const scrollBar = document.getElementById('scrollBar');
if (scrollBar) {
  window.addEventListener('scroll', () => {
    const h = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    scrollBar.style.width = (window.scrollY / h * 100) + '%';
  });
}

// Nav shrink + hide on scroll direction
const navbar = document.getElementById('navbar');
if (navbar) {
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 40);
    if (y > 120) {
      navbar.classList.toggle('nav-hidden', y > lastScroll && y > 200);
    } else {
      navbar.classList.remove('nav-hidden');
    }
    lastScroll = y;
  });
}

// Hamburger toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');
function closeNav() {
  navLinks.classList.remove('open');
  hamburger.classList.remove('active');
  if (navOverlay) navOverlay.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.querySelectorAll('.dropdown-menu.open').forEach(m => m.classList.remove('open'));
  document.body.style.overflow = '';
}
function openNav() {
  navLinks.classList.add('open');
  hamburger.classList.add('active');
  if (navOverlay) navOverlay.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    if (navLinks.classList.contains('open')) {
      closeNav();
    } else {
      openNav();
    }
  });
  if (navOverlay) navOverlay.addEventListener('click', closeNav);
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) closeNav();
    });
  });
}

// Mobile dropdown toggle
document.querySelectorAll('.nav-links > li > a').forEach(link => {
  const parent = link.parentElement;
  const menu = parent.querySelector('.dropdown-menu');
  if (menu && window.innerWidth <= 768) {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      menu.classList.toggle('open');
    });
  }
});

// Back to top
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 400);
  });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Scroll reveal
const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
if (revealElements.length) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
  revealElements.forEach(el => revealObserver.observe(el));
}

// Animated counters
const counters = document.querySelectorAll('.counter');
if (counters.length) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const duration = 1500;
        const start = performance.now();
        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * target);
          if (progress < 1) requestAnimationFrame(update);
          else el.textContent = target;
        }
        requestAnimationFrame(update);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));
}

// FAQ / Program accordion
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.setAttribute('aria-expanded', 'false');
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const isOpen = item.classList.contains('open');
    const parent = item.closest('.faq-list');
    if (parent) {
      parent.querySelectorAll('.faq-item.open').forEach(el => {
        if (el !== item) el.classList.remove('open');
        el.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });
    }
    item.classList.toggle('open', !isOpen);
    btn.setAttribute('aria-expanded', !isOpen);
  });
});

// Admissions popup
const popup = document.getElementById('admissionsPopup');
const popupClose = document.getElementById('popupClose');
const popupDismiss = document.getElementById('popupDismiss');

if (popup && popupClose && popupDismiss) {
  const dismissed = sessionStorage.getItem('popupDismissed');
  if (!dismissed) {
    setTimeout(() => popup.classList.add('open'), 800);
  }
  function closePopup() {
    popup.classList.remove('open');
    sessionStorage.setItem('popupDismissed', 'true');
  }
  popupClose.addEventListener('click', closePopup);
  popupDismiss.addEventListener('click', closePopup);
  popup.addEventListener('click', (e) => {
    if (e.target === popup) closePopup();
  });
}

// ===== DYNAMIC FEATURES =====

// Live clock in top bar
function updateClock() {
  const clock = document.getElementById('liveClock');
  if (!clock) return;
  const now = new Date();
  const ghanaTime = now.toLocaleTimeString('en-GH', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true, timeZone: 'Africa/Accra' });
  clock.textContent = ghanaTime;
}
updateClock();
setInterval(updateClock, 1000);

// Dynamic copyright year
const yearEl = document.getElementById('currentYear');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Typewriter effect
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const phrases = JSON.parse(el.dataset.phrases || '["Excellence in Higher Education"]');
  let phraseIdx = 0, charIdx = 0, isDeleting = false;

  function type() {
    const current = phrases[phraseIdx];
    if (!isDeleting) {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        isDeleting = true;
        setTimeout(type, 2000);
        return;
      }
      setTimeout(type, 60 + Math.random() * 40);
    } else {
      el.textContent = current.substring(0, charIdx);
      charIdx--;
      if (charIdx < 0) {
        isDeleting = false;
        charIdx = 0;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, 30 + Math.random() * 20);
    }
  }
  type();
}
initTypewriter();

// Testimonial carousel
function initCarousel() {
  const slides = document.querySelectorAll('.test-slide');
  const dots = document.querySelectorAll('.test-dot');
  const prev = document.querySelector('.test-arrow-prev');
  const next = document.querySelector('.test-arrow-next');
  if (!slides.length) return;

  let current = 0;
  function show(idx) {
    slides.forEach((s, i) => {
      s.classList.toggle('active', i === idx);
    });
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === idx);
      d.setAttribute('aria-selected', i === idx);
      d.setAttribute('tabindex', i === idx ? '0' : '-1');
    });
    current = idx;
  }

  if (prev) prev.addEventListener('click', () => show((current - 1 + slides.length) % slides.length));
  if (next) next.addEventListener('click', () => show((current + 1) % slides.length));
  dots.forEach((d, i) => d.addEventListener('click', () => show(i)));

  // Auto-rotate
  let interval = setInterval(() => show((current + 1) % slides.length), 5000);
  const container = document.querySelector('.test-carousel');
  if (container) {
    container.addEventListener('mouseenter', () => clearInterval(interval));
    container.addEventListener('mouseleave', () => { interval = setInterval(() => show((current + 1) % slides.length), 5000); });
  }
}
initCarousel();

// Scroll spy for nav
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links > li > a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = '#' + entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === id);
        });
      }
    });
  }, { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' });
  sections.forEach(s => observer.observe(s));
}
initScrollSpy();

// ===== CUSTOM CURSOR =====
(function() {
  const ring = document.getElementById('cursorRing');
  if (!ring || window.innerWidth <= 768) return;
  let mx = 0, my = 0;
  document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });
  document.querySelectorAll('a, button, .prog-card, .alumni-card, .video-card, .masonry-item').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });
  document.addEventListener('mouseleave', () => ring.classList.add('hidden'));
  document.addEventListener('mouseenter', () => ring.classList.remove('hidden'));
  function updateCursor() {
    ring.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
    requestAnimationFrame(updateCursor);
  }
  updateCursor();
})();

// ===== FLOATING SEARCH =====
(function() {
  const btn = document.getElementById('searchFloatBtn');
  const overlay = document.getElementById('searchOverlay');
  const input = document.getElementById('searchInput');
  const results = document.getElementById('searchResults');
  if (!btn || !overlay || !input || !results) return;

  const searchData = [
    { title: 'Mechanical Engineering Technology', cat: 'Engineering', url: 'index.html#allprograms' },
    { title: 'Welding & Fabrication', cat: 'Engineering', url: 'index.html#allprograms' },
    { title: 'Refrigeration & Air Conditioning', cat: 'Engineering', url: 'index.html#allprograms' },
    { title: 'Plant Engineering', cat: 'Engineering', url: 'index.html#allprograms' },
    { title: 'Maintenance Engineering', cat: 'Engineering', url: 'index.html#allprograms' },
    { title: 'Computer Hardware Technology', cat: 'Computing', url: 'index.html#allprograms' },
    { title: 'Computer Network Technology', cat: 'Computing', url: 'index.html#allprograms' },
    { title: 'Server Administration', cat: 'Computing', url: 'index.html#allprograms' },
    { title: 'Computer Science', cat: 'Computing', url: 'index.html#allprograms' },
    { title: 'Business Administration', cat: 'Business', url: 'index.html#allprograms' },
    { title: 'BA English', cat: 'Humanities', url: 'index.html#allprograms' },
    { title: 'Admissions 2026/2027', cat: 'Admissions', url: 'admissions.html' },
    { title: 'About STSC University', cat: 'About', url: 'about.html' },
    { title: 'Contact Us', cat: 'Contact', url: 'contact.html' },
    { title: 'Scholarships & Financial Aid', cat: 'Admissions', url: 'admissions.html#scholarships' },
    { title: 'Fee Calculator', cat: 'Admissions', url: 'admissions.html' }
  ];

  btn.addEventListener('click', () => {
    overlay.classList.add('open');
    setTimeout(() => input.focus(), 200);
    document.body.style.overflow = 'hidden';
  });

  function closeSearch() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    input.value = '';
    results.innerHTML = '';
  }

  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeSearch(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSearch(); });

  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    if (!q) { results.innerHTML = ''; return; }
    const filtered = searchData.filter(d => d.title.toLowerCase().includes(q) || d.cat.toLowerCase().includes(q));
    if (!filtered.length) { results.innerHTML = '<div style="padding:16px;color:var(--text-light);font-size:0.9rem;">No results found</div>'; return; }
    results.innerHTML = filtered.map(d => `<a href="${d.url}" class="search-result-item" onclick="document.getElementById('searchOverlay').classList.remove('open');document.body.style.overflow=''"><div class="sr-title">${hl(d.title, q)}</div><div class="sr-meta">${d.cat}</div></a>`).join('');
  });

  function hl(text, q) {
    const idx = text.toLowerCase().indexOf(q);
    if (idx === -1) return text;
    return text.substring(0, idx) + '<strong>' + text.substring(idx, idx + q.length) + '</strong>' + text.substring(idx + q.length);
  }
})();

// ===== WORD-BY-WORD TEXT REVEAL =====
(function() {
  document.querySelectorAll('.word-reveal').forEach(el => {
    const words = el.textContent.split(' ');
    el.innerHTML = '';
    words.forEach((word, i) => {
      const span = document.createElement('span');
      span.textContent = word + (i < words.length - 1 ? '\u00A0' : '');
      span.style.transitionDelay = (i * 0.06) + 's';
      el.appendChild(span);
    });
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('span').forEach(s => s.classList.add('visible'));
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    observer.observe(el);
  });
})();

// ===== DARK MODE PERSISTENCE =====
window.__execCheck = 342;
(function() {
  const toggle = document.getElementById('darkModeToggle');
  if (!toggle) return;
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    toggle.checked = true;
  } else if (saved === 'light') {
    document.documentElement.removeAttribute('data-theme');
    toggle.checked = false;
  }
  toggle.addEventListener('change', () => {
    if (toggle.checked) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  });
})();

// ===== FEE CALCULATOR =====
// (handled by inline script in admissions.html)

// ===== COURSE COMPARISON TOOL =====
(function() {
  const btns = document.querySelectorAll('.compare-toggle-btn');
  const table = document.getElementById('compareTable');
  if (!btns.length || !table) return;

  const data = {
    mech: { title1: 'Mechanical Engineering', title2: '', title3: '', vals: { c1: 'B.Eng Mechanical Engineering Technology', c2: '4 Years (8 Semesters)', c3: 'Design, Manufacturing, Thermodynamics, Energy', c4: 'Mechanical Engineer, Plant Manager, Energy Consultant', c5: 'High — 4 semesters', c6: 'Extensive (12+ hrs/week)', c7: '12 weeks (Year 3)', c8: 'GH\u20B5 8,500' } },
    cs: { title1: '', title2: 'Computer Science', title3: '', vals: { c1: 'B.Sc Computer Science', c2: '4 Years (8 Semesters)', c3: 'AI, ML, Software Dev, Data Science', c4: 'Software Engineer, Data Scientist, AI Specialist', c5: 'High — 4 semesters', c6: 'Moderate (6-8 hrs/week)', c7: '12 weeks (Year 3)', c8: 'GH\u20B5 7,200' } },
    ba: { title1: '', title2: '', title3: 'Business Administration', vals: { c1: 'BBA Business Administration', c2: '4 Years (8 Semesters)', c3: 'Management, Marketing, Finance, Entrep.', c4: 'Manager, Entrepreneur, Marketing Director', c5: 'Moderate — 2 semesters', c6: 'Minimal (2-4 hrs/week)', c7: '12 weeks (Year 3)', c8: 'GH\u20B5 6,500' } },
    weld: { title1: 'Welding & Fabrication', title2: '', title3: '', vals: { c1: 'B.Eng Welding & Fabrication', c2: '4 Years (8 Semesters)', c3: 'Arc Welding, MIG, TIG, NDT, Fabrication', c4: 'Welding Engineer, Fabrication Supervisor, QC Inspector', c5: 'Moderate — 3 semesters', c6: 'Extensive (14+ hrs/week)', c7: '12 weeks (Year 3)', c8: 'GH\u20B5 7,800' } },
    net: { title1: '', title2: 'Network Technology', title3: '', vals: { c1: 'B.Sc Computer Network Technology', c2: '4 Years (8 Semesters)', c3: 'Network Design, Cybersecurity, Cloud, Routing', c4: 'Network Engineer, Security Analyst, Cloud Admin', c5: 'Moderate — 3 semesters', c6: 'Moderate (6-8 hrs/week)', c7: '12 weeks (Year 3)', c8: 'GH\u20B5 7,200' } },
    eng: { title1: '', title2: '', title3: 'BA English', vals: { c1: 'BA English', c2: '4 Years (8 Semesters)', c3: 'Literature, Creative Writing, Linguistics, Media', c4: 'Journalist, Editor, Writer, Educator', c5: 'Low — 1 semester', c6: 'Minimal (0-2 hrs/week)', c7: '12 weeks (Year 3)', c8: 'GH\u20B5 5,800' } }
  };

  const cTitles = [document.getElementById('cTitle1'), document.getElementById('cTitle2'), document.getElementById('cTitle3')];
  const cVals = [
    [document.querySelector('.cVal1'), document.querySelector('.cVal2'), document.querySelector('.cVal3')],
    document.querySelectorAll('.cVal2'), document.querySelectorAll('.cVal3')
  ];
  // re-query all cells per column
  function getCol(idx) { return table.querySelectorAll(`td:nth-child(${idx+2})`); }

  let selected = [];
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.compare;
      if (selected.includes(key)) {
        selected = selected.filter(k => k !== key);
        btn.classList.remove('active');
      } else if (selected.length < 3) {
        selected.push(key);
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
        selected = selected.filter(k => k !== key);
        return;
      }
      updateTable();
    });
  });

  function updateTable() {
    for (let i = 0; i < 3; i++) {
      const col = getCol(i);
      if (selected[i]) {
        const d = data[selected[i]];
        cTitles[i].textContent = d.title1 || d.title2 || d.title3 || 'Programme ' + String.fromCharCode(65 + i);
        col.forEach((cell, j) => {
          const key = 'c' + (j + 1);
          cell.textContent = d.vals[key] || '';
        });
      } else {
        cTitles[i].textContent = '—';
        col.forEach(cell => cell.textContent = '—');
      }
    }
  }
  // Default: select first 3
  btns.forEach(b => { if (selected.length < 3) { selected.push(b.dataset.compare); b.classList.add('active'); } });
  updateTable();
})();

// ===== BLUR-UP IMAGES =====
(function() {
  document.querySelectorAll('.blur-up').forEach(img => {
    if (img.complete) { img.classList.add('loaded'); return; }
    img.addEventListener('load', () => img.classList.add('loaded'));
    img.addEventListener('error', () => img.classList.add('loaded'));
  });
})();

// ===== GLOBAL LIGHTBOX FUNCTION =====
window.openLightbox = function(src) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  if (!lightbox || !lightboxImg) return;
  lightboxImg.src = src;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
};

// ===== COOKIE CONSENT =====
(function() {
  if (localStorage.getItem('cookieConsent')) return;
  const banner = document.createElement('div');
  banner.id = 'cookieBanner';
  banner.style.cssText = 'position:fixed;bottom:0;left:0;right:0;z-index:9999;background:var(--primary-dark);color:#fff;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;font-size:0.85rem;';
  banner.innerHTML = '<span>We use cookies to improve your experience. By continuing you agree to our policy.</span><div style="display:flex;gap:8px;"><button id="cookieAccept" style="background:var(--accent);color:var(--primary-dark);border:none;padding:8px 20px;border-radius:8px;font-weight:700;cursor:pointer;font-size:0.82rem;">Accept</button><button id="cookieDecline" style="background:rgba(255,255,255,0.1);color:#fff;border:none;padding:8px 20px;border-radius:8px;cursor:pointer;font-size:0.82rem;">Decline</button></div>';
  document.body.appendChild(banner);
  document.getElementById('cookieAccept').onclick = () => { localStorage.setItem('cookieConsent','accepted'); banner.remove(); };
  document.getElementById('cookieDecline').onclick = () => { localStorage.setItem('cookieConsent','declined'); banner.remove(); };
})();

// ===== CHATBOT =====
(function() {
  const chatBtn = document.createElement('button');
  chatBtn.id = 'chatbotBtn';
  chatBtn.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#fff" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>';
  chatBtn.setAttribute('aria-label', 'Open admissions chatbot');
  chatBtn.style.cssText = 'position:fixed;bottom:160px;right:28px;z-index:996;width:52px;height:52px;border-radius:50%;border:none;background:var(--accent);cursor:pointer;box-shadow:0 4px 16px rgba(200,163,78,0.3);display:flex;align-items:center;justify-content:center;transition:transform 0.2s;';
  chatBtn.onmouseenter = () => chatBtn.style.transform = 'scale(1.08)';
  chatBtn.onmouseleave = () => chatBtn.style.transform = '';
  document.body.appendChild(chatBtn);

  const panel = document.createElement('div');
  panel.id = 'chatbotPanel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Admissions chatbot');
  panel.style.cssText = 'position:fixed;bottom:220px;right:28px;z-index:995;width:340px;max-height:460px;background:var(--white);border-radius:16px;box-shadow:0 16px 48px rgba(0,0,0,0.15);display:none;flex-direction:column;overflow:hidden;border:1px solid #e2e8f0;';
  panel.innerHTML = '<div style="background:var(--primary);color:#fff;padding:16px 20px;font-weight:700;font-size:0.95rem;display:flex;justify-content:space-between;align-items:center;"><span>STSC Assistant</span><button id="chatbotClose" style="background:none;border:none;color:#fff;font-size:1.2rem;cursor:pointer;padding:0 4px;">&times;</button></div><div id="chatbotMsgs" style="flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:8px;min-height:200px;max-height:320px;"></div><div style="padding:12px 16px;border-top:1px solid #eef2f6;display:flex;gap:8px;"><input id="chatbotInput" type="text" placeholder="Ask about admissions, fees..." style="flex:1;padding:10px 14px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:0.85rem;outline:none;"><button id="chatbotSend" style="background:var(--accent);color:var(--primary-dark);border:none;border-radius:10px;padding:10px 16px;font-weight:700;font-size:0.85rem;cursor:pointer;">Send</button></div>';
  document.body.appendChild(panel);

  const msgs = document.getElementById('chatbotMsgs');
  const input = document.getElementById('chatbotInput');
  const sendBtn = document.getElementById('chatbotSend');
  const closeBtn = document.getElementById('chatbotClose');

  const faq = [
    { q: /hello|hi|hey/i, a: 'Hello! Welcome to STSC University. Ask me anything about admissions, programmes, fees, or scholarships!' },
    { q: /apply|admission|how.*apply/i, a: 'To apply, visit our Admissions page and complete the online form. You\'ll need your WASSCE/SSSCE results, personal details, and programme preference. Our team responds within 48 hours.' },
    { q: /requirement|entry|wasce|ssce|credit/i, a: 'WASSCE: Credits (A1-C6) in English, Maths, and 3 electives. SSSCE: Credits (A-D) in the same. Mature entry (25+) and diploma holders also qualify.' },
    { q: /programme|program|course|degree/i, a: 'We offer 11 accredited 4-year bachelor\'s degrees: Engineering (5), Computing & IT (4), Business Administration, and BA English.' },
    { q: /fee|tuition|cost|price|money|gh/i, a: 'Annual tuition ranges from GH\u20B5 5,800 (BA English) to GH\u20B5 8,500 (Mechanical Engineering). Scholarships cover up to 40%. Use our Fee Calculator on the Admissions page!' },
    { q: /scholarship|financial.*aid|discount|early.*bird/i, a: 'We offer Merit Scholarships (up to 40%), Need-Based Aid (20-30%), and an Early Bird Discount (10% off if you apply before 31 Aug 2026).' },
    { q: /deadline|when|date|start/i, a: 'Applications for 2026/2027 are open now! Early bird deadline: 31 August 2026. Regular applications accepted year-round.' },
    { q: /accommodation|hostel|residence|stay|live/i, a: 'On-campus hostels and off-campus shared accommodation are available. Costs range from GH\u20B5 1,500 to GH\u20B5 2,400 per year.' },
    { q: /contact|phone|email|call|reach|location|address/i, a: 'You can reach us at +233 257 077 972 or info@successtheological.edu. We\'re located at Kasoa-Nyanyano, Central Region, Ghana.' },
    { q: /how long|duration|years/i, a: 'All our bachelor\'s degree programmes are 4 years (8 semesters), including a 12-week industrial attachment in Year 3.' },
    { q: /thank|thanks/i, a: 'You\'re welcome! If you have more questions, feel free to ask. Visit stscuniversity.edu.gh for more info!' }
  ];

  function addMsg(text, isUser) {
    const div = document.createElement('div');
    div.textContent = text;
    div.style.cssText = `max-width:85%;padding:10px 14px;border-radius:12px;font-size:0.85rem;line-height:1.5;align-self:${isUser?'flex-end':'flex-start'};background:${isUser?'var(--accent)':'#f1f5f9'};color:${isUser?'var(--primary-dark)':'var(--text)'};`;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function getResponse(q) {
    for (const item of faq) {
      if (item.q.test(q)) return item.a;
    }
    return 'I\'m not sure about that. Please call +233 257 077 972 or email info@successtheological.edu and our team will help you!';
  }

  chatBtn.onclick = () => {
    const isOpen = panel.style.display === 'flex';
    panel.style.display = isOpen ? 'none' : 'flex';
    chatBtn.style.display = isOpen ? 'flex' : 'none';
    if (!isOpen && !msgs.children.length) {
      addMsg('Hi! I\'m the STSC admissions assistant. Ask me anything about our programmes, fees, or how to apply.', false);
    }
    if (!isOpen) setTimeout(() => input.focus(), 300);
  };
  closeBtn.onclick = () => { panel.style.display = 'none'; chatBtn.style.display = 'flex'; };

  function sendMsg() {
    const q = input.value.trim();
    if (!q) return;
    addMsg(q, true);
    input.value = '';
    setTimeout(() => addMsg(getResponse(q), false), 400 + Math.random() * 300);
  }
  sendBtn.onclick = sendMsg;
  input.onkeydown = (e) => { if (e.key === 'Enter') sendMsg(); };
})();

// ===== MULTI-LANGUAGE (EN/TWI) WITH GEO DETECTION =====
(function() {
  const btn = document.getElementById('langToggle');
  if (!btn) return;

  function detectGeoLang() {
    const lang = navigator.language || navigator.userLanguage || '';
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    const isGhana = /^en-gh$/i.test(lang) || tz === 'Africa/Accra';
    const isTwiPref = /^tw$/i.test(lang) || lang.startsWith('ak-');
    return (isGhana || isTwiPref) ? 'tw' : 'en';
  }

  let stored = localStorage.getItem('lang');
  let currentLang = stored || detectGeoLang();
  let dict = {};

  function applyLang(lang) {
    btn.textContent = lang === 'en' ? 'EN' : 'TW';
    document.documentElement.lang = lang === 'en' ? 'en-GH' : 'tw';
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (dict[key]) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = dict[key];
        else el.textContent = dict[key];
      }
    });
  }

  function loadLang(lang) {
    return fetch('assets/lang/' + lang + '.json')
      .then(r => r.json())
      .then(d => { dict = d; applyLang(lang); })
      .catch(() => {});
  }

  loadLang(currentLang);

  btn.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'tw' : 'en';
    localStorage.setItem('lang', currentLang);
    loadLang(currentLang);
  });
})();

// ===== PWA SERVICE WORKER =====
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}

// ===== INSTALL PROMPT =====
(function() {
  let deferredPrompt;
  const installBanner = document.createElement('div');
  installBanner.className = 'pwa-install-banner';
  installBanner.innerHTML = '<span>Install STSC University for offline access</span><button id="pwaInstallBtn">Install</button><button id="pwaDismissBtn" aria-label="Dismiss">&times;</button>';
  installBanner.style.cssText = 'display:none;position:fixed;bottom:80px;left:16px;right:16px;z-index:999;background:var(--white);border-radius:12px;padding:16px 20px;box-shadow:0 8px 32px rgba(0,0,0,0.15);align-items:center;gap:12px;border:1px solid #e2e8f0;max-width:400px;margin:0 auto;';
  installBanner.querySelector('span').style.cssText = 'flex:1;font-size:0.85rem;font-weight:600;';
  const installBtn = installBanner.querySelector('#pwaInstallBtn');
  installBtn.style.cssText = 'background:var(--accent);color:var(--primary-dark);border:none;padding:8px 18px;border-radius:8px;font-weight:700;font-size:0.82rem;cursor:pointer;';
  const dismissBtn = installBanner.querySelector('#pwaDismissBtn');
  dismissBtn.style.cssText = 'background:none;border:none;font-size:1.2rem;cursor:pointer;color:var(--text-light);padding:4px 8px;';

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    document.body.appendChild(installBanner);
    installBanner.style.display = 'flex';
  });

  installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === 'accepted') installBanner.style.display = 'none';
    deferredPrompt = null;
  });

  dismissBtn.addEventListener('click', () => { installBanner.style.display = 'none'; });
})();

// Floating orbs in hero (dynamic creation)
function createFloatingOrbs() {
  const hero = document.querySelector('.hero');
  if (!hero || hero.querySelector('.floating-orb')) return;
  for (let i = 0; i < 3; i++) {
    const orb = document.createElement('div');
    orb.className = 'floating-orb';
    hero.appendChild(orb);
  }
}
createFloatingOrbs();

// Reveal observer for .reveal-scale and .reveal-left/.reveal-right
const extraReveal = document.querySelectorAll('.reveal-scale, .reveal-left, .reveal-right');
if (extraReveal.length) {
  const extraObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        extraObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
  extraReveal.forEach(el => extraObserver.observe(el));
}

// Hero slider
(function() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  const hero = document.querySelector('.hero');
  if (!slides.length || !dots.length) return;

  let current = 0;
  let interval = setInterval(nextSlide, 6000);

  function goToSlide(idx) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    slides[idx].classList.add('active');
    dots[idx].classList.add('active');
    current = idx;
  }

  function nextSlide() { goToSlide((current + 1) % slides.length); }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goToSlide(parseInt(dot.dataset.slide));
      clearInterval(interval);
      interval = setInterval(nextSlide, 6000);
    });
  });

  if (hero) {
    hero.addEventListener('mouseenter', () => clearInterval(interval));
    hero.addEventListener('mouseleave', () => { clearInterval(interval); interval = setInterval(nextSlide, 6000); });
  }
  goToSlide(0);
})();

// ===== PARTICLES IN HERO =====
(function() {
  const hero = document.querySelector('.hero');
  if (!hero || hero.querySelector('canvas')) return;
  const canvas = document.createElement('canvas');
  canvas.className = 'particle-canvas';
  canvas.style.cssText = 'position:absolute;inset:0;z-index:0;pointer-events:none;';
  hero.insertBefore(canvas, hero.firstChild);
  const ctx = canvas.getContext('2d');
  let particles = [], w, h;

  function resize() { w = canvas.width = canvas.offsetWidth; h = canvas.height = canvas.offsetHeight; }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < 50; i++) {
    particles.push({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2.5 + 1, o: Math.random() * 0.3 + 0.05
    });
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,163,78,${p.o})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

// ===== 3D TILT CARDS =====
(function() {
  const cards = document.querySelectorAll('.tilt-card');
  if (!cards.length) return;
  cards.forEach(card => {
    const inner = card.querySelector('.tilt-card-inner');
    if (!inner) return;
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      inner.style.transform = `rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      inner.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });
  });
})();

// ===== PROGRAM FILTER TABS =====
(function() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('#progCards .prog-card');
  if (!filterBtns.length || !cards.length) return;
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const filter = btn.dataset.filter;
      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
})();

// ===== QUICK-VIEW MODAL =====
(function() {
  const modal = document.getElementById('quickViewModal');
  const closeBtn = document.getElementById('modalClose');
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalMeta = document.getElementById('modalMeta');
  const modalDesc = document.getElementById('modalDesc');
  const modalCta = document.getElementById('modalCta');
  if (!modal || !closeBtn) return;

  const programData = {
    mech: { title: 'Mechanical Engineering Technology', meta: 'B.Eng | 4 Years | Engineering School', desc: 'Study design, manufacturing, thermodynamics, energy systems, and CAD/CAM. Graduates work in automotive, aerospace, manufacturing, and energy sectors across Ghana and internationally.', img: 'assets/images/programs/mechanical-engineering.jpg' },
    weld: { title: 'Welding & Fabrication', meta: 'B.Eng | 4 Years | Engineering School', desc: 'Arc welding, MIG, TIG, structural fabrication, quality control, and NDT inspection. Hands-on training in modern welding workshops.', img: 'assets/images/programs/welding-fabrication.jpg' },
    rac: { title: 'Refrigeration & Air Conditioning', meta: 'B.Eng | 4 Years | Engineering School', desc: 'HVAC systems, cold chain management, sustainable cooling, and climate control. Ghana\'s growing HVAC industry needs skilled engineers.', img: 'assets/images/programs/refrigeration-ac.jpg' },
    plant: { title: 'Plant Engineering', meta: 'B.Eng | 4 Years | Engineering School', desc: 'Industrial plant operations, maintenance management, process optimization, and safety systems. Prepare for roles in manufacturing and process industries.', img: 'assets/images/programs/plant-engineering.jpg' },
    maint: { title: 'Maintenance Engineering', meta: 'B.Eng | 4 Years | Engineering School', desc: 'Predictive maintenance, reliability engineering, asset management, and industrial automation. Critical skills for modern industry.', img: 'assets/images/programs/maintenance-engineering.jpg' },
    hw: { title: 'Computer Hardware Technology', meta: 'B.Sc | 4 Years | Computing School', desc: 'Embedded systems, microprocessors, hardware diagnostics, IoT devices, and digital circuit design. Hands-on lab work with modern equipment.', img: 'assets/images/programs/computer-hardware.jpg' },
    net: { title: 'Computer Network Technology', meta: 'B.Sc | 4 Years | Computing School', desc: 'Network design, cybersecurity, routing & switching, cloud infrastructure, and network administration. Cisco-aligned curriculum.', img: 'assets/images/programs/computer-network.jpg' },
    server: { title: 'Server Administration', meta: 'B.Sc | 4 Years | Computing School', desc: 'Windows/Linux servers, virtualization, cloud computing, enterprise IT management, and disaster recovery. Prepare for systems admin roles.', img: 'assets/images/programs/server-administration.jpg' },
    cs: { title: 'Computer Science', meta: 'B.Sc | 4 Years | Computing School', desc: 'AI, machine learning, software development, data science, algorithms, and database systems. Build the next generation of technology.', img: 'assets/images/programs/computer-science.jpg' },
    ba: { title: 'Business Administration', meta: 'BBA | 4 Years | Business School', desc: 'Management, marketing, finance, accounting, entrepreneurship, and organizational behaviour. Develop leadership skills for the business world.', img: 'assets/images/programs/business-administration.jpg' },
    eng: { title: 'BA English', meta: 'BA | 4 Years | Humanities', desc: 'Literature, creative writing, linguistics, communication studies, and critical analysis. Graduates excel in media, publishing, education, and communications.', img: 'assets/images/programs/ba-english.jpg' }
  };

  document.querySelectorAll('.quick-view-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const key = btn.dataset.program;
      const data = programData[key];
      if (!data) return;
      modalImg.src = data.img;
      modalImg.alt = data.title;
      modalTitle.textContent = data.title;
      modalMeta.textContent = data.meta;
      modalDesc.innerHTML = `<p>${data.desc}</p>`;
      modalCta.href = '#allprograms';
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() { modal.classList.remove('open'); document.body.style.overflow = ''; }
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
})();

// ===== COUNTDOWN TIMER =====
(function() {
  const cdDays = document.getElementById('cdDays');
  const cdHours = document.getElementById('cdHours');
  const cdMins = document.getElementById('cdMins');
  const cdSecs = document.getElementById('cdSecs');
  if (!cdDays) return;

  const deadline = new Date('August 31, 2026 23:59:59 GMT+0000');

  function pad(n) { return n.toString().padStart(2, '0'); }

  function updateCountdown() {
    const now = new Date();
    const diff = Math.max(0, deadline - now);
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);
    cdDays.textContent = pad(d);
    cdHours.textContent = pad(h);
    cdMins.textContent = pad(m);
    cdSecs.textContent = pad(s);
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);
})();

// ===== PARALLAX SCROLLING =====
(function() {
  const sections = document.querySelectorAll('[data-parallax]');
  if (!sections.length || window.innerWidth <= 768) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        sections.forEach(s => {
          const speed = parseFloat(s.dataset.parallax) || 0.1;
          const rect = s.getBoundingClientRect();
          if (rect.bottom < 0 || rect.top > window.innerHeight) return;
          const offset = rect.top * speed;
          s.style.backgroundPositionY = `${offset}px`;
        });
        ticking = false;
      });
      ticking = true;
    }
  });
})();

// ===== LIGHTBOX =====
(function() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  if (!lightbox || !lightboxImg || !lightboxClose) return;

  document.querySelectorAll('.lightbox-trigger').forEach(el => {
    el.addEventListener('click', () => {
      lightboxImg.src = el.src;
      lightboxImg.alt = el.alt;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() { lightbox.classList.remove('open'); document.body.style.overflow = ''; }
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
})();

// ===== LOADING SKELETON =====
(function() {
  document.querySelectorAll('.founder-img').forEach(img => {
    if (img.complete) return;
    const wrap = img.closest('.founder-wrap') || img.parentElement;
    if (!wrap) return;
    const skeleton = document.createElement('div');
    skeleton.className = 'skeleton';
    skeleton.style.cssText = `position:absolute;inset:0;z-index:1;`;
    skeleton.innerHTML = '<div class="skeleton-shimmer"></div>';
    wrap.style.position = 'relative';
    wrap.appendChild(skeleton);
    img.style.opacity = '0';
    img.addEventListener('load', () => {
      skeleton.remove();
      img.style.opacity = '1';
      img.style.transition = 'opacity 0.5s';
    });
    img.addEventListener('error', () => { skeleton.remove(); img.style.opacity = '1'; });
  });
})();

// ===== SCROLL-TRIGGERED PROGRESS BARS =====
(function() {
  const fills = document.querySelectorAll('.progress-bar-fill');
  if (!fills.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.style.width = el.dataset.width || '85%';
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.3 });
  fills.forEach(f => observer.observe(f));
})();

// ===== SMOOTH PAGE TRANSITIONS =====
(function() {
  const overlay = document.getElementById('pageTransition');
  if (!overlay) return;

  document.querySelectorAll('a:not([target="_blank"]):not([href^="#"]):not([href^="javascript"]):not([href^="tel:"]):not([href^="mailto:"]):not([download])').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('//') || href.startsWith('#')) return;
    if (link.closest('.whatsapp-float')) return;

    link.addEventListener('click', (e) => {
      e.preventDefault();
      overlay.classList.add('active');
      setTimeout(() => { window.location.href = href; }, 400);
    });
  });

  window.addEventListener('pageshow', () => {
    overlay.classList.remove('active');
  });
})();

// Form submission with inline validation
const form = document.getElementById('applyForm');
const toast = document.getElementById('toast');
const submitBtn = document.getElementById('submitBtn');

if (form) {
  function validateField(id) {
    const group = document.getElementById(id).closest('.form-group');
    const input = document.getElementById(id);
    if (!group || !input) return true;
    group.classList.remove('has-error');
    if (!input.required) return true;
    if (id === 'email') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
        group.classList.add('has-error');
        return false;
      }
      return true;
    }
    if (!input.value.trim()) {
      group.classList.add('has-error');
      return false;
    }
    return true;
  }

  document.querySelectorAll('#applyForm input, #applyForm select').forEach(el => {
    el.addEventListener('blur', () => validateField(el.id));
    el.addEventListener('input', () => {
      const group = el.closest('.form-group');
      if (group && group.classList.contains('has-error')) validateField(el.id);
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (toast) { toast.className = 'toast'; toast.textContent = ''; }
    const fields = ['firstName', 'lastName', 'email', 'specialization'];
    let valid = true;
    fields.forEach(id => { if (!validateField(id)) valid = false; });
    if (!valid) {
      if (toast) {
        toast.className = 'toast error show';
        toast.textContent = 'Please fix the highlighted fields and try again.';
      }
      const firstErr = document.querySelector('.has-error input, .has-error select');
      if (firstErr) firstErr.focus();
      return;
    }
    if (submitBtn) submitBtn.classList.add('loading');
    setTimeout(() => {
      if (submitBtn) submitBtn.classList.remove('loading');
      if (toast) {
        toast.className = 'toast success show';
        toast.textContent = 'Thank you! A member of our admissions team will contact you within 24 hours.';
      }
      form.reset();
      document.querySelectorAll('.form-group').forEach(g => g.classList.remove('has-error'));
    }, 1200);
  });
}

// ===== VIRTUAL CAMPUS TOUR (PANORAMA DRAG) =====
(function() {
  const container = document.getElementById('panorama');
  const track = document.getElementById('panoramaTrack');
  const dots = document.querySelectorAll('#panoramaDots button');
  if (!container || !track) return;
  let current = 0, total = track.children.length, startX = 0, isDown = false, moved = 0;
  function goTo(i) {
    if (i < 0 || i >= total) return;
    current = i;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    dots.forEach((d, idx) => d.classList.toggle('active', idx === current));
  }
  container.addEventListener('mousedown', e => { isDown = true; startX = e.clientX; moved = 0; });
  window.addEventListener('mousemove', e => { if (!isDown) return; moved = e.clientX - startX; });
  window.addEventListener('mouseup', () => { if (!isDown) return; isDown = false; if (Math.abs(moved) > 50) { goTo(current + (moved < 0 ? 1 : -1)); } });
  container.addEventListener('touchstart', e => { startX = e.touches[0].clientX; moved = 0; }, {passive:true});
  container.addEventListener('touchmove', e => { moved = e.touches[0].clientX - startX; }, {passive:true});
  container.addEventListener('touchend', () => { if (Math.abs(moved) > 50) { goTo(current + (moved < 0 ? 1 : -1)); } });
  dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));
  goTo(0);
})();

// ===== MULTI-STEP APPLICATION WIZARD =====
(function() {
  const wizard = document.getElementById('appWizard');
  if (!wizard) return;
  const steps = wizard.querySelectorAll('.wizard-step');
  const nextBtns = wizard.querySelectorAll('.wizard-next');
  const prevBtns = wizard.querySelectorAll('.wizard-prev');
  const indicators = wizard.querySelectorAll('.wizard-progress span');
  let current = 0;
  function showStep(i) {
    if (i < 0 || i >= steps.length) return;
    current = i;
    steps.forEach((s, idx) => s.classList.toggle('active', idx === i));
    indicators.forEach((s, idx) => s.classList.toggle('active', idx <= i));
  }
  nextBtns.forEach(btn => btn.addEventListener('click', () => { if (current < steps.length - 1) showStep(current + 1); }));
  prevBtns.forEach(btn => btn.addEventListener('click', () => { if (current > 0) showStep(current - 1); }));
  showStep(0);
  // Form submit
  const wizardForm = wizard.querySelector('.wizard-form');
  if (wizardForm) {
    wizardForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const toast = document.getElementById('toast');
      if (toast) {
        toast.className = 'toast success show';
        toast.textContent = 'Application submitted! We will contact you within 48 hours.';
      }
      this.reset();
      showStep(0);
    });
  }
})();
