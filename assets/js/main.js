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
