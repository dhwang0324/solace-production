# Solace animations library

Reusable animations built for solaceproduction.com. They are **not** part of the website build (this folder is outside `site/`, so saving changes here never triggers a deploy). To use one on the site, copy its files into `site/` as described in that animation's README.

| Folder | What it is | Status on the live site |
|---|---|---|
| [`twist-ribbon/`](twist-ribbon/README.md) | A twisting 3D ribbon of tall rounded cards (project screenshots), drawn with three.js in a web worker. Used as the homepage banner. | Removed (video banner kept). |
| [`scramble-text/`](scramble-text/README.md) | Text that flickers through random characters and settles into the real words (on scroll-in or hover). Includes a `demo.html` preview. | **Live** on the homepage banner title. |
| [`word-cloud-sphere/`](word-cloud-sphere/README.md) | A sphere of words you can roll in any direction, with a slow self-spin. Used in "About the studio". | **Live** on the homepage. |

All were ported from Framer code components the owner supplied and rewritten as plain TypeScript for the Astro site (no React, no Framer).

## Rules for using them
- Follow the design rules in `docs/design-system.md` (tokens only, motion must respect `prefers-reduced-motion`, keep a Pause control for anything that moves for more than 5 seconds).
- Only show **real** project screenshots or confirmed facts on cards and words (see `CLAUDE.md`).
- Check desktop (~1440px) and phone (~390px) widths: no sideways scrolling.
- Test performance on a real phone before deploying; the ribbon uses WebGL.
- Nothing deploys until the owner says "deploy".

## Adding a new animation
Make a new folder here with: the code files, a `README.md` (what it is, how to add it to a page, the settings that matter, and any lessons learned), and small snippet files showing how it is wired in.
