# Solace robot mascot

Supplied by the user (2026-11-24): a small pixel-style robot with an "S" on its headphones and shirt.

- `run-original.gif` / `run-original.webp`: running with a happy face (the webp is a 2-frame version). Used on the contact form after a message is sent.
- `walk-original.gif`: walking, side-on. Used on the 404 page.
- `hello-original.gif`: standing in a hoodie, waving then jumping. Used on the contact page under "What happens next" (hidden on phones).

The site uses cropped, lossless animated WebP copies in `site/public/mascot/` (`run`, `walk`, `hello`) plus a still PNG for each (`*-still.png`), shown when the visitor prefers reduced motion. The `Mascot.astro` component picks the right file: `<Mascot name="run" width={120} />`.

Keep it small and occasional: the design system avoids looping decoration, so use it as a moment of personality (success, empty, error states), not as page furniture.
