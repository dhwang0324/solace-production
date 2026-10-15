// Scramble text: letters flicker through random characters and settle into the real text, in random order.
// Ported from the supplied Framer component "ScrambleText v7" as plain TypeScript (no React, no Framer).
//
// Usage in HTML:   <h2 data-scramble data-trigger="view">Digital presence</h2>
// Options (data attributes, all optional):
//   data-trigger     "view" (default: once, when it scrolls into view) | "view-repeat" (every time it re-enters) | "hover" (hover or keyboard focus)
//   data-duration    total time in ms (default 900)
//   data-fps         frames per second of the flicker (default 30)
//   data-ease        "out" (default) | "linear" | "inout": how the reveal speeds up and slows down
//   data-intensity   0 to 1: share of not-yet-revealed letters that flicker (default 1; lower = more of the real letters show through)
//   data-charset     characters used for the flicker (default letters, digits and a few symbols)
//
// Behaviour: screen readers always get the real text (aria-label), never the random characters.
// Visitors who prefer reduced motion see the real text with no animation.
// Tip: a monospace or tabular font stops the line from jiggling in width while it flickers.

type Ease = 'linear' | 'out' | 'inout';
export interface ScrambleOptions { duration?: number; fps?: number; ease?: Ease; intensity?: number; charset?: string }

const DEFAULT_CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%*';
const easePortion = (t: number, mode: Ease) => (mode === 'linear' ? t : mode === 'out' ? 1 - Math.pow(1 - t, 3) : t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Sets up one element. Returns a function that plays the animation (ignored while it is already playing). */
export function scrambleText(el: HTMLElement, opts: ScrambleOptions = {}): () => void {
  const final = (el.textContent ?? '').replace(/\s+$/, '');
  const { duration = 900, fps = 30, ease = 'out', intensity = 1, charset = DEFAULT_CHARSET } = opts;
  const pool = charset.split('');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Real text for assistive tech; the visible, changing copy is hidden from it
  el.setAttribute('aria-label', final);
  const view = document.createElement('span');
  view.setAttribute('aria-hidden', 'true');
  view.textContent = final;
  el.textContent = '';
  el.appendChild(view);

  let running = false;
  let raf = 0;
  const letters = final.split('');
  const movable = letters.map((c, i) => (/\s/.test(c) ? -1 : i)).filter((i) => i >= 0); // spaces and line breaks never change

  return () => {
    if (running || reduceMotion || movable.length === 0) return;
    running = true;
    // Hold the width steady while the letters change, so centred or wrapped text does not jiggle (released when it finishes)
    const oneLine = view.getClientRects().length === 1; // a single line must not wrap when a random letter is wider than the real one
    view.style.display = 'inline-block';
    view.style.width = `${Math.ceil(view.getBoundingClientRect().width)}px`;
    if (oneLine) view.style.whiteSpace = 'nowrap';
    const frames = Math.max(1, Math.round((duration / 1000) * fps));
    const order = movable.slice();
    for (let i = order.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [order[i], order[j]] = [order[j], order[i]]; }
    const frameMs = 1000 / fps;
    let frame = 0;
    let last = 0;
    const tick = (now: number) => {
      if (now - last >= frameMs || last === 0) {
        last = now;
        const revealed = Math.floor(easePortion((frame + 1) / frames, ease) * order.length);
        const out = letters.slice();
        const pending = order.length - revealed;
        const flicker = Math.floor(intensity * pending);
        for (let k = 0; k < flicker; k++) out[order[revealed + k]] = pool[(Math.random() * pool.length) | 0];
        view.textContent = out.join('');
        frame++;
        if (frame >= frames) { view.textContent = final; view.style.display = view.style.width = view.style.whiteSpace = ''; running = false; return; }
      }
      raf = requestAnimationFrame(tick);
    };
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(tick);
  };
}

/** Finds every [data-scramble] element on the page and wires up its trigger. */
export function initScrambleText(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('[data-scramble]').forEach((el) => {
    const d = el.dataset;
    const playNow = scrambleText(el, {
      duration: d.duration ? +d.duration : undefined,
      fps: d.fps ? +d.fps : undefined,
      ease: (d.ease?.toLowerCase() as Ease) || undefined,
      intensity: d.intensity ? +d.intensity : undefined,
      charset: d.charset || undefined,
    });
    // Wait for the web fonts first, so the line is measured in its real font (a fallback font is wider and can wrap)
    const play = () => { (document.fonts?.ready ?? Promise.resolve()).then(playNow); };
    const trigger = d.trigger ?? 'view';
    if (trigger === 'hover') {
      el.addEventListener('pointerenter', play);
      el.addEventListener('focusin', play);
    } else {
      const once = trigger !== 'view-repeat';
      const io = new IntersectionObserver((entries) => {
        for (const e of entries) {
          if (!e.isIntersecting || e.intersectionRatio < 0.25) continue;
          play();
          if (once) io.disconnect();
        }
      }, { threshold: [0, 0.25, 0.5, 0.75, 1] });
      io.observe(el);
    }
  });
}

// Runs by itself when this file is loaded on a page that has [data-scramble] elements
initScrambleText();
