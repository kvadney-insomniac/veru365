/* ─── SPIDER WEB CANVAS ───────────────────────────────────────────────────── */
(function () {
  const canvas = document.getElementById('web');
  const ctx    = canvas.getContext('2d');

  const PARTICLE_COUNT = 40;
  const MAX_DIST       = 160;
  const BASE_SPEED     = 0.3;

  const NODE_COLOR = 'rgba(27,43,94,';
  const LINE_NAVY  = 'rgba(27,43,94,';

  let W, H, dpr;
  let particles = [];

  function resize() {
    dpr = window.devicePixelRatio || 1;
    W   = window.innerWidth  || document.documentElement.clientWidth  || 1280;
    H   = window.innerHeight || document.documentElement.clientHeight || 800;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function makeParticle() {
    const angle = Math.random() * Math.PI * 2;
    const speed = BASE_SPEED * (0.4 + Math.random() * 0.9);
    return {
      x:      Math.random() * W,
      y:      Math.random() * H,
      vx:     Math.cos(angle) * speed,
      vy:     Math.sin(angle) * speed,
      r:      1.5 + Math.random() * 1.5,
      wander: (Math.random() - 0.5) * 0.004,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, makeParticle);
  }

  function dist2(a, b) {
    const dx = a.x - b.x, dy = a.y - b.y;
    return dx * dx + dy * dy;
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);

    for (const p of particles) {
      const angle = Math.atan2(p.vy, p.vx) + p.wander;
      const spd   = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      p.vx = Math.cos(angle) * spd;
      p.vy = Math.sin(angle) * spd;

      const s = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (s > BASE_SPEED * 1.8) { p.vx = (p.vx / s) * BASE_SPEED * 1.8; p.vy = (p.vy / s) * BASE_SPEED * 1.8; }

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -20) p.x = W + 20;
      if (p.x > W + 20) p.x = -20;
      if (p.y < -20) p.y = H + 20;
      if (p.y > H + 20) p.y = -20;
    }

    const max2 = MAX_DIST * MAX_DIST;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const d2 = dist2(particles[i], particles[j]);
        if (d2 > max2) continue;
        const t = 1 - d2 / max2;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = LINE_NAVY + (t * 0.12) + ')';
        ctx.lineWidth   = 1.0;
        ctx.stroke();
      }
    }

    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = NODE_COLOR + '0.35)';
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
