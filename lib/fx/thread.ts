// The gold line below the flight. It picks up where the flight's line leaves the stage, runs down the page as one
// smooth stroke, lights each element as its head passes (and dims it again on the way back up), and ends by writing
// the "Beck" signature at the bottom left, joining it at the B.

import { SIG_STROKES } from "@/lib/data/signature";
import { clamp, dashWindow, lerp, mapPath, type Pt, smoothPath, sstep, strokePaths } from "./util";

// Elements the line lights as it passes.
const LUM = "#specialties .sec-head, .tri, .portrait, .founder-text h2, .f-name, .f-quote, .essay > div, .promise, .iq-head, #wiz, #cases .sec-head, .story, #cases .text-cta, .foot";

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
};

export function createThread(page: HTMLElement): Thread {
  const svg = page.querySelector<SVGSVGElement>(".thread")!, core = svg.querySelector<SVGPathElement>(".t-core")!, glow = svg.querySelector<SVGPathElement>(".t-glow")!;
  const head = svg.querySelector<SVGGElement>(".t-head")!, endG = svg.querySelector<SVGGElement>(".t-end")!;
  const flight = page.querySelector<HTMLElement>(".flight")!, endSig = page.querySelector<HTMLElement>(".end-sig")!;
  let lums: { el: Element; y: number }[] = [], eSegs: ReturnType<typeof strokePaths> = [], Lc = 0, Lt = 0, samples: { l: number; y: number }[] = [];

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
    // the line meets the signature only at the B: a soft hook rising into the B's lead-in stroke
    const u = Math.max(18, 160 * k), B = eS.B;
    const hook: Pt[] = [[B[0] - u * 0.9, B[1] - u * 0.3], [B[0] - u * 0.8, B[1] + u * 0.9], [B[0] - u * 0.35, B[1] + u * 0.9], [B[0] - u * 0.05, B[1] + u * 0.35], B];

    let pts: Pt[] = [[startX, top]];
    if (!narrow) {
      // The route the owners drew on a 528px-wide picture of the page, mapped onto the live layout: x scales with the
      // page width; y is pinned to the end of the flight, the featured card, the founder's quote and the closing signature.
      const card = relRest(page.querySelector(".tri.stone")!), quote = relRest(page.querySelector(".f-quote")!);
      const A: Pt[] = [[560, top], [640, card.top + card.h / 2], [1305, quote.bottom + 60], [1915, B[1]]];
      const my = (v: number) => {
        let i = 0; while (i < A.length - 2 && v > A[i + 1][0]) i++;
        return lerp(A[i][1], A[i + 1][1], (v - A[i][0]) / (A[i + 1][0] - A[i][0]));
      };
      const route: Pt[] = [[160, 580], [172, 604], [196, 628], [212, 650], [196, 690], [176, 722], [168, 750], [185, 790], [212, 832], [232, 870], [240, 910], [250, 950],
        [262, 1000], [262, 1060], [248, 1130], [232, 1200], [228, 1262], [250, 1300], [300, 1318], [352, 1325], [385, 1345], [394, 1395], [384, 1450], [366, 1510],
        [342, 1556], [292, 1585], [242, 1622], [222, 1662], [232, 1702], [268, 1742], [294, 1782], [294, 1830], [268, 1868]];
      for (const [x, y] of route) pts.push([(x * W) / 528, my(y)]);
      pts.push([B[0] + 150, B[1] - 125], [B[0] - 25, B[1] - 100]);
    } else {
      // phones: wide, slow S-curves across the screen (behind the text), easing out towards the closing signature
      const end = eS.bottom - 80, ease = 260, phase = Math.asin(clamp((startX / W - 0.54) / 0.34, -1, 1));
      const wind = (y: number) => clamp(W * 0.54 + W * 0.34 * Math.sin(((y - top) / 1050) * Math.PI * 2 + phase) + 5 * Math.sin(((y - top) / 290) * Math.PI * 2), 16, W - 16);
      for (let y = top + 40; y < end; y += 40) pts.push([lerp(wind(y), eS.right + 30, sstep(end - ease, end, y)), y]);
      pts.push([lerp(eS.right + 30, B[0], 0.5), B[1] - 120], [B[0] - 14, B[1] - 90]);
    }
    pts = pts.concat(hook);
    const d = smoothPath(pts);
    core.setAttribute("d", d); glow.setAttribute("d", d);
    Lc = core.getTotalLength();
    eSegs = strokePaths(endG, eS.strokes);
    eSegs.forEach((g) => (g.off += Lc));
    Lt = Lc + eSegs.reduce((a, g) => a + g.len, 0);
    samples = []; let maxY = -1e9; const N = Math.min(4000, Math.ceil(Lc / 5));
    for (let i = 0; i <= N; i++) { const l = (Lc * i) / N, p = core.getPointAtLength(l); maxY = Math.max(maxY, p.y); samples.push({ l, y: maxY }); }
    lums = [...page.querySelectorAll(LUM), ...page.querySelectorAll(".stone")].map((el) => {
      el.classList.add("lum"); const b = relRest(el);
      return { el, y: b.top + Math.min(b.h, 160) / 2 };
    });
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
    let hy = -1e9;
    if (th > 0) {
      const g = th <= Lc ? null : eSegs.find((s) => th <= s.off + s.len) ?? eSegs[eSegs.length - 1];
      const p = g ? g.els[1].getPointAtLength(clamp(th - g.off, 0, g.len)) : core.getPointAtLength(th);
      head.setAttribute("transform", `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`);
      hy = p.y;
    }
    const all = th >= Lt - 2;
    for (const o of lums) o.el.classList.toggle("lit", all || hy >= o.y - 40);
  }

  return { build, target, paint, total: () => Lt };
}
