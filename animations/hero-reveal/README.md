# Hero split reveal (day left, night right, invisible edge follows the cursor)

Live on the homepage banner (`HeroSingle.astro` with the `reveal` prop, script `site/src/scripts/reveal.ts`).

- Two photos of the same scene stacked: day underneath, night on top inside `[data-reveal-night]`.
- The night layer is blended in with a CSS `mask-image` linear gradient (feather 13% of the width each side, vars `--a` and `--b`). The blend starts at 50% and eases (10% per frame) toward the pointer's x position, so moving left shows more night, moving right shows more day... (left of the edge is day, right is night; the edge sits under the cursor).
- No visible bar or handle. Touch: dragging moves the edge (`touch-action: pan-y` keeps vertical scroll). Reduced motion: stays 50/50, no tracking.
- Runs only while the banner is on screen. No canvas, so both photos stay at full resolution.
- Both images must share the same composition (night generated from the day image as the reference).

## Earlier version
A wet-paint splash reveal (canvas mask, thresholded blobs, flung droplets, drips, click splat) is in git history: commits 7b13cf5 and 9b831c6 (`site/src/scripts/reveal.ts`).
