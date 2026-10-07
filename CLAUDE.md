# Solace Production — solaceproduction.com

Website for Solace, a creative studio. Plain static HTML: no framework, no build step, no package manager.

## Structure
| Page | How it's reached | File |
|---|---|---|
| Home, Work, About, Contact | One page; sections swap via `go('<page>')` in JS (URL stays `/`) | `solace-html/index.html` |

- All CSS lives in the `<style>` block of `index.html`; colors, shadows and fonts are CSS variables in `:root` (`--bg`, `--dark`, `--slate`, `--fg`, `--font-d`, …). Use these tokens, not new hex values.
- Fonts: DM Serif Display (Google Fonts) for headings, system font for body text.
- Everything inside `solace-html/` is what gets published. Put new images in `solace-html/images/` and reference them with relative paths.

## Redesign in progress (not live)
- `site/` holds the new Astro site (Home, Work, case studies, Services, Studio, Contact). Build with `cd site && npm ci && npm run build` → `site/dist/`. Design rules: `docs/design-system.md`. Project facts live in `site/src/data/projects.ts` (only confirmed facts).
- The deploy workflow still publishes the old `solace-html/` site. Switching it to `site/dist/` replaces the live site, so do it only when the user approves the redesign launch.

## Deployment
Claude Code edits → GitHub → Hostinger.
- `.github/workflows/deploy.yml` runs on every push to `main` that changes `solace-html/` (or manually from the Actions tab) and uploads `solace-html/` to Hostinger over FTP. A manual run with `check_only` lists the server folders without uploading.
- **Pushing to `main` is a production deploy.** Do day-to-day work on a `claude/*` branch; only merge or push to `main` when the user says to deploy.
- The upload overwrites changed files and deletes files that were removed from `solace-html/` since the last deploy. It does not touch anything else on the server.
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
- The contact form only shows a thank-you message; it does not send email anywhere yet.
