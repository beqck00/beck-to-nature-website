// The journey below the flight. The sections are not stacked in a column: each one sits somewhere on a wide dark
// "world", and one pinned stage looks at that world through a camera. The gold line picks up where the flight's line
// leaves the stage and strays across the world from section to section. As the page scrolls, the line runs off the
// edge of the screen, the camera pulls back and travels after it, and closes in again on the next section. Inside a
// section taller than the screen the camera simply moves down it, like ordinary scrolling. The line ends by writing
// the "Beck" signature, joining it at the B.

import { SIG_STROKES } from "@/lib/data/signature";
import { clamp, dashWindow, type Knot, lerp, mapPath, type Pt, splitWords, sstep, strokePaths, tangentPath } from "./util";

// Where each section sits relative to the one before it, in screens: how far across, and how far below its end.
const PLACES: Pt[] = [[1.25, 0.55], [1.25, 0.5], [-1.25, 0.5], [-1.25, 0.5]];
const TRAVEL = 0.95, DWELL = 0.6, LEAVE = 0.32;         // scroll distances, in screens: between sections, on a section that fits, the line running off
const PAD_TOP = 124, PAD_BOTTOM = 72;                   // room kept above (for the navigation) and below a section

// The signature in writing order: B bowls (from the lead-in on the far left), B stem, the two e's, k stem, k loop and tail.
const split = SIG_STROKES[3].indexOf(" C 664 256"), s3a = SIG_STROKES[3].slice(0, split), s3aEnd = s3a.match(/(-?\d+\.?\d*) (-?\d+\.?\d*)\s*$/)!;
const WRITING_ORDER = [SIG_STROKES[1], SIG_STROKES[0], s3a, SIG_STROKES[2], `M ${s3aEnd[1]} ${s3aEnd[2]}` + SIG_STROKES[3].slice(split)];

type Key = { u: number; cx: number; cy: number; len: number; ease: boolean; dip: number };

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
  let W = 0, H = 0, keys: Key[] = [], Lc = 0, Lt = 0, eSegs: ReturnType<typeof strokePaths> = [], lenIn = 0;
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
    const narrow = W < 700, w = Math.min(W, 1240);

    // place the sections
    let x = 0, y = 0;
    const at = scenes.map((el, i) => {
      x += PLACES[i][0] * W; y += PLACES[i][1] * H;
      el.style.width = `${w}px`; el.style.left = `${x + (W - w) / 2}px`; el.style.top = `${y}px`;
      const h = el.offsetHeight, top = y; y += h;
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
      { p: [W * 1.08, H * 0.62], d: E },                                          // off the right-hand side of the first screen
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

    // sample the line, to find where it enters and leaves each view and where it passes each section's own point
    const N = Math.ceil(Lc / 6), pts: Pt[] = [];
    for (let i = 0; i <= N; i++) { const p = core.getPointAtLength((Lc * i) / N); pts.push([p.x, p.y]); }
    const lenOf = (i: number) => (Lc * i) / N;
    const nearest = (p: Pt) => { let best = 0, bd = 1e12; pts.forEach((s, i) => { const dd = (s[0] - p[0]) ** 2 + (s[1] - p[1]) ** 2; if (dd < bd) { bd = dd; best = i; } }); return best; };
    const inside = (p: Pt, cx: number, cy: number, m: number) => Math.abs(p[0] - cx) < W / 2 + m && Math.abs(p[1] - cy) < H / 2 + m;
    const mids = [2, 4, 5, 6].map((k) => nearest(knots[k].p));          // specialties, founder (its lower point), inquiry, stories

    // the scroll script: for each stretch of scrolling, where the camera is and how much line is drawn
    keys = []; stops = [];
    let u = 0, i0 = nearest(knots[1].p);
    lenIn = lenOf(Math.round(i0 * 0.62));
    const key = (du: number, cx: number, cy: number, len: number, ease = false, dip = 0) => { u += du; keys.push({ u, cx, cy, len, ease, dip }); };
    let cx = W / 2, cy = H / 2;
    key(0, cx, cy, lenIn);
    key(LEAVE * H, cx, cy, lenOf(i0));                                   // the line runs off the first screen
    at.forEach((s, n) => {
      const last = n === at.length - 1, mid = mids[n];
      let iIn = mid; while (iIn > i0 && inside(pts[iIn], s.cx, s.cyA, -20)) iIn--;                   // where the line comes into this section's first view
      let iOut = mid; while (iOut < N && inside(pts[iOut], s.cx, s.cyB, 40)) iOut++;                 // where it leaves the last one
      const uT = u;
      key(TRAVEL * H, s.cx, s.cyA, lenOf(iIn), true, narrow ? 0.14 : 0.24);                             // travel: pull back, cross, close in
      const through = Math.max(DWELL * H, s.cyB - s.cyA), u0 = u;
      if (last) { key(through * 0.45, s.cx, lerp(s.cyA, s.cyB, 0.45), lenOf(mid)); key(through * 0.55, s.cx, s.cyB, Lt); }
      else { key(through, s.cx, s.cyB, lenOf(mid)); key(LEAVE * H, s.cx, s.cyB, lenOf(iOut)); }      // the line runs off the screen
      stops.push({ el: s.el, u0, u1: u0 + through, cyA: s.cyA, cyB: s.cyB, show: uT + TRAVEL * H * 0.5 });
      i0 = iOut; cx = s.cx; cy = s.cyB;
    });
    journey.style.height = `${Math.ceil(u + H)}px`;
  }

  // camera and line at scroll distance u
  function at(u: number) {
    if (u <= 0) return { cx: W / 2, cy: H / 2, z: 1, len: lenIn * sstep(-0.62 * H, 0, u) ** 1.4 };
    let i = 1; while (i < keys.length - 1 && u > keys[i].u) i++;
    const a = keys[i - 1], b = keys[i], t = clamp((u - a.u) / Math.max(1, b.u - a.u)), e = b.ease ? t * t * (3 - 2 * t) : t;
    return { cx: lerp(a.cx, b.cx, e), cy: lerp(a.cy, b.cy, e), z: 1 - b.dip * Math.sin(Math.PI * t) ** 2, len: lerp(a.len, b.len, b.ease ? Math.min(1, t * 1.25) : t) };
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

  function render(u: number) {
    const c = at(u);
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
