// Scroll choreography for the sections below the flight, kept to three moves: headings rise word by word from behind
// a mask, blocks ease up as they enter, and the founder's two key sentences light up word by word as you scroll
// through them. Everything reverses when you scroll back.

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
    const fadeUpIn = (parent: Element) => gsap.from(parent.children, { y: 34, autoAlpha: 0, duration: 0.9, ease: "power3.out", stagger: 0.1, scrollTrigger: { trigger: parent, start: "top 88%", toggleActions: play } });
    const light = (sel: string) => all(sel).forEach((el) =>
      gsap.fromTo(splitWords(el, "light"), { opacity: 0.22 }, { opacity: 1, ease: "none", stagger: 0.1, scrollTrigger: { trigger: el, start: "top 84%", end: "top 44%", scrub: 0.4 } }));

    // specialties
    rise("#sp-h"); fadeUp("#specialties .sec-head p"); fadeUp(".tri", ".trio", { stagger: 0.12 });
    all(".stone").forEach((st) => gsap.fromTo(st, { "--sheen": 0 }, { "--sheen": 1, ease: "none", scrollTrigger: { trigger: st, start: "top 85%", end: "bottom 15%", scrub: true } }));

    // founder
    fadeUp(".portrait"); rise("#fo-h"); fadeUp(".f-name"); light(".f-quote");
    fadeUp(".essay > div", ".essay");
    fadeUp(".promise-k"); light(".promise-t"); fadeUp(".f-links, .promise .btn", ".f-links");

    // inquiry
    rise("#iq-h"); fadeUp(".iq-head p"); fadeUp("#wiz");

    // stories
    rise("#cs-h");
    all(".story").forEach((story) => {
      gsap.fromTo(story, { "--rule": 0 }, { "--rule": 1, ease: "none", scrollTrigger: { trigger: story, start: "top 92%", end: "top 62%", scrub: 0.5 } });
      fadeUpIn(story);
    });
    fadeUp("#cases .text-cta");
    all(".foot").forEach((f) => gsap.from(f, { autoAlpha: 0, duration: 0.9, ease: "power2.out", scrollTrigger: { trigger: f, start: "top 100%", toggleActions: play } }));   // at the very bottom, so it must trigger as soon as it shows
  }, page);

  return () => ctx.revert();
}

export const refreshScenes = () => ScrollTrigger.refresh();
