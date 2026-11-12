// The opening flight. One pinned stage holds a dotted world map (canvas) and the gold line (SVG) under one camera.
// At rest it is the hero: the map with a few slow routes, the headline, and the "Beck" signature writing itself.
// As the page scrolls, the signature unwinds into the line, the line rises to Budapest, the camera closes in and
// rides the line across the Atlantic while three statements appear, and it pulls back out over America, where the
// "why" block lands and the line drops off the bottom of the stage to carry on down the page.

import gsap from "gsap";
import { WORLD_D, WORLD_DOTS } from "@/lib/data/world";
import { SIG_H, SIG_STROKES, SIG_W } from "@/lib/data/signature";
import { clamp, dashWindow, lerp, mapPath, type Pt, smoothPath, splitWords, sstep, strokePaths } from "./util";

// Map units, as in lib/data/world.ts.
const K = Math.cos((44 * Math.PI) / 180);
const geo = (lon: number, lat: number): Pt => [(lon + 128) * K, 84 - lat];
const CITIES: Record<string, Pt> = {
  budapest: geo(19.04, 47.5), london: geo(-0.13, 51.51), paris: geo(2.35, 48.86), berlin: geo(13.4, 52.52), vienna: geo(16.37, 48.21),
  chicago: geo(-87.63, 41.88), newyork: geo(-74.01, 40.71), orlando: geo(-81.38, 28.54), lasvegas: geo(-115.14, 36.17),
};
const ROUTES: [string, string, number][] = [["budapest", "chicago", 30], ["london", "newyork", 18], ["paris", "orlando", 22], ["berlin", "chicago", 27], ["vienna", "lasvegas", 33]];
const FROM = "budapest", TO = "chicago", LIFT = 30;

// Scroll progress (0..1) at which each beat of the flight happens.
const T = {
  heroOut: 0.09,                    // headline, routes and signature have made way for the line
  atOrigin: 0.11,                   // the line reaches Budapest
  zoomIn: [0.1, 0.22] as const,     // camera closes in
  says: [0.25, 0.41, 0.57],         // the three statements
  zoomOut: [0.7, 0.82] as const,    // camera pulls back over America (the line arrives at 0.70)
  land: 0.8,                        // the "why" block comes in
};
const BAND = "(max-width:700px), (max-aspect-ratio: 21/20)";   // phones and tall windows: the map is a band at the bottom

const DOT = [45, 43, 40], NEAR = [70, 62, 51], WARM = [156, 126, 82], HOT = [235, 211, 166];
const mix = (a: number[], b: number[], t: number) => `rgb(${a.map((v, i) => Math.round(lerp(v, b[i], t))).join(",")})`;
const HEAT_FILL = [0.18, 0.36, 0.54, 0.72, 0.9, 1].map((h) => (h < 0.5 ? mix(DOT, WARM, h * 2) : mix(WARM, HOT, (h - 0.5) * 2)));

export type Flight = {
  /** Recompute everything that depends on the stage size. */
  layout(): void;
  /** Draw one frame at scroll progress p (0..1). */
  render(p: number, now: number): void;
  /** Draw the hero once, complete and still (no animation). */
  renderStill(): void;
  /** Where the line leaves the bottom of the stage (x in px). */
  exitX(): number;
  /** Play the opening: the headline rises and the signature writes itself. */
  playIntro(): void;
  /** Skip the opening animation (the page was loaded part-way down). */
  skipIntro(): void;
  destroy(): void;
};

