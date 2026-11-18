// The end of a page gives a little: scroll on past the bottom and the last part of the page lifts, resisting more the
// further you push, then springs back (no bounce past rest) at the speed you let go. It tells the visitor the page has
// ended rather than frozen. Apple devices already do this themselves, so it is left to them there; with reduced motion
// it is off. Moves only the elements marked data-bounce, with transform.

const MAX = 72, K = 220, W = 11;          // px the page can lift at most; how quickly the resistance builds; spring stiffness

export function endBounce(): () => void {
  const apple = /Mac|iPhone|iPad|iPod/.test(navigator.platform) || (navigator.maxTouchPoints > 1 && /Macintosh/.test(navigator.userAgent));
  if (apple || matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};
  const els = () => [...document.querySelectorAll<HTMLElement>("[data-bounce]")];
  const atBottom = () => window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
  let off = 0, pull = 0, raf = 0, timer = 0, v = 0;
  const put = (o: number) => { off = o; const t = Math.abs(o) < 0.2 ? "" : `translateY(${o.toFixed(2)}px)`; for (const el of els()) el.style.transform = t; };
  const lift = (p: number) => -MAX * (1 - Math.exp(-p / K));
  const release = (v0 = 0) => {
    cancelAnimationFrame(raf); pull = 0; v = v0;
    let last = performance.now();
    const st = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000); last = now;
      v += (-W * W * off - 2 * W * v) * dt; const o = off + v * dt;
      if (Math.abs(o) < 0.3 && Math.abs(v) < 8) { put(0); return; }
      put(o); raf = requestAnimationFrame(st);
    };
    raf = requestAnimationFrame(st);
  };
  const ac = new AbortController(), opt = { passive: true, signal: ac.signal };

  window.addEventListener("wheel", (e) => {
    if (e.deltaY <= 0 || !atBottom() || e.ctrlKey) { if (pull) release(); return; }
    cancelAnimationFrame(raf);
    pull += e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1);
    put(lift(pull));
    clearTimeout(timer); timer = window.setTimeout(() => release(), 140);
  }, opt);

  let y0: number | null = null, ly = 0, lt = 0, vy = 0;
  window.addEventListener("touchstart", (e) => { if (e.touches.length === 1) { y0 = null; ly = e.touches[0].clientY; lt = performance.now(); vy = 0; cancelAnimationFrame(raf); } }, opt);
  window.addEventListener("touchmove", (e) => {
    if (e.touches.length !== 1) return;
    const y = e.touches[0].clientY, now = performance.now();
    if (atBottom() && y < ly) { if (y0 === null) y0 = ly; }
    if (y0 !== null) {
      pull = Math.max(0, y0 - y); const before = off; put(lift(pull));
      vy = (off - before) / Math.max(1, now - lt);
      if (pull === 0) y0 = null;
    }
    ly = y; lt = now;
  }, opt);
  const end = () => { if (y0 !== null || off) { y0 = null; release(vy * 1000); } };
  window.addEventListener("touchend", end, opt);
  window.addEventListener("touchcancel", end, opt);

  return () => { ac.abort(); cancelAnimationFrame(raf); clearTimeout(timer); put(0); };
}
