/* ─── NAV: shadow on scroll + hamburger ──────────────────────────────────── */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 10);
});

hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', open);
});

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
  });
});

/* ─── WAITLIST FORM — Formspree AJAX ────────────────────────────────────── */
const waitlistForm = document.getElementById('waitlist-form');
const formSuccess  = document.getElementById('form-success');

waitlistForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = waitlistForm.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = 'Sending…';

  try {
    const res = await fetch(waitlistForm.action, {
      method: 'POST',
      body: new FormData(waitlistForm),
      headers: { Accept: 'application/json' }
    });
    if (res.ok) {
      waitlistForm.classList.add('hidden');
      formSuccess.classList.remove('hidden');
    } else {
      btn.disabled = false;
      btn.textContent = 'Submit Request →';
      alert('Something went wrong. Please try again or email hello@veru365.com.');
    }
  } catch {
    btn.disabled = false;
    btn.textContent = 'Submit Request →';
    alert('Something went wrong. Please try again or email hello@veru365.com.');
  }
});

/* ─── CAREERS: toggle apply forms ───────────────────────────────────────── */
document.querySelectorAll('.btn-apply').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const role     = btn.dataset.role;
    const formWrap = document.getElementById(`form-${role}`);
    const isOpen   = !formWrap.classList.contains('hidden');

    // Close all others first
    document.querySelectorAll('.career-form-wrap').forEach(w => w.classList.add('hidden'));
    document.querySelectorAll('.btn-apply').forEach(b => {
      b.classList.remove('active');
      b.textContent = 'Apply';
    });

    if (!isOpen) {
      formWrap.classList.remove('hidden');
      btn.classList.add('active');
      btn.textContent = 'Close';
      setTimeout(() => formWrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
    }
  });
});

/* ─── CAREER FORMS — Formspree AJAX ─────────────────────────────────────── */
document.querySelectorAll('.career-form').forEach(form => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn     = form.querySelector('button[type="submit"]');
    const success = form.nextElementSibling;
    btn.disabled  = true;
    btn.textContent = 'Sending…';

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
      if (res.ok) {
        form.classList.add('hidden');
        success.classList.remove('hidden');
      } else {
        btn.disabled = false;
        btn.textContent = 'Submit Application →';
        alert('Something went wrong. Please email careers@veru365.com.');
      }
    } catch {
      btn.disabled = false;
      btn.textContent = 'Submit Application →';
      alert('Something went wrong. Please email careers@veru365.com.');
    }
  });
});

/* ─── SUBTLE FADE-IN on scroll ───────────────────────────────────────────── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.agent-card, .team-card, .feature-card, .career-item').forEach(el => {
  el.classList.add('fade-up');
  observer.observe(el);
});
