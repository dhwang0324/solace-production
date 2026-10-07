const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Header: solid once the page scrolls past the top of an over-hero layout */
const header = document.querySelector<HTMLElement>('[data-header]');
if (header?.dataset.over) {
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  const update = () => {
    const limit = hero ? hero.offsetHeight - header.offsetHeight : 40;
    header.classList.toggle('is-scrolled', window.scrollY > limit);
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
} else if (header) {
  const update = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  update();
  window.addEventListener('scroll', update, { passive: true });
}

/* Phone menu with focus trap */
const menu = document.querySelector<HTMLElement>('[data-menu]');
const openBtn = document.querySelector<HTMLButtonElement>('[data-menu-open]');
const closeBtns = [...document.querySelectorAll<HTMLElement>('[data-menu-close]')];
if (menu && openBtn && closeBtns.length) {
  const focusables = () => [...menu.querySelectorAll<HTMLElement>('a, button:not([tabindex="-1"])')];
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') close();
    if (e.key !== 'Tab') return;
    const f = focusables();
    const first = f[0];
    const last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };
  const open = () => {
    menu.hidden = false;
    openBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    menu.querySelector<HTMLElement>('.menu-close')?.focus();
  };
  const close = () => {
    menu.hidden = true;
    openBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKey);
    openBtn.focus();
  };
  openBtn.addEventListener('click', open);
  closeBtns.forEach((b) => b.addEventListener('click', close));
}

/* Reveal on scroll */
// A fully clipped element never reports as intersecting, so clip reveals are
// triggered by watching their parent instead.
const revealEls = [...document.querySelectorAll<HTMLElement>('[data-reveal], [data-clip]')];
if (reduceMotion || !('IntersectionObserver' in window)) {
  revealEls.forEach((el) => el.classList.add('is-in'));
} else {
  const targets = new Map<Element, HTMLElement[]>();
  revealEls.forEach((el) => {
    const watch = el.hasAttribute('data-clip') && el.parentElement ? el.parentElement : el;
    targets.set(watch, [...(targets.get(watch) ?? []), el]);
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      targets.get(e.target)?.forEach((el) => el.classList.add('is-in'));
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
  targets.forEach((_, watch) => io.observe(watch));
}

/* Hero slideshow */
const hero = document.querySelector<HTMLElement>('[data-hero]');
if (hero) {
  const slides = [...hero.querySelectorAll<HTMLElement>('[data-slide]')];
  const bars = [...hero.querySelectorAll<HTMLButtonElement>('[data-goto]')];
  const pauseBtn = hero.querySelector<HTMLButtonElement>('[data-pause]');
  const DURATION = 6000;
  let current = 0;
  let timer: number | undefined;
  let userPaused = reduceMotion;
  let hoverPaused = false;
  hero.style.setProperty('--dur', `${DURATION}ms`);

  const show = (i: number) => {
    current = (i + slides.length) % slides.length;
    slides.forEach((s, n) => {
      s.classList.toggle('is-active', n === current);
      if (n === current) s.removeAttribute('aria-hidden'); else s.setAttribute('aria-hidden', 'true');
    });
    bars.forEach((b, n) => {
      b.removeAttribute('aria-current');
      if (n === current) { void b.offsetWidth; b.setAttribute('aria-current', 'true'); }
    });
  };
  const schedule = () => {
    window.clearTimeout(timer);
    const paused = userPaused || hoverPaused;
    hero.classList.toggle('is-paused', paused);
    if (!paused) timer = window.setTimeout(() => { show(current + 1); schedule(); }, DURATION);
  };
  const setPaused = (p: boolean) => {
    userPaused = p;
    if (pauseBtn) { pauseBtn.textContent = p ? 'Play' : 'Pause'; pauseBtn.setAttribute('aria-pressed', String(p)); }
    show(current);
    schedule();
  };

  bars.forEach((b) => b.addEventListener('click', () => { show(Number(b.dataset.goto)); schedule(); }));
  pauseBtn?.addEventListener('click', () => setPaused(!userPaused));
  hero.addEventListener('mouseenter', () => { hoverPaused = true; schedule(); });
  hero.addEventListener('mouseleave', () => { hoverPaused = false; show(current); schedule(); });
  hero.addEventListener('focusin', () => { hoverPaused = true; schedule(); });
  hero.addEventListener('focusout', () => { hoverPaused = false; schedule(); });
  hero.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { show(current + 1); schedule(); }
    if (e.key === 'ArrowLeft') { show(current - 1); schedule(); }
  });
  let startX = 0;
  hero.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  hero.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) { show(current + (dx < 0 ? 1 : -1)); schedule(); }
  });
  if (reduceMotion) hero.classList.add('no-auto');
  setPaused(userPaused);
}

/* Work filters */
const filterGroup = document.querySelector<HTMLElement>('[data-filters]');
if (filterGroup) {
  const buttons = [...filterGroup.querySelectorAll<HTMLButtonElement>('[data-filter]')];
  const cards = [...document.querySelectorAll<HTMLElement>('[data-projects] [data-cats]')];
  const empty = document.querySelector<HTMLElement>('[data-empty]');
  const apply = (f: string) => {
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === f)));
    let shown = 0;
    cards.forEach((c) => {
      const match = f === 'all' || (c.dataset.cats ?? '').split('|').includes(f);
      c.hidden = !match;
      if (match) shown++;
    });
    if (empty) empty.hidden = shown > 0;
  };
  buttons.forEach((b) => b.addEventListener('click', () => {
    const f = b.dataset.filter ?? 'all';
    apply(f);
    const url = new URL(location.href);
    if (f === 'all') url.searchParams.delete('filter'); else url.searchParams.set('filter', f);
    history.replaceState(null, '', url);
  }));
  const initial = new URLSearchParams(location.search).get('filter');
  if (initial && buttons.some((b) => b.dataset.filter === initial)) apply(initial);
}

/* Contact form: client-side validation; not connected to a sender yet */
const form = document.querySelector<HTMLFormElement>('[data-form]');
if (form) {
  const status = form.querySelector<HTMLElement>('[data-status]');
  const fields: [string, (v: string) => boolean][] = [
    ['f-name', (v) => v.trim().length > 0],
    ['f-email', (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())],
    ['f-msg', (v) => v.trim().length > 0],
  ];
  form.addEventListener('submit', (e) => {
    let firstBad: HTMLElement | null = null;
    fields.forEach(([id, ok]) => {
      const input = form.querySelector<HTMLInputElement | HTMLTextAreaElement>(`#${id}`)!;
      const err = form.querySelector<HTMLElement>(`#${id}-err`)!;
      const valid = ok(input.value);
      input.setAttribute('aria-invalid', String(!valid));
      if (!valid) input.setAttribute('aria-describedby', `${id}-err`); else input.removeAttribute('aria-describedby');
      err.hidden = valid;
      if (!valid && !firstBad) firstBad = input;
    });
    if (firstBad) { e.preventDefault(); (firstBad as HTMLElement).focus(); return; }
    if (!form.dataset.endpoint) {
      e.preventDefault();
      if (status) status.textContent = 'Thanks — online sending isn’t switched on yet. Please email hello@solaceproduction.com and we’ll reply personally.';
    }
  });
}
