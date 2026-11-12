// The journey below the flight. The sections are not stacked in a column: each one sits somewhere on a wide dark
// "world", and one pinned stage looks at that world through a camera. The gold line picks up where the flight's line
// leaves the stage, comes down into the first section, and from there strays across the world from section to section.
// Leaving a section, the line darts out of frame; the camera closes in on it (fast, then slower), rides it, and pulls
// back out slowly as the next section arrives. Inside a section taller than the screen the camera simply moves down
// it, like ordinary scrolling. Nothing moves at a constant rate (see expoOut and expoInOut). The line ends by writing
// the "Beck" signature, joining it at the B.

import { SIG_STROKES } from "@/lib/data/signature";
import { clamp, dashWindow, expoInOut, expoOut, type Knot, lerp, mapPath, type Pt, splitWords, strokePaths, tangentPath } from "./util";

// Where each section sits relative to the one before it, in screens: how far across, and how far below its end.
// The first is straight under the flight, so the page simply scrolls into it. Kept close, so travel is never empty for long.
const PLACES: Pt[] = [[0, 0], [1.12, 0.3], [-1.12, 0.3], [-1.12, 0.3]];
const TRAVEL = 0.9, DWELL = 0.55;                       // scroll distances, in screens: between sections, and on a section that fits the screen
const CLOSE_IN = 0.36, PULL_BACK = 0.5;                 // the share of a travel spent closing in on the line, and the point from which the camera pulls back
const PAD_TOP = 124, PAD_BOTTOM = 72;                   // room kept above (for the navigation) and below a section

// The signature in writing order: B bowls (from the lead-in on the far left), B stem, the two e's, k stem, k loop and tail.
const split = SIG_STROKES[3].indexOf(" C 664 256"), s3a = SIG_STROKES[3].slice(0, split), s3aEnd = s3a.match(/(-?\d+\.?\d*) (-?\d+\.?\d*)\s*$/)!;
const WRITING_ORDER = [SIG_STROKES[1], SIG_STROKES[0], s3a, SIG_STROKES[2], `M ${s3aEnd[1]} ${s3aEnd[2]}` + SIG_STROKES[3].slice(split)];

// One stretch of scrolling: either on a section (the camera moves down it) or travelling between two.
type Seg = { u0: number; u1: number; travel: boolean; ax: number; ay: number; bx: number; by: number; l0: number; l1: number; l2?: number };

export type Journey = {
  /** Lay the world out for the current screen size. startX is where the flight's line leaves its stage. */
  build(startX: number): void;
  /** Draw one frame. u is how far the page has scrolled into the journey, in px (negative while the stage is still coming in). */
  render(u: number): void;
  /** How much line is drawn at u (0 when none). */
  drawn(u: number): number;
  /** The scroll distance into the journey at which an element is in view. */
  whereIs(el: Element): number | null;
  /** Without motion: stack the sections as a plain page and write the closing signature. */
  drawStill(): void;
};

