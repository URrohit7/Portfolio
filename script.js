// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
  initMobileOptimizations();
  initThemeToggle();
  initLoader();
  initCursor();
  initScrollProgress();
  initMouseGlow();
  initNavigation();
  initAnimations();
  initParallax();
  initRevealOnScroll();
  initForm();
  initTilt();
  initMagneticButtons();
  initCountUp();
  initSmootherScroll();
  initSkillBars();
  initTypewriter();
  initFooterMarquee();
  initHeroCanvas();
  initBackToTop();
  initMusicPlayer();
});

// ========== MOBILE OPTIMIZATIONS ==========
function initMobileOptimizations() {
  const isMobile = window.matchMedia('(hover: none)').matches;
  if (!isMobile) return;

  document.body.classList.add('is-mobile');

  // Handle orientation change — refresh ScrollTrigger
  window.addEventListener('resize', () => {
    clearTimeout(window._resizeTimer);
    window._resizeTimer = setTimeout(() => {
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    }, 250);
  }, { passive: true });
}

// ========== THEME TOGGLE ==========
function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;
  
  // Get saved theme or default to dark
  const savedTheme = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);
  
  // Update toggle button appearance
  updateThemeToggleIcon(savedTheme);
  
  // Listen for toggle clicks
  themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeToggleIcon(newTheme);
  });
  
  // Detect system preference if no saved theme
  if (!localStorage.getItem('theme')) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = prefersDark ? 'dark' : 'light';
    html.setAttribute('data-theme', theme);
    updateThemeToggleIcon(theme);
  }
}

function updateThemeToggleIcon(theme) {
  const svg = document.querySelector('.theme-toggle svg');
  if (theme === 'light') {
    svg.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
  } else {
    svg.innerHTML = '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';
  }
}

// ========== LOADER (percentage-driven) ==========
function initLoader() {
  const loader    = document.getElementById('loader');
  const fill      = document.getElementById('loader-fill');
  const pct       = document.getElementById('loader-percent');
  const label     = document.getElementById('loader-label');

  let progress = 0;
  let done = false;

  const labels = ['Loading…', 'Almost there…', 'Ready!'];

  function setProgress(val) {
    progress = Math.min(val, 100);
    if (fill)  fill.style.width  = progress + '%';
    if (pct)   pct.textContent   = Math.round(progress) + '%';
    if (label) label.textContent = progress < 50 ? labels[0] : progress < 90 ? labels[1] : labels[2];
  }

  // Tick up quickly to ~80% while resources load
  let fake = 0;
  const ticker = setInterval(() => {
    fake += Math.random() * 18;
    if (fake >= 80) { clearInterval(ticker); fake = 80; }
    if (!done) setProgress(fake);
  }, 120);

  // When everything is loaded, jump to 100% and hide
  function finish() {
    if (done) return;
    done = true;
    clearInterval(ticker);
    setProgress(100);
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 400);
  }

  if (document.readyState === 'complete') {
    finish();
  } else {
    window.addEventListener('load', finish);
    // Safety net — never block user more than 3s
    setTimeout(finish, 3000);
  }
}

