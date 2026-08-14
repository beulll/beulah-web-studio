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


const enquiryForm = document.querySelector('#enquiry-form');
const formStatus = document.querySelector('#form-status');
const startDate = document.querySelector('#start-date');

if (startDate) {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  startDate.min = `${today.getFullYear()}-${month}-${day}`;
}

enquiryForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!enquiryForm.reportValidity()) return;

  const data = new FormData(enquiryForm);
  const dateValue = data.get('startDate');
  const preferredDate = dateValue
    ? new Date(`${dateValue}T12:00:00`).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Not specified';

  const message = [
    'Hello Beulah Web Studio, I would like to discuss a website project.',
    '',
    `Name: ${data.get('name')}`,
    `Email: ${data.get('email')}`,
    `Business/brand: ${data.get('business') || 'Not specified'}`,
    `Service: ${data.get('projectType')}`,
    `Estimated budget: ${data.get('budget') || 'Not specified'}`,
    `Preferred start date: ${preferredDate}`,
    '',
    `Project details: ${data.get('message')}`
  ].join('\n');

  const whatsappUrl = `https://wa.me/2348128813047?text=${encodeURIComponent(message)}`;
  formStatus?.classList.remove('error');
  if (formStatus) formStatus.textContent = 'Your enquiry is ready. WhatsApp will open so you can review and send it.';
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
});
