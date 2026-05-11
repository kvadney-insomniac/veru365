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

/* ─── WAITLIST FORM — mailto, native submit ──────────────────────────────── */
// Forms use mailto: — native browser submit opens mail client, no JS needed

/* ─── CAREERS: toggle apply forms ───────────────────────────────────────── */
document.querySelectorAll('.btn-apply').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const role     = btn.dataset.role;
    const formWrap = document.getElementById(`form-${role}`);
    const isOpen   = !formWrap.classList.contains('hidden');

    // Close all others first
    document.querySelectorAll('.career-form-wrap').forEach(w => w.classList.add('hidden'));
    document.querySelectorAll('.btn-apply').forEach(b => b.classList.remove('active'));

    if (!isOpen) {
      formWrap.classList.remove('hidden');
      btn.classList.add('active');
      btn.textContent = 'Close';
      // Scroll into view
      setTimeout(() => formWrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
    } else {
      btn.textContent = 'Apply';
    }
  });
});

/* ─── CAREER FORMS — mailto, native submit ───────────────────────────────── */
// Forms use mailto: — native browser submit opens mail client, no JS needed

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
