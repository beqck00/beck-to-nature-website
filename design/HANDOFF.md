# Handoff: where the Beck To Nature site stands

Written so that anyone on the team (with or without Claude) can continue. Update this file whenever you finish a piece of work.

Last updated: 2026-11-12, part-way through the rebuild described below.

## What the site is

Beck To Nature takes Central European manufacturers to US trade shows. It is run by one person, but the site speaks as a company ("we", "our founder"). The company will be a **US-based LLC** (state not confirmed; the drafts use `[Wisconsin]` as a placeholder).

## What is being built right now

The owner asked for the real Next.js site to be built from the approved demo, as a scroll-driven "experience":

1. **Opening flight** (hero + "why"): a pinned stage. The "Beck" signature writes itself, unwinds into the gold line, the line rises to Budapest, the camera zooms in and rides the line across the Atlantic while "One booth. / One week. / A clear answer." appear, then pulls back over America where the "why" block lands. The dotted world map is a canvas; the line is SVG; both share one camera.
2. **The gold line** then runs down the rest of the page, lights each element as it passes (dims again when scrolling back), and ends by writing the signature at the bottom left, joined at the B.
3. **Section choreography** (GSAP ScrollTrigger): headings rise word by word, key sentences light up word by word, specialty cards tip into place, the inquiry form rises into a pool of light.
4. **Inquiry form** is the main call to action: six questions, one at a time. The first question can be answered from the "why" block or a specialty card (`data-industry` links), which drops the visitor into the form at question 2.
5. **Onyx** is a new, more stone-like procedural texture (`public/textures/onyx.webp`), with a bevelled edge and a highlight that follows the pointer and slides as you scroll.
6. **Legal pages** rewritten for a US LLC.

## Status

| Piece | State |
|---|---|
| `npm run build` | Passes |
| Hero at rest (map, routes, headline, signature) | Works, checked on desktop |
| Flight: zoom in at Budapest, first statement | Works, checked on desktop |
| Rest of the flight (statements 2-3, arrival, landing block) | Written, **not yet checked** |
| Phone layout of the flight (map as a band at the bottom) | Written, **not yet checked** |
| Line down the page, closing signature | Written (ported from the demo), **not yet checked** in the new site |
| Section choreography | Written, **not yet checked** |
| Inquiry form (React) | Written, **not yet checked** end to end |
| `/api/inquiry` | Written; needs an email provider key to actually send (see below) |
| Legal pages, US LLC wording | Written; need a lawyer's review |
| Reduced-motion version | Written, **not yet checked** |
| Demo's contract templates updated for a US LLC | **Not done** (see "Still to do") |
| README and CLAUDE.md updated | Done in the same commit as this file |

## Still to do

1. Check every "not yet checked" row above on desktop (1440x900) and phone (390x844): scroll through, fix what is off. `design/tools/screenshots.js` takes screenshots at chosen scroll positions (needs Playwright and the site running on port 3210).
2. Check the form end to end: all six steps, validation messages, the month dial by mouse and touch, the country map, the "sent" and "could not send" results.
3. Check there is no sideways scrolling on phone at any step (the month dial once caused this; its ruler is now clipped).
4. Update the eight contract templates in the demo for a US LLC (`design/tools/demo-build/legal_build.py` builds them; see "Legal" below), and regenerate `design/demo/*.html`.
5. Record a short video of the scroll for the owner, and send screenshots.
6. Owner decisions listed under "Open questions".

## How it is put together

- `app/page.tsx`: all page content (server-rendered). Placeholders the owners must fill in are wrapped in `<Ph>[...]</Ph>`.
- `app/globals.css`: all styles. `html.fx` (set before first paint by a small script in `app/layout.tsx`) switches the scroll experience on; without it (no JavaScript, or "reduce motion") every section reads as a plain page.
- `components/Experience.tsx`: the driver. One animation loop eases the flight's progress and the line's length after the scroll (faster when you scroll faster) and hands over between them so the line is one unbroken stroke.
- `lib/fx/flight.ts`: the opening flight (canvas map, camera, line, timeline of the text).
- `lib/fx/thread.ts`: the line below the flight and the closing signature. The desktop route is the one the owner drew on a screenshot; it is pinned to the featured card, the founder's quote and the closing signature so it survives layout changes. Phones get wide S-curves.
- `lib/fx/scenes.ts`: ScrollTrigger animations for the sections.
- `components/Inquiry.tsx`, `lib/dial.ts`, `lib/inquiry.ts`: the form, the month dial, the questions and the data shape.
- `app/api/inquiry/route.ts`, `lib/send-inquiry.ts`: receives an inquiry and emails it through Resend's HTTP API.
- `lib/data/`: the dotted world map, the Europe outlines for the form, the signature strokes.
- `app/privacy`, `app/cookies`, `app/terms`, `components/LegalPage.tsx`: legal pages.

