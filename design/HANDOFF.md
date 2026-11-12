# Handoff: where the Beck To Nature site stands

Written so that anyone on the team (with or without Claude) can continue. Update this file whenever you finish a piece of work.

Last updated: 2026-11-12, after the journey rebuild and its zoom and easing revision (see "Latest pass: the journey" below).

## What the site is

Beck To Nature takes Central European manufacturers to US trade shows. It is run by one person, but the site speaks as a company ("we", "our founder"). The company will be a **US-based LLC** (state not confirmed; the drafts use `[Wisconsin]` as a placeholder).

## What is being built right now

The owner asked for the real Next.js site to be built from the approved demo, as a scroll-driven "experience":

1. **Opening flight** (hero + "why"): a pinned stage. The "Beck" signature writes itself, unwinds into the gold line, the line rises to Budapest, the camera zooms in and rides the line across the Atlantic while "One booth. / One week. / A clear answer." appear, then pulls back over America where the "why" block lands. The dotted world map is a canvas; the line is SVG; both share one camera.
2. **The gold line** then runs down the rest of the page, lights each element as it passes (dims again when scrolling back), and ends by writing the signature at the bottom left, joined at the B.
3. **Section choreography** (GSAP ScrollTrigger): headings rise word by word, key sentences light up word by word, specialty cards tip into place, the inquiry form rises into a pool of light.
4. **Inquiry form** is the main call to action: six questions, one at a time. The first question can be answered from the "why" block or a specialty card (`data-industry` links), which drops the visitor into the form at question 2.
5. **Onyx** is the original candle onyx photo (`public/textures/onyx-candle.jpg`), with a bevelled edge and a highlight that follows the pointer and slides as you scroll. A procedural stone texture was tried and the owner asked to go back to the original (it is kept in `design/textures/onyx-stone.jpg`, made by `design/tools/make-onyx-texture.py`).
6. **Legal pages** rewritten for a US LLC.

## Latest pass: the journey (sideways travel, no onyx, less text)

Asked for by the founder after seeing the smoother line: remove the industry buttons under the "why" text, cut the text ("people won't read it"), remove the onyx entirely, add a little more spacing, and turn the whole page into a visual story: the line should not simply run down the page, it should stray, run off the side of the screen, and the site should follow it into the next section, zooming out and in.

- **The journey** (`lib/fx/journey.ts`, replaces `thread.ts` and `scenes.ts`). Below the opening flight the sections are no longer stacked. Each one is placed on a wide "world" (`.journey > .journey-stage > .world`), and one pinned stage looks at it through a camera. Scroll order and placement: specialties (straight below the flight), founder (to the right), inquiry (back to the left), stories + closing signature (left again). `PLACES` at the top of the file sets this.
  - Revised the same day at the founder's request. The first section (specialties) now sits straight under the flight, so the page simply scrolls into it with the line following. Between sections the line darts out of frame, the camera **closes in** on it (fast, then slower), rides it, and **pulls back** slowly as the next section arrives. Sections are placed close together and a faint dot field (the hero map's dots, drawn on `.journey-dots`) lights up along the line, so travel is never an empty screen.
  - **No linear motion.** Everything follows `expoOut` (fast, then slower) or `expoInOut` (slow, fast, slower) from `lib/fx/util.ts`, the flight's camera and text included; CSS uses `--ease`. The one exception is the camera moving down a tall section, which follows the scroll directly, as ordinary scrolling does.
  - The script (`segs`) is a list of stretches of scrolling: on a section, or travelling between two. `PLACES`, `TRAVEL`, `CLOSE_IN`, `PULL_BACK` and `zoom` at the top of the file tune it.
  - A section's parts come in as the camera arrives (`data-r` in `app/page.tsx`; headings rise word by word). No ScrollTrigger is used any more; GSAP remains for the flight only.
  - Menu links, the buttons that lead to the inquiry, and keyboard focus are mapped to scroll positions with `journey.whereIs()`.
  - Without motion ("reduce motion", or no JavaScript) the sections stack as a plain page, as before, with the closing signature written.
  - The line is still built with `tangentPath`; tightest bend about 100px on a 1440px screen, 63px on a phone.
