/* Hero reveal: the night-time city is shown through a soft splash that follows the pointer, over the daytime nature photo. */
const hero = document.querySelector<HTMLElement>('[data-reveal-hero]');
const canvas = hero?.querySelector<HTMLCanvasElement>('[data-reveal-canvas]');
const nightImg = hero?.querySelector<HTMLImageElement>('[data-reveal-night]');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (hero && canvas && nightImg && !reduce) {
  const ctx = canvas.getContext('2d')!;
  const mask = document.createElement('canvas');
  const mctx = mask.getContext('2d', { willReadFrequently: true })!;
  const edge = document.createElement('canvas'); // the mask after the "wet paint" threshold
  const ectx = edge.getContext('2d')!;
  const MS = 0.33; // mask runs at a third of the size; upscaling keeps the paint edge smooth
  let w = 0, h = 0, active = false, visible = true, raf = 0, last = 0, lastMove = 0, userMoved = false;
  let px = -1, py = -1;
  type Drop = { x: number; y: number; vx: number; vy: number; r: number; life: number; kind: 'drop' | 'drip' };
  let drops: Drop[] = [];

  const size = () => {
    const r = hero.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = Math.round(r.width * dpr); h = Math.round(r.height * dpr);
    canvas.width = w; canvas.height = h;
    mask.width = edge.width = Math.max(1, Math.round(w * MS));
    mask.height = edge.height = Math.max(1, Math.round(h * MS));
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
    g.addColorStop(0.6, `rgba(255,255,255,${a * 0.8})`);
    g.addColorStop(1, 'rgba(255,255,255,0)');
    mctx.fillStyle = g;
    mctx.beginPath(); mctx.arc(x, y, r, 0, Math.PI * 2); mctx.fill();
  };
  const baseR = () => Math.min(w, 1600) * 0.07 * MS;

  // Overlapping soft blobs merge into one thick puddle once the threshold is applied (see frame)
  const stamp = (x: number, y: number, speed: number, dx: number, dy: number) => {
    const base = baseR();
    const r = base * (1 + Math.min(speed / 50, 0.8));
    const mx = x * MS, my = y * MS;
    blob(mx, my, r, 1);
    for (let i = 0; i < 4; i++) {
      const an = Math.random() * Math.PI * 2, d = r * (0.35 + Math.random() * 0.55);
      blob(mx + Math.cos(an) * d, my + Math.sin(an) * d, r * (0.4 + Math.random() * 0.35), 1);
    }
    // flung paint: droplets leave along the direction of travel
    const len = Math.hypot(dx, dy) || 1;
    if (speed > 6 && Math.random() < 0.55) {
      const n = Math.min(3, 1 + Math.floor(speed / 20));
      for (let i = 0; i < n; i++) {
        const sp = 1.1 + Math.random() * 2.4, sp2 = (Math.random() - 0.5) * 2.4;
        drops.push({ x: mx, y: my, vx: (dx / len) * sp - (dy / len) * sp2, vy: (dy / len) * sp + (dx / len) * sp2, r: base * (0.1 + Math.random() * 0.16), life: 16 + Math.random() * 22, kind: 'drop' });
      }
    }
    // paint runs down from the puddle
    if (Math.random() < 0.07) {
      drops.push({ x: mx + (Math.random() - 0.5) * r * 0.8, y: my + r * 0.4, vx: 0, vy: 0.45 + Math.random() * 0.35, r: base * (0.16 + Math.random() * 0.1), life: 70 + Math.random() * 60, kind: 'drip' });
    }
  };

  const splat = (x: number, y: number) => {
    const base = baseR(), mx = x * MS, my = y * MS;
    blob(mx, my, base * 1.6, 1);
    for (let i = 0; i < 16; i++) {
      const an = (i / 16) * Math.PI * 2 + Math.random() * 0.3, sp = 1.5 + Math.random() * 3.2;
      drops.push({ x: mx, y: my, vx: Math.cos(an) * sp, vy: Math.sin(an) * sp, r: base * (0.1 + Math.random() * 0.2), life: 14 + Math.random() * 20, kind: 'drop' });
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
    for (let i = 1; i <= n; i++) stamp(px + (dx * i) / n, py + (dy * i) / n, dist / n, dx, dy);
    px = x; py = y;
    wake();
  };

  const frame = (t: number) => {
    raf = 0;
    if (!visible) return;
    const dt = Math.min(48, t - (last || t)); last = t;
    const f = dt / 16.7;
    // paint dries slowly: the whole puddle thins, then its edge pulls in
    mctx.globalCompositeOperation = 'destination-out';
    mctx.fillStyle = `rgba(0,0,0,${Math.min(0.2, dt * 0.0006)})`;
    mctx.fillRect(0, 0, mask.width, mask.height);
    mctx.globalCompositeOperation = 'source-over';
    drops = drops.filter((d) => {
      d.life -= f;
      if (d.kind === 'drop') { d.x += d.vx * f; d.y += d.vy * f; d.vx *= 0.96; d.vy = d.vy * 0.96 + 0.03 * f; blob(d.x, d.y, d.r * (0.5 + Math.min(1, d.life / 14) * 0.5), 1); }
      else { d.y += d.vy * f; d.vy *= 0.992; d.r *= 0.996; blob(d.x, d.y, d.r, 1); }
      return d.life > 0;
    });
    // wet-paint edge: soft alpha becomes a defined, glossy-looking outline
    const img = mctx.getImageData(0, 0, mask.width, mask.height), d = img.data;
    for (let i = 3; i < d.length; i += 4) {
      const a = d[i] / 255;
      const v = a <= 0.4 ? 0 : a >= 0.5 ? 1 : (a - 0.4) / 0.1;
      d[i] = v * v * (3 - 2 * v) * 255;
    }
    ectx.putImageData(img, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, w, h);
    drawNight();
    ctx.globalCompositeOperation = 'destination-in';
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(edge, 0, 0, w, h);
    ctx.globalCompositeOperation = 'source-over';
    if (performance.now() - lastMove > 4200 && drops.length === 0) { active = false; ctx.clearRect(0, 0, w, h); last = 0; return; }
    raf = requestAnimationFrame(frame);
  };
  function wake() { lastMove = performance.now(); if (!active || !raf) { active = true; if (!raf) raf = requestAnimationFrame(frame); } }

  hero.addEventListener('pointermove', (e) => { userMoved = true; move(e.clientX, e.clientY); }, { passive: true });
  hero.addEventListener('pointerleave', () => { px = -1; });
  hero.addEventListener('pointerdown', (e) => { userMoved = true; px = -1; move(e.clientX, e.clientY); const r = canvas.getBoundingClientRect(), k = w / r.width; splat((e.clientX - r.left) * k, (e.clientY - r.top) * k); }, { passive: true });

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