export function createJourney(page: HTMLElement): Journey {
  const journey = page.querySelector<HTMLElement>(".journey")!, stage = journey.querySelector<HTMLElement>(".journey-stage")!, world = journey.querySelector<HTMLElement>(".world")!;
  const svg = world.querySelector<SVGSVGElement>(".thread")!, core = svg.querySelector<SVGPathElement>(".t-core")!, glow = svg.querySelector<SVGPathElement>(".t-glow")!;
  const head = svg.querySelector<SVGGElement>(".t-head")!, endG = svg.querySelector<SVGGElement>(".t-end")!, endSig = world.querySelector<HTMLElement>(".end-sig")!;
  const scenes = [...world.querySelectorAll<HTMLElement>(".scene")];
  const dots = stage.querySelector<HTMLCanvasElement>(".journey-dots")!, ctx = dots.getContext("2d")!;
  let dpr = 1;
  let W = 0, H = 0, segs: Seg[] = [], Lc = 0, Lt = 0, eSegs: ReturnType<typeof strokePaths> = [], lenIn = 0, zoom = 1.7;
  let trail: Pt[] = [], step = 1;
  let stops: { el: HTMLElement; u0: number; u1: number; cyA: number; cyB: number; show: number }[] = [];

  // an element's box in world coordinates (the world is laid out untransformed while this runs)
  const box = (el: Element) => {
    const a = el.getBoundingClientRect(), b = world.getBoundingClientRect();
    return { left: a.left - b.left, top: a.top - b.top, right: a.right - b.left, bottom: a.bottom - b.top, w: a.width, h: a.height, cx: a.left - b.left + a.width / 2, cy: a.top - b.top + a.height / 2 };
  };
  const q = (s: string) => world.querySelector<HTMLElement>(s)!;

  // the closing signature fitted into its box; returns the point where the line joins it and its strokes
  function signature() {
    const r = box(endSig), k = Math.min(r.w / 850, r.h / 380), ox = r.left + (r.w - 850 * k) / 2 - 10 * k, oy = r.top + (r.h - 380 * k) / 2 - 20 * k;
    const P = (x: number, y: number): Pt => [ox + x * k, oy + y * k];
    return { B: P(22, 182), bottom: oy + 386 * k, right: ox + 842 * k, strokes: WRITING_ORDER.map((d) => mapPath(d, P)) };
  }

  function prepare() {
    // words of each heading rise one after another; the other blocks ease up in order
    for (const sc of scenes) {
      sc.querySelectorAll("h2").forEach((h) => splitWords(h, "rise").forEach((w, i) => w.style.setProperty("--i", String(i))));
      sc.querySelectorAll<HTMLElement>("[data-r]").forEach((el, i) => el.style.setProperty("--i", String(i)));
    }
  }
  prepare();

  function build(startX: number) {
    world.style.transform = "none";
    W = stage.clientWidth; H = stage.clientHeight;
    dpr = Math.min(2, window.devicePixelRatio || 1); dots.width = Math.round(W * dpr); dots.height = Math.round(H * dpr);
    const narrow = W < 700, w = Math.min(W, 1240);

    // place the sections
    let x = 0, y = 0;
    const at = scenes.map((el, i) => {
      x += PLACES[i][0] * W; y += i ? PLACES[i][1] * H : PAD_TOP;
      el.style.width = `${w}px`; el.style.left = `${x + (W - w) / 2}px`;
      const h = el.offsetHeight;
      if (!i) y += Math.max(0, (H - PAD_TOP - PAD_BOTTOM - h) / 2);          // the first one starts in view: centred if it fits
      el.style.top = `${y}px`;
      const top = y; y += h;
      // the camera's first and last position on this section; one position when the section fits on the screen
      let cyA = top - PAD_TOP + H / 2, cyB = top + h + PAD_BOTTOM - H / 2;
      if (cyB < cyA) cyA = cyB = (cyA + cyB) / 2;
      return { el, cx: x + W / 2, cyA, cyB };
    });

    // the line: a few points it passes through in a set direction, joined by long curves
    const E: Pt = [0.97, 0.24], Wd: Pt = [-0.97, 0.24], DOWN: Pt = [0, 1], LEFT: Pt = [-1, 0], ARC = 0.5523;
    const sp = box(q("#specialties")), spHead = box(q("#specialties .sec-head")), trio = box(q(".trio"));
    const fo = box(q("#founder")), essay = box(q(".essay")), iqHead = box(q(".iq-head")), wiz = box(q("#wiz")), cases = box(q("#cases"));
    const pad = (W - w) / 2 + parseFloat(getComputedStyle(scenes[0]).paddingLeft);
    const knots: Knot[] = [
      { p: [startX, 0], d: DOWN },
      { p: [sp.cx, (spHead.bottom + trio.top) / 2], d: E },                       // across specialties, between the heading and the cards
      { p: [fo.right - pad - (fo.w - 2 * pad) * (narrow ? 0.02 : 0.07), essay.cy], d: DOWN },   // down the right of the founder's texts
      { p: [fo.cx, fo.bottom + (narrow ? 44 : 56)], d: LEFT },                    // and away to the left below them
      { p: [wiz.cx, (iqHead.bottom + wiz.top) / 2], d: Wd },                      // across the inquiry, above the form
      { p: narrow ? [W * 0.8, cases.top + cases.h * 0.45] : [cases.left + pad + (cases.w - 2 * pad) * 0.555, cases.cy], d: DOWN },   // between a story and its facts
    ];
    // the close: a wide turn to the left, a run under the signature, and a quarter turn up into the B's first stroke
    const eS = signature(), B = eS.B, under = eS.bottom + (narrow ? 36 : 52), rB = under - B[1];
    const rT = narrow ? 104 : clamp((under - knots[knots.length - 1].p[1]) * 0.5, 120, 260);
    const xr = Math.min(eS.right + 40 + rT, at[at.length - 1].cx + W / 2 - 24), up: Pt = [8 / 62.5, -62 / 62.5], run = Math.max(1, xr - rT - (B[0] + rB)) / 3;
    knots.push({ p: [xr, under - rT], d: DOWN, out: rT * ARC }, { p: [xr - rT, under], d: LEFT, in: rT * ARC, out: run },
      { p: [B[0] + rB, under], d: LEFT, in: run, out: rB * ARC }, { p: B, d: up, in: rB * ARC });
    const d = tangentPath(knots);
    core.setAttribute("d", d); glow.setAttribute("d", d);
    Lc = core.getTotalLength();
    eSegs = strokePaths(endG, eS.strokes);
    eSegs.forEach((g) => (g.off += Lc));
    Lt = Lc + eSegs.reduce((a, g) => a + g.len, 0);

    // sample the line, to find where it enters each view and where it passes each section's own point
    const N = Math.ceil(Lc / 6), pts: Pt[] = [];
    for (let i = 0; i <= N; i++) { const p = core.getPointAtLength((Lc * i) / N); pts.push([p.x, p.y]); }
    trail = pts; step = Lc / N; zoom = narrow ? 1.4 : 1.7;
    const lenOf = (i: number) => (Lc * i) / N;
    const nearest = (p: Pt) => { let best = 0, bd = 1e12; pts.forEach((s, i) => { const dd = (s[0] - p[0]) ** 2 + (s[1] - p[1]) ** 2; if (dd < bd) { bd = dd; best = i; } }); return best; };
    const inside = (p: Pt, cx: number, cy: number) => Math.abs(p[0] - cx) < W / 2 - 20 && Math.abs(p[1] - cy) < H / 2 - 20;
    const mids = [1, 3, 4, 5].map((k) => nearest(knots[k].p));          // specialties, founder (its lower point), inquiry, stories

    // the scroll script
    segs = []; stops = [];
    let u = 0;
    lenIn = lenOf(Math.round(mids[0] * 0.5));                            // drawn while the stage is still scrolling in
    at.forEach((s, n) => {
      const last = n === at.length - 1, mid = mids[n];
      let from = lenIn, show = -0.6 * H;
      if (n) {
        // travel: the line darts ahead into the next section's first view; the camera closes in on it, rides it, and pulls back
        const p = at[n - 1];
        let iIn = mid; while (iIn > mids[n - 1] && inside(pts[iIn], s.cx, s.cyA)) iIn--;
        from = lenOf(Math.round(lerp(iIn, mid, 0.5)));
        segs.push({ u0: u, u1: u + TRAVEL * H, travel: true, ax: p.cx, ay: p.cyB, bx: s.cx, by: s.cyA, l0: lenOf(mids[n - 1]), l1: from });
        show = u + TRAVEL * H * 0.55; u += TRAVEL * H;
      }
      const through = Math.max(DWELL * H, s.cyB - s.cyA);
      segs.push({ u0: u, u1: u + through, travel: false, ax: s.cx, ay: s.cyA, bx: s.cx, by: s.cyB, l0: from, l1: lenOf(mid), l2: last ? Lt : undefined });
      stops.push({ el: s.el, u0: u, u1: u + through, cyA: s.cyA, cyB: s.cyB, show });
      u += through;
    });
    journey.style.height = `${Math.ceil(u + H)}px`;
  }

  const pointAt = (len: number): Pt => {
    const f = clamp(len / step, 0, trail.length - 1), i = Math.min(trail.length - 2, Math.floor(f)), t = f - i;
    return [lerp(trail[i][0], trail[i + 1][0], t), lerp(trail[i][1], trail[i + 1][1], t)];
  };

  // camera and line at scroll distance u
  function at(u: number) {
    const s0 = segs[0];
    if (u <= 0) return { cx: s0.ax, cy: s0.ay, z: 1, len: lenIn * expoInOut(clamp(1 + u / (0.7 * H))) };
    let i = 0; while (i < segs.length - 1 && u > segs[i].u1) i++;
    const s = segs[i], t = clamp((u - s.u0) / Math.max(1, s.u1 - s.u0));
    if (!s.travel) {
      // on a section: the camera moves down it with the scroll; the line draws on, fast at first and then settling.
      // On the last one it reaches its point half-way and then writes the signature.
      const len = s.l2 === undefined ? lerp(s.l0, s.l1, expoOut(t)) : t < 0.45 ? lerp(s.l0, s.l1, expoOut(t / 0.45)) : lerp(s.l1, s.l2, expoInOut((t - 0.45) / 0.55));
      return { cx: s.ax, cy: lerp(s.ay, s.by, t), z: 1, len };
    }
    // travelling: the line leaves first; the camera closes in on its head (fast, then slower), rides it, and lets go
    // again as it pulls back to the next section (slow, fast, slower)
    const len = lerp(s.l0, s.l1, expoOut(t * 0.85)), hd = pointAt(len), e = expoInOut(t);
    const ride = t < CLOSE_IN ? expoOut(t / CLOSE_IN) : t < PULL_BACK ? 1 : 1 - expoInOut((t - PULL_BACK) / (1 - PULL_BACK));
    return { cx: lerp(lerp(s.ax, s.bx, e), hd[0], ride), cy: lerp(lerp(s.ay, s.by, e), hd[1], ride), z: 1 + (zoom - 1) * ride, len };
  }

  function paintLine(len: number) {
    const th = clamp(len, 0, Lt);
    dashWindow([core, glow], Lc, 0, Math.min(th, Lc));
    for (const g of eSegs) dashWindow(g.els, g.len, 0, clamp(th - g.off, 0, g.len));
    head.classList.toggle("on", th > 2 && th < Lt - 2);
    if (th > 0) {
      const g = th <= Lc ? null : eSegs.find((s) => th <= s.off + s.len) ?? eSegs[eSegs.length - 1];
      const p = g ? g.els[1].getPointAtLength(clamp(th - g.off, 0, g.len)) : core.getPointAtLength(th);
      head.setAttribute("transform", `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`);
    }
  }

  // The ground the line travels over: the same dotted field as the hero's map, barely there behind a section,
  // clearer while travelling, and warm where the line's head is passing.
  const GRID = 30;
  function paintDots(c: { cx: number; cy: number; z: number; len: number }) {
    const ride = (c.z - 1) / (zoom - 1), hd = c.len > 2 && c.len < Lc ? pointAt(c.len) : null, reach = 190;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
    const x0 = c.cx - W / 2 / c.z, y0 = c.cy - H / 2 / c.z, r = 1.5 * c.z;
    for (let gy = Math.floor(y0 / GRID) * GRID; gy < y0 + H / c.z + GRID; gy += GRID) {
      for (let gx = Math.floor(x0 / GRID) * GRID; gx < x0 + W / c.z + GRID; gx += GRID) {
        const near = hd ? Math.max(0, 1 - Math.hypot(gx - hd[0], gy - hd[1]) / reach) : 0, a = 0.05 + 0.1 * ride + 0.55 * near * near;
        ctx.fillStyle = `rgba(${near > 0.05 ? "235,211,166" : "150,140,124"},${a.toFixed(3)})`;
        const px = (gx - x0) * c.z, py = (gy - y0) * c.z, rr = r * (1 + 0.6 * near);
        ctx.beginPath(); ctx.arc(px, py, rr, 0, 6.2832); ctx.fill();
      }
    }
  }

  function render(u: number) {
    const c = at(u);
    paintDots(c);
    world.style.transform = `translate(${(W / 2 - c.cx * c.z).toFixed(2)}px, ${(H / 2 - c.cy * c.z).toFixed(2)}px) scale(${c.z.toFixed(4)})`;
    paintLine(c.len);
    for (const s of stops) s.el.classList.toggle("in", u >= s.show);
  }

  function whereIs(el: Element) {
    const s = stops.find((o) => o.el.contains(el));
    if (!s) return null;
    if (el === s.el || s.cyB - s.cyA < 1) return s.u0 + 2;
    // how far down the section the element is, measured on the untransformed world
    const t = world.style.transform; world.style.transform = "none";
    const b = box(el); world.style.transform = t;
    return s.u0 + 2 + clamp((b.top - PAD_TOP + H / 2 - s.cyA) / (s.cyB - s.cyA)) * (s.u1 - s.u0 - 4);
  }

  function drawStill() {
    journey.style.height = ""; world.style.transform = "";
    for (const el of scenes) { el.style.width = el.style.left = el.style.top = ""; }
    core.removeAttribute("d"); glow.removeAttribute("d"); head.classList.remove("on");
    const eS = signature(), segs = strokePaths(endG, eS.strokes);
    for (const g of segs) dashWindow(g.els, g.len, 0, g.len);
  }

  return { build, render, drawn: (u) => at(u).len, whereIs, drawStill };
}
