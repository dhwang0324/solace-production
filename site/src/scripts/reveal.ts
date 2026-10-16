/* Hero reveal: the night-time city is shown through a soft splash that follows the pointer, over the daytime nature photo. */
const hero = document.querySelector<HTMLElement>('[data-reveal-hero]');
const canvas = hero?.querySelector<HTMLCanvasElement>('[data-reveal-canvas]');
const nightImg = hero?.querySelector<HTMLImageElement>('[data-reveal-night]');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (hero && canvas && nightImg && !reduce) {
  const ctx = canvas.getContext('2d')!;
  const mask = document.createElement('canvas');
  const mctx = mask.getContext('2d')!;
  const MS = 0.25; // mask runs at quarter size; upscaling softens its edges
  let w = 0, h = 0, active = false, visible = true, raf = 0, last = 0;
  let px = -1, py = -1, drops: { x: number; y: number; r: number; life: number }[] = [];

  const size = () => {
    const r = hero.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    w = Math.round(r.width * dpr); h = Math.round(r.height * dpr);
    canvas.width = w; canvas.height = h;
    mask.width = Math.max(1, Math.round(w * MS)); mask.height = Math.max(1, Math.round(h * MS));
  };

  // The night photo is drawn "cover", the same way the day photo is
  const drawNight = () => {
    const iw = nightImg.naturalWidth, ih = nightImg.naturalHeight;
    if (!iw) return;
    const s = Math.max(w / iw, h / ih);
    ctx.drawImage(nightImg, (w - iw * s) / 2, (h - ih * s) / 2, iw * s, ih * s);
  };

  const blob = (x: number, y: number, r: number, a: number) => {
    const g = mctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(255,255,255,${a})`);
    g.addColorStop(0.55, `rgba(255,255,255,${a * 0.75})`);
    g.addColorStop(1, 'rgba(255,255,255,0)');
    mctx.fillStyle = g;
    mctx.beginPath(); mctx.arc(x, y, r, 0, Math.PI * 2); mctx.fill();
  };

  const stamp = (x: number, y: number, speed: number) => {
    const base = (Math.min(w, 1600) * 0.11) * MS;
    const r = base * (1 + Math.min(speed / 60, 0.9));
    blob(x * MS, y * MS, r, 0.9);
    // lobes around the head and a few droplets thrown off, so the edge reads as a splash
    for (let i = 0; i < 3; i++) {
      const a = Math.random() * Math.PI * 2, d = r * (0.5 + Math.random() * 0.5);
      blob(x * MS + Math.cos(a) * d, y * MS + Math.sin(a) * d, r * (0.35 + Math.random() * 0.3), 0.8);
    }
    if (speed > 10 && Math.random() < 0.7) {
      const a = Math.random() * Math.PI * 2, d = r * (1.2 + Math.random() * 1.1);
      drops.push({ x: x * MS + Math.cos(a) * d, y: y * MS + Math.sin(a) * d, r: r * (0.12 + Math.random() * 0.18), life: 1 });
    }
  };

  const move = (cx: number, cy: number) => {
    const rect = canvas.getBoundingClientRect();
    const k = w / rect.width;
    const x = (cx - rect.left) * k, y = (cy - rect.top) * k;
    if (px < 0) { px = x; py = y; }
    const dx = x - px, dy = y - py, dist = Math.hypot(dx, dy);
    const step = Math.max(6, w * 0.006);
    const n = Math.max(1, Math.ceil(dist / step));
    for (let i = 1; i <= n; i++) stamp(px + (dx * i) / n, py + (dy * i) / n, dist / n);
    px = x; py = y;
    wake();
  };

  const frame = (t: number) => {
    raf = 0;
    if (!visible) return;
    const dt = Math.min(48, t - (last || t)); last = t;
    // fade the mask: the reveal melts away behind the pointer
    mctx.globalCompositeOperation = 'destination-out';
    mctx.fillStyle = `rgba(0,0,0,${Math.min(0.5, dt * 0.0016)})`;
    mctx.fillRect(0, 0, mask.width, mask.height);
    mctx.globalCompositeOperation = 'source-over';
    drops = drops.filter((d) => (d.life -= dt * 0.0022) > 0);
    drops.forEach((d) => blob(d.x, d.y, d.r, Math.max(0, d.life)));
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, w, h);
    drawNight();
    ctx.globalCompositeOperation = 'destination-in';
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(mask, 0, 0, w, h);
    ctx.globalCompositeOperation = 'source-over';
    if (performance.now() - lastMove > 2800) { active = false; ctx.clearRect(0, 0, w, h); last = 0; return; }
    raf = requestAnimationFrame(frame);
  };
  let lastMove = 0, userMoved = false;
  function wake() { lastMove = performance.now(); if (!active || !raf) { active = true; if (!raf) raf = requestAnimationFrame(frame); } }

  hero.addEventListener('pointermove', (e) => { userMoved = true; move(e.clientX, e.clientY); }, { passive: true });
  hero.addEventListener('pointerleave', () => { px = -1; });
  hero.addEventListener('pointerdown', (e) => { userMoved = true; px = -1; move(e.clientX, e.clientY); }, { passive: true });

  // Intro: one slow sweep so visitors on touch screens (and anyone not yet moving the mouse) see what it does
  const intro = () => {
    const t0 = performance.now(), D = 2600;
    const rect = canvas.getBoundingClientRect();
    const tick = () => {
      const p = (performance.now() - t0) / D;
      if (p >= 1 || userMoved) return;
      const e = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      move(rect.left + rect.width * (0.12 + 0.76 * e), rect.top + rect.height * (0.42 + 0.1 * Math.sin(e * Math.PI * 2)));
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible && active) wake(); }, { threshold: 0.05 }).observe(hero);
  window.addEventListener('resize', () => { size(); });
  size();
  const ready = () => { size(); setTimeout(intro, 900); };
  if (nightImg.complete && nightImg.naturalWidth) ready(); else nightImg.addEventListener('load', ready, { once: true });
}
