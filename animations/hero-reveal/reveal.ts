/* Hero split: day photo on the left, night photo on the right, cut by an invisible vertical edge.
   The edge starts at the middle and glides after the pointer, so moving left or right shows more of one side. */
const hero = document.querySelector<HTMLElement>('[data-reveal-hero]');
const night = hero?.querySelector<HTMLElement>('[data-reveal-night]');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (hero && night && !reduce) {
  let target = 50, current = 50, raf = 0, visible = true;
  const apply = () => night.style.setProperty('--split', `${current.toFixed(2)}%`);

  const tick = () => {
    raf = 0;
    const d = target - current;
    if (Math.abs(d) < 0.03) { current = target; apply(); return; }
    current += d * 0.14; // ease toward the pointer
    apply();
    if (visible) raf = requestAnimationFrame(tick);
  };
  const go = () => { if (!raf && visible) raf = requestAnimationFrame(tick); };

  const set = (clientX: number) => {
    const r = hero.getBoundingClientRect();
    target = Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100));
    go();
  };

  hero.addEventListener('pointermove', (e) => set(e.clientX), { passive: true });
  hero.addEventListener('pointerdown', (e) => set(e.clientX), { passive: true });
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) go(); }, { threshold: 0.01 }).observe(hero);
}
