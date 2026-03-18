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

// Add event listeners to all download buttons
document.querySelectorAll('.download-button').forEach(button => {
    button.addEventListener('click', event => {
        const file = button.getAttribute('data-file');
        const downloadName = button.getAttribute('data-download');
        if (file) {
            const link = document.createElement('a');
            link.href = file;
            link.download = downloadName || '';
            link.click();
        }
    });
});

function toggleAccordion(projectId) {
    const details = document.getElementById(projectId + '-more-info');
    if (details.classList.contains('hidden')) {
      details.classList.remove('hidden');
    } else {
      details.classList.add('hidden');
    }
  }

// Handle contact form submit via mailto
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', event => {
    event.preventDefault();
    const name = document.getElementById('name')?.value.trim() || 'Website visitor';
    const email = document.getElementById('email')?.value.trim() || 'No email provided';
    const message = document.getElementById('message')?.value.trim() || '';

    const subject = `New message from ${name}`;
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    const mailtoLink = `mailto:luketrusheim@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoLink;
  });
});
