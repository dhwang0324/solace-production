# SOLACE — Design System (v1, approved direction: "Homepage mix")

Light, minimal, quietly technical. Gentle Monster's header and full-width hero; Lumóra's
statement, process and dark footer; MzQ's filter chips and mono labels. Reference mockup:
desktop + phone board shared in the redesign thread (`d-mix`).

## 1. Principles
1. **White space is the layout.** Few elements, large gaps, nothing decorative.
2. **Type carries the identity.** One grotesk for everything readable, one mono for small technical labels.
3. **Real work is the imagery.** Full-bleed, large, never in thumbnails. Generated media only for atmosphere (see §11).
4. **Precise, not flashy.** Motion is short and functional; the site must look finished with motion off.
5. **Honest content.** Only real clients, facts and results. No stats, testimonials or awards unless provided.

## 2. Architecture (needs approval before build)
The redesign needs real pages with clean URLs (`/work/`, `/work/<project>/`, `/services/`, `/studio/`, `/contact/`).

| Option | How | Pros | Cons |
|---|---|---|---|
| **A. Astro static site (recommended)** | Astro builds plain HTML/CSS into `dist/`; GitHub Actions runs `npm ci && npm run build`, then uploads `dist/` over FTP | One shared header/footer and one case-study template; automatic responsive images (AVIF/WebP); sitemap; no JavaScript shipped unless needed | Adds Node + a build step to the deploy workflow; first deploy must replace the old `index.html` |
| B. Hand-written HTML | One folder per page, shared `assets/solace.css` + `assets/solace.js` | No build step, current deploy unchanged | Header/footer copied into every page; images optimised by hand; harder to add projects |

Output is static HTML either way, so hosting stays on Hostinger with the same FTP deploy.

## 3. Typography
Both families are free (Google Fonts, OFL), self-hosted as WOFF2 subsets, `font-display: swap`.

- **Hanken Grotesk** (400, 500, 600): wordmark, headings, body, UI.
- **IBM Plex Mono** (400): bracket labels, numbers, metadata, footer base line.

| Token | Size (desktop → phone) | Weight | Tracking | Line height | Use |
|---|---|---|---|---|---|
| `wordmark` | 24px → 18px | 500 | 0.42em, uppercase | 1 | Header logo |
| `display-xl` | 22.4vw (edge to edge) | 500 | 0.02em, uppercase | 0.8 | Footer SOLACE |
| `hero` | 30px → 22px | 500 | 0.30em, uppercase | 1.1 | Hero title over image |
| `statement` | clamp(28px, 2.9vw, 44px) | 500 | −0.02em | 1.15 | About statement, contact ask |
| `h2` | clamp(28px, 2.6vw, 38px) | 500 | −0.02em | 1.1 | Section headings |
| `h3-caps` | 12px | 600 | 0.24em, uppercase | 1.3 | Service group names |
| `section-caps` | 19px → 17px | 500 | 0.02em, uppercase | 1.3 | "LATEST: SELECTED WORK" |
| `body-l` | 16px | 400 | 0 | 1.6 | Lists, intro text |
| `body` | 15px | 400 | 0 | 1.55 | Paragraphs |
| `small` | 13px | 500 | 0 | 1.5 | Nav, captions, buttons |
| `label` | 11px mono | 400 | 0.04em, uppercase | 1.4 | `[ ABOUT THE STUDIO ]`, numbers, tags |

Rules: max line length 65 characters for body text; one `statement` per page; the second half of a
statement switches to `--blue` to create the two-tone fade; never use italics or a serif.

## 4. Colour
Tokens (from the SOLACE palette). Use tokens only, no new hex values.