// ========== CUSTOM CURSOR (desktop only) ==========
function initCursor() {
  if (window.matchMedia('(hover: none)').matches) return; // no cursor on touch
  const cursor = document.getElementById('cursor');
  const cursorLabel = document.querySelector('.c-label');
  const magneticElements = document.querySelectorAll('.magnetic');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;

  document.addEventListener('mousemove', (e) => {
    document.body.classList.add('cursor-active');
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth cursor via RAF
  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.12;
    cursorY += (mouseY - cursorY) * 0.12;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Magnetic effect on buttons
  magneticElements.forEach((element) => {
    element.addEventListener('mousemove', (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      element.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });

    element.addEventListener('mouseleave', () => {
      element.style.transform = 'translate(0, 0)';
    });

    element.addEventListener('mouseenter', () => {
      cursorLabel.style.opacity = '1';
    });

    element.addEventListener('mouseleave', () => {
      cursorLabel.style.opacity = '0';
    });
  });
}

// ========== SCROLL PROGRESS ==========
function initScrollProgress() {
  const progressBar = document.getElementById('progress-bar');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        progressBar.style.width = (scrollTop / docHeight * 100) + '%';
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// ========== MOUSE GLOW (desktop only) ==========
function initMouseGlow() {
  if (window.matchMedia('(hover: none)').matches) return;
  const mouseGlow = document.getElementById('mouse-glow');

  document.addEventListener('mousemove', (e) => {
    mouseGlow.style.left = e.clientX - 200 + 'px';
    mouseGlow.style.top = e.clientY - 200 + 'px';
  });
}

// ========== NAVIGATION ==========
function initNavigation() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');

  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    hamburger.style.gap = mobileMenu.classList.contains('active') ? '0' : '6px';
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
    });
  });

  // Navbar background on scroll
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.style.backdropFilter = 'blur(20px)';
      nav.style.borderBottomColor = 'var(--border-color)';
    } else {
      nav.style.backdropFilter = 'blur(10px)';
    }
  }, { passive: true });
}

// ========== ANIMATIONS ==========
function initAnimations() {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // Hero entrance — use gsap.set first so elements are visible if GSAP fails
  const heroEls = ['.hero-badge', '.hero-name-row', '.hero-meta', '.hero-cta', '.hero-photo-wrap'];
  heroEls.forEach(sel => {
    const el = document.querySelector(sel);
    if (el) el.style.opacity = '1'; // ensure visible as fallback
  });

  gsap.fromTo('.hero-badge',     { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: 'power2.out' });
  gsap.fromTo('.hero-name-row',  { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.35, ease: 'power2.out' });
  gsap.fromTo('.hero-meta',      { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.5, ease: 'power2.out' });
  gsap.fromTo('.hero-cta',       { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.65, ease: 'power2.out' });
  gsap.fromTo('.hero-photo-wrap',{ opacity: 0, scale: 0.92, x: 20 }, { opacity: 1, scale: 1, x: 0, duration: 0.9, delay: 0.3, ease: 'power3.out' });

  // Section labels
  gsap.utils.toArray('.sec-label').forEach((el) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      duration: 0.55, opacity: 0, x: -24,
    });
  });

  // Section titles
  gsap.utils.toArray('.sec-title').forEach((el) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      duration: 0.7, opacity: 0, y: 24,
    });
  });
}

