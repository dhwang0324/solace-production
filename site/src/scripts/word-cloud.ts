// Spinning cloud of words on a sphere (ported from the supplied Framer component).
// Drag in any direction to roll it like a ball; it also turns slowly by itself unless the visitor prefers reduced motion.
const host = document.querySelector<HTMLElement>('[data-cloud]');
if (host) {
  const words: string[] = JSON.parse(host.dataset.words ?? '[]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const AUTO = reduceMotion ? 0 : 0.004; // slow self-spin, radians per frame
  const FONT_SCALE = 0.078;              // font size relative to the cloud's width
  const SENS = 0.006;                    // radians per px dragged
  const FRICTION = 0.94;                 // how quickly a flick slows down

  const list = document.createElement('ul');
  list.className = 'cloud__list';
  const tags = words.map((w) => {
    const li = document.createElement('li');
    li.textContent = w;
    list.appendChild(li);
    return li;
  });
  host.appendChild(list);

  // Fibonacci sphere: evenly spread points
  const N = Math.max(1, words.length);
  const golden = Math.PI * (3 - Math.sqrt(5));
  const points = words.map((_, i) => {
    const y = 1 - (i / Math.max(1, N - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const a = golden * i;
    return [Math.cos(a) * r, y, Math.sin(a) * r] as const;
  });

  // The ball's orientation is a 3x3 rotation matrix. Each drag or spin step turns it a little about a screen axis.
  type M3 = number[]; // row-major
  let m: M3 = [1, 0, 0, 0, 1, 0, 0, 0, 1];
  const mul = (a: M3, b: M3): M3 => {
    const o = new Array(9).fill(0);
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) for (let k = 0; k < 3; k++) o[r * 3 + c] += a[r * 3 + k] * b[k * 3 + c];
    return o;
  };
  const axisAngle = (x: number, y: number, z: number, ang: number): M3 => {
    const l = Math.hypot(x, y, z) || 1; x /= l; y /= l; z /= l;
    const s = Math.sin(ang), c = Math.cos(ang), t = 1 - c;
    return [c + x * x * t, x * y * t - z * s, x * z * t + y * s, y * x * t + z * s, c + y * y * t, y * z * t - x * s, z * x * t - y * s, z * y * t + x * s, c + z * z * t];
  };
  const tidy = () => { // keep the matrix a true rotation despite rounding drift
    const n = (i: number) => Math.hypot(m[i], m[i + 1], m[i + 2]) || 1;
    for (let r = 0; r < 3; r++) { const l = n(r * 3); for (let c = 0; c < 3; c++) m[r * 3 + c] /= l; }
  };
  const spin = (dx: number, dy: number) => { // dx turns it about the vertical axis, dy about the horizontal axis
    if (dx) m = mul(axisAngle(0, 1, 0, dx), m);
    if (dy) m = mul(axisAngle(1, 0, 0, dy), m);
  };

  let size = host.clientWidth;
  const paint = () => {
    const half = size / 2;
    // On a phone the cloud is as wide as the screen, so smaller words that stay within it
    const phone = size < 520;
    const spread = phone ? 0.7 : 0.95; // how far from the centre the words reach
    host.style.setProperty('--cloud-fs', `${Math.max(12, size * (phone ? 0.056 : FONT_SCALE))}px`);
    for (let i = 0; i < tags.length; i++) {
      const [x, y, z] = points[i];
      const X = m[0] * x + m[1] * y + m[2] * z;
      const Y = m[3] * x + m[4] * y + m[5] * z;
      const Z = m[6] * x + m[7] * y + m[8] * z;
      tags[i].style.transform = `translate(-50%, -50%) translate(${half * spread * X}px, ${half * spread * Y}px) scale(${(Z + 2) / 3})`;
      tags[i].style.opacity = String(Math.max(0.08, Math.min(1, (Z + 1.5) / 2.5)));
    }
  };

  new ResizeObserver(() => { size = host.clientWidth; paint(); }).observe(host);
  paint();

  // Drag to roll the ball in any direction; a quick flick keeps it rolling for a moment
  let dragging = false, lastX = 0, lastY = 0, vx = 0, vy = 0;
  host.addEventListener('pointerdown', (e) => { dragging = true; lastX = e.clientX; lastY = e.clientY; vx = vy = 0; host.classList.add('is-dragging'); host.setPointerCapture(e.pointerId); });
  host.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    vx = (e.clientX - lastX) * SENS; vy = -(e.clientY - lastY) * SENS; // the front of the ball follows the finger
    lastX = e.clientX; lastY = e.clientY;
    spin(vx, vy);
    if (!running) paint();
  });
  const end = (e: PointerEvent) => { if (!dragging) return; dragging = false; host.classList.remove('is-dragging'); try { host.releasePointerCapture(e.pointerId); } catch { /* already released */ } };
  host.addEventListener('pointerup', end);
  host.addEventListener('pointercancel', end);

  // Only animate while the cloud is on screen
  let running = false, raf = 0, frames = 0;
  const tick = () => {
    if (!dragging) { spin(vx, vy); vx *= FRICTION; vy *= FRICTION; if (Math.abs(vx) < 1e-5) vx = 0; if (Math.abs(vy) < 1e-5) vy = 0; }
    if (AUTO) m = mul(axisAngle(0.3, 1, 0.1, AUTO), m);
    if (++frames % 120 === 0) tidy();
    paint();
    raf = requestAnimationFrame(tick);
  };
  new IntersectionObserver(([entry]) => {
    cancelAnimationFrame(raf);
    running = entry.isIntersecting;
    if (running) raf = requestAnimationFrame(tick);
  }).observe(host);
}
