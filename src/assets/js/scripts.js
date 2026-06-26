// Mobile nav hamburger toggle
const navToggle = document.getElementById('nav-toggle');
const navbar = document.getElementById('navbar');
if (navToggle && navbar) {
  navToggle.addEventListener('click', () => {
    const isOpen = navbar.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  navbar.querySelectorAll('.nav-list a').forEach(link => {
    link.addEventListener('click', () => {
      navbar.classList.remove('nav-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
  document.addEventListener('click', e => {
    if (!navbar.contains(e.target)) {
      navbar.classList.remove('nav-open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initProjectImageLightbox();

  // Handle contact form submit via Web3Forms
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const data = new FormData(contactForm);
    const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: data });
    const json = await res.json();
    const result = document.getElementById('form-result');
    if (json.success) {
      result.textContent = "Message sent! I'll get back to you soon.";
      result.className = 'form-result form-result--success';
      contactForm.reset();
    } else {
      result.textContent = 'Something went wrong. Please try again.';
      result.className = 'form-result form-result--error';
    }
  });
});

function initProjectImageLightbox() {
  const triggers = document.querySelectorAll('[data-lightbox-trigger]');
  const lightbox = document.getElementById('project-image-lightbox');
  const lightboxImage = document.getElementById('project-image-lightbox-image');
  const lightboxCaption = document.getElementById('project-image-lightbox-caption');
  const lightboxClose = document.getElementById('project-image-lightbox-close');

  if (!lightbox || !lightboxImage || !lightboxCaption || !lightboxClose) {
    return;
  }

  let activeTrigger = null;

  const closeLightbox = () => {
    lightbox.hidden = true;
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
    lightboxImage.src = '';
    lightboxImage.alt = '';
    lightboxCaption.textContent = '';
    lightboxCaption.hidden = true;

    if (activeTrigger) {
      activeTrigger.focus();
      activeTrigger = null;
    }
  };

  const openLightbox = trigger => {
    const src = trigger.dataset.lightboxSrc;
    const alt = trigger.dataset.lightboxAlt || '';
    const caption = trigger.dataset.lightboxCaption || '';

    if (!src) return;

    activeTrigger = trigger;
    lightboxImage.src = src;
    lightboxImage.alt = alt;
    lightboxCaption.textContent = caption;
    lightboxCaption.hidden = !caption;
    lightbox.hidden = false;
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
    lightboxClose.focus();
  };

  if (triggers.length) {
    triggers.forEach(trigger => {
      trigger.addEventListener('click', () => openLightbox(trigger));
    });
  }

  lightboxClose.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', event => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !lightbox.hidden) {
      closeLightbox();
    }
  });
}
