"use client";

// Drives the scroll experience: the opening flight, the journey from section to section along the gold line, the
// cursor spotlight and in-page links. Renders nothing itself; it animates the page that the server rendered.
// With "reduce motion" set, the page is shown complete and still.

import { useEffect } from "react";
import { createFlight } from "@/lib/fx/flight";
import { createJourney } from "@/lib/fx/journey";
import { clamp, prefersReducedMotion } from "@/lib/fx/util";

export default function Experience() {
  useEffect(() => {
    const root = document.documentElement, page = document.querySelector<HTMLElement>(".page");
    const flightEl = page?.querySelector<HTMLElement>(".flight"), stage = flightEl?.querySelector<HTMLElement>(".flight-stage");
    if (!page || !flightEl || !stage) return;
    const still = prefersReducedMotion();
    root.classList.toggle("fx", !still);
    const flight = createFlight(flightEl, still), journey = createJourney(page), journeyEl = page.querySelector<HTMLElement>(".journey")!;
    const ac = new AbortController(), on = { signal: ac.signal }, passive = { signal: ac.signal, passive: true };
    let raf = 0;
    const journeyTop = () => journeyEl.getBoundingClientRect().top + window.scrollY;

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
      else {
        const el = document.querySelector(hash), u = el && !still ? journey.whereIs(el) : null;
        if (u !== null) y = journeyTop() + u;
        else if (el) y = el.getBoundingClientRect().top + window.scrollY - (hash === "#inquiry" ? 100 : 84);
      }
      if (y === null) return;
      e.preventDefault();
      window.scrollTo({ top: Math.max(0, y), behavior: still ? "auto" : "smooth" });
      history.replaceState(null, "", hash === "#top" ? location.pathname : hash);
    }, on);

    // cursor spotlight
    const spot = document.querySelector<HTMLElement>(".spot");
    if (spot && !matchMedia("(hover: none), (pointer: coarse)").matches) {
      let sx = 0, sy = 0, queued = false;
      window.addEventListener("pointermove", (e) => {
        sx = e.clientX; sy = e.clientY;
        if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; spot.style.transform = `translate(${sx}px, ${sy}px)`; }); }
        spot.classList.toggle("on", !!(e.target as Element).closest?.(".flight-sky"));      // the spotlight belongs to the hero map only
      }, passive);
      document.addEventListener("pointerleave", () => spot.classList.remove("on"), on);
    }

    if (still) {
      // complete and still: the hero drawn once, the closing signature written, nothing moving
      const draw = () => { flight.layout(); flight.renderStill(); journey.drawStill(); };
      draw();
      let t = 0; window.addEventListener("resize", () => { clearTimeout(t); t = window.setTimeout(draw, 150); }, on);
      document.fonts?.ready.then(draw);
      return () => { ac.abort(); clearTimeout(t); flight.destroy(); };
    }

    // ── with motion ──
    flight.layout();
    journey.build(flight.exitX());

    // Everything eases after the scroll; the faster you scroll, the faster it catches up. P is the flight's progress,
    // U how far into the journey we are. They hand over to each other so the line is always one unbroken stroke.
    const before = () => -stage.offsetHeight;                               // U while the journey's stage is still below the screen
    let P = 0, U = before(), sv = 0, lastY = window.scrollY, lastT = performance.now(), first = true, lastU = NaN;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = clamp(now - lastT, 1, 64), inst = Math.abs(window.scrollY - lastY) / dt; lastY = window.scrollY; lastT = now;
      sv = sv * 0.86 + inst * 0.14;                                        // smoothed scroll speed, px per ms
      const k = 0.1 + Math.min(0.3, Math.max(0, sv - 0.35) * 0.13);        // follow rate per 60fps frame
      const f = 1 - Math.pow(1 - k, dt / 16.7);                            // same feel at any frame rate
      const r = flightEl.getBoundingClientRect(), span = flightEl.offsetHeight - stage.offsetHeight;
      const pT = clamp(-r.top / span), uT = Math.max(before(), -journeyEl.getBoundingClientRect().top);
      if (first) { first = false; P = pT; U = pT >= 1 ? uT : before(); if (pT > 0.02) flight.skipIntro(); else flight.playIntro(); }
      const pGoal = journey.drawn(U) > 1 ? 1 : pT, uGoal = P > 0.995 ? uT : before();
      P = Math.abs(pGoal - P) < 0.0003 ? pGoal : P + (pGoal - P) * f;
      U = Math.abs(uGoal - U) < 0.3 ? uGoal : U + (uGoal - U) * f;
      if (r.bottom > -40) flight.render(P, now);
      if (U !== lastU) { journey.render(U); lastU = U; }
    };
    raf = requestAnimationFrame(frame);

    // keyboard: bring a focused control into view (the sections are placed by the camera, not by the page's own scroll)
    document.addEventListener("focusin", (e) => {
      const el = e.target as Element;
      if (!el.matches?.(":focus-visible") || !journeyEl.contains(el)) return;
      const b = el.getBoundingClientRect(), u = journey.whereIs(el);
      if (u !== null && (b.top < 80 || b.bottom > window.innerHeight - 24 || b.left < 0 || b.right > window.innerWidth)) window.scrollTo({ top: journeyTop() + u });
    }, on);

    // keep the geometry right when the window, the fonts or a section's height change (the form grows and shrinks)
    let rt = 0, lastW = window.innerWidth;
    const relayout = (full: boolean) => {
      if (full) flight.layout();
      journey.build(flight.exitX()); lastU = NaN;
    };
    window.addEventListener("resize", () => {
      clearTimeout(rt);
      rt = window.setTimeout(() => { const w = window.innerWidth, full = w !== lastW || !matchMedia("(pointer: coarse)").matches; lastW = w; relayout(full); }, 160);
    }, on);
    const heights = new Map<Element, number>();
    const ro = new ResizeObserver((entries) => {
      let changed = false;
      for (const en of entries) { const h = Math.round(en.contentRect.height); if (heights.has(en.target) && Math.abs(heights.get(en.target)! - h) > 1) changed = true; heights.set(en.target, h); }
      if (changed) { clearTimeout(rt); rt = window.setTimeout(() => relayout(false), 120); }
    });
    journeyEl.querySelectorAll(".scene").forEach((sc) => ro.observe(sc));
    document.fonts?.ready.then(() => relayout(true));

    return () => { ac.abort(); cancelAnimationFrame(raf); clearTimeout(rt); ro.disconnect(); flight.destroy(); root.classList.remove("fx"); };
  }, []);

  return null;
}
