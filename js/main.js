/* ─── SPIDER WEB CANVAS ───────────────────────────────────────────────────── */
(function () {
  const canvas = document.getElementById('web');
  const ctx    = canvas.getContext('2d');

  const PARTICLE_COUNT = 55;
  const MAX_DIST       = 160;   // line draw threshold
  const MOUSE_RADIUS   = 200;   // mouse influence radius
  const MOUSE_STRENGTH = 0.012; // how hard mouse pulls
  const BASE_SPEED     = 0.3;

  // Brand colors
  const NODE_COLOR  = 'rgba(27,43,94,';   // navy
  const LINE_NAVY   = 'rgba(27,43,94,';
  const LINE_GOLD   = 'rgba(201,160,96,';

  let W, H, dpr;
  let mouse = { x: -9999, y: -9999 };
  let particles = [];

  /* ── resize ── */
  function resize() {
    dpr = window.devicePixelRatio || 1;
    W   = window.innerWidth  || document.documentElement.clientWidth  || document.body.clientWidth  || 1280;
    H   = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 800;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  /* ── particle factory ── */
  function makeParticle() {
    const angle = Math.random() * Math.PI * 2;
    const speed = BASE_SPEED * (0.4 + Math.random() * 0.9);
    return {
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r:  1.5 + Math.random() * 1.5,
      // subtle random drift variation
      wander: (Math.random() - 0.5) * 0.004,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, makeParticle);
  }

  /* ── mouse tracking ── */
  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseleave', () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });
  // Touch support
  window.addEventListener('touchmove', e => {
    const t = e.touches[0];
    mouse.x = t.clientX;
    mouse.y = t.clientY;
  }, { passive: true });
  window.addEventListener('touchend', () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  /* ── click burst ── */
  window.addEventListener('click', e => {
    // Spawn 6 extra particles at click point that drift outward
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const speed = 1.5 + Math.random();
      particles.push({
        x: e.clientX,
        y: e.clientY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r: 2,
        wander: (Math.random() - 0.5) * 0.006,
        ttl: 120,      // frames before fade-out removal
        age: 0,
      });
    }
  });

  /* ── dist squared ── */
  function dist2(a, b) {
    const dx = a.x - b.x, dy = a.y - b.y;
    return dx * dx + dy * dy;
  }

  /* ── main loop ── */
  function tick() {
    ctx.clearRect(0, 0, W, H);

    /* update particles */
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];

      // TTL particles (click bursts)
      if (p.ttl !== undefined) {
        p.age++;
        if (p.age >= p.ttl) { particles.splice(i, 1); continue; }
      }

      // Wander: slowly rotate velocity direction
      const angle = Math.atan2(p.vy, p.vx) + p.wander;
      const spd   = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      p.vx = Math.cos(angle) * spd;
      p.vy = Math.sin(angle) * spd;

      // Mouse attraction
      const mdx = mouse.x - p.x;
      const mdy = mouse.y - p.y;
      const md2 = mdx * mdx + mdy * mdy;
      if (md2 < MOUSE_RADIUS * MOUSE_RADIUS) {
        const md   = Math.sqrt(md2);
        const pull = (1 - md / MOUSE_RADIUS) * MOUSE_STRENGTH;
        p.vx += (mdx / md) * pull;
        p.vy += (mdy / md) * pull;
      }

      // Speed cap
      const s = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      const cap = p.ttl ? 2.5 : BASE_SPEED * 1.8;
      if (s > cap) { p.vx = (p.vx / s) * cap; p.vy = (p.vy / s) * cap; }

      p.x += p.vx;
      p.y += p.vy;

      // Wrap edges
      if (p.x < -20) p.x = W + 20;
      if (p.x > W + 20) p.x = -20;
      if (p.y < -20) p.y = H + 20;
      if (p.y > H + 20) p.y = -20;
    }

    /* draw connections — check all pairs */
    const max2 = MAX_DIST * MAX_DIST;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const d2 = dist2(particles[i], particles[j]);
        if (d2 > max2) continue;
        const t    = 1 - d2 / max2;          // 1 = touching, 0 = at max dist
        const tti  = particles[i].ttl;
        const ttj  = particles[j].ttl;

        let alpha, lineColor, nearMouse = false;
        if (tti !== undefined || ttj !== undefined) {
          // burst lines: gold
          const age  = Math.max(tti ? particles[i].age : 0, ttj ? particles[j].age : 0);
          const life = Math.max(tti || 120, ttj || 120);
          alpha     = t * 0.8 * (1 - age / life);
          lineColor = LINE_GOLD;
        } else {
          nearMouse =
            dist2(particles[i], mouse) < MOUSE_RADIUS * MOUSE_RADIUS ||
            dist2(particles[j], mouse) < MOUSE_RADIUS * MOUSE_RADIUS;
          alpha     = nearMouse ? t * 0.5 : t * 0.12;
          lineColor = nearMouse ? LINE_GOLD : LINE_NAVY;
        }

        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = lineColor + alpha + ')';
        ctx.lineWidth   = nearMouse ? 1.6 : 1.0;
        ctx.stroke();
      }
    }

    /* draw mouse hub lines */
    if (mouse.x > 0) {
      const mr2 = MOUSE_RADIUS * MOUSE_RADIUS;
      for (let i = 0; i < particles.length; i++) {
        const d2 = dist2(particles[i], mouse);
        if (d2 > mr2) continue;
        const t     = 1 - d2 / mr2;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = LINE_GOLD + (t * 0.4) + ')';
        ctx.lineWidth   = 0.8;
        ctx.stroke();
      }
      // Mouse node dot
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = LINE_GOLD + '0.9)';
      ctx.fill();
    }

    /* draw nodes */
    for (const p of particles) {
      let alpha = 0.35;
      if (p.ttl !== undefined) alpha = 0.8 * (1 - p.age / p.ttl);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = NODE_COLOR + alpha + ')';
      ctx.fill();
    }

    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', () => {
    resize();
    particles.forEach(p => {
      if (p.x > W) p.x = Math.random() * W;
      if (p.y > H) p.y = Math.random() * H;
    });
  });

  init();
  tick();
})();
