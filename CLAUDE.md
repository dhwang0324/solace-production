# Solace Production — solaceproduction.com

Website for Solace, a creative studio. Plain static HTML: no framework, no build step, no package manager.

## Structure
| Page | How it's reached | File |
|---|---|---|
| Home, Work, About, Contact | One page; sections swap via `go('<page>')` in JS (URL stays `/`) | `solace-html/index.html` |

- All CSS lives in the `<style>` block of `index.html`; colors, shadows and fonts are CSS variables in `:root` (`--bg`, `--dark`, `--slate`, `--fg`, `--font-d`, …). Use these tokens, not new hex values.
- Fonts: DM Serif Display (Google Fonts) for headings, system font for body text.
- Everything inside `solace-html/` is what gets published. Put new images in `solace-html/images/` and reference them with relative paths.

## Deployment
Claude Code edits → GitHub → Hostinger.
- `.github/workflows/deploy.yml` runs on every push to `main` that changes `solace-html/` (or manually from the Actions tab) and uploads `solace-html/` to Hostinger over FTP. A manual run with `check_only` lists the server folders without uploading.
- **Pushing to `main` is a production deploy.** Do day-to-day work on a `claude/*` branch; only merge or push to `main` when the user says to deploy.
- The upload overwrites changed files and deletes files that were removed from `solace-html/` since the last deploy. It does not touch anything else on the server.
- Credentials are GitHub repository secrets `FTP_HOST`, `FTP_USERNAME`, `FTP_PASSWORD` (optional variable `FTP_SERVER_DIR`; otherwise the workflow uploads into `public_html/` if the FTP login sees one, else into the login's starting folder). Never put credentials in the repo.
- After a deploy, check the run in the repo's Actions tab, then hard-refresh the site.

## Rules
- Inspect the relevant code before changing it; make the smallest change that does the job.
- Never invent clients, testimonials, stats, prices or awards.
- Keep the site responsive (check ~1440px and ~390px wide, no sideways scrolling) and accessible (alt text, labelled form fields).
- No force-push, history rewrites or branch deletion.

## Known issues
- The contact form only shows a thank-you message; it does not send email anywhere yet.