export function createFlight(root: HTMLElement): Flight {
  const q = <E extends Element>(s: string) => root.querySelector(s) as E;
  const sky = q<HTMLElement>(".flight-sky"), canvas = q<HTMLCanvasElement>(".flight-map"), veil = q<HTMLElement>(".flight-veil");
  const svg = q<SVGSVGElement>(".flight-line"), glow = q<SVGPathElement>(".t-glow"), core = q<SVGPathElement>(".t-core");
  const sigG = q<SVGGElement>(".t-sig"), head = q<SVGGElement>(".t-head");
  const h1 = q<HTMLElement>("h1"), cue = q<HTMLElement>(".cue"), land = q<HTMLElement>(".flight-land");
  const says = [...root.querySelectorAll<HTMLElement>(".say")];
  const labelFrom = q<HTMLElement>('.fl-label[data-city="from"]'), labelTo = q<HTMLElement>('.fl-label[data-city="to"]');
  const ctx = canvas.getContext("2d")!;
  const hover = !matchMedia("(hover: none), (pointer: coarse)").matches;

  // the dots, in map units
  const dots: { mx: number; my: number; near: boolean }[] = [];
  for (const row of WORLD_DOTS.split(";")) {
    const [r, xs] = row.split(":"), my = +r * WORLD_D;
    for (const xi of xs.split(",")) {
      const mx = +xi * WORLD_D;
      dots.push({ mx, my, near: Object.values(CITIES).some(([cx, cy]) => (mx - cx) ** 2 + (my - cy) ** 2 < 30) });
    }
  }
  const n = dots.length, X = new Float32Array(n), Y = new Float32Array(n), heat = new Float32Array(n);

  // a soft glow sprite for cities, comets and the head of the line
  const sprite = document.createElement("canvas");
  sprite.width = sprite.height = 96;
  {
    const c = sprite.getContext("2d")!, g = c.createRadialGradient(48, 48, 0, 48, 48, 48);
    g.addColorStop(0, "rgba(255,240,208,.9)"); g.addColorStop(0.35, "rgba(226,193,134,.4)"); g.addColorStop(1, "rgba(226,193,134,0)");
    c.fillStyle = g; c.fillRect(0, 0, 96, 96);
  }

  // headline: split into glyphs so letters can glow as a comet passes; words rise in at the start
  h1.setAttribute("aria-label", h1.textContent?.replace(/\s+/g, " ").trim() ?? "");
  if (!h1.dataset.split) {
    h1.dataset.split = "glyph";
    h1.querySelectorAll<HTMLElement>(".l1, .l2").forEach((line) => {
      const words = (line.textContent ?? "").split(" ");
      line.textContent = ""; line.setAttribute("aria-hidden", "true");
      words.forEach((w, i) => {
        const wd = document.createElement("span"); wd.className = "word";
        for (const ch of w) { const g = document.createElement("span"); g.className = "glyph"; g.textContent = ch; wd.append(g); }
        line.append(wd); if (i < words.length - 1) line.append(" ");
      });
    });
  }
  const words = [...h1.querySelectorAll<HTMLElement>(".word")], glyphs = [...h1.querySelectorAll<HTMLElement>(".glyph")];
  let glyphAt: { x: number; y: number; v: string }[] = [];

  // geometry, filled in by layout()
  let W = 0, H = 0, dpr = 1, s = 1, offX = 0, offY = 0, band = false, r0 = 1, rClose = 5, Z = 3.4;
  let cities: Record<string, Pt> = {};
  let routes: { pts: Pt[]; cum: number[]; len: number; delay: number; period: number }[] = [];
  let segs: ReturnType<typeof strokePaths> = [], Lsig = 0;
  let L = 0, LB = 0, LU = 0, xOut = 0, anchor: Pt = [0, 0];
  const mp = (mx: number, my: number): Pt => [offX + (mx + 3) * s, offY + (my + 1) * s];

  // scroll-linked timeline for everything that is ordinary DOM (headline, statements, labels, the landing block)
  const state = { dim: 1 };
  let tl: gsap.core.Timeline | null = null;
  function timeline() {
    tl?.kill();
    gsap.set([h1, cue, land, ...says, labelFrom, labelTo], { clearProps: "all" });
    state.dim = 1;
    const t = gsap.timeline({ paused: true, defaults: { ease: "none" } });
    t.to(h1, { yPercent: -40, autoAlpha: 0, duration: T.heroOut - 0.01, ease: "power1.in" }, 0.004);
    t.to(cue, { autoAlpha: 0, duration: 0.03 }, 0);
    t.fromTo(labelFrom, { opacity: 0 }, { opacity: 1, duration: 0.04 }, T.zoomIn[0] + 0.02).to(labelFrom, { opacity: 0, duration: 0.04 }, T.zoomIn[1] + 0.04);
    t.fromTo(labelTo, { opacity: 0 }, { opacity: 1, duration: 0.04 }, T.zoomOut[0] - 0.05).to(labelTo, { opacity: 0, duration: 0.05 }, T.land + 0.01);
    says.forEach((el, i) => {
      const at = T.says[i], w = splitWords(el, "rise");
      t.fromTo(el, { autoAlpha: 0, y: 0 }, { autoAlpha: 1, duration: 0.004 }, at);
      t.fromTo(w, { yPercent: 118 }, { yPercent: 0, duration: 0.05, stagger: 0.014, ease: "power3.out" }, at);
      t.to(el, { autoAlpha: 0, y: -36, duration: 0.035, ease: "power1.in" }, at + 0.115);
    });
    const lines = splitWords(land.querySelector("h2")!, "rise");
    t.fromTo(land, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.004 }, T.land);
    t.fromTo(lines, { yPercent: 118 }, { yPercent: 0, duration: 0.07, stagger: 0.012, ease: "power3.out" }, T.land + 0.005);
    t.fromTo(land.querySelector(".why2-lead"), { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.06, ease: "power2.out" }, T.land + 0.045);
    t.fromTo(land.querySelector(".firstq"), { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.06, ease: "power2.out" }, T.land + 0.08);
    t.to(state, { dim: band ? 0.3 : 0.55, duration: 0.09 }, T.land - 0.01);
    t.set({}, {}, 1);
    tl = t;
  }

  function layout() {
    W = sky.clientWidth; H = sky.clientHeight; dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    band = matchMedia(BAND).matches;
    if (band) { s = W / 124; offX = 0; offY = H - 84 * s - (W < 700 ? 10 : 28); Z = 6; rClose = 3; }
    else { s = Math.max(W / 124, H / 84); offX = (W - 124 * s) / 2; offY = 0; Z = 3.4; rClose = 5.2; }
    r0 = 0.34 * s; rClose = Math.max(rClose, r0);
    for (let i = 0; i < n; i++) { const p = mp(dots[i].mx, dots[i].my); X[i] = p[0]; Y[i] = p[1]; }
    cities = Object.fromEntries(Object.entries(CITIES).map(([k, [x, y]]) => [k, mp(x, y)]));
    // the map fades into the page at its edges while the camera is wide
    const mh = 84 * s;
    veil.style.background = band
      ? `linear-gradient(180deg, var(--k1) 0, transparent ${(mh * 0.16).toFixed(0)}px, transparent ${(mh * 0.84).toFixed(0)}px, var(--k1) ${(H - offY).toFixed(0)}px) 0 ${offY.toFixed(0)}px / 100% ${(H - offY).toFixed(0)}px no-repeat`
      : "linear-gradient(180deg, transparent 66%, var(--k1) 99%)";

    // decorative routes, sampled
    const quad = (a: Pt, c: Pt, b: Pt, t: number): Pt => [(1 - t) ** 2 * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0], (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1]];
    const arc = (from: string, to: string, lift: number, steps: number) => {
      const a = CITIES[from], b = CITIES[to], c: Pt = [(a[0] + b[0]) / 2, Math.min(a[1], b[1]) - lift];
      return Array.from({ length: steps + 1 }, (_, i) => { const m = quad(a, c, b, i / steps); return mp(m[0], m[1]); });
    };
    routes = ROUTES.map(([a, b, lift], i) => {
      const pts = arc(a, b, lift, 48), cum = [0];
      for (let j = 1; j < pts.length; j++) cum.push(cum[j - 1] + Math.hypot(pts[j][0] - pts[j - 1][0], pts[j][1] - pts[j - 1][1]));
      return { pts, cum, len: cum[cum.length - 1], delay: 300 + i * 450, period: 4200 + i * 600 };
    });

    // the signature, bottom centre
    const sw = Math.min(250, W * 0.4), k = sw / SIG_W, ox = W / 2 - sw / 2, oy = H - SIG_H * k - (W < 700 ? W * 0.05 : 70);
    segs = strokePaths(sigG, SIG_STROKES.map((d) => mapPath(d, (x, y) => [ox + x * k, oy + y * k])));
    Lsig = segs.reduce((a, g) => a + g.len, 0);
    const start: Pt = [ox + 842 * k, oy + 292 * k];

    // the line: signature tail -> Budapest -> (the Budapest-Chicago route) -> Chicago -> off the bottom edge
    // It joins and leaves the route along the route's own direction, so there is no elbow at either city.
    const B = cities[FROM], U = cities[TO];
    const ctrl = mp((CITIES[FROM][0] + CITIES[TO][0]) / 2, Math.min(CITIES[FROM][1], CITIES[TO][1]) - LIFT);
    const unit = (a: Pt, b: Pt): Pt => { const d = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; return [(b[0] - a[0]) / d, (b[1] - a[1]) / d]; };
    const d0 = unit(B, ctrl), d1 = unit(ctrl, U);
    const pre: Pt = [Math.min(W - 14, B[0] - d0[0] * 0.07 * W), B[1] - d0[1] * 0.07 * W], post: Pt = [U[0] + d1[0] * 0.05 * W, U[1] + d1[1] * 0.05 * W];
    xOut = W * 0.3;
    const pts: Pt[] = [start, [lerp(start[0], pre[0], 0.3), lerp(start[1], pre[1], 0.03)], [lerp(start[0], pre[0], 0.66), lerp(start[1], pre[1], 0.26)], [lerp(start[0], pre[0], 0.93), lerp(start[1], pre[1], 0.7)], pre];
    pts.push(...arc(FROM, TO, LIFT, 26));
    const down = H - U[1];
    pts.push(post, [post[0] - 0.01 * W, U[1] + 0.3 * down], [lerp(post[0], xOut, 0.45), U[1] + 0.62 * down], [xOut, H - 0.12 * down], [xOut, H + 2]);   // leaves straight down, where the page's line picks it up
    const d = smoothPath(pts);
    core.setAttribute("d", d); glow.setAttribute("d", d);
    L = core.getTotalLength();
    let bestB = 1e9, bestU = 1e9;
    for (let i = 0; i <= 900; i++) {
      const l = (L * i) / 900, p = core.getPointAtLength(l), dB = Math.hypot(p.x - B[0], p.y - B[1]), dU = Math.hypot(p.x - U[0], p.y - U[1]);
      if (dB < bestB) { bestB = dB; LB = l; }
      if (dU < bestU) { bestU = dU; LU = l; }
    }
    anchor = [W * 0.5, H * (band ? 0.64 : 0.6)];
    glyphAt = [];
    timeline();
  }

  // how much of the line is drawn at progress p
  const lineAt = (p: number) => {
    const kf: Pt[] = [[0, 0], [T.atOrigin, LB], [T.zoomOut[0], LU], [T.land, LU + 0.12 * (L - LU)], [1, L]];
    for (let i = 1; i < kf.length; i++) if (p <= kf[i][0]) return lerp(kf[i - 1][1], kf[i][1], (p - kf[i - 1][0]) / (kf[i][0] - kf[i - 1][0]));
    return L;
  };

  // opening animation clock
  let t0 = performance.now(), intro = true, pointer: Pt | null = null, lastNow = 0, headPt: Pt = [0, 0];
  const onMove = (e: PointerEvent) => { const r = sky.getBoundingClientRect(); pointer = [e.clientX - r.left, e.clientY - r.top]; };
  const onLeave = () => { pointer = null; };
  if (hover) { sky.addEventListener("pointermove", onMove, { passive: true }); sky.addEventListener("pointerleave", onLeave); }

  function draw(p: number, now: number, still: boolean) {
    const dt = Math.min(64, now - lastNow || 16); lastNow = now;
    const el = still ? 1e7 : now - t0;
    if (intro && p > 0.02) intro = false;                                   // scrolling ends the opening early
    const e3 = (t: number) => 1 - Math.pow(1 - t, 3), eio = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
    const written = intro ? eio(clamp((el - 500) / 1700)) : 1;
    if (intro && written >= 1) intro = false;

    // camera
    const zc = sstep(T.zoomIn[0], T.zoomIn[1], p) * (1 - sstep(T.zoomOut[0], T.zoomOut[1], p));
    const z = 1 + (Z - 1) * zc, len = still ? 0 : lineAt(p);
    if (len > 0) { const hp = core.getPointAtLength(len); headPt = [hp.x, hp.y]; }
    const cx = lerp(W / 2, headPt[0] - (anchor[0] - W / 2) / z, zc), cy = lerp(H / 2, headPt[1] - (anchor[1] - H / 2) / z, zc);
    const sx = (x: number) => (x - cx) * z + W / 2, sy = (y: number) => (y - cy) * z + H / 2;

    // the line and the signature
    svg.setAttribute("viewBox", `${(cx - W / (2 * z)).toFixed(2)} ${(cy - H / (2 * z)).toFixed(2)} ${(W / z).toFixed(2)} ${(H / z).toFixed(2)}`);
    const sigFrom = Lsig * sstep(0, T.heroOut, p), sigTo = Lsig * written;
    for (const g of segs) dashWindow(g.els, g.len, clamp(sigFrom - g.off, 0, g.len), clamp(sigTo - g.off, 0, g.len));
    dashWindow([core, glow], L, Math.min(len, LB * sstep(T.zoomIn[0] + 0.03, T.zoomIn[1] + 0.05, p)), len);   // the first leg retracts to Budapest once the camera is close
    head.classList.toggle("on", len > 2 && len < L - 2);
    if (len > 0) head.setAttribute("transform", `translate(${headPt[0].toFixed(1)} ${headPt[1].toFixed(1)})`);
    veil.style.opacity = (1 - zc).toFixed(3);

    // heat: dots near the pointer (wide shot) and near the head of the line warm up, then cool
    const cool = Math.exp(-dt / 420);
    const pw: Pt | null = pointer && zc < 0.05 ? [(pointer[0] - W / 2) / z + cx, (pointer[1] - H / 2) / z + cy] : null;
    const Rp = 5.5 * s, Rh = (band ? 5 : 3.6) * s, lineOn = len > 4 && p < 0.985;
    const rs = lerp(r0, rClose, zc), pad = rs + 2;
    const vis: number[] = [];
    for (let i = 0; i < n; i++) {
      let h = heat[i] * cool;
      const x = X[i], y = Y[i];
      if (pw) { const d = Math.hypot(x - pw[0], y - pw[1]); if (d < Rp) h = Math.max(h, d < Rp * 0.5 ? 1 : 0.5); }
      if (lineOn) { const d = Math.hypot(x - headPt[0], y - headPt[1]); if (d < Rh) h = Math.max(h, 1 - 0.6 * (d / Rh)); }
      heat[i] = h < 0.02 ? 0 : h;
      const px = sx(x), py = sy(y);
      if (px > -pad && px < W + pad && py > -pad && py < H + pad) vis.push(i);
    }

    // paint
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const fade = still ? 1 : e3(clamp(el / 1200));
    ctx.globalAlpha = fade * state.dim;
    const square = rs < 1.5;
    const put = (i: number) => { const px = sx(X[i]), py = sy(Y[i]); if (square) ctx.rect(px - rs, py - rs, rs * 2, rs * 2); else { ctx.moveTo(px + rs, py); ctx.arc(px, py, rs, 0, 6.2832); } };
    ctx.fillStyle = mix(DOT, DOT, 0); ctx.beginPath(); for (const i of vis) if (!heat[i] && !dots[i].near) put(i); ctx.fill();
    ctx.fillStyle = mix(NEAR, NEAR, 0); ctx.beginPath(); for (const i of vis) if (!heat[i] && dots[i].near) put(i); ctx.fill();
    for (let b = 0; b < HEAT_FILL.length; b++) {
      const lo = b / HEAT_FILL.length, hi = (b + 1) / HEAT_FILL.length;
      ctx.fillStyle = HEAT_FILL[b]; ctx.beginPath();
      for (const i of vis) if (heat[i] > lo && heat[i] <= hi + (b === HEAT_FILL.length - 1 ? 1 : 0)) put(i);
      ctx.fill();
    }

    // routes, comets and cities: all five while the hero is up, then only the two ends of our route
    const ra = 1 - sstep(0.02, T.heroOut, p), comets: { x: number; y: number; o: number }[] = [];
    const glowAt = (x: number, y: number, r: number, a: number) => { if (a > 0.01) { ctx.globalAlpha = a; ctx.drawImage(sprite, x - r, y - r, r * 2, r * 2); } };
    if (ra > 0.01) {
      ctx.lineCap = "round"; ctx.lineWidth = Math.max(1, 0.3 * s) * (1 + 0.4 * zc); ctx.strokeStyle = "#F0D9AE";
      routes.forEach((r) => {
        const f = still ? 1 : e3(clamp((el - r.delay) / 1500)); if (f <= 0) return;
        const upto = r.len * f;
        ctx.globalAlpha = 0.65 * ra * fade; ctx.beginPath(); ctx.moveTo(sx(r.pts[0][0]), sy(r.pts[0][1]));
        for (let j = 1; j < r.pts.length; j++) {
          if (r.cum[j] <= upto) ctx.lineTo(sx(r.pts[j][0]), sy(r.pts[j][1]));
          else { const t = (upto - r.cum[j - 1]) / (r.cum[j] - r.cum[j - 1]); ctx.lineTo(sx(lerp(r.pts[j - 1][0], r.pts[j][0], t)), sy(lerp(r.pts[j - 1][1], r.pts[j][1], t))); break; }
        }
        ctx.stroke();
        const t = el - r.delay - 1500; if (still || t < 0) return;
        const kk = (t % r.period) / r.period, ff = clamp(kk / 0.85), at = r.len * eio(ff), o = kk < 0.85 ? Math.sin(ff * Math.PI) : 0;
        let j = 1; while (j < r.cum.length - 1 && r.cum[j] < at) j++;
        const tt = (at - r.cum[j - 1]) / (r.cum[j] - r.cum[j - 1] || 1), x = sx(lerp(r.pts[j - 1][0], r.pts[j][0], tt)), y = sy(lerp(r.pts[j - 1][1], r.pts[j][1], tt));
        glowAt(x, y, 3.4 * s, o * 0.6 * ra);
        ctx.globalAlpha = o * ra; ctx.fillStyle = "#FFF3D6"; ctx.beginPath(); ctx.arc(x, y, 0.8 * s, 0, 6.2832); ctx.fill();
        comets.push({ x, y, o: o * ra });
      });
    }
    Object.entries(cities).forEach(([name, c], i) => {
      const a = (name === FROM || name === TO ? Math.max(ra, sstep(0.03, T.heroOut, p)) : ra) * fade * state.dim;
      if (a < 0.01) return;
      const x = sx(c[0]), y = sy(c[1]), u = s * (1 + 0.5 * zc);
      glowAt(x, y, 2.6 * u, 0.8 * a);
      if (!still) {
        const k = ((el / 1000 + 4 - i * 0.5) % 4) / 4, e = e3(clamp(k / 0.7));
        ctx.globalAlpha = 0.8 * (1 - e) * a; ctx.strokeStyle = "#EBD3A6"; ctx.lineWidth = Math.max(0.6, 0.16 * s);
        ctx.beginPath(); ctx.arc(x, y, u * lerp(0.4, 2.6, e), 0, 6.2832); ctx.stroke();
      }
      ctx.globalAlpha = a; ctx.fillStyle = "#EBD3A6"; ctx.beginPath(); ctx.arc(x, y, 0.55 * u, 0, 6.2832); ctx.fill();
    });
    ctx.globalAlpha = 1;

    // city labels ride with the camera
    const place = (elx: HTMLElement, c: Pt, dxp: number) => { elx.style.transform = `translate(${(sx(c[0]) + dxp).toFixed(1)}px, ${(sy(c[1]) - 34).toFixed(1)}px)`; };
    place(labelFrom, cities[FROM], -(labelFrom.offsetWidth + 18)); place(labelTo, cities[TO], 16);

    // headline letters catch the light of a passing comet (wide shot, pointer devices)
    if (hover && !still) {
      if (!glyphAt.length) { const sb = sky.getBoundingClientRect(); glyphAt = glyphs.map((g) => { const b = g.getBoundingClientRect(); return { x: b.left - sb.left + b.width / 2, y: b.top - sb.top + b.height / 2, v: "" }; }); }
      const on = p < 0.01 && !intro;
      glyphs.forEach((g, i) => {
        let k = 0;
        if (on) for (const c of comets) { const ddx = (c.x - glyphAt[i].x) / 80, ddy = (c.y - glyphAt[i].y) / 60; k = Math.max(k, c.o * Math.exp(-(ddx * ddx + ddy * ddy))); }
        const v = k < 0.03 ? "" : `brightness(${(1 + k * 0.8).toFixed(2)}) drop-shadow(0 0 ${(3 + k * 14).toFixed(1)}px rgba(255,236,196,${(k * 0.85).toFixed(2)}))`;
        if (glyphAt[i].v !== v) { g.style.filter = v; glyphAt[i].v = v; }
      });
    }

    if (!still) tl?.progress(p);
  }

  // headline entrance
  let introTween: gsap.core.Tween | null = null;
  function playIntro() {
    t0 = performance.now(); intro = true;
    h1.classList.add("ready");
    introTween = gsap.fromTo(words, { yPercent: 118 }, { yPercent: 0, duration: 1.2, stagger: 0.09, ease: "power4.out", delay: 0.15, onComplete: () => { glyphAt = []; } });
  }

  return {
    layout,
    render: (p, now) => draw(p, now, false),
    renderStill: () => { h1.classList.add("ready"); intro = false; draw(0, performance.now(), true); },
    exitX: () => xOut,
    playIntro,
    skipIntro: () => { intro = false; t0 = performance.now() - 1e6; h1.classList.add("ready"); introTween?.progress(1); },
    destroy() {
      tl?.kill(); introTween?.kill();
      sky.removeEventListener("pointermove", onMove); sky.removeEventListener("pointerleave", onLeave);
    },
  };
}
