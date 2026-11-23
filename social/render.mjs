// Renders Solace Instagram slides (1080x1350 JPEG) from the site's own tokens and fonts.
// Usage: node render.mjs week-1/slides.mjs   (writes week-1/<post>/slide-NN.jpg)
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)(process.env.PW_PATH || 'playwright');
import { mkdirSync, readFileSync } from 'node:fs';
const assets = resolve(dirname(new URL(import.meta.url).pathname), '../site/src/assets');
const cache = new Map();
const asset = (rel) => { if (!cache.has(rel)) cache.set(rel, 'data:image/jpeg;base64,' + readFileSync(resolve(assets, rel)).toString('base64')); return cache.get(rel); };
import { resolve, dirname } from 'node:path';
import { pathToFileURL } from 'node:url';

const here = dirname(new URL(import.meta.url).pathname);
const fonts = resolve(here, '../site/node_modules/@fontsource');
const f = (p) => 'data:font/woff2;base64,' + readFileSync(resolve(fonts, p)).toString('base64');

const css = `
@font-face{font-family:'Hanken Grotesk';font-weight:400;src:url(${f('hanken-grotesk/files/hanken-grotesk-latin-400-normal.woff2')})}
@font-face{font-family:'Hanken Grotesk';font-weight:500;src:url(${f('hanken-grotesk/files/hanken-grotesk-latin-500-normal.woff2')})}
@font-face{font-family:'Hanken Grotesk';font-weight:600;src:url(${f('hanken-grotesk/files/hanken-grotesk-latin-600-normal.woff2')})}
@font-face{font-family:'IBM Plex Mono';font-weight:400;src:url(${f('ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2')})}
:root{--white:#FFFFFF;--paper:#F5F5F2;--ink:#1F2627;--navy:#233036;--slate:#546B7C;--blue:#788A95;--sky:#A5C9E1;--gray:#A2A4A5;
--sans:'Hanken Grotesk',sans-serif;--mono:'IBM Plex Mono',monospace}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1080px;height:1350px;overflow:hidden}
body{font-family:var(--sans);-webkit-font-smoothing:antialiased}
.s{position:relative;width:1080px;height:1350px;padding:0 88px}
.light{background:var(--white);color:var(--ink)}
.paper{background:var(--paper);color:var(--ink)}
.dark{background:var(--navy);color:var(--paper)}
.dark::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 70% 45% at 85% 0%,rgba(165,201,225,.16),transparent 70%)}
.s>*{position:relative}
.mark{position:absolute;top:84px;left:88px;font-size:28px;font-weight:500;letter-spacing:.42em;text-transform:uppercase}
.label{font-family:var(--mono);font-size:26px;letter-spacing:.04em;text-transform:uppercase;color:var(--slate)}
.dark .label{color:var(--gray)}
.body{position:absolute;left:88px;right:88px;top:300px}
.statement{font-weight:500;letter-spacing:-.02em;line-height:1.1}
.fade{color:var(--blue)}
.p{font-size:42px;line-height:1.45;margin-top:48px;max-width:860px}
.base{position:absolute;left:88px;right:88px;bottom:84px;display:flex;justify-content:space-between;align-items:flex-end;font-family:var(--mono);font-size:24px;letter-spacing:.04em;text-transform:uppercase;color:var(--slate)}
.dark .base{color:var(--gray)}
.list{margin-top:56px;border-top:2px solid var(--gray)}
.dark .list{border-color:rgba(162,164,165,.5)}
.row{display:flex;gap:36px;align-items:baseline;padding:20px 0;border-bottom:2px solid var(--gray);font-size:52px;font-weight:500;letter-spacing:-.01em;line-height:1.1}
.dark .row{border-color:rgba(162,164,165,.5)}
.row .n{font-family:var(--mono);font-weight:400;font-size:26px;color:var(--slate);min-width:52px;letter-spacing:.04em}
.pill{display:inline-block;margin-top:64px;padding:26px 52px;border:2px solid currentColor;border-radius:999px;font-size:34px;font-weight:500}

.bg{position:absolute;inset:0;background-size:cover}
.grad{position:absolute;inset:0;background:linear-gradient(to top,rgba(31,38,39,.94) 0%,rgba(31,38,39,.72) 42%,rgba(31,38,39,0) 70%),linear-gradient(to bottom,rgba(31,38,39,.45) 0%,rgba(31,38,39,0) 18%)}
.photo{color:var(--paper);background:var(--ink)}
.photo .mark{color:#fff}
.photo .label{color:rgba(245,245,242,.85)}
.photo .base{color:rgba(245,245,242,.85)}
.photo .fade{color:rgba(245,245,242,.7)}
.band-img{position:absolute;left:0;right:0;top:0;height:580px;background-size:cover}
.band-img::after{content:'';position:absolute;inset:0;background:linear-gradient(to bottom,rgba(31,38,39,.5),rgba(31,38,39,0) 25%)}
.has-band .mark{color:#fff;z-index:2}
.items{margin-top:40px;font-family:var(--mono);font-size:26px;letter-spacing:.04em;text-transform:uppercase;color:var(--slate);line-height:1.8}
.pill.solid{background:var(--paper);color:var(--ink);border-color:var(--paper)}
`;

const mark = '<div class="mark">Solace</div>';
const bracket = (t) => `<p class="label">[ ${t} ]</p>`;
const base = (l, r = '') => `<div class="base"><span>${l}</span><span>${r}</span></div>`;
const rows = (items) => `<ul class="list" style="list-style:none">${items.map((t, i) => `<li class="row"><span class="n">${String(i + 1).padStart(2, '0')}</span><span>${t}</span></li>`).join('')}</ul>`;

export const T = { mark, bracket, base, rows, asset };

const specFile = process.argv[2];
const { posts } = await import(pathToFileURL(resolve(specFile)).href);
const outRoot = dirname(resolve(specFile));
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
for (const post of posts) {
  mkdirSync(resolve(outRoot, post.id), { recursive: true });
  let i = 0;
  for (const s of post.slides) {
    i++;
    const html = `<!doctype html><meta charset="utf-8"><style>${css}</style><div class="s ${s.bg}">${mark}${s.html(T)}</div>`;
    await page.setContent(html);
    await page.evaluate(() => document.fonts.ready);
    const out = resolve(outRoot, post.id, `slide-${String(i).padStart(2, '0')}.jpg`);
    await page.screenshot({ path: out, type: 'jpeg', quality: 95 });
  }
  console.log(post.id, i, 'slides');
}
await browser.close();
