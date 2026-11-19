// The opening flight. One pinned stage holds a dotted world map (canvas) and the gold line (SVG) under one camera.
// At rest it is the hero: the map with three lines that fly from Europe to America, each time between new cities, the headline, and the "Beck" signature writing itself.
// As the page scrolls, the signature unwinds into the line, the line rises to Budapest, the camera closes in and
// rides the line across the Atlantic while three statements appear, and it pulls back out over America, where the
// "why" block lands and the line drops off the bottom of the stage to carry on down the page.

import gsap from "gsap";
import { WORLD_D, WORLD_DOTS } from "@/lib/data/world";
import { SIG_H, SIG_STROKES, SIG_W } from "@/lib/data/signature";
import { clamp, dashWindow, easeOut3, lerp, mapPath, type Pt, expoInOut, expoOut, quad, smoothPath, splitWords, sstep, strokePaths, tangentPath } from "./util";

// Map units, as in lib/data/world.ts.
const K = Math.cos((44 * Math.PI) / 180);
const geo = (lon: number, lat: number): Pt => [(lon + 128) * K, 84 - lat];
const CITIES: Record<string, Pt> = {
  budapest: geo(19.04, 47.5), london: geo(-0.13, 51.51), paris: geo(2.35, 48.86), berlin: geo(13.4, 52.52), vienna: geo(16.37, 48.21),
  chicago: geo(-87.63, 41.88), newyork: geo(-74.01, 40.71), orlando: geo(-81.38, 28.54), lasvegas: geo(-115.14, 36.17),
};
// The hero's three lines each fly from a European city to an American one, then make way for a new pair, never the same
// pair twice in a row and never a city another line is using. HUBS are the possible ends; only CITIES warm the dots.
const HUBS: Record<string, Pt> = {
  ...CITIES, prague: geo(14.42, 50.08), warsaw: geo(21.01, 52.23), milan: geo(9.19, 45.46), madrid: geo(-3.7, 40.42),
  boston: geo(-71.06, 42.36), atlanta: geo(-84.39, 33.75), dallas: geo(-96.8, 32.78), losangeles: geo(-118.24, 34.05), denver: geo(-104.99, 39.74),
};
const EU = ["budapest", "london", "paris", "berlin", "vienna", "prague", "warsaw", "milan", "madrid"];
const US = ["chicago", "newyork", "orlando", "lasvegas", "boston", "atlanta", "dallas", "losangeles", "denver"];
const STILL_PAIRS: [string, string][] = [["budapest", "chicago"], ["london", "orlando"], ["vienna", "lasvegas"]];
const LANES = 3, GROW = 2600, HOLD = 600, SHRINK = 2200, GAP = 200;   // ms: the line draws across, rests, its tail follows it home, then a short pause
// The lines run on one fixed cycle, a third of a cycle apart, so a line is always moving somewhere on the map.
const CYCLE = GROW + HOLD + SHRINK + GAP;
// On scroll: each line takes RUN_ONE ms to fly on into its end city, and they leave RUN_GAP ms apart.
const RUN_ONE = 1300, RUN_GAP = 260, RUN_ALL = RUN_ONE + RUN_GAP * (LANES - 1);
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
const BAND = "(max-width:700px), (max-aspect-ratio: 21/20)";
// On phones and tall windows the empty mid-Atlantic between Newfoundland and Ireland (map units 56 to 82) is taken out,
// so America's east coast and Western Europe sit side by side and the dots fill a portrait screen top to bottom.
const CUT: Pt = [56, 82];   // phones and tall windows: the map is a band across the middle

const DOT = [45, 43, 40], NEAR = [70, 62, 51], WARM = [156, 126, 82], HOT = [235, 211, 166];
const mix = (a: number[], b: number[], t: number) => `rgb(${a.map((v, i) => Math.round(lerp(v, b[i], t))).join(",")})`;
const DOT_FILL = mix(DOT, DOT, 0), NEAR_FILL = mix(NEAR, NEAR, 0);
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

