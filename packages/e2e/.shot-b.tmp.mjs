import { chromium } from '@playwright/test';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
const root = process.argv[2]; const out = process.argv[3]; const ids = process.argv.slice(4);
const types = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.json':'application/json', '.svg':'image/svg+xml', '.woff2':'font/woff2' };
const server = createServer(async (req, res) => { try { const p = join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname)); const b = await readFile(p.endsWith('/') ? p + 'index.html' : p); res.writeHead(200, { 'content-type': types[extname(p)] ?? 'application/octet-stream' }); res.end(b); } catch { res.writeHead(404); res.end(); } }).listen(Number(process.env.PORT ?? 6123));
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage({ viewport: { width: 900, height: 600 } });
const errors = [];
page.on('pageerror', e => errors.push(e.message)); page.on('console', m => m.type()==='error' && errors.push(m.text()));
for (const id of ids) {
  const [sid, theme] = id.split('@');
  await page.goto(`http://127.0.0.1:${process.env.PORT ?? 6123}/iframe.html?id=${sid}&viewMode=story${theme ? '&globals=theme:'+theme : ''}`);
  await page.waitForSelector('#storybook-root > *', { timeout: 15000 }).catch(() => errors.push('no render ' + id));
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${out}/${id.replace(/[^a-z0-9@-]/gi,'_')}.png`, fullPage: true });
}
console.log(errors.length ? errors.join('\n') : 'no errors');
await browser.close(); server.close();