- **Onyx removed everywhere.** Main buttons are flat cream, the check marks cream, the featured Medical card is a lighter graphite with a cream outline. `public/textures/onyx-candle.jpg` is deleted (copies remain under `design/`).
- **Text cut.** "Why" is now the three statements and one sentence; the four industry buttons under it are gone. Specialties intro is one short sentence; the card caption is "Usual first show".
- **Spacing** a step larger (`--sec`, `--head`, card padding and gaps).
- Not checked: real phones and Safari (as before), and typing in the form on a phone with the on-screen keyboard open, which matters more now that the sections sit inside a pinned stage.

## Earlier pass: declutter, spacing, smoother line

Asked for by the founder: rework the spacing, remove the "AI clutter", and make the line's path smooth, with no sharp turns.

- **The line** is no longer drawn through hand-placed points. Both lines are now built from tangents (`tangentPath` in `lib/fx/util.ts`): a few points the line passes through heading in a set direction, joined by long curves.
  - Flight: out of the hero signature it runs east and turns up into the Budapest-Chicago route on one wide arc; after Chicago it keeps turning the same way until it points straight down and leaves the stage (so it now exits further left than before).
  - Page (since replaced by the journey, above): through the featured card, down the right of the founder's texts, behind the form, between a story and its facts, then one wide turn, a run **under** the closing signature and a quarter turn up into the B.
  - Tightest bend, measured in Chromium: about 200px radius in the flight and 100px at the closing signature on a 1440px screen (it was 15px); 64px on a phone.
- **Spacing**: one rhythm. `--sec` is the space between sections, `--head` the space between a section's heading and its content; other gaps are on a 4px grid.
- **Clutter removed**: outer glows (buttons, stone card, form, lit headings, dial needle, map), drop shadows and gradients on cards, the pool of light behind the form, the boxes around placeholders (they are now plain grey text in brackets), the icons and divider on the specialty cards ("Most experience" is plain text beside the card name), the looping "Scroll" tick, the floating pill around the navigation (now a plain bar on a soft dark scrim), and italics everywhere except "to America." and "inquiry." (the standing decision).
- **Motion** is down to three moves: headings rise word by word, blocks ease up, the founder's two key sentences light up. The cards no longer tip in 3D, the portrait no longer wipes and drifts, the form no longer scales. The cursor spotlight now shows over the hero map only.
- Kept at that point: the onyx and the line lighting content as it passes (both removed in the journey pass), the fine stroke with a subtle glow.
- `design/preview/` was re-recorded after this pass.

## Status

| Piece | State |
|---|---|
| `npm run build` | Passes |
| Opening flight, start to landing | Checked on desktop (1440x900) and phone (iPhone 13 size) |
| Line down the page, closing signature | Checked on desktop and phone |
| Section choreography | Checked on desktop and phone (screenshots at rest; not reviewed frame by frame) |
| Inquiry form | Checked end to end on desktop and phone: validation messages, the dial by mouse and by touch, the map, the list, both server calls, the "sent" and "could not send" results |
| `/api/inquiry` | Works; needs an email provider key to actually send (see below). Sending a real email has **not** been tested |
| Reduced-motion version, and the page without JavaScript | Checked: complete, still pages (the form itself needs JavaScript; a note gives the email address) |
| Sideways scrolling on phone | None, including on the dial step |
| Legal pages, US LLC wording | Written; need a lawyer's review |
| Real phones and Safari | **Not checked.** Everything above was checked in Chromium, including the phone size |
| Demo's contract templates and policy copies, US LLC wording | Regenerated in `design/demo/`; need a lawyer's review |

## Still to do

1. Try the site on a real iPhone (Safari) and an Android phone, and in desktop Safari and Firefox. Things to watch: the pinned opening on iOS when the address bar hides, and smoothness of the map while zoomed.
2. Connect an email provider and send one real inquiry.
3. Watch the whole scroll once on a slower laptop; if the zoomed map stutters, lower `Z` (zoom) in `lib/fx/flight.ts`.
4. Contract templates: done for a US LLC (see "Legal"). To regenerate after editing the site's legal pages: `npm run build`, then `python3 design/tools/demo-build/legal_build.py` (needs pandoc).
5. Record a short video of the scroll for the owner, and send screenshots.
6. Owner decisions listed under "Open questions".

## How it is put together

