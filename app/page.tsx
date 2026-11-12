import Experience from "@/components/Experience";
import Inquiry from "@/components/Inquiry";
import { Ph } from "@/components/Ph";

const Arrow = () => <svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
const Check = () => <span className="ok" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M6 12.5l4 4L18 8.5" /></svg></span>;

type Tier = { name: string; show: React.ReactNode; points: React.ReactNode[]; featured?: boolean };
const TIERS: Tier[] = [
  { name: "Software", show: <Ph>[Show]</Ph>,
    points: [<Ph key="a">[Typical buyers]</Ph>, <Ph key="b">[What we prepare]</Ph>, "Buyers booked before you fly"] },
  { name: "Medical & healthcare", show: <Ph>[RSNA]</Ph>, featured: true,
    points: [<Ph key="a">[Distributors, hospital buyers]</Ph>, <Ph key="b">[Regulatory partners]</Ph>, "Booth ready before you fly"] },
  { name: "Hardware", show: <Ph>[Show]</Ph>,
    points: [<Ph key="a">[Typical buyers]</Ph>, <Ph key="b">[What we prepare]</Ph>, "Every lead followed up"] },
];

export default function Home() {
  return (
    <>
      <a className="skip" href="#inquiry">Skip to the inquiry form</a>
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true"><defs>
        <radialGradient id="cityglow"><stop offset="0" stopColor="#FFF0D0" stopOpacity=".9" /><stop offset=".35" stopColor="#E2C186" stopOpacity=".4" /><stop offset="1" stopColor="#E2C186" stopOpacity="0" /></radialGradient>
      </defs></svg>

      <header className="nav frame">
        <div className="nav-inner">
          <a className="brand" href="#top" aria-label="Beck To Nature, back to top">
            <img className="fig" src="/logo/figure-cream.svg" alt="" width="22" height="27" /><img className="wm" src="/logo/wordmark-cream.svg" alt="" width="67" height="32" />
          </a>
          <nav className="nav-links" aria-label="Sections">
            <a href="#why">Why trade shows</a><a href="#specialties">Specialties</a><a href="#founder">Our founder</a><a href="#inquiry">Inquiry</a><a href="#cases">Case stories</a>
          </nav>
          <a className="btn btn-main btn-sm" href="#inquiry">Start your inquiry</a>
        </div>
      </header>

      <div className="page" id="top">

        {/* the opening flight: hero, the ride across the Atlantic, and the "why" block it lands on */}
        <section className="flight" aria-labelledby="h1">
          <div className="flight-stage">
            <div className="flight-sky">
              <canvas className="flight-map" aria-hidden="true" />
              <div className="flight-veil" aria-hidden="true" />
              <svg className="flight-line" aria-hidden="true">
                <path className="t-glow" /><path className="t-core" /><g className="t-sig" />
                <g className="t-head"><circle r="12" fill="url(#cityglow)" opacity=".7" /></g>
              </svg>
              <div className="flight-hero">
                <h1 id="h1"><span className="l1">Take your products</span> <span className="l2">to America.</span></h1>
              </div>
              <p className="cue" aria-hidden="true">Scroll</p>
              <div className="flight-says" aria-hidden="true">
                <p className="say">One booth.</p><p className="say">One week.</p><p className="say">A clear answer.</p>
              </div>
              <p className="fl-label" data-city="from" aria-hidden="true">Budapest</p>
              <p className="fl-label" data-city="to" aria-hidden="true">Chicago</p>
            </div>
            <div className="flight-land frame" id="why">
              <div className="why2">
                <h2><span>One booth.</span> <span>One week.</span> <span>A clear answer.</span></h2>
                <div className="why2-body">
                  <p className="why2-lead">Put your product in front of American buyers before you commit to America.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* the journey: the sections sit on one wide dark world; the line strays from one to the next and the camera follows it */}
        <div className="journey">
        <div className="journey-stage">
        <div className="world">
        <svg className="thread" aria-hidden="true">
          <path className="t-glow" /><path className="t-core" /><g className="t-end" />
          <g className="t-head"><circle r="12" fill="url(#cityglow)" opacity=".7" /></g>
        </svg>

        <section className="sec frame scene" id="specialties" aria-labelledby="sp-h">
          <div className="sec-head center">
            <h2 id="sp-h">Where we specialize.</h2>
            <p data-r>Three industries where we go deepest.</p>
          </div>
          <div className="trio">
            {TIERS.map((t) => (
              <article key={t.name} className={t.featured ? "tri lead" : "tri"} data-r>
                <div className="tri-head">
                  <h3>{t.name}</h3>
                  {t.featured && <span className="tri-tag">Most experience</span>}
                </div>
                <p className="tri-big">{t.show}</p><p className="tri-small">Usual first show</p>
                <ul>{t.points.map((p, i) => <li key={i}><Check />{p}</li>)}</ul>
                <a className={t.featured ? "btn btn-main" : "btn btn-ghost"} href="#inquiry" data-industry={t.name}>Start your inquiry</a>
              </article>
            ))}
          </div>
        </section>

        <section className="sec frame scene" id="founder" aria-labelledby="fo-h">
          <div className="founder">
            <div className="portrait" data-r role="img" aria-label="Founder photo placeholder"><span>[Founder photo]</span></div>
            <div className="founder-text">
              <h2 id="fo-h">Our founder.</h2>
              <p className="f-name" data-r><Ph>[Founder name]</Ph><span className="f-role">Founder of Beck To Nature</span></p>
              <p className="f-quote" data-r>&ldquo;<Ph>[One sentence from the founder on why Beck To Nature exists.]</Ph>&rdquo;</p>
            </div>
          </div>
          <div className="essay">
            <div data-r><h3>Why</h3><p><Ph>[Why the founder started Beck To Nature.]</Ph></p></div>
            <div data-r><h3>How</h3><p><Ph>[How Beck To Nature works with a client.]</Ph></p></div>
            <div data-r><h3>Experience</h3><p><Ph>[The founder&rsquo;s background, years, shows attended, languages.]</Ph></p></div>
            <div data-r><h3>Mission &amp; vision</h3><p><Ph>[Mission.]</Ph> <Ph>[Vision.]</Ph></p></div>
          </div>
          <div className="promise" data-r>
            <p className="promise-k">What you get</p>
            <p className="promise-t"><Ph>[What clients get from Beck To Nature, in one or two strong sentences.]</Ph></p>
            <div className="f-links"><a href="#founder"><Ph>[LinkedIn]</Ph></a><a href="#founder"><Ph>[Instagram]</Ph></a><a href="#founder"><Ph>[Other link]</Ph></a></div>
            <a className="btn btn-main to-inquiry" href="#inquiry">Work with us <Arrow /></a>
          </div>
        </section>

        <section className="sec frame scene" id="inquiry" aria-labelledby="iq-h">
          <div className="iq">
            <div className="iq-head">
              <h2 id="iq-h">Start your <em>inquiry.</em></h2>
              <p data-r>Six questions. About a minute.</p>
            </div>
            <div data-r><Inquiry /></div>
            <noscript><p className="note" style={{ textAlign: "center", marginTop: 0 }}>The form needs JavaScript. You can also write to us at hello@becktonature.com.</p></noscript>
          </div>
        </section>

        <div className="scene" id="close">
        <section className="sec frame" id="cases" aria-labelledby="cs-h">
          <div className="sec-head"><h2 id="cs-h">Two stories.</h2></div>
          {[0, 1].map((i) => (
            <div className="story" key={i} data-r>
              <p className="story-result"><Ph>[The result, in one line.]</Ph></p>
              <div className="story-facts"><p><Ph>[Company]</Ph> · <Ph>[Industry]</Ph></p><p><Ph>[Which US show]</Ph></p><p className="muted"><Ph>[Where they started, what changed.]</Ph></p></div>
            </div>
          ))}
          <a className="text-cta" href="#inquiry" data-r>Write your own story <Arrow /></a>
        </section>

        <footer className="frame" id="foot">
          <div className="end-sig" role="img" aria-label="Beck signature" />
          <div className="foot" data-r>
            <span>© 2026 Beck To Nature · <Ph>[Hartland, Wisconsin]</Ph> · Budapest · hello@becktonature.com</span>
            <nav aria-label="Legal"><a href="/privacy">Privacy policy</a><a href="/cookies">Cookie notice</a><a href="/terms">Terms</a></nav>
          </div>
        </footer>
        </div>

        </div>
        </div>
        </div>
      </div>

      <div className="spot" aria-hidden="true" />
      <Experience />
    </>
  );
}
