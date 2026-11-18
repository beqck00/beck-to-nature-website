// The month dial on the inquiry form: a ruler you drag, flick or tap, with a rolling two-digit readout.
// Mouse and pen use pointer events. Touch uses touch events with a direction lock, so a vertical swipe still scrolls
// the page and a sideways one is never cancelled half-way (iOS Safari cancels pointer drags that drift).

const MIN = 3, MAX = 24, STEP = 46;
const VERDICTS: [number, number, string][] = [
  [3, 5, "Tight, but possible if booth space is still available."],
  [6, 9, "Comfortable. Time to choose the show, book space and invite buyers."],
  [10, 15, "Ideal for the big annual shows, which sell space months ahead."],
  [16, 24, "Time to plan properly: product, certifications and a show calendar."],
];

export function mountDial(
  els: { track: HTMLElement; ruler: HTMLElement; digits: HTMLElement; verdict: HTMLElement },
  initial: number,
  onChange: (months: number) => void,
) {
  const { track, ruler, digits, verdict } = els;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const buzz = (ms: number) => { try { if (navigator.userActivation?.hasBeenActive) navigator.vibrate?.(ms); } catch { /* not supported */ } };

  let html = "";
  for (let m = 0; m <= 27; m += 0.5) {
    const major = m % 1 === 0;
    html += `<span class="tick${major ? " major" : ""}" style="left:${m * STEP}px"></span>`;
    if (major && m >= MIN && m <= MAX && m % 3 === 0) html += `<span class="tick-label" style="left:${m * STEP}px">${m}</span>`;
  }
  ruler.innerHTML = html;
  digits.innerHTML = [0, 1].map(() => `<span class="digit"><span class="strip">${[...Array(10).keys()].map((d) => `<span>${d}</span>`).join("")}</span></span>`).join("");
  const cols = [...digits.children] as HTMLElement[], shown: (number | null)[] = [null, null], timers: number[] = [0, 0];

  let pos = initial * STEP, value = initial, raf = 0, line = -1;
  const render = (silent = false) => {
    ruler.style.transform = `translateX(${track.clientWidth / 2 - pos}px)`;
    const v = Math.min(MAX, Math.max(MIN, Math.round(pos / STEP)));
    if (v !== value) { value = v; onChange(v); if (!silent) buzz(4); }
    const s2 = String(value).padStart(2, "0");
    [0, 1].forEach((i) => {
      const d = +s2[i], c = cols[i];
      c.classList.toggle("hidden", i === 0 && value < 10);
      if (shown[i] === d) return;
      if (!reduce && shown[i] !== null) { c.classList.add("moving"); clearTimeout(timers[i]); timers[i] = window.setTimeout(() => c.classList.remove("moving"), 200); }
      (c.firstElementChild as HTMLElement).style.transform = `translateY(${-d}em)`;
      shown[i] = d;
    });
    const nline = VERDICTS.findIndex(([a, b]) => value >= a && value <= b);
    if (nline !== line) {
      line = nline; verdict.classList.add("out");
      window.setTimeout(() => { verdict.textContent = VERDICTS[nline][2]; verdict.classList.remove("out"); }, reduce ? 0 : 150);
    }
    track.setAttribute("aria-valuenow", String(value)); track.setAttribute("aria-valuetext", `${value} months`);
  };
  // past either end the dial resists more the further it is pulled (rubber band), and never goes past STEP * 0.6
  const lo = MIN * STEP, hi = MAX * STEP, give = STEP * 0.6;
  const band = (p: number) => p > hi ? hi + give * (1 - Math.exp(-(p - hi) / give)) : p < lo ? lo - give * (1 - Math.exp(-(lo - p) / give)) : p;
  // a spring with no bounce that starts at the speed the finger let go (px per ms), so a flick carries straight into the settle
  const spring = (t: number, v0: number) => {
    cancelAnimationFrame(raf);
    if (reduce) { pos = t; render(); return; }
    let x = pos, v = v0 * 1000, last = performance.now();
    const w = 13;                                                        // stiffness: settles in about half a second, critically damped
    const st = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000); last = now;
      v += (-w * w * (x - t) - 2 * w * v) * dt; x += v * dt; pos = x; render();
      if (Math.abs(x - t) > 0.3 || Math.abs(v) > 6) raf = requestAnimationFrame(st); else { pos = t; render(); }
    };
    raf = requestAnimationFrame(st);
  };
  const to = (t: number, dur = 250) => {
    cancelAnimationFrame(raf);
    if (reduce) { pos = t; render(); return; }
    const f = pos, t0 = performance.now();
    const st = (now: number) => { const k = Math.min(1, (now - t0) / dur); pos = f + (t - f) * (1 - Math.pow(1 - k, 3)); render(); if (k < 1) raf = requestAnimationFrame(st); };
    raf = requestAnimationFrame(st);
  };
  const snap = () => to(Math.min(MAX, Math.max(MIN, Math.round(pos / STEP))) * STEP);

  let drag = false, lx = 0, sx = 0, sy = 0, t0 = 0, moved = 0, raw = 0, hist: [number, number][] = [];
  const begin = (x: number, y: number) => { drag = true; cancelAnimationFrame(raf); lx = sx = x; sy = y; t0 = performance.now(); moved = 0; raw = pos; hist = [[t0, pos]]; };
  const move = (x: number) => {
    const dx = x - lx; lx = x; moved += Math.abs(dx); raw -= dx; pos = band(raw);
    const now = performance.now(); hist.push([now, pos]);
    while (hist.length > 2 && now - hist[0][0] > 90) hist.shift();
    render();
  };
  const end = (x: number, cancelled = false) => {
    if (!drag) return; drag = false; const now = performance.now();
    if (cancelled) return snap();
    if (moved < 6 && now - t0 < 350) {                                   // a tap: jump to the tapped month
      const r = track.getBoundingClientRect();
      return to(Math.min(MAX, Math.max(MIN, Math.round((pos + x - (r.left + r.width / 2)) / STEP))) * STEP, 260);
    }
    const [ta, pa] = hist[0], [tb, pb] = hist[hist.length - 1];
    const vel = now - tb > 70 || tb - ta < 8 ? 0 : (pb - pa) / (tb - ta);
    // where a flick would come to rest, rounded to a month; the spring takes it there from the release speed
    const v = Math.max(-2.4, Math.min(2.4, vel)), aim = Math.min(MAX, Math.max(MIN, Math.round((pos + v * 140) / STEP))) * STEP;
    spring(aim, v);
  };

  const ac = new AbortController(), on = { signal: ac.signal };
  track.addEventListener("pointerdown", (e) => { if (e.pointerType === "touch") return; track.setPointerCapture(e.pointerId); begin(e.clientX, e.clientY); }, on);
  track.addEventListener("pointermove", (e) => { if (e.pointerType === "touch" || !drag) return; move(e.clientX); }, on);
  track.addEventListener("pointerup", (e) => { if (e.pointerType !== "touch") end(e.clientX); }, on);
  track.addEventListener("pointercancel", (e) => { if (e.pointerType !== "touch") end(e.clientX, true); }, on);
  let lock = "";
  track.addEventListener("touchstart", (e) => { if (e.touches.length !== 1) return; const p = e.touches[0]; lock = ""; begin(p.clientX, p.clientY); }, { passive: true, signal: ac.signal });
  track.addEventListener("touchmove", (e) => {
    if (!drag) return; const p = e.touches[0];
    if (!lock) {
      const dx = Math.abs(p.clientX - sx), dy = Math.abs(p.clientY - sy);
      if (dx < 5 && dy < 5) return;
      lock = dx >= dy ? "x" : "y";
      if (lock === "y") { drag = false; snap(); return; }
    }
    e.preventDefault(); move(p.clientX);
  }, { passive: false, signal: ac.signal });
  track.addEventListener("touchend", (e) => { const p = e.changedTouches[0]; end(p ? p.clientX : lx); }, on);
  track.addEventListener("touchcancel", () => end(lx, true), on);
  track.addEventListener("keydown", (e) => {
    const k = ({ ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 } as Record<string, number>)[e.key];
    if (!k) return; e.preventDefault(); to(Math.min(MAX, Math.max(MIN, value + k)) * STEP, 200);
  }, on);
  window.addEventListener("resize", () => render(true), on);
  render(true);
  return () => { ac.abort(); cancelAnimationFrame(raf); timers.forEach(clearTimeout); };
}
