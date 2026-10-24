"use client";

import { useEffect, useState } from "react";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav${scrolled ? " scrolled" : ""}`}>
      <div className="wrap nav-inner">
        <a className="logo" href="#top" aria-label="Beck To Nature, home">
          <img className="mark" src="/logo/beck-to-nature-icon.svg" alt="" />
          <img className="wordmark" src="/logo/beck-to-nature-wordmark.svg" alt="" />
        </a>
        <nav className="links" aria-label="Sections">
          <a href="#story">Our story</a>
          <a href="#services">Services</a>
          <a href="#check">Readiness check</a>
          <a href="#team">Team</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="btn btn-green" href="#contact">Contact us</a>
      </div>
    </header>
  );
}
