# Hero reveal (day photo, night photo revealed by a splash that follows the pointer)

Live on the homepage banner (`HeroSingle.astro` with the `reveal` prop, script `site/src/scripts/reveal.ts`).

- Two photos of the same scene: day is the normal image, night sits in a hidden `<img data-reveal-night>`.
- Soft blobs are thresholded (alpha ~0.4-0.5 becomes a defined edge) so the reveal reads as thick wet paint: merged puddles, flung droplets, drips running down, a splat on click, and slow drying that pulls the edge in.
- A 2D canvas draws the night photo "cover" and keeps only what a soft mask allows (`destination-in`).
- The mask is a quarter-size canvas: pointer movement stamps soft blobs (radius grows with speed, lobes and droplets for a splash edge) and the mask fades out behind the pointer, so the reveal melts away.
- One intro sweep runs on load so touch screens and idle visitors see the effect. Touch: dragging reveals (`pointermove`).
- Reduced motion: canvas hidden, day photo only. Loop runs only while the banner is on screen and the pointer was recently active.
- Tuning: radius `Math.min(w,1600)*0.07` (mask at 0.33 scale), drying `dt*0.0006`, threshold 0.4-0.5, drip chance 0.07 per stamp.
- Both images must be generated with identical composition (night from the day image as reference).
