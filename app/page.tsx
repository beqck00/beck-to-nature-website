import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";
import PhotoSlot from "@/components/PhotoSlot";
import Faq from "@/components/Faq";
import CopyButton from "@/components/CopyButton";
import ReadinessCheck from "@/components/ReadinessCheck";
import { LEGAL_LINKS } from "@/components/LegalPage";

const SERVICES = [
  { h: "Trade show entry", p: "We choose the US show where your buyers actually are, and handle booth space, design, shipping and on-site logistics.", incl: "Show selection · booth partners · freight and customs" },
  { h: "Buyer and distributor meetings", p: "We research and invite distributors, purchasing groups and end users before the show, and we join the meetings with you.", incl: "Target lists · pre-booked meetings · briefing notes" },
  { h: "Follow-up and US representation", p: "Most deals close in the weeks after a show. On a monthly basis we follow up every lead and represent you in US business hours.", incl: "Lead follow-up · US-hours calls · monthly report" },
  { h: "Market groundwork", p: "We coordinate the specialists you need in the US, from regulatory consultants to company setup, so you have one point of contact.", incl: "Regulatory partners · US entity guidance · pricing" },
];

const PROCESS = [
  { h: "Assess", p: "We review your product and certifications and tell you honestly whether the US makes sense now." },
  { h: "Choose the show", p: "One show, chosen for where your buyers are." },
  { h: "Prepare", p: "Booth, freight, US-ready materials and a calendar of meetings." },
  { h: "At the show", p: "We are at the booth and in every meeting with you." },
  { h: "Follow up", p: "We turn conversations into distributors and first orders." },
];

const FAQ = [
  { q: "Do you handle FDA approval?", a: "We don't file regulatory submissions ourselves. We work with specialist US regulatory consultants and plan your trade-show presence around where you are in the process. Many companies exhibit before clearance, with clear labelling that the product is not yet for sale in the US." },
  { q: "Which trade shows do you work with?", a: "The one where your buyers are. For radiology and imaging that is usually RSNA in Chicago. For other industries we pick from the major US shows in your sector, based on who attends." },
  { q: "How is pricing structured?", a: "A fixed fee for each trade show, an optional monthly retainer for follow-up, and, where it makes sense, a success fee on deals from our leads. You get a written quote after the first call. The figures in the readiness check are indicative only." },
  { q: "Do we need a US company before the first show?", a: "Usually not. Most companies exhibit first and set up a US entity once there is real demand. We tell you when it is worth doing." },
];

const Ph = ({ children }: { children: React.ReactNode }) => <span className="ph">{children}</span>;

