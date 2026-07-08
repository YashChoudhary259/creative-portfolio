const revealElements = document.querySelectorAll('.reveal');

if (revealElements.length) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -100px 0px',
    }
  );

  revealElements.forEach(el => revealObserver.observe(el));
}

const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');

if (hamburger && nav) {
  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = nav.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', (e) => {
    if (nav.classList.contains('open') && !nav.contains(e.target) && e.target !== hamburger) {
      nav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}

const inspectableCards = document.querySelectorAll('.projects .project-card');

inspectableCards.forEach(card => {
  const corners = ['corner-tl', 'corner-tr', 'corner-br', 'corner-bl'];
  corners.forEach(cornerClass => {
    const corner = document.createElement('span');
    corner.className = `corner ${cornerClass}`;
    card.appendChild(corner);
  });

  const dimLabel = document.createElement('span');
  dimLabel.className = 'dim-label';
  card.appendChild(dimLabel);

  const tagLabel = document.createElement('span');
  tagLabel.className = 'tag-label';
  tagLabel.textContent = '.project-card';
  card.appendChild(tagLabel);

  const activate = () => {
    const rect = card.getBoundingClientRect();
    dimLabel.textContent = `${Math.round(rect.width)} × ${Math.round(rect.height)}`;
    card.classList.add('inspecting');
  };

  const deactivate = () => {
    card.classList.remove('inspecting');
  };

  card.addEventListener('mouseenter', activate);
  card.addEventListener('mouseleave', deactivate);
  card.addEventListener('focusin', activate);
  card.addEventListener('focusout', deactivate);
});

// --- Theme Switcher ---
const themeToggle = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('theme') || 'dark';

if (savedTheme === 'light') {
  document.body.setAttribute('data-theme', 'light');
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isLight = document.body.getAttribute('data-theme') === 'light';
    if (isLight) {
      document.body.removeAttribute('data-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  });
}

// --- Interactive Hero Mouse Tracker ---
document.addEventListener('mousemove', (e) => {
  document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
  document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
});

// --- AJAX Contact Form Interaction ---
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm && formStatus) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('.form-submit-btn');
    const originalText = submitBtn.textContent;
    
    // Set loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    formStatus.textContent = '';
    formStatus.className = 'form-status';

    // Simulate standard AJAX post
    setTimeout(() => {
      // Success feedback
      submitBtn.textContent = 'Sent!';
      formStatus.textContent = 'Message sent successfully! 🚀 I will get back to you soon.';
      formStatus.className = 'form-status success';
      contactForm.reset();

      // Reset button after 4 seconds
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }, 4000);
    }, 1200);
  });
}