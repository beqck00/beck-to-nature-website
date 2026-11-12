// Small helpers shared by the scroll experience.

export type Pt = [number, number];

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** Smoothstep: 0 below a, 1 above b, eased in between. */
export const sstep = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/** A smooth SVG path through the points (Catmull-Rom converted to cubic Béziers). */
export function smoothPath(pts: Pt[]): string {
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    d += ` C ${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
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

/** Wrap each word of an element's text in spans (keeping inner elements such as placeholders). Safe to call twice.
    kind "rise": <span class="w"><span class="wi">word</span></span>, for words that rise from behind a mask.
    kind "light": <span class="lw">word</span>, for words that light up one by one. */
export function splitWords(el: Element, kind: "rise" | "light"): HTMLElement[] {
  if (!(el as HTMLElement).dataset.split) {
    (el as HTMLElement).dataset.split = kind;
    const walk = (node: Node) => {
      for (const child of [...node.childNodes]) {
        if (child.nodeType === 3) {
          const parts = (child.textContent ?? "").split(/(\s+)/), frag = document.createDocumentFragment();
          for (const part of parts) {
            if (!part) continue;
            if (/^\s+$/.test(part)) { frag.append(" "); continue; }
            if (kind === "rise") {
              const w = document.createElement("span"), wi = document.createElement("span");
              w.className = "w"; wi.className = "wi"; wi.textContent = part; w.append(wi); frag.append(w);
            } else {
              const lw = document.createElement("span");
              lw.className = "lw"; lw.textContent = part; frag.append(lw);
            }
          }
          child.replaceWith(frag);
        } else if (child.nodeType === 1 && (child as Element).tagName !== "BR") walk(child);
      }
    };
    walk(el);
  }
  return [...el.querySelectorAll<HTMLElement>(kind === "rise" ? ".wi" : ".lw")];
}

export const prefersReducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
