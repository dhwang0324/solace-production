# Solace Production — solaceproduction.com

Website for Solace, a creative and digital studio. Static site built with **Astro** in `site/` (npm, Node 22). The old single-page site in `solace-html/` is kept for reference only and is no longer deployed.

## Structure
| Page | URL | File |
|---|---|---|
| Home | `/` | `site/src/pages/index.astro` |
| Work | `/work/` | `site/src/pages/work/index.astro` |
| Case study | `/work/<slug>/` | `site/src/pages/work/[slug].astro` (data: `site/src/data/projects.ts`) |
| Services | `/services/` | `site/src/pages/services.astro` |
| Studio | `/studio/` | `site/src/pages/studio.astro` |
| Contact | `/contact/` | `site/src/pages/contact.astro` (form not connected yet: set `FORM_ENDPOINT`) |

- Design rules: `docs/design-system.md`. Tokens and base styles: `site/src/styles/global.css` (use tokens, not new hex values).
- Shared components in `site/src/components/` (Header, Footer, Hero, Services, Process, ProjectFeature, Placeholder). Shared copy in `site/src/data/site.ts`.
- Fonts: Hanken Grotesk + IBM Plex Mono, self-hosted via @fontsource.
- Project facts in `projects.ts` must be confirmed by the user; leave fields out until then.
- Images still use `Placeholder` blocks; replace with real images in `site/src/assets/` via `astro:assets`.
- Commands: `cd site && npm ci`, `npm run dev`, `npm run build` (output `site/dist/`).

## Deployment
Claude Code edits → GitHub → Hostinger.
- `.github/workflows/deploy.yml` runs on every push to `main` that changes `site/` or the workflow (or manually from the Actions tab): it runs `npm ci && npm run build` in `site/` and uploads `site/dist/` to Hostinger over FTP. A manual run with `check_only` lists the server folders without uploading.
- **Pushing to `main` is a production deploy.** Do day-to-day work on a `claude/*` branch; only merge or push to `main` when the user says to deploy.
- The upload overwrites changed files and deletes files that were removed from `site/dist/` since the last deploy. It does not touch anything else on the server (e.g. `.htaccess`).
- Credentials are GitHub repository secrets `FTP_HOST`, `FTP_USERNAME`, `FTP_PASSWORD` (optional variable `FTP_SERVER_DIR`, default `./`: the FTP login opens directly in the site's web root, so never upload into a `public_html/` subfolder). Never put credentials in the repo.
- After a deploy, check the run in the repo's Actions tab, then hard-refresh the site.

## Rules
- Inspect the relevant code before changing it; make the smallest change that does the job.
- Never invent clients, testimonials, stats, prices or awards.
- Keep the site responsive (check ~1440px and ~390px wide, no sideways scrolling) and accessible (alt text, labelled form fields).
- No force-push, history rewrites or branch deletion.

## Higgsfield (AI media) — user's standing rule
Use Higgsfield only when custom generated media materially improves the result; the site must stand on its typography, layout and identity without it.
- **Never start anything that may spend credits without explicit approval.** If unsure whether a call costs credits, assume it does and ask.
- Before any paid generation, state: what and why, recommended model, resolution, duration (video), number of generations, credits each, total credits, and the exact prompt. Then wait for approval.
- Never auto-regenerate, upscale, make variations, extend clips or switch models after a flawed result: explain the problem and ask first.
- Cheapest validation first: concept → still image → low-cost video test → final high-quality generation.
- Never let generated media stand in for real client work, products, people, places or facts, or invent testimonials, awards, results or claims.
- Generated assets follow the normal flow: work branch first, nothing deployed without the user saying "deploy".
- Free without approval (no credits): checking balance, browsing capabilities and models, planning concepts, writing prompts, estimating cost.

## Known issues
- The contact form validates but does not send yet; it tells visitors to email hello@solaceproduction.com.
- Project, studio and hero images are placeholders until real assets arrive.
