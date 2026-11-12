"use client";

// Drives the scroll experience: the opening flight, the gold line down the page, the section choreography, the
// cursor spotlight and in-page links. Renders nothing itself; it animates the page that the server rendered.
// With "reduce motion" set, the page is shown complete and still.

import { useEffect } from "react";
import { createFlight } from "@/lib/fx/flight";
import { createScenes, refreshScenes } from "@/lib/fx/scenes";
import { createThread } from "@/lib/fx/thread";
import { clamp, prefersReducedMotion } from "@/lib/fx/util";

export default function Experience() {
  useEffect(() => {
    const root = document.documentElement, page = document.querySelector<HTMLElement>(".page");
    const flightEl = page?.querySelector<HTMLElement>(".flight"), stage = flightEl?.querySelector<HTMLElement>(".flight-stage");
    if (!page || !flightEl || !stage) return;
    const still = prefersReducedMotion();
    root.classList.toggle("fx", !still);
    const flight = createFlight(flightEl), thread = createThread(page);
    const ac = new AbortController(), on = { signal: ac.signal }, passive = { signal: ac.signal, passive: true };
    let raf = 0, killScenes = () => {};

    // where the flight starts and how far it runs, in page pixels
    const flightSpan = () => { const top = flightEl.getBoundingClientRect().top + window.scrollY; return { top, len: flightEl.offsetHeight - stage.offsetHeight }; };

    // in-page links: smooth, and aware that "why" lives at the end of the flight
    document.addEventListener("click", (e) => {
      const link = (e.target as Element).closest?.<HTMLAnchorElement>('a[href^="#"]');
      if (!link) return;
      const hash = link.getAttribute("href")!, industry = link.dataset.industry;
      if (industry) window.dispatchEvent(new CustomEvent("btn:prefill", { detail: industry }));
      let y: number | null = null;
      if (hash === "#top") y = 0;
      else if (hash === "#why" && !still) { const f = flightSpan(); y = f.top + f.len * 0.93; }
      else { const el = document.querySelector(hash); if (el) y = el.getBoundingClientRect().top + window.scrollY - (hash === "#inquiry" ? 100 : 84); }
      if (y === null) return;
      e.preventDefault();
      window.scrollTo({ top: Math.max(0, y), behavior: still ? "auto" : "smooth" });
      history.replaceState(null, "", hash === "#top" ? location.pathname : hash);
    }, on);

    // cursor spotlight, and the highlight on the polished stone
    const spot = document.querySelector<HTMLElement>(".spot");
    if (spot && !matchMedia("(hover: none), (pointer: coarse)").matches) {
      let sx = 0, sy = 0, queued = false;
      window.addEventListener("pointermove", (e) => {
        sx = e.clientX; sy = e.clientY;
        if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; spot.style.transform = `translate(${sx}px, ${sy}px)`; spot.classList.add("on"); }); }
        const stone = (e.target as Element).closest?.<HTMLElement>(".stone");
        if (stone) { const r = stone.getBoundingClientRect(); stone.style.setProperty("--mx", `${e.clientX - r.left}px`); stone.style.setProperty("--my", `${e.clientY - r.top}px`); }
      }, passive);
      document.addEventListener("pointerleave", () => spot.classList.remove("on"), on);
    }

    if (still) {
      // complete and still: the hero drawn once, the closing signature written, nothing moving
      const draw = () => { flight.layout(); flight.renderStill(); thread.build(flight.exitX()); thread.paint(thread.total()); };
      draw();
      let t = 0; window.addEventListener("resize", () => { clearTimeout(t); t = window.setTimeout(draw, 150); }, on);
      document.fonts?.ready.then(draw);
      return () => { ac.abort(); clearTimeout(t); flight.destroy(); };
    }

    // ── with motion ──
    flight.layout();
    thread.build(flight.exitX());
    killScenes = createScenes(page);

    // The line eases after the scroll; the faster you scroll, the faster it catches up. P is the flight's progress,
    // h the length of line drawn below it. They hand over to each other so the line is always one unbroken stroke.
    let P = 0, h = 0, sv = 0, lastY = window.scrollY, lastT = performance.now(), first = true, lastH = -1;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = clamp(now - lastT, 1, 64), inst = Math.abs(window.scrollY - lastY) / dt; lastY = window.scrollY; lastT = now;
      sv = sv * 0.86 + inst * 0.14;                                        // smoothed scroll speed, px per ms
      const k = 0.075 + Math.min(0.3, Math.max(0, sv - 0.35) * 0.13);      // follow rate per 60fps frame
      const f = 1 - Math.pow(1 - k, dt / 16.7);                            // same feel at any frame rate
      const r = flightEl.getBoundingClientRect(), span = flightEl.offsetHeight - stage.offsetHeight;
      const pT = clamp(-r.top / span), hT = thread.target();
      if (first) { first = false; P = pT; h = pT >= 1 ? hT : 0; if (pT > 0.02) flight.skipIntro(); else flight.playIntro(); }
      const pGoal = h > 1 ? 1 : pT, hGoal = P > 0.995 ? hT : 0;
      P = Math.abs(pGoal - P) < 0.0003 ? pGoal : P + (pGoal - P) * f;
      h = Math.abs(hGoal - h) < 0.3 ? hGoal : h + (hGoal - h) * f;
      if (r.bottom > -40) flight.render(P, now);
      if (h !== lastH) { thread.paint(h); lastH = h; }
    };
    raf = requestAnimationFrame(frame);

    // keep the geometry right when the window, the fonts or the page's height change (the form grows and shrinks)
    let rt = 0, lastW = window.innerWidth, lastPageH = page.offsetHeight;
    const relayout = (full: boolean) => {
      if (full) flight.layout();
      thread.build(flight.exitX());
      h = P > 0.995 ? thread.target() : 0; lastH = -1;
      refreshScenes();
    };
    window.addEventListener("resize", () => {
      clearTimeout(rt);
      rt = window.setTimeout(() => { const w = window.innerWidth, full = w !== lastW || !matchMedia("(pointer: coarse)").matches; lastW = w; relayout(full); }, 160);
    }, on);
    const ro = new ResizeObserver(() => {
      const ph = page.offsetHeight; if (Math.abs(ph - lastPageH) < 2) return; lastPageH = ph;
      clearTimeout(rt); rt = window.setTimeout(() => relayout(false), 120);
    });
    ro.observe(page);
    document.fonts?.ready.then(() => relayout(true));

    return () => { ac.abort(); cancelAnimationFrame(raf); clearTimeout(rt); ro.disconnect(); killScenes(); flight.destroy(); root.classList.remove("fx"); };
  }, []);

  return null;
}