// ========== PARALLAX (desktop only) ==========
function initParallax() {
  if (window.matchMedia('(hover: none)').matches) return; // skip on touch — causes jank
  const parallaxElements = document.querySelectorAll('.parallax-hero');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        parallaxElements.forEach((el) => {
          const speed = parseFloat(el.getAttribute('data-speed')) || 0.25;
          el.style.transform = `translateY(${window.scrollY * speed}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// ========== REVEAL ON SCROLL ==========
function initRevealOnScroll() {
  const revealElements = document.querySelectorAll('.rv-up, .rv-left, .rv-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach((element) => {
    observer.observe(element);
  });
}

// ========== SKILL BARS (animate on scroll) ==========
function initSkillBars() {
  const skillBars = document.querySelectorAll('.skill-bar');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const width = bar.getAttribute('data-w') + '%';
        bar.style.setProperty('--bar-width', width);
        bar.style.width = width;
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  skillBars.forEach((bar) => {
    bar.style.width = '0%';
    observer.observe(bar);
  });
}

// ========== COUNT UP NUMBERS ==========
function initCountUp() {
  const counters = document.querySelectorAll('.hstat-n');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        const target = parseInt(entry.target.getAttribute('data-target'));
        countUp(entry.target, target);
      }
    });
  });

  counters.forEach((counter) => {
    observer.observe(counter);
  });
}

function countUp(element, target) {
  let current = 0;
  const increment = target / 50;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 30);
}

// ========== SMOOTHER SCROLL WITH LENIS ==========
function initSmootherScroll() {
  if (typeof window.Lenis === 'undefined') return;
  if (window.matchMedia('(hover: none)').matches) return; // native scroll on touch

  const lenis = new window.Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: false,
  });

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  } else {
    // Fallback RAF loop if GSAP not available
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  }
}

// ========== FORM SUBMISSION — EmailJS ==========
// ─────────────────────────────────────────────
//  Fill in your three EmailJS values below.
//  Dashboard → https://dashboard.emailjs.com
// ─────────────────────────────────────────────
const EMAILJS_PUBLIC_KEY  = '19ogIwCFk_RimhoEE';   // Account → API Keys
const EMAILJS_SERVICE_ID  = 'service_bi01suj';   // Email Services → Service ID
const EMAILJS_TEMPLATE_ID = 'template_23f4hea';  // Email Templates → Template ID

function initForm() {
  // Initialise EmailJS with your public key
  if (typeof emailjs !== 'undefined') {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }

  const form   = document.getElementById('cform');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn      = form.querySelector('button[type="submit"]');
    const btnText  = btn.querySelector('.btn-text');
    const original = btnText.textContent;

    // Basic client-side validation
    const name    = form.querySelector('[name="name"]').value.trim();
    const email   = form.querySelector('[name="email"]').value.trim();
    const message = form.querySelector('[name="message"]').value.trim();

    if (!name || !email || !message) {
      showFormStatus(form, 'error', 'Please fill in all required fields.');
      return;
    }

    // Loading state
    btnText.textContent = 'Sending…';
    btn.disabled = true;

    try {
      await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form);

      // Success
      btnText.textContent = '✓ Message Sent!';
      btn.style.background = '#22c55e';
      showFormStatus(form, 'success', 'Your message was sent. I\'ll get back to you soon!');
      form.reset();

      setTimeout(() => {
        btnText.textContent = original;
        btn.disabled = false;
        btn.style.background = '';
        clearFormStatus(form);
      }, 4000);

    } catch (err) {
      console.error('EmailJS error:', err);
      btnText.textContent = '✗ Failed — Try Again';
      btn.style.background = '#ef4444';
      showFormStatus(form, 'error', 'Something went wrong. Please try again or email me directly.');

      setTimeout(() => {
        btnText.textContent = original;
        btn.disabled = false;
        btn.style.background = '';
        clearFormStatus(form);
      }, 4000);
    }
  });
}

function showFormStatus(form, type, message) {
  clearFormStatus(form);
  const el = document.createElement('p');
  el.className = 'form-status form-status--' + type;
  el.textContent = message;
  form.appendChild(el);
}

function clearFormStatus(form) {
  const existing = form.querySelector('.form-status');
  if (existing) existing.remove();
}

// ========== TILT EFFECT (desktop only) ==========
function initTilt() {
  if (window.matchMedia('(hover: none)').matches) return; // skip on touch
  const tiltElements = document.querySelectorAll('.tilt');

  tiltElements.forEach((element) => {
    element.addEventListener('mousemove', (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * 5;
      const rotateY = ((centerX - x) / centerX) * 5;
      element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    element.addEventListener('mouseleave', () => {
      element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
  });
}

// ========== MAGNETIC BUTTONS (desktop only) ==========
function initMagneticButtons() {
  if (window.matchMedia('(hover: none)').matches) return; // skip on touch
  const buttons = document.querySelectorAll('.magnetic');

  buttons.forEach((button) => {
    button.addEventListener('mouseenter', () => {
      button.style.transition = 'all 0.3s ease-out';
    });

    button.addEventListener('mouseleave', () => {
      button.style.transform = 'translate(0, 0)';
    });
  });
}

// ========== TIMELINE PROGRESS ==========
function updateTimelineProgress() {
  const spine = document.querySelector('.tl-spine');
  const progress = document.querySelector('.tl-progress');
  if (!spine || !progress) return;
  const spineRect = spine.getBoundingClientRect();
  const pct = Math.max(0, Math.min(100,
    (window.innerHeight - spineRect.top) / (window.innerHeight + spineRect.height) * 100
  ));
  progress.style.height = pct + '%';
}

let tlTicking = false;
window.addEventListener('scroll', () => {
  if (!tlTicking) {
    requestAnimationFrame(() => { updateTimelineProgress(); tlTicking = false; });
    tlTicking = true;
  }
}, { passive: true });

// ========== FOOTER MARQUEE =
// =========
function initFooterMarquee() {
  const marquee = document.querySelector('.mq-track');
  if (marquee) {
    // Clone track for seamless loop
    const clone = marquee.cloneNode(true);
    marquee.parentElement.appendChild(clone);
  }
}

initFooterMarquee();

// ========== HERO CANVAS BACKGROUND ==========
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  // Skip on mobile — saves battery and CPU
  if (window.matchMedia('(hover: none)').matches) {
    canvas.style.display = 'none';
    return;
  }

  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 1.2;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const particles = [];
  const particleCount = 40; // reduced from 50

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.radius = Math.random() * 1.5 + 0.5;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.4 + 0.1;
    }
    draw() {
      ctx.fillStyle = `rgba(212, 168, 83, ${this.opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }
  }

  for (let i = 0; i < particleCount; i++) particles.push(new Particle());

  let animId;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    animId = requestAnimationFrame(animate);
  }
  animate();

  // Pause when tab hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animId);
    else animate();
  });
}

