const nav = document.querySelector('.nav');
const menuToggle = document.querySelector('.menu-toggle');
const cursorGlow = document.querySelector('.cursor-glow');
const header = document.querySelector('.site-header');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const closeMenu = () => {
  if (!nav || !menuToggle) return;
  nav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
};

menuToggle?.addEventListener('click', () => {
  const open = nav?.classList.toggle('open') ?? false;
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});

document.querySelectorAll('.nav a').forEach((link) => {
  link.addEventListener('click', closeMenu);
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 850) closeMenu();
}, { passive: true });

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

if ('IntersectionObserver' in window && !prefersReducedMotion) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
} else {
  document.querySelectorAll('.reveal').forEach((element) => element.classList.add('visible'));
}

window.addEventListener('scroll', () => {
  header?.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

if (window.matchMedia('(pointer: fine)').matches && cursorGlow && !prefersReducedMotion) {
  window.addEventListener('pointermove', (event) => {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
    cursorGlow.style.opacity = '1';
  }, { passive: true });
}

document.querySelectorAll('.magnetic').forEach((button) => {
  if (!window.matchMedia('(pointer: fine)').matches || prefersReducedMotion) return;
  button.addEventListener('pointermove', (event) => {
    const rect = button.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) * 0.16;
    const y = (event.clientY - rect.top - rect.height / 2) * 0.16;
    button.style.transform = `translate(${x}px, ${y}px)`;
  });
  button.addEventListener('pointerleave', () => {
    button.style.transform = '';
  });
});