export default function Home() {
  return (
    <>
      <Nav />
      <main id="top">
        <section className="hero">
          <div className="wrap">
            <Reveal className="hero-center">
              <p className="kicker">Beck To Nature</p>
              <h1>Take your products to America.</h1>
              <p className="lede">We did it ourselves first, bringing our own products from Hungary to US customers. Now we help Central European manufacturers do the same, starting with the right US trade show.</p>
              <div className="hero-ctas">
                <a className="btn btn-green" href="#contact">Book a free call</a>
                <a className="more" href="#check">Check your US readiness</a>
              </div>
            </Reveal>
          </div>
          <div className="wrap hero-check" id="check">
            <Reveal className="head" delay={0.08}>
              <h2>Is your company ready for the US?</h2>
              <p className="lede">Six short questions, about a minute. You get the US trade shows that fit, what is missing, and an indicative budget.</p>
            </Reveal>
            <ReadinessCheck />
          </div>
          <div className="wrap">
            <Reveal delay={0.12}>
              <PhotoSlot className="hero-photo" title="Main photo" hint="The founders at a US trade show, or a real booth from a past show." />
            </Reveal>
            <div className="facts">
              <span>Family-owned, Hungarian–American</span>
              <span>Budapest and <Ph>[Wisconsin]</Ph></span>
              <span>Member of <Ph>[AmCham Hungary]</Ph></span>
            </div>
          </div>
        </section>

        <section id="story" className="alt">
          <div className="wrap">
            <Reveal className="head"><h2>We started with our own products.</h2></Reveal>
            <div className="story">
              <Reveal className="story-text">
                <p>Beck To Nature started with one product: an all-natural crib mattress made in Hungary. To sell it in the United States we had to learn everything ourselves: US safety rules, distributors, trade shows, shipping and American customers.</p>
                <p>Over the following years we brought more natural, non-toxic furniture and mattresses from Hungary to the US. The family behind the company combines a Ph.D. in chemical engineering with <Ph>[years]</Ph> of engineering and sourcing work between Europe and America.</p>
                <p>Today we offer that same route across the Atlantic to other manufacturers who want to sell in America. Same family, same values, and the experience of having done it ourselves.</p>
                <ol className="timeline">
                  <li><span className="yr"><Ph>[Year]</Ph></span><span>Beck To Nature founded, first natural crib mattress sold in the US</span></li>
                  <li><span className="yr"><Ph>[Year]</Ph></span><span>The range grows to eco-friendly furniture and mattresses from Hungary</span></li>
                  <li><span className="yr">2026</span><span>Beck To Nature opens its US market-entry service to other European companies</span></li>
                </ol>
              </Reveal>
              <Reveal delay={0.1}>
                <PhotoSlot title="Story photo" hint="An original Beck To Nature product, its packaging, or an early trade-show photo." />
              </Reveal>
            </div>
          </div>
        </section>

        <section id="services">
          <div className="wrap">
            <Reveal className="head">
              <h2>Everything you need to sell in the US.</h2>
              <p className="lede">From choosing the right trade show to your first American order.</p>
            </Reveal>
            <div className="services">
              {SERVICES.map((s, i) => (
                <Reveal key={s.h} className="svc" delay={(i % 2) * 0.08}>
                  <h3>{s.h}</h3>
                  <p>{s.p}</p>
                  <p className="incl">{s.incl}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="alt" id="process">
          <div className="wrap">
            <Reveal className="head">
              <h2>One show at a time.</h2>
              <p className="lede">A trade show is the safest way to test the US market before you commit to a full launch.</p>
            </Reveal>
            <div className="process">
              {PROCESS.map((s, i) => (
                <Reveal key={s.h} delay={i * 0.06}>
                  <b aria-label={`Step ${i + 1}`}>{i + 1}</b>
                  <h3>{s.h}</h3>
                  <p>{s.p}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="team" className="alt">
          <div className="wrap">
            <Reveal className="head">
              <h2>The family behind Beck To Nature</h2>
              <p className="lede">You work directly with the founder, who will be at your booth. Text in <Ph>[brackets]</Ph> is still to be filled in.</p>
            </Reveal>
            <div className="team">
              <Reveal>
                <article className="founder">
                  <PhotoSlot title="Founder photo" hint="A real, recent portrait. Natural light works best." icon={false} allowVideo={false} />
                  <div>
                    <h3 style={{ fontSize: "1.55rem", letterSpacing: "-.022em" }}><Ph>[Dr. Ildikó Beck]</Ph></h3>
                    <p className="role">Founder &amp; Managing Director</p>
                    <p className="quote">“<Ph>[One sentence in her own words about why she helps European companies reach America.]</Ph>”</p>
                    <p className="bio">A chemical engineer with a Ph.D., <Ph>[she]</Ph> co-founded Beck To Nature and spent <Ph>[X years]</Ph> bringing Hungarian products to American customers. <Ph>[Add engineering and sourcing experience, e.g. at General Electric.]</Ph></p>
                    <ul className="creds">
                      <li>Ph.D. in chemical engineering</li>
                      <li>Co-founder, Beck To Nature</li>
                      <li><Ph>[Engineering and sourcing, General Electric]</Ph></li>
                      <li>Hungarian and English</li>
                    </ul>
                  </div>
                </article>
              </Reveal>
            </div>
          </div>
        </section>

        <section id="faq">
          <div className="wrap">
            <Reveal className="head"><h2>Questions, answered.</h2></Reveal>
            <Faq items={FAQ} />
          </div>
        </section>

        <section id="contact" className="alt">
          <div className="wrap contact">
            <Reveal className="head" >
              <h2>Let&apos;s talk about your US plans</h2>
              <p className="lede">A free 30-minute call. You&apos;ll get an honest view on whether the US is the right next step, and which show to start with.</p>
            </Reveal>
            <Reveal className="lines" delay={0.08}>
              <div className="line"><div><span className="k">Email</span><b id="email">hello@becktonature.com</b></div><CopyButton targetId="email" /></div>
              <div className="line"><div><span className="k">Phone, Budapest</span><b id="phone"><Ph>[+36 …]</Ph></b></div><CopyButton targetId="phone" /></div>
              <div className="line"><div><span className="k">US office</span><b><Ph>[Hartland, Wisconsin]</Ph></b></div></div>
            </Reveal>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap foot">
          <a className="foot-logo" href="#top" aria-label="Beck To Nature, back to top">
            <img className="mark-foot" src="/logo/beck-to-nature-icon.svg" alt="" />
            <img className="wordmark-foot" src="/logo/beck-to-nature-wordmark.svg" alt="" />
          </a>
          <div className="foot-meta">
            <span>© 2026 Beck To Nature · Budapest · <Ph>[Hartland, Wisconsin]</Ph></span>
            <span>Draft. Photo buttons only preview on your screen; nothing is uploaded.</span>
            <nav className="foot-links" aria-label="Legal">
              {LEGAL_LINKS.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}
            </nav>
          </div>
        </div>
      </footer>
    </>
  );
}
