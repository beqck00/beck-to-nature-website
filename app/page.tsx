import Experience from "@/components/Experience";
import Inquiry from "@/components/Inquiry";
import { Ph } from "@/components/Ph";
import { at } from "@/lib/base";

const Arrow = () => <svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
// What Ildi brings, one row each: the area, and the proof (from her own account of her work).
const DEPTH: [string, string][] = [
  ["Medical technology and pharma", "Eleven years at GE HealthCare, first in Wisconsin, then in global roles."],
  ["AI and medical software", "Led an AI program that outlines organs on CT scans for radiotherapy, and supported its FDA 510(k) preparation. Built and led a 26-person data team."],
  ["Regulated consumer products", "Took a crib mattress through US lab testing, labelling and annual registrations, and kept it compliant."],
  ["Trade shows and buyers", "Booths, buyer meetings and follow-up at CES, ABC Kids Expo and shows of more than 35,000 people."],
];

// Her record, as short facts. Client names are as she gave them; confirm each one may be named before launch.
const STORIES: { result: string; who: string; show: string; what: string }[] = [
  { result: "A Hungarian crib mattress, sold in the US under a Los Angeles brand.", who: "Natural coconut-fibre crib mattresses · Hungary, then Slovenia", show: "ABC Kids Expo, Las Vegas and Nashville; New York; Atlanta",
    what: "Online sales first, then a private-label deal with a Los Angeles crib maker and container shipments from Slovenia. US testing, labelling and registrations throughout." },
  { result: "A Hungarian medtech startup in front of buyers at CES.", who: "Heartbit · Medical technology", show: "CES, Las Vegas",
    what: "Prepared the show, the marketing and the meetings with buyers at the booth." },
  { result: "Two Hungarian baby brands tested on the US market.", who: "Bebeyo and Nosiboo · Baby products", show: "ABC Kids Expo, Las Vegas",
    what: "Showed Bebeyo’s first version on the Beck To Nature booth to gauge US interest, and helped Nosiboo run its own booth." },
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
            <img className="fig" src={at("/logo/figure-cream.svg")} alt="" width="22" height="27" /><img className="wm" src={at("/logo/wordmark-cream.svg")} alt="" width="67" height="32" />
          </a>
          <nav className="nav-links" aria-label="Sections">
            <a href="#why">Why trade shows</a><a href="#ildi">Ildi Beck</a><a href="#expertise">Expertise</a><a href="#inquiry">Inquiry</a><a href="#cases">Track record</a>
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
        <canvas className="journey-dots" aria-hidden="true" />
        <div className="world">
        <svg className="thread" aria-hidden="true">
          <path className="t-glow" /><path className="t-core" /><g className="t-end" />
          <g className="t-head"><circle r="12" fill="url(#cityglow)" opacity=".7" /></g>
        </svg>

        <section className="sec frame scene" id="ildi" aria-labelledby="il-h">
          <div className="sec-head">
            <h2 id="il-h">Dr. Ildikó Beck.</h2>
            <p data-r>Twenty years of taking regulated products to new markets, eleven of them at GE HealthCare.</p>
          </div>
          <div className="ildi">
            <div className="portrait" data-r role="img" aria-label="Photo of Ildikó Beck (placeholder)"><span>[Photo of Ildi]</span></div>
            <dl className="facts" data-r>
              <div><dt>Role</dt><dd>Founder and managing director, Beck To Nature</dd></div>
              <div><dt>In the US market</dt><dd>Since 2004</dd></div>
              <div><dt>GE HealthCare</dt><dd>11 years, in Wisconsin and in global roles</dd></div>
              <div><dt>Education</dt><dd>PhD in chemical engineering, Budapest University of Technology</dd></div>
              <div><dt>Citizenship</dt><dd>American</dd></div>
              <div><dt>AmCham Hungary</dt><dd>Board member, 2018 to 2022</dd></div>
            </dl>
          </div>
        </section>

        <section className="sec frame scene" id="expertise" aria-labelledby="ex-h">
          <div className="sec-head"><h2 id="ex-h">Where she goes deepest.</h2></div>
          <ul className="rows">
            {DEPTH.map(([area, proof]) => <li key={area} data-r><h3>{area}</h3><p>{proof}</p></li>)}
          </ul>
          <p className="method" data-r>She opens doors from nothing: trade shows, industry associations and universities. Then she follows every lead.</p>
          <a className="btn btn-main to-inquiry" href="#inquiry" data-r>Work with Ildi <Arrow /></a>
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
          <div className="sec-head"><h2 id="cs-h">Selected engagements.</h2></div>
          {STORIES.map((st) => (
            <div className="story" key={st.who} data-r>
              <p className="story-result">{st.result}</p>
              <div className="story-facts"><p>{st.who}</p><p>{st.show}</p><p className="muted">{st.what}</p></div>
            </div>
          ))}
          <a className="text-cta" href="#inquiry" data-r>Write your own story <Arrow /></a>
        </section>

        <footer className="frame" id="foot">
          <div className="end-sig" role="img" aria-label="Beck signature" />
          <div className="foot" data-r>
            <span>© 2026 Beck To Nature LLC · Wake Forest, North Carolina · hello@becktonature.com</span>
            <nav aria-label="Legal"><a href={at("/privacy")}>Privacy policy</a><a href={at("/cookies")}>Cookie notice</a><a href={at("/terms")}>Terms</a></nav>
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
