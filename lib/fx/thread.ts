// The gold line below the flight. It picks up where the flight's line leaves the stage, runs down the page as one
// smooth stroke, lights each element as its head passes (and dims it again on the way back up), and ends by writing
// the "Beck" signature at the bottom left, joining it at the B. Each section rises in as it scrolls into view. The route is built from tangents (see tangentPath), so it
// has no corners and no tight turns.

import { SIG_STROKES } from "@/lib/data/signature";
import { clamp, dashWindow, type Knot, mapPath, type Pt, splitWords, strokePaths, tangentPath } from "./util";


// The signature in writing order: B bowls (from the lead-in on the far left), B stem, the two e's, k stem, k loop and tail.
const split = SIG_STROKES[3].indexOf(" C 664 256"), s3a = SIG_STROKES[3].slice(0, split), s3aEnd = s3a.match(/(-?\d+\.?\d*) (-?\d+\.?\d*)\s*$/)!;
const WRITING_ORDER = [SIG_STROKES[1], SIG_STROKES[0], s3a, SIG_STROKES[2], `M ${s3aEnd[1]} ${s3aEnd[2]}` + SIG_STROKES[3].slice(split)];

export type Thread = {
  /** Lay the line out for the current page size. startX is where the flight's line leaves its stage. */
  build(startX: number): void;
  /** How much of the line should be drawn for the current scroll position. */
  target(): number;
  /** Draw the line up to length h. */
  paint(h: number): void;
  total(): number;
  /** Stop watching the sections. */
  destroy(): void;
};

