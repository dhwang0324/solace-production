# Flowing glass banner (image warp)

Live on the homepage banner (`HeroSingle.astro` with the `flow` prop, script `site/src/scripts/flow.ts`, picture `site/public/hero/glass.webp`).

- The picture is shown as a plain CSS background first (first paint, reduced motion, no WebGL). A WebGL canvas fades in over it.
- The fragment shader samples the picture with a displacement that changes with time: three broad travelling sine swells make the glass move like slow water. Red, green and blue are sampled with slightly different offsets for a refraction-like colour split, and a faint glint is added where the surface tilts toward the light.
- Only the glass moves: `public/hero/glass-mask.png` (white = glass, black = background, soft edge; made from the picture's local contrast, then closed, filled and feathered) scales every displacement, so the background stays perfectly still.
- Pointer: the hero tracks the cursor (eased). Under it the glass is pulled toward the cursor like a lens, and ripples run outward, stronger the faster the pointer moves.
- Performance: renders at full size (device pixel ratio capped at 2; WebGL2 mip-maps the picture when the screen is smaller than it), lowers to 0.8 then 0.6 if frames are slow, pauses off screen, when the tab is hidden and with the banner's Pause button.
- Swap the picture by replacing `public/hero/glass.webp` (update `IMG_ASPECT` and `ASP` in the script to its width / height). Keep the amplitude small (about 0.01 of the picture) so edges never show.
- Needs `gl.UNPACK_FLIP_Y_WEBGL` (WebGL reads pictures from the bottom row up).
- Earlier variant: a procedural glass ribbon shader (no picture) was prototyped and dropped when the user asked to use their own picture.
