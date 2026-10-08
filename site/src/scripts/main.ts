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

/* Headlines whose words rise in one by one: wrap each word, keeping inner spans like .fade */
if (!reduceMotion) {
  document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
    let i = 0;
    const walk = (node: Node) => {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === Node.ELEMENT_NODE) { walk(child); return; }
        if (child.nodeType !== Node.TEXT_NODE || !child.textContent?.trim()) return;
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.append(part); return; }
          const outer = document.createElement('span');
          outer.className = 'sw';
          const inner = document.createElement('span');
          inner.className = 'si';
          inner.style.setProperty('--i', String(i++));
          inner.textContent = part;
          outer.append(inner);
          frag.append(outer);
        });
        child.replaceWith(frag);
      });
    };
    walk(el);
  });
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
    // Anything that starts fully clipped (image clips, label wipes, rising tiles) is watched via its parent.
    const clipped = el.hasAttribute('data-clip') || getComputedStyle(el).clipPath !== 'none';
    const watch = clipped && el.parentElement ? el.parentElement : el;
    targets.set(watch, [...(targets.get(watch) ?? []), el]);
  });
  // data-reveal="both" also plays out again when the element leaves the screen,
  // drifting up when it leaves at the top and down when it leaves at the bottom.
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      const els = targets.get(e.target) ?? [];
      const repeat = els.some((el) => el.dataset.reveal === 'both');
      if (e.isIntersecting) {
        els.forEach((el) => el.classList.remove('is-above'));
        els.forEach((el) => el.classList.add('is-in'));
        if (!repeat) io.unobserve(e.target);
      } else if (repeat) {
        const above = e.boundingClientRect.top < (e.rootBounds?.top ?? 0);
        els.forEach((el) => { el.classList.remove('is-in'); el.classList.toggle('is-above', above); });
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
  targets.forEach((_, watch) => io.observe(watch));
}

/* Words that light up one by one as the line scrolls through the screen */
const wordLines = [...document.querySelectorAll<HTMLElement>('[data-words]')];
if (wordLines.length && !reduceMotion) {
  let ticking = false;
  const paint = () => {
    ticking = false;
    const vh = window.innerHeight;
    wordLines.forEach((line) => {
      const words = [...line.querySelectorAll<HTMLElement>('.w')];
      const r = line.getBoundingClientRect();
      // 0 when the line's top reaches 85% of the screen, 1 when its bottom reaches 60%
      const start = vh * 0.85;
      const end = vh * 0.6;
      const p = Math.min(1, Math.max(0, (start - r.top) / (start - end + r.height)));
      const lit = Math.round(p * words.length);
      words.forEach((w, i) => w.classList.toggle('is-lit', i < lit));
    });
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(paint); } };
  paint();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
}

/* Stacking cards: a card eases back slightly as the next one slides over it */
const stack = document.querySelector<HTMLElement>('[data-stack]');
if (stack && !reduceMotion) {
  const cards = [...stack.children] as HTMLElement[];
  let ticking = false;
  const paint = () => {
    ticking = false;
    cards.forEach((card, i) => {
      const next = cards[i + 1];
      if (!next) return;
      const a = card.getBoundingClientRect();
      const b = next.getBoundingClientRect();
      const cover = Math.min(1, Math.max(0, (a.bottom - b.top) / a.height));
      card.style.transform = `scale(${1 - cover * 0.05})`;
      card.style.filter = `brightness(${1 - cover * 0.12})`;
    });
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(paint); } };
  paint();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
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

  // Slides with a video play only while they're showing; with reduced motion or Save-Data the poster stays.
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
  const syncVideos = () => slides.forEach((s, n) => {
    const v = s.querySelector<HTMLVideoElement>('[data-hero-video]');
    if (!v || reduceMotion || saveData) return;
    if (n === current) { v.play().then(() => v.classList.add('is-playing')).catch(() => {}); }
    else { v.pause(); }
  });
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
    syncVideos();
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
  // Mouse interaction: the scene tilts toward the cursor and a soft light follows it (mouse and trackpad only)
  if (!reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let tx = 0, ty = 0, x = 0, y = 0, gx = 0, gy = 0, raf = 0;
    const tick = () => {
      x += (tx - x) * 0.08; y += (ty - y) * 0.08;
      hero.style.setProperty('--mx', x.toFixed(4)); hero.style.setProperty('--my', y.toFixed(4));
      hero.style.setProperty('--gx', `${gx}px`); hero.style.setProperty('--gy', `${gy}px`);
      raf = Math.abs(tx - x) > 0.001 || Math.abs(ty - y) > 0.001 ? requestAnimationFrame(tick) : 0;
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      gx = e.clientX - r.left; gy = e.clientY - r.top;
      tx = (gx / r.width) * 2 - 1; ty = (gy / r.height) * 2 - 1;
      hero.classList.add('is-live'); kick();
    });
    hero.addEventListener('pointerleave', () => { tx = 0; ty = 0; hero.classList.remove('is-live'); kick(); });
  }
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
  // Links like /contact/?service=photography tick that option
  const wanted = new URLSearchParams(location.search).get('service');
  if (wanted) form.querySelectorAll<HTMLInputElement>(`input[data-service="${CSS.escape(wanted)}"]`).forEach((i) => { i.checked = true; });
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
      if (status) status.textContent = 'Thanks — online sending isn’t switched on yet. Please email dani@solaceproduction.com and we’ll reply personally.';
    }
  });
}
