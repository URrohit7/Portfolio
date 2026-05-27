// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
  initMobileOptimizations(); // Detect and optimize for mobile
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
});

// ========== MOBILE OPTIMIZATIONS ==========
function initMobileOptimizations() {
  const isMobile = window.innerWidth < 768 || 
                   (('ontouchstart' in window) && navigator.maxTouchPoints > 0);

  if (isMobile) {
    // Add mobile class to body
    document.body.classList.add('is-mobile');
    
    // Reduce animation complexity on mobile
    document.documentElement.style.setProperty('--transition', '0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)');
    
    // Disable parallax on mobile for better performance
    window.disableParallax = true;
    
    // Prevent zoom on double-tap
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    }, false);

    // Optimize viewport for mobile
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes');
    }

    // Enable momentum scrolling for iOS
    document.body.style.webkitOverflowScrolling = 'touch';

    // Listen for window resize to handle orientation changes
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        // Refresh scroll-triggered animations on orientation change
        if (window.ScrollTrigger) {
          ScrollTrigger.refresh();
        }
      }, 250);
    });
  }
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
  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger);

  // Hero entrance animations
  gsap.fromTo('.hero-badge', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.3, ease: 'power2.out' });
  gsap.fromTo('.hero-name-row', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.5, ease: 'power2.out' });
  gsap.fromTo('.hero-meta', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.7, ease: 'power2.out' });
  gsap.fromTo('.hero-cta', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.9, ease: 'power2.out' });
  gsap.fromTo('.hero-photo-wrap', { opacity: 0, scale: 0.9, x: 30 }, { opacity: 1, scale: 1, x: 0, duration: 1, delay: 0.5, ease: 'power3.out' });

  // Animate section labels
  gsap.utils.toArray('.sec-label').forEach((element) => {
    gsap.from(element, {
      scrollTrigger: { trigger: element, start: 'top 85%', once: true },
      duration: 0.6,
      opacity: 0,
      x: -30,
    });
  });

  // Animate section titles
  gsap.utils.toArray('.sec-title').forEach((element) => {
    gsap.from(element, {
      scrollTrigger: { trigger: element, start: 'top 85%', once: true },
      duration: 0.8,
      opacity: 0,
      y: 30,
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
  if (typeof Lenis === 'undefined') return;

  // Detect if device supports touch
  const isTouchDevice = () => {
    return (('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0));
  };

  const isTouch = isTouchDevice();

  const lenis = new Lenis({
    duration: isTouch ? 0.8 : 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: isTouch, // Enable smooth touch scrolling on mobile
    wheelMultiplier: isTouch ? 1 : 1.2,
    touchMultiplier: isTouch ? 1.5 : 1,
  });

  // Sync Lenis with GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  // Disable GSAP's default RAF so Lenis drives it
  gsap.ticker.lagSmoothing(0);
}

// ========== FORM SUBMISSION ==========
function initForm() {
  const form = document.getElementById('cform');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const data = Object.fromEntries(formData);

      // Log form data (in real scenario, send to server)
      console.log('Form submitted:', data);

      // Show success message
      const button = form.querySelector('button[type="submit"]');
      const originalText = button.querySelector('.btn-text').textContent;
      button.querySelector('.btn-text').textContent = 'Message Sent! ✓';
      button.disabled = true;

      setTimeout(() => {
        form.reset();
        button.querySelector('.btn-text').textContent = originalText;
        button.disabled = false;
      }, 2000);
    });
  }
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

// ========== SMOOTH SCROLL ANCHOR LINKS ==========
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
