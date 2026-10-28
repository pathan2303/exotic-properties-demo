const loader = document.getElementById('loader');
const percent = document.getElementById('load-percent');
let load = 0;
const loadTimer = setInterval(() => {
  load = Math.min(100, load + Math.ceil(Math.random() * 13));
  percent.textContent = String(load).padStart(2, '0');
  document.querySelector('.loader-track i').style.width = load + '%';
  if (load >= 100) {
    clearInterval(loadTimer);
    setTimeout(() => { loader.classList.add('done'); document.body.classList.remove('locked'); }, 250);
  }
}, 95);
document.body.classList.add('locked');
setTimeout(() => { loader.classList.add('done'); document.body.classList.remove('locked'); clearInterval(loadTimer); }, 2200);

const menuToggle = document.getElementById('menu-toggle');
const nav = document.getElementById('main-nav');
menuToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const cursorGlow = document.querySelector('.cursor-glow');
window.addEventListener('pointermove', e => {
  if (cursorGlow) {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
  }
}, { passive: true });

const heroArt = document.getElementById('hero-art');
if (heroArt && window.matchMedia('(pointer:fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  heroArt.addEventListener('pointermove', e => {
    const r = heroArt.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    heroArt.style.transform = `rotateY(${x * 5}deg) rotateX(${-y * 4}deg)`;
  });
  heroArt.addEventListener('pointerleave', () => { heroArt.style.transform = ''; });
}

const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.nav-link')];
const activeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id));
    }
  });
}, { rootMargin: '-35% 0px -55% 0px' });
sections.forEach(section => activeObserver.observe(section));

const modal = document.getElementById('video-modal');
const openModal = () => { modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; document.getElementById('modal-close').focus(); };
const closeModal = () => { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; document.getElementById('film-button').focus(); };
document.getElementById('film-button').addEventListener('click', openModal);
document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('modal-done').addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });

document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('contact-form').addEventListener('submit', e => {
  e.preventDefault();
  const form = e.currentTarget;
  const data = new FormData(form);
  const subject = encodeURIComponent('Property enquiry — Exotic Properties');
  const body = encodeURIComponent(
    `Name: ${data.get('name')}\nEmail: ${data.get('email')}\nInterested in: ${data.get('interest')}\n\nMessage:\n${data.get('message') || '(No additional message)'}`
  );
  window.location.href = `mailto:hello@exoticproperties.example?subject=${subject}&body=${body}`;
  document.getElementById('form-hint').textContent = 'Your email app should open with the enquiry drafted. Replace the demo email address before launch.';
});
const themeToggle = document.getElementById('theme-toggle');
const themeSymbol = themeToggle?.querySelector('.theme-symbol');
const themeLabel = themeToggle?.querySelector('.theme-label');
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const day = theme === 'day';
  if (themeSymbol) themeSymbol.textContent = day ? '☾' : '☼';
  if (themeLabel) themeLabel.textContent = day ? 'NIGHT MODE' : 'DAY MODE';
  if (themeToggle) {
    themeToggle.setAttribute('aria-label', day ? 'Switch to night mode' : 'Switch to day mode');
    themeToggle.setAttribute('title', day ? 'Switch to night mode' : 'Switch to day mode');
  }
}
let savedTheme = 'night';
try { savedTheme = localStorage.getItem('exotic-properties-theme') || 'night'; } catch (_) {}
applyTheme(savedTheme);
themeToggle?.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'day' ? 'night' : 'day';
  applyTheme(next);
  try { localStorage.setItem('exotic-properties-theme', next); } catch (_) {}
});

/* Featured property carousel: timed transitions plus manual controls. */
(() => {
  const slides = [...document.querySelectorAll('.hero-slide')];
  if (!slides.length) return;
  const dots = [...document.querySelectorAll('.carousel-dot')];
  const title = document.getElementById('carousel-title');
  const kicker = document.getElementById('carousel-kicker');
  const current = document.getElementById('carousel-current');
  let active = 0, timer;
  const show = (index) => {
    active = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('active', i === active));
    dots.forEach((dot, i) => dot.classList.toggle('active', i === active));
    if (title) title.textContent = slides[active].dataset.title || 'FEATURED PROPERTY';
    if (kicker) kicker.textContent = slides[active].dataset.type || 'PROPERTY SHOWCASE';
    if (current) current.textContent = String(active + 1).padStart(2, '0');
  };
  const restart = () => {
    clearInterval(timer);
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) timer = setInterval(() => show(active + 1), 5600);
  };
  document.getElementById('carousel-prev')?.addEventListener('click', () => { show(active - 1); restart(); });
  document.getElementById('carousel-next')?.addEventListener('click', () => { show(active + 1); restart(); });
  dots.forEach(dot => dot.addEventListener('click', () => { show(Number(dot.dataset.slide)); restart(); }));
  document.querySelector('.hero-carousel')?.addEventListener('mouseenter', () => clearInterval(timer));
  document.querySelector('.hero-carousel')?.addEventListener('mouseleave', restart);
  show(0); restart();
})();

/* Photo backdrop and architecture respond subtly to natural page scrolling. */
(() => {
  const world = document.querySelector('.scroll-world-image');
  const architecture = document.querySelector('.architecture-reveal-image');
  let scheduled = false;
  const update = () => {
    const y = window.scrollY || 0;
    if (world) {
      const scene = Math.floor(y / Math.max(window.innerHeight * 1.25, 1)) % 3;
      const scenes = [
        "url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&q=85')",
        "url('https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2000&q=85')",
        "url('https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=2000&q=85')"
      ];
      if (world.dataset.scene !== String(scene)) { world.style.backgroundImage = scenes[scene]; world.dataset.scene = String(scene); }
      world.style.transform = `translate3d(0, ${Math.min(y * -.025, 0)}px, 0) scale(1.08)`;
    }
    if (architecture) {
      const r = architecture.parentElement.getBoundingClientRect();
      const progress = (window.innerHeight - r.top) / (window.innerHeight + r.height);
      const shift = Math.max(-22, Math.min(22, (progress - .5) * -44));
      architecture.style.transform = `scale(${1.1 + Math.max(0, Math.min(1, progress)) * .06}) translate3d(0, ${shift}px, 0)`;
    }
    scheduled = false;
  };
  window.addEventListener('scroll', () => { if (!scheduled) { requestAnimationFrame(update); scheduled = true; } }, { passive: true });
  update();
})();
