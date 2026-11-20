// Small helpers shared by the scroll experience.

export type Pt = [number, number];

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** Smoothstep: 0 below a, 1 above b, eased in between. */
export const sstep = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

// Easing. Nothing on the site moves at a constant rate: things start fast and settle (out), or gather speed and
// then settle (inOut), along an exponential curve.
const K = 6.5, FLOOR = Math.pow(2, -K);
/** Fast at first, then slower and slower. */
export const expoOut = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : (1 - Math.pow(2, -K * t)) / (1 - FLOOR));
/** Fast at first, then slower (a gentle cubic, for small fades). */
export const easeOut3 = (t: number) => 1 - Math.pow(1 - t, 3);
/** Slow, then fast, then slower again. */
export const expoInOut = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t < 0.5 ? (0.5 * (Math.pow(2, K * (2 * t - 1)) - FLOOR)) / (1 - FLOOR) : 1 - (0.5 * (Math.pow(2, -K * (2 * t - 1)) - FLOOR)) / (1 - FLOOR));

/** A point on the quadratic Bézier a -> (control c) -> b at t. */
export const quad = (a: Pt, c: Pt, b: Pt, t: number): Pt => [(1 - t) ** 2 * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0], (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1]];

/** A smooth SVG path through the points (Catmull-Rom converted to cubic Béziers). */
export function smoothPath(pts: Pt[]): string {
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    d += ` C ${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

/** A point the line passes through, the direction it is travelling there, and (optionally) how long the curve
    handles into and out of it are. Without them the handles are 0.4 of the distance to the neighbouring point. */
export type Knot = { p: Pt; d: Pt; in?: number; out?: number };

/** A path through the knots that leaves and enters each one along its direction, so there is never a corner. */
export function tangentPath(knots: Knot[]): string {
  let d = `M ${knots[0].p[0].toFixed(1)} ${knots[0].p[1].toFixed(1)}`;
  for (let i = 0; i < knots.length - 1; i++) {
    const a = knots[i], b = knots[i + 1], chord = Math.hypot(b.p[0] - a.p[0], b.p[1] - a.p[1]), ha = a.out ?? chord * 0.4, hb = b.in ?? chord * 0.4;
    d += ` C ${(a.p[0] + a.d[0] * ha).toFixed(1)} ${(a.p[1] + a.d[1] * ha).toFixed(1)} ${(b.p[0] - b.d[0] * hb).toFixed(1)} ${(b.p[1] - b.d[1] * hb).toFixed(1)} ${b.p[0].toFixed(1)} ${b.p[1].toFixed(1)}`;
  }
  return d;
}

/** Points sampled evenly along a path, measured once when the line is built: reading a point on a long path every
    frame (getPointAtLength) is slow on phones, especially in Safari, so frames look positions up in this table. */
export type PathTable = { len: number; xs: Float32Array; ys: Float32Array };
export function pathTable(path: SVGPathElement, len: number, n: number): PathTable {
  const xs = new Float32Array(n + 1), ys = new Float32Array(n + 1);
  for (let i = 0; i <= n; i++) { const p = path.getPointAtLength((len * i) / n); xs[i] = p.x; ys[i] = p.y; }
  return { len, xs, ys };
}
export function pointAt(t: PathTable, l: number): Pt {
  const n = t.xs.length - 1, f = clamp(l / (t.len || 1)) * n, i = Math.min(n - 1, Math.floor(f)), k = f - i;
  return [t.xs[i] + (t.xs[i + 1] - t.xs[i]) * k, t.ys[i] + (t.ys[i + 1] - t.ys[i]) * k];
}

/** Map every "x y" number pair in an SVG path string through fn. */
export const mapPath = (d: string, fn: (x: number, y: number) => Pt) =>
  d.replace(/(-?\d+\.?\d*) (-?\d+\.?\d*)/g, (_, x, y) => fn(+x, +y).map((v) => v.toFixed(2)).join(" "));

/** Show the stretch [a, b] of a path of the given length (a "dash window"); hide it when the stretch is empty. */
export function dashWindow(els: SVGPathElement[], len: number, a: number, b: number) {
  const v = b - a;
  for (const el of els) {
    if (v < 0.5) { el.style.visibility = "hidden"; continue; }
    el.style.visibility = "";
    el.style.strokeDasharray = `${v.toFixed(1)} ${(len * 3 + 10).toFixed(0)}`;
    el.style.strokeDashoffset = (-a).toFixed(1);
  }
}

const SVG_NS = "http://www.w3.org/2000/svg";
/** Fill a <g> with a soft glow path and a core path for each stroke; returns the strokes with their lengths. */
export function strokePaths(g: SVGGElement, ds: string[]) {
  g.textContent = "";
  let off = 0;
  return ds.map((d) => {
    const glow = document.createElementNS(SVG_NS, "path"), core = document.createElementNS(SVG_NS, "path");
    glow.setAttribute("class", "g"); core.setAttribute("class", "c");
    glow.setAttribute("d", d); core.setAttribute("d", d);
    g.append(glow, core);
    const len = core.getTotalLength(), seg = { els: [glow, core], off, len };
    off += len;
    return seg;
  });
}

/** Wrap each word of an element's text in <span class="w"><span class="wi">word</span></span>, so the words can rise
    from behind a mask (keeping inner elements such as placeholders). Safe to call twice; returns the inner spans. */
export function splitWords(el: Element): HTMLElement[] {
  if (!(el as HTMLElement).dataset.split) {
    (el as HTMLElement).dataset.split = "rise";
    const walk = (node: Node) => {
      for (const child of [...node.childNodes]) {
        if (child.nodeType === 3) {
          const parts = (child.textContent ?? "").split(/(\s+)/), frag = document.createDocumentFragment();
          for (const part of parts) {
            if (!part) continue;
            if (/^\s+$/.test(part)) { frag.append(" "); continue; }
            const w = document.createElement("span"), wi = document.createElement("span");
            w.className = "w"; wi.className = "wi"; wi.textContent = part; w.append(wi); frag.append(w);
          }
          child.replaceWith(frag);
        } else if (child.nodeType === 1 && (child as Element).tagName !== "BR") walk(child);
      }
    };
    walk(el);
  }
  return [...el.querySelectorAll<HTMLElement>(".wi")];
}

export const prefersReducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