| Token | Hex | Role |
|---|---|---|
| `--white` | #FFFFFF | Main page background |
| `--paper` | #F5F5F2 | Alternate section background (Selected Work), chips |
| `--ink` | #1F2627 | Text, black process bars, solid buttons, footer background |
| `--navy` | #233036 | Hover state for `--ink` elements, image overlays |
| `--slate` | #546B7C | Small labels and metadata on light backgrounds |
| `--blue` | #788A95 | Large text accents only (statement fade, footer accent line) |
| `--sky` | #A5C9E1 | Focus ring on dark, image grading highlights; never body text |
| `--gray` | #A2A4A5 | Hairlines, borders, muted text on `--ink` only |

Checked contrast (WCAG): ink on white 15.4:1 · slate on white 5.6:1 (small text OK) ·
blue on white 3.6:1 (large text ≥ 24px only) · gray on ink 6.2:1 · paper on ink 14.1:1.
`--gray` on white (2.5:1) and `--blue` under 24px are **not allowed** for text.

## 5. Spacing, grid, breakpoints
- **Spacing scale (px):** 4, 8, 12, 16, 24, 32, 48, 64, 80, 120, 160. Sections: 120 desktop / 64 phone top and bottom.
- **Grid:** 12 columns, 16px gutters, side margins 60px desktop, 32px tablet, 20px phone. Content can run full-bleed (hero, project images).
- **Breakpoints:** phone < 640 · tablet 640–1023 · desktop 1024–1599 · wide ≥ 1600 (content stops at 1600px; images stay full-bleed).
- **Corners:** square images and sections. Radius only on small UI: chips 8px, tags 6px, buttons fully round.

## 6. Components
- **Header:** 3-part grid (links · centred wordmark · Contact + menu). Transparent with white text over the hero; after scrolling past the hero it turns `--white` with `--ink` text and a hairline. Phone: centred wordmark + menu button; menu opens a full-screen white panel with large links.
- **Hero:** one full-bleed looping video (muted, 92vh desktop / 86vh phone) with a poster image, dark gradient at the bottom, centred uppercase title, a line where the theme word rotates (Design → Technology → Creative → Growth, every 2.4s) + “— thoughtfully built.”, and an outline button. A Pause button stops the video and the word; reduced motion and Save-Data show the poster and no rotation.
- **Bracket label:** `[ LABEL ]` in `label` style, `--slate`. Starts every section.
- **Statement:** 1/3 label column + 2/3 text column; two-tone (`--ink` then `--blue`).
- **Selected work:** `--paper` band; heading + underlined MORE on the left, filter chips on the right; two projects at 7:5 width, 600px tall, square corners; caption row = uppercase name + mono tags. Chips filter on the Work page; on Home they link to the filtered Work page.
- **Services:** intro column + three numbered columns (Digital, Creative, Growth) with plain text lists.
- **Process:** four columns; each step is a black `--ink` bar with a mono number and name, stepping down 22px per column (a staircase), with a short description below. Phone: 2 × 2 grid, no staircase.
- **Footer / contact:** `--ink` background. Statement-sized ask, outline "Start a project ↗" button, underlined email, giant edge-to-edge SOLACE, mono base line.
- **Buttons and links:** outline pill (on images and dark backgrounds), solid `--ink` pill (primary on light), underlined text link (MORE, email). Hover: fill swap in 150ms; focus: 2px outline offset 3px.
- **Chips and tags:** chips 8px radius, 1px `--gray` border, active = `--ink` fill. Tags 6px radius, mono 11px.

## 7. Images and video
- **Ratios:** hero full-bleed (focal point set per image); project lead 7:5 split; case-study images 16:10, 4:5 and full-bleed 21:9.
- **Treatment:** natural colour; a gentle cool grade allowed for studio imagery; no filters on client work. A 0–55% bottom gradient only where text sits on an image.
- **Formats:** AVIF + WebP with JPEG fallback, responsive `srcset` (640–2560px), lazy-loaded below the fold, explicit width/height to prevent layout shift. Hero image ≤ 250KB at 1920px.
- **Video:** MP4 (H.264) + WebM, muted, `playsinline`, looping 6–12s, ≤ 4MB for the hero, poster image always set. Not loaded on Save-Data or with reduced motion (the poster shows instead).

