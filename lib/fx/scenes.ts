// Scroll choreography for the sections below the flight. Headings rise word by word from behind a mask, blocks ease
// up as they enter, key sentences light up word by word as you scroll through them, the three specialty cards tip
// into place, and the inquiry form rises into a pool of light. Everything reverses when you scroll back.

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { splitWords } from "./util";

export function createScenes(page: HTMLElement): () => void {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
  const all = <E extends Element = HTMLElement>(s: string) => [...page.querySelectorAll<E>(s)];

  const ctx = gsap.context(() => {
    const play = "play none none reverse";
    const rise = (sel: string) => all(sel).forEach((h) =>
      gsap.from(splitWords(h, "rise"), { yPercent: 118, duration: 1, ease: "power4.out", stagger: 0.07, scrollTrigger: { trigger: h, start: "top 88%", toggleActions: play } }));
    const fadeUp = (sel: string, trigger?: string, vars: gsap.TweenVars = {}) => {
      const els = all(sel); if (!els.length) return;
      gsap.from(els, { y: 34, autoAlpha: 0, duration: 0.9, ease: "power3.out", stagger: 0.1, ...vars, scrollTrigger: { trigger: trigger ? page.querySelector(trigger) : els[0], start: "top 88%", toggleActions: play } });
    };
    const light = (sel: string) => all(sel).forEach((el) =>
      gsap.fromTo(splitWords(el, "light"), { opacity: 0.22 }, { opacity: 1, ease: "none", stagger: 0.1, scrollTrigger: { trigger: el, start: "top 84%", end: "top 44%", scrub: 0.4 } }));

    // specialties
    rise("#sp-h"); fadeUp("#specialties .sec-head p");
    const mm = gsap.matchMedia();
    mm.add("(min-width: 901px)", () => {
      gsap.from(all(".tri"), { y: 120, rotateX: 18, autoAlpha: 0, transformOrigin: "50% 100%", ease: "power2.out", stagger: 0.16,
        scrollTrigger: { trigger: page.querySelector(".trio"), start: "top 94%", end: "top 42%", scrub: 0.6 } });
    });
    mm.add("(max-width: 900px)", () => {
      all(".tri").forEach((card) => gsap.from(card, { y: 70, autoAlpha: 0, ease: "power2.out", scrollTrigger: { trigger: card, start: "top 96%", end: "top 72%", scrub: 0.5 } }));
    });
    all(".stone").forEach((st) => gsap.fromTo(st, { "--sheen": 0 }, { "--sheen": 1, ease: "none", scrollTrigger: { trigger: st, start: "top 85%", end: "bottom 15%", scrub: true } }));

    // founder
    all(".portrait").forEach((p) => {
      gsap.fromTo(p, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: { trigger: p, start: "top 90%", end: "top 40%", scrub: 0.5 } });
      gsap.fromTo(p, { y: 50 }, { y: -50, ease: "none", scrollTrigger: { trigger: p, start: "top bottom", end: "bottom top", scrub: true } });
    });
    rise("#fo-h"); fadeUp(".f-name"); light(".f-quote");
    fadeUp(".essay > div", ".essay");
    fadeUp(".promise-k"); light(".promise-t"); fadeUp(".f-links, .promise .btn", ".f-links");

    // inquiry: the form rises into a pool of light
    rise("#iq-h"); fadeUp(".iq-head p");
    const iq = page.querySelector(".iq"), wiz = page.querySelector("#wiz");
    if (iq && wiz) {
      gsap.timeline({ scrollTrigger: { trigger: iq, start: "top 88%", end: "top 46%", scrub: 0.6 } })
        .fromTo(wiz, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35, ease: "none" }, 0)
        .fromTo(wiz, { y: 100, scale: 0.93 }, { y: 0, scale: 1, duration: 1, ease: "power2.out" }, 0);
      gsap.fromTo(".iq-glow", { autoAlpha: 0, scale: 0.55 }, { autoAlpha: 1, scale: 1, ease: "none", scrollTrigger: { trigger: iq, start: "top 95%", end: "top 30%", scrub: 0.8 } });
    }

    // stories
    rise("#cs-h");
    all(".story").forEach((story) => {
      gsap.fromTo(story, { "--rule": 0 }, { "--rule": 1, ease: "none", scrollTrigger: { trigger: story, start: "top 92%", end: "top 62%", scrub: 0.5 } });
      gsap.from(story.querySelectorAll(".story-facts > *"), { x: 40, autoAlpha: 0, duration: 0.9, ease: "power3.out", stagger: 0.1, scrollTrigger: { trigger: story, start: "top 82%", toggleActions: play } });
    });
    light(".story-result");
    fadeUp("#cases .text-cta");
    all(".foot").forEach((f) => gsap.from(f, { autoAlpha: 0, duration: 0.9, ease: "power2.out", scrollTrigger: { trigger: f, start: "top 100%", toggleActions: play } }));   // at the very bottom, so it must trigger as soon as it shows
  }, page);

  return () => ctx.revert();
}

export const refreshScenes = () => ScrollTrigger.refresh();
