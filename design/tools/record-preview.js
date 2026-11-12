// Re-records design/preview: two scroll recordings (desktop, phone) and six desktop stills.
// usage: npm run build && npx next start -p 3210 &   then   node design/tools/record-preview.js   (needs playwright and ffmpeg)
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs'), path = require('path'), os = require('os');
const URL = 'http://localhost:3210/', OUT = path.join(__dirname, '..', 'preview'), SECONDS = 40;

(async () => {
  const b = await chromium.launch(), tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'btn-preview-'));

  // recordings: one steady scroll from top to bottom
  for (const [name, w, h, phone] of [['desktop', 1280, 800, false], ['phone', 390, 664, true]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: phone, hasTouch: phone, deviceScaleFactor: 2, recordVideo: { dir: tmp, size: { width: w, height: h } } });
    const p = await ctx.newPage(), t0 = Date.now();
    await p.goto(URL, { waitUntil: 'networkidle' }); await p.waitForTimeout(3200);
    const lead = (Date.now() - t0) / 1000 - 2.6;                          // keep the hero's opening, drop the page load before it
    await p.evaluate((ms) => new Promise((done) => {
      const end = document.documentElement.scrollHeight - innerHeight, s = performance.now();
      const step = (now) => { const t = Math.min(1, (now - s) / ms); scrollTo(0, end * t); t < 1 ? requestAnimationFrame(step) : done(); };
      requestAnimationFrame(step);
    }), SECONDS * 1000);
    await p.waitForTimeout(2500);
    const video = await p.video().path(); await ctx.close();
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-ss', Math.max(0, lead).toFixed(2), '-i', video, '-r', '25', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '24', '-movflags', '+faststart', path.join(OUT, `beck-to-nature-site-${name}.mp4`)]);
    console.log('recorded', name);
  }

  // stills, 1440x900
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(URL, { waitUntil: 'networkidle' }); await p.waitForTimeout(3200);
  const span = await p.evaluate(() => document.querySelector('.flight').offsetHeight - innerHeight);
  const top = (sel, off) => p.evaluate(([sel, off]) => document.querySelector(sel).getBoundingClientRect().top + scrollY - off, [sel, off]);
  const stops = [['hero', 0], ['flight', span * 0.45], ['landing', span * 0.93], ['specialties', await top('#specialties', 40)], ['inquiry', await top('#inquiry', 60)], ['closing-signature', 1e9]];
  let cur = 0;
  for (const [name, y0] of stops) {
    const y = Math.min(y0, await p.evaluate(() => document.documentElement.scrollHeight - innerHeight));
    for (let s = cur; s < y; s += 120) { await p.evaluate((v) => scrollTo(0, v), s); await p.waitForTimeout(30); }
    await p.evaluate((v) => scrollTo(0, v), y); cur = y; await p.waitForTimeout(2200);
    await p.screenshot({ path: path.join(OUT, `${name}.jpg`), type: 'jpeg', quality: 86 });
  }
  await b.close(); fs.rmSync(tmp, { recursive: true, force: true });
  console.log('stills done');
})();
