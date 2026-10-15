# Scramble text

Letters flicker through random characters and settle into the real text, one by one in random order. Triggered when the text scrolls into view, or on hover. Plain TypeScript, no libraries. **Used on the homepage banner title ("Digital Presence").**

Ported from the supplied Framer component "ScrambleText v7" (Framer + React + framer-motion) into a small standalone script.

Open `demo.html` in a browser to see all the triggers working (it has the script built in, no setup).

## Files
| File | Where it goes in `site/` | Job |
|---|---|---|
| `scramble-text.ts` | `src/scripts/scramble-text.ts` (already installed), imported once in `src/scripts/main.ts` | The whole animation. Finds every `[data-scramble]` element and wires it up. |
| `demo.html` | (stays here) | Standalone preview with each trigger. |

## Use it
```html
<h2 data-scramble data-trigger="view">Digital presence</h2>
<a href="/work/" data-scramble data-trigger="hover">View work</a>
```
Options, all optional, as data attributes:
- `data-trigger`: `view` (default, once when it scrolls into view), `view-repeat` (again every time it re-enters), `hover` (mouse hover or keyboard focus).
- `data-duration`: total time in ms (default 900).
- `data-fps`: frames per second of the flicker (default 30).
- `data-ease`: `out` (default), `linear`, `inout`.
- `data-intensity`: 0 to 1, share of not-yet-revealed letters that flicker (default 1).
- `data-charset`: characters used for the flicker (default letters, digits, `!@#$%*`).

You can also call it from code: `import { scrambleText } from './scramble-text'; const play = scrambleText(el, { duration: 600 }); play();`

## What changed from the Framer version
- Links: the Framer component made the whole box a clickable link. Here, just put `data-scramble` on a real `<a>` or `<button>`.
- Spaces and line breaks never scramble (the original scrambled them too, which made lines jump).
- `intensity` now does something. In the original the setting had no visible effect.
- Accessibility added: screen readers always get the real text (`aria-label`); the flickering copy is hidden from them. With "reduce motion" on, the real text shows with no animation.
- Starts only when at least 25% of the element is visible (same as the original).
- Waits for the web fonts to load before starting, and **holds the text's width and keeps a single line on one line** while it flickers, so centred headlines do not jiggle or wrap (random letters like W and M are wider than the real ones).

## Tips
- Use a **monospace or tabular font** (the site has IBM Plex Mono) so the line does not change width while it flickers. With Hanken Grotesk it will jiggle slightly.
- Best on short text (headlines, buttons, labels), not paragraphs.
- Keep each line short on phones, or it will wrap differently while flickering.
- Homepage example: `<h1 class="hs__title" data-scramble data-trigger="view" data-duration="1300" data-charset="ABCDEFGHIJKLMNOPQRSTUVWXYZ">Digital Presence</h1>` in `HeroSingle.astro` (uppercase charset because the title is uppercase). Checked at 1440px and 390px: stays on one line, no sideways scrolling.
