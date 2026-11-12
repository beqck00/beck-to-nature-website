// usage: node shoot.js <desk|phone> <label> <fractions comma separated of flight, or px with "px" suffix>
const { chromium, devices } = require('playwright');
(async () => {
  const [mode, label, list] = process.argv.slice(2);
  for (let i = 0; i < 40; i++) { try { const r = await fetch('http://localhost:3210/'); if (r.ok) break; } catch {} await new Promise(r => setTimeout(r, 400)); }
  const b = await chromium.launch();
  const ctx = await b.newContext(mode === 'phone' ? { ...devices['iPhone 13'] } : { viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push('PAGEERR ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text().slice(0, 200)); });
  await p.goto('http://localhost:3210/', { waitUntil: 'networkidle' }); await p.waitForTimeout(3200);
  const info = await p.evaluate(() => { const f = document.querySelector('.flight'), s = document.querySelector('.flight-stage'); return { fx: document.documentElement.className, flightH: f.offsetHeight, stageH: s.offsetHeight, docH: document.documentElement.scrollHeight, vw: innerWidth, vh: innerHeight, overflow: document.documentElement.scrollWidth - innerWidth }; });
  console.log(JSON.stringify(info));
  const span = info.flightH - info.stageH; let cur = 0;
  for (const item of list.split(',')) {
    const y = item.endsWith('px') ? parseFloat(item) : parseFloat(item) * span;
    const steps = Math.max(1, Math.ceil(Math.abs(y - cur) / 120));
    for (let k = 1; k <= steps; k++) { await p.evaluate(v => scrollTo(0, v), cur + (y - cur) * k / steps); await p.waitForTimeout(40); }
    cur = y; await p.waitForTimeout(1500);
    await p.screenshot({ path: `${process.env.SHOTS || '.'}/${label}-${item.replace('.', '_')}.png` });
  }
  console.log(errs.length ? errs.slice(0, 8).join('\n') : 'no errors');
  await b.close();
})();
