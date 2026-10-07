# SOLACE — Brand quick sheet (for print: business cards etc.)

## Typography
Both fonts are free (Google Fonts, Open Font License): fonts.google.com/specimen/Hanken+Grotesk and fonts.google.com/specimen/IBM+Plex+Mono.

| Use | Font | Weight | Case | Letter spacing |
|---|---|---|---|---|
| Wordmark **S O L A C E** | Hanken Grotesk | Medium (500) | UPPERCASE | 0.42 em (Illustrator/InDesign tracking 420, Figma 42%) |
| Names, headings | Hanken Grotesk | Medium (500) | Sentence case | −0.02 em (tracking −20) |
| Small caps headings | Hanken Grotesk | SemiBold (600) | UPPERCASE | 0.24 em (tracking 240) |
| Body text, details | Hanken Grotesk | Regular (400) | Sentence case | 0 |
| Labels, phone/email, small details | IBM Plex Mono | Regular (400) | UPPERCASE | 0.04 em (tracking 40) |

Card sizes that match the site: wordmark ~9–10 pt, name ~9 pt, details ~6.5–7 pt (mono labels ~6 pt).

## Colours
CMYK values are straight conversions; ask your printer for a proof.

| Name | HEX | RGB | CMYK (approx.) | Use |
|---|---|---|---|---|
| Near Black (ink) | #1F2627 | 31, 38, 39 | 21, 3, 0, 85 | Text, dark side of the card |
| Deep Navy | #233036 | 35, 48, 54 | 35, 11, 0, 79 | Dark alternative |
| Slate Blue | #546B7C | 84, 107, 124 | 32, 14, 0, 51 | Small labels on light |
| Muted Blue | #788A95 | 120, 138, 149 | 19, 7, 0, 42 | Accent (large text only) |
| Soft Sky Blue | #A5C9E1 | 165, 201, 225 | 27, 11, 0, 12 | Gradient middle, highlights |
| Cool Gray | #A2A4A5 | 162, 164, 165 | 2, 1, 0, 35 | Fine lines, muted text on dark |
| Off White | #F5F5F2 | 245, 245, 242 | 0, 0, 1, 4 | Light side of the card |
| White | #FFFFFF | 255, 255, 255 | 0, 0, 0, 0 | Text on the gradient |
| Pale Mist | #D9E4EA | 217, 228, 234 | 7, 3, 0, 8 | Gradient start only |

## Hero gradient 2 (the pale blue slide)
`linear-gradient(120deg, #D9E4EA 0%, #A5C9E1 40%, #788A95 100%)` — on the site a dark shade sits on top
(bottom 55% → middle 5% → top 25% of #1F2627) so white text stays readable.

Files in this folder (regenerate from `grad.html`):
- `solace-gradient-2-clean-card-bleed-3.75x2.25in-600dpi.png` — 3.5 × 2 in card + 0.125 in bleed, gradient only
- `solace-gradient-2-as-on-site-card-bleed-3.75x2.25in-600dpi.png` — same, with the site's dark shade
- `solace-gradient-2-clean-3840x2160.png`, `solace-gradient-2-as-on-site-3840x2160.png` — large versions
