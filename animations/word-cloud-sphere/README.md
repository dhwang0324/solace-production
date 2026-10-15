# Word cloud sphere (roll-it-like-a-ball)

A sphere made of words. Words on the front are big and dark, words at the back are small and faint. It turns slowly by itself, and a visitor can **drag in any direction to roll it like a ball** (a quick flick keeps rolling and slows down). Plain TypeScript, no libraries.

Live on the homepage in "About the studio" (right side, next to the statement).

## Files
| File | Where it goes in `site/` | Job |
|---|---|---|
| `word-cloud.ts` | `src/scripts/word-cloud.ts` | The whole animation. Finds `[data-cloud]`, builds the list of words, rolls them on a sphere. Add `import './word-cloud';` once in `src/scripts/main.ts`. |
| `styles.css` | append to `src/styles/global.css` | Word styling, grab cursor, `touch-action: none` so touch can roll it. |
| `index-snippet.astro.txt` | `src/pages/index.astro` | Markup and the section's layout CSS. The words come from `data-words` (a JSON list). |

## To use it somewhere else
1. Copy the files as above.
2. Put `<div class="cloud" data-cloud data-words={JSON.stringify(words)} role="group" aria-label="..."></div>` where you want it. Give `.cloud` a size (`aspect-ratio: 1; max-width: 300px`).
3. Only one cloud per page is supported as written (it uses `querySelector`). To support more, loop over `querySelectorAll('[data-cloud]')`.

## Settings (top of `word-cloud.ts`)
- `AUTO = 0.004` slow self-spin per frame (0 turns it off; it is already 0 under reduced motion).
- `FONT_SCALE = 0.078` word size relative to the cloud's width.
- `SENS = 0.006` how far it turns per pixel dragged.
- `FRICTION = 0.94` how long a flick keeps rolling (closer to 1 = longer).
- In `paint()`: `spread` (0.95 desktop, 0.72 on phones under 300px) is how far from the centre the words reach. Raising it makes the sphere look bigger **without** making its box taller.

## How it works
- Words are placed on a Fibonacci sphere (evenly spread points).
- The ball's orientation is a 3x3 rotation matrix. Dragging turns it about the screen's vertical (left/right) and horizontal (up/down) axes, which gives full trackball rolling. (The first version used one fixed axis, so it could only be pushed one way. Do not go back to that.)
- Only animates while on screen (`IntersectionObserver`).

## Notes
- Words in the homepage cloud are the studio's real services from `serviceGroups` in `src/data/site.ts`. Do not add words for services the studio does not offer.
- On phones the cloud captures touches that start on it (needed for rolling). It is small and has empty space around it so the page can still be scrolled from the sides.
- Section height was kept deliberately short (about 428px desktop, 545px phone): top/bottom padding 64px / 48px.