- `app/page.tsx`: all page content (server-rendered). Placeholders the owners must fill in are wrapped in `<Ph>[...]</Ph>`.
- `app/globals.css`: all styles. `html.fx` (set before first paint by a small script in `app/layout.tsx`) switches the scroll experience on; without it (no JavaScript, or "reduce motion") every section reads as a plain page.
- `components/Experience.tsx`: the driver. One animation loop eases the flight's progress and the journey's progress after the scroll (faster when you scroll faster) and hands over between them so the line is one unbroken stroke.
- `lib/fx/flight.ts`: the opening flight (canvas map, camera, line, timeline of the text).
- `lib/fx/journey.ts`: everything below the flight: where the sections sit on the world, the line's route, the camera script and the closing signature. The route is a short list of knots (point + direction) tied to the sections, so it survives layout changes.
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

- Black tones with brass and cream; EB Garamond. **No onyx** (the founder asked for it to be removed entirely, 2026-11-12).
- Short text. If a block needs more than a sentence or two, cut it.
- Company voice: "we", "our founder". Never "I" or "my".
- Do not claim "we'll be at your booth".
- Every section leads to the inquiry (but no row of industry buttons under the "why" text). No pricing, FAQ, logo strip or testimonials.
- Specialties: Medical & healthcare (featured, middle), Software, Hardware, as three tier cards.
- Order: hero, why, specialties, founder, inquiry, stories, footer.
- The gold line: starts from the hero signature; smooth, no loops, no sharp turns (keep every bend wide; measure after changing the route); it strays across the page, runs off the side of the screen and the site follows it to the next section; may pass behind text and under cards; does **not** wrap around the inquiry card; no signature in the founder section; ends by writing the closing signature bottom left; follows faster when you scroll faster; fine stroke with a subtle glow.
- Hero: dotted world map with routes; dots light up near the cursor; a 320px cursor spotlight on desktop (hero only).
- Inquiry form: plain dark card (no glow), choice cards with a title, a muted subtitle and a corner circle that becomes a cream check.
- Readability: body text 18px or more, light greys; italic accent word only in "to America." and "inquiry.".
- Motion: never linear. Fast then slower going in; slow, fast, slower coming out. Travel between sections zooms in on the line and out onto the next section, with no long empty stretch.
- No decoration for its own sake: no glows, drop shadows, gradients on cards, icons on cards or boxed labels. The map and the line are the only rich elements.
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

Contract templates (mutual and one-way NDA, master services agreement, EU and US data processing addenda, advisor agreement, offer letter, HIPAA BAA) exist only in `design/demo/*.html`, not on the public site. They name `[Beck To Nature LLC]`, a `[Wisconsin]` limited liability company, and use that state for governing law where the template had Delaware. Each page opens with notes on how the company would use it and what to settle first. The important ones:

- **Master services agreement:** the template is written for software subscriptions. Its software clauses must be replaced with a services scope before it is usable; fees, expenses, VAT and currency need adding.
- **Advisor agreement:** assumes a corporation with stock options and a board. An LLC has neither.
- **Offer letter:** California only. Anyone working for the LLC from Hungary raises Hungarian employment and tax questions.
- **EU data processing addendum:** as a US company the LLC is the "data importer"; keep the standard contractual clauses.

## Preview

`design/preview/` holds two screen recordings of the scroll (desktop and phone, recorded in Chromium on 2026-11-12, after the declutter pass) and six stills. They show the site as of that date; re-record after visible changes with `node design/tools/record-preview.js` (start the built site on port 3210 first; needs Playwright and ffmpeg).

## Other things made for the owner

- Demo (older single-file prototype, now behind the real site): https://claude.ai/artifact/E6QCw4FMUY33dcEV54bAUr ; source in `design/demo/`, build scripts in `design/tools/demo-build/` (paths inside them point at a temporary folder and need adjusting).
- Colour palette: https://claude.ai/artifact/KJGhgzRzGpd11zGFQhdCN2 ; copy in `design/colour-palette.html`.
- Business card (two directions): https://claude.ai/artifact/KNRBhoRagiCDzPjTPgdg5d
- These links are private to the owner's Claude account; the copies in `design/` are what the team shares.
- `design/tools/make-onyx-texture.py`: makes the procedural stone texture that was tried and set aside (`python3 make-onyx-texture.py 23 out.png`; needs numpy and Pillow). The site uses the original candle onyx photo.

## Open questions for the owner

- Hosting: Vercel was recommended (paid Pro plan for a business; Frankfurt region). Not set up.
- Email provider for inquiries: Resend is wired in; needs an account and a verified domain.
- Texts: no SMS provider is connected. The form records consent; any texts would be sent by hand until one is.
- Founder texts, photo, the two case stories, the show names on the specialty cards: all still placeholders.