export function createThread(page: HTMLElement): Thread {
  const svg = page.querySelector<SVGSVGElement>(".thread")!, core = svg.querySelector<SVGPathElement>(".t-core")!, glow = svg.querySelector<SVGPathElement>(".t-glow")!;
  const head = svg.querySelector<SVGGElement>(".t-head")!, endG = svg.querySelector<SVGGElement>(".t-end")!;
  const flight = page.querySelector<HTMLElement>(".flight")!, endSig = page.querySelector<HTMLElement>(".end-sig")!;
  let eSegs: ReturnType<typeof strokePaths> = [], Lc = 0, Lt = 0, samples: { l: number; y: number }[] = [];

  // sections rise in as they come into view (headings word by word, then their blocks), and go back when scrolled past upwards
  const scenes = [...page.querySelectorAll<HTMLElement>(".scene")];
  scenes.forEach((sc) => {
    sc.querySelectorAll("h2").forEach((h) => splitWords(h, "rise").forEach((w, i) => w.style.setProperty("--i", String(i))));
    sc.querySelectorAll<HTMLElement>("[data-r]").forEach((el, i) => el.style.setProperty("--i", String(i)));
  });
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) e.target.classList.add("in");
    else if (e.boundingClientRect.top > 0) e.target.classList.remove("in");
  }), { rootMargin: "0px 0px -12% 0px" });
  scenes.forEach((sc) => io.observe(sc));

  const rel = (el: Element) => {
    const a = el.getBoundingClientRect(), b = page.getBoundingClientRect();
    return { top: a.top - b.top, bottom: a.bottom - b.top, left: a.left - b.left, right: a.right - b.left, w: a.width, h: a.height };
  };
  // where an element sits at rest, ignoring any entrance transform still pending on it or its parents
  const relRest = (el: Element) => {
    const r = rel(el); let dx = 0, dy = 0;
    for (let nd: Element | null = el; nd && nd !== page; nd = nd.parentElement) {
      const t = getComputedStyle(nd).transform;
      if (t && t !== "none") { const m = new DOMMatrix(t); dx += m.m41; dy += m.m42; }
    }
    return { ...r, left: r.left - dx, right: r.right - dx, top: r.top - dy, bottom: r.bottom - dy };
  };

  function build(startX: number) {
    const W = page.clientWidth, H = page.offsetHeight, narrow = W < 700;
    svg.setAttribute("width", String(W)); svg.setAttribute("height", String(H)); svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    const top = rel(flight).bottom;

    // the closing signature, fitted into its box
    const r = relRest(endSig), k = Math.min(r.w / 850, r.h / 380), ox = r.left + (r.w - 850 * k) / 2 - 10 * k, oy = r.top + (r.h - 380 * k) / 2 - 20 * k;
    const P = (x: number, y: number): Pt => [ox + x * k, oy + y * k];
    const eS = { B: P(22, 182), bottom: oy + 386 * k, right: ox + 842 * k, strokes: WRITING_ORDER.map((d) => mapPath(d, P)) };
    // The route: a handful of points the line passes through heading straight down, joined by long S-curves, so it
    // only ever drifts from side to side. It may pass behind text and under cards.
    const DOWN: Pt = [0, 1], LEFT: Pt = [-1, 0], ARC = 0.5523;                  // ARC: handle length of a quarter circle, per unit radius
    const mid = (sel: string) => { const b = relRest(page.querySelector(sel)!); return b.top + b.h / 2; };
    const B = eS.B, under = eS.bottom + (narrow ? 36 : 52), rB = under - B[1];  // the line runs under the signature, then rises into the B
    const knots: Knot[] = [{ p: [startX, top], d: DOWN }];
    let rT: number;
    if (!narrow) {
      const sec = page.querySelector<HTMLElement>("#expertise")!, sb = rel(sec), cs = getComputedStyle(sec);
      const L = sb.left + parseFloat(cs.paddingLeft), R = sb.right - parseFloat(cs.paddingRight), ph = relRest(page.querySelector(".portrait")!);
      knots.push({ p: [ph.left + ph.w / 2, ph.top + ph.h / 2], d: DOWN },        // through Ildi's photo
        { p: [R - (R - L) * 0.07, mid("#expertise")], d: DOWN },               // down the open edge beside her expertise
        { p: [W / 2, mid("#wiz")], d: DOWN },                                  // behind the inquiry form
        { p: [L + (R - L) * 0.555, mid("#cases")], d: DOWN });                  // between a story and its facts
      rT = clamp((under - knots[knots.length - 1].p[1]) * 0.5, 120, 260);
    } else {
      // phones: wide, slow S-curves from side to side (behind the text)
      rT = 104;
      const side = [W * 0.8, W * 0.2], first = startX > W / 2 ? 1 : 0;
      for (let y = top + 520, i = first; y < under - rT - 380; y += 520, i++) knots.push({ p: [side[i % 2], y], d: DOWN });
    }
    // the close: a wide turn to the left, a run under the signature, and a quarter turn up into the B's first stroke
    const xr = Math.min(eS.right + 40 + rT, W - 24), up: Pt = [8 / 62.5, -62 / 62.5], run = Math.max(1, xr - rT - (B[0] + rB)) / 3;
    knots.push({ p: [xr, under - rT], d: DOWN, out: rT * ARC }, { p: [xr - rT, under], d: LEFT, in: rT * ARC, out: run },
      { p: [B[0] + rB, under], d: LEFT, in: run, out: rB * ARC }, { p: B, d: up, in: rB * ARC });
    const d = tangentPath(knots);
    core.setAttribute("d", d); glow.setAttribute("d", d);
    Lc = core.getTotalLength();
    eSegs = strokePaths(endG, eS.strokes);
    eSegs.forEach((g) => (g.off += Lc));
    Lt = Lc + eSegs.reduce((a, g) => a + g.len, 0);
    samples = []; let maxY = -1e9; const N = Math.min(4000, Math.ceil(Lc / 5));
    for (let i = 0; i <= N; i++) { const l = (Lc * i) / N, p = core.getPointAtLength(l); maxY = Math.max(maxY, p.y); samples.push({ l, y: maxY }); }
  }

  const lenAt = (y: number) => {
    let lo = 0, hi = samples.length - 1;
    while (lo < hi) { const m = (lo + hi) >> 1; if (samples[m].y < y) lo = m + 1; else hi = m; }
    return samples[lo] ? samples[lo].l : Lt;
  };

  function target() {
    const top = -page.getBoundingClientRect().top, vh = window.innerHeight;
    if (top + vh >= page.offsetHeight - 6) return Lt;
    return lenAt(top + vh * 0.6);
  }

  function paint(h: number) {
    const th = clamp(h, 0, Lt);
    dashWindow([core, glow], Lc, 0, Math.min(th, Lc));
    for (const g of eSegs) dashWindow(g.els, g.len, 0, clamp(th - g.off, 0, g.len));
    head.classList.toggle("on", th > 2 && th < Lt - 2);
    if (th > 0) {
      const g = th <= Lc ? null : eSegs.find((s) => th <= s.off + s.len) ?? eSegs[eSegs.length - 1];
      const p = g ? g.els[1].getPointAtLength(clamp(th - g.off, 0, g.len)) : core.getPointAtLength(th);
      head.setAttribute("transform", `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`);
    }
  }

  return { build, target, paint, total: () => Lt, destroy: () => { io.disconnect(); scenes.forEach((sc) => sc.classList.add("in")); } };
}
