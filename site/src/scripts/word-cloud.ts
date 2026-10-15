// Spinning cloud of words on a sphere (ported from the supplied Framer component).
// Drag sideways to turn it; it also turns slowly by itself unless the visitor prefers reduced motion.
const host = document.querySelector<HTMLElement>('[data-cloud]');
if (host) {
  const words: string[] = JSON.parse(host.dataset.words ?? '[]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SPEED = reduceMotion ? 0 : 0.006; // radians per frame
  const FONT_SCALE = 0.07;                // font size relative to the cloud's width
  const SENS = 0.004;                     // radians per px dragged

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

  // Rotation about a fixed axis (Rodrigues)
  const len = Math.hypot(0.6, 1, 0.2);
  const [ux, uy, uz] = [0.6 / len, 1 / len, 0.2 / len];
  let base = 0;
  let scrub = 0;
  let size = host.clientWidth;

  const paint = () => {
    const theta = base + scrub;
    const sin = Math.sin(theta), cos = Math.cos(theta), t = 1 - cos;
    const half = size / 2;
    host.style.setProperty('--cloud-fs', `${Math.max(12, size * FONT_SCALE)}px`);
    for (let i = 0; i < tags.length; i++) {
      const [x, y, z] = points[i];
      const X = (cos + ux * ux * t) * x + (ux * uy * t - uz * sin) * y + (ux * uz * t + uy * sin) * z;
      const Y = (uy * ux * t + uz * sin) * x + (cos + uy * uy * t) * y + (uy * uz * t - ux * sin) * z;
      const Z = (uz * ux * t - uy * sin) * x + (uz * uy * t + ux * sin) * y + (cos + uz * uz * t) * z;
      tags[i].style.transform = `translate(-50%, -50%) translate(${half * 0.72 * X}px, ${half * 0.72 * Y}px) scale(${(Z + 2) / 3})`;
      tags[i].style.opacity = String(Math.max(0.08, Math.min(1, (Z + 1.5) / 2.5)));
    }
  };

  new ResizeObserver(() => { size = host.clientWidth; paint(); }).observe(host);
  paint();

  // Turn by dragging (horizontal only, so the page can still be scrolled up and down)
  let dragging = false, lastX = 0;
  host.addEventListener('pointerdown', (e) => { dragging = true; lastX = e.clientX; host.classList.add('is-dragging'); host.setPointerCapture(e.pointerId); });
  host.addEventListener('pointermove', (e) => { if (!dragging) return; scrub += (e.clientX - lastX) * SENS; lastX = e.clientX; if (SPEED === 0) paint(); });
  const end = (e: PointerEvent) => { if (!dragging) return; dragging = false; host.classList.remove('is-dragging'); try { host.releasePointerCapture(e.pointerId); } catch { /* already released */ } };
  host.addEventListener('pointerup', end);
  host.addEventListener('pointercancel', end);

  // Only animate while the cloud is on screen
  let raf = 0;
  const tick = () => { base += SPEED; paint(); raf = requestAnimationFrame(tick); };
  if (SPEED > 0) {
    new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf);
      if (entry.isIntersecting) raf = requestAnimationFrame(tick);
    }).observe(host);
  }
}
