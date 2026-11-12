/* The thread: the signature writes itself in the hero, unwinds into one smooth line that follows the scroll,
   passes the founder on its way, and ends by writing the signature once more, joining it at the B. Everything it has
   passed is lit; scrolling back up switches things off again. */
(() => {
  const SIG = {{SIG}}, SW = 860, SH = 410;
  const page = document.querySelector('.page'), svg = $('thread'), core = $('t-core'), glow = $('t-glow'), head = $('t-head'), sigG = $('t-sig'), endG = $('t-end');
  const NS = 'http://www.w3.org/2000/svg';
  const LUM = '#why h2, .why2-lead, .why2-note, #why .text-cta, #specialties .sec-head, .tri, .iq-intro, #wiz, .portrait, .founder-text h2, .f-name, .f-quote, .essay > div, .promise, #cases .sec-head, .story, #cases .text-cta, .foot';
  let lums = [], segs = [], eSegs = [], Lsig = 0, Lc = 0, Lt = 0, samples = [];
  const rel = el => { const a = el.getBoundingClientRect(), b = page.getBoundingClientRect(); return { top: a.top - b.top, bottom: a.bottom - b.top, left: a.left - b.left, right: a.right - b.left, w: a.width, h: a.height }; };
  const cr = pts => { let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) { const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
      d += ` C ${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`; } return d; };
  function build() {
    const W = page.clientWidth, H = page.scrollHeight, narrow = W < 700;
    svg.setAttribute('width', W); svg.setAttribute('height', H); svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    // hero signature
    const hero = rel(document.querySelector('.hero'));
    const sw = Math.min(250, W * .4), k = sw / SW, ox = W / 2 - sw / 2, oy = hero.bottom - SH * k - (narrow ? W * .05 : 70);
    const tr = d => d.replace(/(-?\d+\.?\d*) (-?\d+\.?\d*)/g, (_, x, y) => `${(ox + x * k).toFixed(1)} ${(oy + y * k).toFixed(1)}`);
    sigG.innerHTML = SIG.map(d => `<path class="g" d="${tr(d)}"/><path class="c" d="${tr(d)}"/>`).join('');
    const sp = [...sigG.querySelectorAll('path')]; segs = []; Lsig = 0;
    for (let i = 0; i < sp.length; i += 2) { const len = sp[i + 1].getTotalLength(); segs.push({ els: [sp[i], sp[i + 1]], off: Lsig, len }); Lsig += len; }
    const start = [ox + 842 * k, oy + 292 * k], y0 = start[1];
    // a calm lane: one slow sway across the page with small waves, never doubling back
    const cx = W / 2, sway = narrow ? 0 : W * .3, amp = narrow ? 3 : 10;
    const laneX = narrow ? (y => W - 12 + amp * Math.sin((y - y0) / 360 * Math.PI * 2)) : (y => cx + sway * Math.sin((y - y0) / 2600 * Math.PI * 2 + .9) + amp * Math.sin((y - y0) / 460 * Math.PI * 2));
    const lane = (a, b, pts) => { for (let y = a; y < b; y += 36) pts.push([laneX(y), y]); };
    // where a signature box sits once its entrance animation has finished (ignore pending transforms)
    const relRest = el => { const r = rel(el); let dx = 0, dy = 0;
      for (let n = el; n && n !== page; n = n.parentElement) { const t = getComputedStyle(n).transform; if (t && t !== 'none') { const m = new DOMMatrix(t); dx += m.m41; dy += m.m42; } }
      return { ...r, left: r.left - dx, right: r.right - dx, top: r.top - dy, bottom: r.bottom - dy }; };
    // the signature's own strokes, exactly as drawn, in writing order: B bowls (from the lead-in), B stem, the e's, k stem, k loop and tail
    const split = SIG[3].indexOf(' C 664 256'), s3a = SIG[3].slice(0, split), s3aEnd = s3a.match(/(-?\d+\.?\d*) (-?\d+\.?\d*)\s*$/);
    const ORDER = [SIG[1], SIG[0], s3a, SIG[2], `M ${s3aEnd[1]} ${s3aEnd[2]}` + SIG[3].slice(split)];
    const sigAt = (el, vx, vy) => { const r = relRest(el), k = Math.min(r.w / 850, r.h / 380), ox = r.left + (r.w - 850 * k) / 2 - vx * k, oy = r.top + (r.h - 380 * k) / 2 - vy * k;
      const P = (x, y) => [ox + x * k, oy + y * k];
      return { k, B: P(22, 182), K: P(842, 292), bottom: oy + 386 * k, left: ox + 22 * k, right: ox + 842 * k,
        strokes: ORDER.map(d => d.replace(/(-?\d+\.?\d*) (-?\d+\.?\d*)/g, (_, x, y) => P(+x, +y).map(v => v.toFixed(2)).join(' '))) }; };
    const eS = sigAt($('end-sig'), 10, 20);                       // closing signature, bottom left
    // the line meets the closing signature only at the B: a soft hook rising into the B's lead-in stroke
    const hookB = S => { const B = S.B, u = Math.max(18, 160 * S.k);
      return [[B[0] - u * .9, B[1] - u * .3], [B[0] - u * .8, B[1] + u * .9], [B[0] - u * .35, B[1] + u * .9], [B[0] - u * .05, B[1] + u * .35], B]; };
    const ss = v => { v = clamp(v); return v * v * (3 - 2 * v); }, Dk = narrow ? 260 : 460;
    // keep clear of text: blocked spans per height, passing behind cards is fine
    const TXT = 'h2, .sec-head p, .why2-lead, .why2-note, .text-cta, .iq-head p, .f-name, .f-quote, .essay > div, .promise, .story-result, .story-facts, .spec-note, .foot';
    const pad = narrow ? 8 : 36, edge = narrow ? 10 : 26;
    const blocks = [...document.querySelectorAll(TXT)].filter(el => !el.closest('.card, .tri, #wiz, .hero')).map(rel).map(r => ({ t: r.top - pad, b: r.bottom + pad, l: r.left - pad, r: r.right + pad }));
    const freeX = (y, want) => { const spans = blocks.filter(z => y >= z.t && y <= z.b).sort((a, b) => a.l - b.l);
      if (!spans.some(z => want > z.l && want < z.r)) return want;
      const cands = [edge, W - edge]; spans.forEach(z => cands.push(z.l, z.r));
      const ok = x => x >= edge && x <= W - edge && !spans.some(z => x > z.l + .5 && x < z.r - .5);
      return cands.filter(ok).sort((a, b) => Math.abs(a - want) - Math.abs(b - want))[0] ?? want; };
    const smooth = (xs, r) => xs.map((_, i) => { let s = 0, n = 0; for (let j = Math.max(0, i - r); j <= Math.min(xs.length - 1, i + r); j++) { s += xs[j]; n++; } return s / n; });
    const routed = (a, b, want, keepEnds) => { const ys = []; for (let y = a; y < b; y += 12) ys.push(y);
      let xs = ys.map(y => freeX(y, want(y)));
      for (let pass = 0; pass < 4; pass++) { xs = smooth(xs, pass < 2 ? 14 : 5); xs = xs.map((x, i) => freeX(ys[i], x)); }
      xs = smooth(xs, 2).map((x, i) => freeX(ys[i], x));
      const out = []; ys.forEach((y, i) => { if (i % 3 === 0) out.push([xs[i], y]); }); return out; };
    // one continuous line (a dash window only behaves on a single subpath); the closing signature's strokes are separate paths written after it
    let pts;
    const fq = rel(document.querySelector('.f-quote')), fY = fq.bottom + 60;   // where the founder signature used to sit, under the quote
    if (!narrow) {
      // desktop: run down the side margins, cross over in the empty bands between sections,
      // slip under the founder photo into the signature, and end by writing the closing signature
      const xL = W * .3, xR = W * .72;
      const wv = (x, y) => x + W * .07 * Math.sin(y / 520) + 10 * Math.sin(y / 170);
      const R = q => rel(document.querySelector(q));
      const why = R('#why .why2'), spH = R('#specialties .sec-head'), fo = R('#founder'), promise = R('#founder .promise'), csH = R('#cases .sec-head');
      // the route the owners drew (on a 528px-wide picture of the page), mapped onto the live layout:
      // x scales with the page width, y is pinned to the hero signature, the featured specialty card, the founder signature and the closing one
      const tl = R('.tri-lit'), A = [[258, y0], [640, tl.top + tl.h / 2], [1305, fY], [1915, eS.B[1]]];
      const my = v => { for (let i = 0; i < A.length - 1; i++) if (v <= A[i + 1][0] || i === A.length - 2) return lerp(A[i][1], A[i + 1][1], (v - A[i][0]) / (A[i + 1][0] - A[i][0])); };
      const M = ([x, y]) => [x * W / 528, my(y)];
      pts = [start];
      [[330, 262], [375, 290], [415, 335], [435, 395], [425, 450], [390, 495], [335, 545], [275, 598], [215, 655], [178, 705], [168, 750], [185, 790],
       [212, 832], [232, 870], [240, 910], [250, 950], [262, 1000], [262, 1060], [248, 1130], [232, 1200], [228, 1262], [250, 1300], [300, 1318],
       [352, 1325], [385, 1345], [394, 1395], [384, 1450], [366, 1510], [342, 1556], [292, 1585], [242, 1622], [222, 1662], [232, 1702],
       [268, 1742], [294, 1782], [294, 1830], [268, 1868]].forEach(p => pts.push(M(p)));
      // drift left above the closing signature and hook into its B
      pts.push([eS.B[0] + 150, eS.B[1] - 125], [eS.B[0] - 25, eS.B[1] - 100]);
      hookB(eS).forEach(p => pts.push(p));
    } else {
      pts = [start, [start[0] + 40, y0 + 4], [start[0] + 75, y0 + 30]];
      const sY = y0 + 70, cY = eS.bottom - 80;
      // phone: wide, slow S-curves across the screen (behind the text, like on desktop), easing in from the hero signature
      // and out towards the closing one
      const wind = y => Math.min(W - 16, Math.max(16, W * .54 + W * .34 * Math.sin((y - y0) / 1050 * Math.PI * 2 + 1.1) + 5 * Math.sin((y - y0) / 290 * Math.PI * 2)));
      for (let y = sY; y < cY; y += 40) { const x0 = lerp(start[0] + 95, wind(y), ss((y - sY) / (Dk * 1.4))); pts.push([lerp(x0, eS.right + 30, ss((y - (cY - Dk)) / Dk)), y]); }
      pts.push([lerp(eS.right + 30, eS.B[0], .5), eS.B[1] - 120], [eS.B[0] - 14, eS.B[1] - 90]);
      hookB(eS).forEach(p => pts.push(p));
    }
    const d = cr(pts); core.setAttribute('d', d); glow.setAttribute('d', d);
    Lc = core.getTotalLength();
    endG.innerHTML = eS.strokes.map(d => `<path class="g" d="${d}"/><path class="c" d="${d}"/>`).join('');
    const ep = [...endG.querySelectorAll('path')]; eSegs = []; let Le = 0;
    for (let i = 0; i < ep.length; i += 2) { const len = ep[i + 1].getTotalLength(); eSegs.push({ els: [ep[i], ep[i + 1]], off: Lc + Le, len }); Le += len; }
    Lt = Lc + Le;
    samples = []; let maxY = -1e9; const N = Math.min(4000, Math.ceil(Lc / 5));
    for (let i = 0; i <= N; i++) { const l = Lc * i / N, p = core.getPointAtLength(l); maxY = Math.max(maxY, p.y); samples.push({ l, y: maxY }); }
    lums = [...document.querySelectorAll(LUM), ...document.querySelectorAll('.stone')].map(el => { el.classList.add('lum'); const r = rel(el); return { el, y: r.top + Math.min(r.h, 160) / 2 }; });
    paint();
  }
  const lenAt = y => { let lo = 0, hi = samples.length - 1; while (lo < hi) { const m = (lo + hi) >> 1; if (samples[m].y < y) lo = m + 1; else hi = m; } return samples[lo] ? samples[lo].l : Lt; };
  const cur = { s: 0, h: 0 }, tgt = { s: 0, h: 0 }; let written = reduce, raf = 0;
  const win = (els, len, a, b) => { const v = b - a; els.forEach(el => { if (v < .5) { el.style.visibility = 'hidden'; return; } el.style.visibility = ''; el.style.strokeDasharray = `${v.toFixed(1)} ${(len * 3).toFixed(0)}`; el.style.strokeDashoffset = (-a).toFixed(1); }); };
  function paint() {
    segs.forEach(g => win(g.els, g.len, clamp(cur.s - g.off, 0, g.len), clamp(cur.h - g.off, 0, g.len)));
    const th = clamp(cur.h - Lsig, 0, Lt), ts = clamp(cur.s - Lsig, 0, Lt);
    win([core, glow], Lc, Math.min(ts, Lc), Math.min(th, Lc));
    eSegs.forEach(g => win(g.els, g.len, clamp(ts - g.off, 0, g.len), clamp(th - g.off, 0, g.len)));
    head.classList.toggle('on', th > 2 && th < Lt - 2);
    const at = l => { if (l <= Lc) return core.getPointAtLength(l); const g = eSegs.find(g => l <= g.off + g.len) || eSegs[eSegs.length - 1]; return g.els[1].getPointAtLength(clamp(l - g.off, 0, g.len)); };
    const hp = th > 0 ? at(th) : null, hy = hp ? hp.y : -1e9;
    if (hp) head.setAttribute('transform', `translate(${hp.x.toFixed(1)} ${hp.y.toFixed(1)})`);
    const all = th >= Lt - 2;
    lums.forEach(o => o.el.classList.toggle('lit', reduce || all || hy >= o.y - 40));
  }
  function target() {
    const top = -page.getBoundingClientRect().top, vh = innerHeight;
    const u = clamp(top / (vh * .85)), e = u * u * (3 - 2 * u);
    tgt.s = written ? Lsig * e : 0;
    const bottom = top + vh >= page.scrollHeight - 6;
    tgt.h = !written ? cur.h : Lsig + (top < 2 ? 0 : bottom ? Lt : lenAt(top + vh * .6));
  }
  // the line eases after the scroll; the faster you scroll, the faster it catches up (calm when slow, quick when flicking)
  let sv = 0, lastY = scrollY, lastT = performance.now();
  function loop() {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(function step(now) {
      const dt = Math.max(1, Math.min(64, now - lastT)), inst = Math.abs(scrollY - lastY) / dt; lastY = scrollY; lastT = now;
      sv = sv * .86 + inst * .14;                                   // smoothed scroll speed, px per ms
      const k = .055 + Math.min(.3, Math.max(0, sv - .35) * .13);    // follow rate per 60fps frame
      const f = 1 - Math.pow(1 - k, dt / 16.7);                      // same feel at any frame rate
      target(); let moving = false;
      ['s', 'h'].forEach(p => { const dl = tgt[p] - cur[p]; if (Math.abs(dl) > .3) { cur[p] += dl * f; moving = true; } else cur[p] = tgt[p]; });
      paint(); if (moving) raf = requestAnimationFrame(step); else sv = 0;
    });
  }
  addEventListener('scroll', () => { if (written) loop(); }, { passive: true });
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { build(); if (written) loop(); }, 150); });
  const go = () => { build();
    if (reduce) { cur.s = Lsig; cur.h = Lsig + Lt; paint(); return; }
    const t0 = performance.now(), dur = 2800;
    (function w(now) { const t = clamp((now - t0) / dur); cur.h = Lsig * (t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2); cur.s = 0; paint();
      if (t < 1) requestAnimationFrame(w); else { written = true; loop(); } })(t0);
  };
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => setTimeout(go, 400));
})();
