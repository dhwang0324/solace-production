# Twist ribbon (3D card ribbon banner)

A dense diagonal ribbon of tall, rounded cards. Each card turns about its own tall axis a little more than its neighbour, so the strip looks like it twists. Cards are real project screenshots. Drawn with **three.js** in a **web worker** on an `OffscreenCanvas`, so the page stays responsive.

Used as the homepage banner on 2026-10-15, then removed at the owner's request (the video banner came back). In git history: commits `25cc43d` (first version) to `c9994e0` (final ribbon).

## Files
| File | Where it goes in `site/` | Job |
|---|---|---|
| `twist-worker.ts` | `src/scripts/twist-worker.ts` | The 3D scene: belt of cards, textures, animation loop. |
| `twist-gallery.ts` | `src/scripts/twist-gallery.ts` | Controller: creates the canvas, starts the worker, sets the settings per screen size, handles resize and pause. |
| `HeroSingle.gallery.astro` | `src/components/HeroSingle.astro` (replaces the video version) | Banner markup: `<div class="hs__media" data-twist data-images="[...]">`, the title, rotating word, button, Pause. |
| `index-snippet.astro.txt` | `src/pages/index.astro` | How to build the list of image URLs with `getImage` (720px WebP) and pass them as `images`. |
| `main-snippet.ts.txt` | `src/scripts/main.ts` | Rotating word + Pause button + lazy-loads the ribbon when the browser is idle. |

## To use it again
1. `cd site && npm install three@0.160.0` (bundled by Vite, no CDN needed).
2. Copy the files as in the table. The worker is loaded with `new Worker(new URL('./twist-worker.ts', import.meta.url), { type: 'module' })`.
3. Run `npm run build` and look at the banner on desktop and phone.

## The settings that matter (in `twist-gallery.ts`, function `props`)
Final ribbon (the version the owner chose to match their reference image):
- `cardW: 56, cardH: 150, radius: 28` tall pills (radius = half the width).
- `spacing: 12, count: 96` very close together so they overlap into a strip.
- `phaseStepDeg: 9` how much each card turns relative to the last (bigger = tighter twist).
- `curveAmp: 22, angleDeg: -24` gentle wave and a diagonal run (negative = down to the right).
- `scrollSpeed: 1.4, spinDeg: 14` how fast it slides and turns.
- `camDist: 900` (1050 on phones): bigger = smaller ribbon. `camTargetY: -40` moves it up/down.

Earlier looks, for reference: flat cards 180x220 with `spinDeg: 24` spinning in place (looked like a scattered pile); cards 92x118 with `curveAmp: 46` (looked like a loose cloud). The ribbon only works with **tall narrow cards rotating about their own vertical axis** (`rotation.set(0, spin, 0)` in the worker) and **small spacing**.

## Behaviour and fallbacks
- Loads after the page (idle), fades in when ready.
- Pause button stops both the ribbon and the rotating word. `prefers-reduced-motion`: static frame, Pause hidden.
- No `OffscreenCanvas`/WebGL: the canvas is removed and the navy banner shows the title and button only.
- Cost: the three.js worker is about 490 KB (gzip much smaller). Test on a real phone.

## Lessons learned
- The owner wanted the look of a light-background reference (glossy portrait photos). Screenshots of websites are mostly dark and text-heavy, so they look busier when cropped into narrow slices.
- Cards behind the header menu need a dark fade at the top of the banner so the links stay readable (`.hs__shade` in the component).
- Original Framer component props map directly to the settings above (`Scroll` = `scrollSpeed`, `Spin °/s` = `spinDeg`, `Phase °` = `phaseStepDeg`, and so on).