## 7b. Colour in use (`site/src/styles/looks.css`)
- Grey bands use a soft blue wash (`--sky` mixed into `--paper`); dark surfaces are `--navy` with a faint blue glow, not near-black.
- Sky details: nav underline, link underlines, Process numbers, chip hovers, add-on card top edges, service-group rules; line icons for Digital / Creative / Growth on the homepage. Project images take a light blue tint on hover.
- No colours outside the palette above.

## 8. Motion
- **Easing:** `cubic-bezier(.2,.7,.2,1)`. **Durations:** 150ms hovers, 400ms reveals, 600ms slide crossfades, 900ms image clip reveals.
- **Allowed:** opacity, transform, clip-path. Content fades up 16px once as it enters the screen. Project images reveal with a clip from bottom to top, and scale from 1.04 to 1 on hover. The header shrinks and turns solid on scroll.
- **In and out (`data-reveal="both"`, Studio page):** content fades up as it enters and fades away again as it leaves, drifting up when it leaves at the top and down at the bottom. Optional stagger with `style="--d:120ms"`.
- **Scroll-linked text (Studio page):** `[data-words]` lines light up word by word as they pass through the screen. Large text only, so the muted state stays readable.
- **Studio page extras:** `[data-split]` headlines rise in word by word from a mask; bracket labels wipe in from the left; the studio image settles from a 1.08 zoom; bars draw across; tiles rise from the bottom edge; the graph's two lines draw in together, then arrowheads, links and labels. "What we believe" is a stack of sticky cards (`[data-stack]`); a covered card eases to 0.95 scale and dims slightly.
- **Not allowed:** scroll-jacking, parallax on text, looping decorative animation.
- **`prefers-reduced-motion`:** no reveals, no autoplay, instant slide changes; scroll-linked text shows fully lit.

## 9. Accessibility
Semantic landmarks (`header`, `nav`, `main`, `footer`), one `h1` per page, logical heading order;
full keyboard support (including the slideshow and menu, with a focus trap in the open menu);
visible focus rings; alt text on every content image; captions or transcripts for videos with
speech; touch targets ≥ 44px; contrast per §4; skip-to-content link.

## 10. Pages
| Page | URL | Content |
|---|---|---|
| Home | `/` | Hero → statement → selected work → services → process → contact footer |
| Work | `/work/` | Filter chips + all real projects, large, two per row on desktop, one per row on phone |
| Case study | `/work/<project>/` | Full-bleed hero image, mono fact row (client, industry, services, year), then only the sections we have facts for: challenge, strategy, design, development, photography/video, before/after, results |
| Services | `/services/` | The three groups in depth, with the process |
| Studio | `/studio/` | Point of view, hands-on approach, how web, photo, video and strategy fit together. No invented team |
| Contact | `/contact/` | Short form (name, email, what you need, message) plus email. The form must actually send; options listed in §12 |

SEO: unique titles and descriptions, canonical URLs, Open Graph images, `sitemap.xml`, `robots.txt`,
Organization JSON-LD, favicon set.

## 11. Assets needed
| Asset | Source | Status |
|---|---|---|
| Hero video (one, looping) | Real Solace photo/video shoot, or Higgsfield atmosphere (no fake clients, people or places) | Needed; any Higgsfield use gets a full cost quote first |
| Project images | Real client screenshots and photography | Needed for each confirmed project |
| Wordmark files (SVG) | Typeset from Hanken Grotesk, tracked 0.42em | Will produce in the build |
| Favicon + social share image | Built from the wordmark | Will produce in the build |

## 12. Open questions
1. Architecture: Astro (recommended) or hand-written HTML?
2. Confirmed projects and their real photos and facts (Nail Xpress? Guerrero Boxing Gym?).
3. Hero visuals: real shoot, Higgsfield (quoted first), or both?
4. Contact form delivery: Hostinger PHP mail script, or a form service such as Formspree.
5. Is there a person or founder name to show on Studio, or should it stay studio-only?
