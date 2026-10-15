// Homepage banner: the twisting belt of project cards. Draws in a worker on an OffscreenCanvas.
// Falls back to the plain banner (copy on navy) when OffscreenCanvas or WebGL is not available.
const mount = document.querySelector<HTMLElement>('[data-twist]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (mount) {
  const images: string[] = JSON.parse(mount.dataset.images ?? '[]');
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  const supported = typeof (canvas as any).transferControlToOffscreen === 'function' && typeof Worker !== 'undefined';

  if (supported && images.length) {
    mount.appendChild(canvas);
    const worker = new Worker(new URL('./twist-worker.ts', import.meta.url), { type: 'module' });
    const dpr = () => Math.min(window.devicePixelRatio || 1, 1.5);
    const size = () => ({ w: Math.max(1, mount.clientWidth || 600), h: Math.max(1, mount.clientHeight || 400) });

    // Sizes tuned per screen: more distance on narrow screens so several cards stay in view
    const motion = () => {
      const paused = mount.dataset.paused === 'true' || reduceMotion;
      return { scrollSpeed: paused ? 0 : 1.4, spinDeg: paused ? 0 : 14 };
    };
    const props = () => {
      const w = mount.clientWidth || 1200;
      return {
        count: 96, ...motion(),
        phaseStepDeg: 9, spacing: 12, cardW: 56, cardH: 150, radius: 28, curveAmp: 22, angleDeg: -24, tiltYdeg: 0,
        camYawDeg: 10, camPitchDeg: -4, camRollDeg: 0, camDist: w < 640 ? 1050 : w < 1024 ? 880 : 900, camFovDeg: 32,
        camTargetX: 0, camTargetY: w < 640 ? -20 : -40, camTargetZ: 0,
      };
    };

    const off = (canvas as any).transferControlToOffscreen();
    worker.postMessage({ type: 'init', canvas: off, size: size(), dpr: dpr(), props: props(), images }, [off]);
    worker.addEventListener('message', (e: MessageEvent) => {
      if (e.data?.type === 'ready') mount.classList.add('is-ready');
      if (e.data?.type === 'error') { canvas.remove(); worker.terminate(); }
    });

    new ResizeObserver(() => worker.postMessage({ type: 'resize', size: size(), dpr: dpr() })).observe(mount);
    // Re-send the layout-dependent values when the window size crosses a breakpoint, and when Pause is pressed
    let lastBand = (mount.clientWidth || 1200) < 640 ? 0 : (mount.clientWidth || 1200) < 1024 ? 1 : 2;
    window.addEventListener('resize', () => {
      const w = mount.clientWidth || 1200; const band = w < 640 ? 0 : w < 1024 ? 1 : 2;
      if (band !== lastBand) { lastBand = band; worker.postMessage({ type: 'props', props: props() }); }
    });
    mount.addEventListener('twist-motion', () => worker.postMessage({ type: 'props', props: motion() }));
  }
}