initHeroCanvas();

// ========== TYPEWRITER ==========
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const words = [
    'Tech Geek',
    'Commerce Enthusiast',
    'Video Editor',
    'Business Strategist',
  ];

  let wordIndex  = 0;
  let charIndex  = 0;
  let deleting   = false;
  const typeSpeed   = 80;   // ms per character while typing
  const deleteSpeed = 40;   // ms per character while deleting
  const pauseAfter  = 1600; // ms pause at full word
  const pauseEmpty  = 400;  // ms pause at empty string

  function tick() {
    const current = words[wordIndex];

    if (!deleting) {
      // Type one character
      el.textContent = current.slice(0, charIndex + 1);
      charIndex++;

      if (charIndex === current.length) {
        // Finished typing — pause then start deleting
        deleting = true;
        setTimeout(tick, pauseAfter);
        return;
      }
      setTimeout(tick, typeSpeed);
    } else {
      // Delete one character
      el.textContent = current.slice(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        // Finished deleting — move to next word
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(tick, pauseEmpty);
        return;
      }
      setTimeout(tick, deleteSpeed);
    }
  }

  // Small initial delay so it starts after hero entrance animation
  // Uses DOMContentLoaded timing — works even if GSAP is deferred
  const startDelay = window.matchMedia('(hover: none)').matches ? 400 : 1200;
  setTimeout(tick, startDelay);
}

// ========== BACK TO TOP ==========
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ========== MUSIC PLAYER ==========
function initMusicPlayer() {
  const audio  = document.getElementById('bg-music');
  const toggle = document.getElementById('music-toggle');
  const bars   = document.getElementById('music-bars');
  const label  = toggle ? toggle.querySelector('.music-label') : null;
  if (!audio || !toggle) return;

  let playing = false;
  audio.volume = 0.25;

  toggle.addEventListener('click', () => {
    if (playing) {
      audio.pause();
      playing = false;
      bars.classList.remove('playing');
      if (label) label.textContent = 'Ambient';
    } else {
      audio.play()
        .then(() => { playing = true; bars.classList.add('playing'); if (label) label.textContent = 'Playing'; })
        .catch(() => {});
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && playing) audio.pause();
    else if (!document.hidden && playing) audio.play().catch(() => {});
  });
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#' && document.querySelector(href)) {
      e.preventDefault();
      const target = document.querySelector(href);
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ========== PAGE VISIBILITY OPTIMIZATION ==========
document.addEventListener('visibilitychange', () => {
  // pause/resume any media if needed
});
