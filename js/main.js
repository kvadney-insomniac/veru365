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

/* ─── WAITLIST FORM (Formspree AJAX) ─────────────────────────────────────── */
const waitlistForm    = document.getElementById('waitlist-form');
const formSuccessMsg  = document.getElementById('form-success');

if (waitlistForm) {
  waitlistForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = waitlistForm.querySelector('button[type="submit"]');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    try {
      const res = await fetch(waitlistForm.action, {
        method: 'POST',
        body: new FormData(waitlistForm),
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        waitlistForm.classList.add('hidden');
        formSuccessMsg.classList.remove('hidden');
      } else {
        btn.textContent = 'Try again';
        btn.disabled = false;
        alert('Something went wrong. Please email us directly at hello@veru365.com');
      }
    } catch {
      btn.textContent = 'Try again';
      btn.disabled = false;
    }
  });
}

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

/* ─── CAREER FORMS (Formspree AJAX) ──────────────────────────────────────── */
document.querySelectorAll('.career-form').forEach(form => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        const roleLabel = form.dataset.roleLabel || 'this role';
        form.innerHTML = `
          <div style="text-align:center;padding:1.5rem 0;">
            <div style="width:48px;height:48px;background:var(--gold);border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1.2rem;color:var(--navy-deep);margin:0 auto 0.75rem;">✓</div>
            <h4 style="color:var(--navy);margin-bottom:0.4rem;">Application received.</h4>
            <p style="color:var(--muted);font-size:0.9rem;">Thanks for your interest in ${roleLabel}. We'll be in touch.</p>
          </div>`;
      } else {
        btn.textContent = 'Try again';
        btn.disabled = false;
      }
    } catch {
      btn.textContent = 'Try again';
      btn.disabled = false;
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