/** still: the visitor asked for reduced motion; nothing is animated and no text is hidden. */
export function createFlight(root: HTMLElement, still = false): Flight {
  const q = <E extends Element>(s: string) => root.querySelector(s) as E;
  const sky = q<HTMLElement>(".flight-sky"), canvas = q<HTMLCanvasElement>(".flight-map");
  const svg = q<SVGSVGElement>(".flight-line"), glow = q<SVGPathElement>(".t-glow"), core = q<SVGPathElement>(".t-core");
  const sigG = q<SVGGElement>(".t-sig"), head = q<SVGGElement>(".t-head");
  const h1 = q<HTMLElement>("h1"), cue = q<HTMLElement>(".cue"), land = q<HTMLElement>(".flight-land");
  const says = [...root.querySelectorAll<HTMLElement>(".say")];
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
  type Lane = { a: string; b: string; pts: Pt[]; cum: number[]; len: number; at: number };
  const lanes: Lane[] = [];
  let segs: ReturnType<typeof strokePaths> = [], Lsig = 0;
  let fadeMask = (k: number, top: number, bot: number) => String(k + top + bot), maskK = "";
  // phones: on the first screen the map is zoomed in to fill the screen top to bottom (HZ, about the point hf), and it
  // eases out to the whole Atlantic as the visitor starts to scroll, before the line sets off
  let HZ = 1, hf: Pt = [0, 0], cut = false;
  // map x with the phone cut applied (NaN inside the cut: those dots are not drawn)
  const tx = (mx: number) => (!cut || mx <= CUT[0] ? mx : mx >= CUT[1] ? mx - (CUT[1] - CUT[0]) : NaN);
  const tp = (p: Pt): Pt => [tx(p[0]), p[1]];
  const cityA: Record<string, number> = {};               // how lit each city is on screen, so it can fade out gently
  let frozenAt: number | null = null, runT = 0;          // runT: ms into the lines' run to their end cities (see RUN)
  let L = 0, LB = 0, LU = 0, xOut = 0, anchor: Pt = [0, 0];
  const mp = (mx: number, my: number): Pt => [offX + (mx + 3) * s, offY + (my + 1) * s];

  // scroll-linked timeline for everything that is ordinary DOM (headline, statements, the landing block)
  const state = { dim: 1 };
  let tl: gsap.core.Timeline | null = null;
  function timeline() {
    tl?.kill();
    gsap.set([h1, cue, land, ...says], { clearProps: "all" });
    state.dim = 1;
    const t = gsap.timeline({ paused: true, defaults: { ease: "none" } });
    t.to(h1, { yPercent: -40, autoAlpha: 0, duration: T.heroOut - 0.01, ease: "expo.in" }, 0.004);
    t.to(cue, { autoAlpha: 0, duration: 0.03 }, 0);
    says.forEach((el, i) => {
      const at = T.says[i], w = splitWords(el);
      t.fromTo(el, { autoAlpha: 0, y: 0 }, { autoAlpha: 1, duration: 0.004 }, at);
      t.fromTo(w, { yPercent: 118 }, { yPercent: 0, duration: 0.05, stagger: 0.014, ease: "expo.out" }, at);
      t.to(el, { autoAlpha: 0, y: -36, duration: 0.035, ease: "expo.in" }, at + 0.115);
    });
    const lines = splitWords(land.querySelector("h2")!);
    t.fromTo(land, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.004 }, T.land);
    t.fromTo(lines, { yPercent: 118 }, { yPercent: 0, duration: 0.07, stagger: 0.005, ease: "expo.out" }, T.land + 0.005);
    t.to(state, { dim: band ? 0.3 : 0.55, duration: 0.09 }, T.land - 0.01);
    t.set({}, {}, 1);
    tl = t;
  }

  function layout() {
    W = sky.clientWidth; H = sky.clientHeight; dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    band = matchMedia(BAND).matches;
    if (cut !== band) { cut = band; lanes.length = 0; }        // the hero lines are rebuilt on the right map
    // phones and tall windows: once scrolled, the map fills the width, America to Europe (map units 4 to 88 after the
    // cut), and sits behind the headline as on a desktop, with the North Atlantic at the headline's height
    if (band) { s = W / 84; offX = -7 * s; offY = H * 0.44 - 40 * s; Z = 4.6; rClose = 3.2; }
    else { s = Math.max(W / 124, H / 84); offX = (W - 124 * s) / 2; offY = 0; Z = 3.4; rClose = 5.2; }
    r0 = 0.34 * s; rClose = Math.max(rClose, r0);
    for (let i = 0; i < n; i++) { const p = mp(tx(dots[i].mx), dots[i].my); X[i] = p[0]; Y[i] = p[1]; }
    // the map fades into the page at its edges while the camera is wide
    const mh = 84 * s;
    // (a mask, not a dark overlay, so the page's own background shows through and there is no seam with the next section)
    // top/bot: where the map's top and bottom edges are on screen (they move while the phone hero zooms out)
    fadeMask = (k: number, top: number, bot: number) => {
      const o = `rgba(0,0,0,${k.toFixed(2)})`, h = bot - top;
      return band
        ? `linear-gradient(180deg, ${o} 0, ${o} ${top.toFixed(0)}px, #000 ${(top + h * 0.22).toFixed(0)}px, #000 ${(top + h * 0.78).toFixed(0)}px, ${o} ${bot.toFixed(0)}px, ${o} 100%)`
        : `linear-gradient(180deg, #000 60%, ${o} 98%)`;
    };
    maskK = "";
    // zoom that makes the map's height a little more than the screen's, centred between New York and London (map unit
    // 52 once the mid-Atlantic is cut out) and on the map's middle latitude
    HZ = band ? Math.max(1, (H / mh) * 1.08) : 1;
    if (HZ > 1) { const c = mp(52, 41); hf = [(W / 2 - c[0] * HZ) / (1 - HZ), (H / 2 - c[1] * HZ) / (1 - HZ)]; }

    // the main route, sampled
    const arc = (from: string, to: string, lift: number, steps: number) => {
      const a = tp(CITIES[from]), b = tp(CITIES[to]), c: Pt = [(a[0] + b[0]) / 2, Math.min(a[1], b[1]) - lift];
      return Array.from({ length: steps + 1 }, (_, i) => { const m = quad(a, c, b, i / steps); return mp(m[0], m[1]); });
    };

    // the signature, bottom centre
    const sw = Math.min(250, W * 0.4), k = sw / SIG_W, ox = W / 2 - sw / 2, oy = H - SIG_H * k - (W < 700 ? W * 0.05 : 70);
    segs = strokePaths(sigG, SIG_STROKES.map((d) => mapPath(d, (x, y) => [ox + x * k, oy + y * k])));
    Lsig = segs.reduce((a, g) => a + g.len, 0);
    const start: Pt = [ox + 842 * k, oy + 292 * k];

    // the line: signature tail -> Budapest -> (the Budapest-Chicago route) -> Chicago -> off the bottom edge
    // It joins and leaves the route along the route's own direction, so there is no elbow at either city.
    const cF = tp(CITIES[FROM]), cT = tp(CITIES[TO]), B = mp(...cF), U = mp(...cT);
    const ctrl = mp((cF[0] + cT[0]) / 2, Math.min(cF[1], cT[1]) - LIFT);
    const unit = (a: Pt, b: Pt): Pt => { const d = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; return [(b[0] - a[0]) / d, (b[1] - a[1]) / d]; };
    const d0 = unit(B, ctrl), d1 = unit(ctrl, U);
    const post: Pt = [U[0] + d1[0] * 0.05 * W, U[1] + d1[1] * 0.05 * W];
    // Out of the signature's tail the line runs east, then turns up and round into the route on one arc, as wide as
    // the space between the signature and Budapest allows.
    const phi = Math.atan2(-d0[1], d0[0]), arcH = (a: number, r: number) => (4 / 3) * Math.tan(a / 4) * r;
    const R = Math.max(0.1 * W, Math.min((start[1] - B[1]) / (1 - Math.cos(phi)), (W - 12 - B[0]) / (1 - Math.sin(phi))));
    const C: Pt = [B[0] - R * Math.sin(phi), B[1] - R * Math.cos(phi)], A: Pt = [C[0], C[1] + R], hA = arcH(phi / 2, R);
    const M: Pt = [C[0] + R * Math.sin(phi / 2), C[1] + R * Math.cos(phi / 2)], run = Math.hypot(A[0] - start[0], A[1] - start[1]) * 0.45;
    const lead = tangentPath([{ p: start, d: [1, 0], out: run }, { p: A, d: [1, 0], in: run, out: hA },
      { p: M, d: [Math.cos(phi / 2), -Math.sin(phi / 2)], in: hA, out: hA }, { p: B, d: d0, in: hA }]);
    const pts: Pt[] = [...arc(FROM, TO, LIFT, 26), post];
    // From Chicago it keeps turning the way it is already heading, on one long arc, until it points straight down and
    // leaves the stage, where the page's line picks it up.
    const down = H + 2 - post[1], psi = Math.max(0.05, Math.atan2(-d1[0], d1[1])), hE = arcH(psi, down / Math.sin(psi));
    xOut = Math.max(20, post[0] - down * Math.tan(psi / 2));
    const exit = tangentPath([{ p: post, d: d1, out: hE }, { p: [xOut, H + 2], d: [0, 1], in: hE }]);
    const route = smoothPath(pts), d = lead + route.slice(route.indexOf(" C")) + exit.slice(exit.indexOf(" C"));
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
    if (!still) timeline();
  }

  // how much of the line is drawn at progress p
  const lineAt = (p: number) => {
    const kf: Pt[] = [[0, 0], [T.atOrigin, LB], [T.zoomOut[0], LU], [T.land, LU + 0.12 * (L - LU)], [1, L]];
    for (let i = 1; i < kf.length; i++) if (p <= kf[i][0]) {
      const t = (p - kf[i - 1][0]) / (kf[i][0] - kf[i - 1][0]);
      return lerp(kf[i - 1][1], kf[i][1], i === 2 ? lerp(t, expoInOut(t), 0.45) : i === 4 ? expoOut(t) : t);   // the crossing gathers speed and settles; the exit darts off
    }
    return L;
  };

  // opening animation clock
  let t0 = performance.now(), intro = true, pointer: Pt | null = null, lastNow = 0, headPt: Pt = [0, 0];
  const onMove = (e: PointerEvent) => { const r = sky.getBoundingClientRect(); pointer = [e.clientX - r.left, e.clientY - r.top]; };
  const onLeave = () => { pointer = null; };
  if (hover) { sky.addEventListener("pointermove", onMove, { passive: true }); sky.addEventListener("pointerleave", onLeave); }

  // a curve between two hubs, in map units, rising higher the further it flies
  function lane(a: string, b: string, at: number): Lane {
    const A = tp(HUBS[a]), B = tp(HUBS[b]), dx = Math.abs(A[0] - B[0]), C: Pt = [(A[0] + B[0]) / 2, Math.min(A[1], B[1]) - (0.3 + 0.08 * Math.random()) * dx];
    const pts = Array.from({ length: 49 }, (_, i) => quad(A, C, B, i / 48));
    const cum = [0]; for (let j = 1; j < pts.length; j++) cum.push(cum[j - 1] + Math.hypot(pts[j][0] - pts[j - 1][0], pts[j][1] - pts[j - 1][1]));
    return { a, b, pts, cum, len: cum[cum.length - 1], at };
  }
  function pick(prev?: Lane): [string, string] {
    const busy = new Set(lanes.filter((l) => l !== prev).flatMap((l) => [l.a, l.b]));
    const free = (list: string[]) => list.filter((c) => !busy.has(c) && c !== prev?.a && c !== prev?.b);
    const eu = free(EU), us = free(US);
    return [eu[Math.floor(Math.random() * eu.length)], us[Math.floor(Math.random() * us.length)]];
  }
  // keeps three lines in the air, each starting over somewhere new once its tail has gone
  function tend(el: number, still: boolean) {
    if (!lanes.length) {
      if (still) { STILL_PAIRS.forEach(([a, b]) => lanes.push(lane(a, b, 0))); return; }
      for (let i = 0; i < LANES; i++) { const [a, b] = pick(); lanes.push(lane(a, b, (i * CYCLE) / LANES)); }
      return;
    }
    if (still) return;
    lanes.forEach((ln, i) => { if (el > ln.at + CYCLE) { const [a, b] = pick(ln); lanes[i] = lane(a, b, ln.at + CYCLE * Math.max(1, Math.floor((el - ln.at) / CYCLE))); } });
  }

  function draw(p: number, now: number, still: boolean) {
    const dt = Math.min(64, now - lastNow || 16); lastNow = now;
    const el = still ? 1e7 : now - t0;
    if (intro && p > 0.02) intro = false;                                   // scrolling ends the opening early
    const e3 = easeOut3, written = intro ? expoInOut(clamp((el - 500) / 1700)) : 1;   // the signature writes itself: slow, fast, slower
    if (intro && written >= 1) intro = false;

    // camera
    const span = (a: readonly [number, number]) => clamp((p - a[0]) / (a[1] - a[0]));
    const zc = expoOut(span(T.zoomIn)) * (1 - expoInOut(span(T.zoomOut)));        // closes in fast and settles; pulls back slow, fast, slower
    const z = 1 + (Z - 1) * zc, len = still ? 0 : lineAt(p);
    if (len > 0) { const hp = core.getPointAtLength(len); headPt = [hp.x, hp.y]; }
    // the head of the line glides from where it sits in the wide shot to the anchor as the camera closes in, so it never leaves the screen
    const ax = lerp(headPt[0], anchor[0], zc), ay = lerp(headPt[1], anchor[1], zc);
    const cx = headPt[0] - (ax - W / 2) / z, cy = headPt[1] - (ay - H / 2) / z;
    // the map canvas also carries the phone hero's zoom (zh), which eases out (slow, fast, slower) over the first bit of scroll
    const zh = HZ > 1 && !still ? lerp(HZ, 1, expoInOut(clamp(p / 0.06))) : HZ;
    const sx = (x: number) => ((x - cx) * z + W / 2 - hf[0]) * zh + hf[0], sy = (y: number) => ((y - cy) * z + H / 2 - hf[1]) * zh + hf[1];

    // the line and the signature
    svg.setAttribute("viewBox", `${(cx - W / (2 * z)).toFixed(2)} ${(cy - H / (2 * z)).toFixed(2)} ${(W / z).toFixed(2)} ${(H / z).toFixed(2)}`);
    const sigFrom = Lsig * sstep(0, T.heroOut, p), sigTo = Lsig * written;
    for (const g of segs) dashWindow(g.els, g.len, clamp(sigFrom - g.off, 0, g.len), clamp(sigTo - g.off, 0, g.len));
    dashWindow([core, glow], L, Math.min(len, LB * sstep(T.zoomIn[0] + 0.03, T.zoomIn[1] + 0.05, p)), len);   // the first leg retracts to Budapest once the camera is close
    // the line thickens as the camera closes in, but only so far
    const thick = Math.min(z, band ? 2.2 : 3.2) / z;
    core.style.strokeWidth = (1.8 * thick).toFixed(3); glow.style.strokeWidth = (6 * thick).toFixed(3);
    head.classList.toggle("on", len > 2 && len < L - 2);
    if (len > 0) head.setAttribute("transform", `translate(${headPt[0].toFixed(1)} ${headPt[1].toFixed(1)}) scale(${thick.toFixed(3)})`);
    const top = sy(offY), bot = sy(offY + 84 * s), mk = `${Math.round(zc * 50)} ${Math.round(top)} ${Math.round(bot)}`;
    if (mk !== maskK) { maskK = mk; const m = fadeMask(Math.round(zc * 50) / 50, top, bot); canvas.style.maskImage = m; canvas.style.webkitMaskImage = m; }

    // heat: dots near the pointer (wide shot) and near the head of the line warm up, then cool
    const cool = Math.exp(-dt / 420);
    const pw: Pt | null = pointer && zc < 0.05 ? [((pointer[0] - hf[0]) / zh + hf[0] - W / 2) / z + cx, ((pointer[1] - hf[1]) / zh + hf[1] - H / 2) / z + cy] : null;
    const Rp = 5.5 * s, Rh = (band ? 5 : 3.6) * s, lineOn = len > 4 && p < 0.985;
    const rs = lerp(r0, rClose, zc) * zh, pad = rs + 2;
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
    const put = (i: number) => { const px = sx(X[i]), py = sy(Y[i]); if (square) ctx.rect(Math.round((px - rs) * dpr) / dpr, Math.round((py - rs) * dpr) / dpr, rs * 2, rs * 2); /* tiny dots snap to whole device pixels, so they do not shimmer as the camera moves */ else { ctx.moveTo(px + rs, py); ctx.arc(px, py, rs, 0, 6.2832); } };
    ctx.fillStyle = DOT_FILL; ctx.beginPath(); for (const i of vis) if (!heat[i] && !dots[i].near) put(i); ctx.fill();
    ctx.fillStyle = NEAR_FILL; ctx.beginPath(); for (const i of vis) if (!heat[i] && dots[i].near) put(i); ctx.fill();
    for (let b = 0; b < HEAT_FILL.length; b++) {
      const lo = b / HEAT_FILL.length, hi = (b + 1) / HEAT_FILL.length;
      ctx.fillStyle = HEAT_FILL[b]; ctx.beginPath();
      for (const i of vis) if (heat[i] > lo && heat[i] <= hi + (b === HEAT_FILL.length - 1 ? 1 : 0)) put(i);
      ctx.fill();
    }

    // the hero's lines and their cities, then only the two ends of our route
    const ra = 1 - sstep(0.05, T.heroOut, p), comets: { x: number; y: number; o: number }[] = [];
    const glowAt = (x: number, y: number, r: number, a: number) => { if (a > 0.01) { ctx.globalAlpha = a; ctx.drawImage(sprite, x - r, y - r, r * 2, r * 2); } };
    const lit: Record<string, number> = {};
    // Once the visitor scrolls, the lines run on to their end cities one after another, in time rather than tied to the
    // scroll, so each keeps its own graceful pace however fast the page moves. A run that has started always finishes (it never
    // runs backwards); back at the top the lines simply start their usual flights again, a third of a cycle apart.
    if (!still && (p > 0.0005 || runT > 0)) runT = Math.min(RUN_ALL, runT + dt);
    const q = still ? 0 : runT / RUN_ALL;
    if (!still) {
      if (p > 0.0005 && frozenAt === null) frozenAt = el;
      else if (p <= 0.0005 && frozenAt !== null && runT >= RUN_ALL) {
        lanes.forEach((ln, i) => { const [a, b] = pick(ln); lanes[i] = lane(a, b, el + (i * CYCLE) / LANES); });
        frozenAt = null; runT = 0;
      }
    }
    const tNow = frozenAt ?? el;
    const left = (ln: Lane) => { const t = tNow - ln.at; return t < 0 ? 2 : 1 - expoOut(clamp(t / GROW)) + (t > GROW + HOLD ? -1 : 0); };   // tails already leaving go first
    const order = [...lanes].sort((x, y) => left(x) - left(y)), rank = (ln: Lane) => order.indexOf(ln);
    if (q < 1) {
      if (frozenAt === null) tend(el, still);
      ctx.lineCap = "round"; ctx.lineWidth = Math.max(1, 0.3 * s); ctx.strokeStyle = "#F0D9AE";
      for (const ln of lanes) {
        const t = tNow - ln.at; if (t < 0 && q === 0) continue;
        const u = clamp((runT - rank(ln) * RUN_GAP) / RUN_ONE);      // this line's own share of the run, 0..1
        // head: fast, then slower; tail: slow, fast, slower
        // On scroll each line runs on to its end city: the head finishes its flight first, then the tail follows it in,
        // so every line ends in America (slow, fast, slower). Lines that had not left yet fly the whole way.
        const qh = expoInOut(clamp(u / 0.62)), qt = expoInOut(clamp((u - 0.38) / 0.62));
        const hd0 = still ? 1 : t < 0 ? 0 : expoOut(clamp(t / GROW)), tl00 = still || t < 0 ? 0 : expoInOut(clamp((t - GROW - HOLD) / SHRINK));
        const hd = hd0 + (1 - hd0) * qh, tl0 = tl00 + (1 - tl00) * qt;
        const from = ln.len * tl0, upto = ln.len * hd;
        const at = (d: number): Pt => { let j = 1; while (j < ln.cum.length - 1 && ln.cum[j] < d) j++; const k = (d - ln.cum[j - 1]) / (ln.cum[j] - ln.cum[j - 1] || 1); const m = mp(lerp(ln.pts[j - 1][0], ln.pts[j][0], k), lerp(ln.pts[j - 1][1], ln.pts[j][1], k)); return [sx(m[0]), sy(m[1])]; };
        if (upto - from > 0.01) {
          ctx.globalAlpha = 0.7 * fade * state.dim * (1 - sstep(T.heroOut, T.heroOut + 0.04, p)); ctx.beginPath();   // a quick scroll past the hero fades any line still in flight
          const a0 = at(from); ctx.moveTo(a0[0], a0[1]);
          for (let j = 1; j < ln.pts.length; j++) if (ln.cum[j] > from && ln.cum[j] < upto) { const m = mp(ln.pts[j][0], ln.pts[j][1]); ctx.lineTo(sx(m[0]), sy(m[1])); }
          const a1 = at(upto); ctx.lineTo(a1[0], a1[1]); ctx.stroke();
          if (q === 0 && hd < 1 && t >= 0) comets.push({ x: a1[0], y: a1[1], o: Math.sin(hd * Math.PI) });
        }
        // the cities: the origin as the line leaves it, the destination as the line arrives; the origin goes with the
        // tail, and while scrolling the destination stays lit as the line runs into it
        const out = 1 - tl0;
        if (t >= 0) lit[ln.a] = Math.max(lit[ln.a] ?? 0, Math.min(e3(clamp(t / 500)), out));
        lit[ln.b] = Math.max(lit[ln.b] ?? 0, Math.min(sstep(0.86, 1, hd), u > 0 ? 1 : out));
      }
    }
    Object.entries(HUBS).forEach(([name, c], i) => {
      // a city lights straight away but goes out gently (fast, then slower, about 400ms), never all at once
      const want = Math.max((lit[name] ?? 0) * ra, name === FROM || name === TO ? sstep(0.03, T.heroOut, p) : 0) * fade * state.dim;
      const was = cityA[name] ?? 0, a = still || want >= was ? want : was + (want - was) * (1 - Math.exp(-dt / 130));
      cityA[name] = a;
      if (a < 0.01) return;
      const m = mp(...tp(c)), x = sx(m[0]), y = sy(m[1]), u = s * (1 + 0.5 * zc);
      glowAt(x, y, 2.6 * u, 0.8 * a);
      if (!still) {
        const k = ((el / 1000 + 4 - i * 0.5) % 4) / 4, e = e3(clamp(k / 0.7));
        ctx.globalAlpha = 0.8 * (1 - e) * a; ctx.strokeStyle = "#EBD3A6"; ctx.lineWidth = Math.max(0.6, 0.16 * s);
        ctx.beginPath(); ctx.arc(x, y, u * lerp(0.4, 2.6, e), 0, 6.2832); ctx.stroke();
      }
      ctx.globalAlpha = a; ctx.fillStyle = "#EBD3A6"; ctx.beginPath(); ctx.arc(x, y, 0.55 * u, 0, 6.2832); ctx.fill();
    });
    ctx.globalAlpha = 1;

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
    introTween = gsap.fromTo(words, { yPercent: 118 }, { yPercent: 0, duration: 1.2, stagger: 0.09, ease: "expo.out", delay: 0.15, onComplete: () => { glyphAt = []; } });
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
