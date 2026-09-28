import { chromium } from '@playwright/test';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
const root = process.argv[2]; const ids = process.argv.slice(3);
const types = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.json':'application/json', '.svg':'image/svg+xml', '.woff2':'font/woff2' };
const port = Number(process.env.PORT ?? 6210);
const server = createServer(async (req, res) => { try { const p = join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname)); const b = await readFile(p.endsWith('/') ? p + 'index.html' : p); res.writeHead(200, { 'content-type': types[extname(p)] ?? 'application/octet-stream' }); res.end(b); } catch { res.writeHead(404); res.end(); } }).listen(port);
const axe = await readFile(new URL('../../node_modules/axe-core/axe.min.js', import.meta.url), 'utf8');
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage({ viewport: { width: 900, height: 600 } });
for (const id of ids) {
  for (const theme of ['light','dark']) {
    await page.goto(`http://127.0.0.1:${port}/iframe.html?id=${id}&viewMode=story&globals=theme:${theme}`);
    await page.waitForSelector('#storybook-root > *', { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(250);
    await page.addScriptTag({ content: axe });
    const r = await page.evaluate(async () => (await window.axe.run('#storybook-root', { resultTypes: ['violations'] })).violations.map(v => `${v.id} (${v.impact}): ${v.nodes.slice(0,3).map(n => n.target.join(' ')).join(' | ')}`));
    if (r.length) console.log(id, theme, '\n  ' + r.join('\n  '));
  }
}
console.log('done');
await browser.close(); server.close();
