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

// Handle contact form submit via Web3Forms
document.addEventListener('DOMContentLoaded', () => {
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
