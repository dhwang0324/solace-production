import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
await p.goto('file://' + process.cwd() + '/concepts.html'); await p.evaluate(() => document.fonts.ready);
await p.screenshot({ path: 'concepts.png', fullPage: true }); await b.close();