### Email for inquiries

Set these environment variables on the host (never commit them):

- `RESEND_API_KEY`: an API key from resend.com
- `INQUIRY_FROM`: a sender on a domain verified in Resend, e.g. `Beck To Nature <inquiries@becktonature.com>`
- `INQUIRY_TO`: optional; defaults to `hello@becktonature.com`

Without them the form still works, but at the end it tells the visitor it could not send and offers to open their email app with the answers filled in. Contact details are also sent when the visitor continues past question 2 (the form says so), so the team can follow up on unfinished inquiries. To use another email provider, replace `lib/send-inquiry.ts`.

### What was removed

The old light design, and with it the AI "readiness check" (`app/api/readiness`, `components/ReadinessCheck.tsx`, the Anthropic SDK dependency). The approved demo does not have it. It is in git history before this rebuild if it is wanted again.

## The owner's standing decisions

- Black tones with brass and cream; EB Garamond; the onyx stone used sparingly: main buttons, the selected-answer check mark, the featured Medical card.
- Company voice: "we", "our founder". Never "I" or "my".
- Do not claim "we'll be at your booth".
- Every section leads to the inquiry. No pricing, FAQ, logo strip or testimonials.
- Specialties: Medical & healthcare (featured, middle), Software, Hardware, as three tier cards.
- Order: hero, why, specialties, founder, inquiry, stories, footer.
- The gold line: starts from the hero signature; smooth, slow, no loops, no sharp turns; may pass behind text and under cards; does **not** wrap around the inquiry card; no signature in the founder section; ends by writing the closing signature bottom left; lights content as it passes; follows faster when you scroll faster; fine stroke with a subtle glow.
- Hero: dotted world map with routes; dots light up near the cursor; a 320px cursor spotlight on desktop.
- Inquiry form: plain dark card (no onyx background, no glow), choice cards with a title, a muted subtitle and a corner circle that becomes an onyx check.
- Readability: body text 18px or more, light greys; italic accent word only in "to America." and "inquiry.".
- Earlier feedback to respect: keep things uncluttered; phone hero has equal space above and below the title.

## Legal

The three website pages are adapted from General Legal's CC0 templates (the `legal-templates` skill in `.claude/skills/`). They are drafts, not legal advice. **A lawyer must review them before launch.** Points for the lawyer:

1. Legal name, state of formation and registered address of the LLC.
2. Whether anyone working from Hungary makes the LLC "established" in the EU (it changes the GDPR section), and whether an EU/UK representative under Article 27 GDPR is needed.
3. Whether the company is certified under the EU-US Data Privacy Framework; which transfer safeguard applies to each provider.
4. Text messages: the consent wording on the form and in the privacy policy follows US practice (unticked box, STOP/HELP, "not a condition"); confirm it with the SMS provider before sending any texts.
5. Terms: governing state and county; whether to add the template's arbitration clause with jury-trial and class-action waivers (left out).
6. Which US state privacy laws apply at the company's size.
7. Retention periods, hosting provider, email providers (placeholders in the privacy policy).

Contract templates (mutual and one-way NDA, master services agreement, EU and US data processing addenda, advisor agreement, offer letter, HIPAA BAA) exist only in the demo (`design/demo/*.html`), not on the public site. They still say "Hungarian Kft." in places and need the US LLC update. Notes to add when updating: the services agreement template is written for software subscriptions and needs a services scope; the advisor agreement assumes a corporation with stock options (an LLC has neither); the offer letter is California-only.

## Other things made for the owner

- Demo (older single-file prototype, now behind the real site): https://claude.ai/artifact/E6QCw4FMUY33dcEV54bAUr ; source in `design/demo/`, build scripts in `design/tools/demo-build/` (paths inside them point at a temporary folder and need adjusting).
- Colour palette: https://claude.ai/artifact/KJGhgzRzGpd11zGFQhdCN2 ; copy in `design/colour-palette.html`.
- Business card (two directions): https://claude.ai/artifact/KNRBhoRagiCDzPjTPgdg5d
- These links are private to the owner's Claude account; the copies in `design/` are what the team shares.
- `design/tools/make-onyx-texture.py`: regenerates the stone texture (`python3 make-onyx-texture.py 23 out.png`; needs numpy and Pillow). Seed 23 is the one in use.

## Open questions for the owner

- Hosting: Vercel was recommended (paid Pro plan for a business; Frankfurt region). Not set up.
- Email provider for inquiries: Resend is wired in; needs an account and a verified domain.
- Texts: no SMS provider is connected. The form records consent; any texts would be sent by hand until one is.
- Founder texts, photo, the two case stories, the show names on the specialty cards: all still placeholders.
